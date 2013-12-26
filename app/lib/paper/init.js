
paper.install(window);

Path.prototype.setWidth = function(width) {
  this.segments[3].point.x = this.segments[0].point.x + width;
  return this.segments[2].point.x = this.segments[1].point.x + width;
};

Path.prototype.setHeight = function(height) {
  this.segments[1].point.y = this.segments[0].point.y + height;
  return this.segments[2].point.y = this.segments[3].point.y + height;
};

Path.prototype.reset = function() {
  this.setWidth(0);
  this.setHeight(0);
  return this.smooth();
};