window.addEventListener('ADAuthoredTransitionInPrepare', prepare_for_transition, false);
alert( "hello" );
function prepare_for_transition () {
    // get the y position of the banner
    banner_y = window.banner.rectOnScreen.y;
    // create the top mask
    top_canvas = create_canvas(0, 0, 320, banner_y);
    // create the bottom mask
    var bottom_y = banner_y + BANNER_HEIGHT;
    bottom_canvas = create_canvas(0, bottom_y, 320, 480 - bottom_y);
    // create an image used to draw in the canvas
    snapshot = new Image();
    // register an event listener for when the image is fully loaded
    snapshot.addEventListener('load', snapshot_did_load, false);
    snapshot.src = 'iad-screenshot://before-transition-in/';
    // register an event listener for when the transition is done
    top_canvas.addEventListener('webkitTransitionEnd', transition_ended, false);
};
 
/* Canvas Creation */
function create_canvas (x, y, width, height) {
    var f = window.devicePixelRatio;
    //
    var canvas = document.createElement('canvas');
    canvas.width = width * f;
    canvas.height = height * f;
    //
    var style = canvas.style;
    style.left = px(x);
    style.webkitTransform = ty(y);
    style.width = px(width);
    style.height = px(height);
    //
    return document.body.appendChild(canvas);
};

function snapshot_did_load () {
    // reposition to_screenshot to match where it was drawn before
    to_screenshot.style.webkitTransform = ty(banner_y - BANNER_Y_OFFSET);
    // draw the top mask
    top_canvas.getContext('2d').drawImage(snapshot, 0, 0);
    // draw the bottom mask
    bottom_canvas.getContext('2d').drawImage(snapshot,
      0, snapshot.height - bottom_canvas.height, snapshot.width, bottom_canvas.height,
      0, 0, snapshot.width, bottom_canvas.height);
    // tell the banner we're ready to start the transition, with a slight delay
    window.setTimeout(function () {
        window.banner.prepareForTransitionInDidFinish();
    }, 100);
    alert( "pre-transition ended" );
};

window.addEventListener('ADAuthoredTransitionInStart', start_transition, false);

function start_transition () {
    // set up target styles
    top_canvas.style.webkitTransform = ty(-banner_y);
    bottom_canvas.style.webkitTransform = ty(480);
    to_screenshot.style.webkitTransform = ty(0);
    // start the transition with a delay
    document.body.className = 'animated';
};

top_canvas.addEventListener('webkitTransitionEnd', transition_ended, false);

function transition_ended () {
    // notify the banner that the transition is done
    // so it displays the core ad unit
    banner.transitionInDidFinish();
};

