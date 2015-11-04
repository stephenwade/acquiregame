'use strict';

var io = require('socket.io')(8001);

var shared = {
  io: io
};

module.exports = shared;
