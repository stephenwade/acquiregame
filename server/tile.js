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
  
  play() {
    this.state = 'filled';
    this.updateChains();
  }
  
  invalid() {
    this.state = 'invalid';
  }
  
  isPlayed() {
    return this.state === 'filled';
  }
  
  isOrphan() {
    return this.chain === false;
  }
  
  isClaimed() {
    return this.chain !== false;
  }
 
  eachNeighbor(callback) {
    let directions = [
      this.up,
      this.right,
      this.down,
      this.left
    ].filter(Boolean);
    
    for (let neighbor of directions) {
      callback(neighbor);
    }
  }
  
  setChain(chain) {
    this.chain = chain.name;
    chain.addTile(this);
    
    this.eachNeighbor((neighbor) => {
      if (neighbor.isPlayed() && neighbor.isOrphan()) {
        neighbor.setChain(chain);
      }
    });
  }
  
  updateChains() {
    let claimed = false;
    
    this.eachNeighbor((neighbor) => {
      if (neighbor.isClaimed()) {
        if (!claimed || claimed === neighbor.chain) {
          claimed = neighbor.chain;
        } else {
          claimed = 'merger';
        }
      }
    });
    
    if (claimed && claimed !== 'merger') {
      this.setChain(claimed);
    }
  }
  
  toString() {
    return `(${this.row}, ${this.col}): ${this.isPlayed()} -> ${this.chain}`
  }
};

module.exports = Tile;
