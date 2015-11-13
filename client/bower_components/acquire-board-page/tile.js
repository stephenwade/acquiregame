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
    
    this.stagingArea = new StagingArea(this.cellText());
    this.data = ['m 21.522426,1021.4179 -4.5961,0 0,-31.83702 -7.9011609,3.53745 0,-4.3379 11.7742789,-5.13833 0.722982,0 0,37.7758 z',
     'm 48.931212,1021.4179 -21.01812,0 0,-3.4342 10.328314,-13.685 q 1.420143,-1.8849 2.323871,-3.3309 0.929548,-1.44592 1.445964,-2.63368 0.542236,-1.21357 0.722982,-2.2464 0.206566,-1.05866 0.206566,-2.14313 0,-1.39432 -0.33567,-2.6079 -0.33567,-1.2394 -0.98119,-2.14312 -0.645519,-0.90373 -1.600889,-1.42015 -0.929548,-0.54223 -2.143125,-0.54223 -1.575068,0 -2.711182,0.56805 -1.110294,0.56806 -1.859097,1.57507 -0.722982,1.00701 -1.084473,2.42716 -0.33567,1.39432 -0.33567,3.09849 l -4.570279,0 q 0,-2.37551 0.67134,-4.49282 0.671341,-2.1173 1.988201,-3.69237 1.31686,-1.57507 3.279239,-2.47879 1.988201,-0.92955 4.621921,-0.92955 2.272229,0 4.053864,0.72298 1.807455,0.72298 3.046852,2.06566 1.239398,1.31686 1.884918,3.17596 0.67134,1.8591 0.67134,4.1055 0,1.65253 -0.464774,3.33089 -0.438953,1.67835 -1.239398,3.35668 -0.800444,1.6525 -1.859096,3.3051 -1.058653,1.6267 -2.246409,3.2018 l -8.365934,10.948 15.569934,0 0,3.8989 z',
     'm 61.505017,1007.3972 -10.663985,0 0,-3.8989 10.663985,0 0,3.8989 z',
     'm 90.974834,1021.4179 -4.751025,0 0,-17.3774 -15.130981,0 0,17.3774 -4.725203,0 0,-37.59506 4.725203,0 0,16.16382 15.130981,0 0,-16.16382 4.751025,0 0,37.59506 z']
  }
  
  updateSize(size) {
    this.size = size;
    this.stagingArea.draw(size);
    
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
    
    this.context.drawImage(this.stagingArea.canvas, -(this.size / 2) | 0, this.y | 0);
    
    this.context.restore();
  }
  //drawText() {
  //  var path = new Path2D(this.data[0]);
  //  this.context.fill(path);
  //}
  
  cellText() {
    return (this.col + 1) + '-' + String.fromCharCode(65 + this.row);
  }
  
  flip(startTime) {
    this.filled = !this.filled;
    
    this.startTime = startTime;
    this.endTime = startTime + this.flipDuration;
    
    this.frame = this.progress();
  }
  
  progress() {
    let currentTime = new Date().getTime();
    if (this.endTime) {
      let progress = (this.endTime - currentTime) / (this.endTime - this.startTime);
      
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
