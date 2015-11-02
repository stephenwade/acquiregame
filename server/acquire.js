'use strict';

var fs = require('fs');
var io = require('./shared').io;
var Connection = require('./connection');
var GamesManager = require('./gamesManager');

var manager = new GamesManager();
var connections = [];

io.on('connection', (socket) => connections.push(new Connection(socket, manager)) );

console.log('Server started');
