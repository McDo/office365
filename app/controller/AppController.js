
/**
 * Global App Controller
 *      app initializator, 
 *      conduct transitions between views, 
 *      manipulate app routes.
 */

// Helpers
require("../lib/paper/init");
var paperSection = require("../lib/paper/paperSection");

// Navigation View
var NavView = require("../views/NavView");

// Main Views
var SliderView = require("../views/SliderView"),
    ActivitiesView = require("../views/ActivitiesView"),
    FamilyView = require("../views/FamilyView"),
    ToolsView = require("../views/ToolsView"),
    ShareView = require("../views/ShareView");

// SubViews of SliderView
var SceneView0 = require("../views/SceneViews/View0"),
    SceneView1 = require("../views/SceneViews/View1"),
    SceneView2 = require("../views/SceneViews/View2"),
    SceneView3 = require("../views/SceneViews/View3"),
    SceneView4 = require("../views/SceneViews/View4");

// Controller
module.exports = Marionette.Controller.extend({

	initialize: function() {
        var self = this;

        // the navigation bar view.
		app.navView = null;

        // all main views except for the navigation view.
		app.allViews = [];

        // current view index.
		app.currentView = 0;

        /* set of flags indicate whether a view is using paperjs, 
         * easeljs, etc. for animations and set an 'animation speed'  
         * for that paperjs rendered view if so. See /lib/paper for
         * more details.
         */
		app.allViewsWithPaper = [];

        // whether the full-screen page transition being completed or not.
		app.pageScrollingCompleted = true;

        /* each view (except for the navigation view) would have its 
         * children elements moved away in 'scrollAwayElementsDuration' 
         * milliseconds before scrolled up/down. And app.scrollAwayTimeOut
         * is the setTimeout function that ensuring these 2 kind of animations 
         * being animated in proper order.
         */
		app.scrollAwayTimeOut = null;

        app.isiPad = ( -1 !== navigator.userAgent.toLowerCase().indexOf('ipad') ) ? true : false;

        app.windowHeight = function() {
            if ( 'number' === typeof( window.innerWidth ) || 'number' === typeof( window.outerWidth ) ) {
                // Non-IE
                if ( navigator.userAgent.match(/(iPad);.*CPU.*OS 7_\d.*Safari/i) 
                    && (! navigator.userAgent.match(/crios/i) )
                    && ( (90 === window.orientation) || (-90 === window.orientation) ) ) {
                    /* this is for fixing iOS 7 iPad Safari Landscape innerHeight/outerHeight layout issue.
                     * http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
                     */
                    return 692;
                }  else {
                    return window.innerHeight;
                }
            } else if ( document.documentElement && document.documentElement.clientHeight ) {
                // IE 6+ in 'standards compliant mode'
                return document.documentElement.clientHeight;
            } else if ( document.body && document.body.clientHeight ) {
                // IE 4 compatible
                return document.body.clientHeight;
            }
        };
        self.$hammer = $(window).hammer({
            drag_block_vertical: true,
            swipe_velocity: 0.3
        });

        _.bindAll(self, "swipeUpHandler", "swipeDownHandler");

        /**
         * shipping the app. 
         * 1. init all Backbone views. 
         * 2. full-page transition with touch swiping or mouse scrolling.
         *    transit to different views using Backbone Routers when swiping
         *    or scrolling up and down. see routes/router.js.
         * 3. trigger the 'stopScroll' event which would make paper.js rendered
         *    views to be animated. see lib/paper/paperSection.js.
         */
        $(document).ready( function() {

            app.navView = new NavView({
                el: $("#nav")
            });

            app.allViews = [
                new SliderView({
                    el: $("#slider"),

                    // initialize subviews for SliderView
                    subViews: [
                        new SceneView0({
                            el: $(".slide1")
                        }),
                        new SceneView1({
                            el: $(".slide2")
                        }),
                        new SceneView2({
                            el: $(".slide3")
                        }),
                        new SceneView3({
                            el: $(".slide4")
                        }),
                        new SceneView4({
                            el: $(".slide5")
                        })
                    ]
                }),

                new ActivitiesView({
                    el: $("#activities")
                }),

                new FamilyView({
                    el: $("#family")
                }),

                new ToolsView({
                    el: $("#tools")
                }),

                new ShareView({
                    el: $("#share")
                })
            ];

            $(".container").each( function ( i ) {
                if ( $(this).hasClass('paper') ) {
                    app.allViewsWithPaper[i] = true;
                } else {
                    app.allViewsWithPaper[i] = false;
                }
            });

            // reset page position to the top most.
            $("#wrapper").css('top', 0);
            $(window).scrollTo(0, 1);

            self.$hammer
            .on('swipeup', self.swipeUpHandler )
            .on('swipedown', self.swipeDownHandler );

            $(window).mousewheel( function( event, delta ) {

                event.stopPropagation();
                event.preventDefault();

                /* restore the full-page scrolling when it is completed.
                 * it is for preventing fast mouse scrolling.
                 */
                if ( 0 !== delta 
                     && true === app.pageScrollingCompleted 
                     /* && 0 === paperSection.scrollSpeed */ ) {

                    app.pageScrollingCompleted = false;

                    if ( delta < 0 ) {

                        // scroll from top to bottom.
                        if ( app.currentView < app.allViews.length - 1 ) {
                            Backbone.history.navigate("!/feature/" + (app.currentView + 1), {
                                trigger: true
                            });
                        } else {
                            // restore the page scrolling.
                            app.pageScrollingCompleted = true;
                        }

                    } else if ( delta > 0 ) {

                        // scroll from bottom to top.
                        if ( app.currentView > 0 ) {
                            Backbone.history.navigate("!/feature/" + (app.currentView - 1), {
                                trigger: true
                            });
                        } else {
                            // restore the page scrolling.
                            app.pageScrollingCompleted = true;
                        }

                    }
                }

                return false;
            });

            /* trigger the 'stopScroll' event which would make 
             * paper.js rendered views ( the FamilyView actually ) to be animated. 
             * see lib/paper/paperSection.js.
             */
            $(window).on("ViewScrollComplete", function() {
                clearTimeout(paperSection.timeOut);
                paperSection.timeOut = setTimeout(function() {
                    $(window).trigger('stopScroll');
                }, 50);

                return false;
            });
                
        });
	},

    swipeUpHandler: function( e ) {
        var self = this;

        if ( "mouse" !== e.gesture.pointerType 
            && true === app.pageScrollingCompleted ) {

            if ( app.currentView < app.allViews.length - 1 ) {
                app.pageScrollingCompleted = false;

                Backbone.history.navigate("!/feature/" + (app.currentView + 1), {
                    trigger: true
                });

            }
        }
    },

    swipeDownHandler: function( e ) {
        var self = this;

        if ( "mouse" !== e.gesture.pointerType 
            && true === app.pageScrollingCompleted ) {

            if ( app.currentView > 0 ) {
                app.pageScrollingCompleted = false;

                Backbone.history.navigate("!/feature/" + (app.currentView - 1), {
                    trigger: true
                });

            }
        }
    },

    /**
     * the essential processes of upward full-page transition.
     *
     * @pages: the number of pages that would be scrolled.
     */
	_scrollViewUp: function( pages ) {

        // scrolling 'pages' number of pages...
        $("#wrapper").animate({
            'top': '-=' + (100 * pages) + '%'
        }, 350, 'easeInQuart', function() {

            // the next view has been scrolled in.
            app.currentView ++;

            /* notify the next view to prepare its full-screen transition
             * through the pub/sub system. the correspond view who subscribes
             * this messeage would take care of its animations itself.
             */
            app.vent.trigger('view:scrolling:up:completed', app.currentView); 

            /* update paper sections only as the paper.js rendered view get 
             * scrolled in since tweenjs updating takes huge pieces of cpu resources. 
             */
            if ( app.allViewsWithPaper[app.currentView] ) $(window).trigger("ViewScrollComplete");

            /* XXX: ugly timeout for preventing inertia scrolling on mac trackpad 
             * and some of the magic rats. any better solution ? 
             */
            var _t = setTimeout(function() {

                app.pageScrollingCompleted = true;
                clearTimeout( _t );

            }, 1000);
        });
    },

    /**
     * the upward full-page transition.
     *
     * @pages: the number of pages that would be scrolled.
     */
    scrollViewUp: function( pages ) {

        pages = ( typeof pages !== 'undefined' ) ? pages : 1;

        var self = this,
            _dur = app.allViews[app.currentView].scrollAwayElementsDuration;

        if ( app.currentView < app.allViews.length - 1 ) {

            // adjust scrollSpeed of paperSection.
            if ( app.allViewsWithPaper[app.currentView + 1] ) {
                paperSection.scrollSpeed = 60;
            } else {
                paperSection.scrollSpeed = 0;
            }

            /* notify the current view to prepare its full-screen transition
             * through the pub/sub system. the correspond view who subscribes
             * this messeage would take care of its animations itself.
             */
            app.vent.trigger("view:scrolling:up:start", app.currentView);

            /* scroll the next view in after the sub elements of 
             * previous view being moved away in 'scrollAwayElementsDuration'
             * milliseconds.
             */
            app.scrollAwayTimeOut = setTimeout( function() {
                self._scrollViewUp( pages );
                clearTimeout( app.scrollAwayTimeOut );
            }, _dur);

        } else {
            app.pageScrollingCompleted = true;
        }
    },

    /**
     * the essential processes of downward full-page transition.
     *
     * @pages: the number of pages that would be scrolled down.
     */
    _scrollViewDown: function( pages ) {

        // scrolling 'pages' number of pages...
        $("#wrapper").animate({
            'top': '+=' + (100 * pages) + '%'
        }, 350, 'easeInQuart', function() {

            // view has been scrolled to the previous section.
            app.currentView --;

            /* notify the next view to prepare its full-screen transition
             * through the pub/sub system. the correspond view who subscribes
             * this messeage would take care of its animations.
             */
            app.vent.trigger('view:scrolling:down:completed', app.currentView); 

            /* update paper sections only as the paper.js rendered view get 
             * scrolled in since tweenjs updating takes huge pieces of cpu resources. 
             */
            if ( app.allViewsWithPaper[app.currentView] ) $(window).trigger("ViewScrollComplete");

            /* XXX: ugly timeout for preventing inertia scrolling on mac trackpad 
             * and some of the magic rats. any better solution? 
             */
            var _t = setTimeout(function() {

                app.pageScrollingCompleted = true;
                clearTimeout( _t );

            }, 1000);
        });
    }, 

    /**
     * the downward full-page transition.
     *
     * @pages: the number of pages that would be scrolled.
     */
    scrollViewDown: function( pages ) {

        pages = ( typeof pages !== 'undefined' ) ? pages : 1;

        var self = this,
            _dur = app.allViews[app.currentView].scrollAwayElementsDuration;

        if ( app.currentView > 0 ) {

            // adjust scrollspeed of paperSection.
            if ( app.allViewsWithPaper[app.currentView - 1] ) {
                paperSection.scrollSpeed = -60;
            } else {
                paperSection.scrollSpeed = 0;
            } 

            /* notify the current view to prepare its full-screen transition
             * through the pub/sub system. the correspond view who subscribes
             * this messeage would take care of its animations.
             */
            app.vent.trigger("view:scrolling:down:start", app.currentView);

            /* scroll the next view in after the sub elements of 
             * previous view being moved away in 'scrollAwayElementsDuration'
             * milliseconds.
             */
            app.scrollAwayTimeOut = setTimeout(function() {
                self._scrollViewDown(pages);
                clearTimeout(app.scrollAwayTimeOut);
            }, _dur);

        } else {
            app.pageScrollingCompleted = true;
        }
    },

    /** 
     * scroll to the 'share' view.
     */
    share: function() {
        var self = this;
        self.scrollTo(4);
    },

    /**
     * scroll to a specific view.
     *
     * @id: the view id.
     */
    scrollTo: function( id ) {
        var self = this,
            idRestrictPattern = /^[0-4]$/g,
            pages = 0;

        if ( idRestrictPattern.test( id ) ) {

        	$(document).ready( function() {

            	id = parseInt(id);
                pages = id - app.currentView;
                app.pageScrollingCompleted = false;

                if ( 0 === id ) {
                	// change the app route to default silently.
	                Backbone.history.navigate("", {
	                    trigger: false
	                });
                } else if ( 4 === id ) {
                    // change the app route to "/#!/share" silently.
                    Backbone.history.navigate("!/share", {
                        trigger: false
                    });
                }

                if ( pages > 0 ) {

                    // animate the navigation bar.
                	app.navView.navCurtainAnimation( app.currentView, id );
                	app.currentView = id - 1;
                    self.scrollViewUp( pages );

                } else if ( pages < 0 ) {

                    // animate the navigation bar.
            	    app.navView.navCurtainAnimation( app.currentView, id );
                	app.currentView = id + 1;
                    self.scrollViewDown( -pages );

                }
	        });

        } else {
            /* handle the missing routes:
             * reload the page. 
             */
            self.missing();
        }

    },

    /**
     * handle the missing routes.
     * reload the page. 
     */
    missing: function() {
        Backbone.history.navigate("", {
            trigger: false
        });
        location.reload();
    }
});