const currentCache = 'wittr-static-v3'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache)
      .then(cache => {
        cache.addAll([
          '/',
          'js/main.js',
          'css/main.css',
          'imgs/icon.png',
          'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
          'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
        ])
      })
  )
})

self.addEventListener('activate', () => {
  caches.keys()
    .then(cacheNames => {
      Promise.all(
        cacheNames.filter(name => {
          return name.startsWith('wittr-static-') && 
            name !== currentCache
        })
        .map(cacheName => caches.delete(cacheName))
      )
    })
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res ? res : fetch(event.request))
  )
});

self.addEventListener('message', function(message) {
  if (message && message.data.skipWaiting) {
    self.skipWaiting()
  }
})