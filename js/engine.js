// So this builds the canvas??? -- We will have a frame portion and within that frame a view portion.
// I assume the view portion will be the game the frame is where we'll have that other intel.

var canvas;
var content;
var input;

(function() {
	canvas = (function () {
		var c = {};
	
		var frame = document.getElementsByTagName("canvas")[0];
		var _fctx = frame.getContext("2d");

		var view = document.createElement("canvas");
		var ctx = view.getContext("2d");

		var _fw; // frame width
		var _fh; // frame height
		var _vw; // view width
		var _vh; // view height
		var _scale = 1;

		c.frame = frame;
		c.view = view;
		c.ctx = ctx;

		// flip the frame?
		c.flip = function() {
			_fctx.clearRect(0, 0, _fw, _fh);
			_fctx.drawImage(this.view, 0, 0, _fw, _fh);

			// why we clearing this out? Will find out soon enough...
			this.ctx.clearRect(0, 0, _vw, _vh);
		}

		Object.defineProperty(c, "width", {
			set: function(w) {
				this.view.width = w;
				this.scale = _scale;

			},
			get: function() {
				// return this.view.width
				return _vw;

			}
		});
		Object.defineProperty(c, "height", {
			set: function(h) {
				this.view.height = h;
				this.scale = _scale;
			},
			get: function() {
				// return this.view.height
				return _vh;
			}
		});
		Object.defineProperty(c, "scale", {
			set: function(s) {
				_scale = s;
				_vw = this.view.width;
				_vh = this.view.height;
				_fw = this.frame.width = _vw * s;
				_fh = this.frame.height = _vh * s;

				// for picture perfect scaling??? Lookup might be in order.
				_fctx["imageSmoothingEnabled"] = false;
				// this is a polyfill for different browsers...prolly unecessary but hey
				["o", "ms", "moz", "webkit"].forEach(function (v) {
					_fctx[v + "ImageSmoothingEnabled"] = false;
				});
			},
			get: function() {
				// return this.scale;
				return _scale;

			}
		});

		c.scale = _scale;
		return c;

	})();

	content = (function() {
		var c = {};

		var _files = {};
		var _fileCount = 0;
		var _loadCount = 0;

		c.get = function(name) {
			return _files[name];
		}

		c.progress = function() {
			return _loadCount/_fileCount;
		}

		c.load = function(name, src) {
			src = src || name;

			_fileCount++;

			switch(src.split(".").pop()) { //look at file extension 
				case "png":
				case "jpg":
				case "gif":
					var img = new Image();
					img.onload = function() {
						_loadCount++;
					}
					img.src = src;
					_files[name] = img;
					break;

				case "ogg":
				case "mp3":
				case "wav":
					break;

				case "json":
				case "tmx":
					break;
			}

		}

		return c;

	})();

	input = (function() {
		var i = {};
		var _bindings = {};
		var _pressed = {};
		var _down = {};
		var _released = [];

		var mouse = {
			x: 0,
			y: 0
		};

		var Buttons = {
			LEFT: -1,
			MIDDLE: -2,
			RIGHT: -3
		};

		var Keys = {
			ENTER : 13,
			SPACE: 32,
			LEFT_ARROW: 37,
			UP_ARROW: 38,
			RIGHT_ARROW: 39,
			DOWN_ARROW: 40,

		};

		// loop through all A-Z keys on the keyboard. Add those values onto the Keys object.
		for (var ch = 65; ch <= 90; ch++) {
			Keys[String.fromCharCode(ch)] = ch;
		}

		i.Buttons = Buttons;
		i.Keys = Keys;
		i.mouse = mouse;

		i.bindKey = function(action, keys) {
			if (typeof keys === "number") {
				_bindings[keys] = action;
			} else { // maybe no else? I think there should be continue on at the moment.
				for (var i = 0; i < keys.length; i++) {
					_bindings[keys[i]] = action;
				}
			}
		}

		function _getCode(e) {
			var t = e.type;
			if (t == "keydown" || t == "keyup") {
				return e.keyCode;
			} else if (t == "mousedown" || t == "mouseup") {
				switch(e.button) {
					case 0:
						return Buttons.LEFT;
					case 1:
						return Buttons.MIDDLE;
					case 2:
						return Buttons.RIGHT;
				}
			}
		}

		function onDown(e) {
			var action = _bindings[_getCode(e)];
			if (!action) {
				return;
			}


			// similar to the pause issue am I right? Let's not keep on updating on a downpress. Updating to quickly.
			_pressed[action] = !_down[action];
			_down[action] = true;
			e.preventDefault();
		}

		function onUp(e) {
			var action = _bindings[_getCode(e)];
			if (!action) {
				return;
			}

			_released.push(action);
			e.preventDefault();
		}

		function onContext(e) {
			if (_bindings[Buttons.RIGHT]) {
				e.preventDefault();
			}
		}

		function onMove(e) {
			var el = e.target
			var x0 = 0;
			var y0 = 0;

			do {
				x0 += el.offsetLeft;
				y0 += e.offsetTop;

			} while (el = el.parentOffset)

			mouse.x = e.clientX - x0;
			mouse.y = e.clientY - y0;

			e.preventDefault();
		}

		i.clearPressed = function() {
			for (var i = 0; i < _released.length; i++) {
				_down[_released[i]] = false;
			}
			_pressed = {};
			_released = [];
		}

		i.pressed = function(action) {
			return _pressed[action];
		}

		i.down = function(action) {
			return _down[action];
		}

		i.released = function(action) {
			return _released.indexOf(action) >= 0;
		}

		canvas.frame.onmousedown = onDown;
		canvas.frame.onmouseup = onUp;
		canvas.frame.onmousemove = onMove;
		canvas.frame.oncontextmenu = onContext;

		document.onkeydown = onDown;
		document.onkeyup = onUp;
		document.onmouseup = onUp;




		return i;

	})();

})();