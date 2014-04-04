/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxMenu", "", {});

    $.extend($.jqx._jqxMenu.prototype, {
        defineInstance: function () {
            //Type: Array
            //Gets the menu's items.
            this.items = new Array();
            //Type: String.
            //Default: 'horizontal'.
            //Gets or sets the menu's display mode. 
            //Possible Values: 'horizontal', 'vertical', 'popup' 
            this.mode = 'horizontal';
            //Type: Number.
            //Default: null.
            //Sets the width.
            this.width = null;
            //Type: Number.
            //Default: null.
            //Sets the height.
            this.height = null;
            //Type: String.
            //Default: easeInOutSine.
            //Gets or sets the animation's easing to one of the JQuery's supported easings.         
            this.easing = 'easeInOutSine';
            //Type: Number.
            //Default: 500.
            //Gets or sets the duration of the show animation.         
            this.animationShowDuration = 200;
            //Type: Number.
            //Default: 'fast'.
            //Gets or sets the duration of the hide animation.
            this.animationHideDuration = 200;
            // Type: Number
            // Default: 0
            // Gets or sets whether the menu is automatically closed after a period of time.
            this.autoCloseInterval = 0;
            //Type: Number.
            //Default: 500.
            //Gets or sets the delay before the start of the hide animation.
            this.animationHideDelay = 100;
            //Type: Number.
            //Default: 200.
            //Gets or sets the delay before the start of the show animation.            
            this.animationShowDelay = 100;
            //Type: Array.
            this.menuElements = new Array();
            //Type: Boolean.
            //Default: true.
            //Auto-Sizes the Menu's main items when the menu's mode is 'horizontal'.
            this.autoSizeMainItems = false;
            //Type: Boolean.
            //Default: true.
            //Automatically closes the opened popups after a click.
            this.autoCloseOnClick = true;
            //Type: Boolean.
            //Default: true.
            //Automatically closes the opened popups after mouse leave.
            this.autoCloseOnMouseLeave = true;
            //Type: Boolean.
            //Default: true.
            //Enables or disables the rounded corners.
            this.enableRoundedCorners = true;
            //Type: Boolean.
            //Default: true.
            //Enables or disables the Menu.
            this.disabled = false;
            //Type: Boolean.
            //Default: true.
            //Opens the Context Menu when the right-mouse button is pressed.
            //When this property is set to false, the Open and Close functions can be used to open and close 
            //the Context Menu.
            this.autoOpenPopup = true;
            // Type: Boolean
            // Default: true
            // enables or disables the hover state.
            this.enableHover = true;
            // Type: Boolean
            // Default: true
            // opens the top level menu items when the user hovers them.
            this.autoOpen = true;
            // Type: Boolean
            // Default: false
            // When this property is true, the menu is auto generated using all of ul and li tags inside the host.
            this.autoGenerate = true;
            // Type: Boolean
            // Default: false
            // opens an item after a click by the user.
            this.clickToOpen = false;
            // Type: Boolean
            // Default: false
            // shows the top-level item arrows in the default horizontal menu mode.
            this.showTopLevelArrows = false;
            // Sets whether the menu is on touch device.
            this.touchMode = 'auto';
            // Sets menu's source.
            this.source = null;
            this.popupZIndex = 20000;
            this.rtl = false;
            // Menu events.
            this.events =
		    [
                'shown', 'closed', 'itemclick', 'initialized'
            ];
        },

        createInstance: function (args) {
            var self = this;
            this.host.css('display', 'block');
            this.host.attr('role', 'menubar');
            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (self.disabled) {
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    self.host.addClass(self.toThemeProperty('jqx-menu-disabled'));
                }
                else {
                    self.host.removeClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    self.host.removeClass(self.toThemeProperty('jqx-menu-disabled'));
                }
            }

            var percentageSize = false;
            var me = this;
            if (me.width != null && me.width.toString().indexOf("%") != -1) {
                percentageSize = true;
            }

            if (me.height != null && me.height.toString().indexOf("%") != -1) {
                percentageSize = true;
            }

            $.jqx.utilities.resize(this.host, function () {
                me.refresh();
            }, false, this.mode != "popup");

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-menu-disabled'));
            }

            this.host.css('outline', 'none');

            if (this.source) {
                if (this.source != null) {
                    var html = this.loadItems(this.source);
                    this.element.innerHTML = html;
                }
            }

            if (this.element.innerHTML.indexOf('UL')) {
                var innerElement = this.host.find('ul:first');
                if (innerElement.length > 0) {
                    this._createMenu(innerElement[0]);
                }
            }

            this.host.data('autoclose', {});

            this._render();
            this.setSize();
            var me = this;
            //   this.host.css('visibility', 'visible');
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                this.host.attr('hideFocus', true);
            }
        },

        focus: function()
        {
            try
            {
                this.host.focus();
            }
            catch (error) {
            }
        },

        loadItems: function (items, subMenuWidth) {
            if (items == null) {
                return;
            }
            if (items.length == 0) return "";

            var self = this;
            this.items = new Array();
            var html = '<ul>';
            if (subMenuWidth) {
                html = '<ul style="width:' + subMenuWidth + ';">';
            }

            $.map(items, function (item) {
                if (item == undefined)
                    return null;

                html += self._parseItem(item);
            });

            html += '</ul>';
            return html;
        },

        _parseItem: function (item) {
            var html = "";

            if (item == undefined)
                return null;

            var label = item.label;
            if (!item.label && item.html) {
                label = item.html;
            }
            if (!label) {
                label = "Item";
            }

            if (typeof item === 'string') {
                label = item;
            }

            var selected = false;
            if (item.selected != undefined && item.selected) {
                selected = true;
            }

            var disabled = false;
            if (item.disabled != undefined && item.disabled) {
                disabled = true;
            }

            html += '<li';

            if (disabled) {
                html += ' item-disabled="true" ';
            }

            if (item.label && !item.html) {
                html += ' item-label="' + label + '" ';
            }

            if (item.value != null) {
                html += ' item-value="' + item.value + '" ';
            }

            if (item.id != undefined) {
                html += ' id="' + item.id + '" ';
            }

            html += '>' + label;

            if (item.items) {
                if (item.subMenuWidth) {
                    html += this.loadItems(item.items, item.subMenuWidth);
                }
                else {
                    html += this.loadItems(item.items);
                }
            }

            html += '</li>';
            return html;
        },

        setSize: function () {
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
            }
            else if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };
            if (this.height === null) {
                this.host.height('auto');
            }
        },

        isTouchDevice: function () {
            if (this._isTouchDevice != undefined) return this._isTouchDevice;
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                isTouchDevice = true;
            }
            else if (this.touchMode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice) {
                this.host.addClass(this.toThemeProperty('jqx-touch'));
                $(".jqx-menu-item").addClass(this.toThemeProperty('jqx-touch'));
            }
            this._isTouchDevice = isTouchDevice;
            return isTouchDevice;
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this.setSize();
            }
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        _closeAll: function (e) {
            var me = e != null ? e.data : this;
            var items = me.items;
            $.each(items, function () {
                var item = this;
                if (item.hasItems == true) {
                    if (item.isOpen) {
                        me._closeItem(me, item);
                    }
                }
            });

            if (me.mode == 'popup') {
                if (e != null) {
                    var rightclick = me._isRightClick(e);
                    if (!rightclick) {
                        me.close();
                    }
                }
            }
        },

        // @param id
        // closes a menu item by id.
        closeItem: function (id) {
            if (id == null)
                return false;
            var theId = id;
            var element = document.getElementById(theId);
            var me = this;

            $.each(me.items, function () {
                var item = this;
                if (item.isOpen == true && item.element == element) {
                    me._closeItem(me, item);
                    if (item.parentId) {
                        me.closeItem(item.parentId);
                    }
                }
            });

            return true;
        },

        // @param id
        // opens a menu item by id.
        openItem: function (id) {
            if (id == null)
                return false;

            var theId = id;
            var element = document.getElementById(theId);
            var me = this;
            $.each(me.items, function () {
                var item = this;
                if (item.isOpen == false && item.element == element) {
                    me._openItem(me, item);
                    if (item.parentId) {
                        me.openItem(item.parentId);
                    }
                }
            });

            return true;
        },

        _getClosedSubMenuOffset: function (item) {
            var $submenu = $(item.subMenuElement);
            var top = -$submenu.outerHeight();
            var left = -$submenu.outerWidth();
            var isTopItem = item.level == 0 && this.mode == 'horizontal';
            if (isTopItem) {
                left = 0;
            }
            else {
                top = 0;
            }

            switch (item['openVerticalDirection']) {
                case 'up':
                case 'center':
                    top = $submenu.outerHeight();
                    break;
            }

            switch (item['openHorizontalDirection']) {
                case this._getDir('left'):
                    if (isTopItem) {
                        left = 0;
                    }
                    else {
                        left = $submenu.outerWidth();
                    }
                    break;
                case 'center':
                    if (isTopItem) {
                        left = 0;
                    }
                    else {
                        left = $submenu.outerWidth();
                    }
                    break;
            }
            return { left: left, top: top };
        },

        
        _closeItem: function (me, item, subs, force) {
            if (me == null || item == null)
                return false;

            var $submenu = $(item.subMenuElement);
          
            var isTopItem = item.level == 0 && this.mode == 'horizontal';
            var subMenuOffset = this._getClosedSubMenuOffset(item);
            var top = subMenuOffset.top;
            var left = subMenuOffset.left;

            var $menuElement = $(item.element);
            var $popupElement = $submenu.closest('div.jqx-menu-popup');
            if ($popupElement != null) {
                var delay = me.animationHideDelay;
                if (force == true) {
                    //     clearTimeout($submenu.data('timer').hide);
                    delay = 0;
                }

                if ($submenu.data('timer').show != null) {
                    clearTimeout($submenu.data('timer').show);
                    $submenu.data('timer').show = null;
                }

                var hideFunc = function () {
                    item.isOpen = false;

                    if (isTopItem) {
                        $submenu.stop().animate({ top: top }, me.animationHideDuration, function () {
                            $(item.element).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                            $(item.element).removeClass(me.toThemeProperty('jqx-menu-item-top-selected'));

                            $(item.element).removeClass(me.toThemeProperty('jqx-rc-b-expanded'));
                            $popupElement.removeClass(me.toThemeProperty('jqx-rc-t-expanded'));
                            var $arrowSpan = $(item.arrow);
                            if ($arrowSpan.length > 0 && me.showTopLevelArrows) {
                                $arrowSpan.removeClass();
                                if (item.openVerticalDirection == 'down') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                                }
                            }
                            $.jqx.aria($(item.element), 'aria-expanded', false);

                            $popupElement.css({ display: 'none' });
                            if (me.animationHideDuration == 0) {
                                $submenu.css({ top: top });
                            }
                            me._raiseEvent('1', item);
                        })
                    }
                    else {
                        if (!$.jqx.browser.msie) {
                            //       $popupElement.stop().animate({ opacity: 0 }, me.animationHideDuration, function () {
                            //         });
                        }

                        $submenu.stop().animate({ left: left }, me.animationHideDuration, function () {
                            if (me.animationHideDuration == 0) {
                                $submenu.css({ left: left });
                            }

                            if (item.level > 0) {
                                $(item.element).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $(item.element).removeClass(me.toThemeProperty('jqx-menu-item-selected'));
                                var $arrowSpan = $(item.arrow);
                                if ($arrowSpan.length > 0) {
                                    $arrowSpan.removeClass();
                                    if (item.openHorizontalDirection != 'left') {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                    }
                                    else {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                    }
                                }
                            }
                            else {
                                $(item.element).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $(item.element).removeClass(me.toThemeProperty('jqx-menu-item-top-selected'));
                                var $arrowSpan = $(item.arrow);
                                if ($arrowSpan.length > 0) {
                                    $arrowSpan.removeClass();
                                    if (item.openHorizontalDirection != 'left') {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-top-' + me._getDir('right')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                    }
                                    else {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-top-' + me._getDir('left')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                    }
                                }
                            }
                            $.jqx.aria($(item.element), 'aria-expanded', false);
                            $popupElement.css({ display: 'none' })
                            me._raiseEvent('1', item);
                        })
                    }
                }

                if (delay > 0) {
                    $submenu.data('timer').hide = setTimeout(function () {
                        hideFunc();
                    }, delay);
                }
                else {
                    hideFunc();
                }

                if (subs != undefined && subs) {
                    var children = $submenu.children();// find('.' + me.toThemeProperty('jqx-menu-item'));
                    $.each(children, function () {
                        if (me.menuElements[this.id] && me.menuElements[this.id].isOpen) {
                            var $submenu = $(me.menuElements[this.id].subMenuElement);
                            me._closeItem(me, me.menuElements[this.id], true, true);
                        }
                    });
                }
            }
        },

        // @param id
        // @param array.
        // get menu item's sub items.
        getSubItems: function (id, array) {
            if (id == null)
                return false;

            var me = this;
            var subItems = new Array();
            if (array != null) {
                $.extend(subItems, array);
            }

            var theId = id;
            var item = this.menuElements[theId];
            var $submenu = $(item.subMenuElement);
            var children = $submenu.find('.jqx-menu-item');
            $.each(children, function () {
                subItems[this.id] = me.menuElements[this.id];
                var innerArray = me.getSubItems(this.id, subItems);
                $.extend(subItems, innerArray);
            });

            return subItems;
        },

        // disables a menu item.
        // @param id
        // @param Boolean
        disable: function (id, disable) {
            if (id == null)
                return;
            var theId = id;
            var me = this;
            if (this.menuElements[theId]) {
                var item = this.menuElements[theId];
                item.disabled = disable;
                var $element = $(item.element);
                item.element.disabled = disable;
                $.each($element.children(), function () {
                    this.disabled = disable;
                });

                if (disable) {
                    $element.addClass(me.toThemeProperty('jqx-menu-item-disabled'));
                    $element.addClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
                else {
                    $element.removeClass(me.toThemeProperty('jqx-menu-item-disabled'));
                    $element.removeClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
            }
        },

        _setItemProperty: function (id, propertyname, value) {
            if (id == null)
                return;

            var theId = id;
            var me = this;

            if (this.menuElements[theId]) {
                var item = this.menuElements[theId];
                if (item[propertyname]) {
                    item[propertyname] = value;
                }
            }
        },

        // sets the open direction of an item.
        // @param id
        // @param String
        // @param String
        setItemOpenDirection: function (id, horizontal, vertical) {
            if (id == null)
                return;
            var theId = id;
            var me = this;
            var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;

            if (this.menuElements[theId]) {
                var item = this.menuElements[theId];
                if (horizontal != null) {
                    item['openHorizontalDirection'] = horizontal;
                    if (item.hasItems && item.level > 0) {
                        var $element = $(item.element);
                        if ($element != undefined) {
                            var $arrowSpan = $(item.arrow);
                            if (item.arrow == null) {
                                $arrowSpan = $('<span id="arrow' + $element[0].id + '"></span>');
                                if (!ie7) {
                                    $arrowSpan.prependTo($element);
                                }
                                else {
                                    $arrowSpan.appendTo($element);
                                }
                                item.arrow = $arrowSpan[0];
                            }
                            $arrowSpan.removeClass();
                            if (item.openHorizontalDirection == 'left') {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                            }
                            else {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            }
                            $arrowSpan.css('visibility', 'visible');

                            if (!ie7) {
                                $arrowSpan.css('display', 'block');
                                $arrowSpan.css('float', 'right');
                            }
                            else {
                                $arrowSpan.css('display', 'inline-block');
                                $arrowSpan.css('float', 'none');
                            }
                        }
                    }
                }
                if (vertical != null) {
                    item['openVerticalDirection'] = vertical;
                    var $arrowSpan = $(item.arrow);
                    var $element = $(item.element);
                    if (!me.showTopLevelArrows) {
                        return;
                    }

                    if ($element != undefined) {
                        if (item.arrow == null) {
                            $arrowSpan = $('<span id="arrow' + $element[0].id + '"></span>');
                            if (!ie7) {
                                $arrowSpan.prependTo($element);
                            }
                            else {
                                $arrowSpan.appendTo($element);
                            }
                            item.arrow = $arrowSpan[0];
                        }
                        $arrowSpan.removeClass();
                        if (item.openVerticalDirection == 'down') {
                            $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down'));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                        }
                        else {
                            $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up'));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                        }
                        $arrowSpan.css('visibility', 'visible');
                        if (!ie7) {
                            $arrowSpan.css('display', 'block');
                            $arrowSpan.css('float', 'right');
                        }
                        else {
                            $arrowSpan.css('display', 'inline-block');
                            $arrowSpan.css('float', 'none');

                        }
                    }
                }
            }
        },

        
        _getSiblings: function (item) {
            var siblings = new Array();
            var index = 0;
            for (i = 0; i < this.items.length; i++) {
                if (this.items[i] == item)
                    continue;

                if (this.items[i].parentId == item.parentId && this.items[i].hasItems) {
                    siblings[index++] = this.items[i];
                }
            }
            return siblings;
        },

        
        _openItem: function (me, item, zIndex) {
            if (me == null || item == null)
                return false;

            if (item.isOpen)
                return false;

            if (item.disabled)
                return false;

            if (me.disabled)
                return false;
            var zIndx = me.popupZIndex;
            if (zIndex != undefined) {
                zIndx = zIndex;
            }

            var hideDuration = me.animationHideDuration;
            me.animationHideDuration = 0;
            me._closeItem(me, item, true, true);
            me.animationHideDuration = hideDuration;

            this.host.focus();

            var popupElementoffset = [5, 5];
            var $submenu = $(item.subMenuElement);
            if ($submenu != null) {
                $submenu.stop();
            }
            // stop hiding process.
            if ($submenu.data('timer').hide != null) {
                clearTimeout($submenu.data('timer').hide);
                //      $submenu.data('timer').hide = null;
            }
            var $popupElement = $submenu.closest('div.jqx-menu-popup');
            var $menuElement = $(item.element);
            var offset = item.level == 0 ? this._getOffset(item.element) : $menuElement.position()

            if (item.level > 0 && this.hasTransform) {
                var topTransform = parseInt($menuElement.coord().top) - parseInt(this._getOffset(item.element).top);
                offset.top += topTransform;
            }

            if (item.level == 0 && this.mode == 'popup') {
                offset = $menuElement.coord();
            }

            var isTopItem = item.level == 0 && this.mode == 'horizontal';

            var menuItemLeftOffset = isTopItem ? offset.left : this.menuElements[item.parentId] != null && this.menuElements[item.parentId].subMenuElement != null ? parseInt($($(this.menuElements[item.parentId].subMenuElement).closest('div.jqx-menu-popup')).outerWidth()) - popupElementoffset[0]
            : parseInt($submenu.outerWidth());

            $popupElement.css({ visibility: 'visible', display: 'block', left: menuItemLeftOffset, top: isTopItem ? offset.top + $menuElement.outerHeight() : offset.top, zIndex: zIndx })
            $submenu.css('display', 'block');

            if (this.mode != 'horizontal' && item.level == 0) {
                var hostOffset = this._getOffset(this.element)
                $popupElement.css('left', -1 + hostOffset.left + this.host.outerWidth());

                //          $popupElement.css('left', -2 + offset.left + this.host.width() - popupElementoffset[0]);
                $submenu.css('left', -$submenu.outerWidth());
            }
            else {
                var subMenuOffset = this._getClosedSubMenuOffset(item);
                $submenu.css('left', subMenuOffset.left);
                $submenu.css('top', subMenuOffset.top);
            }

            $popupElement.css({ height: parseInt($submenu.outerHeight()) + parseInt(popupElementoffset[1]) + 'px' });

            var top = 0;
            var left = 0;

            switch (item['openVerticalDirection']) {
                case 'up':
                    if (isTopItem) {
                        $submenu.css('top', $submenu.outerHeight());
                        top = popupElementoffset[1];
                        var paddingBottom = parseInt($submenu.parent().css('padding-bottom'));
                        if (isNaN(paddingBottom)) paddingBottom = 0;
                        if (paddingBottom > 0) {
                            $popupElement.addClass(this.toThemeProperty('jqx-menu-popup-clear'));
                        }

                        $submenu.css('top', $submenu.outerHeight() - paddingBottom);
                        $popupElement.css({ display: 'block', top: offset.top - $popupElement.outerHeight(), zIndex: zIndx })
                    }
                    else {
                        top = popupElementoffset[1];
                        $submenu.css('top', $submenu.outerHeight());
                        $popupElement.css({ display: 'block', top: offset.top - $popupElement.outerHeight() + popupElementoffset[1] + $menuElement.outerHeight(), zIndex: zIndx })
                    }
                    break;
                case 'center':
                    if (isTopItem) {
                        $submenu.css('top', 0);
                        $popupElement.css({ display: 'block', top: offset.top - $popupElement.outerHeight() / 2 + popupElementoffset[1], zIndex: zIndx })
                    }
                    else {
                        $submenu.css('top', 0);
                        $popupElement.css({ display: 'block', top: offset.top + $menuElement.outerHeight() / 2 - $popupElement.outerHeight() / 2 + popupElementoffset[1], zIndex: zIndx })
                    }

                    break;
            }

            switch (item['openHorizontalDirection']) {
                case this._getDir('left'):
                    if (isTopItem) {
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth() - $menuElement.outerWidth() - popupElementoffset[0]) });
                    }
                    else {
                        left = 0;
                        $submenu.css('left', $popupElement.outerWidth());
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth()) + 2*item.level });
                    }
                    break;
                case 'center':
                    if (isTopItem) {
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth() / 2 - $menuElement.outerWidth() / 2 - popupElementoffset[0] / 2) });
                    }
                    else {
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth() / 2 - $menuElement.outerWidth() / 2 - popupElementoffset[0] / 2) });
                        $submenu.css('left', $popupElement.outerWidth());
                    }
                    break;
            }

            if (isTopItem) {
                if (parseInt($submenu.css('top')) == top) {
                    item.isOpen = true;
                    return;
                }
            }
            else if (parseInt($submenu.css('left')) == left) {
                item.isOpen == true;
                return;
            }

            $.each(me._getSiblings(item), function () {
                me._closeItem(me, this, true, true);
            });
            var hideDelay = $.data(me.element, 'animationHideDelay');
            me.animationHideDelay = hideDelay;


            if (this.autoCloseInterval > 0) {
                if (this.host.data('autoclose') != null && this.host.data('autoclose').close != null) {
                    clearTimeout(this.host.data('autoclose').close);
                }

                if (this.host.data('autoclose') != null) {
                    this.host.data('autoclose').close = setTimeout(function () {
                        me._closeAll();
                    }, this.autoCloseInterval);
                }
            }

            $submenu.data('timer').show = setTimeout(function () {
                if ($popupElement != null) {
                    if (isTopItem) {
                        $submenu.stop();
                        $submenu.css('left', left);
                        if (!$.jqx.browser.msie) {
                            //      $popupElement.css('opacity', 0.0);
                        }

                        $menuElement.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                        $menuElement.addClass(me.toThemeProperty('jqx-menu-item-top-selected'));
                        if (item.openVerticalDirection == "down") {
                            $(item.element).addClass(me.toThemeProperty('jqx-rc-b-expanded'));
                            $popupElement.addClass(me.toThemeProperty('jqx-rc-t-expanded'));
                        }
                        else {
                            $(item.element).addClass(me.toThemeProperty('jqx-rc-t-expanded'));
                            $popupElement.addClass(me.toThemeProperty('jqx-rc-b-expanded'));
                        }

                        var $arrowSpan = $(item.arrow);
                        if ($arrowSpan.length > 0 && me.showTopLevelArrows) {
                            $arrowSpan.removeClass();
                            if (item.openVerticalDirection == 'down') {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down-selected'));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                            }
                            else {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up-selected'));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                            }
                        }

                        if (me.animationShowDuration == 0) {
                            $submenu.css({ top: top });
                            item.isOpen = true;
                            me._raiseEvent('0', item);
                            $.jqx.aria($(item.element), 'aria-expanded', true);
                        }
                        else {
                            $submenu.animate({ top: top }, me.animationShowDuration, me.easing,
                            function () {
                                item.isOpen = true;
                                $.jqx.aria($(item.element), 'aria-expanded', true);
                                me._raiseEvent('0', item);
                            }) //animate submenu into view
                        }
                    }
                    else {
                        $submenu.stop();
                        $submenu.css('top', top);
                        if (!$.jqx.browser.msie) {
                            //     $popupElement.css('opacity', 0.0);
                        }

                        if (item.level > 0) {
                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-selected'));
                            var $arrowSpan = $(item.arrow);
                            if ($arrowSpan.length > 0) {
                                $arrowSpan.removeClass();
                                if (item.openHorizontalDirection != 'left') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right') + '-selected'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left') + '-selected'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                }
                            }
                        }
                        else {
                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-top-selected'));
                            var $arrowSpan = $(item.arrow);
                            if ($arrowSpan.length > 0) {
                                $arrowSpan.removeClass();
                                if (item.openHorizontalDirection != 'left') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right') + '-selected'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left') + '-selected'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                }
                            }
                        }
                        if (!$.jqx.browser.msie) {
                            //      $popupElement.animate({ opacity: 1 }, 2 * me.animationShowDuration, me.easing,
                            //   function () {

                            // })
                        }
                        if (me.animationShowDuration == 0) {
                            $submenu.css({ left: left });
                            me._raiseEvent('0', item);
                            item.isOpen = true;
                            $.jqx.aria($(item.element), 'aria-expanded', true);
                        }
                        else {
                            $submenu.animate({ left: left }, me.animationShowDuration, me.easing, function () {
                                me._raiseEvent('0', item);
                                item.isOpen = true;
                                $.jqx.aria($(item.element), 'aria-expanded', true);
                            }) //animate submenu into view
                        }
                    }
                }
            }, this.animationShowDelay);
        },

        _getDir: function(dir)
        {
            switch (dir) {
                case 'left':
                    return !this.rtl ? 'left' : 'right';
                case 'right':
                    return this.rtl ? 'left' : 'right';
            }
            return 'left';
        },

        
        _applyOrientation: function (mode, oldmode) {
            var me = this;
            var maxHeight = 0;
            this.host.removeClass(me.toThemeProperty('jqx-menu-horizontal'));
            this.host.removeClass(me.toThemeProperty('jqx-menu-vertical'));
            this.host.removeClass(me.toThemeProperty('jqx-menu'));
            this.host.removeClass(me.toThemeProperty('jqx-widget'));
            this.host.addClass(me.toThemeProperty('jqx-widget'));
            this.host.addClass(me.toThemeProperty('jqx-menu'));

            if (mode != undefined && oldmode != undefined && oldmode == 'popup') {
                if (this.host.parent().length > 0 && this.host.parent().parent().length > 0 && this.host.parent().parent()[0] == document.body) {
                    var oldHost = $.data(document.body, 'jqxMenuOldHost' + this.element.id);
                    if (oldHost != null) {
                        var $popupElementparent = this.host.closest('div.jqx-menu-wrapper')
                        $popupElementparent.remove();
                        $popupElementparent.appendTo(oldHost);
                        this.host.css('display', 'block');
                        this.host.css('visibility', 'visible');
                        $popupElementparent.css('display', 'block');
                        $popupElementparent.css('visibility', 'visible');
                    }
                }
            }
            else if (mode == undefined && oldmode == undefined) {
                $.data(document.body, 'jqxMenuOldHost' + this.element.id, this.host.parent()[0]);
            }

            if (this.autoOpenPopup) {
                if (this.mode == 'popup') {
                    this.addHandler($(document),'contextmenu.' + this.element.id, function (e) {
                        return false;
                    });

                    this.addHandler($(document), 'mousedown.menu' + this.element.id, function(event)
                    {
                        me._openContextMenu(event);
                    });
                }
                else {
                    this.removeHandler($(document), 'contextmenu.' + this.element.id);
                    this.removeHandler($(document), 'mousedown.menu' + this.element.id);
                }
            }
            else {
                this.removeHandler($(document), 'contextmenu.' + this.element.id);
                this.removeHandler($(document), 'mousedown.menu' + this.element.id);
            }

            if (this.rtl) {
                this.host.addClass(this.toThemeProperty('jqx-rtl'));
            }

            switch (this.mode) {
                case 'horizontal':
                    this.host.addClass(me.toThemeProperty('jqx-widget-header'));
                    this.host.addClass(me.toThemeProperty('jqx-menu-horizontal'));

                    $.each(this.items, function () {
                        var item = this;
                        $element = $(item.element);

                        var $arrowSpan = $(item.arrow);
                        $arrowSpan.removeClass();

                        if (item.hasItems && item.level > 0) {
                            var $arrowSpan = $('<span style="border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');
                            $arrowSpan.prependTo($element);
                            $arrowSpan.css('float', me._getDir('right'));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            item.arrow = $arrowSpan[0];
                        }

                        if (item.level == 0) {
                            $(item.element).css('float', me._getDir('left'));
                            if (!item.ignoretheme && item.hasItems && me.showTopLevelArrows) {
                                var $arrowSpan = $('<span style="border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');
                                var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;

                                if (item.arrow == null) {
                                    if (!ie7) {
                                        $arrowSpan.prependTo($element);
                                    }
                                    else {
                                        $arrowSpan.appendTo($element);
                                    }
                                } else {
                                    $arrowSpan = $(item.arrow);
                                }
                                if (item.openVerticalDirection == 'down') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                                }

                                $arrowSpan.css('visibility', 'visible');

                                if (!ie7) {
                                    $arrowSpan.css('display', 'block');
                                    $arrowSpan.css('float', 'right');
                                }
                                else {
                                    $arrowSpan.css('display', 'inline-block');
                                }

                                item.arrow = $arrowSpan[0];
                            }
                            else if (!item.ignoretheme && item.hasItems && !me.showTopLevelArrows) {
                                if (item.arrow != null) {
                                    var $arrowSpan = $(item.arrow);
                                    $arrowSpan.remove();
                                    item.arrow = null;
                                }
                            }
                            maxHeight = Math.max(maxHeight, $element.height());
                        }
                    });
                    break;
                case 'vertical':
                case 'popup':
                    this.host.addClass(me.toThemeProperty('jqx-menu-vertical'));

                    $.each(this.items, function () {
                        var item = this;
                        $element = $(item.element);
                        if (item.hasItems && !item.ignoretheme) {
                            if (item.arrow) {
                                $(item.arrow).remove();
                            }

                            var $arrowSpan = $('<span style="border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');

                            $arrowSpan.prependTo($element);
                            $arrowSpan.css('float', 'right');

                            if (item.level == 0) {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-top-' + me._getDir('right')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            }
                            else {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            }
                            item.arrow = $arrowSpan[0];
                        }
                        $element.css('float', 'none');
                    });

                    if (this.mode == 'popup') {
                        this.host.addClass(me.toThemeProperty('jqx-widget-content'));
                        this.host.wrap('<div class="jqx-menu-wrapper" style="z-index:' + this.popupZIndex + '; border: none; background-color: transparent; padding: 0px; margin: 0px; position: absolute; top: 0; left: 0; display: block; visibility: visible;"></div>')
                        var $popupElementparent = this.host.closest('div.jqx-menu-wrapper')
                        this.host.addClass(me.toThemeProperty('jqx-popup'));
                        $popupElementparent[0].id = "menuWrapper" + this.element.id;
                        $popupElementparent.appendTo($(document.body));
                    }
                    else {
                        this.host.addClass(me.toThemeProperty('jqx-widget-header'));
                    }

                    if (this.mode == 'popup') {
                        var height = this.host.height();
                        this.host.css('position', 'absolute');
                        this.host.css('top', '0');
                        this.host.css('left', '0');
                        this.host.height(height);
                        this.host.css('display', 'none');
                        //    this.host.css('visibility', 'hidden');
                    }
                    break;
            }
            var isTouchDevice = this.isTouchDevice();
            if (this.autoCloseOnClick) {
                this.removeHandler($(document), 'mousedown.menu' + this.element.id, me._closeAfterClick);
                this.addHandler($(document), 'mousedown.menu' + this.element.id, me._closeAfterClick, me);
                if (isTouchDevice) {
                    this.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.menu' + this.element.id, me._closeAfterClick, me);
                    this.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.menu' + this.element.id, me._closeAfterClick, me);
                }
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

        _getOffset: function (object) {
     //       var scrollTop = $(window).scrollTop();
     //       var scrollLeft = $(window).scrollLeft();
            var isSafari = $.jqx.mobile.isSafariMobileBrowser();

            var offset = $(object).coord(true);
            var top = offset.top;
            var left = offset.left;

            if ($('body').css('border-top-width') != '0px') {
                top = parseInt(top) + this._getBodyOffset().top;
            }
            if ($('body').css('border-left-width') != '0px') {
                left = parseInt(left) + this._getBodyOffset().left;
            }

            var windowsPhone = $.jqx.mobile.isWindowsPhone();
            if (this.hasTransform || (isSafari != null && isSafari) || windowsPhone) {
                var point = { left: $.jqx.mobile.getLeftPos(object), top: $.jqx.mobile.getTopPos(object) };
                return point;
            }
            else return { left: left, top: top };
        },

        _isRightClick: function (e) {
            var rightclick;
            if (!e) var e = window.event;
            if (e.which) rightclick = (e.which == 3);
            else if (e.button) rightclick = (e.button == 2);
            return rightclick;
        },

        _openContextMenu: function (e) {
            var me = this;
            var rightclick = me._isRightClick(e);

            if (rightclick) {
                me.open(parseInt(e.clientX) + 5, parseInt(e.clientY) + 5);
            }
        },

        // closes a context menu.
        close: function () {
            var me = this;
            var opened = $.data(this.element, 'contextMenuOpened' + this.element.id);
            if (opened) {
                var host = this.host;
                $.each(me.items, function () {
                    var item = this;
                    if (item.hasItems) {
                        me._closeItem(me, item);
                    }
                });

                $.each(me.items, function () {
                    var item = this;
                    if (item.isOpen == true) {
                        $submenu = $(item.subMenuElement);
                        var $popupElement = $submenu.closest('div.jqx-menu-popup')
                        $popupElement.hide(this.animationHideDuration);

                    }
                });

                this.host.hide(this.animationHideDuration);
                $.data(me.element, 'contextMenuOpened' + this.element.id, false);
                me._raiseEvent('1', me);
            }
        },

        // @param String. Horizontal offset
        // @param String. Vertical Offset
        // opens a context menu.
        open: function (left, top) {
            if (this.mode == 'popup') {
                var duration = 0;
                if (this.host.css('display') == 'block') {
                    this.close();
                    duration = this.animationHideDuration;
                }

                var me = this;

                if (left == undefined || left == null) left = 0;
                if (top == undefined || top == null) top = 0;

                setTimeout(function () {
                    me.host.show(me.animationShowDuration);
                    me.host.css('visibility', 'visible');
                    $.data(me.element, 'contextMenuOpened' + me.element.id, true);
                    me._raiseEvent('0', me);
                    me.host.css('z-index', 9999);

                    if (left != undefined && top != undefined) {
                        me.host.css({ 'left': left, 'top': top });
                    }
                }, duration);
            }
        },

        _renderHover: function ($menuElement, item, isTouchDevice) {
            var me = this;
            if (!item.ignoretheme) {
                this.addHandler($menuElement, 'mouseenter', function () {
                    if (!item.disabled && !item.separator && me.enableHover && !me.disabled) {
                        if (item.level > 0) {
                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-hover'));
                        }
                        else {
                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-top-hover'));
                        }
                    }
                });
                this.addHandler($menuElement, 'mouseleave', function () {            
                if (!item.disabled && !item.separator && me.enableHover && !me.disabled) {
                    if (item.level > 0) {
                        $menuElement.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                        $menuElement.removeClass(me.toThemeProperty('jqx-menu-item-hover'));
                    }
                    else {
                        $menuElement.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                        $menuElement.removeClass(me.toThemeProperty('jqx-menu-item-top-hover'));
                    }
                }
            });
            }            
        },

        _closeAfterClick: function (event) {
            var me = event != null ? event.data : this;
            var matches = false;
            if (me.autoCloseOnClick) {
                $.each($(event.target).parents(), function () {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-menu') != -1) {
                            matches = true;
                            return false;
                        }
                    }
                });

                if (!matches) {
                    event.data = me;
                    me._closeAll(event);
                }
            }
        },

        _autoSizeHorizontalMenuItems: function () {
            var me = this;
            if (me.autoSizeMainItems && this.mode == "horizontal") {
                var maxHeight = this.maxHeight;
                if (parseInt(maxHeight) > parseInt(this.host.height())) {
                    maxHeight = parseInt(this.host.height());
                }
                maxHeight = parseInt(this.host.height());

                // align vertically the items.
                $.each(this.items, function () {
                    var item = this;
                    $element = $(item.element);
                    if (item.level == 0 && maxHeight > 0) {
                        var childrenHeight = $element.children().length > 0 ? parseInt($element.children().height()) : $element.height();
                        // vertically align content.
                        var $ul = me.host.find('ul:first');
                        var paddingOffset = parseInt($ul.css('padding-top'));
                        var marginOffset = parseInt($ul.css('margin-top'));
                        //   var borderOffset = parseInt(me.host.css('border-top-width'));
                        var height = maxHeight - 2 * (marginOffset + paddingOffset);
                        var newPadding = parseInt(height) / 2 - childrenHeight / 2;
                        var topPadding = parseInt(newPadding);
                        var bottomPadding = parseInt(newPadding);
                        $element.css('padding-top', topPadding);
                        $element.css('padding-bottom', bottomPadding);

                        if (parseInt($element.outerHeight()) > height) {
                            var offset = 1;
                            $element.css('padding-top', topPadding - offset);
                            topPadding = topPadding - offset;
                        }
                    }
                });
            }
            $.each(this.items, function () {
                var item = this;
                $element = $(item.element);
                if (item.hasItems && item.level > 0) {
                    if (item.arrow)
                    {
                        var $arrowSpan = $(item.arrow);
                        var height = $(item.element).height();
                        if (height > 15) {
                            $arrowSpan.css('margin-top', (height - 15) / 2);
                        }
                    }
                }
            });
        },

        _render: function (mode, oldMode) {
            var zIndex = this.popupZIndex;
            var popupElementoffset = [5, 5];
            var me = this;
            $.data(me.element, 'animationHideDelay', me.animationHideDelay);
            var isTouchDevice = this.isTouchDevice();
            var WP = isTouchDevice && $.jqx.mobile.isWindowsPhone();

            $.data(document.body, 'menuel', this);

            this.hasTransform = $.jqx.utilities.hasTransform(this.host);

            this._applyOrientation(mode, oldMode);

            if (me.enableRoundedCorners) {
                this.host.addClass(me.toThemeProperty('jqx-rc-all'));
            }

            $.each(this.items, function () {
                var item = this;
                var $menuElement = $(item.element);
                $menuElement.attr('role', 'menuitem');
                if (me.enableRoundedCorners) {
                    $menuElement.addClass(me.toThemeProperty('jqx-rc-all'));
                }

                me.removeHandler($menuElement, 'click');
                me.addHandler($menuElement, 'click', function (e) {
                    if (item.disabled)
                        return;

                    if (me.disabled)
                        return;

                    me._raiseEvent('2', { item: item.element, event: e });

                    if (!me.autoOpen) {
                        if (item.level > 0) {
                            if (me.autoCloseOnClick && !isTouchDevice && !me.clickToOpen) {
                                e.data = me;
                                me._closeAll(e);
                            }
                        }
                    }
                    else if (me.autoCloseOnClick && !isTouchDevice && !me.clickToOpen) {
                        if (item.closeOnClick) {
                            e.data = me;
                            me._closeAll(e);
                        }
                    }
                    if (isTouchDevice && me.autoCloseOnClick) {
                        e.data = me;
                        if (!item.hasItems) {
                            me._closeAll(e);
                        }
                    }

                    if (e.target.tagName != 'A' && e.target.tagName != 'a') {
                        var anchor = item.anchor != null ? $(item.anchor) : null;

                        if (anchor != null && anchor.length > 0) {
                            var href = anchor.attr('href');
                            var target = anchor.attr('target');
                            if (href != null) {
                                if (target != null) {
                                    window.open(href, target);
                                }
                                else {
                                    window.location = href;
                                }
                                //if (target != null && target == "_blank") {
                                //    window.open(href, target);
                                //}
                                //else {
                                //   window.location = href;
                                //    window.open(href, target);

                                //}
                            }
                        }
                    }
                });

                me.removeHandler($menuElement, 'mouseenter');
                me.removeHandler($menuElement, 'mouseleave');
                if (!WP) {
                    me._renderHover($menuElement, item, isTouchDevice);
                }
                if (item.subMenuElement != null) {
                    var $submenu = $(item.subMenuElement);

                    $submenu.wrap('<div class="jqx-menu-popup ' + me.toThemeProperty('jqx-menu-popup') + '" style="border: none; background-color: transparent; z-index:' + zIndex + '; padding: 0px; margin: 0px; position: absolute; top: 0; left: 0; display: block; visibility: hidden;"><div style="background-color: transparent; border: none; position:absolute; overflow:hidden; left: 0; top: 0; right: 0; width: 100%; height: 100%;"></div></div>')
                    $submenu.css({ overflow: 'hidden', position: 'absolute', left: 0, display: 'inherit', top: -$submenu.outerHeight() })
                    $submenu.data('timer', {});
                    if (item.level > 0) {
                        $submenu.css('left', -$submenu.outerWidth());
                    }
                    else if (me.mode == 'horizontal') {
                        $submenu.css('left', 0);
                    }

                    zIndex++;
                    var $popupElement = $(item.subMenuElement).closest('div.jqx-menu-popup').css({ width: parseInt($(item.subMenuElement).outerWidth()) + parseInt(popupElementoffset[0]) + 'px', height: parseInt($(item.subMenuElement).outerHeight()) + parseInt(popupElementoffset[1]) + 'px' })
                    var $popupElementparent = $menuElement.closest('div.jqx-menu-popup')

                    if ($popupElementparent.length > 0) {
                        var oldsubleftmargin = $submenu.css('margin-left');
                        var oldsubrightmargin = $submenu.css('margin-right');
                        var oldsubleftpadding = $submenu.css('padding-left');
                        var oldsubrightpadding = $submenu.css('padding-right');

                        $popupElement.appendTo($popupElementparent)

                        $submenu.css('margin-left', oldsubleftmargin);
                        $submenu.css('margin-right', oldsubrightmargin);
                        $submenu.css('padding-left', oldsubleftpadding);
                        $submenu.css('padding-right', oldsubrightpadding);
                    }
                    else {
                        var oldsubleftmargin = $submenu.css('margin-left');
                        var oldsubrightmargin = $submenu.css('margin-right');
                        var oldsubleftpadding = $submenu.css('padding-left');
                        var oldsubrightpadding = $submenu.css('padding-right');

                        $popupElement.appendTo($(document.body));
                        $submenu.css('margin-left', oldsubleftmargin);
                        $submenu.css('margin-right', oldsubrightmargin);
                        $submenu.css('padding-left', oldsubleftpadding);
                        $submenu.css('padding-right', oldsubrightpadding);
                    }

                    if (!me.clickToOpen) {
                        if (isTouchDevice) {
                            me.removeHandler($menuElement, $.jqx.mobile.getTouchEventName('touchstart'));
                            me.addHandler($menuElement, $.jqx.mobile.getTouchEventName('touchstart'), function (event) {
                                clearTimeout($submenu.data('timer').hide)
                                if ($submenu != null) {
                                    $submenu.stop();
                                }

                                if (item.level == 0 && !item.isOpen && me.mode != "popup") {
                                    event.data = me;
                                    me._closeAll(event);
                                }

                                if (!item.isOpen) {
                                    me._openItem(me, item);
                                }
                                else {
                                    me._closeItem(me, item, true);
                                }
                                return false;
                            });
                        }

                        if (!WP) {
                            me.addHandler($menuElement, 'mouseenter', function () {
                                if (me.autoOpen || (item.level > 0 && !me.autoOpen)) {
                                    clearTimeout($submenu.data('timer').hide)
                                }

                                if (item.parentId && item.parentId != 0) {
                                    if (me.menuElements[item.parentId]) {
                                        var openedStateOfParent = me.menuElements[item.parentId].isOpen;
                                        if (!openedStateOfParent) {
                                            return;
                                        }
                                    }
                                }

                                if (me.autoOpen || (item.level > 0 && !me.autoOpen)) {
                                    me._openItem(me, item);
                                }
                                return false;
                            });

                            me.addHandler($menuElement, 'mousedown', function () {
                                if (!me.autoOpen && item.level == 0) {
                                    clearTimeout($submenu.data('timer').hide)
                                    if ($submenu != null) {
                                        $submenu.stop();
                                    }

                                    if (!item.isOpen) {
                                        me._openItem(me, item);
                                    }
                                    else {
                                        me._closeItem(me, item, true);
                                    }
                                }
                            });

                            me.addHandler($menuElement, 'mouseleave', function (event) {
                                if (me.autoCloseOnMouseLeave) {
                                    clearTimeout($submenu.data('timer').hide)
                                    var $subMenu = $(item.subMenuElement);
                                    var position = { left: parseInt(event.pageX), top: parseInt(event.pageY) };
                                    var subMenuBounds = {
                                        left: parseInt($subMenu.coord().left), top: parseInt($subMenu.coord().top),
                                        width: parseInt($subMenu.outerWidth()), height: parseInt($subMenu.outerHeight())
                                    };

                                    var closeItem = true;
                                    if (subMenuBounds.left - 5 <= position.left && position.left <= subMenuBounds.left + subMenuBounds.width + 5) {
                                        if (subMenuBounds.top <= position.top && position.top <= subMenuBounds.top + subMenuBounds.height) {
                                            closeItem = false;
                                        }
                                    }

                                    if (closeItem) {
                                        me._closeItem(me, item, true);
                                    }
                                }
                            });

                            me.removeHandler($popupElement, 'mouseenter');
                            me.addHandler($popupElement, 'mouseenter', function () {
                                clearTimeout($submenu.data('timer').hide)
                            });

                            me.removeHandler($popupElement, 'mouseleave');
                            me.addHandler($popupElement, 'mouseleave', function (e) {
                                if (me.autoCloseOnMouseLeave) {
                                    clearTimeout($submenu.data('timer').hide)
                                    clearTimeout($submenu.data('timer').show);
                                    if ($submenu != null) {
                                        $submenu.stop();
                                    }
                                    me._closeItem(me, item, true);
                                }
                            });
                        }
                    }
                    else {
                        me.removeHandler($menuElement, 'mousedown');
                        me.addHandler($menuElement, 'mousedown', function (event) {

                            clearTimeout($submenu.data('timer').hide)
                            if ($submenu != null) {
                                $submenu.stop();
                            }

                            if (item.level == 0 && !item.isOpen) {
                                event.data = me;
                                me._closeAll(event);
                            }

                            if (!item.isOpen) {
                                me._openItem(me, item);
                            }
                            else {
                                me._closeItem(me, item, true);
                            }
                        });
                    }
                }
            });

            this._autoSizeHorizontalMenuItems();
            this._raiseEvent('3', this);
        },

        createID: function () {
            var id = Math.random() + '';
            id = id.replace('.', '');
            id = '99' + id;
            id = id / 1;
            while (this.items[id]) {
                id = Math.random() + '';
                id = id.replace('.', '');
                id = id / 1;
            }
            return 'menuItem' + id;
        },

        _createMenu: function (uiObject, refresh) {
            if (uiObject == null)
                return;

            if (refresh == undefined) {
                refresh = true;
            }
            if (refresh == null) {
                refresh = true;
            }

            var self = this;
            var liTags = $(uiObject).find('li');
            var k = 0;
            for (var index = 0; index < liTags.length; index++) {
                var listItem = liTags[index];
                var $listItem = $(listItem);

                if (listItem.className.indexOf('jqx-menu') == -1 && this.autoGenerate == false)
                    continue;

                var id = listItem.id;
                if (!id) {
                    id = this.createID();
                }

                if (refresh) {
                    listItem.id = id;
                    this.items[k] = new $.jqx._jqxMenu.jqxMenuItem();
                    this.menuElements[id] = this.items[k];
                }

                k += 1;
                var parentId = 0;
                var me = this;
                var children = $listItem.children();
                children.each(function () {
                    if (!refresh) {
                        this.className = "";

                        if (me.autoGenerate) {
                            $(me.items[k - 1].subMenuElement)[0].className = "";
                            $(me.items[k - 1].subMenuElement).addClass(me.toThemeProperty('jqx-widget-content'));
                            $(me.items[k - 1].subMenuElement).addClass(me.toThemeProperty('jqx-menu-dropdown'));
                            $(me.items[k - 1].subMenuElement).addClass(me.toThemeProperty('jqx-popup'));
                        }
                    }

                    if (this.className.indexOf('jqx-menu-dropdown') != -1) {
                        if (refresh) {
                            me.items[k - 1].subMenuElement = this;
                        }
                        return false;
                    }
                    else if (me.autoGenerate && (this.tagName == 'ul' || this.tagName == 'UL')) {
                        if (refresh) {
                            me.items[k - 1].subMenuElement = this;
                        }
                        this.className = "";
                        $(this).addClass(me.toThemeProperty('jqx-widget-content'));
                        $(this).addClass(me.toThemeProperty('jqx-menu-dropdown'));
                        $(this).addClass(me.toThemeProperty('jqx-popup'));
                        $(this).attr('role', 'menu');
                        if (me.rtl) {
                            $(this).addClass(me.toThemeProperty('jqx-rc-l'));
                        }
                        else {
                            $(this).addClass(me.toThemeProperty('jqx-rc-r'));
                        }
                        $(this).addClass(me.toThemeProperty('jqx-rc-b'));

                        return false;
                    }
                });

                var parents = $listItem.parents();
                parents.each(function () {
                    if (this.className.indexOf('jqx-menu-item') != -1) {
                        parentId = this.id;
                        return false;
                    }
                    else if (me.autoGenerate && (this.tagName == 'li' || this.tagName == 'LI')) {
                        parentId = this.id;
                        return false;
                    }

                });

                var separator = false;
                var type = listItem.getAttribute('type');
                var ignoretheme = listItem.getAttribute('ignoretheme');

                if (ignoretheme) {
                    if (ignoretheme == 'true' || ignoretheme == true) {
                        ignoretheme = true;
                    }
                }
                else ignoretheme = false;

                if (!type) {
                    type = listItem.type;
                }
                else {
                    if (type == 'separator') {
                        var separator = true;
                    }
                }

                if (!separator) {
                    if (parentId) {
                        type = 'sub';
                    }
                    else type = 'top';
                }

                var menuItem = this.items[k - 1];
                if (refresh) {
                    menuItem.id = id;
                    menuItem.parentId = parentId;
                    menuItem.type = type;
                    menuItem.separator = separator;
                    menuItem.element = liTags[index];
                    var anchor = $listItem.children('a');
                    menuItem.level = $listItem.parents('li').length;
                    menuItem.anchor = anchor.length > 0 ? anchor : null;
                }
                menuItem.ignoretheme = ignoretheme;

                var parentItem = this.menuElements[parentId];
                if (parentItem != null) {
                    if (parentItem.ignoretheme) {
                        menuItem.ignoretheme = parentItem.ignoretheme;
                        ignoretheme = parentItem.ignoretheme;
                    }
                }

                if (this.autoGenerate) {
                    if (type == 'separator') {
                        $listItem.removeClass();
                        $listItem.addClass(this.toThemeProperty('jqx-menu-item-separator'));
                        $listItem.attr('role', 'separator');
                    }
                    else {
                        if (!ignoretheme) {
                            $listItem[0].className = "";
                            if (this.rtl) {
                                $listItem.addClass(this.toThemeProperty('jqx-rtl'));
                            }
                            if (menuItem.level > 0) {
                                $listItem.addClass(this.toThemeProperty('jqx-item'));
                                $listItem.addClass(this.toThemeProperty('jqx-menu-item'));
                            }
                            else {
                                $listItem.addClass(this.toThemeProperty('jqx-item'));
                                $listItem.addClass(this.toThemeProperty('jqx-menu-item-top'));
                            }
                        }
                    }
                }

                if (refresh && !ignoretheme) {
                    menuItem.hasItems = $listItem.find('li').length > 0;
                    if (menuItem.hasItems) {
                        if (menuItem.element) {
                            $.jqx.aria($(menuItem.element), "aria-haspopup", true);
                            if (!menuItem.subMenuElement.id) menuItem.subMenuElement.id = $.jqx.utilities.createId();
                            $.jqx.aria($(menuItem.element), "aria-owns", menuItem.subMenuElement.id);
                        }
                    }
                }
            }
        },

        destroy: function () {
            $.jqx.utilities.resize(this.host, null, true);
            var wrapper = this.host.closest('div.jqx-menu-wrapper');
            wrapper.remove();
            $("#menuWrapper" + this.element.id).remove();
            var me = this;
            this.removeHandler($(document), 'mousedown.menu' + this.element.id, me._closeAfterClick);
            this.removeHandler($(document), 'mouseup.menu' + this.element.id, me._closeAfterClick);
            $.data(document.body, 'jqxMenuOldHost' + this.element.id, null);
            if (this.isTouchDevice()) {
                this.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.menu' + this.element.id, this._closeAfterClick, this);
            }

            if ($(window).off) {
                $(window).off('resize.menu' + me.element.id);
            }
            $.each(this.items, function () {
                var item = this;
                var $menuElement = $(item.element);
                me.removeHandler($menuElement, 'click');
                me.removeHandler($menuElement, 'selectstart');
                me.removeHandler($menuElement, 'mouseenter');
                me.removeHandler($menuElement, 'mouseleave');
                me.removeHandler($menuElement, 'mousedown');
                me.removeHandler($menuElement, 'mouseleave');
                var $submenu = $(item.subMenuElement);
                var $popupElement = $submenu.closest('div.jqx-menu-popup');
                $popupElement.remove();
                delete this.subMenuElement;
                delete this.element;
            });
            $.data(document.body, 'menuel', null);
            delete this.menuElements;
            this.items = new Array();
            delete this.items;
            var vars = $.data(this.element, "jqxMenu");
            if (vars) {
                delete vars.instance;
            }

            this.host.removeClass();
            this.host.remove();
            delete this.host;
            delete this.element;
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new jQuery.Event(evt);
            if (id == '2') {
                args = arg.item;
                args.owner = this;
                $.extend(event, arg.event);
                event.type = 'itemclick';
            }

            event.owner = this;
            event.args = args;
            var result = this.host.trigger(event);
            return result;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (value == oldvalue)
                return;

            if (key == 'touchMode') {
                this._isTouchDevice = null;
                object._render(value, oldvalue);
            }

            if (key == 'source') {
                if (object.source != null) {
                    var html = object.loadItems(object.source);
                    object.element.innerHTML = html;
                    var innerElement = object.host.find('ul:first');
                    if (innerElement.length > 0) {
                        object.refresh();
                        object._createMenu(innerElement[0]);
                        object._render();
                    }
                }
            }

            if (key == 'autoCloseOnClick') {
                if (value == false) {
                    object.removeHandler($(document), 'mousedown.menu' + this.element.id, object._closeAll);
                }
                else {
                    object.addHandler($(document), 'mousedown.menu' + this.element.id, object, object._closeAll);
                }
            }
            else if (key == 'mode' || key == 'width' || key == 'height' || key == 'showTopLevelArrows') {
                object.refresh();

                if (key == 'mode') {
                    object._render(value, oldvalue);
                }
                else object._applyOrientation();
            }
            else if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }
        }
    });
})(jQuery);

(function ($) {
    $.jqx._jqxMenu.jqxMenuItem = function(id, parentId, type) {
        var menuItem =
        {
            // gets the id.
    	    id: id,
            // gets the parent id.
            parentId: parentId,
            // gets the parent item instance.
            parentItem: null,
            // gets the anchor element.
            anchor: null,
            // gets the type
            type: type,
            // gets whether the item is disabled.
            disabled: false,
            // gets the item's level.
            level: 0,
            // gets a value whether the item is opened.
            isOpen: false,
            // has sub elements.
            hasItems: false,
            // li element
            element: null,
            subMenuElement: null,
            // arrow element.
            arrow: null,
            // left, right, center
            openHorizontalDirection: 'right',
            // up, down, center
            openVerticalDirection: 'down',
            closeOnClick: true
         }
        return menuItem;
    }; // 
})(jQuery);
