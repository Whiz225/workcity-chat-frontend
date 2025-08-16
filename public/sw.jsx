const CACHE_NAME = "workcity-chat-v1";
const urlsToCache = [
  "/",
  "/auth/login",
  "/auth/register",
  "/chat",
  "/profile",
  "/manifest.json",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => caches.match("/offline.html"))
  );
});
