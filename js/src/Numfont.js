define(function() {
	var Numfont = Class.extend({

		init: function(img, y, h) {
			this.img = img;
			this.y = y;
			this.height = h;
			this.width = img.width / 10; // 10 numbers one each row of the image
		},

		draw: function(ctx, num, x, y, padding) {
			num = ""+num;

			if (padding) {
				// add the zeros before the number
				num = num.length >= padding ? num : new Array(padding - num.length + 1).join("0") + num;
			}

			var n;
			for (var i = 0; i < num.length; i++) {
				n = parseInt(num[i]);
				// double check this drawImage function deeper
				ctx.drawImage(this.img, this.width * n, this.y, this.width, this.height,
					x, y, this.width, this.height);
				x += this.width;
			}
		}

	});

	return Numfont;
});