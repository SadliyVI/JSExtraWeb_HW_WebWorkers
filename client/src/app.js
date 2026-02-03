import { renderSkeleton, renderNews, showErrorLayer, hideErrorLayer, setBusy } from './ui';
import { fetchNews } from './api';

let currentAbortController = null;

export function initApp() {
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