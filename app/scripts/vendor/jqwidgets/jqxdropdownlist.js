/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxDropDownList", "", {});

    $.extend($.jqx._jqxDropDownList.prototype, {
        defineInstance: function () {
            // enables/disables the dropdownlist.
            this.disabled = false;
            // gets or sets the listbox width.
            this.width = null;
            // gets or sets the listbox height.
            this.height = null;
            // Represents the collection of list items.
            this.items = new Array();
            // Gets or sets the selected index.
            this.selectedIndex = -1;
            // data source.
            this.source = null;
            // gets or sets the scrollbars size.
            this.scrollBarSize = 15;
            // gets or sets the scrollbars size.
            this.arrowSize = 19;
            // enables/disables the hover state.
            this.enableHover = true;
            // enables/disables the selection.
            this.enableSelection = true;
            // gets the visible items. // this property is internal for the dropdownlist.
            this.visualItems = new Array();
            // gets the groups. // this property is internal for the dropdownlist.
            this.groups = new Array();
            // gets or sets whether the items width should be equal to the dropdownlist's width.
            this.equalItemsWidth = true;
            // gets or sets the height of the ListBox Items. When the itemHeight == - 1, each item's height is equal to its desired height.
            this.itemHeight = -1;
            // represents the dropdownlist's events.
            this.visibleItems = new Array();
            // emptry group's text.
            this.emptyGroupText = 'Group';
            this.checkboxes = false;
            // Type: Number
            // Default: 100
            // Showing Popup Animation's delay.
            if (this.openDelay == undefined) {
                this.openDelay = 250;
            }
            // Type: Number
            // Default: 200
            // Hiding Popup Animation's delay.
            if (this.closeDelay == undefined) {
                this.closeDelay = 300;
            }
            // default, none
            // Type: String.
            // enables or disables the animation.
            this.animationType = 'default';
            this.autoOpen = false;
            // Type: String
            // Default: auto ( the drop down takes the dropdownlist's width.)
            // Sets the popup's width.
            this.dropDownWidth = 'auto';
            // Type: String
            // Default: 200px ( the height is 200px )
            // Sets the popup's height.
            this.dropDownHeight = '200px';
            // Type: Boolean
            // Default: false
            // Sets the popup's height to be equal to the items summary height;            
            this.autoDropDownHeight = false;
            this.keyboardSelection = true;

            // Type: Boolean
            // Default: false
            // Enables or disables the browser detection.
            this.enableBrowserBoundsDetection = false;
            this.dropDownHorizontalAlignment = 'left';
            this.displayMember = "";
            this.valueMember = "";
            this.searchMode = 'startswithignorecase';
            this.incrementalSearch = true;
            this.incrementalSearchDelay = 700;
            this.renderer = null;
            this.placeHolder = "Please Choose:";
            this.promptText = "Please Choose:";
            this.emptyString = "";
            this.rtl = false;
            this.selectionRenderer = null;
            this.listBox = null;
            this.popupZIndex = 9999999999999;
            this.renderMode = "default";
            this.touchMode = "auto";
            this._checkForHiddenParent = true;
            this.aria =
            {
                "aria-disabled": { name: "disabled", type: "boolean" }
            };
            this.events =
	   	    [
            // occurs when the dropdownlist is opened.
		      'open',
            // occurs when the dropdownlist is closed.
              'close',
            // occurs when an item is selected.
              'select',
            // occurs when an item is unselected.
              'unselect',
            // occurs when the selection is changed.
              'change',
            // triggered when the user checks or unchecks an item. 
              'checkChange',
            // triggered when the binding operation is completed.
              'bindingComplete'
           ];
        },

        createInstance: function (args) {
            this.render();
        },

        render: function () {
            if (!this.width) this.width = 200;
            if (!this.height) this.height = 25;
            this.element.innerHTML = "";
            this.isanimating = false;
            this.id = this.element.id || $.jqx.utilities.createId();
            this.host.attr('role', 'combobox');
            $.jqx.aria(this, "aria-autocomplete", "both");
            $.jqx.aria(this, "aria-readonly", false);

            var comboStructure = $("<div tabIndex=0 style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
                "<div id='dropdownlistWrapper' style='outline: none; background-color: transparent; border: none; float: left; width:100%; height: 100%; position: relative;'>" +
                "<div id='dropdownlistContent' style='outline: none; background-color: transparent; border: none; float: left; position: relative;'/>" +
                "<div id='dropdownlistArrow' style='background-color: transparent; border: none; float: right; position: relative;'><div></div></div>" +
                "</div>" +
                "</div>");
            this._addInput();

            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw new Error("jqxDropDownList: Missing reference to jqxlistbox.js.");
            }
            var me = this;

            this.touch = $.jqx.mobile.isTouchDevice();
            this.comboStructure = comboStructure;
            this.host.append(comboStructure);

            this.dropdownlistWrapper = this.host.find('#dropdownlistWrapper');
            this.dropdownlistArrow = this.host.find('#dropdownlistArrow');
            this.arrow = $(this.dropdownlistArrow.children()[0]);
            this.dropdownlistContent = this.host.find('#dropdownlistContent');
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-dropdownlist-content'));
            this.dropdownlistWrapper.addClass(this.toThemeProperty('jqx-disableselect'));
            if (this.rtl) {
                this.dropdownlistContent.addClass(this.toThemeProperty('jqx-rtl'));
                this.dropdownlistContent.addClass(this.toThemeProperty('jqx-dropdownlist-content-rtl'));
            }
            this.addHandler(this.dropdownlistWrapper, 'selectstart', function () { return false; });
            this.dropdownlistWrapper[0].id = "dropdownlistWrapper" + this.element.id;
            this.dropdownlistArrow[0].id = "dropdownlistArrow" + this.element.id;
            this.dropdownlistContent[0].id = "dropdownlistContent" + this.element.id;
            if (this.promptText != "Please Choose:") this.placeHolder = this.promptText;
            var hostClassName = this.toThemeProperty('jqx-widget') + " " + this.toThemeProperty('jqx-dropdownlist-state-normal') + " " + this.toThemeProperty('jqx-rc-all') + " " + this.toThemeProperty('jqx-fill-state-normal');
            this.element.className += " " + hostClassName;
            this._firstDiv = this.host.find('div:first');

            try {
                var listBoxID = 'listBox' + this.id;
                var oldContainer = $($.find('#' + listBoxID));
                if (oldContainer.length > 0) {
                    oldContainer.remove();
                }
                $.jqx.aria(this, "aria-owns", listBoxID);
                $.jqx.aria(this, "aria-haspopup", true);

                var container = $("<div style='overflow: hidden; background-color: transparent; border: none; position: absolute;' id='listBox" + this.id + "'><div id='innerListBox" + this.id + "'></div></div>");
                container.hide();

                container.appendTo(document.body);
                this.container = container;
                this.listBoxContainer = $($.find('#innerListBox' + this.id));

                var width = this.width;
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }
                if (width == null) {
                    width = this.host.width();
                    if (width == 0) width = this.dropDownWidth;
                }

                if (this.dropDownHeight == null) {
                    this.dropDownHeight = 200;
                }
                var me = this;
                this.container.width(parseInt(width) + 25);
                this.container.height(parseInt(this.dropDownHeight) + 25);
                this.addHandler(this.listBoxContainer, 'bindingComplete', function (event) {
                    me._raiseEvent('6');
                });

                this.listBoxContainer.jqxListBox({_checkForHiddenParent: false,
                    touchMode: this.touchMode, checkboxes: this.checkboxes, rtl: this.rtl, emptyString: this.emptyString, itemHeight: this.itemHeight, width: width, searchMode: this.searchMode, incrementalSearch: this.incrementalSearch, incrementalSearchDelay: this.incrementalSearchDelay, displayMember: this.displayMember, valueMember: this.valueMember, height: this.dropDownHeight, autoHeight: this.autoDropDownHeight, scrollBarSize: this.scrollBarSize, selectedIndex: this.selectedIndex, source: this.source, theme: this.theme,
                    rendered: function () {
                        if (me.selectedIndex != me.listBoxContainer.jqxListBox('selectedIndex')) {
                            me.listBox = $.data(me.listBoxContainer[0], "jqxListBox").instance;
                            me.listBoxContainer.jqxListBox({ selectedIndex: me.selectedIndex });
                            me.renderSelection('mouse');
                        } else {
                            me.renderSelection('mouse');
                        }
                    }, renderer: this.renderer
                });
                this.listBoxContainer.css({ position: 'absolute', zIndex: this.popupZIndex, top: 0, left: 0 });
                this.listBox = $.data(this.listBoxContainer[0], "jqxListBox").instance;
                this.listBox.enableSelection = this.enableSelection;
                this.listBox.enableHover = this.enableHover;
                this.listBox.equalItemsWidth = this.equalItemsWidth;
                this.listBox.selectIndex(this.selectedIndex);
                this.listBox._arrange();
                this.listBoxContainer.addClass(this.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    this.listBoxContainer.addClass(this.toThemeProperty('jqx-noshadow'));
                }

                this.addHandler(this.listBoxContainer, 'unselect', function (event) {
                    me._raiseEvent('3', { index: event.args.index, type: event.args.type, item: event.args.item });
                });

                this.addHandler(this.listBoxContainer, 'change', function (event) {
                    me._raiseEvent('4', { index: event.args.index, type: event.args.type, item: event.args.item });
                });

                if (this.animationType == 'none') {
                    this.container.css('display', 'none');
                }
                else {
                    this.container.hide();
                }
            }
            catch (e) {

            }

            var self = this;
            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                    instance.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.addClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
                }
                else {
                    instance.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                    instance.host.removeClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.removeClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
                }
                $.jqx.aria(instance, "aria-disabled", instance.disabled);
            }

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-dropdownlist-state-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this.dropdownlistContent.addClass(this.toThemeProperty('jqx-dropdownlist-content-disabled'));
            }

            this.arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down'));
            this.arrow.addClass(this.toThemeProperty('jqx-icon'));

            if (this.renderMode === "simple") {
                this.arrow.remove();
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-normal'));
                this.host.removeClass(this.toThemeProperty('jqx-rc-all'));
            }

            this._updateHandlers();
            this._setSize();
            this._arrange();
            if (this.listBox) {
                this.renderSelection();
            }

            // fix for IE7
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                if (this.host.parents('.jqx-window').length > 0) {
                    var zIndex = this.host.parents('.jqx-window').css('z-index');
                    container.css('z-index', zIndex + 10);
                    this.listBoxContainer.css('z-index', zIndex + 10);
                }
            }
        },

        resize: function(width, height)
        {
            this.width = width;
            this.height = height;
            this._setSize();
            this._arrange();
        },

        val: function (value) {
            if (!this.dropdownlistContent) return "";
            if (this.input && arguments.length == 0) {
                return this.input.val();
            }

            var item = this.getItemByValue(value);
            if (item != null) {
                this.selectItem(item);
            }

            if (this.input) {
                return this.input.val();
            }
        },

        focus: function () {
            try
            {
                var me = this;
                var doFocus = function () {
                    me.host.focus();
                    if (me._firstDiv) {
                        me._firstDiv.focus();
                    }
                }
                doFocus();
                setTimeout(function () {
                    doFocus();
                }, 10);
            }
            catch (error) {
            }
        },

        _addInput: function () {
            var name = this.host.attr('name');
            if (!name) name = this.element.id;
            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            this.input.attr('name', name);
        },

        getItems: function () {
            if (!this.listBox) {
                return new Array();
            }

            return this.listBox.items;
        },

        getVisibleItems: function () {
            return this.listBox.getVisibleItems();
        },

        _setSize: function () {
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };

            var isPercentage = false;
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.host.width(this.width);
            }

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.host.height(this.height);
            }

            var me = this;
            var resizeFunc = function () {
                me._arrange();
                if (me.dropDownWidth == 'auto') {
                    var width = me.host.width();
                    me.listBoxContainer.jqxListBox({ width: width });
                    me.container.width(parseInt(width) + 25);
                }
            }

            if (isPercentage) {
                var width = this.host.width();
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }
                this.listBoxContainer.jqxListBox({ width: width });
                this.container.width(parseInt(width) + 25);
            }
            $.jqx.utilities.resize(this.host, function () {
                resizeFunc();
            }, false, this._checkForHiddenParent);
        },

        // returns true when the listbox is opened, otherwise returns false.
        isOpened: function () {
            var me = this;
            var openedListBox = $.data(document.body, "openedJQXListBox" + this.id);
            if (openedListBox != null && openedListBox == me.listBoxContainer) {
                return true;
            }

            return false;
        },

        _updateHandlers: function () {
            var self = this;
            var hovered = false;
            this.removeHandlers();
            if (!this.touch) {
                this.addHandler(this.host, 'mouseenter', function () {
                    if (!self.disabled && self.enableHover && self.renderMode !== 'simple') {
                        hovered = true;
                        self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-hover'));
                        self.arrow.addClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                        self.host.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                    }
                });

                this.addHandler(this.host, 'mouseleave', function () {
                    if (!self.disabled && self.enableHover && self.renderMode !== 'simple') {
                        self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-hover'));
                        self.host.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                        self.arrow.removeClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                        hovered = false;
                    }
                });
            }

            if (this.host.parents()) {
                this.addHandler(this.host.parents(), 'scroll.dropdownlist' + this.element.id, function (event) {
                    var opened = self.isOpened();
                    if (opened) {
                        self.close();
                    }
                });
            }

            var eventName = 'mousedown';
            if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
            this.addHandler(this.dropdownlistWrapper, eventName,
            function (event) {
                if (!self.disabled) {
                    var isOpen = self.container.css('display') == 'block';
                    if (!self.isanimating) {
                        if (isOpen) {
                            self.hideListBox();
                            return false;
                        }
                        else {
                            self.showListBox();
                        }
                    }
                }
            });

            if (self.autoOpen) {
                this.addHandler(this.host, 'mouseenter', function () {
                    var isOpened = self.isOpened();
                    if (!isOpened && self.autoOpen) {
                        self.open();
                        self.host.focus();
                    }
                });

                $(document).on('mousemove.' + self.id, function (event) {
                    var isOpened = self.isOpened();
                    if (isOpened && self.autoOpen) {
                        var offset = self.host.coord();
                        var top = offset.top;
                        var left = offset.left;
                        var popupOffset = self.container.coord();
                        var popupLeft = popupOffset.left;
                        var popupTop = popupOffset.top;

                        canClose = true;

                        if (event.pageY >= top && event.pageY <= top + self.host.height()) {
                            if (event.pageX >= left && event.pageX < left + self.host.width())
                                canClose = false;
                        }
                        if (event.pageY >= popupTop && event.pageY <= popupTop + self.container.height()) {
                            if (event.pageX >= popupLeft && event.pageX < popupLeft + self.container.width())
                                canClose = false;
                        }

                        if (canClose) {
                            self.close();
                        }
                    }
                });
            }

            if (this.touch) {
                this.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.id });
            }
            else this.addHandler($(document), 'mousedown.' + this.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.id });

            this.addHandler(this.host, 'keydown', function (event) {
                var isOpen = self.container.css('display') == 'block';

                if (self.host.css('display') == 'none') {
                    return true;
                }

                if (event.keyCode == '13' || event.keyCode == '9') {
                    if (!self.isanimating) {
                        if (isOpen) {
                            self.renderSelection();
                            if (event.keyCode == '13') {
                                self._firstDiv.focus();
                            }
                            self.hideListBox();
                            if (!self.keyboardSelection) {
                                self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                            }
                        }
                        if (isOpen && event.keyCode != '9') {
                            return false;
                        }
                        return true;
                    }
                }

                if (event.keyCode == 115) {
                    if (!self.isanimating) {
                        if (!self.isOpened()) {
                            self.showListBox();
                        }
                        else if (self.isOpened()) {
                            self.hideListBox();
                        }
                    }
                    return false;
                }

                if (event.altKey) {
                    if (self.host.css('display') == 'block') {
                        if (event.keyCode == 38) {
                            if (self.isOpened()) {
                                self.hideListBox();
                                return true;
                            }
                        }
                        else if (event.keyCode == 40) {
                            if (!self.isOpened()) {
                                self.showListBox();
                                return true;
                            }
                        }
                    }
                }

                if (event.keyCode == '27') {
                    if (!self.ishiding) {
                        self.hideListBox();
                        if (self.tempSelectedIndex != undefined) {
                            self.selectIndex(self.tempSelectedIndex);
                        }
                        return true;
                    }
                }

                if (!self.disabled) {
                    return self.listBox._handleKeyDown(event);
                }
            });
            this.addHandler(this.listBoxContainer, 'checkChange', function (event) {
                self.renderSelection();
                self._updateInputSelection();
                self._raiseEvent(5, { label: event.args.label, value: event.args.value, checked: event.args.checked, item: event.args.item });
            });

            this.addHandler(this.listBoxContainer, 'select', function (event) {
                if (!self.disabled) {
                    if (event.args.type == 'keyboard' && !self.isOpened()) {
                        self.renderSelection();
                    }

                    if (event.args.type != 'keyboard' || self.keyboardSelection) {
                        self.renderSelection();
                        self._raiseEvent('2', { index: event.args.index, type: event.args.type, item: event.args.item, originalEvent: event.args.originalEvent });
                        if (event.args.type == 'mouse') {
                            if (!self.checkboxes) {
                                self.hideListBox();
                                if (self._firstDiv) {
                                    self._firstDiv.focus();
                                }
                            }
                        }
                    }
                }
            });
            if (this.listBox) {
                if (this.listBox.content) {
                    this.addHandler(this.listBox.content, 'click', function (event) {
                        if (!self.disabled) {
                            if (self.listBox.itemswrapper && event.target === self.listBox.itemswrapper[0])
                                return true;

                            self.renderSelection('mouse');
                            if (!self.touch) {
                                if (!self.ishiding) {
                                    if (!self.checkboxes) {
                                        self.hideListBox();
                                        if (self._firstDiv) {
                                            self._firstDiv.focus();
                                        }
                                    }
                                }
                            }
                            if (!self.keyboardSelection) {
                                if (self._oldSelectedInd == undefined) self._oldSelectedIndx = self.selectedIndex;

                                if (self.selectedIndex != self._oldSelectedIndx) {
                                    self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                                    self._oldSelectedIndx = self.selectedIndex;
                                }
                            }
                        }
                    });
                }
            }

            this.addHandler(this.host, 'focus', function (event) {
                if (self.renderMode !== 'simple') {
                    self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
            this.addHandler(this.host, 'blur', function () {
                if (self.renderMode !== 'simple') {
                    self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
            this.addHandler(this._firstDiv, 'focus', function (event) {
                if (self.renderMode !== 'simple') {
                    self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
            this.addHandler(this._firstDiv, 'blur', function () {
                if (self.renderMode !== 'simple') {
                    self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
        },

        removeHandlers: function () {
            var self = this;
            var eventName = 'mousedown';
            if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
            this.removeHandler(this.dropdownlistWrapper, eventName);
            if (this.listBox) {
                if (this.listBox.content) {
                    this.removeHandler(this.listBox.content, 'click');
                }
            }

            this.removeHandler(this.host, 'loadContent');
            this.removeHandler(this.listBoxContainer, 'checkChange');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'focus');
            this.removeHandler(this.host, 'blur');
            this.removeHandler(this._firstDiv, 'focus');
            this.removeHandler(this._firstDiv, 'blur');
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler($(document), 'mousemove.' + self.id);
        },

        // gets an item by index.
        getItem: function (index) {
            var item = this.listBox.getItem(index);
            return item;
        },

        getItemByValue: function (value) {
            var item = this.listBox.getItemByValue(value);
            return item;
        },

        selectItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.selectItem(item);
                this.selectedIndex = this.listBox.selectedIndex;
                this.renderSelection('mouse');
            }
        },

        unselectItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.unselectItem(item);
                this.renderSelection('mouse');
            }
        },

        checkItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.checkItem(item);
            }
        },

        uncheckItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.uncheckItem(item);
            }
        },

        indeteterminateItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.indeteterminateItem(item);
            }
        },


        // renders the selection.
        renderSelection: function () {
            if (this.listBox == null)
                return;

            if (this.height && this.height.toString().indexOf('%') != -1) {
                this._arrange();
            }

            var item = this.listBox.visibleItems[this.listBox.selectedIndex];
            var me = this;
            if (this.checkboxes) {
                var checkedItems = this.getCheckedItems();
                if (checkedItems != null && checkedItems.length > 0) {
                    item = checkedItems[0];
                }
                else item = null;
            }

            if (item == null) {
                var spanElement = $('<span style="color: inherit; border: none; background-color: transparent;"></span>');
                spanElement.appendTo($(document.body));
                spanElement.addClass(this.toThemeProperty('jqx-widget'));
                spanElement.addClass(this.toThemeProperty('jqx-listitem-state-normal'));
                spanElement.addClass(this.toThemeProperty('jqx-item'));

                $.jqx.utilities.html(spanElement, this.placeHolder);
                var topPadding = this.dropdownlistContent.css('padding-top');
                var bottomPadding = this.dropdownlistContent.css('padding-bottom');
                spanElement.css('padding-top', topPadding);
                spanElement.css('padding-bottom', bottomPadding);
                var spanHeight = spanElement.outerHeight();
                spanElement.remove();
                spanElement.removeClass();
                $.jqx.utilities.html(this.dropdownlistContent, spanElement);
                var height = this.host.height();
                if (this.height != null && this.height != undefined) {
                    if (this.height.toString().indexOf('%') === -1) {
                        height = parseInt(this.height);
                    }
                }

                var top = parseInt((parseInt(height) - parseInt(spanHeight)) / 2);

                if (top > 0) {
                    this.dropdownlistContent.css('margin-top', top + 'px');
                    this.dropdownlistContent.css('margin-bottom', top + 'px');
                }
                if (this.selectionRenderer) {
                    $.jqx.utilities.html(this.dropdownlistContent, this.selectionRenderer());
                    this._updateInputSelection();
                }
                this.selectedIndex = this.listBox.selectedIndex;
                if (this.width === "auto") {
                    this._arrange();
                }
                return;
            }

            this.selectedIndex = this.listBox.selectedIndex;
            var spanElement = $('<span style="color: inherit; border: none; background-color: transparent;"></span>');
            spanElement.appendTo($(document.body));
            spanElement.addClass(this.toThemeProperty('jqx-widget'));
            spanElement.addClass(this.toThemeProperty('jqx-listitem-state-normal'));
            spanElement.addClass(this.toThemeProperty('jqx-item'));

            var emptyItem = false;
            try {
                if (item.html != undefined && item.html != null && item.html.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.html);
                }
                else if (item.label != undefined && item.label != null && item.label.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.label);
                }
                else if (item.label === null || item.label === "") {
                    emptyItem = true;
                    $.jqx.utilities.html(spanElement, "");
                }
                else if (item.value != undefined && item.value != null && item.value.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.value);

                }
                else if (item.title != undefined && item.title != null && item.title.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.title);
                }
                else if (item.label == "" || item.label == null) {
                    emptyItem = true;
                    $.jqx.utilities.html(spanElement, "");
                }
            }
            catch (error) {
                var errorMessage = error;
            }

            var topPadding = this.dropdownlistContent.css('padding-top');
            var bottomPadding = this.dropdownlistContent.css('padding-bottom');

            spanElement.css('padding-top', topPadding);
            spanElement.css('padding-bottom', bottomPadding);

            var spanHeight = spanElement.outerHeight();
            if (spanHeight === 0) {
                spanHeight = 16;
            }

            if ((item.label == "" || item.label == null) && emptyItem) {
                $.jqx.utilities.html(spanElement, "");
            }
            var notPercentageWidth = this.width && this.width.toString().indexOf('%') <= 0;
              
            spanElement.remove();
            spanElement.removeClass();
            if (this.selectionRenderer) {
               $.jqx.utilities.html(this.dropdownlistContent, this.selectionRenderer(spanElement, item.index, item.label, item.value));
            }
            else {
                if (this.checkboxes) {
                    var items = this.getCheckedItems();
                    var str = "";
                    for (var i = 0; i < items.length; i++) {
                        if (i == items.length - 1) {
                            str += items[i].label;
                        }
                        else {
                            str += items[i].label + ",";
                        }
                    }
                    spanElement.text(str);
                    if (notPercentageWidth) {
                        spanElement.css('max-width', this.host.width() - 30);
                    }
                    spanElement.css('overflow', 'hidden');
                    spanElement.css('display', 'block');
                    if (!this.rtl) {
                        if (notPercentageWidth) {
                            spanElement.css('width', this.host.width() - 30);
                        }
                    }
                    spanElement.css('text-overflow', 'ellipsis');
                    spanElement.css('padding-bottom', 1+parseInt(bottomPadding));

                    this.dropdownlistContent.html(spanElement);
                }
                else {
                    if (this.width && this.width !== 'auto') {
                        if (notPercentageWidth) {
                            if (!this.rtl) {
                                spanElement.css('max-width', this.host.width() - 10);
                            }
                        }

                        spanElement.css('overflow', 'hidden');
                        spanElement.css('display', 'block');
                        spanElement.css('padding-bottom', 1 + parseInt(bottomPadding));
                        if (!this.rtl) {
                            if (notPercentageWidth) {
                                spanElement.css('width', this.host.width() - 10);
                            }
                        }
                        spanElement.css('text-overflow', 'ellipsis');
                    }

                    this.dropdownlistContent.html(spanElement);
                }
            }

            var height = this.host.height();
            if (this.height != null && this.height != undefined) {
                if (this.height.toString().indexOf('%') === -1) {
                    height = parseInt(this.height);
                }
            }

            var top = parseInt((parseInt(height) - parseInt(spanHeight)) / 2);

            if (top > 0) {
                this.dropdownlistContent.css('margin-top', top + 'px');
                this.dropdownlistContent.css('margin-bottom', top + 'px');
            }
            if (this.dropdownlistContent && this.input) {
                this._updateInputSelection();
            }
            if (this.listBox && this.listBox._activeElement) {
                $.jqx.aria(this, "aria-activedescendant", this.listBox._activeElement.id);
            }
            if (this.width === "auto") {
                this._arrange();
            }
        },

        _updateInputSelection: function () {
            if (this.input) {
                if (this.selectedIndex == -1) {
                    this.input.val("");
                }
                else {
                    var selectedItem = this.getSelectedItem();
                    if (selectedItem != null) {
                        this.input.val(selectedItem.value);
                    }
                    else {
                        this.input.val(this.dropdownlistContent.text());
                    }
                }
                if (this.checkboxes) {
                    var items = this.getCheckedItems();
                    var str = "";
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            var value = items[i].value;
                            if (value == undefined) continue;
                            if (i == items.length - 1) {
                                str += value;
                            }
                            else {
                                str += value + ",";
                            }
                        }
                    }
                    this.input.val(str);
                }
            }
        },

        setContent: function (content) {
            $.jqx.utilities.html(this.dropdownlistContent, content);
            this._updateInputSelection();
        },

        dataBind: function () {
            this.listBoxContainer.jqxListBox({ source: this.source });
            this.renderSelection('mouse');
            if (this.source == null) {
                this.clearSelection();
            }
        },

        clear: function () {
            this.listBoxContainer.jqxListBox({ source: null });
            this.clearSelection();
        },

        // clears the selection.
        clearSelection: function (render) {
            this.selectedIndex = -1;
            this._updateInputSelection();
            this.listBox.clearSelection();
            this.renderSelection();
            $.jqx.utilities.html(this.dropdownlistContent, this.placeHolder);
        },

        // unselects an item at specific index.
        // @param Number
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            this.listBox.unselectIndex(index, render);
            this.renderSelection();
        },

        // selects an item at specific index.
        // @param Number
        selectIndex: function (index, ensureVisible, render, forceSelect) {
            this.listBox.selectIndex(index, ensureVisible, render, forceSelect, 'api');
        },

        // gets the selected index.
        getSelectedIndex: function () {
            return this.selectedIndex;
        },

        // gets the selected item.
        getSelectedItem: function () {
            return this.getItem(this.selectedIndex);
        },

        getCheckedItems: function () {
            return this.listBox.getCheckedItems();
        },

        checkIndex: function (index) {
            this.listBox.checkIndex(index);
        },

        uncheckIndex: function (index) {
            this.listBox.uncheckIndex(index);
        },

        indeterminateIndex: function (index) {
            this.listBox.indeterminateIndex(index);
        },
        checkAll: function () {
            this.listBox.checkAll();
        },

        uncheckAll: function () {
            this.listBox.uncheckAll();
        },

        addItem: function (item) {
            return this.listBox.addItem(item);
        },
        
        insertAt: function (item, index) {
            if (item == null)
                return false;

            return this.listBox.insertAt(item, index);
        },

        removeAt: function (index) {
            var result = this.listBox.removeAt(index);
            this.renderSelection('mouse');
            return result;
        },

        removeItem: function (item) {
            var result = this.listBox.removeItem(item);
            this.renderSelection('mouse');
            return result;
        },

        updateItem: function (item, oldItem) {
            var result = this.listBox.updateItem(item, oldItem);
            this.renderSelection('mouse');
            return result;
        },

        updateAt: function (item, index) {
            var result = this.listBox.updateAt(item, index);
            this.renderSelection('mouse');
            return result;
        },

        ensureVisible: function (index) {
            return this.listBox.ensureVisible(index);
        },

        disableAt: function (index) {
            return this.listBox.disableAt(index);
        },

        enableAt: function (index) {
            return this.listBox.enableAt(index);
        },

        disableItem: function (item) {
            return this.listBox.disableItem(item);
        },

        enableItem: function (item) {
            return this.listBox.enableItem(item);
        },

        _findPos: function (obj) {
            while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
                obj = obj['nextSibling'];
            }
            var position = $(obj).coord(true);
            return [position.left, position.top];
        },

        testOffset: function (element, offset, inputHeight) {
            var dpWidth = element.outerWidth();
            var dpHeight = element.outerHeight();
            var viewWidth = $(window).width() + $(window).scrollLeft();
            var viewHeight = $(window).height() + $(window).scrollTop();

            if (offset.left + dpWidth > viewWidth) {
                if (dpWidth > this.host.width()) {
                    var hostLeft = this.host.coord().left;
                    var hOffset = dpWidth - this.host.width();
                    offset.left = hostLeft - hOffset + 2;
                }
            }
            if (offset.left < 0) {
                offset.left = parseInt(this.host.coord().left) + 'px'
            }

            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                Math.abs(dpHeight + inputHeight + 22) : 0);

            return offset;
        },

        open: function () {
            this.showListBox();
        },

        close: function () {
            this.hideListBox();
        },

        _getBodyOffset: function () {
            var top = 0;
            var left = 0;
            if ($('body').css('border-top-width') != '0px') {
                top = parseInt($('body').css('border-top-width'));
                if (isNaN(top)) top = 0;
            }
            if ($('body').css('border-left-width') != '0px') {
                left = parseInt($('body').css('border-left-width'));
                if (isNaN(left)) left = 0;
            }
            return { left: left, top: top };
        },

        // shows the listbox.
        showListBox: function () {
            $.jqx.aria(this, "aria-expanded", true);

            if (this.dropDownWidth == 'auto' && this.width != null && this.width.indexOf && this.width.indexOf('%') != -1) {
                if (this.listBox.host.width() != this.host.width()) {
                    var width = this.host.width();
                    this.listBoxContainer.jqxListBox({ width: width });
                    this.container.width(parseInt(width) + 25);
                }
            }

            var self = this;
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var scrollPosition = $(window).scrollTop();
            var scrollLeftPosition = $(window).scrollLeft();
            var top = parseInt(this._findPos(this.host[0])[1]) + parseInt(this.host.outerHeight()) - 1 + 'px';
            //var left = parseInt(Math.round(this.host.coord(true).left)) + 'px';
            var left, leftPos = parseInt(Math.round(this.host.coord(true).left));
            left = leftPos + 'px';

            var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();

            if (this.listBox == null)
                return;
         
            var hasTransform = $.jqx.utilities.hasTransform(this.host);
            this.ishiding = false;
            if (!this.keyboardSelection) {
                this.listBox.selectIndex(this.selectedIndex);
                this.listBox.ensureVisible(this.selectedIndex);
            }

            this.tempSelectedIndex = this.selectedIndex;

            if (this.autoDropDownHeight) {
                this.container.height(this.listBoxContainer.height() + 25);
            }

            if (hasTransform || (isMobileBrowser != null && isMobileBrowser)) {
                left = $.jqx.mobile.getLeftPos(this.element);
                top = $.jqx.mobile.getTopPos(this.element) + parseInt(this.host.outerHeight());
                if ($('body').css('border-top-width') != '0px') {
                    top = parseInt(top) - this._getBodyOffset().top + 'px';
                }
                if ($('body').css('border-left-width') != '0px') {
                    left = parseInt(left) - this._getBodyOffset().left + 'px';
                }
            }

            listBox.stop();
            if (this.renderMode !== 'simple') {
                this.host.addClass(this.toThemeProperty('jqx-dropdownlist-state-selected'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                this.arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
            }

            this.container.css('left', left);
            this.container.css('top', top);
            listBoxInstance._arrange();

            var closeAfterSelection = true;
            var positionChanged = false;

            if (this.dropDownHorizontalAlignment == 'right' || this.rtl) {
                var containerWidth = this.container.outerWidth();
                var containerLeftOffset = Math.abs(containerWidth - this.host.width());

                if (containerWidth > this.host.width()) {
                    this.container.css('left', 25 + parseInt(Math.round(leftPos)) - containerLeftOffset + "px");
                }
                else this.container.css('left', 25 + parseInt(Math.round(leftPos)) + containerLeftOffset + "px");
            }

            if (this.enableBrowserBoundsDetection) {
                var newOffset = this.testOffset(listBox, { left: parseInt(this.container.css('left')), top: parseInt(top) }, parseInt(this.host.outerHeight()));
                if (parseInt(this.container.css('top')) != newOffset.top) {
                    positionChanged = true;
                    listBox.css('top', 23);
                    listBox.addClass(this.toThemeProperty('jqx-popup-up'));
                }
                else listBox.css('top', 0);

                this.container.css('top', newOffset.top);
                if (parseInt(this.container.css('left')) != newOffset.left) {
                    this.container.css('left', newOffset.left);
                }
            }

            if (this.animationType == 'none') {
                this.container.css('display', 'block');
                $.data(document.body, "openedJQXListBoxParent", self);
                $.data(document.body, "openedJQXListBox" + this.id, listBox);
                listBox.css('margin-top', 0);
                listBox.css('opacity', 1);
            }
            else {
                this.container.css('display', 'block');
                self.isanimating = true;
                if (this.animationType == 'fade') {
                    listBox.css('margin-top', 0);
                    listBox.css('opacity', 0);
                    listBox.animate({ 'opacity': 1 }, this.openDelay, function () {
                        $.data(document.body, "openedJQXListBoxParent", self);
                        $.data(document.body, "openedJQXListBox" + self.id, listBox);
                        self.ishiding = false;
                        self.isanimating = false;
                    });
                }
                else {
                    listBox.css('opacity', 1);
                    var height = listBox.outerHeight();
                    if (positionChanged) {
                        listBox.css('margin-top', height);
                    }
                    else {
                        listBox.css('margin-top', -height);
                    }

                    listBox.animate({ 'margin-top': 0 }, this.openDelay, function () {
                        $.data(document.body, "openedJQXListBoxParent", self);
                        $.data(document.body, "openedJQXListBox" + self.id, listBox);
                        self.ishiding = false;
                        self.isanimating = false;
                    });
                }
            }
            if (!positionChanged) {
                this.host.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
            }
            else {
                this.host.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
            }
            if (this.renderMode !== 'simple') {
                listBox.addClass(this.toThemeProperty('jqx-fill-state-focus'));
                this.host.addClass(this.toThemeProperty('jqx-dropdownlist-state-focus'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-focus'));
            }

            this.host.focus();
            setTimeout(function () {
                self.host.focus();
            });

            listBoxInstance._renderItems();
            this._raiseEvent('0', listBoxInstance);
        },

        // hides the listbox.
        hideListBox: function () {
            $.jqx.aria(this, "aria-expanded", false);

            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var container = this.container;
            var me = this;
            $.data(document.body, "openedJQXListBox" + this.id, null);
            if (this.animationType == 'none') {
                this.container.css('display', 'none');
            }
            else {
                if (!me.ishiding) {
                    listBox.stop();
                    var height = listBox.outerHeight();
                    listBox.css('margin-top', 0);
                    me.isanimating = true;

                    var animationValue = -height;
                    if (parseInt(this.container.coord().top) < parseInt(this.host.coord().top)) {
                        animationValue = height;
                    }

                    if (this.animationType == 'fade') {
                        listBox.css({ 'opacity': 1 });
                        listBox.animate({ 'opacity': 0 }, this.closeDelay, function () {
                            container.css('display', 'none');
                            me.isanimating = false;
                            me.ishiding = false;
                        });
                    }
                    else {
                        listBox.animate({ 'margin-top': animationValue }, this.closeDelay, function () {
                            container.css('display', 'none');
                            me.isanimating = false;
                            me.ishiding = false;
                        });
                    }
                }
            }

            this.ishiding = true;
            this.host.removeClass(this.toThemeProperty('jqx-dropdownlist-state-selected'));
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this.arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));

            this.host.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.host.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
      
            this._raiseEvent('1', listBoxInstance);
        },

        /* Close popup if clicked elsewhere. */
        closeOpenedListBox: function (event) {
            var self = event.data.me;
            var $target = $(event.target);
            var openedListBox = event.data.listbox;
            if (openedListBox == null)
                return true;

            if ($(event.target).ischildof(event.data.me.host)) {
                return true;
            }

            if (!self.isOpened()) {
                return true;
            }

            var dropdownlistInstance = self;

            var isListBox = false;
            $.each($target.parents(), function () {
                if (this.className != 'undefined') {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-listbox') != -1) {
                            isListBox = true;
                            return false;
                        }
                        if (this.className.indexOf('jqx-dropdownlist') != -1) {
                            if (self.element.id == this.id) {
                                isListBox = true;
                            }
                            return false;
                        }
                    }
                }
            });

            if (openedListBox != null && !isListBox && self.isOpened()) {
                self.hideListBox();
            }

            return true;
        },

        loadFromSelect: function (id) {
            this.listBox.loadFromSelect(id);
        },

        refresh: function (initialRefresh) {
            if (initialRefresh !== true) {
                this._setSize();
                this._arrange();
                if (this.listBox) {
                    this.renderSelection();
                }
            }
        },

        _arrange: function () {
            var width = parseInt(this.host.width());
            var height = parseInt(this.host.height());
            var arrowHeight = this.arrowSize;
            var arrowWidth = this.arrowSize;
            var rightOffset = 3;
            var contentWidth = width - arrowWidth - 2 * rightOffset;
            if (contentWidth > 0 && this.width !== "auto") {
                this.dropdownlistContent.width(contentWidth + 'px');
            }
            if (this.width === "auto") {
                width = this.dropdownlistContent.width() + arrowWidth + 2 * rightOffset;
                this.host.width(width);
            }
            this.dropdownlistContent.height(height);
            this.dropdownlistContent.css('left', 0);
            this.dropdownlistContent.css('top', 0);

            this.dropdownlistArrow.width(arrowWidth);
            this.dropdownlistArrow.height(height);

            if (this.rtl) {
                this.dropdownlistArrow.css('float', 'left');
                this.dropdownlistContent.css('float', 'right');
            }
        },

        destroy: function () {
            $.jqx.utilities.resize(this.host, null, true);
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBoxContainer, 'unselect');
            this.removeHandler(this.listBoxContainer, 'change');
            this.removeHandler(this.dropdownlistWrapper, 'selectstart');
            this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBox.content, 'click');
            this.removeHandler(this.listBoxContainer, 'bindingComplete');
      
            if (this.host.parents()) {
                this.removeHandler(this.host.parents(), 'scroll.dropdownlist' + this.element.id);
            }

            this.removeHandlers();

            this.listBoxContainer.jqxListBox('destroy');
            this.listBoxContainer.remove();
            this.host.removeClass();
            this.removeHandler($(document), 'mousedown.' + this.id, this.closeOpenedListBox);
            if (this.touch) {
                this.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id);
            }

            this.dropdownlistArrow.remove();
            delete this.dropdownlistArrow;
            delete this.dropdownlistWrapper;
            delete this.listBoxContainer;
            delete this.input;
            delete this.arrow;
            delete this.dropdownlistContent;
            delete this.listBox;
            delete this._firstDiv;
            this.container.remove();
            delete this.container;
            var vars = $.data(this.element, "jqxDropDownList");
            if (vars) {
                delete vars.instance;
            }
            this.host.removeData();
            this.host.remove();
            delete this.comboStructure;
            delete this.host;
            delete this.set;
            delete this.get;
            delete this.call;
            delete this.element;
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new jQuery.Event(evt);
            event.owner = this;
            if (id == 2 || id == 3 || id == 4 || id == 5) {
                event.args = arg;
            }

            var result = this.host.trigger(event);
            return result;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized == undefined || object.isInitialized == false)
                return;

            if (key == 'autoOpen') {
                object._updateHandlers();
            }
            if (key == 'emptyString') {
                object.listBox.emptyString = object.emptyString;
            }
            if (key == 'renderer') {
                object.listBox.renderer = object.renderer;
            }
            if (key == 'itemHeight') {
                object.listBox.itemHeight = value;
            }
            if (key == "rtl") {
                if (value) {
                    object.dropdownlistArrow.css('float', 'left');
                    object.dropdownlistContent.css('float', 'right');
                }
                else {
                    object.dropdownlistArrow.css('float', 'right');
                    object.dropdownlistContent.css('float', 'left');
                }
                object.listBoxContainer.jqxListBox({ rtl: object.rtl });
            }
            if (key == 'source') {
                object.listBoxContainer.jqxListBox({ source: object.source });
                object.listBox.selectedIndex = -1;
                object.listBox.selectIndex(this.selectedIndex);
                object.renderSelection();
                if (value == null) {
                    object.clear();
                }
            }

            if (key == "displayMember" || key == "valueMember") {
                object.listBoxContainer.jqxListBox({ displayMember: object.displayMember, valueMember: object.valueMember });
                object.renderSelection();
            }
            if (key == "placeHolder") {
                object.renderSelection();
            }

            if (key == 'theme' && value != null) {
                object.listBoxContainer.jqxListBox({ theme: value });
                object.listBoxContainer.addClass(object.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    object.listBoxContainer.addClass(object.toThemeProperty('jqx-noshadow'));
                }
                object.dropdownlistContent.removeClass();
                object.dropdownlistContent.addClass(object.toThemeProperty('jqx-dropdownlist-content'));
                object.dropdownlistWrapper.removeClass();
                object.dropdownlistWrapper.addClass(object.toThemeProperty('jqx-disableselect'));
                object.host.removeClass();
                object.host.addClass(object.toThemeProperty('jqx-fill-state-normal'));
                object.host.addClass(object.toThemeProperty('jqx-dropdownlist-state-normal'));
                object.host.addClass(object.toThemeProperty('jqx-rc-all'));
                object.host.addClass(object.toThemeProperty('jqx-widget'));
                object.arrow.removeClass();
                object.arrow.addClass(object.toThemeProperty('jqx-icon-arrow-down'));
                object.arrow.addClass(object.toThemeProperty('jqx-icon'));
            }

            if (key == "autoDropDownHeight") {
                object.listBoxContainer.jqxListBox({ autoHeight: object.autoDropDownHeight });
                if (object.autoDropDownHeight) {
                    object.container.height(object.listBoxContainer.height() + 25);
                }
                else {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }

                object.listBox._arrange();
                object.listBox._updatescrollbars();
            }

            if (key == "searchMode") {
                object.listBoxContainer.jqxListBox({ searchMode: object.searchMode });
            }

            if (key == "incrementalSearch") {
                object.listBoxContainer.jqxListBox({ incrementalSearch: object.incrementalSearch });
            }

            if (key == "incrementalSearchDelay") {
                object.listBoxContainer.jqxListBox({ incrementalSearchDelay: object.incrementalSearchDelay });
            }

            if (key == "dropDownHeight") {
                if (!object.autoDropDownHeight) {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }
            }

            if (key == "dropDownWidth" || key == "scrollBarSize") {
                var width = object.width;
                if (object.dropDownWidth != 'auto') {
                    width = object.dropDownWidth;
                }

                object.listBoxContainer.jqxListBox({ width: width, scrollBarSize: object.scrollBarSize });
                object.container.width(parseInt(width) + 25);
            }

            if (key == 'width' || key == 'height') {
                if (value != oldvalue) {
                    this.refresh();
                    if (key == 'width') {
                        if (object.dropDownWidth == 'auto') {
                            var width = object.host.width();
                            object.listBoxContainer.jqxListBox({ width: width });
                            object.container.width(parseInt(width) + 25);
                        }
                    }
                }
            }

            if (key == "checkboxes") {
                object.listBoxContainer.jqxListBox({ checkboxes: object.checkboxes });
            }

            if (key == 'selectedIndex') {
                if (object.listBox != null) {
                    object.listBox.selectIndex(parseInt(value));
                    object.renderSelection();
                }
            }
        }
    });
})(jQuery);
