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
    socket.on('tile played', (msg) => self.removeTile(msg) );
  }
  
  detatch() {
    window.cancelAnimationFrame(this.drawFrame);
  }
  
  addTiles(tiles) {
    for (let tile of tiles) {
      this.hand.push(tile);
      console.log(tile);
    }
  }
  
  draw() {
    this.drawHand();
    
    var self = this;
    window.requestAnimationFrame( () => self.draw() );
  }
  
  drawHand() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.hand.length; i++) {
      this.drawTile(this.hand[i], i);
    }
  }
  
  drawTile(tile, spot) {
    this.context.fillStyle = '#555555';
    this.context.fillRect(20 + spot * 70, 20, 50, 50);
    
    this.context.fillStyle = '#ffffff';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = (this.size / 3).toString() + 'px Roboto';
    this.context.fillText(tile.label, 45 + spot * 70, 45, 50, 50);
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
  }
  
  playTile(i) {
    socket.emit('tile chosen', this.hand[i]);
  }
  
  removeTile(tile) {
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].row === tile.row && this.hand[i].col === tile.col) {
        this.hand.splice(i, 1);
      }
    }
  }
  
  findClickSubject(event) {
    let rect = this.canvas.getBoundingClientRect();
    
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    if (y >= 20 && y <= 70) {
      for (let i = 0; i < this.hand.length; i++) {
        if (x >= 20 + i * 70 && x <= 70 + i * 70) {
          this.playTile(i);
        }
      } 
    }
  }
};
