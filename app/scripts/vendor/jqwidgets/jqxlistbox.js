/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxListBox", "", {});

    $.extend($.jqx._jqxListBox.prototype, {
        defineInstance: function () {
            // Type: Boolean
            // Default: true    
            // enables/disables the listbox.
            this.disabled = false;
            // gets or sets the listbox width.
            this.width = null;
            // gets or sets the listbox height.
            this.height = null;
            // Represents the collection of list items.
            this.items = new Array();
            // Type: Boolean
            // Default: false
            // enables/disables the multiple selection.
            this.multiple = false;
            // Gets or sets the selected index.
            this.selectedIndex = -1;
            // Gets the selected item indexes.
            this.selectedIndexes = new Array();
            // Type: Object
            // Default: null
            // data source.
            this.source = null;
            // Type: Number
            // Default: 15
            // gets or sets the scrollbars size.
            this.scrollBarSize = $.jqx.utilities.scrollBarSize;
            // Type: Boolean
            // Default: true
            // enables/disables the hover state.
            this.enableHover = true;
            // Type: Boolean
            // Default: true
            // enables/disables the selection.
            this.enableSelection = true;
            // gets the visible items. // this property is internal for the listbox.
            this.visualItems = new Array();
            // gets the groups. // this property is internal for the listbox.
            this.groups = new Array();
            // Type: Boolean
            // Default: true
            // gets or sets whether the items width should be equal to the listbox's width.
            this.equalItemsWidth = true;
            // gets or sets the height of the ListBox Items. When the itemHeight == - 1, each item's height is equal to its desired height.
            this.itemHeight = -1;
            // this property is internal for the listbox.
            this.visibleItems = new Array();
            // Type: String
            // Default: Group
            // represents the text of the empty group. This is displayed only when the items are not loaded from html select element.
            this.emptyGroupText = 'Group';
            // Type: Boolean
            // Default: false
            // Gets or sets whether the listbox should display a checkbox next to each item.
            this.checkboxes = false;
            // Type: Boolean
            // Default: false
            // Gets or sets whether the listbox checkboxes have three states - checked, unchecked and indeterminate.           
            this.hasThreeStates = false;
            // Type: Boolean
            // Default: false
            // Gets or sets whether the listbox's height is equal to the sum of its items height          
            this.autoHeight = false;
            this.autoItemsHeight = false;
            // represents the listbox's events.    
            // Type: Boolean
            // Default: true
            // Gets or sets whether the listbox items are with rounded corners.         
            this.roundedcorners = true;
            this.touchMode = 'auto';
            this.displayMember = "";
            this.valueMember = "";
            // Type: String
            // Default: startswithignorecase
            // Possible Values: 'none, 'contains', 'containsignorecase', 'equals', 'equalsignorecase', 'startswithignorecase', 'startswith', 'endswithignorecase', 'endswith'
            this.searchMode = 'startswithignorecase';
            this.incrementalSearch = true;
            this.incrementalSearchDelay = 1000;
            this.incrementalSearchKeyDownDelay = 300;
            this.allowDrag = false;
            this.allowDrop = true;
            // Possible values: 'none, 'default', 'copy'
            this.dropAction = 'default';
            this.touchModeStyle = 'auto';
            this.keyboardNavigation = true;
            this.enableMouseWheel = true;
            this.multipleextended = false;
            this.emptyString = "null";
            this.rtl = false;
            this.rendered = null;
            this.renderer = null;
            this.dragStart = null;
            this.dragEnd = null;
            this.ready = null;
            this._checkForHiddenParent = true;
            this.aria =
            {
                "aria-disabled": { name: "disabled", type: "boolean" }
            };
            this.events =
            [
            // triggered when the user selects an item.
                'select',
            // triggered when the user unselects an item.
                'unselect',
            // triggered when the selection is changed.
                'change',
            // triggered when the user checks or unchecks an item. 
                'checkChange',
            // triggered when the user drags an item. 
               'dragStart',
            // triggered when the user drops an item. 
               'dragEnd',
            // triggered when the binding is completed.
               'bindingComplete'
            ];
        },

        createInstance: function (args) {
            if ($.jqx.utilities.scrollBarSize != 15) {
                this.scrollBarSize = $.jqx.utilities.scrollBarSize;
            }
            if (this.width == null) this.width = 200;
            if (this.height == null) this.height = 200;
            this.render();
            var that = this;
            $.jqx.utilities.resize(this.host, function () {
                that._updateSize();
            }, false, this._checkForHiddenParent);
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._updateSize();
        },

        render: function () {
            this.element.innerHTML = "";
            var self = this;

            var className = this.element.className;

            className += " " + this.toThemeProperty("jqx-listbox");
            className += " " + this.toThemeProperty("jqx-reset");
            className += " " + this.toThemeProperty("jqx-rc-all");
            className += " " + this.toThemeProperty("jqx-widget");
            className += " " + this.toThemeProperty("jqx-widget-content");

            this.element.className = className;

            var isPercentage = false;

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
                isPercentage = true;
            }
            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
                if (this.host.height() == 0) {
                    this.host.height(200);
                }
                isPercentage = true;
            }
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.element.style.width = parseInt(this.width) + 'px';
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.element.style.height = parseInt(this.height) + 'px';
            };

            if (this.multiple || this.multipleextended || this.checkboxes) {
                $.jqx.aria(this, "aria-multiselectable", true);
            }
            else {
                $.jqx.aria(this, "aria-multiselectable", false);
            }

            var listBoxStructure = $("<div style='-webkit-appearance: none; background: transparent; outline: none; width:100%; height: 100%; align:left; border: 0px; padding: 0px; margin: 0px; left: 0px; top: 0px; valign:top; position: relative;'>" +
                "<div style='-webkit-appearance: none; border: none; background: transparent; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; align:left; left: 0px; top: 0px; valign:top; position: relative;'>" +
                "<div id='listBoxContent' style='-webkit-appearance: none; border: none; background: transparent; outline: none; border: none; padding: 0px; overflow: hidden; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "<div id='verticalScrollBar" + this.element.id + "' style='visibility: inherit; align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "<div id='horizontalScrollBar" + this.element.id + "' style='visibility: inherit; align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "<div id='bottomRight' style='align:left; valign:top; left: 0px; top: 0px; border: none; position: absolute;'/>" +
                "</div>" +
                "</div>");
            if (this._checkForHiddenParent) {
                this._addInput();
                if (!this.host.attr('tabIndex')) {
                    this.host.attr('tabIndex', 1);
                }
            }

            this.host.attr('role', 'listbox');

            this.host.append(listBoxStructure);
            var verticalScrollBar = this.host.find("#verticalScrollBar" + this.element.id);
            if (!this.host.jqxButton) {
                throw new Error('jqxListBox: Missing reference to jqxbuttons.js.');
                return;
            }
            if (!verticalScrollBar.jqxScrollBar) {
                throw new Error('jqxListBox: Missing reference to jqxscrollbar.js.');
                return;
            }

            var largestep = parseInt(this.host.height()) / 2;
            if (largestep == 0) largestep = 10;

            this.vScrollBar = verticalScrollBar.jqxScrollBar({ _initialLayout: true, 'vertical': true, rtl: this.rtl, theme: this.theme, touchMode: this.touchMode, largestep: largestep });
            var horizontalScrollBar = this.host.find("#horizontalScrollBar" + this.element.id);
            this.hScrollBar = horizontalScrollBar.jqxScrollBar({ _initialLayout: true, 'vertical': false, rtl: this.rtl, touchMode: this.touchMode, theme: this.theme });

            this.content = this.host.find("#listBoxContent");
            this.content[0].id = 'listBoxContent' + this.element.id;
            this.bottomRight = this.host.find("#bottomRight").addClass(this.toThemeProperty('jqx-listbox-bottomright')).addClass(this.toThemeProperty('jqx-scrollbar-state-normal'));
            this.bottomRight[0].id = "bottomRight" + this.element.id;
            this.vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            this.hScrollInstance = $.data(this.hScrollBar[0], 'jqxScrollBar').instance;
            if (this.isTouchDevice()) {
                if (!($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                    var overlayContent = $("<div class='overlay' style='z-index: 99; -webkit-appearance: none; border: none; background: black; opacity: 0.01; outline: none; border: none; padding: 0px; overflow: hidden; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>");
                    this.content.parent().append(overlayContent);
                    this.overlayContent = this.host.find('.overlay');
                }
            }
            this._updateTouchScrolling();

            this.host.addClass('jqx-disableselect');
            if (this.host.jqxDragDrop) {
                jqxListBoxDragDrop();
            }
        },

        _highlight: function (label, searchstring) {
            var query = searchstring.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return label.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<b>' + match + '</b>'
            });
        },

        _addInput: function () {
            var name = this.host.attr('name');
            if (!name) name = this.element.id;
            else {
                this.host.attr('name', "");
            }

            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            this.input.attr('name', name);
        },

        _updateTouchScrolling: function () {
            var self = this;
            if (this.isTouchDevice()) {
                self.enableHover = false;
                var element = this.overlayContent ? this.overlayContent : this.content;

                this.removeHandler($(element), $.jqx.mobile.getTouchEventName('touchstart') + '.touchScroll');
                this.removeHandler($(element), $.jqx.mobile.getTouchEventName('touchmove') + '.touchScroll');
                this.removeHandler($(element), $.jqx.mobile.getTouchEventName('touchend') + '.touchScroll');
                this.removeHandler($(element), 'touchcancel.touchScroll');

                $.jqx.mobile.touchScroll(element, self.vScrollInstance.max, function (left, top) {
                    if (self.vScrollBar.css('visibility') != 'hidden') {
                        var oldValue = self.vScrollInstance.value;
                        self.vScrollInstance.setPosition(oldValue + top);
                        self._lastScroll = new Date();
                    }
                    if (self.hScrollBar.css('visibility') != 'hidden') {
                        var oldValue = self.hScrollInstance.value;
                        self.hScrollInstance.setPosition(oldValue + left);
                        self._lastScroll = new Date();
                    }
                }, this.element.id, this.hScrollBar, this.vScrollBar);

                if (self.vScrollBar.css('visibility') != 'visible' && self.hScrollBar.css('visibility') != 'visible') {
                    $.jqx.mobile.setTouchScroll(false, this.element.id);
                }
                else {
                    $.jqx.mobile.setTouchScroll(true, this.element.id);
                }
                this._arrange();
            }
        },

        isTouchDevice: function () {
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                if (this.touchDevice)
                    return true;

                if ($.jqx.browser.msie && $.jqx.browser.version < 9)
                    return false;

                this.touchDevice = true;
                isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.element);
            }
            else if (this.touchMode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice && this.touchModeStyle != false) {
                this.scrollBarSize = $.jqx.utilities.touchScrollBarSize;
            }
            if (isTouchDevice) {
                this.host.addClass(this.toThemeProperty('jqx-touch'));
            }

            return isTouchDevice;
        },

        beginUpdate: function () {
            this.updatingListBox = true;
        },

        endUpdate: function () {
            this.updatingListBox = false;
            this._addItems();
            this._renderItems();
        },

        beginUpdateLayout: function () {
            this.updating = true;
        },

        resumeUpdateLayout: function () {
            this.updating = false;
            this.vScrollInstance.value = 0;
            this._render(false);
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == "itemHeight") {
                object.refresh();
            }

            if (key == 'source' || key == 'checkboxes') {
                if (value == null && oldvalue && oldvalue.unbindBindingUpdate) {
                    oldvalue.unbindBindingUpdate(object.element.id);
                    oldvalue.unbindDownloadComplete(object.element.id);
                }

                object.clearSelection();
                object.refresh();
            }

            if (key == 'scrollBarSize' || key == 'equalItemsWidth') {
                if (value != oldvalue) {
                    object._updatescrollbars();
                }
            }

            if (key == 'disabled') {
                object._renderItems();
                object.vScrollBar.jqxScrollBar({ disabled: value });
                object.hScrollBar.jqxScrollBar({ disabled: value });
            }

            if (key == "touchMode" || key == "rtl") {
                object._removeHandlers();
                object.vScrollBar.jqxScrollBar({ touchMode: value });
                object.hScrollBar.jqxScrollBar({ touchMode: value });
                if (key == "touchMode") {
                    if (!($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                        var overlayContent = $("<div class='overlay' style='z-index: 99; -webkit-appearance: none; border: none; background: black; opacity: 0.01; outline: none; border: none; padding: 0px; overflow: hidden; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>");
                        object.content.parent().append(overlayContent);
                        object.overlayContent = object.host.find('.overlay');
                    }
                }
                object._updateTouchScrolling();
                object._addHandlers();
                object._render(false);
            }

            if (!this.updating) {
                if (key == "width" || key == "height") {
                    object._updateSize();
                }
            }

            if (key == 'theme') {
                if (oldvalue != value) {
                    object.hScrollBar.jqxScrollBar({ theme: object.theme });
                    object.vScrollBar.jqxScrollBar({ theme: object.theme });
                    object.host.removeClass();
                    object.host.addClass(object.toThemeProperty("jqx-listbox"));
                    object.host.addClass(object.toThemeProperty("jqx-widget"));
                    object.host.addClass(object.toThemeProperty("jqx-widget-content"));
                    object.host.addClass(object.toThemeProperty("jqx-reset"));
                    object.host.addClass(object.toThemeProperty("jqx-rc-all"));
                    object.refresh();
                }
            }

            if (key == 'selectedIndex') {
                object.clearSelection();
                object.selectIndex(value, true);
            }

            if (key == "displayMember" || key == "valueMember") {
                if (oldvalue != value) {
                    var oldSelectedIndex = object.selectedIndex;
                    object.refresh();
                    object.selectedIndex = oldSelectedIndex;
                    object.selectedIndexes[oldSelectedIndex] = oldSelectedIndex;
                }
                object._renderItems();
            }

            if (key == 'autoHeight') {
                if (oldvalue != value) {
                    object._render(false);
                }
                else {
                    object._updatescrollbars();
                    object._renderItems();
                }
            }
        },

        loadFromSelect: function (id) {
            if (id == null)
                return;

            var searchElementId = '#' + id;
            var selectElement = $(searchElementId);
            if (selectElement.length > 0) {
                var options = selectElement.find('option');
                var groups = selectElement.find('optgroup');
                var index = 0;
                var selectedOption = -1;
                var optionItems = new Array();

                $.each(options, function () {
                    var hasGroup = groups.find(this).length > 0;
                    var group = null;

                    if (this.text != this.value && (this.label == null || this.label == '')) {
                        this.label = this.text;
                    }

                    var item = { disabled: this.disabled, value: this.value, label: this.label, title: this.title, originalItem: this };

                    var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
                    if (ie7) {
                        if (item.value == '' && this.text != null && this.text.length > 0) {
                            item.value = this.text;
                        }
                    }

                    if (hasGroup) {
                        group = groups.find(this).parent()[0].label;
                        item.group = group;
                    }

                    if (this.selected) selectedOption = index;
                    optionItems[index] = item;
                    index++;
                });

                this.source = optionItems;
                this.fromSelect = true;
                this.clearSelection();
                this.selectedIndex = selectedOption;
                this.selectedIndexes[this.selectedIndex] = this.selectedIndex;
                this.refresh();
            }
        },

        invalidate: function () {
            this._cachedItemHtml = [];
            this._renderItems();
            this.virtualSize = null;
            this._updateSize();
        },

        refresh: function (initialRefresh) {
            var me = this;
            if (this.vScrollBar == undefined) {
                return;
            }
            this._cachedItemHtml = [];
            this.visibleItems = new Array();
            var selectInitialItem = function (initialRefresh) {
                if (initialRefresh == true) {
                    if (me.selectedIndex != -1) {
                        var tmpIndex = me.selectedIndex;
                        me.selectedIndex = -1;
                        me._stopEvents = true;
                        me.selectIndex(tmpIndex, false, true);
                        if (me.selectedIndex == -1) {
                            me.selectedIndex = tmpIndex;
                        }
                        me._stopEvents = false;
                    }
                }
            }
            if (this.itemswrapper != null) {
                this.itemswrapper.remove();
                this.itemswrapper = null;
            }
            if ($.jqx.dataAdapter && this.source != null && this.source._source) {
                this.databind(this.source);
                selectInitialItem(initialRefresh);
                return;
            }
            this.items = this.loadItems(this.source);
            this._raiseEvent('6');

            this._render(false, initialRefresh == true);
            selectInitialItem(initialRefresh);
        },

        _render: function (ensurevisible, initialRefresh) {
            this._addItems();
            this._renderItems();
            this.vScrollInstance.setPosition(0);
            this._cachedItemHtml = new Array();
            if (ensurevisible == undefined || ensurevisible) {
                if (this.items != undefined && this.items != null) {
                    if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
                        this.selectIndex(this.selectedIndex, true, true, true);
                    }
                }
            }

            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
                if (this.isTouchDevice()) {
                    this._removeHandlers();
                    if (this.overlayContent) {
                        this.overlayContent.remove();
                        this.overlayContent = null;
                    }
                    this._updateTouchScrolling();
                    this._addHandlers();
                    return;
                }
            }
            this._updateTouchScrolling();
            if (this.rendered) {
                this.rendered();
            }
            if (this.ready) {
                this.ready();
            }
        },

        _hitTest: function (hitLeft, hitTop) {
            var top = parseInt(this.vScrollInstance.value);
            var firstIndex = this._searchFirstVisibleIndex(hitTop + top, this.renderedVisibleItems)
            if (this.renderedVisibleItems[firstIndex] != undefined && this.renderedVisibleItems[firstIndex].isGroup)
                return null;

            if (this.renderedVisibleItems.length > 0) {
                var lastItem = this.renderedVisibleItems[this.renderedVisibleItems.length - 1];
                if (lastItem.height + lastItem.top < hitTop + top) {
                    return null;
                }
            }

            firstIndex = this._searchFirstVisibleIndex(hitTop + top)
            return this.visibleItems[firstIndex];

            return null;
        },

        _searchFirstVisibleIndex: function (value, collection) {
            if (value == undefined) {
                value = parseInt(this.vScrollInstance.value);
            }
            var min = 0;
            if (collection == undefined || collection == null) {
                collection = this.visibleItems;
            }

            var max = collection.length;
            while (min <= max) {
                mid = parseInt((min + max) / 2)
                var item = collection[mid];
                if (item == undefined)
                    break;

                if (item.initialTop > value && item.initialTop + item.height > value) {
                    max = mid - 1;
                } else if (item.initialTop < value && item.initialTop + item.height <= value) {
                    min = mid + 1;
                } else {
                    return mid;
                    break;
                }
            }

            return 0;
        },

        _renderItems: function () {
            if (this.items == undefined || this.items.length == 0) {
                this.visibleItems = new Array();
                return;
            }

            if (this.updatingListBox == true)
                return;

            var touchDevice = this.isTouchDevice();
            var vScrollInstance = this.vScrollInstance;
            var hScrollInstance = this.hScrollInstance;
            var top = parseInt(vScrollInstance.value);
            var left = parseInt(hScrollInstance.value);
            if (this.rtl) {
                if (this.hScrollBar[0].style.visibility != 'hidden') {
                    left = hScrollInstance.max - left;
                }
            }

            var itemsLength = this.items.length;
            var hostWidth = this.host.width();
            var contentWidth = parseInt(this.content[0].style.width);
            var width = contentWidth + parseInt(hScrollInstance.max);
            var vScrollBarWidth = parseInt(this.vScrollBar[0].style.width) + 2;
            if (this.vScrollBar[0].style.visibility == 'hidden') {
                vScrollBarWidth = 0;
            }

            if (this.hScrollBar[0].style.visibility != 'visible') {
                width = contentWidth;
            }
            var virtualItemsCount = this._getVirtualItemsCount();
            var renderCollection = new Array();
            var y = 0;
            var hostHeight = parseInt(this.element.style.height) + 2;
            if (this.element.style.height.indexOf('%') != -1) {
                hostHeight = this.host.outerHeight();
            }

            if (isNaN(hostHeight)) {
                hostHeight = 0;
            }
            var maxWidth = 0;
            var visibleIndex = 0;
            var renderIndex = 0;

            if (vScrollInstance.value == 0 || this.visibleItems.length == 0) {
                for (var indx = 0; indx < this.items.length; indx++) {
                    var item = this.items[indx];
                    if (item.visible) {
                        item.top = -top;
                        item.initialTop = -top;
                        if (!item.isGroup && item.visible) {
                            this.visibleItems[visibleIndex++] = item;
                            item.visibleIndex = visibleIndex - 1;
                        }

                        this.renderedVisibleItems[renderIndex++] = item;

                        item.left = -left;
                        var bottom = item.top + item.height;
                        if (bottom >= 0 && item.top - item.height <= hostHeight) {
                            renderCollection[y++] = { index: indx, item: item };
                        }

                        top -= item.height;
                    }
                }
            }
            var firstIndex = top > 0 ? this._searchFirstVisibleIndex(this.vScrollInstance.value, this.renderedVisibleItems) : 0;
            var initialHeight = 0;
            y = 0;
            var scrollValue = this.vScrollInstance.value;
            var iterations = 0;
            while (initialHeight < 100 + hostHeight) {
                var item = this.renderedVisibleItems[firstIndex];
                if (item == undefined)
                    break;
                if (item.visible) {
                    item.left = -left;
                    var bottom = item.top + item.height - scrollValue;
                    if (bottom >= 0 && item.initialTop - scrollValue - item.height <= 2 * hostHeight) {
                        renderCollection[y++] = { index: firstIndex, item: item };
                    }
                }

                firstIndex++;
                if (item.visible) {
                    initialHeight += item.initialTop - scrollValue + item.height - initialHeight;
                }
                iterations++;
                if (iterations > this.items.length - 1)
                    break;
            }

            var listItemNormalClass = this.toThemeProperty('jqx-listitem-state-normal') + ' ' + this.toThemeProperty('jqx-item');
            var listItemGroupClass = this.toThemeProperty('jqx-listitem-state-group');
            var listItemDisabledClass = this.toThemeProperty('jqx-listitem-state-disabled') + ' ' + this.toThemeProperty('jqx-fill-state-disabled');
            var middle = 0;
            var me = this;
            for (var indx = 0; indx < this.visualItems.length; indx++) {
                var itemElement = this.visualItems[indx];
                var hideItem = function () {
                    var spanElement = itemElement[0].firstChild; // itemElement.find('#spanElement');
                    if (me.checkboxes) {
                        spanElement = itemElement[0].lastChild;
                    }

                    if (spanElement != null) {
                        spanElement.style.visibility = 'hidden';
                        spanElement.className = "";
                    }

                    if (me.checkboxes) {
                        var checkbox = itemElement.find('.chkbox');
                        checkbox.css({ 'visibility': 'hidden' });
                    }
                }

                if (indx < renderCollection.length) {
                    var item = renderCollection[indx].item;
                    if (item.initialTop - scrollValue >= hostHeight) {
                        hideItem();
                        continue;
                    }

                    var spanElement = $(itemElement[0].firstChild); // itemElement.find('#spanElement');
                    if (this.checkboxes) {
                        spanElement = $(itemElement[0].lastChild);
                    }

                    if (spanElement.length == 0)
                        continue;

                    if (spanElement[0] == null) continue;
                    spanElement[0].className = "";
                    spanElement[0].style.display = "block";
                    spanElement[0].style.visibility = "inherit";
                    var classNameBuilder = "";
                    //                    spanElement.css({ 'display': 'block', 'visibility': 'inherit' });

                    if (!item.isGroup && !this.selectedIndexes[item.index] >= 0) {
                        classNameBuilder = listItemNormalClass;
                        //spanElement.addClass(listItemNormalClass);
                    }
                    else {
                        classNameBuilder = listItemGroupClass;
                        //spanElement.addClass(listItemGroupClass);
                    }

                    if (item.disabled || this.disabled) {
                        classNameBuilder += " " + listItemDisabledClass;
                        //spanElement.addClass(listItemDisabledClass);
                    }

                    if (this.roundedcorners) {
                        classNameBuilder += " " + this.toThemeProperty('jqx-rc-all');
                        //spanElement.addClass(this.toThemeProperty('jqx-rc-all'));
                    }
                    if (touchDevice) {
                        classNameBuilder += " " + this.toThemeProperty('jqx-listitem-state-normal-touch');
                    }

                    spanElement[0].className = classNameBuilder;

                    if (this.renderer) {
                        if (!item.key) item.key = this.generatekey();
                        if (!this._cachedItemHtml) this._cachedItemHtml = new Array();
                        if (this._cachedItemHtml[item.key]) {
                            if (spanElement[0].innerHTML != this._cachedItemHtml[item.key]) {
                                spanElement[0].innerHTML = this._cachedItemHtml[item.key];
                            }
                        }
                        else {
                            var html = this.renderer(item.index, item.label, item.value);
                            spanElement[0].innerHTML = html;
                            this._cachedItemHtml[item.key] = spanElement[0].innerHTML;
                        }

                    }
                    else {
                        if (this.itemHeight !== -1) {
                            var paddingAndBorder = 2 + 2*parseInt(spanElement.css('padding-top'));
                            spanElement[0].style.lineHeight = (item.height - paddingAndBorder) + 'px';
                            spanElement.css('vertical-align', 'middle');
                        }

                        if (item.html != null && item.html.toString().length > 0) {
                            spanElement[0].innerHTML = item.html;
                        }
                        else if (item.label != null || item.value != null) {
                            if (item.label != null) {
                                if (spanElement[0].innerHTML !== item.label) {
                                    spanElement[0].innerHTML = item.label;
                                }
                                if ($.trim(item.label) == "") {
                                    spanElement[0].innerHTML = this.emptyString;
                                    if (this.emptyString == "") {
                                        spanElement[0].style.height = (item.height - 8) + 'px';
                                    }
                                }
                                if (!this.incrementalSearch && !item.disabled) {
                                    if (this.searchString != undefined && this.searchString != "") {
                                        spanElement[0].innerHTML = this._highlight(item.label, this.searchString);
                                    }
                                }
                            }
                            else if (item.label === null) {
                                spanElement[0].innerHTML = this.emptyString;
                                if (this.emptyString == "") {
                                    spanElement[0].style.height = (item.height - 8) + 'px';
                                }
                            }
                            else {
                                if (spanElement[0].innerHTML !== item.value) {
                                    spanElement[0].innerHTML = item.value;
                                }
                                else if (item.label == "") {
                                    spanElement[0].innerHTML = " ";
                                }
                            }
                        }
                        else if (item.label == "" || item.label == null) {
                            spanElement[0].innerHTML = "";
                            spanElement[0].style.height = (item.height - 8) + 'px';
                        }
                    }

                    itemElement[0].style.left = item.left + 'px';
                    itemElement[0].style.top = item.initialTop - scrollValue + 'px';

                    item.element = spanElement[0];
                    //  $.data(spanElement[0], 'item', item);
                    if (item.title) {
                        spanElement[0].title = item.title;
                    }

                    if (this.equalItemsWidth && !item.isGroup) {
                        if (maxWidth == 0) {
                            var itemWidth = parseInt(width);
                            var diff = parseInt(spanElement.outerWidth()) - parseInt(spanElement.width());
                            itemWidth -= diff;
                            var borderSize = 1;
                            if (borderSize != null) {
                                borderSize = parseInt(borderSize);
                            }
                            else borderSize = 0;
                            itemWidth -= 2 * borderSize;
                            maxWidth = itemWidth;
                            if (this.checkboxes && this.hScrollBar[0].style.visibility == 'hidden') {
                                maxWidth -= 18;
                            }
                        }
                        if (contentWidth > this.virtualSize.width) {
                            spanElement[0].style.width = maxWidth + 'px';
                            item.width = maxWidth;
                        }
                        else {
                            spanElement[0].style.width = -4 + this.virtualSize.width + 'px';
                            item.width = this.virtualSize.width - 4;
                        }
                    }
                    else {
                        if (spanElement.width() < this.host.width()) {
                            spanElement.width(this.host.width() - 2);
                        }
                    }

                    if (this.rtl) {
                        spanElement[0].style.textAlign = 'right';
                    }

                    if (this.autoItemsHeight) {
                        spanElement[0].style.whiteSpace = 'normal';
                        spanElement.width(maxWidth);
                        item.width = maxWidth;
                    }
                    middle = 0;
                    if (this.checkboxes && !item.isGroup) {
                        if (middle == 0) {
                            middle = (item.height - 16) / 2;
                            middle++;
                        }
                        var checkbox = $(itemElement.children()[0]);
                        checkbox[0].item = item;

                        if (!this.rtl) {
                            if (spanElement[0].style.left != '18px') {
                                spanElement[0].style.left = '18px';
                            }
                        }
                        else {
                            if (spanElement[0].style.left != '0px') {
                                spanElement[0].style.left = '0px';
                            }
                        }
                        if (this.rtl) {
                            checkbox.css('left', 8 + item.width + 'px');
                        }
                        checkbox[0].style.top = middle + 'px';
                        checkbox[0].style.display = 'block';
                        checkbox[0].style.visibility = 'inherit';
                        var checked = item.checked;
                        var checkClass = item.checked ? " " + this.toThemeProperty("jqx-checkbox-check-checked") : "";
                        if (checked) {
                            checkbox[0].firstChild.firstChild.firstChild.className = checkClass;
                        }
                        else if (checked === false) {
                            checkbox[0].firstChild.firstChild.firstChild.className = "";
                        }
                        else if (checked === null) {
                            checkbox[0].firstChild.firstChild.firstChild.className = this.toThemeProperty("jqx-checkbox-check-indeterminate");
                        }

                        if ($.jqx.ariaEnabled) {
                            if (checked) {
                                itemElement[0].setAttribute('aria-selected', true);
                            }
                            else {
                                itemElement[0].removeAttribute('aria-selected');
                            }
                        }
                       
                    }
                    else if (this.checkboxes) {
                        var checkbox = $(itemElement.children()[0]);
                        checkbox.css({ 'display': 'none', 'visibility': 'inherit' });
                    }

                    if (this.selectedIndexes[item.visibleIndex] >= 0 && !item.disabled) {
                        spanElement.addClass(this.toThemeProperty('jqx-listitem-state-selected'));
                        spanElement.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                        if ($.jqx.ariaEnabled) {
                            itemElement[0].setAttribute('aria-selected', true);
                            this._activeElement = itemElement[0];
                        }
                    }
                    else if (!this.checkboxes) {
                        if ($.jqx.ariaEnabled) {
                            itemElement[0].removeAttribute('aria-selected');
                        }
                    }
                }
                else {
                    hideItem();
                }
            }
        },

        generatekey: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        _calculateVirtualSize: function () {
            var width = 0;
            var height = 2;
            var currentItem = 0;
            var spanElement = $("<span></span>");
            if (this.equalItemsWidth) {
                spanElement.css('float', 'left');
            }
            var itemsPerPage = 0;
            var hostHeight = this.host.outerHeight();

            $(document.body).append(spanElement);
            var length = this.items.length;
            var w = this.host.width();
            if (this.autoItemsHeight) {
                w -= 10;
                if (this.vScrollBar.css('visibility') != 'hidden') w -= 20;
            }

            if (this.autoItemsHeight || this.renderer || this.groups.length > 1 || (length > 0 && this.items[0].html != null && this.items[0].html != "")) {
                for (var currentItem = 0; currentItem < length; currentItem++) {
                    var item = this.items[currentItem];

                    if (item.isGroup && (item.label == '' && item.html == '')) {
                        continue;
                    }

                    if (!item.visible)
                        continue;

                    var className = "";

                    if (!item.isGroup) {
                        className += this.toThemeProperty('jqx-listitem-state-normal jqx-rc-all');
                    }
                    else {
                        className += this.toThemeProperty('jqx-listitem-state-group jqx-rc-all');
                    }
                    className += " " + this.toThemeProperty('jqx-fill-state-normal');
                    if (this.isTouchDevice()) {
                        className += " " + this.toThemeProperty('jqx-touch');
                    }
                    spanElement[0].className = className;
                    if (this.autoItemsHeight) {
                        spanElement[0].style.whiteSpace = 'normal';
                        var checkWidth = this.checkboxes ? -20 : 0;
                        spanElement[0].style.width = (checkWidth + w) + 'px';
                    }

                    if (this.renderer) {
                        var html = this.renderer(item.index, item.label, item.value);
                        spanElement[0].innerHTML = html;
                    }
                    else {
                        if (item.html != null && item.html.toString().length > 0) {
                            spanElement[0].innerHTML = item.html;
                        }
                        else if (item.label != null || item.value != null) {
                            if (item.label != null) {
                                spanElement[0].innerHTML = item.label;
                                if (item.label == "") spanElement[0].innerHTML = "Empty";
                            }
                            else spanElement[0].innerHTML = item.value;
                        }
                    }

                    var spanHeight = spanElement.outerHeight();
                    var spanWidth = spanElement.outerWidth();

                    if (this.itemHeight > -1) {
                        spanHeight = this.itemHeight;
                    }

                    item.height = spanHeight;
                    item.width = spanWidth;
                    height += spanHeight;
                    width = Math.max(width, spanWidth);

                    if (height <= hostHeight) {
                        itemsPerPage++;
                    }
                }
            }
            else {
                var height = 0;
                var elementHeight = 0;
                var maxText = "";
                var maxTextLength = 0;
                var oldMaxTextLength = 0;
                var firstvisibleitem = -1;
                for (var currentItem = 0; currentItem < length; currentItem++) {
                    var item = this.items[currentItem];

                    if (item.isGroup && (item.label == '' && item.html == '')) {
                        continue;
                    }

                    if (!item.visible)
                        continue;
                    firstvisibleitem++;
                    var className = "";
                    if (firstvisibleitem == 0) {
                        className += this.toThemeProperty('jqx-listitem-state-normal jqx-rc-all');
                        className += " " + this.toThemeProperty('jqx-fill-state-normal');
                        className += " " + this.toThemeProperty('jqx-widget');
                        className += " " + this.toThemeProperty('jqx-listbox');
                        className += " " + this.toThemeProperty('jqx-widget-content');

                        if (this.isTouchDevice()) {
                            className += " " + this.toThemeProperty('jqx-touch');
                            className += " " + this.toThemeProperty('jqx-listitem-state-normal-touch');
                        }
                        spanElement[0].className = className;
                        if (this.autoItemsHeight) {
                            spanElement[0].style.whiteSpace = 'normal';
                            var checkWidth = this.checkboxes ? -20 : 0;
                            spanElement[0].style.width = (checkWidth + w) + 'px';
                        }

                        if (item.html == null || (item.label == "" || item.label == null)) {
                            spanElement[0].innerHTML = "Item";
                        }
                        else {
                            if (item.html != null && item.html.toString().length > 0) {
                                spanElement[0].innerHTML = item.html;
                            }
                            else if (item.label != null || item.value != null) {
                                if (item.label != null) {
                                    if (item.label.toString().match(new RegExp("\\w")) != null || item.label.toString().match(new RegExp("\\d")) != null) {
                                        spanElement[0].innerHTML = item.label;
                                    }
                                    else {
                                        spanElement[0].innerHTML = "Item";
                                    }
                                }
                                else spanElement[0].innerHTML = item.value;
                            }
                        }

                        var spanHeight = 1+spanElement.outerHeight();

                        if (this.itemHeight > -1) {
                            spanHeight = this.itemHeight;
                        }
                        elementHeight = spanHeight;
                    }

                    if (maxTextLength != undefined) {
                        oldMaxTextLength = maxTextLength;
                    }

                    if (item.html != null && item.html.toString().length > 0) {
                        maxTextLength = Math.max(maxTextLength, item.html.toString().length);
                        if (oldMaxTextLength != maxTextLength) {
                            maxText = item.html;
                        }
                    }
                    else if (item.label != null) {
                        maxTextLength = Math.max(maxTextLength, item.label.length);
                        if (oldMaxTextLength != maxTextLength) {
                            maxText = item.label;
                        }
                    }
                    else if (item.value != null) {
                        maxTextLength = Math.max(maxTextLength, item.value.length);
                        if (oldMaxTextLength != maxTextLength) {
                            maxText = item.value;
                        }
                    }

                    item.height = elementHeight;
                    height += elementHeight;

                    if (height <= hostHeight) {
                        itemsPerPage++;
                    }
                }
                spanElement[0].innerHTML = maxText;
                width = spanElement.outerWidth();
            }

            height += 2;
            if (itemsPerPage < 10) itemsPerPage = 10;

            spanElement.remove();
            return { width: width, height: height, itemsPerPage: itemsPerPage };
        },

        _getVirtualItemsCount: function () {
            if (this.virtualItemsCount == 0) {
                var virtualItemsCount = parseInt(this.host.height()) / 5;
                if (virtualItemsCount > this.items.length) {
                    virtualItemsCount = this.items.length;
                }
                return virtualItemsCount;
            }
            else return this.virtualItemsCount;
        },

        _addItems: function (refreshUIItems) {
            if (this.updatingListBox == true)
                return;

            if (this.items == undefined || this.items.length == 0) {
                this.virtualSize = { width: 0, height: 0, itemsPerPage: 0 };
                this._updatescrollbars();
                this.renderedVisibleItems = new Array();
                if (this.itemswrapper) {
                    this.itemswrapper.children().remove();
                }
                return;
            }

            if (refreshUIItems == false) {
                var virtualSize = this._calculateVirtualSize();
                var virtualItemsCount = virtualSize.itemsPerPage * 2;
                if (this.autoHeight) {
                    virtualItemsCount = this.items.length;
                }

                this.virtualItemsCount = Math.min(virtualItemsCount, this.items.length);
                var me = this;
                var virtualWidth = virtualSize.width;
                this.virtualSize = virtualSize;
                this._updatescrollbars();
                return;
            }
            var self = this;
            var top = 0;
            this.visibleItems = new Array();
            this.renderedVisibleItems = new Array();
            this._removeHandlers();
            if (this.allowDrag && this._enableDragDrop) {
                this.itemswrapper = null;
            }
            if (this.itemswrapper == null) {
                this.content[0].innerHTML = '';
                this.itemswrapper = $('<div style="outline: 0 none; overflow:hidden; width:100%; position: relative;"></div>');
                this.itemswrapper.height(2 * this.host.height());
                this.content.append(this.itemswrapper);
            }

            var virtualSize = this._calculateVirtualSize();
            var virtualItemsCount = virtualSize.itemsPerPage * 2;
            if (this.autoHeight) {
                virtualItemsCount = this.items.length;
            }

            this.virtualItemsCount = Math.min(virtualItemsCount, this.items.length);
            var me = this;
            var virtualWidth = virtualSize.width;
            this.virtualSize = virtualSize;
            this.itemswrapper.width(Math.max(this.host.width(), 17 + virtualSize.width));
            var startIndex = 0;

            var html = "";
            for (var virtualItemIndex = startIndex; virtualItemIndex < this.virtualItemsCount; virtualItemIndex++) {
                var item = this.items[virtualItemIndex];
                var id = 'listitem' + virtualItemIndex + this.element.id;
                html += "<div role='option' id='" + id + "' class='jqx-listitem-element'>";
                if (this.checkboxes) {
                    html += '<div style="background-color: transparent; padding: 0; margin: 0; position: absolute; float: left; width: 16px; height: 16px;" class="chkbox">';
                    var checkBoxContent = '<div class="' + this.toThemeProperty("jqx-checkbox-default") + ' ' + this.toThemeProperty("jqx-fill-state-normal") + ' ' + this.toThemeProperty("jqx-rc-all") + '"><div style="cursor: pointer; width: 13px; height: 13px;">';
                    var checkClass = item.checked ? " " + this.toThemeProperty("jqx-checkbox-check-checked") : "";
                    checkBoxContent += '<span style="width: 13px; height: 13px;" class="checkBoxCheck'+checkClass+'"></span>';
                    checkBoxContent += '</div></div>';
                    html += checkBoxContent;
                    html += '</div>';
                }
                html += "<span style='-ms-touch-action: none;'></span></div>"
            }

            if (self.WinJS) {
                this.itemswrapper.html(html);
            }
            else {
                this.itemswrapper[0].innerHTML = html;
            }

            var children = this.itemswrapper.children();
            for (var virtualItemIndex = startIndex; virtualItemIndex < this.virtualItemsCount; virtualItemIndex++) {
                var item = this.items[virtualItemIndex];
                var itemElement = $(children[virtualItemIndex]);

                if (this.allowDrag && this._enableDragDrop) {
                    itemElement.addClass('draggable');
                }

                if (this.checkboxes) {
                    var checkbox = $(itemElement.children()[0]);
                    itemElement.css('float', 'left');
                    var spanElement = $(itemElement[0].firstChild);
                    spanElement.css('float', 'left');
                }

                itemElement[0].style.height = item.height + 'px';
                itemElement[0].style.top = top + 'px';

                top += item.height;
                this.visualItems[virtualItemIndex] = itemElement;
            };

            this._addHandlers();

            this._updatescrollbars();

            if (this.autoItemsHeight) {
                var virtualSize = this._calculateVirtualSize();
                var virtualItemsCount = virtualSize.itemsPerPage * 2;
                if (this.autoHeight) {
                    virtualItemsCount = this.items.length;
                }

                this.virtualItemsCount = Math.min(virtualItemsCount, this.items.length);
                var me = this;
                var virtualWidth = virtualSize.width;
                this.virtualSize = virtualSize;
                this._updatescrollbars();
            }

            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                this.host.attr('hideFocus', true);
                this.host.find('div').attr('hideFocus', true);
            }
        },

        _updatescrollbars: function () {
            if (!this.virtualSize) {
                return;
            }
            var virtualHeight = this.virtualSize.height;
            var virtualWidth = this.virtualSize.width;
            var vScrollInstance = this.vScrollInstance;
            var hScrollInstance = this.hScrollInstance;
            this._arrange(false);
            var hasChange = false;
            var outerWidth = this.host.outerWidth();
            var outerHeight = this.host.outerHeight();
            if (virtualHeight > outerHeight) {
                var hScrollOffset = 0; //parseInt(this.hScrollBar.height());
                if (virtualWidth > outerWidth) {
                    hScrollOffset = this.hScrollBar.outerHeight() + 2;
                }

                var oldmax = vScrollInstance.max;
                vScrollInstance.max = 2 + parseInt(virtualHeight) + hScrollOffset - parseInt(outerHeight-2);
                if (this.vScrollBar[0].style.visibility != 'inherit') {
                    this.vScrollBar[0].style.visibility = 'inherit';
                    hasChange = true;
                }
                if (oldmax != vScrollInstance.max) {
                    vScrollInstance._arrange();
                }
            }
            else {
                if (this.vScrollBar[0].style.visibility != 'hidden') {
                    this.vScrollBar[0].style.visibility = 'hidden';
                    hasChange = true;
                    vScrollInstance.setPosition(0);
                }
            }

            var scrollOffset = 0;
            if (this.vScrollBar[0].style.visibility != 'hidden') {
                scrollOffset = this.scrollBarSize + 6;
            }

            var checkboxes = this.checkboxes ? 20 : 0;

            if (this.autoItemsHeight) {
                this.hScrollBar[0].style.visibility = 'hidden';
            }
            else {
                if (virtualWidth >= outerWidth - scrollOffset - checkboxes) {
                    var changedMax = hScrollInstance.max;
                    if (this.vScrollBar[0].style.visibility == 'inherit') {
                        hScrollInstance.max = checkboxes + scrollOffset + parseInt(virtualWidth) - this.host.width() + 4;
                    }
                    else {
                        hScrollInstance.max = checkboxes + parseInt(virtualWidth) - this.host.width() + 6;
                    }

                    if (this.hScrollBar[0].style.visibility != 'inherit') {
                        this.hScrollBar[0].style.visibility = 'inherit';
                        hasChange = true;
                    }
                    if (changedMax != hScrollInstance.max) {
                        hScrollInstance._arrange();
                    }
                    if (this.vScrollBar[0].style.visibility == 'inherit') {
                        vScrollInstance.max = 2 + parseInt(virtualHeight) + this.hScrollBar.outerHeight() + 2 - parseInt(this.host.height());
                    }
                }
                else {
                    if (this.hScrollBar[0].style.visibility != 'hidden') {
                        this.hScrollBar[0].style.visibility = 'hidden';
                        hasChange = true;
                    }
                }
            }

            hScrollInstance.setPosition(0);

            if (hasChange) {
                this._arrange();
            }

            if (this.itemswrapper) {
                this.itemswrapper[0].style.width = Math.max(0, Math.max(outerWidth - 2, 17 + virtualWidth)) + 'px';
                this.itemswrapper[0].style.height = Math.max(0, 2 * outerHeight) + 'px';
            }

            var isTouchDevice = this.isTouchDevice();
            if (isTouchDevice) {
                if (this.vScrollBar.css('visibility') != 'visible' && this.hScrollBar.css('visibility') != 'visible') {
                    $.jqx.mobile.setTouchScroll(false, this.element.id);
                }
                else {
                    $.jqx.mobile.setTouchScroll(true, this.element.id);
                }
            }
        },

        clear: function () {
            this.source = null;
            this.clearSelection();
            this.refresh();
        },

        // clears the selection.
        clearSelection: function (render) {
            for (var indx = 0; indx < this.selectedIndexes.length; indx++) {
                if (this.selectedIndexes[indx] && this.selectedIndexes[indx] != -1) {
                    this._raiseEvent('1', { index: indx, type: 'api', item: this.getVisibleItem(indx), originalEvent: null });
                }

                this.selectedIndexes[indx] = -1;
            }
            this.selectedIndex = -1;
            if (render != false) {
                this._renderItems();
            }
        },

        // unselects item by index.
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            this.selectedIndexes[index] = -1;
            var hasIndexes = false;
            for (var indx = 0; indx < this.selectedIndexes.length; indx++) {
                var index = this.selectedIndexes[indx];
                if (index != -1 && index != undefined) {
                    hasIndexes = true;
                }
            }
            if (!hasIndexes) {
                this.selectedValue = null;
                this.selectedIndex = -1;
            }

            if (render == undefined || render == true) {
                this._renderItems();
                this._raiseEvent('1', { index: index, type: 'api', item: this.getVisibleItem(index), originalEvent: null });
            }
            this._updateInputSelection();

            this._raiseEvent('2', { index: index, type:'api', item: this.getItem(index) });
        },

        // gets item's instance.
        getItem: function (index) {
            if (index == -1 || isNaN(index) || typeof (index) === "string") {
                if (index === -1) {
                    return null;
                }
                return this.getItemByValue(index);
            }

            var result = null;
            var item = $.each(this.items, function () {
                if (this.index == index) {
                    result = this;
                    return false;
                }
            });

            return result;
        },

        getVisibleItem: function (index) {
            if (index == -1 || isNaN(index) || typeof (index) === "string") {
                if (index === -1) {
                    return null;
                }
                return this.getItemByValue(index);
            }
            return this.visibleItems[index];
        },

        getVisibleItems: function () {
            return this.visibleItems;
        },

        // checks a specific item by its index.
        checkIndex: function (index, render, raiseEvent) {
            if (!this.checkboxes) {
                return;
            }

            if (isNaN(index))
                return;

            if (index < 0 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            var item = this.getItem(index);
            if (this.groups.length > 0) {
                var item = this.getVisibleItem(index);
            }
            if (item != null) {
                var checkbox = $(item.checkBoxElement);
                item.checked = true;
                if (render == undefined || render == true) {
                    this._updateCheckedItems();
                }
            }

            if (raiseEvent == undefined || raiseEvent == true) {
                this._raiseEvent(3, { label: item.label, value: item.value, checked: true, item: item });
            }
        },

        getCheckedItems: function () {
            if (!this.checkboxes) {
                return null;
            }

            var checkedItems = new Array();
            if (this.items == undefined) return;

            $.each(this.items, function () {
                if (this.checked) {
                    checkedItems[checkedItems.length] = this;
                }
            });
            return checkedItems;
        },

        checkAll: function (raiseEvents) {
            if (!this.checkboxes) {
                return;
            }

            if (this.disabled)
                return;

            var me = this;
            $.each(this.items, function () {
                var item = this;
                if (raiseEvents !== false && item.checked !== true) {
                     me._raiseEvent(3, { label: item.label, value: item.value, checked: true, item: item });
                }
                this.checked = true;
            });

            this._updateCheckedItems();
        },

        uncheckAll: function (raiseEvents) {
            if (!this.checkboxes) {
                return;
            }

            if (this.disabled)
                return;

            var me = this;
            $.each(this.items, function () {
                var item = this;
                if (raiseEvents !== false && item.checked !== false) {
                    this.checked = false;
                    me._raiseEvent(3, { label: item.label, value: item.value, checked: false, item: item });
                }
                this.checked = false;
            });

            this._updateCheckedItems();
        },

        // unchecks a specific item by its index.
        uncheckIndex: function (index, render, raiseEvent) {
            if (!this.checkboxes) {
                return;
            }

            if (isNaN(index))
                return;

            if (index < 0 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            var item = this.getItem(index);
            if (this.groups.length > 0) {
                var item = this.getVisibleItem(index);
            }
            if (item != null) {
                var checkbox = $(item.checkBoxElement);
                item.checked = false;
                if (render == undefined || render == true) {
                    this._updateCheckedItems();
                }
            }
            if (raiseEvent == undefined || raiseEvent == true) {
                this._raiseEvent(3, { label: item.label, value: item.value, checked: false, item: item });
            }
        },

        // sets a specific item's checked property to null.
        indeterminateIndex: function (index, render, raiseEvent) {
            if (!this.checkboxes) {
                return;
            }

            if (isNaN(index))
                return;

            if (index < 0 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            var item = this.getItem(index);
            if (this.groups.length > 0) {
                var item = this.getVisibleItem(index);
            }
            if (item != null) {
                var checkbox = $(item.checkBoxElement);
                item.checked = null;
                if (render == undefined || render == true) {
                    this._updateCheckedItems();
                }
            }
            if (raiseEvent == undefined || raiseEvent == true) {
                this._raiseEvent(3, { checked: null });
            }
        },

        // gets the selected index.
        getSelectedIndex: function () {
            return this.selectedIndex;
        },

        // gets all selected items.
        getSelectedItems: function () {
            var items = this.getVisibleItems();
            var selectedIndexes = this.selectedIndexes;
            var selectedItems = [];
            // get selected items.
            for (var index in selectedIndexes) {
                if (selectedIndexes[index] != -1) {
                    selectedItems[selectedItems.length] = items[index];
                }
            }

            return selectedItems;
        },

        // gets the selected item.
        getSelectedItem: function () {
            return this.getItem(this.selectedIndex);
        },

        _updateCheckedItems: function () {
            var selectedIndex = this.selectedIndex;
            this.clearSelection(false);
            var items = this.getCheckedItems();
            this.selectedIndex = selectedIndex;

            this._renderItems();
            var selectedElement = $.data(this.element, 'hoveredItem');
            if (selectedElement != null) {
                $(selectedElement).addClass(this.toThemeProperty('jqx-listitem-state-hover'));
                $(selectedElement).addClass(this.toThemeProperty('jqx-fill-state-hover'));
            }

            this._updateInputSelection();
        },

        getItemByValue: function (value) {
            if (this.visibleItems == null) {
                return;
            }

            if (this.itemsByValue)
                return this.itemsByValue[$.trim(value).split(" ").join("")];

            var items = this.visibleItems;

            for (var i = 0; i < items.length; i++) {
                if (items[i].value == value) {
                    return items[i];
                    break;
                }
            }
        },

        checkItem: function (item) {
            if (item != null) {
                var newItem = this._getItemByParam(item);
                return this.checkIndex(newItem.index, true);
            }
            return false;
        },

        uncheckItem: function (item) {
            if (item != null) {
                var newItem = this._getItemByParam(item);
                return this.uncheckIndex(newItem.index, true);
            }
            return false;
        },

        indeterminateItem: function (item) {
            if (item != null) {
                var newItem = this._getItemByParam(item);
                return this.indeterminateIndex(newItem.index, true);
            }
            return false;
        },

        val: function (value) {
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

        selectItem: function (item) {
            if (item != null) {
                if (item.index == undefined) {
                    var newItem = this.getItemByValue(item);
                    if (newItem) item = newItem;
                }
                return this.selectIndex(item.visibleIndex, true);
            }
            return false;
        },

        unselectItem: function (item) {
            if (item != null) {
                if (item.index == undefined) {
                    var newItem = this.getItemByValue(item);
                    if (newItem) item = newItem;
                }
                return this.unselectIndex(item.visibleIndex, true);
            }
            return false;
        },

        // selects an item.
        selectIndex: function (index, ensureVisible, render, forceSelect, type, originalEvent) {
            if (isNaN(index))
                return;

            if (index < -1 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            if (!this.multiple && !this.multipleextended && this.selectedIndex == index && !forceSelect) {
                if (this.visibleItems && this.items && this.visibleItems.length != this.items.length) {
                    newItem = this.getVisibleItem(index);
                    if (newItem) {
                        this.selectedValue = newItem.value;
                    }
                }
                return;
            }
            if (this.checkboxes) {
                this._updateCheckedItems();
                return;
            }

            this.focused = true;
            var newSelection = false;
            if (this.selectedIndex != index) newSelection = true;
            var oldIndex = this.selectedIndex;
            if (this.selectedIndex == index && !this.multiple) {
                oldIndex = -1;
            }

            if (type == undefined) {
                type = 'none';
            }

            var newItem = this.getItem(index);
            var oldItem = this.getItem(oldIndex);
            if (this.visibleItems && this.items && this.visibleItems.length != this.items.length) {
                newItem = this.getVisibleItem(index);
                oldItem = this.getVisibleItem(oldIndex);
            }

            if (forceSelect != undefined && forceSelect) {
                this._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                this.selectedIndex = index;
                this.selectedIndexes[oldIndex] = -1;
                this.selectedIndexes[index] = index;
                if (newItem) {
                    this.selectedValue = newItem.value;
                }
                this._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
            }
            else {
                var me = this;
                var singleSelect = function (index, oldIndex, type, oldItem, newItem, originalEvent) {
                    me._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                    me.selectedIndex = index;
                    me.selectedIndexes[oldIndex] = -1;
                    oldIndex = index;
                    me.selectedIndexes[index] = index;
                    me._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
                }
                var multipleSelect = function (index, oldIndex, type, oldItem, newItem, originalEvent) {
                    if (me.selectedIndexes[index] == undefined || me.selectedIndexes[index] == -1) {
                        me.selectedIndexes[index] = index;
                        me.selectedIndex = index;
                        me._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
                    }
                    else {
                        oldIndex = me.selectedIndexes[index];
                        oldItem = me.getVisibleItem(oldIndex);
                        me.selectedIndexes[index] = -1;
                        me.selectedIndex = -1;
                        me._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                    }
                }

                if (this.multipleextended) {
                    if (!this._shiftKey && !this._ctrlKey) {
                        if (type != 'keyboard' && type != 'mouse') {
                            multipleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                            me._clickedIndex = index;
                        }
                        else {
                            this.clearSelection(false);
                            me._clickedIndex = index;
                            singleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                        }
                    }
                    else if (this._ctrlKey) {
                        if (type == 'keyboard') {
                            this.clearSelection(false);
                            me._clickedIndex = index;
                        }
                        multipleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                    }
                    else if (this._shiftKey) {
                        if (me._clickedIndex == undefined) me._clickedIndex = oldIndex;
                        var min = Math.min(me._clickedIndex, index);
                        var max = Math.max(me._clickedIndex, index);
                        this.clearSelection(false);
                        for (var i = min; i <= max; i++) {
                            me.selectedIndexes[i] = i;
                            me._raiseEvent('0', { index: i, type: type, item: this.getVisibleItem(i), originalEvent: originalEvent });
                        }
                        if (type != 'keyboard') {
                            me.selectedIndex = me._clickedIndex;
                        }
                        else {
                            me.selectedIndex = index;
                        }
                    }
                }
                else if (this.multiple) {
                    multipleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                }
                else {
                    if (newItem) {
                        this.selectedValue = newItem.value;
                    }
                    singleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                }
            }

            if (render == undefined || render == true) {
                this._renderItems();
            }

            if (ensureVisible != undefined && ensureVisible != null && ensureVisible == true) {
                this.ensureVisible(index);
            }

            this._raiseEvent('2', { index: index, item: newItem, oldItem: oldItem, type: type });
            this._updateInputSelection();
            return newSelection;
        },

        _updateInputSelection: function () {
            if (this.input) {
                if (this.selectedIndex == -1) {
                    this.input.val("");
                }
                else {
                    if (this.items) {
                        if (this.items[this.selectedIndex] != undefined) {
                            this.input.val(this.items[this.selectedIndex].value);
                        }
                    }
                }
                if (this.multiple || this.multipleextended || this.checkboxes) {
                    var items = !this.checkboxes ? this.getSelectedItems() : this.getCheckedItems();
                    var str = "";
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            if (undefined != items[i]) {
                                if (i == items.length - 1) {
                                    str += items[i].value;
                                }
                                else {
                                    str += items[i].value + ",";
                                }
                            }
                        }
                        this.input.val(str);
                    }
                }
            }
        },

        // checks whether an item is in the visible view.
        isIndexInView: function (index) {
            if (isNaN(index)) {
                return false;
            }

            if (!this.items)
                return false;

            if (index < 0 || index >= this.items.length) {
                return false;
            }

            var scrollValue = this.vScrollInstance.value;
            var item = this.visibleItems[index];
            if (item == undefined)
                return true;

            var itemTop = item.initialTop;
            var itemHeight = item.height;

            if (itemTop - scrollValue < 0 || itemTop - scrollValue + itemHeight >= this.host.outerHeight()) {
                return false;
            }

            return true;
        },

        //[optimize]
        _itemsInPage: function () {
            var itemsCount = 0;
            var me = this;

            if (this.items) {
                $.each(this.items, function () {
                    if ((this.initialTop + this.height) >= me.content.height()) {
                        return false;
                    }
                    itemsCount++;
                });
            }
            return itemsCount;
        },

        _firstItemIndex: function () {
            if (this.visibleItems != null) {
                if (this.visibleItems[0]) {
                    if (this.visibleItems[0].isGroup) {
                        return this._nextItemIndex(0);
                    }
                    else return 0;
                }
                else return 0;
            }

            return -1;
        },

        _lastItemIndex: function () {
            if (this.visibleItems != null) {
                if (this.visibleItems[this.visibleItems.length - 1]) {
                    if (this.visibleItems[this.visibleItems.length - 1].isGroup) {
                        return this._prevItemIndex(this.visibleItems.length - 1);
                    }
                    else return this.visibleItems.length - 1;
                }
                else return this.visibleItems.length - 1;
            }

            return -1;
        },

        _nextItemIndex: function (index) {
            for (indx = index + 1; indx < this.visibleItems.length; indx++) {
                if (this.visibleItems[indx]) {
                    if (!this.visibleItems[indx].disabled && !this.visibleItems[indx].isGroup) {
                        return indx;
                    }
                }
            }

            return -1;
        },

        _prevItemIndex: function (index) {
            for (indx = index - 1; indx >= 0; indx--) {
                if (this.visibleItems[indx]) {
                    if (!this.visibleItems[indx].disabled && !this.visibleItems[indx].isGroup) {
                        return indx;
                    }
                }
            }

            return -1;
        },

        // get all matches of a searched value.
        _getMatches: function (value, startindex) {
            if (value == undefined || value.length == 0)
                return -1;

            if (startindex == undefined) startindex = 0;

            var items = this.getItems();
            var me = this;
            var index = -1;
            var newItemsIndex = 0;

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label.toString();
                    }
                    else if (this.value) {
                        itemValue = this.value.toString();
                    }
                    else if (this.title) {
                        itemValue = this.title.toString();
                    }
                    else itemValue = 'jqxItem';

                    var mathes = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            mathes = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            mathes = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            mathes = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            mathes = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            mathes = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            mathes = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            mathes = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            mathes = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (mathes && this.visibleIndex >= startindex) {
                        index = this.visibleIndex;
                        return false;
                    }
                }
            });

            return index;
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

                    var mathes = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            mathes = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            mathes = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            mathes = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            mathes = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            mathes = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            mathes = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            mathes = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            mathes = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (mathes) {
                        matchItems[index++] = this;
                    }
                }
            });

            return matchItems;
        },

        _handleKeyDown: function (event) {
            var key = event.keyCode;
            var self = this;
            var index = self.selectedIndex;
            var selectedIndex = self.selectedIndex;
            var newSelection = false;

            if (!this.keyboardNavigation || !this.enableSelection)
                return;

            var doClear = function () {
                if (self.multiple) {
                    self.clearSelection(false);
                }
            }

            if (event.altKey) key = -1;
            if (self.incrementalSearch) {
                var matchindex = -1;
                if (!self._searchString) {
                    self._searchString = "";
                }

                if ((key == 8 || key == 46) && self._searchString.length >= 1) {
                    self._searchString = self._searchString.substr(0, self._searchString.length - 1);
                }

                var letter = String.fromCharCode(key);

                var isDigit = (!isNaN(parseInt(letter)));
                var toReturn = false;
                if ((key >= 65 && key <= 97) || isDigit || key == 8 || key == 32 || key == 46) {
                    if (!event.shiftKey) {
                        letter = letter.toLocaleLowerCase();
                    }

                    var startIndex = 1 + self.selectedIndex;
                    if (key != 8 && key != 32 && key != 46) {
                        if (self._searchString.length > 0 && self._searchString.substr(0, 1) == letter) {
                            startIndex = 1 + self.selectedIndex;
                        }
                        else {
                            self._searchString += letter;
                        }
                    }

                    if (key == 32) {
                        self._searchString += " ";
                    }

                    var matches = this._getMatches(self._searchString, startIndex);
                    matchindex = matches;
                    if (matchindex == self._lastMatchIndex || matchindex == -1) {
                        var matches = this._getMatches(self._searchString, 0);
                        matchindex = matches;
                    }
                    self._lastMatchIndex = matchindex;

                    if (matchindex >= 0) {
                        var toSelect = function () {
                            doClear();
                            self.selectIndex(matchindex, false, false, false, 'keyboard', event);
                            var isInView = self.isIndexInView(matchindex);
                            if (!isInView) {
                                self.ensureVisible(matchindex);
                            }
                            else {
                                self._renderItems();
                            }
                        }
                        if (self._toSelectTimer) clearTimeout(self._toSelectTimer);
                        self._toSelectTimer = setTimeout(function () {
                            toSelect();
                        }, self.incrementalSearchKeyDownDelay);
                    }
                    toReturn = true;
                }

                if (self._searchTimer != undefined) {
                    clearTimeout(self._searchTimer);
                }

                if (key == 27 || key == 13) {
                    self._searchString = "";
                }

                self._searchTimer = setTimeout(function () {
                    self._searchString = "";
                    self._renderItems();
                }, self.incrementalSearchDelay);
                if (matchindex >= 0) {
                    return;
                }
                if (toReturn)
                    return false;
            }

            if (this.checkboxes)
                return true;

            if (key == 33) {
                var itemsInPage = self._itemsInPage();
                if (self.selectedIndex - itemsInPage >= 0) {
                    doClear();
                    self.selectIndex(selectedIndex - itemsInPage, false, false, false, 'keyboard', event);
                }
                else {
                    doClear();
                    self.selectIndex(self._firstItemIndex(), false, false, false, 'keyboard', event);
                }
                self._searchString = "";
            }

            if (key == 32 && this.checkboxes) {
                var checkItem = this.getItem(index);
                if (checkItem != null) {
                    self._updateItemCheck(checkItem, index);
                    event.preventDefault();
                }
                self._searchString = "";
            }

            if (key == 36) {
                doClear();
                self.selectIndex(self._firstItemIndex(), false, false, false, 'keyboard', event);
                self._searchString = "";
            }

            if (key == 35) {
                doClear();
                self.selectIndex(self._lastItemIndex(), false, false, false, 'keyboard', event);
                self._searchString = "";
            }

            if (key == 34) {
                var itemsInPage = self._itemsInPage();
                if (self.selectedIndex + itemsInPage < self.visibleItems.length) {
                    doClear();
                    self.selectIndex(selectedIndex + itemsInPage, false, false, false, 'keyboard', event);
                }
                else {
                    doClear();
                    self.selectIndex(self._lastItemIndex(), false, false, false, 'keyboard', event);
                }
                self._searchString = "";
            }

            if (key == 38) {
                self._searchString = "";
                if (self.selectedIndex > 0) {
                    var newIndex = self._prevItemIndex(self.selectedIndex);
                    if (newIndex != self.selectedIndex && newIndex != -1) {
                        doClear();
                        self.selectIndex(newIndex, false, false, false, 'keyboard', event);
                    }
                    else return true;
                }
                else return false;
            }
            else if (key == 40) {
                self._searchString = "";
                if (self.selectedIndex + 1 < self.visibleItems.length) {
                    var newIndex = self._nextItemIndex(self.selectedIndex);
                    if (newIndex != self.selectedIndex && newIndex != -1) {
                        doClear();
                        self.selectIndex(newIndex, false, false, false, 'keyboard', event);
                    }
                    else return true;
                }
                else return false;
            }

            if (key == 35 || key == 36 || key == 38 || key == 40 || key == 34 || key == 33) {
                var isInView = self.isIndexInView(self.selectedIndex);
                if (!isInView) {
                    self.ensureVisible(self.selectedIndex);
                }
                else {
                    self._renderItems();
                }

                return false;
            }

            return true;
        },

        _updateItemCheck: function (checkItem, index) {
            if (checkItem.checked == true) {
                checkItem.checked = (checkItem.hasThreeStates && this.hasThreeStates) ? null : false;
            }
            else {
                checkItem.checked = checkItem.checked != null;
            }

            switch (checkItem.checked) {
                case true:
                    this.checkIndex(index);
                    break;
                case false:
                    this.uncheckIndex(index);
                    break;
                default:
                    this.indeterminateIndex(index);
                    break;
            }
        },

        // performs mouse wheel.
        wheel: function (event, self) {
            if (self.autoHeight || !self.enableMouseWheel) {
                event.returnValue = true;
                return true;
            }

            if (self.disabled) return true;

            var delta = 0;
            if (!event) /* For IE. */
                event = window.event;

            if (event.originalEvent && event.originalEvent.wheelDelta) {
                event.wheelDelta = event.originalEvent.wheelDelta;
            }

            if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta / 120;
            } else if (event.detail) { /** Mozilla case. */
                delta = -event.detail / 3;
            }
            if (delta) {
                var result = self._handleDelta(delta);
                if (result) {
                    if (event.preventDefault)
                        event.preventDefault();

                    if (event.originalEvent != null) {
                        event.originalEvent.mouseHandled = true;
                    }

                    if (event.stopPropagation != undefined) {
                        event.stopPropagation();
                    }
                }

                if (result) {
                    result = false;
                    event.returnValue = result;
                    return result;
                }
                else {
                    return false;
                }
            }

            if (event.preventDefault)
                event.preventDefault();
            event.returnValue = false;
        },

        _handleDelta: function (delta) {
            var oldvalue = this.vScrollInstance.value;
            if (delta < 0) {
                this.scrollDown();
            }
            else this.scrollUp();
            var newvalue = this.vScrollInstance.value;
            if (oldvalue != newvalue) {
                return true;
            }

            return false;
        },

        focus: function () {
            try {
                this.focused = true;
                this.host.focus();
                var me = this;
                setTimeout(function () {
                    me.host.focus();
                }, 10);
            }
            catch (error) {
            }
        },

        _removeHandlers: function () {
            var self = this;
            this.removeHandler($(document), 'keydown.listbox' + this.element.id);
            this.removeHandler($(document), 'keyup.listbox' + this.element.id);
            this.removeHandler(this.vScrollBar, 'valuechanged');
            this.removeHandler(this.hScrollBar, 'valuechanged');
            if (this._mousewheelfunc) {
                this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            }
            else {
                this.removeHandler(this.host, 'mousewheel');
            }

            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.content, 'mouseleave');
            this.removeHandler(this.content, 'focus');
            this.removeHandler(this.content, 'blur');
            this.removeHandler(this.host, 'focus');
            this.removeHandler(this.host, 'blur');
            this.removeHandler(this.content, 'mouseenter');
            this.removeHandler(this.content, 'mouseup');
            this.removeHandler(this.content, 'mousedown');
            this.removeHandler(this.content, 'touchend');

            if (this._mousemovefunc) {
                this.removeHandler(this.content, 'mousemove', this._mousemovefunc);
            }
            else {
                this.removeHandler(this.content, 'mousemove');
            }
            this.removeHandler(this.content, 'selectstart');
            if (this.overlayContent) {
                this.removeHandler(this.overlayContent, $.jqx.mobile.getTouchEventName('touchend'));
            }
        },

        _updateSize: function()
        {
            if (!this.virtualSize) {
                this._oldheight = null;
                this.virtualSize = this._calculateVirtualSize();
            }

            var self = this;
            self._arrange();
            if (self.host.height() != self._oldheight || self.host.width() != self._oldwidth) {
                var changedWidth = self.host.width() != self._oldwidth;

                if (self.autoItemsHeight) {
                    self._render(false);
                }
                else {
                    if (self.items) {
                        if (self.items.length > 0 && self.virtualItemsCount * self.items[0].height < self._oldheight-2) {
                            self._render(false);
                        }
                        else {
                            var _oldScrollValue = self.vScrollInstance.value;
                            self._updatescrollbars();
                            self._renderItems();
                            if (_oldScrollValue < self.vScrollInstance.max) {
                                self.vScrollInstance.setPosition(_oldScrollValue);
                            }
                            else {
                                self.vScrollInstance.setPosition(self.vScrollInstance.max);
                            }
                        }
                    }
                }
                self._oldwidth = self.host.width();
                self._oldheight = self.host.height();
            }
        },

        _addHandlers: function () {
            var self = this;
            this.focused = false;
            var animating = false;
            var prevValue = 0;
            var object = null;
            var prevValue = 0;
            var newValue = 0;
            var lastScroll = new Date();
            var isTouchDevice = this.isTouchDevice();
 
            this.addHandler(this.vScrollBar, 'valuechanged', function (event) {
                if ($.jqx.browser.msie && $.jqx.browser.version > 9) {
                    setTimeout(function () {
                        self._renderItems();
                    }, 1);
                }
                else self._renderItems();
            });

            this.addHandler(this.hScrollBar, 'valuechanged', function () {
                self._renderItems();
            });

            if (this._mousewheelfunc) {
                this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            }

            this._mousewheelfunc = function (event) {
                self.wheel(event, self);
            };
            this.addHandler(this.host, 'mousewheel', this._mousewheelfunc);

            this.addHandler($(document), 'keydown.listbox' + this.element.id, function (event) {
                self._ctrlKey = event.ctrlKey;
                self._shiftKey = event.shiftKey;
            });
            this.addHandler($(document), 'keyup.listbox' + this.element.id, function (event) {
                self._ctrlKey = event.ctrlKey;
                self._shiftKey = event.shiftKey;
            });

            this.addHandler(this.host, 'keydown', function (event) {
                return self._handleKeyDown(event);
            });

            this.addHandler(this.content, 'mouseleave', function (event) {
                self.focused = false;
                var hoveredItem = $.data(self.element, 'hoveredItem');
                if (hoveredItem != null) {
                    $(hoveredItem).removeClass(self.toThemeProperty('jqx-listitem-state-hover'));
                    $(hoveredItem).removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                    $.data(self.element, 'hoveredItem', null);
                }
            });

            this.addHandler(this.content, 'focus', function (event) {
                if (!self.disabled) {
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                    self.focused = true;
                }
            });

            this.addHandler(this.content, 'blur', function (event) {
                self.focused = false;
                self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
            });

            this.addHandler(this.host, 'focus', function (event) {
                if (!self.disabled) {
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                    self.focused = true;
                }
            });

            this.addHandler(this.host, 'blur', function (event) {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9 && self.focused) {
                    return;
                }

                self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                self.focused = false;
            });

            this.addHandler(this.content, 'mouseenter', function (event) {
                self.focused = true;
            });
            var hasTransform = $.jqx.utilities.hasTransform(this.host);

            if (this.enableSelection) {
                var isTouch = self.isTouchDevice() && this.touchMode !== true;
                var eventName = !isTouch ? 'mousedown' : 'touchend';

                if (this.overlayContent) {
                    this.addHandler(this.overlayContent, $.jqx.mobile.getTouchEventName('touchend'), function (event) {
                        if (!self.enableSelection) {
                            return true;
                        }

                        if (isTouch) {
                            self._newScroll = new Date();
                            if (self._newScroll - self._lastScroll < 500) {
                                return true;
                            }
                        }

                        var touches = $.jqx.mobile.getTouches(event);
                        var touch = touches[0];
                        if (touch != undefined) {
                            var selfOffset = self.host.offset();
                            var left = parseInt(touch.pageX);
                            var top = parseInt(touch.pageY);
                            if (self.touchMode == true) {
                                left = parseInt(touch._pageX);
                                top = parseInt(touch._pageY);
                            }
                            left = left - selfOffset.left;
                            top = top - selfOffset.top;
                            var item = self._hitTest(left, top);
                            if (item != null && !item.isGroup) {
                                self._newScroll = new Date();
                                if (self._newScroll - self._lastScroll < 500) {
                                    return false;
                                }
                                if (self.checkboxes) {
                                    self._updateItemCheck(item, item.visibleIndex);
                                    return;
                                }


                                if (item.html.indexOf('href') != -1) {
                                    setTimeout(function () {
                                        self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                        self.content.trigger('click');
                                    }, 100);
                                }
                                else {
                                    self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                    self.content.trigger('click');
                                }
                            }
                        }
                    });
                }
                else {
                    this.addHandler(this.content, eventName, function (event) {
                        if (!self.enableSelection) {
                            return true;
                        }

                        if (isTouch) {
                            self._newScroll = new Date();
                            if (self._newScroll - self._lastScroll < 500) {
                                return false;
                            }
                        }

                        self.focused = true;
                        if (!self.isTouchDevice()) {
                            self.host.focus();
                        }
                        if (event.target.id != ('listBoxContent' + self.element.id) && self.itemswrapper[0] != event.target) {
                            var target = event.target;
                            var targetOffset = $(target).offset();
                            var selfOffset = self.host.offset();
                            if (hasTransform) {
                                var left = $.jqx.mobile.getLeftPos(target);
                                var top = $.jqx.mobile.getTopPos(target);
                                targetOffset.left = left; targetOffset.top = top;

                                left = $.jqx.mobile.getLeftPos(self.element);
                                top = $.jqx.mobile.getTopPos(self.element);
                                selfOffset.left = left; selfOffset.top = top;
                            }

                            var y = parseInt(targetOffset.top) - parseInt(selfOffset.top);
                            var x = parseInt(targetOffset.left) - parseInt(selfOffset.left);
                            var item = self._hitTest(x, y);
                            if (item != null && !item.isGroup) {
                                var doSelection = function (item, event) {
                                    if (!self._shiftKey)
                                        self._clickedIndex = item.visibleIndex;
                                    if (!self.checkboxes) {
                                        self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                    } else {
                                        self.selectedIndex = item.visibleIndex;
                                        x = 20 + event.pageX - targetOffset.left;
                                        if (self.rtl) {
                                            var hscroll = self.hScrollBar.css('visibility') != 'hidden' ? self.hScrollInstance.max : self.host.width();
                                            if (x <= self.host.width() - 20) {
                                                self._updateItemCheck(item, item.visibleIndex);
                                            }
                                        }
                                        else {
                                            if (x + self.hScrollInstance.value >= 20) {
                                                self._updateItemCheck(item, item.visibleIndex);
                                            }
                                        }
                                    }
                                }

                                if (!item.disabled) {
                                    if (item.html.indexOf('href') != -1) {
                                        setTimeout(function () {
                                            doSelection(item, event);
                                        }, 100);
                                    }
                                    else {
                                        doSelection(item, event);
                                    }
                                }
                            }
                            if (eventName == 'mousedown') {
                                var rightclick = false;
                                if (event.which) rightclick = (event.which == 3);
                                else if (event.button) rightclick = (event.button == 2);
                                if (rightclick) return true;
                                return false;
                            }
                        }

                        return true;
                    });
                }

                this.addHandler(this.content, 'mouseup', function (event) {
                    self.vScrollInstance.handlemouseup(self, event);
                });

                if ($.jqx.browser.msie) {
                    this.addHandler(this.content, 'selectstart', function (event) {
                        return false;
                    });
                }
            }
            // hover behavior.
            var isTouchDevice = this.isTouchDevice();
            if (this.enableHover && !isTouchDevice) {
                this._mousemovefunc = function (event) {
                    if (isTouchDevice)
                        return true;

                    if (!self.enableHover)
                        return true;

                    var which = $.jqx.browser.msie == true && $.jqx.browser.version < 9 ? 0 : 1;
                    if (event.target == null)
                        return true;

                    if (self.disabled)
                        return true;

                    self.focused = true;
                    var scrolling = self.vScrollInstance.isScrolling();
                    if (!scrolling && event.target.id != ('listBoxContent' + self.element.id)) {
                        if (self.itemswrapper[0] != event.target) {
                            var target = event.target;
                            var targetOffset = $(target).offset();
                            var selfOffset = self.host.offset();
                            if (hasTransform) {
                                var left = $.jqx.mobile.getLeftPos(target);
                                var top = $.jqx.mobile.getTopPos(target);
                                targetOffset.left = left; targetOffset.top = top;

                                left = $.jqx.mobile.getLeftPos(self.element);
                                top = $.jqx.mobile.getTopPos(self.element);
                                selfOffset.left = left; selfOffset.top = top;
                            }
                            var y = parseInt(targetOffset.top) - parseInt(selfOffset.top);
                            var x = parseInt(targetOffset.left) - parseInt(selfOffset.left);
                            var item = self._hitTest(x, y);
                            if (item != null && !item.isGroup && !item.disabled) {
                                var selectedElement = $.data(self.element, 'hoveredItem');
                                if (selectedElement != null) {
                                    $(selectedElement).removeClass(self.toThemeProperty('jqx-listitem-state-hover'));
                                    $(selectedElement).removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                                }

                                $.data(self.element, 'hoveredItem', item.element);
                                var $element = $(item.element);
                                $element.addClass(self.toThemeProperty('jqx-listitem-state-hover'));
                                $element.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                            }
                        }
                    }
                };

                this.addHandler(this.content, 'mousemove', this._mousemovefunc);
            }
        },

        _arrange: function (arrangeScrollbars) {
            if (arrangeScrollbars == undefined) arrangeScrollbars = true;

            var width = null;
            var height = null;
            var me = this;
            var _setHostHeight = function (height) {
                height = me.host.height();
                if (height == 0) {
                    height = 200;
                    me.host.height(height);
                }
                return height;
            }

            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                width = this.width;
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    width = this.width;
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                height = this.height;
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                height = this.height;
            };

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.css("width", this.width);
                width = this.host.width();
            }
            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.css("height", this.height);
                height = _setHostHeight(height);
            }

            if (width != null) {
                width = parseInt(width);
                if (parseInt(this.element.style.width) != parseInt(this.width)) {
                    this.host.width(this.width);
                }
            }

            if (!this.autoHeight) {
                if (height != null) {
                    height = parseInt(height);
                    if (parseInt(this.element.style.height) != parseInt(this.height)) {
                        this.host.height(this.height);
                        _setHostHeight(height);
                    }
                }
            }
            else {
                if (this.virtualSize) {
                    if (this.hScrollBar.css('visibility') != 'hidden') {
                        this.host.height(this.virtualSize.height + parseInt(this.scrollBarSize) + 3);
                        this.height = this.virtualSize.height + parseInt(this.scrollBarSize) + 3;
                        height = this.height;
                    }
                    else {
                        this.host.height(this.virtualSize.height);
                        this.height = this.virtualSize.height;
                        height = this.virtualSize.height;
                    }
                }
            }

            // scrollbar Size.
            var scrollSize = this.scrollBarSize;
            if (isNaN(scrollSize)) {
                scrollSize = parseInt(scrollSize);
                if (isNaN(scrollSize)) {
                    scrollSize = '17px';
                }
                else scrollSize = scrollSize + 'px';
            }

            scrollSize = parseInt(scrollSize);
            var scrollOffset = 4;
            var bottomSizeOffset = 2;
            var rightSizeOffset = 0;
            // right scroll offset. 
            if (this.vScrollBar) {
                if (this.vScrollBar[0].style.visibility != 'hidden') {
                    rightSizeOffset = scrollSize + scrollOffset;
                }
                else {
                    this.vScrollInstance.setPosition(0);
                }
            }
            else return;

            if (this.hScrollBar) {
                // bottom scroll offset.
                if (this.hScrollBar[0].style.visibility != 'hidden') {
                    bottomSizeOffset = scrollSize + scrollOffset;
                }
                else {
                    this.hScrollInstance.setPosition(0);
                }
            }
            else return;

            if (this.autoItemsHeight) {
                this.hScrollBar[0].style.visibility = 'hidden';
                bottomSizeOffset = 0;
            }

            if (height == null) height = 0;
            var hScrollTop = parseInt(height) - scrollOffset - scrollSize;
            if (hScrollTop < 0) hScrollTop = 0;

            if (parseInt(this.hScrollBar[0].style.height) != scrollSize) {
                if (parseInt(scrollSize) < 0) {
                    scrollSize = 0;
                }

                this.hScrollBar[0].style.height = parseInt(scrollSize) + 'px';
            }

            if (this.hScrollBar[0].style.top != hScrollTop + 'px') {
                this.hScrollBar[0].style.top = hScrollTop + 'px';
                this.hScrollBar[0].style.left = '0px';
            }

            var hscrollwidth = width - scrollSize - scrollOffset;
            if (hscrollwidth < 0) hscrollwidth = 0;
            var hScrollWidth =  hscrollwidth + 'px';

            if (this.hScrollBar[0].style.width != hScrollWidth) {
                this.hScrollBar[0].style.width = hScrollWidth;
            }

            if (rightSizeOffset == 0) {
                this.hScrollBar[0].style.width = parseInt(width - 2) + 'px';
            }

            if (scrollSize != parseInt(this.vScrollBar[0].style.width)) {
                this.vScrollBar[0].style.width = parseInt(scrollSize) + 'px';
            }
            if ((parseInt(height) - bottomSizeOffset) != parseInt(this.vScrollBar[0].style.height)) {
                this.vScrollBar[0].style.height = parseInt(height) - bottomSizeOffset + 'px';
            }

            if (width == null) width = 0;
            var vScrollLeft = parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px'; ;
            if (vScrollLeft != this.vScrollBar[0].style.left) {
                if (parseInt(vScrollLeft) >= 0) {
                    this.vScrollBar[0].style.left = vScrollLeft;
                }
                this.vScrollBar[0].style.top = '0px';
            }

            var vScrollInstance = this.vScrollInstance;
            vScrollInstance.disabled = this.disabled;
            if (arrangeScrollbars) {
                vScrollInstance._arrange();
            }

            var hScrollInstance = this.hScrollInstance;
            hScrollInstance.disabled = this.disabled;
            if (arrangeScrollbars) {
                hScrollInstance._arrange();
            }

            if ((this.vScrollBar[0].style.visibility != 'hidden') && (this.hScrollBar[0].style.visibility != 'hidden')) {
                this.bottomRight[0].style.visibility = 'inherit';
                this.bottomRight[0].style.left = 1 + parseInt(this.vScrollBar[0].style.left) + 'px';
                this.bottomRight[0].style.top = 1 + parseInt(this.hScrollBar[0].style.top) + 'px';
                if (this.rtl) {
                    this.bottomRight.css({ left: 0 });
                }
                this.bottomRight[0].style.width = parseInt(scrollSize) + 3 + 'px';
                this.bottomRight[0].style.height = parseInt(scrollSize) + 3 + 'px';
            }
            else {
                this.bottomRight[0].style.visibility = 'hidden';
            }

            if (parseInt(this.content[0].style.width) != (parseInt(width) - rightSizeOffset)) {
                var w = parseInt(width) - rightSizeOffset;
                if (w < 0) w = 0;
                this.content[0].style.width = w + 'px';
            }

            if (this.rtl) {
                this.vScrollBar.css({ left: 0 + 'px', top: '0px' });
                this.hScrollBar.css({ left: this.vScrollBar.width() + 2 + 'px' });
                if (this.vScrollBar[0].style.visibility != 'hidden') {
                    this.content.css('margin-left', 4 + this.vScrollBar.width());
                }
                else {
                    this.content.css('margin-left', 0);
                    this.hScrollBar.css({ left: '0px' });
                }
            }

            if (parseInt(this.content[0].style.height) != (parseInt(height) - bottomSizeOffset)) {
                var h = parseInt(height) - bottomSizeOffset;
                if (h < 0) h = 0;
                this.content[0].style.height = h + 'px';
            }
            if (this.overlayContent) {
                this.overlayContent.width(parseInt(width) - rightSizeOffset);
                this.overlayContent.height(parseInt(height) - bottomSizeOffset);
            }
        },

        // scrolls to a list box item.
        ensureVisible: function (index) {
            if (isNaN(index)) {
                var item = this.getItemByValue(index);
                if (item) {
                    index = item.index;
                }
            }

            var isInView = this.isIndexInView(index);
            if (!isInView) {
                if (index < 0)
                    return;
                if (this.autoHeight) {
                    var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
                    vScrollInstance.setPosition(0);
                }
                else {
                    for (indx = 0; indx < this.visibleItems.length; indx++) {
                        var item = this.visibleItems[indx];
                        if (item.visibleIndex == index && !item.isGroup) {
                            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
                            var value = vScrollInstance.value;
                            var hScrollVisible = this.hScrollBar.css('visibility') === 'hidden';
                            var hScrollOffset = hScrollVisible ? 0 : this.scrollBarSize + 4;
                            if (item.initialTop < value) {
                                vScrollInstance.setPosition(item.initialTop);
                            }
                            else if (item.initialTop + item.height > value + this.host.height()) {
                                vScrollInstance.setPosition(item.initialTop + item.height + 2 - this.host.height() + hScrollOffset);
                            }

                            break;
                        }
                    }
                }
            }

            this._renderItems();
        },

        scrollTo: function(left, top)
        {
            if (this.vScrollBar.css('visibility') != 'hidden') {
                this.vScrollInstance.setPosition(top);
            }
            if (this.hScrollBar.css('visibility') != 'hidden') {
                this.hScrollInstance.setPosition(left);
            }
        },

        // scrolls down.
        scrollDown: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value + vScrollInstance.largestep <= vScrollInstance.max) {
                vScrollInstance.setPosition(vScrollInstance.value + vScrollInstance.largestep);
                return true;
            }
            else {
                vScrollInstance.setPosition(vScrollInstance.max);
                return true;
            }

            return false;
        },

        // scrolls up.
        scrollUp: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value - vScrollInstance.largestep >= vScrollInstance.min) {
                vScrollInstance.setPosition(vScrollInstance.value - vScrollInstance.largestep);
                return true;
            }
            else {
                if (vScrollInstance.value != vScrollInstance.min) {
                    vScrollInstance.setPosition(vScrollInstance.min);
                    return true;
                }
            }
            return false;
        },

        databind: function (source) {
            this.records = new Array();
            var isdataadapter = source._source ? true : false;
            var dataadapter = new $.jqx.dataAdapter(source,
                {
                    autoBind: false
                }
            );

            if (isdataadapter) {
                dataadapter = source;
                source = source._source;
            }

            var initadapter = function (me) {
                if (source.type != undefined) {
                    dataadapter._options.type = source.type;
                }
                if (source.formatdata != undefined) {
                    dataadapter._options.formatData = source.formatdata;
                }
                if (source.contenttype != undefined) {
                    dataadapter._options.contentType = source.contenttype;
                }
                if (source.async != undefined) {
                    dataadapter._options.async = source.async;
                }
            }

            var updatefromadapter = function (me, type) {
                var getItem = function (record) {
                    if (typeof record === 'string') {
                        var label = record;
                        var value = record;
                    }
                    else {
                        var value = record[me.valueMember];
                        var label = record[me.displayMember];
                    }
                    var listBoxItem = new $.jqx._jqxListBox.item();
                    listBoxItem.label = label;
                    listBoxItem.value = value;
                    listBoxItem.html = "";
                    listBoxItem.visible = true;
                    listBoxItem.originalItem = record;
                    listBoxItem.group = '';
                    listBoxItem.groupHtml = '';
                    listBoxItem.disabled = false;
                    listBoxItem.hasThreeStates = true;
                    return listBoxItem;
                }

                if (type != undefined) {
                    var dataItem = dataadapter._changedrecords[0];
                    if (dataItem) {
                        $.each(dataadapter._changedrecords, function () {
                            var index = this.index;
                            var item = this.record;
                            if (type != 'remove') {
                                var mapItem = getItem(item);
                            }

                            switch (type) {
                                case "update":
                                    me.updateAt(mapItem, index);
                                    break;
                                case "add":
                                    me.insertAt(mapItem, index);
                                    break;
                                case "remove":
                                    me.removeAt(index);
                                    break;
                            }
                        });
                        return;
                    }
                }

                me.records = dataadapter.records;
                var recordslength = me.records.length;
                me.items = new Array();
                me.itemsByValue = new Array();
                for (var i = 0; i < recordslength; i++) {
                    var record = me.records[i];
                    var listBoxItem = getItem(record);
                    listBoxItem.index = i;
                    me.items[i] = listBoxItem;

                    var key = listBoxItem.value;
                    if (listBoxItem.value == "" || listBoxItem.value == null) key = i;
                    me.itemsByValue[$.trim(key).split(" ").join("")] = listBoxItem;
                }
                me._render();
                me._raiseEvent('6');
            }

            initadapter(this);

            var me = this;
            switch (source.datatype) {
                case "local":
                case "array":
                default:
                    if (source.localdata != null) {
                        dataadapter.unbindBindingUpdate(this.element.id);
                        dataadapter.dataBind();
                        updatefromadapter(this);
                        dataadapter.bindBindingUpdate(this.element.id, function (updatetype) {
                            updatefromadapter(me, updatetype);
                        });
                    }
                    break;
                case "json":
                case "jsonp":
                case "xml":
                case "xhtml":
                case "script":
                case "text":
                case "csv":
                case "tab":
                    {
                        if (source.localdata != null) {
                            dataadapter.unbindBindingUpdate(this.element.id);
                            dataadapter.dataBind();
                            updatefromadapter(this);
                            dataadapter.bindBindingUpdate(this.element.id, function () {
                                updatefromadapter(me);
                            });
                            return;
                        }

                        var postdata = {};
                        if (dataadapter._options.data) {
                            $.extend(dataadapter._options.data, postdata);
                        }
                        else {
                            if (source.data) {
                                $.extend(postdata, source.data);
                            }
                            dataadapter._options.data = postdata;
                        }
                        var updateFunc = function () {
                            updatefromadapter(me);
                        }

                        dataadapter.unbindDownloadComplete(me.element.id);
                        dataadapter.bindDownloadComplete(me.element.id, updateFunc);

                        dataadapter.dataBind();
                    }
            }
        },

        loadItems: function (items) {
            if (items == null) {
                this.groups = new Array();
                this.items = new Array();
                this.visualItems = new Array();
                return;
            }

            var self = this;
            var index = 0;
            var length = 0;
            var itemIndex = 0;
            this.groups = new Array();
            this.items = new Array();
            this.visualItems = new Array();
            var listItems = new Array();
            this.itemsByValue = new Array();

            $.map(items, function (item) {
                if (item == undefined)
                    return null;

                var listBoxItem = new $.jqx._jqxListBox.item();
                var group = item.group;
                var groupHtml = item.groupHtml;
                var title = item.title;

                if (title == null || title == undefined) {
                    title = '';
                }

                if (group == null || group == undefined) {
                    group = '';
                }

                if (groupHtml == null || groupHtml == undefined) {
                    groupHtml = '';
                }

                if (!self.groups[group]) {
                    self.groups[group] = { items: new Array(), index: -1, caption: group, captionHtml: groupHtml };
                    index++;

                    var groupID = index + 'jqxGroup';
                    self.groups[groupID] = self.groups[group];
                    length++;
                    self.groups.length = length;
                }

                var uniqueGroup = self.groups[group];
                uniqueGroup.index++;
                uniqueGroup.items[uniqueGroup.index] = listBoxItem;

                if (typeof item === "string") {
                    listBoxItem.label = item;
                    listBoxItem.value = item;
                }
                else if (item.label == null && item.value == null && item.html == null && item.group == null && item.groupHtml == null) {
                    listBoxItem.label = item.toString();
                    listBoxItem.value = item.toString();
                }
                else {
                    listBoxItem.label = item.label || item.value;
                    listBoxItem.value = item.value || item.label;
                }
              
                if (typeof item != "string") {
                    if (self.displayMember != "") {
                        if (item[self.displayMember] != undefined) {
                            listBoxItem.label = item[self.displayMember];
                        }
                    }

                    if (self.valueMember != "") {
                        listBoxItem.value = item[self.valueMember];
                    }
                }

                listBoxItem.hasThreeStates = item.hasThreeStates != undefined ? item.hasThreeStates : true;
                listBoxItem.originalItem = item;
                listBoxItem.title = title;
                listBoxItem.html = item.html || '';
                if (item.html && item.html != '') {
                    //     listBoxItem.label = listBoxItem.value = item.html;
                    if (title && title != '') {
                        //           listBoxItem.label = listBoxItem.value = title;
                    }
                }

                listBoxItem.group = group;
                listBoxItem.checked = item.checked || false;
                listBoxItem.groupHtml = item.groupHtml || '';
                listBoxItem.disabled = item.disabled || false;
                listBoxItem.visible = item.visible != undefined ? item.visible : true;
                listBoxItem.index = itemIndex;
                listItems[itemIndex] = listBoxItem;
                itemIndex++;
                return listBoxItem;
            });

            var itemsArray = new Array();
            var uniqueItemIndex = 0;

            if (this.fromSelect == undefined || this.fromSelect == false) {
                for (var indx = 0; indx < length; indx++) {
                    var index = indx + 1;
                    var groupID = index + 'jqxGroup';
                    var group = this.groups[groupID];
                    if (group == undefined || group == null)
                        break;

                    if (indx == 0 && group.caption == '' && group.captionHtml == '' && length <= 1) {
                        for (var i = 0; i < group.items.length; i++) {
                            var key = group.items[i].value;
                            if (group.items[i].value == "" || group.items[i].value == null) key = i;
                            this.itemsByValue[$.trim(key).split(" ").join("")] = group.items[i];
                        }
                        return group.items;
                    }
                    else {
                        var listBoxItem = new $.jqx._jqxListBox.item();
                        listBoxItem.isGroup = true;
                        listBoxItem.label = group.caption;
                        if (group.caption == '' && group.captionHtml == '') {
                            group.caption = this.emptyGroupText;
                            listBoxItem.label = group.caption;
                        }

                        listBoxItem.html = group.captionHtml;
                        itemsArray[uniqueItemIndex] = listBoxItem;
                 
                        uniqueItemIndex++;
                    }

                    for (var j = 0; j < group.items.length; j++) {
                        itemsArray[uniqueItemIndex] = group.items[j];
                        var key = group.items[j].value;
                        if (group.items[j].value == "" || group.items[j].value == null) key = uniqueItemIndex;
                        self.itemsByValue[$.trim(key).split(" ").join("")] = group.items[j];

                        uniqueItemIndex++;
                   
                    }
                }
            }
            else {
                var uniqueItemIndex = 0;
                var checkedGroups = new Array();

                $.each(listItems, function () {
                    if (!checkedGroups[this.group]) {
                        if (this.group != '') {
                            var listBoxItem = new $.jqx._jqxListBox.item();
                            listBoxItem.isGroup = true;
                            listBoxItem.label = this.group;
                            itemsArray[uniqueItemIndex] = listBoxItem;
                            uniqueItemIndex++;
                            checkedGroups[this.group] = true;
                        }
                    }

                    itemsArray[uniqueItemIndex] = this;
                    var key = this.value;
                    if (this.value == "" || this.value == null) key = uniqueItemIndex - 1;
                    self.itemsByValue[$.trim(key).split(" ").join("")] = this;

                    uniqueItemIndex++;
                });
            }

            return itemsArray;
        },

        _mapItem: function (item) {
            var listBoxItem = new $.jqx._jqxListBox.item();
            if (this.displayMember) {
                if (item.label == undefined) {
                    item.label = item[this.displayMember];
                }
                if (item.value == undefined) {
                    item.value = item[this.valueMember];
                }
            }

            if (typeof item === "string") {
                listBoxItem.label = item;
                listBoxItem.value = item;
            }
            else if (typeof item === 'number') {
                listBoxItem.label = item.toString();
                listBoxItem.value = item.toString();
            }
            else {
                listBoxItem.label = item.label || item.value;
                listBoxItem.value = item.value || item.label;
            }
            if (listBoxItem.label == undefined && listBoxItem.value == undefined && listBoxItem.html == undefined) {
                listBoxItem.label = listBoxItem.value = item;
            }

            listBoxItem.html = item.html || '';
            listBoxItem.group = item.group || '';
            listBoxItem.title = item.title || '';
            listBoxItem.groupHtml = item.groupHtml || '';
            listBoxItem.disabled = item.disabled || false;
            listBoxItem.visible = item.visible || true;
            return listBoxItem;
        },

        // adds a new item.
        addItem: function (item) {
            var newItem = this._getItemByParam(item);
            return this.insertAt(newItem, this.items ? this.items.length : 0);
        },

        _getItemByParam: function(item)
        {
            if (item != null) {
                if (item.index == undefined) {
                    var newItem = this.getItemByValue(item);
                    if (newItem) item = newItem;
                }
            }
            return item;
        },

        insertItem: function(item, index)
        {
            var newItem = this._getItemByParam(item);
            return this.insertAt(newItem, index);
        },

        updateItem: function(item, oldItem)
        {
            var oldItemIndx = this._getItemByParam(oldItem);
            if (oldItemIndx && oldItemIndx.index != undefined) {
                return this.updateAt(item, oldItemIndx.index);
            }
            return false;
        },

        updateAt: function (item, index) {
            if (item != null) {
                var listBoxItem = this._mapItem(item);
                this.itemsByValue[$.trim(listBoxItem.value).split(" ").join("")] = this.items[index];

                this.items[index].value = listBoxItem.value;
                this.items[index].label = listBoxItem.label;
                this.items[index].html = listBoxItem.html;
                this.items[index].disabled = listBoxItem.disabled;

            }
            this._cachedItemHtml = [];
            this._renderItems();
            if (this.rendered) {
                this.rendered();
            }
        },

        // inserts an item at a specific position.
        insertAt: function (item, index) {
            if (item == null)
                return false;

            this._cachedItemHtml = [];
            if (this.items == undefined || this.items.length == 0) {
                this.source = new Array();
                this.refresh();
                var listBoxItem = this._mapItem(item);
                listBoxItem.index = 0;
                this.items[this.items.length] = listBoxItem;
                this._addItems(true);
                this._renderItems();
                if (this.rendered) {
                    this.rendered();
                }
                if (this.allowDrag && this._enableDragDrop) {
                    this._enableDragDrop();
                }
                var key = listBoxItem.value;
                if (listBoxItem.value == "" || listBoxItem.value == null) key = index;
                this.itemsByValue[$.trim(key).split(" ").join("")] = listBoxItem;

                return false;
            }

            var listBoxItem = this._mapItem(item);
            if (index == -1 || index == undefined || index == null || index >= this.items.length) {
                listBoxItem.index = this.items.length;
                this.items[this.items.length] = listBoxItem;
            }
            else {
                var itemsArray = new Array();
                var currentItemIndex = 0;
                var inserted = false;
                var visualItemIndex = 0;
                for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
                    if (this.items[itemIndex].isGroup == false) {
                        if (visualItemIndex >= index && !inserted) {
                            itemsArray[currentItemIndex++] = listBoxItem;
                            listBoxItem.index = index;
                            visualItemIndex++;
                            inserted = true;
                        }
                    }

                    itemsArray[currentItemIndex] = this.items[itemIndex];
                    if (!this.items[itemIndex].isGroup) {
                        itemsArray[currentItemIndex].index = visualItemIndex;
                        visualItemIndex++;
                    }
                    currentItemIndex++;
                }

                this.items = itemsArray;
            }
            var key = listBoxItem.value;
            if (listBoxItem.value == "" || listBoxItem.value == null) key = index;
            this.itemsByValue[$.trim(key).split(" ").join("")] = listBoxItem;

            this.visibleItems = new Array();
            this.renderedVisibleItems = new Array();
            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            var value = vScrollInstance.value;
            vScrollInstance.setPosition(0);
            if ((this.allowDrag && this._enableDragDrop) || (this.virtualSize && this.virtualSize.height < 10 + this.host.height())) {
                this._addItems(true);
            }
            else {
                this._addItems(false);
            }
            this._renderItems();
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
            vScrollInstance.setPosition(value);
            if (this.rendered) {
                this.rendered();
            }
            return true;
        },

        // removes an item from a specific position.
        removeAt: function (index) {
            if (index < 0 || index > this.items.length - 1)
                return false;

            var itemHeight = this.items[index].height;
            var key = this.items[index].value;
            if (key == "" || key == null) key = index;
            this.itemsByValue[$.trim(key).split(" ").join("")] = null;

            this.items.splice(index, 1);
            var itemsArray = new Array();
            var currentItemIndex = 0;
            var inserted = false;
            var visualItemIndex = 0;
            for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
                itemsArray[currentItemIndex] = this.items[itemIndex];
                if (!this.items[itemIndex].isGroup) {
                    itemsArray[currentItemIndex].index = visualItemIndex;
                    visualItemIndex++;
                }
                currentItemIndex++;
            }

            this.items = itemsArray;

            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            var value = vScrollInstance.value;
            vScrollInstance.setPosition(0);

            this.visibleItems = new Array();
            this.renderedVisibleItems = new Array();
            if (this.items.length > 0) {
                if (this.virtualSize) {
                    this.virtualSize.height -= itemHeight;
                    var virtualItemsCount = this.virtualSize.itemsPerPage * 2;
                    if (this.autoHeight) {
                        virtualItemsCount = this.items.length;
                    }

                    this.virtualItemsCount = Math.min(virtualItemsCount, this.items.length);
                }

                this._updatescrollbars();
            }
            else {
                this._addItems();
            }
            this._renderItems();
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
            if (this.vScrollBar.css('visibility') != 'hidden') {
                vScrollInstance.setPosition(value);
            }
            else {
                vScrollInstance.setPosition(0);
            }
            if (this.rendered) {
                this.rendered();
            }

            return true;
        },

        removeItem: function (item) {
            var newItem = this._getItemByParam(item);
            this.removeAt(newItem.index);
        },

        // gets all items.
        getItems: function () {
            return this.items;
        },

        disableItem: function (item) {
            var newItem = this._getItemByParam(item);
            this.disableAt(newItem.index);
        },

        enableItem: function (item) {
            var newItem = this._getItemByParam(item);
            this.enableAt(newItem.index);
        },

        // disables an item at position.
        disableAt: function (index) {
            if (!this.items)
                return false;

            if (index < 0 || index > this.items.length - 1)
                return false;

            this.items[index].disabled = true;
            this._renderItems();
            return true;
        },

        // enables an item at position.
        enableAt: function (index) {
            if (!this.items)
                return false;

            if (index < 0 || index > this.items.length - 1)
                return false;

            this.items[index].disabled = false;
            this._renderItems();
            return true;
        },

        destroy: function () {
            if (this.source && this.source.unbindBindingUpdate) {
                this.source.unbindBindingUpdate(this.element.id);
            }

            this._removeHandlers();
            this.vScrollBar.jqxScrollBar('destroy');
            this.hScrollBar.jqxScrollBar('destroy');
            this.vScrollBar.remove();
            this.hScrollBar.remove();
            this.content.remove();
            $.jqx.utilities.resize(this.host, null, true);

            var vars = $.data(this.element, "jqxListBox");
            delete this.hScrollInstance;
            delete this.vScrollInstance;
            delete this.vScrollBar;
            delete this.hScrollBar;
            delete this.content;
            delete this.bottomRight;
            delete this.itemswrapper;
            delete this.visualItems;
            delete this.visibleItems;
            delete this.items;
            delete this.groups;
            delete this.renderedVisibleItems;
            delete this._mousewheelfunc;
            delete this._mousemovefunc;
            delete this._cachedItemHtml;
            delete this.itemsByValue;
            delete this._activeElement;
            delete this.source;
            delete this.events;
      
            if (this.input) {
                this.input.remove();
                delete this.input;
            }
            if (vars) {
                delete vars.instance;
            }
            this.host.removeData();
            this.host.removeClass();
            this.host.remove();
            this.element = null;
            delete this.element;
            this.host = null;
            delete this.set;
            delete this.get;
            delete this.call;
            delete this.host;
        },

        _raiseEvent: function (id, arg) {
            if (this._stopEvents == true)
                return true;

            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;
            this._updateInputSelection();
            var event = new jQuery.Event(evt);
            event.owner = this;
            event.args = args;
            if (this.host != null) {
                var result = this.host.trigger(event);
            }
            return result;
        }
    })
})(jQuery);

(function ($) {
    $.jqx._jqxListBox.item = function () {
        var result =
        {
            group: '',
            groupHtml: '',
            selected: false,
            isGroup: false,
            highlighted: false,
            value: null,
            label: '',
            html: null,
            visible: true,
            disabled: false,
            element: null,
            width: null,
            height: null,
            initialTop: null,
            top: null,
            left: null,
            title: '',
            index: -1,
            checkBoxElement: null,
            originalItem: null,
            checked: false,
            visibleIndex: -1
        }
        return result;
    }
})(jQuery);