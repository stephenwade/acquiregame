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
    let result = false;
    this.tiles.forEach( (t) => {
      if (t.row == row && t.col == col) {
        result = true;
      }
    } );
    return result;
  }
};

module.exports = Player;
