
module.exports = Marionette.ItemView.extend({

	/**
	 * 5th SceneView: fifth sub-view of the SliderView.
	 */
	sliderIndex: 4,
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

	events: {
		"tap .joinUs": "joinUs"
	},

	joinUs: function() {
		window.open("http://e.weibo.com/msftoffice2010");
	}

});