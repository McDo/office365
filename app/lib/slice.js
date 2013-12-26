
module.exports = function ( val, max ) {
	if (val > 0 && val > max) {
	    return Math.min(val, max);
  	}
  	if (val < 0 && val < max) {
    	return Math.max(val, -max);
  	}
  	return val;
};