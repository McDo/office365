
/**
 * Navigation View.
 */
module.exports = Marionette.ItemView.extend({

	events: {
		"tap .navItem": "scrollTo"
	},

	initialize: function() {
		var self = this;

		self.$(".navHomeCurtain").css({
			top: 0
		});

		_.bindAll(self, "hideNavBar", "showNavBar", "putNavBarTop", "putNavBarBottom", "navCurtainAnimation", "scrollTo");

		/* subscribe broadcast event. 
		 * get notified when page start scrolling.
		 */
		app.vent.on("view:scrolling:up:start", function( index ) {

			if ( 0 === index ) {
				// SliderView started to scroll up.

				self.hideNavBar(self.putNavBarTop);

			}  else if ( 1 === index ) {
				// ActivitiesView started to scroll up.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 2 === index ) {
				// FamilyView started to scroll up.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 3 === index ) {
				// ToolsView started to scroll up.

				self.showNavBar(50, self.putNavBarTop);

			} else if ( 4 === index ) {
				// ShareView started to scroll up.
				// Impossible.
			}  

		});

		app.vent.on('view:scrolling:down:start', function( index ) {

			self.navCurtainAnimation(index, index - 1);
			
			if ( 0 === index ) {
				// SliderView start to scroll down. 
				// Impossible.

			}  else if ( 1 === index ) {
				// ActivitiesView started to scroll down.

				self.hideNavBar(self.putNavBarBottom);

			}  else if ( 2 === index ) {
				// FamilyView started to scroll down.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 3 === index ) {
				// ToolsView started to scroll down.

				self.showNavBar(50, self.putNavBarTop);	
				
			} else if ( 4 === index ) {
				// ToolsView started to scroll down.

				self.showNavBar(50, self.putNavBarTop);	
			}

		});

		/* subscribe broadcast event. 
		 * get notified when page scrolling was completed.
		 */
		app.vent.on("view:scrolling:up:completed", function( index ) {
			
			if ( 0 === index ) {
				// SliderView being scrolled in from bottom.
				// Impossible.

			}  else if ( 1 === index ) {
				// ActivitiesView being scrolled in from bottom.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 2 === index ) {
				// FamilyView being scrolled in from bottom.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 3 === index ) {
				// ToolsView being scrolled in from bottom.

				self.showNavBar(50, self.putNavBarTop);	
				
			}  else if ( 4 === index ) {
				// ShareView being scrolled in from bottom.

				self.showNavBar(50, self.putNavBarTop);	

			}

		});

		app.vent.on("view:scrolling:down:completed", function( index ) {
			
			if ( 0 === index ) {
				// SliderView being scrolled in from top.

				self.showNavBar(50, self.putNavBarBottom);

			}  else if ( 1 === index ) {
				// ActivitiesView being scrolled in from top.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 2 === index ) {
				// FamilyView being scrolled in from top.

				self.showNavBar(50, self.putNavBarTop);

			}  else if ( 3 === index ) {
				// ToolsView being scrolled in from top.
				// Impossible.
				self.showNavBar(50, self.putNavBarTop);
			}  else if ( 4 === index ) {
				// ShareView being scrolled in from top.
				// Impossible.
			}

		});

		// change the appearance of nav bar based on screen width.
		$(window).resize(function() {
			if ( Modernizr.mq('all and (min-width: 1100px)') ) {

				var $thisCurtainArrow = self.$(".navArrow").eq(app.currentView);
				$thisCurtainArrow.show();

			} 
		});

	},

	hideNavBar: function( callback ) {
		var self = this;

		self.$el.animate({
			height: 0,
		}, 80, 'easeInQuart', function() {
			if ( callback && "function" === typeof callback) callback();
		});
	},

	showNavBar: function( h, callback ) {
		var self = this;

		self.$el.animate({
			height: h,
		}, 80, 'easeInQuart', function() {
			if ( callback && "function" === typeof callback) callback();
		});
	},

	putNavBarTop: function() {
		var self = this;

		if ( 0 !== parseFloat(self.$el.css('top')) ) {
			self.$el.css({
				top: 0,
				bottom: 'auto'
			});
		}
	},

	putNavBarBottom: function() {
		var self = this;

		if ( 0 !== parseFloat(self.$el.css('bottom')) ) {
			self.$el.css({
				top: 'auto',
				bottom: 0
			});
		}
	},

	/**
	 * hide the '.navCurtain' correspond to the view that 
	 * scrolled away and show off the '.navCurtain' correspond
	 * to the view that is going to be scrolled in.
	 *
	 * @viewId: the ID of the view that scrolled away.
	 * @nextViewId: the ID of the view that is about to 
	 *				scrolled in.
	 */
	navCurtainAnimation: function( viewId, nextViewId ) {
		var self = this,
			$thisCurtain = self.$(".navCurtain").eq(viewId),
			$thisCurtainArrow = self.$(".navArrow").eq(viewId),
			$nextCurtain = self.$(".navCurtain").eq(nextViewId),
			$nextCurtainArrow = self.$(".navArrow").eq(nextViewId);

		if ( Modernizr.mq('all and (min-width: 1100px)') ) {

			if ( 0 === parseFloat($thisCurtain.css("top")) 
				|| ( 0 !== parseFloat($thisCurtain.css("top")) && 4 === viewId ) ) {

				$thisCurtainArrow.animate({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
	                "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
	                "opacity": 0,
	                "top": 12 
				}, 140, 'easeInQuart');

				$thisCurtain.animate({
					top: "100%"
				}, 150, 'easeInQuart', function() {

					if ( 4 !== nextViewId ) {
						// ShareView doesn't have an anchor on nav bar.
						$nextCurtainArrow.animate({
							"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)",
			                "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)",
			                "opacity": 1,
			                "top": 17 
						}, 140, 'easeInQuart');

						$nextCurtain.animate({
							top: 0
						}, 150, 'easeOutQuart');
					}

				});
			}

		} else if ( Modernizr.mq('all and (max-width: 1099px)') ) {

			if ( 0 === parseFloat($thisCurtain.css("top"))
			|| ( 0 !== parseFloat($thisCurtain.css("top")) && 4 === viewId ) ) {

				$thisCurtain.animate({
					top: "100%"
				}, 150, 'easeInQuart', function() {

					if ( 4 !== nextViewId ) {
						// ShareView doesn't have an anchor on nav bar.
						$nextCurtain.animate({
							top: 0
						}, 150, 'easeOutQuart');
					}

				});
			}

		}
	},

	/**
	 * scroll to a specific view depends on 
	 * which '.navItem' being clicked/tapped.
	 */
	scrollTo: function( e ) {
		var self = this;
		var	idx = self.$(".navItem").index( e.currentTarget );

		if ( 4 > idx ) {
			Backbone.history.navigate("!/feature/" + idx, {
	            trigger: true
	        });
		}
	}

});