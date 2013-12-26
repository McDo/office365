//EaselJS Spritesheet
var spritesheetPath='./sprites/fire.png';
// var spritesheetPath='./sprites/flame.png';

// fire
var fire = function() {this.initialize();}
fire._SpriteSheet = new createjs.SpriteSheet({
	images: [spritesheetPath], 
	frames:[
		[0, 0, 141, 205, 0, 0, 0],
		[141, 0, 141, 205, 0, 0, 0],
		[282, 0, 141, 205, 0, 0, 0],
		[0, 205, 141, 205, 0, 0, 0],
		[141, 205, 141, 205, 0, 0, 0],
		[282, 205, 141, 205, 0, 0, 0],
		[0, 410, 141, 205, 0, 0, 0]
		// [0, 0, 123, 175, 0, 0, 0],
		// [123, 0, 123, 175, 0, 0, 0],
		// [246, 0, 123, 175, 0, 0, 0],
		// [0, 175, 123, 175, 0, 0, 0],
		// [123, 175, 123, 175, 0, 0, 0],
		// [246, 175, 123, 175, 0, 0, 0],
		// [0, 350, 123, 175, 0, 0, 0]
	],
	animations: {
		startFire: {
			frames: [0, 1, 2, 3],
			// frequency: 4,
			frequency: 2,
			next: "fire1"
		},
		fire1: {
			frames: [4, 5, 6],
			// frequency: 5,
			frequency: 3,
			next: "fire2"
		},
		fire2: {
			frames: [0, 1, 2],
			// frequency: 4,
			frequency: 2,
			next: "fire3"
		},
		fire3: {
			frames: [1, 0],
			frequency: 3,
			next: "startFire"
		}
	}
});

var fire_p = fire.prototype = new createjs.BitmapAnimation();
fire_p.BitmapAnimation_initialize = fire_p.initialize;
fire_p.initialize = function() {
	this.BitmapAnimation_initialize(fire._SpriteSheet);
	this.paused = false;
}

module.exports = fire;
