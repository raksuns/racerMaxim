var racer = require('./racer'),
	templates = require('./templates');

require('./public/js/jquery-1.9.1.min.js');
require('./public/js/jquery-ui-1.10.3.custom.min.js');

$(function () {
	var data, eventIndex, from, list, listModel, model, newQsheet;
	data = JSON.parse(document.scripts[0].getAttribute('data-bundle'));
	model = racer.createModel(data);
	list = $('#list');
	listModel = model.at('_qsheet.list');

	listModel.on('change', '*.completed', function (index, value) {
		var item;
		item = list.children().eq(index);
		item.toggleClass('completed', value);
		return item.find('[type=checkbox]').prop('checked', value);
	});

	listModel.on('change', '*.text', function (index, value) {
		var item;
		item = list.children().eq(index).find('.text');
		if (item.val() !== value) {
			return item.val(value);
		}
	});

	listModel.on('change', '*', function (index, value) {
		return list.children().eq(index).replaceWith(templates.qsheetItem(value));
	});

	listModel.on('insert', function (index, values) {
		var html, target, value;
		html = ((function () {
			var _i, _len, _results;
			_results = [];
			for (_i = 0, _len = values.length; _i < _len; _i++) {
				value = values[_i];
				_results.push(templates.qsheetItem(value));
			}
			return _results;
		})()).join('');
		target = list.children().eq(index);
		if (target.length) {
			return target.before(html);
		} else {
			return list.append(html);
		}
	});

	listModel.on('remove', function (index, removed) {
		return list.children().slice(index, index + removed.length).remove();
	});

	listModel.on('move', function (from, to, howMany, passed) {
		var index, moved, target;
		if (passed.sortable) {
			return;
		}
		moved = list.children().slice(from, from + howMany);
		index = from > to ? to : to + howMany;
		target = list.children().eq(index);
		if (target.length) {
			return target.before(moved);
		} else {
			return list.append(moved);
		}
	});

	newQsheet = $('#new-qsheet');

	$('#head').on('submit', function () {
		var i, items, text, item, _i, _len;
		text = newQsheet.val();
		if (!text) {
			return;
		}
		newQsheet.val('');
		items = listModel.get();
		for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
			item = items[i];
			if (item != null ? item.completed : void 0) {
				break;
			}
		}
		return listModel.insert(i, {
			id: model.id(),
			completed: false,
			text: text
		});
	});

	eventIndex = function (e) {
		var item;
		item = $(e.target).parents('li');
		return list.children().index(item);
	};

	list.on('change', '[type=checkbox]', function (e) {
		var index;
		index = eventIndex(e);
		listModel.set(index + '.completed', e.target.checked);
		if (e.target.checked) {
			return listModel.move(index, -1);
		}
	});

	list.on('input', '.text', function (e) {
		return listModel.set(eventIndex(e) + '.text', e.target.value);
	});

	list.on('click', '.delete', function (e) {
		return listModel.remove(eventIndex(e));
	});

	from = null;

	return list.sortable({
		handle: '.handle',
		axis: 'y',
		containment: '#dragbox',
		start: function (e, ui) {
			var item;
			item = ui.item[0];
			return from = list.children().index(item);
		},
		update: function (e, ui) {
			var item, to;
			item = ui.item[0];
			to = list.children().index(item);
			return listModel.pass({
				sortable: true
			}).move(from, to);
		}
	});
});