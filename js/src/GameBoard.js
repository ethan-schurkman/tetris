define(["src/Numfont"], function(Numfont){

	var GameBoard = Class.extend({
		init: function() {
			this.back = content.get("back");
			this.blocks = content.get("blocks");
			var num = content.get("numbers");
			this.font = {
				gray  : new Numfont(num, 0, 9),
				cyan  : new Numfont(num, 9, 9),
				red   : new Numfont(num, 18, 9),
				blue  : new Numfont(num, 27, 9),
				orange: new Numfont(num, 36, 9),
				green : new Numfont(num, 45, 9),
				yellow: new Numfont(num, 54, 9),
				purple: new Numfont(num, 63, 9)
			};

		}, 

		draw: function(context, stat) {
			var tet = stat.tetraminos;

			context.drawImage(this.back, 0, 0);

			this.font.gray.draw(context, stat.level, 113, 16, 5);
			this.font.gray.draw(context, stat.lines, 113, 34, 5);
			this.font.gray.draw(context, stat.score, 78, 52, 10);

			this.font.orange.draw(context, tet.L, 432, 53, 5);
			this.font.cyan.draw(context, tet.I, 432, 77, 5);
			this.font.purple.draw(context, tet.T, 432, 101, 5);
			this.font.green.draw(context, tet.S, 432, 125, 5);
			this.font.red.draw(context, tet.Z, 432, 149, 5);
			this.font.yellow.draw(context, tet.O, 432, 173, 5);
			this.font.blue.draw(context, tet.J, 432, 197, 5);
			this.font.gray.draw(context, tet.tot, 422, 221, 6);
		},

		drawBlock: function(context, block, x, y) {
			var id = block.ID;
			var size = 13;

			x = 179 + x*12;
			y = 4 + y*12;

			context.drawImage(this.blocks, id*12, 0, size, size, x, y, size, size);

		}


	});

	return GameBoard;


});