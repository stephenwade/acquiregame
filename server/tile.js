'use strict';

class Tile {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
  
  get label() {
    return (this.col + 1) + String.fromCharCode(65 + row);
  }
};

module.exports = Tile;
