'use strict';

describe('Game', () => {
  let Game = require('../game');
  let game;
  
  beforeEach(() => {
    game = new Game('a1b2c3');
  });
  
  describe('when first created', () => {
    it('should have no players', () => {
      expect(game.players.length).toBe(0);
    });
  });
  
  describe('after it has started', () => {
    beforeEach(() => {
      game.addPlayer('Capt. Picard');
      game.addPlayer('Cmdr. Riker');
      game.addPlayer('Lt.-Cmdr Data');
      game.addPlayer('Lt.-Cmdr La Forge');
      
      game.startGame();
    });
    
    // TODO test something actually meaningful after the game has started
    it('should have an id', () => {
      expect(game.id).toBe('a1b2c3');
    });
  });
});
