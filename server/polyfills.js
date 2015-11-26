'use strict';
if (!Array.prototype.unique) {
  Array.prototype.unique = function() {
    console.log(this);
    
    return this.reduce((p, c) => {
      if (p.indexOf(c) < 0) p.push(c);
      return p;
    }, []);
  };
}
