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
    
    // The tile starting a chain or causing a merger
    this.activeTile = false;
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

  replyInvalid(player, msg) {
    console.log(player.nickname, 'tried to play an invalid move:', msg);
    this.whisper(player.id, 'invalid move', msg);
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
  
  rejoinPlayer(data) {
    for (let i = 0; i < this.players.length; i++) {
      if (data.uuid === this.players[i].uuid) {
        this.players[i].id = data.id;
        this.whisper(data.id, 'game state', {
          game: this.dumpGameState(),
          player: this.players[i].dumpPlayerState()
        });
        return true;
        let waitingFor = this.players[i].waitingFor;
        if (waitingFor) {
          this.whisper(data.id, waitingFor.ev, waitingFor.data);
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
      
      this.board.playTile(orderTiles[i].row, orderTiles[i].col);
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
    if (! firstTurn) {
      let tile = this.tileStore.getTile();
      let player = this.players[this.currentPlayer];
      player.addTile(tile);
      this.whisper(player.id, 'new tiles', [tile]);
    
      this.currentPlayer = ++this.currentPlayer % this.players.length;
    }
    let player = this.players[this.currentPlayer];
    this.broadcast('next turn', player.uuid);
    this.whisper(player.id, 'play a tile');
    player.waitingFor = { ev: 'play a tile' };
    
    console.log('board state is:');
    this.board.logState();
  }
  
  createChain(player, tile) {
    this.activeTile = this.board.lookup(tile.row, tile.col);
    console.log(player.nickname, 'needs to create a chain');
    this.whisper(player.id, 'create a chain', this.board.availableChains);
    player.waitingFor = { ev: 'create a chain' };
  }
  
  buyStock(player) {
    this.nextTurn();
  }
  
  findPlayer(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        return { player: this.players[i], order: i };
      }
    }
  }
  
  turnAction(id, action, data) {
    let player = this.findPlayer(id);
    let self = this;
    let methods = {
      'tile chosen': () => { self.tileChosen(player.player, data) },
      'chain chosen': () => { self.chainChosen(player.player, data) }
    }
    
    if (player.order != this.currentPlayer) {
      this.replyInvalid(player.player, 'It’s not your turn.');
    } else {
      console.log('action', action, '->', methods[action]);
      (methods[action])();
    }
  }

  tileChosen(player, tile) {
    if (! player.hasTile(tile.row, tile.col)) {
      this.replyInvalid(player, 'You shouldn\'t have that tile!');
      return;
    }
    
    let result = this.board.playTile(tile.row, tile.col);
    
    if (result.success) {
      console.log(player.nickname, 'played', tile);
      this.broadcast('tile played', tile);
      
      if (result.create) { this.createChain(player, tile); }
      if (result.merger) { this.mergeChains(player, tile); }
      if (result.noAction) { this.buyStock(player); }
    } else {
      this.replyInvalid(player, result.err);
    }
  }
  
  chainChosen(player, data) {
    let created = this.board.newChain(data);
    if (created) {
      this.activeTile.setChain(data);
      
      console.log(player.id, 'created', data);
      this.broadcast('chain created', {
        row: this.activeTile.row,
        col: this.activeTile.col,
        chain: data
      });
      
      this.nextTurn();
    } else {
      this.replyInvalid(player, 'Chain is not available.');
    }
  }
  
  mergerChosen(id, data) {
    
  }
  
  stockDecision(id, data) {
    
  }
  
  stocksPurchased(id, data) {
    
  }
  
};

module.exports = Game;
