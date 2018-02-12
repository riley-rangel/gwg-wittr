self.addEventListener('fetch', function(event) {
  if (!event || !event.request || ! event.request.url) return

  if (String(event.request.url).match(/(.jpg)$/)) {
    event.respondWith(
      fetch('/imgs/dr-evil.gif')
    )
  }
});