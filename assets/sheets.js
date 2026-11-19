(function () {
    'use strict';

    const {
        registerTranslations,
        t,
        tf,
        applyI18n,
        setLanguage,
        onLanguageChange,
        sleep,
        downloadBlob,
        bytesToB64u,
        b64uToBytes,
        deriveKey,
        webCryptoAvailable,
        textEncoder,
        textDecoderUtf8,
        ENC_PREFIX,
        LEGACY_PREFIX
    } = AppShared;

    /* ==================== i18n ==================== */
    registerTranslations({
        it: {
            title: "Anonimizzatore Dati Excel",
            subtitle: "Nessuna AI. Nessun server. I dati rimangono nel tuo browser.",
            localBadge: "Elaborazione 100% locale nel browser: nessun caricamento su server",
            workflowLabel: "Flusso di lavoro",
            wf1: "1. Carica",
            wf2: "2. Ispeziona",
            wf3: "3. Colonne",
            wf4: "4. Configura",
            wf5: "5. Anteprima",
            wf6: "6. Esporta",
            tabAnon: "Anonimizza",
            tabDeanon: "De-anonimizza",
            step1Anon: "1. Carica il tuo file originale (.xlsx, .xlsm, .xls, .csv)",
            step1Deanon: "1. Carica il file anonimizzato da decifrare (.xlsx, .xls, .csv)",
            uploadText: "Clicca per caricare",
            uploadOr: " o trascina il file qui",
            noFile: "Nessun file selezionato",
            btnReset: "Azzera sessione",
            btnResetSession: "Azzera file e sessione",
            csvDelimiter: "Delimitatore di colonne",
            delimComma: "Virgola (,)",
            delimSemicolon: "Punto e virgola (;)",
            delimTab: "Tabulatore",
            delimPipe: "Barra verticale (|)",
            csvEncoding: "Codifica caratteri",
            encUtf8: "UTF-8",
            encW1252: "Windows-1252",
            encLatin1: "ISO-8859-1 (Latin-1)",
            encUtf16le: "UTF-16 LE",
            encUtf16be: "UTF-16 BE",
            csvEncodingHint: "Il BOM viene rilevato automaticamente.",
            csvTypes: "Interpreta i campi numerici come numeri",
            csvTypesHint: "Utile per la generalizzazione dei valori numerici nei CSV. I campi con zeri iniziali (es. 007) restano testo; l'interpretazione non viene applicata alle intestazioni.",
            csvExportLabel: "Esportazione CSV",
            csvBom: "Aggiungi BOM UTF-8 (consigliato per Excel)",
            csvNote: "Il file CSV resta un CSV: non viene convertito in cartella Excel.",
            csvDetected: "Rilevato automaticamente: {d}",
            csvNotDetected: "Non rilevabile in modo affidabile: scegli il delimitatore manualmente.",
            step2Title: "2. Ispeziona il file",
            infoType: "Formato",
            infoSheets: "Fogli",
            infoRows: "Righe dati",
            infoCols: "Colonne",
            sheetsTitle: "Fogli di calcolo da elaborare",
            selectAllSheets: "Seleziona tutti",
            sheetsHint: "Nessun foglio viene scartato in modo automatico: quelli deselezionati restano invariati nel file di output.",
            sheetEmpty: "vuoto",
            sheetMeta: "{r} righe × {c} col.",
            sheetEmptyNote: "Foglio vuoto: nessuna colonna da elaborare.",
            step3Title: "3. Seleziona le colonne da anonimizzare",
            step3TitleDeanon: "3. Seleziona le colonne da decifrare",
            headerHint: "La prima riga di ogni foglio è considerata intestazione e non viene trasformata. Le colonne senza intestazione o con nomi duplicati restano identificabili tramite il loro numero.",
            reidentWarning: "Un campo non è automaticamente sicuro da conservare solo perché non identifica direttamente una persona: combinazioni di attributi (anche non sensibili) possono permettere la re-identificazione.",
            colPlaceholder: "Colonna {n}",
            colAllInSheet: "Seleziona tutte",
            colEncCount: "{n} valori cifrati",
            colMethodLabel: "Metodo di elaborazione per questa colonna",
            methodTitle: "4. Metodo predefinito per le colonne selezionate",
            methodFull: "Oscuramento Totale",
            methodFullDesc: "Sostituisce tutto con la stringa di mascheratura (es. Mario -> ***)",
            methodPartial: "Oscuramento Parziale",
            methodPartialDesc: "Mantiene solo le parti visibili configurate (es. Mario -> M***o)",
            methodRandom: "Pseudonimo (ID costante)",
            methodRandomDesc: "Valori uguali nella stessa colonna ricevono lo stesso ID, valori diversi ID diversi. Non è anonimato.",
            methodGeneralize: "Generalizzazione numerica",
            methodGeneralizeDesc: "Trasforma i numeri esatti in intervalli (es. 34 -> 30-39), mantenendo utilità analitica.",
            methodEncrypt: "Cifratura reversibile (AES-GCM)",
            methodEncryptDesc: "Usa una password. La decifratura è autenticata: password errata o contenuto modificato produce un errore. È pseudonimizzazione, non anonimizzazione.",
            methodDecrypt: "Decifratura (AES-GCM)",
            webcryptoMissing: "La Web Crypto API non è disponibile in questo browser: la cifratura è disattivata per non ricorrere a crittografia più debole. Apri la pagina in un browser moderno.",
            optionsTitle: "Opzioni di trasformazione (non usate con la cifratura)",
            optMaskString: "Stringa di mascheratura",
            optPseudoFormat: "Formato pseudonimo",
            pseudoSeq: "Sequenziale: ID_000001",
            pseudoToken: "Token casuale: ID_A7K2M9XQ4Z",
            optKeepStart: "Parziale: mantieni inizio (caratteri)",
            optKeepEnd: "Parziale: mantieni fine (caratteri)",
            optGenBin: "Generalizza: larghezza intervallo",
            optGenOutput: "Generalizza: formato output",
            genLabel: "Intervallo testuale (30-39)",
            genLower: "Estremo inferiore numerico (30)",
            optionsHint: "Queste opzioni valgono solo per i metodi oscuramento, pseudonimizzazione e generalizzazione. Con la cifratura reversibile vengono ignorate: conta solo la password. È comunque possibile assegnare metodi diversi colonna per colonna nell'elenco precedente.",
            pwdLabel: "Password di Sicurezza",
            pwdPlaceholder: "Inserisci password...",
            pwdDesc: "Memorizza la password, ti servirà per decifrare i dati! La password non viene salvata in alcun modo: resta solo in memoria durante l'operazione e viene azzerata al termine.",
            pwdCryptoNote: "Dettagli: AES-256-GCM, chiave derivata con PBKDF2-HMAC-SHA-256 (600.000 iterazioni), sale casuale e IV unico per ogni valore.",
            irreversibleWarning: "Oscuramento, pseudonimizzazione e generalizzazione sono irreversibili: senza una copia del file originale non sarà possibile ripristinare i valori. La cifratura è l'unico metodo reversibile.",
            confirmIrreversible: "Stai per applicare trasformazioni IRREVERSIBILI (oscuramento, pseudonimizzazione o generalizzazione).\n\nSenza il file originale non sarà possibile recuperare i dati sostituiti. Continuare?",
            summaryTitle: "Riepilogo della selezione",
            summaryNone: "Nessuna colonna selezionata.",
            summarySheets: "{n} di {t} fogli selezionati",
            summaryLine: "{sheet} · {col} → {method}",
            summaryUnchanged: "{sheet} → nessuna colonna selezionata (foglio invariato)",
            optGlobal: "Metodo predefinito",
            btnPreviewAnon: "Genera Anteprima",
            btnPreviewDeanon: "De-anonimizza e Genera Anteprima",
            progressKey: "Derivazione della chiave (PBKDF2)…",
            progressCells: "Elaborazione celle: {n} di {t}…",
            progressDone: "Elaborazione completata.",
            previewTitle: "Anteprima Dati (Prime righe)",
            previewLocalHint: "L'anteprima viene generata esclusivamente in memoria nel browser.",
            previewNoRows: "Nessuna riga di dati da mostrare in anteprima.",
            statsTitle: "Dettaglio elaborazione",
            btnDownloadAnon: "Scarica File Anonimizzato",
            btnDownloadDeanon: "Scarica file con dati in chiaro",
            suffixAnon: "_anonymized",
            suffixDeanon: "_restored",
            moreRows: "... altre {n} righe omesse nell'anteprima ...",
            statusOkAnon: "{n} celle elaborate localmente.",
            statusOkDeanon: "{n} valori decifrati localmente.",
            statusDownloaded: "File salvato nella cartella di download del browser. Il file di output è stato rigenerato: verifica i risultati prima di condividerlo.",
            statsProcessed: "{n} valori trasformati",
            statsDecrypted: "{n} valori decifrati",
            statsEmpty: "{n} celle vuote lasciate invariate",
            statsSkippedEnc: "{n} valori già cifrati lasciate invariate",
            statsNotGen: "{n} valori non numerici lasciati invariate (generalizzazione non applicabile)",
            statsLegacyAnon: "{n} valori in formato legacy ENC:: lasciate invariate",
            statsLegacyDeanon: "{n} valori in formato legacy ENC:: lasciate invariate (richiedono la versione precedente)",
            statsPlain: "{n} valori non cifrati lasciati invariate",
            warnLegacyAnon: "{n} celle contenevano già un valore cifrato (formato precedente ENC::) e sono state lasciate invariate.",
            warnLegacyDeanon: "{n} valori usano il formato legacy ENC:: della versione precedente e non possono essere decifrati qui: sono stati lasciati invariati. Usa la versione precedente dello strumento per decifrarli.",
            alertEmpty: "Il file sembra essere vuoto.",
            alertError: "Si è verificato un errore durante la lettura del file. Assicurati che sia un formato supportato (.xlsx, .xlsm, .xls, .csv).",
            alertUnsupported: "Formato file non supportato: usa .xlsx, .xlsm, .xls o .csv.",
            noCols: "Nessuna colonna trovata.",
            alertSelectCol: "Per favore, seleziona almeno una colonna da elaborare.",
            alertSelectSheet: "Per favore, seleziona almeno un foglio di calcolo.",
            alertPwd: "Inserisci la password di sicurezza per procedere.",
            errWebCrypto: "La Web Crypto API non è disponibile: la cifratura e la decifratura sono disattivate per non ricorrere a crittografia più debole.",
            errDecryptGeneric: "Decifratura non riuscita: password errata oppure contenuto cifrato modificato. Nessun dato corrotto è stato prodotto.",
            errDecryptCount: "{n} valori non sono stati decifrati (password errata o contenuto modificato): l'esportazione è stata annullata.",
            warnXlsx: "Nota: il file di output viene rigenerato. Vengono conservati valori, nomi e ordine dei fogli, fusioni di celle, larghezze di colonna e formati numerici; NON vengono preservati grafici, pivot table, formattazione celle (colori/font/bordi), commenti, convalida dati, formattazione condizionale e macro.",
            warnXlsm: "Nota: le macro (VBA) NON vengono conservate e l'output sarà salvato in formato .xlsx. Anche gli altri elementi avanzati (grafici, pivot, formattazione celle, commenti) non vengono preservati.",
            warnXls: "Nota: il file .xls può essere letto, ma l'output verrà salvato in formato .xlsx. Formule, formati ed elementi avanzati non vengono preservati.",
            warnCsv: "Nota: il CSV viene letto e riscritto come CSV (delimitatore e codifica selezionati sopra). Le righe multi-linea dentro virgolette sono supportate; altre codifiche oltre quelle elencate potrebbero non essere leggibili.",
            privacyTitle: "Privacy e sicurezza (leggi prima di caricare dati sensibili)",
            privacy1: "I file vengono letti ed elaborati esclusivamente nel browser, in locale.",
            privacy2: "L'applicazione non carica deliberatamente i contenuti dei file su alcun server.",
            privacy3: "Password e chiavi di cifratura non vengono trasmesse: la derivazione della chiave avviene con la Web Crypto API del browser.",
            privacy4: "Questa versione standalone non dipende da CDN esterni, API, analytics o tracciamenti; la pagina include una Content Security Policy che blocca le richieste di rete.",
            privacy5: "Per verificare in autonomia queste affermazioni, esamina il sorgente del file HTML e l'ambiente di distribuzione.",
            glossaryTitle: "Differenze tra le trasformazioni",
            glossMaskTerm: "Oscuramento (masking):",
            glossMaskDef: "sostituisce il valore con un segnaposto; è irreversibile e distrugge l'informazione.",
            glossPseudoTerm: "Pseudonimizzazione:",
            glossPseudoDef: "sostituisce il valore con un identificativo costante o cifra reversibilmente con password: i dati restano collegabili all'originale e non sono anonimi.",
            glossEncryptTerm: "Cifratura:",
            glossEncryptDef: "trasforma i dati in forma non leggibile senza la password (AES-GCM autenticato); è reversibile e quindi una forma di pseudonimizzazione.",
            glossAnonTerm: "Anonimizzazione:",
            glossAnonDef: "riduce il rischio di re-identificazione in modo irreversibile. Nessuno strumento automatico la garantisce da solo.",
            noGdpr: "L'uso di questo strumento non rende automaticamente un dataset conforme al GDPR né garantisce l'anonimato: la valutazione del rischio resta responsabilità di chi elabora i dati.",
            limitationsTitle: "Limiti noti (formati e funzionalità)",
            limit1: "Il file di output viene rigenerato: valori, nomi e ordine dei fogli, fusioni di celle, larghezze di colonna e formati numerici sono conservati, ma grafici, pivot table, formattazione di celle (colori/font/bordi), commenti, convalida dati, formattazione condizionale e macro NON vengono preservati.",
            limit2: "Le formule nelle colonne trasformate vengono sostituite dal relativo valore elaborato.",
            limit3: "I file .xls vengono letti, ma l'output viene salvato in formato .xlsx.",
            limit4: "I valori in formato legacy ENC:: (prodotti dalla versione precedente con CryptoJS) non sono decifrabili da questa versione: richiedono il precedente strumento.",
            limit5: "CSV: sono supportati delimitatori semplici e valori tra virgolette con a capo; codifiche oltre UTF-8 dipendono dal supporto del browser."
        },
        en: {
            title: "Excel Data Anonymizer",
            subtitle: "No AI. No servers. Data stays in your browser.",
            localBadge: "100% local processing in your browser: nothing is uploaded to a server",
            workflowLabel: "Workflow",
            wf1: "1. Upload",
            wf2: "2. Inspect",
            wf3: "3. Columns",
            wf4: "4. Configure",
            wf5: "5. Preview",
            wf6: "6. Export",
            tabAnon: "Anonymize",
            tabDeanon: "De-anonymize",
            step1Anon: "1. Upload your original file (.xlsx, .xlsm, .xls, .csv)",
            step1Deanon: "1. Upload the anonymized file to decrypt (.xlsx, .xls, .csv)",
            uploadText: "Click to upload",
            uploadOr: " or drag and drop here",
            noFile: "No file selected",
            btnReset: "Reset session",
            btnResetSession: "Reset file and session",
            csvDelimiter: "Column delimiter",
            delimComma: "Comma (,)",
            delimSemicolon: "Semicolon (;)",
            delimTab: "Tab",
            delimPipe: "Pipe (|)",
            csvEncoding: "Character encoding",
            encUtf8: "UTF-8",
            encW1252: "Windows-1252",
            encLatin1: "ISO-8859-1 (Latin-1)",
            encUtf16le: "UTF-16 LE",
            encUtf16be: "UTF-16 BE",
            csvEncodingHint: "A byte order mark (BOM) is detected automatically.",
            csvTypes: "Interpret numeric fields as numbers",
            csvTypesHint: "Useful for numeric generalization on CSV files. Fields with leading zeros (e.g. 007) stay text; headers are never converted.",
            csvExportLabel: "CSV export",
            csvBom: "Add UTF-8 BOM (recommended for Excel)",
            csvNote: "A CSV file stays a CSV file: it is not converted into an Excel workbook.",
            csvDetected: "Detected automatically: {d}",
            csvNotDetected: "Could not be detected reliably: choose the delimiter manually.",
            step2Title: "2. Inspect the file",
            infoType: "Format",
            infoSheets: "Sheets",
            infoRows: "Data rows",
            infoCols: "Columns",
            sheetsTitle: "Worksheets to process",
            selectAllSheets: "Select all",
            sheetsHint: "No worksheet is discarded automatically: deselected sheets remain unchanged in the output file.",
            sheetEmpty: "empty",
            sheetMeta: "{r} rows × {c} cols.",
            sheetEmptyNote: "Empty worksheet: no columns to process.",
            step3Title: "3. Select the columns to process",
            step3TitleDeanon: "3. Select the columns to decrypt",
            headerHint: "The first row of each sheet is treated as the header and is never transformed. Columns with blank or duplicated headers stay identifiable by their column number.",
            reidentWarning: "A field is not automatically safe to keep just because it does not directly identify a person: combinations of attributes (even non-sensitive ones) can enable re-identification.",
            colPlaceholder: "Column {n}",
            colAllInSheet: "Select all",
            colEncCount: "{n} encrypted values",
            colMethodLabel: "Processing method for this column",
            methodTitle: "4. Default method for the selected columns",
            methodFull: "Full Masking",
            methodFullDesc: "Replaces everything with the masking string (e.g. John -> ***)",
            methodPartial: "Partial Masking",
            methodPartialDesc: "Keeps only the visible parts you configured (e.g. John -> J**n)",
            methodRandom: "Pseudonym (stable ID)",
            methodRandomDesc: "Equal values in the same column get the same ID, different values get different IDs. This is not anonymization.",
            methodGeneralize: "Numeric generalization",
            methodGeneralizeDesc: "Turns exact numbers into ranges (e.g. 34 -> 30-39), preserving analytical value.",
            methodEncrypt: "Reversible Encryption (AES-GCM)",
            methodEncryptDesc: "Uses a password. Decryption is authenticated: a wrong password or modified content produces an error. This is pseudonymization, not anonymization.",
            methodDecrypt: "Decryption (AES-GCM)",
            webcryptoMissing: "The Web Crypto API is not available in this browser: encryption is disabled rather than falling back to weaker cryptography. Open the page in a modern browser.",
            optionsTitle: "Transformation options (not used with encryption)",
            optMaskString: "Masking string",
            optPseudoFormat: "Pseudonym format",
            pseudoSeq: "Sequential: ID_000001",
            pseudoToken: "Random token: ID_A7K2M9XQ4Z",
            optKeepStart: "Partial: keep start (characters)",
            optKeepEnd: "Partial: keep end (characters)",
            optGenBin: "Generalize: interval width",
            optGenOutput: "Generalize: output format",
            genLabel: "Text range (30-39)",
            genLower: "Numeric lower bound (30)",
            optionsHint: "These options only apply to masking, pseudonymization and generalization. With reversible encryption they are ignored: only the password matters. Different methods can still be assigned per column in the list above.",
            pwdLabel: "Security Password",
            pwdPlaceholder: "Enter password...",
            pwdDesc: "Remember the password, you'll need it to decrypt the data! The password is never stored anywhere: it stays in memory only during the operation and is cleared afterwards.",
            pwdCryptoNote: "Details: AES-256-GCM, key derived with PBKDF2-HMAC-SHA-256 (600,000 iterations), random salt and a unique IV for every value.",
            irreversibleWarning: "Masking, pseudonymization and generalization are irreversible: without a copy of the original file the values cannot be restored. Encryption is the only reversible method.",
            confirmIrreversible: "You are about to apply IRREVERSIBLE transformations (masking, pseudonymization or generalization).\n\nWithout the original file the replaced data cannot be recovered. Continue?",
            summaryTitle: "Selection summary",
            summaryNone: "No column selected.",
            summarySheets: "{n} of {t} sheets selected",
            summaryLine: "{sheet} · {col} → {method}",
            summaryUnchanged: "{sheet} → no columns selected (sheet left unchanged)",
            optGlobal: "Default method",
            btnPreviewAnon: "Generate Preview",
            btnPreviewDeanon: "De-anonymize and Preview",
            progressKey: "Deriving key (PBKDF2)…",
            progressCells: "Processing cells: {n} of {t}…",
            progressDone: "Processing finished.",
            previewTitle: "Data Preview (First rows)",
            previewLocalHint: "The preview is generated entirely in memory in your browser.",
            previewNoRows: "No data rows to show in the preview.",
            statsTitle: "Processing details",
            btnDownloadAnon: "Download Anonymized File",
            btnDownloadDeanon: "Download Clear Data File",
            suffixAnon: "_anonymized",
            suffixDeanon: "_restored",
            moreRows: "... {n} more rows omitted in preview ...",
            statusOkAnon: "{n} cells processed locally.",
            statusOkDeanon: "{n} values decrypted locally.",
            statusDownloaded: "File saved to your browser's download folder. The output file was regenerated: verify the result before sharing it.",
            statsProcessed: "{n} values transformed",
            statsDecrypted: "{n} values decrypted",
            statsEmpty: "{n} empty cells left unchanged",
            statsSkippedEnc: "{n} already-encrypted values left unchanged",
            statsNotGen: "{n} non-numeric values left unchanged (generalization not applicable)",
            statsLegacyAnon: "{n} legacy ENC:: values left unchanged",
            statsLegacyDeanon: "{n} legacy ENC:: values left unchanged (require the previous version)",
            statsPlain: "{n} non-encrypted values left unchanged",
            warnLegacyAnon: "{n} cells already contained an encrypted value (previous ENC:: format) and were left unchanged.",
            warnLegacyDeanon: "{n} values use the legacy ENC:: format from the previous version and cannot be decrypted here: they were left unchanged. Use the previous version of the tool to decrypt them.",
            alertEmpty: "The file appears to be empty.",
            alertError: "An error occurred while reading the file. Make sure it is a supported format (.xlsx, .xlsm, .xls, .csv).",
            alertUnsupported: "Unsupported file type: use .xlsx, .xlsm, .xls or .csv.",
            noCols: "No columns found.",
            alertSelectCol: "Please select at least one column to process.",
            alertSelectSheet: "Please select at least one worksheet.",
            alertPwd: "Enter the security password to proceed.",
            errWebCrypto: "The Web Crypto API is not available: encryption and decryption are disabled rather than falling back to weaker cryptography.",
            errDecryptGeneric: "Decryption failed: wrong password or modified encrypted content. No corrupted output was produced.",
            errDecryptCount: "{n} values could not be decrypted (wrong password or modified content): the export was cancelled.",
            warnXlsx: "Note: the output file is regenerated. Cell values, worksheet names and order, merged cells, column widths and number formats are kept; charts, pivot tables, cell styling (colors/fonts/borders), comments, data validation, conditional formatting and macros are NOT preserved.",
            warnXlsm: "Note: macros (VBA) are NOT preserved and the output is saved as .xlsx. Other advanced features (charts, pivots, cell styling, comments) are not preserved either.",
            warnXls: "Note: the .xls file can be read, but the output is saved as .xlsx. Formulas, formatting and advanced features are not preserved.",
            warnCsv: "Note: the CSV is read and written back as a CSV (using the delimiter and encoding selected above). Multi-line values inside quotes are supported; encodings other than the listed ones may not be readable.",
            privacyTitle: "Privacy and security (read before uploading sensitive data)",
            privacy1: "Files are read and processed exclusively in your browser, locally.",
            privacy2: "The application does not intentionally upload file contents to any server.",
            privacy3: "Passwords and encryption keys are never transmitted: key derivation happens with the browser's Web Crypto API.",
            privacy4: "This standalone version does not depend on external CDNs, APIs, analytics or tracking; the page includes a Content Security Policy that blocks network requests.",
            privacy5: "To verify these claims independently, inspect the HTML source and the deployment environment.",
            glossaryTitle: "Differences between transformations",
            glossMaskTerm: "Masking:",
            glossMaskDef: "replaces the value with a placeholder; it is irreversible and destroys the information.",
            glossPseudoTerm: "Pseudonymization:",
            glossPseudoDef: "replaces the value with a stable identifier or encrypts it reversibly with a password: the data remains linkable to the original and is not anonymous.",
            glossEncryptTerm: "Encryption:",
            glossEncryptDef: "turns data into an unreadable form without the password (authenticated AES-GCM); it is reversible and therefore a form of pseudonymization.",
            glossAnonTerm: "Anonymization:",
            glossAnonDef: "irreversibly reduces the risk of re-identification. No single automated tool guarantees it.",
            noGdpr: "Using this tool does not automatically make a dataset GDPR-compliant and does not guarantee anonymity: risk assessment remains the responsibility of the data controller.",
            limitationsTitle: "Known limitations (formats and features)",
            limit1: "The output file is regenerated: values, worksheet names and order, merged cells, column widths and number formats are kept, but charts, pivot tables, cell styling (colors/fonts/borders), comments, data validation, conditional formatting and macros are NOT preserved.",
            limit2: "Formulas in transformed columns are replaced by their processed values.",
            limit3: ".xls files can be read, but the output is saved as .xlsx.",
            limit4: "Legacy ENC:: values (produced by the previous CryptoJS version) cannot be decrypted by this version: they require the previous tool.",
            limit5: "CSV: simple delimiters and quoted values containing line breaks are supported; encodings beyond UTF-8 depend on browser support."
        }
    });

    /* ==================== DOM ==================== */
    const $ = id => document.getElementById(id);
    const qsa = sel => Array.prototype.slice.call(document.querySelectorAll(sel));

    const fileInput = $('dropzone-file');
    const fileNameDisplay = $('file-name-display');
    const dropzone = $('dropzone');
    const statusArea = $('status-area');
    const step2 = $('step-2');
    const step3 = $('step-3');
    const step4 = $('step-4');
    const step5 = $('step-5');
    const step1Label = $('step-1-label');
    const step3Label = $('step-3-label');
    const sheetsContainer = $('sheets-container');
    const sheetsAll = $('sheets-all');
    const columnsContainer = $('columns-container');
    const methodsContainer = $('methods-container');
    const passwordContainer = $('password-container');
    const cryptoPassword = $('crypto-password');
    const processBtn = $('process-btn');
    const processBtnText = processBtn.querySelector('span');
    const downloadBtn = $('download-btn');
    const downloadBtnText = downloadBtn.querySelector('span');
    const previewThead = $('preview-thead');
    const previewTbody = $('preview-tbody');
    const previewTabs = $('preview-tabs');
    const statsBox = $('stats-box');
    const statsContent = $('stats-content');
    const summaryContent = $('summary-content');
    const irreversibleWarning = $('irreversible-warning');
    const webcryptoWarning = $('webcrypto-warning');
    const csvOptions = $('csv-options');
    const csvDelimiterSel = $('csv-delimiter');
    const csvDelimiterHint = $('csv-delimiter-hint');
    const csvEncodingSel = $('csv-encoding');
    const csvBom = $('csv-bom');
    const csvTypes = $('csv-types');
    const progressWrap = $('progress-wrap');
    const progressFill = $('progress-fill');
    const progressLabel = $('progress-label');
    const formatWarningsText = $('format-warnings-text');
    const infoType = $('info-type');
    const infoSheets = $('info-sheets');
    const infoRows = $('info-rows');
    const infoCols = $('info-cols');

    /* ==================== state ==================== */
    const state = {
        mode: 'anon',
        file: null,          // {name, base, ext, kind:'csv'|'excel'}
        buffer: null,        // ArrayBuffer of the original file
        workbook: null,      // SheetJS workbook (excel only)
        sheets: [],          // sheet models
        selectedSheets: new Set(),
        colCfg: new Map(),   // "sheetIdx:colIdx" -> {selected, method}
        pseudoMaps: new Map(), // "sheetIdx:colIdx" -> {map, used, counter}
        globalMethod: 'mask-full',
        processed: null,     // {sheets: [matrix|null]}
        previewSheetIdx: 0,
        stats: null,
        lastMessages: [],
        exported: false,
        csv: {
            encoding: 'utf-8',
            delimiter: ',',
            detectedDelimiter: null,
            bomOut: true,
            inferTypes: false,
            text: ''
        }
    };

    /* ==================== status messages ==================== */
    function showMessages(list) {
        state.lastMessages = list || [];
        renderMessages();
    }

    function renderMessages() {
        statusArea.innerHTML = '';
        if (!state.lastMessages.length) {
            statusArea.classList.add('hidden');
            return;
        }
        const classes = {
            error: 'border-red-200 bg-red-50 text-red-800',
            warn: 'border-yellow-200 bg-yellow-50 text-yellow-800',
            ok: 'border-green-200 bg-green-50 text-green-800',
            info: 'border-blue-200 bg-blue-50 text-blue-800'
        };
        state.lastMessages.forEach(m => {
            const div = document.createElement('div');
            div.className = 'border rounded-lg p-3 text-sm mb-2 ' + (classes[m.type] || classes.info);
            div.setAttribute('role', m.type === 'error' ? 'alert' : 'status');
            div.textContent = tf(m.key, m.vars);
            statusArea.appendChild(div);
        });
        statusArea.classList.remove('hidden');
    }

    function clearStatus() {
        state.lastMessages = [];
        statusArea.innerHTML = '';
        statusArea.classList.add('hidden');
    }

    /* ==================== helpers ==================== */
    function extOf(name) {
        const i = name.lastIndexOf('.');
        return i < 0 ? '' : name.slice(i + 1).toLowerCase();
    }

    function baseOf(name) {
        const i = name.lastIndexOf('.');
        return i < 0 ? name : name.slice(0, i);
    }

    function isEmptyValue(v) {
        return v === null || v === undefined || v === '';
    }

    function formatCellValue(v) {
        if (v === null || v === undefined) return '';
        if (v instanceof Date) return formatDate(v);
        if (typeof v === 'number') return String(v);
        if (typeof v === 'boolean') return v ? 'true' : 'false';
        return String(v);
    }

    function pad2(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function formatDate(d) {
        const base = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
        if (d.getHours() || d.getMinutes() || d.getSeconds()) {
            return base + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
        }
        return base;
    }

    function tagValue(v) {
        if (v instanceof Date) return ['d', v.toISOString()];
        if (typeof v === 'number') return ['n', v];
        if (typeof v === 'boolean') return ['b', v];
        return ['s', String(v)];
    }

    function untagValue(a) {
        if (!Array.isArray(a) || typeof a[0] !== 'string') throw new Error('bad payload');
        const tag = a[0];
        const val = a[1];
        if (tag === 'n') {
            const n = Number(val);
            return Number.isFinite(n) ? n : String(val);
        }
        if (tag === 'b') return val === true || val === 'true';
        if (tag === 'd') {
            const d = new Date(val);
            return isNaN(d.getTime()) ? String(val) : d;
        }
        return String(val);
    }

    async function encryptValue(value, key, saltB64) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const payload = JSON.stringify(tagValue(value));
        const ct = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv }, key, textEncoder.encode(payload)
        );
        return ENC_PREFIX + saltB64 + '.' + bytesToB64u(iv) + '.' + bytesToB64u(new Uint8Array(ct));
    }

    async function decryptToken(token, password, keyCache) {
        if (!webCryptoAvailable) throw new Error('no-webcrypto');
        const parts = token.split('.');
        if (parts.length !== 4 || parts[0] !== 'ENCv1') throw new Error('bad format');
        const saltB64 = parts[1];
        let key = keyCache.get(saltB64);
        if (!key) {
            key = await deriveKey(password, b64uToBytes(saltB64));
            keyCache.set(saltB64, key);
        }
        const iv = b64uToBytes(parts[2]);
        const ct = b64uToBytes(parts[3]);
        const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ct);
        const parsed = JSON.parse(textDecoderUtf8.decode(plain));
        return untagValue(parsed);
    }

    function isEncryptedValue(v) {
        const s = String(v);
        return s.startsWith(ENC_PREFIX) || s.startsWith(LEGACY_PREFIX);
    }

    const TOKEN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    function randomToken(length) {
        const arr = window.crypto.getRandomValues(new Uint8Array(length));
        let out = '';
        for (let i = 0; i < length; i++) out += TOKEN_ALPHABET[arr[i] % TOKEN_ALPHABET.length];
        return out;
    }

    /* ==================== transformations ==================== */
    function maskStringValue() {
        const v = $('opt-mask').value;
        return v.length > 0 ? v : '***';
    }

    function partialMask(v) {
        const s = (v instanceof Date) ? formatDate(v) : String(v);
        const ks = Math.max(0, parseInt($('opt-keep-start').value, 10) || 0);
        const ke = Math.max(0, parseInt($('opt-keep-end').value, 10) || 0);
        const mask = maskStringValue();
        if (s.length <= ks + ke) return mask;
        return s.slice(0, ks) + mask + s.slice(s.length - ke);
    }

    function generalizeValue(v) {
        const bin = Math.max(1, Math.floor(Number($('opt-gen-bin').value) || 10));
        if (typeof v === 'number' && isFinite(v)) {
            const lo = Math.floor(v / bin) * bin;
            const hi = lo + bin - 1;
            if ($('opt-gen-output').value === 'lower') return { value: lo };
            return { value: lo + '-' + hi };
        }
        return { unchanged: true };
    }

    function getPseudoId(si, ci, value) {
        const key = si + ':' + ci;
        let entry = state.pseudoMaps.get(key);
        if (!entry) {
            entry = { map: new Map(), used: new Set(), counter: 0 };
            state.pseudoMaps.set(key, entry);
        }
        const vk = (value instanceof Date ? 'd:' + value.getTime() : typeof value + ':' + String(value));
        const existing = entry.map.get(vk);
        if (existing !== undefined) return existing;

        let id;
        if ($('opt-pseudo-format').value === 'seq') {
            entry.counter += 1;
            id = 'ID_' + String(entry.counter).padStart(6, '0');
        } else {
            let tries = 0;
            do {
                id = 'ID_' + randomToken(10);
                tries += 1;
            } while (entry.used.has(id) && tries < 50);
        }
        entry.map.set(vk, id);
        entry.used.add(id);
        return id;
    }

    async function transformAnonValue(v, method, ctx) {
        switch (method) {
            case 'mask-full':
                return { value: maskStringValue() };
            case 'mask-partial':
                return { value: partialMask(v) };
            case 'random-id':
                return { value: getPseudoId(ctx.si, ctx.ci, v) };
            case 'generalize': {
                const g = generalizeValue(v);
                if (g.unchanged) {
                    ctx.stats.notGen += 1;
                    return { value: v, unchanged: true };
                }
                return { value: g.value };
            }
            case 'encrypt':
                return { value: await encryptValue(v, ctx.key, ctx.saltB64) };
            default:
                return { value: maskStringValue() };
        }
    }

    /* ==================== CSV ==================== */
    function delimiterValue() {
        const v = csvDelimiterSel.value;
        return v === 'tab' ? '\t' : v;
    }

    function parseCSV(text, delim) {
        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;
        let i = 0;
        const n = text.length;
        while (i < n) {
            const ch = text[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (text[i + 1] === '"') {
                        field += '"';
                        i += 2;
                        continue;
                    }
                    inQuotes = false;
                    i += 1;
                    continue;
                }
                field += ch;
                i += 1;
                continue;
            }
            if (ch === '"' && field === '') {
                inQuotes = true;
                i += 1;
                continue;
            }
            if (ch === delim) {
                row.push(field);
                field = '';
                i += 1;
                continue;
            }
            if (ch === '\n' || ch === '\r') {
                if (ch === '\r' && text[i + 1] === '\n') i += 1;
                row.push(field);
                field = '';
                rows.push(row);
                row = [];
                i += 1;
                continue;
            }
            field += ch;
            i += 1;
        }
        if (field !== '' || row.length > 0) {
            row.push(field);
            rows.push(row);
        }
        return rows;
    }

    function detectDelimiter(text) {
        const cands = [',', ';', '\t', '|'];
        const sample = text.slice(0, 30000);
        let best = null;
        let bestFields = 1;
        let bestConsistency = 0;
        for (const d of cands) {
            const rows = parseCSV(sample, d).slice(0, 12).filter(r => r.some(f => f !== ''));
            if (!rows.length) continue;
            const counts = rows.map(r => r.length);
            const modalCount = counts.slice().sort((a, b) =>
                counts.filter(c => c === b).length - counts.filter(c => c === a).length
            )[0];
            const consistent = counts.filter(c => c === modalCount).length / counts.length;
            if (modalCount > bestFields || (modalCount === bestFields && consistent > bestConsistency)) {
                if (modalCount > 1 || best === null) {
                    best = d;
                    bestFields = modalCount;
                    bestConsistency = consistent;
                }
            }
        }
        if (best === null || bestFields <= 1) return { delim: best, confident: false };
        return { delim: best, confident: bestConsistency >= 0.6 };
    }

    function detectBOM(bytes) {
        if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) return 'utf-8';
        if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) return 'utf-16le';
        if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) return 'utf-16be';
        return null;
    }

    function decodeCSVText() {
        const bytes = new Uint8Array(state.buffer);
        try {
            const dec = new TextDecoder(state.csv.encoding, { fatal: false });
            state.csv.text = dec.decode(bytes);
        } catch (e) {
            state.csv.text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
        }
    }

    function csvEscape(value) {
        if (value === null || value === undefined) return '';
        const s = value instanceof Date ? formatDate(value) : String(value);
        if (s.indexOf('"') !== -1 || s.indexOf(',') !== -1 || s.indexOf(';') !== -1 ||
            s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1 || s.indexOf('\t') !== -1) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    }

    function serializeCSV(matrix, delim, withBom) {
        const lines = matrix.map(row => row.map(csvEscape).join(delim));
        const body = lines.join('\r\n');
        return withBom ? '\ufeff' + body : body;
    }

    /* ==================== file loading ==================== */
    let loadingFile = false;

    async function handleFile(file) {
        if (!file || loadingFile) return;
        const ext = extOf(file.name);
        if (['xlsx', 'xlsm', 'xls', 'csv'].indexOf(ext) === -1) {
            showMessages([{ type: 'error', key: 'alertUnsupported' }]);
            return;
        }
        loadingFile = true;
        clearStatus();
        try {
            const buffer = await file.arrayBuffer();
            resetAfterLoad();
            state.file = { name: file.name, base: baseOf(file.name), ext: ext, kind: ext === 'csv' ? 'csv' : 'excel' };
            state.buffer = buffer;
            fileNameDisplay.textContent = file.name;
            fileNameDisplay.removeAttribute('data-i18n');
            fileNameDisplay.classList.add('text-blue-600', 'font-medium');

            if (state.file.kind === 'csv') {
                csvOptions.classList.remove('hidden');
                loadCSV();
            } else {
                csvOptions.classList.add('hidden');
                loadWorkbook();
            }

            if (state.sheets.length === 0) {
                showMessages([{ type: 'error', key: 'alertEmpty' }]);
                loadingFile = false;
                return;
            }

            renderSheetSelector();
            renderColumns();
            renderInfo();
            renderFormatWarning();
            renderSummary();
            updateWorkflow();

            step2.classList.remove('hidden');
            setTimeout(() => step2.classList.remove('opacity-0'), 50);
            step3.classList.remove('hidden');
            step4.classList.remove('hidden');
        } catch (e) {
            showMessages([{ type: 'error', key: 'alertError' }]);
        }
        loadingFile = false;
    }

    function resetAfterLoad() {
        state.workbook = null;
        state.sheets = [];
        state.selectedSheets = new Set();
        state.colCfg = new Map();
        state.pseudoMaps = new Map();
        state.processed = null;
        state.stats = null;
        state.exported = false;
        state.previewSheetIdx = 0;
        cryptoPassword.value = '';
        step5.classList.add('hidden');
        statsBox.classList.add('hidden');
        progressWrap.classList.add('hidden');
        clearStatus();
    }

    function buildSheetModel(ws, name, idx) {
        const model = { idx: idx, name: name, empty: false, origin: { r: 0, c: 0 }, headers: [], matrix: [], dataRows: 0, colCount: 0 };
        if (!ws || !ws['!ref']) {
            model.empty = true;
            return model;
        }
        let ref;
        try {
            ref = XLSX.utils.decode_range(ws['!ref']);
        } catch (e) {
            model.empty = true;
            return model;
        }
        model.origin = { r: ref.s.r, c: ref.s.c };
        const matrix = [];
        for (let R = ref.s.r; R <= ref.e.r; R++) {
            const row = [];
            for (let C = ref.s.c; C <= ref.e.c; C++) {
                const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                row.push(cell && ('v' in cell) ? cell.v : null);
            }
            matrix.push(row);
        }
        return fillSheetModel(model, matrix, name, idx);
    }

    function fillSheetModel(model, matrix, name, idx) {
        model.idx = idx;
        model.name = name;
        model.matrix = matrix;
        if (matrix.length === 0) {
            model.empty = true;
            return model;
        }
        let cols = 0;
        matrix.forEach(r => { if (r.length > cols) cols = r.length; });
        matrix.forEach(r => { while (r.length < cols) r.push(null); });
        model.colCount = cols;
        model.headers = matrix[0].map((h, i) => ({
            raw: (h === null || h === undefined) ? '' : String(h),
            index: i
        }));
        model.dataRows = matrix.length - 1;
        if (cols === 0) model.empty = true;
        return model;
    }

    function loadWorkbook() {
        const wb = XLSX.read(state.buffer, {
            type: 'array',
            cellDates: true,
            cellStyles: true,
            cellFormula: true
        });
        state.workbook = wb;
        state.sheets = wb.SheetNames.map((name, i) => buildSheetModel(wb.Sheets[name], name, i));
        const anyData = state.sheets.some(s => !s.empty);
        state.selectedSheets = new Set(state.sheets.map(s => s.idx));
        if (!anyData) state.sheets = [];
    }

    function loadCSV() {
        const bom = detectBOM(new Uint8Array(state.buffer));
        if (bom) {
            state.csv.encoding = bom;
            csvEncodingSel.value = bom;
        } else {
            state.csv.encoding = csvEncodingSel.value;
        }
        decodeCSVText();
        const det = detectDelimiter(state.csv.text);
        state.csv.detectedDelimiter = det.delim;
        if (det.delim) {
            state.csv.delimiter = det.delim;
            csvDelimiterSel.value = det.delim === '\t' ? 'tab' : det.delim;
        } else {
            state.csv.delimiter = ',';
            csvDelimiterSel.value = ',';
        }
        updateDelimiterHint(det);
        reparseCSV();
    }

    function updateDelimiterHint(det) {
        if (det && det.delim && det.confident) {
            csvDelimiterHint.textContent = tf('csvDetected', { d: det.delim === '\t' ? 'TAB' : det.delim });
        } else {
            csvDelimiterHint.textContent = t('csvNotDetected');
        }
    }

    function inferCsvField(s) {
        if (typeof s !== 'string' || s === '') return s;
        if (s.length <= 15 && /^-?(0|[1-9]\d*)(\.\d+)?$/.test(s)) {
            const n = Number(s);
            if (Number.isFinite(n)) return n;
        }
        return s;
    }

    function reparseCSV() {
        const rows = parseCSV(state.csv.text, delimiterValue());
        if (state.csv.inferTypes) {
            for (let r = 1; r < rows.length; r++) {
                rows[r] = rows[r].map(inferCsvField);
            }
        }
        const model = { idx: 0, name: baseOf(state.file.name), empty: false, origin: { r: 0, c: 0 }, headers: [], matrix: [], dataRows: 0, colCount: 0 };
        fillSheetModel(model, rows, model.name, 0);
        state.sheets = [model];
        state.workbook = null;
        state.selectedSheets = new Set([0]);
        if (model.empty) state.sheets = [];
        state.processed = null;
        step5.classList.add('hidden');
        statsBox.classList.add('hidden');
        renderSheetSelector();
        renderColumns();
        renderInfo();
        renderSummary();
        updateWorkflow();
        if (model.empty) showMessages([{ type: 'error', key: 'alertEmpty' }]);
    }

    /* ==================== rendering ==================== */
    function colLabel(si, ci) {
        const sheet = state.sheets[si];
        if (!sheet) return '';
        const h = sheet.headers[ci];
        const raw = h ? h.raw.trim() : '';
        const name = raw === '' ? tf('colPlaceholder', { n: ci + 1 }) : raw;
        return name + ' [C' + (ci + 1) + ']';
    }

    function countEncValues(sheet, ci) {
        let n = 0;
        for (let r = 1; r < sheet.matrix.length; r++) {
            const v = sheet.matrix[r][ci];
            if (!isEmptyValue(v) && isEncryptedValue(v)) n++;
        }
        return n;
    }

    function renderSheetSelector() {
        sheetsContainer.innerHTML = '';
        state.sheets.forEach(sheet => {
            const label = document.createElement('label');
            label.className = 'flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer gap-2';

            const left = document.createElement('span');
            left.className = 'flex items-center gap-2 min-w-0';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'sheet-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0';
            cb.setAttribute('data-sheet', String(sheet.idx));
            cb.checked = state.selectedSheets.has(sheet.idx);

            const nm = document.createElement('span');
            nm.className = 'text-sm font-medium text-gray-700 truncate';
            nm.textContent = sheet.name;
            nm.title = sheet.name;

            const meta = document.createElement('span');
            meta.className = 'text-xs text-gray-400 flex-shrink-0';
            meta.textContent = sheet.empty
                ? t('sheetEmpty')
                : tf('sheetMeta', { r: sheet.dataRows, c: sheet.colCount });

            left.appendChild(cb);
            left.appendChild(nm);
            label.appendChild(left);
            label.appendChild(meta);
            sheetsContainer.appendChild(label);
        });
        sheetsAll.checked = state.sheets.length > 0 && state.selectedSheets.size === state.sheets.length;
    }

    function makeOption(value, label, selected) {
        const o = document.createElement('option');
        o.value = value;
        o.textContent = label;
        if (selected) o.selected = true;
        return o;
    }

    function methodOptions(selected) {
        return [
            ['global', t('optGlobal')],
            ['mask-full', t('methodFull')],
            ['mask-partial', t('methodPartial')],
            ['random-id', t('methodRandom')],
            ['generalize', t('methodGeneralize')],
            ['encrypt', t('methodEncrypt')]
        ].map(pair => makeOption(pair[0], pair[1], selected === pair[0]));
    }

    function getCfg(si, ci) {
        const key = si + ':' + ci;
        let cfg = state.colCfg.get(key);
        if (!cfg) {
            cfg = { selected: false, method: 'global' };
            state.colCfg.set(key, cfg);
        }
        return cfg;
    }

    function effectiveMethod(cfg) {
        if (state.mode === 'deanon') return 'decrypt';
        return cfg.method === 'global' ? state.globalMethod : cfg.method;
    }

    function renderColumns() {
        columnsContainer.innerHTML = '';
        if (!state.sheets.length) return;
        const visible = state.sheets.filter(s => state.selectedSheets.has(s.idx));

        if (!visible.length) {
            const p = document.createElement('p');
            p.className = 'text-sm text-gray-500 p-2';
            p.textContent = t('alertSelectSheet');
            columnsContainer.appendChild(p);
            return;
        }

        visible.forEach(sheet => {
            const group = document.createElement('div');
            group.className = 'border border-gray-200 rounded-md bg-white overflow-hidden';

            const head = document.createElement('div');
            head.className = 'flex items-center justify-between px-3 py-1.5 bg-blue-50 border-b border-blue-100 gap-2';

            const title = document.createElement('span');
            title.className = 'text-xs font-semibold text-blue-800 truncate';
            title.textContent = sheet.name;
            title.title = sheet.name;

            const headRight = document.createElement('span');
            headRight.className = 'flex items-center gap-2 flex-shrink-0';

            if (!sheet.empty) {
                const allLabel = document.createElement('label');
                allLabel.className = 'flex items-center text-xs text-blue-700 cursor-pointer';
                const allCb = document.createElement('input');
                allCb.type = 'checkbox';
                allCb.className = 'js-sheet-cols w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-1';
                allCb.setAttribute('data-sheet', String(sheet.idx));
                const selectedCount = countSelectedInSheet(sheet.idx);
                allCb.checked = sheet.colCount > 0 && selectedCount === sheet.colCount;
                const allSpan = document.createElement('span');
                allSpan.textContent = t('colAllInSheet');
                allLabel.appendChild(allCb);
                allLabel.appendChild(allSpan);
                headRight.appendChild(allLabel);
            }

            head.appendChild(title);
            head.appendChild(headRight);
            group.appendChild(head);

            if (sheet.empty) {
                const p = document.createElement('p');
                p.className = 'text-xs text-gray-500 p-3';
                p.textContent = t('sheetEmptyNote');
                group.appendChild(p);
                columnsContainer.appendChild(group);
                return;
            }

            if (sheet.colCount === 0) {
                const p = document.createElement('p');
                p.className = 'text-xs text-gray-500 p-3';
                p.textContent = t('noCols');
                group.appendChild(p);
                columnsContainer.appendChild(group);
                return;
            }

            const list = document.createElement('div');
            list.className = 'divide-y divide-gray-100';

            for (let ci = 0; ci < sheet.colCount; ci++) {
                const cfg = getCfg(sheet.idx, ci);
                const row = document.createElement('div');
                row.className = 'flex items-start gap-2 px-3 py-2';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'column-checkbox mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0';
                cb.setAttribute('data-sheet', String(sheet.idx));
                cb.setAttribute('data-col', String(ci));
                cb.checked = cfg.selected;

                const body = document.createElement('div');
                body.className = 'flex-1 min-w-0';

                const top = document.createElement('div');
                top.className = 'flex items-center justify-between gap-2';
                const nameSpan = document.createElement('span');
                nameSpan.className = 'text-sm font-medium text-gray-700 truncate';
                nameSpan.textContent = colLabel(sheet.idx, ci);
                nameSpan.title = colLabel(sheet.idx, ci);
                top.appendChild(nameSpan);

                if (state.mode === 'deanon') {
                    const enc = countEncValues(sheet, ci);
                    if (enc > 0) {
                        const badge = document.createElement('span');
                        badge.className = 'text-xs text-blue-600 flex-shrink-0';
                        badge.textContent = tf('colEncCount', { n: enc });
                        top.appendChild(badge);
                    }
                }
                body.appendChild(top);

                if (state.mode === 'anon') {
                    const controls = document.createElement('div');
                    controls.className = 'mt-1 flex flex-wrap gap-1.5';

                    const methodSel = document.createElement('select');
                    methodSel.className = 'column-select method-select text-xs border border-gray-300 rounded px-1.5 py-0.5 bg-white text-gray-700';
                    methodSel.setAttribute('data-sheet', String(sheet.idx));
                    methodSel.setAttribute('data-col', String(ci));
                    methodSel.setAttribute('aria-label', t('colMethodLabel'));
                    methodOptions(cfg.method).forEach(o => methodSel.appendChild(o));

                    controls.appendChild(methodSel);
                    body.appendChild(controls);
                }

                row.appendChild(cb);
                row.appendChild(body);
                list.appendChild(row);
            }

            group.appendChild(list);
            columnsContainer.appendChild(group);
        });
    }

    function countSelectedInSheet(si) {
        let n = 0;
        const sheet = state.sheets[si];
        if (!sheet) return 0;
        for (let ci = 0; ci < sheet.colCount; ci++) {
            const cfg = state.colCfg.get(si + ':' + ci);
            if (cfg && cfg.selected) n++;
        }
        return n;
    }

    function collectJobs() {
        const jobs = [];
        state.colCfg.forEach((cfg, key) => {
            if (!cfg.selected) return;
            const parts = key.split(':');
            const si = parseInt(parts[0], 10);
            const ci = parseInt(parts[1], 10);
            if (!state.selectedSheets.has(si)) return;
            const sheet = state.sheets[si];
            if (!sheet || ci >= sheet.colCount) return;
            jobs.push({ si: si, ci: ci, method: effectiveMethod(cfg) });
        });
        jobs.sort((a, b) => (a.si - b.si) || (a.ci - b.ci));
        return jobs;
    }

    function methodLabel(method) {
        switch (method) {
            case 'mask-full': return t('methodFull');
            case 'mask-partial': return t('methodPartial');
            case 'random-id': return t('methodRandom');
            case 'generalize': return t('methodGeneralize');
            case 'encrypt': return t('methodEncrypt');
            case 'decrypt': return t('methodDecrypt');
            default: return method;
        }
    }

    function renderSummary() {
        summaryContent.innerHTML = '';
        if (!state.sheets.length) return;
        const line = document.createElement('p');
        line.className = 'text-xs text-gray-500';
        line.textContent = tf('summarySheets', { n: state.selectedSheets.size, t: state.sheets.length });
        summaryContent.appendChild(line);

        const jobs = collectJobs();
        if (!jobs.length) {
            const p = document.createElement('p');
            p.className = 'text-sm text-gray-500';
            p.textContent = t('summaryNone');
            summaryContent.appendChild(p);
            return;
        }
        const sheetsWithJobs = new Set(jobs.map(j => j.si));
        jobs.forEach(j => {
            const p = document.createElement('p');
            p.className = 'text-xs text-gray-700';
            p.textContent = tf('summaryLine', {
                sheet: state.sheets[j.si].name,
                col: colLabel(j.si, j.ci),
                method: methodLabel(j.method)
            });
            summaryContent.appendChild(p);
        });
        state.selectedSheets.forEach(si => {
            if (sheetsWithJobs.has(si)) return;
            const p = document.createElement('p');
            p.className = 'text-xs text-gray-400 italic';
            p.textContent = tf('summaryUnchanged', { sheet: state.sheets[si].name });
            summaryContent.appendChild(p);
        });
    }

    function renderInfo() {
        infoType.textContent = state.file ? state.file.ext.toUpperCase() : '-';
        infoSheets.textContent = String(state.sheets.length);
        let rows = 0;
        let cols = 0;
        state.sheets.forEach(s => {
            if (state.selectedSheets.has(s.idx) && !s.empty) {
                rows += s.dataRows;
                cols += s.colCount;
            }
        });
        infoRows.textContent = String(rows);
        infoCols.textContent = String(cols);
    }

    function renderFormatWarning() {
        if (!state.file) return;
        if (state.file.kind === 'csv') formatWarningsText.textContent = t('warnCsv');
        else if (state.file.ext === 'xls') formatWarningsText.textContent = t('warnXls');
        else if (state.file.ext === 'xlsm') formatWarningsText.textContent = t('warnXlsm');
        else formatWarningsText.textContent = t('warnXlsx');
    }

    function renderPreview() {
        previewThead.innerHTML = '';
        previewTbody.innerHTML = '';
        previewTabs.innerHTML = '';
        if (!state.processed) return;

        const sheetIndices = [];
        state.processed.sheets.forEach((m, i) => { if (m) sheetIndices.push(i); });
        if (!sheetIndices.length) return;
        if (sheetIndices.indexOf(state.previewSheetIdx) === -1) state.previewSheetIdx = sheetIndices[0];

        sheetIndices.forEach(si => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'text-xs px-2 py-1 rounded border transition-colors ' +
                (si === state.previewSheetIdx
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50');
            b.textContent = state.sheets[si].name;
            b.setAttribute('data-preview-sheet', String(si));
            previewTabs.appendChild(b);
        });

        const si = state.previewSheetIdx;
        const sheet = state.sheets[si];
        const matrix = state.processed.sheets[si];

        const trHead = document.createElement('tr');
        for (let ci = 0; ci < sheet.colCount; ci++) {
            const th = document.createElement('th');
            th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
            th.textContent = colLabel(si, ci);
            trHead.appendChild(th);
        }
        previewThead.appendChild(trHead);

        const dataRows = matrix.slice(1);
        if (!dataRows.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = Math.max(sheet.colCount, 1);
            td.className = 'px-6 py-4 text-center text-sm text-gray-400 italic';
            td.textContent = t('previewNoRows');
            tr.appendChild(td);
            previewTbody.appendChild(tr);
            return;
        }

        const previewLimit = Math.min(dataRows.length, 10);
        for (let i = 0; i < previewLimit; i++) {
            const row = dataRows[i];
            const tr = document.createElement('tr');
            for (let ci = 0; ci < sheet.colCount; ci++) {
                const td = document.createElement('td');
                td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-700';
                td.textContent = formatCellValue(row[ci]);
                tr.appendChild(td);
            }
            previewTbody.appendChild(tr);
        }

        if (dataRows.length > 10) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = Math.max(sheet.colCount, 1);
            td.className = 'px-6 py-3 text-center text-sm text-gray-400 italic bg-gray-50';
            td.textContent = tf('moreRows', { n: dataRows.length - 10 });
            tr.appendChild(td);
            previewTbody.appendChild(tr);
        }
    }

    function renderStats() {
        statsContent.innerHTML = '';
        if (!state.stats) {
            statsBox.classList.add('hidden');
            return;
        }
        const s = state.stats;
        const items = [];
        if (state.mode === 'anon') {
            if (s.processed > 0) items.push(tf('statsProcessed', { n: s.processed }));
            if (s.empty > 0) items.push(tf('statsEmpty', { n: s.empty }));
            if (s.skippedEnc > 0) items.push(tf('statsSkippedEnc', { n: s.skippedEnc }));
            if (s.notGen > 0) items.push(tf('statsNotGen', { n: s.notGen }));
            if (s.legacy > 0) items.push(tf('statsLegacyAnon', { n: s.legacy }));
        } else {
            if (s.processed > 0) items.push(tf('statsDecrypted', { n: s.processed }));
            if (s.plain > 0) items.push(tf('statsPlain', { n: s.plain }));
            if (s.legacy > 0) items.push(tf('statsLegacyDeanon', { n: s.legacy }));
        }
        if (!items.length) {
            statsBox.classList.add('hidden');
            return;
        }
        items.forEach(txt => {
            const li = document.createElement('li');
            li.textContent = txt;
            statsContent.appendChild(li);
        });
        statsBox.classList.remove('hidden');
    }

    function setProgress(pct, label) {
        const p = Math.max(0, Math.min(100, Math.round(pct * 100)));
        progressFill.style.width = p + '%';
        progressWrap.setAttribute('aria-valuenow', String(p));
        if (label !== undefined) progressLabel.textContent = label;
    }

    function showProgress(show) {
        progressWrap.classList.toggle('hidden', !show);
        if (show) setProgress(0, '');
    }

    /* ==================== workflow / mode / visibility ==================== */
    function updateWorkflow() {
        let active = 1;
        let done = 0;
        if (state.file) {
            const anyJob = collectJobs().length > 0;
            if (state.processed) {
                active = 6;
                done = state.exported ? 6 : 5;
            } else if (anyJob) {
                active = 4;
                done = 3;
            } else {
                active = 3;
                done = 2;
            }
        }
        qsa('#workflow-steps .wf-step').forEach(li => {
            const n = parseInt(li.getAttribute('data-step'), 10);
            li.classList.toggle('wf-active', n === active && n !== done);
            li.classList.toggle('wf-done', n <= done);
        });
    }

    function usesEncrypt() {
        if (state.mode === 'deanon') return true;
        if (state.globalMethod === 'encrypt') return true;
        return collectJobs().some(j => j.method === 'encrypt');
    }

    function updatePasswordVisibility() {
        passwordContainer.classList.toggle('hidden', !usesEncrypt());
    }

    function updateIrreversibleWarning() {
        if (state.mode !== 'anon') {
            irreversibleWarning.classList.add('hidden');
            return;
        }
        const irreversible = collectJobs().some(j => j.method !== 'encrypt');
        irreversibleWarning.classList.toggle('hidden', !irreversible);
    }

    function updateModeUI() {
        const isAnon = state.mode === 'anon';
        qsa('.anon-only').forEach(el => el.classList.toggle('hidden', !isAnon));
        step1Label.setAttribute('data-i18n', isAnon ? 'step1Anon' : 'step1Deanon');
        step3Label.setAttribute('data-i18n', isAnon ? 'step3Title' : 'step3TitleDeanon');
        processBtnText.setAttribute('data-i18n', isAnon ? 'btnPreviewAnon' : 'btnPreviewDeanon');
        downloadBtnText.setAttribute('data-i18n', isAnon ? 'btnDownloadAnon' : 'btnDownloadDeanon');
        applyI18n();
        renderColumns();
        renderSummary();
        updatePasswordVisibility();
        updateIrreversibleWarning();
        updateWorkflow();
    }

    /* ==================== processing ==================== */
    function groupJobsBySheet(jobs) {
        const map = new Map();
        jobs.forEach(j => {
            if (!map.has(j.si)) map.set(j.si, []);
            map.get(j.si).push(j);
        });
        return map;
    }

    function countTotalCells(bySheet) {
        let total = 0;
        bySheet.forEach((cols, si) => {
            const sheet = state.sheets[si];
            cols.forEach(j => {
                for (let r = 1; r < sheet.matrix.length; r++) {
                    if (!isEmptyValue(sheet.matrix[r][j.ci])) total++;
                }
            });
        });
        return total;
    }

    async function handleProcess() {
        if (processBtn.disabled) return;
        clearStatus();
        const jobs = collectJobs();
        if (state.selectedSheets.size === 0) {
            showMessages([{ type: 'error', key: 'alertSelectSheet' }]);
            return;
        }
        if (!jobs.length) {
            showMessages([{ type: 'error', key: 'alertSelectCol' }]);
            return;
        }
        const needsPassword = usesEncrypt();
        if (needsPassword && !webCryptoAvailable) {
            showMessages([{ type: 'error', key: 'errWebCrypto' }]);
            return;
        }
        const password = cryptoPassword.value;
        if (needsPassword && !password) {
            showMessages([{ type: 'error', key: 'alertPwd' }]);
            return;
        }
        if (state.mode === 'anon') {
            const irreversible = jobs.some(j => j.method !== 'encrypt');
            if (irreversible && !window.confirm(t('confirmIrreversible'))) return;
        }

        processBtn.disabled = true;
        showProgress(true);
        try {
            if (state.mode === 'anon') await runAnonymization(jobs, password);
            else await runDecryption(jobs, password);
            state.exported = false;
            renderPreview();
            renderStats();
            step5.classList.remove('hidden');
        } catch (err) {
            state.processed = null;
            step5.classList.add('hidden');
            statsBox.classList.add('hidden');
            const msg = (err && err.message) ? err.message : '';
            if (msg === 'decrypt-failed-partial') {
                showMessages([{ type: 'error', key: 'errDecryptCount', vars: { n: err.count } }]);
            } else if (msg.indexOf('decrypt-failed') === 0) {
                showMessages([{ type: 'error', key: 'errDecryptGeneric' }]);
            } else {
                showMessages([{ type: 'error', key: 'alertError' }]);
            }
        } finally {
            processBtn.disabled = false;
            cryptoPassword.value = '';
            showProgress(false);
            updateWorkflow();
        }
    }

    async function runAnonymization(jobs, password) {
        const bySheet = groupJobsBySheet(jobs);
        const stats = { processed: 0, empty: 0, skippedEnc: 0, notGen: 0, legacy: 0, plain: 0 };
        let key = null;
        let saltB64 = null;

        if (jobs.some(j => j.method === 'encrypt')) {
            setProgress(0, t('progressKey'));
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            saltB64 = bytesToB64u(salt);
            key = await deriveKey(password, salt);
        }

        const total = Math.max(countTotalCells(bySheet), 1);
        let done = 0;
        setProgress(0, tf('progressCells', { n: 0, t: total }));

        const results = new Array(state.sheets.length).fill(null);

        for (const entry of bySheet) {
            const si = entry[0];
            const cols = entry[1];
            const sheet = state.sheets[si];
            const out = sheet.matrix.map(row => row.slice());

            for (const j of cols) {
                for (let r = 1; r < sheet.matrix.length; r++) {
                    const v = sheet.matrix[r][j.ci];
                    if (isEmptyValue(v)) {
                        stats.empty++;
                        continue;
                    }
                    done++;
                    if (j.method === 'encrypt' && isEncryptedValue(v)) {
                        if (String(v).startsWith(LEGACY_PREFIX)) stats.legacy++;
                        else stats.skippedEnc++;
                    } else {
                        const res = await transformAnonValue(v, j.method, {
                            key: key, saltB64: saltB64, si: si, ci: j.ci, stats: stats
                        });
                        out[r][j.ci] = res.value;
                        if (!res.unchanged) stats.processed++;
                    }
                    if (done % 256 === 0) {
                        setProgress(done / total, tf('progressCells', { n: done, t: total }));
                        await sleep(0);
                    }
                }
            }
            results[si] = out;
        }

        setProgress(1, t('progressDone'));
        state.processed = { sheets: results };
        state.stats = stats;
        state.previewSheetIdx = bySheet.keys().next().value;

        const messages = [];
        if (stats.legacy > 0) messages.push({ type: 'warn', key: 'warnLegacyAnon', vars: { n: stats.legacy } });
        messages.push({ type: 'ok', key: 'statusOkAnon', vars: { n: stats.processed } });
        showMessages(messages);
    }

    async function runDecryption(jobs, password) {
        const bySheet = groupJobsBySheet(jobs);
        const stats = { processed: 0, empty: 0, skippedEnc: 0, notGen: 0, legacy: 0, plain: 0, failures: 0 };
        const keyCache = new Map();

        let firstToken = null;
        bySheet.forEach((cols, si) => {
            if (firstToken) return;
            const sheet = state.sheets[si];
            for (const j of cols) {
                for (let r = 1; r < sheet.matrix.length; r++) {
                    const v = sheet.matrix[r][j.ci];
                    if (!isEmptyValue(v) && String(v).startsWith(ENC_PREFIX)) {
                        firstToken = String(v);
                        return;
                    }
                }
            }
        });

        if (firstToken) {
            setProgress(0, t('progressKey'));
            try {
                await decryptToken(firstToken, password, keyCache);
            } catch (e) {
                const err = new Error('decrypt-failed');
                throw err;
            }
        }

        const total = Math.max(countTotalCells(bySheet), 1);
        let done = 0;
        setProgress(0, tf('progressCells', { n: 0, t: total }));

        const results = new Array(state.sheets.length).fill(null);

        for (const entry of bySheet) {
            const si = entry[0];
            const cols = entry[1];
            const sheet = state.sheets[si];
            const out = sheet.matrix.map(row => row.slice());

            for (const j of cols) {
                for (let r = 1; r < sheet.matrix.length; r++) {
                    const v = sheet.matrix[r][j.ci];
                    if (isEmptyValue(v)) {
                        stats.empty++;
                        continue;
                    }
                    done++;
                    const s = String(v);
                    if (s.startsWith(ENC_PREFIX)) {
                        try {
                            out[r][j.ci] = await decryptToken(s, password, keyCache);
                            stats.processed++;
                        } catch (e) {
                            stats.failures++;
                        }
                    } else if (s.startsWith(LEGACY_PREFIX)) {
                        stats.legacy++;
                    } else {
                        stats.plain++;
                    }
                    if (done % 256 === 0) {
                        setProgress(done / total, tf('progressCells', { n: done, t: total }));
                        await sleep(0);
                    }
                }
            }
            results[si] = out;
        }

        if (stats.failures > 0) {
            const err = new Error('decrypt-failed-partial');
            err.count = stats.failures;
            throw err;
        }

        setProgress(1, t('progressDone'));
        state.processed = { sheets: results };
        state.stats = stats;
        state.previewSheetIdx = bySheet.keys().next().value;

        const messages = [];
        if (stats.legacy > 0) messages.push({ type: 'warn', key: 'warnLegacyDeanon', vars: { n: stats.legacy } });
        messages.push({ type: 'ok', key: 'statusOkDeanon', vars: { n: stats.processed } });
        showMessages(messages);
    }

    /* ==================== export ==================== */
    function writeCell(ws, R, C, value) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        let cell = ws[addr];
        if (!cell) {
            cell = {};
            ws[addr] = cell;
        }
        delete cell.f;
        delete cell.si;
        delete cell.w;
        delete cell.h;
        delete cell.l;
        delete cell.r;
        delete cell.q;
        delete cell.c;
        if (typeof value === 'number' && isFinite(value)) {
            cell.t = 'n';
            cell.v = value;
        } else if (typeof value === 'boolean') {
            cell.t = 'b';
            cell.v = value;
        } else if (value instanceof Date) {
            cell.t = 'd';
            cell.v = value;
            if (!cell.z) cell.z = 'yyyy-mm-dd hh:mm:ss';
        } else {
            cell.t = 's';
            cell.v = String(value);
        }
    }

    function applyResultsToWorkbook(wb) {
        state.processed.sheets.forEach((matrix, si) => {
            if (!matrix) return;
            const sheet = state.sheets[si];
            const ws = wb.Sheets[sheet.name];
            if (!ws) return;
            const src = sheet.matrix;
            for (let r = 0; r < matrix.length; r++) {
                const outRow = matrix[r];
                const srcRow = src[r];
                for (let c = 0; c < outRow.length; c++) {
                    if (outRow[c] === srcRow[c]) continue;
                    writeCell(ws, sheet.origin.r + r, sheet.origin.c + c, outRow[c]);
                }
            }
        });
    }

    function handleDownload() {
        if (!state.processed || !state.file) return;
        clearStatus();
        const suffix = state.mode === 'anon' ? t('suffixAnon') : t('suffixDeanon');
        try {
            if (state.file.kind === 'csv') {
                const matrix = state.processed.sheets[0];
                const csv = serializeCSV(matrix, delimiterValue(), state.csv.bomOut);
                downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), state.file.base + suffix + '.csv');
            } else {
                const wb = XLSX.read(state.buffer, {
                    type: 'array',
                    cellDates: true,
                    cellStyles: true,
                    cellFormula: true
                });
                applyResultsToWorkbook(wb);
                const outName = state.file.base + suffix + '.xlsx';
                XLSX.writeFile(wb, outName, { bookType: 'xlsx' });
            }
            state.exported = true;
            updateWorkflow();
            showMessages([{ type: 'info', key: 'statusDownloaded' }]);
        } catch (e) {
            showMessages([{ type: 'error', key: 'alertError' }]);
        }
    }

    /* ==================== reset ==================== */
    function resetAll() {
        fileInput.value = '';
        fileNameDisplay.textContent = t('noFile');
        fileNameDisplay.setAttribute('data-i18n', 'noFile');
        fileNameDisplay.classList.remove('text-blue-600', 'font-medium');

        state.file = null;
        state.buffer = null;
        state.workbook = null;
        state.sheets = [];
        state.selectedSheets = new Set();
        state.colCfg = new Map();
        state.pseudoMaps = new Map();
        state.processed = null;
        state.stats = null;
        state.exported = false;
        state.previewSheetIdx = 0;
        state.csv = { encoding: 'utf-8', delimiter: ',', detectedDelimiter: null, bomOut: true, inferTypes: false, text: '' };
        csvBom.checked = true;
        csvTypes.checked = false;
        csvEncodingSel.value = 'utf-8';
        csvDelimiterSel.value = ',';
        csvDelimiterHint.textContent = '';
        cryptoPassword.value = '';

        step2.classList.add('hidden');
        step2.classList.add('opacity-0');
        step3.classList.add('hidden');
        step4.classList.add('hidden');
        step5.classList.add('hidden');
        csvOptions.classList.add('hidden');
        statsBox.classList.add('hidden');
        showProgress(false);
        sheetsContainer.innerHTML = '';
        columnsContainer.innerHTML = '';
        summaryContent.innerHTML = '';
        previewThead.innerHTML = '';
        previewTbody.innerHTML = '';
        previewTabs.innerHTML = '';
        clearStatus();
        applyI18n();
        updateWorkflow();
    }

    /* ==================== events ==================== */
    onLanguageChange(() => {
        if (state.file) {
            renderSheetSelector();
            renderColumns();
            renderFormatWarning();
            renderSummary();
            renderStats();
            renderPreview();
            updateDelimiterHint({ delim: state.csv.detectedDelimiter, confident: state.csv.detectedDelimiter !== null });
        } else {
            fileNameDisplay.textContent = t('noFile');
        }
        renderMessages();
        updateWorkflow();
    });

    $('tab-anon').addEventListener('click', () => {
        state.mode = 'anon';
        $('tab-anon').classList.add('bg-white', 'shadow', 'text-blue-600');
        $('tab-anon').classList.remove('text-gray-500');
        $('tab-deanon').classList.remove('bg-white', 'shadow', 'text-blue-600');
        $('tab-deanon').classList.add('text-gray-500');
        updateModeUI();
    });

    $('tab-deanon').addEventListener('click', () => {
        state.mode = 'deanon';
        $('tab-deanon').classList.add('bg-white', 'shadow', 'text-blue-600');
        $('tab-deanon').classList.remove('text-gray-500');
        $('tab-anon').classList.remove('bg-white', 'shadow', 'text-blue-600');
        $('tab-anon').classList.add('text-gray-500');
        updateModeUI();
    });

    qsa('input[name="anon-method"]').forEach(radio => {
        radio.addEventListener('change', e => {
            state.globalMethod = e.target.value;
            updatePasswordVisibility();
            updateIrreversibleWarning();
            renderSummary();
            renderColumns();
            updateWorkflow();
        });
    });

    $('opt-pseudo-format').addEventListener('change', () => {
        state.pseudoMaps = new Map();
    });

    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    ['dragenter', 'dragover'].forEach(ev => {
        dropzone.addEventListener(ev, e => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('border-blue-600', 'bg-blue-50');
        });
    });
    ['dragleave', 'drop'].forEach(ev => {
        dropzone.addEventListener(ev, e => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('border-blue-600', 'bg-blue-50');
        });
    });
    dropzone.addEventListener('drop', e => {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    sheetsAll.addEventListener('change', () => {
        if (sheetsAll.checked) state.sheets.forEach(s => state.selectedSheets.add(s.idx));
        else state.selectedSheets.clear();
        renderSheetSelector();
        renderColumns();
        renderInfo();
        renderSummary();
        updateWorkflow();
    });

    sheetsContainer.addEventListener('change', e => {
        const el = e.target;
        if (!el.classList || !el.classList.contains('sheet-checkbox')) return;
        const si = parseInt(el.getAttribute('data-sheet'), 10);
        if (el.checked) state.selectedSheets.add(si);
        else state.selectedSheets.delete(si);
        sheetsAll.checked = state.sheets.length > 0 && state.selectedSheets.size === state.sheets.length;
        renderColumns();
        renderInfo();
        renderSummary();
        updateWorkflow();
    });

    columnsContainer.addEventListener('change', e => {
        const el = e.target;
        if (!el.classList) return;
        const si = parseInt(el.getAttribute('data-sheet'), 10);
        const ci = parseInt(el.getAttribute('data-col'), 10);

        if (el.classList.contains('column-checkbox')) {
            getCfg(si, ci).selected = el.checked;
            renderSummary();
            updatePasswordVisibility();
            updateIrreversibleWarning();
            updateWorkflow();
            const group = el.closest('.border');
            if (group) {
                const allCb = group.querySelector('.js-sheet-cols');
                if (allCb) {
                    const sheet = state.sheets[si];
                    allCb.checked = sheet.colCount > 0 && countSelectedInSheet(si) === sheet.colCount;
                }
            }
        } else if (el.classList.contains('method-select')) {
            getCfg(si, ci).method = el.value;
            renderColumns();
            renderSummary();
            updatePasswordVisibility();
            updateIrreversibleWarning();
            updateWorkflow();
        } else if (el.classList.contains('js-sheet-cols')) {
            const sheet = state.sheets[si];
            const select = el.checked;
            for (let c = 0; c < sheet.colCount; c++) getCfg(si, c).selected = select;
            renderColumns();
            renderSummary();
            updatePasswordVisibility();
            updateIrreversibleWarning();
            updateWorkflow();
        }
    });

    previewTabs.addEventListener('click', e => {
        const btn = e.target.closest('[data-preview-sheet]');
        if (!btn) return;
        state.previewSheetIdx = parseInt(btn.getAttribute('data-preview-sheet'), 10);
        renderPreview();
    });

    csvDelimiterSel.addEventListener('change', () => {
        state.csv.delimiter = delimiterValue();
        csvDelimiterHint.textContent = tf('csvDetected', {
            d: state.csv.delimiter === '\t' ? 'TAB' : state.csv.delimiter
        });
        reparseCSV();
    });

    csvEncodingSel.addEventListener('change', () => {
        state.csv.encoding = csvEncodingSel.value;
        decodeCSVText();
        reparseCSV();
    });

    csvBom.addEventListener('change', () => {
        state.csv.bomOut = csvBom.checked;
    });

    csvTypes.addEventListener('change', () => {
        state.csv.inferTypes = csvTypes.checked;
        if (state.file && state.file.kind === 'csv') reparseCSV();
    });

    processBtn.addEventListener('click', handleProcess);
    downloadBtn.addEventListener('click', handleDownload);
    qsa('.js-reset').forEach(btn => btn.addEventListener('click', resetAll));

    /* ==================== init ==================== */
    if (!webCryptoAvailable) {
        webcryptoWarning.classList.remove('hidden');
        qsa('input[name="anon-method"]').forEach(radio => {
            if (radio.value === 'encrypt') radio.disabled = true;
        });
    }

    setLanguage('it');
    updateModeUI();
    updateWorkflow();
})();
    
