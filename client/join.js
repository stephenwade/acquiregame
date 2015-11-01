'use strict';

var socket = io('10.9.61.49:8001');

var gameID;

socket.on("connect", function() {
  gameID = prompt("Game ID");
  socket.emit("join game", gameID);
});

$('paper-button').click(function(evt) {
var input = $('paper-input')[0];
var val = input.value;

if (val !== '') {
  socket.emit('chat message', val);
  console.log('submitting:', val);
  input.value = '';
}
});

socket.on('chat message', function(msg) {
  console.log(msg);
  $('#messages').append($('<p>').text(msg));
});
