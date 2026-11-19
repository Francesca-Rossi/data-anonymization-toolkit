# Standalone Text Anonymizer — technical notes

`toolkit/standalone-tools/text-anonymizer.html` is a single, self-contained HTML file that
anonymizes plain text, DOCX and PDF content **entirely inside the browser**, embedding the
found values as reversible AES-GCM tokens directly in the text. It is part of the Data
Anonymization Toolkit.

---

## 1. Running locally and offline

1. Copy `text-anonymizer.html` anywhere (USB stick included).
2. Double-click it, or open it with any modern browser (Chrome, Edge, Firefox, Safari —
   versions from ~2020 onward, i.e. with the Web Crypto API available).
3. That is all. **No internet connection, no web server, no backend, no account, no API key
   are required or used.**

Notes:

- The file also works when served over `http://localhost` if you prefer a local server
  (e.g. `python -m http.server`); `file://` is supported directly.
- A Content-Security-Policy `<meta>` tag is embedded in the page:
  `default-src 'none'; script-src 'unsafe-inline' blob:; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; worker-src blob:; object-src 'none'; base-uri 'none'; form-action 'none'`
  It blocks any attempt by the page (or by an injected script) to reach the network.
  `blob:` appears in `script-src`/`worker-src` only for the offline PDF worker (see 2.3);
  it does not lower the protection level relative to the `'unsafe-inline'` that is already
  required for the inline application code.
- Verified: with the browser in *offline* network mode the application loads and processes
  files normally; `performance.getEntriesByType('resource')` is empty (zero subresource
  requests of any kind, before and after every operation); no CSP violations in the console.
---

## 2. Technical summary of the changes

### 2.1 External dependencies removed

| Before (CDN) | After |
|---|---|
| `cdn.tailwindcss.com` (runtime JIT) | Tailwind CSS v3.4.17 compiled subset (~13 KB, preflight + used utilities) embedded in a `<style>` block |
| `cdnjs …/mammoth.browser.min.js` 1.4.21 | Same mammoth build embedded inline in a `<script>` block (MIT license header preserved) |
| `cdnjs …/pdf.min.js` 2.16.105 | Same PDF.js build embedded inline in a `<script>` block (Apache-2.0 `@licstart`/`@licend` preserved) |
| `pdf.worker.min.js` 2.16.105 loaded from CDN | Same worker build embedded as a JS string (`PDF_WORKER_CODE`), instantiated at runtime as a `Blob` URL (see 2.3) |
| `cdnjs …/crypto-js.min.js` 4.1.1 | **Removed** — replaced by the browser's native Web Crypto API |
| `@import` Google Fonts (Inter) | Removed; local font stack `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` (Inter is used only if installed locally) |

The delivered file is one HTML document (2 113 604 bytes ≈ 2.0 MB) with zero external URLs
that are ever requested. There is no analytics, telemetry, tracking, remote font, `fetch()`,
`XMLHttpRequest`, `sendBeacon`, `localStorage`, `sessionStorage` or cookie usage in the
application code.

Pinned build assets and their SHA-256 (build traceability):

| Asset | Version | SHA-256 |
|---|---|---|
| `mammoth.browser.min.js` | 1.4.21 | `3602670e0cf145e4b270e3530033b780f9c081eb9ed9b2ad79e2f1e448921941` |
| `pdf.min.js` | 2.16.105 | `1fc294eefda602e591a06c1d5af361cae23756b5a334fc2421d5f9accce038e5` |
| `pdf.worker.min.js` | 2.16.105 | `99732130603cd4980f009a29a38a86373b43ffb9ae22c35ec85440f311ceddfc` |

Rebuilding the embedded CSS after editing the markup (maintainers):

```bash
npx tailwindcss@3.4.17 -c tailwind.config.js -i input.css -o output.css --minify
# content: ['./text-anonymizer.html']  (class names used dynamically in JS are
# string literals in the file ⇒ they are picked up by the scan)
```

`tailwind.config.js` / `input.css` are build-time only and are not part of the delivered
folder. After changing the library versions, replace the contents of the three library
`<script>` blocks (keeping the license headers) and regenerate the `PDF_WORKER_CODE`
string with `JSON.stringify(workerSource).replace(/<\//g, '<\\/')` so the HTML parser can
never terminate the script block early.

### 2.2 Encryption: CryptoJS → Web Crypto API

Token format embedded in the text (aligned with the spreadsheet tool's `ENCv1.`):

```
[ENCv1.<salt-b64url>.<iv-b64url>.<ciphertext-b64url>]
```

- **AES-256-GCM** (authenticated) via `crypto.subtle.encrypt/decrypt`.
- **PBKDF2-HMAC-SHA-256**, **600 000 iterations** (OWASP recommendation) derives a
  non-extractable `CryptoKey` from the password — once per processing run.
- **16-byte cryptographically random salt per run**, **12-byte unique random IV per
  occurrence**, both from `crypto.getRandomValues()`.
- base64url without padding: immune to `+/=` and to newline wrapping introduced by an AI.
- **No encryption cache**: two occurrences of the same value always produce **different**
  tokens (no equality leak; deliberate behaviour change from the previous version).
- **Password verification is automatic**: GCM authentication fails on a wrong password or
  on any modification of a token. De-anonymization decrypts every token first and shows
  **no output at all** if even one token fails — there is never partial/corrupted output.
- Token search tolerates whitespace/newlines inserted inside the token (they are stripped
  before parsing), so tokens line-wrapped or re-indented by an AI still decrypt.
- Passwords are held only in the password input during the operation and are **cleared
  after every run (success or failure, anonymization and de-anonymization alike)**; never
  stored (no storage/cookies), never logged (the application code contains no `console.*`
  calls at all), never sent.
- If `crypto.subtle` is unavailable (insecure context/old browser), the method is disabled
  with an explicit explanation — there is **no fallback to weaker crypto**.
- **Breaking change**: legacy CryptoJS blocks `[ENC::…]` are *not* recognized and *not*
  decrypted; they pass through as plain text (anonymization) or trigger an explicit
  "no `[ENCv1…]` placeholder found" message when they are the only tokens present
  (de-anonymization). Decrypting them requires the previous version of the tool — stated
  in the UI (info box, restore description, error messages) and in section 3.

### 2.3 PDF handling without network

- The worker cannot be loaded from a CDN anymore: `PDF_WORKER_CODE` (the pinned
  `pdf.worker.min.js` build as a string) is turned into a `Blob` URL and assigned to
  `pdfjsLib.GlobalWorkerOptions.workerSrc`.
- **`file://` contingency**: if `new Worker(blobUrl)` fails, PDF.js 2.x falls back to the
  *fake worker* (execution on the main thread) which loads `workerSrc` via a `<script>`
  tag; both paths need `blob:` in `script-src` (and `worker-src`), which the CSP grants.
  Both paths were verified offline from `file://` on Chromium/Chrome — the real worker in
  the normal runs, the fake worker by disabling `window.Worker` before the probe (PDF still
  extracted, zero network requests). Firefox was not available in the test environment;
  the code paths are the standard PDF.js ones and the CSP grants what both browsers need.
- An **availability probe** (a tiny generated PDF parsed at first use) confirms that one of
  the two paths works in the current browser. If neither does, PDF support is disabled
  with an explicit message — **no network fallback ever**; TXT and DOCX keep working.
- `cMapUrl` / `standardFontDataUrl` are not configured (no external resources);
  `connect-src 'none'` blocks any residual network attempt; `isEvalSupported: false` and
  `verbosity: 0` are passed to `getDocument`.
- Invalid/unsupported files produce a normal file-level error and never disable PDF
  permanently.

### 2.4 Text processing robustness

- All enabled rules and custom words are collected in a **single pass over the original
  text** (earlier rules win on overlaps). Generated tokens can therefore never be
  re-matched by later rules or custom words (the previous implementation could match
  inside its own placeholders).
- Custom words are regex-escaped (`escapeRegExp`): characters such as `+ ( ) .` are
  treated literally — no regex injection.
- Large inputs are processed in chunks with `await sleep(0)` between them and an honest
  progress label ("deriving key (PBKDF2)…", "N items processed…"); the spinner never
  fakes asynchrony (`setTimeout(..., 50)` as "async" is gone).

### 2.5 Privacy hardening

- **Zero `console.*` calls in the application code** (the inlined third-party libraries
  contain their own dormant logging utilities — see the assessment for exact counts).
- Clipboard: `navigator.clipboard.writeText()` with a `document.execCommand('copy')`
  fallback in `try/catch` (`file://` is a secure context).
- All dynamic/user data is rendered with `textContent`/`innerText`; `innerHTML` is used
  only for static translation strings and the static rule-checkbox template — no user or
  file content ever passes through it.
- Verified absent from the application code: `Math.random`, `localStorage`,
  `sessionStorage`, cookies, `fetch`, `XMLHttpRequest`, `sendBeacon`, `eval`.
- Banner/info strings updated to the new `[ENCv1…]` placeholder format (IT and EN).

### 2.6 Testing performed

All required scenarios were executed against the built file in Chromium/Chrome opened
from `file://` with the network disabled:

1. Load offline — zero subresources (`performance.getEntriesByType('resource')` empty),
   CSP present and enforced (a test `fetch()` is blocked by `connect-src 'none'`), no CSP
   violations in the console. ✔
2. Text extraction from **TXT**, **DOCX** (paragraphs, lists, table cells) and **PDF**
   (multi-page generated PDF plus two real-world documents of 321 KB and 618 KB with
   embedded fonts) — all under CSP, fully offline. ✔
3. Regex rules on/off (e-mail, CF, IBAN, phone, credit card, P.I.VA) + custom words with
   regex special characters (`C++ (test) v1.2+`) — literal match, no regex injection. ✔
4. Roundtrip anonymize → de-anonymize with the correct password: text restored
   **byte-identical** (synthetic and real-world content). ✔
5. Wrong password → clear error message, **no partial output** shown or exportable,
   password field cleared. ✔
6. Tokens with whitespace/newline inserted inside (AI line-wrapping) decrypt correctly;
   a corrupted token → clear error, no output. ✔
7. Text containing legacy `[ENC::…]` blocks: left unchanged during anonymization; a
   legacy-only input during de-anonymization produces an explicit message and no output. ✔
8. Password cleared after every run (success and failure); nothing appears in console,
   storage or cookies. ✔
9. Equality leak: two occurrences of the same value produce **different** tokens. ✔
10. i18n IT/EN (all updated keys), layout at 390 px with no horizontal overflow,
    state fully reset on reload (no persistence anywhere). ✔
11. Final size **2 113 604 bytes (≈ 2.0 MB)**, well below the 3 MB target; license
    headers of the inlined libraries intact. ✔

Additional checks: copy button (clipboard API path), download TXT, drag & drop + file
picker for every format, invalid-PDF error path, tab switching, spinner/progress labels,
fake-worker contingency (PDF extracted with `window.Worker` disabled, zero network
requests).

---

## 3. Known limitations and unsupported features

- **Breaking change**: placeholders produced by the previous CryptoJS version
  (`[ENC::…]`) **cannot be decrypted here**; they are not even recognized. To recover old
  data you need the previous version of the tool.
- Output is **plain text only**: DOCX/PDF formatting, images and document metadata are not
  transported (pro: no author/title metadata leaks out; con: layout is lost).
- Everything is loaded into memory: very large texts are bounded by browser memory.
- Processing is single-threaded (cooperative chunking keeps the UI responsive but is not
  parallelized).
- PDF text extraction depends on the document: text layers with ToUnicode/CMap information
  extract correctly; scanned/image-only PDFs yield no text; external CMaps are
  intentionally not fetched, so exotic CID-only PDFs without embedded mapping may fail
  (reported as a file-level error).
- If a browser supports neither the blob worker nor the fake-worker path, PDF input is
  disabled with an explicit message (TXT/DOCX keep working); there is no network fallback.
- Fiducia nel browser/OS; forza della password; reversible ≠ anonimo; nessuna garanzia di
  conformità GDPR (stessa formulazione dello strumento per i fogli di calcolo).

---

## 4. Security and privacy assessment

### What is protected

| Risk | Status |
|---|---|
| Content leaving the machine | **No network code exists in the application**: no CDN, no API, no telemetry, `connect-src 'none'` CSP, zero subresources (verified offline and via the resource timeline) |
| Password/keys leaking | Password only in an input field during the run; cleared afterwards; never stored (storage/cookies), never logged, never sent; keys derived locally as non-extractable `CryptoKey`s |
| Weak cryptography | AES-256-GCM (authenticated) + PBKDF2-HMAC-SHA-256 @ 600k iterations; `Math.random()` not used anywhere in the application code; no fallback if Web Crypto is missing |
| Tampering / wrong password | GCM tag verification fails; de-anonymization aborts with a clear message and produces **no output at all** — never partial or corrupted text |
| Equality leak (linkability) | Fresh random IV per occurrence: identical values yield different tokens in every run |
| XSS via file/content | All dynamic content (extracted text, file names, error details) is rendered with `textContent`/`innerText`, never with `innerHTML` |
| Accidental data persistence | No storage, no cookies, no service worker; state (including passwords) lives only in the DOM of the current page and disappears on reload |
| Regex injection via custom words | Custom words are regex-escaped before use |

### Residual risks

- **The browser/OS is trusted.** A compromised browser, extension, or machine can read the
  page memory (including the password while it is typed).
- **Encryption is only as strong as the password.** A stolen anonymized text can be
  brute-forced offline; PBKDF2 raises the cost but does not save a weak password.
- **Reversible ≠ anonymous.** Anyone with the anonymized text *and* the password recovers
  the data; sharing the password shares the data. Reversible encryption is a
  pseudonymization measure, not anonymization.
- **Untransformed data remains**: values not matched by the selected rules/custom words
  stay in clear text; the tool warns about this but cannot decide it for the user.
- **Re-identification by combination**: keeping a few quasi-identifiers can still single out
  individuals.
- **Inlined libraries carry dormant code**: mammoth bundles lodash (`Math.random` in an
  unused utility, a `localStorage` read for a deprecation flag) and its own logging;
  PDF.js contains `fetch`/`XMLHttpRequest` paths for *optional* external resources that are
  never configured here, plus logging (suppressed via `verbosity: 0`); the PDF worker
  prefers `crypto.getRandomValues` and only contains a `Math.random` fallback for legacy
  environments. None of this is reachable as a network or storage channel from this tool —
  any network attempt is additionally blocked by `connect-src 'none'`.
- **No compliance claim**: using this tool does not make a dataset GDPR-compliant and does
  not guarantee anonymity; risk assessment remains with the data controller.
- **Verifiability**: all claims above can be checked by reading the single HTML file; users
  who need stronger guarantees should review the source and their deployment environment.

---

## 5. Files in this folder

- `sheets-anonymizer.html` — the standalone spreadsheet tool (everything embedded).
- `sheets-anonymizer-README.md` — technical notes, limitations and assessment for the
  spreadsheet tool.
- `text-anonymizer.html` — the standalone text tool (everything embedded).
- `text-anonymizer-README.md` — this file.
