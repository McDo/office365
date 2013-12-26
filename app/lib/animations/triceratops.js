//EaselJS Spritesheet
var spritesheetPath='./sprites/triceratops.png';

// triceratops
var triceratops = function() {this.initialize();}
triceratops._SpriteSheet = new createjs.SpriteSheet(
	{
	images: [spritesheetPath], 
	frames:[
		[0, 0, 214, 233, 0, 0, 0],
		[214, 0, 214, 233, 0, 0, 0],
		[428, 0, 214, 233, 0, 0, 0],
		[0, 233, 214, 233, 0, 0, 0],
		[214, 233, 214, 233, 0, 0, 0],
		[428, 233, 214, 233, 0, 0, 0],
		[0, 466, 214, 233, 0, 0, 0],
		[214, 466, 214, 233, 0, 0, 0]
	],
	animations: {
		dizzy: { 
			frames: [0, 1, 2, 3, 4, 5, 6, 7, ], 
			frequency: 2, 
			next: true
		}
	}
});

var triceratops_p = triceratops.prototype = new createjs.BitmapAnimation();
triceratops_p.BitmapAnimation_initialize = triceratops_p.initialize;
triceratops_p.initialize = function() {
	this.BitmapAnimation_initialize(triceratops._SpriteSheet);
	this.paused = false;
}

module.exports = triceratops;
