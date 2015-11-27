'use strict';

class Animation {
  constructor(duration) {
    this.on = false;
    this.duration = duration;
  }
  
  begin(startTime) {
    this.on = !this.on;
    
    this.startTime = startTime ? startTime : new Date().getTime();
    this.endTime = this.startTime + this.duration;
  }
  
  get frame() {
    let currentTime = new Date().getTime();
    
    // Is the animation currently in progress?
    if (this.endTime) {
      let timeRemaining = this.endTime - currentTime;
      let totalTime     = this.endTime - this.startTime;
      
      let progress = timeRemaining / totalTime;
      
      if (progress < 0) {
        progress = 0;
      } else if (progress > 1) {
        progress = 1;
      }
      
      return this.on ? progress : (1 - progress);
    } else {
      return 1;
    }
  }
  
  get running() {
    let currentTime = new Date().getTime();
    
    return currentTime > this.startTime && currentTime < this.endTime;
  }
};
