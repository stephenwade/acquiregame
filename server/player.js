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
  
  addTile(tile) {
    this.tiles.push(tile);
  }
  
  addTiles(tiles) {
    tiles.forEach( (tile) => this.addTile(tile) );
  }
};

module.exports = Player;
