/*global define*/

define([
    'backbone',
	'templates'
], function (Backbone, JST) {
    'use strict';

	var QSheetView = Backbone.View.extend({
		template: JST['app/scripts/templates/qsheetA.ejs'],
		
		getItems: function() {
			var url = "./selectD1.yson";
			// prepare the data
			var source =
			{
				datatype: "json",
				datafields: [
					{ name: 'qsheetItemId', type: 'string' }
					, { name: 'parentId', type: 'number' }
					, { name: 'childrenCnt', type: 'number' }
					, { name: 'expanded', type: 'bool' }
					, { name: 'onairDt', type: 'string' }
					, { name: 'rpterNm', type: 'string' }
					, { name: 'qsheetItemKindNm', type: 'string' }
					, { name: 'qsheetItemTitle', type: 'string' }
					, { name: 'expectPrcsDurExl', type: 'string' }
					, { name: 'aggrTimeExl', type: 'string' }
					, { name: 'artclStatNm', type: 'string' }
					, { name: 'artclKindNm', type: 'string' }
					, { name: 'audFileCnt', type: 'number' }
					, { name: 'stdioImg1', type: 'string' }
					, { name: 'stdioImg2', type: 'string' }
					, { name: 'fileCnt', type: 'number' }
					, { name: 'videoImg1', type: 'string' }
					, { name: 'videoImg2', type: 'string' }
					, { name: 'sndImg1', type: 'string' }
					, { name: 'sndImg2', type: 'string' }
					, { name: 'dlpPdpImg', type: 'string' }
					, { name: 'effectId', type: 'string' }
					, { name: 'effectKindCd', type: 'string' }
					, { name: 'effectSubtl', type: 'string' }
					, { name: 'scrMainTransStat', type: 'string' }
					, { name: 'scrBackTransStat', type: 'string' }
					, { name: 'videoWorkers', type: 'string' }
					, { name: 'grpWorkers', type: 'string' }
					, { name: 'note', type: 'string' }
				],
				id: 'qsheetItemId',
				url: url
			};
			
			var dataAdapter = new $.jqx.dataAdapter(source, {
				downloadComplete: function (data, status, xhr) {
					return data['rows'];
				},
				loadComplete: function (data) {
					console.log("loadComplete");
				},
				loadError: function (xhr, status, error) {
					console.log("loadError");
				}
			});
			
			// 조회
			this.$jqxGrid.jqxGrid({
				source: dataAdapter
			});
		},
		initWidgets: function() {
			var $el = this.$el;
			var self = this;
			var $jqxGrid = $el.find(".qsheet-grid");
			var $btnColSet = $el.find(".qsheet-btn-colset");
			var $listFontSize = $el.find(".qsheet-list-fontsize");

			/////////////////////////////////////////////////////////////
			// 1. Grid 생성
			var cellsrendererMent = function (row, columnfield, value, defaulthtml, columnproperties) {
				return ' ';
			};
			
			var cellclassnameStudioImg = function(row, columnfield, value, bounddata) {
				var classname = "studio";
				if(value) {
					classname = classname + " studio-" + value.toLowerCase();
				}
				
				return classname;
			};
			
			var cellsrendererStudioImg = function (row, columnfield, value, defaulthtml, columnproperties) {
				return ' ';
			};
			
			var cellsrendererOrder = function (row, columnfield, value, defaulthtml, columnproperties) {
				return '<div style="text-overflow: ellipsis; overflow: hidden; padding-bottom: 2px; text-align: center; margin-top: 5px;">' + (row + 1) +'</div>';
			};
			
			var cellsrendererParent = function (row, columnfield, value, defaulthtml, columnproperties) {
				return ' ';
			};


			// initialize jqxGrid
			$jqxGrid.jqxGrid(
			{
				width: "100%",
				height: "700",
				enabletooltips: true,
				columnsresize: true,
				columnsreorder: true,
				editable: true,
				editmode: 'click',
				selectionmode: 'multiplerowsadvanced',
				columns: [
					{ text: ' ', align: 'center', pinned: true, datafield: 'parentId', enabletooltips: false, width: 20, maxWidth:20, minWidth:20, cellclassname: 'jqx-grid-cell-parentid', columntype: "button", editable: false, cellsrenderer: cellsrendererParent }
					, { text: '순번', pinned: true, align: 'center', datafield: 'childrenCnt', enabletooltips: false, width: 65, editable: false, cellsrenderer: cellsrendererOrder }
					, { text: '발송상태', align: 'center', cellsalign: 'center', datafield: 'qsheetItemOnairStatNm', width: 60, editable: false }
					, { text: '엥커<br/>멘트', align: 'center', cellsalign: 'center', datafield: 'dummy2', width: 35, classname: 'jqx-grid-column-header-ment', cellclassname: 'jqx-grid-cell-ment', columntype: "button", cellsrenderer: cellsrendererMent, editable: false }
					, { text: '리포터', align: 'center', cellsalign: 'center', datafield: 'rpterNm', width: 45 }
					, { text: '타입', align: 'center', cellsalign: 'center', datafield: 'qsheetItemKindNm', width: 65, columntype: 'dropdownlist',
						createeditor: function(row, column, editor) {
							// assign a new data source to the dropdownlist.
							var list = ['', 'Opening', 'Closing', '리포트', '단신', 'CM', '시각고지', '로고', '헤드라인', '타이틀', '날씨', '출연', '전화', '중계차', '네트워크', '코너시작', '코너끝', 'END'];
							editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
						},
						// update the editor's value before saving it.
						cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
							// return the old value, if the new value is empty.
							// if (newvalue === '') return oldvalue;
						}
					}
					, { text: '아이템제목', align: 'center', datafield: 'qsheetItemTitle', width: 350 }
					, { text: '예상방송', align: 'center', cellsalign: 'center', datafield: 'expectPrcsDurExl', width: 65 }
					, { text: '예상누계', align: 'center', cellsalign: 'center', datafield: 'aggrTimeExl', width: 65, editable: false }
					, { text: '상태', align: 'center', cellsalign: 'center', columngroup: 'article', datafield: 'artclStatNm', width: 65 }
					, { text: '링크', align: 'center', cellsalign: 'center', columngroup: 'article', datafield: 'artclKindNm', width: 35 }
					, { text: '오디오', align: 'center', cellsalign: 'center', columngroup: 'article', datafield: 'audFileCnt', width: 35, classname: 'jqx-grid-column-header-audio', renderer: function () {
						return '<img src="../../images/icon_up_audio.png" />';
					} }
					, { text: '1', align: 'center', cellsalign: 'center', columngroup: 'studio', datafield: 'stdioImg1', width: 45, maxwidth: 45, minwidth: 45, columntype: "button", cellclassname: cellclassnameStudioImg, editable: false, cellsrenderer: cellsrendererStudioImg }
					, { text: '2', align: 'center', cellsalign: 'center', columngroup: 'studio', datafield: 'stdioImg2', width: 45, maxwidth: 45, minwidth: 45, editable: false, cellsrenderer: cellsrendererStudioImg }
					, { text: '파일', align: 'center', cellsalign: 'center', columngroup: 'video', datafield: 'fileCnt', width: 45 }
					, { text: '1', align: 'center', cellsalign: 'center', columngroup: 'video', datafield: 'videoImg1', width: 45 }
					, { text: '2', align: 'center', cellsalign: 'center', columngroup: 'video', datafield: 'videoImg2', width: 45 }
					, { text: '1', align: 'center', cellsalign: 'center', columngroup: 'audio', datafield: 'sndImg1', width: 45 }
					, { text: '2', align: 'center', cellsalign: 'center', columngroup: 'audio', datafield: 'sndImg2', width: 45 }
					, { text: 'DLP/PDP', align: 'center', cellsalign: 'center', datafield: 'dlpPdpImg', width: 65 }
					, { text: 'ID', align: 'center', cellsalign: 'center', columngroup: 'effect', datafield: 'effectId', width: 45 }
					, { text: '종류', align: 'center', cellsalign: 'center', columngroup: 'effect', datafield: 'effectKindCd', width: 45 }
					, { text: '서브', align: 'center', cellsalign: 'center', columngroup: 'effect', datafield: 'effectSubtl', width: 45 }
					, { text: '메인', align: 'center', cellsalign: 'center', columngroup: 'videostate', datafield: 'scrMainTransStat', width: 45 }
					, { text: '백업', align: 'center', cellsalign: 'center', columngroup: 'videostate', datafield: 'scrBackTransStat', width: 45 }
					, { text: '영상편집자', align: 'center', cellsalign: 'center', datafield: 'videoWorkers', width: 65 }
					, { text: '그래픽편집자', align: 'center', cellsalign: 'center', datafield: 'grpWorkers', width: 65 }
					, { text: '비고', align: 'center', cellsalign: 'center', datafield: 'note', width: 65 }
				],
				columngroups: [
					{ text: '기사', align: 'center', name: 'article' }
					, { text: '스튜디어', align: 'center', name: 'studio' }
					, { text: '영상', align: 'center', name: 'video' }
					, { text: '음향', align: 'center', name: 'audio' }
					, { text: '이펙트', align: 'center', name: 'effect' }
					, { text: '영상상태', align: 'center', name: 'videostate' }
				]
			});

			this.$jqxGrid = $jqxGrid;

			var jqxGridInstance = $jqxGrid.data("jqxGrid").instance;

			var makeActiveColumns = function() {
				var columnlength = jqxGridInstance.columns.records.length;
				var activeColumns = [];
				var inactiveColumns = [];
				var obj;

				var getGroupText = function(groupName) {
					var groupText = "";
					$.each(jqxGridInstance.columngroups, function(index, obj) {
						if(obj.name === groupName) {
							groupText = obj.text;
							return false;
						}
					});
					return groupText;
				};

				for(var i = 0; i < columnlength; i++) {
					var column = jqxGridInstance.columns.records[i];

					if(column.pinned) {
						continue;
					}

					obj = {};
					var objColumnGroup = column.columngroup;
					if(objColumnGroup) {
						obj.columnname = getGroupText(objColumnGroup);
						obj.datafield = column.datafield;
						for(++i; i < columnlength; i++) {
							column = jqxGridInstance.columns.records[i];
							if(!column.columngroup) {
								--i;
								break;
							}

							if(column.columngroup !== objColumnGroup) {
								--i;
								break;
							}

							obj.datafield = obj.datafield + "," + column.datafield;
						}
					}
					else {
						obj.columnname = column.text.replace("<br/>", "");
						obj.datafield = column.datafield;
					}

					if(column.hidden) {
						inactiveColumns.push(obj);
					}
					else {
						activeColumns.push(obj);
					}
				}

				activeColumnNames = activeColumns;
				inactiveColumnNames = inactiveColumns;
			};

			$jqxGrid.on("rowsrendered", function(e) {
				self.initToDragRows();
			});

			$jqxGrid.on("columnreordercompleted", function(e) {
				makeActiveColumns();
			});

			$jqxGrid.on('rowclick', function () {
				// put the focus back to the Grid. Otherwise, the focus goes to the drag feedback element.
				$jqxGrid.jqxGrid('focus');
			});

			/////////////////////////////////////////////////////////////
			// Drag&Drop
			var $rowsdropline;
			var selector = "#" + this.el.id + " .jqx-grid-cell-parentid";
			$(document).on('dragStart', selector, function (event) {
				var value = $(this).text();
				var position = $.jqx.position(event.args);
				var cell = jqxGridInstance.getcellatposition(position.left, position.top);
				var rowsindexes = jqxGridInstance.getselectedrowindexes();

				var rows = [];
				var ids = [];
				var clickedrow = cell.row;
				var isselected = false;
				var id, data;
				var startRow = rowsindexes[0];
				var endRow = rowsindexes[rowsindexes.length-1];
				for (var i = 0; i < rowsindexes.length; i++) {
					if (rowsindexes[i] === clickedrow) {
						isselected = true;
					}

					ids.unshift(jqxGridInstance.getrowid(rowsindexes[i]));
					rows.unshift(jqxGridInstance.getrowdata(rowsindexes[i]));
				}
				if (!isselected) {
					ids = [];
					rows = [];

					// 드래그 시작시에 render를 할 경우 드래그한 element가 사라지는 문제가 있다.
					// 이 때문에 render를 하지 않게 하고
					jqxGridInstance.clearselection(false, false);
					jqxGridInstance.selectrow(cell.row, false);

					// 필요한 부분만 표시하게 했다.
					$jqxGrid.find(".jqx-fill-state-pressed.jqx-grid-cell-selected").removeClass("jqx-fill-state-pressed jqx-grid-cell-selected");
					var firstrow = jqxGridInstance._findvisiblerow();
					var visiblerow = (cell.row - firstrow);
					var $row = $(".qsheet-grid .jqx-grid-content.jqx-widget-content > div > [role=row]").eq(visiblerow);
					if($row.length === 1) {
						$row.find("[role=gridcell]").addClass("jqx-fill-state-pressed jqx-grid-cell-selected");
					}

					startRow = cell.row;
					endRow = cell.row;

					ids.unshift(jqxGridInstance.getrowid(cell.row));
					rows.unshift(jqxGridInstance.getrowdata(cell.row));
				}

				if (rows.length > 0) {
					// update feedback's display value.
					var feedback = $(this).jqxDragDrop('feedback');
					if (feedback) {
						feedback.height(rows.length * jqxGridInstance.rowsheight);

						var table = '<table>';
						table += '<tr>';
						table += '</tr>';
						$.each(rows, function () {
							table += '<tr>';
							table += '<td>';
							table += this.rpterNm;
							table += '</td>';
							table += '<td>';
							table += this.qsheetItemTitle;
							table += '</td>';
							table += '</tr>';
						});
						table += '</table>';

						feedback.html(table);
					}
					// set the dragged records as data
					$(this).jqxDragDrop({
						data: {
							rows : rows,
							ids : ids,
							startRow : startRow,
							endRow : endRow
						}
					});
				}
			});

			var getWindowOffset = function(el) {
				var top = 0;
				var left = 0;
				while(1) {
					if(!el.offsetParent) {
						break;
					}

					top += el.offsetTop;
					left += el.offsetLeft;
					el = el.offsetParent;
				}

				return {
					top: top,
					left: left
				};
			};

			$(document).on('dragging', selector, function (event) {
				var feedback = $(this).jqxDragDrop('feedback');
				if (feedback) {
					var position = $.jqx.position(event.args);
					var qsheetWindowPos = getWindowOffset($jqxGrid[0]);

					var maxY = $jqxGrid.height() - 15 + qsheetWindowPos.top;
					var minY = jqxGridInstance.columnsheight * 2 + qsheetWindowPos.top;
					var maxX = $jqxGrid.width() + qsheetWindowPos.left;
					var minX = qsheetWindowPos.left;
					var curY = parseInt(feedback.css("top"), 10);
					var curX = parseInt(feedback.css("left"), 10);

					if(curX < minX || curX > maxX) {
						// 범위를 벗어났음.
						if($rowsdropline) {
							$rowsdropline.remove();
						}
						return;
					}

					// TODO: curY의 화면좌표를 찾아서 position.top을 대체하면 좀 더 정확하게 될까?
					var cell = jqxGridInstance.getcellatposition(position.left, position.top);
					var targetrow = cell.row;
					var vScrollInstance, verticalscrollvalue, top;

					// 아래범위를 벗어남.
					if(maxY < curY) {
						feedback[0].style.top = maxY + 'px';
						vScrollInstance = jqxGridInstance.vScrollInstance;
						verticalscrollvalue = vScrollInstance.value;
						top = parseInt(verticalscrollvalue, 10);
						vScrollInstance.setPosition(top + jqxGridInstance.rowsheight);
					}
					else if(minY > curY) {// 위범위를 벗어남.
						feedback[0].style.top = minY + 'px';
						vScrollInstance = jqxGridInstance.vScrollInstance;
						verticalscrollvalue = vScrollInstance.value;
						top = parseInt(verticalscrollvalue, 10);
						vScrollInstance.setPosition(top - jqxGridInstance.rowsheight);
					}

					if($rowsdropline) {
						$rowsdropline.remove();
					}

					var firstrow, visiblerow, $row;
					// targetrow
					if(targetrow !== undefined) {
						$rowsdropline = $('<div style="z-index: 9999; width:100%; display: block; position: absolute; background-color:red;"></div>');
						$rowsdropline.height(5);
						$(".qsheet-grid .jqx-grid-content.jqx-widget-content > div").append($rowsdropline);

						firstrow = jqxGridInstance._findvisiblerow();
						visiblerow = (targetrow - firstrow);
						$row = $(".qsheet-grid .jqx-grid-content.jqx-widget-content > div > [role=row]").eq(visiblerow);
						if($row.length === 1) {
							$rowsdropline.css("top", $row[0].offsetTop);
						}

						// drop시에 상단에 prepend한다.

						if($row.children().eq(0).hasClass("jqx-grid-cell-selected")) {
							if($rowsdropline) {
								$rowsdropline.remove();
							}
						}
						else if($row.prev().children().eq(0).hasClass("jqx-grid-cell-selected")) {
							if($rowsdropline) {
								$rowsdropline.remove();
							}
						}
					}
					else {
						if(maxY < curY + 15) {
							$rowsdropline = $('<div style="z-index: 9999; width:100%; display: block; position: absolute; background-color:red;"></div>');
							$rowsdropline.height(5);
							$(".qsheet-grid .jqx-grid-content.jqx-widget-content > div").append($rowsdropline);

							firstrow = jqxGridInstance._findvisiblerow();
							var rowscount = jqxGridInstance.getdatainformation().rowscount;
							visiblerow = (rowscount - firstrow);

							$row = $(".qsheet-grid .jqx-grid-content.jqx-widget-content > div > [role=row]").eq(visiblerow);
							if($row.length === 1) {
								$rowsdropline.css("top", $row[0].offsetTop);
							}

							console.log("last append");
						}
						else {
							console.log("cancel");
						}
					}
				}
			});

			$(document).on('dragEnd', selector, function (event) {
				var feedback = $(this).jqxDragDrop('feedback');
				if (feedback) {
					var position = $.jqx.position(event.args);
					var qsheetWindowPos = getWindowOffset($jqxGrid[0]);

					var maxY = $jqxGrid.height() - 15 + qsheetWindowPos.top;
					var maxX = $jqxGrid.width() + qsheetWindowPos.left;
					var minX = qsheetWindowPos.left;
					var curY = parseInt(feedback.css("top"), 10);
					var curX = parseInt(feedback.css("left"), 10);

					if(curX < minX || curX > maxX) {
						// 범위를 벗어났음.
						return;
					}

					var data = $(this).jqxDragDrop('data');
					jqxGridInstance.clearselection(false, false);

					if(maxY < curY + 15) {
						jqxGridInstance.deleterow(data.ids, false);
						jqxGridInstance.addrow(null, data.rows.reverse(), 'last');
					}
					else {
						var cell = jqxGridInstance.getcellatposition(position.left, position.top);

						if(cell !== null && cell !== true) {
							var targetrow = cell.row;

							// 서버에서 받은 id를 사용해야함.
							//jqxGridInstance.addrow(["CT20140310445303"], a, targetrow, true);

							if(data.startRow > targetrow) {
								jqxGridInstance.deleterow(data.ids, false);
								jqxGridInstance.addrow(null, data.rows, targetrow);
							}
							else if(data.endRow < targetrow) {
								jqxGridInstance.deleterow(data.ids, false);
								jqxGridInstance.addrow(null, data.rows, targetrow - data.ids.length);
							}
							// 서버에 dataRows를 add하고 리턴값으로 add한 item들의 id를 순서대로 받아야 한다.
						}
					}

					if($rowsdropline) {
						$rowsdropline.remove();
					}
				}
			});


			/////////////////////////////////////////////////////////////
			// 2. 컬럼설정 버튼 생성
			$btnColSet.jqxButton({
			});

			// TODO: 초기값은 서버에서 받아와야 되나?
			var columnNames = [
				{ "columnname" : "발송상태", "datafield": "qsheetItemOnairStatNm" },
				{ "columnname" : "엥커멘트", "datafield": "dummy2" },
				{ "columnname" : "리포터", "datafield": "rpterNm" },
				{ "columnname" : "타입", "datafield": "qsheetItemKindNm" },
				{ "columnname" : "아이템제목", "datafield": "qsheetItemTitle" },
				{ "columnname" : "예상방송", "datafield": "expectPrcsDurExl" },
				{ "columnname" : "예상누계", "datafield": "aggrTimeExl" },
				{ "columnname" : "기사", "datafield": "artclStatNm,artclKindNm,audFileCnt" },
				{ "columnname" : "스튜디오", "datafield": "stdioImg1,stdioImg2" },
				{ "columnname" : "영상", "datafield": "videoImg1,videoImg2,fileCnt" },
				{ "columnname" : "음향", "datafield": "sndImg1,sndImg2" },
				{ "columnname" : "DLP/PDP", "datafield": "dlpPdpImg" },
				{ "columnname" : "이펙트", "datafield": "effectId,effectKindCd,effectSubtl" },
				{ "columnname" : "영상상태", "datafield": "scrMainTransStat,scrBackTransStat" },
				{ "columnname" : "영상편집자", "datafield": "videoWorkers" },
				{ "columnname" : "그래픽편집자", "datafield": "grpWorkers" },
				{ "columnname" : "비고", "datafield": "note" }
			];

			var activeColumnNames = columnNames;

			var inactiveColumnNames = [
			];

			var dataAdapterLeft = new $.jqx.dataAdapter({
				localdata: inactiveColumnNames,
				datafields:
					[
						{ name: 'columnname', type: 'string' },
						{ name: 'datafield', type: 'string' }
					],
				datatype: "array"
			});

			var dataAdapterRight = new $.jqx.dataAdapter({
				localdata: activeColumnNames,
				datafields:
					[
						{ name: 'columnname', type: 'string' },
						{ name: 'datafield', type: 'string' }
					],
				datatype: "array"
			});

			var $leftGrid = $(".qsheet-colset-left-grid");
			var $rightGrid = $(".qsheet-colset-right-grid");

			var $colSetWindow = $("#colSetWindow");
			$colSetWindow.on("open", function() {
				dataAdapterLeft.setSource({
					localdata: inactiveColumnNames,
					datafields:
						[
							{ name: 'columnname', type: 'string' },
							{ name: 'datafield', type: 'string' }
						],
					datatype: "array"
				});

				dataAdapterRight.setSource({
					localdata: activeColumnNames,
					datafields:
						[
							{ name: 'columnname', type: 'string' },
							{ name: 'datafield', type: 'string' }
						],
					datatype: "array"
				});

				$leftGrid.jqxGrid({
					source: dataAdapterLeft
				});

				$rightGrid.jqxGrid({
					source: dataAdapterRight
				});
			});

			var rightGridInstance;
			var leftGridInstance;
			$colSetWindow.on("close", function(e) {
				if(e.args.dialogResult.OK) {
					leftGridInstance.clearselection(true, false);
					rightGridInstance.clearselection(true, false);
					// localdata에 저장한다.
					// TODO: 이 부분을 개인화를 위해 indexedDB나 remote DB에 저장해야한다.
					inactiveColumnNames = dataAdapterLeft.getrecords();
					activeColumnNames = dataAdapterRight.getrecords();

					// hidecolumn, showcolumn시 render가 호출되어 느려지지 않도록 beginupdata, endupdate로 감싼다.
					$jqxGrid.jqxGrid("beginupdate");

					$.each(inactiveColumnNames, function(i, obj) {
						var spt = obj.datafield.split(",");
						$.each(spt, function(j, v) {
							$jqxGrid.jqxGrid("hidecolumn", v);
						});
					});
					$.each(activeColumnNames, function(i, obj) {
						var spt = obj.datafield.split(",");
						$.each(spt, function(j, v) {
							$jqxGrid.jqxGrid("showcolumn", v);
						});
					});

					// TODO: activeColumnNames의 순서대로 columns를 재배열해야 한다.

					$jqxGrid.jqxGrid("endupdate");
				}
			});
			$colSetWindow.jqxWindow({
				autoOpen: false,
				height: 800, width: 700,
				closeAnimationDuration: 0,
				showAnimationDuration: 0,
				resizable: false, isModal: true, modalOpacity: 0.3,
				okButton: $('.qsheet-colset-btnok'), cancelButton: $('.qsheet-colset-btncancel'),
				initContent: function () {
					// 왼쪽 grid
					$leftGrid.jqxGrid({
						width: 250,
						height: 500,
						//editable: true,
						selectionmode: 'checkbox',
						columns: [
							{ text: '순번', datafield: 'id', align: 'center', cellsalign: 'center', width: 45, editable: false, cellsrenderer: cellsrendererOrder },
							{ text: '컬럼명', datafield: 'columnname', align: 'center', cellsalign: 'center', editable: false, width: 100 }
						]
					});

					// 오른쪽 grid
					$rightGrid.jqxGrid({
						width: 250,
						height: 500,
						//editable: true,
						selectionmode: 'checkbox',
						columns: [
							{ text: '순번', datafield: 'id', align: 'center', cellsalign: 'center', width: 45, editable: false, cellsrenderer: cellsrendererOrder },
							{ text: '컬럼명', datafield: 'columnname', align: 'center', cellsalign: 'center', editable: false, width: 100 }
						]
					});

					rightGridInstance = $rightGrid.data("jqxGrid").instance;
					leftGridInstance = $leftGrid.data("jqxGrid").instance;

					$(".qsheet-colset-btnleft").jqxButton({width: '30px', height: '30px'});
					$(".qsheet-colset-btnleft").on("click", function(e) {
						// right에 체크된 columnname을 left로 옮긴다.
						var selectedRowIndexes = rightGridInstance.getselectedrowindexes();
						if(selectedRowIndexes.length) {
							var i, value, rowid;
							var rowids = [];
							var rowdatas = [];
							for(i=0;i<selectedRowIndexes.length; i++) {
								value = rightGridInstance.getrowdata(selectedRowIndexes[i]);
								rowdatas.push(value);

								rowid = rightGridInstance.getrowid(selectedRowIndexes[i]);
								rowids.push(rowid);
							}

							leftGridInstance.addrow(null, rowdatas, 'last');
							rightGridInstance.deleterow(rowids);
							rightGridInstance.clearselection(true, false);
						}
					});

					$(".qsheet-colset-btnright").jqxButton({width: '30px', height: '30px'});
					$(".qsheet-colset-btnright").on("click", function(e) {
						// left에 체크된 columnname을 right로 옮긴다.
						var selectedRowIndexes = leftGridInstance.getselectedrowindexes();
						if(selectedRowIndexes.length) {
							var i, value, rowid;
							var rowids = [];
							var rowdatas = [];
							for(i=0;i<selectedRowIndexes.length; i++) {
								value = leftGridInstance.getrowdata(selectedRowIndexes[i]);
								rowdatas.push(value);

								rowid = leftGridInstance.getrowid(selectedRowIndexes[i]);
								rowids.push(rowid);
							}

							rightGridInstance.addrow(null, rowdatas, 'last');
							leftGridInstance.deleterow(rowids);
							leftGridInstance.clearselection(true, false);
						}
					});

					$('.qsheet-colset-btnok').jqxButton({ width: '65px' });
					$('.qsheet-colset-btncancel').jqxButton({ width: '65px' });
					$('.qsheet-colset-btnok').focus();
				}
			});
			$btnColSet.on("click", function() {
				$colSetWindow.jqxWindow("show");
			});
			
			/////////////////////////////////////////////////////////////
			// 3. 폰트크기 설정 드롭다운 생성
			$listFontSize.jqxDropDownList({
				source: [
					"13px",
					"15px",
					"17px",
					"19px",
					"21px"
				],
				selectedIndex: 0,
				width: 60,
				height: 20,
				dropDownHeight: 130
			});

			$listFontSize.on("change", function(e) {

				$jqxGrid.removeClass("qsheet-grid-fontsize-13 qsheet-grid-fontsize-15 qsheet-grid-fontsize-17 qsheet-grid-fontsize-19 qsheet-grid-fontsize-21");
				switch(e.args.index) {
					case 0: /* 13px */
						$jqxGrid.addClass("qsheet-grid-fontsize-13");
						$jqxGrid.jqxGrid({ rowsheight: 25, columnsheight: 25 });
						break;
					case 1: /* 15px */
						$jqxGrid.addClass("qsheet-grid-fontsize-15");
						$jqxGrid.jqxGrid({ rowsheight: 25, columnsheight: 25 });
						break;
					case 2: /* 17px */
						$jqxGrid.addClass("qsheet-grid-fontsize-17");
						$jqxGrid.jqxGrid({ rowsheight: 26, columnsheight: 26 });
						break;
					case 3: /* 19px */
						$jqxGrid.addClass("qsheet-grid-fontsize-19");
						$jqxGrid.jqxGrid({ rowsheight: 28, columnsheight: 28 });
						break;
					case 4: /* 21px */
						$jqxGrid.addClass("qsheet-grid-fontsize-21");
						$jqxGrid.jqxGrid({ rowsheight: 30, columnsheight: 30 });
						break;
				}
			});
		},
		initToDragRows: function() {
			var gridDragCells = this.$jqxGrid.find('.jqx-grid-cell-parentid');
			var jqxGridInstance = this.$jqxGrid.data("jqxGrid").instance;

			// initialize the jqxDragDrop plug-in. Set its drop target to the second Grid.
			gridDragCells.jqxDragDrop({ appendTo: 'body',  dragZIndex: 99999,
				//dropAction: 'none',
				dropTarget: '.qsheet-grid [role=row]',
				initFeedback: function (feedback) {
					var rowsindexes = jqxGridInstance.getselectedrowindexes();
					feedback.height(jqxGridInstance.rowsheight);
					feedback.width( 400 );  // drag&drop시 보이는 element의 width
					feedback.css('background', '#aaa');
				}
			});
		},
		initialize: function() {
			this.$el.html(this.template(this.model.attributes));
			this.initWidgets();
			this.getItems();
		},
		render: function() {
			return this;
		}
	});

    return QSheetView;
});
