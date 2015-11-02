'use strict';

var shared = {
  io: require('socket.io')(8001)
};

module.exports = shared;
