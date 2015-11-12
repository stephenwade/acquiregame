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
        this.board[x][y] = new BoardCell(this.context, y, x);
        this.board[x][y].filled = Math.random() >= 0.5;
      }
    }
  }
  
  attach() {
    var self = this;
    this.drawFrame = window.requestAnimationFrame( () => self.draw() );
    
    socket.emit('start game');
    socket.on('game started', (msg) => self.animatePlayerOrder(msg) );
  }
  
  detatch() {
    window.cancelAnimationFrame(this.drawFrame);
  }
  
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawBoard();
    var self = this;
    window.requestAnimationFrame( () => self.draw() );
  };
  
  drawBoard() {
    var size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
    
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 9; y++) {
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
  
  findClickSubject(event) {
    var rect = this.canvas.getBoundingClientRect();
    var size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
    var x = ((event.clientX - rect.left) / size)|0;
    var y = ((event.clientY - rect.top) / size)|0;
    
    this.board[x][y].flip();
  }
  
  animatePlayerOrder(msg) {
    console.log('players:', msg.players);
    console.log('starting tiles:', msg.startingTiles);
    
    // animate picking player order
    
    socket.emit('board ready');
  }
};
