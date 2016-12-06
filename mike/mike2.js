window.onload = function () {
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext("2d");
    var cWidth = canvas.width = window.innerWidth;
    var cHeight = canvas.height = window.innerHeight;

    var bg = new Image();
    bg.addEventListener("load", function() {
        drawImage();
    });
    bg.src = 'bg.jpg';

    function drawImage() {
        var cWidth = canvas.width = window.innerWidth;
        var cHeight = canvas.height = window.innerHeight;
        console.log(cWidth, canvas.width, window.innerWidth);
        var scale = bg.height / cHeight;

        var width = bg.width / scale;
        var height = bg.height / scale;
        var xOffset = (cWidth - width) / 2;

        c.drawImage(bg, xOffset, 0, width, height);
        c.globalAlpha = 0.7;
        c.beginPath();
        c.arc(880/scale + xOffset, 371/scale, 7, 0, 2 * Math.PI);
        c.arc(880/scale + xOffset, 411/scale, 7, 0, 2 * Math.PI);
        c.fillStyle = "red";
        c.fill();
        c.globalAlpha = 1;
    }

    window.addEventListener("resize", function () {
        drawImage();
    });

    window.onresize = drawImage();
};