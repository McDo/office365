
var share2 = require("../lib/share");

module.exports = Marionette.ItemView.extend({

	/**
	 * 5th view: share to social platforms. 
	 *		     and site info.
	 */
	viewId: 4,
	/* the estimated time of moving the sub 
	 * elements away before the view being 
	 * scrolled up or down. 
	 * a 'public' property used by AppController.
	 */
	scrollAwayElementsDuration: 0,

	events: {
		"tap .sina": "shareToSina",
		"tap .renren": "shareToRenren"
	},

	initialize: function() {
		var self = this,
			$children = this.$el.children();

		_.bindAll(self, 'adjustViewHeight');

		self.adjustViewHeight();
		$(window).resize(self.adjustViewHeight);

		/* subscribe broadcast event. 
		 * get notified when page start scrolling.
		 */
		app.vent.on('view:scrolling:up:start', function() {
			self.adjustViewHeight();
		});

		app.vent.on('view:scrolling:down:start', function() {
			self.adjustViewHeight();
		});
	},

	adjustViewHeight: function() {
		var self = this;
		var	$parent = self.$el.parent();

		/* 1. adjust the height of parent to be the actual height of window.
		 * 2. this.$el.height == this.parent.$el.height(window.height) - nav.height.
		 */ 
		$parent.height( app.windowHeight() );
		self.$el.height( $parent.height() - $("#nav").height() );
	},

	shareToSina: function() {
		share2.sina();
	},

	shareToRenren: function() {
		share2.renren();
	}
});