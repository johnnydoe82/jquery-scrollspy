/* global jQuery */

/*
 * jQuery ScrollSpy Plugin
 * Author: @sxalexander, softwarespot
 * Licensed under the MIT license
 */
; (function ($, window, document, undefined) {

    // Plugin Logic

    $.fn.extend({

        scrollspy: function (options, action) {

            // default options for ScrollSpy
            var defaults = {
                // the offset to be applied to the left and top positions of the container
                buffer: 0,

                // the element to apply the 'scrolling' event to (default window)
                container: window,

                // the maximum value of the X or Y coordinate, depending on mode the selected
                max: 0,

                // the maximum value of the X or Y coordinate, depending on mode the selected
                min: 0,

                // whether to listen to the X (horizontal) or Y (vertical) scrolling
                mode: 'vertical',

                // namespace to append to the 'scroll' event
                namespace: 'scrollspy',

                // call the following callback function every time the user enters the min / max zone
                onEnter: null,

                // call the following callback function every time the user leaves the min / max zone
                onLeave: null,

                // call the following callback function every time the user leaves the top zone
                onLeaveTop: null,

                // call the following callback function every time the user leaves the bottom zone
                onLeaveBottom: null,

                // call the following callback function on each scroll event within the min and max parameters
                onTick: null
            };

            // override the default options with those passed to the plugin
            options = $.extend({}, defaults, options);

            // sanitize the following option with the default value if the predicate fails
            sanitizeOption(options, defaults, 'container', isObject);

            // cache the jQuery object
            var $container = $(options.container);

            // check if it's a valid jQuery selector
            if ($container.length === 0) {

                return this;

            }

            // sanitize the following options with the default values if the predicates fails
            sanitizeOption(options, defaults, 'buffer', $.isNumeric);
            sanitizeOption(options, defaults, 'max', $.isNumeric);
            sanitizeOption(options, defaults, 'min', $.isNumeric);

            sanitizeOption(options, defaults, 'namespace', isString);

            sanitizeOption(options, defaults, 'onEnter', $.isFunction);
            sanitizeOption(options, defaults, 'onLeave', $.isFunction);
            sanitizeOption(options, defaults, 'onLeaveTop', $.isFunction);
            sanitizeOption(options, defaults, 'onLeaveBottom', $.isFunction);
            sanitizeOption(options, defaults, 'onTick', $.isFunction);

            // check if the action is set to DESTROY/destroy
            if (typeof action === 'string' && action.toUpperCase() === 'DESTROY') {

              $container.off('scroll.' + options.namespace);
              return this;

            }

            // check if the mode is set to VERTICAL/vertical
            var isVertical = String(options.mode).toUpperCase() === 'VERTICAL';

            return this.each(function () {

                // cache this
                var self = this,

                    // cache the jQuery object
                    $element = $(self),

                    // count the number of times a container is entered
                    enters = 0,

                    // determine if the scroll is with inside the container
                    inside = false,

                    // count the number of times a container is left
                    leaves = 0;

                // create a scroll listener for the container
                $container.on('scroll.' + options.namespace, function () {

                    // cache the jQuery object
                    var $this = $(this),

                        // create a position object literal
                        position = {
                            top: $this.scrollTop(),
                            left: $this.scrollLeft()
                        },

                        max = $.isFunction(options.max) ? options.max() : options.max,

                        min = $.isFunction(options.min) ? options.min() : options.min,

                        xAndY = isVertical ? position.top + options.buffer : position.left + options.buffer;

                    if (max === 0) {

                        // get the maximum value based on either the height or the outer width
                        max = isVertical ? $container.height() : $container.outerWidth() + $element.outerWidth();

                    }

                    // if we have reached the minimum bound, though are below the max
                    if (xAndY >= min && xAndY <= max) {

                        // trigger the 'scrollEnter' event
                        if (!inside) {

                            inside = true;
                            enters++;

                            // trigger the 'scrollEnter' event
                            $element.trigger('scrollEnter', {
                                position: position
                            });

                            // call the 'onEnter' function
                            if (options.onEnter !== null) {
                                options.onEnter(self, position);
                            }

                        }

                        // trigger the 'scrollTick' event
                        $element.trigger('scrollTick', {
                            position: position,
                            inside: inside,
                            enters: enters,
                            leaves: leaves
                        });

                        // call the 'onTick' function
                        if (options.onTick !== null) {
                            options.onTick(self, position, inside, enters, leaves);
                        }

                    } else {

                        if (inside) {

                            inside = false;
                            leaves++;

                            // trigger the 'scrollLeave' event
                            $element.trigger('scrollLeave', {
                                position: position,
                                leaves: leaves
                            });

                            // call the 'onLeave' function
                            if (options.onLeave !== null) {
                                options.onLeave(self, position);
                            }

                            if (xAndY <= min) {
                                // trigger the 'scrollLeaveTop' event
                                $element.trigger('scrollLeaveTop', {
                                    position: position,
                                    leaves: leaves
                                });

                                // call the 'onLeaveTop' function
                                if (options.onLeaveTop !== null) {
                                    options.onLeaveTop(self, position);
                                }

                            } else if (xAndY >= max) {
                                // trigger the 'scrollLeaveBottom' event
                                $element.trigger('scrollLeaveBottom', {
                                    position: position,
                                    leaves: leaves
                                });

                                // call the 'onLeaveBottom' function
                                if (options.onLeaveBottom !== null) {
                                    options.onLeaveBottom(self, position);
                                }

                            }
                        }

                    }
                });

            });
        }

    });

    // Methods (Private)

    // check if a value is an object datatype
    var isObject = function (value) {

        return $.type(value) === 'object';

    };

    // check if a value is a string datatype with a length greater than zero when whitespace is stripped
    var isString = function (value) {

        return $.type(value) === 'string' && value.trim().length > 0;

    };

    // check if an option is correctly formatted using a predicate; otherwise, return the default value
    var sanitizeOption = function (options, defaults, property, predicate) {

        // set the property to the default value if the predicate returned false
        if (!predicate(options[property])) {
            options[property] = defaults[property];
        }

    };


})(jQuery, window, document);
