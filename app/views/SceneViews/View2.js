
// animated objects created with createjs. 
var Triceratops = require("../../lib/animations/triceratops"),
	Phone = require("../../lib/animations/phone");
	Cloud = require("../../lib/animations/cloud");

module.exports = Marionette.ItemView.extend({

	/**
	 * 3rd SceneView: third sub-view of the SliderView.
	 */
	sliderIndex: 2,
	// each SceneView has its scenes the number of sceneNum.
	sceneNum: 2,
	// the index of the scene that being displayed currently.
	sceneCurIndex: 0,
	/* the estimated time of moving the sub 
	 * elements away before the view being 
	 * slided left or right. 
	 * a 'public' property used by SliderView.
	 */
	slideAwayElementsDuration: 0,

	// things for createjs animations.
	triceratops: 0,
	phone: 0,
	cloud: 0,
	cloudStage: 0,
	triceratopsStage: 0,
	phoneStage: 0,
	warningRandom: Math.floor((Math.random() * 40) + 1),
	warningPedometer: 0,
	idleRandom: Math.floor((Math.random() * 3) + 1),
	idlePedometer: 0,

	events: {
		"tap .howTo": "anwser",
		"tap .solution": "jumpTo"
	},

	initialize: function() {
		var self = this;

		/* setup the cloud that transmitting signals
		 * on the first scene.
		 * see lib/animations/cloud for the "signal"
		 * animation.
		 */
		self.cloud = new Cloud();
		self.cloudStage = new createjs.Stage($(".cloudWithSignal")[0]);
		self.cloud.x = 0;
		self.cloud.y = 0;
		self.cloud.gotoAndPlay("signal");
		self.cloudStage.addChild(self.cloud);

		/* setup the yelling mobile phone on the 
		 * second scene.
		 * see lib/animations/cloud for the "warning"
		 * animation.
		 */
		self.phone = new Phone();
		self.phoneStage = new createjs.Stage($(".phone")[0]);
		self.phone.x = 0;
		self.phone.y = 0;
		self.phone.gotoAndPlay("warning");
		self.phoneStage.addChild(self.phone);

		/* setup the dizzy triceratops on the 
		 * second scene.
		 * see lib/animations/cloud for the "dizzy"
		 * animation.
		 */
		self.triceratops = new Triceratops();
		self.triceratopsStage = new createjs.Stage($(".triceratops")[0]);
		self.triceratops.x = 0;
		self.triceratops.y = 0;
		self.triceratops.gotoAndPlay("dizzy");
		self.triceratopsStage.addChild(self.triceratops);

	    createjs.Ticker.addListener(function () {
	    	self.cloudStage.update();
	    	self.phoneStage.update();
	    	self.triceratopsStage.update();
	    });     

		_.bindAll(self, "slideAwayElements", "slideAwayScene1Elements", "slideAwayScene2Elements", "slideInElements", 
						"anwser", "jumpTo");

		/* subscribe broadcast event. 
		 * get notified when sliding get start.
		 */
		app.vent.on('view:slide:left:start', function(index) {

			if ( self.sliderIndex === index ) self.slideAwayElements();

		});

		app.vent.on('view:slide:right:start', function(index) {

			if ( self.sliderIndex === index ) self.slideAwayElements();

		});

		/* subscribe broadcast event. 
		 * get notified when sliding was completed.
		 */
		app.vent.on("view:slide:left:end", function(index) {

			if ( self.sliderIndex === index) self.slideInElements();

		});

		app.vent.on("view:slide:right:end", function(index) {

			if ( self.sliderIndex === index) self.slideInElements();

		});
	},

	/**
	 * move sub elemnts of the first scene
	 * out of the view, when the view starts 
	 * sliding away.
	 */
	slideAwayScene1Elements: function() {
		var self = this;

		self.$(".howTo")
		.animate({
			top: "15%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 660, 'easeInQuart');
	},

	/**
	 * move sub elemnts of the second scene
	 * out of the view, when the view starts 
	 * sliding away.
	 */
	slideAwayScene2Elements: function() {
		var self = this;

		self.$(".solution").animate({
			left: "-50%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 400, 'easeInQuart', function() {
			self.$(".howTo").animate({
				left: "11.13%",
				top: "15%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
	            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
				"opacity": 0
			}, 500, 'easeOutQuart');
		});

		self.$(".ready").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);

		self.$(".cloudWithSignal").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);

		self.$(".monster").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);

		self.$(".go").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);

		self.$(".phone").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);

		self.$(".cloud").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);

		self.$(".triceratops").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);
	},

	/**
	 * show up sub elemnts of the first scene 
	 * when the view was slided into view.
	 */
	slideInElements: function() {
		var self = this;

		var _t = setTimeout(function() {
			self.$(".howTo")
			.animate({
				top: "20%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
	            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
				"opacity": 1
			}, 200);

			clearTimeout(_t);
		}, 400);

	},

	/**
	 * move sub elemnts of the scene that
	 * currently displayed out of the view, 
	 * when the view starts sliding away.
	 */
	slideAwayElements: function() {
		var self = this;

		if ( 0 === self.sceneCurIndex ) {
			self.slideAwayScene1Elements();
		} else if ( 1 === self.sceneCurIndex ) {
			self.slideAwayScene2Elements();
		}
	},

	anwser: function() {
		var self = this;
		self.sceneCurIndex = (self.sceneCurIndex < self.sceneNum - 1) ?
								(self.sceneCurIndex + 1) : (self.sceneNum - 1);

		self.$el.
		stop().animate({
			backgroundPosition: "(58% 40%)"
		}, {
			duration: 680,
			easing: 'easeOutQuart'
		});

		self.$(".howTo").animate({
			left: "-50%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 400, 'easeInQuart', function() {
			self.$(".solution").animate({
				left: "11.13%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
	            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
				"opacity": 1
			}, 400, 'easeOutQuart');
		});

		self.$(".ready").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);
	
		self.$(".cloudWithSignal").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);

		self.$(".monster").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);

		self.$(".go").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);

		self.$(".phone").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);

		self.$(".cloud").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);

		self.$(".triceratops").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 100);
	},

	jumpTo: function() {
		// jump to the "#famlyChoice" section.
		Backbone.history.navigate("!/feature/" + 2, {
	        trigger: true
	    });
	}

});