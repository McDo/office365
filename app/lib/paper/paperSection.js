
/**
 * bouncing animation effect using paperjs and tweenjs.
 * the idea is originated from the "Jelly Navigation Menu" by Oleg Solomka, Smashingmagazine.
 * http://coding.smashingmagazine.com/2013/08/15/jelly-navigation-menu-canvas-paperjs/
 */
 
module.exports = {
	i: 0, 
  	next: 0, 
  	prev: 0, 
  	stop: false,
  	timeOut: null,
  	ff: typeof InstallTrigger !== 'undefined', 
  	win: navigator.appVersion.indexOf("Win") !== -1,
  	scrollSpeed: 0
};