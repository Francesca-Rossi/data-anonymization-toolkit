(function () {
    'use strict';

    const store = { it: Object.create(null), en: Object.create(null) };
    const langChangeHooks = [];
    let currentLang = 'it';

    function registerTranslations(dict) {
        if (!dict) return;
        Object.keys(dict).forEach(lang => {
            if (!store[lang]) store[lang] = Object.create(null);
            Object.assign(store[lang], dict[lang]);
        });
    }

    function t(key) {
        const d = store[currentLang];
        if (d && d[key] !== undefined) return d[key];
        if (store.en[key] !== undefined) return store.en[key];
        return key;
    }

    function tf(key, vars) {
        let s = t(key);
        if (vars) {
            Object.keys(vars).forEach(k => {
                s = s.split('{' + k + '}').join(String(vars[k]));
            });
        }
        return s;
    }

    function hasKey(key) {
        return (store[currentLang] && store[currentLang][key] !== undefined) ||
            store.en[key] !== undefined;
    }

    function getLanguage() {
        return currentLang;
    }

    function updateLangButtons() {
        const itBtn = document.getElementById('lang-it');
        const enBtn = document.getElementById('lang-en');
        if (itBtn) itBtn.classList.toggle('is-active', currentLang === 'it');
        if (enBtn) enBtn.classList.toggle('is-active', currentLang === 'en');
    }

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const v = t(key);
            if (v !== key) el.innerHTML = v;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const v = t(key);
            if (v !== key) el.placeholder = v;
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const v = t(key);
            if (v !== key) el.setAttribute('aria-label', v);
        });
        if (hasKey('title')) document.title = t('title');
        document.documentElement.lang = currentLang;
        updateLangButtons();
    }

    function onLanguageChange(fn) {
        if (typeof fn === 'function') langChangeHooks.push(fn);
    }

    function setLanguage(lang) {
        currentLang = (lang === 'en') ? 'en' : 'it';
        applyI18n();
        langChangeHooks.forEach(fn => fn(currentLang));
    }

    function appError(code, detail) {
        const e = new Error(code);
        e.code = code;
        e.detail = detail || '';
        return e;
    }

    function errorMessage(e) {
        if (e && e.code === 'errRead') return t('errRead') + (e.detail || '');
        if (e && e.code === 'errDecrypt') return t('errDecrypt').replace('{0}', e.detail || '0');
        if (e && e.code && hasKey(e.code)) return t(e.code);
        return t('errGeneric');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function downloadBlob(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    async function copyTextToClipboard(textArea) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(textArea.value);
                return true;
            } catch (e) {
                /* fall through to execCommand */
            }
        }
        try {
            textArea.focus();
            textArea.select();
            return document.execCommand('copy');
        } catch (e) {
            return false;
        }
    }

    const PBKDF2_ITERATIONS = 600000;
    const ENC_PREFIX = 'ENCv1.';
    const LEGACY_PREFIX = 'ENC::';
    const webCryptoAvailable = (typeof window.crypto !== 'undefined' &&
        !!window.crypto.subtle &&
        typeof window.crypto.subtle.deriveKey === 'function' &&
        typeof window.crypto.subtle.encrypt === 'function' &&
        typeof window.crypto.getRandomValues === 'function');

    const textEncoder = new TextEncoder();
    const textDecoderUtf8 = new TextDecoder('utf-8');

    function bytesToB64u(bytes) {
        let bin = '';
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function b64uToBytes(str) {
        let s = str.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4 !== 0) s += '=';
        const bin = atob(s);
        const out = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
        return out;
    }

    async function deriveKey(password, saltBytes) {
        const baseKey = await window.crypto.subtle.importKey(
            'raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveKey']
        );
        return window.crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    registerTranslations({
        it: {
            siteName: 'Data Anonymization Toolkit',
            navHome: 'Home',
            navSheets: 'Fogli Excel',
            navText: 'Testo',
            navLabel: 'Navigazione principale'
        },
        en: {
            siteName: 'Data Anonymization Toolkit',
            navHome: 'Home',
            navSheets: 'Excel Sheets',
            navText: 'Text',
            navLabel: 'Main navigation'
        }
    });

    function bindLangButtons() {
        const itBtn = document.getElementById('lang-it');
        const enBtn = document.getElementById('lang-en');
        if (itBtn) itBtn.addEventListener('click', () => setLanguage('it'));
        if (enBtn) enBtn.addEventListener('click', () => setLanguage('en'));
        updateLangButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindLangButtons);
    } else {
        bindLangButtons();
    }

    window.AppShared = {
        registerTranslations,
        t,
        tf,
        hasKey,
        getLanguage,
        applyI18n,
        setLanguage,
        onLanguageChange,
        appError,
        errorMessage,
        sleep,
        downloadBlob,
        copyTextToClipboard,
        PBKDF2_ITERATIONS,
        ENC_PREFIX,
        LEGACY_PREFIX,
        webCryptoAvailable,
        textEncoder,
        textDecoderUtf8,
        bytesToB64u,
        b64uToBytes,
        deriveKey
    };
})();
