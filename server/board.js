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
    console.l
    
    this.grid[row][col].filled = true;
    return true; // false if tile is invalid
  }
};

module.exports = Board;
