// Paliz News - Service Worker v1.0
const CACHE_NAME = "paliz-news-v1";
const OFFLINE_URL = "/offline.html";

// فایل‌های اصلی که همیشه cache بشن
const CORE_ASSETS = [
  "/",
  "/logo.png",
  "/manifest.json",
];

// Install event - cache اولیه
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching core assets");
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn("⚠️ Failed to cache some assets:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - پاک کردن cache‌های قدیمی
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker: Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("🗑 Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - استراتژی Network First با fallback به Cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // فقط GET requests رو cache کن
  if (request.method !== "GET") return;

  // چک نکردن request‌های خارجی
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // استراتژی: Network First, Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // اگه response موفق بود، cache کن
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // اگه آفلاین بود، از cache بخون
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // اگه در cache هم نبود و درخواست HTML بود، صفحه offline نشون بده
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/") || new Response(
              generateOfflinePage(),
              {
                headers: { "Content-Type": "text/html; charset=utf-8" },
              }
            );
          }
        });
      })
  );
});

// صفحه ساده آفلاین (اگه هیچی نبود)
function generateOfflinePage() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>آفلاین - پالیز نیوز</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0a0a0f;
      color: #fafafa;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .container { padding: 2rem; max-width: 500px; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #f59e0b; }
    p { color: #a3a3a3; line-height: 1.8; margin-bottom: 2rem; }
    button {
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
    }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>ارتباط با اینترنت قطع است</h1>
    <p>لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
    <button onclick="location.reload()">تلاش مجدد</button>
  </div>
</body>
</html>`;
}
