/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.extend($.jqx._jqxGrid.prototype, {
        _updatefilterrowui: function (forceupdateui) {
            var columnslength = this.columns.records.length;
            var left = 0;
            for (var j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                var width = columnrecord.width;
                if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;
                var tablecolumn = $(this.filterrow[0].cells[j]);
                tablecolumn.css('left', left);
                var updateui = true;
                if (tablecolumn.width() == width) {
                    updateui = false;
                }
                if (forceupdateui) {
                    updateui = true;
                }
                tablecolumn.width(width);
                tablecolumn[0].left = left;
                if (!(columnrecord.hidden && columnrecord.hideable)) {
                    left += width;
                }
                else {
                    tablecolumn.css('display', 'none');
                }
                if (!updateui)
                    continue;

                if (columnrecord.createfilterwidget && columnrecord.filtertype == 'custom') {
                    columnrecord.createfilterwidget(columnrecord, tablecolumn);
                }
                else {
                    if (columnrecord.filterable) {
                        var addtextfilter = function (me, tablecolumn) {
                            var textbox = $(tablecolumn.children()[0]);
                            textbox.width(width - 10);
                        }

                        switch (columnrecord.filtertype) {
                            case 'number':
                                $(tablecolumn.children()[0]).width(width);
                                tablecolumn.find('input').width(width - 30);
                                break;
                            case 'date':
                                if (this.host.jqxDateTimeInput) {
                                    $(tablecolumn.children()[0]).jqxDateTimeInput({ width: width - 10 });
                                }
                                else addtextfilter(this, tablecolumn);
                                break;
                            case 'textbox':
                            case 'default':
                                addtextfilter(this, tablecolumn);
                                break;
                            case 'list':
                            case 'checkedlist':
                                if (this.host.jqxDropDownList) {
                                    $(tablecolumn.children()[0]).jqxDropDownList({ width: width - 10 });
                                }
                                else addtextfilter(this, tablecolumn);
                                break;
                            case 'bool':
                            case 'boolean':
                                if (!this.host.jqxCheckBox) {
                                    addtextfilter(this, tablecolumn);
                                }
                                break;
                        }
                    }
                }
            }
            var tablerow = $(this.filterrow.children()[0]);
            tablerow.width(parseInt(left) + 2);
            tablerow.height(this.filterrowheight);
        },

        clearfilterrow: function () {
            this._disablefilterrow = true;
            if (!this.columns.records)
                return;

            var columnslength = this.columns.records.length;
            var left = 0;
            for (var j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                var tablecolumn = $(this.filterrow[0].cells[j]);

                if (columnrecord.filterable) {
                    var addtextfilter = function (me, tablecolumn) {
                        var textbox = $(tablecolumn.children()[0]);
                        textbox.val("");
                        if (textbox[0]) {
                            me["_oldWriteText" + textbox[0].id] = "";
                        }
                    }

                    switch (columnrecord.filtertype) {
                        case 'number':
                            tablecolumn.find('input').val("");
                            break;
                        case 'date':
                            if (this.host.jqxDateTimeInput) {
                                $(tablecolumn.children()[0]).jqxDateTimeInput('setDate', null);
                            }
                            else addtextfilter(this, tablecolumn);
                            break;
                        case 'textbox':
                        case 'default':
                            addtextfilter(this, tablecolumn);
                            break;
                        case 'list':
                            if (this.host.jqxDropDownList) {
                                $(tablecolumn.children()[0]).jqxDropDownList('clearSelection');
                            }
                            else addtextfilter(this, tablecolumn);
                            break;
                        case 'checkedlist':
                            if (this.host.jqxDropDownList) {
                                $(tablecolumn.children()[0]).jqxDropDownList('checkAll', false);
                            }
                            else addtextfilter(this, tablecolumn);
                            break;
                        case 'bool':
                        case 'boolean':
                            if (!this.host.jqxCheckBox) {
                                addtextfilter(this, tablecolumn);
                            }
                            else $(tablecolumn.children()[0]).jqxCheckBox({ checked: null });
                            break;
                    }

                }
            }
            this._disablefilterrow = false;
        },

        _applyfilterfromfilterrow: function () {
            if (this._disablefilterrow == true)
                return;

            var columnslength = this.columns.records.length;
            var me = this.that;

            for (var j = 0; j < columnslength; j++) {
                var filtergroup = new $.jqx.filter();
                var columnrecord = this.columns.records[j];
                if (!columnrecord.filterable) continue;
                if (columnrecord.datafield === null) continue;

                var type = me._getcolumntypebydatafield(columnrecord);
                var filtertype = me._getfiltertype(type);
                var filter_or_operator = 1;
                var hasFilter = true;
                var columnrecordfiltertype = columnrecord.filtertype;
                var addstringfilter = function (columnrecord, filtertype, filtergroup) {
                    var result = true;
                    if (columnrecord._filterwidget) {
                        var filtervalue = columnrecord._filterwidget.val();
                        if (filtervalue != "") {
                            var filtercondition = 'equal';
                            if (filtertype == 'stringfilter') {
                                var filtercondition = 'contains';
                            }
                            if (filtertype == "numericfilter") {
                                if (me.gridlocalization.decimalseparator == ',') {
                                    if (filtervalue.indexOf(me.gridlocalization.decimalseparator) >= 0) {
                                        filtervalue = filtervalue.replace(me.gridlocalization.decimalseparator, '.');
                                    }
                                }
                            }

                            if (filtertype != 'stringfilter') {
                                var hasoperator = 0;
                                if (filtervalue.indexOf('>') != -1) {
                                    filtercondition = "greater_than";
                                    hasoperator = 1;
                                }
                                if (filtervalue.indexOf('<') != -1) {
                                    filtercondition = "less_than";
                                    hasoperator = 1;
                                }
                                if (filtervalue.indexOf('=') != -1) {
                                    if (filtercondition == "greater_than") {
                                        filtercondition = "greater_than_or_equal";
                                        hasoperator = 2;
                                    }
                                    else if (filtercondition == "less_than") {
                                        filtercondition = "less_than_or_equal";
                                        hasoperator = 2;
                                    }
                                    else {
                                        filtercondition = "equal";
                                        hasoperator = 1;
                                    }
                                }
                                if (hasoperator != 0) {
                                    filtervalue = filtervalue.substring(hasoperator);
                                    if (filtervalue.length < 1) return false;
                                }
                            }

                            if (columnrecord.filtercondition != undefined) filtercondition = columnrecord.filtercondition;

                            if (filtertype == "datefilter") {
                                var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition, null, columnrecord.cellsformat, me.gridlocalization);
                            }
                            else {
                                var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
                            }

                            filtergroup.addfilter(filter_or_operator, filter);
                        }
                        else result = false;
                    }
                    return result;
                }

                switch (columnrecord.filtertype) {
                    case 'date':
                        if (columnrecord._filterwidget.jqxDateTimeInput) {
                            var filtervalue = columnrecord._filterwidget.jqxDateTimeInput('getRange');
                            if (filtervalue != null && filtervalue.from != null && filtervalue.to != null) {
                                var filtercondition = 'GREATER_THAN_OR_EQUAL';
                                var date1 = new Date(0);
                                date1.setHours(0);
                                date1.setFullYear(filtervalue.from.getFullYear(), filtervalue.from.getMonth(), filtervalue.from.getDate());
                                var date2 = new Date(0);
                                date2.setHours(0);
                                date2.setFullYear(filtervalue.to.getFullYear(), filtervalue.to.getMonth(), filtervalue.to.getDate());
                                date2.setHours(filtervalue.to.getHours());
                                date2.setMinutes(filtervalue.to.getMinutes());
                                date2.setSeconds(filtervalue.to.getSeconds());

                                var filter1 = filtergroup.createfilter(filtertype, date1, filtercondition);
                                filtergroup.addfilter(0, filter1);

                                var filtercondition2 = 'LESS_THAN_OR_EQUAL';
                                var filter2 = filtergroup.createfilter(filtertype, date2, filtercondition2);
                                filtergroup.addfilter(0, filter2);
                            }
                            else hasFilter = false;
                        }
                        else {
                            hasFilter = addstringfilter(columnrecord, filtertype, filtergroup);
                        }
                        break;
                    case 'number':
                        if (columnrecord._filterwidget) {
                            var filtervalue = columnrecord._filterwidget.find('input').val();
                            if (me.gridlocalization.decimalseparator == ',') {
                                if (filtervalue.indexOf(me.gridlocalization.decimalseparator) >= 0) {
                                    filtervalue = filtervalue.replace(me.gridlocalization.decimalseparator, '.');
                                }
                            }
                            var index = columnrecord._filterwidget.find('.filter').jqxDropDownList('selectedIndex');
                            var condition = filtergroup.getoperatorsbyfiltertype(filtertype)[index];
                            if (me.updatefilterconditions) {
                                var newfilterconditions = me.updatefilterconditions(filtertype, filtergroup.getoperatorsbyfiltertype(filtertype));
                                if (newfilterconditions != undefined) {
                                    filtergroup.setoperatorsbyfiltertype(filtertype, newfilterconditions);
                                }
                                var condition = filtergroup.getoperatorsbyfiltertype(filtertype)[index];
                            }
                            var nullcondition1 = condition == "NULL" || condition == "NOT_NULL";
                            var emptycondition1 = condition == "EMPTY" || condition == "NOT_EMPTY";
                            if (filtervalue != undefined && filtervalue.length > 0 || nullcondition1 || emptycondition1) {
                                filter1 = filtergroup.createfilter(filtertype, new Number(filtervalue), condition, null, columnrecord.cellsformat, me.gridlocalization);
                                filtergroup.addfilter(0, filter1);
                            }
                            else hasFilter = false;
                        }
                        else {
                            hasFilter = false;
                        }
                        break;
                    case 'textbox':
                    case 'default':
                        hasFilter = addstringfilter(columnrecord, filtertype, filtergroup);
                        break;
                    case 'bool':
                    case 'boolean':
                        if (columnrecord._filterwidget.jqxCheckBox) {
                            var filtervalue = columnrecord._filterwidget.jqxCheckBox('checked');
                            if (filtervalue != null) {
                                var filtercondition = 'equal';
                                var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
                                filtergroup.addfilter(filter_or_operator, filter);
                            }
                            else hasFilter = false;
                        } else hasFilter = addstringfilter(columnrecord, filtertype, filtergroup);
                        break;
                    case 'list':
                        var widget = columnrecord._filterwidget.jqxDropDownList('listBox');
                        if (widget.selectedIndex > 0) {
                            var selectedItem = widget.getItem(widget.selectedIndex);
                            var filtervalue = selectedItem.label;
                            var filtercondition = 'equal';
                            if (filtervalue === "") {
                                filtercondition = 'NULL';
                            }
                            var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
                            filtergroup.addfilter(filter_or_operator, filter);
                        } else {
                            hasFilter = false;
                        }
                        break;
                    case 'checkedlist':
                        if (columnrecord._filterwidget.jqxDropDownList) {
                            var widget = columnrecord._filterwidget.jqxDropDownList('listBox');
                            var checkedItems = widget.getCheckedItems();
                            if (checkedItems.length == 0) {
                                for (var i = 1; i < widget.items.length; i++) {
                                    var filtervalue = widget.items[i].label;
                                    var filtercondition = 'not_equal';
                                    if (filtervalue === "") {
                                        filtercondition = 'NULL';
                                    }
                                    var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
                                    filtergroup.addfilter(0, filter);
                                }

                                hasFilter = true;
                            }
                            else {
                                if (checkedItems.length != widget.items.length) {
                                    for (var i = 0; i < checkedItems.length; i++) {
                                        var filtervalue = checkedItems[i].label;
                                        var filtercondition = 'equal';
                                        if (filtervalue === "") {
                                            filtercondition = 'NULL';
                                        }
                                        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
                                        filtergroup.addfilter(filter_or_operator, filter);
                                    }
                                }
                                else hasFilter = false;
                            }
                        }
                        else hasFilter = addstringfilter(columnrecord, filtertype, filtergroup);
                        break;
                }

                if (!this._loading) {
                    if (hasFilter) {
                        this.addfilter(columnrecord.displayfield, filtergroup, false);
                    }
                    else {
                        this.removefilter(columnrecord.displayfield, false);
                    }
                }
            }
            if (!this._loading) {
                this.applyfilters('filterrow');
            }
        },

        _updatefilterrow: function () {
            var tablerow = $('<div style="position: relative;" id="row00' + this.element.id + '"></div>');
            var left = 0;
            var columnslength = this.columns.records.length;
            var cellclass = this.toThemeProperty('jqx-grid-cell');
            cellclass += ' ' + this.toThemeProperty('jqx-grid-cell-pinned');
            cellclass += ' ' + this.toThemeProperty('jqx-grid-cell-filter-row');
            var zindex = columnslength + 10;
            var cells = new Array();
            var me = this.that;
            this.filterrow[0].cells = cells;
            tablerow.height(this.filterrowheight);
            this.filterrow.children().detach();
            this.filterrow.append(tablerow);
            if (!this._filterrowcache)
                this._filterrowcache = new Array();

            this._initcolumntypes();

            var usefromcache = false;
            var _newfilterrowcache = new Array();
            for (var j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                var width = columnrecord.width;
                if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;

                var tablecolumn = $('<div style="overflow: hidden; position: absolute; height: 100%;" class="' + cellclass + '"></div>');
                tablerow.append(tablecolumn);
                tablecolumn.css('left', left);
                if (this.rtl) {
                    tablecolumn.css('z-index', zindex++);
                    tablecolumn.css('border-left-width', '1px');
                }
                else {
                    tablecolumn.css('z-index', zindex--);
                }
                tablecolumn.width(width);
                tablecolumn[0].left = left;
                if (!(columnrecord.hidden && columnrecord.hideable)) {
                    left += width;
                }
                else {
                    tablecolumn.css('display', 'none');
                }
                cells[cells.length] = tablecolumn[0];

                var addFilterWidget = true;
                if (!this.rtl) {
                    if (this.groupable) {
                        var detailsoffset = (this.showrowdetailscolumn && this.rowdetails) ? 1 : 0;
                        if (this.groups.length + detailsoffset > j) {
                            addFilterWidget = false;
                        }
                    }
                    if (this.showrowdetailscolumn && this.rowdetails && j == 0) addFilterWidget = false;
                }
                else {
                    if (this.groupable) {
                        var detailsoffset = (this.showrowdetailscolumn && this.rowdetails) ? 1 : 0;
                        if (this.groups.length + detailsoffset + j > columnslength - 1) {
                            addFilterWidget = false;
                        }
                    }
                    if (this.showrowdetailscolumn && this.rowdetails && j == columnslength-1) addFilterWidget = false;
                }

                if (addFilterWidget) {
                    if (columnrecord.filtertype == 'custom' && columnrecord.createfilterwidget) {
                        var applyfilter = function () {
                            me._applyfilterfromfilterrow();
                        }
                        columnrecord.createfilterwidget(columnrecord, tablecolumn, applyfilter);
                    }
                    else {
                        if (columnrecord.filterable) {
                            if (this._filterrowcache[columnrecord.datafield]) {
                                usefromcache = true;
                                tablecolumn.append(this._filterrowcache[columnrecord.datafield]);
                                columnrecord._filterwidget = this._filterrowcache[columnrecord.datafield];
                            }
                            else {
                                this._addfilterwidget(columnrecord, tablecolumn, width);
                                _newfilterrowcache[columnrecord.datafield] = columnrecord._filterwidget;
                            }
                        }
                    }
                }
            }
            this._filterrowcache = _newfilterrowcache;
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                tablerow.css('z-index', zindex--);
            }

            tablerow.width(parseInt(left) + 2);
            this.filterrow.addClass(cellclass);
            this.filterrow.css('border-top-width', '1px');
            this.filterrow.css('border-right-width', '0px');
            if (usefromcache) {
                this._updatefilterrowui(true);
            }
        },

        _addfilterwidget: function (columnrecord, tablecolumn, width) {
            var me = this.that;
            var filtervalue = "";
            for (var f = 0; f < me.dataview.filters.length; f++) {
                var currentfilter = me.dataview.filters[f];
                if (currentfilter.datafield && currentfilter.datafield == columnrecord.datafield) {
                    filtervalue = currentfilter.filter.getfilters()[0].value;
                    break;
                }
            }

            var addtextfilter = function (me, tablecolumn) {
                var textbox = $('<input autocomplete="off" type="textarea"/>');
                textbox[0].id = $.jqx.utilities.createId();
                textbox.addClass(me.toThemeProperty('jqx-widget'));
                textbox.addClass(me.toThemeProperty('jqx-input'));
                textbox.addClass(me.toThemeProperty('jqx-rc-all'));
                textbox.addClass(me.toThemeProperty('jqx-widget-content'));
                if (me.rtl) {
                    textbox.css('direction', 'rtl');
                }

                textbox.appendTo(tablecolumn);
                textbox.width(width - 10);
                textbox.height(me.filterrowheight - 10);
                textbox.css('margin', '4px');
                if (columnrecord.createfilterwidget) {
                    columnrecord.createfilterwidget(columnrecord, tablecolumn, textbox);
                }
                columnrecord._filterwidget = textbox;

                textbox.focus(function () {
                    me.content[0].scrollLeft = 0;
                    setTimeout(function () {
                        me.content[0].scrollLeft = 0;
                    }, 10);

                    me.focusedfilter = textbox;
                    textbox.addClass(me.toThemeProperty('jqx-fill-state-focus'));
                    return false;
                });
                textbox.blur(function () {
                    textbox.removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                });

                
                textbox.keydown(function (event) {
                    if (event.keyCode == '13')
                        me._applyfilterfromfilterrow();
                    if (textbox[0]._writeTimer) clearTimeout(textbox[0]._writeTimer);
                    textbox[0]._writeTimer = setTimeout(function () {
                        if (!me._loading) {
                            if (me["_oldWriteText" + textbox[0].id] != textbox.val()) {
                                me._applyfilterfromfilterrow();
                                me["_oldWriteText" + textbox[0].id] = textbox.val();
                            }
                        }
                    }, 800);
                    me.focusedfilter = textbox;
                });
                me.host.removeClass('jqx-disableselect');
                me.content.removeClass('jqx-disableselect');
                textbox.val(filtervalue);
            }

            if (columnrecord.datatype != null) {
                if (columnrecord.filtertype == "number") {
                    if (columnrecord.datatype == "string" || columnrecord.datatype == "date" || columnrecord.datatype == "bool") {
                        columnrecord.filtertype = "textbox";
                    }
                }
                if (columnrecord.filtertype == "date") {
                    if (columnrecord.datatype == "string" || columnrecord.datatype == "number" || columnrecord.datatype == "bool") {
                        columnrecord.filtertype = "textbox";
                    }
                }
                if (columnrecord.filtertype == "bool") {
                    if (columnrecord.datatype == "string" || columnrecord.datatype == "number" || columnrecord.datatype == "date") {
                        columnrecord.filtertype = "textbox";
                    }
                }
            }

            switch (columnrecord.filtertype) {
                case 'number':
                    var numberwidget = $("<div></div>");
                    numberwidget.width(tablecolumn.width());
                    numberwidget.height(this.filterrowheight);
                    tablecolumn.append(numberwidget);
                    var width = tablecolumn.width() - 20;
                    var addInput = function (element, width, sign) {
                        var textbox = $('<input style="float: left;" autocomplete="off" type="textarea"/>');
                        if (me.rtl) {
                            textbox.css('float', 'right');
                            textbox.css('direction', 'rtl');
                        }
                        textbox[0].id = $.jqx.utilities.createId();
                        textbox.addClass(me.toThemeProperty('jqx-widget'));
                        textbox.addClass(me.toThemeProperty('jqx-input'));
                        textbox.addClass(me.toThemeProperty('jqx-rc-all'));
                        textbox.addClass(me.toThemeProperty('jqx-widget-content'));
                        textbox.appendTo(element);
                        textbox.width(width - 10);
                        textbox.height(me.filterrowheight - 10);
                        textbox.css('margin', '4px');
                        textbox.css('margin-right', '2px');
                        textbox.focus(function () {
                            me.focusedfilter = textbox;
                            textbox.addClass(me.toThemeProperty('jqx-fill-state-focus'));
                        });
                        textbox.blur(function () {
                            textbox.removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                        });
                        textbox.keydown(function (event) {
                            if (event.keyCode == '13')
                                me._applyfilterfromfilterrow();
                            if (textbox[0]._writeTimer) clearTimeout(textbox[0]._writeTimer);
                            textbox[0]._writeTimer = setTimeout(function () {
                                if (!me._loading) {
                                    if (me["_oldWriteText" + textbox[0].id] != textbox.val()) {
                                        me._applyfilterfromfilterrow();
                                        me["_oldWriteText" + textbox[0].id] = textbox.val();
                                    }
                                }
                            }, 800);
                            me.focusedfilter = textbox;
                        });
                        textbox.val(filtervalue);
                        return textbox;
                    }

                    addInput(numberwidget, width);
                    var source = me._getfiltersbytype('number');
                    var dropdownlist = $("<div class='filter' style='float: left;'></div>");
                    dropdownlist.css('margin-top', '4px');
                    dropdownlist.appendTo(numberwidget);
                    if (me.rtl) {
                        dropdownlist.css('float', 'right');
                    }

                    var selectedIndex = 0;
                    if (columnrecord.filtercondition != null) {
                        var newIndex = source.indexOf(columnrecord.filtercondition);
                        if (newIndex != -1)
                            selectedIndex = newIndex;
                    }

                    dropdownlist.jqxDropDownList({touchMode: me.touchmode, rtl: me.rtl, dropDownHorizontalAlignment: 'right', enableBrowserBoundsDetection: true, selectedIndex: selectedIndex, width: 18, height: 21, dropDownHeight: 150, dropDownWidth: 170, source: source, theme: me.theme });
                    dropdownlist.jqxDropDownList({
                        selectionRenderer: function (element) {
                            return "";
                        }
                    });
                    dropdownlist.jqxDropDownList('setContent', "");
                    dropdownlist.find('.jqx-dropdownlist-content').hide();
                    if (columnrecord.createfilterwidget) {
                        columnrecord.createfilterwidget(columnrecord, tablecolumn, numberwidget);
                    }
                    columnrecord._filterwidget = numberwidget;

                    var lastSelectedItem = null;
                    this.addHandler(dropdownlist, 'select', function () {
                        var selectedItem = dropdownlist.jqxDropDownList('getSelectedItem').label;
                        if (columnrecord._filterwidget.find('input').val().length > 0 && !me.refreshingfilter) {
                            me._applyfilterfromfilterrow();
                        }
                        else if (columnrecord._filterwidget.find('input').val().length == 0 && !me.refreshingfilter) {
                            if (lastSelectedItem == 'null' || lastSelectedItem == 'not null' || selectedItem == 'null' || selectedItem == 'not null') {
                                me._applyfilterfromfilterrow();
                            }
                        }
                        lastSelectedItem = selectedItem;
                    });
                    break;
                case 'textbox':
                case 'default':
                default:
                    addtextfilter(this, tablecolumn);
                    break;
                case 'none':
                    break;
                case 'date':
                    if (this.host.jqxDateTimeInput) {
                        var datetimeinput = $("<div></div>");
                        datetimeinput.css('margin', '4px');
                        datetimeinput.appendTo(tablecolumn);
                        var localization = { calendar: this.gridlocalization, todayString: this.gridlocalization.todaystring, clearString: this.gridlocalization.clearstring };
                        datetimeinput.jqxDateTimeInput({localization: localization, rtl: me.rtl, showFooter: true, formatString: columnrecord.cellsformat, selectionMode: 'range', value: null, theme: this.theme, width: width - 10, height: this.filterrowheight - 10 });
                        if (columnrecord.createfilterwidget) {
                            columnrecord.createfilterwidget(columnrecord, tablecolumn, datetimeinput);
                        }
                        columnrecord._filterwidget = datetimeinput;
                        this.addHandler(datetimeinput, 'valuechanged', function (event) {
                            if (!me.refreshingfilter) {
                                me._applyfilterfromfilterrow();
                                me.focusedfilter = null;
                            }
                        });
                    }
                    else addtextfilter(this, tablecolumn);
                    break;
                case 'list':
                case 'checkedlist':
                    if (this.host.jqxDropDownList) {
                        var dataadapter = this._getfilterdataadapter(columnrecord);

                        var autoheight = false;
                        var dropdownlist = $("<div></div>");
                        dropdownlist.css('margin', '4px');
                        var datafield = columnrecord.datafield;
                        var checkboxes = columnrecord.filtertype == 'checkedlist' ? true : false;
                        var dropDownWidth = width < 150 ? 220 : 'auto';
                        dataadapter.dataBind();
                        var dropdownitems = dataadapter.records;
                        var autoDropDownHeight = dropdownitems.length < 8 ? true : false;
                        autoheight = autoDropDownHeight;
                        dropdownlist.appendTo(tablecolumn);
                        dropdownlist.jqxDropDownList({ touchMode: me.touchmode, rtl: me.rtl, checkboxes: checkboxes, dropDownWidth: dropDownWidth, source: dataadapter.records, autoDropDownHeight: autoDropDownHeight, theme: this.theme, width: width - 10, height: this.filterrowheight - 10, displayMember: columnrecord.displayfield, valueMember: datafield });
                        var listbox = dropdownlist.jqxDropDownList('listBox');
                        if (checkboxes) {
                            dropdownlist.jqxDropDownList({
                                selectionRenderer: function () {
                                    return me.gridlocalization.filterselectstring;
                                }
                            });
                            var spanElement = $('<span style="top: 2px; position: relative; color: inherit; border: none; background-color: transparent;">' + me.gridlocalization.filterselectstring + '</span>');
                            spanElement.addClass(this.toThemeProperty('jqx-item'));
                            if (listbox != undefined) {
                                if (!autoheight) {
                                    listbox.host.height(200);
                                }
                                listbox.insertAt(me.gridlocalization.filterselectallstring, 0);
                                dropdownlist.jqxDropDownList('setContent', spanElement);
                                var handleCheckChange = true;
                                var checkedItems = new Array();
                                listbox.checkAll(false);
                                me.addHandler(listbox.host, 'checkChange', function (event) {
                                    dropdownlist[0]._selectionChanged = true;
                                    if (!handleCheckChange)
                                        return;

                                    if (event.args.label != me.gridlocalization.filterselectallstring) {
                                        handleCheckChange = false;
                                        listbox.host.jqxListBox('checkIndex', 0, true, false);
                                        var checkedItems = listbox.host.jqxListBox('getCheckedItems');
                                        var items = listbox.host.jqxListBox('getItems');

                                        if (checkedItems.length == 1) {
                                            listbox.host.jqxListBox('uncheckIndex', 0, true, false);
                                        }
                                        else if (items.length != checkedItems.length) {
                                            listbox.host.jqxListBox('indeterminateIndex', 0, true, false);
                                        }
                                        handleCheckChange = true;
                                    }
                                    else {
                                        handleCheckChange = false;
                                        if (event.args.checked) {
                                            listbox.host.jqxListBox('checkAll', false);
                                        }
                                        else {
                                            listbox.host.jqxListBox('uncheckAll', false);
                                        }

                                        handleCheckChange = true;
                                    }
                                });
                            }
                        }
                        else {
                            listbox.insertAt({ label: this.gridlocalization.filterchoosestring, value: "" }, 0);
                            dropdownlist.jqxDropDownList({ selectedIndex: 0 });
                        }

                        if (columnrecord.createfilterwidget) {
                            columnrecord.createfilterwidget(columnrecord, tablecolumn, dropdownlist);
                        }
                        columnrecord._filterwidget = dropdownlist;

                        var dropdownlistWrapper = dropdownlist.jqxDropDownList('dropdownlistWrapper');
                        if (columnrecord.filtertype == 'list') {
                            this.addHandler(dropdownlist, 'select', function (event) {
                                if (!me.refreshingfilter) {
                                    if (event.args && event.args.type != 'none') {
                                        me._applyfilterfromfilterrow();
                                        me.focusedfilter = null;
                                    }
                                }
                            });
                        }
                        else {
                            this.addHandler(dropdownlist, 'close', function (event) {
                                if (dropdownlist[0]._selectionChanged) {
                                    me._applyfilterfromfilterrow();
                                    me.focusedfilter = null;
                                    dropdownlist[0]._selectionChanged = false;
                                }
                            });
                        }
                    }
                    else addtextfilter(this, tablecolumn);
                    break;
                case 'bool':
                case 'boolean':
                    if (this.host.jqxCheckBox) {
                        var checkbox = $('<div tabIndex=0 style="opacity: 0.99; position: absolute; top: 50%; left: 50%; margin-top: -7px; margin-left: -10px;"></div>');
                        checkbox.appendTo(tablecolumn);
                        checkbox.jqxCheckBox({ enableContainerClick: false, animationShowDelay: 0, animationHideDelay: 0, hasThreeStates: true, theme: this.theme, checked: null });
                        if (columnrecord.createfilterwidget) {
                            columnrecord.createfilterwidget(columnrecord, tablecolumn, checkbox);
                        }
                        if (filtervalue === true || filtervalue == "true") {
                            checkbox.jqxCheckBox({ checked: true });
                        }
                        else if (filtervalue === false || filtervalue == "false") {
                            checkbox.jqxCheckBox({ checked: false });
                        }

                        columnrecord._filterwidget = checkbox;
                        this.addHandler(checkbox, 'change', function (event) {
                            if (!me.refreshingfilter) {
                                if (event.args) {
                                    me.focusedfilter = null;
                                    me._applyfilterfromfilterrow();
                                }
                            }
                        });
                    }
                    else addtextfilter(this, tablecolumn);
                    break;
            }
        },

        _getfilterdataadapter: function (columnrecord) {
            var isdataadapter = this.source._source ? true : false;

            if (!isdataadapter) {
                dataadapter = new $.jqx.dataAdapter(this.source,
                            {
                                autoBind: false,
                                uniqueDataFields: [columnrecord.displayfield],
                                autoSort: true,
                                autoSortField: columnrecord.displayfield,
                                async: false
                            });
            }
            else {
                var dataSource =
                {
                    localdata: this.source.records,
                    datatype: this.source.datatype,
                    async: false
                }
                var that = this;
                dataadapter = new $.jqx.dataAdapter(dataSource,
                {
                    autoBind: false,
                    autoSort: true,
                    autoSortField: columnrecord.displayfield,
                    async: false,
                    uniqueDataFields: [columnrecord.displayfield],
                    beforeLoadComplete: function (records) {
                        var data = new Array();
                        if (columnrecord.cellsformat) {
                            var columntype = that._getcolumntypebydatafield(columnrecord);

                            for (var i = 0; i < records.length; i++) {
                                data.push(records[i]);
                                var value = records[i][columnrecord.displayfield];
                                records[i][columnrecord.displayfield + "JQValue"] = value;
                                if (columntype === "date") {
                                    records[i][columnrecord.displayfield] = dataadapter.formatDate(value, columnrecord.cellsformat, that.gridlocalization);
                                }
                                else if (columntype === "number" || columntype === "float" || columntype === "int") {
                                    records[i][columnrecord.displayfield] = dataadapter.formatNumber(value, columnrecord.cellsformat, that.gridlocalization);
                                }
                            }
                            return data;
                        }
                        else return records;
                    }
                });
            }
            if (columnrecord.filteritems && columnrecord.filteritems.length > 0) {
                var dataSource =
                {
                    localdata: columnrecord.filteritems,
                    datatype: this.source.datatype,
                    async: false
                }

                dataadapter = new $.jqx.dataAdapter(dataSource,
                {
                    autoBind: false,
                    async: false
                });
            }
            else if (columnrecord.filteritems) {
                if (columnrecord.filteritems._source) {
                    columnrecord.filteritems._options.autoBind = false;
                    columnrecord.filteritems._options.async = false;

                    return columnrecord.filteritems;
                }
                else if ($.isFunction(columnrecord.filteritems)) {
                    return columnrecord.filteritems();
                }
            }

            return dataadapter;
        },

        refreshfilterrow: function () {
            if (!this.showfilterrow) {
                return;
            }

            this.refreshingfilter = true;
            this._updatefilterrowui();
            this._updatelistfilters(true, true);
            var me = this.that;
            var columnslength = this.columns.records.length;
            for (var j = 0; j < columnslength; j++) {
                var column = this.columns.records[j];
                if (column.filterable) {
                    if (column.filter) {
                        var filters = column.filter.getfilters();
                        if (filters.length > 0) {
                            var value = filters[0].value;
                            var widget = column._filterwidget;
                            var tablecolumn = column._filterwidget.parent();
                            if (widget != null) {
                                switch (column.filtertype) {
                                    case 'number':
                                        tablecolumn.find('input').val(value);
                                        if (this.host.jqxDropDownList) {
                                            var conditions = column.filter.getoperatorsbyfiltertype('numericfilter');
                                            widget.find('.filter').jqxDropDownList('selectIndex', conditions.indexOf(filters[0].condition));
                                        }
                                        break;
                                    case 'date':
                                        if (this.host.jqxDateTimeInput) {
                                            var value = column.filter.getfilterat(0).filtervalue;
                                            if (value != undefined) {
                                                if (column.filter.getfilterat(1)) {
                                                    var value2 = column.filter.getfilterat(1).filtervalue;
                                                }
                                                else {
                                                    value2 = value;
                                                }

                                                $(tablecolumn.children()[0]).jqxDateTimeInput('setRange', new Date(value), new Date(value2));
                                            }
                                        }
                                        else {
                                            widget.val(value);
                                        }
                                        break;
                                    case 'textbox':
                                    case 'default':
                                        widget.val(value);
                                        me["_oldWriteText" + widget[0].id] = value;
                                        break;
                                    case 'bool':
                                    case 'boolean':
                                        if (!this.host.jqxCheckBox) {
                                            widget.val(value);
                                        }
                                        else $(tablecolumn.children()[0]).jqxCheckBox({ checked: value });
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            this.refreshingfilter = false;
        },

        _destroyedfilters: function ()
        {
                var me = this.that;
                var columnslength = this.columns.records.length;
                for (var j = 0; j < columnslength; j++) {
                    var columnrecord = this.columns.records[j];
                    if (columnrecord.filterable) {
                        var widget = columnrecord._filterwidget;
                        if (columnrecord.filtertype == 'list' || columnrecord.filtertype == 'checkedlist') {
                            this.removeHandler(widget, 'select');
                            this.removeHandler(widget, 'close');
                            widget.jqxDropDownList('destroy');
                        }
                        else if (columnrecord.filtertype == 'date') {
                            this.removeHandler(widget, 'valuechanged');
                            widget.jqxDateTimeInput('destroy');
                        }
                        else if (columnrecord.filtertype == 'bool') {
                            this.removeHandler(widget, 'change');
                            widget.jqxCheckBox('destroy');
                        }
                        else if (columnrecord.filtertype == 'number') {
                            var input = widget.find('.jqx-input');
                            this.removeHandler(input, 'keydown');
                            var dropdownlist = $(widget.children()[1]);
                            dropdownlist.jqxDropDownList('destroy');
                        }
                        else {
                            this.removeHandler(widget, 'keydown');
                        }
                        widget.remove();
                    }
                }
        },

        _updatelistfilters: function (endcelledit, updatecheckstates) {
            var me = this.that;
            var columnslength = this.columns.records.length;
            for (var j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                if (columnrecord.filterable) {
                    if (columnrecord.filtertype == 'list' || columnrecord.filtertype == 'checkedlist') {
                        var dropdownlist = columnrecord._filterwidget;
                        if (!endcelledit) {
                            if (columnrecord.filter == undefined) {
                                dropdownlist.jqxDropDownList('renderSelection');
                                continue;
                            }
                        }
                        else {
                            var dataadapter = this._getfilterdataadapter(columnrecord);
                            dropdownlist.jqxDropDownList({ source: dataadapter });
                            var dropdownitems = dropdownlist.jqxDropDownList('getItems');
                            var equalSources = true;
                            if (dropdownitems.length != dataadapter.records.length + 1)
                                equalSources = false;

                            if (equalSources) {
                                for (var i = 1; i < dropdownitems.length; i++) {
                                    if (dropdownitems[i].label != dataadapter.records[i - 1][columnrecord.displayfield]) {
                                        equalSources = false;
                                        break;
                                    }
                                }
                            }
                            if (equalSources && !updatecheckstates)
                                continue;
                        }

                        var checkboxes = columnrecord.filtertype == 'checkedlist' ? true : false;
                        var dropdownitems = dropdownlist.jqxDropDownList('getItems');
                        var listbox = dropdownlist.jqxDropDownList('listBox');
                        dropdownlist.jqxDropDownList('dataBind');
                     
                        if (checkboxes) {
                            dropdownlist.jqxDropDownList({
                                selectionRenderer: function () {
                                    return me.gridlocalization.filterselectstring;
                                }
                            });
                            listbox.insertAt(this.gridlocalization.filterselectallstring, 0);
                            dropdownlist.jqxDropDownList('setContent', this.gridlocalization.filterselectstring);
                            listbox.checkAll(false);
                            if (columnrecord.filter) {
                                var filters = columnrecord.filter.getfilters();

                                for (var i = 0; i < listbox.items.length; i++) {
                                    var label = listbox.items[i].label;
                                    $.each(filters, function () {
                                        if (this.condition == "NOT_EQUAL") {
                                            if (label == this.value) {
                                                listbox.uncheckIndex(i, false, false);
                                            }
                                            else {
                                                listbox.checkIndex(i, false, false);
                                            }
                                        }
                                        else if (this.condition == "EQUAL") {
                                            if (label == this.value) {
                                                listbox.checkIndex(i, false, false);
                                            }
                                            else {
                                                listbox.uncheckIndex(i, false, false);
                                            }
                                        }
                                    });
                                }
                                listbox._updateCheckedItems();
                                var checkedItemsLength = listbox.getCheckedItems().length;
                                if (listbox.items.length != checkedItemsLength && checkedItemsLength > 0) {
                                    listbox.host.jqxListBox('indeterminateIndex', 0, true, false);
                                }
                            }
                        }
                        else {
                            listbox.insertAt({ label: this.gridlocalization.filterchoosestring, value: "" }, 0);
                            dropdownlist.jqxDropDownList({ selectedIndex: 0 });
                            if (columnrecord.filter) {
                                var filters = columnrecord.filter.getfilters();
                                var selectedIndex = -1;
                                for (var i = 0; i < listbox.items.length; i++) {
                                    var label = listbox.items[i].label;
                                    $.each(filters, function () {
                                        if (this.condition == "NOT_EQUAL") return true;
                                        if (label == this.value) {
                                            selectedIndex = i;
                                            return false;
                                        }
                                    });
                                }
                                if (selectedIndex != -1) {
                                    listbox.selectIndex(selectedIndex);
                                }
                            }
                        }
                        if (dropdownitems.length < 8) {
                            dropdownlist.jqxDropDownList('autoDropDownHeight', true);
                        }
                        else {
                            dropdownlist.jqxDropDownList('autoDropDownHeight', false);
                        }
                    }
                }
            }
        },

        _renderfiltercolumn: function () {
            var self = this.that;

            if (this.filterable) {
                $.each(this.columns.records, function (i, value) {
                    if (self.autoshowfiltericon) {
                        if (this.filter) {
                            $(this.filtericon).show();
                        }
                        else {
                            $(this.filtericon).hide();
                        }
                    }
                    else {
                        if (this.filterable) {
                            $(this.filtericon).show();
                        }
                    }
                });
            }
        },

        _initcolumntypes: function()
        {
            if (this.columns && this.columns.records) {
                var datafields = this.source._source.datafields;
                if (datafields) {
                    for (var i = 0; i < this.columns.records.length; i++) {
                        var column = this.columns.records[i];
                        if (column.datatype) continue;
                        var foundType = "";
                        $.each(datafields, function () {
                            if (this.name == column.displayfield) {
                                if (this.type) {
                                    foundType = this.type;
                                }
                                return false;
                            }
                        });
                        if (foundType != "")
                            column.datatype = foundType;
                        else column.datatype = "";
                    }
                }
            }
        },

        _getcolumntypebydatafield: function (column) {
            var me = this.that;
            var type = 'string';
            var datafields = me.source.datafields || ((me.source._source) ? me.source._source.datafields : null);

            if (datafields) {
                var foundType = "";
                $.each(datafields, function () {
                    if (this.name == column.displayfield) {
                        if (this.type) {
                            foundType = this.type;
                        }
                        return false;
                    }
                });
                if (foundType)
                    return foundType;
            }

            if (column != null) {
                if (this.dataview.cachedrecords == undefined) {
                    return type;
                }

                var cell = null;

                if (!this.virtualmode) {
                    if (this.dataview.cachedrecords.length == 0)
                        return type;

                    cell = this.dataview.cachedrecords[0][column.displayfield];
                    if (cell != null && cell.toString() == "") {
                        return "string";
                    }
                }
                else {
                    $.each(this.dataview.cachedrecords, function () {
                        cell = this[column.displayfield];
                        return false;
                    });
                }

                if (cell != null) {
                    if (typeof cell == 'boolean') {
                        type = 'boolean';
                    }
                    else if ($.jqx.dataFormat.isNumber(cell)) {
                        type = 'number';
                    }
                    else {
                        var tmpvalue = new Date(cell);

                        if (tmpvalue.toString() == 'NaN' || tmpvalue.toString() == "Invalid Date") {
                            if ($.jqx.dataFormat) {
                                tmpvalue = $.jqx.dataFormat.tryparsedate(cell);
                                if (tmpvalue != null) {
                                    if (tmpvalue && tmpvalue.getFullYear()) {
                                        if (tmpvalue.getFullYear() == 1970 && tmpvalue.getMonth() == 0 && tmpvalue.getDate() == 1) {
                                            var num = new Number(cell);
                                            if (!isNaN(num))
                                                return 'number';

                                            return 'string';
                                        }
                                    }

                                    return 'date';
                                }
                                else {
                                    type = 'string';
                                }
                            }
                            else type = 'string';
                        }
                        else {
                            type = 'date';
                        }
                    }
                }
            }
            return type;
        },

        _getfiltersbytype: function (type) {
            var me = this.that;
            var source = '';
            switch (type) {
                case "number":
                case "float":
                case "int":
                    source = me.gridlocalization.filternumericcomparisonoperators;
                    break;
                case "date":
                    source = me.gridlocalization.filterdatecomparisonoperators;
                    break;
                case "boolean":
                case "bool":
                    source = me.gridlocalization.filterbooleancomparisonoperators;
                    break;
                case "string":
                default:
                    source = me.gridlocalization.filterstringcomparisonoperators;
                    break;

            }
            return source;
        },

        _updatefilterpanel: function (me, element, column) {
            if (me == null || me == undefined) me = this;
            var type = me._getcolumntypebydatafield(column);
            var source = me._getfiltersbytype(type);

            if (!me.host.jqxDropDownList) {
                throw new Error('jqxGrid: Missing reference to jqxdropdownlist.js.');
                return;
            }

            var $element = $(element);
            var clearbutton = $element.find('#filterclearbutton' + me.element.id);
            var filterbutton = $element.find('#filterbutton' + me.element.id);
            var condition = $element.find('#filter1' + me.element.id);
            var filteroperator = $element.find('#filter2' + me.element.id);
            var condition2 = $element.find('#filter3' + me.element.id);
            var input1 = $element.find('.filtertext1' + me.element.id);
            var input2 = $element.find('.filtertext2' + me.element.id);
            input1.val('');
            input2.val('');

            this.removeHandler(filterbutton, 'click');
            this.addHandler(filterbutton, 'click', function () {
                me._buildfilter(me, element, column);
                me._closemenu();
            });

            this.removeHandler(clearbutton, 'click');
            this.addHandler(clearbutton, 'click', function () {
                me._clearfilter(me, element, column);
                me._closemenu();
            });

            if (this.filtermode === "default") {
                if (condition.jqxDropDownList('source') != source) {
                    condition.jqxDropDownList({ enableBrowserBoundsDetection: false, source: source });
                    condition2.jqxDropDownList({ enableBrowserBoundsDetection: false, source: source });
                }

                if (type == 'boolean' || type == 'bool') {
                    condition.jqxDropDownList({ autoDropDownHeight: true, selectedIndex: 0 });
                    condition2.jqxDropDownList({ autoDropDownHeight: true, selectedIndex: 0 });
                }
                else {
                    var autoDropDownHeight = false;
                    if (source && source.length) {
                        if (source.length < 5) {
                            autoDropDownHeight = true;
                        }
                    }

                    condition.jqxDropDownList({ autoDropDownHeight: autoDropDownHeight, selectedIndex: 2 });
                    condition2.jqxDropDownList({ autoDropDownHeight: autoDropDownHeight, selectedIndex: 2 });
                }
                filteroperator.jqxDropDownList({ selectedIndex: 0 });

                var filter = column.filter;
                var filtergroup = new $.jqx.filter();
                var filtertype = "";
                switch (type) {
                    case "number":
                    case "int":
                    case "float":
                    case "decimal":
                        filtertype = 'numericfilter';
                        conditions = filtergroup.getoperatorsbyfiltertype('numericfilter');
                        break;
                    case "boolean":
                    case "bool":
                        filtertype = 'booleanfilter';
                        conditions = filtergroup.getoperatorsbyfiltertype('booleanfilter');
                        break;
                    case "date":
                    case "time":
                        filtertype = 'datefilter';
                        conditions = filtergroup.getoperatorsbyfiltertype('datefilter');
                        break;
                    case "string":
                        filtertype = 'stringfilter';
                        conditions = filtergroup.getoperatorsbyfiltertype('stringfilter');
                        break;
                }
                if (filter != null) {
                    var filter1 = filter.getfilterat(0);
                    var filter2 = filter.getfilterat(1);
                    var operator = filter.getoperatorat(0);
                 
                    if (me.updatefilterconditions) {
                        var conditions = [];
                        var newfilterconditions = me.updatefilterconditions(filtertype, conditions);
                        if (newfilterconditions != undefined) {
                            for (var c = 0; c < newfilterconditions.length; c++) {
                                newfilterconditions[c] = newfilterconditions[c].toUpperCase();
                            }
                            filter.setoperatorsbyfiltertype(filtertype, newfilterconditions);
                            conditions = newfilterconditions;
                        }
                    }

                    var animationtype = this.enableanimations ? 'default' : 'none';
                    if (filter1 != null) {
                        var index1 = conditions.indexOf(filter1.comparisonoperator);
                        var value1 = filter1.filtervalue;
                        input1.val(value1);
                        condition.jqxDropDownList({ selectedIndex: index1, animationType: animationtype });
                    }
                    if (filter2 != null) {
                        var index2 = conditions.indexOf(filter2.comparisonoperator);
                        var value2 = filter2.filtervalue;
                        input2.val(value2);
                        condition2.jqxDropDownList({ selectedIndex: index2, animationType: animationtype });
                    }
                    if (filter.getoperatorat(0) == undefined) {
                        filteroperator.jqxDropDownList({ selectedIndex: 0, animationType: animationtype });
                    }
                    else {
                        if (filter.getoperatorat(0) == 'and' || filter.getoperatorat(0) == 0) {
                            filteroperator.jqxDropDownList({ selectedIndex: 0 });
                        }
                        else {
                            filteroperator.jqxDropDownList({ selectedIndex: 1 });
                        }
                    }
                }
                if (me.updatefilterpanel) {
                    me.updatefilterpanel(condition, condition2, filteroperator, input1, input2, filterbutton, clearbutton, filter, filtertype, conditions);
                }

                input1.focus();
                setTimeout(function () {
                    input1.focus();
                }, 10);
            }
            else {
                var dataadapter = me._getfilterdataadapter(column);
                var filtertype = me._getfiltertype(type);
                if (column.cellsformat) {
                    condition.jqxListBox({ displayMember: column.displayfield, valueMember: column.displayfield + "JQValue", source: dataadapter });
                }
                else {
                    condition.jqxListBox({ displayMember: column.displayfield, valueMember: column.displayfield, source: dataadapter });
                }

                condition.jqxListBox('insertAt', me.gridlocalization.filterselectallstring, 0);
                var listbox = condition.data().jqxListBox.instance;
                listbox.checkAll(false);
                var that = this;
                if (column.filter) {
                    listbox.uncheckAll(false);
                    var filters = column.filter.getfilters();
                    for (var i = 0; i < listbox.items.length; i++) {
                        var label = listbox.items[i].value;

                        $.each(filters, function () {
                            if (this.condition == "NOT_EQUAL") {
                                if (label != this.value) {
                                    listbox.uncheckIndex(i, false, false);
                                    return false;
                                }
                            }
                            else if (this.condition == "EQUAL") {
                                if (label == this.value) {
                                    listbox.checkIndex(i, false, false);
                                    return false;
                                }
                            }
                        });
                    }

                    listbox._updateCheckedItems();
                    var checkedItemsLength = listbox.getCheckedItems().length;
                    if (listbox.items.length != checkedItemsLength && checkedItemsLength > 0) {
                        listbox.host.jqxListBox('indeterminateIndex', 0, true, false);
                    }
                    if (checkedItemsLength === listbox.items.length - 1) {
                        listbox.host.jqxListBox('checkIndex', 0, true, false);
                    }
                }
            } 
        },

        _getfiltertype: function (type) {
            var filtertype = "stringfilter";
            switch (type) {
                case "number":
                case "int":
                case "float":
                case "decimal":
                    filtertype = 'numericfilter';
                    break;
                case "boolean":
                case "bool":
                    filtertype = 'booleanfilter';
                    break;
                case "date":
                case "time":
                    filtertype = 'datefilter';
                    break;
                case "string":
                    filtertype = 'stringfilter';
                    break;
            }
            return filtertype;
        },

        _buildfilter: function (me, element, column) {
            var condition = $(element).find('#filter1' + me.element.id);
            var operator = $(element).find('#filter2' + me.element.id);
            var condition2 = $(element).find('#filter3' + me.element.id);
            var input1 = $(element).find('.filtertext1' + me.element.id);
            var input2 = $(element).find('.filtertext2' + me.element.id);
            var value1 = input1.val();
            var value2 = input2.val();
            var type = me._getcolumntypebydatafield(column);
            var source = me._getfiltersbytype(type);

            var filtergroup = new $.jqx.filter();
            var filtertype = me._getfiltertype(type);
            if (me.filtermode === "default") {
                var index1 = condition.jqxDropDownList('selectedIndex');
                var operatorindex = operator.jqxDropDownList('selectedIndex');
                var index2 = condition2.jqxDropDownList('selectedIndex');
              
                var filter1 = null;
                var filter2 = null;
               
                if (me.updatefilterconditions) {
                    var newfilterconditions = me.updatefilterconditions(filtertype, filtergroup.getoperatorsbyfiltertype(filtertype));
                    if (newfilterconditions != undefined) {
                        filtergroup.setoperatorsbyfiltertype(filtertype, newfilterconditions);
                    }
                }

                var isvalidfilter = false;
                var condition1 = filtergroup.getoperatorsbyfiltertype(filtertype)[index1];
                var condition2 = filtergroup.getoperatorsbyfiltertype(filtertype)[index2];
                var nullcondition1 = condition1 == "NULL" || condition1 == "NOT_NULL";
                var emptycondition1 = condition1 == "EMPTY" || condition1 == "NOT_EMPTY";

                if (condition1 == undefined) condition1 = filtergroup.getoperatorsbyfiltertype(filtertype)[0];
                if (condition2 == undefined) condition2 = filtergroup.getoperatorsbyfiltertype(filtertype)[0];

                if (value1.length > 0 || nullcondition1 || emptycondition1) {
                    filter1 = filtergroup.createfilter(filtertype, value1, condition1, null, column.cellsformat, me.gridlocalization);
                    filtergroup.addfilter(operatorindex, filter1);
                    isvalidfilter = true;
                }

                var nullcondition2 = condition2 == "NULL" || condition2 == "NOT_NULL";
                var emptycondition2 = condition2 == "EMPTY" || condition2 == "NOT_EMPTY";

                if (value2.length > 0 || nullcondition2 || emptycondition2) {
                    filter2 = filtergroup.createfilter(filtertype, value2, condition2, null, column.cellsformat, me.gridlocalization);
                    filtergroup.addfilter(operatorindex, filter2);
                    isvalidfilter = true;
                }

                if (isvalidfilter) {
                    var datafield = column.displayfield;
                    this.addfilter(datafield, filtergroup, true);
                }
                else {
                    this._clearfilter(me, element, column);
                }
            }
            else {
                var that = this;
                var hasFilter = false;
                var widget = condition.data().jqxListBox.instance;
                var checkedItems = widget.getCheckedItems();
                if (checkedItems.length == 0) {
                    for (var i = 1; i < widget.items.length; i++) {
                        var filtervalue = widget.items[i].value;
                        var filtercondition = 'not_equal';
                    
                        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition, null);
                        filtergroup.addfilter(0, filter);
                    }

                    hasFilter = true;
                }
                else {
                    if (checkedItems.length != widget.items.length) {
                        hasFilter = true;
                        for (var i = 0; i < checkedItems.length; i++) {
                            if (me.gridlocalization.filterselectallstring === checkedItems[i].value)
                                continue;

                            var filtervalue = checkedItems[i].value;
                            var filtercondition = 'equal';
            
                            var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition, null);
                            var filter_or_operator = 1;
                            filtergroup.addfilter(filter_or_operator, filter);
                        }
                    }
                    else hasFilter = false;
                }
                if (hasFilter) {
                    var datafield = column.displayfield;
                    this.addfilter(datafield, filtergroup, true);
                }
                else {
                    var datafield = column.displayfield;
                    this.removefilter(datafield, true);
                }
            }     
        },

        _clearfilter: function (me, element, column) {
            var datafield = column.displayfield;
            this.removefilter(datafield, true);
        },

        addfilter: function (datafield, filter, apply) {
            if (this._loading) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            var columnbydatafield = this.getcolumn(datafield);
            var _columnbydatafield = this._getcolumn(datafield);
            if (columnbydatafield == undefined || columnbydatafield == null)
                return;

            columnbydatafield.filter = filter;
            _columnbydatafield.filter = filter;

            this.dataview.addfilter(datafield, filter);
            if (apply == true && apply != undefined) {
                this.applyfilters('add');
            }
        },

        // removes a filter.
        removefilter: function (datafield, apply) {
            if (this._loading) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            var columnbydatafield = this.getcolumn(datafield);
            var _columnbydatafield = this._getcolumn(datafield);
            if (columnbydatafield == undefined || columnbydatafield == null)
                return;

            if (columnbydatafield.filter == null)
                return;

            this.dataview.removefilter(datafield, columnbydatafield.filter);
            columnbydatafield.filter = null;
            _columnbydatafield.filter = null;

            if (apply == true || apply !== false) {
                this.applyfilters('remove');
            }
        },

        applyfilters: function (reason) {
            var customfilter = false;

            if (this.dataview.filters.length >= 0 && (this.virtualmode || !this.source.localdata)) {
                if (this.source != null && this.source.filter) {
                    var tmppage = -1;
                    if (this.pageable) {
                        tmppage = this.dataview.pagenum;
                        this.dataview.pagenum = 0;
                    }
                    else {
                        this.vScrollInstance.setPosition(0);
                        this.loadondemand = true;
                        this._renderrows(this.virtualsizeinfo);
                    }

                    this.source.filter(this.dataview.filters, this.dataview.records, this.dataview.records.length);
                    if (this.pageable) {
                        this.dataview.pagenum = tmppage;
                    }
                }
            }
            if (this.dataview.clearsortdata) {
                this.dataview.clearsortdata();
            }
            if (!this.virtualmode) {
                var selectedrowindexes = this.selectedrowindexes;
                var me = this.that;
                this.dataview.refresh();
                if (this.dataview.clearsortdata) {
                    if (this.sortcolumn && this.sortdirection) {
                        var sortdirection = this.sortdirection.ascending ? "asc" : "desc";
                        if (!this._loading) {
                            this.sortby(this.sortcolumn, sortdirection, null, false);
                        }
                        else {
                            this.sortby(this.sortcolumn, sortdirection, null, false, false);
                        }
                    }
                }

            }
            else {
                if (this.pageable) {
                    this.dataview.updateview();
                    if (this.gotopage) {
                        this.gotopage(0);
                    }
                }
                this.rendergridcontent(false, false);
                if (this.showfilterrow) {
                    if (typeof reason != 'string' && $.isEmptyObject(reason)) {
                        this.refreshfilterrow();
                    }
                }
                this._raiseEvent(13, { filters: this.dataview.filters });
                return;
            }

            if (this.pageable) {
                this.dataview.updateview();
                if (this.gotopage) {
                    this.gotopage(0);
                    this.updatepagerdetails();
                }
            }
            this._updaterowsproperties();
            if (!this.groupable || (this.groupable && this.groups.length == 0)) {
                this._rowdetailscache = new Array();
                this.virtualsizeinfo = null;
                this._pagescache = new Array();
                if (this.columns && this.columns.records && this.columns.records.length > 0 && !this.columns.records[0].filtericon) {
                    this.prerenderrequired = true;
                }
                // it is not necessary to update the columns and that's why the second param is false.
                this.rendergridcontent(true, false);
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._renderrows(this.virtualsizeinfo);
                if (this.showaggregates && this._updatecolumnsaggregates) {
                    this._updatecolumnsaggregates();
                }
            }
            else {
                this._rowdetailscache = new Array();
                this._render(true, true, false, false, false);
                if (this.showfilterrow) this._updatefocusedfilter();
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._renderrows(this.virtualsizeinfo);
            }
            if (this.showfilterrow) {
                if (typeof reason != 'string' && $.isEmptyObject(reason)) {
                    this.refreshfilterrow();
                }
            }

            this._raiseEvent(13, { filters: this.dataview.filters });
        },

        getfilterinformation: function () {
            var filters = new Array();
            for (var i = 0; i < this.dataview.filters.length; i++) {
                var column = this.getcolumn(this.dataview.filters[i].datafield);
                filters[i] = { filter: this.dataview.filters[i].filter, filtercolumn: column.datafield, filtercolumntext: column.text };
            }
            return filters;
        },

        clearfilters: function (apply) {
            var me = this.that;
            if (this.showfilterrow) {
                this.clearfilterrow();
            }

            if (this.columns.records) {
                var canApply = apply == true || apply !== false;
                $.each(this.columns.records, function () {
                    me.removefilter(this.displayfield, !canApply);
                });
            }

            if (apply === false)
                return;

            if (apply == true || apply !== false) {
                this.applyfilters('clear');
            }
        },

        _destroyfilterpanel: function () {
            var clearbutton = $($.find('#filterclearbutton' + this.element.id));
            var filterbutton = $($.find('#filterbutton' + this.element.id));
            var condition = $($.find('#filter1' + this.element.id));
            var filteroperator = $($.find('#filter2' + this.element.id));
            var condition2 = $($.find('#filter3' + this.element.id));
            var input1 = $($.find('.filtertext1' + this.element.id));
            var input2 = $($.find('.filtertext2' + this.element.id));
            if (input1.length > 0 && input2.length > 0) {
                input1.removeClass();
                input2.removeClass();
                input1.remove();
                input2.remove();
            }

            if (clearbutton.length > 0) {
                clearbutton.jqxButton('destroy');
                filterbutton.jqxButton('destroy');
                this.removeHandler(clearbutton, 'click');
                this.removeHandler(filterbutton, 'click');
            }

            if (condition.length > 0) {
                condition.jqxDropDownList('destroy');
            }
            if (filteroperator.length > 0) {
                filteroperator.jqxDropDownList('destroy');
            }
            if (condition2.length > 0) {
                condition2.jqxDropDownList('destroy');
            }
        },

        _initfilterpanel: function (me, element, column, width) {
            if (me == null || me == undefined) me = this;
            element[0].innerHTML = "";
            var filterpanelcontainer = $("<div class='filter' style='margin-left: 7px;'></div>");

            element.append(filterpanelcontainer);
            var showwhere = $("<div class='filter' style='margin-top: 3px; margin-bottom: 3px;'></div>");
            showwhere.text(me.gridlocalization.filtershowrowstring);
            var condition = $("<div class='filter' id='filter1" + me.element.id + "'></div>");
            var operator = $("<div class='filter' id='filter2" + me.element.id + "' style='margin-bottom: 3px;'></div>");
            var condition2 = $("<div class='filter' id='filter3" + me.element.id + "'></div>");
            var type = me._getcolumntypebydatafield(column);

            if (!condition.jqxDropDownList) {
                throw new Error('jqxGrid: jqxdropdownlist.js is not loaded.');
                return;
            }

            var source = me._getfiltersbytype(type);

            var input = $("<div class='filter'><input class='filtertext1" + me.element.id + "' style='height: 20px; margin-top: 3px; margin-bottom: 3px;' type='text'></input></div>");
            var textField = input.find('input');
            textField.addClass(this.toThemeProperty('jqx-input'));
            textField.addClass(this.toThemeProperty('jqx-widget-content'));
            textField.addClass(this.toThemeProperty('jqx-rc-all'));
            textField.width(width - 15);
            var input2 = $("<div class='filter'><input class='filtertext2" + me.element.id + "' style='height: 20px; margin-top: 3px;' type='text'></input></div>");
            var textField2 = input2.find('input');
            textField2.addClass(this.toThemeProperty('jqx-input'));
            textField2.addClass(this.toThemeProperty('jqx-widget-content'));
            textField2.addClass(this.toThemeProperty('jqx-rc-all'));
            textField2.width(width - 15);

            if (me.rtl) {
                textField.css('direction', 'rtl');
                textField2.css('direction', 'rtl');
            }

            var applyinput = $("<div class='filter' style='height: 25px; margin-left: 20px; margin-top: 7px;'></div>");
            var filterbutton = $('<span tabIndex=0 id="filterbutton' + me.element.id + '" class="filterbutton" style="padding: 4px 12px; margin-left: 2px;">' + me.gridlocalization.filterstring + '</span>');
            applyinput.append(filterbutton);
            var filterclearbutton = $('<span tabIndex=0 id="filterclearbutton' + me.element.id + '" class="filterclearbutton" style="padding: 4px 12px; margin-left: 5px;">' + me.gridlocalization.filterclearstring + '</span>');
            applyinput.append(filterclearbutton);

            filterbutton.jqxButton({ height: 20, theme: me.theme });
            filterclearbutton.jqxButton({ height: 20, theme: me.theme });

            var selectionrenderer = function (selectionelement) {
                if (selectionelement) {
                    if (selectionelement.text().indexOf("case sensitive") != -1) {
                        var selectiontext = selectionelement.text();
                        selectiontext = selectiontext.replace("case sensitive", "match case");
                        selectionelement.text(selectiontext);
                    }
                    selectionelement.css('font-family', me.host.css('font-family'));
                    selectionelement.css('font-size', me.host.css('font-size'));

                    return selectionelement;
                }
                return "";
            }

            if (this.filtermode === "default") {
                filterpanelcontainer.append(showwhere);
                filterpanelcontainer.append(condition);
                condition.jqxDropDownList({ _checkForHiddenParent: false, rtl: me.rtl, enableBrowserBoundsDetection: false, selectedIndex: 2, width: width - 15, height: 20, dropDownHeight: 150, dropDownWidth: width - 15, selectionRenderer: selectionrenderer, source: source, theme: me.theme });
                filterpanelcontainer.append(input);
                var operators = new Array();
                operators[0] = me.gridlocalization.filterandconditionstring;
                operators[1] = me.gridlocalization.filterorconditionstring;
                operator.jqxDropDownList({ _checkForHiddenParent: false, rtl: me.rtl, enableBrowserBoundsDetection: false, autoDropDownHeight: true, selectedIndex: 0, width: 60, height: 20, source: operators, selectionRenderer: selectionrenderer, theme: me.theme });
                filterpanelcontainer.append(operator);
                condition2.jqxDropDownList({ _checkForHiddenParent: false, rtl: me.rtl, enableBrowserBoundsDetection: false, selectedIndex: 2, width: width - 15, height: 20, dropDownHeight: 150, dropDownWidth: width - 15, selectionRenderer: selectionrenderer, source: source, theme: me.theme });
                filterpanelcontainer.append(condition2);
                filterpanelcontainer.append(input2);
            }
            else {
                filterpanelcontainer.append(showwhere);
                filterpanelcontainer.append(condition);
                condition.jqxListBox({ rtl: me.rtl, _checkForHiddenParent: false, checkboxes: true, selectedIndex: 2, width: width - 15, height: 120, theme: me.theme });
                var handleCheckChange = true;
                me.addHandler(condition, 'checkChange', function (event) {
                    if (!handleCheckChange)
                        return;

                    if (event.args.label != me.gridlocalization.filterselectallstring) {
                        handleCheckChange = false;
                        condition.jqxListBox('checkIndex', 0, true, false);
                        var checkedItems = condition.jqxListBox('getCheckedItems');
                        var items = condition.jqxListBox('getItems');

                        if (checkedItems.length == 1) {
                            condition.jqxListBox('uncheckIndex', 0, true, false);
                        }
                        else if (items.length != checkedItems.length) {
                            condition.jqxListBox('indeterminateIndex', 0, true, false);
                        }
                        handleCheckChange = true;
                    }
                    else {
                        handleCheckChange = false;
                        if (event.args.checked) {
                            condition.jqxListBox('checkAll', false);
                        }
                        else {
                            condition.jqxListBox('uncheckAll', false);
                        }

                        handleCheckChange = true;
                    }
                });
            }

            filterpanelcontainer.append(applyinput);
            if (me.updatefilterpanel) {
                me.updatefilterpanel(condition, condition2, operator, input, input2, filterbutton, filterclearbutton, null, null, source);
            }
        }
    });
})(jQuery);


