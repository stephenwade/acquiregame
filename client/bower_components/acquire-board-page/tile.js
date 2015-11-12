'use strict';

class BoardCell {
  constructor(context, row, col) {
    this.context = context;
    this.row = row;
    this.col = col;
    
    this.filled = false;
    this.frame = 0;
    
    this.colors = {
      borderColor:      '#555555',
      emptyBackground:  '#ffffff',
      filledBackground: '#555555',
      emptyText:        '#000000',
      filledText:       '#ffffff'
    };
  }
  
  calcDimensions(size) {
    this.x = size * this.col;
    this.y = size * this.row;
    this.size = size;
    this.width = size * 0.9;
    this.padding = size * 0.05;
  }
  
  draw(size) {
    this.calcDimensions(size);
    
    this.drawOuterBox();
    this.drawInnerBox();
    this.drawText();
  }
  
  drawOuterBox() {
    this.context.strokeStyle = this.colors.borderColor;
    
    this.context.strokeRect(this.x, this.y, this.size, this.size);
  }
  
  drawInnerBox() {
    let id = this.filled ? 'filledBackground' : 'emptyBackground';
    
    this.context.fillStyle = this.colors[id];
    this.context.fillRect(this.x + this.padding,
                          this.y + this.padding,
                          this.width,
                          this.width);
  }
  
  drawText() {  
    let id = this.filled ? 'filledText' : 'emptyText';
    
    this.context.fillStyle = this.colors[id];
    this.context.font = (this.size / 3).toString() + 'px sans';
    this.context.textAlign = 'center';
    
    this.context.fillText(this.cellText(),
                          this.x + this.size / 2,
                          this.y + this.size * (3 / 5))
  }
  
  cellText() {
    return (this.col + 1) + '-' + String.fromCharCode(65 + this.row);
  }
  
  flip() {
    this.filled = !this.filled;
  }
}
