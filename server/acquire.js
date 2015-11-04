'use strict';

var fs = require('fs');
var io = require('./shared').io;
setTimeout(function() {
  console.log('acquire', typeof io);
}, 1000);
var Connection = require('./connection');
var connections = [];

io.on('connection', (socket) => connections.push(new Connection(socket)) );

console.log('Server started');
