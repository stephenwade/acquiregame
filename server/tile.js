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
  
  addUpperNeighbor(cell) {
    this.up   = cell;
    cell.down = this;
  }
  
  addLeftNeighbor(cell) {
    this.left  = cell;
    cell.right = this;
  }
};

module.exports = Tile;
