/*global define*/

define([
    'backbone',
	'models/qsheetA',
	'views/qsheetA',
	'models/KAKA',
	'views/KAKA'
], function (Backbone, QSheetModel, QSheetView, KAKAModel, KAKAView) {
    'use strict';

	// 1280 x 768
	var MainSplitterView = Backbone.View.extend({
		initialize: function() {
			this.$el.jqxSplitter({ width: "100%", height: 750, panels: [{ size: 800, collapsible: false }] });

			var qm = new QSheetModel({});
			new QSheetView({
				model: qm,
				el: $("#mainSplitterQsheetItem")
			});

			var am = new KAKAModel({});
			new KAKAView({
				model: am,
				el: $("#mainSplitterArticleItem")
			});
		},
		render: function() {
			return this;
		}
	});

    return MainSplitterView;
});
