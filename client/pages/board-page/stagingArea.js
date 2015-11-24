'use strict';

class StagingArea {
  constructor(text, color) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    
    this.text = text;
    this.color = color;
  }
  
  draw(size) {
    this.canvas.width = size;
    this.canvas.height = size;
    
    this.context.clearRect(0, 0, size, size);
    
    this.context.fillStyle = this.color;
    this.context.font = (size / 3).toString() + 'px Roboto';
    this.context.textAlign = 'center';
    
    this.context.fillText(this.text, size / 2, size * (3/5));
  }
}
