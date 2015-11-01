"use strict";

var fs = require("fs");
var io = require("socket.io")(8001);


var games = {};


io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('new game', function() {
    console.log(newGameID());
  });
  
  socket.on('join game', function(msg) {
    socket.join(msg);
    setTimeout(function() {
      console.log(socket.rooms);
    }, 1000);
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

console.log("Server started");
