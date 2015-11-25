window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;

	context.fillRect(0, 0, width, height);
	context.translate(0, height/2);
	context.scale(1, -1);

	context.lineWidth = 3;
	context.strokeStyle = '#999999';
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(400 * Math.PI,0);
	context.stroke();

	for (var angle = 0; angle < 2*Math.PI; angle += 0.01) {
		var x = 200 * angle,
				y = 200 * Math.sin(angle);
		context.fillStyle = '#00ffff';
		context.fillRect(x, y, 5, 5);

		y = 200 * Math.asin(angle);
		context.fillStyle = '#009999';
		context.fillRect(x, y, 5, 5);

		y = 200 * Math.cos(angle);
		context.fillStyle = '#ff00ff';
		context.fillRect(x, y, 5, 5);

		y = 200 * Math.tan(angle);
		context.fillStyle = '#ffff00';
		context.fillRect(x, y, 5, 5);
	}
};
