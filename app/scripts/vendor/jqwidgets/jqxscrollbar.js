/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
$.jqx.jqxWidget("jqxScrollBar", "", {});

$.extend($.jqx._jqxScrollBar.prototype, {

        defineInstance: function () {
            // Type: Number
            // Default: null
            // Sets the scrollbar height.
            this.height = null;
            // Type: Number
            // Default: null
            // Sets the scrollbar width.
            this.width = null;
            // Type: Number
            // Default: false. This means that the scrollbar is horizontally oriented by default.
            // Sets the scrollbar orientation.
            this.vertical = false;
            // Type: Number
            // Default: 0
            // Sets the minimum scroll value.
            this.min = 0;
            // Type: Number
            // Default: 0
            // Sets the maximum scroll value.
            this.max = 1000;
            // Type: Number
            // Default: 0
            // Sets the scroll value. The value can be between min and max.
            this.value = this.min;
            // Type: Number
            // Default: 0
            // Sets the scroll step when any arrow button is clicked.
            this.step = 10;
            // Type: Number
            // Default: 0
            // Sets the scroll step when the user clicks on the empty scroll space between arrow button and thumb.
            this.largestep = 50;
            // Type: Number
            // Default: 10
            // sets the thumb's minimum size.
            this.thumbMinSize = 10;
            // Type: Number
            // Default: 0
            // sets the thumb's size.
            this.thumbSize = 0;
            // Type: Number or 'auto'
            // Default: 'auto'
            // sets the thumb's drag step.
            this.thumbStep = 'auto';
            // Type: String
            // Default: 'all'
            // sets the rounded corners string.
            this.roundedCorners = 'all';
            // Type: Boolean
            // Default: true
            // Sets whether the scroll buttons are visible.
            this.showButtons = true;
            // Type: Boolean
            // Default: false
            // Sets whether the scrollbar is disabled or not.
            this.disabled = false;
            // Sets whether the scrollbar is on touch device.
            this.touchMode = 'auto';
            this.touchModeStyle = 'auto';
            this.thumbTouchSize = 0;
            // disable jquery trigger function. It is very slow if you call it on mouse move. This could improve performance.
            this._triggervaluechanged = true;
            this.rtl = false;
            this.areaDownCapture = false;
            this.areaUpCapture = false;
            this._initialLayout = false;
        },

        createInstance: function (args) {
            this.render();
        }, // createInstance

        render: function () {
            this._mouseup = new Date();
            var self = this;
            var html = "<div id='jqxScrollOuterWrap' style='width:100%; height: 100%; align:left; border: 0px; valign:top; position: relative;'>" +
                "<div id='jqxScrollWrap' style='width:100%; height: 100%; left: 0px; top: 0px; align:left; valign:top; position: absolute;'>" +
                "<div id='jqxScrollBtnUp' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='jqxScrollAreaUp' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='jqxScrollThumb' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='jqxScrollAreaDown' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='jqxScrollBtnDown' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "</div>" +
                "</div>";

            if ($.jqx.utilities && $.jqx.utilities.scrollBarButtonsVisibility == "hidden") {
                this.showButtons = false;
            }

            if (self.WinJS) {
                MSApp.execUnsafeLocalFunction(function () {
                    self.host.html(html);
                });
            }
            else {
                this.element.innerHTML = html;
            }

            if (this.width != undefined && parseInt(this.width) > 0) {
                this.host.width(parseInt(this.width));
            }

            if (this.height != undefined && parseInt(this.height) > 0) {
                this.host.height(parseInt(this.height));
            }
            this.isPercentage = false;
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
                this.isPercentage = true;
            }

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
                this.isPercentage = true;
            }
            if (this.isPercentage) {
                var that = this;
                $.jqx.utilities.resize(this.host, function () {
                    that._arrange();
                }, false);
            }
            this.thumbCapture = false;
            this.scrollOuterWrap = $(this.element.firstChild);
            this.scrollWrap = $(this.scrollOuterWrap[0].firstChild);
            this.btnUp = $(this.scrollWrap[0].firstChild);
            this.areaUp = $(this.btnUp[0].nextSibling);
            this.btnThumb = $(this.areaUp[0].nextSibling);
            this.arrowUp = $('<div></div>');
            this.arrowUp.appendTo(this.btnUp);
            this.areaDown = $(this.btnThumb[0].nextSibling);
            this.btnDown = $(this.areaDown[0].nextSibling);
            this.arrowDown = $('<div></div>');
            this.arrowDown.appendTo(this.btnDown);

            var elID = this.element.id;
            this.btnUp[0].id = "jqxScrollBtnUp" + elID;
            this.btnDown[0].id = "jqxScrollBtnDown" + elID;
            this.btnThumb[0].id = "jqxScrollThumb" + elID;
            this.areaUp[0].id = "jqxScrollAreaUp" + elID;
            this.areaDown[0].id = "jqxScrollAreaDown" + elID;
            this.scrollWrap[0].id = "jqxScrollWrap" + elID;
            this.scrollOuterWrap[0].id = "jqxScrollOuterWrap" + elID;

            if (!this.host.jqxRepeatButton) {
                throw new Error('jqxScrollBar: Missing reference to jqxbuttons.js.');
                return;
            }

            this.btnUp.jqxRepeatButton({_ariaDisabled: true, overrideTheme: true, disabled: this.disabled });
            this.btnDown.jqxRepeatButton({ _ariaDisabled: true, overrideTheme: true, disabled: this.disabled });
            this.btnDownInstance = $.data(this.btnDown[0], 'jqxRepeatButton').instance;
            this.btnUpInstance = $.data(this.btnUp[0], 'jqxRepeatButton').instance;

            this.areaUp.jqxRepeatButton({_scrollAreaButton: true, _ariaDisabled: true, overrideTheme: true });
            this.areaDown.jqxRepeatButton({ _scrollAreaButton: true, _ariaDisabled: true, overrideTheme: true });
            this.btnThumb.jqxButton({ _ariaDisabled: true, overrideTheme: true, disabled: this.disabled });
            this.propertyChangeMap['value'] = function (instance, key, oldVal, value) {
                if (!(isNaN(value))) {
                    if (oldVal != value) {
                        instance.setPosition(parseFloat(value), true);
                    }
                }
            }

            this.propertyChangeMap['width'] = function (instance, key, oldVal, value) {
                if (instance.width != undefined && parseInt(instance.width) > 0) {
                    instance.host.width(parseInt(instance.width));
                    instance._arrange();
                }
            }

            this.propertyChangeMap['height'] = function (instance, key, oldVal, value) {
                if (instance.height != undefined && parseInt(instance.height) > 0) {
                    instance.host.height(parseInt(instance.height));
                    instance._arrange();
                }
            }

            this.propertyChangeMap['theme'] = function (instance, key, oldVal, value) {
                instance.setTheme();
            }

            this.propertyChangeMap['max'] = function (instance, key, oldVal, value) {
                if (!(isNaN(value))) {
                    if (oldVal != value) {
                        instance.max = parseInt(value);
                        if (instance.min > instance.max)
                            instance.max = instance.min + 1;

                        instance._arrange();
                        instance.setPosition(instance.value);
                    }
                }
            }

            this.propertyChangeMap['min'] = function (instance, key, oldVal, value) {
                if (!(isNaN(value))) {
                    if (oldVal != value) {
                        instance.min = parseInt(value);
                        if (instance.min > instance.max)
                            instance.max = instance.min + 1;

                        instance._arrange();
                        instance.setPosition(instance.value);
                    }
                }
            }

            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (oldVal != value) {
                    if (value) {
                        instance.host.addClass(instance.toThemeProperty('jqx-fill-state-disabled'));
                    }
                    else {
                        instance.host.removeClass(instance.toThemeProperty('jqx-fill-state-disabled'));
                    }
                    instance.btnUp.jqxRepeatButton('disabled', instance.disabled);
                    instance.btnDown.jqxRepeatButton('disabled', instance.disabled);
                    instance.btnThumb.jqxButton('disabled', instance.disabled);
                }
            }

            this.propertyChangeMap['touchMode'] = function (instance, key, oldVal, value) {
                if (oldVal != value) {
                    instance._updateTouchBehavior();
                    if (value === true) {
                        instance.showButtons = false;
                        instance.refresh();
                    }
                    else if (value === false) {
                        instance.showButtons = true;
                        instance.refresh();
                    }
                }
            }

            this.buttonUpCapture = false;
            this.buttonDownCapture = false;
            this._updateTouchBehavior();
            this.setPosition(this.value);
            this._addHandlers();
            this.setTheme();
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._arrange();
        },

        _updateTouchBehavior: function () {
            this.isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    this.setTheme();
                    return;
                }

                this.isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.btnThumb[0]);
                this._removeHandlers();
                this._addHandlers();
                this.setTheme();
            }
            else if (this.touchMode == false) {
                this.isTouchDevice = false;
            }
        },

        _addHandlers: function () {
            var self = this;

            var touchSupport = false;
            try
            {
                if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                    touchSupport = true;
                    this._touchSupport = true;
                }
            }
            catch(err)
            {
            }

            if (self.isTouchDevice || touchSupport) {
                this.addHandler(this.btnThumb, $.jqx.mobile.getTouchEventName('touchend'), function (event) {
                    var btnThumbPressedClass = self.vertical ? self.toThemeProperty('jqx-scrollbar-thumb-state-pressed') : self.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal');
                    var btnThumbPressedFillClass = self.toThemeProperty('jqx-fill-state-pressed');
                    self.btnThumb.removeClass(btnThumbPressedClass);
                    self.btnThumb.removeClass(btnThumbPressedFillClass);
                    if (!self.disabled) self.handlemouseup(self, event);
                    return false;
                });

                this.addHandler(this.btnThumb, $.jqx.mobile.getTouchEventName('touchstart'), function (event) {
                    if (!self.disabled) {
                        if (self.touchMode == true) {
                            event.clientX = event.originalEvent.clientX;
                            event.clientY = event.originalEvent.clientY;
                        }
                        else {
                            var e = event;
                            if (e.originalEvent.touches && e.originalEvent.touches.length) {
                                event.clientX = e.originalEvent.touches[0].clientX;
                                event.clientY = e.originalEvent.touches[0].clientY;
                            }
                            else {
                                event.clientX = event.originalEvent.clientX;
                                event.clientY = event.originalEvent.clientY;
                            }
                        }

                        self.handlemousedown(event);
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                    }
                });

                $.jqx.mobile.touchScroll(this.element, self.max, function (left, top, dx, dy, event) {
                    if (self.host.css('visibility') == 'visible') {
                        if (self.touchMode == true) {
                            event.clientX = event.originalEvent.clientX;
                            event.clientY = event.originalEvent.clientY;
                        }
                        else {
                            var e = event;
                            if (e.originalEvent.touches && e.originalEvent.touches.length) {
                                event.clientX = e.originalEvent.touches[0].clientX;
                                event.clientY = e.originalEvent.touches[0].clientY;
                            }
                            else {
                                event.clientX = event.originalEvent.clientX;
                                event.clientY = event.originalEvent.clientY;
                            }
                        }
                        var btnThumbPressedClass = self.vertical ? self.toThemeProperty('jqx-scrollbar-thumb-state-pressed') : self.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal');
                        self.btnThumb.addClass(btnThumbPressedClass);
                        self.btnThumb.addClass(self.toThemeProperty('jqx-fill-state-pressed'));
                        self.thumbCapture = true;
                        self.handlemousemove(event);
                    }
                }, self.element.id);
            }

            this.addHandler(this.btnUp, 'click', function (event) {
                var step = self.step;
                if (self.rtl && !self.vertical) {
                    step = -self.step;
                }

                if (self.buttonUpCapture && !self.isTouchDevice) {
                    if (!self.disabled) {
                        self.setPosition(self.value - step);
                    }
                }
                else if (!self.disabled && self.isTouchDevice) {
                    self.setPosition(self.value - step);
                }
            });
            this.addHandler(this.btnDown, 'click', function (event) {
                var step = self.step;
                if (self.rtl && !self.vertical) {
                    step = -self.step;
                }

                if (self.buttonDownCapture && !self.isTouchDevice) {
                    if (!self.disabled) self.setPosition(self.value + step)
                }
                else if (!self.disabled && self.isTouchDevice) self.setPosition(self.value + step);
            });

            if (!this.isTouchDevice) {
                try
                {
                    if (document.referrer != "" || window.frameElement) {
                        if (window.top != null && window.top != window.self) {
                            var parentLocation = null;
                            if (window.parent && document.referrer) {
                                parentLocation = document.referrer;
                            }

                            if (parentLocation && parentLocation.indexOf(document.location.host) != -1) {
                                var eventHandle = function (event) {
                                    if (!self.disabled) self.handlemouseup(self, event);
                                };

                                if (window.top.document.addEventListener) {
                                    window.top.document.addEventListener('mouseup', eventHandle, false);

                                } else if (window.top.document.attachEvent) {
                                    window.top.document.attachEvent("on" + 'mouseup', eventHandle);
                                }
                            }
                        }
                    }
                }
                catch (error) {
                }

                this.addHandler(this.btnDown, 'mouseup', function (event) {
                    if (!self.btnDownInstance.base.disabled && self.buttonDownCapture) {
                        self.buttonDownCapture = false;
                        self.btnDown.removeClass(self.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                        self.btnDown.removeClass(self.toThemeProperty('jqx-fill-state-pressed'));
                        self._removeArrowClasses('pressed', 'down');
                        self.handlemouseup(self, event);
                        var step = self.step;
                        if (self.rtl && !self.vertical) {
                            step = -self.step;
                        }
                        self.setPosition(self.value + step)
                        return false;
                    }
                });
                this.addHandler(this.btnUp, 'mouseup', function (event) {
                    if (!self.btnUpInstance.base.disabled && self.buttonUpCapture) {
                        self.buttonUpCapture = false;
                        self.btnUp.removeClass(self.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                        self.btnUp.removeClass(self.toThemeProperty('jqx-fill-state-pressed'));
                        self._removeArrowClasses('pressed', 'up');
                        self.handlemouseup(self, event);
                        var step = self.step;
                        if (self.rtl && !self.vertical) {
                            step = -self.step;
                        }
                        self.setPosition(self.value - step)
                        return false;
                    }
                });

                this.addHandler(this.btnDown, 'mousedown', function (event) {
                    if (!self.btnDownInstance.base.disabled) {
                        self.buttonDownCapture = true;
                        self.btnDown.addClass(self.toThemeProperty('jqx-fill-state-pressed'));
                        self.btnDown.addClass(self.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                        self._addArrowClasses('pressed', 'down');
                        return false;
                    }
                });
                this.addHandler(this.btnUp, 'mousedown', function (event) {
                    if (!self.btnUpInstance.base.disabled) {
                        self.buttonUpCapture = true;
                        self.btnUp.addClass(self.toThemeProperty('jqx-fill-state-pressed'));
                        self.btnUp.addClass(self.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                        self._addArrowClasses('pressed', 'up');
                        return false;
                    }
                });
            }

            var eventName = 'click';
            if (this.isTouchDevice) {
                eventName = $.jqx.mobile.getTouchEventName('touchend');
            }

            this.addHandler(this.areaUp, eventName, function (event) {
                if (!self.disabled) {
                    var step = self.largestep;
                    if (self.rtl && !self.vertical) {
                        step = -self.largestep;
                    }

                    self.setPosition(self.value - step); return false;
                }
            });
            this.addHandler(this.areaDown, eventName, function (event) {
                if (!self.disabled) {
                    var step = self.largestep;
                    if (self.rtl && !self.vertical) {
                        step = -self.largestep;
                    }
                    self.setPosition(self.value + step);
                    return false;
                }
            });
            this.addHandler(this.areaUp, 'mousedown', function (event) { if (!self.disabled) { self.areaUpCapture = true; return false; } });
            this.addHandler(this.areaDown, 'mousedown', function (event) { if (!self.disabled) { self.areaDownCapture = true; return false; } });

            this.addHandler(this.btnThumb, 'mousedown', function (event) {
                if (!self.disabled) {
                    self.handlemousedown(event);
                }
                return false;
            });
            this.addHandler(this.btnThumb, 'dragstart', function (event) {
                return false;
            });

            this.addHandler($(document), 'mouseup.' + this.element.id, function (event) { if (!self.disabled) self.handlemouseup(self, event); });

            if (!this.isTouchDevice) {
                this.mousemoveFunc = function (event) {
                    if (!self.disabled) {
                        self.handlemousemove(event);
                    }
                }

                this.addHandler($(document), 'mousemove.' + this.element.id, this.mousemoveFunc);
                this.addHandler($(document), 'mouseleave.' + this.element.id, function (event) { if (!self.disabled) self.handlemouseleave(event); });
                this.addHandler($(document), 'mouseenter.' + this.element.id, function (event) { if (!self.disabled) self.handlemouseenter(event); });

                if (!self.disabled) {
                    this.addHandler(this.btnUp, 'mouseenter', function () {
                        if (!self.disabled && !self.btnUpInstance.base.disabled && self.touchMode != true) {
                            self.btnUp.addClass(self.toThemeProperty('jqx-scrollbar-button-state-hover'));
                            self.btnUp.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                            self._addArrowClasses('hover', 'up');
                        }});
                    this.addHandler(this.btnUp, 'mouseleave', function () {
                        if (!self.disabled && !self.btnUpInstance.base.disabled && self.touchMode != true) {
                            self.btnUp.removeClass(self.toThemeProperty('jqx-scrollbar-button-state-hover'));
                            self.btnUp.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                            self._removeArrowClasses('hover', 'up');                       
                        }});

                    var thumbHoverClass = self.toThemeProperty('jqx-scrollbar-thumb-state-hover');
                    if (!self.vertical) {
                        thumbHoverClass = self.toThemeProperty('jqx-scrollbar-thumb-state-hover-horizontal');
                    }

                    this.addHandler(this.btnThumb, 'mouseenter', function () {
                        if (!self.disabled && self.touchMode != true) {
                            self.btnThumb.addClass(thumbHoverClass);
                            self.btnThumb.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                        }
                    });

                    this.addHandler(this.btnThumb, 'mouseleave', function () {
                        if (!self.disabled && self.touchMode != true) {
                            self.btnThumb.removeClass(thumbHoverClass);
                            self.btnThumb.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                        }
                    });

                    this.addHandler(this.btnDown, 'mouseenter', function () {
                        if (!self.disabled && !self.btnDownInstance.base.disabled && self.touchMode != true) {
                            self.btnDown.addClass(self.toThemeProperty('jqx-scrollbar-button-state-hover'));
                            self.btnDown.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                            self._addArrowClasses('hover', 'down');
                        }
                    });

                    this.addHandler(this.btnDown, 'mouseleave', function () {
                        if (!self.disabled && !self.btnDownInstance.base.disabled && self.touchMode != true) {
                            self.btnDown.removeClass(self.toThemeProperty('jqx-scrollbar-button-state-hover'));
                            self.btnDown.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                            self._removeArrowClasses('hover', 'down');
                        }
                    });
                }
            }
        },

        destroy: function () {
            var btnUp = this.btnUp;
            var btnDown = this.btnDown;
            var btnThumb = this.btnThumb;
            var elWrap = this.scrollWrap;
            var areaUp = this.areaUp;
            var areaDown = this.areaDown;

            this.arrowUp.remove();
            delete this.arrowUp;
            this.arrowDown.remove();
            delete this.arrowDown;

            areaDown.removeClass();
            areaUp.removeClass();
            btnDown.removeClass();
            btnUp.removeClass();
            btnThumb.removeClass();

            btnUp.jqxRepeatButton('destroy');
            btnDown.jqxRepeatButton('destroy');
            areaUp.jqxRepeatButton('destroy');
            areaDown.jqxRepeatButton('destroy');
            btnThumb.jqxButton('destroy');
            var vars = $.data(this.element, "jqxScrollBar");

            this._removeHandlers();
            this.btnUp = null;
            this.btnDown = null;
            this.scrollWrap = null;
            this.areaUp = null;
            this.areaDown = null;
            this.scrollOuterWrap = null;
            delete this.mousemoveFunc;
            delete this.btnDownInstance;
            delete this.btnUpInstance;
            delete this.scrollOuterWrap;
            delete this.scrollWrap;          
            delete this.btnDown;
            delete this.areaDown;
            delete this.areaUp;
            delete this.btnDown;
            delete this.btnUp;
            delete this.btnThumb;
            delete this.propertyChangeMap['value'];
            delete this.propertyChangeMap['min'];
            delete this.propertyChangeMap['max'];
            delete this.propertyChangeMap['touchMode'];
            delete this.propertyChangeMap['disabled'];
            delete this.propertyChangeMap['theme'];
            delete this.propertyChangeMap;
            if (vars) {
                delete vars.instance;
            }
            this.host.removeData();
            this.host.remove();
            delete this.host;
            delete this.set;
            delete this.get;
            delete this.call;
            delete this.element;
        },

        _removeHandlers: function () {
            this.removeHandler(this.btnUp, 'mouseenter');
            this.removeHandler(this.btnDown, 'mouseenter');
            this.removeHandler(this.btnThumb, 'mouseenter');
            this.removeHandler(this.btnUp, 'mouseleave');
            this.removeHandler(this.btnDown, 'mouseleave');
            this.removeHandler(this.btnThumb, 'mouseleave');
            this.removeHandler(this.btnUp, 'click');
            this.removeHandler(this.btnDown, 'click');
            this.removeHandler(this.btnDown, 'mouseup');
            this.removeHandler(this.btnUp, 'mouseup');
            this.removeHandler(this.btnDown, 'mousedown');
            this.removeHandler(this.btnUp, 'mousedown');
            this.removeHandler(this.areaUp, 'mousedown');
            this.removeHandler(this.areaDown, 'mousedown');
            this.removeHandler(this.areaUp, 'click');
            this.removeHandler(this.areaDown, 'click');
            this.removeHandler(this.btnThumb, 'mousedown');
            this.removeHandler(this.btnThumb, 'dragstart');
            this.removeHandler($(document), 'mouseup.' + this.element.id);
            if (!this.mousemoveFunc) {
                this.removeHandler($(document), 'mousemove.' + this.element.id);
            }
            else {
                this.removeHandler($(document), 'mousemove.' + this.element.id, this.mousemoveFunc);
            }

            this.removeHandler($(document), 'mouseleave.' + this.element.id);
            this.removeHandler($(document), 'mouseenter.' + this.element.id);
            var self = this;
        },

        _addArrowClasses: function (state, button) {
            if (state == 'pressed') state = 'selected';
            if (state != '') {
                state = '-' + state;
            }

            if (this.vertical) {
                if (button == 'up' || button == undefined) {
                    this.arrowUp.addClass(this.toThemeProperty("jqx-icon-arrow-up" + state));
                }

                if (button == 'down' || button == undefined) {
                    this.arrowDown.addClass(this.toThemeProperty("jqx-icon-arrow-down" + state));
                }
            }
            else {
                if (button == 'up' || button == undefined) {
                    this.arrowUp.addClass(this.toThemeProperty("jqx-icon-arrow-left" + state));
                }

                if (button == 'down' || button == undefined) {
                    this.arrowDown.addClass(this.toThemeProperty("jqx-icon-arrow-right" + state));
                }
            }
        },

        _removeArrowClasses: function (state, button) {
            if (state == 'pressed') state = 'selected';
            if (state != '') {
                state = '-' + state;
            }

            if (this.vertical) {
                if (button == 'up' || button == undefined) {
                    this.arrowUp.removeClass(this.toThemeProperty("jqx-icon-arrow-up" + state));
                }

                if (button == 'down' || button == undefined) {
                    this.arrowDown.removeClass(this.toThemeProperty("jqx-icon-arrow-down" + state));
                }
            }
            else {
                if (button == 'up' || button == undefined) {
                    this.arrowUp.removeClass(this.toThemeProperty("jqx-icon-arrow-left" + state));
                }

                if (button == 'down' || button == undefined) {
                    this.arrowDown.removeClass(this.toThemeProperty("jqx-icon-arrow-right" + state));
                }
            }
        },

        setTheme: function () {
            var btnUp = this.btnUp;
            var btnDown = this.btnDown;
            var btnThumb = this.btnThumb;
            var elWrap = this.scrollWrap;
            var areaUp = this.areaUp;
            var areaDown = this.areaDown;
            var arrowUp = this.arrowUp;
            var arrowDown = this.arrowDown;

            this.scrollWrap[0].className = this.toThemeProperty('jqx-reset');
            this.scrollOuterWrap[0].className = this.toThemeProperty('jqx-reset');

            var areaClassName = this.toThemeProperty('jqx-reset');
            this.areaDown[0].className = areaClassName;
            this.areaUp[0].className = areaClassName;

            var hostClass = this.toThemeProperty('jqx-scrollbar') + " " + this.toThemeProperty('jqx-widget') + " " + this.toThemeProperty('jqx-widget-content');
            this.host.addClass(hostClass);
            btnDown[0].className = this.toThemeProperty('jqx-scrollbar-button-state-normal');
            btnUp[0].className = this.toThemeProperty('jqx-scrollbar-button-state-normal');

            var thumbClass = "";
            if (this.vertical) {
                arrowUp[0].className = areaClassName + " " + this.toThemeProperty("jqx-icon-arrow-up");
                arrowDown[0].className = areaClassName + " " + this.toThemeProperty("jqx-icon-arrow-down");
                thumbClass = this.toThemeProperty('jqx-scrollbar-thumb-state-normal');
            }
            else {
                arrowUp[0].className = areaClassName + " " + this.toThemeProperty("jqx-icon-arrow-left");
                arrowDown[0].className = areaClassName + " " + this.toThemeProperty("jqx-icon-arrow-right");
                thumbClass = this.toThemeProperty('jqx-scrollbar-thumb-state-normal-horizontal');
            }
            thumbClass += " " + this.toThemeProperty('jqx-fill-state-normal');

            btnThumb[0].className = thumbClass;

            if (this.disabled) {
                elWrap.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                elWrap.removeClass(this.toThemeProperty('jqx-scrollbar-state-normal'));
            }
            else {
                elWrap.addClass(this.toThemeProperty('jqx-scrollbar-state-normal'));
                elWrap.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }

            if (this.roundedCorners == 'all') {
                this.host.addClass(this.toThemeProperty('jqx-rc-all'));
                if (this.vertical) {
                    var rct = $.jqx.cssroundedcorners('top');
                    rct = this.toThemeProperty(rct);
                    btnUp.addClass(rct);

                    var rcb = $.jqx.cssroundedcorners('bottom');
                    rcb = this.toThemeProperty(rcb);
                    btnDown.addClass(rcb);

                }
                else {
                    var rcl = $.jqx.cssroundedcorners('left');
                    rcl = this.toThemeProperty(rcl);
                    btnUp.addClass(rcl);

                    var rcr = $.jqx.cssroundedcorners('right');
                    rcr = this.toThemeProperty(rcr);
                    btnDown.addClass(rcr);
                }
            }
            else {
                var rc = $.jqx.cssroundedcorners(this.roundedCorners);
                rc = this.toThemeProperty(rc);
                elBtnUp.addClass(rc);
                elBtnDown.addClass(rc);
            }

            var rc = $.jqx.cssroundedcorners(this.roundedCorners);
            rc = this.toThemeProperty(rc);
            if (!btnThumb.hasClass(rc)) {
                btnThumb.addClass(rc);
            }

            if (this.isTouchDevice && this.touchModeStyle != false) {
                this.showButtons = false;
                btnThumb.addClass(this.toThemeProperty('jqx-scrollbar-thumb-state-normal-touch'));
            }
        },

        // returns true, if the user is dragging the thumb or the increase or decrease button is pressed.
        isScrolling: function () {
            if (this.thumbCapture == undefined || this.buttonDownCapture == undefined || this.buttonUpCapture == undefined || this.areaDownCapture == undefined || this.areaUpCapture == undefined)
                return false;

            return this.thumbCapture || this.buttonDownCapture || this.buttonUpCapture || this.areaDownCapture || this.areaUpCapture;
        },

        handlemousedown: function (event) {
            if (this.thumbCapture == undefined || this.thumbCapture == false) {
                this.thumbCapture = true;
                var btnThumb = this.btnThumb;
                if (btnThumb != null) {
                    btnThumb.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                    if (this.vertical) {
                        btnThumb.addClass(this.toThemeProperty('jqx-scrollbar-thumb-state-pressed'));
                    }
                    else {
                        btnThumb.addClass(this.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal'));
                    }
                }
            }

            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;
            this.dragStartValue = this.value;
        },

        toggleHover: function (event, element) {
            //element.toggleClass('jqx-fill-state-hover');
        },

        refresh: function () {
            this._arrange();
        },

        _setElementPosition: function (element, x, y) {
            if (!isNaN(x)) {
                if (parseInt(element[0].style.left) != parseInt(x)) {
                    element[0].style.left = x + 'px';
                }
            }
            if (!isNaN(y)) {
                if (parseInt(element[0].style.top) != parseInt(y)) {
                    element[0].style.top = y + 'px';
                }
            }
        },

        _setElementTopPosition: function (element, y) {
            if (!isNaN(y)) {
                element[0].style.top = y + 'px';
            }
        },

        _setElementLeftPosition: function (element, x) {
            if (!isNaN(x)) {
                element[0].style.left = x + 'px';
            }
        },

        handlemouseleave: function (event) {
            var btnUp = this.btnUp;
            var btnDown = this.btnDown;
                   
            if (this.buttonDownCapture || this.buttonUpCapture) {
                btnUp.removeClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                btnDown.removeClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                this._removeArrowClasses('pressed');
            }
         
            if (this.thumbCapture != true)
                return;

            var btnThumb = this.btnThumb;
            var btnThumbPressedClass = this.vertical ? this.toThemeProperty('jqx-scrollbar-thumb-state-pressed') : this.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal');
            btnThumb.removeClass(btnThumbPressedClass);
            btnThumb.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
        },

        handlemouseenter: function (event) {
            var btnUp = this.btnUp;
            var btnDown = this.btnDown;

            if (this.buttonUpCapture) {
                btnUp.addClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                btnUp.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                this._addArrowClasses('pressed', 'up');
            }

            if (this.buttonDownCapture) {
                btnDown.addClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                btnDown.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                this._addArrowClasses('pressed', 'down');
            }

            if (this.thumbCapture != true)
                return;

            var btnThumb = this.btnThumb;
            if (this.vertical) {
                btnThumb.addClass(this.toThemeProperty('jqx-scrollbar-thumb-state-pressed'));
            }
            else {
                btnThumb.addClass(this.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal'));
            }
            btnThumb.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
        },

        handlemousemove: function (event) {
            var btnUp = this.btnUp;
            var btnDown = this.btnDown;
            var which = 0;

            if (btnDown == null || btnUp == null)
                return;

            if (btnUp != null && btnDown != null && this.buttonDownCapture != undefined && this.buttonUpCapture != undefined) {
                if (this.buttonDownCapture && event.which == which) {
                    btnDown.removeClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                    btnDown.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                    this._removeArrowClasses('pressed', 'down');

                    this.buttonDownCapture = false;
                }
                else if (this.buttonUpCapture && event.which == which) {
                    btnUp.removeClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                    btnUp.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                    this._removeArrowClasses('pressed', 'up');
                    this.buttonUpCapture = false;
                }
            }

            if (this.thumbCapture != true)
                return false;

            var btnThumb = this.btnThumb;

            if (event.which == which && !this.isTouchDevice && !this._touchSupport) {
                this.thumbCapture = false;
                this._arrange();
                var btnThumbPressedClass = this.vertical ? this.toThemeProperty('jqx-scrollbar-thumb-state-pressed') : this.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal');
                btnThumb.removeClass(btnThumbPressedClass);
                btnThumb.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                return true;
            }

            if (event.preventDefault != undefined) {
                event.preventDefault();
            }

            if (event.originalEvent != null) {
                event.originalEvent.mouseHandled = true;
            }

            if (event.stopPropagation != undefined) {
                event.stopPropagation();
            }

            var diff = 0;

            try {
                if (!this.vertical)
                    diff = event.clientX - this.dragStartX;
                else
                    diff = event.clientY - this.dragStartY;
                var btnAndThumbSize = this._btnAndThumbSize;
                if (!this._btnAndThumbSize) {
                    btnAndThumbSize = (this.vertical) ?
                    btnUp.height() + btnDown.height() + btnThumb.height() :
                    btnUp.width() + btnDown.width() + btnThumb.width();
                }

                var ratio = (this.max - this.min) / (this.scrollBarSize - btnAndThumbSize);
                if (this.thumbStep == 'auto') {
                    diff *= ratio;
                }
                else {
                    diff *= ratio;
                    if (Math.abs(this.dragStartValue + diff - this.value) >= parseInt(this.thumbStep)) {
                        var step = Math.round(parseInt(diff) / this.thumbStep) * this.thumbStep;
                        if (this.rtl && !this.vertical) {
                            this.setPosition(this.dragStartValue - step);
                        }
                        else {
                            this.setPosition(this.dragStartValue + step);
                        }
                        return false;
                    }
                    else {
                        return false;
                    }
                }

                var step = diff;
                if (this.rtl && !this.vertical) {
                    step = -diff;
                }

                this.setPosition(this.dragStartValue + step);
            }
            catch (error) {
                alert(error);
            }

            return false;
        },

        handlemouseup: function (self, event) {
            var prevent = false;
        
            if (this.thumbCapture) {
                this.thumbCapture = false;

                var btnThumb = this.btnThumb;
                var btnThumbPressedClass = this.vertical ? this.toThemeProperty('jqx-scrollbar-thumb-state-pressed') : this.toThemeProperty('jqx-scrollbar-thumb-state-pressed-horizontal');
                btnThumb.removeClass(btnThumbPressedClass);
                btnThumb.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                prevent = true;
                this._mouseup = new Date();
            }

            this.areaDownCapture = this.areaUpCapture = false;
            if (this.buttonUpCapture || this.buttonDownCapture) {
                var btnUp = this.btnUp;
                var btnDown = this.btnDown;

                this.buttonUpCapture = false;
                this.buttonDownCapture = false;
                btnUp.removeClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                btnDown.removeClass(this.toThemeProperty('jqx-scrollbar-button-state-pressed'));
                btnUp.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                btnDown.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                this._removeArrowClasses('pressed');

                prevent = true;
                this._mouseup = new Date();
            }

            if (prevent) {
                if (event.preventDefault != undefined) {
                    event.preventDefault();
                }

                if (event.originalEvent != null) {
                    event.originalEvent.mouseHandled = true;
                }

                if (event.stopPropagation != undefined) {
                    event.stopPropagation();
                }
            }
        },

        // sets the value.
        // @param Number. Sets the ScrollBar's value.
        setPosition: function (position, update) {
            var element = this.element;

            if (position == undefined || position == NaN)
                position = this.min;

            if (position >= this.max) {
                position = this.max;
            }

            if (position < this.min) {
                position = this.min;
            }

            if (this.value !== position || update == true) {
                if (position == this.max) {
                    var completeEvent = new jQuery.Event('complete');
                    this.host.trigger(completeEvent);
                }
                var oldvalue = this.value;
                if (this._triggervaluechanged) {
                    var event = new jQuery.Event('valuechanged');
                    event.previousValue = this.value;
                    event.currentValue = position;
                }

                this.value = position;
                this._positionelements();
                //this._arrange();

                if (this._triggervaluechanged) {
                    this.host.trigger(event);
                }

                if (this.valuechanged) {
                    this.valuechanged({ currentValue: this.value, previousvalue: oldvalue });
                }
            }

            return position;
        },

        _getThumbSize: function (scrollLen) {
            var diff = this.max - this.min;

            var size = 0;
            if (diff > 1) {
                size = (scrollLen / (diff + scrollLen) * scrollLen);
            }
            else if (diff == 1) {
                size = scrollLen;
            }

            if (this.thumbSize > 0) {
                size = this.thumbSize;
            }

            if (size < this.thumbMinSize)
                size = this.thumbMinSize;

            return Math.min(size, scrollLen);
        },

        _positionelements: function () {
            var element = this.element;
            var elAreaUp = this.areaUp;
            var elAreaDown = this.areaDown;
            var elBtnUp = this.btnUp;
            var elBtnDown = this.btnDown;
            var elThumb = this.btnThumb;
            var elWrap = this.scrollWrap;

            var height = this._height ? this._height : this.host.height();
            var width = this._width ? this._width : this.host.width();

            var btnSize = (!this.vertical) ? height : width;
            if (!this.showButtons) {
                btnSize = 0;
            }

            var scrollBarSize = (!this.vertical) ? width : height;
            this.scrollBarSize = scrollBarSize;
            var thumbSize = this._getThumbSize(scrollBarSize - 2 * btnSize);
            thumbSize = Math.round(thumbSize);

            if (thumbSize < this.thumbMinSize)
                thumbSize = this.thumbMinSize;

            if (height == NaN || height < 10)
                height = 10;

            if (width == NaN || width < 10)
                width = 10;

            btnSize += 2;
            this.btnSize = btnSize;

            var btnAndThumbSize = this._btnAndThumbSize;

            if (!this._btnAndThumbSize) {
                var btnAndThumbSize = (this.vertical) ?
                2 * this.btnSize + elThumb.outerHeight() :
                2 * this.btnSize + elThumb.outerWidth();

                btnAndThumbSize = Math.round(btnAndThumbSize);
            }

            var upAreaSize = (scrollBarSize - btnAndThumbSize) / (this.max - this.min) * (this.value - this.min);
            if (this.rtl && !this.vertical) {
                upAreaSize = (scrollBarSize - btnAndThumbSize) / (this.max - this.min) * (this.max - this.value - this.min);
            }

            upAreaSize = Math.round(upAreaSize);
            if (upAreaSize < 0) {
                upAreaSize = 0;
            }
            if (this.vertical) {
                var newDownSize = scrollBarSize - upAreaSize - btnAndThumbSize;
                if (newDownSize < 0) newDownSize = 0;
                elAreaDown[0].style.height = newDownSize + 'px';
                elAreaUp[0].style.height = upAreaSize + 'px';

                this._setElementTopPosition(elAreaUp, btnSize);
                this._setElementTopPosition(elThumb, btnSize + upAreaSize);
                this._setElementTopPosition(elAreaDown, btnSize + upAreaSize + thumbSize);
            }
            else {
                elAreaUp[0].style.width = upAreaSize + 'px';
                if (scrollBarSize - upAreaSize - btnAndThumbSize >= 0) {
                    elAreaDown[0].style.width = scrollBarSize - upAreaSize - btnAndThumbSize + 'px';
                }
                else {
                    elAreaDown[0].style.width = '0px';
                }

                this._setElementLeftPosition(elAreaUp, btnSize);
                this._setElementLeftPosition(elThumb, btnSize + upAreaSize);
                this._setElementLeftPosition(elAreaDown, 2 + btnSize + upAreaSize + thumbSize);
            }
        },

        _arrange: function () {
            if (this._initialLayout) {
                this._initialLayout = false;
                return;
            }

            var element = this.element;
            var elAreaUp = this.areaUp;
            var elAreaDown = this.areaDown;
            var elBtnUp = this.btnUp;
            var elBtnDown = this.btnDown;
            var elThumb = this.btnThumb;
            var elWrap = this.scrollWrap;

            var height = parseInt(this.element.style.height);
            var width = parseInt(this.element.style.width);
            if (this.isPercentage) {
                var height = this.host.height();
                var width = this.host.width();
            }
           
            if (isNaN(height)) height = 0;
            if (isNaN(width)) width = 0;

            this._width = width;
            this._height = height;
            var btnSize = (!this.vertical) ? height : width;
            if (!this.showButtons) {
                btnSize = 0;
            }

            elBtnUp[0].style.width = btnSize + 'px';
            elBtnUp[0].style.height = btnSize + 'px';
            elBtnDown[0].style.width = btnSize + 'px';
            elBtnDown[0].style.height = btnSize + 'px';

            if (this.vertical) {
                elWrap[0].style.width = width + 2 + 'px';
            }
            else {
                elWrap[0].style.height = height + 2 + 'px';
            }

            // position the up button
            this._setElementPosition(elBtnUp, 0, 0);

            var btnSizeAndBorder = btnSize + 2;
            // position the down button
            if (this.vertical) {
                this._setElementPosition(elBtnDown, 0, height - btnSizeAndBorder);
            }
            else {
                this._setElementPosition(elBtnDown, width - btnSizeAndBorder, 0);
            }

            var scrollBarSize = (!this.vertical) ? width : height;
            this.scrollBarSize = scrollBarSize;
            var thumbSize = this._getThumbSize(scrollBarSize - 2 * btnSize);
            thumbSize = Math.round(thumbSize);

            if (thumbSize < this.thumbMinSize)
                thumbSize = this.thumbMinSize;

            var touchStyle = false;
            if (this.isTouchDevice && this.touchModeStyle != false) {
                touchStyle = true;
            }

            if (!this.vertical) {
                elThumb[0].style.width = thumbSize + 'px';
                elThumb[0].style.height = height + 'px';
                if (touchStyle && this.thumbTouchSize !== 0) {
                    elThumb.css({ height: this.thumbTouchSize + 'px' });
                    elThumb.css('margin-top', (this.host.height() - this.thumbTouchSize) / 2);
                }
            }
            else {
                elThumb[0].style.width = width + 'px';
                elThumb[0].style.height = thumbSize + 'px';

                if (touchStyle && this.thumbTouchSize !== 0) {
                    elThumb.css({ width: this.thumbTouchSize + 'px' });
                    elThumb.css('margin-left', (this.host.width() - this.thumbTouchSize) / 2);
                }
            }

            if (height == NaN || height < 10)
                height = 10;

            if (width == NaN || width < 10)
                width = 10;

            btnSize += 2;
            this.btnSize = btnSize;

            var btnAndThumbSize = (this.vertical) ?
                2 * this.btnSize + (2 + parseInt(elThumb[0].style.height)) :
                2 * this.btnSize + (2 + parseInt(elThumb[0].style.width));

            btnAndThumbSize = Math.round(btnAndThumbSize);
            this._btnAndThumbSize = btnAndThumbSize;

            var upAreaSize = (scrollBarSize - btnAndThumbSize) / (this.max - this.min) * (this.value - this.min);
            if (this.rtl && !this.vertical) {
                upAreaSize = (scrollBarSize - btnAndThumbSize) / (this.max - this.min) * (this.max - this.value - this.min);
            }
            upAreaSize = Math.round(upAreaSize);
            if (upAreaSize === -Infinity || upAreaSize == Infinity) upAreaSize = 0;
            if (isNaN(upAreaSize)) {
                upAreaSize = 0;
            }
            if (upAreaSize < 0) {
                upAreaSize = 0;
            }

            if (this.vertical) {
                var newAreaHeight = (scrollBarSize - upAreaSize - btnAndThumbSize);
                if (newAreaHeight < 0) newAreaHeight = 0;
                elAreaDown[0].style.height = newAreaHeight + 'px';
                elAreaDown[0].style.width = width + 'px';
                elAreaUp[0].style.height = upAreaSize + 'px';
                elAreaUp[0].style.width = width + 'px';

                var hostHeight = parseInt(this.element.style.height);
                if (this.isPercentage) {
                    hostHeight = this.host.height();
                }

                elThumb[0].style.visibility = 'inherit';

                if (hostHeight - 3 * parseInt(btnSize) < 0) {
                    elThumb[0].style.visibility = 'hidden';
                }
                else if (hostHeight < btnAndThumbSize) {
                    elThumb[0].style.visibility = 'hidden';
                }
                else if (this.element.style.visibility == 'visible') {
                    elThumb[0].style.visibility = 'inherit';
                }

                this._setElementPosition(elAreaUp, 0, btnSize);
                this._setElementPosition(elThumb, 0, btnSize + upAreaSize);
                this._setElementPosition(elAreaDown, 0, btnSize + upAreaSize + thumbSize);
            }
            else {
                if (upAreaSize > 0) {
                    elAreaUp[0].style.width = upAreaSize + 'px';
                }
                if (height > 0) {
                    elAreaUp[0].style.height = height + 'px';
                }
                var newAreaWidth = (scrollBarSize - upAreaSize - btnAndThumbSize);
                if (newAreaWidth < 0) newAreaWidth = 0;

                elAreaDown[0].style.width = newAreaWidth + 'px';
                elAreaDown[0].style.height = height + 'px';

                var hostWidth = parseInt(this.element.style.width);
                if (this.isPercentage) {
                    hostWidth = this.host.width();
                }

                elThumb[0].style.visibility = 'inherit';
                if (hostWidth - 3 * parseInt(btnSize) < 0) {
                    elThumb[0].style.visibility = 'hidden';
                }
                else if (hostWidth < btnAndThumbSize) {
                    elThumb[0].style.visibility = 'hidden';
                }
                else if (this.element.style.visibility == 'visible') {
                    elThumb[0].style.visibility = 'inherit';
                }

                this._setElementPosition(elAreaUp, btnSize, 0);
                this._setElementPosition(elThumb, btnSize + upAreaSize, 0);
                this._setElementPosition(elAreaDown, 2 + btnSize + upAreaSize + thumbSize, 0);
            }
        }
    }); // jqxScrollBar
})(jQuery);

