import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
    ({ url }) => url.origin === 'https://js-extra-webworkers-api.onrender.com' && url.pathname === '/api/news',
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 15
    })
);

registerRoute(
    ({ request }) => request.destination === 'image',
    new StaleWhileRevalidate({ cacheName: 'images-cache' })
);