//EaselJS Spritesheet
var spritesheetPath='./sprites/survivor.png';

// survivor
var survivor = function() {this.initialize();}
survivor._SpriteSheet = new createjs.SpriteSheet({
	images: [spritesheetPath], 
	frames: [
		[0, 0, 715, 235, 0, 0, 0],
		[715, 0, 715, 235, 0, 0, 0]
	],
	animations: {
		wave: { 
			frames: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], 
			frequency: 3, 
			next: true
		}
	}
});

var survivor_p = survivor.prototype = new createjs.BitmapAnimation();
survivor_p.BitmapAnimation_initialize = survivor_p.initialize;
survivor_p.initialize = function() {
	this.BitmapAnimation_initialize(survivor._SpriteSheet);
	this.paused = false;
}

module.exports = survivor;

