
var Survivor = require("../../lib/animations/survivor");

module.exports = Marionette.ItemView.extend({

	/**
	 * 4th SceneView: fourth sub-view of the SliderView.
	 */
	sliderIndex: 3,
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
	survivor: 0,
	survivorStage: 0,

	events: {
		"tap .howTo": "answer",
		"tap .solution": "jumpTo"
	},

	initialize: function() {
		var self = this;

		/* setup the survivors that shaking their
		 * hands on the second scene.
		 * see lib/animations/cloud for the "wave"
		 * animation.
		 */
		self.survivor = new Survivor();
		self.survivorStage = new createjs.Stage($(".survivor")[0]);
		self.survivor.x = 0;
		self.survivor.y = 0;
		self.survivor.gotoAndPlay("wave");
		self.survivorStage.addChild(self.survivor);

		createjs.Ticker.addListener(function () {
	    	self.survivorStage.update();
	    }); 

		_.bindAll(self, "slideAwayScene1Elements", "slideAwayScene2Elements", "slideAwayElements", "slideInElements", 
						"_lotusFloat", "lotusFloat",
						"answer", "jumpTo");


		/* subscribe broadcast event. 
		 * get notified when sliding get start.
		 */
		app.vent.on('view:slide:left:start', function(index) {

			if ( self.sliderIndex === index ) {
				self.slideAwayElements();
			}

		});

		app.vent.on('view:slide:right:start', function(index) {

			if ( self.sliderIndex === index ) {
				self.slideAwayElements();
			}

		});

		/* subscribe broadcast event. 
		 * get notified when sliding was completed.
		 */
		app.vent.on("view:slide:left:end", function(index) {

			if ( self.sliderIndex === index) {
				self.slideInElements();
			}

		});

		app.vent.on("view:slide:right:end", function(index) {

			if ( self.sliderIndex === index) {
				self.slideInElements();
			}
			
		});

		self.lotusFloat();

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
			top: "23%",
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
				top: "23%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
	            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
				"opacity": 0
			}, 500, 'easeOutQuart');
		});

		self.$(".lotus").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 100);

		self.$(".cat").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)",
			"opacity": 1
		}, 100);

		self.$(".island").animate({
			"right": "11.93%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
        	"filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		}, 400, 'easeInQuart');

		self.$(".survivor").animate({
			"right": "6.93%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
        	"filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 400, 'easeInQuart');
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
				top: "28%",
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

	/**
	 * the essential processes of floating 
	 * lotus on the second scene.
	 *
	 * @$el: the lotus element.
	 * @leftPos: left position of the lotus element.
	 * @speed: the animation speed of the louts.
	 */
	_lotusFloat: function( $el, leftPos, speed ) {

		setInterval(function() {
			$el.animate({
				left: (leftPos + 1) + "%"
			}, speed, function() {
				$el.animate({
					left:  (leftPos - 1) + "%" 
				}, speed, function() {
					$el.animate({
						left: leftPos + "%"
					}, speed);
				});
			});
		}, (speed * 3) + 300 );

	},

	/** 
	 * floating lotus for the second scene.
	 */
	lotusFloat: function() {
		var self = this;
		var $appleLotus = self.$(".lotus .apple"),
			$androidLotus = self.$(".lotus .android"),
			$msLotus = self.$(".lotus .ms");

		self._lotusFloat( $androidLotus, 48.33, 1300 );
		self._lotusFloat( $appleLotus, 0, 1200 );
		self._lotusFloat( $msLotus, 30.56, 1000 );
	},

	answer: function() {
		var self = this;
		self.sceneCurIndex = (self.sceneCurIndex < self.sceneNum - 1) ?
								(self.sceneCurIndex + 1) : (self.sceneNum - 1);

		self.$(".howTo").animate({
			"left": "-50%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 400, 'easeInQuart', function() {
			self.$(".solution").animate({
				"left": "11.13%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
	            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
				"opacity": 1
			}, 400, 'easeOutQuart');
		});

		self.$(".cat").animate({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 400, 'easeInQuart', function() {
			self.$(".island").animate({
				"right": "15.93%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            	"filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
				"opacity": 0
			}, 400, 'easeInQuart');

			self.$(".survivor").animate({
				"right": "11.93%",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            	"filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
				"opacity": 1
			}, 400, 'easeInQuart');

			self.$(".lotus").animate({
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            	"filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
				"opacity": 1
			}, 400, 'easeInQuart');
		});
	},

	jumpTo: function() {
		// jump to the FamilyView".
		Backbone.history.navigate("!/feature/" + 2, {
	        trigger: true
	    });
	}

});