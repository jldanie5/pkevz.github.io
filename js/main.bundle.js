var dat = [];
!function(t) {
    var e = {};
    function n(r) {
        if (e[r])
            return e[r].exports;
        var i = e[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return t[r].call(i.exports, i, i.exports, n),
        i.l = !0,
        i.exports
    }
    n.m = t,
    n.c = e,
    n.d = function(t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: r
        })
    }
    ,
    n.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(t, e) {
        if (1 & e && (t = n(t)),
        8 & e)
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule)
            return t;
        var r = Object.create(null);
        if (n.r(r),
        Object.defineProperty(r, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var i in t)
                n.d(r, i, function(e) {
                    return t[e]
                }
                .bind(null, i));
        return r
    }
    ,
    n.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return n.d(e, "a", e),
        e
    }
    ,
    n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    n.p = "",
    n(n.s = 5)
}([function(t, e, n) {
    "use strict";
    function r(t) {
        if (this.size = 0 | t,
        this.size <= 1 || 0 != (this.size & this.size - 1))
            throw new Error("FFT size must be a power of two and bigger than 1");
        this._csize = t << 1;
        for (var e = new Array(2 * this.size), n = 0; n < e.length; n += 2) {
            const t = Math.PI * n / this.size;
            e[n] = Math.cos(t),
            e[n + 1] = -Math.sin(t)
        }
        this.table = e;
        for (var r = 0, i = 1; this.size > i; i <<= 1)
            r++;
        this._width = r % 2 == 0 ? r - 1 : r,
        this._bitrev = new Array(1 << this._width);
        for (var o = 0; o < this._bitrev.length; o++) {
            this._bitrev[o] = 0;
            for (var a = 0; a < this._width; a += 2) {
                var y = this._width - a - 2;
                this._bitrev[o] |= (o >>> a & 3) << y
            }
        }
        this._out = null,
        this._data = null,
        this._inv = 0
    }
    t.exports = r,
    r.prototype.fromComplexArray = function(t, e) {
        for (var n = e || new Array(t.length >>> 1), r = 0; r < t.length; r += 2)
            n[r >>> 1] = t[r];
        return n
    }
    ,
    r.prototype.createComplexArray = function() {
        const t = new Array(this._csize);
        for (var e = 0; e < t.length; e++)
            t[e] = 0;
        return t
    }
    ,
    r.prototype.toComplexArray = function(t, e) {
        for (var n = e || this.createComplexArray(), r = 0; r < n.length; r += 2)
            n[r] = t[r >>> 1],
            n[r + 1] = 0;
        return n
    }
    ,
    r.prototype.completeSpectrum = function(t) {
        for (var e = this._csize, n = e >>> 1, r = 2; r < n; r += 2)
            t[e - r] = t[r],
            t[e - r + 1] = -t[r + 1]
    }
    ,
    r.prototype.transform = function(t, e) {
        if (t === e)
            throw new Error("Input and output buffers must be different");
        this._out = t,
        this._data = e,
        this._inv = 0,
        this._transform4(),
        this._out = null,
        this._data = null
    }
    ,
    r.prototype.realTransform = function(t, e) {
        if (t === e)
            throw new Error("Input and output buffers must be different");
        this._out = t,
        this._data = e,
        this._inv = 0,
        this._realTransform4(),
        this._out = null,
        this._data = null
    }
    ,
    r.prototype.inverseTransform = function(t, e) {
        if (t === e)
            throw new Error("Input and output buffers must be different");
        this._out = t,
        this._data = e,
        this._inv = 1,
        this._transform4();
        for (var n = 0; n < t.length; n++)
            t[n] /= this.size;
        this._out = null,
        this._data = null
    }
    ,
    r.prototype._transform4 = function() {
        var t, e, n = this._out, r = this._csize, i = 1 << this._width, o = r / i << 1, a = this._bitrev;
        if (4 === o)
            for (t = 0,
            e = 0; t < r; t += o,
            e++) {
                const n = a[e];
                this._singleTransform2(t, n, i)
            }
        else
            for (t = 0,
            e = 0; t < r; t += o,
            e++) {
                const n = a[e];
                this._singleTransform4(t, n, i)
            }
        var y = this._inv ? -1 : 1
          , u = this.table;
        for (i >>= 2; i >= 2; i >>= 2) {
            var c = (o = r / i << 1) >>> 2;
            for (t = 0; t < r; t += o)
                for (var s = t + c, l = t, x = 0; l < s; l += 2,
                x += i) {
                    const t = l
                      , e = t + c
                      , r = e + c
                      , i = r + c
                      , o = n[t]
                      , a = n[t + 1]
                      , s = n[e]
                      , f = n[e + 1]
                      , h = n[r]
                      , p = n[r + 1]
                      , m = n[i]
                      , d = n[i + 1]
                      , v = o
                      , g = a
                      , b = u[x]
                      , w = y * u[x + 1]
                      , A = s * b - f * w
                      , P = s * w + f * b
                      , S = u[2 * x]
                      , O = y * u[2 * x + 1]
                      , E = h * S - p * O
                      , _ = h * O + p * S
                      , k = u[3 * x]
                      , j = y * u[3 * x + 1]
                      , M = m * k - d * j
                      , I = m * j + d * k
                      , T = v + E
                      , C = g + _
                      , D = v - E
                      , R = g - _
                      , B = A + M
                      , z = P + I
                      , F = y * (A - M)
                      , L = y * (P - I)
                      , U = T + B
                      , W = C + z
                      , Q = T - B
                      , q = C - z
                      , Y = D + L
                      , X = R - F
                      , H = D - L
                      , V = R + F;
                    n[t] = U,
                    n[t + 1] = W,
                    n[e] = Y,
                    n[e + 1] = X,
                    n[r] = Q,
                    n[r + 1] = q,
                    n[i] = H,
                    n[i + 1] = V
                }
        }
    }
    ,
    r.prototype._singleTransform2 = function(t, e, n) {
        const r = this._out
          , i = this._data
          , o = i[e]
          , a = i[e + 1]
          , y = i[e + n]
          , u = i[e + n + 1]
          , c = o + y
          , s = a + u
          , l = o - y
          , x = a - u;
        r[t] = c,
        r[t + 1] = s,
        r[t + 2] = l,
        r[t + 3] = x
    }
    ,
    r.prototype._singleTransform4 = function(t, e, n) {
        const r = this._out
          , i = this._data
          , o = this._inv ? -1 : 1
          , a = 2 * n
          , y = 3 * n
          , u = i[e]
          , c = i[e + 1]
          , s = i[e + n]
          , l = i[e + n + 1]
          , x = i[e + a]
          , f = i[e + a + 1]
          , h = i[e + y]
          , p = i[e + y + 1]
          , m = u + x
          , d = c + f
          , v = u - x
          , g = c - f
          , b = s + h
          , w = l + p
          , A = o * (s - h)
          , P = o * (l - p)
          , S = m + b
          , O = d + w
          , E = v + P
          , _ = g - A
          , k = m - b
          , j = d - w
          , M = v - P
          , I = g + A;
        r[t] = S,
        r[t + 1] = O,
        r[t + 2] = E,
        r[t + 3] = _,
        r[t + 4] = k,
        r[t + 5] = j,
        r[t + 6] = M,
        r[t + 7] = I
    }
    ,
    r.prototype._realTransform4 = function() {
        var t, e, n = this._out, r = this._csize, i = 1 << this._width, o = r / i << 1, a = this._bitrev;
        if (4 === o)
            for (t = 0,
            e = 0; t < r; t += o,
            e++) {
                const n = a[e];
                this._singleRealTransform2(t, n >>> 1, i >>> 1)
            }
        else
            for (t = 0,
            e = 0; t < r; t += o,
            e++) {
                const n = a[e];
                this._singleRealTransform4(t, n >>> 1, i >>> 1)
            }
        var y = this._inv ? -1 : 1
          , u = this.table;
        for (i >>= 2; i >= 2; i >>= 2) {
            var c = (o = r / i << 1) >>> 1
              , s = c >>> 1
              , l = s >>> 1;
            for (t = 0; t < r; t += o)
                for (var x = 0, f = 0; x <= l; x += 2,
                f += i) {
                    var h = t + x
                      , p = h + s
                      , m = p + s
                      , d = m + s
                      , v = n[h]
                      , g = n[h + 1]
                      , b = n[p]
                      , w = n[p + 1]
                      , A = n[m]
                      , P = n[m + 1]
                      , S = n[d]
                      , O = n[d + 1]
                      , E = v
                      , _ = g
                      , k = u[f]
                      , j = y * u[f + 1]
                      , M = b * k - w * j
                      , I = b * j + w * k
                      , T = u[2 * f]
                      , C = y * u[2 * f + 1]
                      , D = A * T - P * C
                      , R = A * C + P * T
                      , B = u[3 * f]
                      , z = y * u[3 * f + 1]
                      , F = S * B - O * z
                      , L = S * z + O * B
                      , U = E + D
                      , W = _ + R
                      , Q = E - D
                      , q = _ - R
                      , Y = M + F
                      , X = I + L
                      , H = y * (M - F)
                      , V = y * (I - L)
                      , N = U + Y
                      , $ = W + X
                      , Z = Q + V
                      , K = q - H;
                    if (n[h] = N,
                    n[h + 1] = $,
                    n[p] = Z,
                    n[p + 1] = K,
                    0 !== x) {
                        if (x !== l) {
                            var G = Q + -y * V
                              , J = -q + -y * H
                              , tt = U + -y * Y
                              , et = -W - -y * X
                              , nt = t + s - x
                              , rt = t + c - x;
                            n[nt] = G,
                            n[nt + 1] = J,
                            n[rt] = tt,
                            n[rt + 1] = et
                        }
                    } else {
                        var it = U - Y
                          , ot = W - X;
                        n[m] = it,
                        n[m + 1] = ot
                    }
                }
        }
    }
    ,
    r.prototype._singleRealTransform2 = function(t, e, n) {
        const r = this._out
          , i = this._data
          , o = i[e]
          , a = i[e + n]
          , y = o + a
          , u = o - a;
        r[t] = y,
        r[t + 1] = 0,
        r[t + 2] = u,
        r[t + 3] = 0
    }
    ,
    r.prototype._singleRealTransform4 = function(t, e, n) {
        const r = this._out
          , i = this._data
          , o = this._inv ? -1 : 1
          , a = 2 * n
          , y = 3 * n
          , u = i[e]
          , c = i[e + n]
          , s = i[e + a]
          , l = i[e + y]
          , x = u + s
          , f = u - s
          , h = c + l
          , p = o * (c - l)
          , m = x + h
          , d = f
          , v = -p
          , g = x - h
          , b = f
          , w = p;
        r[t] = m,
        r[t + 1] = 0,
        r[t + 2] = d,
        r[t + 3] = v,
        r[t + 4] = g,
        r[t + 5] = 0,
        r[t + 6] = b,
        r[t + 7] = w
    }
}
, function(t, e, n) {
    var r = n(2)
      , i = n(3)
      , o = n(4);
    function a(t) {
        return o.name + ": " + t
    }
    var y = {};
    i(y)({
        leftMatrixNotCompatible: a("Cannot multiply matrix at left side"),
        rightMatrixNotCompatible: a("Cannot multiply matrix at right side")
    });
    var u = (t,e,n)=>e + t * n;
    function c(t) {
        r(t) && (t = {});
        var e = t.addition
          , n = t.multiplication;
        return r(e) && (e = (t,e)=>t + e),
        r(n) && (n = (t,e)=>t * e),
        function(t) {
            return function(r, i) {
                var o = i.length / t
                  , a = r.length / t
                  , c = Math.floor(o) !== o
                  , s = Math.floor(a) !== a;
                if (c)
                    throw new TypeError(y.rightMatrixNotCompatible);
                if (s)
                    throw new TypeError(y.leftMatrixNotCompatible);
                for (var l = [], x = 0; x < a; x++)
                    for (var f = 0; f < o; f++) {
                        for (var h = u(x, 0, t), p = u(0, f, o), m = i[p], d = r[h], v = n(d, m), g = 1; g < t; g++)
                            h = u(x, g, t),
                            m = i[p = u(g, f, o)],
                            d = r[h],
                            v = e(v, n(m, d));
                        l.push(v)
                    }
                return l
            }
        }
    }
    i(c)({
        error: y
    }),
    t.exports = c
}
, function(t, e) {
    t.exports = function(t) {
        return null == t || "number" == typeof t && isNaN(t) || t.length < 1 && "function" != typeof t || "object" == typeof t && Object.keys(t).length < 1
    }
}
, function(t, e) {
    t.exports = e.default = function(t) {
        return function(e, n) {
            var r = {};
            for (var i in e) {
                var o = {
                    configurable: !1,
                    enumerable: n
                }
                  , a = e[i];
                "function" == typeof a ? o.get = a : (o.value = a,
                o.writable = !1),
                r[i] = o
            }
            Object.defineProperties(t, r)
        }
    }
}
, function(t) {
    t.exports = JSON.parse('{"_args":[["matrix-multiplication@0.5.2","/Users/jeremy/Documents/Websites/fourier"]],"_from":"matrix-multiplication@0.5.2","_id":"matrix-multiplication@0.5.2","_inBundle":false,"_integrity":"sha512-rr3Adfxn9cktAn8zYAkYiDbFZFkFflwjm9oSm5drBIQJPjFoqUlT9nq7aMwXpr+Nr4uurQKgxy+9pfk5X2YmYA==","_location":"/matrix-multiplication","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"matrix-multiplication@0.5.2","name":"matrix-multiplication","escapedName":"matrix-multiplication","rawSpec":"0.5.2","saveSpec":null,"fetchSpec":"0.5.2"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/matrix-multiplication/-/matrix-multiplication-0.5.2.tgz","_spec":"0.5.2","_where":"/Users/jeremy/Documents/Websites/fourier","author":{"name":"Gianluca Casati","url":"http://g14n.info"},"bugs":{"url":"https://github.com/fibo/matrix-multiplication/issues"},"dependencies":{"not-defined":"^2.0.1","static-props":"^1.1.1"},"description":"implements row by column multiplication","devDependencies":{"pre-commit":"^1.2.2","standa":"^1.0.2","tape":"^4.8.0"},"homepage":"http://g14n.info/matrix-multiplication","keywords":["algebra"],"license":"MIT","main":"matrix-multiplication.js","name":"matrix-multiplication","pre-commit":["lint","test","check-deps"],"repository":{"type":"git","url":"git://github.com/fibo/matrix-multiplication.git"},"scripts":{"check-deps":"npm outdated","lint":"standa","postversion":"git push origin v${npm_package_version}; npm publish; git push origin master","test":"NODE_PATH=. tape test.js"},"version":"0.5.2"}')
}
, function(t, e, n) {
    "use strict";
    function r(t) {
        var e = t.getBoundingClientRect();
        return (e.top + e.bottom) / 2 / (window.innerHeight || document.documentElement.clientHeight)
    }
    function i(t) {
        var e = t.getBoundingClientRect();
        return e.bottom >= 0 && e.top <= (window.innerHeight || document.documentElement.clientHeight) && e.right >= 0 && e.left <= (window.innerWidth || document.documentElement.clientWidth)
    }
    function o(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    n.r(e);
    var a = function() {
        function t() {
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, t)
        }
        var e, n, r;
        return e = t,
        (n = [{
            key: "update",
            value: function(t, e) {}
        }, {
            key: "isOnScreen",
            value: function() {
                return !0
            }
        }, {
            key: "render",
            value: function() {}
        }]) && o(e.prototype, n),
        r && o(e, r),
        t
    }();
    function y(t) {
        return (y = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function u(t, e) {
        if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function")
    }
    function c(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function s(t, e) {
        return (s = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function l(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = h(t);
            if (e) {
                var i = h(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return x(this, n)
        }
    }
    function x(t, e) {
        return !e || "object" !== y(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function h(t) {
        return (h = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var p = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && s(t, e)
        }(y, t);
        var e, n, o, a = l(y);
        function y(t) {
            var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
            return u(this, y),
            (e = a.call(this)).id = t,
            e.canvas = document.getElementById(t),
            null == n && (n = e.canvas.width),
            null == r && (r = e.canvas.height),
            e.context = e.canvas.getContext("2d"),
            e.width = n,
            e.height = r,
            e
        }
        return e = y,
        (n = [{
            key: "isOnScreen",
            value: function() {
                return i(this.canvas)
            }
        }, {
            key: "getScrollPosition",
            value: function() {
                return r(this.canvas)
            }
        }, {
            key: "clear",
            value: function() {
                this.context.resetTransform(),
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            }
        }]) && c(e.prototype, n),
        o && c(e, o),
        y
    }(a)
      , m = n(1)
      , d = n.n(m);
    function v(t, e, n) {
        return (e - t) * n + t
    }
    function g(t, e, n) {
        return t < e ? e : t > n ? n : t
    }
    function b(t, e, n) {
        return (t - e) / (n - e)
    }
    function w(t, e, n) {
        var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0
          , i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0
          , o = d()()(3)
          , a = [Math.cos(r), 0, -Math.sin(r), 0, 1, 0, Math.sin(r), 0, Math.cos(r)]
          , y = [1, 0, 0, 0, Math.cos(i), Math.sin(i), 0, -Math.sin(i), Math.cos(i)]
          , u = o(y, a)
          , c = o(u, [t, e, n]);
        return {
            x: c[0],
            y: c[1]
        }
    }
    var A = "#333"
      , P = "#4657d7"
      , S = "#57a7cc"
      , O = "#e91e63"
      , E = "#ed7656";
    function _(t) {
        return (_ = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function k(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function j(t, e) {
        return (j = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function M(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = T(t);
            if (e) {
                var i = T(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return I(this, n)
        }
    }
    function I(t, e) {
        return !e || "object" !== _(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function T(t) {
        return (T = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var C = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && j(t, e)
        }(o, t);
        var e, n, r, i = M(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).points = [],
            r.pathEndIndex = 0,
            r.curUndoIndex = 0,
            r.undoIndexes = [0],
            r.drawing = !1,
            r.onDrawingStart = [],
            r.onDrawingEnd = [],
            r.canvas.addEventListener("mousedown", (function() {
                return r.startDrawing()
            }
            )),
            r.canvas.addEventListener("touchstart", (function() {
                return r.startDrawing()
            }
            )),
            document.addEventListener("mouseup", (function() {
                return r.stopDrawing()
            }
            )),
            document.addEventListener("touchend", (function() {
                return r.stopDrawing()
            }
            )),
            r.canvas.addEventListener("touchmove", (function(t) {
                return t.preventDefault()
            }
            ), {
                passive: !1
            }),
            document.addEventListener("keydown", (function(t) {
                return r.checkKeys(t)
            }
            )),
            r
        }
        return e = o,
        (n = [{
            key: "setPoints",
            value: function(t) {
                this.points = t,
                this.stopDrawing()
            }
        }, {
            key: "checkKeys",
            value: function(t) {
                switch (t.key.toLowerCase()) {
                case "z":
                    this.undo();
                    break;
                case "y":
                    this.redo();
                    break;
                case "p":
                    console.log(this.path)
                }
            }
        }, {
            key: "startDrawing",
            value: function() {
                this.drawing = !0,
                this.points = this.path,
                this.undoIndexes = this.undoIndexes.slice(0, this.curUndoIndex + 1),
                this.onDrawingStart.forEach((function(t) {
                    return t()
                }
                ))
            }
        }, {
            key: "stopDrawing",
            value: function() {
                this.drawing && (this.drawing = !1,
                this.curUndoIndex++,
                this.undoIndexes.push(this.points.length),
                this.pathEndIndex = this.undoIndexes[this.curUndoIndex],
                this.onDrawingEnd.forEach((function(t) {
                    return t()
                }
                )))
            }
        }, {
            key: "undo",
            value: function() {
                var t = this.curUndoIndex - 1;
                t < 0 && (t = 0),
                t != this.curUndoIndex && (this.curUndoIndex = t,
                this.pathEndIndex = this.undoIndexes[this.curUndoIndex],
                this.onDrawingEnd.forEach((function(t) {
                    return t()
                }
                )))
            }
        }, {
            key: "redo",
            value: function() {
                var t = this.curUndoIndex + 1;
                t > this.undoIndexes.length - 1 && (t = this.undoIndexes.length - 1),
                t != this.curUndoIndex && (this.curUndoIndex = t,
                this.pathEndIndex = this.undoIndexes[this.curUndoIndex],
                this.onDrawingEnd.forEach((function(t) {
                    return t()
                }
                )))
            }
        }, {
            key: "update",
            value: function(t, e) {
                if (e && this.drawing) {
                    var n = this.canvas.getBoundingClientRect()
                      , r = 500 / (n.right - n.left - 2)
                      , i = {
                        x: r * (e.x - n.x),
                        y: r * (e.y - n.y)
                    };
                    if (0 == this.points.length)
                        this.points.push(i),
                        this.pathEndIndex = this.points.length;
                    else {
                        var o = this.points[this.points.length - 1]
                          , a = i.x - o.x
                          , y = i.y - o.y;
                        a * a + y * y > 9 && (this.points.push(i),
                        this.pathEndIndex = this.points.length)
                    }
                }
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.drawPoints(this.path)
            }
        }, {
            key: "drawPoints",
            value: function(t) {
                this.context.beginPath(),
                this.context.strokeStyle = O,
                this.context.lineWidth = 2;
                for (var e = 0; e < t.length; e++)
                    0 == e ? this.context.moveTo(t[e].x, t[e].y) : this.context.lineTo(t[e].x, t[e].y);
                this.context.closePath(),
                this.context.stroke()
            }
        }, {
            key: "path",
            get: function() {
                return this.points.slice(0, this.pathEndIndex)
            }
        }]) && k(e.prototype, n),
        r && k(e, r),
        o
    }(p)
      , D = n(0)
      , R = n.n(D);
    function B(t) {
        if (0 == t.length)
            return [];
        var e = t.length / 2
          , n = new R.a(e)
          , r = n.createComplexArray();
        n.transform(r, t);
        for (var i = [], o = 0; o < e; o++) {
            var a = o % 2 == 0 ? o / 2 : e - (o + 1) / 2
              , y = r[2 * a]
              , u = r[2 * a + 1]
              , c = (a + e / 2) % e - e / 2;
            i.push({
                freq: c,
                amplitude: Math.sqrt(y * y + u * u) / e,
                phase: Math.atan2(u, y)
            })
        }
        return i
    }
    function z(t, e) {
        if (0 == t.length)
            return [];
        for (var n = [], r = 0; r < e; r++) {
            var i = t.length * (r / e)
              , o = Math.floor(i)
              , a = (o + 1) % t.length
              , y = i - o;
            n.push(v(t[o].x, t[a].x, y), v(t[o].y, t[a].y, y))
        }
        return n
    }
    function F(t) {
        return (F = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function L(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function U(t, e) {
        return (U = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function W(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = q(t);
            if (e) {
                var i = q(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return Q(this, n)
        }
    }
    function Q(t, e) {
        return !e || "object" !== F(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function q(t) {
        return (q = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var Y = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && U(t, e)
        }(o, t);
        var e, n, r, i = W(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).animate = !0,
            r.fourierData = [],
            r.fourierPath = [],
            r.numPoints = 0,
            r.pathAmt = 1,
            r.animatePathAmt = !0,
            r.animAmt = 0,
            r.niceAnimAmt = 0,
            r.period = 5,
            r.fourierAmt = 1,
            r.pathDirty = !1,
            r
        }
        return e = o,
        (n = [{
            key: "setPath",
            value: function(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1
                  , n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .01;
                e < 0 && (e = t.length),
                this.numPoints = e,
                this.animAmt = 0,
                this.niceAnimAmt = 0,
                this.fourierPath = [],
                this.fourierData = B(z(t, this.numPoints)).filter((function(t) {
                    return t.amplitude > n
                }
                )),
                this.fourierData.sort((function(t, e) {
                    return e.amplitude - t.amplitude
                }
                )),
                console.log(this.fourierData.length + "/" + e)
            }
        }, {
            key: "setFourierAmt",
            value: function(t) {
                this.fourierAmt = t,
                this.pathDirty = !0
            }
        }, {
            key: "recalculatePath",
            value: function() {
                for (var t = 0; t < this.numPoints; t++)
                    this.niceAnimAmt += 1 / this.numPoints,
                    this.addToPath();
                this.niceAnimAmt -= 1
            }
        }, {
            key: "update",
            value: function(t, e) {
                if (this.pathDirty && (this.recalculatePath(),
                this.pathDirty = !1),
                this.animate) {
                    for (this.animAmt += t / this.period % 1; this.animAmt > 1; )
                        this.animAmt--,
                        this.niceAnimAmt--;
                    if (this.animatePathAmt) {
                        var n = 0;
                        this.getScrollPosition() < .8 && (n = 1),
                        this.pathAmt += .1 * (n - this.pathAmt),
                        this.pathAmt >= .99 && (this.pathAmt = 1)
                    }
                    for (var r = 0; r < 20 && !(this.niceAnimAmt >= this.animAmt); r++)
                        this.niceAnimAmt += 1 / this.numPoints,
                        this.addToPath()
                }
            }
        }, {
            key: "addToPath",
            value: function() {
                if (0 != this.fourierData.length) {
                    for (var t = 0, e = 0, n = Math.round(v(2, this.fourierData.length, this.fourierAmt)), r = 0; r < n; r++) {
                        var i = this.fourierData[r].amplitude
                          , o = 2 * Math.PI * this.fourierData[r].freq * this.niceAnimAmt + this.fourierData[r].phase;
                        t += i * Math.cos(o),
                        e += i * Math.sin(o)
                    }
                    for (this.fourierPath.push({
                        x: t,
                        y: e
                    }); this.fourierPath.length > this.numPoints * this.pathAmt && this.fourierPath.length > 0; )
                        this.fourierPath.shift()
                }
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.renderPath(this.fourierPath),
                this.renderCircles()
            }
        }, {
            key: "renderPath",
            value: function(t) {
                for (var e = 0; e < t.length - 1; e++)
                    this.context.beginPath(),
                    this.context.strokeStyle = P,
                    this.context.lineWidth = 2,
                    this.context.moveTo(t[e].x, t[e].y),
                    this.context.lineTo(t[e + 1].x, t[e + 1].y),
                    this.context.stroke()
            }
        }, {
            key: "renderCircles",
            value: function() {
                if (0 != this.fourierData.length) {
                    for (var t = 0, e = 0, n = Math.round(v(2, this.fourierData.length, this.fourierAmt)), r = 0; r < n; r++) {
                        var i = this.fourierData[r].amplitude
                          , o = 2 * Math.PI * this.fourierData[r].freq * this.animAmt + this.fourierData[r].phase;
                        t += i * Math.cos(o),
                        e += i * Math.sin(o),
                        0 != r && (i < .5 || (this.context.beginPath(),
                        this.context.strokeStyle = S,
                        this.context.globalAlpha = .7,
                        this.context.lineWidth = 1,
                        this.context.moveTo(t, e),
                        this.context.arc(t, e, i, o - Math.PI, o + Math.PI),
                        this.context.stroke()))
                    }
                    this.context.globalAlpha = 1
                }
            }
        }]) && L(e.prototype, n),
        r && L(e, r),
        o
    }(p);
    function X(t) {
        return (X = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function H(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function V(t, e) {
        return (V = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function N(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Z(t);
            if (e) {
                var i = Z(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return $(this, n)
        }
    }
    function $(t, e) {
        return !e || "object" !== X(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Z(t) {
        return (Z = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var K = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && V(t, e)
        }(o, t);
        var e, n, r, i = N(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).animAmt = 0,
            r.xzAngleFn = function() {
                return r.xzAngle
            }
            ,
            r.yAngleFn = function() {
                return 0
            }
            ,
            r.radius = .2 * r.height,
            r.length = .7 * r.width,
            r.xzAngle = 0,
            r
        }
        return e = o,
        (n = [{
            key: "update",
            value: function(t, e) {
                this.animAmt += t / 7,
                this.animAmt %= 1;
                var n = 0;
                this.getScrollPosition() < .6 && (n = Math.PI / 2),
                this.xzAngle += 1 / 18 * (n - this.xzAngle)
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.renderWave()
            }
        }, {
            key: "renderWave",
            value: function() {
                this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2),
                this.context.beginPath(),
                this.context.strokeStyle = P,
                this.context.lineWidth = 2;
                for (var t = this.xzAngleFn(this.animAmt), e = this.yAngleFn(this.animAmt), n = 0; n < 100; n++) {
                    var r = n / 99
                      , i = w(this.length * (r - .5), this.radius * Math.sin(2 * Math.PI * (3 * r - 4 * this.animAmt)), this.radius * Math.cos(2 * Math.PI * (3 * r - 4 * this.animAmt)), t, e);
                    0 == r && this.context.arc(i.x, i.y, 3, 0, 2 * Math.PI),
                    0 == n ? this.context.moveTo(i.x, i.y) : this.context.lineTo(i.x, i.y)
                }
                this.context.stroke()
            }
        }]) && H(e.prototype, n),
        r && H(e, r),
        o
    }(p);
    function G(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    var J = function() {
        function t(e) {
            var n = this;
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, t),
            this.lastTime = Date.now(),
            this.mousePosition = null,
            this.controllers = e.slice(),
            this.updatingControllers = [],
            document.addEventListener("mousemove", (function(t) {
                return n.updateMousePosition(t)
            }
            )),
            document.addEventListener("mousedown", (function(t) {
                return n.updateMousePosition(t)
            }
            )),
            document.addEventListener("mouseup", (function(t) {
                return n.updateMousePosition(t)
            }
            )),
            document.addEventListener("touchmove", (function(t) {
                return n.updateTouchPosition(t)
            }
            )),
            document.addEventListener("touchstart", (function(t) {
                return n.updateTouchPosition(t)
            }
            )),
            document.addEventListener("touchend", (function(t) {
                return n.updateTouchPosition(t)
            }
            )),
            window.addEventListener("resize", (function(t) {
                return n.onResize(t)
            }
            ))
        }
        var e, n, r;
        return e = t,
        (n = [{
            key: "start",
            value: function() {
                var t = this;
                window.requestAnimationFrame((function() {
                    return t.everyFrame()
                }
                ))
            }
        }, {
            key: "onResize",
            value: function(t) {
                this.controllers.forEach((function(t) {
                    "function" == typeof t.onResize && t.onResize()
                }
                ))
            }
        }, {
            key: "everyFrame",
            value: function() {
                var t = this;
                this.update(),
                this.render(),
                requestAnimationFrame((function() {
                    return t.everyFrame()
                }
                ))
            }
        }, {
            key: "update",
            value: function() {
                var t = this
                  , e = Date.now()
                  , n = (e - this.lastTime) / 1e3;
                this.updatingControllers = [],
                this.controllers.forEach((function(e) {
                    e.isOnScreen() && (e.update(n, t.mousePosition),
                    t.updatingControllers.push(e))
                }
                )),
                this.lastTime = e;
                var r = document.getElementById("debug-content");
                r && (r.innerHTML = this.updatingControllers.map((function(t) {
                    return t.id
                }
                )).join("<br>") + "<br>")
            }
        }, {
            key: "render",
            value: function() {
                this.controllers.forEach((function(t) {
                    t.isOnScreen() && t.render()
                }
                ))
            }
        }, {
            key: "updateMousePosition",
            value: function(t) {
                this.mousePosition = {
                    x: t.clientX,
                    y: t.clientY
                }
            }
        }, {
            key: "updateTouchPosition",
            value: function(t) {
                t.touches.length > 0 && (this.mousePosition = {
                    x: t.touches[0].clientX,
                    y: t.touches[0].clientY
                })
            }
        }]) && G(e.prototype, n),
        r && G(e, r),
        t
    }()
      , tt = [{
        x: 10.3,
        y: 179.8
    }, {
        x: 15.6,
        y: 179.8
    }, {
        x: 20.9,
        y: 179.8
    }, {
        x: 26.1,
        y: 179.8
    }, {
        x: 31.4,
        y: 179.8
    }, {
        x: 36.6,
        y: 179.8
    }, {
        x: 41.9,
        y: 179.8
    }, {
        x: 47.1,
        y: 179.8
    }, {
        x: 48.5,
        y: 176
    }, {
        x: 48.5,
        y: 170.7
    }, {
        x: 48.5,
        y: 165.5
    }, {
        x: 48.5,
        y: 160.2
    }, {
        x: 48.5,
        y: 155
    }, {
        x: 48.5,
        y: 149.7
    }, {
        x: 48.5,
        y: 144.5
    }, {
        x: 48.5,
        y: 139.2
    }, {
        x: 48.5,
        y: 134
    }, {
        x: 48.5,
        y: 128.7
    }, {
        x: 48.5,
        y: 123.5
    }, {
        x: 48.5,
        y: 118.2
    }, {
        x: 48.5,
        y: 113
    }, {
        x: 48.5,
        y: 107.7
    }, {
        x: 48.5,
        y: 102.5
    }, {
        x: 50.1,
        y: 98.9
    }, {
        x: 55.4,
        y: 98.9
    }, {
        x: 60.6,
        y: 98.9
    }, {
        x: 65.9,
        y: 98.9
    }, {
        x: 71.1,
        y: 98.9
    }, {
        x: 76.4,
        y: 98.8
    }, {
        x: 81.6,
        y: 98.8
    }, {
        x: 82.7,
        y: 103
    }, {
        x: 82.7,
        y: 108.3
    }, {
        x: 79.3,
        y: 110.1
    }, {
        x: 74.1,
        y: 110.1
    }, {
        x: 68.8,
        y: 110.1
    }, {
        x: 64.9,
        y: 111.5
    }, {
        x: 64.9,
        y: 116.8
    }, {
        x: 64.9,
        y: 122
    }, {
        x: 64.9,
        y: 127.3
    }, {
        x: 65.5,
        y: 132
    }, {
        x: 70.7,
        y: 132
    }, {
        x: 76,
        y: 132
    }, {
        x: 80,
        y: 133.2
    }, {
        x: 80,
        y: 138.4
    }, {
        x: 79.8,
        y: 143.5
    }, {
        x: 74.5,
        y: 143.5
    }, {
        x: 69.3,
        y: 143.5
    }, {
        x: 64.9,
        y: 144.3
    }, {
        x: 64.9,
        y: 149.6
    }, {
        x: 64.9,
        y: 154.8
    }, {
        x: 64.9,
        y: 160.1
    }, {
        x: 64.9,
        y: 165.3
    }, {
        x: 64.9,
        y: 170.6
    }, {
        x: 64.9,
        y: 175.8
    }, {
        x: 66.1,
        y: 179.8
    }, {
        x: 71.4,
        y: 179.8
    }, {
        x: 76.6,
        y: 179.8
    }, {
        x: 81.9,
        y: 179.8
    }, {
        x: 87.1,
        y: 179.8
    }, {
        x: 92.4,
        y: 179.8
    }, {
        x: 97.6,
        y: 179.8
    }, {
        x: 102.9,
        y: 179.8
    }, {
        x: 108.1,
        y: 179.8
    }, {
        x: 113.4,
        y: 179.8
    }, {
        x: 118.6,
        y: 179.8
    }, {
        x: 123.9,
        y: 179.8
    }, {
        x: 120.2,
        y: 178.2
    }, {
        x: 116,
        y: 175
    }, {
        x: 113,
        y: 170.7
    }, {
        x: 111.2,
        y: 165.8
    }, {
        x: 110.2,
        y: 160.7
    }, {
        x: 109.8,
        y: 155.4
    }, {
        x: 109.8,
        y: 150.2
    }, {
        x: 109.8,
        y: 144.9
    }, {
        x: 109.8,
        y: 139.7
    }, {
        x: 109.8,
        y: 134.4
    }, {
        x: 109.8,
        y: 129.2
    }, {
        x: 109.8,
        y: 123.9
    }, {
        x: 110.1,
        y: 118.7
    }, {
        x: 111,
        y: 113.5
    }, {
        x: 112.7,
        y: 108.5
    }, {
        x: 115.6,
        y: 104.2
    }, {
        x: 119.6,
        y: 100.9
    }, {
        x: 124.5,
        y: 98.9
    }, {
        x: 129.6,
        y: 98
    }, {
        x: 134.9,
        y: 97.9
    }, {
        x: 140.1,
        y: 98.3
    }, {
        x: 145.2,
        y: 99.7
    }, {
        x: 149.7,
        y: 102.3
    }, {
        x: 153.3,
        y: 106.1
    }, {
        x: 155.6,
        y: 110.8
    }, {
        x: 156.9,
        y: 115.9
    }, {
        x: 157.5,
        y: 121.1
    }, {
        x: 157.6,
        y: 126.4
    }, {
        x: 157.6,
        y: 131.6
    }, {
        x: 157.6,
        y: 136.9
    }, {
        x: 157.6,
        y: 142.1
    }, {
        x: 157.6,
        y: 147.4
    }, {
        x: 157.6,
        y: 152.6
    }, {
        x: 157.5,
        y: 157.9
    }, {
        x: 156.9,
        y: 163.1
    }, {
        x: 155.5,
        y: 168.1
    }, {
        x: 153.1,
        y: 172.8
    }, {
        x: 149.5,
        y: 176.6
    }, {
        x: 145,
        y: 179.2
    }, {
        x: 145.9,
        y: 179.8
    }, {
        x: 151.1,
        y: 179.8
    }, {
        x: 156.4,
        y: 179.8
    }, {
        x: 161.6,
        y: 179.8
    }, {
        x: 166.9,
        y: 179.8
    }, {
        x: 172.1,
        y: 179.8
    }, {
        x: 177.4,
        y: 179.8
    }, {
        x: 182.6,
        y: 179.8
    }, {
        x: 187.9,
        y: 179.8
    }, {
        x: 193.1,
        y: 179.8
    }, {
        x: 198.4,
        y: 179.8
    }, {
        x: 200.4,
        y: 179.3
    }, {
        x: 195.8,
        y: 176.9
    }, {
        x: 192.2,
        y: 173.1
    }, {
        x: 189.9,
        y: 168.4
    }, {
        x: 188.7,
        y: 163.3
    }, {
        x: 188.1,
        y: 158.1
    }, {
        x: 188,
        y: 152.9
    }, {
        x: 188,
        y: 147.6
    }, {
        x: 188,
        y: 142.4
    }, {
        x: 188,
        y: 137.1
    }, {
        x: 188,
        y: 131.9
    }, {
        x: 188,
        y: 126.6
    }, {
        x: 188,
        y: 121.4
    }, {
        x: 188,
        y: 116.1
    }, {
        x: 188,
        y: 110.9
    }, {
        x: 188,
        y: 105.6
    }, {
        x: 188,
        y: 100.3
    }, {
        x: 191.8,
        y: 98.9
    }, {
        x: 197,
        y: 98.9
    }, {
        x: 202.3,
        y: 98.9
    }, {
        x: 204.2,
        y: 102.2
    }, {
        x: 204.2,
        y: 107.4
    }, {
        x: 204.2,
        y: 112.7
    }, {
        x: 204.2,
        y: 117.9
    }, {
        x: 204.2,
        y: 123.2
    }, {
        x: 204.2,
        y: 128.4
    }, {
        x: 204.2,
        y: 133.7
    }, {
        x: 204.2,
        y: 138.9
    }, {
        x: 204.2,
        y: 144.2
    }, {
        x: 204.2,
        y: 149.4
    }, {
        x: 204.2,
        y: 154.7
    }, {
        x: 204.3,
        y: 159.9
    }, {
        x: 205.4,
        y: 165.1
    }, {
        x: 208.9,
        y: 168.6
    }, {
        x: 214.1,
        y: 168.5
    }, {
        x: 217.5,
        y: 164.8
    }, {
        x: 218.5,
        y: 159.7
    }, {
        x: 218.6,
        y: 154.4
    }, {
        x: 218.6,
        y: 149.2
    }, {
        x: 218.6,
        y: 143.9
    }, {
        x: 218.6,
        y: 138.7
    }, {
        x: 218.6,
        y: 133.4
    }, {
        x: 218.6,
        y: 128.2
    }, {
        x: 218.6,
        y: 122.9
    }, {
        x: 218.6,
        y: 117.7
    }, {
        x: 218.6,
        y: 112.4
    }, {
        x: 218.6,
        y: 107.2
    }, {
        x: 218.6,
        y: 101.9
    }, {
        x: 220.8,
        y: 98.9
    }, {
        x: 226,
        y: 98.9
    }, {
        x: 231.3,
        y: 98.9
    }, {
        x: 234.9,
        y: 100.5
    }, {
        x: 234.9,
        y: 105.7
    }, {
        x: 234.9,
        y: 111
    }, {
        x: 234.9,
        y: 116.2
    }, {
        x: 234.9,
        y: 121.5
    }, {
        x: 234.9,
        y: 126.7
    }, {
        x: 234.9,
        y: 132
    }, {
        x: 234.9,
        y: 137.2
    }, {
        x: 234.9,
        y: 142.5
    }, {
        x: 234.9,
        y: 147.7
    }, {
        x: 234.9,
        y: 153
    }, {
        x: 234.8,
        y: 158.2
    }, {
        x: 234.2,
        y: 163.5
    }, {
        x: 233,
        y: 168.6
    }, {
        x: 230.6,
        y: 173.2
    }, {
        x: 227,
        y: 177
    }, {
        x: 222.3,
        y: 179.4
    }, {
        x: 224.6,
        y: 179.8
    }, {
        x: 229.8,
        y: 179.8
    }, {
        x: 235.1,
        y: 179.8
    }, {
        x: 240.3,
        y: 179.8
    }, {
        x: 245.6,
        y: 179.8
    }, {
        x: 250.8,
        y: 179.8
    }, {
        x: 256.1,
        y: 179.8
    }, {
        x: 261.3,
        y: 179.8
    }, {
        x: 266.6,
        y: 179.8
    }, {
        x: 271.8,
        y: 179.8
    }, {
        x: 277.1,
        y: 179.8
    }, {
        x: 282.3,
        y: 179.8
    }, {
        x: 287.6,
        y: 179.8
    }, {
        x: 292.8,
        y: 179.8
    }, {
        x: 298,
        y: 179.8
    }, {
        x: 296.7,
        y: 174.7
    }, {
        x: 295.4,
        y: 169.6
    }, {
        x: 294.2,
        y: 164.5
    }, {
        x: 292.9,
        y: 159.4
    }, {
        x: 291.6,
        y: 154.3
    }, {
        x: 290.3,
        y: 149.2
    }, {
        x: 289,
        y: 144.1
    }, {
        x: 284.5,
        y: 143.1
    }, {
        x: 282.8,
        y: 146.7
    }, {
        x: 282.8,
        y: 151.9
    }, {
        x: 282.8,
        y: 157.2
    }, {
        x: 282.8,
        y: 162.4
    }, {
        x: 282.8,
        y: 167.7
    }, {
        x: 282.8,
        y: 172.9
    }, {
        x: 282.8,
        y: 178.2
    }, {
        x: 277.8,
        y: 178.5
    }, {
        x: 272.6,
        y: 178.5
    }, {
        x: 267.3,
        y: 178.5
    }, {
        x: 266.4,
        y: 174.1
    }, {
        x: 266.4,
        y: 168.9
    }, {
        x: 266.4,
        y: 163.6
    }, {
        x: 266.4,
        y: 158.4
    }, {
        x: 266.4,
        y: 153.1
    }, {
        x: 266.4,
        y: 147.9
    }, {
        x: 266.4,
        y: 142.6
    }, {
        x: 266.4,
        y: 137.4
    }, {
        x: 266.4,
        y: 132.1
    }, {
        x: 266.4,
        y: 126.9
    }, {
        x: 266.4,
        y: 121.6
    }, {
        x: 266.4,
        y: 116.4
    }, {
        x: 266.4,
        y: 111.1
    }, {
        x: 266.4,
        y: 105.9
    }, {
        x: 266.4,
        y: 100.6
    }, {
        x: 269.9,
        y: 98.9
    }, {
        x: 275.1,
        y: 98.9
    }, {
        x: 280.4,
        y: 98.9
    }, {
        x: 285.6,
        y: 98.9
    }, {
        x: 290.9,
        y: 98.9
    }, {
        x: 296.1,
        y: 99.5
    }, {
        x: 301.2,
        y: 100.7
    }, {
        x: 306,
        y: 102.9
    }, {
        x: 309.9,
        y: 106.4
    }, {
        x: 312.3,
        y: 111
    }, {
        x: 313.5,
        y: 116.1
    }, {
        x: 313.7,
        y: 121.3
    }, {
        x: 313.3,
        y: 126.6
    }, {
        x: 312,
        y: 131.7
    }, {
        x: 309.5,
        y: 136.2
    }, {
        x: 305.4,
        y: 139.5
    }, {
        x: 304.6,
        y: 143.6
    }, {
        x: 306,
        y: 148.6
    }, {
        x: 307.5,
        y: 153.7
    }, {
        x: 308.9,
        y: 158.7
    }, {
        x: 310.3,
        y: 163.8
    }, {
        x: 311.8,
        y: 168.8
    }, {
        x: 313.2,
        y: 173.9
    }, {
        x: 314.6,
        y: 178.9
    }, {
        x: 319.2,
        y: 179.8
    }, {
        x: 324.5,
        y: 179.8
    }, {
        x: 329.7,
        y: 179.8
    }, {
        x: 335,
        y: 179.8
    }, {
        x: 340.2,
        y: 179.8
    }, {
        x: 344.9,
        y: 179.3
    }, {
        x: 344.9,
        y: 174
    }, {
        x: 344.9,
        y: 168.8
    }, {
        x: 344.9,
        y: 163.5
    }, {
        x: 344.9,
        y: 158.3
    }, {
        x: 344.9,
        y: 153
    }, {
        x: 344.9,
        y: 147.8
    }, {
        x: 344.9,
        y: 142.5
    }, {
        x: 344.9,
        y: 137.3
    }, {
        x: 344.9,
        y: 132
    }, {
        x: 344.9,
        y: 126.8
    }, {
        x: 344.9,
        y: 121.5
    }, {
        x: 344.9,
        y: 116.3
    }, {
        x: 344.9,
        y: 111
    }, {
        x: 344.9,
        y: 105.8
    }, {
        x: 344.9,
        y: 100.5
    }, {
        x: 348.5,
        y: 98.9
    }, {
        x: 353.7,
        y: 98.9
    }, {
        x: 359,
        y: 98.9
    }, {
        x: 361.3,
        y: 101.8
    }, {
        x: 361.3,
        y: 107
    }, {
        x: 361.3,
        y: 112.3
    }, {
        x: 361.3,
        y: 117.5
    }, {
        x: 361.3,
        y: 122.8
    }, {
        x: 361.3,
        y: 128
    }, {
        x: 361.3,
        y: 133.3
    }, {
        x: 361.3,
        y: 138.6
    }, {
        x: 361.3,
        y: 143.8
    }, {
        x: 361.3,
        y: 149.1
    }, {
        x: 361.3,
        y: 154.3
    }, {
        x: 361.3,
        y: 159.6
    }, {
        x: 361.3,
        y: 164.8
    }, {
        x: 361.3,
        y: 170.1
    }, {
        x: 361.3,
        y: 175.3
    }, {
        x: 362,
        y: 179.8
    }, {
        x: 367.3,
        y: 179.8
    }, {
        x: 372.5,
        y: 179.8
    }, {
        x: 377.8,
        y: 179.8
    }, {
        x: 383,
        y: 179.8
    }, {
        x: 388.3,
        y: 179.8
    }, {
        x: 393.5,
        y: 179.8
    }, {
        x: 393.6,
        y: 174.7
    }, {
        x: 393.6,
        y: 169.4
    }, {
        x: 393.6,
        y: 164.2
    }, {
        x: 393.6,
        y: 158.9
    }, {
        x: 393.6,
        y: 153.7
    }, {
        x: 393.6,
        y: 148.4
    }, {
        x: 393.6,
        y: 143.2
    }, {
        x: 393.6,
        y: 137.9
    }, {
        x: 393.6,
        y: 132.7
    }, {
        x: 393.6,
        y: 127.4
    }, {
        x: 393.6,
        y: 122.2
    }, {
        x: 393.6,
        y: 116.9
    }, {
        x: 393.6,
        y: 111.7
    }, {
        x: 393.6,
        y: 106.4
    }, {
        x: 393.6,
        y: 101.2
    }, {
        x: 396.5,
        y: 98.9
    }, {
        x: 401.8,
        y: 98.9
    }, {
        x: 407.1,
        y: 98.9
    }, {
        x: 412.3,
        y: 98.9
    }, {
        x: 417.6,
        y: 98.9
    }, {
        x: 422.8,
        y: 98.8
    }, {
        x: 428.1,
        y: 98.8
    }, {
        x: 428.9,
        y: 103.3
    }, {
        x: 428.9,
        y: 108.5
    }, {
        x: 425.4,
        y: 110.3
    }, {
        x: 420.1,
        y: 110.3
    }, {
        x: 414.9,
        y: 110.3
    }, {
        x: 410,
        y: 110.6
    }, {
        x: 410,
        y: 115.9
    }, {
        x: 410,
        y: 121.1
    }, {
        x: 410,
        y: 126.4
    }, {
        x: 410,
        y: 131.6
    }, {
        x: 415.1,
        y: 131.8
    }, {
        x: 420.4,
        y: 131.8
    }, {
        x: 424.6,
        y: 132.8
    }, {
        x: 424.6,
        y: 138
    }, {
        x: 424.6,
        y: 143.3
    }, {
        x: 419.3,
        y: 143.3
    }, {
        x: 414.1,
        y: 143.3
    }, {
        x: 410,
        y: 144.4
    }, {
        x: 410,
        y: 149.7
    }, {
        x: 410,
        y: 154.9
    }, {
        x: 410,
        y: 160.2
    }, {
        x: 410,
        y: 165.4
    }, {
        x: 412,
        y: 168.6
    }, {
        x: 417.3,
        y: 168.6
    }, {
        x: 422.5,
        y: 168.6
    }, {
        x: 427.8,
        y: 168.6
    }, {
        x: 429.1,
        y: 172.6
    }, {
        x: 429.1,
        y: 177.9
    }, {
        x: 432.4,
        y: 179.8
    }, {
        x: 437.6,
        y: 179.8
    }, {
        x: 442.9,
        y: 179.8
    }, {
        x: 448.1,
        y: 179.8
    }, {
        x: 453.4,
        y: 179.8
    }, {
        x: 458.6,
        y: 179.8
    }, {
        x: 463.9,
        y: 179.8
    }, {
        x: 469.1,
        y: 179.8
    }, {
        x: 474.4,
        y: 179.8
    }, {
        x: 479.6,
        y: 179.8
    }, {
        x: 484.9,
        y: 179.8
    }, {
        x: 488.9,
        y: 178.9
    }, {
        x: 487.6,
        y: 173.8
    }, {
        x: 486.3,
        y: 168.7
    }, {
        x: 485,
        y: 163.6
    }, {
        x: 483.7,
        y: 158.5
    }, {
        x: 482.5,
        y: 153.4
    }, {
        x: 481.2,
        y: 148.3
    }, {
        x: 479.9,
        y: 143.2
    }, {
        x: 474.7,
        y: 143.1
    }, {
        x: 473.9,
        y: 147.6
    }, {
        x: 473.9,
        y: 152.9
    }, {
        x: 473.9,
        y: 158.1
    }, {
        x: 473.9,
        y: 163.4
    }, {
        x: 473.9,
        y: 168.6
    }, {
        x: 473.9,
        y: 173.9
    }, {
        x: 473.2,
        y: 178.5
    }, {
        x: 468,
        y: 178.5
    }, {
        x: 462.7,
        y: 178.5
    }, {
        x: 457.5,
        y: 178.4
    }, {
        x: 457.5,
        y: 173.2
    }, {
        x: 457.5,
        y: 167.9
    }, {
        x: 457.5,
        y: 162.7
    }, {
        x: 457.5,
        y: 157.4
    }, {
        x: 457.5,
        y: 152.2
    }, {
        x: 457.5,
        y: 146.9
    }, {
        x: 457.5,
        y: 141.7
    }, {
        x: 457.5,
        y: 136.4
    }, {
        x: 457.5,
        y: 131.2
    }, {
        x: 457.5,
        y: 125.9
    }, {
        x: 457.5,
        y: 120.7
    }, {
        x: 457.5,
        y: 115.4
    }, {
        x: 457.5,
        y: 110.2
    }, {
        x: 457.5,
        y: 104.9
    }, {
        x: 457.5,
        y: 99.7
    }, {
        x: 461.9,
        y: 98.9
    }, {
        x: 467.2,
        y: 98.9
    }, {
        x: 472.4,
        y: 98.9
    }, {
        x: 477.7,
        y: 98.9
    }, {
        x: 482.9,
        y: 99
    }, {
        x: 488.1,
        y: 99.7
    }, {
        x: 493.2,
        y: 101
    }, {
        x: 497.9,
        y: 103.4
    }, {
        x: 501.5,
        y: 107.1
    }, {
        x: 503.7,
        y: 111.9
    }, {
        x: 504.7,
        y: 117
    }, {
        x: 504.8,
        y: 122.3
    }, {
        x: 504.2,
        y: 127.5
    }, {
        x: 502.8,
        y: 132.5
    }, {
        x: 499.9,
        y: 136.9
    }, {
        x: 495.7,
        y: 139.9
    }, {
        x: 496,
        y: 144.5
    }, {
        x: 497.4,
        y: 149.5
    }, {
        x: 498.8,
        y: 154.6
    }, {
        x: 500.3,
        y: 159.6
    }, {
        x: 501.7,
        y: 164.7
    }, {
        x: 503.1,
        y: 169.7
    }, {
        x: 504.6,
        y: 174.8
    }, {
        x: 506,
        y: 179.8
    }, {
        x: 511.3,
        y: 179.8
    }, {
        x: 516.5,
        y: 179.8
    }, {
        x: 521.8,
        y: 179.8
    }, {
        x: 527,
        y: 179.8
    }, {
        x: 532.3,
        y: 179.8
    }, {
        x: 537.5,
        y: 179.8
    }, {
        x: 542.8,
        y: 179.8
    }, {
        x: 543.7,
        y: 184.2
    }, {
        x: 543.7,
        y: 189.5
    }, {
        x: 543.7,
        y: 194.7
    }, {
        x: 543.7,
        y: 200
    }, {
        x: 543.7,
        y: 205.2
    }, {
        x: 543.7,
        y: 210.5
    }, {
        x: 543.7,
        y: 215.7
    }, {
        x: 541.7,
        y: 219.1
    }, {
        x: 536.5,
        y: 219.1
    }, {
        x: 531.2,
        y: 219.1
    }, {
        x: 535.8,
        y: 221.3
    }, {
        x: 539.3,
        y: 225.2
    }, {
        x: 541.6,
        y: 229.9
    }, {
        x: 543,
        y: 235
    }, {
        x: 543.6,
        y: 240.2
    }, {
        x: 538.8,
        y: 241.3
    }, {
        x: 533.6,
        y: 242
    }, {
        x: 529.3,
        y: 241.7
    }, {
        x: 528.8,
        y: 236.5
    }, {
        x: 526.9,
        y: 231.7
    }, {
        x: 522.1,
        y: 230.2
    }, {
        x: 518.1,
        y: 233.2
    }, {
        x: 517.3,
        y: 238.4
    }, {
        x: 518.7,
        y: 243.4
    }, {
        x: 522,
        y: 247.5
    }, {
        x: 525.9,
        y: 251
    }, {
        x: 529.8,
        y: 254.5
    }, {
        x: 533.8,
        y: 258
    }, {
        x: 537.4,
        y: 261.7
    }, {
        x: 540.6,
        y: 265.9
    }, {
        x: 543.2,
        y: 270.5
    }, {
        x: 544.7,
        y: 275.5
    }, {
        x: 545.1,
        y: 280.7
    }, {
        x: 544.6,
        y: 285.9
    }, {
        x: 542.9,
        y: 290.8
    }, {
        x: 539.8,
        y: 295.1
    }, {
        x: 535.7,
        y: 298.3
    }, {
        x: 530.8,
        y: 300.3
    }, {
        x: 525.6,
        y: 301.1
    }, {
        x: 520.4,
        y: 301
    }, {
        x: 515.3,
        y: 299.9
    }, {
        x: 510.5,
        y: 297.7
    }, {
        x: 506.7,
        y: 294.1
    }, {
        x: 504,
        y: 289.6
    }, {
        x: 502.4,
        y: 284.6
    }, {
        x: 501.6,
        y: 279.4
    }, {
        x: 503.1,
        y: 275.7
    }, {
        x: 508.3,
        y: 274.8
    }, {
        x: 513.5,
        y: 273.9
    }, {
        x: 515.7,
        y: 276.7
    }, {
        x: 516.5,
        y: 281.8
    }, {
        x: 518.8,
        y: 286.5
    }, {
        x: 523.5,
        y: 288.5
    }, {
        x: 528,
        y: 286.4
    }, {
        x: 529,
        y: 281.3
    }, {
        x: 528.1,
        y: 276.2
    }, {
        x: 525.4,
        y: 271.7
    }, {
        x: 521.7,
        y: 267.9
    }, {
        x: 517.8,
        y: 264.4
    }, {
        x: 513.8,
        y: 261
    }, {
        x: 509.9,
        y: 257.5
    }, {
        x: 506.4,
        y: 253.6
    }, {
        x: 503.6,
        y: 249.2
    }, {
        x: 502,
        y: 244.2
    }, {
        x: 501.5,
        y: 239
    }, {
        x: 501.9,
        y: 233.7
    }, {
        x: 503.4,
        y: 228.7
    }, {
        x: 506.3,
        y: 224.4
    }, {
        x: 510.4,
        y: 221.1
    }, {
        x: 515.2,
        y: 219.1
    }, {
        x: 510.3,
        y: 219.1
    }, {
        x: 505.1,
        y: 219.1
    }, {
        x: 499.8,
        y: 219.1
    }, {
        x: 494.6,
        y: 219.1
    }, {
        x: 490,
        y: 219.7
    }, {
        x: 490.1,
        y: 224.9
    }, {
        x: 490.2,
        y: 230.2
    }, {
        x: 490.3,
        y: 235.4
    }, {
        x: 490.4,
        y: 240.7
    }, {
        x: 490.4,
        y: 245.9
    }, {
        x: 490.5,
        y: 251.2
    }, {
        x: 490.6,
        y: 256.4
    }, {
        x: 490.7,
        y: 261.7
    }, {
        x: 490.8,
        y: 266.9
    }, {
        x: 490.9,
        y: 272.2
    }, {
        x: 491,
        y: 277.4
    }, {
        x: 491.1,
        y: 282.7
    }, {
        x: 491.2,
        y: 287.9
    }, {
        x: 491.3,
        y: 293.2
    }, {
        x: 491.4,
        y: 298.4
    }, {
        x: 487.8,
        y: 300.1
    }, {
        x: 482.6,
        y: 300.1
    }, {
        x: 479.4,
        y: 297.9
    }, {
        x: 479.3,
        y: 292.7
    }, {
        x: 479.2,
        y: 287.4
    }, {
        x: 479,
        y: 282.2
    }, {
        x: 478.9,
        y: 276.9
    }, {
        x: 478.8,
        y: 271.7
    }, {
        x: 478.7,
        y: 266.4
    }, {
        x: 478.5,
        y: 261.2
    }, {
        x: 478.4,
        y: 255.9
    }, {
        x: 478.3,
        y: 250.7
    }, {
        x: 478.2,
        y: 245.4
    }, {
        x: 477.2,
        y: 249.9
    }, {
        x: 476.3,
        y: 255
    }, {
        x: 475.3,
        y: 260.2
    }, {
        x: 474.3,
        y: 265.3
    }, {
        x: 473.3,
        y: 270.5
    }, {
        x: 472.4,
        y: 275.7
    }, {
        x: 471.4,
        y: 280.8
    }, {
        x: 470.4,
        y: 286
    }, {
        x: 469.4,
        y: 291.1
    }, {
        x: 468.5,
        y: 296.3
    }, {
        x: 466.3,
        y: 300.1
    }, {
        x: 461.1,
        y: 300.1
    }, {
        x: 457.2,
        y: 298.3
    }, {
        x: 456.2,
        y: 293.2
    }, {
        x: 455.2,
        y: 288
    }, {
        x: 454.2,
        y: 282.9
    }, {
        x: 453.2,
        y: 277.7
    }, {
        x: 452.2,
        y: 272.6
    }, {
        x: 451.2,
        y: 267.4
    }, {
        x: 450.2,
        y: 262.3
    }, {
        x: 449.2,
        y: 257.1
    }, {
        x: 448.2,
        y: 251.9
    }, {
        x: 447.2,
        y: 246.8
    }, {
        x: 446.8,
        y: 247.9
    }, {
        x: 446.7,
        y: 253.2
    }, {
        x: 446.6,
        y: 258.4
    }, {
        x: 446.4,
        y: 263.7
    }, {
        x: 446.3,
        y: 268.9
    }, {
        x: 446.2,
        y: 274.2
    }, {
        x: 446.1,
        y: 279.4
    }, {
        x: 446,
        y: 284.7
    }, {
        x: 445.9,
        y: 289.9
    }, {
        x: 445.8,
        y: 295.2
    }, {
        x: 445.3,
        y: 300.1
    }, {
        x: 440,
        y: 300.1
    }, {
        x: 434.8,
        y: 300.1
    }, {
        x: 433.6,
        y: 296
    }, {
        x: 433.7,
        y: 290.8
    }, {
        x: 433.8,
        y: 285.5
    }, {
        x: 433.9,
        y: 280.3
    }, {
        x: 434,
        y: 275
    }, {
        x: 434.1,
        y: 269.8
    }, {
        x: 434.2,
        y: 264.5
    }, {
        x: 434.3,
        y: 259.3
    }, {
        x: 434.3,
        y: 254
    }, {
        x: 434.4,
        y: 248.8
    }, {
        x: 434.5,
        y: 243.5
    }, {
        x: 434.6,
        y: 238.3
    }, {
        x: 434.7,
        y: 233
    }, {
        x: 434.8,
        y: 227.8
    }, {
        x: 434.9,
        y: 222.5
    }, {
        x: 433.2,
        y: 219.1
    }, {
        x: 427.9,
        y: 219.1
    }, {
        x: 422.6,
        y: 219.1
    }, {
        x: 417.4,
        y: 219.1
    }, {
        x: 412.1,
        y: 219.1
    }, {
        x: 406.9,
        y: 219.1
    }, {
        x: 401.6,
        y: 219.1
    }, {
        x: 399.9,
        y: 219.1
    }, {
        x: 405.1,
        y: 219.7
    }, {
        x: 410.2,
        y: 220.9
    }, {
        x: 415,
        y: 223
    }, {
        x: 419,
        y: 226.5
    }, {
        x: 421.4,
        y: 231
    }, {
        x: 422.6,
        y: 236.2
    }, {
        x: 422.8,
        y: 241.4
    }, {
        x: 422.4,
        y: 246.6
    }, {
        x: 421.2,
        y: 251.7
    }, {
        x: 418.7,
        y: 256.3
    }, {
        x: 414.7,
        y: 259.6
    }, {
        x: 413.7,
        y: 263.6
    }, {
        x: 415.2,
        y: 268.7
    }, {
        x: 416.6,
        y: 273.7
    }, {
        x: 418,
        y: 278.8
    }, {
        x: 419.5,
        y: 283.8
    }, {
        x: 420.9,
        y: 288.9
    }, {
        x: 422.3,
        y: 294
    }, {
        x: 423.8,
        y: 299
    }, {
        x: 419.9,
        y: 300.1
    }, {
        x: 414.6,
        y: 300.1
    }, {
        x: 409.4,
        y: 300.1
    }, {
        x: 406.4,
        y: 297.1
    }, {
        x: 405.1,
        y: 292
    }, {
        x: 403.9,
        y: 286.9
    }, {
        x: 402.6,
        y: 281.8
    }, {
        x: 401.3,
        y: 276.7
    }, {
        x: 400,
        y: 271.7
    }, {
        x: 398.8,
        y: 266.6
    }, {
        x: 396,
        y: 263.3
    }, {
        x: 392,
        y: 264.5
    }, {
        x: 392,
        y: 269.8
    }, {
        x: 392,
        y: 275
    }, {
        x: 392,
        y: 280.3
    }, {
        x: 392,
        y: 285.6
    }, {
        x: 392,
        y: 290.8
    }, {
        x: 392,
        y: 296.1
    }, {
        x: 390.7,
        y: 300.1
    }, {
        x: 385.4,
        y: 300.1
    }, {
        x: 380.2,
        y: 300.1
    }, {
        x: 375.6,
        y: 299.4
    }, {
        x: 375.6,
        y: 294.2
    }, {
        x: 375.6,
        y: 288.9
    }, {
        x: 375.6,
        y: 283.7
    }, {
        x: 375.6,
        y: 278.4
    }, {
        x: 375.6,
        y: 273.2
    }, {
        x: 375.6,
        y: 267.9
    }, {
        x: 375.6,
        y: 262.7
    }, {
        x: 375.6,
        y: 257.4
    }, {
        x: 375.6,
        y: 252.2
    }, {
        x: 375.6,
        y: 246.9
    }, {
        x: 375.6,
        y: 241.7
    }, {
        x: 375.6,
        y: 236.4
    }, {
        x: 375.6,
        y: 231.2
    }, {
        x: 375.6,
        y: 225.9
    }, {
        x: 375.6,
        y: 220.7
    }, {
        x: 371.9,
        y: 219.1
    }, {
        x: 366.7,
        y: 219.1
    }, {
        x: 361.4,
        y: 219.1
    }, {
        x: 356.2,
        y: 219.1
    }, {
        x: 350.9,
        y: 219.1
    }, {
        x: 353.1,
        y: 220.3
    }, {
        x: 357.5,
        y: 223.1
    }, {
        x: 360.8,
        y: 227.2
    }, {
        x: 362.9,
        y: 232
    }, {
        x: 364.1,
        y: 237.1
    }, {
        x: 364.5,
        y: 242.4
    }, {
        x: 364.6,
        y: 247.6
    }, {
        x: 364.6,
        y: 252.9
    }, {
        x: 364.6,
        y: 258.1
    }, {
        x: 364.6,
        y: 263.4
    }, {
        x: 364.6,
        y: 268.6
    }, {
        x: 364.6,
        y: 273.9
    }, {
        x: 364.4,
        y: 279.1
    }, {
        x: 363.6,
        y: 284.3
    }, {
        x: 362,
        y: 289.3
    }, {
        x: 359.4,
        y: 293.9
    }, {
        x: 355.6,
        y: 297.5
    }, {
        x: 350.9,
        y: 299.7
    }, {
        x: 345.8,
        y: 300.8
    }, {
        x: 340.5,
        y: 301.1
    }, {
        x: 335.3,
        y: 300.8
    }, {
        x: 330.2,
        y: 299.7
    }, {
        x: 325.5,
        y: 297.4
    }, {
        x: 321.7,
        y: 293.7
    }, {
        x: 319.2,
        y: 289.2
    }, {
        x: 317.7,
        y: 284.1
    }, {
        x: 316.9,
        y: 278.9
    }, {
        x: 316.7,
        y: 273.7
    }, {
        x: 316.7,
        y: 268.4
    }, {
        x: 316.7,
        y: 263.2
    }, {
        x: 316.7,
        y: 257.9
    }, {
        x: 316.7,
        y: 252.7
    }, {
        x: 316.7,
        y: 247.4
    }, {
        x: 316.8,
        y: 242.2
    }, {
        x: 317.3,
        y: 237
    }, {
        x: 318.4,
        y: 231.8
    }, {
        x: 320.6,
        y: 227.1
    }, {
        x: 323.9,
        y: 223
    }, {
        x: 328.3,
        y: 220.2
    }, {
        x: 330.2,
        y: 219.1
    }, {
        x: 324.9,
        y: 219.1
    }, {
        x: 319.7,
        y: 219.1
    }, {
        x: 314.4,
        y: 219.1
    }, {
        x: 309.7,
        y: 219.5
    }, {
        x: 309.7,
        y: 224.8
    }, {
        x: 309.7,
        y: 230.1
    }, {
        x: 304.7,
        y: 230.3
    }, {
        x: 299.4,
        y: 230.3
    }, {
        x: 294.2,
        y: 230.3
    }, {
        x: 291.8,
        y: 233.3
    }, {
        x: 291.8,
        y: 238.5
    }, {
        x: 291.8,
        y: 243.8
    }, {
        x: 291.8,
        y: 249
    }, {
        x: 294,
        y: 252.1
    }, {
        x: 299.2,
        y: 252.1
    }, {
        x: 304.5,
        y: 252.1
    }, {
        x: 307,
        y: 254.9
    }, {
        x: 307,
        y: 260.2
    }, {
        x: 305.2,
        y: 263.7
    }, {
        x: 299.9,
        y: 263.7
    }, {
        x: 294.7,
        y: 263.7
    }, {
        x: 291.8,
        y: 266.1
    }, {
        x: 291.8,
        y: 271.3
    }, {
        x: 291.8,
        y: 276.6
    }, {
        x: 291.8,
        y: 281.8
    }, {
        x: 291.8,
        y: 287.1
    }, {
        x: 291.8,
        y: 292.3
    }, {
        x: 291.8,
        y: 297.6
    }, {
        x: 289.1,
        y: 300.1
    }, {
        x: 283.8,
        y: 300.1
    }, {
        x: 278.6,
        y: 300.1
    }, {
        x: 275.5,
        y: 297.9
    }, {
        x: 275.5,
        y: 292.7
    }, {
        x: 275.5,
        y: 287.4
    }, {
        x: 275.5,
        y: 282.2
    }, {
        x: 275.5,
        y: 276.9
    }, {
        x: 275.5,
        y: 271.6
    }, {
        x: 275.5,
        y: 266.4
    }, {
        x: 275.5,
        y: 261.1
    }, {
        x: 275.5,
        y: 255.9
    }, {
        x: 275.5,
        y: 250.6
    }, {
        x: 275.5,
        y: 245.4
    }, {
        x: 275.5,
        y: 240.1
    }, {
        x: 275.5,
        y: 234.9
    }, {
        x: 275.5,
        y: 229.6
    }, {
        x: 275.5,
        y: 224.4
    }, {
        x: 275.5,
        y: 219.1
    }, {
        x: 270.3,
        y: 219.1
    }, {
        x: 265,
        y: 219.1
    }, {
        x: 259.8,
        y: 219.1
    }, {
        x: 254.5,
        y: 219.1
    }, {
        x: 256,
        y: 220.4
    }, {
        x: 259.9,
        y: 223.8
    }, {
        x: 262.5,
        y: 228.3
    }, {
        x: 264.2,
        y: 233.3
    }, {
        x: 265.1,
        y: 238.5
    }, {
        x: 262.1,
        y: 241
    }, {
        x: 256.9,
        y: 241.8
    }, {
        x: 251.7,
        y: 242.5
    }, {
        x: 250.6,
        y: 238.2
    }, {
        x: 249.5,
        y: 233.1
    }, {
        x: 245.4,
        y: 230.2
    }, {
        x: 240.6,
        y: 231.8
    }, {
        x: 238.9,
        y: 236.7
    }, {
        x: 239.6,
        y: 241.8
    }, {
        x: 242.4,
        y: 246.2
    }, {
        x: 246.2,
        y: 249.9
    }, {
        x: 250.1,
        y: 253.4
    }, {
        x: 254.1,
        y: 256.8
    }, {
        x: 257.9,
        y: 260.4
    }, {
        x: 261.2,
        y: 264.5
    }, {
        x: 264.1,
        y: 268.9
    }, {
        x: 265.9,
        y: 273.8
    }, {
        x: 266.7,
        y: 279
    }, {
        x: 266.5,
        y: 284.2
    }, {
        x: 265.2,
        y: 289.3
    }, {
        x: 262.5,
        y: 293.8
    }, {
        x: 258.7,
        y: 297.4
    }, {
        x: 254.1,
        y: 299.8
    }, {
        x: 249,
        y: 301
    }, {
        x: 243.7,
        y: 301.1
    }, {
        x: 238.5,
        y: 300.4
    }, {
        x: 233.6,
        y: 298.5
    }, {
        x: 229.4,
        y: 295.4
    }, {
        x: 226.4,
        y: 291.1
    }, {
        x: 224.5,
        y: 286.3
    }, {
        x: 223.4,
        y: 281.1
    }, {
        x: 223,
        y: 275.9
    }, {
        x: 228.2,
        y: 275.1
    }, {
        x: 233.4,
        y: 274.2
    }, {
        x: 237.2,
        y: 275
    }, {
        x: 237.8,
        y: 280.2
    }, {
        x: 239.4,
        y: 285.1
    }, {
        x: 243.4,
        y: 288.3
    }, {
        x: 248.4,
        y: 287.6
    }, {
        x: 250.6,
        y: 283
    }, {
        x: 250.2,
        y: 277.8
    }, {
        x: 248,
        y: 273
    }, {
        x: 244.6,
        y: 269.1
    }, {
        x: 240.7,
        y: 265.5
    }, {
        x: 236.7,
        y: 262.1
    }, {
        x: 232.8,
        y: 258.6
    }, {
        x: 229.1,
        y: 254.9
    }, {
        x: 226,
        y: 250.7
    }, {
        x: 224,
        y: 245.9
    }, {
        x: 223.1,
        y: 240.7
    }, {
        x: 223.2,
        y: 235.4
    }, {
        x: 224.4,
        y: 230.3
    }, {
        x: 226.8,
        y: 225.7
    }, {
        x: 230.6,
        y: 222.1
    }, {
        x: 235.2,
        y: 219.6
    }, {
        x: 233.5,
        y: 219.1
    }, {
        x: 228.3,
        y: 219.1
    }, {
        x: 223,
        y: 219.1
    }, {
        x: 217.8,
        y: 219.1
    }, {
        x: 212.8,
        y: 219.3
    }, {
        x: 212.8,
        y: 224.5
    }, {
        x: 212.8,
        y: 229.8
    }, {
        x: 212.8,
        y: 235
    }, {
        x: 212.8,
        y: 240.3
    }, {
        x: 212.8,
        y: 245.5
    }, {
        x: 212.8,
        y: 250.8
    }, {
        x: 212.8,
        y: 256
    }, {
        x: 212.8,
        y: 261.3
    }, {
        x: 212.8,
        y: 266.5
    }, {
        x: 212.8,
        y: 271.8
    }, {
        x: 212.8,
        y: 277
    }, {
        x: 212.8,
        y: 282.3
    }, {
        x: 212.8,
        y: 287.5
    }, {
        x: 212.8,
        y: 292.8
    }, {
        x: 212.8,
        y: 298
    }, {
        x: 209.5,
        y: 300.1
    }, {
        x: 204.3,
        y: 300.1
    }, {
        x: 200.7,
        y: 297.6
    }, {
        x: 198.7,
        y: 292.7
    }, {
        x: 196.7,
        y: 287.9
    }, {
        x: 194.8,
        y: 283
    }, {
        x: 192.8,
        y: 278.1
    }, {
        x: 190.9,
        y: 273.2
    }, {
        x: 188.9,
        y: 268.4
    }, {
        x: 187,
        y: 263.5
    }, {
        x: 185,
        y: 258.6
    }, {
        x: 183.6,
        y: 256.9
    }, {
        x: 183.6,
        y: 262.1
    }, {
        x: 183.6,
        y: 267.4
    }, {
        x: 183.6,
        y: 272.6
    }, {
        x: 183.6,
        y: 277.9
    }, {
        x: 183.6,
        y: 283.1
    }, {
        x: 183.6,
        y: 288.4
    }, {
        x: 183.6,
        y: 293.6
    }, {
        x: 183.6,
        y: 298.9
    }, {
        x: 179.6,
        y: 300.1
    }, {
        x: 174.3,
        y: 300.1
    }, {
        x: 169.6,
        y: 299.6
    }, {
        x: 169.6,
        y: 294.3
    }, {
        x: 169.6,
        y: 289.1
    }, {
        x: 169.6,
        y: 283.8
    }, {
        x: 169.6,
        y: 278.6
    }, {
        x: 169.6,
        y: 273.3
    }, {
        x: 169.6,
        y: 268
    }, {
        x: 169.6,
        y: 262.8
    }, {
        x: 169.6,
        y: 257.5
    }, {
        x: 169.6,
        y: 252.3
    }, {
        x: 169.6,
        y: 247
    }, {
        x: 169.6,
        y: 241.8
    }, {
        x: 169.6,
        y: 236.5
    }, {
        x: 169.6,
        y: 231.3
    }, {
        x: 169.6,
        y: 226
    }, {
        x: 169.6,
        y: 220.8
    }, {
        x: 166,
        y: 219.1
    }, {
        x: 160.8,
        y: 219.1
    }, {
        x: 155.5,
        y: 219.1
    }, {
        x: 150.3,
        y: 219.1
    }, {
        x: 145.9,
        y: 219.8
    }, {
        x: 146.9,
        y: 224.9
    }, {
        x: 147.9,
        y: 230.1
    }, {
        x: 148.9,
        y: 235.2
    }, {
        x: 149.9,
        y: 240.4
    }, {
        x: 150.9,
        y: 245.5
    }, {
        x: 151.8,
        y: 250.7
    }, {
        x: 152.8,
        y: 255.9
    }, {
        x: 153.8,
        y: 261
    }, {
        x: 154.8,
        y: 266.2
    }, {
        x: 155.8,
        y: 271.3
    }, {
        x: 156.8,
        y: 276.5
    }, {
        x: 157.8,
        y: 281.6
    }, {
        x: 158.8,
        y: 286.8
    }, {
        x: 159.8,
        y: 292
    }, {
        x: 160.8,
        y: 297.1
    }, {
        x: 159.1,
        y: 300.1
    }, {
        x: 153.8,
        y: 300.1
    }, {
        x: 148.6,
        y: 300.1
    }, {
        x: 145.7,
        y: 297.3
    }, {
        x: 144.8,
        y: 292.1
    }, {
        x: 143.9,
        y: 286.9
    }, {
        x: 142.6,
        y: 282.2
    }, {
        x: 137.4,
        y: 282.2
    }, {
        x: 132.1,
        y: 282.2
    }, {
        x: 129.8,
        y: 285.7
    }, {
        x: 128.9,
        y: 290.8
    }, {
        x: 128,
        y: 296
    }, {
        x: 126.1,
        y: 300.1
    }, {
        x: 120.8,
        y: 300.1
    }, {
        x: 115.6,
        y: 300.1
    }, {
        x: 112,
        y: 298.7
    }, {
        x: 113,
        y: 293.5
    }, {
        x: 114,
        y: 288.3
    }, {
        x: 115,
        y: 283.2
    }, {
        x: 116,
        y: 278
    }, {
        x: 117,
        y: 272.9
    }, {
        x: 118,
        y: 267.7
    }, {
        x: 119,
        y: 262.6
    }, {
        x: 120,
        y: 257.4
    }, {
        x: 121,
        y: 252.3
    }, {
        x: 122,
        y: 247.1
    }, {
        x: 123,
        y: 241.9
    }, {
        x: 124,
        y: 236.8
    }, {
        x: 125,
        y: 231.6
    }, {
        x: 126,
        y: 226.5
    }, {
        x: 127,
        y: 221.3
    }, {
        x: 124.5,
        y: 219.1
    }, {
        x: 119.3,
        y: 219.1
    }, {
        x: 114,
        y: 219.1
    }, {
        x: 108.8,
        y: 219.1
    }, {
        x: 103.5,
        y: 219.1
    }, {
        x: 98.3,
        y: 219.1
    }, {
        x: 93,
        y: 219.1
    }, {
        x: 87.8,
        y: 219.1
    }, {
        x: 82.5,
        y: 219.1
    }, {
        x: 82.8,
        y: 219.2
    }, {
        x: 88.1,
        y: 219.8
    }, {
        x: 93.1,
        y: 221.2
    }, {
        x: 97.8,
        y: 223.6
    }, {
        x: 101.5,
        y: 227.3
    }, {
        x: 103.7,
        y: 232
    }, {
        x: 104.6,
        y: 237.2
    }, {
        x: 104.7,
        y: 242.4
    }, {
        x: 104.2,
        y: 247.7
    }, {
        x: 102.8,
        y: 252.7
    }, {
        x: 99.9,
        y: 257.1
    }, {
        x: 95.7,
        y: 260.1
    }, {
        x: 95.9,
        y: 264.6
    }, {
        x: 97.3,
        y: 269.7
    }, {
        x: 98.8,
        y: 274.7
    }, {
        x: 100.2,
        y: 279.8
    }, {
        x: 101.6,
        y: 284.8
    }, {
        x: 103.1,
        y: 289.9
    }, {
        x: 104.5,
        y: 294.9
    }, {
        x: 105.9,
        y: 300
    }, {
        x: 100.7,
        y: 300.1
    }, {
        x: 95.5,
        y: 300.1
    }, {
        x: 90.2,
        y: 300.1
    }, {
        x: 88.1,
        y: 296.1
    }, {
        x: 86.8,
        y: 291
    }, {
        x: 85.5,
        y: 285.9
    }, {
        x: 84.2,
        y: 280.8
    }, {
        x: 83,
        y: 275.7
    }, {
        x: 81.7,
        y: 270.6
    }, {
        x: 80.4,
        y: 265.6
    }, {
        x: 76.9,
        y: 263.3
    }, {
        x: 73.9,
        y: 265.6
    }, {
        x: 73.9,
        y: 270.8
    }, {
        x: 73.9,
        y: 276.1
    }, {
        x: 73.9,
        y: 281.3
    }, {
        x: 73.9,
        y: 286.6
    }, {
        x: 73.9,
        y: 291.8
    }, {
        x: 73.9,
        y: 297.1
    }, {
        x: 71.6,
        y: 300.1
    }, {
        x: 66.3,
        y: 300.1
    }, {
        x: 61.1,
        y: 300.1
    }, {
        x: 57.5,
        y: 298.4
    }, {
        x: 57.5,
        y: 293.1
    }, {
        x: 57.5,
        y: 287.9
    }, {
        x: 57.5,
        y: 282.6
    }, {
        x: 57.5,
        y: 277.4
    }, {
        x: 57.5,
        y: 272.1
    }, {
        x: 57.5,
        y: 266.9
    }, {
        x: 57.5,
        y: 261.6
    }, {
        x: 57.5,
        y: 256.4
    }, {
        x: 57.5,
        y: 251.1
    }, {
        x: 57.5,
        y: 245.9
    }, {
        x: 57.5,
        y: 240.6
    }, {
        x: 57.5,
        y: 235.4
    }, {
        x: 57.5,
        y: 230.1
    }, {
        x: 57.5,
        y: 224.9
    }, {
        x: 57.5,
        y: 219.6
    }, {
        x: 52.8,
        y: 219.1
    }, {
        x: 50.2,
        y: 221.7
    }, {
        x: 50.2,
        y: 226.9
    }, {
        x: 49.2,
        y: 231.3
    }, {
        x: 44,
        y: 231.3
    }, {
        x: 38.7,
        y: 231.3
    }, {
        x: 37.9,
        y: 235.6
    }, {
        x: 37.9,
        y: 240.9
    }, {
        x: 37.9,
        y: 246.1
    }, {
        x: 37.9,
        y: 251.4
    }, {
        x: 37.9,
        y: 256.6
    }, {
        x: 37.9,
        y: 261.9
    }, {
        x: 37.9,
        y: 267.1
    }, {
        x: 37.9,
        y: 272.4
    }, {
        x: 37.9,
        y: 277.6
    }, {
        x: 37.9,
        y: 282.9
    }, {
        x: 37.9,
        y: 288.1
    }, {
        x: 37.9,
        y: 293.4
    }, {
        x: 37.9,
        y: 298.7
    }, {
        x: 34,
        y: 300.1
    }, {
        x: 28.7,
        y: 300.1
    }, {
        x: 23.5,
        y: 300.1
    }, {
        x: 21.2,
        y: 297
    }, {
        x: 21.2,
        y: 291.8
    }, {
        x: 21.2,
        y: 286.5
    }, {
        x: 21.2,
        y: 281.3
    }, {
        x: 21.3,
        y: 276
    }, {
        x: 21.3,
        y: 270.8
    }, {
        x: 21.3,
        y: 265.5
    }, {
        x: 21.3,
        y: 260.3
    }, {
        x: 21.3,
        y: 255
    }, {
        x: 21.3,
        y: 249.8
    }, {
        x: 21.3,
        y: 244.5
    }, {
        x: 21.3,
        y: 239.3
    }, {
        x: 21.3,
        y: 234
    }, {
        x: 18.8,
        y: 231.3
    }, {
        x: 13.5,
        y: 231.3
    }, {
        x: 8.8,
        y: 230.8
    }, {
        x: 8.8,
        y: 225.5
    }, {
        x: 8.8,
        y: 220.3
    }, {
        x: 8.8,
        y: 215
    }, {
        x: 8.8,
        y: 209.8
    }, {
        x: 8.8,
        y: 204.5
    }, {
        x: 8.8,
        y: 199.3
    }, {
        x: 8.8,
        y: 194
    }, {
        x: 8.8,
        y: 188.8
    }, {
        x: 8.8,
        y: 183.5
    }];
    function et(t) {
        return function(t) {
            if (Array.isArray(t))
                return nt(t)
        }(t) || function(t) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
                return Array.from(t)
        }(t) || function(t, e) {
            if (!t)
                return;
            if ("string" == typeof t)
                return nt(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return nt(t, e)
        }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function nt(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function rt(t) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 128, n = [], r = 0; r < e; r++) {
            var i = r / e;
            n.push(t(i))
        }
        return n
    }
    function it(t) {
        var e = Math.min.apply(Math, et(t))
          , n = Math.max.apply(Math, et(t));
        return t.map((function(t) {
            return v(-1, 1, (t - e) / (n - e))
        }
        ))
    }
    function ot(t) {
        return t < .5 ? -1 : 1
    }
    function at(t) {
        for (var e = t.context, n = t.wave, r = t.width, i = t.yPosition, o = void 0 === i ? 0 : i, a = t.yMultiple, y = t.startXAmt, u = void 0 === y ? 0 : y, c = t.type, s = void 0 === c ? "wave" : c, l = 1 / n.length, x = u, f = 0; x <= 1 + l; x += l,
        f++) {
            var h = r * x
              , p = o + a * n[f % n.length];
            "wave" == s ? 0 == f ? e.moveTo(h, p) : e.lineTo(h, p) : "samples" == s && (e.beginPath(),
            e.arc(h, p, 2, 0, 2 * Math.PI),
            e.fill())
        }
    }
    function yt(t) {
        return (yt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function ut(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function ct(t, e) {
        return (ct = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function st(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = xt(t);
            if (e) {
                var i = xt(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return lt(this, n)
        }
    }
    function lt(t, e) {
        return !e || "object" !== yt(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function xt(t) {
        return (xt = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var ft = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && ct(t, e)
        }(o, t);
        var e, n, r, i = st(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).animAmt = 0,
            r.wavePoints = [],
            r
        }
        return e = o,
        (n = [{
            key: "setPath",
            value: function(t) {
                this.wavePoints = t
            }
        }, {
            key: "update",
            value: function(t, e) {
                this.animAmt += t / 7,
                this.animAmt %= 1
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.renderWave()
            }
        }, {
            key: "renderWave",
            value: function() {
                if (0 != this.wavePoints.length) {
                    this.context.strokeStyle = P,
                    this.context.lineWidth = 2;
                    var t = .1 * this.height
                      , e = .5 * this.context.canvas.height
                      , n = -this.animAmt;
                    this.context.beginPath(),
                    at({
                        context: this.context,
                        width: this.width,
                        wave: this.wavePoints,
                        yPosition: e,
                        yMultiple: t,
                        startXAmt: n
                    }),
                    this.context.stroke()
                }
            }
        }]) && ut(e.prototype, n),
        r && ut(e, r),
        o
    }(p);
    function ht(t) {
        return (ht = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function pt(t) {
        return function(t) {
            if (Array.isArray(t))
                return mt(t)
        }(t) || function(t) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
                return Array.from(t)
        }(t) || function(t, e) {
            if (!t)
                return;
            if ("string" == typeof t)
                return mt(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return mt(t, e)
        }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function mt(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function dt(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function vt(t, e) {
        return (vt = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function gt(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = wt(t);
            if (e) {
                var i = wt(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return bt(this, n)
        }
    }
    function bt(t, e) {
        return !e || "object" !== ht(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function wt(t) {
        return (wt = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var At = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && vt(t, e)
        }(o, t);
        var e, n, r, i = gt(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).animAmt = 0,
            r.wavePoints = [],
            r.partialWave = [],
            r.fourierPoints = [],
            r.onFourierChange = [],
            r.waveTop = 0,
            r.waveBottom = 0,
            r.totalHeight = 0,
            r.fadeFrequencies = !0,
            r.splitAnim = !0,
            r.fourierAmt = 1,
            r
        }
        return e = o,
        (n = [{
            key: "setPath",
            value: function(t) {
                var e = this
                  , n = t.reduce((function(t, e) {
                    return t + e
                }
                ), 0) / t.length;
                this.wavePoints = t.map((function(t) {
                    return t - n
                }
                )),
                this.fourierData = function(t) {
                    if (0 == t.length)
                        return [];
                    var e = t.length
                      , n = new R.a(e)
                      , r = n.createComplexArray();
                    n.toComplexArray(t, r);
                    var i = n.createComplexArray();
                    n.transform(i, r);
                    for (var o = [], a = 0; a < e / 2; a++) {
                        var y = i[2 * a]
                          , u = i[2 * a + 1]
                          , c = a;
                        o.push({
                            freq: c,
                            amplitude: 2 * Math.sqrt(y * y + u * u) / e,
                            phase: Math.atan2(u, y)
                        })
                    }
                    return o
                }(this.wavePoints).filter((function(t) {
                    return t.amplitude > .001
                }
                )),
                this.fourierData.sort((function(t, e) {
                    return e.amplitude - t.amplitude
                }
                )),
                this.waveTop = Math.min.apply(Math, pt(this.wavePoints)),
                this.waveBottom = Math.max.apply(Math, pt(this.wavePoints)),
                this.totalHeight = this.waveBottom - this.waveTop,
                this.fourierData.forEach((function(t) {
                    return e.totalHeight += 2 * t.amplitude
                }
                )),
                this.animAmt = 0,
                this.splitAmt = 0,
                this.onFourierChange.forEach((function(t) {
                    return t()
                }
                ))
            }
        }, {
            key: "update",
            value: function(t, e) {
                this.animAmt += t / 7,
                this.animAmt %= 1;
                var n = 0;
                (n = 1),
                this.splitAmt += 1 / 15 * (n - this.splitAmt)
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.renderWaves()
            }
        }, {
            key: "renderWaves",
            value: function() {
                if (0 != this.wavePoints.length) {
                    this.context.strokeStyle = S,
                    this.context.lineWidth = 2;
                    var t = Math.min(50, this.fourierData.length)
                      , e = .1 * this.context.canvas.height
                      , n = (.9 * this.context.canvas.height - e) / this.totalHeight
                      , r = 0
                      , i = -this.animAmt
                      , o = 1
                      , a = 1;
                    this.splitAnim && (a = o = this.splitAmt),
                    r += this.waveBottom - this.waveTop,
                    this.partialWave = this.wavePoints.slice().fill(0);
                    for (var y = Math.round(v(1, t, this.fourierAmt)), u = 0; u < y; u++) {
                        var c = u / (t - 1)
                          , s = this.fourierData[u];
                        r += s.amplitude;
                        for (var l = v(-this.waveTop, r, o), x = this.wavePoints.slice(), f = 0; f < this.wavePoints.length; f++) {
                            var h = f / this.wavePoints.length
                              , p = this.wavePoints[f]
                              , m = s.amplitude * Math.cos(2 * Math.PI * s.freq * h + s.phase);
                            x[f] = v(p, m, o),
                            this.partialWave[f] += x[f]
                        }
                        this.context.beginPath(),
                        this.context.globalAlpha = a,
                        this.fadeFrequencies && (this.context.globalAlpha *= 1 - c),
                        at({
                            context: this.context,
                            width: this.width,
                            wave: x,
                            yPosition: e + n * l,
                            yMultiple: .8 * n,
                            startXAmt: i
                        }),
                        this.context.stroke(),
                        this.context.globalAlpha = 1,
                        r += s.amplitude
                    }
                    r = 0,
                    r -= this.waveTop,
                    1 == this.fourierAmt && (this.partialWave = this.wavePoints),
                    this.context.strokeStyle = P,
                    this.context.lineWidth = 2,
                    this.context.beginPath(),
                    at({
                        context: this.context,
                        width: this.width,
                        wave: this.partialWave,
                        yPosition: e + n * r,
                        yMultiple: .8 * n,
                        startXAmt: i
                    }),
                    this.context.stroke()
                }
            }
        }]) && dt(e.prototype, n),
        r && dt(e, r),
        o
    }(p);
    function Pt(t, e) {
        return function(t) {
            if (Array.isArray(t))
                return t
        }(t) || function(t, e) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t)))
                return;
            var n = []
              , r = !0
              , i = !1
              , o = void 0;
            try {
                for (var a, y = t[Symbol.iterator](); !(r = (a = y.next()).done) && (n.push(a.value),
                !e || n.length !== e); r = !0)
                    ;
            } catch (t) {
                i = !0,
                o = t
            } finally {
                try {
                    r || null == y.return || y.return()
                } finally {
                    if (i)
                        throw o
                }
            }
            return n
        }(t, e) || function(t, e) {
            if (!t)
                return;
            if ("string" == typeof t)
                return St(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return St(t, e)
        }(t, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function St(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function Ot(t, e, n, r, i, o, a, y, u) {
        var c = [e, n]
          , s = [r, i]
          , l = [o, a];
        t.beginPath(),
        t.globalAlpha = .1;
        for (var x = 0, f = [[0, 0], [0, 1], [1, 0], [1, 1]]; x < f.length; x++) {
            var h = Pt(f[x], 2)
              , p = h[0]
              , m = h[1];
            Et(t, c[0], s[p], l[m], c[1], s[p], l[m], y, u),
            Et(t, c[p], s[0], l[m], c[p], s[1], l[m], y, u),
            Et(t, c[p], s[m], l[0], c[p], s[m], l[1], y, u)
        }
        t.stroke(),
        t.globalAlpha = 1
    }
    function Et(t, e, n, r, i, o, a, y, u) {
        var c = w(e, n, r, y, u)
          , s = w(i, o, a, y, u);
        t.moveTo(c.x, c.y),
        t.lineTo(s.x, s.y)
    }
    function _t(t) {
        return (_t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function kt(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function jt(t, e) {
        return (jt = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function Mt(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Tt(t);
            if (e) {
                var i = Tt(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return It(this, n)
        }
    }
    function It(t, e) {
        return !e || "object" !== _t(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Tt(t) {
        return (Tt = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var Ct = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && jt(t, e)
        }(o, t);
        var e, n, r, i = Mt(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).xzAngle = Math.PI / 4,
            r.yAngle = -Math.PI / 6,
            r.sinusoidController = new K(t,e,n),
            r.sinusoidController.xzAngleFn = function() {
                return r.xzAngle
            }
            ,
            r.sinusoidController.yAngleFn = function() {
                return r.yAngle
            }
            ,
            r
        }
        return e = o,
        (n = [{
            key: "update",
            value: function(t, e) {
                this.sinusoidController.update(t, e);
                var n = this.getScrollPosition()
                  , r = Math.PI / 8;
                this.xzAngle = Math.PI / 4 + v(-r, r, n)
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.sinusoidController.renderWave();
                var t = this.sinusoidController.radius
                  , e = .5 * this.sinusoidController.length
                  , n = this.sinusoidController.radius;
                this.context.lineWidth = 1,
                this.context.strokeStyle = A,
                Ot(this.context, -e, e, -t, t, -n, n, this.xzAngle, this.yAngle)
            }
        }]) && kt(e.prototype, n),
        r && kt(e, r),
        o
    }(p);
    function Dt(t) {
        return (Dt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function Rt(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function Bt(t, e) {
        return (Bt = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function zt(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Lt(t);
            if (e) {
                var i = Lt(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return Ft(this, n)
        }
    }
    function Ft(t, e) {
        return !e || "object" !== Dt(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Lt(t) {
        return (Lt = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var Ut = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && Bt(t, e)
        }(o, t);
        var e, n, r, i = zt(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).wavePoints = new Array(128).fill(r.height / 2),
            r.drawing = !1,
            r.onDrawingStart = [],
            r.onDrawingEnd = [],
            r.lastMousePoint = null,
            r.canvas.addEventListener("mousedown", (function() {
                return r.startDrawing()
            }
            )),
            r.canvas.addEventListener("touchstart", (function() {
                return r.startDrawing()
            }
            )),
            document.addEventListener("mouseup", (function() {
                return r.stopDrawing()
            }
            )),
            document.addEventListener("touchend", (function() {
                return r.stopDrawing()
            }
            )),
            r.canvas.addEventListener("touchmove", (function(t) {
                return t.preventDefault()
            }
            ), {
                passive: !1
            }),
            r
        }
        return e = o,
        (n = [{
            key: "startDrawing",
            value: function() {
                this.drawing = !0,
                this.lastMousePoint = null,
                this.onDrawingStart.forEach((function(t) {
                    return t()
                }
                ))
            }
        }, {
            key: "stopDrawing",
            value: function() {
                this.drawing && (this.drawing = !1,
                this.lastMousePoint = null,
                this.onDrawingEnd.forEach((function(t) {
                    return t()
                }
                )))
            }
        }, {
            key: "update",
            value: function(t, e) {
                if (e && this.drawing) {
                    var n = this.canvas.getBoundingClientRect()
                      , r = 500 / (n.right - n.left - 2)
                      , i = {
                        x: r * (e.x - n.x),
                        y: r * (e.y - n.y)
                    };
                    null == this.lastMousePoint && (this.lastMousePoint = i);
                    for (var o = Math.abs(i.x - this.lastMousePoint.x), a = this.width / this.wavePoints.length, y = 2 * Math.ceil(o / a) + 1, u = 0; u < y; u++) {
                        var c = (u - 1) / y
                          , s = this.getNearestIndex(v(this.lastMousePoint.x, i.x, c));
                        this.wavePoints[s] = v(this.lastMousePoint.y, i.y, c)
                    }
                    this.lastMousePoint = i
                }
            }
        }, {
            key: "getNearestIndex",
            value: function(t) {
                var e = t / this.width
                  , n = Math.round(this.wavePoints.length * e) % this.wavePoints.length;
                return n < 0 && (n += this.wavePoints.length),
                n
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.renderWave()
            }
        }, {
            key: "renderWave",
            value: function() {
                this.context.beginPath(),
                this.context.lineWidth = 2,
                this.context.strokeStyle = O;
                for (var t = 0; t <= this.wavePoints.length; t++) {
                    var e = t % this.wavePoints.length
                      , n = t / this.wavePoints.length
                      , r = this.width * n
                      , i = this.wavePoints[e];
                    0 == t ? this.context.moveTo(r, i) : this.context.lineTo(r, i)
                }
                this.context.stroke()
            }
        }, {
            key: "normPath",
            get: function() {
                var t = this;
                return this.wavePoints.map((function(e) {
                    return e / t.height
                }
                ))
            }
        }]) && Rt(e.prototype, n),
        r && Rt(e, r),
        o
    }(p);
    function Wt(t) {
        return (Wt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function Qt(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function qt(t, e) {
        return (qt = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function Yt(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Ht(t);
            if (e) {
                var i = Ht(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return Xt(this, n)
        }
    }
    function Xt(t, e) {
        return !e || "object" !== Wt(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Ht(t) {
        return (Ht = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var Vt = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && qt(t, e)
        }(o, t);
        var e, n, r, i = Yt(o);
        function o(t) {
            var e;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (e = i.call(this)).id = t,
            e.slider = document.getElementById(t),
            e.onValueChange = [],
            e.holdValueCount = 0,
            e.holdValueLength = 10,
            e.heldValue = 0,
            e.resumeCount = 0,
            e.resumeLength = 2,
            e.animate = !0,
            e.animAmt = 0,
            e.period = 10,
            e.slider.oninput = function() {
                return e.holdValue()
            }
            ,
            e
        }
        return e = o,
        (n = [{
            key: "update",
            value: function(t, e) {
                var n = this;
                if (this.animate) {
                    if (this.holdValueCount > 0)
                        return this.holdValueCount -= t,
                        void (this.holdValueCount <= 0 && (this.holdValueCount = 0));
                    this.resumeCount > 0 && (this.resumeCount -= t,
                    this.resumeCount <= 0 && (this.resumeCount = 0));
                    var r = function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2
                          , n = Math.pow(t, e);
                        return n / (n + Math.pow(1 - t, e))
                    }(1 - this.resumeCount / this.resumeLength, 3);
                    this.animAmt += r * t / this.period,
                    this.animAmt %= 1;
                    var i = .5 * Math.cos(2 * Math.PI * this.animAmt) + .5;
                    this.slider.value = i,
                    this.onValueChange.forEach((function(t) {
                        return t(n.slider.value)
                    }
                    ))
                }
            }
        }, {
            key: "holdValue",
            value: function() {
                var t = this;
                this.holdValueCount = this.holdValueLength,
                this.resumeCount = this.resumeLength,
                this.heldValue = this.slider.value,
                this.animAmt = Math.acos(2 * this.heldValue - 1) / (2 * Math.PI),
                this.onValueChange.forEach((function(e) {
                    return e(t.slider.value)
                }
                ))
            }
        }]) && Qt(e.prototype, n),
        r && Qt(e, r),
        o
    }(a)
      , Nt = [{
        x: 196.9,
        y: 228.8
    }, {
        x: 196.7,
        y: 225.2
    }, {
        x: 196.6,
        y: 221.6
    }, {
        x: 196.3,
        y: 218
    }, {
        x: 195.9,
        y: 214.3
    }, {
        x: 195.5,
        y: 210.7
    }, {
        x: 195.1,
        y: 207.1
    }, {
        x: 194.7,
        y: 203.5
    }, {
        x: 194.3,
        y: 199.9
    }, {
        x: 194.3,
        y: 196.3
    }, {
        x: 195.1,
        y: 192.7
    }, {
        x: 196.7,
        y: 189.5
    }, {
        x: 198.9,
        y: 186.6
    }, {
        x: 201.7,
        y: 184.3
    }, {
        x: 204.9,
        y: 182.6
    }, {
        x: 208.4,
        y: 181.6
    }, {
        x: 212,
        y: 181.3
    }, {
        x: 215.6,
        y: 181.7
    }, {
        x: 219,
        y: 182.9
    }, {
        x: 221.9,
        y: 184.3
    }, {
        x: 224.7,
        y: 186.6
    }, {
        x: 226.9,
        y: 189.5
    }, {
        x: 228.2,
        y: 192
    }, {
        x: 227.8,
        y: 188.4
    }, {
        x: 227.4,
        y: 184.7
    }, {
        x: 227,
        y: 181.1
    }, {
        x: 227,
        y: 177.5
    }, {
        x: 227.9,
        y: 174
    }, {
        x: 229.5,
        y: 170.7
    }, {
        x: 231.7,
        y: 167.9
    }, {
        x: 234.5,
        y: 165.5
    }, {
        x: 237.6,
        y: 163.8
    }, {
        x: 241.1,
        y: 162.8
    }, {
        x: 244.8,
        y: 162.5
    }, {
        x: 248.4,
        y: 162.9
    }, {
        x: 251.8,
        y: 164
    }, {
        x: 254.9,
        y: 165.8
    }, {
        x: 257.6,
        y: 168.3
    }, {
        x: 259.1,
        y: 169.3
    }, {
        x: 258.4,
        y: 165.7
    }, {
        x: 257.7,
        y: 162.2
    }, {
        x: 257.1,
        y: 158.6
    }, {
        x: 256.4,
        y: 155
    }, {
        x: 255.7,
        y: 151.4
    }, {
        x: 255.1,
        y: 147.9
    }, {
        x: 254.4,
        y: 144.3
    }, {
        x: 253.7,
        y: 140.7
    }, {
        x: 253.1,
        y: 137.2
    }, {
        x: 252.4,
        y: 133.6
    }, {
        x: 251.8,
        y: 130
    }, {
        x: 251.1,
        y: 126.5
    }, {
        x: 250.4,
        y: 122.9
    }, {
        x: 249.8,
        y: 119.3
    }, {
        x: 249.1,
        y: 115.7
    }, {
        x: 248.4,
        y: 112.2
    }, {
        x: 247.8,
        y: 108.6
    }, {
        x: 247.1,
        y: 105
    }, {
        x: 246.4,
        y: 101.5
    }, {
        x: 245.8,
        y: 97.9
    }, {
        x: 245.7,
        y: 94.3
    }, {
        x: 246.5,
        y: 90.7
    }, {
        x: 248.1,
        y: 87.5
    }, {
        x: 250.3,
        y: 84.6
    }, {
        x: 253.1,
        y: 82.2
    }, {
        x: 256.3,
        y: 80.5
    }, {
        x: 259.7,
        y: 79.6
    }, {
        x: 263.2,
        y: 79.2
    }, {
        x: 265.9,
        y: 79.2
    }, {
        x: 269.4,
        y: 80.1
    }, {
        x: 272.6,
        y: 81.7
    }, {
        x: 275.4,
        y: 84.1
    }, {
        x: 277.6,
        y: 87
    }, {
        x: 279.1,
        y: 90.2
    }, {
        x: 280.1,
        y: 93.7
    }, {
        x: 280.7,
        y: 97.3
    }, {
        x: 281.4,
        y: 100.9
    }, {
        x: 282.1,
        y: 104.4
    }, {
        x: 282.8,
        y: 108
    }, {
        x: 283.4,
        y: 111.6
    }, {
        x: 284.1,
        y: 115.1
    }, {
        x: 284.8,
        y: 118.7
    }, {
        x: 285.5,
        y: 122.3
    }, {
        x: 286.1,
        y: 125.8
    }, {
        x: 286.8,
        y: 129.4
    }, {
        x: 287.5,
        y: 133
    }, {
        x: 288.2,
        y: 136.6
    }, {
        x: 288.8,
        y: 140.1
    }, {
        x: 289.5,
        y: 143.7
    }, {
        x: 290.2,
        y: 147.3
    }, {
        x: 290.9,
        y: 150.8
    }, {
        x: 291.5,
        y: 154.4
    }, {
        x: 292.2,
        y: 158
    }, {
        x: 292.9,
        y: 161.5
    }, {
        x: 293.6,
        y: 165.1
    }, {
        x: 294.3,
        y: 168.7
    }, {
        x: 294.9,
        y: 172.2
    }, {
        x: 295.6,
        y: 175.8
    }, {
        x: 296.3,
        y: 179.4
    }, {
        x: 297,
        y: 182.9
    }, {
        x: 297.6,
        y: 186.5
    }, {
        x: 298.3,
        y: 190.1
    }, {
        x: 299.1,
        y: 187.5
    }, {
        x: 299.9,
        y: 184
    }, {
        x: 300.8,
        y: 180.4
    }, {
        x: 301.6,
        y: 176.9
    }, {
        x: 302.4,
        y: 173.3
    }, {
        x: 303.2,
        y: 169.8
    }, {
        x: 304.1,
        y: 166.3
    }, {
        x: 304.9,
        y: 162.7
    }, {
        x: 305.7,
        y: 159.2
    }, {
        x: 306.5,
        y: 155.7
    }, {
        x: 307.3,
        y: 152.1
    }, {
        x: 308.2,
        y: 148.6
    }, {
        x: 309,
        y: 145
    }, {
        x: 309.8,
        y: 141.5
    }, {
        x: 310.6,
        y: 138
    }, {
        x: 311.5,
        y: 134.4
    }, {
        x: 312.3,
        y: 130.9
    }, {
        x: 313.1,
        y: 127.4
    }, {
        x: 313.9,
        y: 123.8
    }, {
        x: 314.8,
        y: 120.3
    }, {
        x: 315.6,
        y: 116.8
    }, {
        x: 316.4,
        y: 113.2
    }, {
        x: 317.2,
        y: 109.7
    }, {
        x: 318,
        y: 106.1
    }, {
        x: 318.9,
        y: 102.6
    }, {
        x: 319.7,
        y: 99.1
    }, {
        x: 320.5,
        y: 95.5
    }, {
        x: 321.5,
        y: 92
    }, {
        x: 323.1,
        y: 88.8
    }, {
        x: 325.5,
        y: 86.1
    }, {
        x: 328.4,
        y: 83.9
    }, {
        x: 331.6,
        y: 82.3
    }, {
        x: 335.2,
        y: 81.4
    }, {
        x: 338.8,
        y: 81.2
    }, {
        x: 342.4,
        y: 81.8
    }, {
        x: 345.7,
        y: 83.1
    }, {
        x: 348.7,
        y: 84.6
    }, {
        x: 351.6,
        y: 86.9
    }, {
        x: 353.8,
        y: 89.7
    }, {
        x: 355.2,
        y: 93.1
    }, {
        x: 355.7,
        y: 96.7
    }, {
        x: 355.6,
        y: 100.3
    }, {
        x: 354.9,
        y: 103.9
    }, {
        x: 354.1,
        y: 107.4
    }, {
        x: 353.3,
        y: 110.9
    }, {
        x: 352.4,
        y: 114.5
    }, {
        x: 351.6,
        y: 118
    }, {
        x: 350.8,
        y: 121.5
    }, {
        x: 350,
        y: 125.1
    }, {
        x: 349.2,
        y: 128.6
    }, {
        x: 348.3,
        y: 132.2
    }, {
        x: 347.5,
        y: 135.7
    }, {
        x: 346.7,
        y: 139.2
    }, {
        x: 345.9,
        y: 142.8
    }, {
        x: 345,
        y: 146.3
    }, {
        x: 344.2,
        y: 149.8
    }, {
        x: 343.4,
        y: 153.4
    }, {
        x: 342.6,
        y: 156.9
    }, {
        x: 341.8,
        y: 160.5
    }, {
        x: 340.9,
        y: 164
    }, {
        x: 340.1,
        y: 167.5
    }, {
        x: 339.3,
        y: 171.1
    }, {
        x: 338.5,
        y: 174.6
    }, {
        x: 337.7,
        y: 178.1
    }, {
        x: 336.8,
        y: 181.7
    }, {
        x: 336,
        y: 185.2
    }, {
        x: 335.2,
        y: 188.8
    }, {
        x: 334.4,
        y: 192.3
    }, {
        x: 333.5,
        y: 195.8
    }, {
        x: 332.7,
        y: 199.4
    }, {
        x: 331.9,
        y: 202.9
    }, {
        x: 331.1,
        y: 206.4
    }, {
        x: 332.7,
        y: 208.8
    }, {
        x: 335.9,
        y: 210.6
    }, {
        x: 338.9,
        y: 212.6
    }, {
        x: 341.6,
        y: 215
    }, {
        x: 343.8,
        y: 217.9
    }, {
        x: 345.6,
        y: 221.1
    }, {
        x: 347,
        y: 224.4
    }, {
        x: 348.2,
        y: 227.8
    }, {
        x: 349.2,
        y: 231.3
    }, {
        x: 350,
        y: 234.9
    }, {
        x: 350.7,
        y: 238.4
    }, {
        x: 351.1,
        y: 242
    }, {
        x: 351.4,
        y: 245.6
    }, {
        x: 351.5,
        y: 249.3
    }, {
        x: 351.3,
        y: 252.9
    }, {
        x: 350.9,
        y: 256.5
    }, {
        x: 350.2,
        y: 260.1
    }, {
        x: 349.2,
        y: 263.6
    }, {
        x: 348,
        y: 267
    }, {
        x: 346.8,
        y: 270.4
    }, {
        x: 345.4,
        y: 273.8
    }, {
        x: 343.9,
        y: 277.1
    }, {
        x: 342.5,
        y: 280.4
    }, {
        x: 341,
        y: 283.7
    }, {
        x: 339.4,
        y: 287
    }, {
        x: 336.9,
        y: 289.5
    }, {
        x: 334.7,
        y: 292.5
    }, {
        x: 332.5,
        y: 295.3
    }, {
        x: 330.1,
        y: 298
    }, {
        x: 327.5,
        y: 300.6
    }, {
        x: 324.8,
        y: 303
    }, {
        x: 322,
        y: 305.3
    }, {
        x: 319.1,
        y: 307.5
    }, {
        x: 316,
        y: 309.4
    }, {
        x: 312.9,
        y: 311.2
    }, {
        x: 309.6,
        y: 312.9
    }, {
        x: 306.3,
        y: 314.4
    }, {
        x: 302.9,
        y: 315.7
    }, {
        x: 299.5,
        y: 316.8
    }, {
        x: 296,
        y: 317.8
    }, {
        x: 292.5,
        y: 318.7
    }, {
        x: 288.9,
        y: 319.4
    }, {
        x: 285.3,
        y: 320
    }, {
        x: 281.7,
        y: 320.4
    }, {
        x: 278.1,
        y: 320.7
    }, {
        x: 274.5,
        y: 320.9
    }, {
        x: 270.8,
        y: 321
    }, {
        x: 267.2,
        y: 320.8
    }, {
        x: 263.6,
        y: 320.6
    }, {
        x: 260,
        y: 320.2
    }, {
        x: 256.4,
        y: 319.6
    }, {
        x: 252.8,
        y: 318.8
    }, {
        x: 249.3,
        y: 318
    }, {
        x: 245.8,
        y: 316.9
    }, {
        x: 242.4,
        y: 315.7
    }, {
        x: 239,
        y: 314.4
    }, {
        x: 235.7,
        y: 312.9
    }, {
        x: 232.5,
        y: 311.3
    }, {
        x: 229.3,
        y: 309.5
    }, {
        x: 226.3,
        y: 307.5
    }, {
        x: 223.3,
        y: 305.4
    }, {
        x: 220.6,
        y: 303
    }, {
        x: 217.9,
        y: 300.5
    }, {
        x: 215.5,
        y: 297.8
    }, {
        x: 213.3,
        y: 294.9
    }, {
        x: 211.3,
        y: 291.9
    }, {
        x: 209.5,
        y: 288.7
    }, {
        x: 207.9,
        y: 285.5
    }, {
        x: 206.5,
        y: 282.1
    }, {
        x: 205.2,
        y: 278.8
    }, {
        x: 204,
        y: 275.3
    }, {
        x: 202.9,
        y: 271.9
    }, {
        x: 202,
        y: 268.4
    }, {
        x: 201.1,
        y: 264.8
    }, {
        x: 200.3,
        y: 261.3
    }, {
        x: 199.6,
        y: 257.7
    }, {
        x: 199,
        y: 254.1
    }, {
        x: 198.4,
        y: 250.6
    }, {
        x: 198,
        y: 247
    }, {
        x: 197.6,
        y: 243.3
    }, {
        x: 197.4,
        y: 239.7
    }, {
        x: 197.3,
        y: 236.1
    }, {
        x: 197.1,
        y: 232.5
    }];
    function $t(t) {
        return ($t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function Zt(t) {
        return function(t) {
            if (Array.isArray(t))
                return Kt(t)
        }(t) || function(t) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
                return Array.from(t)
        }(t) || function(t, e) {
            if (!t)
                return;
            if ("string" == typeof t)
                return Kt(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return Kt(t, e)
        }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function Kt(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function Gt(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function Jt(t, e) {
        return (Jt = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function te(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = ne(t);
            if (e) {
                var i = ne(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return ee(this, n)
        }
    }
    function ee(t, e) {
        return !e || "object" !== $t(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function ne(t) {
        return (ne = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var re = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && Jt(t, e)
        }(o, t);
        var e, n, r, i = te(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).xzAngle = -3 * Math.PI / 4,
            r.yAngle = -Math.PI / 6,
            r.path = [],
            r.length = .7 * r.width,
            r.minX = -.5 * r.length,
            r.maxX = .5 * r.length,
            r.minY = 0,
            r.maxY = 0,
            r.minZ = 0,
            r.maxZ = 0,
            r.animAmt = 0,
            r.period = 4,
            r
        }
        return e = o,
        (n = [{
            key: "setPath",
            value: function(t) {
                var e = this;
                this.path = t.map((function(t) {
                    return {
                        x: t.x - e.width / 2,
                        y: t.y - e.height / 2
                    }
                }
                )),
                this.minY = Math.min.apply(Math, Zt(this.path.map((function(t) {
                    return t.y
                }
                )))),
                this.maxY = Math.max.apply(Math, Zt(this.path.map((function(t) {
                    return t.y
                }
                )))),
                this.minZ = Math.min.apply(Math, Zt(this.path.map((function(t) {
                    return t.x
                }
                )))),
                this.maxZ = Math.max.apply(Math, Zt(this.path.map((function(t) {
                    return t.x
                }
                ))))
            }
        }, {
            key: "update",
            value: function(t, e) {
                this.animAmt += t / this.period,
                this.animAmt %= 1;
                var n = this.getScrollPosition()
                  , r = Math.PI / 8;
                this.xzAngle = -.75 * Math.PI + v(-r, r, n)
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2),
                this.context.strokeStyle = P,
                this.context.lineWidth = 2,
                this.renderPath(this.minX, this.maxX),
                this.context.globalAlpha = .2,
                this.context.strokeStyle = P,
                this.context.lineWidth = 2,
                this.renderPath(this.maxX, this.maxX),
                this.context.globalAlpha = 1,
                this.context.lineWidth = 1,
                this.context.strokeStyle = A,
                Ot(this.context, this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ, this.xzAngle, this.yAngle)
            }
        }, {
            key: "renderPath",
            value: function(t, e) {
                for (var n = -this.animAmt, r = 0, i = .5 / this.path.length; n < 0; )
                    n += i,
                    r++;
                this.context.beginPath();
                for (var o = n, a = r; o <= 1 + i; o += i,
                a++) {
                    var y = a % this.path.length
                      , u = v(t, e, o)
                      , c = this.path[y]
                      , s = w(u, c.y, c.x, this.xzAngle, this.yAngle);
                    0 == a ? this.context.moveTo(s.x, s.y) : this.context.lineTo(s.x, s.y)
                }
                this.context.stroke()
            }
        }]) && Gt(e.prototype, n),
        r && Gt(e, r),
        o
    }(p)
      , ie = [{
        x: 114,
        y: 210.25
    }, {
        x: 122,
        y: 208.25
    }, {
        x: 130,
        y: 206.25
    }, {
        x: 138,
        y: 206.25
    }, {
        x: 146,
        y: 206.25
    }, {
        x: 154,
        y: 202.25
    }, {
        x: 164,
        y: 202.25
    }, {
        x: 174,
        y: 204.25
    }, {
        x: 182,
        y: 206.25
    }, {
        x: 188,
        y: 208.25
    }, {
        x: 194,
        y: 210.25
    }, {
        x: 200,
        y: 212.25
    }, {
        x: 206,
        y: 216.25
    }, {
        x: 210,
        y: 222.25
    }, {
        x: 212,
        y: 228.25
    }, {
        x: 214,
        y: 234.25
    }, {
        x: 216,
        y: 240.25
    }, {
        x: 216,
        y: 248.25
    }, {
        x: 216,
        y: 240.25
    }, {
        x: 212,
        y: 234.25
    }, {
        x: 206,
        y: 230.25
    }, {
        x: 200,
        y: 228.25
    }, {
        x: 194,
        y: 226.25
    }, {
        x: 186,
        y: 226.25
    }, {
        x: 180,
        y: 228.25
    }, {
        x: 174,
        y: 234.25
    }, {
        x: 170,
        y: 240.25
    }, {
        x: 170,
        y: 250.25
    }, {
        x: 170,
        y: 258.25
    }, {
        x: 172,
        y: 264.25
    }, {
        x: 178,
        y: 270.25
    }, {
        x: 184,
        y: 268.25
    }, {
        x: 188,
        y: 262.25
    }, {
        x: 190,
        y: 256.25
    }, {
        x: 192,
        y: 250.25
    }, {
        x: 190,
        y: 242.25
    }, {
        x: 186,
        y: 236.25
    }, {
        x: 180,
        y: 234.25
    }, {
        x: 172,
        y: 234.25
    }, {
        x: 164,
        y: 234.25
    }, {
        x: 158,
        y: 236.25
    }, {
        x: 150,
        y: 238.25
    }, {
        x: 144,
        y: 242.25
    }, {
        x: 140,
        y: 248.25
    }, {
        x: 144,
        y: 242.25
    }, {
        x: 150,
        y: 240.25
    }, {
        x: 156,
        y: 234.25
    }, {
        x: 162,
        y: 232.25
    }, {
        x: 168,
        y: 228.25
    }, {
        x: 174,
        y: 226.25
    }, {
        x: 180,
        y: 224.25
    }, {
        x: 186,
        y: 220.25
    }, {
        x: 192,
        y: 218.25
    }, {
        x: 198,
        y: 216.25
    }, {
        x: 206,
        y: 216.25
    }, {
        x: 214,
        y: 218.25
    }, {
        x: 216,
        y: 224.25
    }, {
        x: 222,
        y: 226.25
    }, {
        x: 230,
        y: 226.25
    }, {
        x: 238,
        y: 226.25
    }, {
        x: 246,
        y: 226.25
    }, {
        x: 254,
        y: 226.25
    }, {
        x: 260,
        y: 224.25
    }, {
        x: 266,
        y: 220.25
    }, {
        x: 272,
        y: 216.25
    }, {
        x: 278,
        y: 214.25
    }, {
        x: 284,
        y: 212.25
    }, {
        x: 290,
        y: 208.25
    }, {
        x: 296,
        y: 206.25
    }, {
        x: 304,
        y: 206.25
    }, {
        x: 312,
        y: 206.25
    }, {
        x: 320,
        y: 206.25
    }, {
        x: 326,
        y: 208.25
    }, {
        x: 332,
        y: 212.25
    }, {
        x: 336,
        y: 218.25
    }, {
        x: 340,
        y: 224.25
    }, {
        x: 344,
        y: 230.25
    }, {
        x: 344,
        y: 238.25
    }, {
        x: 342,
        y: 230.25
    }, {
        x: 340,
        y: 224.25
    }, {
        x: 334,
        y: 220.25
    }, {
        x: 328,
        y: 216.25
    }, {
        x: 320,
        y: 216.25
    }, {
        x: 314,
        y: 220.25
    }, {
        x: 310,
        y: 226.25
    }, {
        x: 306,
        y: 234.25
    }, {
        x: 306,
        y: 242.25
    }, {
        x: 306,
        y: 250.25
    }, {
        x: 308,
        y: 256.25
    }, {
        x: 316,
        y: 256.25
    }, {
        x: 320,
        y: 250.25
    }, {
        x: 322,
        y: 242.25
    }, {
        x: 322,
        y: 234.25
    }, {
        x: 322,
        y: 226.25
    }, {
        x: 320,
        y: 220.25
    }, {
        x: 314,
        y: 218.25
    }, {
        x: 306,
        y: 218.25
    }, {
        x: 300,
        y: 222.25
    }, {
        x: 294,
        y: 226.25
    }, {
        x: 288,
        y: 230.25
    }, {
        x: 282,
        y: 236.25
    }, {
        x: 280,
        y: 242.25
    }, {
        x: 286,
        y: 238.25
    }, {
        x: 292,
        y: 232.25
    }, {
        x: 296,
        y: 226.25
    }, {
        x: 300,
        y: 220.25
    }, {
        x: 306,
        y: 218.25
    }, {
        x: 314,
        y: 214.25
    }, {
        x: 320,
        y: 210.25
    }, {
        x: 326,
        y: 208.25
    }, {
        x: 334,
        y: 208.25
    }, {
        x: 342,
        y: 208.25
    }, {
        x: 350,
        y: 208.25
    }, {
        x: 356,
        y: 210.25
    }, {
        x: 362,
        y: 212.25
    }, {
        x: 362,
        y: 220.25
    }, {
        x: 362,
        y: 228.25
    }, {
        x: 360,
        y: 234.25
    }, {
        x: 358,
        y: 240.25
    }, {
        x: 356,
        y: 246.25
    }, {
        x: 354,
        y: 252.25
    }, {
        x: 352,
        y: 258.25
    }, {
        x: 350,
        y: 264.25
    }, {
        x: 348,
        y: 270.25
    }, {
        x: 344,
        y: 276.25
    }, {
        x: 338,
        y: 280.25
    }, {
        x: 332,
        y: 282.25
    }, {
        x: 326,
        y: 284.25
    }, {
        x: 320,
        y: 286.25
    }, {
        x: 312,
        y: 286.25
    }, {
        x: 304,
        y: 286.25
    }, {
        x: 296,
        y: 286.25
    }, {
        x: 288,
        y: 286.25
    }, {
        x: 282,
        y: 284.25
    }, {
        x: 276,
        y: 278.25
    }, {
        x: 272,
        y: 272.25
    }, {
        x: 266,
        y: 268.25
    }, {
        x: 264,
        y: 262.25
    }, {
        x: 262,
        y: 254.25
    }, {
        x: 262,
        y: 246.25
    }, {
        x: 258,
        y: 240.25
    }, {
        x: 252,
        y: 236.25
    }, {
        x: 250,
        y: 242.25
    }, {
        x: 250,
        y: 250.25
    }, {
        x: 250,
        y: 258.25
    }, {
        x: 250,
        y: 266.25
    }, {
        x: 250,
        y: 274.25
    }, {
        x: 252,
        y: 280.25
    }, {
        x: 258,
        y: 282.25
    }, {
        x: 260,
        y: 288.25
    }, {
        x: 262,
        y: 294.25
    }, {
        x: 264,
        y: 300.25
    }, {
        x: 264,
        y: 308.25
    }, {
        x: 264,
        y: 316.25
    }, {
        x: 262,
        y: 322.25
    }, {
        x: 254,
        y: 322.25
    }, {
        x: 254,
        y: 330.25
    }, {
        x: 254,
        y: 338.25
    }, {
        x: 252,
        y: 344.25
    }, {
        x: 250,
        y: 350.25
    }, {
        x: 258,
        y: 352.25
    }, {
        x: 266,
        y: 352.25
    }, {
        x: 274,
        y: 352.25
    }, {
        x: 282,
        y: 352.25
    }, {
        x: 288,
        y: 350.25
    }, {
        x: 294,
        y: 352.25
    }, {
        x: 302,
        y: 352.25
    }, {
        x: 300,
        y: 358.25
    }, {
        x: 294,
        y: 360.25
    }, {
        x: 288,
        y: 362.25
    }, {
        x: 282,
        y: 364.25
    }, {
        x: 274,
        y: 364.25
    }, {
        x: 266,
        y: 364.25
    }, {
        x: 258,
        y: 364.25
    }, {
        x: 250,
        y: 364.25
    }, {
        x: 242,
        y: 364.25
    }, {
        x: 234,
        y: 364.25
    }, {
        x: 226,
        y: 364.25
    }, {
        x: 218,
        y: 364.25
    }, {
        x: 212,
        y: 362.25
    }, {
        x: 206,
        y: 360.25
    }, {
        x: 200,
        y: 358.25
    }, {
        x: 198,
        y: 352.25
    }, {
        x: 206,
        y: 352.25
    }, {
        x: 214,
        y: 352.25
    }, {
        x: 222,
        y: 354.25
    }, {
        x: 230,
        y: 354.25
    }, {
        x: 238,
        y: 354.25
    }, {
        x: 246,
        y: 354.25
    }, {
        x: 252,
        y: 352.25
    }, {
        x: 252,
        y: 344.25
    }, {
        x: 252,
        y: 336.25
    }, {
        x: 252,
        y: 328.25
    }, {
        x: 250,
        y: 322.25
    }, {
        x: 244,
        y: 324.25
    }, {
        x: 238,
        y: 320.25
    }, {
        x: 236,
        y: 314.25
    }, {
        x: 234,
        y: 308.25
    }, {
        x: 234,
        y: 300.25
    }, {
        x: 238,
        y: 294.25
    }, {
        x: 242,
        y: 288.25
    }, {
        x: 246,
        y: 282.25
    }, {
        x: 248,
        y: 276.25
    }, {
        x: 248,
        y: 268.25
    }, {
        x: 248,
        y: 260.25
    }, {
        x: 248,
        y: 252.25
    }, {
        x: 248,
        y: 244.25
    }, {
        x: 242,
        y: 242.25
    }, {
        x: 236,
        y: 240.25
    }, {
        x: 230,
        y: 236.25
    }, {
        x: 224,
        y: 232.25
    }, {
        x: 224,
        y: 242.25
    }, {
        x: 222,
        y: 248.25
    }, {
        x: 220,
        y: 254.25
    }, {
        x: 218,
        y: 262.25
    }, {
        x: 216,
        y: 268.25
    }, {
        x: 212,
        y: 274.25
    }, {
        x: 206,
        y: 280.25
    }, {
        x: 202,
        y: 286.25
    }, {
        x: 196,
        y: 290.25
    }, {
        x: 190,
        y: 292.25
    }, {
        x: 184,
        y: 294.25
    }, {
        x: 178,
        y: 296.25
    }, {
        x: 170,
        y: 296.25
    }, {
        x: 162,
        y: 296.25
    }, {
        x: 154,
        y: 296.25
    }, {
        x: 148,
        y: 292.25
    }, {
        x: 142,
        y: 286.25
    }, {
        x: 136,
        y: 282.25
    }, {
        x: 132,
        y: 276.25
    }, {
        x: 128,
        y: 270.25
    }, {
        x: 124,
        y: 264.25
    }, {
        x: 122,
        y: 258.25
    }, {
        x: 122,
        y: 250.25
    }, {
        x: 120,
        y: 244.25
    }, {
        x: 118,
        y: 238.25
    }, {
        x: 118,
        y: 230.25
    }, {
        x: 118,
        y: 222.25
    }, {
        x: 124,
        y: 218.25
    }, {
        x: 130,
        y: 214.25
    }, {
        x: 136,
        y: 210.25
    }, {
        x: 142,
        y: 208.25
    }, {
        x: 150,
        y: 208.25
    }, {
        x: 156,
        y: 206.25
    }, {
        x: 174,
        y: 204.25
    }, {
        x: 182,
        y: 204.25
    }, {
        x: 190,
        y: 202.25
    }, {
        x: 196,
        y: 200.25
    }, {
        x: 202,
        y: 198.25
    }, {
        x: 210,
        y: 198.25
    }, {
        x: 218,
        y: 198.25
    }, {
        x: 224,
        y: 196.25
    }, {
        x: 232,
        y: 196.25
    }, {
        x: 240,
        y: 196.25
    }, {
        x: 248,
        y: 196.25
    }, {
        x: 256,
        y: 196.25
    }, {
        x: 264,
        y: 196.25
    }, {
        x: 270,
        y: 198.25
    }, {
        x: 276,
        y: 200.25
    }, {
        x: 284,
        y: 200.25
    }, {
        x: 290,
        y: 204.25
    }, {
        x: 298,
        y: 204.25
    }, {
        x: 304,
        y: 206.25
    }, {
        x: 310,
        y: 204.25
    }, {
        x: 318,
        y: 204.25
    }, {
        x: 326,
        y: 204.25
    }, {
        x: 332,
        y: 206.25
    }, {
        x: 340,
        y: 206.25
    }, {
        x: 346,
        y: 208.25
    }, {
        x: 354,
        y: 208.25
    }, {
        x: 360,
        y: 210.25
    }, {
        x: 366,
        y: 220.25
    }, {
        x: 374,
        y: 220.25
    }, {
        x: 380,
        y: 222.25
    }, {
        x: 386,
        y: 224.25
    }, {
        x: 388,
        y: 230.25
    }, {
        x: 388,
        y: 238.25
    }, {
        x: 388,
        y: 246.25
    }, {
        x: 388,
        y: 254.25
    }, {
        x: 386,
        y: 260.25
    }, {
        x: 382,
        y: 266.25
    }, {
        x: 378,
        y: 272.25
    }, {
        x: 372,
        y: 276.25
    }, {
        x: 368,
        y: 282.25
    }, {
        x: 362,
        y: 284.25
    }, {
        x: 358,
        y: 290.25
    }, {
        x: 352,
        y: 292.25
    }, {
        x: 350,
        y: 300.25
    }, {
        x: 350,
        y: 308.25
    }, {
        x: 348,
        y: 314.25
    }, {
        x: 346,
        y: 320.25
    }, {
        x: 344,
        y: 328.25
    }, {
        x: 344,
        y: 338.25
    }, {
        x: 344,
        y: 346.25
    }, {
        x: 342,
        y: 354.25
    }, {
        x: 342,
        y: 362.25
    }, {
        x: 342,
        y: 370.25
    }, {
        x: 340,
        y: 378.25
    }, {
        x: 334,
        y: 382.25
    }, {
        x: 328,
        y: 386.25
    }, {
        x: 322,
        y: 392.25
    }, {
        x: 316,
        y: 398.25
    }, {
        x: 310,
        y: 402.25
    }, {
        x: 304,
        y: 406.25
    }, {
        x: 298,
        y: 408.25
    }, {
        x: 292,
        y: 410.25
    }, {
        x: 286,
        y: 412.25
    }, {
        x: 280,
        y: 416.25
    }, {
        x: 274,
        y: 422.25
    }, {
        x: 268,
        y: 424.25
    }, {
        x: 262,
        y: 428.25
    }, {
        x: 256,
        y: 430.25
    }, {
        x: 246,
        y: 430.25
    }, {
        x: 238,
        y: 430.25
    }, {
        x: 232,
        y: 428.25
    }, {
        x: 226,
        y: 426.25
    }, {
        x: 220,
        y: 424.25
    }, {
        x: 214,
        y: 418.25
    }, {
        x: 208,
        y: 416.25
    }, {
        x: 200,
        y: 412.25
    }, {
        x: 194,
        y: 408.25
    }, {
        x: 188,
        y: 406.25
    }, {
        x: 182,
        y: 402.25
    }, {
        x: 176,
        y: 396.25
    }, {
        x: 170,
        y: 392.25
    }, {
        x: 164,
        y: 388.25
    }, {
        x: 158,
        y: 384.25
    }, {
        x: 154,
        y: 378.25
    }, {
        x: 148,
        y: 374.25
    }, {
        x: 142,
        y: 372.25
    }, {
        x: 136,
        y: 368.25
    }, {
        x: 134,
        y: 362.25
    }, {
        x: 134,
        y: 354.25
    }, {
        x: 134,
        y: 346.25
    }, {
        x: 134,
        y: 338.25
    }, {
        x: 134,
        y: 330.25
    }, {
        x: 134,
        y: 322.25
    }, {
        x: 132,
        y: 316.25
    }, {
        x: 132,
        y: 308.25
    }, {
        x: 132,
        y: 300.25
    }, {
        x: 132,
        y: 292.25
    }, {
        x: 132,
        y: 284.25
    }, {
        x: 130,
        y: 278.25
    }, {
        x: 132,
        y: 284.25
    }, {
        x: 118,
        y: 284.25
    }, {
        x: 112,
        y: 282.25
    }, {
        x: 106,
        y: 278.25
    }, {
        x: 104,
        y: 272.25
    }, {
        x: 102,
        y: 266.25
    }, {
        x: 98,
        y: 258.25
    }, {
        x: 98,
        y: 250.25
    }, {
        x: 98,
        y: 242.25
    }, {
        x: 100,
        y: 236.25
    }, {
        x: 104,
        y: 230.25
    }, {
        x: 110,
        y: 226.25
    }, {
        x: 116,
        y: 224.25
    }, {
        x: 114,
        y: 232.25
    }, {
        x: 108,
        y: 236.25
    }, {
        x: 102,
        y: 242.25
    }, {
        x: 96,
        y: 248.25
    }, {
        x: 90,
        y: 254.25
    }, {
        x: 86,
        y: 260.25
    }, {
        x: 88,
        y: 254.25
    }, {
        x: 90,
        y: 248.25
    }, {
        x: 94,
        y: 242.25
    }, {
        x: 96,
        y: 234.25
    }, {
        x: 88,
        y: 238.25
    }, {
        x: 82,
        y: 240.25
    }, {
        x: 76,
        y: 242.25
    }, {
        x: 70,
        y: 244.25
    }, {
        x: 64,
        y: 246.25
    }, {
        x: 62,
        y: 240.25
    }, {
        x: 68,
        y: 236.25
    }, {
        x: 74,
        y: 232.25
    }, {
        x: 80,
        y: 228.25
    }, {
        x: 86,
        y: 224.25
    }, {
        x: 92,
        y: 220.25
    }, {
        x: 98,
        y: 218.25
    }, {
        x: 106,
        y: 214.25
    }, {
        x: 100,
        y: 212.25
    }, {
        x: 94,
        y: 210.25
    }, {
        x: 88,
        y: 202.25
    }, {
        x: 82,
        y: 194.25
    }, {
        x: 80,
        y: 188.25
    }, {
        x: 82,
        y: 180.25
    }, {
        x: 88,
        y: 174.25
    }, {
        x: 94,
        y: 172.25
    }, {
        x: 100,
        y: 170.25
    }, {
        x: 108,
        y: 170.25
    }, {
        x: 116,
        y: 170.25
    }, {
        x: 122,
        y: 172.25
    }, {
        x: 122,
        y: 162.25
    }, {
        x: 126,
        y: 154.25
    }, {
        x: 128,
        y: 148.25
    }, {
        x: 134,
        y: 142.25
    }, {
        x: 136,
        y: 136.25
    }, {
        x: 140,
        y: 130.25
    }, {
        x: 146,
        y: 124.25
    }, {
        x: 150,
        y: 118.25
    }, {
        x: 154,
        y: 112.25
    }, {
        x: 160,
        y: 108.25
    }, {
        x: 168,
        y: 102.25
    }, {
        x: 176,
        y: 96.25
    }, {
        x: 182,
        y: 92.25
    }, {
        x: 188,
        y: 88.25
    }, {
        x: 198,
        y: 86.25
    }, {
        x: 208,
        y: 84.25
    }, {
        x: 216,
        y: 84.25
    }, {
        x: 226,
        y: 84.25
    }, {
        x: 236,
        y: 84.25
    }, {
        x: 246,
        y: 84.25
    }, {
        x: 254,
        y: 84.25
    }, {
        x: 262,
        y: 84.25
    }, {
        x: 270,
        y: 84.25
    }, {
        x: 280,
        y: 84.25
    }, {
        x: 290,
        y: 84.25
    }, {
        x: 298,
        y: 86.25
    }, {
        x: 304,
        y: 88.25
    }, {
        x: 310,
        y: 90.25
    }, {
        x: 316,
        y: 96.25
    }, {
        x: 320,
        y: 102.25
    }, {
        x: 328,
        y: 108.25
    }, {
        x: 334,
        y: 114.25
    }, {
        x: 340,
        y: 122.25
    }, {
        x: 346,
        y: 128.25
    }, {
        x: 352,
        y: 136.25
    }, {
        x: 358,
        y: 144.25
    }, {
        x: 360,
        y: 150.25
    }, {
        x: 362,
        y: 156.25
    }, {
        x: 366,
        y: 162.25
    }, {
        x: 368,
        y: 168.25
    }, {
        x: 370,
        y: 174.25
    }, {
        x: 372,
        y: 180.25
    }, {
        x: 372,
        y: 188.25
    }, {
        x: 372,
        y: 196.25
    }, {
        x: 372,
        y: 204.25
    }, {
        x: 366,
        y: 210.25
    }, {
        x: 364,
        y: 198.25
    }, {
        x: 362,
        y: 192.25
    }, {
        x: 358,
        y: 186.25
    }, {
        x: 356,
        y: 180.25
    }, {
        x: 352,
        y: 174.25
    }, {
        x: 346,
        y: 170.25
    }, {
        x: 340,
        y: 162.25
    }, {
        x: 336,
        y: 156.25
    }, {
        x: 330,
        y: 150.25
    }, {
        x: 326,
        y: 144.25
    }, {
        x: 320,
        y: 140.25
    }, {
        x: 314,
        y: 138.25
    }, {
        x: 308,
        y: 136.25
    }, {
        x: 300,
        y: 134.25
    }, {
        x: 290,
        y: 132.25
    }, {
        x: 284,
        y: 130.25
    }, {
        x: 278,
        y: 128.25
    }, {
        x: 270,
        y: 128.25
    }, {
        x: 262,
        y: 128.25
    }, {
        x: 254,
        y: 128.25
    }, {
        x: 246,
        y: 128.25
    }, {
        x: 236,
        y: 130.25
    }, {
        x: 226,
        y: 132.25
    }, {
        x: 218,
        y: 132.25
    }, {
        x: 210,
        y: 132.25
    }, {
        x: 198,
        y: 132.25
    }, {
        x: 192,
        y: 134.25
    }, {
        x: 188,
        y: 140.25
    }, {
        x: 182,
        y: 144.25
    }, {
        x: 176,
        y: 150.25
    }, {
        x: 168,
        y: 156.25
    }, {
        x: 162,
        y: 160.25
    }, {
        x: 156,
        y: 162.25
    }, {
        x: 152,
        y: 168.25
    }, {
        x: 146,
        y: 172.25
    }, {
        x: 140,
        y: 178.25
    }, {
        x: 134,
        y: 182.25
    }, {
        x: 128,
        y: 186.25
    }, {
        x: 124,
        y: 192.25
    }, {
        x: 120,
        y: 198.25
    }, {
        x: 118,
        y: 204.25
    }, {
        x: 114,
        y: 210.25
    }, {
        x: 112,
        y: 218.25
    }];
    function oe(t) {
        return (oe = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function ae(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function ye(t, e) {
        return (ye = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function ue(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = se(t);
            if (e) {
                var i = se(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return ce(this, n)
        }
    }
    function ce(t, e) {
        return !e || "object" !== oe(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function se(t) {
        return (se = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var le = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && ye(t, e)
        }(y, t);
        var e, n, o, a = ue(y);
        function y(t) {
            var e;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, y),
            (e = a.call(this)).id = t,
            e.imageSrcs = [],
            e.img = document.getElementById(t),
            e.index = 0,
            e.minY = .2,
            e.maxY = .8,
            e.scrollFocus = e.img,
            e
        }
        return e = y,
        (n = [{
            key: "update",
            value: function() {
                if (0 != this.imageSrcs.length) {
                    var t = g(b(1 - r(this.scrollFocus), this.minY, this.maxY), 0, 1);
                    this.index = g(Math.floor(this.imageSrcs.length * t), 0, this.imageSrcs.length - 1),
                    this.img.src = this.imageSrcs[this.index]
                }
            }
        }, {
            key: "isOnScreen",
            value: function() {
                return i(this.scrollFocus)
            }
        }]) && ae(e.prototype, n),
        o && ae(e, o),
        y
    }(a);
    function xe(t) {
        if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
            if (Array.isArray(t) || (t = function(t, e) {
                if (!t)
                    return;
                if ("string" == typeof t)
                    return fe(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                "Object" === n && t.constructor && (n = t.constructor.name);
                if ("Map" === n || "Set" === n)
                    return Array.from(t);
                if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                    return fe(t, e)
            }(t))) {
                var e = 0
                  , n = function() {};
                return {
                    s: n,
                    n: function() {
                        return e >= t.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: t[e++]
                        }
                    },
                    e: function(t) {
                        throw t
                    },
                    f: n
                }
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }
        var r, i, o = !0, a = !1;
        return {
            s: function() {
                r = t[Symbol.iterator]()
            },
            n: function() {
                var t = r.next();
                return o = t.done,
                t
            },
            e: function(t) {
                a = !0,
                i = t
            },
            f: function() {
                try {
                    o || null == r.return || r.return()
                } finally {
                    if (a)
                        throw i
                }
            }
        }
    }
    function fe(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function he(t) {
        var e, n = !1, r = [], i = xe(pe(t));
        try {
            for (i.s(); !(e = i.n()).done; ) {
                var o = e.value
                  , a = pe(o + 1);
                n && a.reverse();
                var y, u = xe(a);
                try {
                    for (u.s(); !(y = u.n()).done; ) {
                        var c = y.value;
                        r.push([0 + c, o - c])
                    }
                } catch (t) {
                    u.e(t)
                } finally {
                    u.f()
                }
                n = !n
            }
        } catch (t) {
            i.e(t)
        } finally {
            i.f()
        }
        var s, l = xe(pe(1, t));
        try {
            for (l.s(); !(s = l.n()).done; ) {
                var x = s.value
                  , f = pe(t - x);
                n && f.reverse();
                var h, p = xe(f);
                try {
                    for (p.s(); !(h = p.n()).done; ) {
                        var m = h.value;
                        r.push([x + m, t - 1 - m])
                    }
                } catch (t) {
                    p.e(t)
                } finally {
                    p.f()
                }
                n = !n
            }
        } catch (t) {
            l.e(t)
        } finally {
            l.f()
        }
        return r
    }
    function pe(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        return null == e && (e = t,
        t = 0),
        Array.from(Array(e - t).keys()).map((function(e) {
            return e + t
        }
        ))
    }
    function me(t) {
        return (me = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function de(t, e) {
        return function(t) {
            if (Array.isArray(t))
                return t
        }(t) || function(t, e) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t)))
                return;
            var n = []
              , r = !0
              , i = !1
              , o = void 0;
            try {
                for (var a, y = t[Symbol.iterator](); !(r = (a = y.next()).done) && (n.push(a.value),
                !e || n.length !== e); r = !0)
                    ;
            } catch (t) {
                i = !0,
                o = t
            } finally {
                try {
                    r || null == y.return || y.return()
                } finally {
                    if (i)
                        throw o
                }
            }
            return n
        }(t, e) || function(t, e) {
            if (!t)
                return;
            if ("string" == typeof t)
                return ve(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n)
                return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                return ve(t, e)
        }(t, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function ve(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function ge(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function be(t, e) {
        return (be = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function we(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Pe(t);
            if (e) {
                var i = Pe(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return Ae(this, n)
        }
    }
    function Ae(t, e) {
        return !e || "object" !== me(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Pe(t) {
        return (Pe = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var Se = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && be(t, e)
        }(o, t);
        var e, n, r, i = we(o);
        function o(t, e) {
            var n;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (n = i.call(this)).container = document.getElementById(t),
            n.swapController = e,
            n
        }
        return e = o,
        (n = [{
            key: "update",
            value: function() {
                for (var t = he(8), e = 0; e < this.container.children.length; e++) {
                    var n = de(t[e], 2)
                      , r = 8 * n[0] + n[1]
                      , i = this.container.children[r];
                    e <= this.swapController.index ? i.classList.remove("hidden") : i.classList.add("hidden")
                }
            }
        }]) && ge(e.prototype, n),
        r && ge(e, r),
        o
    }(a);
    function Oe(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n,
        t
    }
    function Ee(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(t);
            e && (r = r.filter((function(e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable
            }
            ))),
            n.push.apply(n, r)
        }
        return n
    }
    function _e(t) {
        for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2 ? Ee(Object(n), !0).forEach((function(e) {
                Oe(t, e, n[e])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ee(Object(n)).forEach((function(e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
            }
            ))
        }
        return t
    }
    function ke(t, e) {
        return function(t) {
            if (Array.isArray(t))
                return t
        }(t) || function(t, e) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) {
                var n = []
                  , r = !0
                  , i = !1
                  , o = void 0;
                try {
                    for (var a, y = t[Symbol.iterator](); !(r = (a = y.next()).done) && (n.push(a.value),
                    !e || n.length !== e); r = !0)
                        ;
                } catch (t) {
                    i = !0,
                    o = t
                } finally {
                    try {
                        r || null == y.return || y.return()
                    } finally {
                        if (i)
                            throw o
                    }
                }
                return n
            }
        }(t, e) || function(t, e) {
            if (t) {
                if ("string" == typeof t)
                    return je(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                return "Object" === n && t.constructor && (n = t.constructor.name),
                "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? je(t, e) : void 0
            }
        }(t, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function je(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    var Me = "undefined" != typeof window
      , Ie = Me && window.cordova && window.cordova.require && window.cordova.require("cordova/modulemapper")
      , Te = Me && (Ie && Ie.getOriginalSymbol(window, "File") || File)
      , Ce = Me && (Ie && Ie.getOriginalSymbol(window, "FileReader") || FileReader)
      , De = new Promise((function(t, e) {
        var n, r, i, o;
        return Be("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", "test.jpg", Date.now()).then((function(a) {
            try {
                return Le(n = a).then((function(a) {
                    try {
                        return Ue(r = a[1], n.type, n.name, n.lastModified).then((function(n) {
                            try {
                                return i = n,
                                Xe(r),
                                Re(i).then((function(n) {
                                    try {
                                        return ze(n).then((function(n) {
                                            try {
                                                return t(1 === (o = n).width && 2 === o.height)
                                            } catch (t) {
                                                return e(t)
                                            }
                                        }
                                        ), e)
                                    } catch (t) {
                                        return e(t)
                                    }
                                }
                                ), e)
                            } catch (t) {
                                return e(t)
                            }
                        }
                        ), e)
                    } catch (t) {
                        return e(t)
                    }
                }
                ), e)
            } catch (t) {
                return e(t)
            }
        }
        ), e)
    }
    ));
    function Re(t) {
        return new Promise((function(e, n) {
            var r = new Ce;
            r.onload = function() {
                return e(r.result)
            }
            ,
            r.onerror = function(t) {
                return n(t)
            }
            ,
            r.readAsDataURL(t)
        }
        ))
    }
    function Be(t, e) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Date.now();
        return new Promise((function(r) {
            for (var i = t.split(","), o = i[0].match(/:(.*?);/)[1], a = atob(i[1]), y = a.length, u = new Uint8Array(y); y--; )
                u[y] = a.charCodeAt(y);
            var c = new Blob([u],{
                type: o
            });
            c.name = e,
            c.lastModified = n,
            r(c)
        }
        ))
    }
    function ze(t) {
        return new Promise((function(e, n) {
            var r = new Image;
            r.onload = function() {
                return e(r)
            }
            ,
            r.onerror = function(t) {
                return n(t)
            }
            ,
            r.src = t
        }
        ))
    }
    function Fe(t) {
        var e = ke(Ye(t.width, t.height), 2)
          , n = e[0];
        return e[1].drawImage(t, 0, 0, n.width, n.height),
        n
    }
    function Le(t) {
        return new Promise((function(e, n) {
            var r, i, o = function() {
                try {
                    return i = Fe(r),
                    e([r, i])
                } catch (t) {
                    return n(t)
                }
            }, a = function(e) {
                try {
                    return Re(t).then((function(t) {
                        try {
                            return ze(t).then((function(t) {
                                try {
                                    return r = t,
                                    o()
                                } catch (t) {
                                    return n(t)
                                }
                            }
                            ), n)
                        } catch (t) {
                            return n(t)
                        }
                    }
                    ), n)
                } catch (t) {
                    return n(t)
                }
            };
            try {
                return createImageBitmap(t).then((function(t) {
                    try {
                        return r = t,
                        o()
                    } catch (t) {
                        return a()
                    }
                }
                ), a)
            } catch (t) {
                a()
            }
        }
        ))
    }
    function Ue(t, e, n, r) {
        var i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
        return new Promise((function(o, a) {
            var y;
            return "function" == typeof OffscreenCanvas && t instanceof OffscreenCanvas ? t.convertToBlob({
                type: e,
                quality: i
            }).then(function(t) {
                try {
                    return (y = t).name = n,
                    y.lastModified = r,
                    u.call(this)
                } catch (t) {
                    return a(t)
                }
            }
            .bind(this), a) : Be(t.toDataURL(e, i), n, r).then(function(t) {
                try {
                    return y = t,
                    u.call(this)
                } catch (t) {
                    return a(t)
                }
            }
            .bind(this), a);
            function u() {
                return o(y)
            }
        }
        ))
    }
    function We(t) {
        return new Promise((function(e, n) {
            var r = new Ce;
            r.onload = function(t) {
                var n = new DataView(t.target.result);
                if (65496 != n.getUint16(0, !1))
                    return e(-2);
                for (var r = n.byteLength, i = 2; i < r; ) {
                    if (n.getUint16(i + 2, !1) <= 8)
                        return e(-1);
                    var o = n.getUint16(i, !1);
                    if (i += 2,
                    65505 == o) {
                        if (1165519206 != n.getUint32(i += 2, !1))
                            return e(-1);
                        var a = 18761 == n.getUint16(i += 6, !1);
                        i += n.getUint32(i + 4, a);
                        var y = n.getUint16(i, a);
                        i += 2;
                        for (var u = 0; u < y; u++)
                            if (274 == n.getUint16(i + 12 * u, a))
                                return e(n.getUint16(i + 12 * u + 8, a))
                    } else {
                        if (65280 != (65280 & o))
                            break;
                        i += n.getUint16(i, !1)
                    }
                }
                return e(-1)
            }
            ,
            r.onerror = function(t) {
                return n(t)
            }
            ,
            r.readAsArrayBuffer(t)
        }
        ))
    }
    function Qe(t, e) {
        var n, r = t.width, i = t.height, o = e.maxWidthOrHeight, a = t;
        if (isFinite(o) && (r > o || i > o)) {
            var y = ke(Ye(r, i), 2);
            a = y[0],
            n = y[1],
            r > i ? (a.width = o,
            a.height = i / r * o) : (a.width = r / i * o,
            a.height = o),
            n.drawImage(t, 0, 0, a.width, a.height),
            Xe(t)
        }
        return a
    }
    function qe(t, e) {
        var n = t.width
          , r = t.height
          , i = ke(Ye(n, r), 2)
          , o = i[0]
          , a = i[1];
        switch (4 < e && e < 9 ? (o.width = r,
        o.height = n) : (o.width = n,
        o.height = r),
        e) {
        case 2:
            a.transform(-1, 0, 0, 1, n, 0);
            break;
        case 3:
            a.transform(-1, 0, 0, -1, n, r);
            break;
        case 4:
            a.transform(1, 0, 0, -1, 0, r);
            break;
        case 5:
            a.transform(0, 1, 1, 0, 0, 0);
            break;
        case 6:
            a.transform(0, 1, -1, 0, r, 0);
            break;
        case 7:
            a.transform(0, -1, -1, 0, r, n);
            break;
        case 8:
            a.transform(0, -1, 1, 0, 0, n)
        }
        return a.drawImage(t, 0, 0, n, r),
        Xe(t),
        o
    }
    function Ye(t, e) {
        var n, r;
        try {
            if (null === (r = (n = new OffscreenCanvas(t,e)).getContext("2d")))
                throw new Error("getContext of OffscreenCanvas returns null")
        } catch (t) {
            r = (n = document.createElement("canvas")).getContext("2d")
        }
        return n.width = t,
        n.height = e,
        [n, r]
    }
    function Xe(t) {
        t.width = 0,
        t.height = 0
    }
    function He(t, e) {
        return new Promise((function(n, r) {
            var i, o, a, y, u, c, s, l, x, f, h, p, m, d, v, g;
            function b() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 5;
                i += t,
                e.onProgress(Math.min(i, 100))
            }
            function w(t) {
                i = Math.min(Math.max(t, i), 100),
                e.onProgress(i)
            }
            return i = 0,
            o = e.maxIteration || 10,
            a = 1024 * e.maxSizeMB * 1024,
            b(),
            Le(t).then(function(i) {
                try {
                    var A = ke(i, 2);
                    return A[0],
                    y = A[1],
                    b(),
                    u = Qe(y, e),
                    b(),
                    new Promise((function(n, r) {
                        var i;
                        if (!(i = e.exifOrientation))
                            return We(t).then(function(t) {
                                try {
                                    return i = t,
                                    o.call(this)
                                } catch (t) {
                                    return r(t)
                                }
                            }
                            .bind(this), r);
                        function o() {
                            return n(i)
                        }
                        return o.call(this)
                    }
                    )).then(function(i) {
                        try {
                            return e.exifOrientation = i,
                            b(),
                            De.then(function(i) {
                                try {
                                    return c = i ? u : qe(u, e.exifOrientation),
                                    b(),
                                    s = 1,
                                    Ue(c, e.fileType || t.type, t.name, t.lastModified, s).then(function(i) {
                                        try {
                                            {
                                                if (l = i,
                                                b(),
                                                x = l.size > a,
                                                f = l.size > t.size,
                                                !x && !f)
                                                    return w(100),
                                                    n(l);
                                                var A;
                                                function P() {
                                                    if (o-- && (m > a || m > h)) {
                                                        var n, i, y = ke(Ye(n = x ? .95 * g.width : g.width, i = x ? .95 * g.height : g.height), 2);
                                                        return v = y[0],
                                                        y[1].drawImage(g, 0, 0, n, i),
                                                        "image/jpeg" === t.type && (s *= .95),
                                                        Ue(v, e.fileType || t.type, t.name, t.lastModified, s).then((function(t) {
                                                            try {
                                                                return d = t,
                                                                Xe(g),
                                                                g = v,
                                                                m = d.size,
                                                                w(Math.min(99, Math.floor((p - m) / (p - a) * 100))),
                                                                P
                                                            } catch (t) {
                                                                return r(t)
                                                            }
                                                        }
                                                        ), r)
                                                    }
                                                    return [1]
                                                }
                                                return h = t.size,
                                                p = l.size,
                                                m = p,
                                                g = c,
                                                (A = function(t) {
                                                    for (; t; ) {
                                                        if (t.then)
                                                            return void t.then(A, r);
                                                        try {
                                                            if (t.pop) {
                                                                if (t.length)
                                                                    return t.pop() ? S.call(this) : t;
                                                                t = P
                                                            } else
                                                                t = t.call(this)
                                                        } catch (t) {
                                                            return r(t)
                                                        }
                                                    }
                                                }
                                                .bind(this))(P);
                                                function S() {
                                                    return Xe(g),
                                                    Xe(v),
                                                    Xe(u),
                                                    Xe(c),
                                                    Xe(y),
                                                    w(100),
                                                    n(d)
                                                }
                                            }
                                        } catch (t) {
                                            return r(t)
                                        }
                                    }
                                    .bind(this), r)
                                } catch (t) {
                                    return r(t)
                                }
                            }
                            .bind(this), r)
                        } catch (t) {
                            return r(t)
                        }
                    }
                    .bind(this), r)
                } catch (t) {
                    return r(t)
                }
            }
            .bind(this), r)
        }
        ))
    }
    Me && (Number.isInteger = Number.isInteger || function(t) {
        return "number" == typeof t && isFinite(t) && Math.floor(t) === t
    }
    );
    var Ve, Ne, $e = 0;
    function Ze() {
        return function(t) {
            return "function" == typeof t && (t = "(".concat(f, ")()")),
            new Worker(URL.createObjectURL(new Blob([t])))
        }("\n    let scriptImported = false\n    self.addEventListener('message', async (e) => {\n      const { file, id, imageCompressionLibUrl, options } = e.data\n      options.onProgress = (progress) => self.postMessage({ progress, id })\n      try {\n        if (!scriptImported) {\n          // console.log('[worker] importScripts', imageCompressionLibUrl)\n          self.importScripts(imageCompressionLibUrl)\n          scriptImported = true\n        }\n        // console.log('[worker] self', self)\n        const compressedFile = await imageCompression(file, options)\n        self.postMessage({ file: compressedFile, id })\n      } catch (e) {\n        // console.error('[worker] error', e)\n        self.postMessage({ error: e.message + '\\n' + e.stack, id })\n      }\n    })\n  ")
    }
    function Ke(t, e) {
        return new Promise((function(n, r) {
            var i, o, a;
            if (e.maxSizeMB = e.maxSizeMB || Number.POSITIVE_INFINITY,
            o = "boolean" != typeof e.useWebWorker || e.useWebWorker,
            delete e.useWebWorker,
            void 0 === e.onProgress && (e.onProgress = function() {}
            ),
            !(t instanceof Blob || t instanceof Te))
                return r(new Error("The file given is not an instance of Blob or File"));
            if (!/^image/.test(t.type))
                return r(new Error("The file given is not an image"));
            if (a = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope,
            !o || "function" != typeof Worker || a)
                return He(t, e).then(function(t) {
                    try {
                        return i = t,
                        c.call(this)
                    } catch (t) {
                        return r(t)
                    }
                }
                .bind(this), r);
            var y = function() {
                try {
                    return c.call(this)
                } catch (t) {
                    return r(t)
                }
            }
            .bind(this)
              , u = function(n) {
                try {
                    return He(t, e).then((function(t) {
                        try {
                            return i = t,
                            y()
                        } catch (t) {
                            return r(t)
                        }
                    }
                    ), r)
                } catch (t) {
                    return r(t)
                }
            };
            try {
                return function(t, e) {
                    return new Promise((function(n, r) {
                        return new Promise((function(i, o) {
                            var a = $e++;
                            return Ve || (Ve = function(t) {
                                return URL.createObjectURL(new Blob([t],{
                                    type: "application/javascript"
                                }))
                            }("\n    function imageCompression (){return (".concat(Ke, ").apply(null, arguments)}\n\n    imageCompression.getDataUrlFromFile = ").concat(Ke.getDataUrlFromFile, "\n    imageCompression.getFilefromDataUrl = ").concat(Ke.getFilefromDataUrl, "\n    imageCompression.loadImage = ").concat(Ke.loadImage, "\n    imageCompression.drawImageInCanvas = ").concat(Ke.drawImageInCanvas, "\n    imageCompression.drawFileInCanvas = ").concat(Ke.drawFileInCanvas, "\n    imageCompression.canvasToFile = ").concat(Ke.canvasToFile, "\n    imageCompression.getExifOrientation = ").concat(Ke.getExifOrientation, "\n    imageCompression.handleMaxWidthOrHeight = ").concat(Ke.handleMaxWidthOrHeight, "\n    imageCompression.followExifOrientation = ").concat(Ke.followExifOrientation, "\n    imageCompression.cleanupMemory = ").concat(Ke.cleanupMemory, "\n\n    getDataUrlFromFile = imageCompression.getDataUrlFromFile\n    getFilefromDataUrl = imageCompression.getFilefromDataUrl\n    loadImage = imageCompression.loadImage\n    drawImageInCanvas = imageCompression.drawImageInCanvas\n    drawFileInCanvas = imageCompression.drawFileInCanvas\n    canvasToFile = imageCompression.canvasToFile\n    getExifOrientation = imageCompression.getExifOrientation\n    handleMaxWidthOrHeight = imageCompression.handleMaxWidthOrHeight\n    followExifOrientation = imageCompression.followExifOrientation\n    cleanupMemory = imageCompression.cleanupMemory\n\n    getNewCanvasAndCtx = ").concat(Ye, "\n    \n    CustomFileReader = FileReader\n    \n    CustomFile = File\n    \n    function _slicedToArray(arr, n) { return arr }\n    \n    function _typeof(a) { return typeof a }\n\n    function compress (){return (").concat(He, ").apply(null, arguments)}\n    "))),
                            Ne || (Ne = Ze()),
                            Ne.addEventListener("message", (function t(i) {
                                if (i.data.id === a) {
                                    if (void 0 !== i.data.progress)
                                        return void e.onProgress(i.data.progress);
                                    Ne.removeEventListener("message", t),
                                    i.data.error && r(new Error(i.data.error)),
                                    n(i.data.file)
                                }
                            }
                            )),
                            Ne.addEventListener("error", r),
                            Ne.postMessage({
                                file: t,
                                id: a,
                                imageCompressionLibUrl: Ve,
                                options: _e(_e({}, e), {}, {
                                    onProgress: void 0
                                })
                            }),
                            i()
                        }
                        ))
                    }
                    ))
                }(t, e).then((function(t) {
                    try {
                        return i = t,
                        y()
                    } catch (t) {
                        return u()
                    }
                }
                ), u)
            } catch (t) {
                u()
            }
            function c() {
                try {
                    i.name = t.name,
                    i.lastModified = t.lastModified
                } catch (t) {}
                return n(i)
            }
        }
        ))
    }
    Ke.getDataUrlFromFile = Re,
    Ke.getFilefromDataUrl = Be,
    Ke.loadImage = ze,
    Ke.drawImageInCanvas = Fe,
    Ke.drawFileInCanvas = Le,
    Ke.canvasToFile = Ue,
    Ke.getExifOrientation = We,
    Ke.handleMaxWidthOrHeight = Qe,
    Ke.followExifOrientation = qe,
    Ke.cleanupMemory = Xe,
    Ke.version = "1.0.11";
    var Ge = Ke;
    function Je(t) {
        return (Je = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function tn(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function en(t, e) {
        return (en = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function nn(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = on(t);
            if (e) {
                var i = on(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return rn(this, n)
        }
    }
    function rn(t, e) {
        return !e || "object" !== Je(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function on(t) {
        return (on = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var an = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && en(t, e)
        }(y, t);
        var e, n, o, a = nn(y);
        function y(t) {
            var e;
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, y),
            (e = a.call(this)).id = t,
            e.imageSrcs = [];
            var n = document.getElementById(t);
            return e.img = n.getElementsByTagName("img")[0],
            e.baseImage = null,
            e.canvas = null,
            e.context = null,
            Ge.loadImage("img/cat.png").then((function(t) {
                e.baseImage = t,
                e.canvas = document.createElement("canvas"),
                e.canvas.width = t.width,
                e.canvas.height = t.height,
                e.context = e.canvas.getContext("2d")
            }
            )),
            e
        }
        return e = y,
        (n = [{
            key: "update",
            value: function() {
                if (this.baseImage) {
                    var t = g(b(1 - r(this.img), .4, .7), 0, 1);
                    t *= t,
                    this.context.drawImage(this.baseImage, 0, 0);
                    var e = this.canvas.toDataURL("image/jpeg", t);
                    this.img.src = e
                }
            }
        }, {
            key: "isOnScreen",
            value: function() {
                return i(this.img)
            }
        }]) && tn(e.prototype, n),
        o && tn(e, o),
        y
    }(a)
      , yn = null;
    function un(t) {
        if (0 != t.length) {
            t.constructor === Array && (t = function(t) {
                return function(e) {
                    (e %= 1) < 0 && e++;
                    var n = Math.floor(t.length * e)
                      , r = (n + 1) % t.length
                      , i = t.length * e % 1;
                    return v(t[n], t[r], i)
                }
            }(it(t)));
            var e = function() {
                if (null === yn) {
                    var t = window.AudioContext || window.webkitAudioContext || !1;
                    if (!t)
                        return null;
                    yn = new t
                }
                return yn
            }();
            if (null === e)
                return !1;
            for (var n = e.createBuffer(1, 44100, 44100), r = n.getChannelData(0), i = 0; i < n.length; i++) {
                var o = i / 44100;
                r[i] += t(220 * o)
            }
            var a = e.createBufferSource();
            a.buffer = n;
            var y = e.createGain();
            y.gain.setValueAtTime(.8, e.currentTime),
            y.gain.exponentialRampToValueAtTime(1e-4, e.currentTime + 3),
            a.connect(y),
            y.connect(e.destination),
            a.start(),
            a.stop(e.currentTime + 3)
        }
    }
    function cn(t) {
        if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
            if (Array.isArray(t) || (t = function(t, e) {
                if (!t)
                    return;
                if ("string" == typeof t)
                    return sn(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                "Object" === n && t.constructor && (n = t.constructor.name);
                if ("Map" === n || "Set" === n)
                    return Array.from(t);
                if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                    return sn(t, e)
            }(t))) {
                var e = 0
                  , n = function() {};
                return {
                    s: n,
                    n: function() {
                        return e >= t.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: t[e++]
                        }
                    },
                    e: function(t) {
                        throw t
                    },
                    f: n
                }
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }
        var r, i, o = !0, a = !1;
        return {
            s: function() {
                r = t[Symbol.iterator]()
            },
            n: function() {
                var t = r.next();
                return o = t.done,
                t
            },
            e: function(t) {
                a = !0,
                i = t
            },
            f: function() {
                try {
                    o || null == r.return || r.return()
                } finally {
                    if (a)
                        throw i
                }
            }
        }
    }
    function sn(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function ln(t, e, n, r, i, o, a, y) {
        var u = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 5;
        t.beginPath(),
        t.lineWidth = 2,
        t.strokeStyle = o,
        t.fillStyle = o;
        var c = e.split("\n")
          , s = 0;
        t.font = '16px "Open Sans", sans-serif';
        var l, x = cn(c);
        try {
            for (x.s(); !(l = x.n()).done; ) {
                var f = l.value
                  , h = t.measureText(f);
                h.width > s && (s = h.width)
            }
        } catch (t) {
            x.e(t)
        } finally {
            x.f()
        }
        var p = 20
          , m = n + i
          , d = 0
          , v = 0
          , g = 0;
        m + s + u < y ? (v = (m = n + i) + u,
        g = (d = r - i) - u) : (v = (m = n - i) - s - u,
        g = (d = r - i) - u);
        for (var b = 0; b < c.length; b++) {
            var w = c[b]
              , A = p * (c.length - 1 - b);
            t.fillText(w, v, g - A)
        }
        t.beginPath(),
        t.moveTo(n, r),
        t.lineTo(m, d),
        t.stroke()
    }
    function xn(t) {
        return (xn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function fn(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function hn(t, e) {
        return (hn = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function pn(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = dn(t);
            if (e) {
                var i = dn(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return mn(this, n)
        }
    }
    function mn(t, e) {
        return !e || "object" !== xn(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function dn(t) {
        return (dn = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var vn = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && hn(t, e)
        }(o, t);
        var e, n, r, i = pn(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).wave = new Array(128).fill(0),
            r.sampleAmt = 0,
            r.waveShiftAmt = 0,
            r.yPos = r.height / 2,
            r.yMultiple = r.height / 4,
            r
        }
        return e = o,
        (n = [{
            key: "setWave",
            value: function(t) {
                this.wave = t.filter((function(t, e) {
                    return e % 4 == 0
                }
                )),
                this.wave = it(this.wave)
            }
        }, {
            key: "update",
            value: function(t, e) {
                var n = 1 - this.getScrollPosition();
                this.sampleAmt = b(n, .2, .6),
                this.waveShiftAmt = v(.1, -.1, n)
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                null != this.wave && (this.renderWave(),
                this.renderLabel())
            }
        }, {
            key: "renderWave",
            value: function() {
                this.context.beginPath(),
                this.context.lineWidth = 1,
                this.context.strokeStyle = P,
                this.context.fillStyle = P,
                this.context.globalAlpha = .5,
                at({
                    context: this.context,
                    width: this.width,
                    wave: this.wave,
                    startXAmt: this.waveShiftAmt - 1,
                    yPosition: this.yPos,
                    yMultiple: this.yMultiple,
                    type: "wave"
                }),
                this.context.stroke(),
                this.context.globalAlpha = 1,
                at({
                    context: this.context,
                    width: this.width,
                    wave: this.wave,
                    startXAmt: this.waveShiftAmt - 1,
                    yPosition: this.yPos,
                    yMultiple: this.yMultiple,
                    type: "samples"
                })
            }
        }, {
            key: "renderLabel",
            value: function() {
                var t = Math.floor(this.wave.length * this.sampleAmt)
                  , e = this.wave[function(t, e) {
                    var n = t % e;
                    return n < 0 && (n += e),
                    n
                }(t, this.wave.length)]
                  , n = t / this.wave.length
                  , r = this.width * (n + this.waveShiftAmt)
                  , i = this.yPos + this.yMultiple * e;
                this.context.beginPath(),
                this.context.arc(r, i, 2, 0, 2 * Math.PI),
                this.context.stroke();
                var o = "time = ".concat(n.toFixed(2), "\nvalue = ").concat(-e.toFixed(2));
                ln(this.context, o, r, i, .1 * this.height, S, 0, this.width)
            }
        }]) && fn(e.prototype, n),
        r && fn(e, r),
        o
    }(p);
    function gn(t) {
        return (gn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function bn(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function wn(t, e) {
        return (wn = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function An(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Sn(t);
            if (e) {
                var i = Sn(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return Pn(this, n)
        }
    }
    function Pn(t, e) {
        return !e || "object" !== gn(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Sn(t) {
        return (Sn = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var On = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && wn(t, e)
        }(o, t);
        var e, n, r, i = An(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).animAmt = 0,
            r.mousePos = null,
            r.onResize(),
            r
        }
        return e = o,
        (n = [{
            key: "onResize",
            value: function() {
                var t = this.canvas.getBoundingClientRect();
                this.canvas.width = t.width,
                this.canvas.height = t.height,
                this.width = t.width,
                this.height = t.height
            }
        }, {
            key: "update",
            value: function(t, e) {
                this.animAmt += t,
                e && (this.mousePos = Object.assign({}, e))
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.context.beginPath(),
                this.context.strokeStyle = E,
                this.context.lineWidth = 2;
                for (var t = 0; t < 4; t++)
                    for (var e = this.height / 4, n = (t + 0) * e, r = (t + .5) * e, i = (t + 1) * e, o = 2 * Math.pow(2, 3 - t), a = .05 + .02 * t, y = 0; y <= this.width; y += 3) {
                        var u = y / 500
                          , c = y;
                        this.mousePos && (u = _n(u, (this.mousePos.x - c) / 500, .2, .5 * En(this.mousePos.y - r, e))),
                        u += a * this.animAmt;
                        var s = v(n, i, v(.1, .9, .5 + .5 * Math.sin(2 * Math.PI * o * u)));
                        0 == y ? this.context.moveTo(c, s) : this.context.lineTo(c, s)
                    }
                this.context.stroke(),
                this.context.globalAlpha = 1
            }
        }]) && bn(e.prototype, n),
        r && bn(e, r),
        o
    }(p);
    function En(t, e) {
        return Math.exp(t * t * -.5 / (e * e))
    }
    function _n(t, e, n, r) {
        return t + r * e * En(e, n)
    }
    function kn(t, e) {
        return function(t) {
            if (Array.isArray(t))
                return t
        }(t) || function(t, e) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t)))
                return;
            var n = []
              , r = !0
              , i = !1
              , o = void 0;
            try {
                for (var a, y = t[Symbol.iterator](); !(r = (a = y.next()).done) && (n.push(a.value),
                !e || n.length !== e); r = !0)
                    ;
            } catch (t) {
                i = !0,
                o = t
            } finally {
                try {
                    r || null == y.return || y.return()
                } finally {
                    if (i)
                        throw o
                }
            }
            return n
        }(t, e) || jn(t, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function jn(t, e) {
        if (t) {
            if ("string" == typeof t)
                return Mn(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return "Object" === n && t.constructor && (n = t.constructor.name),
            "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Mn(t, e) : void 0
        }
    }
    function Mn(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function In(t) {
        return (In = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function Tn(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function Cn(t, e) {
        return (Cn = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function Dn(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = Bn(t);
            if (e) {
                var i = Bn(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return Rn(this, n)
        }
    }
    function Rn(t, e) {
        return !e || "object" !== In(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function Bn(t) {
        return (Bn = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var zn = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && Cn(t, e)
        }(o, t);
        var e, n, r, i = Dn(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).fourierData = [],
            r.totalHeight = 0,
            r.selectedIndex = 0,
            r.waveSpacingMultiple = .7,
            r.waveTopAmt = .2,
            r.waveBottomAmt = .9,
            r.waveHeightAmt = r.waveBottomAmt - r.waveTopAmt,
            r
        }
        return e = o,
        (n = [{
            key: "setFourierData",
            value: function(t) {
                var e = this;
                this.fourierData = t.slice(),
                this.fourierData.sort((function(t, e) {
                    return t.freq - e.freq
                }
                )),
                dat = this.fourierData;
                this.fourierData = this.fourierData.slice(0, 20),
                this.totalHeight = 0,
                this.fourierData.forEach((function(t) {
                    return e.totalHeight += 2 * t.amplitude
                }))
                
                updateGraph();
                
            }
        }, {
            key: "update",
            value: function(t, e) {
                var n = b(1 - (1.2-document.getElementById("wave-frequencies-slider").value), .2, .6)
                  , r = Math.floor(this.fourierData.length * n);
                this.selectedIndex = g(r, 0, this.fourierData.length - 1)
            }
        }, {
            key: "render",
            value: function() {
                this.clear(),
                this.renderWaves(),
                this.renderLabel()
            }
        }, {
            key: "renderWaves",
            value: function() {
                for (var t = this, e = 0, n = function(n) {
                    var r = t.fourierData[n]
                      , i = rt((function(t) {
                        return r.amplitude * Math.cos(2 * Math.PI * r.freq * t + r.phase)
                    }
                    ))
                      , o = 1 / t.totalHeight * (e + r.amplitude)
                      , a = t.height * v(t.waveTopAmt, t.waveBottomAmt, o);
                    t.context.beginPath(),
                    t.context.lineWidth = 2,
                    t.context.strokeStyle = P,
                    n != t.selectedIndex && (t.context.globalAlpha = .3),
                    at({
                        context: t.context,
                        wave: i,
                        width: t.width,
                        yPosition: a,
                        yMultiple: .7 * t.waveHeightAmt * (t.height / t.totalHeight)
                    }),
                    t.context.stroke(),
                    t.context.globalAlpha = 1,
                    e += 2 * r.amplitude
                }, r = 0; r < this.fourierData.length; r++)
                    n(r)
            }
        }, {
            key: "renderLabel",
            value: function() {
                if (0 != this.fourierData.length) {
                    for (var t = this.fourierData[this.selectedIndex], e = .2 * this.width, n = t.amplitude * Math.cos(2 * Math.PI * t.freq * .2 + t.phase), r = 0, i = 0; i < this.selectedIndex; i++)
                        r += 2 * this.fourierData[i].amplitude;
                    var o = 1 / this.totalHeight * (r + t.amplitude + this.waveSpacingMultiple * n)
                      , a = this.height * v(this.waveTopAmt, this.waveBottomAmt, o)
                      , y = (220 * t.freq).toFixed(0)
                      , u = function(t) {
                        var e, n = {
                            "-": "⁻",
                            0: "⁰",
                            1: "¹",
                            2: "²",
                            3: "³",
                            4: "⁴",
                            5: "⁵",
                            6: "⁶",
                            7: "⁷",
                            8: "⁸",
                            9: "⁹"
                        }, r = kn(t.toExponential(2).replace("+", "").split("e"), 2), i = r[0], o = r[1], a = "", y = function(t) {
                            if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
                                if (Array.isArray(t) || (t = jn(t))) {
                                    var e = 0
                                      , n = function() {};
                                    return {
                                        s: n,
                                        n: function() {
                                            return e >= t.length ? {
                                                done: !0
                                            } : {
                                                done: !1,
                                                value: t[e++]
                                            }
                                        },
                                        e: function(t) {
                                            throw t
                                        },
                                        f: n
                                    }
                                }
                                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                            }
                            var r, i, o = !0, a = !1;
                            return {
                                s: function() {
                                    r = t[Symbol.iterator]()
                                },
                                n: function() {
                                    var t = r.next();
                                    return o = t.done,
                                    t
                                },
                                e: function(t) {
                                    a = !0,
                                    i = t
                                },
                                f: function() {
                                    try {
                                        o || null == r.return || r.return()
                                    } finally {
                                        if (a)
                                            throw i
                                    }
                                }
                            }
                        }(o);
                        try {
                            for (y.s(); !(e = y.n()).done; ) {
                                var u = e.value;
                                a += n[u]
                            }
                        } catch (t) {
                            y.e(t)
                        } finally {
                            y.f()
                        }
                        return i + "×10" + a
                    }(t.amplitude)
                      , c = "frequency = ".concat(y, " Hz\namplitude = ").concat(u);
                    ln(this.context, c, e, a, .1 * this.height, S, 0, this.width)
                }
            }
        }]) && Tn(e.prototype, n),
        r && Tn(e, r),
        o
    }(p);
    function Fn(t, e) {
        if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function")
    }
    function Ln(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    var Un = function() {
        function t(e, n, r) {
            var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
            Fn(this, t),
            this.size = e,
            this.startRotation = n,
            this.rotation = n,
            this.frequency = r,
            this.parent = i,
            this.x = 0,
            this.y = 0
        }
        var e, n, r;
        return e = t,
        (n = [{
            key: "moveToParent",
            value: function() {
                this.x = this.parent.endX,
                this.y = this.parent.endY
            }
        }, {
            key: "reset",
            value: function() {
                this.rotation = this.startRotation,
                null != this.parent && this.moveToParent()
            }
        }, {
            key: "update",
            value: function(t) {
                this.rotation += 2 * Math.PI * this.frequency * t,
                null != this.parent && this.moveToParent()
            }
        }, {
            key: "render",
            value: function(t, e, n, r) {
                t.beginPath(),
                t.arc(r * (this.x + e), r * (this.y + n), r * this.size, 0, 2 * Math.PI),
                t.moveTo(r * (this.x + e), r * (this.y + n)),
                t.lineTo(r * (this.endX + e), r * (this.endY + n)),
                t.stroke()
            }
        }, {
            key: "renderAmt",
            value: function(t, e, n, r, i) {
                if (!(i < 0)) {
                    t.beginPath();
                    var o = i / this.size;
                    o > 1 && (o = 1),
                    t.moveTo(r * (this.x + e), r * (this.y + n)),
                    t.lineTo(r * (this.x + this.size * o * Math.cos(this.rotation) + e), r * (this.y + this.size * o * Math.sin(this.rotation) + n)),
                    i -= this.size,
                    t.stroke();
                    var a = i / (2 * Math.PI * this.size);
                    a < 0 || (a > 1 && (a = 1),
                    t.beginPath(),
                    t.arc(r * (this.x + e), r * (this.y + n), r * this.size, this.rotation, this.rotation + 2 * Math.PI * a),
                    t.stroke())
                }
            }
        }, {
            key: "getDrawPosition",
            value: function(t) {
                var e = t / this.size;
                if (e <= 1)
                    return {
                        x: this.x + this.size * e * Math.cos(this.rotation),
                        y: this.y + this.size * e * Math.sin(this.rotation)
                    };
                var n = (t -= this.size) / (2 * Math.PI * this.size);
                return {
                    x: this.x + this.size * Math.cos(this.rotation + 2 * Math.PI * n),
                    y: this.y + this.size * Math.sin(this.rotation + 2 * Math.PI * n)
                }
            }
        }, {
            key: "endX",
            get: function() {
                return this.x + this.size * Math.cos(this.rotation)
            }
        }, {
            key: "endY",
            get: function() {
                return this.y + this.size * Math.sin(this.rotation)
            }
        }, {
            key: "end",
            get: function() {
                return {
                    x: this.endX,
                    y: this.endY
                }
            }
        }, {
            key: "length",
            get: function() {
                return 2 * Math.PI * this.size + this.size
            }
        }]) && Ln(e.prototype, n),
        r && Ln(e, r),
        t
    }();
    function Wn(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    var Qn = [[46907.15070237851, .002, 2.5392475096073284], [16301.223228538258, .006, -3.029102700566724], [11068.29780225054, .004, 2.8611729233220355], [10788.388408232371, .012, 1.4015830156492102], [9364.721337497775, .008, -2.246129592130187], [8226.12395305788, -.004, 1.4163751985313011], [7711.3419287159295, -.002, 2.7765809408368347], [6866.4524976516395, -.008, 2.1373962619357263], [6558.837965422872, -.012, -.8666683800178686], [6532.107597433332, .01, -2.7866200337070817], [5425.2979638389015, -.006, 2.0295952070098737], [3712.3480565971904, -.014, 2.2020127700830447], [3696.881326873199, .014, -1.4769489195291858], [2717.4268313041694, -.016, 1.1661352333610462], [2685.6879162179416, -.018000000000000002, -1.4301916656888842], [2396.7724289196008, .018000000000000002, -1.938258712732489], [2173.1745325077245, -.022, -2.408814763212893], [1920.2582702395464, -.02, 2.5874841891973537], [1602.1347373757797, .02, -.7821046713226858], [1393.905214965102, .026000000000000002, -1.9795502276779917], [1333.6464285513343, -.01, -1.3048133542260647], [1155.429701293995, .022, 2.6301687240089975], [1020.0253796051335, -.026000000000000002, -1.6346161876418328], [870.1051274675666, -.028, -2.8133115840183973], [786.8519383564552, -.03, .8763644990260443], [775.2555097476887, .03, 1.291031393329353], [691.90348968366, -.024, .48371554837891934], [644.4436538557993, .046, -2.146924261824758], [560.4765825778605, .034, -2.164310128954773], [556.3507898442693, .016, -1.237654406727246], [554.2968837991153, .038, 2.090401508434924], [536.9215311854408, .052000000000000005, -1.6085755635747983], [491.73816248851114, -.036000000000000004, 2.610045871730714], [479.20359029629304, .028, 1.0790191141333154], [412.54736028859116, -.04, -2.7115309731859623], [399.1047723200872, -.032, 2.059425816984405], [373.1699813494269, .032, .1617441498250398], [350.26981140719903, -.048, -1.7813511297864402], [318.31067435962143, .054, 2.333438924715679], [294.69878876270127, .05, -2.8826699827201283], [289.86446062918367, .062, -1.2825073494773749], [286.765376813422, -.044, -.21705180437840965], [284.8131512010388, .048, 1.3927230981374168], [282.4247546073945, .042, -2.3696150006863106], [272.46062136944494, .024, -1.593261430408801], [271.9986575129024, -.034, 2.4988177568859253], [258.4943115932245, .04, 1.1193483643155797], [240.32002354944603, -.056, .5114248434922891], [227.31255343487774, -.058, -2.4589747278269027], [224.60430715740318, -.064, 2.4739355658878126], [212.5423024230878, -.038, .2705070771220832], [185.25544075634673, .056, .35980691271986825], [176.16671966347482, -.054, -1.7835244206534278], [165.54099040197298, .058, 1.4328481134658613], [164.63056130340564, .07200000000000001, -2.0346826499463315], [161.73413219167156, -.046, 1.2090830388428047], [160.49183169537002, .074, 1.558828438419231], [155.4750434412828, .036000000000000004, -1.9134577133482782], [150.74156294465243, -.074, 1.3421528625393055], [148.77389380330564, .044, .5501429519440298], [143.28332599968215, .07, 2.075189355914331], [139.6310506493838, -.06, 2.063642175367188], [138.79436292571262, .066, 2.2720107239863143], [133.01904094499022, -.05, 2.8668367528514853], [132.18790677345342, .078, -3.076884821055131], [129.76781002531314, .08600000000000001, 1.424811465258173], [119.60357085037673, -.066, -2.1551009712750973], [119.51215305781032, .088, -1.4435096433631922], [112.95315882288168, -.052000000000000005, -2.6133939533984636], [107.65001185149836, -.1, 1.383774652459546], [105.80078935909211, -.08600000000000001, -1.5244829117953655], [97.22705286428638, -.042, .8070667620403219], [95.4089883030525, -.112, -1.4821682065386075], [94.1352339908572, .096, -2.8537190743425125], [91.28124770352012, -.098, -1.7916821880771379], [90.96843873830643, -.094, 2.275666795351655], [90.58087745423272, .09, -2.0838850688577124], [89.64894782737254, -.108, -2.942965029263414], [88.55251410067964, .122, 3.0968411939199334], [77.62653890375356, -.068, -3.0599729426376205], [75.24465060216517, .092, -.4642923896325076], [74.93005705584937, .098, .6708725801192154], [74.67133472976438, .076, -.06371585104392338], [70.41262666290393, -.07200000000000001, -1.0537898574251854], [68.88092481163254, -.092, -2.8432670074807254], [68.82399721697999, -.076, .42251362423062516], [68.32980503322362, .13, .4410999699525029], [68.25662077414708, -.07, -.33227257403345445], [66.29233532518165, -.088, 1.294144824738236], [66.26754683659713, .10200000000000001, .3096763187386672], [64.13198918635067, -.08, -1.133727838038703], [63.49399165208018, -.10400000000000001, 2.0358967920391002], [62.89266714862323, -.11, 1.3308858079181365], [61.83336658435731, -.078, 2.7413661074381905], [61.13840412026524, .08, -2.8379798965118685], [60.726260095820145, .11, 3.081230639448951], [56.58062658022927, .1, 2.596369544570918], [56.49830886018777, .068, -.7764647524804048], [55.98388946484871, -.106, .6212811236814328], [55.39672701074099, .114, -2.7091415474205958], [54.38854382272228, .082, -2.425887074500422], [51.69935125090771, .108, -.9204307479539787], [51.00769732584507, -.082, 2.1815035888702257], [48.76230993473804, -.062, -.7617800404768663], [48.553663574175694, .136, -1.898333939944696], [48.05109410254169, -.154, -2.1067855570305807], [47.02808917449337, .124, -.6775690766507981], [46.96046066091242, -.09, -1.5721960065787244], [46.66198357620065, .14, 2.8232340921921053], [45.510236429328366, .14400000000000002, .6186283113073996], [44.20721867876503, -.114, 2.447906998399911], [44.20268097368798, .168, -2.346392329649515], [40.386283551363825, .084, -.9367411234578522], [39.9805498305494, .132, -2.4244386101974427], [39.52388834986413, .134, .38308808696809526], [39.426304662170814, -.146, .6489764973152875], [39.39928423282227, .12, -.962559055254391], [38.750550028865675, .06, -1.5825224382785947], [38.13900640201545, -.134, -2.8326891628485615], [37.375830187272655, -.122, -2.3691139933626726], [35.55446394331202, -.11800000000000001, -.041186096657782126], [35.44311139969532, .166, 1.7152750316151248], [35.233240130719885, -.116, -.09202323618239301], [35.084597125544995, .17, .3598680625513782], [34.72550698901998, .164, -1.3053273930978766], [33.873757631505335, .14200000000000002, 2.7298214628105937], [33.84787433644754, .152, -2.9929731499850964], [33.234523598931894, -.126, 2.8968940603777042], [32.963591714406824, .128, -1.931706982355626], [32.90394480875257, .064, -.009028489985424697], [32.41123113522608, -.132, 1.2937392165082338], [32.2911408513418, .2, -1.6587834276779658], [31.16571226643879, -.12, 1.7353025531105806], [30.267777856422892, .138, .02345868047596972], [30.098607031732712, -.128, -1.5273665817982383], [29.807937697950802, -.14200000000000002, -.24777815192763786], [29.095661512276276, -.138, 2.9354095904560173], [26.94175228580391, -.194, 2.857981101738909], [26.71200967319392, .17200000000000001, 1.8000605351311292], [26.517220322096655, -.192, -.2543893099265589], [26.236987824856413, .158, -2.304224110968231], [25.97810359860219, .154, -1.4598050414704764], [25.857056997102205, -.10200000000000001, -1.876239502161634], [25.349683354247606, -.162, .9067584033722129], [25.028232977620718, .15, -.49631224109038036], [24.96169710738585, .126, 1.7566369017738448], [23.56944841345149, -.24, -2.606553465497348], [23.327133967362276, -.14400000000000002, 2.6607301672968475], [23.26640008286091, .226, -2.3206226178706646], [22.363090821479172, -.136, 1.5342015630084493], [22.226652481801995, -.17, 2.5235866355383645], [22.113898125030136, .16, 1.2110555504699214], [21.834163589469558, .146, -2.682547298729719], [21.660443945835862, -.158, -1.3096960442311325], [21.32855672189188, .182, -2.1962243449988543], [21.257438197040504, .186, 1.8591788936815878], [21.25092806907633, -.096, -.8309509386396571], [21.07174007329418, -.178, 1.8501891006858622], [20.586695562587497, .202, .7584190410997556], [20.545347320195145, .198, 1.6362437937936827], [20.396608875985308, .196, -.9734739763067952], [20.2394932244031, .176, -.015655431573798947], [20.089431685694954, .194, -2.1123973704482144], [19.811942081771516, .252, -2.4315785122042333], [19.505421697799612, -.2, 3.0620215759796805], [19.394406117980875, -.214, -2.0879680614500575], [18.95895751678744, .184, -2.892949314950828], [18.705661008693024, -.164, -3.1121443833838445], [18.67016182499107, -.13, -2.835467480028931], [18.49835277251892, -.196, 2.4650924915124675], [18.441742221271518, .192, .6385079222916736], [18.389430541185558, .218, .5830797763402109], [18.26252199530254, -.198, -1.2743682441011446], [17.468066887353412, -.212, .8116023286124648], [17.446236298909454, -.152, 2.4680723695681026], [17.43118053308523, -.156, 1.5694266076093262], [17.27472366306585, .10400000000000001, 2.3384668155077697], [17.109336491484466, .212, 1.7900798651950496], [17.04315653760007, -.16, -2.5876942747749165], [17.01601342794025, .292, .1407757496678064], [16.940106635699557, -.23600000000000002, 2.394211697655626], [16.711119427380726, -.242, 1.5188213574526082], [16.657940621634562, .268, -1.8687573861416487], [16.652669050769084, -.15, 1.5316280440106418], [16.57971602190191, .11800000000000001, .4139573239943992], [16.566775845913426, -.084, -3.0031823366181882], [16.227476148127703, -.234, -.7999895371271639], [16.015357555081614, .162, -.9384805139771693], [15.62542103992904, .112, 1.086331963186151], [15.584777220106616, -.17200000000000001, -1.37353973298188], [15.403421995728564, .22, -2.1033243390073646], [15.314737431782683, .326, -2.1086394409975022], [14.806024952248217, .3, -2.1094817179753482], [14.58242799518957, -.268, 1.784128719839911], [14.269768896964615, -.25, 1.7805188764379187], [14.265814265057692, -.28200000000000003, 2.2501175218415024], [14.124133932373718, .17400000000000002, -1.9887739655136554], [14.068815140957955, .178, -2.4099822228851053], [13.995177107431289, -.232, 2.1603002226385555], [13.857270684219943, -.186, -.8806400285868405], [13.830478991491484, .306, -.8093670654751545], [13.821601630859652, .272, 2.2959337663645583], [13.573277123703422, .156, -.5489869566825283], [13.347614975899308, .264, -.7994920791355725], [13.04429371590161, .244, 1.276809121836848], [13.023609296381998, -.20600000000000002, 1.1792658184011617], [12.899435284558487, -.17400000000000002, 1.0116281794502726], [12.823495290428907, .266, .8846013641403121], [12.812737510205315, -.21, 1.9302395123893656], [12.772494736232536, -.23800000000000002, .9366439923628491], [12.262569229237632, .258, -2.652206864296608], [11.911541020327524, .29, -2.690695647708631], [11.890920073375986, .368, -1.3086126033610372], [11.660970297279434, .242, -1.300099591700617], [11.635065315292909, -.218, .19617773252791504], [11.435483210703264, -.176, 2.8407602128576066], [11.31804157557604, .294, -2.5002108101381886], [11.259765155751115, .334, 1.0598577342800806], [11.234021963756785, .19, -1.442064927811938], [11.225197204477789, .106, -2.417323372606883], [11.159926498967092, .26, .7673617925024636], [11.131861920506857, .332, -1.4737014850609196], [10.958356880972673, .274, -.9920935885085959], [10.930842231842776, .20800000000000002, -2.8835996284253294], [10.695594550892281, -.252, -.2611423493814168], [10.624145936064865, -.124, 1.0538290078666166], [10.62174495435024, .362, -2.4023951693714234], [10.6200992880936, -.182, -2.9451455409334275], [10.61802240405125, -.278, .5292779510009017], [10.605596439272665, -.168, 2.2643561440404847], [10.602522412873551, .28400000000000003, -2.6936341297821844], [10.592410781025425, .308, 1.2563564319095073], [10.590402796651091, .328, .5674519621170621], [10.582445995499691, .302, .6069196371592275], [10.559587356521162, .276, 1.2499450493152795], [10.443027705098956, -.222, 2.7387098437459167], [10.318836813037912, .47400000000000003, -1.6703857165361808], [10.148941972881902, .214, -2.5471013690034283], [10.13540598262645, -.226, -2.759147127644095], [10.007900725457274, -.292, -1.0511673475153869], [9.88355001632031, .36, 1.146399067796783], [9.802642997679644, .296, -1.4398517261647357], [9.787959136839893, .246, 2.9554395401197424], [9.747768560358463, -.14, 2.229149773181515], [9.734710079113333, -.19, 2.3710088695341347], [9.72680064433604, .358, -1.70577445185955], [9.680490490508351, .338, -.51694489249507], [9.626833349862311, .188, -2.123594746306415], [9.621868844749786, .342, -1.4584576257759991], [9.585697837399168, -.302, -2.0949210615824785], [9.296283754537985, -.26, -1.244558433303913], [9.231392488756477, -.216, 1.815229501526981], [9.194557658180216, -.23, -.8053640232484965], [9.133882794846937, .20600000000000002, -.3125375483610092], [8.994391215206829, .298, 1.3674341096921654], [8.96298671701239, -.20800000000000002, -2.9357288811151703], [8.812846820736361, .392, 1.171400505221154], [8.79172402485982, .222, -1.0500258714380664], [8.584224808450825, -.262, 1.665912101394742], [8.580843747576795, -.266, -1.981021973806216], [8.522658380915441, -.228, -2.2477833239023988], [8.454342072539214, .28200000000000003, .9690782558008666], [8.448093839956119, .34, 2.0843799985279126], [8.446456832236672, .366, 1.7509639710451423], [8.441492326372842, .148, -2.735250036738737], [8.256095362850756, .21, -1.592501197956974], [8.239524760561338, -.418, 1.5529464931176775], [8.183704370393942, -.294, 2.1146521976104387], [8.160013917917922, -.27, -2.4198626638059464], [8.149294950486444, .304, 2.3661667147312007], [8.030703379481924, .248, -.7377235320425307], [7.931832457870448, -.28400000000000003, -.34227260387176545], [7.902713283235399, .318, .5828443396632468], [7.81370463556628, -.5, -1.6055909518804719], [7.81220451687529, .18, .45076175988643424], [7.4610759240811575, .32, 3.041033468434298], [7.444038818665853, -.304, 1.0749373274976568], [7.4386945304163055, .224, -.5605492728766731], [7.3758417809238646, -.392, .7166149474859227], [7.372893051834245, .316, -2.366768061469762], [7.338474440130283, .094, 1.2756221250960802], [7.271024357487818, .25, .8471713382641961], [7.246589077804108, .494, -2.9031533108255347], [7.246505004890941, .23600000000000002, .22850769051883157], [7.206187072494993, -.248, -.19232976065612697], [7.180204746147821, .454, -.76862396681697], [7.151679570541557, .28, -.7379612742306574], [7.127268223977705, .336, -1.798023178041542], [7.028121746451263, .27, -.435904762867191], [6.997129956090457, .232, -1.8793094297313626], [6.97634095559191, .388, -2.996757802553761], [6.927245865088033, .324, 1.155315923670349], [6.901993102218537, .216, -2.9616905966329408], [6.865636385941763, .312, -.6919294281969159], [6.825254901184599, .314, 2.3313113782514114], [6.500750709252352, .374, -.41118474109800335], [6.474000382083674, .278, -3.096987741967822], [6.432241312331033, .448, -1.6654292123179533], [6.3360800280848135, -.388, -1.3754460833947728], [6.324167692243549, -.47800000000000004, -.11475994949103202], [6.2897982954522345, .488, 1.7904949884703283], [6.246399116214145, -.188, .4302336887257249], [6.219257250341353, -.354, 1.3074121114023658], [6.210868744928709, .364, -.4823921953918683], [6.144495239278641, -.276, 2.6117261599685766], [6.131698018815698, -.444, 2.094157066183747], [6.0862314621818685, -.308, 2.9479527338435814], [6.076707362963102, .376, 1.7528971263516129], [6.033074686791371, -.41000000000000003, 1.3585276577366647], [6.016048045407306, -.312, 2.073184186517633], [6.010528658416818, -.38, 1.4009456245882856], [5.9617589773827975, -.20400000000000001, 1.2417174641349376], [5.953443782984559, -.18, -.035979049767538185], [5.927468151460201, -.374, 2.290631520172579], [5.866960143494524, -.244, -1.0680397237313364], [5.852971196851098, .468, -2.2855247113394723], [5.753245781233218, -.486, 1.4875907045753118], [5.67886057844591, -.32, -.6021589041411256], [5.674515530717132, .458, -2.780024085101856], [5.672879065337478, .40800000000000003, 1.3451873226559474], [5.670095518136501, -.254, -3.0098040689126093], [5.62805672145689, -.492, .4999950064781163], [5.528138529634587, .34600000000000003, 2.3926531150331147], [5.505460509256074, -.274, -.23331115863323731], [5.497106317435004, .436, -.8024706844691742], [5.484966257414633, .33, 2.5326081177776207], [5.458261729863652, .47600000000000003, 1.2302052085043385], [5.414599326878921, -.29, .8681012388857803], [5.4114441266541276, .406, -1.6535968074791434], [5.356695392642811, .452, 2.3603957377679516], [5.334755244677254, .47000000000000003, .16700331598599258], [5.297309889029627, -.47600000000000003, 2.349484560841735], [5.2838563027022545, .47800000000000004, 1.9264266626423845], [5.2832608338552705, -.48, 3.0682781494132882], [5.220349684030491, .394, -2.1991940431628776], [5.207936209806022, -.438, 2.8992395833657114], [5.198842460209888, .496, .03194112362695705], [5.185356139715628, .466, 1.1272292436509228], [5.173731310128793, -.35000000000000003, 1.5704109158553101], [5.155122093680127, -.386, 1.5511969613051233], [5.136621727855052, .38, -.17448629619667502], [5.098002185805636, -.41200000000000003, 2.5320069713639497], [5.061882112021998, .354, .09476195106246987], [5.035905031473146, -.224, .1154164824222697], [5.028389120862996, .47200000000000003, 1.292467370486832], [5.024412059490657, -.34400000000000003, 2.52926684282135], [5.006945832340475, -.362, -.8698253809430749], [4.97371158606798, .49, -.895618890971061], [4.973585364062482, .35000000000000003, 1.0222430272614418], [4.965158893463864, .24, 2.3322390185664017], [4.952065684569319, -.4, 1.803478288601391], [4.886800867258782, .434, 1.4653593315178195], [4.876800367131826, .4, -1.8331547812814641], [4.8683921324525254, .23, .6014682637050368], [4.8590145871829185, -.166, 2.689514219631569], [4.840475851196096, .464, -1.3505311913390126], [4.812359091933792, .446, 1.663120551496429], [4.805643245976179, .48, -.7490352346443875], [4.763947866564614, -.338, 2.74357447291524], [4.755605166840988, -.332, -3.0059421059810565], [4.684503235758406, -.372, -.5289743225272219], [4.684225291806065, -.446, -.26047111109488313], [4.672040420309316, -.336, .354328136557043], [4.641263488458092, .23800000000000002, -1.1789847392939081], [4.6163475630672, .426, -2.563081466598402], [4.614643964773754, .28600000000000003, -.07646319491830393], [4.602469076639851, .498, 1.5623436611211605], [4.569468539785619, -.43, 2.8877962843867526], [4.53790450178883, .31, -1.5531461008589156], [4.530373760992701, -.33, .00048163376783087427], [4.494343258787191, -.366, .46471095449763594], [4.492566943675703, -.428, .8387247777826011], [4.4910154920551255, .254, 1.9666771555651164], [4.448269335001955, .424, .544399213833112], [4.352592746004044, -.452, -.3815669916439417], [4.32863113294651, .46, .7322756820881619], [4.326289577033418, -.34800000000000003, 1.0408275279004746], [4.3247567227045485, -.424, .1490554079314495], [4.322309662742445, .45, .877271342564586], [4.312050325660534, .41400000000000003, 2.252180846826927], [4.287935987282451, -.378, -1.157294713284987], [4.28672066698252, -.458, -1.1849494364123714], [4.282563620427257, .432, -2.0602717133274986], [4.2700852168475505, .34400000000000003, 1.32980622863743], [4.1731648648158854, -.322, .8696382312005733], [4.166167119942408, .34800000000000003, .04084491257126028], [4.158280158751655, -.404, -2.7313045963976195], [4.108899223586955, .352, -2.1956193542591667], [4.092515535248041, .428, -.5082797656312817], [4.087538399015721, .262, -2.159424563145499], [4.083310058374314, -.28800000000000003, -3.060259500239784], [4.063428387563185, .444, .04076125381241572], [4.0380143291410215, .442, -1.0031990059204896], [3.978926719749461, -.324, .9913299679384596], [3.966030577217352, -.34600000000000003, -.7582185164286795], [3.9454970219185914, -.148, -1.1478181335979531], [3.9066405990115953, -.436, .5544983408036681], [3.9064464369513185, .382, 2.2806683716453002], [3.8991353767780477, -.394, -2.429698447257421], [3.865732653720633, -.406, .7143864338859268], [3.856712791331925, .322, -1.1952266506641525], [3.835998513501081, .404, .5138367677067226], [3.765298276853097, -.398, -.07601447926412103], [3.7351761466373743, -.464, -.7857731857053484], [3.6704996698553183, -.246, -2.9008888791680802], [3.6234956427010427, .398, .6895566760647328], [3.579264439806301, .228, 2.4714692326909073], [3.525370708356332, -.326, -3.0859832447373554], [3.5232765667047614, -.184, -.12073009551279044], [3.5162868610135782, -.41600000000000004, -.48340789126652645], [3.4949877024868132, -.36, .2948251673592018], [3.4808732202557917, -.306, 1.5128418118947586], [3.4633655740339466, .396, -.3940358662300267], [3.430616799575084, -.432, -1.2677376611208329], [3.409120293631234, -.358, -2.884599988012897], [3.3892437031585607, .234, .8841795817358854], [3.379534718517689, -.382, .8723656657110669], [3.3687533588510545, .356, 2.58515724836702], [3.352355008143619, -.256, .5293996350341421], [3.3379997489365674, .386, .6220174975158207], [3.31610583251992, -.298, -2.0260566179670203], [3.309195751574333, .41200000000000003, -.2327484762031752], [3.2894646552616438, -.484, -.5385682913629001], [3.281404225195535, -.456, 1.8500915796141344], [3.2631006184378837, .418, .8955534008389957], [3.2473276861597693, .492, .6322393011286375], [3.2334707281433253, -.3, 2.2710385860172173], [3.2057964505437644, -.498, 1.441303613965232], [3.2015074252762115, .378, -.9394390299613027], [3.1974811883159946, .116, -.6871523615246413], [3.1666507282938143, -.31, .8401634573538429], [3.152676767379547, -.264, 1.7348674490661797], [3.1402432424682187, -.368, 3.034598655561818], [3.1344842054604465, .37, 1.2470113389452504], [3.110706059775874, -.40800000000000003, -1.1208787310496813], [3.092416757199537, -.47200000000000003, .36259002247646005], [3.0511942109172914, -.318, 1.4608110260230256], [3.0233400609537524, .372, 2.4561398903701392], [2.9894116595885447, .41000000000000003, -.7592198745379212], [2.9798002857176886, .44, 1.7998662740724334], [2.974183113263985, -.37, 2.571278162352844], [2.9630107231038134, -.202, -3.0014195839973157], [2.926987254596423, -.314, 2.5382771428709976], [2.91045193892003, -.352, -1.1974798426419042], [2.9096904215333033, .422, -.8799280255598667], [2.865634612221004, -.448, 2.745143296845354], [2.8469267594310574, .456, 2.0262662699698706], [2.7956807664822634, .28800000000000003, 1.0357976000180151], [2.789181746811964, -.272, 2.616865943025525], [2.7486404356930687, -.296, .8150063019192568], [2.733582786519939, -.316, -.7756549124226098], [2.667261380050648, -.39, .918130629829657], [2.6667674432645425, .384, -1.5420340418906298], [2.657144017988947, -.45, 2.160123784958223], [2.6474898901941737, -.482, .6803560896884868], [2.6283689781150965, -.422, 1.7546253268868242], [2.554690430571855, -.47400000000000003, -1.7905400380457963], [2.541836814061943, -.488, -1.6949708643382027], [2.5040214969556467, .20400000000000001, 1.6241153038998797], [2.4661454715168065, .41600000000000004, -.5511932911710413], [2.450994387966624, -.454, 1.342841223698668], [2.4430757314353144, -.42, -1.5515234368315514], [2.4276380032482354, -.376, 2.2510994781744844], [2.4078193820144858, .484, 2.3985952167780855], [2.398933574660912, -.466, 1.258136237580244], [2.253881698427287, -.442, -1.7354699458632155], [2.2502074741813405, .482, .7761527484560078], [2.191150875231849, -.28, 2.0458862970311085], [2.161619852127543, .42, 2.1284716897481477], [2.1509015789383747, -.47000000000000003, 2.984329020081122], [2.1373649692616894, .402, .5243763948622746], [2.137327672256816, -.364, 2.9534603175672247], [2.104253552318465, -.46, 1.247348564815156], [2.091373739480286, -.28600000000000003, 2.2190593873897426], [2.070708922464281, -.44, .16024254898167323], [1.8842653179604762, .39, -1.2354972092666616], [1.6993961359481653, -.384, 3.0879042560414587], [1.6373022505374089, -.496, 1.118178591291593], [1.5816334515773336, .486, -.8014002259130226], [1.5327272955573334, -.494, -1.8377472331591371], [1.456590982288479, .462, 1.9691555430159102], [1.4555045321838544, -.34, 1.2672170063174222], [1.3664577904374573, -.334, -2.2152413150382553], [1.35541403717245, -.402, -1.6840174233029301], [1.325820043505718, -.356, 1.2065279902457209], [1.3192478803645662, -.22, 2.7539287112872852], [1.3113948490170262, .256, .1465957603443097], [1.179307862980703, -.434, -.8680153091309171], [1.1584525233340635, -.328, -2.8367200211641475], [1.1490898969995043, -.41400000000000003, -1.5532738200472056], [1.1441538888184057, -.468, -1.0055735437172089], [1.0562684832409592, -.342, 1.9041485632436537], [.9580828921364182, -.258, -1.7600293095180397], [.9216289245863719, .438, -.3481803384188148], [.8104692841217193, -.426, -2.3968138486410226], [.5698152727979012, -.49, -.4804836406019927], [.4410929144166147, -.396, .8949578114409901], [.31360953216485377, .43, -2.460741547111953], [.2586490601102764, -.462, .8908666839877156]]
      , qn = function() {
        function t() {
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, t),
            this.pathLength = 0,
            this.totalPathLength = 0,
            this.alpha = 1,
            this.circles = [],
            this.drawnPoints = [];
            for (var e = 0; e < Qn.length; e++) {
                var n = Qn[e]
                  , r = new Un(n[0] / 500,n[2],n[1]);
                e > 0 && (r.parent = this.circles[e - 1],
                r.moveToParent()),
                this.totalPathLength += r.length,
                this.circles.push(r)
            }
        }
        var e, n, r;
        return e = t,
        (n = [{
            key: "getDrawPosition",
            value: function() {
                for (var t, e = this.pathLength, n = 0; n < this.circles.length; n++)
                    if ((e -= (t = this.circles[n]).length) <= 0)
                        return t.getDrawPosition(e + t.length);
                return t.end
            }
        }, {
            key: "drawMore",
            value: function() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 5;
                this.pathLength += t
            }
        }, {
            key: "rotateAll",
            value: function(t) {
                for (var e = 0; e < this.circles.length; e++)
                    this.circles[e].update(t)
            }
        }, {
            key: "addDrawPoint",
            value: function() {
                this.drawnPoints.length > 500 || this.drawnPoints.push({
                    x: this.circles[this.circles.length - 1].endX,
                    y: this.circles[this.circles.length - 1].endY
                })
            }
        }, {
            key: "reset",
            value: function() {
                for (var t = 0; t < this.circles.length; t++)
                    this.circles[t].reset()
            }
        }, {
            key: "render",
            value: function(t, e, n, r) {
                var i = this.pathLength;
                t.strokeStyle = "black",
                t.globalAlpha = this.alpha;
                for (var o = 0; o < this.circles.length; o++) {
                    var a = this.circles[o];
                    if (a.renderAmt(t, e, n, r, i),
                    (i -= a.length) < 0)
                        break
                }
                if (t.globalAlpha = 1,
                this.drawnPoints.length > 0) {
                    t.beginPath(),
                    t.moveTo(r * (this.drawnPoints[0].x + e), r * (this.drawnPoints[0].y + n));
                    for (var y = 1; y < this.drawnPoints.length; y++)
                        t.lineTo(r * (this.drawnPoints[y].x + e), r * (this.drawnPoints[y].y + n));
                    t.stroke()
                }
            }
        }]) && Wn(e.prototype, n),
        r && Wn(e, r),
        t
    }();
    function Yn(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    for (var Xn = [], Hn = 0, Vn = 0, Nn = 0; Nn < 500; Nn++) {
        for (var $n = 0, Zn = 0, Kn = 0; Kn < Qn.length; Kn++) {
            var Gn = Qn[Kn][0]
              , Jn = Qn[Kn][1]
              , tr = Qn[Kn][2];
            $n += Gn * Math.cos(2 * Math.PI * Nn * Jn + tr),
            Zn += Gn * Math.sin(2 * Math.PI * Nn * Jn + tr)
        }
        Zn /= 500,
        ($n /= 500) > Hn && (Hn = $n,
        Vn = Zn),
        Xn.push({
            x: $n,
            y: Zn
        })
    }
    var er = function() {
        function t() {
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, t),
            this.x = 0,
            this.y = 0,
            this.alpha = 1
        }
        var e, n, r;
        return e = t,
        (n = [{
            key: "render",
            value: function(t, e, n, r) {
                t.beginPath(),
                t.globalAlpha = this.alpha,
                t.strokeStyle = "black",
                t.fillStyle = "white",
                t.moveTo(r * (this.x + Xn[0].x - Hn + e), r * (this.y + Xn[0].y - Vn + n));
                for (var i = 1; i < Xn.length; i++)
                    t.lineTo(r * (this.x + Xn[i].x - Hn + e), r * (this.y + Xn[i].y - Vn + n));
                t.closePath(),
                t.fill(),
                t.stroke(),
                t.globalAlpha = 1
            }
        }, {
            key: "moveToCirclePosition",
            value: function() {
                this.x = Hn,
                this.y = Vn
            }
        }, {
            key: "circlePosX",
            get: function() {
                return Hn
            }
        }, {
            key: "circlePosY",
            get: function() {
                return Vn
            }
        }]) && Yn(e.prototype, n),
        r && Yn(e, r),
        t
    }();
    function nr(t) {
        return (nr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function rr(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function ir(t, e) {
        return (ir = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function or(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = yr(t);
            if (e) {
                var i = yr(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return ar(this, n)
        }
    }
    function ar(t, e) {
        return !e || "object" !== nr(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function yr(t) {
        return (yr = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var ur = Object.freeze({
        handDrawing: 1,
        handMovingAway: 2,
        circlesDrawing: 3,
        circlesFading: 4,
        windowMove: 5
    })
      , cr = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && ir(t, e)
        }(o, t);
        var e, n, r, i = or(o);
        function o(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, o),
            (r = i.call(this, t, e, n)).circleThing = new qn,
            r.pencil = new er,
            r.state = ur.handDrawing,
            r.animCount = 0,
            r.simulatedTime = 0,
            r.elapsedTime = 0,
            r
        }
        return e = o,
        (n = [{
            key: "update",
            value: function(t, e) {
                for (t > 20 / 60 && (t = 20 / 60),
                this.elapsedTime += t; this.simulatedTime < this.elapsedTime; )
                    this.subUpdate(),
                    this.simulatedTime += 1 / 60
            }
        }, {
            key: "subUpdate",
            value: function() {
                switch (this.state) {
                case ur.handDrawing:
                    this.circleThing.drawMore(.7 * this.circleThing.totalPathLength / 500);
                    var t = this.circleThing.getDrawPosition();
                    this.pencil.x = t.x,
                    this.pencil.y = t.y,
                    this.circleThing.pathLength > this.circleThing.totalPathLength && (this.state = ur.handMovingAway,
                    this.animCount = 0);
                    break;
                case ur.handMovingAway:
                    var e = this.circleThing.getDrawPosition();
                    this.animCount++;
                    var n = this.animCount / 48;
                    n = sr(n, 2),
                    this.pencil.alpha = 1 - n,
                    this.pencil.x = lr(e.x, -500, n),
                    this.pencil.y = lr(e.y, -100, n),
                    this.animCount > 48 && (this.state = ur.circlesDrawing,
                    this.animCount = 0,
                    this.pencil.alpha = 1);
                    break;
                case ur.circlesDrawing:
                    this.circleThing.addDrawPoint(),
                    this.circleThing.rotateAll(1),
                    this.circleThing.alpha = 1,
                    this.animCount++,
                    this.circleThing.drawnPoints.length > 500 && (this.state = ur.circlesFading,
                    this.circleThing.drawnPoints = [],
                    this.pencil.moveToCirclePosition(),
                    this.animCount = 0);
                    break;
                case ur.circlesFading:
                    this.circleThing.rotateAll(1),
                    this.animCount++;
                    var r = this.animCount / 144;
                    r = sr(r, 2),
                    this.circleThing.alpha = 1 - r,
                    this.animCount > 144 && (this.state = ur.windowMove,
                    this.animCount = 0,
                    this.circleThing.pathLength = 0,
                    this.circleThing.reset(),
                    this.circleThing.alpha = 1,
                    this.pencil.x = this.pencil.circlePosX,
                    this.pencil.y = this.pencil.circlePosY);
                    break;
                case ur.windowMove:
                    this.animCount++;
                    var i = this.animCount / 60;
                    i = sr(i, 2),
                    this.pencil.x = lr(this.pencil.circlePosX, 0, i),
                    this.pencil.y = lr(this.pencil.circlePosY, 0, i),
                    this.animCount > 60 && (this.animCount = 0,
                    this.state = ur.handDrawing)
                }
            }
        }, {
            key: "render",
            value: function() {
                this.clear();
                var t = this.context
                  , e = .66 * this.width
                  , n = .5 * this.height;
                switch (this.state) {
                case ur.handDrawing:
                case ur.handMovingAway:
                    this.circleThing.render(t, e, n, 1),
                    this.pencil.render(t, e, n, 1);
                    break;
                case ur.circlesDrawing:
                    this.circleThing.render(t, e, n, 1);
                    break;
                case ur.circlesFading:
                    this.pencil.render(t, e, n, 1),
                    this.circleThing.render(t, e, n, 1);
                    break;
                case ur.windowMove:
                    this.pencil.render(t, e, n, 1)
                }
            }
        }]) && rr(e.prototype, n),
        r && rr(e, r),
        o
    }(p);
    function sr(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2
          , n = Math.pow(t, e);
        return n / (n + Math.pow(1 - t, e))
    }
    function lr(t, e, n) {
        return (e - t) * n + t
    }
    function xr(t) {
        return (xr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function fr(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function hr(t, e) {
        return (hr = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function pr(t) {
        var e = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct)
                return !1;
            if (Reflect.construct.sham)
                return !1;
            if ("function" == typeof Proxy)
                return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                ))),
                !0
            } catch (t) {
                return !1
            }
        }();
        return function() {
            var n, r = dr(t);
            if (e) {
                var i = dr(this).constructor;
                n = Reflect.construct(r, arguments, i)
            } else
                n = r.apply(this, arguments);
            return mr(this, n)
        }
    }
    function mr(t, e) {
        return !e || "object" !== xr(e) && "function" != typeof e ? function(t) {
            if (void 0 === t)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }(t) : e
    }
    function dr(t) {
        return (dr = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    var vr = function(t) {
        !function(t, e) {
            if ("function" != typeof e && null !== e)
                throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }),
            e && hr(t, e)
        }(a, t);
        var e, n, r, o = pr(a);
        function a(t, e, n) {
            var r;
            return function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, a),
            (r = o.call(this)).id = t,
            r.imageSrcs = [],
            r.img = document.getElementById(t),
            r.index = 0,
            r.multXController = e,
            r.multYController = n,
            r
        }
        return e = a,
        (n = [{
            key: "update",
            value: function() {
                null != this.multXController && null != this.multYController && (this.xIndex = this.multXController.index + 1,
                this.yIndex = this.multYController.index + 1,
                this.img.src = "img/components-".concat(this.yIndex, "-").concat(this.xIndex, ".png"))
            }
        }, {
            key: "isOnScreen",
            value: function() {
                return i(this.img)
            }
        }]) && fr(e.prototype, n),
        r && fr(e, r),
        a
    }(a);
    function gr(t, e) {
        return function(t) {
            if (Array.isArray(t))
                return t
        }(t) || function(t, e) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t)))
                return;
            var n = []
              , r = !0
              , i = !1
              , o = void 0;
            try {
                for (var a, y = t[Symbol.iterator](); !(r = (a = y.next()).done) && (n.push(a.value),
                !e || n.length !== e); r = !0)
                    ;
            } catch (t) {
                i = !0,
                o = t
            } finally {
                try {
                    r || null == y.return || y.return()
                } finally {
                    if (i)
                        throw o
                }
            }
            return n
        }(t, e) || wr(t, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function br(t) {
        if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
            if (Array.isArray(t) || (t = wr(t))) {
                var e = 0
                  , n = function() {};
                return {
                    s: n,
                    n: function() {
                        return e >= t.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: t[e++]
                        }
                    },
                    e: function(t) {
                        throw t
                    },
                    f: n
                }
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }
        var r, i, o = !0, a = !1;
        return {
            s: function() {
                r = t[Symbol.iterator]()
            },
            n: function() {
                var t = r.next();
                return o = t.done,
                t
            },
            e: function(t) {
                a = !0,
                i = t
            },
            f: function() {
                try {
                    o || null == r.return || r.return()
                } finally {
                    if (a)
                        throw i
                }
            }
        }
    }
    function wr(t, e) {
        if (t) {
            if ("string" == typeof t)
                return Ar(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return "Object" === n && t.constructor && (n = t.constructor.name),
            "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ar(t, e) : void 0
        }
    }
    function Ar(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    var Pr = null;
    function Sr(t) {
        return null != document.getElementById(t)
    }
    !function() {
        var t = [];
        if (Sr("header-background")) {
            var e = new On("header-background");
            t.push(e)
        }
        if (Sr("self-draw")) {
            var n = new cr("self-draw");
            t.push(n)
        }
        var r, i, o, a, y, u = rt((function(t) {
            return Math.sin(2 * Math.PI * t) + .5 * Math.sin(6 * Math.PI * t)
        }
        ), 128);
        if (Sr("combo-sine-wave")) {
            var c = new ft("combo-sine-wave");
            c.setPath(u.map((function(t) {
                return 2 * t
            }
            ))),
            t.push(c)
        }
        if (Sr("combo-sine-wave-split")) {
            var s = new At("combo-sine-wave-split");
            s.setPath(u),
            s.fadeFrequencies = !1,
            t.push(s)
        }
        if (Sr("together-button") && document.getElementById("together-button").addEventListener("click", (function() {
            return un((function(t) {
                return Math.sin(2 * Math.PI * t) + .5 * Math.sin(6 * Math.PI * t)
            }
            ))
        }
        )),
        Sr("split-button-1") && document.getElementById("split-button-1").addEventListener("click", (function() {
            return un((function(t) {
                return .5 * Math.sin(6 * Math.PI * t)
            }
            ))
        }
        )),
        Sr("split-button-2") && document.getElementById("split-button-2").addEventListener("click", (function() {
            return un((function(t) {
                return Math.sin(2 * Math.PI * t)
            }
            ))
        }
        )),
        Sr("square-wave")) {
            var l = new ft("square-wave");
            l.setPath(rt(ot, 128)),
            t.push(l)
        }
        if (Sr("square-wave-split") && ((r = new At("square-wave-split")).setPath(rt(ot, 256)),
        t.push(r)),
        Sr("square-wave-build-up") && ((i = new At("square-wave-build-up")).setPath(rt(ot, 128)),
        i.splitAnim = !1,
        t.push(i)),
        Sr("square-wave-build-up-slider")) {
            var x = new Vt("square-wave-build-up-slider");
            i && x.onValueChange.push((function(t) {
                return i.fourierAmt = t
            }
            )),
            t.push(x)
        }
        if (Sr("square-wave-button")) {
            var f = document.getElementById("square-wave-button");
            i && f.addEventListener("click", (function() {
                return un(i.partialWave)
            }
            ))
        }
        if (Sr("wave-draw") && (o = new Ut("wave-draw"),
        t.push(o)),
        Sr("wave-draw-instruction")) {
            var h = document.getElementById("wave-draw-instruction");
            o && o.onDrawingStart.push((function() {
                return h.classList.add("hidden")
            }
            ))
        }
        if (Sr("wave-draw-slider") && ((a = new Vt("wave-draw-slider")).animate = !1,
        t.push(a)),
        Sr("wave-draw-split") && (y = new At("wave-draw-split"),
        null != o && (o.onDrawingStart.push((function() {
            y.splitAnim = !0,
            y.setPath([])
        }
        
        )),
        o.onDrawingEnd.push((function() {
            y.splitAnim = !0,
            y.setPath(o.normPath)
        }
        )),
        a && (o.onDrawingStart.push((function() {
            return a.slider.value = 1
        }
        )),
        o.onDrawingEnd.push((function() {
            return a.slider.value = 1
        }
        )))),
        null != a && a.onValueChange.push((function(t) {
            y.fourierAmt = t,
            y.splitAnim = !1
        }
        )),
        t.push(y)),
        Sr("wave-draw-button")) {
            var p = document.getElementById("wave-draw-button");
            p && p.addEventListener("click", (function() {
                return un(y.partialWave)
            }
            ))
        }
        if (Sr("wave-samples")) {
            var m = new vn("wave-samples");
            m.setWave(rt(ot, 256)),
            o && o.onDrawingEnd.push((function() {
                m.setWave(o.normPath)
            }
            )),
            t.push(m)
        }
        if (Sr("wave-frequencies")) {
            var d = new zn("wave-frequencies");
            r && d.setFourierData(r.fourierData),
            y && y.onFourierChange.push((function() {
                d.setFourierData(y.fourierData)
            }
            )),
            t.push(d)
        }
        if (Sr("complex-sinusoid")) {
            var v = new Ct("complex-sinusoid");
            t.push(v)
        }
        if (Sr("complex-sinusoid-turn")) {
            var g = new K("complex-sinusoid-turn");
            t.push(g)
        }
        var b, w, A, P, S, O, E = Nt.map((function(t) {
            return {
                x: 1.5 * t.x - 170,
                y: 1.5 * t.y - 50
            }
        }
        ));
        if (Sr("peace-epicycles")) {
            var _ = new Y("peace-epicycles");
            _.setPath(E, -1, .05),
            t.push(_)
        }
        if (Sr("peace-3d")) {
            var k = new re("peace-3d");
            k.setPath(E, -1, .05),
            t.push(k)
        }
        if (Sr("peace-build-up-slider") && (b = new Vt("peace-build-up-slider"),
        t.push(b)),
        Sr("peace-build-up")) {
            var j = new Y("peace-build-up");
            j.setPath(E, -1, .05),
            b && b.onValueChange.push((function(t) {
                return j.setFourierAmt(t)
            }
            )),
            t.push(j)
        }
        if (Sr("draw-zone") && (w = new C("draw-zone"),
        t.push(w)),
        Sr("draw-zone-instruction")) {
            var M = document.getElementById("draw-zone-instruction");
            w && w.onDrawingStart.push((function() {
                return M.classList.add("hidden")
            }
            ))
        }
        if (Sr("draw-zone-undo-button")) {
            var I = document.getElementById("draw-zone-undo-button");
            w && I.addEventListener("click", (function() {
                return w.undo()
            }
            ))
        }
        if (Sr("circle-zone-slider") && ((A = new Vt("circle-zone-slider")).animate = !1,
        t.push(A)),
        Sr("circle-zone")) {
            var T = new Y("circle-zone");
            T.animatePathAmt = !1,
            w && (w.onDrawingStart.push((function() {
                return T.setPath([])
            }
            )),
            w.onDrawingEnd.push((function() {
                return T.setPath(w.path, 1024)
            }
            )),
            A && w.onDrawingStart.push((function() {
                A.slider.value = 1,
                T.setFourierAmt(1)
            }
            ))),
            A && A.onValueChange.push((function(t) {
                return T.setFourierAmt(t)
            }
            )),
            t.push(T)
        }
        if (Sr("fourier-title")) {
            var D = new Y("fourier-title");
            D.setPath(tt.map((function(t) {
                return {
                    x: .9 * t.x,
                    y: .9 * t.y - 40
                }
            }
            ))),
            D.period = 15,
            t.push(D)
        }
        if (Sr("img-x-component")) {
            for (var R = new le("img-x-component"), B = [], z = 1; z < 8; z++)
                B.push("img/components-0-" + z + ".png");
            R.imageSrcs = B,
            t.push(R)
        }
        if (Sr("img-y-component")) {
            for (var F = new le("img-y-component"), L = [], U = 1; U < 8; U++)
                L.push("img/components-" + U + "-0.png");
            F.imageSrcs = L,
            t.push(F)
        }
        if (Sr("img-mult-x-component")) {
            P = new le("img-mult-x-component");
            for (var W = [], Q = 1; Q < 8; Q++)
                W.push("img/components-0-" + Q + ".png");
            P.imageSrcs = W,
            P.maxY = .5,
            t.push(P)
        }
        if (Sr("img-mult-y-component")) {
            S = new le("img-mult-y-component");
            for (var q = [], X = 1; X < 8; X++)
                q.push("img/components-" + X + "-0.png");
            S.imageSrcs = q,
            S.minY = .5,
            t.push(S)
        }
        if (Sr("img-x-y-component")) {
            var H = new vr("img-x-y-component",P,S);
            t.push(H)
        }
        if (Sr("letter-buildup-letter")) {
            O = new le("letter-buildup-letter");
            var V, N = [], $ = br(he(8));
            try {
                for ($.s(); !(V = $.n()).done; ) {
                    var Z = gr(V.value, 2)
                      , G = Z[0]
                      , et = Z[1];
                    N.push("img/img-buildup-" + et + "-" + G + ".png")
                }
            } catch (t) {
                $.e(t)
            } finally {
                $.f()
            }
            O.imageSrcs = N,
            O.scrollFocus = document.querySelector("#letter-buildup"),
            O.minY = .2,
            O.maxY = .6,
            t.push(O)
        }
        if (Sr("letter-buildup-components")) {
            var nt = new Se("letter-buildup-components",O);
            t.push(nt)
        }
        if (Sr("jpeg-example")) {
            var it = new an("jpeg-example");
            t.push(it)
        }
        if (Sr("its-meee")) {
            var at = new Y("its-meee");
            at.setPath(ie, 256, .1),
            t.push(at)
        }
        if (Sr("email-text")) {
            var yt = document.getElementById("email-text")
              , ut = "fourier@jezzamon.com"
              , ct = '<a href="mailto:'.concat(ut, '">').concat(ut, "</a>");
            yt.innerHTML = ct
        }
        if (Sr("email-k40005238-text")) {
            var st = document.getElementById("email-k40005238-text")
              , lt = "k40005238@gcloud.csu.edu.tw"
              , xt = '<a href="mailto:'.concat(lt, '">').concat(lt, "</a>");
            st.innerHTML = xt
        }
        (Pr = new J(t)).start(),
        window.conductor = Pr
    }()
}
]);

//# sourceMappingURL=main.bundle.js.map
