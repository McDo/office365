
var Sections = require("../lib/paper/sections"),
	paperSection = require("../lib/paper/paperSection");

module.exports = Marionette.ItemView.extend({

	/**
	 * 3rd view: applying bouncing animation effect 
	 * 			 that originated from the "Jelly Navigation Menu"
	 *			 by Oleg Solomka, Smasingmagazine, 
	 *			 into the view using paperjs and tweenjs. 
	 *			 see lib/paper.
	 */
	viewId: 2,
	/* the estimated time of moving the sub 
	 * elements away before the view being 
	 * scrolled up or down. 
	 * a 'public' property used by AppController.
	 */
	scrollAwayElementsDuration: 0,

	paper: null,
	sections: null,
	canvas: null,

	/* each .tile inside the view was attached with 
	 * a paperjs rendered area that the same shape, 
	 * size, offset and color as the tile itself for 
	 * bouncing animations.
	 */
	colors: ["#88e4af", "#3598db", "#11507a", "#2dcc70", "#1bbc9b", "#16a086"],
	sectionsCount: 6,

	offset: [],
	size: [],

	// positions of each modern guys:
	modernPos: [0, 1, 2],

	modernGuysAnimationTimeIntervals: [0, 0, 0],

	/**
	 * tile is expanded or not.
	 *	normal size state : false; 
	 *	expaned state     : true; 
	 * [!]: tile5 cannot be expanded.
	 */ 
	tileExpandedStates: [false, false, false, false],

	/**
	 * tile is being hovered or not, true of false.
	 * [!]: tile5 cannot be hovered.
	 */ 
	tileHoveredStates: [false, false, false, false],

	resizeTimeOut: false,

	events: {
		"mouseleave .tile": "hideTileIntro"
	},

	initialize: function() {
		var self = this,
			children = this.$el.children();

		_.bindAll(self, 'adjustViewHeight', 'makeSections',
				 "_showTileTitle", "showTileTitle", "_showTileIntro", "showTileIntro",
				 "_hideTileIntro", "hideTileIntro", "resetTiles",
				 "showTestimonies", "cycle","_cycle", "modernGuysWalkRight", "modernGuysWalkLeft",
				 "learnMore"
				 );

		self.adjustViewHeight();
		self.resetTiles();

		if ( ! isMobile ) {
			self.paper = new paper.PaperScope();
			self.canvas = document.getElementById('familyCanvas');
			self.paper.setup(self.canvas); 
			paper = self.paper;		

			if ( self.sectionsCount !== children.length ) {
				self.sectionsCount = children.length;
			}

			self.makeSections();

			self.paper.view.onFrame = function(e) {
				/* update paper sections only if FamilyView
				 * get scrolled in view for better performence.
				 */
				if ( self.viewId === app.currentView ) {
					return self.sections.update();
				}
				return false;
			};
		}

		/* regenerate paper sections only after user stop resizing 
		 * the window for better performence.
		 * the idea ported from Pim Jager, 
		 * anwser of "javascript resize event firing multiple times 
		 * while dragging the resize handle", Stackoverflow.com.
		 * url: http://stackoverflow.com/questions/667426/javascript-resize-event-firing-multiple-times-while-dragging-the-resize-handle/668185#668185
		 */
		$(window).resize(function() {
			self.adjustViewHeight();
			self.resetTiles();

			if ( ( !isMobile ) && self.viewId === app.currentView ) {

				var $parent = self.$el.parent();
				paper.view.setViewSize( $parent.width(), $parent.height() );	

				children.stop().fadeOut(200);
				$(self.canvas).stop().fadeOut(200);

				if ( false !== self.resizeTimeOut ) clearTimeout( self.resizeTimeOut );
				self.resizeTimeOut = setTimeout(function() {

					children.stop().fadeIn(200);
					self.makeSections();
					$(self.canvas).stop().fadeIn(100);

				}, 400);
			}

		});

		/* subscribe broadcast event. 
		 * get notified when page start scrolling.
		 */
		app.vent.on('view:scrolling:up:start', function( index ) {
			var $parent = self.$el.parent();

			self.adjustViewHeight();
			if ( ( self.viewId - 1 ) === index ) {
				/* update paper sections as the adjacent view 
				 * is about to scrolled away.
				 */
				self.resetTiles();
				if ( ! isMobile ) {
					var _t = setTimeout(function() {
						paper.view.setViewSize( $parent.width(), $parent.height() );	
						self.makeSections();
						clearTimeout(_t);
					}, 100);
				}
			}

		});

		app.vent.on('view:scrolling:down:start', function( index ) {
			var $parent = self.$el.parent();

			self.adjustViewHeight();
			if ( ( self.viewId + 1 ) === index ) {
				/* update paper sections as the adjacent view 
				 * is about to scrolled away.
				 */
				self.resetTiles();
				if ( ! isMobile ) {
					var _t = setTimeout(function() {
						paper.view.setViewSize( $parent.width(), $parent.height() );	
						self.makeSections();
						clearTimeout(_t);
					}, 100);
				}
			}
		});

        self.$el.hammer().on('touch', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.gesture.stopPropagation();
            e.gesture.preventDefault();
        });

		self.$(".tile").hammer().on('tap', self.showTileIntro);
		self.$(".tile").bind('mousestop', self.showTileTitle);

		if ( isMobile ) {
			self.$el.find(".learnMore").hammer().on('tap', self.learnMore);
		}

		self.$(".modern").on("tap", self.showTestimonies);
		self.cycle();

	}, 

	adjustViewHeight: function() {
		var self = this;
		var $parent = self.$el.parent();
		var	$grandpa = $parent.parent();

		/* 1. adjust the height of parent to be the actual height of window.
		 * 2. this.$el.height == this.parent.$el.height(window.height) - nav.height.
		 */ 
		$grandpa.height( app.windowHeight() );
		$parent.height( $grandpa.height() - $("#nav").height() );
		self.$el.height($parent.height());
	},

	/**
	 * generate the paper.js rendered sections that
	 * the same shape, size, offset and color as the
	 * tile inside the FamilyView for bouncing animations.
	 * see lib/paper for more details.
	 */
	makeSections: function() {
		var self = this;
		var	children = self.$el.children();

		for (var i = 0; i < children.length; i++) {
			self.offset[i] = {
				x: $(children[i]).position().left,
				y: $(children[i]).position().top
			};

			self.size[i] = {
				width: $(children[i]).width(),
				height: $(children[i]).height()
			}
		};

		delete self.sections;

		self.sections = new Sections({
			view: self.paper.view,
			$content: self.$el,
			$sections: children,
			sectionsCount: children.length,
			offset: self.offset,
			size: self.size,
			colors: self.colors
		});

	},

	/**
	 * the essential animations of 'showTileTitle'.
	 *
	 * @$el: the tile element being hovered.
	 */
	_showTileTitle: function( $el ) {
		var self = this;
		var $figure = $el.find(".tileFigure");
		var $title = $figure.find(".tileTitle");
		var idx = self.$(".tile").index($el); 

		if ( idx < 4 && ! self.tileHoveredStates[idx] ) {
			self.tileHoveredStates[idx] = true;

			$figure.animate({
				backgroundSize: "-=20%",
				backgroundPosition: "(center 30%)"
			}, 300, "easeOutBack");

			$title.animate({
				bottom: 0
			}, 250, "easeOutQuart");
		}

	},

	/**
	 *  show off the title of the hovered tile.
	 */
	showTileTitle: function( e ) {
		e.stopPropagation();
		e.preventDefault();
		var self = this;
		var $elem = $(e.currentTarget);

		self._showTileTitle($elem);
	},


	/**
	 * the essential animations of 'showTileIntro'.
	 *
	 * @$el: the tile element being clicked.
	 * @direct: the tile could be expanded from 'Left2Right' or 'Left2Right'
	 *			depends on its current positoin.
	 *			only 2 'directions' exist for this view.
	 * @bgColor: the background-color of the '.tileContent'.
	 */
	_showTileIntro: function( $el, direct, bgColor ) {
		var self = this;
		var $figure = $el.find(".tileFigure");
		var $content = $el.find(".tileContent"); 
		var idx = self.$(".tile").index($el);
		var figureAnimateProperties = {
			width: $el.width() * 0.96,
			height: $el.height() * 0.96
		};

		if ( ! self.tileExpandedStates[idx] ) {

			if ( "Left2Right" === direct ) {

				figureAnimateProperties.left = "+=1%";
				figureAnimateProperties.top = "+=2%";

			} else if ( "Right2Left" === direct ) {

				figureAnimateProperties.right = "+=1%";
				figureAnimateProperties.top = "+=2%";
			}

			$figure.animate(figureAnimateProperties, 100, "easeOutQuart", function() {
				$figure.css({
					"backgroundColor": bgColor
				});
				$el.css({
					"backgroundColor": "black",
					"z-index": 999
				});
				$el.animate({
					width: $el.width() * 2,
					left: 0
				}, 100, "easeOutQuart", function() {
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

		if ( idx < 4 && ! self.tileExpandedStates[idx] ) {
			self.$(".tile").hammer().off("tap");

			if ( "mouse" !== e.gesture.pointerType ) {
				// reset positions, width, height, etc. of all tiles.
				self.resetTiles();
			} else {
				self.tileExpandedStates[idx] = false;
			} 

			// show off the title of the touched tile.
			self._showTileTitle( $elem ); 

			if ( 0 === idx ) {
			// show off the intro box of 'super mario' tile.
				self._showTileIntro($elem, "Left2Right", self.colors[idx]);
			} else if ( 1 === idx ) {
				// show off the intro box of '27g cloud storage' tile.
				self._showTileIntro($elem, "Right2Left", self.colors[idx]);
			} else if ( 2 === idx ) {
				// show off the intro box of 'octopus' tile.
				self._showTileIntro($elem, "Left2Right", self.colors[idx]);
			} else if ( 3 === idx ) {
				// show off the intro box of 'noooo' tile.
				self._showTileIntro($elem, "Right2Left", self.colors[idx]);
			}
		}

	},

	/**
	 * the essential animations of 'hideTileIntro'.
	 * 
	 * @$el: the tile element being clicked.
	 * @direct: if expand the tile from 'Left2Right',
	 *			we narrow it down from 'Right2Left' here. 
	 *			only 2 'directions' exist for this view.
	 * @posLeft: the original left position of the tile.
	 */
	_hideTileIntro: function( $el, direct, posLeft ) {
		var self = this;
		var idx = self.$(".tile").index($el);
		var $parent = self.$el.parent();
		var $figure = $el.find(".tileFigure");
		var $title = $figure.find(".tileTitle");
		var $content = $el.find(".tileContent");
		var elAnimateProperties = {
			width: $el.width() / 2,
			left: posLeft
		};
		var figureCSSProperties = {
			width: "100%",
			height: "100%",
			top: 0
		};

		if ( isMobile ) {
			figureCSSProperties.backgroundColor = self.colors[idx];
		} else {
			figureCSSProperties.backgroundColor = "transparent";
		}

		if ( self.tileExpandedStates[idx] ) {
			self.tileExpandedStates[idx] = false;

			$content.hide();

			if ( "Right2Left" === direct ) {

				figureCSSProperties.left = 0;

			} else if ( "Left2Right" === direct ) {

				figureCSSProperties.right = 0;
			}

			$el.css({
				"backgroundColor": "transparent",
				"z-index": 0
			});

			$el.animate(elAnimateProperties, 100, "easeOutQuart", function() {
				$el.css({
					width: "33.33333%"
				});
				$figure.css(figureCSSProperties);
			});
		}

		if ( self.tileHoveredStates[idx] ) {
			self.tileHoveredStates[idx] = false;

			$figure.animate({
				backgroundSize: "+=20%",
				backgroundPosition: "(center center)"
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
			// hide the intro box of 'super mario' tile.
			self._hideTileIntro($elem, 'Right2Left', 0);
		} else if ( 1 === idx ) {
			// hide the intro box of '27g cloud storage' tile.
			self._hideTileIntro($elem, "Left2Right", "33.33333%");
		} else if ( 2 === idx ) {
			// hide the intro box of 'octopus' tile.
			self._hideTileIntro($elem, "Right2Left", 0);
		} else if ( 3 === idx ) {
			// hide the intro box of 'noooo' tile.
			self._hideTileIntro($elem, "Left2Right", "33.33333%");
		}
	},

	/**
	 * reset the properties of expanded tiles.
	 */
	resetTiles: function() {
		var self = this;

		if ( isMobile ) {
			self.$(".tileFigure").each(function(i) {
				$(this).css('backgroundColor', self.colors[i]);
			});
			self.$(".tile5").css("backgroundColor", "#1bbc9b");
			self.$(".tile6").css("backgroundColor", "#16a086");
		} else {
			self.$(".tileFigure").css('backgroundColor', 'transparent');
		}

		self._hideTileIntro(self.$(".tile1"), 'Right2Left', 0);
		self._hideTileIntro(self.$(".tile2"), "Left2Right", "33.33333%");
		self._hideTileIntro(self.$(".tile3"), "Right2Left", 0);
		self._hideTileIntro(self.$(".tile4"), "Left2Right", "33.33333%");

	},

	/**
	 * if one of the people at the lower right corner was clicked/tapped,
	 * shift him/her to the middle, display his/her testinonies and move
	 * the other two to their correspond positions.
	 */
	showTestimonies: function( e ) {
		var self = this;
		var modernGuy = e.currentTarget
		var	idx = self.$(".modern").index(e.currentTarget);
		var $modern1 = self.$(".modern1"),
			$modern2 = self.$(".modern2"),
			$modern3 = self.$(".modern3");

		// stop the circular shift.
		_.each(self.modernGuysAnimationTimeIntervals, function(intervel) {
			clearInterval(intervel);
		});

		if ( 0 === self.modernPos[idx] ) {
			// the guy is sitting at left, should walk to the right.
			self.modernGuysWalkRight($modern1, 400, 570);
			self.modernGuysWalkRight($modern2, 400, 500);
			self.modernGuysWalkRight($modern3, 400, 430);

		} else if ( 2 === self.modernPos[idx] ) {
			// the guy is sitting at right, should walk to the left.
			self.modernGuysWalkLeft($modern1, 400, 570);
			self.modernGuysWalkLeft($modern2, 400, 500);
			self.modernGuysWalkLeft($modern3, 400, 430);
		}

		// restore the circular shift.
		self.cycle();

	},

	_cycle: function( $el, speed ) {
		var self = this;
		var idx = self.$(".modern").index($el);

		self.modernGuysAnimationTimeIntervals[idx] = setInterval(function() {
			self.modernGuysWalkLeft($el, 400, speed);
		}, 5000);
	}, 

	/**
	 * three people at the lower right corner show their 
	 * product using experience in a circular manner.
	 */
	cycle: function() {
		var self = this;
		var $modern1 = self.$(".modern1"),
			$modern2 = self.$(".modern2"),
			$modern3 = self.$(".modern3");

		self._cycle($modern1, 570);
		self._cycle($modern2, 500);
		self._cycle($modern3, 430);
	},

	/**
	 * shift the guy from right to left.  
	 * show off his/her testimonies if 
	 * shifted to the middle.
	 *
	 * @$el: the modern guy.
	 * @speed_t: animation speed of testimonies.
	 * @speed_m: animation speed of modern guys.
	 */
	modernGuysWalkLeft: function( $el, speed_t, speed_m ) {
		var self = this;
		var idx = self.$(".modern").index($el);
		var $testimonies = self.$(".testimonies").eq(idx);

		$el.animate({
			right: "+=35%"
		}, speed_m, "easeInOutCirc", function() {

			self.modernPos[idx] -= 1;	

			if ( 1 === self.modernPos[idx] ) {
				// show off the testimonies if the modern guy is at the middle.
				$testimonies.animate({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    "opacity": 1,
                    "left": "0"	
				}, speed_t, "easeInOutCirc");

			} else if ( 0 === self.modernPos[idx] ) {

				$testimonies.animate({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "opacity": 0,
                    "left": "-10%"	
				}, speed_t, "easeInOutCirc");

			}

			if ( -1 === self.modernPos[idx] ) {
				self.modernPos[idx] = self.modernPos.length - 1;
				$el.css("right", "-30%");
				$testimonies.animate({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "opacity": 0,
                    "left": "10%"	
                });
				$el.animate({
					right: "+=35%"
				}, 180, "easeInOutCirc");
			}
		});
	}, 	

	/**
	 * shift the guy from left to right.  
	 * show off his/her testimonies if 
	 * shifted to the middle.
	 *
	 * @$el: the modern guy.
	 * @speed_t: animation speed of testimonies.
	 * @speed_m: animation speed of modern guys.
	 */
	modernGuysWalkRight: function( $el, speed_t, speed_m ) {
		var self = this;
		var idx = self.$(".modern").index($el);
		var $testimonies = self.$(".testimonies").eq(idx);

		$el.animate({
			right: "-=35%"
		}, speed_m, "easeInOutCirc", function() {
			
			self.modernPos[idx] += 1;	

			if ( 1 === self.modernPos[idx] ) {
				// show off the testimonies if the modern guy is at the middle.
				$testimonies.animate({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    "opacity": 1,
                    "left": "0"	
				}, speed_t, "easeInOutCirc");

			} else if ( self.modernPos.length - 1 === self.modernPos[idx] ) {

				$testimonies.animate({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "opacity": 0,
                    "left": "10%"	
				}, speed_t, "easeInOutCirc");

			}

			if ( 3 === self.modernPos[idx] ) {
				self.modernPos[idx] = 0;
				$el.css("right", "110%");
				$testimonies.css({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    "opacity": 0,
                    "left": "-10%"	
				});
				$el.animate({
					right: "-=35%"
				}, 180, "easeInOutCirc");
			}
		});
	},

	learnMore: function( e ) {
		window.open("http://office.microsoft.com/zh-cn/products/FX102853961.aspx?WT.mc_id=Soc_WeiBo_Q1Jul_ConsTry_NA#SeeTopFeatures", "_blank");
	}

});