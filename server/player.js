'use strict';

class Player {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.tiles = [];
    // money
    // stock
    // etc.
  }
  
  disconnected() {
    this.id = undefined;
    console.log(this.nickname, 'lost connection');
  }
  
  addTile(tile) {
    this.tiles.push(tile);
  }
  
  addTiles(tiles) {
    tiles.forEach( (tile) => this.addTile(tile) );
  }
  
  hasTile(row, col) {
    return this.tiles.some( (t) => t.row == row && t.col == col );
  }
};

module.exports = Player;
