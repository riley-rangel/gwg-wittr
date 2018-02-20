import PostsView from './views/Posts';
import ToastsView from './views/Toasts';
import idb from 'idb';

export default function IndexController(container) {
  this._container = container;
  this._postsView = new PostsView(this._container);
  this._toastsView = new ToastsView(this._container);
  this._lostConnectionToast = null;
  this._openSocket();
  this._registerServiceWorker();
}

IndexController.prototype._registerServiceWorker = function() {
  const indexController = this

  if (!navigator.serviceWorker) return

  navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {
      if (!navigator.serviceWorker.controller) return

      if (reg.waiting) {
        indexController._updateReady(reg.waiting)
      }

      if (reg.installing) {
        indexController._listenInstalling(reg.installing)
        return
      }

      reg.addEventListener('updatefound', function() {
        indexController._listenInstalling(reg.installing)
        return
      })
    })
    .catch(function(err) {
      console.error('sw registration error:', err)
    })

    navigator.serviceWorker.addEventListener('controllerchange', function() {
      window.location.reload(false)
    })
};

IndexController.prototype._updateReady = function(worker) {
  const indexController = this

  var toast = indexController._toastsView.show("New version available", {
    buttons: ['refresh', 'dismiss'],
  });

  toast.answer
    .then(function(answer) {
      if (answer !== 'refresh') return
      worker.postMessage({ skipWaiting: true })
    })
};

IndexController.prototype._listenInstalling = function(worker) {
  const indexController = this

  worker.addEventListener('statechange', function() {
    if (worker.state === 'installed') {
      indexController._updateReady(worker)
    }
  })
}

// open a connection to the server for live updates
IndexController.prototype._openSocket = function() {
  var indexController = this;
  var latestPostDate = this._postsView.getLatestPostDate();

  // create a url pointing to /updates with the ws protocol
  var socketUrl = new URL('/updates', window.location);
  socketUrl.protocol = 'ws';

  if (latestPostDate) {
    socketUrl.search = 'since=' + latestPostDate.valueOf();
  }

  // this is a little hack for the settings page's tests,
  // it isn't needed for Wittr
  socketUrl.search += '&' + location.search.slice(1);

  var ws = new WebSocket(socketUrl.href);

  // add listeners
  ws.addEventListener('open', function() {
    if (indexController._lostConnectionToast) {
      indexController._lostConnectionToast.hide();
    }
  });

  ws.addEventListener('message', function(event) {
    requestAnimationFrame(function() {
      indexController._onSocketMessage(event.data);
    });
  });

  ws.addEventListener('close', function() {
    // tell the user
    if (!indexController._lostConnectionToast) {
      indexController._lostConnectionToast = indexController._toastsView.show("Unable to connect. Retrying…");
    }

    // try and reconnect in 5 seconds
    setTimeout(function() {
      indexController._openSocket();
    }, 5000);
  });
};

// called when the web socket sends message data
IndexController.prototype._onSocketMessage = function(data) {
  var messages = JSON.parse(data);
  this._postsView.addPosts(messages);
};