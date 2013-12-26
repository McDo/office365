
module.exports = Marionette.ItemView.extend({

	/**
	 * 1st view: slider container and controller.
	 */
	viewId: 0,
	/* suppose to be the estimated time of moving 
	 * the sub elements away before the view being 
	 * scrolled up or down. 
	 * a 'public' property used by AppController.
	 * set it to 100ms thus leave some 'breathing time'
	 * for the view before it is scrolled away even
	 * if there isn't any sub element need to be moving
	 * away.  
	 */
	scrollAwayElementsDuration: 100,
    /* each slider view ( SceneViews ) would have its children 
     * elements moving away in 'slideAwayElementsDuration' 
     * milliseconds before slided left/right. 
     * And this.slideAwayTimeOut is the setTimeout function 
     * that ensuring these 2 kind of animations being animated 
     * in proper order. just like app.scrollAwayTimeOut.
     */
	slideAwayTimeOut: 0,
	subViews: [],
	curSubViewIndex: 0,
	$hammer: null,

	events: {
		"tap .slideLeft": "slideToLeftHandler",
		"tap .slideRight": "slideToRightHandler",
		"tap .slideThumbnail": "slideTo"
	},

	initialize: function( options ) {
		var self = this;
		_.bindAll(self, 'adjustViewHeight',
		 '_slideLeft', 'slideLeft', '_slideRight', 'slideRight',
		 'slideToLeftHandler', 'slideToRightHandler', 'slideTo',
		 'swipeLeftHandler', 'swipeRightHandler');

		self.adjustViewHeight();
		$(window).resize( self.adjustViewHeight );

		self.subViews = options.subViews;
		self.curSubViewIndex = 0;

		// touch device gestures supports using hammer.js.
		self.$hammer = self.$el.hammer({
			drag_block_vertical: true,
			drag_block_horizontal: true,
            swipe_velocity: 0.5
		});

		/* subscribe broadcast event. 
		 * get notified when page start scrolling.
		 */
		app.vent.on('view:scrolling:up:start', function() {
			self.adjustViewHeight();
		});

		self.$hammer.on('swipeleft', self.swipeLeftHandler);
		self.$hammer.on('swiperight', self.swipeRightHandler);

		self.$el.css({
	        "-ms-touch-action": "pan-y",
	        "touch-action": "pan-y"
    	});

	},

	adjustViewHeight: function() {
		var self = this;
		var $parent = self.$el.parent();

		/* 1. adjust the height of parent to be the actual height of window.
		 * 2. this.$el.height == this.parent.$el.height(window.height) - nav.height.
		 */ 
		$parent.height( app.windowHeight() );
		self.$el.height( $parent.height() - $("#nav").height() );
	},

	/**
	 * essential processes of sliding from right to left.
	 *
	 * @nextSlideIdx: index of the next slider view ( SceneViews ) 
	 *                that would be slided in.
	 */
	_slideLeft: function( nextSlideIdx ) {
		var self = this;
		var $thumbnails = self.$(".slideThumbnail");

		if ( 'undefined' === typeof nextSlideIdx ) {
			if ( self.curSubViewIndex > 0 ) {
				nextSlideIdx = self.curSubViewIndex - 1
			} else {
				nextSlideIdx = 0;
			}
		} else {
			if ( nextSlideIdx < 0 
				|| nextSlideIdx > self.subViews.length
				|| nextSlideIdx >= self.curSubViewIndex ) {

				return false;
			}
		}

		self.curSubViewIndex = nextSlideIdx;

		// switch thumbnails.		
		$thumbnails
		.eq(self.curSubViewIndex)
		.attr("src", "images/sliders/thumbnails/" + self.curSubViewIndex + "/active.png");

		// animate '<-' and '->' buttons.
		if ( 0 === self.curSubViewIndex ) {
			self.$(".slideLeft").stop().fadeOut(50);
		}

		if ( self.curSubViewIndex !== ( self.subViews.length - 1 ) ) {
			if ( "none" === self.$(".slideRight").css("display") ) {
				self.$(".slideRight").stop().fadeIn('fast');
			}
		}

		// slide the next slider in.
		if ( app.isiPad ) {
			// XXX: 'easeInQuart' animations couldn't be rendered properly on iPad safari.
			self.$(".slide").eq(self.curSubViewIndex)
			.css('left', '-100%')
			.animate({
				left: 0
			}, 620, function() {
		        /* notify the next slider view ( SceneViews ) that the slide 
		         * transition has been completed, go on with your jobs.
		         */
				app.vent.trigger("view:slide:left:end", self.curSubViewIndex);
			});
		} else {
			self.$(".slide").eq(self.curSubViewIndex)
			.css('left', '-100%')
			.animate({
				left: 0
			}, 650, 'easeInQuart', function() {
		        /* notify the next slider view ( SceneViews ) that the slide 
		         * transition has been completed, go on with your jobs.
		         */
				app.vent.trigger("view:slide:left:end", self.curSubViewIndex);
			});
		}
	},


	/**
	 * slide from right to left.
	 *
	 * @nextSlideIdx: index of the next slider view ( SceneViews ) 
	 *                that would be slided in.
	 */
	slideLeft: function( nextSlideIdx ) {
		var self = this;
		var $thumbnails = self.$(".slideThumbnail");

		/* notify the current slider view ( SceneViews ) to prepare its 
         * sliding through the pub/sub system. the correspond sub 
         * view who subscribes this messeage would take care of its 
         * animations itself.
         */
		app.vent.trigger("view:slide:left:start", self.curSubViewIndex);

		// switch thumbnails.		
		$thumbnails
		.eq(self.curSubViewIndex)
		.attr("src", "images/sliders/thumbnails/" + self.curSubViewIndex + "/inactive.png");

		// slide the current slider away.
		if ( app.isiPad ) {
			// XXX: 'easeInQuart' animations couldn't be rendered properly on iPad safari.
			self.$(".slide").eq(self.curSubViewIndex)
			.animate({
				left: "100%"
			}, 620);
		} else {
			self.$(".slide").eq(self.curSubViewIndex)
			.animate({
				left: "100%"
			}, 720, 'easeInQuart');
		}			

        /* slide the next slider view ( SceneViews ) in after the sub 
         * elements of previous slider view being moving away in 
         * 'slideAwayElementsDuration' milliseconds.
         */
		self.slideAwayTimeOut = setTimeout(function () {

			self._slideLeft( nextSlideIdx );
			clearTimeout( self.slideAwayTimeOut );

		}, self.subViews[self.curSubViewIndex].slideAwayElementsDuration);

	},

	/**
	 * essential processes of sliding from left to right.
	 *
	 * @nextSlideIdx: index of the next slider view ( SceneViews ) 
	 *                that would be slided in.
	 */
	_slideRight: function( nextSlideIdx ) {
		var self = this;
		var $thumbnails = self.$(".slideThumbnail");

		if ( 'undefined' === typeof nextSlideIdx ) {
			if ( self.curSubViewIndex < self.subViews.length - 1 ) {
				nextSlideIdx = self.curSubViewIndex + 1
			} else {
				nextSlideIdx = self.subViews.length - 1;
			}
		} else {
			if ( nextSlideIdx < 0 
				|| nextSlideIdx > self.subViews.length
				|| nextSlideIdx <= self.curSubViewIndex ) {

				return false;
			}
		}

		self.curSubViewIndex = nextSlideIdx;

		// switch thumbnails.		
		$thumbnails
		.eq(self.curSubViewIndex)
		.attr("src", "images/sliders/thumbnails/" + self.curSubViewIndex + "/active.png");

		// animate '<-' and '->' buttons.
		if ( 0 !== self.curSubViewIndex ) {
			if ( "none" === self.$(".slideLeft").css("display") ) {
				self.$(".slideLeft").stop().fadeIn('fast');
			}
		}

		if ( self.curSubViewIndex === ( self.subViews.length - 1 ) ) {
			self.$(".slideRight").stop().fadeOut(50);
		}

		// slide the next slider in.
		if ( app.isiPad ) {
			// XXX: 'easeInQuart' animations couldn't be rendered properly on iPad safari.
			self.$(".slide").eq(self.curSubViewIndex)
			.css('left', '100%')
			.animate({
				left: 0
			}, 620, function() {
		        /* notify the next slider view ( SceneViews ) that the slide 
		         * transition has been completed, go on with your jobs.
		         */
				app.vent.trigger("view:slide:right:end", self.curSubViewIndex);
			});
		} else {
			self.$(".slide").eq(self.curSubViewIndex)
			.css('left', '100%')
			.animate({
				left: 0
			}, 650, 'easeInQuart', function() {
		        /* notify the next slider view ( SceneViews ) that the slide 
		         * transition has been completed, go on with your jobs.
		         */
				app.vent.trigger("view:slide:right:end", self.curSubViewIndex);
			});
		}
	},

	/**
	 * slide from left to right.
	 *
	 * @nextSlideIdx: index of the next slider view ( SceneViews )
	 *				  that would be slided in.
	 */
	slideRight: function( nextSlideIdx ) {
		var self = this;
		var $thumbnails = self.$(".slideThumbnail");

		/* notify the current slider view ( SceneViews ) to prepare its 
         * sliding through the pub/sub system. the correspond sub 
         * view who subscribes this messeage would take care of its 
         * animations itself.
         */
		app.vent.trigger("view:slide:right:start", self.curSubViewIndex);

		// switch thumbnails.		
		$thumbnails
		.eq(self.curSubViewIndex)
		.attr("src", "images/sliders/thumbnails/" + self.curSubViewIndex + "/inactive.png");

		// slide the current slider away.
		if ( app.isiPad ) {
			// XXX: 'easeInQuart' animations couldn't be rendered properly on iPad safari.
			self.$(".slide").eq(self.curSubViewIndex)
			.animate({
				left: "-100%"
			}, 620);
		} else {
			self.$(".slide").eq(self.curSubViewIndex)
			.animate({
				left: "-100%"
			}, 720, 'easeInQuart');
		}			

        /* slide the next slider view ( SceneViews ) in after the sub 
         * elements of previous slider view being moving away in 
         * 'slideAwayElementsDuration' milliseconds.
         */
		self.slideAwayTimeOut = setTimeout(function () {

			self._slideRight( nextSlideIdx );
			clearTimeout( self.slideAwayTimeOut );

		}, self.subViews[self.curSubViewIndex].slideAwayElementsDuration);

	},

	/**
	 * "<-" button click/tap event handler. 
	 */
	slideToLeftHandler: function() {
		var self = this;

		/* dereference the click/tap event handler of "<-", "->" buttons 
		 * and slider thumbnails firstly.
		 * this is for preventing unormal quick swiching between slides.
		 */
	    self.undelegateEvents();
		self.slideLeft();

		// restore the click/tap responses of slider thumbnails when sliding being completed.
		app.vent.on('view:slide:left:end', function() {
			self.delegateEvents();
		});
	},

	/**
	 * "->" button click/tap event handler.
	 */
	slideToRightHandler: function() {
		var self = this;

		/* dereference the click/tap event handler of "<-", "->" buttons 
		 * and slider thumbnails firstly.
		 * this is for preventing unormal quick swiching between slides.
		 */
	    self.undelegateEvents();
		self.slideRight();

		// restore the click/tap responses of slider thumbnails when sliding being completed.
		app.vent.on('view:slide:right:end', function() {
			self.delegateEvents();
		});
	},

	/** 
	 * thumbnails click/tap event handler.
	 */
	slideTo: function( e ) {
		var self = this;
		var nextSlideIdx = self.$(".slideThumbnail").index(e.currentTarget);

		if ( nextSlideIdx >= self.subViews.length || nextSlideIdx < 0 ) return false;

		/* dereference the click/tap event handler of "<-", "->" buttons 
		 * and slider thumbnails firstly.
		 * this is for preventing unormal quick swiching between slides.
		 */
		if ( 0 !== nextSlideIdx - self.curSubViewIndex ) self.undelegateEvents();

		if ( nextSlideIdx - self.curSubViewIndex > 0 ) {
			self.slideRight( nextSlideIdx );
		} else if ( nextSlideIdx - self.curSubViewIndex < 0 ) {
			self.slideLeft( nextSlideIdx );
		}

		// restore the click/tap responses of slider thumbnails when sliding being completed.
		app.vent.on('view:slide:left:end', function() {
			self.delegateEvents();
		});

		// restore the clicking response of slider thumbnails as sliding being completed.
		app.vent.on('view:slide:right:end', function() {
			self.delegateEvents();
		});
	},

	swipeLeftHandler: function( e ) {
		var self = this;

		if ( self.curSubViewIndex >= (self.subViews.length - 1) ) return false;

		if ( "mouse" !== e.gesture.pointerType ) {
		 	self.slideToRightHandler();
		}
	},

	swipeRightHandler: function( e ) {
		var self = this;

		if ( self.curSubViewIndex <= 0 ) return false;

		if ( "mouse" !== e.gesture.pointerType ) {
		 	self.slideToLeftHandler();
		}
	}
	
});