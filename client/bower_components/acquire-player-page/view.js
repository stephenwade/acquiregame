'use strict';

CanvasRenderingContext2D.prototype.tempState = function tempState(callback) {
  this.save(); callback(); this.restore();
}

class PlayerView {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    
    this.size = 0;
  }
  
  attach() {
    var self = this;
    this.drawFrame = window.requestAnimationFrame( () => self.draw() );
  }
  
  detatch() {
    window.cancelAnimationFrame(this.drawFrame);
  }
  
  draw() {
    
    this.context.fillStyle = '#ff0000';
    this.context.fillRect(20, 20, 50, 50);
    
    var self = this;
    window.requestAnimationFrame( () => self.draw() );
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
  }
};
