/* global workbox */
/**
 * Этот файл используется Workbox InjectManifest.
 * В production сюда будет добавлен __WB_MANIFEST со списком ассетов сборки.
 */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// precache сборочных файлов (HTML/CSS/JS/картинки), чтобы UI открывался офлайн
precacheAndRoute(self.__WB_MANIFEST || []);

// API: network-first (если нет сети — быстро упадёт и UI покажет ошибку)
registerRoute(
    ({ url }) => url.pathname.includes('/api/news'),
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3
    })
);

// Картинки (если будут внешние или внутренние)
registerRoute(
    ({ request }) => request.destination === 'image',
    new StaleWhileRevalidate({ cacheName: 'images-cache' })
);

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});