self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.status === 404) {
          return new Response('<h1>404: Not Found</h1>', {
            headers: { 'Content-Type': 'text/html' }
          })
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