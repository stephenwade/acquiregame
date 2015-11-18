'use strict';

CanvasRenderingContext2D.prototype.tempState = function tempState(callback) {
  this.save(); callback(); this.restore();
}

class PlayerView {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    
    this.size = 0;
    
    this.hand = [];
  }
  
  attach() {
    var self = this;
    this.drawFrame = window.requestAnimationFrame( () => self.draw() );
  }
  
  detatch() {
    window.cancelAnimationFrame(this.drawFrame);
  }
  
  addTiles(tiles) {
    for (let tile of tiles) {
      this.hand.push(tile);
    }
  }
  
  draw() {
    this.drawHand();
    
    var self = this;
    window.requestAnimationFrame( () => self.draw() );
  }
  
  drawHand() {
    this.context.fillStyle = '#555555';
    this.context.fillRect(20, 90, 50, 50);
    
    for (let i = 0; i < this.hand.length; i++) {
      this.drawTile(this.hand[i], i);
    }
  }
  
  drawTile(tile, spot) {
    this.context.fillStyle = '#555555';
    this.context.fillRect(20 + spot * 70, 20, 50, 50);
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
  }
};
