//EaselJS Spritesheet
var spritesheetPath='./sprites/cloud.png';

// cloud
var cloud = function() {this.initialize();}
cloud._SpriteSheet = new createjs.SpriteSheet({

	images: [spritesheetPath], 
	frames:[
		[0, 0, 219, 260, 0, 0, 0],
		[219, 0, 219, 260, 0, 0, 0],
		[438, 0, 219, 260, 0, 0, 0],
		[0, 260, 219, 260, 0, 0, 0],
		[219, 260, 219, 260, 0, 0, 0]
	],
	animations: {
		signal: { 
			frames: [0, 1, 2, 3, 4], 
			frequency: 4, 
			next: true
		}
	}
});

var cloud_p = cloud.prototype = new createjs.BitmapAnimation();
cloud_p.BitmapAnimation_initialize = cloud_p.initialize;
cloud_p.initialize = function() {
	this.BitmapAnimation_initialize(cloud._SpriteSheet);
	this.paused = false;
}

module.exports = cloud;
