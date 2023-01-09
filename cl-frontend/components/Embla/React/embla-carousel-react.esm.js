import { useEffect, useMemo, useRef, useState } from 'react';

function canUseDOM() {
    return !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
    );
}
function areObjectsEqualShallow(objectA, objectB) {
    return (
        Object.keys(objectA).length === Object.keys(objectB).length &&
        Object.keys(objectA).every(function (objectKey) {
            if (!Object.prototype.hasOwnProperty.call(objectB, objectKey)) {
                return false;
            }

            return objectA[objectKey] === objectB[objectKey];
        })
    );
}
function sortAndMapPluginToOptions(plugins) {
    return plugins
        .concat()
        .sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
        })
        .map(function (plugin) {
            return plugin.options;
        });
}
function arePluginsEqual(pluginsA, pluginsB) {
    if (pluginsA.length !== pluginsB.length) return false;
    var optionsA = sortAndMapPluginToOptions(pluginsA);
    var optionsB = sortAndMapPluginToOptions(pluginsB);
    return optionsA.every(function (optionA, index) {
        var optionB = optionsB[index];
        return areObjectsEqualShallow(optionA, optionB);
    });
}

function Alignment(align, viewSize) {
    var predefined = {
        start: start,
        center: center,
        end: end,
    };

    function start() {
        return 0;
    }

    function center(n) {
        return end(n) / 2;
    }

    function end(n) {
        return viewSize - n;
    }

    function percent() {
        return viewSize * Number(align);
    }

    function measure(n) {
        if (typeof align === 'number') return percent();
        return predefined[align](n);
    }

    var self = {
        measure: measure,
    };
    return self;
}

function Animation(callback) {
    var animationFrame = 0;

    function ifAnimating(active, cb) {
        return function () {
            if (active === !!animationFrame) cb();
        };
    }

    function start() {
        animationFrame = window.requestAnimationFrame(callback);
    }

    function stop() {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
    }

    var self = {
        proceed: ifAnimating(true, start),
        start: ifAnimating(false, start),
        stop: ifAnimating(true, stop),
    };
    return self;
}

function Axis(axis, direction) {
    var scroll = axis === 'y' ? 'y' : 'x';
    var cross = axis === 'y' ? 'x' : 'y';
    var startEdge = getStartEdge();
    var endEdge = getEndEdge();

    function measureSize(rect) {
        var width = rect.width,
            height = rect.height;
        return scroll === 'x' ? width : height;
    }

    function getStartEdge() {
        if (scroll === 'y') return 'top';
        return direction === 'rtl' ? 'right' : 'left';
    }

    function getEndEdge() {
        if (scroll === 'y') return 'bottom';
        return direction === 'rtl' ? 'left' : 'right';
    }

    var self = {
        scroll: scroll,
        cross: cross,
        startEdge: startEdge,
        endEdge: endEdge,
        measureSize: measureSize,
    };
    return self;
}

function map(value, iStart, iStop, oStart, oStop) {
    return oStart + (oStop - oStart) * ((value - iStart) / (iStop - iStart));
}

function mathAbs(n) {
    return Math.abs(n);
}

function mathSign(n) {
    return !n ? 0 : n / mathAbs(n);
}

function deltaAbs(valueB, valueA) {
    return mathAbs(valueB - valueA);
}

function factorAbs(valueB, valueA) {
    if (valueB === 0 || valueA === 0) return 0;
    if (mathAbs(valueB) <= mathAbs(valueA)) return 0;
    var diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
    return mathAbs(diff / valueB);
}

function roundToDecimals(decimalPoints) {
    var pow = Math.pow(10, decimalPoints);
    return function (n) {
        return Math.round(n * pow) / pow;
    };
}

function debounce(callback, time) {
    var timeout = 0;
    return function () {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(callback, time) || 0;
    };
}

function arrayGroup(array, size) {
    var groups = [];

    for (var i = 0; i < array.length; i += size) {
        groups.push(array.slice(i, i + size));
    }

    return groups;
}

function arrayKeys(array) {
    return Object.keys(array).map(Number);
}

function arrayLast(array) {
    return array[arrayLastIndex(array)];
}

function arrayLastIndex(array) {
    return Math.max(0, array.length - 1);
}

function Limit(min, max) {
    var length = mathAbs(min - max);

    function reachedMin(n) {
        return n < min;
    }

    function reachedMax(n) {
        return n > max;
    }

    function reachedAny(n) {
        return reachedMin(n) || reachedMax(n);
    }

    function constrain(n) {
        if (!reachedAny(n)) return n;
        return reachedMin(n) ? min : max;
    }

    function removeOffset(n) {
        if (!length) return n;
        return n - length * Math.ceil((n - max) / length);
    }

    var self = {
        length: length,
        max: max,
        min: min,
        constrain: constrain,
        reachedAny: reachedAny,
        reachedMax: reachedMax,
        reachedMin: reachedMin,
        removeOffset: removeOffset,
    };
    return self;
}

function Counter(max, start, loop) {
    var _a = Limit(0, max),
        min = _a.min,
        constrain = _a.constrain;

    var loopEnd = max + 1;
    var counter = withinLimit(start);

    function withinLimit(n) {
        return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd);
    }

    function get() {
        return counter;
    }

    function set(n) {
        counter = withinLimit(n);
        return self;
    }

    function add(n) {
        return set(get() + n);
    }

    function clone() {
        return Counter(max, get(), loop);
    }

    var self = {
        add: add,
        clone: clone,
        get: get,
        set: set,
        min: min,
        max: max,
    };
    return self;
}

function Direction(direction) {
    var sign = direction === 'rtl' ? -1 : 1;

    function apply(n) {
        return n * sign;
    }

    var self = {
        apply: apply,
    };
    return self;
}

function EventStore() {
    var listeners = [];

    function add(node, type, handler, options) {
        if (options === void 0) {
            options = false;
        }

        node.addEventListener(type, handler, options);
        listeners.push(function () {
            return node.removeEventListener(type, handler, options);
        });
        return self;
    }

    function removeAll() {
        listeners = listeners.filter(function (remove) {
            return remove();
        });
        return self;
    }

    var self = {
        add: add,
        removeAll: removeAll,
    };
    return self;
}

function Vector1D(value) {
    var vector = value;

    function get() {
        return vector;
    }

    function set(n) {
        vector = readNumber(n);
        return self;
    }

    function add(n) {
        vector += readNumber(n);
        return self;
    }

    function subtract(n) {
        vector -= readNumber(n);
        return self;
    }

    function multiply(n) {
        vector *= n;
        return self;
    }

    function divide(n) {
        vector /= n;
        return self;
    }

    function normalize() {
        if (vector !== 0) divide(vector);
        return self;
    }

    function readNumber(n) {
        return typeof n === 'number' ? n : n.get();
    }

    var self = {
        add: add,
        divide: divide,
        get: get,
        multiply: multiply,
        normalize: normalize,
        set: set,
        subtract: subtract,
    };
    return self;
}

function DragHandler(
    axis,
    direction,
    rootNode,
    target,
    dragFree,
    dragTracker,
    location,
    animation,
    scrollTo,
    scrollBody,
    scrollTarget,
    index,
    events,
    loop,
    skipSnaps,
) {
    var crossAxis = axis.cross;
    var focusNodes = ['INPUT', 'SELECT', 'TEXTAREA'];
    var dragStartPoint = Vector1D(0);
    var activationEvents = EventStore();
    var interactionEvents = EventStore();
    var snapForceBoost = {
        mouse: 300,
        touch: 400,
    };
    var freeForceBoost = {
        mouse: 500,
        touch: 600,
    };
    var baseSpeed = dragFree ? 5 : 16;
    var baseMass = 1;
    var dragThreshold = 20;
    var startScroll = 0;
    var startCross = 0;
    var pointerIsDown = false;
    var preventScroll = false;
    var preventClick = false;
    var isMouse = false;

    function addActivationEvents() {
        var node = rootNode;
        activationEvents
            .add(node, 'touchmove', function () {
                return undefined;
            })
            .add(node, 'touchend', function () {
                return undefined;
            })
            .add(node, 'touchstart', down)
            .add(node, 'mousedown', down)
            .add(node, 'touchcancel', up)
            .add(node, 'contextmenu', up)
            .add(node, 'click', click);
    }

    function addInteractionEvents() {
        var node = !isMouse ? rootNode : document;
        interactionEvents
            .add(node, 'touchmove', move)
            .add(node, 'touchend', up)
            .add(node, 'mousemove', move)
            .add(node, 'mouseup', up);
    }

    function removeAllEvents() {
        activationEvents.removeAll();
        interactionEvents.removeAll();
    }

    function isFocusNode(node) {
        var name = node.nodeName || '';
        return focusNodes.indexOf(name) > -1;
    }

    function forceBoost() {
        var boost = dragFree ? freeForceBoost : snapForceBoost;
        var type = isMouse ? 'mouse' : 'touch';
        return boost[type];
    }

    function allowedForce(force, targetChanged) {
        var next = index.clone().add(mathSign(force) * -1);
        var isEdge = next.get() === index.min || next.get() === index.max;
        var baseForce = scrollTarget.byDistance(force, !dragFree).distance;
        if (dragFree || mathAbs(force) < dragThreshold) return baseForce;
        if (!loop && isEdge) return baseForce * 0.4;
        if (skipSnaps && targetChanged) return baseForce * 0.5;
        return scrollTarget.byIndex(next.get(), 0).distance;
    }

    function down(evt) {
        isMouse = evt.type === 'mousedown';
        if (isMouse && evt.button !== 0) return;
        var isMoving = deltaAbs(target.get(), location.get()) >= 2;
        var clearPreventClick = isMouse || !isMoving;
        var isNotFocusNode = !isFocusNode(evt.target);
        var preventDefault = isMoving || (isMouse && isNotFocusNode);
        pointerIsDown = true;
        dragTracker.pointerDown(evt);
        dragStartPoint.set(target);
        target.set(location);
        scrollBody.useBaseMass().useSpeed(80);
        addInteractionEvents();
        startScroll = dragTracker.readPoint(evt);
        startCross = dragTracker.readPoint(evt, crossAxis);
        events.emit('pointerDown');
        if (clearPreventClick) preventClick = false;
        if (preventDefault) evt.preventDefault();
    }

    function move(evt) {
        if (!preventScroll && !isMouse) {
            if (!evt.cancelable) return up(evt);
            var lastScroll = dragTracker.readPoint(evt);
            var lastCross = dragTracker.readPoint(evt, crossAxis);
            var diffScroll = deltaAbs(lastScroll, startScroll);
            var diffCross = deltaAbs(lastCross, startCross);
            preventScroll = diffScroll > diffCross;
            if (!preventScroll && !preventClick) return up(evt);
        }

        var diff = dragTracker.pointerMove(evt);
        if (!preventClick && diff) preventClick = true;
        animation.start();
        target.add(direction.apply(diff));
        evt.preventDefault();
    }

    function up(evt) {
        var currentLocation = scrollTarget.byDistance(0, false);
        var targetChanged = currentLocation.index !== index.get();
        var rawForce = dragTracker.pointerUp(evt) * forceBoost();
        var force = allowedForce(direction.apply(rawForce), targetChanged);
        var forceFactor = factorAbs(rawForce, force);
        var isMoving = deltaAbs(target.get(), dragStartPoint.get()) >= 0.5;
        var isVigorous = targetChanged && forceFactor > 0.75;
        var isBelowThreshold = mathAbs(rawForce) < dragThreshold;
        var speed = isVigorous ? 10 : baseSpeed;
        var mass = isVigorous ? baseMass + 2.5 * forceFactor : baseMass;
        if (isMoving && !isMouse) preventClick = true;
        preventScroll = false;
        pointerIsDown = false;
        interactionEvents.removeAll();
        scrollBody.useSpeed(isBelowThreshold ? 9 : speed).useMass(mass);
        scrollTo.distance(force, !dragFree);
        isMouse = false;
        events.emit('pointerUp');
    }

    function click(evt) {
        if (preventClick) evt.preventDefault();
    }

    function clickAllowed() {
        return !preventClick;
    }

    function pointerDown() {
        return pointerIsDown;
    }

    var self = {
        addActivationEvents: addActivationEvents,
        clickAllowed: clickAllowed,
        pointerDown: pointerDown,
        removeAllEvents: removeAllEvents,
    };
    return self;
}

function DragTracker(axis, pxToPercent) {
    var logInterval = 170;
    var startEvent;
    var lastEvent;

    function isTouchEvent(evt) {
        return typeof TouchEvent !== 'undefined' && evt instanceof TouchEvent;
    }

    function readTime(evt) {
        return evt.timeStamp;
    }

    function readPoint(evt, evtAxis) {
        var property = evtAxis || axis.scroll;
        var coord = 'client' + (property === 'x' ? 'X' : 'Y');
        return (isTouchEvent(evt) ? evt.touches[0] : evt)[coord];
    }

    function pointerDown(evt) {
        startEvent = evt;
        lastEvent = evt;
        return pxToPercent.measure(readPoint(evt));
    }

    function pointerMove(evt) {
        var diff = readPoint(evt) - readPoint(lastEvent);
        var expired = readTime(evt) - readTime(startEvent) > logInterval;
        lastEvent = evt;
        if (expired) startEvent = evt;
        return pxToPercent.measure(diff);
    }

    function pointerUp(evt) {
        if (!startEvent || !lastEvent) return 0;
        var diffDrag = readPoint(lastEvent) - readPoint(startEvent);
        var diffTime = readTime(evt) - readTime(startEvent);
        var expired = readTime(evt) - readTime(lastEvent) > logInterval;
        var force = diffDrag / diffTime;
        var isFlick = diffTime && !expired && mathAbs(force) > 0.1;
        return isFlick ? pxToPercent.measure(force) : 0;
    }

    var self = {
        isTouchEvent: isTouchEvent,
        pointerDown: pointerDown,
        pointerMove: pointerMove,
        pointerUp: pointerUp,
        readPoint: readPoint,
    };
    return self;
}

function PxToPercent(viewInPx) {
    var totalPercent = 100;

    function measure(n) {
        if (viewInPx === 0) return 0;
        return (n / viewInPx) * totalPercent;
    }

    var self = {
        measure: measure,
        totalPercent: totalPercent,
    };
    return self;
}

function ScrollBody(location, baseSpeed, baseMass) {
    var roundToTwoDecimals = roundToDecimals(2);
    var velocity = Vector1D(0);
    var acceleration = Vector1D(0);
    var attraction = Vector1D(0);
    var attractionDirection = 0;
    var speed = baseSpeed;
    var mass = baseMass;

    function update() {
        velocity.add(acceleration);
        location.add(velocity);
        acceleration.multiply(0);
    }

    function applyForce(force) {
        force.divide(mass);
        acceleration.add(force);
    }

    function seek(target) {
        attraction.set(target).subtract(location);
        var magnitude = map(attraction.get(), 0, 100, 0, speed);
        attractionDirection = mathSign(attraction.get());
        attraction.normalize().multiply(magnitude).subtract(velocity);
        applyForce(attraction);
        return self;
    }

    function settle(target) {
        var diff = target.get() - location.get();
        var hasSettled = !roundToTwoDecimals(diff);
        if (hasSettled) location.set(target);
        return hasSettled;
    }

    function direction() {
        return attractionDirection;
    }

    function useBaseSpeed() {
        return useSpeed(baseSpeed);
    }

    function useBaseMass() {
        return useMass(baseMass);
    }

    function useSpeed(n) {
        speed = n;
        return self;
    }

    function useMass(n) {
        mass = n;
        return self;
    }

    var self = {
        direction: direction,
        seek: seek,
        settle: settle,
        update: update,
        useBaseMass: useBaseMass,
        useBaseSpeed: useBaseSpeed,
        useMass: useMass,
        useSpeed: useSpeed,
    };
    return self;
}

function ScrollBounds(limit, location, target, scrollBody) {
    var pullBackThreshold = 10;
    var edgeOffsetTolerance = 50;
    var maxFriction = 0.85;
    var disabled = false;

    function shouldConstrain() {
        if (disabled) return false;
        if (!limit.reachedAny(target.get())) return false;
        if (!limit.reachedAny(location.get())) return false;
        return true;
    }

    function constrain(pointerDown) {
        if (!shouldConstrain()) return;
        var edge = limit.reachedMin(location.get()) ? 'min' : 'max';
        var diffToEdge = mathAbs(limit[edge] - location.get());
        var diffToTarget = target.get() - location.get();
        var friction = Math.min(diffToEdge / edgeOffsetTolerance, maxFriction);
        target.subtract(diffToTarget * friction);

        if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
            target.set(limit.constrain(target.get()));
            scrollBody.useSpeed(10).useMass(3);
        }
    }

    function toggleActive(active) {
        disabled = !active;
    }

    var self = {
        constrain: constrain,
        toggleActive: toggleActive,
    };
    return self;
}

function ScrollContain(
    viewSize,
    contentSize,
    snaps,
    snapsAligned,
    containScroll,
) {
    var scrollBounds = Limit(-contentSize + viewSize, snaps[0]);
    var snapsBounded = snapsAligned.map(scrollBounds.constrain);
    var snapsContained = measureContained();

    function findDuplicates() {
        var startSnap = snapsBounded[0];
        var endSnap = arrayLast(snapsBounded);
        var min = snapsBounded.lastIndexOf(startSnap);
        var max = snapsBounded.indexOf(endSnap) + 1;
        return Limit(min, max);
    }

    function measureContained() {
        if (contentSize <= viewSize) return [scrollBounds.max];
        if (containScroll === 'keepSnaps') return snapsBounded;

        var _a = findDuplicates(),
            min = _a.min,
            max = _a.max;

        return snapsBounded.slice(min, max);
    }

    var self = {
        snapsContained: snapsContained,
    };
    return self;
}

function ScrollLimit(contentSize, scrollSnaps, loop) {
    var limit = measureLimit();

    function measureLimit() {
        var startSnap = scrollSnaps[0];
        var endSnap = arrayLast(scrollSnaps);
        var min = loop ? startSnap - contentSize : endSnap;
        var max = startSnap;
        return Limit(min, max);
    }

    var self = {
        limit: limit,
    };
    return self;
}

function ScrollLooper(contentSize, pxToPercent, limit, location, vectors) {
    var min = limit.min + pxToPercent.measure(0.1);
    var max = limit.max + pxToPercent.measure(0.1);

    var _a = Limit(min, max),
        reachedMin = _a.reachedMin,
        reachedMax = _a.reachedMax;

    function shouldLoop(direction) {
        if (direction === 1) return reachedMax(location.get());
        if (direction === -1) return reachedMin(location.get());
        return false;
    }

    function loop(direction) {
        if (!shouldLoop(direction)) return;
        var loopDistance = contentSize * (direction * -1);
        vectors.forEach(function (v) {
            return v.add(loopDistance);
        });
    }

    var self = {
        loop: loop,
    };
    return self;
}

function ScrollProgress(limit) {
    var max = limit.max,
        scrollLength = limit.length;

    function get(n) {
        var currentLocation = n - max;
        return currentLocation / -scrollLength;
    }

    var self = {
        get: get,
    };
    return self;
}

function ScrollSnap(
    axis,
    alignment,
    pxToPercent,
    containerRect,
    slideRects,
    slidesToScroll,
) {
    var startEdge = axis.startEdge,
        endEdge = axis.endEdge;
    var snaps = measureUnaligned();
    var snapsAligned = measureAligned();

    function measureSizes() {
        return arrayGroup(slideRects, slidesToScroll)
            .map(function (rects) {
                return arrayLast(rects)[endEdge] - rects[0][startEdge];
            })
            .map(pxToPercent.measure)
            .map(mathAbs);
    }

    function measureUnaligned() {
        return slideRects
            .map(function (rect) {
                return containerRect[startEdge] - rect[startEdge];
            })
            .map(pxToPercent.measure)
            .map(function (snap) {
                return -mathAbs(snap);
            });
    }

    function measureAligned() {
        var groupedSnaps = arrayGroup(snaps, slidesToScroll).map(function (g) {
            return g[0];
        });
        var alignments = measureSizes().map(alignment.measure);
        return groupedSnaps.map(function (snap, index) {
            return snap + alignments[index];
        });
    }

    var self = {
        snaps: snaps,
        snapsAligned: snapsAligned,
    };
    return self;
}

function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
    var reachedAny = limit.reachedAny,
        removeOffset = limit.removeOffset,
        constrain = limit.constrain;

    function minDistance(d1, d2) {
        return mathAbs(d1) < mathAbs(d2) ? d1 : d2;
    }

    function findTargetSnap(target) {
        var distance = loop ? removeOffset(target) : constrain(target);
        var ascDiffsToSnaps = scrollSnaps
            .map(function (scrollSnap) {
                return scrollSnap - distance;
            })
            .map(function (diffToSnap) {
                return shortcut(diffToSnap, 0);
            })
            .map(function (diff, i) {
                return {
                    diff: diff,
                    index: i,
                };
            })
            .sort(function (d1, d2) {
                return mathAbs(d1.diff) - mathAbs(d2.diff);
            });
        var index = ascDiffsToSnaps[0].index;
        return {
            index: index,
            distance: distance,
        };
    }

    function shortcut(target, direction) {
        var t1 = target;
        var t2 = target + contentSize;
        var t3 = target - contentSize;
        if (!loop) return t1;
        if (!direction) return minDistance(minDistance(t1, t2), t3);
        var shortest = minDistance(t1, direction === 1 ? t2 : t3);
        return mathAbs(shortest) * direction;
    }

    function byIndex(index, direction) {
        var diffToSnap = scrollSnaps[index] - targetVector.get();
        var distance = shortcut(diffToSnap, direction);
        return {
            index: index,
            distance: distance,
        };
    }

    function byDistance(distance, snap) {
        var target = targetVector.get() + distance;

        var _a = findTargetSnap(target),
            index = _a.index,
            targetSnapDistance = _a.distance;

        var reachedBound = !loop && reachedAny(target);
        if (!snap || reachedBound)
            return {
                index: index,
                distance: distance,
            };
        var diffToSnap = scrollSnaps[index] - targetSnapDistance;
        var snapDistance = distance + shortcut(diffToSnap, 0);
        return {
            index: index,
            distance: snapDistance,
        };
    }

    var self = {
        byDistance: byDistance,
        byIndex: byIndex,
        shortcut: shortcut,
    };
    return self;
}

function ScrollTo(
    animation,
    indexCurrent,
    indexPrevious,
    scrollTarget,
    targetVector,
    events,
) {
    function scrollTo(target) {
        var distanceDiff = target.distance;
        var indexDiff = target.index !== indexCurrent.get();

        if (distanceDiff) {
            animation.start();
            targetVector.add(distanceDiff);
        }

        if (indexDiff) {
            indexPrevious.set(indexCurrent.get());
            indexCurrent.set(target.index);
            events.emit('select');
        }
    }

    function distance(n, snap) {
        var target = scrollTarget.byDistance(n, snap);
        scrollTo(target);
    }

    function index(n, direction) {
        var targetIndex = indexCurrent.clone().set(n);
        var target = scrollTarget.byIndex(targetIndex.get(), direction);
        scrollTo(target);
    }

    var self = {
        distance: distance,
        index: index,
    };
    return self;
}

function SlideLooper(
    axis,
    viewSize,
    contentSize,
    slideSizesWithGaps,
    scrollSnaps,
    slidesInView,
    scrollLocation,
    slides,
) {
    var ascItems = arrayKeys(slideSizesWithGaps);
    var descItems = arrayKeys(slideSizesWithGaps).reverse();
    var loopPoints = startPoints().concat(endPoints());

    function removeSlideSizes(indexes, from) {
        return indexes.reduce(function (a, i) {
            return a - slideSizesWithGaps[i];
        }, from);
    }

    function slidesInGap(indexes, gap) {
        return indexes.reduce(function (a, i) {
            var remainingGap = removeSlideSizes(a, gap);
            return remainingGap > 0 ? a.concat([i]) : a;
        }, []);
    }

    function findLoopPoints(indexes, edge) {
        var isStartEdge = edge === 'start';
        var offset = isStartEdge ? -contentSize : contentSize;
        var slideBounds = slidesInView.findSlideBounds([offset]);
        return indexes.map(function (index) {
            var initial = isStartEdge ? 0 : -contentSize;
            var altered = isStartEdge ? contentSize : 0;
            var bounds = slideBounds.filter(function (b) {
                return b.index === index;
            })[0];
            var point = bounds[isStartEdge ? 'end' : 'start'];

            var getTarget = function () {
                return scrollLocation.get() > point ? initial : altered;
            };

            return {
                point: point,
                getTarget: getTarget,
                index: index,
                location: -1,
            };
        });
    }

    function startPoints() {
        var gap = scrollSnaps[0] - 1;
        var indexes = slidesInGap(descItems, gap);
        return findLoopPoints(indexes, 'end');
    }

    function endPoints() {
        var gap = viewSize - scrollSnaps[0] - 1;
        var indexes = slidesInGap(ascItems, gap);
        return findLoopPoints(indexes, 'start');
    }

    function canLoop() {
        return loopPoints.every(function (_a) {
            var index = _a.index;
            var otherIndexes = ascItems.filter(function (i) {
                return i !== index;
            });
            return removeSlideSizes(otherIndexes, viewSize) <= 0;
        });
    }

    function loop() {
        loopPoints.forEach(function (loopPoint) {
            var getTarget = loopPoint.getTarget,
                location = loopPoint.location,
                index = loopPoint.index;
            var target = getTarget();

            if (target !== location) {
                slides[index].style[axis.startEdge] = target + '%';
                loopPoint.location = target;
            }
        });
    }

    function clear() {
        loopPoints.forEach(function (_a) {
            var index = _a.index;
            slides[index].style[axis.startEdge] = '';
        });
    }

    var self = {
        canLoop: canLoop,
        clear: clear,
        loop: loop,
        loopPoints: loopPoints,
    };
    return self;
}

function SlidesInView(
    viewSize,
    contentSize,
    slideSizes,
    snaps,
    limit,
    loop,
    inViewThreshold,
) {
    var removeOffset = limit.removeOffset,
        constrain = limit.constrain;
    var cachedThreshold = Math.min(Math.max(inViewThreshold, 0.01), 0.99);
    var cachedOffsets = loop ? [0, contentSize, -contentSize] : [0];
    var cachedBounds = findSlideBounds(cachedOffsets, cachedThreshold);

    function findSlideBounds(offsets, threshold) {
        var slideOffsets = offsets || cachedOffsets;
        var slideThreshold = threshold || 0;
        var thresholds = slideSizes.map(function (s) {
            return s * slideThreshold;
        });
        return slideOffsets.reduce(function (list, offset) {
            var bounds = snaps.map(function (snap, index) {
                return {
                    start:
                        snap - slideSizes[index] + thresholds[index] + offset,
                    end: snap + viewSize - thresholds[index] + offset,
                    index: index,
                };
            });
            return list.concat(bounds);
        }, []);
    }

    function check(location, bounds) {
        var limitedLocation = loop
            ? removeOffset(location)
            : constrain(location);
        var slideBounds = bounds || cachedBounds;
        return slideBounds.reduce(function (list, slideBound) {
            var index = slideBound.index,
                start = slideBound.start,
                end = slideBound.end;
            var inList = list.indexOf(index) !== -1;
            var inView = start < limitedLocation && end > limitedLocation;
            return !inList && inView ? list.concat([index]) : list;
        }, []);
    }

    var self = {
        check: check,
        findSlideBounds: findSlideBounds,
    };
    return self;
}

function SlideSizes(axis, pxToPercent, slides, slideRects, loop) {
    var measureSize = axis.measureSize,
        startEdge = axis.startEdge,
        endEdge = axis.endEdge;
    var sizesInPx = slideRects.map(measureSize);
    var slideSizes = sizesInPx.map(pxToPercent.measure);
    var slideSizesWithGaps = measureWithGaps();

    function measureWithGaps() {
        return slideRects
            .map(function (rect, index, rects) {
                var isLast = index === arrayLastIndex(rects);
                var style = window.getComputedStyle(arrayLast(slides));
                var endGap = parseFloat(
                    style.getPropertyValue('margin-' + endEdge),
                );
                if (isLast) return sizesInPx[index] + (loop ? endGap : 0);
                return rects[index + 1][startEdge] - rect[startEdge];
            })
            .map(pxToPercent.measure)
            .map(mathAbs);
    }

    var self = {
        slideSizes: slideSizes,
        slideSizesWithGaps: slideSizesWithGaps,
    };
    return self;
}

function Translate(axis, direction, container) {
    var translate = axis.scroll === 'x' ? x : y;
    var containerStyle = container.style;
    var disabled = false;

    function x(n) {
        return 'translate3d(' + n + '%,0px,0px)';
    }

    function y(n) {
        return 'translate3d(0px,' + n + '%,0px)';
    }

    function to(target) {
        if (disabled) return;
        containerStyle.transform = translate(direction.apply(target.get()));
    }

    function toggleActive(active) {
        disabled = !active;
    }

    function clear() {
        containerStyle.transform = '';
    }

    var self = {
        clear: clear,
        to: to,
        toggleActive: toggleActive,
    };
    return self;
}

function Engine(root, container, slides, options, events) {
    // Options
    var align = options.align,
        scrollAxis = options.axis,
        contentDirection = options.direction,
        startIndex = options.startIndex,
        inViewThreshold = options.inViewThreshold,
        loop = options.loop,
        speed = options.speed,
        dragFree = options.dragFree,
        slidesToScroll = options.slidesToScroll,
        skipSnaps = options.skipSnaps,
        containScroll = options.containScroll; // Measurements

    var containerRect = container.getBoundingClientRect();
    var slideRects = slides.map(function (slide) {
        return slide.getBoundingClientRect();
    });
    var direction = Direction(contentDirection);
    var axis = Axis(scrollAxis, contentDirection);
    var pxToPercent = PxToPercent(axis.measureSize(containerRect));
    var viewSize = pxToPercent.totalPercent;
    var alignment = Alignment(align, viewSize);

    var _a = SlideSizes(axis, pxToPercent, slides, slideRects, loop),
        slideSizes = _a.slideSizes,
        slideSizesWithGaps = _a.slideSizesWithGaps;

    var _b = ScrollSnap(
            axis,
            alignment,
            pxToPercent,
            containerRect,
            slideRects,
            slidesToScroll,
        ),
        snaps = _b.snaps,
        snapsAligned = _b.snapsAligned;

    var contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps);
    var snapsContained = ScrollContain(
        viewSize,
        contentSize,
        snaps,
        snapsAligned,
        containScroll,
    ).snapsContained;
    var contain = !loop && containScroll !== '';
    var scrollSnaps = contain ? snapsContained : snapsAligned;
    var limit = ScrollLimit(contentSize, scrollSnaps, loop).limit; // Indexes

    var index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop);
    var indexPrevious = index.clone();
    var slideIndexes = arrayKeys(slides); // Draw

    var update = function () {
        if (!loop)
            engine.scrollBounds.constrain(engine.dragHandler.pointerDown());
        engine.scrollBody.seek(target).update();
        var settled = engine.scrollBody.settle(target);

        if (settled && !engine.dragHandler.pointerDown()) {
            engine.animation.stop();
            events.emit('settle');
        }

        if (!settled) {
            events.emit('scroll');
        }

        if (loop) {
            engine.scrollLooper.loop(engine.scrollBody.direction());
            engine.slideLooper.loop();
        }

        engine.translate.to(location);
        engine.animation.proceed();
    }; // Shared

    var animation = Animation(update);
    var startLocation = scrollSnaps[index.get()];
    var location = Vector1D(startLocation);
    var target = Vector1D(startLocation);
    var scrollBody = ScrollBody(location, speed, 1);
    var scrollTarget = ScrollTarget(
        loop,
        scrollSnaps,
        contentSize,
        limit,
        target,
    );
    var scrollTo = ScrollTo(
        animation,
        index,
        indexPrevious,
        scrollTarget,
        target,
        events,
    );
    var slidesInView = SlidesInView(
        viewSize,
        contentSize,
        slideSizes,
        snaps,
        limit,
        loop,
        inViewThreshold,
    ); // DragHandler

    var dragHandler = DragHandler(
        axis,
        direction,
        root,
        target,
        dragFree,
        DragTracker(axis, pxToPercent),
        location,
        animation,
        scrollTo,
        scrollBody,
        scrollTarget,
        index,
        events,
        loop,
        skipSnaps,
    ); // Slider

    var engine = {
        containerRect: containerRect,
        slideRects: slideRects,
        animation: animation,
        axis: axis,
        direction: direction,
        dragHandler: dragHandler,
        eventStore: EventStore(),
        pxToPercent: pxToPercent,
        index: index,
        indexPrevious: indexPrevious,
        limit: limit,
        location: location,
        options: options,
        scrollBody: scrollBody,
        scrollBounds: ScrollBounds(limit, location, target, scrollBody),
        scrollLooper: ScrollLooper(contentSize, pxToPercent, limit, location, [
            location,
            target,
        ]),
        scrollProgress: ScrollProgress(limit),
        scrollSnaps: scrollSnaps,
        scrollTarget: scrollTarget,
        scrollTo: scrollTo,
        slideLooper: SlideLooper(
            axis,
            viewSize,
            contentSize,
            slideSizesWithGaps,
            scrollSnaps,
            slidesInView,
            location,
            slides,
        ),
        slidesInView: slidesInView,
        slideIndexes: slideIndexes,
        target: target,
        translate: Translate(axis, direction, container),
    };
    return engine;
}

function EventEmitter() {
    var listeners = {};

    function getListeners(evt) {
        return listeners[evt] || [];
    }

    function emit(evt) {
        getListeners(evt).forEach(function (e) {
            return e(evt);
        });
        return self;
    }

    function on(evt, cb) {
        listeners[evt] = getListeners(evt).concat([cb]);
        return self;
    }

    function off(evt, cb) {
        listeners[evt] = getListeners(evt).filter(function (e) {
            return e !== cb;
        });
        return self;
    }

    var self = {
        emit: emit,
        off: off,
        on: on,
    };
    return self;
}

var defaultOptions = {
    align: 'center',
    axis: 'x',
    containScroll: '',
    direction: 'ltr',
    dragFree: false,
    draggable: true,
    inViewThreshold: 0,
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
    speed: 10,
    startIndex: 0,
};

function OptionsPseudo(node) {
    var pseudoString = getComputedStyle(node, ':before').content;

    function get() {
        try {
            return JSON.parse(pseudoString.slice(1, -1).replace(/\\/g, ''));
        } catch (error) {} // eslint-disable-line no-empty

        return {};
    }

    var self = {
        get: get,
    };
    return self;
}

function EmblaCarousel(nodes, userOptions, userPlugins) {
    var events = EventEmitter();
    var debouncedResize = debounce(resize, 500);
    var reInit = reActivate;
    var on = events.on,
        off = events.off;
    var engine;
    var activated = false;
    var optionsBase = Object.assign(
        {},
        defaultOptions,
        EmblaCarousel.globalOptions,
    );
    var options = Object.assign({}, optionsBase);
    var optionsPseudo;
    var plugins;
    var rootSize = 0;
    var root;
    var container;
    var slides;

    function setupElements() {
        var providedContainer = 'container' in nodes && nodes.container;
        var providedSlides = 'slides' in nodes && nodes.slides;
        root = 'root' in nodes ? nodes.root : nodes;
        container = providedContainer || root.children[0];
        slides = providedSlides || [].slice.call(container.children);
        optionsPseudo = OptionsPseudo(root);
    }

    function activate(withOptions, withPlugins) {
        setupElements();
        optionsBase = Object.assign({}, optionsBase, withOptions);
        options = Object.assign({}, optionsBase, optionsPseudo.get());
        plugins = Object.assign([], withPlugins);
        engine = Engine(root, container, slides, options, events);
        engine.eventStore.add(window, 'resize', debouncedResize);
        engine.translate.to(engine.location);
        rootSize = engine.axis.measureSize(root.getBoundingClientRect());
        plugins.forEach(function (plugin) {
            return plugin.init(self);
        });

        if (options.loop) {
            if (!engine.slideLooper.canLoop()) {
                deActivate();
                return activate(
                    {
                        loop: false,
                    },
                    withPlugins,
                );
            }

            engine.slideLooper.loop();
        }

        if (options.draggable && container.offsetParent && slides.length) {
            engine.dragHandler.addActivationEvents();
        }

        if (!activated) {
            setTimeout(function () {
                return events.emit('init');
            }, 0);
            activated = true;
        }
    }

    function reActivate(withOptions, withPlugins) {
        if (!activated) return;
        var startIndex = selectedScrollSnap();
        var newOptions = Object.assign(
            {
                startIndex: startIndex,
            },
            withOptions,
        );
        deActivate();
        activate(newOptions, withPlugins || plugins);
        events.emit('reInit');
    }

    function deActivate() {
        engine.dragHandler.removeAllEvents();
        engine.animation.stop();
        engine.eventStore.removeAll();
        engine.translate.clear();
        engine.slideLooper.clear();
        plugins.forEach(function (plugin) {
            return plugin.destroy();
        });
    }

    function destroy() {
        if (!activated) return;
        deActivate();
        activated = false;
        events.emit('destroy');
    }

    function resize() {
        if (!activated) return;
        var size = engine.axis.measureSize(root.getBoundingClientRect());
        if (rootSize !== size) reActivate();
        events.emit('resize');
    }

    function slidesInView(target) {
        var location = engine[target ? 'target' : 'location'].get();
        var type = options.loop ? 'removeOffset' : 'constrain';
        return engine.slidesInView.check(engine.limit[type](location));
    }

    function slidesNotInView(target) {
        var inView = slidesInView(target);
        return engine.slideIndexes.filter(function (index) {
            return inView.indexOf(index) === -1;
        });
    }

    function scrollTo(index, jump, direction) {
        engine.scrollBody.useBaseMass().useSpeed(jump ? 100 : options.speed);
        if (activated) engine.scrollTo.index(index, direction || 0);
    }

    function scrollNext(jump) {
        var next = engine.index.clone().add(1);
        scrollTo(next.get(), jump === true, -1);
    }

    function scrollPrev(jump) {
        var prev = engine.index.clone().add(-1);
        scrollTo(prev.get(), jump === true, 1);
    }

    function canScrollNext() {
        var next = engine.index.clone().add(1);
        return next.get() !== selectedScrollSnap();
    }

    function canScrollPrev() {
        var prev = engine.index.clone().add(-1);
        return prev.get() !== selectedScrollSnap();
    }

    function scrollSnapList() {
        return engine.scrollSnaps.map(engine.scrollProgress.get);
    }

    function scrollProgress() {
        return engine.scrollProgress.get(engine.location.get());
    }

    function selectedScrollSnap() {
        return engine.index.get();
    }

    function previousScrollSnap() {
        return engine.indexPrevious.get();
    }

    function clickAllowed() {
        return engine.dragHandler.clickAllowed();
    }

    function internalEngine() {
        return engine;
    }

    function rootNode() {
        return root;
    }

    function containerNode() {
        return container;
    }

    function slideNodes() {
        return slides;
    }

    var self = {
        canScrollNext: canScrollNext,
        canScrollPrev: canScrollPrev,
        clickAllowed: clickAllowed,
        containerNode: containerNode,
        internalEngine: internalEngine,
        destroy: destroy,
        off: off,
        on: on,
        previousScrollSnap: previousScrollSnap,
        reInit: reInit,
        rootNode: rootNode,
        scrollNext: scrollNext,
        scrollPrev: scrollPrev,
        scrollProgress: scrollProgress,
        scrollSnapList: scrollSnapList,
        scrollTo: scrollTo,
        selectedScrollSnap: selectedScrollSnap,
        slideNodes: slideNodes,
        slidesInView: slidesInView,
        slidesNotInView: slidesNotInView,
    };
    activate(userOptions, userPlugins);
    return self;
}

EmblaCarousel.globalOptions = undefined;

function useEmblaCarousel(options, plugins) {
    if (options === void 0) {
        options = {};
    }

    if (plugins === void 0) {
        plugins = [];
    }

    var _a = useState(),
        embla = _a[0],
        setEmbla = _a[1];

    var _b = useState(),
        viewport = _b[0],
        setViewport = _b[1];

    var storedOptions = useRef(options);
    var storedPlugins = useRef(plugins);
    var activeOptions = useMemo(
        function () {
            if (!areObjectsEqualShallow(storedOptions.current, options)) {
                storedOptions.current = options;
            }

            return storedOptions.current;
        },
        [storedOptions, options],
    );
    var activePlugins = useMemo(
        function () {
            if (!arePluginsEqual(storedPlugins.current, plugins)) {
                storedPlugins.current = plugins;
            }

            return storedPlugins.current;
        },
        [storedPlugins, plugins],
    );
    useEffect(
        function () {
            if (canUseDOM() && viewport) {
                EmblaCarousel.globalOptions = useEmblaCarousel.globalOptions;
                var newEmbla_1 = EmblaCarousel(
                    viewport,
                    activeOptions,
                    activePlugins,
                );
                setEmbla(newEmbla_1);
                return function () {
                    return newEmbla_1.destroy();
                };
            } else {
                setEmbla(undefined);
            }
        },
        [viewport, activeOptions, activePlugins, setEmbla],
    );
    return [setViewport, embla];
}

useEmblaCarousel.globalOptions = undefined;

export default useEmblaCarousel;
//# sourceMappingURL=embla-carousel-react.esm.js.map
