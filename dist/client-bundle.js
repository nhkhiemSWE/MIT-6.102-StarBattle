(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"object-assign":7,"util/":4}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":3,"_process":16,"inherits":2}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

module.exports = exports = globalObject.fetch;

// Needed for TypeScript and Webpack.
if (globalObject.fetch) {
	exports.default = globalObject.fetch.bind(globalObject);
}

exports.Headers = globalObject.Headers;
exports.Request = globalObject.Request;
exports.Response = globalObject.Response;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],8:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.makeNonterminalConverters = void 0;
const types_1 = require("./types");
const assert_1 = __importDefault(require("assert"));
const parser_1 = require("./parser");
/**
 * Converts string to nonterminal.
 * @param <NT> nonterminal enumeration
 * @param nonterminals required to be the runtime object for the <NT> type parameter
 * @return a pair of converters { nonterminalToString, stringToNonterminal }
 *              one takes a string (any alphabetic case) and returns the nonterminal it names
 *              the other takes a nonterminal and returns its string name, using the Typescript source capitalization.
 *         Both converters throw GrammarError if the conversion can't be done.
 * @throws GrammarError if NT has a name collision (two nonterminal names that differ only in capitalization,
 *       e.g. ROOT and root).
 */
function makeNonterminalConverters(nonterminals) {
    // "canonical name" is a case-independent name (canonicalized to lowercase)
    // "source name" is the name capitalized as in the Typescript source definition of NT
    const nonterminalForCanonicalName = new Map();
    const sourceNameForNonterminal = new Map();
    for (const key of Object.keys(nonterminals)) {
        // in Typescript, the nonterminals object combines both a NT->name mapping and name->NT mapping.
        // https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime
        // So filter just to keys that are valid Parserlib nonterminal names
        if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(key)) {
            const sourceName = key;
            const canonicalName = key.toLowerCase();
            const nt = nonterminals[sourceName];
            if (nonterminalForCanonicalName.has(canonicalName)) {
                throw new types_1.GrammarError('name collision in nonterminal enumeration: '
                    + sourceNameForNonterminal.get(nonterminalForCanonicalName.get(canonicalName))
                    + ' and ' + sourceName
                    + ' are the same when compared case-insensitively');
            }
            nonterminalForCanonicalName.set(canonicalName, nt);
            sourceNameForNonterminal.set(nt, sourceName);
        }
    }
    //console.error(sourceNameForNonterminal);
    function stringToNonterminal(name) {
        const canonicalName = name.toLowerCase();
        if (!nonterminalForCanonicalName.has(canonicalName)) {
            throw new types_1.GrammarError('grammar uses nonterminal ' + name + ', which is not found in the nonterminal enumeration passed to compile()');
        }
        return nonterminalForCanonicalName.get(canonicalName);
    }
    function nonterminalToString(nt) {
        if (!sourceNameForNonterminal.has(nt)) {
            throw new types_1.GrammarError('nonterminal ' + nt + ' is not found in the nonterminal enumeration passed to compile()');
        }
        return sourceNameForNonterminal.get(nt);
    }
    return { stringToNonterminal, nonterminalToString };
}
exports.makeNonterminalConverters = makeNonterminalConverters;
var GrammarNT;
(function (GrammarNT) {
    GrammarNT[GrammarNT["GRAMMAR"] = 0] = "GRAMMAR";
    GrammarNT[GrammarNT["PRODUCTION"] = 1] = "PRODUCTION";
    GrammarNT[GrammarNT["SKIPBLOCK"] = 2] = "SKIPBLOCK";
    GrammarNT[GrammarNT["UNION"] = 3] = "UNION";
    GrammarNT[GrammarNT["CONCATENATION"] = 4] = "CONCATENATION";
    GrammarNT[GrammarNT["REPETITION"] = 5] = "REPETITION";
    GrammarNT[GrammarNT["REPEATOPERATOR"] = 6] = "REPEATOPERATOR";
    GrammarNT[GrammarNT["UNIT"] = 7] = "UNIT";
    GrammarNT[GrammarNT["NONTERMINAL"] = 8] = "NONTERMINAL";
    GrammarNT[GrammarNT["TERMINAL"] = 9] = "TERMINAL";
    GrammarNT[GrammarNT["QUOTEDSTRING"] = 10] = "QUOTEDSTRING";
    GrammarNT[GrammarNT["NUMBER"] = 11] = "NUMBER";
    GrammarNT[GrammarNT["RANGE"] = 12] = "RANGE";
    GrammarNT[GrammarNT["UPPERBOUND"] = 13] = "UPPERBOUND";
    GrammarNT[GrammarNT["LOWERBOUND"] = 14] = "LOWERBOUND";
    GrammarNT[GrammarNT["CHARACTERSET"] = 15] = "CHARACTERSET";
    GrammarNT[GrammarNT["ANYCHAR"] = 16] = "ANYCHAR";
    GrammarNT[GrammarNT["CHARACTERCLASS"] = 17] = "CHARACTERCLASS";
    GrammarNT[GrammarNT["WHITESPACE"] = 18] = "WHITESPACE";
    GrammarNT[GrammarNT["ONELINECOMMENT"] = 19] = "ONELINECOMMENT";
    GrammarNT[GrammarNT["BLOCKCOMMENT"] = 20] = "BLOCKCOMMENT";
    GrammarNT[GrammarNT["SKIP"] = 21] = "SKIP";
})(GrammarNT || (GrammarNT = {}));
;
function ntt(nonterminal) {
    return (0, parser_1.nt)(nonterminal, GrammarNT[nonterminal]);
}
const grammarGrammar = new Map();
// grammar ::= ( production | skipBlock )+
grammarGrammar.set(GrammarNT.GRAMMAR, (0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.star)((0, parser_1.cat)((0, parser_1.or)(ntt(GrammarNT.PRODUCTION), ntt(GrammarNT.SKIPBLOCK)), ntt(GrammarNT.SKIP)))));
// skipBlock ::= '@skip' nonterminal '{' production* '}'
grammarGrammar.set(GrammarNT.SKIPBLOCK, (0, parser_1.cat)((0, parser_1.str)("@skip"), ntt(GrammarNT.SKIP), (0, parser_1.failfast)(ntt(GrammarNT.NONTERMINAL)), ntt(GrammarNT.SKIP), (0, parser_1.str)('{'), (0, parser_1.failfast)((0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.PRODUCTION), ntt(GrammarNT.SKIP))), (0, parser_1.str)('}')))));
// production ::= nonterminal '::=' union ';'
grammarGrammar.set(GrammarNT.PRODUCTION, (0, parser_1.cat)(ntt(GrammarNT.NONTERMINAL), ntt(GrammarNT.SKIP), (0, parser_1.str)("::="), (0, parser_1.failfast)((0, parser_1.cat)(ntt(GrammarNT.SKIP), ntt(GrammarNT.UNION), ntt(GrammarNT.SKIP), (0, parser_1.str)(';')))));
// union :: = concatenation ('|' concatenation)*
grammarGrammar.set(GrammarNT.UNION, (0, parser_1.cat)(ntt(GrammarNT.CONCATENATION), (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.str)('|'), ntt(GrammarNT.SKIP), ntt(GrammarNT.CONCATENATION)))));
// concatenation :: = repetition* 
grammarGrammar.set(GrammarNT.CONCATENATION, (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.REPETITION), ntt(GrammarNT.SKIP))));
// repetition ::= unit repeatOperator?
grammarGrammar.set(GrammarNT.REPETITION, (0, parser_1.cat)(ntt(GrammarNT.UNIT), ntt(GrammarNT.SKIP), (0, parser_1.option)(ntt(GrammarNT.REPEATOPERATOR))));
// repeatOperator ::= [*+?] | '{' ( number | range | upperBound | lowerBound ) '}'
grammarGrammar.set(GrammarNT.REPEATOPERATOR, (0, parser_1.or)((0, parser_1.regex)("[*+?]"), (0, parser_1.cat)((0, parser_1.str)("{"), (0, parser_1.or)(ntt(GrammarNT.NUMBER), ntt(GrammarNT.RANGE), ntt(GrammarNT.UPPERBOUND), ntt(GrammarNT.LOWERBOUND)), (0, parser_1.str)("}"))));
// number ::= [0-9]+
grammarGrammar.set(GrammarNT.NUMBER, (0, parser_1.plus)((0, parser_1.regex)("[0-9]")));
// range ::= number ',' number
grammarGrammar.set(GrammarNT.RANGE, (0, parser_1.cat)(ntt(GrammarNT.NUMBER), (0, parser_1.str)(","), ntt(GrammarNT.NUMBER)));
// upperBound ::= ',' number
grammarGrammar.set(GrammarNT.UPPERBOUND, (0, parser_1.cat)((0, parser_1.str)(","), ntt(GrammarNT.NUMBER)));
// lowerBound ::= number ','
grammarGrammar.set(GrammarNT.LOWERBOUND, (0, parser_1.cat)(ntt(GrammarNT.NUMBER), (0, parser_1.str)(",")));
// unit ::= nonterminal | terminal | '(' union ')'
grammarGrammar.set(GrammarNT.UNIT, (0, parser_1.or)(ntt(GrammarNT.NONTERMINAL), ntt(GrammarNT.TERMINAL), (0, parser_1.cat)((0, parser_1.str)('('), ntt(GrammarNT.SKIP), ntt(GrammarNT.UNION), ntt(GrammarNT.SKIP), (0, parser_1.str)(')'))));
// nonterminal ::= [a-zA-Z_][a-zA-Z_0-9]*
grammarGrammar.set(GrammarNT.NONTERMINAL, (0, parser_1.cat)((0, parser_1.regex)("[a-zA-Z_]"), (0, parser_1.star)((0, parser_1.regex)("[a-zA-Z_0-9]"))));
// terminal ::= quotedString | characterSet | anyChar | characterClass
grammarGrammar.set(GrammarNT.TERMINAL, (0, parser_1.or)(ntt(GrammarNT.QUOTEDSTRING), ntt(GrammarNT.CHARACTERSET), ntt(GrammarNT.ANYCHAR), ntt(GrammarNT.CHARACTERCLASS)));
// quotedString ::= "'" ([^'\r\n\\] | '\\' . )* "'" | '"' ([^"\r\n\\] | '\\' . )* '"'
grammarGrammar.set(GrammarNT.QUOTEDSTRING, (0, parser_1.or)((0, parser_1.cat)((0, parser_1.str)("'"), (0, parser_1.failfast)((0, parser_1.star)((0, parser_1.or)((0, parser_1.regex)("[^'\r\n\\\\]"), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)("."))))), (0, parser_1.str)("'")), (0, parser_1.cat)((0, parser_1.str)('"'), (0, parser_1.failfast)((0, parser_1.star)((0, parser_1.or)((0, parser_1.regex)('[^"\r\n\\\\]'), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)("."))))), (0, parser_1.str)('"'))));
// characterSet ::= '[' ([^\]\r\n\\] | '\\' . )+ ']'
grammarGrammar.set(GrammarNT.CHARACTERSET, (0, parser_1.cat)((0, parser_1.str)('['), (0, parser_1.failfast)((0, parser_1.cat)((0, parser_1.plus)((0, parser_1.or)((0, parser_1.regex)("[^\\]\r\n\\\\]"), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)(".")))))), (0, parser_1.str)(']')));
// anyChar ::= '.'
grammarGrammar.set(GrammarNT.ANYCHAR, (0, parser_1.str)('.'));
// characterClass ::= '\\' [dsw]
grammarGrammar.set(GrammarNT.CHARACTERCLASS, (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.failfast)((0, parser_1.regex)("[dsw]"))));
// whitespace ::= [ \t\r\n]
grammarGrammar.set(GrammarNT.WHITESPACE, (0, parser_1.regex)("[ \t\r\n]"));
grammarGrammar.set(GrammarNT.ONELINECOMMENT, (0, parser_1.cat)((0, parser_1.str)("//"), (0, parser_1.star)((0, parser_1.regex)("[^\r\n]")), (0, parser_1.or)((0, parser_1.str)("\r\n"), (0, parser_1.str)('\n'), (0, parser_1.str)('\r'))));
grammarGrammar.set(GrammarNT.BLOCKCOMMENT, (0, parser_1.cat)((0, parser_1.str)("/*"), (0, parser_1.cat)((0, parser_1.star)((0, parser_1.regex)("[^*]")), (0, parser_1.str)('*')), (0, parser_1.star)((0, parser_1.cat)((0, parser_1.regex)("[^/]"), (0, parser_1.star)((0, parser_1.regex)("[^*]")), (0, parser_1.str)('*'))), (0, parser_1.str)('/')));
grammarGrammar.set(GrammarNT.SKIP, (0, parser_1.star)((0, parser_1.or)(ntt(GrammarNT.WHITESPACE), ntt(GrammarNT.ONELINECOMMENT), ntt(GrammarNT.BLOCKCOMMENT))));
const grammarParser = new parser_1.InternalParser(grammarGrammar, ntt(GrammarNT.GRAMMAR), (nt) => GrammarNT[nt]);
/**
 * Compile a Parser from a grammar represented as a string.
 * @param <NT> a Typescript Enum with one symbol for each nonterminal used in the grammar,
 *        matching the nonterminals when compared case-insensitively (so ROOT and Root and root are the same).
 * @param grammar the grammar to use
 * @param nonterminals the runtime object of the nonterminals enum. For example, if
 *             enum Nonterminals { root, a, b, c };
 *        then Nonterminals must be explicitly passed as this runtime parameter
 *              compile(grammar, Nonterminals, Nonterminals.root);
 *        (in addition to being implicitly used for the type parameter NT)
 * @param rootNonterminal the desired root nonterminal in the grammar
 * @return a parser for the given grammar that will start parsing at rootNonterminal.
 * @throws ParseError if the grammar has a syntax error
 */
function compile(grammar, nonterminals, rootNonterminal) {
    const { stringToNonterminal, nonterminalToString } = makeNonterminalConverters(nonterminals);
    const grammarTree = (() => {
        try {
            return grammarParser.parse(grammar);
        }
        catch (e) {
            throw (e instanceof types_1.InternalParseError) ? new types_1.GrammarError("grammar doesn't compile", e) : e;
        }
    })();
    const definitions = new Map();
    const nonterminalsDefined = new Set(); // on lefthand-side of some production
    const nonterminalsUsed = new Set(); // on righthand-side of some production
    // productions outside @skip blocks
    makeProductions(grammarTree.childrenByName(GrammarNT.PRODUCTION), null);
    // productions inside @skip blocks
    for (const skipBlock of grammarTree.childrenByName(GrammarNT.SKIPBLOCK)) {
        makeSkipBlock(skipBlock);
    }
    for (const nt of nonterminalsUsed) {
        if (!nonterminalsDefined.has(nt)) {
            throw new types_1.GrammarError("grammar is missing a definition for " + nonterminalToString(nt));
        }
    }
    if (!nonterminalsDefined.has(rootNonterminal)) {
        throw new types_1.GrammarError("grammar is missing a definition for the root nonterminal " + nonterminalToString(rootNonterminal));
    }
    return new parser_1.InternalParser(definitions, (0, parser_1.nt)(rootNonterminal, nonterminalToString(rootNonterminal)), nonterminalToString);
    function makeProductions(productions, skip) {
        for (const production of productions) {
            const nonterminalName = production.childrenByName(GrammarNT.NONTERMINAL)[0].text;
            const nonterminal = stringToNonterminal(nonterminalName);
            nonterminalsDefined.add(nonterminal);
            let expression = makeGrammarTerm(production.childrenByName(GrammarNT.UNION)[0], skip);
            if (skip)
                expression = (0, parser_1.cat)(skip, expression, skip);
            if (definitions.has(nonterminal)) {
                // grammar already has a production for this nonterminal; or expression onto it
                definitions.set(nonterminal, (0, parser_1.or)(definitions.get(nonterminal), expression));
            }
            else {
                definitions.set(nonterminal, expression);
            }
        }
    }
    function makeSkipBlock(skipBlock) {
        const nonterminalName = skipBlock.childrenByName(GrammarNT.NONTERMINAL)[0].text;
        const nonterminal = stringToNonterminal(nonterminalName);
        nonterminalsUsed.add(nonterminal);
        const skipTerm = (0, parser_1.skip)((0, parser_1.nt)(nonterminal, nonterminalName));
        makeProductions(skipBlock.childrenByName(GrammarNT.PRODUCTION), skipTerm);
    }
    function makeGrammarTerm(tree, skip) {
        switch (tree.name) {
            case GrammarNT.UNION: {
                const childexprs = tree.childrenByName(GrammarNT.CONCATENATION).map(child => makeGrammarTerm(child, skip));
                return childexprs.length == 1 ? childexprs[0] : (0, parser_1.or)(...childexprs);
            }
            case GrammarNT.CONCATENATION: {
                let childexprs = tree.childrenByName(GrammarNT.REPETITION).map(child => makeGrammarTerm(child, skip));
                if (skip) {
                    // insert skip between each pair of children
                    let childrenWithSkips = [];
                    for (const child of childexprs) {
                        if (childrenWithSkips.length > 0)
                            childrenWithSkips.push(skip);
                        childrenWithSkips.push(child);
                    }
                    childexprs = childrenWithSkips;
                }
                return (childexprs.length == 1) ? childexprs[0] : (0, parser_1.cat)(...childexprs);
            }
            case GrammarNT.REPETITION: {
                const unit = makeGrammarTerm(tree.childrenByName(GrammarNT.UNIT)[0], skip);
                const op = tree.childrenByName(GrammarNT.REPEATOPERATOR)[0];
                if (!op) {
                    return unit;
                }
                else {
                    const unitWithSkip = skip ? (0, parser_1.cat)(unit, skip) : unit;
                    //console.log('op is', op);
                    switch (op.text) {
                        case '*': return (0, parser_1.star)(unitWithSkip);
                        case '+': return (0, parser_1.plus)(unitWithSkip);
                        case '?': return (0, parser_1.option)(unitWithSkip);
                        default: {
                            // op is {n,m} or one of its variants
                            const range = op.children[0];
                            switch (range.name) {
                                case GrammarNT.NUMBER: {
                                    const n = parseInt(range.text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(n, n));
                                    break;
                                }
                                case GrammarNT.RANGE: {
                                    const n = parseInt(range.children[0].text);
                                    const m = parseInt(range.children[1].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(n, m));
                                    break;
                                }
                                case GrammarNT.UPPERBOUND: {
                                    const m = parseInt(range.children[0].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(0, m));
                                    break;
                                }
                                case GrammarNT.LOWERBOUND: {
                                    const n = parseInt(range.children[0].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.AtLeast(n));
                                    break;
                                }
                                default:
                                    throw new Error('internal error: unknown range: ' + range.name);
                            }
                        }
                    }
                }
            }
            case GrammarNT.UNIT:
                return makeGrammarTerm(tree.childrenByName(GrammarNT.NONTERMINAL)[0]
                    || tree.childrenByName(GrammarNT.TERMINAL)[0]
                    || tree.childrenByName(GrammarNT.UNION)[0], skip);
            case GrammarNT.NONTERMINAL: {
                const nonterminal = stringToNonterminal(tree.text);
                nonterminalsUsed.add(nonterminal);
                return (0, parser_1.nt)(nonterminal, tree.text);
            }
            case GrammarNT.TERMINAL:
                switch (tree.children[0].name) {
                    case GrammarNT.QUOTEDSTRING:
                        return (0, parser_1.str)(stripQuotesAndReplaceEscapeSequences(tree.text));
                    case GrammarNT.CHARACTERSET: // e.g. [abc]
                    case GrammarNT.ANYCHAR: // e.g.  .
                    case GrammarNT.CHARACTERCLASS: // e.g.  \d  \s  \w
                        return (0, parser_1.regex)(tree.text);
                    default:
                        throw new Error('internal error: unknown literal: ' + tree.children[0]);
                }
            default:
                throw new Error('internal error: unknown grammar rule: ' + tree.name);
        }
    }
    /**
     * Strip starting and ending quotes.
     * Replace \t, \r, \n with their character codes.
     * Replaces all other \x with literal x.
     */
    function stripQuotesAndReplaceEscapeSequences(s) {
        (0, assert_1.default)(s[0] == '"' || s[0] == "'");
        s = s.substring(1, s.length - 1);
        s = s.replace(/\\(.)/g, (match, escapedChar) => {
            switch (escapedChar) {
                case 't': return '\t';
                case 'r': return '\r';
                case 'n': return '\n';
                default: return escapedChar;
            }
        });
        return s;
    }
}
exports.compile = compile;

},{"./parser":10,"./types":12,"assert":1}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = exports.snippet = exports.escapeForReading = exports.toColumn = exports.toLine = exports.describeLocation = exports.makeErrorMessage = void 0;
/**
 * Make a human-readable error message explaining a parse error and where it was found in the input.
 * @param message brief message stating what error occurred
 * @param nonterminalName name of deepest nonterminal that parser was trying to match when parse failed
 * @param expectedText human-readable description of what string literals the parser was expecting there;
 *            e.g. ";", "[ \r\n\t]", "1|2|3"
 * @param stringBeingParsed original input to parse()
 * @param pos offset in stringBeingParsed where error occurred
 * @param nameOfStringBeingParsed human-readable description of where stringBeingParsed came from;
 *             e.g. "grammar" if stringBeingParsed was the input to Parser.compile(),
 *             or "string being parsed" if stringBeingParsed was the input to Parser.parse()
 * @return a multiline human-readable message that states the error, its location in the input,
 *         what text was expected and what text was actually found.
 */
function makeErrorMessage(message, nonterminalName, expectedText, stringBeingParsed, pos, nameOfStringBeingParsed) {
    let result = message;
    if (result.length > 0)
        result += "\n";
    result +=
        "Error at " + describeLocation(stringBeingParsed, pos) + " of " + nameOfStringBeingParsed + "\n"
            + "  trying to match " + nonterminalName.toUpperCase() + "\n"
            + "  expected " + escapeForReading(expectedText, "")
            + ((stringBeingParsed.length > 0)
                ? "\n   but saw " + snippet(stringBeingParsed, pos)
                : "");
    return result;
}
exports.makeErrorMessage = makeErrorMessage;
/**
 * @param string to describe
 * @param pos offset in string, 0<=pos<string.length()
 * @return a human-readable description of the location of the character at offset pos in string
 * (using offset and/or line/column if appropriate)
 */
function describeLocation(s, pos) {
    let result = "offset " + pos;
    if (s.indexOf('\n') != -1) {
        result += " (line " + toLine(s, pos) + " column " + toColumn(s, pos) + ")";
    }
    return result;
}
exports.describeLocation = describeLocation;
/**
 * Translates a string offset into a line number.
 * @param string in which offset occurs
 * @param pos offset in string, 0<=pos<string.length()
 * @return the 1-based line number of the character at offset pos in string,
 * as if string were being viewed in a text editor
 */
function toLine(s, pos) {
    let lineCount = 1;
    for (let newline = s.indexOf('\n'); newline != -1 && newline < pos; newline = s.indexOf('\n', newline + 1)) {
        ++lineCount;
    }
    return lineCount;
}
exports.toLine = toLine;
/**
 * Translates a string offset into a column number.
 * @param string in which offset occurs
 * @param pos offset in string, 0<=pos<string.length()
 * @return the 1-based column number of the character at offset pos in string,
 * as if string were being viewed in a text editor with tab size 1 (i.e. a tab is treated like a space)
 */
function toColumn(s, pos) {
    const lastNewlineBeforePos = s.lastIndexOf('\n', pos - 1);
    const totalSizeOfPrecedingLines = (lastNewlineBeforePos != -1) ? lastNewlineBeforePos + 1 : 0;
    return pos - totalSizeOfPrecedingLines + 1;
}
exports.toColumn = toColumn;
/**
* Replace common unprintable characters by their escape codes, for human reading.
* Should be idempotent, i.e. if x = escapeForReading(y), then x.equals(escapeForReading(x)).
* @param string to escape
* @param quote quotes to put around string, or "" if no quotes required
* @return string with escape codes replaced, preceded and followed by quote, with a human-readable legend appended to the end
*         explaining what the replacement characters mean.
*/
function escapeForReading(s, quote) {
    let result = s;
    const legend = [];
    for (const { unprintableChar, humanReadableVersion, description } of ESCAPES) {
        if (result.includes(unprintableChar)) {
            result = result.replace(unprintableChar, humanReadableVersion);
            legend.push(humanReadableVersion + " means " + description);
        }
    }
    result = quote + result + quote;
    if (legend.length > 0) {
        result += " (where " + legend.join(", ") + ")";
    }
    return result;
}
exports.escapeForReading = escapeForReading;
const ESCAPES = [
    {
        unprintableChar: "\n",
        humanReadableVersion: "\u2424",
        description: "newline"
    },
    {
        unprintableChar: "\r",
        humanReadableVersion: "\u240D",
        description: "carriage return"
    },
    {
        unprintableChar: "\t",
        humanReadableVersion: "\u21E5",
        description: "tab"
    },
];
/**
 * @param string to shorten
 * @param pos offset in string, 0<=pos<string.length()
 * @return a short snippet of the part of string starting at offset pos,
 * in human-readable form
 */
function snippet(s, pos) {
    const maxCharsToShow = 10;
    const end = Math.min(pos + maxCharsToShow, s.length);
    let result = s.substring(pos, end) + (end < s.length ? "..." : "");
    if (result.length == 0)
        result = "end of string";
    return escapeForReading(result, "");
}
exports.snippet = snippet;
/**
 * Indent a multi-line string by preceding each line with prefix.
 * @param string string to indent
 * @param prefix prefix to use for indenting
 * @return string with prefix inserted at the start of each line
 */
function indent(s, prefix) {
    let result = "";
    let charsCopied = 0;
    do {
        const newline = s.indexOf('\n', charsCopied);
        const endOfLine = newline != -1 ? newline + 1 : s.length;
        result += prefix + s.substring(charsCopied, endOfLine);
        charsCopied = endOfLine;
    } while (charsCopied < s.length);
    return result;
}
exports.indent = indent;

},{}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserState = exports.FailedParse = exports.SuccessfulParse = exports.InternalParser = exports.failfast = exports.skip = exports.option = exports.plus = exports.star = exports.repeat = exports.ZERO_OR_ONE = exports.ONE_OR_MORE = exports.ZERO_OR_MORE = exports.Between = exports.AtLeast = exports.or = exports.cat = exports.str = exports.regex = exports.nt = void 0;
const assert_1 = __importDefault(require("assert"));
const types_1 = require("./types");
const parsetree_1 = require("./parsetree");
function nt(nonterminal, nonterminalName) {
    return {
        parse(s, pos, definitions, state) {
            const gt = definitions.get(nonterminal);
            if (gt === undefined)
                throw new types_1.GrammarError("nonterminal has no definition: " + nonterminalName);
            // console.error("entering", nonterminalName);
            state.enter(pos, nonterminal);
            let pr = gt.parse(s, pos, definitions, state);
            state.leave(nonterminal);
            // console.error("leaving", nonterminalName, "with result", pr);
            if (!pr.failed && !state.isEmpty()) {
                const tree = pr.tree;
                const newTree = state.makeParseTree(tree.start, tree.text, [tree]);
                pr = pr.replaceTree(newTree);
            }
            return pr;
        },
        toString() {
            return nonterminalName;
        }
    };
}
exports.nt = nt;
function regex(regexSource) {
    let regex = new RegExp('^' + regexSource + '$', 's');
    return {
        parse(s, pos, definitions, state) {
            if (pos >= s.length) {
                return state.makeFailedParse(pos, regexSource);
            }
            const l = s.substring(pos, pos + 1);
            if (regex.test(l)) {
                return state.makeSuccessfulParse(pos, pos + 1, l);
            }
            return state.makeFailedParse(pos, regexSource);
        },
        toString() {
            return regexSource;
        }
    };
}
exports.regex = regex;
function str(str) {
    return {
        parse(s, pos, definitions, state) {
            const newpos = pos + str.length;
            if (newpos > s.length) {
                return state.makeFailedParse(pos, str);
            }
            const l = s.substring(pos, newpos);
            if (l === str) {
                return state.makeSuccessfulParse(pos, newpos, l);
            }
            return state.makeFailedParse(pos, str);
        },
        toString() {
            return "'" + str.replace(/'\r\n\t\\/, "\\$&") + "'";
        }
    };
}
exports.str = str;
function cat(...terms) {
    return {
        parse(s, pos, definitions, state) {
            let prout = state.makeSuccessfulParse(pos, pos);
            for (const gt of terms) {
                const pr = gt.parse(s, pos, definitions, state);
                if (pr.failed)
                    return pr;
                pos = pr.pos;
                prout = prout.mergeResult(pr);
            }
            return prout;
        },
        toString() {
            return "(" + terms.map(term => term.toString()).join(" ") + ")";
        }
    };
}
exports.cat = cat;
/**
 * @param choices must be nonempty
 */
function or(...choices) {
    (0, assert_1.default)(choices.length > 0);
    return {
        parse(s, pos, definitions, state) {
            const successes = [];
            const failures = [];
            choices.forEach((choice) => {
                const result = choice.parse(s, pos, definitions, state);
                if (result.failed) {
                    failures.push(result);
                }
                else {
                    successes.push(result);
                }
            });
            if (successes.length > 0) {
                const longestSuccesses = longestResults(successes);
                (0, assert_1.default)(longestSuccesses.length > 0);
                return longestSuccesses[0];
            }
            const longestFailures = longestResults(failures);
            (0, assert_1.default)(longestFailures.length > 0);
            return state.makeFailedParse(longestFailures[0].pos, longestFailures.map((result) => result.expectedText).join("|"));
        },
        toString() {
            return "(" + choices.map(choice => choice.toString()).join("|") + ")";
        }
    };
}
exports.or = or;
class AtLeast {
    constructor(min) {
        this.min = min;
    }
    tooLow(n) { return n < this.min; }
    tooHigh(n) { return false; }
    toString() {
        switch (this.min) {
            case 0: return "*";
            case 1: return "+";
            default: return "{" + this.min + ",}";
        }
    }
}
exports.AtLeast = AtLeast;
class Between {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    tooLow(n) { return n < this.min; }
    tooHigh(n) { return n > this.max; }
    toString() {
        if (this.min == 0) {
            return (this.max == 1) ? "?" : "{," + this.max + "}";
        }
        else {
            return "{" + this.min + "," + this.max + "}";
        }
    }
}
exports.Between = Between;
exports.ZERO_OR_MORE = new AtLeast(0);
exports.ONE_OR_MORE = new AtLeast(1);
exports.ZERO_OR_ONE = new Between(0, 1);
function repeat(gt, howmany) {
    return {
        parse(s, pos, definitions, state) {
            let prout = state.makeSuccessfulParse(pos, pos);
            for (let timesMatched = 0; howmany.tooLow(timesMatched) || !howmany.tooHigh(timesMatched + 1); ++timesMatched) {
                const pr = gt.parse(s, pos, definitions, state);
                if (pr.failed) {
                    // no match
                    if (howmany.tooLow(timesMatched)) {
                        return pr;
                    }
                    return prout.addLastFailure(pr);
                }
                else {
                    if (pr.pos == pos) {
                        // matched the empty string, and we already have enough.
                        // we may get into an infinite loop if howmany.tooHigh() never returns false,
                        // so return successful match at this point
                        return prout;
                    }
                    // otherwise advance the position and merge pr into prout
                    pos = pr.pos;
                    prout = prout.mergeResult(pr);
                }
            }
            return prout;
        },
        toString() {
            return gt.toString() + howmany.toString();
        }
    };
}
exports.repeat = repeat;
function star(gt) {
    return repeat(gt, exports.ZERO_OR_MORE);
}
exports.star = star;
function plus(gt) {
    return repeat(gt, exports.ONE_OR_MORE);
}
exports.plus = plus;
function option(gt) {
    return repeat(gt, exports.ZERO_OR_ONE);
}
exports.option = option;
function skip(nonterminal) {
    const repetition = star(nonterminal);
    return {
        parse(s, pos, definitions, state) {
            state.enterSkip();
            let pr = repetition.parse(s, pos, definitions, state);
            state.leaveSkip();
            if (pr.failed) {
                // succeed anyway
                pr = state.makeSuccessfulParse(pos, pos);
            }
            return pr;
        },
        toString() {
            return "(?<skip>" + repetition + ")";
        }
    };
}
exports.skip = skip;
function failfast(gt) {
    return {
        parse(s, pos, definitions, state) {
            let pr = gt.parse(s, pos, definitions, state);
            if (pr.failed)
                throw new types_1.InternalParseError("", pr.nonterminalName, pr.expectedText, "", pr.pos);
            return pr;
        },
        toString() {
            return 'failfast(' + gt + ')';
        }
    };
}
exports.failfast = failfast;
class InternalParser {
    constructor(definitions, start, nonterminalToString) {
        this.definitions = definitions;
        this.start = start;
        this.nonterminalToString = nonterminalToString;
        this.checkRep();
    }
    checkRep() {
    }
    parse(textToParse) {
        let pr = (() => {
            try {
                return this.start.parse(textToParse, 0, this.definitions, new ParserState(this.nonterminalToString));
            }
            catch (e) {
                if (e instanceof types_1.InternalParseError) {
                    // rethrow the exception, augmented by the original text, so that the error message is better
                    throw new types_1.InternalParseError("string does not match grammar", e.nonterminalName, e.expectedText, textToParse, e.pos);
                }
                else {
                    throw e;
                }
            }
        })();
        if (pr.failed) {
            throw new types_1.InternalParseError("string does not match grammar", pr.nonterminalName, pr.expectedText, textToParse, pr.pos);
        }
        if (pr.pos < textToParse.length) {
            const message = "only part of the string matches the grammar; the rest did not parse";
            throw (pr.lastFailure
                ? new types_1.InternalParseError(message, pr.lastFailure.nonterminalName, pr.lastFailure.expectedText, textToParse, pr.lastFailure.pos)
                : new types_1.InternalParseError(message, this.start.toString(), "end of string", textToParse, pr.pos));
        }
        return pr.tree;
    }
    ;
    toString() {
        return Array.from(this.definitions, ([nonterminal, rule]) => this.nonterminalToString(nonterminal) + '::=' + rule + ';').join("\n");
    }
}
exports.InternalParser = InternalParser;
class SuccessfulParse {
    constructor(pos, tree, lastFailure) {
        this.pos = pos;
        this.tree = tree;
        this.lastFailure = lastFailure;
        this.failed = false;
    }
    replaceTree(tree) {
        return new SuccessfulParse(this.pos, tree, this.lastFailure);
    }
    mergeResult(that) {
        (0, assert_1.default)(!that.failed);
        //console.log('merging', this, 'with', that);
        return new SuccessfulParse(that.pos, this.tree.concat(that.tree), laterResult(this.lastFailure, that.lastFailure));
    }
    /**
     * Keep track of a failing parse result that prevented this tree from matching more of the input string.
     * This deeper failure is usually more informative to the user, so we'll display it in the error message.
     * @param newLastFailure a failing ParseResult<NT> that stopped this tree's parse (but didn't prevent this from succeeding)
     * @return a new ParseResult<NT> identical to this one but with lastFailure added to it
     */
    addLastFailure(newLastFailure) {
        (0, assert_1.default)(newLastFailure.failed);
        return new SuccessfulParse(this.pos, this.tree, laterResult(this.lastFailure, newLastFailure));
    }
}
exports.SuccessfulParse = SuccessfulParse;
class FailedParse {
    constructor(pos, nonterminalName, expectedText) {
        this.pos = pos;
        this.nonterminalName = nonterminalName;
        this.expectedText = expectedText;
        this.failed = true;
    }
}
exports.FailedParse = FailedParse;
/**
 * @param result1
 * @param result2
 * @return whichever of result1 or result2 has the mximum position, or undefined if both are undefined
 */
function laterResult(result1, result2) {
    if (result1 && result2)
        return result1.pos >= result2.pos ? result1 : result2;
    else
        return result1 || result2;
}
/**
 * @param results
 * @return the results in the list with maximum pos.  Empty if list is empty.
 */
function longestResults(results) {
    return results.reduce((longestResultsSoFar, result) => {
        if (longestResultsSoFar.length == 0 || result.pos > longestResultsSoFar[0].pos) {
            // result wins
            return [result];
        }
        else if (result.pos == longestResultsSoFar[0].pos) {
            // result is tied
            longestResultsSoFar.push(result);
            return longestResultsSoFar;
        }
        else {
            // result loses
            return longestResultsSoFar;
        }
    }, []);
}
class ParserState {
    constructor(nonterminalToString) {
        this.nonterminalToString = nonterminalToString;
        this.stack = [];
        this.first = new Map();
        this.skipDepth = 0;
    }
    enter(pos, nonterminal) {
        if (!this.first.has(nonterminal)) {
            this.first.set(nonterminal, []);
        }
        const s = this.first.get(nonterminal);
        if (s.length > 0 && s[s.length - 1] == pos) {
            throw new types_1.GrammarError("detected left recursion in rule for " + this.nonterminalToString(nonterminal));
        }
        s.push(pos);
        this.stack.push(nonterminal);
    }
    leave(nonterminal) {
        (0, assert_1.default)(this.first.has(nonterminal) && this.first.get(nonterminal).length > 0);
        this.first.get(nonterminal).pop();
        const last = this.stack.pop();
        (0, assert_1.default)(last === nonterminal);
    }
    enterSkip() {
        //console.error('entering skip');
        ++this.skipDepth;
    }
    leaveSkip() {
        //console.error('leaving skip');
        --this.skipDepth;
        (0, assert_1.default)(this.skipDepth >= 0);
    }
    isEmpty() {
        return this.stack.length == 0;
    }
    get currentNonterminal() {
        return this.stack[this.stack.length - 1];
    }
    get currentNonterminalName() {
        return this.currentNonterminal !== undefined ? this.nonterminalToString(this.currentNonterminal) : undefined;
    }
    // requires: !isEmpty()
    makeParseTree(pos, text = '', children = []) {
        (0, assert_1.default)(!this.isEmpty());
        return new parsetree_1.InternalParseTree(this.currentNonterminal, this.currentNonterminalName, pos, text, children, this.skipDepth > 0);
    }
    // requires !isEmpty()
    makeSuccessfulParse(fromPos, toPos, text = '', children = []) {
        (0, assert_1.default)(!this.isEmpty());
        return new SuccessfulParse(toPos, this.makeParseTree(fromPos, text, children));
    }
    // requires !isEmpty()
    makeFailedParse(atPos, expectedText) {
        (0, assert_1.default)(!this.isEmpty());
        return new FailedParse(atPos, this.currentNonterminalName, expectedText);
    }
}
exports.ParserState = ParserState;

},{"./parsetree":11,"./types":12,"assert":1}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalParseTree = void 0;
const display_1 = require("./display");
class InternalParseTree {
    constructor(name, nonterminalName, start, text, allChildren, isSkipped) {
        this.name = name;
        this.nonterminalName = nonterminalName;
        this.start = start;
        this.text = text;
        this.allChildren = allChildren;
        this.isSkipped = isSkipped;
        this.checkRep();
        Object.freeze(this.allChildren);
        // can't freeze(this) because of beneficent mutation delayed computation-with-caching for children() and childrenByName()
    }
    checkRep() {
        // FIXME
    }
    get end() {
        return this.start + this.text.length;
    }
    childrenByName(name) {
        if (!this._childrenByName) {
            this._childrenByName = new Map();
            for (const child of this.allChildren) {
                if (!this._childrenByName.has(child.name)) {
                    this._childrenByName.set(child.name, []);
                }
                this._childrenByName.get(child.name).push(child);
            }
            for (const childList of this._childrenByName.values()) {
                Object.freeze(childList);
            }
        }
        this.checkRep();
        return this._childrenByName.get(name) || [];
    }
    get children() {
        if (!this._children) {
            this._children = this.allChildren.filter(child => !child.isSkipped);
            Object.freeze(this._children);
        }
        this.checkRep();
        return this._children;
    }
    concat(that) {
        return new InternalParseTree(this.name, this.nonterminalName, this.start, this.text + that.text, this.allChildren.concat(that.allChildren), this.isSkipped && that.isSkipped);
    }
    toString() {
        let s = (this.isSkipped ? "@skip " : "") + this.nonterminalName;
        if (this.children.length == 0) {
            s += ":" + (0, display_1.escapeForReading)(this.text, "\"");
        }
        else {
            let t = "";
            let offsetReachedSoFar = this.start;
            for (const pt of this.allChildren) {
                if (offsetReachedSoFar < pt.start) {
                    // previous child and current child have a gap between them that must have been matched as a terminal
                    // in the rule for this node.  Insert it as a quoted string.
                    const terminal = this.text.substring(offsetReachedSoFar - this.start, pt.start - this.start);
                    t += "\n" + (0, display_1.escapeForReading)(terminal, "\"");
                }
                t += "\n" + pt;
                offsetReachedSoFar = pt.end;
            }
            if (offsetReachedSoFar < this.end) {
                // final child and end of this node have a gap -- treat it the same as above.
                const terminal = this.text.substring(offsetReachedSoFar - this.start);
                t += "\n" + (0, display_1.escapeForReading)(terminal, "\"");
            }
            const smallEnoughForOneLine = 50;
            if (t.length <= smallEnoughForOneLine) {
                s += " { " + t.substring(1) // remove initial newline
                    .replace("\n", ", ")
                    + " }";
            }
            else {
                s += " {" + (0, display_1.indent)(t, "  ") + "\n}";
            }
        }
        return s;
    }
}
exports.InternalParseTree = InternalParseTree;

},{"./display":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarError = exports.InternalParseError = exports.ParseError = void 0;
const display_1 = require("./display");
/**
 * Exception thrown when a sequence of characters doesn't match a grammar
 */
class ParseError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ParseError = ParseError;
class InternalParseError extends ParseError {
    constructor(message, nonterminalName, expectedText, textBeingParsed, pos) {
        super((0, display_1.makeErrorMessage)(message, nonterminalName, expectedText, textBeingParsed, pos, "string being parsed"));
        this.nonterminalName = nonterminalName;
        this.expectedText = expectedText;
        this.textBeingParsed = textBeingParsed;
        this.pos = pos;
    }
}
exports.InternalParseError = InternalParseError;
class GrammarError extends ParseError {
    constructor(message, e) {
        super(e ? (0, display_1.makeErrorMessage)(message, e.nonterminalName, e.expectedText, e.textBeingParsed, e.pos, "grammar")
            : message);
    }
}
exports.GrammarError = GrammarError;

},{"./display":9}],13:[function(require,module,exports){
(function (__dirname){(function (){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAsHtml = exports.visualizeAsUrl = void 0;
const compiler_1 = require("./compiler");
const parserlib_1 = require("../parserlib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function emptyIterator() {
    return {
        next() { return { done: true }; }
    };
}
function getIterator(list) {
    return list[Symbol.iterator]();
}
const MAX_URL_LENGTH_FOR_DESKTOP_BROWSE = 2020;
/**
 * Visualizes a parse tree using a URL that can be pasted into your web browser.
 * @param parseTree tree to visualize
 * @param <NT> the enumeration of symbols in the parse tree's grammar
 * @return url that shows a visualization of the parse tree
 */
function visualizeAsUrl(parseTree, nonterminals) {
    const base = "http://web.mit.edu/6.031/www/parserlib/" + parserlib_1.VERSION + "/visualizer.html";
    const code = expressionForDisplay(parseTree, nonterminals);
    const url = base + '?code=' + fixedEncodeURIComponent(code);
    if (url.length > MAX_URL_LENGTH_FOR_DESKTOP_BROWSE) {
        // display alternate instructions to the console
        console.error('Visualization URL is too long for web browser and/or web server.\n'
            + 'Instead, go to ' + base + '\n'
            + 'and copy and paste this code into the textbox:\n'
            + code);
    }
    return url;
}
exports.visualizeAsUrl = visualizeAsUrl;
const visualizerHtmlFile = path_1.default.resolve(__dirname, '../../src/visualizer.html');
/**
 * Visualizes a parse tree as a string of HTML that can be displayed in a web browser.
 * @param parseTree tree to visualize
 * @param <NT> the enumeration of symbols in the parse tree's grammar
 * @return string of HTML that shows a visualization of the parse tree
 */
function visualizeAsHtml(parseTree, nonterminals) {
    const html = fs_1.default.readFileSync(visualizerHtmlFile, 'utf8');
    const code = expressionForDisplay(parseTree, nonterminals);
    const result = html.replace(/\/\/CODEHERE/, "return '" + fixedEncodeURIComponent(code) + "';");
    return result;
}
exports.visualizeAsHtml = visualizeAsHtml;
function expressionForDisplay(parseTree, nonterminals) {
    const { nonterminalToString } = (0, compiler_1.makeNonterminalConverters)(nonterminals);
    return forDisplay(parseTree, [], parseTree);
    function forDisplay(node, siblings, parent) {
        const name = nonterminalToString(node.name).toLowerCase();
        let s = "nd(";
        if (node.children.length == 0) {
            s += "\"" + name + "\",nd(\"'" + cleanString(node.text) + "'\"),";
        }
        else {
            s += "\"" + name + "\",";
            const children = node.allChildren.slice(); // make a copy for shifting
            const firstChild = children.shift();
            let childrenExpression = forDisplay(firstChild, children, node);
            if (node.start < firstChild.start) {
                // node and its first child have a gap between them that must have been matched as a terminal
                // in the rule for node.  Insert it as a quoted string.
                childrenExpression = precedeByTerminal(node.text.substring(0, firstChild.start - node.start), childrenExpression);
            }
            s += childrenExpression + ",";
        }
        if (siblings.length > 0) {
            const sibling = siblings.shift();
            let siblingExpression = forDisplay(sibling, siblings, parent);
            if (node.end < sibling.start) {
                // node and its sibling have a gap between them that must have been matched as a terminal
                // in the rule for parent.  Insert it as a quoted string.
                siblingExpression = precedeByTerminal(parent.text.substring(node.end - parent.start, sibling.start - parent.start), siblingExpression);
            }
            s += siblingExpression;
        }
        else {
            let siblingExpression = "uu";
            if (node.end < parent.end) {
                // There's a gap between the end of node and the end of its parent, which must be a terminal matched by parent.
                // Insert it as a quoted string.
                siblingExpression = precedeByTerminal(parent.text.substring(node.end - parent.start), siblingExpression);
            }
            s += siblingExpression;
        }
        if (node.isSkipped) {
            s += ",true";
        }
        s += ")";
        return s;
    }
    function precedeByTerminal(terminal, expression) {
        return "nd(\"'" + cleanString(terminal) + "'\", uu, " + expression + ")";
    }
    function cleanString(s) {
        let rvalue = s.replace(/\\/g, "\\\\");
        rvalue = rvalue.replace(/"/g, "\\\"");
        rvalue = rvalue.replace(/\n/g, "\\n");
        rvalue = rvalue.replace(/\r/g, "\\r");
        return rvalue;
    }
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function fixedEncodeURIComponent(s) {
    return encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
}

}).call(this)}).call(this,"/node_modules/parserlib/internal")

},{"../parserlib":14,"./compiler":8,"fs":5,"path":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAsHtml = exports.visualizeAsUrl = exports.compile = exports.ParseError = exports.VERSION = void 0;
exports.VERSION = "3.2.3";
var types_1 = require("./internal/types");
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return types_1.ParseError; } });
;
var compiler_1 = require("./internal/compiler");
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return compiler_1.compile; } });
var visualizer_1 = require("./internal/visualizer");
Object.defineProperty(exports, "visualizeAsUrl", { enumerable: true, get: function () { return visualizer_1.visualizeAsUrl; } });
Object.defineProperty(exports, "visualizeAsHtml", { enumerable: true, get: function () { return visualizer_1.visualizeAsHtml; } });

},{"./internal/compiler":8,"./internal/types":12,"./internal/visualizer":13}],15:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))

},{"_process":16}],16:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solvedPuzzleParser = exports.emptyPuzzleParser = exports.loadFile = exports.solvedParser = exports.emptyParser = exports.PuzzleGrammar = void 0;
const assert_1 = __importDefault(require("assert"));
const Puzzle_1 = require("./Puzzle");
const parserlib_1 = require("parserlib");
const fs_1 = __importDefault(require("fs"));
/**
 *  blankGrammar description:
 * puzzle is the size followed by the regions
 * size will always be 10x10
 * regions is region followed by one or more region
 * region corresponds to Coordinates + "\n"
 * Coordinates is one or more coords
 * coord is two ints separated by a ","
 */
const blankGrammar = `
@skip whitespace {
    puzzle ::= comments* size [\\n]+ region+;
    size ::= number 'x' number;
    region ::= '|' (cell)+ [\\n]+;
    cell ::= number ',' number;
    comments ::= '#' [\\S]* [\\n];
}
whitespace ::= [ \\t\\r]+;
number ::= [0-9]+;
`;
/**
 *  solvedGrammar description
 * puzzle is the size followed by the regions
 * size will always be 10x10
 * regions is region followed by one or more region
 * region corresponds to starCoords and remainingCoordinates separated by |
 * starCoords is supposed to only be 2 coord
 * remainingCoordinates is one or more coord
 * coord is two ints separated by a ","
 */
const solvedGrammar = `
@skip whitespace {
    puzzle ::= comments* size [\\n]+ (region)+;
    size ::= number 'x' number;
    region ::= solution '|' block;
    cell ::= number ',' number;
    solution ::= cell{2};
    block ::= (cell)+ [\\n]+;
    comments ::= '#' [\\S]* [\\n];
}
whitespace ::= [ \\t\\r]+;
number ::= [0-9]+;
`;
// the nonterminals of the grammar
var PuzzleGrammar;
(function (PuzzleGrammar) {
    PuzzleGrammar[PuzzleGrammar["Puzzle"] = 0] = "Puzzle";
    PuzzleGrammar[PuzzleGrammar["Size"] = 1] = "Size";
    PuzzleGrammar[PuzzleGrammar["Region"] = 2] = "Region";
    PuzzleGrammar[PuzzleGrammar["Cell"] = 3] = "Cell";
    PuzzleGrammar[PuzzleGrammar["Number"] = 4] = "Number";
    PuzzleGrammar[PuzzleGrammar["Solution"] = 5] = "Solution";
    PuzzleGrammar[PuzzleGrammar["Whitespace"] = 6] = "Whitespace";
    PuzzleGrammar[PuzzleGrammar["Block"] = 7] = "Block";
    PuzzleGrammar[PuzzleGrammar["Comments"] = 8] = "Comments";
})(PuzzleGrammar = exports.PuzzleGrammar || (exports.PuzzleGrammar = {}));
// compile the grammar for an empty puzzle into a parser
exports.emptyParser = (0, parserlib_1.compile)(blankGrammar, PuzzleGrammar, PuzzleGrammar.Puzzle);
// compile the grammar for an empty puzzle into a parser
exports.solvedParser = (0, parserlib_1.compile)(solvedGrammar, PuzzleGrammar, PuzzleGrammar.Puzzle);
/**
 * Load the string from a file given the fileName of that file
 * @param fileName, a string representing the name of that file
 * @returns, (a promise for) the string representing a puzzle (empty or solved)
 */
async function loadFile(fileName) {
    const file = await fs_1.default.promises.readFile(fileName, { encoding: 'utf-8' });
    return file;
}
exports.loadFile = loadFile;
/**
 * Parse a string into an expression.
 *
 * @param input string to parse
 * @returns Expression parsed from the string
 * @throws ParseError if the string doesn't match the Expression grammar
 */
function emptyPuzzleParser(input) {
    // parse the example into a parse tree
    const parseTree = exports.emptyParser.parse(input);
    // display the parse tree in various ways, for debugging only
    // console.log("parse tree:\n" + parseTree);
    // console.log(visualizeAsUrl(parseTree, PuzzleGrammar));
    // make an AST from the parse tree
    const emptyPuzzle = makeAbstractSyntaxTreeForEmpty(parseTree);
    // console.log("abstract syntax tree:\n" + emptyPuzzle);
    return emptyPuzzle;
}
exports.emptyPuzzleParser = emptyPuzzleParser;
/**
 * Convert a parse tree into an abstract syntax tree.
 *
 * @param parseTree constructed according to the grammar for image meme expressions
 * @returns abstract syntax tree corresponding to the parseTree
 */
function makeAbstractSyntaxTreeForEmpty(parseTree) {
    const regions = new Array();
    (0, assert_1.default)(parseTree.childrenByName(PuzzleGrammar.Region), 'missing region');
    for (const region of parseTree.childrenByName(PuzzleGrammar.Region)) {
        const setCells = new Array();
        (0, assert_1.default)(region.childrenByName(PuzzleGrammar.Cell), 'missing a child');
        for (const cell of region.children) {
            (0, assert_1.default)(cell.children[0], 'missing a child');
            (0, assert_1.default)(cell.children[1], 'missing a child');
            setCells.push(new Puzzle_1.Cell(parseInt(cell.children[0].text), parseInt(cell.children[1].text), Puzzle_1.Mark.Empty));
        }
        regions.push(new Puzzle_1.Region(setCells));
    }
    return new Puzzle_1.Puzzle(regions, Puzzle_1.PuzzleStatus.Unsolved);
}
/**
* Parse a string into an expression.
*
* @param input string to parse
* @returns Expression parsed from the string
* @throws ParseError if the string doesn't match the Expression grammar
*/
function solvedPuzzleParser(input) {
    // parse the example into a parse tree
    const parseTree = exports.solvedParser.parse(input);
    // display the parse tree in various ways, for debugging only
    //    console.log("parse tree:\n" + parseTree);
    //    console.log(visualizeAsUrl(parseTree, PuzzleGrammar));
    // make an AST from the parse tree
    const solvedPuzzle = makeAbstractSyntaxTreeForSolved(parseTree);
    //    console.log("abstract syntax tree:\n" + solvedPuzzle);
    return solvedPuzzle;
}
exports.solvedPuzzleParser = solvedPuzzleParser;
/**
 * Convert a parse tree into an abstract syntax tree.
 *
 * @param parseTree constructed according to the grammar for image meme expressions
 * @returns abstract syntax tree corresponding to the parseTree
 */
function makeAbstractSyntaxTreeForSolved(parseTree) {
    const regions = new Array();
    (0, assert_1.default)(parseTree.childrenByName(PuzzleGrammar.Region), 'missing region');
    for (const region of parseTree.childrenByName(PuzzleGrammar.Region)) {
        const setCells = new Array();
        (0, assert_1.default)(region.children[0], 'missing a child');
        (0, assert_1.default)(region.children[1], 'missing a child');
        for (const star of region.children[0].children) {
            (0, assert_1.default)(star.children[0], 'missing a child');
            (0, assert_1.default)(star.children[1], 'missing a child');
            setCells.push(new Puzzle_1.Cell(parseInt(star.children[0].text), parseInt(star.children[1].text), Puzzle_1.Mark.Empty));
        }
        for (const cell of region.children[1].children) {
            (0, assert_1.default)(cell.children[0], 'missing a child');
            (0, assert_1.default)(cell.children[1], 'missing a child');
            setCells.push(new Puzzle_1.Cell(parseInt(cell.children[0].text), parseInt(cell.children[1].text), Puzzle_1.Mark.Empty));
        }
        regions.push(new Puzzle_1.Region(setCells));
    }
    return new Puzzle_1.Puzzle(regions, Puzzle_1.PuzzleStatus.FullySolved);
}
function main() {
    const input = `# This is an solved Puzzle
    # This is a second comment that contains a lot of characters: 12345678890!@#$%^&*()_+<>?:"|}{[]p}
    10x10
    1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
    2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
    3,2  3,4  | 3,3
    2,7  4,8  | 3,6 3,7 3,8
    6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
    5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
    6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
    7,3  7,5  | 6,3 7,4 
    8,9 10,10 | 7,9 9,9 9,10
    9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
    `;
    const puzzle = solvedPuzzleParser(input);
}
if (require.main === module) {
    main();
}

},{"./Puzzle":18,"assert":1,"fs":5,"parserlib":14}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePuzzle = exports.makeRegion = exports.makeCell = exports.Cell = exports.Region = exports.Puzzle = exports.Mark = exports.PuzzleStatus = void 0;
const assert_1 = __importDefault(require("assert"));
var PuzzleStatus;
(function (PuzzleStatus) {
    PuzzleStatus[PuzzleStatus["Unsolved"] = 0] = "Unsolved";
    PuzzleStatus[PuzzleStatus["FullySolved"] = 1] = "FullySolved";
})(PuzzleStatus = exports.PuzzleStatus || (exports.PuzzleStatus = {}));
var Mark;
(function (Mark) {
    Mark[Mark["Star"] = 0] = "Star";
    Mark[Mark["Empty"] = 1] = "Empty";
})(Mark = exports.Mark || (exports.Mark = {}));
class Puzzle {
    // Abstraction function:
    //   AF(puzzleRegions, input) = a 10x10 board filled with Mark.Unknown and that board is divided into 
    //                          the set of contiguous regions which mutually exclusive and collectively exhaustive the puzzle board
    //                          status == unsolved if every cell is Mark.Unknown, partially solve if there is some Mark.Unknown, and fully-solved if there is no Mark.Unknown
    //Rep invariant:
    //   1) each puzzleRegion must satisfy the RI of the Region class
    //   2) the regions must be mutually exclusive and collectively exhaustive the puzzle board
    //   3) every region, row, and column cannot contain more than two Mark.Star 
    // Safety from rep exposure:
    //   - all fields are private and readonly
    //   - puzzle is mutable number[][] and thus a defensive copy is made anytime a slice is returned from puzzle
    //     and in the constructor
    constructor(regions, status) {
        this.regions = [...regions];
        this.status = status;
        this.checkRep();
    }
    checkRep() {
        (0, assert_1.default)(true);
    }
    /**
     * Retrieves the regions of the puzzle
     *
     * @returns the regions of the puzzle
     */
    getRegions() {
        return this.regions;
    }
    /**
     * @param row desired row
     * @returns all the cells in row `row`
     */
    getRow(row) {
        return this.regions.reduce((rowCells, region) => rowCells.concat(region.getCells().filter(cell => cell.getRow() === row)), new Array);
    }
    /**
     * @param column desired column
     * @returns all the cells in column `column`
     */
    getColumn(column) {
        return this.regions.reduce((columnCells, region) => columnCells.concat(region.getCells().filter(cell => cell.getColumn() === column)), new Array);
    }
    /**
     * @param row row of cell
     * @param column column of cell
     * @returns the cell at row `row` and column `column`
     */
    getCell(row, column) {
        if (row < 1 || row > this.getRegions().length) {
            throw new Error;
        }
        const cell = this.getRow(row).filter(curCell => curCell.getColumn() === column)[0];
        return cell ?? makeCell(1, 1, Mark.Empty);
    }
    /**
     *
     * @param row row of the star
     * @param column column of the star
     * @returns a copy of the puzzle with a star placed at the cell with row `row` and column `column`
     */
    addStar(row, column) {
        const copyRegions = this.deepCopy([...this.regions]);
        const newRegions = [];
        copyRegions.forEach(region => newRegions.push(makeRegion(region.getCells().map(cell => {
            if (cell.getRow() === row && cell.getColumn() === column) {
                return makeCell(row, column, Mark.Star);
            }
            else {
                return cell;
            }
        }))));
        return makePuzzle(newRegions, this.status);
    }
    /**
     *
     * @param row row of the star to be removed
     * @param column column of the star to be removed
     * @returns a copy of the puzzle with a star removed at the cell with row `row` and column `column`
     */
    removeStar(row, column) {
        const copyRegions = this.deepCopy([...this.regions]);
        const newRegions = [];
        copyRegions.forEach(region => newRegions.push(makeRegion(region.getCells().map(cell => {
            if (cell.getRow() === row && cell.getColumn() === column) {
                return makeCell(row, column, Mark.Empty);
            }
            else {
                return cell;
            }
        }))));
        return makePuzzle(newRegions, this.status);
    }
    /**
     *
     * @returns true if the puzzle has been solved, false if not
     */
    isSolved() {
        const minDim = 1;
        const maxDim = this.getRegions().length;
        // check row condition
        for (let row = minDim; row <= maxDim; row++) {
            const curRow = this.getRow(row);
            let starCount = 0;
            for (const cell of curRow) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if (starCount !== 2) {
                return false;
            }
        }
        // check column condition
        for (let column = minDim; column <= maxDim; column++) {
            const curColumn = this.getColumn(column);
            let starCount = 0;
            for (const cell of curColumn) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if (starCount !== 2) {
                return false;
            }
        }
        // check region condition
        for (const region of this.getRegions()) {
            let starCount = 0;
            for (const cell of region.getCells()) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if (starCount !== 2) {
                return false;
            }
        }
        // check neighbor condition
        for (const region of this.getRegions()) {
            for (const cell of region.getCells()) {
                for (const cell2 of this.getNeighbors(cell)) {
                    if (cell2.getMark() === Mark.Star && cell.getMark() === Mark.Star) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /**
     * @param regions regions to be copied
     * @returns a deep copy of an array of regions
     */
    deepCopy(regions) {
        const newRegions = [];
        regions.forEach(region => {
            let newCells = [];
            region.getCells().forEach(cell => {
                const newCell = makeCell(cell.getRow(), cell.getColumn(), cell.getMark());
                newCells.push(newCell);
            });
            newRegions.push(makeRegion(newCells));
            newCells = [];
        });
        return newRegions;
    }
    /**
     * @param cell cell to check neighbors on
     * @returns an array of cells that are the neighboring cells of the given cell
     */
    getNeighbors(cell) {
        const aboveRow = this.getRow(cell.getRow() - 1).filter(cell2 => (cell2.getColumn() === cell.getColumn() - 1
            || cell2.getColumn() === cell.getColumn()
            || cell2.getColumn() === cell.getColumn() + 1));
        const curRow = this.getRow(cell.getRow()).filter(cell2 => (cell2.getColumn() === cell.getColumn() - 1
            || cell2.getColumn() === cell.getColumn() + 1));
        const belowRow = this.getRow(cell.getRow() + 1).filter(cell2 => (cell2.getColumn() === cell.getColumn() - 1
            || cell2.getColumn() === cell.getColumn()
            || cell2.getColumn() === cell.getColumn() + 1));
        return aboveRow.concat(curRow).concat(belowRow);
    }
    /**
     * @returns a string representation of the Puzzle
     */
    toString() {
        const regions = this.getRegions();
        const dim = regions.length;
        let puzzleStr = `${dim}x${dim}\n`;
        for (const region of regions) {
            // add stars first
            for (const cell of region.getCells()) {
                if (cell.getMark() === Mark.Star) {
                    puzzleStr += `${cell.toString()} `;
                }
            }
            // separate by pipe
            puzzleStr += '| ';
            // now add non-stars
            for (const cell of region.getCells()) {
                if (cell.getMark() !== Mark.Star) {
                    puzzleStr += `${cell.toString()} `;
                }
            }
            // add new line
            puzzleStr += '\n';
        }
        return puzzleStr;
    }
    /**
     * @param that any Puzzle
     * @returns true if and only if this and that have the same regions
     */
    equalValue(that) {
        // make sure lengths are equal
        if (this.regions.length !== that.regions.length) {
            return false;
        }
        for (const region1 of this.regions) {
            let foundMatch = false;
            for (const region2 of that.regions) {
                if (region1.equalValue(region2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        for (const region1 of that.regions) {
            let foundMatch = false;
            for (const region2 of this.regions) {
                if (region1.equalValue(region2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        return true;
    }
}
exports.Puzzle = Puzzle;
class Region {
    // Abstraction function
    //   AF[cells] = given a set of cells, create a continuous region. 
    // Rep Invariant: 
    //   1) Region must be contiguous
    // Safety from rep exposure:
    //   - all fields are private and readonly;
    constructor(cells) {
        this.cells = [...cells];
        this.checkRep();
    }
    checkRep() {
        // check for contiguousy
        (0, assert_1.default)(true);
    }
    /**
     * Retrieves the cells of the region
     *
     * @returns the cells of the region
     */
    getCells() {
        return this.cells;
    }
    /**
     * @returns a string representation of the region
     */
    toString() {
        let regionStr = '';
        this.cells.forEach(cell => {
            regionStr += `${cell.toString()} \n`;
        });
        return regionStr;
    }
    /**
     * @param that any Region
     * @returns true if and only if this and that have the same cells
     */
    equalValue(that) {
        // make sure lengths are equal
        if (this.cells.length !== that.cells.length) {
            return false;
        }
        // compare each cell 
        for (const cell1 of this.cells) {
            let foundMatch = false;
            for (const cell2 of that.cells) {
                if (cell1.equalValue(cell2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        for (const cell1 of that.cells) {
            let foundMatch = false;
            for (const cell2 of this.cells) {
                if (cell1.equalValue(cell2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        return true;
    }
}
exports.Region = Region;
class Cell {
    // Abstraction function
    //   AF[row, column, mark] = a cell located at row `row` and column `column` with mark `mark`
    // Rep Invariant: 
    //   1) 1 <= row <= 10
    //   2) 1 <= column <= 10
    //   3) The value of mark must be 0, 1, or 2
    // Safety from rep exposure:
    //   - all fields are private and readonly;
    constructor(row, column, mark) {
        this.row = row;
        this.column = column;
        this.mark = mark;
        this.checkRep();
    }
    checkRep() {
        const minDim = 1;
        const maxDim = 10;
        // 1 <= row <= 10
        (0, assert_1.default)(this.row >= minDim && this.row <= maxDim);
        // 1 <= column <= 10
        (0, assert_1.default)(this.column >= minDim && this.column <= maxDim);
        // The value of mark must be 0 or 1
        (0, assert_1.default)(this.mark === 0 || this.mark === 1);
    }
    /**
     * Retrieves the row of the cell
     *
     * @returns the row of the cell
     */
    getRow() {
        return this.row;
    }
    /**
     * Retrieves the column of the cell
     *
     * @returns the column of the cell
     */
    getColumn() {
        return this.column;
    }
    /**
     * Retrieves the mark of the cell
     *
     * @returns the mark of the cell
     */
    getMark() {
        return this.mark;
    }
    /**
     * @returns a string representation of the cell, which includes the cell's row and column
     */
    toString() {
        return `${this.row},${this.column}`;
    }
    /**
     * @param that any Cell
     * @returns true if and only if this and that have the same row and column
     */
    equalValue(that) {
        return this.row === that.row && this.column === that.column; // <= can you add if the Mark of the two cells are the same as well? Thanks! 
    }
}
exports.Cell = Cell;
// FACTORY FUNCTIONS FOR PUZZLE, REGION, AND CELL
/**
 *
 * @param row row of cell
 * @param column column of cell
 * @param mark mark of cell
 * @returns a Cell with arguments `row`, `column`, 'mark'
 */
function makeCell(row, column, mark) {
    return new Cell(row, column, mark);
}
exports.makeCell = makeCell;
/**
 *
 * @param cells cells of the region
 * @returns a Region with arguments `cells`
 */
function makeRegion(cells) {
    return new Region(cells);
}
exports.makeRegion = makeRegion;
/**
 *
 * @param regions regions of the puzzle
 * @param status status of the puzzle
 * @returns a Puzzle with arguments `regions` and `puzzles`
 */
function makePuzzle(regions, status) {
    return new Puzzle(regions, status);
}
exports.makePuzzle = makePuzzle;

},{"assert":1}],19:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const assert_1 = __importDefault(require("assert"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const drawingPrototype_1 = require("./drawingPrototype");
const Parser_1 = require("./Parser");
const clientADT_1 = require("./clientADT");
const BOX_SIZE = 16;
// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
/**
const puzzlePath = `puzzles/kd-1-1-1.starb`
const input = fs.readFileSync(puzzlePath, { encoding: "utf8", flag: "r" });
*/
async function main() {
    // fetch the puzzle
    const puzzleName = 'kd-1-1-1';
    const res = await (0, node_fetch_1.default)(`http://localhost:8789/puzzles/${puzzleName}`);
    const puzzleData = await res.text();
    const puzzle = (0, Parser_1.emptyPuzzleParser)(puzzleData);
    const client = new clientADT_1.Client(puzzle);
    // output area for printing
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    // canvas for drawing
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    // Change W,H to be divisible by 10
    canvas.height = 250;
    canvas.width = 250;
    // Color in Regions
    (0, drawingPrototype_1.colorAllRegions)();
    // draw grid lines over the colors
    (0, drawingPrototype_1.drawGrid)(canvas);
    // button for checking if solved
    const button = document.getElementById('checkButton') ?? assert_1.default.fail('missing check button');
    // when the user clicks on the drawing canvas...
    button.addEventListener('click', (event) => {
        const isSolved = client.getPuzzle().isSolved();
        const message = isSolved ? 'The puzzle is solved' : 'The puzzle is not solved';
        (0, drawingPrototype_1.printOutput)(outputArea, message);
    });
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event) => {
        const divisor = 25;
        const initialAdd = 12.5;
        const [row, col] = [((0, drawingPrototype_1.center)(event.offsetY) + initialAdd) / divisor, ((0, drawingPrototype_1.center)(event.offsetX) + initialAdd) / divisor];
        // check if there is a star at the coordinate
        if (client.getPuzzle().getCell(row, col).getMark() === 1) {
            client.addStar(row, col);
            (0, drawingPrototype_1.drawStar)(canvas, (0, drawingPrototype_1.center)(event.offsetX), (0, drawingPrototype_1.center)(event.offsetY));
        }
        else {
            client.removeStar(row, col);
            (0, drawingPrototype_1.removeStar)(canvas, (0, drawingPrototype_1.center)(event.offsetX), (0, drawingPrototype_1.center)(event.offsetY));
        }
        // drawStar(canvas, center(event.offsetX), center(event.offsetY));
        //drawPoint(canvas, center(event.offsetX), center(event.offsetY));
        //removeStar(canvas, center(event.offsetX), center(event.offsetY));
    });
    // add initial instructions to the output area
    (0, drawingPrototype_1.printOutput)(outputArea, `Click on a grid cell to draw a star.`);
}
main();

},{"./Parser":17,"./clientADT":20,"./drawingPrototype":21,"assert":1,"node-fetch":6}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var puzzleStatus;
(function (puzzleStatus) {
    puzzleStatus["solved"] = "solved";
    puzzleStatus["inProgress"] = "inProgress";
    puzzleStatus["empty"] = "empty";
})(puzzleStatus || (puzzleStatus = {}));
class Client {
    // Abstraction function:
    //      AF(puzzle, solved) = a client that allows the user to interact with a Star Battle game puzzle
    //
    // Representation invariant:
    //      - `puzzle` is a Puzzle instance
    //      - `solved` is a boolean
    //      
    // Safety from rep exposure:
    //      All fields are private and never returned
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.oriPuzzle = puzzle;
        // this.puzzleString = puzzleString;
    }
    getPuzzle() {
        return this.puzzle;
    }
    /**
     * asserts the representation invariant
     */
    checkRep() {
        throw new Error("Not Implemented");
    }
    /**
     * @returns a string representation of the Puzzle ADT
     */
    toString() {
        return this.puzzle.toString();
    }
    /**
     * @returns if the puzzle is solved or not
     */
    getStatus() {
        return this.puzzle.isSolved();
    }
    /**
     * @param row: row the star will be placed
     * @param col: column the star will be placed
     */
    addStar(row, col) {
        const newPuzzle = this.puzzle.addStar(row, col);
        this.puzzle = newPuzzle;
    }
    /**
     * @param row: row the star will be removed
     * @param col: column the star will be removed
     */
    removeStar(row, col) {
        const newPuzzle = this.puzzle.removeStar(row, col);
        this.puzzle = newPuzzle;
    }
    /**
     * @returns, void, refresh the puzzle of the client
     */
    refresh() {
        this.puzzle = this.oriPuzzle;
    }
}
exports.Client = Client;
;

},{}],21:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorAllRegions = exports.center = exports.printOutput = exports.drawGrid = exports.drawPoint = exports.removeStar = exports.drawStar = void 0;
// This code is loaded into example-page.html, see the `npm watchify-example` script.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const Parser_1 = require("./Parser");
const Puzzle_1 = require("./Puzzle");
const assert_1 = __importDefault(require("assert"));
const canvas_size = 250;
const numCells = 10;
// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];
const input = `# This is an solved Puzzle
# This is a second comment that contains a lot of characters: 12345678890!@#$%^&*()_+<>?:"|}{[]p}
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4 
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
`;
//const input = loadFile(`/puzzles/kd-1-1-1.starb`);
const puzzleADT = (0, Parser_1.solvedPuzzleParser)(input);
/**
 * Given a cell which is the intersection of row and col, we will draw a star in that cell.
 * This happens when the client wants to put a star on the board at the specific cell.
 * @param canvas canvas to draw on
 * @param row, row of the board
 * @param col, col of the board
 */
function drawStar(canvas, row, col) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(row, col);
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    const radius = 8;
    context.beginPath();
    for (let i = 0; i < 5; i++) {
        const x = radius * Math.cos(60 + (2 * Math.PI * i) / 5);
        const y = radius * Math.sin(60 + (2 * Math.PI * i) / 5);
        context.lineTo(x, y);
        const innerX = radius / 2 * Math.cos(60 + (2 * Math.PI * i + Math.PI) / 5);
        const innerY = radius / 2 * Math.sin(60 + (2 * Math.PI * i + Math.PI) / 5);
        context.lineTo(innerX, innerY);
    }
    context.closePath();
    // draw the star outline and fill
    context.stroke();
    context.fillStyle = 'black';
    context.fill();
    console.log("Row", (col + 12.5) / 25, "Col", (row + 12.5) / 25);
    // reset the origin and styles back to defaults
    context.restore();
}
exports.drawStar = drawStar;
/**
 * Given a cell which is the intersection of row and col, we will remove a star in that cell if a
 * star is present. This code should only be executed if there is a star present in the cell
 * @param canvas, canvas to draw on
 * @param row, row of the board
 * @param col, col of the board
 */
function removeStar(canvas, row, col) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    const cellSize = canvas_size / numCells;
    const offset = cellSize / 2;
    const imgData = context.getImageData(row - offset + 3, col - offset + 3, 1, 1);
    const [r, g, b] = imgData.data;
    console.log("Color is ", colorDataToHex(r ?? 0, g ?? 0, b ?? 0));
    // Picks color from canvas and fills in the rectangle with that color
    context.fillStyle = colorDataToHex(r ?? 0, g ?? 0, b ?? 0);
    context.fillRect(row - offset, col - offset, cellSize, cellSize);
    drawGrid(canvas);
}
exports.removeStar = removeStar;
/**
 * Convert RGB Value to corresponding hex string
 *
 * @param r red value [0, 255]
 * @param g green value [0, 255]
 * @param b blue value [0, 255]
 */
function colorDataToHex(r, g, b) {
    const redHex = r.toString(16);
    const greenHex = g.toString(16);
    const blueHex = b.toString(16);
    const hexArr = [redHex, greenHex, blueHex];
    const newArr = hexArr.map((hex) => hex.length == 1 ? "0" + hex : hex);
    return '#' + newArr.join('');
}
/**
 * Given a cell which is the intersection of row and col, we will put a point as a placeholder in that cell.
 * This happens when the client wants to mark that cell as an empty cell.
 * @param canvas canvas to draw on
 * @param row, row of the board
 * @param col, col of the board
 * @param row
 * @param col
 * @param row
 * @param col
 */
function drawPoint(canvas, row, col) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    const circleAngle = 2 * Math.PI;
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    const radius = 4;
    context.beginPath();
    // define circle path
    context.beginPath();
    context.arc(row, col, radius, 0, circleAngle);
    context.closePath();
    context.stroke();
    context.fillStyle = 'black';
    context.fill();
}
exports.drawPoint = drawPoint;
/**
 * @param canvas: canvas to draw on
 * Draws the gridlines on the canvas
 * @param canvas
 */
function drawGrid(canvas) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // draw limes Such that canvas is 10x10
    const cellsPerRow = 10;
    const gridSpacing = canvas.width / cellsPerRow;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    for (let i = 1; i < cellsPerRow; i++) {
        // Vertical Lines
        context.moveTo(i * gridSpacing, 0);
        context.lineTo(i * gridSpacing, canvas.height);
        // Horizontal Lines
        context.moveTo(0, i * gridSpacing);
        context.lineTo(canvas.width, i * gridSpacing);
        context.stroke();
    }
}
exports.drawGrid = drawGrid;
/**
 * Given a set of cells that belong to a contiguous region, highlight the border of that region
 * @param canvas, canvas to draw on
 * @param region, set of cells identified by its coordinates.
 * @param canvas
 * @param region
 * @param color
 * @param canvas
 * @param region
 * @param color
 * @param canvas
 * @param region
 * @param color
 */
function highlightRegion(canvas, region, color) {
    const cellSize = canvas.height / numCells;
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    context.fillStyle = color;
    for (const r of region.getCells()) {
        const cellRow = r.getRow() * cellSize - cellSize;
        const cellCol = r.getColumn() * cellSize - cellSize;
        context.fillRect(cellRow, cellCol, cellSize, cellSize);
    }
}
/**
 * @param c: query cell
 * @param c
 * @returns a list of cell neighbors adjacent to the query cell
 */
function getNeighbors(c) {
    const lowerBound = 1;
    const upperBound = 10;
    const neighbors = [];
    if (c.getColumn() > lowerBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow(), c.getColumn() - 1, Puzzle_1.Mark.Empty));
    }
    if (c.getColumn() < upperBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow(), c.getColumn() + 1, Puzzle_1.Mark.Empty));
    }
    if (c.getRow() > lowerBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow() - 1, c.getColumn(), Puzzle_1.Mark.Empty));
    }
    if (c.getRow() < upperBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow() + 1, c.getColumn(), Puzzle_1.Mark.Empty));
    }
    return neighbors;
}
/**
 * Print a message by appending it to an HTML element.
 *
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea, message) {
    // append the message to the output area
    outputArea.innerText = message + '\n';
    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}
exports.printOutput = printOutput;
/**
 * @param value: number to be centered
 * @param value
 * @returns value on board such that it is centered in a grid cell
 */
function center(value) {
    const cellWidth = canvas_size / numCells;
    return Math.floor(value / cellWidth) * cellWidth + (cellWidth / 2);
}
exports.center = center;
/**
 * Colors in all regions of the Puzzle Board
 */
function colorAllRegions() {
    // Color in the regions
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    for (const reg of puzzleADT.getRegions()) {
        const color = COLORS.shift();
        if (!color) {
            throw new Error('No more colors to add');
        }
        highlightRegion(canvas, reg, color);
    }
}
exports.colorAllRegions = colorAllRegions;

},{"./Parser":17,"./Puzzle":18,"assert":1}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9hc3NlcnQvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Fzc2VydC9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWZldGNoL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvY29tcGlsZXIuanMiLCJub2RlX21vZHVsZXMvcGFyc2VybGliL2ludGVybmFsL2Rpc3BsYXkuanMiLCJub2RlX21vZHVsZXMvcGFyc2VybGliL2ludGVybmFsL3BhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvcGFyc2V0cmVlLmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlcmxpYi9pbnRlcm5hbC90eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvdmlzdWFsaXplci5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvcGFyc2VybGliLmpzIiwibm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvUGFyc2VyLnRzIiwic3JjL1B1enpsZS50cyIsInNyYy9TdGFyYkNsaWVudC50cyIsInNyYy9jbGllbnRBRFQudHMiLCJzcmMvZHJhd2luZ1Byb3RvdHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUMsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUM1QyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzVDLElBQUEsZ0JBQU0sRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMxRztRQUNELEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDNUMsSUFBQSxnQkFBTSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUM1QyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDMUc7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksZUFBTSxDQUFDLFFBQVEsQ0FB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QUN4QixNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzRSxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNsQztJQUNELE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVwQixpQ0FBaUM7SUFDakMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzVCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLENBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxHQUFDLEVBQUUsRUFBRyxLQUFLLEVBQUUsQ0FB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SSxDQUFDO0lBRXRDLGlFQUFpRTtJQUNqRSxVQUFVLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7QUFDbkQsQ0FBQztBQU5ELGtDQU1DO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxLQUFhO0lBQ2hDLE1BQU0sU0FBUyxHQUFHLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFDekMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUhELHdCQUdDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixlQUFlO0lBQzNCLHVCQUF1QjtJQUN2QixNQUFNLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQXNCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUVsSSxLQUFLLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUN4QztRQUNMLGVBQWUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDO0FBQ0wsQ0FBQztBQVhELDBDQVdDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG4vLyBjb21wYXJlIGFuZCBpc0J1ZmZlciB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2Jsb2IvNjgwZTllNWU0ODhmMjJhYWMyNzU5OWE1N2RjODQ0YTYzMTU5MjhkZC9pbmRleC5qc1xuLy8gb3JpZ2luYWwgbm90aWNlOlxuXG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciB4ID0gYS5sZW5ndGg7XG4gIHZhciB5ID0gYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV07XG4gICAgICB5ID0gYltpXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoeSA8IHgpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgaWYgKGdsb2JhbC5CdWZmZXIgJiYgdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKTtcbiAgfVxuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKTtcbn1cblxuLy8gYmFzZWQgb24gbm9kZSBhc3NlcnQsIG9yaWdpbmFsIG5vdGljZTpcbi8vIE5COiBUaGUgVVJMIHRvIHRoZSBDb21tb25KUyBzcGVjIGlzIGtlcHQganVzdCBmb3IgdHJhZGl0aW9uLlxuLy8gICAgIG5vZGUtYXNzZXJ0IGhhcyBldm9sdmVkIGEgbG90IHNpbmNlIHRoZW4sIGJvdGggaW4gQVBJIGFuZCBiZWhhdmlvci5cblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBmdW5jdGlvbnNIYXZlTmFtZXMgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9vKCkge30ubmFtZSA9PT0gJ2Zvbyc7XG59KCkpO1xuZnVuY3Rpb24gcFRvU3RyaW5nIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zikge1xuICBpZiAoaXNCdWZmZXIoYXJyYnVmKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKTtcbiAgfVxuICBpZiAoIWFycmJ1Zikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyYnVmLmJ1ZmZlciAmJiBhcnJidWYuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG52YXIgcmVnZXggPSAvXFxzKmZ1bmN0aW9uXFxzKyhbXlxcKFxcc10qKVxccyovO1xuLy8gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9mdW5jdGlvbi5wcm90b3R5cGUubmFtZS9ibG9iL2FkZWVlZWM4YmZjYzYwNjhiMTg3ZDdkOWZiM2Q1YmIxZDNhMzA4OTkvaW1wbGVtZW50YXRpb24uanNcbmZ1bmN0aW9uIGdldE5hbWUoZnVuYykge1xuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmMubmFtZTtcbiAgfVxuICB2YXIgc3RyID0gZnVuYy50b1N0cmluZygpO1xuICB2YXIgbWF0Y2ggPSBzdHIubWF0Y2gocmVnZXgpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gZ2V0TmFtZShzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZykge1xuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzIHx8ICF1dGlsLmlzRnVuY3Rpb24oc29tZXRoaW5nKSkge1xuICAgIHJldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKTtcbiAgfVxuICB2YXIgcmF3bmFtZSA9IGdldE5hbWUoc29tZXRoaW5nKTtcbiAgdmFyIG5hbWUgPSByYXduYW1lID8gJzogJyArIHJhd25hbWUgOiAnJztcbiAgcmV0dXJuICdbRnVuY3Rpb24nICsgIG5hbWUgKyAnXSc7XG59XG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5hY3R1YWwpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5kZWVwU3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBkZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwU3RyaWN0RXF1YWwnLCBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgJiYgaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKChhY3R1YWwgPT09IG51bGwgfHwgdHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgKGV4cGVjdGVkID09PSBudWxsIHx8IHR5cGVvZiBleHBlY3RlZCAhPT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIHN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIGluc3RhbmNlcyBvZiB0eXBlZCBhcnJheXMsIHdyYXAgdGhlaXIgdW5kZXJseWluZ1xuICAvLyBBcnJheUJ1ZmZlcnMgaW4gYSBCdWZmZXIgZWFjaCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZVxuICAvLyBUaGlzIG9wdGltaXphdGlvbiByZXF1aXJlcyB0aGUgYXJyYXlzIHRvIGhhdmUgdGhlIHNhbWUgdHlwZSBhcyBjaGVja2VkIGJ5XG4gIC8vIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgKGFrYSBwVG9TdHJpbmcpLiBOZXZlciBwZXJmb3JtIGJpbmFyeVxuICAvLyBjb21wYXJpc29ucyBmb3IgRmxvYXQqQXJyYXlzLCB0aG91Z2gsIHNpbmNlIGUuZy4gKzAgPT09IC0wIGJ1dCB0aGVpclxuICAvLyBiaXQgcGF0dGVybnMgYXJlIG5vdCBpZGVudGljYWwuXG4gIH0gZWxzZSBpZiAoaXNWaWV3KGFjdHVhbCkgJiYgaXNWaWV3KGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgIHBUb1N0cmluZyhhY3R1YWwpID09PSBwVG9TdHJpbmcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgIShhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHxcbiAgICAgICAgICAgICAgIGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkpIHtcbiAgICByZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxcbiAgICAgICAgICAgICAgICAgICBuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKSA9PT0gMDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgIT09IGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBtZW1vcyA9IG1lbW9zIHx8IHthY3R1YWw6IFtdLCBleHBlY3RlZDogW119O1xuXG4gICAgdmFyIGFjdHVhbEluZGV4ID0gbWVtb3MuYWN0dWFsLmluZGV4T2YoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsSW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAoYWN0dWFsSW5kZXggPT09IG1lbW9zLmV4cGVjdGVkLmluZGV4T2YoZXhwZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7XG4gICAgbWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG5cbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYiwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykge1xuICBpZiAoYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSlcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgaWYgKHN0cmljdCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgIT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSk7XG4gIHZhciBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIsIHN0cmljdCk7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKTtcbiAgdmFyIGtiID0gb2JqZWN0S2V5cyhiKTtcbiAgdmFyIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT09IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQubm90RGVlcFN0cmljdEVxdWFsID0gbm90RGVlcFN0cmljdEVxdWFsO1xuZnVuY3Rpb24gbm90RGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwU3RyaWN0RXF1YWwnLCBub3REZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59XG5cblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElnbm9yZS4gIFRoZSBpbnN0YW5jZW9mIGNoZWNrIGRvZXNuJ3Qgd29yayBmb3IgYXJyb3cgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIF90cnlCbG9jayhibG9jaykge1xuICB2YXIgZXJyb3I7XG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgYmxvY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJsb2NrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICBhY3R1YWwgPSBfdHJ5QmxvY2soYmxvY2spO1xuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIHVzZXJQcm92aWRlZE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZyc7XG4gIHZhciBpc1Vud2FudGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIHV0aWwuaXNFcnJvcihhY3R1YWwpO1xuICB2YXIgaXNVbmV4cGVjdGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIGFjdHVhbCAmJiAhZXhwZWN0ZWQ7XG5cbiAgaWYgKChpc1Vud2FudGVkRXhjZXB0aW9uICYmXG4gICAgICB1c2VyUHJvdmlkZWRNZXNzYWdlICYmXG4gICAgICBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHxcbiAgICAgIGlzVW5leHBlY3RlZEV4Y2VwdGlvbikge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyh0cnVlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MoZmFsc2UsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB0aHJvdyBlcnI7IH07XG5cbi8vIEV4cG9zZSBhIHN0cmljdCBvbmx5IHZhcmlhbnQgb2YgYXNzZXJ0XG5mdW5jdGlvbiBzdHJpY3QodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09Jywgc3RyaWN0KTtcbn1cbmFzc2VydC5zdHJpY3QgPSBvYmplY3RBc3NpZ24oc3RyaWN0LCBhc3NlcnQsIHtcbiAgZXF1YWw6IGFzc2VydC5zdHJpY3RFcXVhbCxcbiAgZGVlcEVxdWFsOiBhc3NlcnQuZGVlcFN0cmljdEVxdWFsLFxuICBub3RFcXVhbDogYXNzZXJ0Lm5vdFN0cmljdEVxdWFsLFxuICBub3REZWVwRXF1YWw6IGFzc2VydC5ub3REZWVwU3RyaWN0RXF1YWxcbn0pO1xuYXNzZXJ0LnN0cmljdC5zdHJpY3QgPSBhc3NlcnQuc3RyaWN0O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyByZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWdsb2JhbFxudmFyIGdldEdsb2JhbCA9IGZ1bmN0aW9uICgpIHtcblx0Ly8gdGhlIG9ubHkgcmVsaWFibGUgbWVhbnMgdG8gZ2V0IHRoZSBnbG9iYWwgb2JqZWN0IGlzXG5cdC8vIGBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpYFxuXHQvLyBIb3dldmVyLCB0aGlzIGNhdXNlcyBDU1AgdmlvbGF0aW9ucyBpbiBDaHJvbWUgYXBwcy5cblx0aWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gc2VsZjsgfVxuXHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHdpbmRvdzsgfVxuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGdsb2JhbDsgfVxuXHR0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdCcpO1xufVxuXG52YXIgZ2xvYmFsT2JqZWN0ID0gZ2V0R2xvYmFsKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGdsb2JhbE9iamVjdC5mZXRjaDtcblxuLy8gTmVlZGVkIGZvciBUeXBlU2NyaXB0IGFuZCBXZWJwYWNrLlxuaWYgKGdsb2JhbE9iamVjdC5mZXRjaCkge1xuXHRleHBvcnRzLmRlZmF1bHQgPSBnbG9iYWxPYmplY3QuZmV0Y2guYmluZChnbG9iYWxPYmplY3QpO1xufVxuXG5leHBvcnRzLkhlYWRlcnMgPSBnbG9iYWxPYmplY3QuSGVhZGVycztcbmV4cG9ydHMuUmVxdWVzdCA9IGdsb2JhbE9iamVjdC5SZXF1ZXN0O1xuZXhwb3J0cy5SZXNwb25zZSA9IGdsb2JhbE9iamVjdC5SZXNwb25zZTtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY29tcGlsZSA9IGV4cG9ydHMubWFrZU5vbnRlcm1pbmFsQ29udmVydGVycyA9IHZvaWQgMDtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbmNvbnN0IGFzc2VydF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY29uc3QgcGFyc2VyXzEgPSByZXF1aXJlKFwiLi9wYXJzZXJcIik7XG4vKipcbiAqIENvbnZlcnRzIHN0cmluZyB0byBub250ZXJtaW5hbC5cbiAqIEBwYXJhbSA8TlQ+IG5vbnRlcm1pbmFsIGVudW1lcmF0aW9uXG4gKiBAcGFyYW0gbm9udGVybWluYWxzIHJlcXVpcmVkIHRvIGJlIHRoZSBydW50aW1lIG9iamVjdCBmb3IgdGhlIDxOVD4gdHlwZSBwYXJhbWV0ZXJcbiAqIEByZXR1cm4gYSBwYWlyIG9mIGNvbnZlcnRlcnMgeyBub250ZXJtaW5hbFRvU3RyaW5nLCBzdHJpbmdUb05vbnRlcm1pbmFsIH1cbiAqICAgICAgICAgICAgICBvbmUgdGFrZXMgYSBzdHJpbmcgKGFueSBhbHBoYWJldGljIGNhc2UpIGFuZCByZXR1cm5zIHRoZSBub250ZXJtaW5hbCBpdCBuYW1lc1xuICogICAgICAgICAgICAgIHRoZSBvdGhlciB0YWtlcyBhIG5vbnRlcm1pbmFsIGFuZCByZXR1cm5zIGl0cyBzdHJpbmcgbmFtZSwgdXNpbmcgdGhlIFR5cGVzY3JpcHQgc291cmNlIGNhcGl0YWxpemF0aW9uLlxuICogICAgICAgICBCb3RoIGNvbnZlcnRlcnMgdGhyb3cgR3JhbW1hckVycm9yIGlmIHRoZSBjb252ZXJzaW9uIGNhbid0IGJlIGRvbmUuXG4gKiBAdGhyb3dzIEdyYW1tYXJFcnJvciBpZiBOVCBoYXMgYSBuYW1lIGNvbGxpc2lvbiAodHdvIG5vbnRlcm1pbmFsIG5hbWVzIHRoYXQgZGlmZmVyIG9ubHkgaW4gY2FwaXRhbGl6YXRpb24sXG4gKiAgICAgICBlLmcuIFJPT1QgYW5kIHJvb3QpLlxuICovXG5mdW5jdGlvbiBtYWtlTm9udGVybWluYWxDb252ZXJ0ZXJzKG5vbnRlcm1pbmFscykge1xuICAgIC8vIFwiY2Fub25pY2FsIG5hbWVcIiBpcyBhIGNhc2UtaW5kZXBlbmRlbnQgbmFtZSAoY2Fub25pY2FsaXplZCB0byBsb3dlcmNhc2UpXG4gICAgLy8gXCJzb3VyY2UgbmFtZVwiIGlzIHRoZSBuYW1lIGNhcGl0YWxpemVkIGFzIGluIHRoZSBUeXBlc2NyaXB0IHNvdXJjZSBkZWZpbml0aW9uIG9mIE5UXG4gICAgY29uc3Qgbm9udGVybWluYWxGb3JDYW5vbmljYWxOYW1lID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHNvdXJjZU5hbWVGb3JOb250ZXJtaW5hbCA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhub250ZXJtaW5hbHMpKSB7XG4gICAgICAgIC8vIGluIFR5cGVzY3JpcHQsIHRoZSBub250ZXJtaW5hbHMgb2JqZWN0IGNvbWJpbmVzIGJvdGggYSBOVC0+bmFtZSBtYXBwaW5nIGFuZCBuYW1lLT5OVCBtYXBwaW5nLlxuICAgICAgICAvLyBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9lbnVtcy5odG1sI2VudW1zLWF0LXJ1bnRpbWVcbiAgICAgICAgLy8gU28gZmlsdGVyIGp1c3QgdG8ga2V5cyB0aGF0IGFyZSB2YWxpZCBQYXJzZXJsaWIgbm9udGVybWluYWwgbmFtZXNcbiAgICAgICAgaWYgKC9eW2EtekEtWl9dW2EtekEtWl8wLTldKiQvLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlTmFtZSA9IGtleTtcbiAgICAgICAgICAgIGNvbnN0IGNhbm9uaWNhbE5hbWUgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG50ID0gbm9udGVybWluYWxzW3NvdXJjZU5hbWVdO1xuICAgICAgICAgICAgaWYgKG5vbnRlcm1pbmFsRm9yQ2Fub25pY2FsTmFtZS5oYXMoY2Fub25pY2FsTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoJ25hbWUgY29sbGlzaW9uIGluIG5vbnRlcm1pbmFsIGVudW1lcmF0aW9uOiAnXG4gICAgICAgICAgICAgICAgICAgICsgc291cmNlTmFtZUZvck5vbnRlcm1pbmFsLmdldChub250ZXJtaW5hbEZvckNhbm9uaWNhbE5hbWUuZ2V0KGNhbm9uaWNhbE5hbWUpKVxuICAgICAgICAgICAgICAgICAgICArICcgYW5kICcgKyBzb3VyY2VOYW1lXG4gICAgICAgICAgICAgICAgICAgICsgJyBhcmUgdGhlIHNhbWUgd2hlbiBjb21wYXJlZCBjYXNlLWluc2Vuc2l0aXZlbHknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vbnRlcm1pbmFsRm9yQ2Fub25pY2FsTmFtZS5zZXQoY2Fub25pY2FsTmFtZSwgbnQpO1xuICAgICAgICAgICAgc291cmNlTmFtZUZvck5vbnRlcm1pbmFsLnNldChudCwgc291cmNlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmVycm9yKHNvdXJjZU5hbWVGb3JOb250ZXJtaW5hbCk7XG4gICAgZnVuY3Rpb24gc3RyaW5nVG9Ob250ZXJtaW5hbChuYW1lKSB7XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbE5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICghbm9udGVybWluYWxGb3JDYW5vbmljYWxOYW1lLmhhcyhjYW5vbmljYWxOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKCdncmFtbWFyIHVzZXMgbm9udGVybWluYWwgJyArIG5hbWUgKyAnLCB3aGljaCBpcyBub3QgZm91bmQgaW4gdGhlIG5vbnRlcm1pbmFsIGVudW1lcmF0aW9uIHBhc3NlZCB0byBjb21waWxlKCknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9udGVybWluYWxGb3JDYW5vbmljYWxOYW1lLmdldChjYW5vbmljYWxOYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbm9udGVybWluYWxUb1N0cmluZyhudCkge1xuICAgICAgICBpZiAoIXNvdXJjZU5hbWVGb3JOb250ZXJtaW5hbC5oYXMobnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoJ25vbnRlcm1pbmFsICcgKyBudCArICcgaXMgbm90IGZvdW5kIGluIHRoZSBub250ZXJtaW5hbCBlbnVtZXJhdGlvbiBwYXNzZWQgdG8gY29tcGlsZSgpJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZU5hbWVGb3JOb250ZXJtaW5hbC5nZXQobnQpO1xuICAgIH1cbiAgICByZXR1cm4geyBzdHJpbmdUb05vbnRlcm1pbmFsLCBub250ZXJtaW5hbFRvU3RyaW5nIH07XG59XG5leHBvcnRzLm1ha2VOb250ZXJtaW5hbENvbnZlcnRlcnMgPSBtYWtlTm9udGVybWluYWxDb252ZXJ0ZXJzO1xudmFyIEdyYW1tYXJOVDtcbihmdW5jdGlvbiAoR3JhbW1hck5UKSB7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkdSQU1NQVJcIl0gPSAwXSA9IFwiR1JBTU1BUlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJQUk9EVUNUSU9OXCJdID0gMV0gPSBcIlBST0RVQ1RJT05cIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiU0tJUEJMT0NLXCJdID0gMl0gPSBcIlNLSVBCTE9DS1wiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJVTklPTlwiXSA9IDNdID0gXCJVTklPTlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJDT05DQVRFTkFUSU9OXCJdID0gNF0gPSBcIkNPTkNBVEVOQVRJT05cIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiUkVQRVRJVElPTlwiXSA9IDVdID0gXCJSRVBFVElUSU9OXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlJFUEVBVE9QRVJBVE9SXCJdID0gNl0gPSBcIlJFUEVBVE9QRVJBVE9SXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlVOSVRcIl0gPSA3XSA9IFwiVU5JVFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJOT05URVJNSU5BTFwiXSA9IDhdID0gXCJOT05URVJNSU5BTFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJURVJNSU5BTFwiXSA9IDldID0gXCJURVJNSU5BTFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJRVU9URURTVFJJTkdcIl0gPSAxMF0gPSBcIlFVT1RFRFNUUklOR1wiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJOVU1CRVJcIl0gPSAxMV0gPSBcIk5VTUJFUlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJSQU5HRVwiXSA9IDEyXSA9IFwiUkFOR0VcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiVVBQRVJCT1VORFwiXSA9IDEzXSA9IFwiVVBQRVJCT1VORFwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJMT1dFUkJPVU5EXCJdID0gMTRdID0gXCJMT1dFUkJPVU5EXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkNIQVJBQ1RFUlNFVFwiXSA9IDE1XSA9IFwiQ0hBUkFDVEVSU0VUXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkFOWUNIQVJcIl0gPSAxNl0gPSBcIkFOWUNIQVJcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiQ0hBUkFDVEVSQ0xBU1NcIl0gPSAxN10gPSBcIkNIQVJBQ1RFUkNMQVNTXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIldISVRFU1BBQ0VcIl0gPSAxOF0gPSBcIldISVRFU1BBQ0VcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiT05FTElORUNPTU1FTlRcIl0gPSAxOV0gPSBcIk9ORUxJTkVDT01NRU5UXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkJMT0NLQ09NTUVOVFwiXSA9IDIwXSA9IFwiQkxPQ0tDT01NRU5UXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlNLSVBcIl0gPSAyMV0gPSBcIlNLSVBcIjtcbn0pKEdyYW1tYXJOVCB8fCAoR3JhbW1hck5UID0ge30pKTtcbjtcbmZ1bmN0aW9uIG50dChub250ZXJtaW5hbCkge1xuICAgIHJldHVybiAoMCwgcGFyc2VyXzEubnQpKG5vbnRlcm1pbmFsLCBHcmFtbWFyTlRbbm9udGVybWluYWxdKTtcbn1cbmNvbnN0IGdyYW1tYXJHcmFtbWFyID0gbmV3IE1hcCgpO1xuLy8gZ3JhbW1hciA6Oj0gKCBwcm9kdWN0aW9uIHwgc2tpcEJsb2NrICkrXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkdSQU1NQVIsICgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEub3IpKG50dChHcmFtbWFyTlQuUFJPRFVDVElPTiksIG50dChHcmFtbWFyTlQuU0tJUEJMT0NLKSksIG50dChHcmFtbWFyTlQuU0tJUCkpKSkpO1xuLy8gc2tpcEJsb2NrIDo6PSAnQHNraXAnIG5vbnRlcm1pbmFsICd7JyBwcm9kdWN0aW9uKiAnfSdcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuU0tJUEJMT0NLLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKShcIkBza2lwXCIpLCBudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKG50dChHcmFtbWFyTlQuTk9OVEVSTUlOQUwpKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0cikoJ3snKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KSgoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5QUk9EVUNUSU9OKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSkpLCAoMCwgcGFyc2VyXzEuc3RyKSgnfScpKSkpKTtcbi8vIHByb2R1Y3Rpb24gOjo9IG5vbnRlcm1pbmFsICc6Oj0nIHVuaW9uICc7J1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5QUk9EVUNUSU9OLCAoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULk5PTlRFUk1JTkFMKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0cikoXCI6Oj1cIiksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkoKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5TS0lQKSwgbnR0KEdyYW1tYXJOVC5VTklPTiksIG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdHIpKCc7JykpKSkpO1xuLy8gdW5pb24gOjogPSBjb25jYXRlbmF0aW9uICgnfCcgY29uY2F0ZW5hdGlvbikqXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlVOSU9OLCAoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULkNPTkNBVEVOQVRJT04pLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0cikoJ3wnKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgbnR0KEdyYW1tYXJOVC5DT05DQVRFTkFUSU9OKSkpKSk7XG4vLyBjb25jYXRlbmF0aW9uIDo6ID0gcmVwZXRpdGlvbiogXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkNPTkNBVEVOQVRJT04sICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlJFUEVUSVRJT04pLCBudHQoR3JhbW1hck5ULlNLSVApKSkpO1xuLy8gcmVwZXRpdGlvbiA6Oj0gdW5pdCByZXBlYXRPcGVyYXRvcj9cbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuUkVQRVRJVElPTiwgKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5VTklUKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLm9wdGlvbikobnR0KEdyYW1tYXJOVC5SRVBFQVRPUEVSQVRPUikpKSk7XG4vLyByZXBlYXRPcGVyYXRvciA6Oj0gWyorP10gfCAneycgKCBudW1iZXIgfCByYW5nZSB8IHVwcGVyQm91bmQgfCBsb3dlckJvdW5kICkgJ30nXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlJFUEVBVE9QRVJBVE9SLCAoMCwgcGFyc2VyXzEub3IpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbKis/XVwiKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoXCJ7XCIpLCAoMCwgcGFyc2VyXzEub3IpKG50dChHcmFtbWFyTlQuTlVNQkVSKSwgbnR0KEdyYW1tYXJOVC5SQU5HRSksIG50dChHcmFtbWFyTlQuVVBQRVJCT1VORCksIG50dChHcmFtbWFyTlQuTE9XRVJCT1VORCkpLCAoMCwgcGFyc2VyXzEuc3RyKShcIn1cIikpKSk7XG4vLyBudW1iZXIgOjo9IFswLTldK1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5OVU1CRVIsICgwLCBwYXJzZXJfMS5wbHVzKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiWzAtOV1cIikpKTtcbi8vIHJhbmdlIDo6PSBudW1iZXIgJywnIG51bWJlclxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5SQU5HRSwgKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5OVU1CRVIpLCAoMCwgcGFyc2VyXzEuc3RyKShcIixcIiksIG50dChHcmFtbWFyTlQuTlVNQkVSKSkpO1xuLy8gdXBwZXJCb3VuZCA6Oj0gJywnIG51bWJlclxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5VUFBFUkJPVU5ELCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKShcIixcIiksIG50dChHcmFtbWFyTlQuTlVNQkVSKSkpO1xuLy8gbG93ZXJCb3VuZCA6Oj0gbnVtYmVyICcsJ1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5MT1dFUkJPVU5ELCAoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULk5VTUJFUiksICgwLCBwYXJzZXJfMS5zdHIpKFwiLFwiKSkpO1xuLy8gdW5pdCA6Oj0gbm9udGVybWluYWwgfCB0ZXJtaW5hbCB8ICcoJyB1bmlvbiAnKSdcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuVU5JVCwgKDAsIHBhcnNlcl8xLm9yKShudHQoR3JhbW1hck5ULk5PTlRFUk1JTkFMKSwgbnR0KEdyYW1tYXJOVC5URVJNSU5BTCksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCcoJyksIG50dChHcmFtbWFyTlQuU0tJUCksIG50dChHcmFtbWFyTlQuVU5JT04pLCBudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RyKSgnKScpKSkpO1xuLy8gbm9udGVybWluYWwgOjo9IFthLXpBLVpfXVthLXpBLVpfMC05XSpcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuTk9OVEVSTUlOQUwsICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbYS16QS1aX11cIiksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW2EtekEtWl8wLTldXCIpKSkpO1xuLy8gdGVybWluYWwgOjo9IHF1b3RlZFN0cmluZyB8IGNoYXJhY3RlclNldCB8IGFueUNoYXIgfCBjaGFyYWN0ZXJDbGFzc1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5URVJNSU5BTCwgKDAsIHBhcnNlcl8xLm9yKShudHQoR3JhbW1hck5ULlFVT1RFRFNUUklORyksIG50dChHcmFtbWFyTlQuQ0hBUkFDVEVSU0VUKSwgbnR0KEdyYW1tYXJOVC5BTllDSEFSKSwgbnR0KEdyYW1tYXJOVC5DSEFSQUNURVJDTEFTUykpKTtcbi8vIHF1b3RlZFN0cmluZyA6Oj0gXCInXCIgKFteJ1xcclxcblxcXFxdIHwgJ1xcXFwnIC4gKSogXCInXCIgfCAnXCInIChbXlwiXFxyXFxuXFxcXF0gfCAnXFxcXCcgLiApKiAnXCInXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlFVT1RFRFNUUklORywgKDAsIHBhcnNlcl8xLm9yKSgoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKShcIidcIiksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkoKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5vcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlteJ1xcclxcblxcXFxcXFxcXVwiKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJ1xcXFwnKSwgKDAsIHBhcnNlcl8xLnJlZ2V4KShcIi5cIikpKSkpLCAoMCwgcGFyc2VyXzEuc3RyKShcIidcIikpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnXCInKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KSgoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLm9yKSgoMCwgcGFyc2VyXzEucmVnZXgpKCdbXlwiXFxyXFxuXFxcXFxcXFxdJyksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCdcXFxcJyksICgwLCBwYXJzZXJfMS5yZWdleCkoXCIuXCIpKSkpKSwgKDAsIHBhcnNlcl8xLnN0cikoJ1wiJykpKSk7XG4vLyBjaGFyYWN0ZXJTZXQgOjo9ICdbJyAoW15cXF1cXHJcXG5cXFxcXSB8ICdcXFxcJyAuICkrICddJ1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5DSEFSQUNURVJTRVQsICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCdbJyksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkoKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnBsdXMpKCgwLCBwYXJzZXJfMS5vcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlteXFxcXF1cXHJcXG5cXFxcXFxcXF1cIiksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCdcXFxcJyksICgwLCBwYXJzZXJfMS5yZWdleCkoXCIuXCIpKSkpKSksICgwLCBwYXJzZXJfMS5zdHIpKCddJykpKTtcbi8vIGFueUNoYXIgOjo9ICcuJ1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5BTllDSEFSLCAoMCwgcGFyc2VyXzEuc3RyKSgnLicpKTtcbi8vIGNoYXJhY3RlckNsYXNzIDo6PSAnXFxcXCcgW2Rzd11cbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuQ0hBUkFDVEVSQ0xBU1MsICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCdcXFxcJyksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIltkc3ddXCIpKSkpO1xuLy8gd2hpdGVzcGFjZSA6Oj0gWyBcXHRcXHJcXG5dXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULldISVRFU1BBQ0UsICgwLCBwYXJzZXJfMS5yZWdleCkoXCJbIFxcdFxcclxcbl1cIikpO1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5PTkVMSU5FQ09NTUVOVCwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoXCIvL1wiKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbXlxcclxcbl1cIikpLCAoMCwgcGFyc2VyXzEub3IpKCgwLCBwYXJzZXJfMS5zdHIpKFwiXFxyXFxuXCIpLCAoMCwgcGFyc2VyXzEuc3RyKSgnXFxuJyksICgwLCBwYXJzZXJfMS5zdHIpKCdcXHInKSkpKTtcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuQkxPQ0tDT01NRU5ULCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKShcIi8qXCIpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlteKl1cIikpLCAoMCwgcGFyc2VyXzEuc3RyKSgnKicpKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbXi9dXCIpLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlteKl1cIikpLCAoMCwgcGFyc2VyXzEuc3RyKSgnKicpKSksICgwLCBwYXJzZXJfMS5zdHIpKCcvJykpKTtcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuU0tJUCwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5vcikobnR0KEdyYW1tYXJOVC5XSElURVNQQUNFKSwgbnR0KEdyYW1tYXJOVC5PTkVMSU5FQ09NTUVOVCksIG50dChHcmFtbWFyTlQuQkxPQ0tDT01NRU5UKSkpKTtcbmNvbnN0IGdyYW1tYXJQYXJzZXIgPSBuZXcgcGFyc2VyXzEuSW50ZXJuYWxQYXJzZXIoZ3JhbW1hckdyYW1tYXIsIG50dChHcmFtbWFyTlQuR1JBTU1BUiksIChudCkgPT4gR3JhbW1hck5UW250XSk7XG4vKipcbiAqIENvbXBpbGUgYSBQYXJzZXIgZnJvbSBhIGdyYW1tYXIgcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcuXG4gKiBAcGFyYW0gPE5UPiBhIFR5cGVzY3JpcHQgRW51bSB3aXRoIG9uZSBzeW1ib2wgZm9yIGVhY2ggbm9udGVybWluYWwgdXNlZCBpbiB0aGUgZ3JhbW1hcixcbiAqICAgICAgICBtYXRjaGluZyB0aGUgbm9udGVybWluYWxzIHdoZW4gY29tcGFyZWQgY2FzZS1pbnNlbnNpdGl2ZWx5IChzbyBST09UIGFuZCBSb290IGFuZCByb290IGFyZSB0aGUgc2FtZSkuXG4gKiBAcGFyYW0gZ3JhbW1hciB0aGUgZ3JhbW1hciB0byB1c2VcbiAqIEBwYXJhbSBub250ZXJtaW5hbHMgdGhlIHJ1bnRpbWUgb2JqZWN0IG9mIHRoZSBub250ZXJtaW5hbHMgZW51bS4gRm9yIGV4YW1wbGUsIGlmXG4gKiAgICAgICAgICAgICBlbnVtIE5vbnRlcm1pbmFscyB7IHJvb3QsIGEsIGIsIGMgfTtcbiAqICAgICAgICB0aGVuIE5vbnRlcm1pbmFscyBtdXN0IGJlIGV4cGxpY2l0bHkgcGFzc2VkIGFzIHRoaXMgcnVudGltZSBwYXJhbWV0ZXJcbiAqICAgICAgICAgICAgICBjb21waWxlKGdyYW1tYXIsIE5vbnRlcm1pbmFscywgTm9udGVybWluYWxzLnJvb3QpO1xuICogICAgICAgIChpbiBhZGRpdGlvbiB0byBiZWluZyBpbXBsaWNpdGx5IHVzZWQgZm9yIHRoZSB0eXBlIHBhcmFtZXRlciBOVClcbiAqIEBwYXJhbSByb290Tm9udGVybWluYWwgdGhlIGRlc2lyZWQgcm9vdCBub250ZXJtaW5hbCBpbiB0aGUgZ3JhbW1hclxuICogQHJldHVybiBhIHBhcnNlciBmb3IgdGhlIGdpdmVuIGdyYW1tYXIgdGhhdCB3aWxsIHN0YXJ0IHBhcnNpbmcgYXQgcm9vdE5vbnRlcm1pbmFsLlxuICogQHRocm93cyBQYXJzZUVycm9yIGlmIHRoZSBncmFtbWFyIGhhcyBhIHN5bnRheCBlcnJvclxuICovXG5mdW5jdGlvbiBjb21waWxlKGdyYW1tYXIsIG5vbnRlcm1pbmFscywgcm9vdE5vbnRlcm1pbmFsKSB7XG4gICAgY29uc3QgeyBzdHJpbmdUb05vbnRlcm1pbmFsLCBub250ZXJtaW5hbFRvU3RyaW5nIH0gPSBtYWtlTm9udGVybWluYWxDb252ZXJ0ZXJzKG5vbnRlcm1pbmFscyk7XG4gICAgY29uc3QgZ3JhbW1hclRyZWUgPSAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGdyYW1tYXJQYXJzZXIucGFyc2UoZ3JhbW1hcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IChlIGluc3RhbmNlb2YgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IpID8gbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKFwiZ3JhbW1hciBkb2Vzbid0IGNvbXBpbGVcIiwgZSkgOiBlO1xuICAgICAgICB9XG4gICAgfSkoKTtcbiAgICBjb25zdCBkZWZpbml0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBub250ZXJtaW5hbHNEZWZpbmVkID0gbmV3IFNldCgpOyAvLyBvbiBsZWZ0aGFuZC1zaWRlIG9mIHNvbWUgcHJvZHVjdGlvblxuICAgIGNvbnN0IG5vbnRlcm1pbmFsc1VzZWQgPSBuZXcgU2V0KCk7IC8vIG9uIHJpZ2h0aGFuZC1zaWRlIG9mIHNvbWUgcHJvZHVjdGlvblxuICAgIC8vIHByb2R1Y3Rpb25zIG91dHNpZGUgQHNraXAgYmxvY2tzXG4gICAgbWFrZVByb2R1Y3Rpb25zKGdyYW1tYXJUcmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5QUk9EVUNUSU9OKSwgbnVsbCk7XG4gICAgLy8gcHJvZHVjdGlvbnMgaW5zaWRlIEBza2lwIGJsb2Nrc1xuICAgIGZvciAoY29uc3Qgc2tpcEJsb2NrIG9mIGdyYW1tYXJUcmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5TS0lQQkxPQ0spKSB7XG4gICAgICAgIG1ha2VTa2lwQmxvY2soc2tpcEJsb2NrKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBudCBvZiBub250ZXJtaW5hbHNVc2VkKSB7XG4gICAgICAgIGlmICghbm9udGVybWluYWxzRGVmaW5lZC5oYXMobnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoXCJncmFtbWFyIGlzIG1pc3NpbmcgYSBkZWZpbml0aW9uIGZvciBcIiArIG5vbnRlcm1pbmFsVG9TdHJpbmcobnQpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW5vbnRlcm1pbmFsc0RlZmluZWQuaGFzKHJvb3ROb250ZXJtaW5hbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKFwiZ3JhbW1hciBpcyBtaXNzaW5nIGEgZGVmaW5pdGlvbiBmb3IgdGhlIHJvb3Qgbm9udGVybWluYWwgXCIgKyBub250ZXJtaW5hbFRvU3RyaW5nKHJvb3ROb250ZXJtaW5hbCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBhcnNlcl8xLkludGVybmFsUGFyc2VyKGRlZmluaXRpb25zLCAoMCwgcGFyc2VyXzEubnQpKHJvb3ROb250ZXJtaW5hbCwgbm9udGVybWluYWxUb1N0cmluZyhyb290Tm9udGVybWluYWwpKSwgbm9udGVybWluYWxUb1N0cmluZyk7XG4gICAgZnVuY3Rpb24gbWFrZVByb2R1Y3Rpb25zKHByb2R1Y3Rpb25zLCBza2lwKSB7XG4gICAgICAgIGZvciAoY29uc3QgcHJvZHVjdGlvbiBvZiBwcm9kdWN0aW9ucykge1xuICAgICAgICAgICAgY29uc3Qgbm9udGVybWluYWxOYW1lID0gcHJvZHVjdGlvbi5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuTk9OVEVSTUlOQUwpWzBdLnRleHQ7XG4gICAgICAgICAgICBjb25zdCBub250ZXJtaW5hbCA9IHN0cmluZ1RvTm9udGVybWluYWwobm9udGVybWluYWxOYW1lKTtcbiAgICAgICAgICAgIG5vbnRlcm1pbmFsc0RlZmluZWQuYWRkKG5vbnRlcm1pbmFsKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uID0gbWFrZUdyYW1tYXJUZXJtKHByb2R1Y3Rpb24uY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlVOSU9OKVswXSwgc2tpcCk7XG4gICAgICAgICAgICBpZiAoc2tpcClcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gKDAsIHBhcnNlcl8xLmNhdCkoc2tpcCwgZXhwcmVzc2lvbiwgc2tpcCk7XG4gICAgICAgICAgICBpZiAoZGVmaW5pdGlvbnMuaGFzKG5vbnRlcm1pbmFsKSkge1xuICAgICAgICAgICAgICAgIC8vIGdyYW1tYXIgYWxyZWFkeSBoYXMgYSBwcm9kdWN0aW9uIGZvciB0aGlzIG5vbnRlcm1pbmFsOyBvciBleHByZXNzaW9uIG9udG8gaXRcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9ucy5zZXQobm9udGVybWluYWwsICgwLCBwYXJzZXJfMS5vcikoZGVmaW5pdGlvbnMuZ2V0KG5vbnRlcm1pbmFsKSwgZXhwcmVzc2lvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbnMuc2V0KG5vbnRlcm1pbmFsLCBleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlU2tpcEJsb2NrKHNraXBCbG9jaykge1xuICAgICAgICBjb25zdCBub250ZXJtaW5hbE5hbWUgPSBza2lwQmxvY2suY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULk5PTlRFUk1JTkFMKVswXS50ZXh0O1xuICAgICAgICBjb25zdCBub250ZXJtaW5hbCA9IHN0cmluZ1RvTm9udGVybWluYWwobm9udGVybWluYWxOYW1lKTtcbiAgICAgICAgbm9udGVybWluYWxzVXNlZC5hZGQobm9udGVybWluYWwpO1xuICAgICAgICBjb25zdCBza2lwVGVybSA9ICgwLCBwYXJzZXJfMS5za2lwKSgoMCwgcGFyc2VyXzEubnQpKG5vbnRlcm1pbmFsLCBub250ZXJtaW5hbE5hbWUpKTtcbiAgICAgICAgbWFrZVByb2R1Y3Rpb25zKHNraXBCbG9jay5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuUFJPRFVDVElPTiksIHNraXBUZXJtKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZUdyYW1tYXJUZXJtKHRyZWUsIHNraXApIHtcbiAgICAgICAgc3dpdGNoICh0cmVlLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlVOSU9OOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRleHBycyA9IHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULkNPTkNBVEVOQVRJT04pLm1hcChjaGlsZCA9PiBtYWtlR3JhbW1hclRlcm0oY2hpbGQsIHNraXApKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRleHBycy5sZW5ndGggPT0gMSA/IGNoaWxkZXhwcnNbMF0gOiAoMCwgcGFyc2VyXzEub3IpKC4uLmNoaWxkZXhwcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuQ09OQ0FURU5BVElPTjoge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZGV4cHJzID0gdHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuUkVQRVRJVElPTikubWFwKGNoaWxkID0+IG1ha2VHcmFtbWFyVGVybShjaGlsZCwgc2tpcCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluc2VydCBza2lwIGJldHdlZW4gZWFjaCBwYWlyIG9mIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbldpdGhTa2lwcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkZXhwcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbldpdGhTa2lwcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuV2l0aFNraXBzLnB1c2goc2tpcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbldpdGhTa2lwcy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjaGlsZGV4cHJzID0gY2hpbGRyZW5XaXRoU2tpcHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoY2hpbGRleHBycy5sZW5ndGggPT0gMSkgPyBjaGlsZGV4cHJzWzBdIDogKDAsIHBhcnNlcl8xLmNhdCkoLi4uY2hpbGRleHBycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5SRVBFVElUSU9OOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IG1ha2VHcmFtbWFyVGVybSh0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5VTklUKVswXSwgc2tpcCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3AgPSB0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5SRVBFQVRPUEVSQVRPUilbMF07XG4gICAgICAgICAgICAgICAgaWYgKCFvcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXRXaXRoU2tpcCA9IHNraXAgPyAoMCwgcGFyc2VyXzEuY2F0KSh1bml0LCBza2lwKSA6IHVuaXQ7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ29wIGlzJywgb3ApO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG9wLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJyonOiByZXR1cm4gKDAsIHBhcnNlcl8xLnN0YXIpKHVuaXRXaXRoU2tpcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcrJzogcmV0dXJuICgwLCBwYXJzZXJfMS5wbHVzKSh1bml0V2l0aFNraXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnPyc6IHJldHVybiAoMCwgcGFyc2VyXzEub3B0aW9uKSh1bml0V2l0aFNraXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wIGlzIHtuLG19IG9yIG9uZSBvZiBpdHMgdmFyaWFudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IG9wLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmFuZ2UubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5OVU1CRVI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSBwYXJzZUludChyYW5nZS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEucmVwZWF0KSh1bml0V2l0aFNraXAsIG5ldyBwYXJzZXJfMS5CZXR3ZWVuKG4sIG4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlJBTkdFOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gcGFyc2VJbnQocmFuZ2UuY2hpbGRyZW5bMF0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtID0gcGFyc2VJbnQocmFuZ2UuY2hpbGRyZW5bMV0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLnJlcGVhdCkodW5pdFdpdGhTa2lwLCBuZXcgcGFyc2VyXzEuQmV0d2VlbihuLCBtKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5VUFBFUkJPVU5EOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtID0gcGFyc2VJbnQocmFuZ2UuY2hpbGRyZW5bMF0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLnJlcGVhdCkodW5pdFdpdGhTa2lwLCBuZXcgcGFyc2VyXzEuQmV0d2VlbigwLCBtKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5MT1dFUkJPVU5EOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gcGFyc2VJbnQocmFuZ2UuY2hpbGRyZW5bMF0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLnJlcGVhdCkodW5pdFdpdGhTa2lwLCBuZXcgcGFyc2VyXzEuQXRMZWFzdChuKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnRlcm5hbCBlcnJvcjogdW5rbm93biByYW5nZTogJyArIHJhbmdlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlVOSVQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VHcmFtbWFyVGVybSh0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5OT05URVJNSU5BTClbMF1cbiAgICAgICAgICAgICAgICAgICAgfHwgdHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuVEVSTUlOQUwpWzBdXG4gICAgICAgICAgICAgICAgICAgIHx8IHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlVOSU9OKVswXSwgc2tpcCk7XG4gICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5OT05URVJNSU5BTDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vbnRlcm1pbmFsID0gc3RyaW5nVG9Ob250ZXJtaW5hbCh0cmVlLnRleHQpO1xuICAgICAgICAgICAgICAgIG5vbnRlcm1pbmFsc1VzZWQuYWRkKG5vbnRlcm1pbmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLm50KShub250ZXJtaW5hbCwgdHJlZS50ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlRFUk1JTkFMOlxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJlZS5jaGlsZHJlblswXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlFVT1RFRFNUUklORzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEuc3RyKShzdHJpcFF1b3Rlc0FuZFJlcGxhY2VFc2NhcGVTZXF1ZW5jZXModHJlZS50ZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULkNIQVJBQ1RFUlNFVDogLy8gZS5nLiBbYWJjXVxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5BTllDSEFSOiAvLyBlLmcuICAuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULkNIQVJBQ1RFUkNMQVNTOiAvLyBlLmcuICBcXGQgIFxccyAgXFx3XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIHBhcnNlcl8xLnJlZ2V4KSh0cmVlLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnRlcm5hbCBlcnJvcjogdW5rbm93biBsaXRlcmFsOiAnICsgdHJlZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludGVybmFsIGVycm9yOiB1bmtub3duIGdyYW1tYXIgcnVsZTogJyArIHRyZWUubmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RyaXAgc3RhcnRpbmcgYW5kIGVuZGluZyBxdW90ZXMuXG4gICAgICogUmVwbGFjZSBcXHQsIFxcciwgXFxuIHdpdGggdGhlaXIgY2hhcmFjdGVyIGNvZGVzLlxuICAgICAqIFJlcGxhY2VzIGFsbCBvdGhlciBcXHggd2l0aCBsaXRlcmFsIHguXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyaXBRdW90ZXNBbmRSZXBsYWNlRXNjYXBlU2VxdWVuY2VzKHMpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHNbMF0gPT0gJ1wiJyB8fCBzWzBdID09IFwiJ1wiKTtcbiAgICAgICAgcyA9IHMuc3Vic3RyaW5nKDEsIHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHMgPSBzLnJlcGxhY2UoL1xcXFwoLikvZywgKG1hdGNoLCBlc2NhcGVkQ2hhcikgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChlc2NhcGVkQ2hhcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3QnOiByZXR1cm4gJ1xcdCc7XG4gICAgICAgICAgICAgICAgY2FzZSAncic6IHJldHVybiAnXFxyJztcbiAgICAgICAgICAgICAgICBjYXNlICduJzogcmV0dXJuICdcXG4nO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBlc2NhcGVkQ2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbn1cbmV4cG9ydHMuY29tcGlsZSA9IGNvbXBpbGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21waWxlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaW5kZW50ID0gZXhwb3J0cy5zbmlwcGV0ID0gZXhwb3J0cy5lc2NhcGVGb3JSZWFkaW5nID0gZXhwb3J0cy50b0NvbHVtbiA9IGV4cG9ydHMudG9MaW5lID0gZXhwb3J0cy5kZXNjcmliZUxvY2F0aW9uID0gZXhwb3J0cy5tYWtlRXJyb3JNZXNzYWdlID0gdm9pZCAwO1xuLyoqXG4gKiBNYWtlIGEgaHVtYW4tcmVhZGFibGUgZXJyb3IgbWVzc2FnZSBleHBsYWluaW5nIGEgcGFyc2UgZXJyb3IgYW5kIHdoZXJlIGl0IHdhcyBmb3VuZCBpbiB0aGUgaW5wdXQuXG4gKiBAcGFyYW0gbWVzc2FnZSBicmllZiBtZXNzYWdlIHN0YXRpbmcgd2hhdCBlcnJvciBvY2N1cnJlZFxuICogQHBhcmFtIG5vbnRlcm1pbmFsTmFtZSBuYW1lIG9mIGRlZXBlc3Qgbm9udGVybWluYWwgdGhhdCBwYXJzZXIgd2FzIHRyeWluZyB0byBtYXRjaCB3aGVuIHBhcnNlIGZhaWxlZFxuICogQHBhcmFtIGV4cGVjdGVkVGV4dCBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvbiBvZiB3aGF0IHN0cmluZyBsaXRlcmFscyB0aGUgcGFyc2VyIHdhcyBleHBlY3RpbmcgdGhlcmU7XG4gKiAgICAgICAgICAgIGUuZy4gXCI7XCIsIFwiWyBcXHJcXG5cXHRdXCIsIFwiMXwyfDNcIlxuICogQHBhcmFtIHN0cmluZ0JlaW5nUGFyc2VkIG9yaWdpbmFsIGlucHV0IHRvIHBhcnNlKClcbiAqIEBwYXJhbSBwb3Mgb2Zmc2V0IGluIHN0cmluZ0JlaW5nUGFyc2VkIHdoZXJlIGVycm9yIG9jY3VycmVkXG4gKiBAcGFyYW0gbmFtZU9mU3RyaW5nQmVpbmdQYXJzZWQgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24gb2Ygd2hlcmUgc3RyaW5nQmVpbmdQYXJzZWQgY2FtZSBmcm9tO1xuICogICAgICAgICAgICAgZS5nLiBcImdyYW1tYXJcIiBpZiBzdHJpbmdCZWluZ1BhcnNlZCB3YXMgdGhlIGlucHV0IHRvIFBhcnNlci5jb21waWxlKCksXG4gKiAgICAgICAgICAgICBvciBcInN0cmluZyBiZWluZyBwYXJzZWRcIiBpZiBzdHJpbmdCZWluZ1BhcnNlZCB3YXMgdGhlIGlucHV0IHRvIFBhcnNlci5wYXJzZSgpXG4gKiBAcmV0dXJuIGEgbXVsdGlsaW5lIGh1bWFuLXJlYWRhYmxlIG1lc3NhZ2UgdGhhdCBzdGF0ZXMgdGhlIGVycm9yLCBpdHMgbG9jYXRpb24gaW4gdGhlIGlucHV0LFxuICogICAgICAgICB3aGF0IHRleHQgd2FzIGV4cGVjdGVkIGFuZCB3aGF0IHRleHQgd2FzIGFjdHVhbGx5IGZvdW5kLlxuICovXG5mdW5jdGlvbiBtYWtlRXJyb3JNZXNzYWdlKG1lc3NhZ2UsIG5vbnRlcm1pbmFsTmFtZSwgZXhwZWN0ZWRUZXh0LCBzdHJpbmdCZWluZ1BhcnNlZCwgcG9zLCBuYW1lT2ZTdHJpbmdCZWluZ1BhcnNlZCkge1xuICAgIGxldCByZXN1bHQgPSBtZXNzYWdlO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMClcbiAgICAgICAgcmVzdWx0ICs9IFwiXFxuXCI7XG4gICAgcmVzdWx0ICs9XG4gICAgICAgIFwiRXJyb3IgYXQgXCIgKyBkZXNjcmliZUxvY2F0aW9uKHN0cmluZ0JlaW5nUGFyc2VkLCBwb3MpICsgXCIgb2YgXCIgKyBuYW1lT2ZTdHJpbmdCZWluZ1BhcnNlZCArIFwiXFxuXCJcbiAgICAgICAgICAgICsgXCIgIHRyeWluZyB0byBtYXRjaCBcIiArIG5vbnRlcm1pbmFsTmFtZS50b1VwcGVyQ2FzZSgpICsgXCJcXG5cIlxuICAgICAgICAgICAgKyBcIiAgZXhwZWN0ZWQgXCIgKyBlc2NhcGVGb3JSZWFkaW5nKGV4cGVjdGVkVGV4dCwgXCJcIilcbiAgICAgICAgICAgICsgKChzdHJpbmdCZWluZ1BhcnNlZC5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgID8gXCJcXG4gICBidXQgc2F3IFwiICsgc25pcHBldChzdHJpbmdCZWluZ1BhcnNlZCwgcG9zKVxuICAgICAgICAgICAgICAgIDogXCJcIik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMubWFrZUVycm9yTWVzc2FnZSA9IG1ha2VFcnJvck1lc3NhZ2U7XG4vKipcbiAqIEBwYXJhbSBzdHJpbmcgdG8gZGVzY3JpYmVcbiAqIEBwYXJhbSBwb3Mgb2Zmc2V0IGluIHN0cmluZywgMDw9cG9zPHN0cmluZy5sZW5ndGgoKVxuICogQHJldHVybiBhIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uIG9mIHRoZSBsb2NhdGlvbiBvZiB0aGUgY2hhcmFjdGVyIGF0IG9mZnNldCBwb3MgaW4gc3RyaW5nXG4gKiAodXNpbmcgb2Zmc2V0IGFuZC9vciBsaW5lL2NvbHVtbiBpZiBhcHByb3ByaWF0ZSlcbiAqL1xuZnVuY3Rpb24gZGVzY3JpYmVMb2NhdGlvbihzLCBwb3MpIHtcbiAgICBsZXQgcmVzdWx0ID0gXCJvZmZzZXQgXCIgKyBwb3M7XG4gICAgaWYgKHMuaW5kZXhPZignXFxuJykgIT0gLTEpIHtcbiAgICAgICAgcmVzdWx0ICs9IFwiIChsaW5lIFwiICsgdG9MaW5lKHMsIHBvcykgKyBcIiBjb2x1bW4gXCIgKyB0b0NvbHVtbihzLCBwb3MpICsgXCIpXCI7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRlc2NyaWJlTG9jYXRpb24gPSBkZXNjcmliZUxvY2F0aW9uO1xuLyoqXG4gKiBUcmFuc2xhdGVzIGEgc3RyaW5nIG9mZnNldCBpbnRvIGEgbGluZSBudW1iZXIuXG4gKiBAcGFyYW0gc3RyaW5nIGluIHdoaWNoIG9mZnNldCBvY2N1cnNcbiAqIEBwYXJhbSBwb3Mgb2Zmc2V0IGluIHN0cmluZywgMDw9cG9zPHN0cmluZy5sZW5ndGgoKVxuICogQHJldHVybiB0aGUgMS1iYXNlZCBsaW5lIG51bWJlciBvZiB0aGUgY2hhcmFjdGVyIGF0IG9mZnNldCBwb3MgaW4gc3RyaW5nLFxuICogYXMgaWYgc3RyaW5nIHdlcmUgYmVpbmcgdmlld2VkIGluIGEgdGV4dCBlZGl0b3JcbiAqL1xuZnVuY3Rpb24gdG9MaW5lKHMsIHBvcykge1xuICAgIGxldCBsaW5lQ291bnQgPSAxO1xuICAgIGZvciAobGV0IG5ld2xpbmUgPSBzLmluZGV4T2YoJ1xcbicpOyBuZXdsaW5lICE9IC0xICYmIG5ld2xpbmUgPCBwb3M7IG5ld2xpbmUgPSBzLmluZGV4T2YoJ1xcbicsIG5ld2xpbmUgKyAxKSkge1xuICAgICAgICArK2xpbmVDb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVDb3VudDtcbn1cbmV4cG9ydHMudG9MaW5lID0gdG9MaW5lO1xuLyoqXG4gKiBUcmFuc2xhdGVzIGEgc3RyaW5nIG9mZnNldCBpbnRvIGEgY29sdW1uIG51bWJlci5cbiAqIEBwYXJhbSBzdHJpbmcgaW4gd2hpY2ggb2Zmc2V0IG9jY3Vyc1xuICogQHBhcmFtIHBvcyBvZmZzZXQgaW4gc3RyaW5nLCAwPD1wb3M8c3RyaW5nLmxlbmd0aCgpXG4gKiBAcmV0dXJuIHRoZSAxLWJhc2VkIGNvbHVtbiBudW1iZXIgb2YgdGhlIGNoYXJhY3RlciBhdCBvZmZzZXQgcG9zIGluIHN0cmluZyxcbiAqIGFzIGlmIHN0cmluZyB3ZXJlIGJlaW5nIHZpZXdlZCBpbiBhIHRleHQgZWRpdG9yIHdpdGggdGFiIHNpemUgMSAoaS5lLiBhIHRhYiBpcyB0cmVhdGVkIGxpa2UgYSBzcGFjZSlcbiAqL1xuZnVuY3Rpb24gdG9Db2x1bW4ocywgcG9zKSB7XG4gICAgY29uc3QgbGFzdE5ld2xpbmVCZWZvcmVQb3MgPSBzLmxhc3RJbmRleE9mKCdcXG4nLCBwb3MgLSAxKTtcbiAgICBjb25zdCB0b3RhbFNpemVPZlByZWNlZGluZ0xpbmVzID0gKGxhc3ROZXdsaW5lQmVmb3JlUG9zICE9IC0xKSA/IGxhc3ROZXdsaW5lQmVmb3JlUG9zICsgMSA6IDA7XG4gICAgcmV0dXJuIHBvcyAtIHRvdGFsU2l6ZU9mUHJlY2VkaW5nTGluZXMgKyAxO1xufVxuZXhwb3J0cy50b0NvbHVtbiA9IHRvQ29sdW1uO1xuLyoqXG4qIFJlcGxhY2UgY29tbW9uIHVucHJpbnRhYmxlIGNoYXJhY3RlcnMgYnkgdGhlaXIgZXNjYXBlIGNvZGVzLCBmb3IgaHVtYW4gcmVhZGluZy5cbiogU2hvdWxkIGJlIGlkZW1wb3RlbnQsIGkuZS4gaWYgeCA9IGVzY2FwZUZvclJlYWRpbmcoeSksIHRoZW4geC5lcXVhbHMoZXNjYXBlRm9yUmVhZGluZyh4KSkuXG4qIEBwYXJhbSBzdHJpbmcgdG8gZXNjYXBlXG4qIEBwYXJhbSBxdW90ZSBxdW90ZXMgdG8gcHV0IGFyb3VuZCBzdHJpbmcsIG9yIFwiXCIgaWYgbm8gcXVvdGVzIHJlcXVpcmVkXG4qIEByZXR1cm4gc3RyaW5nIHdpdGggZXNjYXBlIGNvZGVzIHJlcGxhY2VkLCBwcmVjZWRlZCBhbmQgZm9sbG93ZWQgYnkgcXVvdGUsIHdpdGggYSBodW1hbi1yZWFkYWJsZSBsZWdlbmQgYXBwZW5kZWQgdG8gdGhlIGVuZFxuKiAgICAgICAgIGV4cGxhaW5pbmcgd2hhdCB0aGUgcmVwbGFjZW1lbnQgY2hhcmFjdGVycyBtZWFuLlxuKi9cbmZ1bmN0aW9uIGVzY2FwZUZvclJlYWRpbmcocywgcXVvdGUpIHtcbiAgICBsZXQgcmVzdWx0ID0gcztcbiAgICBjb25zdCBsZWdlbmQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHsgdW5wcmludGFibGVDaGFyLCBodW1hblJlYWRhYmxlVmVyc2lvbiwgZGVzY3JpcHRpb24gfSBvZiBFU0NBUEVTKSB7XG4gICAgICAgIGlmIChyZXN1bHQuaW5jbHVkZXModW5wcmludGFibGVDaGFyKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UodW5wcmludGFibGVDaGFyLCBodW1hblJlYWRhYmxlVmVyc2lvbik7XG4gICAgICAgICAgICBsZWdlbmQucHVzaChodW1hblJlYWRhYmxlVmVyc2lvbiArIFwiIG1lYW5zIFwiICsgZGVzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdCA9IHF1b3RlICsgcmVzdWx0ICsgcXVvdGU7XG4gICAgaWYgKGxlZ2VuZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3VsdCArPSBcIiAod2hlcmUgXCIgKyBsZWdlbmQuam9pbihcIiwgXCIpICsgXCIpXCI7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmVzY2FwZUZvclJlYWRpbmcgPSBlc2NhcGVGb3JSZWFkaW5nO1xuY29uc3QgRVNDQVBFUyA9IFtcbiAgICB7XG4gICAgICAgIHVucHJpbnRhYmxlQ2hhcjogXCJcXG5cIixcbiAgICAgICAgaHVtYW5SZWFkYWJsZVZlcnNpb246IFwiXFx1MjQyNFwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJuZXdsaW5lXCJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdW5wcmludGFibGVDaGFyOiBcIlxcclwiLFxuICAgICAgICBodW1hblJlYWRhYmxlVmVyc2lvbjogXCJcXHUyNDBEXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcImNhcnJpYWdlIHJldHVyblwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHVucHJpbnRhYmxlQ2hhcjogXCJcXHRcIixcbiAgICAgICAgaHVtYW5SZWFkYWJsZVZlcnNpb246IFwiXFx1MjFFNVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJ0YWJcIlxuICAgIH0sXG5dO1xuLyoqXG4gKiBAcGFyYW0gc3RyaW5nIHRvIHNob3J0ZW5cbiAqIEBwYXJhbSBwb3Mgb2Zmc2V0IGluIHN0cmluZywgMDw9cG9zPHN0cmluZy5sZW5ndGgoKVxuICogQHJldHVybiBhIHNob3J0IHNuaXBwZXQgb2YgdGhlIHBhcnQgb2Ygc3RyaW5nIHN0YXJ0aW5nIGF0IG9mZnNldCBwb3MsXG4gKiBpbiBodW1hbi1yZWFkYWJsZSBmb3JtXG4gKi9cbmZ1bmN0aW9uIHNuaXBwZXQocywgcG9zKSB7XG4gICAgY29uc3QgbWF4Q2hhcnNUb1Nob3cgPSAxMDtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihwb3MgKyBtYXhDaGFyc1RvU2hvdywgcy5sZW5ndGgpO1xuICAgIGxldCByZXN1bHQgPSBzLnN1YnN0cmluZyhwb3MsIGVuZCkgKyAoZW5kIDwgcy5sZW5ndGggPyBcIi4uLlwiIDogXCJcIik7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMClcbiAgICAgICAgcmVzdWx0ID0gXCJlbmQgb2Ygc3RyaW5nXCI7XG4gICAgcmV0dXJuIGVzY2FwZUZvclJlYWRpbmcocmVzdWx0LCBcIlwiKTtcbn1cbmV4cG9ydHMuc25pcHBldCA9IHNuaXBwZXQ7XG4vKipcbiAqIEluZGVudCBhIG11bHRpLWxpbmUgc3RyaW5nIGJ5IHByZWNlZGluZyBlYWNoIGxpbmUgd2l0aCBwcmVmaXguXG4gKiBAcGFyYW0gc3RyaW5nIHN0cmluZyB0byBpbmRlbnRcbiAqIEBwYXJhbSBwcmVmaXggcHJlZml4IHRvIHVzZSBmb3IgaW5kZW50aW5nXG4gKiBAcmV0dXJuIHN0cmluZyB3aXRoIHByZWZpeCBpbnNlcnRlZCBhdCB0aGUgc3RhcnQgb2YgZWFjaCBsaW5lXG4gKi9cbmZ1bmN0aW9uIGluZGVudChzLCBwcmVmaXgpIHtcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBsZXQgY2hhcnNDb3BpZWQgPSAwO1xuICAgIGRvIHtcbiAgICAgICAgY29uc3QgbmV3bGluZSA9IHMuaW5kZXhPZignXFxuJywgY2hhcnNDb3BpZWQpO1xuICAgICAgICBjb25zdCBlbmRPZkxpbmUgPSBuZXdsaW5lICE9IC0xID8gbmV3bGluZSArIDEgOiBzLmxlbmd0aDtcbiAgICAgICAgcmVzdWx0ICs9IHByZWZpeCArIHMuc3Vic3RyaW5nKGNoYXJzQ29waWVkLCBlbmRPZkxpbmUpO1xuICAgICAgICBjaGFyc0NvcGllZCA9IGVuZE9mTGluZTtcbiAgICB9IHdoaWxlIChjaGFyc0NvcGllZCA8IHMubGVuZ3RoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5pbmRlbnQgPSBpbmRlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXNwbGF5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXJzZXJTdGF0ZSA9IGV4cG9ydHMuRmFpbGVkUGFyc2UgPSBleHBvcnRzLlN1Y2Nlc3NmdWxQYXJzZSA9IGV4cG9ydHMuSW50ZXJuYWxQYXJzZXIgPSBleHBvcnRzLmZhaWxmYXN0ID0gZXhwb3J0cy5za2lwID0gZXhwb3J0cy5vcHRpb24gPSBleHBvcnRzLnBsdXMgPSBleHBvcnRzLnN0YXIgPSBleHBvcnRzLnJlcGVhdCA9IGV4cG9ydHMuWkVST19PUl9PTkUgPSBleHBvcnRzLk9ORV9PUl9NT1JFID0gZXhwb3J0cy5aRVJPX09SX01PUkUgPSBleHBvcnRzLkJldHdlZW4gPSBleHBvcnRzLkF0TGVhc3QgPSBleHBvcnRzLm9yID0gZXhwb3J0cy5jYXQgPSBleHBvcnRzLnN0ciA9IGV4cG9ydHMucmVnZXggPSBleHBvcnRzLm50ID0gdm9pZCAwO1xuY29uc3QgYXNzZXJ0XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5jb25zdCBwYXJzZXRyZWVfMSA9IHJlcXVpcmUoXCIuL3BhcnNldHJlZVwiKTtcbmZ1bmN0aW9uIG50KG5vbnRlcm1pbmFsLCBub250ZXJtaW5hbE5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgY29uc3QgZ3QgPSBkZWZpbml0aW9ucy5nZXQobm9udGVybWluYWwpO1xuICAgICAgICAgICAgaWYgKGd0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKFwibm9udGVybWluYWwgaGFzIG5vIGRlZmluaXRpb246IFwiICsgbm9udGVybWluYWxOYW1lKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJlbnRlcmluZ1wiLCBub250ZXJtaW5hbE5hbWUpO1xuICAgICAgICAgICAgc3RhdGUuZW50ZXIocG9zLCBub250ZXJtaW5hbCk7XG4gICAgICAgICAgICBsZXQgcHIgPSBndC5wYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSk7XG4gICAgICAgICAgICBzdGF0ZS5sZWF2ZShub250ZXJtaW5hbCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwibGVhdmluZ1wiLCBub250ZXJtaW5hbE5hbWUsIFwid2l0aCByZXN1bHRcIiwgcHIpO1xuICAgICAgICAgICAgaWYgKCFwci5mYWlsZWQgJiYgIXN0YXRlLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyZWUgPSBwci50cmVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RyZWUgPSBzdGF0ZS5tYWtlUGFyc2VUcmVlKHRyZWUuc3RhcnQsIHRyZWUudGV4dCwgW3RyZWVdKTtcbiAgICAgICAgICAgICAgICBwciA9IHByLnJlcGxhY2VUcmVlKG5ld1RyZWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBub250ZXJtaW5hbE5hbWU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5udCA9IG50O1xuZnVuY3Rpb24gcmVnZXgocmVnZXhTb3VyY2UpIHtcbiAgICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHJlZ2V4U291cmNlICsgJyQnLCAncycpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBpZiAocG9zID49IHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VGYWlsZWRQYXJzZShwb3MsIHJlZ2V4U291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGwgPSBzLnN1YnN0cmluZyhwb3MsIHBvcyArIDEpO1xuICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QobCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZVN1Y2Nlc3NmdWxQYXJzZShwb3MsIHBvcyArIDEsIGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VGYWlsZWRQYXJzZShwb3MsIHJlZ2V4U291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVnZXhTb3VyY2U7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5yZWdleCA9IHJlZ2V4O1xuZnVuY3Rpb24gc3RyKHN0cikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdwb3MgPSBwb3MgKyBzdHIubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKG5ld3BvcyA+IHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VGYWlsZWRQYXJzZShwb3MsIHN0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsID0gcy5zdWJzdHJpbmcocG9zLCBuZXdwb3MpO1xuICAgICAgICAgICAgaWYgKGwgPT09IHN0cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlU3VjY2Vzc2Z1bFBhcnNlKHBvcywgbmV3cG9zLCBsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlRmFpbGVkUGFyc2UocG9zLCBzdHIpO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBcIidcIiArIHN0ci5yZXBsYWNlKC8nXFxyXFxuXFx0XFxcXC8sIFwiXFxcXCQmXCIpICsgXCInXCI7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5zdHIgPSBzdHI7XG5mdW5jdGlvbiBjYXQoLi4udGVybXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgbGV0IHByb3V0ID0gc3RhdGUubWFrZVN1Y2Nlc3NmdWxQYXJzZShwb3MsIHBvcyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGd0IG9mIHRlcm1zKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHIgPSBndC5wYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHByLmZhaWxlZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByO1xuICAgICAgICAgICAgICAgIHBvcyA9IHByLnBvcztcbiAgICAgICAgICAgICAgICBwcm91dCA9IHByb3V0Lm1lcmdlUmVzdWx0KHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcm91dDtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCIoXCIgKyB0ZXJtcy5tYXAodGVybSA9PiB0ZXJtLnRvU3RyaW5nKCkpLmpvaW4oXCIgXCIpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5jYXQgPSBjYXQ7XG4vKipcbiAqIEBwYXJhbSBjaG9pY2VzIG11c3QgYmUgbm9uZW1wdHlcbiAqL1xuZnVuY3Rpb24gb3IoLi4uY2hvaWNlcykge1xuICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShjaG9pY2VzLmxlbmd0aCA+IDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzZXMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZhaWx1cmVzID0gW107XG4gICAgICAgICAgICBjaG9pY2VzLmZvckVhY2goKGNob2ljZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNob2ljZS5wYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5mYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmFpbHVyZXMucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc2VzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChzdWNjZXNzZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvbmdlc3RTdWNjZXNzZXMgPSBsb25nZXN0UmVzdWx0cyhzdWNjZXNzZXMpO1xuICAgICAgICAgICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShsb25nZXN0U3VjY2Vzc2VzLmxlbmd0aCA+IDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBsb25nZXN0U3VjY2Vzc2VzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbG9uZ2VzdEZhaWx1cmVzID0gbG9uZ2VzdFJlc3VsdHMoZmFpbHVyZXMpO1xuICAgICAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGxvbmdlc3RGYWlsdXJlcy5sZW5ndGggPiAwKTtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlRmFpbGVkUGFyc2UobG9uZ2VzdEZhaWx1cmVzWzBdLnBvcywgbG9uZ2VzdEZhaWx1cmVzLm1hcCgocmVzdWx0KSA9PiByZXN1bHQuZXhwZWN0ZWRUZXh0KS5qb2luKFwifFwiKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiKFwiICsgY2hvaWNlcy5tYXAoY2hvaWNlID0+IGNob2ljZS50b1N0cmluZygpKS5qb2luKFwifFwiKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMub3IgPSBvcjtcbmNsYXNzIEF0TGVhc3Qge1xuICAgIGNvbnN0cnVjdG9yKG1pbikge1xuICAgICAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICB9XG4gICAgdG9vTG93KG4pIHsgcmV0dXJuIG4gPCB0aGlzLm1pbjsgfVxuICAgIHRvb0hpZ2gobikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1pbikge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gXCIqXCI7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBcIitcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBcIntcIiArIHRoaXMubWluICsgXCIsfVwiO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5BdExlYXN0ID0gQXRMZWFzdDtcbmNsYXNzIEJldHdlZW4ge1xuICAgIGNvbnN0cnVjdG9yKG1pbiwgbWF4KSB7XG4gICAgICAgIHRoaXMubWluID0gbWluO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICB9XG4gICAgdG9vTG93KG4pIHsgcmV0dXJuIG4gPCB0aGlzLm1pbjsgfVxuICAgIHRvb0hpZ2gobikgeyByZXR1cm4gbiA+IHRoaXMubWF4OyB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGlmICh0aGlzLm1pbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMubWF4ID09IDEpID8gXCI/XCIgOiBcInssXCIgKyB0aGlzLm1heCArIFwifVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwie1wiICsgdGhpcy5taW4gKyBcIixcIiArIHRoaXMubWF4ICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkJldHdlZW4gPSBCZXR3ZWVuO1xuZXhwb3J0cy5aRVJPX09SX01PUkUgPSBuZXcgQXRMZWFzdCgwKTtcbmV4cG9ydHMuT05FX09SX01PUkUgPSBuZXcgQXRMZWFzdCgxKTtcbmV4cG9ydHMuWkVST19PUl9PTkUgPSBuZXcgQmV0d2VlbigwLCAxKTtcbmZ1bmN0aW9uIHJlcGVhdChndCwgaG93bWFueSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBsZXQgcHJvdXQgPSBzdGF0ZS5tYWtlU3VjY2Vzc2Z1bFBhcnNlKHBvcywgcG9zKTtcbiAgICAgICAgICAgIGZvciAobGV0IHRpbWVzTWF0Y2hlZCA9IDA7IGhvd21hbnkudG9vTG93KHRpbWVzTWF0Y2hlZCkgfHwgIWhvd21hbnkudG9vSGlnaCh0aW1lc01hdGNoZWQgKyAxKTsgKyt0aW1lc01hdGNoZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwciA9IGd0LnBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAocHIuZmFpbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3dtYW55LnRvb0xvdyh0aW1lc01hdGNoZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3V0LmFkZExhc3RGYWlsdXJlKHByKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwci5wb3MgPT0gcG9zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaGVkIHRoZSBlbXB0eSBzdHJpbmcsIGFuZCB3ZSBhbHJlYWR5IGhhdmUgZW5vdWdoLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgbWF5IGdldCBpbnRvIGFuIGluZmluaXRlIGxvb3AgaWYgaG93bWFueS50b29IaWdoKCkgbmV2ZXIgcmV0dXJucyBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHJldHVybiBzdWNjZXNzZnVsIG1hdGNoIGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm91dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgYWR2YW5jZSB0aGUgcG9zaXRpb24gYW5kIG1lcmdlIHByIGludG8gcHJvdXRcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcHIucG9zO1xuICAgICAgICAgICAgICAgICAgICBwcm91dCA9IHByb3V0Lm1lcmdlUmVzdWx0KHByKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIGd0LnRvU3RyaW5nKCkgKyBob3dtYW55LnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5yZXBlYXQgPSByZXBlYXQ7XG5mdW5jdGlvbiBzdGFyKGd0KSB7XG4gICAgcmV0dXJuIHJlcGVhdChndCwgZXhwb3J0cy5aRVJPX09SX01PUkUpO1xufVxuZXhwb3J0cy5zdGFyID0gc3RhcjtcbmZ1bmN0aW9uIHBsdXMoZ3QpIHtcbiAgICByZXR1cm4gcmVwZWF0KGd0LCBleHBvcnRzLk9ORV9PUl9NT1JFKTtcbn1cbmV4cG9ydHMucGx1cyA9IHBsdXM7XG5mdW5jdGlvbiBvcHRpb24oZ3QpIHtcbiAgICByZXR1cm4gcmVwZWF0KGd0LCBleHBvcnRzLlpFUk9fT1JfT05FKTtcbn1cbmV4cG9ydHMub3B0aW9uID0gb3B0aW9uO1xuZnVuY3Rpb24gc2tpcChub250ZXJtaW5hbCkge1xuICAgIGNvbnN0IHJlcGV0aXRpb24gPSBzdGFyKG5vbnRlcm1pbmFsKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSkge1xuICAgICAgICAgICAgc3RhdGUuZW50ZXJTa2lwKCk7XG4gICAgICAgICAgICBsZXQgcHIgPSByZXBldGl0aW9uLnBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKTtcbiAgICAgICAgICAgIHN0YXRlLmxlYXZlU2tpcCgpO1xuICAgICAgICAgICAgaWYgKHByLmZhaWxlZCkge1xuICAgICAgICAgICAgICAgIC8vIHN1Y2NlZWQgYW55d2F5XG4gICAgICAgICAgICAgICAgcHIgPSBzdGF0ZS5tYWtlU3VjY2Vzc2Z1bFBhcnNlKHBvcywgcG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcjtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCIoPzxza2lwPlwiICsgcmVwZXRpdGlvbiArIFwiKVwiO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuc2tpcCA9IHNraXA7XG5mdW5jdGlvbiBmYWlsZmFzdChndCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBsZXQgcHIgPSBndC5wYXJzZShzLCBwb3MsIGRlZmluaXRpb25zLCBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAocHIuZmFpbGVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcihcIlwiLCBwci5ub250ZXJtaW5hbE5hbWUsIHByLmV4cGVjdGVkVGV4dCwgXCJcIiwgcHIucG9zKTtcbiAgICAgICAgICAgIHJldHVybiBwcjtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2ZhaWxmYXN0KCcgKyBndCArICcpJztcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmZhaWxmYXN0ID0gZmFpbGZhc3Q7XG5jbGFzcyBJbnRlcm5hbFBhcnNlciB7XG4gICAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMsIHN0YXJ0LCBub250ZXJtaW5hbFRvU3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm5vbnRlcm1pbmFsVG9TdHJpbmcgPSBub250ZXJtaW5hbFRvU3RyaW5nO1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgfVxuICAgIGNoZWNrUmVwKCkge1xuICAgIH1cbiAgICBwYXJzZSh0ZXh0VG9QYXJzZSkge1xuICAgICAgICBsZXQgcHIgPSAoKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJzZSh0ZXh0VG9QYXJzZSwgMCwgdGhpcy5kZWZpbml0aW9ucywgbmV3IFBhcnNlclN0YXRlKHRoaXMubm9udGVybWluYWxUb1N0cmluZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldGhyb3cgdGhlIGV4Y2VwdGlvbiwgYXVnbWVudGVkIGJ5IHRoZSBvcmlnaW5hbCB0ZXh0LCBzbyB0aGF0IHRoZSBlcnJvciBtZXNzYWdlIGlzIGJldHRlclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IoXCJzdHJpbmcgZG9lcyBub3QgbWF0Y2ggZ3JhbW1hclwiLCBlLm5vbnRlcm1pbmFsTmFtZSwgZS5leHBlY3RlZFRleHQsIHRleHRUb1BhcnNlLCBlLnBvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgaWYgKHByLmZhaWxlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKFwic3RyaW5nIGRvZXMgbm90IG1hdGNoIGdyYW1tYXJcIiwgcHIubm9udGVybWluYWxOYW1lLCBwci5leHBlY3RlZFRleHQsIHRleHRUb1BhcnNlLCBwci5wb3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwci5wb3MgPCB0ZXh0VG9QYXJzZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIm9ubHkgcGFydCBvZiB0aGUgc3RyaW5nIG1hdGNoZXMgdGhlIGdyYW1tYXI7IHRoZSByZXN0IGRpZCBub3QgcGFyc2VcIjtcbiAgICAgICAgICAgIHRocm93IChwci5sYXN0RmFpbHVyZVxuICAgICAgICAgICAgICAgID8gbmV3IHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKG1lc3NhZ2UsIHByLmxhc3RGYWlsdXJlLm5vbnRlcm1pbmFsTmFtZSwgcHIubGFzdEZhaWx1cmUuZXhwZWN0ZWRUZXh0LCB0ZXh0VG9QYXJzZSwgcHIubGFzdEZhaWx1cmUucG9zKVxuICAgICAgICAgICAgICAgIDogbmV3IHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKG1lc3NhZ2UsIHRoaXMuc3RhcnQudG9TdHJpbmcoKSwgXCJlbmQgb2Ygc3RyaW5nXCIsIHRleHRUb1BhcnNlLCBwci5wb3MpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHIudHJlZTtcbiAgICB9XG4gICAgO1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRlZmluaXRpb25zLCAoW25vbnRlcm1pbmFsLCBydWxlXSkgPT4gdGhpcy5ub250ZXJtaW5hbFRvU3RyaW5nKG5vbnRlcm1pbmFsKSArICc6Oj0nICsgcnVsZSArICc7Jykuam9pbihcIlxcblwiKTtcbiAgICB9XG59XG5leHBvcnRzLkludGVybmFsUGFyc2VyID0gSW50ZXJuYWxQYXJzZXI7XG5jbGFzcyBTdWNjZXNzZnVsUGFyc2Uge1xuICAgIGNvbnN0cnVjdG9yKHBvcywgdHJlZSwgbGFzdEZhaWx1cmUpIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgICAgIHRoaXMubGFzdEZhaWx1cmUgPSBsYXN0RmFpbHVyZTtcbiAgICAgICAgdGhpcy5mYWlsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmVwbGFjZVRyZWUodHJlZSkge1xuICAgICAgICByZXR1cm4gbmV3IFN1Y2Nlc3NmdWxQYXJzZSh0aGlzLnBvcywgdHJlZSwgdGhpcy5sYXN0RmFpbHVyZSk7XG4gICAgfVxuICAgIG1lcmdlUmVzdWx0KHRoYXQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKCF0aGF0LmZhaWxlZCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ21lcmdpbmcnLCB0aGlzLCAnd2l0aCcsIHRoYXQpO1xuICAgICAgICByZXR1cm4gbmV3IFN1Y2Nlc3NmdWxQYXJzZSh0aGF0LnBvcywgdGhpcy50cmVlLmNvbmNhdCh0aGF0LnRyZWUpLCBsYXRlclJlc3VsdCh0aGlzLmxhc3RGYWlsdXJlLCB0aGF0Lmxhc3RGYWlsdXJlKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEtlZXAgdHJhY2sgb2YgYSBmYWlsaW5nIHBhcnNlIHJlc3VsdCB0aGF0IHByZXZlbnRlZCB0aGlzIHRyZWUgZnJvbSBtYXRjaGluZyBtb3JlIG9mIHRoZSBpbnB1dCBzdHJpbmcuXG4gICAgICogVGhpcyBkZWVwZXIgZmFpbHVyZSBpcyB1c3VhbGx5IG1vcmUgaW5mb3JtYXRpdmUgdG8gdGhlIHVzZXIsIHNvIHdlJ2xsIGRpc3BsYXkgaXQgaW4gdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgICogQHBhcmFtIG5ld0xhc3RGYWlsdXJlIGEgZmFpbGluZyBQYXJzZVJlc3VsdDxOVD4gdGhhdCBzdG9wcGVkIHRoaXMgdHJlZSdzIHBhcnNlIChidXQgZGlkbid0IHByZXZlbnQgdGhpcyBmcm9tIHN1Y2NlZWRpbmcpXG4gICAgICogQHJldHVybiBhIG5ldyBQYXJzZVJlc3VsdDxOVD4gaWRlbnRpY2FsIHRvIHRoaXMgb25lIGJ1dCB3aXRoIGxhc3RGYWlsdXJlIGFkZGVkIHRvIGl0XG4gICAgICovXG4gICAgYWRkTGFzdEZhaWx1cmUobmV3TGFzdEZhaWx1cmUpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKG5ld0xhc3RGYWlsdXJlLmZhaWxlZCk7XG4gICAgICAgIHJldHVybiBuZXcgU3VjY2Vzc2Z1bFBhcnNlKHRoaXMucG9zLCB0aGlzLnRyZWUsIGxhdGVyUmVzdWx0KHRoaXMubGFzdEZhaWx1cmUsIG5ld0xhc3RGYWlsdXJlKSk7XG4gICAgfVxufVxuZXhwb3J0cy5TdWNjZXNzZnVsUGFyc2UgPSBTdWNjZXNzZnVsUGFyc2U7XG5jbGFzcyBGYWlsZWRQYXJzZSB7XG4gICAgY29uc3RydWN0b3IocG9zLCBub250ZXJtaW5hbE5hbWUsIGV4cGVjdGVkVGV4dCkge1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy5ub250ZXJtaW5hbE5hbWUgPSBub250ZXJtaW5hbE5hbWU7XG4gICAgICAgIHRoaXMuZXhwZWN0ZWRUZXh0ID0gZXhwZWN0ZWRUZXh0O1xuICAgICAgICB0aGlzLmZhaWxlZCA9IHRydWU7XG4gICAgfVxufVxuZXhwb3J0cy5GYWlsZWRQYXJzZSA9IEZhaWxlZFBhcnNlO1xuLyoqXG4gKiBAcGFyYW0gcmVzdWx0MVxuICogQHBhcmFtIHJlc3VsdDJcbiAqIEByZXR1cm4gd2hpY2hldmVyIG9mIHJlc3VsdDEgb3IgcmVzdWx0MiBoYXMgdGhlIG14aW11bSBwb3NpdGlvbiwgb3IgdW5kZWZpbmVkIGlmIGJvdGggYXJlIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBsYXRlclJlc3VsdChyZXN1bHQxLCByZXN1bHQyKSB7XG4gICAgaWYgKHJlc3VsdDEgJiYgcmVzdWx0MilcbiAgICAgICAgcmV0dXJuIHJlc3VsdDEucG9zID49IHJlc3VsdDIucG9zID8gcmVzdWx0MSA6IHJlc3VsdDI7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gcmVzdWx0MSB8fCByZXN1bHQyO1xufVxuLyoqXG4gKiBAcGFyYW0gcmVzdWx0c1xuICogQHJldHVybiB0aGUgcmVzdWx0cyBpbiB0aGUgbGlzdCB3aXRoIG1heGltdW0gcG9zLiAgRW1wdHkgaWYgbGlzdCBpcyBlbXB0eS5cbiAqL1xuZnVuY3Rpb24gbG9uZ2VzdFJlc3VsdHMocmVzdWx0cykge1xuICAgIHJldHVybiByZXN1bHRzLnJlZHVjZSgobG9uZ2VzdFJlc3VsdHNTb0ZhciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChsb25nZXN0UmVzdWx0c1NvRmFyLmxlbmd0aCA9PSAwIHx8IHJlc3VsdC5wb3MgPiBsb25nZXN0UmVzdWx0c1NvRmFyWzBdLnBvcykge1xuICAgICAgICAgICAgLy8gcmVzdWx0IHdpbnNcbiAgICAgICAgICAgIHJldHVybiBbcmVzdWx0XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN1bHQucG9zID09IGxvbmdlc3RSZXN1bHRzU29GYXJbMF0ucG9zKSB7XG4gICAgICAgICAgICAvLyByZXN1bHQgaXMgdGllZFxuICAgICAgICAgICAgbG9uZ2VzdFJlc3VsdHNTb0Zhci5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICByZXR1cm4gbG9uZ2VzdFJlc3VsdHNTb0ZhcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlc3VsdCBsb3Nlc1xuICAgICAgICAgICAgcmV0dXJuIGxvbmdlc3RSZXN1bHRzU29GYXI7XG4gICAgICAgIH1cbiAgICB9LCBbXSk7XG59XG5jbGFzcyBQYXJzZXJTdGF0ZSB7XG4gICAgY29uc3RydWN0b3Iobm9udGVybWluYWxUb1N0cmluZykge1xuICAgICAgICB0aGlzLm5vbnRlcm1pbmFsVG9TdHJpbmcgPSBub250ZXJtaW5hbFRvU3RyaW5nO1xuICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgIHRoaXMuZmlyc3QgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc2tpcERlcHRoID0gMDtcbiAgICB9XG4gICAgZW50ZXIocG9zLCBub250ZXJtaW5hbCkge1xuICAgICAgICBpZiAoIXRoaXMuZmlyc3QuaGFzKG5vbnRlcm1pbmFsKSkge1xuICAgICAgICAgICAgdGhpcy5maXJzdC5zZXQobm9udGVybWluYWwsIFtdKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzID0gdGhpcy5maXJzdC5nZXQobm9udGVybWluYWwpO1xuICAgICAgICBpZiAocy5sZW5ndGggPiAwICYmIHNbcy5sZW5ndGggLSAxXSA9PSBwb3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcihcImRldGVjdGVkIGxlZnQgcmVjdXJzaW9uIGluIHJ1bGUgZm9yIFwiICsgdGhpcy5ub250ZXJtaW5hbFRvU3RyaW5nKG5vbnRlcm1pbmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcy5wdXNoKHBvcyk7XG4gICAgICAgIHRoaXMuc3RhY2sucHVzaChub250ZXJtaW5hbCk7XG4gICAgfVxuICAgIGxlYXZlKG5vbnRlcm1pbmFsKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSh0aGlzLmZpcnN0Lmhhcyhub250ZXJtaW5hbCkgJiYgdGhpcy5maXJzdC5nZXQobm9udGVybWluYWwpLmxlbmd0aCA+IDApO1xuICAgICAgICB0aGlzLmZpcnN0LmdldChub250ZXJtaW5hbCkucG9wKCk7XG4gICAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLnN0YWNrLnBvcCgpO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkobGFzdCA9PT0gbm9udGVybWluYWwpO1xuICAgIH1cbiAgICBlbnRlclNraXAoKSB7XG4gICAgICAgIC8vY29uc29sZS5lcnJvcignZW50ZXJpbmcgc2tpcCcpO1xuICAgICAgICArK3RoaXMuc2tpcERlcHRoO1xuICAgIH1cbiAgICBsZWF2ZVNraXAoKSB7XG4gICAgICAgIC8vY29uc29sZS5lcnJvcignbGVhdmluZyBza2lwJyk7XG4gICAgICAgIC0tdGhpcy5za2lwRGVwdGg7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSh0aGlzLnNraXBEZXB0aCA+PSAwKTtcbiAgICB9XG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2subGVuZ3RoID09IDA7XG4gICAgfVxuICAgIGdldCBjdXJyZW50Tm9udGVybWluYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIGdldCBjdXJyZW50Tm9udGVybWluYWxOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50Tm9udGVybWluYWwgIT09IHVuZGVmaW5lZCA/IHRoaXMubm9udGVybWluYWxUb1N0cmluZyh0aGlzLmN1cnJlbnROb250ZXJtaW5hbCkgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIHJlcXVpcmVzOiAhaXNFbXB0eSgpXG4gICAgbWFrZVBhcnNlVHJlZShwb3MsIHRleHQgPSAnJywgY2hpbGRyZW4gPSBbXSkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoIXRoaXMuaXNFbXB0eSgpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwYXJzZXRyZWVfMS5JbnRlcm5hbFBhcnNlVHJlZSh0aGlzLmN1cnJlbnROb250ZXJtaW5hbCwgdGhpcy5jdXJyZW50Tm9udGVybWluYWxOYW1lLCBwb3MsIHRleHQsIGNoaWxkcmVuLCB0aGlzLnNraXBEZXB0aCA+IDApO1xuICAgIH1cbiAgICAvLyByZXF1aXJlcyAhaXNFbXB0eSgpXG4gICAgbWFrZVN1Y2Nlc3NmdWxQYXJzZShmcm9tUG9zLCB0b1BvcywgdGV4dCA9ICcnLCBjaGlsZHJlbiA9IFtdKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSghdGhpcy5pc0VtcHR5KCkpO1xuICAgICAgICByZXR1cm4gbmV3IFN1Y2Nlc3NmdWxQYXJzZSh0b1BvcywgdGhpcy5tYWtlUGFyc2VUcmVlKGZyb21Qb3MsIHRleHQsIGNoaWxkcmVuKSk7XG4gICAgfVxuICAgIC8vIHJlcXVpcmVzICFpc0VtcHR5KClcbiAgICBtYWtlRmFpbGVkUGFyc2UoYXRQb3MsIGV4cGVjdGVkVGV4dCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoIXRoaXMuaXNFbXB0eSgpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGYWlsZWRQYXJzZShhdFBvcywgdGhpcy5jdXJyZW50Tm9udGVybWluYWxOYW1lLCBleHBlY3RlZFRleHQpO1xuICAgIH1cbn1cbmV4cG9ydHMuUGFyc2VyU3RhdGUgPSBQYXJzZXJTdGF0ZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW50ZXJuYWxQYXJzZVRyZWUgPSB2b2lkIDA7XG5jb25zdCBkaXNwbGF5XzEgPSByZXF1aXJlKFwiLi9kaXNwbGF5XCIpO1xuY2xhc3MgSW50ZXJuYWxQYXJzZVRyZWUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIG5vbnRlcm1pbmFsTmFtZSwgc3RhcnQsIHRleHQsIGFsbENoaWxkcmVuLCBpc1NraXBwZWQpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5ub250ZXJtaW5hbE5hbWUgPSBub250ZXJtaW5hbE5hbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5hbGxDaGlsZHJlbiA9IGFsbENoaWxkcmVuO1xuICAgICAgICB0aGlzLmlzU2tpcHBlZCA9IGlzU2tpcHBlZDtcbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuYWxsQ2hpbGRyZW4pO1xuICAgICAgICAvLyBjYW4ndCBmcmVlemUodGhpcykgYmVjYXVzZSBvZiBiZW5lZmljZW50IG11dGF0aW9uIGRlbGF5ZWQgY29tcHV0YXRpb24td2l0aC1jYWNoaW5nIGZvciBjaGlsZHJlbigpIGFuZCBjaGlsZHJlbkJ5TmFtZSgpXG4gICAgfVxuICAgIGNoZWNrUmVwKCkge1xuICAgICAgICAvLyBGSVhNRVxuICAgIH1cbiAgICBnZXQgZW5kKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgfVxuICAgIGNoaWxkcmVuQnlOYW1lKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jaGlsZHJlbkJ5TmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5CeU5hbWUgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuYWxsQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2NoaWxkcmVuQnlOYW1lLmhhcyhjaGlsZC5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbkJ5TmFtZS5zZXQoY2hpbGQubmFtZSwgW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbkJ5TmFtZS5nZXQoY2hpbGQubmFtZSkucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkTGlzdCBvZiB0aGlzLl9jaGlsZHJlbkJ5TmFtZS52YWx1ZXMoKSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbkJ5TmFtZS5nZXQobmFtZSkgfHwgW107XG4gICAgfVxuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB0aGlzLmFsbENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiAhY2hpbGQuaXNTa2lwcGVkKTtcbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5fY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgIH1cbiAgICBjb25jYXQodGhhdCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVybmFsUGFyc2VUcmVlKHRoaXMubmFtZSwgdGhpcy5ub250ZXJtaW5hbE5hbWUsIHRoaXMuc3RhcnQsIHRoaXMudGV4dCArIHRoYXQudGV4dCwgdGhpcy5hbGxDaGlsZHJlbi5jb25jYXQodGhhdC5hbGxDaGlsZHJlbiksIHRoaXMuaXNTa2lwcGVkICYmIHRoYXQuaXNTa2lwcGVkKTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGxldCBzID0gKHRoaXMuaXNTa2lwcGVkID8gXCJAc2tpcCBcIiA6IFwiXCIpICsgdGhpcy5ub250ZXJtaW5hbE5hbWU7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBzICs9IFwiOlwiICsgKDAsIGRpc3BsYXlfMS5lc2NhcGVGb3JSZWFkaW5nKSh0aGlzLnRleHQsIFwiXFxcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ID0gXCJcIjtcbiAgICAgICAgICAgIGxldCBvZmZzZXRSZWFjaGVkU29GYXIgPSB0aGlzLnN0YXJ0O1xuICAgICAgICAgICAgZm9yIChjb25zdCBwdCBvZiB0aGlzLmFsbENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFJlYWNoZWRTb0ZhciA8IHB0LnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzIGNoaWxkIGFuZCBjdXJyZW50IGNoaWxkIGhhdmUgYSBnYXAgYmV0d2VlbiB0aGVtIHRoYXQgbXVzdCBoYXZlIGJlZW4gbWF0Y2hlZCBhcyBhIHRlcm1pbmFsXG4gICAgICAgICAgICAgICAgICAgIC8vIGluIHRoZSBydWxlIGZvciB0aGlzIG5vZGUuICBJbnNlcnQgaXQgYXMgYSBxdW90ZWQgc3RyaW5nLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXJtaW5hbCA9IHRoaXMudGV4dC5zdWJzdHJpbmcob2Zmc2V0UmVhY2hlZFNvRmFyIC0gdGhpcy5zdGFydCwgcHQuc3RhcnQgLSB0aGlzLnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgdCArPSBcIlxcblwiICsgKDAsIGRpc3BsYXlfMS5lc2NhcGVGb3JSZWFkaW5nKSh0ZXJtaW5hbCwgXCJcXFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ICs9IFwiXFxuXCIgKyBwdDtcbiAgICAgICAgICAgICAgICBvZmZzZXRSZWFjaGVkU29GYXIgPSBwdC5lbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2Zmc2V0UmVhY2hlZFNvRmFyIDwgdGhpcy5lbmQpIHtcbiAgICAgICAgICAgICAgICAvLyBmaW5hbCBjaGlsZCBhbmQgZW5kIG9mIHRoaXMgbm9kZSBoYXZlIGEgZ2FwIC0tIHRyZWF0IGl0IHRoZSBzYW1lIGFzIGFib3ZlLlxuICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1pbmFsID0gdGhpcy50ZXh0LnN1YnN0cmluZyhvZmZzZXRSZWFjaGVkU29GYXIgLSB0aGlzLnN0YXJ0KTtcbiAgICAgICAgICAgICAgICB0ICs9IFwiXFxuXCIgKyAoMCwgZGlzcGxheV8xLmVzY2FwZUZvclJlYWRpbmcpKHRlcm1pbmFsLCBcIlxcXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzbWFsbEVub3VnaEZvck9uZUxpbmUgPSA1MDtcbiAgICAgICAgICAgIGlmICh0Lmxlbmd0aCA8PSBzbWFsbEVub3VnaEZvck9uZUxpbmUpIHtcbiAgICAgICAgICAgICAgICBzICs9IFwiIHsgXCIgKyB0LnN1YnN0cmluZygxKSAvLyByZW1vdmUgaW5pdGlhbCBuZXdsaW5lXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKFwiXFxuXCIsIFwiLCBcIilcbiAgICAgICAgICAgICAgICAgICAgKyBcIiB9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzICs9IFwiIHtcIiArICgwLCBkaXNwbGF5XzEuaW5kZW50KSh0LCBcIiAgXCIpICsgXCJcXG59XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxufVxuZXhwb3J0cy5JbnRlcm5hbFBhcnNlVHJlZSA9IEludGVybmFsUGFyc2VUcmVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2V0cmVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HcmFtbWFyRXJyb3IgPSBleHBvcnRzLkludGVybmFsUGFyc2VFcnJvciA9IGV4cG9ydHMuUGFyc2VFcnJvciA9IHZvaWQgMDtcbmNvbnN0IGRpc3BsYXlfMSA9IHJlcXVpcmUoXCIuL2Rpc3BsYXlcIik7XG4vKipcbiAqIEV4Y2VwdGlvbiB0aHJvd24gd2hlbiBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgZG9lc24ndCBtYXRjaCBhIGdyYW1tYXJcbiAqL1xuY2xhc3MgUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIH1cbn1cbmV4cG9ydHMuUGFyc2VFcnJvciA9IFBhcnNlRXJyb3I7XG5jbGFzcyBJbnRlcm5hbFBhcnNlRXJyb3IgZXh0ZW5kcyBQYXJzZUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBub250ZXJtaW5hbE5hbWUsIGV4cGVjdGVkVGV4dCwgdGV4dEJlaW5nUGFyc2VkLCBwb3MpIHtcbiAgICAgICAgc3VwZXIoKDAsIGRpc3BsYXlfMS5tYWtlRXJyb3JNZXNzYWdlKShtZXNzYWdlLCBub250ZXJtaW5hbE5hbWUsIGV4cGVjdGVkVGV4dCwgdGV4dEJlaW5nUGFyc2VkLCBwb3MsIFwic3RyaW5nIGJlaW5nIHBhcnNlZFwiKSk7XG4gICAgICAgIHRoaXMubm9udGVybWluYWxOYW1lID0gbm9udGVybWluYWxOYW1lO1xuICAgICAgICB0aGlzLmV4cGVjdGVkVGV4dCA9IGV4cGVjdGVkVGV4dDtcbiAgICAgICAgdGhpcy50ZXh0QmVpbmdQYXJzZWQgPSB0ZXh0QmVpbmdQYXJzZWQ7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgIH1cbn1cbmV4cG9ydHMuSW50ZXJuYWxQYXJzZUVycm9yID0gSW50ZXJuYWxQYXJzZUVycm9yO1xuY2xhc3MgR3JhbW1hckVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgZSkge1xuICAgICAgICBzdXBlcihlID8gKDAsIGRpc3BsYXlfMS5tYWtlRXJyb3JNZXNzYWdlKShtZXNzYWdlLCBlLm5vbnRlcm1pbmFsTmFtZSwgZS5leHBlY3RlZFRleHQsIGUudGV4dEJlaW5nUGFyc2VkLCBlLnBvcywgXCJncmFtbWFyXCIpXG4gICAgICAgICAgICA6IG1lc3NhZ2UpO1xuICAgIH1cbn1cbmV4cG9ydHMuR3JhbW1hckVycm9yID0gR3JhbW1hckVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHlwZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZpc3VhbGl6ZUFzSHRtbCA9IGV4cG9ydHMudmlzdWFsaXplQXNVcmwgPSB2b2lkIDA7XG5jb25zdCBjb21waWxlcl8xID0gcmVxdWlyZShcIi4vY29tcGlsZXJcIik7XG5jb25zdCBwYXJzZXJsaWJfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJsaWJcIik7XG5jb25zdCBmc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XG5jb25zdCBwYXRoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInBhdGhcIikpO1xuZnVuY3Rpb24gZW1wdHlJdGVyYXRvcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuZXh0KCkgeyByZXR1cm4geyBkb25lOiB0cnVlIH07IH1cbiAgICB9O1xufVxuZnVuY3Rpb24gZ2V0SXRlcmF0b3IobGlzdCkge1xuICAgIHJldHVybiBsaXN0W1N5bWJvbC5pdGVyYXRvcl0oKTtcbn1cbmNvbnN0IE1BWF9VUkxfTEVOR1RIX0ZPUl9ERVNLVE9QX0JST1dTRSA9IDIwMjA7XG4vKipcbiAqIFZpc3VhbGl6ZXMgYSBwYXJzZSB0cmVlIHVzaW5nIGEgVVJMIHRoYXQgY2FuIGJlIHBhc3RlZCBpbnRvIHlvdXIgd2ViIGJyb3dzZXIuXG4gKiBAcGFyYW0gcGFyc2VUcmVlIHRyZWUgdG8gdmlzdWFsaXplXG4gKiBAcGFyYW0gPE5UPiB0aGUgZW51bWVyYXRpb24gb2Ygc3ltYm9scyBpbiB0aGUgcGFyc2UgdHJlZSdzIGdyYW1tYXJcbiAqIEByZXR1cm4gdXJsIHRoYXQgc2hvd3MgYSB2aXN1YWxpemF0aW9uIG9mIHRoZSBwYXJzZSB0cmVlXG4gKi9cbmZ1bmN0aW9uIHZpc3VhbGl6ZUFzVXJsKHBhcnNlVHJlZSwgbm9udGVybWluYWxzKSB7XG4gICAgY29uc3QgYmFzZSA9IFwiaHR0cDovL3dlYi5taXQuZWR1LzYuMDMxL3d3dy9wYXJzZXJsaWIvXCIgKyBwYXJzZXJsaWJfMS5WRVJTSU9OICsgXCIvdmlzdWFsaXplci5odG1sXCI7XG4gICAgY29uc3QgY29kZSA9IGV4cHJlc3Npb25Gb3JEaXNwbGF5KHBhcnNlVHJlZSwgbm9udGVybWluYWxzKTtcbiAgICBjb25zdCB1cmwgPSBiYXNlICsgJz9jb2RlPScgKyBmaXhlZEVuY29kZVVSSUNvbXBvbmVudChjb2RlKTtcbiAgICBpZiAodXJsLmxlbmd0aCA+IE1BWF9VUkxfTEVOR1RIX0ZPUl9ERVNLVE9QX0JST1dTRSkge1xuICAgICAgICAvLyBkaXNwbGF5IGFsdGVybmF0ZSBpbnN0cnVjdGlvbnMgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgY29uc29sZS5lcnJvcignVmlzdWFsaXphdGlvbiBVUkwgaXMgdG9vIGxvbmcgZm9yIHdlYiBicm93c2VyIGFuZC9vciB3ZWIgc2VydmVyLlxcbidcbiAgICAgICAgICAgICsgJ0luc3RlYWQsIGdvIHRvICcgKyBiYXNlICsgJ1xcbidcbiAgICAgICAgICAgICsgJ2FuZCBjb3B5IGFuZCBwYXN0ZSB0aGlzIGNvZGUgaW50byB0aGUgdGV4dGJveDpcXG4nXG4gICAgICAgICAgICArIGNvZGUpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xufVxuZXhwb3J0cy52aXN1YWxpemVBc1VybCA9IHZpc3VhbGl6ZUFzVXJsO1xuY29uc3QgdmlzdWFsaXplckh0bWxGaWxlID0gcGF0aF8xLmRlZmF1bHQucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9zcmMvdmlzdWFsaXplci5odG1sJyk7XG4vKipcbiAqIFZpc3VhbGl6ZXMgYSBwYXJzZSB0cmVlIGFzIGEgc3RyaW5nIG9mIEhUTUwgdGhhdCBjYW4gYmUgZGlzcGxheWVkIGluIGEgd2ViIGJyb3dzZXIuXG4gKiBAcGFyYW0gcGFyc2VUcmVlIHRyZWUgdG8gdmlzdWFsaXplXG4gKiBAcGFyYW0gPE5UPiB0aGUgZW51bWVyYXRpb24gb2Ygc3ltYm9scyBpbiB0aGUgcGFyc2UgdHJlZSdzIGdyYW1tYXJcbiAqIEByZXR1cm4gc3RyaW5nIG9mIEhUTUwgdGhhdCBzaG93cyBhIHZpc3VhbGl6YXRpb24gb2YgdGhlIHBhcnNlIHRyZWVcbiAqL1xuZnVuY3Rpb24gdmlzdWFsaXplQXNIdG1sKHBhcnNlVHJlZSwgbm9udGVybWluYWxzKSB7XG4gICAgY29uc3QgaHRtbCA9IGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmModmlzdWFsaXplckh0bWxGaWxlLCAndXRmOCcpO1xuICAgIGNvbnN0IGNvZGUgPSBleHByZXNzaW9uRm9yRGlzcGxheShwYXJzZVRyZWUsIG5vbnRlcm1pbmFscyk7XG4gICAgY29uc3QgcmVzdWx0ID0gaHRtbC5yZXBsYWNlKC9cXC9cXC9DT0RFSEVSRS8sIFwicmV0dXJuICdcIiArIGZpeGVkRW5jb2RlVVJJQ29tcG9uZW50KGNvZGUpICsgXCInO1wiKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy52aXN1YWxpemVBc0h0bWwgPSB2aXN1YWxpemVBc0h0bWw7XG5mdW5jdGlvbiBleHByZXNzaW9uRm9yRGlzcGxheShwYXJzZVRyZWUsIG5vbnRlcm1pbmFscykge1xuICAgIGNvbnN0IHsgbm9udGVybWluYWxUb1N0cmluZyB9ID0gKDAsIGNvbXBpbGVyXzEubWFrZU5vbnRlcm1pbmFsQ29udmVydGVycykobm9udGVybWluYWxzKTtcbiAgICByZXR1cm4gZm9yRGlzcGxheShwYXJzZVRyZWUsIFtdLCBwYXJzZVRyZWUpO1xuICAgIGZ1bmN0aW9uIGZvckRpc3BsYXkobm9kZSwgc2libGluZ3MsIHBhcmVudCkge1xuICAgICAgICBjb25zdCBuYW1lID0gbm9udGVybWluYWxUb1N0cmluZyhub2RlLm5hbWUpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBzID0gXCJuZChcIjtcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHMgKz0gXCJcXFwiXCIgKyBuYW1lICsgXCJcXFwiLG5kKFxcXCInXCIgKyBjbGVhblN0cmluZyhub2RlLnRleHQpICsgXCInXFxcIiksXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzICs9IFwiXFxcIlwiICsgbmFtZSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5hbGxDaGlsZHJlbi5zbGljZSgpOyAvLyBtYWtlIGEgY29weSBmb3Igc2hpZnRpbmdcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2hpbGQgPSBjaGlsZHJlbi5zaGlmdCgpO1xuICAgICAgICAgICAgbGV0IGNoaWxkcmVuRXhwcmVzc2lvbiA9IGZvckRpc3BsYXkoZmlyc3RDaGlsZCwgY2hpbGRyZW4sIG5vZGUpO1xuICAgICAgICAgICAgaWYgKG5vZGUuc3RhcnQgPCBmaXJzdENoaWxkLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgLy8gbm9kZSBhbmQgaXRzIGZpcnN0IGNoaWxkIGhhdmUgYSBnYXAgYmV0d2VlbiB0aGVtIHRoYXQgbXVzdCBoYXZlIGJlZW4gbWF0Y2hlZCBhcyBhIHRlcm1pbmFsXG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIHJ1bGUgZm9yIG5vZGUuICBJbnNlcnQgaXQgYXMgYSBxdW90ZWQgc3RyaW5nLlxuICAgICAgICAgICAgICAgIGNoaWxkcmVuRXhwcmVzc2lvbiA9IHByZWNlZGVCeVRlcm1pbmFsKG5vZGUudGV4dC5zdWJzdHJpbmcoMCwgZmlyc3RDaGlsZC5zdGFydCAtIG5vZGUuc3RhcnQpLCBjaGlsZHJlbkV4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcyArPSBjaGlsZHJlbkV4cHJlc3Npb24gKyBcIixcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2libGluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2libGluZyA9IHNpYmxpbmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICBsZXQgc2libGluZ0V4cHJlc3Npb24gPSBmb3JEaXNwbGF5KHNpYmxpbmcsIHNpYmxpbmdzLCBwYXJlbnQpO1xuICAgICAgICAgICAgaWYgKG5vZGUuZW5kIDwgc2libGluZy5zdGFydCkge1xuICAgICAgICAgICAgICAgIC8vIG5vZGUgYW5kIGl0cyBzaWJsaW5nIGhhdmUgYSBnYXAgYmV0d2VlbiB0aGVtIHRoYXQgbXVzdCBoYXZlIGJlZW4gbWF0Y2hlZCBhcyBhIHRlcm1pbmFsXG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIHJ1bGUgZm9yIHBhcmVudC4gIEluc2VydCBpdCBhcyBhIHF1b3RlZCBzdHJpbmcuXG4gICAgICAgICAgICAgICAgc2libGluZ0V4cHJlc3Npb24gPSBwcmVjZWRlQnlUZXJtaW5hbChwYXJlbnQudGV4dC5zdWJzdHJpbmcobm9kZS5lbmQgLSBwYXJlbnQuc3RhcnQsIHNpYmxpbmcuc3RhcnQgLSBwYXJlbnQuc3RhcnQpLCBzaWJsaW5nRXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzICs9IHNpYmxpbmdFeHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNpYmxpbmdFeHByZXNzaW9uID0gXCJ1dVwiO1xuICAgICAgICAgICAgaWYgKG5vZGUuZW5kIDwgcGFyZW50LmVuZCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZXJlJ3MgYSBnYXAgYmV0d2VlbiB0aGUgZW5kIG9mIG5vZGUgYW5kIHRoZSBlbmQgb2YgaXRzIHBhcmVudCwgd2hpY2ggbXVzdCBiZSBhIHRlcm1pbmFsIG1hdGNoZWQgYnkgcGFyZW50LlxuICAgICAgICAgICAgICAgIC8vIEluc2VydCBpdCBhcyBhIHF1b3RlZCBzdHJpbmcuXG4gICAgICAgICAgICAgICAgc2libGluZ0V4cHJlc3Npb24gPSBwcmVjZWRlQnlUZXJtaW5hbChwYXJlbnQudGV4dC5zdWJzdHJpbmcobm9kZS5lbmQgLSBwYXJlbnQuc3RhcnQpLCBzaWJsaW5nRXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzICs9IHNpYmxpbmdFeHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmlzU2tpcHBlZCkge1xuICAgICAgICAgICAgcyArPSBcIix0cnVlXCI7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSBcIilcIjtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHByZWNlZGVCeVRlcm1pbmFsKHRlcm1pbmFsLCBleHByZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBcIm5kKFxcXCInXCIgKyBjbGVhblN0cmluZyh0ZXJtaW5hbCkgKyBcIidcXFwiLCB1dSwgXCIgKyBleHByZXNzaW9uICsgXCIpXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsZWFuU3RyaW5nKHMpIHtcbiAgICAgICAgbGV0IHJ2YWx1ZSA9IHMucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpO1xuICAgICAgICBydmFsdWUgPSBydmFsdWUucmVwbGFjZSgvXCIvZywgXCJcXFxcXFxcIlwiKTtcbiAgICAgICAgcnZhbHVlID0gcnZhbHVlLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpO1xuICAgICAgICBydmFsdWUgPSBydmFsdWUucmVwbGFjZSgvXFxyL2csIFwiXFxcXHJcIik7XG4gICAgICAgIHJldHVybiBydmFsdWU7XG4gICAgfVxufVxuLy8gZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9lbmNvZGVVUklDb21wb25lbnRcbmZ1bmN0aW9uIGZpeGVkRW5jb2RlVVJJQ29tcG9uZW50KHMpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHMpLnJlcGxhY2UoL1shJygpKl0vZywgYyA9PiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZpc3VhbGl6ZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZpc3VhbGl6ZUFzSHRtbCA9IGV4cG9ydHMudmlzdWFsaXplQXNVcmwgPSBleHBvcnRzLmNvbXBpbGUgPSBleHBvcnRzLlBhcnNlRXJyb3IgPSBleHBvcnRzLlZFUlNJT04gPSB2b2lkIDA7XG5leHBvcnRzLlZFUlNJT04gPSBcIjMuMi4zXCI7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL2ludGVybmFsL3R5cGVzXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUGFyc2VFcnJvclwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZXNfMS5QYXJzZUVycm9yOyB9IH0pO1xuO1xudmFyIGNvbXBpbGVyXzEgPSByZXF1aXJlKFwiLi9pbnRlcm5hbC9jb21waWxlclwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNvbXBpbGVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbXBpbGVyXzEuY29tcGlsZTsgfSB9KTtcbnZhciB2aXN1YWxpemVyXzEgPSByZXF1aXJlKFwiLi9pbnRlcm5hbC92aXN1YWxpemVyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidmlzdWFsaXplQXNVcmxcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZpc3VhbGl6ZXJfMS52aXN1YWxpemVBc1VybDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInZpc3VhbGl6ZUFzSHRtbFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmlzdWFsaXplcl8xLnZpc3VhbGl6ZUFzSHRtbDsgfSB9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlcmxpYi5qcy5tYXAiLCIvLyAncGF0aCcgbW9kdWxlIGV4dHJhY3RlZCBmcm9tIE5vZGUuanMgdjguMTEuMSAob25seSB0aGUgcG9zaXggcGFydClcbi8vIHRyYW5zcGxpdGVkIHdpdGggQmFiZWxcblxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXNzZXJ0UGF0aChwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQYXRoIG11c3QgYmUgYSBzdHJpbmcuIFJlY2VpdmVkICcgKyBKU09OLnN0cmluZ2lmeShwYXRoKSk7XG4gIH1cbn1cblxuLy8gUmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIHdpdGggZGlyZWN0b3J5IG5hbWVzXG5mdW5jdGlvbiBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCBhbGxvd0Fib3ZlUm9vdCkge1xuICB2YXIgcmVzID0gJyc7XG4gIHZhciBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gIHZhciBsYXN0U2xhc2ggPSAtMTtcbiAgdmFyIGRvdHMgPSAwO1xuICB2YXIgY29kZTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPD0gcGF0aC5sZW5ndGg7ICsraSkge1xuICAgIGlmIChpIDwgcGF0aC5sZW5ndGgpXG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIGVsc2UgaWYgKGNvZGUgPT09IDQ3IC8qLyovKVxuICAgICAgYnJlYWs7XG4gICAgZWxzZVxuICAgICAgY29kZSA9IDQ3IC8qLyovO1xuICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgaWYgKGxhc3RTbGFzaCA9PT0gaSAtIDEgfHwgZG90cyA9PT0gMSkge1xuICAgICAgICAvLyBOT09QXG4gICAgICB9IGVsc2UgaWYgKGxhc3RTbGFzaCAhPT0gaSAtIDEgJiYgZG90cyA9PT0gMikge1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA8IDIgfHwgbGFzdFNlZ21lbnRMZW5ndGggIT09IDIgfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDEpICE9PSA0NiAvKi4qLyB8fCByZXMuY2hhckNvZGVBdChyZXMubGVuZ3RoIC0gMikgIT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFNsYXNoSW5kZXggPSByZXMubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCAhPT0gcmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgaWYgKGxhc3RTbGFzaEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlcyA9ICcnO1xuICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXMgPSByZXMuc2xpY2UoMCwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gcmVzLmxlbmd0aCAtIDEgLSByZXMubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID09PSAyIHx8IHJlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJlcyA9ICcnO1xuICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICAgICAgICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgICAgICAgIGRvdHMgPSAwO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJlcyArPSAnLy4uJztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXMgPSAnLi4nO1xuICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKVxuICAgICAgICAgIHJlcyArPSAnLycgKyBwYXRoLnNsaWNlKGxhc3RTbGFzaCArIDEsIGkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVzID0gcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSBpIC0gbGFzdFNsYXNoIC0gMTtcbiAgICAgIH1cbiAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICBkb3RzID0gMDtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDQ2IC8qLiovICYmIGRvdHMgIT09IC0xKSB7XG4gICAgICArK2RvdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvdHMgPSAtMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gX2Zvcm1hdChzZXAsIHBhdGhPYmplY3QpIHtcbiAgdmFyIGRpciA9IHBhdGhPYmplY3QuZGlyIHx8IHBhdGhPYmplY3Qucm9vdDtcbiAgdmFyIGJhc2UgPSBwYXRoT2JqZWN0LmJhc2UgfHwgKHBhdGhPYmplY3QubmFtZSB8fCAnJykgKyAocGF0aE9iamVjdC5leHQgfHwgJycpO1xuICBpZiAoIWRpcikge1xuICAgIHJldHVybiBiYXNlO1xuICB9XG4gIGlmIChkaXIgPT09IHBhdGhPYmplY3Qucm9vdCkge1xuICAgIHJldHVybiBkaXIgKyBiYXNlO1xuICB9XG4gIHJldHVybiBkaXIgKyBzZXAgKyBiYXNlO1xufVxuXG52YXIgcG9zaXggPSB7XG4gIC8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSgpIHtcbiAgICB2YXIgcmVzb2x2ZWRQYXRoID0gJyc7XG4gICAgdmFyIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcbiAgICB2YXIgY3dkO1xuXG4gICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICAgIHZhciBwYXRoO1xuICAgICAgaWYgKGkgPj0gMClcbiAgICAgICAgcGF0aCA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoY3dkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgY3dkID0gcHJvY2Vzcy5jd2QoKTtcbiAgICAgICAgcGF0aCA9IGN3ZDtcbiAgICAgIH1cblxuICAgICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgICAgLy8gU2tpcCBlbXB0eSBlbnRyaWVzXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQ29kZUF0KDApID09PSA0NyAvKi8qLztcbiAgICB9XG5cbiAgICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVTdHJpbmdQb3NpeChyZXNvbHZlZFBhdGgsICFyZXNvbHZlZEFic29sdXRlKTtcblxuICAgIGlmIChyZXNvbHZlZEFic29sdXRlKSB7XG4gICAgICBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApXG4gICAgICAgIHJldHVybiAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnLyc7XG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZFBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVkUGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcuJztcbiAgICB9XG4gIH0sXG5cbiAgbm9ybWFsaXplOiBmdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG5cbiAgICB2YXIgaXNBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gICAgdmFyIHRyYWlsaW5nU2VwYXJhdG9yID0gcGF0aC5jaGFyQ29kZUF0KHBhdGgubGVuZ3RoIC0gMSkgPT09IDQ3IC8qLyovO1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcGF0aCA9IG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHBhdGgsICFpc0Fic29sdXRlKTtcblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCAmJiAhaXNBYnNvbHV0ZSkgcGF0aCA9ICcuJztcbiAgICBpZiAocGF0aC5sZW5ndGggPiAwICYmIHRyYWlsaW5nU2VwYXJhdG9yKSBwYXRoICs9ICcvJztcblxuICAgIGlmIChpc0Fic29sdXRlKSByZXR1cm4gJy8nICsgcGF0aDtcbiAgICByZXR1cm4gcGF0aDtcbiAgfSxcblxuICBpc0Fic29sdXRlOiBmdW5jdGlvbiBpc0Fic29sdXRlKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuICAgIHJldHVybiBwYXRoLmxlbmd0aCA+IDAgJiYgcGF0aC5jaGFyQ29kZUF0KDApID09PSA0NyAvKi8qLztcbiAgfSxcblxuICBqb2luOiBmdW5jdGlvbiBqb2luKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuICcuJztcbiAgICB2YXIgam9pbmVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuICAgICAgYXNzZXJ0UGF0aChhcmcpO1xuICAgICAgaWYgKGFyZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChqb2luZWQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICBqb2luZWQgPSBhcmc7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBqb2luZWQgKz0gJy8nICsgYXJnO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoam9pbmVkID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gJy4nO1xuICAgIHJldHVybiBwb3NpeC5ub3JtYWxpemUoam9pbmVkKTtcbiAgfSxcblxuICByZWxhdGl2ZTogZnVuY3Rpb24gcmVsYXRpdmUoZnJvbSwgdG8pIHtcbiAgICBhc3NlcnRQYXRoKGZyb20pO1xuICAgIGFzc2VydFBhdGgodG8pO1xuXG4gICAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gJyc7XG5cbiAgICBmcm9tID0gcG9zaXgucmVzb2x2ZShmcm9tKTtcbiAgICB0byA9IHBvc2l4LnJlc29sdmUodG8pO1xuXG4gICAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gJyc7XG5cbiAgICAvLyBUcmltIGFueSBsZWFkaW5nIGJhY2tzbGFzaGVzXG4gICAgdmFyIGZyb21TdGFydCA9IDE7XG4gICAgZm9yICg7IGZyb21TdGFydCA8IGZyb20ubGVuZ3RoOyArK2Zyb21TdGFydCkge1xuICAgICAgaWYgKGZyb20uY2hhckNvZGVBdChmcm9tU3RhcnQpICE9PSA0NyAvKi8qLylcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHZhciBmcm9tRW5kID0gZnJvbS5sZW5ndGg7XG4gICAgdmFyIGZyb21MZW4gPSBmcm9tRW5kIC0gZnJvbVN0YXJ0O1xuXG4gICAgLy8gVHJpbSBhbnkgbGVhZGluZyBiYWNrc2xhc2hlc1xuICAgIHZhciB0b1N0YXJ0ID0gMTtcbiAgICBmb3IgKDsgdG9TdGFydCA8IHRvLmxlbmd0aDsgKyt0b1N0YXJ0KSB7XG4gICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0KSAhPT0gNDcgLyovKi8pXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgdG9FbmQgPSB0by5sZW5ndGg7XG4gICAgdmFyIHRvTGVuID0gdG9FbmQgLSB0b1N0YXJ0O1xuXG4gICAgLy8gQ29tcGFyZSBwYXRocyB0byBmaW5kIHRoZSBsb25nZXN0IGNvbW1vbiBwYXRoIGZyb20gcm9vdFxuICAgIHZhciBsZW5ndGggPSBmcm9tTGVuIDwgdG9MZW4gPyBmcm9tTGVuIDogdG9MZW47XG4gICAgdmFyIGxhc3RDb21tb25TZXAgPSAtMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgZm9yICg7IGkgPD0gbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChpID09PSBsZW5ndGgpIHtcbiAgICAgICAgaWYgKHRvTGVuID4gbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYGZyb21gIGlzIHRoZSBleGFjdCBiYXNlIHBhdGggZm9yIGB0b2AuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvby9iYXInOyB0bz0nL2Zvby9iYXIvYmF6J1xuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpICsgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgZnJvbWAgaXMgdGhlIHJvb3RcbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvJzsgdG89Jy9mb28nXG4gICAgICAgICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmcm9tTGVuID4gbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGZyb20uY2hhckNvZGVBdChmcm9tU3RhcnQgKyBpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIGV4YWN0IGJhc2UgcGF0aCBmb3IgYGZyb21gLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyL2Jheic7IHRvPScvZm9vL2JhcidcbiAgICAgICAgICAgIGxhc3RDb21tb25TZXAgPSBpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYHRvYCBpcyB0aGUgcm9vdC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vJzsgdG89Jy8nXG4gICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB2YXIgZnJvbUNvZGUgPSBmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSk7XG4gICAgICB2YXIgdG9Db2RlID0gdG8uY2hhckNvZGVBdCh0b1N0YXJ0ICsgaSk7XG4gICAgICBpZiAoZnJvbUNvZGUgIT09IHRvQ29kZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBlbHNlIGlmIChmcm9tQ29kZSA9PT0gNDcgLyovKi8pXG4gICAgICAgIGxhc3RDb21tb25TZXAgPSBpO1xuICAgIH1cblxuICAgIHZhciBvdXQgPSAnJztcbiAgICAvLyBHZW5lcmF0ZSB0aGUgcmVsYXRpdmUgcGF0aCBiYXNlZCBvbiB0aGUgcGF0aCBkaWZmZXJlbmNlIGJldHdlZW4gYHRvYFxuICAgIC8vIGFuZCBgZnJvbWBcbiAgICBmb3IgKGkgPSBmcm9tU3RhcnQgKyBsYXN0Q29tbW9uU2VwICsgMTsgaSA8PSBmcm9tRW5kOyArK2kpIHtcbiAgICAgIGlmIChpID09PSBmcm9tRW5kIHx8IGZyb20uY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgICAgb3V0ICs9ICcuLic7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvdXQgKz0gJy8uLic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGFzdGx5LCBhcHBlbmQgdGhlIHJlc3Qgb2YgdGhlIGRlc3RpbmF0aW9uIChgdG9gKSBwYXRoIHRoYXQgY29tZXMgYWZ0ZXJcbiAgICAvLyB0aGUgY29tbW9uIHBhdGggcGFydHNcbiAgICBpZiAob3V0Lmxlbmd0aCA+IDApXG4gICAgICByZXR1cm4gb3V0ICsgdG8uc2xpY2UodG9TdGFydCArIGxhc3RDb21tb25TZXApO1xuICAgIGVsc2Uge1xuICAgICAgdG9TdGFydCArPSBsYXN0Q29tbW9uU2VwO1xuICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCkgPT09IDQ3IC8qLyovKVxuICAgICAgICArK3RvU3RhcnQ7XG4gICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCk7XG4gICAgfVxuICB9LFxuXG4gIF9tYWtlTG9uZzogZnVuY3Rpb24gX21ha2VMb25nKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aDtcbiAgfSxcblxuICBkaXJuYW1lOiBmdW5jdGlvbiBkaXJuYW1lKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcbiAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvclxuICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZW5kID09PSAtMSkgcmV0dXJuIGhhc1Jvb3QgPyAnLycgOiAnLic7XG4gICAgaWYgKGhhc1Jvb3QgJiYgZW5kID09PSAxKSByZXR1cm4gJy8vJztcbiAgICByZXR1cm4gcGF0aC5zbGljZSgwLCBlbmQpO1xuICB9LFxuXG4gIGJhc2VuYW1lOiBmdW5jdGlvbiBiYXNlbmFtZShwYXRoLCBleHQpIHtcbiAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGV4dCAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZXh0XCIgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICB2YXIgaTtcblxuICAgIGlmIChleHQgIT09IHVuZGVmaW5lZCAmJiBleHQubGVuZ3RoID4gMCAmJiBleHQubGVuZ3RoIDw9IHBhdGgubGVuZ3RoKSB7XG4gICAgICBpZiAoZXh0Lmxlbmd0aCA9PT0gcGF0aC5sZW5ndGggJiYgZXh0ID09PSBwYXRoKSByZXR1cm4gJyc7XG4gICAgICB2YXIgZXh0SWR4ID0gZXh0Lmxlbmd0aCAtIDE7XG4gICAgICB2YXIgZmlyc3ROb25TbGFzaEVuZCA9IC0xO1xuICAgICAgZm9yIChpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChmaXJzdE5vblNsYXNoRW5kID09PSAtMSkge1xuICAgICAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIHJlbWVtYmVyIHRoaXMgaW5kZXggaW4gY2FzZVxuICAgICAgICAgICAgLy8gd2UgbmVlZCBpdCBpZiB0aGUgZXh0ZW5zaW9uIGVuZHMgdXAgbm90IG1hdGNoaW5nXG4gICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgICAgIGZpcnN0Tm9uU2xhc2hFbmQgPSBpICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV4dElkeCA+PSAwKSB7XG4gICAgICAgICAgICAvLyBUcnkgdG8gbWF0Y2ggdGhlIGV4cGxpY2l0IGV4dGVuc2lvblxuICAgICAgICAgICAgaWYgKGNvZGUgPT09IGV4dC5jaGFyQ29kZUF0KGV4dElkeCkpIHtcbiAgICAgICAgICAgICAgaWYgKC0tZXh0SWR4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIG1hdGNoZWQgdGhlIGV4dGVuc2lvbiwgc28gbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyIHBhdGhcbiAgICAgICAgICAgICAgICAvLyBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBFeHRlbnNpb24gZG9lcyBub3QgbWF0Y2gsIHNvIG91ciByZXN1bHQgaXMgdGhlIGVudGlyZSBwYXRoXG4gICAgICAgICAgICAgIC8vIGNvbXBvbmVudFxuICAgICAgICAgICAgICBleHRJZHggPSAtMTtcbiAgICAgICAgICAgICAgZW5kID0gZmlyc3ROb25TbGFzaEVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXJ0ID09PSBlbmQpIGVuZCA9IGZpcnN0Tm9uU2xhc2hFbmQ7ZWxzZSBpZiAoZW5kID09PSAtMSkgZW5kID0gcGF0aC5sZW5ndGg7XG4gICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBpZiAocGF0aC5jaGFyQ29kZUF0KGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAgIC8vIHBhdGggY29tcG9uZW50XG4gICAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgICAgZW5kID0gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiAnJztcbiAgICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgfSxcblxuICBleHRuYW1lOiBmdW5jdGlvbiBleHRuYW1lKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuICAgIHZhciBzdGFydERvdCA9IC0xO1xuICAgIHZhciBzdGFydFBhcnQgPSAwO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuICAgIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAgIC8vIGV4dGVuc2lvblxuICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgZW5kID0gaSArIDE7XG4gICAgICB9XG4gICAgICBpZiAoY29kZSA9PT0gNDYgLyouKi8pIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKVxuICAgICAgICAgICAgc3RhcnREb3QgPSBpO1xuICAgICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxuICAgICAgICAgICAgcHJlRG90U3RhdGUgPSAxO1xuICAgICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cbiAgICAgICAgcHJlRG90U3RhdGUgPSAtMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhcnREb3QgPT09IC0xIHx8IGVuZCA9PT0gLTEgfHxcbiAgICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICAgICAgcHJlRG90U3RhdGUgPT09IDAgfHxcbiAgICAgICAgLy8gVGhlIChyaWdodC1tb3N0KSB0cmltbWVkIHBhdGggY29tcG9uZW50IGlzIGV4YWN0bHkgJy4uJ1xuICAgICAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbiAgfSxcblxuICBmb3JtYXQ6IGZ1bmN0aW9uIGZvcm1hdChwYXRoT2JqZWN0KSB7XG4gICAgaWYgKHBhdGhPYmplY3QgPT09IG51bGwgfHwgdHlwZW9mIHBhdGhPYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJwYXRoT2JqZWN0XCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHBhdGhPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gX2Zvcm1hdCgnLycsIHBhdGhPYmplY3QpO1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbiBwYXJzZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgIHZhciByZXQgPSB7IHJvb3Q6ICcnLCBkaXI6ICcnLCBiYXNlOiAnJywgZXh0OiAnJywgbmFtZTogJycgfTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiByZXQ7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIGlzQWJzb2x1dGUgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgICB2YXIgc3RhcnQ7XG4gICAgaWYgKGlzQWJzb2x1dGUpIHtcbiAgICAgIHJldC5yb290ID0gJy8nO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydERvdCA9IC0xO1xuICAgIHZhciBzdGFydFBhcnQgPSAwO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICB2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTtcblxuICAgIC8vIFRyYWNrIHRoZSBzdGF0ZSBvZiBjaGFyYWN0ZXJzIChpZiBhbnkpIHdlIHNlZSBiZWZvcmUgb3VyIGZpcnN0IGRvdCBhbmRcbiAgICAvLyBhZnRlciBhbnkgcGF0aCBzZXBhcmF0b3Igd2UgZmluZFxuICAgIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG5cbiAgICAvLyBHZXQgbm9uLWRpciBpbmZvXG4gICAgZm9yICg7IGkgPj0gc3RhcnQ7IC0taSkge1xuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAgIC8vIGV4dGVuc2lvblxuICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgZW5kID0gaSArIDE7XG4gICAgICB9XG4gICAgICBpZiAoY29kZSA9PT0gNDYgLyouKi8pIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKSBzdGFydERvdCA9IGk7ZWxzZSBpZiAocHJlRG90U3RhdGUgIT09IDEpIHByZURvdFN0YXRlID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cbiAgICAgICAgcHJlRG90U3RhdGUgPSAtMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhcnREb3QgPT09IC0xIHx8IGVuZCA9PT0gLTEgfHxcbiAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxuICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgLy8gVGhlIChyaWdodC1tb3N0KSB0cmltbWVkIHBhdGggY29tcG9uZW50IGlzIGV4YWN0bHkgJy4uJ1xuICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XG4gICAgICBpZiAoZW5kICE9PSAtMSkge1xuICAgICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHJldC5iYXNlID0gcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIGVuZCk7ZWxzZSByZXQuYmFzZSA9IHJldC5uYW1lID0gcGF0aC5zbGljZShzdGFydFBhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydFBhcnQgPT09IDAgJiYgaXNBYnNvbHV0ZSkge1xuICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2UoMSwgc3RhcnREb3QpO1xuICAgICAgICByZXQuYmFzZSA9IHBhdGguc2xpY2UoMSwgZW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldC5uYW1lID0gcGF0aC5zbGljZShzdGFydFBhcnQsIHN0YXJ0RG90KTtcbiAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKHN0YXJ0UGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICAgIHJldC5leHQgPSBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xuICAgIH1cblxuICAgIGlmIChzdGFydFBhcnQgPiAwKSByZXQuZGlyID0gcGF0aC5zbGljZSgwLCBzdGFydFBhcnQgLSAxKTtlbHNlIGlmIChpc0Fic29sdXRlKSByZXQuZGlyID0gJy8nO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSxcblxuICBzZXA6ICcvJyxcbiAgZGVsaW1pdGVyOiAnOicsXG4gIHdpbjMyOiBudWxsLFxuICBwb3NpeDogbnVsbFxufTtcblxucG9zaXgucG9zaXggPSBwb3NpeDtcblxubW9kdWxlLmV4cG9ydHMgPSBwb3NpeDtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgeyBQdXp6bGUsIENlbGwsIFJlZ2lvbiwgTWFyaywgUHV6emxlU3RhdHVzLCBtYWtlQ2VsbCwgbWFrZVB1enpsZSwgbWFrZVJlZ2lvbn0gZnJvbSAnLi9QdXp6bGUnO1xuaW1wb3J0IHsgUGFyc2VyLCBQYXJzZVRyZWUsIGNvbXBpbGUsIHZpc3VhbGl6ZUFzVXJsIH0gZnJvbSAncGFyc2VybGliJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbi8qKlxuICogIGJsYW5rR3JhbW1hciBkZXNjcmlwdGlvbjpcbiAqIHB1enpsZSBpcyB0aGUgc2l6ZSBmb2xsb3dlZCBieSB0aGUgcmVnaW9uc1xuICogc2l6ZSB3aWxsIGFsd2F5cyBiZSAxMHgxMFxuICogcmVnaW9ucyBpcyByZWdpb24gZm9sbG93ZWQgYnkgb25lIG9yIG1vcmUgcmVnaW9uXG4gKiByZWdpb24gY29ycmVzcG9uZHMgdG8gQ29vcmRpbmF0ZXMgKyBcIlxcblwiXG4gKiBDb29yZGluYXRlcyBpcyBvbmUgb3IgbW9yZSBjb29yZHNcbiAqIGNvb3JkIGlzIHR3byBpbnRzIHNlcGFyYXRlZCBieSBhIFwiLFwiXG4gKi9cbmNvbnN0IGJsYW5rR3JhbW1hcjogc3RyaW5nID0gYFxuQHNraXAgd2hpdGVzcGFjZSB7XG4gICAgcHV6emxlIDo6PSBjb21tZW50cyogc2l6ZSBbXFxcXG5dKyByZWdpb24rO1xuICAgIHNpemUgOjo9IG51bWJlciAneCcgbnVtYmVyO1xuICAgIHJlZ2lvbiA6Oj0gJ3wnIChjZWxsKSsgW1xcXFxuXSs7XG4gICAgY2VsbCA6Oj0gbnVtYmVyICcsJyBudW1iZXI7XG4gICAgY29tbWVudHMgOjo9ICcjJyBbXFxcXFNdKiBbXFxcXG5dO1xufVxud2hpdGVzcGFjZSA6Oj0gWyBcXFxcdFxcXFxyXSs7XG5udW1iZXIgOjo9IFswLTldKztcbmA7XG5cbi8qKlxuICogIHNvbHZlZEdyYW1tYXIgZGVzY3JpcHRpb25cbiAqIHB1enpsZSBpcyB0aGUgc2l6ZSBmb2xsb3dlZCBieSB0aGUgcmVnaW9uc1xuICogc2l6ZSB3aWxsIGFsd2F5cyBiZSAxMHgxMFxuICogcmVnaW9ucyBpcyByZWdpb24gZm9sbG93ZWQgYnkgb25lIG9yIG1vcmUgcmVnaW9uXG4gKiByZWdpb24gY29ycmVzcG9uZHMgdG8gc3RhckNvb3JkcyBhbmQgcmVtYWluaW5nQ29vcmRpbmF0ZXMgc2VwYXJhdGVkIGJ5IHxcbiAqIHN0YXJDb29yZHMgaXMgc3VwcG9zZWQgdG8gb25seSBiZSAyIGNvb3JkXG4gKiByZW1haW5pbmdDb29yZGluYXRlcyBpcyBvbmUgb3IgbW9yZSBjb29yZFxuICogY29vcmQgaXMgdHdvIGludHMgc2VwYXJhdGVkIGJ5IGEgXCIsXCJcbiAqL1xuXG5jb25zdCBzb2x2ZWRHcmFtbWFyOiBzdHJpbmcgPSBgXG5Ac2tpcCB3aGl0ZXNwYWNlIHtcbiAgICBwdXp6bGUgOjo9IGNvbW1lbnRzKiBzaXplIFtcXFxcbl0rIChyZWdpb24pKztcbiAgICBzaXplIDo6PSBudW1iZXIgJ3gnIG51bWJlcjtcbiAgICByZWdpb24gOjo9IHNvbHV0aW9uICd8JyBibG9jaztcbiAgICBjZWxsIDo6PSBudW1iZXIgJywnIG51bWJlcjtcbiAgICBzb2x1dGlvbiA6Oj0gY2VsbHsyfTtcbiAgICBibG9jayA6Oj0gKGNlbGwpKyBbXFxcXG5dKztcbiAgICBjb21tZW50cyA6Oj0gJyMnIFtcXFxcU10qIFtcXFxcbl07XG59XG53aGl0ZXNwYWNlIDo6PSBbIFxcXFx0XFxcXHJdKztcbm51bWJlciA6Oj0gWzAtOV0rO1xuYDtcblxuLy8gdGhlIG5vbnRlcm1pbmFscyBvZiB0aGUgZ3JhbW1hclxuZXhwb3J0IGVudW0gUHV6emxlR3JhbW1hciB7IFB1enpsZSwgU2l6ZSwgUmVnaW9uLCBDZWxsLCBOdW1iZXIsIFNvbHV0aW9uLCBXaGl0ZXNwYWNlLCBCbG9jaywgQ29tbWVudHN9XG5cbi8vIGNvbXBpbGUgdGhlIGdyYW1tYXIgZm9yIGFuIGVtcHR5IHB1enpsZSBpbnRvIGEgcGFyc2VyXG5leHBvcnQgY29uc3QgZW1wdHlQYXJzZXI6IFBhcnNlcjxQdXp6bGVHcmFtbWFyPiA9IGNvbXBpbGUoYmxhbmtHcmFtbWFyLCBQdXp6bGVHcmFtbWFyLCBQdXp6bGVHcmFtbWFyLlB1enpsZSk7XG5cblxuLy8gY29tcGlsZSB0aGUgZ3JhbW1hciBmb3IgYW4gZW1wdHkgcHV6emxlIGludG8gYSBwYXJzZXJcbmV4cG9ydCBjb25zdCBzb2x2ZWRQYXJzZXI6IFBhcnNlcjxQdXp6bGVHcmFtbWFyPiA9IGNvbXBpbGUoc29sdmVkR3JhbW1hciwgUHV6emxlR3JhbW1hciwgUHV6emxlR3JhbW1hci5QdXp6bGUpO1xuXG5cbi8qKlxuICogTG9hZCB0aGUgc3RyaW5nIGZyb20gYSBmaWxlIGdpdmVuIHRoZSBmaWxlTmFtZSBvZiB0aGF0IGZpbGVcbiAqIEBwYXJhbSBmaWxlTmFtZSwgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBuYW1lIG9mIHRoYXQgZmlsZVxuICogQHJldHVybnMsIChhIHByb21pc2UgZm9yKSB0aGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIHB1enpsZSAoZW1wdHkgb3Igc29sdmVkKVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEZpbGUoZmlsZU5hbWUgOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBmaWxlID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUoZmlsZU5hbWUsIHtlbmNvZGluZzogJ3V0Zi04J30pO1xuICAgIHJldHVybiBmaWxlO1xufVxuXG4vKipcbiAqIFBhcnNlIGEgc3RyaW5nIGludG8gYW4gZXhwcmVzc2lvbi5cbiAqIFxuICogQHBhcmFtIGlucHV0IHN0cmluZyB0byBwYXJzZVxuICogQHJldHVybnMgRXhwcmVzc2lvbiBwYXJzZWQgZnJvbSB0aGUgc3RyaW5nXG4gKiBAdGhyb3dzIFBhcnNlRXJyb3IgaWYgdGhlIHN0cmluZyBkb2Vzbid0IG1hdGNoIHRoZSBFeHByZXNzaW9uIGdyYW1tYXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5UHV6emxlUGFyc2VyKGlucHV0OiBzdHJpbmcpOiBQdXp6bGUge1xuICAgIC8vIHBhcnNlIHRoZSBleGFtcGxlIGludG8gYSBwYXJzZSB0cmVlXG4gICAgY29uc3QgcGFyc2VUcmVlOiBQYXJzZVRyZWU8UHV6emxlR3JhbW1hcj4gPSBlbXB0eVBhcnNlci5wYXJzZShpbnB1dCk7XG5cbiAgICAvLyBkaXNwbGF5IHRoZSBwYXJzZSB0cmVlIGluIHZhcmlvdXMgd2F5cywgZm9yIGRlYnVnZ2luZyBvbmx5XG4gICAgLy8gY29uc29sZS5sb2coXCJwYXJzZSB0cmVlOlxcblwiICsgcGFyc2VUcmVlKTtcbiAgICAvLyBjb25zb2xlLmxvZyh2aXN1YWxpemVBc1VybChwYXJzZVRyZWUsIFB1enpsZUdyYW1tYXIpKTtcblxuICAgIC8vIG1ha2UgYW4gQVNUIGZyb20gdGhlIHBhcnNlIHRyZWVcbiAgICBjb25zdCBlbXB0eVB1enpsZTogUHV6emxlID0gbWFrZUFic3RyYWN0U3ludGF4VHJlZUZvckVtcHR5KHBhcnNlVHJlZSk7XG4gICAgLy8gY29uc29sZS5sb2coXCJhYnN0cmFjdCBzeW50YXggdHJlZTpcXG5cIiArIGVtcHR5UHV6emxlKTtcbiAgICByZXR1cm4gZW1wdHlQdXp6bGU7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHBhcnNlIHRyZWUgaW50byBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbiAqIFxuICogQHBhcmFtIHBhcnNlVHJlZSBjb25zdHJ1Y3RlZCBhY2NvcmRpbmcgdG8gdGhlIGdyYW1tYXIgZm9yIGltYWdlIG1lbWUgZXhwcmVzc2lvbnNcbiAqIEByZXR1cm5zIGFic3RyYWN0IHN5bnRheCB0cmVlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHBhcnNlVHJlZVxuICovXG5mdW5jdGlvbiBtYWtlQWJzdHJhY3RTeW50YXhUcmVlRm9yRW1wdHkocGFyc2VUcmVlOiBQYXJzZVRyZWU8UHV6emxlR3JhbW1hcj4pOiBQdXp6bGUge1xuICAgIGNvbnN0IHJlZ2lvbnMgPSBuZXcgQXJyYXkoKTsgXG4gICAgYXNzZXJ0KHBhcnNlVHJlZS5jaGlsZHJlbkJ5TmFtZShQdXp6bGVHcmFtbWFyLlJlZ2lvbiksICdtaXNzaW5nIHJlZ2lvbicpO1xuICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIHBhcnNlVHJlZS5jaGlsZHJlbkJ5TmFtZShQdXp6bGVHcmFtbWFyLlJlZ2lvbikpIHtcbiAgICAgICAgY29uc3Qgc2V0Q2VsbHMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgYXNzZXJ0KHJlZ2lvbi5jaGlsZHJlbkJ5TmFtZShQdXp6bGVHcmFtbWFyLkNlbGwpLCAnbWlzc2luZyBhIGNoaWxkJyk7XG4gICAgICAgIGZvciAoY29uc3QgY2VsbCBvZiByZWdpb24uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGFzc2VydChjZWxsLmNoaWxkcmVuWzBdLCAnbWlzc2luZyBhIGNoaWxkJyk7XG4gICAgICAgICAgICBhc3NlcnQoY2VsbC5jaGlsZHJlblsxXSwgJ21pc3NpbmcgYSBjaGlsZCcpO1xuICAgICAgICAgICAgc2V0Q2VsbHMucHVzaChuZXcgQ2VsbChwYXJzZUludChjZWxsLmNoaWxkcmVuWzBdLnRleHQgKSwgcGFyc2VJbnQoY2VsbC5jaGlsZHJlblsxXS50ZXh0KSwgTWFyay5FbXB0eSkpO1xuICAgICAgICB9XG4gICAgICAgIHJlZ2lvbnMucHVzaChuZXcgUmVnaW9uKHNldENlbGxzKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHV6emxlKHJlZ2lvbnMsIFB1enpsZVN0YXR1cy5VbnNvbHZlZCk7XG59XG4vKipcbiogUGFyc2UgYSBzdHJpbmcgaW50byBhbiBleHByZXNzaW9uLlxuKiBcbiogQHBhcmFtIGlucHV0IHN0cmluZyB0byBwYXJzZVxuKiBAcmV0dXJucyBFeHByZXNzaW9uIHBhcnNlZCBmcm9tIHRoZSBzdHJpbmdcbiogQHRocm93cyBQYXJzZUVycm9yIGlmIHRoZSBzdHJpbmcgZG9lc24ndCBtYXRjaCB0aGUgRXhwcmVzc2lvbiBncmFtbWFyXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlZFB1enpsZVBhcnNlcihpbnB1dDogc3RyaW5nKTogUHV6emxlIHtcbiAgIC8vIHBhcnNlIHRoZSBleGFtcGxlIGludG8gYSBwYXJzZSB0cmVlXG4gICBjb25zdCBwYXJzZVRyZWU6IFBhcnNlVHJlZTxQdXp6bGVHcmFtbWFyPiA9IHNvbHZlZFBhcnNlci5wYXJzZShpbnB1dCk7XG5cbiAgIC8vIGRpc3BsYXkgdGhlIHBhcnNlIHRyZWUgaW4gdmFyaW91cyB3YXlzLCBmb3IgZGVidWdnaW5nIG9ubHlcbi8vICAgIGNvbnNvbGUubG9nKFwicGFyc2UgdHJlZTpcXG5cIiArIHBhcnNlVHJlZSk7XG4vLyAgICBjb25zb2xlLmxvZyh2aXN1YWxpemVBc1VybChwYXJzZVRyZWUsIFB1enpsZUdyYW1tYXIpKTtcblxuICAgLy8gbWFrZSBhbiBBU1QgZnJvbSB0aGUgcGFyc2UgdHJlZVxuICAgY29uc3Qgc29sdmVkUHV6emxlOiBQdXp6bGUgPSBtYWtlQWJzdHJhY3RTeW50YXhUcmVlRm9yU29sdmVkKHBhcnNlVHJlZSk7XG4vLyAgICBjb25zb2xlLmxvZyhcImFic3RyYWN0IHN5bnRheCB0cmVlOlxcblwiICsgc29sdmVkUHV6emxlKTtcbiAgIHJldHVybiBzb2x2ZWRQdXp6bGU7XG59XG4vKipcbiAqIENvbnZlcnQgYSBwYXJzZSB0cmVlIGludG8gYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4gKiBcbiAqIEBwYXJhbSBwYXJzZVRyZWUgY29uc3RydWN0ZWQgYWNjb3JkaW5nIHRvIHRoZSBncmFtbWFyIGZvciBpbWFnZSBtZW1lIGV4cHJlc3Npb25zXG4gKiBAcmV0dXJucyBhYnN0cmFjdCBzeW50YXggdHJlZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwYXJzZVRyZWVcbiAqL1xuZnVuY3Rpb24gbWFrZUFic3RyYWN0U3ludGF4VHJlZUZvclNvbHZlZChwYXJzZVRyZWU6IFBhcnNlVHJlZTxQdXp6bGVHcmFtbWFyPik6IFB1enpsZSB7XG4gICAgY29uc3QgcmVnaW9ucyA9IG5ldyBBcnJheSgpOyBcbiAgICBhc3NlcnQocGFyc2VUcmVlLmNoaWxkcmVuQnlOYW1lKFB1enpsZUdyYW1tYXIuUmVnaW9uKSwgJ21pc3NpbmcgcmVnaW9uJyk7XG4gICAgZm9yIChjb25zdCByZWdpb24gb2YgcGFyc2VUcmVlLmNoaWxkcmVuQnlOYW1lKFB1enpsZUdyYW1tYXIuUmVnaW9uKSkge1xuICAgICAgICBjb25zdCBzZXRDZWxscyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBhc3NlcnQocmVnaW9uLmNoaWxkcmVuWzBdLCAnbWlzc2luZyBhIGNoaWxkJyk7XG4gICAgICAgIGFzc2VydChyZWdpb24uY2hpbGRyZW5bMV0sICdtaXNzaW5nIGEgY2hpbGQnKTtcbiAgICAgICAgZm9yIChjb25zdCBzdGFyIG9mIHJlZ2lvbi5jaGlsZHJlblswXS5jaGlsZHJlbikge1xuICAgICAgICAgICAgYXNzZXJ0KHN0YXIuY2hpbGRyZW5bMF0sICdtaXNzaW5nIGEgY2hpbGQnKTtcbiAgICAgICAgICAgIGFzc2VydChzdGFyLmNoaWxkcmVuWzFdLCAnbWlzc2luZyBhIGNoaWxkJyk7XG4gICAgICAgICAgICBzZXRDZWxscy5wdXNoKG5ldyBDZWxsKHBhcnNlSW50KHN0YXIuY2hpbGRyZW5bMF0udGV4dCApLCBwYXJzZUludChzdGFyLmNoaWxkcmVuWzFdLnRleHQpLCBNYXJrLkVtcHR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBjZWxsIG9mIHJlZ2lvbi5jaGlsZHJlblsxXS5jaGlsZHJlbikge1xuICAgICAgICAgICAgYXNzZXJ0KGNlbGwuY2hpbGRyZW5bMF0sICdtaXNzaW5nIGEgY2hpbGQnKTtcbiAgICAgICAgICAgIGFzc2VydChjZWxsLmNoaWxkcmVuWzFdLCAnbWlzc2luZyBhIGNoaWxkJyk7XG4gICAgICAgICAgICBzZXRDZWxscy5wdXNoKG5ldyBDZWxsKHBhcnNlSW50KGNlbGwuY2hpbGRyZW5bMF0udGV4dCApLCBwYXJzZUludChjZWxsLmNoaWxkcmVuWzFdLnRleHQpLCBNYXJrLkVtcHR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVnaW9ucy5wdXNoKG5ldyBSZWdpb24oc2V0Q2VsbHMpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQdXp6bGUocmVnaW9ucywgUHV6emxlU3RhdHVzLkZ1bGx5U29sdmVkKTtcbn1cblxuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIGNvbnN0IGlucHV0ID0gIGAjIFRoaXMgaXMgYW4gc29sdmVkIFB1enpsZVxuICAgICMgVGhpcyBpcyBhIHNlY29uZCBjb21tZW50IHRoYXQgY29udGFpbnMgYSBsb3Qgb2YgY2hhcmFjdGVyczogMTIzNDU2Nzg4OTAhQCMkJV4mKigpXys8Pj86XCJ8fXtbXXB9XG4gICAgMTB4MTBcbiAgICAxLDIgIDEsNSAgfCAxLDEgMSwzIDEsNCAxLDYgMSw3IDEsOCAyLDEgMiwyIDIsMyAyLDQgMiw1IDIsNiAyLDggMyw1XG4gICAgMiw5ICA0LDEwIHwgMSw5IDEsMTAgMiwxMCAzLDkgMywxMCA0LDkgNSw5IDUsMTAgNiw5IDYsMTAgNywxMCA4LDEwXG4gICAgMywyICAzLDQgIHwgMywzXG4gICAgMiw3ICA0LDggIHwgMyw2IDMsNyAzLDhcbiAgICA2LDEgIDksMSAgfCAzLDEgNCwxIDQsMiA0LDMgNCw0IDUsMSA1LDIgNSwzIDYsMiA3LDEgNywyIDgsMSA4LDIgOCwzIDgsNCA4LDUgOCw2XG4gICAgNSw0ICA1LDYgIHwgNCw1IDUsNSA2LDQgNiw1IDYsNlxuICAgIDYsOCAgOCw3ICB8IDQsNiA0LDcgNSw3IDUsOCA2LDcgNyw2IDcsNyA3LDggOCw4XG4gICAgNywzICA3LDUgIHwgNiwzIDcsNCBcbiAgICA4LDkgMTAsMTAgfCA3LDkgOSw5IDksMTBcbiAgICA5LDMgIDEwLDYgfCA5LDIgOSw0IDksNSA5LDYgOSw3IDksOCAxMCwxIDEwLDIgMTAsMyAxMCw0IDEwLDUgMTAsNyAxMCw4IDEwLDlcbiAgICBgOyBcbiAgICBjb25zdCBwdXp6bGU6IFB1enpsZSA9IHNvbHZlZFB1enpsZVBhcnNlcihpbnB1dCk7XG59XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICAgIG1haW4oKTtcbn0iLCJpbXBvcnQgYXNzZXJ0IGZyb20gXCJhc3NlcnRcIjtcblxuZXhwb3J0IGVudW0gUHV6emxlU3RhdHVzIHtVbnNvbHZlZCwgRnVsbHlTb2x2ZWR9XG5leHBvcnQgZW51bSBNYXJrIHtTdGFyLCBFbXB0eX1cblxuZXhwb3J0IGNsYXNzIFB1enpsZSB7XG4gICAgLy8gRmllbGRcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlZ2lvbnMgOiBBcnJheTxSZWdpb24+O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhdHVzICA6IFB1enpsZVN0YXR1cztcblxuICAgIC8vIEFic3RyYWN0aW9uIGZ1bmN0aW9uOlxuICAgIC8vICAgQUYocHV6emxlUmVnaW9ucywgaW5wdXQpID0gYSAxMHgxMCBib2FyZCBmaWxsZWQgd2l0aCBNYXJrLlVua25vd24gYW5kIHRoYXQgYm9hcmQgaXMgZGl2aWRlZCBpbnRvIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgc2V0IG9mIGNvbnRpZ3VvdXMgcmVnaW9ucyB3aGljaCBtdXR1YWxseSBleGNsdXNpdmUgYW5kIGNvbGxlY3RpdmVseSBleGhhdXN0aXZlIHRoZSBwdXp6bGUgYm9hcmRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzID09IHVuc29sdmVkIGlmIGV2ZXJ5IGNlbGwgaXMgTWFyay5Vbmtub3duLCBwYXJ0aWFsbHkgc29sdmUgaWYgdGhlcmUgaXMgc29tZSBNYXJrLlVua25vd24sIGFuZCBmdWxseS1zb2x2ZWQgaWYgdGhlcmUgaXMgbm8gTWFyay5Vbmtub3duXG5cbiAgICAvL1JlcCBpbnZhcmlhbnQ6XG4gICAgLy8gICAxKSBlYWNoIHB1enpsZVJlZ2lvbiBtdXN0IHNhdGlzZnkgdGhlIFJJIG9mIHRoZSBSZWdpb24gY2xhc3NcbiAgICAvLyAgIDIpIHRoZSByZWdpb25zIG11c3QgYmUgbXV0dWFsbHkgZXhjbHVzaXZlIGFuZCBjb2xsZWN0aXZlbHkgZXhoYXVzdGl2ZSB0aGUgcHV6emxlIGJvYXJkXG4gICAgLy8gICAzKSBldmVyeSByZWdpb24sIHJvdywgYW5kIGNvbHVtbiBjYW5ub3QgY29udGFpbiBtb3JlIHRoYW4gdHdvIE1hcmsuU3RhciBcblxuICAgIC8vIFNhZmV0eSBmcm9tIHJlcCBleHBvc3VyZTpcbiAgICAvLyAgIC0gYWxsIGZpZWxkcyBhcmUgcHJpdmF0ZSBhbmQgcmVhZG9ubHlcbiAgICAvLyAgIC0gcHV6emxlIGlzIG11dGFibGUgbnVtYmVyW11bXSBhbmQgdGh1cyBhIGRlZmVuc2l2ZSBjb3B5IGlzIG1hZGUgYW55dGltZSBhIHNsaWNlIGlzIHJldHVybmVkIGZyb20gcHV6emxlXG4gICAgLy8gICAgIGFuZCBpbiB0aGUgY29uc3RydWN0b3JcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihyZWdpb25zOiBBcnJheTxSZWdpb24+LCBzdGF0dXM6IFB1enpsZVN0YXR1cyl7XG4gICAgICAgIHRoaXMucmVnaW9ucyA9IFsuLi5yZWdpb25zXTtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG5cbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tSZXAoKTogdm9pZCB7XG4gICAgICAgIGFzc2VydCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHJlZ2lvbnMgb2YgdGhlIHB1enpsZVxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHRoZSByZWdpb25zIG9mIHRoZSBwdXp6bGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UmVnaW9ucygpOiBBcnJheTxSZWdpb24+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaW9ucztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcm93IGRlc2lyZWQgcm93XG4gICAgICogQHJldHVybnMgYWxsIHRoZSBjZWxscyBpbiByb3cgYHJvd2BcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Um93KHJvdzogbnVtYmVyKTogQXJyYXk8Q2VsbD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpb25zLnJlZHVjZSgocm93Q2VsbHMsIHJlZ2lvbikgPT4gcm93Q2VsbHMuY29uY2F0KHJlZ2lvbi5nZXRDZWxscygpLmZpbHRlcihjZWxsID0+IGNlbGwuZ2V0Um93KCkgPT09IHJvdykpLCBuZXcgQXJyYXk8Q2VsbD4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gZGVzaXJlZCBjb2x1bW5cbiAgICAgKiBAcmV0dXJucyBhbGwgdGhlIGNlbGxzIGluIGNvbHVtbiBgY29sdW1uYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDb2x1bW4oY29sdW1uOiBudW1iZXIpOiBBcnJheTxDZWxsPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lvbnMucmVkdWNlKChjb2x1bW5DZWxscywgcmVnaW9uKSA9PiBjb2x1bW5DZWxscy5jb25jYXQocmVnaW9uLmdldENlbGxzKCkuZmlsdGVyKGNlbGwgPT4gY2VsbC5nZXRDb2x1bW4oKSA9PT0gY29sdW1uKSksIG5ldyBBcnJheTxDZWxsPik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHJvdyByb3cgb2YgY2VsbFxuICAgICAqIEBwYXJhbSBjb2x1bW4gY29sdW1uIG9mIGNlbGxcbiAgICAgKiBAcmV0dXJucyB0aGUgY2VsbCBhdCByb3cgYHJvd2AgYW5kIGNvbHVtbiBgY29sdW1uYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDZWxsKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IENlbGwge1xuICAgICAgICBpZiAocm93IDwgMSB8fCByb3cgPiB0aGlzLmdldFJlZ2lvbnMoKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLmdldFJvdyhyb3cpLmZpbHRlcihjdXJDZWxsID0+IGN1ckNlbGwuZ2V0Q29sdW1uKCkgPT09IGNvbHVtbilbMF07XG4gICAgICAgIHJldHVybiBjZWxsID8/IG1ha2VDZWxsKDEsIDEsIE1hcmsuRW1wdHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgcm93IG9mIHRoZSBzdGFyXG4gICAgICogQHBhcmFtIGNvbHVtbiBjb2x1bW4gb2YgdGhlIHN0YXIgXG4gICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBwdXp6bGUgd2l0aCBhIHN0YXIgcGxhY2VkIGF0IHRoZSBjZWxsIHdpdGggcm93IGByb3dgIGFuZCBjb2x1bW4gYGNvbHVtbmBcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkU3Rhcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBQdXp6bGUge1xuICAgICAgICBjb25zdCBjb3B5UmVnaW9ucyA9IHRoaXMuZGVlcENvcHkoWy4uLnRoaXMucmVnaW9uc10pO1xuXG4gICAgICAgIGNvbnN0IG5ld1JlZ2lvbnM6IEFycmF5PFJlZ2lvbj4gPSBbXTtcbiAgICAgICAgY29weVJlZ2lvbnMuZm9yRWFjaChyZWdpb24gPT4gbmV3UmVnaW9ucy5wdXNoKG1ha2VSZWdpb24ocmVnaW9uLmdldENlbGxzKCkubWFwKGNlbGwgPT4ge1xuICAgICAgICAgICAgaWYgKGNlbGwuZ2V0Um93KCkgPT09IHJvdyAmJiBjZWxsLmdldENvbHVtbigpID09PSBjb2x1bW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUNlbGwocm93LCBjb2x1bW4sICBNYXJrLlN0YXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpKSk7XG5cbiAgICAgICAgcmV0dXJuIG1ha2VQdXp6bGUobmV3UmVnaW9ucywgdGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSByb3cgcm93IG9mIHRoZSBzdGFyIHRvIGJlIHJlbW92ZWRcbiAgICAgKiBAcGFyYW0gY29sdW1uIGNvbHVtbiBvZiB0aGUgc3RhciB0byBiZSByZW1vdmVkXG4gICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBwdXp6bGUgd2l0aCBhIHN0YXIgcmVtb3ZlZCBhdCB0aGUgY2VsbCB3aXRoIHJvdyBgcm93YCBhbmQgY29sdW1uIGBjb2x1bW5gXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZVN0YXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogUHV6emxlIHtcbiAgICAgICAgY29uc3QgY29weVJlZ2lvbnMgPSB0aGlzLmRlZXBDb3B5KFsuLi50aGlzLnJlZ2lvbnNdKTtcblxuICAgICAgICBjb25zdCBuZXdSZWdpb25zOiBBcnJheTxSZWdpb24+ID0gW107XG4gICAgICAgIGNvcHlSZWdpb25zLmZvckVhY2gocmVnaW9uID0+IG5ld1JlZ2lvbnMucHVzaChtYWtlUmVnaW9uKHJlZ2lvbi5nZXRDZWxscygpLm1hcChjZWxsID0+IHtcbiAgICAgICAgICAgIGlmIChjZWxsLmdldFJvdygpID09PSByb3cgJiYgY2VsbC5nZXRDb2x1bW4oKSA9PT0gY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VDZWxsKHJvdywgY29sdW1uLCAgTWFyay5FbXB0eSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSkpKTtcblxuICAgICAgICByZXR1cm4gbWFrZVB1enpsZShuZXdSZWdpb25zLCB0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgcHV6emxlIGhhcyBiZWVuIHNvbHZlZCwgZmFsc2UgaWYgbm90XG4gICAgICovXG4gICAgcHVibGljIGlzU29sdmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBtaW5EaW0gPSAxO1xuICAgICAgICBjb25zdCBtYXhEaW0gPSB0aGlzLmdldFJlZ2lvbnMoKS5sZW5ndGg7XG5cbiAgICAgICAgLy8gY2hlY2sgcm93IGNvbmRpdGlvblxuICAgICAgICBmb3IobGV0IHJvdyA9IG1pbkRpbTsgcm93IDw9IG1heERpbTsgcm93KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1clJvdyA9IHRoaXMuZ2V0Um93KHJvdyk7XG4gICAgICAgICAgICBsZXQgc3RhckNvdW50ID0gMDtcbiAgICAgICAgICAgIGZvcihjb25zdCBjZWxsIG9mIGN1clJvdykge1xuICAgICAgICAgICAgICAgIGNlbGwuZ2V0TWFyaygpID09PSBNYXJrLlN0YXIgJiYgc3RhckNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzdGFyQ291bnQgIT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBjb2x1bW4gY29uZGl0aW9uXG4gICAgICAgIGZvcihsZXQgY29sdW1uID0gbWluRGltOyBjb2x1bW4gPD0gbWF4RGltOyBjb2x1bW4rKykge1xuICAgICAgICAgICAgY29uc3QgY3VyQ29sdW1uID0gdGhpcy5nZXRDb2x1bW4oY29sdW1uKTtcbiAgICAgICAgICAgIGxldCBzdGFyQ291bnQgPSAwO1xuICAgICAgICAgICAgZm9yKGNvbnN0IGNlbGwgb2YgY3VyQ29sdW1uKSB7XG4gICAgICAgICAgICAgICAgY2VsbC5nZXRNYXJrKCkgPT09IE1hcmsuU3RhciAmJiBzdGFyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN0YXJDb3VudCAhPT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHJlZ2lvbiBjb25kaXRpb25cbiAgICAgICAgZm9yKGNvbnN0IHJlZ2lvbiBvZiB0aGlzLmdldFJlZ2lvbnMoKSkge1xuICAgICAgICAgICAgbGV0IHN0YXJDb3VudCA9IDA7XG4gICAgICAgICAgICBmb3IoY29uc3QgY2VsbCBvZiByZWdpb24uZ2V0Q2VsbHMoKSkge1xuICAgICAgICAgICAgICAgIGNlbGwuZ2V0TWFyaygpID09PSBNYXJrLlN0YXIgJiYgc3RhckNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzdGFyQ291bnQgIT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBuZWlnaGJvciBjb25kaXRpb25cbiAgICAgICAgZm9yKGNvbnN0IHJlZ2lvbiBvZiB0aGlzLmdldFJlZ2lvbnMoKSkge1xuICAgICAgICAgICAgZm9yKGNvbnN0IGNlbGwgb2YgcmVnaW9uLmdldENlbGxzKCkpIHtcbiAgICAgICAgICAgICAgICBmb3IoY29uc3QgY2VsbDIgb2YgdGhpcy5nZXROZWlnaGJvcnMoY2VsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGwyLmdldE1hcmsoKSA9PT0gTWFyay5TdGFyICYmIGNlbGwuZ2V0TWFyaygpID09PSBNYXJrLlN0YXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSByZWdpb25zIHJlZ2lvbnMgdG8gYmUgY29waWVkXG4gICAgICogQHJldHVybnMgYSBkZWVwIGNvcHkgb2YgYW4gYXJyYXkgb2YgcmVnaW9uc1xuICAgICAqL1xuICAgIHB1YmxpYyBkZWVwQ29weShyZWdpb25zOiBBcnJheTxSZWdpb24+KTogQXJyYXk8UmVnaW9uPiB7XG4gICAgICAgIGNvbnN0IG5ld1JlZ2lvbnM6IEFycmF5PFJlZ2lvbj4gPSBbXTtcblxuICAgICAgICByZWdpb25zLmZvckVhY2gocmVnaW9uID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdDZWxsczogQXJyYXk8Q2VsbD4gPSBbXTtcbiAgICAgICAgICAgIHJlZ2lvbi5nZXRDZWxscygpLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Q2VsbCA9IG1ha2VDZWxsKGNlbGwuZ2V0Um93KCksIGNlbGwuZ2V0Q29sdW1uKCksIGNlbGwuZ2V0TWFyaygpKTtcbiAgICAgICAgICAgICAgICBuZXdDZWxscy5wdXNoKG5ld0NlbGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdSZWdpb25zLnB1c2gobWFrZVJlZ2lvbihuZXdDZWxscykpO1xuICAgICAgICAgICAgbmV3Q2VsbHMgPSBbXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXdSZWdpb25zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjZWxsIGNlbGwgdG8gY2hlY2sgbmVpZ2hib3JzIG9uXG4gICAgICogQHJldHVybnMgYW4gYXJyYXkgb2YgY2VsbHMgdGhhdCBhcmUgdGhlIG5laWdoYm9yaW5nIGNlbGxzIG9mIHRoZSBnaXZlbiBjZWxsXG4gICAgICovXG4gICAgcHVibGljIGdldE5laWdoYm9ycyhjZWxsOiBDZWxsKTogQXJyYXk8Q2VsbD4ge1xuICAgICAgICBjb25zdCBhYm92ZVJvdyA9IHRoaXMuZ2V0Um93KGNlbGwuZ2V0Um93KCktMSkuZmlsdGVyKGNlbGwyID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjZWxsMi5nZXRDb2x1bW4oKSA9PT0gY2VsbC5nZXRDb2x1bW4oKS0xIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGNlbGwyLmdldENvbHVtbigpID09PSBjZWxsLmdldENvbHVtbigpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGNlbGwyLmdldENvbHVtbigpID09PSBjZWxsLmdldENvbHVtbigpKzEpKTtcblxuICAgICAgICBjb25zdCBjdXJSb3cgPSB0aGlzLmdldFJvdyhjZWxsLmdldFJvdygpKS5maWx0ZXIoY2VsbDIgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNlbGwyLmdldENvbHVtbigpID09PSBjZWxsLmdldENvbHVtbigpLTEgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGNlbGwyLmdldENvbHVtbigpID09PSBjZWxsLmdldENvbHVtbigpKzEpKTtcblxuICAgICAgICBjb25zdCBiZWxvd1JvdyA9IHRoaXMuZ2V0Um93KGNlbGwuZ2V0Um93KCkrMSkuZmlsdGVyKGNlbGwyID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjZWxsMi5nZXRDb2x1bW4oKSA9PT0gY2VsbC5nZXRDb2x1bW4oKS0xIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGNlbGwyLmdldENvbHVtbigpID09PSBjZWxsLmdldENvbHVtbigpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGNlbGwyLmdldENvbHVtbigpID09PSBjZWxsLmdldENvbHVtbigpKzEpKTtcblxuICAgICAgICByZXR1cm4gYWJvdmVSb3cuY29uY2F0KGN1clJvdykuY29uY2F0KGJlbG93Um93KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgUHV6emxlXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHJlZ2lvbnMgPSB0aGlzLmdldFJlZ2lvbnMoKTtcbiAgICAgICAgY29uc3QgZGltID0gcmVnaW9ucy5sZW5ndGg7XG5cbiAgICAgICAgbGV0IHB1enpsZVN0ciA9IGAke2RpbX14JHtkaW19XFxuYDtcblxuICAgICAgICBmb3IoY29uc3QgcmVnaW9uIG9mIHJlZ2lvbnMpIHtcbiAgICAgICAgICAgIC8vIGFkZCBzdGFycyBmaXJzdFxuICAgICAgICAgICAgZm9yIChjb25zdCBjZWxsIG9mIHJlZ2lvbi5nZXRDZWxscygpKSB7XG4gICAgICAgICAgICAgICAgaWYoY2VsbC5nZXRNYXJrKCkgPT09IE1hcmsuU3Rhcikge1xuICAgICAgICAgICAgICAgICAgICBwdXp6bGVTdHIgKz0gYCR7Y2VsbC50b1N0cmluZygpfSBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNlcGFyYXRlIGJ5IHBpcGVcbiAgICAgICAgICAgIHB1enpsZVN0ciArPSAnfCAnO1xuXG4gICAgICAgICAgICAvLyBub3cgYWRkIG5vbi1zdGFyc1xuICAgICAgICAgICAgZm9yIChjb25zdCBjZWxsIG9mIHJlZ2lvbi5nZXRDZWxscygpKSB7XG4gICAgICAgICAgICAgICAgaWYoY2VsbC5nZXRNYXJrKCkgIT09IE1hcmsuU3Rhcikge1xuICAgICAgICAgICAgICAgICAgICBwdXp6bGVTdHIgKz0gYCR7Y2VsbC50b1N0cmluZygpfSBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYWRkIG5ldyBsaW5lXG4gICAgICAgICAgICBwdXp6bGVTdHIgKz0gJ1xcbic7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHV6emxlU3RyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB0aGF0IGFueSBQdXp6bGVcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGFuZCBvbmx5IGlmIHRoaXMgYW5kIHRoYXQgaGF2ZSB0aGUgc2FtZSByZWdpb25zXG4gICAgICovXG4gICAgcHVibGljIGVxdWFsVmFsdWUodGhhdDogUHV6emxlKTogYm9vbGVhbiB7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIGxlbmd0aHMgYXJlIGVxdWFsXG4gICAgICAgIGlmKHRoaXMucmVnaW9ucy5sZW5ndGggIT09IHRoYXQucmVnaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcmVnaW9uMSBvZiB0aGlzLnJlZ2lvbnMpIHtcbiAgICAgICAgICAgIGxldCBmb3VuZE1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlZ2lvbjIgb2YgdGhhdC5yZWdpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYocmVnaW9uMS5lcXVhbFZhbHVlKHJlZ2lvbjIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFmb3VuZE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCByZWdpb24xIG9mIHRoYXQucmVnaW9ucykge1xuICAgICAgICAgICAgbGV0IGZvdW5kTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVnaW9uMiBvZiB0aGlzLnJlZ2lvbnMpIHtcbiAgICAgICAgICAgICAgICBpZihyZWdpb24xLmVxdWFsVmFsdWUocmVnaW9uMikpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmRNYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIWZvdW5kTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmVnaW9uIHtcbiAgICAvL0ZpZWxkXG4gICAgcHJpdmF0ZSByZWFkb25seSBjZWxsczogQXJyYXk8Q2VsbD47XG5cbiAgICAvLyBBYnN0cmFjdGlvbiBmdW5jdGlvblxuICAgIC8vICAgQUZbY2VsbHNdID0gZ2l2ZW4gYSBzZXQgb2YgY2VsbHMsIGNyZWF0ZSBhIGNvbnRpbnVvdXMgcmVnaW9uLiBcblxuICAgIC8vIFJlcCBJbnZhcmlhbnQ6IFxuICAgIC8vICAgMSkgUmVnaW9uIG11c3QgYmUgY29udGlndW91c1xuXG4gICAgLy8gU2FmZXR5IGZyb20gcmVwIGV4cG9zdXJlOlxuICAgIC8vICAgLSBhbGwgZmllbGRzIGFyZSBwcml2YXRlIGFuZCByZWFkb25seTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihjZWxsczogQXJyYXk8Q2VsbD4pe1xuICAgICAgICB0aGlzLmNlbGxzID0gWy4uLmNlbGxzXTtcblxuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1JlcCgpOiB2b2lkIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGNvbnRpZ3VvdXN5XG4gICAgICAgIGFzc2VydCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNlbGxzIG9mIHRoZSByZWdpb25cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB0aGUgY2VsbHMgb2YgdGhlIHJlZ2lvblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDZWxscygpOiBBcnJheTxDZWxsPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSByZWdpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJlZ2lvblN0ciA9ICcnO1xuICAgICAgICB0aGlzLmNlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICByZWdpb25TdHIgKz0gYCR7Y2VsbC50b1N0cmluZygpfSBcXG5gO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVnaW9uU3RyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB0aGF0IGFueSBSZWdpb25cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGFuZCBvbmx5IGlmIHRoaXMgYW5kIHRoYXQgaGF2ZSB0aGUgc2FtZSBjZWxsc1xuICAgICAqL1xuICAgIHB1YmxpYyBlcXVhbFZhbHVlKHRoYXQ6IFJlZ2lvbik6IGJvb2xlYW4ge1xuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBsZW5ndGhzIGFyZSBlcXVhbFxuICAgICAgICBpZih0aGlzLmNlbGxzLmxlbmd0aCAhPT0gdGhhdC5jZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbXBhcmUgZWFjaCBjZWxsIFxuICAgICAgICBmb3IgKGNvbnN0IGNlbGwxIG9mIHRoaXMuY2VsbHMpIHtcbiAgICAgICAgICAgIGxldCBmb3VuZE1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNlbGwyIG9mIHRoYXQuY2VsbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbDEuZXF1YWxWYWx1ZShjZWxsMikpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmRNYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmb3VuZE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBjZWxsMSBvZiB0aGF0LmNlbGxzKSB7XG4gICAgICAgICAgICBsZXQgZm91bmRNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjZWxsMiBvZiB0aGlzLmNlbGxzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwxLmVxdWFsVmFsdWUoY2VsbDIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZm91bmRNYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgQ2VsbCB7XG4gICAgLy9GaWVsZFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm93OiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW46IG51bWJlcjsgXG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXJrOiBNYXJrO1xuXG4gICAgLy8gQWJzdHJhY3Rpb24gZnVuY3Rpb25cbiAgICAvLyAgIEFGW3JvdywgY29sdW1uLCBtYXJrXSA9IGEgY2VsbCBsb2NhdGVkIGF0IHJvdyBgcm93YCBhbmQgY29sdW1uIGBjb2x1bW5gIHdpdGggbWFyayBgbWFya2BcblxuICAgIC8vIFJlcCBJbnZhcmlhbnQ6IFxuICAgIC8vICAgMSkgMSA8PSByb3cgPD0gMTBcbiAgICAvLyAgIDIpIDEgPD0gY29sdW1uIDw9IDEwXG4gICAgLy8gICAzKSBUaGUgdmFsdWUgb2YgbWFyayBtdXN0IGJlIDAsIDEsIG9yIDJcblxuICAgIC8vIFNhZmV0eSBmcm9tIHJlcCBleHBvc3VyZTpcbiAgICAvLyAgIC0gYWxsIGZpZWxkcyBhcmUgcHJpdmF0ZSBhbmQgcmVhZG9ubHk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3Iocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBtYXJrOiBNYXJrKXtcbiAgICAgICAgdGhpcy5yb3cgPSByb3c7XG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgICAgICB0aGlzLm1hcmsgPSBtYXJrO1xuXG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrUmVwKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtaW5EaW0gPSAxO1xuICAgICAgICBjb25zdCBtYXhEaW0gPSAxMDtcbiAgICAgICAgLy8gMSA8PSByb3cgPD0gMTBcbiAgICAgICAgYXNzZXJ0KHRoaXMucm93ID49IG1pbkRpbSAmJiB0aGlzLnJvdyA8PSBtYXhEaW0pO1xuXG4gICAgICAgIC8vIDEgPD0gY29sdW1uIDw9IDEwXG4gICAgICAgIGFzc2VydCh0aGlzLmNvbHVtbiA+PSBtaW5EaW0gJiYgdGhpcy5jb2x1bW4gPD0gbWF4RGltKTtcblxuICAgICAgICAvLyBUaGUgdmFsdWUgb2YgbWFyayBtdXN0IGJlIDAgb3IgMVxuICAgICAgICBhc3NlcnQodGhpcy5tYXJrID09PSAwIHx8IHRoaXMubWFyayA9PT0gMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSByb3cgb2YgdGhlIGNlbGxcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB0aGUgcm93IG9mIHRoZSBjZWxsXG4gICAgICovXG4gICAgcHVibGljIGdldFJvdygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBjb2x1bW4gb2YgdGhlIGNlbGxcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB0aGUgY29sdW1uIG9mIHRoZSBjZWxsXG4gICAgICovXG4gICAgcHVibGljIGdldENvbHVtbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBtYXJrIG9mIHRoZSBjZWxsXG4gICAgICogXG4gICAgICogQHJldHVybnMgdGhlIG1hcmsgb2YgdGhlIGNlbGxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TWFyaygpOiBNYXJrIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFyaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2VsbCwgd2hpY2ggaW5jbHVkZXMgdGhlIGNlbGwncyByb3cgYW5kIGNvbHVtblxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5yb3d9LCR7dGhpcy5jb2x1bW59YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gdGhhdCBhbnkgQ2VsbFxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBhbmQgdGhhdCBoYXZlIHRoZSBzYW1lIHJvdyBhbmQgY29sdW1uXG4gICAgICovXG4gICAgcHVibGljIGVxdWFsVmFsdWUodGhhdDogQ2VsbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3cgPT09IHRoYXQucm93ICYmIHRoaXMuY29sdW1uID09PSB0aGF0LmNvbHVtbjsgIC8vIDw9IGNhbiB5b3UgYWRkIGlmIHRoZSBNYXJrIG9mIHRoZSB0d28gY2VsbHMgYXJlIHRoZSBzYW1lIGFzIHdlbGw/IFRoYW5rcyEgXG4gICAgfVxufVxuXG5cbi8vIEZBQ1RPUlkgRlVOQ1RJT05TIEZPUiBQVVpaTEUsIFJFR0lPTiwgQU5EIENFTExcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSByb3cgcm93IG9mIGNlbGxcbiAqIEBwYXJhbSBjb2x1bW4gY29sdW1uIG9mIGNlbGxcbiAqIEBwYXJhbSBtYXJrIG1hcmsgb2YgY2VsbFxuICogQHJldHVybnMgYSBDZWxsIHdpdGggYXJndW1lbnRzIGByb3dgLCBgY29sdW1uYCwgJ21hcmsnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlQ2VsbChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIG1hcms6IE1hcmspOiBDZWxsIHtcbiAgICByZXR1cm4gbmV3IENlbGwocm93LCBjb2x1bW4sIG1hcmspO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIGNlbGxzIGNlbGxzIG9mIHRoZSByZWdpb25cbiAqIEByZXR1cm5zIGEgUmVnaW9uIHdpdGggYXJndW1lbnRzIGBjZWxsc2BcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSZWdpb24oY2VsbHM6IEFycmF5PENlbGw+KTogUmVnaW9uIHtcbiAgICByZXR1cm4gbmV3IFJlZ2lvbihjZWxscyk7XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gcmVnaW9ucyByZWdpb25zIG9mIHRoZSBwdXp6bGVcbiAqIEBwYXJhbSBzdGF0dXMgc3RhdHVzIG9mIHRoZSBwdXp6bGVcbiAqIEByZXR1cm5zIGEgUHV6emxlIHdpdGggYXJndW1lbnRzIGByZWdpb25zYCBhbmQgYHB1enpsZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUHV6emxlKHJlZ2lvbnM6IEFycmF5PFJlZ2lvbj4sIHN0YXR1czogUHV6emxlU3RhdHVzKTogUHV6emxlIHtcbiAgICByZXR1cm4gbmV3IFB1enpsZShyZWdpb25zLCBzdGF0dXMpO1xufVxuXG5cbiIsIi8qIENvcHlyaWdodCAoYykgMjAyMS0yMyBNSVQgNi4xMDIvNi4wMzEgY291cnNlIHN0YWZmLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuICogUmVkaXN0cmlidXRpb24gb2Ygb3JpZ2luYWwgb3IgZGVyaXZlZCB3b3JrIHJlcXVpcmVzIHBlcm1pc3Npb24gb2YgY291cnNlIHN0YWZmLlxuICovXG5cbi8vIFRoaXMgY29kZSBpcyBsb2FkZWQgaW50byBzdGFyYi1jbGllbnQuaHRtbCwgc2VlIHRoZSBgbnBtIGNvbXBpbGVgIGFuZFxuLy8gICBgbnBtIHdhdGNoaWZ5LWNsaWVudGAgc2NyaXB0cy5cbi8vIFJlbWVtYmVyIHRoYXQgeW91IHdpbGwgKm5vdCogYmUgYWJsZSB0byB1c2UgTm9kZSBBUElzIGxpa2UgYGZzYCBpbiB0aGUgd2ViIGJyb3dzZXIuXG5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCB7IENlbGwsIFJlZ2lvbiwgUHV6emxlLCBQdXp6bGVTdGF0dXMsIE1hcmssIG1ha2VQdXp6bGUgfSBmcm9tICcuL1B1enpsZSc7XG5pbXBvcnQge2NlbnRlciwgZHJhd1BvaW50LCBkcmF3U3RhciwgcHJpbnRPdXRwdXQsIGRyYXdHcmlkLCByZW1vdmVTdGFyLCBjb2xvckFsbFJlZ2lvbnN9IGZyb20gJy4vZHJhd2luZ1Byb3RvdHlwZSc7XG5pbXBvcnQgeyBzb2x2ZWRQdXp6bGVQYXJzZXIsIGVtcHR5UHV6emxlUGFyc2VyfSBmcm9tICcuL1BhcnNlcic7XG5pbXBvcnQge0NsaWVudH0gZnJvbSAnLi9jbGllbnRBRFQnO1xuXG5jb25zdCBCT1hfU0laRSA9IDE2O1xuXG4vLyBjYXRlZ29yaWNhbCBjb2xvcnMgZnJvbVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2QzL2QzLXNjYWxlLWNocm9tYXRpYy90cmVlL3YyLjAuMCNzY2hlbWVDYXRlZ29yeTEwXG5jb25zdCBDT0xPUlM6IEFycmF5PHN0cmluZz4gPSBbXG4gICAgJyMxZjc3YjQnLFxuICAgICcjZmY3ZjBlJyxcbiAgICAnIzJjYTAyYycsXG4gICAgJyNkNjI3MjgnLFxuICAgICcjOTQ2N2JkJyxcbiAgICAnIzhjNTY0YicsXG4gICAgJyNlMzc3YzInLFxuICAgICcjN2Y3ZjdmJyxcbiAgICAnI2JjYmQyMicsXG4gICAgJyMxN2JlY2YnLFxuXTtcblxuLyoqXG4gKiBQdXp6bGUgdG8gcmVxdWVzdCBhbmQgcGxheS5cbiAqIFByb2plY3QgaW5zdHJ1Y3Rpb25zOiB0aGlzIGNvbnN0YW50IGlzIGEgW2ZvciBub3ddIHJlcXVpcmVtZW50IGluIHRoZSBwcm9qZWN0IHNwZWMuXG4gKi9cblxuXG5cbi8qKlxuY29uc3QgcHV6emxlUGF0aCA9IGBwdXp6bGVzL2tkLTEtMS0xLnN0YXJiYFxuY29uc3QgaW5wdXQgPSBmcy5yZWFkRmlsZVN5bmMocHV6emxlUGF0aCwgeyBlbmNvZGluZzogXCJ1dGY4XCIsIGZsYWc6IFwiclwiIH0pO1xuKi9cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gZmV0Y2ggdGhlIHB1enpsZVxuICAgIGNvbnN0IHB1enpsZU5hbWUgPSAna2QtMS0xLTEnO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODc4OS9wdXp6bGVzLyR7cHV6emxlTmFtZX1gKTtcbiAgICBjb25zdCBwdXp6bGVEYXRhID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICBjb25zdCBwdXp6bGU6IFB1enpsZSA9IGVtcHR5UHV6emxlUGFyc2VyKHB1enpsZURhdGEpO1xuICAgIGNvbnN0IGNsaWVudDogQ2xpZW50ID0gbmV3IENsaWVudChwdXp6bGUpO1xuXG4gICAgLy8gb3V0cHV0IGFyZWEgZm9yIHByaW50aW5nXG4gICAgY29uc3Qgb3V0cHV0QXJlYTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0QXJlYScpID8/IGFzc2VydC5mYWlsKCdtaXNzaW5nIG91dHB1dCBhcmVhJyk7XG4gICAgLy8gY2FudmFzIGZvciBkcmF3aW5nXG4gICAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudCA/PyBhc3NlcnQuZmFpbCgnbWlzc2luZyBkcmF3aW5nIGNhbnZhcycpO1xuICAgICAvLyBDaGFuZ2UgVyxIIHRvIGJlIGRpdmlzaWJsZSBieSAxMFxuICAgIGNhbnZhcy5oZWlnaHQgPSAyNTA7IGNhbnZhcy53aWR0aCA9IDI1MDtcblxuICAgIC8vIENvbG9yIGluIFJlZ2lvbnNcbiAgICBjb2xvckFsbFJlZ2lvbnMoKTtcbiAgICAvLyBkcmF3IGdyaWQgbGluZXMgb3ZlciB0aGUgY29sb3JzXG4gICAgZHJhd0dyaWQoY2FudmFzKTtcblxuICAgIC8vIGJ1dHRvbiBmb3IgY2hlY2tpbmcgaWYgc29sdmVkXG4gICAgY29uc3QgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGVja0J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50ID8/IGFzc2VydC5mYWlsKCdtaXNzaW5nIGNoZWNrIGJ1dHRvbicpO1xuXG4gICAgLy8gd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIGRyYXdpbmcgY2FudmFzLi4uXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlzU29sdmVkID0gY2xpZW50LmdldFB1enpsZSgpLmlzU29sdmVkKCk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBpc1NvbHZlZCA/ICdUaGUgcHV6emxlIGlzIHNvbHZlZCcgOiAnVGhlIHB1enpsZSBpcyBub3Qgc29sdmVkJztcbiAgICAgICAgcHJpbnRPdXRwdXQob3V0cHV0QXJlYSwgbWVzc2FnZSk7XG4gICAgfSk7XG5cbiAgICAvLyB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgZHJhd2luZyBjYW52YXMuLi5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGl2aXNvciA9IDI1O1xuICAgICAgICBjb25zdCBpbml0aWFsQWRkID0gMTIuNTtcbiAgICAgICAgY29uc3QgW3JvdywgY29sXSA9IFsoY2VudGVyKGV2ZW50Lm9mZnNldFkpK2luaXRpYWxBZGQpL2Rpdmlzb3IsIChjZW50ZXIoZXZlbnQub2Zmc2V0WCkraW5pdGlhbEFkZCkvZGl2aXNvcl07XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYSBzdGFyIGF0IHRoZSBjb29yZGluYXRlXG4gICAgICAgIGlmIChjbGllbnQuZ2V0UHV6emxlKCkuZ2V0Q2VsbChyb3csIGNvbCkuZ2V0TWFyaygpID09PSAxKSB7XG4gICAgICAgICAgICBjbGllbnQuYWRkU3Rhcihyb3csIGNvbCk7XG4gICAgICAgICAgICBkcmF3U3RhcihjYW52YXMsIGNlbnRlcihldmVudC5vZmZzZXRYKSwgY2VudGVyKGV2ZW50Lm9mZnNldFkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsaWVudC5yZW1vdmVTdGFyKHJvdywgY29sKTtcbiAgICAgICAgICAgIHJlbW92ZVN0YXIoY2FudmFzLCBjZW50ZXIoZXZlbnQub2Zmc2V0WCksIGNlbnRlcihldmVudC5vZmZzZXRZKSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIGRyYXdTdGFyKGNhbnZhcywgY2VudGVyKGV2ZW50Lm9mZnNldFgpLCBjZW50ZXIoZXZlbnQub2Zmc2V0WSkpO1xuICAgICAgICAvL2RyYXdQb2ludChjYW52YXMsIGNlbnRlcihldmVudC5vZmZzZXRYKSwgY2VudGVyKGV2ZW50Lm9mZnNldFkpKTtcbiAgICAgICAgLy9yZW1vdmVTdGFyKGNhbnZhcywgY2VudGVyKGV2ZW50Lm9mZnNldFgpLCBjZW50ZXIoZXZlbnQub2Zmc2V0WSkpO1xuICAgIH0pO1xuICAgIC8vIGFkZCBpbml0aWFsIGluc3RydWN0aW9ucyB0byB0aGUgb3V0cHV0IGFyZWFcbiAgICBwcmludE91dHB1dChvdXRwdXRBcmVhLCBgQ2xpY2sgb24gYSBncmlkIGNlbGwgdG8gZHJhdyBhIHN0YXIuYCk7XG59XG5cbm1haW4oKTsiLCJlbnVtIHB1enpsZVN0YXR1c3tcbiAgICBzb2x2ZWQgPSBcInNvbHZlZFwiLFxuICAgIGluUHJvZ3Jlc3MgPSBcImluUHJvZ3Jlc3NcIixcbiAgICBlbXB0eSA9ICdlbXB0eSdcbn1cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCB7IFB1enpsZSB9IGZyb20gJy4vUHV6emxlJztcbmltcG9ydCB7IGVtcHR5UHV6emxlUGFyc2VyIH0gZnJvbSAnLi9QYXJzZXInO1xuZXhwb3J0IGNsYXNzIENsaWVudCB7XG4gICAgLy8gRmllbGRzXG4gICAgcHJpdmF0ZSBwdXp6bGU6IFB1enpsZTtcbiAgICAvLyBwcml2YXRlIHNvbHZlZDogcHV6emxlU3RhdHVzO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgb3JpUHV6emxlIDogUHV6emxlO1xuXG4gICAgLy8gQWJzdHJhY3Rpb24gZnVuY3Rpb246XG4gICAgLy8gICAgICBBRihwdXp6bGUsIHNvbHZlZCkgPSBhIGNsaWVudCB0aGF0IGFsbG93cyB0aGUgdXNlciB0byBpbnRlcmFjdCB3aXRoIGEgU3RhciBCYXR0bGUgZ2FtZSBwdXp6bGVcbiAgICAvL1xuICAgIC8vIFJlcHJlc2VudGF0aW9uIGludmFyaWFudDpcbiAgICAvLyAgICAgIC0gYHB1enpsZWAgaXMgYSBQdXp6bGUgaW5zdGFuY2VcbiAgICAvLyAgICAgIC0gYHNvbHZlZGAgaXMgYSBib29sZWFuXG4gICAgLy8gICAgICBcbiAgICAvLyBTYWZldHkgZnJvbSByZXAgZXhwb3N1cmU6XG4gICAgLy8gICAgICBBbGwgZmllbGRzIGFyZSBwcml2YXRlIGFuZCBuZXZlciByZXR1cm5lZFxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCBwdXp6bGU6IFB1enpsZSl7XG4gICAgICAgIHRoaXMucHV6emxlID0gcHV6emxlO1xuICAgICAgICB0aGlzLm9yaVB1enpsZSA9IHB1enpsZTtcbiAgICAgICAgLy8gdGhpcy5wdXp6bGVTdHJpbmcgPSBwdXp6bGVTdHJpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFB1enpsZSgpOiBQdXp6bGUge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXp6bGU7XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIGFzc2VydHMgdGhlIHJlcHJlc2VudGF0aW9uIGludmFyaWFudFxuICAgICAqL1xuICAgIHB1YmxpYyBjaGVja1JlcCgpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IEltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBQdXp6bGUgQURUXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHRoaXMucHV6emxlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgaWYgdGhlIHB1enpsZSBpcyBzb2x2ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIGdldFN0YXR1cygpOiBib29sZWFue1xuICAgICAgICByZXR1cm4gdGhpcy5wdXp6bGUuaXNTb2x2ZWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcm93OiByb3cgdGhlIHN0YXIgd2lsbCBiZSBwbGFjZWRcbiAgICAgKiBAcGFyYW0gY29sOiBjb2x1bW4gdGhlIHN0YXIgd2lsbCBiZSBwbGFjZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkU3Rhcihyb3c6IG51bWJlciwgY29sOiBudW1iZXIpOiB2b2lke1xuICAgICAgICBjb25zdCBuZXdQdXp6bGUgPSB0aGlzLnB1enpsZS5hZGRTdGFyKHJvdywgY29sKTtcbiAgICAgICAgdGhpcy5wdXp6bGUgPSBuZXdQdXp6bGU7IFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSByb3c6IHJvdyB0aGUgc3RhciB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBAcGFyYW0gY29sOiBjb2x1bW4gdGhlIHN0YXIgd2lsbCBiZSByZW1vdmVkXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZVN0YXIocm93OiBudW1iZXIsIGNvbDogbnVtYmVyKTogdm9pZHtcbiAgICAgICAgY29uc3QgbmV3UHV6emxlID0gdGhpcy5wdXp6bGUucmVtb3ZlU3Rhcihyb3csIGNvbCk7XG4gICAgICAgIHRoaXMucHV6emxlID0gbmV3UHV6emxlOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucywgdm9pZCwgcmVmcmVzaCB0aGUgcHV6emxlIG9mIHRoZSBjbGllbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVmcmVzaCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wdXp6bGUgPXRoaXMub3JpUHV6emxlO1xuICAgIH1cbn07IiwiLyogQ29weXJpZ2h0IChjKSAyMDIxLTIzIE1JVCA2LjEwMi82LjAzMSBjb3Vyc2Ugc3RhZmYsIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBSZWRpc3RyaWJ1dGlvbiBvZiBvcmlnaW5hbCBvciBkZXJpdmVkIHdvcmsgcmVxdWlyZXMgcGVybWlzc2lvbiBvZiBjb3Vyc2Ugc3RhZmYuXG4gKi9cblxuLy8gVGhpcyBjb2RlIGlzIGxvYWRlZCBpbnRvIGV4YW1wbGUtcGFnZS5odG1sLCBzZWUgdGhlIGBucG0gd2F0Y2hpZnktZXhhbXBsZWAgc2NyaXB0LlxuLy8gUmVtZW1iZXIgdGhhdCB5b3Ugd2lsbCAqbm90KiBiZSBhYmxlIHRvIHVzZSBOb2RlIEFQSXMgbGlrZSBgZnNgIGluIHRoZSB3ZWIgYnJvd3Nlci5cblxuaW1wb3J0IHsgc29sdmVkUHV6emxlUGFyc2VyIH0gZnJvbSAnLi9QYXJzZXInO1xuaW1wb3J0IHsgUHV6emxlLCBSZWdpb24sIENlbGwsIE1hcmssIFB1enpsZVN0YXR1cyB9IGZyb20gJy4vUHV6emxlJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmNvbnN0IGNhbnZhc19zaXplID0gMjUwO1xuY29uc3QgbnVtQ2VsbHMgPSAxMDtcblxuLy8gY2F0ZWdvcmljYWwgY29sb3JzIGZyb21cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kMy9kMy1zY2FsZS1jaHJvbWF0aWMvdHJlZS92Mi4wLjAjc2NoZW1lQ2F0ZWdvcnkxMFxuY29uc3QgQ09MT1JTOiBBcnJheTxzdHJpbmc+ID0gW1xuICAgICcjMWY3N2I0JyxcbiAgICAnI2ZmN2YwZScsXG4gICAgJyMyY2EwMmMnLFxuICAgICcjZDYyNzI4JyxcbiAgICAnIzk0NjdiZCcsXG4gICAgJyM4YzU2NGInLFxuICAgICcjZTM3N2MyJyxcbiAgICAnIzdmN2Y3ZicsXG4gICAgJyNiY2JkMjInLFxuICAgICcjMTdiZWNmJyxcbl07XG5cbmNvbnN0IGlucHV0ID0gIGAjIFRoaXMgaXMgYW4gc29sdmVkIFB1enpsZVxuIyBUaGlzIGlzIGEgc2Vjb25kIGNvbW1lbnQgdGhhdCBjb250YWlucyBhIGxvdCBvZiBjaGFyYWN0ZXJzOiAxMjM0NTY3ODg5MCFAIyQlXiYqKClfKzw+PzpcInx9e1tdcH1cbjEweDEwXG4xLDIgIDEsNSAgfCAxLDEgMSwzIDEsNCAxLDYgMSw3IDEsOCAyLDEgMiwyIDIsMyAyLDQgMiw1IDIsNiAyLDggMyw1XG4yLDkgIDQsMTAgfCAxLDkgMSwxMCAyLDEwIDMsOSAzLDEwIDQsOSA1LDkgNSwxMCA2LDkgNiwxMCA3LDEwIDgsMTBcbjMsMiAgMyw0ICB8IDMsM1xuMiw3ICA0LDggIHwgMyw2IDMsNyAzLDhcbjYsMSAgOSwxICB8IDMsMSA0LDEgNCwyIDQsMyA0LDQgNSwxIDUsMiA1LDMgNiwyIDcsMSA3LDIgOCwxIDgsMiA4LDMgOCw0IDgsNSA4LDZcbjUsNCAgNSw2ICB8IDQsNSA1LDUgNiw0IDYsNSA2LDZcbjYsOCAgOCw3ICB8IDQsNiA0LDcgNSw3IDUsOCA2LDcgNyw2IDcsNyA3LDggOCw4XG43LDMgIDcsNSAgfCA2LDMgNyw0IFxuOCw5IDEwLDEwIHwgNyw5IDksOSA5LDEwXG45LDMgIDEwLDYgfCA5LDIgOSw0IDksNSA5LDYgOSw3IDksOCAxMCwxIDEwLDIgMTAsMyAxMCw0IDEwLDUgMTAsNyAxMCw4IDEwLDlcbmA7IFxuLy9jb25zdCBpbnB1dCA9IGxvYWRGaWxlKGAvcHV6emxlcy9rZC0xLTEtMS5zdGFyYmApO1xuY29uc3QgcHV6emxlQURUOiBQdXp6bGUgPSBzb2x2ZWRQdXp6bGVQYXJzZXIoaW5wdXQpO1xuXG4vKipcbiAqIEdpdmVuIGEgY2VsbCB3aGljaCBpcyB0aGUgaW50ZXJzZWN0aW9uIG9mIHJvdyBhbmQgY29sLCB3ZSB3aWxsIGRyYXcgYSBzdGFyIGluIHRoYXQgY2VsbC4gXG4gKiBUaGlzIGhhcHBlbnMgd2hlbiB0aGUgY2xpZW50IHdhbnRzIHRvIHB1dCBhIHN0YXIgb24gdGhlIGJvYXJkIGF0IHRoZSBzcGVjaWZpYyBjZWxsLiBcbiAqIEBwYXJhbSBjYW52YXMgY2FudmFzIHRvIGRyYXcgb25cbiAqIEBwYXJhbSByb3csIHJvdyBvZiB0aGUgYm9hcmRcbiAqIEBwYXJhbSBjb2wsIGNvbCBvZiB0aGUgYm9hcmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRyYXdTdGFyKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBhc3NlcnQoY29udGV4dCwgJ3VuYWJsZSB0byBnZXQgY2FudmFzIGRyYXdpbmcgY29udGV4dCcpO1xuICAgIC8vIHNhdmUgb3JpZ2luYWwgY29udGV4dCBzZXR0aW5ncyBiZWZvcmUgd2UgdHJhbnNsYXRlIGFuZCBjaGFuZ2UgY29sb3JzXG4gICAgY29udGV4dC5zYXZlKCk7XG5cbiAgICAvLyB0cmFuc2xhdGUgdGhlIGNvb3JkaW5hdGUgc3lzdGVtIG9mIHRoZSBkcmF3aW5nIGNvbnRleHQ6XG4gICAgLy8gICB0aGUgb3JpZ2luIG9mIGBjb250ZXh0YCB3aWxsIG5vdyBiZSAoeCx5KVxuICAgIGNvbnRleHQudHJhbnNsYXRlKHJvdywgY29sKTtcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgXG4gICAgY29uc3QgcmFkaXVzID0gODtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgY29uc3QgeCA9IHJhZGl1cyAqIE1hdGguY29zKDYwICsgKDIgKiBNYXRoLlBJICogaSkgLyA1KTtcbiAgICAgICAgY29uc3QgeSA9IHJhZGl1cyAqIE1hdGguc2luKDYwICsgKDIgKiBNYXRoLlBJICogaSkgLyA1KTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oeCwgeSk7XG4gICAgICAgIGNvbnN0IGlubmVyWCA9IHJhZGl1cyAvIDIgKiBNYXRoLmNvcyg2MCArICgyICogTWF0aC5QSSAqIGkgKyBNYXRoLlBJKSAvIDUpO1xuICAgICAgICBjb25zdCBpbm5lclkgPSByYWRpdXMgLyAyICogTWF0aC5zaW4oNjAgKyAoMiAqIE1hdGguUEkgKiBpICsgTWF0aC5QSSkgLyA1KTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oaW5uZXJYLCBpbm5lclkpO1xuICAgIH1cbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgLy8gZHJhdyB0aGUgc3RhciBvdXRsaW5lIGFuZCBmaWxsXG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgY29udGV4dC5maWxsKCk7XG4gICAgY29uc29sZS5sb2coXCJSb3dcIiwoY29sKzEyLjUpLzI1ICwgXCJDb2xcIiwgKHJvdysxMi41KS8yNSk7XG4gICAgLy8gcmVzZXQgdGhlIG9yaWdpbiBhbmQgc3R5bGVzIGJhY2sgdG8gZGVmYXVsdHNcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGNlbGwgd2hpY2ggaXMgdGhlIGludGVyc2VjdGlvbiBvZiByb3cgYW5kIGNvbCwgd2Ugd2lsbCByZW1vdmUgYSBzdGFyIGluIHRoYXQgY2VsbCBpZiBhIFxuICogc3RhciBpcyBwcmVzZW50LiBUaGlzIGNvZGUgc2hvdWxkIG9ubHkgYmUgZXhlY3V0ZWQgaWYgdGhlcmUgaXMgYSBzdGFyIHByZXNlbnQgaW4gdGhlIGNlbGxcbiAqIEBwYXJhbSBjYW52YXMsIGNhbnZhcyB0byBkcmF3IG9uXG4gKiBAcGFyYW0gcm93LCByb3cgb2YgdGhlIGJvYXJkXG4gKiBAcGFyYW0gY29sLCBjb2wgb2YgdGhlIGJvYXJkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdGFyKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBhc3NlcnQoY29udGV4dCwgJ3VuYWJsZSB0byBnZXQgY2FudmFzIGRyYXdpbmcgY29udGV4dCcpO1xuICAgIC8vIHNhdmUgb3JpZ2luYWwgY29udGV4dCBzZXR0aW5ncyBiZWZvcmUgd2UgdHJhbnNsYXRlIGFuZCBjaGFuZ2UgY29sb3JzXG4gICAgY29udGV4dC5zYXZlKCk7XG4gICAgLy8gdHJhbnNsYXRlIHRoZSBjb29yZGluYXRlIHN5c3RlbSBvZiB0aGUgZHJhd2luZyBjb250ZXh0OlxuICAgIC8vICAgdGhlIG9yaWdpbiBvZiBgY29udGV4dGAgd2lsbCBub3cgYmUgKHgseSlcbiAgICBjb25zdCBjZWxsU2l6ZSA9IGNhbnZhc19zaXplIC8gbnVtQ2VsbHM7XG4gICAgY29uc3Qgb2Zmc2V0ID0gY2VsbFNpemUvMjtcbiAgICBjb25zdCBpbWdEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEocm93IC0gb2Zmc2V0ICsgMywgY29sIC0gb2Zmc2V0ICsgMywgMSwgMSk7XG4gICAgY29uc3QgW3IsIGcsIGJdID0gaW1nRGF0YS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKFwiQ29sb3IgaXMgXCIsIGNvbG9yRGF0YVRvSGV4KHIgPz8gMCwgZz8/MCwgYj8/MCkpO1xuICAgIC8vIFBpY2tzIGNvbG9yIGZyb20gY2FudmFzIGFuZCBmaWxscyBpbiB0aGUgcmVjdGFuZ2xlIHdpdGggdGhhdCBjb2xvclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JEYXRhVG9IZXgociA/PyAwLCBnID8/IDAsIGIgPz8gMCk7XG4gICAgY29udGV4dC5maWxsUmVjdChyb3cgLSBvZmZzZXQsIGNvbCAtIG9mZnNldCwgY2VsbFNpemUsIGNlbGxTaXplKTtcbiAgICBkcmF3R3JpZChjYW52YXMpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgUkdCIFZhbHVlIHRvIGNvcnJlc3BvbmRpbmcgaGV4IHN0cmluZ1xuICpcbiAqIEBwYXJhbSByIHJlZCB2YWx1ZSBbMCwgMjU1XVxuICogQHBhcmFtIGcgZ3JlZW4gdmFsdWUgWzAsIDI1NV1cbiAqIEBwYXJhbSBiIGJsdWUgdmFsdWUgWzAsIDI1NV1cbiAqL1xuZnVuY3Rpb24gY29sb3JEYXRhVG9IZXgocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcik6IHN0cmluZ3tcbiAgICBjb25zdCByZWRIZXggPSByLnRvU3RyaW5nKDE2KTtcbiAgICBjb25zdCBncmVlbkhleCA9IGcudG9TdHJpbmcoMTYpO1xuICAgIGNvbnN0IGJsdWVIZXggPSBiLnRvU3RyaW5nKDE2KTtcbiAgICBjb25zdCBoZXhBcnIgPSBbcmVkSGV4LCBncmVlbkhleCwgYmx1ZUhleF07XG4gICAgY29uc3QgbmV3QXJyID0gaGV4QXJyLm1hcCgoaGV4KSA9PiBoZXgubGVuZ3RoID09IDEgPyBcIjBcIiArIGhleCA6IGhleCk7XG4gICAgcmV0dXJuICcjJyArIG5ld0Fyci5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGNlbGwgd2hpY2ggaXMgdGhlIGludGVyc2VjdGlvbiBvZiByb3cgYW5kIGNvbCwgd2Ugd2lsbCBwdXQgYSBwb2ludCBhcyBhIHBsYWNlaG9sZGVyIGluIHRoYXQgY2VsbC4gXG4gKiBUaGlzIGhhcHBlbnMgd2hlbiB0aGUgY2xpZW50IHdhbnRzIHRvIG1hcmsgdGhhdCBjZWxsIGFzIGFuIGVtcHR5IGNlbGwuXG4gKiBAcGFyYW0gY2FudmFzIGNhbnZhcyB0byBkcmF3IG9uXG4gKiBAcGFyYW0gcm93LCByb3cgb2YgdGhlIGJvYXJkXG4gKiBAcGFyYW0gY29sLCBjb2wgb2YgdGhlIGJvYXJkXG4gKiBAcGFyYW0gcm93XG4gKiBAcGFyYW0gY29sXG4gKiBAcGFyYW0gcm93XG4gKiBAcGFyYW0gY29sXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkcmF3UG9pbnQoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGFzc2VydChjb250ZXh0LCAndW5hYmxlIHRvIGdldCBjYW52YXMgZHJhd2luZyBjb250ZXh0Jyk7XG4gICAgLy8gc2F2ZSBvcmlnaW5hbCBjb250ZXh0IHNldHRpbmdzIGJlZm9yZSB3ZSB0cmFuc2xhdGUgYW5kIGNoYW5nZSBjb2xvcnNcbiAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgIGNvbnN0IGNpcmNsZUFuZ2xlID0gMiAqIE1hdGguUEk7XG4gICAgLy8gdHJhbnNsYXRlIHRoZSBjb29yZGluYXRlIHN5c3RlbSBvZiB0aGUgZHJhd2luZyBjb250ZXh0OlxuICAgIC8vICAgdGhlIG9yaWdpbiBvZiBgY29udGV4dGAgd2lsbCBub3cgYmUgKHgseSlcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cbiAgICBjb25zdCByYWRpdXMgPSA0O1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgXG4gICAgLy8gZGVmaW5lIGNpcmNsZSBwYXRoXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyhyb3csIGNvbCwgcmFkaXVzLCAwLCBjaXJjbGVBbmdsZSk7XG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICBjb250ZXh0LmZpbGwoKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gY2FudmFzOiBjYW52YXMgdG8gZHJhdyBvblxuICogRHJhd3MgdGhlIGdyaWRsaW5lcyBvbiB0aGUgY2FudmFzXG4gKiBAcGFyYW0gY2FudmFzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkcmF3R3JpZChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZHtcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgYXNzZXJ0KGNvbnRleHQsICd1bmFibGUgdG8gZ2V0IGNhbnZhcyBkcmF3aW5nIGNvbnRleHQnKTtcblxuICAgIC8vIGRyYXcgbGltZXMgU3VjaCB0aGF0IGNhbnZhcyBpcyAxMHgxMFxuICAgIGNvbnN0IGNlbGxzUGVyUm93ID0gMTA7XG4gICAgY29uc3QgZ3JpZFNwYWNpbmcgPSBjYW52YXMud2lkdGggLyBjZWxsc1BlclJvdztcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNlbGxzUGVyUm93OyBpKyspIHtcbiAgICAgICAgLy8gVmVydGljYWwgTGluZXNcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oaSAqIGdyaWRTcGFjaW5nLCAwKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oaSAqIGdyaWRTcGFjaW5nLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgLy8gSG9yaXpvbnRhbCBMaW5lc1xuICAgICAgICBjb250ZXh0Lm1vdmVUbygwLCBpICogZ3JpZFNwYWNpbmcpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhjYW52YXMud2lkdGgsIGkgKiBncmlkU3BhY2luZyk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGEgc2V0IG9mIGNlbGxzIHRoYXQgYmVsb25nIHRvIGEgY29udGlndW91cyByZWdpb24sIGhpZ2hsaWdodCB0aGUgYm9yZGVyIG9mIHRoYXQgcmVnaW9uXG4gKiBAcGFyYW0gY2FudmFzLCBjYW52YXMgdG8gZHJhdyBvblxuICogQHBhcmFtIHJlZ2lvbiwgc2V0IG9mIGNlbGxzIGlkZW50aWZpZWQgYnkgaXRzIGNvb3JkaW5hdGVzLlxuICogQHBhcmFtIGNhbnZhc1xuICogQHBhcmFtIHJlZ2lvblxuICogQHBhcmFtIGNvbG9yXG4gKiBAcGFyYW0gY2FudmFzXG4gKiBAcGFyYW0gcmVnaW9uXG4gKiBAcGFyYW0gY29sb3JcbiAqIEBwYXJhbSBjYW52YXNcbiAqIEBwYXJhbSByZWdpb25cbiAqIEBwYXJhbSBjb2xvclxuICovXG5mdW5jdGlvbiBoaWdobGlnaHRSZWdpb24oY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgcmVnaW9uOiBSZWdpb24sIGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjZWxsU2l6ZSA9IGNhbnZhcy5oZWlnaHQgLyBudW1DZWxscztcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgYXNzZXJ0KGNvbnRleHQsICd1bmFibGUgdG8gZ2V0IGNhbnZhcyBkcmF3aW5nIGNvbnRleHQnKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGZvciAoY29uc3QgciBvZiByZWdpb24uZ2V0Q2VsbHMoKSl7XG4gICAgICAgIGNvbnN0IGNlbGxSb3cgPSByLmdldFJvdygpICogY2VsbFNpemUgLSBjZWxsU2l6ZTtcbiAgICAgICAgY29uc3QgY2VsbENvbCA9IHIuZ2V0Q29sdW1uKCkgKiBjZWxsU2l6ZSAtIGNlbGxTaXplO1xuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KGNlbGxSb3csIGNlbGxDb2wsIGNlbGxTaXplLCBjZWxsU2l6ZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBjOiBxdWVyeSBjZWxsXG4gKiBAcGFyYW0gY1xuICogQHJldHVybnMgYSBsaXN0IG9mIGNlbGwgbmVpZ2hib3JzIGFkamFjZW50IHRvIHRoZSBxdWVyeSBjZWxsXG4gKi9cbmZ1bmN0aW9uIGdldE5laWdoYm9ycyhjOiBDZWxsKTogQXJyYXk8Q2VsbD57XG4gICAgY29uc3QgbG93ZXJCb3VuZCA9IDE7XG4gICAgY29uc3QgdXBwZXJCb3VuZCA9IDEwO1xuICAgIGNvbnN0IG5laWdoYm9yczogQXJyYXk8Q2VsbD4gPSBbXTtcblxuICAgIGlmIChjLmdldENvbHVtbigpID4gbG93ZXJCb3VuZCkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChuZXcgQ2VsbChjLmdldFJvdygpLCBjLmdldENvbHVtbigpIC0gMSwgTWFyay5FbXB0eSkpO1xuICAgIH1cbiAgICBpZiAoYy5nZXRDb2x1bW4oKSA8IHVwcGVyQm91bmQpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2gobmV3IENlbGwoYy5nZXRSb3coKSwgYy5nZXRDb2x1bW4oKSArIDEsIE1hcmsuRW1wdHkpKTtcbiAgICB9XG4gICAgaWYgKGMuZ2V0Um93KCkgPiBsb3dlckJvdW5kKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKG5ldyBDZWxsKGMuZ2V0Um93KCkgLSAxLCBjLmdldENvbHVtbigpLCBNYXJrLkVtcHR5KSk7XG4gICAgfVxuICAgIGlmIChjLmdldFJvdygpIDwgdXBwZXJCb3VuZCkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChuZXcgQ2VsbChjLmdldFJvdygpICsgMSwgYy5nZXRDb2x1bW4oKSwgTWFyay5FbXB0eSkpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICAgIH1cblxuLyoqXG4gKiBQcmludCBhIG1lc3NhZ2UgYnkgYXBwZW5kaW5nIGl0IHRvIGFuIEhUTUwgZWxlbWVudC5cbiAqIFxuICogQHBhcmFtIG91dHB1dEFyZWEgSFRNTCBlbGVtZW50IHRoYXQgc2hvdWxkIGRpc3BsYXkgdGhlIG1lc3NhZ2VcbiAqIEBwYXJhbSBtZXNzYWdlIG1lc3NhZ2UgdG8gZGlzcGxheVxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJpbnRPdXRwdXQob3V0cHV0QXJlYTogSFRNTEVsZW1lbnQsIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIGFwcGVuZCB0aGUgbWVzc2FnZSB0byB0aGUgb3V0cHV0IGFyZWFcbiAgICBvdXRwdXRBcmVhLmlubmVyVGV4dCA9IG1lc3NhZ2UgKyAnXFxuJztcblxuICAgIC8vIHNjcm9sbCB0aGUgb3V0cHV0IGFyZWEgc28gdGhhdCB3aGF0IHdlIGp1c3QgcHJpbnRlZCBpcyB2aXNpYmxlXG4gICAgb3V0cHV0QXJlYS5zY3JvbGxUb3AgPSBvdXRwdXRBcmVhLnNjcm9sbEhlaWdodDtcbn1cblxuLyoqXG4gKiBAcGFyYW0gdmFsdWU6IG51bWJlciB0byBiZSBjZW50ZXJlZFxuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB2YWx1ZSBvbiBib2FyZCBzdWNoIHRoYXQgaXQgaXMgY2VudGVyZWQgaW4gYSBncmlkIGNlbGxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNlbnRlcih2YWx1ZTogbnVtYmVyKTogbnVtYmVye1xuICAgIGNvbnN0IGNlbGxXaWR0aCA9IGNhbnZhc19zaXplIC8gbnVtQ2VsbHM7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUgLyBjZWxsV2lkdGgpICogY2VsbFdpZHRoICsgKGNlbGxXaWR0aCAvIDIpO1xufVxuXG4vKipcbiAqIENvbG9ycyBpbiBhbGwgcmVnaW9ucyBvZiB0aGUgUHV6emxlIEJvYXJkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvckFsbFJlZ2lvbnMoKTogdm9pZHtcbiAgICAvLyBDb2xvciBpbiB0aGUgcmVnaW9uc1xuICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQgPz8gYXNzZXJ0LmZhaWwoJ21pc3NpbmcgZHJhd2luZyBjYW52YXMnKTtcblxuICAgIGZvciAoY29uc3QgcmVnIG9mIHB1enpsZUFEVC5nZXRSZWdpb25zKCkpe1xuICAgICAgICBjb25zdCBjb2xvciA9IENPTE9SUy5zaGlmdCgpO1xuICAgICAgICBpZiAoIWNvbG9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vcmUgY29sb3JzIHRvIGFkZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICBoaWdobGlnaHRSZWdpb24oY2FudmFzLCByZWcsIGNvbG9yKTtcbiAgICB9XG59XG5cbiJdfQ==
