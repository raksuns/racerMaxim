/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxComboBox", "", {});

    $.extend($.jqx._jqxComboBox.prototype, {
        defineInstance: function () {
            // enables/disables the combobox.
            this.disabled = false;
            // gets or sets the listbox width.
            this.width = 200;
            // gets or sets the listbox height.
            this.height = 25;
            // Represents the collection of list items.
            this.items = new Array();
            // Gets or sets the selected index.
            this.selectedIndex = -1;
            this.selectedItems = new Array();
            this._selectedItems = new Array();
            // data source.
            this.source = null;
            // gets or sets the scrollbars size.
            this.scrollBarSize = $.jqx.utilities.scrollBarSize;
            // gets or sets the scrollbars size.
            this.arrowSize = 18;
            // enables/disables the hover state.
            this.enableHover = true;
            // enables/disables the selection.
            this.enableSelection = true;
            // gets the visible items. // this property is internal for the combobox.
            this.visualItems = new Array();
            // gets the groups. // this property is internal for the combobox.
            this.groups = new Array();
            // gets or sets whether the items width should be equal to the combobox's width.
            this.equalItemsWidth = true;
            // gets or sets the height of the ListBox Items. When the itemHeight == - 1, each item's height is equal to its desired height.
            this.itemHeight = -1;
            // represents the combobox's events.
            this.visibleItems = new Array();
            // emptry group's text.
            this.emptyGroupText = 'Group';
            this.emptyString = "";
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
            // Type: String
            // Default: auto ( the drop down takes the combobox's width.)
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
            // Type: Boolean
            // Default: false
            // Enables or disables the browser detection.
            this.enableBrowserBoundsDetection = false;
            this.dropDownHorizontalAlignment = 'left';
            // Type: String
            // Default: startswithignorecase
            // Possible Values: 'none, 'contains', 'containsignorecase', 'equals', 'equalsignorecase', 'startswithignorecase', 'startswith', 'endswithignorecase', 'endswith'
            this.searchMode = 'startswithignorecase';
            this.autoComplete = false;
            this.remoteAutoComplete = false;
            this.remoteAutoCompleteDelay = 500;
            this.selectionMode = "default";
            this.minLength = 2;
            this.displayMember = "";
            this.valueMember = "";
            this.keyboardSelection = true;
            this.renderer = null;
            this.autoOpen = false;
            this.checkboxes = false;
            this.promptText = "";
            this.placeHolder = "";
            this.rtl = false;
            this.listBox = null;
            this.renderSelectedItem = null;
            this.search = null;
            this.popupZIndex = 100000;
            this.searchString = null;
            this.multiSelect = false;
            this.showArrow = true;
            this._disabledItems = new Array();
            this.touchMode = 'auto';
            this.aria =
            {
                "aria-disabled": { name: "disabled", type: "boolean" }
            };
            this.events =
	   	    [
            // occurs when the combobox is opened.
		      'open',
            // occurs when the combobox is closed.
              'close',
            // occurs when an item is selected.
              'select',
            // occurs when an item is unselected.
              'unselect',
            // occurs when the selection is changed.
              'change',
            // triggered when the user checks or unchecks an item. 
              'checkChange',
            // triggered when the binding is completed.
              'bindingComplete'
	   	    ];
        },

        createInstance: function (args) {
            var me = this;
            this.host.attr('role', 'combobox');
            $.jqx.aria(this, "aria-autocomplete", "both");

            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw new Error("jqxComboBox: Missing reference to jqxlistbox.js.");
            }
            $.jqx.aria(this);

            // prompt text is deprecated.
            if (this.promptText != "") {
                this.placeHolder = this.promptText;
            }

            this.render();
        },

        render: function () {
            this.removeHandlers();
            this.isanimating = false;
            this.id = $.jqx.utilities.createId();
            this.element.innerHTML = "";
            var comboStructure = $("<div style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
                "<div id='dropdownlistWrapper' style='padding: 0; margin: 0; border: none; background-color: transparent; float: left; width:100%; height: 100%; position: relative;'>" +
                "<div id='dropdownlistContent' style='padding: 0; margin: 0; border-top: none; border-bottom: none; float: left; position: absolute;'/>" +
                "<div id='dropdownlistArrow' style='padding: 0; margin: 0; border-left-width: 1px; border-bottom-width: 0px; border-top-width: 0px; border-right-width: 0px; float: right; position: absolute;'/>" +
                "</div>" +
                "</div>");
            this.comboStructure = comboStructure;
            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw "jqxComboBox: Missing reference to jqxlistbox.js.";
            }

            this.touch = $.jqx.mobile.isTouchDevice();
            if (this.touchMode === true) {
                this.touch = true;
            }

            this.host.append(comboStructure);

            this.dropdownlistWrapper = this.host.find('#dropdownlistWrapper');
            this.dropdownlistArrow = this.host.find('#dropdownlistArrow');
            this.dropdownlistContent = this.host.find('#dropdownlistContent');
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content'));
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-widget-content'));
            this.dropdownlistWrapper[0].id = "dropdownlistWrapper" + this.element.id;
            this.dropdownlistArrow[0].id = "dropdownlistArrow" + this.element.id;
            this.dropdownlistContent[0].id = "dropdownlistContent" + this.element.id;

            this.dropdownlistContent.append($('<input autocomplete="off" style="margin: 0; padding: 0; border: 0;" type="textarea"/>'));
            this.input = this.dropdownlistContent.find('input');
            this.input.addClass(this.toThemeProperty('jqx-combobox-input'));
            this.input.addClass(this.toThemeProperty('jqx-widget-content'));
            this._addInput();
            if (this.rtl) {
                this.input.css({ direction: "rtl" });
                this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content-rtl'));
            }

            try {
                var listBoxID = 'listBox' + this.id;
                var oldContainer = $($.find('#' + listBoxID));
                if (oldContainer.length > 0) {
                    oldContainer.remove();
                }
                $.jqx.aria(this, "aria-owns", listBoxID);
                $.jqx.aria(this, "aria-haspopup", true);
                $.jqx.aria(this, "aria-multiline", false);
                if (this.listBoxContainer) this.listBoxContainer.jqxListBox('destroy');
                if (this.container) this.container.remove();
                var container = $("<div style='overflow: hidden; border: none; background-color: transparent; position: absolute;' id='listBox" + this.id + "'><div id='innerListBox" + this.id + "'></div></div>");
                container.hide();
                container.appendTo(document.body);
                this.container = container;
                this.listBoxContainer = $($.find('#innerListBox' + this.id));

                var width = this.width;
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
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

                var initializing = true;
                this.listBoxContainer.jqxListBox({
                    _checkForHiddenParent: false,
                    checkboxes: this.checkboxes, emptyString: this.emptyString,
                    renderer: this.renderer, rtl: this.rtl, itemHeight: this.itemHeight, selectedIndex: this.selectedIndex, incrementalSearch: false, width: width, scrollBarSize: this.scrollBarSize, autoHeight: this.autoDropDownHeight, height: this.dropDownHeight, displayMember: this.displayMember, valueMember: this.valueMember, source: this.source, theme: this.theme,
                    rendered: function () {
                        me.listBox = $.data(me.listBoxContainer[0], "jqxListBox").instance;
                        if (me.remoteAutoComplete) {
                            if (me.autoDropDownHeight) {
                                me.container.height(me.listBox.virtualSize.height + 25);
                                me.listBoxContainer.height(me.listBox.virtualSize.height);
                                me.listBox._arrange();
                            }
                            else {
                                me.listBox._arrange();
                                me.listBox.ensureVisible(0);
                                me.listBox._renderItems();
                                me.container.height(me.listBoxContainer.height() + 25);
                            }

                            if (me.searchString != undefined && me.searchString.length >= me.minLength) {
                                var items = me.listBoxContainer.jqxListBox('items');
                                if (items) {
                                    if (items.length > 0) {
                                        if (!me.isOpened()) {
                                            me.open();
                                        }
                                    }
                                    else me.close();
                                } else me.close();
                            }
                            else {
                                me.close();
                            }
                        }
                        else {
                            me.renderSelection('mouse');
                            if (me.multiSelect) {
                                me.doMultiSelect(false);
                            }
                        }

                        if (me.rendered) {
                            me.rendered();
                        }
                    }
                });
                this.listBoxContainer.css({ position: 'absolute', zIndex: this.popupZIndex, top: 0, left: 0 });
                this.listBoxContainer.css('border-top-width', '1px');
                this.listBoxContainer.addClass(this.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    this.listBoxContainer.addClass(this.toThemeProperty('jqx-noshadow'));
                }
                this.listBox = $.data(this.listBoxContainer[0], "jqxListBox").instance;
                this.listBox.enableSelection = this.enableSelection;
                this.listBox.enableHover = this.enableHover;
                this.listBox.equalItemsWidth = this.equalItemsWidth;
                this.listBox._arrange();
                this.addHandler(this.listBoxContainer, 'unselect', function (event) {
                    if (!me.multiSelect) {
                        me._raiseEvent('3', { index: event.args.index, type: event.args.type, item: event.args.item });
                    }
                });
         
                this.addHandler(this.listBoxContainer, 'change', function (event) {
                    if (!me.multiSelect) {
                        me._raiseEvent('4', { index: event.args.index, type: event.args.type, item: event.args.item });
                    }
                });

                if (this.animationType == 'none') {
                    this.container.css('display', 'none');
                }
                else {
                    this.container.hide();
                }
                initializing = false;
            }
            catch (e) {
                throw e;
            }

            var self = this;
            self.input.attr('disabled', self.disabled);
            var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
            if (!ie7) {
                self.input.attr('placeholder', self.placeHolder);
            }

            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(self.toThemeProperty('jqx-combobox-state-disabled'));
                    instance.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.addClass(self.toThemeProperty('jqx-combobox-content-disabled'));
                }
                else {
                    instance.host.removeClass(self.toThemeProperty('jqx-combobox-state-disabled'));
                    instance.host.removeClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.removeClass(self.toThemeProperty('jqx-combobox-content-disabled'));
                }
                instance.input.attr('disabled', instance.disabled);
                $.jqx.aria(instance, "aria-disabled", instance.disabled);
                instance.input.attr('disabled', instance.disabled);
            }

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-combobox-state-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content-disabled'));
            }

            this.host.addClass(this.toThemeProperty('jqx-combobox-state-normal'));
            this.host.addClass(this.toThemeProperty('jqx-combobox'));
            this.host.addClass(this.toThemeProperty('jqx-rc-all'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.addClass(this.toThemeProperty('jqx-widget-content'));
            this.dropdownlistArrowIcon = $("<div></div>");
            this.dropdownlistArrowIcon.addClass(this.toThemeProperty('jqx-icon-arrow-down'));
            this.dropdownlistArrowIcon.addClass(this.toThemeProperty('jqx-icon'));
            this.dropdownlistArrow.append(this.dropdownlistArrowIcon);
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-combobox-arrow-normal'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            if (!this.rtl) {
                this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-r'));
            }
            else {
                this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-l'));
            }

            this._setSize();
            this._updateHandlers();

            this.addHandler(this.input, 'keyup.textchange', function (event) {
                var foundMatch = me._search(event);
                if (me.cinput && me.input) {
                    me.cinput[0].value = me.input[0].value;
                }
            });

            // fix for IE7
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                if (this.host.parents('.jqx-window').length > 0) {
                    var zIndex = this.host.parents('.jqx-window').css('z-index');
                    container.css('z-index', zIndex + 10);
                    this.listBoxContainer.css('z-index', zIndex + 10);
                }
            }

            if (this.checkboxes) {
                this.input.attr('readonly', true);
                $.jqx.aria(this, "aria-readonly", true);
            }
            else {
                $.jqx.aria(this, "aria-readonly", false);
            }
            if (!this.remoteAutoComplete) {
                this.searchString = "";
            }
        },

        _addInput: function () {
            var name = this.host.attr('name');
            if (!name) name = this.element.id;
            this.cinput = $("<input type='hidden'/>");
            this.host.append(this.cinput);
            this.cinput.attr('name', name);
        },

        _updateInputSelection: function () {
            if (this.cinput) {
                if (this.selectedIndex == -1) {
                    this.cinput.val("");
                }
                else {
                    var selectedItem = this.getSelectedItem();
                    if (selectedItem != null) {
                        this.cinput.val(selectedItem.value);
                    }
                    else {
                        this.cinput.val(this.dropdownlistContent.text());
                    }
                }

                if (this.checkboxes || this.multiSelect) {
                    if (!this.multiSelect) {
                        var items = this.getCheckedItems();
                    }
                    else {
                        var items = this.getSelectedItems();
                    }

                    var str = "";
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (i == items.length - 1) {
                                str += items[i].value;
                            }
                            else {
                                str += items[i].value + ",";
                            }
                        }
                    }
                    this.cinput.val(str);
                }
            }
        },

        _search: function (event) {
            if (event.keyCode == 9)
                return;

            if (this.searchMode == 'none' || this.searchMode == null || this.searchMode == 'undefined') {
                return;
            }

            if (event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 20)
                return false;

            if (this.checkboxes) {
                return false;
            }

            if (this.multiSelect) {
                var span = $("<span style='visibility: hidden; white-space: nowrap;'>" + this.input.val() + "</span>");
                span.addClass(this.toThemeProperty('jqx-widget'));
                $(document.body).append(span);
                var width = span.width() + 15;
                span.remove();

                if (width > this.host.width()) {
                    width = this.host.width();
                }
                if (width < 25) {
                    width = 25;
                }

                this.input.css('width', width + 'px');
                if (this.selectedItems.length == 0) {
                    this.input.css('width', '100%');
                    this.input.attr('placeholder', this.placeHolder);
                }
                else {
                    this.input.attr('placeholder', "");
                }

                var top = parseInt(this._findPos(this.host[0])[1]) + parseInt(this.host.outerHeight()) - 1 + 'px';
                var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();
                var hasTransform = $.jqx.utilities.hasTransform(this.host);
                if (hasTransform || (isMobileBrowser != null && isMobileBrowser)) {
                    top = $.jqx.mobile.getTopPos(this.element) + parseInt(this.host.outerHeight());
                    if ($('body').css('border-top-width') != '0px') {
                        top = parseInt(top) - this._getBodyOffset().top + 'px';
                    }
                }

                this.container.css('top', top);
                var height = parseInt(this.host.height());
                this.dropdownlistArrow.height(height);
            }

            if (!this.isanimating) {
                if (event.altKey && event.keyCode == 38) {
                    this.hideListBox('altKey');
                    return false;
                }

                if (event.altKey && event.keyCode == 40) {
                    if (!this.isOpened()) {
                        this.showListBox('altKey');
                    }
                    return false;
                }
            }

            if (event.keyCode == 37 || event.keyCode == 39)
                return false;

            if (event.altKey || event.keyCode == 18)
                return;

            if (event.keyCode >= 33 && event.keyCode <= 40) {
                return;
            }

            if (event.ctrlKey || this.ctrlKey) {
                return;
            }

            var value = this.input.val();
            if (value.length == 0 && !this.autoComplete) {
                this.listBox.searchString = this.input.val();
                this.listBox.clearSelection();
                this.hideListBox('search');
                this.searchString = this.input.val();
                return;
            }

            if (this.remoteAutoComplete) {
                var me = this;
                var clearListSelection = function () {
                    me.listBox.vScrollInstance.value = 0;
                }

                if (value.length >= me.minLength) {
                    if (!event.ctrlKey && !event.altKey) {
                        if (me.searchString != value) {
                            var source = me.listBoxContainer.jqxListBox('source');
                            if (source == null) {
                                me.listBoxContainer.jqxListBox({ source: me.source });
                            }
                            if (this._searchTimer) {
                                clearTimeout(this._searchTimer);
                            }
                            if (event.keyCode != 13 && event.keyCode != 27) {
                                this._searchTimer = setTimeout(function () {
                                    clearListSelection();
                                    if (me.autoDropDownHeight) {
                                        me.listBox.autoHeight = true;
                                    }
                                    me.searchString = me.input.val();
                                    if (me.search != null) {
                                        me.search(me.input.val());
                                    }
                                    else {
                                        throw "'search' function is not defined";
                                    }

                                }, this.remoteAutoCompleteDelay);
                            }
                        }
                        me.searchString = value;
                    }
                }
                else {
                    if (this._searchTimer) clearTimeout(this._searchTimer);
                    clearListSelection();
                    me.searchString = "";
                    me.listBoxContainer.jqxListBox({ source: null });
                }
                return;
            }

            var me = this;
            if (value === me.searchString) {
                return;
            }

            if (!(event.keyCode == '27' || event.keyCode == '13')) {
                var matches = this._updateItemsVisibility(value);
                var matchItems = matches.matchItems;
                var index = matches.index;
                if (!this.autoComplete && !this.removeAutoComplete) {
                    if (!this.multiSelect || (this.multiSelect && index >= 0)) {
                        this.listBox.selectIndex(index);
                        var isInView = this.listBox.isIndexInView(index);
                        if (!isInView) {
                            this.listBox.ensureVisible(index);
                        }
                        else {
                            this.listBox._renderItems();
                        }
                    }
                }

                if (this.autoComplete && matchItems.length === 0) {
                    this.hideListBox('search');
                }
            }

            if (event.keyCode == '13') {
                var isOpen = this.container.css('display') == 'block';
                if (isOpen && !this.isanimating) {
                    this.hideListBox('keyboard');
                    this._oldvalue = this.listBox.selectedValue;
                    return;
                }
            }
            else if (event.keyCode == '27') {
                var isOpen = this.container.css('display') == 'block';
                if (isOpen && !this.isanimating) {
                    if (!self.multiSelect) {
                        var item = this.listBox.getVisibleItem(this._oldvalue);
                        if (item) {
                            var self = this;
                            setTimeout(
                                   function () {
                                       if (self.autoComplete) {
                                           self._updateItemsVisibility("");
                                       }
                                       self.listBox.selectIndex(item.index);
                                       self.renderSelection('api');
                                   }, self.closeDelay);
                        }
                        else {
                            this.clearSelection();
                        }
                    }
                    else {
                        self.input.val("");
                        self.listBox.selectedValue = null;
                    }

                    this.hideListBox('keyboard');
                    this.renderSelection('api');
                    event.preventDefault();
                    return false;
                }
            }
            else {
                if (!this.isOpened() && !this.opening && !event.ctrlKey) {
                    if (this.listBox.visibleItems && this.listBox.visibleItems.length > 0) {
                        if (this.input.val() != this.searchString && this.searchString != undefined && index != -1) {
                            this.showListBox('search');
                        }
                    }
                }
                this.searchString = this.input.val();

                if (this.searchString == "") {
                    index = -1;
                }

                var item = this.listBox.getVisibleItem(index);

                if (item != undefined) {
                    this._updateInputSelection();
                }
            }
        },

        val: function (value) {
            if (!this.input) return "";
            if (typeof value === 'object' || arguments.length == 0) {
                var item = this.getSelectedItem();
                if (item) {
                    return item.value;
                }

                return this.input.val();
            }
            else {
                var item = this.getItemByValue(value);
                if (item != null) {
                    this.selectItem(item);
                }
                else {
                    this.input.val(value);
                }
                return this.input.val();
            }
        },

        focus: function () {
            var me = this;
            var doFocus = function () {
                me.input.focus();
                var val = me.input.val();
                me._setSelection(0, val.length);
            }
            doFocus();
            setTimeout(function () {
                doFocus();
            }, 10);
        },

        _setSelection: function (start, end) {
            try {
                if ('selectionStart' in this.input[0]) {
                    this.input[0].focus();
                    this.input[0].setSelectionRange(start, end);
                }
                else {
                    var range = this.input[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
            catch (error) {
            }
        },

        setContent: function (value) {
            this.input.val(value);
        },

        // get all matches of a searched value.
        _updateItemsVisibility: function (value) {
            var items = this.getItems();
            if (items == undefined) {
                return { index: -1, matchItem: new Array() }
            }

            var me = this;
            var index = -1;
            var matchItems = new Array();
            var newItemsIndex = 0;

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';

                    var matches = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            matches = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            matches = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            matches = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            matches = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            matches = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            matches = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            matches = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            matches = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (me.autoComplete && !matches) {
                        this.visible = false;
                    }

                    if (matches && me.autoComplete) {
                        matchItems[newItemsIndex++] = this;
                        this.visible = true;
                        index = this.visibleIndex;
                    }

                    if (value == '' && me.autoComplete) {
                        this.visible = true;
                        matches = false;
                    }

                    if (me.multiSelect) {
                        this.disabled = false;
                        if (me.selectedItems.indexOf(this.value) >= 0 || me._disabledItems.indexOf(this.value) >= 0) {
                            this.disabled = true;
                            matches = false;
                        }
                    }

                    if (!me.multiSelect) {
                        if (matches && !me.autoComplete) {
                            index = this.visibleIndex;
                            return false;
                        }
                    }
                    else {
                        if (matches && !me.autoComplete) {
                            if (index === -1) {
                                index = this.visibleIndex;
                            }
                            return true;
                        }
                    }
                }
            });
            this.listBox.searchString = value;
            var that = this;
            var selectFirstItem = function () {
                if (!that.multiSelect) return;
                var nonDisabledIndex = 0;
                var foundIndex = false;
                var item = null;
                for (var indx = 0; indx < that.listBox.items.length; indx++) {
                    that.listBox.selectedIndexes[indx] = -1;
                    if (!that.listBox.items[indx].disabled) {
                        if (foundIndex == false) {
                            item = that.listBox.items[indx];
                            nonDisabledIndex = item.visibleIndex;
                            foundIndex = true;
                        }
                    }
                }
                that.listBox.selectedIndex = -1;
                that.listBox.selectedIndex = nonDisabledIndex;
                that.listBox.selectedIndexes[nonDisabledIndex] = nonDisabledIndex;
                if (that.listBox.visibleItems.length > 0) {
                    if (item) {
                        that.listBox.selectedValue = item.value;
                    }
                    else {
                        that.listBox.selectedValue = null;
                    }
                }
                else {
                    that.listBox.selectedValue = null;
                }
                that.listBox.ensureVisible(0);
            }

            if (!this.autoComplete) {
                selectFirstItem();
                return { index: index, matchItems: matchItems };
            }

            this.listBox.renderedVisibleItems = new Array();
            var vScrollValue = this.listBox.vScrollInstance.value;
            this.listBox.vScrollInstance.value = 0;
            this.listBox.visibleItems = new Array();
            this.listBox._renderItems();
            var selectedValue = this.listBox.selectedValue;
            var item = this.listBox.getItemByValue(selectedValue);
            if (!this.multiSelect) {
                if (item) {
                    if (item.visible) {
                        this.listBox.selectedIndex = item.visibleIndex;
                        for (var indx = 0; indx < this.listBox.items.length; indx++) {
                            this.listBox.selectedIndexes[indx] = -1;
                        }
                        this.listBox.selectedIndexes[item.visibleIndex] = item.visibleIndex;
                    }
                    else {
                        for (var indx = 0; indx < this.listBox.items.length; indx++) {
                            this.listBox.selectedIndexes[indx] = -1;
                        }
                        this.listBox.selectedIndex = -1;
                    }
                }
            }
            else {
                selectFirstItem();
            }

            this.listBox._renderItems();
            var height = this.listBox._calculateVirtualSize().height;
            if (height < vScrollValue) {
                vScrollValue = 0;
                this.listBox.vScrollInstance.refresh();
            }
            if (this.autoDropDownHeight) {
                this._disableSelection = true;
                if (this.listBox.autoHeight != this.autoDropDownHeight) {
                    this.listBoxContainer.jqxListBox({ autoHeight: this.autoDropDownHeight });
                }
                this.container.height(height + 25);
                this.listBox.invalidate();
                this._disableSelection = false;
            }
            else {
                if (height < parseInt(this.dropDownHeight)) {
                    var scrollOffset = this.listBox.hScrollBar[0].style.visibility == "hidden" ? 0 : 20;
                    this.listBox.height = scrollOffset + height;
                    this.container.height(height + 25 + scrollOffset);
                    this.listBox.invalidate();
                }
                else {
                    this.listBox.height = parseInt(this.dropDownHeight);
                    this.container.height(parseInt(this.dropDownHeight) + 25);
                    this.listBox.invalidate();
                }
            }

            this.listBox.vScrollInstance.setPosition(vScrollValue);
            return { index: index, matchItems: matchItems };
        },

        // gets all items that match to a search value.
        findItems: function (value) {
            var items = this.getItems();
            var me = this;
            var index = 0;
            var matchItems = new Array();

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';

                    var matches = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            matches = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            matches = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            matches = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            matches = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            matches = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            matches = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            matches = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            matches = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (matches) {
                        matchItems[index++] = this;
                    }
                }
            });

            return matchItems;
        },

        //[optimize]
        _resetautocomplete: function () {
            $.each(this.listBox.items, function (i) {
                this.visible = true;
            });
            this.listBox.vScrollInstance.value = 0;
            this.listBox._addItems();
            this.listBox.autoHeight = false;

            this.listBox.height = this.dropDownHeight;
            this.container.height(parseInt(this.dropDownHeight) + 25);
            this.listBoxContainer.height(parseInt(this.dropDownHeight));
            this.listBox._arrange();

            this.listBox._addItems();
            this.listBox._renderItems();
        },

        // gets all items.
        getItems: function () {
            var item = this.listBox.items;
            return item;
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

            if (isPercentage) {
                var me = this;
                var width = this.host.width();
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }
                this.listBoxContainer.jqxListBox({ width: width });
                this.container.width(parseInt(width) + 25);
                this._arrange();
            }
            var me = this;
            var resizeFunc = function () {
                if (me.multiSelect) {
                    me.host.height(me.height);
                }

                me._arrange();
                if (me.multiSelect) {
                    me.host.height('auto');
                }
            }

            $.jqx.utilities.resize(this.host, function () {
                resizeFunc();
                me.hideListBox('api');
            });
        },

        // returns true when the listbox is opened, otherwise returns false.
        isOpened: function () {
            var me = this;
            var openedListBox = $.data(document.body, "openedComboJQXListBox" + this.element.id);

            if (this.container.css('display') != 'block')
                return false;

            if (openedListBox != null && openedListBox == me.listBoxContainer) {
                return true;
            }

            return false;
        },

        _updateHandlers: function () {
            var self = this;
            var hovered = false;
            this.removeHandlers();

            if (this.multiSelect) {
                this.addHandler(this.dropdownlistContent, 'click', function (event) {
                    if (event.target.href) return false;

                    self.input.focus();
                    setTimeout(function () {
                        self.input.focus();
                    }, 10);
                });
                this.addHandler(this.dropdownlistContent, 'focus', function (event) {
                    if (event.target.href) return false;

                    self.input.focus();
                    setTimeout(function () {
                        self.input.focus();
                    }, 10);
                });
            }

            if (!this.touch) {
                if (this.host.parents()) {
                    this.addHandler(this.host.parents(), 'scroll.combobox' + this.element.id, function (event) {
                        var opened = self.isOpened();
                        if (opened) {
                            self.close();
                        }
                    });
                }

                this.addHandler(this.host, 'mouseenter', function () {
                    if (!self.disabled && self.enableHover) {
                        hovered = true;
                        self.host.addClass(self.toThemeProperty('jqx-combobox-state-hover'));
                        self.dropdownlistArrowIcon.addClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                        self.dropdownlistArrow.addClass(self.toThemeProperty('jqx-combobox-arrow-hover'));
                        self.dropdownlistArrow.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                    }
                });
                this.addHandler(this.host, 'mouseleave', function () {
                    if (!self.disabled && self.enableHover) {
                        self.host.removeClass(self.toThemeProperty('jqx-combobox-state-hover'));
                        self.dropdownlistArrowIcon.removeClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                        self.dropdownlistArrow.removeClass(self.toThemeProperty('jqx-combobox-arrow-hover'));
                        self.dropdownlistArrow.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                        hovered = false;
                    }
                });
            }

            if (self.autoOpen) {
                this.addHandler(this.host, 'mouseenter', function () {
                    var isOpened = self.isOpened();
                    if (!isOpened && self.autoOpen) {
                        self.open();
                        self.host.focus();
                    }
                });

                this.addHandler($(document), 'mousemove.' + self.id, function (event) {
                    var isOpened = self.isOpened();
                    if (isOpened && self.autoOpen) {
                        var offset = self.host.coord();
                        var top = offset.top;
                        var left = offset.left;
                        var popupOffset = self.container.coord();
                        var popupLeft = popupOffset.left;
                        var popupTop = popupOffset.top;

                        canClose = true;

                        if (event.pageY >= top && event.pageY <= top + self.host.height() + 2) {
                            if (event.pageX >= left && event.pageX < left + self.host.width())
                                canClose = false;
                        }
                        if (event.pageY >= popupTop && event.pageY <= popupTop + self.container.height() - 20) {
                            if (event.pageX >= popupLeft && event.pageX < popupLeft + self.container.width())
                                canClose = false;
                        }

                        if (canClose) {
                            self.close();
                        }
                    }
                });
            }

            var eventName = 'mousedown';
            if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');

            var dropDownButtonClicked = function (event) {
                if (!self.disabled) {
                    var isOpen = self.container.css('display') == 'block';
                    if (!self.isanimating) {
                        if (isOpen) {
                            self.hideListBox('api');
                            if (!$.jqx.mobile.isTouchDevice()) {
                                self.input.focus();
                                setTimeout(function () {
                                    self.input.focus();
                                }, 10);
                            }
                            return true;
                        }
                        else {
                            if (self.autoDropDownHeight) {
                                self.container.height(self.listBoxContainer.height() + 25);
                                var autoheight = self.listBoxContainer.jqxListBox('autoHeight');
                                if (!autoheight) {
                                    self.listBoxContainer.jqxListBox({ autoHeight: self.autoDropDownHeight })
                                    self.listBox._arrange();
                                    self.listBox.ensureVisible(0);
                                    self.listBox._renderItems();
                                    self.container.height(self.listBoxContainer.height() + 25);
                                }
                            }
                            self.showListBox('api');
                            if (!$.jqx.mobile.isTouchDevice()) {
                                setTimeout(function () {
                                    self.input.focus();
                                }, 10);
                            }
                            else {
                                return true;
                            }
                        }
                    }
                }
            }

            this.addHandler(this.dropdownlistArrow, eventName,
            function (event) {
                dropDownButtonClicked(event);
         //       return false;
            });
            this.addHandler(this.dropdownlistArrowIcon, eventName,
            function (event) {

             //   dropDownButtonClicked(event);
           //     return false;
            });

            this.addHandler(this.host, 'focus', function () {
                self.focus();
            });

            this.addHandler(this.input, 'focus', function (event) {
                self.focused = true;
                self.host.addClass(self.toThemeProperty('jqx-combobox-state-focus'));
                self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                self.dropdownlistContent.addClass(self.toThemeProperty('jqx-combobox-content-focus'));
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                if (event.preventDefault) {
                    event.preventDefault();
                }
                return false;

            });
            this.addHandler(this.input, 'blur', function () {
                self.focused = false;
                if (!self.isOpened() && !self.opening) {
                    if (self.selectionMode == "dropDownList") {
                        self._selectOldValue();
                    }

                    self.host.removeClass(self.toThemeProperty('jqx-combobox-state-focus'));
                    self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                    self.dropdownlistContent.removeClass(self.toThemeProperty('jqx-combobox-content-focus'));
                }
                if (self._searchTimer) clearTimeout(self._searchTimer);
            });
            this.addHandler($(document), 'mousedown.' + this.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.id });
            if (this.touch) {
                this.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.id });
            }

            this.addHandler(this.host, 'keydown', function (event) {
                var isOpen = self.container.css('display') == 'block';
                self.ctrlKey = event.ctrlKey;
                if (self.host.css('display') == 'none') {
                    return true;
                }

                if (event.keyCode == '13' || event.keyCode == '9') {
                    if (isOpen && !self.isanimating) {
                        if (self.listBox.selectedIndex != -1) {
                            self.renderSelection('mouse');
                            var index = self.listBox.selectedIndex;
                            var item = self.listBox.getVisibleItem(index);
                            if (item)
                            {
                                self.listBox.selectedValue = item.value;
                            }
                            self._setSelection(self.input.val().length, self.input.val().length);
                            self.hideListBox('keyboard');
                        }
                        if (event.keyCode == '13') {
                            self._oldvalue = self.listBox.selectedValue;
                        }
                        if (!self.keyboardSelection) {
                            self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                        }

                        if (event.keyCode == '9') return true;
                        return false;
                    }
                }

                if (event.keyCode == 115) {
                    if (!self.isanimating) {
                        if (!self.isOpened()) {
                            self.showListBox('keyboard');
                        }
                        else if (self.isOpened()) {
                            self.hideListBox('keyboard');
                        }
                    }
                    return false;
                }

                if (event.altKey) {
                    if (self.host.css('display') == 'block') {
                        if (!self.isanimating) {
                            if (event.keyCode == 38) {
                                if (self.isOpened()) {
                                    self.hideListBox('altKey');
                                }
                            }
                            else if (event.keyCode == 40) {
                                if (!self.isOpened()) {
                                    self.showListBox('altKey');
                                }
                            }
                        }
                    }
                }

                if (event.keyCode == '27' || event.keyCode == '9') {
                    if (self.isOpened() && !self.isanimating) {
        
                        if (event.keyCode == '27') {
                            if (!self.multiSelect) {
                                var item = self.listBox.getItemByValue(self._oldvalue);
                                if (item) {
                                    setTimeout(
                                        function () {
                                            if (self.autoComplete) {
                                                self._updateItemsVisibility("");
                                            }
                                            self.listBox.selectIndex(item.index);
                                            self.renderSelection('api');
                                        }, self.closeDelay);
                                }
                                else {
                                    self.clearSelection();
                                }
                            }
                            else {
                                self.listBox.selectedValue = null;
                                self.input.val("");
                            }
                        }
                        self.hideListBox('keyboard');


                        if (event.keyCode == '9')
                            return true;

                        self.renderSelection('api');
                        event.preventDefault();

                        return false;
                    }
                }

                var key = event.keyCode;

                if (isOpen && !self.disabled && key != 8) {
                    return self.listBox._handleKeyDown(event);
                }
                else if (!self.disabled && !isOpen) {
                    var key = event.keyCode;
                    // arrow keys.
                    if (key == 33 || key == 34 || key == 35 || key == 36 || key == 38 || key == 40) {
                        return self.listBox._handleKeyDown(event);
                    }
                }
                if (key === 8 && self.multiSelect) {
                    if (self.input.val().length === 0) {
                        var lastItem = self.selectedItems[self.selectedItems.length - 1];
                        self.selectedItems.pop();
                        self._selectedItems.pop();
                        if (lastItem) {
                            self._raiseEvent('3', { index: lastItem.index, type: 'keyboard', item: lastItem });
                            self._raiseEvent('4', { index: lastItem.index, type: 'keyboard', item: lastItem });
                        }

                        self.listBox.selectedValue = null;
                        self.doMultiSelect();
                        return false;
                    }
                }
            });

            this.addHandler(this.listBoxContainer, 'checkChange', function (event) {
                self.renderSelection('mouse');
                self._updateInputSelection();
                self._raiseEvent(5, { label: event.args.label, value: event.args.value, checked: event.args.checked, item: event.args.item });
            });

            this.addHandler(this.listBoxContainer, 'select', function (event) {
                if (!self.disabled) {
                    if (event.args.type != 'keyboard' || self.keyboardSelection) {
                        self.renderSelection(event.args.type);
                        if (!self.multiSelect) {
                            self._raiseEvent('2', { index: event.args.index, type: event.args.type, item: event.args.item });
                        }
                        if (event.args.type == 'mouse') {
                            self._oldvalue = self.listBox.selectedValue;

                            if (!self.checkboxes) {
                                self.hideListBox('mouse');
                                if (!self.touch) {
                                    self.input.focus();
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                    }
                }
            });
            if (this.listBox != null && this.listBox.content != null) {
                this.addHandler(this.listBox.content, 'click', function (event) {
                    if (!self.disabled) {
                        if (self.listBox.itemswrapper) {
                            if (event.target === self.listBox.itemswrapper[0])
                                return true;
                        }

                        if (event.target && event.target.className) {
                            if (event.target.className.indexOf('jqx-fill-state-disabled') >= 0) {                             
                                return true;
                            }
                        }

                        self.renderSelection('mouse');
                        self._oldvalue = self.listBox.selectedValue;
                        if (!self.touch && !self.ishiding) {
                            if (!self.checkboxes) {
                                self.hideListBox('mouse');
                                self.input.focus();
                            }
                        }
                        if (self.touch === true) {
                            if (!self.checkboxes) {
                                self.hideListBox('mouse');
                            }
                        }
                    }
                });
            }
        },

        _selectOldValue: function()
        {
            var self = this;
            if (self.listBox.selectedIndex == -1) {
                if (!self.multiSelect) {
                    var item = self.listBox.getItemByValue(self._oldvalue);
                    if (item) {
                        setTimeout(
                            function () {
                                if (self.autoComplete) {
                                    self._updateItemsVisibility("");
                                }
                                self.listBox.selectIndex(item.index);
                                self.renderSelection('api');
                            }, self.closeDelay);
                    }
                    else {
                        self.clearSelection();
                        self.listBox.selectIndex(0);
                        self.renderSelection('api');
                    }
                }
                else {
                    self.listBox.selectedValue = null;
                    self.input.val("");
                }
            }
            else {
                self.renderSelection('api');
            }
        },

        removeHandlers: function () {
            var self = this;
            if (this.dropdownlistWrapper != null) {
                this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            }

            if (this.dropdownlistContent) {
                this.removeHandler(this.dropdownlistContent, 'click');
                this.removeHandler(this.dropdownlistContent, 'focus');
            }
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'focus');
            if (this.input != null) {
                this.removeHandler(this.input, 'focus');
                this.removeHandler(this.input, 'blur');
            }
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler($(document), 'mousemove.' + self.id);
            if (this.listBoxContainer) {
                this.removeHandler(this.listBoxContainer, 'checkChange');
                this.removeHandler(this.listBoxContainer, 'select');
            }
            if (this.host.parents()) {
                this.removeHandler(this.host.parents(), 'scroll.combobox' + this.element.id);
            }
            if (this.dropdownlistArrowIcon && this.dropdownlistArrow) {
                var eventName = 'mousedown';
                if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
                this.removeHandler(this.dropdownlistArrowIcon, eventName);
                this.removeHandler(this.dropdownlistArrow, eventName);
            }
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

        getVisibleItem: function (index) {
            var item = this.listBox.getVisibleItem(index);
            return item;
        },

        // renders the selection.
        renderSelection: function (type) {
            if (type == undefined || type == 'none') {
                return;
            }

            if (this._disableSelection === true)
                return;

            if (this.listBox == null)
                return;

            if (this.multiSelect) {
                return;
            }
            var item = this.listBox.visibleItems[this.listBox.selectedIndex];

            if (this.autoComplete && !this.checkboxes) {
                if (this.listBox.selectedValue !== undefined) {
                    var item = this.getItemByValue(this.listBox.selectedValue);
                }
            }

            if (this.checkboxes) {
                var checkedItems = this.getCheckedItems();
                if (checkedItems != null && checkedItems.length > 0) {
                    item = checkedItems[0];
                }
                else item = null;
            }
            if (item == null) {
                var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
                this.input.val("");
                if (!ie7) {
                    this.input.attr('placeholder', this.placeHolder);
                }
                this._updateInputSelection();
                return;
            }

            this.selectedIndex = this.listBox.selectedIndex;
            var spanElement = $('<span></span>');

            if (item.label != undefined && item.label != null && item.label.toString().length > 0) {
                $.jqx.utilities.html(spanElement, item.label);
            }
            else if (item.value != undefined && item.value != null && item.value.toString().length > 0) {
                $.jqx.utilities.html(spanElement, item.value);
            }
            else if (item.title != undefined && item.title != null && item.title.toString().length > 0) {
                $.jqx.utilities.html(spanElement, item.title);
            }
            else {
                $.jqx.utilities.html(spanElement, this.emptyString);
            }
            var spanHeight = spanElement.outerHeight();
            if (this.checkboxes) {
                var items = this.getCheckedItems();
                var str = "";
                for (var i = 0; i < items.length; i++) {
                    if (i == items.length - 1) {
                        str += items[i].label;
                    }
                    else {
                        str += items[i].label + ", ";
                    }
                }
                this.input.val(str);
            }
            else {
                this.input.val(spanElement.text());
            }
            spanElement.remove();
            if (this.renderSelectedItem) {
                var result = this.renderSelectedItem(this.listBox.selectedIndex, item);
                if (result != undefined) {
                    this.input.val(result);
                }
            }
            this._updateInputSelection();
            if (this.listBox && this.listBox._activeElement) {
                $.jqx.aria(this, "aria-activedescendant", this.listBox._activeElement.id);
            }
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
            this.listBox.clearSelection();
            this.input.val("");
            if (this.multiSelect) {
                this.listBox.selectedValue = "";
                this.selectedItems = new Array();
                this._selectedItems = new Array();
                this.doMultiSelect(false);
            }
        },

        // unselects an item at specific index.
        // @param Number
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            this.listBox.unselectIndex(index, render);
            this.renderSelection('mouse');
            if (this.multiSelect) {
                if (index >= 0) {
                    var multiItem = this.getItem(index);

                    var indx = this.selectedItems.indexOf(multiItem.value);
                    if (indx >= 0) {
                        if (multiItem.value === this.listBox.selectedValue) {
                            this.listBox.selectedValue = null;
                        }

                        this.selectedItems.splice(indx, 1);
                        this._selectedItems.splice(indx, 1);
                    }
                }
                this.doMultiSelect(false);
            }
        },

        // selects an item at specific index.
        // @param Number
        selectIndex: function (index, ensureVisible, render, forceSelect) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            this.listBox.selectIndex(index, ensureVisible, render, forceSelect);
            this.renderSelection('mouse');
            this.selectedIndex = index;
            if (this.multiSelect) {
                this.doMultiSelect();
            }
        },

        selectItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.selectItem(item);
                this.selectedIndex = this.listBox.selectedIndex;
                this.renderSelection('mouse');
                if (this.multiSelect) {
                    this.doMultiSelect(false);
                }
            }
        },

        unselectItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.unselectItem(item);
                this.renderSelection('mouse');
                if (this.multiSelect) {
                    var multiItem = this.getItemByValue(item);
                    if (multiItem) {
                        var index = this.selectedItems.indexOf(multiItem.value);
                        if (index >= 0) {
                            if (multiItem.value === this.listBox.selectedValue) {
                                this.listBox.selectedValue = null;
                            }

                            this.selectedItems.splice(index, 1);
                            this._selectedItems.splice(index, 1);                           
                        }
                    }

                    this.doMultiSelect(false);
                }
            }
        },

        checkItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.checkItem(item);
            }
        },

        uncheckItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.uncheckItem(item);
            }
        },

        indeterminateItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.indeterminateItem(item);
            }
        },

        getSelectedValue: function () {
            return this.listBox.selectedValue;
        },

        // gets the selected index.
        getSelectedIndex: function () {
            return this.listBox.selectedIndex;
        },

        // gets the selected item.
        getSelectedItem: function () {
            return this.getVisibleItem(this.listBox.selectedIndex);
        },

        // gets the selected items when multiselect is enabled.
        getSelectedItems: function () {
            var array = new Array();
            var that = this;
            $.each(this.selectedItems, function () {
                var item = that.getItemByValue(this);
                if (item) {
                    array.push(item);
                }
                else {
                    var item = that._selectedItems[this];
                    if (item) {
                        array.push(item);
                    }
                }
            });
            return array;
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

        insertAt: function (item, index) {
            if (item == null)
                return false;

            return this.listBox.insertAt(item, index);
        },

        addItem: function (item) {
            return this.listBox.addItem(item);
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
            var item = this.getVisibleItem(index);
            if (item) {
                this._disabledItems.push(item.value);
            }
            return this.listBox.disableAt(index);
        },

        enableAt: function (index) {
            var item = this.getVisibleItem(index);
            if (item) {
                this._disabledItems.splice(this._disabledItems.indexOf(item.value), 1);
            }
            return this.listBox.enableAt(index);
        },

        disableItem: function (item) {
            var item = this.getVisibleItem(item);
            if (item) {
                this._disabledItems.push(item.value);
            }
            return this.listBox.disableItem(item);
        },

        enableItem: function (item) {
            var item = this.getVisibleItem(item);
            if (item) {
                this._disabledItems.splice(this._disabledItems.indexOf(item.value), 1);
            }
            return this.listBox.enableItem(item);
        },

        _findPos: function (obj) {
            while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
                obj = obj['nextSibling'];
            }
            if (obj) {
                var position = $(obj).coord(true);
                return [position.left, position.top];
            }
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
                Math.abs(dpHeight + inputHeight + 23) : 0);

            return offset;
        },

        open: function () {
            if (!this.isOpened() && !this.opening) {
                this.showListBox('api');
            }
        },

        close: function () {
            if (this.isOpened()) {
                this.hideListBox('api');
            }
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
        showListBox: function (mode) {
            if (this.listBox.items && this.listBox.items.length == 0)
                return;

            if (this.autoComplete || this.multiSelect && !this.remoteAutoComplete) {
                if (mode != 'search') {
                    this._updateItemsVisibility("");
                }
                if (this.multiSelect) {
                    var visibleItems = this.getVisibleItems();
                    for (var i = 0; i < visibleItems.length; i++) {
                        if (!visibleItems[i].disabled) {
                            this.ensureVisible(i);
                            break;
                        }
                    }
                }
            }
            if (this.remoteAutoComplete) {
                this.listBox.clearSelection();
            }

            if (mode != 'search') {
                this._oldvalue = this.listBox.selectedValue;
            }

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
            var left, leftPos = parseInt(Math.round(this.host.coord(true).left));
            left = leftPos + 'px';

            var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();
            this.ishiding = false;

            var hasTransform = $.jqx.utilities.hasTransform(this.host);

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

            this.host.addClass(this.toThemeProperty('jqx-combobox-state-selected'));
            this.dropdownlistArrowIcon.addClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-combobox-arrow-selected'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this.host.addClass(this.toThemeProperty('jqx-combobox-state-focus'));
            this.host.addClass(this.toThemeProperty('jqx-fill-state-focus'));
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content-focus'));

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
                this.container.css('top', newOffset.top);
                if (parseInt(this.container.css('left')) != newOffset.left) {
                    this.container.css('left', newOffset.left);
                }
            }

            if (this.animationType == 'none') {
                this.container.css('display', 'block');
                $.data(document.body, "openedComboJQXListBoxParent", self);
                $.data(document.body, "openedComboJQXListBox" + self.element.id, listBox);
                listBox.css('margin-top', 0);
                listBox.css('opacity', 1);
            }
            else {
                this.container.css('display', 'block');
                var height = listBox.outerHeight();
                listBox.stop();
                if (this.animationType == 'fade') {
                    listBox.css('margin-top', 0);
                    listBox.css('opacity', 0);
                    listBox.animate({ 'opacity': 1 }, this.openDelay, function () {
                        self.isanimating = false;
                        self.opening = false;
                        $.data(document.body, "openedComboJQXListBoxParent", self);
                        $.data(document.body, "openedComboJQXListBox" + self.element.id, listBox);
                    });
                }
                else {
                    listBox.css('opacity', 1);
                    if (positionChanged) {
                        listBox.css('margin-top', height);
                    }
                    else {
                        listBox.css('margin-top', -height);
                    }
                    this.isanimating = true;
                    this.opening = true;
                    listBox.animate({ 'margin-top': 0 }, this.openDelay, function () {
                        self.isanimating = false;
                        self.opening = false;
                        $.data(document.body, "openedComboJQXListBoxParent", self);
                        $.data(document.body, "openedComboJQXListBox" + self.element.id, listBox);
                    });
                }
            }
            listBoxInstance._renderItems();
            if (!positionChanged) {
                this.host.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
                this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
            }
            else {
                this.host.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
            }
            listBox.addClass(this.toThemeProperty('jqx-fill-state-focus'));

            this._raiseEvent('0', listBoxInstance);
        },

        doMultiSelect: function(setFocus)
        {
            if (this.checkboxes) {
                this.multiSelect = false;
            }

            var that = this;
            if (!this.multiSelect) {
                var buttons = that.dropdownlistContent.find('.jqx-button');
                var eventName = 'mousedown';
                if (this.touch) {
                    eventName = $.jqx.mobile.getTouchEventName('touchstart');
                }
                this.removeHandler(buttons, eventName);
                this.removeHandler(buttons.find('.jqx-icon-close'), eventName);
                buttons.remove();
                this.selectedItems = new Array();
                this._selectedItems = new Array();
                return;
            }

            if (this.validateSelection) {
                var result = this.validateSelection(this.listBox.selectedValue);
                if (!result) {
                    return;
                }
            }

            var oldItems = this.selectedItems;
            if (this.listBox.selectedValue) {
                if (this.selectedItems.indexOf(this.listBox.selectedValue) === -1) {
                    this.selectedItems.push(this.listBox.selectedValue);
                    var item = this.getItemByValue(this.listBox.selectedValue);
                    if (item) {
                        this._selectedItems.push(item);
                        this._raiseEvent('2', { index: item.index, item: item });
                        this._raiseEvent('4', { index: item.index, item: item });
                    }
                }
                this.listBox.selectedIndex = 0;
            }
            
            var items = this.listBox.items;
            for (var i = 0; i < items.length; i++) {
                items[i].disabled = false;
                if (this.selectedItems.indexOf(items[i].value) >= 0 || this._disabledItems.indexOf(this.value) >= 0) {
                    items[i].disabled = true;
                }
            }
            this.listBox._renderItems();

            this.searchString = "";
            this.input.val("");
            var items = "";
            var eventName = 'mousedown';

            var buttons = that.dropdownlistContent.find('.jqx-button');
            if (this.touch) {
                eventName = $.jqx.mobile.getTouchEventName('touchstart');
            }
            this.removeHandler(buttons, eventName);
            this.removeHandler(buttons.find('.jqx-icon-close'), eventName);
            buttons.remove();
       
            that.input.detach();
            if (this.selectedItems.length > 0) {
                that.input.css('width', '25px');
                that.input.attr('placeholder', "");
            }
            else {
                that.input.css('width', '100%');
                that.input.attr('placeholder', this.placeHolder);
            }
   
            $.each(this.selectedItems, function (index) {
                var item = that.getItemByValue(this);
                if (!item || that.remoteAutoComplete) {
                    item = that._selectedItems[index];
                }

                var group = $('<div style="overflow: hidden; float: left;"></div>');
                group.addClass(that.toThemeProperty('jqx-button'));
                group.addClass(that.toThemeProperty('jqx-combobox-multi-item'));
                group.addClass(that.toThemeProperty('jqx-fill-state-normal'));
                group.addClass(that.toThemeProperty('jqx-rc-all'));
                if (item) {
                    var text = item.label;
                   if (group[0].innerHTML == '') {
                        group[0].innerHTML = '<a data-value="' + item.value + '" style="float: left;" href="#">' + text + '</a>';
                    }
                    if (that.rtl) {
                        group[0].innerHTML = '<a data-value="' + item.value + '" style="float: right;" href="#">' + text + '</a>';
                    }
                    var fl = !that.rtl ? 'right' : 'left';

                    var closebutton = '<div style="position: relative; overflow: hidden; float: ' + fl + '; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        closebutton = '<div style="position: relative; overflow: hidden; float: left; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                    }
                    if (that.rtl) {
                        var closebutton = '<div style="position: relative; overflow: hidden; float: ' + fl + '; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                        if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                            closebutton = '<div style="position: relative; overflow: hidden; float: left; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                        }
                    }

                    group[0].innerHTML += closebutton;
                }
                else {
                    if (group[0].innerHTML == '') {
                        group[0].innerHTML = '<a href="#"></a>';
                    }
                }
                that.dropdownlistContent.append(group);
            });
            that.dropdownlistContent.append(that.input);
            that.input.val("");
            if (setFocus !== false) {
                that.input.focus();
                setTimeout(function () {
                    that.input.focus();
                }, 10);
            }
            var buttons = that.dropdownlistContent.find('.jqx-button');
            
            if (this.touchMode === true) eventName = "mousedown";
            this.addHandler(buttons, eventName, function (event) {
                if (event.target.className.indexOf('jqx-icon-close') >= 0)
                    return true;

                var text = $(event.target).attr('data-value');
                var item = that.getItemByValue(text);
                if (item) {
                    that.listBox.selectedValue = null;
                    that.listBox.clearSelection();
                }
                that.listBox.scrollTo(0, 0);
                that.open();
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                return false;
            });
            this.addHandler(buttons.find('.jqx-icon-close'), eventName, function (event) {
                if (that.disabled) {
                    return;
                }

                var text = $(event.target).parent().parent().find('a').attr('data-value');
                var item = that.getItemByValue(text);
                if (item) {
                    that.listBox.selectedValue = null;
                    var index = that.selectedItems.indexOf(text);
                    if (index >= 0) {
                        that.selectedItems.splice(index, 1);
                        that._selectedItems.splice(index, 1);
                        that._raiseEvent('3', { index: item.index, type: 'mouse', item: item });
                        that._raiseEvent('4', { index: item.index, type: 'mouse', item: item });
                        that.doMultiSelect();
                    }
                    else {
                        for (var i = 0; i < that.selectedItems.length; i++)
                        {
                            var selectedItem = that.selectedItems[i];
                            if (selectedItem == text) {
                                that.selectedItems.splice(i, 1);
                                that._selectedItems.splice(i, 1);
                                that._raiseEvent('3', { index: item.index, type: 'mouse', item: item });
                                that._raiseEvent('4', { index: item.index, type: 'mouse', item: item });
                                that.doMultiSelect();
                                break;
                            }
                        }
                    }
                }
            });
            that.dropdownlistArrow.height(this.host.height());
            that._updateInputSelection();
        },

        // hides the listbox.
        hideListBox: function (mode) {
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var container = this.container;
            if (this.container[0].style.display == 'none')
                return;
      
            $.jqx.aria(this, "aria-expanded", false);

            if (mode == "keyboard" || mode == "mouse") {
                this.listBox.searchString = "";
            }

            if (mode == "keyboard" || mode == "mouse" && this.multiSelect) {
                this.doMultiSelect();
            }

            var me = this;
            $.data(document.body, "openedComboJQXListBox" + this.element.id, null);
            if (this.animationType == 'none') {
                this.opening = false;
                this.container.css('display', 'none');
            }
            else {
                if (!this.ishiding) {
                    var height = listBox.outerHeight();
                    listBox.css('margin-top', 0);
                    listBox.stop();
                    this.opening = false;
                    this.isanimating = true;
                    var animationValue = -height;
                    if (parseInt(this.container.coord().top) < parseInt(this.host.coord().top)) {
                        animationValue = height;
                    }
                    if (this.animationType == 'fade') {
                        listBox.css({ 'opacity': 1 });
                        listBox.animate({ 'opacity': 0 }, this.closeDelay, function () {
                            me.isanimating = false;
                            container.css('display', 'none');
                            me.ishiding = false;
                        });
                    }
                    else {
                        listBox.animate({ 'margin-top': animationValue }, this.closeDelay, function () {
                            me.isanimating = false;
                            container.css('display', 'none'); me.ishiding = false;
                        });
                    }
                }
            }

            this.ishiding = true;
            this.host.removeClass(this.toThemeProperty('jqx-combobox-state-selected'));
            this.dropdownlistArrowIcon.removeClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-combobox-arrow-selected'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if (!this.focused) {
                this.host.removeClass(this.toThemeProperty('jqx-combobox-state-focus'));
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
                this.dropdownlistContent.removeClass(this.toThemeProperty('jqx-combobox-content-focus'));
            }
            this.host.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.host.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));

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
                return;
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
                        if (this.className.indexOf('jqx-combobox') != -1) {
                            if (self.element.id == this.id) {
                                isListBox = true;
                            }
                            return false;
                        }
                    }
                }
            });

            if (openedListBox != null && !isListBox) {
                if (self.isOpened()) {
                    self.hideListBox('api');
                    self.input.blur();
                }
            }

            return true;
        },

        loadFromSelect: function (id) {
            this.listBox.loadFromSelect(id);
        },

        refresh: function (initialRefresh) {
            this._setSize();
            this._arrange();
            if (this.listBox) {
                this.renderSelection();
            }
        },

        resize: function()
        {
            this._setSize();
            this._arrange();
        },

        _arrange: function () {
            var width = parseInt(this.host.width());
            var height = parseInt(this.host.height());

            var arrowHeight = this.arrowSize;
            var arrowWidth = this.arrowSize;
      
            var rightOffset = 1;
            if (!this.showArrow) {
                arrowWidth = 0;
                arrowHeight = 0;
                this.dropdownlistArrow.hide();
                rightOffset = 0;
                this.host.css('cursor', 'arrow');
            }

            var contentWidth = width - arrowWidth - 1 * rightOffset;
            if (contentWidth > 0) {
                this.dropdownlistContent[0].style.width = contentWidth + 'px';
            }
            if (this.rtl) {
                this.dropdownlistContent[0].style.width = (-1+contentWidth + 'px');
            }

            this.dropdownlistContent[0].style.height = height + 'px';
            this.dropdownlistContent[0].style.left = '0px';
            this.dropdownlistContent[0].style.top = '0px';
            this.dropdownlistArrow[0].style.width = arrowWidth + 1 + 'px';
            this.dropdownlistArrow[0].style.height = height + 'px';
            this.dropdownlistArrow[0].style.left = 1 + contentWidth + 'px';

            this.input[0].style.width = '100%';
            var inputHeight = this.input.height();
            if (inputHeight == 0) {
                inputHeight = parseInt(this.input.css('font-size')) + 3;
            }

            if (this.input[0].className.indexOf('jqx-rc-all') == -1) {
                this.input.addClass(this.toThemeProperty('jqx-rc-all'));
            }

            var top = parseInt(height) / 2 - parseInt(inputHeight) / 2;
            if (top > 0) {
                this.input[0].style.marginTop = parseInt(top) + "px";
            }

            if (this.rtl) {
                this.dropdownlistArrow.css('left', '0px');
                this.dropdownlistContent.css('left', this.dropdownlistArrow.width());
                if ($.jqx.browser.msie && $.jqx.browser.version <= 8) {
                    this.dropdownlistContent.css('left', 1 + this.dropdownlistArrow.width());
                }
            }
            if (this.multiSelect) {
                this.input.css('float', 'left');
        //        this.input.width(25);
                this.dropdownlistWrapper.parent().css('height', 'auto');
                this.dropdownlistContent.css('height', 'auto');
                this.dropdownlistWrapper.css('height', 'auto');
                this.dropdownlistContent.css('position', 'relative');
                this.dropdownlistContent.css('cursor', 'text');
                this.host.css('height', 'auto');
                this.host.css('min-height', this.height);
                this.dropdownlistContent.css('min-height', this.height);
                var height = parseInt(this.host.height());
                this.dropdownlistArrow.height(height);
                var initialHeight = parseInt(this.host.css('min-height'));
                var top = parseInt(initialHeight) / 2 - parseInt(inputHeight) / 2;
                if (top > 0) {
                    this.input.css('margin-top', top);
                }
            }
        },

        destroy: function () {
            if (this.source && this.source.unbindBindingUpdate) {
                this.source.unbindBindingUpdate(this.element.id);
                this.source.unbindBindingUpdate(this.listBoxContainer[0].id);
                this.source.unbindDownloadComplete(this.element.id);
                this.source.unbindDownloadComplete(this.listBoxContainer[0].id);
            }
            $.jqx.utilities.resize(this.host, null, true); 
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBoxContainer, 'unselect');
            this.removeHandler(this.listBoxContainer, 'change');
            this.removeHandler(this.listBoxContainer, 'bindingComplete');
            this.removeHandler(this.dropdownlistWrapper, 'selectstart');
            this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBox.content, 'click');
            this.removeHandlers();
            this.removeHandler(this.input, 'keyup.textchange');

            this.listBoxContainer.jqxListBox('destroy');
            this.listBoxContainer.remove();
            this.host.removeClass();
            this.removeHandler($(document), 'mousedown.' + this.id, this.closeOpenedListBox);
            if (this.touch) {
                this.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id);
            }
            this.cinput.remove();
            delete this.cinput;
            this.dropdownlistArrow.remove();
            delete this.dropdownlistArrow;
            this.dropdownlistArrowIcon.remove();
            delete this.dropdownlistArrowIcon;
            delete this.dropdownlistWrapper;
            delete this.listBoxContainer;
            delete this.input;
            delete this.dropdownlistContent;
            delete this.comboStructure;
            this.container.remove();
            delete this.listBox;
            delete this.container;
            var vars = $.data(this.element, "jqxComboBox");
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

        //[optimize]
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

            if (key === "touchMode") {
                object.listBoxContainer.jqxListBox({ touchMode: value });
                object.touch = $.jqx.mobile.isTouchDevice();
                if (object.touchMode === true) {
                    object.touch = true;
                }
                object._updateHandlers();
            }

            if (key == "multiSelect")
            {
                if (value) {
                    object.doMultiSelect(false);
                }
                else {
                    object.doMultiSelect(false);
                    object.dropdownlistWrapper.parent().css('height', '100%');
                    object.dropdownlistContent.css('height', '100');
                    object.dropdownlistWrapper.css('height', '100');
                    object.dropdownlistContent.css('position', 'relative');
                    object.host.css('min-height', null);
                    object._setSize();
                    object._arrange();
                }
            }

            if (key == "showArrow") {
                object._arrange();
                if (object.multiSelect) {
                    object.doMultiSelect(false);
                }
            }

            if (key == 'popupZIndex') {
                object.listBoxContainer.css({ zIndex: object.popupZIndex });
            }

            if (key == 'promptText') {
                object.placeHolder = value;
            }

            if (key == 'autoOpen') {
                object._updateHandlers();
            }

            if (key == 'renderer') {
                object.listBox.renderer = object.renderer;
            }
            if (key == 'itemHeight') {
                object.listBox.itemHeight = value;
            }

            if (key == 'source') {
                object.input.val("");
                object.listBoxContainer.jqxListBox({ source: object.source });
                object.renderSelection('mouse');
                if (object.source == null) {
                    object.clearSelection();
                }
                if (object.multiSelect) {
                    object.selectedItems = new Array();
                    object._selectedItems = new Array();
                    object.doMultiSelect(false);
                }
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
            if (key == "displayMember" || key == "valueMember") {
                object.listBoxContainer.jqxListBox({ displayMember: object.displayMember, valueMember: object.valueMember });
                object.renderSelection('mouse');
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

            if (key == 'autoComplete') {
                object._resetautocomplete();
            }

            if (key == "checkboxes") {
                object.listBoxContainer.jqxListBox({ checkboxes: object.checkboxes });
                if (object.checkboxes) {
                    object.input.attr('readonly', true);
                    $.jqx.aria(object, "aria-readonly", true);
                }
                else {
                    $.jqx.aria(object, "aria-readonly", false);
                }
            }

            if (key == 'theme' && value != null) {
                object.listBoxContainer.jqxListBox({ theme: value });
                object.listBoxContainer.addClass(object.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    object.listBoxContainer.addClass(object.toThemeProperty('jqx-noshadow'));
                }
                object.dropdownlistContent.removeClass();
                object.dropdownlistContent.addClass(object.toThemeProperty('jqx-combobox-content'));
                object.dropdownlistContent.addClass(object.toThemeProperty('jqx-widget-content'));
                object.input.removeClass();
                object.input.addClass(object.toThemeProperty('jqx-combobox-input'));
                object.input.addClass(this.toThemeProperty('jqx-widget-content'));
                object.host.removeClass();
                object.host.addClass(object.toThemeProperty('jqx-combobox-state-normal'));
                object.host.addClass(object.toThemeProperty('jqx-rc-all'));
                object.host.addClass(object.toThemeProperty('jqx-widget'));
                object.host.addClass(object.toThemeProperty('jqx-widget-content'));
                object.dropdownlistArrow.removeClass();
                object.dropdownlistArrowIcon.addClass(object.toThemeProperty('jqx-icon-arrow-down'));
                object.dropdownlistArrow.addClass(object.toThemeProperty('jqx-combobox-arrow-normal'));
                object.dropdownlistArrow.addClass(object.toThemeProperty('jqx-fill-state-normal'));
            }

            if (key == 'rtl') {
                object.render();
                object.refresh();
            }

            if (key == 'width' || key == 'height') {
                object._setSize();
                if (key == 'width') {
                    if (object.dropDownWidth == 'auto') {
                        var width = object.host.width();
                        object.listBoxContainer.jqxListBox({ width: width });
                        object.container.width(parseInt(width) + 25);
                    }
                }
                object._arrange();
            }

            if (key == 'selectedIndex') {
                object.listBox.selectIndex(value);
                object.renderSelection('mouse');
            }
        }
    });
})(jQuery);
