!function (t) {
    var e = {};

    function n(r) {
        if (e[r]) return e[r].exports;
        var i = e[r] = {i: r, l: !1, exports: {}};
        return t[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }

    n.m = t, n.c = e, n.d = function (t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {configurable: !1, enumerable: !0, get: r})
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 0)
}([function (t, e, n) {
    "use strict";
    (function (t) {
        var n, r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }, i = function () {
            function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                }
            }

            return function (e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e
            }
        }();
        var o = function () {
            function t(e) {
                !function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), e.wrapperId ? this.container = document.getElementById(e.wrapperId) : this.container = document.body, e.insertId ? this.insertDom = document.getElementById(e.insertId) : this.container != document.body ? this.insertDom = this.container : this.insertDom = this.container.firstElementChild, this.showSerial = e.showSerial || !1, this.childH = []
            }

            return i(t, [{
                key: "getAllH", value: function () {
                    for (var t = this.container.firstElementChild; t;) t.nodeName.match(/H[1-7]/) && (t.order = parseInt(t.nodeName[1]), this.childH.push(t)), t = t.nextElementSibling
                }
            }, {
                key: "createItemChain", value: function (t, e) {
                    !function t(e, n) {
                        if (!e || !e[n]) return;
                        var r = e[n];
                        r.childH = [];
                        for (var i = n + 1; i < e.length && e[i].order > r.order; i++) {
                            var o = e.splice(i, 1);
                            r.childH = r.childH.concat(o), i--
                        }
                        r.childH.length && t(r.childH, 0);
                        for (var c = n + 1; c < e.length; c++) e[c].childH || t(e, c)
                    }(t, e)
                }
            }, {
                key: "createToc", value: function () {
                    var t = this;
                    if (this.getAllH(), this.createItemChain(this.childH, 0), this.childH.length) {
                        var e = document.createElement("div");
                        e.setAttribute("class", "toc_wrap"), e.setAttribute("id", "toc_wrap"), e.innerHTML = '<div class="toc_root" id="toc"><span class="hide_toc_btn">[hide]</span></div><span class="show_toc_btn">[显示目录]</span>', this.insertDom.parentNode.insertBefore(e, this.insertDom), e.getElementsByClassName("hide_toc_btn")[0].addEventListener("click", function () {
                            e.className = e.className + " hide"
                        }), e.getElementsByClassName("show_toc_btn")[0].addEventListener("click", function () {
                            e.className = "toc_wrap"
                        }), function e(n, r, i, o) {
                            var c = 1;
                            for (var l = 0; l < r.length; l++) {
                                var a = document.createElement("div");
                                a.setAttribute("class", "toc_lvl toc_lvl_" + i);
                                var s = "";
                                s = o ? o + "-" + c : c, t.showSerial && s, a.innerHTML = '<a href="#toc_' + s + '"">' + s.toString().replace(/-/g, '.') + "&nbsp;" + r[l].innerHTML + "</a>", r[l].setAttribute("id", "toc_" + s), n.appendChild(a), r[l].childH && r[l].childH.length && e(a, r[l].childH, i + 1, s), c++
                            }
                        }(document.getElementById("toc"), this.childH, 1, "")
                    }
                }
            }]), t
        }();
        "object" === r(t) && "object" === r(t.exports) && (t.exports = o), "function" == typeof window.define ? void 0 === (n = function () {
            return o
        }.apply(e, [])) || (t.exports = n) : window.Toc = o
    }).call(e, n(1)(t))
}, function (t, e) {
    t.exports = function (t) {
        return t.webpackPolyfill || (t.deprecate = function () {
        }, t.paths = [], t.children || (t.children = []), Object.defineProperty(t, "loaded", {
            enumerable: !0,
            get: function () {
                return t.l
            }
        }), Object.defineProperty(t, "id", {
            enumerable: !0, get: function () {
                return t.i
            }
        }), t.webpackPolyfill = 1), t
    }
}]);
//# sourceMappingURL=toc.min.js.map
