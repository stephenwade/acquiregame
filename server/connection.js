'use strict';

var io = require('./shared').io;
// var gamesManager = require('./shared').gamesManager;
var gamesManager = new (require('./gamesManager'))();

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
    this.socket.on('new game',     ()    => self.newGame());
    this.socket.on('join game',    (msg) => self.joinGame(msg));
    this.socket.on('disconnect',   ()    => self.disconnect());
    this.socket.on('chat message', (msg) => self.chatMessage(msg));
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
      game.addPlayer({ id: this.socket.id, nickname: msg.nickname });
    } else {
      this.socket.emit('invalid game');
    }
  }
  
  disconnect() {
    console.log('user disconnected');
  }
  
  chatMessage(msg) {
    console.log('message:', msg);
    
    io.to(this.socket.rooms[1]).emit('chat message', msg);
  }
};

module.exports = Connection;