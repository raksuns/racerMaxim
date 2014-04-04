/*global define*/

define([
	'views/mainSplitter'
], function (MainSplitterView) {
    'use strict';

	var ApplicationView = Backbone.View.extend({
		initialize: function() {
			new MainSplitterView({
				el: $("#mainSplitter")
			});
		}
	});
	
	return ApplicationView;
});
