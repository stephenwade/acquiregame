'use strict';

class BoardCell {
  constructor(context, cell, board) {
    this.context = context;
    this.cell = cell;
    this.row = cell.row;
    this.col = cell.col;
    this.board = board;
    
    this.frame = 1;
    this.filled = false;
    
    this.flipAnimation = new Animation(450);
    
    this.colors = {
      borderColor:        '#555555',
      emptyBackground:    '#ffffff',
      filledBackground:   '#555555',
      emptyText:          '#000000',
      filledText:         '#ffffff',
      
      imperialPrimary:    '#FF285A',
      imperialAccent:     '#C1002D',
      imperialText:       'filled',
      continentalPrimary: '#28FFCD',
      continentalAccent:  '#00C194',
      continentalText:    'empty',
      towerPrimary:       '#FFFA7A',
      towerAccent:        '#FFDA47',
      towerText:          'empty',
      festivalPrimary:    '#1CC424',
      festivalAccent:     '#15971C',
      festivalText:       'filled',
      americanPrimary:    '#6B65FF',
      americanAccent:     '#3E39D5',
      americanText:       'filled',
      worldwidePrimary:   '#A78966',
      worldwideAccent:    '#7B5F41',
      worldwideText:      'filled',
      luxorPrimary:       '#FFA042',
      luxorAccent:        '#F3871B',
      luxorText:          'empty',
      unclaimed:          '#555555'
    };
    
    this.emptyText  = new StagingArea(this.cell.label, this.colors.emptyText);
    this.filledText = new StagingArea(this.cell.label, this.colors.filledText);
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
    this.checkFlip();
    this.drawOuterBox();
    this.drawBoundaries();
    
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
    
    this.context.lineWidth = 1;
    this.context.strokeRect(this.x, this.y, this.size, this.size);
  }
  
  drawBoundaries() {
    if (this.cell.chain) {
      this.context.strokeStyle = this.colors[this.cell.chain + 'Accent'];
      this.context.lineWidth = 3;
      
      let neighbors = this.board.getNeighborChains(this.row, this.col)
      
      let lX = this.x + 2;
      let rX = this.x + this.size - 2;
      let tY = this.y + 2;
      let bY = this.y + this.size - 2;
      
      this.context.beginPath();
      
      if (neighbors.up !== this.cell.chain) {
        this.context.moveTo(lX, tY);
        this.context.lineTo(rX, tY);
        this.context.stroke();
      }
      
      if (neighbors.right !== this.cell.chain) {
        this.context.moveTo(rX, tY);
        this.context.lineTo(rX, bY);
        this.context.stroke();
      }
      
      if (neighbors.down !== this.cell.chain) {
        this.context.moveTo(rX, bY);
        this.context.lineTo(lX, bY);
        this.context.stroke();
      }
      
      if (neighbors.left !== this.cell.chain) {
        this.context.moveTo(lX, bY);
        this.context.lineTo(lX, tY);
        this.context.stroke();
      }
    }
  }
  
  drawInnerBox() {
    let colorId = this.flipAnimation.frame < 0.5 ? 'filledBackground' : 'emptyBackground';
    if (colorId === 'filledBackground' && this.cell.chain) {
      colorId = this.cell.chain + 'Primary';
    }
    
    this.context.fillStyle = this.colors[colorId];
    this.context.fillRect(0, 0, this.size, this.size);
  }
  
  drawText() {
    var imgId = this.flipAnimation.frame < 0.5 ? 'filledText' : 'emptyText';
    if (imgId === 'filledText' && this.cell.chain) {
      imgId = this.colors[this.cell.chain + 'Text'] + 'Text';
    }
    
    this.context.drawImage(this[imgId].canvas, 0, 0);
  }
  
  checkFlip() {
    if (!this.filled && this.cell.state === 'filled') {
      let startTime = new Date().getTime();
      this.flipAnimation.begin(startTime);
      this.filled = true;
    }
  }
}
