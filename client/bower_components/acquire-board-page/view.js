'use strict';

class BoardView {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    
    this.frame = 0;
    this.board = [];
    
    var size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
    
    for (let x = 0; x < 12; x++) {
      this.board.push([]);
      
      for (let y = 0; y < 9; y++) {
        this.board[x][y] = new BoardCell(this.context, y, x, size);
        this.board[x][y].filled = Math.random() >= 0.5;
      }
    }
  }
  
  attach() {
    var self = this;
    this.drawInterval = window.setInterval( () => self.draw() , 40);
    
    socket.emit('start game');
    socket.on('game started', (msg) => self.animatePlayerOrder(msg) );
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
        //this.drawSpace({x, y}, size, this.board[x][y]);
        this.board[x][y].draw(size);
      }
    }
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
  
  animatePlayerOrder(msg) {
    console.log('players:', msg.players);
    console.log('starting tiles:', msg.startingTiles);
    
    // animate picking player order
    
    socket.emit('board ready');
  }
};
