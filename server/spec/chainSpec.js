'use strict';

describe('Chain', () => {
  let Chain = require('../chain');
  let Tile  = require('../tile');
  let chain;
  
  beforeEach(() => {
    chain = new Chain('tower');
  });
  
  describe('when first created', () => {
    it('should have its name saved', () => {
      expect(chain.name).toBe('tower');
    });
    
    it('should have no tiles', () => {
      expect(chain.tiles.length).toBe(0);
    });
    
    it('should be in the appropriate price category', () => {
      expect(chain.priceCategory).toBe('low');
    });
  });
  
  it('should have one tile after adding one tile', () => {
    chain.addTile( new Tile(2, 3) );
    expect(chain.tiles.length).toBe(1);
  });
  
  it('should have a size equal to its number of tiles', () => {
    chain.addTile( new Tile(2, 3) );
    expect(chain.length).toBe(1);
  });
});
