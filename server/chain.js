'use strict';

var Tile = require('./tile');

class Chain {
  constructor(name) {
    this.chainName = name;
    this.tiles = [];
    switch (name) {
      case 'tower':
      case 'luxor':
        this.priceCategory = 'low';
        break;
      case 'american':
      case 'festival':
      case 'worldwide':
        this.priceCategory = 'medium';
        break;
      case 'imperial':
      case 'continental':
        this.priceCategory = 'high';
    }
  }
  
  addTile(tile) {
    this.tiles.push(tile);
    console.log('chain', this.chainName, 'now has', this.tiles.map( (tile) => tile.getLabel() ));
  }
  
  addTiles(tiles) {
    tiles.forEach( (tile) => this.addTile(tile) );
  }
  
  get length() {
    return this.tiles.length;
  }
  
  get price() {
    let len = this.length, price;
    if (len <= 5) {
      price = len * 100;
    } else if (len >= 6 && len <= 40) {
      price = Math.ceil(len / 10) * 100 + 500;
    } else {
      price = 1000;
    }
    if (this.priceCategory == 'medium')
      price += 100;
    if (this.priceCategory == 'high')
      price += 200;
    return price;
  }
  
  get bonuses() {
    return {
      first: this.price * 10,
      second: this.price * 5
    }
  }
};

module.exports = Chain;
