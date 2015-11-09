'use strict';

var io = require('./shared').io;
var gamesManager = new (require('./gamesManager'))();
var he = require('he');

class Connection {
  constructor(socket) {
    console.log('a user connected');
    this.socket = socket;
    
    this.gameID = null;
    
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
    this.socket.on('board ready',      ()    => self.boardReady());
    this.socket.on('tile chosen',      (msg) => self.tileChosen(msg));
    this.socket.on('merger chosen',    (msg) => self.mergerChosen(msg));
    this.socket.on('stock decision',   (msg) => self.stockDecision(msg));
    this.socket.on('stocks purchased', (msg) => self.stocksPurchased(msg));
  }
  
  // Callbacks
  newGame() {
    console.log(this.id, 'started a new game');
    
    this.gameID = gamesManager.newGame();
    
    this.socket.join(this.gameID);
    io.to(this.gameID).emit('game created', this.gameID);
  }
  
  joinGame(msg) {
    let game = gamesManager.findGame(msg.id);
    if (game) {
      this.socket.join(msg.id);
      game.addPlayer({ id: this.socket.id, nickname: he.escape(msg.nickname) });
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
  
  boardReady() {
    console.log('board ready');
  }
  
  tileChosen(msg) {
    console.log('tile chosen:', msg);
  }
  
  mergerChosen(msg) {
    console.log('merger chosen:', msg);
  }
  
  stockDecision(msg) {
    console.log('stock decision:', msg);
  }
  
  stocksPurchased(msg) {
    console.log('stocks purchased:', msg);
  }
  
};

module.exports = Connection;
