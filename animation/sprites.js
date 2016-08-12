var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var sprites = [];
var imageInput = $('#imageInput');
var spriteList = $('#imageList');

// Canvas background pattern
var pattern = document.createElement('canvas');
pattern.width = 20;
pattern.height = 20;
var pctx = pattern.getContext('2d');
pctx.fillStyle = "lightgrey";
pctx.fillRect(0, 0, 10, 10);
pctx.fillRect(10, 10, 20, 20);
var checkerPattern = ctx.createPattern(pattern, "repeat");

resetCanvas();

imageInput.on('change', function (e) {
    var file = e.target.files[0];

    var sprite = {};
    sprites.push(sprite);
    sprite.imageFile = new Image();
    sprite.fileName = file.name;

    var reader = new FileReader();
    reader.onload = function (fileResult) {
        sprite.imageFile.src = fileResult.target.result;
        refreshSpriteList();
    };
    reader.readAsDataURL(file);
});

function refreshSpriteList() {
    spriteList.empty();
    sprites.forEach(function (sprite, i) {
        spriteList
            .append($('<option>', {value: i})
                .text(sprite.fileName));
    });
    spriteList.attr('size', Math.max(3, sprites.length));
}

spriteList.change(function () {
    var value = $(this).val();

    var img = sprites[value].imageFile;
    resetCanvas(img.width, img.height);
    console.log(img.width, img.height);
    ctx.drawImage(img, 0, 0);
});

function resetCanvas(width, height) {
    var jCanvas = $('#canvas');
    var canvasWrapper = document.getElementById('canvasWrapper');
    width = width | 0;
    height = height | 0;

    var computedStyle = getComputedStyle(canvasWrapper);
    var computedWidth = Math.max(width, parseInt(computedStyle.width));
    var computedHeight = Math.max(height, parseInt(computedStyle.height));
    jCanvas.css('width', computedWidth);
    jCanvas.css('height', computedHeight);
    ctx.canvas.width = computedWidth;
    ctx.canvas.height = computedHeight;

    ctx.fillStyle = checkerPattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
