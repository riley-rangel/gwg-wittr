self.addEventListener('fetch', function(event) {
  event.respondWith(
    new Response('Hello, world!', {
      headers: { 'foo': 'bar' } 
    })
  )
});