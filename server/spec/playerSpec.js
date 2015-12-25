'use strict';

describe('Player', () => {
  let Player = require('../player');
  let player;
  
  beforeEach(() => {
    player = new Player(1, '1235', 'Capt. Picard');
  });
  
  describe('when first created', () => {
    it('should have no tiles', () => {
      expect(player.tiles.length).toBe(0);
    });
    
    it('should have $6000', () => {
      expect(player.money).toBe(6000);
    });
    
    it('should have no stock', () => {
      expect(player.portfolio['american']).toBe(0);
    });
  });
  
  it('should have one tile after adding one tile', () => {
    player.addTile('3E');
    expect(player.tiles.length).toBe(1);
  });
});
