'use strict';

class Board {
  constructor() {
    this.grid = [];
    
    this.width = 12;
    this.height = 9;
    
    for (let row = 0; row < this.height; row++) {
      this.grid.push([]);
      
      for (let col = 0; col < this.width; col++) {
        this.grid[row].push({ filled: false });
      }
    }
  }
  
  playTile(row, col) {
    let neighbors = this.getNeighbors(row, col);
    
    if (neighbors.every( (cell) => ! grid[cell.row][cell.col].filled )) {
      this.grid[row][col].filled = true;
      return { success: true, orphan: true }
    } else {
      if (neighbors.every( (cell) => ! grid[cell.row][cell.col].chain )) {
        this.grid[row][col].filled = true;
        return { success: true, newChain: true }
      } else {
        let chainMembers = neighbors.filter( (cell) => grid[cell.row][cell.col].chain );
        
        if (chainMembers.length == 1) {
          this.grid[row][col].filled = true;
          return { success: true, expandChain: true }
        } else {
          let firstChain = this.grid[row][col].chain;
          if (neighbors.slice(1).each( (cell) => grid[cell.row][cell.col].chain == firstChain )) {
            this.grid[row][col].filled = true;
            return { success: true, expandChain: true }
          } else {
            this.grid[row][col].filled = true;
            return { success: true, merger: true }
          }
        }
      }
    }
    
    // still needs checks for more than seven chains, safe chains
    
    // success possibilities: orphan, newChain, expandChain, merger
    // if invalid, return { success: false, err: 'error message' }
    // for example: { success: false, err: 'Can’t create more than seven chains.'}
  }
  
  getNeighbors(row, col) {
    let result = [];
    
    if (row > 0)
      result.push({ row: row - 1, col });
    if (row < this.height - 1)
      result.push({ row: row + 1, col });
    if (col > 0)
      result.push({ row, col: col - 1 });
    if (col < this.width - 1)
      result.push({ row, col: col + 1 });
    
    return result;
  }
};

module.exports = Board;
