'use strict';

class StagingArea {
  constructor(text, size) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    
    this.text = text;
    this.size = size;
    this.frame = 1;
    
    this.colors = {
      borderColor:      '#555555',
      emptyBackground:  '#ffffff',
      filledBackground: '#555555',
      emptyText:        '#000000',
      filledText:       '#ffffff'
    };
  }
  
  draw(frame) {
    this.context.save();
    let id = frame < 0.5 ? 'filledText' : 'emptyText';
    
    this.context.fillStyle = this.colors[id];
    this.context.font = (this.size / 3).toString() + 'px sans';
    this.context.textAlign = 'center';
    
    this.context.translate(this.size / 2, 0);
    this.context.scale(Math.abs(this.frame * 2 - 1), 1);
    
    this.context.fillText(this.cellText(),
                          0, this.size * (3/5));
    this.context.restore();
  }
}
