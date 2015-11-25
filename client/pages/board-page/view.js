'use strict';

CanvasRenderingContext2D.prototype.tempState = function tempState(callback) {
  this.save(); callback(); this.restore();
}

Array.prototype.unique = () => {
  return this.reduce((p, c) => {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);
};

class BoardView {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    
    this.rows = 9;
    this.cols = 12;
    
    this.size = 0;
    this.messages = [];
    
    let now = new Date().getTime();
    
    this.board = new Board();
    
    this.tileViews = [];
    for (let cell of this.board) {
      this.tileViews.push(new BoardCell(this.context, cell, this));
    }
    
    this.board.lookup(3, 3).play();
    this.board.lookup(3, 3).setChain('Imperial');
    this.board.lookup(3, 4).play();
    this.board.lookup(3, 5).play();
    this.board.lookup(4, 4).play();
  }
  
  attach() {
    var self = this;
    this.drawFrame = window.requestAnimationFrame( () => self.draw() );
    
    socket.emit('start game');
    socket.on('game started', (msg) => self.animatePlayerOrder(msg) );
    socket.on('tile played', (msg) => self.playTile(msg) );
  }
  
  detatch() {
    window.cancelAnimationFrame(this.drawFrame);
    socket.removeListener('game started');
  }
  
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawBoard();
    this.drawAllMessages();
    
    var self = this;
    window.requestAnimationFrame( () => self.draw() );
  };
  
  drawBoard() {
    for (let view of this.tileViews) {
      view.draw();
    }
  }
  
  drawPointer(x, y, width, height, borderWidth, background, border) {
    this.context.lineWidth = borderWidth;
    this.context.fillStyle = background;
    this.context.strokeStyle = border;
    
    let arrowWidth = height / 2;
    
    this.context.beginPath();
    this.context.moveTo(borderWidth, 0);
    this.context.lineTo(borderWidth + arrowWidth, -(height / 2));
    this.context.lineTo(borderWidth + arrowWidth + width, -(height / 2));
    this.context.lineTo(borderWidth + arrowWidth + width, height / 2);
    this.context.lineTo(borderWidth + arrowWidth, height / 2);
    this.context.lineTo(borderWidth, 0);
    this.context.fill();
    this.context.stroke();
  }
  
  drawMessage(message) {
    this.context.tempState( () => {
      let x = (message.col + 1) * this.size;
      let y = (message.row + 0.5) * this.size;
      let textWidth = this.context.measureText(message.text).width;
      let height = 30;
      let padding = 5;
      let arrowWidth = height / 2;
      let bodyWidth = textWidth + padding;
      let borderWidth = 2;
      
      let rightEdge = x + bodyWidth + arrowWidth + borderWidth * 2
      
      let direction = (rightEdge < this.canvas.width) ? 'left' : 'right';
      
      this.context.fillStyle = '#000000';
      this.context.strokeStyle = '#6666cc';
      this.context.textBaseline = 'middle';
      
      if (direction == 'left') {
        this.context.translate(x, y);
      
        this.drawPointer(0, 0, bodyWidth, height, borderWidth, '#000000', '#6666cc');
        
        this.context.fillStyle = '#ffffff';
        this.context.fillText(message.text, arrowWidth, 0);
      } else {
        this.context.translate(x - this.size, y);
        
        this.context.tempState( () => {
          this.context.scale(-1, 1);
          
          this.drawPointer(0, 0, bodyWidth, height, borderWidth, '#000000', '#6666cc');
        });
        
        this.context.fillStyle = '#ffffff';
        this.context.fillText(message.text, -arrowWidth - textWidth, 0);
      }
      
    });
  }
  
  drawAllMessages() {
    for (let message of this.messages) {
      if (message.animation.running) {
        this.drawMessage(message);
      }
    }
  }
  
  displayMessage(text, row, col, time) {
    let animation = new Animation(1000);
    animation.begin(time || new Date().getTime());
    
    this.messages.push({ text, row, col, animation });
    console.log('displayed message', text);
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
    
    for (let view of this.tileViews) {
      view.updateSize(this.size);
    }
  }
  
  fullscreen() {
    if (this.canvas.webkitRequestFullScreen) {
      this.canvas.webkitRequestFullScreen();
    }
  }
  
  playTile(tile, msg) {
    this.board.lookup(tile.row, tile.col).play();
    
    //let inheritance = this.getInheritance(tile.row, tile.col);
    
    //if (!inheritance.merger && inheritance.sides.length > 0) {
      //console.log('joined!', inheritance.sides[0]);
      //this.board[tile.row][tile.col].chain = inheritance.sides[0];
    //}
    //
    this.displayMessage(msg || 'Player played', tile.row, tile.col);
  }
  
  getNeighborChains(row, col) {
    let result = {};
    
    result.up    = (row > 0            ) ? this.board.lookup(row - 1, col    ).chain : false;
    result.right = (col < this.cols - 1) ? this.board.lookup(row    , col + 1).chain : false;
    result.down  = (row < this.rows - 1) ? this.board.lookup(row + 1, col    ).chain : false;
    result.left  = (col > 0            ) ? this.board.lookup(row    , col - 1).chain : false;
    
    return result;
  }
  
  getInheritance(row, col) {
    let neighbors = this.getNeighborChains(row, col);
    
    let result = { merger: false, sides: [] };
    
    for (let dir in neighbors) {
      if (neighbors[dir] !== 'none') {
        if (result.sides.unique.length > 1) {
          result.merger = true;
        }
        result.sides.push(neighbors[dir]);
      }
    }
    
    return result;
  }
  
  findClickSubject(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.size = Math.min(this.canvas.width / 12, this.canvas.height / 9);
    var col = ((event.clientX - rect.left) / this.size)|0;
    var row = ((event.clientY - rect.top) / this.size)|0;
    
    this.playTile({ row, col }, 'Clicked');
  }
  
  animatePlayerOrder(msg) {
    console.log('data:', msg);
    
    // animate picking player order
    let i = 0;
    let currentTime = new Date().getTime();
    
    for (let player of msg) {
      let cell = this.board[player.tile.col][player.tile.row];
      let displayTime = currentTime + i * 1000;
      
      this.displayMessage(player.player.nickname, cell.row, cell.col, displayTime);
      cell.flip(displayTime);
      i++;
    };
    
    setTimeout(() => { socket.emit('board ready') }, 3000);
  }
};
