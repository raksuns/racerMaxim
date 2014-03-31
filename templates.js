/**
 * Created by davinci on 2014. 3. 20..
 */

exports.page = function(_arg) {
	var bundle, qsheetId, list, listHtml, qsheetItem, _ref;

	_ref = _arg != null ? _arg : {};

	qsheetId = _ref.qsheetId;
	list = _ref.list;
	bundle = _ref.bundle;

	listHtml = ((function() {
		var _i, _len, _ref1, _results;
		_ref1 = list || [];
		_results = [];

		for(_i = 0, _len = _ref1.length; _i < _len; _i++) {
			qsheetItem = _ref1[_i];
			_results.push(exports.qsheetItem(qsheetItem));
		}

		return _results;
	})()).join('');

	bundle = JSON.stringify(bundle).replace(/'/g, '&#39;');

	console.log('return template page.');

	return "<!DOCTYPE html>\n<meta charset=\"utf-8\">\n<title>Qsheet - "
		+ qsheetId
		+ "</title>\n<link rel=\"stylesheet\" href=\"/css/style.css\">\n<form id=\"head\" onsubmit=\"return false\">\n  <h1>Qsheet</h1>\n  <div id=\"add\">\n    <div id=\"add-input\"><input id=\"new-qsheet\"></div>\n    <input id=\"add-button\" type=\"submit\" value=\"Add\">\n  </div>\n</form>\n<div id=\"dragbox\"></div>\n<form id=\"content\" autocomplete=\"off\">\n  <ul id=\"list\">"
		+ listHtml
		+ "</ul>\n</form>\n<script async src=\"/script.js\" data-bundle='" + bundle + "'></script>";
};

exports.qsheetItem = function(item) {
	var checked, completed, text;

	if(!item) {
		return '<li style="display:none"></li>';
	}

	if(item.completed) {
		completed = 'completed';
		checked = 'checked';
	}
	else {
		completed = '';
		checked = '';
	}

	text = (item.text || '').replace(/"/g, '&quot;');

	return "<li id=\"" + item.id + "\" class=\"" + completed + "\">\n  <table width=\"100%\">\n    <td class=\"handle\" width=\"0\"></td>\n    <td width=\"100%\">\n      <div class=\"qsheet\">\n        <label><input type=\"checkbox\" " + checked + "><i></i></label>\n        <input class=\"text\" value=\"" + text + "\"><i></i>\n      </div>\n    </td>\n    <td width=\"0\"><button type=\"button\" class=\"delete\">Delete</button></td>\n  </table>\n</li>";
};