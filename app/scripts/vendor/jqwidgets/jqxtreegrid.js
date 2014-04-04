/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    $.jqx.jqxWidget("jqxTreeGrid", "jqxDataTable", {});

    $.extend($.jqx._jqxTreeGrid.prototype, {
        defineInstance: function () {
            this.base.treeGrid = this;
            this.base.exportSettings = {
                recordsInView: false,
                columnsHeader: true,
                hiddenColumns: false,
                serverURL: null,
                characterSet: null,
                collapsedRecords: false,
                fileName: "jqxTreeGrid"
            }
            this.checkboxes = false;
            this.icons = false;
            this.showSubAggregates = false;
            this.rowDetailsRenderer = null;
            this.virtualModeCreateRecords = null;
            this.virtualModeRecordCreating = null;
            this.loadingFailed = false;
        },

        createInstance: function (args) {
            this.theme = this.base.theme;
            var that = this;
        },

        deleterow: function (key) {
            var that = this.base;
            that.deleterowbykey(key);
        },

        updaterow: function (key, rowdata) {
            var that = this.base;
            that.updaterowbykey(key, rowdata);
        },

        setcellvalue: function(key, datafield, value)
        {
            var that = this.base;
            that.setcellvaluebykey(key, datafield, value);
        },

        getcellvalue: function(key, datafield)
        {
            var that = this.base;
            return that.getcellvaluebykey(key, datafield);
        },

        lockrow: function(key)
        {
            var that = this.base;
            that.lockrowbykey(key);
        },

        unlockrow: function (key) {
            var that = this.base;
            that.unlockrowbykey(key);
        },

        selectrow: function(key)
        {
            var that = this.base;
            that.selectrowbykey(key);
        },

        unselectrow: function(key)
        {
            var that = this.base;
            that.unselectrowbykey(key);
        },

        beginrowedit: function (key) {
            var that = this.base;
            that.beginroweditbykey(key);
        },

        endrowedit: function (key, cancel) {
            var that = this.base;
            that.endroweditbykey(key, cancel);
        },

        _showLoadElement: function()
        {
            var that = this.base;
            if (that.host.css('display') == 'block') {
                if (that.autoshowloadelement) {
                    $(that.dataloadelement).css('visibility', 'visible');
                    $(that.dataloadelement).css('display', 'block');
                    that.dataloadelement.width(that.host.width());
                    that.dataloadelement.height(that.host.height());
                }
            }
        },

        _hideLoadElement: function()
        {
            var that = this.base;
            if (that.host.css('display') == 'block') {
                if (that.autoshowloadelement) {
                    $(that.dataloadelement).css('visibility', 'hidden');
                    $(that.dataloadelement).css('display', 'none');
                    that.dataloadelement.width(that.host.width());
                    that.dataloadelement.height(that.host.height());
                }
            }
        },

        getKey: function (row) {
            if (row) {
                return row.uid;
            }
        },

        getRows: function () {
            var that = this.base;
            if (that.source.hierarchy) {
                return that.source.hierarchy;
            }

            return that.source.records;
        },

        getrow: function(key)
        {
            var that = this.base;
            var records = that.source.records;
            if (that.source.hierarchy) {
                var getRow = function (records) {
                    for (var i = 0; i < records.length; i++) {
                        if (!records[i]) {
                            continue;
                        }

                        if (records[i].uid == key) {
                            return records[i];
                        }
                        if (records[i].records) {
                             var foundRow = getRow(records[i].records);
                             if (foundRow) {
                                 return foundRow;
                             }
                        }
                    }
                }
                var row = getRow(that.source.hierarchy);
                return row;
            }
            else {
                for (var i = 0; i < records.length; i++) {
                    if (!records[i]) {
                        continue;
                    }

                    if (records[i].uid == key) {
                        return records[i];
                    }
                }
            }
        },

        _renderrows: function () {
            var that = this.base;
            var me = this;

            if (that._loading)
                return;

            if (that._updating) {
                return;
            }

            var names = that._names();

            if (that.source.hierarchy.length === 0 && !that.loadingFailed) {
                if (this.virtualModeCreateRecords) {
                    var done = function (records) {
                        if (records === false) {
                            that._loading = false;
                            that.loadingFailed = true;
                            that.source.hierarchy = new Array();
                            me._hideLoadElement();
                            that._renderrows();
                            that._updateScrollbars();
                            that._arrange();
                            return;
                        }

                        for (var i = 0; i < records.length; i++) {
                            records[i].level = 0;
                            me.virtualModeRecordCreating(records[i]);
                            that.rowsByKey[records[i].uid] = records[i];
                        }

                        that.source.hierarchy = records;
                        that._loading = false;
                        me._hideLoadElement();
                        that._renderrows();
                        that._updateScrollbars();
                        that._arrange();
                    }
                    that._loading = true;
                    this.virtualModeCreateRecords(null, done);
                    this._showLoadElement();
                }
            }

            if (that.rendering) {
                that.rendering();
            }
            var tablewidth = 0;
            that.table[0].rows = new Array();
            var cellclass = that.toTP('jqx-cell') + " " + that.toTP('jqx-widget-content') + " " + that.toTP('jqx-item');
            if (that.rtl) {
                cellclass += " " + that.toTP('jqx-cell-rtl')
            }

            var columnslength = that.columns.records.length;

            var isIE7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
            if (isIE7) {
                that.host.attr("hideFocus", "true");
            }

            var records = new Array();
            var getRecords = function (records, filtered) {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (!record) {
                        continue;
                    }
                    var expanded = !that.rowinfo[record.uid] ? record.expanded : that.rowinfo[record.uid].expanded;
                    if (that.dataview.filters.length == 0) {
                        record._visible = true;
                    }
                    if (record._visible !== false) {
                        if (expanded || record[names.leaf]) {
                            filtered.push(record);
                            if (record.records && record.records.length > 0) {
                                var data = getRecords(record.records, new Array());
                                for (var t = 0; t < data.length; t++) {
                                    filtered.push(data[t]);
                                }
                            }
                        }
                        else {
                            filtered.push(record);
                        }
                    }
                }
                return filtered;
            };

            var filterRecords = that.source.hierarchy.length === 0 ? that.source.records : that.source.hierarchy;  
            filterRecords = that.dataview.evaluate(filterRecords);

            that.dataViewRecords = filterRecords;
            if (this.showSubAggregates) {
                var addSubAggregate = function (level, records) {
                    if (level != 0) {
                        if (records.length > 0) {
                            if (records[records.length - 1]) {
                                if (!records[records.length - 1].aggregate) {
                                    records.push({ _visible: true, level: level, siblings: records, aggregate: true, leaf: true });
                                }
                            }
                            else if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                                if (records[records.length - 2]) {
                                    if (!records[records.length - 2].aggregate) {
                                        records.push({ _visible: true, level: level, siblings: records, aggregate: true, leaf: true });
                                    }
                                }
                            }
                        }
                    }
                    for (var i = 0; i < records.length; i++) {
                        if (records[i] && records[i].records) {
                            addSubAggregate(level + 1, records[i].records);
                        }
                    }
                }
                addSubAggregate(0, filterRecords);
            }

            if (that.source.hierarchy.length === 0) {
                if (that.dataview.pagesize == "all" || !that.pageable || that.serverProcessing) {
                    var rowsOnPage = filterRecords;
                    if (that.pageable && that.serverProcessing && filterRecords.length > that.dataview.pagesize) {
                        var rowsOnPage = filterRecords.slice(that.dataview.pagesize * that.dataview.pagenum, that.dataview.pagesize * that.dataview.pagenum + that.dataview.pagesize);
                    }
                }
                else {
                    var rowsOnPage = filterRecords.slice(that.dataview.pagesize * that.dataview.pagenum, that.dataview.pagesize * that.dataview.pagenum + that.dataview.pagesize);
                }
                var records = rowsOnPage;
            }
            else {
                var filterRecords = getRecords.call(that, filterRecords, new Array());

                if (that.dataview.pagesize == "all" || !that.pageable) {
                    var rowsOnPage = filterRecords;
                }
                else {
                    var rowsOnPage = filterRecords.slice(that.dataview.pagesize * that.dataview.pagenum, that.dataview.pagesize * that.dataview.pagenum + that.dataview.pagesize);
                }
                var records = rowsOnPage;
                var pagenum = that.dataview.pagenum;
                that.updatepagerdetails();
                if (that.dataview.pagenum != pagenum) {
                    if (that.dataview.pagesize == "all" || !that.pageable) {
                        var rowsOnPage = filterRecords;
                    }
                    else {
                        var rowsOnPage = filterRecords.slice(that.dataview.pagesize * that.dataview.pagenum, that.dataview.pagesize * that.dataview.pagenum + that.dataview.pagesize);
                    }
                    var records = rowsOnPage;
                }
            }
            that.renderedRecords = records;
            var pagesize = records.length;
            var zindex = that.tableZIndex;

            var widthOffset = 0;
            var emptyWidth = 0;
            if (isIE7) {
                for (var j = 0; j < columnslength; j++) {
                    var columnrecord = that.columns.records[j];
                    var width = columnrecord.width;
                    if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                    if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;
                    var tablecolumn = $('<table><tr><td role="gridcell" style="max-width: ' + width + 'px; width:' + width + 'px;" class="' + cellclass + '"></td></tr></table>');
                    $(document.body).append(tablecolumn);
                    var td = tablecolumn.find('td');
                    widthOffset = 1 + parseInt(td.css('padding-left')) + parseInt(td.css('padding-right'));
                    tablecolumn.remove();
                    break;
                }
            }

            var rtlTableClassName = that.rtl ? " " + that.toTP('jqx-grid-table-rtl') : "";
            var tableHTML = "<table cellspacing='0' class='" + that.toTP('jqx-grid-table') + rtlTableClassName + "' id='table" + that.element.id + "'><colgroup>";
            var pinnedTableHTML = "<table cellspacing='0' class='" + that.toTP('jqx-grid-table') + rtlTableClassName + "' id='pinnedtable" + that.element.id + "'><colgroup>";
            var lastVisibleColumn = null;
            for (var j = 0; j < columnslength; j++) {
                var columnrecord = that.columns.records[j];
                if (columnrecord.hidden) continue;
                lastVisibleColumn = columnrecord;
                var width = columnrecord.width;
                if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;
                width -= widthOffset;
                if (width < 0) {
                    width = 0;
                }

                if (isIE7) {
                    var w = width;
                    if (j == 0) w++;
                    pinnedTableHTML += "<col style='max-width: " + width + "px; width: " + w + "px;'>";
                    tableHTML += "<col style='max-width: " + width + "px; width: " + w + "px;'>";
                }
                else {
                    pinnedTableHTML += "<col style='max-width: " + width + "px; width: " + width + "px;'>";
                    tableHTML += "<col style='max-width: " + width + "px; width: " + width + "px;'>";
                }
                emptyWidth += width;
            }
            tableHTML += "</colgroup>";
            pinnedTableHTML += "</colgroup>";

            that._hiddencolumns = false;
            var pinnedColumns = false;

            if (pagesize === 0) {
                var tablerow = '<tr role="row">';
                var height = that.host.height();
                if (that.pageable) {
                    height -= that.pagerheight;
                    if (that.pagerposition === "both") {
                        height -= that.pagerheight;
                    }
                }
                height -= that.columnsheight;
                if (that.filterable) {
                    var filterconditions = that.filter.find('.filterrow');
                    var filterconditionshidden = that.filter.find('.filterrow-hidden');
                    var filterrow = 1;
                    if (filterconditionshidden.length > 0) {
                        filterrow = 0;
                    }
                    height -= that.filterheight + that.filterheight * filterconditions.length * filterrow;
                }
                if (that.showstatusbar) {
                    height -= that.statusbarheight;
                }
                if (that.showaggregates) {
                    height -= that.aggregatesheight;
                }

                if (height < 25) {
                    height = 25;
                }
                if (that.hScrollBar[0].style.visibility != "hidden") {
                    height -= that.hScrollBar.outerHeight();
                }

                if (that.height === "auto" || that.height === null || that.autoheight) {
                    height = 100;
                }

                var width = that.host.width()+2;
                var tablecolumn = '<td colspan="' + that.columns.records.length + '" role="gridcell" style="border-right-color: transparent; min-height: ' + height + 'px; height: ' + height + 'px;  min-width:' + emptyWidth + 'px; max-width:' + emptyWidth + 'px; width:' + emptyWidth + 'px;';
                var cellclass = that.toTP('jqx-cell') + " " + that.toTP('jqx-grid-cell') + " " + that.toTP('jqx-item');
                cellclass += ' ' + that.toTP('jqx-center-align');
                tablecolumn += '" class="' + cellclass + '">';
                if (!that._loading) {
                    tablecolumn += that.gridlocalization.emptydatastring;
                }
                tablecolumn += '</td>';
                tablerow += tablecolumn;
                tableHTML += tablerow;
                pinnedTableHTML += tablerow;
                that.table[0].style.width = emptyWidth + 2 + 'px';
                tablewidth = emptyWidth;
            }
    
            var grouping = that.source._source.hierarchy && that.source._source.hierarchy.groupingDataFields ? that.source._source.hierarchy.groupingDataFields.length : 0;
      
            for (var i = 0; i < records.length; i++) {
                var row = records[i];
                var key = row.uid;

                if (grouping > 0) {
                    if (row[names.level] < grouping) {
                        key = row.uid;
                    }
                }
                if (row.uid === undefined) {
                    row.uid = that.dataview.generatekey();
                }

                var tablerow = '<tr data-key="' + key + '" role="row" id="row' + i + that.element.id + '">';
                var pinnedtablerow = '<tr data-key="' + key + '" role="row" id="row' + i + that.element.id + '">';
                if (row.aggregate) {
                    var tablerow = '<tr data-role="' + "summaryrow" + '" role="row" id="row' + i + that.element.id + '">';
                    var pinnedtablerow = '<tr data-role="' + "summaryrow" + '" role="row" id="row' + i + that.element.id + '">';
                }
                var left = 0;

                if (!that.rowinfo[key]) {
                    that.rowinfo[key] = { selected: row[names.selected], checked: row[names.checked], icon: row[names.icon], aggregate: row.aggregate, row: row, leaf: row[names.leaf], expanded: row[names.expanded] };
                }
                else {
                    if (that.rowinfo[key].checked === undefined) {
                        that.rowinfo[key].checked = row[names.checked];
                    }
                    if (that.rowinfo[key].icon === undefined) {
                        that.rowinfo[key].icon = row[names.icon];
                    }
                    if (that.rowinfo[key].aggregate === undefined) {
                        that.rowinfo[key].aggregate = row[names.aggregate];
                    }
                    if (that.rowinfo[key].row === undefined) {
                        that.rowinfo[key].row = row;
                    }
                    if (that.rowinfo[key].leaf === undefined) {
                        that.rowinfo[key].leaf = row[names.leaf];
                    }
                    if (that.rowinfo[key].expanded === undefined) {
                        that.rowinfo[key].expanded = row[names.expanded];
                    }
                }

                var info = that.rowinfo[key];
                info.row = row;
                if (row.originalRecord) {
                    info.originalRecord = row.originalRecord;
                }
                var start = 0;
                for (var j = 0; j < columnslength; j++) {
                    var column = that.columns.records[j];

                    if (column.pinned || (that.rtl && that.columns.records[columnslength - 1].pinned)) {
                        pinnedColumns = true;
                    }

                    var width = column.width;
                    if (width < column.minwidth) width = column.minwidth;
                    if (width > column.maxwidth) width = column.maxwidth;
                    width -= widthOffset;

                    if (width < 0) {
                        width = 0;
                    }

                    var cellclass = that.toTP('jqx-cell') + " " + that.toTP('jqx-grid-cell') + " " + that.toTP('jqx-item');
                    if (column.pinned) {
                        cellclass += ' ' + that.toTP('jqx-grid-cell-pinned');
                    }
                    if (that.sortcolumn === column.displayfield) {
                        cellclass += ' ' + that.toTP('jqx-grid-cell-sort');
                    }
                    if (that.altrows && i % 2 != 0) {
                        cellclass += ' ' + that.toTP('jqx-grid-cell-alt');
                    }
                    if (that.rtl) {
                        cellclass += ' ' + that.toTP('jqx-cell-rtl');
                    }

                    var colspan = "";
                    if (grouping > 0 && !isIE7) {
                        if (row[names.level] < grouping) {
                            colspan += ' colspan="' + columnslength + '"';
                            var w = 0;
                            for (var t = 0; t < columnslength; t++) {
                                var c = that.columns.records[t];
                                var columnWidth = c.width;
                                if (columnWidth < c.minwidth) width = c.minwidth;
                                if (columnWidth > c.maxwidth) width = c.maxwidth;
                                columnWidth -= widthOffset;

                                if (columnWidth < 0) {
                                    columnWidth = 0;
                                }
                                w += columnWidth;
                            }
                            width = w;
                        }
                    }

                    var tablecolumn = '<td role="gridcell"' + colspan + ' style="max-width:' + width + 'px; width:' + width + 'px;';
                    var pinnedcolumn = '<td role="gridcell"' + colspan + ' style="pointer-events: none; visibility: hidden; border-color: transparent; max-width:' + width + 'px; width:' + width + 'px;';
                    if (j == columnslength - 1 && columnslength == 1) {
                        tablecolumn += 'border-right-color: transparent;'
                        pinnedcolumn += 'border-right-color: transparent;'
                    }

                    if (grouping > 0) {
                        if (row[names.level] < grouping) {
                            if (that.rtl) {
                                cellclass += ' ' + that.toTP('jqx-right-align');
                            }
                        }
                    }
                    else {
                        if (column.cellsalign != "left") {
                            if (column.cellsalign === "right") {
                                cellclass += ' ' + that.toTP('jqx-right-align');
                            }
                            else {
                                cellclass += ' ' + that.toTP('jqx-center-align');
                            }
                        }
                    }

                    if (info) {
                        if (info.selected) {
                            if (that.editKey !== key) {
                                if (that.selectionmode !== "none") {
                                    cellclass += ' ' + that.toTP('jqx-grid-cell-selected');
                                    cellclass += ' ' + that.toTP('jqx-fill-state-pressed');
                                }
                            }
                        }
                        if (info.locked) {
                            cellclass += ' ' + that.toTP('jqx-grid-cell-locked');
                        }
                        if (info.aggregate) {
                            cellclass += ' ' + that.toTP('jqx-grid-cell-pinned');
                        }
                    }

                    if (!(column.hidden)) {
                        if (start == 0 && !that.rtl) {
                            tablecolumn += 'border-left-width: 0px;'
                            pinnedcolumn += 'border-left-width: 0px;'
                        }
                        else {
                            tablecolumn += 'border-right-width: 0px;'
                            pinnedcolumn += 'border-right-width: 0px;'
                        }
                        start++;
                        left += widthOffset + width;
                    }
                    else {
                        tablecolumn += 'display: none;'
                        pinnedcolumn += 'display: none;'
                        that._hiddencolumns = true;
                    }

                    if (column.pinned) {
                        tablecolumn += 'pointer-events: auto;'
                        pinnedcolumn += 'pointer-events: auto;'
                    }

                    var toggleButtonClass = "";

                    if ((that.source.hierarchy.length == 0 || (!row.records ||(row.records && row.records.length === 0))) && !this.virtualModeCreateRecords) {
                        info.leaf = true;
                    }
                    if (row.records && row.records.length > 0) {
                        info.leaf = false;
                    }

                    if (that.dataview.filters.length > 0) {
                        if (row.records && row.records.length > 0) {
                            var hasVisibleChildren = false;
                            for (var s = 0; s < row.records.length; s++) {
                                if (row.records[s]._visible !== false && row.records[s].aggregate == undefined) {
                                    hasVisibleChildren = true;
                                    break;
                                }
                            }
                            if (!hasVisibleChildren) {
                                info.leaf = true;
                            }
                            else {
                                info.leaf = false;
                            }
                        }
                    }

                    if (info && !info.leaf) {
                        if (info.expanded) {
                            toggleButtonClass += that.toTP("jqx-tree-grid-expand-button") + " ";
                            if (!that.rtl) {
                                toggleButtonClass += that.toTP('jqx-grid-group-expand');
                            }
                            else {
                                toggleButtonClass += that.toTP('jqx-grid-group-expand-rtl');
                            }
                            toggleButtonClass += " " + that.toTP('jqx-icon-arrow-down');
                        }
                        else {
                            toggleButtonClass += that.toTP("jqx-tree-grid-collapse-button") + " ";
                            if (!that.rtl) {
                                toggleButtonClass += that.toTP('jqx-grid-group-collapse');
                                toggleButtonClass += " " + that.toTP('jqx-icon-arrow-right');
                            }
                            else {
                                toggleButtonClass += that.toTP('jqx-grid-group-collapse-rtl');
                                toggleButtonClass += " " + that.toTP('jqx-icon-arrow-left');
                            }
                        }
                    }
                
                    if (!that.autorowheight || start == 1) {
                        cellclass += ' ' + that.toTP('jqx-grid-cell-nowrap ');
                    }

                    var cellvalue = that._getcellvalue(column, info.row);
                    if (grouping > 0) {
                        if (row[names.level] < grouping) {
                            cellvalue = row.label;
                        }
                    }

                    if (column.cellsformat != '') {
                        if ($.jqx.dataFormat) {
                            if ($.jqx.dataFormat.isDate(cellvalue)) {
                                cellvalue = $.jqx.dataFormat.formatdate(cellvalue, column.cellsformat, that.gridlocalization);
                            }
                            else if ($.jqx.dataFormat.isNumber(cellvalue) || (!isNaN(parseFloat(cellvalue)) && isFinite(cellvalue))) {
                                cellvalue = $.jqx.dataFormat.formatnumber(cellvalue, column.cellsformat, that.gridlocalization);
                            }
                        }
                    }

                    if (column.cellclassname != '' && column.cellclassname) {
                        if (typeof column.cellclassname == "string") {
                            cellclass += ' ' + column.cellclassname;
                        }
                        else {
                            var customclassname = column.cellclassname(i, column.datafield, that._getcellvalue(column, info.row), info.row, cellvalue);
                            if (customclassname) {
                                cellclass += ' ' + customclassname;
                            }
                        }
                    }

                    if (column.cellsrenderer != '' && column.cellsrenderer) {
                        var newValue = column.cellsrenderer(key, column.datafield, that._getcellvalue(column, info.row), info.row, cellvalue);
                        if (newValue !== undefined) {
                            cellvalue = newValue;
                        }
                    }

                    if (info.aggregate) {
                        if (column.aggregates) {
                            var siblings = row.siblings.slice(0, row.siblings.length - 1);
                            var aggregates = that._calculateaggregate(column, null, true, siblings);
                            row[column.displayfield] = "";
                            if (aggregates) {
                                if (column.aggregatesrenderer) {
                                    if (aggregates) {
                                        var renderstring = column.aggregatesrenderer(aggregates[column.datafield], column, null, that.getcolumnaggregateddata(column.datafield, column.aggregates, false, siblings), "subAggregates");
                                        cellvalue = renderstring;
                                        row[column.displayfield] += name + ':' + aggregates[column.datafield] + "\n";
                                    }
                                }
                                else {
                                    cellvalue = "";
                                    row[column.displayfield] = "";
                                    $.each(aggregates, function () {
                                        var aggregate = this;
                                        for (obj in aggregate) {
                                            var name = obj;
                                            name = that._getaggregatename(name);
                                            var field = '<div style="position: relative; margin: 0px; overflow: hidden;">' + name + ':' + aggregate[obj] + '</div>';
                                            cellvalue += field;
                                            row[column.displayfield] += name + ':' + aggregate[obj] + "\n";
                                        }
                                    });
                                }
                            }
                        }
                    }

                    if ((start === 1 && !that.rtl) || (column == lastVisibleColumn && that.rtl) || (grouping > 0 && row[names.level] < grouping)) {
                        var indent = "";
                        var indentClass = that.toThemeProperty('jqx-tree-grid-indent');
                        var indentOffset = info.leaf ? 1 : 0;
                        for (var x = 0; x < row[names.level] + indentOffset; x++) {
                            indent += "<span class='" + indentClass + "'></span>";
                        }

                        var toggleButton = "<span class='" + toggleButtonClass + "'></span>";
                        var checkbox = "";
                        var icon = "";

                        if (this.checkboxes && !row.aggregate) {
                            var checkClassName = that.toThemeProperty('jqx-tree-grid-checkbox') + " " + indentClass + " " + that.toThemeProperty('jqx-checkbox-default') + " " + that.toThemeProperty('jqx-fill-state-normal') + " " + that.toThemeProperty('jqx-rc-all');
                            var hasCheckbox = true;
                            if ($.isFunction(this.checkboxes)) {
                                hasCheckbox = this.checkboxes(key, row);
                                if (hasCheckbox == undefined) {
                                    hasCheckbox = false;
                                }
                            }

                            if (hasCheckbox) {
                                if (info) {
                                    var checked = info.checked;
                                    if (checked) {
                                        checkbox += "<span class='" + checkClassName + "'><div class='" + that.toThemeProperty('jqx-tree-grid-checkbox-tick') + " " + that.toThemeProperty('jqx-checkbox-check-checked') + "'></div></span>";
                                    }
                                    else {
                                        checkbox += "<span class='" + checkClassName + "'></span>";
                                    }
                                }
                                else {
                                    checkbox += "<span class='" + checkClassName + "'></span>";
                                }
                            }
                        }

                        if (this.icons && !row.aggregate) {
                            var iconClassName = that.toThemeProperty('jqx-tree-grid-icon') + " " + indentClass;
                            if (that.rtl) {
                                var iconClassName = that.toThemeProperty('jqx-tree-grid-icon') + " " + that.toThemeProperty('jqx-tree-grid-icon-rtl') + " " + indentClass;
                            }
                            var iconSizeClassName = that.toThemeProperty('jqx-tree-grid-icon-size') + " " + indentClass;
                            var hasIcon = info.icon;
                            if ($.isFunction(this.icons)) {
                                info.icon = this.icons(key, row);
                                if (info.icon) {
                                    hasIcon = true;
                                }
                            }
                            if (hasIcon) {
                                if (info.icon) {
                                    icon += "<span class='" + iconClassName + "'><img class='" + iconSizeClassName + "' src='" + info.icon + "'/></span>";
                                }
                                else {
                                    icon += "<span class='" + iconClassName + "'></span>";
                                }
                            }
                        }
                        var newCellValue = indent + toggleButton + checkbox + icon + "<span class='" + that.toThemeProperty('jqx-tree-grid-title') + "'>" + cellvalue + "</span>";
                        if (!that.rtl) {
                            cellvalue = newCellValue;
                        }
                        else {
                            cellvalue = "<span class='" + that.toThemeProperty('jqx-tree-grid-title') + "'>" + cellvalue + "</span>" + icon + checkbox + toggleButton + indent;
                        }
                    }

                    if (grouping > 0 && isIE7 && j >= grouping) {
                        if (row[names.level] < grouping) {
                            tablecolumn += 'padding-left: 5px; border-left-width: 0px;'
                            pinnedcolumn += 'padding-left: 5px; border-left-width: 0px;'
                            cellvalue = "<span style='visibility: hidden;'>-</span>";
                        }
                    }

                    tablecolumn += '" class="' + cellclass + '">';
                    tablecolumn += cellvalue;
                    tablecolumn += '</td>';

                    pinnedcolumn += '" class="' + cellclass + '">';
                    pinnedcolumn += cellvalue;
                    pinnedcolumn += '</td>';

                    if (!column.pinned) {
                        tablerow += tablecolumn;
                        if (pinnedColumns) {
                            pinnedtablerow += pinnedcolumn;
                        }
                    }
                    else {
                        pinnedtablerow += tablecolumn;
                        tablerow += tablecolumn;
                    }

                    if (grouping > 0 && !isIE7) {
                        if (row[names.level] < grouping) {
                            break;
                        }
                    }
                }

                if (tablewidth == 0) {
                    that.table[0].style.width = left + 2 + 'px';
                    tablewidth = left;
                }

                tablerow += '</tr>';
                pinnedtablerow += '</tr>';
                tableHTML += tablerow;
                pinnedTableHTML += pinnedtablerow;
                if (that.rowdetails && !row.aggregate && this.rowDetailsRenderer) {
                    var details = '<tr data-role="row-details"><td valign="top" align="left" style="pointer-events: auto; max-width:' + width + 'px; width:' + width + 'px; overflow: hidden; border-left: none; border-right: none;" colspan="' + that.columns.records.length + '" role="gridcell"';
                    var cellclass = that.toTP('jqx-cell') + " " + that.toTP('jqx-grid-cell') + " " + that.toTP('jqx-item');
                    cellclass += ' ' + that.toTP('jqx-details');
                    cellclass += ' ' + that.toTP('jqx-reset');
                    var rowDetails = this.rowDetailsRenderer(key, row);
                    if (rowDetails) {
                        details += '" class="' + cellclass + '"><div style="pointer-events: auto; overflow: hidden;"><div data-role="details">' + rowDetails + '</div></div></td></tr>';
                        tableHTML += details;
                        pinnedTableHTML += details;
                    }
                }
            }
            tableHTML += '</table>';
            pinnedTableHTML += '</table>';

            if (pinnedColumns) {
                if (that.WinJS) {
                    MSApp.execUnsafeLocalFunction(function () {
                        that.table.html(pinnedTableHTML + tableHTML);
                    });
                }
                else {
                    that.table[0].innerHTML = pinnedTableHTML + tableHTML;
                }

                var t2 = that.table.find("#table" + that.element.id);
                var t1 = that.table.find("#pinnedtable" + that.element.id);

                t1.css('float', 'left');
                t1.css('pointer-events', 'none');
                t2.css('float', 'left');
                t1[0].style.position = "absolute";
                t2[0].style.position = "relative";
                t2[0].style.zIndex = zindex - 10;
                t1[0].style.zIndex = zindex + 10;
                that._table = t2;
                that._table[0].style.left = "0px";
                that._pinnedTable = t1;
                that._table[0].style.width = tablewidth + 'px';
                that._pinnedTable[0].style.width = tablewidth + 'px';
                if (that.rtl && that._haspinned) {
                    that._pinnedTable[0].style.left = 3 - tablewidth + parseInt(that.element.style.width) + 'px';
                }
            }
            else {
                if (that.WinJS) {
                    MSApp.execUnsafeLocalFunction(function () {
                        that.table.html(tableHTML);
                    });
                }
                else {
                    that.table[0].innerHTML = tableHTML;
                }
                var t = that.table.find("#table" + that.element.id);
                that._table = t;
                if ($.jqx.browser.msie && $.jqx.browser.version < 10) {
                    that._table[0].style.width = tablewidth + 'px';
                }
                if (pagesize === 0) {
                    that._table[0].style.width = (2 + tablewidth) + 'px';
                }
            }
            if (that.showaggregates) {
                that._updatecolumnsaggregates();
            }

            if (that._loading && pagesize == 0) {
                that._arrange();
                this._showLoadElement();
            }
            if (that.rendered) {
                that.rendered();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized == undefined || object.isInitialized == false)
                return;
        },

        checkrow: function (key, refresh) {
            var that = this.base;
            var names = that._names();
            if (that._loading) {
                return;
            }

            var me = this;
            var rowInfo = that.rowinfo[key];
            if (rowInfo) {
                rowInfo.checked = true;
                rowInfo.row[names.checked] = true;
                if (refresh !== false) {
                    that._renderrows();
                }
                that._raiseEvent('rowCheck', { key: key, row: rowInfo.row });
            }
            else {
                var row = this.getrow(key);
                if (row) {
                    that.rowinfo[key] = { row: row, checked: true }
                    that._raiseEvent('rowCheck', { key: key, row: row });
                }
            }
        },

        uncheckrow: function (key, refresh) {
            var that = this.base;
            var names = that._names();
            if (that._loading) {
                return;
            }

            var me = this;
            var rowInfo = that.rowinfo[key];
            if (rowInfo) {
                rowInfo.checked = false;
                rowInfo.row[names.checked] = false;
                if (refresh !== false) {
                    that._renderrows();
                }
                that._raiseEvent('rowUncheck', { key: key, row: rowInfo.row });
            }
            else {
                var row = this.getrow(key);
                if (row) {
                    that.rowinfo[key] = { row: row, checked: false }
                    that._raiseEvent('rowUncheck', { key: key, row: row });
                }
            }
        },

        expandrow: function (key) {
            var that = this.base;
            if (that._loading) {
                return;
            }

            var names = that._names();
            var me = this;
            var rowInfo = that.rowinfo[key];
            if (rowInfo) {
                if (rowInfo.expanded) {
                    rowInfo.row[names.expanded] = true;
                    return;
                }
                rowInfo.expanded = true;
                rowInfo.row[names.expanded] = true;
                if (rowInfo.originalRecord) {
                    rowInfo.originalRecord[names.expanded] = true;
                }

                if (this.virtualModeCreateRecords && !rowInfo.row.records) {
                    var done = function (records) {
                        if (records === false) {
                            that._loading = false;
                            me._hideLoadElement();
                            rowInfo.leaf = true;
                            rowInfo.row[names.leaf] = true;
                            that._renderrows();
                            return;
                        }

                        for (var i = 0; i < records.length; i++) {
                            records[i][names.level] = rowInfo.row[names.level] + 1;
                            records[i][names.parent] = rowInfo.row;
                            that.rowsByKey[records[i].uid] = records[i];
                            me.virtualModeRecordCreating(records[i]);
                        }
                        rowInfo.row.records = records;
                        if ((!records) || (records && records.length == 0)) {
                            rowInfo.leaf = true;
                            rowInfo.row[names.leaf] = true;
                        }
                        if (rowInfo.originalRecord) {
                            rowInfo.originalRecord.records = records;
                            rowInfo.originalRecord[names.expanded] = true;
                            if (records.length == 0) {
                                rowInfo.originalRecord[names.leaf] = true;
                            }
                        }

                        that._loading = false;
                        me._hideLoadElement();
                        var vScroll = that.vScrollBar.css('visibility');
                        that._renderrows();
                        that._updateScrollbars();
                        var requiresRefresh = vScroll != that.vScrollBar.css('visibility');
                        if (that.height === "auto" || that.height === null || that.autoheight || requiresRefresh) {
                            that._arrange();
                        }
                        that._renderhorizontalscroll();
                    }
                    if (!rowInfo.row[names.leaf]) {
                        that._loading = true;
                        this._showLoadElement();
                        this.virtualModeCreateRecords(rowInfo.row, done);
                        return;
                    }
                }

                var vScroll = that.vScrollBar.css('visibility');
                that._renderrows();
                that._updateScrollbars();
                var requiresRefresh = vScroll != that.vScrollBar.css('visibility');
                if (that.height === "auto" || that.height === null || that.autoheight || requiresRefresh) {
                    that._arrange();
                }
                that._renderhorizontalscroll();
            }
        },

        collapserow: function (key) {
            var that = this.base;
            var names = that._names();
            if (that._loading) {
                return;
            }
            var rowInfo = that.rowinfo[key];
            if (rowInfo) {
                if (!rowInfo.expanded) {
                    rowInfo.row[names.expanded] = false;
                    return;
                }
                rowInfo.expanded = false;
                rowInfo.row[names.expanded] = false;
                if (rowInfo.originalRecord) {
                    rowInfo.originalRecord[names.expanded] = false;
                }
                var vScroll = that.vScrollBar.css('visibility');
                that._renderrows();
                that._updateScrollbars();
                var requiresRefresh = vScroll != that.vScrollBar.css('visibility');
                if (that.height === "auto" || that.height === null || that.autoheight || requiresRefresh) {
                    that._arrange();
                }
                that._renderhorizontalscroll();
            }
        }
    });
})(jQuery);