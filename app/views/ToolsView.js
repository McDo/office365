
module.exports = Marionette.ItemView.extend({

	/**
	 * 4th view.
	 */
	viewId: 3,
	/* the estimated time of moving the sub 
	 * elements away before the view being 
	 * scrolled up or down. 
	 * a 'public' property used by AppController.
	 */
	scrollAwayElementsDuration: 0,

	/**
	 * tile is expanded or not.
	 *	normal size state : false; 
	 *	expanded state    : true; 
	 */ 
	tileExpandedStates: [false, false, false, false, false, false],

	/**
	 * tile is being hovered or not, true of false.
	 */ 
	tileHoveredStates: [false, false, false, false, false, false],

	events: {
		"mouseleave .tile": "hideTileIntro"
	},

	initialize: function() {
		var self = this;

		_.bindAll(self, 'adjustViewHeight', 
				'scrollElements', 'scrollAwayElements', 'scrollInElements',
				'_showTileIntro', 'showTileIntro',
				'_showTileTitle', 'showTileTitle',
				'_hideTileIntro', 'hideTileIntro', 'resetTiles',
				'learnMore'
				);

		self.adjustViewHeight();
		$(window).resize(function() {
			self.resetTiles();
			self.adjustViewHeight();
		});
		self.scrollAwayElements();
		
		/* subscribe broadcast event. 
		 * get notified when page start scrolling.
		 */
		app.vent.on('view:scrolling:up:start', function( index ) {
			self.adjustViewHeight();

			if ( ( self.viewId - 1 ) === index ) self.resetTiles(); 
			else if ( ( self.viewId ) === index ) self.scrollAwayElements();
		});

		app.vent.on('view:scrolling:down:start', function( index ) {
			self.adjustViewHeight();

			if ( ( self.viewId + 1 ) === index ) self.resetTiles(); 
			else if ( ( self.viewId ) === index ) self.scrollAwayElements();
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
        
        self.$el.hammer().on('touch', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.gesture.stopPropagation();
            e.gesture.preventDefault();
        });

        self.$(".tile").bind('mousestop', self.showTileTitle);
        self.$(".tile").hammer().on('tap', self.showTileIntro);

        if ( isMobile ) {
        	self.$el.find(".learnMore").hammer().on('tap', self.learnMore);
        }

	},

	adjustViewHeight: function() {
		var self = this;
		var $parent = self.$el.parent();

		/* 1. adjust the height of parent to be the actual height of window.
		 * 2. this.$el.height == this.parent.$el.height(window.height) - nav.height.
		 */ 
		$parent.height(app.windowHeight());
		self.$el.height( $parent.height() - $("#nav").height() );
	},

	/**
	 * animate sub elements of the current view when 
	 * it was scrolled into view or scrolled away.
	 *
	 * @bpx: object paramaters.
	 *       backgoround-position-x for all sub-tiles.
	 * @bpy: object paramaters.
	 *       backgoround-position-y for all sub-tiles.
	 * @dur: duration of backgroundPosition animations.
	 * @ease: backgroundPosition animation easing.
	 */
	scrollElements: function( bpx, bpy, dur, ease ) {
		var self = this,
			$children = this.$el.children();

		if ( bpx.length !== $children.length || bpy.length !== $children.length ) {
			console.error("there are " + $children.length + " children within <div id=\"" + this.$el.attr('id') + "\">, you haven\'t provided enough background-poistions for them:)");
			return false;
		}

		for ( var i = 0; i < $children.length; i++ ) {
			$children.eq(i).find(".tileFigure")
			.stop().animate({
				backgroundPosition: "(" + bpx[i] + " " + bpy[i] + ")"
			}, {
				duration: dur,
				easing: ease
			});	
		}
	},

	/**
	 * move sub elemnts out of the view, 
	 * when the view starts scrolled away.
	 */
	scrollAwayElements: function() {
		var bpx = ["left", "50%", "50%", "50%", "50%", "50%"],
			bpy = ["5%", "70%", "60%", "60%", "60%", "60%"],
			dur = 200,
			ease = 'easeInQuart';

		return this.scrollElements(bpx, bpy, dur, ease);
	},

	/**
	 * show up sub elemnts when the view 
	 * was scrolled into view.
	 */
	scrollInElements: function() {
		var bpx = ["left", "50%", "50%", "50%", "50%", "50%"],
			bpy = ["10%", "60%", "50%", "50%", "50%", "50%"],
			dur = 200,
			ease = 'easeOutQuart';

		return this.scrollElements(bpx, bpy, dur, ease);
	},

	/**
	 * the essential animations of 'showTileTitle'.
	 *
	 * @$el: the tile element being hovered.
	 * @bgPos: background-position of .tileContent.
	 */
	_showTileTitle: function( $el, bgPos ) {
		var self = this;
		var $figure = $el.find(".tileFigure");
		var $title = $figure.find(".tileTitle");
		var idx = self.$(".tile").index($el); 

		if ( ! self.tileHoveredStates[idx] ) {
			self.tileHoveredStates[idx] = true;

			$figure.animate({
				backgroundSize: "-=20%",
				backgroundPosition: bgPos
			}, 300, "easeOutBack");

			$title.animate({
				bottom: 0
			}, 250, "easeOutQuart");
		}

	},

	/**
	 * show off the title of the hovered tile.
	 */
	showTileTitle: function(e) {
		e.stopPropagation();
		e.preventDefault();

		var self = this;
		var $elem = $(e.currentTarget);
		var idx = self.$(".tile").index($elem);

		if ( 0 === idx ) {
			// show off the title of 'chemistry' tile.
			self._showTileTitle($elem, "(10% 10%)");
		} else if ( 1 === idx ) {
			// show off the title of 'shining' tile.
			self._showTileTitle($elem, "(center 50%)");
		} else if ( 2 === idx ) {
			// show off the title of 'judo' tile.
			self._showTileTitle($elem, "(center center)");
		} else if ( 3 === idx ) {
			// show off the title of 'form' tile.
			self._showTileTitle($elem, "(center center)");
		} else if ( 4 === idx ) {
			// show off the title of 'tablet' tile.
			self._showTileTitle($elem, "(center center)");
		} else if ( 5 === idx ) {
			// show off the title of 'lion' tile.
			self._showTileTitle($elem, "(center center)");
		}
	},

	/**
	 * the essential animations of 'showTileIntro'.
	 *
	 * @$el: the tile element being clicked/tapped.
	 * @direct: the tile could be expanded from 
	 *			'Left2Right', 'Left2Right', 'Top2Bottom' or 'Bottom2Top'
	 *			depends on its current position.
	 */
	_showTileIntro: function( $el, direct ) {
		var self = this;
		var $figure = $el.find(".tileFigure");
		var $content = $el.find(".tileContent");
		var idx = self.$(".tile").index($el);
		var elAnimateProperties = {};
		var figureAnimateProperties = {
			width: $el.width() * 0.96,
			height: $el.height() * 0.96
		};

		if ( ! self.tileExpandedStates[idx] ) {

			if ( "Left2Right" === direct ) {

				elAnimateProperties.width = $el.width() * 2;
				elAnimateProperties.left = 0;

				figureAnimateProperties.left = "+=1%";
				figureAnimateProperties.top = "+=2%";

			} else if ( "Right2Left" === direct ) {

				elAnimateProperties.width = $el.width() * 2;
				elAnimateProperties.right = 0;

				figureAnimateProperties.right = "+=1%";
				figureAnimateProperties.top = "+=2%";

			} else if ( "Top2Bottom" === direct ) {

				elAnimateProperties.height = $el.height() * 2;
				elAnimateProperties.top = 0;

				figureAnimateProperties.left = "+=2%";
				figureAnimateProperties.top = "+=1%";

			} else if ( "Bottom2Top" === direct ) {

				elAnimateProperties.height = $el.height() * 2;
				elAnimateProperties.top = 0;

				figureAnimateProperties.left = "+=2%";
				figureAnimateProperties.bottom = "+=1%";

			}

			$figure.animate(figureAnimateProperties, 100, "easeOutQuart", function() {
				$el.css({
					"z-index": 999
				});
				$el.animate(elAnimateProperties, 100, "easeOutQuart", function() {
					$content.show();
					self.tileExpandedStates[idx] = true;
					self.$(".tile").hammer().on('tap', self.showTileIntro);
				});
			});
		}
	},

	/**
	 * show off the introduction of a tile.
	 */
	showTileIntro: function( e ) {
		var self = this;
		var $elem = $(e.currentTarget);
		var idx = self.$(".tile").index($elem);

		e.stopPropagation();
		e.preventDefault();
		e.gesture.stopPropagation();
        e.gesture.preventDefault();

		if ( ! self.tileExpandedStates[idx] ) {
			self.$(".tile").hammer().off("tap");

			if ( "mouse" !== e.gesture.pointerType ) {
				// reset positions, width, height, etc. of all tiles.
				self.resetTiles();
			} else {
				self.tileExpandedStates[idx] = false;
			} 

			// show off the title of the touched tile.
			self._showTileTitle($elem); 

			if ( 0 === idx ) {
			// show off the intro box of 'chemistry' tile.
				self._showTileIntro($elem, "Left2Right");
			} else if ( 1 === idx ) {
				// show off the intro box of 'shining' tile.
				self._showTileIntro($elem, "Top2Bottom");
			} else if ( 2 === idx ) {
				// show off the intro box of 'judo' tile.
				self._showTileIntro($elem, "Right2Left");
			} else if ( 3 === idx ) {
				// show off the intro box of 'form' tile.
				self._showTileIntro($elem, "Left2Right");
			} else if ( 4 === idx ) {
				// show off the intro box of 'tablet' tile.
				self._showTileIntro($elem, "Bottom2Top");
			} else if ( 5 === idx ) {
				// show off the intro box of 'lion' tile.
				self._showTileIntro($elem, "Right2Left");
			}
		}

	},

	/**
	 * the essential animations of 'hideTileIntro'.
	 *
	 * @$el: the tile element being clicked.
	 * @direct: if expand the tile from 'Left2Right',
	 *			we narrow it down from 'Right2Left' and vice versa. 
	 *			the same as Top-Bottom directions.
	 * @bgPos: the original background-position of the tile.
	 */
	_hideTileIntro: function( $el, direct, bgPos ) {
		var self = this;
		var idx = self.$(".tile").index($el);
		var $figure = $el.find(".tileFigure");
		var $title = $figure.find(".tileTitle");
		var $content = $el.find(".tileContent");
		var elAnimateProperties = {};
		var figureCSSProperties = {
			width: "100%",
			height: "100%"
		};


		if ( self.tileExpandedStates[idx] ) {
			self.tileExpandedStates[idx] = false;

			$content.hide();

			if ( "Right2Left" === direct ) {

				elAnimateProperties.width = $el.width() / 2;
				elAnimateProperties.left = 0;

				figureCSSProperties.left = 0;
				figureCSSProperties.top = 0;

			} else if ( "Left2Right" === direct ) {

				elAnimateProperties.width = $el.width() / 2;
				elAnimateProperties.right = 0;

				figureCSSProperties.right = 0;
				figureCSSProperties.top = 0;

			} else if ( "Bottom2Top" === direct ) {

				elAnimateProperties.height = $el.height() / 2;
				elAnimateProperties.top = 0;

				figureCSSProperties.top = 0;
				figureCSSProperties.left = 0;

			} else if ( "Top2Bottom" === direct ) {

				elAnimateProperties.height = $el.height() / 2;
				elAnimateProperties.top = "49.99999%";

				figureCSSProperties.bottom = 0;
				figureCSSProperties.left = 0;

			}

			$el.css({
				"z-index": 0 
			});

			$el.animate(elAnimateProperties, 50, "easeOutQuart", function() {
				$el.css({
					width: "33.33333%",
					height: "49.99999%"
				});
				$figure.css(figureCSSProperties);
			});
		}

		if ( self.tileHoveredStates[idx] ) {
			self.tileHoveredStates[idx] = false;

			$figure.animate({
				backgroundSize: "+=20%",
				backgroundPosition: bgPos
			}, 70);

			$title.animate({
				bottom: "-30%"
			}, 100);
		}
		
	},

	/**
	 * hide the introduction of a tile.
	 */
	hideTileIntro: function( e ) {
		var self = this;
		var $elem = $(e.currentTarget);
		var idx = self.$(".tile").index($elem);

		e.stopPropagation();
		e.preventDefault();

		if ( 0 === idx ) {
			// hide the intro box of 'chemistry' tile.
			self._hideTileIntro($elem, 'Right2Left', "(0 0)");
		} else if ( 1 === idx ) {
			// hide the intro box of 'shining' tile.
			self._hideTileIntro($elem, 'Bottom2Top', "(center 60%)");
		} else if ( 2 === idx ) {
			// hide the intro box of 'judo' tile.
			self._hideTileIntro($elem, 'Left2Right', "(center center)");
		} else if ( 3 === idx ) {
			// hide the intro box of 'form' tile.
			self._hideTileIntro($elem, 'Right2Left', "(center center)");
		} else if ( 4 === idx ) {
			// hide the intro box of 'tablet' tile.
			self._hideTileIntro($elem, 'Top2Bottom', "(center center)");
		} else if ( 5 === idx ) {
			// hide the intro box of 'lion' tile.
			self._hideTileIntro($elem, 'Left2Right', "(center center)");
		}
	},

	/**
	 * reset the properties of expanded tiles.
	 */
	resetTiles: function() {
		var self = this;

		self._hideTileIntro(self.$(".tile1"), 'Right2Left', "(0 0)");
		self._hideTileIntro(self.$(".tile2"), 'Bottom2Top', "(center 60%)");
		self._hideTileIntro(self.$(".tile3"), 'Left2Right', "(center center)");
		self._hideTileIntro(self.$(".tile4"), 'Right2Left', "(center center)");
		self._hideTileIntro(self.$(".tile5"), 'Top2Bottom', "(center center)");
		self._hideTileIntro(self.$(".tile6"), 'Left2Right', "(center center)");
	},

	learnMore: function(e) {
		var self = this;
		var $elem = $(e.currentTarget);
		var idx = self.$el.find(".learnMore").index($elem);

		e.stopPropagation();
		e.preventDefault();

		if ( 0 === idx ) {
			window.open("http://office.microsoft.com/zh-cn/powerpoint-help/HA102749750.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_PPTHA_705", "_blank");
		} else if ( 1 === idx ) {
			window.open("http://office.microsoft.com/zh-cn/powerpoint-help/VA103988959.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_PPTVA_959", "_blank");
		} else if ( 2 === idx ) {
			window.open("http://office.microsoft.com/zh-cn/powerpoint-help/HA102840202.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_PPTHA_202", "_blank");
		} else if ( 3 === idx ) {
			window.open("http://office.microsoft.com/zh-cn/excel-help/HA102809330.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_XLHA_330", "_blank");
		} else if ( 4 === idx ) {
			window.open("http://office.microsoft.com/zh-cn/support/VA102834142.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_OneVA_142", "_blank");
		} else if ( 5 === idx ) {
			window.open("http://office.microsoft.com/zh-cn/powerpoint-help/HA102809628.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_PPTHA_628", "_blank");
		}
	}


});