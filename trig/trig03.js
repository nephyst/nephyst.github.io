window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,

			centerX = width/2,
			centerY = height/2,
			radius = 300,
			numObjects = 700,
			slice,
			speed = 0.03,
			xangle,
			yangle,
			xoffset = Math.random(),
			yoffset = Math.random(),
			x, y,

			time = 0;

    render();

		function render() {
			slice = 0;
			context.clearRect(0, 0, canvas.width, canvas.height);
			for(var i = 0; i < numObjects; i++) {
				slice += 1.44;
				xangle = i * slice/1.98 + time/4 + xoffset;
				yangle = i * slice/1.31 + time/5 + yoffset;
				x = centerX + Math.cos(xangle) * radius;
				y = centerY + Math.sin(yangle) * radius;

				context.beginPath();
				context.arc(x, y, 2, 0, Math.PI * 2, false);
				context.fill();
			}

			time += speed;
			requestAnimationFrame(render);
		}

};
