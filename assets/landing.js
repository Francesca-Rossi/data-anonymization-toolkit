(function () {
    'use strict';

    const { registerTranslations, setLanguage } = AppShared;

    registerTranslations({
        it: {
            title: 'Data Anonymization Toolkit',
            landingSubtitle: 'Strumenti di anonimizzazione che funzionano interamente nel browser: nessuna AI, nessun server, i tuoi dati non lasciano il dispositivo.',
            cardSheetsTitle: 'Anonimizzatore Fogli Excel',
            cardSheetsDesc: 'Anonimizza o de-anonimizza fogli di calcolo (.xlsx, .xls, .csv) colonna per colonna: oscuramento, pseudonimi, generalizzazione e cifratura AES-256 reversibile.',
            cardTextTitle: 'Anonimizzatore Dati Sensibili',
            cardTextDesc: 'Anonimizza testi (.txt, .docx, .pdf) rilevando automaticamente codici fiscali, email, IBAN, telefoni e carte di credito, con ripristino guidato dei dati originali.',
            openTool: 'Apri lo strumento',
            landingNote: 'Tutte le elaborazioni avvengono localmente nel browser: nessun caricamento su server, nessuna analytics, nessun tracciamento. La pagina include una Content Security Policy che blocca le richieste di rete.'
        },
        en: {
            title: 'Data Anonymization Toolkit',
            landingSubtitle: 'Anonymization tools that run entirely in your browser: no AI, no server, your data never leaves your device.',
            cardSheetsTitle: 'Excel Sheets Anonymizer',
            cardSheetsDesc: 'Anonymize or de-anonymize spreadsheets (.xlsx, .xls, .csv) column by column: masking, pseudonyms, generalization and reversible AES-256 encryption.',
            cardTextTitle: 'Sensitive Data Anonymizer',
            cardTextDesc: 'Anonymize texts (.txt, .docx, .pdf) by automatically detecting fiscal codes, emails, IBANs, phone numbers and credit cards, with guided restoration of the original data.',
            openTool: 'Open the tool',
            landingNote: 'All processing happens locally in your browser: no uploads to any server, no analytics, no tracking. The page includes a Content Security Policy that blocks network requests.'
        }
    });

    setLanguage('it');
})();
