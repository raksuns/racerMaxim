/*global define*/

define([
    'backbone',
	'templates'
], function (Backbone, JST) {
    'use strict';

	var KAKAView = Backbone.View.extend({
		template: JST['app/scripts/templates/KAKA.ejs'],
		
		getList: function(k, event) {
			var url = "http://10.30.23.22:8081/springrest/articlelist.json";
			// prepare the data
			var source =
			{
				data: {
					listItem: 'C004AAC'
				},
				datatype: "json",
				datafields: [
					{ name: 'ARTCL_ID', type: 'number' }
					, { name: 'ROW_NUM', type: 'number' }
					, { name: 'ARTCL_STAT_NM', type: 'string' }
					, { name: 'POSIT_DPT_NM', type: 'string' }
					, { name: 'RPTER_NM', type: 'string' }
					, { name: 'TITLE', type: 'string' }
					, { name: 'UPD_DTIME', type: 'date' }
					, { name: 'audioStat', type: 'string' }
					, { name: 'aprverNm', type: 'string' }
					, { name: 'aprvDtime', type: 'date' }
					, { name: 'CRT_DTIME', type: 'date' }
					, { name: 'EMBAGO_YN', type: 'string' }
					, { name: 'embagoEndDtime', type: 'date' }
					, { name: 'ALT_ODR', type: 'number' }
					, { name: 'artclModClassNm', type: 'string' }
					, { name: 'ARTCL_SE_NM', type: 'string' }
					, { name: 'artclTopClassNm', type: 'string' }
					, { name: 'ARTCL_UGCSTAT_NM', type: 'string' }
					, { name: 'cornerNm', type: 'string' }
					, { name: 'CRTOR_NM', type: 'string' }
					, { name: 'editorNm', type: 'string' }
					, { name: 'ONAIR_DT', type: 'date', format: 'yyyyMMdd' }
					, { name: 'reqStatNm', type: 'string' }
				],
				id: 'id',	// TODO: 'id'는 임시임. ARTCL_ID임.
				url: url,
				// 삭제
				deleterow: function ( rowid, done ) {
					$.ajax({
						type: 'get',
						url: 'http://10.30.23.22:8081/springrest/update/' + rowid + '.json'
					}).done(function(data) {
						// 삭제 후 ajax완료 후에 지운 것을 반영해야겠지?
						done( true );
					});
				}
			};
			
			var dataAdapter = new $.jqx.dataAdapter(source, {
				downloadComplete: function (data, status, xhr) {
					if(k === 'detail') {
						// 테스트를 위해 임시로 
						var ret = [];
						for(var i=0;i<100;i++) {
							ret = ret.concat(data['categoryList']);
						}
						return ret;
					}
					
					return data['categoryList'];
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
			
			var $jqxGrid = $el.find(".kaka-grid");
			var $GridContextMenu = $el.find(".kaka-menu");
			var $listHitAtc = $el.find(".kaka-list-hitatc");
			var $datePicker = $el.find(".kaka-datepicker");
			var $listLocalDpt = $el.find(".kaka-list-localdpt");
			var $listCrtorDpt = $el.find(".kaka-list-crtordpt");
			var $chkAprvYn = $el.find(".kaka-chk-aprvyn");
			var $srchCrtor = $el.find(".kaka-text-srchcrtor");
			var $title = $el.find(".kaka-text-title");
			var $chkEmbagoYn = $el.find(".kaka-chk-embagoyn");
			var $btnSearch = $el.find(".kaka-btn-search");
			var $btnDetail = $el.find(".kaka-btn-detail");
			var $btnColSet = $el.find(".kaka-btn-colset");
			var $btnExcelPrt = $el.find(".kaka-btn-excelprt");
			
			/////////////////////////////////////////////////////////////
			// 1. Grid 생성
		
			// Grid에서 사용하는 contextMenu 생성
			var contextMenu = $GridContextMenu.jqxMenu({ width: 200, height: 58, autoOpenPopup: false, mode: 'popup', animationShowDuration: 0, animationHideDuration: 0});
			$GridContextMenu.on('closed', function(e) {
				// menu가 사라지면 select도 제거한다.
				var rowIndex = $jqxGrid.jqxGrid('getselectedrowindex');
				$jqxGrid.jqxGrid('unselectrow', rowIndex);
			});
			
			// handle context menu clicks.
			$GridContextMenu.on('itemclick', function (event) {
				var args = event.args;
				var rowindex = $jqxGrid.jqxGrid('getselectedrowindex');
				
				if ($.trim($(args).text()) === "Edit Selected Row") {
				}
				else {
					var rowid = $jqxGrid.jqxGrid('getrowid', rowindex);
					$jqxGrid.jqxGrid('deleterow', rowid);
				}
			});

			/*
			$jqxGrid.on('contextmenu', function () {
				return false;
			});

			$jqxGrid.on('rowclick', function (event) {
				if (event.args.rightclick) {
					// 열려있는 popup을 먼저 닫는다.
					contextMenu.jqxMenu('close');

					$jqxGrid.jqxGrid('selectrow', event.args.rowindex);
					
					var scrollTop = $(window).scrollTop();
					var scrollLeft = $(window).scrollLeft();
					contextMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX, 10) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY, 10) + 5 + scrollTop);
					return false;
				}
			});
			*/

			var cellclassnameState = function(row, columnfield, value, bounddata) {
				var values = value.split('-');
				var iconName;
				if(values[0] === '단신') {
					iconName = 'icon-brief';
				}
				else if(values[0] === "리포트") {
					iconName = 'icon-report';
				}

				if(values[1] === '승인' || values[1] === '대체승인') {
					iconName = iconName + '-ok';
				}

				return "jqx-grid-cell-" + iconName;
			};

			var cellsrendererState = function (row, columnfield, value, defaulthtml, columnproperties) {
				var values = value.split('-');

				return '<div style="text-overflow: ellipsis; overflow: hidden; padding-bottom: 2px; text-align: center; margin-top: 5px;">' + values[2] +'</div>';
			};

			var cellsrendererOrder = function (row, columnfield, value, defaulthtml, columnproperties) {
				var rowscount = $jqxGrid.jqxGrid("getdatainformation").rowscount;
				return '<div style="text-overflow: ellipsis; overflow: hidden; padding-bottom: 2px; text-align: center; margin-top: 5px;">' + (rowscount - row) +'</div>';
			};

			$jqxGrid.jqxGrid(
			{
				width: "100%",
				height: 700,
				pagesize: 1000,
				sortable: true,
				localization: {
					emptydatastring: " "
				},
				showsortmenuitems: false,
				enabletooltips: true,
				columnsresize: true,
				columnsreorder: true,
				selectionmode: 'multiplerowsadvanced',
				columns: [
					{ text: '순번', align: 'center', cellsalign: 'center', datafield: 'ROW_NUM', enabletooltips: false, width: 45, cellclassname: 'jqx-grid-cell-order', cellsrenderer: cellsrendererOrder }
					, { text: '상태', align: 'center', cellsalign: 'center', datafield: 'ARTCL_STAT_NM', width: 55, minwidth: 55, maxwidth: 55, cellclassname: cellclassnameState, cellsrenderer: cellsrendererState }
					, { text: '부서', align: 'center', cellsalign: 'center', datafield: 'POSIT_DPT_NM', width: 60 }
					, { text: '제목', align: 'center', datafield: 'TITLE', width: 350 }
					, { text: '작성자', align: 'center', cellsalign: 'center', datafield: 'RPTER_NM', width: 55 }
					, { text: '수정일시', align: 'center', cellsalign: 'center', datafield: 'UPD_DTIME', width: 120, cellsformat: 'yy-MM-dd hh:mm' }
					, { text: '첨부', align: 'center', cellsalign: 'center', hidden: true, datafield: 'audioStat', width: 65 }
					, { text: '승인자', align: 'center', cellsalign: 'center', hidden: true, datafield: 'aprverNm', width: 65 }
					, { text: '승인일시', align: 'center', cellsalign: 'center', hidden: true, datafield: 'aprvDtime', width: 120, cellsformat: 'yy-MM-dd hh:mm' }
					, { text: '작성일시', align: 'center', cellsalign: 'center', datafield: 'CRT_DTIME', width: 120, cellsformat: 'yy-MM-dd hh:mm' }
					, { text: '엠바고여부', align: 'center', cellsalign: 'center', datafield: 'EMBAGO_YN', width: 55 }
					, { text: '엠바고종료일시', align: 'center', cellsalign: 'center', hidden: true, datafield: 'embagoEndDtime', width: 65, cellsformat: 'yy-MM-dd hh:mm' }
					, { text: '대체', align: 'center', cellsalign: 'center', datafield: 'ALT_ODR', width: 35 }
					, { text: '중분류', align: 'center', cellsalign: 'center', hidden: true, datafield: 'artclModClassNm', width: 45 }
					, { text: '구분', align: 'center', cellsalign: 'center', datafield: 'ARTCL_SE_NM', width: 65 }
					, { text: '대분류', align: 'center', cellsalign: 'center', hidden: true, datafield: 'artclTopClassNm', width: 65 }
					, { text: '등급', align: 'center', cellsalign: 'center', datafield: 'ARTCL_UGCSTAT_NM', width: 45 }
					, { text: '코너', align: 'center', cellsalign: 'center', hidden: true, datafield: 'cornerNm', width: 65 }
					, { text: '등록자', align: 'center', cellsalign: 'center', datafield: 'CRTOR_NM', width: 65 }
					, { text: '편집자', align: 'center', cellsalign: 'center', hidden: true, datafield: 'editorNm', width: 65 }
					, { text: '방송일', align: 'center', cellsalign: 'center', datafield: 'ONAIR_DT', width: 70, cellsformat: 'yy-MM-dd' }
					, { text: '편집요청상태', align: 'center', cellsalign: 'center', hidden: true, datafield: 'reqStatNm', width: 85 }
				]
			});

			$jqxGrid.on("rowsrendered", function(e) {
				self.initToDragRows();
			});

			/////////////////////////////////////////////////////////////
			// 2. Drag&Drop

			var $rowsdropline;
			var selector = "#" + this.el.id + " .jqx-grid-cell-order";
			var jqxGridInstance = $jqxGrid.data("jqxGrid").instance;
			$(document).on('dragStart', selector, function (event) {
				var value = $(this).text();
				var position = $.jqx.position(event.args);
				var cell = jqxGridInstance.getcellatposition(position.left, position.top);
				var rowsindexes = jqxGridInstance.getselectedrowindexes();

				var rows = [];
				var clickedrow = cell.row;
				var rowdata;
				for (var i = 0; i < rowsindexes.length; i++) {
					rowdata = jqxGridInstance.getrowdata(rowsindexes[i]);
					rows.unshift({
						qsheetItemTitle: rowdata.TITLE,
						rpterNm: rowdata.RPTER_NM
					});
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
							rows : rows
						}
					});
				}
			});

			var $qsheetGrid = $("#mainSplitterQsheetItem .qsheet-grid");
			var qsheetGridInstance = $qsheetGrid.data("jqxGrid").instance;

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
					var qsheetWindowPos = getWindowOffset($qsheetGrid[0]);

					var maxY = $qsheetGrid.height() - 15 + qsheetWindowPos.top;
					var minY = qsheetGridInstance.columnsheight * 2 + qsheetWindowPos.top;
					var maxX = $qsheetGrid.width() + qsheetWindowPos.left;
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

					// TODO: cur의 화면좌표를 찾아서 position.top을 대체하면 좀 더 정확하게 될까?
					var cell = qsheetGridInstance.getcellatposition(position.left, position.top);
					var targetrow = cell.row;
					var vScrollInstance, verticalscrollvalue, top;

					// 아래범위를 벗어남.
					if(maxY < curY) {
						feedback[0].style.top = maxY + 'px';
						vScrollInstance = qsheetGridInstance.vScrollInstance;
						verticalscrollvalue = vScrollInstance.value;
						top = parseInt(verticalscrollvalue, 10);
						vScrollInstance.setPosition(top + qsheetGridInstance.rowsheight);
					}
					else if(minY > curY) {    // 위범위를 벗어남.
						feedback[0].style.top = minY + 'px';
						vScrollInstance = qsheetGridInstance.vScrollInstance;
						verticalscrollvalue = vScrollInstance.value;
						top = parseInt(verticalscrollvalue, 10);
						vScrollInstance.setPosition(top - qsheetGridInstance.rowsheight);
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

						firstrow = qsheetGridInstance._findvisiblerow();
						visiblerow = (targetrow - firstrow);
						$row = $(".qsheet-grid .jqx-grid-content.jqx-widget-content > div > [role=row]").eq(visiblerow);
						if($row.length === 1) {
							$rowsdropline.css("top", $row[0].offsetTop);
						}
					}
					else {
						if(maxY < curY + 15) {
							$rowsdropline = $('<div style="z-index: 9999; width:100%; display: block; position: absolute; background-color:red;"></div>');
							$rowsdropline.height(5);
							$(".qsheet-grid .jqx-grid-content.jqx-widget-content > div").append($rowsdropline);

							firstrow = qsheetGridInstance._findvisiblerow();
							var rowscount = qsheetGridInstance.getdatainformation().rowscount;
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
					var qsheetWindowPos = getWindowOffset($qsheetGrid[0]);

					var maxY = $qsheetGrid.height() - 15 + qsheetWindowPos.top;
					var maxX = $qsheetGrid.width() + qsheetWindowPos.left;
					var minX = qsheetWindowPos.left;
					var curY = parseInt(feedback.css("top"), 10);
					var curX = parseInt(feedback.css("left"), 10);

					if(curX < minX || curX > maxX) {
						// 범위를 벗어났음.
						return;
					}

					var data = $(this).jqxDragDrop('data');
					jqxGridInstance.clearselection(false, false);
					$jqxGrid.find(".jqx-fill-state-pressed.jqx-grid-cell-selected").removeClass("jqx-fill-state-pressed jqx-grid-cell-selected");

					if(maxY < curY + 15) {
						qsheetGridInstance.addrow(null, data.rows.reverse(), 'last');
					}
					else {
						var cell = qsheetGridInstance.getcellatposition(position.left, position.top);
						if(cell !== null && cell !== true) {
							var targetrow = cell.row;

							qsheetGridInstance.addrow(null, data.rows, targetrow);
						}
					}
				}

				if($rowsdropline) {
					$rowsdropline.remove();
				}
			});


			/////////////////////////////////////////////////////////////
			// 2. 분류 DropDownList 생성
			$listHitAtc.jqxDropDownList({
				source: [
					"전체기사",
					"┗ 단신",
					"┗ 리포트",
					"┗ 녹취.제보.보고",
					"┗ 앵커멘트",
					"┗ 인터넷",
					"취재계획",
					"취재계획시트",
					"연합뉴스",
					"큐시트",
					"뉴스일람표",
					"영상"
				],
				selectedIndex: 0, width: '135', height: '20'});
			
			/////////////////////////////////////////////////////////////
			// 3. datePicker 생성
			$datePicker.jqxDateTimeInput({width: '100px', height: '20px', formatString: 'yyyy-MM-dd'});
			
			/////////////////////////////////////////////////////////////
			// 4. 지역 DropDownList 생성
			$listLocalDpt.jqxDropDownList({
				source: [
					"본사",
					"부산방송총국",
					"창원방송총국",
					"대구방송총국",
					"광주방송총국",
					"전주방송총국",
					"대전방송총국",
					"청주방송총국",
					"춘천방송총국",
					"제주방송총국"
				],
				selectedIndex: 0, width: '110', height: '20'
			});
			
			/////////////////////////////////////////////////////////////
			// 5. 지역 DropDownList 생성
			$listCrtorDpt.jqxDropDownList({
				checkboxes: true,
				source: [
					{ html: "<div style='padding: 1px;'><div>본사전체</div></div>", label: "본사전체", group:"All" },
					{ html: "<div style='padding: 1px;'><div>지역전체</div></div>", label: "지역전체", group:"All" },
					{ html: "<div style='padding: 1px;'><div>권역전체</div></div>", label: "권역전체", group:"All" },
					"취재계획",
					"정치외교부",
					"북한부",
					"경제부",
					"사회1부",
					"사회2부",
					"문화부",
					"과학·재난부",
					"네트워크부",
					"경인방송센터",
					"국제부1",
					"국제부2",
					"뉴스기획",
					"뉴스제작1부",
					"뉴스제작2부",
					"뉴스제작3부",
					"라디오뉴스제작부",
					"디지털뉴스부",
					"해설위원실",
					"보도위원실",
					"탐사제작부",
					"시사제작1부",
					"시사제작2부",
					"스포츠취재부",
					"선거방송기획단",
					"영상취재부",
					"영상특집부",
					"영상편집부",
					"보도그래픽부",
					"기타부서",
					"교육용부서"
				],
				width: '170', height: '20'
			});
			
			$listCrtorDpt.jqxDropDownList('checkIndex', 2);
			
			/////////////////////////////////////////////////////////////
			// 6. 승인여부 생성
			$chkAprvYn.jqxCheckBox({
				width: '80', height: '22'
			});
			
			/////////////////////////////////////////////////////////////
			// 7. 승인여부 생성
			$srchCrtor.jqxInput({
				placeHolder: "작성자",
				height: 20, width: 120
			});
			
			/////////////////////////////////////////////////////////////
			// 8. 기사제목 생성
			$title.jqxInput({
				placeHolder: "기사제목",
				height: 20, width: 120
			});
			
			/////////////////////////////////////////////////////////////
			// 9. 엠바고만 생성
			$chkEmbagoYn.jqxCheckBox({
				width: '80', height: '22'
			});
			
			/////////////////////////////////////////////////////////////
			// *. 조회 버튼 생성
			$btnSearch.jqxButton({}).on("click", _.bind(this.getList, this, 'search'));
			
			/////////////////////////////////////////////////////////////
			// *. 상세 버튼 생성
			$btnDetail.jqxButton({}).on("click", _.bind(this.getList, this, 'detail'));
			
			/////////////////////////////////////////////////////////////
			// *. 컬럼설정 버튼 생성
			$btnColSet.jqxButton({});
			
			/////////////////////////////////////////////////////////////
			// *. 엑셀 버튼 생성
			$btnExcelPrt.jqxButton({});
			
			this.$jqxGrid = $jqxGrid;
		},
		initToDragRows: function() {
			var gridDragCells = this.$jqxGrid.find('.jqx-grid-cell-order');
			var jqxGridInstance = this.$jqxGrid.data("jqxGrid").instance;

			// initialize the jqxDragDrop plug-in. Set its drop target to the second Grid.
			gridDragCells.jqxDragDrop({ appendTo: 'body',  dragZIndex: 99999,
				//dropAction: 'none',
				dropTarget: '.qsheet-grid [role=row]',
				initFeedback: function (feedback) {
					feedback.height(jqxGridInstance.rowsheight);
					feedback.width( 400 );  // drag&drop시 보이는 element의 width
					feedback.css('background', '#aaa');
				}
			});
		},
		initialize: function() {
			this.$el.html(this.template());
			this.initWidgets();
		},
		// render는 어떻게 활용할까?
		render: function() {
			return this;
		}
	});

    return KAKAView;
});
