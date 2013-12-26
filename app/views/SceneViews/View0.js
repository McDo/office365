
module.exports = Marionette.ItemView.extend({

	/**
	 * 1st SceneView: first sub-view of the SliderView.
	 */
	sliderIndex: 0,
	// each SceneView has its scenes the number of sceneNum.
	sceneNum: 1,
	// the index of the scene that being displayed currently.
	sceneCurIndex: 0,
	/* the estimated time of moving the sub 
	 * elements away before the view being 
	 * slided left or right. 
	 * a 'public' property used by SliderView.
	 */
	slideAwayElementsDuration: 0,

	initialize: function() {
		var self = this;

		_.bindAll(self, "slideAwaySceneElements", "slideAwayElements", "slideAwaySceneElements", "slideInElements");

		/* subscribe broadcast event. 
		 * get notified when sliding get start.
		 */
		app.vent.on('view:slide:left:start', function(index) {
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
	},

	/**
	 * move sub elemnts of the first scene
	 * out of the view, when the view starts 
	 * sliding away.
	 */
	slideAwaySceneElements: function() {
		var self = this;

		self.$("h1")
		.animate({
			left: "8%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 700, 'easeInQuart', function() {
			$(this).css({
				left: "21.53%"
			});
		});

		self.$("#cloud1")
		.animate({
			left: "18%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 590, 'easeInQuart', function() {
			$(this).css({
				left: "35%"
			});
		});

		self.$("#cloud2")
		.animate({
			left: "28%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0 
		}, 650, 'easeInQuart', function() {
			$(this).css({
				left: "43.1%"
			});
		});

		self.$("#mountain")
		.animate({
			right: "50%",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
			"opacity": 0
		}, 690, 'easeInQuart', function() {
			$(this).css({
				right: "24%"
			});
		});
		
	},

	/**
	 * show up sub elemnts of the first scene 
	 * when the view was slided into view.
	 */
	slideInElements: function() {
		var self = this;

		self.$("h1")
		.css({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		});

		self.$("#cloud1")
		.css({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1
		});

		self.$("#cloud2")
		.css({
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
			"opacity": 1 
		});

		self.$("#mountain")
		.css({
			"opacity": 1
		});
	},

	/**
	 * move sub elemnts of the scene that
	 * currently displayed out of the view, 
	 * when the view starts sliding away.
	 */
	slideAwayElements: function() {
		var self = this;

		self.slideAwaySceneElements();
	}

});