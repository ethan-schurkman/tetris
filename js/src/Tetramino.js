define(function() {

	var ShapeDef = {
		L: "OO1" +
		   "111" +
		   "000",

		I: "0100" +
		   "0100" +
		   "0100" +
		   "0100",

		T: "010" +
		   "111" +
		   "000",

		S: "011" +
		   "110" +
		   "000",

		Z: "110" +
		   "011" +
		   "000",

		O: "011" +
		   "011" +
		   "000",

		J: "111" +
		   "001" +
		   "000"
	}



	var Tetramino = Class.extend({

		init : function(id, x, y) {
			this._shapes = [];
			this.rotation = 0; 
			this.ID = id.toUpperCase();

			this.x = x || 0;
			this.y = y || 0;

			var shape = ShapeDef[this.ID];

			var s = [];
			var n = Math.sqrt(shape.length); //length of one side of the shape? Takes square root of pieces.

			// we are taking the bit values in the shape definition. And we're building them up into a 2-d array. Repping the piece in square form.
			for (var i = 0; i < n; i++) {
				s[i] = [];
				for (var j = 0; j < n; j++) {
					s[i][j] = parseInt(shape.charAt(i*n + j)); //my own charat implementation. Easier for me to get.
				}
			}

			this._shapes.push(s);
			

			// from what I can tell we are getting the representation of the shape's rotations and then pushing it onto this s array.
			// so the array will contain the first shape and it's possible rotations.
			var r = 3;
			var t;
			while (this.ID !== "O" && r-- !== 0) {
				t = [];
				for (var i = 0; i< n; i++) {
					t[i] = [];
					for (var j = 0; j < n; j++) {
						t[i][j] = s[n - j - 1][i]; 
					}
				}
				s = t.slice(0);
				this._shapes.push(s);
			}
		},

		setTo: function(control, id) { // set the tetris shapes to their proper block
			id = id != null ? id : this.ID;
			var shape = this._shapes[this.rotation];

			for (var i = 0; i < shape.length; i++) { // why is shape.length a thing...isn't this a 2-D array? I know it's a square but color me skeptical.
				for (var j = 0; j < shape.length; j++) {
					if (shape[j][i]) { //really thought it should conventionally be the i, j. LOOK OVER THOUGHT MY SOLUTION was right! But then set-type had errors
						control[this.x+i][this.y+j].setType(id);
					}
				}
			}


		},

		check: function(control, dx, dy, dr) {
			dx = dx || 0;
			dy = dy || 0;
			dr = dr ? this.getRotation(dr) : this.rotation; 

			var x = this.x + dx;
			var y = this.y + dy;
			var w = control.length;
			var h = control[0].length;
			var shape = this._shapes[dr];

			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < shape.length; j++) {
					if (shape[j][i]) {		
						if (!(0 <= x+i && x+i < w && 0 <= y+j && y+j < h) ||
							control[x+i][y+j].solid) {
								return false;
						}
					}
				}
			}	
				return true;
		},

		getRotation: function(dr) {
			var r = this.rotation;
			var l = this._shapes.length;

			if (dr > 0) {
				//return 0;
				return (r + 1) % l; 
			} else {
				return r - 1 >= 0 ? r - 1 : l - 1; 
			}


		},

		toString: function() {
			var str = "";

			for (var i = 0; i < this._shapes.length; i++) {
				str += "\n";
				s = this._shapes[i];
				for (var j = 0; j < s.length; j++) {
					for (var k = 0; k < s[j].length; k++) {
						str += s[j][k] ? "#" : ".";
					}
					str += "\n";
				}
			}

			return str;
		}

	});

	for (var sd in ShapeDef) {
		Tetramino[sd] = sd;
	   //ShapeDef[sd] = ShapeDef[sd].replace(/\s+/g, "");
	}


	return Tetramino;
});