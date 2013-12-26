//EaselJS Spritesheet
var spritesheetPath='./sprites/dinosaur.png';

// dinosaur
var dinosaur = function() {this.initialize();}
dinosaur._SpriteSheet = new createjs.SpriteSheet({
	images: [spritesheetPath], 
	frames:[
		[0, 0, 229, 247, 0, 0, 0],
		[229, 0, 229, 247, 0, 0, 0]
	],
	animations: {
		surrender: { 
			frames:[0, 1],
			// frequency: 3, 
			frequency: 3, 
			next: true
		},

		idle: {
			frames:[0],
			// frequency: 4,
			frequency: 4,
			next: true
		}
	}
});

var dinosaur_p = dinosaur.prototype = new createjs.BitmapAnimation();
dinosaur_p.BitmapAnimation_initialize = dinosaur_p.initialize;
dinosaur_p.initialize = function() {
	this.BitmapAnimation_initialize(dinosaur._SpriteSheet);
	this.paused = false;
}

module.exports = dinosaur;

