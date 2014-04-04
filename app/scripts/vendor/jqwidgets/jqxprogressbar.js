/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxProgressBar", "", {});

    $.extend($.jqx._jqxProgressBar.prototype, {

        defineInstance: function () {
            //Type: Number.
            //Default: 0.
            //Sets the progress value.
            this.value = 0;
            //Type: Number.
            //Default: null.
            //Sets the progress value.            
            this.oldValue = null;
            //Type: Number.
            //Default: 100.
            //Sets the progress max value.
            this.max = 100;
            //Type: Number.
            //Default: 0.
            //Sets the progress min value.
            this.min = 0;
            //Type: String.
            //Default: 'horizontal'.
            //Sets the orientation.
            this.orientation = 'horizontal';
            //Type: String.
            //Default: 'normal'. Values: 'normal' or 'reverse'
            //Sets the layout.
            this.layout = 'normal';
            //Type: String.
            //Default: null.
            //Sets the progress bar width.
            this.width = null;
            //Type: String.
            //Default: null.
            //Sets the progress height width.
            this.height = null;
            //Type: Boolean.
            //Default: false.
            //Sets the visibility of the progress bar's text.
            this.showText = false;
            //Type: Number.
            //Default: 300
            //Sets the duration of the progress bar's animation.
            this.animationDuration = 300;
            // gets or sets whether the progress bar is disabled.
            this.disabled = false;
            this.rtl = false;
            this.renderText = null;
            this.aria =
            {
                "aria-valuenow": { name: "value", type: "number" },
                "aria-disabled": { name: "disabled", type: "boolean" }
            };
            // Progress Bar events.
            this.events =
			[
            // occurs when the value is changed.
		  	   'valuechanged',
            // occurs when the value is invalid.
               'invalidvalue',
            // occurs when the value becomes equal to the maximum value.
               'complete'
			];
        },

        // creates a new jqxProgressBar instance.
        createInstance: function (args) {

            var self = this;

            this.host.addClass(this.toThemeProperty("jqx-progressbar"));
            this.host.addClass(this.toThemeProperty("jqx-widget"));
            this.host.addClass(this.toThemeProperty("jqx-widget-content"));
            this.host.addClass(this.toThemeProperty("jqx-rc-all"));
            $.jqx.aria(this);

            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else if (this.width != undefined && !isNaN(this.width)) {
                this.host.width(this.width);
            }
            else this.host.width(this.width);

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            }
            else this.host.height(this.height);

            this.valueDiv = $("<div></div>").appendTo(this.element);

            if (this.orientation == 'horizontal') {
                this.valueDiv.width(0);
                this.valueDiv.addClass(this.toThemeProperty("jqx-progressbar-value"));
            }
            else {
                this.valueDiv.height(0);
                this.valueDiv.addClass(this.toThemeProperty("jqx-progressbar-value-vertical"));
            }

            this.valueDiv.addClass(this.toThemeProperty("jqx-fill-state-pressed"));

            this.feedbackElementHost = $("<div style='width: 100%; height: 100%; position: relative;'></div>").appendTo(this.host);

            this.feedbackElement = $("<span class='text'></span>").appendTo(this.feedbackElementHost);
            this.feedbackElement.addClass(this.toThemeProperty('jqx-progressbar-text'));
            this.oldValue = this._value();
            this.refresh();

            $.jqx.utilities.resize(this.host, function () {
                self.refresh();
            });
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        destroy: function () {
            this.host.removeClass();
            this.valueDiv.removeClass();
            this.valueDiv.remove();
            this.feedbackElement.remove();
        },

        _raiseevent: function (id, oldValue, newValue) {
            if (this.isInitialized != undefined && this.isInitialized == true) {
                var evt = this.events[id];
                var event = new jQuery.Event(evt);
                event.previousValue = oldValue;
                event.currentValue = newValue;
                event.owner = this;
                var result = this.host.trigger(event);
                return result;
            }
        },

        // gets or sets the progress bar value.
        // @param Number. Represents the new value
        actualValue: function (newValue) {
            if (newValue === undefined) {
                return this._value();
            }

            $.jqx.aria(this, "aria-valuenow", newValue);
            $.jqx.setvalueraiseevent(this, 'value', newValue);

            return this._value();
        },

        val: function (value) {
            if (arguments.length == 0 || typeof (value) == "object") {
                return this.actualValue();
            }

            return this.actualValue(value);
        },

        propertyChangedHandler: function (object, key, oldValue, value) {
            if (!this.isInitialized)
                return;

            var widget = this;

            if (key == "min" && object.value < value) {
                object.value = value;
            }
            else if (key == "max" && object.value > value) {
                object.value = value;
            }

            if (key === "value" && widget.value != undefined) {
                widget.value = value;
                widget.oldValue = oldValue;
                $.jqx.aria(object, "aria-valuenow", value);

                if (value < widget.min || value > widget.max) {
                    widget._raiseevent(1, oldValue, value);
                }

                widget.refresh();
            }
            if (key == 'theme') {
                $.jqx.utilities.setTheme(oldValue, value, object.host);
            }
            if (key == "renderText" || key == "orientation" || key == 'layout' || key == "showText" || key == "min" || key == "max") {
                widget.refresh();
            }
            else if (key == "width" && widget.width != undefined) {
                if (widget.width != undefined && !isNaN(widget.width)) {
                    widget.host.width(widget.width);
                    widget.refresh();
                }
            }
            else if (key == "height" && widget.height != undefined) {
                if (widget.height != undefined && !isNaN(widget.height)) {
                    widget.host.height(widget.height);
                    widget.refresh();
                }
            }
            if (key == "disabled") 
				widget.refresh();
        },

        _value: function () {
            var val = this.value;
            // normalize invalid value
            if (typeof val !== "number") {
                var result = parseInt(val);
                if (isNaN(result)) {
                    val = 0;
                }
                else val = result;
            }
            return Math.min(this.max, Math.max(this.min, val));
        },

        _percentage: function () {
            return 100 * this._value() / this.max;
        },

        _textwidth: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            $(this.host).append(measureElement);
            var width = measureElement.width();
            measureElement.remove();
            return width;
        },

        _textheight: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            $(this.host).append(measureElement);
            var height = measureElement.height();
            measureElement.remove();
            return height;
        },

        _initialRender: true,

        refresh: function () {
            var value = this.actualValue();
            var percentage = this._percentage();

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-progressbar-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                return;
            }
            else {
                this.host.removeClass(this.toThemeProperty('jqx-progressbar-disabled'));
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                $(this.element.children[0]).show();
            }

            if (isNaN(value)) {
                return;
            }

            if (isNaN(percentage)) {
                return;
            }

            if (this.oldValue !== value) {
                this._raiseevent(0, this.oldValue, value);
                this.oldValue = value;
            }
            var oldValue = this.oldValue;
            var height = this.host.outerHeight();
            var width = this.host.outerWidth();

            if (this.width != null) {
                width = parseInt(this.width);
            }
            if (this.height != null) {
                height = parseInt(this.height);
            }

            var halfWidth = parseInt(this.host.outerWidth()) / 2;
            var halfHeight = parseInt(this.host.outerHeight()) / 2;

            if (isNaN(percentage))
                percentage = 0;


            var me = this;
            try {
                var valueElement = this.element.children[0];
                $(valueElement)[0].style.position = 'relative';

                if (this.orientation == "horizontal") {
                    $(valueElement).toggle(value >= this.min)

                    var width = this.host.outerWidth() * percentage / 100;
                    var offsetLeft = 0;
                    if (this.layout == 'reverse' || this.rtl) {
                        if (this._initialRender) {
                            $(valueElement)[0].style.left = this.host.width() + 'px';
                            $(valueElement)[0].style.width = 0;
                        }
                        offsetLeft = this.host.outerWidth() - width;
                    }

                    $(valueElement).animate({ width: width, left: offsetLeft + 'px' }, this.animationDuration, function () {
                        if (me._value() === me.max) {
                            me._raiseevent(2, oldValue, me.max);
                        }
                    }
                    );

                    this.feedbackElementHost.css('margin-top', -this.host.height());
                }
                else {
                    $(valueElement).toggle(value >= this.min)
                    var height = this.host.height() * percentage / 100;
                    var offsetTop = 0;
                    if (this.layout == 'reverse') {
                        if (this._initialRender) {
                            $(valueElement)[0].style.top = this.host.height() + 'px';
                            $(valueElement)[0].style.height = 0;
                        }
                        offsetTop = this.host.height() - height;
                    }

                    this.feedbackElementHost.animate({ 'margin-top': -(percentage.toFixed(0) * me.host.height()) / 100 }, this.animationDuration, function () { });

                    $(valueElement).animate({ height: height, top: offsetTop + 'px' }, this.animationDuration, function () {
                        var percentage = me._percentage();
                        if (isNaN(percentage))
                            percentage = 0;

                        if (percentage.toFixed(0) == me.min) {
                            $(valueElement).hide();
                            if (me._value() === me.max) {
                                me._raiseevent(2, oldValue, me.max);
                            }
                        }
                    });

                }
            }
            catch (ex) {
            }

            this._initialRender = false;

            this.feedbackElement
			    .html(percentage.toFixed(0) + "%")
                .toggle(this.showText == true);

            if (this.renderText)
                this.feedbackElement.html(this.renderText(percentage.toFixed(0) + "%"));

            this.feedbackElement.css('position', 'absolute');
            this.feedbackElement.css('top', '50%');
            this.feedbackElement.css('left', '0');

            var textHeight = this.feedbackElement.height();
            var textWidth = this.feedbackElement.width();
            var centerWidth = Math.floor(halfWidth - (parseInt(textWidth) / 2));

            this.feedbackElement.css({ "left": (centerWidth), "margin-top": -parseInt(textHeight) / 2 + 'px' });
        }
    });
})(jQuery);
