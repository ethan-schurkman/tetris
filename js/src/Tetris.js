define(["src/GameBoard",
	    "src/StatManager",
	    "src/Tetramino",
	    "src/Block",
	    "src/Randomizer",
], function(GameBoard, StatManager, Tetramino, Block, Randomizer) {

	var Tetris = Class.extend({

		init: function(cols, rows){

			this.cols = cols;
			this.rows = rows;		

			this.gameBoard = new GameBoard();
			this.stat = new StatManager();
			this.random = new Randomizer();
			this.blockControl = [];


			this.reset();


		},

		reset: function() {

			this.frames = 0;

			// I think we are just going through the blocks on the column and making them functionable
			this.blockControl = [];
			for (var i = 0; i < this.cols; i++) {
				this.blockControl[i] = [];
				for (var j = 0; j < this.rows; j++) {
					this.blockControl[i][j] = new Block(Block.NONE);
				}
			}

			//var tet = new Tetramino(Tetramino.S);
			//tet.setTo(this.blockControl);
			this.random.initialize();
			this.setNextTetramino();


		},

		update: function(input) {

			this.currentTetramino.setTo(this.blockControl, Block.NONE);

			if (input.pressed("down")) {
				this.moveDown();
			}
			if (input.pressed("left")) {
				this.moveLeft();
			}
			if (input.pressed("right")) {
				this.moveRight();
			}
			if (input.pressed("space")) {
				this.moveRotate();
			}
			if (input.pressed("enter")) {
				this.hardDrop();
			}			
			if ((this.frames++ % 20) === 0) {
				this.moveDown();
			}

			this.currentTetramino.setTo(this.blockControl);

		},

		draw: function(context) {
			this.gameBoard.draw(context, this.stat);

			// so go through all the blocks on the grid. See which one is supposed to be filled with a color
			// i.e. solid. If it is solid. Draw that box!
			for (var i = 0; i < this.cols; i++) { 
				for (var j = 0; j < this.rows; j++) {
					var b = this.blockControl[i][j];
					if (b.solid) {
						this.gameBoard.drawBlock(context, b, i, j);
					}
				}
			}
			
		},

		setNextTetramino: function() {
			this.currentTetramino = new Tetramino(this.random.nextID());
			this.currentTetramino.x = 4;
			this.currentTetramino.y = 0;
			this.stat.incTetramino(this.currentTetramino.ID);
		},

		moveLeft: function () {
			var bc = this.blockControl;
			var ct = this.currentTetramino;

			if (ct.check(bc, -1, 0)) {
				ct.x -= 1;
			} 
		},

		moveRight: function() {
			var bc = this.blockControl;
			var ct = this.currentTetramino;

			if (ct.check(bc, 1, 0)) {
				ct.x += 1;
			} 
		},

		moveRotate: function(dr) {
			dr = dr || 1;
			var bc = this.blockControl;
			var ct = this.currentTetramino;

			if (ct.check(bc, 0, 0, dr)) {
				ct.rotation = ct.getRotation(dr);
			} 
		},

		moveDown: function () {
			var bc = this.blockControl;
			var ct = this.currentTetramino;

			if (ct.check(bc, 0, 1)) {
				ct.y += 1;
			} else {
				//ct.y += 1;
				ct.setTo(bc);
				this.checkRows();
				this.checkGame();
				this.setNextTetramino();
			}
		},

		hardDrop: function() {
			var bc = this.blockControl;
			var ct = this.currentTetramino;
			var move = true;

			while (move) {
				if (ct.check(bc, 0, 1)) {
					ct.y += 1;
					this.stat.score += 2;
				} else {
					move = false;				
					ct.setTo(bc);
					this.checkRows();
					this.setNextTetramino();
				}				
			}

		},

		checkRows: function() {
			var full = 0;
			var removed = 0;

			for (var i = this.rows - 1; i >= 0; i--) {
				var full = true;
				for (var j = 0; j < this.cols; j++) {
					if (!(this.blockControl[j][i].solid)) {
						full = false;
						break;
					}
				}

				if (full) {
					this.removeRow(i);
					removed++;
					this.stat.lines++;
					i++;
				}

			}

			if (removed > 0) {
				this.stat.addScore(removed);
				this.stat.checkLevelUp();
			}
		},

		checkGame: function() {
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < this.cols; j++) {
					if (this.blockControl[j][i].solid) {
						this.reset();
					}
				}
			}
		},

		removeRow: function(row) {
			var bc = this.blockControl;
			for (var i = row; i > 0; i--) {
				for (var j = 0; j < this.cols; j++) {
					bc[j][i].setType(bc[j][i - 1].ID);
				}
			}

		}

	});

	return Tetris;

});