'use strict';

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
  }
  
  addPlayer(player) {
    this.players.push(player);
  }
};

module.exports = Game;
