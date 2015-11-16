'use strict';

class BoardCell {
  constructor(context, row, col) {
    this.context = context;
    this.row = row;
    this.col = col;
    
    this.filled = false;
    this.frame = 1;
    
    this.flipAnimation = new Animation(400);
    
    this.colors = {
      borderColor:       '#555555',
      emptyBackground:   '#ffffff',
      filledBackground:  '#555555',
      emptyText:         '#000000',
      filledText:        '#ffffff'
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
    this.drawOuterBox();
    
    this.context.tempState(() => {
      let path = Math.abs(this.flipAnimation.frame * 2 - 1);
      
      let middle = this.width / 2;
      let indent = middle * (1 - path);
      
      this.context.translate(this.x + indent, this.y);
      this.context.scale(path, 1);
      
      this.drawInnerBox();
      this.drawText();
    })
  }
  
  drawOuterBox() {
    this.context.strokeStyle = this.colors.borderColor;
    
    this.context.strokeRect(this.x, this.y, this.size, this.size);
  }
  
  drawInnerBox() {
    let colorId = this.flipAnimation.frame < 0.5 ? 'filledBackground' : 'emptyBackground';
    
    this.context.fillStyle = this.colors[colorId];
    this.context.fillRect(this.padding, this.padding, this.width, this.width);
  }
  
  drawText() {
    var imgId = this.flipAnimation.frame < 0.5 ? 'filledText' : 'emptyText';
    
    this.context.drawImage(this[imgId].canvas, 0, 0);
  }
  
  cellText() {
    return (this.col + 1) + '-' + String.fromCharCode(65 + this.row);
  }
  
  flip(startTime) {
    console.log('flipping', this.row, this.col, 'at', startTime);
    this.filled = !this.filled;
    
    this.flipAnimation.begin(startTime);
  }
}
