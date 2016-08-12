var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var images = [];
var selectedImage = -1;
var imageInput = $('#imageInput');
var imageList = $('#imageList');
var spriteWidth = $('#spriteWidth');
var spriteHeight = $('#spriteHeight');

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

    var image = {};
    images.push(image);
    image.fileName = file.name;
    //defaults
    image.imageFile = new Image();
    image.spriteWidth = 32;
    image.spriteHeight = 32;

    var reader = new FileReader();
    reader.onload = function (fileResult) {
        image.imageFile.src = fileResult.target.result;
        refreshImageList();
    };
    reader.readAsDataURL(file);
});

spriteWidth.on('change textInput input', function () {
    var image = images[selectedImage];
    image.spriteWidth = parseInt($(this).val());
    drawUniformBoundaries();
});

spriteHeight.on('change textInput input', function (e) {
    var image = images[selectedImage];
    image.spriteHeight = parseInt($(this).val());
    drawUniformBoundaries();
});

function refreshImageList() {
    imageList.empty();
    images.forEach(function (image, i) {
        imageList
            .append($('<option>', {value: i})
                .text(image.fileName));
    });
    imageList.attr('size', Math.max(3, images.length));
}

imageList.change(function () {
    selectedImage = $(this).val();
    var image = images[selectedImage];

    var img = image.imageFile;
    resetCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);

    $('.imageControls').css('display', 'block');
    spriteWidth.val(image.spriteWidth);
    spriteHeight.val(image.spriteHeight);

    drawUniformBoundaries();

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

function drawUniformBoundaries() {
    var image = images[selectedImage];
    var img = image.imageFile;
    resetCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);

    var spriteWidth = image.spriteWidth;
    var spriteHeight = image.spriteHeight;
    var imageWidth = image.imageFile.width;
    var imageHeight = image.imageFile.height;

    if(spriteWidth <=0 || spriteHeight <= 0) {
        return;
    }

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
    for (var y = 0; y < imageHeight; y += spriteHeight) {
        for (var x = 0; x < imageWidth; x += spriteWidth) {
            ctx.fillRect(x, y, spriteWidth, spriteHeight);
            ctx.strokeRect(x, y, spriteWidth, spriteHeight);
        }
    }
}