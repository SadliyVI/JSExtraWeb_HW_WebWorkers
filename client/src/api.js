// Webpack 5: корректный способ подключить воркер без worker-loader
const WORKER = new Worker(new URL('./workers/data.worker.js', import.meta.url), {
    type: 'module'
});

// Зашитый API на Render
const API_BASE = 'https://js-extra-webworkers-api.onrender.com';

export async function fetchNews({ signal, force }) {
    const url = new URL('/api/news', API_BASE);
    if (force) url.searchParams.set('t', String(Date.now()));

    // Render (free) может "просыпаться" 10-30s
    const timeoutMs = 30000;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    const combinedSignal = anySignal([signal, controller.signal]);

    try {
        const res = await fetch(url.toString(), {
            signal: combinedSignal,
            cache: 'no-store'
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json();
        const normalized = await runWorkerNormalize(raw);
        return normalized;
    } finally {
        clearTimeout(t);
    }
}

function runWorkerNormalize(raw) {
    return new Promise((resolve, reject) => {
        const id = `${Date.now()}_${Math.random()}`;

        const onMessage = (e) => {
            if (!e.data || e.data.id !== id) return;
            WORKER.removeEventListener('message', onMessage);
            WORKER.removeEventListener('error', onError);
            resolve(e.data.payload);
        };

        const onError = (err) => {
            WORKER.removeEventListener('message', onMessage);
            WORKER.removeEventListener('error', onError);
            reject(err);
        };

        WORKER.addEventListener('message', onMessage);
        WORKER.addEventListener('error', onError);

        WORKER.postMessage({ id, type: 'normalize', payload: raw });
    });
}

function anySignal(signals) {
    const controller = new AbortController();
    const onAbort = () => controller.abort();

    signals
        .filter(Boolean)
        .forEach((s) => {
            if (s.aborted) controller.abort();
            else s.addEventListener('abort', onAbort, { once: true });
        });

    return controller.signal;
}