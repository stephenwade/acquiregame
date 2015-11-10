'use strict';

var io = require('./shared').io;
var TileStore = require('./tileStore');

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    
    this.tileStore = new TileStore();
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
    console.log('start game');
    
    let orderTiles = this.tileStore.getTiles(this.players.length);
    
    let order = this.players.map((player, i) => {
      return { id: player.id, tile: orderTiles[i] }
    });
    
    console.log(order);
    // [{player, tile}, {player, tile}, {player, tile}, {player, tile}]
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
