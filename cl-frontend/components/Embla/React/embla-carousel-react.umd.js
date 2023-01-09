!(function (n, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = e(require('react')))
        : 'function' == typeof define && define.amd
        ? define(['react'], e)
        : ((n =
              'undefined' != typeof globalThis
                  ? globalThis
                  : n || self).EmblaCarouselReact = e(n.React));
})(this, function (n) {
    'use strict';
    function e(n, e) {
        return (
            Object.keys(n).length === Object.keys(e).length &&
            Object.keys(n).every(function (t) {
                return (
                    !!Object.prototype.hasOwnProperty.call(e, t) &&
                    n[t] === e[t]
                );
            })
        );
    }
    function t(n) {
        return n
            .concat()
            .sort(function (n, e) {
                return n.name > e.name ? 1 : -1;
            })
            .map(function (n) {
                return n.options;
            });
    }
    function r(n, e) {
        var t = {
            start: function () {
                return 0;
            },
            center: function (n) {
                return r(n) / 2;
            },
            end: r,
        };
        function r(n) {
            return e - n;
        }
        return {
            measure: function (r) {
                return 'number' == typeof n ? e * Number(n) : t[n](r);
            },
        };
    }
    function o(n) {
        return Math.abs(n);
    }
    function i(n) {
        return n ? n / o(n) : 0;
    }
    function u(n, e) {
        return o(n - e);
    }
    function c(n, e) {
        for (var t = [], r = 0; r < n.length; r += e) t.push(n.slice(r, r + e));
        return t;
    }
    function a(n) {
        return Object.keys(n).map(Number);
    }
    function s(n) {
        return n[f(n)];
    }
    function f(n) {
        return Math.max(0, n.length - 1);
    }
    function d(n, e) {
        var t = o(n - e);
        function r(e) {
            return e < n;
        }
        function i(n) {
            return n > e;
        }
        function u(n) {
            return r(n) || i(n);
        }
        return {
            length: t,
            max: e,
            min: n,
            constrain: function (t) {
                return u(t) ? (r(t) ? n : e) : t;
            },
            reachedAny: u,
            reachedMax: i,
            reachedMin: r,
            removeOffset: function (n) {
                return t ? n - t * Math.ceil((n - e) / t) : n;
            },
        };
    }
    function l(n, e, t) {
        var r = d(0, n),
            i = r.min,
            u = r.constrain,
            c = n + 1,
            a = s(e);
        function s(n) {
            return t ? o((c + n) % c) : u(n);
        }
        function f() {
            return a;
        }
        function p(n) {
            return (a = s(n)), m;
        }
        var m = {
            add: function (n) {
                return p(f() + n);
            },
            clone: function () {
                return l(n, f(), t);
            },
            get: f,
            set: p,
            min: i,
            max: n,
        };
        return m;
    }
    function p() {
        var n = [];
        var e = {
            add: function (t, r, o, i) {
                return (
                    void 0 === i && (i = !1),
                    t.addEventListener(r, o, i),
                    n.push(function () {
                        return t.removeEventListener(r, o, i);
                    }),
                    e
                );
            },
            removeAll: function () {
                return (
                    (n = n.filter(function (n) {
                        return n();
                    })),
                    e
                );
            },
        };
        return e;
    }
    function m(n) {
        var e = n;
        function t(n) {
            return (e /= n), o;
        }
        function r(n) {
            return 'number' == typeof n ? n : n.get();
        }
        var o = {
            add: function (n) {
                return (e += r(n)), o;
            },
            divide: t,
            get: function () {
                return e;
            },
            multiply: function (n) {
                return (e *= n), o;
            },
            normalize: function () {
                return 0 !== e && t(e), o;
            },
            set: function (n) {
                return (e = r(n)), o;
            },
            subtract: function (n) {
                return (e -= r(n)), o;
            },
        };
        return o;
    }
    function v(n, e, t, r, c, a, s, f, d, l, v, g, x, h, y) {
        var S = n.cross,
            b = ['INPUT', 'SELECT', 'TEXTAREA'],
            w = m(0),
            E = p(),
            O = p(),
            A = { mouse: 300, touch: 400 },
            M = { mouse: 500, touch: 600 },
            T = c ? 5 : 16,
            P = 0,
            B = 0,
            I = !1,
            k = !1,
            z = !1,
            D = !1;
        function L(n) {
            if (!(D = 'mousedown' === n.type) || 0 === n.button) {
                var e,
                    o,
                    i = u(r.get(), s.get()) >= 2,
                    c = D || !i,
                    f =
                        ((e = n.target),
                        (o = e.nodeName || ''),
                        !(b.indexOf(o) > -1)),
                    d = i || (D && f);
                (I = !0),
                    a.pointerDown(n),
                    w.set(r),
                    r.set(s),
                    l.useBaseMass().useSpeed(80),
                    (function () {
                        var n = D ? document : t;
                        O.add(n, 'touchmove', j)
                            .add(n, 'touchend', N)
                            .add(n, 'mousemove', j)
                            .add(n, 'mouseup', N);
                    })(),
                    (P = a.readPoint(n)),
                    (B = a.readPoint(n, S)),
                    x.emit('pointerDown'),
                    c && (z = !1),
                    d && n.preventDefault();
            }
        }
        function j(n) {
            if (!k && !D) {
                if (!n.cancelable) return N(n);
                var t = a.readPoint(n),
                    o = a.readPoint(n, S),
                    i = u(t, P),
                    c = u(o, B);
                if (!(k = i > c) && !z) return N(n);
            }
            var s = a.pointerMove(n);
            !z && s && (z = !0),
                f.start(),
                r.add(e.apply(s)),
                n.preventDefault();
        }
        function N(n) {
            var t = v.byDistance(0, !1).index !== g.get(),
                s = a.pointerUp(n) * (c ? M : A)[D ? 'mouse' : 'touch'],
                f = (function (n, e) {
                    var t = g.clone().add(-1 * i(n)),
                        r = t.get() === g.min || t.get() === g.max,
                        u = v.byDistance(n, !c).distance;
                    return c || o(n) < 20
                        ? u
                        : !h && r
                        ? 0.4 * u
                        : y && e
                        ? 0.5 * u
                        : v.byIndex(t.get(), 0).distance;
                })(e.apply(s), t),
                p = (function (n, e) {
                    if (0 === n || 0 === e) return 0;
                    if (o(n) <= o(e)) return 0;
                    var t = u(o(n), o(e));
                    return o(t / n);
                })(s, f),
                m = u(r.get(), w.get()) >= 0.5,
                S = t && p > 0.75,
                b = o(s) < 20,
                E = S ? 10 : T,
                P = S ? 1 + 2.5 * p : 1;
            m && !D && (z = !0),
                (k = !1),
                (I = !1),
                O.removeAll(),
                l.useSpeed(b ? 9 : E).useMass(P),
                d.distance(f, !c),
                (D = !1),
                x.emit('pointerUp');
        }
        function R(n) {
            z && n.preventDefault();
        }
        return {
            addActivationEvents: function () {
                var n = t;
                E.add(n, 'touchmove', function () {})
                    .add(n, 'touchend', function () {})
                    .add(n, 'touchstart', L)
                    .add(n, 'mousedown', L)
                    .add(n, 'touchcancel', N)
                    .add(n, 'contextmenu', N)
                    .add(n, 'click', R);
            },
            clickAllowed: function () {
                return !z;
            },
            pointerDown: function () {
                return I;
            },
            removeAllEvents: function () {
                E.removeAll(), O.removeAll();
            },
        };
    }
    function g(n, e, t) {
        var r,
            o,
            u =
                ((r = 2),
                (o = Math.pow(10, r)),
                function (n) {
                    return Math.round(n * o) / o;
                }),
            c = m(0),
            a = m(0),
            s = m(0),
            f = 0,
            d = e,
            l = t;
        function p(n) {
            return (d = n), g;
        }
        function v(n) {
            return (l = n), g;
        }
        var g = {
            direction: function () {
                return f;
            },
            seek: function (e) {
                s.set(e).subtract(n);
                var t,
                    r,
                    o,
                    u,
                    p =
                        ((t = s.get()),
                        (o = 0) + ((t - (r = 0)) / (100 - r)) * (d - o));
                return (
                    (f = i(s.get())),
                    s.normalize().multiply(p).subtract(c),
                    (u = s).divide(l),
                    a.add(u),
                    g
                );
            },
            settle: function (e) {
                var t = e.get() - n.get(),
                    r = !u(t);
                return r && n.set(e), r;
            },
            update: function () {
                c.add(a), n.add(c), a.multiply(0);
            },
            useBaseMass: function () {
                return v(t);
            },
            useBaseSpeed: function () {
                return p(e);
            },
            useMass: v,
            useSpeed: p,
        };
        return g;
    }
    function x(n, e, t, r) {
        var i = !1;
        return {
            constrain: function (u) {
                if (!i && n.reachedAny(t.get()) && n.reachedAny(e.get())) {
                    var c = n.reachedMin(e.get()) ? 'min' : 'max',
                        a = o(n[c] - e.get()),
                        s = t.get() - e.get(),
                        f = Math.min(a / 50, 0.85);
                    t.subtract(s * f),
                        !u &&
                            o(s) < 10 &&
                            (t.set(n.constrain(t.get())),
                            r.useSpeed(10).useMass(3));
                }
            },
            toggleActive: function (n) {
                i = !n;
            },
        };
    }
    function h(n, e, t, r, o) {
        var i = d(-e + n, t[0]),
            u = r.map(i.constrain);
        return {
            snapsContained: (function () {
                if (e <= n) return [i.max];
                if ('keepSnaps' === o) return u;
                var t = (function () {
                        var n = u[0],
                            e = s(u),
                            t = u.lastIndexOf(n),
                            r = u.indexOf(e) + 1;
                        return d(t, r);
                    })(),
                    r = t.min,
                    c = t.max;
                return u.slice(r, c);
            })(),
        };
    }
    function y(n, e, t, r, o) {
        var i = d(t.min + e.measure(0.1), t.max + e.measure(0.1)),
            u = i.reachedMin,
            c = i.reachedMax;
        return {
            loop: function (e) {
                if (
                    (function (n) {
                        return 1 === n ? c(r.get()) : -1 === n && u(r.get());
                    })(e)
                ) {
                    var t = n * (-1 * e);
                    o.forEach(function (n) {
                        return n.add(t);
                    });
                }
            },
        };
    }
    function S(n) {
        var e = n.max,
            t = n.length;
        return {
            get: function (n) {
                return (n - e) / -t;
            },
        };
    }
    function b(n, e, t, r, i, u) {
        var a,
            f,
            d = n.startEdge,
            l = n.endEdge,
            p = i
                .map(function (n) {
                    return r[d] - n[d];
                })
                .map(t.measure)
                .map(function (n) {
                    return -o(n);
                }),
            m =
                ((a = c(p, u).map(function (n) {
                    return n[0];
                })),
                (f = c(i, u)
                    .map(function (n) {
                        return s(n)[l] - n[0][d];
                    })
                    .map(t.measure)
                    .map(o)
                    .map(e.measure)),
                a.map(function (n, e) {
                    return n + f[e];
                }));
        return { snaps: p, snapsAligned: m };
    }
    function w(n, e, t, r, i) {
        var u = r.reachedAny,
            c = r.removeOffset,
            a = r.constrain;
        function s(n, e) {
            return o(n) < o(e) ? n : e;
        }
        function f(e, r) {
            var i = e,
                u = e + t,
                c = e - t;
            return n ? (r ? o(s(i, 1 === r ? u : c)) * r : s(s(i, u), c)) : i;
        }
        return {
            byDistance: function (t, r) {
                var s = i.get() + t,
                    d = (function (t) {
                        var r = n ? c(t) : a(t);
                        return {
                            index: e
                                .map(function (n) {
                                    return n - r;
                                })
                                .map(function (n) {
                                    return f(n, 0);
                                })
                                .map(function (n, e) {
                                    return { diff: n, index: e };
                                })
                                .sort(function (n, e) {
                                    return o(n.diff) - o(e.diff);
                                })[0].index,
                            distance: r,
                        };
                    })(s),
                    l = d.index,
                    p = d.distance,
                    m = !n && u(s);
                return !r || m
                    ? { index: l, distance: t }
                    : { index: l, distance: t + f(e[l] - p, 0) };
            },
            byIndex: function (n, t) {
                return { index: n, distance: f(e[n] - i.get(), t) };
            },
            shortcut: f,
        };
    }
    function E(n, e, t, r, o, i, u, c) {
        var s,
            f = a(r),
            d = a(r).reverse(),
            l = ((s = o[0] - 1), v(m(d, s), 'end')).concat(
                (function () {
                    var n = e - o[0] - 1;
                    return v(m(f, n), 'start');
                })(),
            );
        function p(n, e) {
            return n.reduce(function (n, e) {
                return n - r[e];
            }, e);
        }
        function m(n, e) {
            return n.reduce(function (n, t) {
                return p(n, e) > 0 ? n.concat([t]) : n;
            }, []);
        }
        function v(n, e) {
            var r = 'start' === e,
                o = r ? -t : t,
                c = i.findSlideBounds([o]);
            return n.map(function (n) {
                var e = r ? 0 : -t,
                    o = r ? t : 0,
                    i = c.filter(function (e) {
                        return e.index === n;
                    })[0][r ? 'end' : 'start'];
                return {
                    point: i,
                    getTarget: function () {
                        return u.get() > i ? e : o;
                    },
                    index: n,
                    location: -1,
                };
            });
        }
        return {
            canLoop: function () {
                return l.every(function (n) {
                    var t = n.index;
                    return (
                        p(
                            f.filter(function (n) {
                                return n !== t;
                            }),
                            e,
                        ) <= 0
                    );
                });
            },
            clear: function () {
                l.forEach(function (e) {
                    var t = e.index;
                    c[t].style[n.startEdge] = '';
                });
            },
            loop: function () {
                l.forEach(function (e) {
                    var t = e.getTarget,
                        r = e.location,
                        o = e.index,
                        i = t();
                    i !== r &&
                        ((c[o].style[n.startEdge] = i + '%'), (e.location = i));
                });
            },
            loopPoints: l,
        };
    }
    function O(n, e, t) {
        var r =
                'x' === n.scroll
                    ? function (n) {
                          return 'translate3d(' + n + '%,0px,0px)';
                      }
                    : function (n) {
                          return 'translate3d(0px,' + n + '%,0px)';
                      },
            o = t.style,
            i = !1;
        return {
            clear: function () {
                o.transform = '';
            },
            to: function (n) {
                i || (o.transform = r(e.apply(n.get())));
            },
            toggleActive: function (n) {
                i = !n;
            },
        };
    }
    function A(n, e, t, i, u) {
        var c,
            A = i.align,
            M = i.axis,
            T = i.direction,
            P = i.startIndex,
            B = i.inViewThreshold,
            I = i.loop,
            k = i.speed,
            z = i.dragFree,
            D = i.slidesToScroll,
            L = i.skipSnaps,
            j = i.containScroll,
            N = e.getBoundingClientRect(),
            R = t.map(function (n) {
                return n.getBoundingClientRect();
            }),
            C = (function (n) {
                var e = 'rtl' === n ? -1 : 1;
                return {
                    apply: function (n) {
                        return n * e;
                    },
                };
            })(T),
            V = (function (n, e) {
                var t = 'y' === n ? 'y' : 'x';
                return {
                    scroll: t,
                    cross: 'y' === n ? 'x' : 'y',
                    startEdge:
                        'y' === t ? 'top' : 'rtl' === e ? 'right' : 'left',
                    endEdge:
                        'y' === t ? 'bottom' : 'rtl' === e ? 'left' : 'right',
                    measureSize: function (n) {
                        var e = n.width,
                            r = n.height;
                        return 'x' === t ? e : r;
                    },
                };
            })(M, T),
            H =
                ((c = V.measureSize(N)),
                {
                    measure: function (n) {
                        return 0 === c ? 0 : (n / c) * 100;
                    },
                    totalPercent: 100,
                }),
            F = H.totalPercent,
            U = r(A, F),
            q = (function (n, e, t, r, i) {
                var u = n.measureSize,
                    c = n.startEdge,
                    a = n.endEdge,
                    d = r.map(u);
                return {
                    slideSizes: d.map(e.measure),
                    slideSizesWithGaps: r
                        .map(function (n, e, r) {
                            var o = e === f(r),
                                u = window.getComputedStyle(s(t)),
                                l = parseFloat(
                                    u.getPropertyValue('margin-' + a),
                                );
                            return o ? d[e] + (i ? l : 0) : r[e + 1][c] - n[c];
                        })
                        .map(e.measure)
                        .map(o),
                };
            })(V, H, t, R, I),
            G = q.slideSizes,
            W = q.slideSizesWithGaps,
            X = b(V, U, H, N, R, D),
            J = X.snaps,
            Y = X.snapsAligned,
            K = -s(J) + s(W),
            Q = h(F, K, J, Y, j).snapsContained,
            Z = !I && '' !== j ? Q : Y,
            $ = (function (n, e, t) {
                var r, o;
                return { limit: ((r = e[0]), (o = s(e)), d(t ? r - n : o, r)) };
            })(K, Z, I).limit,
            _ = l(f(Z), P, I),
            nn = _.clone(),
            en = a(t),
            tn = (function (n) {
                var e = 0;
                function t(n, t) {
                    return function () {
                        n === !!e && t();
                    };
                }
                function r() {
                    e = window.requestAnimationFrame(n);
                }
                return {
                    proceed: t(!0, r),
                    start: t(!1, r),
                    stop: t(!0, function () {
                        window.cancelAnimationFrame(e), (e = 0);
                    }),
                };
            })(function () {
                I || dn.scrollBounds.constrain(dn.dragHandler.pointerDown()),
                    dn.scrollBody.seek(un).update();
                var n = dn.scrollBody.settle(un);
                n &&
                    !dn.dragHandler.pointerDown() &&
                    (dn.animation.stop(), u.emit('settle')),
                    n || u.emit('scroll'),
                    I &&
                        (dn.scrollLooper.loop(dn.scrollBody.direction()),
                        dn.slideLooper.loop()),
                    dn.translate.to(on),
                    dn.animation.proceed();
            }),
            rn = Z[_.get()],
            on = m(rn),
            un = m(rn),
            cn = g(on, k, 1),
            an = w(I, Z, K, $, un),
            sn = (function (n, e, t, r, o, i) {
                function u(r) {
                    var u = r.distance,
                        c = r.index !== e.get();
                    u && (n.start(), o.add(u)),
                        c && (t.set(e.get()), e.set(r.index), i.emit('select'));
                }
                return {
                    distance: function (n, e) {
                        u(r.byDistance(n, e));
                    },
                    index: function (n, t) {
                        var o = e.clone().set(n);
                        u(r.byIndex(o.get(), t));
                    },
                };
            })(tn, _, nn, an, un, u),
            fn = (function (n, e, t, r, o, i, u) {
                var c = o.removeOffset,
                    a = o.constrain,
                    s = Math.min(Math.max(u, 0.01), 0.99),
                    f = i ? [0, e, -e] : [0],
                    d = l(f, s);
                function l(e, o) {
                    var i = e || f,
                        u = o || 0,
                        c = t.map(function (n) {
                            return n * u;
                        });
                    return i.reduce(function (e, o) {
                        var i = r.map(function (e, r) {
                            return {
                                start: e - t[r] + c[r] + o,
                                end: e + n - c[r] + o,
                                index: r,
                            };
                        });
                        return e.concat(i);
                    }, []);
                }
                return {
                    check: function (n, e) {
                        var t = i ? c(n) : a(n);
                        return (e || d).reduce(function (n, e) {
                            var r = e.index,
                                o = e.start,
                                i = e.end;
                            return -1 === n.indexOf(r) && o < t && i > t
                                ? n.concat([r])
                                : n;
                        }, []);
                    },
                    findSlideBounds: l,
                };
            })(F, K, G, J, $, I, B),
            dn = {
                containerRect: N,
                slideRects: R,
                animation: tn,
                axis: V,
                direction: C,
                dragHandler: v(
                    V,
                    C,
                    n,
                    un,
                    z,
                    (function (n, e) {
                        var t, r;
                        function i(n) {
                            return (
                                'undefined' != typeof TouchEvent &&
                                n instanceof TouchEvent
                            );
                        }
                        function u(n) {
                            return n.timeStamp;
                        }
                        function c(e, t) {
                            var r =
                                'client' +
                                ('x' === (t || n.scroll) ? 'X' : 'Y');
                            return (i(e) ? e.touches[0] : e)[r];
                        }
                        return {
                            isTouchEvent: i,
                            pointerDown: function (n) {
                                return (t = n), (r = n), e.measure(c(n));
                            },
                            pointerMove: function (n) {
                                var o = c(n) - c(r),
                                    i = u(n) - u(t) > 170;
                                return (r = n), i && (t = n), e.measure(o);
                            },
                            pointerUp: function (n) {
                                if (!t || !r) return 0;
                                var i = c(r) - c(t),
                                    a = u(n) - u(t),
                                    s = u(n) - u(r) > 170,
                                    f = i / a;
                                return a && !s && o(f) > 0.1 ? e.measure(f) : 0;
                            },
                            readPoint: c,
                        };
                    })(V, H),
                    on,
                    tn,
                    sn,
                    cn,
                    an,
                    _,
                    u,
                    I,
                    L,
                ),
                eventStore: p(),
                pxToPercent: H,
                index: _,
                indexPrevious: nn,
                limit: $,
                location: on,
                options: i,
                scrollBody: cn,
                scrollBounds: x($, on, un, cn),
                scrollLooper: y(K, H, $, on, [on, un]),
                scrollProgress: S($),
                scrollSnaps: Z,
                scrollTarget: an,
                scrollTo: sn,
                slideLooper: E(V, F, K, W, Z, fn, on, t),
                slidesInView: fn,
                slideIndexes: en,
                target: un,
                translate: O(V, C, e),
            };
        return dn;
    }
    var M = {
        align: 'center',
        axis: 'x',
        containScroll: '',
        direction: 'ltr',
        dragFree: !1,
        draggable: !0,
        inViewThreshold: 0,
        loop: !1,
        skipSnaps: !1,
        slidesToScroll: 1,
        speed: 10,
        startIndex: 0,
    };
    function T(n, e, t) {
        var r,
            o,
            i,
            u,
            c,
            a,
            s,
            f,
            d,
            l = (function () {
                var n = {};
                function e(e) {
                    return n[e] || [];
                }
                var t = {
                    emit: function (n) {
                        return (
                            e(n).forEach(function (e) {
                                return e(n);
                            }),
                            t
                        );
                    },
                    off: function (r, o) {
                        return (
                            (n[r] = e(r).filter(function (n) {
                                return n !== o;
                            })),
                            t
                        );
                    },
                    on: function (r, o) {
                        return (n[r] = e(r).concat([o])), t;
                    },
                };
                return t;
            })(),
            p =
                ((r = function () {
                    if (x) {
                        var n = u.axis.measureSize(s.getBoundingClientRect());
                        S !== n && E(), l.emit('resize');
                    }
                }),
                (o = 500),
                (i = 0),
                function () {
                    window.clearTimeout(i), (i = window.setTimeout(r, o) || 0);
                }),
            m = E,
            v = l.on,
            g = l.off,
            x = !1,
            h = Object.assign({}, M, T.globalOptions),
            y = Object.assign({}, h),
            S = 0;
        function b() {
            var e,
                t = 'container' in n && n.container,
                r = 'slides' in n && n.slides;
            (s = 'root' in n ? n.root : n),
                (f = t || s.children[0]),
                (d = r || [].slice.call(f.children)),
                (e = getComputedStyle(s, ':before').content),
                (c = {
                    get: function () {
                        try {
                            return JSON.parse(
                                e.slice(1, -1).replace(/\\/g, ''),
                            );
                        } catch (n) {}
                        return {};
                    },
                });
        }
        function w(n, e) {
            if (
                (b(),
                (h = Object.assign({}, h, n)),
                (y = Object.assign({}, h, c.get())),
                (a = Object.assign([], e)),
                (u = A(s, f, d, y, l)).eventStore.add(window, 'resize', p),
                u.translate.to(u.location),
                (S = u.axis.measureSize(s.getBoundingClientRect())),
                a.forEach(function (n) {
                    return n.init(k);
                }),
                y.loop)
            ) {
                if (!u.slideLooper.canLoop()) return O(), w({ loop: !1 }, e);
                u.slideLooper.loop();
            }
            y.draggable &&
                f.offsetParent &&
                d.length &&
                u.dragHandler.addActivationEvents(),
                x ||
                    (setTimeout(function () {
                        return l.emit('init');
                    }, 0),
                    (x = !0));
        }
        function E(n, e) {
            if (x) {
                var t = I(),
                    r = Object.assign({ startIndex: t }, n);
                O(), w(r, e || a), l.emit('reInit');
            }
        }
        function O() {
            u.dragHandler.removeAllEvents(),
                u.animation.stop(),
                u.eventStore.removeAll(),
                u.translate.clear(),
                u.slideLooper.clear(),
                a.forEach(function (n) {
                    return n.destroy();
                });
        }
        function P(n) {
            var e = u[n ? 'target' : 'location'].get(),
                t = y.loop ? 'removeOffset' : 'constrain';
            return u.slidesInView.check(u.limit[t](e));
        }
        function B(n, e, t) {
            u.scrollBody.useBaseMass().useSpeed(e ? 100 : y.speed),
                x && u.scrollTo.index(n, t || 0);
        }
        function I() {
            return u.index.get();
        }
        var k = {
            canScrollNext: function () {
                return u.index.clone().add(1).get() !== I();
            },
            canScrollPrev: function () {
                return u.index.clone().add(-1).get() !== I();
            },
            clickAllowed: function () {
                return u.dragHandler.clickAllowed();
            },
            containerNode: function () {
                return f;
            },
            internalEngine: function () {
                return u;
            },
            destroy: function () {
                x && (O(), (x = !1), l.emit('destroy'));
            },
            off: g,
            on: v,
            previousScrollSnap: function () {
                return u.indexPrevious.get();
            },
            reInit: m,
            rootNode: function () {
                return s;
            },
            scrollNext: function (n) {
                B(u.index.clone().add(1).get(), !0 === n, -1);
            },
            scrollPrev: function (n) {
                B(u.index.clone().add(-1).get(), !0 === n, 1);
            },
            scrollProgress: function () {
                return u.scrollProgress.get(u.location.get());
            },
            scrollSnapList: function () {
                return u.scrollSnaps.map(u.scrollProgress.get);
            },
            scrollTo: B,
            selectedScrollSnap: I,
            slideNodes: function () {
                return d;
            },
            slidesInView: P,
            slidesNotInView: function (n) {
                var e = P(n);
                return u.slideIndexes.filter(function (n) {
                    return -1 === e.indexOf(n);
                });
            },
        };
        return w(e, t), k;
    }
    function P(r, o) {
        void 0 === r && (r = {}), void 0 === o && (o = []);
        var i = n.useState(),
            u = i[0],
            c = i[1],
            a = n.useState(),
            s = a[0],
            f = a[1],
            d = n.useRef(r),
            l = n.useRef(o),
            p = n.useMemo(
                function () {
                    return e(d.current, r) || (d.current = r), d.current;
                },
                [d, r],
            ),
            m = n.useMemo(
                function () {
                    return (
                        (function (n, r) {
                            if (n.length !== r.length) return !1;
                            var o = t(n),
                                i = t(r);
                            return o.every(function (n, t) {
                                return e(n, i[t]);
                            });
                        })(l.current, o) || (l.current = o),
                        l.current
                    );
                },
                [l, o],
            );
        return (
            n.useEffect(
                function () {
                    if (
                        'undefined' != typeof window &&
                        window.document &&
                        window.document.createElement &&
                        s
                    ) {
                        T.globalOptions = P.globalOptions;
                        var n = T(s, p, m);
                        return (
                            c(n),
                            function () {
                                return n.destroy();
                            }
                        );
                    }
                    c(void 0);
                },
                [s, p, m, c],
            ),
            [f, u]
        );
    }
    return (T.globalOptions = void 0), (P.globalOptions = void 0), P;
});
