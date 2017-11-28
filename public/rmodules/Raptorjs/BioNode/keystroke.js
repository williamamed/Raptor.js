/**
 * Raptor - Full Stack Framework
 *
 * @authors     William Amed <watamayo90@gmail.com>, 
 *              Jorge Miralles <jemiralles@nauta.cu>,
 *              Jorge Carmenate <jorge.carmenate@ltu.jovenclub.cu>,
 *              Pedro Abreu <pedro.abreu@ltu.jovenclub.cu>
 * @copyright   2017 
 * @link        http://raptorweb.cubava.cu
 * @version     2.0.1
 * @package     Raptor
 *
 * MIT LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function($) {
    "use strict";
    var Keystroke = function(el, options) {
        this.$el = $(el);
        this.options = options;
        this.init();
    }

    Keystroke.prototype = {
        init: function() {
            this.options = $.extend({}, this.options);
            var me=this;
            this.$el.on('focus', function() {
                $(this).val('');
                me.Graph = [];
                me.keyStack = [];
                me.SAMPLE_ERROR = false;
                me.sizeText = 0;
            })
            this.Graph = new Array();
            this.beforeKey = {
                latency: 0,
                duration: 0
            };
            this.keyStack = new Array();
            this.$el.on('keydown', $.proxy(this.onKeydown, this));
            this.$el.on('keyup', $.proxy(this.onKeyup, this));
            if (this.options.attachTo)
                this.attachTo = $(this.options.attachTo);
            this.template = {
                info: 'Type your password {COUNT} more time',
                error: 'The sample is invalid, type your password {COUNT} more time'
            }
            if (typeof this.options.template == 'object')
                this.template = $.extend(this.template, this.options.template)
            this.info = $('<span></span>');
            this.info.hide();
            this.$el.before(this.info);
            this.$el.val('');
            this.sizeText = this.$el.val().length;
        },
        SAMPLE_ERROR: false,
        SAMPLES_COUNT: 0,
        onKeydown: function(e) {
            //if the user press the delete or backspace key the sample is invalid
            if (e.which == 13 && this.options.mode && this.options.mode == 'samples') {
                if (!this.SAMPLE_ERROR) {
                    if (!this.samples) {
                        this.samples = new Array();
                    }
                    if (this.samples.length == 0) {
                        this.currentSample = this.$el.val();
                        this.$el.trigger('keystroke.samplesstart', [this.currentSample]);
                    }
                    if (this.currentSample === this.$el.val()) {
                        this.samples.push(this.Graph);
                        this.SAMPLES_COUNT = this.samples.length;
                        this.info.html(this.template.info.replace('{COUNT}', (6 - this.SAMPLES_COUNT)));
                        this.info.show();

                    } else {
                        this.info.html(this.template.error.replace('{COUNT}', (6 - this.SAMPLES_COUNT)));
                        this.info.show();
                    }
                } else {
                    this.SAMPLE_ERROR = false;

                    this.info.html(this.template.error.replace('{COUNT}', (6 - this.SAMPLES_COUNT)));
                    this.info.show();
                }

                this.$el.val('');
                this.sizeText = 0;
                this.Graph = [];
                if (this.SAMPLES_COUNT == 6) {

                    this.SAMPLES_COUNT = 0;
                    this.info.html('');
                    this.$el.trigger('keystroke.samples', [this.samples, KDynamics.encode(this.samples)]);
                    this.samples = new Array();
                    return;
                }
            }
            if (e.which == 46 || e.which == 8)
                this.SAMPLE_ERROR = true;

            if (!this.SAMPLE_ERROR) {
                var currentStackKey = {
                    up: 0,
                    down: e.timeStamp
                }

                this.keyStack.push(currentStackKey);
            }

            // console.info(e)
        },
        onKeyup: function(e) {
             
//            if(this.sizeText==0 && this.$el.val().length>0 && this.keyStack.length==0){
//                this.$el.val('')
//            }
            //check the text lenght to build the graph
            //alert(this.sizeText +' - '+this.$el.val().length)
            if (this.sizeText != this.$el.val().length && !this.SAMPLE_ERROR) {

                var currentStackKey = this.keyStack.shift();
                this.sizeText++;
                currentStackKey.up = e.timeStamp;
                currentStackKey.key = e.key;
                this.Graph.push(currentStackKey);
                //this.beforeKey = $.extend({}, currentStackKey);
                this.$el.trigger('keystroke.testsample', [this.Graph, KDynamics.encode(this.Graph)]);
            }
            if (this.attachTo) {
                if (this.attachTo.is('input'))
                    this.attachTo.val(KDynamics.encode(this.Graph));
                else
                    this.attachTo.html(KDynamics.encode(this.Graph));
            }

        },
        reset: function() {
            this.$el.val('');
            this.Graph = [];
            this.keyStack = [];
            this.SAMPLE_ERROR = false;
            this.sizeText = 0;
        },
        isValidSample: function() {
            return !this.SAMPLE_ERROR;
        },
        getGraph: function() {
            return this.Graph;
        },
        getEncodeGraph: function() {
            return KDynamics.encode(this.Graph);
        }
    }

    $.fn.keystroke = function(options) {

        if (typeof options === 'string') {
            if (options === 'data')
                return $(this).data('keystroke');
            var obj = $(this).data('keystroke');

            var arg = new Array();
            for (var i = 1; i < arguments.length; i++) {
                arg.push(arguments[i])
            }
            if (obj[options])
                return obj[options].apply(obj, arg);
        } else
            $(this).each(function() {
                var sw = new Keystroke(this, options);
                $(this).data('keystroke', sw)
            })
    }
})(jQuery)

KDynamics = {};
KDynamics.JSON = (new (function() {
    var me = this,
            encodingFunction,
            decodingFunction,
            useNative = null,
            useHasOwn = !!{}.hasOwnProperty,
            isNative = function() {
        if (useNative === null) {
            useNative = KDynamics.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
        }
        return useNative;
    },
            pad = function(n) {
        return n < 10 ? "0" + n : n;
    },
            doDecode = function(json) {
        return eval("(" + json + ')');
    },
            doEncode = function(o, newline) {
        // http://jsperf.com/is-undefined
        if (o === null || o === undefined) {
            return "null";
        } else if (KDynamics.isDate(o)) {
            return KDynamics.JSON.encodeDate(o);
        } else if (KDynamics.isString(o)) {
            return KDynamics.JSON.encodeString(o);
        } else if (typeof o == "number") {
            //don't use isNumber here, since finite checks happen inside isNumber
            return isFinite(o) ? String(o) : "null";
        } else if (KDynamics.isBoolean(o)) {
            return String(o);
        }
        // Allow custom zerialization by adding a toJSON method to any object type.
        // Date/String have a toJSON in some environments, so check these first.
        else if (o.toJSON) {
            return o.toJSON();
        } else if (KDynamics.isArray(o)) {
            return encodeArray(o, newline);
        } else if (KDynamics.isObject(o)) {
            return encodeObject(o, newline);
        } else if (typeof o === "function") {
            return "null";
        }
        return 'undefined';
    },
            m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\',
        '\x0b': '\\u000b' //ie doesn't handle \v
    },
    charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
            encodeString = function(s) {
        return '"' + s.replace(charToReplace, function(a) {
            var c = m[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    },
            //<debug>
            encodeArrayPretty = function(o, newline) {
        var len = o.length,
                cnewline = newline + '   ',
                sep = ',' + cnewline,
                a = ["[", cnewline], // Note newline in case there are no members
                i;

        for (i = 0; i < len; i += 1) {
            a.push(KDynamics.JSON.encodeValue(o[i], cnewline), sep);
        }

        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = newline + ']';

        return a.join('');
    },
            encodeObjectPretty = function(o, newline) {
        var cnewline = newline + '   ',
                sep = ',' + cnewline,
                a = ["{", cnewline], // Note newline in case there are no members
                i, val;

        for (i in o) {
            val = o[i];
            if (!useHasOwn || o.hasOwnProperty(i)) {
                // To match JSON.stringify, we shouldn't encode functions or undefined
                if (typeof val === 'function' || val === undefined) {
                    continue;
                }
                a.push(KDynamics.JSON.encodeValue(i) + ': ' + KDynamics.JSON.encodeValue(val, cnewline), sep);
            }
        }

        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = newline + '}';

        return a.join('');
    },
            //</debug>

            encodeArray = function(o, newline) {
        //<debug>
        if (newline) {
            return encodeArrayPretty(o, newline);
        }
        //</debug>

        var a = ["[", ""], // Note empty string in case there are no serializable members.
                len = o.length,
                i;
        for (i = 0; i < len; i += 1) {
            a.push(KDynamics.JSON.encodeValue(o[i]), ',');
        }
        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = ']';
        return a.join("");
    },
            encodeObject = function(o, newline) {
        //<debug>
        if (newline) {
            return encodeObjectPretty(o, newline);
        }
        //</debug>

        var a = ["{", ""], // Note empty string in case there are no serializable members.
                i, val;
        for (i in o) {
            val = o[i];
            if (!useHasOwn || o.hasOwnProperty(i)) {
                // To match JSON.stringify, we shouldn't encode functions or undefined
                if (typeof val === 'function' || val === undefined) {
                    continue;
                }
                a.push(KDynamics.JSON.encodeValue(i), ":", KDynamics.JSON.encodeValue(val), ',');

            }
        }
        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = '}';
        return a.join("");
    };

    /**
     * Encodes a String. This returns the actual string which is inserted into the JSON string as the literal
     * expression. **The returned value includes enclosing double quotation marks.**
     *
     * To override this:
     *
     *     Ext.JSON.encodeString = function(s) {
     *         return 'Foo' + s;
     *     };
     *
     * @param {String} s The String to encode
     * @return {String} The string literal to use in a JSON string.
     * @method
     */
    me.encodeString = encodeString;

    /**
     * The function which {@link #encode} uses to encode all javascript values to their JSON representations
     * when {@link Ext#USE_NATIVE_JSON} is `false`.
     * 
     * This is made public so that it can be replaced with a custom implementation.
     *
     * @param {Object} o Any javascript value to be converted to its JSON representation
     * @return {String} The JSON representation of the passed value.
     * @method
     */
    me.encodeValue = doEncode;

    /**
     * Encodes a Date. This returns the actual string which is inserted into the JSON string as the literal
     * expression. **The returned value includes enclosing double quotation marks.**
     *
     * The default return format is `"yyyy-mm-ddThh:mm:ss"`.
     *
     * To override this:
     *
     *     Ext.JSON.encodeDate = function(d) {
     *         return Ext.Date.format(d, '"Y-m-d"');
     *     };
     *
     * @param {Date} d The Date to encode
     * @return {String} The string literal to use in a JSON string.
     */
    me.encodeDate = function(o) {
        return '"' + o.getFullYear() + "-"
                + pad(o.getMonth() + 1) + "-"
                + pad(o.getDate()) + "T"
                + pad(o.getHours()) + ":"
                + pad(o.getMinutes()) + ":"
                + pad(o.getSeconds()) + '"';
    };

    /**
     * Encodes an Object, Array or other value.
     * 
     * If the environment's native JSON encoding is not being used ({@link Ext#USE_NATIVE_JSON} is not set,
     * or the environment does not support it), then ExtJS's encoding will be used. This allows the developer
     * to add a `toJSON` method to their classes which need serializing to return a valid JSON representation
     * of the object.
     * 
     * @param {Object} o The variable to encode
     * @return {String} The JSON string
     */
    me.encode = function(o) {
        if (!encodingFunction) {
            // setup encoding function on first access
            encodingFunction = isNative() ? JSON.stringify : me.encodeValue;
        }
        return encodingFunction(o);
    };

    /**
     * Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws
     * a SyntaxError unless the safe option is set.
     *
     * @param {String} json The JSON string
     * @param {Boolean} [safe=false] True to return null, false to throw an exception if the JSON is invalid.
     * @return {Object} The resulting object
     */
    me.decode = function(json, safe) {
        if (!decodingFunction) {
            // setup decoding function on first access
            decodingFunction = isNative() ? JSON.parse : doDecode;
        }
        try {
            return decodingFunction(json);
        } catch (e) {
            if (safe === true) {
                return null;
            }

        }
    };
})());
/**
 * Shorthand for {@link Ext.JSON#encode}
 * @member Ext
 * @method encode
 * @inheritdoc Ext.JSON#encode
 */
KDynamics.encode = KDynamics.JSON.encode;
/**
 * Shorthand for {@link Ext.JSON#decode}
 * @member Ext
 * @method decode
 * @inheritdoc Ext.JSON#decode
 */
KDynamics.decode = KDynamics.JSON.decode;

// @tag extras,core
// @require ../lang/Error.js
// @define Ext.JSON

/**
 * Modified version of [Douglas Crockford's JSON.js][dc] that doesn't
 * mess with the Object prototype.
 *
 * [dc]: http://www.json.org/js.html
 *
 * @singleton
 */
KDynamics.isDate = function(value) {
    return toString.call(value) === '[object Date]';
}
KDynamics.isString = function(value) {
    return typeof value === 'string';
}
KDynamics.isBoolean = function(value) {
    return typeof value === 'boolean';
}
KDynamics.isArray = function(value) {
    return toString.call(value) === '[object Array]';
}
KDynamics.isObject = (toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        }