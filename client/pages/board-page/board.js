'use strict';

class Board {
  constructor() {
    this.numRows = 9;
    this.numCols = 12;
    
    this.board = this.constructBoard();
  }
  
  [Symbol.iterator]() {
    let row = 0;
    let col = 0;
    
    let value;
    let done;
    
    let next = () => {
      if (row < this.numRows) {
        value = this.board[row][col];
        done = false;
        
        if (col < this.numCols - 1) { col++; }
        else { row++; col = 0; }
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
        let cell = new Cell(row, col);
        
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
    return this.board[row][col];
  }
};
