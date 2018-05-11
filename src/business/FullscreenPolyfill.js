
export function requestFullscreen() {
    const requestFullscreen = document.documentElement.requestFullscreen
        || document.documentElement.webkitRequestFullscreen
        || document.documentElement.mozRequestFullScreen
        || document.documentElement.msRequestFullscreen;
    if (requestFullscreen) {
        requestFullscreen.call(document.documentElement);
    } else {
        console.error("Fullscreen-API not supported");
    }
}

export function exitFullscreen() {
    const exitFullscreen = document.exitFullscreen
        || document.webkitExitFullscreen
        || document.mozCancelFullScreen
        || document.msExitFullscreen;
    if (exitFullscreen) {
        exitFullscreen.call(document);
    } else {
        console.error("Fullscreen-API not supported");
    }
}

export function isFullscreen() {
    const fullscreenElement = document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement;
    return fullscreenElement != null;
}

export function addFullscreenChangeListener(listener) {
    for (const polyfillEvent of ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"]) {
        document.addEventListener(polyfillEvent, listener);
    }
}

export function removeFullscreenChangeListener(listener) {
    for (const polyfillEvent of ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"]) {
        document.removeEventListener(polyfillEvent, listener);
    }
}
