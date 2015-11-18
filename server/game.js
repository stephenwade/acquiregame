'use strict';

var io        = require('./shared').io;
var TileStore = require('./tileStore');
var Board     = require('./board');

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.currentPlayer = false;
    
    this.board = new Board();
    this.tileStore = new TileStore();
  }
  
  addPlayer(player) {
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
  
  firstPlayer() {
    let orderTiles = this.tileStore.getTiles(this.players.length);
    
    let order = [];
    
    let max = orderTiles[0];
    let firstPlayer = 0;
    
    for (let i = 0; i < this.players.length; i++) {
      let pairing = { player: this.players[i] , tile: orderTiles[i] }
      
      if (pairing.tile.row < max.row) {
        firstPlayer = i;
        max = pairing.tile;
      } else if (pairing.tile.row === max.row) {
        if (pairing.tile.col < max.col) {
          firstPlayer = i;
          max = pairing.tile;
        }
      }
      
      order.push(pairing);
    }
    
    this.currentPlayer = firstPlayer;
    return order;
  }
  
  startGame() {
    console.log('start game');
    
    let order = this.firstPlayer();
    
    console.log(order);
    io.to(this.id).emit('game started', order);
    // tell the board about players
  }
  
  boardReady() {
    for (let player of this.players) {
      player.addTiles(this.tileStore.getTiles(6));
      //io.to(player.id).emit('new tiles', player.tiles.map( (tile) => tile.label ))
      io.sockets.connected[player.id].emit('new tiles', player.tiles);
      console.log(player.id, 'has tiles', player.tiles);
    }
    
    // io.to(this.id).emit('next turn', /* whose ~line~ turn is it anyway? */ )
    
    // draw new tiles for everyone
    // tell each player what their tiles are
    // announce the next turn
  }
  
  findPlayer(id) {
    // for (let player of this.players) {
    //   if (player.id === id) {
    //     return player;
    //   }
    // }
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        return { player: this.players[i], order: i };
      }
    }
  }
  
  tileChosen(id, msg) {
    let player = this.findPlayer(id);
    if (player.order != this.currentPlayer) {
      io.sockets.connected[player.player.id].emit('error: out of turn');
    } else {
      if (player.player.hasTile(msg.row, msg.col)) {
        let result = this.board.playTile(msg.row, msg.col);
        if (result.success) {
          console.log(player.nickname, 'played', msg);
          io.to(this.id).emit('tile played', msg);
          
          if (result.orphan || result.expandChain) {
            // move to buying stock phase
          }
          if (result.newChain) {
            // create a new chain
          }
          if (result.merger) {
            // resolve merger
          }
        } else {
          io.sockets.connected[player.player.id].emit('error: invalid move', result.err);
        }
      }
    }
  }
  
  mergerChosen(id, msg) {
    
  }
  
  stockDecision(id, msg) {
    
  }
  
  stocksPurchased(id, msg) {
    
  }
  
};

module.exports = Game;
