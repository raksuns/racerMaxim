/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
		backbone: {
			deps: [ 'underscore', 'jquery' ],
			exports: 'Backbone'
		},
		jqxcore: { deps: [ 'jquery' ] },
		jqxdata: { deps: [ 'jqxcore' ] },
		jqxbuttons: { deps: [ 'jqxcore' ] },
		jqxscrollbar: { deps: [ 'jqxcore' ] },
		jqxmenu: { deps: [ 'jqxcore' ] },
		jqxcheckbox: { deps: [ 'jqxcore' ] },
		jqxlistbox: { deps: [ 'jqxcore' ] },
		jqxdropdownlist: { deps: [ 'jqxcore' ] },
		jqxcalendar: { deps: [ 'jqxcore' ] },
		jqxdatetimeinput: { deps: [ 'jqxcalendar' ] },
		jqxgrid: { deps: [ 'jquery', 'jqxcore' ] },
		"jqxgrid.sort": { deps: [ 'jqxgrid' ] },
		"jqxgrid.pager": { deps: [ 'jqxgrid' ] },
		"jqxgrid.selection": { deps: [ 'jqxgrid' ] },
		"jqxgrid.edit": { deps: [ 'jqxgrid' ] },
		"jqxgrid.columnsresize": { deps: [ 'jqxgrid' ] },
		"jqxgrid.columnsreorder": { deps: [ 'jqxgrid' ] },
	    jqxexpander: { deps: [ 'jqxcore' ] },
	    jqxdragdrop: { deps: [ 'jqxcore' ] },
		jqxwindow: { deps: [ 'jqxcore' ] },
	    jqxsplitter: { deps: [ 'jqxcore' ] },
	    jqxpanel: { deps: [ 'jqxcore' ] },
	    jqxinput: { deps: [ 'jqxcore' ] },
		"views/application": {
			deps: [
				, 'jqxdata'
				, 'jqxbuttons'
				, 'jqxscrollbar'
				, 'jqxmenu'
				, 'jqxcheckbox'
				, 'jqxlistbox'
				, 'jqxdropdownlist'
				, 'jqxdatetimeinput'
				, 'jqxexpander'
				, 'jqxdragdrop'
				, 'jqxgrid'
				, 'jqxgrid.sort'
				, 'jqxgrid.pager'
				, 'jqxgrid.selection'
				, 'jqxgrid.edit'
				, 'jqxgrid.columnsresize'
				, 'jqxgrid.columnsreorder'
				, 'jqxwindow'
				, 'jqxsplitter'
				, 'jqxpanel'
				, 'jqxinput'
			]
		}
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		templates: '../.tmp/scripts/templates',
		jqxcore: 'vendor/jqwidgets/jqxcore',
		jqxdata: 'vendor/jqwidgets/jqxdata',
		jqxbuttons: 'vendor/jqwidgets/jqxbuttons',
		jqxscrollbar: 'vendor/jqwidgets/jqxscrollbar',
		jqxmenu: 'vendor/jqwidgets/jqxmenu',
		jqxcheckbox: 'vendor/jqwidgets/jqxcheckbox',
		jqxlistbox: 'vendor/jqwidgets/jqxlistbox',
		jqxdropdownlist: 'vendor/jqwidgets/jqxdropdownlist',
		jqxcalendar: 'vendor/jqwidgets/jqxcalendar',
		jqxdatetimeinput: 'vendor/jqwidgets/jqxdatetimeinput',
		jqxgrid: 'vendor/jqwidgets/jqxgrid',
		"jqxgrid.sort": 'vendor/jqwidgets/jqxgrid.sort',
		"jqxgrid.pager": 'vendor/jqwidgets/jqxgrid.pager',
		"jqxgrid.selection": 'vendor/jqwidgets/jqxgrid.selection',
		"jqxgrid.edit": 'vendor/jqwidgets/jqxgrid.edit',
		"jqxgrid.columnsresize": 'vendor/jqwidgets/jqxgrid.columnsresize',
		"jqxgrid.columnsreorder": 'vendor/jqwidgets/jqxgrid.columnsreorder',
		jqxwindow: 'vendor/jqwidgets/jqxwindow',
	    jqxexpander: 'vendor/jqwidgets/jqxexpander',
	    jqxdragdrop: 'vendor/jqwidgets/jqxdragdrop',
	    jqxsplitter: 'vendor/jqwidgets/jqxsplitter',
	    jqxpanel: 'vendor/jqwidgets/jqxpanel',
	    jqxinput: 'vendor/jqwidgets/jqxinput'
    }
});

require([
	'views/application'
], function (ApplicationView) {
	new ApplicationView();
});

