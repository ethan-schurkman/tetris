define(function (){
	var StatManager = Class.extend({
		init: function() {
			this.reset();
		},

		reset: function(startLevel) {
			this.tetraminos = {
				L: 0,
				I: 0,
				T: 0,
				S: 0,
				Z: 0,
				O: 0,
				J: 0,

				tot: 0
			};

			this._firstLevel = false;

			this.startLevel = startLevel || 0;
			this.level = this.startLevel;

			this.lines = 0;			
			this.score = 0;
		},

		incTetramino: function(id) {
			this.tetraminos[id] += 1;
			this.tetraminos.tot += 1;
		},

		addScore: function(cleared) {
			var p = [0, 40, 100, 300, 1200][cleared];
			this.score += (this.level + 1) * p;
		},

		checkLevelUp: function() {
			if (this._firstLevel) {
				if (this.lines >= (this.level + 1) * 10) {
					this.level++;
				}
			} else {
				if (this.lines >= ((this.startLevel + 1) * 10) || 100) {
					this.firstLevel = true;
					this.level++;
				}
			}

		}

	});

	return StatManager;



});