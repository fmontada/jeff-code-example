'use strict';

var defaultOptions = {
    delay: 4000,
    playOnInit: true,
    stopOnInteraction: true,
    stopOnMouseEnter: false,
    stopOnLastSnap: false,
};

function Autoplay(userOptions, userNode) {
    var options = Object.assign(
        {},
        defaultOptions,
        Autoplay.globalOptions,
        userOptions,
    );
    var playOnInit = options.playOnInit,
        stopOnInteraction = options.stopOnInteraction,
        stopOnMouseEnter = options.stopOnMouseEnter,
        stopOnLastSnap = options.stopOnLastSnap,
        delay = options.delay;
    var interaction = stopOnInteraction ? destroy : stop;
    var carousel;
    var timer = 0;

    function init(embla) {
        carousel = embla;
        var eventStore = carousel.internalEngine().eventStore;
        var emblaRoot = carousel.rootNode();
        var root = (userNode && userNode(emblaRoot)) || emblaRoot;
        carousel.on('pointerDown', interaction);
        if (!stopOnInteraction) carousel.on('pointerUp', reset);

        if (stopOnMouseEnter) {
            eventStore.add(root, 'mouseenter', interaction);
            if (!stopOnInteraction) eventStore.add(root, 'mouseleave', reset);
        }

        eventStore.add(document, 'visibilitychange', function () {
            if (document.visibilityState === 'hidden') return stop();
            reset();
        });
        eventStore.add(window, 'pagehide', function (event) {
            if (event.persisted) stop();
        });
        if (playOnInit) play();
    }

    function destroy() {
        carousel.off('pointerDown', interaction);
        if (!stopOnInteraction) carousel.off('pointerUp', reset);
        stop();
        timer = 0;
    }

    function play() {
        stop();
        timer = window.setTimeout(next, delay);
    }

    function stop() {
        if (!timer) return;
        window.clearTimeout(timer);
    }

    function reset() {
        if (!timer) return;
        stop();
        play();
    }

    function next() {
        var index = carousel.internalEngine().index;
        var kill = stopOnLastSnap && index.get() === index.max;
        if (kill) return destroy();

        if (carousel.canScrollNext()) {
            carousel.scrollNext();
        } else {
            carousel.scrollTo(0);
        }

        play();
    }

    var self = {
        name: 'Autoplay',
        options: options,
        init: init,
        destroy: destroy,
        play: play,
        stop: stop,
        reset: reset,
    };
    return self;
}

Autoplay.globalOptions = undefined;

module.exports = Autoplay;
//# sourceMappingURL=embla-carousel-autoplay.js.map
