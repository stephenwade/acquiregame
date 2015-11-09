'use strict';

var io = require('./shared').io;

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
  }
  
  addPlayer(player) { // player: { id, nickname }
    this.players.push(player);
    io.to(this.id).emit('setup state', {
      players: this.players,
      isReady: this.isReady()
    });
  }
  
  isReady() {
    let len = this.players.length;
    return (len >= 3 && len <= 6);
  }
  
  startGame() {
    // draw a few tiles to pick the first player
    // calculate player order, reorder players array
    // tell the board about players
  }
  
  boardReady() {
    // draw new tiles for everyone
    // tell each player what their tiles are
    // announce the next turn
  }
  
  tileChosen(id, msg) {
    // is it your turn?
    // do you have that tile?
    // put the tile on the board
  }
  
  mergerChosen(id, msg) {
    
  }
  
  stockDecision(id, msg) {
    
  }
  
  stocksPurchased(id, msg) {
    
  }
  
};

module.exports = Game;
