"use strict";

var http   = require("http").createServer(handler).listen(8001, "0.0.0.0");
var fs     = require("fs");
var io = require("socket.io")(http);

function handler(request, response) {
  let url = request.url;
  console.log(url);
  
  if (url.startsWith("/game")) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("coming soon");
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("how did you get here??");
  }
}

io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg) {
    console.log('message: ', msg);
    
    io.emit('chat message', msg);
  });
});

console.log("Server started");
