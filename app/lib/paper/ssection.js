
/**
 * bouncing animation effect using paperjs and tweenjs.
 * the idea is originated from the "Jelly Navigation Menu" by Oleg Solomka, Smashingmagazine.
 * http://coding.smashingmagazine.com/2013/08/15/jelly-navigation-menu-canvas-paperjs/
 */

var paperSection = require("./paperSection"),
    slice = require("../slice");

/**
 * [parameter] o: {
 *     view,
 *     $content,
 *     $sections,
 *
 *     offset: {
 *         x,
 *         y
 *     },
 *
 *     size: {
 *         width,
 *         height
 *     },
 *
 *     color
 * }
 */
function SSection(o) {
    this.o = o;
    this.w = o.view.size.width;
    this.h = o.view.size.height;
    this.ph = 60;
    this.sh = this.procent(this.h, this.ph);
    this.wh = 1 * this.w;
    this.gapSize = this.procent(this.h, (100 - this.ph) / 2);
    this.twns = [];
    this.getPrefix();
    this.makeBase();
    this.listenToStop();
    paperSection.timeOut = 0;
}

SSection.prototype.getPrefix = function() {
    var pre, styles;

    styles = window.getComputedStyle(document.documentElement, "");
    pre = (Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) || (styles.OLink === "" && ["", "o"]))[1];
    this.prefix = "-" + pre + "-";
    return this.transformPrefix = "" + this.prefix + "transform";
};

SSection.prototype.listenToStop = function() {
    var _this = this;

    $(window).on('ViewScrollComplete', function() {
		    _this.stop = false;
	      _this.poped = false;
	      return TWEEN.removeAll();
    });

    return $(window).on('stopScroll', function() {
    	var duration;
      
      	_this.stop = true;
      	duration = slice(Math.abs(paperSection.scrollSpeed * 25), 1400) || 3000;
      	_this.translatePointY({
            point: _this.base.segments[1].handleOut,
        	  to: 0,
        	  duration: duration
      	}).then(function() {
        	  return paperSection.scrollSpeed = 0;
      	});

      	return _this.translatePointY({
        	  point: _this.base.segments[3].handleOut,
        	  to: 0,
        	  duration: duration
      	});
    });
};

/** 
 * [parameter] o: {
 *     point,
 *     to,
 *     duration,
 *	   easing,
 *     onUpdate
 * }
 */
SSection.prototype.translateLine = function(o) {
    var dfr = new $.Deferred;
    var mTW = new TWEEN.Tween(new Point(o.point)).to(new Point(o.to), o.duration);
    var _this = this, it = this;

    mTW.easing(o.easing || TWEEN.Easing.Elastic.Out);
    mTW.onUpdate(o.onUpdate || function(a) {
        var _ref1;
      	o.point.y = this.y;
      	return (_ref1 = o.point2) != null ? _ref1.y = this.y : void 0;
    });

    mTW.onComplete(function() {
      	return dfr.resolve();
    });

    mTW.start();
    return dfr.promise();
};

SSection.prototype.notListenToStop = function() {
    $(window).off('stopScroll');
    return $(window).off('ViewScrollComplete');
};


/** 
 * [parameter] o: {
 *     point,
 *	   easing
 * }
 */
SSection.prototype.translatePointY = function(o) {
    var dfr = new $.Deferred;
    var mTW = new TWEEN.Tween(new Point(o.point)).to(new Point(o.to), o.duration);
    var _this = this, it = this;

    mTW.easing(o.easing || TWEEN.Easing.Elastic.Out);
    mTW.onUpdate(o.onUpdate || function(a) {
        o.point.y = this.y;
        !it.poped && _this.o.$content.attr('style', "" + it.transformPrefix + ": translate3d(0," + (this.y / 2) + "px,0);transform: translate3d(0," + (this.y / 2) + "px,0);");
        return (it.poped && !it.popedCenter) && _this.o.$sections.eq(it.index).attr('style', "" + it.transformPrefix + ": translate3d(0," + (this.y / 2) + "px,0);transform: translate3d(0," + (this.y / 2) + "px,0);");
    });

    mTW.onComplete(function() {
      	return dfr.resolve();
    });

    mTW.start();
    return dfr.promise();
};

/** 
 * [parameter] o: {
 *     point,
 *     easing
 * }
 */
SSection.prototype.translatePointX = function(o) {
    var dfr = new $.Deferred;
    var mTW = new TWEEN.Tween(new Point(o.point)).to(new Point(o.to), o.duration);
    var _this = this, it = this;

    mTW.easing(o.easing || TWEEN.Easing.Elastic.Out);
    mTW.onUpdate(o.onUpdate || function(a) {
        o.point.x = this.x;
        return (it.poped && !it.popedCenter) && _this.o.$sections.eq(it.index).attr('style', "" + it.transformPrefix + ": translate3d("(this.x / 2), + "px,0,0);transform: translate3d("(this.x / 2), + "px,0,0);");
    });

    mTW.onComplete(function() {
        return dfr.resolve();
    });

    mTW.start();
    return dfr.promise();
};

SSection.prototype.makeBase = function() {
  var that = this;
    this.base = new Path.Rectangle(new Point(that.o.offset.x, that.o.offset.y), [that.o.size.width, that.o.size.height]);
    return this.base.fillColor = this.o.color;
};

SSection.prototype.toppie = function(amount) {
    this.base.segments[1].handleOut.y = amount;
    return this.base.segments[1].handleOut.x = this.wh / 5.5;
};

SSection.prototype.bottie = function(amount) {
    this.base.segments[3].handleOut.y = amount;
    return this.base.segments[3].handleOut.x = -this.wh / 5.5;
};

/** 
 * [parameter] o: {
 *     points,
 *     flatten,
 *     fillColor
 * }
 */
SSection.prototype.createPath = function(o) {
    var path;

    path = new Path(o.points);
    o.flatten && path.flatten(o.flatten);
    path.fillColor = o.fillColor || 'transparent';
    return path;
};


SSection.prototype.update = function() {
    if ( !this.stop && !this.poped ) {
      this.toppie(paperSection.scrollSpeed);
      this.bottie(paperSection.scrollSpeed);
      this.o.$content.attr('style', "" + this.transformPrefix + ": translate3d(0," + (paperSection.scrollSpeed / 2) + "px,0);transform: translate3d(0," + (paperSection.scrollSpeed / 2) + "px,0);");
    }
    return TWEEN.update();
};

SSection.prototype.procent = function(base, percents) {
    return (base / 100) * percents;
};

SSection.prototype.pop = function() {
    var _this = this;

    this.poped = true;
    this.popedCenter = true;

    this.translatePointY({

        point: this.base.segments[1].handleOut,
      	to: this.o.size.height / 5.75,
      	duration: 100,
      	easing: TWEEN.Easing.Linear.None

    }).then(function() {

      	_this.translatePointY({
      	    point: _this.base.segments[1].handleOut,
            to: 0,
        	  $content: _this.o.$content,
        	  $sections: _this.o.$sections
      	}).then(function() {});

      	return _this.translatePointY({
        	  point: _this.base.segments[3].handleOut,
        	  to: 0,
        	  $content: _this.o.$content,
        	  $sections: _this.o.$sections
      	});

    });

    return this.translatePointY({
      	point: this.base.segments[3].handleOut,
      	to: this.o.size.height / 5.75,
      	duration: 100,
      	easing: TWEEN.Easing.Linear.None,
      	$content: this.o.$content,
        $sections: this.o.$sections
    });

};


SSection.prototype.popUP = function() {
    var _this = this;

    this.poped = true;
    this.popedCenter = false;

    this.translatePointY({

    	point: this.base.segments[1].handleOut,
      	to: -(this.o.size.height) / 5.75,
      	duration: 100,
      	easing: TWEEN.Easing.Linear.None

    }).then(function() {

      	_this.translatePointY({
        	point: _this.base.segments[1].handleOut,
        	to: 0
      	}).then(function() {});

      	return _this.translatePointY({
        	point: _this.base.segments[3].handleOut,
        	to: 0
      	});
    });

    return this.translatePointY({
      	point: this.base.segments[3].handleOut,
      	to: -(this.o.size.height) / 5.75,
      	duration: 100,
      	easing: TWEEN.Easing.Linear.None
    });
};


SSection.prototype.popDOWN = function() {
    var _this = this;

    this.poped = true;
    this.popedCenter = false;

    this.translatePointY({

    	point: this.base.segments[1].handleOut,
      	to: this.o.size.height / 5.75,
      	duration: 100,
      	easing: TWEEN.Easing.Linear.None

    }).then(function() {

      	_this.translatePointY({
        	point: _this.base.segments[1].handleOut,
        	to: 0
      	}).then(function() {});

      	return _this.translatePointY({
        	point: _this.base.segments[3].handleOut,
        	to: 0
      	});
    });

    return this.translatePointY({
      	point: this.base.segments[3].handleOut,
      	to: this.o.size.height / 5.75,
      	duration: 100,
      	easing: TWEEN.Easing.Linear.None
    });
};


module.exports = SSection;

