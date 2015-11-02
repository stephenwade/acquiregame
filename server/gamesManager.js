'use strict';

class GamesManager {
  constructor() {
    this.games = {};
  }
  
  newID() {
    let attempt = Math.floor(Math.random() * 10000);
    if (attempt < 1000 || this.games.attempt)
      return this.newID();
    else
      return attempt;
  }
  
  newGame() {
    let id = this.newID();
    
    this.games[id] = {
      players: []
    };
    
    return id;
  }
  
  findGame(id) {
    return this.games[id];
  }
};

module.exports = GamesManager;
