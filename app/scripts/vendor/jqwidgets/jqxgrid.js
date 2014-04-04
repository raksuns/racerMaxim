/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxGrid", "", {});

    $.extend($.jqx._jqxGrid.prototype, {
        defineInstance: function () {
            // enables or disables the grid.
            this.disabled = false;
            // sets the width.
            this.width = 600;
            // sets the height.
            this.height = 400;
            // sets the pager's height.
            this.pagerheight = 28;
            // sets the group header's height.
            this.groupsheaderheight = 34;
            // sets the default page size.
            this.pagesize = 10;
            // sets the available page sizes.
            this.pagesizeoptions = ['5', '10', '20'];
            // sets the rows height.
            this.rowsheight = 25;
            // sets the columns height.
            this.columnsheight = 25;
            // sets the columns height.
            this.filterrowheight = 31;
            // sets the group indent size. This size is used when the grid is grouped.
            this.groupindentwidth = 30;
            // enables or disables row details.
            this.rowdetails = false;
            // indents the row's details with the sum of the grouping columns and row details column indents.
            this.enablerowdetailsindent = true;
            // enables or disables the built-in mouse-wheel behavior.
            this.enablemousewheel = true;
            // renders the row details.
            this.initrowdetails = null;
            // updates the row details layout.
            this.layoutrowdetails = null;
            // enables or disables editing.
            this.editable = false;
            // sets the edit mode. - click, dblclick, selectedcell, selectedrow or programmatic.
            this.editmode = 'selectedcell';
            // enables or disables paging.
            this.pageable = false;
            this.pagermode = "default";
            this.pagerbuttonscount = 5;
            // enables or disables grouping.
            this.groupable = false;
            // enables or disables sorting.
            this.sortable = false;
            // enables or disables filtering.
            this.filterable = false;
            this.filtermode = "default";
            // displays the filter icon only when the column is filtered.
            this.autoshowfiltericon = true;
            // displays a background for the filtered column.
            this.showfiltercolumnbackground = true;
            // displays a background for the pinned column.
            this.showpinnedcolumnbackground = true;
            // displays a background for the sort column.
            this.showsortcolumnbackground = true;
            // enables or disables alternating rows.
            this.altrows = false;
            // sets the alternating rows start.
            this.altstart = 1;
            // sets the alternating rows step.
            this.altstep = 1;
            // shows or hides the details column.
            this.showrowdetailscolumn = true;
            // shows or hides the grid's toolbar.
            this.showtoolbar = false;
            this.toolbarheight = 34;
            this.showstatusbar = false;
            this.statusbarheight = 34;
            this.enableellipsis = true;
            // adds groups.
            this.groups = [];
            // custom groups renderer.
            this.groupsrenderer = null;
            // custom renderer for the grouping columns displayed in the grouping header.
            this.groupcolumnrenderer = null;
            // groups default expand state.
            this.groupsexpandedbydefault = false;
            // sets the pager renderer.
            this.pagerrenderer = null;
            this.touchmode = 'auto';
            // sets the grid columns.
            this.columns = [];
            // selected row index.
            this.selectedrowindex = -1;
            this.selectedrowindexes = new Array();
            this.selectedcells = new Array();
            this.selectedcell = null;
            this.tableZIndex = 799;
            this.headerZIndex = 199;
            this.updatefilterconditions = null;
            this.showaggregates = false;
            this.showfilterrow = false;
            this.autorowheight = false;
            this.autokoupdates = true;
            this.handlekeyboardnavigation = null;
            this.showsortmenuitems = true;
            this.showfiltermenuitems = true;
            this.showgroupmenuitems = true;
            this.enablebrowserselection = false;
            this.enablekeyboarddelete = true;
            this.clipboard = true;
            this.ready = null;
            this.updatefilterpanel = null;
            this.autogeneratecolumns = false;
            this.rowdetailstemplate = null;
            this.scrollfeedback = null;
            this.rendertoolbar = null;
            this.renderstatusbar = null;
            this.rendered = null;
            this.multipleselectionbegins = null;
            this.columngroups = null;
            this.cellhover = null;
            // sets the grid source.
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
            // sets the grid data view.
            this.dataview = null;
            // sets the rendering delay. 
            this.updatedelay = 0;
            // sets the auto height option. This option is appropriate when the grid's paging is enables or when the grid has quite a few rows.
            this.autoheight = false;
            this.autowidth = false;
            // shows or hides the grid's columns header.
            this.showheader = true;
            // shows or hides the grid's grouping header.
            this.showgroupsheader = true;
            // enables or disables the grouping closing buttons.
            this.closeablegroups = true;
            // sets the scrollbars size.
            this.scrollbarsize = $.jqx.utilities.scrollBarSize;
            this.touchscrollbarsize = $.jqx.utilities.touchScrollBarSize;
            // enables or disables the virtual scrolling.
            this.virtualmode = false;
            // sets a custom sorting behavior.
            this.sort = null;
            // displays a dropdown button in each column.
            this.columnsmenu = true;
            // enables the resizing of grid columns.
            this.columnsresize = false;
            this.columnsreorder = false;
            // sets the width of the columns menu in each column.
            this.columnsmenuwidth = 15;
            this.autoshowcolumnsmenubutton = true;
            this.popupwidth = 'auto';
            // changes the sort state when the user clickes a column header.
            // 0 - disables toggling.
            // 1 - enables togging. Click on a column toggles the sort direction.
            // 2 - enables remove sorting option.
            this.sorttogglestates = 2;
            // callback function invoked when the rows are rendered.
            this.rendergridrows = null;
            // enables or disables the grid animations - slide and fade effects.
            this.enableanimations = true;
            // enables or disables the grid tooltips.
            this.enabletooltips = false;
            // enables or disables the selection.
            // possible values: 'none', 'singlerow', 'multiplerows, 'multiplerowsextended, 'singlecell, 'multiplecells, 'multiplecellsextended', 'multiplecellsadvanced'
            this.selectionmode = 'singlerow';
            // enables or disables the rows hover state.
            this.enablehover = true;
            // this message is displayed when the user tries to call a method before the binding complete.
            this.loadingerrormessage = "The data is still loading. When the data binding is completed, the Grid raises the 'bindingcomplete' event. Call this function in the 'bindingcomplete' event handler.";
            // vertical scroll step.
            this.verticalscrollbarstep = 25;
            // vertical large step.
            this.verticalscrollbarlargestep = 400;
            // horizontal step.
            this.horizontalscrollbarstep = 10;
            // horizontal large step.
            this.horizontalscrollbarlargestep = 50;
            this.keyboardnavigation = true;
            this.touchModeStyle = 'auto';
            this.autoshowloadelement = true;
            this.showdefaultloadelement = true;
            this.showemptyrow = true;
            this.autosavestate = false;
            this.autoloadstate = false;
            // private members
            this._updating = false;
            this._pagescache = new Array();
            this._pageviews = new Array();
            this._cellscache = new Array();
            this._rowdetailscache = new Array();
            this._rowdetailselementscache = new Array();
            this._requiresupdate = false;
            this._hasOpenedMenu = false;
            this.scrollmode = 'physical';
            this.deferreddatafields = null;
            this.localization = null;
            this.rtl = false;
            this.menuitemsarray = [];
            this.events =
	   	    [
            /*0*/'initialized',
            /*1*/'rowClick',
            /*2*/'rowSelect',
            /*3*/'rowUnselect',
            /*4*/'groupExpand',
            /*5*/'groupCollapse',
            /*6*/'sort',
            /*7*/'columnClick',
            /*8*/'cellClick',
            /*9*/'pageChanged',
            /*10*/'pageSizeChanged',
            /*11*/'bindingComplete',
            /*12*/'groupsChanged',
            /*13*/'filter',
            /*14*/'columnResized',
            /*15*/'cellSelect',
            /*16*/'cellUnselect',
            /*17*/'cellBeginEdit',
            /*18*/'cellEndEdit',
            /*19*/'cellValueChanged',
            /*20*/'rowExpand',
            /*21*/'rowCollapse',
            /*22*/'rowDoubleClick',
            /*23*/'cellDoubleClick',
            /*24*/'columnReordered',
            /*25*/'pageChanging',
		    /*26*/'columnReorderCompleted',
			/*27*/'rowsRendered'
	   	    ];
        },

        createInstance: function (args) {
            this.that = this;
            var gridStructure = "<div class='jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative'>" +
                "<div class='jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset' id='wrapper" + this.element.id + "'>" +
                "<div class='jqx-clear jqx-position-absolute' id='toolbar' style='visibility: hidden;'></div>" +
                "<div class='jqx-clear jqx-position-absolute' id='groupsheader' style='visibility: hidden;'></div>" +
                "<div class='jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset' id='content" + this.element.id + "'></div>" +
                "<div class='jqx-clear jqx-position-absolute' id='verticalScrollBar" + this.element.id + "'></div>" +
                "<div class='jqx-clear jqx-position-absolute' id='horizontalScrollBar" + this.element.id + "'></div>" +
                "<div class='jqx-clear jqx-position-absolute jqx-border-reset' id='bottomRight'></div>" +
                "<div class='jqx-clear jqx-position-absolute' id='statusbar'></div>" +
                "<div class='jqx-clear jqx-position-absolute' id='pager' style='z-index: 20;'></div>" +
                "</div>" +
                "</div>";

            this.element.innerText = '';
            this.element.innerHTML = '';
            if ($.jqx.utilities.scrollBarSize != 15) {
                this.scrollbarsize = $.jqx.utilities.scrollBarSize;
            }
            if (this.source) {
                if (!this.source.dataBind) {
                    this.source = new $.jqx.dataAdapter(this.source);
                }
                var datafields = this.source._source.datafields;
                if (datafields && datafields.length > 0) {
                    this._camelCase = this.source._source.dataFields !== undefined;
                    this.editmode = this.editmode.toLowerCase();
                    this.selectionmode = this.selectionmode.toLowerCase();
                }
            }

            this.host.attr('role', 'grid');
            this.host.attr('align', 'left');
            //    this.host.append(gridStructure);
            this.element.innerHTML = gridStructure;
            this.host.addClass(this.toTP('jqx-grid'));
            this.host.addClass(this.toTP('jqx-reset'));
            this.host.addClass(this.toTP('jqx-rc-all'));
            this.host.addClass(this.toTP('jqx-widget'));
            this.host.addClass(this.toTP('jqx-widget-content'));

            this.wrapper = this.host.find("#wrapper" + this.element.id);
            this.content = this.host.find("#content" + this.element.id);
            this.content.addClass(this.toTP('jqx-reset'));

            var verticalScrollBar = this.host.find("#verticalScrollBar" + this.element.id);
            var horizontalScrollBar = this.host.find("#horizontalScrollBar" + this.element.id);
            this.bottomRight = this.host.find("#bottomRight").addClass(this.toTP('jqx-grid-bottomright')).addClass(this.toTP('jqx-scrollbar-state-normal'));

            if (!verticalScrollBar.jqxScrollBar) {
                throw new Error('jqxGrid: Missing reference to jqxscrollbar.js');
                return;
            }

            this.editors = new Array();

            this.vScrollBar = verticalScrollBar.jqxScrollBar({ 'vertical': true, rtl: this.rtl, touchMode: this.touchmode, step: this.verticalscrollbarstep, largestep: this.verticalscrollbarlargestep, theme: this.theme, _triggervaluechanged: false });
            this.hScrollBar = horizontalScrollBar.jqxScrollBar({ 'vertical': false, rtl: this.rtl, touchMode: this.touchmode, step: this.horizontalscrollbarstep, largestep: this.horizontalscrollbarlargestep, theme: this.theme, _triggervaluechanged: false });

            this.pager = this.host.find("#pager");
            this.pager[0].id = "pager" + this.element.id;
            this.toolbar = this.host.find("#toolbar");
            this.toolbar[0].id = "toolbar" + this.element.id;
            this.toolbar.addClass(this.toTP('jqx-grid-toolbar'));
            this.toolbar.addClass(this.toTP('jqx-widget-header'));

            this.statusbar = this.host.find("#statusbar");
            this.statusbar[0].id = "statusbar" + this.element.id;
            this.statusbar.addClass(this.toTP('jqx-grid-statusbar'));
            this.statusbar.addClass(this.toTP('jqx-widget-header'));

            this.pager.addClass(this.toTP('jqx-grid-pager'));
            this.pager.addClass(this.toTP('jqx-widget-header'));

            this.groupsheader = this.host.find("#groupsheader");
            this.groupsheader.addClass(this.toTP('jqx-grid-groups-header'));
            this.groupsheader.addClass(this.toTP('jqx-widget-header'));

            this.vScrollBar.css('visibility', 'hidden');
            this.hScrollBar.css('visibility', 'hidden');

            this.vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            this.hScrollInstance = $.data(this.hScrollBar[0], 'jqxScrollBar').instance;
            this.gridtable = null;

            this.isNestedGrid = this.host.parent() ? this.host.parent().css('z-index') == 2000 : false;
            this.touchdevice = this.isTouchDevice();

            if (this.localizestrings) {
                this.localizestrings();
                if (this.localization != null) {
                    this.localizestrings(this.localization, false);
                }
            }
         
            if (this.rowdetailstemplate) {
                if (undefined == this.rowdetailstemplate.rowdetails) this.rowdetailstemplate.rowdetails = '<div></div>';
                if (undefined == this.rowdetailstemplate.rowdetailsheight) this.rowdetailstemplate.rowdetailsheight = 200;
                if (undefined == this.rowdetailstemplate.rowdetailshidden) this.rowdetailstemplate.rowdetailshidden = true;
            }

            if (this.showfilterrow && !this.filterable) {
                throw new Error('jqxGrid: "showfilterrow" requires setting the "filterable" property to true!');
                this.host.remove();
                return;
            }
            if (this.autorowheight && !this.autoheight && !this.pageable) {
                throw new Error('jqxGrid: "autorowheight" requires setting the "autoheight" or "pageable" property to true!');
                this.host.remove();
                return;
            }
            if (this.virtualmode && this.rendergridrows == null) {
                throw new Error('jqxGrid: "virtualmode" requires setting the "rendergridrows"!');
                this.host.remove();
                return;
            }

            if (this.virtualmode && !this.pageable && this.groupable) {
                throw new Error('jqxGrid: "grouping" in "virtualmode" without paging is not supported!');
                this.host.remove();
                return;
            }

            // check for missing modules.
            if (this._testmodules()) {
                return;
            }

            this._builddataloadelement();
            this._cachedcolumns = this.columns;
            if (this.rowsheight != 25) {
                this._measureElement('cell');
            }
            if (this.columnsheight != 25 || this.columngroups) {
                this._measureElement('column');
            }

            if (this.source) {
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
            }

            this.databind(this.source);

            if (this.showtoolbar) {
                this.toolbar.css('visibility', 'visible');
            }
            if (this.showstatusbar) {
                this.statusbar.css('visibility', 'visible');
            }
      
            this._arrange();
            if (this.pageable && this._initpager) {
                this._initpager();
            }
            this.tableheight = null;
            var me = this.that;
            var clearoffset = function () {
                if (me.content) {
                    me.content[0].scrollTop = 0;
                    me.content[0].scrollLeft = 0;
                }
                if (me.gridcontent) {
                    me.gridcontent[0].scrollLeft = 0;
                    me.gridcontent[0].scrollTop = 0;
                }
            }

            this.addHandler(this.content, 'mousedown',
            function () {
                clearoffset();
            });

            this.addHandler(this.content, 'scroll',
            function (event) {
                clearoffset();
                return false;
            });

            if (!this.showfilterrow) {
                if (!this.showstatusbar && !this.showtoolbar) {
                    this.host.addClass('jqx-disableselect');
                }
                this.content.addClass('jqx-disableselect');
            }

            if (this.enablebrowserselection) {
                this.content.removeClass('jqx-disableselect');
                this.host.removeClass('jqx-disableselect');
            }

            this._resizeWindow();

            if (this.renderstatusbar) {
                this.renderstatusbar(this.statusbar);
            }
            if (this.rendertoolbar) {
                this.rendertoolbar(this.toolbar);
            }
            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            this.hasTransform = $.jqx.utilities.hasTransform(this.host);
            if (this.scrollmode == 'logical') {
                this.vScrollInstance.thumbStep = this.rowsheight;
                this.vScrollInstance.step = this.rowsheight;
            }
            if (!$.jqx.isHidden(this.host)) {
                if (this.filterable || this.groupable || this.sortable) {
                    this._initmenu();
                }
            }
        },

        _resizeWindow: function()
        {
            var me = this.that;
            if ((this.width != null && this.width.toString().indexOf('%') != -1) || (this.height != null && this.height.toString().indexOf('%') != -1)) {
                this._updatesizeonwindowresize = true;
                $.jqx.utilities.resize(this.host, function (type) {
                    var width = $(window).width();
                    var height = $(window).height();
                    var hostwidth = me.host.width();
                    var hostheight = me.host.height();

                    if (me.autoheight) me._lastHostWidth = height;
                    if (me._lastHostWidth != hostwidth || me._lastHostHeight != hostheight) {
                        if (me.touchdevice && me.editcell && type !== "orientationchange")
                            return;

	                    // splitter size 변경으로 호출된다. - ysjung
                        me._updatesize(me._lastHostWidth != hostwidth, me._lastHostHeight != hostheight, true);
                    }

                    me._lastWidth = width;
                    me._lastHeight = height;
                    me._lastHostWidth = hostwidth;
                    me._lastHostHeight = hostheight;
                });
            }
        },

        _builddataloadelement: function () {
            if (this.dataloadelement) {
                this.dataloadelement.remove();
            }

            this.dataloadelement = $('<div style="overflow: hidden; position: absolute;"></div>');
            if (this.showdefaultloadelement) {
                var table = $('<div style="z-index: 99999; margin-left: -66px; left: 50%; top: 50%; margin-top: -24px; position: relative; width: 100px; height: 33px; padding: 5px; font-family: verdana; font-size: 12px; color: #767676; border-color: #898989; border-width: 1px; border-style: solid; background: #f6f6f6; border-collapse: collapse;"><div style="float: left;"><div style="float: left; overflow: hidden; width: 32px; height: 32px;" class="jqx-grid-load"/><span style="margin-top: 10px; float: left; display: block; margin-left: 5px;" >' + this.gridlocalization.loadtext + '</span></div></div>');
                table.addClass(this.toTP('jqx-rc-all'));
                this.dataloadelement.addClass(this.toTP('jqx-rc-all'));
                table.addClass(this.toTP('jqx-fill-state-normal'));
                this.dataloadelement.append(table);
            }
            else {
                this.dataloadelement.addClass(this.toTP('jqx-grid-load'));
            }
            this.dataloadelement.width(this.width);
            this.dataloadelement.height(this.height);

            this.host.prepend(this.dataloadelement);
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

        _measureMenuElement: function () {
            var span = $("<span style='visibility: hidden; white-space: nowrap;'>measure Text</span>");
            span.addClass(this.toTP('jqx-widget'));
            span.addClass(this.toTP('jqx-menu'));
            span.addClass(this.toTP('jqx-menu-item-top'));
            span.addClass(this.toTP('jqx-fill-state-normal'));
            $(document.body).append(span);
            var height = span.outerHeight();
            span.remove();
            return height;
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

        _testmodules: function () {
            var missingModules = "";
            var me = this.that;
            var addComma = function () {
                if (missingModules.length != "") missingModules += ",";
            }

            if (this.columnsmenu && !this.host.jqxMenu && (this.sortable || this.groupable || this.filterable)) {
                addComma();
                missingModules += " jqxmenu.js";
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
            if (this.pageable && !this.gotopage) {
                addComma();
                missingModules += "jqxgrid.pager.js";
            }
            if (this.filterable && !this.applyfilters) {
                addComma();
                missingModules += " jqxgrid.filter.js";
            }
            if (this.groupable && !this._initgroupsheader) {
                addComma();
                missingModules += " jqxgrid.grouping.js";
            }
            if (this.columnsresize && !this.autoresizecolumns) {
                addComma();
                missingModules += " jqxgrid.columnsresize.js";
            }
            if (this.columnsreorder && !this.setcolumnindex) {
                addComma();
                missingModules += " jqxgrid.columnsreorder.js";
            }
            if (this.sortable && !this.sortby) {
                addComma();
                missingModules += " jqxgrid.sort.js";
            }
            if (this.editable && !this.begincelledit) {
                addComma();
                missingModules += " jqxgrid.edit.js";
            }
            if (this.showaggregates && !this.getcolumnaggregateddata) {
                addComma();
                missingModules += " jqxgrid.aggregates.js";
            }
            if (this.keyboardnavigation && !this.selectrow) {
                addComma();
                missingModules += " jqxgrid.selection.js";
            }
            if (missingModules != "" || this.editable || this.filterable || this.pageable) {
                var missingTypes = [];

                var addMissing = function (type) {
                    switch (type) {
                        case "checkbox":
                            if (!me.host.jqxCheckBox && !missingTypes['checkbox']) {
                                missingTypes['checkbox'] = true;
                                addComma();
                                missingModules += ' jqxcheckbox.js';
                            }
                            break;
                        case "numberinput":
                            if (!me.host.jqxNumberInput && !missingTypes['numberinput']) {
                                missingTypes['numberinput'] = true;
                                addComma();
                                missingModules += ' jqxnumberinput.js';
                            }
                            break;
                        case "datetimeinput":
                            if (!me.host.jqxDateTimeInput && !missingTypes['datetimeinput']) {
                                addComma();
                                missingTypes['datetimeinput'] = true;
                                missingModules += ' jqxdatetimeinput.js(requires: jqxcalendar.js)';
                            }
                            else if (!me.host.jqxCalendar && !missingTypes['calendar']) {
                                addComma();
                                missingModules += ' jqxcalendar.js';
                            }
                            break;
                        case "combobox":
                            if (!me.host.jqxComboBox && !missingTypes['combobox']) {
                                addComma();
                                missingTypes['combobox'] = true;
                                missingModules += ' jqxcombobox.js(requires: jqxlistbox.js)';
                            }
                            else if (!me.host.jqxListBox && !missingTypes['listbox']) {
                                addComma();
                                missingTypes['listbox'] = true;
                                missingModules += ' jqxlistbox.js';
                            }
                            break;
                        case "dropdownlist":
                            if (!me.host.jqxDropDownList && !missingTypes['dropdownlist']) {
                                addComma();
                                missingTypes['dropdownlist'] = true;
                                missingModules += ' jqxdropdownlist.js(requires: jqxlistbox.js)';
                            }
                            else if (!me.host.jqxListBox && !missingTypes['listbox']) {
                                addComma();
                                missingTypes['listbox'] = true;
                                missingModules += ' jqxlistbox.js';
                            }
                            break;
                    }
                }

                if (this.filterable || this.pageable) {
                    addMissing('dropdownlist');
                }

                for (var i = 0; i < this.columns.length; i++) {
                    if (this.columns[i] == undefined)
                        continue;

                    var type = this.columns[i].columntype;
                    addMissing(type);
                    if (this.filterable && this.showfilterrow) {
                        var type = this.columns[i].filtertype;
                        if (type == 'checkedlist' || type == 'bool') {
                            addMissing('checkbox');
                        }
                        if (type == 'date') {
                            addMissing('datetimeinput');
                        }
                    }
                }
                if (missingModules != "") {
                    throw new Error("jqxGrid: Missing references to the following module(s): " + missingModules);
                    this.host.remove();
                    return true;
                }
            }
            return false;
        },

        focus: function () {
            try
            {
                this.wrapper.focus();
				
				// 포커스가 재수없게 body에 있는 경우가 있음. 이 때는 div element인 wrapper로 focus이동 안됨. jqxgrid 버그임.
				// 일단 input으로 넘기니까 동작이 됨. - ysjung(2014/03/17)
				this.wrapper.find("input[type=button]").eq(0).focus();
				
                var me = this.that;
                setTimeout(function () {
                    me.wrapper.focus();
					me.wrapper.find("input[type=button]").eq(0).focus();
                }, 25);
                this.focused = true;
            }
            catch (error) {
            }
        },

        hiddenParent: function () {
            return $.jqx.isHidden(this.host);
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._updatesize(true, true);
        },

        _updatesize: function (updateWidth, updateHeight, skip) {
            if (this._loading) {
                return;
            }

            var me = this.that;

            me._newmax = null;

            var hostWidth = me.host.width();
            var hostHeight = me.host.height();

            if (!me._oldWidth) {
                me._oldWidth = hostWidth;
            }

            if (!me._oldHeight) {
                me._oldHeight = hostHeight;
            }

            if (me._resizeTimer) {
                clearTimeout(me._resizeTimer);
            }

            var delay = 5;

            me._resizeTimer = setTimeout(function () {
                me.resizingGrid = true;
                if ($.jqx.isHidden(me.host))
                    return;

                if (hostHeight != me._oldHeight || updateHeight == true) {
                    var hasgroups = me.groupable && me.groups.length > 0;
                    var isVScrollHidden = me.vScrollBar.css('visibility');

                    if (!me.autoheight) {
                        if (me.virtualmode) {
                            me._pageviews = new Array();
                        }
                        if (!hasgroups && !me.rowdetails && !me.pageable) {
                            me._arrange();
                            me.virtualsizeinfo = me._calculatevirtualheight();
                            var hostHeight = Math.round(me.host.height()) + 2 * me.rowsheight;
                            if (parseInt(hostHeight) >= parseInt(me._oldHeight)) {
                                me.prerenderrequired = true;
                            }
	                        // renderrows를 최대한 적게 하기 위해 ysjung(2014/04/03)
	                        if(skip !== true) {
                                me._renderrows(me.virtualsizeinfo);
	                        }
                        }
                        else {
                            me._arrange();
                            me.prerenderrequired = true;
                            var hostHeight = Math.round(me.host.height()) + 2 * me.rowsheight;
                            realheight = me._gettableheight();
                            var visiblerecords = Math.round(hostHeight / me.rowsheight);
                            var totalrows = Math.max(me.dataview.totalrows, me.dataview.totalrecords);
                            if (me.pageable) {
                                totalrows = me.pagesize;
                                if (me.pagesize > Math.max(me.dataview.totalrows, me.dataview.totalrecords) && me.autoheight) {
                                    totalrows = Math.max(me.dataview.totalrows, me.dataview.totalrecords);
                                }
                                else if (!me.autoheight) {
                                    if (me.dataview.totalrows < me.pagesize) {
                                        totalrows = Math.max(me.dataview.totalrows, me.dataview.totalrecords);
                                    }
                                }
                            }

                            var virtualheight = totalrows * me.rowsheight;
                            var pagesize = me._getpagesize();
                            if (!me.pageable && me.autoheight) {
                                visiblerecords = totalrows;
                            }
                            if (me.virtualsizeinfo) {
                                me.virtualsizeinfo.visiblerecords = visiblerecords;
                            }
                            me.rendergridcontent(true, false);

	                        // renderrows를 최대한 적게 하기 위해 ysjung(2014/04/03)
	                        if(skip !== true) {
		                        me._renderrows(me.virtualsizeinfo);
	                        }
                        }

                        if (isVScrollHidden != me.vScrollBar.css('visibility')) {
                            me.vScrollInstance.setPosition(0);
                            me._arrange();
                            me._updatecolumnwidths();
                            if (me.table) {
                                me.table.width(me.columnsheader.width());
                            }
                            me._updatecellwidths();
                        }
                    }
                }

                if (hostWidth != me._oldWidth || updateWidth == true) {
                    var openedEditor = false;
                    if (me.editcell && me.editcell.editor) {
                        switch (me.editcell.columntype) {
                            case "dropdownlist":
                                openedEditor = me.editcell.editor.jqxDropDownList('isOpened') || (me.editcell.editor.jqxDropDownList('isanimating') && !me.editcell.editor.jqxDropDownList('ishiding'));
                                if (openedEditor) {
                                    me.editcell.editor.jqxDropDownList({ openDelay: 0 });
                                    me.editcell.editor.jqxDropDownList('open');
                                    me.editcell.editor.jqxDropDownList({ openDelay: 250 });
                                    return;
                                }
                                break;
                            case "combobox":
                                openedEditor = me.editcell.editor.jqxComboBox('isOpened') || (me.editcell.editor.jqxComboBox('isanimating') && !me.editcell.editor.jqxComboBox('ishiding'));
                                if (openedEditor) {
                                    me.editcell.editor.jqxComboBox({ openDelay: 0 });
                                    me.editcell.editor.jqxComboBox('open');
                                    me.editcell.editor.jqxComboBox({ openDelay: 250 });
                                    return;
                                }
                            break;
                            case "datetimeinput":
                                if (openedEditor) {
                                    openedEditor = me.editcell.editor.jqxDateTimeInput('isOpened') || (me.editcell.editor.jqxDateTimeInput('isanimating') && !me.editcell.editor.jqxDateTimeInput('ishiding'));
                                    me.editcell.editor.jqxDateTimeInput({ openDelay: 0 });
                                    me.editcell.editor.jqxDateTimeInput('open');
                                    me.editcell.editor.jqxDateTimeInput({ openDelay: 250 });
                                    return;
                                }
                            break;
                        }
                    }

                    var isHScrollHidden = me.hScrollBar.css('visibility');
                    me._arrange();
                    me._updatecolumnwidths();
                    if (me.table) {
                        me.table.width(me.columnsheader.width());
                    }
                    me._updatecellwidths();
                    if (!(updateWidth == false && me._oldWidth > hostWidth)) {
                        if (!updateHeight || me.dataview.rows.length == 0) {
	                        // renderrows를 최대한 적게 하기 위해 ysjung(2014/04/03)
	                        if(skip !== true) {
		                        me._renderrows(me.virtualsizeinfo);
	                        }
                        }
                    }
                    if (isHScrollHidden != me.hScrollBar.css('visibility')) {
                        me.hScrollInstance.setPosition(0);
                    }                  
                }
                me._oldWidth = hostWidth;
                me._oldHeight = hostHeight;
                me.resizingGrid = false;
            }, delay);
        },

        getTouches: function (e) {
            return $.jqx.mobile.getTouches(e);
        },

        _updateTouchScrolling: function () {
            var me = this.that;
            if (me.isTouchDevice()) {
                me.scrollmode = 'logical';
                me.vScrollInstance.thumbStep = me.rowsheight
                var touchstart = $.jqx.mobile.getTouchEventName('touchstart');
                var touchend = $.jqx.mobile.getTouchEventName('touchend');
                var touchmove = $.jqx.mobile.getTouchEventName('touchmove');

                me.enablehover = false;
                if (me.gridcontent) {
                    me.removeHandler(me.gridcontent, touchstart + '.touchScroll');
                    me.removeHandler(me.gridcontent, touchmove + '.touchScroll');
                    me.removeHandler(me.gridcontent, touchend + '.touchScroll');
                    me.removeHandler(me.gridcontent, 'touchcancel.touchScroll');

                    $.jqx.mobile.touchScroll(me.gridcontent[0], me.vScrollInstance.max, function (left, top) {
                        if (me.vScrollBar.css('visibility') == 'visible') {
                            var oldValue = me.vScrollInstance.value;
                            me.vScrollInstance.setPosition(oldValue + top);
                        }
                        if (me.hScrollBar.css('visibility') == 'visible') {
                            var oldValue = me.hScrollInstance.value;
                            me.hScrollInstance.setPosition(oldValue + left);
                        }
                        me.vScrollInstance.thumbCapture = true;

                        me._lastScroll = new Date();
                    }, this.element.id, this.hScrollBar, this.vScrollBar);
                    if (me._overlayElement) {
                        me.removeHandler(me._overlayElement, touchstart + '.touchScroll');
                        me.removeHandler(me._overlayElement, touchmove + '.touchScroll');
                        me.removeHandler(me._overlayElement, touchend + '.touchScroll');
                        me.removeHandler(me._overlayElement, 'touchcancel.touchScroll');

                        $.jqx.mobile.touchScroll(me._overlayElement[0], me.vScrollInstance.max, function (left, top) {
                            if (me.vScrollBar.css('visibility') == 'visible') {
                                var oldValue = me.vScrollInstance.value;
                                me.vScrollInstance.setPosition(oldValue + top);
                            }
                            if (me.hScrollBar.css('visibility') == 'visible') {
                                var oldValue = me.hScrollInstance.value;
                                me.hScrollInstance.setPosition(oldValue + left);
                            }
                            me.vScrollInstance.thumbCapture = true;

                            me._lastScroll = new Date();
                        }, this.element.id, this.hScrollBar, this.vScrollBar);
                        this.addHandler(this.host, touchstart, function () {
                            if (!me.editcell)
                                me._overlayElement.css('visibility', 'visible');
                            else {
                                me._overlayElement.css('visibility', 'hidden');
                            }
                        });
                        this.addHandler(this.host, touchend, function () {
                            if (!me.editcell)
                                me._overlayElement.css('visibility', 'visible');
                            else {
                                me._overlayElement.css('visibility', 'hidden');
                            }
                        });
                    }
                }
            }
        },

        isTouchDevice: function () {
            if (this.touchDevice != undefined)
                return this.touchDevice;

            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            this.touchDevice = isTouchDevice;
            if (this.touchmode == true) {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    this.enablehover = false;
                    return false;
                }

                isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.element);
                this.touchDevice = isTouchDevice;
            }
            else if (this.touchmode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice && this.touchModeStyle != false) {
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
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
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
                if (localizationobj.groupsheaderstring) {
                    this.gridlocalization.groupsheaderstring = localizationobj.groupsheaderstring;
                }
                if (localizationobj.sortascendingstring) {
                    this.gridlocalization.sortascendingstring = localizationobj.sortascendingstring;
                }
                if (localizationobj.sortdescendingstring) {
                    this.gridlocalization.sortdescendingstring = localizationobj.sortdescendingstring;
                }
                if (localizationobj.sortremovestring) {
                    this.gridlocalization.sortremovestring = localizationobj.sortremovestring;
                }
                if (localizationobj.groupbystring) {
                    this.gridlocalization.groupbystring = localizationobj.groupbystring;
                }
                if (localizationobj.groupremovestring) {
                    this.gridlocalization.groupremovestring = localizationobj.groupremovestring;
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
                if (localizationobj.decimalseparator != undefined) {
                    this.gridlocalization.decimalseparator = localizationobj.decimalseparator;
                }
                if (localizationobj.thousandsseparator != undefined) {
                    this.gridlocalization.thousandsseparator = localizationobj.thousandsseparator;
                }
                if (localizationobj.filterclearstring) {
                    this.gridlocalization.filterclearstring = localizationobj.filterclearstring;
                }
                if (localizationobj.filterstring) {
                    this.gridlocalization.filterstring = localizationobj.filterstring;
                }
                if (localizationobj.filtershowrowstring) {
                    this.gridlocalization.filtershowrowstring = localizationobj.filtershowrowstring;
                }
                if (localizationobj.filterselectallstring) {
                    this.gridlocalization.filterselectallstring = localizationobj.filterselectallstring;
                }
                if (localizationobj.filterchoosestring) {
                    this.gridlocalization.filterchoosestring = localizationobj.filterchoosestring;
                }
                if (localizationobj.filterorconditionstring) {
                    this.gridlocalization.filterorconditionstring = localizationobj.filterorconditionstring;
                }
                if (localizationobj.filterandconditionstring) {
                    this.gridlocalization.filterandconditionstring = localizationobj.filterandconditionstring;
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

                if (refresh !== false) {
                    if (this._initpager) {
                        this._initpager();
                    }
                    if (this._initgroupsheader) {
                        this._initgroupsheader();
                    }
                    if (this._initmenu) {
                        this._initmenu();
                    }
                    this._builddataloadelement();
                    $(this.dataloadelement).css('visibility', 'hidden');
                    $(this.dataloadelement).css('display', 'none');

                    if (this.filterable && this.showfilterrow) {
                        if (this._updatefilterrow) {
                            for (var obj in this._filterrowcache) {
                                $(this._filterrowcache[obj]).remove();
                            }

                            this._filterrowcache = [];
                            this._updatefilterrow();
                        }
                    }
                    if (this.showaggregates && this.refresheaggregates) {
                        this.refresheaggregates();
                    }
                    this._renderrows(this.virtualsizeinfo);
                }
            }
            else {
                this.gridlocalization = {
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
                    {"name": "A.D.", "start": null, "offset": 0 }
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
                    groupsheaderstring: "Drag a column and drop it here to group by that column",
                    sortascendingstring: "Sort Ascending",
                    sortdescendingstring: "Sort Descending",
                    sortremovestring: "Remove Sort",
                    groupbystring: "Group By this column",
                    groupremovestring: "Remove from groups",
                    filterclearstring: "Clear",
                    filterstring: "Filter",
                    filtershowrowstring: "Show rows where:",
                    filterorconditionstring: "Or",
                    filterandconditionstring: "And",
                    filterselectallstring: "(Select All)",
                    filterchoosestring: "Please Choose:",
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
                    todaystring: "Today"
                };
            }
        },

        _initmenu: function () {
            var self = this.that;

            if (this.host.jqxMenu) {
                if (this.gridmenu) {
                    if (this.filterable) {
                        if (this._destroyfilterpanel) {
                            this._destroyfilterpanel();
                        }
                    }
                    this.removeHandler(this.gridmenu, 'keydown');
                    this.removeHandler(this.gridmenu, 'closed');
                    this.removeHandler(this.gridmenu, 'itemclick');
                    this.gridmenu.jqxMenu('destroy');
                    this.gridmenu.removeData();
                    this.gridmenu.remove();
                }
                this.menuitemsarray = new Array();
                this.gridmenu = $('<div id="gridmenu' + this.element.id + '" style="z-index: 9999999999999;"></div>');
                this.host.append(this.gridmenu);
                var menuitems = $('<ul></ul>');
                var imgsortasc = '<div class="jqx-grid-sortasc-icon"></div>';
                var sortascendingitem = $('<li>' + imgsortasc + this.gridlocalization.sortascendingstring + '</li>');
                var imgsortdesc = '<div class="jqx-grid-sortdesc-icon"></div>';
                var sortdescendingitem = $('<li>' + imgsortdesc + this.gridlocalization.sortdescendingstring + '</li>');
                var imgsortclear = '<div class="jqx-grid-sortremove-icon"></div>';
                var sortremoveitem = $('<li>' + imgsortclear + this.gridlocalization.sortremovestring + '</li>');
                var imggroupby = '<div class="jqx-grid-groupby-icon"></div>';
                var groupbyitem = $('<li>' + imggroupby + this.gridlocalization.groupbystring + '</li>');
                var groupremoveitem = $('<li>' + imggroupby + this.gridlocalization.groupremovestring + '</li>');
                var separatoritem = $('<li type="separator"></li>');
                var filteritem = $('<li class="filter" style="height: 175px;" ignoretheme="true">' + '<div class="filter"></div>' + '</li>');

                var maxstringlength = this.gridlocalization.sortascendingstring.length;
                var maxstring = this.gridlocalization.sortascendingstring;
                if (this.gridlocalization.sortdescendingstring.length > maxstringlength) {
                    maxstringlength = this.gridlocalization.sortdescendingstring.length;
                    maxstring = this.gridlocalization.sortdescendingstring;
                }
                if (this.gridlocalization.sortremovestring.length > maxstringlength) {
                    maxstringlength = this.gridlocalization.sortremovestring.length;
                    maxstring = this.gridlocalization.sortremovestring;
                }
                if (this.groupable && this._initgroupsheader && this.showgroupmenuitems) {
                    if (this.gridlocalization.groupbystring.length > maxstringlength) {
                        maxstringlength = this.gridlocalization.groupbystring.length;
                        maxstring = this.gridlocalization.groupbystring;
                    }
                    if (this.gridlocalization.groupremovestring.length > maxstringlength) {
                        maxstringlength = this.gridlocalization.groupremovestring.length;
                        maxstring = this.gridlocalization.groupremovestring;
                    }
                }
                var stringwidth = 200;
                maxstring = $.trim(maxstring).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
                var measurestring = $('<span>' + maxstring + '</span>');
                measurestring.addClass(this.toThemeProperty('jqx-menu-item'));
                this.host.append(measurestring);
                stringwidth = measurestring.outerWidth() + 60;
                measurestring.remove();
                var itemscount = 0;
                if (this.sortable && this._togglesort && this.showsortmenuitems) {
                    menuitems.append(sortascendingitem);
                    this.menuitemsarray[0] = sortascendingitem[0];

                    menuitems.append(sortdescendingitem);
                    this.menuitemsarray[1] = sortdescendingitem[0];

                    menuitems.append(sortremoveitem);
                    this.menuitemsarray[2] = sortremoveitem[0];
                    itemscount = 3;
                }

                if (this.groupable && this._initgroupsheader && this.showgroupmenuitems) {
                    menuitems.append(groupbyitem);
                    this.menuitemsarray[3] = groupbyitem[0];

                    menuitems.append(groupremoveitem);
                    this.menuitemsarray[4] = groupremoveitem[0];
                    itemscount += 2;
                }

                var measureHeight = this._measureMenuElement();
                var itemsheight = itemscount * measureHeight + 9;
                var closeonclick = true;
                if (this.filterable && !this.showfilterrow && this.showfiltermenuitems) {
                    if (this._initfilterpanel) {
                        this.menuitemsarray[5] = filteritem[0];
                        this.menuitemsarray[6] = filteritem[0];
                        menuitems.append(separatoritem);
                        menuitems.append(filteritem);
                        itemsheight += 180;
                        if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                            itemsheight += 20;
                        }

                        var filterpanel = $(filteritem).find('div:first');
                        stringwidth += 20;
                        this._initfilterpanel(this, filterpanel, "", stringwidth);
                        closeonclick = false;

                        this.removeHandler($(document), 'click.menu' + self.element.id, self._closemenuafterclick, self);
                        this.addHandler($(document), 'click.menu' + self.element.id, self._closemenuafterclick, self);
                    }
                    else {
                        throw new Error('jqxGrid: Missing reference to jqxgrid.filter.js.');
                    }
                }

                this.gridmenu.append(menuitems);

                if ($.jqx.browser.msie && $.jqx.browser.version < 8 && this.filterable) {
                    $("#listBoxfilter1" + this.element.id).css('z-index', 4990);
                    $("#listBoxfilter2" + this.element.id).css('z-index', 4990);
                    $("#listBoxfilter3" + this.element.id).css('z-index', 4990);
                    $('#gridmenu' + this.element.id).css('z-index', 5000);
                    this.addHandler($('#gridmenu' + this.element.id), 'initialized', function () {
                        $('#menuWrappergridmenu' + self.element.id).css('z-index', 4980);
                    });
                }

                if (this.menuitemsarray[0] == undefined) {
                    itemsheight = 65;
                }

                this.removeHandler(this.gridmenu, 'keydown');
                this.addHandler(this.gridmenu, 'keydown', function (event) {
                    if (event.keyCode == 27) {
                        self.gridmenu.jqxMenu('close');
                    }
                    else if (event.keyCode == 13 && self.filterable) {
                        if (self._buildfilter) {
                            var filter1 = $($.find('#filter1' + self.element.id)).jqxDropDownList('container').css('display') == 'block';
                            var filter2 = $($.find('#filter2' + self.element.id)).jqxDropDownList('container').css('display') == 'block';
                            var filter3 = $($.find('#filter3' + self.element.id)).jqxDropDownList('container').css('display') == 'block';
                            var clearButton = $($.find('#filterclearbutton' + self.element.id)).hasClass('jqx-fill-state-focus');
                            if (clearButton) {
                                var column = $.data(document.body, "contextmenu" + self.element.id).column;
                                self._clearfilter(self, self.element, column);
                                self.gridmenu.jqxMenu('close');
                            }
                            else {
                                if (!filter1 && !filter2 && !filter3) {
                                    var column = $.data(document.body, "contextmenu" + self.element.id).column;
                                    self.gridmenu.jqxMenu('close');
                                    self._buildfilter(self, filteritem, column);
                                }
                            }
                        }
                    }
                });
                if (this.popupwidth != 'auto') {
                    stringwidth = this.popupwidth;
                }

                this.gridmenu.jqxMenu({ width: stringwidth, height: itemsheight, autoCloseOnClick: closeonclick, autoOpenPopup: false, mode: 'popup', theme: this.theme, animationShowDuration: 0, animationHideDuration: 0, animationShowDelay: 0 });
                if (this.filterable) {
                    this.gridmenu.jqxMenu('_setItemProperty', filteritem[0].id, 'closeOnClick', false);
                }
                if (this.rtl) {
                    var me = this.that;
                    $.each(menuitems.find('li'), function () {
                        $(this).addClass(me.toTP('jqx-rtl'));
                    });
                    var func = function (element) {
                        var el = element.find('div');
                        el.css('float', 'right');
                        el.css('margin-left', '4px');
                        el.css('margin-right', '-4px');
                    }
                    func(sortremoveitem);
                    func(sortdescendingitem);
                    func(sortascendingitem);
                    func(groupbyitem);
                    func(groupremoveitem);
                }
                this._handlemenueevents();
            }
            else {
                this.columnsmenu = false;
            }
            //this._appendmenu();
        },

        _arrangemenu: function () {
            if (!this.gridmenu) {
                this._initmenu();
            }

            var maxstringlength = this.gridlocalization.sortascendingstring.length;
            var maxstring = this.gridlocalization.sortascendingstring;
            if (this.gridlocalization.sortdescendingstring.length > maxstringlength) {
                maxstringlength = this.gridlocalization.sortdescendingstring.length;
                maxstring = this.gridlocalization.sortdescendingstring;
            }
            if (this.gridlocalization.sortremovestring.length > maxstringlength) {
                maxstringlength = this.gridlocalization.sortremovestring.length;
                maxstring = this.gridlocalization.sortremovestring;
            }
            if (this.groupable && this._initgroupsheader) {
                if (this.gridlocalization.groupbystring.length > maxstringlength) {
                    maxstringlength = this.gridlocalization.groupbystring.length;
                    maxstring = this.gridlocalization.groupbystring;
                }
                if (this.gridlocalization.groupremovestring.length > maxstringlength) {
                    maxstringlength = this.gridlocalization.groupremovestring.length;
                    maxstring = this.gridlocalization.groupremovestring;
                }
            }
            var stringwidth = 200;
            maxstring = $.trim(maxstring).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
            var measurestring = $('<span>' + maxstring + '</span>');
            measurestring.addClass(this.toThemeProperty('jqx-menu-item'));
            this.host.append(measurestring);
            stringwidth = measurestring.outerWidth() + 60;
            measurestring.remove();
            var itemscount = 0;
            if (this.sortable && this._togglesort && this.showsortmenuitems) {
                itemscount = 3;
            }

            if (this.groupable && this._initgroupsheader && this.showgroupmenuitems) {
                itemscount += 2;
            }

            var itemsheight = itemscount * 27 + 3;
            if (this.filterable && this.showfiltermenuitems) {
                if (this._initfilterpanel) {
                    itemsheight += 180;
                    stringwidth += 20;
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        itemsheight += 20;
                    }
                }
            }

            if (this.menuitemsarray[0] == undefined) {
                itemsheight = 65;
            }

            if (this.popupwidth != 'auto') {
                stringwidth = this.popupwidth;
            }

            this.gridmenu.jqxMenu({ width: stringwidth, height: itemsheight });
        },

        //_appendmenu: function () {
        //    var el = $.jqx.dataFormat._getmenuelement();
        //    var me = this.that;
        //    if (el != "") {
        //        setTimeout(function () {
        //            var e = $(el);
        //            e.css('position', 'absolute');
        //            var offset = me.host.offset();
        //            e.css('left', offset.left + me.content.width() - 60);
        //            var height = me.table.height();
        //            e.css('top', offset.top);
        //            me.host.append(e);
        //        }, 100);
        //    }
        //},

        _closemenuafterclick: function (event) {
            var me = event != null ? event.data : this;
            var matches = false;

            if (event.target == undefined || (event.target != undefined && event.target.className.indexOf == undefined))
            {
                me.gridmenu.jqxMenu('close');
                return;
            }
            
            if (event.target.className.indexOf('filter') != -1 && event.target.className.indexOf('jqx-grid-cell-filter') == -1) {
                return;
            }

            if (event.target.className.indexOf('jqx-grid-cell') != -1) {
                me.gridmenu.jqxMenu('close');
                return;
            }

            if (me._hasOpenedMenu) {
                if ($(event.target).ischildof(me.gridmenu)) {
                    return;
                }
            }

            var gridbounds = me.host.coord();
            var menubounds = me.gridmenu.coord();
            var x = event.pageX;
            var y = event.pageY;

            $.each($(event.target).parents(), function () {
                if (this.id != null && this.id.indexOf && this.id.indexOf('filter') != -1) {
                    matches = true;
                    return false;
                }

                if (this.className.indexOf && this.className.indexOf('filter') != -1 && this.className.indexOf('jqx-grid-cell-filter') == -1) {
                    matches = true;
                    return false;
                }

                if (this.className.indexOf && this.className.indexOf('jqx-grid-cell') != -1) {
                    me.gridmenu.jqxMenu('close');
                    return false;
                }
                if (this.className.indexOf && this.className.indexOf('jqx-grid-column') != -1) {
                    me.gridmenu.jqxMenu('close');
                    return false;
                }
            });

            if (matches) {
                return;
            }

            try {
                if (this.filtermode === "default") {
                    var date1 = $($.find('#filter1' + me.element.id)).jqxDropDownList('listBox').vScrollInstance._mouseup;
                    var newDate = new Date();
                    if (newDate - date1 < 100)
                        return;

                    var date2 = $($.find('#filter3' + me.element.id)).jqxDropDownList('listBox').vScrollInstance._mouseup;
                    if (newDate - date2 < 100)
                        return;

                    if (($($.find('#filter3' + me.element.id)).jqxDropDownList('container')).css('display') == 'block')
                        return;
                    if (($($.find('#filter1' + me.element.id)).jqxDropDownList('container')).css('display') == 'block')
                        return;
                    if (($($.find('#filter2' + me.element.id)).jqxDropDownList('container')).css('display') == 'block')
                        return;
                }
                else {
                    var date1 = $($.find('#filter1' + me.element.id)).data().jqxListBox.instance.vScrollInstance._mouseup;
                    var newDate = new Date();
                    if (newDate - date1 < 100)
                        return;
                    var date2 = $($.find('#filter1' + me.element.id)).data().jqxListBox.instance.hScrollInstance._mouseup;
                    if (newDate - date2 < 100)
                        return;
                }
            }
            catch (error) {
            }

            if (x >= menubounds.left && x <= menubounds.left + me.gridmenu.width()) {
                if (y >= menubounds.top && y <= menubounds.top + me.gridmenu.height()) {
                    return;
                }
            }

            me.gridmenu.jqxMenu('close');

            //if (x < gridbounds.left || x > gridbounds.left + me.host.width()) {
            //    me.gridmenu.jqxMenu('close');
            //    return;
            //}

            //if (y < gridbounds.top || y > gridbounds.top + me.host.height()) {
            //    me.gridmenu.jqxMenu('close');
            //    return;
            //}
        },

        _handlemenueevents: function () {
            var self = this.that;
            this.removeHandler(this.gridmenu, 'closed');
            this.addHandler(this.gridmenu, 'closed', function (event) {
                self._closemenu();
            });

            this.removeHandler(this.gridmenu, 'itemclick');
            this.addHandler(this.gridmenu, 'itemclick', function (event) {
                var clickeditem = event.args;

                for (var i = 0; i < self.menuitemsarray.length; i++) {
                    var currentitem = self.menuitemsarray[i];
                    if (clickeditem == currentitem) {
                        if ($(clickeditem).attr('ignoretheme') != undefined) {
                            return;
                        }

                        var menu = $.data(document.body, "contextmenu" + self.element.id);
                        var column = menu.column;
                        if (self.filterable) {
                            self.gridmenu.jqxMenu('close');
                        }
                        var displayfield = column.displayfield;
                        if (displayfield == null) displayfield = column.datafield;

                        if (menu != null) {
                            switch (i) {
                                case 0:
                                    self.sortby(displayfield, 'ascending', null);
                                    break;
                                case 1:
                                    self.sortby(displayfield, 'descending', null);
                                    break;
                                case 2:
                                    self.sortby(displayfield, null, null);
                                    break;
                                case 3:
                                    self.addgroup(column.datafield);
                                    break;
                                case 4:
                                    self.removegroup(column.datafield);
                                    break;
                                case 5:
                                    var filteritem = $(self.menuitemsarray[6]);
                                    $(filteritem).css('display', 'block');
                                    break;
                                case 7:
                                    break;
                            }
                        }
                        break;
                    }
                }
            });
        },

        // get information about the data records.
        getdatainformation: function () {
            var totalrecords = this.dataview.totalrecords;
            if (this.summaryrows) {
                totalrecords += this.summaryrows.length;
            }

            return { rowscount: totalrecords, sortinformation: this.getsortinformation(), paginginformation: this.getpaginginformation() }
        },

        // gets sort information.
        getsortinformation: function () {
            return { sortcolumn: this.sortcolumn, sortdirection: this.sortdirection };
        },

        // get paging information.
        getpaginginformation: function () {
            return { pagenum: this.dataview.pagenum, pagesize: this.pagesize, pagescount: Math.ceil(this.dataview.totalrecords / this.pagesize) };
        },

        _updaterowsproperties: function () {
            this._updatehiddenrows();
            this._updaterowheights();
            this._updaterowdetails();
        },

        _updatehiddenrows: function () {
            var me = this.that;
            this.hiddens = new Array();
            var hiddenboundrows = this.hiddenboundrows;
            $.each(hiddenboundrows, function (index) {
                if (this.index != undefined) {
                    var boundindex = this.index;
                    var visibleindex = me.getrowvisibleindex(index);
                    me.hiddens[visibleindex] = this.hidden;
                }
            });
        },

        _updaterowheights: function () {
            var me = this.that;
            this.heights = new Array();
            var heightboundrows = this.heightboundrows;
            $.each(heightboundrows, function (index) {
                if (this.index != undefined) {
                    var boundindex = this.index;
                    var visibleindex = me.getrowvisibleindex(index);
                    me.heights[visibleindex] = this.height;
                }
            });
        },

        _updaterowdetails: function () {
            var me = this.that;
            this.details = new Array();
            var detailboundrows = this.detailboundrows;
            $.each(detailboundrows, function (index) {
                if (this.index != undefined) {
                    var boundindex = this.index;
                    var visibleindex = me.getrowvisibleindex(index);
                    me.details[visibleindex] = this.details;
                }
            });
        },

        _getmenuitembyindex: function (index) {
            if (index == undefined)
                return null;

            return this.menuitemsarray[index];
        },

        _closemenu: function () {
            if (this._hasOpenedMenu) {
                if (this.gridmenu != null) {
                    this.gridmenu.jqxMenu('close');
                }

                var menu = $.data(document.body, "contextmenu" + this.element.id);
                var menuoffset = 16;
                if (menu != null && this.autoshowcolumnsmenubutton) {
                    if (this.enableanimations) {
                        $(menu.columnsmenu).animate({
                            'margin-left': 0
                        }, 'fast', function () {
                            $(menu.columnsmenu).css('display', 'none');
                        });
                        var left = !this.rtl ? -32 : 0;
                        menu.column.iconscontainer.animate({
                            'margin-left': left
                        }, 'fast');
                    }
                    else {
                        $(menu.columnsmenu).css('display', 'none');
                        var left = !this.rtl ? -32 : 0;
                        menu.column.iconscontainer.css('margin-left', left);
                    }

                    $.data(document.body, "contextmenu" + this.element.id, null)
                }
                this._hasOpenedMenu = false;


                var filteritem = this._getmenuitembyindex(5);
                if (filteritem) {
                    var condition = $(filteritem).find('#filter1' + this.element.id);
                    var filteroperator = $(filteritem).find('#filter2' + this.element.id);
                    var condition2 = $(filteritem).find('#filter3' + this.element.id);
                    if (condition.length > 0 && this.filtermode === "default") {
                        condition.jqxDropDownList('hideListBox');
                        filteroperator.jqxDropDownList('hideListBox');
                        condition2.jqxDropDownList('hideListBox');
                    }
                }
            }
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

        endupdate: function () {
            this.resumeupdate();
        },

        resumeupdate: function () {
            this._updating = false;
            if (this._datachanged == true) {
                var verticalScrollValue = this.vScrollInstance.value;
                this.render(true, true, false);
                this._datachanged = false;
                if (verticalScrollValue != 0 && verticalScrollValue < this.vScrollInstance.max) {
                    this.scrolltop(verticalScrollValue);
                }
            }
            else {
                this.rendergridcontent(true);
                this._renderrows(this.virtualsizeinfo);
            }
            if (this.showaggregates && this.renderaggregates) {
                this.renderaggregates();
            }
            this._updatecolumnwidths();
            this._updatecellwidths();
            this._renderrows(this.virtualsizeinfo);
        },

        updating: function () {
            return this._updating;
        },

        showloadelement: function () {
            if (this.renderloadelement) {
                this.dataloadelement.html(this.renderloadelement());
            }

            $(this.dataloadelement).css('visibility', 'visible');
            $(this.dataloadelement).css('display', 'block');
        },

        hideloadelement: function () {
            $(this.dataloadelement).css('visibility', 'hidden');
            $(this.dataloadelement).css('display', 'none');
        },

        _updatefocusedfilter: function () {
            var me = this.that;
            if (me.focusedfilter) {
                me.focusedfilter.focus();
                setTimeout(function () {
                    me.focusedfilter.focus();
                    if (me.focusedfilter[0].nodeName.toLowerCase() == "input") {
                        var start = me.focusedfilter.val().length;
                        try {
                            if ('selectionStart' in me.focusedfilter[0]) {
                                me.focusedfilter[0].setSelectionRange(start, start);
                            }
                            else {
                                var range = me.focusedfilter[0].createTextRange();
                                range.collapse(true);
                                range.moveEnd('character', start);
                                range.moveStart('character', start);
                                range.select();
                            }
                        }
                        catch (error) {
                        }
                    }
                }, 10);
            }
        },

        databind: function (source, reason) {
            if (this.loadingstate === true) {
                return;
            }
        
            if (this.host.css('display') == 'block') {
                if (this.autoshowloadelement) {
                    $(this.dataloadelement).css('visibility', 'visible');
                    $(this.dataloadelement).css('display', 'block');
                    this.dataloadelement.width(this.host.width());
                    this.dataloadelement.height(this.host.height());
                    this._hideemptyrow();
                }
                else {
                    $(this.dataloadelement).css('visibility', 'hidden');
                    $(this.dataloadelement).css('display', 'none');
                }
            }
            if (!this._initgroupsheader && this.groups.length > 0) {
                this.groups = new Array();
            }

            var me = this.that;
            if (source == null) {
                source = {};
            }

            if (!source.recordstartindex) {
                source.recordstartindex = 0;
            }
            if (!source.recordendindex) {
                source.recordendindex = 0;
            }
            if (source.loadallrecords == undefined || source.loadallrecords == null) {
                source.loadallrecords = true;
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
            this.dataview = this.dataview || new $.jqx.dataview();
            if ($.jqx.dataview.sort) {
                $.extend(this.dataview, new $.jqx.dataview.sort());
            }
            if ($.jqx.dataview.grouping) {
                $.extend(this.dataview, new $.jqx.dataview.grouping());
            }

            this.dataview.suspendupdate();
            this.dataview.pageable = this.pageable;
            this.dataview.groupable = this.groupable;
            this.dataview.groups = this.groups;
            this.dataview.virtualmode = this.virtualmode;
            this.dataview.grid = this;
            this.dataview._clearcaches();
            if (!this.pageable && this.virtualmode) {
                this.loadondemand = true;
            }
            if (!me.initializedcall) {
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
                if (!me.pageable && me.virtualmode) {
                    me.loadondemand = true;
                }
                me._loading = false;
                if (me.dataview.isupdating()) {
                    me.dataview.resumeupdate(false);
                }
                if (me.pageable && me.pagerrenderer) {
                    if (me._initpager)
                        me._initpager();
                    else throw new Error('jqxGrid: Missing reference to jqxgrid.pager.js.');
                }

                if ((me.source && me.source.sortcolumn) && me.sortby && !me.virtualmode) {
                    me.render();
                    if (!me.source._source.sort) {
                        me.sortby(me.source.sortcolumn, me.source.sortdirection, me.source.sortcomparer);
                    }
                    me.source.sortcolumn = null;
                }
                else {
                    var vvalue = me.vScrollInstance.value;
                    var hvalue = me.hScrollInstance.value;
                    var datatype = me.source ? me.source.datatype : "array";
                    if (datatype != 'local' || datatype != 'array') {
                        var virtualheight = me.virtualsizeinfo == null || (me.virtualsizeinfo != null && me.virtualsizeinfo.virtualheight == 0);
                        if (reason == 'cells') {
                            var hasfilter = false;
                            if (me.filterable && me._initfilterpanel && me.dataview.filters.length) {
                                hasfilter = true;
                            }

                            if (false == rowschanged) {
                                if (!me.vScrollInstance.isScrolling() && !me.hScrollInstance.isScrolling()) {
                                    me._cellscache = new Array();
                                    me._pagescache = new Array();
                                    me._renderrows(me.virtualsizeinfo);
                                    if (me.showfilterrow && me.filterable && me.filterrow) {
                                        me._updatelistfilters(true);
                                    }

                                    if (me.showaggregates && me._updateaggregates) {
                                        me._updateaggregates();
                                    }
                                }
                                if (me.sortcolumn) {
                                    me.sortby(me.sortcolumn, me.dataview.sortfielddirection, me.source.sortcomparer);
                                }
                                if (me.autoshowloadelement) {
                                    $(me.dataloadelement).css('visibility', 'hidden');
                                    $(me.dataloadelement).css('display', 'none');
                                }
                                if (me.virtualmode && !me._loading) {
                                    me.loadondemand = true;
                                    me._renderrows(me.virtualsizeinfo);
                                }
                                return;
                            }
                            else {
                                if (hasfilter) {
                                    reason = 'filter';
                                }
                                else if (me.sortcolumn != undefined) {
                                    reason = 'sort';
                                }
                            }
                        }

                        if (!me.virtualmode || virtualheight || (me.virtualmode && me.pageable)) {
                            if (me.initializedcall == true && reason == 'pagechanged') {
                                vvalue = 0;
                                if (me.groupable && me.groups.length > 0) {
                                    me._render(true, true, false, false, false);
                                    me._updatecolumnwidths();
                                    me._updatecellwidths();
                                    me._renderrows(me.virtualsizeinfo);
                                }
                                else {
                                    me.rendergridcontent(true);
                                    if (me.pageable && me.updatepagerdetails) {
                                        me.updatepagerdetails();
                                        if (me.autoheight) {
                                            me._updatepageviews();
                                            if (me.autorowheight) {
                                                me._renderrows(this.virtualsizeinfo);
                                            }
                                        }
                                        else {
                                            if (me.autorowheight) {
                                                me._updatepageviews();
                                                me._renderrows(this.virtualsizeinfo);
                                            }
                                        }
                                    }
                                }

                                if (me.showaggregates && me._updateaggregates) {
                                    me._updateaggregates();
                                }
                                //     me._render(true, true, false, false);
                            }
                            else if (reason == 'filter') {
                                if (me.virtualmode) {
                                    me._render(true, true, false, false, false);
                                    me._updatefocusedfilter();
                                    me._updatecolumnwidths();
                                    me._updatecellwidths();
                                    me._renderrows(me.virtualsizeinfo);
                                }
                                else {
                                    me._render(true, true, false, false, false);
                                }
                            }
                            else if (reason == 'sort') {
                                if (me.virtualmode) {
                                    me.rendergridcontent(true);
                                    if (me.showaggregates && me._updateaggregates) {
                                        me._updateaggregates();
                                    }
                                }
                                else {
                                    me._render(true, true, false, false, false);
                                    if (me.sortcolumn && !me.source.sort) {
                                        me.sortby(me.sortcolumn, me.dataview.sortfielddirection, me.source.sortcomparer);
                                    }
                                }
                            }
                            else if (reason == 'data') {
                                me._render(true, true, false, false, false);
                            }
                            else if (reason == "state") {
                                me._render(true, true, false, me.menuitemsarray && me.menuitemsarray.length > 0 && !me.virtualmode);
                            }
                            else {
                                me._render(true, true, true, me.menuitemsarray && me.menuitemsarray.length > 0 && !me.virtualmode);
                            }
                        }
                        else {
                            if (me.virtualmode && rowschanged == true && !me.pageable) {
                                me._render(true, true, false, false, false);
                                me._updatefocusedfilter();
                                me._updatecolumnwidths();
                                me._updatecellwidths();
                                me._renderrows(me.virtualsizeinfo);
                            }
                            else if (me.virtualmode && !me.pageable && rowschanged == false && reason != undefined) {
                                me.rendergridcontent(true);
                                if (me.showaggregates && me._updateaggregates) {
                                    me._updateaggregates();
                                }
                            }
                            else {
                                if (me.virtualmode && me.dataview.totalrecords == 0 && me.dataview.filters.length > 0) {
                                    me._render(true, true, true, me.menuitemsarray && !me.virtualmode);
                                }
                                else {
                                    me._pagescache = new Array();
                                    me._renderrows(me.virtualsizeinfo);
                                }
                            }
                        }
                        if (me.vScrollInstance.value != vvalue && vvalue <= me.vScrollInstance.max) {
                            me.vScrollInstance.setPosition(vvalue);
                        }
                        if (me.hScrollInstance.value != hvalue && hvalue <= me.hScrollInstance.max) {
                            me.hScrollInstance.setPosition(hvalue);
                        }
                    }
                }
                if (me.autoshowloadelement) {
                    $(me.dataloadelement).css('visibility', 'hidden');
                    $(me.dataloadelement).css('display', 'none');
                }
                if (me.pageable) {
                    if (me.pagerrightbutton) {
                        me.pagerrightbutton.jqxButton({ disabled: false });
                        me.pagerleftbutton.jqxButton({ disabled: false });
                        me.pagershowrowscombo.jqxDropDownList({ disabled: false });
                    }
                }

                me._raiseEvent(11);
                if (!me.initializedcall) {
                    var callReady = function () {
                        me._raiseEvent(0);
                        me.initializedcall = true;
                        if (me.ready) {
                            me.ready();
                        }
                        if (me.autoloadstate) {
                            if (me.loadstate) {
                                me.loadstate(null, true);
                            }
                        }
                    }

                    if (!$.jqx.isHidden(me.host)) {
                        callReady();
                    }
                    else {
                        if (me.readyInterval) {
                            clearInterval(me.readyInterval);
                        }
                        me.readyInterval = setInterval(function () {
                            if (!$.jqx.isHidden(me.host)) {
                                if (me.__isRendered) {
                                    clearInterval(me.readyInterval);
                                    me.readyInterval = null;
                                    callReady();
                                    me._initmenu();
                                }
                            }
                        }, 200);
                    }

                    if ((me.width != null && me.width.toString().indexOf('%') != -1) || (me.height != null && me.height.toString().indexOf('%') != -1)) {
                    //    me._updatesize(true);
                    }

                    if (me.host.css('visibility') == 'hidden') {
                        var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;

                        if (me.vScrollBar.css('visibility') == 'visible') {
                            me.vScrollBar.css('visibility', 'inherit');
                        }

                        if (!me.autowidth) {
                            if (me.hScrollBar.css('visibility') == 'visible') {
                                me.hScrollBar.css('visibility', 'inherit');
                            }
                        }

                        me._intervalTimer = setInterval(function () {
                            if (me.host.css('visibility') == 'visible') {
                                me._updatesize(true);
                                clearInterval(me._intervalTimer);
                            }
                        }, 100);
                    }
                }
                else me._updateTouchScrolling();
            }

            this.dataview.databind(source);

            if (this.dataview.isupdating()) {
                if (url != undefined) {
                    this.dataview.suspend = false;
                }
                else {
                    this.dataview.resumeupdate(false);
                }
            }

            this._initializeRows();
        },

        scrollto: function (left, top) {
            if (undefined != left) {
                this.hScrollInstance.setPosition(left);
            }

            if (undefined != top) {
                this.vScrollInstance.setPosition(top);
            }
        },

        scrollposition: function () {
            return { top: this.vScrollInstance.value, left: this.hScrollInstance.value }
        },

        ensurerowvisible: function (index) {
            if (this.autoheight && !this.pageable) {
                return true;
            }

            var pagesize = this._getpagesize();
            var pagenumber = Math.floor(index / pagesize);

            if (!this._pageviews[pagenumber] && !this.pageable) {
                this._updatepageviews();
            }
            if (this.groupable && this.groups.length > 0)
                return true;

            var result = false;
            if (this.pageable && this.gotopage && !this.virtualmode) {
                var pagenumber = Math.floor(index / pagesize);
                if (this.dataview.pagenum != pagenumber) {
                    if (this.groupable && this.groups.length > 0)
                        return true;

                    this.gotopage(pagenumber);
                    result = true;
                }
            }

            var value = this.vScrollInstance.value;
            var height = this._gettableheight() - this.rowsheight;
            var rowindexinpage = pagesize * (index / pagesize - pagenumber);
            rowindexinpage = Math.round(rowindexinpage);

            if (this._pageviews[pagenumber]) {
                var top = this._pageviews[pagenumber].top;
                var rowposition = top + rowindexinpage * this.rowsheight;
                if (this.rowdetails) {
                    for (var i = pagesize * pagenumber; i < index; i++) {
                        if (this.details[i]) {
                            if (this.details[i].rowdetailshidden == false) {
                                rowposition += this.details[i].rowdetailsheight;
                            }
                        }
                    }
                }

                if (this.scrollmode == 'deferred') {
                    if (this.vScrollInstance.max <= rowposition + this.rowsheight) {
                        rowposition = this.vScrollInstance.max;
                    }
                }

                if (rowposition < value) {
                    this.scrolltop(rowposition);
                    result = true;
                }
                else if (rowposition > value + height + 2) {
                    this.scrolltop(rowposition - height);
                    result = true;
                }
            }
            else if (this.pageable) {
                var rowposition = rowindexinpage * this.rowsheight;
                if (this.rowdetails) {
                    for (var i = pagesize * pagenumber; i < pagesize * pagenumber + rowindexinpage; i++) {
                        if (this.details[i] && this.details[i].rowdetailshidden == false) {
                            rowposition += this.details[i].rowdetailsheight;
                        }
                    }
                }

                if (rowposition < value || rowposition > value + height) {
                    this.scrollto(0, rowposition);
                    result = true;
                }
            }
            return result;
        },

        ensurecellvisible: function (index, datafield) {
            var self = this.that;
            var hvalue = this.hScrollBar.jqxScrollBar('value');
            var max = self.hScrollInstance.max;
            if (self.rtl) {
                if (this.hScrollBar.css('visibility') != 'visible') {
                    max = 0;
                }
            }

            var result = this.ensurerowvisible(index);
            var left = 0;
            if (this.columns.records) {
                var value = hvalue;
                if (this.hScrollBar.css('visibility') == 'hidden')
                    return;

                var gridwidth = this.host.width();
                var columnindex = 0;
                var vScrollOffset = this.vScrollBar.css('visibility') == 'visible' ? 20 : 0;
                var hresult = false;
          
                $.each(this.columns.records, function () {
                    if (this.datafield == datafield) {
                        var newleft = 0;
                        var val = !self.rtl ? value : max - hvalue;
                        if (left + this.width > val + gridwidth - vScrollOffset) {
                            newleft = left + this.width - gridwidth + vScrollOffset;
                            if (self.rtl) {
                                newleft = max - newleft;
                            }
                            self.scrollleft(newleft);
                            hresult = true;
                        }
                        else if (left <= val) {
                            newleft = left - this.width;
                            if (self.rtl) {
                                newleft = max - newleft;
                            }
                            self.scrollleft(newleft);
                            hresult = true;
                        }

                        if (columnindex == 0) {
                            if (self.rtl) {
                                self.scrollleft(max);
                            }
                            else {
                                self.scrollleft(0);
                            }
                            hresult = true;
                        }
                        else if (columnindex == self.columns.records.length - 1) {
                            if (self.hScrollBar.css('visibility') == 'visible') {
                                if (!self.rtl) {
                                    self.scrollleft(self.hScrollBar.jqxScrollBar('max'));
                                }
                                else {
                                    self.scrollleft(self.hScrollBar.jqxScrollBar('min'));
                                }

                                hresult = true;
                            }
                        }
                        return false;
                    }
                    columnindex++;
                    left += this.width;
                });
                if (!hresult) {
                    self.scrollleft(value);
                }
            }
            return result;
        },

        setrowheight: function (index, height) {
            if (this._loading) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            if (index == null || height == null)
                return false;

            this.heightboundrows[index] = { index: index, height: height };

            index = this.getrowvisibleindex(index);
            if (index < 0)
                return false;

            if (this.rows.records[index]) {
                this.rows.records[index].height = height;
            }
            else {
                row = new jqxGridRow(this, null);
                row.height = height;
                this.rows.replace(index, row);
            }
            this.heights[index] = height;

            this.rendergridcontent(true);
            return true;
        },

        getrowheight: function (index) {
            if (index == null)
                return null;

            index = this.getrowvisibleindex(index);
            if (index < 0)
                return false;

            if (this.rows.records[index]) {
                return this.rows.records[index].height;
            }
        },

        setrowdetails: function (index, details, height, hidden) {
            if (index == undefined || index == null || index < 0)
                return;

            var lookupkey = index + "_";
            if (this._rowdetailscache[lookupkey]) {
                var element = this._rowdetailscache[lookupkey].element;
                $(element).remove();
                this._rowdetailscache[lookupkey] = null;
            }

            var detailskey = this.dataview.generatekey();
            this.detailboundrows[index] = { index: index, details: { rowdetails: details, rowdetailsheight: height, rowdetailshidden: hidden, key: detailskey} };

            index = this.getrowvisibleindex(index);
            if (index < 0)
                return false;

            return this._setrowdetails(index, details, height, hidden, detailskey);
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

        _getcolumnindex: function (datafield) {
            var index = -1;
            if (this.columns.records) {
                $.each(this.columns.records, function () {
                    index++;
                    if (this.datafield == datafield) {
                        return false;
                    }
                });
            }
            return index;
        },

        _getcolumnat: function (index) {
            var column = this.columns.records[index];
            return column;
        },

        _getprevvisiblecolumn: function (index) {
            var self = this.that;
            while (index > 0) {
                index--;
                var column = self.getcolumnat(index);
                if (!column)
                    return null;

                if (!column.hidden)
                    return column;
            }
            return null;
        },

        _getnextvisiblecolumn: function (index) {
            var self = this.that;
            while (index < this.columns.records.length) {
                index++;
                var column = self.getcolumnat(index);

                if (!column)
                    return null;

                if (!column.hidden)
                    return column;
            }
            return null;
        },

        getcolumnat: function (index) {
            if (!isNaN(index)) {
                var column = this.columns.records[index];
                return column;
            }

            return null;
        },

        _getcolumn: function (datafield) {
            var column = null;
            $.each(this._columns, function () {
                if (this.datafield == datafield || this.displayfield == datafield) {
                    column = this;
                    return false;
                }
            });
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

            var _cachedcolumn = this._getcolumn(datafield);
            if (_cachedcolumn != null) {
                _cachedcolumn[propertyname] = value;
            }
            this._cellscache = new Array();

            switch (propertyname) {
                case "filteritems":
                    if (this.filterable && this.showfilterrow) {
                        this._updatelistfilters(true, true);
                    }
                    break;
                case "text":
                    this.prerenderrequired = true;
                    this._rendercolumnheaders();
                    this._updatecellwidths();
                    if (this._groupsheader()) {
                        if (this._initgroupsheader) {
                            this._initgroupsheader();
                        }
                    }
                    this._renderrows(this.virtualsizeinfo);
                    break;
                case "editable":
                case "resizable":
                case "draggable":
                    if (propertyname == "editable") {
                        if (value != oldvalue) {
                            if (this.editcell != null && this.endcelledit) {
                                this.endcelledit(this.editcell.row, this.editcell.column, true, true);
                            }
                            if (column.columntype == 'checkbox') {
                                this.prerenderrequired = true;
                                this.rendergridcontent(true, false);
                                if (this.updating()) {
                                    return false;
                                }
                            }
                            if (this.updating()) {
                                return false;
                            }
                            this._renderrows(this.virtualsizeinfo);
                        }
                    }
                    break;
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
                case "classname":
                case "class":
                    this.prerenderrequired = true;
                    this.rendergridcontent(true);
                    if (this.updating()) {
                        return false;
                    }

                    if (propertyname == "hidden") {
                        this._updatecolumnwidths();
                        this._updatecellwidths();
                    }
                    this._renderrows(this.virtualsizeinfo);
                    if (this.showaggregates && this._updateaggregates) {
                        this._updateaggregates();
                    }
                    break;
                case "width":
                case "minwidth":
                case "maxwidth":
                    if (this.updating()) {
                        return false;
                    }
                    column['_width'] = null;
                    column['_percentagewidth'] = null;
                    this._updatecolumnwidths();
                    this._updatecellwidths();
                    this._renderrows(this.virtualsizeinfo);
                    break;
            }
        },

        _getcolumnproperty: function (datafield, propertyname) {
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

        // gets the value of a column property.
        getcolumnproperty: function (datafield, propertyname) {
            return this._getcolumnproperty(datafield, propertyname);
        },

        // hides a column.
        hidecolumn: function (datafield) {
            this._setcolumnproperty(datafield, 'hidden', true);
        },

        // shows a column.
        showcolumn: function (datafield) {
            this._setcolumnproperty(datafield, 'hidden', false);
        },

        // gets column's hidden.
        iscolumnvisible: function (datafield) {
            return !this._getcolumnproperty(datafield, 'hidden');
        },

        // pins the column.
        pincolumn: function (datafield) {
            this._setcolumnproperty(datafield, 'pinned', true);
        },

        // unpins the column.
        unpincolumn: function (datafield) {
            this._setcolumnproperty(datafield, 'pinned', false);
        },

        iscolumnpinned: function (datafield) {
            return this._getcolumnproperty(datafield, 'pinned');
        },

        _setrowdetails: function (index, details, height, hidden, detailskey) {
            if (height == 0) {
                height = 100;
            }

            if (index == null || height == null)
                return false;

            if (detailskey != null) {
                this.details[index] = { rowdetails: details, rowdetailsheight: height, rowdetailshidden: hidden, detailskey: detailskey };
            }
            else {
                var olddetailskey = this.details[index] != null ? this.details[index].detailskey : null;
                var newdetails = { rowdetails: details, rowdetailsheight: height, rowdetailshidden: hidden, detailskey: olddetailskey };

                var me = this.that;

                for (var i = 0; i < this.detailboundrows.length; i++) {
                    if (this.detailboundrows[i] != undefined) {
                        var olddetails = this.detailboundrows[i];
                        if (olddetails.details.detailskey == olddetailskey) {
                            olddetails.details.rowdetailsheight = newdetails.rowdetailsheight;
                            olddetails.details.rowdetailshidden = newdetails.rowdetailshidden;
                            olddetails.details.rowdetails = newdetails.rowdetails;
                            break;
                        }
                    }
                }
                this.details[index] = newdetails;
            }

            this.rendergridcontent(true);
            this._updatecolumnwidths();
            this._updatecellwidths();
            this._renderrows(this.virtualsizeinfo);

            return true;
        },

        // gets the row details.
        getrowdetails: function (index) {
            if (index == null)
                return false;

            index = this.getrowvisibleindex(index);
            return this._getrowdetails(index);
        },


        _getrowdetails: function (index) {
            if (index == null)
                return false;

            if (index < 0)
                return false;

            if (this.details[index]) {
                return this.details[index];
            }

            if (this.rowdetailstemplate) {
                return this.rowdetailstemplate;
            }
        },

        // gets all records count.
        getrecordscount: function () {
            return this.dataview.totalrecords;
        },

        // shows the row details.
        showrowdetails: function (index) {
            if (this._loading) {
                throw new Error( 'jqxGrid: ' + this.loadingerrormessage);
                return false;
            }
            if (index == null)
                return false;

            index = this.getrowvisibleindex(index);
            if (index < 0)
                return false;

            var details = this._getrowdetails(index);
            return this._setrowdetailsvisibility(index, details, false);
        },

        // hides the row details.
        hiderowdetails: function (index) {
            if (this._loading) {
                throw new Error( 'jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            index = this.getrowvisibleindex(index);
            if (index < 0)
                return false;

            var details = this._getrowdetails(index);
            return this._setrowdetailsvisibility(index, details, true);
        },

        _togglerowdetails: function (row) {
            var index = row.visibleindex;
            var details = this._getrowdetails(index);
            if (details != null) {
                var scrollPosition = this.vScrollInstance.value;
                var hidden = !details.rowdetailshidden;
                var result = this._setrowdetailsvisibility(index, details, hidden);
                if (scrollPosition !== 0 && this.vScrollBar.css('visibility') !== 'hidden') {
                    if (scrollPosition <= this.vScrollInstance.max) {
                        this.vScrollInstance.setPosition(scrollPosition);
                    }
                    else {
                        this.vScrollInstance.setPosition(this.vScrollInstance.max);
                    }
                }

                return result;
            }
            return false;
        },

        _setrowdetailsvisibility: function (index, details, hidden) {
            if (this.rowdetailstemplate) {
                if (!this.details) this.details = new Array();
                if (!this.details[index]) {
                    this.details[index] = { rowdetailshidden: this.rowdetailstemplate.rowdetailshidden, rowdetailsheight: this.rowdetailstemplate.rowdetailsheight, rowdetails: this.rowdetailstemplate.rowdetails };
                    var detailskey = this.dataview.generatekey();
                    this.details[index].detailskey = detailskey;
                    this.detailboundrows[index] = { index: index, details: this.details[index] };
                }
            }

            if (details != null) {
                this.details[index].rowdetailshidden = hidden;
            }
            else {
                return false;
            }

            var newdetails = this.details[index];
            if (hidden) {
                this._raiseEvent(21, { rowindex: index, details: newdetails.rowdetails, height: newdetails.rowdetailsheight });
            }
            else {
                this._raiseEvent(20, { rowindex: index, details: newdetails.rowdetails, height: newdetails.rowdetailsheight });
            }
            return this._setrowdetails(index, newdetails.rowdetails, newdetails.rowdetailsheight, newdetails.rowdetailshidden);
        },

        // gets the row's visible index.
        getrowvisibleindex: function (boundindex) {
            if (boundindex == undefined || boundindex == null || boundindex < 0)
                return false;

            if (this.virtualmode) {
                var row = this.dataview.loadedrecords[boundindex];
                if (row == undefined) {
                    return -1;
                }
                return row.visibleindex;
            }

            return this.getrowdisplayindex(boundindex);
        },

        // hides a row.
        hiderow: function (index) {
            if (this._loading) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            if (index == undefined || index == null || index < 0)
                return false;

            if (index == null)
                return false;

            this.hiddenboundrows[index] = { index: index, hidden: true };
            index = this.getrowvisibleindex(index);

            return this._setrowvisibility(index, true);
        },

        // shows a row.
        showrow: function (index) {
            if (this._loading) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            if (index == undefined || index == null || index < 0)
                return false;

            if (index == null)
                return false;

            this.hiddenboundrows[index] = { index: index, hidden: false };
            index = this.getrowvisibleindex(index);

            return this._setrowvisibility(index, false);
        },
        // is row hidden
        isrowhiddenat: function (index) {
            if (index == null)
                return null;

            index = this.getrowvisibleindex(index);

            if (this.rows.records[index]) {
                return this.rows.records[index].hidden;
            }
        },

        _setrowvisibility: function (index, hidden, refresh) {
            if (index == null)
                return false;

            this.hiddens[index] = hidden;

            if (refresh == undefined || refresh) {
                this.rendergridcontent(true);
                return true;
            }
            return false;
        },

        _loadrows: function () {
            if (!this._pageviews[this.dataview.pagenum] && !this.pageable)
                return;

            var top = !this.pageable ? this._pageviews[this.dataview.pagenum].top : 0;
            if (!this.pageable && this._pagescache[this.dataview.pagenum] != undefined) {
                return null;
            }

            if (!this.virtualsizeinfo) {
                return;
            }

            var self = this.that;
            var storage = new Array();
            var datastorage = new Array();
            var hasgroups = self.groupable && self.groups.length > 0;
            var totalrows = this.dataview.totalrecords;
            var virtualheight = this.virtualsizeinfo.virtualheight;
            var rowindex = 0;

            this.rows.beginupdate();
            var pagesize = this.dataview.pagesize;
            if (this.pageable && hasgroups) {
                pagesize = this.dataview.rows.length;
            }

            for (var i = 0; i < pagesize; i++) {
                if (i >= this.dataview.rows.length)
                    break;

                var datarow = this.dataview.rows[i];
                var row = null;
                if (!self.rows.records[datarow.visibleindex]) {
                    row = new jqxGridRow(self, datarow);
                }
                else {
                    row = self.rows.records[datarow.visibleindex];
                    row.setdata(datarow);
                }

                row.hidden = this.hiddens[row.visibleindex];

                if (this.rowdetailstemplate) {
                    row.rowdetails = this.rowdetailstemplate.rowdetails;
                    row.rowdetailsheight = this.rowdetailstemplate.rowdetailsheight;
                    row.rowdetailshidden = this.rowdetailstemplate.rowdetailshidden;
                }

                var details = this.details[row.visibleindex];
                if (details) {
                    row.rowdetails = details.rowdetails;
                    row.rowdetailsheight = details.rowdetailsheight;
                    row.rowdetailshidden = details.rowdetailshidden;
                }
                else if (!this.rowdetailstemplate) {
                    row.rowdetails = null;
                }

                if (hasgroups && this.pageable && row.parentbounddata != null) {
                    var parentrow = storage[row.parentbounddata.uniqueid];
                    if (parentrow != null) {
                        var groupstate = this._findgroupstate(parentrow.uniqueid);

                        if (this._setsubgroupsvisibility) {
                            this._setsubgroupsvisibility(this, row.parentbounddata, !groupstate, false);
                        }

                        row.hidden = this.hiddens[row.visibleindex];
                    }

                    if (parentrow != null && parentrow != undefined) {
                        row.parentrow = parentrow;
                        parentrow.subrows[parentrow.subrows.length++] = row;
                    }
                }

                if (row.hidden)
                    continue;

                var num = datarow.visibleindex;
                if (!this.heights[num]) {
                    this.heights[num] = this.rowsheight;
                }

                row.height = this.heights[num];

                if (this.rowdetails) {
                    if (row.rowdetails && !row.rowdetailshidden) {
                        row.height += row.rowdetailsheight;
                    }
                }

                storage[row.uniqueid] = row;
                datastorage[rowindex++] = row;

                row.top = top;
                top += row.height;

                var recordindex = num;
                self.rows.replace(recordindex, row);
            }

            if ((this.autoheight || this.pageable) && this.autorowheight) {
                if (this._pageviews && this._pageviews.length > 0) {
                    this._pageviews[0].height = top;
                }
            }

            this.rows.resumeupdate();

            if (datastorage.length > 0) {
                this._pagescache[this.dataview.pagenum] = datastorage;
            }
        },

        _gettableheight: function () {
            if (this.tableheight != undefined)
                return this.tableheight;

            var realheight = this.host.height();

            if (this.columnsheader) {
                var columnheaderheight = this.columnsheader.outerHeight();
                if (!this.showheader) {
                    columnheaderheight = 0;
                }
            }

            realheight -= columnheaderheight;

            if (this.hScrollBar[0].style.visibility == 'visible') {
                realheight -= this.hScrollBar.outerHeight();
            }

            if (this.pageable) {
                realheight -= this.pager.outerHeight();
            }

            if (this._groupsheader()) {
                realheight -= this.groupsheader.outerHeight();
            }

            if (this.showtoolbar) {
                realheight -= this.toolbarheight;
            }

            if (this.showstatusbar) {
                realheight -= this.statusbarheight;
            }

            if (realheight > 0) {
                this.tableheight = realheight;
                return realheight;
            }

            return this.host.height();
        },

        _getpagesize: function () {
            if (this.pageable) {
                return this.pagesize;
            }

            if (this.virtualmode) {
                var hostHeight = Math.round(this.host.height()) + 2 * this.rowsheight;

                var visiblerecords = Math.round(hostHeight / this.rowsheight);
                return visiblerecords;
            }

            if (this.autoheight || this.autorowheight) {
                if (this.dataview.totalrows == 0)
                    return 1;
                return this.dataview.totalrows;
            }

            if (this.dataview.totalrows < 100 && this.dataview.totalrecords < 100 && this.dataview.totalrows > 0) {
                return this.dataview.totalrows;
            }

            return 100;
        },

        _calculatevirtualheight: function () {
            var self = this.that;

            var hostHeight = Math.round(this.host.height()) + 2 * this.rowsheight;
            realheight = this._gettableheight();
            var visiblerecords = Math.round(hostHeight / this.rowsheight);

            this.heights = new Array();
            this.hiddens = new Array();
            this.details = new Array();
            this.expandedgroups = new Array();
            this.hiddenboundrows = new Array();
            this.heightboundrows = new Array();
            this.detailboundrows = new Array();

            var totalrows = Math.max(this.dataview.totalrows, this.dataview.totalrecords);
            if (this.pageable) {
                totalrows = this.pagesize;
                if (this.pagesize > Math.max(this.dataview.totalrows, this.dataview.totalrecords) && this.autoheight) {
                    totalrows = Math.max(this.dataview.totalrows, this.dataview.totalrecords);
                }
                else if (!this.autoheight) {
                    if (this.dataview.totalrows < this.pagesize) {
                        totalrows = Math.max(this.dataview.totalrows, this.dataview.totalrecords);
                    }
                }
            }

            var virtualheight = totalrows * this.rowsheight;
            var top = 0;
            var index = 0;
            var lasttop = 0;
            var pagesize = this._getpagesize();
            var pageheight = pagesize * this.rowsheight;
            var i = 0;
            if (!this.pageable && this.autoheight) {
                visiblerecords = totalrows;
            }

            if (totalrows + pagesize > 0) {
                while (i <= totalrows + pagesize) {
                    top += pageheight;
                    if (i - pagesize < totalrows && i >= totalrows) {
                        var rows = i - totalrows;
                        if (rows > 0) {
                            lasttop -= pageheight;
                            this._pageviews[index - 1] = { top: lasttop, height: pageheight - rows * this.rowsheight };
                        }
                        break;
                    }
                    else {
                        this._pageviews[index++] = { top: lasttop, height: pageheight };
                    }
                    lasttop = top;
                    i += pagesize;
                }
            }

            if (this.resizingGrid != true) {
                this.vScrollBar.jqxScrollBar({ value: 0 });
            }
            if (virtualheight > realheight && !this.autoheight) {
                this.vScrollBar.css('visibility', 'visible');
                if (this.scrollmode == 'deferred') {
                    this.vScrollBar.jqxScrollBar({ max: virtualheight });
                }
                else {
                    this.vScrollBar.jqxScrollBar({ max: virtualheight - realheight });
                }
            }
            else {
                this.vScrollBar.css('visibility', 'hidden');
            }

            this.dataview.pagesize = pagesize;
            this.dataview.updateview();
            return { visiblerecords: visiblerecords, virtualheight: virtualheight };
        },

        _updatepageviews: function () {
            if (this.updating())
                return;
            this._pagescache = new Array();
            this._pageviews = new Array();
            this.tableheight = null;
            var self = this.that;
            var hostHeight = Math.round(this.host.height()) + 2 * this.rowsheight;
            var visiblerecords = Math.round(hostHeight / this.rowsheight);
            var totalrows = Math.max(this.dataview.totalrows, this.dataview.totalrecords);
            var virtualheight = totalrows * this.rowsheight;
            var top = 0;
            var currentheight = 0;
            var index = 0;
            var lasttop = 0;
            var k = 0;
            var pagesize = this._getpagesize();

            if (!this.pageable) {
                for (var i = 0; i < totalrows; i++) {
                    var rowinfo = { index: i, height: this.heights[i], hidden: this.hiddens[i], details: this.details[i] }
                    if (this.heights[i] == undefined) {
                        this.heights[i] = this.rowsheight;
                        rowinfo.height = this.rowsheight;
                    }
                    if (this.hiddens[i] == undefined) {
                        this.hiddens[i] = false;
                        rowinfo.hidden = false;
                    }
                    if (this.details[i] == undefined) {
                        this.details[i] = null;
                    }
                    if (rowinfo.height != self.rowsheight) {
                        virtualheight -= self.rowsheight;
                        virtualheight += rowinfo.height;
                    }

                    if (rowinfo.hidden) {
                        virtualheight -= rowinfo.height;
                    }
                    else {
                        currentheight += rowinfo.height;
                        var detailsheight = 0;
                        if (this.rowdetails) {
                            if (this.rowdetailstemplate) {
                                if (!rowinfo.details) rowinfo.details = this.rowdetailstemplate;
                            }

                            if (rowinfo.details && rowinfo.details.rowdetails && !rowinfo.details.rowdetailshidden) {
                                detailsheight = rowinfo.details.rowdetailsheight;
                                currentheight += detailsheight;
                                virtualheight += detailsheight;
                            }
                        }
                        top += rowinfo.height + detailsheight;
                    }

                    k++;
                    if (k >= pagesize || i == totalrows - 1) {
                        this._pageviews[index++] = { top: lasttop, height: currentheight };
                        currentheight = 0;
                        lasttop = top;
                        k = 0;
                    }
                }
            }
            else {
                if (this._updatepagedview) {
                    virtualheight = this._updatepagedview(totalrows, virtualheight, 0);
                }
                if (this.autoheight) {
                    this._arrange();
                }
            }

            var tableheight = this._gettableheight();
            if (virtualheight > tableheight) {
                if (this.pageable && this.gotopage) {
                    virtualheight = this._pageviews[0].height; // -this._gettableheight();
                    if (virtualheight < 0) {
                        virtualheight = this._pageviews[0].height;
                    }
                }

                if (this.vScrollBar.css('visibility') != 'visible') {
                    this.vScrollBar.css('visibility', 'visible');
                }
                if (virtualheight <= tableheight || this.autoheight) {
                    this.vScrollBar.css('visibility', 'hidden');
                }

                if (virtualheight - tableheight > 0) {
                    if (this.scrollmode != 'deferred') {
                        var max = virtualheight - tableheight;
                        var oldmax = this.vScrollInstance.max;
                        this.vScrollBar.jqxScrollBar({ max: max });
                        if (max != oldmax) {
                            this.vScrollBar.jqxScrollBar({ value: 0 });
                        }
                    }
                }
                else {
                    this.vScrollBar.jqxScrollBar({ value: 0, max: virtualheight });
                }
            }
            else {
                if (!this._loading) {
                    this.vScrollBar.css('visibility', 'hidden');
                }
                this.vScrollBar.jqxScrollBar({ value: 0 });
            }

            this._arrange();

            if (this.autoheight) {
                visiblerecords = Math.round(this.host.height() / this.rowsheight);
            }

            this.virtualsizeinfo = { visiblerecords: visiblerecords, virtualheight: virtualheight };
        },

        updatebounddata: function (reason) {
            if (reason != "sort" && reason != "filter" && reason != "cells" && reason != "pagechanged" && reason != "pagesizechanged" && !this.virtualmode) {
                this.virtualsizeinfo = null;
                if (this.showfilterrow && this.filterable && this.filterrow) {
                    if (this.clearfilters) {
                        this.clearfilters(false);
                    }
                    this.filterrow.remove();
                    this._filterrowcache = new Array();
                    this.filterrow = null;
                }
                else if (this.filterable) {
                    if (this.clearfilters) {
                        this.clearfilters(false);
                    }
                }

                if (this.groupable) {
                    this.dataview.groups = [];
                    this.groups = [];
                }

                if (this.pageable) {
                    this.pagenum = 0;
                    this.dataview.pagenum = 0;
                }
                if (this.sortable) {
                    this.sortcolumn = null;
                    this.sortdirection = '';
                    this.dataview.sortfielddirection = "";
                    this.dataview.clearsortdata();
                }
            }
            this.databind(this.source, reason);
        },

        refreshdata: function () {
            this._refreshdataview();
            this.render();
        },

        _updatevscrollbarmax: function () {
            if (this._pageviews && this._pageviews.length > 0) {
                var virtualheight = this._pageviews[0].height;
                if (this.virtualmode || !this.pageable) {
                    virtualheight = this.virtualsizeinfo.virtualheight;
                }

                var tableheight = this._gettableheight();
                if (virtualheight > tableheight) {
                    if (this.pageable && this.gotopage) {
                        virtualheight = this._pageviews[0].height;
                        if (virtualheight < 0) {
                            virtualheight = this._pageviews[0].height;
                        }
                    }

                    if (this.vScrollBar.css('visibility') != 'visible') {
                        this.vScrollBar.css('visibility', 'visible');
                    }
                    if (virtualheight <= tableheight || this.autoheight) {
                        this.vScrollBar.css('visibility', 'hidden');
                    }

                    if (virtualheight - tableheight > 0) {
                        var max = virtualheight - tableheight;
                        this.vScrollBar.jqxScrollBar({ max: max });
                    }
                    else {
                        this.vScrollBar.jqxScrollBar({ value: 0, max: virtualheight });
                    }
                }
                else {
                    this.vScrollBar.css('visibility', 'hidden');
                    this.vScrollBar.jqxScrollBar({ value: 0 });
                }
            }
        },

        _refreshdataview: function () {
            this.dataview.refresh();
        },

        refresh: function (initialRefresh) {
            if (initialRefresh != true) {
                if ($.jqx.isHidden(this.host))
                    return;

                if (this.virtualsizeinfo != null) {
                    //   this._requiresupdate = true;
                    this._cellscache = new Array();
                    this._renderrows(this.virtualsizeinfo);
                    this._updatesize();
                }
            }
        },

        render: function () {
            this._render(true, true, true, true);
        },

        invalidate: function () {
            if (this.virtualsizeinfo) {
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._renderrows(this.virtualsizeinfo);
            }
        },

        clear: function () {
            this.databind(null);
            this.render();
        },

        _preparecolumngroups: function()
        {
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
                        if (group.groups) {
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
                            throw new Error("jqxGrid: Column Groups initialization Error. Please, check the initialization of the jqxGrid's columns array. The columns in a column group cannot be pinned.");
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
                                throw new Error("jqxGrid: Column Groups initialization Error. Please, check the initialization of the jqxGrid's columns array. The columns in a column group are expected to be siblings in the columns array.");
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

        _render: function (initialization, forceupdate, rendercolumns, rendermenu, updatelistfilter) {
            if (this.dataview == null)
                return;

            if (this._loading) {
                return;
            }

            if ($.jqx.isHidden(this.host)) {
                var that = this;
                if (that.___hiddenTimer) {
                    clearInterval(that.___hiddenTimer);
                    that.___hiddenTimer = null;
                }

                this.___hiddenTimer = setInterval(function () {
                    if (!$.jqx.isHidden(that.host)) {
                        clearInterval(that.___hiddenTimer);
                        that.render();
                    }
                }, 300);
                return;
            }

            if (this.editcell != null && this.endcelledit) {
                this.endcelledit(this.editcell.row, this.editcell.column, true, false);
            }
            this.validationpopup = null;
            this._removeHandlers();
            this._addHandlers();
            this._initializeRows();

            this._requiresupdate = forceupdate != undefined ? forceupdate : true;
            this._newmax = null;

            if (rendercolumns) {
                if (!this._requiresupdate) {
                    if (rendermenu != false) {
                        this._initmenu();
                    }
                }

                if (this.columns == null) {
                    this.columns = new $.jqx.collection(this.element);
                }
                else {
                    this._initializeColumns();
                }
            }

            this.tableheight = null;
            this._pagescache = new Array();
            this._pageviews = new Array();
            this.visiblerows = new Array();
            this.hittestinfo = new Array();

            if (this._requiresupdate) {
                this._clearcaches();
                if (rendermenu == true) {
                    this._initmenu();
                }   
            }

            this.virtualsizeinfo = null;
            this.prerenderrequired = true;

            if ((this.groupable && this.groups.length > 0 && this.rowdetails) || (this.rowdetails)) {
                if (this.gridcontent) {
                    this._rowdetailscache = new Array();
                    this._rowdetailselementscache = new Array();
                    this.detailboundrows = new Array();
                    this.details = new Array();
                    $.jqx.utilities.html(this.gridcontent, '');
                    this.gridcontent = null;
                }
            }

            if (this.gridcontent) {
                if (this.editable && this._destroyeditors) {
                    this._destroyeditors();
                }
            }

            if (rendercolumns) {
                if (this.filterrow) this.filterrow.detach();
                $.jqx.utilities.html(this.content, '');
                this.columnsheader = this.columnsheader || $('<div style="overflow: hidden;"></div>');
                this.columnsheader.remove();
                this.columnsheader.addClass(this.toTP('jqx-widget-header'));
                this.columnsheader.addClass(this.toTP('jqx-grid-header'));
            }
            else {
                if (this.gridcontent) {
                    $.jqx.utilities.html(this.gridcontent, '');
                }
            }

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

            if (this.showfilterrow && this.filterable) {
                this.columnsheader.height(columnsheight + this.filterrowheight);
            }
            else {
                this.columnsheader.height(columnsheight);
            }

            this.content.append(this.columnsheader);
            this.content.append(this.gridcontent);
            this._arrange();

            if (this._initgroupsheader) {
                this._initgroupsheader();
            }

            this.selectionarea = this.selectionarea || $("<div style='z-index: 99999; visibility: hidden; position: absolute;'></div>");
            this.selectionarea.addClass(this.toThemeProperty('jqx-grid-selectionarea'));
            this.selectionarea.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this.content.append(this.selectionarea);
            this.tableheight = null;

            this.rendergridcontent(false, rendercolumns);
            if (this.groups.length > 0 && this.groupable) {
                var vScrollVisibility = this.vScrollBar[0].style.visibility;
                this.suspendgroupevents = true;
                if (this.collapseallgroups) {
                    if (!this.groupsexpandedbydefault) {
                        this.collapseallgroups(false);
                        this._updatescrollbarsafterrowsprerender();
                    }
                    else {
                        this.expandallgroups(false);
                    }
                }
                if (this.vScrollBar[0].style.visibility != vScrollVisibility) {
                    this._updatecolumnwidths();
                    this._updatecellwidths();
                }
                this.suspendgroupevents = false;
            }

            if (this.pageable && this.updatepagerdetails) {
                this.updatepagerdetails();
                if (this.autoheight) {
                    this._updatepageviews();
                }
                if (this.autorowheight) {
                    if (!this.autoheight) {
                        this._updatepageviews();
                    }
                    this._renderrows(this.virtualsizeinfo);
                }
            }

            if (this.showaggregates && this._updateaggregates) {
                this._updateaggregates();
            }

            this._addoverlayelement();
            if (this.scrollmode == "deferred") {
                this._addscrollelement();
            }

            if (this.showfilterrow && this.filterable && this.filterrow && (updatelistfilter == undefined || updatelistfilter == true)) {
                this._updatelistfilters(!rendercolumns);
            }

            // callback when the rendering is complete.
            if (this.rendered) {
                this.rendered('full');
            }
            this.__isRendered = true;
        },

        _addoverlayelement: function () {
            if (this.autoheight) {
                if (this._overlayElement) {
                    this._overlayElement.remove();
                }
                this._updateTouchScrolling();
                return;
            }

            var browserInfo = $.jqx.utilities.getBrowser();
            if ((browserInfo.browser == 'msie' && parseInt(browserInfo.version) < 9) || this.isTouchDevice()) {
                if (this._overlayElement) {
                    this._overlayElement.remove();
                }
                this._overlayElement = $("<div style='visibility: hidden; position: absolute; width: 100%; height: 100%;'></div>");
                this._overlayElement.css('background', 'white');
                this._overlayElement.css('z-index', 18000);
                this._overlayElement.css('opacity', 0.001);
                if (this.isTouchDevice()) {
                    if (this.vScrollBar.css('visibility') !== "hidden" || this.hScrollBar.css('visibility') !== "hidden") {
                     //   this.table.prepend(this._overlayElement);
                     //   this._overlayElement.css('visibility', 'visible');
                        var leftOffset = 0;
                        if (this.selectionmode == "checkbox") {
                            leftOffset += 30;
                        }
                        if (this.groupable || this.rowdetails) {
                            this._overlayElement.css('left', 30 * (this.groups.length + (this.rowdetails ? 1 : 0)));
                        }
                        var left = this._overlayElement.css('left');
                        this._overlayElement.css('left', left + leftOffset);
                    }
                    else {
                        if (this._overlayElement) {
                            this._overlayElement.remove();
                        }
                    }
                }
                else {
                    this.content.prepend(this._overlayElement);
                }
            }
            this._updateTouchScrolling();
        },

        _addscrollelement: function () {
            if (this._scrollelement) {
                this._scrollelement.remove();
            }
            if (this._scrollelementoverlay) {
                this._scrollelementoverlay.remove();
            }

            this._scrollelementoverlay = $("<div style='visibility: hidden; position: absolute; width: 100%; height: 100%;'></div>");
            this._scrollelementoverlay.css('background', 'black');
            this._scrollelementoverlay.css('z-index', 18000);
            this._scrollelementoverlay.css('opacity', 0.1);

            this._scrollelement = $("<span style='visibility: hidden; top: 50%; right: 10px; position: absolute;'></span>");
            this._scrollelement.css('z-index', 18005);
            this._scrollelement.addClass(this.toThemeProperty('jqx-button'));
            this._scrollelement.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            this._scrollelement.addClass(this.toThemeProperty('jqx-rc-all'));
            this._scrollelement.addClass(this.toThemeProperty('jqx-shadow'));
            this.content.prepend(this._scrollelement);
            this.content.prepend(this._scrollelementoverlay);
        },

        rendergridcontent: function (requiresupdate, rendercolumns) {
            if (this.updating()) {
                return false;
            }

            if (requiresupdate == undefined || requiresupdate == null) {
                requiresupdate = false;
            }

            this._requiresupdate = requiresupdate;

            var prerender = this.prerenderrequired;
            if (this.prerenderrequired) {
                this._arrange();
            }

            var me = this.that;
            var rendercolumns = rendercolumns;
            if (rendercolumns == null || rendercolumns == undefined) {
                rendercolumns = true;
            }

            this.tableheight = null;
            me.virtualsizeinfo = me.virtualsizeinfo || me._calculatevirtualheight();
            if (me.pageable && !me.autoheight) {
                if (me.dataview.totalrows < me.pagesize) {
                    me._requiresupdate = true;
                }
            }

            if (rendercolumns) {
                me._rendercolumnheaders();
            }
            else {
                if (this._rendersortcolumn) {
                    this._rendersortcolumn();
                }
                if (this._renderfiltercolumn) {
                    this._renderfiltercolumn();
                }
            }

            me._renderrows(me.virtualsizeinfo);

            if (this.gridcontent) {
                if (this.gridcontent[0].scrollTop != 0) {
                    this.gridcontent[0].scrollTop = 0;
                }

                if (this.gridcontent[0].scrollLeft != 0) {
                    this.gridcontent[0].scrollLeft = 0;
                }
            }

            if (prerender) {
                var tableheight = this.tableheight;
                this._arrange();
                if (tableheight != this.tableheight && this.autoheight) {
                    me._renderrows(me.virtualsizeinfo);
                }
            }

            if (this.rtl) {
                this._renderhorizontalscroll();
            }

            if (this.autosavestate) {
                if (this.initializedcall != null) {
                    if (this.savestate) {
                        this.savestate();
                    }
                }
            }

            return true;
        },

        _updatecolumnwidths: function () {
            var totalwidth = this.host.width();
            var hostwidth = totalwidth;
            var allcharacters = '';
            if (this.columns == undefined || this.columns.records == undefined)
                return;

            var self = this.that;
            var indent = this.rowdetails && this.showrowdetailscolumn ? (1 + this.groups.length) * this.groupindentwidth : (this.groups.length) * this.groupindentwidth;

            $.each(this.columns.records, function (i, value) {
                if (!(this.hidden && this.hideable)) {
                    if (this.width.toString().indexOf('%') != -1 || this._percentagewidth != undefined) {
                        var value = 0;
                        var offset = self.vScrollBar[0].style.visibility == 'hidden' ? 0 : self.scrollbarsize + 5;
                        var w = hostwidth;
                        value = parseFloat(this.width) * w / 100;
                        offset += indent;
                        if (this._percentagewidth != undefined) {
                            value = parseFloat(this._percentagewidth) * (w - offset) / 100;
                        }

                        if (value < this.minwidth && this.minwidth != 'auto') value = this.minwidth;
                        if (value > this.maxwidth && this.maxwidth != 'auto') value = this.maxwidth;
                        totalwidth -= value;
                    }
                    else if (this.width != 'auto' && !this._width) {
                        totalwidth -= this.width;
                    }
                    else {
                        allcharacters += this.text;
                    }
                }
            });

            var tableheight = this._gettableheight();

            if (!this.autoheight) {
                if (this.virtualsizeinfo && this.virtualsizeinfo.virtualheight > tableheight) {
                    if (this.groupable && this.groups.length > 0) {
                        if (this.dataview && this.dataview.loadedrootgroups && !this.groupsexpandedbydefault) {
                            var groupsheight = this.dataview.loadedrootgroups.length * this.rowsheight;
                            if (this.pageable) {
                                for (var q = 0; q < this.dataview.rows.length; q++) {
                                    if (this.dataview.rows[q].group && this.dataview.rows[q].level === 0) {
                                        groupsheight += this.rowsheight;
                                    }
                                }
                            }
                            
                            if (groupsheight > tableheight) {
                                totalwidth -= this.scrollbarsize + 5;
                                hostwidth -= this.scrollbarsize + 5;
                            }
                            else if (this.vScrollBar.css('visibility') == 'visible') {
                                totalwidth -= this.scrollbarsize + 5;
                                hostwidth -= this.scrollbarsize + 5;
                            }
                        }
                        else {
                            totalwidth -= this.scrollbarsize + 5;
                            hostwidth -= this.scrollbarsize + 5;
                        }
                    }
                    else {
                        totalwidth -= this.scrollbarsize + 5;
                        hostwidth -= this.scrollbarsize + 5;
                    }
                }
            }
            var indent = this.rowdetails && this.showrowdetailscolumn ? (1 + this.groups.length) * this.groupindentwidth : (this.groups.length) * this.groupindentwidth;
            hostwidth -= indent;

            if (!this.columnsheader) {
                return;
            }

            var columnheader = this.columnsheader.find('#columntable' + this.element.id);
            if (columnheader.length == 0)
                return;

            var columns = columnheader.find('.jqx-grid-column-header');
            var left = 0;
            $.each(this.columns.records, function (i, value) {
                var column = $(columns[i]);
                var percentage = false;
                var desiredwidth = this.width;
                if (this.width.toString().indexOf('%') != -1 || this._percentagewidth != undefined) {
                    if (this._percentagewidth != undefined) {
                        desiredwidth = parseFloat(this._percentagewidth) * hostwidth / 100;
                    }
                    else {
                        desiredwidth = parseFloat(this.width) * hostwidth / 100;
                    }
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
                else  {
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
                    if (width < this.minwidth) {
                        width = this.minwidth;
                    }
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

                if (!(this.hidden && this.hideable)) {
                    left += this.width;
                }

                this._requirewidthupdate = true;
            });
            this.columnsheader.width(2 + left);
            columnheader.width(this.columnsheader.width());
            if (left == 0)
                this.columnsheader[0].style.visibility = "hidden";
            else
                this.columnsheader[0].style.visibility = "visible";

            this._resizecolumngroups();
            if (this.showfilterrow && this.filterrow) {
                this.filterrow.width(this.columnsheader.width());
                this._updatefilterrowui();
            }
            if (this.autowidth) {
                this._arrange();
            }
        },

        _rendercolumnheaders: function () {
            var self = this.that;

            if (!this.prerenderrequired) {
                if (this._rendersortcolumn) {
                    this._rendersortcolumn();
                }
                if (this._renderfiltercolumn) {
                    this._renderfiltercolumn();
                }
                if (this.showfilterrow && this.filterrow) {
                    this.filterrow.width(this.columnsheader.width());
                    this._updatefilterrowui();
                }
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
            var indent = this.rowdetails && this.showrowdetailscolumn ? (1 + this.groups.length) * this.groupindentwidth : (this.groups.length) * this.groupindentwidth;

            $.each(this.columns.records, function (i, value) {
                if (!(this.hidden && this.hideable)) {
                    if (this.width != 'auto' && !this._width) {
                        if (this.width < this.minwidth && this.minwidth != 'auto') {
                            totalwidth -= this.minwidth;
                        }
                        else if (this.width > this.maxwidth && this.maxwidth != 'auto') {
                            totalwidth -= this.maxwidth;
                        }
                        else if (this.width.toString().indexOf('%') != -1) {
                            var value = 0;
                            var offset = self.vScrollBar[0].style.visibility == 'hidden' ? 0 : self.scrollbarsize + 5;
                            offset += indent;
                            value = parseFloat(this.width) * (hostwidth-offset) / 100;
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
                    if (self._haspinned) {
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
            var groupslength = self.groupable ? self.groups.length : 0;
            if (this.rowdetails && this.showrowdetailscolumn) {
                groupslength++;
            }

            var headerheight = self.columnsheader.height();
            if (this.showfilterrow) {
                if (!this.columngroups) {
                    headerheight = this.columnsheight;
                }
                else {
                    headerheight -= this.filterrowheight;
                }
            }
            var tableheight = this._gettableheight();

            if (this.virtualsizeinfo && this.virtualsizeinfo.virtualheight > tableheight) {
                if (this.groupable && this.groups.length > 0) {
                    if (this.dataview && this.dataview.loadedrootgroups && !this.groupsexpandedbydefault) {
                        var groupsheight = 0;
                        if (!this.pageable) {
                            var groupsheight = this.dataview.loadedrootgroups.length * this.rowsheight;
                        }
                        else if (this.pageable) {
                            for (var q = 0; q < this.dataview.rows.length; q++) {
                                if (this.dataview.rows[q].group && this.dataview.rows[q].level === 0) {
                                    groupsheight += this.rowsheight;
                                }
                            }
                        }
                        if (groupsheight > tableheight) {
                            totalwidth -= this.scrollbarsize + 5;
                            hostwidth -= this.scrollbarsize + 5;
                        }
                    }
                    else {
                        totalwidth -= this.scrollbarsize + 5;
                        hostwidth -= this.scrollbarsize + 5;
                    }
                }
                else {
                    if (!this.autoheight) {
                        totalwidth -= this.scrollbarsize + 5;
                        hostwidth -= this.scrollbarsize + 5;
                    }
                }
            }

            hostwidth -= indent;

            var getcolumnheight = function (datafield, column) {
                var height = self.columngroupslevel * self.columnsheight;
                height = height - (column.level * self.columnsheight);
                return height;
            }

            $.each(this.columns.records, function (i, value) {
                this.height = self.columnsheight;
                if (self.columngroups) {
                    if (self.columngroups.length) {
                        this.height = getcolumnheight(this.datafield, this);
                        headerheight = this.height;
                    }
                }

                var classname = self.toTP('jqx-grid-column-header') + " " + self.toTP('jqx-widget-header');
                if (self.rtl) {
                    classname += " " + self.toTP('jqx-grid-column-header-rtl');
                }

                var pinnedZIndex = !self.rtl ? 150 + zindex-1 : 150 + zindex+1;
                var columnZIndex = !self.rtl ? zindex-- : zindex++;

                var column = $('<div role="columnheader" style="z-index: '  + columnZIndex + ';position: absolute; height: 100%;" class="' + classname + '"><div style="height: 100%; width: 100%;"></div></div>');

                if (self.columngroups) {
                    column[0].style.height = headerheight + 'px';
                    column[0].style.bottom = '0px';

                    if (this.pinned) {
                        column[0].style.zIndex = pinnedZIndex;
                    }
                }

                this.uielement = column;
                if (this.classname != '' && this.classname) {
                    column.addClass(this.classname);
                }

                var desiredwidth = this.width;
                var percentage = false;
                if (this.width === null) this.width = "auto";
                if (this.width.toString().indexOf('%') != -1 || this._percentagewidth != undefined) {
                    if (this._percentagewidth != undefined) {
                        desiredwidth = parseFloat(this._percentagewidth) * hostwidth / 100;
                    }
                    else {
                        desiredwidth = parseFloat(this.width) * hostwidth / 100;
                    }
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
                else if (!this.hidden){
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
                    if (width < this.minwidth) {
                        width = this.minwidth;
                    }
                    if (width > this.maxwidth) {
                        width = this.maxwidth;
                    }

                    this._width = 'auto';
                    this.width = width;
                    desiredwidth = this.width;
                    column.width(this.width);
                }

                if (this.hidden && this.hideable) {
                    column.css('display', 'none');
                }

                var columncontentcontainer = $(column.children()[0]);
                var menuinnerelementclassname = self.rtl ? self.toTP('jqx-grid-column-menubutton') + " " + self.toTP('jqx-grid-column-menubutton-rtl') : self.toTP('jqx-grid-column-menubutton');
                menuinnerelementclassname += " " + self.toTP('jqx-icon-arrow-down');
                var columnsmenu = $('<div style="height: ' + headerheight + 'px; display: none; left: 100%; top: 0%; position: absolute;"><div class="' + menuinnerelementclassname + '" style="width: 100%; height:100%;"></div></div>');

                if (!self.enableanimations) {
                    columnsmenu.css('margin-left', -16);
                }
                if (self.rtl) {
                    columnsmenu.css('left', '0px');
                }

                this.columnsmenu = columnsmenu[0];
                columnheader[0].cells[i] = column[0];
                columnsmenu[0].style.width = parseInt(self.columnsmenuwidth) + 'px';
                var showcolumnsmenu = self.columnsmenu;
                var shouldhandledragdrop = false;
                var detailscolumn = false;

                var isgroupcolumn = (self.groupable && groupslength > 0 && k < groupslength) || (self.rowdetails && k < groupslength);
                if (self.rtl) {
                    isgroupcolumn = (self.groupable && groupslength > 0 && k < groupslength) || (self.rowdetails && k < groupslength);
                    isgroupcolumn &= i > self.columns.records.length - 1 - groupslength;
                }

                if (isgroupcolumn) {
                    k++;
                    showcolumnsmenu &= false;
                    this.sortable = false;
                    this.editable = false;
                    detailscolumn = true;
                }
                else {
                    var columnContent = this.renderer != null ? this.renderer(this.text, this.align, headerheight) : self._rendercolumnheader(this.text, this.align, headerheight, self);
                    if (columnContent == null) {
                        columnContent = self._rendercolumnheader(this.text, this.align, headerheight, self);
                    }
                    if (this.renderer != null) columnContent = $(columnContent);
                    showcolumnsmenu &= true;
                    shouldhandledragdrop = true;
                }
                if (self.WinJS) {
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
                        + '<div class="filtericon ' + self.toTP('jqx-widget-header') + '" style="height: ' + headerheight + 'px; float: right; display: none; width: 16px;"><div class="' + self.toTP('jqx-grid-column-filterbutton') + '" style="width: 100%; height:100%;"></div></div>'
                        + '<div class="sortasc ' + self.toTP('jqx-widget-header') + '" style="height: ' + headerheight + 'px; float: right; display: none; width: 16px;"><div class="' + self.toTP('jqx-grid-column-sortascbutton') + ' ' + self.toTP('jqx-icon-arrow-up') + '" style="width: 100%; height:100%;"></div></div>'
                        + '<div class="sortdesc ' + self.toTP('jqx-widget-header') + '" style="height: ' + headerheight + 'px; float: right; display: none; width: 16px;"><div class="' + self.toTP('jqx-grid-column-sortdescbutton') + ' ' + self.toTP('jqx-icon-arrow-down') + '" style="width: 100%; height:100%;"></div></div>'
                        + '</div>');
                    columnsmenu.addClass(self.toTP('jqx-widget-header'));
                    columncontentcontainer.append(iconscontainer);

                    var iconschildren = iconscontainer.children();
                    this.sortasc = iconschildren[1];
                    this.sortdesc = iconschildren[2];
                    this.filtericon = iconschildren[0];

                    this.iconscontainer = iconscontainer;
                    if (self.rtl) {
                        iconscontainer.css('margin-left', '0px');
                        iconscontainer.css('left', '0px');
                        $(this.sortasc).css('float', 'left');
                        $(this.filtericon).css('float', 'left');
                        $(this.sortdesc).css('float', 'left');
                    }
                    if (!self.autoshowfiltericon && this.filterable) {
                         $(this.filtericon).css('display', 'block');
                    }

                }

                if (showcolumnsmenu) {
                    self._handlecolumnsmenu(self, columncontentcontainer, column, columnsmenu, this);
                    if (!this.menu) columnsmenu.hide();
                }

                columnheader.append(column);

                if (self.groupable && shouldhandledragdrop) {
                    column[0].id = self.dataview.generatekey();
                    if (self._handlecolumnstogroupsdragdrop) {
                        self._handlecolumnstogroupsdragdrop(this, column);
                    }
                    else throw new Error('jqxGrid: Missing reference to jqxgrid.grouping.js.');
                }
                if (self.columnsreorder && this.draggable && self._handlecolumnsdragreorder) {
                    self._handlecolumnsdragreorder(this, column);
                }

                var columnitem = this;
                self.addHandler(column, 'click', function (event) {
                    if (columnitem.checkboxcolumn)
                        return true;

                    if (self.sorttogglestates > 0 && self._togglesort) {
                        if (!self._loading) {
                            self._togglesort(columnitem);
                        }
                    }
                    event.preventDefault();
                    self._raiseEvent(7, { column: columnitem.getcolumnproperties(), datafield: columnitem.datafield, originalEvent: event });
                });

                if (columnitem.resizable && self.columnsresize && !detailscolumn) {
                    var isTouchDevice = false;
                    var eventname = 'mousemove';
                    if (self.isTouchDevice() && self.touchmode !== true) {
                        isTouchDevice = true;
                        eventname = $.jqx.mobile.getTouchEventName('touchstart');
                    }
                    self.addHandler(column, eventname, function (event) {
                        var pagex = parseInt(event.pageX);
                        var offset = 5;
                        var columnleft = parseInt(column.coord().left);
                        if (self.hasTransform) {
                            columnleft = $.jqx.utilities.getOffset(column).left;
                        }
                        if (self.resizing) {
                            return true;
                        }

                        if (self._handlecolumnsresize) {
                            if (isTouchDevice) {
                                var touches = self.getTouches(event);
                                var touch = touches[0];
                                pagex = touch.pageX;
                                offset = 40;
                                if (pagex >= columnleft + columnitem.width - offset) {
                                    self.resizablecolumn = { columnelement: column, column: columnitem };
                                    column.css('cursor', "col-resize");
                                }
                                else {
                                    column.css('cursor', "");
                                    self.resizablecolumn = null;
                                }
                                return true;
                            }

                            var colwidth = columnitem.width;
                            if (self.rtl) colwidth = 0;

                            if (pagex >= columnleft + colwidth - offset) {
                                if (pagex <= columnleft + colwidth + offset) {
                                    self.resizablecolumn = { columnelement: column, column: columnitem };
                                    column.css('cursor', "col-resize");
                                    return false;
                                }
                                else {
                                    column.css('cursor', "");
                                    self.resizablecolumn = null;
                                }
                            }
                            else {
                                column.css('cursor', "");
                                if (pagex < columnleft + colwidth - offset) {
                                    if (!columnitem._animating && !columnitem._menuvisible) {
                                        column.mouseenter();
                                    }
                                }

                                self.resizablecolumn = null;
                            }
                        }
                    });
                }

                column.css('left', left);

                if (!(this.hidden && this.hideable)) {
                    left += desiredwidth;
                }

                if (columnitem.rendered) {
                    var result = columnitem.rendered($(columncontentcontainer[0].firstChild), columnitem.align, headerheight);
                    if (result && iconscontainer != null) {
                        iconscontainer.hide();
                    }
                }
                if (columnitem.checkboxcolumn) {
                    if (iconscontainer) {
                        iconscontainer.hide();
                    }
                    if (!self.host.jqxCheckBox) {
                        throw new Error("jqxGrid: Missing reference to jqxcheckbox.js");
                    }

                    columncontentcontainer.html('<div style="cursor: pointer; margin-left: 5px; top: 50%; margin-top: -8px; position: relative;"></div>');
                    var checkboxelement = columncontentcontainer.find('div:first');
                    checkboxelement.jqxCheckBox({_canFocus: false, disabledContainer: true, theme: self.theme, enableContainerClick: false, width: 16, height: 16, animationShowDelay: 0, animationHideDelay: 0 });
                    columnitem.checkboxelement = checkboxelement;
                    var checkboxinstance = checkboxelement.data().jqxCheckBox.instance;
                    self._checkboxcolumn = columnitem;
                    checkboxinstance.updated = function (event, checked, oldchecked) {
                        self._checkboxcolumnupdating = true;
                        if (checked) {
                            self.selectallrows();
                        }
                        else {
                            self.clearselection(true, false);
                        }
                        self._checkboxcolumnupdating = false;
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
            self.columnsheader.append(columnheader);
            if (this.showfilterrow && this._updatefilterrow) {
                if (!this.columngroups) {
                    columnheader.height(this.columnsheight);
                }
                else {
                    columnheader.height(this.columngroupslevel*this.columnsheight);                    
                }

                if (!this.filterrow) {
                    var filterrow = $("<div></div>");
                    filterrow[0].id = "filterrow." + this.element.id;
                    filterrow.height(this.filterrowheight);
                    this.filterrow = filterrow;
                }
                this.filterrow.width(left);

                this.columnsheader.append(this.filterrow);
                this._updatefilterrow();
            }

            if (left == 0)
                columnheader[0].style.visibility = "hidden";
            else
                columnheader[0].style.visibility = "inherit";

            columnheader.width(left);
            if (this._handlecolumnsdragdrop) {
                this._handlecolumnsdragdrop();
            }
            if (this._handlecolumnsreorder) {
                this._handlecolumnsreorder();
            }
            if (this._rendersortcolumn) {
                this._rendersortcolumn();
            }
            if (this._renderfiltercolumn) {
                this._renderfiltercolumn();
            }
            if (this._handlecolumnsresize) {
                this._handlecolumnsresize();
            }
            if (this.columngroups) {
                this._rendercolumngroups();
            }
            if (this._updatecheckboxselection) {
                this._updatecheckboxselection();
            }
        },

        _rendercolumngroups: function()
        {
            if (!this.columngroups) return;
            var pinnedColumns = 0;
            for (var i = 0; i < this.columns.records.length; i++) {
                if (this.columns.records[i].pinned) pinnedColumns++;
            }

            var zindex = this.headerZIndex - pinnedColumns + this.columns.records.length;
            var self = this.that;
            var classname = self.toTP('jqx-grid-column-header') + " " + self.toTP('jqx-grid-columngroup-header') + " " + self.toTP('jqx-widget-header');
            if (self.rtl) {
                classname += " " + self.toTP('jqx-grid-columngroup-header-rtl');
            }
            var columnheader = this.columnsheader.find('#columntable' + this.element.id);
            columnheader.find('jqx-grid-columngroup-header').remove();

            for (var j = 0; j < this.columngroupslevel-1; j++) {
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
                                        left = Math.min(parseInt(currentgroup.element.style.left), left);
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
                        if (group.renderer) {
                            var element = $("<div style='height: 100%; width: 100%;'></div>");
                            var content = group.renderer(group.text, group.align, height);
                            element.html(content);
                        }

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
                        if (group.rendered) {
                            group.rendered(element, group.align, height);
                        }
                    }
                }
            }
        },

        _resizecolumngroups: function()
        {
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
                                if (!currentgroup.hidden) {
                                    width += currentgroup.width;
                                    left = Math.min(parseInt(currentgroup.element.style.left), left);
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
                    var column = group.element;
                    column[0].style.left = left + 'px';
                    column[0].style.top = top + 'px';
                    column[0].style.height = height + 'px';
                    column[0].style.width = -1 + group.width + 'px';
                }
            }
        },

        _handlecolumnsmenu: function (self, columncontentcontainer, column, columnsmenu, columnitem) {
            self.dragmousedown = null;
            columnsmenu[0].id = self.dataview.generatekey();

            columncontentcontainer.append(columnsmenu);
            column[0].columnsmenu = columnsmenu[0];
            columnitem.element = column[0];

            var menuoffset = this.columnsmenuwidth + 1;

            var showcolumnsmenu = function () {
                if (!columnitem.menu)
                    return false;

                if (!self.resizing) {
                    if (columnitem._menuvisible && self._hasOpenedMenu) return false;

                    columnitem._animating = true;
                    if (self.menuitemsarray && self.menuitemsarray.length > 0) {
                        if (!self.enableanimations) {
                            columnsmenu.css('display', 'block');
                            var left = !self.rtl ? -48 : 16;
                            columnitem.iconscontainer.css('margin-left', left + 'px');
                            columnitem._animating = false;
                            columnitem._menuvisible = true;
                        }
                        else {
                            columnsmenu.css('display', 'block');
                            columnsmenu.stop();
                            columnitem.iconscontainer.stop();
                            if (!self.rtl) {
                                columnsmenu.css('margin-left', '0px');
                                columnsmenu.animate({
                                    'margin-left': -menuoffset
                                }, 'fast', function () {
                                    columnsmenu.css('display', 'block');
                                    columnitem._animating = false;
                                    columnitem._menuvisible = true;
                                }
                                );
                            }
                            else {
                                columnsmenu.css('margin-left', -menuoffset);
                                columnsmenu.animate({
                                    'margin-left': '0px'
                                }, 'fast', function () {
                                    columnsmenu.css('display', 'block');
                                    columnitem._animating = false;
                                    columnitem._menuvisible = true;
                                }
                                );
                            }

                            var left = !self.rtl ? -(32+menuoffset) : menuoffset;
                            columnitem.iconscontainer.animate({
                                'margin-left': left
                            }, 'fast');
                        }
                    }
                }
            }
            
            var enterEventName = "mouseenter";
            if (self.isTouchDevice()) {
                enterEventName = "touchstart";
            }

            self.addHandler(column, enterEventName, function (event) {
                var pagex = parseInt(event.pageX);
                var offset = self.columnsresize && columnitem.resizable ? 3 : 0;
                var columnleft = parseInt(column.coord().left);
                if (self.hasTransform) {
                    columnleft = $.jqx.utilities.getOffset(column).left;
                }
              
                var colwidth = columnitem.width;
                if (self.rtl) colwidth = 0;

                if (offset != 0) {
                    if (pagex >= columnleft + colwidth - offset) {
                        if (pagex <= columnleft + colwidth + offset) {
                            return false;
                        }
                    }
                }

                var scrolling = self.vScrollInstance.isScrolling();
                if (columnitem.menu && self.autoshowcolumnsmenubutton && !scrolling) {
                    showcolumnsmenu();
                }
            });

            if (!self.autoshowcolumnsmenubutton) {
                columnsmenu.css('display', 'block');
                var left = !self.rtl ? -48 : 16;
                columnitem.iconscontainer.css('margin-left', left + 'px');
                if (!self.rtl) {
                    columnsmenu.css({ 'margin-left': -menuoffset });
                }
                else {
                    columnsmenu.css({ 'margin-left': '0px' });
                }
            }

            self.addHandler(column, 'mouseleave', function (event) {
                if (self.menuitemsarray && self.menuitemsarray.length > 0 && columnitem.menu) {
                    var menu = $.data(document.body, "contextmenu" + self.element.id);
                    if (menu != undefined && columnsmenu[0].id == menu.columnsmenu.id) {
                        return;
                    }

                    if (self.autoshowcolumnsmenubutton) {
                        if (!self.enableanimations) {
                            columnsmenu.css('display', 'none');
                            var left = !self.rtl ? -32 : 0;
                            columnitem.iconscontainer.css('margin-left', left + 'px');
                            columnitem._menuvisible = false;
                        }
                        else {
                            if (!self.rtl) {
                                columnsmenu.css('margin-left', -menuoffset);
                            }
                            else columnsmenu.css('margin-left', '0px');

                            columnsmenu.stop();
                            columnitem.iconscontainer.stop();
                            if (!self.rtl) {
                                columnsmenu.animate({
                                    'margin-left': 0
                                }, 'fast', function () {
                                    columnsmenu.css('display', 'none');
                                    columnitem._menuvisible = false;
                                });
                            }
                            else {
                                columnsmenu.animate({
                                    'margin-left': -menuoffset
                                }, 'fast', function () {
                                    columnsmenu.css('display', 'none');
                                    columnitem._menuvisible = false;
                                });
                            }

                            var left = !self.rtl ? -32 : 0;
                            columnitem.iconscontainer.animate({
                                'margin-left': left
                            }, 'fast');
                        }
                    }
                }
            });

            var canopen = true;
            var openedmenu = "";
            var $filtericon = $(columnitem.filtericon);

            self.addHandler(columnsmenu, 'mousedown', function (event) {
                if (!self.gridmenu) self._initmenu();
                canopen = !$.data(self.gridmenu[0], 'contextMenuOpened' + self.gridmenu[0].id);
                openedmenu = $.data(document.body, "contextmenu" + self.element.id);
                if (openedmenu != null) {
                    openedmenu = openedmenu.column.datafield;
                }
            });

            self.addHandler($filtericon, 'mousedown', function (event) {
                if (!self.gridmenu) self._initmenu();
                canopen = !$.data(self.gridmenu[0], 'contextMenuOpened' + self.gridmenu[0].id);
                openedmenu = $.data(document.body, "contextmenu" + self.element.id);
                if (openedmenu != null) {
                    openedmenu = openedmenu.column.datafield;
                }
            });

            var opencolumnsmenu = function () {
                if (!columnitem.menu)
                    return false;

                if (!self.gridmenu) {
                    self._initmenu();
                }

                var offset = columnsmenu.coord(true);
                var top = columnsmenu.height();

                if (!canopen) {
                    canopen = true;

                    if (openedmenu == columnitem.datafield) {
                        self._closemenu();
                        return false;
                    }
                }

                var hostOffset = self.host.coord(true);
                if (self.hasTransform) {
                    hostOffset = $.jqx.utilities.getOffset(self.host);
                    offset = $.jqx.utilities.getOffset(columnsmenu);
                }

                if (hostOffset.left + self.host.width() > parseInt(offset.left) + self.gridmenu.width()) {
                    self.gridmenu.jqxMenu('open', offset.left, offset.top + top);
                }
                else {
                    self.gridmenu.jqxMenu('open', columnsmenu.width() + offset.left - self.gridmenu.width(), offset.top + top);
                }
                if (self.gridmenu.width() < 100) {
                    self._arrangemenu();
                }
                self._hasOpenedMenu = true;

                var sortascmenuitem = self._getmenuitembyindex(0);
                var sortdescmenuitem = self._getmenuitembyindex(1);
                var sortremovemenuitem = self._getmenuitembyindex(2);
                var groupmenuitem = self._getmenuitembyindex(3);
                var groupremoveitem = self._getmenuitembyindex(4);
                var filteritem = self._getmenuitembyindex(5);

                if (sortascmenuitem != null && sortdescmenuitem != null && sortremovemenuitem != null) {
                    var sortable = columnitem.sortable && self.sortable;
                    self.gridmenu.jqxMenu('disable', sortascmenuitem.id, !sortable);
                    self.gridmenu.jqxMenu('disable', sortdescmenuitem.id, !sortable);
                    self.gridmenu.jqxMenu('disable', sortremovemenuitem.id, !sortable);

                    if (columnitem.datafield) {
                        if (self.sortcolumn == columnitem.datafield) {
                            var sortinfo = self.getsortinformation();
                            if (sortable) {
                                if (sortinfo.sortdirection.ascending) {
                                    self.gridmenu.jqxMenu('disable', sortascmenuitem.id, true);
                                }
                                else {
                                    self.gridmenu.jqxMenu('disable', sortdescmenuitem.id, true);
                                }
                            }
                        }
                        else {
                            self.gridmenu.jqxMenu('disable', sortremovemenuitem.id, true);
                        }
                    }
                }
                if (groupmenuitem != null && groupremoveitem != null) {
                    if (!self.groupable || !columnitem.groupable) {
                        self.gridmenu.jqxMenu('disable', groupremoveitem.id, true);
                        self.gridmenu.jqxMenu('disable', groupmenuitem.id, true);
                    }
                    else {
                        if (self.groups && self.groups.indexOf(columnitem.datafield) != -1) {
                            self.gridmenu.jqxMenu('disable', groupmenuitem.id, true);
                            self.gridmenu.jqxMenu('disable', groupremoveitem.id, false);
                        }
                        else {
                            self.gridmenu.jqxMenu('disable', groupmenuitem.id, false);
                            self.gridmenu.jqxMenu('disable', groupremoveitem.id, true);
                        }
                    }
                }
                if (filteritem != null) {

                    self._updatefilterpanel(self, filteritem, columnitem);

                    var itemscount = 0;
                    if (self.sortable && self._togglesort && self.showsortmenuitems) {
                        itemscount += 3;
                    }

                    if (self.groupable && self.addgroup && self.showgroupmenuitems) {
                        itemscount += 2;
                    }

                    var height = itemscount * 27 + 3;
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        height += 20;
                        $(filteritem).height(190);
                    }

                    if (self.filterable && self.showfiltermenuitems) {
                        if (!columnitem.filterable) {
                            self.gridmenu.height(height);
                            $(filteritem).css('display', 'none');
                        }
                        else {
                            self.gridmenu.height(height + 180);
                            $(filteritem).css('display', 'block');
                        }
                    }
                }
                $.data(document.body, "contextmenu" + self.element.id, { column: columnitem, columnsmenu: columnsmenu[0] });
            }

            self.addHandler($filtericon, 'click', function (event) {
                if (!columnitem.menu)
                    return false;
                if (!self.showfilterrow) {
                    showcolumnsmenu();
                    opencolumnsmenu();
                }
                return false;
            });

            self.addHandler(columnsmenu, 'click', function (event) {
                if (!columnitem.menu)
                    return false;

                opencolumnsmenu();
                return false;
            });
            if (self.isTouchDevice()) {
                self.addHandler(columnsmenu, $.jqx.mobile.getTouchEventName('touchstart'), function (event) {
                    if (!columnitem.menu)
                        return false;

                    if (!self._hasOpenedMenu) {
                        opencolumnsmenu();
                    }
                    else {
                        self._closemenu();
                    }

                    return false;
                });
            }
        },

        _removecolumnhandlers: function (columnitem) {
            var self = this.that;
            var column = $(columnitem.element);
            if (column.length > 0) {
                self.removeHandler(column, 'mouseenter');
                self.removeHandler(column, 'mouseleave');
                var $filtericon = $(columnitem.filtericon);
                self.removeHandler($filtericon, 'mousedown');
                self.removeHandler($filtericon, 'click');
                self.removeHandler(column, 'click');
                self.removeHandler(column, 'mousemove');
                if (self.columnsreorder) {
                    self.removeHandler(column, 'mousedown.drag');
                    self.removeHandler(column, 'mousemove.drag');
                }
                self.removeHandler(column, 'dragstart');
                if (column[0].columnsmenu) {
                    var columnsmenu = $(column[0].columnsmenu);
                    self.removeHandler(columnsmenu, 'click');
                    self.removeHandler(columnsmenu, 'mousedown');
                    self.removeHandler(columnsmenu, $.jqx.mobile.getTouchEventName('touchstart'));
                }
            }
        },

        _rendercolumnheader: function (text, align, headerheight, self) {
            var margin = '4px';

            if (self.columngroups) {
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

            if (this.enableellipsis) {
                return '<div style="padding-bottom: 2px; overflow: hidden; text-overflow: ellipsis; text-align: ' + align + '; margin-left: 4px; margin-right: 2px; margin-bottom: ' + margin + '; margin-top: ' + margin + ';">' + '<span style="text-overflow: ellipsis; cursor: default;">' + text + '</span>' + '</div>';
            }

            if (align == 'center' || align == 'middle')
                return '<div style="padding-bottom: 2px; text-align: center; margin-top: ' + margin + ';">' + '<a href="#">' + text + '</a>' + '</div>';

            var link = '<a style="margin-top: ' + margin + '; float: ' + align + ';" href="#">' + text + '</a>';
            return link;
        },

        _renderrows: function (virtualsizeinfo, forceVirtualRefresh, reason) {
            var self = this.that;

            if ((this.pageable || this.groupable) && (this.autoheight || this.autorowheight)) {
                if (this.table != null && this.table[0].rows != null && this.table[0].rows.length < this.dataview.rows.length) {
                    self.prerenderrequired = true;
                }
            }

            if (!this.pageable && (this.autoheight || this.autorowheight) && (this.virtualmode || this.unboundmode)) {
                var recordscount = this.source.totalrecords;
                if (!isNaN(recordscount)) {
                    if (this.table != null && this.table[0].rows != null && this.table[0].rows.length != recordscount) {
                        self.prerenderrequired = true;
                    }
                }
            }
            if ((this.autoheight || this.autorowheight) && !self.prerenderrequired) {
                if (this.table && this.table[0].rows) {
                    if (this.table[0].rows.length < this.dataview.records.length) {
                        if (this.pageable && this.table[0].rows.length < this.dataview.pagesize) {
                            self.prerenderrequired = true;
                        }
                        else if (!this.pageable) {
                            self.prerenderrequired = true;
                        }
                    }
                    if (this.table[0].rows.length < this.dataview.cachedrecords.length) {
                        if (this.pageable && this.table[0].rows.length < this.dataview.pagesize) {
                            self.prerenderrequired = true;
                        }
                        else if (!this.pageable) {
                            self.prerenderrequired = true;
                        }
                    }
                }
            }

            self._prerenderrows(virtualsizeinfo);
            if (self._requiresupdate) {
                self._requiresupdate = false;
                self._updatepageviews();
            }

            var callrenderrows = function () {
                if (self._loading) return;

                if (self.WinJS) {
                    MSApp.execUnsafeLocalFunction(function () {
                        self._rendervisualrows();
                    });
                }
                else {
                    self._rendervisualrows();
                }

                if (self.virtualmode && self.showaggregates && self._updateaggregates) {
                    self.refreshaggregates();
                }
            }
            var oldie = $.jqx.browser.msie && $.jqx.browser.version < 10;

            if (this.virtualmode) {
                var loadondemand = function () {
                    if (self.rendergridrows) {
                        var startboundindex = self._startboundindex;
                        if (startboundindex == undefined) startboundindex = 0;
                        var endboundindex = startboundindex + 1 + self.dataview.pagesize;
                        if (startboundindex != null && endboundindex != null) {
                            var isdataadapter = self.source._source ? true : false;
                            var sourcestartindex = !isdataadapter ? self.source.recordstartindex : self.source._source.recordstartindex;

                            if (sourcestartindex != startboundindex || forceVirtualRefresh == true) {
                                if (!isdataadapter) {
                                    self.source.recordstartindex = startboundindex;
                                    self.source.recordendindex = endboundindex;
                                }
                                else {
                                    if (endboundindex >= self.source._source.totalrecords) {
                                        endboundindex = self.source._source.totalrecords;
                                        startboundindex = endboundindex - self.dataview.pagesize - 1;
                                        if (startboundindex < 0) startboundindex = 0;
                                        if (self.source._source.recordendindex == endboundindex && self.source._source.recordstartindex == startboundindex) {
                                            return;
                                        }
                                    }

                                    self.source._source.recordstartindex = startboundindex;
                                    self.source._source.recordendindex = endboundindex;
                                }
                                self.updatebounddata('cells');
                            }
                        }
                    }
                }

                if (this.loadondemand) {
                    callrenderrows();
                    loadondemand();
                    this.loadondemand = false;
                }
                var ie10 = this._browser == undefined ? this._isIE10() : this._browser;

                if (this.editable && this.editcell && !this.vScrollInstance.isScrolling() && !this.hScrollInstance.isScrolling()) {
                    callrenderrows();
                }
                else {
                    if (this.autoheight) {
                        callrenderrows();
                    }
                    else {
                        if (ie10 || oldie || $.jqx.browser.mozilla || (navigator && navigator.userAgent.indexOf('Safari') != -1)) {
                            if (this._scrolltimer != null) {
                                clearTimeout(this._scrolltimer);
                            }
                            this._scrolltimer = setTimeout(function () {
                                callrenderrows();
                            }, 5);
                        }
                        else {
                            callrenderrows();
                        }
                    }
                }
            }
            else {
                if (this.scrollmode == 'deferred' && (this.hScrollInstance.isScrolling() || this.vScrollInstance.isScrolling())) {
                    if (this._scrolltimer != null) {
                        clearInterval(this._scrolltimer);
                    }
                    var row = this._getfirstvisualrow();
                    if (row != null) {
                        var renderer = function (data) {
                            if (row == null) return "";
                            var table = "<table>";
                            var columns = self.deferreddatafields;
                            if (columns == null) {
                                if (self.columns.records.length > 0) {
                                    columns = new Array();
                                    columns.push(self.columns.records[0].displayfield);
                                }
                            }

                            for (var i = 0; i < columns.length; i++) {
                                var field = columns[i];
                                var column = self._getcolumnbydatafield(field);
                                if (column) {
                                    var cellvalue = self._getcellvalue(column, row);
                                    if (column.cellsformat != '') {
                                        if ($.jqx.dataFormat) {
                                            if ($.jqx.dataFormat.isDate(cellvalue)) {
                                                cellvalue = $.jqx.dataFormat.formatdate(cellvalue, column.cellsformat, self.gridlocalization);
                                            }
                                            else if ($.jqx.dataFormat.isNumber(cellvalue)) {
                                                cellvalue = $.jqx.dataFormat.formatnumber(cellvalue, column.cellsformat, self.gridlocalization);
                                            }
                                        }
                                    }
                                    table += "<tr><td>" + cellvalue + "</td></tr>";
                                }
                            }
                            table += "</table>";
                            return table;
                        }

                        var html = this.scrollfeedback ? this.scrollfeedback(row.bounddata) : renderer(row.bounddata);
                        if (html != this._scrollelementcontent) {
                            this._scrollelement[0].innerHTML = html;
                            this._scrollelementcontent = html;
                        }
                    }

                    this._scrollelement.css('visibility', 'visible');
                    this._scrollelementoverlay.css('visibility', 'visible');
                    this._scrollelement.css('margin-top', -this._scrollelement.height() / 2);

                    this._scrolltimer = setInterval(function () {
                        if (!self.hScrollInstance.isScrolling() && !self.vScrollInstance.isScrolling()) {
                            callrenderrows();
                            self._scrollelement.css('visibility', 'hidden');
                            self._scrollelementoverlay.css('visibility', 'hidden');
                            clearInterval(self._scrolltimer);
                            if (row) {
                                self.ensurerowvisible(row.visibleindex);
                            }
                        }
                    }, 100);

                    return;
                }

                if (navigator && navigator.userAgent.indexOf('Chrome') == -1 && navigator.userAgent.indexOf('Safari') != -1) {
                    this.updatedelay = 1;
                }
                if (this.touchDevice != undefined && this.touchDevice == true) {
                    this.updatedelay = 5;
                }

                var ie10 = this._browser == undefined ? this._isIE10() : this._browser;

                if (ie10 || oldie) {
                    this.updatedelay = 5;
                }

                if ((ie10 || $.jqx.browser.mozilla) && this.hScrollInstance.isScrolling()) {
                    callrenderrows();
                    return;
                }

                if ($.jqx.browser.mozilla && this.updatedelay == 0 && (this.vScrollInstance.isScrolling() || this.hScrollInstance.isScrolling())) {
                    this.updatedelay = 1;  
                }

                if (this.updatedelay == 0) {
                    callrenderrows();
                }
                else {
                    var timer = this._jqxgridrendertimer;
                    if (timer != null) {
                        clearTimeout(timer);
                    }
                    if (this.vScrollInstance.isScrolling() || this.hScrollInstance.isScrolling()) {
                        timer = setTimeout(function () {
                            callrenderrows();
                        }, this.updatedelay);
                        this._jqxgridrendertimer = timer;
                    }
                    else {
                        this._jqxgridrendertimer = timer;
                        callrenderrows();
                    }
                }
            }
            if (self.autorowheight && !self.autoheight) {
                if (this._pageviews.length > 0) {
                    var tableheight = this._gettableheight();
                    var virtualheight = this._pageviews[0].height;
                    if (virtualheight > tableheight) {
                        if (this.pageable && this.gotopage) {
                            virtualheight = this._pageviews[0].height;
                            if (virtualheight < 0) {
                                virtualheight = this._pageviews[0].height;
                            }
                        }

                        if (this.vScrollBar.css('visibility') != 'visible') {
                            this.vScrollBar.css('visibility', 'visible');
                        }
                        if (virtualheight <= tableheight || this.autoheight) {
                            this.vScrollBar.css('visibility', 'hidden');
                        }

                        if (virtualheight - tableheight > 0) {
                            if (this.scrollmode != 'deferred') {
                                var max = virtualheight - tableheight;
                                var oldmax = this.vScrollInstance.max;
                                this.vScrollBar.jqxScrollBar({ max: max });
                                if (Math.round(max) != Math.round(oldmax)) {
                                    this.vScrollBar.jqxScrollBar({ value: 0 });
                                }
                            }
                        }
                        else {
                            this.vScrollBar.jqxScrollBar({ value: 0, max: virtualheight });
                        }
                    }
                    else {
                        if (!this._loading) {
                            this.vScrollBar.css('visibility', 'hidden');
                        }
                        this.vScrollBar.jqxScrollBar({ value: 0 });
                    }

                    this._arrange();
                    if (this.virtualsizeinfo) {
                        this.virtualsizeinfo.virtualheight = virtualheight;
                    }
                }
            }
        },

        scrolling: function()
        {
            var vertical = this.vScrollInstance.isScrolling();
            var horizontal = this.hScrollInstance.isScrolling();
            return { vertical: vertical, horizontal: horizontal };
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

            var rows = this.table[0].rows.length;
            var columnsrow = this.columnsrow;
            var columnstart = this.groupable && this.groups.length > 0 ? this.groups.length : 0;
            var columnend = this.columns.records.length - columnstart;
            var columns = this.columns.records;
            var isempty = this.dataview.rows.length == 0;
            if (this.rtl) {
                if (this.hScrollBar.css('visibility') != 'hidden') {
                    left = hScrollInstance.max - left;
                }
            }

            if (isempty && !this._haspinned) {
                for (var i = 0; i < rows; i++) {
                    var tablerow = this.table[0].rows[i];
                    for (var j = 0; j < columnstart + columnend; j++) {
                        var tablecell = tablerow.cells[j];
                        if (tablecell != undefined) {
                            var column = columns[j];
                            if (column.pinned) {
                                tablecell.style.marginLeft = left + 'px';
                                if (i == 0) {
                                    var columncell = columnsrow[0].cells[j];
                                    columncell.style.marginLeft = left + 'px';
                                }
                            }
                        }
                    }
                }
                this.table[0].style.marginLeft = -left + 'px';
                columnsrow[0].style.marginLeft = -left + 'px';
            }
            else {
                if (this._haspinned || this._haspinned == undefined) {
                    for (var i = 0; i < rows; i++) {
                        var tablerow = this.table[0].rows[i];
                        for (var j = 0; j < columnstart + columnend; j++) {
                            var tablecell = tablerow.cells[j];
                            if (tablecell != undefined) {
                                var column = columns[j];
                                if (column.pinned) {
                                    if (left == 0 && tablecell.style.marginLeft == "")
                                        continue;

                                    var statuscell = null;
                                    var filtercell = null;

                                    if (this.showfilterrow && this.filterrow) {
                                        if (this.filterrow[0].cells) {
                                            filtercell = this.filterrow[0].cells[j];
                                        }
                                    }

                                    if (this.showaggregates) {
                                        if (this.statusbar[0].cells) {
                                            statuscell = this.statusbar[0].cells[j];
                                        }
                                    }

                                    if (!this.rtl) {
                                        tablecell.style.marginLeft = left + 'px';
                                        if (i == 0) {
                                            var columncell = columnsrow[0].cells[j];
                                            columncell.style.marginLeft = left + 'px';
                                            if (statuscell) {
                                                statuscell.style.marginLeft = left + 'px';
                                            }
                                            if (filtercell) {
                                                filtercell.style.marginLeft = left + 'px';
                                            }
                                        }
                                    }
                                    else {
                                        tablecell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                        if (i == 0) {
                                            var columncell = columnsrow[0].cells[j];
                                            columncell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                            if (statuscell) {
                                                statuscell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                            }
                                            if (filtercell) {
                                                filtercell.style.marginLeft = -parseInt(horizontalscrollvalue) + 'px';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this.table[0].style.marginLeft = -left + 'px';
                    columnsrow[0].style.marginLeft = -left + 'px';
                }
                else if (this._haspinned == false) {
                    this.table[0].style.marginLeft = -left + 'px';
                    columnsrow[0].style.marginLeft = -left + 'px';
                }
            }

            if (this.showaggregates) {
                if (this.statusbar[0].cells) {
                    var offset = 0;
                    if (this.rtl) {
                        if (this.vScrollBar.css('visibility') != 'hidden') {
                            if (this.hScrollBar.css('visibility') != 'hidden') {
                                offset = 2 + parseInt(this.hScrollBar.css('left'));
                            }
                        }
                    }
                    this.statusbar[0].style.marginLeft = -left + offset + 'px';
                }
            }
            if (this.showfilterrow && this.filterrow) {
                if (this.filterrow[0].cells) {
                    this.filterrow[0].style.marginLeft = -left + 'px';
                }
            }
        },

        _updaterowdetailsvisibility: function () {
            if (this.rowdetails) {
                for (var i = 0; i < this._rowdetailselementscache.length; i++) {
                    $(this._rowdetailselementscache[i]).css('display', 'none');
                }
            }
        },

        _getvisualcolumnsindexes: function (left, tablewidth, columnstart, columnend, hasgroups) {
            if (this.rowdetails || this.rtl || this.editcell || (this.width && this.width.toString().indexOf('%') >= 0) || this.exporting) {
                return { start: 0, end: columnstart + columnend };
            }

            var xcolumn = 0;
            var hcolumnstart = -1;
            var hcolumnend = columnstart + columnend;
            var haspinnedcolumn = false;

            if (this.autorowheight) {
                return { start: 0, end: columnstart + columnend };
            }

            if (!hasgroups) {
                for (var j = 0; j < columnstart + columnend; j++) {
                    var rendercolumn = j;

                    if (!haspinnedcolumn) {
                        if (this.columns.records[j].pinned) {
                            haspinnedcolumn = true;
                        }
                    }

                    if (!this.columns.records[j].hidden) {
                        xcolumn += this.columns.records[j].width;
                    }

                    if (xcolumn >= left && hcolumnstart == -1) {
                        hcolumnstart = j;
                    }

                    if (xcolumn > tablewidth + left) {
                        hcolumnend = j
                        break;
                    }
                }
            }

            hcolumnend++;
            if (hcolumnend > columnstart + columnend) {
                hcolumnend = columnstart + columnend;
            }

            if (hcolumnstart == -1 || haspinnedcolumn) {
                hcolumnstart = 0;
            }

            return { start: hcolumnstart, end: hcolumnend };
        },

        _getfirstvisualrow: function () {
            var vScrollInstance = this.vScrollInstance;
            var verticalscrollvalue = vScrollInstance.value;
            var top = parseInt(verticalscrollvalue);

            if (this._pagescache.length == 0) {
                this.dataview.updateview();
                this._loadrows();
            }

            if (this.vScrollBar[0].style.visibility != 'visible') {
                top = 0;
            }

            if (!this.pageable) {
                var pagenum = this._findvisiblerow(top, this._pageviews);

                if (pagenum == -1) {
                    return null;
                }

                if (pagenum != this.dataview.pagenum) {
                    this.dataview.pagenum = pagenum;
                    this.dataview.updateview();
                    this._loadrows();
                }
                else if (!this._pagescache[this.dataview.pagenum]) {
                    this._loadrows();
                }
            }

            var firstvisiblerow = this._findvisiblerow(top, this._pagescache[this.dataview.pagenum]);
            var rowstorender = this._pagescache[this.dataview.pagenum];
            if (rowstorender && rowstorender[0]) {
                return rowstorender[firstvisiblerow];
            }
        },

        _rendervisualrows: function () {
            if (!this.virtualsizeinfo)
                return;

            var vScrollInstance = this.vScrollInstance;
            var hScrollInstance = this.hScrollInstance;
            var verticalscrollvalue = vScrollInstance.value;
            var horizontalscrollvalue = hScrollInstance.value;
            var top = parseInt(verticalscrollvalue);
            var left = parseInt(horizontalscrollvalue);
            var tableheight = this._gettableheight();
            var tablewidth = this._hostwidth != undefined ? this._hostwidth : this.host.width();
            if (this.hScrollBar[0].style.visibility == 'visible') {
                tableheight += 29;
            }
            if (this.scrollmode == 'deferred' && this._newmax != 0) {
                if (top > this._newmax && this._newmax != null) top = this._newmax;
            }

            var scrolling = vScrollInstance.isScrolling() || hScrollInstance.isScrolling() || this._keydown;
            var hasgroups = this.groupable && this.groups.length > 0;
            this.visiblerows = new Array();
            this.hittestinfo = new Array();

            if (this.editcell && this.editrow == undefined) {
                this._hidecelleditor(false);
            }
            if (this.editrow != undefined) {
                this._hideeditors();
            }

            if (this.virtualmode && !this.pageable) {
                this._pagescache = new Array();
            }

            if (this._pagescache.length == 0) {
                this.dataview.updateview();
                this._loadrows();
            }

            if (this.vScrollBar[0].style.visibility == 'hidden') {
                top = 0;
            }

            if (!this.pageable) {
                var pagenum = this._findvisiblerow(top, this._pageviews);

                if (pagenum == -1) {
                    this._clearvisualrows();
                    this._renderemptyrow();
                    this._updaterowdetailsvisibility();
                    return;
                }

                if (pagenum != this.dataview.pagenum) {
                    this.dataview.pagenum = pagenum;
                    this.dataview.updateview();
                    this._loadrows();
                }
                else if (!this._pagescache[this.dataview.pagenum]) {
                    this._loadrows();
                }
            }

            var columnstart = this.groupable && this.groups.length > 0 ? this.groups.length : 0;
            if (!this.columns.records) {
                return;
            }
            var columnend = this.columns.records.length - columnstart;
            var firstvisiblerow = this._findvisiblerow(top, this._pagescache[this.dataview.pagenum]);
            var rowstorender = this._pagescache[this.dataview.pagenum];
            var startindex = firstvisiblerow;
            if (startindex < 0) startindex = 0;

            var emptyheight = 0;
            var renderedrows = 0;
            var renderedheight = 0;
            var tableoffset = 0;
            var pagesize = this.virtualsizeinfo.visiblerecords;
            var groupslength = this.groupable ? this.groups.length : 0;
            var cellclass = this.toTP('jqx-grid-cell') + ' ' + this.toTP('jqx-item');
            if (this.rtl) {
                cellclass += ' ' + this.toTP('jqx-grid-cell-rtl');
            }

            if ((this.autoheight || this.autorowheight) && this.pageable) {
                if (!this.groupable) {
                    pagesize = this.dataview.pagesize;
                }
            }

            if (hasgroups) {
                cellclass = ' ' + this.toTP('jqx-grid-group-cell');
            }

            if (this.isTouchDevice()) {
                cellclass += ' ' + this.toTP('jqx-touch');
            }

            if (this.autorowheight) {
                cellclass += ' jqx-grid-cell-wrap'
            }

            var rowheight = this.rowsheight;
            var altrowindex = startindex;
            var rendercellfunc = this._rendercell;
            var enableselection = true;

            var visualcolumnsindexes = this._getvisualcolumnsindexes(left, tablewidth, columnstart, columnend, hasgroups);
            var hcolumnstart = visualcolumnsindexes.start;
            var hcolumnend = visualcolumnsindexes.end;
            if ((this.autoheight || this.pageable) && this.autorowheight) {
                if (this._pageviews[0]) {
                    this._oldpageviewheight = this._pageviews[0].height;
                }
            }

            if (this.autorowheight) {
                startindex = 0;
            }

            if (startindex >= 0) {
                this._updaterowdetailsvisibility();
                this._startboundindex = rowstorender != null ? rowstorender[startindex].bounddata.boundindex : 0;
                this._startvisibleindex = rowstorender != null ? rowstorender[startindex].bounddata.visibleindex : 0;
                for (var renderindex = 0; renderindex < pagesize && renderedrows < pagesize; renderindex++) {
                    var renderrow = rowstorender != undefined ? rowstorender[startindex + renderindex] : null;

                    if (renderrow == null) {
                        startindex = -renderindex;
                        if (this._pagescache[this.dataview.pagenum + 1]) {
                            rowstorender = this._pagescache[this.dataview.pagenum + 1];
                            this.dataview.pagenum++;
                        }
                        else {
                            var pageviewslength = this._pageviews.length;
                            do {
                                if (this.dataview.pagenum < this._pageviews.length - 1) {
                                    this.dataview.pagenum++;
                                    rowstorender = undefined;
                                    if (this._pageviews[this.dataview.pagenum].height > 0) {
                                        this.dataview.updateview();
                                        this._loadrows();
                                        rowstorender = this._pagescache[this.dataview.pagenum];
                                    }
                                }
                                else {
                                    rowstorender = undefined;
                                    break;
                                }
                            } while (rowstorender == undefined && this.dataview.pagenum < pageviewslength);
                        }

                        if (rowstorender != undefined) {
                            renderrow = rowstorender[startindex + renderindex]
                        }
                    }

                    if (renderrow != null) {
                        if (renderrow.hidden)
                            continue;

                        this._endboundindex = this._startboundindex + renderindex;
                        this._endvisibleindex = this._startvisibleindex + renderindex;
                        if (renderindex == 0) {
                            var topoffset = Math.abs(top - renderrow.top);
                            this.table[0].style.top = -topoffset + 'px';
                            tableoffset = -topoffset;
                        }

                        var tablerow = this.table[0].rows[renderedrows];
                        if (!tablerow) continue;
                        if (parseInt(tablerow.style.height) != renderrow.height) {
                            tablerow.style.height = parseInt(renderrow.height) + 'px';
                        }

                        renderedheight += renderrow.height;
                        var hasdetails = this.rowdetails && renderrow.rowdetails;
                        var showdetails = !renderrow.rowdetailshidden;
                        if (hasdetails && showdetails) {
                            tablerow.style.height = parseInt(renderrow.height - renderrow.rowdetailsheight) + 'px';
                            pagesize++;
                        }

                        var selected = this._isrowselected(enableselection, renderrow);
                        for (var cindex = hcolumnstart; cindex < hcolumnend; cindex++) {
                            var rendercolumn = cindex;
                            this._rendervisualcell(rendercellfunc, cellclass, selected, hasdetails, showdetails, hasgroups, groupslength, tablerow, renderrow, rendercolumn, renderedrows, scrolling);
                        }

                        if (renderrow.group != undefined && this._rendergroup) {
                            this._rendergroup(groupslength, tablerow, renderrow, columnstart, columnend, renderedrows, tablewidth);
                        }

                        if (this.autorowheight && (this.autoheight || this.pageable)) {
                            var rowheight = this.rowsheight;
                            for (var cindex = hcolumnstart; cindex < hcolumnend; cindex++) {
                                if (this.editable && this.editcell && this.editcell.column == this.columns.records[cindex].datafield && this.editcell.row == this.getboundindex(renderrow)) {
                                    continue;
                                }

                                if (tablerow.cells[cindex].firstChild) {
                                    rowheight = Math.max(rowheight, 8 + parseInt(tablerow.cells[cindex].firstChild.offsetHeight));
                                }
                            }
                            tablerow.style.height = parseInt(rowheight) + 'px';
                            this.heights[this._startboundindex + renderindex] = rowheight;
                            if (hasdetails && showdetails) {
                                rowheight += renderrow.rowdetailsheight;
                            }
                            renderrow.height = rowheight;
                        }

                        this.visiblerows[this.visiblerows.length] = renderrow;
                        this.hittestinfo[this.hittestinfo.length] = { row: renderrow, visualrow: tablerow, details: false };

                        if (hasdetails && showdetails) {
                            renderedrows++;
                            var tablerow = this.table[0].rows[renderedrows];
                            this._renderrowdetails(cellclass, tablerow, renderrow, columnstart, columnend, renderedrows);

                            this.visiblerows[this.visiblerows.length] = renderrow;
                            this.hittestinfo[this.hittestinfo.length] = { row: renderrow, visualrow: tablerow, details: true };
                        }

                        if (!this.autorowheight) {
                            if (renderedheight + tableoffset >= tableheight)
                                break;
                        }
                    }
                    else {
                        cansetheight = true;
                        this._clearvisualrow(left, hasgroups, renderedrows, columnstart, columnend);
                        if (renderedheight + emptyheight + tableoffset <= tableheight) {
                            emptyheight += rowheight;
                        }
                    }
                    renderedrows++;
                }
                this._horizontalvalue = left;

                if (emptyheight > 0) {
                    if (this.vScrollBar[0].style.visibility == 'visible') {
                        var tabletop = parseInt(this.table.css('top'));
                        var lastpageview = this._pageviews[this._pageviews.length - 1];
                        var oldmax = vScrollInstance.max;
                        var newmax = lastpageview.top + lastpageview.height - tableheight; //tabletop + this.visiblerows[this.visiblerows.length - 1].top + tableheight; //offset + vScrollInstance.max - emptyheight;
                        if (this.hScrollBar.css('visibility') == 'visible') {
                            newmax += this.scrollbarsize + 20;
                        }

                        if (oldmax != newmax && !this.autorowheight) {
                            if (newmax >= 0) {
                                if (this.scrollmode != 'deferred') {
                                    vScrollInstance.max = newmax;
                                    vScrollInstance.setPosition(vScrollInstance.max);
                                }
                                else {
                                    if (this._newmax != newmax) {
                                        this._newmax = newmax;
                                        this._rendervisualrows();
                                    }
                                }
                            }
                        }
                    }
                }

	            // 여기까지 왔으면 row 전체를 새로 그린 거임. - ysjung(2014/04/03)
	            this._raiseEvent(27);
            }

            if ((this.autoheight || this.pageable) && this.autorowheight) {
                this._pagescache = new Array();
                var y = 0;
                var height = 0;
                for (var i = 0; i < this.visiblerows.length; i++) {
                    var row = this.visiblerows[i];
                    row.top = y;
                    y += row.height;
                    height += row.height;
                    var hasdetails = this.rowdetails && row.rowdetails;
                    var showdetails = !row.rowdetailshidden;
                    var tablerow = this.table[0].rows[i];
                    if (hasdetails && showdetails) {
                        i++;
                    }

                    for (var cindex = hcolumnstart; cindex < hcolumnend; cindex++) {
                        var column = this.columns.records[cindex];
                        if (!column.hidden) {
                            if (!column.cellsrenderer) {
                                var cell = tablerow.cells[cindex];
                                var topMargin = 0;
                                if (cell.firstChild) {
                                    var topMargin = (row.height - parseInt(cell.firstChild.offsetHeight) - 8) / 2;
                                    if (hasdetails && showdetails) {
                                        var topMargin = (row.height - row.rowdetailsheight - $(cell.firstChild).height() - 8) / 2;
                                    }
                                }
                                else {
                                    var topMargin = (row.height - parseInt($(cell).height()) - 8) / 2;
                                }

                                if (topMargin >= 0) {
                                    topMargin = parseInt(topMargin) + 4;
                                    if (cell.firstChild) {
                                        if (cell.firstChild.className.indexOf('jqx-grid-groups-row') == -1) {
                                            if (column.columntype != 'checkbox' && column.columntype != 'button') {
                                                if (this.editable && this.editcell && this.editcell.column == column.datafield && this.editcell.row == this.getboundindex(row))
                                                    continue;

                                                cell.firstChild.style.marginTop = topMargin + 'px';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (this._pageviews[0]) {
                    this._pageviews[0].height = height; //this.table.height();
                }
                this._arrange();
            }

            this._renderemptyrow();
        },

        _hideemptyrow: function()
        {
            if (!this.showemptyrow) return;
            if (!this.table) return;
            if (!this.table[0].rows) return;

            var row = this.table[0].rows[0];
            if (!row) return;
            var rendered = false;
            for (var i = 0; i < row.cells.length; i++) {
                var cell = $(row.cells[i]);
                if (cell.css('display') != 'none' && !rendered) {
                    if (cell.width() == this.host.width() || cell.text() == this.gridlocalization.emptydatastring) {
                        cell[0].checkbox = null;
                        cell[0].button = null;
                        rendered = true;
                        cell[0].innerHTML = "";
                    }
                }
            }     
        },

        _renderemptyrow: function () {
            if (this._loading) {
                return;
            }

            if (this.dataview.records.length == 0 && this.showemptyrow) {
                var rendered = false;
                var cellclass = this.toTP('jqx-grid-cell');

                if (this.table && this.table.length > 0 && this.table[0].rows && this.table[0].rows.length > 0) {
                    var row = this.table[0].rows[0];
                    this.table[0].style.top = '0px';
                    for (var i = 0; i < row.cells.length; i++) {
                        var cell = $(row.cells[i]);
                        if (cell.css('display') != 'none' && !rendered) {
                            cell[0].checkbox = null;
                            cell[0].button = null;
                            cell[0].className = cellclass;
                            rendered = true;
                            cell[0].innerHTML = "";
                            var span = $("<span style='white-space: nowrap; float: left; margin-left: 50%; position: relative;'></span>");
                            span.text(this.gridlocalization.emptydatastring);
                            cell.append(span);
                            var hscroll = 0;
                            if (!this.oldhscroll) {
                                hscroll = parseInt(this.table[0].style.marginLeft);
                                if (this.rtl) {
                                    cell.css('z-index', 999);
                                    cell.css('overflow', 'visible');
                                }
                            }

                            span.css('left', -hscroll - (span.width() / 2));
                            span.css('top', this._gettableheight() / 2 - span.height() / 2);
                            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                                span.css('margin-left', '0px');
                                span.css('left', this.host.width() / 2 - span.width() / 2);
                            }
                            var top = Math.abs(parseInt(this.table[0].style.top));
                            if (isNaN(top)) top = 0;
                            $(row).height(this._gettableheight() + top);
                            cell.css('margin-left', '0px');
                            cell.width(this.host.width());
                            if (this.table.width() < this.host.width()) {
                                this.table.width(this.host.width());
                            }
                        }
                        cell.addClass(this.toThemeProperty('jqx-grid-empty-cell'));
                    }
                }
            }
        },

        _clearvisualrows: function () {
            var pagesize = this.virtualsizeinfo.visiblerecords;
            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var left = parseInt(horizontalscrollvalue);
            var hasgroups = this.groupable && this.groups.length > 0;
            if (!this.columns.records)
                return;

            for (var renderindex = 0; renderindex < pagesize; renderindex++) {
                this._clearvisualrow(left, hasgroups, renderindex, 0, this.columns.records.length);
            }
        },

        _isrowselected: function (enableselection, row) {
            var selected = false;
            var boundindexoffset = 0;
            if (this.virtualmode && this.pageable && this.groupable) {
                if (this.groups.length > 0) {
                    boundindexoffset = this.dataview.pagesize * this.dataview.pagenum;
                }
            }
            
            if (enableselection && row.bounddata != null) {
                if (this.selectionmode != "singlerow") {
                    if (this.dataview.filters.length > 0) {
                        if (!this.virtualmode) {
                            if (this.selectedrowindexes.indexOf(boundindexoffset + row.bounddata.dataindex) != -1) {
                                selected = true;
                            }
                        }
                        else {
                            if (this.selectedrowindexes.indexOf(boundindexoffset + row.bounddata.boundindex) != -1) {
                                selected = true;
                            }
                        }
                    }
                    else {
                        if (this.selectedrowindexes.indexOf(boundindexoffset + row.bounddata.boundindex) != -1) {
                            selected = true;
                        }
                    }
                }
                else {
                    if (this.dataview.filters.length > 0) {
                        if (!this.virtualmode) {
                            if (this.selectedrowindexes.indexOf(boundindexoffset + row.bounddata.dataindex) != -1) {
                                selected = true;
                            }
                        }
                        else {
                            if (this.selectedrowindexes.indexOf(boundindexoffset + row.bounddata.boundindex) != -1) {
                                selected = true;
                            }
                        }
                    }
                    else {
                        if (boundindexoffset + row.bounddata.boundindex == this.selectedrowindex) {
                            selected = true;
                        }
                    }
                }
            }

            return selected;
        },

        _rendervisualcell: function (rendercellfunc, cellclass, selected, hasdetails, showdetails, hasgroups, groupslength, tablerow, renderrow, rendercolumn, renderedrows, scrolling) {
            var cell = null;
            var column = this.columns.records[rendercolumn];
            if (column.hidden) {
                var tablecell = tablerow.cells[rendercolumn];
                tablecell.innerHTML = "";
                return;
            }

            cellvalue = this._getcellvalue(column, renderrow);
            var tablecell = tablerow.cells[rendercolumn];
            var classname = cellclass;

            if (this.selectionmode.indexOf('cell') != -1) {
                if (this.dataview.filters.length > 0) {
                    if (this.selectedcells[renderrow.bounddata.dataindex + '_' + column.datafield]) {
                        selected = true;
                    }
                    else {
                        selected = false;
                    }
                }
                else {
                    if (this.selectedcells[renderrow.boundindex + '_' + column.datafield]) {
                        selected = true;
                    }
                    else {
                        selected = false;
                    }
                }
                if (this.editcell) {
                    if (this.editcell.row === renderrow.boundindex && this.editcell.column === column.datafield) {
                        if (column.columntype !== "checkbox") {
                            selected = false;
                        }
                    }
                }
            }

            if (column.cellclassname != '' && column.cellclassname) {
                if (typeof column.cellclassname == "string") {
                    classname += ' ' + column.cellclassname;
                }
                else {
                    var customclassname = column.cellclassname(this.getboundindex(renderrow), column.datafield, cellvalue, renderrow.bounddata);
                    if (customclassname) {
                        classname += ' ' + customclassname;
                    }
                }
            }
            
            var issortcolumn = this.showsortcolumnbackground && this.sortcolumn && column.displayfield == this.sortcolumn;
            if (issortcolumn) {
                classname += ' ' + this.toTP('jqx-grid-cell-sort');
            }

            if (column.filter && this.showfiltercolumnbackground) {
                classname += ' ' + this.toTP('jqx-grid-cell-filter');
            }

            if ((column.pinned && this.showpinnedcolumnbackground) || column.grouped) {
                if (hasgroups) {
                    classname += ' ' + this.toTP('jqx-grid-cell-pinned');
                }
                else {
                    classname += ' ' + this.toTP('jqx-grid-cell-pinned');
                }
            }

            if (this.altrows && renderrow.group == undefined) {
                var altrowindex = renderrow.visibleindex;
                if (altrowindex >= this.altstart) {
                    if ((this.altstart + altrowindex) % (1 + this.altstep) == 0) {
                        if (!issortcolumn) {
                            classname += ' ' + this.toTP('jqx-grid-cell-alt');
                        }
                        else classname += ' ' + this.toTP('jqx-grid-cell-sort-alt');

                        if (column.filter && this.showfiltercolumnbackground) {
                            classname += ' ' + this.toTP('jqx-grid-cell-filter-alt');
                        }

                        if (column.pinned && this.showpinnedcolumnbackground) {
                            classname += ' ' + this.toTP('jqx-grid-cell-pinned-alt');
                        }
                    }
                }
            }

            if (rendercolumn <= groupslength) {
                if (hasgroups || this.rowdetails) {
                    var $tablecell = $(tablecell);
                    var cellwidth = this.columns.records[rendercolumn].width;

                    if (tablecell.style.width != parseInt(cellwidth) + 'px') {
                        $tablecell.width(cellwidth);
                    }
                }
            }
            else {
                if (hasgroups || this.rowdetails) {
                    if (this._hiddencolumns) {
                        var $tablecell = $(tablecell);
                        var cellwidth = this.columns.records[rendercolumn].width;

                        if (parseInt(tablecell.style.width) != cellwidth) {
                            $tablecell.width(cellwidth);
                        }
                    }
                }
            }

            var selectedstate = true;
            if (this.rowdetails && hasdetails) {
                if (showdetails && !hasgroups) {
                    classname += ' ' + this.toTP('jqx-grid-details-cell');
                }
                else if (hasgroups) {
                    classname += ' ' + this.toTP('jqx-grid-group-details-cell');
                }

                if (this.showrowdetailscolumn) {
                    if (!this.rtl) {
                        if (renderrow.group == undefined && rendercolumn == groupslength) {
                            var iconClassName = this.toThemeProperty('jqx-icon-arrow-down');
                            if (showdetails) {
                                classname += ' ' + this.toTP('jqx-grid-group-expand');
                                classname += ' ' + iconClassName;
                            }
                            else {
                                classname += ' ' + this.toTP('jqx-grid-group-collapse');
                                var iconClassName = this.toThemeProperty('jqx-icon-arrow-right');
                                classname += ' ' + iconClassName;
                            }
                            selectedstate = false;
                            tablecell.title = "";
                            tablecell.innerHTML = "";
                            if (tablecell.className != classname) {
                                tablecell.className = classname;
                            }
                            return;
                        }
                    }
                    else {
                        if (renderrow.group == undefined && rendercolumn == tablerow.cells.length - groupslength - 1) {
                            var iconClassName = this.toThemeProperty('jqx-icon-arrow-down');
                            if (showdetails) {
                                classname += ' ' + this.toTP('jqx-grid-group-expand-rtl');
                                classname += ' ' + iconClassName;
                            }
                            else {
                                classname += ' ' + this.toTP('jqx-grid-group-collapse-rtl');
                                var iconClassName = this.toThemeProperty('jqx-icon-arrow-left');
                                classname += ' ' + iconClassName;
                            }
                            selectedstate = false;
                            tablecell.title = "";
                            tablecell.innerHTML = "";
                            if (tablecell.className != classname) {
                                tablecell.className = classname;
                            }
                            return;
                        }
                    }
                }
            }

            if (selected && selectedstate && rendercolumn >= groupslength) {
                classname += ' ' + this.toTP('jqx-grid-cell-selected');
                classname += ' ' + this.toTP('jqx-fill-state-pressed');
            }

            if (tablecell.className != classname) {
                tablecell.className = classname;
            }

            if (renderrow.group != undefined) {
                cellvalue = "";
                tablecell.title = "";
                tablecell.innerHTML = "";

                return;
            }
            rendercellfunc(this, column, renderrow, cellvalue, tablecell, scrolling);
        },

        _rendercell: function (me, column, row, value, tablecell, scrolling) {
            var lookupkey = value + "_" + column.visibleindex;
            //row.uniqueid + "_" + column.visibleindex;
            if (column.columntype == "number" || column.cellsrenderer != null) {
                var lookupkey = row.uniqueid + "_" + column.visibleindex;
            }

            if (me.editcell && me.editrow == undefined) {
                if (me.editmode == "selectedrow" && column.editable && me.editable) {
                    if (me.editcell.row == me.getboundindex(row)) {
                        if (me._showcelleditor) {
                            if (!me.hScrollInstance.isScrolling() && !me.vScrollInstance.isScrolling()) {
                                me._showcelleditor(me.editcell.row, column, tablecell, me.editcell.init);
                            }
                            else {
                                me._showcelleditor(me.editcell.row, column, tablecell, me.editcell.init, false);
                            }
                            return;
                        }
                    }
                }
                else {
                    if (me.editcell.row == me.getboundindex(row) && me.editcell.column == column.datafield) {
                        me.editcell.element = tablecell;
                        if (me.editcell.editing) {
                            if (me._showcelleditor) {
                                if (!me.hScrollInstance.isScrolling() && !me.vScrollInstance.isScrolling()) {
                                    me._showcelleditor(me.editcell.row, column, me.editcell.element, me.editcell.init);
                                }
                                else {
                                    me._showcelleditor(me.editcell.row, column, me.editcell.element, me.editcell.init, false);
                                }
                                return;
                            }
                        }
                    }
                }
            }

            var defaultcellsrenderer = me._defaultcellsrenderer(value, column);

            var cachedcell = me._cellscache[lookupkey];
            //   var ie10 = me._browser == undefined ? me._isIE10() : me._browser;
            if (cachedcell) {
                if (column.columntype == "inline") {
                    me._renderinlinecell(me, tablecell, column, row, value);
                    if (column.cellsrenderer != null) {
                        var newvalue = column.cellsrenderer(me.getboundindex(row), column.datafield, value, defaultcellsrenderer, column.getcolumnproperties(), row.bounddata);
                        if (newvalue != undefined) {
                            tablecell.innerHTML = newvalue;
                        }
                    } return;
                }
                else if (column.columntype == "checkbox") {
                    if (me.host.jqxCheckBox) {
                        if (value === "") value = null;
                        var empty = tablecell.innerHTML.toString().length == 0;
                        if (tablecell.checkbox && !me.groupable && !empty) {
                            tablecell.checkboxrow = me.getboundindex(row);
                            if (value == "") value = false;
                            if (value == "1") value = true;
                            if (value == "0") value = false;
                            if (value == 1) value = true;
                            if (value == 0) value = false;
                            if (value == 'true') value = true;
                            if (value == 'false') value = false;
                            if (value == null && !column.threestatecheckbox) {
                                value = false;
                            }
                            if (column.checkboxcolumn) {
                                value = false;
                                if (me.dataview.filters.length > 0 && !me.virtualmode) {
                                    if (me.selectedrowindexes.indexOf(row.bounddata.dataindex) != -1) {
                                        value = true;
                                    }
                                }
                                else {
                                    if (me.selectedrowindexes.indexOf(row.bounddata.boundindex) != -1) {
                                        value = true;
                                    }
                                }
                            }
                            if (tablecell.checkboxinstance) {
                                tablecell.checkboxinstance._setState(value);
                            }
                            else {
                                tablecell.checkbox.jqxCheckBox('_setState', value);
                            }
                        }
                        else {
                            me._rendercheckboxcell(me, tablecell, column, row, value);
                        }
                        if (column.cellsrenderer != null) {
                            var newvalue = column.cellsrenderer(me.getboundindex(row), column.datafield, value, defaultcellsrenderer, column.getcolumnproperties(), row.bounddata);
                            if (newvalue != undefined) {
                                tablecell.innerHTML = newvalue;
                            }
                        }

                        return;
                    }
                }
                else if (column.columntype == "button") {
                    if (me.host.jqxButton) {
                        if (value == "") value = false;
                        if (column.cellsrenderer != null) {
                            value = column.cellsrenderer(me.getboundindex(row), column.datafield, value, defaultcellsrenderer, column.getcolumnproperties(), row.bounddata);
                        }

                        if (tablecell.innerHTML == "") {
                            tablecell.buttonrow = me.getboundindex(row);
                            tablecell.button = null;
                            me._renderbuttoncell(me, tablecell, column, row, value);
                        }

                        if (tablecell.button && !me.groupable) {
                            tablecell.buttonrow = me.getboundindex(row);
                            tablecell.button.val(value);
                        }
                        else {
                            me._renderbuttoncell(me, tablecell, column, row, value);
                        }
                        return;
                    }
                }

                var cellelement = cachedcell.element;

                if (column.cellsrenderer != null || (tablecell.childNodes && tablecell.childNodes.length == 0) || me.groupable || me.rowdetails) {
                    if (tablecell.innerHTML != cellelement) {
                        tablecell.innerHTML = cellelement;
                    }
                }
                else {
                    if (tablecell.innerHTML.indexOf('editor') >= 0) {
                        tablecell.innerHTML = cellelement;
                    }
                    else if (scrolling) {
                        var textStartIndex = cellelement.indexOf('>');
                        var textEndIndex = cellelement.indexOf('</');
                        var text = cellelement.substring(textStartIndex + 1, textEndIndex);
                        var child = tablecell.childNodes[0];
                        if (child.childNodes[0]) {
                            if (text != child.childNodes[0].nodeValue) {
                                if (text.indexOf('&') >= 0) {
                                    tablecell.innerHTML = cellelement;
                                }
                                else {
                                    child.childNodes[0].nodeValue = text;
                                }
                                    //      var newChild = document.createTextNode(text);
                          //      child.replaceChild(newChild, child.childNodes[0]);
                            }
                        }
                        else {
                            var newChild = document.createTextNode(text);
                            child.appendChild(newChild);
                        }
                    }
                    else {
                        if (tablecell.innerHTML != cellelement) {
                            tablecell.innerHTML = cellelement;
                        }
                    }
                }

                if (me.enabletooltips && column.enabletooltips) {
                    tablecell.title = cachedcell.title;
                }
                return;
            }

            if (column.columntype == "checkbox") {
                me._rendercheckboxcell(me, tablecell, column, row, value);
                me._cellscache[lookupkey] = { element: "", title: value };
                if (me.enabletooltips && column.enabletooltips) {
                    tablecell.title = value;
                }
                return;
            }
            else if (column.columntype == "button") {
                if (column.cellsrenderer != null) {
                    value = column.cellsrenderer(me.getboundindex(row), column.datafield, value, defaultcellsrenderer, column.getcolumnproperties(), row.bounddata);
                }
                me._renderbuttoncell(me, tablecell, column, row, value);
                me._cellscache[lookupkey] = { element: "", title: value };
                if (me.enabletooltips && column.enabletooltips) {
                    tablecell.title = value;
                }
                return;
            }
            else if (column.columntype == "number") {
                value = row.visibleindex;
            }
            else if (column.columntype == "inline") {
                me._renderinlinecell(me, tablecell, column, row, value);
                me._cellscache[lookupkey] = { element: "", title: value };
                if (me.enabletooltips && column.enabletooltips) {
                    tablecell.title = value;
                }
                return;
            }

            var cellelement = null;
            if (column.cellsrenderer != null) {
                cellelement = column.cellsrenderer(me.getboundindex(row), column.datafield, value, defaultcellsrenderer, column.getcolumnproperties(), row.bounddata);
            }
            else {
                cellelement = defaultcellsrenderer;
            }

            if (cellelement == null) {
                cellelement = defaultcellsrenderer;
            }
            var formattedValue = value;
            if (me.enabletooltips && column.enabletooltips) {
               if (column.cellsformat != '') {
                    if ($.jqx.dataFormat) {
                        if ($.jqx.dataFormat.isDate(value)) {
                            formattedValue = $.jqx.dataFormat.formatdate(formattedValue, column.cellsformat, this.gridlocalization);
                        }
                        else if ($.jqx.dataFormat.isNumber(value)) {
                            formattedValue = $.jqx.dataFormat.formatnumber(formattedValue, column.cellsformat, this.gridlocalization);
                        }
                    }
                }
                tablecell.title = formattedValue;
            }

            if (me.WinJS) {
                $(tablecell).html(cellelement);
            }
            else {
                tablecell.innerHTML = cellelement;
            }

            me._cellscache[lookupkey] = { element: tablecell.innerHTML, title: formattedValue };
            return true;
        },

        _isIE10: function () {
            if (this._browser == undefined) {
                var browserInfo = $.jqx.utilities.getBrowser();
                if (browserInfo.browser == 'msie' && parseInt(browserInfo.version) > 9)
                    this._browser = true;
                else {
                    this._browser = false;
                    if (browserInfo.browser == 'msie') {
                        var txt = "Browser CodeName: " + navigator.appCodeName + "";
                        txt += "Browser Name: " + navigator.appName + "";
                        txt += "Browser Version: " + navigator.appVersion + "";
                        txt += "Platform: " + navigator.platform + "";
                        txt += "User-agent header: " + navigator.userAgent + "";
                        if (txt.indexOf('Zune 4.7') != -1) {
                            this._browser = true;
                        }
                    }
                }
            }
            return this._browser;
        },

        _renderinlinecell: function (me, tablecell, column, row, value) {
            var $tablecell = $(tablecell); 
            tablecell.innerHTML = '<div style="position: absolute;"></div>';
        },

        _rendercheckboxcell: function (me, tablecell, column, row, value) {
            if (me.host.jqxCheckBox) {
                var $tablecell = $(tablecell);
                if (value === "") {
                    if (column.threestatecheckbox) {
                        value = null;
                    }
                    else {
                        value = false;
                    }
                }
                if (value == "1") value = true;
                if (value == "0") value = false;
                if (value == 1) value = true;
                if (value == 0) value = false;
                if (value == 'true') value = true;
                if (value == 'false') value = false;
                if (column.checkboxcolumn) {
                    value = false;
                    if (this.dataview.filters.length > 0) {
                        if (this.selectedrowindexes.indexOf(row.bounddata.dataindex) != -1) {
                            value = true;
                        }
                    }
                    else {
                        if (this.selectedrowindexes.indexOf(row.bounddata.boundindex) != -1) {
                            value = true;
                        }
                    }
                }

                if ($tablecell.find('.jqx-checkbox').length == 0) {
                    tablecell.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; margin-top: -7px; margin-left: -10px;"></div>';
                    $(tablecell.firstChild).jqxCheckBox({ _canFocus: false, hasInput: false, hasThreeStates: column.threestatecheckbox, enableContainerClick: false, animationShowDelay: 0, animationHideDelay: 0, locked: true, theme: me.theme, checked: value });

                    if (this.editable && column.editable) {
                        $(tablecell.firstChild).jqxCheckBox({ locked: false });
                    }
                    if (column.checkboxcolumn) {
                        $(tablecell.firstChild).jqxCheckBox({ locked: false });
                    }

                    tablecell.checkbox = $(tablecell.firstChild);
                    tablecell.checkboxinstance = tablecell.checkbox.data().jqxCheckBox.instance;
                    tablecell.checkboxrow = row.boundindex;
                    if (this.dataview.filters.length > 0) {
                        var boundindex = row.bounddata.dataindex;
                        tablecell.checkboxrow = boundindex;
                    }
                    var checkinstance = $.data(tablecell.firstChild, "jqxCheckBox").instance;
                    checkinstance.updated = function (event, checked, oldchecked) {
                        if (column.editable) {
                            var totalrows = me.table[0].rows.length;
                            var columnindex = me._getcolumnindex(column.datafield);

                            if (me.editrow == undefined) {
                                if (column.cellbeginedit) {
                                    var beginEdit = column.cellbeginedit(tablecell.checkboxrow, column.datafield, column.columntype, !checked);
                                    if (beginEdit == false) {
                                        me.setcellvalue(tablecell.checkboxrow, column.datafield, !checked, true);
                                        return;
                                    }
                                }

                                if (me.editmode !== "selectedrow") {
                                    for (var currentCheckbox = 0; currentCheckbox < totalrows; currentCheckbox++) {
                                        var checkboxcell = me.table[0].rows[currentCheckbox].cells[columnindex].firstChild;
                                        if (checkboxcell) {
                                            $(checkboxcell).jqxCheckBox('destroy');
                                        }
                                    }
                                }

                                if (me.editcell && me.editcell.validated == false) {
                                    me.setcellvalue(tablecell.checkboxrow, column.datafield, !checked, true);
                                }
                                else {
                                    if (me.editmode !== "selectedrow" || me.editcell == null) {
                                        me._raiseEvent(17, { rowindex: tablecell.checkboxrow, datafield: column.datafield, value: oldchecked, columntype: column.columntype });
                                        me.setcellvalue(tablecell.checkboxrow, column.datafield, checked, true);
                                        me._raiseEvent(18, { rowindex: tablecell.checkboxrow, datafield: column.datafield, oldvalue: oldchecked, value: checked, columntype: column.columntype });
                                    }
                                    else {
                                        me.setcellvalue(tablecell.checkboxrow, column.datafield, checked, false, false);
                                    }
                                }
                            }
                        }
                        else if (column.checkboxcolumn) {
                            if (me.editcell) {
                                me.endcelledit(me.editcell.row, me.editcell.column, false, true);
                            }
                            if (checked) {
                                me.selectrow(tablecell.checkboxrow);
                            }
                            else {
                                me.unselectrow(tablecell.checkboxrow);
                            }
                            if (me.autosavestate) {
                                if (me.savestate) me.savestate();
                            }
                        }
                    }
                }
                else {
                    tablecell.checkboxrow = row.boundindex;
                    if (this.dataview.filters.length > 0) {
                        boundindex = row.bounddata.dataindex;
                        tablecell.checkboxrow = boundindex;
                    }
                    $(tablecell.firstChild).jqxCheckBox('_setState', value);
                }
            }
        },

        _renderbuttoncell: function (me, tablecell, column, row, value) {
            if (me.host.jqxButton) {
                var $tablecell = $(tablecell);
                if (value == "") value = false;
                if ($tablecell.find('.jqx-button').length == 0) {
                    tablecell.innerHTML = '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;"/>';
                    $(tablecell.firstChild).val(value);
                    $(tablecell.firstChild).attr("hideFocus", "true");
                    $(tablecell.firstChild).jqxButton({ theme: me.theme, height: me.rowsheight - 4, width: column.width - 4 });
                    tablecell.button = $(tablecell.firstChild);
                    tablecell.buttonrow = me.getboundindex(row);
                    var isTouch = this.isTouchDevice();
                    if (isTouch) {
                        var eventname = $.jqx.mobile.getTouchEventName('touchend');
                        me.addHandler($(tablecell.firstChild), eventname, function (event) {
                            if (column.buttonclick) {
                                column.buttonclick(tablecell.buttonrow, event);
                            }
                        });
                    }
                    else {
                        me.addHandler($(tablecell.firstChild), 'click', function (event) {
                            if (column.buttonclick) {
                                column.buttonclick(tablecell.buttonrow, event);
                            }
                        });
                    }
                }
                else {
                    tablecell.buttonrow = me.getboundindex(row);
                    $(tablecell.firstChild).val(value);
                }
            }
        },

        _clearvisualrow: function (left, hasgroups, renderedrows, columnstart, columnend) {
            var cellclass = this.toTP('jqx-grid-cell');
            if (hasgroups) {
                cellclass = ' ' + this.toTP('jqx-grid-group-cell');
            }
            cellclass += ' ' + this.toTP('jqx-grid-cleared-cell');
            var rows = this.table[0].rows;
            for (var j = 0; j < columnstart + columnend; j++) {
                if (rows[renderedrows]) {
                    var tablecell = rows[renderedrows].cells[j];
                    if (tablecell.className != cellclass) {
                        tablecell.className = cellclass;
                    }
                    var columnrecord = this.columns.records[j];
                    if (this._horizontalvalue != left && !columnrecord.pinned) {
                        //      $(tablecell).css('margin-left', -left);
                        if (this.oldhscroll == true) {
                            var margin = -left;
                            tablecell.style.marginLeft = -left + 'px';
                        }
                    }
                    var cellwidth = columnrecord.width;
                    if (cellwidth < columnrecord.minwidth) cellwidth = columnrecord.minwidth;
                    if (cellwidth > columnrecord.maxwidth) cellwidth = columnrecord.maxwidth;

                    if (parseInt(tablecell.style.width) != cellwidth) {
                        $(tablecell)[0].style.width = cellwidth + 'px';
                    }
                    if (tablecell.title != "") {
                        tablecell.title = "";
                    }
                    if (tablecell.innerHTML != "") {
                        tablecell.innerHTML = "";
                    }
                }
            }
            if (rows[renderedrows]) {
                if (parseInt(rows[renderedrows].style.height) != this.rowsheight) {
                    rows[renderedrows].style.height = parseInt(this.rowsheight) + 'px';
                }
            }
        },

        _findgroupstate: function (uniqueid) {
            var group = this._findgroup(uniqueid);
            if (group == null) {
                return false;
            }
            return group.expanded;
        },

        _findgroup: function (uniqueid) {
            var group = null;

            if (this.expandedgroups[uniqueid])
                return this.expandedgroups[uniqueid];

            return group;
        },

        _clearcaches: function () {
            this._columnsbydatafield = new Array();
            this._pagescache = new Array();
            this._pageviews = new Array();
            this._cellscache = new Array();
            this.heights = new Array();
            this.hiddens = new Array();
            this.hiddenboundrows = new Array();
            this.heightboundrows = new Array();
            this.detailboundrows = new Array();
            this.details = new Array();
            this.expandedgroups = new Array();
            this._rowdetailscache = new Array();
            this._rowdetailselementscache = new Array();
            if ($.jqx.dataFormat) {
                $.jqx.dataFormat.cleardatescache();
            }
            this.tableheight = null;
        },

        _getColumnText: function (datafield) {
            if (this._columnsbydatafield == undefined) {
                this._columnsbydatafield = new Array();
            }

            if (this._columnsbydatafield[datafield])
                return this._columnsbydatafield[datafield];

            var columnname = datafield;
            var column = null;
            $.each(this.columns.records, function () {
                if (this.datafield == datafield) {
                    columnname = this.text;
                    column = this;
                    return false;
                }
            });

            this._columnsbydatafield[datafield] = { label: columnname, column: column };
            return this._columnsbydatafield[datafield];
        },

        _getcolumnbydatafield: function (datafield) {
            if (this.__columnsbydatafield == undefined) {
                this.__columnsbydatafield = new Array();
            }

            if (this.__columnsbydatafield[datafield])
                return this.__columnsbydatafield[datafield];

            var columnname = datafield;
            var column = null;
            $.each(this.columns.records, function () {
                if (this.datafield == datafield || this.displayfield == datafield) {
                    columnname = this.text;
                    column = this;
                    return false;
                }
            });

            this.__columnsbydatafield[datafield] = column;
            return this.__columnsbydatafield[datafield];
        },

        isscrollingvertically: function () {
            var isscrolling = (this.vScrollBar.jqxScrollBar('isScrolling'))
            return isscrolling;
        },

        _renderrowdetails: function (cellclass, tablerow, renderrow, columnstart, columnend, renderedrows) {
            if (tablerow == undefined)
                return;

            var $tablerow = $(tablerow);
            var cellindex = 0;
            var indent = this.rowdetails && this.showrowdetailscolumn ? (1 + this.groups.length) * this.groupindentwidth : (this.groups.length) * this.groupindentwidth;
            if (this.groupable && this.groups.length > 0) {
                for (var detailsIndex = 0; detailsIndex <= columnend; detailsIndex++) {
                    var tablecell = $(tablerow.cells[detailsIndex]);
                    tablecell[0].innerHTML = "";
                    tablecell[0].className = 'jqx-grid-details-cell';
                }
            }

            var tablecell = $(tablerow.cells[cellindex]);
            if (tablecell[0].style.display == "none") {
                var cellToRender = tablerow.cells[cellindex];
                var m = 2;
                var start = cellindex;
                while (cellToRender != undefined && cellToRender.style.display == 'none' && m < 10) {
                    cellToRender = tablerow.cells[start + m - 1];
                    m++;
                }
                tablecell = $(cellToRender);
            }

            if (this.rtl) {
                for (var s = columnstart; s < columnend; s++) {
                    tablerow.cells[s].innerHTML = "";
                    tablerow.cells[s].className = 'jqx-grid-details-cell';
                }
            }

            tablecell.css('width', '100%');
            $tablerow.height(renderrow.rowdetailsheight);
            tablecell[0].className = cellclass;

            var boundindex = this.getboundindex(renderrow);
            var lookupkey = boundindex + "_";

            if (this._rowdetailscache[lookupkey]) {
                var cache = this._rowdetailscache[lookupkey];
                var $detailselement = cache.html;

                if (this.initrowdetails) {
                    if (this._rowdetailscache[lookupkey].element) {
                        var element = this._rowdetailscache[lookupkey].element;
                        var tablecelloffset = tablecell.coord();
                        var gridcontentoffset = this.gridcontent.coord();
                        var top = parseInt(tablecelloffset.top) - parseInt(gridcontentoffset.top);
                        var left = parseInt(tablecelloffset.left) - parseInt(gridcontentoffset.left);
                        if (this.rtl) {
                            left = 0;
                        }

                        $(element).css('top', top);
                        $(element).css('left', left);
                        $(element).css('display', 'block');
                        $(element).width(this.host.width() - indent);
                        if (this.layoutrowdetails) {
                            this.layoutrowdetails(boundindex, element, this.element, this.getrowdata(boundindex));
                        }
                    }
                }
                else {
                    tablecell[0].innerHTML = $detailselement;
                }
                return;
            }

            tablecell[0].innerHTML = '';
            if (!this.enablerowdetailsindent) {
                indent = 0;
            }

            var detailselement = '<div role="rowgroup" style="border: none; overflow: hidden; width: 100%; height: 100%; margin-left: ' + indent + 'px;">' + renderrow.rowdetails + '</div>';
            if (this.rtl) {
                var detailselement = '<div role="rowgroup" style="border: none; overflow: hidden; width: 100%; height: 100%; margin-left: ' + 0 + 'px; margin-right: ' + indent + 'px;">' + renderrow.rowdetails + '</div>';
            }

            this._rowdetailscache[lookupkey] = { id: tablerow.id, html: detailselement }
            if (this.initrowdetails) {
                var element = $(detailselement)[0];
                $(this.gridcontent).prepend($(element));

                $(element).css('position', 'absolute');
                $(element).width(this.host.width() - indent);
                $(element).height(tablecell.height());

                var tablecelloffset = tablecell.coord();
                $(element).css('z-index', 2000);
                if (this.isTouchDevice()) {
                    $(element).css('z-index', 99999);
                }
                $(element).addClass(this.toThemeProperty('jqx-widget-content'));
                var tablecelloffset = tablecell.coord();
                var gridcontentoffset = this.gridcontent.coord();
                var top = parseInt(tablecelloffset.top) - parseInt(gridcontentoffset.top);
                var left = parseInt(tablecelloffset.left) - parseInt(gridcontentoffset.left);

                $(element).css('top', top);
                $(element).css('left', left);

                this.content[0].scrollTop = 0;
                this.content[0].scrollLeft = 0;
                var details = $($(element).children()[0]);
                if (details[0].id != "") {
                    details[0].id = details[0].id + boundindex;
                }

                this.initrowdetails(boundindex, element, this.element, this.getrowdata(boundindex));

                this._rowdetailscache[lookupkey].element = element;
                this._rowdetailselementscache[boundindex] = element;
            }
            else {
                tablecell[0].innerHTML = detailselement;
            }
        },

        _defaultcellsrenderer: function (value, column) {
            if (column.cellsformat != '') {
                if ($.jqx.dataFormat) {
                    if ($.jqx.dataFormat.isDate(value)) {
                        value = $.jqx.dataFormat.formatdate(value, column.cellsformat, this.gridlocalization);
                    }
                    else if ($.jqx.dataFormat.isNumber(value)) {
                        value = $.jqx.dataFormat.formatnumber(value, column.cellsformat, this.gridlocalization);
                    }
                }
            }

            var margin = '4px';
            if (this.rowsheight != 25) {
                margin = (this.rowsheight / 2 - this._cellheight / 2);
                if (margin < 0) {
                    margin = 4;
                }
                margin += 'px';
            }

            if (this.enableellipsis) {
                if (column.cellsalign == 'center' || column.cellsalign == 'middle') {
                    margin = '5px';
                    return '<div style="text-overflow: ellipsis; overflow: hidden; padding-bottom: 2px; text-align: center; margin-top: ' + margin + ';">' + value + '</div>';
                }

                if (column.cellsalign == 'left')
                    return '<div style="overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: left; margin-right: 2px; margin-left: 4px; margin-top: ' + margin + ';">' + value + '</div>';

                if (column.cellsalign == 'right')
                    return '<div style="overflow: hidden;  text-overflow: ellipsis; padding-bottom: 2px; text-align: right; margin-right: 2px; margin-left: 4px; margin-top: ' + margin + ';">' + value + '</div>';
            }

            if (column.cellsalign == 'center' || column.cellsalign == 'middle') {
                margin = '5px';
                return '<div style="text-align: center; margin-top: ' + margin + ';">' + value + '</div>';
            }
            return '<span style="margin-left: 4px; margin-right: 2px; margin-top: ' + margin + '; float: ' + column.cellsalign + ';">' + value + '</span>';
        },

        getcelltext: function (row, datafield) {
            if (row == null || datafield == null)
                return null;

            var cellvalue = this.getcellvalue(row, datafield);
            var column = this.getcolumn(datafield);
            if (column && column.cellsformat != '') {
                if ($.jqx.dataFormat) {
                    if ($.jqx.dataFormat.isDate(cellvalue)) {
                        cellvalue = $.jqx.dataFormat.formatdate(cellvalue, column.cellsformat, this.gridlocalization);
                    }
                    else if ($.jqx.dataFormat.isNumber(cellvalue)) {
                        cellvalue = $.jqx.dataFormat.formatnumber(cellvalue, column.cellsformat, this.gridlocalization);
                    }
                }
            }
            return cellvalue;
        },

        getcelltextbyid: function (row, datafield) {
            if (row == null || datafield == null)
                return null;

            var cellvalue = this.getcellvaluebyid(row, datafield);
            var column = this.getcolumn(datafield);
            if (column && column.cellsformat != '') {
                if ($.jqx.dataFormat) {
                    if ($.jqx.dataFormat.isDate(cellvalue)) {
                        cellvalue = $.jqx.dataFormat.formatdate(cellvalue, column.cellsformat, this.gridlocalization);
                    }
                    else if ($.jqx.dataFormat.isNumber(cellvalue)) {
                        cellvalue = $.jqx.dataFormat.formatnumber(cellvalue, column.cellsformat, this.gridlocalization);
                    }
                }
            }
            return cellvalue;
        },

        _getcellvalue: function (column, row) {
            var value = null;
            value = row.bounddata[column.datafield];
            if (column.displayfield != null) {
                value = row.bounddata[column.displayfield];
            }

            if (value == null) value = "";
            return value;
        },

        // gets a cell.
        getcell: function (row, datafield) {
            if (row == null || datafield == null)
                return null;

            var rowindex = parseInt(row);
            var datarow = row;
            var value = '';

            if (!isNaN(rowindex)) {
                datarow = this.getrowdata(rowindex);
            }

            if (datarow != null) {
                value = datarow[datafield];
            }

            return this._getcellresult(value, row, datafield);
        },
        // gets the rendered cell data.
        getrenderedcell: function (row, datafield) {
            if (row == null || datafield == null)
                return null;

            var rowindex = parseInt(row);
            var datarow = row;
            var value = '';

            if (!isNaN(rowindex)) {
                datarow = this.getrenderedrowdata(rowindex);
            }

            if (datarow != null) {
                value = datarow[datafield];
            }
            return this._getcellresult(value, row, datafield);
        },

        _getcellresult: function (value, row, datafield) {
            var column = this.getcolumn(datafield);
            if (column == null || column == undefined) {
                return null;
            }

            var properties = column.getcolumnproperties();

            var hidden = properties.hidden;
            var width = properties.width;
            var pinned = properties.pinned;
            var align = properties.cellsalign;
            var format = properties.cellsformat;
            var height = this.getrowheight(row);

            // invalid row.
            if (height == false) {
                return null;
            }

            return { value: value, row: row, column: datafield, datafield: datafield, width: width, height: height, hidden: hidden, pinned: pinned, align: align, format: format };
        },

        setcellvaluebyid: function(row, datafield, value, refresh, sync) {
            var rowindex = this.getrowboundindexbyid(row);
            return this.setcellvalue(rowindex, datafield, value, refresh, sync);
        },

        getcellvaluebyid: function (row, datafield) {
            var rowindex = this.getrowboundindexbyid(row);
            return this.getcellvalue(rowindex, datafield);
        },
       
        setcellvalue: function (row, datafield, value, refresh, sync) {
            if (row == null || datafield == null)
                return false;

            var rowindex = parseInt(row);
            var datasourcerowindex = rowindex;

            var datarow = row;
            if (!isNaN(rowindex)) {
                datarow = this.getrowdata(rowindex);
            }

            var hasfilter = false;
            if (this.filterable && this._initfilterpanel && this.dataview.filters.length) {
                hasfilter = true;
            }
            if (this.virtualmode) {
                this._pagescache = new Array();
            }

            var oldvalue = "";
            var olddisplayvalue = "";
            if (datarow != null && datarow[datafield] !== value) {
                if (datarow[datafield] === null && value === "") {
                    return;
                }

                var column = this._getcolumnbydatafield(datafield);
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
                    olddisplayvalue = datarow[column.displayfield];
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
                        if (!this._updating && refresh != false) {
                            this._renderrows(this.virtualsizeinfo);
                        }
                        return;
                    }
                }
               
                datarow[datafield] = value;
                var renderedrow = this.getrenderedrowdata(rowindex, true);
                renderedrow[datafield] = value;

                if (value != null && value.label != null) {
                    var column = this._getcolumnbydatafield(datafield);
                    datarow[column.displayfield] = value.label;
                    renderedrow[column.displayfield] = value.label;
                    datarow[datafield] = value.value;
                    renderedrow[datafield] = value.value;
                }

                if (hasfilter) {
                    if (datarow.dataindex != undefined) {
                        datasourcerowindex = datarow.dataindex;
                        this.dataview.cachedrecords[datarow.dataindex][datafield] = value;
                        if (value != null && value.label != undefined) {
                            this.dataview.cachedrecords[datarow.dataindex][datafield] = value.value;
                            this.dataview.cachedrecords[datarow.dataindex][column.displayfield] = value.label;
                        }
                    }
                }
            }
            else {
                if (!this._updating && refresh != false) {
                    this._renderrows(this.virtualsizeinfo);
                }
                return false;
            }

            if (this.source && this.source._knockoutdatasource && !this._updateFromAdapter && this.autokoupdates) {
                if (this.source._source._localdata) {
                    var korowindex = rowindex;
                    if (hasfilter) {
                        if (datarow.dataindex != undefined) {
                            korowindex = datarow.dataindex;
                        }
                    }

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
                                for (var p = 0; p < splitMap.length-1; p++) {
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

            if (this.sortcolumn && this.dataview.sortby && !this._updating) {
                var sortinformation = this.getsortinformation();
                if (this.sortcolumn == datafield) {
                    this.dataview.clearsortdata();
                    this.dataview.sortby(sortinformation.sortcolumn, sortinformation.sortdirection.ascending);
                }
            }
            else if (!this._updating){
                if (this.dataview.sortby) {
                    if (this.dataview.sortcache[datafield]) {
                        this.dataview.sortcache[datafield] = null;
                    }
                }
            }

            this._cellscache = new Array();

            if (this.source.updaterow && (sync == undefined || sync == true)) {
                var success = false;
                var me = this.that;
                var result = function (param) {
                    if (false == param) {
                        me.setcellvalue(row, datafield, oldvalue, true, false);
                        if (oldvalue != olddisplayvalue) {
                            me.setcellvalue(row, me.getcolumn(datafield).displayfield, olddisplayvalue, true, false);
                        }
                    }
                }
                try {
                    var rowid = this.getrowid(rowindex);
                    success = this.source.updaterow(rowid, datarow, result);
                    if (success == undefined) success = true;
                }
                catch (error) {
                    success = false;
                    me.setcellvalue(row, datafield, oldvalue, true, false);
                    if (oldvalue != olddisplayvalue) {
                        me.setcellvalue(row, me.getcolumn(datafield).displayfield, olddisplayvalue, true, false);
                    }
                    return;
                }
            }

            //     var rowid = this.getrowid(row);
            var scrollvalue = this.vScrollInstance.value;

            if (this._updating && refresh != true) {
                refresh = false;
            }

            if (refresh == true || refresh == undefined) {
                var me = this.that;
                var updatepager = function () {
                    if (me.pageable && me.updatepagerdetails) {
                        me.updatepagerdetails();
                        if (me.autoheight || me.autorowheight) {
                            me._updatepageviews();
                        }
                    }
                }
                var hasgroups = this.groupable && this.groups.length > 0;

                if (hasfilter && !hasgroups) {
                    if (this.autoheight || this.autorowheight) this.prerenderrequired = true;
                    this.dataview.refresh();
                    this.rendergridcontent(true, false);
                    updatepager();
                    this._renderrows(this.virtualsizeinfo);
                }
                else if (this.sortcolumn && !hasgroups) {
                    if (this.autoheight || this.autorowheight) this.prerenderrequired = true;
                    this.dataview.reloaddata();
                    this.rendergridcontent(true, false);
                    updatepager();
                    this._renderrows(this.virtualsizeinfo);
                }
                else if (this.groupable && this.groups.length > 0) {
                    if (this.autoheight || this.autorowheight) this.prerenderrequired = true;
                    if (this.pageable) {
                        if (this.groups.indexOf(datafield) != -1) {
                            this._pagescache = new Array();
                            this._cellscache = new Array();
                            this.dataview.refresh();
                            this._render(true, true, false, false);
                        }
                        else {
                            this._pagescache = new Array();
                            this._cellscache = new Array();
                            this.dataview.updateview();
                            this._renderrows(this.virtualsizeinfo);
                        }
                    }
                    else {
                        this._pagescache = new Array();
                        this._cellscache = new Array();
                        this.dataview.updateview();
                        this._renderrows(this.virtualsizeinfo);

                        //     this.dataview.updateview();
                        //     this._renderrows(this.virtualsizeinfo);
                    }
                    //                    this.dataview.reloaddata();
                    //                    this.render(true, true, false, false);
                    //                    var datarow = this.getrowdata(row);
                    //                    var renderedrow = this.getrenderedrowdata(rowindex, true);
                    //                    var parentItem = renderedrow.parentItem;
                    //                    this._setgroupstate(parentItem, true, true);
                }
                else {
                    this.dataview.updateview();
                    this._renderrows(this.virtualsizeinfo);
                }
            }
            this.vScrollInstance.setPosition(scrollvalue);
            if (this.showaggregates && this._updatecolumnsaggregates) {
                this._updatecolumnsaggregates();
            }
            if (this.showfilterrow && this.filterable && this.filterrow) {
                var filtertype = this.getcolumn(datafield).filtertype;
                if (filtertype == 'list' || filtertype == 'checkedlist') {
                    this._updatelistfilters(true);
                }
            }

            this._raiseEvent(19, { rowindex: row, datafield: datafield, newvalue: value, value: value, oldvalue: oldvalue });
            return true;
        },

        // get cell's bound value.
        getcellvalue: function (row, datafield) {
            if (row == null || datafield == null)
                return null;

            var rowindex = parseInt(row);
            var datarow = row;
            if (!isNaN(rowindex)) {
                datarow = this.getrowdata(rowindex);
            }

            if (datarow != null) {
                var value = datarow[datafield];
                return value;
            }

            return null;
        },

        getrows: function () {
            var length = this.dataview.records.length;
            if (this.virtualmode) {
                var rows = new Array();

                for (var i = 0; i < this.dataview.records.length; i++) {
                    var record = this.dataview.records[i];
                    if (record) {
                        rows.push(record);
                    }
                }
                if (this.dataview.records.length === undefined) {
                    $.each(this.dataview.records, function () {
                        var record = this;
                        if (record) {
                            rows.push(record);
                        }
                    });
                }

                var recordsoffset = 0;
                if (this.pageable) {
                    recordsoffset = this.dataview.pagenum * this.dataview.pagesize;
                }

                if (rows.length > this.source._source.totalrecords - recordsoffset) {
                    return rows.slice(0, this.source._source.totalrecords - recordsoffset);
                }
                return rows;
            }

            if (this.dataview.sortdata) {
                var rows = new Array();
                for (var i = 0; i < length; i++) {
                    var item = {};
                    item = $.extend({}, this.dataview.sortdata[i].value);
                    rows[i] = item;
                }
                return rows;
            }
            else return this.dataview.records;
        },

        getrowboundindexbyid: function(id)
        {
            var rowdata = this.dataview.recordsbyid["id" + id];
            if (rowdata) {
                if (rowdata.boundindex)
                    return this.getboundindex(rowdata);
            }

            var rows = this.getboundrows();
            for (var i = 0; i < rows.length; i++) {
                if (rows[i]) {
                    if (rows[i].uid == id) {
                        return i;
                    }
                }
            }

            return -1;
        },

        getrowdatabyid: function(id)
        {
            var rowdata = this.dataview.recordsbyid["id" + id];
            if (rowdata) {
                return rowdata;
            }
            else {
                var index = this.getrowboundindexbyid(id);
                return this.getboundrows()[index];
            }

            return null;
        },

        // get getrowdata.
        getrowdata: function (boundindex) {
            if (boundindex == undefined)
                boundindex = 0;

            if (this.virtualmode) {
                var record = this.dataview.records[boundindex];
                return record;
            }
            else {
                var record = this.getboundrows()[boundindex];
                return record;
            }

            return null;
        },

        // deprecated.
        // get visible row data.
        getrenderedrowdata: function (boundindex, bypasspaging) {
            if (boundindex == undefined)
                boundindex = 0;

            if (this.virtualmode) {
                var visibleindex = this.getrowvisibleindex(boundindex);
                var record = this.dataview.loadedrecords[visibleindex];
                return record;
            }

            var visibleindex = this.getrowvisibleindex(boundindex);
            if (visibleindex >= 0) {
                if (this.groupable && this.groups.length > 0) {
                    var record = this.dataview.loadedrecords[visibleindex];
                }
                else {
                    var record = this.dataview.loadedrecords[visibleindex];

                    if (this.pageable && (bypasspaging == undefined || bypasspaging == false)) {
                        var record = this.dataview.loadedrecords[this.dataview.pagesize * this.dataview.pagenum + boundindex];
                    }
                }
                return record;
            }

            return null;
        },

        // gets all rows loaded in jqxGrid.
        getboundrows: function () {
            return this.dataview.cachedrecords;
        },

        getrowdisplayindex: function(boundindex)
        {
            var rows = this.getdisplayrows();
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].dataindex !== undefined) {
                    if (rows[i].dataindex === boundindex)
                        return rows[i].visibleindex;
                }
                else {
                    if (rows[i].boundindex === boundindex)
                        return rows[i].visibleindex;
                }
            }
            return -1;
        },

        getboundindex: function(row)
        {
            var boundindex = row.boundindex;
            if (this.dataview.filters.length > 0) {
                if (row.bounddata) {
                    if (row.bounddata.dataindex !== undefined) {
                        boundindex = row.bounddata.dataindex;
                    }
                }
                else {
                    if (row.dataindex !== undefined) {
                        boundindex = row.dataindex;
                    }
                }
            }
            return boundindex;
        },

        getrowboundindex: function (displayindex) {
            var rowdata = this.getdisplayrows()[displayindex];
            if (rowdata) {
                if (rowdata.dataindex !== undefined) {
                    return rowdata.dataindex;
                }

                return rowdata.boundindex;
            }
            return -1;
        },

        // gets all rows displayed in jqxGrid.
        getdisplayrows: function()
        {
            return this.dataview.loadedrecords;
        },

        // deprecated.
        getloadedrows: function () {
            return this.getdisplayrows();
        },

        // deprecated.
        getvisiblerowdata: function (visibleindex) {
            var visiblerows = this.getvisiblerows();
            if (visiblerows) {
                return visiblerows[visibleindex];
            }

            return null;
        },

        // deprecated.
        getloadedrowdata: function (visibleindex) {
            var visiblerows = this.getloadedrows();
            if (visiblerows) {
                return visiblerows[visibleindex];
            }

            return null;
        },

        // deprecated.
        getvisiblerows: function () {
            if (this.virtualmode) {
                return this.dataview.loadedrecords
            }

            if (this.pageable) {
                var rows = [];
                for (var i = 0; i < this.dataview.pagesize; i++) {
                    var record = this.dataview.loadedrecords[i + (this.dataview.pagesize * this.dataview.pagenum)];
                    if (record == undefined) break;
                    rows.push(record);
                }
                return rows;
            }
            else {
                if (this._startboundindex != undefined && this._endboundindex != undefined) {
                    var rows = [];

                    for (var i = this._startvisibleindex; i <= this._endvisibleindex; i++) {
                        var record = this.dataview.loadedrecords[i];
                        if (record == undefined) break;
                        rows.push(record);
                    }
                    return rows;
                }
            }

            return this.dataview.loadedrecords;
        },

        // get row id.
        getrowid: function (boundindex) {
            if (boundindex == undefined)
                boundindex = 0;

            if (this.virtualmode) {
                var visibleindex = this.getrowvisibleindex(boundindex);
                var record = this.dataview.loadedrecords[visibleindex];
                if (record)
                    return record.uid;
            }
            else {
                var record = null;
                var hasFilters = this.dataview.filters.length > 0;
                if (boundindex >= 0 && boundindex < this.dataview.bounditems.length && !hasFilters) {
                    if (this.groupable && this.groups.length > 0) {
                        var visibleindex = this.getrowvisibleindex(boundindex);
                        var record = this.dataview.loadedrecords[visibleindex];
                    }
                    else {
                        var visibleindex = this.getrowvisibleindex(boundindex);
                        var record = this.dataview.loadedrecords[visibleindex];
                    }
                    if (record)
                        return record.uid;
                }
                if (this.dataview.filters.length > 0) {
                    var record = this.getboundrows()[boundindex];
                    if (record) {
                        if (record.uid != null) {
                            return record.uid;
                        }
                    }
                    return null;
                }
            }

            return null;
        },

        _updateGridData: function (reason) {
            var hasfilter = false;
            if (this.filterable && this._initfilterpanel && this.dataview.filters.length) {
                hasfilter = true;
            }
            if (hasfilter) {
                this.dataview.refresh();
                if (reason == "updaterow") {
                    this._render(true, true, false, false, false);
                    this.invalidate();
                }
                else {
                    this.render();
                }
            }
            else if (this.sortcolumn || (this.groupable && this.groups.length > 0)) {
                this.dataview.reloaddata();
                this.render();
            }
            else {
                this._cellscache = new Array();
                this._pagescache = new Array();
                this._renderrows(this.virtualsizeinfo);
            }
            if (this.showfilterrow && this.filterable && this.filterrow) {
                this._updatelistfilters(true);
            }
        },

        // update row.
        updaterow: function (rowid, rowdata, refresh) {
            if (rowid != undefined && rowdata != undefined) {
                var me = this.that;
                var success = false;
                me._datachanged = true;
                var applychanges = function (me, rowid, rowdata) {
                    if (me._loading) {
                        throw new Error('jqxGrid: ' + me.loadingerrormessage);
                        return false;
                    }

                    var success = false;
                    if (!$.isArray(rowid)) {
                        success = me.dataview.updaterow(rowid, rowdata);
                    }
                    else {
                        $.each(rowid, function (index, value) {
                            success = me.dataview.updaterow(this, rowdata[index], false);
                        });
                        me.dataview.refresh();
                    }

                    var scrollvalue = me.vScrollInstance.value;
                    if (refresh == undefined || refresh == true) {
                        if (me._updating == undefined || me._updating == false) {
                            me._updateGridData("updaterow");
                        }
                    }

                    if (me.showaggregates && me._updatecolumnsaggregates) {
                        me._updatecolumnsaggregates();
                    }

                    if (me.source && me.source._knockoutdatasource && !me._updateFromAdapter && me.autokoupdates) {
                        if (me.source._source._localdata) {
                            var record = me.dataview.recordsbyid["id" + rowid];
                            var recordindex = me.dataview.records.indexOf(record);
                            var olditem = me.source._source._localdata()[recordindex];
                            me.source.suspendKO = true;
                            me.source._source._localdata.replace(olditem, $.extend({}, record));
                            me.source.suspendKO = false;
                        }
                    }

                    me.vScrollInstance.setPosition(scrollvalue);
                    return success;
                }

                if (this.source.updaterow) {
                    var done = function (result) {
                        if (result == true || result == undefined) {
                            applychanges(me, rowid, rowdata);
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
                    success = applychanges(me, rowid, rowdata);
                }

                return success;
            }

            return false;
        },

        // delete row.
        deleterow: function (rowid, refresh) {
            if (rowid != undefined) {
                this._datachanged = true;
                var success = false;
                var me = this.that;

                var applychanges = function (me, rowid) {
                    if (me._loading) {
                        throw new Error('jqxGrid: ' + me.loadingerrormessage);
                        return false;
                    }
					
                    var success = false;
                    var scrollvalue = me.vScrollInstance.value;
                    if (!$.isArray(rowid)) {
                        var success = me.dataview.deleterow(rowid);
                    }
                    else {
                        $.each(rowid, function () {
                            success = me.dataview.deleterow(this, false);
                        });
                        me.dataview.refresh();
                    }
                    if (me._updating == undefined || me._updating == false) {
                        if (refresh == undefined || refresh == true) {
                            me._render(true, true, false, false);
                            if (me.vScrollBar.css('visibility') != 'visible') {
                                me._arrange();
                                me._updatecolumnwidths();
                                me._updatecellwidths();
                                me._renderrows(me.virtualsizeinfo);
                            }
                        }
                    }

                    if (me.source && me.source._knockoutdatasource && !me._updateFromAdapter && me.autokoupdates) {
                        if (me.source._source._localdata) {
                            me.source.suspendKO = true;
                            me.source._source._localdata.pop(rowdata);
                            me.source.suspendKO = false;
                        }
                    }

                    me.vScrollInstance.setPosition(scrollvalue);
					
					// row 삭제 시에 sort에 대한 cache를 지운다. - ysjung(2014/03/20)
					me.dataview.clearsortdata();
                    return success;
                }

                if (this.source.deleterow) {
                    var done = function (result) {
                        if (result == true || result == undefined) {
                            applychanges(me, rowid);
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
                    success = applychanges(me, rowid);
                }
                return success;
            }

            return false;
        },

        // add row.
        addrow: function (rowid, rowdata, position) {
            if (rowdata != undefined) {
                this._datachanged = true;
                if (position == undefined) {
                    position = 'last';
                }

                var success = false;
                var me = this.that;

                if (rowid == null) {
                    var hasFilter = this.dataview.filters && this.dataview.filters.length > 0;
                    var totallength = !hasFilter ? this.dataview.totalrecords : this.dataview.cachedrecords.length;
                    if (!$.isArray(rowdata)) {
                        rowid = this.dataview.getid(this.dataview.source.id, rowdata, totallength);
                        while (null != this.dataview.recordsbyid["id" + rowid]) {
                            rowid++;
                        }
                    } else {
                        var ids = new Array();
                        $.each(rowdata, function (index, value) {
                            var id = me.dataview.getid(me.dataview.source.id, rowdata[index], totallength + index);
                            ids.push(id);
                        });
                        rowid = ids;
                    }
                }

                var applychanges = function (me, rowid, rowdata, position) {
                    if (me._loading) {
                        throw new Error('jqxGrid: ' + me.loadingerrormessage);
                        return false;
                    }

                    var scrollvalue = me.vScrollInstance.value;
                    var success = false;
                    if (!$.isArray(rowdata)) {
                        if (rowdata != undefined && rowdata.dataindex != undefined) {
                            delete rowdata.dataindex;
                        }
                        success = me.dataview.addrow(rowid, rowdata, position);
                    }
                    else {
                        $.each(rowdata, function (index, value) {
                            if (this.dataindex != undefined) {
                                delete this.dataindex;
                            }

                            var id = null;
                            if (rowid != null && rowid[index] != null) id = rowid[index];
                            success = me.dataview.addrow(id, this, position, false);
                        });
                        me.dataview.refresh();
                    }

                    if (me._updating == undefined || me._updating == false) {
                        me._render(true, true, false, false);
                        me.invalidate();
                    }

                    if (me.source && me.source._knockoutdatasource && !me._updateFromAdapter && me.autokoupdates) {
                        if (me.source._source._localdata) {
                            me.source.suspendKO = true;
                            me.source._source._localdata.push(rowdata);
                            me.source.suspendKO = false;
                        }
                    }

                    if (me.scrollmode != "deferred") {
                        me.vScrollInstance.setPosition(scrollvalue);
                    }
                    else {
                        me.vScrollInstance.setPosition(0);
                    }

                    return success;
                }

                if (this.source.addrow) {
                    var done = function (result, ids) {
                        if (result == true || result == undefined) {
                            if (ids != undefined) rowid = ids;
                            applychanges(me, rowid, rowdata, position);
                        }
                    }
                    // undefined or true response code are handled as success. false or exception as failure
                    try {
                        success = this.source.addrow(rowid, rowdata, position, done);
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

        _findvisiblerow: function (value, collection) {
            if (value == undefined) {
                value = parseInt(this.vScrollInstance.value);
            }
            var min = 0;
            if (collection == undefined || collection == null) {
                collection = this.rows.records;
            }

            var max = collection.length;
            while (min <= max) {
                mid = parseInt((min + max) / 2)
                var item = collection[mid];

                if (item == undefined)
                    break;

                if (item.top > value && item.top + item.height > value) {
                    max = mid - 1;
                } else if (item.top < value && item.top + item.height < value) {
                    min = mid + 1;
                } else {
                    return mid;
                    break;
                }
            }

            return -1;
        },

        _updatecellwidths: function () {
            var virtualsizeinfo = this.virtualsizeinfo;
            if (!virtualsizeinfo) {
                return;
            }
            var me = this.that;

            if (this.gridcontent == undefined)
                return;

            if (this.table == undefined) {
                this.table = this.gridcontent.find('#contenttable' + this.element.id);
            }

            var hasgroups = this.groupable && this.groups.length > 0;
            var tablewidth = 0;
            var pagesize = virtualsizeinfo.visiblerecords;

            if (this.pageable && (this.autoheight || this.autorowheight)) {
                pagesize = this.dataview.pagesize;

                if (this.groupable) {
                    this.dataview.updateview();
                    pagesize = this.dataview.rows.length;
                }
            }

            if (!this.groupable && !this.pageable && (this.autoheight || this.autorowheight)) {
                pagesize = this.dataview.totalrecords;
            }

            if (this.rowdetails) {
                pagesize += this.dataview.pagesize;
            }

            var columnslength = this.columns.records.length;
            var rows = this.table[0].rows;
            for (var i = 0; i < pagesize; i++) {
                var tablerow = rows[i];
                if (!tablerow)
                    break;

                var cells = tablerow.cells;
                var left = 0;
                for (var j = 0; j < columnslength; j++) {
                    var columnrecord = this.columns.records[j];
                    var width = columnrecord.width;
                    var tablecolumn = cells[j];
                    if (parseInt(tablecolumn.style.left) != left) {
                        tablecolumn.style.left = left + 'px';
                    }

                    if (parseInt(tablecolumn.style.width) != width) {
                        tablecolumn.style.width = width + 'px';
                    }
               //     tablecolumn[0].left = left;
                    if (!(columnrecord.hidden && columnrecord.hideable)) {
                        left += width;
                    }
                    else {
                        tablecolumn.style.display = "none";
                    }
                }

                if (tablewidth == 0) {
                    this.table.width(parseInt(left) + 2);
                    tablewidth = left;
                }
            }

            if (this.showaggregates && this._updateaggregates) {
                this._updateaggregates();
            }
            if (this.showfilterrow && this.filterable && this._updatefilterrowui) {
                this._updatefilterrowui();
            }
            this._updatescrollbarsafterrowsprerender();
            if (hasgroups) {
                this._renderrows(this.virtualsizeinfo);
            }
        },

        _updatescrollbarsafterrowsprerender: function () {
            var hscrollbarvisibility = this.hScrollBar[0].style.visibility;
            var offset = 0;
            var vscrollbarvisibility = this.vScrollBar[0].style.visibility;
            if (vscrollbarvisibility == 'visible') {
                offset = this.scrollbarsize + 3;
            }
            var w = this.element.style.width;
            if (w.toString().indexOf('%') >= 0) {
                w = this.host.width();
            }
            else {
                w = parseInt(w);
            }

            if (parseInt(this.table[0].style.width) - 2 > w - offset) {
                if (hscrollbarvisibility != 'visible') {
                    if (!this.autowidth) {
                        this.hScrollBar[0].style.visibility = 'visible';
                    }
                    this._arrange();
                }

                if (vscrollbarvisibility == 'visible') {
                    if (this.scrollmode != 'deferred' && !this.virtualmode) {
                        if (this.virtualsizeinfo) {
                            var vscrollbarmax = this.virtualsizeinfo.virtualheight - this._gettableheight();
                            if (!isNaN(vscrollbarmax) && vscrollbarmax > 0) {
                                if (hscrollbarvisibility != 'hidden') {
                                    this.vScrollBar.jqxScrollBar('max', vscrollbarmax + this.scrollbarsize + 4);
                                }
                                else {
                                    this.vScrollBar.jqxScrollBar('max', vscrollbarmax);
                                }
                            }
                        }
                    }
                    else {
                        this._updatevscrollbarmax();
                    }
                }
                else {
                    offset = -2;
                }

                this.hScrollBar.jqxScrollBar('max', offset + this.table.width() - this.host.width());
            }
            else {
                if (hscrollbarvisibility != 'hidden') {
                    this.hScrollBar.css('visibility', 'hidden');
                    this._arrange();
                }
            }
            this._renderhorizontalscroll();
        },

        _prerenderrows: function (virtualsizeinfo) {
            var me = this.that;
            if (this.prerenderrequired == true) {
                this.prerenderrequired = false;
                if (this.editable && this._destroyeditors) {
                    this._destroyeditors();
                }

                if (this.gridcontent == undefined)
                    return;

                this.gridcontent.find('#contenttable' + this.element.id).remove();
                if (this.table != null) {
                    this.table.remove();
                    this.table = null;
                }

                this.table = $('<div id="contenttable' + this.element.id + '" style="overflow: hidden; position: relative;" height="100%"></div>');
                this.gridcontent.addClass(this.toTP('jqx-grid-content'));
                this.gridcontent.addClass(this.toTP('jqx-widget-content'));
                this.gridcontent.append(this.table);
                var hasgroups = this.groupable && this.groups.length > 0;
                var tablewidth = 0;
                this.table[0].rows = new Array();
                var cellclass = this.toTP('jqx-grid-cell');
                if (hasgroups) {
                    cellclass = ' ' + this.toTP('jqx-grid-group-cell');
                }

                var pagesize = virtualsizeinfo.visiblerecords;

                if (this.pageable && (this.autoheight || this.autorowheight)) {
                    pagesize = this.dataview.pagesize;
                    if (this.groupable) {
                        this.dataview.updateview();
                        pagesize = this.dataview.rows.length;
                        if (pagesize < this.dataview.pagesize) {
                            pagesize = this.dataview.pagesize;
                        }
                    }
                }

                if (!this.pageable && (this.autoheight || this.autorowheight)) {
                    pagesize = this.dataview.totalrecords;
                }

                if (this.groupable && (this.autoheight || this.autorowheight) && !this.pageable) {
                    pagesize = this.dataview.rows.length;
                }

                if (this.rowdetails) {
                    if (this.autoheight || this.autorowheight) {
                        pagesize += this.dataview.pagesize;
                    }
                    else {
                        pagesize += pagesize;
                    }
                }

                var columnslength = this.columns.records.length;

                if ($.jqx.browser.msie && $.jqx.browser.version > 8) {
                    this.table.css('opacity', '0.99');
                }

                if ($.jqx.browser.mozilla) {
                    this.table.css('opacity', '0.99');
                }

                if (navigator.userAgent.indexOf('Safari') != -1) {
                    this.table.css('opacity', '0.99');
                }

                var isIE7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
                if (isIE7) {
                    this.host.attr("hideFocus", "true");
                }

                var zindex = this.tableZIndex;
                if (pagesize * columnslength > zindex) {
                    zindex = pagesize * columnslength;
                }
                var isempty = this.dataview.records.length == 0;
                var isTouch = this.isTouchDevice();
                var tableHTML = "";
                this._hiddencolumns = false;
                for (var i = 0; i < pagesize; i++) {
                    var tablerow = '<div role="row" style="position: relative; height=' + this.rowsheight + 'px;" id="row' + i + this.element.id + '">';
                    if (isIE7) {
                        var tablerow = '<div role="row" style="position: relative; z-index: ' + zindex + '; height:' + this.rowsheight + 'px;" id="row' + i + this.element.id + '">';
                        zindex--;
                    }

                    var left = 0;

                    for (var j = 0; j < columnslength; j++) {
                        var columnrecord = this.columns.records[j];
                        var width = columnrecord.width;
                        if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                        if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;
                        if (this.rtl) {
                            var rtlzindex = zindex - columnslength + 2 * j;
                            var tablecolumn = '<div role="gridcell" style="left: ' + left + 'px; z-index: ' + rtlzindex + '; width:' + width + 'px;';
                            zindex--;
                        }
                        else var tablecolumn = '<div role="gridcell" style="left: ' + left + 'px; z-index: ' + zindex-- + '; width:' + width + 'px;';

                        if (!(columnrecord.hidden && columnrecord.hideable)) {
                            left += width;
                        }
                        else {
                            tablecolumn += 'display: none;'
                            this._hiddencolumns = true;
                            zindex++;
                        }
                        tablecolumn += '" class="' + cellclass + '"></div>';
                        tablerow += tablecolumn;
                    }

                    if (tablewidth == 0) {
                        this.table.width(parseInt(left) + 2);
                        tablewidth = left;
                    }

                    tablerow += '</div>';
                    tableHTML += tablerow;
                }

                if (me.WinJS) {
                    MSApp.execUnsafeLocalFunction(function () {
                        me.table.html(tableHTML);
                    });
                }
                else {
                    me.table[0].innerHTML = tableHTML;
                }

                this.table[0].rows = new Array();
                var rows = this.table.children();
                for (var i = 0; i < pagesize; i++) {
                    var row = rows[i];
                    this.table[0].rows.push(row);
                    row.cells = new Array();
                    var cells = $(row).children();
                    for (var j = 0; j < columnslength; j++) {
                        row.cells.push(cells[j]);
                    }
                }

                if (pagesize == 0) {
                    var left = 0;
                    if (this.showemptyrow) {
                        var tablerow = $('<div style="position: relative;" id="row0' + this.element.id + '"></div>');
                        this.table.append(tablerow);
                        tablerow.height(this.rowsheight);
                        this.table[0].rows[0] = tablerow[0];
                        this.table[0].rows[0].cells = new Array();
                    }
                    for (var j = 0; j < columnslength; j++) {
                        var columnrecord = this.columns.records[j];
                        var width = columnrecord.width;
                        if (this.showemptyrow) {
                            var tablecolumn = $('<div style="position: absolute; height: 100%; left: ' + left + 'px; z-index: ' + zindex-- + '; width:' + width + 'px;" class="' + cellclass + '"></div>');
                            tablecolumn.height(this.rowsheight);
                            tablerow.append(tablecolumn);
                            this.table[0].rows[0].cells[j] = tablecolumn[0];
                        }
                        if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                        if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;
                        if (!(columnrecord.hidden && columnrecord.hideable)) {
                            left += width;
                        }
                    }
                    this.table.width(parseInt(left) + 2);
                    tablewidth = left;
                }

                this._updatescrollbarsafterrowsprerender();
                // callback when the rendering is complete.
                if (this.rendered) {
                    this.rendered('rows');
                }
                this._addoverlayelement();
            }
        },

        _groupsheader: function () {
            return this.groupable && this.showgroupsheader;
        },

        _arrange: function () {
            var width = null;
            var height = null;
            this.tableheight = null;
            var me = this.that;
            var isPercentageWidth = false;
            var isPercentageHeight = false;
     
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                width = this.width;
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    width = this.width;
                };

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                width = this.width;
                isPercentageWidth = true;
            }

            if (this.autowidth) {
                var w = 0;
                for (var i = 0; i < this.columns.records.length; i++) {
                    var cw = this.columns.records[i].width;
                    if (cw == 'auto') {
                        cw = this._measureElementWidth(this.columns.records[i].text);
                        w += cw;
                    }
                    else {
                        w += cw;
                    }
                }
                if (this.vScrollBar.css('visibility') != 'hidden') {
                    w += this.scrollbarsize + 4
                }

                width = w;
                this.width = width;
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                height = this.height;
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                height = this.height;
            };

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                height = this.height;
                isPercentageHeight = true;
            }

            var baseheight = function () {
                var height = 0;
                var columnheaderheight = me.showheader ? me.columnsheader != null ? me.columnsheader.height() + 2 : 0 : 0;
                height += columnheaderheight;
                if (me.pageable) {
                    height += me.pagerheight;
                }
                if (me._groupsheader()) {
                    height += me.groupsheaderheight;
                }
                if (me.showtoolbar) {
                    height += me.toolbarheight;
                }
                if (me.showstatusbar) {
                    height += me.statusbarheight;
                }
                if (me.hScrollBar[0].style.visibility == 'visible') {
                    height += 20;
                }

                return height;
            }

            if (this.autoheight && this.virtualsizeinfo) {
                if (this.pageable && this.gotopage) {
                    //var newheight = this.host.height() - this._gettableheight();
                    var newheight = 0;
                    height = newheight + (this._pageviews[0] ? this._pageviews[0].height : 0);
                    //if (height == 0) {
                    height += baseheight();               
                    //}
                    if (this.showemptyrow && this.dataview.totalrecords == 0) {
                        height += this.rowsheight;
                    }
                }
                else {
                    var newheight = this.host.height() - this._gettableheight();
                    if (this._pageviews.length > 0) {
                        height = newheight + this._pageviews[this._pageviews.length - 1].height + this._pageviews[this._pageviews.length - 1].top;
                        this.vScrollBar[0].style.visibility = 'hidden';
                    }
                    else {
                        height = baseheight();
                        if (this.showemptyrow) {
                            height += this.rowsheight;
                        }
                    }
                }
            }
            else if (this.autoheight) {
                height = this.dataview.totalrecords * this.rowsheight;
                if (this._loading) {
                    height = 250;
                    this.dataloadelement.height(height);
                }
                height += baseheight();

                if (height > 10000)
                    height = 10000;
            }

            if (width != null) {
                width = parseInt(width);
                if (!isPercentageWidth) {
                    if (this.element.style.width != parseInt(this.width) + 'px') {
                        this.element.style.width = parseInt(this.width) + 'px';
                    }
                }
                else {
                    this.element.style.width = this.width;
                }

                if (isPercentageWidth) {
                    width = this.host.width();
                    if (width <= 2) {
                        width = 600;
                        this.host.width(width);
                    }
                    if (!this._oldWidth) {
                        this._oldWidth = width;
                    }
                }
            }
            else this.host.width(250);

            if (height != null) {
                if (!isPercentageHeight) {
                    height = parseInt(height);
                }

                if (!isPercentageHeight) {
                    if (this.element.style.height != parseInt(height) + 'px') {
                        this.element.style.height = parseInt(height) + 'px';
                    }
                }
                else {
                    this.element.style.height = this.height;
                }

                if (isPercentageHeight && !this.autoheight) {
                    height = this.host.height();
                    if (height == 0) {
                        height = 400;
                        this.host.height(height);
                    }
                    if (!this._oldHeight) {
                        this._oldHeight = height;
                    }
                }
            }
            else this.host.height(250);

            if (this.autoheight) {
                this.tableheight = null;
                this._gettableheight();
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

            if (this.showstatusbar) {
                if (this.showaggregates) {
                    this.statusbar.width(!this.table ? width : Math.max(width, this.table.width()));
                }
                else {
                    this.statusbar.width(width);
                }

                this.statusbar.height(this.statusbarheight);
            }
            else {
                this.statusbar[0].style.height = '0px';
            }

            if (this._groupsheader()) {
                this.groupsheader.width(width);
                this.groupsheader.height(this.groupsheaderheight);
                this.groupsheader.css('top', top);
                var groupsheaderheight = this.groupsheader.height() + 1;
                top += groupsheaderheight;
                if (height > groupsheaderheight) {
                    height -= parseInt(groupsheaderheight);
                }
            }
            else {
                if (this.groupsheader[0].style.width != width + 'px') {
                    this.groupsheader[0].style.width = parseInt(width) + 'px';
                }
                if (this.groupsheader[0].style.height != this.groupsheaderheight + 'px') {
                    this.groupsheader[0].style.height = parseInt(this.groupsheaderheight) + 'px';
                }

                if (this.groupsheader[0].style.top != top + 'px') {
                    this.groupsheader.css('top', top);
                }

                var groupsheaderheight = this.showgroupsheader && this.groupable ? this.groupsheaderheight : 0;
                var newContentTop = top + groupsheaderheight + 'px';
                if (this.content[0].style.top != newContentTop) {
                    this.content.css('top', top + this.groupsheaderheight);
                }
            }

            // scrollbar Size.
            var scrollSize = this.scrollbarsize;
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
            if (this.vScrollBar[0].style.visibility == 'visible') {
                rightSizeOffset = scrollSize + scrollOffset;
            }

            // bottom scroll offset.
            if (this.hScrollBar[0].style.visibility == 'visible') {
                bottomSizeOffset = scrollSize + scrollOffset + 2;
            }

            var pageheight = 0;
            if (this.pageable) {
                pageheight = this.pagerheight;
                bottomSizeOffset += this.pagerheight;
            }
            if (this.showstatusbar) {
                bottomSizeOffset += this.statusbarheight;
                pageheight += this.statusbarheight;
            }

            if (this.hScrollBar[0].style.height != scrollSize + 'px') {
                this.hScrollBar[0].style.height = parseInt(scrollSize) + 'px';
            }

            if (this.hScrollBar[0].style.top != top + height - scrollOffset - scrollSize - pageheight + 'px' || this.hScrollBar[0].style.left != '0px') {
                this.hScrollBar.css({ top: top + height - scrollOffset - scrollSize - pageheight + 'px', left: '0px' });
            }

            var hScrollWidth = this.hScrollBar[0].style.width;
            var hSizeChange = false;
            var vSizeChange = false;

            if (rightSizeOffset == 0) {
                if (hScrollWidth != (width - 2) + 'px') {
                    this.hScrollBar.width(width - 2);
                    hSizeChange = true;
                }
            }
            else {
                if (hScrollWidth != (width - scrollSize - scrollOffset) + 'px') {
                    this.hScrollBar.width(width - scrollSize - scrollOffset + 'px');
                    hSizeChange = true;
                }
            }


            if (!this.autoheight) {
                if (this.vScrollBar[0].style.width != scrollSize + 'px') {
                    this.vScrollBar.width(scrollSize);
                    vSizeChange = true;
                }
                if (this.vScrollBar[0].style.height != parseInt(height) - bottomSizeOffset + 'px') {
                    this.vScrollBar.height(parseInt(height) - bottomSizeOffset + 'px');
                    vSizeChange = true;
                }
                if (this.vScrollBar[0].style.left != parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px' || this.vScrollBar[0].style.top != top + 'px') {
                    this.vScrollBar.css({ left: parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px', top: top });
                }
            }

            if (this.rtl) {
                this.vScrollBar.css({ left: '0px', top: top });
                if (this.vScrollBar.css('visibility') != 'hidden') {
                    this.hScrollBar.css({ left: scrollSize + 2 });
                }
            }

            var vScrollInstance = this.vScrollInstance;
            vScrollInstance.disabled = this.disabled;
            if (!this.autoheight) {
                if (vSizeChange) {
                    vScrollInstance.refresh();
                }
            }
            var hScrollInstance = this.hScrollInstance;
            hScrollInstance.disabled = this.disabled;
            if (hSizeChange) {
                hScrollInstance.refresh();
            }

            if (this.autowidth) {
                this.hScrollBar[0].style.visibility = 'hidden';
            }

            this.statusbarheight = parseInt(this.statusbarheight);
            this.toolbarheight = parseInt(this.toolbarheight);

            var updateBottomRight = function (me) {
                if ((me.vScrollBar[0].style.visibility == 'visible') && (me.hScrollBar[0].style.visibility == 'visible')) {
                    me.bottomRight[0].style.visibility = 'visible';
                    me.bottomRight.css({ left: 1 + parseInt(me.vScrollBar.css('left')), top: parseInt(me.hScrollBar.css('top')) });
                    if (me.rtl) {
                        me.bottomRight.css('left', '0px');
                    }

                    me.bottomRight.width(parseInt(scrollSize) + 3);
                    me.bottomRight.height(parseInt(scrollSize) + 4);
                    if (me.showaggregates) {
                        me.bottomRight.css('z-index', 99);
                        me.bottomRight.height(parseInt(scrollSize) + 4 + me.statusbarheight);
                        me.bottomRight.css({ top: parseInt(me.hScrollBar.css('top')) - me.statusbarheight });
                    }
                }
                else me.bottomRight[0].style.visibility = 'hidden';
            }

            updateBottomRight(this);
            if (this.content[0].style.width != width - rightSizeOffset + 'px') {
                this.content.width(width - rightSizeOffset);
            }
            if (this.content[0].style.height != height - bottomSizeOffset + 3 + 'px') {
                this.content.height(height - bottomSizeOffset + 3);
            }
            if (this.content[0].style.top != top + 'px') {
                this.content.css('top', top);
            }
            if (this.rtl) {
                this.content.css('left', rightSizeOffset);
                if (this.table) {
                    var tablewidth = this.table.width();
                    if (tablewidth < width - rightSizeOffset) {
                        this.content.css('left',  width - tablewidth);
                    }
                }
            }

            if (this.showstatusbar) {
                this.statusbar.css('top', top + height - this.statusbarheight - (this.pageable ? this.pagerheight : 0));
                if (this.showaggregates) {
                    if (this.hScrollBar.css('visibility') == 'visible') {
                        this.hScrollBar.css({ top: top + height - scrollOffset - scrollSize - pageheight + this.statusbarheight + 'px' });
                        this.statusbar.css('top', 1 + top + height - scrollSize - 5 - this.statusbarheight - (this.pageable ? this.pagerheight : 0));
                    }
                    updateBottomRight(this);
                }
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
                this.pager.width(width);
                this.pager.height(this.pagerheight);
                this.pager.css('top', top + height - this.pagerheight - 1);
            }
            else {
                this.pager[0].style.height = '0px';
            }

            if (this.table != null) {
                var offset = -2;
                if (this.vScrollBar[0].style.visibility == 'visible') {
                    offset = this.scrollbarsize + 3;
                }

                if (this.hScrollBar[0].style.visibility == 'visible') {
                    var newoffset = offset + this.table.width() - this.host.width();
                    if (newoffset >= 0) {
                        this.hScrollBar.jqxScrollBar('max', newoffset);
                    }
                    if (this.hScrollBar[0].style.visibility == 'visible' && newoffset == 0) {
                        this.hScrollBar[0].style.visibility = 'hidden';
                        this._arrange();
                    }
                }
            }

            if (width != parseInt(this.dataloadelement[0].style.width)) {
                this.dataloadelement[0].style.width = this.element.style.width;
            }
            if (height != parseInt(this.dataloadelement[0].style.height)) {
                this.dataloadelement[0].style.height = this.element.style.height;
            }
            this._hostwidth = width;
        },

        // destroy grid.
        destroy: function () {
            delete $.jqx.dataFormat.datescache;
            delete this.gridlocalization;
            $.jqx.utilities.resize(this.host, null, true);

            if (this.table && this.table[0])
            {
                var rowscount = this.table[0].rows.length;
                for (var i = 0; i < rowscount; i++) {
                    var row = this.table[0].rows[i];
                    var cells = row.cells;
                    var cellscount = cells.length;
                    for (var j = 0; j < cellscount; j++) {
                        $(row.cells[j]).remove();
                        row.cells[j] = null;
                        delete row.cells[j];
                    }
                    row.cells = null;
                    if (row.cells) {
                        delete row.cells;
                    }
                    $(this.table[0].rows[i]).remove();
                    this.table[0].rows[i] = null;
                }
                try
                {
                    delete this.table[0].rows;
                }
                catch (error) {
                }
                this.table.remove();
                delete this.table;
            }

            if (this.columns && this.columns.records) {
                for (var i = 0; i < this.columns.records.length; i++) {
                    var column = this.columns.records[i];
                    this._removecolumnhandlers(this.columns.records[i]);
                    if (column.element) {
                        $(column.element).remove();
                        $(column.sortasc).remove();
                        $(column.sortdesc).remove();
                        $(column.filtericon).remove();
                        $(column.menu).remove();

                        column.element = null;
                        column.uielement = null;
                        column.sortasc = null;
                        column.sortdesc = null;
                        column.filtericon = null;
                        column.menu = null;
                        delete column.element;
                        delete column.uielement;
                        delete column.sortasc;
                        delete column.sortdesc;
                        delete column.filtericon;
                        delete column.menu;
                        delete this.columnsrow[0].cells[i];
                    }
                }

                try
                {
                    delete this.columnsrow[0].cells;
                }
                catch (error) {
                }
                delete this.columnsrow;
            }
            jQuery.removeData(document.body, "contextmenu" + this.element.id);

            if (this.host.jqxDropDownList) {
                if (this._destroyfilterpanel) {
                    this._destroyfilterpanel();
                }
            }
            if (this.editable && this._destroyeditors) {
                this._destroyeditors();
            }
            if (this.filterable && this._destroyedfilters && this.showfilterrow) {
                this._destroyedfilters();
            }

            if (this.host.jqxMenu) {
                if (this.gridmenu) {
                    this.removeHandler($(document), 'click.menu' + this.element.id);
                    this.removeHandler(this.gridmenu, 'keydown');
                    this.removeHandler(this.gridmenu, 'closed');
                    this.removeHandler(this.gridmenu, 'itemclick');
                    this.gridmenu.jqxMenu('destroy');
                    this.gridmenu = null;
                }
            }

            if (this.pagershowrowscombo) {
                this.pagershowrowscombo.jqxDropDownList('destroy');
                this.pagershowrowscombo = null;
            }

            if (this.pagerrightbutton) {
                this.removeHandler(this.pagerrightbutton, 'mousedown');
                this.removeHandler(this.pagerrightbutton, 'mouseup');
                this.removeHandler(this.pagerrightbutton, 'click');
                this.pagerrightbutton.jqxButton('destroy');
                this.pagerrightbutton = null;
            }

            if (this.pagerleftbutton) {
                this.removeHandler(this.pagerleftbutton, 'mousedown');
                this.removeHandler(this.pagerleftbutton, 'mouseup');
                this.removeHandler(this.pagerleftbutton, 'click');
                this.pagerleftbutton.jqxButton('destroy');
                this.removeHandler($(document), 'mouseup.pagerbuttons' + this.element.id);
                this.pagerleftbutton = null;
            }

            this.removeHandler($(document), 'selectstart.' + this.element.id);
            this.removeHandler($(document), 'mousedown.resize' + this.element.id);
            this.removeHandler($(document), 'mouseup.resize' + this.element.id);
            this.removeHandler($(document), 'mousemove.resize' + this.element.id);
            if (this.isTouchDevice()) {
                var mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.resize' + this.element.id;
                var mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.resize' + this.element.id;
                var mouseup = $.jqx.mobile.getTouchEventName('touchend') + '.resize' + this.element.id;
                this.removeHandler($(document), mousemove);
                this.removeHandler($(document), mousedown);
                this.removeHandler($(document), mouseup);
            }
            this.removeHandler($(document), 'mousedown.reorder' + this.element.id);
            this.removeHandler($(document), 'mouseup.reorder' + this.element.id);
            this.removeHandler($(document), 'mousemove.reorder' + this.element.id);
            if (this.isTouchDevice()) {
                var mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.reorder' + this.element.id;
                var mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.reorder' + this.element.id;
                var mouseup = $.jqx.mobile.getTouchEventName('touchend') + '.reorder' + this.element.id;
                this.removeHandler($(document), mousemove);
                this.removeHandler($(document), mousedown);
                this.removeHandler($(document), mouseup);
            }
            this.removeHandler($(window), 'resize.' + this.element.id);

            if (this.groupable) {
                var mousemove = 'mousemove.grouping' + this.element.id;
                var mousedown = 'mousedown.grouping' + this.element.id;
                var mouseup = 'mouseup.grouping' + this.element.id;
                this.removeHandler($(document), mousemove);
                this.removeHandler($(document), mousedown);
                this.removeHandler($(document), mouseup);
            }
            if (this.columnsreorder) {
                var mousemove = 'mousemove.reorder' + this.element.id;
                var mousedown = 'mousedown.reorder' + this.element.id;
                var mouseup = 'mouseup.reorder' + this.element.id;
                this.removeHandler($(document), mousemove);
                this.removeHandler($(document), mousedown);
                this.removeHandler($(document), mouseup);
                delete this.columnsbounds;
            }

            if (this.content) {
                this.removeHandler(this.content, 'mousedown');
                this.removeHandler(this.content, 'scroll');
            }

    
            this._removeHandlers();
            this.hScrollInstance.destroy();
            this.vScrollInstance.destroy();
            this.hScrollBar.remove();
            this.vScrollBar.remove();
            this._clearcaches();
            delete this.hScrollInstance;
            delete this.vScrollInstance;
            delete this.visiblerows;
            delete this.hittestinfo;
            delete this.rows;
            delete this.columns;
            delete this.columnsbydatafield;
            delete this.pagescache;
            delete this.pageviews;
            delete this.cellscache;
            delete this.heights;
            delete this.hiddens;
            delete this.hiddenboundrows;
            delete this.heightboundrows;
            delete this.detailboundrows;
            delete this.details;
            delete this.expandedgroups;
            delete this._rowdetailscache;
            delete this._rowdetailselementscache;
            delete this.columnsmenu;
            this.columnsheader.remove();
            delete this.columnsheader;
            this.selectionarea.remove();
            delete this.selectionarea;
            if (this.menuitemsarray && this.menuitemsarray.length) {
                var itemslength = this.menuitemsarray.length;
                for (var i = 0; i < itemslength; i++) {
                    $(this.menuitemsarray[i]).remove();
                }
            }
            delete this.menuitemsarray;

            this.dataview._clearcaches();
            this.content.removeClass();
            this.content.remove();
            this.content = null;
            delete this.content;
            this.vScrollBar = null;
            this.hScrollBar = null;
            delete this.hScrollBar;
            delete this.hScrollBar;
            this.gridcontent.remove();
            delete this.gridcontent;

            if (this.gridmenu) {
                this.gridmenu = null;
                delete this.gridmenu;
            }

            delete this._mousemovefunc;
            delete this._mousewheelfunc;

            this.dataview.destroy();
            delete this.dataview;
            
            this.bottomRight.remove();
            delete this.bottomRight;

            this.wrapper.remove();
            delete this.wrapper;

            if (this.pagerdiv) {
                this.pagerdiv.remove();
                delete this.pagerdiv;
            }
            if (this.pagerpageinput) {
                this.pagerpageinput.remove();
                delete this.pagerpageinput;
            }
            if (this.pagergoto) {
                this.pagergoto.remove();
                delete this.pagergoto;
            }
            if (this.pagershowrows) {
                this.pagershowrows.remove();
                delete this.pagershowrows;
            }
            if (this.pagerfirstbutton) {
                this.pagerfirstbutton.remove();
                delete this.pagerfirstbutton;
            }
            if (this.pagerlastbutton) {
                this.pagerlastbutton.remove();
                delete this.pagerlastbutton;
            }
            if (this.pagerbuttons) {
                this.pagerbuttons.remove();
                delete this.pagerbuttons;
            }
            if (this.pagerdetails) {
                this.pagerdetails.remove();
                delete this.pagerdetails;
            }
            if (this.pagergotoinput) {
                this.pagergotoinput.remove();
                delete this.pagergotoinput;
            }

            this.pager.remove();
            delete this.pager;

            this.groupsheader.remove();
            delete this.groupsheader;

            this.dataloadelement.remove();
            delete this.dataloadelement;

            this.toolbar.remove();
            delete this.toolbar;

            this.statusbar.remove();
            delete this.statusbar;

            this.host.removeData();
            this.host.removeClass();
            this.host.remove();
            this.host = null;
            delete this.host;
            delete this.element;
            delete this.set;
            delete this.get;
            delete this.that;
            delete this.call;
        },

        _initializeColumns: function () {
            var datafields = this.source ? this.source.datafields : null;
            if (datafields == null && this.source && this.source._source) {
                datafields = this.source._source.datafields;
            }
            var hasfields = datafields ? datafields.length > 0 : false;
            if (this.autogeneratecolumns) {
                var cols = new Array();
                if (datafields) {
                    $.each(datafields, function () {
                        var column = { datafield: this.name, text: this.text || this.name, cellsformat: this.format || "" };
                        cols.push(column);
                    });
                }
                else {
                    if (this.source.records.length > 0) {
                        var row = this.source.records[0];
                        for (obj in row) {
                            if (obj != "uid") {
                                var column = {width: 100, datafield: obj, text: obj};
                                cols.push(column);
                            }
                        }
                    }
                }
                this.columns = cols;
            }

            if (this.columns && this.columns.records) {
                for (var i = 0; i < this.columns.records.length; i++) {
                    this._removecolumnhandlers(this.columns.records[i]);
                }
            }
            var me = this.that;
            var _columns = new $.jqx.collection(this.element);
            var visibleindex = 0;
            this._haspinned = false;
            if (!this._columns) {
                this._columns = this.columns;
            }
            else {
                this.columns = this._columns;
            }

            if (this.groupable) {
                $.each(this.groups, function (index) {
                    var column = new jqxGridColumn(me, this);
                    column.visibleindex = visibleindex++;
                    column.width = me.groupindentwidth;
                    _columns.add(column);
                    column.grouped = true;
                    column.filterable = false;
                    column.sortable = false;
                    column.editable = false;
                    column.resizable = false;
                    column.draggable = false;
                });
            }

            if (this.rowdetails && this.showrowdetailscolumn) {
                var column = new jqxGridColumn(me, this);
                column.visibleindex = visibleindex++;
                column.width = me.groupindentwidth;
                column.pinned = true;
                column.editable = false;
                column.filterable = false;
                column.draggable = false;
                column.groupable = false;
                column.resizable = false;
                _columns.add(column);
                me._haspinned = true;
            }

            if (this.selectionmode == "checkbox") {
                var column = new jqxGridColumn(me, this);
                column.visibleindex = visibleindex++;
                column.width = me.groupindentwidth;
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

            var keys = new Array();
            $.each(this.columns, function (index) {
                if (me.columns[index] != undefined) {
                    var column = new jqxGridColumn(me, this);
                    column.visibleindex = visibleindex++;
                    if (this.dataField != undefined) {
                        this.datafield = this.dataField;
                    }
                    if (this.pinned) {
                        me._haspinned = true;
                    }

                    if (this.datafield == null) {
                        if (me.source && me.source._source && (me.source._source.datatype == 'array')) {
                            if (!hasfields) {
                                if (!me.source._source.datafields) {
                                    me.source._source.datafields = new Array();
                                    me.source._source.datafields.push({ name: index.toString() });
                                }
                                else {
                                    me.source._source.datafields.push({ name: index.toString() });
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
                            throw new Error("jqxGrid: Invalid column 'datafield' setting. jqxGrid's columns should be initialized with unique data fields.");
                            me.host.remove();
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

        _initializeRows: function () {
            var _rows = new $.jqx.collection(this.element);
            if (this.rows) {
                this.rows.clear();
            }
            this.rows = _rows;
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            if (this._trigger === false)
                return;

            var evt = this.events[id];
            if (!this._camelCase) {
                evt = evt.toLowerCase();
            }

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

        // performs mouse wheel.
        wheel: function (event, self) {
            if (self.autoheight && self.hScrollBar.css('visibility') != 'visible') {
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
            if (this.vScrollBar.css('visibility') != 'hidden') {
                var oldvalue = this.vScrollInstance.value;
				// wheel한번 돌릴때 4번씩 row를 변경하여 사용성 높임. - ysjung(2014/03/25)
                if (delta < 0) {
                    this.scrollDown();
					this.scrollDown();
					this.scrollDown();
					this.scrollDown();
                }
                else {
					this.scrollUp();
					this.scrollUp();
					this.scrollUp();
					this.scrollUp();
				}
                var newvalue = this.vScrollInstance.value;
                if (oldvalue != newvalue) {
                    return true;
                }
            }
            else if (this.hScrollBar.css('visibility') != 'hidden') {
                var oldvalue = this.hScrollInstance.value;
                if (delta > 0) {
                    if (this.hScrollInstance.value > 2 * this.horizontalscrollbarstep) {
                        this.hScrollInstance.setPosition(this.hScrollInstance.value - 2 * this.horizontalscrollbarstep);
                    }
                    else {
                        this.hScrollInstance.setPosition(0);
                    }
                }
                else {
                    if (this.hScrollInstance.value < this.hScrollInstance.max) {
                        this.hScrollInstance.setPosition(this.hScrollInstance.value + 2 * this.horizontalscrollbarstep);
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

        // scrolls down.
        scrollDown: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value + this.rowsheight <= vScrollInstance.max) {
                vScrollInstance.setPosition(parseInt(vScrollInstance.value) + this.rowsheight);
            }
            else vScrollInstance.setPosition(vScrollInstance.max);
        },

        // scrolls up.
        scrollUp: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value - this.rowsheight >= vScrollInstance.min) {
                vScrollInstance.setPosition(parseInt(vScrollInstance.value) - this.rowsheight);
            }
            else vScrollInstance.setPosition(vScrollInstance.min);
        },

        _removeHandlers: function () {
            var self = this.that;
            this.removeHandler(this.vScrollBar, 'valuechanged');
            this.removeHandler(this.hScrollBar, 'valuechanged');
            this.vScrollInstance.valuechanged = null;
            this.hScrollInstance.valuechanged = null;

            var eventname = 'mousedown.jqxgrid';

            if (this.isTouchDevice()) {
                eventname = $.jqx.mobile.getTouchEventName('touchend');
            }

            this.removeHandler(this.host, 'dblclick.jqxgrid');
            this.removeHandler(this.host, eventname);
            this.removeHandler(this.content, 'mousemove', this._mousemovefunc);
            this.removeHandler(this.host, 'mouseleave.jqxgrid');
            this.removeHandler(this.content, 'mouseenter');
            this.removeHandler(this.content, 'mouseleave');
            this.removeHandler(this.content, 'mousedown');
            this.removeHandler(this.content, 'scroll');
            this.removeHandler(this.content, 'selectstart.' + this.element.id);
            this.removeHandler(this.host, 'dragstart.' + this.element.id);
            this.removeHandler(this.host, 'keydown.edit' + this.element.id);
            this.removeHandler($(document), 'keydown.edit' + this.element.id);
            this.removeHandler($(document), 'keyup.edit' + this.element.id);
            if (this._mousemovedocumentfunc) {
                this.removeHandler($(document), 'mousemove.selection' + this.element.id, this._mousemovedocumentfunc);
            }
            this.removeHandler($(document), 'mouseup.selection' + this.element.id);
            if (this._mousewheelfunc) {
                this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            }
            if (this.editable) {
                this.removeHandler($(document), 'mousedown.gridedit' + this.element.id);
            }
            if (this.host.off) {
                this.content.off('mousemove');
                this.host.off('mousewheel');
            }

        },

        _addHandlers: function () {
            var self = this.that;
            var isTouch = self.isTouchDevice();
            if (!isTouch) {
                this.addHandler(this.host, 'dragstart.' + this.element.id, function (event) {
                    return false;
                });
            }

            if (this.editable) {
                this.addHandler($(document), 'mousedown.gridedit' + this.element.id, function (event) {
                    if (self.editable && self.begincelledit) {
                        if (self.editcell) {
                            if (!self.vScrollInstance.isScrolling() && !self.vScrollInstance.isScrolling()) {
                                var gridOffset = self.host.coord();
                                var gridWidth = self.host.width();
                                var gridHeight = self.host.height();
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
                                    var stopPropagation = false;
                                    if (self.editcell && self.editcell.editor) {
                                        switch (self.editcell.columntype) {
                                            case "datetimeinput":
                                                if (self.editcell.editor.jqxDateTimeInput && self.editcell.editor.jqxDateTimeInput('container')[0].style.display == 'block') {
                                                    var top = self.editcell.editor.jqxDateTimeInput('container').coord().top;
                                                    var bottom = self.editcell.editor.jqxDateTimeInput('container').coord().top + self.editcell.editor.jqxDateTimeInput('container').height();
                                                    if (yclose && (event.pageY < top || event.pageY > bottom)) {
                                                        close = true;
                                                        self.editcell.editor.jqxDateTimeInput('close');
                                                    }
                                                    else {
                                                        return;
                                                    }
                                                }
                                                break;
                                            case "combobox":
                                                if (self.editcell.editor.jqxComboBox && self.editcell.editor.jqxComboBox('container')[0].style.display == 'block') {
                                                    var top = self.editcell.editor.jqxComboBox('container').coord().top;
                                                    var bottom = self.editcell.editor.jqxComboBox('container').coord().top + self.editcell.editor.jqxComboBox('container').height();
                                                    if (yclose && (event.pageY < top || event.pageY > bottom)) {
                                                        close = true;
                                                        self.editcell.editor.jqxComboBox('close');
                                                    }
                                                    else {
                                                        return;
                                                    }
                                                }
                                                break;
                                            case "dropdownlist":
                                                if (self.editcell.editor.jqxDropDownList && self.editcell.editor.jqxDropDownList('container')[0].style.display == 'block') {
                                                    var top = self.editcell.editor.jqxDropDownList('container').coord().top;
                                                    var bottom = self.editcell.editor.jqxDropDownList('container').coord().top + self.editcell.editor.jqxDropDownList('container').height();
                                                    if (yclose && (event.pageY < top || event.pageY > bottom)) {
                                                        close = true;
                                                        self.editcell.editor.jqxDropDownList('close');
                                                    }
                                                    else {
                                                        return;
                                                    }
                                                }
                                                break;
                                            case "template":
                                            case "custom":
                                                var editorType = ['jqxDropDownList', 'jqxComboBox', 'jqxDropDownButton', 'jqxDateTimeInput'];
                                                var testEditorType = function (type) {
                                                    var editorData = self.editcell.editor.data();
                                                    if (editorData[type] && editorData[type].instance.container && editorData[type].instance.container[0].style.display == 'block') {
                                                        var instance = editorData[type].instance;
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
                                                for (var i = 0; i < editorType.length; i++) {
                                                    var result = testEditorType(editorType[i]);
                                                    if (result == false) return;
                                                }
                                                break;
                                        }
                                    }
                                    self.endcelledit(self.editcell.row, self.editcell.column, false, true);
                                }
                            }
                        }
                    }
                });
            }

            this.vScrollInstance.valuechanged = function (params) {
                if (self.virtualsizeinfo) {
                    self._closemenu();
                    if (self.scrollmode != 'physical') {
                        self._renderrows(self.virtualsizeinfo);
                        self.currentScrollValue = params.currentValue;
                    }
                    else {
                        if (self.currentScrollValue != undefined && Math.abs(self.currentScrollValue - params.currentValue) >= 5) {
                            self._renderrows(self.virtualsizeinfo);
                            self.currentScrollValue = params.currentValue;
                        }
                        else {
                            self._renderrows(self.virtualsizeinfo);
                            self.currentScrollValue = params.currentValue;
                        }
                    }

                    if (!self.pageable && !self.groupable && self.dataview.virtualmode) {
                        if (self.loadondemandupdate) {
                            clearTimeout(self.loadondemandupdate);
                        }

                        self.loadondemandupdate = setTimeout(function () {
                            self.loadondemand = true;
                            self._renderrows(self.virtualsizeinfo);
                        }, 100);
                    }
                    if (isTouch) {
                        self._lastScroll = new Date();
                    }
                }
            }

            this.hScrollInstance.valuechanged = function (params) {
                if (self.virtualsizeinfo) {
                    self._closemenu();
                    var doHScroll = function () {
                        self._renderhorizontalscroll();
                        self._renderrows(self.virtualsizeinfo);
                        if (self.editcell && !self.editrow) {
                            if (self._showcelleditor && self.editcell.editing) {
                                if (!self.hScrollInstance.isScrolling()) {
                                    self._showcelleditor(self.editcell.row, self.getcolumn(self.editcell.column), self.editcell.element, self.editcell.init);
                                }
                            }
                        }
                    }

                    var ie10 = self._browser == undefined ? self._isIE10() : self._browser;
                    if (navigator && navigator.userAgent.indexOf('Safari') != -1) {
                        if (self._hScrollTimer) clearTimeout(self._hScrollTimer);
                        self._hScrollTimer = setTimeout(function () {
                            doHScroll();
                        }, 1);
                    }
                    else if ($.jqx.browser.mozilla || $.jqx.browser.msie) {
                        if (self._hScrollTimer) clearTimeout(self._hScrollTimer);
                        self._hScrollTimer = setTimeout(function () {
                            doHScroll();
                        }, 0.01);
                    }
                    else {
                        doHScroll();
                    }

                    if (isTouch) {
                        self._lastScroll = new Date();
                    }
                }
            }

            this._mousewheelfunc = this._mousewheelfunc || function (event) {
                if (!self.editcell && self.enablemousewheel) {
                    self.wheel(event, self);
                    return false;
                }
            };

            this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            this.addHandler(this.host, 'mousewheel', this._mousewheelfunc);

            var eventname = 'mousedown.jqxgrid';

            if (isTouch) {
                eventname = $.jqx.mobile.getTouchEventName('touchend');
            }

            this.addHandler(this.host, eventname, function (event) {
                if (self.isTouchDevice()) {
                    self._newScroll = new Date();
                    if (self._newScroll - self._lastScroll < 500) {
                        return false;
                    }
                    if ($(event.target).ischildof(self.vScrollBar)) {
                        return false;
                    }
                    if ($(event.target).ischildof(self.hScrollBar)) {
                        return false;
                    }
                }
                self._mousedown = new Date();
                var result = self._handlemousedown(event, self);
                if (self.isNestedGrid) {
                    if (!self.resizablecolumn && !self.columnsreorder) {
                        event.stopPropagation();
                    }
                }

                self._lastmousedown = new Date();
                return result;
            });

            if (!isTouch) {
                this.addHandler(this.host, 'dblclick.jqxgrid', function (event) {
                    if (self.editable && self.begincelledit && self.editmode == 'dblclick') {
                        self._handledblclick(event, self);
                    }
                    else if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                        var result = self._handlemousedown(event, self);
                    }

                    self.mousecaptured = false;
                    self._lastmousedown = new Date();
                    return true;
                });

                this._mousemovefunc = function (event) {
                    if (self._handlemousemove) {
                        return self._handlemousemove(event, self);
                    };
                }

                this.addHandler(this.content, 'mousemove', this._mousemovefunc);

                if (self._handlemousemoveselection) {
                    this._mousemovedocumentfunc = function (event) {
                        if (self._handlemousemoveselection) {
                            return self._handlemousemoveselection(event, self);
                        };
                    }

                    this.addHandler($(document), 'mousemove.selection' + this.element.id, this._mousemovedocumentfunc);
                }
                     
                this.addHandler($(document), 'mouseup.selection' + this.element.id, function (event) {
                    if (self._handlemouseupselection) {
                        self._handlemouseupselection(event, self);
                    }
                });
            }

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
                                if (self._handlemouseupselection) {
                                    self._handlemouseupselection(event, self);
                                }
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

            this.focused = false;

            if (!isTouch) {
                this.addHandler(this.content, 'mouseenter', function (event) {
                    self.focused = true;

                    if (self.wrapper) {
                        self.wrapper.attr('tabindex', 1);
                        self.content.attr('tabindex', 2);
                    }

                    if (self._overlayElement) {
                        if (self.vScrollInstance.isScrolling() || self.hScrollInstance.isScrolling()) {
                            self._overlayElement[0].style.visibility = 'visible';
                        }
                        else {
                            self._overlayElement[0].style.visibility = 'hidden';
                        }
                    }
                });

                this.addHandler(this.content, 'mouseleave', function (event) {                  
                    if (self._handlemousemove) {
                        if (self.enablehover) {
                            self._clearhoverstyle();
                        }
                    }
                    if (self._overlayElement) {
                        self._overlayElement[0].style.visibility = 'hidden';
                    }
                    self.focused = false;
                });

                if (this.groupable || this.columnsreorder) {
                    this.addHandler($(document), 'selectstart.' + this.element.id, function (event) {
                        if (self.__drag === true) {
                            return false;
                        }
                    });
                }

                this.addHandler(this.content, 'selectstart.' + this.element.id, function (event) {
                    if (self.enablebrowserselection) {
                        return true;
                    }

                    if (self.showfilterrow) {
                        if ($(event.target).ischildof(self.filterrow))
                            return true;
                    }

                    if (!self.editcell) {
                        return false;
                    }
                });

                this.addHandler($(document), 'keyup.edit' + this.element.id, function (event) {
                    self._keydown = false;
                });

                this.addHandler($(document), 'keydown.edit' + this.element.id, function (event) {
                    self._keydown = true && !self.editcell;
					
					console.log("doc : keydown = " + event.target);
					
                    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                    if (self.handlekeyboardnavigation) {
                        var handled = self.handlekeyboardnavigation(event);
                        if (handled == true)
                            return false;
                    }

                    if (self.editable && self.editcell) {
                        if (key == 13 || key == 27) {
                            if (self._handleeditkeydown) {
                                result = self._handleeditkeydown(event, self);
                            }
                        }
                    }
                    if (key == 27) {
                        self.mousecaptured = false;
                        if (self.selectionarea.css('visibility') == 'visible') {
                            self.selectionarea.css('visibility', 'hidden');
                        }
                    }
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8 && self.focused && !self.isNestedGrid) {
                        if (key == 13 && result == false) {
                            return result;
                        }

                        var result = true;
                        var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                        if (!self.editcell && self.editable && self.editmode != 'programmatic') {
                            if (self._handleeditkeydown) {
                                result = self._handleeditkeydown(event, self);
                            }
                        }
                        if (result && self.keyboardnavigation && self._handlekeydown) {
                            result = self._handlekeydown(event, self);
                            if (!result) {
                                if (event.preventDefault)
                                    event.preventDefault();

                                if (event.stopPropagation != undefined) {
                                    event.stopPropagation();
                                }
                            }
                            return result;
                        }
                    }

                    return true;
                });

                this.addHandler(this.host, 'keydown.edit' + this.element.id, function (event) {
                    var result = true;
                    if (self.handlekeyboardnavigation) {
                        var handled = self.handlekeyboardnavigation(event);
                        if (handled == true) {
                            return false;
                        }
                    }

                    if (self.editable && self.editmode != 'programmatic') {
                        if (self._handleeditkeydown) {
                            result = self._handleeditkeydown(event, self);
                        }
                    }
                    if (!($.jqx.browser.msie && $.jqx.browser.version < 8)) {
                        if (result && self.keyboardnavigation && self._handlekeydown) {
							console.log("host : keydown");
                            result = self._handlekeydown(event, self);
                            if (self.isNestedGrid) {
                                event.stopPropagation();
                            }
                        }
                    }
                    else if (self.isNestedGrid) {
                        if (result && self.keyboardnavigation && self._handlekeydown) {
                            result = self._handlekeydown(event, self);
                            event.stopPropagation();
                        }
                    }

                    if (!result) {
                        if (event.preventDefault)
                            event.preventDefault();

                        if (event.stopPropagation != undefined) {
                            event.stopPropagation();
                        }
                    }
                    return result;
                });
            }
        },

        _hittestrow: function (x, y) {
            if (this.vScrollInstance == null || this.hScrollInstance == null)
                return;

            if (x == undefined) x = 0;
            if (y == undefined) y == 0;

            var vScrollInstance = this.vScrollInstance;
            var hScrollInstance = this.hScrollInstance;
            var verticalscrollvalue = vScrollInstance.value;
            if (this.vScrollBar.css('visibility') != 'visible') {
                verticalscrollvalue = 0;
            }
            var horizontalscrollvalue = hScrollInstance.value;
            if (this.hScrollBar.css('visibility') != 'visible') {
                horizontalscrollvalue = 0;
            }

            if (this.scrollmode == 'deferred' && this._newmax != null) {
                if (verticalscrollvalue > this._newmax) verticalscrollvalue = this._newmax;
            }

            var top = parseInt(verticalscrollvalue) + y;
            var left = parseInt(horizontalscrollvalue) + x;

            if (this.visiblerows == null) {
                return;
            }
            if (this.visiblerows.length == 0) {
                return;
            }

            var details = false;
            var hitIndex = this._findvisiblerow(top, this.visiblerows);
            if (hitIndex >= 0) {
                var hitRow = this.visiblerows[hitIndex];
                var hasdetails = this.rowdetails && hitRow.rowdetails;
                var showdetails = !hitRow.rowdetailshidden;
                if (hasdetails) {
                    var prevRow = this.visiblerows[hitIndex - 1];
                    if (prevRow == hitRow) {
                        hitRow = prevRow;
                        hitIndex--;
                    }

                    if (showdetails) {
                        var rowstop = $(this.hittestinfo[hitIndex].visualrow).position().top + parseInt(this.table.css('top'));
                        var rowsheight = $(this.hittestinfo[hitIndex].visualrow).height();
                        if (!(y >= rowstop && y <= rowstop + rowsheight)) {
                            hitIndex++;
                            hitRow = this.visiblerows[hitIndex];
                            details = true;
                        }
                    }
                }
            }
            return { index: hitIndex, row: hitRow, details: details };
        },

        getcellatposition: function (left, top) {
            var self = this.that;
            var columnheaderheight = this.showheader ? this.columnsheader.height() + 2 : 0;
            var groupsheaderheight = this._groupsheader() ? this.groupsheader.height() : 0;
            var toolbarheight = this.showtoolbar ? this.toolbarheight : 0;
            groupsheaderheight += toolbarheight;

            var hostoffset = this.host.coord();
            if (this.hasTransform) {
                hostoffset = $.jqx.utilities.getOffset(this.host);
            }
            var x = left - hostoffset.left;
            var y = top - columnheaderheight - hostoffset.top - groupsheaderheight;
            var rowinfo = this._hittestrow(x, y);
            var row = rowinfo.row;
            var index = rowinfo.index;
            var tablerow = this.table[0].rows[index];

            if (this.dataview && this.dataview.records.length == 0) {
                var rows = this.table[0].rows;
                var rowY = 0;
                for (var i = 0; i < rows.length; i++) {
                    if (y >= rowY && y < rowY + this.rowsheight) {
                        tablerow = rows[i];
                        break;
                    }
                    rowY += this.rowsheight;
                }
                row = { boundindex: i };
            }

            if (tablerow == null)
                return true;

            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var cellindex = 0;
            var groupslength = this.groupable ? this.groups.length : 0;

            for (var i = 0; i < tablerow.cells.length; i++) {
                var columnleft = parseInt($(this.columnsrow[0].cells[i]).css('left'));
                var left = columnleft - horizontalscrollvalue;
                if (self.columns.records[i].pinned) {
                    left = columnleft;
                }

                var right = left + $(this.columnsrow[0].cells[i]).width();
                if (right >= x && x >= left) {
                    cellindex = i;
                    break;
                }
            }

            if (row != null) {
                var column = this._getcolumnat(cellindex);
                return { row: this.getboundindex(row), column: column.datafield, value: this.getcellvalue(this.getboundindex(row), column.datafield) };
            }

            return null;
        },

        _handlemousedown: function (event, self) {
            if (event.target == null) {
                return true;
            }

            if (self.disabled) {
                return true;
            }

            if ($(event.target).ischildof(this.columnsheader)) {
				// edit중 column header를 누르면 edit가 해제되지 않는다.
				// 해제하는 코드 추가 - ysjung(2014/03/13)
				if (self.editable && self.begincelledit) {
                    if (self.editcell) {
                        self.endcelledit(self.editcell.row, self.editcell.column, false, true);
                    }
                }
			
                return true;
            }

            var rightclick;
            if (event.which) rightclick = (event.which == 3);
            else if (event.button) rightclick = (event.button == 2);

            var middleclick;
            if (event.which) middleclick = (event.which == 2);
            else if (event.button) middleclick = (event.button == 1);

            if (middleclick) {
                return true;
            }
            
            if (this.showstatusbar) {
                if ($(event.target).ischildof(this.statusbar))
                    return true;
                if (event.target == this.statusbar[0])
                    return true;
            }
            if (this.showtoolbar) {
                if ($(event.target).ischildof(this.toolbar))
                    return true;
                if (event.target == this.toolbar[0])
                    return true;
            }
            if (!this.columnsheader) return true;

            if (!this.editcell) {
                this.focus();
            }

            var columnheaderheight = this.showheader ? this.columnsheader.height() + 2 : 0;
            var groupsheaderheight = this._groupsheader() ? this.groupsheader.height() : 0;
            var toolbarheight = this.showtoolbar ? this.toolbarheight : 0;
            groupsheaderheight += toolbarheight;

            var hostoffset = this.host.coord();
            if (this.hasTransform) {
                hostoffset = $.jqx.utilities.getOffset(this.host);
                var bodyOffset = this._getBodyOffset();
                hostoffset.left -= bodyOffset.left;
                hostoffset.top -= bodyOffset.top;
            }
        
            var left = parseInt(event.pageX);
            var top = parseInt(event.pageY);

            if (this.isTouchDevice()) {
                var touches = self.getTouches(event);
                var touch = touches[0];
                left = parseInt(touch.pageX);
                top = parseInt(touch.pageY);
                if (self.touchmode == true) {
                    left = parseInt(touch._pageX);
                    top = parseInt(touch._pageY);
                }
            }
            var x = left - hostoffset.left;
            var y = top - columnheaderheight - hostoffset.top - groupsheaderheight;
            if (this.pageable && !this.autoheight && this.gotopage) {
                var pagerposition = this.pager.coord().top - hostoffset.top - groupsheaderheight - columnheaderheight;
                if (y > pagerposition) {
                    return;
                }
            }
            var rowinfo = this._hittestrow(x, y);
            if (!rowinfo)
                return;

            if (rowinfo.details)
                return;

            var row = rowinfo.row;
            var index = rowinfo.index;
            var targetclassname = event.target.className;
            var tablerow = this.table[0].rows[index];
            if (tablerow == null) {
                if (self.editable && self.begincelledit) {
                    if (self.editcell) {
                        self.endcelledit(self.editcell.row, self.editcell.column, false, true);
                    }
                }
                return true;
            }

            self.mousecaptured = true;
            self.mousecaptureposition = { left: event.pageX, top: event.pageY - groupsheaderheight, clickedrow: tablerow };

            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            if (this.rtl) {
                if (this.hScrollBar.css('visibility') != 'hidden') {
                    horizontalscrollvalue = hScrollInstance.max - hScrollInstance.value;
                }
            }

            var cellindex = -1;
            var groupslength = this.groupable ? this.groups.length : 0;
            if (this.rtl) {
                if (this.vScrollBar[0].style.visibility != 'hidden') {
                    horizontalscrollvalue -= this.scrollbarsize + 4;
                }
                if (this.hScrollBar[0].style.visibility == 'hidden') {
                    horizontalscrollvalue = -parseInt(this.content.css('left'));
                }
            }

            for (var i = 0; i < tablerow.cells.length; i++) {
                var columnleft = parseInt($(this.columnsrow[0].cells[i]).css('left'));
                var left = columnleft - horizontalscrollvalue;
                if (self.columns.records[i].pinned && !self.rtl) {
                    left = columnleft;
                }

                var column = this._getcolumnat(i);
                if (column != null && column.hidden) {
                    continue;
                }

                var right = left + $(this.columnsrow[0].cells[i]).width();
                if (right >= x && x >= left) {
                    cellindex = i;
                    self.mousecaptureposition.clickedcell = i;
                    break;
                }
            }

            if (this.rtl && this._haspinned) {
                for (var i = tablerow.cells.length-1; i >= 0; i--) {
                    if (!self.columns.records[i].pinned) break;

                    var columnleft = $(this.columnsrow[0].cells[i]).coord().left-this.host.coord().left;
                    var left = columnleft;
        
                    var column = this._getcolumnat(i);
                    if (column != null && column.hidden) {
                        continue;
                    }

                    var right = left + $(this.columnsrow[0].cells[i]).width();
                    if (right >= x && x >= left) {
                        cellindex = i;
                        self.mousecaptureposition.clickedcell = i;
                        break;
                    }
                }
            }

            if (row != null && cellindex >= 0) {
                this._raiseEvent(1, { rowindex: this.getboundindex(row), visibleindex: row.visibleindex, group: row.group, rightclick: rightclick, originalEvent: event });
                var column = this._getcolumnat(cellindex);
                var cellvalue = this.getcellvalue(this.getboundindex(row), column.datafield);
                if (this.editable && this.editcell) {
                    if (column.datafield == this.editcell.column) {
                        if (this.getboundindex(row) == this.editcell.row) {
                            this.mousecaptured = false;
                        }
                    }
                }

                this._raiseEvent(8, { rowindex: this.getboundindex(row), column: column ? column.getcolumnproperties() : null, datafield: column ? column.datafield : null, columnindex: cellindex, value: cellvalue, rightclick: rightclick, originalEvent: event });

                if (this.isTouchDevice()) {
                    if (column.columntype == 'checkbox' && this.editable && this._overlayElement) {
                        if (!this.editcell) {
                            this._overlayElement.css('visibility', 'hidden');
                            this.editcell = this.getcell(index, column.datafield);
                            return true;
                        }
                    }
                    else if (column.columntype == 'button' && this._overlayElement) {
                        //   this._overlayElement.css('visibility', 'hidden');
                        if (column.buttonclick) {
                            column.buttonclick(tablerow.cells[cellindex].buttonrow, event);
                        }
                        return true;
                    }
                }

                // handle double clicks.
                var _triggeredEvents = false;
                if (this._lastmousedown != null) {
                    if (this._mousedown - this._lastmousedown < 300) {
                        if (this._clickedrowindex == this.getboundindex(row)) {
                            this._raiseEvent(22, { rowindex: this.getboundindex(row), visibleindex: row.visibleindex, group: row.group, rightclick: rightclick, originalEvent: event });
                            if (this._clickedcolumn == column.datafield) {
                                this._raiseEvent(23, { rowindex: this.getboundindex(row), column: column ? column.getcolumnproperties() : null, datafield: column ? column.datafield : null, columnindex: cellindex, value: cellvalue, rightclick: rightclick, originalEvent: event });
                            }
                            _triggeredEvents = true;
                            this._clickedrowindex = -1;
                            this._clickedcolumn = null;
                            if (event.isPropagationStopped && event.isPropagationStopped()) {
                                return false;
                            }
                        }
                    }
                }

                if (rightclick) return true;

                if (!_triggeredEvents) {
                    this._clickedrowindex = this.getboundindex(row);
                    this._clickedcolumn = column.datafield;
                }
                // end of handle double clicks.

                var browserInfo = $.jqx.utilities.getBrowser();
                if (browserInfo.browser == 'msie' && parseInt(browserInfo.version) <= 7) {
                    if (cellindex == 0 && this.rowdetails) {
                        targetclassname = "jqx-grid-group-collapse";
                    }
                    if (groupslength > 0) {
                        if (cellindex <= groupslength) {
                            targetclassname = "jqx-grid-group-collapse";
                        }
                    }
                }

                if (targetclassname.indexOf('jqx-grid-group-expand') != -1 || targetclassname.indexOf('jqx-grid-group-collapse') != -1) {
                    if (!this.rtl) {
                        if (groupslength > 0 && cellindex < groupslength && this._togglegroupstate) {
                            this._togglegroupstate(row.bounddata, true);
                        }
                        else if (cellindex == groupslength && this.rowdetails && this.showrowdetailscolumn) {
                            this._togglerowdetails(row.bounddata, true);
                            this.gridcontent[0].scrollTop = 0;
                            this.gridcontent[0].scrollLeft = 0;
                        }
                    }
                    else {
                        if (groupslength > 0 && cellindex > tablerow.cells.length - groupslength - 1 && this._togglegroupstate) {
                            this._togglegroupstate(row.bounddata, true);
                        }
                        else if (cellindex == tablerow.cells.length - 1 - groupslength && this.rowdetails && this.showrowdetailscolumn) {
                            this._togglerowdetails(row.bounddata, true);
                            this.gridcontent[0].scrollTop = 0;
                            this.gridcontent[0].scrollLeft = 0;
                        }
                    }
                }
                else {
                    if (row.boundindex != -1) {
                        var oldselectedrowindexes = this.selectedrowindexes.slice(0);
                        var isoldcell = false;

						// 첫번째 field가 선택안되도록 수정 - ysjung(20140402)
						if(column.datafield === "parentId") {
						
							// edit상태 해제하는 코드 추가 - ysjung(2014/03/19)
							if (self.editable && self.begincelledit) {
								if (self.editcell) {
									self.endcelledit(self.editcell.row, self.editcell.column, false, true);
								}
							}
						
							return false;
						}

                        if (self.selectionmode != 'none' && self.selectionmode != 'checkbox' && this._selectrowwithmouse) {
                            if (self.selectionmode == 'multiplecellsadvanced' || self.selectionmode == 'multiplecellsextended' || self.selectionmode == 'multiplerowsextended' || self.selectionmode == 'multiplerowsadvanced') {
	                            // CtrlKey로 다중선택 안되게 수정 - ysjung(2014/04/02)
                                if (/*!event.ctrlKey && */!event.shiftKey) {
                                    self.selectedrowindexes = new Array();
                                    self.selectedcells = new Array();
                                }
                            }

                            var caneditrow = false;

                            var boundindex = this.getboundindex(row);
                            if (self._oldselectedrow === boundindex || self.selectionmode === "none") {
                                caneditrow = true;
                            }

                            if (self.selectionmode.indexOf('cell') == -1) {
                                if ((self.selectionmode != 'singlerow') || (self.selectedrowindex != boundindex && self.selectionmode == 'singlerow')) {
                                    if(this._applyrowselection(boundindex, true, false, null, column.datafield)) {
	                                    // CtrlKey로 다중선택 안되게 수정 - ysjung(2014/04/02)
										this._selectrowwithmouse(self, rowinfo, oldselectedrowindexes, column.datafield, false, event.shiftKey);
									}
                                }
                            }
                            else {
                                if (column.datafield != null) {
	                                // CtrlKey로 다중선택 안되게 수정 - ysjung(2014/04/02)
                                    this._selectrowwithmouse(self, rowinfo, oldselectedrowindexes, column.datafield, false, event.shiftKey);
                                    if (!event.shiftKey) {
                                        this._applycellselection(boundindex, column.datafield, true, false);
                                    }
                                }
                            }

                            if (self._oldselectedcell) {
                                if (self._oldselectedcell.datafield == self.selectedcell.datafield && self._oldselectedcell.rowindex == self.selectedcell.rowindex) {
                                    isoldcell = true;
                                }
                            }
                            self._oldselectedcell = self.selectedcell;

                            self._oldselectedrow = boundindex;
                        }
                        if (self.autosavestate) {
                            if (self.savestate) self.savestate();
                        }
                        if (self.editable && self.begincelledit) {
                            if (event.isPropagationStopped && event.isPropagationStopped()) {
                                return false;
                            }

                            if (self.editmode == "selectedrow") {
                                if (caneditrow && !self.editcell) {
                                    if (column.columntype !== "checkbox") {
                                        var result = self.beginrowedit(this.getboundindex(row));
                                    }
                                }
                                else if (self.editcell && !caneditrow && self.selectionmode != "none") {
                                    var result = self.endrowedit(self.editcell.row);
                                }
                            }
                            else {
                                var canselect = self.editmode == 'click' || (isoldcell && self.editmode == 'selectedcell');
                                if (self.selectionmode.indexOf('cell') == -1) {
                                    if (self.editmode != 'dblclick') {
                                        canselect = true;
                                    }
                                }

                                if (canselect) {
                                    if (row.boundindex != undefined && column.editable) {
                                        var result = self.begincelledit(this.getboundindex(row), column.datafield, column.defaulteditorvalue);
                                        if (self.selectionmode.indexOf('cell') != -1) {
                                            self._applycellselection(boundindex, column.datafield, false, false);
                                        }
                                 //       return false;
                                    }
									else {
										// edit중 column header를 누르면 edit가 해제되지 않는다.
										// 해제하는 코드 추가 - ysjung(2014/03/13)
										if (self.editable && self.begincelledit) {
											if (self.editcell) {
												self.endcelledit(self.editcell.row, self.editcell.column, false, true);
											}
										}
									}
                                }

                                if (self.selectionmode.indexOf('cell') != -1) {
                                    if (self.editmode == 'selectedcell' && !isoldcell && self.editcell) {
                                        self.endcelledit(self.editcell.row, self.editcell.column, false, true);
                                    }
                                }
                            }
                            return true;
                        }
                    }
                }
            }
            return true;
        },

        _columnPropertyChanged: function (column, key, oldvalue, value) {
        },

        _rowPropertyChanged: function (row, key, oldvalue, value) {
        },

        _serializeObject: function (data) {
            if (data == null) return "";
            var str = "";
            $.each(data, function (index) {
                var val = this;
                if (index > 0) str += ', ';
                str += "[";
                var m = 0;
                for (obj in val) {
                    if (m > 0) str += ', ';
                    str += '{' + obj + ":" + val[obj] + '}';
                    m++;
                }
                str += "]";
            });
            return str;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            key = key.toLowerCase();
            switch (key) {
                case "enablebrowserselection":
                    if (!object.showfilterrow) {
                        if (!object.showstatusbar && !object.showtoolbar) {
                            object.host.addClass('jqx-disableselect');
                        }
                        object.content.addClass('jqx-disableselect');
                    }

                    if (object.enablebrowserselection) {
                        object.content.removeClass('jqx-disableselect');
                        object.host.removeClass('jqx-disableselect');
                    }
                    break;
                case "columnsheight":
                    if (object.columnsheight != 25 || object.columngroups) {
                        object._measureElement('column');
                    }
                    object._render(true, true, true, false, false);
                    break;
                case "rowsheight":
                    if (value != oldvalue) {
                        if (object.rowsheight != 25) {
                            object._measureElement('cell');
                        }
                        object.virtualsizeinfo = null;
                        object.rendergridcontent(true, false);
                        object.refresh();
                    }
                    break;
                case "scrollMode":
                    object.vScrollInstance.thumbStep = object.rowsheight;
                    break;
                case "showdefaultloadelement":
                    object._builddataloadelement();
                    break;
                case "showfiltermenuitems":
                case "showsortmenuitems":
                case "showgroupmenuitems":
                case "filtermode":
                    object._initmenu();
                    break;
                case "touchmode":
                    if (oldvalue != value) {
                        object._removeHandlers();
                        object.touchDevice = null;
                        object.vScrollBar.jqxScrollBar({ touchMode: value });
                        object.hScrollBar.jqxScrollBar({ touchMode: value });
                        object._updateTouchScrolling();
                        object._arrange();
                        object._updatecolumnwidths();
                        object._updatecellwidths();

                        object._addHandlers();
                    }
                    break;
                case "autoshowcolumnsmenubutton":
                    if (oldvalue != value) {
                        object._rendercolumnheaders();
                    }
                    break;
                case "rendergridrows":
                    if (oldvalue != value) {
                        object.updatebounddata();
                    }
                    break;
                case "editmode":
                    if (oldvalue != value) {
                        object._removeHandlers();
                        object._addHandlers();
                    }
                    break;
                case "source":
                    object.updatebounddata();
                    if (object.virtualmode && !object._loading) {
                        object.loadondemand = true;
                        object._renderrows(object.virtualsizeinfo);
                    }
                    break;
                case "horizontalscrollbarstep":
                case "verticalscrollbarstep":
                case "horizontalscrollbarlargestep":
                case "verticalscrollbarlargestep":
                    this.vScrollBar.jqxScrollBar({ step: this.verticalscrollbarstep, largestep: this.verticalscrollbarlargestep });
                    this.hScrollBar.jqxScrollBar({ step: this.horizontalscrollbarstep, largestep: this.horizontalscrollbarlargestep });
                    break;
                case "closeablegroups":
                    if (object._initgroupsheader) {
                        object._initgroupsheader();
                    }
                    break;
                case "showgroupsheader":
                    if (oldvalue != value) {
                        object._arrange();
                        if (object._initgroupsheader) {
                            object._initgroupsheader();
                        }
                        object._renderrows(object.virtualsizeinfo);
                    }
                    break;
                case "theme":
                    if (value != oldvalue) {
                        if (object.pager) {
                            object.pager.removeClass();
                            object.pager.addClass(object.toTP('jqx-grid-pager'));
                            object.pager.addClass(object.toTP('jqx-widget-header'));
                            if (object.pageable && object._updatepagertheme) {
                                object._updatepagertheme();
                            }
                        }
                        if (object.groupsheader) {
                            object.groupsheader.removeClass();
                            object.groupsheader.addClass(object.toTP('jqx-grid-groups-header'));
                            object.groupsheader.addClass(object.toTP('jqx-widget-header'));
                        }
                        object.toolbar.removeClass();
                        object.toolbar.addClass(object.toTP('jqx-grid-toolbar'));
                        object.toolbar.addClass(object.toTP('jqx-widget-header'));
                        object.statusbar.removeClass();
                        object.statusbar.addClass(object.toTP('jqx-grid-statusbar'));
                        object.statusbar.addClass(object.toTP('jqx-widget-content'));
                        object.vScrollBar.jqxScrollBar({ theme: object.theme });
                        object.hScrollBar.jqxScrollBar({ theme: object.theme });
                        object.host.removeClass();
                        object.host.addClass(object.toTP('jqx-grid'));
                        object.host.addClass(object.toTP('jqx-reset'));
                        object.host.addClass(object.toTP('jqx-rc-all'));
                        object.host.addClass(object.toTP('jqx-widget'));
                        object.host.addClass(object.toTP('jqx-widget-content'));
                        object.bottomRight.removeClass();
                        object.bottomRight.addClass(object.toTP('jqx-grid-bottomright'));
                        object.bottomRight.addClass(object.toTP('jqx-scrollbar-state-normal'));
                        object.toolbar.addClass(object.toTP('jqx-grid-toolbar'));
                        object.toolbar.addClass(object.toTP('jqx-widget-header'));
                        object.statusbar.addClass(object.toTP('jqx-grid-statusbar'));
                        object.statusbar.addClass(object.toTP('jqx-widget-header'));

                        object.render();
                    }
                    break;
                case "showtoolbar":
                case "toolbarheight":
                    if (oldvalue != value) {
                        object._arrange();
                        object.refresh();
                    }
                    break;
                case "showstatusbar":
                    if (oldvalue != value) {
                        if (object.statusbar) {
                            if (value) {
                                object.statusbar.show();
                            }
                            else {
                                object.statusbar.hide();
                            }
                        }

                        object._arrange();
                        object.refresh();
                    }
                    break;
                case "statusbarheight":
                    if (oldvalue != value) {
                        object._arrange();
                        object.refresh();
                    }
                    break;
                case "filterable":
                case "showfilterrow":
                    if (oldvalue != value) {
                        object.render();
                    }
                    break;
                case "autoshowfiltericon":
                case "showfiltercolumnbackground":
                case "showpinnedcolumnbackground":
                case "showsortcolumnbackground":
                    if (oldvalue != value) {
                        object.rendergridcontent();
                    }
                    break;
                case "showrowdetailscolumn":
                    if (oldvalue != value) {
                        object.render();
                    }
                    break;
                case "scrollbarsize":
                    if (oldvalue != value) {
                        object._arrange();
                    }
                    break;
                case "width":
                case "height":
                    if (oldvalue != value) {
                        object._updatesize(true, true);
                        object._resizeWindow();
                        if (object.virtualmode && !object._loading) {
                            object.vScrollInstance.setPosition(0);
                        }
                    }
                    break;
                case "altrows":
                case "altstart":
                case "altstep":
                    if (oldvalue != value) {
                        object._renderrows(object.virtualsizeinfo);
                    }
                    break;
                case "groupsheaderheight":
                    if (oldvalue != value) {
                        object._arrange();
                        if (object._initgroupsheader) {
                            object._initgroupsheader();
                        }
                    }
                    break;
                case "pagerheight":
                    if (oldvalue != value)
                        object._initpager();
                    break;
                case "selectedrowindex":
                    object.selectrow(value);
                    break;
                case "selectionmode":
                    if (oldvalue != value) {
                        if (value == 'none') {
                            object.selectedrowindexes = new Array();
                            object.selectedcells = new Array();
                            object.selectedrowindex = -1;
                        }
                        object._renderrows(object.virtualsizeinfo);
                    }
                    break;
                case "showheader":
                    if (value) {
                        object.columnsheader.css('display', 'block');
                    }
                    else {
                        object.columnsheader.css('display', 'none');
                    }
                    break;
                case "virtualmode":
                    if (oldvalue != value) {
                        object.dataview.virtualmode = object.virtualmode;
                        object.dataview.refresh(false);
                        object._render(false, false, false);
                    }
                    break;
                case "columnsmenu":
                    if (oldvalue != value) {
                        object.render();
                    }
                    break;
                case "columngroups":
                    object._render(true, true, true, false, false);
                    break;
                case "columns":
                    if (object._serializeObject(object._cachedcolumns) !== object._serializeObject(value)) {
                        var hasFilter = false;
                        if (object.filterable) {
                            if (oldvalue && oldvalue.records) {
                                $.each(oldvalue.records, function () {
                                    if (this.filter) hasFilter = true;
                                    object.dataview.removefilter(this.displayfield, this.filter);
                                });
                            }
                        }
                        object._columns = null;
                        object._filterrowcache = [];
                        object.render();
                        if (hasFilter) {
                            object.applyfilters();
                        }
                        object._cachedcolumns = object.columns;
                        if (object.removesort) {
                            object.removesort();
                        }
                    }
                    else object._initializeColumns();
                    break;
                case "autoheight":
                    if (oldvalue != value) {
                        object._render(false, false, true);
                    }
                    break;
                case "pagermode":
                case "pagerbuttonscount":
                case "pagesizeoptions":
                case "pageable":
                case "pagesize":
                    if (oldvalue != value) {
                        if (object._loading) {
                            throw new Error( 'jqxGrid: ' + object.loadingerrormessage);
                            return;
                        }
                        if (!object.host.jqxDropDownList || !object.host.jqxListBox) {
                            object._testmodules();
                            return;
                        }

                        if (object._initpager) {
                            if (key != "pageable") {
                                if (typeof (value) == "string") {
                                    var message = "The expected value type is: Int.";
                                    if (key != "pagesize") {
                                        var message = "The expected value type is: Array of Int values.";
                                    }

                                    throw new Error("Invalid Value for: " + key + ". " + message);
                                }
                            }

                            object.dataview.pageable = object.pageable;
                            object.dataview.pagenum = 0;
                            object.dataview.pagesize = object._getpagesize();
                            if (object.virtualmode) {
                                object.updatebounddata();
                            }
                            object.dataview.refresh(true);
                            object._initpager();
                            if (key == "pagesizeoptions") {
                                if (value != null && value.length > 0) {                        
                                    object.pagesize = parseInt(value[0]);
                                    object.dataview.pagesize = parseInt(value[0]);
                                    object.prerenderrequired = true;
                                    object._requiresupdate = true;
                                    object.dataview.pagenum = -1;
                                    object.gotopage(0);
                                }
                            }
                        }
                        object._render(false, false, false);
                    }
                    break;
                case "groups":
                    if (object._serializeObject(oldvalue) !== object._serializeObject(value)) {
                        object.dataview.groups = value;
                        object._refreshdataview();
                        object._render(true, true, true, false);
                    }
                    break;
                case "groupable":
                    if (oldvalue != value) {
                        object.dataview.groupable = object.groupable;
                        object.dataview.pagenum = 0;
                        object.dataview.refresh(false);
                        object._render(false, false, true);
                    }
                    break;
                case "renderstatusbar":
                    if (value != null)
                    {
                        object.renderstatusbar(object.statusbar);
                    }
                    break;
                case "rendertoolbar":
                    if (value != null) {
                        object.rendertoolbar(object.toolbar);
                    }
                    break;
                case "disabled":
                    if (value) {
                        object.host.addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                    }
                    else object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                    $.jqx.aria(object, "aria-disabled", object.disabled);
                    if (object.pageable) {
                        if (object.pagerrightbutton) {
                            object.pagerrightbutton.jqxButton({ disabled: value });
                            object.pagerleftbutton.jqxButton({ disabled: value });
                            object.pagershowrowscombo.jqxDropDownList({ disabled: value });
                            object.pagergotoinput.attr('disabled', value);
                        }
                    }
                    object.vScrollBar.jqxScrollBar({ disabled: value });
                    object.hScrollBar.jqxScrollBar({ disabled: value });
                    break;
            }
        }
    });

    function jqxGridColumn(owner, data) {
        this.owner = owner;
        this.datafield = null;
        this.displayfield = null;
        this.text = '';
        this.sortable = true;
        this.hideable = true;
        this.editable = true;
        this.hidden = false;
        this.groupable = true;
        this.renderer = null;
        this.cellsrenderer = null;
        // checkbox column, number column, button column
        this.checkchange = null,
        this.threestatecheckbox = false;
        this.buttonclick = null,
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
        // default, filter row, checked list
        this.filter = null;
        this.filteritems = [];
        this.resizable = true;
        this.initeditor = null;
        this.createeditor = null;
        this.destroyeditor = null;
        this.geteditorvalue = null;
        this.validation = null;
        this.classname = '';
        this.cellclassname = '';
        this.cellendedit = null;
        this.cellbeginedit = null;
        this.cellvaluechanging = null;
        this.aggregates = null;
        this.aggregatesrenderer = null;
        this.menu = true;
        this.createfilterwidget = null;
        this.filtertype = 'default';
        this.filtercondition = null;
        this.rendered = null;
        this.exportable = true;
        this.exporting = false;
        this.draggable = true;
        this.nullable = true;
        this.enabletooltips = true;
        this.columngroup = null;
		this.columnreorder = true;

        this.getcolumnproperties = function () {
            return {
                nullable: this.nullable,
                sortable: this.sortable, hideable: this.hideable,
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
                var me = this.that;
                if ($.jqx.hasProperty(data, 'dataField')) {
                    this.datafield = $.jqx.get(data, 'dataField');
                }

                if ($.jqx.hasProperty(data, 'displayField')) {
                    this.displayfield = $.jqx.get(data, 'displayField');
                }
                else {
                    this.displayfield = this.datafield;
                }
                if ($.jqx.hasProperty(data, 'enableTooltips')) {
                    this.enabletooltips = $.jqx.get(data, 'enableTooltips');
                }
                if ($.jqx.hasProperty(data, 'text')) {
                    this.text = $.jqx.get(data, 'text');
                }
                if ($.jqx.hasProperty(data, 'sortable')) {
                    this.sortable = $.jqx.get(data, 'sortable');
                }
                if ($.jqx.hasProperty(data, 'hideable')) {
                    this.hideable = $.jqx.get(data, 'hideable');
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
                if ($.jqx.hasProperty(data, 'checkChange')) {
                    this.checkchange = $.jqx.get(data, 'checkChange');
                }
                if ($.jqx.hasProperty(data, 'buttonClick')) {
                    this.buttonclick = $.jqx.get(data, 'buttonClick');
                }
                if ($.jqx.hasProperty(data, 'pinned')) {
                    this.pinned = $.jqx.get(data, 'pinned');
                }
                if ($.jqx.hasProperty(data, 'visibleIndex')) {
                    this.visibleindex = $.jqx.get(data, 'visibleIndex');
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
                if ($.jqx.hasProperty(data, 'validation')) {
                    this.validation = $.jqx.get(data, 'validation');
                }
                if ($.jqx.hasProperty(data, 'cellBeginEdit')) {
                    this.cellbeginedit = $.jqx.get(data, 'cellBeginEdit');
                }
                if ($.jqx.hasProperty(data, 'cellEndEdit')) {
                    this.cellendedit = $.jqx.get(data, 'cellEndEdit');
                }
                if ($.jqx.hasProperty(data, 'className')) {
                    this.classname = $.jqx.get(data, 'className');
                }
                if ($.jqx.hasProperty(data, 'cellClassName')) {
                    this.cellclassname = $.jqx.get(data, 'cellClassName');
                }
                if ($.jqx.hasProperty(data, 'menu')) {
                    this.menu = $.jqx.get(data, 'menu');
                }
                if ($.jqx.hasProperty(data, 'aggregates')) {
                    this.aggregates = $.jqx.get(data, 'aggregates');
                }
                if ($.jqx.hasProperty(data, 'aggregatesRenderer')) {
                    this.aggregatesrenderer = $.jqx.get(data, 'aggregatesRenderer');
                }
                if ($.jqx.hasProperty(data, 'createFilterWidget')) {
                    this.createfilterwidget = $.jqx.get(data, 'createFilterWidget');
                }
                if ($.jqx.hasProperty(data, 'filterType')) {
                    this.filtertype = $.jqx.get(data, 'filterType');
                }
                if ($.jqx.hasProperty(data, 'rendered')) {
                    this.rendered = $.jqx.get(data, 'rendered');
                }
                if ($.jqx.hasProperty(data, 'exportable')) {
                    this.exportable = $.jqx.get(data, 'exportable');
                }
                if ($.jqx.hasProperty(data, 'filterItems')) {
                    this.filteritems = $.jqx.get(data, 'filterItems');
                }
                if ($.jqx.hasProperty(data, 'cellValueChanging')) {
                    this.cellvaluechanging = $.jqx.get(data, 'cellValueChanging');
                }
                if ($.jqx.hasProperty(data, 'draggable')) {
                    this.draggable = $.jqx.get(data, 'draggable');
                }
                if ($.jqx.hasProperty(data, 'filterCondition')) {
                    this.filtercondition = $.jqx.get(data, 'filterCondition');
                }
                if ($.jqx.hasProperty(data, 'threeStateCheckbox')) {
                    this.threestatecheckbox = $.jqx.get(data, 'threeStateCheckbox');
                }
                if ($.jqx.hasProperty(data, 'nullable')) {
                    this.nullable = $.jqx.get(data, 'nullable');
                }
                if ($.jqx.hasProperty(data, 'columnGroup')) {
                    this.columngroup = $.jqx.get(data, 'columnGroup');
                }
				// ysjung (2014/03/20)
				if ($.jqx.hasProperty(data, 'columnReorder')) {
                    this.columnreorder = $.jqx.get(data, 'columnReorder');
                }

                if (!data instanceof String && !(typeof data == "string")) {
                    for (var obj in data) {
                        if (!me.hasOwnProperty(obj)) {
                            if (!me.hasOwnProperty(obj.toLowerCase())) {
                                owner.host.remove();
                                throw new Error("jqxGrid: Invalid property name - " + obj + ".");
                            }
                        }
                    }
                }
            }
        }

        this._initfields(data);
        return this;
    }

    function jqxGridRow(owner, data) {
        this.setdata = function (data) {
            if (data != null) {
                this.bounddata = data;
                this.boundindex = data.boundindex;
                this.visibleindex = data.visibleindex;
                this.group = data.group;
                this.parentbounddata = data.parentItem;
                this.uniqueid = data.uniqueid;
                this.level = data.level;
            }
        }
        this.setdata(data);
        this.parentrow = null;
        this.subrows = new Array();
        this.owner = owner;
        this.height = 25;
        this.hidden = false;
        this.rowdetails = null;
        this.rowdetailsheight = 100;
        this.rowdetailshidden = true;
        this.top = -1;

        //        this.getrowinfo = function () {
        //            return { hidden: this.hidden, rowdetails: this.rowdetails, rowdetailsheight: this.rowdetailsheight,
        //                showdetails: !this.rowdetailshidden, height: this.height, index: this.visibleindex
        //            };
        //        }

        this.setrowinfo = function (data) {
            this.hidden = data.hidden;
            this.rowdetails = data.rowdetails;
            this.rowdetailsheight = data.rowdetailsheight;
            this.rowdetailshidden = !data.showdetails;
            this.height = data.height;
        }

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

        this._raiseEvent = function (args) {
        }

        this.clear = function () {
            this.records = new Array();
        }

        this.replace = function (index, object) {
            this.records[index] = object;
            if (!this.updating) {
                this._raiseEvent({ type: 'replace', element: object });
            }
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
            if (!this.updating) {
                this._raiseEvent({ type: 'add', element: object });
            }
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
                    if (!this.updating) {
                        this._raiseEvent({ type: 'insert', index: index, element: object });
                    }
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
                if (!this.updating) {
                    this._raiseEvent({ type: 'remove', element: object });
                }
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
                if (!this.updating) {
                    this._raiseEvent({ type: 'removeAt', index: index, element: object });
                }
                return true;
            }

            return false;
        }

        return this;
    }

    $.jqx.dataview = function () {
        this.self = this;
        this.grid = null;
        this.uniqueId = "id";
        this.records = [];
        this.rows = [];
        this.columns = [];
        this.groups = [];
        this.filters = new Array();
        this.updated = null;
        this.update = null;
        this.suspend = false;
        this.pagesize = 0;
        this.pagenum = 0;
        this.totalrows = 0;
        this.totalrecords = 0;
        this.groupable = true;
        this.loadedrecords = [];
        this.loadedrootgroups = [];
        this.loadedgroups = [];
        this.loadedgroupsByKey = [];
        this.virtualmode = true;
        this._cachegrouppages = new Array();
        this.source = null;
        this.changedrecords = new Array();
        this.rowschangecallback = null;
        this.that = this;

        this.destroy = function()
        {
            delete this.self;
            delete this.grid;
            delete this.uniqueId;
            delete this.records;
            delete this.rows;
            delete this.columns;
            delete this.groups;
            delete this.filters;
            delete this.updated;
            delete this.update;
            delete this.suspend;
            delete this.pagesize;
            delete this.pagenum;
            delete this.totalrows;
            delete this.totalrecords;
            delete this.groupable;
            delete this.loadedrecords;
            delete this.loadedrootgroups;
            delete this.loadedgroups;
            delete this.loadedgroupsByKey;
            delete this.virtualmode;
            delete this._cachegrouppages;
            delete this.source;
            delete this.changedrecords;
            delete this.rowschangecallback;
            delete this.that;
        },

        this.suspendupdate = function () {
            this.suspend = true;
        },

        this.isupdating = function () {
            return this.suspend;
        },

        this.resumeupdate = function (refresh) {
            this.suspend = false;

            if (refresh == undefined)
                refresh = true;

            this.refresh(refresh);
        },

        this.getrecords = function () {
            return this.records;
        },

        this.clearrecords = function () {
            this.recordids = new Array();
        }

        this.databind = function (source, objectuniqueId) {
            var isdataadapter = source._source ? true : false;
            var dataadapter = null;

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

            var initadapter = function (me) {
                dataadapter.recordids = [];
                dataadapter.records = new Array();
                dataadapter.cachedrecords = new Array();
                dataadapter.originaldata = new Array();
                dataadapter._options.virtualmode = me.virtualmode;
                dataadapter._options.totalrecords = me.totalrecords;
                dataadapter._options.originaldata = me.originaldata;
                dataadapter._options.recordids = me.recordids;
                dataadapter._options.cachedrecords = new Array();
                dataadapter._options.pagenum = me.pagenum;
                dataadapter._options.pageable = me.pageable;
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

                if (me.pagesize == 0) me.pagesize = 10;
                dataadapter._options.pagesize = me.pagesize;
            }

            var updatefromadapter = function (me) {
                me.totalrecords = dataadapter.totalrecords;
                if (!me.virtualmode) {
                    me.originaldata = dataadapter.originaldata;
                    me.records = dataadapter.records;
                    me.recordids = dataadapter.recordids;
                    me.cachedrecords = dataadapter.cachedrecords;
                }
                else {
                    var rendergridrowsobj = { startindex: me.pagenum * me.pagesize, endindex: (me.pagenum * me.pagesize + me.pagesize) };
                    if (source.recordstartindex != undefined) {
                        rendergridrowsobj.startindex = parseInt(source.recordstartindex);
                    }
                    if (source.recordendindex != undefined) {
                        rendergridrowsobj.endindex = parseInt(source.recordendindex);
                    }
                    else if (!me.grid.pageable) {
                        rendergridrowsobj.endindex = rendergridrowsobj.startindex + 100;
                        if (me.grid.autoheight) {
                            rendergridrowsobj.endindex = rendergridrowsobj.startindex + me.totalrecords;
                        }
                    }
                    if (!source.recordendindex) {
                        if (!me.grid.pageable) {
                            rendergridrowsobj.endindex = rendergridrowsobj.startindex + 100;
                            if (me.grid.autoheight) {
                                rendergridrowsobj.endindex = rendergridrowsobj.startindex + me.totalrecords;
                            }
                        }
                        else {
                             rendergridrowsobj = { startindex: me.pagenum * me.pagesize, endindex: (me.pagenum * me.pagesize + me.pagesize) };
                        }
                    }

                    rendergridrowsobj.data = dataadapter.records;
                    if (me.grid.rendergridrows && me.totalrecords > 0) {
                        var recordscount = 0;
                        source.records = me.grid.rendergridrows(rendergridrowsobj);
                        if (source.records.length) {
                            recordscount = source.records.length;
                        }

                        if (source.records && !source.records[rendergridrowsobj.startindex]) {
                            var newArray = new Array();
                            var newArrayIndex = rendergridrowsobj.startindex;
                            $.each(source.records, function () {
                                newArray[newArrayIndex] = this;
                                newArrayIndex++;
                                recordscount++;
                            });
                            source.records = newArray;
                        }
                        if (recordscount == 0) {
                            if (source.records) {
                                $.each(source.records, function () {
                                    recordscount++;
                                });
                            }
                        }
                        if (recordscount > 0 && recordscount < rendergridrowsobj.endindex - rendergridrowsobj.startindex && !me.grid.groupable) {
                            var toClone = source.records[0];
                           
                            for (var i = 0; i < rendergridrowsobj.endindex - rendergridrowsobj.startindex - recordscount; i++) {
                                var newData = {};
                                for (obj in toClone) {
                                    newData[obj] = "";
                                }

                                if (source.records.push) {
                                    source.records.push(newData);
                                }
                            }
                        }
                    }

                    if (!source.records || me.totalrecords == 0) {
                        source.records = new Array();
                    }

                    me.originaldata = source.records;
                    me.records = source.records;
                    me.cachedrecords = source.records;
                }
            }

            initadapter(this);

            this.source = source;
            if (objectuniqueId !== undefined) {
                uniqueId = objectuniqueId;
            }

            var me = this.that;
            //if (this.virtualmode && !this.pageable) {
            //    var rendergridrowsobj = { startindex: me.pagenum * me.pagesize, endindex: (me.pagenum * me.pagesize + me.pagesize) };
            //    if (dataadapter.records && dataadapter.records[rendergridrowsobj.startindex]) {
            //        updatefromadapter(this);
            //        return;
            //    }
            //}

            switch (source.datatype) {
                case "local":
                case "array":
                default:
                    if (source.localdata == null) {
                        source.localdata = [];
                    }

                    if (source.localdata != null) {
                        dataadapter.unbindBindingUpdate(me.grid.element.id);
                        dataadapter.dataBind();

                        var updateFunc = function (changeType) {
                            if (changeType != undefined && changeType != "") {
                                var dataItem = dataadapter._changedrecords[0];
                                if (dataItem) {
                                    var ids = new Array();
                                    $.each(dataadapter._changedrecords, function (rowIndex) {
                                        var index = this.index;
                                        var item = this.record;

                                        me.grid._updateFromAdapter = true;
                                        switch (changeType) {
                                            case "update":
                                                var id = me.grid.getrowid(index);
                                                if (rowIndex == dataadapter._changedrecords.length - 1) {
                                                    me.grid.updaterow(id, item);
                                                }
                                                else {
                                                    me.grid.updaterow(id, item, false);
                                                }

                                                me.grid._updateFromAdapter = false;
                                                return;
                                            case "add":
                                                me.grid.addrow(null, item);
                                                me.grid._updateFromAdapter = false;
                                                return;
                                            case "remove":
                                                var id = me.grid.getrowid(index);
                                                ids.push(id);
                                                return;
                                        }
                                    });
                                    if (ids.length > 0) {
                                        me.grid.deleterow(ids, false);
                                        me.grid._updateFromAdapter = false;
                                    }
                                }
                                if (changeType == "update") {
                                    return;
                                }
                            }
                            var totalrecords = me.totalrecords;
                            updatefromadapter(me, changeType);

                            if (changeType == 'updateData') {
                                me.refresh();
                                me.grid._updateGridData();
                            }
                            else {
                                if (source.recordstartindex && this.virtualmode) {
                                    me.updateview(source.recordstartindex, source.recordstartindex + me.pagesize);
                                }
                                else {
                                    me.refresh();
                                }
                                me.update(totalrecords != me.totalrecords);
                            }
                        }

                        updateFunc();
                        dataadapter.bindBindingUpdate(me.grid.element.id, updateFunc);
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
                            dataadapter.unbindBindingUpdate(me.grid.element.id);
                            dataadapter.dataBind();

                            var updateFunc = function (changeType) {
                                var totalrecords = me.totalrecords;
                                updatefromadapter(me);

                                if (changeType == 'updateData') {
                                    me.refresh();
                                    me.grid._updateGridData();
                                }
                                else {
                                    if (source.recordstartindex) {
                                        me.updateview(source.recordstartindex, source.recordstartindex + me.pagesize);
                                    }
                                    else {
                                        me.refresh();
                                    }

                                    me.update(totalrecords != me.totalrecords);
                                }
                            }

                            updateFunc();
                            dataadapter.bindBindingUpdate(me.grid.element.id, updateFunc);
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
                                if (filters[m].type == "datefilter") {
                                    if (filters[m].value && filters[m].value.toLocaleString) {
                                        var column = this.grid.getcolumn(filters[m].datafield);
                                        if (column.cellsformat) {
                                            var value = this.grid.source.formatDate(filters[m].value, column.cellsformat, this.grid.gridlocalization);
                                            if (value) {
                                                postdata["filtervalue" + filterslength] = value;
                                            }
                                            else {
                                                postdata["filtervalue" + filterslength] = filters[m].value.toLocaleString();
                                            }
                                        }
                                        else {
                                            postdata["filtervalue" + filterslength] = filtervalue.toString();
                                        }
                                    }
                                    else {
                                        postdata["filtervalue" + filterslength] = filtervalue.toString();
                                    }
                                }
                                else {
                                    postdata["filtervalue" + filterslength] = filtervalue.toString();
                                }
                                postdata["filtercondition" + filterslength] = filters[m].condition;
                                postdata["filteroperator" + filterslength] = filters[m].operator;
                                postdata["filterdatafield" + filterslength] = filterdatafield;

                                filterslength++;
                            }
                        }

                        postdata.filterscount = filterslength;
                        postdata.groupscount = me.groups.length;
                        for (var x = 0; x < me.groups.length; x++) {
                            postdata["group" + x] = me.groups[x];
                        }

                        if (source.recordstartindex == undefined) source.recordstartindex = 0;
                        if (source.recordendindex == undefined || source.recordendindex == 0) {
                            if (me.grid.height && me.grid.height.toString().indexOf('%') == -1) {
                                source.recordendindex = parseInt(me.grid.height) / me.grid.rowsheight;
                                source.recordendindex += 2;
                            }
                            else {
                                source.recordendindex = $(window).height() / me.grid.rowsheight;
                            }
                            if (this.pageable) {
                                source.recordendindex = this.pagesize;
                            }
                        }

                        $.extend(postdata, { sortdatafield: me.sortfield, sortorder: me.sortfielddirection, pagenum: me.pagenum, pagesize: me.grid.pagesize, recordstartindex: source.recordstartindex, recordendindex: source.recordendindex });
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
                                var totalrecords = me.totalrecords;
                                updatefromadapter(me);

                                if (source.recordstartindex) {
                                    me.updateview(source.recordstartindex, source.recordstartindex + me.pagesize);
                                }
                                else {
                                    me.refresh();
                                }

                                me.update(totalrecords != me.totalrecords);
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

                        dataadapter.unbindDownloadComplete(me.grid.element.id);
                        dataadapter.bindDownloadComplete(me.grid.element.id, updateFunc);
                        dataadapter.dataBind();
                        dataadapter._options.data = tmpdata;
                    }
            }
        }

        this.getid = function (id, record, index) {
            if ($(id, record).length > 0) {
                return $(id, record).text();
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

        this.getvaluebytype = function (value, datafield) {
            var originalvalue = value;
            if (datafield.type == 'date') {
                var tmpvalue = new Date(value);

                if (tmpvalue.toString() == 'NaN' || tmpvalue.toString() == "Invalid Date") {
                    if ($.jqx.dataFormat) {
                        value = $.jqx.dataFormat.tryparsedate(value);
                    }
                    else value = tmpvalue;
                }
                else {
                    value = tmpvalue;
                }

                if (value == null) {
                    value = originalvalue;
                }
            }
            else if (datafield.type == 'float') {
                var value = parseFloat(value);
                if (isNaN(value)) {
                    value = originalvalue;
                }
            }
            else if (datafield.type == 'int') {
                var value = parseInt(value);
                if (isNaN(value)) {
                    value = originalvalue;
                }
            }
            else if (datafield.type == 'bool') {
                if (value != null) {
                    if (value.toLowerCase() == 'false') {
                        value = false;
                    }
                    else if (value.toLowerCase() == 'true') {
                        value = true;
                    }
                }

                if (value == 1) {
                    value = true;
                }
                else if (value == 0) {
                    value = false;
                }
                else value = '';
            }

            return value;
        }

        this.setpaging = function (args) {
            if (args.pageSize != undefined) {
                this.pagesize = args.pageSize;
            }

            if (args.pageNum != undefined) {
                this.pagenum = Math.min(args.pageNum, Math.ceil(this.totalrows / this.pagesize));
            }

            this.refresh();
        }

        this.getpagingdetails = function () {
            return { pageSize: this.pagesize, pageNum: this.pagenum, totalrows: this.totalrows };
        }

        this._clearcaches = function () {
            this.sortcache = {};
            this.sortdata = null;
            this.changedrecords = new Array();
            this.records = new Array();
            this.rows = new Array();
            this.cacheddata = new Array();
            this.originaldata = new Array();
            this.bounditems = new Array();
            this.loadedrecords = new Array();
            this.loadedrootgroups = new Array();
            this.loadedgroups = new Array();
            this.loadedgroupsByKey = new Array();
            this._cachegrouppages = new Array();
            this.recordsbyid = new Array();
            this.cachedrecords = new Array();
            this.recordids = new Array();
        }

        this.addfilter = function (field, filter) {
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
            for (var i = 0; i < this.filters.length; i++) {
                if (this.filters[i].datafield == field) {
                    this.filters.splice(i, 1);
                    break;
                }
            }
        }

        this.getItemFromIndex = function (i) {
            return this.records[i];
        }

        this.updaterow = function (rowid, rowdata, refresh) {
            var hasFilter = this.filters && this.filters.length > 0 && !this.virtualmode;

            if (!hasFilter && rowdata != undefined && rowid != undefined) {
                rowdata.uid = rowid;
                if (!(rowdata[this.source.id])) {
                    rowdata[this.source.id] = rowdata.uid;
                }

                var record = this.recordsbyid["id" + rowid];
                var recordindex = this.records.indexOf(record);
                if (recordindex == -1)
                    return false;

                this.records[recordindex] = rowdata;
                if (this.cachedrecords) {
                    this.cachedrecords[recordindex] = rowdata;
                }
                if (refresh == true || refresh == undefined) {
                    this.refresh();
                }
                this.changedrecords[rowdata.uid] = { Type: "Update", OldData: record, Data: rowdata };
                return true;
            }
            else if (this.filters && this.filters.length > 0) {
                var records = this.cachedrecords;
                var record = null;
                var recordindex = -1;
                for (var i = 0; i < records.length; i++) {
                    if (records[i].uid == rowid) {
                        record = records[i];
                        recordindex = i;
                        break;
                    }
                }
                if (record) {
                    var me = this.that;
                    for (var obj in rowdata) {
                        me.cachedrecords[recordindex][obj] = rowdata[obj];
                    }
                    if (refresh == true || refresh == undefined) {
                        this.refresh();
                    }
                    return true;
                }
            }

            return false;
        }

        this.addrow = function (rowid, rowdata, position, refresh) {
            if (rowdata != undefined) {
                if (!rowid) {
                    rowdata.uid = this.getid(this.source.id, rowdata, this.totalrecords);
                    var record = this.recordsbyid["id" + rowdata.uid];
                    while (record != null) {
                        var uid = Math.floor(Math.random() * 10000).toString();
                        rowdata.uid = uid;
                        record = this.recordsbyid["id" + uid];
                    }
                }
                else rowdata.uid = rowid;

                if (!(rowdata[this.source.id])) {
                    if (this.source.id != undefined) {
                        rowdata[this.source.id] = rowdata.uid;
                    }
                }

                if (position == 'last') {
                    this.records.push(rowdata);
                }
                else if (typeof position === 'number' && isFinite(position)) {
                    this.records.splice(position, 0, rowdata);
                }
                else {
                    this.records.splice(0, 0, rowdata);
                }
                if (this.filters && this.filters.length > 0) {
                    if (position == 'last') {
                        this.cachedrecords.push(rowdata);
                    }
                    else if (typeof position === 'number' && isFinite(position)) {
                        this.cachedrecords.splice(position, 0, rowdata);
                    }
                    else {
                        this.cachedrecords.splice(0, 0, rowdata);
                    }
                }

                this.totalrecords++;
                if (this.virtualmode) {
                    this.source.totalrecords = this.totalrecords;
                }
                if (refresh == true || refresh == undefined) {
                    this.refresh();
                }

                this.changedrecords[rowdata.uid] = { Type: "New", Data: rowdata };
                return true;
            }
            return false;
        }

        this.deleterow = function (rowid, refresh) {
            if (rowid != undefined) {
                var hasFilter = this.filters && this.filters.length > 0;
                if (this.recordsbyid["id" + rowid] && !hasFilter) {
                    var record = this.recordsbyid["id" + rowid];
                    var recordindex = this.records.indexOf(record);
                    this.changedrecords[rowid] = { Type: "Delete", Data: this.records[recordindex] };
                    this.records.splice(recordindex, 1);
                    this.totalrecords--;
                    if (this.virtualmode) {
                        this.source.totalrecords = this.totalrecords;
                    }
                    if (refresh == true || refresh == undefined) {
                        this.refresh();
                    }
                    return true;
                }
                else if (this.filters && this.filters.length > 0) {
                    var records = this.cachedrecords;
                    var record = null;
                    var recordindex = -1;
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].uid == rowid) {
                            record = records[i];
                            recordindex = i;
                            break;
                        }
                    }
                    if (record) {
                        this.cachedrecords.splice(recordindex, 1);
                        if (refresh == true || refresh == undefined) {
                            this.totalrecords = 0;
                            this.records = this.cachedrecords;
                            this.refresh();
                        }
                        return true;
                    }
                }

                return false;
            }

            return false;
        }

        this.reload = function (_records, _rows, _filter, _updated, fullupdate, startindex, endindex) {
            var self = this.that;
            var diff = new Array();
            var records = _records;
            var rows = _rows;
            var filter = _filter;
            var updated = _updated;

            var rl = rows.length;
            var currentRowIndex = 0;
            var currentPageIndex = 0;
            var item, id;
            this.columns = [];
            this.bounditems = new Array();
            this.loadedrecords = new Array();
            this.loadedrootgroups = new Array();
            this.loadedgroups = new Array();
            this.loadedgroupsByKey = new Array();
            this._cachegrouppages = new Array();
            this.recordsbyid = {};

            if (this.totalrecords == 0) {
                Object.size = function (obj) {
                    var size = 0, key;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                };

                var totalrecords = Object.size(records);
                this.totalrecords = totalrecords;

                $.each(this.records, function (i) {
                    var item = this;
                    var index = 0;
                    $.each(item, function (columnName, value) {
                        self.columns[index++] = columnName;
                    });

                    return false;
                });
            }

            if (this.virtualmode) {
                if (this.pageable) {
                    this.updateview();
                    return;
                }

                var startindex = 0;
                if (!this.groupable) {
                    this.updateview();
                    return;
                }
                else {
                    var endindex = this.totalrecords;
                }
            }
            else {
                var startindex = 0;
                var endindex = this.totalrecords;
            }

            if (this.groupable && this.groups.length > 0 && this.loadgrouprecords) {
                var visualRows = startindex;
                visualRows = this.loadgrouprecords(0, startindex, endindex, filter, currentPageIndex, updated, rows, rl, diff);
            }
            else {
                currentRowIndex = this.loadflatrecords(startindex, endindex, filter, currentPageIndex, updated, rows, rl, diff);
            }

            if (rl > currentPageIndex)
                rows.splice(currentPageIndex, rl - currentPageIndex);


            if (this.groups.length > 0 && this.groupable) {
                this.totalrows = visualRows;
            }
            else {
                this.totalrows = currentRowIndex;
            }

            return diff;
        }

        this.loadflatrecords = function (startindex, endindex, filter, currentPageIndex, updated, rows, rl, diff) {
            var self = this.that;
            var i = startindex;
            var currentRowIndex = startindex;
            endindex = Math.min(endindex, this.totalrecords);

            var hassortdata = this.sortdata != null;
            var localdata = this.source.id && (this.source.datatype == 'local' || this.source.datatype == 'array' || this.source.datatype == '');

            var data = hassortdata ? this.sortdata : this.records;

            for (var obj = startindex; obj < endindex; obj++) {
                var item = {};
                if (!hassortdata) {
                    item = $.extend({}, data[obj]);
                    id = item[self.uniqueId];
                    item.boundindex = i;
                    self.loadedrecords[i] = item;

                    if (item.uid == undefined) {
                        item.uid = self.getid(self.source.id, item, i);
                    }
                    self.recordsbyid["id" + item.uid] = data[obj];
                    item.uniqueid = self.generatekey();
                    self.bounditems[this.bounditems.length] = item;
                }
                else {
                    item = $.extend({}, data[obj].value);
                    id = item[self.uniqueId];
                    item.boundindex = data[obj].index;
                    if (item.uid == undefined) {
                        item.uid = self.getid(self.source.id, item, item.boundindex);
                    }
                    self.recordsbyid["id" + item.uid] = data[obj].value;
                    self.loadedrecords[i] = item;
                    item.uniqueid = self.generatekey();
                    self.bounditems[item.boundindex] = item;
                }

                if (currentPageIndex >= rl || id != rows[currentPageIndex][self.uniqueId] || (updated && updated[id]))
                    diff[diff.length] = currentPageIndex;

                rows[currentPageIndex] = item;
                currentPageIndex++;

                item.visibleindex = currentRowIndex;
                currentRowIndex++;
                i++;
            }

            if (self.grid.summaryrows) {
                var rowindex = i;
                $.each(self.grid.summaryrows, function () {
                    var item = $.extend({}, this);
                    item.boundindex = endindex++;
                    self.loadedrecords[rowindex] = item;
                    item.uniqueid = self.generatekey();
                    self.bounditems[self.bounditems.length] = item;
                    rows[currentPageIndex] = item;
                    currentPageIndex++;
                    item.visibleindex = currentRowIndex;
                    currentRowIndex++;
                    rowindex++;
                });
            }

            return currentRowIndex;
        },

        this.updateview = function (from, to) {
            var self = this.that;
            var currentRowIndex = this.pagesize * this.pagenum;
            var currentPageIndex = 0;
            var rows = new Array();
            var filter = this.filters;
            var updated = this.updated;
            var rl = rows.length;

            if (this.pageable) {
                if (this.virtualmode) {
                    if (!this.groupable || this.groups.length == 0) {
                        this.loadflatrecords(this.pagesize * this.pagenum, this.pagesize * (1 + this.pagenum), filter, currentPageIndex, updated, rows, rl, []);
                        this.totalrows = rows.length;
                    }
                    else if (this.groupable && this.groups.length > 0 && this.loadgrouprecords) {
                        if (this._cachegrouppages[this.pagenum + '_' + this.pagesize] != undefined) {
                            this.rows = this._cachegrouppages[this.pagenum + '_' + this.pagesize];
                            this.totalrows = this.rows.length;
                            return;
                        }

                        var endindex = this.pagesize * (1 + this.pagenum);
                        if (endindex > this.totalrecords) {
                            endindex = this.totalrecords;
                        }

                        this.loadgrouprecords(0, this.pagesize * this.pagenum, endindex, filter, currentPageIndex, updated, rows, rl, []);
                        this._cachegrouppages[this.pagenum + '_' + this.pagesize] = this.rows;
                        this.totalrows = this.rows.length;
                        return;
                    }
                }
            }
            else {
                if (this.virtualmode && (!this.groupable || this.groups.length == 0)) {
                    var pagesize = this.pagesize;
                    if (pagesize == 0) {
                        pagesize = Math.min(100, this.totalrecords);
                    }
                    var start = pagesize * this.pagenum;
                    if (this.loadedrecords.length == 0) start = 0;

                    if (from != null && to != null) {
                        this.loadflatrecords(from, to, filter, currentPageIndex, updated, rows, rl, []);
                    }
                    else {
                        this.loadflatrecords(this.pagesize * this.pagenum, this.pagesize * (1 + this.pagenum), filter, currentPageIndex, updated, rows, rl, []);
                    }
                    this.totalrows = this.loadedrecords.length;
                    this.rows = rows;
                    if (rows.length >= pagesize) {
                        return;
                    }
                }
            }

            if (this.groupable && this.pageable && this.groups.length > 0 && this._updategroupsinpage) {
                rows = this._updategroupsinpage(self, filter, currentRowIndex, currentPageIndex, rl, this.pagesize * this.pagenum, this.pagesize * (1 + this.pagenum));
            }
            else {
                for (var i = this.pagesize * this.pagenum; i < this.pagesize * (1 + this.pagenum); i++) {
                    var item = i < this.loadedrecords.length ? this.loadedrecords[i] : null;
                    if (item == null) continue;

                    if (!this.pagesize || (currentRowIndex >= this.pagesize * this.pagenum && currentRowIndex <= this.pagesize * (this.pagenum + 1))) {
                        rows[currentPageIndex] = item;
                        currentPageIndex++;
                    }

                    currentRowIndex++;
                }
            }

            if ((rows.length == 0 || rows.length < this.pagesize) && !this.pageable && this.virtualmode) {
                currentPageIndex = rows.length;
                var startlength = rows.length;
                for (var i = this.pagesize * this.pagenum; i < this.pagesize * (1 + this.pagenum) - startlength; i++) {
                    var item = {};
                    item.boundindex = i + startlength;
                    item.visibleindex = i + startlength;
                    item.uniqueid = self.generatekey();
                    item.empty = true;
                    self.bounditems[i + startlength] = item;
                    rows[currentPageIndex] = item;
                    currentPageIndex++;
                }
            }

            this.rows = rows;
        }

        this.generatekey = function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10) | 0);
            };
            return ("" + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }

        this.reloaddata = function () {
            this.reload(this.records, this.rows, this.filter, this.updated, true);
        }

        this.refresh = function (fullupdate) {
            if (this.suspend) return;

            if (fullupdate == undefined) {
                fullupdate = true;
            }

            var countBefore = this.rows.length;
            var totalrowsBefore = this.totalrows;

            if (this.filters.length > 0 && !this.virtualmode) {
                var filter = "";
                var length = this.cachedrecords.length;
                var filtereddata = new Array();
                this.totalrecords = 0;
                var data = this.cachedrecords;
                this._dataIndexToBoundIndex = new Array();
                var filterslength = this.filters.length;

                if (this.source != null && this.source.filter != undefined && this.source.localdata != undefined) {
                    filtereddata = this.source.filter(this.filters, data, length);
                    if (filtereddata == undefined) {
                        filtereddata = new Array();
                    }
                    this.records = filtereddata;
                }
                else if (this.source.filter == null || this.source.filter == undefined) {
                    for (var row = 0; row < length; row++) {
                        var datarow = data[row];
                        var filterresult = undefined;
                        for (var j = 0; j < filterslength; j++) {
                            var filter = this.filters[j].filter;
                            var value = datarow[this.filters[j].datafield];
                            var result = filter.evaluate(value);

                            if (filterresult == undefined) filterresult = result;
                            else {
                                if (filter.operator == 'or') {
                                    filterresult = filterresult || result;
                                }
                                else {
                                    filterresult = filterresult && result;
                                }
                            }
                        }

                        if (filterresult) {
                            filtereddata[filtereddata.length] = $.extend({ dataindex: row }, datarow);
                            this._dataIndexToBoundIndex[row] = { boundindex: filtereddata.length - 1 };
                        }
                        else this._dataIndexToBoundIndex[row] = null;
                    }
                    this.records = filtereddata;
                }
                if (this.sortdata) {
                    var lookupkey = this.sortfield;
                    if (this.sortcache[lookupkey]) {
                        this.sortdata = null;
                        var direction = this.sortcache[lookupkey].direction;
                        this.sortcache[lookupkey] = null;
                        this.sortby(this.sortfield, direction);
                        return;
                    }
                }
            }
            else if (this.filters.length == 0 && !this.virtualmode) {
                if (this.cachedrecords) {
                    this.totalrecords = 0;
                    var data = this.cachedrecords;
                    this.records = data;
                    if (this.sortdata) {
                        var lookupkey = this.sortfield;
                        if (this.sortcache[lookupkey]) {
                            this.sortdata = null;
                            var direction = this.sortcache[lookupkey].direction;
                            this.sortcache[lookupkey] = null;
                            this.sortby(this.sortfield, direction);
                            return;
                        }
                    }
                }
            }

            var diff = this.reload(this.records, this.rows, this.filter, this.updated, fullupdate);
            this.updated = null;

            if (this.rowschangecallback != null) {
                if (totalrowsBefore != totalrows) this.rowschangecallback({ type: "PagingChanged", data: getpagingdetails() });
                if (countBefore != rows.length) this.rowschangecallback({ type: "RowsCountChanged", data: { previous: countBefore, current: rows.length } });
                if (diff.length > 0 || countBefore != rows.length) {
                    this.rowschangecallback({ type: "RowsChanged", data: { previous: countBefore, current: rows.length, diff: diff } });
                }
            }
        }

        return this;
    }
})(jQuery);