
$('#addFrame').click(function () {
    addFrame();
});

function addFrame() {
    var div = $("<div>", {class: 'frame'});
    $('#frame-box').append(div);
    select(div);
}

$('#footer').on("click", "div.frame", function () {
    select($(this));
});

/* FRAMES */
var selected;
function select(div) {
    if (selected) {
        selected.removeClass('selected');
    }
    selected = div;
    selected.addClass('selected');
}

/* TABS */
function openTab(event, cityName) {
    $('.tabcontent').css('display', 'none');
    $('.tablinks').removeClass('active');
    $('#' + cityName).css('display', 'block');
    event.target.className += " active";
}
$(document).ready(function() {
    addFrame();
    $('#sprite-tab').click();
});
