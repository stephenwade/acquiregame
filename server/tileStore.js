'use strict';

var Tile = require('./tile');

class TileStore {
  constructor() {
    this.tiles = [];
    
    let width = 12;
    let height = 9;
    
    for (let col = 0; col < width; col++) {
      for (let row = 0; row < height; row++) {
        this.tiles.push(new Tile(row, col));
      }
    }
    
    this.shuffleTiles();
  }
  
  shuffleTiles() {
    let m = this.tiles.length, t, i;
    
    while (m) {
      i = Math.floor(Math.random() * m--);
      
      t = this.tiles[m];
      this.tiles[m] = this.tiles[i];
      this.tiles[i] = t;
    }
  }
  
  getTile() {
    return this.tiles.pop();
  }
  
  getTiles(num) {
    let collection = [];
    for (let i = 0; i < num; i++) {
      collection.push(this.getTile());
    }
    return collection;
  }
  
  get tilesLeft() {
    return this.tiles.length;
  }
};

module.exports = TileStore;
