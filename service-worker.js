// Name of the cache storage
const CACHE_NAME = 'btc-monitor-cache-v1';
// List of files to cache (NOTE: URLs must be relative to the GitHub Pages domain)
const urlsToCache = [
    // The root path of the app
    '/bitcoin-block-monitor/',
    // The main file
    '/bitcoin-block-monitor/index.html',
    // The manifest file
    '/bitcoin-block-monitor/manifest.json',
    // External resources (Tailwind CSS CDN and Google Font)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
];

// Installation event: Caching all required assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Install event: Caching assets');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Ensure all files are added to the cache during installation
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation event: Cleaning up old caches to save space
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate event: Cleaning up old caches');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete any cache that is not in the current CACHE_NAME list
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: Intercepting network requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the cached response (faster than network)
                if (response) {
                    return response;
                }
                // No cache hit - fetch from the network
                return fetch(event.request);
            })
    );
});
