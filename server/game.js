'use strict';

var io = require('./shared').io;

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
  }
  
  addPlayer(player) { // player: { id, nickname }
    this.players.push(player);
    this.pushSetupState();
  }
  
  removePlayer(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (id === this.players[i].id) {
        this.players.splice(i, 1); // remove this.players[i]
      }
    }
    this.pushSetupState();
  }
  
  updateNickname(id, newName) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        this.players[i].nickname = newName;
      }
    }
    this.pushSetupState();
  }
  
  pushSetupState() {
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
    console.log('start game');
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
