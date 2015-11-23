'use strict';

var fs = require('fs');
var io = require('./shared').io;

var Connection = require('./connection');
var connections = [];

io.on('connection', (socket) => connections.push(new Connection(socket)) );

console.log('Server started');


fs.stat('./debug', (err, stats) => { if (!err) consoleListen() } );


// Debugging functions

function consoleListen() {
  console.log('Debugging started');
  
  var stdin = process.openStdin();
  stdin.addListener('data', (buffer) => handleInput(buffer.toString().trim()) )
}

function log(output) {
  console.log('\n' + output + '\n');
}

var debugCommands = {
  load: (input) => {
    console.log('pretending to load game', input[0]);
  },
  help: () => {
    log('available commands:\n' + Object.keys(debugCommands).map( (c) => '- ' + c ).join('\n'));
  }
}

var levenshtein = require('./levenshtein').getEditDistance;

function handleInput(i) {
  if (i.length > 0) {
    let input = i.split(' ');
    let command = input[0];
    
    if (Object.keys(debugCommands).indexOf(command) !== -1) {
      debugCommands[command](input.slice(1));
    } else {
      let bestGuess =
        Object.keys(debugCommands)
        .map( (c) => {
          return { command: c, dist: levenshtein(command, c) }
        } )
        .sort( (a, b) => (a.dist < b.dist) ? -1 : ((a.dist > b.dist) ? 1 : 0) )
        [0];
      log('Unknown command. Did you mean\n    ' + bestGuess.command);
    }
  } else handleInput('help');
}
