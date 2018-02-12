self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('wittr-static-v1')
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

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res ? res : fetch(event.request))
  )
});