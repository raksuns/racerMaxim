/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxSlider", "", {});

    $.extend($.jqx._jqxSlider.prototype, {
        defineInstance: function () {
            // Type: Bool
            // Default: false
            // Sets or gets whether the slider is disabled.
            this.disabled = false;
            // Type: Number/String
            // Default: 300
            // Sets or gets slider's width.
            this.width = 300;
            // Type: Number/String
            // Default: 30
            // Sets or gets slider's height.
            this.height = 30;
            // Type: Number
            // Default: 2
            // Sets or gets slide step when the user is using the arrows or the mouse wheel for changing slider's value.
            this.step = 1;
            // Type: Number
            // Default: 10
            // Sets or gets slider's maximum value.
            this.max = 10;
            // Type: Number
            // Default: 0
            // Sets or gets slider's minimum value.
            this.min = 0;
            // Type: String
            // Default: horizontal
            // Sets or gets slider's orientation.
            this.orientation = 'horizontal';
            // Type: Bool
            // Default: true
            // Sets or gets whether ticks will be shown.
            this.showTicks = true;
            // Type: Number
            // Default: both
            // Sets or gets slider's ticks position. Possible values - 'top', 'bottom', 'both'.
            this.ticksPosition = 'both';
            // Type: Number
            // Default: 2
            // Sets or gets slider's ticks frequency.
            this.ticksFrequency = 2;
            // Type: Bool
            // Default: true
            // Sets or gets whether the scroll buttons will be shown.
            this.showButtons = true;
            // Type: String
            // Default: both
            // Sets or gets scroll buttons position. Possible values 'both', 'left', 'right'.
            this.buttonsPosition = 'both';
            // Type: String
            // Default: default
            // Sets or gets slider's mode. If the mode is default then the user can use floating values.
            this.mode = 'default';
            // Type: Bool
            // Default: true
            // Sets or gets whether the slide range is going to be shown.
            this.showRange = true;
            // Type: Bool
            // Default: false
            // Sets or gets whether the slider is a range slider.
            this.rangeSlider = false;
            // Type: Number
            // Default: 0
            // Sets or gets slider's value. This poperty will be an object with the following structure { rangeStart: range_start, rangeEnd: range_end } if the
            // slider is range slider otherwise it's going to be a number.
            this.value = 0;
            // Type: Array
            // Default: [0, 10]
            // Sets or gets range slider's values.
            this.values = [0, 10];
            // Type: Bool
            // Default: true
            // Sets or gets whether the slider title will be shown.
            this.tooltip = true;
            // Type: Number/String
            // Default: 11
            // Sets or gets whether the slider buttons size.
            this.sliderButtonSize = 14;
            // Type: Number/String
            // Default: 5
            // Sets or gets the tick size.
            this.tickSize = 7;
            // mirror
            this.layout = "normal";
            this.rtl = false;
            // Private properties
            this._settings = {
                'vertical': {
                    'size': 'height',
                    'oSize': 'width',
                    'outerOSize': 'outerWidth',
                    'outerSize': 'outerHeight',
                    'left': 'top',
                    'top': 'left',
                    'start': '_startY',
                    'mouse': '_mouseStartY',
                    'page': 'pageY',
                    'opposite': 'horizontal'
                },
                'horizontal': {
                    'size': 'width',
                    'oSize': 'height',
                    'outerOSize': 'outerHeight',
                    'outerSize': 'outerWidth',
                    'left': 'left',
                    'top': 'top',
                    'start': '_startX',
                    'mouse': '_mouseStartX',
                    'page': 'pageX',
                    'opposite': 'vertical'
                }
            };
            this._touchEvents = {
                'mousedown': $.jqx.mobile.getTouchEventName('touchstart'),
                'click': $.jqx.mobile.getTouchEventName('touchstart'),
                'mouseup': $.jqx.mobile.getTouchEventName('touchend'),
                'mousemove': $.jqx.mobile.getTouchEventName('touchmove'),
                'mouseenter': 'mouseenter',
                'mouseleave': 'mouseleave'
            };
            this._events = ['change', 'slide', 'slideEnd', 'slideStart', 'created'];
            this._invalidArgumentExceptions = {
                'invalidWidth': 'Invalid width.',
                'invalidHeight': 'Invalid height.',
                'invalidStep': 'Invalid step.',
                'invalidMaxValue': 'Invalid maximum value.',
                'invalidMinValue': 'Invalid minimum value.',
                'invalidTickFrequency': 'Invalid tick frequency.',
                'invalidValue': 'Invalid value.',
                'invalidValues': 'Invalid values.',
                'invalidTicksPosition': 'Invalid ticksPosition',
                'invalidButtonsPosition': 'Invalid buttonsPosition'
            };
            //Containing the last value. This varialbe is used in the _raiseEvent method and it's our criteria for checking
            //whether we need to trigger event.
            this._lastValue = [];
            this._track = null;
            this._leftButton = null;
            this._rightButton = null;
            this._slider = null;
            this._rangeBar = null;
            this._slideEvent = null;
            this._capturedElement = null;
            this._slideStarted = false;
            this.aria =
            {
                "aria-valuenow": { name: "value", type: "number" },
                "aria-valuemin": { name: "min", type: "number" },
                "aria-valuemax": { name: "max", type: "number" },
                "aria-disabled": { name: "disabled", type: "boolean" }
            };
        },

        createInstance: function (args) {
            this.render();
        },

        render: function () {
            this.element.innerHTML = "";
            this.host.attr('role', 'slider');
            this.host.addClass(this.toThemeProperty('jqx-slider'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));

            $.jqx.aria(this);
            this._isTouchDevice = $.jqx.mobile.isTouchDevice();
            this.host.width(this.width);
            this.host.height(this.height);
            this._refresh();
            this._raiseEvent(4, { value: this.getValue() });
            this._addInput();
            var me = this;
            var autoTabIndex = me.host.attr("tabindex") == null;
            if (autoTabIndex) {
                me.host.attr("tabindex", 0);
            }
            $.jqx.utilities.resize(this.host, function () {
                me.host.width(me.width);
                me.host.height(me.height);
                me._performLayout();
                me._initialSettings();
            });
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.refresh();
            this.host.width(me.width);
            this.host.height(me.height);
            this._performLayout();
            this._initialSettings();
        },

        focus: function () {
            try {
                this.host.focus();
            }
            catch (error) {
            }
        },

        destroy: function () {
            this.host.remove();
        },

        _addInput: function () {
            var name = this.host.attr('name');
            if (!name) name = this.element.id;
            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            this.input.attr('name', name);
            if (!this.rangeSlider) {
                this.input.val(this.value.toString());
            }
            else {
                if (this.values) {
                    this.input.val(this.value.rangeStart.toString() + "-" + this.value.rangeEnd.toString());
                }
            }
        },

        _getSetting: function (setting) {
            return this._settings[this.orientation][setting];
        },

        _getEvent: function (event) {
            if (this._isTouchDevice) {
                return this._touchEvents[event];
            } else {
                return event;
            }
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this._refresh();
            }
        },

        _refresh: function () {
            this._render();
            this._performLayout();
            this._removeEventHandlers();
            this._addEventHandlers();
            this._initialSettings();
        },

        _render: function () {
            this._addTrack();
            this._addSliders();
            this._addTickContainers();
            this._addContentWrapper();
            this._addButtons();
            this._addRangeBar();
        },

        _addTrack: function () {
            if (this._track === null || this._track.length < 1) {
                this._track = $('<div class="' + this.toThemeProperty('jqx-slider-track') + '"></div>');
                this.host.append(this._track);
            }
            this._track.attr('style', '');
            this._track.removeClass(this.toThemeProperty('jqx-slider-track-' + this._getSetting('opposite')));
            this._track.addClass(this.toThemeProperty('jqx-slider-track-' + this.orientation));
            this._track.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            this._track.addClass(this.toThemeProperty('jqx-rc-all'));
        },

        _addSliders: function () {
            if (this._slider === null || this._slider.length < 1) {
                this._slider = {};
                this._slider.left = $('<div class="' + this.toThemeProperty('jqx-slider-slider') + '"></div>');
                this._track.append(this._slider.left);
                this._slider.right = $('<div class="' + this.toThemeProperty('jqx-slider-slider') + '"></div>');
                this._track.append(this._slider.right);
            }
            this._slider.left.removeClass(this.toThemeProperty('jqx-slider-slider-' + this._getSetting('opposite')));
            this._slider.left.addClass(this.toThemeProperty('jqx-slider-slider-' + this.orientation));
            this._slider.right.removeClass(this.toThemeProperty('jqx-slider-slider-' + this._getSetting('opposite')));
            this._slider.right.addClass(this.toThemeProperty('jqx-slider-slider-' + this.orientation));
            this._slider.right.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            this._slider.left.addClass(this.toThemeProperty('jqx-fill-state-normal'));
        },

        _addTickContainers: function () {
            if (this._bottomTicks !== null || this._bottomTicks.length < 1 ||
                this._topTicks !== null || this._topTicks.length < 1) {
                this._addTickContainers();
            }
            var type = 'visible';
            if (!this.showTicks) {
                type = 'hidden';
            }
            this._bottomTicks.css('visibility', type);
            this._topTicks.css('visibility', type);
        },

        _addTickContainers: function () {
            if (typeof this._bottomTicks === 'undefined' || this._bottomTicks.length < 1) {
                this._bottomTicks = $('<div class="' + this.toThemeProperty('jqx-slider-tickscontainer') + '" style=""></div>');
                this.host.prepend(this._bottomTicks);
            }
            if (typeof this._topTicks === 'undefined' || this._topTicks.length < 1) {
                this._topTicks = $('<div class="' + this.toThemeProperty('jqx-slider-tickscontainer') + '" style=""></div>');
                this.host.append(this._topTicks);
            }
        },

        _addButtons: function () {
            if (this._leftButton === null || this._leftButton.length < 1 ||
                this._rightButton === null || this._rightButton.length < 1) {
                this._createButtons();
            }
            var type = 'block';
            if (!this.showButtons || this.rangeSlider) {
                type = 'none';
            }
            this._rightButton.css('display', type);
            this._leftButton.css('display', type);
        },

        _createButtons: function () {
            this._leftButton = $('<div class="jqx-slider-left"><div style="width: 100%; height: 100%;"></div></div>');
            this._rightButton = $('<div class="jqx-slider-right"><div style="width: 100%; height: 100%;"></div></div>');
            this.host.prepend(this._rightButton);
            this.host.prepend(this._leftButton);
            if (!this.host.jqxRepeatButton) {
                throw new Error("jqxSlider: Missing reference to jqxbuttons.js.");
            }
            this._leftButton.jqxRepeatButton({ theme: this.theme, delay: 50, width: this.sliderButtonSize, height: this.sliderButtonSize });
            this._rightButton.jqxRepeatButton({ theme: this.theme, delay: 50, width: this.sliderButtonSize, height: this.sliderButtonSize });
        },

        _addContentWrapper: function () {
            if (this._contentWrapper === undefined || this._contentWrapper.length === 0) {
                this.host.wrapInner('<div></div>');
                this._contentWrapper = this.host.children(0);
            }
            if (this.orientation === 'horizontal') {
                this._contentWrapper.css('float', 'left');
            } else {
                this._contentWrapper.css('float', 'none');
            }
        },

        _addTicks: function (container) {
            if (!this.showTicks)
                return;

            var count = this.max - this.min,
                width = container[this._getSetting('size')](),
                tickscount = Math.round(count / this.ticksFrequency),
                distance = width / tickscount;
            container.empty();
            var ticks = "";
            var size = container[this._getSetting('oSize')]();
            ticks += this._addTick(container, 0, this.min, size);
            for (var i = 1; i < tickscount; i++) {
                var number = i * distance;
                number = Math.floor(number);
                ticks += this._addTick(container, number, i, size);
            }
            ticks += this._addTick(container, tickscount * distance, this.max, size);
            container.append($(ticks));
        },

        _addTick: function (container, position, value, size) {
            var cssClass = "";
            cssClass = this.toThemeProperty('jqx-slider-tick');
            cssClass += " " + this.toThemeProperty('jqx-fill-state-pressed');
            var currentTick;
            var top = this._getSetting('top');
            var topValue = '2px';

            if (container[0] !== this._topTicks[0]) {
                topValue = size - this.tickSize - 2 + 'px';
            }

            if (this.orientation === 'horizontal') {
                currentTick = '<div style="' + top + ': ' + topValue + '; ' + this._getSetting('oSize') + ':  ' + this.tickSize + 'px; float: left; position:absolute; left:' + position +
                                'px;" class="' + this.toThemeProperty('jqx-slider-tick-horizontal') + ' ' + cssClass + '"></div>';
            } else {
                currentTick = '<div style="' + top + ': ' + topValue + '; ' + this._getSetting('oSize') + ':  ' + this.tickSize + 'px; float: none; position:absolute; top:' + position +
                                'px;" class="' + this.toThemeProperty('jqx-slider-tick-vertical') + ' ' + cssClass + '"></div>';
            }
            return currentTick;
        },

        _addRangeBar: function () {
            if (this._rangeBar === null || this._rangeBar.length < 1) {
                this._rangeBar = $('<div class="' + this.toThemeProperty('jqx-slider-rangebar') + '"></div>');
                this._rangeBar.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                this._rangeBar.addClass(this.toThemeProperty('jqx-rc-all'));
                this._track.append(this._rangeBar);
            }
            if (!this.showRange) {
                this._rangeBar.css('display', 'none');
            } else {
                this._rangeBar.css('display', 'block');
            }
        },

        _getLeftDisplacement: function () {
            if (!this.showButtons) {
                return 0;
            }
            if (this.rangeSlider) {
                return 0;
            }
            switch (this.buttonsPosition) {
                case 'left':
                    return this._leftButton[this._getSetting('outerSize')](true) + this._rightButton[this._getSetting('outerSize')](true);
                case 'right':
                    return 0;
                default:
                    return this._leftButton[this._getSetting('outerSize')](true);
            }
            return 0;
        },

        _performLayout: function () {
            this.host.width(this.width);
            this.host.height(this.height);
            var size = this.host.height();
            if (this._getSetting('size') == 'width') {
                size = this.host.width();
            }

            this._performButtonsLayout();
            this._performTrackLayout(size-1);
            this._contentWrapper[this._getSetting('size')](this._track[this._getSetting('size')]());
            this._contentWrapper[this._getSetting('oSize')](this[this._getSetting('oSize')]);
            this._performTicksLayout();
            this._performRangeBarLayout();
            if (this.rangeSlider) {
                this._slider.left.css('visibility', 'visible');
            } else {
                this._slider.left.css('visibility', 'hidden');
            }
            this._refreshRangeBar();
            if (this.orientation == 'vertical') {
                if (this.showButtons) {
                    //   var leftMargin = parseInt(this._leftButton.css('margin-left'));
                    var centerLeft = parseInt((this._leftButton.width() - this._track.width()) / 2);

                    this._track.css('margin-left', -3 + centerLeft + 'px');
                }
            }
        },

        _performTrackLayout: function (size) {
            this._track[this._getSetting('size')](size - ((this.showButtons && !this.rangeSlider) ?
                        this._leftButton[this._getSetting('outerSize')](true) + this._rightButton[this._getSetting('outerSize')](true) : 0));
            this._slider.left.css('left', 0);
            this._slider.left.css('top', 0);
            this._slider.right.css('left', 0);
            this._slider.right.css('top', 0);
        },

        _performTicksLayout: function () {
            this._performTicksContainerLayout();
            this._addTicks(this._topTicks);
            this._addTicks(this._bottomTicks);
            this._topTicks.css('visibility', 'hidden');
            this._bottomTicks.css('visibility', 'hidden');
            if ((this.ticksPosition === 'top' || this.ticksPosition === 'both') && this.showTicks) {
                this._bottomTicks.css('visibility', 'visible');
            }
            if ((this.ticksPosition === 'bottom' || this.ticksPosition === 'both') && this.showTicks) {
                this._topTicks.css('visibility', 'visible');
            }
        },

        _performTicksContainerLayout: function () {
            var sizeDimension = this._getSetting('size');
            var oSizeDimension = this._getSetting('oSize');
            var outerSizeDimension = this._getSetting('outerOSize');

            this._topTicks[sizeDimension](this._track[sizeDimension]());
            this._bottomTicks[sizeDimension](this._track[sizeDimension]());
            var topTicksSize = -2 + (this[oSizeDimension] - this._track[outerSizeDimension](true)) / 2;
            this._topTicks[oSizeDimension](parseInt(topTicksSize));
            var bottomTicksSize = -2 + (this[oSizeDimension] - this._track[outerSizeDimension](true)) / 2;
            this._bottomTicks[oSizeDimension](parseInt(bottomTicksSize));

            if (this.orientation === 'vertical') {
                this._topTicks.css('float', 'left');
                this._track.css('float', 'left');
                this._bottomTicks.css('float', 'left');
            } else {
                this._topTicks.css('float', 'none');
                this._track.css('float', 'none');
                this._bottomTicks.css('float', 'none');
            }
        },

        _performButtonsLayout: function () {
            this._addButtonsStyles();
            this._addButtonsClasses();
            this._addButtonsHover();
            this._orderButtons();
            this._centerElement(this._rightButton);
            this._centerElement(this._leftButton);
            this._layoutButtons();
        },

        _addButtonsStyles: function () {
            this._leftButton.css('background-position', 'center');
            this._rightButton.css('background-position', 'center');
            if (this.orientation === 'vertical') {
                this._leftButton.css('float', 'none');
                this._rightButton.css('float', 'none');
            } else {
                this._leftButton.css('float', 'left');
                this._rightButton.css('float', 'left');
            }
        },

        _addButtonsClasses: function () {
            var icons = { prev: 'left', next: 'right' };
            if (this.orientation === 'vertical') {
                icons = { prev: 'up', next: 'down' };
            }
            this._leftButton.addClass(this.toThemeProperty('jqx-rc-all'));
            this._rightButton.addClass(this.toThemeProperty('jqx-rc-all'));
            this._leftButton.addClass(this.toThemeProperty('jqx-slider-button'));
            this._rightButton.addClass(this.toThemeProperty('jqx-slider-button'));
            this._leftArrow = this._leftButton.find('div');
            this._rightArrow = this._rightButton.find('div');
            this._leftArrow.removeClass(this.toThemeProperty('jqx-icon-arrow-left'));
            this._rightArrow.removeClass(this.toThemeProperty('jqx-icon-arrow-right'));
            this._leftArrow.removeClass(this.toThemeProperty('jqx-icon-arrow-up'));
            this._rightArrow.removeClass(this.toThemeProperty('jqx-icon-arrow-down'));
            this._leftArrow.addClass(this.toThemeProperty('jqx-icon-arrow-' + icons.prev));
            this._rightArrow.addClass(this.toThemeProperty('jqx-icon-arrow-' + icons.next));
        },

        _addButtonsHover: function () {
            var me = this, icons = { prev: 'left', next: 'right' };
            if (this.orientation === 'vertical') {
                icons = { prev: 'up', next: 'down' };
            }

            this.addHandler($(document), 'mouseup.arrow' + this.element.id, function () {
                me._leftArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-selected'));
                me._rightArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-' + icons.next + '-selected'));
            });

            this.addHandler(this._leftButton, 'mousedown', function () {
                if (!me.disabled)
                    me._leftArrow.addClass(me.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-selected'));
            });
            this.addHandler(this._leftButton, 'mouseup', function () {
                if (!me.disabled)
                    me._leftArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-selected'));
            });
            this.addHandler(this._rightButton, 'mousedown', function () {
                if (!me.disabled)
                    me._rightArrow.addClass(me.toThemeProperty('jqx-icon-arrow-' + icons.next + '-selected'));
            });
            this.addHandler(this._rightButton, 'mouseup', function () {
                if (!me.disabled)
                    me._rightArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-' + icons.next + '-selected'));
            });

            this._leftButton.hover(function () {
                if (!me.disabled)
                    me._leftArrow.addClass(me.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-hover'));
            }, function () {
                if (!me.disabled)
                    me._leftArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-hover'));
            });
            this._rightButton.hover(function () {
                if (!me.disabled)
                    me._rightArrow.addClass(me.toThemeProperty('jqx-icon-arrow-' + icons.next + '-hover'));
            }, function () {
                if (!me.disabled)
                    me._rightArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-' + icons.next + '-hover'));
            });
        },

        _layoutButtons: function () {
            if (this.orientation === 'horizontal') {
                this._horizontalButtonsLayout();
            } else {
                this._verticalButtonsLayout();
            }
        },

        _horizontalButtonsLayout: function () {
            var offset = (2 + Math.ceil(this.sliderButtonSize / 2));
            if (this.buttonsPosition == 'left') {
                this._leftButton.css('margin-right', '0px');
                this._rightButton.css('margin-right', offset);
            } else if (this.buttonsPosition == 'right') {
                this._leftButton.css('margin-left', 2 + offset);
                this._rightButton.css('margin-right', '0px');
            } else {
                this._leftButton.css('margin-right', offset);
                this._rightButton.css('margin-left', 2 + offset);
            }
        },

        _verticalButtonsLayout: function () {
            var offset = (2 + Math.ceil(this.sliderButtonSize / 2));
            if (this.buttonsPosition == 'left') {
                this._leftButton.css('margin-bottom', '0px');
                this._rightButton.css('margin-bottom', offset);
            } else if (this.buttonsPosition == 'right') {
                this._leftButton.css('margin-top', 2 + offset);
                this._rightButton.css('margin-bottom', '0px');
            } else {
                this._leftButton.css('margin-bottom', offset);
                this._rightButton.css('margin-top', 2 + offset);
            }
            var leftMargin = this._leftButton.css('margin-left');
            this._leftButton.css('margin-left', parseInt(leftMargin) - 1);
            this._rightButton.css('margin-left', parseInt(leftMargin) - 1);
        },

        _orderButtons: function () {
            this._rightButton.detach();
            this._leftButton.detach();
            switch (this.buttonsPosition) {
                case 'left':
                    this.host.prepend(this._rightButton);
                    this.host.prepend(this._leftButton);
                    break;
                case 'right':
                    this.host.append(this._leftButton);
                    this.host.append(this._rightButton);
                    break;
                case 'both':
                    this.host.prepend(this._leftButton);
                    this.host.append(this._rightButton);
                    break;
            }
        },

        _performRangeBarLayout: function () {
            this._rangeBar[this._getSetting('oSize')](this._track[this._getSetting('oSize')]());
            this._rangeBar[this._getSetting('size')](this._track[this._getSetting('size')]());
            this._rangeBar.css('position', 'absolute');
            this._rangeBar.css('left', 0);
            this._rangeBar.css('top', 0);
        },

        _centerElement: function (element) {
            var displacement = -1 + ($(element.parent())[this._getSetting('oSize')]() - element[this._getSetting('outerOSize')]()) / 2;
            element.css('margin-' + [this._getSetting('left')], 0);
            element.css('margin-' + [this._getSetting('top')], displacement);
            return element;
        },

        _raiseEvent: function (id, arg) {
            var evt = this._events[id];
            var event = new jQuery.Event(evt);

            if (this._triggerEvents === false)
                return true;

            event.args = arg;
            if (id === 1) {
                event.args.cancel = false;
                this._slideEvent = event;
            }
            this._lastValue[id] = arg.value;
            event.owner = this;
            var result = this.host.trigger(event);
            return result;
        },

        //Initializing the slider - setting it's values, disabling it if
        //disabled is true and setting tab-indexes for the keyboard navigation
        _initialSettings: function () {
            if (this.rangeSlider) {
                if (typeof this.value !== 'number') {
                    this.setValue(this.value);
                } else {
                    this.setValue(this.values);
                }
            } else {
                if (this.value == undefined) this.value = 0;
                this.setValue(this.value);
            }
            if (this.disabled) {
                this.disable();
            }
        },

        _addEventHandlers: function () {
            var self = this;
            this.addHandler(this._slider.right, this._getEvent('mousedown'), this._startDrag, { self: this });
            this.addHandler(this._slider.left, this._getEvent('mousedown'), this._startDrag, { self: this });
            this.addHandler($(document), this._getEvent('mouseup') + '.' + this.element.id, function () {
                self._stopDrag();
            });

            try
            {
                if (document.referrer != "" || window.frameElement) {
                    if (window.top != null && window.top != window.self) {
                        var eventHandle = function (event) {
                            self._stopDrag();
                        };
                        var parentLocation = null;
                        if (window.parent && document.referrer) {
                            parentLocation = document.referrer;
                        }

                        if (parentLocation && parentLocation.indexOf(document.location.host) != -1) {
                            if (window.top.document) {
                                if (window.top.document.addEventListener) {
                                    window.top.document.addEventListener('mouseup', eventHandle, false);

                                } else if (window.top.document.attachEvent) {
                                    window.top.document.attachEvent("on" + 'mouseup', eventHandle);
                                }
                            }
                        }
                    }
                }
            }
            catch (error) {
            }

            this.addHandler($(document), this._getEvent('mousemove') + '.' + this.element.id, this._performDrag, { self: this });
            var me = this;
            this.addHandler(this._slider.left, 'mouseenter', function () {
                if (!me.disabled)
                    self._slider.left.addClass(self.toThemeProperty('jqx-fill-state-hover'));
            });

            this.addHandler(this._slider.right, 'mouseenter', function () {
                if (!me.disabled)
                    self._slider.right.addClass(self.toThemeProperty('jqx-fill-state-hover'));
            });

            this.addHandler(this._slider.left, 'mouseleave', function () {
                if (!me.disabled)
                    self._slider.left.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
            });

            this.addHandler(this._slider.right, 'mouseleave', function () {
                if (!me.disabled)
                    self._slider.right.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
            });

            this.addHandler(this._slider.left, 'mousedown', function () {
                if (!me.disabled)
                    self._slider.left.addClass(self.toThemeProperty('jqx-fill-state-pressed'));
            });

            this.addHandler(this._slider.right, 'mousedown', function () {
                if (!me.disabled)
                    self._slider.right.addClass(self.toThemeProperty('jqx-fill-state-pressed'));
            });

            this.addHandler(this._slider.left, 'mouseup', function () {
                if (!me.disabled)
                    self._slider.left.removeClass(self.toThemeProperty('jqx-fill-state-pressed'));
            });

            this.addHandler(this._slider.right, 'mouseup', function () {
                if (!me.disabled)
                    self._slider.right.removeClass(self.toThemeProperty('jqx-fill-state-pressed'));
            });

            this.addHandler(this._leftButton, this._getEvent('click'), this._leftButtonHandler, { self: this });
            this.addHandler(this._rightButton, this._getEvent('click'), this._rightButtonHandler, { self: this });
            this.addHandler(this._track, this._getEvent('mousedown'), this._trackMouseDownHandler, { self: this });
            this.addHandler(this.host, 'focus', function () {
                self._track.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._leftButton.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._rightButton.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._slider.right.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._slider.left.addClass(self.toThemeProperty('jqx-fill-state-focus'));
            });
            this.addHandler(this.host, 'blur', function () {
                self._leftButton.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._rightButton.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._track.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._slider.right.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                self._slider.left.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
            });

            this.element.onselectstart = function () { return false; }
            this._addMouseWheelListeners();
            this._addKeyboardListeners();
        },

        _addMouseWheelListeners: function () {
            var self = this;
            this.addHandler(this.host, 'mousewheel', function (event) {
                if (self.disabled) {
                    return true;
                }

                var scroll = event.wheelDelta;
                if (event.originalEvent && event.originalEvent.wheelDelta) {
                    event.wheelDelta = event.originalEvent.wheelDelta;
                }

                if (!('wheelDelta' in event)) {
                    scroll = event.detail * -40;
                }
                if (scroll > 0) {
                    self.incrementValue();
                } else {
                    self.decrementValue();
                }
                event.preventDefault();
            });
        },

        _addKeyboardListeners: function () {
            var self = this;
            this.addHandler(this.host, 'keydown', function (event) {
                switch (event.keyCode) {
                    case 40:
                    case 37:    //left arrow
                        if (self.layout == 'normal' && !self.rtl) {
                            self.decrementValue();
                        }
                        else self.incrementValue();

                        return false;
                    case 38:
                    case 39:    //right arrow
                        if (self.layout == 'normal' && !self.rtl) {
                            self.incrementValue();
                        }
                        else self.decrementValue();
                        return false;
                    case 36:    //home
                        if (self.rangeSlider) {
                            self.setValue([self.values[0], self.max]);
                        } else {
                            self.setValue(self.min);
                        }
                        return false;
                    case 35:    //end
                        if (self.rangeSlider) {
                            self.setValue([self.min, self.values[1]]);
                        } else {
                            self.setValue(self.max);
                        }
                        return false;
                }
            });
        },

        _trackMouseDownHandler: function (event) {
            var touches = $.jqx.mobile.getTouches(event);
            var touch = touches[0];
            var self = event.data.self,
                event = (self._isTouchDevice) ? touch : event,
                position = self._track.coord()[self._getSetting('left')],
                pagePos = event[self._getSetting('page')] - self._slider.left[self._getSetting('size')]() / 2,
                slider = self._getClosest(pagePos),
                size = parseInt(self._track[self._getSetting('size')]());
            var value = self._getValueByPosition(pagePos);
            self._setValue(value, slider);
            if (self.input) {
                $.jqx.aria(self, 'aria-valuenow', self.input.val());
            }
        },

        _getClosest: function (position) {
            if (!this.rangeSlider) {
                return this._slider.right;
            } else {
                position = position - this._track.coord()[this._getSetting('left')] - this._slider.left[this._getSetting('size')]() / 2;
                if (Math.abs(parseInt(this._slider.left.css(this._getSetting('left')), 10) - position) <
                Math.abs(parseInt(this._slider.right.css(this._getSetting('left')), 10) - position)) {
                    return this._slider.left;
                } else {
                    return this._slider.right;
                }
            }
        },

        _removeEventHandlers: function () {
            this.removeHandler(this._slider.right, this._getEvent('mousedown'), this._startDrag);
            this.removeHandler(this._slider.left, this._getEvent('mousedown'), this._startDrag);
            this.removeHandler($(document), this._getEvent('mouseup') + '.' + this.host.attr('id'), this._stopDrag);
            this.removeHandler($(document), this._getEvent('mousemove') + '.' + this.host.attr('id'), this._performDrag);
            this.removeHandler(this._leftButton, this._getEvent('click'), this._leftButtonHandler);
            this.removeHandler(this._rightButton, this._getEvent('click'), this._rightButtonHandler);
            this.removeHandler(this._track, this._getEvent('mousedown'), this._trackMouseDownHandler);
            this.element.onselectstart = null;
            this.removeHandler(this.host, this._getEvent('mousewheel'));
            this.removeHandler(this.host, this._getEvent('keydown'));
        },

        _rightButtonClick: function () {
            if (this.orientation == 'horizontal' && !this.rtl) {
                this.incrementValue();
            }
            else {
                this.decrementValue();
            }
        },

        _leftButtonClick: function () {
            if (this.orientation == 'horizontal' && !this.rtl) {
                this.decrementValue();
            }
            else this.incrementValue();
        },

        _rightButtonHandler: function (event) {
            var self = event.data.self;
            if (self.layout == 'normal') {
                self._rightButtonClick();
            } else self._leftButtonClick();
            return false;
        },

        _leftButtonHandler: function (event) {
            var self = event.data.self;
            if (self.layout == 'normal') {
                self._leftButtonClick();
            }
            else self._rightButtonClick();
            return false;
        },

        _startDrag: function (event) {
            var touches = $.jqx.mobile.getTouches(event);
            var touch = touches[0];

            var self = event.data.self;
            self._capturedElement = $(event.target);
            self._startX = $(event.target).coord().left;
            self._startY = $(event.target).coord().top;

            var position = $.jqx.position(event);
            self._mouseStartX = position.left;
            self._mouseStartY = position.top;
            self.focus();
            return false;
        },

        _stopDrag: function () {
            var self = this;
            if (self._slideStarted) {   //if the slideStart event have been triggered and the user is dropping the thumb we are firing a slideStop event
                self._raiseEvent(2, { value: self.getValue() });
            }
            if (!self._slideStarted || self._capturedElement == null) {
                self._capturedElement = null;
                return;
            }

            if (this.input) {
                $.jqx.aria(this, 'aria-valuenow', this.input.val()); 
            }
            self._slider.left.removeClass(self.toThemeProperty('jqx-fill-state-pressed'));
            self._slider.right.removeClass(self.toThemeProperty('jqx-fill-state-pressed'));

            self._slideStarted = false;
            self._capturedElement = null;
        },

        _performDrag: function (event) {
            var self = event.data.self;
            if (self._capturedElement !== null) {
                var touches = $.jqx.mobile.getTouches(event);
                var touch = touches[0];

                if (event.which === 0 && $.jqx.browser.msie && $.jqx.browser.version < 9) {
                    self._stopDrag();
                    return false;
                }
                var position = $.jqx.position(event);
                var p = self.orientation == "horizontal" ? position.left : position.top;
                //if the thumb is dragged more than 3 pixels we are firing an event
                self._isDragged(p)
                if (self._slideStarted || self._isTouchDevice) {
                    return self._dragHandler(p);
                }
            }
        },

        _isDragged: function (position) {
            if (Math.abs(position - this[this._getSetting('mouse')]) > 2 && !this._slideStarted) {
                this._slideStarted = true;
                if (this._valueChanged(3)) {
                    this._raiseEvent(3, { value: this.getValue() });
                }
            } else {
                if (this._capturedElement === null) {
                    this._slideStarted = false;
                }
            }
        },

        _dragHandler: function (position) {
            position = (position - this[this._getSetting('mouse')]) + this[this._getSetting('start')];
            var newvalue = this._getValueByPosition(position);
            if (this.rangeSlider) {
                var second = this._slider.right,
                     first = this._slider.left;
                var dimension = this._getSetting('left');

                if (this._capturedElement[0] === first[0]) {
                    if (parseFloat(position) > second.coord()[dimension]) {
                        position = second.coord()[dimension];
                    }
                } else {
                    if (parseFloat(position) < first.coord()[dimension]) {
                        position = first.coord()[dimension];
                    }
                }
            }
            this._setValue(newvalue, this._capturedElement, position);
            return false;
        },

        _getValueByPosition: function (position) {
            if (this.mode === 'default') {
                return this._getFloatingValueByPosition(position);
            } else {
                return this._getFixedValueByPosition(position);
            }
        },

        _getFloatingValueByPosition: function (position) {
            var relativePosition = position - this._track.coord()[this._getSetting('left')] + this._slider.left.width() / 2,
                ratio = relativePosition / this._track[this._getSetting('size')](),
                value = (this.max - this.min) * ratio + this.min;

            if (this.layout == 'normal') {
                if (this.orientation === 'horizontal' && !this.rtl) {
                    return value;
                } else {
                    return (this.max + this.min) - value;
                }
            }
            else {
                if (this.orientation === 'horizontal' && !this.rtl) {
                    return (this.max + this.min) - value;
                } else {
                    return value;
                }
            }
        },

        _getFixedValueByPosition: function (position) {
            var step = this.step,
                count = (this.max - this.min) / step, sectorSize = (this._track[this._getSetting('size')]()) / count,
                currentSectorPosition = this._track.coord()[this._getSetting('left')] - this._slider.left[this._getSetting('size')]() / 2,
                closestSector = { number: -1, distance: Number.MAX_VALUE };
            //position -= this._track.coord()[this._getSetting('left')];
            for (var sector = this.min; sector <= this.max + this.step; sector += this.step) {
                if (Math.abs(closestSector.distance - position) > Math.abs(currentSectorPosition - position)) {
                    closestSector.distance = currentSectorPosition;
                    closestSector.number = sector;
                }
                currentSectorPosition += sectorSize;
            }

            if (this.layout == "normal") {
                if (this.orientation === 'horizontal' && !this.rtl) {
                    return closestSector.number;
                } else {
                    return (this.max + this.min) - closestSector.number;
                }
            }
            else {
                if (this.orientation === 'horizontal' && !this.rtl) {
                    return (this.max + this.min) - closestSector.number;
                } else {
                    return closestSector.number;
                }
            }
        },

        _setValue: function (value, slider, position) {
            if (!this._slideEvent || !this._slideEvent.args.cancel) {
                value = this._handleValue(value, slider);
                this._setSliderPosition(value, slider, position);
                this._fixZIndexes();
                if (this._valueChanged(1)) {
                    var event = this._raiseEvent(1, { value: this.getValue() });
                }
                if (this._valueChanged(0)) {
                    this._raiseEvent(0, { value: this.getValue() });
                }
                if (this.tooltip) {
                    slider.attr('title', value);
                }
                if (this.input) {
                    if (!this.rangeSlider) {
                        this.input.val(this.value.toString());
                    }
                    else {
                        if (this.values) {
                            if (this.value.rangeEnd != undefined && this.value.rangeStart != undefined) {
                                this.input.val(this.value.rangeStart.toString() + "-" + this.value.rangeEnd.toString());
                            }
                        }
                    }
                }
            }
        },

        _valueChanged: function (id) {
            var value = this.getValue();
            return (!this.rangeSlider && this._lastValue[id] !== value) ||
                    (this.rangeSlider && (typeof this._lastValue[id] !== 'object' ||
                     parseFloat(this._lastValue[id].rangeEnd) !== parseFloat(value.rangeEnd) || parseFloat(this._lastValue[id].rangeStart) !== parseFloat(value.rangeStart)));
        },

        _handleValue: function (value, slider) {
            value = this._validateValue(value, slider);
            if (slider[0] === this._slider.left[0]) {
                this.values[0] = value;
            }
            if (slider[0] === this._slider.right[0]) {
                this.values[1] = value;
            }
            if (this.rangeSlider) {
                this.value = { rangeStart: this.values[0], rangeEnd: this.values[1] };
            } else {
                this.value = value;
            }
            return value;
        },

        _fixZIndexes: function () {
            if (this.values[1] - this.values[0] < 0.5 && this.max - this.values[0] < 0.5) {
                this._slider.left.css('z-index', 20);
                this._slider.right.css('z-index', 15);
            } else {
                this._slider.left.css('z-index', 15);
                this._slider.right.css('z-index', 20);
            }
        },

        _refreshRangeBar: function () {
            var _left = this._getSetting('left');
            var _size = this._getSetting('size');

            var isRTL = this.rtl && this.orientation == 'horizontal';

            if (this.layout == "normal") {
                var position = this._slider.left.position()[_left];
                if (this.orientation === 'vertical' || isRTL) {
                    position = this._slider.right.position()[_left];
                }
            }
            else {
                var position = this._slider.right.position()[_left];
                if (this.orientation === 'vertical' || isRTL) {
                    var position = this._slider.left.position()[_left];
                }
            }

            this._rangeBar.css(_left, position + this._slider.left[_size]() / 2);

            this._rangeBar[_size](Math.abs(
                this._slider.right.position()[_left] - this._slider.left.position()[_left]));
        },

        _validateValue: function (value, slider) {
            if (value > this.max) {
                value = this.max;
            }
            if (value < this.min) {
                value = this.min;
            }

            if (this.rangeSlider) {
                if (slider[0] === this._slider.left[0]) {
                    if (value >= this.values[1]) {
                        value = this.values[1];
                    }
                } else {
                    if (value <= this.values[0]) {
                        value = this.values[0];
                    }
                }
            }

            return value;
        },

        _setSliderPosition: function (value, thumb, position) {
            var trackSize = this._track[this._getSetting('size')](), ratio, distance;
            if (position) {
                position -= this._track.coord()[this._getSetting('left')];
            }

            if (this.layout == "normal") {
                var ratio = (value - this.min) / (this.max - this.min);
                if (this.orientation != 'horizontal' || (this.orientation == 'horizontal' && this.rtl)) {
                    ratio = 1 - ((value - this.min) / (this.max - this.min));
                }
            }
            else {
                var ratio = 1 - ((value - this.min) / (this.max - this.min));
                if (this.orientation != 'horizontal' || (this.orientation == 'horizontal' && this.rtl)) {
                    ratio = (value - this.min) / (this.max - this.min);
                }
            }

            distance = trackSize * ratio - this._slider.left[this._getSetting('size')]() / 2;
            thumb.css(this._getSetting('left'), distance);

            this._refreshRangeBar();
        },

        _validateDropPosition: function (distance, thumb) {
            var trackSize = this._track[this._getSetting('size')](),
                sliderWidth = thumb[this._getSetting('size')]();
            if (distance < -sliderWidth / 2) {
                distance = -sliderWidth / 2;
            }
            if (distance > trackSize - sliderWidth / 2) {
                distance = trackSize - sliderWidth / 2;
            }
            return Math.floor(distance);
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            switch (key) {
                case 'theme':
                    $.jqx.utilities.setTheme(oldvalue, value, object.host);
                    object._leftButton.jqxRepeatButton({ theme: value });
                    object._rightButton.jqxRepeatButton({ theme: value });
                    break;
                case 'disabled':
                    if (value) {
                        object.disabled = true;
                        object.disable();
                    } else {
                        object.disabled = false;
                        object.enable();
                    }
                    break;
                case 'width':
                case 'height':
                    object._performLayout();
                    object._initialSettings();
                    break;
                case 'min':
                case 'max':
                    if (!object.rangeSlider) {
                        object._setValue(value, object._slider.left);
                    }
                    object._initialSettings();
                    break;
                case 'showTicks':
                case 'ticksPosition':
                case 'ticksFrequency':
                case 'tickSize':
                    object._performLayout();
                    object._initialSettings();
                    break;
                case 'showRange':
                case 'showButtons':
                case 'orientation':
                case 'rtl':
                    object._render();
                    object._performLayout();
                    object._initialSettings();
                    break;
                case 'buttonsPosition':
                    object._refresh();
                    break;
                case 'rangeSlider':
                    if (!value) {
                        object.value = object.value.rangeEnd;
                    } else {
                        object.value = { rangeEnd: object.value, rangeStart: object.value };
                    }
                    object._render();
                    object._performLayout();
                    object._initialSettings();
                    break;
                case 'value':
                    if (!object.rangeSlider) {
                        object.value = parseFloat(value);
                    }
                    object.setValue(value);
                    break;
                case 'values':
                    object.setValue(value);
                    break;
                case 'tooltip':
                    if (!value) {
                        object._slider.left.removeAttr('title');
                        object._slider.right.removeAttr('title');
                    }
                    break;
                default: object._refresh();
            }
        },

        //Increment slider's value. If it's a range slider it's increment it's end range.
        incrementValue: function (step) {
            if (step == undefined || isNaN(parseFloat(step))) {
                step = this.step;
            }
            if (this.rangeSlider) {
                if (this.values[1] < this.max) {
                    this._setValue(this.values[1] + step, this._slider.right);
                }
            } else {
                if (this.values[1] >= this.min && this.values[1] < this.max) {
                    this._setValue(this.values[1] + step, this._slider.right);
                }
            }
            if (this.input) {
                $.jqx.aria(this, 'aria-valuenow', this.input.val());
            }
        },

        //Decrementing slider's value. If it's range slider it's decrement it's start range.
        decrementValue: function (step) {
            if (step == undefined || isNaN(parseFloat(step))) {
                step = this.step;
            }
            if (this.rangeSlider) {
                if (this.values[0] > this.min) {
                    this._setValue(this.values[0] - step, this._slider.left);
                }
            } else {
                if (this.values[1] <= this.max && this.values[1] > this.min) {
                    this._setValue(this.values[1] - step, this._slider.right);
                }
            }
            if (this.input) {
                $.jqx.aria(this, 'aria-valuenow', this.input.val());
            }
        },

        val: function(value)
        {
            if (arguments.length == 0 || (!$.isArray(value) && typeof (value) == "object")) {
                return this.getValue();
            }
            if ($.isArray(value)) {
                this.setValue(value);
                return;
            }
            this.setValue(value);
        },

        //Setting slider's value. Possible value types - array, one or two numbers.
        setValue: function (value) {
            if (this.rangeSlider) {
                var rangeLeft, rangeRight;
                if (arguments.length < 2) {
                    if (value instanceof Array) {
                        rangeLeft = value[0];
                        rangeRight = value[1];
                    } else if (typeof value === 'object' && typeof value.rangeStart !== 'undefined' && typeof value.rangeEnd !== 'undefined') {
                        rangeLeft = value.rangeStart;
                        rangeRight = value.rangeEnd;
                    }
                } else {
                    rangeLeft = arguments[0];
                    rangeRight = arguments[1];
                }
                this._triggerEvents = false;
                this._setValue(rangeRight, this._slider.right);
                this._triggerEvents = true;
                this._setValue(rangeLeft, this._slider.left);
            } else {
                this._triggerEvents = false;
                this._setValue(this.min, this._slider.left);
                this._triggerEvents = true;
                this._setValue(value, this._slider.right);
            }
            if (this.input) {
                $.jqx.aria(this, 'aria-valuenow', this.input.val());
            }
        },

        getValue: function () {
            return this.value;
        },

        _enable: function (state) {
            if (state) {
                this._addEventHandlers();
                this.disabled = false;
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            else {
                this._removeEventHandlers();
                this.disabled = true;
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            this._leftButton.jqxRepeatButton({ disabled: this.disabled });
            this._rightButton.jqxRepeatButton({ disabled: this.disabled });
        },

        disable: function () {
            this._enable(false);
            $.jqx.aria(this, 'aria-disabled', true);
        },

        enable: function () {
            this._enable(true);
            $.jqx.aria(this, 'aria-disabled', false);
        }
    });
})(jQuery);