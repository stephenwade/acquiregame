'use strict';

class Socket {
  constructor(conn) {
    this.socket = io(conn);
    this.registered = {}
  }
  
  emit(ev, msg) {
    this.socket.emit(ev, msg);
  }
  
  on(ev, f) {
    if (! this.registered[ev]) {
      this.registered[ev] = true;
      this.socket.on(ev, (msg) => f(msg));
    }
  }
}

var socket = new Socket(window.location.hostname + ':8001');

window.addEventListener('WebComponentsReady', function(e) {
  this.socket.on('reconnect_attempt', reconnectAttempt);
  this.socket.on('reconnect', reconnect);
});