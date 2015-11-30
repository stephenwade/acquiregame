'use strict';

var Tile = require('./tile');

class Chain {
  constructor(name) {
    this.chainName = name;
    this.tiles = [];
  }
  
  addTile(tile) {
    this.tiles.push(tile);
    console.log('chain', this.chainName, 'now has', this.tiles.map( (tile) => tile.getLabel() ));
  }
  
  addTiles(tiles) {
    tiles.forEach( (tile) => this.addTile(tile) );
  }
  
  getLength() {
    return this.tiles.length();
  }
};

module.exports = Chain;
