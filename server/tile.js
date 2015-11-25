'use strict';

class Tile {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    
    this.state = 'empty';
    this.chain = false;
    
    this.label = this.getLabel();
  }
  
  getLabel() {
    return (this.col + 1) + String.fromCharCode(65 + this.row);
  }
};

module.exports = Tile;
