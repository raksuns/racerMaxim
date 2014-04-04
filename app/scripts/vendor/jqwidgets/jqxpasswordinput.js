/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/



(function ($) {

    $.jqx.jqxWidget("jqxPasswordInput", "", {});

    $.extend($.jqx._jqxPasswordInput.prototype, {

        defineInstance: function () {
            //// properties
            this.width = null;
            this.height = null;
            this.disabled = false; // possible values: true, false
            this.rtl = false; // possible values: true, false
            this.placeHolder = null;
            this.showStrength = false; // possible values: true, false
            this.showStrengthPosition = 'right'; // possible values: top, bottom, left, right
            this.maxLength = null;
            this.minLength = null;
            this.showPasswordIcon = true; // possible values: true, false
            this.strengthTypeRenderer = null; // callback function
            this.passwordStrength = null; // callback function
            this.localization = { passwordStrengthString: "Password strength", tooShort: "Too short", weak: "Weak", fair: "Fair", good: "Good", strong: "Strong", showPasswordString: "Show Password" };
            this.strengthColors = { tooShort: "rgb(170, 0, 51)", weak: "rgb(170, 0, 51)", fair: "rgb(255, 204, 51)", good: "rgb(45, 152, 243)", strong: "rgb(118, 194, 97)" };
        },

        createInstance: function (args) {
            // renders the widget
            this.render();
        },

        //// methods

        // public methods

        // renders the widget
        render: function () {
            var browser = $.jqx.browser.browser;
            var version = $.jqx.browser.version;
            // checks if the user's browser is not Internet Explorer 7 or 8
            this._browserCheck = browser != "msie" || (version != "7.0" && version != "8.0");
            this.widgetID = this.element.id;
            var widget = this.host;

            if (this._browserCheck) {
                var typeExceptionMessage = "Invalid input type. Please set the type attribute of the input element to password.";
                try {
                    if (widget.attr("type") != "password") {
                        throw typeExceptionMessage;
                    };
                } catch (exception) {
                    alert(exception);
                };

                try {
                    widget.attr("type", "password");
                }
                catch (error) {
                    alert(error);
                }
            }

            this._hidden = true;

            // sets the widget's attributes according to the set properties
            this._setAttributes();

            // sets the widget's theme and classes
            this._setTheme();

            // appends the Show password icon
            this._showPassword();

            // appends the Show strength tooltip
            this._showStrength();
        },

        // refreshes the widget
        refresh: function (initialRefresh) {
            if (initialRefresh == true) {
                return;
            };

            this.removeHandler(this.host, 'focus.passwordinput' + this.widgetID);
            this.removeHandler(this.host, 'blur.passwordinput' + this.widgetID);
            this.removeHandler(this.host, 'click.passwordinput' + this.widgetID);
            this.removeHandler($(window), 'resize.passwordinput' + this.widgetID);
            this.removeHandler(this.host, 'keyup.passwordinput' + this.widgetID);
            this.removeHandler(icon, 'mousedown.passwordinput' + this.iconID);
            this.removeHandler(icon, 'mouseup.passwordinput' + this.iconID);
            this.removeHandler($(document), 'mousedown.passwordinput' + this.iconID);
            this._setAttributes();
            this._setTheme();
            this._showPassword();
            this._showStrength();
        },

        // gets or sets the password's value
        val: function (value) {
            if ($.isEmptyObject(value) && value != "") {
                return this.element.value;
            } else {
                this.element.value = value;
            };
        },

        // private methods

        // called when a property is changed
        propertyChangedHandler: function (object, key, oldvalue, value) {
            var widget = this.host;
            if (key == "placeHolder") {
                if (this._browserCheck) {
                    if ("placeholder" in this.element) {
                        widget.attr("placeholder", this.placeHolder);
                    } else {
                        if (widget.val() == "") {
                            widget.attr("type", "text");
                            widget.val(this.placeHolder);
                        } else if (widget.val() == oldvalue) {
                            widget.val(this.placeHolder);
                        };
                    };
                };
            } else {
                this.refresh();
            };
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.host.width(this.width);
            this.host.height(this.height);
        },

        // sets the widget's attributes according to the set properties
        _setAttributes: function () {
            var me = this;
            var widget = this.host;

            // sets the widget's width and height
            widget.width(this.width);
            widget.height(this.height);

            // sets the maximum number of characters in the password
            if (this.maxLength) {
                widget.attr("maxlength", this.maxLength);
            };
            if (this.minLength) {
                widget.attr("minLength", this.minLength);
            };

            // sets the placeholder text
            if (this.placeHolder && this._browserCheck) {
                if ("placeholder" in this.element) {
                    widget.attr("placeholder", this.placeHolder);
                } else {
                    if (widget.val() == "") {
                        widget.attr("type", "text");
                        widget.val(this.placeHolder);
                    };
                };
            };

            // checks if the widget is disabled
            if (this.disabled == true) {
                widget.attr("disabled", "disabled");
            } else {
                widget.removeAttr("disabled");
            };

            // binds to the click event
            this.addHandler(widget, 'click.passwordinput' + this.widgetID, function () {
                if (me.showPasswordIcon && me.icon) {
                    me.icon.show();
                    me._positionIcon();
                }
            });

            me.interval = null;
            this.addHandler(widget, 'keydown.passwordinput' + this.widgetID, function () {
                if (me.showPasswordIcon && me.icon) {
                    if (me.interval) clearInterval( me.interval);                    
                    var t = 0;
                    me.interval = setInterval(function () {
                        if (me.icon[0].style.display != "none") {
                            me._positionIcon();
                            t++;
                            if (t > 5) {
                                clearInterval(me.interval);
                            }
                        }
                        else {
                            clearInterval(me.interval);
                        }
                        }, 100);
                    }               
            });

            // binds to the focus event
            this.addHandler(widget, 'focus.passwordinput' + this.widgetID, function () {
                me._focused = true;
                me.host.addClass(me.toThemeProperty("jqx-fill-state-focus"));
                if (me.placeHolder && me._browserCheck && !("placeholder" in me.element) && widget.val() == me.placeHolder) {
                    widget.val("");
                    if (me._hidden == true) {
                        widget.attr("type", "password");
                    };
                };
                if (me.val().length > 0) {
                    if (me.showStrength == true) {
                        var cntnt = widget.jqxTooltip("content");
                        if (cntnt) {
                            widget.jqxTooltip('open');
                        };
                    };
                }
                if (me.showPasswordIcon && me.icon) {
                    me.icon.show();
                    me._positionIcon();
                }
            });

            // binds to the blur event
            this.addHandler(widget, 'blur.passwordinput' + this.widgetID, function () {
                me._focused = false;
                me.host.removeClass(me.toThemeProperty("jqx-fill-state-focus"));
                if (me.placeHolder && me._browserCheck && !("placeholder" in me.element) && widget.val() == "") {
                    widget.val(me.placeHolder);
                    widget.attr("type", "text");
                }

                if (me.showPasswordIcon == true && me._browserCheck) {
                    if (me.rtl == false) {
                        me.host.removeClass(me.toThemeProperty("jqx-passwordinput-password-icon-ltr"));
                    } else {
                        me.host.removeClass(me.toThemeProperty("jqx-passwordinput-password-icon-rtl"));
                    }
                }

                if (me.showStrength == true) {
                    widget.jqxTooltip('close');
                }

                if (me.showPasswordIcon && me.icon) {
                    me.icon.hide();
                }
            });
        },

        destroy: function()
        {
            if (this.host.jqxTooltip) {
                this.host.jqxTooltip('destroy');
            }
            this.host.remove();
        },

        // sets the widget's theme and classes
        _setTheme: function () {
            var widget = this.host;

            widget.addClass(this.toThemeProperty("jqx-widget"));
            widget.addClass(this.toThemeProperty("jqx-widget-content"));
            widget.addClass(this.toThemeProperty("jqx-input"));
            widget.addClass(this.toThemeProperty("jqx-rc-all"));

            if (this.rtl == true) {
                widget.addClass(this.toThemeProperty("jqx-rtl"));
                widget.css("direction", "rtl");
            }
            else {
                widget.removeClass(this.toThemeProperty("jqx-rtl"));
                widget.css("direction", "ltr");
            }
        },

        // implements the Show password icon
        _showPassword: function () {
            if (this.showPasswordIcon == true && this._browserCheck) {
                var me = this;
                this.iconID = this.widgetID + "-password-icon";
                $("<span tabindex='-1' hasfocus='false' style='position: absolute; display: none;' id='" + this.iconID + "'></span>").insertAfter(this.host);
                var icon = $("#" + this.iconID);
                this.icon = icon;
                icon.addClass(this.toThemeProperty("jqx-passwordinput-password-icon"));
                icon.attr("title", me.localization.showPasswordString);
                me._positionIcon();
                var hide = function () {
                    me.host.attr("type", "password");
                    me._hidden = true;
                    icon.attr("title", me.localization.showPasswordString);
                }
                var toggle = function () {
                    if (me._hidden == false) {
                        hide();
                    } else if (me._hidden == true) {
                        me.host.attr("type", "text");
                        me._hidden = false;
                    }
                }

                this.addHandler(icon, 'mousedown.passwordinput' + this.iconID, function (event) {
                    toggle();
                    return false;
                });
                this.addHandler(icon, 'mouseup.passwordinput' + this.iconID, function (event) {
                    hide();
                    return false;
                });
                this.addHandler($(document), 'mousedown.passwordinput' + this.iconID, function (event) {
                    if (me._focused) {
                        hide();
                    }
                });

            };
        },

        _positionIcon: function () {
            var hostOffset = this.host.offset();
            var w = this.host.outerWidth();
            var h = this.host.outerHeight();
            if (this.rtl == true) {
                this.icon.offset({ top: parseInt(hostOffset.top + h / 2 - 10 / 2), left: hostOffset.left + 2 });
            } else {
                this.icon.offset({ top: parseInt(hostOffset.top + h / 2 - 10 / 2), left: hostOffset.left + w - 18 });
            };
        },

        // implements the Show strength functionality
        _showStrength: function () {
            if (this.showStrength == true) {
                if (this.host.jqxTooltip != undefined) {
                    var strengthID = this.widgetID + "Strength";
                    var strengthIDV = strengthID + "Value";
                    var strengthIDI = strengthID + "Indicator";
                    var content;

                    if (!this.strengthTypeRenderer) {
                        // default content
                        content = "<div style='width: 220px;' id='" + strengthID + "'><div><span style='font-weight: bold;'>" + this.localization.passwordStrengthString + ": </span><span id='" + strengthIDV + "'></span></div><div id='" + strengthIDI + "'></div></div>";
                    } else {
                        // custom content
                        var password = this.host.val();
                        if (!("placeholder" in this.element) && this._browserCheck && password == this.placeHolder) {
                            password = "";
                        };
                        this._countCharacters();
                        var strengthValue = this.localization.tooShort;
                        var newValue = this.strengthTypeRenderer(password, { letters: this.letters, numbers: this.numbers, specialKeys: this.specials }, strengthValue);
                        content = newValue;
                    };

                    this.host.jqxTooltip({ theme: this.theme, position: this.showStrengthPosition, content: content, trigger: "none", autoHide: false, rtl: this.rtl });

                    if (!this.strengthTypeRenderer) {
                        $("#" + strengthIDV).html(this.localization.tooShort);
                        $("#" + strengthIDI).addClass("jqx-passwordinput-password-strength-inicator").css("background-color", this.strengthColors.tooShort);
                        if (this.rtl == false) {
                            $("#" + strengthIDI).css("float", "left");
                        } else {
                            $("#" + strengthIDI).css("float", "right");
                        };
                    };

                    this._checkStrength();
                } else {
                    throw new Error('jqxPasswordInput: Missing reference to jqxtooltip.js');
                };
            };
        },

        // checks the password's strength
        _checkStrength: function () {
            var me = this;
            var widget = this.host;

            this.addHandler($(window), 'resize.passwordinput' + this.widgetID, function () {
                if (me.icon) {
                    me.icon.hide();
                }
            });

            this.addHandler(this.host, 'keyup.passwordinput' + this.widgetID, function () {
                var password = me.host.val();
                var length = password.length;
            
                me._countCharacters();

                if (length > 0) {
                    if (me.showStrength == true) {
                        var opened = !widget.jqxTooltip("opened");
                        if (opened) {
                            widget.jqxTooltip('open');
                        };
                    };
                }

                // default password strength rule
                var strengthCo = me.letters + me.numbers + 2 * me.specials + me.letters * me.numbers / 2 + length;
                var strengthValue;
                if (length < 8) {
                    strengthValue = me.localization.tooShort;
                } else if (strengthCo < 20) {
                    strengthValue = me.localization.weak;
                } else if (strengthCo < 30) {
                    strengthValue = me.localization.fair;
                } else if (strengthCo < 40) {
                    strengthValue = me.localization.good;
                } else {
                    strengthValue = me.localization.strong;
                };

                if (me.strengthTypeRenderer) {
                    var newValue = me.strengthTypeRenderer(password, { letters: me.letters, numbers: me.numbers, specialKeys: me.specials }, strengthValue);
                    me.host.jqxTooltip({ content: newValue });
                } else {
                    // checks if a custom password strength rule is defined
                    if (me.passwordStrength) {
                        var newValue = me.passwordStrength(password, { letters: me.letters, numbers: me.numbers, specialKeys: me.specials }, strengthValue);
                        $.each(me.localization, function () {
                            var item = this;
                            if (newValue == item) {
                                strengthValue = newValue;
                                return false;
                            };
                        });
                    };

                    $("#" + me.widgetID + "StrengthValue").html(strengthValue);

                    var ident = $("#" + me.widgetID + "StrengthIndicator");

                    switch (strengthValue) {
                        case me.localization.tooShort:
                            ident.css({ "width": "20%", "background-color": me.strengthColors.tooShort });
                            break;
                        case me.localization.weak:
                            ident.css({ "width": "40%", "background-color": me.strengthColors.weak });
                            break;
                        case me.localization.fair:
                            ident.css({ "width": "60%", "background-color": me.strengthColors.fair });
                            break;
                        case me.localization.good:
                            ident.css({ "width": "80%", "background-color": me.strengthColors.good });
                            break;
                        case me.localization.strong:
                            ident.css({ "width": "100%", "background-color": me.strengthColors.strong });
                            break;
                    };
                };
            });
        },

        // counts the letters, numbers and special characters in the password
        _countCharacters: function () {
            this.letters = 0;
            this.numbers = 0;
            this.specials = 0;

            var specialCharacters = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

            var password = this.host.val();
            var length = password.length;
            for (var i = 0; i < length; i++) {
                var character = password.charAt(i);
                var code = password.charCodeAt(i);
                // checks if the character is a letter
                if ((code > 64 && code < 91) || (code > 96 && code < 123) || (code > 127 && code < 155) || (code > 159 && code < 166)) {
                    this.letters += 1;
                    continue;
                };
                // checks if the character is a number
                if (isNaN(character) == false) {
                    this.numbers += 1;
                    continue;
                };
                // checks if the character is a special character
                if (specialCharacters.indexOf(character) != -1) {
                    this.specials += 1;
                    continue;
                };
            };
        }
    });
})(jQuery);