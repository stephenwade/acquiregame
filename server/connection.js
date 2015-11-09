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
    this.socket.on('new game',        ()    => self.newGame());
    this.socket.on('join game',       (msg) => self.joinGame(msg));
    this.socket.on('disconnect',      ()    => self.disconnect());
    this.socket.on('chat message',    (msg) => self.chatMessage(msg));
    this.socket.on('update nickname', (msg) => self.updateNickname(msg));
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
      this.gameID = msg.id;
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
  
  updateNickname(msg) {
    let game = gamesManager.findGame(this.gameID);
    
    console.log('Player', this.socket.id, 'updating nickname to', msg.val);
    for (let i = 0; i < game.players.length; i++) {
      if (game.players[i].id === this.socket.id) {
        game.players[i].nickname = msg.val;
      }
    }
    io.to(this.gameID).emit('setup state', {
      players: game.players,
      isReady: game.isReady()
    });
  }
};

module.exports = Connection;
