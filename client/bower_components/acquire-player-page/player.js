'use strict';

class Player {
  constructor() {
    this.state = 'waiting';
    
    this.hand = [];
    this.money = 6000;
    this.portfolio = {
      luxor: 0,
      tower: 0,
      american: 0,
      festival: 0,
      worldwide: 0,
      continental: 0,
      imperial: 0
    };
  }
  
  addTiles(tiles) {
    for (let tile of tiles) {
      this.hand.push(tile);
    }
  }
}
