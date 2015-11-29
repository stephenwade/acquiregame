'use strict';

require('./polyfills');
var Tile = require('./tile');
var Chain = require('./chain');

class Board {
  constructor() {
    this.numRows = 9;
    this.numCols = 12;
    
    this.grid = this.constructBoard();
    
    this.availableChains = [
      'luxor',
      'tower',
      'american',
      'festival',
      'worldwide',
      'continental',
      'imperial'
    ]
    
    this.chains = [];
  }
  
  [Symbol.iterator]() {
    let row = 0, col = 0;
    let value, done;
    
    let next = () => {
      if (row < this.numRows) {
        value = this.lookup(row, col); done = false;
        
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
  
  newChain(chain) {
    let index = this.availableChains.indexOf(chain);
    
    if (index >= 0) {
      this.availableChains.splice(index, 1);
      let newChain = new Chain(chain);
      this.chains.push(newChain);
      return newChain;
    }
    
    return false;
  }
  
  findChain(chainName) {
    for (let chain in this.chains)
      if (chain.name == chainName)
        return chain;
  }

  playTile(row, col) {
    let cell = this.lookup(row, col);
    
    let success = true;
    let orphan  = true;
    let create  = false;
    let expand  = false;
    let merger  = false;
    let neighboringChains = [];
    let err     = '';
    
    console.log('playing', String(cell));
    
    cell.eachNeighbor((neighbor) => {
      console.log('\tneighbor:', String(neighbor));
      if (neighbor.isPlayed()) {
        orphan = false;
        neighboringChains.push(neighbor.chain);
      }
    });
    
    if (!orphan) {
      neighboringChains = neighboringChains.filter(Boolean).unique();
      switch (neighboringChains.length) {
        case 0:
          if (this.availableChains.length > 0) {
            create = true;
          } else {
            success = false;
            err     = 'No new chains available';
          }
          break;
        case 1:
          expand = true;
          break;
        default:
          merger = true;
      }
    }
    
    let noAction = orphan || expand;
    
    if (success) {
      cell.play();
      if (expand)
        this.findChain(neighboringChains[0]).addTile(cell);
    }
    let result = { success, orphan, create, expand, noAction, merger, err };
    console.log('play will be', result);
    return result;
    
    // still needs checks for more than seven chains, safe chains
    
    // success possibilities: orphan, newChain, expandChain, merger
    // if invalid, return { success: false, err: 'error message' }
    // for example: { success: false, err: 'Can’t create more than seven chains.'}
  }
  
  logState() {
    let col = 0;
    let row = '';
    
    console.log('------------------------------------');
    
    for (let cell of this) {
      row += cell.isPlayed() ? (' ' + cell.label).slice(-3) : '   ';
      
      col = ++col % this.numCols; 
      if (col === 0) {
        console.log(row); row = '';
      }
    }
    
    console.log('------------------------------------');
  }
};

module.exports = Board;
