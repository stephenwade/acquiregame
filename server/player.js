'use strict';

class Player {
  constructor(id, uuid, nickname) {
    this.id = id;
    this.uuid = uuid;
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
