# Standalone Excel Anonymizer — technical notes

`toolkit/standalone-tools/sheets-anonymizer.html` is a single, self-contained HTML file that
anonymizes, pseudonymizes and encrypts spreadsheet data **entirely inside the browser**.
It is part of the Data Anonymization Toolkit.

---

## 1. Running locally and offline

1. Copy `sheets-anonymizer.html` anywhere (USB stick included).
2. Double-click it, or open it with any modern browser (Chrome, Edge, Firefox, Safari —
   versions from ~2020 onward, i.e. with the Web Crypto API available).
3. That is all. **No internet connection, no web server, no backend, no account, no API key
   are required or used.**

Notes:

- The file also works when served over `http://localhost` if you prefer a local server
  (e.g. `python -m http.server`); `file://` is supported directly.
- A Content-Security-Policy `<meta>` tag is embedded in the page:
  `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; object-src 'none'; …`
  It blocks any attempt by the page (or by an injected script) to reach the network.
- Verified: with the browser forced into *offline* network mode the application loads and
  processes files normally; `performance.getEntriesByType('resource')` is empty (zero
  subresource requests of any kind).

---

## 2. Technical summary of the changes

### 2.1 External dependencies removed

| Before (CDN) | After |
|---|---|
| `cdn.tailwindcss.com` (runtime JIT) | Tailwind CSS v3.4 compiled subset (~16 KB, preflight + used utilities) embedded in a `<style>` block |
| `cdnjs …/xlsx.full.min.js` 0.18.5 | Same SheetJS 0.18.5 build embedded inline in a `<script>` block |
| `cdnjs …/crypto-js.min.js` 4.1.1 | **Removed** — replaced by the browser's native Web Crypto API |

The delivered file is one HTML document (~1.0 MB) with zero external URLs that are ever
requested. There is no analytics, telemetry, tracking, remote font, `fetch()`,
`XMLHttpRequest`, `sendBeacon`, `localStorage`, `sessionStorage` or cookie usage.

Rebuilding the embedded CSS after editing the markup (maintainers):

```bash
npx tailwindcss@3.4.17 -c tailwind.config.js -i input.css -o output.css --minify
# content: ['./shell.html', './app.js']  (scan every file that contains class names)
```

### 2.2 Encryption: CryptoJS → Web Crypto API

- **AES-256-GCM** (authenticated) via `crypto.subtle.encrypt/decrypt`.
- **PBKDF2-HMAC-SHA-256**, **600 000 iterations** (OWASP recommendation) derives a
  non-extractable `CryptoKey` from the password — once per processing operation.
- **16-byte cryptographically random salt per operation**, **12-byte unique random IV per
  value**, both from `crypto.getRandomValues()`.
- Versioned, spreadsheet-safe value format (base64url, no padding, dot-separated):

  ```
  ENCv1.<salt-b64url>.<iv-b64url>.<ciphertext+b64url>
  ```

  The plaintext of each value is a typed JSON payload `["s"|"n"|"b"|"d", value]`, so a
  successful decryption **restores the original type** (number, boolean, date, string).
- **Password verification is automatic**: GCM authentication fails on a wrong password or
  on any modification of the ciphertext. The operation aborts with a clear error message
  and *no corrupted output is produced or exportable*.
- Passwords are held only in the password input during the operation, are **cleared after
  every run (success or failure)**, never stored (no storage/cookies), never logged
  (the application contains no `console.*` calls at all).
- If `crypto.subtle` is unavailable (insecure context/old browser), the encryption method
  is disabled with an explicit explanation — there is **no fallback to weaker crypto**.
- **Legacy `ENC::` values (previous CryptoJS version)** are *recognized but never
  decrypted*: de-anonymization reports them (warning + per-column badge + stats) and
  leaves them untouched; re-encrypting skips them (no double encryption). Decrypting them
  requires the previous application version — this is stated in the UI and below.

### 2.3 Pseudonymization

- `Math.random()` removed everywhere; all identifiers come from `crypto.getRandomValues()`.
- Consistent mapping scoped to **worksheet + column + session**: equal values in the same
  column always get the same pseudonym in one run, different values get different ones;
  random tokens are collision-checked before use.
- Identifier formats selectable: sequential `ID_000001` or random token `ID_A7K2M9XQ4Z`
  (12-char unambiguous alphabet, unbiased 256/32 mapping).
- The mapping lives in an in-memory `Map` only: never persisted, cleared on reset, on
  format change and when the tab is closed. No de-anonymization mapping is exported.
- The UI states explicitly that pseudonymization is **not** anonymization.

### 2.4 Spreadsheet handling

- **All worksheets** are detected, listed with row/column counts, individually selectable
  (“select all” included); **nothing is discarded silently** — deselected sheets are copied
  through unchanged and shown as “left unchanged” in the summary.
- Rows are read as a **matrix (array of arrays)** instead of JSON objects: column indexes
  are preserved, so **blank and duplicate headers never lose columns**
  (displayed as `Colonna 3 [C3]`, `Nome [C2]`, `Nome [C3]`).
- Cell values keep their native type (number / boolean / date / string); only transformed
  cells are rewritten **in place** in the original workbook, which preserves unselected
  sheets, merges, column widths, number formats, workbook order and defined names
  (verified). Formulas in transformed columns are replaced by their processed value;
  formulas elsewhere are kept (verified).
- **CSV is handled as CSV**, not as a workbook: RFC-4180-style parser (quotes, `""`
  escapes, embedded line breaks, CRLF/LF, ragged rows), automatic delimiter detection with
  confidence feedback and manual override (`,` `;` tab `|`), encoding selector
  (UTF-8 / Windows-1252 / ISO-8859-1 / UTF-16 LE / BE) with BOM auto-detection, optional
  numeric interpretation (opt-in, leading-zero codes stay text), UTF-8 BOM export toggle,
  CRLF output, column order and headers preserved.
- **XLS** files are read; the output is written as `.xlsx` (stated in the warning banner).
- Drag & drop upload was implemented (the drop zone previously claimed it but did not
  support it).

### 2.5 Anonymization methods

| Method | Behaviour |
|---|---|
| Full masking | replaces the value with a configurable string (default `***`) |
| Partial masking | keeps a configurable number of leading/trailing characters (default 1 + 1) |
| Pseudonymization | stable per-column IDs (see 2.3) |
| Generalization (new) | numeric binning into intervals (`34 → 30-39`) or lower bound (`30`), configurable width; non-numeric values are left untouched and counted in the stats |
| Reversible encryption | AES-GCM (see 2.2) |

Methods can be set globally (default) and **overridden per column**. The transformation
options (mask string, partial-visibility lengths, pseudonym format, generalization width and
output format) apply only to masking / pseudonymization / generalization and are **ignored
when reversible encryption is chosen** — this is stated in the options panel title and hint.
Empty/missing cells are never filled in (they stay empty for every method).

### 2.6 Column selection (no automatic classification)

Each column has a checkbox and a method selector (global default or per-column override);
that is the only decision the tool asks for. An automatic per-column classification UI was
deliberately **not** kept: it added friction without changing the outcome, and the tool must
never decide on the user's behalf anyway. What remains instead:

- a standing warning that a field is not automatically safe to keep just because it does not
  directly identify a person (combinations of attributes can re-identify people);
- the privacy glossary explaining masking vs pseudonymization vs encryption vs anonymization;
- the summary showing, for every selected column, the effective method — and listing sheets
  that will pass through unchanged.

### 2.7 User interface

- Explicit workflow indicator: **Upload → Inspect → Select columns → Configure → Preview → Export**.
- Worksheet selector, file inspector (format/sheets/rows/columns), format-loss warnings,
  live selection summary (columns → effective method, plus untouched sheets),
  in-page status messages (no blocking `alert()` for validation), progress bar with
  cell counts and PBKDF2 phase for large files, preview with per-sheet tabs,
  processing statistics, reset button, IT/EN selector retained, responsive down to 390 px,
  accessible labels/`aria-live`/`role="progressbar"`.
- Distinction between masking / pseudonymization / encryption / anonymization is explained
  in the method descriptions and in the “Privacy e sicurezza” panel, together with the
  privacy notice and the known-limitations list. The UI explicitly does **not** claim
  GDPR compliance or guaranteed anonymity.

### 2.8 Testing performed

All 12 required scenarios were executed against the built file (automated browser tests +
Node verification of the exported files):

1. Multi-sheet XLSX import/export — sheets, order, data, formats preserved ✔
2. Single selected worksheet processed, others untouched ✔
3. All worksheets processed (per-sheet and per-column selections) ✔
4. CSV with commas, quotes, `""` escapes, accented characters, embedded line breaks ✔
5. Blank and duplicate column headers ✔
6. Full and partial masking (incl. numbers, booleans, dates) ✔
7. Consistent pseudonyms for repeated values (stable across repeated runs in a session) ✔
8. Encrypt → decrypt with the correct password (types restored, byte-equal values) ✔
9. Wrong password → clear error, no preview, no export ✔
10. Tampered ciphertext → clear error, export cancelled ✔
11. Empty cells and mixed types (number 0, `false`, empty string, null) ✔
12. Fully offline run (network disabled in the browser) ✔

Additional checks: legacy `ENC::` handling, `.xls` input, Windows-1252 CSV decoding,
delimiter detection/override, numeric interpretation of CSV fields, generalization,
per-column method override, IT/EN switching, reset,
mobile-width layout, large file (20 000 × 5 cells encrypted in ~7 s with live progress).

---

## 3. Known limitations and unsupported features

**The output file is regenerated by SheetJS (community edition); it is not a byte-faithful
copy of the input.** Verified as preserved: cell values and types, worksheet names and
order, header rows, merged cells, column widths, number formats, formulas outside
transformed columns, defined names (named ranges).

**Not preserved** (stated in the UI warning banner and here):

- charts, images, drawings, pivot tables and pivot caches;
- cell styling: fonts, colors, borders, fills (number formats are kept, visual styling is not);
- comments/notes, threaded comments;
- conditional formatting, data validation, sheet/workbook protection, autofilter state;
- VBA macros (`.xlsm` is read but macros are dropped; output is written as `.xlsx`);
- external links, embedded objects, `ActiveX`, custom XML;
- formulas inside transformed columns are replaced by their static processed values;
- rich-text runs inside a transformed cell are replaced by plain text.

Other limitations:

- `.xls` input is supported for reading; **output is always `.xlsx`**.
- A cell whose value is transformed loses its original number format if it had none
  (dates get `yyyy-mm-dd hh:mm:ss`).
- Legacy `ENC::` values (previous CryptoJS version) cannot be decrypted here — they
  require the previous version of the tool; this version identifies them explicitly.
- CSV type inference is **opt-in**; without it all CSV fields are text and numeric
  generalization reports “non-numeric, left unchanged”.
- CSV delimiters are limited to single characters (`,` `;` tab `|`); exotic encodings
  depend on the browser's `TextDecoder` support.
- Everything is loaded into memory: very large workbooks are bounded by browser memory.
- Processing is single-threaded (cooperative chunking keeps the UI responsive but is not
  parallelized).
- Pseudonym identifiers are stable only for the session: a new run regenerates the mapping.
- Document metadata (author/title in `docProps`) is carried over by the reader/writer and
  is **not scrubbed** — see the assessment below.

---

## 4. Security and privacy assessment

### What is protected

| Risk | Status |
|---|---|
| File content leaving the machine | **No network code exists**: no CDN, no API, no telemetry, `connect-src 'none'` CSP, zero subresources (verified offline and via the resource timeline) |
| Password/keys leaking | Password only in an input field during the run; cleared afterwards; never stored (storage/cookies), never logged, never sent; keys derived locally as non-extractable `CryptoKey`s |
| Weak cryptography | AES-256-GCM (authenticated) + PBKDF2-HMAC-SHA-256 @ 600k iterations; `Math.random()` not used anywhere; no fallback if Web Crypto is missing |
| Tampering / wrong password | GCM tag verification aborts the run with a clear message; no partially decrypted or corrupted output is produced |
| Reidentification via identifiers | Pseudonyms are generated from CSPRNG tokens/sequential counters and do not embed the original value |
| Accidental data loss | No worksheet or column is dropped silently; untouched data passes through unchanged; empty cells are never invented |
| XSS via spreadsheet content | All dynamic content (headers, sheet names, values, file names) is rendered with `textContent`, never with `innerHTML` |
| Mapping persistence | Pseudonym mapping is memory-only; cleared on reset/format change/tab close |

### Residual risks

- **The browser/OS is trusted.** A compromised browser, extension, or machine can read the
  page memory (including the password while it is typed).
- **Encryption is only as strong as the password.** A stolen encrypted export can be
  brute-forced offline; PBKDF2 raises the cost but does not save a weak password.
- **Reversible ≠ anonymous.** Anyone with the exported file *and* the password recovers the
  data; sharing the password shares the data. Encryption/pseudonymization are
  pseudonymization measures, not anonymization.
- **Sequential pseudonyms leak order** (`ID_000001` < `ID_000002`) and per-column IDs repeat
  across different columns (`ID_000001` in column A and in column B are unrelated values).
- **Untransformed data and metadata remain**: untouched columns/sheets, document properties
  (author, title), the file name itself, and any data the user chose to keep.
- **Re-identification by combination**: keeping a few quasi-identifiers can still single out
  individuals; the tool warns about this but cannot decide it for the user.
- **No compliance claim**: using this tool does not make a dataset GDPR-compliant and does
  not guarantee anonymity; risk assessment remains with the data controller.
- **Verifiability**: all claims above can be checked by reading the single HTML file; users
  who need stronger guarantees should review the source and their deployment environment.

---

## 5. Files in this folder

- `sheets-anonymizer.html` — the standalone application (everything embedded).
- `sheets-anonymizer-README.md` — this file.
- `text-anonymizer.html` — the sibling text tool (standalone, offline, Web Crypto — see
  `text-anonymizer-README.md`).
- `text-anonymizer-README.md` — technical notes and assessment for the text tool.