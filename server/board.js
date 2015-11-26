'use strict';

require('./polyfills');
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
    let cell = this.lookup(row, col);
    
    let success = true;
    let orphan  = true;
    let create  = false;
    let expand  = false;
    let merger  = false;
    let chains = [];
    
    cell.eachNeighbor((neighbor) => {
      if (neighbor.isPlayed()) {
        orphan = false;
        chains.push(neighbor.chain);
      }
    });
    
    if (!orphan) {
      chains = chains.filter(Boolean).unique();
      switch (chains.length) {
        case 0:
          create = true;
          break;
        case 1:
          expand = true;
          break;
        default:
          merger = true;
      }
    }
    
    cell.play();
    let result = { success, orphan, create, expand, merger };
    console.log(result);
    return { success, orphan, create, expand, merger };
    
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
