
/**
 * bouncing animation effect using paperjs and tweenjs.
 * the idea is originated from the "Jelly Navigation Menu" by Oleg Solomka, Smashingmagazine.
 * http://coding.smashingmagazine.com/2013/08/15/jelly-navigation-menu-canvas-paperjs/
 */

var SSection = require("./ssection");

/** 
 * [parameter] o: {
 *     view,
 *     $content,
 *     $section,
 *     sectionsCount,
 *	   offset[0...N] -> {x, y},
 *	   size[0...N] -> {width, height},
 *     colors[0...N]
 * }
 */
function Sections(o) {
	var i, section, _i, _ref1, _ref2;

    if ((_ref1 = this.contents) == null) {
      this.contents = [];
    }

    for (i = _i = _ref2 = o.sectionsCount - 1; _ref2 <= 0 ? _i <= 0 : _i >= 0; i = _ref2 <= 0 ? ++_i : --_i) {

      section = new SSection({
          view: o.view,
      		$content: o.$content,
      		$sections: o.$sections,

        	offset: {
        		x: o.offset[i].x,
        		y: o.offset[i].y - 5
        	}, size: {
        		width: o.size[i].width + 1,
        		height: o.size[i].height + 5
        	},

        	color: o.colors[i]
      });

      section.index = i;
      this.contents.push(section);
    }
    //XXX: should trigger some events here with app.vent
    // $(window).trigger('menu:ready');
}

Sections.prototype.update = function() {
    var i, it, _i, _len, _ref1, _results;

    _ref1 = this.contents;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      it = _ref1[i];
      _results.push(it.update());
    }
    return _results;
};

Sections.prototype.popSection = function(n) {
    var i, _i, _ref1, _results;

    TWEEN.removeAll();
    _results = [];

    for (i = _i = _ref1 = this.contents.length - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
    	  if (i > this.contents.length - n - 1) {
        	  this.contents[i].popDOWN();
      	}

      	if (this.contents.length - n - 1 === i) {
        	  this.contents[i].pop();
      	}

      	if (i < this.contents.length - n - 1) {
        	  _results.push(this.contents[i].popDOWN());
      	} else {
        	  _results.push(void 0);
      	}
    }

    return _results;
};


Sections.prototype.teardown = function() {
    var i, _i, _ref1, _results = [];

    for (i = _i = _ref1 = this.contents.length - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
    	this.contents[i].base.remove();
      	this.contents[i].notListenToStop();
      	_results.push(delete this.contents[i]);
    }

    return _results;
};


module.exports = Sections;
