'use strict';

var fs = require('fs');
var io = require('./shared').io;
var Connection = require('./connection');
var connections = [];

io.on('connection', (socket) => connections.push(new Connection(socket)) );

console.log('Server started');
