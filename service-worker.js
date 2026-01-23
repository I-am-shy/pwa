// 缓存名称（更新时修改名称，触发缓存更新）
const CACHE_NAME = 'cache-v1';
// 需要缓存的核心资源
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/logo.png'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting()) // 立即激活新的 Service Worker
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name)) // 删除旧缓存
      );
    }).then(() => self.clients.claim()) // 接管所有打开的页面
  );
});

// 拦截网络请求：优先用缓存，无缓存则请求网络
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存有则返回，无则请求网络
        return response || fetch(event.request);
      })
  );
});

console.log("Service Worker 全局对象", self);