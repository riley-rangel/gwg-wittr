self.addEventListener('install', event => {
  const urlsToCache = [
    '/',
    'js/main.js',
    'css/main.css',
    'imgs/icon.png',
    'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
    'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
  ]

  event.waitUntil(
    caches.open('wittr-static-v1')
      .then(cache => {
        cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.status === 404) {
          return fetch('/imgs/dr-evil.gif')
        }
        return res
      })
      .catch(err => {
        console.error(err)
        return new Response('<h1>No Connection!</h1>', {
          headers: { 'Content-Type': 'text/html' }
        })
      })
  )
});