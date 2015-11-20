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

var debugCommands = {
  loadgame: (input) => {
    console.log('pretending to load game', input[0]);
  },
  help: () => {
    console.log();
    console.log('available commands:')
    Object.keys(debugCommands).forEach( (c) => console.log('-', c));
    console.log();
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
        // .sort( (a, b) => {
        //   if (a.dist < b.dist) return -1;
        //   if (a.dist > b.dist) return 1;
        //   return 0;
        .sort( (a, b) => (a.dist < b.dist) ? -1 : ((a.dist > b.dist) ? 1 : 0) )[0];
      console.log();
      console.log('Unknown command. Did you mean');
      console.log('    ' + bestGuess.command);
      console.log();
    }
  } else handleInput('help');
}
