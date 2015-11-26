'use strict';

var io        = require('./shared').io;
var TileStore = require('./tileStore');
var Board     = require('./board');

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.currentPlayer = undefined;
    this.gameState = 'lobby';
    this.turnState = undefined;
    
    this.board = new Board();
    this.tileStore = new TileStore();
    this.chains = [
      'luxor',
      'tower',
      'american',
      'festival',
      'worldwide',
      'continental',
      'imperial'
    ]
  }
  
  broadcast(ev, data) {
    if (typeof data === undefined)
      io.to(this.id).emit(ev);
    else
      io.to(this.id).emit(ev, data);
  }
  
  whisper(to, ev, data) {
    if (typeof io.sockets.connected[to] !== undefined) {
      if (typeof data === undefined) {
        io.sockets.connected[to].emit(ev);
      } else {
        io.sockets.connected[to].emit(ev, data);
      }
    }
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
  
  disconnectPlayer(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (id === this.players[i].id) {
        this.players[i].disconnected();
      }
    }
  }
  
  rejoinPlayer(msg) {
    for (let i = 0; i < this.players.length; i++) {
      if (msg.uuid === this.players[i].uuid) {
        this.players[i].id = msg.id;
        this.whisper(msg.id, 'game state', {
          game: this.dumpGameState(),
          player: this.players[i].dumpPlayerState()
        });
        return true;
        let waitingFor = this.players[i].waitingFor;
        if (waitingFor) {
          this.whisper(msg.id, waitingFor.ev, waitingFor.data);
        }
      }
    }
    return false;
  }
  
  dumpGameState() {
    return {
      players: this.players,
      currentPlayer: this.players[i].id,
      gameState: this.gameState,
      turnState: this.turnState,
      board: this.board.grid
    };
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
    this.broadcast('setup state', {
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
    this.gameState = 'main';
    this.broadcast('game started', order);
  }
  
  boardReady() {
    for (let player of this.players) {
      player.addTiles(this.tileStore.getTiles(6));
      this.whisper(player.id, 'new tiles', player.tiles);
      console.log(player.id, 'has tiles', player.tiles);
    }
    
    this.nextTurn(true);
  }
  
  nextTurn(firstTurn) {
    if (! firstTurn) this.currentPlayer = ++this.currentPlayer % this.players.length;
    let player = this.players[this.currentPlayer];
    this.broadcast('next turn', player.uuid);
    this.whisper(player.id, 'play a tile');
    player.waitingFor = { ev: 'play a tile' };
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
      this.whisper(player.player.id, 'invalid move', 'It’s not your turn.');
    } else {
      if (player.player.hasTile(msg.row, msg.col)) {
        let result = this.board.playTile(msg.row, msg.col);
        if (result.success) {
          console.log(player.player.nickname, 'played', msg);
          this.broadcast('tile played', msg);
          
          if (result.orphan || result.expandChain) {
            // move to buying stock phase
            this.nextTurn();
          }
          if (result.newChain) {
            // create a new chain
            this.createChain();
          }
          if (result.merger) {
            // resolve merger
          }
        } else {
          this.whisper(player.player.id, 'invalid move', result.err);
        }
      }
    }
  }
  
  createChain() {
    this.whisper(player.id, 'create a chain', this.chains);
    player.waitingFor = { ev: 'create a chain' };
  }
  
  chainCreated(id, msg) {
    let player = this.findPlayer(id);
    
    if (player.order != this.currentPlayer) {
      this.whisper(player.player.id, 'invalid move', 'It’s not your turn.');
    } else {
      console.log(player.player.id, 'created', msg);
      this.broadcast('chain created', msg);
      
      this.nextTurn();
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
