'use strict';

class Board {
  constructor() {
    this.grid = [];
    
    let width = 12;
    let height = 9;
    
    for (let row = 0; row < height; row++) {
      this.grid.push([]);
      
      for (let col = 0; col < width; col++) {
        this.grid[row].push({ filled: false });
      }
    }
  }
  
  playTile(row, col) {
    // Logic to verify the tile is playable.
    
    this.grid[row][col].filled = true;
    return { success: true, orphan: true };
    // success possibilities: orphan, newChain, expandChain, merger
    // if invalid, return { success: false, err: 'error message' }
    // for example: { success: false, err: 'Can’t create more than seven chains.'}
  }
};

module.exports = Board;
