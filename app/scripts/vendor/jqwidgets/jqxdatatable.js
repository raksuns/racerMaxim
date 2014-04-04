/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxDataTable", "", {});

    $.extend($.jqx._jqxDataTable.prototype, {
        defineInstance: function () {
            // sets the alternating row style.
            this.altrows = false;
            // sets the height of the aggregates.
            this.aggregatesheight = 34;
            // automatically displays the load element.
            this.autoshowloadelement = true;
            // enables/disables automatic row height.
            this.autorowheight = true;
            // sets the columns height.
            this.columnsheight = 30;
            // sets the columns.
            this.columns = [];
            // sets the column groups.
            this.columngroups = null;
            // enables the resizing of columns.
            this.columnsresize = false;
            // enables the reorder of columns.
            this.columnsreorder = false;
            // sets the grid data view.
            this.dataview = null;
            // enables or disables the grid.
            this.disabled = false;
            // enables or disables editing.
            this.editable = false;
            // sets the edit settings.
            this.editSettings = { saveOnPageChange: true, saveOnBlur: true, saveOnSelectionChange: true, cancelOnEsc: true, saveOnEnter: true, editOnDoubleClick: true, editOnF2: true };
            // enables the hover effect.
            this.enablehover = true;
            // enables the browser's selection.
            this.enablebrowserselection = false;
            // sets the columns height.
            this.filterheight = 30;
            // enables or disables filtering.
            this.filterable = false;
            // sets the filter mode. Possible values: "default", "simple", "advanced"
            this.filtermode = "default";
            // callback function called for rendering of the groups.
            this.groupsrenderer = null;
            // sets the groups.
            this.groups = new Array();
            // header z index.
            this.headerZIndex = 59;
            // sets the height.
            this.height = null;
            // callback function called for customization of the keyboard navigation.
            this.handlekeyboardnavigation = null;
            // sets the row details indent column widget.
            this.indentwidth = 25;
            // callback function called for row details initialization.
            this.initrowdetails = false;
            // this message is displayed when the user tries to call a method before the binding complete.
            this.loadingerrormessage = "The data is still loading and you cannot set a property or call a method. You can do that once the data binding is completed. jqxDataTable raises the 'bindingComplete' event when the binding is completed.";
            // sets the localization object.
            this.localization = null;
            // sets the pager's height.
            this.pagerheight = 28;
            // sets the default page size.
            this.pagesize = 10;
            // sets the available page sizes.
            this.pagesizeoptions = ['5', '10', '20'];
            // enables or disables paging.
            this.pageable = false;
            // sets pager's position. Possible values: "bottom", "top", "both".
            this.pagerposition = "bottom";
            // sets the pager's mode. Possible values: advanced, default
            this.pagermode = "default";
            // pager buttons count.
            this.pagerbuttonscount = 5;
            // callback function for customization of the pager's rendering.
            this.pagerrenderer = null;
            // callback function called when the widget is ready for usage.
            this.ready = null;
            // callback function called for rendering the tool bar.
            this.rendertoolbar = null;
            // shows the row details.
            this.rowdetails = false;
            // callback function called for rendering the status bar.
            this.renderstatusbar = null;
            // callback function called after the rendering.
            this.rendered = null;
            // callback function called before the rendering.
            this.rendering = null;
            // enables right-to-left.
            this.rtl = false;
            // enables or disables sorting.
            this.sortable = false;
            this.showtoolbar = false;
            // shows the status bar.
            this.showstatusbar = false;
            // sets the status bar's height.
            this.statusbarheight = 34;
            // enables the server processing.
            this.serverProcessing = false;
            // sets the selection mode.
            this.selectionmode = "multiplerows";
            // sets the scrollbar's size
            this.scrollbarsize = $.jqx.utilities.scrollBarSize;
            this.touchscrollbarsize = $.jqx.utilities.touchScrollBarSize;
            // sets the pager renderer.
            this.showaggregates = false;
            // shows or hides the grid's columns header.
            this.showheader = true;
            this.maxHeight = 999999;
            this.maxWidth = 999999;
            this.exportSettings = {
                columnsHeader: true,
                hiddenColumns: false,
                serverURL: null,
                characterSet: null,
                collapsedRecords: false,
                recordsInView: true,
                fileName: "jqxDataTable"
            }
            // sets the datatable's source.
            this.source =
            {
                beforeprocessing: null,
                beforesend: null,
                loaderror: null,
                localdata: null,
                data: null,
                datatype: 'array',
                // {name: name, map: map}
                datafields: [],
                url: "",
                root: '',
                record: '',
                id: '',
                totalrecords: 0,
                recordstartindex: 0,
                recordendindex: 0,
                loadallrecords: true,
                sortcolumn: null,
                sortdirection: null,
                sort: null,
                filter: null,
                sortcomparer: null
            };
            // toolbar height.
            this.toolbarheight = 34;
            // table z index.
            this.tableZIndex = 69;
            // private members
            this._updating = false;
            this.touchmode = 'auto';
            // sets the width.
            this.width = null;
            this.that = this;
            this.incrementalSearch = true;
            
            this.events =
	   	    [
                'bindingComplete',
                'sort',
                'filter',
                'pageChanged',
                'pageSizeChanged',
                'rowClick',
                'rowDoubleClick',
                'cellValueChanged',
                'rowBeginEdit',
                'rowEndEdit',
                'rowSelect',
                'rowUnselect',
                'rowCheck',
                'rowUncheck'
	   	    ];
        },

        createInstance: function (args) {
            if ($.jqx.utilities.scrollBarSize != 15) {
                this.scrollbarsize = $.jqx.utilities.scrollBarSize;
            }
            if (this.element.nodeName.toLowerCase() == "table") {
                var rows = this.host.find('tbody tr');
                // select columns.
                var columns = this.host.find('th');
                var dataFields = new Array();
                if (columns.length === 0) {
                    columns = rows[0];
                    rows.splice(0, 1);
                }

                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var datarow = {};
                    for (var j = 0; j < columns.length; j++) {
                        // get column's title.
                        var columnName = $.trim($(columns[j]).text());
                        if (i === 0) {
                            dataFields.push({ name: columnName });
                        }

                        var cell = $(row).find('td:eq(' + j + ')');
                        datarow[columnName] = $.trim(cell.text());
                    }
                    data[data.length] = datarow;
                }

                this.host.wrap('<div></div>');
                var parent = this.host.parent();
                var hostData = this.host.data();
                hostData.jqxDataTable.host = parent;
                hostData.jqxDataTable.element = parent[0];

                this.host.parent()[0].id = this.element.id;
                try
                {
                    this.host.parent()[0].style = this.element.style;
                }
                catch(error)
                {
                }
                this.element = parent[0];
                this.host = parent;
                this.host.data(hostData);
                if (this.source == null || this.source._source == null) {
                    var source =
                    {
                        dataFields: dataFields,
                        localdata: data,
                        datatype: "array"
                    };

                    var dataAdapter = new $.jqx.dataAdapter(source);
                    this.source = dataAdapter;
                }
            }

            if (this.source && !this.source.dataBind) {
                this.source = new $.jqx.dataAdapter(this.source);
            }
            var datafields = this.source._source.datafields;
            if (datafields && datafields.length > 0) {
                this._camelCase = this.source._source.dataFields !== undefined;
                this.selectionmode = this.selectionmode.toLowerCase();
            }

            if (this.host.attr("tabindex") == null) {
                this.host.attr('tabindex', '0');
            }
            this.host.attr('role', 'grid');
            this.host.attr('align', 'left');
            this.host.addClass(this.toTP('jqx-grid'));
            this.host.addClass(this.toTP('jqx-reset'));
            this.host.addClass(this.toTP('jqx-rc-all'));
            this.host.addClass(this.toTP('jqx-widget'));
            this.host.addClass(this.toTP('jqx-widget-content'));
            // check for missing modules.
            if (this._testmodules()) {
                return;
            }

            this.render(true);
            var that = this;
            $.jqx.utilities.resize(this.host, function () {
                var width = $(window).width();
                var height = $(window).height();
                var hostwidth = that.host.width();
                var hostheight = that.host.height();

                if (that._lastHostWidth != hostwidth || that._lastHostHeight != hostheight) {
                    that._updatesize(that._lastHostWidth != hostwidth, that._lastHostHeight != hostheight);
                }

                that._lastWidth = width;
                that._lastHeight = height;
                that._lastHostWidth = hostwidth;
                that._lastHostHeight = hostheight;
            });
        },

        _builddataloadelement: function () {
            if (this.dataloadelement) {
                this.dataloadelement.remove();
            }

            this.dataloadelement = $('<div style="z-index: 99998; background-color:rgba(50,50,50,0.1); overflow: hidden; position: absolute;"></div>');
            var table = $('<div style="z-index: 99999; margin-left: -66px; left: 50%; top: 50%; margin-top: -24px; position: relative; width: 100px; height: 33px; padding: 5px; font-family: verdana; font-size: 12px; color: #767676; border-color: #898989; border-width: 1px; border-style: solid; background: #f6f6f6; border-collapse: collapse;"><div style="float: left;"><div style="float: left; overflow: hidden; width: 32px; height: 32px;" class="jqx-grid-load"/><span style="margin-top: 10px; float: left; display: block; margin-left: 5px;" >' + this.gridlocalization.loadtext + '</span></div></div>');
            table.addClass(this.toTP('jqx-rc-all'));
            this.dataloadelement.addClass(this.toTP('jqx-rc-all'));
            table.addClass(this.toTP('jqx-fill-state-normal'));
            this.dataloadelement.append(table);
            this.dataloadelement.width(this.width);
            this.dataloadelement.height(this.height);

            this.host.prepend(this.dataloadelement);

            if (this.source._source.url != "") {
                var autoHeight = false;
                if (this.height === "auto" || this.height === null || this.autoheight) {
                    if (this.maxHeight == 999999) {
                        autoHeight = true;
                    }
                }
                if (autoHeight) {
                    this.host.height(100);
                    this.dataloadelement.height(100);
                }
                else {
                    this.host.height(this.height);
                    this.dataloadelement.height(this.height);
                }

                var autoWidth = false;
                if (this.width === "auto" || this.width === null || this.autoWidth) {
                    autoWidth = true;
                }
                if (autoWidth) {
                    this.host.width(300);
                    this.dataloadelement.width(300);
                }
                else {
                    this.host.width(this.width);
                    this.dataloadelement.width(this.width);
                }
            }
        },

        _measureElement: function (type) {
            var span = $("<span style='visibility: hidden; white-space: nowrap;'>measure Text</span>");
            span.addClass(this.toTP('jqx-widget'));
            $(document.body).append(span);
            if (type == 'cell') {
                this._cellheight = span.height();
            }
            else this._columnheight = span.height();
            span.remove();
        },

        _testmodules: function () {
            var missingModules = "";
            var that = this;
            var addComma = function () {
                if (missingModules.length != "") missingModules += ",";
            }

            if (!this.host.jqxScrollBar) {
                addComma();
                missingModules += " jqxscrollbar.js";
            }
            if (!this.host.jqxButton) {
                addComma();
                missingModules += " jqxbuttons.js";
            }
            if (!$.jqx.dataAdapter) {
                addComma();
                missingModules += " jqxdata.js";
            }
            if (missingModules != "" || this.editable || this.filterable || this.pageable) {
                var missingTypes = [];
                var addMissing = function (type) {
                    switch (type) {
                        case "checkbox":
                            if (!that.host.jqxCheckBox && !missingTypes['checkbox']) {
                                missingTypes['checkbox'] = true;
                                addComma();
                                missingModules += ' jqxcheckbox.js';
                            }
                            break;
                        case "dropdownlist":
                            if (!that.host.jqxDropDownList && !missingTypes['dropdownlist']) {
                                addComma();
                                missingTypes['dropdownlist'] = true;
                                missingModules += ' jqxdropdownlist.js(requires: jqxlistbox.js)';
                            }
                            else if (!that.host.jqxListBox && !missingTypes['listbox']) {
                                addComma();
                                missingTypes['listbox'] = true;
                                missingModules += ' jqxlistbox.js';
                            }
                            break;
                    }
                }

                if ((this.filterable && this.filtermode != "simple") || (this.pagermode == "advanced" && this.pageable)) {
                    addMissing('dropdownlist');
                }

                if (missingModules != "") {
                    throw new Error("jqxDataTable: Missing references to the following module(s): " + missingModules);
                    this.host.remove();
                    return true;
                }
            }
            return false;
        },

        focus: function () {
            try {
                this.wrapper.focus();
                var that = this;
                setTimeout(function () {
                    that.wrapper.focus();
                }, 10);
                this.focused = true;
            }
            catch (error) {
            }
        },

        hiddenParent: function () {
            return $.jqx.isHidden(this.host);
        },

        _updatesize: function (updateWidth, updateHeight) {
            if (this._loading) {
                return;
            }

            var that = this;

            var hostWidth = that.host.width();
            var hostHeight = that.host.height();

            if (!that._oldWidth) {
                that._oldWidth = hostWidth;
            }

            if (!that._oldHeight) {
                that._oldHeight = hostHeight;
            }

            if (that._resizeTimer != undefined) {
                clearTimeout(that._resizeTimer);
                that._resizeTimer = null;
            }

            var delay = $.jqx.browser.msie ? 30 : 30;

            that._resizeTimer = setTimeout(function () {
                clearTimeout(that._resizeTimer);
                that.resizingGrid = true;
                if ($.jqx.isHidden(that.host))
                    return;

                that._updatecolumnwidths();
                that.refresh();

                that._oldWidth = hostWidth;
                that._oldHeight = hostHeight;
                that.resizingGrid = false;
             }, delay);
        },

        resize: function(width, height)
        {
            if (width != undefined) {
                this.width = width;
            }
            if (height != undefined) {
                this.height = height;
            }
            this._updatecolumnwidths();
            this.refresh();
        },

        isTouchDevice: function () {
            if (this.touchDevice != undefined)
                return this.touchDevice;

            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            this.touchDevice = isTouchDevice;
            if (this.touchmode == true) {
                isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.element);
                this.touchDevice = isTouchDevice;
            }
            else if (this.touchmode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice) {
                this.touchDevice = true;
                this.host.addClass(this.toThemeProperty('jqx-touch'));
                this.host.find('jqx-widget-content').addClass(this.toThemeProperty('jqx-touch'));
                this.host.find('jqx-widget-header').addClass(this.toThemeProperty('jqx-touch'));
                this.scrollbarsize = this.touchscrollbarsize;
            }
            return isTouchDevice;
        },

        toTP: function (name) {
            return this.toThemeProperty(name);
        },

        localizestrings: function (localizationobj, refresh) {
            this._cellscache = new Array();
            if ($.jqx.dataFormat) {
                $.jqx.dataFormat.cleardatescache();
            }

            if (this._loading) {
                throw new Error('jqxDataTable: ' + this.loadingerrormessage);
                return false;
            }

            if (localizationobj != null) {
                for (var obj in localizationobj) {
                    if (obj.toLowerCase() !== obj) {
                        localizationobj[obj.toLowerCase()] = localizationobj[obj];
                    }
                }

                if (localizationobj.pagergotopagestring) {
                    this.gridlocalization.pagergotopagestring = localizationobj.pagergotopagestring;
                }
                if (localizationobj.pagershowrowsstring) {
                    this.gridlocalization.pagershowrowsstring = localizationobj.pagershowrowsstring;
                }
                if (localizationobj.pagerrangestring) {
                    this.gridlocalization.pagerrangestring = localizationobj.pagerrangestring;
                }
                if (localizationobj.pagernextbuttonstring) {
                    this.gridlocalization.pagernextbuttonstring = localizationobj.pagernextbuttonstring;
                }
                if (localizationobj.pagerpreviousbuttonstring) {
                    this.gridlocalization.pagerpreviousbuttonstring = localizationobj.pagerpreviousbuttonstring;
                }
                if (localizationobj.pagerfirstbuttonstring) {
                    this.gridlocalization.pagerfirstbuttonstring = localizationobj.pagerfirstbuttonstring;
                }
                if (localizationobj.pagerlastbuttonstring) {
                    this.gridlocalization.pagerlastbuttonstring = localizationobj.pagerlastbuttonstring;
                }
                if (localizationobj.toppagerstring) {
                    this.gridlocalization.toppagerstring = localizationobj.toppagerstring;
                }

                if (localizationobj.firstDay) {
                    this.gridlocalization.firstDay = localizationobj.firstDay;
                }
                if (localizationobj.days) {
                    this.gridlocalization.days = localizationobj.days;
                }
                if (localizationobj.months) {
                    this.gridlocalization.months = localizationobj.months;
                }
                if (localizationobj.AM) {
                    this.gridlocalization.AM = localizationobj.AM;
                }
                if (localizationobj.PM) {
                    this.gridlocalization.PM = localizationobj.PM;
                }
                if (localizationobj.patterns) {
                    this.gridlocalization.patterns = localizationobj.patterns;
                }
                if (localizationobj.percentsymbol) {
                    this.gridlocalization.percentsymbol = localizationobj.percentsymbol;
                }
                if (localizationobj.currencysymbol) {
                    this.gridlocalization.currencysymbol = localizationobj.currencysymbol;
                }
                if (localizationobj.currencysymbolposition) {
                    this.gridlocalization.currencysymbolposition = localizationobj.currencysymbolposition;
                }
                if (localizationobj.decimalseparator) {
                    this.gridlocalization.decimalseparator = localizationobj.decimalseparator;
                }
                if (localizationobj.thousandsseparator) {
                    this.gridlocalization.thousandsseparator = localizationobj.thousandsseparator;
                }
                if (localizationobj.filterapplystring) {
                    this.gridlocalization.filterapplystring = localizationobj.filterapplystring;
                }
                if (localizationobj.filteraddnew) {
                    this.gridlocalization.filteraddnew = localizationobj.filteraddnew;
                }
                if (localizationobj.filtercancelstring) {
                    this.gridlocalization.filtercancelstring = localizationobj.filtercancelstring;
                }
                if (localizationobj.filterclearstring) {
                    this.gridlocalization.filterclearstring = localizationobj.filterclearstring;
                }
                if (localizationobj.filterstring) {
                    this.gridlocalization.filterstring = localizationobj.filterstring;
                }
                if (localizationobj.filterstringcomparisonoperators) {
                    this.gridlocalization.filterstringcomparisonoperators = localizationobj.filterstringcomparisonoperators;
                }
                if (localizationobj.filternumericcomparisonoperators) {
                    this.gridlocalization.filternumericcomparisonoperators = localizationobj.filternumericcomparisonoperators;
                }
                if (localizationobj.filterdatecomparisonoperators) {
                    this.gridlocalization.filterdatecomparisonoperators = localizationobj.filterdatecomparisonoperators;
                }
                if (localizationobj.filterbooleancomparisonoperators) {
                    this.gridlocalization.filterbooleancomparisonoperators = localizationobj.filterbooleancomparisonoperators;
                }
                if (localizationobj.emptydatastring) {
                    this.gridlocalization.emptydatastring = localizationobj.emptydatastring;
                }
                if (localizationobj.filterselectstring) {
                    this.gridlocalization.filterselectstring = localizationobj.filterselectstring;
                }
                if (localizationobj.todaystring) {
                    this.gridlocalization.todaystring = localizationobj.todaystring;
                }
                if (localizationobj.clearstring) {
                    this.gridlocalization.clearstring = localizationobj.clearstring;
                }
                if (localizationobj.validationstring) {
                    this.gridlocalization.validationstring = localizationobj.validationstring;
                }
                if (localizationobj.loadtext) {
                    this.gridlocalization.loadtext = localizationobj.loadtext;
                }
                if (localizationobj.filtersearchstring) {
                    this.gridlocalization.filtersearchstring = localizationobj.filtersearchstring;
                }
                if (localizationobj.loadingerrormessage) {
                    this.gridlocalization.loadingerrormessage = localizationobj.loadingerrormessage;
                    this.loadingerrormessage = localizationobj.loadingerrormessage;
                }

                if (refresh !== false) {
                    this._builddataloadelement();
                    $(this.dataloadelement).css('visibility', 'hidden');
                    $(this.dataloadelement).css('display', 'none');
                }
            }
            else {
                this.gridlocalization =
                {
                    // separator of parts of a date (e.g. '/' in 11/05/1955)
                    '/': "/",
                    // separator of parts of a time (e.g. ':' in 05:44 PM)
                    ':': ":",
                    // the first day of the week (0 = Sunday, 1 = Monday, etc)
                    firstDay: 0,
                    days: {
                        // full day names
                        names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        // abbreviated day names
                        namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        // shortest day names
                        namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                    },
                    months: {
                        // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                        names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                        // abbreviated month names
                        namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
                    },
                    // AM and PM designators in one of these forms:
                    // The usual view, and the upper and lower case versions
                    //      [standard,lowercase,uppercase]
                    // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
                    //      null
                    AM: ["AM", "am", "AM"],
                    PM: ["PM", "pm", "PM"],
                    eras: [
                    // eras in reverse chronological order.
                    // name: the name of the era in this culture (e.g. A.D., C.E.)
                    // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                    // offset: offset in years from gregorian calendar
                    { "name": "A.D.", "start": null, "offset": 0 }
                    ],
                    twoDigitYearMax: 2029,
                    patterns: {
                        // short date pattern
                        d: "M/d/yyyy",
                        // long date pattern
                        D: "dddd, MMMM dd, yyyy",
                        // short time pattern
                        t: "h:mm tt",
                        // long time pattern
                        T: "h:mm:ss tt",
                        // long date, short time pattern
                        f: "dddd, MMMM dd, yyyy h:mm tt",
                        // long date, long time pattern
                        F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                        // month/day pattern
                        M: "MMMM dd",
                        // month/year pattern
                        Y: "yyyy MMMM",
                        // S is a sortable format that does not vary by culture
                        S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",
                        // formatting of dates in MySQL DataBases
                        ISO: "yyyy-MM-dd hh:mm:ss",
                        ISO2: "yyyy-MM-dd HH:mm:ss",
                        d1: "dd.MM.yyyy",
                        d2: "dd-MM-yyyy",
                        d3: "dd-MMMM-yyyy",
                        d4: "dd-MM-yy",
                        d5: "H:mm",
                        d6: "HH:mm",
                        d7: "HH:mm tt",
                        d8: "dd/MMMM/yyyy",
                        d9: "MMMM-dd",
                        d10: "MM-dd",
                        d11: "MM-dd-yyyy"
                    },
                    percentsymbol: "%",
                    currencysymbol: "$",
                    currencysymbolposition: "before",
                    decimalseparator: '.',
                    thousandsseparator: ',',
                    pagergotopagestring: "Go to page:",
                    pagershowrowsstring: "Show rows:",
                    pagerrangestring: " of ",
                    pagerpreviousbuttonstring: "previous",
                    pagernextbuttonstring: "next",
                    pagerfirstbuttonstring: "first",
                    pagerlastbuttonstring: "last",
                    filterapplystring: "Apply",
                    filtercancelstring: "Cancel",
                    filterclearstring: "Clear Filter",
                    filterstring: "advanced",
                    filtersearchstring: "Search:",
                    filterstringcomparisonoperators: ['empty', 'not empty', 'contains', 'contains(match case)',
                       'does not contain', 'does not contain(match case)', 'starts with', 'starts with(match case)',
                       'ends with', 'ends with(match case)', 'equal', 'equal(match case)', 'null', 'not null'],
                    filternumericcomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
                    filterdatecomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
                    filterbooleancomparisonoperators: ['equal', 'not equal'],
                    validationstring: "Entered value is not valid",
                    emptydatastring: "No data to display",
                    filterselectstring: "Select Filter",
                    loadtext: "Loading...",
                    clearstring: "Clear",
                    todaystring: "Today",
                    loadingerrormessage: "The data is still loading and you cannot set a property or call a method. You can do that once the data binding is completed. jqxDataTable raises the 'bindingComplete' event when the binding is completed."
                };
            }
        },

        _updateScrollbars: function (widgetHeight) {
            var autoWidth = false;
            if (this.width === "auto" || this.width === null || this.autowidth) {
                if (this.maxWidth == 999999) {
                    autoWidth = true;
                }
            }

            // scrollbar Size.
            var scrollSize = parseInt(this.scrollbarsize);
            var tableHeight = this.table ? this.table.height() : 0;
            var vOffset = 0;
            var visibility = "visible";
            var vScrollBarVisibility = this.vScrollBar[0].style.visibility;
            var hScrollBarVisibility = this.hScrollBar[0].style.visibility;
            if (!widgetHeight) {
                var hostHeight = this.host.height();
            }
            else {
                var hostHeight = widgetHeight;
            }

            if (!this.columngroups) {
                hostHeight -= this.showheader ? this.columnsheight : 0;
            }
            else {
                hostHeight -= this.showheader ? this.columnsheader.height() : 0;
            }

            if (this.filterable) {
                hostHeight -= this.filter.height();
            }
            if (this.pageable) {
                hostHeight -= this.pagerheight;
                if (this.pagerposition === "both") {
                    hostHeight -= this.pagerheight;
                }
            }
            if (this.showtoolbar) {
                hostHeight -= this.toolbarheight;
            }
            if (this.showstatusbar) {
                hostHeight -= this.statusbarheight;
            }
            if (this.showaggregates) {
                hostHeight -= this.aggregatesheight;
            }

            var autoHeight = false;
            if (this.height === "auto" || this.height === null || this.autoheight) {
                if (this.maxHeight == 999999) {
                    autoHeight = true;
                }
            }

            if (!autoHeight && tableHeight > hostHeight && (this.source.records.length > 0 || this.source.hierarchy.length > 0)) {
                this.vScrollBar[0].style.visibility = visibility;
                vOffset = 4 + parseInt(scrollSize);
                this.vScrollBar.jqxScrollBar({ max: tableHeight - hostHeight });
            }
            else {
                this.vScrollBar[0].style.visibility = "hidden";
            }

            if ((vScrollBarVisibility != this.vScrollBar[0].style.visibility)) {
                this._updatecolumnwidths();
            }

            var tableWidth = this.table ? this.table.width() : 0;
            if (tableWidth > 3) {
                tableWidth -= 3;
            }

            var borderWidth = parseInt(this.host.css('border-left-width')) + parseInt(this.host.css('border-right-width'));
            var hostWidth =  borderWidth + this.host.width() - vOffset;

            if (tableWidth > hostWidth && !autoWidth) {
                this.hScrollBar[0].style.visibility = visibility;
                this.hScrollBar.jqxScrollBar({ max: tableWidth - hostWidth });
                vOffset = 4 + parseInt(scrollSize);
                if (!autoHeight) {
                    if (tableHeight > hostHeight - vOffset + 4 && (this.source.records.length > 0 || this.source.hierarchy.length > 0)) {
                        this.hScrollBar.jqxScrollBar({ max: borderWidth + tableWidth - hostWidth });
                        var isHidden = this.vScrollBar[0].style.visibility === "hidden";
                        this.vScrollBar[0].style.visibility = visibility;
                        this._updatecolumnwidths();
                        if (isHidden) {
                            this.hScrollBar.jqxScrollBar({ max: tableWidth - hostWidth + vOffset + borderWidth });
                        }
                    }
                    this.vScrollBar.jqxScrollBar({ max: tableHeight - hostHeight + vOffset });
                }
            }
            else {
                this.hScrollBar[0].style.visibility = "hidden";
            }

            if (this.source.records.length === 0 && this.source.hierarchy.length === 0) {
                this.vScrollBar[0].style.visibility = "hidden";
                this.bottomRight[0].style.visibility = "hidden";
            }
        },

        _measureElementWidth: function (text) {
            var span = $("<span style='visibility: hidden; white-space: nowrap;'>" + text + "</span>");
            span.addClass(this.toTP('jqx-widget'));
            span.addClass(this.toTP('jqx-grid'));
            span.addClass(this.toTP('jqx-grid-column-header'));
            span.addClass(this.toTP('jqx-widget-header'));
            $(document.body).append(span);
            var w = span.outerWidth() + 20;
            span.remove();
            return w;
        },

        _arrangeAutoHeight: function (scrollOffset) {
            if (!scrollOffset) scrollOffset = 0;

            if (this.height === "auto" || this.height === null || this.autoheight) {
                var t = this.table.height();
                var heightTotal = 0;

                if (!this.columngroups) {
                    heightTotal += this.showheader ? this.columnsheight : -1;
                }
                else {
                    heightTotal += this.showheader ? this.columnsheader.height() : -1;
                }

                heightTotal += this.showstatusbar ? this.statusbarheight : 0;
                heightTotal += this.showaggregates ? this.aggregatesheight : 0;
                heightTotal += this.showtoolbar ? this.toolbarheight : 0;
                heightTotal += this.pageable ? this.pagerheight : 0;
                if (this.pagerposition === 'both') {
                    heightTotal += this.pageable ? this.pagerheight : 0;
                }
                heightTotal += t;
                if (this.filterable) {
                    var filterconditions = this.filter.find('.filterrow');
                    var filterconditionshidden = this.filter.find('.filterrow-hidden');
                    var filterrow = 1;
                    if (filterconditionshidden.length > 0) {
                        filterrow = 0;
                    }
                    heightTotal += this.filterheight - 1 + this.filterheight * filterconditions.length * filterrow;
                }
                if (heightTotal + scrollOffset > this.maxHeight) {
                    this.host.height(this.maxHeight);
                }
                else {
                    this.host.height(heightTotal + scrollOffset);
                }
                return true;
            }
            return false;
        },

        _arrangeAutoWidth: function (scrollOffset) {
            if (!scrollOffset) scrollOffset = 0;
            if (this.width === "auto" || this.width === null || this.autowidth) {
                var w = 0;
                for (var i = 0; i < this.columns.records.length; i++) {
                    var cw = this.columns.records[i].width;
                    if (this.columns.records[i].hidden) continue;
                    if (cw == 'auto') {
                        cw = this._measureElementWidth(this.columns.records[i].text);
                        w += cw;
                    }
                    else {
                        w += cw;
                    }
                }
                width = w;
                if (width + scrollOffset > this.maxWidth) {
                    this.host.width(this.maxWidth);
                }
                else {
                    this.host.width(width + scrollOffset);
                }
                return true;
            }
            return false;
        },

        _measureTopAndHeight: function () {
            var height = this.host.height();
            var top = 0;

            if (this.showtoolbar) {
                top += this.toolbarheight;
                height -= parseInt(this.toolbarheight);
            }

            if (this.filterable) {
                var filterconditions = this.filter.find('.filterrow');
                var filterconditionshidden = this.filter.find('.filterrow-hidden');
                var filterrow = 1;
                if (filterconditionshidden.length > 0) {
                    filterrow = 0;
                }

                top += this.filterheight;
                height -= parseInt(this.filterheight);

                var filterconditionslength = filterrow == 1 ? filterconditions.length : 0;
                top += this.filterheight * filterconditionslength;
                height -= this.filterheight * filterconditionslength;
            }
            if (this.pageable && this.pagerposition != 'bottom') {
                top += parseInt(this.pagerheight) + 1;
                if (height > this.pagerheight && this.pagerposition === "both") {
                    height -= parseInt(this.pagerheight);
                }
            }
            return { top: top, height: height };
        },

        _arrange: function () {
            if (!this.table) {
                return;
            }

            this._arrangeAutoHeight();
            this._arrangeAutoWidth();

            var width = this.host.width();
            var height = this.host.height();
            var hostHeight = height;
            var that = this;
            if (this.pageable) {
                if (this.pagerposition === "bottom") {
                    this.toppager[0].style.visibility = "hidden";
                    this.pager[0].style.visibility = "inherit";
                }
                else if (this.pagerposition === "both") {
                    this.toppager[0].style.visibility = "inherit";
                    this.pager[0].style.visibility = "inherit";
                }
                else if (this.pagerposition === "top") {
                    this.toppager[0].style.visibility = "inherit";
                    this.pager[0].style.visibility = "hidden";
                }
            }
            else {
                this.toppager[0].style.visibility = "hidden";
                this.pager[0].style.visibility = "hidden";
            }

            var top = 0;

            if (this.showtoolbar) {
                this.toolbar.width(width);
                this.toolbar.height(this.toolbarheight - 1);
                this.toolbar.css('top', 0);
                top += this.toolbarheight;
                height -= parseInt(this.toolbarheight);
            }
            else {
                this.toolbar[0].style.height = '0px';
            }

            if (this.filterable) {
                this.filter.width(width);
                this.filter.css('top', top);
                var filterconditions = this.filter.find('.filterrow');
                var filterconditionshidden = this.filter.find('.filterrow-hidden');
                var filterrow = 1;
                if (filterconditionshidden.length > 0) {
                    filterrow = 0;
                }

                this.filter.height(this.filterheight - 1 + this.filterheight * filterconditions.length * filterrow);
                top += this.filterheight;
                height -= parseInt(this.filterheight);

                var filterconditionslength = filterrow == 1 ? filterconditions.length : 0;
                top += this.filterheight * filterconditionslength;
                height -= this.filterheight * filterconditionslength;
            }

            if (this.showstatusbar) {
                this.statusbar.width(!this.table ? width : Math.max(width, this.table.width()));
                this.statusbar.height(this.statusbarheight - 1);
            }
            else {
                this.statusbar[0].style.height = '0px';
            }
            if (this.showaggregates) {
                this.aggregates.height(this.aggregatesheight - 1);
            }
            else {
                this.aggregates[0].style.height = '0px';
            }
            if (this.pageable && this.pagerposition != 'bottom') {
                this.toppager[0].style.width = width + 'px';
                this.toppager[0].style.height = parseInt(this.pagerheight) + 'px';
                this.toppager[0].style.top = parseInt(top) + 'px';
                top += parseInt(this.pagerheight) + 1;
                if (height > this.pagerheight) {
                    height -= parseInt(this.pagerheight);
                }
            }
            else {
                if (this.toppager[0].style.width != width + 'px') {
                    this.toppager[0].style.width = parseInt(width) + 'px';
                }
                if (this.toppager[0].style.height != this.pagerheight + 'px') {
                    this.toppager[0].style.height = parseInt(this.pagerheight) + 'px';
                }

                if (this.toppager[0].style.top != top + 'px') {
                    this.toppager[0].style.top = top + 'px';
                }

                var pagerheight = this.pagerposition != "bottom" ? this.pagerheight : 0;
                var newContentTop = top + pagerheight + 'px';
                if (this.content[0].style.top != newContentTop) {
                    this.content[0].style.top = top + this.pagerheight + 'px';
                }
            }

            // scrollbar Size.
            this._updateScrollbars(hostHeight);

            var scrollSize = parseInt(this.scrollbarsize);
            var scrollOffset = 4;
            var bottomSizeOffset = 2;
            var rightSizeOffset = 0;

            // right scroll offset. 
            if (this.vScrollBar[0].style.visibility == 'visible') {
                rightSizeOffset = scrollSize + scrollOffset;
            }

            // bottom scroll offset.
            if (this.hScrollBar[0].style.visibility == 'visible') {
                bottomSizeOffset = scrollSize + scrollOffset + 2;
            }
            if (this.showaggregates) {
                if (this.hScrollBar[0].style.visibility === "hidden") {
                    this.aggregates.width(!this.table ? width : Math.max(width, this.table.width()) + 4);
                }
                else {
                    this.aggregates.width('auto');
                }
            }

            if ("hidden" != this.vScrollBar[0].style.visibility || "hidden" != this.hScrollBar[0].style.visibility) {
                var autoHeight = this._arrangeAutoHeight(bottomSizeOffset - 2);
                var autoWidth = this._arrangeAutoWidth(rightSizeOffset + 1);
                if (autoHeight || autoWidth) {
                    var width = this.host.width();
                    this.toppager[0].style.width = parseInt(width) + 'px';
                    this.toolbar[0].style.width = parseInt(width) + 'px';
                    this.statusbar[0].style.width = parseInt(width) + 'px';
                    this.filter[0].style.width = parseInt(width) + 'px';
                }
                if (autoHeight) {
                    var measured = this._measureTopAndHeight();
                    top = measured.top;
                    height = measured.height;
                }
            }

            var pageheight = 0;
            if (this.pageable) {
                pageheight = this.pagerheight;
                if (this.pagerposition != "top") {
                    bottomSizeOffset += this.pagerheight;
                }
            }
            if (this.showaggregates) {
                bottomSizeOffset += this.aggregatesheight;
                pageheight += this.aggregatesheight;
            }
            if (this.showstatusbar) {
                bottomSizeOffset += this.statusbarheight;
                pageheight += this.statusbarheight;
            }

            if (this.hScrollBar[0].style.height != scrollSize + 'px') {
                this.hScrollBar[0].style.height = parseInt(scrollSize) + 'px';
            }

            if (this.hScrollBar[0].style.top != top + height - scrollOffset - scrollSize - pageheight + 'px' || this.hScrollBar[0].style.left != '0px') {
                this.hScrollBar[0].style.top = top + height - scrollOffset - scrollSize - pageheight - 1 + 'px';
                this.hScrollBar[0].style.left = '0px';
            }

            var hScrollWidth = this.hScrollBar[0].style.width;
            var hSizeChange = false;
            var vSizeChange = false;

            if (rightSizeOffset == 0) {
                if (hScrollWidth != (width - 2) + 'px') {
                    this.hScrollBar[0].style.width = (width - 2) + 'px'
                    hSizeChange = true;
                }
            }
            else {
                if (hScrollWidth != (width - scrollSize - scrollOffset) + 'px') {
                    this.hScrollBar[0].style.width = (width - scrollSize - scrollOffset + 'px');
                    hSizeChange = true;
                }
            }

            if (this.vScrollBar[0].style.width != scrollSize + 'px') {
                this.vScrollBar[0].style.width = scrollSize + 'px';
                vSizeChange = true;
            }
            if (this.vScrollBar[0].style.height != parseInt(height) - bottomSizeOffset + 'px') {
                this.vScrollBar[0].style.height = (parseInt(height) - bottomSizeOffset + 'px');
                vSizeChange = true;
            }
            if (this.vScrollBar[0].style.left != parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px' || this.vScrollBar[0].style.top != top + 'px') {
                this.vScrollBar[0].style.top = top + 'px';
                this.vScrollBar[0].style.left = parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px';
            }

            if (this.rtl) {
                this.vScrollBar.css({ left: '0px', top: top });
                if (this.vScrollBar.css('visibility') != 'hidden') {
                    this.hScrollBar.css({ left: scrollSize + 2 });
                }
            }

            var vScrollInstance = this.vScrollInstance;
            vScrollInstance.disabled = this.disabled;
            var hScrollInstance = this.hScrollInstance;
            hScrollInstance.disabled = this.disabled;
            if (hSizeChange) {
                hScrollInstance.refresh();
            }
            if (vSizeChange) {
                vScrollInstance.refresh();
            }

            var updateBottomRight = function (that) {
                if ((that.vScrollBar[0].style.visibility == 'visible') && (that.hScrollBar[0].style.visibility == 'visible')) {
                    that.bottomRight[0].style.visibility = 'visible';
                    that.bottomRight[0].style.left = 1 + parseInt(that.vScrollBar.css('left')) + 'px';
                    that.bottomRight[0].style.top = parseInt(that.hScrollBar.css('top')) + 'px';

                    if (that.rtl) {
                        that.bottomRight.css('left', '0px');
                    }

                    that.bottomRight[0].style.width = parseInt(scrollSize) + 3 + 'px';
                    that.bottomRight[0].style.height = parseInt(scrollSize) + 4 + 'px';
                    if (that.showaggregates) {
                        that.bottomRight.css('z-index', 99);
                        that.bottomRight.height(parseInt(scrollSize) + 4 + that.aggregatesheight);
                        that.bottomRight.css({ top: parseInt(that.hScrollBar.css('top')) - that.aggregatesheight });
                    }
                }
                else {
                    that.bottomRight[0].style.visibility = 'hidden';
                }
            }

            updateBottomRight(this);

            if (this.content[0].style.width != width - rightSizeOffset + 'px') {
                this.content[0].style.width = width - rightSizeOffset + 'px';
            }
            if (this.content[0].style.height != height - bottomSizeOffset + 3 + 'px') {
                this.content[0].style.height = height - bottomSizeOffset + 3 + 'px';
            }
            if (this.content[0].style.top != top + 'px') {
                this.content[0].style.top = parseInt(top) + 'px';
            }
            if (this.rtl) {
                this.content.css('left', rightSizeOffset);
                if (this.table) {
                    var tablewidth = this.table.width();
                    if (tablewidth < width - rightSizeOffset) {
                        this.content.css('left', width - tablewidth+2);
                    }
                }
            }

            if (this.showaggregates) {
                this.aggregates.css('top', top + height - this.aggregatesheight - (this.pageable ? this.pagerheight : 0) - (this.showstatusbar ? (this.statusbarheight + 1) : 0));
                if (this.rtl) {
                    this.aggregates.css('left', '0px');
                }

                if (this.hScrollBar.css('visibility') == 'visible') {
                    this.hScrollBar.css({ top: top + height - scrollOffset - scrollSize - pageheight + this.aggregatesheight + 'px' });
                    this.aggregates.css('top', 1 + top + height - scrollSize - 5 - this.aggregatesheight - (this.pageable ? this.pagerheight : 0) - (this.showstatusbar ? (this.statusbarheight + 1) : 0))
                }
                updateBottomRight(this);
            }

            if (this.showstatusbar) {
                this.statusbar.css('top', top + height - this.statusbarheight - (this.pageable ? this.pagerheight : 0));
                if (this.rtl) {
                    if (this.hScrollBar.css('visibility') != 'visible') {
                        this.statusbar.css('left', this.content.css('left'));
                    }
                    else {
                        this.statusbar.css('left', '0px');
                    }
                }
            }

            if (this.pageable) {
                this.pager[0].style.width = width + 'px';
                this.pager[0].style.height = this.pagerheight + 'px';
                this.pager[0].style.top = parseInt(top) + parseInt(height) - parseInt(this.pagerheight) - 1 + 'px';
            }
            else {
                this.pager[0].style.height = '0px';
            }

            this.vScrollBar[0].style.zIndex = this.tableZIndex + this.headerZIndex + 10 + this.columns.records.length;
            this.hScrollBar[0].style.zIndex = this.tableZIndex + this.headerZIndex + 10 + this.columns.records.length;

            if (width != parseInt(this.dataloadelement[0].style.width)) {
                this.dataloadelement[0].style.width = this.element.style.width;
            }
            if (height != parseInt(this.dataloadelement[0].style.height)) {
                this.dataloadelement[0].style.height = this.element.style.height;
            }
            this._hostwidth = width;
        },

        scrolloffset: function (top, left) {
            if (top == null || left == null || top == undefined || left == undefined)
                return;

            this.vScrollBar.jqxScrollBar('setPosition', top);
            this.hScrollBar.jqxScrollBar('setPosition', left);
        },

        scrollleft: function (left) {
            if (left == null || left == undefined)
                return;
            if (this.hScrollBar.css('visibility') != 'hidden') {
                this.hScrollBar.jqxScrollBar('setPosition', left);
            }
        },

        scrolltop: function (top) {
            if (top == null || top == undefined)
                return;
            if (this.vScrollBar.css('visibility') != 'hidden') {
                this.vScrollBar.jqxScrollBar('setPosition', top);
            }
        },

        beginupdate: function () {
            this._updating = true;
            this._datachanged = false;
        },

        endupdate: function (refresh) {
            this._updating = false;

            if (refresh === false) {
                return;
            }

            this._rendercolumnheaders();
            this.refresh();
        },

        updating: function () {
            return this._updating;
        },

        databind: function (source, reason, done) {
            if (this.loadingstate === true) {
                return;
            }

            if (this.host.css('display') == 'block') {
                if (this.autoshowloadelement) {
                    $(this.dataloadelement).css('visibility', 'visible');
                    $(this.dataloadelement).css('display', 'block');
                    this.dataloadelement.width(this.host.width());
                    this.dataloadelement.height(this.host.height());
                }
                else {
                    $(this.dataloadelement).css('visibility', 'hidden');
                    $(this.dataloadelement).css('display', 'none');
                }
            }

            var that = this;
            if (source == null) {
                source = {};
            }

            if (source.sortcomparer == undefined || source.sortcomparer == null) {
                source.sortcomparer = null;
            }
            if (source.filter == undefined || source.filter == null) {
                source.filter = null;
            }
            if (source.sort == undefined || source.sort == null) {
                source.sort = null;
            }
            if (source.data == undefined || source.data == null) {
                source.data = null;
            }

            var url = null;
            if (source != null) {
                url = source._source != undefined ? source._source.url : source.url;
            }
            this.dataview = this.dataview || new $.jqx.dataView();
 
            this.dataview.pageable = this.pageable;
            this.dataview.grid = this;
            if (!that.initializedcall) {
                if (source._source) {
                    if (this.sortable) {
                        if (source._source.sortcolumn != undefined) {
                            this.sortcolumn = source._source.sortcolumn;
                            this.source.sortcolumn = this.sortcolumn;
                            this.dataview.sortfield = source._source.sortcolumn;
                            source._source.sortcolumn = null;
                        }
                        if (source._source.sortdirection != undefined) {
                            this.dataview.sortfielddirection = source._source.sortdirection;
                            var sortdirection = source._source.sortdirection;
                            if (sortdirection == 'a' || sortdirection == 'asc' || sortdirection == 'ascending' || sortdirection == true) {
                                var ascending = true;
                            }
                            else {
                                var ascending = false;
                            }

                            if (sortdirection != null) {
                                this.sortdirection = { 'ascending': ascending, 'descending': !ascending };
                            }
                            else {
                                this.sortdirection = { 'ascending': false, 'descending': false };
                            }
                        }
                    }
                }
                if (this.pageable) {
                    if (source._source) {
                        if (source._source.pagenum != undefined) {
                            this.dataview.pagenum = source._source.pagenum;
                        }
                        if (source._source.pagesize != undefined) {
                            this.pagesize = source._source.pagesize;
                            this.dataview.pagesize = source._source.pagesize;
                        }
                        else {
                            this.dataview.pagesize = source._source.pagesize;
                            if (this.dataview.pagesize == undefined)
                                this.dataview.pagesize = this.pagesize;
                        }
                    }
                }
                if (this.sortable) {
                    if (source.sortcolumn) {
                        this.dataview.sortfield = source.sortcolumn;
                    }
                    if (source.sortdirection) {
                        this.dataview.sortfielddirection = source.sortdirection;
                    }
                }
            }

            this._loading = true;

            this.dataview.update = function (rowschanged) {
                that._loading = false;
                that.rowsByKey = new Array();
 
                var datafields = that.source._source.datafields;
                if (that.groups && that.groups.length > 0) {
                    var tmpToString = Object.prototype.toString;
                    var field = that.groups[0];
                    Object.prototype.toString = (typeof field == "function") ? field : function () { return this[field] };
                    if (!that.source.records.sort) {
                        var items = new Array();
                        var index = 0;
                        $.each(data, function () {
                            items[startindex + index++] = this;
                        });
                        data = items;
                    }

                    that.source.records.sort(function (value1, value2) {
                        if (value1 === undefined) { value1 = null; }
                        if (value2 === undefined) { value2 = null; }
                        if (value1 === null && value2 === null) {
                            return 0;
                        }
                        if (value1 === null && value2 !== null) {
                            return -1;
                        }
                        if (value1 !== null && value2 === null) {
                            return 1;
                        }

                        value1 = value1.toString();
                        value2 = value2.toString();

                        if ($.jqx.dataFormat.isNumber(value1) && $.jqx.dataFormat.isNumber(value2)) {
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        }
                        else if ($.jqx.dataFormat.isDate(value1) && $.jqx.dataFormat.isDate(value2)) {
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        }
                        else if (!$.jqx.dataFormat.isNumber(value1) && !$.jqx.dataFormat.isNumber(value2)) {
                            value1 = String(value1).toLowerCase();
                            value2 = String(value2).toLowerCase();
                        }

                        try {
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                        }
                        catch (error) {
                            var er = error;
                        }

                        return 0;
                    });

                    Object.prototype.toString = tmpToString;
                }

                for (var i = 0; i < that.source.records.length; i++) {
                    var row = that.source.records[i];
                    that.rowsByKey[row.uid] = row;
                    if (row.records && row.records.length > 0) {
                        var fillRowsByKey = function (records) {
                            for (var j = 0; j < records.length; j++) {
                                if (!records[j])
                                    continue;

                                that.rowsByKey[records[j].uid] = records[j];
                                if (records[j].records && records[j].records.length > 0) {
                                    fillRowsByKey(records[j].records);
                                }
                            }
                        }
                        fillRowsByKey(row.records);
                    }

                    if (i === 0) {
                        var emptyType = false;
                        if (datafields) {
                            for (var j = 0; j < datafields.length; j++) {
                                if (!datafields[j].type) {
                                    emptyType = true;
                                    datafields[j].type = "string";
                                    var cell = row[datafields[j].name];
                                    if (cell === true || cell === false) {
                                        datafields[j].type = "boolean";
                                    }
                                    if (cell != null && cell.toString().indexOf(that.gridlocalization.currencysymbol) > -1 || cell.toString().indexOf(that.gridlocalization.percentsymbol) > -1) {
                                        cell = new Number(that._toNumber(cell.toString()));
                                        if (!isNaN(cell)) {
                                            datafields[j].type = "number";
                                        }
                                    }
                                    if ($.jqx.dataFormat.isNumber(cell) || (!isNaN(parseFloat(cell)) && isFinite(cell))) {
                                        datafields[j].type = "number";
                                    }
                                    if ($.jqx.dataFormat.isDate(cell)) {
                                        datafields[j].type = "date";
                                    }
                                }
                            }
                        }
                        if (emptyType) {
                            for (var j = 0; j < datafields.length; j++) {
                                var value = that.source.getvaluebytype(row[datafields[j].name], datafields[j]);
                                if (value != null && datafields[j].type == "number") {
                                    var tmp = value;
                                    tmp = new Number(that._toNumber(tmp.toString()));
                                    if (!isNaN(tmp)) {
                                        value = tmp;
                                    }
                                }

                                row[datafields[j].name] = value;
                            }
                        }
                    }
                }

                if (reason === "pager" || reason === "filter" || reason === "sort") {
                    that.refresh();
                }
                else {
                    that._render();
                }
                if (that.autoshowloadelement && !that._loading) {
                    $(that.dataloadelement).css('visibility', 'hidden');
                    $(that.dataloadelement).css('display', 'none');
                }

                if (that.pageable) {
                    if (!that.disabled) {
                        if (that["pagernexttop"]) {
                            that["pagerfirsttop"].jqxButton({ disabled: false });
                            that["pagerfirstbottom"].jqxButton({ disabled: false });
                            that["pagerlasttop"].jqxButton({ disabled: false });
                            that["pagerlastbottom"].jqxButton({ disabled: false });
                            that["pagernexttop"].jqxButton({ disabled: false });
                            that["pagerprevioustop"].jqxButton({ disabled: false });
                            if (that["pagershowrowscombotop"].jqxDropDownList) {
                                if (that.pagermode == "advanced") {
                                    that["pagershowrowscombotop"].jqxDropDownList({ disabled: false });
                                    that["pagershowrowscombobottom"].jqxDropDownList({ disabled: false });
                                }
                            }
                            that["pagernextbottom"].jqxButton({ disabled: false });
                            that["pagerpreviousbottom"].jqxButton({ disabled: false });
                        }
                    }
                }
                that._updateTouchScrolling();
                that._raiseEvent('bindingComplete');
                if (done) {
                    done();
                }
                if (!that.initializedcall) {
                    that.initializedcall = true;
                    that.isInitialized = true;
                    if (that.ready) {
                        that.ready();
                    }
                    if ((that.width != null && that.width.toString().indexOf('%') != -1) || (that.height != null && that.height.toString().indexOf('%') != -1)) {
                        that._updatesize(true);
                    }

                    if (that.host.css('visibility') == 'hidden') {
                        var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;

                        if (that.vScrollBar.css('visibility') == 'visible') {
                            that.vScrollBar.css('visibility', 'inherit');
                        }

                        if (that.hScrollBar.css('visibility') == 'visible') {
                            that.hScrollBar.css('visibility', 'inherit');
                        }

                        that._intervalTimer = setInterval(function () {
                            if (that.host.css('visibility') == 'visible') {
                                that._updatesize(true);
                                clearInterval(that._intervalTimer);
                            }
                        }, 100);
                    }
                }
            }

            this.dataview.databind(source);
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = id;
            args = arg;
            args.owner = this;

            var event = new jQuery.Event(evt);
            event.owner = this;
            event.args = args;
            var result = this.host.trigger(event);

            // save the new event arguments.
            arg = event.args;
            return result;
        },

        ensurecolumnvisible: function (datafield) {
            var width = 0;
            var lastWidth = 0;
            for (var i = 0; i < this.columns.records.length; i++) {
                if (this.columns.records[i].datafield != datafield) {
                    width += this.columns.records[i].width;
                }
                else {
                    width += this.columns.records[i].width;
                    lastWidth = this.columns.records[i].width;
                    break;
                }
            }
            if (this.hScrollBar.css('visibility') != 'hidden') {
                var left = this.hScrollBar.jqxScrollBar('value');
                var right = left + this.host.width();
                if (left > width - lastWidth) {
                    this.hScrollBar.jqxScrollBar('setPosition', width - lastWidth);
                }
                else if (width > right) {
                    this.hScrollBar.jqxScrollBar('setPosition', left + width - right);
                }
            }
        },

        ensurerowvisiblebykey: function (key) {
            if (this.vScrollBar[0].style.visibility === "hidden") {
                return false;
            }
            var item = this._getuirow(key);
            if (!item) {
                return;
            }

            var value = this.vScrollBar.jqxScrollBar('value');
            var tableheight = this.host.height();
            var headerHeight = 0;
            if (!this.columngroups) {
                headerHeight += this.showheader ? this.columnsheight : 0;
            }
            else {
                headerHeight += this.showheader ? this.columnsheader.height() : 0;
            }

            if (this.filterable) {
                headerHeight += this.filter.height();
            }
            if (this.pageable) {
                if (this.pagerposition === "top") {
                    headerHeight += this.pagerheight;
                }
            }
            if (this.showtoolbar) {
                headerHeight += this.toolbarheight;
            }

            tableheight -= headerHeight;
            if (this.pageable && this.pagerposition !== "top") {
                tableheight -= this.pagerheight;
            }
            if (this.showstatusbar) {
                tableheight -= this.statusbarheightt;
            }
            if (this.showaggregates) {
                tableheight -= this.aggregatesheight;
            }
            if (this.hScrollBar.css('visibility') != 'hidden') {
                tableheight -= 20;
            }

            var tableTop = this.host.coord().top + headerHeight;

            var view_top = value;
            var view_bottom = tableheight + view_top;

            var item_top = item.coord().top + value - tableTop;
            item_top = Math.round(item_top);
            var item_bottom = item_top + item.outerHeight();
            item_bottom = Math.round(item_bottom);
            if (Math.round(item.position().top) === 0) {
                return this.vScrollBar.jqxScrollBar('setPosition', 0);
            }
            else {
                var lastindex = $(this._table.children()[1]).children().length - 1;
                var rowKey = this._getuikey(lastindex);
                var lastItem = this._getuirow(rowKey);
                if (lastItem) {
                    if (lastItem[0] === item[0]) {
                        return this.vScrollBar.jqxScrollBar('setPosition', this.vScrollBar.jqxScrollBar('max'));
                    }
                }
            }

            if (item_top < view_top) {
                var topOffset = item_top - item.height();
                if (topOffset < 0) topOffset = 0;
                return this.vScrollBar.jqxScrollBar('setPosition', topOffset);
            }

            if (item_bottom > view_bottom) {
                return this.vScrollBar.jqxScrollBar('setPosition', 4 + item_bottom - tableheight);
            }
        },

        ensurerowvisible: function (index) {
            var key = this._getkey(index);
            this.ensurerowvisiblebykey(key);
        },

        getcolumn: function (datafield) {
            var column = null;
            if (this.columns.records) {
                $.each(this.columns.records, function () {
                    if (this.datafield == datafield || this.displayfield == datafield) {
                        column = this;
                        return false;
                    }
                });
            }
            return column;
        },

        _setcolumnproperty: function (datafield, propertyname, value) {
            if (datafield == null || propertyname == null || value == null)
                return null;

            propertyname = propertyname.toLowerCase();
            var column = this.getcolumn(datafield);
            if (column == null)
                return;

            var oldvalue = column[propertyname];
            column[propertyname] = value;

            var _cachedcolumn = this.getcolumn(datafield);
            if (_cachedcolumn != null) {
                _cachedcolumn[propertyname] = value;
            }

            switch (propertyname) {
                case "filteritems":
                case "text":
                case "editable":
                case "resizable":
                case "draggable":
                case "hidden":
                case "hideable":
                case "renderer":
                case "cellsrenderer":
                case "align":
                case "aggregates":
                case "cellsalign":
                case "cellsformat":
                case "pinned":
                case "contenttype":
                case "filterable":
                case "groupable":
                case "cellclass":
                case "cellclassname":
                case "class":
                case "width":
                case "minwidth":
                case "maxwidth":
                    if (propertyname == "align") {
                        this._rendercolumnheaders();
                        this.refresh();
                    }
                    else if (propertyname == "hidden" || propertyname == "pinned" || propertyname == "resizable" || propertyname == "renderer") {
                        this._rendercolumnheaders();
                        this.refresh();
                    }
                    else if (propertyname == "width" || propertyname == "maxwidth" || propertyname == "minwidth") {
                        column['_width'] = null;
                        column['_percentagewidth'] = null;

                        this._updatecolumnwidths();
                        this.refresh();
                    }
                    else {
                        this.refresh();
                    }
                    break;
            }
        },

        getcolumnproperty: function (datafield, propertyname) {
            if (datafield == null || propertyname == null)
                return null;

            propertyname = propertyname.toLowerCase();

            var column = this.getcolumn(datafield);
            return column[propertyname];
        },

        // sets a property of a column.
        setcolumnproperty: function (datafield, propertyname, value) {
            this._setcolumnproperty(datafield, propertyname, value);
        },

        // hides a column.
        hidecolumn: function (datafield) {
            this._setcolumnproperty(datafield, 'hidden', true);
        },

        // shows a column.
        showcolumn: function (datafield) {
            this._setcolumnproperty(datafield, 'hidden', false);
        },

        updatebounddata: function (reason, done) {
            this.databind(this.source, reason, done);
        },

        refresh: function (initialRefresh) {
            if (initialRefresh != true) {
                if ($.jqx.isHidden(this.host))
                    return;

                this.vScrollInstance.setPosition(0);
                this._renderrows();
                this.updatepagerdetails();
                this._arrange();
                this._renderhorizontalscroll();
                this._showicons();
                if (this.showaggregates) {
                    this._updateaggregates();
                }
                this._updateTouchScrolling();
            }
        },

        _updateTouchScrolling: function () {
            var that = this.that;
            if (that.isTouchDevice()) {
                var touchstart = $.jqx.mobile.getTouchEventName('touchstart');
                var touchend = $.jqx.mobile.getTouchEventName('touchend');
                var touchmove = $.jqx.mobile.getTouchEventName('touchmove');
                if (that.gridcontent) {
                    that.removeHandler(that.gridcontent, touchstart + '.touchScroll');
                    that.removeHandler(that.gridcontent, touchmove + '.touchScroll');
                    that.removeHandler(that.gridcontent, touchend + '.touchScroll');
                    that.removeHandler(that.gridcontent, 'touchcancel.touchScroll');

                    $.jqx.mobile.touchScroll(that.gridcontent[0], Math.max(that.vScrollInstance.max, that.hScrollInstance.max), function (left, top) {
                        if (that.vScrollBar.css('visibility') == 'visible') {
                            var oldValue = that.vScrollInstance.value;
                            that.vScrollInstance.setPosition(oldValue + top);
                        }
                        if (that.hScrollBar.css('visibility') == 'visible') {
                            var oldValue = that.hScrollInstance.value;
                            that.hScrollInstance.setPosition(oldValue + left);
                        }
                        that.scrolled = new Date();
                        that.vScrollInstance.thumbCapture = true;
                    }, this.element.id, this.hScrollBar, this.vScrollBar);
                }
            }
        },

        _showicons: function () {
            if (!this.table) {
                return;
            }

            for (var i = 0; i < this.columns.records.length; i++) {
                var column = this.columns.records[i];
                $(column.filtericon).hide();
                $(column.sortasc).hide();
                $(column.sortdesc).hide();
                if (this.filtermode !== "simple") {
                    for (var j = 0; j < this.dataview.filters.length; j++) {
                        var filtergroup = this.dataview.filters[j];
                        if (filtergroup.datafield === column.displayfield) {
                            $(column.filtericon).show();
                            break;
                        }
                    }
                }

                if (this.sortcolumn !== null) {
                    if (this.sortcolumn === column.displayfield) {
                        if (this.sortdirection != null) {
                            if (this.sortdirection.ascending) {
                                $(column.sortasc).show();
                            }
                            else {
                                $(column.sortdesc).show();
                            }
                        }
                    }
                }
                if ((column.align != "left" && column.align != "center" && !this.rtl) || (this.rtl && column.align != "right" && column.align != "center")) {
                    var offset = $.jqx.isHidden($(column.filtericon)) ? 0 : 16;
                    offset += $.jqx.isHidden($(column.sortasc)) ? 0 : 16;
                    offset += $.jqx.isHidden($(column.sortdesc)) ? 0 : 16;
                    var columnContent = $($($(column.element).children()[0]).children()[0]);
                    if (!this.rtl) {
                        if (offset > 0) {
                            columnContent.css('margin-right', 4 + offset + 'px');
                        }
                        else {
                            columnContent.css('margin-right', '4px');
                        }
                    }
                    else {
                        if (offset > 0) {
                            columnContent.css('margin-left', 4 + offset + 'px');
                        }
                        else {
                            columnContent.css('margin-left', '4px');
                        }
                    }
                }
            }
        },

        render: function (init) {
            var gridStructure = "<div style='overflow: hidden; -webkit-appearance: none; outline: none; width:100%; height: 100%; align:left; border: 0px; padding: 0px; margin: 0px; left: 0px; top: 0px; valign:top; position: relative;'>" +
                       "<div id='wrapper" + this.element.id + "' style='overflow: hidden; -webkit-appearance: none; border: none; background: transparent; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; align:left; left: 0px; top: 0px; valign:top; position: relative;'>" +
                       "<div id='toolbar' style='visibility: hidden; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='toppager' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='filter' style='visibility: hidden; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='content" + this.element.id + "' style='overflow: hidden; -webkit-appearance: none; border: none; background: transparent; outline: none; border: none; padding: 0px; margin-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='verticalScrollBar" + this.element.id + "' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='horizontalScrollBar" + this.element.id + "' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='bottomRight' style='align:left; valign:top; left: 0px; top: 0px; border: none; position: absolute;'></div>" +
                       "<div id='aggregates' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='statusbar' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "<div id='pager' style='z-index: 20; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                       "</div>" +
                       "</div>";

            this.element.innerText = '';
            this.element.innerHTML = gridStructure;
            this.wrapper = this.host.find("#wrapper" + this.element.id);
            this.content = this.host.find("#content" + this.element.id);
            this.content.addClass(this.toTP('jqx-reset'));

            var verticalScrollBar = this.host.find("#verticalScrollBar" + this.element.id);
            var horizontalScrollBar = this.host.find("#horizontalScrollBar" + this.element.id);
            this.bottomRight = this.host.find("#bottomRight").addClass(this.toTP('jqx-grid-bottomright')).addClass(this.toTP('jqx-scrollbar-state-normal'));
            if (this.vScrollBar) {
                this.vScrollBar.jqxScrollBar('destroy');
            }
            if (this.hScrollBar) {
                this.hScrollBar.jqxScrollBar('destroy');
            }

            this.vScrollBar = verticalScrollBar.jqxScrollBar({ 'vertical': true, rtl: this.rtl, touchMode: this.touchmode, theme: this.theme, _triggervaluechanged: false });
            this.hScrollBar = horizontalScrollBar.jqxScrollBar({ 'vertical': false, rtl: this.rtl, touchMode: this.touchmode, theme: this.theme, _triggervaluechanged: false });
            this.vScrollBar.css('visibility', 'hidden');
            this.hScrollBar.css('visibility', 'hidden');

            this.vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            this.hScrollInstance = $.data(this.hScrollBar[0], 'jqxScrollBar').instance;

            this.filter = this.host.find("#filter");
            this.filter[0].id = "filter" + this.element.id;
            this.filter.addClass(this.toTP('jqx-widget-header'));
            this.filter.addClass(this.toTP('jqx-grid-toolbar'));

            this.pager = this.host.find("#pager");
            this.pager[0].id = "pager" + this.element.id;
            this.toolbar = this.host.find("#toolbar");
            this.toolbar[0].id = "toolbar" + this.element.id;
            this.toolbar.addClass(this.toTP('jqx-grid-toolbar'));
            this.toolbar.addClass(this.toTP('jqx-widget-header'));

            this.aggregates = this.host.find("#aggregates");
            this.aggregates[0].id = "aggregates" + this.element.id;
            this.aggregates.addClass(this.toTP('jqx-grid-statusbar'));
            this.aggregates.addClass(this.toTP('jqx-widget-header'));

            this.statusbar = this.host.find("#statusbar");
            this.statusbar[0].id = "statusbar" + this.element.id;
            this.statusbar.addClass(this.toTP('jqx-grid-statusbar'));
            this.statusbar.addClass(this.toTP('jqx-widget-header'));

            this.pager.addClass(this.toTP('jqx-grid-pager'));
            this.pager.addClass(this.toTP('jqx-widget-header'));

            this.toppager = this.host.find("#toppager");
            this.toppager.addClass(this.toTP('jqx-grid-pager-top'));
            this.toppager.addClass(this.toTP('jqx-widget-header'));
            this.gridtable = null;

            if (this.localizestrings) {
                this.localizestrings();
                if (this.localization != null) {
                    this.localizestrings(this.localization, false);
                }
            }

            this._builddataloadelement();
            this._cachedcolumns = this.columns;
            var datafields = this.source.datafields;
            if (datafields == null && this.source._source) {
                datafields = this.source._source.datafields;
            }

            if (datafields) {
                for (var m = 0; m < this.columns.length; m++) {
                    var column = this.columns[m];
                    if (column && column.cellsformat && column.cellsformat.length > 2) {
                        for (var t = 0; t < datafields.length; t++) {
                            if (datafields[t].name == column.datafield && !datafields[t].format) {
                                datafields[t].format = column.cellsformat;
                                break;
                            }
                        }
                    }
                }
            }

            this.databind(this.source);

            if (this.showtoolbar) {
                this.toolbar.css('visibility', 'visible');
            }
            if (this.showstatusbar) {
                this.statusbar.css('visibility', 'visible');
            }
            if (this.showaggregates) {
                this.aggregates.css('visibility', 'visible');
            }

            this.tableheight = null;
            var that = this;
            var clearoffset = function () {
                if (that.content) {
                    that.content[0].scrollTop = 0;
                    that.content[0].scrollLeft = 0;
                }
                if (that.gridcontent) {
                    that.gridcontent[0].scrollLeft = 0;
                    that.gridcontent[0].scrollTop = 0;
                }
            }

            this.removeHandler(this.content, 'scroll');
            this.removeHandler(this.content, 'mousedown');

            this.addHandler(this.content, 'scroll',
            function (event) {
                clearoffset();
                return false;
            });

            if (init !== true) {
                this._render();
            }
        },

        _render: function () {
            if (this.dataview == null)
                return;

            if (this._loading) {
                return;
            }

            if (this.columnsheight != 25 || this.columngroups) {
                this._measureElement('column');
            }

            if (this.filterable) {
                this.filter[0].style.visibility = "visible";
            }
            else {
                this.filter[0].style.visibility = "hidden";
            }

            this.rowinfo = new Array();
            this._removeHandlers();

            if (this.columns == null) {
                this.columns = new $.jqx.collection(this.element);
            }
            else {
                this._initializeColumns();
            }

            this.host.height(this.height);
            this.host.width(this.width);

            $.jqx.utilities.html(this.content, '');
            this.columnsheader = this.columnsheader || $('<div style="overflow: hidden;"></div>');
            this.columnsheader.remove();
            this.columnsheader.addClass(this.toTP('jqx-widget-header'));
            this.columnsheader.addClass(this.toTP('jqx-grid-header'));

            if (!this.showheader) {
                this.columnsheader.css('display', 'none');
            }
            else {
                if (this.columnsheader) {
                    this.columnsheader.css('display', 'block');
                }
            }

            this.gridcontent = this.gridcontent || $('<div style="width: 100%; overflow: hidden; position: absolute;"></div>');
            this.gridcontent.remove();

            var columnsheight = this.columnsheight;
            columnsheight = this._preparecolumngroups();
            this.columnsheader.height(columnsheight);

            this.content.append(this.columnsheader);
            this.content.append(this.gridcontent);

            this._rendercolumnheaders();

            this.tableheight = null;

            this.gridcontent.find('#contenttable' + this.element.id).remove();
            if (this.table != null) {
                this.table.remove();
                this.table = null;
            }

            this.table = $('<div id="contenttable' + this.element.id + '" style="overflow: hidden; position: relative;"></div>');
            this.gridcontent.addClass(this.toTP('jqx-grid-content'));
            this.gridcontent.addClass(this.toTP('jqx-widget-content'));
            this.gridcontent.append(this.table);
            this._renderrows();

            if (this.filterable) {
                this._renderfilter();
            }
            if (this.pageable) {
                this._initpager();
            }

            this._arrange();

            if (this.renderstatusbar) {
                this.renderstatusbar(this.statusbar);
            }
            if (this.rendertoolbar) {
                this.rendertoolbar(this.toolbar);
            }
            if (this.showaggregates) {
                this._updateaggregates();
            }

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            this._renderhorizontalscroll();

            this._showicons();
            this._addHandlers();
        },

        clear: function () {
            if (this.source) {
                this.source.records = new Array();
                this.source.hierarchy = new Array();
            }
            this.databind(null);
            this._render();
        },

        _initpager: function () {
            var that = this;
            var pagergotopagestring = this.gridlocalization.pagergotopagestring;
            var pagerrangestring = this.gridlocalization.pagerrangestring;
            var pagershowrowsstring = this.gridlocalization.pagershowrowsstring;

            var top = (this.pagerheight - 17) / 2;

            this.pagerdiv = this.pagerdiv || $('<div style="width: 100%; height: 100%; position: relative;"></div>');
            this.toppagerdiv = this.toppagerdiv || $('<div style="width: 100%; height: 100%; position: relative;"></div>');
            if (!this.pageable) {
                this.pagerdiv.remove();
                this.toppagerdiv.remove();
                return;
            }

            if (!this.pagerrenderer) {
                this.pagerdiv.css('top', top);
                this.toppagerdiv.css('top', top);

                var createPagerElements = function (pagerdiv, name) {
                    var that = this;
                    var input = $('<div style="margin-right: 7px; width: 27px; height: 17px; float: right;"><input style="margin-top: 0px; text-align: right; width: 27px;" type="text"/></div>');
                    var gotolabel = $('<div style="float: right; margin-right: 7px;"></div>');
                    var next = $('<div type="button" style="padding: 0px; margin-top: 0px; margin-right: 3px; width: 27px; float: right;"></div>');
                    var previous = $('<div type="button" style="padding: 0px; margin-top: 0px; margin-right: 3px; width: 27px; float: right;"></div>');
                    var first = $('<div type="button" style="margin-left: 3px; padding: 0px; margin-top: 0px; margin-right: 3px; width: 27px; float: right;"></div>');
                    var last = $('<div type="button" style="padding: 0px; margin-top: 0px; margin-right: 3px; width: 27px; float: right;"></div>');
                    var details = $('<div style="margin-right: 7px; float: right;"></div>');
                    var showrows = $('<div style="margin-right: 7px; float: right;"></div>');
                    var pagerbuttons = $('<div style="padding-bottom: 3px; margin-right: 3px; float: right;"></div>');
                    input.attr('disabled', that.disabled);
                    var pagershowrowscombo = $('<div id="gridpagerlist" style="margin-top: 0px; margin-right: 7px; float: right;"></div>');
                    pagershowrowscombo[0].id = "gridpagerlist" + name + that.element.id;
                    that.removeHandler(next, 'mousedown');
                    that.removeHandler(next, 'mouseup');
                    that.removeHandler(next, 'click');
                    that.removeHandler(previous, 'mousedown');
                    that.removeHandler(previous, 'mouseup');
                    that.removeHandler(previous, 'click');
                    that.removeHandler(first, 'mousedown');
                    that.removeHandler(first, 'mouseup');
                    that.removeHandler(first, 'click');
                    that.removeHandler(last, 'mousedown');
                    that.removeHandler(last, 'mouseup');
                    that.removeHandler(last, 'click');
                    if (!that.rtl) {
                        previous.attr('title', that.gridlocalization.pagerpreviousbuttonstring);
                        next.attr('title', that.gridlocalization.pagernextbuttonstring);
                    }
                    else {
                        next.attr('title', that.gridlocalization.pagerpreviousbuttonstring);
                        previous.attr('title', that.gridlocalization.pagernextbuttonstring);
                    }

                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        pagerbuttons.css('padding-top', '3px');
                    }

                    this["pagerfirst" + name] = first;
                    this["pagerlast" + name] = last;
                    this["pagernext" + name] = next;
                    this["pagerprevious" + name] = previous;
                    this["pagergotoinput" + name] = input;
                    this["pagerdetails" + name] = details;
                    this["pagershowrows" + name] = showrows;
                    this["pagergotolabel" + name] = gotolabel;
                    this["pagershowrowscombo" + name] = pagershowrowscombo;
                    this["pagerbuttons" + name] = pagerbuttons;


                    if (that.pagermode == "default") {
                        if (!that.rtl) {
                            first.attr('title', that.gridlocalization.pagerfirstbuttonstring);
                            last.attr('title', that.gridlocalization.pagerlastbuttonstring);
                        }
                        else {
                            last.attr('title', that.gridlocalization.pagerfirstbuttonstring);
                            first.attr('title', that.gridlocalization.pagerlastbuttonstring);
                        }

                        var firstarrow = $("<div style='margin-left: 6px; width: 15px; height: 15px;'></div>");
                        firstarrow.addClass(that.toThemeProperty('jqx-icon-arrow-first'));
                        first.wrapInner(firstarrow);

                        var lastarrow = $("<div style='margin-left: 6px; width: 15px; height: 15px;'></div>");
                        lastarrow.addClass(that.toThemeProperty('jqx-icon-arrow-last'));
                        last.wrapInner(lastarrow);
                        if (!that.rtl) {
                            pagerdiv.append(first);
                            pagerdiv.append(previous);
                            pagerdiv.append(pagerbuttons);
                            pagerdiv.append(next);
                            pagerdiv.append(last);
                        }
                        else {
                            pagerdiv.append(last);
                            pagerdiv.append(next);
                            pagerdiv.append(pagerbuttons);
                            pagerdiv.append(previous);
                            pagerdiv.append(first);
                        }

                        last.jqxButton({ cursor: 'pointer', disabled: that.disabled, theme: that.theme });
                        first.jqxButton({ cursor: 'pointer', disabled: that.disabled, theme: that.theme });
                        var floatMode = !that.rtl ? 'left' : 'right';
                        pagerbuttons.css('float', floatMode);
                        last.css('float', floatMode);
                        first.css('float', floatMode);
                        next.css('float', floatMode);
                        previous.css('float', floatMode);
                        details.css('float', that.rtl ? 'left' : 'right');
                        if (that.rtl) {
                            details.css('margin-left', '7px');
                            details.css('margin-right', '0px');
                        }
                        else {
                            details.css('margin-left', '0px');
                            details.css('margin-right', '7px');
                        }
                    }
                    else {
                        if (!that.rtl) {
                            pagerdiv.append(next);
                            pagerdiv.append(previous);
                        }
                    }


                    next.jqxButton({ cursor: 'pointer', disabled: that.disabled, theme: that.theme });
                    previous.jqxButton({ cursor: 'pointer', disabled: that.disabled, theme: that.theme });

                    var leftarrow = $("<div style='margin-left: 6px; width: 15px; height: 15px;'></div>");
                    leftarrow.addClass(that.toThemeProperty('jqx-icon-arrow-left'));
                    previous.wrapInner(leftarrow);

                    var rightarrow = $("<div style='margin-left: 6px; width: 15px; height: 15px;'></div>");
                    rightarrow.addClass(that.toThemeProperty('jqx-icon-arrow-right'));
                    next.wrapInner(rightarrow);

                    if (!that.rtl) {
                        pagerdiv.append(details);
                    }
                    if (that.pagermode != "default") {
                        if (!that.rtl) {
                            pagerdiv.append(pagershowrowscombo);
                            pagerdiv.append(showrows);
                            pagerdiv.append(input);
                            pagerdiv.append(gotolabel);
                        }
                        else {
                            pagerdiv.append(gotolabel);
                            pagerdiv.append(input);
                            pagerdiv.append(showrows);
                            pagerdiv.append(pagershowrowscombo);
                            pagerdiv.append(details);
                            pagerdiv.append(next);
                            pagerdiv.append(previous);
                        }

                        var source = that.pagesizeoptions;
                        pagershowrowscombo.jqxDropDownList({ _checkForHiddenParent: false, rtl: that.rtl, disabled: that.disabled, source: source, enableBrowserBoundsDetection: true, keyboardSelection: false, autoDropDownHeight: true, width: 44, height: 16, theme: that.theme });
                        var selectedindex = 0;
                        for (var i = 0; i < source.length; i++) {
                            if (this.pagesize >= source[i]) {
                                selectedindex = i;
                            }
                        }
                        gotolabel[0].innerHTML = pagergotopagestring;
                        pagershowrowscombo.jqxDropDownList({ selectedIndex: selectedindex });
                        var pagerpageinput = input.find('input');
                        pagerpageinput.addClass(that.toThemeProperty('jqx-input'));
                        pagerpageinput.addClass(that.toThemeProperty('jqx-widget-content'));
                        if (this.rtl) {
                            pagerpageinput.css('direction', 'rtl');
                        }

                        var that = this;
                        this.removeHandler(pagershowrowscombo, 'select');
                        this.addHandler(pagershowrowscombo, 'select', function (event) {
                            if (event.args) {
                                if (that.vScrollInstance) {
                                    that.vScrollInstance.setPosition(0);
                                }

                                var index = event.args.index;
                                that["pagershowrowscombotop"].data().jqxDropDownList.instance.selectIndex(index);
                                that["pagershowrowscombobottom"].data().jqxDropDownList.instance.selectIndex(index);
                                that["pagershowrowscombobottom"].data().jqxDropDownList.instance.renderSelection('mouse');
                                that["pagershowrowscombotop"].data().jqxDropDownList.instance.renderSelection('mouse');

                                var recordindex = that.dataview.pagenum * that.dataview.pagesize;
                                var pagesize = source[index];
                                var oldpagesize = that.pagesize;
                                that.pagesize = parseInt(pagesize);
                                if (isNaN(that.pagesize)) {
                                    that.pagesize = 10;
                                }
                                if (pagesize >= 100) {
                                    that["pagershowrowscombotop"].jqxDropDownList({ width: 55 });
                                    that["pagershowrowscombobottom"].jqxDropDownList({ width: 55 });
                                }
                                else {
                                    that["pagershowrowscombotop"].jqxDropDownList({ width: 44 });
                                    that["pagershowrowscombobottom"].jqxDropDownList({ width: 44 });
                                }

                                that.dataview.pagesize = that.pagesize;
                                var pagenum = Math.floor(recordindex / that.dataview.pagesize);
                                if (pagenum !== that.dataview.pagenum || parseInt(pagesize) !== parseInt(oldpagesize)) {
                                    that._raiseEvent('pageSizeChanged', { pagenum: pagenum, oldpagesize: oldpagesize, pagesize: that.dataview.pagesize });
                                    var result = that.gotopage(pagenum);
                                    if (!result) {
                                        if (!that.serverProcessing) {
                                            that.refresh();
                                        }
                                        else {
                                            that.updatebounddata('pager');
                                        }
                                    }
                                }
                            }
                        });

                        var input = input.find('input');
                        input.addClass(that.toThemeProperty('jqx-grid-pager-input'));
                        input.addClass(that.toThemeProperty('jqx-rc-all'));
                        this.removeHandler(input, 'keydown');
                        this.removeHandler(input, 'change');

                        that.addHandler(input, 'keydown', function (event) {
                            if (event.keyCode >= 65 && event.keyCode <= 90)
                                return false;

                            if (event.keyCode == '13') {
                                var val = input.val();
                                val = parseInt(val);
                                if (!isNaN(val)) {
                                    that.gotopage(val - 1);
                                }
                                return false;
                            }
                        });
                        that.addHandler(input, 'change', function () {
                            var val = input.val();
                            val = parseInt(val);
                            if (!isNaN(val)) {
                                that.gotopage(val - 1);
                            }
                        });
                    }
                    showrows[0].innerHTML = pagershowrowsstring;

                    that.addHandler(next, 'mouseenter', function () {
                        rightarrow.addClass(that.toThemeProperty('jqx-icon-arrow-right-hover'));
                    });

                    that.addHandler(previous, 'mouseenter', function () {
                        leftarrow.addClass(that.toThemeProperty('jqx-icon-arrow-left-hover'));
                    });

                    that.addHandler(next, 'mouseleave', function () {
                        rightarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-right-hover'));
                    });

                    that.addHandler(previous, 'mouseleave', function () {
                        leftarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-left-hover'));
                    });

                    that.addHandler(next, 'mousedown', function () {
                        rightarrow.addClass(that.toThemeProperty('jqx-icon-arrow-right-selected'));
                    });

                    that.addHandler(next, 'mouseup', function () {
                        rightarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-right-selected'));
                    });

                    that.addHandler(previous, 'mousedown', function () {
                        leftarrow.addClass(that.toThemeProperty('jqx-icon-arrow-left-selected'));
                    });

                    that.addHandler(previous, 'mouseup', function () {
                        leftarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-left-selected'));
                    });

                    if (that.pagermode === "default") {
                        that.addHandler(last, 'mouseenter', function () {
                            lastarrow.addClass(that.toThemeProperty('jqx-icon-arrow-last-hover'));
                        });

                        that.addHandler(first, 'mouseenter', function () {
                            firstarrow.addClass(that.toThemeProperty('jqx-icon-arrow-first-hover'));
                        });

                        that.addHandler(last, 'mouseleave', function () {
                            lastarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-last-hover'));
                        });

                        that.addHandler(first, 'mouseleave', function () {
                            firstarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-first-hover'));
                        });

                        that.addHandler(last, 'mousedown', function () {
                            lastarrow.addClass(that.toThemeProperty('jqx-icon-arrow-last-selected'));
                        });

                        that.addHandler(first, 'mousedown', function () {
                            firstarrow.addClass(that.toThemeProperty('jqx-icon-arrow-first-selected'));
                        });

                        that.addHandler(last, 'mouseup', function () {
                            lastarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-last-selected'));
                        });

                        that.addHandler(first, 'mouseup', function () {
                            firstarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-first-selected'));
                        });
                    }

                    that.addHandler($(document), 'mouseup.pagerbuttons' + name + this.element.id, function () {
                        rightarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-right-selected'));
                        leftarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-left-selected'));
                        if (lastarrow) {
                            lastarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-last-selected'));
                            firstarrow.removeClass(that.toThemeProperty('jqx-icon-arrow-first-selected'));
                        }
                    });

                    that.addHandler(next, 'click', function () {
                        if (!next.jqxButton('disabled')) {
                            if (!that.rtl) {
                                that.gotonextpage();
                            }
                            else {
                                that.gotoprevpage();
                            }
                        }
                    });
                    that.addHandler(previous, 'click', function () {
                        if (!previous.jqxButton('disabled')) {
                            if (!that.rtl) {
                                that.gotoprevpage();
                            }
                            else {
                                that.gotonextpage();
                            }
                        }
                    });
                    if (this.pagermode === "default") {
                        that.addHandler(first, 'click', function () {
                            if (!first.jqxButton('disabled')) {
                                if (!that.rtl) {
                                    that.gotopage(0);
                                }
                                else {
                                    var totalrecords = that.dataview.totalrecords;
                                    var pages = Math.ceil(totalrecords / that.pagesize);
                                    that.gotopage(pages - 1);
                                }
                            }

                        });
                        that.addHandler(last, 'click', function () {
                            if (!last.jqxButton('disabled')) {
                                if (!that.rtl) {
                                    var totalrecords = that.dataview.totalrecords;
                                    var pages = Math.ceil(totalrecords / that.pagesize);
                                    that.gotopage(pages - 1);
                                }
                                else {
                                    that.gotopage(0);
                                }
                            }
                        });
                    }
                }
                this.pagerdiv.children().remove();
                this.toppagerdiv.children().remove();

                createPagerElements.call(this, this.pagerdiv, 'bottom');
                createPagerElements.call(this, this.toppagerdiv, 'top');
                this.pager.append(this.pagerdiv);
                this.toppager.append(this.toppagerdiv);
                this.updatepagerdetails();
            }
            else {
                this.pagerdiv.children().remove();
                this.toppager.children().remove();
                var element = this.pagerrenderer();
                if (element != null) {
                    this.pagerdiv.append($(element));
                }
                this.pager.append(this.pagerdiv);

                var element = this.pagerrenderer();
                if (element != null) {
                    this.toppagerdiv.append($(element));
                }
                this.toppager.append(this.toppagerdiv);
            }
        },

        _updatepagertheme: function () {

        },

        gotopage: function (pagenum, done) {
            if (this._loading) {
                return false;
            }

            if (this.editKey != undefined) {
                if (this.editSettings.saveOnPageChange) {
                    var result = this.endroweditbykey(this.editKey);
                    if (!result) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            if (pagenum == null || pagenum == undefined)
                pagenum = 0;

            if (pagenum == -1)
                pagenum = 0;

            if (pagenum < 0)
                return false;

            var totalrecords = this.dataview.totalrecords;

            var oldpagenum = this.dataview.pagenum;

            var pages = Math.ceil(totalrecords / this.pagesize);
            if (pagenum >= pages) {
                if (this.dataview.totalrecords == 0) {
                    this.dataview.pagenum = 0;
                    this.updatepagerdetails();
                }
                if (pagenum > 0) {
                    pagenum = pages - 1;
                }
            }

            if (this.dataview.pagenum != pagenum) {
                if (this.pageable) {
                    this.dataview.pagenum = pagenum;

                    this._raiseEvent('pageChanged', { pagenum: pagenum, oldpagenum: oldpagenum, pagesize: this.dataview.pagesize });
                }
                if (!this.serverProcessing) {
                    this.refresh();
                    if (done) {
                        if ($.isFunction(done)) {
                            done();
                        }
                    }
                }
                else {
                    this.updatebounddata('pager', done);
                }
                return true;
            }
            return false;
        },

        // goes to a previous page.
        gotoprevpage: function (done) {
            if (this.dataview.pagenum > 0) {
                return this.gotopage(this.dataview.pagenum - 1, done);
            }
            else {
                if (this.pagermode != "default" && this.pagermode != "advanced") {
                    var totalrecords = this.dataview.totalrecords;
                    var pages = Math.ceil(totalrecords / this.pagesize);
                    return this.gotopage(pages - 1, done);
                }
            }
            return false;
        },

        // goes to a next page.
        gotonextpage: function (done) {
            var totalrecords = this.dataview.totalrecords;
            if (this.summaryrows) {
                totalrecords += this.summaryrows.length;
            }
            var pages = Math.ceil(totalrecords / this.pagesize);
            if (this.dataview.pagenum < pages - 1) {
                return this.gotopage(this.dataview.pagenum + 1, done);
            }
            else {
                if (this.pagermode != "default" && this.pagermode != "advanced") {
                    return this.gotopage(0, done);
                }
            }
            return false;
        },

        // updates a pager details.
        updatepagerdetails: function () {
            if (!this.pageable) {
                return;
            }

            var that = this;
            if (!this.serverProcessing) {
                if (this.source.hierarchy) {
                    var names = that._names();
                    var count = 0;
                    var countRows = function (level, records) {
                        for (var i = 0; i < records.length; i++) {
                            if (that.dataview.filters.length == 0) {
                                records[i]._visible = true;
                            }
                            if (records[i]._visible !== false) {
                                count++;
                            }
                            if (records[i].records && (records[i][names.expanded] || records[i][names.leaf])) {
                                if (records[i]._visible !== false) {
                                    countRows(level + 1, records[i].records);
                                    if (this.treeGrid && $(this.treeGrid).jqxTreeGrid('showSubAggregates')) {
                                        if (level != 0) {
                                            count--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    countRows(0, this.dataview.rows);
                    this.dataview.totalrecords = count;
                }
                else {
                    this.dataview.totalrecords = this.dataview.rows.length;
                }
            }

            var currentrecord = this.dataview.pagenum * this.pagesize;
            var lastrecord = (this.dataview.pagenum + 1) * this.pagesize;
            if (lastrecord >= this.dataview.totalrecords) {
                lastrecord = this.dataview.totalrecords;
            }
            var totalrecords = this.dataview.totalrecords;

            currentrecord++;
            var pagescount = Math.ceil(totalrecords / this.dataview.pagesize);
            if (pagescount >= 1) pagescount--;
            pagescount++;

            if (this.pagermode != "default") {
                if (this["pagergotoinputbottom"]) {
                    var input = this["pagergotoinputbottom"].find('input');
                    input.val(this.dataview.pagenum + 1);
                    input.attr('title', '1 - ' + pagescount);
                    input = this["pagergotoinputtop"].find('input');
                    input.val(this.dataview.pagenum + 1);
                    input.attr('title', '1 - ' + pagescount);
                }
            }
            else {
                var anchors = "";
                var buttonsCount = this.pagerbuttonscount;
                if (buttonsCount == 0 || !buttonsCount) {
                    buttonsCount = 5;
                }

                var i = 0;
                if (this.rtl) {
                    i = buttonsCount - 1;
                }
                while ((this.rtl && i >= 0) || (!this.rtl && i < buttonsCount)) {
                    var page = 1 + i;

                    var division = this.dataview.pagenum / buttonsCount;
                    var step = Math.floor(division);
                    page += step * buttonsCount;
                    var className = this.toTP('jqx-grid-pager-number');
                    className += " " + this.toTP('jqx-rc-all');
                    if (page > pagescount && !this.rtl) {
                        break;
                    }
                    else if (this.rtl && page > pagescount) {
                        i--;
                        continue;
                    }

                    if (!this.rtl) {
                        if (i == 0 && page > buttonsCount) {
                            anchors += "<a class='" + className + "' tabindex=-1 href='javascript:;' data-page='" + (-1 + page) + "'>" + "..." + "</a>";
                        }
                    }

                    if (this.dataview.pagenum === page - 1) {
                        className += " " + this.toTP('jqx-fill-state-pressed');
                    }

                    if (!this.rtl) {
                        anchors += "<a class='" + className + "' tabindex=-1 href='javascript:;' data-page='" + page + "'>" + page + "</a>";

                        if (i === buttonsCount - 1) {
                            var className = this.toTP('jqx-grid-pager-number');
                            if (pagescount >= 1 + page) {
                                anchors += "<a class='" + className + "' tabindex=-1 href='javascript:;' data-page='" + (1 + page) + "'>" + "..." + "</a>";
                            }
                        }
                    }
                    else {
                        if (i === buttonsCount - 1) {
                            var className = this.toTP('jqx-grid-pager-number');
                            if (pagescount >= 1 + page) {
                                anchors += "<a class='" + className + "' tabindex=-1 href='javascript:;' data-page='" + (1 + page) + "'>" + "..." + "</a>";
                            }
                        }
                        if (this.dataview.pagenum === page - 1) {
                            className += " " + this.toTP('jqx-fill-state-pressed');
                        }
                        anchors += "<a class='" + className + "' tabindex=-1 href='javascript:;' data-page='" + page + "'>" + page + "</a>";
                    }

                    if (this.rtl) {
                        var className = this.toTP('jqx-grid-pager-number');
                        if (i == 0 && page > buttonsCount) {
                            anchors += "<a class='" + className + "' tabindex=-1 href='javascript:;' data-page='" + (-1 + page) + "'>" + "..." + "</a>";
                        }
                    }

                    if (!this.rtl) {
                        i++;
                    }
                    else {
                        i--;
                    }
                }
                if (!this["pagerbuttonsbottom"])
                    return;

                var numbers = this["pagerbuttonsbottom"].find('a');
                this.removeHandler(numbers, 'click');
                this.removeHandler(numbers, 'mouseenter');
                this.removeHandler(numbers, 'mouseleave');

                var numbers = this["pagerbuttonstop"].find('a');
                this.removeHandler(numbers, 'click');
                this.removeHandler(numbers, 'mouseenter');
                this.removeHandler(numbers, 'mouseleave');

                this["pagerbuttonsbottom"][0].innerHTML = anchors;
                this["pagerbuttonstop"][0].innerHTML = anchors;
                if (this.disabled) {
                    this.host.find('.jqx-grid-pager-number').css('cursor', 'default');
                }

                var initAnchors = function () {
                    numbers.click(function (event) {
                        if (that.disabled)
                            return;

                        var page = $(event.target).attr("data-page");
                        that.gotopage(parseInt(page) - 1);
                    });

                    numbers.mouseenter(function (event) {
                        if (that.disabled)
                            return;

                        $(event.target).addClass(that.toTP("jqx-fill-state-hover"));
                    });
                    numbers.mouseleave(function (event) {
                        if (that.disabled)
                            return;

                        $(event.target).removeClass(that.toTP("jqx-fill-state-hover"));
                    });
                }

                if (this.pagerposition === "both" || this.pagerposition === "bottom") {
                    var numbers = this["pagerbuttonsbottom"].find('a');
                    initAnchors(numbers);
                }
                if (this.pagerposition === "both" || this.pagerposition === "top") {
                    var numbers = this["pagerbuttonstop"].find('a');
                    initAnchors(numbers);
                }
            }

            if (lastrecord == 0 && lastrecord < currentrecord) {
                currentrecord = 0;
            }

            if (this["pagerdetailsbottom"]) {
                if (!this.rtl) {
                    this["pagerdetailsbottom"][0].innerHTML = currentrecord + '-' + lastrecord + this.gridlocalization.pagerrangestring + totalrecords;
                    this["pagerdetailstop"][0].innerHTML = currentrecord + '-' + lastrecord + this.gridlocalization.pagerrangestring + totalrecords;
                }
                else {
                    this["pagerdetailsbottom"][0].innerHTML = totalrecords + this.gridlocalization.pagerrangestring + lastrecord + '-' + currentrecord;
                    this["pagerdetailstop"][0].innerHTML = totalrecords + this.gridlocalization.pagerrangestring + lastrecord + '-' + currentrecord;
                }
            }

            if (this.pagermode == "default") {
                var minWidth = this["pagerbuttonsbottom"].width() + $(this["pagerdetailsbottom"]).width() + 160;
                this.pagerdiv.css('min-width', minWidth);
                this.toppagerdiv.css('min-width', minWidth);
            }

            if (currentrecord > lastrecord) {
                this.gotoprevpage();
            }
        },

        _preparecolumngroups: function () {
            var columnsheight = this.columnsheight;
            if (this.columngroups) {
                this.columnshierarchy = new Array();
                if (this.columngroups.length) {
                    var that = this;
                    for (var i = 0; i < this.columngroups.length; i++) {
                        this.columngroups[i].parent = null;
                        this.columngroups[i].groups = null;
                    }
                    for (var i = 0; i < this.columns.records.length; i++) {
                        this.columns.records[i].parent = null;
                        this.columns.records[i].groups = null;
                    }

                    var getParentGroup = function (name) {
                        for (var i = 0; i < that.columngroups.length; i++) {
                            var group = that.columngroups[i];
                            if (group.name === name)
                                return group;
                        }
                        return null;
                    }

                    for (var i = 0; i < this.columngroups.length; i++) {
                        var group = this.columngroups[i];
                        if (!group.groups) {
                            group.groups = null;
                        }
                        if (group.parentGroup) group.parentgroup = group.parentGroup;

                        if (group.parentgroup) {
                            var parentgroup = getParentGroup(group.parentgroup);
                            if (parentgroup) {
                                group.parent = parentgroup;
                                if (!parentgroup.groups) {
                                    parentgroup.groups = new Array();
                                }
                                if (parentgroup.groups.indexOf(group) === -1) {
                                    parentgroup.groups.push(group);
                                }
                            }
                        }
                    }
                    for (var i = 0; i < this.columns.records.length; i++) {
                        var group = this.columns.records[i];
                        if (group.columngroup) {
                            var parentgroup = getParentGroup(group.columngroup);
                            if (parentgroup) {
                                if (!parentgroup.groups) {
                                    parentgroup.groups = new Array();
                                }
                                group.parent = parentgroup;
                                if (parentgroup.groups.indexOf(group) === -1) {
                                    parentgroup.groups.push(group);
                                }
                            }
                        }
                    }
                    var totalmaxlevel = 0;
                    for (var i = 0; i < this.columns.records.length; i++) {
                        var group = this.columns.records[i];
                        var initialgroup = group;
                        group.level = 0;
                        while (initialgroup.parent) {
                            initialgroup = initialgroup.parent;
                            group.level++;
                        }
                        var initialgroup = group;
                        var maxlevel = group.level;
                        totalmaxlevel = Math.max(totalmaxlevel, group.level);
                        while (initialgroup.parent) {
                            initialgroup = initialgroup.parent;
                            if (initialgroup) {
                                initialgroup.level = --maxlevel;
                            }
                        }
                    }

                    var getcolumns = function (group) {
                        var columns = new Array();
                        if (group.columngroup) {
                            columns.push(group);
                        }
                        if (!group.groups) {
                            return new Array();
                        }
                        for (var i = 0; i < group.groups.length; i++) {
                            if (group.groups[i].columngroup) {
                                columns.push(group.groups[i]);
                            }
                            else {
                                if (group.groups[i].groups) {
                                    var tmpcolumns = getcolumns(group.groups[i]);
                                    for (var j = 0; j < tmpcolumns.length; j++) {
                                        columns.push(tmpcolumns[j]);
                                    }
                                }
                            }
                        }
                        return columns;
                    }

                    for (var i = 0; i < this.columngroups.length; i++) {
                        var group = this.columngroups[i];
                        var columns = getcolumns(group);
                        group.columns = columns;
                        var indexes = new Array();
                        var pinned = 0;
                        for (var j = 0; j < columns.length; j++) {
                            indexes.push(this.columns.records.indexOf(columns[j]));
                            if (columns[j].pinned) {
                                pinned++;
                            }
                        }
                        if (pinned != 0) {
                            throw new Error("jqxDataTable: Column Groups initialization Error. Please, check the initialization of the jqxDataTable's columns array. The columns in a column group cannot be pinned.");
                        }

                        indexes.sort(function (value1, value2) {
                            value1 = parseInt(value1);
                            value2 = parseInt(value2);

                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        }
                        );
                        for (var index = 1; index < indexes.length; index++) {
                            if (indexes[index] != indexes[index - 1] + 1) {
                                throw new Error("jqxDataTable: Column Groups initialization Error. Please, check the initialization of the jqxDataTable's columns array. The columns in a column group are expected to be siblings in the columns array.");
                                this.host.remove();
                            }
                        }
                    }
                }
                this.columngroupslevel = 1 + totalmaxlevel;
                columnsheight = this.columngroupslevel * this.columnsheight;
            }
            return columnsheight;
        },

        // performs mouse wheel.
        wheel: function (event, that) {
            if (that.autoheight && that.hScrollBar.css('visibility') != 'visible') {
                event.returnValue = true;
                return true;
            }

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
                var result = that._handleDelta(delta);
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
            if (this.vScrollBar.css('visibility') != 'hidden') {
                var oldvalue = this.vScrollInstance.value;
                if (delta < 0) {
                    this.vScrollInstance.setPosition(this.vScrollInstance.value + 2 * 10);
                }
                else {
                    this.vScrollInstance.setPosition(this.vScrollInstance.value - 2 * 10);
                }
                var newvalue = this.vScrollInstance.value;
                if (oldvalue != newvalue) {
                    return true;
                }
            }
            else if (this.hScrollBar.css('visibility') != 'hidden') {
                var oldvalue = this.hScrollInstance.value;
                if (delta > 0) {
                    if (this.hScrollInstance.value > 2 * 10) {
                        this.hScrollInstance.setPosition(this.hScrollInstance.value - 2 * 10);
                    }
                    else {
                        this.hScrollInstance.setPosition(0);
                    }
                }
                else {
                    if (this.hScrollInstance.value < this.hScrollInstance.max) {
                        this.hScrollInstance.setPosition(this.hScrollInstance.value + 2 * 10);
                    }
                    else this.hScrollInstance.setPosition(this.hScrollInstance.max);

                }
                var newvalue = this.hScrollInstance.value;
                if (oldvalue != newvalue) {
                    return true;
                }
            }

            return false;
        },


        _removeHandlers: function () {
            this.removeHandler(this.host, 'focus');
            this.removeHandler($(window), 'jqxReady');
 
            if (this._mousewheelfunc) {
                this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            }
            var eventname = 'mousedown';
            if (this.isTouchDevice()) {
                eventname = $.jqx.mobile.getTouchEventName('touchstart');
            }
            this.removeHandler(this.host, 'dragstart.' + this.element.id);
            this.removeHandler(this.host, 'keydown');

            if (this.table) {
                this.removeHandler(this.table, 'mouseleave');
                this.removeHandler(this.table, 'mousemove');
                this.removeHandler(this.table, eventname);
                this.removeHandler(this.table, 'selectstart.' + this.element.id);
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    this.removeHandler(this.table, 'dblclick');
                }
            }
        },

        _addHandlers: function () {
            var that = this;
            this._mousewheelfunc = this._mousewheelfunc || function (event) {
                that.wheel(event, that);
                return false;
            };

            this.addHandler(this.host, 'dragstart.' + this.element.id, function (event) {
                return false;
            });
            this.addHandler(this.table, 'selectstart.' + this.element.id, function (event) {
                if (that.enablebrowserselection) {
                    return true;
                }

                if (that.filterable) {
                    if ($(event.target).ischildof(that.filterrow))
                        return true;
                }

                if (undefined == that.editKey) {
                    return false;
                }
            });

            this.addHandler($(window), 'jqxReady',
            function () {
                that._updatecolumnwidths();
                that.refresh();
            });

            if (this.editable) {
                this.addHandler($(document), 'mousedown.gridedit' + this.element.id, function (event) {
                    if (that.editable && that.editSettings.saveOnBlur) {
                        if (that.editKey != null) {
                            if (!that.vScrollInstance.isScrolling() && !that.vScrollInstance.isScrolling()) {
                                var gridOffset = that.host.coord();
                                var gridWidth = that.host.width();
                                var gridHeight = that.host.height();
                                var close = false;
                                var yclose = false;
                                var xclose = false;
                                if (event.pageY < gridOffset.top || event.pageY > gridOffset.top + gridHeight) {
                                    close = true;
                                    yclose = true;
                                }
                                if (event.pageX < gridOffset.left || event.pageX > gridOffset.left + gridWidth) {
                                    close = true;
                                    xclose = true;
                                }

                                if (close) {
                                    var testEditor = function (editor) {
                                        var editorData = $(editor.children()[0]).data();
                                        if (editorData && !editorData.jqxWidget) {
                                            editorData = editor.data();
                                        }
                                        if (!editorData) {
                                            editorData = editor.data();
                                        }

                                        if (editorData.jqxWidget && editorData.jqxWidget.container && editorData.jqxWidget.container[0].style.display == 'block') {
                                            var instance = editorData.jqxWidget;
                                            var top = instance.container.coord().top;
                                            var bottom = instance.container.coord().top + instance.container.height();
                                            if (yclose && (event.pageY < top || event.pageY > bottom)) {
                                                close = true;
                                                instance.close();
                                                return true;
                                            }
                                            else {
                                                return false;
                                            }
                                        }
                                    }
                                    var editors = that._editors;
                                    if (editors) {
                                        for (var i = 0; i < editors.length; i++) {
                                            var editor = editors[i].editor;
                                            var result = testEditor(editor);
                                            var owns = editor.attr('aria-owns');
                                            if (owns) {
                                                if (owns == document.activeElement.id) {
                                                    return true;
                                                }
                                                if ($(document.activeElement).ischildof($("#" + owns))) {
                                                    return true;
                                                }
                                            }
                                            else {
                                                owns = editor.children().attr('aria-owns');
                                                if (owns) {
                                                    if (owns == document.activeElement.id) {
                                                        return true;
                                                    }
                                                    if ($(document.activeElement).ischildof($("#" + owns))) {
                                                        return true;
                                                    }
                                                }
                                            }

                                            if (result === false)
                                                return;
                                        }
                                    }
                                }

                                if (close) {
                                    that.endroweditbykey(that.editKey);
                                }
                            }
                        }
                    }
                });
            }

            this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            this.addHandler(this.host, 'mousewheel', this._mousewheelfunc);

            this.addHandler(this.host, 'focus', function (event) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
            });

            this.vScrollInstance.valuechanged = function (params) {
                if (that._timer) {
                    clearTimeout(that._timer);
                }

                that._timer = setTimeout(function () {
                    if (that.table) {
                        that.table[0].style.top = 0 - that.vScrollInstance.value + 'px';
                    }
                }, 5);
            }
            this.hScrollInstance.valuechanged = function (params) {
                if (that._timer) {
                    clearTimeout(that._timer);
                }

                that._timer = setTimeout(function () {
                    if (that.table) {
                        that._renderhorizontalscroll();
                    }
                }, 5);
            }

            var eventname = 'mousedown';
            if (this.isTouchDevice()) {
                eventname = $.jqx.mobile.getTouchEventName('touchend');
                if ($.jqx.browser.msie && $.jqx.browser.version < 10) {
                    eventname = 'mousedown';
                }
            }

            var findCell = function (x, y) {
                var td = null;
                var offset = that._table.coord();
                var tableTop = offset.top;
                var tableLeft = offset.left;
                var rows = that._table[0].rows;
                for (var j = 0; j < rows.length; j++) {
                    var row = rows[j];
                    var cells = row.cells;
                    for (var i = 0; i < cells.length; i++) {
                        var cell = cells[i];
                        var left = cell.offsetLeft + tableLeft;
                        var top = cell.offsetTop + tableTop;
                        var width = cell.offsetWidth;
                        var height = cell.offsetHeight;
                        if (width === 0 || height === 0) {
                            continue;
                        }

                        if (top <= y && y < top + height) {
                            if (left <= x && x < left + width) {
                                td = cell;
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                return td;
            }

            var removeHoveredRow = function () {
                if (that.hoveredRow) {
                    var cells = that.hoveredRow[0].cells;
                    var removeHoverState = function (cells) {
                        for (var i = 0; i < cells.length; i++) {
                            var cell = cells[i];
                            var className = cell.className;
                            className = className.replace(" " + that.toTP('jqx-fill-state-hover'), "");
                            className = className.replace(" " + that.toTP('jqx-grid-cell-hover'), "");
                            cell.className = className;
                        }
                    }
                    removeHoverState(cells);

                    if (that._pinnedTable && cells.length > 0) {
                        var pinnedCells = that._pinnedTable[0].rows[that.hoveredRow[0].rowIndex].cells;
                        removeHoverState(pinnedCells);
                    }
                }
                that.hoveredRow = null;
            }

            this.addHandler(this.table, 'mouseleave', function (event) {
                removeHoveredRow();
                if (that.wrapper) {
                    that.wrapper.parent().removeAttr('tabindex', 0);
                    that.wrapper.removeAttr('tabindex', 1);
                    that.content.removeAttr('tabindex', 2);
                }
            });

            var hoverRow = function (row) {
                if (!that.enablehover) {
                    return true;
                }
                that.hoveredRow = row;
                var cells = row[0].cells;
                var rowDetails = that.rowdetails && !that.treeGrid;
                var start = rowDetails && !that.treeGrid ? 1 : 0;
                var end = 0;
                if (start > 0 && that.rtl) {
                    start = 0;
                    end = 1;
                }
                for (var i = start; i < cells.length - end; i++) {
                    var cell = cells[i];
                    cell.className += " " + that.toTP('jqx-fill-state-hover') + " " + that.toTP('jqx-grid-cell-hover');
                }
                if (that._pinnedTable) {
                    if (that._pinnedTable[0].rows.length) {
                        var pinnedCells = that._pinnedTable[0].rows[that.hoveredRow[0].rowIndex].cells;
                        for (var i = start; i < pinnedCells.length - end; i++) {
                            var cell = pinnedCells[i];
                            cell.className += " " + that.toTP('jqx-fill-state-hover') + " " + that.toTP('jqx-grid-cell-hover');
                        }
                    }
                }
            }

            if (that.isTouchDevice()) {
                that.enablehover = false;
            }

            this.addHandler(this.table, 'mousemove', function (event) {
                var x = event.pageX;
                var y = event.pageY;

                if (that.disabled) {
                    return true;
                }

                if (!that.enablehover) {
                    return true;
                }

                if (that.hScrollInstance.isScrolling() || that.vScrollInstance.isScrolling()) {
                    return true;
                }

                td = findCell(x, y);
                if (!td) {
                    return true;
                }

                var row = $(td).parent();
                removeHoveredRow();
                if (that.rowdetails && that.treeGrid) {
                    if (row.attr('data-role') == "row-details") {
                        return true;
                    }
                }

                if (that.renderedRecords && that.renderedRecords.length === 0)
                    return true;

                if (that.editKey != null) {
                    if (that.editKey === row.attr('data-key')) {
                        return true;
                    }
                }

                hoverRow(row);
                return true;
            });

            this.addHandler(this.host, 'keydown', function (event) {
                return that._handleKey(event);
            });

            if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                this.addHandler(this.table, 'dblclick', function (event) {
                    that.table.trigger('mousedown', event);
                });
            }

            this.addHandler(this.table, eventname, function (event) {
                var target = event.target;
                var td = null;

                if (that.disabled) {
                    return true;
                }

                var tableOffset = that.table.coord();

                var x = event.pageX;
                var y = event.pageY;
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    if (arguments && arguments.length == 2) {
                        x = arguments[1].pageX;
                        y = arguments[1].pageY;
                    }
                }
                if (that.isTouchDevice()) {
                    var position = $.jqx.position(event);
                    x = position.left;
                    y = position.top;
                    if (isNaN(x) || isNaN(y)) {
                        var position = $.jqx.position(event.originalEvent);
                        x = position.left;
                        y = position.top;
                    }
                }

                td = findCell(x, y);

                var row = $(td).parent();
                var key = row.attr('data-key');

                if (that.rowdetails && that.treeGrid) {
                    if (row.attr('data-role') == "row-details") {
                        return true;
                    }
                }

                var focus = function () {
                    if (!that.enablebrowserselection) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                    }

                    var scrollTop = $(document).scrollTop();
                    that.host.focus();
                    $(document).scrollTop(scrollTop);
                }

                if (key !== undefined) {
                    if (key == that.editKey) {
                        return true;
                    }
                    else if (that.editKey != null && that.editSettings.saveOnSelectionChange) {
                        var result = that.endroweditbykey(that.editKey);
                        if (!result) {
                            return true;
                        }
                    }

                    var rowdata = that.rowinfo[key];
                    if (rowdata.group) {
                        return true;
                    }

                    var doubleClick = false;
                    if (rowdata) {
                        var rowIndex = that.getRows().indexOf(rowdata.row);
                        that._raiseEvent('rowClick', { index: rowIndex, key: key, row: rowdata.row, originalEvent: event });
                        var time = new Date().getTime();
                        var timeInterval = 300;
                        if (!that.clickTime) that.clickTime = new Date();

                        if (that._lastSelectedKey == key && (time - that.clickTime.getTime() < timeInterval)) {
                            that._raiseEvent('rowDoubleClick', { index: rowIndex, key: key, row: rowdata.row, originalEvent: event });
                            doubleClick = true;
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                        }
                    }

                    that.clickTime = new Date();
                    if (td.className.indexOf('jqx-grid-group') >= 0) {
                        if (!rowdata.expanded) {
                            that.showdetailsbykey(key);
                        }
                        else {
                            that.hidedetailsbykey(key);
                        }
                    }
                    else if (event.target && event.target.className.indexOf('jqx-grid-group') >= 0 && that.treeGrid) {
                        if (!rowdata.expanded) {
                            that.treeGrid.expandrow(key);
                        }
                        else {
                            that.treeGrid.collapserow(key);
                        }
                        hoverRow(that._getuirow(key));
                    }
                    else if (event.target && event.target.className.indexOf('checkbox') >= 0 && that.treeGrid) {
                        if (!rowdata.checked) {
                            that.treeGrid.checkrow(key);
                        }
                        else {
                            that.treeGrid.uncheckrow(key);
                        }
                        hoverRow(that._getuirow(key));
                    }
                    else {
                        if (that.editable && that.editKey == null) {
                            if (that._lastSelectedKey == key && that.editSettings.editOnDoubleClick && doubleClick) {
                                var result = that.beginroweditbykey(key);
                                return true;
                            }
                        }

                        if (that.isTouchDevice()) {
                            if (that.scrolled && new Date() - that.scrolled < 500) {
                                if (!that.enablebrowserselection) {
                                    if (event.preventDefault) {
                                        event.preventDefault();
                                    }
                                }
                                return false;
                            }
                        }
                        if (that.selectionmode === "singlerow" && that.selectionmode !== "custom") {
                            that.selectrowbykey(key, 'mouse', false);
                            that._updateSelection();
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                            focus();
                            return true;
                        }
                        else {
                            if (that.selectionmode !== "custom") {
                                if (!event.ctrlKey) {
                                    that.clearselection(false);
                                }
                                if (event.shiftKey) {
                                    if (that._lastSelectedKey) {
                                        var rowdata = that.rowinfo[that._lastSelectedKey];
                                        that._doSelection(that._lastSelectedKey, true, false);
                                        var uirow = $(that._table.children()[1]).children(("[data-key=" + that._lastSelectedKey + "]"));

                                        var index = uirow.index();
                                        var newRowIndex = row.index();
                                        that._selectRange(newRowIndex, index);

                                        that.selectrowbykey(key, 'mouse', false);
                                        that._updateSelection();
                                        if (event.preventDefault) {
                                            event.preventDefault();
                                        }
                                        focus();
                                        return true;
                                    }
                                }
                            }
                            that._lastSelectedKey = key;
                            that.clickTime = new Date();
                            if (that.selectionmode !== "custom") {
                                if (rowdata) {
                                    if (rowdata.selected) {
                                        that.unselectrowbykey(key, 'mouse', false);
                                    }
                                    else {
                                        that.selectrowbykey(key, 'mouse', false);
                                    }
                                    focus();
                                }
                            }
                            else {
                                return true;
                            }

                            that._updateSelection();
                            if (!that.enablebrowserselection) {
                                if (event.preventDefault) {
                                    event.preventDefault();
                                }
                            }
                            return true;
                        }
                    }
                }
            });
        },

        _updateSelection: function () {
            var that = this;
            var rows = $(that._table.children()[1]).children();
            var pinnedrows = that._pinnedTable ? $(that._pinnedTable.children()[1]).children() : null;

            var rowDetails = that.rowdetails && !that.treeGrid;
            var start = rowDetails ? 1 : 0;
            var end = 0;
            if (start > 0 && that.rtl) {
                start = 0;
                end = 1;
            }

            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].cells;
                if (pinnedrows) {
                    var pinnedcells = pinnedrows[i].cells;
                }
                var key = null;
                if (rows[i].getAttribute) {
                    key = rows[i].getAttribute('data-key');
                }

                if (that.rowinfo[key] && that.selectionmode !== "none") {
                    if (that.rowinfo[key].selected) {
                        for (var j = start; j < cells.length - end; j++) {
                            var cell = cells[j];
                            $(cell).addClass(that.toTP('jqx-grid-cell-selected') + " " + that.toTP('jqx-fill-state-pressed'));
                            if (pinnedcells) {
                                $(pinnedcells[j]).addClass(that.toTP('jqx-grid-cell-selected') + " " + that.toTP('jqx-fill-state-pressed'));
                            }
                        }
                    }
                    else {
                        for (var j = start; j < cells.length - end; j++) {
                            var cell = cells[j];
                            if (pinnedcells) {
                                var pinnedcell = pinnedcells[j];
                            }
                            var className = cell.className;
                            className = className.replace(" " + that.toTP('jqx-fill-state-pressed'), "");
                            className = className.replace(" " + that.toTP('jqx-grid-cell-selected'), "");
                            cell.className = className;
                            if (pinnedcell) {
                                pinnedcell.className = className;
                            }
                        }
                    }
                }
            }
        },

        _selectRange: function (newRowIndex, index) {
            var uirow = $($(this._table.children()[1]).children()[index]);
            var that = this;
            if (newRowIndex > index) {
                var i = index;
                var newRow = uirow;
                while (i < newRowIndex) {
                    var newRow = newRow.next();
                    var key = newRow.attr('data-key');
                    that._doSelection(key, true, false);
                    i++;
                }
            }
            else if (newRowIndex < index) {
                var i = index;
                var newRow = uirow;
                while (i > newRowIndex) {
                    var newRow = newRow.prev();
                    var key = newRow.attr('data-key');
                    this._doSelection(key, true, false);
                    i--;
                }
            }
        },

        _getuikey: function (index, type) {
            var key = null;
            var children = $(this._table.children()[1]).children();
            key = $(children[index]).attr('data-key');
            if ($(children[index]).attr('data-role')) {
                var uirow = $(children[index]);
                if (type == "next") {
                    while (uirow) {
                        uirow = uirow.next();
                        if (uirow) {
                            var role = uirow.attr('data-role');
                            if (!role) {
                                key = uirow.attr('data-key');
                                return key;
                            }
                        }
                    }
                }
                else if (type == "prev") {
                    while (uirow) {
                        uirow = uirow.prev();
                        if (uirow) {
                            var role = uirow.attr('data-role');
                            if (!role) {
                                key = uirow.attr('data-key');
                                return key;
                            }
                        }
                    }
                }
                return null;
            }

            return key;
        },

        getRows: function () {
            return this.source.records;
        },

        getView: function()
        {
            var names = this._names();
            var exportRecords = new Array();
            var getRecords = function (ownerCollection, records) {
                for (var i = 0; i < records.length; i++) {
                    if (records[i]._visible !== false) {
                        var newRecord = $.extend({}, records[i]);
                        ownerCollection.push(newRecord);
                        if (records[i][names.expanded]) {
                            newRecord.records = new Array();
                            getRecords(newRecord.records, records[i].records);
                        }
                    }
                }
            }
            getRecords(exportRecords, this.dataViewRecords);
            return exportRecords;
        },

        getKeys: function () {
            var keys = new Array();
            var rows = this.source.records;
            for (var i = 0; i < rows.length; i++) {
                keys.push(rows[i].uid);
            }
            return keys;
        },

        getKey: function (index) {
            var rows = this.getRows();
            if (rows) {
                return rows[index].uid;
            }
            else {
                return -1;
            }
        },

        _getkey: function (index) {
            if (this._loading) {
                throw new Error('jqxDataTable: ' + this.loadingerrormessage);
                return false;
            }

            var key = null;
            var getKey = function () {
                var children = $(this._table.children()[1]).children();
                var key = null;
                var offset = 0;
                if (this.pageable) {
                    offset -= this.dataview.pagenum * this.dataview.pagesize;
                }

                if (this.groups.length > 0) {
                    var x = 0;
                    for (var i = 0; i < children.length; i++) {
                        var child = $(children[i]);
                        var colSpan = child.children()[0].getAttribute('colspan');
                        if (colSpan > 0) continue;
                        if (x === offset + index) {
                            key = child.attr('data-key');
                            return key;
                        }
                        x++;
                    }
                    return key;
                }

                if (this.rowdetails) {
                    var x = 0;
                    for (var i = 0; i < children.length; i++) {
                        if (x === index + offset) {
                            key = $(children[i]).attr('data-key');
                            return key;
                        }
                        if (i % 2 == 1) {
                            x++;
                        }
                    }
                }
                else {
                    key = $(children[offset + index]).attr('data-key');
                }
                return key;
            }

            key = getKey.call(this);

            if (key == null) {
                if (this.pageable) {
                    var pagenumber = Math.floor(index / this.dataview.pagesize);
                    if (this.dataview.pagenum != pagenumber) {
                        var row = this.getRows()[index];
                        if (row && row.uid != null) {
                            return row.uid;
                        }
                        else {
                            if (isNaN(pagenumber)) {
                                return null;
                            }
                            this.gotopage(pagenumber);
                            key = getKey.call(this);
                        }
                    }
                }
            }

            return key;
        },

        _getuirow: function (key) {
            try {
                var uirow = $(this._table.children()[1]).children(("[data-key=" + key + "]"));
                if (uirow.length > 0) {
                    return uirow;
                }
            }
            catch (error) {
                var tableChildren = $(this._table.children()[1]).children();
                for (var i = 0; i < tableChildren.length; i++) {
                    var child = tableChildren[i];
                    var dataKey = child.getAttribute('data-key');
                    if (key == dataKey) {
                        return $(child);
                    }
                }
                return null;
            }

            return null;
        },

        _getpinneduirow: function (key) {
            if (!this._pinnedTable) {
                return null;
            }

            try {
                var uirow = $(this._pinnedTable.children()[1]).children(("[data-key=" + key + "]"));
                if (uirow.length > 0) {
                    return uirow;
                }
            }
            catch (error) {
                var tableChildren = $(this._pinnedTable.children()[1]).children();
                for (var i = 0; i < tableChildren.length; i++) {
                    var child = tableChildren[i];
                    var dataKey = child.getAttribute('data-key');
                    if (key == dataKey) {
                        return $(child);
                    }
                }
                return null;
            }
            return null;
        },

        _names: function () {
            var reservedNames = {
                leaf: "leaf",
                parent: "parent",
                expanded: "expanded",
                checked: "checked",
                selected: "selected",
                level: "level",
                icon: "icon",
                data: "data"
            };
            if (!this.source || (this.source && !this.source._source.hierarchy)) {
                return reservedNames;
            }

            var names = this.source._source.hierarchy.reservedNames;
            if (!names) return reservedNames;
            return names;
        },

        _getMatches: function (value, startIndex) {
            if (value == undefined || value.length == 0)
                return -1;

            var items = this.renderedRecords;

            if (startIndex != undefined) {
                items = items.slice(startIndex);
            }

            var columnIndex = 0;
            if (this.rowdetails && !this.treeGrid) {
                columnIndex++;
            }
            if (columnIndex < this.columns.records.length) {
                var searchColumn = this.columns.records[columnIndex].datafield;
            }
            else new Array();

            var keyMatches = new Array();
            $.each(items, function (i) {
                var itemValue = this[searchColumn];
                if (!itemValue) itemValue = "";
                var match = $.jqx.string.startsWithIgnoreCase(itemValue.toString(), value);

                if (match) {
                    keyMatches.push(this.uid);
                }
            });
            return keyMatches;
        },

        _handleKey: function (event) {
            if (this._loading) {
                return true;
            }

            if ($(event.target).ischildof(this.filter)) {
                return true;
            }

            if ($(event.target).ischildof(this.toolbar)) {
                return true;
            }

            if ($(event.target).ischildof(this.statusbar)) {
                return true;
            }

            var names = this._names();
            var that = this;
            var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
            var selection = this._lastSelectedKey;
            var rowdata = this.rowinfo[selection];
            var uirow = this._getuirow(selection);
            var shift = event.shiftKey && this.selectionmode != 'singlerow';
            var ctrl = event.ctrlKey;

            if (!uirow)
                return;

            if (that.handlekeyboardnavigation) {
                var result = that.handlekeyboardnavigation(key);
                if (result) {
                    return true;
                }
            }

            if (that.editable && that.editKey == undefined && key === 113 && that.editSettings.editOnF2) {
                that.beginroweditbykey(uirow.attr('data-key'));
            }

            if (that.editKey == undefined) {
                if (!ctrl && !shift && that.incrementalSearch && (!(key >= 33 && key <= 40))) {
                    var matchindex = -1;
                    if (!that._searchString) {
                        that._searchString = "";
                    }

                    if ((key == 8 || key == 46) && that._searchString.length >= 1) {
                        that._searchString = that._searchString.substr(0, that._searchString.length - 1);
                    }

                    var letter = String.fromCharCode(key);

                    var isDigit = (!isNaN(parseInt(letter)));
                    var toReturn = false;
                    if ((key >= 65 && key <= 97) || isDigit || key == 8 || key == 32 || key == 46) {
                        if (!event.shiftKey) {
                            letter = letter.toLocaleLowerCase();
                        }

                        if (key != 8 && key != 32 && key != 46) {
                            if (!(that._searchString.length > 0 && that._searchString.substr(0, 1) == letter))               
                                that._searchString += letter;
                        }

                        if (key == 32) {
                            that._searchString += " ";
                        }
                        that._searchTime = new Date();
                        var selection = this.getselection();
                        if (selection.length >= 1) {
                            var rowKey = selection[0].uid;
                            var index = -1;
                            for (var i = 0; i < this.renderedRecords.length; i++) {
                                if (this.renderedRecords[i].uid == rowKey) {
                                    index = i;
                                    break;
                                }
                            }

                            var foundRows = this._getMatches(that._searchString, index);
                            if (foundRows.length == 0 || (foundRows.length > 0 && foundRows[0] == rowKey)) {
                                var foundRows = this._getMatches(that._searchString);
                            }
                        }
                        else {
                            var foundRows = this._getMatches(that._searchString);
                        }

                        if (foundRows.length > 0) {
                            var selection = this.getselection();
                            if (selection.length >= 1) {
                                var rowIndex = foundRows.indexOf(selection[0].uid);
                                if (rowIndex == -1) {
                                    that.clearselection(false);
                                    that.selectrowbykey(foundRows[0]);
                                }
                                else {
                                    var newRowIndex = rowIndex+1;
                                    if (newRowIndex >= foundRows.length) newRowIndex = 0;
                                    that.clearselection(false);
                                    that.selectrowbykey(foundRows[newRowIndex]);
                                }
                            }
                            else {
                                that.clearselection(false);
                                that.selectrowbykey(foundRows[0]);
                            }
                            that._lastSearchString = that._searchString;
                        }
                    }

                    if (that._searchTimer != undefined) {
                        clearTimeout(that._searchTimer);
                    }

                    if (key == 27 || key == 13) {
                        that._searchString = "";
                        that._lastSearchString = "";
                    }

                    that._searchTimer = setTimeout(function () {
                        that._searchString = "";
                        that._lastSearchString = "";
                    }, 500);

                    if (matchindex >= 0) {
                        return;
                    }
                    if (toReturn)
                        return false;
                }
            }

            if (that.editKey != undefined) {
                if (key === 27 && that.editSettings.cancelOnEsc) {
                    that.endroweditbykey(that.editKey, true);
                }
                else if (key === 13 && that.editSettings.saveOnEnter) {
                    if (event.target && event.target.nodeName.toLowerCase() != "div" && event.target.nodeName.toLowerCase() != "input") {
                        return true;
                    }

                    that.endroweditbykey(that.editKey, false);
                }
                return true;
            }

            if (event.ctrlKey) {
                var pressedkey = String.fromCharCode(key).toLowerCase();

                if (pressedkey == 'c' || pressedkey == 'x') {
                    var selection = this.getselection();
                    if (selection.length >= 1) {
                        var text = "";
                        for (var p = 0; p < this.renderedRecords.length; p++) {
                            var renderedRow = this.renderedRecords[p];
                            for (var i = 0; i < selection.length; i++) {
                                var row = selection[i];
                                if (row.uid === renderedRow.uid) {
                                    for (var j = 0; j < this.columns.records.length; j++) {
                                        var cellText = this.getcelltextbykey(row.uid, this.columns.records[j].displayfield);
                                        text += cellText;
                                        if (j < this.columns.records.length - 1) text += '\t';
                                    }
                                    text += '\n';
                                    break;
                                }
                            }
                        }
                        if (text != "") text = text.substring(0, text.length - 2);
                        if (window.clipboardData) {
                            window.clipboardData.setData("Text", text);
                        }
                        else {
                            var copyFrom = $('<textarea style="position: absolute; left: -1000px; top: -1000px;"/>');
                            copyFrom.val(text);
                            $('body').append(copyFrom);
                            copyFrom.select();
                            setTimeout(function () {
                                document.designMode = 'off';
                                copyFrom.select();
                                copyFrom.remove();
                            }, 100);
                        }
                    }
                }
            }

            if (key === 32 && this.treeGrid) {
                if (this.treeGrid.checkboxes) {
                    var selection = this.getselection();
                    if (selection.length > 1) {
                        for (var i = 0; i < selection.length; i++) {
                            var selectedRow = selection[i].uid;
                            if (this.rowinfo[selectedRow].checked) {
                                this.treeGrid.uncheckrow(selectedRow, false);
                            }
                            else {
                                this.treeGrid.checkrow(selectedRow, false);
                            }
                        }
                        this._renderrows();
                        return false;
                    }
                    else {
                        var rowKey = uirow.attr('data-key');
                        if (rowKey) {
                            if (this.rowinfo[rowKey].checked) {
                                this.treeGrid.uncheckrow(rowKey);
                            }
                            else {
                                this.treeGrid.checkrow(rowKey);
                            }
                            return false;
                        }
                    }
                }
            }

            var lastIndex = uirow.index();

            var getLastKey = function (type) {
                var rowDataKey = null;
                var lastindex = $(that._table.children()[1]).children().length - 1;
                var uirow = $($(that._table.children()[1]).children()[lastindex]);
                var role = uirow.attr('data-role');
                if (!role) {
                    rowDataKey = uirow.attr('data-key');
                }
                else {
                    while (uirow) {
                        uirow = uirow.prev();
                        if (uirow) {
                            var role = uirow.attr('data-role');
                            if (!role) {
                                rowDataKey = uirow.attr('data-key');
                                break;
                            }
                        }
                    }
                }
                if (type == "all") {
                    return { row: uirow, key: rowDataKey };
                }

                return rowDataKey;
            }

            var getFirstKey = function (type) {
                var rowDataKey = null;
                var uirow = $($(that._table.children()[1]).children()[0]);
                var role = uirow.attr('data-role');
                if (!role) {
                    rowDataKey = uirow.attr('data-key');
                }
                else {
                    while (uirow) {
                        uirow = uirow.next();
                        if (uirow) {
                            var role = uirow.attr('data-role');
                            if (!role) {
                                rowDataKey = uirow.attr('data-key');
                                break;
                            }
                        }
                    }
                }
                if (type == "all") {
                    return { row: uirow, key: rowDataKey };
                }

                return rowDataKey;
            }

            var rowKey = null;
            var done = function () {
                if (!ctrl && !shift) {
                    that.clearselection(false);
                }

                if (key == 33 || key == 37) {
                    var index = lastIndex;
                    rowKey = that._getuikey(index, 'prev');
                    if (!rowKey) {
                        rowKey = getFirstKey();
                    }
                }
                else if (key == 34 || key == 39) {
                    var index = lastIndex;
                    rowKey = that._getuikey(index, 'next');
                    if (!rowKey) {
                        rowKey = getLastKey();
                    }
                }
                else if (key == 38) {
                    rowKey = getLastKey();
                }
                else if (key == 40) {
                    rowKey = getFirstKey();
                }

                that._lastSelectedKey = rowKey;

                var row = that.rowsByKey[rowKey];
                var index = that.getRows().indexOf(row);
                that._raiseEvent('rowSelect', { key: rowKey, index: index, row: that.rowsByKey[rowKey] });
                that._doSelection(rowKey, true, true);
                that.host.focus();
            }

            var home = function () {
                that.clearselection(false);
                var rowKey = getFirstKey();
                if (shift || ctrl) {
                    that._selectRange(uirow.index(), 0);
                }
                else {
                    that._lastSelectedKey = rowKey;
                }

                that.selectrowbykey(rowKey, 'keyboard');
            }
            var end = function () {
                that.clearselection(false);
                var data = getLastKey('all');
                var rowKey = data.key;
                if (shift || ctrl) {
                    that._selectRange(uirow.index(), data.row.index());
                }
                else {
                    that._lastSelectedKey = rowKey;
                }

                that.selectrowbykey(rowKey, 'keyboard');
            }

            if (this.treeGrid && this.rtl) {
                if (key == 37) key = 39;
                else if (key == 39) key = 37;
            }

            if (key == 36 || (ctrl && key == 38)) {
                home();
                return false;
            }
            else if (key == 35 || (ctrl && key == 40)) {
                end();
                return false;
            }
            else if (key == 33 || key == 37) {
                var rowKey = uirow.attr('data-key');
                if (this.rowdetails && key == 37 && !this.treeGrid) {
                    this.hidedetailsbykey(rowKey);
                    return false;
                }
                else if (this.treeGrid && key == 37) {
                    if (this.rowinfo[rowKey].row && !this.rowinfo[rowKey].row[names.parent] && !this.rowinfo[rowKey][names.leaf] && !this.rowinfo[rowKey].expanded) {
                        return false;
                    }

                    if (this.rowinfo[rowKey].expanded && !this.rowinfo[rowKey][names.leaf]) {
                        this.treeGrid.collapserow(rowKey);
                        return false;
                    }
                    else {
                        if (this.rowinfo[rowKey].row && this.rowinfo[rowKey].row[names.parent]) {
                            rowKey = this.rowinfo[rowKey].row[names.parent].uid;
                        }
                    }
                    if (this.rowinfo[rowKey][names.leaf]) {
                        return false;
                    }
                }
                if (this.pageable && !this.treeGrid) {
                    if (!this.rtl) {
                        this.gotoprevpage(done);
                    }
                    else {
                        this.gotonextpage(done);
                    }

                    return false;
                }
                if (this.treeGrid && this.pageable && key == 33) {
                    this.gotoprevpage(done);
                    return false;
                }
            }
            else if (key == 34 || key == 39) {
                var rowKey = uirow.attr('data-key');
                if (this.rowdetails && key == 39 && !this.treeGrid) {
                    this.showdetailsbykey(rowKey);
                    return false;
                }
                else if (this.treeGrid && key == 39) {
                    if (this.rowinfo[rowKey][names.leaf]) {
                        return false;
                    }

                    if (!this.rowinfo[rowKey].expanded) {
                        this.treeGrid.expandrow(rowKey);
                        return false;
                    }
                    else {
                        if (this.rowinfo[rowKey].row && this.rowinfo[rowKey].row.records && this.rowinfo[rowKey].row.records.length > 0) {
                            if (this.dataview.filters.length > 0) {
                                var subrecords = this.rowinfo[rowKey].row.records;
                                for (var i = 0; i < subrecords.length; i++) {
                                    if (subrecords[i]._visible) {
                                        rowKey = subrecords[i].uid;
                                        break;
                                    }
                                }
                            }
                            else {
                                rowKey = this.rowinfo[rowKey].row.records[0].uid;
                            }
                        }
                    }
                }
                if (this.pageable && !this.treeGrid) {
                    if (!this.rtl) {
                        this.gotonextpage(done);
                    }
                    else {
                        this.gotoprevpage(done);
                    }

                    return false;
                }
                if (this.treeGrid && this.pageable && key == 34) {
                    this.gotonextpage(done);
                    return false;
                }
            }
            else if (key == 38) {
                while (uirow) {
                    uirow = uirow.prev();
                    if (uirow) {
                        var role = uirow.attr('data-role');
                        if (!role) {
                            rowKey = uirow.attr('data-key');
                            break;
                        }
                    }
                }

                if (this.pageable && rowKey == null) {
                    this.gotoprevpage(done);
                    return false;
                }
            }
            else if (key == 40) {
                while (uirow) {
                    uirow = uirow.next();
                    if (uirow) {
                        var role = uirow.attr('data-role');
                        if (!role) {
                            rowKey = uirow.attr('data-key');
                            break;
                        }
                    }
                }

                if (this.pageable && rowKey == null) {
                    this.gotonextpage(done);
                    return false;
                }
            }
            if (rowKey != null) {
                if (!ctrl && !shift) {
                    this.clearselection(false);
                }
                if (this.rowinfo[rowKey]) {
                    if (this.rowinfo[rowKey].selected && (ctrl || shift)) {
                        this._doSelection(this._lastSelectedKey, false, false);
                        this._lastSelectedKey = rowKey;
                        var row = this.rowsByKey[rowKey];
                        var index = this.getRows().indexOf(row);
                        that._updateSelection();
                        this._raiseEvent('rowUnselect', { key: rowKey, index: index, row: this.rowsByKey[rowKey] });
                        return false;
                    }
                }

                this._lastSelectedKey = rowKey;
                var row = this.rowsByKey[rowKey];
                var index = this.getRows().indexOf(row);
                this._doSelection(rowKey, true, false);
                that._updateSelection();
                this._raiseEvent('rowSelect', { key: rowKey, index: index, row: this.rowsByKey[rowKey] });
                if (this.treeGrid) {
                    if (key == 37) {
                        var uirow = this._getuirow(rowKey);
                        var newRowKey = null;
                        if (uirow) {
                            var role = uirow.attr('data-role');
                            if (!role) {
                                newRowKey = uirow.attr('data-key');
                            }
                        }

                        if (this.pageable && newRowKey == null && this.dataview.pagenum > 0) {
                            while (this._getuirow(rowKey) == null && this.dataview.pagenum > 0) {
                                this.gotoprevpage();
                            }
                        }
                    }
                    else if (key == 39) {
                        var uirow = this._getuirow(rowKey);
                        var newRowKey = null;
                        if (uirow) {
                            var role = uirow.attr('data-role');
                            if (!role) {
                                newRowKey = uirow.attr('data-key');
                            }
                        }

                        if (this.pageable && newRowKey == null) {
                            this.gotonextpage();
                        }
                    }
                }
                return false;
            }
        },

        _selection: function (textbox) {
            if ('selectionStart' in textbox[0]) {
                var e = textbox[0];
                var selectionLength = e.selectionEnd - e.selectionStart;
                return { start: e.selectionStart, end: e.selectionEnd, length: selectionLength, text: e.value };
            }
            else {
                var r = document.selection.createRange();
                if (r == null) {
                    return { start: 0, end: e.value.length, length: 0 }
                }

                var re = textbox[0].createTextRange();
                var rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);
                var selectionLength = r.text.length;

                return { start: rc.text.length, end: rc.text.length + r.text.length, length: selectionLength, text: r.text };
            }
        },

        _doSelection: function (key, value, refresh) {
            if (key == null) {
                this.clearselection();
                return;
            }

            if (this.selectionmode === "singlerow") {
                this.clearselection(false);
            }

            var rowdata = this.rowinfo[key];
            if (rowdata) {
                rowdata.selected = value;
                this.ensurerowvisiblebykey(key);
            }
            else {
                this.ensurerowvisiblebykey(key);
                var rowdata = this.rowinfo[key];
                if (rowdata) {
                    rowdata.selected = value;
                }
                else {
                    this.rowinfo[key] = { selected: value };
                }
            }
            if (this.selectionmode != 'none') {
                if (refresh !== false) {
                    this._renderrows();
                }
            }
        },

        clearselection: function (refresh) {
            if (this.rowinfo) {
                var rows = this.getRows();

                for (var obj in this.rowinfo) {
                    var info = this.rowinfo[obj];
                    if (info.selected) {
                        info.selected = false;
                        var index = rows.indexOf(info.row);
                        this._raiseEvent('rowUnselect', { key: obj, index: index, row: info.row });
                    }
                }
            }
            if (refresh !== false) {
                this._renderrows();
            }
        },

        exportdata: function (datatype) {
            if (!$.jqx.dataAdapter.ArrayExporter) {
                if (!this.treeGrid) {
                    throw 'jqxDataTable: Missing reference to jqxdata.export.js!';
                }
                throw 'jqxTreeGrid: Missing reference to jqxdata.export.js!';
            }

            var exportHeader = this.exportSettings.columnsHeader;
            if (exportHeader == undefined) {
                exportHeader = true;
            }

            var exportHiddenColumns = this.exportSettings.hiddenColumns;
            if (exportHiddenColumns == undefined) {
                exportHiddenColumns = false;
            }

            var exportServer = this.exportSettings.serverURL;
            var charset = this.exportSettings.characterSet;
            var exportCollapsedRecords = this.exportSettings.collapsedRecords;
            if (exportCollapsedRecords == undefined) {
                exportCollapsedRecords = false;
            }

            var filename = this.exportSettings.fileName;
            if (filename === undefined) {
                filename = this.treeGrid ? "jqxTreeGrid_Data" : "jqxDataTable_Data";
            }
            var me = this;

            var rows = this.getRows();
            if (this.exportSettings.recordsInView == true) {
                rows = this.getView();
            }
            if (this.groups && this.groups.length > 0) {
                var hierarchy = this.source.getGroupedRecords(this.groups, 'records', 'label', null, 'data', null, 'parent', rows);
                var getRecords = function (records, filtered) {
                    for (var i = 0; i < records.length; i++) {
                        var record = $.extend({}, records[i]);
                        filtered.push(record);
                        if (record.records && record.records.length > 0) {
                            var data = getRecords(record.records, new Array());
                            for (var t = 0; t < data.length; t++) {
                                if (data[t].leaf) {
                                    filtered.push(data[t]);
                                }
                                else {
                                    filtered.push(data[t]);
                                }
                            }
                        }
                    }
                    return filtered;
                };
                var records = getRecords.call(this, hierarchy, new Array());
                rows = records;            
            }

            if (rows.length == 0) {
                throw 'No data to export.';
            }

            this.exporting = true;
            if (this.altrows) {
                this._renderrows();
            }

            var columns = new Array();
            for (var i = 0; i < this.columns.records.length; i++) {
                if (!exportHiddenColumns && this.columns.records[i].hidden)
                    continue;

                columns.push($.extend({}, this.columns.records[i]));
            }

            if (this.groups && this.groups.length > 0) {
                if (columns.length > 0) {
                    var names = this._names();
                    for (var i = 0; i < rows.length; i++) {
                        if (!rows[i][names.leaf]) {
                            if (!me.rtl) {
                                rows[i][columns[0].displayfield] = rows[i].label;
                            }
                            else {
                                rows[i][columns[columns.length - 1].displayfield] = rows[i].label;
                            }
                        }
                    }
                }
            }

            var level = 0;
            if (this.treeGrid) {
                var treeGridRows = this.treeGrid.getRows();
                if (this.exportSettings.recordsInView == true) {
                    treeGridRows = this.getView();
                }

                var names = this._names();
                var getLevel = function (records) {
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        var expanded = record[names.expanded] || (!record[names.expanded] && exportCollapsedRecords);
                        if (record[names.leaf]) {
                            level = Math.max(level, record[names.level]);
                        }
                        if (record.records && record.records.length > 0 && expanded) {
                            level = Math.max(level, record[names.level]);
                            getLevel(records[i].records);
                        }
                    }
                };
                getLevel(treeGridRows);
                if (level != 0) level++;
                if (datatype != "xml" && datatype != "json") {
                    var length = columns.length;
                    for (var i = 0 ; i < level; i++) {
                        var column = new jqxDataTableColumn(this, this);
                        column.width = this.indentwidth;
                        column.datafield = "Level" + i;
                        column.displayfield = "Level" + i;
                        column.align = "center";
                        column.cellsalign = "center";
                        column.text = "";
                        if (!this.rtl) {
                            columns.splice(i, 0, column);
                        }
                        else {
                            columns.splice(length, 0, column);
                        }
                    }

                    var recordsToExport = new Array();
                    var grouping = this.source._source.hierarchy && this.source._source.hierarchy.groupingDataFields ? true : false;

                    var prepareRowsForExport = function (records) {
                        for (var i = 0; i < records.length; i++) {
                            var record = $.extend({}, records[i]);
                            for (var j = 0; j < record[names.level]; j++) {
                                record["Level" + j] = "";
                            }
                            var expanded = record[names.expanded] || (!record[names.expanded] && exportCollapsedRecords);
                            if (datatype == "xls" || datatype == "html") {
                                if (record.records && record.records.length > 0) {
                                    record["Level" + record[names.level]] = expanded ? "-" : "+";
                                }
                                else {
                                    record["Level" + record[names.level]] = "";
                                }
                            }
                            else {
                                record["Level" + record[names.level]] = "";
                            }

                            if (record[names.leaf]) {
                                record["Level" + record[names.level]] = "";
                            }

                            for (var j = record[names.level] + 1; j < level; j++) {
                                record["Level" + j] = "";
                            }
                            if (grouping && !record[names.leaf]) {
                                if (!me.rtl) {
                                    record[columns[level].displayfield] = record.label;
                                }
                                else {
                                    record[columns[columns.length-level-1].displayfield] = record.label;
                                }
                            }
                            if (record.aggregate) {
                                var prefix = datatype == 'xls' ? "AG" : "";
                                for (var j = level; j < columns.length; j++) {
                                    var columnIndex = j;
                                    if (me.rtl) columnIndex = columns.length - j - 1;
                                    if (record[columns[columnIndex].displayfield] != undefined) {
                                        record[columns[columnIndex].displayfield] = prefix + record[columns[columnIndex].displayfield];
                                    }
                                }
                            }

                            recordsToExport.push(record);

                            if (expanded && !record[names.leaf]) {
                                prepareRowsForExport(record.records);
                            }
                        }
                    }

                    prepareRowsForExport(treeGridRows);
                    rows = recordsToExport;
                }
                else {
                    rows = treeGridRows;
                }
            }

            var addhiddencolumns = exportHiddenColumns != undefined ? exportHiddenColumns : false;
            var dataFields = {};
            var styles = {};
            var alignments = [];
            var $cell = this.host.find('.jqx-grid-cell:first');
            var $cellalt = this.host.find('.jqx-grid-cell-alt:first');
            var tp = this.toThemeProperty;
            $cell.removeClass(tp('jqx-grid-cell-selected'));
            $cell.removeClass(tp('jqx-fill-state-pressed'));
            $cellalt.removeClass(tp('jqx-grid-cell-selected'));
            $cellalt.removeClass(tp('jqx-fill-state-pressed'));
            $cell.removeClass(tp('jqx-grid-cell-hover'));
            $cell.removeClass(tp('jqx-fill-state-hover'));
            $cellalt.removeClass(tp('jqx-grid-cell-hover'));
            $cellalt.removeClass(tp('jqx-fill-state-hover'));

            var styleName = 'cell';
            var styleIndex = 1;
            var columnStyleName = 'column';
            var columnStyleIndex = 1;
            var aggregates = [];

            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                if (column.cellclassname != "") {
                    column.customCellStyles = new Array();
                    if (typeof column.cellclassname == "string") {
                        column.customCellStyles.push(column.cellclassname);
                    }
                    else {
                        for (var i = 0; i < rows.length; i++) {
                            var boundIndex = i;
                            var className = column.cellclassname(boundIndex, column.displayfield, rows[i][column.displayfield]);
                            if (className) {
                                column.customCellStyles[i] = className;
                            }
                        }
                    }
                }
            }

            $.each(columns, function (index) {
                var cellIndex = index;
                if (index >= level) {
                    cellIndex = columns.length - level - 1;
                }
                var $cell = $(me._table[0].rows[0].cells[cellIndex]);
                if (me._table[0].rows.length > 1) {
                    var $cellalt = $(me._table[0].rows[1].cells[cellIndex]);
                    if ($cellalt.length == 0) {
                        var $cellalt = $(me._table[0].rows[1].cells[0]);
                    }
                }
                if ($cell.length == 0) {
                    var $cell = $(me._table[0].rows[0].cells[0]);
                }

                var column = this;
                var removeClassFunc = function (cell) {
                    var tp = me.toThemeProperty;
                    cell.removeClass(tp('jqx-cell'));
                    cell.removeClass(tp('jqx-grid-cell-selected'));
                    cell.removeClass(tp('jqx-fill-state-pressed'));
                    cell.removeClass(tp('jqx-grid-cell-hover'));
                    cell.removeClass(tp('jqx-fill-state-hover'));
                    if (column.customCellStyles) {
                        for (var o in column.customCellStyles) {
                            cell.removeClass(column.customCellStyles[o]);
                        }
                    }
                }
                removeClassFunc($cell);
                if ($cellalt) {
                    removeClassFunc($cellalt);
                }

                if (this.displayfield == null) return true;

                if (me.showaggregates) {
                    if (me.getcolumnaggregateddata) {
                        aggregates.push(me.getcolumnaggregateddata(this.displayfield, this.aggregates, true, rows));
                    }
                }

                var type = me._getexportcolumntype(this);
                if (this.exportable && (!this.hidden || addhiddencolumns)) {
                    dataFields[this.displayfield] = {};
                    dataFields[this.displayfield].text = this.text;
                    dataFields[this.displayfield].width = parseInt(this.width);
                    if (isNaN(dataFields[this.displayfield].width)) dataFields[this.displayfield].width = 60;
                    dataFields[this.displayfield].formatString = this.cellsformat;
                    dataFields[this.displayfield].localization = me.gridlocalization;
                    dataFields[this.displayfield].type = type;
                    dataFields[this.displayfield].cellsAlign = this.cellsalign;
                    dataFields[this.displayfield].hidden = !exportHeader;
                    dataFields[this.displayfield].index = cellIndex;
                    dataFields[this.displayfield].maxIndex = columns.length;
                }

                styleName = 'cell' + styleIndex;

                var $element = this.element;

                if (datatype != "json" && datatype != "xml") {
                    columnStyleName = 'column' + columnStyleIndex;
                    var buildStyle = function (styleName, $element, isColumn, altStyle, meColumn, me, index, customStyle, rowIndex) {
                        styles[styleName] = { index: 1+index, maxIndex: columns.length };
                        if (me.rtl) {
                            styles[styleName].index = columns.length - index;
                        }

                        if (datatype == 'html' || datatype == 'xls' || datatype == 'pdf') {
                            if ($element) {
                                styles[styleName]['font-size'] = $element.css('font-size');
                                styles[styleName]['font-weight'] = $element.css('font-weight');
                                styles[styleName]['font-style'] = $element.css('font-style');
                                styles[styleName]['background-color'] = me._getexportcolor($element.css('background-color'));
                                styles[styleName]['color'] = me._getexportcolor($element.css('color'));
                                styles[styleName]['border-color'] = me._getexportcolor($element.css('border-top-color'));
                            }

                            if (isColumn) {
                                styles[styleName]['text-align'] = meColumn.align;
                            }
                            else {
                                styles[styleName]['text-align'] = meColumn.cellsalign;
                                styles[styleName]['formatString'] = meColumn.cellsformat;
                                styles[styleName]['dataType'] = type;
                            }

                            if (datatype == 'html' || datatype == 'pdf') {
                                styles[styleName]['border-top-width'] = "0px";
                                if (!me.rtl) {
                                    styles[styleName]['border-left-width'] = "0px";
                                    styles[styleName]['border-right-width'] = "1px";
                                }
                                else {
                                    styles[styleName]['border-left-width'] = "1px";
                                    styles[styleName]['border-right-width'] = "0px";
                                    if (index == columns.length - level-1 && isColumn) {
                                        styles[styleName]['border-right-width'] = "1px";
                                    }
                                }

                                styles[styleName]['border-bottom-width'] = "1px";
                                if ($element) {
                                    styles[styleName]['border-top-style'] = $element.css('border-top-style');
                                    styles[styleName]['border-left-style'] = $element.css('border-left-style');
                                    styles[styleName]['border-right-style'] = $element.css('border-right-style');
                                    styles[styleName]['border-bottom-style'] = $element.css('border-bottom-style');
                                }
                                if (isColumn) {
                                    if (index == 0 && !me.rtl) {
                                        styles[styleName]['border-left-width'] = "1px";
                                    }
                                    else {
                                        if (index == columns.length - 1 && me.rtl) {
                                            styles[styleName]['border-right-width'] = "1px";
                                        }
                                    }

                                    if ($element) {
                                        styles[styleName]['border-top-width'] = '1px';
                                        styles[styleName]['border-bottom-width'] = $element.css('border-bottom-width');
                                    }
                                }
                                else {
                                    if (index == 0 && !me.rtl) {
                                        styles[styleName]['border-left-width'] = "1px";
                                    }
                                    else {
                                        if (index == columns.length - 1 && me.rtl) {
                                            styles[styleName]['border-right-width'] = "1px";
                                        }
                                    }
                                }
                                if ($element) {
                                    styles[styleName]['height'] = $element.css('height');
                                }
                                if (me.treeGrid && !isColumn) {
                                    if (styles[styleName].index-1 < level) {
                                        if (me.rtl) {
                                            styles[styleName]['border-left-width'] = "0px";
                                        }
                                        else {
                                            styles[styleName]['border-right-width'] = "0px";
                                        }
                                    }
                                    else 
                                        if (styles[styleName].index-1 == level) {
                                            if (!me.rtl) {
                                                styles[styleName]['border-left-width'] = "0px";
                                            }
                                            else {
                                                styles[styleName]['border-right-width'] = "0px";
                                            }
                                        }
                                }
                            }
                        }
                        if (meColumn.exportable && (!meColumn.hidden || addhiddencolumns)) {
                            if (customStyle == true) {
                                if (!dataFields[meColumn.displayfield].customCellStyles) {
                                    dataFields[meColumn.displayfield].customCellStyles = new Array();
                                }

                                dataFields[meColumn.displayfield].customCellStyles[rowIndex] = styleName;
                            }
                            else {
                                if (isColumn) {
                                    dataFields[meColumn.displayfield].style = styleName;
                                }
                                else if (!altStyle) {
                                    dataFields[meColumn.displayfield].cellStyle = styleName;
                                }
                                else dataFields[meColumn.displayfield].cellAltStyle = styleName;
                            }
                        }
                    }

                    buildStyle(columnStyleName, $element, true, false, this, me, index);
                    columnStyleIndex++;
                    buildStyle(styleName, $cell, false, false, this, me, index);
                    if (me.altrows) {
                        styleName = 'cellalt' + styleIndex;
                        buildStyle(styleName, $cellalt, false, true, this, me, index);
                    }
                    if (this.customCellStyles) {
                        for (var o in column.customCellStyles) {
                            $cell.removeClass(column.customCellStyles[o]);
                        }
                        for (var o in column.customCellStyles) {
                            $cell.addClass(column.customCellStyles[o]);
                            buildStyle(styleName + column.customCellStyles[o], $cell, false, false, this, me, index, true, o);
                            $cell.removeClass(column.customCellStyles[o]);
                        }
                    }

                    styleIndex++;
                }
            });

            if (datatype != "json" && datatype != "xml") {
                if (level > 0 && this.treeGrid) {
                    var num = level + 1;
                    if (this.rtl) {
                        num = columns.length - level;
                    }
                    if (styles["column" + num]) {
                        var columnStyle = styles["column" + num];
                        columnStyle.merge = level;
                        columnStyle['border-left-width'] = "1px";

                        var cellStyle = styles["cell" + num];

                        for (var i = 0 ; i < columns.length; i++) {
                            var num = i + 1;
                            if (this.rtl) {
                                num = columns.length - i;
                            }
                            styles["column" + num].level = i;
                            styles["column" + num].maxLevel = level;
                            styles["cell" + num].maxLevel = level;
                            if (styles["cellalt" + num]) {
                                styles["cellalt" + num].maxLevel = level;
                            }
                        }

                        for (var i = 0 ; i < level; i++) {
                            var num = i + 1;
                            var index = i;
                            if (this.rtl) {
                                num = columns.length - i;
                            }
                            var currentStyle = styles["column" + num];
                            currentStyle.disabled = true;
                            styles["cell" + num].level = index;
                            styles["cell" + num].maxLevel = level;
                            styles["column" + num].level = index;
                            if (styles["cellalt" + num]) {
                                styles["cellalt" + num].level = index;
                                styles["cellalt" + num].maxLevel = level;
                            }

                            if (datatype == 'html' || datatype == 'pdf' || datatype == "xls") {
                                currentStyle['font-size'] = columnStyle['font-size'];
                                currentStyle['font-weight'] = columnStyle['font-weight'];
                                currentStyle['font-style'] = columnStyle['font-style'];
                                currentStyle['background-color'] = columnStyle['background-color'];
                                currentStyle['color'] = columnStyle['color'];
                                currentStyle['border-color'] = columnStyle['border-color'];

                                if (datatype == 'html' || datatype == 'pdf') {
                                    currentStyle['border-top-width'] = columnStyle['border-top-width'];
                                    currentStyle['border-left-width'] = columnStyle['border-left-width'];
                                    if (this.rtl) {
                                        currentStyle['border-right-width'] = columnStyle['border-right-width'];
                                        if (i == 0) {
                                            currentStyle['border-right-width'] = '1px';
                                        }
                                    }

                                    if (i == 0 && !this.rtl) {
                                        currentStyle['border-left-width'] = '0px';
                                    }
                                    else {
                                        if (i == 0 && this.rtl) {
                                            currentStyle['border-left-width'] = '0px';
                                        }
                                    }

                                    if (!this.rtl) {
                                        currentStyle['border-right-width'] = '0px';
                                    }
                                    else {
                                        if (this.rtl) {
                                            currentStyle['border-left-width'] = '0px';
                                        }
                                    }

                                    currentStyle['border-bottom-width'] = '0px';

                                    var currentStyle = styles["cell" + num];
                                    if (!this.rtl) {
                                        currentStyle['border-right-width'] = '0px';
                                    }
                                    else {
                                        if (this.rtl) {
                                            currentStyle['border-left-width'] = '0px';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (this.showaggregates) {
                var aggregatedrows = [];
                var prefix = datatype == 'xls' ? "AG" : "";
                var offset = 0;
                if (this.rowdetails && !this.treeGrid) offset++;

                if (aggregates.length > 0) {
                    $.each(columns, function (index) {
                        if (this.aggregates) {
                            for (var i = 0; i < this.aggregates.length; i++) {
                                if (!aggregatedrows[i]) aggregatedrows[i] = {};
                                if (aggregatedrows[i]) {
                                    var aggregatename = me._getaggregatename(this.aggregates[i]);
                                    var aggregatetype = me._getaggregatetype(this.aggregates[i]);
                                    var aggregate = aggregates[index - offset];
                                    if (aggregate) {
                                        aggregatedrows[i][this.displayfield] = prefix + aggregatename + ": " + aggregate[aggregatetype];
                                    }
                                }
                            }
                        }
                    });
                    $.each(columns, function (index) {
                        for (var i = 0; i < aggregatedrows.length; i++) {
                            if (aggregatedrows[i][this.displayfield] == undefined) {
                                aggregatedrows[i][this.displayfield] = prefix;
                            }
                        }
                    });
                }
                $.each(aggregatedrows, function () {
                    rows.push(this);
                });
            }

            var that = this;

            var exporter = $.jqx.dataAdapter.ArrayExporter(rows, dataFields, styles, exportServer, this.treeGrid && (datatype == "xml" || datatype == "json"));
            if (filename == undefined) {
                // update ui
                this._renderrows();
                var result = exporter.exportTo(datatype);
                if (this.showaggregates) {
                    $.each(aggregatedrows, function () {
                        rows.pop(this);
                    });
                }

                setTimeout(function () {
                    that.exporting = false;
                }, 50);
                return result;
            }
            else {
                var isHierarchy = this.treeGrid && (datatype == "xml" || datatype == "json");
                exporter.exportToFile(datatype, filename, exportServer, charset, isHierarchy);
            }
            // update ui
            if (this.showaggregates) {
                $.each(aggregatedrows, function () {
                    rows.pop(this);
                });
            }
            this._renderrows();
            setTimeout(function () {
                that.exporting = false;
            }, 50);
        },

        _getexportcolor: function (value) {
            var color = value;
            if (value == 'transparent') color = "#FFFFFF";
            if (!color || !color.toString()) {
                color = "#FFFFFF";
            }

            if (color.toString().indexOf('rgb') != -1) {
                var rgb = color.split(',');
                if (color.toString().indexOf('rgba') != -1) {
                    var r = parseInt(rgb[0].substring(5));
                    var g = parseInt(rgb[1]);
                    var b = parseInt(rgb[2]);
                    var a = parseInt(rgb[3].substring(1, 4));
                    var rgbObj = { r: r, g: g, b: b };
                    var hex = this._rgbToHex(rgbObj);
                    if (r == 0 && g == 0 && b == 0 && a == 0) {
                        return "#ffffff";
                    }

                    return "#" + hex;
                }

                var r = parseInt(rgb[0].substring(4));
                var g = parseInt(rgb[1]);
                var b = parseInt(rgb[2].substring(1, 4));
                var rgbObj = { r: r, g: g, b: b };
                var hex = this._rgbToHex(rgbObj);
                return "#" + hex;
            }
            else if (color.toString().indexOf('#') != -1) {
                if (color.toString().length == 4) {
                    var colorPart = color.toString().substring(1, 4);
                    color += colorPart;
                }
            }

            return color;
        },

        _rgbToHex: function (rgb) {
            return this._intToHex(rgb.r) + this._intToHex(rgb.g) + this._intToHex(rgb.b);
        },

        _intToHex: function (dec) {
            var result = (parseInt(dec).toString(16));
            if (result.length == 1)
                result = ("0" + result);
            return result.toUpperCase();
        },

        _getexportcolumntype: function (column) {
            var me = this;
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
                    if (column.cellsformat.indexOf('c') != -1) {
                        return 'number';
                    }
                    if (column.cellsformat.indexOf('n') != -1) {
                        return 'number';
                    }
                    if (column.cellsformat.indexOf('p') != -1) {
                        return 'number';
                    }
                    if (column.cellsformat.indexOf('d') != -1) {
                        return 'date';
                    }
                    if (column.cellsformat.indexOf('y') != -1) {
                        return 'date';
                    }
                    if (column.cellsformat.indexOf('M') != -1) {
                        return 'date';
                    }
                    if (column.cellsformat.indexOf('m') != -1) {
                        return 'date';
                    }
                    if (column.cellsformat.indexOf('t') != -1) {
                        return 'date';
                    }

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

        showdetails: function (index) {
            var key = this._getkey(index);
            this.showdetailsbykey(key);
        },

        hidedetails: function (index) {
            var key = this._getkey(index);
            this.hidedetailsbykey(key);
        },

        setcellvaluebykey: function (key, datafield, value) {
            var row = this.rowsByKey[key];
            var index = this.getRows().indexOf(row);
            var datarow = row;
            if (datarow != null && datarow[datafield] == value) {
                return false;
            }

            if (datarow != null && datarow[datafield] === null && value === "") {
                return;
            }

            var oldvalue = "";
            if (datarow != null && datarow[datafield] !== value) {
                var column = this.getcolumn(datafield);
                var type = 'string';
                var datafields = this.source.datafields || ((this.source._source) ? this.source._source.datafields : null);

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
                        type = foundType;
                }

                oldvalue = datarow[datafield];
                if (!column.nullable || (value != null && value !== "" && column.nullable && value.label === undefined)) {
                    if ($.jqx.dataFormat.isNumber(oldvalue) || type == 'number' || type == 'float' || type == 'int' || type == 'decimal' && type != 'date') {
                        value = new Number(value);
                        value = parseFloat(value);
                        if (isNaN(value)) {
                            value = 0;
                        }
                    }
                    else if ($.jqx.dataFormat.isDate(oldvalue) || type == 'date') {
                        if (value != '') {
                            var tmp = value;
                            tmp = new Date(tmp);
                            if (tmp != 'Invalid Date' && tmp != null) {
                                value = tmp;
                            }
                            else if (tmp == 'Invalid Date') {
                                tmp = new Date();
                                value = tmp;
                            }
                        }
                    }
                    if (datarow[datafield] === value) {
                        return;
                    }
                }

                datarow[datafield] = value;
                if (this.treeGrid) {
                    var treeRow = this.treeGrid.getrow(key);
                    if (treeRow) {
                        treeRow[datafield] = value;
                    }
                }

                if (value != null && value.label != null) {
                    var column = this.getcolumn(datafield);
                    datarow[column.displayfield] = value.label;
                    datarow[datafield] = value.value;
                    if (this.treeGrid) {
                        var treeRow = this.treeGrid.getrow(key);
                        if (treeRow) {
                            treeRow[column.displayfield] = value.label;
                            treeRow[datafield] = value.value;
                        }
                    }
                }
            }


            if (this.source && this.source._knockoutdatasource && !this._updateFromAdapter && this.autokoupdates) {
                if (this.source._source._localdata) {
                    var korowindex = index;
                    var olditem = this.source._source._localdata()[korowindex];
                    this.source.suspendKO = true;
                    var oldobject = olditem;
                    if (oldobject[datafield] && oldobject[datafield].subscribe) {
                        if (value != null && value.label != null) {
                            oldobject[column.displayfield](value.label);
                            oldobject[datafield](value.value);
                        }
                        else {
                            oldobject[datafield](value);
                        }
                    }
                    else {
                        var datafields = this.source._source.datafields;
                        var sourcedatafield = null;
                        var map = null;
                        if (datafields) {
                            $.each(datafields, function () {
                                if (this.name == datafield) {
                                    map = this.map;
                                    return false;
                                }
                            });
                        }
                        if (map == null) {
                            if (value != null && value.label != null) {
                                oldobject[datafield] = value.value;
                                oldobject[column.displayfield] = value.label;
                            }
                            else {
                                oldobject[datafield] = value;
                            }
                        }
                        else {
                            var splitMap = map.split(this.source.mapChar);
                            if (splitMap.length > 0) {
                                var datavalue = oldobject;
                                for (var p = 0; p < splitMap.length - 1; p++) {
                                    datavalue = datavalue[splitMap[p]];
                                }
                                datavalue[splitMap[splitMap.length - 1]] = value;
                            }
                        }
                        this.source._source._localdata.replace(olditem, $.extend({}, oldobject));
                    }

                    this.source.suspendKO = false;
                }
            }

            if (this.source.updaterow && (sync == undefined || sync == true)) {
                var success = false;
                var result = function (param) {
                    if (false == param) {
                        this.setcellvalue(row, datafield, oldvalue, true, false);
                    }
                }
                try {
                    var rowid = key;
                    success = this.source.updaterow(rowid, datarow, result);
                    if (success == undefined) success = true;
                }
                catch (error) {
                    success = false;
                    this.setcellvalue(row, datafield, oldvalue);
                    return;
                }
            }
            this._raiseEvent('cellValueChanged', { value: value, oldValue: oldvalue, key: key, index: index, row: this.rowsByKey[key] });
            this._renderrows();
        },

        setcellvalue: function (row, datafield, value) {
            if (row == null || datafield == null)
                return false;

            var index = parseInt(row);
            var key = this._getkey(index);
            this.setcellvaluebykey(key, datafield, value);
        },

        getcelltext: function (row, datafield) {
            if (row == null || datafield == null)
                return false;

            var index = parseInt(row);
            var key = this._getkey(index);
            return this.getcelltextbykey(key, datafield);
        },

        getcelltextbykey: function (key, datafield) {
            if (key == null || datafield == null)
                return null;

            var cellvalue = this.getcellvaluebykey(key, datafield);
            var column = this.getcolumn(datafield);
            if (column && column.cellsformat != '') {
                if ($.jqx.dataFormat) {
                    if ($.jqx.dataFormat.isDate(cellvalue)) {
                        cellvalue = $.jqx.dataFormat.formatdate(cellvalue, column.cellsformat, this.gridlocalization);
                    }
                    else if ($.jqx.dataFormat.isNumber(cellvalue) || (!isNaN(parseFloat(cellvalue)) && isFinite(cellvalue))) {
                        cellvalue = $.jqx.dataFormat.formatnumber(cellvalue, column.cellsformat, this.gridlocalization);
                    }
                }
            }
            return cellvalue;
        },

        getcellvalue: function (row, datafield) {
            if (row == null || datafield == null)
                return false;

            var index = parseInt(row);
            var key = this._getkey(index);
            return this.getcellvaluebykey(key, datafield);
        },

        getcellvaluebykey: function (key, datafield) {
            var row = this.rowsByKey[key];
            if (!row && this.treeGrid) {
                row = this.treeGrid.getrow(key);
            }
            var index = this.getRows().indexOf(row);
            var datarow = row;

            var oldvalue = "";
            if (datarow != null) {
                return datarow[datafield];
            }
            return null;
        },

        beginrowedit: function (index) {
            var key = this._getkey(index);
            this.beginroweditbykey(key);
        },

        endrowedit: function (index, cancel) {
            var key = this._getkey(index);
            this.endroweditbykey(key, cancel);
        },

        beginroweditbykey: function (key) {
            if (this.editKey === key && this.editKey != undefined) {
                return false;
            }

            if (this.rowinfo[key] && this.rowinfo[key].locked) {
                return false;
            }

            if (this.editKey != null) {
                this.endroweditbykey(key, true);
                return false;
            }

            var that = this;
            var row = this.rowsByKey[key];
            if (this.treeGrid) {
                var row = this.treeGrid.getrow(key);
            }
            var index = this.getRows().indexOf(row);
            var item = this._getuirow(key);
            var pinneditem = this._getpinneduirow(key);
            this._editors = new Array();
            var focused = false;
            if (item) {
                var cells = item[0].cells;
                var height = 0;

                for (var i = 0; i < cells.length; i++) {
                    var column = this.columns.records[i];
                    var cell = cells[i];
                    if (column.rowdetailscolumn) {
                        continue;
                    }

                    if (column.checkboxcolumn) {
                        continue;
                    }

                    if (column.pinned) {
                        cell = pinneditem[0].cells[i];
                    }


                    $(cell).removeClass(this.toTP('jqx-grid-cell-selected'));
                    $(cell).removeClass(this.toTP('jqx-fill-state-pressed'));
                    $(cell).removeClass(this.toTP('jqx-grid-cell-hover'));
                    $(cell).removeClass(this.toTP('jqx-fill-state-hover'));

                    if (column.columntype == "none") {
                        continue;
                    }

                    var width = $(cell).outerWidth();
                    var innerWidth = $(cell).width();
                    if (height === 0) {
                        height = $(cell).outerHeight() - 1;
                    }
                    $(cell).css('padding', '0px');
                    cellContent = "<div style='height:" + height + "px; width: 100%; overflow: hidden; border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 9999;'></div>";
                    var cellvalue = this.getcelltextbykey(key, column.displayfield);
                    cell.innerHTML = cellContent;
                    var editorContainer = $(cell.firstChild);
                    switch (column.columntype) {
                        case "textbox":
                        case "default":
                            var editor = $("<input style='border: none;' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' type='textbox'/>").appendTo(editorContainer);
                            if (this.rtl) {
                                editor.css('direction', 'rtl');
                            }
                            editor.addClass(this.toThemeProperty('jqx-input'));
                            editor.addClass(this.toThemeProperty('jqx-widget-content'));
                            editor.addClass(this.toThemeProperty('jqx-cell-editor'));
                            editor[0].onfocus = function (event) {
                                setTimeout(function () {
                                    if (event) {
                                        var index = $(event.target).parent().parent().index();
                                        that.ensurecolumnvisible(that.columns.records[index].datafield);
                                    }
                                    else {
                                        var index = $(document.activeElement).parent().parent().index();
                                        if (index >= 0) {
                                            that.ensurecolumnvisible(that.columns.records[index].datafield);
                                        }
                                    }
                                    if (that.content) {
                                        that.content[0].scrollTop = 0;
                                        that.content[0].scrollLeft = 0;
                                    }
                                    if (that.gridcontent) {
                                        that.gridcontent[0].scrollLeft = 0;
                                        that.gridcontent[0].scrollTop = 0;
                                    }
                                }, 10);
                            }
                       
                            if (!column.editable) {
                                editor.attr('disabled', true);
                                editor.attr('readOnly', true);
                                editor.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                            }
                            else if (!focused) {
                                focused = true;
                                editor.focus();
                                var firstEditor = editor;
                                setTimeout(function () {
                                    firstEditor.focus();
                                    try {
                                        if ('selectionStart' in firstEditor[0]) {
                                            firstEditor[0].setSelectionRange(0, 0);
                                        }
                                        else {
                                            var range = firstEditor[0].createTextRange();
                                            range.collapse(true);
                                            range.moveEnd('character', 0);
                                            range.moveStart('character', 0);
                                            range.select();
                                        }
                                    }
                                    catch (error) {
                                        var err = error;
                                    }
                                }, 10);
                            }

                            editor.width(innerWidth);
                            editor.height(height);
                            if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                                editor.css('line-height', parseInt(height) + 'px');
                            }

                            editor.css('text-align', column.cellsalign);
                            if (cellvalue === null) cellvalue = "";
                            if (cellvalue == undefined) cellvalue = "";

                            editor.val(cellvalue);
                            if (column.createeditor) {
                                var celltext = cellvalue;
                                var cellvalue = this.getcellvaluebykey(key, column.displayfield);
                                column.createeditor(!this.treeGrid ? index : key, cellvalue, editor, celltext, innerWidth, height);
                            }
                            this._editors.push({ column: column, editor: editor });
                            if (column.cellsformat != "") {
                                if (column.cellsformat.indexOf('p') != -1 || column.cellsformat.indexOf('c') != -1 || column.cellsformat.indexOf('n') != -1 || column.cellsformat.indexOf('f') != -1) {
                                    editor.keydown(function (event) {
                                        var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                                        var letter = String.fromCharCode(key);
                                        var charDigit = parseInt(letter);
                                        if (isNaN(charDigit))
                                            return true;
                                        if (that._selection(editor).length > 0)
                                            return true;

                                        var val = "";
                                        var cellvalue = editor.val();
                                        if (column.cellsformat.length > 1) {
                                            var decimalOffset = parseInt(column.cellsformat.substring(1));
                                            if (isNaN(decimalOffset)) decimalOffset = 0;
                                        }
                                        else {
                                            var decimalOffset = 0;
                                        }

                                        if (decimalOffset > 0) {
                                            if (cellvalue.indexOf(that.gridlocalization.decimalseparator) != -1) {
                                                if (that._selection(editor).start > cellvalue.indexOf(that.gridlocalization.decimalseparator)) {
                                                    return true;
                                                }
                                            }
                                        }

                                        for (var t = 0; t < cellvalue.length - decimalOffset; t++) {
                                            var ch = cellvalue.substring(t, t + 1);
                                            if (ch.match(/^[0-9]+$/) != null) {
                                                val += ch;
                                            }
                                        }
                                        if (val.length >= 11) {
                                            return false;
                                        }
                                    });
                                }
                            }
                            if (column.initeditor) {
                                var celltext = cellvalue;
                                var cellvalue = this.getcellvaluebykey(key, column.displayfield);
                                column.initeditor(!this.treeGrid ? index : key, cellvalue, editor, celltext, innerWidth, height);
                            }
                            break;
                        case "custom":
                        case "template":
                            if (!this.editorsCache) {
                                this.editorsCache = new Array();
                            }
                            var editorElement = $("<div style='width: 100%; height: 100%; border: none;'></div>").appendTo(editorContainer);

                            var datafieldname = $.trim(column.datafield).split(" ").join("");
                            if (datafieldname.indexOf('.') != -1) {
                                datafieldname = datafieldname.replace('.', "");
                            }
                            var templateeditor = this.editorsCache["templateeditor" + "_" + datafieldname];
                            if (column.columntype == "custom") {
                                var templateeditor = this.editorsCache["customeditor" + "_" + datafieldname + "_" + key];
                            }

                            var celltext = cellvalue;
                            var cellvalue = this.getcellvaluebykey(key, column.displayfield);

                            if (!templateeditor) {
                                var editor = $("<div style='border: none;'></div>");
                                editor.width(width);
                                editor.height(height);
                                templateeditor = editor;
                                if (cellvalue === null) cellvalue = "";
                                if (column.columntype != "custom") {
                                    this.editorsCache["templateeditor" + "_" + datafieldname] = editor;
                                }
                                else {
                                    this.editorsCache["customeditor" + "_" + datafieldname + "_" + key] = editor;
                                }

                                editor.appendTo(editorElement);
                                if (column.createeditor) {
                                    column.createeditor(!this.treeGrid ? index : key, cellvalue, editor, celltext, width, height);
                                }
                            }
                            else {
                                var editor = templateeditor;
                                editor.width(width);
                                editor.height(height);
                                editor.appendTo(editorElement);
                            }

                            if (column.initeditor) {
                                column.initeditor(!this.treeGrid ? index : key, cellvalue, editor, celltext, width, height);
                            }
                            this._editors.push({ column: column, editor: editor });
                            break;
                    }
                }
            }

            this.editKey = key;
            this.beginupdate();
            this._raiseEvent('rowBeginEdit', { key: key, index: index, row: this.rowsByKey[key] });
            this.endupdate(false);
        },

        _toNumber: function (value) {
            if (!value.indexOf && value != undefined) value = value.toString();

            if (value.indexOf(this.gridlocalization.currencysymbol) > -1) {
                // remove currency symbol
                value = value.replace(this.gridlocalization.currencysymbol, "");
            }

            var replaceAll = function (text, stringToFind, stringToReplace) {
                var temp = text;
                if (stringToFind == stringToReplace) return text;

                var index = temp.indexOf(stringToFind);
                while (index != -1) {
                    temp = temp.replace(stringToFind, stringToReplace);
                    index = temp.indexOf(stringToFind)
                }

                return temp;
            }

            value = replaceAll(value, this.gridlocalization.thousandsseparator, "");
            value = value.replace(this.gridlocalization.decimalseparator, ".");

            if (value.indexOf(this.gridlocalization.percentsymbol) > -1) {
                value = value.replace(this.gridlocalization.percentsymbol, "");
            }

            var val = "";
            for (var t = 0; t < value.length; t++) {
                var ch = value.substring(t, t + 1);
                if (ch === "-") val += "-";
                if (ch === ".") val += ".";
                if (ch.match(/^[0-9]+$/) != null) {
                    val += ch;
                }
            }

            value = val;
            value = value.replace(/ /g, "");
            return value;
        },

        _geteditorvalue: function (column, editor, index, rowKey) {
            var value = new String();

            if (editor) {
                switch (column.columntype) {
                    case "textbox":
                    default:
                        value = editor.val();
                        if (column.cellsformat != "") {
                            var type = 'string';
                            var datafields = this.source.datafields || ((this.source._source) ? this.source._source.datafields : null);

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
                                    type = foundType;
                            }

                            var number = type === "number" || type === "float" || type === "int" || type === "integer";
                            var date = type === "date" || type === "time";
                            if (number || (type === "string" && (column.cellsformat.indexOf('p') != -1 || column.cellsformat.indexOf('c') != -1 || column.cellsformat.indexOf('n') != -1 || column.cellsformat.indexOf('f') != -1))) {
                                if (value === "" && column.nullable)
                                    return "";

                                value = this._toNumber(value);
                                value = new Number(value);
                                if (isNaN(value))
                                    value = "";
                            }
                            if (date || (type === "string" && (column.cellsformat.indexOf('H') != -1 || column.cellsformat.indexOf('m') != -1 || column.cellsformat.indexOf('M') != -1 || column.cellsformat.indexOf('y') != -1
                                || column.cellsformat.indexOf('h') != -1 || column.cellsformat.indexOf('d') != -1))) {
                                if (value === "" && column.nullable)
                                    return "";

                                var tmpValue = value;
                                value = new Date(value);
                                if (value == "Invalid Date" || value == null) {
                                    if ($.jqx.dataFormat) {
                                        value = $.jqx.dataFormat.parsedate(tmpValue, column.cellsformat, this.gridlocalization);
                                    }
                                    if (value == "Invalid Date" || value == null) {
                                        value = "";
                                    }
                                }
                            }

                        }
                        if (column.displayfield != column.datafield) {
                            value = { label: value, value: value };
                        }
                        break;
                }
                if (column.geteditorvalue) {
                    var oldValue = this.getcellvaluebykey(rowKey, column.displayfield);
                    value = column.geteditorvalue(!this.treeGrid ? index : rowKey, oldValue, editor);
                }
            }
            return value;
        },

        endroweditbykey: function (key, cancel) {
            var row = this.rowsByKey[key];
            var index = this.getRows().indexOf(row);
            var that = this;
            if (cancel !== true) {
                var editors = this._editors;
                var validated = true;
                if (editors) {
                    var rowKey = this.editKey;
                    var item = this._getuirow(rowKey);
                    for (var i = 0; i < editors.length; i++) {
                        var editor = editors[i].editor;
                        var column = editors[i].column;
                        var value = this._geteditorvalue(column, editor, index, rowKey);
                        if (column.validation) {
                            editor.removeClass(this.toThemeProperty('jqx-grid-validation-label'));
                            var datafield = column.datafield;
                            try {
                                var validationobj = column.validation({ value: value, row: rowKey, datafield: column.datafield, displayfield: column.displayfield, column: column }, value);
                                var validationmessage = this.gridlocalization.validationstring;
                                if (validationobj.message != undefined) {
                                    validationmessage = validationobj.message;
                                }
                                var result = typeof validationobj == "boolean" ? validationobj : validationobj.result;

                                if (!result) {
                                    if (validationobj.showmessage == undefined || validationobj.showmessage == true) {
                                        this._showvalidationpopup(item, datafield, validationmessage, editor);
                                    }
                                    validated = false;
                                }
                            }
                            catch (error) {
                                this._showvalidationpopup(item, datafield, this.gridlocalization.validationstring, editor);
                                validated = false;
                            }
                        }
                    }
                    if (validated) {
                        for (var i = 0; i < editors.length; i++) {
                            var editor = editors[i].editor;
                            var column = editors[i].column;
                            var value = this._geteditorvalue(column, editor, index, rowKey);
                            var oldValue = row[column.displayfield];
                            if (value && value.label != undefined) {
                                row[column.displayfield] = value.label;
                                row[column.datafield] = value.value;
                            }
                            else {
                                row[column.displayfield] = value;
                            }
                            if (this.treeGrid) {
                                var treeRow = this.treeGrid.getrow(rowKey);
                                if (treeRow) {
                                    treeRow[column.displayfield] = value;
                                }
                            }
                            if (value != oldValue) {
                                if (this.editorsCache) {
                                    var editor1 = "customeditor" + "_" + column.displayfield + "_" + key;
                                    var editor2 = "templateeditor" + "_" + column.displayfield;
                                    if (this.editorsCache[editor1]) {
                                        this.editorsCache[editor1].detach();
                                    }
                                    if (this.editorsCache[editor2]) {
                                        this.editorsCache[editor2].detach();
                                    }
                                }
                                this.beginupdate();
                                this._raiseEvent('cellValueChanged', { value: value, oldValue: oldValue, key: key, index: index, row: row });
                                this.endupdate(false);
                            }
                        }
                    }
                }
                if (!validated) {
                    return false;
                }
                this.updaterowbykey(this.editKey, row, false);
            }

            if (this.editorsCache) {
                for (var editor in this.editorsCache) {
                    $(this.editorsCache[editor]).detach();
                }
            }

            this.beginupdate();
            this._raiseEvent('rowEndEdit', { key: key, index: index, row: this.rowsByKey[key] });
            this.endupdate(false);

            this.editKey = null;
            this._renderrows();
            this._renderhorizontalscroll();
            this.host.focus();
            setTimeout(function () {
                that.host.focus();
            }, 10);
            return true;
        },

        _showvalidationpopup: function (row, datafield, message, editor) {
            if (message == undefined) {
                var message = this.gridlocalization.validationstring;
            }
            editor.addClass(this.toThemeProperty('jqx-grid-validation-label'));
            var validationpopup = $("<div style='z-index: 99999; top: 0px; left: 0px; position: absolute;'></div>");
            var validationpopuparrow = $("<div style='width: 20px; height: 20px; z-index: 999999; top: 0px; left: 0px; position: absolute;'></div>");
            validationpopup.html(message);
            validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
            validationpopup.addClass(this.toThemeProperty('jqx-grid-validation'));
            validationpopup.addClass(this.toThemeProperty('jqx-rc-all'));
            validationpopup.hide();
            validationpopuparrow.hide();
            validationpopup.prependTo(this.table);
            validationpopuparrow.prependTo(this.table);

            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var left = parseInt(horizontalscrollvalue);
            var element = this.getcolumn(datafield).uielement;
            var rowElement = row;
            validationpopup.css('top', parseInt(rowElement.position().top) + 30 + 'px');

            var topposition = parseInt(validationpopup.css('top'));

            validationpopuparrow.css('top', topposition - 11);
            validationpopuparrow.removeClass();
            validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));

            var negativePosition = false;
            if (topposition >= this._table.height()) {
                validationpopuparrow.removeClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
                validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-down'));
                topposition = parseInt(rowElement.position().top) - rowElement.outerHeight() - 5;
                if (topposition < 0) {
                    topposition = 0;
                    validationpopuparrow.removeClass(this.toThemeProperty('jqx-grid-validation-arrow-down'));
                    negativePosition = true;
                }
                validationpopup.css('top', topposition + 'px');
                validationpopuparrow.css('top', topposition + validationpopup.outerHeight() - 9);
            }
            var leftposition = -left + parseInt($(element).position().left);

            validationpopuparrow.css('left', left + leftposition + 30);

            var width = validationpopup.width();
            if (width + leftposition > this.host.width() - 20) {
                var offset = width + leftposition - this.host.width() + 40;
                leftposition -= offset;
            }

            if (!negativePosition) {
                validationpopup.css('left', left + leftposition);
            } else {
                validationpopup.css('left', left + parseInt($(element).position().left) - validationpopup.outerWidth());
            }

            editor.mouseenter(function () {
                if (editor.hasClass('jqx-grid-validation-label')) {
                    validationpopup.show();
                    validationpopuparrow.show();
                }
            });
            editor.mouseleave(function () {
                validationpopup.hide();
                validationpopuparrow.hide();
            });

            if (!this.popups) {
                this.popups = new Array();
            }
            this.popups[this.popups.length] = { validation: validationpopup, validationrow: validationpopuparrow };
        },

        addrow: function (rowid, rowdata, position, parentID) {
            if (rowdata != undefined) {
                this._datachanged = true;
                if (position == undefined) {
                    position = 'last';
                }

                var success = false;
                var that = this.that;

                if (rowid == null) {
                    var hasFilter = this.dataview.filters && this.dataview.filters.length > 0;
                    var totallength = !hasFilter ? this.dataview.totalrecords : this.source.records.length;
                    if (!$.isArray(rowdata)) {
                        rowid = this.dataview.getid(this.dataview.source.id, rowdata, totallength);
                        if (this.getcolumn(this.dataview.source.id)) {
                            rowdata[this.dataview.source.id] = rowid;
                        }
                    } else {
                        var ids = new Array();
                        $.each(rowdata, function (index, value) {
                            var id = that.dataview.getid(that.dataview.source.id, rowdata[index], totallength + index);
                            ids.push(id);
                            if (that.getcolumn(that.dataview.source.id)) {
                                rowdata[index][that.dataview.source.id] = id;
                            }

                        });
                        rowid = ids;
                    }
                }
                else {
                    if (!$.isArray(rowdata)) {
                        if (this.getcolumn(this.dataview.source.id)) {
                            rowdata[this.dataview.source.id] = rowid;
                        }
                    } else {
                        $.each(rowdata, function (index, value) {
                            var id = rowid[index];
                            if (that.getcolumn(that.dataview.source.id)) {
                                rowdata[index][that.dataview.source.id] = id;
                            }
                        });
                    }
                }

                var applychanges = function (that, rowid, rowdata, position) {
                    if (that._loading) {
                        throw new Error('jqxDataTable: ' + that.loadingerrorthatssage);
                        return false;
                    }

                    var scrollvalue = that.vScrollInstance.value;
                    var success = false;
                    if (!$.isArray(rowdata)) {
                        rowdata.uid = rowid;
                        that.rowsByKey[rowid] = rowdata;
                        if (rowid == parentID) parentID = null;
                        success = that.source.addRecord(rowdata, position, parentID);
                    }
                    else {
                        $.each(rowdata, function (index, value) {
                            var id = null;
                            if (rowid != null && rowid[index] != null) id = rowid[index];
                            this.uid = id;
                            that.rowsByKey[id] = this;
                            if (rowid == parentID) parentID = null;
                            success = that.source.addRecord(this, position, parentID);
                        });
                    }

                    if (that._updating == undefined || that._updating == false) {
                        that.refresh();
                    }

                    if (that.source && that.source._knockoutdatasource && !that._updateFromAdapter && that.autokoupdates) {
                        if (that.source._source._localdata) {
                            that.source.suspendKO = true;
                            that.source._source._localdata.push(rowdata);
                            that.source.suspendKO = false;
                        }
                    }

                    that.vScrollInstance.setPosition(scrollvalue);

                    return success;
                }

                if (this.source.addrow) {
                    var done = function (result, ids) {
                        if (result == true || result == undefined) {
                            if (ids != undefined) rowid = ids;
                            applychanges(that, rowid, rowdata, position);
                        }
                    }
                    // undefined or true response code are handled as success. false or exception as failure
                    try {
                        if (!that.treeGrid) {
                            success = this.source.addrow(rowid, rowdata, position, done);
                        }
                        else {
                            success = this.source.addrow(rowid, rowdata, position, parentID, done);
                        }
                        if (success == undefined) success = true;
                    }
                    catch (e) {
                        success = false;
                    }
                    if (success == false) {
                        return false;
                    }
                }
                else {
                    applychanges(this, rowid, rowdata, position);
                }

                return success;
            }
            return false;
        },

        deleterow: function (index) {
            var key = this._getkey(index);
            this.deleterowbykey(key);
        },

        deleterowbykey: function (rowid) {
            if (rowid != undefined) {
                this._datachanged = true;
                var success = false;
                var that = this.that;

                var applychanges = function (that, rowid) {
                    if (that._loading) {
                        throw new Error('jqxDataTable: ' + that.loadingerrorthatssage);
                        return false;
                    }

                    var success = false;
                    var scrollvalue = that.vScrollInstance.value;
                    if (!$.isArray(rowid)) {
                        var success = false;
                        if (that.rowsByKey[rowid]) {
                            success = true;
                            if (that.rowinfo[rowid].selected) {
                                that.unselectrowbykey(rowid, false);
                            }
                            delete that.rowsByKey[rowid];
                            if (that.treeGrid) {
                                if (that.rowinfo[rowid]) {
                                    var records = that.rowinfo[rowid].row.records;
                                    var hierarchicalDelete = function (records) {
                                        for (var i = 0; i < records.length; i++) {
                                            var id = records[i].uid;
                                            delete that.rowsByKey[id];
                                            delete that.rowinfo[id];
                                            if (records[i].records) {
                                                hierarchicalDelete(records[i].records);
                                            }
                                        }
                                    }
                                    if (records) {
                                        hierarchicalDelete(records);
                                    }
                                }
                            }
                            delete that.rowinfo[rowid];
                            that.source.deleteRecord(rowid);
                        }
                    }
                    else {
                        $.each(rowid, function () {
                            var rowid = this;
                            if (that.rowsByKey[rowid]) {
                                success = true;
                                if (that.rowinfo[rowid].selected) {
                                    that.unselectrowbykey(rowid, false);
                                }

                                delete that.rowsByKey[rowid];
                                if (that.treeGrid) {
                                    if (that.rowinfo[rowid]) {
                                        var records = that.rowinfo[rowid].row.records;
                                        var hierarchicalDelete = function (records) {
                                            for (var i = 0; i < records.length; i++) {
                                                var id = records[i].uid;
                                                delete that.rowsByKey[id];
                                                delete that.rowinfo[id];
                                                if (records[i].records) {
                                                    hierarchicalDelete(records[i].records);
                                                }
                                            }
                                        }
                                        if (records) {
                                            hierarchicalDelete(records);
                                            delete that.rowinfo[rowid];
                                        }
                                    }
                                }
                                that.source.deleteRecord(rowid);
                            }
                        });
                    }
                    that.refresh();
                    if (that.source && that.source._knockoutdatasource && !that._updateFromAdapter && that.autokoupdates) {
                        if (that.source._source._localdata) {
                            that.source.suspendKO = true;
                            that.source._source._localdata.pop(rowdata);
                            that.source.suspendKO = false;
                        }
                    }

                    that.vScrollInstance.setPosition(scrollvalue);
                    return success;
                }

                if (this.source.deleterow) {
                    var done = function (result) {
                        if (result == true || result == undefined) {
                            applychanges(that, rowid);
                        }
                    }
                    try {
                        this.source.deleterow(rowid, done);
                        if (success == undefined) success = true;
                    }
                    catch (error) {
                        success = false;
                    }
                }
                else {
                    success = applychanges(that, rowid);
                }
                return success;
            }

            return false;
        },

        updaterow: function (index, rowdata) {
            var key = this._getkey(index);
            this.updaterowbykey(key, rowdata);
        },

        updaterowbykey: function (rowid, rowdata, refresh) {
            if (rowid != undefined && rowdata != undefined) {
                var that = this.that;
                var success = false;
                var applychanges = function (that, rowid, rowdata) {
                    if (that._loading) {
                        throw new Error('jqxDataTable: ' + that.loadingerrorthatssage);
                        return false;
                    }

                    var success = false;
                    if (!$.isArray(rowid)) {
                        var record = that.rowsByKey[rowid];

                        var updateRecord = function (r) {
                            if (!r) success = false;
                            else {
                                for (var i = 0; i < that.columns.records.length; i++) {
                                    r[that.columns.records[i].datafield] = rowdata[that.columns.records[i].datafield];
                                }
                            }
                        }
                        updateRecord(record);
                        if (that.treeGrid) {
                            record = that.treeGrid.getrow(rowid);
                            updateRecord(record);
                        }

                    }
                    else {
                        $.each(rowid, function (index, value) {
                            var record = that.rowsByKey[this];
                            var updateRecord = function (that, r) {
                                if (!record) success = false;
                                else {
                                    record[this] = rowdata[index];
                                }
                            }
                            updateRecord(this, record);
                            if (that.treeGrid) {
                                record = that.treeGrid.getrow(this);
                                updateRecord(this, record);
                            }
                        });
                    }

                    var scrollvalue = that.vScrollInstance.value;
                    if (refresh == undefined || refresh == true) {
                        if (that._updating == undefined || that._updating == false) {
                            that._renderrows();
                        }
                    }

                    if (that.showaggregates && that._updatecolumnsaggregates) {
                        that._updatecolumnsaggregates();
                    }

                    if (that.source && that.source._knockoutdatasource && !that._updateFromAdapter && that.autokoupdates) {
                        if (that.source._source._localdata) {
                            var record = that.rowsByKey[rowid];
                            var recordindex = that.getRows().indexOf(record);
                            var olditem = that.source._source._localdata()[recordindex];
                            that.source.suspendKO = true;
                            that.source._source._localdata.replace(olditem, $.extend({}, record));
                            that.source.suspendKO = false;
                        }
                    }

                    that.vScrollInstance.setPosition(scrollvalue);
                    return success;
                }

                if (this.source.updaterow) {
                    var done = function (result) {
                        if (result == true || result == undefined) {
                            applychanges(that, rowid, rowdata);
                        }
                    }
                    try {
                        success = this.source.updaterow(rowid, rowdata, done);
                        if (success == undefined) success = true;
                    }
                    catch (error) {
                        success = false;
                    }
                }
                else {
                    success = applychanges(that, rowid, rowdata);
                }

                return success;
            }

            return false;
        },

        lockrow: function (index) {
            var key = this._getkey(index);
            this.lockrowbykey(key);
        },

        unlockrow: function (index) {
            var key = this._getkey(index);
            this.unlockrowbykey(key);
        },

        lockrowbykey: function (key) {
            if (this.rowinfo[key]) {
                this.rowinfo[key].locked = true;
            }
            else {
                this.rowinfo[key] = { locked: true };
            }

            this._renderrows();
        },

        unlockrowbykey: function (key) {
            if (this.rowinfo[key]) {
                this.rowinfo[key].locked = false;
            }
            else {
                this.rowinfo[key] = { locked: false };
            }

            this._renderrows();
        },

        selectrow: function (index) {
            var key = this._getkey(index);
            this.selectrowbykey(key);
        },

        unselectrow: function (index) {
            var key = this._getkey(index);
            this.unselectrowbykey(key);
        },

        selectrowbykey: function (key, reason, refresh) {
            if (reason != "keyboard" && reason != "mouse") {
                this._lastSelectedKey = key;
            }
            var r = refresh !== false ? true : false;
            this._doSelection(key, true, r);
            var row = this.rowsByKey[key];
            var index = this.getRows().indexOf(row);
            this._raiseEvent('rowSelect', { key: key, index: index, row: this.rowsByKey[key] });
        },

        unselectrowbykey: function (key, refresh) {
            var r = refresh !== false ? true : false;
            this._doSelection(key, false, r);
            var row = this.rowsByKey[key];
            var index = this.getRows().indexOf(row);
            this._raiseEvent('rowUnselect', { key: key, index: index, row: this.rowsByKey[key] });
        },

        getselection: function () {
            var rows = new Array();
            if (this.rowinfo) {
                for (var obj in this.rowinfo) {
                    var info = this.rowinfo[obj];
                    if (info.selected) {
                        rows.push(info.row);
                    }
                }
            }
            return rows;
        },

        showdetailsbykey: function (key) {
            if (!this.rowdetails) return;

            var rowdata = this.rowinfo[key];
            if (rowdata) {
                rowdata.expanded = true;
                var uirow = $(this._table.children()[1]).children(("[data-key=" + key + "]"));
                var pinneduirow = $(this._pinnedTable.children()[1]).children(("[data-key=" + key + "]"));
                if (uirow) {
                    var children = pinneduirow.children();
                    var toggleButton = $(children[0]);
                    if (this.rtl) {
                        var toggleButton = $(children[children.length - 1]);
                    }

                    if (!this.rtl) {
                        toggleButton.removeClass(this.toThemeProperty('jqx-grid-group-collapse'));
                        toggleButton.addClass(this.toThemeProperty('jqx-grid-group-expand'));
                        toggleButton.removeClass(this.toThemeProperty('jqx-icon-arrow-right'));
                        toggleButton.addClass(this.toThemeProperty('jqx-icon-arrow-down'));
                    }
                    else {
                        toggleButton.removeClass(this.toThemeProperty('jqx-grid-group-collapse-rtl'));
                        toggleButton.addClass(this.toThemeProperty('jqx-grid-group-expand-rtl'));
                        toggleButton.removeClass(this.toThemeProperty('jqx-icon-arrow-left'));
                        toggleButton.addClass(this.toThemeProperty('jqx-icon-arrow-down'));
                    }

                    uirow.next().show();
                    var rowdetails = pinneduirow.next();
                    rowdetails.show();
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        uirow.next().children().show();
                        pinneduirow.next().children().show();
                    }

                    if (!rowdata.initialized) {
                        var detailsHeight = rowdata.detailsHeight;
                        var result = this.initrowdetails(key, rowdata.row, $($(rowdetails).children().children().children()[0]), rowdata);
                        rowdata.details = $(rowdetails).children().children().children()[0];
                        rowdata.initialized = true;
                        if (result === false || rowdata.detailsHeight != detailsHeight) {
                            if (result === false) {
                                rowdata.expanded = false;
                                rowdata.nodetails = true;
                                rowdetails.hide();
                            }
                            this._renderrows();
                        }
                    }
                    this._updateScrollbars();
                    if (this.height === "auto" || this.height === null || this.autoheight) {
                        this._arrange();
                    }
                }
            }
        },

        hidedetailsbykey: function (key) {
            if (!this.rowdetails) return;

            var rowdata = this.rowinfo[key];
            if (rowdata) {
                rowdata.expanded = false;
                var uirow = $(this._table.children()[1]).children(("[data-key=" + key + "]"));
                var pinneduirow = $(this._pinnedTable.children()[1]).children(("[data-key=" + key + "]"));
                if (uirow) {
                    var children = pinneduirow.children();
                    var toggleButton = $(children[0]);
                    if (this.rtl) {
                        var toggleButton = $(children[children.length - 1]);
                    }
                    if (!this.rtl) {
                        toggleButton.addClass(this.toThemeProperty('jqx-grid-group-collapse'));
                        toggleButton.removeClass(this.toThemeProperty('jqx-grid-group-expand'));
                        toggleButton.addClass(this.toThemeProperty('jqx-icon-arrow-right'));
                        toggleButton.removeClass(this.toThemeProperty('jqx-icon-arrow-down'));
                    }
                    else {
                        toggleButton.addClass(this.toThemeProperty('jqx-grid-group-collapse-rtl'));
                        toggleButton.removeClass(this.toThemeProperty('jqx-grid-group-expand-rtl'));
                        toggleButton.addClass(this.toThemeProperty('jqx-icon-arrow-left'));
                        toggleButton.removeClass(this.toThemeProperty('jqx-icon-arrow-down'));
                    }

                    uirow.next().hide();
                    pinneduirow.next().hide();
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        uirow.next().children().hide();
                        pinneduirow.next().children().hide();
                    }

                    this._updateScrollbars();
                    if (this.height === "auto" || this.height === null || this.autoheight) {
                        this._arrange();
                    }
                }
            }
        },

        _renderhorizontalscroll: function () {
            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            if (this.hScrollBar.css('visibility') === 'hidden') {
                hScrollInstance.value = 0;
                horizontalscrollvalue = 0;
            }

            var left = parseInt(horizontalscrollvalue);
            if (this.table == null)
                return;

            var columnsrow = this.columnsrow;
            var columnstart = 0;
            var columnend = this.columns.records.length - columnstart;
            var columns = this.columns.records;
            var isempty = this.source.records.length == 0;
            if (this.rtl) {
                if (this.hScrollBar.css('visibility') != 'hidden') {
                    left = hScrollInstance.max - left;
                }
            }

            if (isempty && !this._haspinned) {
                this.table[0].style.left = -left + 'px';
                columnsrow[0].style.marginLeft = -left + 'px';
            }
            else {
                if (this._haspinned || this._haspinned == undefined) {
                    for (var j = 0; j < columnstart + columnend; j++) {
                        var column = columns[j];
                        if (column.pinned) {
                            var statuscell = null;

                            if (this.showaggregates) {
                                if (this.statusbar[0].cells) {
                                    statuscell = this.statusbar[0].cells[j];
                                }
                            }

                            if (this.filterrow) {
                                if (this.filterrow[0].cells) {
                                    filtercell = this.filterrow[0].cells[j];
                                }
                            }

                            if (!this.rtl) {
                                var columncell = columnsrow[0].cells[j];
                                columncell.style.marginLeft = left + 'px';
                                if (statuscell) {
                                    statuscell.style.marginLeft = left + 'px';
                                }
                                if (this.filterrow && filtercell) {
                                    filtercell.style.marginLeft = left + 'px';
                                }
                            }
                            else {
                                var columncell = columnsrow[0].cells[j];
                                columncell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                if (statuscell) {
                                    statuscell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                }
                                if (this.filterrow && filtercell) {
                                    filtercell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                }
                            }
                        }
                    }

                    this._table[0].style.left = -left + 'px';
                    columnsrow[0].style.marginLeft = -left + 'px';
                }
                else if (this._haspinned == false) {
                    this.table[0].style.left = -left + 'px';
                    columnsrow[0].style.marginLeft = -left + 'px';
                }
                if (this.filterrow) {
                    this.filterrow[0].style.left = -left + 'px';
                }
            }

            if (this.showaggregates) {
                if (this.aggregates[0].cells) {
                    var offset = 0;
                    if (this.rtl) {
                        if (this.vScrollBar.css('visibility') != 'hidden') {
                            if (this.hScrollBar.css('visibility') != 'hidden') {
                                offset = 2 + parseInt(this.hScrollBar.css('left'));
                            }
                            else {
                                offset = 3 + parseInt(this.vScrollBar.width());
                            }
                        }
                    }
                    this.aggregates[0].style.marginLeft = -left + offset + 'px';
                }
            }
        },

        _initializeColumns: function () {
            var datafields = this.source.datafields;
            if (datafields == null && this.source._source) {
                datafields = this.source._source.datafields;
            }
            var hasfields = datafields ? datafields.length > 0 : false;

            if (this.columns && this.columns.records) {
                for (var i = 0; i < this.columns.records.length; i++) {
                    this._removecolumnhandlers(this.columns.records[i]);
                }
            }
            var that = this;
            var _columns = new $.jqx.collection(this.element);
            var visibleindex = 0;
            this._haspinned = false;
            if (!this._columns) {
                this._columns = this.columns;
            }
            else {
                this.columns = this._columns;
            }

            if (this.selectionmode == "checkbox") {
                var column = new jqxDataTableColumn(that, this);
                column.visibleindex = visibleindex++;
                column.width = that.indentwidth;
                column.checkboxcolumn = true;
                column.editable = false;
                column.columntype = 'checkbox';
                column.groupable = false;
                column.draggable = false;
                column.filterable = false;
                column.resizable = false;
                column.datafield = "_checkboxcolumn";
                _columns.add(column);
            }

            if (this.rowdetails && !this.treeGrid) {
                var column = new jqxDataTableColumn(that, this);
                column.visibleindex = visibleindex++;
                column.width = that.indentwidth;
                column.editable = false;
                column.rowdetailscolumn = true;
                column.groupable = false;
                column.draggable = false;
                column.pinned = true;
                column.filterable = false;
                column.resizable = false;
                _columns.add(column);
            }

            var keys = new Array();
            $.each(this.columns, function (index) {
                if (that.columns[index] != undefined) {
                    var column = new jqxDataTableColumn(that, this);
                    column.visibleindex = visibleindex++;
                    if (this.dataField != undefined) {
                        this.datafield = this.dataField;
                    }
                    if (this.pinned) {
                        that._haspinned = true;
                    }

                    if (this.datafield == null) {
                        if (that.source && that.source._source && (that.source._source.datatype == 'array')) {
                            if (!hasfields) {
                                if (!that.source._source.datafields) {
                                    that.source._source.datafields = new Array();
                                    that.source._source.datafields.push({ name: index.toString() });
                                }
                                else {
                                    that.source._source.datafields.push({ name: index.toString() });
                                }
                            }
                            this.datafield = index.toString();
                            this.displayfield = index.toString();
                            column.datafield = this.datafield;
                            column.displayfield = this.displayfield;

                        }
                    }
                    else {
                        if (keys[this.datafield]) {
                            throw new Error("jqxDataTable: Invalid column 'dataField' setting. jqxDataTable's columns should be initialized with unique data fields.");
                            that.host.remove();
                            return false;
                        }
                        else {
                            keys[this.datafield] = true;
                        }
                    }
                    _columns.add(column);
                }
            });

            if (this.rtl) _columns.records.reverse();
            this.columns = _columns;
        },

        addfilter: function (datafield, filter) {
            this.dataview.addfilter(datafield, filter);
        },

        removefilter: function (datafield) {
            this.dataview.removefilter(datafield);
        },

        clearfilters: function (apply, updateui) {
            this.dataview.filters = new Array();
            this.dataview._filteredData = null;
            this.dataview._sortData = null;
            this.dataview._sortHierarchyData = null;

            if (updateui !== false) {
                this.resetfilter();
            }

            if (apply === false) {
                return;
            }
            this.applyfilters();
        },

        resetfilter: function () {
            if (this.filterinput) {
                this.filterinput.val("");
            }
            if (this.filterrow) {
                for (var i = 0; i < this.filterrow[0].cells.length; i++) {
                    var cell = this.filterrow[0].cells[i];
                    var input = $(cell).find('input:first');
                    var conditionWidget = $(cell).find('.filterconditions');
                    var column = this.columns.records[i];
                    var condition = "";

                    if (!column.filterable) {
                        continue;
                    }

                    input.val("");

                    var columntype = this.getcolumntypebydatafield(column);
                    var filter = new $.jqx.filter();
                    switch (columntype) {
                        case "number":
                        case "int":
                        case "float":
                        case "decimal":
                            filtertype = 'numericfilter';
                            conditions = filter.getoperatorsbyfiltertype('numericfilter');
                            break;
                        case "boolean":
                        case "bool":
                            filtertype = 'booleanfilter';
                            conditions = filter.getoperatorsbyfiltertype('booleanfilter');
                            break;
                        case "date":
                        case "time":
                            filtertype = 'datefilter';
                            conditions = filter.getoperatorsbyfiltertype('datefilter');
                            break;
                        case "string":
                            filtertype = 'stringfilter';
                            conditions = filter.getoperatorsbyfiltertype('stringfilter');
                            break;
                    }

                    if (conditionWidget.length > 0) {
                        if (filtertype === "stringfilter") {
                            conditionWidget.jqxDropDownList({ selectedIndex: 2 });
                        }
                        else {
                            conditionWidget.jqxDropDownList({ selectedIndex: 0 });
                        }
                    }
                }
            }
        },

        applyfilters: function () {
            if (this.editable) {
                if (this.editKey != null) {
                    var result = this.endroweditbykey(this.editKey)
                }
            }

            this.dataview._filteredData = null;
            this.dataview._sortData = null;
            this.dataview._sortHierarchyData = null;
            if (this.serverProcessing) {
                this.dataview.pagenum = 0;
                this.updatebounddata('filter');
            }
            else {
                this.gotopage(0);
                this.refresh();
            }
            if (arguments && arguments.length > 0) {
                if (this._updateSimpleFilter) {
                    if (this.filtercolumnsList) {
                        var filtercolumn = this.filtercolumnsList.jqxDropDownList('getSelectedItem').value;
                        this._updateSimpleFilter(filtercolumn);
                    }
                }
                if (this._updateFilterRow) {
                    this._updateFilterRow();
                }
            }
            this._raiseEvent('filter', { filters: this.dataview.filters });
        },

        sortby: function (datafield, sortdirection) {
            this.dataview._filteredData = null;
            this.dataview._sortData = null;
            this.dataview._sortHierarchyData = null;
            if (this._loading) {
                throw new Error('jqxDataTable: ' + this.loadingerrormessage);
                return false;
            }

            if (this.editable) {
                if (this.editKey != null) {
                    var result = this.endroweditbykey(this.editKey)
                }
            }

            // clear the sorting.
            if (datafield == null) {
                sortdirection = null;
                datafield = this.sortcolumn;
            }

            if (datafield) {
                var that = this;

                if (sortdirection == 'a' || sortdirection == 'asc' || sortdirection == 'ascending' || sortdirection == true) {
                    ascending = true;
                }
                else {
                    ascending = false;
                }

                if (sortdirection != null) {
                    that.sortdirection = { 'ascending': ascending, 'descending': !ascending };
                }
                else {
                    that.sortdirection = { 'ascending': false, 'descending': false };
                }

                if (sortdirection != null) {
                    that.sortcolumn = datafield;
                }
                else {
                    that.sortcolumn = null;
                }

                if (that.source.sort) {
                    that.dataview.sortfield = datafield;
                    if (sortdirection == null) {
                        that.dataview.sortfielddirection = "";
                    }
                    else {
                        that.dataview.sortfielddirection = ascending ? "asc" : "desc";
                    }
                    if (that.source.sort && !this._loading) {
                        that.source.sort(datafield, sortdirection);
                    }
                }

                that.dataview.sortby(datafield, sortdirection);

                that._raiseEvent('sort', { sortcolumn: this.sortcolumn, sortdirection: this.sortdirection });
            }
            if (!this.serverProcessing) {
                this.refresh();
            }
            else {
                this.updatebounddata('sort');
            }
        },

        _togglesort: function (column) {
            var that = this;
            if (this.disabled) {
                return;
            }

            if (column.sortable && that.sortable) {
                var sortinformation = { sortcolumn: this.sortcolumn, sortdirection: this.sortdirection };
                var checked = null;
                if (sortinformation.sortcolumn != null && sortinformation.sortcolumn == column.displayfield) {
                    checked = sortinformation.sortdirection.ascending;
                    if (checked == true) {
                        checked = false;
                    }
                    else {
                        checked = null;
                    }
                }
                else {
                    checked = true;
                }

                that.sortby(column.displayfield, checked);
            }
        },

        _renderfilter: function () {
            var that = this;
            var filterElement =
               $("<div style='position: relative; margin: 4px;'>"
               + "<input role='textbox' type='text'/>"
               + "<div style='cursor: pointer; height: 100%;'><div></div></div>"
               + "</div>");
            filterElement.height(22);

            var input = filterElement.find('input');
            var button = filterElement.find('div:first');
            filterElement.addClass(this.toThemeProperty('jqx-rc-all'));
            filterElement.addClass(this.toThemeProperty('jqx-widget'));
            filterElement.addClass(this.toThemeProperty('jqx-input-group'));
            input.addClass(this.toThemeProperty('jqx-input'));
            input.addClass(this.toThemeProperty('jqx-rc-l'));
            input.addClass(this.toThemeProperty('jqx-input-group-addon'));
            input.addClass(this.toThemeProperty('jqx-widget'));
            input.addClass(this.toThemeProperty('jqx-widget-content'));
            button.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            button.addClass(this.toThemeProperty('jqx-rc-r'));
            button.addClass(this.toThemeProperty('jqx-input-group-addon'));
            button.find('div').addClass(this.toThemeProperty('jqx-icon-search'));

            this.filter.children().remove();
            this.filterbutton = button;

            var columns = new Array();

            for (var i = 0; i < that.columns.records.length; i++) {
                if (that.columns.records[i].datafield && that.columns.records[i].filterable) {
                    columns.push({ label: that.columns.records[i].text, value: that.columns.records[i].displayfield });
                }
            }
            var autoDropDownHeight = columns.length < 10 ? true : false;
            var searchstring = $("<div style='position: relative; top: 50%; display: none; margin-right: 4px; margin-left: 4px; float: left;'>" + this.gridlocalization.filtersearchstring + "</div>");
            this.filter.append(searchstring);
            var columnsList = $("<div class='filtercolumns' style='margin: 4px; float: left;'></div>");
            this.filter.append(columnsList);
            if (columnsList.jqxDropDownList) {
                columnsList.jqxDropDownList({ theme: this.theme, autoDropDownHeight: autoDropDownHeight, rtl: that.rtl, dropDownWidth: 220, selectedIndex: 0, width: 'auto', height: 20, source: columns, displayMember: 'label', valueMember: 'value' });
            }
            this.filtercolumnsList = columnsList;

            var updateSimpleFilter = function (filtercolumn) {
                that.filterinput.val("");
                for (var i = 0; i < that.dataview.filters.length; i++) {
                    var filtergroup = that.dataview.filters[i];
                    if (filtergroup.datafield === filtercolumn) {
                        that.filterinput.val(filtergroup.filter.getfilterat(0).filtervalue);
                    }
                }
            }
            that._updateSimpleFilter = updateSimpleFilter;
            this.addHandler(columnsList, 'select', function (event) {
                var filtercolumn = event.args.item.value;
                updateSimpleFilter(filtercolumn);
            });

            if (this.filtermode === "simple") {
                this.filtercolumnsList.hide();
                searchstring.show();
                searchstring.css('margin-top', -this.filter.height() / 2);
            }
            else {
                this.filtercolumnsList.show();
                searchstring.hide();
            }

            var createSimpleFilter = function () {
                if (!button.hasClass('jqx-fill-state-disabled')) {
                    var filtervalue = input.val();
                    if (columnsList.jqxDropDownList) {
                        var item = columnsList.jqxDropDownList('getSelectedItem');
                    }
                    var buildFilterGroup = function (column, filtervalue, operator) {
                        var filtergroup = new $.jqx.filter();
                        var type = that.getcolumntypebydatafield(column);
                        var filtertype = that._getfiltertype(type);
                        if (filtertype == "datefilter") {
                            var filter = filtergroup.createfilter(filtertype, filtervalue, "EQUAL", null, column.cellsformat, that.gridlocalization);
                        }
                        else if (filtertype == "numericfilter" || filtertype == "booleanfilter") {
                            if (filtertype == "numericfilter") {
                                if (that.gridlocalization.decimalseparator == ',') {
                                    if (filtervalue.indexOf(that.gridlocalization.decimalseparator) >= 0) {
                                        filtervalue = filtervalue.replace(that.gridlocalization.decimalseparator, '.');
                                    }
                                }
                                if (filtervalue.indexOf(that.gridlocalization.currencysymbol) >= 0) {
                                    filtervalue = filtervalue.replace(that.gridlocalization.currencysymbol, '');
                                }
                                if (filtervalue.indexOf(that.gridlocalization.percentagesymbol) >= 0) {
                                    filtervalue = filtervalue.replace(that.gridlocalization.percentagesymbol, '');
                                }
                            }
                            var filter = filtergroup.createfilter(filtertype, filtervalue, "EQUAL", null, column.cellsformat, that.gridlocalization);
                        }
                        else {
                            var filter = filtergroup.createfilter(filtertype, filtervalue, "CONTAINS");
                        }
                        filtergroup.operator = operator;
                        filtergroup.addfilter(0, filter);
                        return filtergroup;
                    }

                    if (that.filtermode !== "simple") {
                        if (item) {
                            var field = item.value;
                            var column = that.getcolumn(field);
                            var filtergroup = buildFilterGroup(column, filtervalue, "and");
                            if (filtervalue.length > 0) {
                                that.removefilter(field);
                                that.addfilter(field, filtergroup);
                                that.applyfilters();
                            }
                            else {
                                that.removefilter(field);
                                that.applyfilters();
                            }
                            if (that.filtermode === "advanced") {
                                if (that._updateFilterRow) {
                                    that._updateFilterRow(true);
                                }
                            }
                        }
                    }
                    else {
                        that.clearfilters(false, false);
                        if (filtervalue.length > 0) {
                            for (var i = 0; i < that.columns.records.length; i++) {
                                var column = that.columns.records[i];
                                var filtergroup = buildFilterGroup(column, filtervalue, "or");
                                that.addfilter(column.datafield, filtergroup);
                            }
                        }
                        that.applyfilters();
                    }
                    if (that.dataview.filters.length == 0) {
                        that.filtericon.fadeOut(200);
                    }
                    else {
                        that.filtericon.fadeIn(200);
                    }
                }
            }

            input.keydown(function (event) {
                if (event.keyCode === 13) {
                    createSimpleFilter();
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    return false;
                }
            });

            button.click(function () {
                createSimpleFilter();
            });

            this.filterinput = input;
            this.filter.append(filterElement);

            if (this.filtermode == "advanced") {
                var anchor = $("<a style='float: left; position: relative; margin: 2px; margin-left: 10px;' href='#'>" + this.gridlocalization.filterstring + "</a>");
                filterElement.append(anchor);
                this.addHandler(anchor, 'click', function (event) {
                    var updateFilterRow = function (fullUpdate) {
                        if (that.filterrow) {
                            for (var i = 0; i < that.filterrow[0].cells.length; i++) {
                                var cell = that.filterrow[0].cells[i];
                                var input = $(cell).find('input:first');
                                var column = that.columns.records[i];

                                if (!column.filterable) {
                                    continue;
                                }

                                if (fullUpdate === true) {
                                    input.val("");
                                }

                                for (var j = 0; j < that.dataview.filters.length; j++) {
                                    var filtergroup = that.dataview.filters[j];
                                    if (filtergroup.datafield === column.displayfield) {
                                        input.val(filtergroup.filter.getfilterat(0).filtervalue);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    that._updateFilterRow = updateFilterRow;
                    var disableSimpleFilter = function () {
                        that.filtercolumnsList.jqxDropDownList({ disabled: true });
                        that.filterinput.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                        that.filterinput.attr('disabled', true);
                        that.filterbutton.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                    }

                    if (that.filter.find('.filterrow').length === 0) {
                        that._renderadvancedfilter();
                        disableSimpleFilter();
                        updateFilterRow();
                        that._arrange();
                    }
                    else {
                        if (that.filter.find('.filterrow').css('display') === "none") {
                            disableSimpleFilter();
                            that.filter.find('.filterrow').removeClass('filterrow-hidden');
                            updateFilterRow();
                            that.filter.find('.filterrow').show();
                        }
                        else {
                            that.filtercolumnsList.jqxDropDownList({ disabled: false });
                            that.filterinput.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                            that.filterinput.attr('disabled', false);
                            that.filterbutton.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                            updateSimpleFilter(that.filtercolumnsList.jqxDropDownList('getSelectedItem').value);
                            that.filter.find('.filterrow').addClass('filterrow-hidden');
                            that.filter.find('.filterrow').hide();
                        }

                        that._arrange();
                    }
                    return false;
                });
            }
            var icon = $("<div style='float: left; width: 16px; height: 16px; position: relative; margin: 3px;'></div>");
            icon.attr('title', that.gridlocalization.filterclearstring);
            icon.addClass(that.toThemeProperty('jqx-icon-close'));
            filterElement.append(icon);
            icon.hide();
            that.filtericon = icon;
            icon.click(function () {
                that.clearfilters();
                that.filtericon.fadeOut(200);
            });
        },

        _renderadvancedfilter: function () {
            var that = this;

            var applyFilters = function () {
                that.clearfilters(false, false);
                var filtercolumn = that.filtercolumnsList.jqxDropDownList('getSelectedItem').value;
                var filtercolumnvalue = that.filterinput.val();
                for (var i = 0; i < that.filterrow[0].cells.length; i++) {
                    var cell = that.filterrow[0].cells[i];
                    var input = $(cell).find('input:first');
                    var conditionWidget = $(cell).find('.filterconditions');
                    var column = that.columns.records[i];
                    var condition = "";

                    if (!column.filterable) {
                        continue;
                    }

                    if (column.displayfield === filtercolumn) {
                        that.filterinput.val(input.val());
                    }

                    var columntype = that.getcolumntypebydatafield(column);
                    var filter = new $.jqx.filter();
                    switch (columntype) {
                        case "number":
                        case "int":
                        case "float":
                        case "decimal":
                            filtertype = 'numericfilter';
                            conditions = filter.getoperatorsbyfiltertype('numericfilter');
                            break;
                        case "boolean":
                        case "bool":
                            filtertype = 'booleanfilter';
                            conditions = filter.getoperatorsbyfiltertype('booleanfilter');
                            break;
                        case "date":
                        case "time":
                            filtertype = 'datefilter';
                            conditions = filter.getoperatorsbyfiltertype('datefilter');
                            break;
                        case "string":
                            filtertype = 'stringfilter';
                            conditions = filter.getoperatorsbyfiltertype('stringfilter');
                            break;
                    }

                    if (conditionWidget.length == 0) {
                        if (filtertype === "stringfilter") {
                            condition = conditions[2];
                        }
                        else {
                            condition = conditions[0];
                        }
                    }
                    else {
                        var item = conditionWidget.jqxDropDownList('getSelectedItem');
                        if (item) {
                            condition = conditions[item.index];
                        }
                        else {
                            if (filtertype === "stringfilter") {
                                condition = conditions[2];
                            }
                            else {
                                condition = conditions[0];
                            }
                        }
                    }

                    var filtervalue = input.val();
                    if (filtervalue.length > 0) {
                        var field = column.displayfield;
                        var filtergroup = new $.jqx.filter();
                        if (filtertype == "numericfilter") {
                            if (that.gridlocalization.decimalseparator == ',') {
                                if (filtervalue.indexOf(that.gridlocalization.decimalseparator) >= 0) {
                                    filtervalue = filtervalue.replace(that.gridlocalization.decimalseparator, '.');
                                }
                            }
                            if (filtervalue.indexOf(that.gridlocalization.currencysymbol) >= 0) {
                                filtervalue = filtervalue.replace(that.gridlocalization.currencysymbol, '');
                            }
                            if (filtervalue.indexOf(that.gridlocalization.percentagesymbol) >= 0) {
                                filtervalue = filtervalue.replace(that.gridlocalization.percentagesymbol, '');
                            }
                        }
                        var filter = filtergroup.createfilter(filtertype, filtervalue, condition, null, column.cellsformat, that.gridlocalization);
                        filtergroup.addfilter(0, filter);

                        if (filtervalue.length > 0) {
                            that.addfilter(field, filtergroup);
                        }
                    }
                }
                if (that.dataview.filters.length > 0) {
                    that.applyfilters();
                }
                else {
                    that.clearfilters();
                }

                if (that.dataview.filters.length == 0) {
                    that.filtericon.fadeOut(200);
                }
                else {
                    that.filtericon.fadeIn(200);
                }
            }

            var addRow = function () {
                var row = $("<div style='position: relative;' class='filterrow'></div>").appendTo(that.filter);
                that.filterrow = row;
                row[0].cells = new Array();

                row.height(24);
                row.width(that.table.width());
                var initialLeft = 0;

                var filtercolumn = that.filtercolumnsList.jqxDropDownList('getSelectedItem').value;
                var filtercolumnvalue = that.filterinput.val();

                $.each(that.columns.records, function () {
                    var column = this;
                    var cell = $("<div></div>").appendTo(row);
                    cell.css('position', 'absolute');
                    cell.css('left', column.uielement[0].style.left);

                    if (column.pinned) {
                        cell.css('z-index', that.tableZIndex + that.columns.records.length);
                        cell.addClass(that.toThemeProperty('jqx-widget-header'));
                    }

                    row[0].cells.push(cell[0]);
                    if (!this.filterable) {
                        return true;
                    }

                    var input = $("<input style='margin-left: 4px; height: 20px; float: left;' role='textbox' type='text'/>").appendTo(cell);

                    input.keydown(function (event) {
                        if (event.keyCode === 13) {
                            applyFilters();
                        }
                    });

                    if (column.displayfield === filtercolumn) {
                        input.val(filtercolumnvalue);
                    }

                    input.addClass(that.toThemeProperty('jqx-input'));
                    input.addClass(that.toThemeProperty('jqx-rc-all'));
                    input.addClass(that.toThemeProperty('jqx-widget'));
                    input.addClass(that.toThemeProperty('jqx-widget-content'));
                    var filtericon = $("<div style='cursor: pointer; margin-left: 4px; margin-bottom: 4px; margin-top: 6px; width: 18px; position: relative; margin-top: 4px; float: left;'></div>").appendTo(cell);
                    filtericon.append($("<div style='width: 16px; height: 16px;' class='" + that.toThemeProperty('jqx-grid-column-filterbutton') + "'></div>"));
                    input.focus(function () {
                        that.ensurecolumnvisible(column.displayfield);
                        that.filter[0].scrollLeft = 0;
                        that.ensurecolumnvisible(column.displayfield);
                        setTimeout(function () {
                            that.filter[0].scrollLeft = 0;
                            that.ensurecolumnvisible(column.displayfield);
                        }, 10);
                    });

                    filtericon.click(function () {
                        var conditionsList = $("<div class='filterconditions' style='position: relative; margin-top: 1px; float: left;'></div>");
                        conditionsList.insertAfter(filtericon);
                        filtericon.remove();
                        var columntype = that.getcolumntypebydatafield(column);
                        var filtertype = that._getfiltersbytype(columntype);
                        if (columntype === "string") {
                            index = 2;
                        }
                        else index = 0;

                        conditionsList.jqxDropDownList({
                            theme: that.theme, enableBrowserBoundsDetection: true,
                            renderMode: 'simple', arrowSize: 0, selectedIndex: index, rtl: that.rtl, dropDownWidth: 230, dropDownHeight: 180, width: 20, height: 20, source: filtertype,
                            selectionRenderer: function () {
                                return "<div style='width: 16px; height: 16px;' class='" + that.toThemeProperty('jqx-grid-column-filterbutton') + "'></div>";
                            }
                        });
                        that.addHandler(conditionsList, 'close', function (event) {
                            input.focus();
                            setTimeout(function () {
                                input.focus();
                            }, 10);
                        });

                        conditionsList.removeAttr('tabindex');
                        conditionsList.find('div').removeAttr('tabindex');
                        conditionsList.jqxDropDownList('open');
                    });
                    input[0].style.width = column.width - 6 - 22 + 'px';
                });

                $("<div style='clear: both;'></div>").appendTo(row);
            }
            addRow();

            var row = $("<div class='filterrow'></div>").appendTo(that.filter);
            var apply = $("<input type='button' style='float: left; margin-top: 4px; margin-left: 4px;' value='" + that.gridlocalization.filterapplystring + "'/>").appendTo(row);
            var cancel = $("<input type='button' style='float: left; margin-top: 4px;  margin-left: 4px;' value='" + that.gridlocalization.filtercancelstring + "'/>").appendTo(row);
            apply.jqxButton({ theme: that.theme });
            cancel.jqxButton({ theme: that.theme });
            cancel.click(function () {
                that.filtercolumnsList.jqxDropDownList({ disabled: false });
                that.filterinput.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                that.filterinput.attr('disabled', false);
                that.filterbutton.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));

                that.filter.find('.filterrow').addClass('filterrow-hidden');
                that.filter.find('.filterrow').hide();
                that._arrange();
            });

            apply.click(function () {
                applyFilters();
            });
            that._renderhorizontalscroll();
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

        getcolumntypebydatafield: function (column) {
            var that = this;
            var type = 'string';
            var datafields = that.source.datafields || ((that.source._source) ? that.source._source.datafields : null);

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
            return type;
        },

        _getfiltersbytype: function (type) {
            var that = this;
            var source = '';
            switch (type) {
                case "number":
                case "float":
                case "int":
                    source = that.gridlocalization.filternumericcomparisonoperators;
                    break;
                case "date":
                    source = that.gridlocalization.filterdatecomparisonoperators;
                    break;
                case "boolean":
                case "bool":
                    source = that.gridlocalization.filterbooleancomparisonoperators;
                    break;
                case "string":
                default:
                    source = that.gridlocalization.filterstringcomparisonoperators;
                    break;

            }
            return source;
        },

        _getcellvalue: function (column, row) {
            var value = null;
            value = row[column.datafield];
            if (column.displayfield != null) {
                value = row[column.displayfield];
            }

            if (value == null) value = "";
            return value;
        },

        _renderrows: function () {
            if (this.editable) {
                if (this.editKey != null) {
                    var result = this.endroweditbykey(this.editKey)
                }
            }

            if (this.treeGrid) {
                this.treeGrid._renderrows();
                return;
            }

            if (this._loading)
                return;

            if (this._updating) {
                return;
            }

            if (this.rendering) {
                this.rendering();
            }
            var that = this;
            var tablewidth = 0;
            this.table[0].rows = new Array();
            var cellclass = this.toTP('jqx-cell') + " " + this.toTP('jqx-widget-content');
            if (this.rtl) {
                cellclass += " " + this.toTP('jqx-cell-rtl')
            }

            var columnslength = this.columns.records.length;

            var isIE7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
            if (isIE7) {
                this.host.attr("hideFocus", "true");
            }

            var grouping = that.groups.length;
            var records = new Array();
            var filterRecords = this.source.records;
            filterRecords = this.dataview.evaluate(filterRecords);
            this.dataViewRecords = filterRecords;
            if (this.dataview.pagesize == "all" || !this.pageable || this.serverProcessing) {
                var rowsOnPage = filterRecords;
                if (this.pageable && this.serverProcessing && filterRecords.length > this.dataview.pagesize) {
                    var rowsOnPage = filterRecords.slice(this.dataview.pagesize * this.dataview.pagenum, this.dataview.pagesize * this.dataview.pagenum + this.dataview.pagesize);
                }
            }
            else {
                var rowsOnPage = filterRecords.slice(this.dataview.pagesize * this.dataview.pagenum, this.dataview.pagesize * this.dataview.pagenum + this.dataview.pagesize);
            }

            if (that.groups && that.groups.length > 0) {
                var startID = this.pageable ? this.dataview.pagesize * this.dataview.pagenum : 0;
                var hierarchy = that.source.getGroupedRecords(that.groups, 'records', 'label', null, 'data', null, 'parent', rowsOnPage, startID);
                var getRecords = function (records, filtered) {
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        filtered.push(record);
                        if (record.records && record.records.length > 0) {
                            var data = getRecords(record.records, new Array());
                            for (var t = 0; t < data.length; t++) {
                                if (data[t].leaf) {
                                    filtered.push(data[t]);
                                }
                                else {
                                    filtered.push(data[t]);
                                }
                            }
                        }
                    }
                    return filtered;
                };
                var records = getRecords.call(that, hierarchy, new Array());
                rowsOnPage = records;

                // update row keys.
                this.rowsByKey = new Array();
                for (var i = 0; i < rowsOnPage.length; i++) {
                    var row = rowsOnPage[i];
                    this.rowsByKey[row.uid] = row;                   
                }
            }


            var records = rowsOnPage;

            this.renderedRecords = records;
            var pagesize = records.length;
            var zindex = this.tableZIndex;

            var widthOffset = 0;
            var emptyWidth = 0;
            if (isIE7) {
                for (var j = 0; j < columnslength; j++) {
                    var columnrecord = this.columns.records[j];
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

            var rtlTableClassName = this.rtl ? " " + this.toTP('jqx-grid-table-rtl') : "";
            var tableHTML = "<table cellspacing='0' cellpadding='0' class='" + this.toTP('jqx-grid-table') + rtlTableClassName + "' id='table" + this.element.id + "'><colgroup>";
            var pinnedTableHTML = "<table cellspacing='0' cellpadding='0' class='" + this.toTP('jqx-grid-table') + rtlTableClassName + "' id='pinnedtable" + this.element.id + "'><colgroup>";
            var firstIndex = 0;
            var nonHiddenColumns = columnslength;
            for (var j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                if (columnrecord.hidden) {
                    firstIndex++;
                    nonHiddenColumns--;
                    continue;
                }
                var width = columnrecord.width;
                if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;
                width -= widthOffset;
                if (width < 0) {
                    width = 0;
                }

                if (isIE7) {
                    var w = width;
                    if (j == firstIndex) w++;
                    if (columnrecord.rowdetailscolumn) {
                        var w = w + 4;
                        pinnedTableHTML += "<col style='max-width: " + w + "px; width: " + w + "px;'>";
                        tableHTML += "<col style='max-width: " + w + "px; width: " + w + "px;'>";
                    }
                    else {
                        pinnedTableHTML += "<col style='max-width: " + w + "px; width: " + w + "px;'>";
                        tableHTML += "<col style='max-width: " + w + "px; width: " + w + "px;'>";
                    }
                }
                else {
                    pinnedTableHTML += "<col style='max-width: " + width + "px; width: " + width + "px;'>";
                    tableHTML += "<col style='max-width: " + width + "px; width: " + width + "px;'>";
                }
                emptyWidth += width;
            }
            tableHTML += "</colgroup>";
            pinnedTableHTML += "</colgroup>";

            this._hiddencolumns = false;
            var pinnedColumns = false;

            if (this.rowdetails && this._pinnedTable) {
                this._pinnedTable.find("[data-role=details]").detach();
                this._table.find("[data-role=details]").detach();
            }

            if (pagesize === 0) {
                var tablerow = '<tr role="row">';
                var height = this.host.height();
                if (this.pageable) {
                    height -= this.pagerheight;
                    if (this.pagerposition === "both") {
                        height -= this.pagerheight;
                    }
                }
                height -= this.columnsheight;
                if (this.filterable) {
                    var filterconditions = this.filter.find('.filterrow');
                    var filterconditionshidden = this.filter.find('.filterrow-hidden');
                    var filterrow = 1;
                    if (filterconditionshidden.length > 0) {
                        filterrow = 0;
                    }
                    height -= this.filterheight + this.filterheight * filterconditions.length * filterrow;
                }
                if (this.showstatusbar) {
                    height -= this.statusbarheight;
                }
                if (this.showaggregates) {
                    height -= this.aggregatesheight;
                }

                if (height < 25) {
                    height = 25;
                }
                if (this.hScrollBar[0].style.visibility != "hidden") {
                    height -= this.hScrollBar.outerHeight();
                }

                if (this.height === "auto" || this.height === null || this.autoheight) {
                    height = 300;
                }

                var tablecolumn = '<td colspan="' + this.columns.records.length + '" role="gridcell" style="border: none; min-height: ' + height + 'px; height: ' + height + 'px; max-width:' + emptyWidth + 'px; width:' + emptyWidth + 'px;';
                var cellclass = this.toTP('jqx-cell') + " " + this.toTP('jqx-grid-cell') + " " + this.toTP('jqx-item');
                cellclass += ' ' + this.toTP('jqx-center-align');
                tablecolumn += '" class="' + cellclass + '">';
                tablecolumn += this.gridlocalization.emptydatastring;
                tablecolumn += '</td>';
                tablerow += tablecolumn;
                tableHTML += tablerow;
                pinnedTableHTML += tablerow;
                this.table[0].style.width = emptyWidth + 2 + 'px';
                tablewidth = emptyWidth;
            }
            var tableRows = this.getRows();

            for (var i = 0; i < records.length; i++) {
                var row = records[i];
                var key = row.uid;
                if (undefined === row.uid) {
                    row.uid = this.dataview.generatekey();
                }

                var tablerow = '<tr data-key="' + key + '" role="row" id="row' + i + this.element.id + '">';
                var pinnedtablerow = '<tr data-key="' + key + '" role="row" id="row' + i + this.element.id + '">';

                if (grouping > 0) {
                    if (row.level < grouping) {
                        var tablerow = '<tr data-role="row-group" data-key="' + key + '" role="row" id="row' + i + this.element.id + '">';
                        var pinnedtablerow = '<tr data-role="row-group" data-key="' + key + '" role="row" id="row' + i + this.element.id + '">';
                    }
                }

                var left = 0;
                var start = 0;
                for (var j = 0; j < columnslength; j++) {
                    var column = this.columns.records[j];
    
                    if (column.pinned || (this.rtl && this.columns.records[columnslength - 1].pinned)) {
                        pinnedColumns = true;
                    }

                    var width = column.width;
                    if (width < column.minwidth) width = column.minwidth;
                    if (width > column.maxwidth) width = column.maxwidth;
                    width -= widthOffset;

                    if (width < 0) {
                        width = 0;
                    }

                    var cellclass = this.toTP('jqx-cell') + " " + this.toTP('jqx-grid-cell') + " " + this.toTP('jqx-item');
                    if (column.pinned) {
                        cellclass += ' ' + this.toTP('jqx-grid-cell-pinned');
                    }
                    if (this.sortcolumn === column.displayfield) {
                        cellclass += ' ' + this.toTP('jqx-grid-cell-sort');
                    }
                    if (this.altrows && i % 2 != 0) {
                        cellclass += ' ' + this.toTP('jqx-grid-cell-alt');
                    }
                    if (this.rtl) {
                        cellclass += ' ' + this.toTP('jqx-cell-rtl');
                    }

                    var colspan = "";
                    if (grouping > 0) {
                        if (row.level < grouping) {
                            if (!isIE7) {
                                cellclass += ' ' + this.toTP('jqx-grid-cell-pinned');
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
                                    if (!c.hidden) {
                                        w += columnWidth;
                                    }
                                }
                                width = w;
                            }
                            else {
                                cellclass += ' ' + this.toTP('jqx-grid-cell-pinned');
                            }
                        }
                    }

                    var tablecolumn = '<td role="gridcell" ' + colspan + ' style="max-width:' + width + 'px; width:' + width + 'px;';
                    var pinnedcolumn = '<td role="gridcell" ' + colspan + ' style="pointer-events: none; visibility: hidden; border-color: transparent; max-width:' + width + 'px; width:' + width + 'px;';
                    if (j == columnslength - 1 && columnslength == 1) {
                        tablecolumn += 'border-right-color: transparent;'
                        pinnedcolumn += 'border-right-color: transparent;'
                    }

                    var groupRow = false;
                    if (grouping > 0) {
                        if (row.level < grouping) {
                            groupRow = true;
                        }
                    }

                    if (!groupRow) {
                        if (column.cellsalign != "left") {
                            if (column.cellsalign === "right") {
                                cellclass += ' ' + this.toTP('jqx-right-align');
                            }
                            else {
                                cellclass += ' ' + this.toTP('jqx-center-align');
                            }
                        }
                    }
                    else if (this.rtl) {
                        cellclass += ' ' + this.toTP('jqx-right-align');
                    }

                    if (this.rowinfo[row.uid]) {
                        if (this.rowinfo[row.uid].selected && !column.rowdetailscolumn) {
                            if (this.editKey !== row.uid) {
                                if (this.selectionmode !== "none") {
                                    cellclass += ' ' + this.toTP('jqx-grid-cell-selected');
                                    cellclass += ' ' + this.toTP('jqx-fill-state-pressed');
                                }
                            }
                        }
                        if (this.rowinfo[row.uid].locked) {
                            cellclass += ' ' + this.toTP('jqx-grid-cell-locked');
                        }
                    }

                    if (!(column.hidden)) {
                        left += widthOffset + width;
                        if (start == 0) {
                            tablecolumn += 'border-left-width: 0px;'
                            pinnedcolumn += 'border-left-width: 0px;'
                        }
                        start++;
                    }
                    else if (!groupRow) {
                        tablecolumn += 'display: none;'
                        pinnedcolumn += 'display: none;'
                        this._hiddencolumns = true;
                    }

                    if (grouping > 0 && isIE7 && groupRow && j >= grouping) {
                        tablecolumn += 'font-size: 1px; border-color: transparent;  color: transparent;'
                        pinnedcolumn += 'font-size: 1px; border-color: transparent; color: transparent;'
                    }

                    if (column.pinned) {
                        tablecolumn += 'pointer-events: auto;'
                        pinnedcolumn += 'pointer-events: auto;'
                    }
           
                    if (!groupRow && column.rowdetailscolumn) {
                        if (this.rowinfo[row.uid]) {
                            if (!this.rowinfo[row.uid].nodetails) {
                                if (this.rowinfo[row.uid].expanded) {
                                    if (!this.rtl) {
                                        cellclass += ' ' + this.toTP('jqx-grid-group-expand');
                                    }
                                    else {
                                        cellclass += ' ' + this.toTP('jqx-grid-group-expand-rtl');
                                    }
                                    cellclass += ' ' + this.toTP('jqx-icon-arrow-down');
                                }
                                else {
                                    if (!this.rtl) {
                                        cellclass += ' ' + this.toTP('jqx-grid-group-collapse');
                                        cellclass += ' ' + this.toTP('jqx-icon-arrow-right');
                                    }
                                    else {
                                        cellclass += ' ' + this.toTP('jqx-grid-group-collapse-rtl');
                                        cellclass += ' ' + this.toTP('jqx-icon-arrow-left');
                                    }
                                }
                            }
                        }
                        else {
                            if (!this.rtl) {
                                cellclass += ' ' + this.toTP('jqx-grid-group-collapse');
                                cellclass += ' ' + this.toTP('jqx-icon-arrow-right');
                            }
                            else {
                                cellclass += ' ' + this.toTP('jqx-grid-group-collapse-rtl');
                                cellclass += ' ' + this.toTP('jqx-icon-arrow-left');
                            }
                        }
                    }

                    if (!this.autorowheight) {
                        cellclass += ' ' + this.toTP('jqx-grid-cell-nowrap ');
                    }

                    var cellvalue = that._getcellvalue(column, row);
                    if (grouping > 0) {
                        if (row.level < grouping) {
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

                    if (!groupRow) {
                        if (column.cellclassname != '' && column.cellclassname) {
                            if (typeof column.cellclassname == "string") {
                                cellclass += ' ' + column.cellclassname;
                            }
                            else {
                                var customclassname = column.cellclassname(i, column.datafield, cellvalue, row);
                                if (customclassname) {
                                    cellclass += ' ' + customclassname;
                                }
                            }
                        }

                        if (column.cellsrenderer != '' && column.cellsrenderer) {
                            var rowIndex = tableRows.indexOf(row);
                            cellvalue = column.cellsrenderer(rowIndex, column.datafield, cellvalue, row);
                        }
                    }
                    else {
                        if (this.groupsrenderer) {
                            cellvalue = this.groupsrenderer(cellvalue, row, row.level);
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
                        if (row.level < grouping) {
                            break;
                        }
                    }
                }

                if (tablewidth == 0) {
                    this.table[0].style.width = left + 2 + 'px';
                    tablewidth = left;
                }

                tablerow += '</tr>';
                pinnedtablerow += '</tr>';

                tableHTML += tablerow;
                pinnedTableHTML += pinnedtablerow;
                if (!this.rowinfo[row.uid]) {
                    this.rowinfo[row.uid] = { group: groupRow, row: row, details: null, detailsHeight: 200, initialized: false, expanded: false };
                }

                if (this.rowdetails) {
                    var detailsHeight = this.rowinfo[row.uid].detailsHeight;
                    if (this.rowinfo[row.uid]) {
                        if (this.rowinfo[row.uid].expanded) {
                            var details = '<tr data-role="row-details"><td valign="top" style="pointer-events: auto; overflow: hidden; min-height: ' + detailsHeight + 'px; max-height: ' + detailsHeight + 'px; height: ' + detailsHeight + 'px; overflow: hidden; border-left: none; border-right: none;" colspan="' + this.columns.records.length + '" role="gridcell"';
                        }
                        else {
                            var details = '<tr data-role="row-details" style="display: none;"><td valign="top" style="pointer-events: auto; overflow: hidden; min-height: ' + detailsHeight + 'px; max-height: ' + detailsHeight + 'px; height: ' + detailsHeight + 'px; overflow: hidden; border-left: none; border-right: none;" colspan="' + this.columns.records.length + '" role="gridcell"';
                        }
                    }
                    else {
                        var details = '<tr data-role="row-details" style="display: none;"><td valign="top" style="pointer-events: auto; overflow: hidden; min-height: ' + detailsHeight + 'px; max-height: ' + detailsHeight + 'px; height: ' + detailsHeight + 'px; overflow: hidden; border-left: none; border-right: none;" colspan="' + this.columns.records.length + '" role="gridcell"';
                    }
                    var cellclass = this.toTP('jqx-cell') + " " + this.toTP('jqx-grid-cell') + " " + this.toTP('jqx-item');
                    cellclass += ' ' + this.toTP('jqx-details');
                    cellclass += ' ' + this.toTP('jqx-reset');
                    details += '" class="' + cellclass + '"><div style="pointer-events: auto; overflow: hidden; min-height: ' + detailsHeight + 'px; max-height: ' + detailsHeight + 'px; height: ' + detailsHeight + 'px;"><div data-role="details"></div></div></td></tr>';
                    tableHTML += details;
                    pinnedTableHTML += details;
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

                var t2 = this.table.find("#table" + this.element.id);
                var t1 = this.table.find("#pinnedtable" + this.element.id);

                t1.css('float', "left");
                t1.css('pointer-events', 'none');
                t2.css('float', "left");
                t1[0].style.position = "absolute";
                t2[0].style.position = "relative";
                t2[0].style.zIndex = zindex - 10;
                t1[0].style.zIndex = zindex + 10;
                this._table = t2;
                this._table[0].style.left = "0px";
                this._pinnedTable = t1;
                this._pinnedTable[0].style.left = "0px";
                this._pinnedTable[0].style.width = tablewidth + 'px';
                this._table[0].style.width = tablewidth + 'px';
                if (this.rtl) {
                    if (tablewidth > parseInt(this.element.style.width) && this._haspinned) {
                        this._pinnedTable[0].style.left = 3 - tablewidth + parseInt(this.element.style.width) + 'px';
                    }
                }
                //  
                if (this.rowdetails) {
                    for (var i = 0; i < pagesize; i++) {
                        var row = records[i];
                        var key = row.uid;
                        if (this.rowinfo[key].details) {
                            var uirow = $(this._table.children()[1]).children(("[data-key=" + key + "]"));
                            var pinneduirow = $(this._pinnedTable.children()[1]).children(("[data-key=" + key + "]"));
                            if (uirow) {
                                var rowdetails = pinneduirow.next();
                                var children = $($(rowdetails).children().children());
                                children.children().detach();
                                children.append(this.rowinfo[row.uid].details);
                            }
                        }
                    }
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
                var t = this.table.find("#table" + this.element.id);
                this._table = t;
                if ($.jqx.browser.msie && $.jqx.browser.version < 10) {
                    this._table[0].style.width = tablewidth + 'px';
                }
                if (pagesize === 0) {
                    this._table[0].style.width = (2 + tablewidth) + 'px';
                }
            }
            if (this.rendered) {
                this.rendered();
            }
        },

        getcolumnindex: function(datafield)
        {
            var column = this.getcolumn(datafield);
            var columnindex = this.columns.records.indexOf(column);
            return columnindex;
        },

        setcolumnindex: function (datafield, index, refresh) {
            var column = this.getcolumn(datafield);
            if (column.pinned) return;
            if (column.hidden) return;
            if (column.checkboxcolumn) return;
            if (column.grouped) return;

            var columnindex = this.columns.records.indexOf(column);
            this.columns.records.splice(columnindex, 1);
            this.columns.records.splice(index, 0, column);

            var left = 0;
            var zindex = this.headerZIndex;
            this.columnsrow.children().detach();

            var cellclass = this.toThemeProperty('jqx-grid-cell');
            cellclass += ' ' + this.toThemeProperty('jqx-grid-cell-pinned');
            cellclass += ' ' + this.toThemeProperty('jqx-item');
            if (this.filterrow) {
                $(this.filterrow.children()[0]).children().detach();
                this.filterrow[0].cells = [];
            }

            var self = this;
            var tablerow = null;
            if (self.filterrow != undefined) {
                var tablerow = $(self.filterrow.children()[0]);
            }

            this.columnsrow[0].cells = [];
            var hasHiddenColumns = false;
            $.each(this.columns.records, function (i, value) {
                var column = this.uielement;
                self.columnsrow.append(column);
                if (!self.rtl) {
                    column.css('z-index', zindex--);
                }
                else {
                    column.css('z-index', zindex++);
                }

                var desiredwidth = this.width;
                column.css('left', left);
                self.columnsrow[0].cells[self.columnsrow[0].cells.length] = column[0];

                if (self.filterrow) {
                    var tablecolumn = $('<div style="overflow: hidden; position: absolute; height: 100%;" class="' + cellclass + '"></div>');
                    tablerow.append(tablecolumn);
                    tablecolumn.css('left', left);
                    tablecolumn.css('z-index', zindex + 1);
                    tablecolumn.width(this.width);
                    tablecolumn[0].left = left;
                    tablecolumn.append(this._filterwidget);
                    self.filterrow[0].cells[self.filterrow[0].cells.length] = tablecolumn[0];
                }
                if (this.hidden) {
                    hasHiddenColumns = true;
                }
                if (!(this.hidden && this.hideable)) {
                    left += desiredwidth;
                }
            });

            if (this.groupable) {
                var groupslength = this.groups.length;
                if (groupslength > 0) {
                    if (columnindex - groupslength >= 0) {
                        columnindex -= groupslength;
                        index -= groupslength;
                    }
                }
            }
            if (this.rowdetails) {
                if (columnindex - 1 >= 0) {
                    columnindex --;
                    index --;
                }
            }
            if (this.selectionmode == 'checkbox') {
                if (columnindex - 1 >= 0) {
                    columnindex--;
                    index--;
                }
            }

            var column = this._columns[columnindex];
   
            this._columns.splice(columnindex, 1);
            this._columns.splice(index, 0, column);

            this._raiseEvent('columnReordered', { columntext: column.text, datafield: column.datafield, oldindex: columnindex, newindex: index });
            this.resize();
            this._rendercolumngroups();
        
        },

        _pinnedColumnsLength: function () {
            var pinned = 0;
            $.each(this.columns.records, function () {
                if (this.pinned) pinned++;
                if (this.grouped) pinned++;
            });
            if (this.rowdetails) pinned++;
            if (this.selectionmode == 'checkbox') pinned++;
            return pinned;
        },

        _handlecolumnsreorder: function () {
            var that = this;
            var dropindex = -1;
            var candrop = false;

            if (!that.columnsreorder)
                return;

            var mousemove = 'mousemove.reorder' + this.element.id;
            var mousedown = 'mousedown.reorder' + this.element.id;
            var mouseup = 'mouseup.reorder' + this.element.id;

            var touchdevice = false;
            if (this.isTouchDevice() && this.touchmode !== true) {
                touchdevice = true;
                mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.reorder' + this.element.id;
                mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.reorder' + this.element.id;
                mouseup = $.jqx.mobile.getTouchEventName('touchend') + '.reorder' + this.element.id;
            }

            this.removeHandler($(document), mousemove);
            this.addHandler($(document), mousemove, function (event) {
                if (that.resizing) {
                    return true;
                }

                if (that.reordercolumn != null) {
                    var left = parseInt(event.pageX);
                    var top = parseInt(event.pageY);
                    if (touchdevice) {
                        var touches = that.getTouches(event);
                        var touch = touches[0];
                        if (touch != undefined) {
                            left = parseInt(touch.pageX);
                            top = parseInt(touch.pageY);
                        }
                    }
                    var hostoffset = that.host.coord();
                    var hostleft = parseInt(hostoffset.left);
                    var hosttop = parseInt(hostoffset.top);
                    if (that.dragmousedownoffset == undefined || that.dragmousedownoffset == null) {
                        that.dragmousedownoffset = { left: 0, top: 0 };
                    }

                    var leftposition = parseInt(left) - parseInt(that.dragmousedownoffset.left);
                    var topposition = parseInt(top) - parseInt(that.dragmousedownoffset.top);

                    that.reordercolumn.css({ left: leftposition + 'px', top: topposition + 'px' });
                    candrop = false;
                    if (left >= hostleft && left <= hostleft + that.host.width()) {
                        if (top >= hosttop && top <= hosttop + that.host.height()) {
                            candrop = true;
                        }
                    }

                    dropindex = -1;
                    if (candrop) {
                        that.reordercolumnicon.removeClass(that.toThemeProperty('jqx-grid-dragcancel-icon'));
                        that.reordercolumnicon.addClass(that.toThemeProperty('jqx-grid-drag-icon'));
                        var groupsheaderoffset = that.columnsheader.coord();
                        var groupsheaderbottom = groupsheaderoffset.top + that.columnsheader.height();

                        if (that.columnsdropline != null) {
                            if (top >= groupsheaderoffset.top && top <= groupsheaderbottom) {
                                dropindex = that._handlereordercolumnsdroplines(left);
                            }
                            else {
                                that.columnsdropline.fadeOut('slow');
                            }
                        }
                    }
                    else {
                        if (that.columnsdropline != null) {
                            that.columnsdropline.fadeOut('slow');
                        }

                        that.reordercolumnicon.removeClass(that.toThemeProperty('jqx-grid-drag-icon'));
                        that.reordercolumnicon.addClass(that.toThemeProperty('jqx-grid-dragcancel-icon'));
                    }
                    if (touchdevice) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                }
            });

            this.columnsbounds = new Array();

            this.removeHandler($(document), mousedown);
            this.addHandler($(document), mousedown, function (event) {
                if (that.resizing) {
                    return true;
                }

                that.columnsbounds = new Array();
                var left = that.host.coord().left;
                var top = that.host.coord().top;
                if (that.showtoolbar) top += that.toolbarheight;
                var columnIndex = 0;
                $.each(that.columns.records, function (index) {
                    var column = this;

                    if (column.hidden) {
                        that.columnsbounds[that.columnsbounds.length] = { top: top, column: column, left: left, width: 0, height: 2 + that.rowsheight };
                        return true;
                    }

                    if (columnIndex == 0) {
                        if (!that.rtl) {
                            left = parseInt(that.host.coord().left) - that.hScrollInstance.value;
                        }
                        else {
                            left = parseInt(that.host.coord().left) - that.hScrollInstance.max + that.hScrollInstance.value;
                        }
                    }
                    columnIndex++;
                    var height = 2 + that.columnsheight;
                    if (that.columnshierarchy) {
                        top = $(column.uielement).coord().top;
                        height = $(column.uielement).height();
                    }
                    that.columnsbounds[that.columnsbounds.length] = { top: top, column: column, left: left, width: column.width, height: height };
                    left += column.width;
                });
            });
            this.removeHandler($(document), mouseup);
            this.addHandler($(document), mouseup, function (event) {
                if (that.resizing) {
                    return true;
                }

                that.__drag = false;

                $(document.body).removeClass('jqx-disableselect');
                var left = parseInt(event.pageX);
                var top = parseInt(event.pageY);
                if (touchdevice) {
                    var touches = that.getTouches(event);
                    var touch = touches[0];
                    left = parseInt(touch.pageX);
                    top = parseInt(touch.pageY);
                }
                var hostoffset = that.host.coord();
                var hostleft = parseInt(hostoffset.left);
                var hosttop = parseInt(hostoffset.top);
                if (that.showtoolbar) {
                    hosttop += that.toolbarheight;
                }

                that.columndragstarted = false;
                that.dragmousedown = null;
                if (that.reordercolumn != null) {
                    var datafield = $.data(that.reordercolumn[0], 'reorderrecord');
                    var oldindex = that.columns.records.indexOf(that.getcolumn(datafield));
                    that.reordercolumn.remove();
                    that.reordercolumn = null;
                    var minIndex = 0;
                    //   minIndex += that.rowdetails ? 1 : 0;
                    minIndex += that._pinnedColumnsLength();

                    if (datafield != null) {
                        if (candrop) {
                            if (dropindex != -1) {
                                var index = dropindex.index;
                                if (index >= minIndex) {
                                    var targetcolumn = that.columns.records[index];
                                    if (targetcolumn != undefined) {
                                        var columnindex = that.columns.records.indexOf(that.getcolumn(targetcolumn.datafield));
                                        if (targetcolumn.datafield == null) {
                                            var columnindex = that.columns.records.indexOf(that.getcolumnbytext(targetcolumn.text));
                                        }
                                        if (that.columngroups) {
                                            var target = targetcolumn;
                                            if (oldindex < columnindex) {
                                                if (dropindex.position == 'before') {
                                                    target = that.columns.records[columnindex - 1];
                                                }
                                            }

                                            if (target.columngroup != that.getcolumn(datafield).columngroup) {
                                                if (that.columnsdropline != null) {
                                                    that.columnsdropline.remove();
                                                    that.columnsdropline = null;
                                                }
                                                return;
                                            }
                                        }

                                        if (oldindex < columnindex) {
                                            if (dropindex.position == 'before') {
                                                that.setcolumnindex(datafield, columnindex - 1);
                                            }
                                            else {
                                                that.setcolumnindex(datafield, columnindex);
                                            }
                                        }
                                        else if (oldindex > columnindex) {
                                            that.setcolumnindex(datafield, columnindex);
                                        }
                                    }
                                }
                            }
                        }

                        if (that.columnsdropline != null) {
                            that.columnsdropline.remove();
                            that.columnsdropline = null;
                        }
                    }
                }
            });
        },

        getcolumnbytext: function (text) {
            var column = null;
            if (this.columns.records) {
                $.each(this.columns.records, function () {
                    if (this.text == text) {
                        column = this;
                        return false;
                    }
                });
            }
            return column;
        },

        _handlereordercolumnsdroplines: function (left) {
            var self = this;
            var dropindex = -1;
            var minIndex = self._pinnedColumnsLength();
            var hostleft = parseInt(self.host.coord().left);
            var hostright = hostleft + self.host.width();
            var leftOffset = self.vScrollBar.css('visibility') != 'hidden' ? 19 : 0;
            if (!self.rtl) leftOffset = 0;

            $.each(self.columnsbounds, function (index) {
                if (index >= minIndex) {
                    if (this.width == 0) return true;

                    if (left <= this.left + this.width / 2) {
                        if (left > hostright) {
                            self.columnsdropline.fadeOut();
                            return false;
                        }
                        self.columnsdropline.css('left', leftOffset + parseInt(this.left) + 'px');
                        self.columnsdropline.css('top', parseInt(this.top) + 'px');
                        self.columnsdropline.height(this.height);
                        self.columnsdropline.fadeIn('slow');
                        dropindex = { index: index, position: 'before' }
                        return false;
                    }
                    else if (left >= this.left + this.width / 2) {
                        if (this.left + this.width > hostright) {
                            self.columnsdropline.fadeOut();
                            return false;
                        }

                        self.columnsdropline.css('left', leftOffset + 1 + this.left + this.width);
                        self.columnsdropline.css('top', this.top);
                        self.columnsdropline.height(this.height);
                        self.columnsdropline.fadeIn('slow');
                        dropindex = { index: index, position: 'after' }
                    }
                }
            });

            return dropindex;
        },

        _createreordercolumn: function (column, position, hascolumnsdropline) {
            var that = this;
            var mousemove = position;

            if (that.reordercolumn) that.reordercolumn.remove();
            if (that.columnsdropline) that.columnsdropline.remove();
            that.reordercolumn = $('<div></div>');
            var columnclone = column.clone();
            that.reordercolumn.css('z-index', 999999);
            columnclone.css('border-width', '1px');
            columnclone.css('opacity', '0.4');
            var menubutton = $(columnclone.find('.' + that.toThemeProperty('jqx-grid-column-menubutton')));
            if (menubutton.length > 0) {
                menubutton.css('display', 'none');
            }
            var closebutton = $(columnclone.find('.jqx-icon-close'));
            if (closebutton.length > 0) {
                closebutton.css('display', 'none');
            }

            that.reordercolumnicon = $('<div style="z-index: 9999; position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -7px;"></div>');
            that.reordercolumnicon.addClass(that.toThemeProperty('jqx-grid-drag-icon'));
            that.reordercolumn.css('float', 'left');
            that.reordercolumn.css('position', 'absolute');
            var hostoffset = that.host.coord();
            columnclone.width(column.width() + 16);
            that.reordercolumn.append(columnclone);
            that.reordercolumn.height(column.height());
            that.reordercolumn.width(columnclone.width());
            that.reordercolumn.append(that.reordercolumnicon);
            $(document.body).append(that.reordercolumn);

            columnclone.css('margin-left', 0);
            columnclone.css('left', 0);
            columnclone.css('top', 0);
            that.reordercolumn.css('left', mousemove.left + that.dragmousedown.left);
            that.reordercolumn.css('top', mousemove.top + that.dragmousedown.top);

            if (hascolumnsdropline != undefined && hascolumnsdropline) {
                that.columnsdropline = $('<div style="z-index: 9999; display: none; position: absolute;"></div>');

                that.columnsdropline.width(2);
                that.columnsdropline.addClass(that.toThemeProperty('jqx-grid-group-drag-line'));
                $(document.body).append(that.columnsdropline);
            }
        },

        _handlecolumnsdragreorder: function (record, column) {
            if (this.reordercolumn) this.reordercolumn.remove();
            if (this.columnsdropline) this.columnsdropline.remove();

            this.dragmousedown = null;
            this.dragmousedownoffset = null;
            this.columndragstarted = false;
            this.reordercolumn = null;

            var me = this;
            var mousemove;
            var touchdevice = false;
            if (this.isTouchDevice() && this.touchmode !== true) {
                touchdevice = true;
            }

            var mousedown = 'mousedown.drag';
            var mousemove = 'mousemove.drag';
            if (touchdevice) {
                mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.drag';
                mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.drag';
            }
            else {
                this.addHandler(column, 'dragstart', function (event) {
                    return false;
                });
            }
            this.addHandler(column, mousedown, function (event) {
                if (false == record.draggable) {
                    return true;
                }
                if (me.resizing) {
                    return true;
                }

                me.__drag = true;

                var pagex = event.pageX;
                var pagey = event.pageY;
                if (touchdevice) {
                    var touches = me.getTouches(event);
                    var touch = touches[0];
                    pagex = touch.pageX;
                    pagey = touch.pageY;
                }

                me.dragmousedown = { left: pagex, top: pagey };

                var offsetposition = $(event.target).coord();
                me.dragmousedownoffset = { left: parseInt(pagex) - parseInt(offsetposition.left), top: parseInt(pagey - offsetposition.top) };
                return true;
            });

            this.addHandler(column, mousemove, function (event) {
                if (!record.draggable) return true;
                if (undefined == record.datafield) return true;
                if (record.pinned) return true;
                if (me.resizing) {
                    return true;
                }

                if (me.dragmousedown) {
                    var pagex = event.pageX;
                    var pagey = event.pageY;
                    if (touchdevice) {
                        var touches = me.getTouches(event);
                        var touch = touches[0];
                        if (touch != undefined) {
                            pagex = touch.pageX;
                            pagey = touch.pageY;
                        }
                    }
                    mousemove = { left: pagex, top: pagey };
                    if (!me.columndragstarted && me.reordercolumn == null) {
                        var xoffset = Math.abs(mousemove.left - me.dragmousedown.left);
                        var yoffset = Math.abs(mousemove.top - me.dragmousedown.top);
                        if (xoffset > 3 || yoffset > 3) {
                            me._createreordercolumn(column, mousemove, true);
                            $(document.body).addClass('jqx-disableselect');
                            $.data(me.reordercolumn[0], 'reorderrecord', record.datafield);
                        }
                    }
                }
            });
        },

        _handlecolumnsresize: function () {
            var that = this;
            if (this.columnsresize) {
                var touchdevice = false;
                if (that.isTouchDevice()) {
                    touchdevice = true;
                }
                var mousemove = 'mousemove.resize' + this.element.id;
                var mousedown = 'mousedown.resize' + this.element.id;
                var mouseup = 'mouseup.resize' + this.element.id;
                if (touchdevice) {
                    var mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.resize' + this.element.id;
                    var mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.resize' + this.element.id;
                    var mouseup = $.jqx.mobile.getTouchEventName('touchend') + '.resize' + this.element.id;
                }

                this.removeHandler($(document), mousemove);
                this.addHandler($(document), mousemove, function (event) {
                    if (that.resizablecolumn != null && !that.disabled && that.resizing) {
                        if (that.resizeline != null) {
                            var resizeElement = that.resizablecolumn.columnelement;

                            var hostoffset = that.host.coord();
                            var startleft = parseInt(that.resizestartline.coord().left);

                            var minleft = startleft - that._startcolumnwidth
                            var mincolumnwidth = that.resizablecolumn.column.minwidth;
                            if (mincolumnwidth == 'auto') mincolumnwidth = 0;
                            else mincolumnwidth = parseInt(mincolumnwidth);
                            var maxcolumnwidth = that.resizablecolumn.column.maxwidth;
                            if (maxcolumnwidth == 'auto') maxcolumnwidth = 0;
                            else maxcolumnwidth = parseInt(maxcolumnwidth);
                            var pageX = event.pageX;
                            if (touchdevice) {
                                var touches = $.jqx.mobile.getTouches(event);
                                var touch = touches[0];
                                pageX = touch.pageX;
                            }

                            minleft += mincolumnwidth;

                            var maxleft = maxcolumnwidth > 0 ? startleft + maxcolumnwidth : 0;
                            var canresize = maxcolumnwidth == 0 ? true : that._startcolumnwidth + pageX - startleft < maxcolumnwidth ? true : false;
                            if (that.rtl) {
                                var canresize = true;
                            }

                            if (canresize) {
                                if (!that.rtl) {
                                    if (pageX >= hostoffset.left && pageX >= minleft) {
                                        if (maxleft != 0 && event.pageX < maxleft) {
                                            that.resizeline.css('left', pageX);
                                        }
                                        else if (maxleft == 0) {
                                            that.resizeline.css('left', pageX);
                                        }

                                        if (touchdevice)
                                            return false;
                                    }
                                }
                                else {
                                    if (pageX >= hostoffset.left && pageX <= hostoffset.left + that.host.width()) {
                                        that.resizeline.css('left', pageX);

                                        if (touchdevice)
                                            return false;
                                    }
                                }
                            }
                        }
                    }

                    if (!touchdevice && that.resizablecolumn != null)
                        return false;
                });

                this.removeHandler($(document), mousedown);
                this.addHandler($(document), mousedown, function (event) {
                    if (that.resizablecolumn != null && !that.disabled) {
                        var resizeElement = that.resizablecolumn.columnelement;
                        if (resizeElement.coord().top + resizeElement.height() + 5 < event.pageY) {
                            that.resizablecolumn = null;
                            return;
                        }

                        if (resizeElement.coord().top - 5 > event.pageY) {
                            that.resizablecolumn = null;
                            return;
                        }

                        that._startcolumnwidth = that.resizablecolumn.column.width;
                        that.resizablecolumn.column._width = null;
                        $(document.body).addClass('jqx-disableselect');
                        $(document.body).addClass('jqx-position-reset');
                        that._mouseDownResize = new Date();
                        that.resizing = true;

                        that._resizecolumn = that.resizablecolumn.column;
                        that.resizeline = that.resizeline || $('<div style="position: absolute;"></div>');
                        that.resizestartline = that.resizestartline || $('<div style="position: absolute;"></div>');

                        that.resizebackground = that.resizebackground || $('<div style="position: absolute; left: 0; top: 0; background: #000;"></div>');
                        that.resizebackground.css('opacity', 0.01);
                        that.resizebackground.css('cursor', "col-resize");
                        that.resizeline.css('cursor', 'col-resize');
                        that.resizestartline.css('cursor', 'col-resize');

                        that.resizeline.addClass(that.toThemeProperty('jqx-grid-column-resizeline'));
                        that.resizestartline.addClass(that.toThemeProperty('jqx-grid-column-resizestartline'));

                        $(document.body).append(that.resizeline);
                        $(document.body).append(that.resizestartline);
                        $(document.body).append(that.resizebackground);
                        var resizelineoffset = that.resizablecolumn.columnelement.coord();
                        that.resizebackground.css('left', that.host.coord().left);
                        that.resizebackground.css('top', that.host.coord().top);
                        that.resizebackground.width(that.host.width());
                        that.resizebackground.height(that.host.height());
                        that.resizebackground.css('z-index', 999999999);

                        var positionline = function (resizeline) {
                            if (!that.rtl) {
                                resizeline.css('left', parseInt(resizelineoffset.left) + that._startcolumnwidth);
                            }
                            else {
                                resizeline.css('left', parseInt(resizelineoffset.left));
                            }

                            var groupsheaderheight = 0;
                            var toolbarheight = that.showtoolbar ? that.toolbarheight : 0;
                            groupsheaderheight += toolbarheight;
                            var statusbarheight = that.showstatusbar ? that.statusbarheight : 0;
                            groupsheaderheight += statusbarheight;
                            var aggregatesheight = that.showaggregates ? that.aggregatesheight : 0;
                            groupsheaderheight += aggregatesheight;

                            if (that.pageable && that.pagerposition != 'bottom') {
                                groupsheaderheight += that.pagerheight;
                            }

                            var pagerheight = 0;
                            if (that.pageable && that.pagerposition != 'top') {
                                pagerheight = that.pagerheight;
                            }
                            var scrollbaroffset = that.hScrollBar.css('visibility') == 'visible' ? that.scrollbarsize : 0;

                            resizeline.css('top', parseInt(resizelineoffset.top));
                            resizeline.css('z-index', 9999999999);
                            if (that.columngroups) {
                                resizeline.height(that.host.height() + that.resizablecolumn.columnelement.height() - pagerheight - groupsheaderheight - scrollbaroffset - that.columngroupslevel * that.columnsheight);
                            }
                            else {
                                resizeline.height(that.host.height() - pagerheight - groupsheaderheight - scrollbaroffset);
                            }
                            resizeline.show('fast');
                        }
                        positionline(that.resizeline);
                        positionline(that.resizestartline);
                        that.dragmousedown = null;
                    }
                });

                var doresize = function () {
                    $(document.body).removeClass('jqx-disableselect');
                    $(document.body).removeClass('jqx-position-reset');
                    if (!that.resizing)
                        return;

                    that._mouseUpResize = new Date();
                    var timeout = that._mouseUpResize - that._mouseDownResize;
                    if (timeout < 200) {
                        that.resizing = false;
                        if (that._resizecolumn != null && that.resizeline != null && that.resizeline.css('display') == 'block') {
                            that._resizecolumn = null;
                            that.resizeline.hide();
                            that.resizestartline.hide();
                            that.resizebackground.remove();
                        }
                        return;
                    }

                    that.resizing = false;

                    if (that.disabled)
                        return;

                    var hostwidth = that.host.width();
                    if (that.vScrollBar[0].style.visibility != 'hidden') hostwidth -= 20;
                    if (hostwidth < 0) hostwidth = 0;

                    if (that._resizecolumn != null && that.resizeline != null && that.resizeline.css('display') == 'block') {
                        var resizelineleft = parseInt(that.resizeline.css('left'));
                        var resizestartlineleft = parseInt(that.resizestartline.css('left'));

                        var newwidth = that._startcolumnwidth + resizelineleft - resizestartlineleft;
                        if (that.rtl) {
                            var newwidth = that._startcolumnwidth - resizelineleft + resizestartlineleft;
                        }

                        var oldwidth = that._resizecolumn.width;
                        that._resizecolumn.width = newwidth;
                        if (that._resizecolumn._percentagewidth != undefined) {
                            that._resizecolumn._percentagewidth = (newwidth / hostwidth) * 100;
                        }
                        for (var m = 0; m < that._columns.length; m++) {
                            if (that._columns[m].datafield === that._resizecolumn.datafield) {
                                that._columns[m].width = that._resizecolumn.width;
                                break;
                            }
                        }

                        var scrollVisibility = that.hScrollBar[0].style.visibility;

                        that._updatecolumnwidths();
                        that.refresh();
                        that._resizecolumn = null;

                        that.resizeline.hide();
                        that.resizestartline.hide();
                        that.resizebackground.remove();
                        that.resizablecolumn = null;
                    }
                    else {
                        that.resizablecolumn = null;
                    }
                }

                try {
                    if (document.referrer != "" || window.frameElement) {
                        var parentLocation = null;
                        if (window.top != null && window.top != window.that) {
                            if (window.parent && document.referrer) {
                                parentLocation = document.referrer;
                            }
                        }

                        if (parentLocation && parentLocation.indexOf(document.location.host) != -1) {
                            var eventHandle = function (event) {
                                doresize();
                            };

                            if (window.top.document.addEventListener) {
                                window.top.document.addEventListener('mouseup', eventHandle, false);

                            } else if (window.top.document.attachEvent) {
                                window.top.document.attachEvent("on" + 'mouseup', eventHandle);
                            }
                        }
                    }
                }
                catch (error) {
                }

                this.removeHandler($(document), mouseup);
                this.addHandler($(document), mouseup, function (event) {
                    var openedmenu = $.data(document.body, "contextmenu" + that.element.id);
                    if (openedmenu != null && that.autoshowcolumnsmenubutton)
                        return true;

                    doresize();
                });
            }
        },

        _updatecolumnwidths: function () {
            var totalwidth = this.host.width();
            var hostwidth = totalwidth;
            if (this.vScrollBar.css('visibility') === "visible") {
                totalwidth -= parseInt(this.scrollbarsize) + 6;
                hostwidth = totalwidth;
            }

            var allcharacters = '';
            if (this.columns == undefined || this.columns.records == undefined)
                return;

            var that = this;
            var requiresRowsRender = false;

            $.each(this.columns.records, function (i, value) {
                if (!(this.hidden)) {
                    if (this.width.toString().indexOf('%') != -1 || this._percentagewidth != undefined) {
                        var value = 0;
                        var offset = that.vScrollBar[0].style.visibility == 'hidden' ? 0 : that.scrollbarsize + 5;
                        value = parseFloat(this.width) * hostwidth / 100;
                        if (this._percentagewidth != undefined) {
                            value = parseFloat(this._percentagewidth) * (hostwidth) / 100;
                        }

                        if (value < this.minwidth && this.minwidth != 'auto') value = this.minwidth;
                        if (value > this.maxwidth && this.maxwidth != 'auto') value = this.maxwidth;
                        totalwidth -= Math.round(value);
                    }
                    else if (this.width != 'auto' && !this._width) {
                        totalwidth -= this.width;
                    }
                    else {
                        allcharacters += this.text;
                    }
                }
            });

            var columnheader = this.columnsheader.find('#columntable' + this.element.id);
            if (columnheader.length == 0)
                return;

            var columns = columnheader.find('.jqx-grid-column-header');
            var left = 0;
            $.each(this.columns.records, function (i, value) {
                var column = $(columns[i]);
                var percentage = false;
                var desiredwidth = this.width;
                var oldwidth = this.width;
                if (this.width.toString().indexOf('%') != -1 || this._percentagewidth != undefined) {
                    if (this._percentagewidth != undefined) {
                        desiredwidth = parseFloat(this._percentagewidth) * hostwidth / 100;
                    }
                    else {
                        desiredwidth = parseFloat(this.width) * hostwidth / 100;
                    }
                    desiredwidth = Math.round(desiredwidth);
                    percentage = true;
                }

                if (this.width != 'auto' && !this._width && !percentage) {
                    if (parseInt(column[0].style.width) != this.width) {
                        column.width(this.width);
                    }
                }
                else if (percentage) {
                    if (desiredwidth < this.minwidth && this.minwidth != 'auto') {
                        desiredwidth = this.minwidth;
                        this.width = desiredwidth;
                    }
                    if (desiredwidth > this.maxwidth && this.maxwidth != 'auto') {
                        desiredwidth = this.maxwidth;
                        this.width = desiredwidth;
                    }

                    if (parseInt(column[0].style.width) != desiredwidth) {
                        column.width(desiredwidth);
                        this.width = desiredwidth;
                    }
                }
                else {
                    var width = Math.floor(totalwidth * (this.text.length / allcharacters.length));
                    if (isNaN(width)) {
                        width = this.minwidth;
                    }

                    if (width < 0) {
                        $element = $('<span>' + this.text + '</span>');
                        $(document.body).append($element);
                        width = 10 + $element.width();
                        $element.remove();
                    }
                    if (width < this.minwidth)
                        width = this.minwidth;
                    if (width > this.maxwidth) {
                        width = this.maxwidth;
                    }

                    this._width = 'auto';
                    this.width = width;
                    column.width(this.width);
                }
                if (parseInt(column[0].style.left) != left) {
                    column.css('left', left);
                }

                if (!(this.hidden)) {
                    left += this.width;
                }

                this._requirewidthupdate = true;
                if (oldwidth !== this.width) {
                    requiresRowsRender = true;
                }
            });

            this.columnsheader.width(2 + left);
            columnheader.width(this.columnsheader.width());

            this._resizecolumngroups();
            if (requiresRowsRender) {
                this._renderrows();
            }
            if (this.showaggregates) {
                this._refreshcolumnsaggregates();
            }
        },

        _rendercolumnheaders: function () {
            var that = this;
            if (this._updating) {
                return;
            }

            this._columnsbydatafield = new Array();
            this.columnsheader.find('#columntable' + this.element.id).remove();
            var columnheader = $('<div id="columntable' + this.element.id + '" style="height: 100%; position: relative;"></div>')
            columnheader[0].cells = new Array();

            var k = 0;
            var left = 0;

            var allcharacters = "";
            var totalwidth = this.host.width();
            var hostwidth = totalwidth;

            var pinnedcolumns = new Array();
            var normalcolumns = new Array();

            $.each(this.columns.records, function (i, value) {
                if (!(this.hidden)) {
                    if (this.width != 'auto' && !this._width) {
                        if (this.width < this.minwidth && this.minwidth != 'auto') {
                            totalwidth -= this.minwidth;
                        }
                        else if (this.width > this.maxwidth && this.maxwidth != 'auto') {
                            totalwidth -= this.maxwidth;
                        }
                        else if (this.width.toString().indexOf('%') != -1) {
                            var value = 0;
                            value = parseFloat(this.width) * hostwidth / 100;
                            if (value < this.minwidth && this.minwidth != 'auto') value = this.minwidth;
                            if (value > this.maxwidth && this.maxwidth != 'auto') value = this.maxwidth;
                            totalwidth -= value;
                        }
                        else {
                            if (typeof this.width == 'string') this.width = parseInt(this.width);
                            totalwidth -= this.width;
                        }
                    }
                    else {
                        allcharacters += this.text;
                    }
                }
                if (this.pinned || this.grouped || this.checkboxcolumn) {
                    if (that._haspinned) {
                        this.pinned = true;
                    }
                    pinnedcolumns[pinnedcolumns.length] = this;
                }
                else {
                    normalcolumns[normalcolumns.length] = this;
                }
            });

            if (!this.rtl) {
                for (var i = 0; i < pinnedcolumns.length; i++) {
                    this.columns.replace(i, pinnedcolumns[i]);
                }
                for (var j = 0; j < normalcolumns.length; j++) {
                    this.columns.replace(pinnedcolumns.length + j, normalcolumns[j]);
                }
            }
            else {
                var p = 0;
                pinnedcolumns.reverse();
                for (var i = this.columns.records.length - 1; i >= this.columns.records.length - pinnedcolumns.length; i--) {
                    this.columns.replace(i, pinnedcolumns[p++]);
                }
                for (var j = 0; j < normalcolumns.length; j++) {
                    this.columns.replace(j, normalcolumns[j]);
                }
            }

            var zindex = this.headerZIndex;
            var groupslength = 0;

            var headerheight = that.columnsheight;
            var getcolumnheight = function (datafield, column) {
                var height = that.columngroupslevel * that.columnsheight;
                height = height - (column.level * that.columnsheight);
                return height;
            }

            $.each(this.columns.records, function (i, value) {
                this.height = that.columnsheight;
                if (that.columngroups) {
                    if (that.columngroups.length) {
                        this.height = getcolumnheight(this.datafield, this);
                        headerheight = this.height;
                    }
                }

                var classname = that.toTP('jqx-grid-column-header') + " " + that.toTP('jqx-widget-header');
                if (that.rtl) {
                    classname += " " + that.toTP('jqx-grid-column-header-rtl');
                }

                if (!that.enablebrowserselection) {
                    classname += " " + that.toTP('jqx-disableselect');
                }
                var pinnedZIndex = !self.rtl ? 150 + zindex - 1 : 150 + zindex + 1;
                var columnZIndex = !that.rtl ? zindex-- : zindex++;

                var column = $('<div role="columnheader" style="z-index: ' + columnZIndex + ';position: absolute; height: 100%;" class="' + classname + '"><div style="height: 100%; width: 100%;"></div></div>');
                if (that.rtl && i === 0) {
                    column[0].style.borderLeftColor = "transparent";
                }

                if (that.columngroups) {
                    column[0].style.height = headerheight + 'px';
                    column[0].style.bottom = '0px';
                    if (this.pinned) {
                        column[0].style.zIndex = pinnedZIndex;
                    }
                }

                this.uielement = column;
                this.element = column;
                if (this.classname != '' && this.classname) {
                    column.addClass(this.classname);
                }

                var desiredwidth = this.width;
                var percentage = false;
                if (this.width === null) {
                    this.width = "auto";
                }

                if (this.width.toString().indexOf('%') != -1 || this._percentagewidth != undefined) {
                    if (this._percentagewidth != undefined) {
                        desiredwidth = parseFloat(this._percentagewidth) * hostwidth / 100;
                    }
                    else {
                        desiredwidth = parseFloat(this.width) * hostwidth / 100;
                    }
                    desiredwidth = Math.round(desiredwidth);
                    percentage = true;
                }

                if (this.width != 'auto' && !this._width && !percentage) {
                    if (desiredwidth < this.minwidth && this.minwidth != 'auto') {
                        desiredwidth = this.minwidth;
                    }
                    if (desiredwidth > this.maxwidth && this.maxwidth != 'auto') {
                        desiredwidth = this.maxwidth;
                    }

                    column[0].style.width = parseInt(desiredwidth) + 'px';
                }
                else if (percentage) {
                    if (desiredwidth < this.minwidth && this.minwidth != 'auto') {
                        desiredwidth = this.minwidth;
                    }
                    if (desiredwidth > this.maxwidth && this.maxwidth != 'auto') {
                        desiredwidth = this.maxwidth;
                    }

                    if (this._percentagewidth == undefined || this.width.toString().indexOf('%') != -1) {
                        this._percentagewidth = this.width;
                    }
                    column.width(desiredwidth);
                    this.width = desiredwidth;
                }
                else {
                    var width = Math.floor(totalwidth * (this.text.length / allcharacters.length));
                    if (isNaN(width)) {
                        width = this.minwidth;
                    }

                    if (width < 0) {
                        $element = $('<span>' + this.text + '</span>');
                        $(document.body).append($element);
                        width = 10 + $element.width();
                        $element.remove();
                    }
                    if (width < this.minwidth)
                        width = this.minwidth;
                    if (width > this.maxwidth) {
                        width = this.maxwidth;
                    }

                    this._width = 'auto';
                    this.width = parseInt(width);
                    desiredwidth = this.width;
                    column.width(this.width);
                }

                if (this.hidden) {
                    column.css('display', 'none');
                }

                var columncontentcontainer = $(column.children()[0]);
                columnheader[0].cells[i] = column[0];
                var shouldhandledragdrop = false;
                var detailscolumn = false;

                var columnContent = this.renderer != null ? this.renderer(this.text, this.align, headerheight) : that._rendercolumnheader(this.text, this.align, headerheight, that);
                if (columnContent == null) {
                    columnContent = that._rendercolumnheader(this.text, this.align, headerheight, that);
                }
                if (this.renderer != null) columnContent = $(columnContent);
                shouldhandledragdrop = true;

                if (that.WinJS) {
                    MSApp.execUnsafeLocalFunction(function () {
                        columncontentcontainer.append($(columnContent));
                    });
                }
                else {
                    if (this.renderer) {
                        columncontentcontainer.append($(columnContent));
                    }
                    else {
                        if (columnContent) {
                            columncontentcontainer[0].innerHTML = columnContent;
                        }
                    }
                }

                if (columnContent != null) {
                    var iconscontainer = $('<div class="iconscontainer" style="height: ' + headerheight + 'px; margin-left: -32px; display: block; position: absolute; left: 100%; top: 0%; width: 32px;">'
                        + '<div class="filtericon ' + that.toTP('jqx-widget-header') + '" style="height: ' + headerheight + 'px; float: right; display: none; width: 16px;"><div class="' + that.toTP('jqx-grid-column-filterbutton') + '" style="width: 100%; height:100%;"></div></div>'
                        + '<div class="sortasc ' + that.toTP('jqx-widget-header') + '" style="height: ' + headerheight + 'px; float: right; display: none; width: 16px;"><div class="' + that.toTP('jqx-grid-column-sortascbutton') + '" style="width: 100%; height:100%;"></div></div>'
                        + '<div class="sortdesc ' + that.toTP('jqx-widget-header') + '" style="height: ' + headerheight + 'px; float: right; display: none; width: 16px;"><div class="' + that.toTP('jqx-grid-column-sortdescbutton') + '" style="width: 100%; height:100%;"></div></div>'
                        + '</div>');
                    columncontentcontainer.append(iconscontainer);

                    var iconschildren = iconscontainer.children();
                    this.sortasc = iconschildren[1];
                    this.sortdesc = iconschildren[2];
                    this.filtericon = iconschildren[0];

                    this.iconscontainer = iconscontainer;
                    if (that.rtl) {
                        iconscontainer.css('margin-left', '0px');
                        iconscontainer.css('left', '0px');
                        $(this.sortasc).css('float', 'left');
                        $(this.filtericon).css('float', 'left');
                        $(this.sortdesc).css('float', 'left');
                    }
                }

                columnheader.append(column);

                if (that.columnsreorder && this.draggable && that._handlecolumnsdragreorder) {
                    that._handlecolumnsdragreorder(this, column);
                }

                var columnitem = this;
                that.addHandler(column, 'click', function (event) {
                    if (columnitem.checkboxcolumn)
                        return true;

                    if (that._togglesort) {
                        if (!that._loading) {
                            that._togglesort(columnitem);
                        }
                    }
                    event.preventDefault();
                });

                if (columnitem.resizable && that.columnsresize && !detailscolumn) {
                    var isTouchDevice = false;
                    var eventname = 'mousemove';
                    if (that.isTouchDevice()) {
                        isTouchDevice = true;
                        eventname = $.jqx.mobile.getTouchEventName('touchstart');
                    }
                    that.addHandler(column, eventname, function (event) {
                        var pagex = parseInt(event.pageX);
                        var offset = 5;
                        var columnleft = parseInt(column.coord().left);
                        if (that.hasTransform) {
                            columnleft = $.jqx.utilities.getOffset(column).left;
                        }

                        if (that._handlecolumnsresize) {
                            if (isTouchDevice) {
                                var touches = $.jqx.mobile.getTouches(event);
                                var touch = touches[0];
                                pagex = touch.pageX;
                                offset = 40;
                                if (pagex >= columnleft + columnitem.width - offset) {
                                    that.resizablecolumn = { columnelement: column, column: columnitem };
                                    column.css('cursor', "col-resize");
                                }
                                else {
                                    column.css('cursor', "");
                                    that.resizablecolumn = null;
                                }
                                return true;
                            }

                            var colwidth = columnitem.width;
                            if (that.rtl) colwidth = 0;

                            if (pagex >= columnleft + colwidth - offset) {
                                if (pagex <= columnleft + colwidth + offset) {
                                    that.resizablecolumn = { columnelement: column, column: columnitem };
                                    column.css('cursor', "col-resize");
                                    return false;
                                }
                                else {
                                    column.css('cursor', "");
                                    that.resizablecolumn = null;
                                }
                            }
                            else {
                                column.css('cursor', "");
                                if (pagex < columnleft + colwidth - offset) {
                                    if (!columnitem._animating && !columnitem._menuvisible) {
                                        column.mouseenter();
                                    }
                                }

                                that.resizablecolumn = null;
                            }
                        }
                    });
                }

                column.css('left', left);

                if (!(this.hidden)) {
                    left += desiredwidth;
                }

                if (columnitem.rendered) {
                    var result = columnitem.rendered($(columncontentcontainer[0].firstChild), columnitem.align, headerheight);
                    if (result && iconscontainer != null) {
                        iconscontainer.hide();
                    }
                }
            });

            if (left > 0) {
                this.columnsheader.width(2 + left);
            }
            else {
                this.columnsheader.width(left);
            }

            this.columnsrow = columnheader;
            that.columnsheader.append(columnheader);
            columnheader.width(left);
            if (this._handlecolumnsdragdrop) {
                this._handlecolumnsdragdrop();
            }
            if (this._handlecolumnsreorder) {
                this._handlecolumnsreorder();
            }
            if (this._handlecolumnsresize) {
                this._handlecolumnsresize();
            }
            if (this.columngroups) {
                this._rendercolumngroups();
            }
        },

        _rendercolumngroups: function () {
            if (!this.columngroups) return;
            var pinnedColumns = 0;
            for (var i = 0; i < this.columns.records.length; i++) {
                if (this.columns.records[i].pinned) pinnedColumns++;
            }

            var zindex = this.headerZIndex - pinnedColumns + this.columns.records.length;
            var that = this;
            var classname = that.toTP('jqx-grid-column-header') + " " + that.toTP('jqx-grid-columngroup-header') + " " + that.toTP('jqx-widget-header');
            if (that.rtl) {
                classname += " " + that.toTP('jqx-grid-columngroup-header-rtl');
            }
            var columnheader = this.columnsheader.find('#columntable' + this.element.id);
            columnheader.find('jqx-grid-columngroup-header').remove();

            for (var j = 0; j < this.columngroupslevel - 1; j++) {
                for (var i = 0; i < this.columngroups.length; i++) {
                    var group = this.columngroups[i];
                    var level = group.level;
                    if (level !== j)
                        continue;

                    var top = level * this.columnsheight;
                    var left = 99999;
                    if (group.groups) {
                        var getwidth = function (group) {
                            var width = 0;
                            for (var j = 0; j < group.groups.length; j++) {
                                var currentgroup = group.groups[j];
                                if (!currentgroup.groups) {
                                    if (!currentgroup.hidden) {
                                        width += currentgroup.width;
                                        left = Math.min(parseInt(currentgroup.element[0].style.left), left);
                                    }
                                }
                                else {
                                    width += getwidth(currentgroup);
                                }
                            }
                            return width;
                        }
                        group.width = getwidth(group);
                        group.left = left;

                        var height = this.columnsheight;
                        var columnZIndex = zindex--;
                        var column = $('<div role="columnheader" style="z-index: ' + columnZIndex + ';position: absolute;" class="' + classname + '"></div>');
                        var element = $(this._rendercolumnheader(group.text, group.align, this.columnsheight, this));
                        column.append(element);
                        column[0].style.left = left + 'px';
                        if (left === 0) {
                            column[0].style.borderLeftColor = 'transparent';
                        }
                        column[0].style.top = top + 'px';
                        column[0].style.height = height + 'px';
                        column[0].style.width = -1 + group.width + 'px';
                        columnheader.append(column);
                        group.element = column;
                    }
                }
            }
        },

        _resizecolumngroups: function () {
            if (!this.columngroups) return;
            for (var i = 0; i < this.columngroups.length; i++) {
                var group = this.columngroups[i];
                var level = group.level;
                var top = level * this.columnsheight;
                var left = 99999;
                if (group.groups) {
                    var getwidth = function (group) {
                        var width = 0;
                        for (var j = 0; j < group.groups.length; j++) {
                            var currentgroup = group.groups[j];
                            if (!currentgroup.groups) {
                                width += currentgroup.width;
                                left = Math.min(parseInt(currentgroup.element[0].style.left), left);
                            }
                            else {
                                width += getwidth(currentgroup);
                            }
                        }
                        return width;
                    }
                    group.width = getwidth(group);
                    group.left = left;

                    var height = this.columnsheight;
                    var column = group.element;
                    column[0].style.left = left + 'px';
                    column[0].style.top = top + 'px';
                    column[0].style.height = height + 'px';
                    column[0].style.width = -1 + group.width + 'px';
                }
            }
        },

        _removecolumnhandlers: function (columnitem) {
            var that = this;
            var column = $(columnitem.element);
            if (column.length > 0) {
                that.removeHandler(column, 'mouseenter');
                that.removeHandler(column, 'mouseleave');
                var $filtericon = $(columnitem.filtericon);
                that.removeHandler($filtericon, 'mousedown');
                that.removeHandler($filtericon, 'click');
                that.removeHandler(column, 'click');
            }
        },

        _calculateaggregate: function (column, aggregates, formatData, records) {
            var aggregate = column.aggregates;
            if (!aggregate) aggregate = aggregates;

            if (aggregate) {
                var formatstrings = new Array();
                for (var i = 0; i < aggregate.length; i++) {
                    if (aggregate[i] == 'count') {
                        continue;
                    }
                    formatstrings[formatstrings.length] = column.cellsformat;
                }

                if (this.source && this.source.getAggregatedData) {
                    if (records == undefined) {
                        records = this.getRows();
                        if (this.dataViewRecords) records = this.dataViewRecords;
                    }
                    var levelRecords = records;
                    var level = -1;
                    if (this.treeGrid) {
                        var hierarchy = new Array();
                        var getRecords = function (data) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i] == undefined) {
                                    continue;
                                }
                                if (level == -1) {
                                    level = data[i].level;
                                }

                                if (!data[i].aggregate) {
                                    hierarchy.push(data[i]);
                                }
                                if (!data[i].leaf && data[i].records && data[i].records.length > 0) {
                                    getRecords(data[i].records);
                                }
                            }
                        }
                        getRecords(records);
                        records = hierarchy;
                    }

                    if (this.treeGrid && this.filterable && this.dataview.filters.length > 0) {
                        var filteredRecords = new Array();
                        for (var i = 0; i < records.length; i++) {
                            if (records[i] && records[i]._visible !== false) {
                                filteredRecords.push(records[i]);
                            }
                        }
                        records = filteredRecords;

                        var filteredLevelRecords = new Array();
                        for (var i = 0; i < levelRecords.length; i++) {
                            if (levelRecords[i] && levelRecords[i]._visible !== false) {
                                filteredLevelRecords.push(levelRecords[i]);
                            }
                        }
                        levelRecords = filteredLevelRecords;
                    }

                    if (formatData == undefined || formatData == true) {
                        var summaryData = this.source.getAggregatedData
                ([{ name: column.datafield, aggregates: aggregate, formatStrings: formatstrings }], this.gridlocalization, records, level);
                        if (this.treeGrid) {
                            if (summaryData[column.datafield].sum != undefined || summaryData[column.datafield].avg != undefined) {
                                var summaryLevelData = this.source.getAggregatedData
                    ([{ name: column.datafield, aggregates: aggregate, formatStrings: formatstrings }], this.gridlocalization, levelRecords, level);
                                if (summaryData[column.datafield].sum != undefined) {
                                    summaryData[column.datafield].sum = summaryLevelData[column.datafield].sum;
                                }
                                if (summaryData[column.datafield].avg != undefined) {
                                    summaryData[column.datafield].avg = summaryLevelData[column.datafield].avg;
                                }
                            }
                        }
                        return summaryData;
                    }
                    else {
                        var summaryData = this.source.getAggregatedData
                ([{ name: column.datafield, aggregates: aggregate }], this.gridlocalization, records, level);
                        if (this.treeGrid) {
                            if (summaryData[column.datafield].sum != undefined || summaryData[column.datafield].avg != undefined) {
                                var summaryLevelData = this.source.getAggregatedData
                                  ([{ name: column.datafield, aggregates: aggregate }], this.gridlocalization, levelRecords, level);
                                if (summaryData[column.datafield].sum != undefined) {
                                    summaryData[column.datafield].sum = summaryLevelData[column.datafield].sum;
                                }
                                if (summaryData[column.datafield].avg != undefined) {
                                    summaryData[column.datafield].avg = summaryLevelData[column.datafield].avg;
                                }
                            }
                        }
                        return summaryData;
                    }
                }
            }
            return null;
        },

        getcolumnaggregateddata: function (datafield, aggregates, formatdata, records) {
            var column = this.getcolumn(datafield);
            if (!column) return "";

            var format = (formatdata == undefined || formatdata == false) ? false : formatdata;
            if (aggregates == null) return "";

            var tmpaggregates = column.aggregates;
            column.aggregates = null;

            var agg = this._calculateaggregate(column, aggregates, format, records);
            var summaryData = {};
            if (agg) {
                summaryData = agg[datafield];
                column.aggregates = tmpaggregates;
            }
            return summaryData;
        },

        _updatecolumnaggregates: function (column, aggregates, columnelement) {
            var me = this;
            if (!aggregates) {
                columnelement.children().remove();
                columnelement.html('');
                if (column.aggregatesrenderer) {
                    var obj = {};
                    if (column.aggregates) {
                        obj = this.getcolumnaggregateddata(column.datafield, column.aggregates);
                    }

                    var renderstring = column.aggregatesrenderer({}, column, columnelement, null);
                    columnelement.html(renderstring);
                }
                return;
            }

            columnelement.children().remove();
            columnelement.html('');
            if (column.aggregatesrenderer) {
                if (aggregates) {
                    var renderstring = column.aggregatesrenderer(aggregates[column.datafield], column, columnelement, this.getcolumnaggregateddata(column.datafield, column.aggregates), "aggregates");
                    columnelement.html(renderstring);
                }
            }
            else {
                $.each(aggregates, function () {
                    var aggregate = this;
                    for (obj in aggregate) {
                        var field = $('<div style="position: relative; margin: 4px; overflow: hidden;"></div>');
                        var name = obj;
                        name = me._getaggregatename(name);
                        field.html(name + ':' + aggregate[obj]);
                        if (me.rtl) {
                            field.addClass(me.toThemeProperty('jqx-rtl'));
                        }

                        columnelement.append(field);
                    }
                });
            }
        },

        _getaggregatetype: function (obj) {
            switch (obj) {
                case 'min':
                case 'max':
                case 'count':
                case 'avg':
                case 'product':
                case 'var':
                case 'varp':
                case 'stdev':
                case 'stdevp':
                case 'sum':
                    return obj;
            }
            var name = obj;
            for (var myObj in obj) {
                name = myObj;
                break;
            }
            return name;
        },

        _getaggregatename: function (obj) {
            var name = obj;
            switch (obj) {
                case 'min':
                    name = 'Min';
                    break;
                case 'max':
                    name = 'Max';
                    break;
                case 'count':
                    name = 'Count';
                    break;
                case 'avg':
                    name = 'Avg';
                    break;
                case 'product':
                    name = 'Product';
                    break;
                case 'var':
                    name = 'Var';
                    break;
                case 'stdevp':
                    name = 'StDevP';
                    break;
                case 'stdev':
                    name = 'StDev';
                    break;
                case 'varp':
                    name = 'VarP';
                case 'sum':
                    name = 'Sum';
                    break;
            }
            if (obj === name && typeof (name) != 'string') {
                for (var myObj in obj) {
                    name = myObj;
                    break;
                }
            }
            return name;
        },

        _updatecolumnsaggregates: function () {
            var rows = this.getRows();
            if (this.dataViewRecords) rows = this.dataViewRecords;
            var columnslength = this.columns.records.length;
            if (undefined != this.aggregates[0].cells) {
                for (var j = 0; j < columnslength; j++) {
                    var tablecolumn = $(this.aggregates[0].cells[j]);
                    var columnrecord = this.columns.records[j];
                    var summaryData = this._calculateaggregate(columnrecord, null, true, rows);
                    this._updatecolumnaggregates(columnrecord, summaryData, tablecolumn);
                }
            }
        },

        _refreshcolumnsaggregates: function () {
            var columnslength = this.columns.records.length;
            if (undefined != this.aggregates[0].cells) {
                var left = 0;
                for (var j = 0; j < columnslength; j++) {
                    var tablecolumn = $(this.aggregates[0].cells[j]);
                    var columnrecord = this.columns.records[j];
                    if (tablecolumn) {
                        tablecolumn.width(columnrecord.width);
                        tablecolumn[0].style.left = left + 'px';
                        if (!(columnrecord.hidden && columnrecord.hideable)) {
                            left += columnrecord.width;
                        }
                        else {
                            tablecolumn.css('display', 'none');
                        }
                    }
                }
            }
        },

        _updateaggregates: function () {
            var tablerow = $('<div style="position: relative;" id="statusrow' + this.element.id + '"></div>');
            var left = 0;
            var columnslength = this.columns.records.length;
            var cellclass = this.toThemeProperty('jqx-grid-cell');
            if (this.rtl) {
                cellclass += ' ' + this.toThemeProperty('jqx-grid-cell-rtl');
                left = 0;
                tablerow.css('border-left-width', '0px');
                this.aggregates.css('border-left-color', 'transparent');
            }
            cellclass += ' ' + this.toThemeProperty('jqx-grid-cell-pinned');
            //var cellclass = this.toThemeProperty('jqx-widget-header');
            var zindex = columnslength + 10;
            var cells = new Array();
            this.aggregates[0].cells = cells;

            for (var j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                var summaryData = this._calculateaggregate(columnrecord);
                var width = columnrecord.width;
                if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;

                var tablecolumn = $('<div style="overflow: hidden; position: absolute; height: 100%;" class="' + cellclass + '"></div>');
                tablerow.append(tablecolumn);
                tablecolumn.css('left', left);
                if (!this.rtl) {
                    tablecolumn.css('z-index', zindex--);
                }
                else {
                    tablecolumn.css('z-index', zindex++);
                    if (j == 0) {
                        tablecolumn.css('border-left-width', '0px');
                    }
                }

                tablecolumn.width(width);
                tablecolumn[0].style.left = left + 'px';
                if (!(columnrecord.hidden && columnrecord.hideable)) {
                    left += width;
                }
                else {
                    tablecolumn.css('display', 'none');
                }
                cells[cells.length] = tablecolumn[0];
                this._updatecolumnaggregates(columnrecord, summaryData, tablecolumn);
            }

            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                tablerow.css('z-index', zindex--);
            }

            tablerow.width(parseInt(left) + 2);
            tablerow.height(this.aggregatesheight);
            this.aggregates.children().remove();
            this.aggregates.append(tablerow);
            this.aggregates.removeClass(this.toThemeProperty('jqx-widget-header'));
            this.aggregates.addClass(cellclass);
            this.aggregates.css('border-bottom-color', 'transparent');
            this.aggregates.css('border-top-width', '1px');
            if (this.rtl && this.hScrollBar.css('visibility') != 'hidden') {
                this._renderhorizontalscroll();
            }
        },

        destroy: function () {
            if (this.columns && this.columns.records) {
                for (var i = 0; i < this.columns.records.length; i++) {
                    this._removecolumnhandlers(this.columns.records[i]);
                }
            }
            this.removeHandler($(document), 'mouseup.pagerbuttonstop');
            this.removeHandler($(document), 'mouseup.pagerbuttonsbottom');

            this._removeHandlers();
            $.jqx.utilities.resize(this.host, null, true);
            this.host.remove();
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            key = key.toLowerCase();
            if (value !== oldvalue) {
                if (key === "source") {
                    object.updatebounddata();
                }
                else if (key === "columns") {
                    object._columns = null;
                    object._render();
                }
                else if (key === "pagermode") {
                    object.pagermode = value.toLowerCase();
                    object._initpager();
                }
                else if (key === "pagerposition") {
                    object.refresh();
                }
                else if (key === "selectionmode") {
                    object.selectionmode = value.toLowerCase();
                }
                else if (key == "touchmode") {
                    object._removeHandlers();
                    object.touchDevice = null;
                    object.vScrollBar.jqxScrollBar({ touchMode: value });
                    object.hScrollBar.jqxScrollBar({ touchMode: value });
                    object.refresh();
                    object._addHandlers();
                }
                else if (key == "enablehover") {
                    return;
                }
                else if (key == 'disabled') {
                    if (value) {
                        object.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    }
                    else {
                        object.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    }

                    if (object.pageable) {
                        if (object["pagernexttop"]) {
                            object["pagernexttop"].jqxButton({ disabled: value });
                            object["pagerprevioustop"].jqxButton({ disabled: value });
                            object["pagernextbottom"].jqxButton({ disabled: value });
                            object["pagerpreviousbottom"].jqxButton({ disabled: value });
                            object["pagerfirsttop"].jqxButton({ disabled: value });
                            object["pagerfirstbottom"].jqxButton({ disabled: value });
                            object["pagerlasttop"].jqxButton({ disabled: value });
                            object["pagerlastbottom"].jqxButton({ disabled: value });
                            if (object["pagershowrowscombotop"].jqxDropDownList) {
                                if (object.pagermode == "advanced") {
                                    object["pagershowrowscombotop"].jqxDropDownList({ disabled: false });
                                    object["pagershowrowscombobottom"].jqxDropDownList({ disabled: false });
                                }
                            }
                        }
                        object.host.find('.jqx-grid-pager-number').css('cursor', value ? 'default' : 'pointer');
                    }
                    object.host.find('.jqx-grid-group-collapse').css('cursor', value ? 'default' : 'pointer');
                    object.host.find('.jqx-grid-group-expand').css('cursor', value ? 'default' : 'pointer');
                }
                else {
                    object.refresh();
                }
            }
        },

        _rendercolumnheader: function (text, align, headerheight, that) {
            var margin = '4px';

            if (that.columngroups) {
                margin = (headerheight / 2 - this._columnheight / 2);
                if (margin < 0) {
                    margin = 4;
                }
                margin += 'px';
            }
            else {
                if (this.columnsheight != 25) {
                    margin = (this.columnsheight / 2 - this._columnheight / 2);
                    if (margin < 0) {
                        margin = 4;
                    }
                    margin += 'px';
                }
            }

            return '<div style="overflow: hidden; text-overflow: ellipsis; text-align: ' + align + '; margin-left: 4px; margin-right: 4px; margin-bottom: ' + margin + '; margin-top: ' + margin + ';">' + '<span style="text-overflow: ellipsis; cursor: default;">' + text + '</span>' + '</div>';
        }
    });

    function jqxDataTableColumn(owner, data) {
        this.owner = owner;
        this.datafield = null;
        this.displayfield = null;
        this.text = '';
        this.sortable = true;
        this.editable = true;
        this.hidden = false;
        this.groupable = true;
        this.renderer = null;
        this.cellsrenderer = null;
        this.columntype = null;
        this.cellsformat = "";
        this.align = 'left';
        this.cellsalign = 'left';
        this.width = 'auto';
        this.minwidth = 25;
        this.maxwidth = 'auto';
        this.pinned = false;
        this.visibleindex = -1;
        this.filterable = true;
        this.filter = null;
        this.resizable = true;
        this.draggable = true;
        this.initeditor = null;
        this.createeditor = null;
        this.destroyeditor = null;
        this.geteditorvalue = null;
        this.validation = null;
        this.classname = '';
        this.cellclassname = '';
        this.aggregates = null;
        this.aggregatesrenderer = null;
        this.rendered = null;
        this.exportable = true;
        this.nullable = true;
        this.columngroup = null;
        this.columntype = "textbox";

        this.getcolumnproperties = function () {
            return {
                nullable: this.nullable,
                sortable: this.sortable,
                hidden: this.hidden, groupable: this.groupable, width: this.width, align: this.align, editable: this.editable,
                minwidth: this.minwidth, maxwidth: this.maxwidth, resizable: this.resizable, datafield: this.datafield, text: this.text,
                exportable: this.exportable, cellsalign: this.cellsalign, pinned: this.pinned, cellsformat: this.cellsformat, columntype: this.columntype, classname: this.classname, cellclassname: this.cellclassname, menu: this.menu
            };
        },

        this.setproperty = function (propertyname, value) {
            if (this[propertyname]) {
                var oldvalue = this[propertyname];
                this[propertyname] = value;
                this.owner._columnPropertyChanged(this, propertyname, value, oldvalue);
            }
            else {
                if (this[propertyname.toLowerCase()]) {
                    var oldvalue = this[propertyname.toLowerCase()];
                    this[propertyname.toLowerCase()] = value;
                    this.owner._columnPropertyChanged(this, propertyname.toLowerCase(), value, oldvalue);
                }
            }
        }

        this._initfields = function (data) {
            if (data != null) {
                var that = this;
                if ($.jqx.hasProperty(data, 'dataField')) {
                    this.datafield = $.jqx.get(data, 'dataField');
                }

                if ($.jqx.hasProperty(data, 'displayField')) {
                    this.displayfield = $.jqx.get(data, 'displayField');
                }
                else {
                    this.displayfield = this.datafield;
                }
                if ($.jqx.hasProperty(data, 'columnType')) {
                    this.columntype = $.jqx.get(data, 'columnType');
                }
                if ($.jqx.hasProperty(data, 'validation')) {
                    this.validation = $.jqx.get(data, 'validation');
                }
                if ($.jqx.hasProperty(data, 'text')) {
                    this.text = $.jqx.get(data, 'text');
                }
                if ($.jqx.hasProperty(data, 'sortable')) {
                    this.sortable = $.jqx.get(data, 'sortable');
                }
                if ($.jqx.hasProperty(data, 'hidden')) {
                    this.hidden = $.jqx.get(data, 'hidden');
                }
                if ($.jqx.hasProperty(data, 'groupable')) {
                    this.groupable = $.jqx.get(data, 'groupable');
                }
                if ($.jqx.hasProperty(data, 'renderer')) {
                    this.renderer = $.jqx.get(data, 'renderer');
                }
                if ($.jqx.hasProperty(data, 'align')) {
                    this.align = $.jqx.get(data, 'align');
                }
                if ($.jqx.hasProperty(data, 'cellsAlign')) {
                    this.cellsalign = $.jqx.get(data, 'cellsAlign');
                }
                if ($.jqx.hasProperty(data, 'cellsFormat')) {
                    this.cellsformat = $.jqx.get(data, 'cellsFormat');
                }
                if ($.jqx.hasProperty(data, 'width')) {
                    this.width = $.jqx.get(data, 'width');
                }
                if ($.jqx.hasProperty(data, 'minWidth')) {
                    this.minwidth = $.jqx.get(data, 'minWidth');
                }
                if ($.jqx.hasProperty(data, 'maxWidth')) {
                    this.maxwidth = $.jqx.get(data, 'maxWidth');
                }
                if ($.jqx.hasProperty(data, 'cellsRenderer')) {
                    this.cellsrenderer = $.jqx.get(data, 'cellsRenderer');
                }
                if ($.jqx.hasProperty(data, 'columnType')) {
                    this.columntype = $.jqx.get(data, 'columnType');
                }
                if ($.jqx.hasProperty(data, 'pinned')) {
                    this.pinned = $.jqx.get(data, 'pinned');
                }
                if ($.jqx.hasProperty(data, 'filterable')) {
                    this.filterable = $.jqx.get(data, 'filterable');
                }
                if ($.jqx.hasProperty(data, 'filter')) {
                    this.filter = $.jqx.get(data, 'filter');
                }
                if ($.jqx.hasProperty(data, 'resizable')) {
                    this.resizable = $.jqx.get(data, 'resizable');
                }
                if ($.jqx.hasProperty(data, 'draggable')) {
                    this.draggable = $.jqx.get(data, 'draggable');
                }
                if ($.jqx.hasProperty(data, 'editable')) {
                    this.editable = $.jqx.get(data, 'editable');
                }
                if ($.jqx.hasProperty(data, 'initEditor')) {
                    this.initeditor = $.jqx.get(data, 'initEditor');
                }
                if ($.jqx.hasProperty(data, 'createEditor')) {
                    this.createeditor = $.jqx.get(data, 'createEditor');
                }
                if ($.jqx.hasProperty(data, 'destroyEditor')) {
                    this.destroyeditor = $.jqx.get(data, 'destroyEditor');
                }
                if ($.jqx.hasProperty(data, 'getEditorValue')) {
                    this.geteditorvalue = $.jqx.get(data, 'getEditorValue');
                }
                if ($.jqx.hasProperty(data, 'className')) {
                    this.classname = $.jqx.get(data, 'className');
                }
                if ($.jqx.hasProperty(data, 'cellClassName')) {
                    this.cellclassname = $.jqx.get(data, 'cellClassName');
                }
                if ($.jqx.hasProperty(data, 'aggregates')) {
                    this.aggregates = $.jqx.get(data, 'aggregates');
                }
                if ($.jqx.hasProperty(data, 'aggregatesRenderer')) {
                    this.aggregatesrenderer = $.jqx.get(data, 'aggregatesRenderer');
                }
                if ($.jqx.hasProperty(data, 'rendered')) {
                    this.rendered = $.jqx.get(data, 'rendered');
                }
                if ($.jqx.hasProperty(data, 'exportable')) {
                    this.exportable = $.jqx.get(data, 'exportable');
                }
                if ($.jqx.hasProperty(data, 'nullable')) {
                    this.nullable = $.jqx.get(data, 'nullable');
                }
                if ($.jqx.hasProperty(data, 'columnGroup')) {
                    this.columngroup = $.jqx.get(data, 'columnGroup');
                }

                if (!data instanceof String && !(typeof data == "string")) {
                    for (var obj in data) {
                        if (!that.hasOwnProperty(obj)) {
                            if (!that.hasOwnProperty(obj.toLowerCase())) {
                                owner.host.remove();
                                throw new Error("jqxDataTable: Invalid property name - " + obj + ".");
                            }
                        }
                    }
                }
            }
        }

        this._initfields(data);
        return this;
    }

    $.jqx.collection = function (owner) {
        this.records = new Array();
        this.owner = owner;
        this.updating = false;
        this.beginupdate = function () {
            this.updating = true;
        }

        this.resumeupdate = function () {
            this.updating = false;
        }

        this.clear = function () {
            this.records = new Array();
        }

        this.replace = function (index, object) {
            this.records[index] = object;
        }

        this.isempty = function (index) {
            if (this.records[index] == undefined) {
                return true;
            }

            return false;
        }

        this.initialize = function (size) {
            if (size < 1) size = 1;
            this.records[size - 1] = -1;
        }

        this.length = function () {
            return this.records.length;
        }

        this.indexOf = function (object) {
            return this.records.indexOf(object);
        }

        this.add = function (object) {
            if (object == null)
                return false;

            this.records[this.records.length] = object;
            return true;
        }

        this.insertAt = function (index, object) {
            if (index == null || index == undefined)
                return false;

            if (object == null)
                return false;

            if (index >= 0) {
                if (index < this.records.length) {
                    this.records.splice(index, 0, object);
                    return true;
                }
                else return this.add(object);
            }

            return false;
        }

        this.remove = function (object) {
            if (object == null || object == undefined)
                return false;

            var index = this.records.indexOf(object);
            if (index != -1) {
                this.records.splice(index, 1);
                return true;
            }

            return false;
        }

        this.removeAt = function (index) {
            if (index == null || index == undefined)
                return false;

            if (index < 0)
                return false;

            if (index < this.records.length) {
                var object = this.records[index];
                this.records.splice(index, 1);
                return true;
            }

            return false;
        }

        return this;
    }

    $.jqx.dataView = function () {
        this.that = this;
        this.grid = null;
        this.records = [];
        this.rows = [];
        this.columns = [];
        this.filters = new Array();
        this.pagesize = 0;
        this.pagenum = 0;
        this.source = null;

        this.databind = function (source, objectuniqueId) {
            var isdataadapter = source._source ? true : false;
            var dataadapter = null;
            this._sortData = null;
            this._sortHierarchyData = null;
            if (isdataadapter) {
                dataadapter = source;
                source = source._source;
            }
            else {
                dataadapter = new $.jqx.dataAdapter(source,
                {
                    autoBind: false
                });
            }

            var initadapter = function (that) {
                dataadapter.recordids = [];
                dataadapter.records = new Array();
                dataadapter.cachedrecords = new Array();
                dataadapter.originaldata = new Array();
                dataadapter._options.totalrecords = that.totalrecords;
                dataadapter._options.originaldata = that.originaldata;
                dataadapter._options.recordids = that.recordids;
                dataadapter._options.cachedrecords = new Array();
                dataadapter._options.pagenum = that.pagenum;
                dataadapter._options.pageable = that.pageable;
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
                if (source.updaterow != undefined) {
                    dataadapter._options.updaterow = source.updaterow;
                }
                if (source.addrow != undefined) {
                    dataadapter._options.addrow = source.addrow;
                }
                if (source.deleterow != undefined) {
                    dataadapter._options.deleterow = source.deleterow;
                }

                if (that.pagesize == 0) that.pagesize = 10;
                dataadapter._options.pagesize = that.pagesize;
            }

            var updatefromadapter = function (that) {
                that.originaldata = dataadapter.originaldata;
                that.records = dataadapter.records;
                that.hierarchy = dataadapter.hierarchy;
                if (!that.hierarchy) {
                    that.hierarchy = new Array();
                    dataadapter.hierarchy = new Array();
                }

                if (dataadapter._source.totalrecords) {
                    that.totalrecords = dataadapter._source.totalrecords;
                }
                else if (dataadapter._source.totalRecords) {
                    that.totalrecords = dataadapter._source.totalRecords;
                }
                else {
                    if (that.hierarchy.length !== 0) {
                        that.totalrecords = that.hierarchy.length;
                    }
                    else {
                        that.totalrecords = that.records.length;
                    }
                }

                that.cachedrecords = dataadapter.cachedrecords;
            }

            initadapter(this);

            this.source = source;
            if (objectuniqueId !== undefined) {
                uniqueId = objectuniqueId;
            }

            var that = this;
            switch (source.datatype) {
                case "local":
                case "array":
                default:
                    if (source.localdata == null) {
                        source.localdata = [];
                    }

                    if (source.localdata != null) {
                        dataadapter.unbindBindingUpdate(that.grid.element.id);
                        dataadapter.dataBind();

                        var updateFunc = function () {
                            updatefromadapter(that);
                            that.update();
                        }

                        updateFunc();
                        dataadapter.bindBindingUpdate(that.grid.element.id, updateFunc);
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
                            dataadapter.unbindBindingUpdate(that.grid.element.id);
                            dataadapter.dataBind();
                            var updateFunc = function (changeType) {
                                updatefromadapter(that);
                                that.update();
                            }

                            updateFunc();
                            dataadapter.bindBindingUpdate(that.grid.element.id, updateFunc);
                            return;
                        }

                        var filterdata = {};
                        var filterslength = 0;
                        var postdata = {};
                        for (var x = 0; x < this.filters.length; x++) {
                            var filterdatafield = this.filters[x].datafield;
                            var filter = this.filters[x].filter;
                            var filters = filter.getfilters();
                            postdata[filterdatafield + "operator"] = filter.operator;
                            for (var m = 0; m < filters.length; m++) {
                                filters[m].datafield = filterdatafield;
                                var filtervalue = filters[m].value;
                                postdata["filtervalue" + filterslength] = filtervalue.toString();
                                postdata["filtercondition" + filterslength] = filters[m].condition;
                                postdata["filteroperator" + filterslength] = filters[m].operator;
                                postdata["filterdatafield" + filterslength] = filterdatafield;

                                filterslength++;
                            }
                        }
                        postdata["filterslength"] = filterslength;
                        $.extend(postdata, { sortdatafield: that.sortfield, sortorder: that.sortfielddirection, pagenum: that.pagenum, pagesize: that.grid.pagesize });
                        var tmpdata = dataadapter._options.data;
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
                            var ie = $.jqx.browser.msie && $.jqx.browser.version < 9;
                            var doUpdate = function () {
                                updatefromadapter(that);
                                that.update();
                            }
                            if (ie) {
                                try {
                                    doUpdate();
                                }
                                catch (error) {
                                }
                            }
                            else {
                                doUpdate();
                            }
                        }

                        dataadapter.unbindDownloadComplete(that.grid.element.id);
                        dataadapter.bindDownloadComplete(that.grid.element.id, updateFunc);
                        dataadapter._source.loaderror = function (xhr, status, error) {
                            updateFunc();
                        }

                        dataadapter.dataBind();
                        dataadapter._options.data = tmpdata;
                    }
            }
        }

        this.addfilter = function (field, filter) {
            this._sortData = null;
            this._sortHierarchyData = null;
            var filterindex = -1;
            for (var m = 0; m < this.filters.length; m++) {
                if (this.filters[m].datafield == field) {
                    filterindex = m;
                    break;
                }
            }

            if (filterindex == -1) {
                this.filters[this.filters.length] = { filter: filter, datafield: field };
            }
            else {
                this.filters[filterindex] = { filter: filter, datafield: field };
            }
        }

        this.removefilter = function (field) {
            this._sortData = null;
            this._sortHierarchyData = null;
            for (var i = 0; i < this.filters.length; i++) {
                if (this.filters[i].datafield == field) {
                    this.filters.splice(i, 1);
                    break;
                }
            }
        }

        this.sortby = function (field, ascending) {
            var that = this;
            if (ascending == null) {
                this.sortfield = "";
                this.sortfielddirection = "";
                return;
            }

            if (ascending == undefined) {
                ascending = true;
            }

            if (ascending == 'a' || ascending == 'asc' || ascending == 'ascending' || ascending == true) {
                ascending = true;
            }
            else {
                ascending = false;
            }

            if (field == 'constructor') field = "";
            this.sortfield = field;
            this.sortfielddirection = ascending ? "asc" : "desc";
        }

        this._sort = function (records) {
            if (!this.sortfield || !this.sortfielddirection) {
                return records;
            }

            if (this._sortfield == this.sortfield && this._sortfielddirection == this.sortfielddirection && this._sortData) {
                return this._sortData;
            }

            var that = this;
            var tmpToString = Object.prototype.toString;
            Object.prototype.toString = (typeof that.sortfield == "function") ? that.sortfield : function () { return this[that.sortfield] };
            var datatype = '';

            if (this.source.datafields) {
                $.each(this.source.datafields, function () {
                    if (this.name == that.sortfield) {
                        if (this.type) {
                            datatype = this.type;
                        }
                        return false;
                    }
                });
            }

            var sortData = new Array();

            for (var i = 0; i < records.length; i++) {
                sortData.push($.extend({ originalRecord: records[i] }, records[i]));
            }

            this._sortfield = this.sortfield;
            this._sortfielddirection = this.sortfielddirection;

            if (this.sortfielddirection === "desc") {
                var data = sortData.sort(function (value1, value2) {
                    return that._compare(value1, value2, datatype);
                }).reverse();
            }
            else {
                var data = sortData.sort(function (value1, value2) {
                    return that._compare(value1, value2, datatype);
                });
            }
            this._sortData = data;
            Object.prototype.toString = tmpToString;

            return data;
        }

        this._compare = function (value1, value2, type) {
            var value1 = value1;
            var value2 = value2;
            if (value1 === undefined) { value1 = null; }
            if (value2 === undefined) { value2 = null; }
            if (value1 === null && value2 === null) {
                return 0;
            }
            if (value1 === null && value2 !== null) {
                return 1;
            }
            if (value1 !== null && value2 === null) {
                return 1;
            }

            value1 = value1.toString();
            value2 = value2.toString();

            if ($.jqx.dataFormat) {
                if (type && type != "") {
                    switch (type) {
                        case "number":
                        case "int":
                        case "float":
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        case "date":
                        case "time":
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        case "string":
                        case "text":
                            value1 = String(value1).toLowerCase();
                            value2 = String(value2).toLowerCase();
                            break;
                    }
                }
                else {
                    if ($.jqx.dataFormat.isNumber(value1) && $.jqx.dataFormat.isNumber(value2)) {
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    }
                    else if ($.jqx.dataFormat.isDate(value1) && $.jqx.dataFormat.isDate(value2)) {
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    }
                    else if (!$.jqx.dataFormat.isNumber(value1) && !$.jqx.dataFormat.isNumber(value2)) {
                        value1 = String(value1).toLowerCase();
                        value2 = String(value2).toLowerCase();
                    }
                }
            }
            try {
                if (value1 < value2) { return -1; }
                if (value1 > value2) { return 1; }
            }
            catch (error) {
                var er = error;
            }

            return 0;
        };

        this._equals = function (value1, value2) {
            return (this._compare(value1, value2) === 0);
        }

        this.evaluate = function (rows) {
            if (this.grid.serverProcessing) {
                if (rows) {
                    if (this.grid.source._source.id == "" || this.grid.source._source.id == null) {
                        if (this.grid.pageable) {
                            var start = this.grid.pagesize * this.pagenum;
                            $.each(rows, function (index) {
                                this.uid = start++;
                            });
                        }
                    }
                }

                return rows;
            }
            var records = new Array();
            if (this.filters.length) {
                var uniqueRecords = new Array();
                var getRecords = function (records, filtered) {
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        record._visible = true;

                        // The filter is applied to parents first and to children only if parent fulfils the condition.
                        var filterresult = undefined;
                        for (var j = 0; j < this.filters.length; j++) {
                            var filter = this.filters[j].filter;
                            var value = record[this.filters[j].datafield];
                            var result = filter.evaluate(value);

                            if (filterresult == undefined) {
                                filterresult = result;
                            }
                            else {
                                if (filter.operator == 'or') {
                                    filterresult = filterresult || result;
                                }
                                else {
                                    filterresult = filterresult && result;
                                }
                            }
                        }
                        record._visible = false;
                        if (filterresult || record.aggregate) {
                            record._visible = true;
                            filtered.push(record);
                            uniqueRecords[record.uid] = record;
                        }
                    }
                };
                if (!this._filteredData) {
                    if (this.source.hierarchy || (this.grid.source.hierarchy && this.grid.source.hierarchy.length > 0)) {
                        var flatList = new Array();
                        var getAsFlatList = function (parent, rows) {
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                flatList.push(row);
                                if (row.records && row.records.length > 0) {
                                    getAsFlatList(row, row.records);
                                }
                            }
                        }
                        getAsFlatList(null, rows);
                        getRecords.call(this, flatList, records);
                        for (var i = 0; i < records.length; i++) {
                            var record = records[i];

                            while (record.parent) {
                                var parent = record.parent;
                                if (!uniqueRecords[parent.uid]) {
                                    parent._visible = true;
                                    uniqueRecords[parent.uid] = parent;
                                }
                                record = parent;
                            }
                        }

                        records = rows;
                    }
                    else {
                        getRecords.call(this, rows, records);
                    }
                    this._filteredData = records;
                    this.rows = records;
                }
                else {
                    this.rows = this._filteredData;
                }
            }
            else {
                this.rows = rows;
            }

            if (this.source.hierarchy || (this.grid.source.hierarchy && this.grid.source.hierarchy.length > 0)) {
                var that = this;
                var hierarchy = new Array();
                this._sortData = null;
                var hierarchicalSort = function (element, records) {
                    that._sortData = null;

                    var sortedRecords = null;
                    if (that.source.hierarchy.groupingDataFields) {
                        if (records && records.length > 0 && records[0].level < that.source.hierarchy.groupingDataFields.length) {
                            sortedRecords = new Array();
                            for (var i = 0; i < records.length; i++) {
                                sortedRecords.push($.extend({ originalRecord: records[i] }, records[i]));
                            }
                        }
                        else {
                            sortedRecords = that._sort(records);
                        }
                    }
                    else {
                         sortedRecords = that._sort(records);
                    }
                    if (element.records) {
                        element.records = sortedRecords;
                    }
                    else {
                        element = element.concat(sortedRecords);
                    }
                    for (var i = 0; i < sortedRecords.length; i++) {
                        if (sortedRecords[i].records && sortedRecords[i].records.length) {
                            hierarchicalSort(sortedRecords[i], sortedRecords[i].records);
                        }
                    }
                    return element;
                }

                if (this.sortfield || this.sortfielddirection) {
                    if (this._sortHierarchyData) {
                        hierarchy = this._sortHierarchyData;
                    }
                    else {
                        hierarchy = hierarchicalSort(hierarchy, rows);
                    }
                    this.rows = hierarchy;
                    this._sortHierarchyData = hierarchy;
                }
            }
            else {
                this.rows = this._sort(this.rows);
            }
            return this.rows;
        }

        this.getid = function (id, record, index) {
            if ($(id, record).length > 0) {
                return $(id, record).text();
            }
            if (this.rows && id != "" && id != undefined && this.rows.length > 0) {
                var lastID = this.rows[this.rows.length - 1][id];
                if (lastID == null) lastID = null;
                for (var i = 1; i <= 100; i++) {
                    var hasID = this.grid.rowsByKey[i + lastID];
                    if (!hasID) {
                        return lastID + i;
                    }
                }
            }

            if (id) {
                if (id.toString().length > 0) {
                    var result = $(record).attr(id);
                    if (result != null && result.toString().length > 0) {
                        return result;
                    }
                }
            }

            return index;
        }

        this.generatekey = function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10) | 0);
            };
            return ("" + S4() + S4() + "-" + S4() + "-" + S4());
        }

        return this;
    }
})(jQuery);