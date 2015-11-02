'use strict';

var io = require('socket.io')(8001);

var shared = {
  io: io
};

setTimeout(function() {
  console.log('shared', typeof io);
}, 1000);

module.exports = shared;
