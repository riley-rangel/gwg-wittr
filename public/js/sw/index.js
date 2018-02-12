self.addEventListener('fetch', function(event) {
  event.respondWith(
    new Response('<b class="a-winner-is-me">Hello, world!</b>', {
      headers: { 'Content-Type': 'text/html' } 
    })
  )
});