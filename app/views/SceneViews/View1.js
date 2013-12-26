
// animated objects created with createjs. 
var Fire = require("../../lib/animations/flame"),
	Dinosaur = require("../../lib/animations/dinosaur");

module.exports = Marionette.ItemView.extend({

	/**
	 * 2nd SceneView: second sub-view of the SliderView.
	 */
	sliderIndex: 1,
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
	fire: 0,
	dinosaur: 0,
	fireStage: 0,
	dinosaurStage: 0,
	surrenderRandom: Math.floor((Math.random() * 100) + 1),
	surrenderPedometer: 0,
	idleRandom: Math.floor((Math.random() * 3) + 1),
	idlePedometer: 0,

	events: {
		"tap .howTo": "anwser",
		"tap .solution": "jumpTo"
	},

	initialize: function() {
		var self = this;

		/* setup the little dinosaur that spitting 
		 * fire on the first scene.
		 * see lib/animations/flame for the "startFire"
		 * animation.
		 */
		self.fire = new Fire();
		self.fireStage = new createjs.Stage($("#flame")[0]);
		self.fire.x = 0;
		self.fire.y = 0;
		self.fire.gotoAndPlay("startFire");
		self.fireStage.addChild(self.fire);

		/* setup the dinosaur that shaking a white
		 * flag on the second scene.
		 * see lib/animations/dinosaur for the "surrender"
		 * animation.
		 */
		self.dinosaur = new Dinosaur();
		self.dinosaurStage = new createjs.Stage($(".dinosaurSurrender")[0]);
		self.dinosaur.x = 0;
		self.dinosaur.y = 0;
		self.dinosaur.gotoAndPlay("surrender");
		self.dinosaurStage.addChild(self.dinosaur);

		createjs.Ticker.useRAF = true;
	    createjs.Ticker.setFPS(15);
	    createjs.Ticker.addListener(function () {

	    	/* the dinosaur would shake his white flag in a random
	    	 * period of time.
	    	 */
	    	if ( self.surrenderPedometer !== self.surrenderRandom ) {
	    		self.dinosaur.gotoAndPlay("surrender");
	    		self.surrenderPedometer++;
	    	} else {
	    		if ( self.idlePedometer === self.surrenderRandom ) {
	    			self.surrenderPedometer = 0;
	    			self.surrenderRandom = Math.floor((Math.random() * 100) + 1);
	    			self.idlePedometer = 0;
	    			self.idleRandom = Math.floor((Math.random() * 3) + 1);
	    		} else {
	    			self.dinosaur.gotoAndPlay("idle");
	    			self.idlePedometer++;
	    		}
	    	}

	    	self.fireStage.update();
	    	self.dinosaurStage.update();
	    });     

		_.bindAll(self, "slideAwayElements", "slideAwayScene1Elements", "slideAwayScene2Elements", "slideInElements", "anwser");

		/* subscribe broadcast event. 
		 * get notified when sliding get start.
		 */
		app.vent.on('view:slide:left:start', function( index ) {

			if ( self.sliderIndex === index ) self.slideAwayElements();

		});

		app.vent.on('view:slide:right:start', function( index ) {

			if ( self.sliderIndex === index ) self.slideAwayElements();
			
		});

		/* subscribe broadcast event. 
		 * get notified when sliding was completed.
		 */
		app.vent.on("view:slide:left:end", function( index ) {

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

		self.$(".primitive").animate({
			right: "25%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 200, 'easeInQuart');

		self.$(".modern").animate({
			right: "10%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0 
		}, 500, 'easeOutQuart');

		self.$("#flame").animate({
			right: "27.20%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		});

		self.$(".dinosaurSurrender").animate({
			right: "30%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 500, 'easeOutQuart');
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
		}, 400)

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

		self.$(".primitive").animate({
			right: "35%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 200, 'easeInQuart');

		self.$(".modern").animate({
			right: "22%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 500, 'easeOutQuart');

		self.$("#flame").animate({
			right: "13%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		});

		self.$(".dinosaurSurrender").animate({
			right: "32.20%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 500, 'easeOutQuart');
	},

	jumpTo: function() {
		// jumping to the 'FamilyView'.
		Backbone.history.navigate("!/feature/" + 2, {
	        trigger: true
	    });
	}

});