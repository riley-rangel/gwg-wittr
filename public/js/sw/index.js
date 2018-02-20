const currentCache = 'wittr-static-v4'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache)
      .then(cache => {
        cache.addAll([
          '/skeleton',
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
  const requestUrl = new URL(event.request.url)

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/skeleton'))
      return
    }
  }

  event.respondWith(
    caches.match(request)
      .then(res => res ? res : fetch(event.request))
  )
});

self.addEventListener('message', function(event) {
  if (event && event.data.skipWaiting) {
    self.skipWaiting()
  }
})