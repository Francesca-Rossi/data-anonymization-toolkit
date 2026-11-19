    (function () {
        'use strict';

        const {
            registerTranslations,
            t,
            tf,
            setLanguage,
            getLanguage,
            sleep,
            appError,
            errorMessage,
            webCryptoAvailable,
            textEncoder,
            textDecoderUtf8,
            bytesToB64u,
            b64uToBytes,
            deriveKey,
            ENC_PREFIX,
            copyTextToClipboard,
            downloadBlob
        } = AppShared;

        /* ==================== i18n ==================== */
        registerTranslations({
            it: {
                title: "Anonimizzatore Dati Sensibili",
                subtitle: "100% Locale • Crittografia AES-256 (No AI)",
                tabAnon: "1. Anonimizza",
                tabDeanon: "2. De-Anonimizza",
                settingsTitle: "Impostazioni",
                pwdLabel: "Password di Crittografia <span class='text-red-500'>*</span>",
                pwdDesc: "Necessaria per creare la chiave cifrata di ripristino.",
                pwdPlaceholder: "Crea una password sicura",
                dataToHide: "Dati da Oscurare",
                customWordsLabel: "Parole Specifiche (Opzionale)",
                customWordsPlaceholder: "Es: Mario Rossi, Progetto X...",
                infoBox: "L'elaborazione è 100% locale. I dati originali vengono cifrati e inseriti <strong>direttamente nel testo</strong> (es. <span class='font-mono'>[ENCv1...]</span>). Non serve salvare nessun file extra, ti basta solo ricordare la password!",
                step1Anon: "1. Inserisci il testo o carica un file",
                anonInputPlaceholder: "Incolla qui il testo da anonimizzare...",
                or: "Oppure",
                dropText: "Trascina un file (.txt, .docx, .pdf) o clicca",
                btnRunAnon: "Esegui Anonimizzazione",
                step2Anon: "2. Testo Oscurato",
                btnCopy: "Copia",
                btnCopied: "Copiato",
                btnDownload: "Scarica TXT",
                nextStepAnon: "<strong>Passo successivo:</strong> Fai elaborare questo testo all'AI assicurandoti di dirle di <strong>non modificare</strong> le stringhe che iniziano con <code>[ENCv1</code>.",
                restoreTitle: "Ripristino Dati Originali",
                restoreDesc: "Incolla il testo elaborato dall'AI (oppure carica il file che l'AI ti ha generato). Il sistema cercherà tutti i blocchi <span class='font-mono'>[ENCv1...]</span> e li decripterà al volo usando la tua password. I vecchi blocchi legacy <span class='font-mono'>[ENC::...]</span> non vengono riconosciuti.",
                decryptPwdPlaceholder: "Password usata in fase 1",
                restoreInputLabel: "Testo Elaborato dall'AI <span class='text-red-500'>*</span>",
                restoreInputPlaceholder: "Incolla qui il testo contenente i segnaposto [ENCv1...] ...",
                btnRestore: "Decripta e Ripristina Testo",
                restoredTitle: "Testo Ripristinato",
                loading: "Elaborazione in corso...",
                loadingKey: "Derivazione della chiave (PBKDF2)...",
                loadingCount: "{n} elementi elaborati...",
                alertTitle: "Avviso",
                alertOk: "OK",
                rule_cf: "Codice Fiscale",
                rule_email: "Indirizzi Email",
                rule_iban: "IBAN",
                rule_phone: "Numeri di Telefono",
                rule_creditcard: "Carte di Credito (14-16 cifre)",
                rule_piva: "Partita IVA (IT)",
                errFormat: "Formato non supportato. Usa TXT, DOCX o PDF.",
                errRead: "Impossibile leggere il file. Dettagli: ",
                errPwdMissing: "Inserisci una password di crittografia per proteggere la chiave di sblocco.",
                errTextMissing: "Inserisci del testo o carica un file prima di procedere.",
                errRestoreTextMissing: "Inserisci il testo elaborato o carica il file ricevuto dall'AI.",
                errRestorePwdMissing: "Inserisci la password di crittografia usata inizialmente.",
                errDecrypt: "Impossibile decriptare {0} elementi. Probabilmente la password è errata o il testo è stato alterato dall'AI. Nessun output parziale è stato mostrato.",
                errNoTokens: "Nessun segnaposto [ENCv1...] trovato nel testo. I segnaposto legacy [ENC::...] della versione precedente non sono decifrabili con questa versione.",
                errNoWebCrypto: "Crittografia non disponibile: questo browser non supporta la Web Crypto API in questo contesto. Nessun metodo crittografico debole viene usato come alternativa.",
                errPdfUnavailable: "Parsing PDF non disponibile in questo browser: il worker offline non può essere avviato. Usa file TXT o DOCX, oppure un browser più recente.",
                errCopy: "Impossibile copiare negli appunti.",
                errGeneric: "Si è verificato un errore durante la decrittazione.",
                fileLoaded: "File caricato: "
            },
            en: {
                title: "Sensitive Data Anonymizer",
                subtitle: "100% Local • AES-256 Encryption (No AI)",
                tabAnon: "1. Anonymize",
                tabDeanon: "2. De-Anonymize",
                settingsTitle: "Settings",
                pwdLabel: "Encryption Password <span class='text-red-500'>*</span>",
                pwdDesc: "Required to securely encrypt and restore your data.",
                pwdPlaceholder: "Create a secure password",
                dataToHide: "Data to Hide",
                customWordsLabel: "Custom Words (Optional)",
                customWordsPlaceholder: "e.g., John Doe, Project X...",
                infoBox: "Processing is 100% local. Original data is encrypted and inserted <strong>directly into the text</strong> (e.g. <span class='font-mono'>[ENCv1...]</span>). No extra files needed, just remember your password!",
                step1Anon: "1. Paste text or upload a file",
                anonInputPlaceholder: "Paste the text to anonymize here...",
                or: "Or",
                dropText: "Drag a file (.txt, .docx, .pdf) or click",
                btnRunAnon: "Run Anonymization",
                step2Anon: "2. Obscured Text",
                btnCopy: "Copy",
                btnCopied: "Copied",
                btnDownload: "Download TXT",
                nextStepAnon: "<strong>Next step:</strong> Process this text with AI, making sure to instruct it <strong>not to modify</strong> the strings starting with <code>[ENCv1</code>.",
                restoreTitle: "Restore Original Data",
                restoreDesc: "Paste the AI-processed text (or upload the file generated by the AI). The system will find all <span class='font-mono'>[ENCv1...]</span> blocks and decrypt them on the fly using your password. Legacy <span class='font-mono'>[ENC::...]</span> blocks are not recognized.",
                decryptPwdPlaceholder: "Password used in step 1",
                restoreInputLabel: "AI Processed Text <span class='text-red-500'>*</span>",
                restoreInputPlaceholder: "Paste the text containing [ENCv1...] placeholders here...",
                btnRestore: "Decrypt and Restore Text",
                restoredTitle: "Restored Text",
                loading: "Processing...",
                loadingKey: "Deriving key (PBKDF2)...",
                loadingCount: "{n} items processed...",
                alertTitle: "Notice",
                alertOk: "OK",
                rule_cf: "Italian Fiscal Code",
                rule_email: "Email Addresses",
                rule_iban: "IBAN",
                rule_phone: "Phone Numbers",
                rule_creditcard: "Credit Cards (14-16 digits)",
                rule_piva: "VAT Number (IT)",
                errFormat: "Unsupported format. Use TXT, DOCX or PDF.",
                errRead: "Unable to read the file. Details: ",
                errPwdMissing: "Please enter an encryption password to secure the data.",
                errTextMissing: "Please enter some text or upload a file before proceeding.",
                errRestoreTextMissing: "Please enter the processed text or upload the AI file.",
                errRestorePwdMissing: "Please enter the original encryption password.",
                errDecrypt: "Unable to decrypt {0} elements. The password might be wrong or the AI altered the text. No partial output was shown.",
                errNoTokens: "No [ENCv1...] placeholder found in the text. Legacy [ENC::...] placeholders from the previous version cannot be decrypted with this version.",
                errNoWebCrypto: "Encryption unavailable: this browser does not support the Web Crypto API in this context. No weaker cryptographic method is used as a fallback.",
                errPdfUnavailable: "PDF parsing unavailable in this browser: the offline worker cannot be started. Use TXT or DOCX files, or a more recent browser.",
                errCopy: "Unable to copy to the clipboard.",
                errGeneric: "An error occurred during decryption.",
                fileLoaded: "File loaded: "
            }
        });


        async function encryptPlaceholder(value, key, saltB64) {
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const ct = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv }, key, textEncoder.encode(value)
            );
            return '[' + ENC_PREFIX + saltB64 + '.' + bytesToB64u(iv) + '.' + bytesToB64u(new Uint8Array(ct)) + ']';
        }

        async function decryptTokenBody(rawToken, password, keyCache) {
            const body = rawToken.slice(1, -1).replace(/\s+/g, '');
            const parts = body.split('.');
            if (parts.length !== 4 || parts[0] !== 'ENCv1') throw new Error('bad-format');
            let key = keyCache.get(parts[1]);
            if (!key) {
                key = await deriveKey(password, b64uToBytes(parts[1]));
                keyCache.set(parts[1], key);
            }
            const iv = b64uToBytes(parts[2]);
            const ct = b64uToBytes(parts[3]);
            const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ct);
            return textDecoderUtf8.decode(plain);
        }

        /* ==================== tabs ==================== */
        const tabAnon = document.getElementById('tab-anon');
        const tabDeanon = document.getElementById('tab-deanon');
        const viewAnon = document.getElementById('view-anon');
        const viewDeanon = document.getElementById('view-deanon');

        tabAnon.addEventListener('click', () => {
            tabAnon.className = "px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold transition-colors";
            tabDeanon.className = "px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-semibold transition-colors";
            viewAnon.classList.remove('hidden');
            viewDeanon.classList.add('hidden');
        });

        tabDeanon.addEventListener('click', () => {
            tabDeanon.className = "px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold transition-colors";
            tabAnon.className = "px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-semibold transition-colors";
            viewDeanon.classList.remove('hidden');
            viewAnon.classList.add('hidden');
        });

        /* ==================== redaction rules ==================== */
        const redactionRules = [
            { id: 'cf', regex: /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi, checked: true },
            { id: 'email', regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, checked: true },
            { id: 'iban', regex: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}\b/gi, checked: true },
            { id: 'phone', regex: /\b(?:\+39|0039)?[\s\-]?\d{3}[\s\-]?\d{6,7}\b/g, checked: true },
            { id: 'creditcard', regex: /\b(?:\d[ -]*?){13,16}\b/g, checked: true },
            { id: 'piva', regex: /\b[I|i][T|t]?[0-9]{11}\b/g, checked: false }
        ];

        const rulesContainer = document.getElementById('rules-container');

        redactionRules.forEach(rule => {
            const div = document.createElement('div');
            div.className = "flex items-start";
            div.innerHTML = `
                <div class="flex items-center h-5">
                    <input id="rule-${rule.id}" type="checkbox" ${rule.checked ? 'checked' : ''} class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500">
                </div>
                <div class="ml-3 text-sm">
                    <label for="rule-${rule.id}" class="font-medium text-slate-700 cursor-pointer" data-i18n="rule_${rule.id}">-</label>
                </div>
            `;
            rulesContainer.appendChild(div);
        });

        setLanguage('it');

        function showAlert(title, message) {
            document.getElementById('alert-title').innerText = title;
            document.getElementById('alert-message').innerText = message;
            document.getElementById('alert-modal').classList.remove('hidden');
        }

        function showLoading(labelKey) {
            document.getElementById('loading-text').innerText = t(labelKey);
            document.getElementById('loading').classList.remove('hidden');
        }

        function hideLoading() {
            document.getElementById('loading').classList.add('hidden');
        }

        document.getElementById('alert-close').addEventListener('click', () => {
            document.getElementById('alert-modal').classList.add('hidden');
        });

        /* ==================== PDF: offline worker + availability probe ==================== */
        let pdfWorkerConfigured = false;
        let pdfProbeState = 0; // 0 = unknown, 1 = available, 2 = unavailable

        function buildMiniPdfBytes() {
            const header = '%PDF-1.4\n';
            const objects = [
                '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
                '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
                '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 3 3] >>\nendobj\n'
            ];
            let body = header;
            const offsets = [];
            for (const obj of objects) {
                offsets.push(body.length);
                body += obj;
            }
            const xrefPos = body.length;
            let xref = 'xref\n0 4\n0000000000 65535 f \n';
            for (const off of offsets) {
                xref += String(off).padStart(10, '0') + ' 00000 n \n';
            }
            xref += 'trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF\n';
            return textEncoder.encode(body + xref);
        }

        function setupPdfWorker() {
            if (pdfWorkerConfigured) return;
            try {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/vendor/pdf.worker.min.js';
                pdfWorkerConfigured = true;
            } catch (e) {
                pdfWorkerConfigured = false;
            }
        }

        async function ensurePdfReady() {
            if (pdfProbeState === 1) return;
            if (pdfProbeState === 2) throw appError('errPdfUnavailable');
            if (typeof pdfjsLib === 'undefined') {
                pdfProbeState = 2;
                throw appError('errPdfUnavailable');
            }
            setupPdfWorker();
            try {
                const probe = await pdfjsLib.getDocument({
                    data: buildMiniPdfBytes(),
                    isEvalSupported: false,
                    verbosity: 0
                }).promise;
                await probe.destroy();
                pdfProbeState = 1;
            } catch (e) {
                pdfProbeState = 2;
                throw appError('errPdfUnavailable');
            }
        }

        async function extractPdfText(file) {
            await ensurePdfReady();
            const arrayBuffer = await file.arrayBuffer();
            let pdf = null;
            try {
                pdf = await pdfjsLib.getDocument({
                    data: arrayBuffer,
                    isEvalSupported: false,
                    verbosity: 0
                }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    text += textContent.items.map(item => item.str).join(' ') + '\n\n';
                    if (i % 10 === 0) await sleep(0);
                }
                return text;
            } catch (e) {
                if (e && (e.name === 'PasswordException' || e.name === 'InvalidPDFException' || e.name === 'MissingPDFException')) {
                    throw appError('errRead', (e.message || e.name));
                }
                pdfProbeState = 2;
                throw appError('errPdfUnavailable');
            } finally {
                if (pdf) {
                    try { await pdf.destroy(); } catch (e) { /* ignore */ }
                }
            }
        }

        /* ==================== file extraction ==================== */
        async function extractTextFromFile(file) {
            const extension = (file.name.split('.').pop() || '').toLowerCase();

            if (extension === 'txt') {
                return await file.text();
            }
            if (extension === 'docx') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                return result.value;
            }
            if (extension === 'pdf') {
                return await extractPdfText(file);
            }
            throw appError('errFormat');
        }

        /* ==================== drag & drop ==================== */
        function setupDragAndDrop(dropAreaId, fileInputId, fileNameDisplayId, onTextExtracted) {
            const dropArea = document.getElementById(dropAreaId);
            const fileInput = document.getElementById(fileInputId);
            const fileNameDisplay = document.getElementById(fileNameDisplayId);

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
            });

            dropArea.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                if (dt && dt.files.length > 0) handleFileSelection(dt.files[0]);
            }, false);

            dropArea.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', function () {
                if (this.files.length > 0) handleFileSelection(this.files[0]);
                fileInput.value = '';
            });

            async function handleFileSelection(file) {
                fileNameDisplay.innerText = t('fileLoaded') + file.name;
                fileNameDisplay.classList.remove('hidden');

                showLoading('loading');
                try {
                    const text = await extractTextFromFile(file);
                    onTextExtracted(text);
                } catch (e) {
                    showAlert(t('alertTitle'), errorMessage(e));
                }
                hideLoading();
            }
        }

        setupDragAndDrop('anon-drop-area', 'anon-file-input', 'anon-file-name-display', (text) => {
            document.getElementById('anon-input-text').value = text;
        });
        setupDragAndDrop('deanon-drop-area', 'deanon-file-input', 'deanon-file-name-display', (text) => {
            document.getElementById('restore-input').value = text;
        });

        /* ==================== anonymization ==================== */
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function collectMatches(text, regexes) {
            const accepted = [];
            regexes.forEach((regex) => {
                const flags = (regex.flags.indexOf('g') >= 0) ? regex.flags : regex.flags + 'g';
                const re = new RegExp(regex.source, flags);
                const found = [];
                let m;
                while ((m = re.exec(text)) !== null) {
                    if (m[0].length === 0) {
                        re.lastIndex++;
                        continue;
                    }
                    found.push({ start: m.index, end: m.index + m[0].length, value: m[0] });
                }
                for (const f of found) {
                    let overlaps = false;
                    for (const a of accepted) {
                        if (f.start < a.end && a.start < f.end) {
                            overlaps = true;
                            break;
                        }
                    }
                    if (!overlaps) accepted.push(f);
                }
            });
            accepted.sort((a, b) => a.start - b.start);
            return accepted;
        }

        async function anonymizeText(text, key, saltB64, onProgress) {
            const regexes = [];
            redactionRules.forEach(rule => {
                const checkbox = document.getElementById('rule-' + rule.id);
                if (checkbox && checkbox.checked) regexes.push(rule.regex);
            });

            const customWordsInput = document.getElementById('custom-words').value;
            if (customWordsInput.trim() !== '') {
                customWordsInput.split(/,|\n/)
                    .map(w => w.trim())
                    .filter(w => w.length > 0)
                    .forEach(word => {
                        regexes.push(new RegExp(escapeRegExp(word), 'gi'));
                    });
            }

            const matches = collectMatches(text, regexes);

            let out = '';
            let pos = 0;
            for (let i = 0; i < matches.length; i++) {
                const m = matches[i];
                out += text.slice(pos, m.start);
                out += await encryptPlaceholder(m.value, key, saltB64);
                pos = m.end;
                if (i % 25 === 24) {
                    if (onProgress) onProgress(i + 1);
                    await sleep(0);
                }
            }
            out += text.slice(pos);
            return out;
        }

        document.getElementById('btn-run-anon').addEventListener('click', async () => {
            const pwdInput = document.getElementById('encrypt-password');
            const password = pwdInput.value;
            const textToProcess = document.getElementById('anon-input-text').value;
            try {
                if (!password) {
                    showAlert(t('alertTitle'), t('errPwdMissing'));
                    return;
                }
                if (!textToProcess.trim()) {
                    showAlert(t('alertTitle'), t('errTextMissing'));
                    return;
                }
                if (!webCryptoAvailable) {
                    showAlert(t('alertTitle'), t('errNoWebCrypto'));
                    return;
                }

                document.getElementById('result-area').classList.add('hidden');
                showLoading('loadingKey');
                try {
                    const salt = window.crypto.getRandomValues(new Uint8Array(16));
                    const saltB64 = bytesToB64u(salt);
                    const key = await deriveKey(password, salt);
                    document.getElementById('loading-text').innerText = t('loading');

                    const anonymizedText = await anonymizeText(textToProcess, key, saltB64, (n) => {
                        document.getElementById('loading-text').innerText = tf('loadingCount', { n: n });
                    });

                    document.getElementById('output-text').value = anonymizedText;
                    document.getElementById('result-area').classList.remove('hidden');
                } catch (e) {
                    showAlert(t('alertTitle'), errorMessage(e));
                } finally {
                    hideLoading();
                }
            } finally {
                pwdInput.value = '';
            }
        });

        /* ==================== export buttons ==================== */
        async function copyWithFeedback(btnId, textAreaId) {
            const textArea = document.getElementById(textAreaId);
            const ok = await copyTextToClipboard(textArea);
            if (!ok) {
                showAlert(t('alertTitle'), t('errCopy'));
                return;
            }
            const btn = document.getElementById(btnId);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> <span data-i18n="btnCopied">' + t('btnCopied') + '</span>';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                setLanguage(getLanguage());
            }, 2000);
        }

        document.getElementById('btn-copy').addEventListener('click', () => copyWithFeedback('btn-copy', 'output-text'));
        document.getElementById('btn-copy-restored').addEventListener('click', () => copyWithFeedback('btn-copy-restored', 'restore-output'));

        document.getElementById('btn-download').addEventListener('click', () => {
            const outputText = document.getElementById('output-text');
            downloadBlob(new Blob([outputText.value], { type: 'text/plain;charset=utf-8' }), 'documento_anonimizzato.txt');
        });

        /* ==================== de-anonymization ==================== */
        async function restoreText(inputText, password, onProgress) {
            const tokenRegex = /\[\s*ENCv1[^\]]*\]/g;
            const tokens = [];
            let m;
            while ((m = tokenRegex.exec(inputText)) !== null) {
                tokens.push({ start: m.index, end: m.index + m[0].length, raw: m[0] });
            }
            if (tokens.length === 0) throw appError('errNoTokens');

            const keyCache = new Map();
            const plains = new Array(tokens.length);
            let failures = 0;

            for (let i = 0; i < tokens.length; i++) {
                try {
                    plains[i] = await decryptTokenBody(tokens[i].raw, password, keyCache);
                } catch (e) {
                    failures++;
                    plains[i] = null;
                }
                if (i === 0 && onProgress) onProgress(1);
                if (i % 25 === 24) {
                    if (onProgress) onProgress(i + 1);
                    await sleep(0);
                }
            }

            if (failures > 0) {
                throw appError('errDecrypt', String(failures));
            }

            let out = '';
            let pos = 0;
            for (let i = 0; i < tokens.length; i++) {
                out += inputText.slice(pos, tokens[i].start);
                out += plains[i];
                pos = tokens[i].end;
            }
            out += inputText.slice(pos);
            return out;
        }

        document.getElementById('btn-restore').addEventListener('click', async () => {
            const pwdInput = document.getElementById('decrypt-password');
            const password = pwdInput.value;
            const inputText = document.getElementById('restore-input').value;
            try {
                if (!inputText.trim()) {
                    showAlert(t('alertTitle'), t('errRestoreTextMissing'));
                    return;
                }
                if (!password) {
                    showAlert(t('alertTitle'), t('errRestorePwdMissing'));
                    return;
                }
                if (!webCryptoAvailable) {
                    showAlert(t('alertTitle'), t('errNoWebCrypto'));
                    return;
                }

                showLoading('loadingKey');
                try {
                    const restoredText = await restoreText(inputText, password, (n) => {
                        document.getElementById('loading-text').innerText = tf('loadingCount', { n: n });
                    });
                    document.getElementById('restore-output').value = restoredText;
                    document.getElementById('restore-result-area').classList.remove('hidden');
                    document.getElementById('restore-result-area').classList.add('flex');
                } catch (e) {
                    showAlert(t('alertTitle'), errorMessage(e));
                } finally {
                    hideLoading();
                }
            } finally {
                pwdInput.value = '';
            }
        });

    })();
    
