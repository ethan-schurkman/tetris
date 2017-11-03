define(function() {

	// Polyfills
	var _vendors = ["o", "ms", "moz", "webkit"];
	for (var i = _vendors.length; i-- && !window.requestAnimationFrame; ) {
		var v = _vendors[i];

		window.requestAnimationFrame = window[v + "RequestAnimationFrame"];
		window.cancelAnimationFrame = window[v + "CancelAnimationFrame"] ||
									  window[v + "CancelRequestAnimationFrame"];
	}

	var Game = Class.extend({
		init: function() {
			console.warn("SHOULD NOT SHOW UP!!!");
		},

		stop: function() {
			if (this._reqFrame) {
				window.cancelAnimationFrame(this._reqFrame);
			}
			this._reqFram = null;
			this._running = false;

		},

		run: function() {
			if (this._running) {
				return;
			}
			this._running = true;

			var self = this;
			function loop () {
				self._reqFrame = window.requestAnimationFrame(loop);
				self.tick();
				input.clearPressed();
				canvas.flip();
			}
			this._reqFrame = window.requestAnimationFrame(loop);
		}
	});

	return Game;
});