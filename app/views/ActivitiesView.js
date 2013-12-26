
module.exports = Marionette.ItemView.extend({

	/**
	 * 2nd view.
	 */
	viewId: 1,
	/* the estimated time of moving the 
	 * sub elements away before the view 
	 * being scrolled up or down. 
	 * a 'public' property used by AppController.
	 */
	scrollAwayElementsDuration: 10,

	initialize: function() {
		var self = this,
			$children = this.$el.children();

		_.bindAll(self, 'adjustViewHeight', 
			'scrollElements', 'scrollAwayElements', 'scrollInElements');

		self.adjustViewHeight();
		$(window).resize(self.adjustViewHeight);
		self.scrollAwayElements();

		/* subscribe broadcast event. 
		 * get notified when page start scrolling.
		 */
		app.vent.on('view:scrolling:up:start', function( index ) {

			self.adjustViewHeight();
			if ( self.viewId === index ) self.scrollAwayElements();

		});

		app.vent.on('view:scrolling:down:start', function( index ) {

			self.adjustViewHeight();
			if ( self.viewId === index ) self.scrollAwayElements();

		});

		/* subscribe broadcast event. 
		 * get notified when page scrolling was completed.
		 */
        app.vent.on('view:scrolling:up:completed', function( index ) {

        	if ( self.viewId === index ) self.scrollInElements();

        });

        app.vent.on('view:scrolling:down:completed', function( index ) {

        	if ( self.viewId === index ) self.scrollInElements();

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

	/**
	 * animate sub elements of the current view when 
	 * it was scrolled into view or scrolled away.
	 * 
	 * @bpy: Y position of pictures' background.
	 * @top: top position of paragraph elements.
	 * @dur_b: duration of backgroundPosition animation.
	 * @ease: backgroundPosition animation easing.
	 * @opy_p: opacity of paragraph elements.
	 * @bottom: bottom position of the .guys.
	 * @opy_g: opacity of the .guys.
	 * @dur_p: duration of paragraph animation.
	 * @dur_g: duration of .guys animation.
	 * @bottom_btn: top position of the rightNowButton.
	 * @opy_btn: opacity of the rightNowButton.
	 * @dur_btn: duration of rightNowButton animation.
	 */
	scrollElements: function(bpy, top, dur_b, ease, opy_p, bottom, opy_g, dur_p, dur_g, bottom_btn, opy_btn, dur_btn) {
		var self = this,
			$children = this.$el.children();

		for ( var i = 0; i < 3; i++ ) {
			$children.eq(i)
			.stop().animate({
				backgroundPosition: "(50% " + bpy + ")"
			}, {
				duration: dur_b,
				easing: ease
			});	
		}

		self.$el.find('p').animate({
			"top": top,
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opy_p * 100) + ")",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opy_p * 100) + ")",
			"opacity": opy_p
		}, dur_p);

		self.$el.find('.rightNowBtn').animate({
			"bottom": bottom_btn,
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opy_btn * 100) + ")",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opy_btn * 100) + ")",
			"opacity": opy_btn
		}, dur_btn);

		self.$(".guy").animate({
			"bottom": bottom,
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opy_g * 100) + ")",
            "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opy_g * 100) + ")",
			"opacity": opy_g
		}, dur_g);
	},

	/**
	 * move sub elemnts out of the view, 
	 * when the view starts scrolled away.
	 */
	scrollAwayElements: function() {
		return this.scrollElements("30%", "30%", 300, 'easeOutQuart', 0, "-3%", 0, 450, 300, "6%", 0, 350);
	}, 

	/**
	 * show up sub elemnts when the view 
	 * was scrolled into view.
	 */
	scrollInElements: function() {
		return this.scrollElements("50%", "10%", 200, 'easeOutQuart', 1, 0, 1, 100, 100, "13%", 1, 100);
	}

});