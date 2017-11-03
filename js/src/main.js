requirejs.config({

	// makes life easy drilling down into folders and finding files with js extensions.
	baseUrl: "js",
	paths: {
		src: "./src"
	}
});

// how we do module loading...
require(["src/Game", "src/Tetris"], function(Game, Tetris) {

	var App = Game.extend({

		init: function() {
			canvas.width = 480;
			canvas.height = 272;
			canvas.scale = 1;

			content.load("back", "res/back.png");
			content.load("blocks", "res/blocks.png");
			content.load("numbers", "res/numbers.png");

			input.bindKey("space", input.Keys.SPACE);
			input.bindKey("enter", input.Keys.ENTER);			
			input.bindKey("left", [input.Keys.LEFT_ARROW, input.Keys.A]);
			input.bindKey("up", [input.Keys.UP_ARROW, input.Keys.W]);
			input.bindKey("right", [input.Keys.RIGHT_ARROW, input.Keys.D]);
			input.bindKey("down", [input.Keys.DOWN_ARROW, input.Keys.S]);
		},

		tick: function() {
			//console.log("tick");
			if (this.hasLoad) {
				this.tetris.update(input);
				this.tetris.draw(canvas.ctx);

			} else {
				// continually check that files have loaded until we have load status equal to 1
				this.hasLoad = (content.progress() === 1);

				// since this will be the first time files are loaded, we create the tetris object in the app.
				if (this.hasLoad) {
					this.tetris = new Tetris(10, 22);
				}
			}
		}
	});

	(function() {
		var game = new App();
		game.run();

		// stop the game when I click off the screen. Start the game when I click back on it.
		window.onblur = game.stop.bind(game);
		window.onfocus = game.run.bind(game);
	})();
});