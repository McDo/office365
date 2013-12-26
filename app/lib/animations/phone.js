//EaselJS Spritesheet
var spritesheetPath='./sprites/phone.png';

// phone
var phone = function() {this.initialize();}
phone._SpriteSheet = new createjs.SpriteSheet({

	images: [spritesheetPath], 
	frames:[
		[0, 0, 121, 158, 0, 0, 0],
		[121, 0, 121, 158, 0, 0, 0]
	],
	animations: {
		warning:{ 
			frames:[0, 1, 1, 1, 1, 1, 1, 0], 
			frequency:4, 
			next:true
		}
	}
});

var phone_p = phone.prototype = new createjs.BitmapAnimation();
phone_p.BitmapAnimation_initialize = phone_p.initialize;
phone_p.initialize = function() {
	this.BitmapAnimation_initialize(phone._SpriteSheet);
	this.paused = false;
}

module.exports = phone;
