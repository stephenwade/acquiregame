'use strict';

var io = require('./shared').io;
var gamesManager = new (require('./gamesManager'))();
var Player = require('./player');
var uuid = require('node-uuid').v4;
var he = require('he');

class Connection {
  constructor(socket) {
    console.log('a user connected');
    this.socket = socket;
    
    this.gameID = undefined;
    this.game = undefined;
    
    this.registerMessages();
  }
  
  get id() {
    return this.socket.id;
  }
  
  registerMessages() {
    var self = this;
    this.socket.on('new game',         ()    => self.newGame());
    this.socket.on('join game',        (msg) => self.joinGame(msg));
    this.socket.on('rejoin game',      (msg) => self.rejoinGame(msg));
    this.socket.on('disconnect',       ()    => self.disconnect());
    this.socket.on('update nickname',  (msg) => self.updateNickname(msg));
    this.socket.on('start game',       ()    => { if (self.game) self.game.startGame() });
    this.socket.on('board ready',      ()    => { if (self.game) self.game.boardReady() });
    this.socket.on('tile chosen',      (msg) => { if (self.game) self.game.tileChosen(this.id, msg) });
    this.socket.on('chain chosen',     (msg) => { if (self.game) self.game.chainChosen(this.id, msg) });
    this.socket.on('merger chosen',    (msg) => { if (self.game) self.game.mergerChosen(this.id, msg) });
    this.socket.on('stock decision',   (msg) => { if (self.game) self.game.stockDecision(this.id, msg) });
    this.socket.on('stocks purchased', (msg) => { if (self.game) self.game.stocksPurchased(this.id, msg) });
  }
  
  // Callbacks
  newGame() {
    console.log(this.id, 'started a new game');
    
    this.gameID = gamesManager.newGame();
    this.game = gamesManager.findGame(this.gameID);
    
    this.socket.join(this.gameID);
    io.to(this.gameID).emit('game created', this.gameID);
  }
  
  joinGame(msg) {
    let game = gamesManager.findGame(msg.id);
    if (game) {
      this.game = game;
      this.gameID = msg.id;
      this.socket.join(msg.id);
      let newUUID = uuid();
      this.game.addPlayer(new Player(this.socket.id, newUUID, he.escape(msg.nickname)));
      this.socket.emit('joined game', msg.id);
      this.socket.emit('assigned UUID', newUUID);
    } else {
      this.socket.emit('invalid game');
    }
  }
  
  rejoinGame(msg) {
    let game = gamesManager.findGame(msg.id);
    if (game) {
      if (game.rejoinPlayer({ uuid: msg.uuid, id: this.id })) {
        this.game = game;
        this.gameID = msg.id;
        this.socket.join(msg.id);
        this.socket.emit('rejoined game', msg.id);
        console.log('rejoined game', msg.id);
      } else {
        this.socket.emit('forbidden connection');
        console.log('forbidden connection');
      }
    } else {
      this.socket.emit('invalid game');
    }
  }
  
  disconnect() {
    console.log('user disconnected');
    if (this.game) {
      if (this.game.gameState == 'lobby') {
        this.game.removePlayer(this.id);
      } else {
        this.game.disconnectPlayer(this.id);
      }
    }
  }
  
  updateNickname(msg) {
    console.log('Player', this.socket.id, 'updating nickname to', msg.val);
    if (this.game) this.game.updateNickname(this.socket.id, msg.val);
  }
};

module.exports = Connection;
