'use strict';

var GamesManager = require('./gamesManager');

var shared = {
  io: require('socket.io')(8001),
  gamesManager: new GamesManager()
};

module.exports = shared;
