// 'use strict';

// window.addEventListener("WebComponentsReady", function(e) { // page ready to go
//   var socket = io('10.9.43.188:8001');
  
//   $('paper-button').click(function(evt) {
//     var input = $('paper-input')[0];
//     var val = input.value;
    
//     if (val !== '') {
//       socket.emit('chat message', val);
//       console.log('submitting:', val);
//       input.value = '';
//     }
//   });
  
//   socket.on('chat message', function(msg) {
//     console.log(msg);
//     $('#messages').append($('<p>').text(msg));
//   });
// });
