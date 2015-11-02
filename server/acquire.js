'use strict';

var fs = require('fs');
var io = require('socket.io')(8001);


var games = {};
var connections = [];

class Connection {
  constructor(socket) {
    console.log('a user connected');
    this.socket = socket;
    
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
  
  newGameID() {
    let attempt = Math.floor(Math.random() * 10000);
    if (attempt < 1000 || games.attempt)
      return newGameID();
    else
      return attempt;
  }
  
  // Callbacks
  newGame() {
    console.log(this.id, 'started a new game');
    let id = this.newGameID();
    games[id] = {
      players: []
    };
    this.socket.join(id);
    io.to(id).emit('game created', id);
  }
  
  joinGame(msg) {
    if (games[msg]) {
      this.socket.join(msg);
      games[msg].players.push(this.socket.id);
      io.to(msg).emit('players', games[msg].players);
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

io.on('connection', (socket) => connections.push(new Connection(socket)) );

console.log('Server started');
