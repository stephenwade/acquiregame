'use strict';

var fs = require('fs');
var io = require('socket.io')(8001);


var games = {};


io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('new game', function() {
    let id = newGameID();
    games[id] = {
      players: []
    };
    socket.join(id);
    io.to(id).emit('game created', id);
  });
  
  socket.on('join game', function(msg) {
    if (games[msg]) {
      socket.join(msg);
      games[msg].players.push(socket.id);
      io.to(msg).emit('players', games[msg].players);
    } else {
      socket.emit('invalid game');
    }
  });
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg) {
    console.log('message: ', msg);
    
    io.to(socket.rooms[1]).emit('chat message', msg);
  });
});

function newGameID() {
  let attempt = Math.floor(Math.random() * 10000);
  if (attempt < 1000 || games.attempt)
    return newGameID();
  else
    return attempt;
}

console.log('Server started');
