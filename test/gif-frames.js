(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.gifFrames = f()
    }
}
)(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a)
                        return a(o, !0);
                    if (i)
                        return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND",
                    f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++)
            s(r[o]);
        return s
    }({
        1: [function(require, module, exports) {
            var MultiRange = require("multi-integer-range").MultiRange;
            var getPixels = require("get-pixels-frame-info-update");
            var savePixels = require("save-pixels-jpeg-js-upgrade");
            function nopromises() {
                throw new Error("Promises not supported in your environment. " + "Use the callback argument or a Promise polyfill.")
            }
            var brokenPromise = {
                then: nopromises,
                catch: nopromises
            };
            function gifFrames(options, callback) {
                options = options || {};
                callback = callback || function() {}
                ;
                var promise;
                var resolve;
                var reject;
                if (typeof Promise === "function") {
                    promise = new Promise(function(_resolve, _reject) {
                        resolve = function(res) {
                            callback(null, res);
                            _resolve(res)
                        }
                        ;
                        reject = function(err) {
                            callback(err);
                            _reject(err)
                        }
                    }
                    )
                } else {
                    promise = brokenPromise;
                    resolve = function(res) {
                        callback(null, res)
                    }
                    ;
                    reject = callback
                }
                var url = options.url;
                if (!url) {
                    reject(new Error('"url" option is required.'));
                    return promise
                }
                var frames = options.frames;
                if (!frames && frames !== 0) {
                    reject(new Error('"frames" option is required.'));
                    return promise
                }
                var outputType = options.outputType || "jpg";
                var quality = options.quality;
                var cumulative = options.cumulative;
                var acceptedFrames = frames === "all" ? "all" : new MultiRange(frames);
                var inputType = typeof window === "undefined" ? "image/gif" : ".GIF";
                getPixels(url, inputType, function(err, pixels, framesInfo) {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (pixels.shape.length < 4) {
                        reject(new Error('"url" input should be multi-frame GIF.'));
                        return
                    }
                    var frameData = [];
                    var maxAccumulatedFrame = 0;
                    for (var i = 0; i < pixels.shape[0]; i++) {
                        if (acceptedFrames !== "all" && !acceptedFrames.has(i)) {
                            continue
                        }
                        (function(frameIndex) {
                            frameData.push({
                                getImage: function() {
                                    if (cumulative && frameIndex > maxAccumulatedFrame) {
                                        var lastFrame = pixels.pick(maxAccumulatedFrame);
                                        for (var f = maxAccumulatedFrame + 1; f <= frameIndex; f++) {
                                            var frame = pixels.pick(f);
                                            for (var x = 0; x < frame.shape[0]; x++) {
                                                for (var y = 0; y < frame.shape[1]; y++) {
                                                    if (frame.get(x, y, 3) === 0) {
                                                        frame.set(x, y, 0, lastFrame.get(x, y, 0));
                                                        frame.set(x, y, 1, lastFrame.get(x, y, 1));
                                                        frame.set(x, y, 2, lastFrame.get(x, y, 2));
                                                        frame.set(x, y, 3, lastFrame.get(x, y, 3))
                                                    }
                                                }
                                            }
                                            lastFrame = frame
                                        }
                                        maxAccumulatedFrame = frameIndex
                                    }
                                    return savePixels(pixels.pick(frameIndex), outputType, {
                                        quality: quality
                                    })
                                },
                                frameIndex: frameIndex,
                                frameInfo: framesInfo && framesInfo[frameIndex]
                            })
                        }
                        )(i)
                    }
                    resolve(frameData)
                });
                return promise
            }
            module.exports = gifFrames
        }
        , {
            "get-pixels-frame-info-update": 15,
            "multi-integer-range": 33,
            "save-pixels-jpeg-js-upgrade": 81
        }],
        2: [function(require, module, exports) {
            (function(global) {
                "use strict";
                function compare(a, b) {
                    if (a === b) {
                        return 0
                    }
                    var x = a.length;
                    var y = b.length;
                    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                        if (a[i] !== b[i]) {
                            x = a[i];
                            y = b[i];
                            break
                        }
                    }
                    if (x < y) {
                        return -1
                    }
                    if (y < x) {
                        return 1
                    }
                    return 0
                }
                function isBuffer(b) {
                    if (global.Buffer && typeof global.Buffer.isBuffer === "function") {
                        return global.Buffer.isBuffer(b)
                    }
                    return !!(b != null && b._isBuffer)
                }
                var util = require("util/");
                var hasOwn = Object.prototype.hasOwnProperty;
                var pSlice = Array.prototype.slice;
                var functionsHaveNames = function() {
                    return function foo() {}
                    .name === "foo"
                }();
                function pToString(obj) {
                    return Object.prototype.toString.call(obj)
                }
                function isView(arrbuf) {
                    if (isBuffer(arrbuf)) {
                        return false
                    }
                    if (typeof global.ArrayBuffer !== "function") {
                        return false
                    }
                    if (typeof ArrayBuffer.isView === "function") {
                        return ArrayBuffer.isView(arrbuf)
                    }
                    if (!arrbuf) {
                        return false
                    }
                    if (arrbuf instanceof DataView) {
                        return true
                    }
                    if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
                        return true
                    }
                    return false
                }
                var assert = module.exports = ok;
                var regex = /\s*function\s+([^\(\s]*)\s*/;
                function getName(func) {
                    if (!util.isFunction(func)) {
                        return
                    }
                    if (functionsHaveNames) {
                        return func.name
                    }
                    var str = func.toString();
                    var match = str.match(regex);
                    return match && match[1]
                }
                assert.AssertionError = function AssertionError(options) {
                    this.name = "AssertionError";
                    this.actual = options.actual;
                    this.expected = options.expected;
                    this.operator = options.operator;
                    if (options.message) {
                        this.message = options.message;
                        this.generatedMessage = false
                    } else {
                        this.message = getMessage(this);
                        this.generatedMessage = true
                    }
                    var stackStartFunction = options.stackStartFunction || fail;
                    if (Error.captureStackTrace) {
                        Error.captureStackTrace(this, stackStartFunction)
                    } else {
                        var err = new Error;
                        if (err.stack) {
                            var out = err.stack;
                            var fn_name = getName(stackStartFunction);
                            var idx = out.indexOf("\n" + fn_name);
                            if (idx >= 0) {
                                var next_line = out.indexOf("\n", idx + 1);
                                out = out.substring(next_line + 1)
                            }
                            this.stack = out
                        }
                    }
                }
                ;
                util.inherits(assert.AssertionError, Error);
                function truncate(s, n) {
                    if (typeof s === "string") {
                        return s.length < n ? s : s.slice(0, n)
                    } else {
                        return s
                    }
                }
                function inspect(something) {
                    if (functionsHaveNames || !util.isFunction(something)) {
                        return util.inspect(something)
                    }
                    var rawname = getName(something);
                    var name = rawname ? ": " + rawname : "";
                    return "[Function" + name + "]"
                }
                function getMessage(self) {
                    return truncate(inspect(self.actual), 128) + " " + self.operator + " " + truncate(inspect(self.expected), 128)
                }
                function fail(actual, expected, message, operator, stackStartFunction) {
                    throw new assert.AssertionError({
                        message: message,
                        actual: actual,
                        expected: expected,
                        operator: operator,
                        stackStartFunction: stackStartFunction
                    })
                }
                assert.fail = fail;
                function ok(value, message) {
                    if (!value)
                        fail(value, true, message, "==", assert.ok)
                }
                assert.ok = ok;
                assert.equal = function equal(actual, expected, message) {
                    if (actual != expected)
                        fail(actual, expected, message, "==", assert.equal)
                }
                ;
                assert.notEqual = function notEqual(actual, expected, message) {
                    if (actual == expected) {
                        fail(actual, expected, message, "!=", assert.notEqual)
                    }
                }
                ;
                assert.deepEqual = function deepEqual(actual, expected, message) {
                    if (!_deepEqual(actual, expected, false)) {
                        fail(actual, expected, message, "deepEqual", assert.deepEqual)
                    }
                }
                ;
                assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
                    if (!_deepEqual(actual, expected, true)) {
                        fail(actual, expected, message, "deepStrictEqual", assert.deepStrictEqual)
                    }
                }
                ;
                function _deepEqual(actual, expected, strict, memos) {
                    if (actual === expected) {
                        return true
                    } else if (isBuffer(actual) && isBuffer(expected)) {
                        return compare(actual, expected) === 0
                    } else if (util.isDate(actual) && util.isDate(expected)) {
                        return actual.getTime() === expected.getTime()
                    } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
                        return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase
                    } else if ((actual === null || typeof actual !== "object") && (expected === null || typeof expected !== "object")) {
                        return strict ? actual === expected : actual == expected
                    } else if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) {
                        return compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0
                    } else if (isBuffer(actual) !== isBuffer(expected)) {
                        return false
                    } else {
                        memos = memos || {
                            actual: [],
                            expected: []
                        };
                        var actualIndex = memos.actual.indexOf(actual);
                        if (actualIndex !== -1) {
                            if (actualIndex === memos.expected.indexOf(expected)) {
                                return true
                            }
                        }
                        memos.actual.push(actual);
                        memos.expected.push(expected);
                        return objEquiv(actual, expected, strict, memos)
                    }
                }
                function isArguments(object) {
                    return Object.prototype.toString.call(object) == "[object Arguments]"
                }
                function objEquiv(a, b, strict, actualVisitedObjects) {
                    if (a === null || a === undefined || b === null || b === undefined)
                        return false;
                    if (util.isPrimitive(a) || util.isPrimitive(b))
                        return a === b;
                    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
                        return false;
                    var aIsArgs = isArguments(a);
                    var bIsArgs = isArguments(b);
                    if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs)
                        return false;
                    if (aIsArgs) {
                        a = pSlice.call(a);
                        b = pSlice.call(b);
                        return _deepEqual(a, b, strict)
                    }
                    var ka = objectKeys(a);
                    var kb = objectKeys(b);
                    var key, i;
                    if (ka.length !== kb.length)
                        return false;
                    ka.sort();
                    kb.sort();
                    for (i = ka.length - 1; i >= 0; i--) {
                        if (ka[i] !== kb[i])
                            return false
                    }
                    for (i = ka.length - 1; i >= 0; i--) {
                        key = ka[i];
                        if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
                            return false
                    }
                    return true
                }
                assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                    if (_deepEqual(actual, expected, false)) {
                        fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual)
                    }
                }
                ;
                assert.notDeepStrictEqual = notDeepStrictEqual;
                function notDeepStrictEqual(actual, expected, message) {
                    if (_deepEqual(actual, expected, true)) {
                        fail(actual, expected, message, "notDeepStrictEqual", notDeepStrictEqual)
                    }
                }
                assert.strictEqual = function strictEqual(actual, expected, message) {
                    if (actual !== expected) {
                        fail(actual, expected, message, "===", assert.strictEqual)
                    }
                }
                ;
                assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                    if (actual === expected) {
                        fail(actual, expected, message, "!==", assert.notStrictEqual)
                    }
                }
                ;
                function expectedException(actual, expected) {
                    if (!actual || !expected) {
                        return false
                    }
                    if (Object.prototype.toString.call(expected) == "[object RegExp]") {
                        return expected.test(actual)
                    }
                    try {
                        if (actual instanceof expected) {
                            return true
                        }
                    } catch (e) {}
                    if (Error.isPrototypeOf(expected)) {
                        return false
                    }
                    return expected.call({}, actual) === true
                }
                function _tryBlock(block) {
                    var error;
                    try {
                        block()
                    } catch (e) {
                        error = e
                    }
                    return error
                }
                function _throws(shouldThrow, block, expected, message) {
                    var actual;
                    if (typeof block !== "function") {
                        throw new TypeError('"block" argument must be a function')
                    }
                    if (typeof expected === "string") {
                        message = expected;
                        expected = null
                    }
                    actual = _tryBlock(block);
                    message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : ".");
                    if (shouldThrow && !actual) {
                        fail(actual, expected, "Missing expected exception" + message)
                    }
                    var userProvidedMessage = typeof message === "string";
                    var isUnwantedException = !shouldThrow && util.isError(actual);
                    var isUnexpectedException = !shouldThrow && actual && !expected;
                    if (isUnwantedException && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) {
                        fail(actual, expected, "Got unwanted exception" + message)
                    }
                    if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
                        throw actual
                    }
                }
                assert.throws = function(block, error, message) {
                    _throws(true, block, error, message)
                }
                ;
                assert.doesNotThrow = function(block, error, message) {
                    _throws(false, block, error, message)
                }
                ;
                assert.ifError = function(err) {
                    if (err)
                        throw err
                }
                ;
                var objectKeys = Object.keys || function(obj) {
                    var keys = [];
                    for (var key in obj) {
                        if (hasOwn.call(obj, key))
                            keys.push(key)
                    }
                    return keys
                }
            }
            ).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }
        , {
            "util/": 104
        }],
        3: [function(require, module, exports) {
            "use strict";
            exports.byteLength = byteLength;
            exports.toByteArray = toByteArray;
            exports.fromByteArray = fromByteArray;
            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (var i = 0, len = code.length; i < len; ++i) {
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i
            }
            revLookup["-".charCodeAt(0)] = 62;
            revLookup["_".charCodeAt(0)] = 63;
            function placeHoldersCount(b64) {
                var len = b64.length;
                if (len % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4")
                }
                return b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0
            }
            function byteLength(b64) {
                return b64.length * 3 / 4 - placeHoldersCount(b64)
            }
            function toByteArray(b64) {
                var i, l, tmp, placeHolders, arr;
                var len = b64.length;
                placeHolders = placeHoldersCount(b64);
                arr = new Arr(len * 3 / 4 - placeHolders);
                l = placeHolders > 0 ? len - 4 : len;
                var L = 0;
                for (i = 0; i < l; i += 4) {
                    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
                    arr[L++] = tmp >> 16 & 255;
                    arr[L++] = tmp >> 8 & 255;
                    arr[L++] = tmp & 255
                }
                if (placeHolders === 2) {
                    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
                    arr[L++] = tmp & 255
                } else if (placeHolders === 1) {
                    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
                    arr[L++] = tmp >> 8 & 255;
                    arr[L++] = tmp & 255
                }
                return arr
            }
            function tripletToBase64(num) {
                return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63]
            }
            function encodeChunk(uint8, start, end) {
                var tmp;
                var output = [];
                for (var i = start; i < end; i += 3) {
                    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
                    output.push(tripletToBase64(tmp))
                }
                return output.join("")
            }
            function fromByteArray(uint8) {
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3;
                var output = "";
                var parts = [];
                var maxChunkLength = 16383;
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength))
                }
                if (extraBytes === 1) {
                    tmp = uint8[len - 1];
                    output += lookup[tmp >> 2];
                    output += lookup[tmp << 4 & 63];
                    output += "=="
                } else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                    output += lookup[tmp >> 10];
                    output += lookup[tmp >> 4 & 63];
                    output += lookup[tmp << 2 & 63];
                    output += "="
                }
                parts.push(output);
                return parts.join("")
            }
        }
        , {}],
        4: [function(require, module, exports) {}
        , {}],
        5: [function(require, module, exports) {
            (function(process, Buffer) {
                "use strict";
                var assert = require("assert");
                var Zstream = require("pako/lib/zlib/zstream");
                var zlib_deflate = require("pako/lib/zlib/deflate.js");
                var zlib_inflate = require("pako/lib/zlib/inflate.js");
                var constants = require("pako/lib/zlib/constants");
                for (var key in constants) {
                    exports[key] = constants[key]
                }
                exports.NONE = 0;
                exports.DEFLATE = 1;
                exports.INFLATE = 2;
                exports.GZIP = 3;
                exports.GUNZIP = 4;
                exports.DEFLATERAW = 5;
                exports.INFLATERAW = 6;
                exports.UNZIP = 7;
                var GZIP_HEADER_ID1 = 31;
                var GZIP_HEADER_ID2 = 139;
                function Zlib(mode) {
                    if (typeof mode !== "number" || mode < exports.DEFLATE || mode > exports.UNZIP) {
                        throw new TypeError("Bad argument")
                    }
                    this.dictionary = null;
                    this.err = 0;
                    this.flush = 0;
                    this.init_done = false;
                    this.level = 0;
                    this.memLevel = 0;
                    this.mode = mode;
                    this.strategy = 0;
                    this.windowBits = 0;
                    this.write_in_progress = false;
                    this.pending_close = false;
                    this.gzip_id_bytes_read = 0
                }
                Zlib.prototype.close = function() {
                    if (this.write_in_progress) {
                        this.pending_close = true;
                        return
                    }
                    this.pending_close = false;
                    assert(this.init_done, "close before init");
                    assert(this.mode <= exports.UNZIP);
                    if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
                        zlib_deflate.deflateEnd(this.strm)
                    } else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) {
                        zlib_inflate.inflateEnd(this.strm)
                    }
                    this.mode = exports.NONE;
                    this.dictionary = null
                }
                ;
                Zlib.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {
                    return this._write(true, flush, input, in_off, in_len, out, out_off, out_len)
                }
                ;
                Zlib.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
                    return this._write(false, flush, input, in_off, in_len, out, out_off, out_len)
                }
                ;
                Zlib.prototype._write = function(async, flush, input, in_off, in_len, out, out_off, out_len) {
                    assert.equal(arguments.length, 8);
                    assert(this.init_done, "write before init");
                    assert(this.mode !== exports.NONE, "already finalized");
                    assert.equal(false, this.write_in_progress, "write already in progress");
                    assert.equal(false, this.pending_close, "close is pending");
                    this.write_in_progress = true;
                    assert.equal(false, flush === undefined, "must provide flush value");
                    this.write_in_progress = true;
                    if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
                        throw new Error("Invalid flush value")
                    }
                    if (input == null) {
                        input = Buffer.alloc(0);
                        in_len = 0;
                        in_off = 0
                    }
                    this.strm.avail_in = in_len;
                    this.strm.input = input;
                    this.strm.next_in = in_off;
                    this.strm.avail_out = out_len;
                    this.strm.output = out;
                    this.strm.next_out = out_off;
                    this.flush = flush;
                    if (!async) {
                        this._process();
                        if (this._checkError()) {
                            return this._afterSync()
                        }
                        return
                    }
                    var self = this;
                    process.nextTick(function() {
                        self._process();
                        self._after()
                    });
                    return this
                }
                ;
                Zlib.prototype._afterSync = function() {
                    var avail_out = this.strm.avail_out;
                    var avail_in = this.strm.avail_in;
                    this.write_in_progress = false;
                    return [avail_in, avail_out]
                }
                ;
                Zlib.prototype._process = function() {
                    var next_expected_header_byte = null;
                    switch (this.mode) {
                    case exports.DEFLATE:
                    case exports.GZIP:
                    case exports.DEFLATERAW:
                        this.err = zlib_deflate.deflate(this.strm, this.flush);
                        break;
                    case exports.UNZIP:
                        if (this.strm.avail_in > 0) {
                            next_expected_header_byte = this.strm.next_in
                        }
                        switch (this.gzip_id_bytes_read) {
                        case 0:
                            if (next_expected_header_byte === null) {
                                break
                            }
                            if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
                                this.gzip_id_bytes_read = 1;
                                next_expected_header_byte++;
                                if (this.strm.avail_in === 1) {
                                    break
                                }
                            } else {
                                this.mode = exports.INFLATE;
                                break
                            }
                        case 1:
                            if (next_expected_header_byte === null) {
                                break
                            }
                            if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
                                this.gzip_id_bytes_read = 2;
                                this.mode = exports.GUNZIP
                            } else {
                                this.mode = exports.INFLATE
                            }
                            break;
                        default:
                            throw new Error("invalid number of gzip magic number bytes read")
                        }
                    case exports.INFLATE:
                    case exports.GUNZIP:
                    case exports.INFLATERAW:
                        this.err = zlib_inflate.inflate(this.strm, this.flush);
                        if (this.err === exports.Z_NEED_DICT && this.dictionary) {
                            this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);
                            if (this.err === exports.Z_OK) {
                                this.err = zlib_inflate.inflate(this.strm, this.flush)
                            } else if (this.err === exports.Z_DATA_ERROR) {
                                this.err = exports.Z_NEED_DICT
                            }
                        }
                        while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0) {
                            this.reset();
                            this.err = zlib_inflate.inflate(this.strm, this.flush)
                        }
                        break;
                    default:
                        throw new Error("Unknown mode " + this.mode)
                    }
                }
                ;
                Zlib.prototype._checkError = function() {
                    switch (this.err) {
                    case exports.Z_OK:
                    case exports.Z_BUF_ERROR:
                        if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
                            this._error("unexpected end of file");
                            return false
                        }
                        break;
                    case exports.Z_STREAM_END:
                        break;
                    case exports.Z_NEED_DICT:
                        if (this.dictionary == null) {
                            this._error("Missing dictionary")
                        } else {
                            this._error("Bad dictionary")
                        }
                        return false;
                    default:
                        this._error("Zlib error");
                        return false
                    }
                    return true
                }
                ;
                Zlib.prototype._after = function() {
                    if (!this._checkError()) {
                        return
                    }
                    var avail_out = this.strm.avail_out;
                    var avail_in = this.strm.avail_in;
                    this.write_in_progress = false;
                    this.callback(avail_in, avail_out);
                    if (this.pending_close) {
                        this.close()
                    }
                }
                ;
                Zlib.prototype._error = function(message) {
                    if (this.strm.msg) {
                        message = this.strm.msg
                    }
                    this.onerror(message, this.err);
                    this.write_in_progress = false;
                    if (this.pending_close) {
                        this.close()
                    }
                }
                ;
                Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
                    assert(arguments.length === 4 || arguments.length === 5, "init(windowBits, level, memLevel, strategy, [dictionary])");
                    assert(windowBits >= 8 && windowBits <= 15, "invalid windowBits");
                    assert(level >= -1 && level <= 9, "invalid compression level");
                    assert(memLevel >= 1 && memLevel <= 9, "invalid memlevel");
                    assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, "invalid strategy");
                    this._init(level, windowBits, memLevel, strategy, dictionary);
                    this._setDictionary()
                }
                ;
                Zlib.prototype.params = function() {
                    throw new Error("deflateParams Not supported")
                }
                ;
                Zlib.prototype.reset = function() {
                    this._reset();
                    this._setDictionary()
                }
                ;
                Zlib.prototype._init = function(level, windowBits, memLevel, strategy, dictionary) {
                    this.level = level;
                    this.windowBits = windowBits;
                    this.memLevel = memLevel;
                    this.strategy = strategy;
                    this.flush = exports.Z_NO_FLUSH;
                    this.err = exports.Z_OK;
                    if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) {
                        this.windowBits += 16
                    }
                    if (this.mode === exports.UNZIP) {
                        this.windowBits += 32
                    }
                    if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) {
                        this.windowBits = -1 * this.windowBits
                    }
                    this.strm = new Zstream;
                    switch (this.mode) {
                    case exports.DEFLATE:
                    case exports.GZIP:
                    case exports.DEFLATERAW:
                        this.err = zlib_deflate.deflateInit2(this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
                        break;
                    case exports.INFLATE:
                    case exports.GUNZIP:
                    case exports.INFLATERAW:
                    case exports.UNZIP:
                        this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits);
                        break;
                    default:
                        throw new Error("Unknown mode " + this.mode)
                    }
                    if (this.err !== exports.Z_OK) {
                        this._error("Init error")
                    }
                    this.dictionary = dictionary;
                    this.write_in_progress = false;
                    this.init_done = true
                }
                ;
                Zlib.prototype._setDictionary = function() {
                    if (this.dictionary == null) {
                        return
                    }
                    this.err = exports.Z_OK;
                    switch (this.mode) {
                    case exports.DEFLATE:
                    case exports.DEFLATERAW:
                        this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
                        break;
                    default:
                        break
                    }
                    if (this.err !== exports.Z_OK) {
                        this._error("Failed to set dictionary")
                    }
                }
                ;
                Zlib.prototype._reset = function() {
                    this.err = exports.Z_OK;
                    switch (this.mode) {
                    case exports.DEFLATE:
                    case exports.DEFLATERAW:
                    case exports.GZIP:
                        this.err = zlib_deflate.deflateReset(this.strm);
                        break;
                    case exports.INFLATE:
                    case exports.INFLATERAW:
                    case exports.GUNZIP:
                        this.err = zlib_inflate.inflateReset(this.strm);
                        break;
                    default:
                        break
                    }
                    if (this.err !== exports.Z_OK) {
                        this._error("Failed to reset stream")
                    }
                }
                ;
                exports.Zlib = Zlib
            }
            ).call(this, require("_process"), require("buffer").Buffer)
        }
        , {
            _process: 73,
            assert: 2,
            buffer: 7,
            "pako/lib/zlib/constants": 41,
            "pako/lib/zlib/deflate.js": 43,
            "pako/lib/zlib/inflate.js": 45,
            "pako/lib/zlib/zstream": 49
        }],
        6: [function(require, module, exports) {
            (function(process) {
                "use strict";
                var Buffer = require("buffer").Buffer;
                var Transform = require("stream").Transform;
                var binding = require("./binding");
                var util = require("util");
                var assert = require("assert").ok;
                var kMaxLength = require("buffer").kMaxLength;
                var kRangeErrorMessage = "Cannot create final Buffer. It would be larger " + "than 0x" + kMaxLength.toString(16) + " bytes";
                binding.Z_MIN_WINDOWBITS = 8;
                binding.Z_MAX_WINDOWBITS = 15;
                binding.Z_DEFAULT_WINDOWBITS = 15;
                binding.Z_MIN_CHUNK = 64;
                binding.Z_MAX_CHUNK = Infinity;
                binding.Z_DEFAULT_CHUNK = 16 * 1024;
                binding.Z_MIN_MEMLEVEL = 1;
                binding.Z_MAX_MEMLEVEL = 9;
                binding.Z_DEFAULT_MEMLEVEL = 8;
                binding.Z_MIN_LEVEL = -1;
                binding.Z_MAX_LEVEL = 9;
                binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;
                var bkeys = Object.keys(binding);
                for (var bk = 0; bk < bkeys.length; bk++) {
                    var bkey = bkeys[bk];
                    if (bkey.match(/^Z/)) {
                        Object.defineProperty(exports, bkey, {
                            enumerable: true,
                            value: binding[bkey],
                            writable: false
                        })
                    }
                }
                var codes = {
                    Z_OK: binding.Z_OK,
                    Z_STREAM_END: binding.Z_STREAM_END,
                    Z_NEED_DICT: binding.Z_NEED_DICT,
                    Z_ERRNO: binding.Z_ERRNO,
                    Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
                    Z_DATA_ERROR: binding.Z_DATA_ERROR,
                    Z_MEM_ERROR: binding.Z_MEM_ERROR,
                    Z_BUF_ERROR: binding.Z_BUF_ERROR,
                    Z_VERSION_ERROR: binding.Z_VERSION_ERROR
                };
                var ckeys = Object.keys(codes);
                for (var ck = 0; ck < ckeys.length; ck++) {
                    var ckey = ckeys[ck];
                    codes[codes[ckey]] = ckey
                }
                Object.defineProperty(exports, "codes", {
                    enumerable: true,
                    value: Object.freeze(codes),
                    writable: false
                });
                exports.Deflate = Deflate;
                exports.Inflate = Inflate;
                exports.Gzip = Gzip;
                exports.Gunzip = Gunzip;
                exports.DeflateRaw = DeflateRaw;
                exports.InflateRaw = InflateRaw;
                exports.Unzip = Unzip;
                exports.createDeflate = function(o) {
                    return new Deflate(o)
                }
                ;
                exports.createInflate = function(o) {
                    return new Inflate(o)
                }
                ;
                exports.createDeflateRaw = function(o) {
                    return new DeflateRaw(o)
                }
                ;
                exports.createInflateRaw = function(o) {
                    return new InflateRaw(o)
                }
                ;
                exports.createGzip = function(o) {
                    return new Gzip(o)
                }
                ;
                exports.createGunzip = function(o) {
                    return new Gunzip(o)
                }
                ;
                exports.createUnzip = function(o) {
                    return new Unzip(o)
                }
                ;
                exports.deflate = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new Deflate(opts), buffer, callback)
                }
                ;
                exports.deflateSync = function(buffer, opts) {
                    return zlibBufferSync(new Deflate(opts), buffer)
                }
                ;
                exports.gzip = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new Gzip(opts), buffer, callback)
                }
                ;
                exports.gzipSync = function(buffer, opts) {
                    return zlibBufferSync(new Gzip(opts), buffer)
                }
                ;
                exports.deflateRaw = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new DeflateRaw(opts), buffer, callback)
                }
                ;
                exports.deflateRawSync = function(buffer, opts) {
                    return zlibBufferSync(new DeflateRaw(opts), buffer)
                }
                ;
                exports.unzip = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new Unzip(opts), buffer, callback)
                }
                ;
                exports.unzipSync = function(buffer, opts) {
                    return zlibBufferSync(new Unzip(opts), buffer)
                }
                ;
                exports.inflate = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new Inflate(opts), buffer, callback)
                }
                ;
                exports.inflateSync = function(buffer, opts) {
                    return zlibBufferSync(new Inflate(opts), buffer)
                }
                ;
                exports.gunzip = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new Gunzip(opts), buffer, callback)
                }
                ;
                exports.gunzipSync = function(buffer, opts) {
                    return zlibBufferSync(new Gunzip(opts), buffer)
                }
                ;
                exports.inflateRaw = function(buffer, opts, callback) {
                    if (typeof opts === "function") {
                        callback = opts;
                        opts = {}
                    }
                    return zlibBuffer(new InflateRaw(opts), buffer, callback)
                }
                ;
                exports.inflateRawSync = function(buffer, opts) {
                    return zlibBufferSync(new InflateRaw(opts), buffer)
                }
                ;
                function zlibBuffer(engine, buffer, callback) {
                    var buffers = [];
                    var nread = 0;
                    engine.on("error", onError);
                    engine.on("end", onEnd);
                    engine.end(buffer);
                    flow();
                    function flow() {
                        var chunk;
                        while (null !== (chunk = engine.read())) {
                            buffers.push(chunk);
                            nread += chunk.length
                        }
                        engine.once("readable", flow)
                    }
                    function onError(err) {
                        engine.removeListener("end", onEnd);
                        engine.removeListener("readable", flow);
                        callback(err)
                    }
                    function onEnd() {
                        var buf;
                        var err = null;
                        if (nread >= kMaxLength) {
                            err = new RangeError(kRangeErrorMessage)
                        } else {
                            buf = Buffer.concat(buffers, nread)
                        }
                        buffers = [];
                        engine.close();
                        callback(err, buf)
                    }
                }
                function zlibBufferSync(engine, buffer) {
                    if (typeof buffer === "string")
                        buffer = Buffer.from(buffer);
                    if (!Buffer.isBuffer(buffer))
                        throw new TypeError("Not a string or buffer");
                    var flushFlag = engine._finishFlushFlag;
                    return engine._processChunk(buffer, flushFlag)
                }
                function Deflate(opts) {
                    if (!(this instanceof Deflate))
                        return new Deflate(opts);
                    Zlib.call(this, opts, binding.DEFLATE)
                }
                function Inflate(opts) {
                    if (!(this instanceof Inflate))
                        return new Inflate(opts);
                    Zlib.call(this, opts, binding.INFLATE)
                }
                function Gzip(opts) {
                    if (!(this instanceof Gzip))
                        return new Gzip(opts);
                    Zlib.call(this, opts, binding.GZIP)
                }
                function Gunzip(opts) {
                    if (!(this instanceof Gunzip))
                        return new Gunzip(opts);
                    Zlib.call(this, opts, binding.GUNZIP)
                }
                function DeflateRaw(opts) {
                    if (!(this instanceof DeflateRaw))
                        return new DeflateRaw(opts);
                    Zlib.call(this, opts, binding.DEFLATERAW)
                }
                function InflateRaw(opts) {
                    if (!(this instanceof InflateRaw))
                        return new InflateRaw(opts);
                    Zlib.call(this, opts, binding.INFLATERAW)
                }
                function Unzip(opts) {
                    if (!(this instanceof Unzip))
                        return new Unzip(opts);
                    Zlib.call(this, opts, binding.UNZIP)
                }
                function isValidFlushFlag(flag) {
                    return flag === binding.Z_NO_FLUSH || flag === binding.Z_PARTIAL_FLUSH || flag === binding.Z_SYNC_FLUSH || flag === binding.Z_FULL_FLUSH || flag === binding.Z_FINISH || flag === binding.Z_BLOCK
                }
                function Zlib(opts, mode) {
                    var _this = this;
                    this._opts = opts = opts || {};
                    this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;
                    Transform.call(this, opts);
                    if (opts.flush && !isValidFlushFlag(opts.flush)) {
                        throw new Error("Invalid flush flag: " + opts.flush)
                    }
                    if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
                        throw new Error("Invalid flush flag: " + opts.finishFlush)
                    }
                    this._flushFlag = opts.flush || binding.Z_NO_FLUSH;
                    this._finishFlushFlag = typeof opts.finishFlush !== "undefined" ? opts.finishFlush : binding.Z_FINISH;
                    if (opts.chunkSize) {
                        if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
                            throw new Error("Invalid chunk size: " + opts.chunkSize)
                        }
                    }
                    if (opts.windowBits) {
                        if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
                            throw new Error("Invalid windowBits: " + opts.windowBits)
                        }
                    }
                    if (opts.level) {
                        if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
                            throw new Error("Invalid compression level: " + opts.level)
                        }
                    }
                    if (opts.memLevel) {
                        if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
                            throw new Error("Invalid memLevel: " + opts.memLevel)
                        }
                    }
                    if (opts.strategy) {
                        if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
                            throw new Error("Invalid strategy: " + opts.strategy)
                        }
                    }
                    if (opts.dictionary) {
                        if (!Buffer.isBuffer(opts.dictionary)) {
                            throw new Error("Invalid dictionary: it should be a Buffer instance")
                        }
                    }
                    this._handle = new binding.Zlib(mode);
                    var self = this;
                    this._hadError = false;
                    this._handle.onerror = function(message, errno) {
                        _close(self);
                        self._hadError = true;
                        var error = new Error(message);
                        error.errno = errno;
                        error.code = exports.codes[errno];
                        self.emit("error", error)
                    }
                    ;
                    var level = exports.Z_DEFAULT_COMPRESSION;
                    if (typeof opts.level === "number")
                        level = opts.level;
                    var strategy = exports.Z_DEFAULT_STRATEGY;
                    if (typeof opts.strategy === "number")
                        strategy = opts.strategy;
                    this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary);
                    this._buffer = Buffer.allocUnsafe(this._chunkSize);
                    this._offset = 0;
                    this._level = level;
                    this._strategy = strategy;
                    this.once("end", this.close);
                    Object.defineProperty(this, "_closed", {
                        get: function() {
                            return !_this._handle
                        },
                        configurable: true,
                        enumerable: true
                    })
                }
                util.inherits(Zlib, Transform);
                Zlib.prototype.params = function(level, strategy, callback) {
                    if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
                        throw new RangeError("Invalid compression level: " + level)
                    }
                    if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
                        throw new TypeError("Invalid strategy: " + strategy)
                    }
                    if (this._level !== level || this._strategy !== strategy) {
                        var self = this;
                        this.flush(binding.Z_SYNC_FLUSH, function() {
                            assert(self._handle, "zlib binding closed");
                            self._handle.params(level, strategy);
                            if (!self._hadError) {
                                self._level = level;
                                self._strategy = strategy;
                                if (callback)
                                    callback()
                            }
                        })
                    } else {
                        process.nextTick(callback)
                    }
                }
                ;
                Zlib.prototype.reset = function() {
                    assert(this._handle, "zlib binding closed");
                    return this._handle.reset()
                }
                ;
                Zlib.prototype._flush = function(callback) {
                    this._transform(Buffer.alloc(0), "", callback)
                }
                ;
                Zlib.prototype.flush = function(kind, callback) {
                    var _this2 = this;
                    var ws = this._writableState;
                    if (typeof kind === "function" || kind === undefined && !callback) {
                        callback = kind;
                        kind = binding.Z_FULL_FLUSH
                    }
                    if (ws.ended) {
                        if (callback)
                            process.nextTick(callback)
                    } else if (ws.ending) {
                        if (callback)
                            this.once("end", callback)
                    } else if (ws.needDrain) {
                        if (callback) {
                            this.once("drain", function() {
                                return _this2.flush(kind, callback)
                            })
                        }
                    } else {
                        this._flushFlag = kind;
                        this.write(Buffer.alloc(0), "", callback)
                    }
                }
                ;
                Zlib.prototype.close = function(callback) {
                    _close(this, callback);
                    process.nextTick(emitCloseNT, this)
                }
                ;
                function _close(engine, callback) {
                    if (callback)
                        process.nextTick(callback);
                    if (!engine._handle)
                        return;
                    engine._handle.close();
                    engine._handle = null
                }
                function emitCloseNT(self) {
                    self.emit("close")
                }
                Zlib.prototype._transform = function(chunk, encoding, cb) {
                    var flushFlag;
                    var ws = this._writableState;
                    var ending = ws.ending || ws.ended;
                    var last = ending && (!chunk || ws.length === chunk.length);
                    if (chunk !== null && !Buffer.isBuffer(chunk))
                        return cb(new Error("invalid input"));
                    if (!this._handle)
                        return cb(new Error("zlib binding closed"));
                    if (last)
                        flushFlag = this._finishFlushFlag;
                    else {
                        flushFlag = this._flushFlag;
                        if (chunk.length >= ws.length) {
                            this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH
                        }
                    }
                    this._processChunk(chunk, flushFlag, cb)
                }
                ;
                Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
                    var availInBefore = chunk && chunk.length;
                    var availOutBefore = this._chunkSize - this._offset;
                    var inOff = 0;
                    var self = this;
                    var async = typeof cb === "function";
                    if (!async) {
                        var buffers = [];
                        var nread = 0;
                        var error;
                        this.on("error", function(er) {
                            error = er
                        });
                        assert(this._handle, "zlib binding closed");
                        do {
                            var res = this._handle.writeSync(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore)
                        } while (!this._hadError && callback(res[0], res[1]));
                        if (this._hadError) {
                            throw error
                        }
                        if (nread >= kMaxLength) {
                            _close(this);
                            throw new RangeError(kRangeErrorMessage)
                        }
                        var buf = Buffer.concat(buffers, nread);
                        _close(this);
                        return buf
                    }
                    assert(this._handle, "zlib binding closed");
                    var req = this._handle.write(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
                    req.buffer = chunk;
                    req.callback = callback;
                    function callback(availInAfter, availOutAfter) {
                        if (this) {
                            this.buffer = null;
                            this.callback = null
                        }
                        if (self._hadError)
                            return;
                        var have = availOutBefore - availOutAfter;
                        assert(have >= 0, "have should not go down");
                        if (have > 0) {
                            var out = self._buffer.slice(self._offset, self._offset + have);
                            self._offset += have;
                            if (async) {
                                self.push(out)
                            } else {
                                buffers.push(out);
                                nread += out.length
                            }
                        }
                        if (availOutAfter === 0 || self._offset >= self._chunkSize) {
                            availOutBefore = self._chunkSize;
                            self._offset = 0;
                            self._buffer = Buffer.allocUnsafe(self._chunkSize)
                        }
                        if (availOutAfter === 0) {
                            inOff += availInBefore - availInAfter;
                            availInBefore = availInAfter;
                            if (!async)
                                return true;
                            var newReq = self._handle.write(flushFlag, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize);
                            newReq.callback = callback;
                            newReq.buffer = chunk;
                            return
                        }
                        if (!async)
                            return false;
                        cb()
                    }
                }
                ;
                util.inherits(Deflate, Zlib);
                util.inherits(Inflate, Zlib);
                util.inherits(Gzip, Zlib);
                util.inherits(Gunzip, Zlib);
                util.inherits(DeflateRaw, Zlib);
                util.inherits(InflateRaw, Zlib);
                util.inherits(Unzip, Zlib)
            }
            ).call(this, require("_process"))
        }
        , {
            "./binding": 5,
            _process: 73,
            assert: 2,
            buffer: 7,
            stream: 82,
            util: 104
        }],
        7: [function(require, module, exports) {
            "use strict";
            var base64 = require("base64-js");
            var ieee754 = require("ieee754");
            exports.Buffer = Buffer;
            exports.SlowBuffer = SlowBuffer;
            exports.INSPECT_MAX_BYTES = 50;
            var K_MAX_LENGTH = 2147483647;
            exports.kMaxLength = K_MAX_LENGTH;
            Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
            if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")
            }
            function typedArraySupport() {
                try {
                    var arr = new Uint8Array(1);
                    arr.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42
                        }
                    };
                    return arr.foo() === 42
                } catch (e) {
                    return false
                }
            }
            function createBuffer(length) {
                if (length > K_MAX_LENGTH) {
                    throw new RangeError("Invalid typed array length")
                }
                var buf = new Uint8Array(length);
                buf.__proto__ = Buffer.prototype;
                return buf
            }
            function Buffer(arg, encodingOrOffset, length) {
                if (typeof arg === "number") {
                    if (typeof encodingOrOffset === "string") {
                        throw new Error("If encoding is specified then the first argument must be a string")
                    }
                    return allocUnsafe(arg)
                }
                return from(arg, encodingOrOffset, length)
            }
            if (typeof Symbol !== "undefined" && Symbol.species && Buffer[Symbol.species] === Buffer) {
                Object.defineProperty(Buffer, Symbol.species, {
                    value: null,
                    configurable: true,
                    enumerable: false,
                    writable: false
                })
            }
            Buffer.poolSize = 8192;
            function from(value, encodingOrOffset, length) {
                if (typeof value === "number") {
                    throw new TypeError('"value" argument must not be a number')
                }
                if (value instanceof ArrayBuffer) {
                    return fromArrayBuffer(value, encodingOrOffset, length)
                }
                if (typeof value === "string") {
                    return fromString(value, encodingOrOffset)
                }
                return fromObject(value)
            }
            Buffer.from = function(value, encodingOrOffset, length) {
                return from(value, encodingOrOffset, length)
            }
            ;
            Buffer.prototype.__proto__ = Uint8Array.prototype;
            Buffer.__proto__ = Uint8Array;
            function assertSize(size) {
                if (typeof size !== "number") {
                    throw new TypeError('"size" argument must be a number')
                } else if (size < 0) {
                    throw new RangeError('"size" argument must not be negative')
                }
            }
            function alloc(size, fill, encoding) {
                assertSize(size);
                if (size <= 0) {
                    return createBuffer(size)
                }
                if (fill !== undefined) {
                    return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill)
                }
                return createBuffer(size)
            }
            Buffer.alloc = function(size, fill, encoding) {
                return alloc(size, fill, encoding)
            }
            ;
            function allocUnsafe(size) {
                assertSize(size);
                return createBuffer(size < 0 ? 0 : checked(size) | 0)
            }
            Buffer.allocUnsafe = function(size) {
                return allocUnsafe(size)
            }
            ;
            Buffer.allocUnsafeSlow = function(size) {
                return allocUnsafe(size)
            }
            ;
            function fromString(string, encoding) {
                if (typeof encoding !== "string" || encoding === "") {
                    encoding = "utf8"
                }
                if (!Buffer.isEncoding(encoding)) {
                    throw new TypeError('"encoding" must be a valid string encoding')
                }
                var length = byteLength(string, encoding) | 0;
                var buf = createBuffer(length);
                var actual = buf.write(string, encoding);
                if (actual !== length) {
                    buf = buf.slice(0, actual)
                }
                return buf
            }
            function fromArrayLike(array) {
                var length = array.length < 0 ? 0 : checked(array.length) | 0;
                var buf = createBuffer(length);
                for (var i = 0; i < length; i += 1) {
                    buf[i] = array[i] & 255
                }
                return buf
            }
            function fromArrayBuffer(array, byteOffset, length) {
                if (byteOffset < 0 || array.byteLength < byteOffset) {
                    throw new RangeError("'offset' is out of bounds")
                }
                if (array.byteLength < byteOffset + (length || 0)) {
                    throw new RangeError("'length' is out of bounds")
                }
                var buf;
                if (byteOffset === undefined && length === undefined) {
                    buf = new Uint8Array(array)
                } else if (length === undefined) {
                    buf = new Uint8Array(array,byteOffset)
                } else {
                    buf = new Uint8Array(array,byteOffset,length)
                }
                buf.__proto__ = Buffer.prototype;
                return buf
            }
            function fromObject(obj) {
                if (Buffer.isBuffer(obj)) {
                    var len = checked(obj.length) | 0;
                    var buf = createBuffer(len);
                    if (buf.length === 0) {
                        return buf
                    }
                    obj.copy(buf, 0, 0, len);
                    return buf
                }
                if (obj) {
                    if (isArrayBufferView(obj) || "length"in obj) {
                        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
                            return createBuffer(0)
                        }
                        return fromArrayLike(obj)
                    }
                    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
                        return fromArrayLike(obj.data)
                    }
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }
            function checked(length) {
                if (length >= K_MAX_LENGTH) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + K_MAX_LENGTH.toString(16) + " bytes")
                }
                return length | 0
            }
            function SlowBuffer(length) {
                if (+length != length) {
                    length = 0
                }
                return Buffer.alloc(+length)
            }
            Buffer.isBuffer = function isBuffer(b) {
                return b != null && b._isBuffer === true
            }
            ;
            Buffer.compare = function compare(a, b) {
                if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                    throw new TypeError("Arguments must be Buffers")
                }
                if (a === b)
                    return 0;
                var x = a.length;
                var y = b.length;
                for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                    if (a[i] !== b[i]) {
                        x = a[i];
                        y = b[i];
                        break
                    }
                }
                if (x < y)
                    return -1;
                if (y < x)
                    return 1;
                return 0
            }
            ;
            Buffer.isEncoding = function isEncoding(encoding) {
                switch (String(encoding).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return true;
                default:
                    return false
                }
            }
            ;
            Buffer.concat = function concat(list, length) {
                if (!Array.isArray(list)) {
                    throw new TypeError('"list" argument must be an Array of Buffers')
                }
                if (list.length === 0) {
                    return Buffer.alloc(0)
                }
                var i;
                if (length === undefined) {
                    length = 0;
                    for (i = 0; i < list.length; ++i) {
                        length += list[i].length
                    }
                }
                var buffer = Buffer.allocUnsafe(length);
                var pos = 0;
                for (i = 0; i < list.length; ++i) {
                    var buf = list[i];
                    if (!Buffer.isBuffer(buf)) {
                        throw new TypeError('"list" argument must be an Array of Buffers')
                    }
                    buf.copy(buffer, pos);
                    pos += buf.length
                }
                return buffer
            }
            ;
            function byteLength(string, encoding) {
                if (Buffer.isBuffer(string)) {
                    return string.length
                }
                if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
                    return string.byteLength
                }
                if (typeof string !== "string") {
                    string = "" + string
                }
                var len = string.length;
                if (len === 0)
                    return 0;
                var loweredCase = false;
                for (; ; ) {
                    switch (encoding) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return len;
                    case "utf8":
                    case "utf-8":
                    case undefined:
                        return utf8ToBytes(string).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return len * 2;
                    case "hex":
                        return len >>> 1;
                    case "base64":
                        return base64ToBytes(string).length;
                    default:
                        if (loweredCase)
                            return utf8ToBytes(string).length;
                        encoding = ("" + encoding).toLowerCase();
                        loweredCase = true
                    }
                }
            }
            Buffer.byteLength = byteLength;
            function slowToString(encoding, start, end) {
                var loweredCase = false;
                if (start === undefined || start < 0) {
                    start = 0
                }
                if (start > this.length) {
                    return ""
                }
                if (end === undefined || end > this.length) {
                    end = this.length
                }
                if (end <= 0) {
                    return ""
                }
                end >>>= 0;
                start >>>= 0;
                if (end <= start) {
                    return ""
                }
                if (!encoding)
                    encoding = "utf8";
                while (true) {
                    switch (encoding) {
                    case "hex":
                        return hexSlice(this, start, end);
                    case "utf8":
                    case "utf-8":
                        return utf8Slice(this, start, end);
                    case "ascii":
                        return asciiSlice(this, start, end);
                    case "latin1":
                    case "binary":
                        return latin1Slice(this, start, end);
                    case "base64":
                        return base64Slice(this, start, end);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return utf16leSlice(this, start, end);
                    default:
                        if (loweredCase)
                            throw new TypeError("Unknown encoding: " + encoding);
                        encoding = (encoding + "").toLowerCase();
                        loweredCase = true
                    }
                }
            }
            Buffer.prototype._isBuffer = true;
            function swap(b, n, m) {
                var i = b[n];
                b[n] = b[m];
                b[m] = i
            }
            Buffer.prototype.swap16 = function swap16() {
                var len = this.length;
                if (len % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits")
                }
                for (var i = 0; i < len; i += 2) {
                    swap(this, i, i + 1)
                }
                return this
            }
            ;
            Buffer.prototype.swap32 = function swap32() {
                var len = this.length;
                if (len % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits")
                }
                for (var i = 0; i < len; i += 4) {
                    swap(this, i, i + 3);
                    swap(this, i + 1, i + 2)
                }
                return this
            }
            ;
            Buffer.prototype.swap64 = function swap64() {
                var len = this.length;
                if (len % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits")
                }
                for (var i = 0; i < len; i += 8) {
                    swap(this, i, i + 7);
                    swap(this, i + 1, i + 6);
                    swap(this, i + 2, i + 5);
                    swap(this, i + 3, i + 4)
                }
                return this
            }
            ;
            Buffer.prototype.toString = function toString() {
                var length = this.length;
                if (length === 0)
                    return "";
                if (arguments.length === 0)
                    return utf8Slice(this, 0, length);
                return slowToString.apply(this, arguments)
            }
            ;
            Buffer.prototype.equals = function equals(b) {
                if (!Buffer.isBuffer(b))
                    throw new TypeError("Argument must be a Buffer");
                if (this === b)
                    return true;
                return Buffer.compare(this, b) === 0
            }
            ;
            Buffer.prototype.inspect = function inspect() {
                var str = "";
                var max = exports.INSPECT_MAX_BYTES;
                if (this.length > 0) {
                    str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
                    if (this.length > max)
                        str += " ... "
                }
                return "<Buffer " + str + ">"
            }
            ;
            Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                if (!Buffer.isBuffer(target)) {
                    throw new TypeError("Argument must be a Buffer")
                }
                if (start === undefined) {
                    start = 0
                }
                if (end === undefined) {
                    end = target ? target.length : 0
                }
                if (thisStart === undefined) {
                    thisStart = 0
                }
                if (thisEnd === undefined) {
                    thisEnd = this.length
                }
                if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                    throw new RangeError("out of range index")
                }
                if (thisStart >= thisEnd && start >= end) {
                    return 0
                }
                if (thisStart >= thisEnd) {
                    return -1
                }
                if (start >= end) {
                    return 1
                }
                start >>>= 0;
                end >>>= 0;
                thisStart >>>= 0;
                thisEnd >>>= 0;
                if (this === target)
                    return 0;
                var x = thisEnd - thisStart;
                var y = end - start;
                var len = Math.min(x, y);
                var thisCopy = this.slice(thisStart, thisEnd);
                var targetCopy = target.slice(start, end);
                for (var i = 0; i < len; ++i) {
                    if (thisCopy[i] !== targetCopy[i]) {
                        x = thisCopy[i];
                        y = targetCopy[i];
                        break
                    }
                }
                if (x < y)
                    return -1;
                if (y < x)
                    return 1;
                return 0
            }
            ;
            function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                if (buffer.length === 0)
                    return -1;
                if (typeof byteOffset === "string") {
                    encoding = byteOffset;
                    byteOffset = 0
                } else if (byteOffset > 2147483647) {
                    byteOffset = 2147483647
                } else if (byteOffset < -2147483648) {
                    byteOffset = -2147483648
                }
                byteOffset = +byteOffset;
                if (numberIsNaN(byteOffset)) {
                    byteOffset = dir ? 0 : buffer.length - 1
                }
                if (byteOffset < 0)
                    byteOffset = buffer.length + byteOffset;
                if (byteOffset >= buffer.length) {
                    if (dir)
                        return -1;
                    else
                        byteOffset = buffer.length - 1
                } else if (byteOffset < 0) {
                    if (dir)
                        byteOffset = 0;
                    else
                        return -1
                }
                if (typeof val === "string") {
                    val = Buffer.from(val, encoding)
                }
                if (Buffer.isBuffer(val)) {
                    if (val.length === 0) {
                        return -1
                    }
                    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
                } else if (typeof val === "number") {
                    val = val & 255;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (dir) {
                            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                        }
                    }
                    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
                }
                throw new TypeError("val must be string, number or Buffer")
            }
            function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                var indexSize = 1;
                var arrLength = arr.length;
                var valLength = val.length;
                if (encoding !== undefined) {
                    encoding = String(encoding).toLowerCase();
                    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
                        if (arr.length < 2 || val.length < 2) {
                            return -1
                        }
                        indexSize = 2;
                        arrLength /= 2;
                        valLength /= 2;
                        byteOffset /= 2
                    }
                }
                function read(buf, i) {
                    if (indexSize === 1) {
                        return buf[i]
                    } else {
                        return buf.readUInt16BE(i * indexSize)
                    }
                }
                var i;
                if (dir) {
                    var foundIndex = -1;
                    for (i = byteOffset; i < arrLength; i++) {
                        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                            if (foundIndex === -1)
                                foundIndex = i;
                            if (i - foundIndex + 1 === valLength)
                                return foundIndex * indexSize
                        } else {
                            if (foundIndex !== -1)
                                i -= i - foundIndex;
                            foundIndex = -1
                        }
                    }
                } else {
                    if (byteOffset + valLength > arrLength)
                        byteOffset = arrLength - valLength;
                    for (i = byteOffset; i >= 0; i--) {
                        var found = true;
                        for (var j = 0; j < valLength; j++) {
                            if (read(arr, i + j) !== read(val, j)) {
                                found = false;
                                break
                            }
                        }
                        if (found)
                            return i
                    }
                }
                return -1
            }
            Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                return this.indexOf(val, byteOffset, encoding) !== -1
            }
            ;
            Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
            }
            ;
            Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
            }
            ;
            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                if (!length) {
                    length = remaining
                } else {
                    length = Number(length);
                    if (length > remaining) {
                        length = remaining
                    }
                }
                var strLen = string.length;
                if (strLen % 2 !== 0)
                    throw new TypeError("Invalid hex string");
                if (length > strLen / 2) {
                    length = strLen / 2
                }
                for (var i = 0; i < length; ++i) {
                    var parsed = parseInt(string.substr(i * 2, 2), 16);
                    if (numberIsNaN(parsed))
                        return i;
                    buf[offset + i] = parsed
                }
                return i
            }
            function utf8Write(buf, string, offset, length) {
                return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
            }
            function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length)
            }
            function latin1Write(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length)
            }
            function base64Write(buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length)
            }
            function ucs2Write(buf, string, offset, length) {
                return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
            }
            Buffer.prototype.write = function write(string, offset, length, encoding) {
                if (offset === undefined) {
                    encoding = "utf8";
                    length = this.length;
                    offset = 0
                } else if (length === undefined && typeof offset === "string") {
                    encoding = offset;
                    length = this.length;
                    offset = 0
                } else if (isFinite(offset)) {
                    offset = offset >>> 0;
                    if (isFinite(length)) {
                        length = length >>> 0;
                        if (encoding === undefined)
                            encoding = "utf8"
                    } else {
                        encoding = length;
                        length = undefined
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")
                }
                var remaining = this.length - offset;
                if (length === undefined || length > remaining)
                    length = remaining;
                if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds")
                }
                if (!encoding)
                    encoding = "utf8";
                var loweredCase = false;
                for (; ; ) {
                    switch (encoding) {
                    case "hex":
                        return hexWrite(this, string, offset, length);
                    case "utf8":
                    case "utf-8":
                        return utf8Write(this, string, offset, length);
                    case "ascii":
                        return asciiWrite(this, string, offset, length);
                    case "latin1":
                    case "binary":
                        return latin1Write(this, string, offset, length);
                    case "base64":
                        return base64Write(this, string, offset, length);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return ucs2Write(this, string, offset, length);
                    default:
                        if (loweredCase)
                            throw new TypeError("Unknown encoding: " + encoding);
                        encoding = ("" + encoding).toLowerCase();
                        loweredCase = true
                    }
                }
            }
            ;
            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
            function base64Slice(buf, start, end) {
                if (start === 0 && end === buf.length) {
                    return base64.fromByteArray(buf)
                } else {
                    return base64.fromByteArray(buf.slice(start, end))
                }
            }
            function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                var res = [];
                var i = start;
                while (i < end) {
                    var firstByte = buf[i];
                    var codePoint = null;
                    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
                    if (i + bytesPerSequence <= end) {
                        var secondByte, thirdByte, fourthByte, tempCodePoint;
                        switch (bytesPerSequence) {
                        case 1:
                            if (firstByte < 128) {
                                codePoint = firstByte
                            }
                            break;
                        case 2:
                            secondByte = buf[i + 1];
                            if ((secondByte & 192) === 128) {
                                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                                if (tempCodePoint > 127) {
                                    codePoint = tempCodePoint
                                }
                            }
                            break;
                        case 3:
                            secondByte = buf[i + 1];
                            thirdByte = buf[i + 2];
                            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                                    codePoint = tempCodePoint
                                }
                            }
                            break;
                        case 4:
                            secondByte = buf[i + 1];
                            thirdByte = buf[i + 2];
                            fourthByte = buf[i + 3];
                            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                                    codePoint = tempCodePoint
                                }
                            }
                        }
                    }
                    if (codePoint === null) {
                        codePoint = 65533;
                        bytesPerSequence = 1
                    } else if (codePoint > 65535) {
                        codePoint -= 65536;
                        res.push(codePoint >>> 10 & 1023 | 55296);
                        codePoint = 56320 | codePoint & 1023
                    }
                    res.push(codePoint);
                    i += bytesPerSequence
                }
                return decodeCodePointsArray(res)
            }
            var MAX_ARGUMENTS_LENGTH = 4096;
            function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (len <= MAX_ARGUMENTS_LENGTH) {
                    return String.fromCharCode.apply(String, codePoints)
                }
                var res = "";
                var i = 0;
                while (i < len) {
                    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH))
                }
                return res
            }
            function asciiSlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; i < end; ++i) {
                    ret += String.fromCharCode(buf[i] & 127)
                }
                return ret
            }
            function latin1Slice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; i < end; ++i) {
                    ret += String.fromCharCode(buf[i])
                }
                return ret
            }
            function hexSlice(buf, start, end) {
                var len = buf.length;
                if (!start || start < 0)
                    start = 0;
                if (!end || end < 0 || end > len)
                    end = len;
                var out = "";
                for (var i = start; i < end; ++i) {
                    out += toHex(buf[i])
                }
                return out
            }
            function utf16leSlice(buf, start, end) {
                var bytes = buf.slice(start, end);
                var res = "";
                for (var i = 0; i < bytes.length; i += 2) {
                    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
                }
                return res
            }
            Buffer.prototype.slice = function slice(start, end) {
                var len = this.length;
                start = ~~start;
                end = end === undefined ? len : ~~end;
                if (start < 0) {
                    start += len;
                    if (start < 0)
                        start = 0
                } else if (start > len) {
                    start = len
                }
                if (end < 0) {
                    end += len;
                    if (end < 0)
                        end = 0
                } else if (end > len) {
                    end = len
                }
                if (end < start)
                    end = start;
                var newBuf = this.subarray(start, end);
                newBuf.__proto__ = Buffer.prototype;
                return newBuf
            }
            ;
            function checkOffset(offset, ext, length) {
                if (offset % 1 !== 0 || offset < 0)
                    throw new RangeError("offset is not uint");
                if (offset + ext > length)
                    throw new RangeError("Trying to access beyond buffer length")
            }
            Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert)
                    checkOffset(offset, byteLength, this.length);
                var val = this[offset];
                var mul = 1;
                var i = 0;
                while (++i < byteLength && (mul *= 256)) {
                    val += this[offset + i] * mul
                }
                return val
            }
            ;
            Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) {
                    checkOffset(offset, byteLength, this.length)
                }
                var val = this[offset + --byteLength];
                var mul = 1;
                while (byteLength > 0 && (mul *= 256)) {
                    val += this[offset + --byteLength] * mul
                }
                return val
            }
            ;
            Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 1, this.length);
                return this[offset]
            }
            ;
            Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 2, this.length);
                return this[offset] | this[offset + 1] << 8
            }
            ;
            Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 2, this.length);
                return this[offset] << 8 | this[offset + 1]
            }
            ;
            Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 4, this.length);
                return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216
            }
            ;
            Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 4, this.length);
                return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3])
            }
            ;
            Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert)
                    checkOffset(offset, byteLength, this.length);
                var val = this[offset];
                var mul = 1;
                var i = 0;
                while (++i < byteLength && (mul *= 256)) {
                    val += this[offset + i] * mul
                }
                mul *= 128;
                if (val >= mul)
                    val -= Math.pow(2, 8 * byteLength);
                return val
            }
            ;
            Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert)
                    checkOffset(offset, byteLength, this.length);
                var i = byteLength;
                var mul = 1;
                var val = this[offset + --i];
                while (i > 0 && (mul *= 256)) {
                    val += this[offset + --i] * mul
                }
                mul *= 128;
                if (val >= mul)
                    val -= Math.pow(2, 8 * byteLength);
                return val
            }
            ;
            Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 1, this.length);
                if (!(this[offset] & 128))
                    return this[offset];
                return (255 - this[offset] + 1) * -1
            }
            ;
            Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 2, this.length);
                var val = this[offset] | this[offset + 1] << 8;
                return val & 32768 ? val | 4294901760 : val
            }
            ;
            Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | this[offset] << 8;
                return val & 32768 ? val | 4294901760 : val
            }
            ;
            Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 4, this.length);
                return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24
            }
            ;
            Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 4, this.length);
                return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]
            }
            ;
            Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 4, this.length);
                return ieee754.read(this, offset, true, 23, 4)
            }
            ;
            Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 4, this.length);
                return ieee754.read(this, offset, false, 23, 4)
            }
            ;
            Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 8, this.length);
                return ieee754.read(this, offset, true, 52, 8)
            }
            ;
            Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert)
                    checkOffset(offset, 8, this.length);
                return ieee754.read(this, offset, false, 52, 8)
            }
            ;
            function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (value > max || value < min)
                    throw new RangeError('"value" argument is out of bounds');
                if (offset + ext > buf.length)
                    throw new RangeError("Index out of range")
            }
            Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                value = +value;
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                    checkInt(this, value, offset, byteLength, maxBytes, 0)
                }
                var mul = 1;
                var i = 0;
                this[offset] = value & 255;
                while (++i < byteLength && (mul *= 256)) {
                    this[offset + i] = value / mul & 255
                }
                return offset + byteLength
            }
            ;
            Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                value = +value;
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                    checkInt(this, value, offset, byteLength, maxBytes, 0)
                }
                var i = byteLength - 1;
                var mul = 1;
                this[offset + i] = value & 255;
                while (--i >= 0 && (mul *= 256)) {
                    this[offset + i] = value / mul & 255
                }
                return offset + byteLength
            }
            ;
            Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 1, 255, 0);
                this[offset] = value & 255;
                return offset + 1
            }
            ;
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 2, 65535, 0);
                this[offset] = value & 255;
                this[offset + 1] = value >>> 8;
                return offset + 2
            }
            ;
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 2, 65535, 0);
                this[offset] = value >>> 8;
                this[offset + 1] = value & 255;
                return offset + 2
            }
            ;
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 4, 4294967295, 0);
                this[offset + 3] = value >>> 24;
                this[offset + 2] = value >>> 16;
                this[offset + 1] = value >>> 8;
                this[offset] = value & 255;
                return offset + 4
            }
            ;
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 4, 4294967295, 0);
                this[offset] = value >>> 24;
                this[offset + 1] = value >>> 16;
                this[offset + 2] = value >>> 8;
                this[offset + 3] = value & 255;
                return offset + 4
            }
            ;
            Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }
                var i = 0;
                var mul = 1;
                var sub = 0;
                this[offset] = value & 255;
                while (++i < byteLength && (mul *= 256)) {
                    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                        sub = 1
                    }
                    this[offset + i] = (value / mul >> 0) - sub & 255
                }
                return offset + byteLength
            }
            ;
            Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }
                var i = byteLength - 1;
                var mul = 1;
                var sub = 0;
                this[offset + i] = value & 255;
                while (--i >= 0 && (mul *= 256)) {
                    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                        sub = 1
                    }
                    this[offset + i] = (value / mul >> 0) - sub & 255
                }
                return offset + byteLength
            }
            ;
            Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 1, 127, -128);
                if (value < 0)
                    value = 255 + value + 1;
                this[offset] = value & 255;
                return offset + 1
            }
            ;
            Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 2, 32767, -32768);
                this[offset] = value & 255;
                this[offset + 1] = value >>> 8;
                return offset + 2
            }
            ;
            Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 2, 32767, -32768);
                this[offset] = value >>> 8;
                this[offset + 1] = value & 255;
                return offset + 2
            }
            ;
            Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 4, 2147483647, -2147483648);
                this[offset] = value & 255;
                this[offset + 1] = value >>> 8;
                this[offset + 2] = value >>> 16;
                this[offset + 3] = value >>> 24;
                return offset + 4
            }
            ;
            Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                    checkInt(this, value, offset, 4, 2147483647, -2147483648);
                if (value < 0)
                    value = 4294967295 + value + 1;
                this[offset] = value >>> 24;
                this[offset + 1] = value >>> 16;
                this[offset + 2] = value >>> 8;
                this[offset + 3] = value & 255;
                return offset + 4
            }
            ;
            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length)
                    throw new RangeError("Index out of range");
                if (offset < 0)
                    throw new RangeError("Index out of range")
            }
            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38)
                }
                ieee754.write(buf, value, offset, littleEndian, 23, 4);
                return offset + 4
            }
            Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                return writeFloat(this, value, offset, true, noAssert)
            }
            ;
            Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                return writeFloat(this, value, offset, false, noAssert)
            }
            ;
            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                    checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308)
                }
                ieee754.write(buf, value, offset, littleEndian, 52, 8);
                return offset + 8
            }
            Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                return writeDouble(this, value, offset, true, noAssert)
            }
            ;
            Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                return writeDouble(this, value, offset, false, noAssert)
            }
            ;
            Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                if (!start)
                    start = 0;
                if (!end && end !== 0)
                    end = this.length;
                if (targetStart >= target.length)
                    targetStart = target.length;
                if (!targetStart)
                    targetStart = 0;
                if (end > 0 && end < start)
                    end = start;
                if (end === start)
                    return 0;
                if (target.length === 0 || this.length === 0)
                    return 0;
                if (targetStart < 0) {
                    throw new RangeError("targetStart out of bounds")
                }
                if (start < 0 || start >= this.length)
                    throw new RangeError("sourceStart out of bounds");
                if (end < 0)
                    throw new RangeError("sourceEnd out of bounds");
                if (end > this.length)
                    end = this.length;
                if (target.length - targetStart < end - start) {
                    end = target.length - targetStart + start
                }
                var len = end - start;
                var i;
                if (this === target && start < targetStart && targetStart < end) {
                    for (i = len - 1; i >= 0; --i) {
                        target[i + targetStart] = this[i + start]
                    }
                } else if (len < 1e3) {
                    for (i = 0; i < len; ++i) {
                        target[i + targetStart] = this[i + start]
                    }
                } else {
                    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart)
                }
                return len
            }
            ;
            Buffer.prototype.fill = function fill(val, start, end, encoding) {
                if (typeof val === "string") {
                    if (typeof start === "string") {
                        encoding = start;
                        start = 0;
                        end = this.length
                    } else if (typeof end === "string") {
                        encoding = end;
                        end = this.length
                    }
                    if (val.length === 1) {
                        var code = val.charCodeAt(0);
                        if (code < 256) {
                            val = code
                        }
                    }
                    if (encoding !== undefined && typeof encoding !== "string") {
                        throw new TypeError("encoding must be a string")
                    }
                    if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
                        throw new TypeError("Unknown encoding: " + encoding)
                    }
                } else if (typeof val === "number") {
                    val = val & 255
                }
                if (start < 0 || this.length < start || this.length < end) {
                    throw new RangeError("Out of range index")
                }
                if (end <= start) {
                    return this
                }
                start = start >>> 0;
                end = end === undefined ? this.length : end >>> 0;
                if (!val)
                    val = 0;
                var i;
                if (typeof val === "number") {
                    for (i = start; i < end; ++i) {
                        this[i] = val
                    }
                } else {
                    var bytes = Buffer.isBuffer(val) ? val : new Buffer(val,encoding);
                    var len = bytes.length;
                    for (i = 0; i < end - start; ++i) {
                        this[i + start] = bytes[i % len]
                    }
                }
                return this
            }
            ;
            var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
            function base64clean(str) {
                str = str.trim().replace(INVALID_BASE64_RE, "");
                if (str.length < 2)
                    return "";
                while (str.length % 4 !== 0) {
                    str = str + "="
                }
                return str
            }
            function toHex(n) {
                if (n < 16)
                    return "0" + n.toString(16);
                return n.toString(16)
            }
            function utf8ToBytes(string, units) {
                units = units || Infinity;
                var codePoint;
                var length = string.length;
                var leadSurrogate = null;
                var bytes = [];
                for (var i = 0; i < length; ++i) {
                    codePoint = string.charCodeAt(i);
                    if (codePoint > 55295 && codePoint < 57344) {
                        if (!leadSurrogate) {
                            if (codePoint > 56319) {
                                if ((units -= 3) > -1)
                                    bytes.push(239, 191, 189);
                                continue
                            } else if (i + 1 === length) {
                                if ((units -= 3) > -1)
                                    bytes.push(239, 191, 189);
                                continue
                            }
                            leadSurrogate = codePoint;
                            continue
                        }
                        if (codePoint < 56320) {
                            if ((units -= 3) > -1)
                                bytes.push(239, 191, 189);
                            leadSurrogate = codePoint;
                            continue
                        }
                        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536
                    } else if (leadSurrogate) {
                        if ((units -= 3) > -1)
                            bytes.push(239, 191, 189)
                    }
                    leadSurrogate = null;
                    if (codePoint < 128) {
                        if ((units -= 1) < 0)
                            break;
                        bytes.push(codePoint)
                    } else if (codePoint < 2048) {
                        if ((units -= 2) < 0)
                            break;
                        bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128)
                    } else if (codePoint < 65536) {
                        if ((units -= 3) < 0)
                            break;
                        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128)
                    } else if (codePoint < 1114112) {
                        if ((units -= 4) < 0)
                            break;
                        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128)
                    } else {
                        throw new Error("Invalid code point")
                    }
                }
                return bytes
            }
            function asciiToBytes(str) {
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                    byteArray.push(str.charCodeAt(i) & 255)
                }
                return byteArray
            }
            function utf16leToBytes(str, units) {
                var c, hi, lo;
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                    if ((units -= 2) < 0)
                        break;
                    c = str.charCodeAt(i);
                    hi = c >> 8;
                    lo = c % 256;
                    byteArray.push(lo);
                    byteArray.push(hi)
                }
                return byteArray
            }
            function base64ToBytes(str) {
                return base64.toByteArray(base64clean(str))
            }
            function blitBuffer(src, dst, offset, length) {
                for (var i = 0; i < length; ++i) {
                    if (i + offset >= dst.length || i >= src.length)
                        break;
                    dst[i + offset] = src[i]
                }
                return i
            }
            function isArrayBufferView(obj) {
                return typeof ArrayBuffer.isView === "function" && ArrayBuffer.isView(obj)
            }
            function numberIsNaN(obj) {
                return obj !== obj
            }
        }
        , {
            "base64-js": 3,
            ieee754: 25
        }],
        8: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var Readable = require("readable-stream").Readable;
                var util = require("util");
                module.exports = ContentStream;
                function ContentStream(obj, options) {
                    if (!(this instanceof ContentStream)) {
                        return new ContentStream(obj,options)
                    }
                    Readable.call(this, options);
                    if (obj === null || obj === undefined) {
                        obj = String(obj)
                    }
                    this._obj = obj
                }
                util.inherits(ContentStream, Readable);
                ContentStream.prototype._read = function(n) {
                    var obj = this._obj;
                    if (typeof obj === "string") {
                        this.push(new Buffer(obj))
                    } else if (Buffer.isBuffer(obj)) {
                        this.push(obj)
                    } else {
                        this.push(new Buffer(JSON.stringify(obj)))
                    }
                    this.push(null)
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            buffer: 7,
            "readable-stream": 79,
            util: 104
        }],
        9: [function(require, module, exports) {
            (function(Buffer) {
                function isArray(arg) {
                    if (Array.isArray) {
                        return Array.isArray(arg)
                    }
                    return objectToString(arg) === "[object Array]"
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return typeof arg === "boolean"
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return arg === null
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return arg == null
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return typeof arg === "number"
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return typeof arg === "string"
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return typeof arg === "symbol"
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return arg === void 0
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return objectToString(re) === "[object RegExp]"
                }
                exports.isRegExp = isRegExp;
                function isObject(arg) {
                    return typeof arg === "object" && arg !== null
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return objectToString(d) === "[object Date]"
                }
                exports.isDate = isDate;
                function isError(e) {
                    return objectToString(e) === "[object Error]" || e instanceof Error
                }
                exports.isError = isError;
                function isFunction(arg) {
                    return typeof arg === "function"
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined"
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = Buffer.isBuffer;
                function objectToString(o) {
                    return Object.prototype.toString.call(o)
                }
            }
            ).call(this, {
                isBuffer: require("../../is-buffer/index.js")
            })
        }
        , {
            "../../is-buffer/index.js": 28
        }],
        10: [function(require, module, exports) {
            "use strict";
            var createThunk = require("./lib/thunk.js");
            function Procedure() {
                this.argTypes = [];
                this.shimArgs = [];
                this.arrayArgs = [];
                this.arrayBlockIndices = [];
                this.scalarArgs = [];
                this.offsetArgs = [];
                this.offsetArgIndex = [];
                this.indexArgs = [];
                this.shapeArgs = [];
                this.funcName = "";
                this.pre = null;
                this.body = null;
                this.post = null;
                this.debug = false
            }
            function compileCwise(user_args) {
                var proc = new Procedure;
                proc.pre = user_args.pre;
                proc.body = user_args.body;
                proc.post = user_args.post;
                var proc_args = user_args.args.slice(0);
                proc.argTypes = proc_args;
                for (var i = 0; i < proc_args.length; ++i) {
                    var arg_type = proc_args[i];
                    if (arg_type === "array" || typeof arg_type === "object" && arg_type.blockIndices) {
                        proc.argTypes[i] = "array";
                        proc.arrayArgs.push(i);
                        proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0);
                        proc.shimArgs.push("array" + i);
                        if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
                            throw new Error("cwise: pre() block may not reference array args")
                        }
                        if (i < proc.post.args.length && proc.post.args[i].count > 0) {
                            throw new Error("cwise: post() block may not reference array args")
                        }
                    } else if (arg_type === "scalar") {
                        proc.scalarArgs.push(i);
                        proc.shimArgs.push("scalar" + i)
                    } else if (arg_type === "index") {
                        proc.indexArgs.push(i);
                        if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
                            throw new Error("cwise: pre() block may not reference array index")
                        }
                        if (i < proc.body.args.length && proc.body.args[i].lvalue) {
                            throw new Error("cwise: body() block may not write to array index")
                        }
                        if (i < proc.post.args.length && proc.post.args[i].count > 0) {
                            throw new Error("cwise: post() block may not reference array index")
                        }
                    } else if (arg_type === "shape") {
                        proc.shapeArgs.push(i);
                        if (i < proc.pre.args.length && proc.pre.args[i].lvalue) {
                            throw new Error("cwise: pre() block may not write to array shape")
                        }
                        if (i < proc.body.args.length && proc.body.args[i].lvalue) {
                            throw new Error("cwise: body() block may not write to array shape")
                        }
                        if (i < proc.post.args.length && proc.post.args[i].lvalue) {
                            throw new Error("cwise: post() block may not write to array shape")
                        }
                    } else if (typeof arg_type === "object" && arg_type.offset) {
                        proc.argTypes[i] = "offset";
                        proc.offsetArgs.push({
                            array: arg_type.array,
                            offset: arg_type.offset
                        });
                        proc.offsetArgIndex.push(i)
                    } else {
                        throw new Error("cwise: Unknown argument type " + proc_args[i])
                    }
                }
                if (proc.arrayArgs.length <= 0) {
                    throw new Error("cwise: No array arguments specified")
                }
                if (proc.pre.args.length > proc_args.length) {
                    throw new Error("cwise: Too many arguments in pre() block")
                }
                if (proc.body.args.length > proc_args.length) {
                    throw new Error("cwise: Too many arguments in body() block")
                }
                if (proc.post.args.length > proc_args.length) {
                    throw new Error("cwise: Too many arguments in post() block")
                }
                proc.debug = !!user_args.printCode || !!user_args.debug;
                proc.funcName = user_args.funcName || "cwise";
                proc.blockSize = user_args.blockSize || 64;
                return createThunk(proc)
            }
            module.exports = compileCwise
        }
        , {
            "./lib/thunk.js": 12
        }],
        11: [function(require, module, exports) {
            "use strict";
            var uniq = require("uniq");
            function innerFill(order, proc, body) {
                var dimension = order.length, nargs = proc.arrayArgs.length, has_index = proc.indexArgs.length > 0, code = [], vars = [], idx = 0, pidx = 0, i, j;
                for (i = 0; i < dimension; ++i) {
                    vars.push(["i", i, "=0"].join(""))
                }
                for (j = 0; j < nargs; ++j) {
                    for (i = 0; i < dimension; ++i) {
                        pidx = idx;
                        idx = order[i];
                        if (i === 0) {
                            vars.push(["d", j, "s", i, "=t", j, "p", idx].join(""))
                        } else {
                            vars.push(["d", j, "s", i, "=(t", j, "p", idx, "-s", pidx, "*t", j, "p", pidx, ")"].join(""))
                        }
                    }
                }
                if (vars.length > 0) {
                    code.push("var " + vars.join(","))
                }
                for (i = dimension - 1; i >= 0; --i) {
                    idx = order[i];
                    code.push(["for(i", i, "=0;i", i, "<s", idx, ";++i", i, "){"].join(""))
                }
                code.push(body);
                for (i = 0; i < dimension; ++i) {
                    pidx = idx;
                    idx = order[i];
                    for (j = 0; j < nargs; ++j) {
                        code.push(["p", j, "+=d", j, "s", i].join(""))
                    }
                    if (has_index) {
                        if (i > 0) {
                            code.push(["index[", pidx, "]-=s", pidx].join(""))
                        }
                        code.push(["++index[", idx, "]"].join(""))
                    }
                    code.push("}")
                }
                return code.join("\n")
            }
            function outerFill(matched, order, proc, body) {
                var dimension = order.length
                  , nargs = proc.arrayArgs.length
                  , blockSize = proc.blockSize
                  , has_index = proc.indexArgs.length > 0
                  , code = [];
                for (var i = 0; i < nargs; ++i) {
                    code.push(["var offset", i, "=p", i].join(""))
                }
                for (var i = matched; i < dimension; ++i) {
                    code.push(["for(var j" + i + "=SS[", order[i], "]|0;j", i, ">0;){"].join(""));
                    code.push(["if(j", i, "<", blockSize, "){"].join(""));
                    code.push(["s", order[i], "=j", i].join(""));
                    code.push(["j", i, "=0"].join(""));
                    code.push(["}else{s", order[i], "=", blockSize].join(""));
                    code.push(["j", i, "-=", blockSize, "}"].join(""));
                    if (has_index) {
                        code.push(["index[", order[i], "]=j", i].join(""))
                    }
                }
                for (var i = 0; i < nargs; ++i) {
                    var indexStr = ["offset" + i];
                    for (var j = matched; j < dimension; ++j) {
                        indexStr.push(["j", j, "*t", i, "p", order[j]].join(""))
                    }
                    code.push(["p", i, "=(", indexStr.join("+"), ")"].join(""))
                }
                code.push(innerFill(order, proc, body));
                for (var i = matched; i < dimension; ++i) {
                    code.push("}")
                }
                return code.join("\n")
            }
            function countMatches(orders) {
                var matched = 0
                  , dimension = orders[0].length;
                while (matched < dimension) {
                    for (var j = 1; j < orders.length; ++j) {
                        if (orders[j][matched] !== orders[0][matched]) {
                            return matched
                        }
                    }
                    ++matched
                }
                return matched
            }
            function processBlock(block, proc, dtypes) {
                var code = block.body;
                var pre = [];
                var post = [];
                for (var i = 0; i < block.args.length; ++i) {
                    var carg = block.args[i];
                    if (carg.count <= 0) {
                        continue
                    }
                    var re = new RegExp(carg.name,"g");
                    var ptrStr = "";
                    var arrNum = proc.arrayArgs.indexOf(i);
                    switch (proc.argTypes[i]) {
                    case "offset":
                        var offArgIndex = proc.offsetArgIndex.indexOf(i);
                        var offArg = proc.offsetArgs[offArgIndex];
                        arrNum = offArg.array;
                        ptrStr = "+q" + offArgIndex;
                    case "array":
                        ptrStr = "p" + arrNum + ptrStr;
                        var localStr = "l" + i;
                        var arrStr = "a" + arrNum;
                        if (proc.arrayBlockIndices[arrNum] === 0) {
                            if (carg.count === 1) {
                                if (dtypes[arrNum] === "generic") {
                                    if (carg.lvalue) {
                                        pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join(""));
                                        code = code.replace(re, localStr);
                                        post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""))
                                    } else {
                                        code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""))
                                    }
                                } else {
                                    code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""))
                                }
                            } else if (dtypes[arrNum] === "generic") {
                                pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join(""));
                                code = code.replace(re, localStr);
                                if (carg.lvalue) {
                                    post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""))
                                }
                            } else {
                                pre.push(["var ", localStr, "=", arrStr, "[", ptrStr, "]"].join(""));
                                code = code.replace(re, localStr);
                                if (carg.lvalue) {
                                    post.push([arrStr, "[", ptrStr, "]=", localStr].join(""))
                                }
                            }
                        } else {
                            var reStrArr = [carg.name]
                              , ptrStrArr = [ptrStr];
                            for (var j = 0; j < Math.abs(proc.arrayBlockIndices[arrNum]); j++) {
                                reStrArr.push("\\s*\\[([^\\]]+)\\]");
                                ptrStrArr.push("$" + (j + 1) + "*t" + arrNum + "b" + j)
                            }
                            re = new RegExp(reStrArr.join(""),"g");
                            ptrStr = ptrStrArr.join("+");
                            if (dtypes[arrNum] === "generic") {
                                throw new Error("cwise: Generic arrays not supported in combination with blocks!")
                            } else {
                                code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""))
                            }
                        }
                        break;
                    case "scalar":
                        code = code.replace(re, "Y" + proc.scalarArgs.indexOf(i));
                        break;
                    case "index":
                        code = code.replace(re, "index");
                        break;
                    case "shape":
                        code = code.replace(re, "shape");
                        break
                    }
                }
                return [pre.join("\n"), code, post.join("\n")].join("\n").trim()
            }
            function typeSummary(dtypes) {
                var summary = new Array(dtypes.length);
                var allEqual = true;
                for (var i = 0; i < dtypes.length; ++i) {
                    var t = dtypes[i];
                    var digits = t.match(/\d+/);
                    if (!digits) {
                        digits = ""
                    } else {
                        digits = digits[0]
                    }
                    if (t.charAt(0) === 0) {
                        summary[i] = "u" + t.charAt(1) + digits
                    } else {
                        summary[i] = t.charAt(0) + digits
                    }
                    if (i > 0) {
                        allEqual = allEqual && summary[i] === summary[i - 1]
                    }
                }
                if (allEqual) {
                    return summary[0]
                }
                return summary.join("")
            }
            function generateCWiseOp(proc, typesig) {
                var dimension = typesig[1].length - Math.abs(proc.arrayBlockIndices[0]) | 0;
                var orders = new Array(proc.arrayArgs.length);
                var dtypes = new Array(proc.arrayArgs.length);
                for (var i = 0; i < proc.arrayArgs.length; ++i) {
                    dtypes[i] = typesig[2 * i];
                    orders[i] = typesig[2 * i + 1]
                }
                var blockBegin = []
                  , blockEnd = [];
                var loopBegin = []
                  , loopEnd = [];
                var loopOrders = [];
                for (var i = 0; i < proc.arrayArgs.length; ++i) {
                    if (proc.arrayBlockIndices[i] < 0) {
                        loopBegin.push(0);
                        loopEnd.push(dimension);
                        blockBegin.push(dimension);
                        blockEnd.push(dimension + proc.arrayBlockIndices[i])
                    } else {
                        loopBegin.push(proc.arrayBlockIndices[i]);
                        loopEnd.push(proc.arrayBlockIndices[i] + dimension);
                        blockBegin.push(0);
                        blockEnd.push(proc.arrayBlockIndices[i])
                    }
                    var newOrder = [];
                    for (var j = 0; j < orders[i].length; j++) {
                        if (loopBegin[i] <= orders[i][j] && orders[i][j] < loopEnd[i]) {
                            newOrder.push(orders[i][j] - loopBegin[i])
                        }
                    }
                    loopOrders.push(newOrder)
                }
                var arglist = ["SS"];
                var code = ["'use strict'"];
                var vars = [];
                for (var j = 0; j < dimension; ++j) {
                    vars.push(["s", j, "=SS[", j, "]"].join(""))
                }
                for (var i = 0; i < proc.arrayArgs.length; ++i) {
                    arglist.push("a" + i);
                    arglist.push("t" + i);
                    arglist.push("p" + i);
                    for (var j = 0; j < dimension; ++j) {
                        vars.push(["t", i, "p", j, "=t", i, "[", loopBegin[i] + j, "]"].join(""))
                    }
                    for (var j = 0; j < Math.abs(proc.arrayBlockIndices[i]); ++j) {
                        vars.push(["t", i, "b", j, "=t", i, "[", blockBegin[i] + j, "]"].join(""))
                    }
                }
                for (var i = 0; i < proc.scalarArgs.length; ++i) {
                    arglist.push("Y" + i)
                }
                if (proc.shapeArgs.length > 0) {
                    vars.push("shape=SS.slice(0)")
                }
                if (proc.indexArgs.length > 0) {
                    var zeros = new Array(dimension);
                    for (var i = 0; i < dimension; ++i) {
                        zeros[i] = "0"
                    }
                    vars.push(["index=[", zeros.join(","), "]"].join(""))
                }
                for (var i = 0; i < proc.offsetArgs.length; ++i) {
                    var off_arg = proc.offsetArgs[i];
                    var init_string = [];
                    for (var j = 0; j < off_arg.offset.length; ++j) {
                        if (off_arg.offset[j] === 0) {
                            continue
                        } else if (off_arg.offset[j] === 1) {
                            init_string.push(["t", off_arg.array, "p", j].join(""))
                        } else {
                            init_string.push([off_arg.offset[j], "*t", off_arg.array, "p", j].join(""))
                        }
                    }
                    if (init_string.length === 0) {
                        vars.push("q" + i + "=0")
                    } else {
                        vars.push(["q", i, "=", init_string.join("+")].join(""))
                    }
                }
                var thisVars = uniq([].concat(proc.pre.thisVars).concat(proc.body.thisVars).concat(proc.post.thisVars));
                vars = vars.concat(thisVars);
                if (vars.length > 0) {
                    code.push("var " + vars.join(","))
                }
                for (var i = 0; i < proc.arrayArgs.length; ++i) {
                    code.push("p" + i + "|=0")
                }
                if (proc.pre.body.length > 3) {
                    code.push(processBlock(proc.pre, proc, dtypes))
                }
                var body = processBlock(proc.body, proc, dtypes);
                var matched = countMatches(loopOrders);
                if (matched < dimension) {
                    code.push(outerFill(matched, loopOrders[0], proc, body))
                } else {
                    code.push(innerFill(loopOrders[0], proc, body))
                }
                if (proc.post.body.length > 3) {
                    code.push(processBlock(proc.post, proc, dtypes))
                }
                if (proc.debug) {
                    console.log("-----Generated cwise routine for ", typesig, ":\n" + code.join("\n") + "\n----------")
                }
                var loopName = [proc.funcName || "unnamed", "_cwise_loop_", orders[0].join("s"), "m", matched, typeSummary(dtypes)].join("");
                var f = new Function(["function ", loopName, "(", arglist.join(","), "){", code.join("\n"), "} return ", loopName].join(""));
                return f()
            }
            module.exports = generateCWiseOp
        }
        , {
            uniq: 100
        }],
        12: [function(require, module, exports) {
            "use strict";
            var compile = require("./compile.js");
            function createThunk(proc) {
                var code = ["'use strict'", "var CACHED={}"];
                var vars = [];
                var thunkName = proc.funcName + "_cwise_thunk";
                code.push(["return function ", thunkName, "(", proc.shimArgs.join(","), "){"].join(""));
                var typesig = [];
                var string_typesig = [];
                var proc_args = [["array", proc.arrayArgs[0], ".shape.slice(", Math.max(0, proc.arrayBlockIndices[0]), proc.arrayBlockIndices[0] < 0 ? "," + proc.arrayBlockIndices[0] + ")" : ")"].join("")];
                var shapeLengthConditions = []
                  , shapeConditions = [];
                for (var i = 0; i < proc.arrayArgs.length; ++i) {
                    var j = proc.arrayArgs[i];
                    vars.push(["t", j, "=array", j, ".dtype,", "r", j, "=array", j, ".order"].join(""));
                    typesig.push("t" + j);
                    typesig.push("r" + j);
                    string_typesig.push("t" + j);
                    string_typesig.push("r" + j + ".join()");
                    proc_args.push("array" + j + ".data");
                    proc_args.push("array" + j + ".stride");
                    proc_args.push("array" + j + ".offset|0");
                    if (i > 0) {
                        shapeLengthConditions.push("array" + proc.arrayArgs[0] + ".shape.length===array" + j + ".shape.length+" + (Math.abs(proc.arrayBlockIndices[0]) - Math.abs(proc.arrayBlockIndices[i])));
                        shapeConditions.push("array" + proc.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[0]) + "]===array" + j + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[i]) + "]")
                    }
                }
                if (proc.arrayArgs.length > 1) {
                    code.push("if (!(" + shapeLengthConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')");
                    code.push("for(var shapeIndex=array" + proc.arrayArgs[0] + ".shape.length-" + Math.abs(proc.arrayBlockIndices[0]) + "; shapeIndex--\x3e0;) {");
                    code.push("if (!(" + shapeConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')");
                    code.push("}")
                }
                for (var i = 0; i < proc.scalarArgs.length; ++i) {
                    proc_args.push("scalar" + proc.scalarArgs[i])
                }
                vars.push(["type=[", string_typesig.join(","), "].join()"].join(""));
                vars.push("proc=CACHED[type]");
                code.push("var " + vars.join(","));
                code.push(["if(!proc){", "CACHED[type]=proc=compile([", typesig.join(","), "])}", "return proc(", proc_args.join(","), ")}"].join(""));
                if (proc.debug) {
                    console.log("-----Generated thunk:\n" + code.join("\n") + "\n----------")
                }
                var thunk = new Function("compile",code.join("\n"));
                return thunk(compile.bind(undefined, proc))
            }
            module.exports = createThunk
        }
        , {
            "./compile.js": 11
        }],
        13: [function(require, module, exports) {
            (function(Buffer) {
                module.exports = dataUriToBuffer;
                function dataUriToBuffer(uri) {
                    if (!/^data\:/i.test(uri)) {
                        throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")')
                    }
                    uri = uri.replace(/\r?\n/g, "");
                    var firstComma = uri.indexOf(",");
                    if (-1 === firstComma || firstComma <= 4)
                        throw new TypeError("malformed data: URI");
                    var meta = uri.substring(5, firstComma).split(";");
                    var base64 = false;
                    var charset = "US-ASCII";
                    for (var i = 0; i < meta.length; i++) {
                        if ("base64" == meta[i]) {
                            base64 = true
                        } else if (0 == meta[i].indexOf("charset=")) {
                            charset = meta[i].substring(8)
                        }
                    }
                    var data = unescape(uri.substring(firstComma + 1));
                    var encoding = base64 ? "base64" : "ascii";
                    var buffer = new Buffer(data,encoding);
                    buffer.type = meta[0] || "text/plain";
                    buffer.charset = charset;
                    return buffer
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            buffer: 7
        }],
        14: [function(require, module, exports) {
            var objectCreate = Object.create || objectCreatePolyfill;
            var objectKeys = Object.keys || objectKeysPolyfill;
            var bind = Function.prototype.bind || functionBindPolyfill;
            function EventEmitter() {
                if (!this._events || !Object.prototype.hasOwnProperty.call(this, "_events")) {
                    this._events = objectCreate(null);
                    this._eventsCount = 0
                }
                this._maxListeners = this._maxListeners || undefined
            }
            module.exports = EventEmitter;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._maxListeners = undefined;
            var defaultMaxListeners = 10;
            var hasDefineProperty;
            try {
                var o = {};
                if (Object.defineProperty)
                    Object.defineProperty(o, "x", {
                        value: 0
                    });
                hasDefineProperty = o.x === 0
            } catch (err) {
                hasDefineProperty = false
            }
            if (hasDefineProperty) {
                Object.defineProperty(EventEmitter, "defaultMaxListeners", {
                    enumerable: true,
                    get: function() {
                        return defaultMaxListeners
                    },
                    set: function(arg) {
                        if (typeof arg !== "number" || arg < 0 || arg !== arg)
                            throw new TypeError('"defaultMaxListeners" must be a positive number');
                        defaultMaxListeners = arg
                    }
                })
            } else {
                EventEmitter.defaultMaxListeners = defaultMaxListeners
            }
            EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
                if (typeof n !== "number" || n < 0 || isNaN(n))
                    throw new TypeError('"n" argument must be a positive number');
                this._maxListeners = n;
                return this
            }
            ;
            function $getMaxListeners(that) {
                if (that._maxListeners === undefined)
                    return EventEmitter.defaultMaxListeners;
                return that._maxListeners
            }
            EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
                return $getMaxListeners(this)
            }
            ;
            function emitNone(handler, isFn, self) {
                if (isFn)
                    handler.call(self);
                else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        listeners[i].call(self)
                }
            }
            function emitOne(handler, isFn, self, arg1) {
                if (isFn)
                    handler.call(self, arg1);
                else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        listeners[i].call(self, arg1)
                }
            }
            function emitTwo(handler, isFn, self, arg1, arg2) {
                if (isFn)
                    handler.call(self, arg1, arg2);
                else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        listeners[i].call(self, arg1, arg2)
                }
            }
            function emitThree(handler, isFn, self, arg1, arg2, arg3) {
                if (isFn)
                    handler.call(self, arg1, arg2, arg3);
                else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        listeners[i].call(self, arg1, arg2, arg3)
                }
            }
            function emitMany(handler, isFn, self, args) {
                if (isFn)
                    handler.apply(self, args);
                else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        listeners[i].apply(self, args)
                }
            }
            EventEmitter.prototype.emit = function emit(type) {
                var er, handler, len, args, i, events;
                var doError = type === "error";
                events = this._events;
                if (events)
                    doError = doError && events.error == null;
                else if (!doError)
                    return false;
                if (doError) {
                    if (arguments.length > 1)
                        er = arguments[1];
                    if (er instanceof Error) {
                        throw er
                    } else {
                        var err = new Error('Unhandled "error" event. (' + er + ")");
                        err.context = er;
                        throw err
                    }
                    return false
                }
                handler = events[type];
                if (!handler)
                    return false;
                var isFn = typeof handler === "function";
                len = arguments.length;
                switch (len) {
                case 1:
                    emitNone(handler, isFn, this);
                    break;
                case 2:
                    emitOne(handler, isFn, this, arguments[1]);
                    break;
                case 3:
                    emitTwo(handler, isFn, this, arguments[1], arguments[2]);
                    break;
                case 4:
                    emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
                    break;
                default:
                    args = new Array(len - 1);
                    for (i = 1; i < len; i++)
                        args[i - 1] = arguments[i];
                    emitMany(handler, isFn, this, args)
                }
                return true
            }
            ;
            function _addListener(target, type, listener, prepend) {
                var m;
                var events;
                var existing;
                if (typeof listener !== "function")
                    throw new TypeError('"listener" argument must be a function');
                events = target._events;
                if (!events) {
                    events = target._events = objectCreate(null);
                    target._eventsCount = 0
                } else {
                    if (events.newListener) {
                        target.emit("newListener", type, listener.listener ? listener.listener : listener);
                        events = target._events
                    }
                    existing = events[type]
                }
                if (!existing) {
                    existing = events[type] = listener;
                    ++target._eventsCount
                } else {
                    if (typeof existing === "function") {
                        existing = events[type] = prepend ? [listener, existing] : [existing, listener]
                    } else {
                        if (prepend) {
                            existing.unshift(listener)
                        } else {
                            existing.push(listener)
                        }
                    }
                    if (!existing.warned) {
                        m = $getMaxListeners(target);
                        if (m && m > 0 && existing.length > m) {
                            existing.warned = true;
                            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + ' "' + String(type) + '" listeners ' + "added. Use emitter.setMaxListeners() to " + "increase limit.");
                            w.name = "MaxListenersExceededWarning";
                            w.emitter = target;
                            w.type = type;
                            w.count = existing.length;
                            if (typeof console === "object" && console.warn) {
                                console.warn("%s: %s", w.name, w.message)
                            }
                        }
                    }
                }
                return target
            }
            EventEmitter.prototype.addListener = function addListener(type, listener) {
                return _addListener(this, type, listener, false)
            }
            ;
            EventEmitter.prototype.on = EventEmitter.prototype.addListener;
            EventEmitter.prototype.prependListener = function prependListener(type, listener) {
                return _addListener(this, type, listener, true)
            }
            ;
            function onceWrapper() {
                if (!this.fired) {
                    this.target.removeListener(this.type, this.wrapFn);
                    this.fired = true;
                    switch (arguments.length) {
                    case 0:
                        return this.listener.call(this.target);
                    case 1:
                        return this.listener.call(this.target, arguments[0]);
                    case 2:
                        return this.listener.call(this.target, arguments[0], arguments[1]);
                    case 3:
                        return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
                    default:
                        var args = new Array(arguments.length);
                        for (var i = 0; i < args.length; ++i)
                            args[i] = arguments[i];
                        this.listener.apply(this.target, args)
                    }
                }
            }
            function _onceWrap(target, type, listener) {
                var state = {
                    fired: false,
                    wrapFn: undefined,
                    target: target,
                    type: type,
                    listener: listener
                };
                var wrapped = bind.call(onceWrapper, state);
                wrapped.listener = listener;
                state.wrapFn = wrapped;
                return wrapped
            }
            EventEmitter.prototype.once = function once(type, listener) {
                if (typeof listener !== "function")
                    throw new TypeError('"listener" argument must be a function');
                this.on(type, _onceWrap(this, type, listener));
                return this
            }
            ;
            EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
                if (typeof listener !== "function")
                    throw new TypeError('"listener" argument must be a function');
                this.prependListener(type, _onceWrap(this, type, listener));
                return this
            }
            ;
            EventEmitter.prototype.removeListener = function removeListener(type, listener) {
                var list, events, position, i, originalListener;
                if (typeof listener !== "function")
                    throw new TypeError('"listener" argument must be a function');
                events = this._events;
                if (!events)
                    return this;
                list = events[type];
                if (!list)
                    return this;
                if (list === listener || list.listener === listener) {
                    if (--this._eventsCount === 0)
                        this._events = objectCreate(null);
                    else {
                        delete events[type];
                        if (events.removeListener)
                            this.emit("removeListener", type, list.listener || listener)
                    }
                } else if (typeof list !== "function") {
                    position = -1;
                    for (i = list.length - 1; i >= 0; i--) {
                        if (list[i] === listener || list[i].listener === listener) {
                            originalListener = list[i].listener;
                            position = i;
                            break
                        }
                    }
                    if (position < 0)
                        return this;
                    if (position === 0)
                        list.shift();
                    else
                        spliceOne(list, position);
                    if (list.length === 1)
                        events[type] = list[0];
                    if (events.removeListener)
                        this.emit("removeListener", type, originalListener || listener)
                }
                return this
            }
            ;
            EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
                var listeners, events, i;
                events = this._events;
                if (!events)
                    return this;
                if (!events.removeListener) {
                    if (arguments.length === 0) {
                        this._events = objectCreate(null);
                        this._eventsCount = 0
                    } else if (events[type]) {
                        if (--this._eventsCount === 0)
                            this._events = objectCreate(null);
                        else
                            delete events[type]
                    }
                    return this
                }
                if (arguments.length === 0) {
                    var keys = objectKeys(events);
                    var key;
                    for (i = 0; i < keys.length; ++i) {
                        key = keys[i];
                        if (key === "removeListener")
                            continue;
                        this.removeAllListeners(key)
                    }
                    this.removeAllListeners("removeListener");
                    this._events = objectCreate(null);
                    this._eventsCount = 0;
                    return this
                }
                listeners = events[type];
                if (typeof listeners === "function") {
                    this.removeListener(type, listeners)
                } else if (listeners) {
                    for (i = listeners.length - 1; i >= 0; i--) {
                        this.removeListener(type, listeners[i])
                    }
                }
                return this
            }
            ;
            function _listeners(target, type, unwrap) {
                var events = target._events;
                if (!events)
                    return [];
                var evlistener = events[type];
                if (!evlistener)
                    return [];
                if (typeof evlistener === "function")
                    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
                return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length)
            }
            EventEmitter.prototype.listeners = function listeners(type) {
                return _listeners(this, type, true)
            }
            ;
            EventEmitter.prototype.rawListeners = function rawListeners(type) {
                return _listeners(this, type, false)
            }
            ;
            EventEmitter.listenerCount = function(emitter, type) {
                if (typeof emitter.listenerCount === "function") {
                    return emitter.listenerCount(type)
                } else {
                    return listenerCount.call(emitter, type)
                }
            }
            ;
            EventEmitter.prototype.listenerCount = listenerCount;
            function listenerCount(type) {
                var events = this._events;
                if (events) {
                    var evlistener = events[type];
                    if (typeof evlistener === "function") {
                        return 1
                    } else if (evlistener) {
                        return evlistener.length
                    }
                }
                return 0
            }
            EventEmitter.prototype.eventNames = function eventNames() {
                return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : []
            }
            ;
            function spliceOne(list, index) {
                for (var i = index, k = i + 1, n = list.length; k < n; i += 1,
                k += 1)
                    list[i] = list[k];
                list.pop()
            }
            function arrayClone(arr, n) {
                var copy = new Array(n);
                for (var i = 0; i < n; ++i)
                    copy[i] = arr[i];
                return copy
            }
            function unwrapListeners(arr) {
                var ret = new Array(arr.length);
                for (var i = 0; i < ret.length; ++i) {
                    ret[i] = arr[i].listener || arr[i]
                }
                return ret
            }
            function objectCreatePolyfill(proto) {
                var F = function() {};
                F.prototype = proto;
                return new F
            }
            function objectKeysPolyfill(obj) {
                var keys = [];
                for (var k in obj)
                    if (Object.prototype.hasOwnProperty.call(obj, k)) {
                        keys.push(k)
                    }
                return k
            }
            function functionBindPolyfill(context) {
                var fn = this;
                return function() {
                    return fn.apply(context, arguments)
                }
            }
        }
        , {}],
        15: [function(require, module, exports) {
            (function(Buffer, process) {
                "use strict";
                var path = require("path");
                var ndarray = require("ndarray");
                var GifReader = require("omggif").GifReader;
                var pack = require("ndarray-pack");
                var through = require("through");
                var parseDataURI = require("data-uri-to-buffer");
                function defaultImage(url, cb) {
                    var img = new Image;
                    img.crossOrigin = "Anonymous";
                    img.onload = function() {
                        var canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var context = canvas.getContext("2d");
                        context.drawImage(img, 0, 0);
                        var pixels = context.getImageData(0, 0, img.width, img.height);
                        cb(null, ndarray(new Uint8Array(pixels.data), [img.width, img.height, 4], [4, 4 * img.width, 1], 0))
                    }
                    ;
                    img.onerror = function(err) {
                        cb(err)
                    }
                    ;
                    img.src = url
                }
                function handleGif(data, cb) {
                    var reader;
                    try {
                        reader = new GifReader(data)
                    } catch (err) {
                        cb(err);
                        return
                    }
                    if (reader.numFrames() > 0) {
                        var framesInfo = [];
                        var nshape = [reader.numFrames(), reader.height, reader.width, 4];
                        var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3]);
                        var result = ndarray(ndata, nshape);
                        try {
                            for (var i = 0; i < reader.numFrames(); ++i) {
                                reader.decodeAndBlitFrameRGBA(i, ndata.subarray(result.index(i, 0, 0, 0), result.index(i + 1, 0, 0, 0)));
                                framesInfo.push(reader.frameInfo(i))
                            }
                        } catch (err) {
                            cb(err);
                            return
                        }
                        cb(null, result.transpose(0, 2, 1), framesInfo)
                    } else {
                        var nshape = [reader.height, reader.width, 4];
                        var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2]);
                        var result = ndarray(ndata, nshape);
                        try {
                            reader.decodeAndBlitFrameRGBA(0, ndata)
                        } catch (err) {
                            cb(err);
                            return
                        }
                        cb(null, result.transpose(1, 0))
                    }
                }
                function httpGif(url, cb) {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, true);
                    xhr.responseType = "arraybuffer";
                    if (xhr.overrideMimeType) {
                        xhr.overrideMimeType("application/binary")
                    }
                    xhr.onerror = function(err) {
                        cb(err)
                    }
                    ;
                    xhr.onload = function() {
                        if (xhr.readyState !== 4) {
                            return
                        }
                        var data = new Uint8Array(xhr.response);
                        handleGif(data, cb);
                        return
                    }
                    ;
                    xhr.send()
                }
                function copyBuffer(buffer) {
                    if (buffer[0] === undefined) {
                        var n = buffer.length;
                        var result = new Uint8Array(n);
                        for (var i = 0; i < n; ++i) {
                            result[i] = buffer.get(i)
                        }
                        return result
                    } else {
                        return new Uint8Array(buffer)
                    }
                }
                function dataGif(url, cb) {
                    process.nextTick(function() {
                        try {
                            var buffer = parseDataURI(url);
                            if (buffer) {
                                handleGif(copyBuffer(buffer), cb)
                            } else {
                                cb(new Error("Error parsing data URI"))
                            }
                        } catch (err) {
                            cb(err)
                        }
                    })
                }
                module.exports = function getPixels(url, type, cb) {
                    if (!cb) {
                        cb = type;
                        type = ""
                    }
                    var ext = path.extname(url);
                    switch (type || ext.toUpperCase()) {
                    case ".GIF":
                        httpGif(url, cb);
                        break;
                    default:
                        if (Buffer.isBuffer(url)) {
                            url = "data:" + type + ";base64," + url.toString("base64")
                        }
                        if (url.indexOf("data:image/gif;") === 0) {
                            dataGif(url, cb)
                        } else {
                            defaultImage(url, cb)
                        }
                    }
                }
            }
            ).call(this, {
                isBuffer: require("../is-buffer/index.js")
            }, require("_process"))
        }
        , {
            "../is-buffer/index.js": 28,
            _process: 73,
            "data-uri-to-buffer": 13,
            ndarray: 37,
            "ndarray-pack": 35,
            omggif: 38,
            path: 50,
            through: 99
        }],
        16: [function(require, module, exports) {
            (function(Buffer) {
                var assert = require("assert");
                var EventEmitter = require("events").EventEmitter;
                var ReadableStream = require("readable-stream");
                var util = require("util");
                var NeuQuant = require("./TypedNeuQuant.js");
                var LZWEncoder = require("./LZWEncoder.js");
                function ByteCapacitor(options) {
                    ReadableStream.call(this, options);
                    this.okayToPush = true;
                    this.resetData()
                }
                util.inherits(ByteCapacitor, ReadableStream);
                ByteCapacitor.prototype._read = function() {
                    this.okayToPush = true
                }
                ;
                ByteCapacitor.prototype.resetData = function() {
                    this.data = []
                }
                ;
                ByteCapacitor.prototype.flushData = function() {
                    if (!this.okayToPush) {
                        var err = new Error("GIF memory limit exceeded. Please `read` from GIF before writing additional frames/information.");
                        return this.emit("error", err)
                    }
                    var buff = new Buffer(this.data);
                    this.resetData();
                    this.okayToPush = this.push(buff)
                }
                ;
                ByteCapacitor.prototype.writeByte = function(val) {
                    this.data.push(val)
                }
                ;
                ByteCapacitor.prototype.writeUTFBytes = function(string) {
                    for (var l = string.length, i = 0; i < l; i++) {
                        this.writeByte(string.charCodeAt(i))
                    }
                }
                ;
                ByteCapacitor.prototype.writeBytes = function(array, offset, length) {
                    for (var l = length || array.length, i = offset || 0; i < l; i++) {
                        this.writeByte(array[i])
                    }
                }
                ;
                function GIFEncoder(width, height, options) {
                    options = options || {};
                    var hwm = options.highWaterMark;
                    ByteCapacitor.call(this, {
                        highWaterMark: hwm || hwm === 0 ? hwm : 64 * 1024
                    });
                    this.width = ~~width;
                    this.height = ~~height;
                    this.transparent = null;
                    this.transIndex = 0;
                    this.repeat = -1;
                    this.delay = 0;
                    this.pixels = null;
                    this.indexedPixels = null;
                    this.colorDepth = null;
                    this.colorTab = null;
                    this.usedEntry = [];
                    this.palSize = 7;
                    this.dispose = -1;
                    this.firstFrame = true;
                    this.sample = 10;
                    var that = this;
                    function flushData() {
                        that.flushData()
                    }
                    this.on("writeHeader#stop", flushData);
                    this.on("frame#stop", flushData);
                    this.on("finish#stop", function finishGif() {
                        flushData();
                        that.push(null)
                    })
                }
                util.inherits(GIFEncoder, ByteCapacitor);
                GIFEncoder.prototype.setDelay = function(milliseconds) {
                    this.delay = Math.round(milliseconds / 10)
                }
                ;
                GIFEncoder.prototype.setFrameRate = function(fps) {
                    this.delay = Math.round(100 / fps)
                }
                ;
                GIFEncoder.prototype.setDispose = function(disposalCode) {
                    if (disposalCode >= 0)
                        this.dispose = disposalCode
                }
                ;
                GIFEncoder.prototype.setRepeat = function(repeat) {
                    this.repeat = repeat
                }
                ;
                GIFEncoder.prototype.setTransparent = function(color) {
                    this.transparent = color
                }
                ;
                GIFEncoder.prototype.analyzeImage = function(imageData) {
                    this.setImagePixels(this.removeAlphaChannel(imageData));
                    this.analyzePixels()
                }
                ;
                GIFEncoder.prototype.writeImageInfo = function() {
                    if (this.firstFrame) {
                        this.writeLSD();
                        this.writePalette();
                        if (this.repeat >= 0) {
                            this.writeNetscapeExt()
                        }
                    }
                    this.writeGraphicCtrlExt();
                    this.writeImageDesc();
                    if (!this.firstFrame)
                        this.writePalette();
                    this.firstFrame = false
                }
                ;
                GIFEncoder.prototype.outputImage = function() {
                    this.writePixels()
                }
                ;
                GIFEncoder.prototype.addFrame = function(imageData) {
                    this.emit("frame#start");
                    this.analyzeImage(imageData);
                    this.writeImageInfo();
                    this.outputImage();
                    this.emit("frame#stop")
                }
                ;
                GIFEncoder.prototype.finish = function() {
                    this.emit("finish#start");
                    this.writeByte(59);
                    this.emit("finish#stop")
                }
                ;
                GIFEncoder.prototype.setQuality = function(quality) {
                    if (quality < 1)
                        quality = 1;
                    this.sample = quality
                }
                ;
                GIFEncoder.prototype.writeHeader = function() {
                    this.emit("writeHeader#start");
                    this.writeUTFBytes("GIF89a");
                    this.emit("writeHeader#stop")
                }
                ;
                GIFEncoder.prototype.analyzePixels = function() {
                    var len = this.pixels.length;
                    var nPix = len / 3;
                    this.indexedPixels = new Uint8Array(nPix);
                    var imgq = new NeuQuant(this.pixels,this.sample);
                    imgq.buildColormap();
                    this.colorTab = imgq.getColormap();
                    var k = 0;
                    for (var j = 0; j < nPix; j++) {
                        var index = imgq.lookupRGB(this.pixels[k++] & 255, this.pixels[k++] & 255, this.pixels[k++] & 255);
                        this.usedEntry[index] = true;
                        this.indexedPixels[j] = index
                    }
                    this.pixels = null;
                    this.colorDepth = 8;
                    this.palSize = 7;
                    if (this.transparent !== null) {
                        this.transIndex = this.findClosest(this.transparent)
                    }
                }
                ;
                GIFEncoder.prototype.findClosest = function(c) {
                    if (this.colorTab === null)
                        return -1;
                    var r = (c & 16711680) >> 16;
                    var g = (c & 65280) >> 8;
                    var b = c & 255;
                    var minpos = 0;
                    var dmin = 256 * 256 * 256;
                    var len = this.colorTab.length;
                    for (var i = 0; i < len; ) {
                        var dr = r - (this.colorTab[i++] & 255);
                        var dg = g - (this.colorTab[i++] & 255);
                        var db = b - (this.colorTab[i] & 255);
                        var d = dr * dr + dg * dg + db * db;
                        var index = i / 3;
                        if (this.usedEntry[index] && d < dmin) {
                            dmin = d;
                            minpos = index
                        }
                        i++
                    }
                    return minpos
                }
                ;
                GIFEncoder.prototype.removeAlphaChannel = function(data) {
                    var w = this.width;
                    var h = this.height;
                    var pixels = new Uint8Array(w * h * 3);
                    var count = 0;
                    for (var i = 0; i < h; i++) {
                        for (var j = 0; j < w; j++) {
                            var b = i * w * 4 + j * 4;
                            pixels[count++] = data[b];
                            pixels[count++] = data[b + 1];
                            pixels[count++] = data[b + 2]
                        }
                    }
                    return pixels
                }
                ;
                GIFEncoder.prototype.setImagePixels = function(pixels) {
                    this.pixels = pixels
                }
                ;
                GIFEncoder.prototype.writeGraphicCtrlExt = function() {
                    this.writeByte(33);
                    this.writeByte(249);
                    this.writeByte(4);
                    var transp, disp;
                    if (this.transparent === null) {
                        transp = 0;
                        disp = 0
                    } else {
                        transp = 1;
                        disp = 2
                    }
                    if (this.dispose >= 0) {
                        disp = dispose & 7
                    }
                    disp <<= 2;
                    this.writeByte(0 | disp | 0 | transp);
                    this.writeShort(this.delay);
                    this.writeByte(this.transIndex);
                    this.writeByte(0)
                }
                ;
                GIFEncoder.prototype.writeImageDesc = function() {
                    this.writeByte(44);
                    this.writeShort(0);
                    this.writeShort(0);
                    this.writeShort(this.width);
                    this.writeShort(this.height);
                    if (this.firstFrame) {
                        this.writeByte(0)
                    } else {
                        this.writeByte(128 | 0 | 0 | 0 | this.palSize)
                    }
                }
                ;
                GIFEncoder.prototype.writeLSD = function() {
                    this.writeShort(this.width);
                    this.writeShort(this.height);
                    this.writeByte(128 | 112 | 0 | this.palSize);
                    this.writeByte(0);
                    this.writeByte(0)
                }
                ;
                GIFEncoder.prototype.writeNetscapeExt = function() {
                    this.writeByte(33);
                    this.writeByte(255);
                    this.writeByte(11);
                    this.writeUTFBytes("NETSCAPE2.0");
                    this.writeByte(3);
                    this.writeByte(1);
                    this.writeShort(this.repeat);
                    this.writeByte(0)
                }
                ;
                GIFEncoder.prototype.writePalette = function() {
                    this.writeBytes(this.colorTab);
                    var n = 3 * 256 - this.colorTab.length;
                    for (var i = 0; i < n; i++)
                        this.writeByte(0)
                }
                ;
                GIFEncoder.prototype.writeShort = function(pValue) {
                    this.writeByte(pValue & 255);
                    this.writeByte(pValue >> 8 & 255)
                }
                ;
                GIFEncoder.prototype.writePixels = function() {
                    var enc = new LZWEncoder(this.width,this.height,this.indexedPixels,this.colorDepth);
                    enc.encode(this)
                }
                ;
                GIFEncoder.prototype.stream = function() {
                    return this
                }
                ;
                GIFEncoder.ByteCapacitor = ByteCapacitor;
                module.exports = GIFEncoder
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./LZWEncoder.js": 17,
            "./TypedNeuQuant.js": 18,
            assert: 2,
            buffer: 7,
            events: 14,
            "readable-stream": 24,
            util: 104
        }],
        17: [function(require, module, exports) {
            var EOF = -1;
            var BITS = 12;
            var HSIZE = 5003;
            var masks = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535];
            function LZWEncoder(width, height, pixels, colorDepth) {
                var initCodeSize = Math.max(2, colorDepth);
                var accum = new Uint8Array(256);
                var htab = new Int32Array(HSIZE);
                var codetab = new Int32Array(HSIZE);
                var cur_accum, cur_bits = 0;
                var a_count;
                var free_ent = 0;
                var maxcode;
                var remaining;
                var curPixel;
                var n_bits;
                var clear_flg = false;
                var g_init_bits, ClearCode, EOFCode;
                function char_out(c, outs) {
                    accum[a_count++] = c;
                    if (a_count >= 254)
                        flush_char(outs)
                }
                function cl_block(outs) {
                    cl_hash(HSIZE);
                    free_ent = ClearCode + 2;
                    clear_flg = true;
                    output(ClearCode, outs)
                }
                function cl_hash(hsize) {
                    for (var i = 0; i < hsize; ++i)
                        htab[i] = -1
                }
                function compress(init_bits, outs) {
                    var fcode, c, i, ent, disp, hsize_reg, hshift;
                    g_init_bits = init_bits;
                    clear_flg = false;
                    n_bits = g_init_bits;
                    maxcode = MAXCODE(n_bits);
                    ClearCode = 1 << init_bits - 1;
                    EOFCode = ClearCode + 1;
                    free_ent = ClearCode + 2;
                    a_count = 0;
                    ent = nextPixel();
                    hshift = 0;
                    for (fcode = HSIZE; fcode < 65536; fcode *= 2)
                        ++hshift;
                    hshift = 8 - hshift;
                    hsize_reg = HSIZE;
                    cl_hash(hsize_reg);
                    output(ClearCode, outs);
                    outer_loop: while ((c = nextPixel()) != EOF) {
                        fcode = (c << BITS) + ent;
                        i = c << hshift ^ ent;
                        if (htab[i] === fcode) {
                            ent = codetab[i];
                            continue
                        } else if (htab[i] >= 0) {
                            disp = hsize_reg - i;
                            if (i === 0)
                                disp = 1;
                            do {
                                if ((i -= disp) < 0)
                                    i += hsize_reg;
                                if (htab[i] === fcode) {
                                    ent = codetab[i];
                                    continue outer_loop
                                }
                            } while (htab[i] >= 0)
                        }
                        output(ent, outs);
                        ent = c;
                        if (free_ent < 1 << BITS) {
                            codetab[i] = free_ent++;
                            htab[i] = fcode
                        } else {
                            cl_block(outs)
                        }
                    }
                    output(ent, outs);
                    output(EOFCode, outs)
                }
                function encode(outs) {
                    outs.writeByte(initCodeSize);
                    remaining = width * height;
                    curPixel = 0;
                    compress(initCodeSize + 1, outs);
                    outs.writeByte(0)
                }
                function flush_char(outs) {
                    if (a_count > 0) {
                        outs.writeByte(a_count);
                        outs.writeBytes(accum, 0, a_count);
                        a_count = 0
                    }
                }
                function MAXCODE(n_bits) {
                    return (1 << n_bits) - 1
                }
                function nextPixel() {
                    if (remaining === 0)
                        return EOF;
                    --remaining;
                    var pix = pixels[curPixel++];
                    return pix & 255
                }
                function output(code, outs) {
                    cur_accum &= masks[cur_bits];
                    if (cur_bits > 0)
                        cur_accum |= code << cur_bits;
                    else
                        cur_accum = code;
                    cur_bits += n_bits;
                    while (cur_bits >= 8) {
                        char_out(cur_accum & 255, outs);
                        cur_accum >>= 8;
                        cur_bits -= 8
                    }
                    if (free_ent > maxcode || clear_flg) {
                        if (clear_flg) {
                            maxcode = MAXCODE(n_bits = g_init_bits);
                            clear_flg = false
                        } else {
                            ++n_bits;
                            if (n_bits == BITS)
                                maxcode = 1 << BITS;
                            else
                                maxcode = MAXCODE(n_bits)
                        }
                    }
                    if (code == EOFCode) {
                        while (cur_bits > 0) {
                            char_out(cur_accum & 255, outs);
                            cur_accum >>= 8;
                            cur_bits -= 8
                        }
                        flush_char(outs)
                    }
                }
                this.encode = encode
            }
            module.exports = LZWEncoder
        }
        , {}],
        18: [function(require, module, exports) {
            var ncycles = 100;
            var netsize = 256;
            var maxnetpos = netsize - 1;
            var netbiasshift = 4;
            var intbiasshift = 16;
            var intbias = 1 << intbiasshift;
            var gammashift = 10;
            var gamma = 1 << gammashift;
            var betashift = 10;
            var beta = intbias >> betashift;
            var betagamma = intbias << gammashift - betashift;
            var initrad = netsize >> 3;
            var radiusbiasshift = 6;
            var radiusbias = 1 << radiusbiasshift;
            var initradius = initrad * radiusbias;
            var radiusdec = 30;
            var alphabiasshift = 10;
            var initalpha = 1 << alphabiasshift;
            var alphadec;
            var radbiasshift = 8;
            var radbias = 1 << radbiasshift;
            var alpharadbshift = alphabiasshift + radbiasshift;
            var alpharadbias = 1 << alpharadbshift;
            var prime1 = 499;
            var prime2 = 491;
            var prime3 = 487;
            var prime4 = 503;
            var minpicturebytes = 3 * prime4;
            function NeuQuant(pixels, samplefac) {
                var network;
                var netindex;
                var bias;
                var freq;
                var radpower;
                function init() {
                    network = [];
                    netindex = new Int32Array(256);
                    bias = new Int32Array(netsize);
                    freq = new Int32Array(netsize);
                    radpower = new Int32Array(netsize >> 3);
                    var i, v;
                    for (i = 0; i < netsize; i++) {
                        v = (i << netbiasshift + 8) / netsize;
                        network[i] = new Float64Array([v, v, v, 0]);
                        freq[i] = intbias / netsize;
                        bias[i] = 0
                    }
                }
                function unbiasnet() {
                    for (var i = 0; i < netsize; i++) {
                        network[i][0] >>= netbiasshift;
                        network[i][1] >>= netbiasshift;
                        network[i][2] >>= netbiasshift;
                        network[i][3] = i
                    }
                }
                function altersingle(alpha, i, b, g, r) {
                    network[i][0] -= alpha * (network[i][0] - b) / initalpha;
                    network[i][1] -= alpha * (network[i][1] - g) / initalpha;
                    network[i][2] -= alpha * (network[i][2] - r) / initalpha
                }
                function alterneigh(radius, i, b, g, r) {
                    var lo = Math.abs(i - radius);
                    var hi = Math.min(i + radius, netsize);
                    var j = i + 1;
                    var k = i - 1;
                    var m = 1;
                    var p, a;
                    while (j < hi || k > lo) {
                        a = radpower[m++];
                        if (j < hi) {
                            p = network[j++];
                            p[0] -= a * (p[0] - b) / alpharadbias;
                            p[1] -= a * (p[1] - g) / alpharadbias;
                            p[2] -= a * (p[2] - r) / alpharadbias
                        }
                        if (k > lo) {
                            p = network[k--];
                            p[0] -= a * (p[0] - b) / alpharadbias;
                            p[1] -= a * (p[1] - g) / alpharadbias;
                            p[2] -= a * (p[2] - r) / alpharadbias
                        }
                    }
                }
                function contest(b, g, r) {
                    var bestd = ~(1 << 31);
                    var bestbiasd = bestd;
                    var bestpos = -1;
                    var bestbiaspos = bestpos;
                    var i, n, dist, biasdist, betafreq;
                    for (i = 0; i < netsize; i++) {
                        n = network[i];
                        dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
                        if (dist < bestd) {
                            bestd = dist;
                            bestpos = i
                        }
                        biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);
                        if (biasdist < bestbiasd) {
                            bestbiasd = biasdist;
                            bestbiaspos = i
                        }
                        betafreq = freq[i] >> betashift;
                        freq[i] -= betafreq;
                        bias[i] += betafreq << gammashift
                    }
                    freq[bestpos] += beta;
                    bias[bestpos] -= betagamma;
                    return bestbiaspos
                }
                function inxbuild() {
                    var i, j, p, q, smallpos, smallval, previouscol = 0, startpos = 0;
                    for (i = 0; i < netsize; i++) {
                        p = network[i];
                        smallpos = i;
                        smallval = p[1];
                        for (j = i + 1; j < netsize; j++) {
                            q = network[j];
                            if (q[1] < smallval) {
                                smallpos = j;
                                smallval = q[1]
                            }
                        }
                        q = network[smallpos];
                        if (i != smallpos) {
                            j = q[0];
                            q[0] = p[0];
                            p[0] = j;
                            j = q[1];
                            q[1] = p[1];
                            p[1] = j;
                            j = q[2];
                            q[2] = p[2];
                            p[2] = j;
                            j = q[3];
                            q[3] = p[3];
                            p[3] = j
                        }
                        if (smallval != previouscol) {
                            netindex[previouscol] = startpos + i >> 1;
                            for (j = previouscol + 1; j < smallval; j++)
                                netindex[j] = i;
                            previouscol = smallval;
                            startpos = i
                        }
                    }
                    netindex[previouscol] = startpos + maxnetpos >> 1;
                    for (j = previouscol + 1; j < 256; j++)
                        netindex[j] = maxnetpos
                }
                function inxsearch(b, g, r) {
                    var a, p, dist;
                    var bestd = 1e3;
                    var best = -1;
                    var i = netindex[g];
                    var j = i - 1;
                    while (i < netsize || j >= 0) {
                        if (i < netsize) {
                            p = network[i];
                            dist = p[1] - g;
                            if (dist >= bestd)
                                i = netsize;
                            else {
                                i++;
                                if (dist < 0)
                                    dist = -dist;
                                a = p[0] - b;
                                if (a < 0)
                                    a = -a;
                                dist += a;
                                if (dist < bestd) {
                                    a = p[2] - r;
                                    if (a < 0)
                                        a = -a;
                                    dist += a;
                                    if (dist < bestd) {
                                        bestd = dist;
                                        best = p[3]
                                    }
                                }
                            }
                        }
                        if (j >= 0) {
                            p = network[j];
                            dist = g - p[1];
                            if (dist >= bestd)
                                j = -1;
                            else {
                                j--;
                                if (dist < 0)
                                    dist = -dist;
                                a = p[0] - b;
                                if (a < 0)
                                    a = -a;
                                dist += a;
                                if (dist < bestd) {
                                    a = p[2] - r;
                                    if (a < 0)
                                        a = -a;
                                    dist += a;
                                    if (dist < bestd) {
                                        bestd = dist;
                                        best = p[3]
                                    }
                                }
                            }
                        }
                    }
                    return best
                }
                function learn() {
                    var i;
                    var lengthcount = pixels.length;
                    var alphadec = 30 + (samplefac - 1) / 3;
                    var samplepixels = lengthcount / (3 * samplefac);
                    var delta = ~~(samplepixels / ncycles);
                    var alpha = initalpha;
                    var radius = initradius;
                    var rad = radius >> radiusbiasshift;
                    if (rad <= 1)
                        rad = 0;
                    for (i = 0; i < rad; i++)
                        radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));
                    var step;
                    if (lengthcount < minpicturebytes) {
                        samplefac = 1;
                        step = 3
                    } else if (lengthcount % prime1 !== 0) {
                        step = 3 * prime1
                    } else if (lengthcount % prime2 !== 0) {
                        step = 3 * prime2
                    } else if (lengthcount % prime3 !== 0) {
                        step = 3 * prime3
                    } else {
                        step = 3 * prime4
                    }
                    var b, g, r, j;
                    var pix = 0;
                    i = 0;
                    while (i < samplepixels) {
                        b = (pixels[pix] & 255) << netbiasshift;
                        g = (pixels[pix + 1] & 255) << netbiasshift;
                        r = (pixels[pix + 2] & 255) << netbiasshift;
                        j = contest(b, g, r);
                        altersingle(alpha, j, b, g, r);
                        if (rad !== 0)
                            alterneigh(rad, j, b, g, r);
                        pix += step;
                        if (pix >= lengthcount)
                            pix -= lengthcount;
                        i++;
                        if (delta === 0)
                            delta = 1;
                        if (i % delta === 0) {
                            alpha -= alpha / alphadec;
                            radius -= radius / radiusdec;
                            rad = radius >> radiusbiasshift;
                            if (rad <= 1)
                                rad = 0;
                            for (j = 0; j < rad; j++)
                                radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad))
                        }
                    }
                }
                function buildColormap() {
                    init();
                    learn();
                    unbiasnet();
                    inxbuild()
                }
                this.buildColormap = buildColormap;
                function getColormap() {
                    var map = [];
                    var index = [];
                    for (var i = 0; i < netsize; i++)
                        index[network[i][3]] = i;
                    var k = 0;
                    for (var l = 0; l < netsize; l++) {
                        var j = index[l];
                        map[k++] = network[j][0];
                        map[k++] = network[j][1];
                        map[k++] = network[j][2]
                    }
                    return map
                }
                this.getColormap = getColormap;
                this.lookupRGB = inxsearch
            }
            module.exports = NeuQuant
        }
        , {}],
        19: [function(require, module, exports) {
            (function(process) {
                module.exports = Duplex;
                var objectKeys = Object.keys || function(obj) {
                    var keys = [];
                    for (var key in obj)
                        keys.push(key);
                    return keys
                }
                ;
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var Readable = require("./_stream_readable");
                var Writable = require("./_stream_writable");
                util.inherits(Duplex, Readable);
                forEach(objectKeys(Writable.prototype), function(method) {
                    if (!Duplex.prototype[method])
                        Duplex.prototype[method] = Writable.prototype[method]
                });
                function Duplex(options) {
                    if (!(this instanceof Duplex))
                        return new Duplex(options);
                    Readable.call(this, options);
                    Writable.call(this, options);
                    if (options && options.readable === false)
                        this.readable = false;
                    if (options && options.writable === false)
                        this.writable = false;
                    this.allowHalfOpen = true;
                    if (options && options.allowHalfOpen === false)
                        this.allowHalfOpen = false;
                    this.once("end", onend)
                }
                function onend() {
                    if (this.allowHalfOpen || this._writableState.ended)
                        return;
                    process.nextTick(this.end.bind(this))
                }
                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i)
                    }
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./_stream_readable": 21,
            "./_stream_writable": 23,
            _process: 73,
            "core-util-is": 9,
            inherits: 26
        }],
        20: [function(require, module, exports) {
            module.exports = PassThrough;
            var Transform = require("./_stream_transform");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(PassThrough, Transform);
            function PassThrough(options) {
                if (!(this instanceof PassThrough))
                    return new PassThrough(options);
                Transform.call(this, options)
            }
            PassThrough.prototype._transform = function(chunk, encoding, cb) {
                cb(null, chunk)
            }
        }
        , {
            "./_stream_transform": 22,
            "core-util-is": 9,
            inherits: 26
        }],
        21: [function(require, module, exports) {
            (function(process) {
                module.exports = Readable;
                var isArray = require("isarray");
                var Buffer = require("buffer").Buffer;
                Readable.ReadableState = ReadableState;
                var EE = require("events").EventEmitter;
                if (!EE.listenerCount)
                    EE.listenerCount = function(emitter, type) {
                        return emitter.listeners(type).length
                    }
                    ;
                var Stream = require("stream");
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var StringDecoder;
                var debug = require("util");
                if (debug && debug.debuglog) {
                    debug = debug.debuglog("stream")
                } else {
                    debug = function() {}
                }
                util.inherits(Readable, Stream);
                function ReadableState(options, stream) {
                    var Duplex = require("./_stream_duplex");
                    options = options || {};
                    var hwm = options.highWaterMark;
                    var defaultHwm = options.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.buffer = [];
                    this.length = 0;
                    this.pipes = null;
                    this.pipesCount = 0;
                    this.flowing = null;
                    this.ended = false;
                    this.endEmitted = false;
                    this.reading = false;
                    this.sync = true;
                    this.needReadable = false;
                    this.emittedReadable = false;
                    this.readableListening = false;
                    this.objectMode = !!options.objectMode;
                    if (stream instanceof Duplex)
                        this.objectMode = this.objectMode || !!options.readableObjectMode;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.ranOut = false;
                    this.awaitDrain = 0;
                    this.readingMore = false;
                    this.decoder = null;
                    this.encoding = null;
                    if (options.encoding) {
                        if (!StringDecoder)
                            StringDecoder = require("string_decoder/").StringDecoder;
                        this.decoder = new StringDecoder(options.encoding);
                        this.encoding = options.encoding
                    }
                }
                function Readable(options) {
                    var Duplex = require("./_stream_duplex");
                    if (!(this instanceof Readable))
                        return new Readable(options);
                    this._readableState = new ReadableState(options,this);
                    this.readable = true;
                    Stream.call(this)
                }
                Readable.prototype.push = function(chunk, encoding) {
                    var state = this._readableState;
                    if (util.isString(chunk) && !state.objectMode) {
                        encoding = encoding || state.defaultEncoding;
                        if (encoding !== state.encoding) {
                            chunk = new Buffer(chunk,encoding);
                            encoding = ""
                        }
                    }
                    return readableAddChunk(this, state, chunk, encoding, false)
                }
                ;
                Readable.prototype.unshift = function(chunk) {
                    var state = this._readableState;
                    return readableAddChunk(this, state, chunk, "", true)
                }
                ;
                function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                    var er = chunkInvalid(state, chunk);
                    if (er) {
                        stream.emit("error", er)
                    } else if (util.isNullOrUndefined(chunk)) {
                        state.reading = false;
                        if (!state.ended)
                            onEofChunk(stream, state)
                    } else if (state.objectMode || chunk && chunk.length > 0) {
                        if (state.ended && !addToFront) {
                            var e = new Error("stream.push() after EOF");
                            stream.emit("error", e)
                        } else if (state.endEmitted && addToFront) {
                            var e = new Error("stream.unshift() after end event");
                            stream.emit("error", e)
                        } else {
                            if (state.decoder && !addToFront && !encoding)
                                chunk = state.decoder.write(chunk);
                            if (!addToFront)
                                state.reading = false;
                            if (state.flowing && state.length === 0 && !state.sync) {
                                stream.emit("data", chunk);
                                stream.read(0)
                            } else {
                                state.length += state.objectMode ? 1 : chunk.length;
                                if (addToFront)
                                    state.buffer.unshift(chunk);
                                else
                                    state.buffer.push(chunk);
                                if (state.needReadable)
                                    emitReadable(stream)
                            }
                            maybeReadMore(stream, state)
                        }
                    } else if (!addToFront) {
                        state.reading = false
                    }
                    return needMoreData(state)
                }
                function needMoreData(state) {
                    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0)
                }
                Readable.prototype.setEncoding = function(enc) {
                    if (!StringDecoder)
                        StringDecoder = require("string_decoder/").StringDecoder;
                    this._readableState.decoder = new StringDecoder(enc);
                    this._readableState.encoding = enc;
                    return this
                }
                ;
                var MAX_HWM = 8388608;
                function roundUpToNextPowerOf2(n) {
                    if (n >= MAX_HWM) {
                        n = MAX_HWM
                    } else {
                        n--;
                        for (var p = 1; p < 32; p <<= 1)
                            n |= n >> p;
                        n++
                    }
                    return n
                }
                function howMuchToRead(n, state) {
                    if (state.length === 0 && state.ended)
                        return 0;
                    if (state.objectMode)
                        return n === 0 ? 0 : 1;
                    if (isNaN(n) || util.isNull(n)) {
                        if (state.flowing && state.buffer.length)
                            return state.buffer[0].length;
                        else
                            return state.length
                    }
                    if (n <= 0)
                        return 0;
                    if (n > state.highWaterMark)
                        state.highWaterMark = roundUpToNextPowerOf2(n);
                    if (n > state.length) {
                        if (!state.ended) {
                            state.needReadable = true;
                            return 0
                        } else
                            return state.length
                    }
                    return n
                }
                Readable.prototype.read = function(n) {
                    debug("read", n);
                    var state = this._readableState;
                    var nOrig = n;
                    if (!util.isNumber(n) || n > 0)
                        state.emittedReadable = false;
                    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
                        debug("read: emitReadable", state.length, state.ended);
                        if (state.length === 0 && state.ended)
                            endReadable(this);
                        else
                            emitReadable(this);
                        return null
                    }
                    n = howMuchToRead(n, state);
                    if (n === 0 && state.ended) {
                        if (state.length === 0)
                            endReadable(this);
                        return null
                    }
                    var doRead = state.needReadable;
                    debug("need readable", doRead);
                    if (state.length === 0 || state.length - n < state.highWaterMark) {
                        doRead = true;
                        debug("length less than watermark", doRead)
                    }
                    if (state.ended || state.reading) {
                        doRead = false;
                        debug("reading or ended", doRead)
                    }
                    if (doRead) {
                        debug("do read");
                        state.reading = true;
                        state.sync = true;
                        if (state.length === 0)
                            state.needReadable = true;
                        this._read(state.highWaterMark);
                        state.sync = false
                    }
                    if (doRead && !state.reading)
                        n = howMuchToRead(nOrig, state);
                    var ret;
                    if (n > 0)
                        ret = fromList(n, state);
                    else
                        ret = null;
                    if (util.isNull(ret)) {
                        state.needReadable = true;
                        n = 0
                    }
                    state.length -= n;
                    if (state.length === 0 && !state.ended)
                        state.needReadable = true;
                    if (nOrig !== n && state.ended && state.length === 0)
                        endReadable(this);
                    if (!util.isNull(ret))
                        this.emit("data", ret);
                    return ret
                }
                ;
                function chunkInvalid(state, chunk) {
                    var er = null;
                    if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
                        er = new TypeError("Invalid non-string/buffer chunk")
                    }
                    return er
                }
                function onEofChunk(stream, state) {
                    if (state.decoder && !state.ended) {
                        var chunk = state.decoder.end();
                        if (chunk && chunk.length) {
                            state.buffer.push(chunk);
                            state.length += state.objectMode ? 1 : chunk.length
                        }
                    }
                    state.ended = true;
                    emitReadable(stream)
                }
                function emitReadable(stream) {
                    var state = stream._readableState;
                    state.needReadable = false;
                    if (!state.emittedReadable) {
                        debug("emitReadable", state.flowing);
                        state.emittedReadable = true;
                        if (state.sync)
                            process.nextTick(function() {
                                emitReadable_(stream)
                            });
                        else
                            emitReadable_(stream)
                    }
                }
                function emitReadable_(stream) {
                    debug("emit readable");
                    stream.emit("readable");
                    flow(stream)
                }
                function maybeReadMore(stream, state) {
                    if (!state.readingMore) {
                        state.readingMore = true;
                        process.nextTick(function() {
                            maybeReadMore_(stream, state)
                        })
                    }
                }
                function maybeReadMore_(stream, state) {
                    var len = state.length;
                    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
                        debug("maybeReadMore read 0");
                        stream.read(0);
                        if (len === state.length)
                            break;
                        else
                            len = state.length
                    }
                    state.readingMore = false
                }
                Readable.prototype._read = function(n) {
                    this.emit("error", new Error("not implemented"))
                }
                ;
                Readable.prototype.pipe = function(dest, pipeOpts) {
                    var src = this;
                    var state = this._readableState;
                    switch (state.pipesCount) {
                    case 0:
                        state.pipes = dest;
                        break;
                    case 1:
                        state.pipes = [state.pipes, dest];
                        break;
                    default:
                        state.pipes.push(dest);
                        break
                    }
                    state.pipesCount += 1;
                    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
                    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
                    var endFn = doEnd ? onend : cleanup;
                    if (state.endEmitted)
                        process.nextTick(endFn);
                    else
                        src.once("end", endFn);
                    dest.on("unpipe", onunpipe);
                    function onunpipe(readable) {
                        debug("onunpipe");
                        if (readable === src) {
                            cleanup()
                        }
                    }
                    function onend() {
                        debug("onend");
                        dest.end()
                    }
                    var ondrain = pipeOnDrain(src);
                    dest.on("drain", ondrain);
                    function cleanup() {
                        debug("cleanup");
                        dest.removeListener("close", onclose);
                        dest.removeListener("finish", onfinish);
                        dest.removeListener("drain", ondrain);
                        dest.removeListener("error", onerror);
                        dest.removeListener("unpipe", onunpipe);
                        src.removeListener("end", onend);
                        src.removeListener("end", cleanup);
                        src.removeListener("data", ondata);
                        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
                            ondrain()
                    }
                    src.on("data", ondata);
                    function ondata(chunk) {
                        debug("ondata");
                        var ret = dest.write(chunk);
                        if (false === ret) {
                            debug("false write response, pause", src._readableState.awaitDrain);
                            src._readableState.awaitDrain++;
                            src.pause()
                        }
                    }
                    function onerror(er) {
                        debug("onerror", er);
                        unpipe();
                        dest.removeListener("error", onerror);
                        if (EE.listenerCount(dest, "error") === 0)
                            dest.emit("error", er)
                    }
                    if (!dest._events || !dest._events.error)
                        dest.on("error", onerror);
                    else if (isArray(dest._events.error))
                        dest._events.error.unshift(onerror);
                    else
                        dest._events.error = [onerror, dest._events.error];
                    function onclose() {
                        dest.removeListener("finish", onfinish);
                        unpipe()
                    }
                    dest.once("close", onclose);
                    function onfinish() {
                        debug("onfinish");
                        dest.removeListener("close", onclose);
                        unpipe()
                    }
                    dest.once("finish", onfinish);
                    function unpipe() {
                        debug("unpipe");
                        src.unpipe(dest)
                    }
                    dest.emit("pipe", src);
                    if (!state.flowing) {
                        debug("pipe resume");
                        src.resume()
                    }
                    return dest
                }
                ;
                function pipeOnDrain(src) {
                    return function() {
                        var state = src._readableState;
                        debug("pipeOnDrain", state.awaitDrain);
                        if (state.awaitDrain)
                            state.awaitDrain--;
                        if (state.awaitDrain === 0 && EE.listenerCount(src, "data")) {
                            state.flowing = true;
                            flow(src)
                        }
                    }
                }
                Readable.prototype.unpipe = function(dest) {
                    var state = this._readableState;
                    if (state.pipesCount === 0)
                        return this;
                    if (state.pipesCount === 1) {
                        if (dest && dest !== state.pipes)
                            return this;
                        if (!dest)
                            dest = state.pipes;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        if (dest)
                            dest.emit("unpipe", this);
                        return this
                    }
                    if (!dest) {
                        var dests = state.pipes;
                        var len = state.pipesCount;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        for (var i = 0; i < len; i++)
                            dests[i].emit("unpipe", this);
                        return this
                    }
                    var i = indexOf(state.pipes, dest);
                    if (i === -1)
                        return this;
                    state.pipes.splice(i, 1);
                    state.pipesCount -= 1;
                    if (state.pipesCount === 1)
                        state.pipes = state.pipes[0];
                    dest.emit("unpipe", this);
                    return this
                }
                ;
                Readable.prototype.on = function(ev, fn) {
                    var res = Stream.prototype.on.call(this, ev, fn);
                    if (ev === "data" && false !== this._readableState.flowing) {
                        this.resume()
                    }
                    if (ev === "readable" && this.readable) {
                        var state = this._readableState;
                        if (!state.readableListening) {
                            state.readableListening = true;
                            state.emittedReadable = false;
                            state.needReadable = true;
                            if (!state.reading) {
                                var self = this;
                                process.nextTick(function() {
                                    debug("readable nexttick read 0");
                                    self.read(0)
                                })
                            } else if (state.length) {
                                emitReadable(this, state)
                            }
                        }
                    }
                    return res
                }
                ;
                Readable.prototype.addListener = Readable.prototype.on;
                Readable.prototype.resume = function() {
                    var state = this._readableState;
                    if (!state.flowing) {
                        debug("resume");
                        state.flowing = true;
                        if (!state.reading) {
                            debug("resume read 0");
                            this.read(0)
                        }
                        resume(this, state)
                    }
                    return this
                }
                ;
                function resume(stream, state) {
                    if (!state.resumeScheduled) {
                        state.resumeScheduled = true;
                        process.nextTick(function() {
                            resume_(stream, state)
                        })
                    }
                }
                function resume_(stream, state) {
                    state.resumeScheduled = false;
                    stream.emit("resume");
                    flow(stream);
                    if (state.flowing && !state.reading)
                        stream.read(0)
                }
                Readable.prototype.pause = function() {
                    debug("call pause flowing=%j", this._readableState.flowing);
                    if (false !== this._readableState.flowing) {
                        debug("pause");
                        this._readableState.flowing = false;
                        this.emit("pause")
                    }
                    return this
                }
                ;
                function flow(stream) {
                    var state = stream._readableState;
                    debug("flow", state.flowing);
                    if (state.flowing) {
                        do {
                            var chunk = stream.read()
                        } while (null !== chunk && state.flowing)
                    }
                }
                Readable.prototype.wrap = function(stream) {
                    var state = this._readableState;
                    var paused = false;
                    var self = this;
                    stream.on("end", function() {
                        debug("wrapped end");
                        if (state.decoder && !state.ended) {
                            var chunk = state.decoder.end();
                            if (chunk && chunk.length)
                                self.push(chunk)
                        }
                        self.push(null)
                    });
                    stream.on("data", function(chunk) {
                        debug("wrapped data");
                        if (state.decoder)
                            chunk = state.decoder.write(chunk);
                        if (!chunk || !state.objectMode && !chunk.length)
                            return;
                        var ret = self.push(chunk);
                        if (!ret) {
                            paused = true;
                            stream.pause()
                        }
                    });
                    for (var i in stream) {
                        if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
                            this[i] = function(method) {
                                return function() {
                                    return stream[method].apply(stream, arguments)
                                }
                            }(i)
                        }
                    }
                    var events = ["error", "close", "destroy", "pause", "resume"];
                    forEach(events, function(ev) {
                        stream.on(ev, self.emit.bind(self, ev))
                    });
                    self._read = function(n) {
                        debug("wrapped _read", n);
                        if (paused) {
                            paused = false;
                            stream.resume()
                        }
                    }
                    ;
                    return self
                }
                ;
                Readable._fromList = fromList;
                function fromList(n, state) {
                    var list = state.buffer;
                    var length = state.length;
                    var stringMode = !!state.decoder;
                    var objectMode = !!state.objectMode;
                    var ret;
                    if (list.length === 0)
                        return null;
                    if (length === 0)
                        ret = null;
                    else if (objectMode)
                        ret = list.shift();
                    else if (!n || n >= length) {
                        if (stringMode)
                            ret = list.join("");
                        else
                            ret = Buffer.concat(list, length);
                        list.length = 0
                    } else {
                        if (n < list[0].length) {
                            var buf = list[0];
                            ret = buf.slice(0, n);
                            list[0] = buf.slice(n)
                        } else if (n === list[0].length) {
                            ret = list.shift()
                        } else {
                            if (stringMode)
                                ret = "";
                            else
                                ret = new Buffer(n);
                            var c = 0;
                            for (var i = 0, l = list.length; i < l && c < n; i++) {
                                var buf = list[0];
                                var cpy = Math.min(n - c, buf.length);
                                if (stringMode)
                                    ret += buf.slice(0, cpy);
                                else
                                    buf.copy(ret, c, 0, cpy);
                                if (cpy < buf.length)
                                    list[0] = buf.slice(cpy);
                                else
                                    list.shift();
                                c += cpy
                            }
                        }
                    }
                    return ret
                }
                function endReadable(stream) {
                    var state = stream._readableState;
                    if (state.length > 0)
                        throw new Error("endReadable called on non-empty stream");
                    if (!state.endEmitted) {
                        state.ended = true;
                        process.nextTick(function() {
                            if (!state.endEmitted && state.length === 0) {
                                state.endEmitted = true;
                                stream.readable = false;
                                stream.emit("end")
                            }
                        })
                    }
                }
                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i)
                    }
                }
                function indexOf(xs, x) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        if (xs[i] === x)
                            return i
                    }
                    return -1
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./_stream_duplex": 19,
            _process: 73,
            buffer: 7,
            "core-util-is": 9,
            events: 14,
            inherits: 26,
            isarray: 29,
            stream: 82,
            "string_decoder/": 98,
            util: 4
        }],
        22: [function(require, module, exports) {
            module.exports = Transform;
            var Duplex = require("./_stream_duplex");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(Transform, Duplex);
            function TransformState(options, stream) {
                this.afterTransform = function(er, data) {
                    return afterTransform(stream, er, data)
                }
                ;
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null
            }
            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = false;
                var cb = ts.writecb;
                if (!cb)
                    return stream.emit("error", new Error("no writecb in Transform class"));
                ts.writechunk = null;
                ts.writecb = null;
                if (!util.isNullOrUndefined(data))
                    stream.push(data);
                if (cb)
                    cb(er);
                var rs = stream._readableState;
                rs.reading = false;
                if (rs.needReadable || rs.length < rs.highWaterMark) {
                    stream._read(rs.highWaterMark)
                }
            }
            function Transform(options) {
                if (!(this instanceof Transform))
                    return new Transform(options);
                Duplex.call(this, options);
                this._transformState = new TransformState(options,this);
                var stream = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                this.once("prefinish", function() {
                    if (util.isFunction(this._flush))
                        this._flush(function(er) {
                            done(stream, er)
                        });
                    else
                        done(stream)
                })
            }
            Transform.prototype.push = function(chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding)
            }
            ;
            Transform.prototype._transform = function(chunk, encoding, cb) {
                throw new Error("not implemented")
            }
            ;
            Transform.prototype._write = function(chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;
                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
                        this._read(rs.highWaterMark)
                }
            }
            ;
            Transform.prototype._read = function(n) {
                var ts = this._transformState;
                if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
                    ts.transforming = true;
                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
                } else {
                    ts.needTransform = true
                }
            }
            ;
            function done(stream, er) {
                if (er)
                    return stream.emit("error", er);
                var ws = stream._writableState;
                var ts = stream._transformState;
                if (ws.length)
                    throw new Error("calling transform done when ws.length != 0");
                if (ts.transforming)
                    throw new Error("calling transform done when still transforming");
                return stream.push(null)
            }
        }
        , {
            "./_stream_duplex": 19,
            "core-util-is": 9,
            inherits: 26
        }],
        23: [function(require, module, exports) {
            (function(process) {
                module.exports = Writable;
                var Buffer = require("buffer").Buffer;
                Writable.WritableState = WritableState;
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var Stream = require("stream");
                util.inherits(Writable, Stream);
                function WriteReq(chunk, encoding, cb) {
                    this.chunk = chunk;
                    this.encoding = encoding;
                    this.callback = cb
                }
                function WritableState(options, stream) {
                    var Duplex = require("./_stream_duplex");
                    options = options || {};
                    var hwm = options.highWaterMark;
                    var defaultHwm = options.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                    this.objectMode = !!options.objectMode;
                    if (stream instanceof Duplex)
                        this.objectMode = this.objectMode || !!options.writableObjectMode;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.needDrain = false;
                    this.ending = false;
                    this.ended = false;
                    this.finished = false;
                    var noDecode = options.decodeStrings === false;
                    this.decodeStrings = !noDecode;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.length = 0;
                    this.writing = false;
                    this.corked = 0;
                    this.sync = true;
                    this.bufferProcessing = false;
                    this.onwrite = function(er) {
                        onwrite(stream, er)
                    }
                    ;
                    this.writecb = null;
                    this.writelen = 0;
                    this.buffer = [];
                    this.pendingcb = 0;
                    this.prefinished = false;
                    this.errorEmitted = false
                }
                function Writable(options) {
                    var Duplex = require("./_stream_duplex");
                    if (!(this instanceof Writable) && !(this instanceof Duplex))
                        return new Writable(options);
                    this._writableState = new WritableState(options,this);
                    this.writable = true;
                    Stream.call(this)
                }
                Writable.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe. Not readable."))
                }
                ;
                function writeAfterEnd(stream, state, cb) {
                    var er = new Error("write after end");
                    stream.emit("error", er);
                    process.nextTick(function() {
                        cb(er)
                    })
                }
                function validChunk(stream, state, chunk, cb) {
                    var valid = true;
                    if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
                        var er = new TypeError("Invalid non-string/buffer chunk");
                        stream.emit("error", er);
                        process.nextTick(function() {
                            cb(er)
                        });
                        valid = false
                    }
                    return valid
                }
                Writable.prototype.write = function(chunk, encoding, cb) {
                    var state = this._writableState;
                    var ret = false;
                    if (util.isFunction(encoding)) {
                        cb = encoding;
                        encoding = null
                    }
                    if (util.isBuffer(chunk))
                        encoding = "buffer";
                    else if (!encoding)
                        encoding = state.defaultEncoding;
                    if (!util.isFunction(cb))
                        cb = function() {}
                        ;
                    if (state.ended)
                        writeAfterEnd(this, state, cb);
                    else if (validChunk(this, state, chunk, cb)) {
                        state.pendingcb++;
                        ret = writeOrBuffer(this, state, chunk, encoding, cb)
                    }
                    return ret
                }
                ;
                Writable.prototype.cork = function() {
                    var state = this._writableState;
                    state.corked++
                }
                ;
                Writable.prototype.uncork = function() {
                    var state = this._writableState;
                    if (state.corked) {
                        state.corked--;
                        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.buffer.length)
                            clearBuffer(this, state)
                    }
                }
                ;
                function decodeChunk(state, chunk, encoding) {
                    if (!state.objectMode && state.decodeStrings !== false && util.isString(chunk)) {
                        chunk = new Buffer(chunk,encoding)
                    }
                    return chunk
                }
                function writeOrBuffer(stream, state, chunk, encoding, cb) {
                    chunk = decodeChunk(state, chunk, encoding);
                    if (util.isBuffer(chunk))
                        encoding = "buffer";
                    var len = state.objectMode ? 1 : chunk.length;
                    state.length += len;
                    var ret = state.length < state.highWaterMark;
                    if (!ret)
                        state.needDrain = true;
                    if (state.writing || state.corked)
                        state.buffer.push(new WriteReq(chunk,encoding,cb));
                    else
                        doWrite(stream, state, false, len, chunk, encoding, cb);
                    return ret
                }
                function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                    state.writelen = len;
                    state.writecb = cb;
                    state.writing = true;
                    state.sync = true;
                    if (writev)
                        stream._writev(chunk, state.onwrite);
                    else
                        stream._write(chunk, encoding, state.onwrite);
                    state.sync = false
                }
                function onwriteError(stream, state, sync, er, cb) {
                    if (sync)
                        process.nextTick(function() {
                            state.pendingcb--;
                            cb(er)
                        });
                    else {
                        state.pendingcb--;
                        cb(er)
                    }
                    stream._writableState.errorEmitted = true;
                    stream.emit("error", er)
                }
                function onwriteStateUpdate(state) {
                    state.writing = false;
                    state.writecb = null;
                    state.length -= state.writelen;
                    state.writelen = 0
                }
                function onwrite(stream, er) {
                    var state = stream._writableState;
                    var sync = state.sync;
                    var cb = state.writecb;
                    onwriteStateUpdate(state);
                    if (er)
                        onwriteError(stream, state, sync, er, cb);
                    else {
                        var finished = needFinish(stream, state);
                        if (!finished && !state.corked && !state.bufferProcessing && state.buffer.length) {
                            clearBuffer(stream, state)
                        }
                        if (sync) {
                            process.nextTick(function() {
                                afterWrite(stream, state, finished, cb)
                            })
                        } else {
                            afterWrite(stream, state, finished, cb)
                        }
                    }
                }
                function afterWrite(stream, state, finished, cb) {
                    if (!finished)
                        onwriteDrain(stream, state);
                    state.pendingcb--;
                    cb();
                    finishMaybe(stream, state)
                }
                function onwriteDrain(stream, state) {
                    if (state.length === 0 && state.needDrain) {
                        state.needDrain = false;
                        stream.emit("drain")
                    }
                }
                function clearBuffer(stream, state) {
                    state.bufferProcessing = true;
                    if (stream._writev && state.buffer.length > 1) {
                        var cbs = [];
                        for (var c = 0; c < state.buffer.length; c++)
                            cbs.push(state.buffer[c].callback);
                        state.pendingcb++;
                        doWrite(stream, state, true, state.length, state.buffer, "", function(err) {
                            for (var i = 0; i < cbs.length; i++) {
                                state.pendingcb--;
                                cbs[i](err)
                            }
                        });
                        state.buffer = []
                    } else {
                        for (var c = 0; c < state.buffer.length; c++) {
                            var entry = state.buffer[c];
                            var chunk = entry.chunk;
                            var encoding = entry.encoding;
                            var cb = entry.callback;
                            var len = state.objectMode ? 1 : chunk.length;
                            doWrite(stream, state, false, len, chunk, encoding, cb);
                            if (state.writing) {
                                c++;
                                break
                            }
                        }
                        if (c < state.buffer.length)
                            state.buffer = state.buffer.slice(c);
                        else
                            state.buffer.length = 0
                    }
                    state.bufferProcessing = false
                }
                Writable.prototype._write = function(chunk, encoding, cb) {
                    cb(new Error("not implemented"))
                }
                ;
                Writable.prototype._writev = null;
                Writable.prototype.end = function(chunk, encoding, cb) {
                    var state = this._writableState;
                    if (util.isFunction(chunk)) {
                        cb = chunk;
                        chunk = null;
                        encoding = null
                    } else if (util.isFunction(encoding)) {
                        cb = encoding;
                        encoding = null
                    }
                    if (!util.isNullOrUndefined(chunk))
                        this.write(chunk, encoding);
                    if (state.corked) {
                        state.corked = 1;
                        this.uncork()
                    }
                    if (!state.ending && !state.finished)
                        endWritable(this, state, cb)
                }
                ;
                function needFinish(stream, state) {
                    return state.ending && state.length === 0 && !state.finished && !state.writing
                }
                function prefinish(stream, state) {
                    if (!state.prefinished) {
                        state.prefinished = true;
                        stream.emit("prefinish")
                    }
                }
                function finishMaybe(stream, state) {
                    var need = needFinish(stream, state);
                    if (need) {
                        if (state.pendingcb === 0) {
                            prefinish(stream, state);
                            state.finished = true;
                            stream.emit("finish")
                        } else
                            prefinish(stream, state)
                    }
                    return need
                }
                function endWritable(stream, state, cb) {
                    state.ending = true;
                    finishMaybe(stream, state);
                    if (cb) {
                        if (state.finished)
                            process.nextTick(cb);
                        else
                            stream.once("finish", cb)
                    }
                    state.ended = true
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./_stream_duplex": 19,
            _process: 73,
            buffer: 7,
            "core-util-is": 9,
            inherits: 26,
            stream: 82
        }],
        24: [function(require, module, exports) {
            (function(process) {
                exports = module.exports = require("./lib/_stream_readable.js");
                exports.Stream = require("stream");
                exports.Readable = exports;
                exports.Writable = require("./lib/_stream_writable.js");
                exports.Duplex = require("./lib/_stream_duplex.js");
                exports.Transform = require("./lib/_stream_transform.js");
                exports.PassThrough = require("./lib/_stream_passthrough.js");
                if (!process.browser && process.env.READABLE_STREAM === "disable") {
                    module.exports = require("stream")
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./lib/_stream_duplex.js": 19,
            "./lib/_stream_passthrough.js": 20,
            "./lib/_stream_readable.js": 21,
            "./lib/_stream_transform.js": 22,
            "./lib/_stream_writable.js": 23,
            _process: 73,
            stream: 82
        }],
        25: [function(require, module, exports) {
            exports.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var nBits = -7;
                var i = isLE ? nBytes - 1 : 0;
                var d = isLE ? -1 : 1;
                var s = buffer[offset + i];
                i += d;
                e = s & (1 << -nBits) - 1;
                s >>= -nBits;
                nBits += eLen;
                for (; nBits > 0; e = e * 256 + buffer[offset + i],
                i += d,
                nBits -= 8) {}
                m = e & (1 << -nBits) - 1;
                e >>= -nBits;
                nBits += mLen;
                for (; nBits > 0; m = m * 256 + buffer[offset + i],
                i += d,
                nBits -= 8) {}
                if (e === 0) {
                    e = 1 - eBias
                } else if (e === eMax) {
                    return m ? NaN : (s ? -1 : 1) * Infinity
                } else {
                    m = m + Math.pow(2, mLen);
                    e = e - eBias
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            }
            ;
            exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var i = isLE ? 0 : nBytes - 1;
                var d = isLE ? 1 : -1;
                var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
                value = Math.abs(value);
                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2
                    }
                    if (e + eBias >= 1) {
                        value += rt / c
                    } else {
                        value += rt * Math.pow(2, 1 - eBias)
                    }
                    if (value * c >= 2) {
                        e++;
                        c /= 2
                    }
                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen);
                        e = e + eBias
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                        e = 0
                    }
                }
                for (; mLen >= 8; buffer[offset + i] = m & 255,
                i += d,
                m /= 256,
                mLen -= 8) {}
                e = e << mLen | m;
                eLen += mLen;
                for (; eLen > 0; buffer[offset + i] = e & 255,
                i += d,
                e /= 256,
                eLen -= 8) {}
                buffer[offset + i - d] |= s * 128
            }
        }
        , {}],
        26: [function(require, module, exports) {
            if (typeof Object.create === "function") {
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    })
                }
            } else {
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function() {};
                    TempCtor.prototype = superCtor.prototype;
                    ctor.prototype = new TempCtor;
                    ctor.prototype.constructor = ctor
                }
            }
        }
        , {}],
        27: [function(require, module, exports) {
            "use strict";
            function iota(n) {
                var result = new Array(n);
                for (var i = 0; i < n; ++i) {
                    result[i] = i
                }
                return result
            }
            module.exports = iota
        }
        , {}],
        28: [function(require, module, exports) {
            module.exports = function(obj) {
                return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
            }
            ;
            function isBuffer(obj) {
                return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj)
            }
            function isSlowBuffer(obj) {
                return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0))
            }
        }
        , {}],
        29: [function(require, module, exports) {
            module.exports = Array.isArray || function(arr) {
                return Object.prototype.toString.call(arr) == "[object Array]"
            }
        }
        , {}],
        30: [function(require, module, exports) {
            var encode = require("./lib/encoder")
              , decode = require("./lib/decoder");
            module.exports = {
                encode: encode,
                decode: decode
            }
        }
        , {
            "./lib/decoder": 31,
            "./lib/encoder": 32
        }],
        31: [function(require, module, exports) {
            (function(Buffer) {
                var JpegImage = function jpegImage() {
                    "use strict";
                    var dctZigZag = new Int32Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
                    var dctCos1 = 4017;
                    var dctSin1 = 799;
                    var dctCos3 = 3406;
                    var dctSin3 = 2276;
                    var dctCos6 = 1567;
                    var dctSin6 = 3784;
                    var dctSqrt2 = 5793;
                    var dctSqrt1d2 = 2896;
                    function constructor() {}
                    function buildHuffmanTable(codeLengths, values) {
                        var k = 0, code = [], i, j, length = 16;
                        while (length > 0 && !codeLengths[length - 1])
                            length--;
                        code.push({
                            children: [],
                            index: 0
                        });
                        var p = code[0], q;
                        for (i = 0; i < length; i++) {
                            for (j = 0; j < codeLengths[i]; j++) {
                                p = code.pop();
                                p.children[p.index] = values[k];
                                while (p.index > 0) {
                                    p = code.pop()
                                }
                                p.index++;
                                code.push(p);
                                while (code.length <= i) {
                                    code.push(q = {
                                        children: [],
                                        index: 0
                                    });
                                    p.children[p.index] = q.children;
                                    p = q
                                }
                                k++
                            }
                            if (i + 1 < length) {
                                code.push(q = {
                                    children: [],
                                    index: 0
                                });
                                p.children[p.index] = q.children;
                                p = q
                            }
                        }
                        return code[0].children
                    }
                    function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
                        var precision = frame.precision;
                        var samplesPerLine = frame.samplesPerLine;
                        var scanLines = frame.scanLines;
                        var mcusPerLine = frame.mcusPerLine;
                        var progressive = frame.progressive;
                        var maxH = frame.maxH
                          , maxV = frame.maxV;
                        var startOffset = offset
                          , bitsData = 0
                          , bitsCount = 0;
                        function readBit() {
                            if (bitsCount > 0) {
                                bitsCount--;
                                return bitsData >> bitsCount & 1
                            }
                            bitsData = data[offset++];
                            if (bitsData == 255) {
                                var nextByte = data[offset++];
                                if (nextByte) {
                                    throw new Error("unexpected marker: " + (bitsData << 8 | nextByte).toString(16))
                                }
                            }
                            bitsCount = 7;
                            return bitsData >>> 7
                        }
                        function decodeHuffman(tree) {
                            var node = tree, bit;
                            while ((bit = readBit()) !== null) {
                                node = node[bit];
                                if (typeof node === "number")
                                    return node;
                                if (typeof node !== "object")
                                    throw new Error("invalid huffman sequence")
                            }
                            return null
                        }
                        function receive(length) {
                            var n = 0;
                            while (length > 0) {
                                var bit = readBit();
                                if (bit === null)
                                    return;
                                n = n << 1 | bit;
                                length--
                            }
                            return n
                        }
                        function receiveAndExtend(length) {
                            var n = receive(length);
                            if (n >= 1 << length - 1)
                                return n;
                            return n + (-1 << length) + 1
                        }
                        function decodeBaseline(component, zz) {
                            var t = decodeHuffman(component.huffmanTableDC);
                            var diff = t === 0 ? 0 : receiveAndExtend(t);
                            zz[0] = component.pred += diff;
                            var k = 1;
                            while (k < 64) {
                                var rs = decodeHuffman(component.huffmanTableAC);
                                var s = rs & 15
                                  , r = rs >> 4;
                                if (s === 0) {
                                    if (r < 15)
                                        break;
                                    k += 16;
                                    continue
                                }
                                k += r;
                                var z = dctZigZag[k];
                                zz[z] = receiveAndExtend(s);
                                k++
                            }
                        }
                        function decodeDCFirst(component, zz) {
                            var t = decodeHuffman(component.huffmanTableDC);
                            var diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
                            zz[0] = component.pred += diff
                        }
                        function decodeDCSuccessive(component, zz) {
                            zz[0] |= readBit() << successive
                        }
                        var eobrun = 0;
                        function decodeACFirst(component, zz) {
                            if (eobrun > 0) {
                                eobrun--;
                                return
                            }
                            var k = spectralStart
                              , e = spectralEnd;
                            while (k <= e) {
                                var rs = decodeHuffman(component.huffmanTableAC);
                                var s = rs & 15
                                  , r = rs >> 4;
                                if (s === 0) {
                                    if (r < 15) {
                                        eobrun = receive(r) + (1 << r) - 1;
                                        break
                                    }
                                    k += 16;
                                    continue
                                }
                                k += r;
                                var z = dctZigZag[k];
                                zz[z] = receiveAndExtend(s) * (1 << successive);
                                k++
                            }
                        }
                        var successiveACState = 0, successiveACNextValue;
                        function decodeACSuccessive(component, zz) {
                            var k = spectralStart
                              , e = spectralEnd
                              , r = 0;
                            while (k <= e) {
                                var z = dctZigZag[k];
                                var direction = zz[z] < 0 ? -1 : 1;
                                switch (successiveACState) {
                                case 0:
                                    var rs = decodeHuffman(component.huffmanTableAC);
                                    var s = rs & 15
                                      , r = rs >> 4;
                                    if (s === 0) {
                                        if (r < 15) {
                                            eobrun = receive(r) + (1 << r);
                                            successiveACState = 4
                                        } else {
                                            r = 16;
                                            successiveACState = 1
                                        }
                                    } else {
                                        if (s !== 1)
                                            throw new Error("invalid ACn encoding");
                                        successiveACNextValue = receiveAndExtend(s);
                                        successiveACState = r ? 2 : 3
                                    }
                                    continue;
                                case 1:
                                case 2:
                                    if (zz[z])
                                        zz[z] += (readBit() << successive) * direction;
                                    else {
                                        r--;
                                        if (r === 0)
                                            successiveACState = successiveACState == 2 ? 3 : 0
                                    }
                                    break;
                                case 3:
                                    if (zz[z])
                                        zz[z] += (readBit() << successive) * direction;
                                    else {
                                        zz[z] = successiveACNextValue << successive;
                                        successiveACState = 0
                                    }
                                    break;
                                case 4:
                                    if (zz[z])
                                        zz[z] += (readBit() << successive) * direction;
                                    break
                                }
                                k++
                            }
                            if (successiveACState === 4) {
                                eobrun--;
                                if (eobrun === 0)
                                    successiveACState = 0
                            }
                        }
                        function decodeMcu(component, decode, mcu, row, col) {
                            var mcuRow = mcu / mcusPerLine | 0;
                            var mcuCol = mcu % mcusPerLine;
                            var blockRow = mcuRow * component.v + row;
                            var blockCol = mcuCol * component.h + col;
                            decode(component, component.blocks[blockRow][blockCol])
                        }
                        function decodeBlock(component, decode, mcu) {
                            var blockRow = mcu / component.blocksPerLine | 0;
                            var blockCol = mcu % component.blocksPerLine;
                            decode(component, component.blocks[blockRow][blockCol])
                        }
                        var componentsLength = components.length;
                        var component, i, j, k, n;
                        var decodeFn;
                        if (progressive) {
                            if (spectralStart === 0)
                                decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
                            else
                                decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive
                        } else {
                            decodeFn = decodeBaseline
                        }
                        var mcu = 0, marker;
                        var mcuExpected;
                        if (componentsLength == 1) {
                            mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn
                        } else {
                            mcuExpected = mcusPerLine * frame.mcusPerColumn
                        }
                        if (!resetInterval)
                            resetInterval = mcuExpected;
                        var h, v;
                        while (mcu < mcuExpected) {
                            for (i = 0; i < componentsLength; i++)
                                components[i].pred = 0;
                            eobrun = 0;
                            if (componentsLength == 1) {
                                component = components[0];
                                for (n = 0; n < resetInterval; n++) {
                                    decodeBlock(component, decodeFn, mcu);
                                    mcu++
                                }
                            } else {
                                for (n = 0; n < resetInterval; n++) {
                                    for (i = 0; i < componentsLength; i++) {
                                        component = components[i];
                                        h = component.h;
                                        v = component.v;
                                        for (j = 0; j < v; j++) {
                                            for (k = 0; k < h; k++) {
                                                decodeMcu(component, decodeFn, mcu, j, k)
                                            }
                                        }
                                    }
                                    mcu++;
                                    if (mcu === mcuExpected)
                                        break
                                }
                            }
                            bitsCount = 0;
                            marker = data[offset] << 8 | data[offset + 1];
                            if (marker < 65280) {
                                throw new Error("marker was not found")
                            }
                            if (marker >= 65488 && marker <= 65495) {
                                offset += 2
                            } else
                                break
                        }
                        return offset - startOffset
                    }
                    function buildComponentData(frame, component) {
                        var lines = [];
                        var blocksPerLine = component.blocksPerLine;
                        var blocksPerColumn = component.blocksPerColumn;
                        var samplesPerLine = blocksPerLine << 3;
                        var R = new Int32Array(64)
                          , r = new Uint8Array(64);
                        function quantizeAndInverse(zz, dataOut, dataIn) {
                            var qt = component.quantizationTable;
                            var v0, v1, v2, v3, v4, v5, v6, v7, t;
                            var p = dataIn;
                            var i;
                            for (i = 0; i < 64; i++)
                                p[i] = zz[i] * qt[i];
                            for (i = 0; i < 8; ++i) {
                                var row = 8 * i;
                                if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 && p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 && p[7 + row] == 0) {
                                    t = dctSqrt2 * p[0 + row] + 512 >> 10;
                                    p[0 + row] = t;
                                    p[1 + row] = t;
                                    p[2 + row] = t;
                                    p[3 + row] = t;
                                    p[4 + row] = t;
                                    p[5 + row] = t;
                                    p[6 + row] = t;
                                    p[7 + row] = t;
                                    continue
                                }
                                v0 = dctSqrt2 * p[0 + row] + 128 >> 8;
                                v1 = dctSqrt2 * p[4 + row] + 128 >> 8;
                                v2 = p[2 + row];
                                v3 = p[6 + row];
                                v4 = dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128 >> 8;
                                v7 = dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128 >> 8;
                                v5 = p[3 + row] << 4;
                                v6 = p[5 + row] << 4;
                                t = v0 - v1 + 1 >> 1;
                                v0 = v0 + v1 + 1 >> 1;
                                v1 = t;
                                t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
                                v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
                                v3 = t;
                                t = v4 - v6 + 1 >> 1;
                                v4 = v4 + v6 + 1 >> 1;
                                v6 = t;
                                t = v7 + v5 + 1 >> 1;
                                v5 = v7 - v5 + 1 >> 1;
                                v7 = t;
                                t = v0 - v3 + 1 >> 1;
                                v0 = v0 + v3 + 1 >> 1;
                                v3 = t;
                                t = v1 - v2 + 1 >> 1;
                                v1 = v1 + v2 + 1 >> 1;
                                v2 = t;
                                t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
                                v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
                                v7 = t;
                                t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
                                v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
                                v6 = t;
                                p[0 + row] = v0 + v7;
                                p[7 + row] = v0 - v7;
                                p[1 + row] = v1 + v6;
                                p[6 + row] = v1 - v6;
                                p[2 + row] = v2 + v5;
                                p[5 + row] = v2 - v5;
                                p[3 + row] = v3 + v4;
                                p[4 + row] = v3 - v4
                            }
                            for (i = 0; i < 8; ++i) {
                                var col = i;
                                if (p[1 * 8 + col] == 0 && p[2 * 8 + col] == 0 && p[3 * 8 + col] == 0 && p[4 * 8 + col] == 0 && p[5 * 8 + col] == 0 && p[6 * 8 + col] == 0 && p[7 * 8 + col] == 0) {
                                    t = dctSqrt2 * dataIn[i + 0] + 8192 >> 14;
                                    p[0 * 8 + col] = t;
                                    p[1 * 8 + col] = t;
                                    p[2 * 8 + col] = t;
                                    p[3 * 8 + col] = t;
                                    p[4 * 8 + col] = t;
                                    p[5 * 8 + col] = t;
                                    p[6 * 8 + col] = t;
                                    p[7 * 8 + col] = t;
                                    continue
                                }
                                v0 = dctSqrt2 * p[0 * 8 + col] + 2048 >> 12;
                                v1 = dctSqrt2 * p[4 * 8 + col] + 2048 >> 12;
                                v2 = p[2 * 8 + col];
                                v3 = p[6 * 8 + col];
                                v4 = dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048 >> 12;
                                v7 = dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048 >> 12;
                                v5 = p[3 * 8 + col];
                                v6 = p[5 * 8 + col];
                                t = v0 - v1 + 1 >> 1;
                                v0 = v0 + v1 + 1 >> 1;
                                v1 = t;
                                t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
                                v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
                                v3 = t;
                                t = v4 - v6 + 1 >> 1;
                                v4 = v4 + v6 + 1 >> 1;
                                v6 = t;
                                t = v7 + v5 + 1 >> 1;
                                v5 = v7 - v5 + 1 >> 1;
                                v7 = t;
                                t = v0 - v3 + 1 >> 1;
                                v0 = v0 + v3 + 1 >> 1;
                                v3 = t;
                                t = v1 - v2 + 1 >> 1;
                                v1 = v1 + v2 + 1 >> 1;
                                v2 = t;
                                t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
                                v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
                                v7 = t;
                                t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
                                v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
                                v6 = t;
                                p[0 * 8 + col] = v0 + v7;
                                p[7 * 8 + col] = v0 - v7;
                                p[1 * 8 + col] = v1 + v6;
                                p[6 * 8 + col] = v1 - v6;
                                p[2 * 8 + col] = v2 + v5;
                                p[5 * 8 + col] = v2 - v5;
                                p[3 * 8 + col] = v3 + v4;
                                p[4 * 8 + col] = v3 - v4
                            }
                            for (i = 0; i < 64; ++i) {
                                var sample = 128 + (p[i] + 8 >> 4);
                                dataOut[i] = sample < 0 ? 0 : sample > 255 ? 255 : sample
                            }
                        }
                        var i, j;
                        for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
                            var scanLine = blockRow << 3;
                            for (i = 0; i < 8; i++)
                                lines.push(new Uint8Array(samplesPerLine));
                            for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
                                quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);
                                var offset = 0
                                  , sample = blockCol << 3;
                                for (j = 0; j < 8; j++) {
                                    var line = lines[scanLine + j];
                                    for (i = 0; i < 8; i++)
                                        line[sample + i] = r[offset++]
                                }
                            }
                        }
                        return lines
                    }
                    function clampTo8bit(a) {
                        return a < 0 ? 0 : a > 255 ? 255 : a
                    }
                    constructor.prototype = {
                        load: function load(path) {
                            var xhr = new XMLHttpRequest;
                            xhr.open("GET", path, true);
                            xhr.responseType = "arraybuffer";
                            xhr.onload = function() {
                                var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
                                this.parse(data);
                                if (this.onload)
                                    this.onload()
                            }
                            .bind(this);
                            xhr.send(null)
                        },
                        parse: function parse(data) {
                            var offset = 0
                              , length = data.length;
                            function readUint16() {
                                var value = data[offset] << 8 | data[offset + 1];
                                offset += 2;
                                return value
                            }
                            function readDataBlock() {
                                var length = readUint16();
                                var array = data.subarray(offset, offset + length - 2);
                                offset += array.length;
                                return array
                            }
                            function prepareComponents(frame) {
                                var maxH = 0
                                  , maxV = 0;
                                var component, componentId;
                                for (componentId in frame.components) {
                                    if (frame.components.hasOwnProperty(componentId)) {
                                        component = frame.components[componentId];
                                        if (maxH < component.h)
                                            maxH = component.h;
                                        if (maxV < component.v)
                                            maxV = component.v
                                    }
                                }
                                var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
                                var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
                                for (componentId in frame.components) {
                                    if (frame.components.hasOwnProperty(componentId)) {
                                        component = frame.components[componentId];
                                        var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
                                        var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
                                        var blocksPerLineForMcu = mcusPerLine * component.h;
                                        var blocksPerColumnForMcu = mcusPerColumn * component.v;
                                        var blocks = [];
                                        for (var i = 0; i < blocksPerColumnForMcu; i++) {
                                            var row = [];
                                            for (var j = 0; j < blocksPerLineForMcu; j++)
                                                row.push(new Int32Array(64));
                                            blocks.push(row)
                                        }
                                        component.blocksPerLine = blocksPerLine;
                                        component.blocksPerColumn = blocksPerColumn;
                                        component.blocks = blocks
                                    }
                                }
                                frame.maxH = maxH;
                                frame.maxV = maxV;
                                frame.mcusPerLine = mcusPerLine;
                                frame.mcusPerColumn = mcusPerColumn
                            }
                            var jfif = null;
                            var adobe = null;
                            var pixels = null;
                            var frame, resetInterval;
                            var quantizationTables = []
                              , frames = [];
                            var huffmanTablesAC = []
                              , huffmanTablesDC = [];
                            var fileMarker = readUint16();
                            if (fileMarker != 65496) {
                                throw new Error("SOI not found")
                            }
                            fileMarker = readUint16();
                            while (fileMarker != 65497) {
                                var i, j, l;
                                switch (fileMarker) {
                                case 65280:
                                    break;
                                case 65504:
                                case 65505:
                                case 65506:
                                case 65507:
                                case 65508:
                                case 65509:
                                case 65510:
                                case 65511:
                                case 65512:
                                case 65513:
                                case 65514:
                                case 65515:
                                case 65516:
                                case 65517:
                                case 65518:
                                case 65519:
                                case 65534:
                                    var appData = readDataBlock();
                                    if (fileMarker === 65504) {
                                        if (appData[0] === 74 && appData[1] === 70 && appData[2] === 73 && appData[3] === 70 && appData[4] === 0) {
                                            jfif = {
                                                version: {
                                                    major: appData[5],
                                                    minor: appData[6]
                                                },
                                                densityUnits: appData[7],
                                                xDensity: appData[8] << 8 | appData[9],
                                                yDensity: appData[10] << 8 | appData[11],
                                                thumbWidth: appData[12],
                                                thumbHeight: appData[13],
                                                thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                                            }
                                        }
                                    }
                                    if (fileMarker === 65518) {
                                        if (appData[0] === 65 && appData[1] === 100 && appData[2] === 111 && appData[3] === 98 && appData[4] === 101 && appData[5] === 0) {
                                            adobe = {
                                                version: appData[6],
                                                flags0: appData[7] << 8 | appData[8],
                                                flags1: appData[9] << 8 | appData[10],
                                                transformCode: appData[11]
                                            }
                                        }
                                    }
                                    break;
                                case 65499:
                                    var quantizationTablesLength = readUint16();
                                    var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                                    while (offset < quantizationTablesEnd) {
                                        var quantizationTableSpec = data[offset++];
                                        var tableData = new Int32Array(64);
                                        if (quantizationTableSpec >> 4 === 0) {
                                            for (j = 0; j < 64; j++) {
                                                var z = dctZigZag[j];
                                                tableData[z] = data[offset++]
                                            }
                                        } else if (quantizationTableSpec >> 4 === 1) {
                                            for (j = 0; j < 64; j++) {
                                                var z = dctZigZag[j];
                                                tableData[z] = readUint16()
                                            }
                                        } else
                                            throw new Error("DQT: invalid table spec");
                                        quantizationTables[quantizationTableSpec & 15] = tableData
                                    }
                                    break;
                                case 65472:
                                case 65473:
                                case 65474:
                                    readUint16();
                                    frame = {};
                                    frame.extended = fileMarker === 65473;
                                    frame.progressive = fileMarker === 65474;
                                    frame.precision = data[offset++];
                                    frame.scanLines = readUint16();
                                    frame.samplesPerLine = readUint16();
                                    frame.components = {};
                                    frame.componentsOrder = [];
                                    var componentsCount = data[offset++], componentId;
                                    var maxH = 0
                                      , maxV = 0;
                                    for (i = 0; i < componentsCount; i++) {
                                        componentId = data[offset];
                                        var h = data[offset + 1] >> 4;
                                        var v = data[offset + 1] & 15;
                                        var qId = data[offset + 2];
                                        frame.componentsOrder.push(componentId);
                                        frame.components[componentId] = {
                                            h: h,
                                            v: v,
                                            quantizationIdx: qId
                                        };
                                        offset += 3
                                    }
                                    prepareComponents(frame);
                                    frames.push(frame);
                                    break;
                                case 65476:
                                    var huffmanLength = readUint16();
                                    for (i = 2; i < huffmanLength; ) {
                                        var huffmanTableSpec = data[offset++];
                                        var codeLengths = new Uint8Array(16);
                                        var codeLengthSum = 0;
                                        for (j = 0; j < 16; j++,
                                        offset++)
                                            codeLengthSum += codeLengths[j] = data[offset];
                                        var huffmanValues = new Uint8Array(codeLengthSum);
                                        for (j = 0; j < codeLengthSum; j++,
                                        offset++)
                                            huffmanValues[j] = data[offset];
                                        i += 17 + codeLengthSum;
                                        (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues)
                                    }
                                    break;
                                case 65501:
                                    readUint16();
                                    resetInterval = readUint16();
                                    break;
                                case 65498:
                                    var scanLength = readUint16();
                                    var selectorsCount = data[offset++];
                                    var components = [], component;
                                    for (i = 0; i < selectorsCount; i++) {
                                        component = frame.components[data[offset++]];
                                        var tableSpec = data[offset++];
                                        component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                                        component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                                        components.push(component)
                                    }
                                    var spectralStart = data[offset++];
                                    var spectralEnd = data[offset++];
                                    var successiveApproximation = data[offset++];
                                    var processed = decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15);
                                    offset += processed;
                                    break;
                                default:
                                    if (data[offset - 3] == 255 && data[offset - 2] >= 192 && data[offset - 2] <= 254) {
                                        offset -= 3;
                                        break
                                    }
                                    throw new Error("unknown JPEG marker " + fileMarker.toString(16))
                                }
                                fileMarker = readUint16()
                            }
                            if (frames.length != 1)
                                throw new Error("only single frame JPEGs supported");
                            for (var i = 0; i < frames.length; i++) {
                                var cp = frames[i].components;
                                for (var j in cp) {
                                    cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
                                    delete cp[j].quantizationIdx
                                }
                            }
                            this.width = frame.samplesPerLine;
                            this.height = frame.scanLines;
                            this.jfif = jfif;
                            this.adobe = adobe;
                            this.components = [];
                            for (var i = 0; i < frame.componentsOrder.length; i++) {
                                var component = frame.components[frame.componentsOrder[i]];
                                this.components.push({
                                    lines: buildComponentData(frame, component),
                                    scaleX: component.h / frame.maxH,
                                    scaleY: component.v / frame.maxV
                                })
                            }
                        },
                        getData: function getData(width, height) {
                            var scaleX = this.width / width
                              , scaleY = this.height / height;
                            var component1, component2, component3, component4;
                            var component1Line, component2Line, component3Line, component4Line;
                            var x, y;
                            var offset = 0;
                            var Y, Cb, Cr, K, C, M, Ye, R, G, B;
                            var colorTransform;
                            var dataLength = width * height * this.components.length;
                            var data = new Uint8Array(dataLength);
                            switch (this.components.length) {
                            case 1:
                                component1 = this.components[0];
                                for (y = 0; y < height; y++) {
                                    component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
                                    for (x = 0; x < width; x++) {
                                        Y = component1Line[0 | x * component1.scaleX * scaleX];
                                        data[offset++] = Y
                                    }
                                }
                                break;
                            case 2:
                                component1 = this.components[0];
                                component2 = this.components[1];
                                for (y = 0; y < height; y++) {
                                    component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
                                    component2Line = component2.lines[0 | y * component2.scaleY * scaleY];
                                    for (x = 0; x < width; x++) {
                                        Y = component1Line[0 | x * component1.scaleX * scaleX];
                                        data[offset++] = Y;
                                        Y = component2Line[0 | x * component2.scaleX * scaleX];
                                        data[offset++] = Y
                                    }
                                }
                                break;
                            case 3:
                                colorTransform = true;
                                if (this.adobe && this.adobe.transformCode)
                                    colorTransform = true;
                                else if (typeof this.colorTransform !== "undefined")
                                    colorTransform = !!this.colorTransform;
                                component1 = this.components[0];
                                component2 = this.components[1];
                                component3 = this.components[2];
                                for (y = 0; y < height; y++) {
                                    component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
                                    component2Line = component2.lines[0 | y * component2.scaleY * scaleY];
                                    component3Line = component3.lines[0 | y * component3.scaleY * scaleY];
                                    for (x = 0; x < width; x++) {
                                        if (!colorTransform) {
                                            R = component1Line[0 | x * component1.scaleX * scaleX];
                                            G = component2Line[0 | x * component2.scaleX * scaleX];
                                            B = component3Line[0 | x * component3.scaleX * scaleX]
                                        } else {
                                            Y = component1Line[0 | x * component1.scaleX * scaleX];
                                            Cb = component2Line[0 | x * component2.scaleX * scaleX];
                                            Cr = component3Line[0 | x * component3.scaleX * scaleX];
                                            R = clampTo8bit(Y + 1.402 * (Cr - 128));
                                            G = clampTo8bit(Y - .3441363 * (Cb - 128) - .71413636 * (Cr - 128));
                                            B = clampTo8bit(Y + 1.772 * (Cb - 128))
                                        }
                                        data[offset++] = R;
                                        data[offset++] = G;
                                        data[offset++] = B
                                    }
                                }
                                break;
                            case 4:
                                if (!this.adobe)
                                    throw "Unsupported color mode (4 components)";
                                colorTransform = false;
                                if (this.adobe && this.adobe.transformCode)
                                    colorTransform = true;
                                else if (typeof this.colorTransform !== "undefined")
                                    colorTransform = !!this.colorTransform;
                                component1 = this.components[0];
                                component2 = this.components[1];
                                component3 = this.components[2];
                                component4 = this.components[3];
                                for (y = 0; y < height; y++) {
                                    component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
                                    component2Line = component2.lines[0 | y * component2.scaleY * scaleY];
                                    component3Line = component3.lines[0 | y * component3.scaleY * scaleY];
                                    component4Line = component4.lines[0 | y * component4.scaleY * scaleY];
                                    for (x = 0; x < width; x++) {
                                        if (!colorTransform) {
                                            C = component1Line[0 | x * component1.scaleX * scaleX];
                                            M = component2Line[0 | x * component2.scaleX * scaleX];
                                            Ye = component3Line[0 | x * component3.scaleX * scaleX];
                                            K = component4Line[0 | x * component4.scaleX * scaleX]
                                        } else {
                                            Y = component1Line[0 | x * component1.scaleX * scaleX];
                                            Cb = component2Line[0 | x * component2.scaleX * scaleX];
                                            Cr = component3Line[0 | x * component3.scaleX * scaleX];
                                            K = component4Line[0 | x * component4.scaleX * scaleX];
                                            C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                                            M = 255 - clampTo8bit(Y - .3441363 * (Cb - 128) - .71413636 * (Cr - 128));
                                            Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128))
                                        }
                                        data[offset++] = 255 - C;
                                        data[offset++] = 255 - M;
                                        data[offset++] = 255 - Ye;
                                        data[offset++] = 255 - K
                                    }
                                }
                                break;
                            default:
                                throw "Unsupported color mode"
                            }
                            return data
                        },
                        copyToImageData: function copyToImageData(imageData) {
                            var width = imageData.width
                              , height = imageData.height;
                            var imageDataArray = imageData.data;
                            var data = this.getData(width, height);
                            var i = 0, j = 0, x, y;
                            var Y, K, C, M, R, G, B;
                            switch (this.components.length) {
                            case 1:
                                for (y = 0; y < height; y++) {
                                    for (x = 0; x < width; x++) {
                                        Y = data[i++];
                                        imageDataArray[j++] = Y;
                                        imageDataArray[j++] = Y;
                                        imageDataArray[j++] = Y;
                                        imageDataArray[j++] = 255
                                    }
                                }
                                break;
                            case 3:
                                for (y = 0; y < height; y++) {
                                    for (x = 0; x < width; x++) {
                                        R = data[i++];
                                        G = data[i++];
                                        B = data[i++];
                                        imageDataArray[j++] = R;
                                        imageDataArray[j++] = G;
                                        imageDataArray[j++] = B;
                                        imageDataArray[j++] = 255
                                    }
                                }
                                break;
                            case 4:
                                for (y = 0; y < height; y++) {
                                    for (x = 0; x < width; x++) {
                                        C = data[i++];
                                        M = data[i++];
                                        Y = data[i++];
                                        K = data[i++];
                                        R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                                        G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                                        B = 255 - clampTo8bit(Y * (1 - K / 255) + K);
                                        imageDataArray[j++] = R;
                                        imageDataArray[j++] = G;
                                        imageDataArray[j++] = B;
                                        imageDataArray[j++] = 255
                                    }
                                }
                                break;
                            default:
                                throw "Unsupported color mode"
                            }
                        }
                    };
                    return constructor
                }();
                module.exports = decode;
                function decode(jpegData, useTArray) {
                    var arr = new Uint8Array(jpegData);
                    var decoder = new JpegImage;
                    decoder.parse(arr);
                    var image = {
                        width: decoder.width,
                        height: decoder.height,
                        data: useTArray ? new Uint8Array(decoder.width * decoder.height * 4) : new Buffer(decoder.width * decoder.height * 4)
                    };
                    decoder.copyToImageData(image);
                    return image
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            buffer: 7
        }],
        32: [function(require, module, exports) {
            (function(Buffer) {
                var btoa = btoa || function(buf) {
                    return new Buffer(buf).toString("base64")
                }
                ;
                function JPEGEncoder(quality) {
                    var self = this;
                    var fround = Math.round;
                    var ffloor = Math.floor;
                    var YTable = new Array(64);
                    var UVTable = new Array(64);
                    var fdtbl_Y = new Array(64);
                    var fdtbl_UV = new Array(64);
                    var YDC_HT;
                    var UVDC_HT;
                    var YAC_HT;
                    var UVAC_HT;
                    var bitcode = new Array(65535);
                    var category = new Array(65535);
                    var outputfDCTQuant = new Array(64);
                    var DU = new Array(64);
                    var byteout = [];
                    var bytenew = 0;
                    var bytepos = 7;
                    var YDU = new Array(64);
                    var UDU = new Array(64);
                    var VDU = new Array(64);
                    var clt = new Array(256);
                    var RGB_YUV_TABLE = new Array(2048);
                    var currentQuality;
                    var ZigZag = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];
                    var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
                    var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                    var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
                    var std_ac_luminance_values = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250];
                    var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
                    var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                    var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
                    var std_ac_chrominance_values = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
                    function initQuantTables(sf) {
                        var YQT = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
                        for (var i = 0; i < 64; i++) {
                            var t = ffloor((YQT[i] * sf + 50) / 100);
                            if (t < 1) {
                                t = 1
                            } else if (t > 255) {
                                t = 255
                            }
                            YTable[ZigZag[i]] = t
                        }
                        var UVQT = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
                        for (var j = 0; j < 64; j++) {
                            var u = ffloor((UVQT[j] * sf + 50) / 100);
                            if (u < 1) {
                                u = 1
                            } else if (u > 255) {
                                u = 255
                            }
                            UVTable[ZigZag[j]] = u
                        }
                        var aasf = [1, 1.387039845, 1.306562965, 1.175875602, 1, .785694958, .5411961, .275899379];
                        var k = 0;
                        for (var row = 0; row < 8; row++) {
                            for (var col = 0; col < 8; col++) {
                                fdtbl_Y[k] = 1 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8);
                                fdtbl_UV[k] = 1 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8);
                                k++
                            }
                        }
                    }
                    function computeHuffmanTbl(nrcodes, std_table) {
                        var codevalue = 0;
                        var pos_in_table = 0;
                        var HT = new Array;
                        for (var k = 1; k <= 16; k++) {
                            for (var j = 1; j <= nrcodes[k]; j++) {
                                HT[std_table[pos_in_table]] = [];
                                HT[std_table[pos_in_table]][0] = codevalue;
                                HT[std_table[pos_in_table]][1] = k;
                                pos_in_table++;
                                codevalue++
                            }
                            codevalue *= 2
                        }
                        return HT
                    }
                    function initHuffmanTbl() {
                        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
                        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
                        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
                        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values)
                    }
                    function initCategoryNumber() {
                        var nrlower = 1;
                        var nrupper = 2;
                        for (var cat = 1; cat <= 15; cat++) {
                            for (var nr = nrlower; nr < nrupper; nr++) {
                                category[32767 + nr] = cat;
                                bitcode[32767 + nr] = [];
                                bitcode[32767 + nr][1] = cat;
                                bitcode[32767 + nr][0] = nr
                            }
                            for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
                                category[32767 + nrneg] = cat;
                                bitcode[32767 + nrneg] = [];
                                bitcode[32767 + nrneg][1] = cat;
                                bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg
                            }
                            nrlower <<= 1;
                            nrupper <<= 1
                        }
                    }
                    function initRGBYUVTable() {
                        for (var i = 0; i < 256; i++) {
                            RGB_YUV_TABLE[i] = 19595 * i;
                            RGB_YUV_TABLE[i + 256 >> 0] = 38470 * i;
                            RGB_YUV_TABLE[i + 512 >> 0] = 7471 * i + 32768;
                            RGB_YUV_TABLE[i + 768 >> 0] = -11059 * i;
                            RGB_YUV_TABLE[i + 1024 >> 0] = -21709 * i;
                            RGB_YUV_TABLE[i + 1280 >> 0] = 32768 * i + 8421375;
                            RGB_YUV_TABLE[i + 1536 >> 0] = -27439 * i;
                            RGB_YUV_TABLE[i + 1792 >> 0] = -5329 * i
                        }
                    }
                    function writeBits(bs) {
                        var value = bs[0];
                        var posval = bs[1] - 1;
                        while (posval >= 0) {
                            if (value & 1 << posval) {
                                bytenew |= 1 << bytepos
                            }
                            posval--;
                            bytepos--;
                            if (bytepos < 0) {
                                if (bytenew == 255) {
                                    writeByte(255);
                                    writeByte(0)
                                } else {
                                    writeByte(bytenew)
                                }
                                bytepos = 7;
                                bytenew = 0
                            }
                        }
                    }
                    function writeByte(value) {
                        byteout.push(value)
                    }
                    function writeWord(value) {
                        writeByte(value >> 8 & 255);
                        writeByte(value & 255)
                    }
                    function fDCTQuant(data, fdtbl) {
                        var d0, d1, d2, d3, d4, d5, d6, d7;
                        var dataOff = 0;
                        var i;
                        var I8 = 8;
                        var I64 = 64;
                        for (i = 0; i < I8; ++i) {
                            d0 = data[dataOff];
                            d1 = data[dataOff + 1];
                            d2 = data[dataOff + 2];
                            d3 = data[dataOff + 3];
                            d4 = data[dataOff + 4];
                            d5 = data[dataOff + 5];
                            d6 = data[dataOff + 6];
                            d7 = data[dataOff + 7];
                            var tmp0 = d0 + d7;
                            var tmp7 = d0 - d7;
                            var tmp1 = d1 + d6;
                            var tmp6 = d1 - d6;
                            var tmp2 = d2 + d5;
                            var tmp5 = d2 - d5;
                            var tmp3 = d3 + d4;
                            var tmp4 = d3 - d4;
                            var tmp10 = tmp0 + tmp3;
                            var tmp13 = tmp0 - tmp3;
                            var tmp11 = tmp1 + tmp2;
                            var tmp12 = tmp1 - tmp2;
                            data[dataOff] = tmp10 + tmp11;
                            data[dataOff + 4] = tmp10 - tmp11;
                            var z1 = (tmp12 + tmp13) * .707106781;
                            data[dataOff + 2] = tmp13 + z1;
                            data[dataOff + 6] = tmp13 - z1;
                            tmp10 = tmp4 + tmp5;
                            tmp11 = tmp5 + tmp6;
                            tmp12 = tmp6 + tmp7;
                            var z5 = (tmp10 - tmp12) * .382683433;
                            var z2 = .5411961 * tmp10 + z5;
                            var z4 = 1.306562965 * tmp12 + z5;
                            var z3 = tmp11 * .707106781;
                            var z11 = tmp7 + z3;
                            var z13 = tmp7 - z3;
                            data[dataOff + 5] = z13 + z2;
                            data[dataOff + 3] = z13 - z2;
                            data[dataOff + 1] = z11 + z4;
                            data[dataOff + 7] = z11 - z4;
                            dataOff += 8
                        }
                        dataOff = 0;
                        for (i = 0; i < I8; ++i) {
                            d0 = data[dataOff];
                            d1 = data[dataOff + 8];
                            d2 = data[dataOff + 16];
                            d3 = data[dataOff + 24];
                            d4 = data[dataOff + 32];
                            d5 = data[dataOff + 40];
                            d6 = data[dataOff + 48];
                            d7 = data[dataOff + 56];
                            var tmp0p2 = d0 + d7;
                            var tmp7p2 = d0 - d7;
                            var tmp1p2 = d1 + d6;
                            var tmp6p2 = d1 - d6;
                            var tmp2p2 = d2 + d5;
                            var tmp5p2 = d2 - d5;
                            var tmp3p2 = d3 + d4;
                            var tmp4p2 = d3 - d4;
                            var tmp10p2 = tmp0p2 + tmp3p2;
                            var tmp13p2 = tmp0p2 - tmp3p2;
                            var tmp11p2 = tmp1p2 + tmp2p2;
                            var tmp12p2 = tmp1p2 - tmp2p2;
                            data[dataOff] = tmp10p2 + tmp11p2;
                            data[dataOff + 32] = tmp10p2 - tmp11p2;
                            var z1p2 = (tmp12p2 + tmp13p2) * .707106781;
                            data[dataOff + 16] = tmp13p2 + z1p2;
                            data[dataOff + 48] = tmp13p2 - z1p2;
                            tmp10p2 = tmp4p2 + tmp5p2;
                            tmp11p2 = tmp5p2 + tmp6p2;
                            tmp12p2 = tmp6p2 + tmp7p2;
                            var z5p2 = (tmp10p2 - tmp12p2) * .382683433;
                            var z2p2 = .5411961 * tmp10p2 + z5p2;
                            var z4p2 = 1.306562965 * tmp12p2 + z5p2;
                            var z3p2 = tmp11p2 * .707106781;
                            var z11p2 = tmp7p2 + z3p2;
                            var z13p2 = tmp7p2 - z3p2;
                            data[dataOff + 40] = z13p2 + z2p2;
                            data[dataOff + 24] = z13p2 - z2p2;
                            data[dataOff + 8] = z11p2 + z4p2;
                            data[dataOff + 56] = z11p2 - z4p2;
                            dataOff++
                        }
                        var fDCTQuant;
                        for (i = 0; i < I64; ++i) {
                            fDCTQuant = data[i] * fdtbl[i];
                            outputfDCTQuant[i] = fDCTQuant > 0 ? fDCTQuant + .5 | 0 : fDCTQuant - .5 | 0
                        }
                        return outputfDCTQuant
                    }
                    function writeAPP0() {
                        writeWord(65504);
                        writeWord(16);
                        writeByte(74);
                        writeByte(70);
                        writeByte(73);
                        writeByte(70);
                        writeByte(0);
                        writeByte(1);
                        writeByte(1);
                        writeByte(0);
                        writeWord(1);
                        writeWord(1);
                        writeByte(0);
                        writeByte(0)
                    }
                    function writeSOF0(width, height) {
                        writeWord(65472);
                        writeWord(17);
                        writeByte(8);
                        writeWord(height);
                        writeWord(width);
                        writeByte(3);
                        writeByte(1);
                        writeByte(17);
                        writeByte(0);
                        writeByte(2);
                        writeByte(17);
                        writeByte(1);
                        writeByte(3);
                        writeByte(17);
                        writeByte(1)
                    }
                    function writeDQT() {
                        writeWord(65499);
                        writeWord(132);
                        writeByte(0);
                        for (var i = 0; i < 64; i++) {
                            writeByte(YTable[i])
                        }
                        writeByte(1);
                        for (var j = 0; j < 64; j++) {
                            writeByte(UVTable[j])
                        }
                    }
                    function writeDHT() {
                        writeWord(65476);
                        writeWord(418);
                        writeByte(0);
                        for (var i = 0; i < 16; i++) {
                            writeByte(std_dc_luminance_nrcodes[i + 1])
                        }
                        for (var j = 0; j <= 11; j++) {
                            writeByte(std_dc_luminance_values[j])
                        }
                        writeByte(16);
                        for (var k = 0; k < 16; k++) {
                            writeByte(std_ac_luminance_nrcodes[k + 1])
                        }
                        for (var l = 0; l <= 161; l++) {
                            writeByte(std_ac_luminance_values[l])
                        }
                        writeByte(1);
                        for (var m = 0; m < 16; m++) {
                            writeByte(std_dc_chrominance_nrcodes[m + 1])
                        }
                        for (var n = 0; n <= 11; n++) {
                            writeByte(std_dc_chrominance_values[n])
                        }
                        writeByte(17);
                        for (var o = 0; o < 16; o++) {
                            writeByte(std_ac_chrominance_nrcodes[o + 1])
                        }
                        for (var p = 0; p <= 161; p++) {
                            writeByte(std_ac_chrominance_values[p])
                        }
                    }
                    function writeSOS() {
                        writeWord(65498);
                        writeWord(12);
                        writeByte(3);
                        writeByte(1);
                        writeByte(0);
                        writeByte(2);
                        writeByte(17);
                        writeByte(3);
                        writeByte(17);
                        writeByte(0);
                        writeByte(63);
                        writeByte(0)
                    }
                    function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
                        var EOB = HTAC[0];
                        var M16zeroes = HTAC[240];
                        var pos;
                        var I16 = 16;
                        var I63 = 63;
                        var I64 = 64;
                        var DU_DCT = fDCTQuant(CDU, fdtbl);
                        for (var j = 0; j < I64; ++j) {
                            DU[ZigZag[j]] = DU_DCT[j]
                        }
                        var Diff = DU[0] - DC;
                        DC = DU[0];
                        if (Diff == 0) {
                            writeBits(HTDC[0])
                        } else {
                            pos = 32767 + Diff;
                            writeBits(HTDC[category[pos]]);
                            writeBits(bitcode[pos])
                        }
                        var end0pos = 63;
                        for (; end0pos > 0 && DU[end0pos] == 0; end0pos--) {}
                        if (end0pos == 0) {
                            writeBits(EOB);
                            return DC
                        }
                        var i = 1;
                        var lng;
                        while (i <= end0pos) {
                            var startpos = i;
                            for (; DU[i] == 0 && i <= end0pos; ++i) {}
                            var nrzeroes = i - startpos;
                            if (nrzeroes >= I16) {
                                lng = nrzeroes >> 4;
                                for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
                                    writeBits(M16zeroes);
                                nrzeroes = nrzeroes & 15
                            }
                            pos = 32767 + DU[i];
                            writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
                            writeBits(bitcode[pos]);
                            i++
                        }
                        if (end0pos != I63) {
                            writeBits(EOB)
                        }
                        return DC
                    }
                    function initCharLookupTable() {
                        var sfcc = String.fromCharCode;
                        for (var i = 0; i < 256; i++) {
                            clt[i] = sfcc(i)
                        }
                    }
                    this.encode = function(image, quality) {
                        var time_start = (new Date).getTime();
                        if (quality)
                            setQuality(quality);
                        byteout = new Array;
                        bytenew = 0;
                        bytepos = 7;
                        writeWord(65496);
                        writeAPP0();
                        writeDQT();
                        writeSOF0(image.width, image.height);
                        writeDHT();
                        writeSOS();
                        var DCY = 0;
                        var DCU = 0;
                        var DCV = 0;
                        bytenew = 0;
                        bytepos = 7;
                        this.encode.displayName = "_encode_";
                        var imageData = image.data;
                        var width = image.width;
                        var height = image.height;
                        var quadWidth = width * 4;
                        var tripleWidth = width * 3;
                        var x, y = 0;
                        var r, g, b;
                        var start, p, col, row, pos;
                        while (y < height) {
                            x = 0;
                            while (x < quadWidth) {
                                start = quadWidth * y + x;
                                p = start;
                                col = -1;
                                row = 0;
                                for (pos = 0; pos < 64; pos++) {
                                    row = pos >> 3;
                                    col = (pos & 7) * 4;
                                    p = start + row * quadWidth + col;
                                    if (y + row >= height) {
                                        p -= quadWidth * (y + 1 + row - height)
                                    }
                                    if (x + col >= quadWidth) {
                                        p -= x + col - quadWidth + 4
                                    }
                                    r = imageData[p++];
                                    g = imageData[p++];
                                    b = imageData[p++];
                                    YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
                                    UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
                                    VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128
                                }
                                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                                x += 32
                            }
                            y += 8
                        }
                        if (bytepos >= 0) {
                            var fillbits = [];
                            fillbits[1] = bytepos + 1;
                            fillbits[0] = (1 << bytepos + 1) - 1;
                            writeBits(fillbits)
                        }
                        writeWord(65497);
                        return new Buffer(byteout);
                        var jpegDataUri = "data:image/jpeg;base64," + btoa(byteout.join(""));
                        byteout = [];
                        var duration = (new Date).getTime() - time_start;
                        return jpegDataUri
                    }
                    ;
                    function setQuality(quality) {
                        if (quality <= 0) {
                            quality = 1
                        }
                        if (quality > 100) {
                            quality = 100
                        }
                        if (currentQuality == quality)
                            return;
                        var sf = 0;
                        if (quality < 50) {
                            sf = Math.floor(5e3 / quality)
                        } else {
                            sf = Math.floor(200 - quality * 2)
                        }
                        initQuantTables(sf);
                        currentQuality = quality
                    }
                    function init() {
                        var time_start = (new Date).getTime();
                        if (!quality)
                            quality = 50;
                        initCharLookupTable();
                        initHuffmanTbl();
                        initCategoryNumber();
                        initRGBYUVTable();
                        setQuality(quality);
                        var duration = (new Date).getTime() - time_start
                    }
                    init()
                }
                module.exports = encode;
                function encode(imgData, qu) {
                    if (typeof qu === "undefined")
                        qu = 50;
                    var encoder = new JPEGEncoder(qu);
                    var data = encoder.encode(imgData, qu);
                    return {
                        data: data,
                        width: imgData.width,
                        height: imgData.height
                    }
                }
                function getImageDataFromImage(idOrElement) {
                    var theImg = typeof idOrElement == "string" ? document.getElementById(idOrElement) : idOrElement;
                    var cvs = document.createElement("canvas");
                    cvs.width = theImg.width;
                    cvs.height = theImg.height;
                    var ctx = cvs.getContext("2d");
                    ctx.drawImage(theImg, 0, 0);
                    return ctx.getImageData(0, 0, cvs.width, cvs.height)
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            buffer: 7
        }],
        33: [function(require, module, exports) {
            "use strict";
            var MultiRange = function() {
                function MultiRange(data) {
                    function isArray(x) {
                        return Object.prototype.toString.call(x) === "[object Array]"
                    }
                    this.ranges = [];
                    if (typeof data === "string") {
                        this.parseString(data)
                    } else if (typeof data === "number") {
                        this.appendRange(data, data)
                    } else if (data instanceof MultiRange) {
                        this.ranges = data.getRanges()
                    } else if (isArray(data)) {
                        for (var _i = 0, _a = data; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (isArray(item)) {
                                if (item.length === 2) {
                                    this.appendRange(item[0], item[1])
                                } else {
                                    throw new TypeError("Invalid array initializer")
                                }
                            } else if (typeof item === "number") {
                                this.append(item)
                            } else {
                                throw new TypeError("Invalid array initialzer")
                            }
                        }
                    } else if (data !== undefined) {
                        throw new TypeError("Invalid input")
                    }
                }
                MultiRange.prototype.parseString = function(data) {
                    function toInt(str) {
                        var m = str.match(/^\(?(\-?\d+)/);
                        return parseInt(m[1], 10)
                    }
                    var s = data.replace(/\s/g, "");
                    if (!s.length)
                        return;
                    var match;
                    for (var _i = 0, _a = s.split(","); _i < _a.length; _i++) {
                        var r = _a[_i];
                        if (match = r.match(/^(\d+|\(\-?\d+\))$/)) {
                            var val = toInt(match[1]);
                            this.appendRange(val, val)
                        } else if (match = r.match(/^(\d+|\(\-?\d+\))?\-(\d+|\(\-?\d+\))?$/)) {
                            var min = match[1] === undefined ? -Infinity : toInt(match[1]);
                            var max = match[2] === undefined ? +Infinity : toInt(match[2]);
                            this.appendRange(min, max)
                        } else {
                            throw new SyntaxError("Invalid input")
                        }
                    }
                }
                ;
                MultiRange.prototype.clone = function() {
                    return new MultiRange(this)
                }
                ;
                MultiRange.prototype.append = function(value) {
                    if (value === undefined) {
                        throw new TypeError("Invalid input")
                    } else if (value instanceof MultiRange) {
                        for (var _i = 0, _a = value.ranges; _i < _a.length; _i++) {
                            var r = _a[_i];
                            this.appendRange(r[0], r[1])
                        }
                        return this
                    } else {
                        return this.append(new MultiRange(value))
                    }
                }
                ;
                MultiRange.prototype.appendRange = function(min, max) {
                    var newRange = [min, max];
                    if (newRange[0] > newRange[1]) {
                        newRange = [newRange[1], newRange[0]]
                    }
                    if (newRange[0] === Infinity && newRange[1] === Infinity || newRange[0] === -Infinity && newRange[1] === -Infinity) {
                        throw new RangeError("Infinity can be used only within an unbounded range segment")
                    }
                    var overlap = this.findOverlap(newRange);
                    this.ranges.splice(overlap.lo, overlap.count, overlap.union);
                    return this
                }
                ;
                MultiRange.prototype.subtract = function(value) {
                    if (value === undefined) {
                        throw new TypeError("Invalid input")
                    } else if (value instanceof MultiRange) {
                        for (var _i = 0, _a = value.ranges; _i < _a.length; _i++) {
                            var r = _a[_i];
                            this.subtractRange(r[0], r[1])
                        }
                        return this
                    } else {
                        return this.subtract(new MultiRange(value))
                    }
                }
                ;
                MultiRange.prototype.subtractRange = function(min, max) {
                    var newRange = [min, max];
                    if (newRange[0] > newRange[1]) {
                        newRange = [newRange[1], newRange[0]]
                    }
                    var overlap = this.findOverlap(newRange);
                    if (overlap.count > 0) {
                        var remain = [];
                        if (this.ranges[overlap.lo][0] < newRange[0]) {
                            remain.push([this.ranges[overlap.lo][0], newRange[0] - 1])
                        }
                        if (newRange[1] < this.ranges[overlap.lo + overlap.count - 1][1]) {
                            remain.push([newRange[1] + 1, this.ranges[overlap.lo + overlap.count - 1][1]])
                        }
                        this.ranges.splice.apply(this.ranges, [overlap.lo, overlap.count].concat(remain))
                    }
                    return this
                }
                ;
                MultiRange.prototype.intersect = function(value) {
                    if (value === undefined) {
                        throw new TypeError("Invalid input")
                    } else if (value instanceof MultiRange) {
                        var result = [];
                        var jstart = 0;
                        for (var i = 0; i < this.ranges.length; i++) {
                            var r1 = this.ranges[i];
                            for (var j = jstart; j < value.ranges.length; j++) {
                                var r2 = value.ranges[j];
                                if (r1[0] <= r2[1] && r1[1] >= r2[0]) {
                                    jstart = j;
                                    var min = Math.max(r1[0], r2[0]);
                                    var max = Math.min(r1[1], r2[1]);
                                    result.push([min, max])
                                } else if (r1[1] < r2[0]) {
                                    break
                                }
                            }
                        }
                        this.ranges = result;
                        return this
                    } else {
                        return this.intersect(new MultiRange(value))
                    }
                }
                ;
                MultiRange.prototype.findOverlap = function(target) {
                    for (var hi = this.ranges.length - 1; hi >= 0; hi--) {
                        var r = this.ranges[hi];
                        var union = void 0;
                        if (union = this.calcUnion(r, target)) {
                            var count = 1;
                            var tmp = void 0;
                            while (hi - count >= 0 && (tmp = this.calcUnion(union, this.ranges[hi - count]))) {
                                union = tmp;
                                count++
                            }
                            return {
                                lo: hi + 1 - count,
                                count: count,
                                union: union
                            }
                        } else if (r[1] < target[0]) {
                            return {
                                lo: hi + 1,
                                count: 0,
                                union: target
                            }
                        }
                    }
                    return {
                        lo: 0,
                        count: 0,
                        union: target
                    }
                }
                ;
                MultiRange.prototype.calcUnion = function(a, b) {
                    if (a[1] + 1 < b[0] || a[0] - 1 > b[1]) {
                        return null
                    }
                    return [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
                }
                ;
                MultiRange.prototype.getRanges = function() {
                    var result = [];
                    for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
                        var r = _a[_i];
                        result.push([r[0], r[1]])
                    }
                    return result
                }
                ;
                MultiRange.prototype.has = function(value) {
                    if (value === undefined) {
                        throw new TypeError("Invalid input")
                    } else if (value instanceof MultiRange) {
                        var s = 0;
                        var len = this.ranges.length;
                        for (var _i = 0, _a = value.ranges; _i < _a.length; _i++) {
                            var tr = _a[_i];
                            var i = void 0;
                            for (i = s; i < len; i++) {
                                var my = this.ranges[i];
                                if (tr[0] >= my[0] && tr[1] <= my[1] && tr[1] >= my[0] && tr[1] <= my[1])
                                    break
                            }
                            if (i === len)
                                return false
                        }
                        return true
                    } else {
                        return this.has(new MultiRange(value))
                    }
                }
                ;
                MultiRange.prototype.hasRange = function(min, max) {
                    return this.has(new MultiRange([[min, max]]))
                }
                ;
                MultiRange.prototype.segmentLength = function() {
                    return this.ranges.length
                }
                ;
                MultiRange.prototype.length = function() {
                    if (this.isUnbounded())
                        return Infinity;
                    var result = 0;
                    for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
                        var r = _a[_i];
                        result += r[1] - r[0] + 1
                    }
                    return result
                }
                ;
                MultiRange.prototype.equals = function(cmp) {
                    if (cmp === undefined) {
                        throw new TypeError("Invalid input")
                    } else if (cmp instanceof MultiRange) {
                        if (cmp === this)
                            return true;
                        if (this.ranges.length !== cmp.ranges.length)
                            return false;
                        for (var i = 0; i < this.ranges.length; i++) {
                            if (this.ranges[i][0] !== cmp.ranges[i][0] || this.ranges[i][1] !== cmp.ranges[i][1])
                                return false
                        }
                        return true
                    } else {
                        return this.equals(new MultiRange(cmp))
                    }
                }
                ;
                MultiRange.prototype.isUnbounded = function() {
                    return this.ranges.length > 0 && (this.ranges[0][0] === -Infinity || this.ranges[this.ranges.length - 1][1] === Infinity)
                }
                ;
                MultiRange.prototype.min = function() {
                    if (this.ranges.length === 0)
                        return undefined;
                    return this.ranges[0][0]
                }
                ;
                MultiRange.prototype.max = function() {
                    if (this.ranges.length === 0)
                        return undefined;
                    return this.ranges[this.ranges.length - 1][1]
                }
                ;
                MultiRange.prototype.shift = function() {
                    var min = this.min();
                    if (min === -Infinity)
                        throw new RangeError("shift() was invoked on an unbounded MultiRange which contains -Infinity");
                    if (min !== undefined)
                        this.subtract(min);
                    return min
                }
                ;
                MultiRange.prototype.pop = function() {
                    var max = this.max();
                    if (max === Infinity)
                        throw new RangeError("pop() was invoked on an unbounded MultiRange which contains +Infinity");
                    if (max !== undefined)
                        this.subtract(max);
                    return max
                }
                ;
                MultiRange.prototype.toString = function() {
                    function wrap(i) {
                        return i >= 0 ? String(i) : "(" + i + ")"
                    }
                    var ranges = [];
                    for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
                        var r = _a[_i];
                        if (r[0] === -Infinity) {
                            if (r[1] === Infinity) {
                                ranges.push("-")
                            } else {
                                ranges.push("-" + wrap(r[1]))
                            }
                        } else if (r[1] === Infinity) {
                            ranges.push(wrap(r[0]) + "-")
                        } else if (r[0] == r[1]) {
                            ranges.push(wrap(r[0]))
                        } else {
                            ranges.push(wrap(r[0]) + "-" + wrap(r[1]))
                        }
                    }
                    return ranges.join(",")
                }
                ;
                MultiRange.prototype.toArray = function() {
                    if (this.isUnbounded()) {
                        throw new RangeError("You cannot build an array from an unbounded range")
                    }
                    var result = new Array(this.length());
                    var idx = 0;
                    for (var _i = 0, _a = this.ranges; _i < _a.length; _i++) {
                        var r = _a[_i];
                        for (var n = r[0]; n <= r[1]; n++) {
                            result[idx++] = n
                        }
                    }
                    return result
                }
                ;
                MultiRange.prototype.getIterator = function() {
                    var _this = this;
                    if (this.isUnbounded()) {
                        throw new RangeError("Unbounded ranges cannot be iterated over")
                    }
                    var i = 0
                      , curRange = this.ranges[i]
                      , j = curRange ? curRange[0] : undefined;
                    return {
                        next: function() {
                            if (!curRange)
                                return {
                                    done: true
                                };
                            var ret = j;
                            if (++j > curRange[1]) {
                                curRange = _this.ranges[++i];
                                j = curRange ? curRange[0] : undefined
                            }
                            return {
                                value: ret
                            }
                        }
                    }
                }
                ;
                return MultiRange
            }();
            exports.MultiRange = MultiRange;
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                MultiRange.prototype[Symbol.iterator] = MultiRange.prototype.getIterator
            }
            function multirange(data) {
                return new MultiRange(data)
            }
            exports.multirange = multirange
        }
        , {}],
        34: [function(require, module, exports) {
            "use strict";
            var compile = require("cwise-compiler");
            var EmptyProc = {
                body: "",
                args: [],
                thisVars: [],
                localVars: []
            };
            function fixup(x) {
                if (!x) {
                    return EmptyProc
                }
                for (var i = 0; i < x.args.length; ++i) {
                    var a = x.args[i];
                    if (i === 0) {
                        x.args[i] = {
                            name: a,
                            lvalue: true,
                            rvalue: !!x.rvalue,
                            count: x.count || 1
                        }
                    } else {
                        x.args[i] = {
                            name: a,
                            lvalue: false,
                            rvalue: true,
                            count: 1
                        }
                    }
                }
                if (!x.thisVars) {
                    x.thisVars = []
                }
                if (!x.localVars) {
                    x.localVars = []
                }
                return x
            }
            function pcompile(user_args) {
                return compile({
                    args: user_args.args,
                    pre: fixup(user_args.pre),
                    body: fixup(user_args.body),
                    post: fixup(user_args.proc),
                    funcName: user_args.funcName
                })
            }
            function makeOp(user_args) {
                var args = [];
                for (var i = 0; i < user_args.args.length; ++i) {
                    args.push("a" + i)
                }
                var wrapper = new Function("P",["return function ", user_args.funcName, "_ndarrayops(", args.join(","), ") {P(", args.join(","), ");return a0}"].join(""));
                return wrapper(pcompile(user_args))
            }
            var assign_ops = {
                add: "+",
                sub: "-",
                mul: "*",
                div: "/",
                mod: "%",
                band: "&",
                bor: "|",
                bxor: "^",
                lshift: "<<",
                rshift: ">>",
                rrshift: ">>>"
            };
            (function() {
                for (var id in assign_ops) {
                    var op = assign_ops[id];
                    exports[id] = makeOp({
                        args: ["array", "array", "array"],
                        body: {
                            args: ["a", "b", "c"],
                            body: "a=b" + op + "c"
                        },
                        funcName: id
                    });
                    exports[id + "eq"] = makeOp({
                        args: ["array", "array"],
                        body: {
                            args: ["a", "b"],
                            body: "a" + op + "=b"
                        },
                        rvalue: true,
                        funcName: id + "eq"
                    });
                    exports[id + "s"] = makeOp({
                        args: ["array", "array", "scalar"],
                        body: {
                            args: ["a", "b", "s"],
                            body: "a=b" + op + "s"
                        },
                        funcName: id + "s"
                    });
                    exports[id + "seq"] = makeOp({
                        args: ["array", "scalar"],
                        body: {
                            args: ["a", "s"],
                            body: "a" + op + "=s"
                        },
                        rvalue: true,
                        funcName: id + "seq"
                    })
                }
            }
            )();
            var unary_ops = {
                not: "!",
                bnot: "~",
                neg: "-",
                recip: "1.0/"
            };
            (function() {
                for (var id in unary_ops) {
                    var op = unary_ops[id];
                    exports[id] = makeOp({
                        args: ["array", "array"],
                        body: {
                            args: ["a", "b"],
                            body: "a=" + op + "b"
                        },
                        funcName: id
                    });
                    exports[id + "eq"] = makeOp({
                        args: ["array"],
                        body: {
                            args: ["a"],
                            body: "a=" + op + "a"
                        },
                        rvalue: true,
                        count: 2,
                        funcName: id + "eq"
                    })
                }
            }
            )();
            var binary_ops = {
                and: "&&",
                or: "||",
                eq: "===",
                neq: "!==",
                lt: "<",
                gt: ">",
                leq: "<=",
                geq: ">="
            };
            (function() {
                for (var id in binary_ops) {
                    var op = binary_ops[id];
                    exports[id] = makeOp({
                        args: ["array", "array", "array"],
                        body: {
                            args: ["a", "b", "c"],
                            body: "a=b" + op + "c"
                        },
                        funcName: id
                    });
                    exports[id + "s"] = makeOp({
                        args: ["array", "array", "scalar"],
                        body: {
                            args: ["a", "b", "s"],
                            body: "a=b" + op + "s"
                        },
                        funcName: id + "s"
                    });
                    exports[id + "eq"] = makeOp({
                        args: ["array", "array"],
                        body: {
                            args: ["a", "b"],
                            body: "a=a" + op + "b"
                        },
                        rvalue: true,
                        count: 2,
                        funcName: id + "eq"
                    });
                    exports[id + "seq"] = makeOp({
                        args: ["array", "scalar"],
                        body: {
                            args: ["a", "s"],
                            body: "a=a" + op + "s"
                        },
                        rvalue: true,
                        count: 2,
                        funcName: id + "seq"
                    })
                }
            }
            )();
            var math_unary = ["abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor", "log", "round", "sin", "sqrt", "tan"];
            (function() {
                for (var i = 0; i < math_unary.length; ++i) {
                    var f = math_unary[i];
                    exports[f] = makeOp({
                        args: ["array", "array"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b"],
                            body: "a=this_f(b)",
                            thisVars: ["this_f"]
                        },
                        funcName: f
                    });
                    exports[f + "eq"] = makeOp({
                        args: ["array"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a"],
                            body: "a=this_f(a)",
                            thisVars: ["this_f"]
                        },
                        rvalue: true,
                        count: 2,
                        funcName: f + "eq"
                    })
                }
            }
            )();
            var math_comm = ["max", "min", "atan2", "pow"];
            (function() {
                for (var i = 0; i < math_comm.length; ++i) {
                    var f = math_comm[i];
                    exports[f] = makeOp({
                        args: ["array", "array", "array"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b", "c"],
                            body: "a=this_f(b,c)",
                            thisVars: ["this_f"]
                        },
                        funcName: f
                    });
                    exports[f + "s"] = makeOp({
                        args: ["array", "array", "scalar"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b", "c"],
                            body: "a=this_f(b,c)",
                            thisVars: ["this_f"]
                        },
                        funcName: f + "s"
                    });
                    exports[f + "eq"] = makeOp({
                        args: ["array", "array"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b"],
                            body: "a=this_f(a,b)",
                            thisVars: ["this_f"]
                        },
                        rvalue: true,
                        count: 2,
                        funcName: f + "eq"
                    });
                    exports[f + "seq"] = makeOp({
                        args: ["array", "scalar"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b"],
                            body: "a=this_f(a,b)",
                            thisVars: ["this_f"]
                        },
                        rvalue: true,
                        count: 2,
                        funcName: f + "seq"
                    })
                }
            }
            )();
            var math_noncomm = ["atan2", "pow"];
            (function() {
                for (var i = 0; i < math_noncomm.length; ++i) {
                    var f = math_noncomm[i];
                    exports[f + "op"] = makeOp({
                        args: ["array", "array", "array"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b", "c"],
                            body: "a=this_f(c,b)",
                            thisVars: ["this_f"]
                        },
                        funcName: f + "op"
                    });
                    exports[f + "ops"] = makeOp({
                        args: ["array", "array", "scalar"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b", "c"],
                            body: "a=this_f(c,b)",
                            thisVars: ["this_f"]
                        },
                        funcName: f + "ops"
                    });
                    exports[f + "opeq"] = makeOp({
                        args: ["array", "array"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b"],
                            body: "a=this_f(b,a)",
                            thisVars: ["this_f"]
                        },
                        rvalue: true,
                        count: 2,
                        funcName: f + "opeq"
                    });
                    exports[f + "opseq"] = makeOp({
                        args: ["array", "scalar"],
                        pre: {
                            args: [],
                            body: "this_f=Math." + f,
                            thisVars: ["this_f"]
                        },
                        body: {
                            args: ["a", "b"],
                            body: "a=this_f(b,a)",
                            thisVars: ["this_f"]
                        },
                        rvalue: true,
                        count: 2,
                        funcName: f + "opseq"
                    })
                }
            }
            )();
            exports.any = compile({
                args: ["array"],
                pre: EmptyProc,
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    body: "if(a){return true}",
                    localVars: [],
                    thisVars: []
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: [],
                    body: "return false"
                },
                funcName: "any"
            });
            exports.all = compile({
                args: ["array"],
                pre: EmptyProc,
                body: {
                    args: [{
                        name: "x",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    body: "if(!x){return false}",
                    localVars: [],
                    thisVars: []
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: [],
                    body: "return true"
                },
                funcName: "all"
            });
            exports.sum = compile({
                args: ["array"],
                pre: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "this_s=0"
                },
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    body: "this_s+=a",
                    localVars: [],
                    thisVars: ["this_s"]
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "return this_s"
                },
                funcName: "sum"
            });
            exports.prod = compile({
                args: ["array"],
                pre: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "this_s=1"
                },
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    body: "this_s*=a",
                    localVars: [],
                    thisVars: ["this_s"]
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "return this_s"
                },
                funcName: "prod"
            });
            exports.norm2squared = compile({
                args: ["array"],
                pre: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "this_s=0"
                },
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }],
                    body: "this_s+=a*a",
                    localVars: [],
                    thisVars: ["this_s"]
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "return this_s"
                },
                funcName: "norm2squared"
            });
            exports.norm2 = compile({
                args: ["array"],
                pre: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "this_s=0"
                },
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }],
                    body: "this_s+=a*a",
                    localVars: [],
                    thisVars: ["this_s"]
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "return Math.sqrt(this_s)"
                },
                funcName: "norm2"
            });
            exports.norminf = compile({
                args: ["array"],
                pre: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "this_s=0"
                },
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 4
                    }],
                    body: "if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}",
                    localVars: [],
                    thisVars: ["this_s"]
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "return this_s"
                },
                funcName: "norminf"
            });
            exports.norm1 = compile({
                args: ["array"],
                pre: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "this_s=0"
                },
                body: {
                    args: [{
                        name: "a",
                        lvalue: false,
                        rvalue: true,
                        count: 3
                    }],
                    body: "this_s+=a<0?-a:a",
                    localVars: [],
                    thisVars: ["this_s"]
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: ["this_s"],
                    body: "return this_s"
                },
                funcName: "norm1"
            });
            exports.sup = compile({
                args: ["array"],
                pre: {
                    body: "this_h=-Infinity",
                    args: [],
                    thisVars: ["this_h"],
                    localVars: []
                },
                body: {
                    body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
                    args: [{
                        name: "_inline_1_arg0_",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }],
                    thisVars: ["this_h"],
                    localVars: []
                },
                post: {
                    body: "return this_h",
                    args: [],
                    thisVars: ["this_h"],
                    localVars: []
                }
            });
            exports.inf = compile({
                args: ["array"],
                pre: {
                    body: "this_h=Infinity",
                    args: [],
                    thisVars: ["this_h"],
                    localVars: []
                },
                body: {
                    body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
                    args: [{
                        name: "_inline_1_arg0_",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }],
                    thisVars: ["this_h"],
                    localVars: []
                },
                post: {
                    body: "return this_h",
                    args: [],
                    thisVars: ["this_h"],
                    localVars: []
                }
            });
            exports.argmin = compile({
                args: ["index", "array", "shape"],
                pre: {
                    body: "{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
                    args: [{
                        name: "_inline_0_arg0_",
                        lvalue: false,
                        rvalue: false,
                        count: 0
                    }, {
                        name: "_inline_0_arg1_",
                        lvalue: false,
                        rvalue: false,
                        count: 0
                    }, {
                        name: "_inline_0_arg2_",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    thisVars: ["this_i", "this_v"],
                    localVars: []
                },
                body: {
                    body: "{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
                    args: [{
                        name: "_inline_1_arg0_",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }, {
                        name: "_inline_1_arg1_",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }],
                    thisVars: ["this_i", "this_v"],
                    localVars: ["_inline_1_k"]
                },
                post: {
                    body: "{return this_i}",
                    args: [],
                    thisVars: ["this_i"],
                    localVars: []
                }
            });
            exports.argmax = compile({
                args: ["index", "array", "shape"],
                pre: {
                    body: "{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
                    args: [{
                        name: "_inline_0_arg0_",
                        lvalue: false,
                        rvalue: false,
                        count: 0
                    }, {
                        name: "_inline_0_arg1_",
                        lvalue: false,
                        rvalue: false,
                        count: 0
                    }, {
                        name: "_inline_0_arg2_",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    thisVars: ["this_i", "this_v"],
                    localVars: []
                },
                body: {
                    body: "{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
                    args: [{
                        name: "_inline_1_arg0_",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }, {
                        name: "_inline_1_arg1_",
                        lvalue: false,
                        rvalue: true,
                        count: 2
                    }],
                    thisVars: ["this_i", "this_v"],
                    localVars: ["_inline_1_k"]
                },
                post: {
                    body: "{return this_i}",
                    args: [],
                    thisVars: ["this_i"],
                    localVars: []
                }
            });
            exports.random = makeOp({
                args: ["array"],
                pre: {
                    args: [],
                    body: "this_f=Math.random",
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a"],
                    body: "a=this_f()",
                    thisVars: ["this_f"]
                },
                funcName: "random"
            });
            exports.assign = makeOp({
                args: ["array", "array"],
                body: {
                    args: ["a", "b"],
                    body: "a=b"
                },
                funcName: "assign"
            });
            exports.assigns = makeOp({
                args: ["array", "scalar"],
                body: {
                    args: ["a", "b"],
                    body: "a=b"
                },
                funcName: "assigns"
            });
            exports.equals = compile({
                args: ["array", "array"],
                pre: EmptyProc,
                body: {
                    args: [{
                        name: "x",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }, {
                        name: "y",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }],
                    body: "if(x!==y){return false}",
                    localVars: [],
                    thisVars: []
                },
                post: {
                    args: [],
                    localVars: [],
                    thisVars: [],
                    body: "return true"
                },
                funcName: "equals"
            })
        }
        , {
            "cwise-compiler": 10
        }],
        35: [function(require, module, exports) {
            "use strict";
            var ndarray = require("ndarray");
            var do_convert = require("./doConvert.js");
            module.exports = function convert(arr, result) {
                var shape = []
                  , c = arr
                  , sz = 1;
                while (Array.isArray(c)) {
                    shape.push(c.length);
                    sz *= c.length;
                    c = c[0]
                }
                if (shape.length === 0) {
                    return ndarray()
                }
                if (!result) {
                    result = ndarray(new Float64Array(sz), shape)
                }
                do_convert(result, arr);
                return result
            }
        }
        , {
            "./doConvert.js": 36,
            ndarray: 37
        }],
        36: [function(require, module, exports) {
            module.exports = require("cwise-compiler")({
                args: ["array", "scalar", "index"],
                pre: {
                    body: "{}",
                    args: [],
                    thisVars: [],
                    localVars: []
                },
                body: {
                    body: "{\nvar _inline_1_v=_inline_1_arg1_,_inline_1_i\nfor(_inline_1_i=0;_inline_1_i<_inline_1_arg2_.length-1;++_inline_1_i) {\n_inline_1_v=_inline_1_v[_inline_1_arg2_[_inline_1_i]]\n}\n_inline_1_arg0_=_inline_1_v[_inline_1_arg2_[_inline_1_arg2_.length-1]]\n}",
                    args: [{
                        name: "_inline_1_arg0_",
                        lvalue: true,
                        rvalue: false,
                        count: 1
                    }, {
                        name: "_inline_1_arg1_",
                        lvalue: false,
                        rvalue: true,
                        count: 1
                    }, {
                        name: "_inline_1_arg2_",
                        lvalue: false,
                        rvalue: true,
                        count: 4
                    }],
                    thisVars: [],
                    localVars: ["_inline_1_i", "_inline_1_v"]
                },
                post: {
                    body: "{}",
                    args: [],
                    thisVars: [],
                    localVars: []
                },
                funcName: "convert",
                blockSize: 64
            })
        }
        , {
            "cwise-compiler": 10
        }],
        37: [function(require, module, exports) {
            var iota = require("iota-array");
            var isBuffer = require("is-buffer");
            var hasTypedArrays = typeof Float64Array !== "undefined";
            function compare1st(a, b) {
                return a[0] - b[0]
            }
            function order() {
                var stride = this.stride;
                var terms = new Array(stride.length);
                var i;
                for (i = 0; i < terms.length; ++i) {
                    terms[i] = [Math.abs(stride[i]), i]
                }
                terms.sort(compare1st);
                var result = new Array(terms.length);
                for (i = 0; i < result.length; ++i) {
                    result[i] = terms[i][1]
                }
                return result
            }
            function compileConstructor(dtype, dimension) {
                var className = ["View", dimension, "d", dtype].join("");
                if (dimension < 0) {
                    className = "View_Nil" + dtype
                }
                var useGetters = dtype === "generic";
                if (dimension === -1) {
                    var code = "function " + className + "(a){this.data=a;};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new " + className + "(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_" + className + "(a){return new " + className + "(a);}";
                    var procedure = new Function(code);
                    return procedure()
                } else if (dimension === 0) {
                    var code = "function " + className + "(a,d) {this.data = a;this.offset = d};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function " + className + "_copy() {return new " + className + "(this.data,this.offset)};proto.pick=function " + className + "_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function " + className + "_get(){return " + (useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};proto.set=function " + className + "_set(v){return " + (useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "};return function construct_" + className + "(a,b,c,d){return new " + className + "(a,d)}";
                    var procedure = new Function("TrivialArray",code);
                    return procedure(CACHED_CONSTRUCTORS[dtype][0])
                }
                var code = ["'use strict'"];
                var indices = iota(dimension);
                var args = indices.map(function(i) {
                    return "i" + i
                });
                var index_str = "this.offset+" + indices.map(function(i) {
                    return "this.stride[" + i + "]*i" + i
                }).join("+");
                var shapeArg = indices.map(function(i) {
                    return "b" + i
                }).join(",");
                var strideArg = indices.map(function(i) {
                    return "c" + i
                }).join(",");
                code.push("function " + className + "(a," + shapeArg + "," + strideArg + ",d){this.data=a", "this.shape=[" + shapeArg + "]", "this.stride=[" + strideArg + "]", "this.offset=d|0}", "var proto=" + className + ".prototype", "proto.dtype='" + dtype + "'", "proto.dimension=" + dimension);
                code.push("Object.defineProperty(proto,'size',{get:function " + className + "_size(){return " + indices.map(function(i) {
                    return "this.shape[" + i + "]"
                }).join("*"), "}})");
                if (dimension === 1) {
                    code.push("proto.order=[0]")
                } else {
                    code.push("Object.defineProperty(proto,'order',{get:");
                    if (dimension < 4) {
                        code.push("function " + className + "_order(){");
                        if (dimension === 2) {
                            code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})")
                        } else if (dimension === 3) {
                            code.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})")
                        }
                    } else {
                        code.push("ORDER})")
                    }
                }
                code.push("proto.set=function " + className + "_set(" + args.join(",") + ",v){");
                if (useGetters) {
                    code.push("return this.data.set(" + index_str + ",v)}")
                } else {
                    code.push("return this.data[" + index_str + "]=v}")
                }
                code.push("proto.get=function " + className + "_get(" + args.join(",") + "){");
                if (useGetters) {
                    code.push("return this.data.get(" + index_str + ")}")
                } else {
                    code.push("return this.data[" + index_str + "]}")
                }
                code.push("proto.index=function " + className + "_index(", args.join(), "){return " + index_str + "}");
                code.push("proto.hi=function " + className + "_hi(" + args.join(",") + "){return new " + className + "(this.data," + indices.map(function(i) {
                    return ["(typeof i", i, "!=='number'||i", i, "<0)?this.shape[", i, "]:i", i, "|0"].join("")
                }).join(",") + "," + indices.map(function(i) {
                    return "this.stride[" + i + "]"
                }).join(",") + ",this.offset)}");
                var a_vars = indices.map(function(i) {
                    return "a" + i + "=this.shape[" + i + "]"
                });
                var c_vars = indices.map(function(i) {
                    return "c" + i + "=this.stride[" + i + "]"
                });
                code.push("proto.lo=function " + className + "_lo(" + args.join(",") + "){var b=this.offset,d=0," + a_vars.join(",") + "," + c_vars.join(","));
                for (var i = 0; i < dimension; ++i) {
                    code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){d=i" + i + "|0;b+=c" + i + "*d;a" + i + "-=d}")
                }
                code.push("return new " + className + "(this.data," + indices.map(function(i) {
                    return "a" + i
                }).join(",") + "," + indices.map(function(i) {
                    return "c" + i
                }).join(",") + ",b)}");
                code.push("proto.step=function " + className + "_step(" + args.join(",") + "){var " + indices.map(function(i) {
                    return "a" + i + "=this.shape[" + i + "]"
                }).join(",") + "," + indices.map(function(i) {
                    return "b" + i + "=this.stride[" + i + "]"
                }).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
                for (var i = 0; i < dimension; ++i) {
                    code.push("if(typeof i" + i + "==='number'){d=i" + i + "|0;if(d<0){c+=b" + i + "*(a" + i + "-1);a" + i + "=ceil(-a" + i + "/d)}else{a" + i + "=ceil(a" + i + "/d)}b" + i + "*=d}")
                }
                code.push("return new " + className + "(this.data," + indices.map(function(i) {
                    return "a" + i
                }).join(",") + "," + indices.map(function(i) {
                    return "b" + i
                }).join(",") + ",c)}");
                var tShape = new Array(dimension);
                var tStride = new Array(dimension);
                for (var i = 0; i < dimension; ++i) {
                    tShape[i] = "a[i" + i + "]";
                    tStride[i] = "b[i" + i + "]"
                }
                code.push("proto.transpose=function " + className + "_transpose(" + args + "){" + args.map(function(n, idx) {
                    return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)"
                }).join(";"), "var a=this.shape,b=this.stride;return new " + className + "(this.data," + tShape.join(",") + "," + tStride.join(",") + ",this.offset)}");
                code.push("proto.pick=function " + className + "_pick(" + args + "){var a=[],b=[],c=this.offset");
                for (var i = 0; i < dimension; ++i) {
                    code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){c=(c+this.stride[" + i + "]*i" + i + ")|0}else{a.push(this.shape[" + i + "]);b.push(this.stride[" + i + "])}")
                }
                code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}");
                code.push("return function construct_" + className + "(data,shape,stride,offset){return new " + className + "(data," + indices.map(function(i) {
                    return "shape[" + i + "]"
                }).join(",") + "," + indices.map(function(i) {
                    return "stride[" + i + "]"
                }).join(",") + ",offset)}");
                var procedure = new Function("CTOR_LIST","ORDER",code.join("\n"));
                return procedure(CACHED_CONSTRUCTORS[dtype], order)
            }
            function arrayDType(data) {
                if (isBuffer(data)) {
                    return "buffer"
                }
                if (hasTypedArrays) {
                    switch (Object.prototype.toString.call(data)) {
                    case "[object Float64Array]":
                        return "float64";
                    case "[object Float32Array]":
                        return "float32";
                    case "[object Int8Array]":
                        return "int8";
                    case "[object Int16Array]":
                        return "int16";
                    case "[object Int32Array]":
                        return "int32";
                    case "[object Uint8Array]":
                        return "uint8";
                    case "[object Uint16Array]":
                        return "uint16";
                    case "[object Uint32Array]":
                        return "uint32";
                    case "[object Uint8ClampedArray]":
                        return "uint8_clamped"
                    }
                }
                if (Array.isArray(data)) {
                    return "array"
                }
                return "generic"
            }
            var CACHED_CONSTRUCTORS = {
                float32: [],
                float64: [],
                int8: [],
                int16: [],
                int32: [],
                uint8: [],
                uint16: [],
                uint32: [],
                array: [],
                uint8_clamped: [],
                buffer: [],
                generic: []
            };
            (function() {
                for (var id in CACHED_CONSTRUCTORS) {
                    CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1))
                }
            }
            );
            function wrappedNDArrayCtor(data, shape, stride, offset) {
                if (data === undefined) {
                    var ctor = CACHED_CONSTRUCTORS.array[0];
                    return ctor([])
                } else if (typeof data === "number") {
                    data = [data]
                }
                if (shape === undefined) {
                    shape = [data.length]
                }
                var d = shape.length;
                if (stride === undefined) {
                    stride = new Array(d);
                    for (var i = d - 1, sz = 1; i >= 0; --i) {
                        stride[i] = sz;
                        sz *= shape[i]
                    }
                }
                if (offset === undefined) {
                    offset = 0;
                    for (var i = 0; i < d; ++i) {
                        if (stride[i] < 0) {
                            offset -= (shape[i] - 1) * stride[i]
                        }
                    }
                }
                var dtype = arrayDType(data);
                var ctor_list = CACHED_CONSTRUCTORS[dtype];
                while (ctor_list.length <= d + 1) {
                    ctor_list.push(compileConstructor(dtype, ctor_list.length - 1))
                }
                var ctor = ctor_list[d + 1];
                return ctor(data, shape, stride, offset)
            }
            module.exports = wrappedNDArrayCtor
        }
        , {
            "iota-array": 27,
            "is-buffer": 28
        }],
        38: [function(require, module, exports) {
            function GifWriter(buf, width, height, gopts) {
                var p = 0;
                var gopts = gopts === undefined ? {} : gopts;
                var loop_count = gopts.loop === undefined ? null : gopts.loop;
                var global_palette = gopts.palette === undefined ? null : gopts.palette;
                if (width <= 0 || height <= 0 || width > 65535 || height > 65535)
                    throw "Width/Height invalid.";
                function check_palette_and_num_colors(palette) {
                    var num_colors = palette.length;
                    if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1)
                        throw "Invalid code/color length, must be power of 2 and 2 .. 256.";
                    return num_colors
                }
                buf[p++] = 71;
                buf[p++] = 73;
                buf[p++] = 70;
                buf[p++] = 56;
                buf[p++] = 57;
                buf[p++] = 97;
                var gp_num_colors_pow2 = 0;
                var background = 0;
                if (global_palette !== null) {
                    var gp_num_colors = check_palette_and_num_colors(global_palette);
                    while (gp_num_colors >>= 1)
                        ++gp_num_colors_pow2;
                    gp_num_colors = 1 << gp_num_colors_pow2;
                    --gp_num_colors_pow2;
                    if (gopts.background !== undefined) {
                        background = gopts.background;
                        if (background >= gp_num_colors)
                            throw "Background index out of range.";
                        if (background === 0)
                            throw "Background index explicitly passed as 0."
                    }
                }
                buf[p++] = width & 255;
                buf[p++] = width >> 8 & 255;
                buf[p++] = height & 255;
                buf[p++] = height >> 8 & 255;
                buf[p++] = (global_palette !== null ? 128 : 0) | gp_num_colors_pow2;
                buf[p++] = background;
                buf[p++] = 0;
                if (global_palette !== null) {
                    for (var i = 0, il = global_palette.length; i < il; ++i) {
                        var rgb = global_palette[i];
                        buf[p++] = rgb >> 16 & 255;
                        buf[p++] = rgb >> 8 & 255;
                        buf[p++] = rgb & 255
                    }
                }
                if (loop_count !== null) {
                    if (loop_count < 0 || loop_count > 65535)
                        throw "Loop count invalid.";
                    buf[p++] = 33;
                    buf[p++] = 255;
                    buf[p++] = 11;
                    buf[p++] = 78;
                    buf[p++] = 69;
                    buf[p++] = 84;
                    buf[p++] = 83;
                    buf[p++] = 67;
                    buf[p++] = 65;
                    buf[p++] = 80;
                    buf[p++] = 69;
                    buf[p++] = 50;
                    buf[p++] = 46;
                    buf[p++] = 48;
                    buf[p++] = 3;
                    buf[p++] = 1;
                    buf[p++] = loop_count & 255;
                    buf[p++] = loop_count >> 8 & 255;
                    buf[p++] = 0
                }
                var ended = false;
                this.addFrame = function(x, y, w, h, indexed_pixels, opts) {
                    if (ended === true) {
                        --p;
                        ended = false
                    }
                    opts = opts === undefined ? {} : opts;
                    if (x < 0 || y < 0 || x > 65535 || y > 65535)
                        throw "x/y invalid.";
                    if (w <= 0 || h <= 0 || w > 65535 || h > 65535)
                        throw "Width/Height invalid.";
                    if (indexed_pixels.length < w * h)
                        throw "Not enough pixels for the frame size.";
                    var using_local_palette = true;
                    var palette = opts.palette;
                    if (palette === undefined || palette === null) {
                        using_local_palette = false;
                        palette = global_palette
                    }
                    if (palette === undefined || palette === null)
                        throw "Must supply either a local or global palette.";
                    var num_colors = check_palette_and_num_colors(palette);
                    var min_code_size = 0;
                    while (num_colors >>= 1)
                        ++min_code_size;
                    num_colors = 1 << min_code_size;
                    var delay = opts.delay === undefined ? 0 : opts.delay;
                    var disposal = opts.disposal === undefined ? 0 : opts.disposal;
                    if (disposal < 0 || disposal > 3)
                        throw "Disposal out of range.";
                    var use_transparency = false;
                    var transparent_index = 0;
                    if (opts.transparent !== undefined && opts.transparent !== null) {
                        use_transparency = true;
                        transparent_index = opts.transparent;
                        if (transparent_index < 0 || transparent_index >= num_colors)
                            throw "Transparent color index."
                    }
                    if (disposal !== 0 || use_transparency || delay !== 0) {
                        buf[p++] = 33;
                        buf[p++] = 249;
                        buf[p++] = 4;
                        buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
                        buf[p++] = delay & 255;
                        buf[p++] = delay >> 8 & 255;
                        buf[p++] = transparent_index;
                        buf[p++] = 0
                    }
                    buf[p++] = 44;
                    buf[p++] = x & 255;
                    buf[p++] = x >> 8 & 255;
                    buf[p++] = y & 255;
                    buf[p++] = y >> 8 & 255;
                    buf[p++] = w & 255;
                    buf[p++] = w >> 8 & 255;
                    buf[p++] = h & 255;
                    buf[p++] = h >> 8 & 255;
                    buf[p++] = using_local_palette === true ? 128 | min_code_size - 1 : 0;
                    if (using_local_palette === true) {
                        for (var i = 0, il = palette.length; i < il; ++i) {
                            var rgb = palette[i];
                            buf[p++] = rgb >> 16 & 255;
                            buf[p++] = rgb >> 8 & 255;
                            buf[p++] = rgb & 255
                        }
                    }
                    p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels)
                }
                ;
                this.end = function() {
                    if (ended === false) {
                        buf[p++] = 59;
                        ended = true
                    }
                    return p
                }
            }
            function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
                buf[p++] = min_code_size;
                var cur_subblock = p++;
                var clear_code = 1 << min_code_size;
                var code_mask = clear_code - 1;
                var eoi_code = clear_code + 1;
                var next_code = eoi_code + 1;
                var cur_code_size = min_code_size + 1;
                var cur_shift = 0;
                var cur = 0;
                function emit_bytes_to_buffer(bit_block_size) {
                    while (cur_shift >= bit_block_size) {
                        buf[p++] = cur & 255;
                        cur >>= 8;
                        cur_shift -= 8;
                        if (p === cur_subblock + 256) {
                            buf[cur_subblock] = 255;
                            cur_subblock = p++
                        }
                    }
                }
                function emit_code(c) {
                    cur |= c << cur_shift;
                    cur_shift += cur_code_size;
                    emit_bytes_to_buffer(8)
                }
                var ib_code = index_stream[0] & code_mask;
                var code_table = {};
                emit_code(clear_code);
                for (var i = 1, il = index_stream.length; i < il; ++i) {
                    var k = index_stream[i] & code_mask;
                    var cur_key = ib_code << 8 | k;
                    var cur_code = code_table[cur_key];
                    if (cur_code === undefined) {
                        cur |= ib_code << cur_shift;
                        cur_shift += cur_code_size;
                        while (cur_shift >= 8) {
                            buf[p++] = cur & 255;
                            cur >>= 8;
                            cur_shift -= 8;
                            if (p === cur_subblock + 256) {
                                buf[cur_subblock] = 255;
                                cur_subblock = p++
                            }
                        }
                        if (next_code === 4096) {
                            emit_code(clear_code);
                            next_code = eoi_code + 1;
                            cur_code_size = min_code_size + 1;
                            code_table = {}
                        } else {
                            if (next_code >= 1 << cur_code_size)
                                ++cur_code_size;
                            code_table[cur_key] = next_code++
                        }
                        ib_code = k
                    } else {
                        ib_code = cur_code
                    }
                }
                emit_code(ib_code);
                emit_code(eoi_code);
                emit_bytes_to_buffer(1);
                if (cur_subblock + 1 === p) {
                    buf[cur_subblock] = 0
                } else {
                    buf[cur_subblock] = p - cur_subblock - 1;
                    buf[p++] = 0
                }
                return p
            }
            function GifReader(buf) {
                var p = 0;
                if (buf[p++] !== 71 || buf[p++] !== 73 || buf[p++] !== 70 || buf[p++] !== 56 || (buf[p++] + 1 & 253) !== 56 || buf[p++] !== 97) {
                    throw "Invalid GIF 87a/89a header."
                }
                var width = buf[p++] | buf[p++] << 8;
                var height = buf[p++] | buf[p++] << 8;
                var pf0 = buf[p++];
                var global_palette_flag = pf0 >> 7;
                var num_global_colors_pow2 = pf0 & 7;
                var num_global_colors = 1 << num_global_colors_pow2 + 1;
                var background = buf[p++];
                buf[p++];
                var global_palette_offset = null;
                if (global_palette_flag) {
                    global_palette_offset = p;
                    p += num_global_colors * 3
                }
                var no_eof = true;
                var frames = [];
                var delay = 0;
                var transparent_index = null;
                var disposal = 0;
                var loop_count = null;
                this.width = width;
                this.height = height;
                while (no_eof && p < buf.length) {
                    switch (buf[p++]) {
                    case 33:
                        switch (buf[p++]) {
                        case 255:
                            if (buf[p] !== 11 || buf[p + 1] == 78 && buf[p + 2] == 69 && buf[p + 3] == 84 && buf[p + 4] == 83 && buf[p + 5] == 67 && buf[p + 6] == 65 && buf[p + 7] == 80 && buf[p + 8] == 69 && buf[p + 9] == 50 && buf[p + 10] == 46 && buf[p + 11] == 48 && buf[p + 12] == 3 && buf[p + 13] == 1 && buf[p + 16] == 0) {
                                p += 14;
                                loop_count = buf[p++] | buf[p++] << 8;
                                p++
                            } else {
                                p += 12;
                                while (true) {
                                    var block_size = buf[p++];
                                    if (block_size === 0)
                                        break;
                                    p += block_size
                                }
                            }
                            break;
                        case 249:
                            if (buf[p++] !== 4 || buf[p + 4] !== 0)
                                throw "Invalid graphics extension block.";
                            var pf1 = buf[p++];
                            delay = buf[p++] | buf[p++] << 8;
                            transparent_index = buf[p++];
                            if ((pf1 & 1) === 0)
                                transparent_index = null;
                            disposal = pf1 >> 2 & 7;
                            p++;
                            break;
                        case 254:
                            while (true) {
                                var block_size = buf[p++];
                                if (block_size === 0)
                                    break;
                                p += block_size
                            }
                            break;
                        default:
                            throw "Unknown graphic control label: 0x" + buf[p - 1].toString(16)
                        }
                        break;
                    case 44:
                        var x = buf[p++] | buf[p++] << 8;
                        var y = buf[p++] | buf[p++] << 8;
                        var w = buf[p++] | buf[p++] << 8;
                        var h = buf[p++] | buf[p++] << 8;
                        var pf2 = buf[p++];
                        var local_palette_flag = pf2 >> 7;
                        var interlace_flag = pf2 >> 6 & 1;
                        var num_local_colors_pow2 = pf2 & 7;
                        var num_local_colors = 1 << num_local_colors_pow2 + 1;
                        var palette_offset = global_palette_offset;
                        var has_local_palette = false;
                        if (local_palette_flag) {
                            var has_local_palette = true;
                            palette_offset = p;
                            p += num_local_colors * 3
                        }
                        var data_offset = p;
                        p++;
                        while (true) {
                            var block_size = buf[p++];
                            if (block_size === 0)
                                break;
                            p += block_size
                        }
                        frames.push({
                            x: x,
                            y: y,
                            width: w,
                            height: h,
                            has_local_palette: has_local_palette,
                            palette_offset: palette_offset,
                            data_offset: data_offset,
                            data_length: p - data_offset,
                            transparent_index: transparent_index,
                            interlaced: !!interlace_flag,
                            delay: delay,
                            disposal: disposal
                        });
                        break;
                    case 59:
                        no_eof = false;
                        break;
                    default:
                        throw "Unknown gif block: 0x" + buf[p - 1].toString(16);
                        break
                    }
                }
                this.numFrames = function() {
                    return frames.length
                }
                ;
                this.loopCount = function() {
                    return loop_count
                }
                ;
                this.frameInfo = function(frame_num) {
                    if (frame_num < 0 || frame_num >= frames.length)
                        throw "Frame index out of range.";
                    return frames[frame_num]
                }
                ;
                this.decodeAndBlitFrameBGRA = function(frame_num, pixels) {
                    var frame = this.frameInfo(frame_num);
                    var num_pixels = frame.width * frame.height;
                    var index_stream = new Uint8Array(num_pixels);
                    GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);
                    var palette_offset = frame.palette_offset;
                    var trans = frame.transparent_index;
                    if (trans === null)
                        trans = 256;
                    var framewidth = frame.width;
                    var framestride = width - framewidth;
                    var xleft = framewidth;
                    var opbeg = (frame.y * width + frame.x) * 4;
                    var opend = ((frame.y + frame.height) * width + frame.x) * 4;
                    var op = opbeg;
                    var scanstride = framestride * 4;
                    if (frame.interlaced === true) {
                        scanstride += width * 4 * 7
                    }
                    var interlaceskip = 8;
                    for (var i = 0, il = index_stream.length; i < il; ++i) {
                        var index = index_stream[i];
                        if (xleft === 0) {
                            op += scanstride;
                            xleft = framewidth;
                            if (op >= opend) {
                                scanstride = framestride * 4 + width * 4 * (interlaceskip - 1);
                                op = opbeg + (framewidth + framestride) * (interlaceskip << 1);
                                interlaceskip >>= 1
                            }
                        }
                        if (index === trans) {
                            op += 4
                        } else {
                            var r = buf[palette_offset + index * 3];
                            var g = buf[palette_offset + index * 3 + 1];
                            var b = buf[palette_offset + index * 3 + 2];
                            pixels[op++] = b;
                            pixels[op++] = g;
                            pixels[op++] = r;
                            pixels[op++] = 255
                        }
                        --xleft
                    }
                }
                ;
                this.decodeAndBlitFrameRGBA = function(frame_num, pixels) {
                    var frame = this.frameInfo(frame_num);
                    var num_pixels = frame.width * frame.height;
                    var index_stream = new Uint8Array(num_pixels);
                    GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);
                    var palette_offset = frame.palette_offset;
                    var trans = frame.transparent_index;
                    if (trans === null)
                        trans = 256;
                    var framewidth = frame.width;
                    var framestride = width - framewidth;
                    var xleft = framewidth;
                    var opbeg = (frame.y * width + frame.x) * 4;
                    var opend = ((frame.y + frame.height) * width + frame.x) * 4;
                    var op = opbeg;
                    var scanstride = framestride * 4;
                    if (frame.interlaced === true) {
                        scanstride += width * 4 * 7
                    }
                    var interlaceskip = 8;
                    for (var i = 0, il = index_stream.length; i < il; ++i) {
                        var index = index_stream[i];
                        if (xleft === 0) {
                            op += scanstride;
                            xleft = framewidth;
                            if (op >= opend) {
                                scanstride = framestride * 4 + width * 4 * (interlaceskip - 1);
                                op = opbeg + (framewidth + framestride) * (interlaceskip << 1);
                                interlaceskip >>= 1
                            }
                        }
                        if (index === trans) {
                            op += 4
                        } else {
                            var r = buf[palette_offset + index * 3];
                            var g = buf[palette_offset + index * 3 + 1];
                            var b = buf[palette_offset + index * 3 + 2];
                            pixels[op++] = r;
                            pixels[op++] = g;
                            pixels[op++] = b;
                            pixels[op++] = 255
                        }
                        --xleft
                    }
                }
            }
            function GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {
                var min_code_size = code_stream[p++];
                var clear_code = 1 << min_code_size;
                var eoi_code = clear_code + 1;
                var next_code = eoi_code + 1;
                var cur_code_size = min_code_size + 1;
                var code_mask = (1 << cur_code_size) - 1;
                var cur_shift = 0;
                var cur = 0;
                var op = 0;
                var subblock_size = code_stream[p++];
                var code_table = new Int32Array(4096);
                var prev_code = null;
                while (true) {
                    while (cur_shift < 16) {
                        if (subblock_size === 0)
                            break;
                        cur |= code_stream[p++] << cur_shift;
                        cur_shift += 8;
                        if (subblock_size === 1) {
                            subblock_size = code_stream[p++]
                        } else {
                            --subblock_size
                        }
                    }
                    if (cur_shift < cur_code_size)
                        break;
                    var code = cur & code_mask;
                    cur >>= cur_code_size;
                    cur_shift -= cur_code_size;
                    if (code === clear_code) {
                        next_code = eoi_code + 1;
                        cur_code_size = min_code_size + 1;
                        code_mask = (1 << cur_code_size) - 1;
                        prev_code = null;
                        continue
                    } else if (code === eoi_code) {
                        break
                    }
                    var chase_code = code < next_code ? code : prev_code;
                    var chase_length = 0;
                    var chase = chase_code;
                    while (chase > clear_code) {
                        chase = code_table[chase] >> 8;
                        ++chase_length
                    }
                    var k = chase;
                    var op_end = op + chase_length + (chase_code !== code ? 1 : 0);
                    if (op_end > output_length) {
                        console.log("Warning, gif stream longer than expected.");
                        return
                    }
                    output[op++] = k;
                    op += chase_length;
                    var b = op;
                    if (chase_code !== code)
                        output[op++] = k;
                    chase = chase_code;
                    while (chase_length--) {
                        chase = code_table[chase];
                        output[--b] = chase & 255;
                        chase >>= 8
                    }
                    if (prev_code !== null && next_code < 4096) {
                        code_table[next_code++] = prev_code << 8 | k;
                        if (next_code >= code_mask + 1 && cur_code_size < 12) {
                            ++cur_code_size;
                            code_mask = code_mask << 1 | 1
                        }
                    }
                    prev_code = code
                }
                if (op !== output_length) {
                    console.log("Warning, gif stream shorter than expected.")
                }
                return output
            }
            try {
                exports.GifWriter = GifWriter;
                exports.GifReader = GifReader
            } catch (e) {}
        }
        , {}],
        39: [function(require, module, exports) {
            "use strict";
            var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
            function _has(obj, key) {
                return Object.prototype.hasOwnProperty.call(obj, key)
            }
            exports.assign = function(obj) {
                var sources = Array.prototype.slice.call(arguments, 1);
                while (sources.length) {
                    var source = sources.shift();
                    if (!source) {
                        continue
                    }
                    if (typeof source !== "object") {
                        throw new TypeError(source + "must be non-object")
                    }
                    for (var p in source) {
                        if (_has(source, p)) {
                            obj[p] = source[p]
                        }
                    }
                }
                return obj
            }
            ;
            exports.shrinkBuf = function(buf, size) {
                if (buf.length === size) {
                    return buf
                }
                if (buf.subarray) {
                    return buf.subarray(0, size)
                }
                buf.length = size;
                return buf
            }
            ;
            var fnTyped = {
                arraySet: function(dest, src, src_offs, len, dest_offs) {
                    if (src.subarray && dest.subarray) {
                        dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
                        return
                    }
                    for (var i = 0; i < len; i++) {
                        dest[dest_offs + i] = src[src_offs + i]
                    }
                },
                flattenChunks: function(chunks) {
                    var i, l, len, pos, chunk, result;
                    len = 0;
                    for (i = 0,
                    l = chunks.length; i < l; i++) {
                        len += chunks[i].length
                    }
                    result = new Uint8Array(len);
                    pos = 0;
                    for (i = 0,
                    l = chunks.length; i < l; i++) {
                        chunk = chunks[i];
                        result.set(chunk, pos);
                        pos += chunk.length
                    }
                    return result
                }
            };
            var fnUntyped = {
                arraySet: function(dest, src, src_offs, len, dest_offs) {
                    for (var i = 0; i < len; i++) {
                        dest[dest_offs + i] = src[src_offs + i]
                    }
                },
                flattenChunks: function(chunks) {
                    return [].concat.apply([], chunks)
                }
            };
            exports.setTyped = function(on) {
                if (on) {
                    exports.Buf8 = Uint8Array;
                    exports.Buf16 = Uint16Array;
                    exports.Buf32 = Int32Array;
                    exports.assign(exports, fnTyped)
                } else {
                    exports.Buf8 = Array;
                    exports.Buf16 = Array;
                    exports.Buf32 = Array;
                    exports.assign(exports, fnUntyped)
                }
            }
            ;
            exports.setTyped(TYPED_OK)
        }
        , {}],
        40: [function(require, module, exports) {
            "use strict";
            function adler32(adler, buf, len, pos) {
                var s1 = adler & 65535 | 0
                  , s2 = adler >>> 16 & 65535 | 0
                  , n = 0;
                while (len !== 0) {
                    n = len > 2e3 ? 2e3 : len;
                    len -= n;
                    do {
                        s1 = s1 + buf[pos++] | 0;
                        s2 = s2 + s1 | 0
                    } while (--n);
                    s1 %= 65521;
                    s2 %= 65521
                }
                return s1 | s2 << 16 | 0
            }
            module.exports = adler32
        }
        , {}],
        41: [function(require, module, exports) {
            "use strict";
            module.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }
        , {}],
        42: [function(require, module, exports) {
            "use strict";
            function makeTable() {
                var c, table = [];
                for (var n = 0; n < 256; n++) {
                    c = n;
                    for (var k = 0; k < 8; k++) {
                        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1
                    }
                    table[n] = c
                }
                return table
            }
            var crcTable = makeTable();
            function crc32(crc, buf, len, pos) {
                var t = crcTable
                  , end = pos + len;
                crc ^= -1;
                for (var i = pos; i < end; i++) {
                    crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255]
                }
                return crc ^ -1
            }
            module.exports = crc32
        }
        , {}],
        43: [function(require, module, exports) {
            "use strict";
            var utils = require("../utils/common");
            var trees = require("./trees");
            var adler32 = require("./adler32");
            var crc32 = require("./crc32");
            var msg = require("./messages");
            var Z_NO_FLUSH = 0;
            var Z_PARTIAL_FLUSH = 1;
            var Z_FULL_FLUSH = 3;
            var Z_FINISH = 4;
            var Z_BLOCK = 5;
            var Z_OK = 0;
            var Z_STREAM_END = 1;
            var Z_STREAM_ERROR = -2;
            var Z_DATA_ERROR = -3;
            var Z_BUF_ERROR = -5;
            var Z_DEFAULT_COMPRESSION = -1;
            var Z_FILTERED = 1;
            var Z_HUFFMAN_ONLY = 2;
            var Z_RLE = 3;
            var Z_FIXED = 4;
            var Z_DEFAULT_STRATEGY = 0;
            var Z_UNKNOWN = 2;
            var Z_DEFLATED = 8;
            var MAX_MEM_LEVEL = 9;
            var MAX_WBITS = 15;
            var DEF_MEM_LEVEL = 8;
            var LENGTH_CODES = 29;
            var LITERALS = 256;
            var L_CODES = LITERALS + 1 + LENGTH_CODES;
            var D_CODES = 30;
            var BL_CODES = 19;
            var HEAP_SIZE = 2 * L_CODES + 1;
            var MAX_BITS = 15;
            var MIN_MATCH = 3;
            var MAX_MATCH = 258;
            var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
            var PRESET_DICT = 32;
            var INIT_STATE = 42;
            var EXTRA_STATE = 69;
            var NAME_STATE = 73;
            var COMMENT_STATE = 91;
            var HCRC_STATE = 103;
            var BUSY_STATE = 113;
            var FINISH_STATE = 666;
            var BS_NEED_MORE = 1;
            var BS_BLOCK_DONE = 2;
            var BS_FINISH_STARTED = 3;
            var BS_FINISH_DONE = 4;
            var OS_CODE = 3;
            function err(strm, errorCode) {
                strm.msg = msg[errorCode];
                return errorCode
            }
            function rank(f) {
                return (f << 1) - (f > 4 ? 9 : 0)
            }
            function zero(buf) {
                var len = buf.length;
                while (--len >= 0) {
                    buf[len] = 0
                }
            }
            function flush_pending(strm) {
                var s = strm.state;
                var len = s.pending;
                if (len > strm.avail_out) {
                    len = strm.avail_out
                }
                if (len === 0) {
                    return
                }
                utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
                strm.next_out += len;
                s.pending_out += len;
                strm.total_out += len;
                strm.avail_out -= len;
                s.pending -= len;
                if (s.pending === 0) {
                    s.pending_out = 0
                }
            }
            function flush_block_only(s, last) {
                trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
                s.block_start = s.strstart;
                flush_pending(s.strm)
            }
            function put_byte(s, b) {
                s.pending_buf[s.pending++] = b
            }
            function putShortMSB(s, b) {
                s.pending_buf[s.pending++] = b >>> 8 & 255;
                s.pending_buf[s.pending++] = b & 255
            }
            function read_buf(strm, buf, start, size) {
                var len = strm.avail_in;
                if (len > size) {
                    len = size
                }
                if (len === 0) {
                    return 0
                }
                strm.avail_in -= len;
                utils.arraySet(buf, strm.input, strm.next_in, len, start);
                if (strm.state.wrap === 1) {
                    strm.adler = adler32(strm.adler, buf, len, start)
                } else if (strm.state.wrap === 2) {
                    strm.adler = crc32(strm.adler, buf, len, start)
                }
                strm.next_in += len;
                strm.total_in += len;
                return len
            }
            function longest_match(s, cur_match) {
                var chain_length = s.max_chain_length;
                var scan = s.strstart;
                var match;
                var len;
                var best_len = s.prev_length;
                var nice_match = s.nice_match;
                var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
                var _win = s.window;
                var wmask = s.w_mask;
                var prev = s.prev;
                var strend = s.strstart + MAX_MATCH;
                var scan_end1 = _win[scan + best_len - 1];
                var scan_end = _win[scan + best_len];
                if (s.prev_length >= s.good_match) {
                    chain_length >>= 2
                }
                if (nice_match > s.lookahead) {
                    nice_match = s.lookahead
                }
                do {
                    match = cur_match;
                    if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
                        continue
                    }
                    scan += 2;
                    match++;
                    do {} while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
                    len = MAX_MATCH - (strend - scan);
                    scan = strend - MAX_MATCH;
                    if (len > best_len) {
                        s.match_start = cur_match;
                        best_len = len;
                        if (len >= nice_match) {
                            break
                        }
                        scan_end1 = _win[scan + best_len - 1];
                        scan_end = _win[scan + best_len]
                    }
                } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
                if (best_len <= s.lookahead) {
                    return best_len
                }
                return s.lookahead
            }
            function fill_window(s) {
                var _w_size = s.w_size;
                var p, n, m, more, str;
                do {
                    more = s.window_size - s.lookahead - s.strstart;
                    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
                        utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
                        s.match_start -= _w_size;
                        s.strstart -= _w_size;
                        s.block_start -= _w_size;
                        n = s.hash_size;
                        p = n;
                        do {
                            m = s.head[--p];
                            s.head[p] = m >= _w_size ? m - _w_size : 0
                        } while (--n);
                        n = _w_size;
                        p = n;
                        do {
                            m = s.prev[--p];
                            s.prev[p] = m >= _w_size ? m - _w_size : 0
                        } while (--n);
                        more += _w_size
                    }
                    if (s.strm.avail_in === 0) {
                        break
                    }
                    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
                    s.lookahead += n;
                    if (s.lookahead + s.insert >= MIN_MATCH) {
                        str = s.strstart - s.insert;
                        s.ins_h = s.window[str];
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
                        while (s.insert) {
                            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
                            s.prev[str & s.w_mask] = s.head[s.ins_h];
                            s.head[s.ins_h] = str;
                            str++;
                            s.insert--;
                            if (s.lookahead + s.insert < MIN_MATCH) {
                                break
                            }
                        }
                    }
                } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0)
            }
            function deflate_stored(s, flush) {
                var max_block_size = 65535;
                if (max_block_size > s.pending_buf_size - 5) {
                    max_block_size = s.pending_buf_size - 5
                }
                for (; ; ) {
                    if (s.lookahead <= 1) {
                        fill_window(s);
                        if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE
                        }
                        if (s.lookahead === 0) {
                            break
                        }
                    }
                    s.strstart += s.lookahead;
                    s.lookahead = 0;
                    var max_start = s.block_start + max_block_size;
                    if (s.strstart === 0 || s.strstart >= max_start) {
                        s.lookahead = s.strstart - max_start;
                        s.strstart = max_start;
                        flush_block_only(s, false);
                        if (s.strm.avail_out === 0) {
                            return BS_NEED_MORE
                        }
                    }
                    if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
                        flush_block_only(s, false);
                        if (s.strm.avail_out === 0) {
                            return BS_NEED_MORE
                        }
                    }
                }
                s.insert = 0;
                if (flush === Z_FINISH) {
                    flush_block_only(s, true);
                    if (s.strm.avail_out === 0) {
                        return BS_FINISH_STARTED
                    }
                    return BS_FINISH_DONE
                }
                if (s.strstart > s.block_start) {
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                        return BS_NEED_MORE
                    }
                }
                return BS_NEED_MORE
            }
            function deflate_fast(s, flush) {
                var hash_head;
                var bflush;
                for (; ; ) {
                    if (s.lookahead < MIN_LOOKAHEAD) {
                        fill_window(s);
                        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE
                        }
                        if (s.lookahead === 0) {
                            break
                        }
                    }
                    hash_head = 0;
                    if (s.lookahead >= MIN_MATCH) {
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart
                    }
                    if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
                        s.match_length = longest_match(s, hash_head)
                    }
                    if (s.match_length >= MIN_MATCH) {
                        bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
                        s.lookahead -= s.match_length;
                        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
                            s.match_length--;
                            do {
                                s.strstart++;
                                s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                                s.head[s.ins_h] = s.strstart
                            } while (--s.match_length !== 0);
                            s.strstart++
                        } else {
                            s.strstart += s.match_length;
                            s.match_length = 0;
                            s.ins_h = s.window[s.strstart];
                            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask
                        }
                    } else {
                        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
                        s.lookahead--;
                        s.strstart++
                    }
                    if (bflush) {
                        flush_block_only(s, false);
                        if (s.strm.avail_out === 0) {
                            return BS_NEED_MORE
                        }
                    }
                }
                s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
                if (flush === Z_FINISH) {
                    flush_block_only(s, true);
                    if (s.strm.avail_out === 0) {
                        return BS_FINISH_STARTED
                    }
                    return BS_FINISH_DONE
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                        return BS_NEED_MORE
                    }
                }
                return BS_BLOCK_DONE
            }
            function deflate_slow(s, flush) {
                var hash_head;
                var bflush;
                var max_insert;
                for (; ; ) {
                    if (s.lookahead < MIN_LOOKAHEAD) {
                        fill_window(s);
                        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE
                        }
                        if (s.lookahead === 0) {
                            break
                        }
                    }
                    hash_head = 0;
                    if (s.lookahead >= MIN_MATCH) {
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart
                    }
                    s.prev_length = s.match_length;
                    s.prev_match = s.match_start;
                    s.match_length = MIN_MATCH - 1;
                    if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
                        s.match_length = longest_match(s, hash_head);
                        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
                            s.match_length = MIN_MATCH - 1
                        }
                    }
                    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
                        max_insert = s.strstart + s.lookahead - MIN_MATCH;
                        bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
                        s.lookahead -= s.prev_length - 1;
                        s.prev_length -= 2;
                        do {
                            if (++s.strstart <= max_insert) {
                                s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                                s.head[s.ins_h] = s.strstart
                            }
                        } while (--s.prev_length !== 0);
                        s.match_available = 0;
                        s.match_length = MIN_MATCH - 1;
                        s.strstart++;
                        if (bflush) {
                            flush_block_only(s, false);
                            if (s.strm.avail_out === 0) {
                                return BS_NEED_MORE
                            }
                        }
                    } else if (s.match_available) {
                        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
                        if (bflush) {
                            flush_block_only(s, false)
                        }
                        s.strstart++;
                        s.lookahead--;
                        if (s.strm.avail_out === 0) {
                            return BS_NEED_MORE
                        }
                    } else {
                        s.match_available = 1;
                        s.strstart++;
                        s.lookahead--
                    }
                }
                if (s.match_available) {
                    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
                    s.match_available = 0
                }
                s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
                if (flush === Z_FINISH) {
                    flush_block_only(s, true);
                    if (s.strm.avail_out === 0) {
                        return BS_FINISH_STARTED
                    }
                    return BS_FINISH_DONE
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                        return BS_NEED_MORE
                    }
                }
                return BS_BLOCK_DONE
            }
            function deflate_rle(s, flush) {
                var bflush;
                var prev;
                var scan, strend;
                var _win = s.window;
                for (; ; ) {
                    if (s.lookahead <= MAX_MATCH) {
                        fill_window(s);
                        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE
                        }
                        if (s.lookahead === 0) {
                            break
                        }
                    }
                    s.match_length = 0;
                    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
                        scan = s.strstart - 1;
                        prev = _win[scan];
                        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                            strend = s.strstart + MAX_MATCH;
                            do {} while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
                            s.match_length = MAX_MATCH - (strend - scan);
                            if (s.match_length > s.lookahead) {
                                s.match_length = s.lookahead
                            }
                        }
                    }
                    if (s.match_length >= MIN_MATCH) {
                        bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
                        s.lookahead -= s.match_length;
                        s.strstart += s.match_length;
                        s.match_length = 0
                    } else {
                        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
                        s.lookahead--;
                        s.strstart++
                    }
                    if (bflush) {
                        flush_block_only(s, false);
                        if (s.strm.avail_out === 0) {
                            return BS_NEED_MORE
                        }
                    }
                }
                s.insert = 0;
                if (flush === Z_FINISH) {
                    flush_block_only(s, true);
                    if (s.strm.avail_out === 0) {
                        return BS_FINISH_STARTED
                    }
                    return BS_FINISH_DONE
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                        return BS_NEED_MORE
                    }
                }
                return BS_BLOCK_DONE
            }
            function deflate_huff(s, flush) {
                var bflush;
                for (; ; ) {
                    if (s.lookahead === 0) {
                        fill_window(s);
                        if (s.lookahead === 0) {
                            if (flush === Z_NO_FLUSH) {
                                return BS_NEED_MORE
                            }
                            break
                        }
                    }
                    s.match_length = 0;
                    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
                    s.lookahead--;
                    s.strstart++;
                    if (bflush) {
                        flush_block_only(s, false);
                        if (s.strm.avail_out === 0) {
                            return BS_NEED_MORE
                        }
                    }
                }
                s.insert = 0;
                if (flush === Z_FINISH) {
                    flush_block_only(s, true);
                    if (s.strm.avail_out === 0) {
                        return BS_FINISH_STARTED
                    }
                    return BS_FINISH_DONE
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                        return BS_NEED_MORE
                    }
                }
                return BS_BLOCK_DONE
            }
            function Config(good_length, max_lazy, nice_length, max_chain, func) {
                this.good_length = good_length;
                this.max_lazy = max_lazy;
                this.nice_length = nice_length;
                this.max_chain = max_chain;
                this.func = func
            }
            var configuration_table;
            configuration_table = [new Config(0,0,0,0,deflate_stored), new Config(4,4,8,4,deflate_fast), new Config(4,5,16,8,deflate_fast), new Config(4,6,32,32,deflate_fast), new Config(4,4,16,16,deflate_slow), new Config(8,16,32,32,deflate_slow), new Config(8,16,128,128,deflate_slow), new Config(8,32,128,256,deflate_slow), new Config(32,128,258,1024,deflate_slow), new Config(32,258,258,4096,deflate_slow)];
            function lm_init(s) {
                s.window_size = 2 * s.w_size;
                zero(s.head);
                s.max_lazy_match = configuration_table[s.level].max_lazy;
                s.good_match = configuration_table[s.level].good_length;
                s.nice_match = configuration_table[s.level].nice_length;
                s.max_chain_length = configuration_table[s.level].max_chain;
                s.strstart = 0;
                s.block_start = 0;
                s.lookahead = 0;
                s.insert = 0;
                s.match_length = s.prev_length = MIN_MATCH - 1;
                s.match_available = 0;
                s.ins_h = 0
            }
            function DeflateState() {
                this.strm = null;
                this.status = 0;
                this.pending_buf = null;
                this.pending_buf_size = 0;
                this.pending_out = 0;
                this.pending = 0;
                this.wrap = 0;
                this.gzhead = null;
                this.gzindex = 0;
                this.method = Z_DEFLATED;
                this.last_flush = -1;
                this.w_size = 0;
                this.w_bits = 0;
                this.w_mask = 0;
                this.window = null;
                this.window_size = 0;
                this.prev = null;
                this.head = null;
                this.ins_h = 0;
                this.hash_size = 0;
                this.hash_bits = 0;
                this.hash_mask = 0;
                this.hash_shift = 0;
                this.block_start = 0;
                this.match_length = 0;
                this.prev_match = 0;
                this.match_available = 0;
                this.strstart = 0;
                this.match_start = 0;
                this.lookahead = 0;
                this.prev_length = 0;
                this.max_chain_length = 0;
                this.max_lazy_match = 0;
                this.level = 0;
                this.strategy = 0;
                this.good_match = 0;
                this.nice_match = 0;
                this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
                this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
                this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
                zero(this.dyn_ltree);
                zero(this.dyn_dtree);
                zero(this.bl_tree);
                this.l_desc = null;
                this.d_desc = null;
                this.bl_desc = null;
                this.bl_count = new utils.Buf16(MAX_BITS + 1);
                this.heap = new utils.Buf16(2 * L_CODES + 1);
                zero(this.heap);
                this.heap_len = 0;
                this.heap_max = 0;
                this.depth = new utils.Buf16(2 * L_CODES + 1);
                zero(this.depth);
                this.l_buf = 0;
                this.lit_bufsize = 0;
                this.last_lit = 0;
                this.d_buf = 0;
                this.opt_len = 0;
                this.static_len = 0;
                this.matches = 0;
                this.insert = 0;
                this.bi_buf = 0;
                this.bi_valid = 0
            }
            function deflateResetKeep(strm) {
                var s;
                if (!strm || !strm.state) {
                    return err(strm, Z_STREAM_ERROR)
                }
                strm.total_in = strm.total_out = 0;
                strm.data_type = Z_UNKNOWN;
                s = strm.state;
                s.pending = 0;
                s.pending_out = 0;
                if (s.wrap < 0) {
                    s.wrap = -s.wrap
                }
                s.status = s.wrap ? INIT_STATE : BUSY_STATE;
                strm.adler = s.wrap === 2 ? 0 : 1;
                s.last_flush = Z_NO_FLUSH;
                trees._tr_init(s);
                return Z_OK
            }
            function deflateReset(strm) {
                var ret = deflateResetKeep(strm);
                if (ret === Z_OK) {
                    lm_init(strm.state)
                }
                return ret
            }
            function deflateSetHeader(strm, head) {
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                if (strm.state.wrap !== 2) {
                    return Z_STREAM_ERROR
                }
                strm.state.gzhead = head;
                return Z_OK
            }
            function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
                if (!strm) {
                    return Z_STREAM_ERROR
                }
                var wrap = 1;
                if (level === Z_DEFAULT_COMPRESSION) {
                    level = 6
                }
                if (windowBits < 0) {
                    wrap = 0;
                    windowBits = -windowBits
                } else if (windowBits > 15) {
                    wrap = 2;
                    windowBits -= 16
                }
                if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
                    return err(strm, Z_STREAM_ERROR)
                }
                if (windowBits === 8) {
                    windowBits = 9
                }
                var s = new DeflateState;
                strm.state = s;
                s.strm = strm;
                s.wrap = wrap;
                s.gzhead = null;
                s.w_bits = windowBits;
                s.w_size = 1 << s.w_bits;
                s.w_mask = s.w_size - 1;
                s.hash_bits = memLevel + 7;
                s.hash_size = 1 << s.hash_bits;
                s.hash_mask = s.hash_size - 1;
                s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
                s.window = new utils.Buf8(s.w_size * 2);
                s.head = new utils.Buf16(s.hash_size);
                s.prev = new utils.Buf16(s.w_size);
                s.lit_bufsize = 1 << memLevel + 6;
                s.pending_buf_size = s.lit_bufsize * 4;
                s.pending_buf = new utils.Buf8(s.pending_buf_size);
                s.d_buf = 1 * s.lit_bufsize;
                s.l_buf = (1 + 2) * s.lit_bufsize;
                s.level = level;
                s.strategy = strategy;
                s.method = method;
                return deflateReset(strm)
            }
            function deflateInit(strm, level) {
                return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY)
            }
            function deflate(strm, flush) {
                var old_flush, s;
                var beg, val;
                if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
                    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR
                }
                s = strm.state;
                if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
                    return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR)
                }
                s.strm = strm;
                old_flush = s.last_flush;
                s.last_flush = flush;
                if (s.status === INIT_STATE) {
                    if (s.wrap === 2) {
                        strm.adler = 0;
                        put_byte(s, 31);
                        put_byte(s, 139);
                        put_byte(s, 8);
                        if (!s.gzhead) {
                            put_byte(s, 0);
                            put_byte(s, 0);
                            put_byte(s, 0);
                            put_byte(s, 0);
                            put_byte(s, 0);
                            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                            put_byte(s, OS_CODE);
                            s.status = BUSY_STATE
                        } else {
                            put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
                            put_byte(s, s.gzhead.time & 255);
                            put_byte(s, s.gzhead.time >> 8 & 255);
                            put_byte(s, s.gzhead.time >> 16 & 255);
                            put_byte(s, s.gzhead.time >> 24 & 255);
                            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                            put_byte(s, s.gzhead.os & 255);
                            if (s.gzhead.extra && s.gzhead.extra.length) {
                                put_byte(s, s.gzhead.extra.length & 255);
                                put_byte(s, s.gzhead.extra.length >> 8 & 255)
                            }
                            if (s.gzhead.hcrc) {
                                strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0)
                            }
                            s.gzindex = 0;
                            s.status = EXTRA_STATE
                        }
                    } else {
                        var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
                        var level_flags = -1;
                        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
                            level_flags = 0
                        } else if (s.level < 6) {
                            level_flags = 1
                        } else if (s.level === 6) {
                            level_flags = 2
                        } else {
                            level_flags = 3
                        }
                        header |= level_flags << 6;
                        if (s.strstart !== 0) {
                            header |= PRESET_DICT
                        }
                        header += 31 - header % 31;
                        s.status = BUSY_STATE;
                        putShortMSB(s, header);
                        if (s.strstart !== 0) {
                            putShortMSB(s, strm.adler >>> 16);
                            putShortMSB(s, strm.adler & 65535)
                        }
                        strm.adler = 1
                    }
                }
                if (s.status === EXTRA_STATE) {
                    if (s.gzhead.extra) {
                        beg = s.pending;
                        while (s.gzindex < (s.gzhead.extra.length & 65535)) {
                            if (s.pending === s.pending_buf_size) {
                                if (s.gzhead.hcrc && s.pending > beg) {
                                    strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                                }
                                flush_pending(strm);
                                beg = s.pending;
                                if (s.pending === s.pending_buf_size) {
                                    break
                                }
                            }
                            put_byte(s, s.gzhead.extra[s.gzindex] & 255);
                            s.gzindex++
                        }
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                        }
                        if (s.gzindex === s.gzhead.extra.length) {
                            s.gzindex = 0;
                            s.status = NAME_STATE
                        }
                    } else {
                        s.status = NAME_STATE
                    }
                }
                if (s.status === NAME_STATE) {
                    if (s.gzhead.name) {
                        beg = s.pending;
                        do {
                            if (s.pending === s.pending_buf_size) {
                                if (s.gzhead.hcrc && s.pending > beg) {
                                    strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                                }
                                flush_pending(strm);
                                beg = s.pending;
                                if (s.pending === s.pending_buf_size) {
                                    val = 1;
                                    break
                                }
                            }
                            if (s.gzindex < s.gzhead.name.length) {
                                val = s.gzhead.name.charCodeAt(s.gzindex++) & 255
                            } else {
                                val = 0
                            }
                            put_byte(s, val)
                        } while (val !== 0);
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                        }
                        if (val === 0) {
                            s.gzindex = 0;
                            s.status = COMMENT_STATE
                        }
                    } else {
                        s.status = COMMENT_STATE
                    }
                }
                if (s.status === COMMENT_STATE) {
                    if (s.gzhead.comment) {
                        beg = s.pending;
                        do {
                            if (s.pending === s.pending_buf_size) {
                                if (s.gzhead.hcrc && s.pending > beg) {
                                    strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                                }
                                flush_pending(strm);
                                beg = s.pending;
                                if (s.pending === s.pending_buf_size) {
                                    val = 1;
                                    break
                                }
                            }
                            if (s.gzindex < s.gzhead.comment.length) {
                                val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255
                            } else {
                                val = 0
                            }
                            put_byte(s, val)
                        } while (val !== 0);
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                        }
                        if (val === 0) {
                            s.status = HCRC_STATE
                        }
                    } else {
                        s.status = HCRC_STATE
                    }
                }
                if (s.status === HCRC_STATE) {
                    if (s.gzhead.hcrc) {
                        if (s.pending + 2 > s.pending_buf_size) {
                            flush_pending(strm)
                        }
                        if (s.pending + 2 <= s.pending_buf_size) {
                            put_byte(s, strm.adler & 255);
                            put_byte(s, strm.adler >> 8 & 255);
                            strm.adler = 0;
                            s.status = BUSY_STATE
                        }
                    } else {
                        s.status = BUSY_STATE
                    }
                }
                if (s.pending !== 0) {
                    flush_pending(strm);
                    if (strm.avail_out === 0) {
                        s.last_flush = -1;
                        return Z_OK
                    }
                } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
                    return err(strm, Z_BUF_ERROR)
                }
                if (s.status === FINISH_STATE && strm.avail_in !== 0) {
                    return err(strm, Z_BUF_ERROR)
                }
                if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
                    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
                    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
                        s.status = FINISH_STATE
                    }
                    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
                        if (strm.avail_out === 0) {
                            s.last_flush = -1
                        }
                        return Z_OK
                    }
                    if (bstate === BS_BLOCK_DONE) {
                        if (flush === Z_PARTIAL_FLUSH) {
                            trees._tr_align(s)
                        } else if (flush !== Z_BLOCK) {
                            trees._tr_stored_block(s, 0, 0, false);
                            if (flush === Z_FULL_FLUSH) {
                                zero(s.head);
                                if (s.lookahead === 0) {
                                    s.strstart = 0;
                                    s.block_start = 0;
                                    s.insert = 0
                                }
                            }
                        }
                        flush_pending(strm);
                        if (strm.avail_out === 0) {
                            s.last_flush = -1;
                            return Z_OK
                        }
                    }
                }
                if (flush !== Z_FINISH) {
                    return Z_OK
                }
                if (s.wrap <= 0) {
                    return Z_STREAM_END
                }
                if (s.wrap === 2) {
                    put_byte(s, strm.adler & 255);
                    put_byte(s, strm.adler >> 8 & 255);
                    put_byte(s, strm.adler >> 16 & 255);
                    put_byte(s, strm.adler >> 24 & 255);
                    put_byte(s, strm.total_in & 255);
                    put_byte(s, strm.total_in >> 8 & 255);
                    put_byte(s, strm.total_in >> 16 & 255);
                    put_byte(s, strm.total_in >> 24 & 255)
                } else {
                    putShortMSB(s, strm.adler >>> 16);
                    putShortMSB(s, strm.adler & 65535)
                }
                flush_pending(strm);
                if (s.wrap > 0) {
                    s.wrap = -s.wrap
                }
                return s.pending !== 0 ? Z_OK : Z_STREAM_END
            }
            function deflateEnd(strm) {
                var status;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                status = strm.state.status;
                if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
                    return err(strm, Z_STREAM_ERROR)
                }
                strm.state = null;
                return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK
            }
            function deflateSetDictionary(strm, dictionary) {
                var dictLength = dictionary.length;
                var s;
                var str, n;
                var wrap;
                var avail;
                var next;
                var input;
                var tmpDict;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                s = strm.state;
                wrap = s.wrap;
                if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
                    return Z_STREAM_ERROR
                }
                if (wrap === 1) {
                    strm.adler = adler32(strm.adler, dictionary, dictLength, 0)
                }
                s.wrap = 0;
                if (dictLength >= s.w_size) {
                    if (wrap === 0) {
                        zero(s.head);
                        s.strstart = 0;
                        s.block_start = 0;
                        s.insert = 0
                    }
                    tmpDict = new utils.Buf8(s.w_size);
                    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
                    dictionary = tmpDict;
                    dictLength = s.w_size
                }
                avail = strm.avail_in;
                next = strm.next_in;
                input = strm.input;
                strm.avail_in = dictLength;
                strm.next_in = 0;
                strm.input = dictionary;
                fill_window(s);
                while (s.lookahead >= MIN_MATCH) {
                    str = s.strstart;
                    n = s.lookahead - (MIN_MATCH - 1);
                    do {
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
                        s.prev[str & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = str;
                        str++
                    } while (--n);
                    s.strstart = str;
                    s.lookahead = MIN_MATCH - 1;
                    fill_window(s)
                }
                s.strstart += s.lookahead;
                s.block_start = s.strstart;
                s.insert = s.lookahead;
                s.lookahead = 0;
                s.match_length = s.prev_length = MIN_MATCH - 1;
                s.match_available = 0;
                strm.next_in = next;
                strm.input = input;
                strm.avail_in = avail;
                s.wrap = wrap;
                return Z_OK
            }
            exports.deflateInit = deflateInit;
            exports.deflateInit2 = deflateInit2;
            exports.deflateReset = deflateReset;
            exports.deflateResetKeep = deflateResetKeep;
            exports.deflateSetHeader = deflateSetHeader;
            exports.deflate = deflate;
            exports.deflateEnd = deflateEnd;
            exports.deflateSetDictionary = deflateSetDictionary;
            exports.deflateInfo = "pako deflate (from Nodeca project)"
        }
        , {
            "../utils/common": 39,
            "./adler32": 40,
            "./crc32": 42,
            "./messages": 47,
            "./trees": 48
        }],
        44: [function(require, module, exports) {
            "use strict";
            var BAD = 30;
            var TYPE = 12;
            module.exports = function inflate_fast(strm, start) {
                var state;
                var _in;
                var last;
                var _out;
                var beg;
                var end;
                var dmax;
                var wsize;
                var whave;
                var wnext;
                var s_window;
                var hold;
                var bits;
                var lcode;
                var dcode;
                var lmask;
                var dmask;
                var here;
                var op;
                var len;
                var dist;
                var from;
                var from_source;
                var input, output;
                state = strm.state;
                _in = strm.next_in;
                input = strm.input;
                last = _in + (strm.avail_in - 5);
                _out = strm.next_out;
                output = strm.output;
                beg = _out - (start - strm.avail_out);
                end = _out + (strm.avail_out - 257);
                dmax = state.dmax;
                wsize = state.wsize;
                whave = state.whave;
                wnext = state.wnext;
                s_window = state.window;
                hold = state.hold;
                bits = state.bits;
                lcode = state.lencode;
                dcode = state.distcode;
                lmask = (1 << state.lenbits) - 1;
                dmask = (1 << state.distbits) - 1;
                top: do {
                    if (bits < 15) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        hold += input[_in++] << bits;
                        bits += 8
                    }
                    here = lcode[hold & lmask];
                    dolen: for (; ; ) {
                        op = here >>> 24;
                        hold >>>= op;
                        bits -= op;
                        op = here >>> 16 & 255;
                        if (op === 0) {
                            output[_out++] = here & 65535
                        } else if (op & 16) {
                            len = here & 65535;
                            op &= 15;
                            if (op) {
                                if (bits < op) {
                                    hold += input[_in++] << bits;
                                    bits += 8
                                }
                                len += hold & (1 << op) - 1;
                                hold >>>= op;
                                bits -= op
                            }
                            if (bits < 15) {
                                hold += input[_in++] << bits;
                                bits += 8;
                                hold += input[_in++] << bits;
                                bits += 8
                            }
                            here = dcode[hold & dmask];
                            dodist: for (; ; ) {
                                op = here >>> 24;
                                hold >>>= op;
                                bits -= op;
                                op = here >>> 16 & 255;
                                if (op & 16) {
                                    dist = here & 65535;
                                    op &= 15;
                                    if (bits < op) {
                                        hold += input[_in++] << bits;
                                        bits += 8;
                                        if (bits < op) {
                                            hold += input[_in++] << bits;
                                            bits += 8
                                        }
                                    }
                                    dist += hold & (1 << op) - 1;
                                    if (dist > dmax) {
                                        strm.msg = "invalid distance too far back";
                                        state.mode = BAD;
                                        break top
                                    }
                                    hold >>>= op;
                                    bits -= op;
                                    op = _out - beg;
                                    if (dist > op) {
                                        op = dist - op;
                                        if (op > whave) {
                                            if (state.sane) {
                                                strm.msg = "invalid distance too far back";
                                                state.mode = BAD;
                                                break top
                                            }
                                        }
                                        from = 0;
                                        from_source = s_window;
                                        if (wnext === 0) {
                                            from += wsize - op;
                                            if (op < len) {
                                                len -= op;
                                                do {
                                                    output[_out++] = s_window[from++]
                                                } while (--op);
                                                from = _out - dist;
                                                from_source = output
                                            }
                                        } else if (wnext < op) {
                                            from += wsize + wnext - op;
                                            op -= wnext;
                                            if (op < len) {
                                                len -= op;
                                                do {
                                                    output[_out++] = s_window[from++]
                                                } while (--op);
                                                from = 0;
                                                if (wnext < len) {
                                                    op = wnext;
                                                    len -= op;
                                                    do {
                                                        output[_out++] = s_window[from++]
                                                    } while (--op);
                                                    from = _out - dist;
                                                    from_source = output
                                                }
                                            }
                                        } else {
                                            from += wnext - op;
                                            if (op < len) {
                                                len -= op;
                                                do {
                                                    output[_out++] = s_window[from++]
                                                } while (--op);
                                                from = _out - dist;
                                                from_source = output
                                            }
                                        }
                                        while (len > 2) {
                                            output[_out++] = from_source[from++];
                                            output[_out++] = from_source[from++];
                                            output[_out++] = from_source[from++];
                                            len -= 3
                                        }
                                        if (len) {
                                            output[_out++] = from_source[from++];
                                            if (len > 1) {
                                                output[_out++] = from_source[from++]
                                            }
                                        }
                                    } else {
                                        from = _out - dist;
                                        do {
                                            output[_out++] = output[from++];
                                            output[_out++] = output[from++];
                                            output[_out++] = output[from++];
                                            len -= 3
                                        } while (len > 2);
                                        if (len) {
                                            output[_out++] = output[from++];
                                            if (len > 1) {
                                                output[_out++] = output[from++]
                                            }
                                        }
                                    }
                                } else if ((op & 64) === 0) {
                                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                                    continue dodist
                                } else {
                                    strm.msg = "invalid distance code";
                                    state.mode = BAD;
                                    break top
                                }
                                break
                            }
                        } else if ((op & 64) === 0) {
                            here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                            continue dolen
                        } else if (op & 32) {
                            state.mode = TYPE;
                            break top
                        } else {
                            strm.msg = "invalid literal/length code";
                            state.mode = BAD;
                            break top
                        }
                        break
                    }
                } while (_in < last && _out < end);
                len = bits >> 3;
                _in -= len;
                bits -= len << 3;
                hold &= (1 << bits) - 1;
                strm.next_in = _in;
                strm.next_out = _out;
                strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
                strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
                state.hold = hold;
                state.bits = bits;
                return
            }
        }
        , {}],
        45: [function(require, module, exports) {
            "use strict";
            var utils = require("../utils/common");
            var adler32 = require("./adler32");
            var crc32 = require("./crc32");
            var inflate_fast = require("./inffast");
            var inflate_table = require("./inftrees");
            var CODES = 0;
            var LENS = 1;
            var DISTS = 2;
            var Z_FINISH = 4;
            var Z_BLOCK = 5;
            var Z_TREES = 6;
            var Z_OK = 0;
            var Z_STREAM_END = 1;
            var Z_NEED_DICT = 2;
            var Z_STREAM_ERROR = -2;
            var Z_DATA_ERROR = -3;
            var Z_MEM_ERROR = -4;
            var Z_BUF_ERROR = -5;
            var Z_DEFLATED = 8;
            var HEAD = 1;
            var FLAGS = 2;
            var TIME = 3;
            var OS = 4;
            var EXLEN = 5;
            var EXTRA = 6;
            var NAME = 7;
            var COMMENT = 8;
            var HCRC = 9;
            var DICTID = 10;
            var DICT = 11;
            var TYPE = 12;
            var TYPEDO = 13;
            var STORED = 14;
            var COPY_ = 15;
            var COPY = 16;
            var TABLE = 17;
            var LENLENS = 18;
            var CODELENS = 19;
            var LEN_ = 20;
            var LEN = 21;
            var LENEXT = 22;
            var DIST = 23;
            var DISTEXT = 24;
            var MATCH = 25;
            var LIT = 26;
            var CHECK = 27;
            var LENGTH = 28;
            var DONE = 29;
            var BAD = 30;
            var MEM = 31;
            var SYNC = 32;
            var ENOUGH_LENS = 852;
            var ENOUGH_DISTS = 592;
            var MAX_WBITS = 15;
            var DEF_WBITS = MAX_WBITS;
            function zswap32(q) {
                return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24)
            }
            function InflateState() {
                this.mode = 0;
                this.last = false;
                this.wrap = 0;
                this.havedict = false;
                this.flags = 0;
                this.dmax = 0;
                this.check = 0;
                this.total = 0;
                this.head = null;
                this.wbits = 0;
                this.wsize = 0;
                this.whave = 0;
                this.wnext = 0;
                this.window = null;
                this.hold = 0;
                this.bits = 0;
                this.length = 0;
                this.offset = 0;
                this.extra = 0;
                this.lencode = null;
                this.distcode = null;
                this.lenbits = 0;
                this.distbits = 0;
                this.ncode = 0;
                this.nlen = 0;
                this.ndist = 0;
                this.have = 0;
                this.next = null;
                this.lens = new utils.Buf16(320);
                this.work = new utils.Buf16(288);
                this.lendyn = null;
                this.distdyn = null;
                this.sane = 0;
                this.back = 0;
                this.was = 0
            }
            function inflateResetKeep(strm) {
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                state = strm.state;
                strm.total_in = strm.total_out = state.total = 0;
                strm.msg = "";
                if (state.wrap) {
                    strm.adler = state.wrap & 1
                }
                state.mode = HEAD;
                state.last = 0;
                state.havedict = 0;
                state.dmax = 32768;
                state.head = null;
                state.hold = 0;
                state.bits = 0;
                state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
                state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
                state.sane = 1;
                state.back = -1;
                return Z_OK
            }
            function inflateReset(strm) {
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                state = strm.state;
                state.wsize = 0;
                state.whave = 0;
                state.wnext = 0;
                return inflateResetKeep(strm)
            }
            function inflateReset2(strm, windowBits) {
                var wrap;
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                state = strm.state;
                if (windowBits < 0) {
                    wrap = 0;
                    windowBits = -windowBits
                } else {
                    wrap = (windowBits >> 4) + 1;
                    if (windowBits < 48) {
                        windowBits &= 15
                    }
                }
                if (windowBits && (windowBits < 8 || windowBits > 15)) {
                    return Z_STREAM_ERROR
                }
                if (state.window !== null && state.wbits !== windowBits) {
                    state.window = null
                }
                state.wrap = wrap;
                state.wbits = windowBits;
                return inflateReset(strm)
            }
            function inflateInit2(strm, windowBits) {
                var ret;
                var state;
                if (!strm) {
                    return Z_STREAM_ERROR
                }
                state = new InflateState;
                strm.state = state;
                state.window = null;
                ret = inflateReset2(strm, windowBits);
                if (ret !== Z_OK) {
                    strm.state = null
                }
                return ret
            }
            function inflateInit(strm) {
                return inflateInit2(strm, DEF_WBITS)
            }
            var virgin = true;
            var lenfix, distfix;
            function fixedtables(state) {
                if (virgin) {
                    var sym;
                    lenfix = new utils.Buf32(512);
                    distfix = new utils.Buf32(32);
                    sym = 0;
                    while (sym < 144) {
                        state.lens[sym++] = 8
                    }
                    while (sym < 256) {
                        state.lens[sym++] = 9
                    }
                    while (sym < 280) {
                        state.lens[sym++] = 7
                    }
                    while (sym < 288) {
                        state.lens[sym++] = 8
                    }
                    inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
                        bits: 9
                    });
                    sym = 0;
                    while (sym < 32) {
                        state.lens[sym++] = 5
                    }
                    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
                        bits: 5
                    });
                    virgin = false
                }
                state.lencode = lenfix;
                state.lenbits = 9;
                state.distcode = distfix;
                state.distbits = 5
            }
            function updatewindow(strm, src, end, copy) {
                var dist;
                var state = strm.state;
                if (state.window === null) {
                    state.wsize = 1 << state.wbits;
                    state.wnext = 0;
                    state.whave = 0;
                    state.window = new utils.Buf8(state.wsize)
                }
                if (copy >= state.wsize) {
                    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
                    state.wnext = 0;
                    state.whave = state.wsize
                } else {
                    dist = state.wsize - state.wnext;
                    if (dist > copy) {
                        dist = copy
                    }
                    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
                    copy -= dist;
                    if (copy) {
                        utils.arraySet(state.window, src, end - copy, copy, 0);
                        state.wnext = copy;
                        state.whave = state.wsize
                    } else {
                        state.wnext += dist;
                        if (state.wnext === state.wsize) {
                            state.wnext = 0
                        }
                        if (state.whave < state.wsize) {
                            state.whave += dist
                        }
                    }
                }
                return 0
            }
            function inflate(strm, flush) {
                var state;
                var input, output;
                var next;
                var put;
                var have, left;
                var hold;
                var bits;
                var _in, _out;
                var copy;
                var from;
                var from_source;
                var here = 0;
                var here_bits, here_op, here_val;
                var last_bits, last_op, last_val;
                var len;
                var ret;
                var hbuf = new utils.Buf8(4);
                var opts;
                var n;
                var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
                    return Z_STREAM_ERROR
                }
                state = strm.state;
                if (state.mode === TYPE) {
                    state.mode = TYPEDO
                }
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                _in = have;
                _out = left;
                ret = Z_OK;
                inf_leave: for (; ; ) {
                    switch (state.mode) {
                    case HEAD:
                        if (state.wrap === 0) {
                            state.mode = TYPEDO;
                            break
                        }
                        while (bits < 16) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        if (state.wrap & 2 && hold === 35615) {
                            state.check = 0;
                            hbuf[0] = hold & 255;
                            hbuf[1] = hold >>> 8 & 255;
                            state.check = crc32(state.check, hbuf, 2, 0);
                            hold = 0;
                            bits = 0;
                            state.mode = FLAGS;
                            break
                        }
                        state.flags = 0;
                        if (state.head) {
                            state.head.done = false
                        }
                        if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
                            strm.msg = "incorrect header check";
                            state.mode = BAD;
                            break
                        }
                        if ((hold & 15) !== Z_DEFLATED) {
                            strm.msg = "unknown compression method";
                            state.mode = BAD;
                            break
                        }
                        hold >>>= 4;
                        bits -= 4;
                        len = (hold & 15) + 8;
                        if (state.wbits === 0) {
                            state.wbits = len
                        } else if (len > state.wbits) {
                            strm.msg = "invalid window size";
                            state.mode = BAD;
                            break
                        }
                        state.dmax = 1 << len;
                        strm.adler = state.check = 1;
                        state.mode = hold & 512 ? DICTID : TYPE;
                        hold = 0;
                        bits = 0;
                        break;
                    case FLAGS:
                        while (bits < 16) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        state.flags = hold;
                        if ((state.flags & 255) !== Z_DEFLATED) {
                            strm.msg = "unknown compression method";
                            state.mode = BAD;
                            break
                        }
                        if (state.flags & 57344) {
                            strm.msg = "unknown header flags set";
                            state.mode = BAD;
                            break
                        }
                        if (state.head) {
                            state.head.text = hold >> 8 & 1
                        }
                        if (state.flags & 512) {
                            hbuf[0] = hold & 255;
                            hbuf[1] = hold >>> 8 & 255;
                            state.check = crc32(state.check, hbuf, 2, 0)
                        }
                        hold = 0;
                        bits = 0;
                        state.mode = TIME;
                    case TIME:
                        while (bits < 32) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        if (state.head) {
                            state.head.time = hold
                        }
                        if (state.flags & 512) {
                            hbuf[0] = hold & 255;
                            hbuf[1] = hold >>> 8 & 255;
                            hbuf[2] = hold >>> 16 & 255;
                            hbuf[3] = hold >>> 24 & 255;
                            state.check = crc32(state.check, hbuf, 4, 0)
                        }
                        hold = 0;
                        bits = 0;
                        state.mode = OS;
                    case OS:
                        while (bits < 16) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        if (state.head) {
                            state.head.xflags = hold & 255;
                            state.head.os = hold >> 8
                        }
                        if (state.flags & 512) {
                            hbuf[0] = hold & 255;
                            hbuf[1] = hold >>> 8 & 255;
                            state.check = crc32(state.check, hbuf, 2, 0)
                        }
                        hold = 0;
                        bits = 0;
                        state.mode = EXLEN;
                    case EXLEN:
                        if (state.flags & 1024) {
                            while (bits < 16) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            state.length = hold;
                            if (state.head) {
                                state.head.extra_len = hold
                            }
                            if (state.flags & 512) {
                                hbuf[0] = hold & 255;
                                hbuf[1] = hold >>> 8 & 255;
                                state.check = crc32(state.check, hbuf, 2, 0)
                            }
                            hold = 0;
                            bits = 0
                        } else if (state.head) {
                            state.head.extra = null
                        }
                        state.mode = EXTRA;
                    case EXTRA:
                        if (state.flags & 1024) {
                            copy = state.length;
                            if (copy > have) {
                                copy = have
                            }
                            if (copy) {
                                if (state.head) {
                                    len = state.head.extra_len - state.length;
                                    if (!state.head.extra) {
                                        state.head.extra = new Array(state.head.extra_len)
                                    }
                                    utils.arraySet(state.head.extra, input, next, copy, len)
                                }
                                if (state.flags & 512) {
                                    state.check = crc32(state.check, input, copy, next)
                                }
                                have -= copy;
                                next += copy;
                                state.length -= copy
                            }
                            if (state.length) {
                                break inf_leave
                            }
                        }
                        state.length = 0;
                        state.mode = NAME;
                    case NAME:
                        if (state.flags & 2048) {
                            if (have === 0) {
                                break inf_leave
                            }
                            copy = 0;
                            do {
                                len = input[next + copy++];
                                if (state.head && len && state.length < 65536) {
                                    state.head.name += String.fromCharCode(len)
                                }
                            } while (len && copy < have);
                            if (state.flags & 512) {
                                state.check = crc32(state.check, input, copy, next)
                            }
                            have -= copy;
                            next += copy;
                            if (len) {
                                break inf_leave
                            }
                        } else if (state.head) {
                            state.head.name = null
                        }
                        state.length = 0;
                        state.mode = COMMENT;
                    case COMMENT:
                        if (state.flags & 4096) {
                            if (have === 0) {
                                break inf_leave
                            }
                            copy = 0;
                            do {
                                len = input[next + copy++];
                                if (state.head && len && state.length < 65536) {
                                    state.head.comment += String.fromCharCode(len)
                                }
                            } while (len && copy < have);
                            if (state.flags & 512) {
                                state.check = crc32(state.check, input, copy, next)
                            }
                            have -= copy;
                            next += copy;
                            if (len) {
                                break inf_leave
                            }
                        } else if (state.head) {
                            state.head.comment = null
                        }
                        state.mode = HCRC;
                    case HCRC:
                        if (state.flags & 512) {
                            while (bits < 16) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            if (hold !== (state.check & 65535)) {
                                strm.msg = "header crc mismatch";
                                state.mode = BAD;
                                break
                            }
                            hold = 0;
                            bits = 0
                        }
                        if (state.head) {
                            state.head.hcrc = state.flags >> 9 & 1;
                            state.head.done = true
                        }
                        strm.adler = state.check = 0;
                        state.mode = TYPE;
                        break;
                    case DICTID:
                        while (bits < 32) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        strm.adler = state.check = zswap32(hold);
                        hold = 0;
                        bits = 0;
                        state.mode = DICT;
                    case DICT:
                        if (state.havedict === 0) {
                            strm.next_out = put;
                            strm.avail_out = left;
                            strm.next_in = next;
                            strm.avail_in = have;
                            state.hold = hold;
                            state.bits = bits;
                            return Z_NEED_DICT
                        }
                        strm.adler = state.check = 1;
                        state.mode = TYPE;
                    case TYPE:
                        if (flush === Z_BLOCK || flush === Z_TREES) {
                            break inf_leave
                        }
                    case TYPEDO:
                        if (state.last) {
                            hold >>>= bits & 7;
                            bits -= bits & 7;
                            state.mode = CHECK;
                            break
                        }
                        while (bits < 3) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        state.last = hold & 1;
                        hold >>>= 1;
                        bits -= 1;
                        switch (hold & 3) {
                        case 0:
                            state.mode = STORED;
                            break;
                        case 1:
                            fixedtables(state);
                            state.mode = LEN_;
                            if (flush === Z_TREES) {
                                hold >>>= 2;
                                bits -= 2;
                                break inf_leave
                            }
                            break;
                        case 2:
                            state.mode = TABLE;
                            break;
                        case 3:
                            strm.msg = "invalid block type";
                            state.mode = BAD
                        }
                        hold >>>= 2;
                        bits -= 2;
                        break;
                    case STORED:
                        hold >>>= bits & 7;
                        bits -= bits & 7;
                        while (bits < 32) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                            strm.msg = "invalid stored block lengths";
                            state.mode = BAD;
                            break
                        }
                        state.length = hold & 65535;
                        hold = 0;
                        bits = 0;
                        state.mode = COPY_;
                        if (flush === Z_TREES) {
                            break inf_leave
                        }
                    case COPY_:
                        state.mode = COPY;
                    case COPY:
                        copy = state.length;
                        if (copy) {
                            if (copy > have) {
                                copy = have
                            }
                            if (copy > left) {
                                copy = left
                            }
                            if (copy === 0) {
                                break inf_leave
                            }
                            utils.arraySet(output, input, next, copy, put);
                            have -= copy;
                            next += copy;
                            left -= copy;
                            put += copy;
                            state.length -= copy;
                            break
                        }
                        state.mode = TYPE;
                        break;
                    case TABLE:
                        while (bits < 14) {
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        state.nlen = (hold & 31) + 257;
                        hold >>>= 5;
                        bits -= 5;
                        state.ndist = (hold & 31) + 1;
                        hold >>>= 5;
                        bits -= 5;
                        state.ncode = (hold & 15) + 4;
                        hold >>>= 4;
                        bits -= 4;
                        if (state.nlen > 286 || state.ndist > 30) {
                            strm.msg = "too many length or distance symbols";
                            state.mode = BAD;
                            break
                        }
                        state.have = 0;
                        state.mode = LENLENS;
                    case LENLENS:
                        while (state.have < state.ncode) {
                            while (bits < 3) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            state.lens[order[state.have++]] = hold & 7;
                            hold >>>= 3;
                            bits -= 3
                        }
                        while (state.have < 19) {
                            state.lens[order[state.have++]] = 0
                        }
                        state.lencode = state.lendyn;
                        state.lenbits = 7;
                        opts = {
                            bits: state.lenbits
                        };
                        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
                        state.lenbits = opts.bits;
                        if (ret) {
                            strm.msg = "invalid code lengths set";
                            state.mode = BAD;
                            break
                        }
                        state.have = 0;
                        state.mode = CODELENS;
                    case CODELENS:
                        while (state.have < state.nlen + state.ndist) {
                            for (; ; ) {
                                here = state.lencode[hold & (1 << state.lenbits) - 1];
                                here_bits = here >>> 24;
                                here_op = here >>> 16 & 255;
                                here_val = here & 65535;
                                if (here_bits <= bits) {
                                    break
                                }
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            if (here_val < 16) {
                                hold >>>= here_bits;
                                bits -= here_bits;
                                state.lens[state.have++] = here_val
                            } else {
                                if (here_val === 16) {
                                    n = here_bits + 2;
                                    while (bits < n) {
                                        if (have === 0) {
                                            break inf_leave
                                        }
                                        have--;
                                        hold += input[next++] << bits;
                                        bits += 8
                                    }
                                    hold >>>= here_bits;
                                    bits -= here_bits;
                                    if (state.have === 0) {
                                        strm.msg = "invalid bit length repeat";
                                        state.mode = BAD;
                                        break
                                    }
                                    len = state.lens[state.have - 1];
                                    copy = 3 + (hold & 3);
                                    hold >>>= 2;
                                    bits -= 2
                                } else if (here_val === 17) {
                                    n = here_bits + 3;
                                    while (bits < n) {
                                        if (have === 0) {
                                            break inf_leave
                                        }
                                        have--;
                                        hold += input[next++] << bits;
                                        bits += 8
                                    }
                                    hold >>>= here_bits;
                                    bits -= here_bits;
                                    len = 0;
                                    copy = 3 + (hold & 7);
                                    hold >>>= 3;
                                    bits -= 3
                                } else {
                                    n = here_bits + 7;
                                    while (bits < n) {
                                        if (have === 0) {
                                            break inf_leave
                                        }
                                        have--;
                                        hold += input[next++] << bits;
                                        bits += 8
                                    }
                                    hold >>>= here_bits;
                                    bits -= here_bits;
                                    len = 0;
                                    copy = 11 + (hold & 127);
                                    hold >>>= 7;
                                    bits -= 7
                                }
                                if (state.have + copy > state.nlen + state.ndist) {
                                    strm.msg = "invalid bit length repeat";
                                    state.mode = BAD;
                                    break
                                }
                                while (copy--) {
                                    state.lens[state.have++] = len
                                }
                            }
                        }
                        if (state.mode === BAD) {
                            break
                        }
                        if (state.lens[256] === 0) {
                            strm.msg = "invalid code -- missing end-of-block";
                            state.mode = BAD;
                            break
                        }
                        state.lenbits = 9;
                        opts = {
                            bits: state.lenbits
                        };
                        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
                        state.lenbits = opts.bits;
                        if (ret) {
                            strm.msg = "invalid literal/lengths set";
                            state.mode = BAD;
                            break
                        }
                        state.distbits = 6;
                        state.distcode = state.distdyn;
                        opts = {
                            bits: state.distbits
                        };
                        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
                        state.distbits = opts.bits;
                        if (ret) {
                            strm.msg = "invalid distances set";
                            state.mode = BAD;
                            break
                        }
                        state.mode = LEN_;
                        if (flush === Z_TREES) {
                            break inf_leave
                        }
                    case LEN_:
                        state.mode = LEN;
                    case LEN:
                        if (have >= 6 && left >= 258) {
                            strm.next_out = put;
                            strm.avail_out = left;
                            strm.next_in = next;
                            strm.avail_in = have;
                            state.hold = hold;
                            state.bits = bits;
                            inflate_fast(strm, _out);
                            put = strm.next_out;
                            output = strm.output;
                            left = strm.avail_out;
                            next = strm.next_in;
                            input = strm.input;
                            have = strm.avail_in;
                            hold = state.hold;
                            bits = state.bits;
                            if (state.mode === TYPE) {
                                state.back = -1
                            }
                            break
                        }
                        state.back = 0;
                        for (; ; ) {
                            here = state.lencode[hold & (1 << state.lenbits) - 1];
                            here_bits = here >>> 24;
                            here_op = here >>> 16 & 255;
                            here_val = here & 65535;
                            if (here_bits <= bits) {
                                break
                            }
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        if (here_op && (here_op & 240) === 0) {
                            last_bits = here_bits;
                            last_op = here_op;
                            last_val = here_val;
                            for (; ; ) {
                                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                                here_bits = here >>> 24;
                                here_op = here >>> 16 & 255;
                                here_val = here & 65535;
                                if (last_bits + here_bits <= bits) {
                                    break
                                }
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            hold >>>= last_bits;
                            bits -= last_bits;
                            state.back += last_bits
                        }
                        hold >>>= here_bits;
                        bits -= here_bits;
                        state.back += here_bits;
                        state.length = here_val;
                        if (here_op === 0) {
                            state.mode = LIT;
                            break
                        }
                        if (here_op & 32) {
                            state.back = -1;
                            state.mode = TYPE;
                            break
                        }
                        if (here_op & 64) {
                            strm.msg = "invalid literal/length code";
                            state.mode = BAD;
                            break
                        }
                        state.extra = here_op & 15;
                        state.mode = LENEXT;
                    case LENEXT:
                        if (state.extra) {
                            n = state.extra;
                            while (bits < n) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            state.length += hold & (1 << state.extra) - 1;
                            hold >>>= state.extra;
                            bits -= state.extra;
                            state.back += state.extra
                        }
                        state.was = state.length;
                        state.mode = DIST;
                    case DIST:
                        for (; ; ) {
                            here = state.distcode[hold & (1 << state.distbits) - 1];
                            here_bits = here >>> 24;
                            here_op = here >>> 16 & 255;
                            here_val = here & 65535;
                            if (here_bits <= bits) {
                                break
                            }
                            if (have === 0) {
                                break inf_leave
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8
                        }
                        if ((here_op & 240) === 0) {
                            last_bits = here_bits;
                            last_op = here_op;
                            last_val = here_val;
                            for (; ; ) {
                                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                                here_bits = here >>> 24;
                                here_op = here >>> 16 & 255;
                                here_val = here & 65535;
                                if (last_bits + here_bits <= bits) {
                                    break
                                }
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            hold >>>= last_bits;
                            bits -= last_bits;
                            state.back += last_bits
                        }
                        hold >>>= here_bits;
                        bits -= here_bits;
                        state.back += here_bits;
                        if (here_op & 64) {
                            strm.msg = "invalid distance code";
                            state.mode = BAD;
                            break
                        }
                        state.offset = here_val;
                        state.extra = here_op & 15;
                        state.mode = DISTEXT;
                    case DISTEXT:
                        if (state.extra) {
                            n = state.extra;
                            while (bits < n) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            state.offset += hold & (1 << state.extra) - 1;
                            hold >>>= state.extra;
                            bits -= state.extra;
                            state.back += state.extra
                        }
                        if (state.offset > state.dmax) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break
                        }
                        state.mode = MATCH;
                    case MATCH:
                        if (left === 0) {
                            break inf_leave
                        }
                        copy = _out - left;
                        if (state.offset > copy) {
                            copy = state.offset - copy;
                            if (copy > state.whave) {
                                if (state.sane) {
                                    strm.msg = "invalid distance too far back";
                                    state.mode = BAD;
                                    break
                                }
                            }
                            if (copy > state.wnext) {
                                copy -= state.wnext;
                                from = state.wsize - copy
                            } else {
                                from = state.wnext - copy
                            }
                            if (copy > state.length) {
                                copy = state.length
                            }
                            from_source = state.window
                        } else {
                            from_source = output;
                            from = put - state.offset;
                            copy = state.length
                        }
                        if (copy > left) {
                            copy = left
                        }
                        left -= copy;
                        state.length -= copy;
                        do {
                            output[put++] = from_source[from++]
                        } while (--copy);
                        if (state.length === 0) {
                            state.mode = LEN
                        }
                        break;
                    case LIT:
                        if (left === 0) {
                            break inf_leave
                        }
                        output[put++] = state.length;
                        left--;
                        state.mode = LEN;
                        break;
                    case CHECK:
                        if (state.wrap) {
                            while (bits < 32) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold |= input[next++] << bits;
                                bits += 8
                            }
                            _out -= left;
                            strm.total_out += _out;
                            state.total += _out;
                            if (_out) {
                                strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out)
                            }
                            _out = left;
                            if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                                strm.msg = "incorrect data check";
                                state.mode = BAD;
                                break
                            }
                            hold = 0;
                            bits = 0
                        }
                        state.mode = LENGTH;
                    case LENGTH:
                        if (state.wrap && state.flags) {
                            while (bits < 32) {
                                if (have === 0) {
                                    break inf_leave
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8
                            }
                            if (hold !== (state.total & 4294967295)) {
                                strm.msg = "incorrect length check";
                                state.mode = BAD;
                                break
                            }
                            hold = 0;
                            bits = 0
                        }
                        state.mode = DONE;
                    case DONE:
                        ret = Z_STREAM_END;
                        break inf_leave;
                    case BAD:
                        ret = Z_DATA_ERROR;
                        break inf_leave;
                    case MEM:
                        return Z_MEM_ERROR;
                    case SYNC:
                    default:
                        return Z_STREAM_ERROR
                    }
                }
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
                    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
                        state.mode = MEM;
                        return Z_MEM_ERROR
                    }
                }
                _in -= strm.avail_in;
                _out -= strm.avail_out;
                strm.total_in += _in;
                strm.total_out += _out;
                state.total += _out;
                if (state.wrap && _out) {
                    strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out)
                }
                strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
                if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
                    ret = Z_BUF_ERROR
                }
                return ret
            }
            function inflateEnd(strm) {
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                var state = strm.state;
                if (state.window) {
                    state.window = null
                }
                strm.state = null;
                return Z_OK
            }
            function inflateGetHeader(strm, head) {
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                state = strm.state;
                if ((state.wrap & 2) === 0) {
                    return Z_STREAM_ERROR
                }
                state.head = head;
                head.done = false;
                return Z_OK
            }
            function inflateSetDictionary(strm, dictionary) {
                var dictLength = dictionary.length;
                var state;
                var dictid;
                var ret;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR
                }
                state = strm.state;
                if (state.wrap !== 0 && state.mode !== DICT) {
                    return Z_STREAM_ERROR
                }
                if (state.mode === DICT) {
                    dictid = 1;
                    dictid = adler32(dictid, dictionary, dictLength, 0);
                    if (dictid !== state.check) {
                        return Z_DATA_ERROR
                    }
                }
                ret = updatewindow(strm, dictionary, dictLength, dictLength);
                if (ret) {
                    state.mode = MEM;
                    return Z_MEM_ERROR
                }
                state.havedict = 1;
                return Z_OK
            }
            exports.inflateReset = inflateReset;
            exports.inflateReset2 = inflateReset2;
            exports.inflateResetKeep = inflateResetKeep;
            exports.inflateInit = inflateInit;
            exports.inflateInit2 = inflateInit2;
            exports.inflate = inflate;
            exports.inflateEnd = inflateEnd;
            exports.inflateGetHeader = inflateGetHeader;
            exports.inflateSetDictionary = inflateSetDictionary;
            exports.inflateInfo = "pako inflate (from Nodeca project)"
        }
        , {
            "../utils/common": 39,
            "./adler32": 40,
            "./crc32": 42,
            "./inffast": 44,
            "./inftrees": 46
        }],
        46: [function(require, module, exports) {
            "use strict";
            var utils = require("../utils/common");
            var MAXBITS = 15;
            var ENOUGH_LENS = 852;
            var ENOUGH_DISTS = 592;
            var CODES = 0;
            var LENS = 1;
            var DISTS = 2;
            var lbase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
            var lext = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78];
            var dbase = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];
            var dext = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
                var bits = opts.bits;
                var len = 0;
                var sym = 0;
                var min = 0
                  , max = 0;
                var root = 0;
                var curr = 0;
                var drop = 0;
                var left = 0;
                var used = 0;
                var huff = 0;
                var incr;
                var fill;
                var low;
                var mask;
                var next;
                var base = null;
                var base_index = 0;
                var end;
                var count = new utils.Buf16(MAXBITS + 1);
                var offs = new utils.Buf16(MAXBITS + 1);
                var extra = null;
                var extra_index = 0;
                var here_bits, here_op, here_val;
                for (len = 0; len <= MAXBITS; len++) {
                    count[len] = 0
                }
                for (sym = 0; sym < codes; sym++) {
                    count[lens[lens_index + sym]]++
                }
                root = bits;
                for (max = MAXBITS; max >= 1; max--) {
                    if (count[max] !== 0) {
                        break
                    }
                }
                if (root > max) {
                    root = max
                }
                if (max === 0) {
                    table[table_index++] = 1 << 24 | 64 << 16 | 0;
                    table[table_index++] = 1 << 24 | 64 << 16 | 0;
                    opts.bits = 1;
                    return 0
                }
                for (min = 1; min < max; min++) {
                    if (count[min] !== 0) {
                        break
                    }
                }
                if (root < min) {
                    root = min
                }
                left = 1;
                for (len = 1; len <= MAXBITS; len++) {
                    left <<= 1;
                    left -= count[len];
                    if (left < 0) {
                        return -1
                    }
                }
                if (left > 0 && (type === CODES || max !== 1)) {
                    return -1
                }
                offs[1] = 0;
                for (len = 1; len < MAXBITS; len++) {
                    offs[len + 1] = offs[len] + count[len]
                }
                for (sym = 0; sym < codes; sym++) {
                    if (lens[lens_index + sym] !== 0) {
                        work[offs[lens[lens_index + sym]]++] = sym
                    }
                }
                if (type === CODES) {
                    base = extra = work;
                    end = 19
                } else if (type === LENS) {
                    base = lbase;
                    base_index -= 257;
                    extra = lext;
                    extra_index -= 257;
                    end = 256
                } else {
                    base = dbase;
                    extra = dext;
                    end = -1
                }
                huff = 0;
                sym = 0;
                len = min;
                next = table_index;
                curr = root;
                drop = 0;
                low = -1;
                used = 1 << root;
                mask = used - 1;
                if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
                    return 1
                }
                for (; ; ) {
                    here_bits = len - drop;
                    if (work[sym] < end) {
                        here_op = 0;
                        here_val = work[sym]
                    } else if (work[sym] > end) {
                        here_op = extra[extra_index + work[sym]];
                        here_val = base[base_index + work[sym]]
                    } else {
                        here_op = 32 + 64;
                        here_val = 0
                    }
                    incr = 1 << len - drop;
                    fill = 1 << curr;
                    min = fill;
                    do {
                        fill -= incr;
                        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0
                    } while (fill !== 0);
                    incr = 1 << len - 1;
                    while (huff & incr) {
                        incr >>= 1
                    }
                    if (incr !== 0) {
                        huff &= incr - 1;
                        huff += incr
                    } else {
                        huff = 0
                    }
                    sym++;
                    if (--count[len] === 0) {
                        if (len === max) {
                            break
                        }
                        len = lens[lens_index + work[sym]]
                    }
                    if (len > root && (huff & mask) !== low) {
                        if (drop === 0) {
                            drop = root
                        }
                        next += min;
                        curr = len - drop;
                        left = 1 << curr;
                        while (curr + drop < max) {
                            left -= count[curr + drop];
                            if (left <= 0) {
                                break
                            }
                            curr++;
                            left <<= 1
                        }
                        used += 1 << curr;
                        if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
                            return 1
                        }
                        low = huff & mask;
                        table[low] = root << 24 | curr << 16 | next - table_index | 0
                    }
                }
                if (huff !== 0) {
                    table[next + huff] = len - drop << 24 | 64 << 16 | 0
                }
                opts.bits = root;
                return 0
            }
        }
        , {
            "../utils/common": 39
        }],
        47: [function(require, module, exports) {
            "use strict";
            module.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }
        , {}],
        48: [function(require, module, exports) {
            "use strict";
            var utils = require("../utils/common");
            var Z_FIXED = 4;
            var Z_BINARY = 0;
            var Z_TEXT = 1;
            var Z_UNKNOWN = 2;
            function zero(buf) {
                var len = buf.length;
                while (--len >= 0) {
                    buf[len] = 0
                }
            }
            var STORED_BLOCK = 0;
            var STATIC_TREES = 1;
            var DYN_TREES = 2;
            var MIN_MATCH = 3;
            var MAX_MATCH = 258;
            var LENGTH_CODES = 29;
            var LITERALS = 256;
            var L_CODES = LITERALS + 1 + LENGTH_CODES;
            var D_CODES = 30;
            var BL_CODES = 19;
            var HEAP_SIZE = 2 * L_CODES + 1;
            var MAX_BITS = 15;
            var Buf_size = 16;
            var MAX_BL_BITS = 7;
            var END_BLOCK = 256;
            var REP_3_6 = 16;
            var REPZ_3_10 = 17;
            var REPZ_11_138 = 18;
            var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
            var extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
            var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
            var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            var DIST_CODE_LEN = 512;
            var static_ltree = new Array((L_CODES + 2) * 2);
            zero(static_ltree);
            var static_dtree = new Array(D_CODES * 2);
            zero(static_dtree);
            var _dist_code = new Array(DIST_CODE_LEN);
            zero(_dist_code);
            var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
            zero(_length_code);
            var base_length = new Array(LENGTH_CODES);
            zero(base_length);
            var base_dist = new Array(D_CODES);
            zero(base_dist);
            function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
                this.static_tree = static_tree;
                this.extra_bits = extra_bits;
                this.extra_base = extra_base;
                this.elems = elems;
                this.max_length = max_length;
                this.has_stree = static_tree && static_tree.length
            }
            var static_l_desc;
            var static_d_desc;
            var static_bl_desc;
            function TreeDesc(dyn_tree, stat_desc) {
                this.dyn_tree = dyn_tree;
                this.max_code = 0;
                this.stat_desc = stat_desc
            }
            function d_code(dist) {
                return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)]
            }
            function put_short(s, w) {
                s.pending_buf[s.pending++] = w & 255;
                s.pending_buf[s.pending++] = w >>> 8 & 255
            }
            function send_bits(s, value, length) {
                if (s.bi_valid > Buf_size - length) {
                    s.bi_buf |= value << s.bi_valid & 65535;
                    put_short(s, s.bi_buf);
                    s.bi_buf = value >> Buf_size - s.bi_valid;
                    s.bi_valid += length - Buf_size
                } else {
                    s.bi_buf |= value << s.bi_valid & 65535;
                    s.bi_valid += length
                }
            }
            function send_code(s, c, tree) {
                send_bits(s, tree[c * 2], tree[c * 2 + 1])
            }
            function bi_reverse(code, len) {
                var res = 0;
                do {
                    res |= code & 1;
                    code >>>= 1;
                    res <<= 1
                } while (--len > 0);
                return res >>> 1
            }
            function bi_flush(s) {
                if (s.bi_valid === 16) {
                    put_short(s, s.bi_buf);
                    s.bi_buf = 0;
                    s.bi_valid = 0
                } else if (s.bi_valid >= 8) {
                    s.pending_buf[s.pending++] = s.bi_buf & 255;
                    s.bi_buf >>= 8;
                    s.bi_valid -= 8
                }
            }
            function gen_bitlen(s, desc) {
                var tree = desc.dyn_tree;
                var max_code = desc.max_code;
                var stree = desc.stat_desc.static_tree;
                var has_stree = desc.stat_desc.has_stree;
                var extra = desc.stat_desc.extra_bits;
                var base = desc.stat_desc.extra_base;
                var max_length = desc.stat_desc.max_length;
                var h;
                var n, m;
                var bits;
                var xbits;
                var f;
                var overflow = 0;
                for (bits = 0; bits <= MAX_BITS; bits++) {
                    s.bl_count[bits] = 0
                }
                tree[s.heap[s.heap_max] * 2 + 1] = 0;
                for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
                    n = s.heap[h];
                    bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
                    if (bits > max_length) {
                        bits = max_length;
                        overflow++
                    }
                    tree[n * 2 + 1] = bits;
                    if (n > max_code) {
                        continue
                    }
                    s.bl_count[bits]++;
                    xbits = 0;
                    if (n >= base) {
                        xbits = extra[n - base]
                    }
                    f = tree[n * 2];
                    s.opt_len += f * (bits + xbits);
                    if (has_stree) {
                        s.static_len += f * (stree[n * 2 + 1] + xbits)
                    }
                }
                if (overflow === 0) {
                    return
                }
                do {
                    bits = max_length - 1;
                    while (s.bl_count[bits] === 0) {
                        bits--
                    }
                    s.bl_count[bits]--;
                    s.bl_count[bits + 1] += 2;
                    s.bl_count[max_length]--;
                    overflow -= 2
                } while (overflow > 0);
                for (bits = max_length; bits !== 0; bits--) {
                    n = s.bl_count[bits];
                    while (n !== 0) {
                        m = s.heap[--h];
                        if (m > max_code) {
                            continue
                        }
                        if (tree[m * 2 + 1] !== bits) {
                            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
                            tree[m * 2 + 1] = bits
                        }
                        n--
                    }
                }
            }
            function gen_codes(tree, max_code, bl_count) {
                var next_code = new Array(MAX_BITS + 1);
                var code = 0;
                var bits;
                var n;
                for (bits = 1; bits <= MAX_BITS; bits++) {
                    next_code[bits] = code = code + bl_count[bits - 1] << 1
                }
                for (n = 0; n <= max_code; n++) {
                    var len = tree[n * 2 + 1];
                    if (len === 0) {
                        continue
                    }
                    tree[n * 2] = bi_reverse(next_code[len]++, len)
                }
            }
            function tr_static_init() {
                var n;
                var bits;
                var length;
                var code;
                var dist;
                var bl_count = new Array(MAX_BITS + 1);
                length = 0;
                for (code = 0; code < LENGTH_CODES - 1; code++) {
                    base_length[code] = length;
                    for (n = 0; n < 1 << extra_lbits[code]; n++) {
                        _length_code[length++] = code
                    }
                }
                _length_code[length - 1] = code;
                dist = 0;
                for (code = 0; code < 16; code++) {
                    base_dist[code] = dist;
                    for (n = 0; n < 1 << extra_dbits[code]; n++) {
                        _dist_code[dist++] = code
                    }
                }
                dist >>= 7;
                for (; code < D_CODES; code++) {
                    base_dist[code] = dist << 7;
                    for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
                        _dist_code[256 + dist++] = code
                    }
                }
                for (bits = 0; bits <= MAX_BITS; bits++) {
                    bl_count[bits] = 0
                }
                n = 0;
                while (n <= 143) {
                    static_ltree[n * 2 + 1] = 8;
                    n++;
                    bl_count[8]++
                }
                while (n <= 255) {
                    static_ltree[n * 2 + 1] = 9;
                    n++;
                    bl_count[9]++
                }
                while (n <= 279) {
                    static_ltree[n * 2 + 1] = 7;
                    n++;
                    bl_count[7]++
                }
                while (n <= 287) {
                    static_ltree[n * 2 + 1] = 8;
                    n++;
                    bl_count[8]++
                }
                gen_codes(static_ltree, L_CODES + 1, bl_count);
                for (n = 0; n < D_CODES; n++) {
                    static_dtree[n * 2 + 1] = 5;
                    static_dtree[n * 2] = bi_reverse(n, 5)
                }
                static_l_desc = new StaticTreeDesc(static_ltree,extra_lbits,LITERALS + 1,L_CODES,MAX_BITS);
                static_d_desc = new StaticTreeDesc(static_dtree,extra_dbits,0,D_CODES,MAX_BITS);
                static_bl_desc = new StaticTreeDesc(new Array(0),extra_blbits,0,BL_CODES,MAX_BL_BITS)
            }
            function init_block(s) {
                var n;
                for (n = 0; n < L_CODES; n++) {
                    s.dyn_ltree[n * 2] = 0
                }
                for (n = 0; n < D_CODES; n++) {
                    s.dyn_dtree[n * 2] = 0
                }
                for (n = 0; n < BL_CODES; n++) {
                    s.bl_tree[n * 2] = 0
                }
                s.dyn_ltree[END_BLOCK * 2] = 1;
                s.opt_len = s.static_len = 0;
                s.last_lit = s.matches = 0
            }
            function bi_windup(s) {
                if (s.bi_valid > 8) {
                    put_short(s, s.bi_buf)
                } else if (s.bi_valid > 0) {
                    s.pending_buf[s.pending++] = s.bi_buf
                }
                s.bi_buf = 0;
                s.bi_valid = 0
            }
            function copy_block(s, buf, len, header) {
                bi_windup(s);
                if (header) {
                    put_short(s, len);
                    put_short(s, ~len)
                }
                utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
                s.pending += len
            }
            function smaller(tree, n, m, depth) {
                var _n2 = n * 2;
                var _m2 = m * 2;
                return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m]
            }
            function pqdownheap(s, tree, k) {
                var v = s.heap[k];
                var j = k << 1;
                while (j <= s.heap_len) {
                    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
                        j++
                    }
                    if (smaller(tree, v, s.heap[j], s.depth)) {
                        break
                    }
                    s.heap[k] = s.heap[j];
                    k = j;
                    j <<= 1
                }
                s.heap[k] = v
            }
            function compress_block(s, ltree, dtree) {
                var dist;
                var lc;
                var lx = 0;
                var code;
                var extra;
                if (s.last_lit !== 0) {
                    do {
                        dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
                        lc = s.pending_buf[s.l_buf + lx];
                        lx++;
                        if (dist === 0) {
                            send_code(s, lc, ltree)
                        } else {
                            code = _length_code[lc];
                            send_code(s, code + LITERALS + 1, ltree);
                            extra = extra_lbits[code];
                            if (extra !== 0) {
                                lc -= base_length[code];
                                send_bits(s, lc, extra)
                            }
                            dist--;
                            code = d_code(dist);
                            send_code(s, code, dtree);
                            extra = extra_dbits[code];
                            if (extra !== 0) {
                                dist -= base_dist[code];
                                send_bits(s, dist, extra)
                            }
                        }
                    } while (lx < s.last_lit)
                }
                send_code(s, END_BLOCK, ltree)
            }
            function build_tree(s, desc) {
                var tree = desc.dyn_tree;
                var stree = desc.stat_desc.static_tree;
                var has_stree = desc.stat_desc.has_stree;
                var elems = desc.stat_desc.elems;
                var n, m;
                var max_code = -1;
                var node;
                s.heap_len = 0;
                s.heap_max = HEAP_SIZE;
                for (n = 0; n < elems; n++) {
                    if (tree[n * 2] !== 0) {
                        s.heap[++s.heap_len] = max_code = n;
                        s.depth[n] = 0
                    } else {
                        tree[n * 2 + 1] = 0
                    }
                }
                while (s.heap_len < 2) {
                    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
                    tree[node * 2] = 1;
                    s.depth[node] = 0;
                    s.opt_len--;
                    if (has_stree) {
                        s.static_len -= stree[node * 2 + 1]
                    }
                }
                desc.max_code = max_code;
                for (n = s.heap_len >> 1; n >= 1; n--) {
                    pqdownheap(s, tree, n)
                }
                node = elems;
                do {
                    n = s.heap[1];
                    s.heap[1] = s.heap[s.heap_len--];
                    pqdownheap(s, tree, 1);
                    m = s.heap[1];
                    s.heap[--s.heap_max] = n;
                    s.heap[--s.heap_max] = m;
                    tree[node * 2] = tree[n * 2] + tree[m * 2];
                    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
                    tree[n * 2 + 1] = tree[m * 2 + 1] = node;
                    s.heap[1] = node++;
                    pqdownheap(s, tree, 1)
                } while (s.heap_len >= 2);
                s.heap[--s.heap_max] = s.heap[1];
                gen_bitlen(s, desc);
                gen_codes(tree, max_code, s.bl_count)
            }
            function scan_tree(s, tree, max_code) {
                var n;
                var prevlen = -1;
                var curlen;
                var nextlen = tree[0 * 2 + 1];
                var count = 0;
                var max_count = 7;
                var min_count = 4;
                if (nextlen === 0) {
                    max_count = 138;
                    min_count = 3
                }
                tree[(max_code + 1) * 2 + 1] = 65535;
                for (n = 0; n <= max_code; n++) {
                    curlen = nextlen;
                    nextlen = tree[(n + 1) * 2 + 1];
                    if (++count < max_count && curlen === nextlen) {
                        continue
                    } else if (count < min_count) {
                        s.bl_tree[curlen * 2] += count
                    } else if (curlen !== 0) {
                        if (curlen !== prevlen) {
                            s.bl_tree[curlen * 2]++
                        }
                        s.bl_tree[REP_3_6 * 2]++
                    } else if (count <= 10) {
                        s.bl_tree[REPZ_3_10 * 2]++
                    } else {
                        s.bl_tree[REPZ_11_138 * 2]++
                    }
                    count = 0;
                    prevlen = curlen;
                    if (nextlen === 0) {
                        max_count = 138;
                        min_count = 3
                    } else if (curlen === nextlen) {
                        max_count = 6;
                        min_count = 3
                    } else {
                        max_count = 7;
                        min_count = 4
                    }
                }
            }
            function send_tree(s, tree, max_code) {
                var n;
                var prevlen = -1;
                var curlen;
                var nextlen = tree[0 * 2 + 1];
                var count = 0;
                var max_count = 7;
                var min_count = 4;
                if (nextlen === 0) {
                    max_count = 138;
                    min_count = 3
                }
                for (n = 0; n <= max_code; n++) {
                    curlen = nextlen;
                    nextlen = tree[(n + 1) * 2 + 1];
                    if (++count < max_count && curlen === nextlen) {
                        continue
                    } else if (count < min_count) {
                        do {
                            send_code(s, curlen, s.bl_tree)
                        } while (--count !== 0)
                    } else if (curlen !== 0) {
                        if (curlen !== prevlen) {
                            send_code(s, curlen, s.bl_tree);
                            count--
                        }
                        send_code(s, REP_3_6, s.bl_tree);
                        send_bits(s, count - 3, 2)
                    } else if (count <= 10) {
                        send_code(s, REPZ_3_10, s.bl_tree);
                        send_bits(s, count - 3, 3)
                    } else {
                        send_code(s, REPZ_11_138, s.bl_tree);
                        send_bits(s, count - 11, 7)
                    }
                    count = 0;
                    prevlen = curlen;
                    if (nextlen === 0) {
                        max_count = 138;
                        min_count = 3
                    } else if (curlen === nextlen) {
                        max_count = 6;
                        min_count = 3
                    } else {
                        max_count = 7;
                        min_count = 4
                    }
                }
            }
            function build_bl_tree(s) {
                var max_blindex;
                scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
                scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
                build_tree(s, s.bl_desc);
                for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
                    if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
                        break
                    }
                }
                s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
                return max_blindex
            }
            function send_all_trees(s, lcodes, dcodes, blcodes) {
                var rank;
                send_bits(s, lcodes - 257, 5);
                send_bits(s, dcodes - 1, 5);
                send_bits(s, blcodes - 4, 4);
                for (rank = 0; rank < blcodes; rank++) {
                    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3)
                }
                send_tree(s, s.dyn_ltree, lcodes - 1);
                send_tree(s, s.dyn_dtree, dcodes - 1)
            }
            function detect_data_type(s) {
                var black_mask = 4093624447;
                var n;
                for (n = 0; n <= 31; n++,
                black_mask >>>= 1) {
                    if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
                        return Z_BINARY
                    }
                }
                if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
                    return Z_TEXT
                }
                for (n = 32; n < LITERALS; n++) {
                    if (s.dyn_ltree[n * 2] !== 0) {
                        return Z_TEXT
                    }
                }
                return Z_BINARY
            }
            var static_init_done = false;
            function _tr_init(s) {
                if (!static_init_done) {
                    tr_static_init();
                    static_init_done = true
                }
                s.l_desc = new TreeDesc(s.dyn_ltree,static_l_desc);
                s.d_desc = new TreeDesc(s.dyn_dtree,static_d_desc);
                s.bl_desc = new TreeDesc(s.bl_tree,static_bl_desc);
                s.bi_buf = 0;
                s.bi_valid = 0;
                init_block(s)
            }
            function _tr_stored_block(s, buf, stored_len, last) {
                send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
                copy_block(s, buf, stored_len, true)
            }
            function _tr_align(s) {
                send_bits(s, STATIC_TREES << 1, 3);
                send_code(s, END_BLOCK, static_ltree);
                bi_flush(s)
            }
            function _tr_flush_block(s, buf, stored_len, last) {
                var opt_lenb, static_lenb;
                var max_blindex = 0;
                if (s.level > 0) {
                    if (s.strm.data_type === Z_UNKNOWN) {
                        s.strm.data_type = detect_data_type(s)
                    }
                    build_tree(s, s.l_desc);
                    build_tree(s, s.d_desc);
                    max_blindex = build_bl_tree(s);
                    opt_lenb = s.opt_len + 3 + 7 >>> 3;
                    static_lenb = s.static_len + 3 + 7 >>> 3;
                    if (static_lenb <= opt_lenb) {
                        opt_lenb = static_lenb
                    }
                } else {
                    opt_lenb = static_lenb = stored_len + 5
                }
                if (stored_len + 4 <= opt_lenb && buf !== -1) {
                    _tr_stored_block(s, buf, stored_len, last)
                } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
                    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
                    compress_block(s, static_ltree, static_dtree)
                } else {
                    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
                    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
                    compress_block(s, s.dyn_ltree, s.dyn_dtree)
                }
                init_block(s);
                if (last) {
                    bi_windup(s)
                }
            }
            function _tr_tally(s, dist, lc) {
                s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
                s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
                s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
                s.last_lit++;
                if (dist === 0) {
                    s.dyn_ltree[lc * 2]++
                } else {
                    s.matches++;
                    dist--;
                    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
                    s.dyn_dtree[d_code(dist) * 2]++
                }
                return s.last_lit === s.lit_bufsize - 1
            }
            exports._tr_init = _tr_init;
            exports._tr_stored_block = _tr_stored_block;
            exports._tr_flush_block = _tr_flush_block;
            exports._tr_tally = _tr_tally;
            exports._tr_align = _tr_align
        }
        , {
            "../utils/common": 39
        }],
        49: [function(require, module, exports) {
            "use strict";
            function ZStream() {
                this.input = null;
                this.next_in = 0;
                this.avail_in = 0;
                this.total_in = 0;
                this.output = null;
                this.next_out = 0;
                this.avail_out = 0;
                this.total_out = 0;
                this.msg = "";
                this.state = null;
                this.data_type = 2;
                this.adler = 0
            }
            module.exports = ZStream
        }
        , {}],
        50: [function(require, module, exports) {
            (function(process) {
                function normalizeArray(parts, allowAboveRoot) {
                    var up = 0;
                    for (var i = parts.length - 1; i >= 0; i--) {
                        var last = parts[i];
                        if (last === ".") {
                            parts.splice(i, 1)
                        } else if (last === "..") {
                            parts.splice(i, 1);
                            up++
                        } else if (up) {
                            parts.splice(i, 1);
                            up--
                        }
                    }
                    if (allowAboveRoot) {
                        for (; up--; up) {
                            parts.unshift("..")
                        }
                    }
                    return parts
                }
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                var splitPath = function(filename) {
                    return splitPathRe.exec(filename).slice(1)
                };
                exports.resolve = function() {
                    var resolvedPath = ""
                      , resolvedAbsolute = false;
                    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                        var path = i >= 0 ? arguments[i] : process.cwd();
                        if (typeof path !== "string") {
                            throw new TypeError("Arguments to path.resolve must be strings")
                        } else if (!path) {
                            continue
                        }
                        resolvedPath = path + "/" + resolvedPath;
                        resolvedAbsolute = path.charAt(0) === "/"
                    }
                    resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
                        return !!p
                    }), !resolvedAbsolute).join("/");
                    return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
                }
                ;
                exports.normalize = function(path) {
                    var isAbsolute = exports.isAbsolute(path)
                      , trailingSlash = substr(path, -1) === "/";
                    path = normalizeArray(filter(path.split("/"), function(p) {
                        return !!p
                    }), !isAbsolute).join("/");
                    if (!path && !isAbsolute) {
                        path = "."
                    }
                    if (path && trailingSlash) {
                        path += "/"
                    }
                    return (isAbsolute ? "/" : "") + path
                }
                ;
                exports.isAbsolute = function(path) {
                    return path.charAt(0) === "/"
                }
                ;
                exports.join = function() {
                    var paths = Array.prototype.slice.call(arguments, 0);
                    return exports.normalize(filter(paths, function(p, index) {
                        if (typeof p !== "string") {
                            throw new TypeError("Arguments to path.join must be strings")
                        }
                        return p
                    }).join("/"))
                }
                ;
                exports.relative = function(from, to) {
                    from = exports.resolve(from).substr(1);
                    to = exports.resolve(to).substr(1);
                    function trim(arr) {
                        var start = 0;
                        for (; start < arr.length; start++) {
                            if (arr[start] !== "")
                                break
                        }
                        var end = arr.length - 1;
                        for (; end >= 0; end--) {
                            if (arr[end] !== "")
                                break
                        }
                        if (start > end)
                            return [];
                        return arr.slice(start, end - start + 1)
                    }
                    var fromParts = trim(from.split("/"));
                    var toParts = trim(to.split("/"));
                    var length = Math.min(fromParts.length, toParts.length);
                    var samePartsLength = length;
                    for (var i = 0; i < length; i++) {
                        if (fromParts[i] !== toParts[i]) {
                            samePartsLength = i;
                            break
                        }
                    }
                    var outputParts = [];
                    for (var i = samePartsLength; i < fromParts.length; i++) {
                        outputParts.push("..")
                    }
                    outputParts = outputParts.concat(toParts.slice(samePartsLength));
                    return outputParts.join("/")
                }
                ;
                exports.sep = "/";
                exports.delimiter = ":";
                exports.dirname = function(path) {
                    var result = splitPath(path)
                      , root = result[0]
                      , dir = result[1];
                    if (!root && !dir) {
                        return "."
                    }
                    if (dir) {
                        dir = dir.substr(0, dir.length - 1)
                    }
                    return root + dir
                }
                ;
                exports.basename = function(path, ext) {
                    var f = splitPath(path)[2];
                    if (ext && f.substr(-1 * ext.length) === ext) {
                        f = f.substr(0, f.length - ext.length)
                    }
                    return f
                }
                ;
                exports.extname = function(path) {
                    return splitPath(path)[3]
                }
                ;
                function filter(xs, f) {
                    if (xs.filter)
                        return xs.filter(f);
                    var res = [];
                    for (var i = 0; i < xs.length; i++) {
                        if (f(xs[i], i, xs))
                            res.push(xs[i])
                    }
                    return res
                }
                var substr = "ab".substr(-1) === "b" ? function(str, start, len) {
                    return str.substr(start, len)
                }
                : function(str, start, len) {
                    if (start < 0)
                        start = str.length + start;
                    return str.substr(start, len)
                }
            }
            ).call(this, require("_process"))
        }
        , {
            _process: 73
        }],
        51: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var interlaceUtils = require("./interlace");
                var pixelBppMap = {
                    1: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 255
                    },
                    2: {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 1
                    },
                    3: {
                        0: 0,
                        1: 1,
                        2: 2,
                        3: 255
                    },
                    4: {
                        0: 0,
                        1: 1,
                        2: 2,
                        3: 3
                    }
                };
                function bitRetriever(data, depth) {
                    var leftOver = [];
                    var i = 0;
                    function split() {
                        if (i === data.length) {
                            throw new Error("Ran out of data")
                        }
                        var byte = data[i];
                        i++;
                        var byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
                        switch (depth) {
                        default:
                            throw new Error("unrecognised depth");
                        case 16:
                            byte2 = data[i];
                            i++;
                            leftOver.push((byte << 8) + byte2);
                            break;
                        case 4:
                            byte2 = byte & 15;
                            byte1 = byte >> 4;
                            leftOver.push(byte1, byte2);
                            break;
                        case 2:
                            byte4 = byte & 3;
                            byte3 = byte >> 2 & 3;
                            byte2 = byte >> 4 & 3;
                            byte1 = byte >> 6 & 3;
                            leftOver.push(byte1, byte2, byte3, byte4);
                            break;
                        case 1:
                            byte8 = byte & 1;
                            byte7 = byte >> 1 & 1;
                            byte6 = byte >> 2 & 1;
                            byte5 = byte >> 3 & 1;
                            byte4 = byte >> 4 & 1;
                            byte3 = byte >> 5 & 1;
                            byte2 = byte >> 6 & 1;
                            byte1 = byte >> 7 & 1;
                            leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
                            break
                        }
                    }
                    return {
                        get: function(count) {
                            while (leftOver.length < count) {
                                split()
                            }
                            var returner = leftOver.slice(0, count);
                            leftOver = leftOver.slice(count);
                            return returner
                        },
                        resetAfterLine: function() {
                            leftOver.length = 0
                        },
                        end: function() {
                            if (i !== data.length) {
                                throw new Error("extra data found")
                            }
                        }
                    }
                }
                function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
                    var imageWidth = image.width;
                    var imageHeight = image.height;
                    var imagePass = image.index;
                    for (var y = 0; y < imageHeight; y++) {
                        for (var x = 0; x < imageWidth; x++) {
                            var pxPos = getPxPos(x, y, imagePass);
                            for (var i = 0; i < 4; i++) {
                                var idx = pixelBppMap[bpp][i];
                                if (i === data.length) {
                                    throw new Error("Ran out of data")
                                }
                                pxData[pxPos + i] = idx !== 255 ? data[idx + rawPos] : 255
                            }
                            rawPos += bpp
                        }
                    }
                    return rawPos
                }
                function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
                    var imageWidth = image.width;
                    var imageHeight = image.height;
                    var imagePass = image.index;
                    for (var y = 0; y < imageHeight; y++) {
                        for (var x = 0; x < imageWidth; x++) {
                            var pixelData = bits.get(bpp);
                            var pxPos = getPxPos(x, y, imagePass);
                            for (var i = 0; i < 4; i++) {
                                var idx = pixelBppMap[bpp][i];
                                pxData[pxPos + i] = idx !== 255 ? pixelData[idx] : maxBit
                            }
                        }
                        bits.resetAfterLine()
                    }
                }
                exports.dataToBitMap = function(data, bitmapInfo) {
                    var width = bitmapInfo.width;
                    var height = bitmapInfo.height;
                    var depth = bitmapInfo.depth;
                    var bpp = bitmapInfo.bpp;
                    var interlace = bitmapInfo.interlace;
                    if (depth !== 8) {
                        var bits = bitRetriever(data, depth)
                    }
                    var pxData;
                    if (depth <= 8) {
                        pxData = new Buffer(width * height * 4)
                    } else {
                        pxData = new Uint16Array(width * height * 4)
                    }
                    var maxBit = Math.pow(2, depth) - 1;
                    var rawPos = 0;
                    var images;
                    var getPxPos;
                    if (interlace) {
                        images = interlaceUtils.getImagePasses(width, height);
                        getPxPos = interlaceUtils.getInterlaceIterator(width, height)
                    } else {
                        var nonInterlacedPxPos = 0;
                        getPxPos = function() {
                            var returner = nonInterlacedPxPos;
                            nonInterlacedPxPos += 4;
                            return returner
                        }
                        ;
                        images = [{
                            width: width,
                            height: height
                        }]
                    }
                    for (var imageIndex = 0; imageIndex < images.length; imageIndex++) {
                        if (depth === 8) {
                            rawPos = mapImage8Bit(images[imageIndex], pxData, getPxPos, bpp, data, rawPos)
                        } else {
                            mapImageCustomBit(images[imageIndex], pxData, getPxPos, bpp, bits, maxBit)
                        }
                    }
                    if (depth === 8) {
                        if (rawPos !== data.length) {
                            throw new Error("extra data found")
                        }
                    } else {
                        bits.end()
                    }
                    return pxData
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./interlace": 61,
            buffer: 7
        }],
        52: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var constants = require("./constants");
                module.exports = function(data, width, height, options) {
                    var outHasAlpha = options.colorType === constants.COLORTYPE_COLOR_ALPHA;
                    if (options.inputHasAlpha && outHasAlpha) {
                        return data
                    }
                    if (!options.inputHasAlpha && !outHasAlpha) {
                        return data
                    }
                    var outBpp = outHasAlpha ? 4 : 3;
                    var outData = new Buffer(width * height * outBpp);
                    var inBpp = options.inputHasAlpha ? 4 : 3;
                    var inIndex = 0;
                    var outIndex = 0;
                    var bgColor = options.bgColor || {};
                    if (bgColor.red === undefined) {
                        bgColor.red = 255
                    }
                    if (bgColor.green === undefined) {
                        bgColor.green = 255
                    }
                    if (bgColor.blue === undefined) {
                        bgColor.blue = 255
                    }
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            var red = data[inIndex];
                            var green = data[inIndex + 1];
                            var blue = data[inIndex + 2];
                            var alpha;
                            if (options.inputHasAlpha) {
                                alpha = data[inIndex + 3];
                                if (!outHasAlpha) {
                                    alpha /= 255;
                                    red = Math.min(Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0), 255);
                                    green = Math.min(Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0), 255);
                                    blue = Math.min(Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0), 255)
                                }
                            } else {
                                alpha = 255
                            }
                            outData[outIndex] = red;
                            outData[outIndex + 1] = green;
                            outData[outIndex + 2] = blue;
                            if (outHasAlpha) {
                                outData[outIndex + 3] = alpha
                            }
                            inIndex += inBpp;
                            outIndex += outBpp
                        }
                    }
                    return outData
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./constants": 54,
            buffer: 7
        }],
        53: [function(require, module, exports) {
            (function(process, Buffer) {
                "use strict";
                var util = require("util");
                var Stream = require("stream");
                var ChunkStream = module.exports = function() {
                    Stream.call(this);
                    this._buffers = [];
                    this._buffered = 0;
                    this._reads = [];
                    this._paused = false;
                    this._encoding = "utf8";
                    this.writable = true
                }
                ;
                util.inherits(ChunkStream, Stream);
                ChunkStream.prototype.read = function(length, callback) {
                    this._reads.push({
                        length: Math.abs(length),
                        allowLess: length < 0,
                        func: callback
                    });
                    process.nextTick(function() {
                        this._process();
                        if (this._paused && this._reads.length > 0) {
                            this._paused = false;
                            this.emit("drain")
                        }
                    }
                    .bind(this))
                }
                ;
                ChunkStream.prototype.write = function(data, encoding) {
                    if (!this.writable) {
                        this.emit("error", new Error("Stream not writable"));
                        return false
                    }
                    var dataBuffer;
                    if (Buffer.isBuffer(data)) {
                        dataBuffer = data
                    } else {
                        dataBuffer = new Buffer(data,encoding || this._encoding)
                    }
                    this._buffers.push(dataBuffer);
                    this._buffered += dataBuffer.length;
                    this._process();
                    if (this._reads && this._reads.length === 0) {
                        this._paused = true
                    }
                    return this.writable && !this._paused
                }
                ;
                ChunkStream.prototype.end = function(data, encoding) {
                    if (data) {
                        this.write(data, encoding)
                    }
                    this.writable = false;
                    if (!this._buffers) {
                        return
                    }
                    if (this._buffers.length === 0) {
                        this._end()
                    } else {
                        this._buffers.push(null);
                        this._process()
                    }
                }
                ;
                ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
                ChunkStream.prototype._end = function() {
                    if (this._reads.length > 0) {
                        this.emit("error", new Error("There are some read requests waitng on finished stream"))
                    }
                    this.destroy()
                }
                ;
                ChunkStream.prototype.destroy = function() {
                    if (!this._buffers) {
                        return
                    }
                    this.writable = false;
                    this._reads = null;
                    this._buffers = null;
                    this.emit("close")
                }
                ;
                ChunkStream.prototype._processReadAllowingLess = function(read) {
                    this._reads.shift();
                    var smallerBuf = this._buffers[0];
                    if (smallerBuf.length > read.length) {
                        this._buffered -= read.length;
                        this._buffers[0] = smallerBuf.slice(read.length);
                        read.func.call(this, smallerBuf.slice(0, read.length))
                    } else {
                        this._buffered -= smallerBuf.length;
                        this._buffers.shift();
                        read.func.call(this, smallerBuf)
                    }
                }
                ;
                ChunkStream.prototype._processRead = function(read) {
                    this._reads.shift();
                    var pos = 0;
                    var count = 0;
                    var data = new Buffer(read.length);
                    while (pos < read.length) {
                        var buf = this._buffers[count++];
                        var len = Math.min(buf.length, read.length - pos);
                        buf.copy(data, pos, 0, len);
                        pos += len;
                        if (len !== buf.length) {
                            this._buffers[--count] = buf.slice(len)
                        }
                    }
                    if (count > 0) {
                        this._buffers.splice(0, count)
                    }
                    this._buffered -= read.length;
                    read.func.call(this, data)
                }
                ;
                ChunkStream.prototype._process = function() {
                    try {
                        while (this._buffered > 0 && this._reads && this._reads.length > 0) {
                            var read = this._reads[0];
                            if (read.allowLess) {
                                this._processReadAllowingLess(read)
                            } else if (this._buffered >= read.length) {
                                this._processRead(read)
                            } else {
                                break
                            }
                        }
                        if (this._buffers && this._buffers.length > 0 && this._buffers[0] === null) {
                            this._end()
                        }
                    } catch (ex) {
                        this.emit("error", ex)
                    }
                }
            }
            ).call(this, require("_process"), require("buffer").Buffer)
        }
        , {
            _process: 73,
            buffer: 7,
            stream: 82,
            util: 104
        }],
        54: [function(require, module, exports) {
            "use strict";
            module.exports = {
                PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
                TYPE_IHDR: 1229472850,
                TYPE_IEND: 1229278788,
                TYPE_IDAT: 1229209940,
                TYPE_PLTE: 1347179589,
                TYPE_tRNS: 1951551059,
                TYPE_gAMA: 1732332865,
                COLORTYPE_GRAYSCALE: 0,
                COLORTYPE_PALETTE: 1,
                COLORTYPE_COLOR: 2,
                COLORTYPE_ALPHA: 4,
                COLORTYPE_PALETTE_COLOR: 3,
                COLORTYPE_COLOR_ALPHA: 6,
                COLORTYPE_TO_BPP_MAP: {
                    0: 1,
                    2: 3,
                    3: 1,
                    4: 2,
                    6: 4
                },
                GAMMA_DIVISION: 1e5
            }
        }
        , {}],
        55: [function(require, module, exports) {
            "use strict";
            var crcTable = [];
            (function() {
                for (var i = 0; i < 256; i++) {
                    var currentCrc = i;
                    for (var j = 0; j < 8; j++) {
                        if (currentCrc & 1) {
                            currentCrc = 3988292384 ^ currentCrc >>> 1
                        } else {
                            currentCrc = currentCrc >>> 1
                        }
                    }
                    crcTable[i] = currentCrc
                }
            }
            )();
            var CrcCalculator = module.exports = function() {
                this._crc = -1
            }
            ;
            CrcCalculator.prototype.write = function(data) {
                for (var i = 0; i < data.length; i++) {
                    this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8
                }
                return true
            }
            ;
            CrcCalculator.prototype.crc32 = function() {
                return this._crc ^ -1
            }
            ;
            CrcCalculator.crc32 = function(buf) {
                var crc = -1;
                for (var i = 0; i < buf.length; i++) {
                    crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8
                }
                return crc ^ -1
            }
        }
        , {}],
        56: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var paethPredictor = require("./paeth-predictor");
                function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
                    pxData.copy(rawData, rawPos, pxPos, pxPos + byteWidth)
                }
                function filterSumNone(pxData, pxPos, byteWidth) {
                    var sum = 0;
                    var length = pxPos + byteWidth;
                    for (var i = pxPos; i < length; i++) {
                        sum += Math.abs(pxData[i])
                    }
                    return sum
                }
                function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
                    for (var x = 0; x < byteWidth; x++) {
                        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
                        var val = pxData[pxPos + x] - left;
                        rawData[rawPos + x] = val
                    }
                }
                function filterSumSub(pxData, pxPos, byteWidth, bpp) {
                    var sum = 0;
                    for (var x = 0; x < byteWidth; x++) {
                        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
                        var val = pxData[pxPos + x] - left;
                        sum += Math.abs(val)
                    }
                    return sum
                }
                function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
                    for (var x = 0; x < byteWidth; x++) {
                        var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
                        var val = pxData[pxPos + x] - up;
                        rawData[rawPos + x] = val
                    }
                }
                function filterSumUp(pxData, pxPos, byteWidth) {
                    var sum = 0;
                    var length = pxPos + byteWidth;
                    for (var x = pxPos; x < length; x++) {
                        var up = pxPos > 0 ? pxData[x - byteWidth] : 0;
                        var val = pxData[x] - up;
                        sum += Math.abs(val)
                    }
                    return sum
                }
                function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
                    for (var x = 0; x < byteWidth; x++) {
                        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
                        var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
                        var val = pxData[pxPos + x] - (left + up >> 1);
                        rawData[rawPos + x] = val
                    }
                }
                function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
                    var sum = 0;
                    for (var x = 0; x < byteWidth; x++) {
                        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
                        var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
                        var val = pxData[pxPos + x] - (left + up >> 1);
                        sum += Math.abs(val)
                    }
                    return sum
                }
                function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
                    for (var x = 0; x < byteWidth; x++) {
                        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
                        var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
                        var upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
                        var val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
                        rawData[rawPos + x] = val
                    }
                }
                function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
                    var sum = 0;
                    for (var x = 0; x < byteWidth; x++) {
                        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
                        var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
                        var upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
                        var val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
                        sum += Math.abs(val)
                    }
                    return sum
                }
                var filters = {
                    0: filterNone,
                    1: filterSub,
                    2: filterUp,
                    3: filterAvg,
                    4: filterPaeth
                };
                var filterSums = {
                    0: filterSumNone,
                    1: filterSumSub,
                    2: filterSumUp,
                    3: filterSumAvg,
                    4: filterSumPaeth
                };
                module.exports = function(pxData, width, height, options, bpp) {
                    var filterTypes;
                    if (!("filterType"in options) || options.filterType === -1) {
                        filterTypes = [0, 1, 2, 3, 4]
                    } else if (typeof options.filterType === "number") {
                        filterTypes = [options.filterType]
                    } else {
                        throw new Error("unrecognised filter types")
                    }
                    var byteWidth = width * bpp;
                    var rawPos = 0;
                    var pxPos = 0;
                    var rawData = new Buffer((byteWidth + 1) * height);
                    var sel = filterTypes[0];
                    for (var y = 0; y < height; y++) {
                        if (filterTypes.length > 1) {
                            var min = Infinity;
                            for (var i = 0; i < filterTypes.length; i++) {
                                var sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
                                if (sum < min) {
                                    sel = filterTypes[i];
                                    min = sum
                                }
                            }
                        }
                        rawData[rawPos] = sel;
                        rawPos++;
                        filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
                        rawPos += byteWidth;
                        pxPos += byteWidth
                    }
                    return rawData
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./paeth-predictor": 65,
            buffer: 7
        }],
        57: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var util = require("util");
                var ChunkStream = require("./chunkstream");
                var Filter = require("./filter-parse");
                var FilterAsync = module.exports = function(bitmapInfo) {
                    ChunkStream.call(this);
                    var buffers = [];
                    var that = this;
                    this._filter = new Filter(bitmapInfo,{
                        read: this.read.bind(this),
                        write: function(buffer) {
                            buffers.push(buffer)
                        },
                        complete: function() {
                            that.emit("complete", Buffer.concat(buffers))
                        }
                    });
                    this._filter.start()
                }
                ;
                util.inherits(FilterAsync, ChunkStream)
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./chunkstream": 53,
            "./filter-parse": 59,
            buffer: 7,
            util: 104
        }],
        58: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var SyncReader = require("./sync-reader");
                var Filter = require("./filter-parse");
                exports.process = function(inBuffer, bitmapInfo) {
                    var outBuffers = [];
                    var reader = new SyncReader(inBuffer);
                    var filter = new Filter(bitmapInfo,{
                        read: reader.read.bind(reader),
                        write: function(bufferPart) {
                            outBuffers.push(bufferPart)
                        },
                        complete: function() {}
                    });
                    filter.start();
                    reader.process();
                    return Buffer.concat(outBuffers)
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./filter-parse": 59,
            "./sync-reader": 71,
            buffer: 7
        }],
        59: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var interlaceUtils = require("./interlace");
                var paethPredictor = require("./paeth-predictor");
                function getByteWidth(width, bpp, depth) {
                    var byteWidth = width * bpp;
                    if (depth !== 8) {
                        byteWidth = Math.ceil(byteWidth / (8 / depth))
                    }
                    return byteWidth
                }
                var Filter = module.exports = function(bitmapInfo, dependencies) {
                    var width = bitmapInfo.width;
                    var height = bitmapInfo.height;
                    var interlace = bitmapInfo.interlace;
                    var bpp = bitmapInfo.bpp;
                    var depth = bitmapInfo.depth;
                    this.read = dependencies.read;
                    this.write = dependencies.write;
                    this.complete = dependencies.complete;
                    this._imageIndex = 0;
                    this._images = [];
                    if (interlace) {
                        var passes = interlaceUtils.getImagePasses(width, height);
                        for (var i = 0; i < passes.length; i++) {
                            this._images.push({
                                byteWidth: getByteWidth(passes[i].width, bpp, depth),
                                height: passes[i].height,
                                lineIndex: 0
                            })
                        }
                    } else {
                        this._images.push({
                            byteWidth: getByteWidth(width, bpp, depth),
                            height: height,
                            lineIndex: 0
                        })
                    }
                    if (depth === 8) {
                        this._xComparison = bpp
                    } else if (depth === 16) {
                        this._xComparison = bpp * 2
                    } else {
                        this._xComparison = 1
                    }
                }
                ;
                Filter.prototype.start = function() {
                    this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this))
                }
                ;
                Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
                    var xComparison = this._xComparison;
                    var xBiggerThan = xComparison - 1;
                    for (var x = 0; x < byteWidth; x++) {
                        var rawByte = rawData[1 + x];
                        var f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
                        unfilteredLine[x] = rawByte + f1Left
                    }
                }
                ;
                Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
                    var lastLine = this._lastLine;
                    for (var x = 0; x < byteWidth; x++) {
                        var rawByte = rawData[1 + x];
                        var f2Up = lastLine ? lastLine[x] : 0;
                        unfilteredLine[x] = rawByte + f2Up
                    }
                }
                ;
                Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
                    var xComparison = this._xComparison;
                    var xBiggerThan = xComparison - 1;
                    var lastLine = this._lastLine;
                    for (var x = 0; x < byteWidth; x++) {
                        var rawByte = rawData[1 + x];
                        var f3Up = lastLine ? lastLine[x] : 0;
                        var f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
                        var f3Add = Math.floor((f3Left + f3Up) / 2);
                        unfilteredLine[x] = rawByte + f3Add
                    }
                }
                ;
                Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
                    var xComparison = this._xComparison;
                    var xBiggerThan = xComparison - 1;
                    var lastLine = this._lastLine;
                    for (var x = 0; x < byteWidth; x++) {
                        var rawByte = rawData[1 + x];
                        var f4Up = lastLine ? lastLine[x] : 0;
                        var f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
                        var f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
                        var f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
                        unfilteredLine[x] = rawByte + f4Add
                    }
                }
                ;
                Filter.prototype._reverseFilterLine = function(rawData) {
                    var filter = rawData[0];
                    var unfilteredLine;
                    var currentImage = this._images[this._imageIndex];
                    var byteWidth = currentImage.byteWidth;
                    if (filter === 0) {
                        unfilteredLine = rawData.slice(1, byteWidth + 1)
                    } else {
                        unfilteredLine = new Buffer(byteWidth);
                        switch (filter) {
                        case 1:
                            this._unFilterType1(rawData, unfilteredLine, byteWidth);
                            break;
                        case 2:
                            this._unFilterType2(rawData, unfilteredLine, byteWidth);
                            break;
                        case 3:
                            this._unFilterType3(rawData, unfilteredLine, byteWidth);
                            break;
                        case 4:
                            this._unFilterType4(rawData, unfilteredLine, byteWidth);
                            break;
                        default:
                            throw new Error("Unrecognised filter type - " + filter)
                        }
                    }
                    this.write(unfilteredLine);
                    currentImage.lineIndex++;
                    if (currentImage.lineIndex >= currentImage.height) {
                        this._lastLine = null;
                        this._imageIndex++;
                        currentImage = this._images[this._imageIndex]
                    } else {
                        this._lastLine = unfilteredLine
                    }
                    if (currentImage) {
                        this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this))
                    } else {
                        this._lastLine = null;
                        this.complete()
                    }
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./interlace": 61,
            "./paeth-predictor": 65,
            buffer: 7
        }],
        60: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                function dePalette(indata, outdata, width, height, palette) {
                    var pxPos = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            var color = palette[indata[pxPos]];
                            if (!color) {
                                throw new Error("index " + indata[pxPos] + " not in palette")
                            }
                            for (var i = 0; i < 4; i++) {
                                outdata[pxPos + i] = color[i]
                            }
                            pxPos += 4
                        }
                    }
                }
                function replaceTransparentColor(indata, outdata, width, height, transColor) {
                    var pxPos = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            var makeTrans = false;
                            if (transColor.length === 1) {
                                if (transColor[0] === indata[pxPos]) {
                                    makeTrans = true
                                }
                            } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
                                makeTrans = true
                            }
                            if (makeTrans) {
                                for (var i = 0; i < 4; i++) {
                                    outdata[pxPos + i] = 0
                                }
                            }
                            pxPos += 4
                        }
                    }
                }
                function scaleDepth(indata, outdata, width, height, depth) {
                    var maxOutSample = 255;
                    var maxInSample = Math.pow(2, depth) - 1;
                    var pxPos = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            for (var i = 0; i < 4; i++) {
                                outdata[pxPos + i] = Math.floor(indata[pxPos + i] * maxOutSample / maxInSample + .5)
                            }
                            pxPos += 4
                        }
                    }
                }
                module.exports = function(indata, imageData) {
                    var depth = imageData.depth;
                    var width = imageData.width;
                    var height = imageData.height;
                    var colorType = imageData.colorType;
                    var transColor = imageData.transColor;
                    var palette = imageData.palette;
                    var outdata = indata;
                    if (colorType === 3) {
                        dePalette(indata, outdata, width, height, palette)
                    } else {
                        if (transColor) {
                            replaceTransparentColor(indata, outdata, width, height, transColor)
                        }
                        if (depth !== 8) {
                            if (depth === 16) {
                                outdata = new Buffer(width * height * 4)
                            }
                            scaleDepth(indata, outdata, width, height, depth)
                        }
                    }
                    return outdata
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            buffer: 7
        }],
        61: [function(require, module, exports) {
            "use strict";
            var imagePasses = [{
                x: [0],
                y: [0]
            }, {
                x: [4],
                y: [0]
            }, {
                x: [0, 4],
                y: [4]
            }, {
                x: [2, 6],
                y: [0, 4]
            }, {
                x: [0, 2, 4, 6],
                y: [2, 6]
            }, {
                x: [1, 3, 5, 7],
                y: [0, 2, 4, 6]
            }, {
                x: [0, 1, 2, 3, 4, 5, 6, 7],
                y: [1, 3, 5, 7]
            }];
            exports.getImagePasses = function(width, height) {
                var images = [];
                var xLeftOver = width % 8;
                var yLeftOver = height % 8;
                var xRepeats = (width - xLeftOver) / 8;
                var yRepeats = (height - yLeftOver) / 8;
                for (var i = 0; i < imagePasses.length; i++) {
                    var pass = imagePasses[i];
                    var passWidth = xRepeats * pass.x.length;
                    var passHeight = yRepeats * pass.y.length;
                    for (var j = 0; j < pass.x.length; j++) {
                        if (pass.x[j] < xLeftOver) {
                            passWidth++
                        } else {
                            break
                        }
                    }
                    for (j = 0; j < pass.y.length; j++) {
                        if (pass.y[j] < yLeftOver) {
                            passHeight++
                        } else {
                            break
                        }
                    }
                    if (passWidth > 0 && passHeight > 0) {
                        images.push({
                            width: passWidth,
                            height: passHeight,
                            index: i
                        })
                    }
                }
                return images
            }
            ;
            exports.getInterlaceIterator = function(width) {
                return function(x, y, pass) {
                    var outerXLeftOver = x % imagePasses[pass].x.length;
                    var outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
                    var outerYLeftOver = y % imagePasses[pass].y.length;
                    var outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
                    return outerX * 4 + outerY * width * 4
                }
            }
        }
        , {}],
        62: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var util = require("util");
                var Stream = require("stream");
                var constants = require("./constants");
                var Packer = require("./packer");
                var PackerAsync = module.exports = function(opt) {
                    Stream.call(this);
                    var options = opt || {};
                    this._packer = new Packer(options);
                    this._deflate = this._packer.createDeflate();
                    this.readable = true
                }
                ;
                util.inherits(PackerAsync, Stream);
                PackerAsync.prototype.pack = function(data, width, height, gamma) {
                    this.emit("data", new Buffer(constants.PNG_SIGNATURE));
                    this.emit("data", this._packer.packIHDR(width, height));
                    if (gamma) {
                        this.emit("data", this._packer.packGAMA(gamma))
                    }
                    var filteredData = this._packer.filterData(data, width, height);
                    this._deflate.on("error", this.emit.bind(this, "error"));
                    this._deflate.on("data", function(compressedData) {
                        this.emit("data", this._packer.packIDAT(compressedData))
                    }
                    .bind(this));
                    this._deflate.on("end", function() {
                        this.emit("data", this._packer.packIEND());
                        this.emit("end")
                    }
                    .bind(this));
                    this._deflate.end(filteredData)
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./constants": 54,
            "./packer": 64,
            buffer: 7,
            stream: 82,
            util: 104
        }],
        63: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var hasSyncZlib = true;
                var zlib = require("zlib");
                if (!zlib.deflateSync) {
                    hasSyncZlib = false
                }
                var constants = require("./constants");
                var Packer = require("./packer");
                module.exports = function(metaData, opt) {
                    if (!hasSyncZlib) {
                        throw new Error("To use the sync capability of this library in old node versions, please also add a dependency on node-zlb-backport")
                    }
                    var options = opt || {};
                    var packer = new Packer(options);
                    var chunks = [];
                    chunks.push(new Buffer(constants.PNG_SIGNATURE));
                    chunks.push(packer.packIHDR(metaData.width, metaData.height));
                    if (metaData.gamma) {
                        chunks.push(packer.packGAMA(metaData.gamma))
                    }
                    var filteredData = packer.filterData(metaData.data, metaData.width, metaData.height);
                    var compressedData = zlib.deflateSync(filteredData, packer.getDeflateOptions());
                    filteredData = null;
                    if (!compressedData || !compressedData.length) {
                        throw new Error("bad png - invalid compressed data response")
                    }
                    chunks.push(packer.packIDAT(compressedData));
                    chunks.push(packer.packIEND());
                    return Buffer.concat(chunks)
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./constants": 54,
            "./packer": 64,
            buffer: 7,
            zlib: 6
        }],
        64: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var constants = require("./constants");
                var CrcStream = require("./crc");
                var bitPacker = require("./bitpacker");
                var filter = require("./filter-pack");
                var zlib = require("zlib");
                var Packer = module.exports = function(options) {
                    this._options = options;
                    options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
                    options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
                    options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
                    options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
                    options.deflateFactory = options.deflateFactory || zlib.createDeflate;
                    options.bitDepth = options.bitDepth || 8;
                    options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
                    if (options.colorType !== constants.COLORTYPE_COLOR && options.colorType !== constants.COLORTYPE_COLOR_ALPHA) {
                        throw new Error("option color type:" + options.colorType + " is not supported at present")
                    }
                    if (options.bitDepth !== 8) {
                        throw new Error("option bit depth:" + options.bitDepth + " is not supported at present")
                    }
                }
                ;
                Packer.prototype.getDeflateOptions = function() {
                    return {
                        chunkSize: this._options.deflateChunkSize,
                        level: this._options.deflateLevel,
                        strategy: this._options.deflateStrategy
                    }
                }
                ;
                Packer.prototype.createDeflate = function() {
                    return this._options.deflateFactory(this.getDeflateOptions())
                }
                ;
                Packer.prototype.filterData = function(data, width, height) {
                    var packedData = bitPacker(data, width, height, this._options);
                    var bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
                    var filteredData = filter(packedData, width, height, this._options, bpp);
                    return filteredData
                }
                ;
                Packer.prototype._packChunk = function(type, data) {
                    var len = data ? data.length : 0;
                    var buf = new Buffer(len + 12);
                    buf.writeUInt32BE(len, 0);
                    buf.writeUInt32BE(type, 4);
                    if (data) {
                        data.copy(buf, 8)
                    }
                    buf.writeInt32BE(CrcStream.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
                    return buf
                }
                ;
                Packer.prototype.packGAMA = function(gamma) {
                    var buf = new Buffer(4);
                    buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
                    return this._packChunk(constants.TYPE_gAMA, buf)
                }
                ;
                Packer.prototype.packIHDR = function(width, height) {
                    var buf = new Buffer(13);
                    buf.writeUInt32BE(width, 0);
                    buf.writeUInt32BE(height, 4);
                    buf[8] = this._options.bitDepth;
                    buf[9] = this._options.colorType;
                    buf[10] = 0;
                    buf[11] = 0;
                    buf[12] = 0;
                    return this._packChunk(constants.TYPE_IHDR, buf)
                }
                ;
                Packer.prototype.packIDAT = function(data) {
                    return this._packChunk(constants.TYPE_IDAT, data)
                }
                ;
                Packer.prototype.packIEND = function() {
                    return this._packChunk(constants.TYPE_IEND, null)
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./bitpacker": 52,
            "./constants": 54,
            "./crc": 55,
            "./filter-pack": 56,
            buffer: 7,
            zlib: 6
        }],
        65: [function(require, module, exports) {
            "use strict";
            module.exports = function paethPredictor(left, above, upLeft) {
                var paeth = left + above - upLeft;
                var pLeft = Math.abs(paeth - left);
                var pAbove = Math.abs(paeth - above);
                var pUpLeft = Math.abs(paeth - upLeft);
                if (pLeft <= pAbove && pLeft <= pUpLeft) {
                    return left
                }
                if (pAbove <= pUpLeft) {
                    return above
                }
                return upLeft
            }
        }
        , {}],
        66: [function(require, module, exports) {
            "use strict";
            var util = require("util");
            var zlib = require("zlib");
            var ChunkStream = require("./chunkstream");
            var FilterAsync = require("./filter-parse-async");
            var Parser = require("./parser");
            var bitmapper = require("./bitmapper");
            var formatNormaliser = require("./format-normaliser");
            var ParserAsync = module.exports = function(options) {
                ChunkStream.call(this);
                this._parser = new Parser(options,{
                    read: this.read.bind(this),
                    error: this._handleError.bind(this),
                    metadata: this._handleMetaData.bind(this),
                    gamma: this.emit.bind(this, "gamma"),
                    palette: this._handlePalette.bind(this),
                    transColor: this._handleTransColor.bind(this),
                    finished: this._finished.bind(this),
                    inflateData: this._inflateData.bind(this)
                });
                this._options = options;
                this.writable = true;
                this._parser.start()
            }
            ;
            util.inherits(ParserAsync, ChunkStream);
            ParserAsync.prototype._handleError = function(err) {
                this.emit("error", err);
                this.writable = false;
                this.destroy();
                if (this._inflate && this._inflate.destroy) {
                    this._inflate.destroy()
                }
                this.errord = true
            }
            ;
            ParserAsync.prototype._inflateData = function(data) {
                if (!this._inflate) {
                    this._inflate = zlib.createInflate();
                    this._inflate.on("error", this.emit.bind(this, "error"));
                    this._filter.on("complete", this._complete.bind(this));
                    this._inflate.pipe(this._filter)
                }
                this._inflate.write(data)
            }
            ;
            ParserAsync.prototype._handleMetaData = function(metaData) {
                this.emit("metadata", metaData);
                this._bitmapInfo = Object.create(metaData);
                this._filter = new FilterAsync(this._bitmapInfo)
            }
            ;
            ParserAsync.prototype._handleTransColor = function(transColor) {
                this._bitmapInfo.transColor = transColor
            }
            ;
            ParserAsync.prototype._handlePalette = function(palette) {
                this._bitmapInfo.palette = palette
            }
            ;
            ParserAsync.prototype._finished = function() {
                if (this.errord) {
                    return
                }
                if (!this._inflate) {
                    this.emit("error", "No Inflate block")
                } else {
                    this._inflate.end()
                }
                this.destroySoon()
            }
            ;
            ParserAsync.prototype._complete = function(filteredData) {
                if (this.errord) {
                    return
                }
                try {
                    var bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
                    var normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo);
                    bitmapData = null
                } catch (ex) {
                    this._handleError(ex);
                    return
                }
                this.emit("parsed", normalisedBitmapData)
            }
        }
        , {
            "./bitmapper": 51,
            "./chunkstream": 53,
            "./filter-parse-async": 57,
            "./format-normaliser": 60,
            "./parser": 68,
            util: 104,
            zlib: 6
        }],
        67: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var hasSyncZlib = true;
                var zlib = require("zlib");
                if (!zlib.deflateSync) {
                    hasSyncZlib = false
                }
                var SyncReader = require("./sync-reader");
                var FilterSync = require("./filter-parse-sync");
                var Parser = require("./parser");
                var bitmapper = require("./bitmapper");
                var formatNormaliser = require("./format-normaliser");
                module.exports = function(buffer, options) {
                    if (!hasSyncZlib) {
                        throw new Error("To use the sync capability of this library in old node versions, please also add a dependency on node-zlb-backport")
                    }
                    var err;
                    function handleError(_err_) {
                        err = _err_
                    }
                    var metaData;
                    function handleMetaData(_metaData_) {
                        metaData = _metaData_
                    }
                    function handleTransColor(transColor) {
                        metaData.transColor = transColor
                    }
                    function handlePalette(palette) {
                        metaData.palette = palette
                    }
                    var gamma;
                    function handleGamma(_gamma_) {
                        gamma = _gamma_
                    }
                    var inflateDataList = [];
                    function handleInflateData(inflatedData) {
                        inflateDataList.push(inflatedData)
                    }
                    var reader = new SyncReader(buffer);
                    var parser = new Parser(options,{
                        read: reader.read.bind(reader),
                        error: handleError,
                        metadata: handleMetaData,
                        gamma: handleGamma,
                        palette: handlePalette,
                        transColor: handleTransColor,
                        inflateData: handleInflateData
                    });
                    parser.start();
                    reader.process();
                    if (err) {
                        throw err
                    }
                    var inflateData = Buffer.concat(inflateDataList);
                    inflateDataList.length = 0;
                    var inflatedData = zlib.inflateSync(inflateData);
                    inflateData = null;
                    if (!inflatedData || !inflatedData.length) {
                        throw new Error("bad png - invalid inflate data response")
                    }
                    var unfilteredData = FilterSync.process(inflatedData, metaData);
                    inflateData = null;
                    var bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
                    unfilteredData = null;
                    var normalisedBitmapData = formatNormaliser(bitmapData, metaData);
                    metaData.data = normalisedBitmapData;
                    metaData.gamma = gamma || 0;
                    return metaData
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./bitmapper": 51,
            "./filter-parse-sync": 58,
            "./format-normaliser": 60,
            "./parser": 68,
            "./sync-reader": 71,
            buffer: 7,
            zlib: 6
        }],
        68: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var constants = require("./constants");
                var CrcCalculator = require("./crc");
                var Parser = module.exports = function(options, dependencies) {
                    this._options = options;
                    options.checkCRC = options.checkCRC !== false;
                    this._hasIHDR = false;
                    this._hasIEND = false;
                    this._palette = [];
                    this._colorType = 0;
                    this._chunks = {};
                    this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
                    this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
                    this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
                    this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
                    this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
                    this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
                    this.read = dependencies.read;
                    this.error = dependencies.error;
                    this.metadata = dependencies.metadata;
                    this.gamma = dependencies.gamma;
                    this.transColor = dependencies.transColor;
                    this.palette = dependencies.palette;
                    this.parsed = dependencies.parsed;
                    this.inflateData = dependencies.inflateData;
                    this.inflateData = dependencies.inflateData;
                    this.finished = dependencies.finished
                }
                ;
                Parser.prototype.start = function() {
                    this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this))
                }
                ;
                Parser.prototype._parseSignature = function(data) {
                    var signature = constants.PNG_SIGNATURE;
                    for (var i = 0; i < signature.length; i++) {
                        if (data[i] !== signature[i]) {
                            this.error(new Error("Invalid file signature"));
                            return
                        }
                    }
                    this.read(8, this._parseChunkBegin.bind(this))
                }
                ;
                Parser.prototype._parseChunkBegin = function(data) {
                    var length = data.readUInt32BE(0);
                    var type = data.readUInt32BE(4);
                    var name = "";
                    for (var i = 4; i < 8; i++) {
                        name += String.fromCharCode(data[i])
                    }
                    var ancillary = Boolean(data[4] & 32);
                    if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
                        this.error(new Error("Expected IHDR on beggining"));
                        return
                    }
                    this._crc = new CrcCalculator;
                    this._crc.write(new Buffer(name));
                    if (this._chunks[type]) {
                        return this._chunks[type](length)
                    }
                    if (!ancillary) {
                        this.error(new Error("Unsupported critical chunk type " + name));
                        return
                    }
                    this.read(length + 4, this._skipChunk.bind(this))
                }
                ;
                Parser.prototype._skipChunk = function() {
                    this.read(8, this._parseChunkBegin.bind(this))
                }
                ;
                Parser.prototype._handleChunkEnd = function() {
                    this.read(4, this._parseChunkEnd.bind(this))
                }
                ;
                Parser.prototype._parseChunkEnd = function(data) {
                    var fileCrc = data.readInt32BE(0);
                    var calcCrc = this._crc.crc32();
                    if (this._options.checkCRC && calcCrc !== fileCrc) {
                        this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
                        return
                    }
                    if (!this._hasIEND) {
                        this.read(8, this._parseChunkBegin.bind(this))
                    }
                }
                ;
                Parser.prototype._handleIHDR = function(length) {
                    this.read(length, this._parseIHDR.bind(this))
                }
                ;
                Parser.prototype._parseIHDR = function(data) {
                    this._crc.write(data);
                    var width = data.readUInt32BE(0);
                    var height = data.readUInt32BE(4);
                    var depth = data[8];
                    var colorType = data[9];
                    var compr = data[10];
                    var filter = data[11];
                    var interlace = data[12];
                    if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
                        this.error(new Error("Unsupported bit depth " + depth));
                        return
                    }
                    if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
                        this.error(new Error("Unsupported color type"));
                        return
                    }
                    if (compr !== 0) {
                        this.error(new Error("Unsupported compression method"));
                        return
                    }
                    if (filter !== 0) {
                        this.error(new Error("Unsupported filter method"));
                        return
                    }
                    if (interlace !== 0 && interlace !== 1) {
                        this.error(new Error("Unsupported interlace method"));
                        return
                    }
                    this._colorType = colorType;
                    var bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
                    this._hasIHDR = true;
                    this.metadata({
                        width: width,
                        height: height,
                        depth: depth,
                        interlace: Boolean(interlace),
                        palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
                        color: Boolean(colorType & constants.COLORTYPE_COLOR),
                        alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
                        bpp: bpp,
                        colorType: colorType
                    });
                    this._handleChunkEnd()
                }
                ;
                Parser.prototype._handlePLTE = function(length) {
                    this.read(length, this._parsePLTE.bind(this))
                }
                ;
                Parser.prototype._parsePLTE = function(data) {
                    this._crc.write(data);
                    var entries = Math.floor(data.length / 3);
                    for (var i = 0; i < entries; i++) {
                        this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255])
                    }
                    this.palette(this._palette);
                    this._handleChunkEnd()
                }
                ;
                Parser.prototype._handleTRNS = function(length) {
                    this.read(length, this._parseTRNS.bind(this))
                }
                ;
                Parser.prototype._parseTRNS = function(data) {
                    this._crc.write(data);
                    if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
                        if (this._palette.length === 0) {
                            this.error(new Error("Transparency chunk must be after palette"));
                            return
                        }
                        if (data.length > this._palette.length) {
                            this.error(new Error("More transparent colors than palette size"));
                            return
                        }
                        for (var i = 0; i < data.length; i++) {
                            this._palette[i][3] = data[i]
                        }
                        this.palette(this._palette)
                    }
                    if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
                        this.transColor([data.readUInt16BE(0)])
                    }
                    if (this._colorType === constants.COLORTYPE_COLOR) {
                        this.transColor([data.readUInt16BE(0), data.readUInt16BE(2), data.readUInt16BE(4)])
                    }
                    this._handleChunkEnd()
                }
                ;
                Parser.prototype._handleGAMA = function(length) {
                    this.read(length, this._parseGAMA.bind(this))
                }
                ;
                Parser.prototype._parseGAMA = function(data) {
                    this._crc.write(data);
                    this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);
                    this._handleChunkEnd()
                }
                ;
                Parser.prototype._handleIDAT = function(length) {
                    this.read(-length, this._parseIDAT.bind(this, length))
                }
                ;
                Parser.prototype._parseIDAT = function(length, data) {
                    this._crc.write(data);
                    if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
                        throw new Error("Expected palette not found")
                    }
                    this.inflateData(data);
                    var leftOverLength = length - data.length;
                    if (leftOverLength > 0) {
                        this._handleIDAT(leftOverLength)
                    } else {
                        this._handleChunkEnd()
                    }
                }
                ;
                Parser.prototype._handleIEND = function(length) {
                    this.read(length, this._parseIEND.bind(this))
                }
                ;
                Parser.prototype._parseIEND = function(data) {
                    this._crc.write(data);
                    this._hasIEND = true;
                    this._handleChunkEnd();
                    if (this.finished) {
                        this.finished()
                    }
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            "./constants": 54,
            "./crc": 55,
            buffer: 7
        }],
        69: [function(require, module, exports) {
            "use strict";
            var parse = require("./parser-sync");
            var pack = require("./packer-sync");
            exports.read = function(buffer, options) {
                return parse(buffer, options || {})
            }
            ;
            exports.write = function(png) {
                return pack(png)
            }
        }
        , {
            "./packer-sync": 63,
            "./parser-sync": 67
        }],
        70: [function(require, module, exports) {
            (function(process, Buffer) {
                "use strict";
                var util = require("util");
                var Stream = require("stream");
                var Parser = require("./parser-async");
                var Packer = require("./packer-async");
                var PNGSync = require("./png-sync");
                var PNG = exports.PNG = function(options) {
                    Stream.call(this);
                    options = options || {};
                    this.width = options.width || 0;
                    this.height = options.height || 0;
                    this.data = this.width > 0 && this.height > 0 ? new Buffer(4 * this.width * this.height) : null;
                    if (options.fill && this.data) {
                        this.data.fill(0)
                    }
                    this.gamma = 0;
                    this.readable = this.writable = true;
                    this._parser = new Parser(options);
                    this._parser.on("error", this.emit.bind(this, "error"));
                    this._parser.on("close", this._handleClose.bind(this));
                    this._parser.on("metadata", this._metadata.bind(this));
                    this._parser.on("gamma", this._gamma.bind(this));
                    this._parser.on("parsed", function(data) {
                        this.data = data;
                        this.emit("parsed", data)
                    }
                    .bind(this));
                    this._packer = new Packer(options);
                    this._packer.on("data", this.emit.bind(this, "data"));
                    this._packer.on("end", this.emit.bind(this, "end"));
                    this._parser.on("close", this._handleClose.bind(this));
                    this._packer.on("error", this.emit.bind(this, "error"))
                }
                ;
                util.inherits(PNG, Stream);
                PNG.sync = PNGSync;
                PNG.prototype.pack = function() {
                    if (!this.data || !this.data.length) {
                        this.emit("error", "No data provided");
                        return this
                    }
                    process.nextTick(function() {
                        this._packer.pack(this.data, this.width, this.height, this.gamma)
                    }
                    .bind(this));
                    return this
                }
                ;
                PNG.prototype.parse = function(data, callback) {
                    if (callback) {
                        var onParsed, onError;
                        onParsed = function(parsedData) {
                            this.removeListener("error", onError);
                            this.data = parsedData;
                            callback(null, this)
                        }
                        .bind(this);
                        onError = function(err) {
                            this.removeListener("parsed", onParsed);
                            callback(err, null)
                        }
                        .bind(this);
                        this.once("parsed", onParsed);
                        this.once("error", onError)
                    }
                    this.end(data);
                    return this
                }
                ;
                PNG.prototype.write = function(data) {
                    this._parser.write(data);
                    return true
                }
                ;
                PNG.prototype.end = function(data) {
                    this._parser.end(data)
                }
                ;
                PNG.prototype._metadata = function(metadata) {
                    this.width = metadata.width;
                    this.height = metadata.height;
                    this.emit("metadata", metadata)
                }
                ;
                PNG.prototype._gamma = function(gamma) {
                    this.gamma = gamma
                }
                ;
                PNG.prototype._handleClose = function() {
                    if (!this._parser.writable && !this._packer.readable) {
                        this.emit("close")
                    }
                }
                ;
                PNG.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
                    if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
                        throw new Error("bitblt reading outside image")
                    }
                    if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
                        throw new Error("bitblt writing outside image")
                    }
                    for (var y = 0; y < height; y++) {
                        src.data.copy(dst.data, (deltaY + y) * dst.width + deltaX << 2, (srcY + y) * src.width + srcX << 2, (srcY + y) * src.width + srcX + width << 2)
                    }
                }
                ;
                PNG.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
                    PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
                    return this
                }
                ;
                PNG.adjustGamma = function(src) {
                    if (src.gamma) {
                        for (var y = 0; y < src.height; y++) {
                            for (var x = 0; x < src.width; x++) {
                                var idx = src.width * y + x << 2;
                                for (var i = 0; i < 3; i++) {
                                    var sample = src.data[idx + i] / 255;
                                    sample = Math.pow(sample, 1 / 2.2 / src.gamma);
                                    src.data[idx + i] = Math.round(sample * 255)
                                }
                            }
                        }
                        src.gamma = 0
                    }
                }
                ;
                PNG.prototype.adjustGamma = function() {
                    PNG.adjustGamma(this)
                }
            }
            ).call(this, require("_process"), require("buffer").Buffer)
        }
        , {
            "./packer-async": 62,
            "./parser-async": 66,
            "./png-sync": 69,
            _process: 73,
            buffer: 7,
            stream: 82,
            util: 104
        }],
        71: [function(require, module, exports) {
            "use strict";
            var SyncReader = module.exports = function(buffer) {
                this._buffer = buffer;
                this._reads = []
            }
            ;
            SyncReader.prototype.read = function(length, callback) {
                this._reads.push({
                    length: Math.abs(length),
                    allowLess: length < 0,
                    func: callback
                })
            }
            ;
            SyncReader.prototype.process = function() {
                while (this._reads.length > 0 && this._buffer.length) {
                    var read = this._reads[0];
                    if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
                        this._reads.shift();
                        var buf = this._buffer;
                        this._buffer = buf.slice(read.length);
                        read.func.call(this, buf.slice(0, read.length))
                    } else {
                        break
                    }
                }
                if (this._reads.length > 0) {
                    return new Error("There are some read requests waitng on finished stream")
                }
                if (this._buffer.length > 0) {
                    return new Error("unrecognised content at end of stream")
                }
            }
        }
        , {}],
        72: [function(require, module, exports) {
            (function(process) {
                "use strict";
                if (!process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
                    module.exports = nextTick
                } else {
                    module.exports = process.nextTick
                }
                function nextTick(fn, arg1, arg2, arg3) {
                    if (typeof fn !== "function") {
                        throw new TypeError('"callback" argument must be a function')
                    }
                    var len = arguments.length;
                    var args, i;
                    switch (len) {
                    case 0:
                    case 1:
                        return process.nextTick(fn);
                    case 2:
                        return process.nextTick(function afterTickOne() {
                            fn.call(null, arg1)
                        });
                    case 3:
                        return process.nextTick(function afterTickTwo() {
                            fn.call(null, arg1, arg2)
                        });
                    case 4:
                        return process.nextTick(function afterTickThree() {
                            fn.call(null, arg1, arg2, arg3)
                        });
                    default:
                        args = new Array(len - 1);
                        i = 0;
                        while (i < args.length) {
                            args[i++] = arguments[i]
                        }
                        return process.nextTick(function afterTick() {
                            fn.apply(null, args)
                        })
                    }
                }
            }
            ).call(this, require("_process"))
        }
        , {
            _process: 73
        }],
        73: [function(require, module, exports) {
            var process = module.exports = {};
            var cachedSetTimeout;
            var cachedClearTimeout;
            function defaultSetTimout() {
                throw new Error("setTimeout has not been defined")
            }
            function defaultClearTimeout() {
                throw new Error("clearTimeout has not been defined")
            }
            (function() {
                try {
                    if (typeof setTimeout === "function") {
                        cachedSetTimeout = setTimeout
                    } else {
                        cachedSetTimeout = defaultSetTimout
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout
                }
                try {
                    if (typeof clearTimeout === "function") {
                        cachedClearTimeout = clearTimeout
                    } else {
                        cachedClearTimeout = defaultClearTimeout
                    }
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout
                }
            }
            )();
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    return setTimeout(fun, 0)
                }
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0)
                }
                try {
                    return cachedSetTimeout(fun, 0)
                } catch (e) {
                    try {
                        return cachedSetTimeout.call(null, fun, 0)
                    } catch (e) {
                        return cachedSetTimeout.call(this, fun, 0)
                    }
                }
            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    return clearTimeout(marker)
                }
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker)
                }
                try {
                    return cachedClearTimeout(marker)
                } catch (e) {
                    try {
                        return cachedClearTimeout.call(null, marker)
                    } catch (e) {
                        return cachedClearTimeout.call(this, marker)
                    }
                }
            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;
            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue)
                } else {
                    queueIndex = -1
                }
                if (queue.length) {
                    drainQueue()
                }
            }
            function drainQueue() {
                if (draining) {
                    return
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run()
                        }
                    }
                    queueIndex = -1;
                    len = queue.length
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout)
            }
            process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i]
                    }
                }
                queue.push(new Item(fun,args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue)
                }
            }
            ;
            function Item(fun, array) {
                this.fun = fun;
                this.array = array
            }
            Item.prototype.run = function() {
                this.fun.apply(null, this.array)
            }
            ;
            process.title = "browser";
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = "";
            process.versions = {};
            function noop() {}
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;
            process.listeners = function(name) {
                return []
            }
            ;
            process.binding = function(name) {
                throw new Error("process.binding is not supported")
            }
            ;
            process.cwd = function() {
                return "/"
            }
            ;
            process.chdir = function(dir) {
                throw new Error("process.chdir is not supported")
            }
            ;
            process.umask = function() {
                return 0
            }
        }
        , {}],
        74: [function(require, module, exports) {
            arguments[4][19][0].apply(exports, arguments)
        }
        , {
            "./_stream_readable": 76,
            "./_stream_writable": 78,
            _process: 73,
            "core-util-is": 9,
            dup: 19,
            inherits: 26
        }],
        75: [function(require, module, exports) {
            arguments[4][20][0].apply(exports, arguments)
        }
        , {
            "./_stream_transform": 77,
            "core-util-is": 9,
            dup: 20,
            inherits: 26
        }],
        76: [function(require, module, exports) {
            (function(process) {
                module.exports = Readable;
                var isArray = require("isarray");
                var Buffer = require("buffer").Buffer;
                Readable.ReadableState = ReadableState;
                var EE = require("events").EventEmitter;
                if (!EE.listenerCount)
                    EE.listenerCount = function(emitter, type) {
                        return emitter.listeners(type).length
                    }
                    ;
                var Stream = require("stream");
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var StringDecoder;
                util.inherits(Readable, Stream);
                function ReadableState(options, stream) {
                    options = options || {};
                    var hwm = options.highWaterMark;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : 16 * 1024;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.buffer = [];
                    this.length = 0;
                    this.pipes = null;
                    this.pipesCount = 0;
                    this.flowing = false;
                    this.ended = false;
                    this.endEmitted = false;
                    this.reading = false;
                    this.calledRead = false;
                    this.sync = true;
                    this.needReadable = false;
                    this.emittedReadable = false;
                    this.readableListening = false;
                    this.objectMode = !!options.objectMode;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.ranOut = false;
                    this.awaitDrain = 0;
                    this.readingMore = false;
                    this.decoder = null;
                    this.encoding = null;
                    if (options.encoding) {
                        if (!StringDecoder)
                            StringDecoder = require("string_decoder/").StringDecoder;
                        this.decoder = new StringDecoder(options.encoding);
                        this.encoding = options.encoding
                    }
                }
                function Readable(options) {
                    if (!(this instanceof Readable))
                        return new Readable(options);
                    this._readableState = new ReadableState(options,this);
                    this.readable = true;
                    Stream.call(this)
                }
                Readable.prototype.push = function(chunk, encoding) {
                    var state = this._readableState;
                    if (typeof chunk === "string" && !state.objectMode) {
                        encoding = encoding || state.defaultEncoding;
                        if (encoding !== state.encoding) {
                            chunk = new Buffer(chunk,encoding);
                            encoding = ""
                        }
                    }
                    return readableAddChunk(this, state, chunk, encoding, false)
                }
                ;
                Readable.prototype.unshift = function(chunk) {
                    var state = this._readableState;
                    return readableAddChunk(this, state, chunk, "", true)
                }
                ;
                function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                    var er = chunkInvalid(state, chunk);
                    if (er) {
                        stream.emit("error", er)
                    } else if (chunk === null || chunk === undefined) {
                        state.reading = false;
                        if (!state.ended)
                            onEofChunk(stream, state)
                    } else if (state.objectMode || chunk && chunk.length > 0) {
                        if (state.ended && !addToFront) {
                            var e = new Error("stream.push() after EOF");
                            stream.emit("error", e)
                        } else if (state.endEmitted && addToFront) {
                            var e = new Error("stream.unshift() after end event");
                            stream.emit("error", e)
                        } else {
                            if (state.decoder && !addToFront && !encoding)
                                chunk = state.decoder.write(chunk);
                            state.length += state.objectMode ? 1 : chunk.length;
                            if (addToFront) {
                                state.buffer.unshift(chunk)
                            } else {
                                state.reading = false;
                                state.buffer.push(chunk)
                            }
                            if (state.needReadable)
                                emitReadable(stream);
                            maybeReadMore(stream, state)
                        }
                    } else if (!addToFront) {
                        state.reading = false
                    }
                    return needMoreData(state)
                }
                function needMoreData(state) {
                    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0)
                }
                Readable.prototype.setEncoding = function(enc) {
                    if (!StringDecoder)
                        StringDecoder = require("string_decoder/").StringDecoder;
                    this._readableState.decoder = new StringDecoder(enc);
                    this._readableState.encoding = enc
                }
                ;
                var MAX_HWM = 8388608;
                function roundUpToNextPowerOf2(n) {
                    if (n >= MAX_HWM) {
                        n = MAX_HWM
                    } else {
                        n--;
                        for (var p = 1; p < 32; p <<= 1)
                            n |= n >> p;
                        n++
                    }
                    return n
                }
                function howMuchToRead(n, state) {
                    if (state.length === 0 && state.ended)
                        return 0;
                    if (state.objectMode)
                        return n === 0 ? 0 : 1;
                    if (n === null || isNaN(n)) {
                        if (state.flowing && state.buffer.length)
                            return state.buffer[0].length;
                        else
                            return state.length
                    }
                    if (n <= 0)
                        return 0;
                    if (n > state.highWaterMark)
                        state.highWaterMark = roundUpToNextPowerOf2(n);
                    if (n > state.length) {
                        if (!state.ended) {
                            state.needReadable = true;
                            return 0
                        } else
                            return state.length
                    }
                    return n
                }
                Readable.prototype.read = function(n) {
                    var state = this._readableState;
                    state.calledRead = true;
                    var nOrig = n;
                    var ret;
                    if (typeof n !== "number" || n > 0)
                        state.emittedReadable = false;
                    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
                        emitReadable(this);
                        return null
                    }
                    n = howMuchToRead(n, state);
                    if (n === 0 && state.ended) {
                        ret = null;
                        if (state.length > 0 && state.decoder) {
                            ret = fromList(n, state);
                            state.length -= ret.length
                        }
                        if (state.length === 0)
                            endReadable(this);
                        return ret
                    }
                    var doRead = state.needReadable;
                    if (state.length - n <= state.highWaterMark)
                        doRead = true;
                    if (state.ended || state.reading)
                        doRead = false;
                    if (doRead) {
                        state.reading = true;
                        state.sync = true;
                        if (state.length === 0)
                            state.needReadable = true;
                        this._read(state.highWaterMark);
                        state.sync = false
                    }
                    if (doRead && !state.reading)
                        n = howMuchToRead(nOrig, state);
                    if (n > 0)
                        ret = fromList(n, state);
                    else
                        ret = null;
                    if (ret === null) {
                        state.needReadable = true;
                        n = 0
                    }
                    state.length -= n;
                    if (state.length === 0 && !state.ended)
                        state.needReadable = true;
                    if (state.ended && !state.endEmitted && state.length === 0)
                        endReadable(this);
                    return ret
                }
                ;
                function chunkInvalid(state, chunk) {
                    var er = null;
                    if (!Buffer.isBuffer(chunk) && "string" !== typeof chunk && chunk !== null && chunk !== undefined && !state.objectMode) {
                        er = new TypeError("Invalid non-string/buffer chunk")
                    }
                    return er
                }
                function onEofChunk(stream, state) {
                    if (state.decoder && !state.ended) {
                        var chunk = state.decoder.end();
                        if (chunk && chunk.length) {
                            state.buffer.push(chunk);
                            state.length += state.objectMode ? 1 : chunk.length
                        }
                    }
                    state.ended = true;
                    if (state.length > 0)
                        emitReadable(stream);
                    else
                        endReadable(stream)
                }
                function emitReadable(stream) {
                    var state = stream._readableState;
                    state.needReadable = false;
                    if (state.emittedReadable)
                        return;
                    state.emittedReadable = true;
                    if (state.sync)
                        process.nextTick(function() {
                            emitReadable_(stream)
                        });
                    else
                        emitReadable_(stream)
                }
                function emitReadable_(stream) {
                    stream.emit("readable")
                }
                function maybeReadMore(stream, state) {
                    if (!state.readingMore) {
                        state.readingMore = true;
                        process.nextTick(function() {
                            maybeReadMore_(stream, state)
                        })
                    }
                }
                function maybeReadMore_(stream, state) {
                    var len = state.length;
                    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
                        stream.read(0);
                        if (len === state.length)
                            break;
                        else
                            len = state.length
                    }
                    state.readingMore = false
                }
                Readable.prototype._read = function(n) {
                    this.emit("error", new Error("not implemented"))
                }
                ;
                Readable.prototype.pipe = function(dest, pipeOpts) {
                    var src = this;
                    var state = this._readableState;
                    switch (state.pipesCount) {
                    case 0:
                        state.pipes = dest;
                        break;
                    case 1:
                        state.pipes = [state.pipes, dest];
                        break;
                    default:
                        state.pipes.push(dest);
                        break
                    }
                    state.pipesCount += 1;
                    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
                    var endFn = doEnd ? onend : cleanup;
                    if (state.endEmitted)
                        process.nextTick(endFn);
                    else
                        src.once("end", endFn);
                    dest.on("unpipe", onunpipe);
                    function onunpipe(readable) {
                        if (readable !== src)
                            return;
                        cleanup()
                    }
                    function onend() {
                        dest.end()
                    }
                    var ondrain = pipeOnDrain(src);
                    dest.on("drain", ondrain);
                    function cleanup() {
                        dest.removeListener("close", onclose);
                        dest.removeListener("finish", onfinish);
                        dest.removeListener("drain", ondrain);
                        dest.removeListener("error", onerror);
                        dest.removeListener("unpipe", onunpipe);
                        src.removeListener("end", onend);
                        src.removeListener("end", cleanup);
                        if (!dest._writableState || dest._writableState.needDrain)
                            ondrain()
                    }
                    function onerror(er) {
                        unpipe();
                        dest.removeListener("error", onerror);
                        if (EE.listenerCount(dest, "error") === 0)
                            dest.emit("error", er)
                    }
                    if (!dest._events || !dest._events.error)
                        dest.on("error", onerror);
                    else if (isArray(dest._events.error))
                        dest._events.error.unshift(onerror);
                    else
                        dest._events.error = [onerror, dest._events.error];
                    function onclose() {
                        dest.removeListener("finish", onfinish);
                        unpipe()
                    }
                    dest.once("close", onclose);
                    function onfinish() {
                        dest.removeListener("close", onclose);
                        unpipe()
                    }
                    dest.once("finish", onfinish);
                    function unpipe() {
                        src.unpipe(dest)
                    }
                    dest.emit("pipe", src);
                    if (!state.flowing) {
                        this.on("readable", pipeOnReadable);
                        state.flowing = true;
                        process.nextTick(function() {
                            flow(src)
                        })
                    }
                    return dest
                }
                ;
                function pipeOnDrain(src) {
                    return function() {
                        var dest = this;
                        var state = src._readableState;
                        state.awaitDrain--;
                        if (state.awaitDrain === 0)
                            flow(src)
                    }
                }
                function flow(src) {
                    var state = src._readableState;
                    var chunk;
                    state.awaitDrain = 0;
                    function write(dest, i, list) {
                        var written = dest.write(chunk);
                        if (false === written) {
                            state.awaitDrain++
                        }
                    }
                    while (state.pipesCount && null !== (chunk = src.read())) {
                        if (state.pipesCount === 1)
                            write(state.pipes, 0, null);
                        else
                            forEach(state.pipes, write);
                        src.emit("data", chunk);
                        if (state.awaitDrain > 0)
                            return
                    }
                    if (state.pipesCount === 0) {
                        state.flowing = false;
                        if (EE.listenerCount(src, "data") > 0)
                            emitDataEvents(src);
                        return
                    }
                    state.ranOut = true
                }
                function pipeOnReadable() {
                    if (this._readableState.ranOut) {
                        this._readableState.ranOut = false;
                        flow(this)
                    }
                }
                Readable.prototype.unpipe = function(dest) {
                    var state = this._readableState;
                    if (state.pipesCount === 0)
                        return this;
                    if (state.pipesCount === 1) {
                        if (dest && dest !== state.pipes)
                            return this;
                        if (!dest)
                            dest = state.pipes;
                        state.pipes = null;
                        state.pipesCount = 0;
                        this.removeListener("readable", pipeOnReadable);
                        state.flowing = false;
                        if (dest)
                            dest.emit("unpipe", this);
                        return this
                    }
                    if (!dest) {
                        var dests = state.pipes;
                        var len = state.pipesCount;
                        state.pipes = null;
                        state.pipesCount = 0;
                        this.removeListener("readable", pipeOnReadable);
                        state.flowing = false;
                        for (var i = 0; i < len; i++)
                            dests[i].emit("unpipe", this);
                        return this
                    }
                    var i = indexOf(state.pipes, dest);
                    if (i === -1)
                        return this;
                    state.pipes.splice(i, 1);
                    state.pipesCount -= 1;
                    if (state.pipesCount === 1)
                        state.pipes = state.pipes[0];
                    dest.emit("unpipe", this);
                    return this
                }
                ;
                Readable.prototype.on = function(ev, fn) {
                    var res = Stream.prototype.on.call(this, ev, fn);
                    if (ev === "data" && !this._readableState.flowing)
                        emitDataEvents(this);
                    if (ev === "readable" && this.readable) {
                        var state = this._readableState;
                        if (!state.readableListening) {
                            state.readableListening = true;
                            state.emittedReadable = false;
                            state.needReadable = true;
                            if (!state.reading) {
                                this.read(0)
                            } else if (state.length) {
                                emitReadable(this, state)
                            }
                        }
                    }
                    return res
                }
                ;
                Readable.prototype.addListener = Readable.prototype.on;
                Readable.prototype.resume = function() {
                    emitDataEvents(this);
                    this.read(0);
                    this.emit("resume")
                }
                ;
                Readable.prototype.pause = function() {
                    emitDataEvents(this, true);
                    this.emit("pause")
                }
                ;
                function emitDataEvents(stream, startPaused) {
                    var state = stream._readableState;
                    if (state.flowing) {
                        throw new Error("Cannot switch to old mode now.")
                    }
                    var paused = startPaused || false;
                    var readable = false;
                    stream.readable = true;
                    stream.pipe = Stream.prototype.pipe;
                    stream.on = stream.addListener = Stream.prototype.on;
                    stream.on("readable", function() {
                        readable = true;
                        var c;
                        while (!paused && null !== (c = stream.read()))
                            stream.emit("data", c);
                        if (c === null) {
                            readable = false;
                            stream._readableState.needReadable = true
                        }
                    });
                    stream.pause = function() {
                        paused = true;
                        this.emit("pause")
                    }
                    ;
                    stream.resume = function() {
                        paused = false;
                        if (readable)
                            process.nextTick(function() {
                                stream.emit("readable")
                            });
                        else
                            this.read(0);
                        this.emit("resume")
                    }
                    ;
                    stream.emit("readable")
                }
                Readable.prototype.wrap = function(stream) {
                    var state = this._readableState;
                    var paused = false;
                    var self = this;
                    stream.on("end", function() {
                        if (state.decoder && !state.ended) {
                            var chunk = state.decoder.end();
                            if (chunk && chunk.length)
                                self.push(chunk)
                        }
                        self.push(null)
                    });
                    stream.on("data", function(chunk) {
                        if (state.decoder)
                            chunk = state.decoder.write(chunk);
                        if (state.objectMode && (chunk === null || chunk === undefined))
                            return;
                        else if (!state.objectMode && (!chunk || !chunk.length))
                            return;
                        var ret = self.push(chunk);
                        if (!ret) {
                            paused = true;
                            stream.pause()
                        }
                    });
                    for (var i in stream) {
                        if (typeof stream[i] === "function" && typeof this[i] === "undefined") {
                            this[i] = function(method) {
                                return function() {
                                    return stream[method].apply(stream, arguments)
                                }
                            }(i)
                        }
                    }
                    var events = ["error", "close", "destroy", "pause", "resume"];
                    forEach(events, function(ev) {
                        stream.on(ev, self.emit.bind(self, ev))
                    });
                    self._read = function(n) {
                        if (paused) {
                            paused = false;
                            stream.resume()
                        }
                    }
                    ;
                    return self
                }
                ;
                Readable._fromList = fromList;
                function fromList(n, state) {
                    var list = state.buffer;
                    var length = state.length;
                    var stringMode = !!state.decoder;
                    var objectMode = !!state.objectMode;
                    var ret;
                    if (list.length === 0)
                        return null;
                    if (length === 0)
                        ret = null;
                    else if (objectMode)
                        ret = list.shift();
                    else if (!n || n >= length) {
                        if (stringMode)
                            ret = list.join("");
                        else
                            ret = Buffer.concat(list, length);
                        list.length = 0
                    } else {
                        if (n < list[0].length) {
                            var buf = list[0];
                            ret = buf.slice(0, n);
                            list[0] = buf.slice(n)
                        } else if (n === list[0].length) {
                            ret = list.shift()
                        } else {
                            if (stringMode)
                                ret = "";
                            else
                                ret = new Buffer(n);
                            var c = 0;
                            for (var i = 0, l = list.length; i < l && c < n; i++) {
                                var buf = list[0];
                                var cpy = Math.min(n - c, buf.length);
                                if (stringMode)
                                    ret += buf.slice(0, cpy);
                                else
                                    buf.copy(ret, c, 0, cpy);
                                if (cpy < buf.length)
                                    list[0] = buf.slice(cpy);
                                else
                                    list.shift();
                                c += cpy
                            }
                        }
                    }
                    return ret
                }
                function endReadable(stream) {
                    var state = stream._readableState;
                    if (state.length > 0)
                        throw new Error("endReadable called on non-empty stream");
                    if (!state.endEmitted && state.calledRead) {
                        state.ended = true;
                        process.nextTick(function() {
                            if (!state.endEmitted && state.length === 0) {
                                state.endEmitted = true;
                                stream.readable = false;
                                stream.emit("end")
                            }
                        })
                    }
                }
                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i)
                    }
                }
                function indexOf(xs, x) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        if (xs[i] === x)
                            return i
                    }
                    return -1
                }
            }
            ).call(this, require("_process"))
        }
        , {
            _process: 73,
            buffer: 7,
            "core-util-is": 9,
            events: 14,
            inherits: 26,
            isarray: 29,
            stream: 82,
            "string_decoder/": 98
        }],
        77: [function(require, module, exports) {
            module.exports = Transform;
            var Duplex = require("./_stream_duplex");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(Transform, Duplex);
            function TransformState(options, stream) {
                this.afterTransform = function(er, data) {
                    return afterTransform(stream, er, data)
                }
                ;
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null
            }
            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = false;
                var cb = ts.writecb;
                if (!cb)
                    return stream.emit("error", new Error("no writecb in Transform class"));
                ts.writechunk = null;
                ts.writecb = null;
                if (data !== null && data !== undefined)
                    stream.push(data);
                if (cb)
                    cb(er);
                var rs = stream._readableState;
                rs.reading = false;
                if (rs.needReadable || rs.length < rs.highWaterMark) {
                    stream._read(rs.highWaterMark)
                }
            }
            function Transform(options) {
                if (!(this instanceof Transform))
                    return new Transform(options);
                Duplex.call(this, options);
                var ts = this._transformState = new TransformState(options,this);
                var stream = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                this.once("finish", function() {
                    if ("function" === typeof this._flush)
                        this._flush(function(er) {
                            done(stream, er)
                        });
                    else
                        done(stream)
                })
            }
            Transform.prototype.push = function(chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding)
            }
            ;
            Transform.prototype._transform = function(chunk, encoding, cb) {
                throw new Error("not implemented")
            }
            ;
            Transform.prototype._write = function(chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;
                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
                        this._read(rs.highWaterMark)
                }
            }
            ;
            Transform.prototype._read = function(n) {
                var ts = this._transformState;
                if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
                    ts.transforming = true;
                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
                } else {
                    ts.needTransform = true
                }
            }
            ;
            function done(stream, er) {
                if (er)
                    return stream.emit("error", er);
                var ws = stream._writableState;
                var rs = stream._readableState;
                var ts = stream._transformState;
                if (ws.length)
                    throw new Error("calling transform done when ws.length != 0");
                if (ts.transforming)
                    throw new Error("calling transform done when still transforming");
                return stream.push(null)
            }
        }
        , {
            "./_stream_duplex": 74,
            "core-util-is": 9,
            inherits: 26
        }],
        78: [function(require, module, exports) {
            (function(process) {
                module.exports = Writable;
                var Buffer = require("buffer").Buffer;
                Writable.WritableState = WritableState;
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var Stream = require("stream");
                util.inherits(Writable, Stream);
                function WriteReq(chunk, encoding, cb) {
                    this.chunk = chunk;
                    this.encoding = encoding;
                    this.callback = cb
                }
                function WritableState(options, stream) {
                    options = options || {};
                    var hwm = options.highWaterMark;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : 16 * 1024;
                    this.objectMode = !!options.objectMode;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.needDrain = false;
                    this.ending = false;
                    this.ended = false;
                    this.finished = false;
                    var noDecode = options.decodeStrings === false;
                    this.decodeStrings = !noDecode;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.length = 0;
                    this.writing = false;
                    this.sync = true;
                    this.bufferProcessing = false;
                    this.onwrite = function(er) {
                        onwrite(stream, er)
                    }
                    ;
                    this.writecb = null;
                    this.writelen = 0;
                    this.buffer = [];
                    this.errorEmitted = false
                }
                function Writable(options) {
                    var Duplex = require("./_stream_duplex");
                    if (!(this instanceof Writable) && !(this instanceof Duplex))
                        return new Writable(options);
                    this._writableState = new WritableState(options,this);
                    this.writable = true;
                    Stream.call(this)
                }
                Writable.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe. Not readable."))
                }
                ;
                function writeAfterEnd(stream, state, cb) {
                    var er = new Error("write after end");
                    stream.emit("error", er);
                    process.nextTick(function() {
                        cb(er)
                    })
                }
                function validChunk(stream, state, chunk, cb) {
                    var valid = true;
                    if (!Buffer.isBuffer(chunk) && "string" !== typeof chunk && chunk !== null && chunk !== undefined && !state.objectMode) {
                        var er = new TypeError("Invalid non-string/buffer chunk");
                        stream.emit("error", er);
                        process.nextTick(function() {
                            cb(er)
                        });
                        valid = false
                    }
                    return valid
                }
                Writable.prototype.write = function(chunk, encoding, cb) {
                    var state = this._writableState;
                    var ret = false;
                    if (typeof encoding === "function") {
                        cb = encoding;
                        encoding = null
                    }
                    if (Buffer.isBuffer(chunk))
                        encoding = "buffer";
                    else if (!encoding)
                        encoding = state.defaultEncoding;
                    if (typeof cb !== "function")
                        cb = function() {}
                        ;
                    if (state.ended)
                        writeAfterEnd(this, state, cb);
                    else if (validChunk(this, state, chunk, cb))
                        ret = writeOrBuffer(this, state, chunk, encoding, cb);
                    return ret
                }
                ;
                function decodeChunk(state, chunk, encoding) {
                    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
                        chunk = new Buffer(chunk,encoding)
                    }
                    return chunk
                }
                function writeOrBuffer(stream, state, chunk, encoding, cb) {
                    chunk = decodeChunk(state, chunk, encoding);
                    if (Buffer.isBuffer(chunk))
                        encoding = "buffer";
                    var len = state.objectMode ? 1 : chunk.length;
                    state.length += len;
                    var ret = state.length < state.highWaterMark;
                    if (!ret)
                        state.needDrain = true;
                    if (state.writing)
                        state.buffer.push(new WriteReq(chunk,encoding,cb));
                    else
                        doWrite(stream, state, len, chunk, encoding, cb);
                    return ret
                }
                function doWrite(stream, state, len, chunk, encoding, cb) {
                    state.writelen = len;
                    state.writecb = cb;
                    state.writing = true;
                    state.sync = true;
                    stream._write(chunk, encoding, state.onwrite);
                    state.sync = false
                }
                function onwriteError(stream, state, sync, er, cb) {
                    if (sync)
                        process.nextTick(function() {
                            cb(er)
                        });
                    else
                        cb(er);
                    stream._writableState.errorEmitted = true;
                    stream.emit("error", er)
                }
                function onwriteStateUpdate(state) {
                    state.writing = false;
                    state.writecb = null;
                    state.length -= state.writelen;
                    state.writelen = 0
                }
                function onwrite(stream, er) {
                    var state = stream._writableState;
                    var sync = state.sync;
                    var cb = state.writecb;
                    onwriteStateUpdate(state);
                    if (er)
                        onwriteError(stream, state, sync, er, cb);
                    else {
                        var finished = needFinish(stream, state);
                        if (!finished && !state.bufferProcessing && state.buffer.length)
                            clearBuffer(stream, state);
                        if (sync) {
                            process.nextTick(function() {
                                afterWrite(stream, state, finished, cb)
                            })
                        } else {
                            afterWrite(stream, state, finished, cb)
                        }
                    }
                }
                function afterWrite(stream, state, finished, cb) {
                    if (!finished)
                        onwriteDrain(stream, state);
                    cb();
                    if (finished)
                        finishMaybe(stream, state)
                }
                function onwriteDrain(stream, state) {
                    if (state.length === 0 && state.needDrain) {
                        state.needDrain = false;
                        stream.emit("drain")
                    }
                }
                function clearBuffer(stream, state) {
                    state.bufferProcessing = true;
                    for (var c = 0; c < state.buffer.length; c++) {
                        var entry = state.buffer[c];
                        var chunk = entry.chunk;
                        var encoding = entry.encoding;
                        var cb = entry.callback;
                        var len = state.objectMode ? 1 : chunk.length;
                        doWrite(stream, state, len, chunk, encoding, cb);
                        if (state.writing) {
                            c++;
                            break
                        }
                    }
                    state.bufferProcessing = false;
                    if (c < state.buffer.length)
                        state.buffer = state.buffer.slice(c);
                    else
                        state.buffer.length = 0
                }
                Writable.prototype._write = function(chunk, encoding, cb) {
                    cb(new Error("not implemented"))
                }
                ;
                Writable.prototype.end = function(chunk, encoding, cb) {
                    var state = this._writableState;
                    if (typeof chunk === "function") {
                        cb = chunk;
                        chunk = null;
                        encoding = null
                    } else if (typeof encoding === "function") {
                        cb = encoding;
                        encoding = null
                    }
                    if (typeof chunk !== "undefined" && chunk !== null)
                        this.write(chunk, encoding);
                    if (!state.ending && !state.finished)
                        endWritable(this, state, cb)
                }
                ;
                function needFinish(stream, state) {
                    return state.ending && state.length === 0 && !state.finished && !state.writing
                }
                function finishMaybe(stream, state) {
                    var need = needFinish(stream, state);
                    if (need) {
                        state.finished = true;
                        stream.emit("finish")
                    }
                    return need
                }
                function endWritable(stream, state, cb) {
                    state.ending = true;
                    finishMaybe(stream, state);
                    if (cb) {
                        if (state.finished)
                            process.nextTick(cb);
                        else
                            stream.once("finish", cb)
                    }
                    state.ended = true
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./_stream_duplex": 74,
            _process: 73,
            buffer: 7,
            "core-util-is": 9,
            inherits: 26,
            stream: 82
        }],
        79: [function(require, module, exports) {
            (function(process) {
                var Stream = require("stream");
                exports = module.exports = require("./lib/_stream_readable.js");
                exports.Stream = Stream;
                exports.Readable = exports;
                exports.Writable = require("./lib/_stream_writable.js");
                exports.Duplex = require("./lib/_stream_duplex.js");
                exports.Transform = require("./lib/_stream_transform.js");
                exports.PassThrough = require("./lib/_stream_passthrough.js");
                if (!process.browser && process.env.READABLE_STREAM === "disable") {
                    module.exports = require("stream")
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./lib/_stream_duplex.js": 74,
            "./lib/_stream_passthrough.js": 75,
            "./lib/_stream_readable.js": 76,
            "./lib/_stream_transform.js": 77,
            "./lib/_stream_writable.js": 78,
            _process: 73,
            stream: 82
        }],
        80: [function(require, module, exports) {
            var buffer = require("buffer");
            var Buffer = buffer.Buffer;
            function copyProps(src, dst) {
                for (var key in src) {
                    dst[key] = src[key]
                }
            }
            if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
                module.exports = buffer
            } else {
                copyProps(buffer, exports);
                exports.Buffer = SafeBuffer
            }
            function SafeBuffer(arg, encodingOrOffset, length) {
                return Buffer(arg, encodingOrOffset, length)
            }
            copyProps(Buffer, SafeBuffer);
            SafeBuffer.from = function(arg, encodingOrOffset, length) {
                if (typeof arg === "number") {
                    throw new TypeError("Argument must not be a number")
                }
                return Buffer(arg, encodingOrOffset, length)
            }
            ;
            SafeBuffer.alloc = function(size, fill, encoding) {
                if (typeof size !== "number") {
                    throw new TypeError("Argument must be a number")
                }
                var buf = Buffer(size);
                if (fill !== undefined) {
                    if (typeof encoding === "string") {
                        buf.fill(fill, encoding)
                    } else {
                        buf.fill(fill)
                    }
                } else {
                    buf.fill(0)
                }
                return buf
            }
            ;
            SafeBuffer.allocUnsafe = function(size) {
                if (typeof size !== "number") {
                    throw new TypeError("Argument must be a number")
                }
                return Buffer(size)
            }
            ;
            SafeBuffer.allocUnsafeSlow = function(size) {
                if (typeof size !== "number") {
                    throw new TypeError("Argument must be a number")
                }
                return buffer.SlowBuffer(size)
            }
        }
        , {
            buffer: 7
        }],
        81: [function(require, module, exports) {
            (function(Buffer) {
                "use strict";
                var ContentStream = require("contentstream");
                var GifEncoder = require("gif-encoder");
                var jpegJs = require("jpeg-js");
                var PNG = require("pngjs-nozlib").PNG;
                var ndarray = require("ndarray");
                var ops = require("ndarray-ops");
                var through = require("through");
                function handleData(array, data, frame) {
                    var i, j, ptr = 0, c;
                    if (array.shape.length === 4) {
                        return handleData(array.pick(frame), data, 0)
                    } else if (array.shape.length === 3) {
                        if (array.shape[2] === 3) {
                            ops.assign(ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]), array);
                            ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255)
                        } else if (array.shape[2] === 4) {
                            ops.assign(ndarray(data, [array.shape[0], array.shape[1], 4], [4, array.shape[0] * 4, 1]), array)
                        } else if (array.shape[2] === 1) {
                            ops.assign(ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]), ndarray(array.data, [array.shape[0], array.shape[1], 3], [array.stride[0], array.stride[1], 0], array.offset));
                            ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255)
                        } else {
                            return new Error("Incompatible array shape")
                        }
                    } else if (array.shape.length === 2) {
                        ops.assign(ndarray(data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]), ndarray(array.data, [array.shape[0], array.shape[1], 3], [array.stride[0], array.stride[1], 0], array.offset));
                        ops.assigns(ndarray(data, [array.shape[0] * array.shape[1]], [4], 3), 255)
                    } else {
                        return new Error("Incompatible array shape")
                    }
                    return data
                }
                function haderror(err) {
                    var result = through();
                    result.emit("error", err);
                    return result
                }
                module.exports = function savePixels(array, type, options) {
                    options = options || {};
                    switch (type.toUpperCase()) {
                    case "JPG":
                    case ".JPG":
                    case "JPEG":
                    case ".JPEG":
                    case "JPE":
                    case ".JPE":
                        var width = array.shape[0];
                        var height = array.shape[1];
                        var data = new Buffer(width * height * 4);
                        data = handleData(array, data);
                        var rawImageData = {
                            data: data,
                            width: width,
                            height: height
                        };
                        var jpegImageData = jpegJs.encode(rawImageData, options.quality);
                        return new ContentStream(jpegImageData.data);
                    case "GIF":
                    case ".GIF":
                        var frames = array.shape.length === 4 ? array.shape[0] : 1;
                        var width = array.shape.length === 4 ? array.shape[1] : array.shape[0];
                        var height = array.shape.length === 4 ? array.shape[2] : array.shape[1];
                        var data = new Buffer(width * height * 4);
                        var gif = new GifEncoder(width,height);
                        gif.writeHeader();
                        for (var i = 0; i < frames; i++) {
                            data = handleData(array, data, i);
                            gif.addFrame(data)
                        }
                        gif.finish();
                        return gif;
                    case "PNG":
                    case ".PNG":
                        var png = new PNG({
                            width: array.shape[0],
                            height: array.shape[1]
                        });
                        var data = handleData(array, png.data);
                        if (typeof data === "Error")
                            return haderror(data);
                        png.data = data;
                        return png.pack();
                    case "CANVAS":
                        var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        canvas.width = array.shape[0];
                        canvas.height = array.shape[1];
                        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        data = handleData(array, data);
                        if (typeof data === "Error")
                            return haderror(data);
                        context.putImageData(imageData, 0, 0);
                        return canvas;
                    default:
                        return haderror(new Error("Unsupported file type: " + type))
                    }
                }
            }
            ).call(this, require("buffer").Buffer)
        }
        , {
            buffer: 7,
            contentstream: 8,
            "gif-encoder": 16,
            "jpeg-js": 30,
            ndarray: 37,
            "ndarray-ops": 34,
            "pngjs-nozlib": 70,
            through: 99
        }],
        82: [function(require, module, exports) {
            module.exports = Stream;
            var EE = require("events").EventEmitter;
            var inherits = require("inherits");
            inherits(Stream, EE);
            Stream.Readable = require("readable-stream/readable.js");
            Stream.Writable = require("readable-stream/writable.js");
            Stream.Duplex = require("readable-stream/duplex.js");
            Stream.Transform = require("readable-stream/transform.js");
            Stream.PassThrough = require("readable-stream/passthrough.js");
            Stream.Stream = Stream;
            function Stream() {
                EE.call(this)
            }
            Stream.prototype.pipe = function(dest, options) {
                var source = this;
                function ondata(chunk) {
                    if (dest.writable) {
                        if (false === dest.write(chunk) && source.pause) {
                            source.pause()
                        }
                    }
                }
                source.on("data", ondata);
                function ondrain() {
                    if (source.readable && source.resume) {
                        source.resume()
                    }
                }
                dest.on("drain", ondrain);
                if (!dest._isStdio && (!options || options.end !== false)) {
                    source.on("end", onend);
                    source.on("close", onclose)
                }
                var didOnEnd = false;
                function onend() {
                    if (didOnEnd)
                        return;
                    didOnEnd = true;
                    dest.end()
                }
                function onclose() {
                    if (didOnEnd)
                        return;
                    didOnEnd = true;
                    if (typeof dest.destroy === "function")
                        dest.destroy()
                }
                function onerror(er) {
                    cleanup();
                    if (EE.listenerCount(this, "error") === 0) {
                        throw er
                    }
                }
                source.on("error", onerror);
                dest.on("error", onerror);
                function cleanup() {
                    source.removeListener("data", ondata);
                    dest.removeListener("drain", ondrain);
                    source.removeListener("end", onend);
                    source.removeListener("close", onclose);
                    source.removeListener("error", onerror);
                    dest.removeListener("error", onerror);
                    source.removeListener("end", cleanup);
                    source.removeListener("close", cleanup);
                    dest.removeListener("close", cleanup)
                }
                source.on("end", cleanup);
                source.on("close", cleanup);
                dest.on("close", cleanup);
                dest.emit("pipe", source);
                return dest
            }
        }
        , {
            events: 14,
            inherits: 26,
            "readable-stream/duplex.js": 84,
            "readable-stream/passthrough.js": 93,
            "readable-stream/readable.js": 94,
            "readable-stream/transform.js": 95,
            "readable-stream/writable.js": 96
        }],
        83: [function(require, module, exports) {
            var toString = {}.toString;
            module.exports = Array.isArray || function(arr) {
                return toString.call(arr) == "[object Array]"
            }
        }
        , {}],
        84: [function(require, module, exports) {
            module.exports = require("./lib/_stream_duplex.js")
        }
        , {
            "./lib/_stream_duplex.js": 85
        }],
        85: [function(require, module, exports) {
            "use strict";
            var processNextTick = require("process-nextick-args");
            var objectKeys = Object.keys || function(obj) {
                var keys = [];
                for (var key in obj) {
                    keys.push(key)
                }
                return keys
            }
            ;
            module.exports = Duplex;
            var util = require("core-util-is");
            util.inherits = require("inherits");
            var Readable = require("./_stream_readable");
            var Writable = require("./_stream_writable");
            util.inherits(Duplex, Readable);
            var keys = objectKeys(Writable.prototype);
            for (var v = 0; v < keys.length; v++) {
                var method = keys[v];
                if (!Duplex.prototype[method])
                    Duplex.prototype[method] = Writable.prototype[method]
            }
            function Duplex(options) {
                if (!(this instanceof Duplex))
                    return new Duplex(options);
                Readable.call(this, options);
                Writable.call(this, options);
                if (options && options.readable === false)
                    this.readable = false;
                if (options && options.writable === false)
                    this.writable = false;
                this.allowHalfOpen = true;
                if (options && options.allowHalfOpen === false)
                    this.allowHalfOpen = false;
                this.once("end", onend)
            }
            function onend() {
                if (this.allowHalfOpen || this._writableState.ended)
                    return;
                processNextTick(onEndNT, this)
            }
            function onEndNT(self) {
                self.end()
            }
            Object.defineProperty(Duplex.prototype, "destroyed", {
                get: function() {
                    if (this._readableState === undefined || this._writableState === undefined) {
                        return false
                    }
                    return this._readableState.destroyed && this._writableState.destroyed
                },
                set: function(value) {
                    if (this._readableState === undefined || this._writableState === undefined) {
                        return
                    }
                    this._readableState.destroyed = value;
                    this._writableState.destroyed = value
                }
            });
            Duplex.prototype._destroy = function(err, cb) {
                this.push(null);
                this.end();
                processNextTick(cb, err)
            }
            ;
            function forEach(xs, f) {
                for (var i = 0, l = xs.length; i < l; i++) {
                    f(xs[i], i)
                }
            }
        }
        , {
            "./_stream_readable": 87,
            "./_stream_writable": 89,
            "core-util-is": 9,
            inherits: 26,
            "process-nextick-args": 72
        }],
        86: [function(require, module, exports) {
            "use strict";
            module.exports = PassThrough;
            var Transform = require("./_stream_transform");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(PassThrough, Transform);
            function PassThrough(options) {
                if (!(this instanceof PassThrough))
                    return new PassThrough(options);
                Transform.call(this, options)
            }
            PassThrough.prototype._transform = function(chunk, encoding, cb) {
                cb(null, chunk)
            }
        }
        , {
            "./_stream_transform": 88,
            "core-util-is": 9,
            inherits: 26
        }],
        87: [function(require, module, exports) {
            (function(process) {
                "use strict";
                var processNextTick = require("process-nextick-args");
                module.exports = Readable;
                var isArray = require("isarray");
                var Duplex;
                Readable.ReadableState = ReadableState;
                var EE = require("events").EventEmitter;
                var EElistenerCount = function(emitter, type) {
                    return emitter.listeners(type).length
                };
                var Stream = require("./internal/streams/stream");
                var Buffer = require("safe-buffer").Buffer;
                function _uint8ArrayToBuffer(chunk) {
                    return Buffer.from(chunk)
                }
                function _isUint8Array(obj) {
                    return Object.prototype.toString.call(obj) === "[object Uint8Array]" || Buffer.isBuffer(obj)
                }
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var debugUtil = require("util");
                var debug = void 0;
                if (debugUtil && debugUtil.debuglog) {
                    debug = debugUtil.debuglog("stream")
                } else {
                    debug = function() {}
                }
                var BufferList = require("./internal/streams/BufferList");
                var destroyImpl = require("./internal/streams/destroy");
                var StringDecoder;
                util.inherits(Readable, Stream);
                var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
                function prependListener(emitter, event, fn) {
                    if (typeof emitter.prependListener === "function") {
                        return emitter.prependListener(event, fn)
                    } else {
                        if (!emitter._events || !emitter._events[event])
                            emitter.on(event, fn);
                        else if (isArray(emitter._events[event]))
                            emitter._events[event].unshift(fn);
                        else
                            emitter._events[event] = [fn, emitter._events[event]]
                    }
                }
                function ReadableState(options, stream) {
                    Duplex = Duplex || require("./_stream_duplex");
                    options = options || {};
                    this.objectMode = !!options.objectMode;
                    if (stream instanceof Duplex)
                        this.objectMode = this.objectMode || !!options.readableObjectMode;
                    var hwm = options.highWaterMark;
                    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                    this.highWaterMark = Math.floor(this.highWaterMark);
                    this.buffer = new BufferList;
                    this.length = 0;
                    this.pipes = null;
                    this.pipesCount = 0;
                    this.flowing = null;
                    this.ended = false;
                    this.endEmitted = false;
                    this.reading = false;
                    this.sync = true;
                    this.needReadable = false;
                    this.emittedReadable = false;
                    this.readableListening = false;
                    this.resumeScheduled = false;
                    this.destroyed = false;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.awaitDrain = 0;
                    this.readingMore = false;
                    this.decoder = null;
                    this.encoding = null;
                    if (options.encoding) {
                        if (!StringDecoder)
                            StringDecoder = require("string_decoder/").StringDecoder;
                        this.decoder = new StringDecoder(options.encoding);
                        this.encoding = options.encoding
                    }
                }
                function Readable(options) {
                    Duplex = Duplex || require("./_stream_duplex");
                    if (!(this instanceof Readable))
                        return new Readable(options);
                    this._readableState = new ReadableState(options,this);
                    this.readable = true;
                    if (options) {
                        if (typeof options.read === "function")
                            this._read = options.read;
                        if (typeof options.destroy === "function")
                            this._destroy = options.destroy
                    }
                    Stream.call(this)
                }
                Object.defineProperty(Readable.prototype, "destroyed", {
                    get: function() {
                        if (this._readableState === undefined) {
                            return false
                        }
                        return this._readableState.destroyed
                    },
                    set: function(value) {
                        if (!this._readableState) {
                            return
                        }
                        this._readableState.destroyed = value
                    }
                });
                Readable.prototype.destroy = destroyImpl.destroy;
                Readable.prototype._undestroy = destroyImpl.undestroy;
                Readable.prototype._destroy = function(err, cb) {
                    this.push(null);
                    cb(err)
                }
                ;
                Readable.prototype.push = function(chunk, encoding) {
                    var state = this._readableState;
                    var skipChunkCheck;
                    if (!state.objectMode) {
                        if (typeof chunk === "string") {
                            encoding = encoding || state.defaultEncoding;
                            if (encoding !== state.encoding) {
                                chunk = Buffer.from(chunk, encoding);
                                encoding = ""
                            }
                            skipChunkCheck = true
                        }
                    } else {
                        skipChunkCheck = true
                    }
                    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck)
                }
                ;
                Readable.prototype.unshift = function(chunk) {
                    return readableAddChunk(this, chunk, null, true, false)
                }
                ;
                function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
                    var state = stream._readableState;
                    if (chunk === null) {
                        state.reading = false;
                        onEofChunk(stream, state)
                    } else {
                        var er;
                        if (!skipChunkCheck)
                            er = chunkInvalid(state, chunk);
                        if (er) {
                            stream.emit("error", er)
                        } else if (state.objectMode || chunk && chunk.length > 0) {
                            if (typeof chunk !== "string" && Object.getPrototypeOf(chunk) !== Buffer.prototype && !state.objectMode) {
                                chunk = _uint8ArrayToBuffer(chunk)
                            }
                            if (addToFront) {
                                if (state.endEmitted)
                                    stream.emit("error", new Error("stream.unshift() after end event"));
                                else
                                    addChunk(stream, state, chunk, true)
                            } else if (state.ended) {
                                stream.emit("error", new Error("stream.push() after EOF"))
                            } else {
                                state.reading = false;
                                if (state.decoder && !encoding) {
                                    chunk = state.decoder.write(chunk);
                                    if (state.objectMode || chunk.length !== 0)
                                        addChunk(stream, state, chunk, false);
                                    else
                                        maybeReadMore(stream, state)
                                } else {
                                    addChunk(stream, state, chunk, false)
                                }
                            }
                        } else if (!addToFront) {
                            state.reading = false
                        }
                    }
                    return needMoreData(state)
                }
                function addChunk(stream, state, chunk, addToFront) {
                    if (state.flowing && state.length === 0 && !state.sync) {
                        stream.emit("data", chunk);
                        stream.read(0)
                    } else {
                        state.length += state.objectMode ? 1 : chunk.length;
                        if (addToFront)
                            state.buffer.unshift(chunk);
                        else
                            state.buffer.push(chunk);
                        if (state.needReadable)
                            emitReadable(stream)
                    }
                    maybeReadMore(stream, state)
                }
                function chunkInvalid(state, chunk) {
                    var er;
                    if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
                        er = new TypeError("Invalid non-string/buffer chunk")
                    }
                    return er
                }
                function needMoreData(state) {
                    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0)
                }
                Readable.prototype.isPaused = function() {
                    return this._readableState.flowing === false
                }
                ;
                Readable.prototype.setEncoding = function(enc) {
                    if (!StringDecoder)
                        StringDecoder = require("string_decoder/").StringDecoder;
                    this._readableState.decoder = new StringDecoder(enc);
                    this._readableState.encoding = enc;
                    return this
                }
                ;
                var MAX_HWM = 8388608;
                function computeNewHighWaterMark(n) {
                    if (n >= MAX_HWM) {
                        n = MAX_HWM
                    } else {
                        n--;
                        n |= n >>> 1;
                        n |= n >>> 2;
                        n |= n >>> 4;
                        n |= n >>> 8;
                        n |= n >>> 16;
                        n++
                    }
                    return n
                }
                function howMuchToRead(n, state) {
                    if (n <= 0 || state.length === 0 && state.ended)
                        return 0;
                    if (state.objectMode)
                        return 1;
                    if (n !== n) {
                        if (state.flowing && state.length)
                            return state.buffer.head.data.length;
                        else
                            return state.length
                    }
                    if (n > state.highWaterMark)
                        state.highWaterMark = computeNewHighWaterMark(n);
                    if (n <= state.length)
                        return n;
                    if (!state.ended) {
                        state.needReadable = true;
                        return 0
                    }
                    return state.length
                }
                Readable.prototype.read = function(n) {
                    debug("read", n);
                    n = parseInt(n, 10);
                    var state = this._readableState;
                    var nOrig = n;
                    if (n !== 0)
                        state.emittedReadable = false;
                    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
                        debug("read: emitReadable", state.length, state.ended);
                        if (state.length === 0 && state.ended)
                            endReadable(this);
                        else
                            emitReadable(this);
                        return null
                    }
                    n = howMuchToRead(n, state);
                    if (n === 0 && state.ended) {
                        if (state.length === 0)
                            endReadable(this);
                        return null
                    }
                    var doRead = state.needReadable;
                    debug("need readable", doRead);
                    if (state.length === 0 || state.length - n < state.highWaterMark) {
                        doRead = true;
                        debug("length less than watermark", doRead)
                    }
                    if (state.ended || state.reading) {
                        doRead = false;
                        debug("reading or ended", doRead)
                    } else if (doRead) {
                        debug("do read");
                        state.reading = true;
                        state.sync = true;
                        if (state.length === 0)
                            state.needReadable = true;
                        this._read(state.highWaterMark);
                        state.sync = false;
                        if (!state.reading)
                            n = howMuchToRead(nOrig, state)
                    }
                    var ret;
                    if (n > 0)
                        ret = fromList(n, state);
                    else
                        ret = null;
                    if (ret === null) {
                        state.needReadable = true;
                        n = 0
                    } else {
                        state.length -= n
                    }
                    if (state.length === 0) {
                        if (!state.ended)
                            state.needReadable = true;
                        if (nOrig !== n && state.ended)
                            endReadable(this)
                    }
                    if (ret !== null)
                        this.emit("data", ret);
                    return ret
                }
                ;
                function onEofChunk(stream, state) {
                    if (state.ended)
                        return;
                    if (state.decoder) {
                        var chunk = state.decoder.end();
                        if (chunk && chunk.length) {
                            state.buffer.push(chunk);
                            state.length += state.objectMode ? 1 : chunk.length
                        }
                    }
                    state.ended = true;
                    emitReadable(stream)
                }
                function emitReadable(stream) {
                    var state = stream._readableState;
                    state.needReadable = false;
                    if (!state.emittedReadable) {
                        debug("emitReadable", state.flowing);
                        state.emittedReadable = true;
                        if (state.sync)
                            processNextTick(emitReadable_, stream);
                        else
                            emitReadable_(stream)
                    }
                }
                function emitReadable_(stream) {
                    debug("emit readable");
                    stream.emit("readable");
                    flow(stream)
                }
                function maybeReadMore(stream, state) {
                    if (!state.readingMore) {
                        state.readingMore = true;
                        processNextTick(maybeReadMore_, stream, state)
                    }
                }
                function maybeReadMore_(stream, state) {
                    var len = state.length;
                    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
                        debug("maybeReadMore read 0");
                        stream.read(0);
                        if (len === state.length)
                            break;
                        else
                            len = state.length
                    }
                    state.readingMore = false
                }
                Readable.prototype._read = function(n) {
                    this.emit("error", new Error("_read() is not implemented"))
                }
                ;
                Readable.prototype.pipe = function(dest, pipeOpts) {
                    var src = this;
                    var state = this._readableState;
                    switch (state.pipesCount) {
                    case 0:
                        state.pipes = dest;
                        break;
                    case 1:
                        state.pipes = [state.pipes, dest];
                        break;
                    default:
                        state.pipes.push(dest);
                        break
                    }
                    state.pipesCount += 1;
                    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
                    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
                    var endFn = doEnd ? onend : unpipe;
                    if (state.endEmitted)
                        processNextTick(endFn);
                    else
                        src.once("end", endFn);
                    dest.on("unpipe", onunpipe);
                    function onunpipe(readable, unpipeInfo) {
                        debug("onunpipe");
                        if (readable === src) {
                            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                                unpipeInfo.hasUnpiped = true;
                                cleanup()
                            }
                        }
                    }
                    function onend() {
                        debug("onend");
                        dest.end()
                    }
                    var ondrain = pipeOnDrain(src);
                    dest.on("drain", ondrain);
                    var cleanedUp = false;
                    function cleanup() {
                        debug("cleanup");
                        dest.removeListener("close", onclose);
                        dest.removeListener("finish", onfinish);
                        dest.removeListener("drain", ondrain);
                        dest.removeListener("error", onerror);
                        dest.removeListener("unpipe", onunpipe);
                        src.removeListener("end", onend);
                        src.removeListener("end", unpipe);
                        src.removeListener("data", ondata);
                        cleanedUp = true;
                        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
                            ondrain()
                    }
                    var increasedAwaitDrain = false;
                    src.on("data", ondata);
                    function ondata(chunk) {
                        debug("ondata");
                        increasedAwaitDrain = false;
                        var ret = dest.write(chunk);
                        if (false === ret && !increasedAwaitDrain) {
                            if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                                debug("false write response, pause", src._readableState.awaitDrain);
                                src._readableState.awaitDrain++;
                                increasedAwaitDrain = true
                            }
                            src.pause()
                        }
                    }
                    function onerror(er) {
                        debug("onerror", er);
                        unpipe();
                        dest.removeListener("error", onerror);
                        if (EElistenerCount(dest, "error") === 0)
                            dest.emit("error", er)
                    }
                    prependListener(dest, "error", onerror);
                    function onclose() {
                        dest.removeListener("finish", onfinish);
                        unpipe()
                    }
                    dest.once("close", onclose);
                    function onfinish() {
                        debug("onfinish");
                        dest.removeListener("close", onclose);
                        unpipe()
                    }
                    dest.once("finish", onfinish);
                    function unpipe() {
                        debug("unpipe");
                        src.unpipe(dest)
                    }
                    dest.emit("pipe", src);
                    if (!state.flowing) {
                        debug("pipe resume");
                        src.resume()
                    }
                    return dest
                }
                ;
                function pipeOnDrain(src) {
                    return function() {
                        var state = src._readableState;
                        debug("pipeOnDrain", state.awaitDrain);
                        if (state.awaitDrain)
                            state.awaitDrain--;
                        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
                            state.flowing = true;
                            flow(src)
                        }
                    }
                }
                Readable.prototype.unpipe = function(dest) {
                    var state = this._readableState;
                    var unpipeInfo = {
                        hasUnpiped: false
                    };
                    if (state.pipesCount === 0)
                        return this;
                    if (state.pipesCount === 1) {
                        if (dest && dest !== state.pipes)
                            return this;
                        if (!dest)
                            dest = state.pipes;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        if (dest)
                            dest.emit("unpipe", this, unpipeInfo);
                        return this
                    }
                    if (!dest) {
                        var dests = state.pipes;
                        var len = state.pipesCount;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        for (var i = 0; i < len; i++) {
                            dests[i].emit("unpipe", this, unpipeInfo)
                        }
                        return this
                    }
                    var index = indexOf(state.pipes, dest);
                    if (index === -1)
                        return this;
                    state.pipes.splice(index, 1);
                    state.pipesCount -= 1;
                    if (state.pipesCount === 1)
                        state.pipes = state.pipes[0];
                    dest.emit("unpipe", this, unpipeInfo);
                    return this
                }
                ;
                Readable.prototype.on = function(ev, fn) {
                    var res = Stream.prototype.on.call(this, ev, fn);
                    if (ev === "data") {
                        if (this._readableState.flowing !== false)
                            this.resume()
                    } else if (ev === "readable") {
                        var state = this._readableState;
                        if (!state.endEmitted && !state.readableListening) {
                            state.readableListening = state.needReadable = true;
                            state.emittedReadable = false;
                            if (!state.reading) {
                                processNextTick(nReadingNextTick, this)
                            } else if (state.length) {
                                emitReadable(this)
                            }
                        }
                    }
                    return res
                }
                ;
                Readable.prototype.addListener = Readable.prototype.on;
                function nReadingNextTick(self) {
                    debug("readable nexttick read 0");
                    self.read(0)
                }
                Readable.prototype.resume = function() {
                    var state = this._readableState;
                    if (!state.flowing) {
                        debug("resume");
                        state.flowing = true;
                        resume(this, state)
                    }
                    return this
                }
                ;
                function resume(stream, state) {
                    if (!state.resumeScheduled) {
                        state.resumeScheduled = true;
                        processNextTick(resume_, stream, state)
                    }
                }
                function resume_(stream, state) {
                    if (!state.reading) {
                        debug("resume read 0");
                        stream.read(0)
                    }
                    state.resumeScheduled = false;
                    state.awaitDrain = 0;
                    stream.emit("resume");
                    flow(stream);
                    if (state.flowing && !state.reading)
                        stream.read(0)
                }
                Readable.prototype.pause = function() {
                    debug("call pause flowing=%j", this._readableState.flowing);
                    if (false !== this._readableState.flowing) {
                        debug("pause");
                        this._readableState.flowing = false;
                        this.emit("pause")
                    }
                    return this
                }
                ;
                function flow(stream) {
                    var state = stream._readableState;
                    debug("flow", state.flowing);
                    while (state.flowing && stream.read() !== null) {}
                }
                Readable.prototype.wrap = function(stream) {
                    var state = this._readableState;
                    var paused = false;
                    var self = this;
                    stream.on("end", function() {
                        debug("wrapped end");
                        if (state.decoder && !state.ended) {
                            var chunk = state.decoder.end();
                            if (chunk && chunk.length)
                                self.push(chunk)
                        }
                        self.push(null)
                    });
                    stream.on("data", function(chunk) {
                        debug("wrapped data");
                        if (state.decoder)
                            chunk = state.decoder.write(chunk);
                        if (state.objectMode && (chunk === null || chunk === undefined))
                            return;
                        else if (!state.objectMode && (!chunk || !chunk.length))
                            return;
                        var ret = self.push(chunk);
                        if (!ret) {
                            paused = true;
                            stream.pause()
                        }
                    });
                    for (var i in stream) {
                        if (this[i] === undefined && typeof stream[i] === "function") {
                            this[i] = function(method) {
                                return function() {
                                    return stream[method].apply(stream, arguments)
                                }
                            }(i)
                        }
                    }
                    for (var n = 0; n < kProxyEvents.length; n++) {
                        stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]))
                    }
                    self._read = function(n) {
                        debug("wrapped _read", n);
                        if (paused) {
                            paused = false;
                            stream.resume()
                        }
                    }
                    ;
                    return self
                }
                ;
                Readable._fromList = fromList;
                function fromList(n, state) {
                    if (state.length === 0)
                        return null;
                    var ret;
                    if (state.objectMode)
                        ret = state.buffer.shift();
                    else if (!n || n >= state.length) {
                        if (state.decoder)
                            ret = state.buffer.join("");
                        else if (state.buffer.length === 1)
                            ret = state.buffer.head.data;
                        else
                            ret = state.buffer.concat(state.length);
                        state.buffer.clear()
                    } else {
                        ret = fromListPartial(n, state.buffer, state.decoder)
                    }
                    return ret
                }
                function fromListPartial(n, list, hasStrings) {
                    var ret;
                    if (n < list.head.data.length) {
                        ret = list.head.data.slice(0, n);
                        list.head.data = list.head.data.slice(n)
                    } else if (n === list.head.data.length) {
                        ret = list.shift()
                    } else {
                        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list)
                    }
                    return ret
                }
                function copyFromBufferString(n, list) {
                    var p = list.head;
                    var c = 1;
                    var ret = p.data;
                    n -= ret.length;
                    while (p = p.next) {
                        var str = p.data;
                        var nb = n > str.length ? str.length : n;
                        if (nb === str.length)
                            ret += str;
                        else
                            ret += str.slice(0, n);
                        n -= nb;
                        if (n === 0) {
                            if (nb === str.length) {
                                ++c;
                                if (p.next)
                                    list.head = p.next;
                                else
                                    list.head = list.tail = null
                            } else {
                                list.head = p;
                                p.data = str.slice(nb)
                            }
                            break
                        }
                        ++c
                    }
                    list.length -= c;
                    return ret
                }
                function copyFromBuffer(n, list) {
                    var ret = Buffer.allocUnsafe(n);
                    var p = list.head;
                    var c = 1;
                    p.data.copy(ret);
                    n -= p.data.length;
                    while (p = p.next) {
                        var buf = p.data;
                        var nb = n > buf.length ? buf.length : n;
                        buf.copy(ret, ret.length - n, 0, nb);
                        n -= nb;
                        if (n === 0) {
                            if (nb === buf.length) {
                                ++c;
                                if (p.next)
                                    list.head = p.next;
                                else
                                    list.head = list.tail = null
                            } else {
                                list.head = p;
                                p.data = buf.slice(nb)
                            }
                            break
                        }
                        ++c
                    }
                    list.length -= c;
                    return ret
                }
                function endReadable(stream) {
                    var state = stream._readableState;
                    if (state.length > 0)
                        throw new Error('"endReadable()" called on non-empty stream');
                    if (!state.endEmitted) {
                        state.ended = true;
                        processNextTick(endReadableNT, state, stream)
                    }
                }
                function endReadableNT(state, stream) {
                    if (!state.endEmitted && state.length === 0) {
                        state.endEmitted = true;
                        stream.readable = false;
                        stream.emit("end")
                    }
                }
                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i)
                    }
                }
                function indexOf(xs, x) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        if (xs[i] === x)
                            return i
                    }
                    return -1
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./_stream_duplex": 85,
            "./internal/streams/BufferList": 90,
            "./internal/streams/destroy": 91,
            "./internal/streams/stream": 92,
            _process: 73,
            "core-util-is": 9,
            events: 14,
            inherits: 26,
            isarray: 83,
            "process-nextick-args": 72,
            "safe-buffer": 80,
            "string_decoder/": 97,
            util: 4
        }],
        88: [function(require, module, exports) {
            "use strict";
            module.exports = Transform;
            var Duplex = require("./_stream_duplex");
            var util = require("core-util-is");
            util.inherits = require("inherits");
            util.inherits(Transform, Duplex);
            function TransformState(stream) {
                this.afterTransform = function(er, data) {
                    return afterTransform(stream, er, data)
                }
                ;
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null;
                this.writeencoding = null
            }
            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = false;
                var cb = ts.writecb;
                if (!cb) {
                    return stream.emit("error", new Error("write callback called multiple times"))
                }
                ts.writechunk = null;
                ts.writecb = null;
                if (data !== null && data !== undefined)
                    stream.push(data);
                cb(er);
                var rs = stream._readableState;
                rs.reading = false;
                if (rs.needReadable || rs.length < rs.highWaterMark) {
                    stream._read(rs.highWaterMark)
                }
            }
            function Transform(options) {
                if (!(this instanceof Transform))
                    return new Transform(options);
                Duplex.call(this, options);
                this._transformState = new TransformState(this);
                var stream = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                if (options) {
                    if (typeof options.transform === "function")
                        this._transform = options.transform;
                    if (typeof options.flush === "function")
                        this._flush = options.flush
                }
                this.once("prefinish", function() {
                    if (typeof this._flush === "function")
                        this._flush(function(er, data) {
                            done(stream, er, data)
                        });
                    else
                        done(stream)
                })
            }
            Transform.prototype.push = function(chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding)
            }
            ;
            Transform.prototype._transform = function(chunk, encoding, cb) {
                throw new Error("_transform() is not implemented")
            }
            ;
            Transform.prototype._write = function(chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;
                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
                        this._read(rs.highWaterMark)
                }
            }
            ;
            Transform.prototype._read = function(n) {
                var ts = this._transformState;
                if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
                    ts.transforming = true;
                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
                } else {
                    ts.needTransform = true
                }
            }
            ;
            Transform.prototype._destroy = function(err, cb) {
                var _this = this;
                Duplex.prototype._destroy.call(this, err, function(err2) {
                    cb(err2);
                    _this.emit("close")
                })
            }
            ;
            function done(stream, er, data) {
                if (er)
                    return stream.emit("error", er);
                if (data !== null && data !== undefined)
                    stream.push(data);
                var ws = stream._writableState;
                var ts = stream._transformState;
                if (ws.length)
                    throw new Error("Calling transform done when ws.length != 0");
                if (ts.transforming)
                    throw new Error("Calling transform done when still transforming");
                return stream.push(null)
            }
        }
        , {
            "./_stream_duplex": 85,
            "core-util-is": 9,
            inherits: 26
        }],
        89: [function(require, module, exports) {
            (function(process) {
                "use strict";
                var processNextTick = require("process-nextick-args");
                module.exports = Writable;
                function WriteReq(chunk, encoding, cb) {
                    this.chunk = chunk;
                    this.encoding = encoding;
                    this.callback = cb;
                    this.next = null
                }
                function CorkedRequest(state) {
                    var _this = this;
                    this.next = null;
                    this.entry = null;
                    this.finish = function() {
                        onCorkedFinish(_this, state)
                    }
                }
                var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
                var Duplex;
                Writable.WritableState = WritableState;
                var util = require("core-util-is");
                util.inherits = require("inherits");
                var internalUtil = {
                    deprecate: require("util-deprecate")
                };
                var Stream = require("./internal/streams/stream");
                var Buffer = require("safe-buffer").Buffer;
                function _uint8ArrayToBuffer(chunk) {
                    return Buffer.from(chunk)
                }
                function _isUint8Array(obj) {
                    return Object.prototype.toString.call(obj) === "[object Uint8Array]" || Buffer.isBuffer(obj)
                }
                var destroyImpl = require("./internal/streams/destroy");
                util.inherits(Writable, Stream);
                function nop() {}
                function WritableState(options, stream) {
                    Duplex = Duplex || require("./_stream_duplex");
                    options = options || {};
                    this.objectMode = !!options.objectMode;
                    if (stream instanceof Duplex)
                        this.objectMode = this.objectMode || !!options.writableObjectMode;
                    var hwm = options.highWaterMark;
                    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                    this.highWaterMark = Math.floor(this.highWaterMark);
                    this.finalCalled = false;
                    this.needDrain = false;
                    this.ending = false;
                    this.ended = false;
                    this.finished = false;
                    this.destroyed = false;
                    var noDecode = options.decodeStrings === false;
                    this.decodeStrings = !noDecode;
                    this.defaultEncoding = options.defaultEncoding || "utf8";
                    this.length = 0;
                    this.writing = false;
                    this.corked = 0;
                    this.sync = true;
                    this.bufferProcessing = false;
                    this.onwrite = function(er) {
                        onwrite(stream, er)
                    }
                    ;
                    this.writecb = null;
                    this.writelen = 0;
                    this.bufferedRequest = null;
                    this.lastBufferedRequest = null;
                    this.pendingcb = 0;
                    this.prefinished = false;
                    this.errorEmitted = false;
                    this.bufferedRequestCount = 0;
                    this.corkedRequestsFree = new CorkedRequest(this)
                }
                WritableState.prototype.getBuffer = function getBuffer() {
                    var current = this.bufferedRequest;
                    var out = [];
                    while (current) {
                        out.push(current);
                        current = current.next
                    }
                    return out
                }
                ;
                (function() {
                    try {
                        Object.defineProperty(WritableState.prototype, "buffer", {
                            get: internalUtil.deprecate(function() {
                                return this.getBuffer()
                            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
                        })
                    } catch (_) {}
                }
                )();
                var realHasInstance;
                if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
                    realHasInstance = Function.prototype[Symbol.hasInstance];
                    Object.defineProperty(Writable, Symbol.hasInstance, {
                        value: function(object) {
                            if (realHasInstance.call(this, object))
                                return true;
                            return object && object._writableState instanceof WritableState
                        }
                    })
                } else {
                    realHasInstance = function(object) {
                        return object instanceof this
                    }
                }
                function Writable(options) {
                    Duplex = Duplex || require("./_stream_duplex");
                    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
                        return new Writable(options)
                    }
                    this._writableState = new WritableState(options,this);
                    this.writable = true;
                    if (options) {
                        if (typeof options.write === "function")
                            this._write = options.write;
                        if (typeof options.writev === "function")
                            this._writev = options.writev;
                        if (typeof options.destroy === "function")
                            this._destroy = options.destroy;
                        if (typeof options.final === "function")
                            this._final = options.final
                    }
                    Stream.call(this)
                }
                Writable.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe, not readable"))
                }
                ;
                function writeAfterEnd(stream, cb) {
                    var er = new Error("write after end");
                    stream.emit("error", er);
                    processNextTick(cb, er)
                }
                function validChunk(stream, state, chunk, cb) {
                    var valid = true;
                    var er = false;
                    if (chunk === null) {
                        er = new TypeError("May not write null values to stream")
                    } else if (typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
                        er = new TypeError("Invalid non-string/buffer chunk")
                    }
                    if (er) {
                        stream.emit("error", er);
                        processNextTick(cb, er);
                        valid = false
                    }
                    return valid
                }
                Writable.prototype.write = function(chunk, encoding, cb) {
                    var state = this._writableState;
                    var ret = false;
                    var isBuf = _isUint8Array(chunk) && !state.objectMode;
                    if (isBuf && !Buffer.isBuffer(chunk)) {
                        chunk = _uint8ArrayToBuffer(chunk)
                    }
                    if (typeof encoding === "function") {
                        cb = encoding;
                        encoding = null
                    }
                    if (isBuf)
                        encoding = "buffer";
                    else if (!encoding)
                        encoding = state.defaultEncoding;
                    if (typeof cb !== "function")
                        cb = nop;
                    if (state.ended)
                        writeAfterEnd(this, cb);
                    else if (isBuf || validChunk(this, state, chunk, cb)) {
                        state.pendingcb++;
                        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb)
                    }
                    return ret
                }
                ;
                Writable.prototype.cork = function() {
                    var state = this._writableState;
                    state.corked++
                }
                ;
                Writable.prototype.uncork = function() {
                    var state = this._writableState;
                    if (state.corked) {
                        state.corked--;
                        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest)
                            clearBuffer(this, state)
                    }
                }
                ;
                Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
                    if (typeof encoding === "string")
                        encoding = encoding.toLowerCase();
                    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
                        throw new TypeError("Unknown encoding: " + encoding);
                    this._writableState.defaultEncoding = encoding;
                    return this
                }
                ;
                function decodeChunk(state, chunk, encoding) {
                    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
                        chunk = Buffer.from(chunk, encoding)
                    }
                    return chunk
                }
                function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
                    if (!isBuf) {
                        var newChunk = decodeChunk(state, chunk, encoding);
                        if (chunk !== newChunk) {
                            isBuf = true;
                            encoding = "buffer";
                            chunk = newChunk
                        }
                    }
                    var len = state.objectMode ? 1 : chunk.length;
                    state.length += len;
                    var ret = state.length < state.highWaterMark;
                    if (!ret)
                        state.needDrain = true;
                    if (state.writing || state.corked) {
                        var last = state.lastBufferedRequest;
                        state.lastBufferedRequest = {
                            chunk: chunk,
                            encoding: encoding,
                            isBuf: isBuf,
                            callback: cb,
                            next: null
                        };
                        if (last) {
                            last.next = state.lastBufferedRequest
                        } else {
                            state.bufferedRequest = state.lastBufferedRequest
                        }
                        state.bufferedRequestCount += 1
                    } else {
                        doWrite(stream, state, false, len, chunk, encoding, cb)
                    }
                    return ret
                }
                function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                    state.writelen = len;
                    state.writecb = cb;
                    state.writing = true;
                    state.sync = true;
                    if (writev)
                        stream._writev(chunk, state.onwrite);
                    else
                        stream._write(chunk, encoding, state.onwrite);
                    state.sync = false
                }
                function onwriteError(stream, state, sync, er, cb) {
                    --state.pendingcb;
                    if (sync) {
                        processNextTick(cb, er);
                        processNextTick(finishMaybe, stream, state);
                        stream._writableState.errorEmitted = true;
                        stream.emit("error", er)
                    } else {
                        cb(er);
                        stream._writableState.errorEmitted = true;
                        stream.emit("error", er);
                        finishMaybe(stream, state)
                    }
                }
                function onwriteStateUpdate(state) {
                    state.writing = false;
                    state.writecb = null;
                    state.length -= state.writelen;
                    state.writelen = 0
                }
                function onwrite(stream, er) {
                    var state = stream._writableState;
                    var sync = state.sync;
                    var cb = state.writecb;
                    onwriteStateUpdate(state);
                    if (er)
                        onwriteError(stream, state, sync, er, cb);
                    else {
                        var finished = needFinish(state);
                        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                            clearBuffer(stream, state)
                        }
                        if (sync) {
                            asyncWrite(afterWrite, stream, state, finished, cb)
                        } else {
                            afterWrite(stream, state, finished, cb)
                        }
                    }
                }
                function afterWrite(stream, state, finished, cb) {
                    if (!finished)
                        onwriteDrain(stream, state);
                    state.pendingcb--;
                    cb();
                    finishMaybe(stream, state)
                }
                function onwriteDrain(stream, state) {
                    if (state.length === 0 && state.needDrain) {
                        state.needDrain = false;
                        stream.emit("drain")
                    }
                }
                function clearBuffer(stream, state) {
                    state.bufferProcessing = true;
                    var entry = state.bufferedRequest;
                    if (stream._writev && entry && entry.next) {
                        var l = state.bufferedRequestCount;
                        var buffer = new Array(l);
                        var holder = state.corkedRequestsFree;
                        holder.entry = entry;
                        var count = 0;
                        var allBuffers = true;
                        while (entry) {
                            buffer[count] = entry;
                            if (!entry.isBuf)
                                allBuffers = false;
                            entry = entry.next;
                            count += 1
                        }
                        buffer.allBuffers = allBuffers;
                        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
                        state.pendingcb++;
                        state.lastBufferedRequest = null;
                        if (holder.next) {
                            state.corkedRequestsFree = holder.next;
                            holder.next = null
                        } else {
                            state.corkedRequestsFree = new CorkedRequest(state)
                        }
                    } else {
                        while (entry) {
                            var chunk = entry.chunk;
                            var encoding = entry.encoding;
                            var cb = entry.callback;
                            var len = state.objectMode ? 1 : chunk.length;
                            doWrite(stream, state, false, len, chunk, encoding, cb);
                            entry = entry.next;
                            if (state.writing) {
                                break
                            }
                        }
                        if (entry === null)
                            state.lastBufferedRequest = null
                    }
                    state.bufferedRequestCount = 0;
                    state.bufferedRequest = entry;
                    state.bufferProcessing = false
                }
                Writable.prototype._write = function(chunk, encoding, cb) {
                    cb(new Error("_write() is not implemented"))
                }
                ;
                Writable.prototype._writev = null;
                Writable.prototype.end = function(chunk, encoding, cb) {
                    var state = this._writableState;
                    if (typeof chunk === "function") {
                        cb = chunk;
                        chunk = null;
                        encoding = null
                    } else if (typeof encoding === "function") {
                        cb = encoding;
                        encoding = null
                    }
                    if (chunk !== null && chunk !== undefined)
                        this.write(chunk, encoding);
                    if (state.corked) {
                        state.corked = 1;
                        this.uncork()
                    }
                    if (!state.ending && !state.finished)
                        endWritable(this, state, cb)
                }
                ;
                function needFinish(state) {
                    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing
                }
                function callFinal(stream, state) {
                    stream._final(function(err) {
                        state.pendingcb--;
                        if (err) {
                            stream.emit("error", err)
                        }
                        state.prefinished = true;
                        stream.emit("prefinish");
                        finishMaybe(stream, state)
                    })
                }
                function prefinish(stream, state) {
                    if (!state.prefinished && !state.finalCalled) {
                        if (typeof stream._final === "function") {
                            state.pendingcb++;
                            state.finalCalled = true;
                            processNextTick(callFinal, stream, state)
                        } else {
                            state.prefinished = true;
                            stream.emit("prefinish")
                        }
                    }
                }
                function finishMaybe(stream, state) {
                    var need = needFinish(state);
                    if (need) {
                        prefinish(stream, state);
                        if (state.pendingcb === 0) {
                            state.finished = true;
                            stream.emit("finish")
                        }
                    }
                    return need
                }
                function endWritable(stream, state, cb) {
                    state.ending = true;
                    finishMaybe(stream, state);
                    if (cb) {
                        if (state.finished)
                            processNextTick(cb);
                        else
                            stream.once("finish", cb)
                    }
                    state.ended = true;
                    stream.writable = false
                }
                function onCorkedFinish(corkReq, state, err) {
                    var entry = corkReq.entry;
                    corkReq.entry = null;
                    while (entry) {
                        var cb = entry.callback;
                        state.pendingcb--;
                        cb(err);
                        entry = entry.next
                    }
                    if (state.corkedRequestsFree) {
                        state.corkedRequestsFree.next = corkReq
                    } else {
                        state.corkedRequestsFree = corkReq
                    }
                }
                Object.defineProperty(Writable.prototype, "destroyed", {
                    get: function() {
                        if (this._writableState === undefined) {
                            return false
                        }
                        return this._writableState.destroyed
                    },
                    set: function(value) {
                        if (!this._writableState) {
                            return
                        }
                        this._writableState.destroyed = value
                    }
                });
                Writable.prototype.destroy = destroyImpl.destroy;
                Writable.prototype._undestroy = destroyImpl.undestroy;
                Writable.prototype._destroy = function(err, cb) {
                    this.end();
                    cb(err)
                }
            }
            ).call(this, require("_process"))
        }
        , {
            "./_stream_duplex": 85,
            "./internal/streams/destroy": 91,
            "./internal/streams/stream": 92,
            _process: 73,
            "core-util-is": 9,
            inherits: 26,
            "process-nextick-args": 72,
            "safe-buffer": 80,
            "util-deprecate": 101
        }],
        90: [function(require, module, exports) {
            "use strict";
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function")
                }
            }
            var Buffer = require("safe-buffer").Buffer;
            function copyBuffer(src, target, offset) {
                src.copy(target, offset)
            }
            module.exports = function() {
                function BufferList() {
                    _classCallCheck(this, BufferList);
                    this.head = null;
                    this.tail = null;
                    this.length = 0
                }
                BufferList.prototype.push = function push(v) {
                    var entry = {
                        data: v,
                        next: null
                    };
                    if (this.length > 0)
                        this.tail.next = entry;
                    else
                        this.head = entry;
                    this.tail = entry;
                    ++this.length
                }
                ;
                BufferList.prototype.unshift = function unshift(v) {
                    var entry = {
                        data: v,
                        next: this.head
                    };
                    if (this.length === 0)
                        this.tail = entry;
                    this.head = entry;
                    ++this.length
                }
                ;
                BufferList.prototype.shift = function shift() {
                    if (this.length === 0)
                        return;
                    var ret = this.head.data;
                    if (this.length === 1)
                        this.head = this.tail = null;
                    else
                        this.head = this.head.next;
                    --this.length;
                    return ret
                }
                ;
                BufferList.prototype.clear = function clear() {
                    this.head = this.tail = null;
                    this.length = 0
                }
                ;
                BufferList.prototype.join = function join(s) {
                    if (this.length === 0)
                        return "";
                    var p = this.head;
                    var ret = "" + p.data;
                    while (p = p.next) {
                        ret += s + p.data
                    }
                    return ret
                }
                ;
                BufferList.prototype.concat = function concat(n) {
                    if (this.length === 0)
                        return Buffer.alloc(0);
                    if (this.length === 1)
                        return this.head.data;
                    var ret = Buffer.allocUnsafe(n >>> 0);
                    var p = this.head;
                    var i = 0;
                    while (p) {
                        copyBuffer(p.data, ret, i);
                        i += p.data.length;
                        p = p.next
                    }
                    return ret
                }
                ;
                return BufferList
            }()
        }
        , {
            "safe-buffer": 80
        }],
        91: [function(require, module, exports) {
            "use strict";
            var processNextTick = require("process-nextick-args");
            function destroy(err, cb) {
                var _this = this;
                var readableDestroyed = this._readableState && this._readableState.destroyed;
                var writableDestroyed = this._writableState && this._writableState.destroyed;
                if (readableDestroyed || writableDestroyed) {
                    if (cb) {
                        cb(err)
                    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
                        processNextTick(emitErrorNT, this, err)
                    }
                    return
                }
                if (this._readableState) {
                    this._readableState.destroyed = true
                }
                if (this._writableState) {
                    this._writableState.destroyed = true
                }
                this._destroy(err || null, function(err) {
                    if (!cb && err) {
                        processNextTick(emitErrorNT, _this, err);
                        if (_this._writableState) {
                            _this._writableState.errorEmitted = true
                        }
                    } else if (cb) {
                        cb(err)
                    }
                })
            }
            function undestroy() {
                if (this._readableState) {
                    this._readableState.destroyed = false;
                    this._readableState.reading = false;
                    this._readableState.ended = false;
                    this._readableState.endEmitted = false
                }
                if (this._writableState) {
                    this._writableState.destroyed = false;
                    this._writableState.ended = false;
                    this._writableState.ending = false;
                    this._writableState.finished = false;
                    this._writableState.errorEmitted = false
                }
            }
            function emitErrorNT(self, err) {
                self.emit("error", err)
            }
            module.exports = {
                destroy: destroy,
                undestroy: undestroy
            }
        }
        , {
            "process-nextick-args": 72
        }],
        92: [function(require, module, exports) {
            module.exports = require("events").EventEmitter
        }
        , {
            events: 14
        }],
        93: [function(require, module, exports) {
            module.exports = require("./readable").PassThrough
        }
        , {
            "./readable": 94
        }],
        94: [function(require, module, exports) {
            exports = module.exports = require("./lib/_stream_readable.js");
            exports.Stream = exports;
            exports.Readable = exports;
            exports.Writable = require("./lib/_stream_writable.js");
            exports.Duplex = require("./lib/_stream_duplex.js");
            exports.Transform = require("./lib/_stream_transform.js");
            exports.PassThrough = require("./lib/_stream_passthrough.js")
        }
        , {
            "./lib/_stream_duplex.js": 85,
            "./lib/_stream_passthrough.js": 86,
            "./lib/_stream_readable.js": 87,
            "./lib/_stream_transform.js": 88,
            "./lib/_stream_writable.js": 89
        }],
        95: [function(require, module, exports) {
            module.exports = require("./readable").Transform
        }
        , {
            "./readable": 94
        }],
        96: [function(require, module, exports) {
            module.exports = require("./lib/_stream_writable.js")
        }
        , {
            "./lib/_stream_writable.js": 89
        }],
        97: [function(require, module, exports) {
            "use strict";
            var Buffer = require("safe-buffer").Buffer;
            var isEncoding = Buffer.isEncoding || function(encoding) {
                encoding = "" + encoding;
                switch (encoding && encoding.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                    return true;
                default:
                    return false
                }
            }
            ;
            function _normalizeEncoding(enc) {
                if (!enc)
                    return "utf8";
                var retried;
                while (true) {
                    switch (enc) {
                    case "utf8":
                    case "utf-8":
                        return "utf8";
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return "utf16le";
                    case "latin1":
                    case "binary":
                        return "latin1";
                    case "base64":
                    case "ascii":
                    case "hex":
                        return enc;
                    default:
                        if (retried)
                            return;
                        enc = ("" + enc).toLowerCase();
                        retried = true
                    }
                }
            }
            function normalizeEncoding(enc) {
                var nenc = _normalizeEncoding(enc);
                if (typeof nenc !== "string" && (Buffer.isEncoding === isEncoding || !isEncoding(enc)))
                    throw new Error("Unknown encoding: " + enc);
                return nenc || enc
            }
            exports.StringDecoder = StringDecoder;
            function StringDecoder(encoding) {
                this.encoding = normalizeEncoding(encoding);
                var nb;
                switch (this.encoding) {
                case "utf16le":
                    this.text = utf16Text;
                    this.end = utf16End;
                    nb = 4;
                    break;
                case "utf8":
                    this.fillLast = utf8FillLast;
                    nb = 4;
                    break;
                case "base64":
                    this.text = base64Text;
                    this.end = base64End;
                    nb = 3;
                    break;
                default:
                    this.write = simpleWrite;
                    this.end = simpleEnd;
                    return
                }
                this.lastNeed = 0;
                this.lastTotal = 0;
                this.lastChar = Buffer.allocUnsafe(nb)
            }
            StringDecoder.prototype.write = function(buf) {
                if (buf.length === 0)
                    return "";
                var r;
                var i;
                if (this.lastNeed) {
                    r = this.fillLast(buf);
                    if (r === undefined)
                        return "";
                    i = this.lastNeed;
                    this.lastNeed = 0
                } else {
                    i = 0
                }
                if (i < buf.length)
                    return r ? r + this.text(buf, i) : this.text(buf, i);
                return r || ""
            }
            ;
            StringDecoder.prototype.end = utf8End;
            StringDecoder.prototype.text = utf8Text;
            StringDecoder.prototype.fillLast = function(buf) {
                if (this.lastNeed <= buf.length) {
                    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal)
                }
                buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
                this.lastNeed -= buf.length
            }
            ;
            function utf8CheckByte(byte) {
                if (byte <= 127)
                    return 0;
                else if (byte >> 5 === 6)
                    return 2;
                else if (byte >> 4 === 14)
                    return 3;
                else if (byte >> 3 === 30)
                    return 4;
                return -1
            }
            function utf8CheckIncomplete(self, buf, i) {
                var j = buf.length - 1;
                if (j < i)
                    return 0;
                var nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0)
                        self.lastNeed = nb - 1;
                    return nb
                }
                if (--j < i)
                    return 0;
                nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0)
                        self.lastNeed = nb - 2;
                    return nb
                }
                if (--j < i)
                    return 0;
                nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) {
                        if (nb === 2)
                            nb = 0;
                        else
                            self.lastNeed = nb - 3
                    }
                    return nb
                }
                return 0
            }
            function utf8CheckExtraBytes(self, buf, p) {
                if ((buf[0] & 192) !== 128) {
                    self.lastNeed = 0;
                    return "�".repeat(p)
                }
                if (self.lastNeed > 1 && buf.length > 1) {
                    if ((buf[1] & 192) !== 128) {
                        self.lastNeed = 1;
                        return "�".repeat(p + 1)
                    }
                    if (self.lastNeed > 2 && buf.length > 2) {
                        if ((buf[2] & 192) !== 128) {
                            self.lastNeed = 2;
                            return "�".repeat(p + 2)
                        }
                    }
                }
            }
            function utf8FillLast(buf) {
                var p = this.lastTotal - this.lastNeed;
                var r = utf8CheckExtraBytes(this, buf, p);
                if (r !== undefined)
                    return r;
                if (this.lastNeed <= buf.length) {
                    buf.copy(this.lastChar, p, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal)
                }
                buf.copy(this.lastChar, p, 0, buf.length);
                this.lastNeed -= buf.length
            }
            function utf8Text(buf, i) {
                var total = utf8CheckIncomplete(this, buf, i);
                if (!this.lastNeed)
                    return buf.toString("utf8", i);
                this.lastTotal = total;
                var end = buf.length - (total - this.lastNeed);
                buf.copy(this.lastChar, 0, end);
                return buf.toString("utf8", i, end)
            }
            function utf8End(buf) {
                var r = buf && buf.length ? this.write(buf) : "";
                if (this.lastNeed)
                    return r + "�".repeat(this.lastTotal - this.lastNeed);
                return r
            }
            function utf16Text(buf, i) {
                if ((buf.length - i) % 2 === 0) {
                    var r = buf.toString("utf16le", i);
                    if (r) {
                        var c = r.charCodeAt(r.length - 1);
                        if (c >= 55296 && c <= 56319) {
                            this.lastNeed = 2;
                            this.lastTotal = 4;
                            this.lastChar[0] = buf[buf.length - 2];
                            this.lastChar[1] = buf[buf.length - 1];
                            return r.slice(0, -1)
                        }
                    }
                    return r
                }
                this.lastNeed = 1;
                this.lastTotal = 2;
                this.lastChar[0] = buf[buf.length - 1];
                return buf.toString("utf16le", i, buf.length - 1)
            }
            function utf16End(buf) {
                var r = buf && buf.length ? this.write(buf) : "";
                if (this.lastNeed) {
                    var end = this.lastTotal - this.lastNeed;
                    return r + this.lastChar.toString("utf16le", 0, end)
                }
                return r
            }
            function base64Text(buf, i) {
                var n = (buf.length - i) % 3;
                if (n === 0)
                    return buf.toString("base64", i);
                this.lastNeed = 3 - n;
                this.lastTotal = 3;
                if (n === 1) {
                    this.lastChar[0] = buf[buf.length - 1]
                } else {
                    this.lastChar[0] = buf[buf.length - 2];
                    this.lastChar[1] = buf[buf.length - 1]
                }
                return buf.toString("base64", i, buf.length - n)
            }
            function base64End(buf) {
                var r = buf && buf.length ? this.write(buf) : "";
                if (this.lastNeed)
                    return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
                return r
            }
            function simpleWrite(buf) {
                return buf.toString(this.encoding)
            }
            function simpleEnd(buf) {
                return buf && buf.length ? this.write(buf) : ""
            }
        }
        , {
            "safe-buffer": 80
        }],
        98: [function(require, module, exports) {
            var Buffer = require("buffer").Buffer;
            var isBufferEncoding = Buffer.isEncoding || function(encoding) {
                switch (encoding && encoding.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                    return true;
                default:
                    return false
                }
            }
            ;
            function assertEncoding(encoding) {
                if (encoding && !isBufferEncoding(encoding)) {
                    throw new Error("Unknown encoding: " + encoding)
                }
            }
            var StringDecoder = exports.StringDecoder = function(encoding) {
                this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
                assertEncoding(encoding);
                switch (this.encoding) {
                case "utf8":
                    this.surrogateSize = 3;
                    break;
                case "ucs2":
                case "utf16le":
                    this.surrogateSize = 2;
                    this.detectIncompleteChar = utf16DetectIncompleteChar;
                    break;
                case "base64":
                    this.surrogateSize = 3;
                    this.detectIncompleteChar = base64DetectIncompleteChar;
                    break;
                default:
                    this.write = passThroughWrite;
                    return
                }
                this.charBuffer = new Buffer(6);
                this.charReceived = 0;
                this.charLength = 0
            }
            ;
            StringDecoder.prototype.write = function(buffer) {
                var charStr = "";
                while (this.charLength) {
                    var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
                    buffer.copy(this.charBuffer, this.charReceived, 0, available);
                    this.charReceived += available;
                    if (this.charReceived < this.charLength) {
                        return ""
                    }
                    buffer = buffer.slice(available, buffer.length);
                    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                    var charCode = charStr.charCodeAt(charStr.length - 1);
                    if (charCode >= 55296 && charCode <= 56319) {
                        this.charLength += this.surrogateSize;
                        charStr = "";
                        continue
                    }
                    this.charReceived = this.charLength = 0;
                    if (buffer.length === 0) {
                        return charStr
                    }
                    break
                }
                this.detectIncompleteChar(buffer);
                var end = buffer.length;
                if (this.charLength) {
                    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
                    end -= this.charReceived
                }
                charStr += buffer.toString(this.encoding, 0, end);
                var end = charStr.length - 1;
                var charCode = charStr.charCodeAt(end);
                if (charCode >= 55296 && charCode <= 56319) {
                    var size = this.surrogateSize;
                    this.charLength += size;
                    this.charReceived += size;
                    this.charBuffer.copy(this.charBuffer, size, 0, size);
                    buffer.copy(this.charBuffer, 0, 0, size);
                    return charStr.substring(0, end)
                }
                return charStr
            }
            ;
            StringDecoder.prototype.detectIncompleteChar = function(buffer) {
                var i = buffer.length >= 3 ? 3 : buffer.length;
                for (; i > 0; i--) {
                    var c = buffer[buffer.length - i];
                    if (i == 1 && c >> 5 == 6) {
                        this.charLength = 2;
                        break
                    }
                    if (i <= 2 && c >> 4 == 14) {
                        this.charLength = 3;
                        break
                    }
                    if (i <= 3 && c >> 3 == 30) {
                        this.charLength = 4;
                        break
                    }
                }
                this.charReceived = i
            }
            ;
            StringDecoder.prototype.end = function(buffer) {
                var res = "";
                if (buffer && buffer.length)
                    res = this.write(buffer);
                if (this.charReceived) {
                    var cr = this.charReceived;
                    var buf = this.charBuffer;
                    var enc = this.encoding;
                    res += buf.slice(0, cr).toString(enc)
                }
                return res
            }
            ;
            function passThroughWrite(buffer) {
                return buffer.toString(this.encoding)
            }
            function utf16DetectIncompleteChar(buffer) {
                this.charReceived = buffer.length % 2;
                this.charLength = this.charReceived ? 2 : 0
            }
            function base64DetectIncompleteChar(buffer) {
                this.charReceived = buffer.length % 3;
                this.charLength = this.charReceived ? 3 : 0
            }
        }
        , {
            buffer: 7
        }],
        99: [function(require, module, exports) {
            (function(process) {
                var Stream = require("stream");
                exports = module.exports = through;
                through.through = through;
                function through(write, end, opts) {
                    write = write || function(data) {
                        this.queue(data)
                    }
                    ;
                    end = end || function() {
                        this.queue(null)
                    }
                    ;
                    var ended = false
                      , destroyed = false
                      , buffer = []
                      , _ended = false;
                    var stream = new Stream;
                    stream.readable = stream.writable = true;
                    stream.paused = false;
                    stream.autoDestroy = !(opts && opts.autoDestroy === false);
                    stream.write = function(data) {
                        write.call(this, data);
                        return !stream.paused
                    }
                    ;
                    function drain() {
                        while (buffer.length && !stream.paused) {
                            var data = buffer.shift();
                            if (null === data)
                                return stream.emit("end");
                            else
                                stream.emit("data", data)
                        }
                    }
                    stream.queue = stream.push = function(data) {
                        if (_ended)
                            return stream;
                        if (data === null)
                            _ended = true;
                        buffer.push(data);
                        drain();
                        return stream
                    }
                    ;
                    stream.on("end", function() {
                        stream.readable = false;
                        if (!stream.writable && stream.autoDestroy)
                            process.nextTick(function() {
                                stream.destroy()
                            })
                    });
                    function _end() {
                        stream.writable = false;
                        end.call(stream);
                        if (!stream.readable && stream.autoDestroy)
                            stream.destroy()
                    }
                    stream.end = function(data) {
                        if (ended)
                            return;
                        ended = true;
                        if (arguments.length)
                            stream.write(data);
                        _end();
                        return stream
                    }
                    ;
                    stream.destroy = function() {
                        if (destroyed)
                            return;
                        destroyed = true;
                        ended = true;
                        buffer.length = 0;
                        stream.writable = stream.readable = false;
                        stream.emit("close");
                        return stream
                    }
                    ;
                    stream.pause = function() {
                        if (stream.paused)
                            return;
                        stream.paused = true;
                        return stream
                    }
                    ;
                    stream.resume = function() {
                        if (stream.paused) {
                            stream.paused = false;
                            stream.emit("resume")
                        }
                        drain();
                        if (!stream.paused)
                            stream.emit("drain");
                        return stream
                    }
                    ;
                    return stream
                }
            }
            ).call(this, require("_process"))
        }
        , {
            _process: 73,
            stream: 82
        }],
        100: [function(require, module, exports) {
            "use strict";
            function unique_pred(list, compare) {
                var ptr = 1
                  , len = list.length
                  , a = list[0]
                  , b = list[0];
                for (var i = 1; i < len; ++i) {
                    b = a;
                    a = list[i];
                    if (compare(a, b)) {
                        if (i === ptr) {
                            ptr++;
                            continue
                        }
                        list[ptr++] = a
                    }
                }
                list.length = ptr;
                return list
            }
            function unique_eq(list) {
                var ptr = 1
                  , len = list.length
                  , a = list[0]
                  , b = list[0];
                for (var i = 1; i < len; ++i,
                b = a) {
                    b = a;
                    a = list[i];
                    if (a !== b) {
                        if (i === ptr) {
                            ptr++;
                            continue
                        }
                        list[ptr++] = a
                    }
                }
                list.length = ptr;
                return list
            }
            function unique(list, compare, sorted) {
                if (list.length === 0) {
                    return list
                }
                if (compare) {
                    if (!sorted) {
                        list.sort(compare)
                    }
                    return unique_pred(list, compare)
                }
                if (!sorted) {
                    list.sort()
                }
                return unique_eq(list)
            }
            module.exports = unique
        }
        , {}],
        101: [function(require, module, exports) {
            (function(global) {
                module.exports = deprecate;
                function deprecate(fn, msg) {
                    if (config("noDeprecation")) {
                        return fn
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (config("throwDeprecation")) {
                                throw new Error(msg)
                            } else if (config("traceDeprecation")) {
                                console.trace(msg)
                            } else {
                                console.warn(msg)
                            }
                            warned = true
                        }
                        return fn.apply(this, arguments)
                    }
                    return deprecated
                }
                function config(name) {
                    try {
                        if (!global.localStorage)
                            return false
                    } catch (_) {
                        return false
                    }
                    var val = global.localStorage[name];
                    if (null == val)
                        return false;
                    return String(val).toLowerCase() === "true"
                }
            }
            ).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }
        , {}],
        102: [function(require, module, exports) {
            arguments[4][26][0].apply(exports, arguments)
        }
        , {
            dup: 26
        }],
        103: [function(require, module, exports) {
            module.exports = function isBuffer(arg) {
                return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function"
            }
        }
        , {}],
        104: [function(require, module, exports) {
            (function(process, global) {
                var formatRegExp = /%[sdj%]/g;
                exports.format = function(f) {
                    if (!isString(f)) {
                        var objects = [];
                        for (var i = 0; i < arguments.length; i++) {
                            objects.push(inspect(arguments[i]))
                        }
                        return objects.join(" ")
                    }
                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function(x) {
                        if (x === "%%")
                            return "%";
                        if (i >= len)
                            return x;
                        switch (x) {
                        case "%s":
                            return String(args[i++]);
                        case "%d":
                            return Number(args[i++]);
                        case "%j":
                            try {
                                return JSON.stringify(args[i++])
                            } catch (_) {
                                return "[Circular]"
                            }
                        default:
                            return x
                        }
                    });
                    for (var x = args[i]; i < len; x = args[++i]) {
                        if (isNull(x) || !isObject(x)) {
                            str += " " + x
                        } else {
                            str += " " + inspect(x)
                        }
                    }
                    return str
                }
                ;
                exports.deprecate = function(fn, msg) {
                    if (isUndefined(global.process)) {
                        return function() {
                            return exports.deprecate(fn, msg).apply(this, arguments)
                        }
                    }
                    if (process.noDeprecation === true) {
                        return fn
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (process.throwDeprecation) {
                                throw new Error(msg)
                            } else if (process.traceDeprecation) {
                                console.trace(msg)
                            } else {
                                console.error(msg)
                            }
                            warned = true
                        }
                        return fn.apply(this, arguments)
                    }
                    return deprecated
                }
                ;
                var debugs = {};
                var debugEnviron;
                exports.debuglog = function(set) {
                    if (isUndefined(debugEnviron))
                        debugEnviron = process.env.NODE_DEBUG || "";
                    set = set.toUpperCase();
                    if (!debugs[set]) {
                        if (new RegExp("\\b" + set + "\\b","i").test(debugEnviron)) {
                            var pid = process.pid;
                            debugs[set] = function() {
                                var msg = exports.format.apply(exports, arguments);
                                console.error("%s %d: %s", set, pid, msg)
                            }
                        } else {
                            debugs[set] = function() {}
                        }
                    }
                    return debugs[set]
                }
                ;
                function inspect(obj, opts) {
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    if (arguments.length >= 3)
                        ctx.depth = arguments[2];
                    if (arguments.length >= 4)
                        ctx.colors = arguments[3];
                    if (isBoolean(opts)) {
                        ctx.showHidden = opts
                    } else if (opts) {
                        exports._extend(ctx, opts)
                    }
                    if (isUndefined(ctx.showHidden))
                        ctx.showHidden = false;
                    if (isUndefined(ctx.depth))
                        ctx.depth = 2;
                    if (isUndefined(ctx.colors))
                        ctx.colors = false;
                    if (isUndefined(ctx.customInspect))
                        ctx.customInspect = true;
                    if (ctx.colors)
                        ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth)
                }
                exports.inspect = inspect;
                inspect.colors = {
                    bold: [1, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    white: [37, 39],
                    grey: [90, 39],
                    black: [30, 39],
                    blue: [34, 39],
                    cyan: [36, 39],
                    green: [32, 39],
                    magenta: [35, 39],
                    red: [31, 39],
                    yellow: [33, 39]
                };
                inspect.styles = {
                    special: "cyan",
                    number: "yellow",
                    boolean: "yellow",
                    undefined: "grey",
                    null: "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                };
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    if (style) {
                        return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m"
                    } else {
                        return str
                    }
                }
                function stylizeNoColor(str, styleType) {
                    return str
                }
                function arrayToHash(array) {
                    var hash = {};
                    array.forEach(function(val, idx) {
                        hash[val] = true
                    });
                    return hash
                }
                function formatValue(ctx, value, recurseTimes) {
                    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) {
                            ret = formatValue(ctx, ret, recurseTimes)
                        }
                        return ret
                    }
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive
                    }
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);
                    if (ctx.showHidden) {
                        keys = Object.getOwnPropertyNames(value)
                    }
                    if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
                        return formatError(value)
                    }
                    if (keys.length === 0) {
                        if (isFunction(value)) {
                            var name = value.name ? ": " + value.name : "";
                            return ctx.stylize("[Function" + name + "]", "special")
                        }
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp")
                        }
                        if (isDate(value)) {
                            return ctx.stylize(Date.prototype.toString.call(value), "date")
                        }
                        if (isError(value)) {
                            return formatError(value)
                        }
                    }
                    var base = ""
                      , array = false
                      , braces = ["{", "}"];
                    if (isArray(value)) {
                        array = true;
                        braces = ["[", "]"]
                    }
                    if (isFunction(value)) {
                        var n = value.name ? ": " + value.name : "";
                        base = " [Function" + n + "]"
                    }
                    if (isRegExp(value)) {
                        base = " " + RegExp.prototype.toString.call(value)
                    }
                    if (isDate(value)) {
                        base = " " + Date.prototype.toUTCString.call(value)
                    }
                    if (isError(value)) {
                        base = " " + formatError(value)
                    }
                    if (keys.length === 0 && (!array || value.length == 0)) {
                        return braces[0] + base + braces[1]
                    }
                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp")
                        } else {
                            return ctx.stylize("[Object]", "special")
                        }
                    }
                    ctx.seen.push(value);
                    var output;
                    if (array) {
                        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys)
                    } else {
                        output = keys.map(function(key) {
                            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
                        })
                    }
                    ctx.seen.pop();
                    return reduceToSingleString(output, base, braces)
                }
                function formatPrimitive(ctx, value) {
                    if (isUndefined(value))
                        return ctx.stylize("undefined", "undefined");
                    if (isString(value)) {
                        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return ctx.stylize(simple, "string")
                    }
                    if (isNumber(value))
                        return ctx.stylize("" + value, "number");
                    if (isBoolean(value))
                        return ctx.stylize("" + value, "boolean");
                    if (isNull(value))
                        return ctx.stylize("null", "null")
                }
                function formatError(value) {
                    return "[" + Error.prototype.toString.call(value) + "]"
                }
                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for (var i = 0, l = value.length; i < l; ++i) {
                        if (hasOwnProperty(value, String(i))) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true))
                        } else {
                            output.push("")
                        }
                    }
                    keys.forEach(function(key) {
                        if (!key.match(/^\d+$/)) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true))
                        }
                    });
                    return output
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || {
                        value: value[key]
                    };
                    if (desc.get) {
                        if (desc.set) {
                            str = ctx.stylize("[Getter/Setter]", "special")
                        } else {
                            str = ctx.stylize("[Getter]", "special")
                        }
                    } else {
                        if (desc.set) {
                            str = ctx.stylize("[Setter]", "special")
                        }
                    }
                    if (!hasOwnProperty(visibleKeys, key)) {
                        name = "[" + key + "]"
                    }
                    if (!str) {
                        if (ctx.seen.indexOf(desc.value) < 0) {
                            if (isNull(recurseTimes)) {
                                str = formatValue(ctx, desc.value, null)
                            } else {
                                str = formatValue(ctx, desc.value, recurseTimes - 1)
                            }
                            if (str.indexOf("\n") > -1) {
                                if (array) {
                                    str = str.split("\n").map(function(line) {
                                        return "  " + line
                                    }).join("\n").substr(2)
                                } else {
                                    str = "\n" + str.split("\n").map(function(line) {
                                        return "   " + line
                                    }).join("\n")
                                }
                            }
                        } else {
                            str = ctx.stylize("[Circular]", "special")
                        }
                    }
                    if (isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) {
                            return str
                        }
                        name = JSON.stringify("" + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = ctx.stylize(name, "name")
                        } else {
                            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                            name = ctx.stylize(name, "string")
                        }
                    }
                    return name + ": " + str
                }
                function reduceToSingleString(output, base, braces) {
                    var numLinesEst = 0;
                    var length = output.reduce(function(prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf("\n") >= 0)
                            numLinesEst++;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0);
                    if (length > 60) {
                        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1]
                    }
                    return braces[0] + base + " " + output.join(", ") + " " + braces[1]
                }
                function isArray(ar) {
                    return Array.isArray(ar)
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return typeof arg === "boolean"
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return arg === null
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return arg == null
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return typeof arg === "number"
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return typeof arg === "string"
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return typeof arg === "symbol"
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return arg === void 0
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === "[object RegExp]"
                }
                exports.isRegExp = isRegExp;
                function isObject(arg) {
                    return typeof arg === "object" && arg !== null
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return isObject(d) && objectToString(d) === "[object Date]"
                }
                exports.isDate = isDate;
                function isError(e) {
                    return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error)
                }
                exports.isError = isError;
                function isFunction(arg) {
                    return typeof arg === "function"
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined"
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = require("./support/isBuffer");
                function objectToString(o) {
                    return Object.prototype.toString.call(o)
                }
                function pad(n) {
                    return n < 10 ? "0" + n.toString(10) : n.toString(10)
                }
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                function timestamp() {
                    var d = new Date;
                    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
                    return [d.getDate(), months[d.getMonth()], time].join(" ")
                }
                exports.log = function() {
                    console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments))
                }
                ;
                exports.inherits = require("inherits");
                exports._extend = function(origin, add) {
                    if (!add || !isObject(add))
                        return origin;
                    var keys = Object.keys(add);
                    var i = keys.length;
                    while (i--) {
                        origin[keys[i]] = add[keys[i]]
                    }
                    return origin
                }
                ;
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop)
                }
            }
            ).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }
        , {
            "./support/isBuffer": 103,
            _process: 73,
            inherits: 102
        }]
    }, {}, [1])(1)
});
