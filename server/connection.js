'use strict';

var io = require('./shared').io;
var gamesManager = new (require('./gamesManager'))();
var he = require('he');

class Connection {
  constructor(socket) {
    console.log('a user connected');
    this.socket = socket;
    
    this.gameID = null;
    this.game = null;
    
    this.registerMessages();
  }
  
  get id() {
    return this.socket.id;
  }
  
  registerMessages() {
    var self = this;
    this.socket.on('new game',         ()    => self.newGame());
    this.socket.on('join game',        (msg) => self.joinGame(msg));
    this.socket.on('disconnect',       ()    => self.disconnect());
    this.socket.on('chat message',     (msg) => self.chatMessage(msg));
    this.socket.on('start game',       ()    => self.game.startGame());
    this.socket.on('board ready',      ()    => self.game.boardReady());
    this.socket.on('tile chosen',      (msg) => self.game.tileChosen(this.id, msg));
    this.socket.on('merger chosen',    (msg) => self.game.mergerChosen(this.id, msg));
    this.socket.on('stock decision',   (msg) => self.game.stockDecision(this.id, msg));
    this.socket.on('stocks purchased', (msg) => self.game.stocksPurchased(this.id, msg));
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
    this.game = gamesManager.findGame(msg.id);
    if (this.game) {
      this.socket.join(msg.id);
      this.game.addPlayer({ id: this.socket.id, nickname: he.escape(msg.nickname) });
      this.socket.emit('joined game', msg.id);
    } else {
      this.socket.emit('invalid game');
    }
  }
  
  disconnect() {
    console.log('user disconnected');
  }
  
  chatMessage(msg) {
    console.log('message:', msg);
    
    io.to(this.socket.rooms[1]).emit('chat message', he.escape(msg));
  }
};

module.exports = Connection;
