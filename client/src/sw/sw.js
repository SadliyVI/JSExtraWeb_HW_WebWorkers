/**
 * Workbox InjectManifest SW.
 * В production сюда будет добавлен __WB_MANIFEST со списком ассетов сборки.
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';

// чтобы новая версия SW сразу активировалась и начала контролировать вкладки
self.skipWaiting();
clientsClaim();

// чистим старые кэши workbox
cleanupOutdatedCaches();

// precache сборочных файлов (HTML/CSS/JS/картинки), чтобы UI открывался офлайн
precacheAndRoute(self.__WB_MANIFEST || []);

// API: network-first (Render может "просыпаться", потому timeout больше)
registerRoute(
    ({ url }) =>
        url.origin === 'https://js-extra-webworkers-api.onrender.com' &&
        url.pathname === '/api/news',
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 15
    })
);

// Картинки
registerRoute(
    ({ request }) => request.destination === 'image',
    new StaleWhileRevalidate({ cacheName: 'images-cache' })
);