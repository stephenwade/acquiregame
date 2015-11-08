'use strict';

class BoardView {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    
    this.frame = 0;
    this.board = [];
    for (let x = 0; x < 12; x++) {
      this.board.push([]);
      
      for (let y = 0; y < 9; y++) {
        this.board[x][y] = Math.random() >= 0.5;
      }
    }
  }
  
  attach() {
    var self = this;
    this.drawInterval = window.setInterval( () => self.draw() , 40);
  }
  
  detatch() {
    window.clearInterval(this.drawInterval);
  }
  
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawBoard();
  };
  
  drawBoard() {
    var size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
    
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 9; y++) {
        this.drawSpace({x, y}, size, this.board[x][y]);
      }
    }
  }
  
  drawSpace(cell, size, filled) {
    let width = size * 0.90;
    let padding = size * 0.05;
    let text = (cell.x + 1).toString() + '-' + String.fromCharCode(65 + cell.y);
    let textColor;
    
    if (filled) {
      textColor = '#ffffff';
      
      this.context.fillStyle = '#555555';
      this.context.fillRect(size * cell.x + padding, size * cell.y + padding, width, width);
    } else {
      textColor = '#000000';
      
      this.context.strokeRect(size * cell.x + padding, size * cell.y + padding, width, width);
    }
    this.context.strokeStyle = '#555555';
    this.context.strokeRect(size * cell.x, size * cell.y, size, size);
    
    this.context.fillStyle = textColor;
    this.context.font = (size / 3).toString() + 'px sans';
    this.context.textAlign = 'center';
    this.context.fillText(text, size * cell.x + size / 2, size * cell.y + size * (3 / 5));
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }
  
  fullscreen() {
    if (this.canvas.webkitRequestFullScreen) {
      this.canvas.webkitRequestFullScreen();
    }
  }
};
