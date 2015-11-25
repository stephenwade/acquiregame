'use strict';

var Tile = require('./tile');

class Board {
  constructor() {
    this.numRows = 9;
    this.numCols = 12;
    
    this.grid = this.constructBoard();
  }
  
  [Symbol.iterator]() {
    let row = 0, col = 0;
    let value, done;
    
    let next = () => {
      if (row < this.numRows) {
        value = this.board[row][col]; done = false;
        
        if (col < this.numCols - 1) { col++; } else { row++; col = 0; }
      } else {
        value = undefined; done = true;
      }
      
      return { value, done };
    };
    
    return { next };
  }
  
  constructBoard() {
    let result = [];
    
    for (let row = 0; row < this.numRows; row++) {
      result.push([]);
      
      for (let col = 0; col < this.numCols; col++) {
        let cell = new Tile(row, col);
        
        if (row > 0) {
          cell.addUpperNeighbor(result[row - 1][col]);
        }
        if (col > 0) {
          cell.addLeftNeighbor(result[row][col - 1]);
        }
        
        result[row][col] = cell;
      }
    }
    
    return result;
  }
  
  lookup(row, col) {
    return this.grid[row][col];
  }
  
  playTile(row, col) {
    let neighbors = this.getNeighbors(row, col);
    
    if (neighbors.every( (cell) => ! this.grid[cell.row][cell.col].filled )) {
      this.grid[row][col].filled = true;
      return { success: true, orphan: true }
    } else {
      if (neighbors.every( (cell) => ! this.grid[cell.row][cell.col].chain )) {
        this.grid[row][col].filled = true;
        return { success: true, newChain: true }
      } else {
        let chainMembers = neighbors.filter( (cell) => this.grid[cell.row][cell.col].chain );
        
        if (chainMembers.length == 1) {
          this.grid[row][col].filled = true;
          return { success: true, expandChain: true }
        } else {
          let firstChain = this.grid[row][col].chain;
          if (neighbors.slice(1).each( (cell) => this.grid[cell.row][cell.col].chain == firstChain )) {
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
