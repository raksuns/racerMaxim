/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxSelect", "", {});

    $.extend($.jqx._jqxSelect.prototype, {
        defineInstance: function () {
            this.disabled = false;
            this.renderer = this.renderer || this._renderer;
            this.opened = false;
            this.$popup = $('<div style="overflow: hidden;"><ul style="padding: 0px;"></ul></div>');
            this.item = '<li><span></span></li>';
            this.width = null;
            this.height = null;
            this.dropDownHeight = null;
            this.dropDownWidth = null;
            this.value = "";
            this.rtl = false;
            this.events = ['change', 'open', 'close'];
            this.popupZIndex = 20000;
            this._className = "";
            this.placeHolder = "Please Choose...";
            this.arrowSize = 19;
            this.selected = null;
            this.scrollBarSize = 15;
        },

        createInstance: function (args) {
            this.field = this.element;
            this.render();
        },

        render: function()
        {
            if (this.field.className) {
                this._className = this.field.className;
            }

            var properties = {
                'title': this.field.title
            };

            if (this.field.id.length) {
                properties.id = this.field.id.replace(/[^\w]/g, '_') + "_jqxSelect";
            }
            else {
                properties.id = $.jqx.utilities.createId() + "_jqxSelect";
            }

            this.wrapper = $("<div></div>", properties);

            var size = parseInt(this.host.attr('size'));
            this.listBox = parseInt(size) > 1;

            var comboStructure = $("<div style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
               "<div id='dropdownlistWrapper' style='outline: none; background-color: transparent; border: none; float: left; width:100%; height: 100%; position: relative;'>" +
               "<div id='dropdownlistContent' style='outline: none; background-color: transparent; border: none; float: left; position: relative;'/>" +
               "<div id='dropdownlistArrow' style='background-color: transparent; border: none; float: right; position: relative;'><div></div></div>" +
               "</div>" +
               "</div>");
            if (!this.listBox) {
                this.wrapper.append(comboStructure);
            }
        
            if (!this.width) {
                this.width = $(this.field).width();
            }
            if (!this.height) {
                this.height = $(this.field).outerHeight();
            }
            $(this.field).hide().after(this.wrapper);
            this.host = this.wrapper;
            this.element = this.wrapper[0];

            if (this.field.tabIndex) {
                var tabIndex = this.field.tabIndex;
                this.field.tabIndex = -1;
                this.element.tabIndex = tabIndex;
            }
            else {
                this.host.attr('tabIndex', 0);
            }

            if (this.rtl) {
                this.host.addClass(this.toThemeProperty('jqx-rtl'));
            }

            this.host.attr('role', 'select');
            $.jqx.aria(this, "aria-disabled", this.disabled);
            $.jqx.aria(this, "aria-readonly", false);
            if (this.source && this.source.length) {
                $.jqx.aria(this, "aria-haspopup", true);
            }
            if (this.value != "") {
                this.element.value = this.value;
            }

            if (!this.listBox) {
                this.dropdownlistWrapper = this.host.find('#dropdownlistWrapper');
                this.dropdownlistArrow = this.host.find('#dropdownlistArrow');
                this.arrow = $(this.dropdownlistArrow.children()[0]);
                this.dropdownlistContent = this.host.find('#dropdownlistContent');

                this.dropdownlistWrapper[0].id = "dropdownlistWrapper" + this.element.id;
                this.dropdownlistArrow[0].id = "dropdownlistArrow" + this.element.id;
                this.dropdownlistContent[0].id = "dropdownlistContent" + this.element.id;
                this._firstDiv = this.host.find('div:first');
            }

            this.addHandlers();
        },

        // performs mouse wheel.
        wheel: function (event, self) {
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
            var oldvalue = this.scrollbar.jqxScrollBar('value');
            if (delta < 0) {
                this.scrollDown();
            }
            else this.scrollUp();
            var newvalue = this.scrollbar.jqxScrollBar('value');
            if (oldvalue != newvalue) {
                return true;
            }

            return false;
        },

        scrollDown: function () {
            if (this.scrollbar.css('visibility') == 'hidden')
                return false;
            var vScrollInstance = $.data(this.scrollbar[0], 'jqxScrollBar').instance;

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
            if (this.scrollbar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = $.data(this.scrollbar[0], 'jqxScrollBar').instance;
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

        _renderSelection: function(item)
        {
            this.$popup.find('.jqx-fill-state-pressed').removeClass(this.toThemeProperty('jqx-fill-state-pressed')).removeClass(this.toThemeProperty('jqx-listitem-state-selected'));
            for (var i = 0; i < this.items.length; i++) {
                var currentItem = this.items[i];
                currentItem.selected = false;
                currentItem.originalItem.selected = false;
                if (item === null) {
                    var uiItem = $(currentItem.element);
                    uiItem.removeClass(this.toThemeProperty('jqx-fill-state-hover'));
                    uiItem.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                    uiItem.removeClass(this.toThemeProperty('jqx-listitem-state-selected'));
                    uiItem.removeClass(this.toThemeProperty('jqx-listitem-state-hover'));
                }
                else
                    {
                    if (currentItem.originalItem === item.originalItem) {
                        if (currentItem.label === item.label) {
                            if (currentItem.value === item.value) {
                                if (currentItem.disabled) {
                                    return;
                                }

                                currentItem.selected = true;
                                currentItem.originalItem.selected = true;
                                this.selected = currentItem.originalItem;
                                var uiItem = $(currentItem.element);
                                uiItem.removeClass(this.toThemeProperty('jqx-fill-state-hover'));
                                uiItem.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                                uiItem.removeClass(this.toThemeProperty('jqx-listitem-state-hover'));
                                uiItem.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                                uiItem.addClass(this.toThemeProperty('jqx-listitem-state-selected'));
                                break;
                            }
                        }
                    }
                }
            }

            if (this.listBox) {
                 return;
            }

            var spanElement = $('<span style="max-width: 100%; color: inherit; border: none; background-color: transparent;"></span>');
            spanElement.appendTo($(document.body));
            spanElement.addClass(this.toThemeProperty('jqx-widget'));
            spanElement.addClass(this.toThemeProperty('jqx-listitem-state-normal'));
            spanElement.addClass(this.toThemeProperty('jqx-item'));
            $.jqx.utilities.html(spanElement, this.placeHolder);

            var emptyItem = false;
            try {
                if (item.html != undefined && item.html != null && item.html.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.html);
                }
                else if (item.label != undefined && item.label != null && item.label.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.label);
                }
                else if (item.value != undefined && item.value != null && item.value.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.value);

                }
                else if (item.title != undefined && item.title != null && item.title.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.title);
                }
                else if (item.label == "" || item.label == null) {
                    emptyItem = true;
                    $.jqx.utilities.html(spanElement, "Item");
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
            if ((item.label == "" || item.label == null) && emptyItem) {
                $.jqx.utilities.html(spanElement, "");
            }

            spanElement.remove();
            spanElement.removeClass();
     
            var height = this.host.height();
            if (this.height != null && this.height != undefined) {
                height = parseInt(this.height);
            }

            var top = parseInt((parseInt(height) - parseInt(spanHeight)) / 2);

            if (top > 0) {
                this.dropdownlistContent.css('margin-top', top + 'px');
                this.dropdownlistContent.css('margin-bottom', top + 'px');
            }
            this.dropdownlistContent.html(spanElement);
        },

        _updateSource: function()
        {
            var items = new Array();
            var options = $(this.field).find('option');
            var groups = $(this.field).find('optgroup');
            var ul = false;
            if (options.length === 0) {
                options = $(this.field).find('li');
                if (options.length > 0) {
                    ul = true;
                }
            }

            var selectedOption = null;
            var index = 0;
            var selectedOption = -1;
            var that = this;
            var groupsArray = new Array();

            $.each(options, function (index) {
                var hasGroup = groups.find(this).length > 0;
                var group = null;

                if (this.text != null && (this.label == null || this.label == '')) {
                    this.label = this.text;
                }
                if (ul === true) {
                    this.label = $(this).text();
                    this.selected = $(this).attr('data-selected');
                    this.value = $(this).attr('data-value') || index;
                    this.disabled = $(this).attr('disabled');
                }

                var item = {style: this.style.cssText, selected: this.selected, html: this.innerHTML, classes: this.className, disabled: this.disabled, value: this.value, label: this.label, title: this.title, originalItem: this };

                var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
                if (ie7 && !ul) {
                    if (item.value == '' && this.text != null && this.text.length > 0) {
                        item.value = this.text;
                    }
                }

                if (hasGroup) {
                    group = groups.find(this).parent()[0].label;
                    item.group = group;
                    if (!groupsArray[group]) {
                        groupsArray[group] = new Array();
                        groupsArray.length++;
                    }
                    groupsArray[group].push(item);
                }

                if (this.selected) {
                    selectedOption = index;
                }
                if (item.label !== undefined) {
                    items.push(item);
                }
            });
            if (groupsArray.length > 0) {
                var groupItems = new Array();
                for (var obj in groupsArray) {
                    if (obj === "indexOf") continue;

                    var originalItem = null;
                    for (var i = 0; i < groups.length; i++) {
                        if (obj === groups[i].label || groups[i].text) {
                            originalItem = groups[i];
                            break;
                        }
                    }

                    groupItems.push({originalItem: originalItem, value: obj, isGroup: true, label: obj });
                    $.each(groupsArray[obj], function (index, value) {
                        if (this.label !== undefined) {
                            groupItems.push(this);
                        }
                    });
                };
            }

            if (groupItems && groupItems.length > 0) {
                this.load(groupItems);
            }
            else {
                this.load(items);
            }

            if (selectedOption != null && selectedOption >= 0) {
                this.items = items;
                this._renderSelection(items[selectedOption]);
                this.ensureVisible();
            }
            return items;
        },

        _refreshClasses: function (add) {
            var func = add ? 'addClass' : 'removeClass';
            $(this.field)[func](this.toThemeProperty('jqx-widget'));
            this.host[func](this.toThemeProperty('jqx-widget'));
            this.host[func](this.toThemeProperty('jqx-select'));

            var hostClassName = this.toThemeProperty('jqx-select-content') + " " + this.toThemeProperty('jqx-widget') + " " + this.toThemeProperty('jqx-dropdownlist-state-normal') + " " + this.toThemeProperty('jqx-rc-all') + " " + this.toThemeProperty('jqx-fill-state-normal');
            if (this.listBox)
            {
                var hostClassName = this.toThemeProperty('jqx-widget') + " " + this.toThemeProperty('jqx-select-container') + " " + this.toThemeProperty('jqx-widget-content') + " " + this.toThemeProperty('jqx-listbox') + " " + this.toThemeProperty('jqx-widget-content') + " " + this.toThemeProperty('jqx-rc-all');
            }
           
            this.host[func](hostClassName);
            if (!this.listBox) {
                this.dropdownlistContent[func](this.toThemeProperty('jqx-dropdownlist-content'));
                this.dropdownlistWrapper[func](this.toThemeProperty('jqx-disableselect'));
                if (this.rtl) {
                    this.dropdownlistContent[func](this.toThemeProperty('jqx-rtl'));
                    this.dropdownlistContent[func](this.toThemeProperty('jqx-dropdownlist-content-rtl'));
                }
            }

            if (!this.listBox) {
                this.$popup[func](this.toThemeProperty('jqx-popup'));
            }
            if ($.jqx.browser.msie) {
                this.$popup[func](this.toThemeProperty('jqx-noshadow'));
            }
            if (!this.listBox) {
                this.arrow[func](this.toThemeProperty('jqx-icon-arrow-down'));
                this.arrow[func](this.toThemeProperty('jqx-icon'));
            }

            this.$popup[func](this.toThemeProperty('jqx-reset'));
            this.$popup[func](this.toThemeProperty('jqx-menu'));
            this.$popup[func](this.toThemeProperty('jqx-menu-dropdown'));
            this.$popup[func](this.toThemeProperty('jqx-widget'));
            this.$popup[func](this.toThemeProperty('jqx-widget-content'));
            this.$popup[func](this.toThemeProperty('jqx-select-container'));
            if (this.roundedCorners) {
                this.host[func](this.toThemeProperty('jqx-rc-all'));
                this.$popup[func](this.toThemeProperty('jqx-rc-all'));
            }
            if (this.disabled) {
                this.host[func](this.toThemeProperty('jqx-fill-state-disabled'));
            }
            else {
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
        },

   
        focus: function () {
            try {
                this.host.focus();
            }
            catch (error) {
            }
        },

        refresh: function () {
            this._refreshClasses(false);
            this._refreshClasses(true);

            if (this.width) {
                this.host.width(this.width);
            }
            if (this.height) {
                this.host.height(this.height);
            }
            var width = parseInt(this.host.width());
            var height = parseInt(this.host.height());
            var arrowHeight = this.arrowSize;
            var arrowWidth = this.arrowSize;
            var rightOffset = 3;
            var contentWidth = width - arrowWidth - 2 * rightOffset;
            if (!this.listBox) {
                if (contentWidth > 0) {
                    this.dropdownlistContent.width(contentWidth + 'px');
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
            }
            this.host.attr('disabled', this.disabled);
            if (this.maxLength) {
                this.host.attr("maxlength", this.maxLength);
            };
            this.items = this._updateSource();
       },

        destroy: function () {
            this.removeHandlers();
            this.host.remove();
            if (this.$popup) {
                this.$popup.remove();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (key == "opened") {
                if (value) object.open();
                else object.close();
                return;
            }

            if (key == "disabled") {
                $.jqx.aria(object, "aria-disabled", object.disabled);
            }

            object.refresh();
        },

        getItem: function(value)
        {
            for (var i = 0; i < this.items.length; i++) {
                if (value.nodeName) {
                    if (this.items[i].originalItem === value) {
                        return this.items[i];
                    }
                }
                else {
                    if (this.items[i].value === value) {
                        return this.items[i];
                    }
                }
            }
            return null;
        },

        select: function (event, ui) {
            var target = event.target;
            if (event.target.nodeName.toLowerCase() == 'span') {
                target = $(event.target).parent()[0];
            }

            var item = null;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].element === target) {
                    item = this.items[i];
                    break;
                }
            }
            if (item !== null) {
                this._select(item);
            }
            return this.close();
        },

        _select: function(item)
        {
            if (item === null && this.selected) {
                this._renderSelection(null);
                this._raiseEvent('0', null);
                return;
            }

            var selected = this.selected;
            if (item != null && !item.disabled) {
                this._renderSelection(item);
            }
            if (selected != this.selected) {
                if (selected != null && this.selected != null) {
                    if (selected.value !== this.selected.value) {
                        this._raiseEvent('0', item);
                    }
                }
                else {
                    if (selected === null) {
                        this._raiseEvent('0', item);
                    }
                }
            }
        },

        val: function (value) {
            if (arguments.length == 0 || (value != null && typeof (value) == "object")) {
                return this.field.value;
            }

            var item = this.getItem(value);
            if (item) {
                this._select(item);
                this.ensureVisible(item);
            }
            if (item) {
                return item.value;
            }
            return "";
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            arg.owner = this;

            var event = new jQuery.Event(evt);
            event.owner = this;
            event.args = arg;
            if (event.preventDefault)
                event.preventDefault();

            var result = this.host.trigger(event);
            return result;
        },

        _renderer: function (item) {
            return item;
        },

        open: function () {
            var that = this;
            var position = $.extend({}, this.host.coord(true), {
                height: this.host[0].offsetHeight
            });

            if (this.$popup.parent().length == 0) {
                var popupId = this.element.id + "_" + "popup";
                this.$popup[0].id = popupId;
                $.jqx.aria(this, "aria-owns", popupId);
            }
            
            if (!this.listBox) {
                this.$popup
                .appendTo($(document.body))
                .css({
                    position: 'absolute',
                    zIndex: this.popupZIndex,
                    top: position.top + position.height
                , left: position.left
                })
                .show();
                this.host.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                this.$popup.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
            }
            else {
                this.$popup
                .appendTo(this.host)
                .show();
            }

            if (!this.listBox) {
                var height = 0;
                var UL = this.$popup.find('ul:first');
                var children = UL.children();
                if (this.dropDownWidth !== null && this.dropDownWidth !== 'auto') {
                    this.$popup.width(this.dropDownWidth);
                }
                height = $(this.$popup.children()[0]).outerHeight();
                this.$popup.height(height+2);

                if (this.dropDownHeight !== null && this.dropDownHeight !== 'auto') {
                    this.$popup.height(this.dropDownHeight+2);
                }
                this.opened = true;
                this._raiseEvent('1', { popup: this.$popup });
                $.jqx.aria(this, "aria-expanded", true);

                this.host.focus();
            }
            else {
                this.$popup.css('border', 'none');
                this.$popup.height(this.host.height());
            }

            var UL = this.$popup.find('ul:first');
            UL.css('margin-top', '0px');
            var childrenHeight = 0;
            childrenHeight = $(this.$popup.children()[0]).outerHeight();
            if (this.listBox || (this.dropDownHeight !== null && this.dropDownHeight !== 'auto')) {
                childrenHeight = 0;
                $.each(UL.children(), function () {
                    childrenHeight += $(this).outerHeight(true) - 1;
                });
            }

            var hostHeight = this.host.height();
            if (!this.listBox) {
                hostHeight = this.$popup.height() + 1;
            }

            if (childrenHeight > hostHeight) {
                if (!this.scrollbar) {
                    this.scrollbar = $("<div style='overflow: visible;'></div>");
                    this.$popup.append(this.scrollbar);
                    this.scrollbar.height(this.$popup.height());
                    this.scrollbar.css('margin-top', -childrenHeight);
                    this.scrollbar.css('margin-left', this.$popup.width() - this.scrollBarSize - 3);
                    UL.width(this.$popup.width() - this.scrollBarSize - 3);
                    childrenHeight = $(this.$popup.children()[0]).outerHeight();

                    this.scrollbar.width(this.scrollBarSize);

                    this.scrollbar.jqxScrollBar({ disabled: this.disabled, max: childrenHeight - hostHeight + 4, height: -2 + hostHeight, vertical: true, theme: this.theme });

                    this.addHandler(this.scrollbar, 'valuechanged', function (event) {
                        var value = event.currentValue;
                        UL.css('margin-top', -value + 'px');
                        that.scrollbar.css('margin-top', -childrenHeight + value);
                    });
                }
                else {
                    childrenHeight = $(this.$popup.children()[0]).outerHeight();
                    this.scrollbar.jqxScrollBar({ max: childrenHeight - hostHeight + 4, height: -2 + hostHeight, theme: this.theme });
                }

                this.scrollbar.css('margin-left', this.$popup.width() - this.scrollBarSize - 3);
                var calcChildrenHeight = function () {
                    var childrenHeight = 0;
                    childrenHeight = $(that.$popup.children()[0]).outerHeight();
                    return childrenHeight;
                }

                childrenHeight = calcChildrenHeight();
                that.scrollbar.css('margin-top', -childrenHeight);
                var value = that.scrollbar.jqxScrollBar('value');
                UL.css('margin-top', -value + 'px');
                that.scrollbar.css('margin-top', -childrenHeight  + value);
                if (this.selected && this.selected.value) {
                    if (value === 0) {
                        this.ensureVisible(this.getItem(this.selected.value));
                    }
                }
            }     
            return this;
        },

        _close: function(event)
        {
            if (!this.opened) {
                return true;
            }

            if (this.listBox) {
                return true;
            }

            var that = this;
            var $target = $(event.target);
       
            if ($(event.target).ischildof(that.host)) {
                return true;
            }

            if (event.target.className.indexOf('jqx-popup') != -1) {
                return true;
            }

            var isSelect = false;
            $.each($target.parents(), function () {
                if (this.className != 'undefined') {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-select') != -1) {
                            isSelect = true;
                            return false;
                        }
                        if (this.className.indexOf('jqx-popup') != -1) {
                            if (that.element.id == this.id) {
                                isSelect = true;
                            }
                            return false;
                        }
                    }
                }
            });

            if (!isSelect) {
                that.close();
            }

            return true;
        },

        close: function () {
            if (!this.opened) {
                return false;
            }

            this.$popup.hide();
            this.host.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            this.$popup.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.opened = false;
            this._raiseEvent('2', { popup: this.$popup });
            $.jqx.aria(this, "aria-expanded", false);
            return this;
        },

        suggest: function (event) {
            var items;
            this.query = this.host.val();

            if (!this.query || this.query.length < this.minLength) {
                return this.opened ? this.close() : this
            }

            items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.load, this)) : this.source;

            return items ? this.load(items) : this;
        },

        load: function (items) {
            var that = this;

            if (!items.length) {
                return this.opened ? this.close() : this
            }

            return this._render(items);
        },

        _render: function (items) {
            var that = this

            items = $(items).map(function (i, item) {
                var itemValue = item;
                if (item.value != undefined) {
                    if (item.label != undefined) {
                        i = $(that.item).attr({ 'data-name': item.label, 'data-value': item.value });
                    }
                    else {
                        i = $(that.item).attr({ 'data-name': item.value, 'data-value': item.value });
                    }
                }
                else if (item.label != undefined) {
                    i = $(that.item).attr({ 'data-value': item.label, 'data-name': item.label });
                }
                else {
                    i = $(that.item).attr({ 'data-value': item, 'data-name': item });
                }
                if (item.label) {
                    itemValue = item.label;
                }

                i.find('span').html(itemValue);
                var rtlClass = "";
                if (that.rtl) {
                    rtlClass = " " + that.toThemeProperty('jqx-rtl');
                }
                i[0].className = that.toThemeProperty('jqx-item') + " " + that.toThemeProperty('jqx-menu-item') + " " + that.toThemeProperty('jqx-select-item') + " " + that.toThemeProperty('jqx-rc-all') + rtlClass;
                if (item.disabled) {
                    i.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                }
                if (item.isGroup) {
                    i.addClass(that.toThemeProperty('jqx-listitem-state-group'));
                }

                item.element = i[0];
                return i[0];
            })

            this.$popup.find('ul:first').html(items);
            this.$popup.width(this.host.width());
            if (this.listBox) {
                this.open();
            }
            else {
                this.$popup.width(3+this.host.width());
            }

            return this;
        },

        next: function (event) {
            var active = this.$popup.find('.jqx-fill-state-pressed');
            var next = active.next();
            if (next.hasClass('jqx-listitem-state-group')) {
                next = next.next();
            }
            while (next != null && next.hasClass('jqx-fill-state-disabled')) {
                next = next.next();
            }
            if (next.hasClass('jqx-listitem-state-group')) {
                next = next.next();
            }

            if (next.length) {
                active.removeClass(this.toThemeProperty('jqx-fill-state-pressed'))
                active.removeClass(this.toThemeProperty('jqx-listitem-state-selected'))
            }
            else {
                return;
            }

            next.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            next.addClass(this.toThemeProperty('jqx-listitem-state-selected'))
            this.ensureVisible(next);
        },

        ensureVisible: function(item)
        {
            if (item != null && item.label != undefined) {
                item = $(item.element);
            }

            if (item == null) {
                if (this.selected !== null) {
                    item = $(this.getItem(this.selected).element);
                    if (item.length === 0) {
                        return false;
                    }
                }
            }
            if (!this.scrollbar) {
                return false;
            }

            var value = this.scrollbar.jqxScrollBar('value');
            var view_top = value;
            var view_bottom = this.$popup.outerHeight() + view_top;

            var top = item.coord().top - this.$popup.coord().top + value;
            top = Math.round(top);
            var bottom = top + item.outerHeight();
            bottom = Math.round(bottom);
            if (Math.round(item.position().top) === 0) {
                return this.scrollbar.jqxScrollBar('setPosition', 0);
            }
            else {
                var lastItem = this.$popup.find('UL:first').children().last();
                if (lastItem[0] === item[0]) {
                    return this.scrollbar.jqxScrollBar('setPosition', this.scrollbar.jqxScrollBar('max'));
                }
            }

            if (top < view_top) {
                var topOffset = top - (item.outerHeight(true) - item.height());
                if (topOffset < 0) topOffset = 0;
                return this.scrollbar.jqxScrollBar('setPosition', topOffset);
            }

            if (bottom > view_bottom) {
                return this.scrollbar.jqxScrollBar('setPosition', 4 + bottom - this.$popup.outerHeight());
            }

        },

        prev: function (event) {
            var active = this.$popup.find('.jqx-fill-state-pressed');
            var prev = active.prev()
            if (prev.hasClass('jqx-listitem-state-group')) {
                prev = prev.prev();
            }
            while (prev != null && prev.hasClass('jqx-fill-state-disabled')) {
                prev = prev.prev();
            }
            if (prev.hasClass('jqx-listitem-state-group')) {
                prev = prev.prev();
            }
            if (prev.length) {
                active.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
                active.removeClass(this.toThemeProperty('jqx-listitem-state-selected'))
            }
            else {
                return;
            }

            prev.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            prev.addClass(this.toThemeProperty('jqx-listitem-state-selected'))
            this.ensureVisible(prev);
        },

        addHandlers: function () {
            var that = this;
            if (this.touch) {
                this.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id, $.proxy(this._close));
            }
            else this.addHandler($(document), 'mousedown.' + this.id, $.proxy(this._close, this));

            this.addHandler(this.$popup, 'mousewheel', function (event) {
                that.wheel(event, that);
            });
            this.addHandler(this.host, 'focus', $.proxy(this._focus, this));
            this.addHandler(this.host, 'blur', $.proxy(this._blur, this));

            var keyHandler = this.host;
            this.addHandler(keyHandler, 'keypress.select' + this.element.id, $.proxy(this.keypress, this));
            this.addHandler(keyHandler, 'keyup.select' + this.element.id, $.proxy(this.keyup, this));
            this.addHandler(keyHandler, 'keydown.select' + this.element.id, $.proxy(this.keydown, this));

            this.addHandler(this.$popup, 'mousedown', $.proxy(this.click, this));
            if (this.host.on) {
                this.$popup.on('mouseenter', 'li', $.proxy(this.mouseenter, this));
                this.$popup.on('mouseleave', 'li', $.proxy(this.mouseleave, this));
            }
            else {
                this.$popup.bind('mouseenter', 'li', $.proxy(this.mouseenter, this));
                this.$popup.bind('mouseleave', 'li', $.proxy(this.mouseleave, this));
            }

                if (this.host.parents()) {
                    this.addHandler(this.host.parents(), 'scroll.dropdownlist' + this.element.id, function (event) {
                        var opened = that.opened;
                        if (opened) {
                            that.close();
                        }
                    });
                }
                this.addHandler(this.host, 'mouseenter', function()
                {
                    if (!that.disabled) {
                        if (!that.listBox) {
                            that.arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                            that.host.addClass(that.toThemeProperty('jqx-fill-state-hover'));
                        }
                    }
                });

                this.addHandler(this.host, 'mouseleave', function()
                {
                    if (!that.disabled) {
                        if (!that.listBox) {
                            that.arrow.removeClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                            that.host.removeClass(that.toThemeProperty('jqx-fill-state-hover'));
                        }
                        else {
                            that.mouseleave();
                        }
                    }
                });


                var eventName = 'mousedown';
                if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
                if (!this.listBox) {
                    this.addHandler(this.dropdownlistWrapper, eventName,
                function (event) {
                    if (!that.disabled) {
                        if (!that.opened) {
                            that.open();
                        }
                        else {
                            that.close();
                        }
                        that.host.focus();
                        return false;
                    }
                });
                }
                      
                if (!this.listBox) {
                    this.addHandler(this._firstDiv, 'focus', function (event) {
                        that.host.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                    });
                    this.addHandler(this._firstDiv, 'blur', function () {
                        that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                    });
                }
        },

        removeHandlers: function () {
            this.removeHandler(this.host, 'blur', $.proxy(this._blur, this));
            this.removeHandler(this.host, 'focus', $.proxy(this._focus, this));
            this.removeHandler(this.host, 'keypress', $.proxy(this.keypress, this));
            this.removeHandler(this.host, 'keyup', $.proxy(this.keyup, this));
            this.removeHandler(this.host, 'keydown', $.proxy(this.keydown, this));
            this.removeHandler(this.$popup, 'mousedown', $.proxy(this.click, this));
            this.removeHandler(this.$popup, 'mousewheel');
            if (this.host.off) {
                this.$popup.off('mouseenter', 'li', $.proxy(this.mouseenter, this));
                this.$popup.off('mouseleave', 'li', $.proxy(this.mouseleave, this));
            }
            else {
                this.$popup.unbind('mouseenter', 'li', $.proxy(this.mouseenter, this));
                this.$popup.unbind('mouseleave', 'li', $.proxy(this.mouseleave, this));
            }
        },

        move: function (e) {
            if (this.disabled) {
                return true;
            }

            var select = function () {
                if (!this.opened && !this.listBox) {
                    var item = this.$popup.find('.jqx-fill-state-pressed');
                    var label = item.attr('data-name');
                    var value = item.attr('data-value');
                    var item = this.getItem(value);
                    this._renderSelection(item);
                }
            }

            switch (e.keyCode) {
               case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;

                case 38: // up arrow
                    e.preventDefault();
                    this.prev();
                    select.call(this);
                    return false;

                case 40: // down arrow
                    e.preventDefault();
                    this.next();
                    select.call(this);
                    return false;
            }

            e.stopPropagation();
        },

        keydown: function (e) {
            if (e.keyCode === 115) {
                if (!this.opened) {
                    this.open();
                }
                else {
                    this.close();
                }
                return true;
            }

            if (e.altKey) {
                if (e.keyCode === 40 && !this.opened) {
                    this.open();
                }
                else if (e.keyCode == 38) {
                    this.close();
                }
                return true;
            }

            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
            this.move(e);
        },

        keypress: function (e) {
            if (this.suppressKeyPressRepeat) return;
            this.move(e)
        },

        keyup: function (e) {
            switch (e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break;
                case 9: // tab
                case 13: // enter
                    if (!this.opened && !this.listBox) return;
                    var item = this.$popup.find('.jqx-fill-state-pressed');
                    if (item.length > 0) {
                        e.target = item[0];
                        this.select(e, this)
                    }
                    break;

                case 27: // escape
                    if (!this.opened) return;
                    this.close()
                    break;
            }

            if (e.keyCode !== 9) {
                e.stopPropagation()
                e.preventDefault()
            }
            return true;
        },

        clear: function()
        {
            this.host.val("");
        },

        _blur: function (e) {
            var that = this;
            that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            if (this.listBox) {
                this.mouseleave();
            }

            if ($.jqx.browser.msie && $.jqx.browser.version < 9)
                return;

            this.close();
        },

        _focus: function (e) {
            var that = this;
            that.host.addClass(that.toThemeProperty('jqx-fill-state-focus'));
        },

        click: function (e) {
            if (this.disabled) {
                return false;
            }

            var scrollHeight = this.$popup[0].scrollHeight;
            if (scrollHeight > this.$popup.outerHeight()) {
                if (e.pageX >= this.$popup.coord().left + this.$popup.outerWidth() - 18)
                    return true;
            }

            this.select(e, this);
            if (e.stopPropagaton) {
                e.stopPropagaton();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            this.host.focus();
            return false;
        },

        mouseenter: function (e) {
            if (this.disabled) {
                return;
            }
            if ($(e.currentTarget).hasClass('jqx-listitem-state-group'))
            {
                return;
            }

            this.$popup.find('.jqx-fill-state-hover').removeClass(this.toThemeProperty('jqx-fill-state-hover')).removeClass(this.toThemeProperty('jqx-listitem-state-hover'));;
            $(e.currentTarget).addClass(this.toThemeProperty('jqx-fill-state-hover'));
            $(e.currentTarget).addClass(this.toThemeProperty('jqx-listitem-state-hover'));
        },

        mouseleave: function () {
            if (this.disabled) {
                return;
            }

            this.$popup.find('.jqx-fill-state-hover').removeClass(this.toThemeProperty('jqx-fill-state-hover')).removeClass(this.toThemeProperty('jqx-listitem-state-hover'));
        }

    });
})(jQuery);