'use strict';

var io = require('./shared').io;
setTimeout(function() {
  console.log('game', typeof io);
}, 1000);

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
  }
  
  addPlayer(player) {
    this.players.push(player);
    console.log(typeof io)
    io.to(this.id).emit('setup state', {
      players: this.players,
      isReady: this.isReady()
    });
  }
  
  isReady() {
    let len = this.players.length;
    return (len >= 3 && len <= 6);
  }
};

module.exports = Game;
