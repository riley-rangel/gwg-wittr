const staticCache = 'wittr-static-v6'
const contentImgsCache = 'wittr-content-imgs'
const allCaches = [
  staticCache,
  contentImgsCache
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCache)
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
          return name.startsWith('wittr-') && 
            !allCaches.includes(name)
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
    if (requestUrl.pathname.startsWith('/photos/')) {
      event.respondWith(servePhoto(event.request))
      return
    }
    if (requestUrl.pathname.startsWith('/avatars/')) {
      event.respondWith(serveAvatar(event.request))
      return
    }
  }

  event.respondWith(
    caches.match(event.request)
      .then(res => res ? res : fetch(event.request))
  )
});

self.addEventListener('message', function(event) {
  if (event && event.data.skipWaiting) {
    self.skipWaiting()
  }
})

function serveAvatar(request) {
  const storageUrl = request.url.replace(/-\dx\.jpg$/, '')

  return caches.open(contentImgsCache)
    .then(cache => {
      return cache.match(storageUrl)
        .then(cacheAvatar => {
          const fromNetwork = fetch(request)
            .then(res => {
              cache.put(storageUrl, res.clone())
              return res
            })

          return cacheAvatar || fromNetwork
        })
    })
}

function servePhoto(request) {
  const storageUrl = request.url.replace(/-\d+px\.jpg$/, '')

  return caches.open(contentImgsCache)
    .then(cache => {
      return cache.match(storageUrl)
        .then(photo => {
          if (photo) return photo

          return fetch(request)
            .then(res => {
              cache.put(storageUrl, res.clone())
              return res
            })
        })
    })
}