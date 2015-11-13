'use strict';

class StagingArea {
  constructor(text, size) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    
    this.text = text;
    
    this.colors = {
      borderColor:      '#555555',
      emptyBackground:  '#ffffff',
      filledBackground: '#555555',
      emptyText:        '#000000',
      filledText:       '#ffffff'
    };
  }
  
  draw(size) {
    this.canvas.width = size;
    this.canvas.height = size;
    
    console.log('drawing');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.context.fillStyle = '#000000';
    this.context.font = (size / 3).toString() + 'px Roboto';
    this.context.textAlign = 'center';
    
    this.context.fillText(this.text,
                          size / 2, size * (3/5));
  }
}
