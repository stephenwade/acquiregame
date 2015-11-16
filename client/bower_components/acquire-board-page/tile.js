'use strict';

class BoardCell {
  constructor(context, row, col) {
    this.context = context;
    this.row = row;
    this.col = col;
    
    this.filled = false;
    this.frame = 1;
    
    this.flipDuration = 400;
    
    this.colors = {
      borderColor:      '#555555',
      emptyBackground:  '#ffffff',
      filledBackground: '#555555',
      emptyText:        '#000000',
      filledText:       '#ffffff'
    };
    
    this.emptyText  = new StagingArea(this.cellText(), this.colors.emptyText);
    this.filledText = new StagingArea(this.cellText(), this.colors.filledText);
  }
  
  updateSize(size) {
    this.size = size;
    this.emptyText.draw(size);
    this.filledText.draw(size);
    
    this.calcDimensions(size);
  }
  
  calcDimensions(size) {
    this.x = size * this.col;
    this.y = size * this.row;
    this.size = size;
    this.width = size * 0.9;
    this.padding = size * 0.05;
  }
  
  draw() {
    this.frame = this.progress();
    
    this.drawOuterBox();
    this.drawInnerBox();
    this.drawText();
  }
  
  drawOuterBox() {
    this.context.strokeStyle = this.colors.borderColor;
    
    this.context.strokeRect(this.x, this.y, this.size, this.size);
  }
  
  drawInnerBox() {
    let id = this.frame < 0.5 ? 'filledBackground' : 'emptyBackground';
    
    let x = this.x + this.padding + this.width * this.frame;
    let width = this.width * -(this.frame * 2 - 1);
    
    this.context.fillStyle = this.colors[id];
    this.context.fillRect(x,
                          this.y + this.padding,
                          width,
                          this.width);
  }
  
  drawText() {
    this.context.save();
    
    this.context.translate(this.x + this.size / 2, 0);
    this.context.scale(Math.abs(this.frame * 2 - 1), 1);
    
    var img;
    
    if (this.frame < 0.5) {
      img = this.filledText.canvas;
    } else {
      img = this.emptyText.canvas;
    }
    
    this.context.drawImage(img, -(this.size / 2) | 0, this.y | 0);
    this.context.restore();
  }
  
  cellText() {
    return (this.col + 1) + '-' + String.fromCharCode(65 + this.row);
  }
  
  flip(startTime) {
    console.log('flipping', this.row, this.col, 'at', startTime);
    this.filled = !this.filled;
    
    this.startTime = startTime;
    this.endTime = startTime + this.flipDuration;
    
    this.frame = this.progress();
  }
  
  progress() {
    let currentTime = new Date().getTime();
    
    // Has an animation been set?
    if (this.endTime) {
      let timeRemaining = this.endTime - currentTime;
      let totalTime     = this.endTime - this.startTime;
      
      let progress = timeRemaining / totalTime;
      
      if (progress < 0) {
        progress = 0;
      } else if (progress > 1) {
        progress = 1;
      }
      
      return this.filled ? progress : (1 - progress);
    } else {
      return 1;
    }
  }
}
