
var racer = require('./racer'),
	templates = require('./templates');

var eventIndex,
	from,
	list,
	listModel,
	newQsheet;

var changeCompleted = function(index, value){
	console.log('listModel change - completed.');
	var item = list.children().eq(index);
	item.toggleClass('completed', value);
	return item.find('[type=checkbox]').prop('checked', value);
};

var changeText = function(index, value) {
	var item = list.children().eq(index).find('.text');
	if(item.val() !== value) {
		return item.val(value);
	}
};

var insert = function(index, values) {
	var html, target, value;

	html = ((function() {
		var _i, _len, _results;
		_results = [];

		for(_i = 0, _len = values.length; _i < _len; _i++) {
			value = values[_i];
			_results.push(templates.qsheetItem(value));
		}
		return _results;
	})()).join('');

	target = list.children().eq(index);

	if(target.length) {
		return target.before(html);
	}
	else {
		return list.append(html);
	}
};

var remove = function(index, removed) {
	return list.children().slice(index, index + removed.length).remove();
};

var changeReplaceWith = function(index, values) {
	return list.children().eq(index).replaceWith(templates.qsheetItem(values));
};

var move = function(from, to, howMany, passed) {
	var index, moved, target;

	if(passed.sortable) {
		return;
	}

	moved = list.children().slice(from, from + howMany);
	index = from > to ? to : to + howMany;
	target = list.children().eq(index);

	if(target.length) {
		return target.before(moved);
	}
	else {
		return list.append(moved);
	}
};

var newAdd = function() {

	newQsheet = $('#new-qsheet');

	var i, items, text, qsheetItem, _i, _len;
	text = newQsheet.val();

	if(!text) {
		return;
	}

	newQsheet.val('');

	items = listModel.get();

	for(i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
		qsheetItem = items[i];

		if(qsheetItem != null ? qsheetItem.completed : void 0) {
			break;
		}
	}

	return listModel.insert(i, {
		id: model.id(),
		completed: false,
		text: text
	});
};

var checkChange = function(e) {
	var index = eventIndex(e);
	listModel.set(index + '.completed', e.target.checked);

	if(e.target.checked) {
		return listModel.move(index, -1);
	}
};

var textChange = function(e) {
	return listModel.set(eventIndex(e) + '.text', e.target.value);
};

var rowDelete = function(e) {
	return listModel.remove(eventIndex(e));
};

var readyClient = function(model) {

	window.model = model;

	list = $('#list');
	listModel = model.at('_qsheet.list');

	listModel.on('change', '*.completed', changeCompleted);
	listModel.on('change', '*.text', changeText);
	listModel.on('change', '*', changeReplaceWith);
	listModel.on('insert', insert);
	listModel.on('remove', remove);
	listModel.on('move', move);

	$('#head').on('submit', newAdd);

	eventIndex = function(e) {
		var item = $(e.target).parents('li');
		return list.children().index(item);
	};

	list.on('change', '[type=checkbox]', checkChange);
	list.on('input', '.text', textChange);
	list.on('click', '.delete', rowDelete);

	from = null;

	return list.sortable({
		handle: '.handle',
		axis: 'y',
		containment: '#dragbox',
		start: function(e, ui) {
			var item = ui.item[0];
			return from = list.children().index(item);
		},
		update: function(e, ui) {
			var item, to;
			item = ui.item[0];
			to = list.children().index(item);

			return listModel.pass({
				sortable: true
			}).move(from, to);
		}
	});
};

racer.ready(function(model) {
	return $(readyClient(model));
});