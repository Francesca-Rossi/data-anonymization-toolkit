# data-anonymization-toolkit

Local-first tools to anonymize, pseudonymize and encrypt data **before** sharing it with AI
tools or third parties. Everything runs in your browser: no backend, no upload, no API key.

## Standalone tools

| File | Purpose |
|---|---|
| [`toolkit/standalone-tools/sheets-anonymizer.html`](toolkit/standalone-tools/sheets-anonymizer.html) | Anonymize / pseudonymize / encrypt XLSX, XLS, XLSM and CSV files in the browser (single offline file, ~1 MB, no CDN) |
| [`toolkit/standalone-tools/text-anonymizer.html`](toolkit/standalone-tools/text-anonymizer.html) | Anonymize plain text, DOCX and PDF content (single offline file, ~2 MB, no CDN) |

Open the HTML file directly in a modern browser — no internet connection required.
See [`toolkit/standalone-tools/sheets-anonymizer-README.md`](toolkit/standalone-tools/sheets-anonymizer-README.md)
for the technical summary, known limitations and the security/privacy assessment of the
spreadsheet tool, and [`toolkit/standalone-tools/text-anonymizer-README.md`](toolkit/standalone-tools/text-anonymizer-README.md)
for the same documentation of the text tool.

## Web version (GitHub Pages)

The repository root hosts a multi-page web version of the same tools, published at
`https://francesca-rossi.github.io/data-anonymization-toolkit/`:

| Page | Purpose |
|---|---|
| [`index.html`](index.html) | Landing page with a card for each tool |
| [`sheets.html`](sheets.html) | Spreadsheet anonymizer (web version) |
| [`text.html`](text.html) | Text anonymizer (web version) |

It runs entirely in the browser with a strict Content Security Policy
(`script-src 'self'`, no CDN, no network requests) and shares one code base:

| Path | Purpose |
|---|---|
| [`assets/shared.js`](assets/shared.js) | Shared i18n engine (IT/EN), ENCv1 crypto helpers, common utilities, site header |
| [`assets/shared.css`](assets/shared.css) | Merged Tailwind build + shared header styles |
| [`assets/sheets.js`](assets/sheets.js) / [`assets/text.js`](assets/text.js) | Page-specific application logic |
| [`assets/landing.css`](assets/landing.css) / [`assets/landing.js`](assets/landing.js) | Landing page styles and translations |
| [`assets/vendor/`](assets/vendor/) | Bundled libraries (SheetJS, mammoth, pdf.js incl. offline worker) |

Serve the repository root over HTTP to run it locally, for example:

```bash
python -m http.server 8000
# then open http://127.0.0.1:8000/
```

The standalone files under `toolkit/standalone-tools/` are frozen single-file copies
(not served by Pages); when you change a tool, update both the web version and the
standalone copy.