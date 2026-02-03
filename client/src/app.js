import { renderSkeleton, renderNews, showErrorLayer, hideErrorLayer, setBusy } from './ui';
import { fetchNews } from './api';

let currentAbortController = null;

export function initApp() {
    console.log('[app] initApp running');
    const refreshBtn = document.getElementById('refreshBtn');

    renderSkeleton(4);
    hideErrorLayer();
    load();
    

    refreshBtn.addEventListener('click', () => {
        load(true);
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {
                // ignore
            });
        });
    }
}

async function load(force = false) {
    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();

    hideErrorLayer();
    setBusy(true);
    renderSkeleton(4);

    try {
        const items = await fetchNews({ signal: currentAbortController.signal, force });
        renderNews(items);
        setBusy(false);
    } catch (e) {
        setBusy(false);
        showErrorLayer();
    }
}

async function load(force = false) {
    console.log('[app] load started, force=', force);

    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();

    hideErrorLayer();
    setBusy(true);
    renderSkeleton(4);

    try {
        const items = await fetchNews({ signal: currentAbortController.signal, force });
        console.log('[app] loaded items:', items);
        renderNews(items);
        setBusy(false);
    } catch (e) {
        console.log('[app] load failed:', e);
        setBusy(false);
        showErrorLayer();
    }
}