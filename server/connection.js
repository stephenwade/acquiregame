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
    this.socket.on('join game',        (data) => self.joinGame(data));
    this.socket.on('rejoin game',      (data) => self.rejoinGame(data));
    this.socket.on('disconnect',       ()    => self.disconnect());
    this.socket.on('update nickname',  (data) => self.updateNickname(data));
    this.socket.on('start game',       ()    => { if (self.game) self.game.startGame() });
    this.socket.on('board ready',      ()    => { if (self.game) self.game.boardReady() });
    
    let turnMsgs = [
      'tile chosen',
      'chain chosen',
      'merger chosen',
      'stocks purchased'
    ];
    
    for (let msg of turnMsgs) {
      let callback = (data) => {
        if (self.game) self.game.turnAction(this.id, msg, data);
      };
      
      this.socket.on(msg, callback);
    }
    
    this.socket.on('stock decision',   (data) => { if (self.game) self.game.stockDecision(this.id, data) });
  }
  
  // Callbacks
  newGame() {
    console.log(this.id, 'started a new game');
    
    this.gameID = gamesManager.newGame();
    this.game = gamesManager.findGame(this.gameID);
    
    this.socket.join(this.gameID);
    io.to(this.gameID).emit('game created', this.gameID);
  }
  
  joinGame(data) {
    let game = gamesManager.findGame(data.id);
    if (game) {
      this.game = game;
      this.gameID = data.id;
      this.socket.join(data.id);
      let newUUID = uuid();
      this.game.addPlayer(new Player(this.socket.id, newUUID, he.escape(data.nickname)));
      this.socket.emit('joined game', data.id);
      this.socket.emit('assigned UUID', newUUID);
    } else {
      this.socket.emit('invalid game');
    }
  }
  
  rejoinGame(data) {
    let game = gamesManager.findGame(data.id);
    if (game) {
      if (game.rejoinPlayer({ uuid: data.uuid, id: this.id })) {
        this.game = game;
        this.gameID = data.id;
        this.socket.join(data.id);
        this.socket.emit('rejoined game', data.id);
        console.log('rejoined game', data.id);
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
  
  updateNickname(data) {
    console.log('Player', this.socket.id, 'updating nickname to', data.val);
    if (this.game) this.game.updateNickname(this.socket.id, data.val);
  }
};

module.exports = Connection;
