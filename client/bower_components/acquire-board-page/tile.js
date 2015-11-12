'use strict';

class BoardCell {
  constructor(context, row, col) {
    this.context = context;
    this.row = row;
    this.col = col;
    
    this.filled = false;
    this.frame = 1;
    
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
    
    let now = new Date().getTime();
    if (this.endTime >= now) {
      this.frame = this.progress();
    }
  }
  
  drawOuterBox() {
    this.context.strokeStyle = this.colors.borderColor;
    
    this.context.strokeRect(this.x, this.y, this.size, this.size);
  }
  
  drawInnerBox() {
    let id = this.filled ? 'filledBackground' : 'emptyBackground';
    
    let x = this.x + this.padding + this.width * this.frame;
    let width = this.width * -(this.frame * 2 - 1);
    
    this.context.fillStyle = this.colors[id];
    this.context.fillRect(x,
                          this.y + this.padding,
                          width,
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
  
  flip(startTime) {
    this.filled = !this.filled;
    
    this.startTime = startTime;
    this.endTime = startTime + 500;
    
    console.log(this.progress());
    console.log(this.startTime, this.endTime)
  }
  
  progress() {
    let currentTime = new Date().getTime();
    let progress = (this.endTime - currentTime) / (this.endTime - this.startTime);
    
    if (progress < 0) {
      progress = 0;
    } else if (progress > 1) {
      progress = 1;
    }
    
    return this.filled ? (1 - progress) : (progress);
  }
}
