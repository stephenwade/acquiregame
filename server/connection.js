'use strict';

var io = require('./shared').io;

class Connection {
  constructor(socket, gamesManager) {
    console.log('a user connected');
    this.socket = socket;
    this.gamesManager = gamesManager;
    
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
    
    this.gameID = this.gamesManager.newGame();
    
    this.socket.join(this.gameID);
    io.to(this.gameID).emit('game created', this.gameID);
  }
  
  joinGame(msg) {
    let game = this.gamesManager.findGame(msg);
    if (game) {
      this.socket.join(msg);
      game.addPlayer(this.socket.id);
      io.to(msg).emit('players', game.players);
    } else {
      this.socket.emit('invalid game');
    }
  }
  
  disconnect() {
    console.log('user disconnected');
  }
  
  chatMessage(msg) {
    console.log('message: ', msg);
    
    io.to(this.socket.rooms[1]).emit('chat message', msg);
  }
};

module.exports = Connection;
