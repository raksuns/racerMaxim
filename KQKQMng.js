
var clickRowId = 0;
var clickColNm = '';

// start dom ready.
$(function() {
// 화면접근권한
var auths = '${userAuths}';

// 큐시트ID
var qsheetId = '';

// 큐시트 뷰모드(디폴트: 마이뷰)
var choiceView = '';

// 뉴스일람표 큐시트전환 큐시트ID
var changeQsheetId = '';

// 큐시트유형ID
var qsheetTypeId = '';

// 사용자권한 authorCodeOne(편집 버튼권한 부여시 사용)
var authorCodeOne = '';

// 그리드 표시컬럼(마이뷰) 리스트
var showColumns = '';
var jsonShowColumns = cfn_convertJSON(showColumns);

// 그리드 그룹헤더(마이뷰) 리스트
var groupHeaders = '';
var jsonGroupHeaders = cfn_convertJSON(groupHeaders);

// 그리드 표시컬럼(전체뷰) 리스트
var allColumns = '$';
var jsonAllColumns = cfn_convertJSON(allColumns);

// 그리드 그룹헤더(전체뷰) 리스트
var groupAllHeaders = '';
var jsonGroupAllHeaders = cfn_convertJSON(groupAllHeaders);

// 전체뷰 표시권한
var authorAllView = '';

// 권한이 없을경우 전체뷰 비표시
if (authorAllView == false) {
	$('#choiceView_1').disableObj(true);
}

// DB컬럼
var customColModel = [
	{name:'delete',                label:'삭제',				width:'25',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:rowDelFormatter},
	{name:'qsheetItemOnairStatCd', label:'방송상태',			width:'55',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, edittype:'select', editoptions:{value:<f:gs first="" cid="B012"/>}},
	{name:'airEditor',             label:'앵커<br/>멘트',		width:'35',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:onAirEditorFormatter},
	{name:'rpterNm',               label:'리포터',			width:'45',  align:'center', hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'text', editrules:{maxlength:100}},
	{name:'qsheetItemKindCd',      label:'타입',			    width:'55',  align:'center', hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'select', editrules:{required:true}, editoptions:{value:<f:gs first="" cid="C012"/>}},
	{name:'qsheetItemTitle',       label:'아이템제목',			width:'380', align:'left',   hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'text', editrules:{maxlength:1000}, classes:'ellip'},
	{name:'expectPrcsDur',         label:'예상<br/>방송',		width:'60',  align:'center', hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'time_ms', editrules:{required:true}},
	{name:'aggrTime',              label:'예상<br/>누계',		width:'60',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, edittype:'time'},
	{name:'artclStatNm',           label:'상태',				width:'60',  align:'right',  hidden:false, sortable:false, editable:false, coercion:false},
	{name:'artclStat',             label:'링크',				width:'25',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_artclStat},
	{name:'audFileCnt',            label:'',	            width:'25',  align:'center', hidden:false, sortable:false, editable:false, coercion:false},
	{name:'stdioImg1',             label:'1',				width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'stdioImg2',             label:'2',				width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'fileCnt',               label:'파일',				width:'25',  align:'center', hidden:false, sortable:false, editable:false, coercion:false},
	{name:'videoImg1',             label:'1',				width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'videoImg2',             label:'2',				width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'sndImg1',               label:'1',				width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'sndImg2',               label:'2',				width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'dlpPdpImg',             label:'DLP<br/>/PDP',	width:'40',  align:'center', hidden:false, sortable:false, editable:false, coercion:false, formatter:imageFormatter_eventImg},
	{name:'note',                  label:'비고',				width:'200', align:'left',   hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'textarea', editrules:{maxlength:1000}},
	{name:'effectId',              label:'ID',				width:'60',  align:'center', hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'text', editrules:{maxlength:20}},
	{name:'effectKindCd',          label:'종류',				width:'45',  align:'center', hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'select', editoptions:{value:<f:gs first="" cid="B010"/>}},
	{name:'effectSubtl',           label:'서브',				width:'140',  align:'left',  hidden:false, sortable:false, editable:true,  coercion:true,  edittype:'textarea', editrules:{maxlength:25}, classes:'ellip'},
	{name:'scrMainTransStat',      label:'메인',				width:'55',  align:'center', hidden:false, sortable:false, editable:false, coercion:false},
	{name:'scrBackTransStat',      label:'백업',				width:'55',  align:'center', hidden:false, sortable:false, editable:false, coercion:false},
	{name:'videoWorkers',          label:'영상편집자',			width:'100', align:'center', hidden:false, sortable:false, editable:false, coercion:false},
	{name:'grpWorkers',            label:'그래픽편집자',		width:'100', align:'center', hidden:false, sortable:false, editable:false, coercion:false},
	{name:'stateFlag',             label:'상태',				width:'30',  align:'center', hidden:true,  sortable:false, editable:false},
	{name:'onairMentYn',           label:'멘트상태',			width:'55',  align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetItemId',          label:'큐시트아이템ID',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'copyQsheetItemId',      label:'COPY큐시트아이템ID',	width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetId',              label:'큐시트ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'artclId',               label:'기사ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:true},
	{name:'artclAltOdr',           label:'기사대체차수',		width:'30',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'altOdr',                label:'대체차수',			width:'30',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'groupId',               label:'그룹ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'newsgthPlanId',         label:'취재계획ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'artclKindCd',           label:'기사종류코드',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'updDtime',              label:'수정일시',			width:'135', align:'center', hidden:true,  sortable:false, editable:false, edittype:'date_hms'},
	{name:'qsheetItemTypeId',      label:'큐시트아이템유형ID',	width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetTypeId',          label:'큐시트유형ID',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'artclMediaLinkId',      label:'기사미디어링크ID(AUDIO)',	width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoArtclMediaLinkId', label:'기사미디어링크ID(편집원본)',	width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'mediaId',               label:'미디어ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetItemVideoId',     label:'큐시트아이템영상ID',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoId',               label:'영상ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'onairMentId',           label:'방송멘트ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditReqYn',        label:'영상편집요청여부',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditReqtrId',      label:'영상편집요청자ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditReqDtime',     label:'영상편집요청일시',			width:'100', align:'center', hidden:true,  sortable:false, editable:false,  edittype:'date'},
	{name:'videoEditAsignrId',     label:'영상편집배정자ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditWorkerId1',    label:'영상편집작업자ID1',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditWorkerId2',    label:'영상편집작업자ID2',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'realPrcsDur',           label:'방송시간',				width:'80',  align:'center', hidden:true,  sortable:false, editable:true,  edittype:'time_ms'},
	{name:'artclStatCd',           label:'기사상태코드',			width:'60',  align:'center', hidden:true,  sortable:false, editable:false},
	{name:'stdioCd1',              label:'약물1',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'stdioCd2',              label:'약물2',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'videoCd1',              label:'약물1',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'videoCd2',              label:'약물2',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'sndCd1',                label:'약물1',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'sndCd2',                label:'약물2',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'dlpPdpCd',              label:'DLP<br/>/PDP',		width:'40',  align:'center', hidden:true,  sortable:false, editable:true}
];

var myViewColModel = [
	{name:'stateFlag',             label:'상태',					width:'30',  align:'center', hidden:true,  sortable:false, editable:false},
	{name:'onairMentYn',           label:'멘트상태',				width:'55',  align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetItemId',          label:'큐시트아이템ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'copyQsheetItemId',      label:'COPY큐시트아이템ID',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetId',              label:'큐시트ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'artclId',               label:'기사ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:true},
	{name:'artclAltOdr',           label:'기사대체차수',			width:'30',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'altOdr',                label:'대체차수',				width:'30',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'groupId',               label:'그룹ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'newsgthPlanId',         label:'취재계획ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'artclKindCd',           label:'기사종류코드',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'updDtime',              label:'수정일시',				width:'135', align:'center', hidden:true,  sortable:false, editable:false, edittype:'date_hms'},
	{name:'qsheetItemTypeId',      label:'큐시트아이템유형ID',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetTypeId',          label:'큐시트유형ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'artclMediaLinkId',      label:'기사미디어링크ID(AUDIO)', 	width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoArtclMediaLinkId', label:'기사미디어링크ID(편집원본)',	width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'mediaId',               label:'미디어ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'qsheetItemVideoId',     label:'큐시트아이템영상ID',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoId',               label:'영상ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'onairMentId',           label:'방송멘트ID',				width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditReqYn',        label:'영상편집요청여부',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditReqtrId',      label:'영상편집요청자ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditReqDtime',     label:'영상편집요청일시',			width:'100', align:'center', hidden:true,  sortable:false, editable:false,  edittype:'date'},
	{name:'videoEditAsignrId',     label:'영상편집배정자ID',			width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditWorkerId1',    label:'영상편집작업자ID1',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'videoEditWorkerId2',    label:'영상편집작업자ID2',		width:'100', align:'center', hidden:true,  sortable:false, editable:false},
	{name:'realPrcsDur',           label:'방송시간',				width:'80',  align:'center', hidden:true,  sortable:false, editable:true,  edittype:'time_ms'},
	{name:'artclStatCd',           label:'기사상태코드',			width:'60',  align:'center', hidden:true,  sortable:false, editable:false},
	{name:'stdioCd1',              label:'약물1',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'stdioCd2',              label:'약물2',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'videoCd1',              label:'약물1',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'videoCd2',              label:'약물2',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'sndCd1',                label:'약물1',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'sndCd2',                label:'약물2',					width:'40',  align:'center', hidden:true,  sortable:false, editable:true},
	{name:'dlpPdpCd',              label:'DLP<br/>/PDP',			width:'40',  align:'center', hidden:true,  sortable:false, editable:true}
];

// 전체뷰 편집여부 설정
$.each(jsonAllColumns, function(i, cm) {
	for(var i = 0; i < customColModel.length; i++) {
		// 디폴트컬럼과 DB설정 컬럼이름이 같을경우
		if (cm.name == customColModel[i].name) {
			if (cm.editable == 'Y') {
				if (customColModel[i].formatter || customColModel[i].coercion == false) {
					customColModel[i].active = true;
					customColModel[i].editable = false;
				}
				else {
					customColModel[i].editable = true;
				}
			}
			else {
				customColModel[i].editable = false;
			}
		}
	}
});

// 마이뷰 설정
$.each(jsonShowColumns, function(i, cm) {
	for(var i = 0; i < customColModel.length; i++) {
		// 전체컬럼과 DB설정 컬럼이름이 같을경우
		if (cm.name == customColModel[i].name) {
			myViewColModel.push(customColModel[i]);
		}
	}
});

// 마이뷰일경우 그리드 표시컬럼에 필수컬럼을 설정하지 않았을경우 강제로 추가한다.
if (choiceView == "C035MYV") {
	$.each(customColModel, function(i, cm) {
		var custom = customColModel[i];
		var isValid = false;

		for(var i =0; i < jsonShowColumns.length; i++) {
			// 디폴트컬럼과 DB설정 컬럼이름이 같을경우
			if (jsonShowColumns[i].name == cm.name) {
				isValid = true;
			}
		}

		if (isValid == false) {
			// 방송상태컬럼설정
			if (cm.name == 'qsheetItemOnairStatCd') {
				custom.hidden = true;
				myViewColModel.push(custom);
			}
			// 타입컬럼설정
			if (cm.name == 'qsheetItemKindCd') {
				custom.hidden = true;
				myViewColModel.push(custom);
			}
			// 예상방송컬럼설정
			if (cm.name == 'expectPrcsDur') {
				custom.hidden = true;
				myViewColModel.push(custom);
			}
			// 예상누계컬럼설정
			if (cm.name == 'aggrTime') {
				custom.hidden = true;
				myViewColModel.push(custom);
			}
			// 아이템제목컬럼설정
			if (cm.name == 'qsheetItemTitle') {
				custom.hidden = true;
				myViewColModel.push(custom);
			}
		}
	});
}

/* --------------------------------------------------------------------------------------
 * Configures Grid : 큐시트 신규 작성
 * -------------------------------------------------------------------------------------- */
if (choiceView == "C035MYV") {
	// 마이뷰일경우
	fn_createBasicGrid(myViewColModel, jsonGroupHeaders);
}
else {
	// 전체뷰일경우
	fn_createBasicGrid(customColModel, jsonGroupAllHeaders);
}


// TODO KBS : 기본 체크 사항...
// 큐시트ID가 있는 경우
if (qsheetId) {
	// 초기 조회
	fn_KQKQMngSearchM1();	// 마스터
	fn_KQKQMngSearchD1();   // 리스트

	// 편집여부 권한이 있으경우만 호출
	var authorEditingYn = '';
	if (authorEditingYn == true) {
		// 편집요청 호출
		$('#wid_btn_req_edit').trigger('click');
	}

	// (2013.07.19) 배소정, 웹푸시 사용 경우만 연결토록 조건 추가
	if (IS_WEBPUSH_QSHEET == true) {
		// 웹푸시 소켓 연결
		fn_connectWebPush(qsheetId);
	}
}
// 큐시트전환
else {
	// 뉴스일람표 큐시트ID가 있을경우(큐시트전환:뉴스일람표 -> 큐시트)
	if (changeQsheetId) {
		// 기본팝업 호출
		$('#wid_btn_bas').trigger('click');

		/* sjhan 큐시트 마스터 저장 시 아이템리스트 동시 저장 처리로 변경
		 fn_KQKQMngSearchD1();   // 리스트
		 */
	}
	// 큐시트유형ID가 있을경우(큐시트전환:큐시트유형 -> 큐시트)
	else if(qsheetTypeId) {
		// 기본팝업 호출
		$('#wid_btn_bas').trigger('click');

		/* sjhan 큐시트 마스터저장시 아이템리스트 동시저장 처리로 변경
		 fn_KQKQMngSearchD1();   // 리스트
		 */
	}
	// 큐시트 신규작성
	else {
		// 기본팝업 호출
		$('#wid_btn_bas').trigger('click');
	}
}


// 큐시트아이템 타입 툴팁 설정
function fn_QsheetItemKindCd_cellattr(rowId, cv, rd, cm) {
	var attr = '';
	// Blank
	if (cm.name == 'qsheetItemKindCd') {
		if (cv == ' ') {
			attr = 'title='+ 'Blank';
		}
		else {
			attr = 'title='+ cv;
		}
	}
	return attr;
}

// 약물아이콘 툴팁 설정
function fn_KQKQMng_cellattr(rowId, cv, rd, cm) {
	var attr = '';
	attr = 'title=' + $("#" + cv).attr('alt');
	return attr;
}

// 기사링크
function imageFormatter_artclStat(cellvalue, options) {
	if (options.colModel.active == true) {
		return '<img id="printpage" src="<c:url value="/common/images/btn_search_17px.gif"/>" onclick="fn_artclIdLinkOpen('+options.rowId+');">';
	}
	else {
		return '<img id="printpage" src="<c:url value="/common/images/btn_search_17px.gif"/>">';
	}
}

// 행삭제
function rowDelFormatter(cellvalue, options) {
	if (options.colModel.active == true) {
		return '<img src="/common/images/btn/btn_del.gif" alt="삭제" onclick="fn_KQKQMngDeleteMngD1(' + options.rowId + ');">';
	}
	else {
		return '<img src="/common/images/btn/btn_del.gif" alt="삭제">';
	}
}

/**
 * 약물아이콘
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {string}
 */
function imageFormatter_eventImg(cellvalue, options, rowObject) {
	var cn = options.colModel.name;
	var cv = rowObject[cn.replace('Img', 'Cd')];

	// 약물정보 아이콘ID가 있을경우
	if (cv) {
		cellvalue = cv;
	}
	var src = '';
	var alt = '';
	var imgObj = $("#" + cellvalue);
	if (imgObj.length > 0) {
		src = $("#" +  cellvalue).attr('src');
		alt = $("#" + cellvalue).attr('alt');
	}
	return '<img id="printpage" src="'+ src + '" title="' + alt + '">';
}

/**
 * 방송용 편집 에디터
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {string}
 */
function onAirEditorFormatter(cellvalue, options, rowObject) {
	var onairMentYn = rowObject.onairMentYn;  // 멘트상태
	if (onairMentYn == undefined) {
		onairMentYn = $('#wid_d1VO').getCell(options.rowId, 'onairMentYn');
	}

	// 멘트상태가 N 멘트수정전 일경우
	if (onairMentYn == "N") {
		if (options.colModel.active == true) {
			return '<img src="/common/images/btn/btn_ment.gif" alt="앵커멘트" onclick="fn_KQKQMng_OnAirEditor('
				+ options.rowId + ');" onmouseover="imgOver(this);" onmouseout="imgOut(this);">';
		}
		else {
			return '<img src="/common/images/btn/btn_ment.gif" alt="앵커멘트" onmouseover="imgOver(this);" onmouseout="imgOut(this);">';
		}
	}
	// 멘트상태가 Y 멘트수정후, 큐시트방송상태가 방송완료(B011OEN)가 아닌경우
	if (onairMentYn == "Y") {
		if (options.colModel.active == true) {
			return '<img src="/common/images/btn/btn_ment_on.gif" alt="앵커멘트" onclick="fn_KQKQMng_OnAirEditor('
				+ options.rowId + ');" onmouseover="imgOver(this);" onmouseout="imgOut(this);">';
		}
		else {
			return '<img src="/common/images/btn/btn_ment_on.gif" alt="앵커멘트" onmouseover="imgOver(this);" onmouseout="imgOut(this);">';
		}
	}
}

//     // 영상편집요청
//     function vdoEditFormatter(cellvalue, options, rowObject) {
//         return '<img src="/common/images/btn/btn_cut.png" alt="요청" onclick="fn_KQKQMng_VdoEdit(' + options.rowId + ');" onmouseover="imgOver(this);" onmouseout="imgOut(this);">';
//     }

// 상단 큐시트 기본정보 버튼
$('#wid_btn_bas').click(function() {
	// 편집여부체크 호출
	var checkData = fn_checkEditing();
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();             // 큐시트ID
	var rpsPgmCd = $('#wid_m1VO input[name=rpsPgmCd]').val();             // 대표프로그램
	var qsheetTypeId = $('#wid_m1VO input[name=qsheetTypeId]').val();     // 큐시트유형ID
	var changeQsheetId = $('#wid_m1VO input[name=changeQsheetId]').val(); // 뉴스일람표 큐시트전환 큐시트ID
	var authorEditingYn = checkData.isEditingYn;                             // 편집여부 권한
	var moveScreenNm = $('#wid_m1VO input[name=moveScreenNm]').val();     // 선택이동화면구분

	cfn_popupLayer({
		id: 'KQKQQSheetBasic',
		pid: 'wid',
		url: '<c:url value="/kq/kq/KQKQQSheetBasic/init.do"/>',
		title: '큐시트 기본정보',
		param: {
			qsheetId : qsheetId,
			rpsPgmCd : rpsPgmCd,
			qsheetTypeId : qsheetTypeId,
			changeQsheetId : changeQsheetId,
			authorEditingYn : authorEditingYn,
			moveScreenNm:moveScreenNm
		},
		width: 600,
		height: 450,
		remove: true,
		beforeClose: function(e) {
			if (!qsheetId) {
				cfn_popupWindowClose('wid');
			}
		},
		callback: function(data) {
			// 데이터 전체 맵핑시
			$('#wid_m1VO').dataToForm(data);

			// 편집여부 권한이 있으경우만 호출
			if (authorEditingYn == true) {
				// 편집요청 호출
				$('#wid_btn_req_edit').trigger('click');
			}

			// (2013.07.19) 배소정, 신규저장 경우만 수행토록 조건 추가
			if (!qsheetId && IS_WEBPUSH_QSHEET == true) {
				// 웹푸시 소켓 연결
				fn_connectWebPush(data.qsheetId);
			}
		}
	});
});

/**
 * 상단 행추가 버튼
 */
$('#wid_btn_add').click(function() {
	// 편집여부체크 호출
	var checkData = fn_checkEditing();

	// 편집여부가 false일 경우 행추가 처리불가
	if (!checkData.isEditingYn) {
		alert('현재 편집중인 사용자가 있어 편집을 할 수 없습니다.' +
			'\n\n편집 사용자: ' + checkData.editSsnNm +
			'\n편집 시작시간: ' + checkData.editStartDtime);
	}
	else {
		$('#wid_btn_add').disableObj(true);
		var grid = $('#wid_d1VO');
		var addRows = new Array();
		var addRowCnt = Number($('#wid_m1VO input[name=addRowCnt]').val());			// 행추가수
		var qsheetItemKindCd = $('#wid_m1VO select[name=qsheetItemKindCd]').val();	// 타입

		// 단신일경우 리포터 MC 자동설정
		var rpterNm = '';   // 리포터

		// 약물정보
		var stdioImg1 = ''; // 스튜디오약물이미지1
		var stdioCd1 = '';  // 스튜디오약물코드1
		var videoImg1 = ''; // 비디오약물이미지1
		var videoCd1 = '';  // 비디오약물코드1
		var sndImg1 = '';   // 오디오약물이미지1
		var sndCd1 = '';    // 오디오약물코드1

		// 아이템 리스트에 타입[END]에 순번 취득
		var endRowId = grid.getFindRowId({
			qsheetItemKindCd:'C012END'
		});

		// 리스트에 타입[END]이 있을 경우
		if (endRowId > -1) {
			// 큐시트 아이템 종류코 드 END(C012END)일 경우 추가 불가
			if (qsheetItemKindCd == 'C012END') {
				alert('타입을 추가할수 없습니다. \n아이템리스트에 [END]타입이 존재합니다.');

				// 블락 해재처리
				$.unblockUI();
				$('#wid_btn_add').disableObj(false);
				return;
			}
		}

		// 행 추가 개수가 50보다 클때
		if (addRowCnt > 50) {
			alert("50건이상 추가할수 없습니다.");
			$('#wid_m1VO input[name=addRowCnt]').val(50);
			$('#wid_m1VO input[name=addRowCnt]').focus();
			// 블락 해재처리
			$.unblockUI();
			$('#wid_btn_add').disableObj(false);
			return;
		}

		for(var i = 0; i < addRowCnt; i++) {
			// 타입이 단신일경우
			if (qsheetItemKindCd == "C012ABR") {
				rpterNm = "MC";       // 리포터(MC)
				stdioImg1 = 'STST02'; // 스튜디오약물이미지1(남앵커원샷)
				stdioCd1 = 'STST02';  // 스튜디오약물코드1
				videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
				videoCd1 = 'VDVC01';  // 비디오약물코드1
				sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
				sndCd1 = 'MSMC01';    // 오디오약물코드1
			}
			// 타입이 리포트일경우
			else if (qsheetItemKindCd == "C012ARP") {
				stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
				stdioCd1 = 'STST04';  // 스튜디오약물코드1
				videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
				videoCd1 = 'VDVC01';  // 비디오약물코드1
				sndImg1 = 'MSEQ05';   // 오디오약물이미지1(VCR)
				sndCd1 = 'MSEQ05';    // 오디오약물코드1
			}
			// 타입이 Opening일경우
			else if (qsheetItemKindCd == "C012OPN") {
				stdioImg1 = 'STST01'; // 스튜디오약물이미지1(앵커투샷)
				stdioCd1 = 'STST01';  // 스튜디오약물코드1
				videoImg1 = 'VDEQ03'; // 비디오약물이미지1(CM)
				videoCd1 = 'VDEQ03';  // 비디오약물코드1
				sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
				sndCd1 = 'MSMC01';    // 오디오약물코드1
			}
			// 타입이 시각고지일경우
			else if (qsheetItemKindCd == "C012TNT") {
				sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
				sndCd1 = 'MSMC01';    // 오디오약물코드1
			}
			// 타입이 헤드라인일경우
			else if (qsheetItemKindCd == "C012HDL") {
				videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
				videoCd1 = 'VDVC01';  // 비디오약물코드1
				sndImg1 = 'MSEQ05';   // 오디오약물이미지1(VCR)
				sndCd1 = 'MSEQ05';    // 오디오약물코드1
			}
			// 타입이 타이틀일경우
			else if (qsheetItemKindCd == "C012TTL") {
				videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
				videoCd1 = 'VDVC01';  // 비디오약물코드1
				sndImg1 = 'MSEQ05';   // 오디오약물이미지1(VCR)
				sndCd1 = 'MSEQ05';    // 오디오약물코드1
			}
			// 타입이 날씨일경우
			else if (qsheetItemKindCd == "C012WTH") {
				stdioImg1 = 'STST13'; // 스튜디오약물이미지1(크로마키)
				stdioCd1 = 'STST13';  // 스튜디오약물코드1
				videoImg1 = 'VDRW04'; // 비디오약물이미지1(기상CG)
				videoCd1 = 'VDRW04';  // 비디오약물코드1
				sndImg1 = 'MSMC06';   // 오디오약물이미지1(날씨)
				sndCd1 = 'MSMC06';    // 오디오약물코드1
			}
			// 타입이 출연일경우
			else if (qsheetItemKindCd == "C012APP") {
				stdioImg1 = 'STST14'; // 스튜디오약물이미지1(출연)
				stdioCd1 = 'STST14';  // 스튜디오약물코드1
				videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
				videoCd1 = 'VDVC01';  // 비디오약물코드1
				sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
				sndCd1 = 'MSMC01';    // 오디오약물코드1
			}
			// 타입이 전화일경우
			else if (qsheetItemKindCd == "C012PHO") {
				stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
				stdioCd1 = 'STST04';  // 스튜디오약물코드1
				videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
				videoCd1 = 'VDVC01';  // 비디오약물코드1
				sndImg1 = 'MSEQ02';   // 오디오약물이미지1(TEL)
				sndCd1 = 'MSEQ02';    // 오디오약물코드1
			}
			// 타입이 중계차일경우
			else if (qsheetItemKindCd == "C012OBV") {
				stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
				stdioCd1 = 'STST04';  // 스튜디오약물코드1
				videoImg1 = 'VDFS01'; // 비디오약물이미지1(중계차)
				videoCd1 = 'VDFS01';  // 비디오약물코드1
				sndImg1 = 'MSEQ10';   // 오디오약물이미지1(FS)
				sndCd1 = 'MSEQ10';    // 오디오약물코드1
			}
			// 타입이 네트워크일경우
			else if (qsheetItemKindCd == "C012NET") {
				stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
				stdioCd1 = 'STST04';  // 스튜디오약물코드1
				videoImg1 = 'VDFS05'; // 비디오약물이미지1(지역)
				videoCd1 = 'VDFS05';  // 비디오약물코드1
				sndImg1 = 'MSEQ10';   // 오디오약물이미지1(FS)
				sndCd1 = 'MSEQ10';    // 오디오약물코드1
			}
			// 타입이 Closing
			else if (qsheetItemKindCd == "C012CLS") {
				stdioImg1 = 'STST01'; // 스튜디오약물이미지1(앵커투샷)
				stdioCd1 = 'STST01';  // 스튜디오약물코드1
//              videoImg1 = '';       // 비디오약물이미지1(없음)
//              videoCd1 = '';        // 비디오약물코드1
				sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
				sndCd1 = 'MSMC01';    // 오디오약물코드1
			}

			addRows.push({
				qsheetItemKindCd: qsheetItemKindCd,   // 타입
				realPrcsDur: '0000',                  // 실제방송시간
				expectPrcsDur: '0000',                // 예상방송시간
				onairMentYn: 'N',                     // 멘트상태
				rpterNm:rpterNm,                      // 리포터
				stdioImg1: stdioImg1,                 // 스튜디오약물이미지1
				stdioCd1: stdioCd1,                   // 스튜디오약물코드1
				videoImg1: videoImg1,                 // 비디오약물이미지1
				videoCd1: videoCd1,                   // 비디오약물코드1
				sndImg1: sndImg1,                     // 오디오약물이미지1
				sndCd1: sndCd1                        // 오디오약물코드1
			});
		}

		// 큐시트아이템 추가처리
		var selrow = grid.getGridParam('selrow');
		var position = 'after';
		if (!selrow) {
			position = 'first';
		}
		fn_KQKQMngAppendMngD1(addRows, position, selrow);
	}
});

// 큐시트 유형저장 팝업
$('#wid_btn_go_typeSave').click(function() {
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val(); // 큐시트ID
	var rowData = $('#wid_d1VO').getGridParam('records');     // 전체 건수 취득
	var qsheetItemId = $('#wid_d1VO').getCol('qsheetItemId'); // 큐시트아이템ID

	// 큐시트ID가 없을경우
	if(!qsheetId) {
		alert("기본정보가 없습니다. \n기본정보 저장후 사용해주세요.");
		return;
	}

	// 아이템 리스트에 타입[END]에 순번 취득
	var endRowId = $('#wid_d1VO').getFindRowId({qsheetItemKindCd:'C012END'});

	// 리스트에 타입[END]가 없을경우
	if (endRowId == -1) {
		alert('아이템리스트에 [END]타입이 없습니다. \n [END]타입을 추가해주세요.');
		return;
	}

	cfn_popupLayer({
		id: 'KQKQQSheetTypeSave',
		pid: 'wid',
		url: '<c:url value="/kq/kq/KQKQQSheetTypeSave/init.do"/>',
		title: '큐시트 유형저장',
		param: {qsheetId:qsheetId},
		width: 500,
		height: 450
	});
});

// 저장
$('#wid_btn_save').click(function() {
	// 버튼구분(전송버튼: btnSend, 저장버튼:btnSave, 승인:btnAprv)
	var btnGubn = $('#wid_m1VO input[name=btnGubn]').val('btnSave');
	fn_KQKQMngSaveMngD1();
});

// 전송
$('#wid_btn_send').click(function() {
	// 버튼구분(전송버튼: btnSend, 저장버튼:btnSave, 승인:btnAprv)
	var btnGubn = $('#wid_m1VO input[name=btnGubn]').val('btnSend');
	fn_KQKQMngSaveMngD1();
});

// 승인
$('#wid_btn_aprv').click(function() {
	fn_KQKQMngAprvM1();
});

// 큐시트 작성창 닫기
$('#wid_btn_cancel').click(function() {
	cfn_popupWindowClose('wid');
});

// 약물이미지 클릭 이벤트 (스튜디오, 영상, 음향, DLP/PDP)
$('#wid_view1, #wid_view2, #wid_view3, #wid_view4').find('img').click(function() {

	var divId = $(this).closest('div').attr('id');    // 선택한 랩퍼ID
	var imgId = $(this).attr('id');                   // 선택한 이미지ID
	var imgCode = $(this).attr('code');               // 선택한 이미지코드
	var imgNm = $(this).attr('alt');                  // 선택한 이미지코드명

	// 선택정보 로컬저장
	$('#' + divId).data('imgSelectInfo', {
		imgId: imgId,
		imgCode: imgCode,
		imgNm: imgNm
	});

	// 팝업닫기
	cfn_popupLayerClose({
		id: divId,
		remove: false,
		beforeClose : function(){
			// 그리드 셀에 이미지 아이콘 및 코드 셋팅
			var nm = clickColNm.substr(0, clickColNm.indexOf('Img'));
			var seq = clickColNm.substr(clickColNm.indexOf('Img') + 3);

			if (imgCode) {
				$('#wid_d1VO').setCell(clickRowId, clickColNm, imgId, {}, {title:imgNm});
				$('#wid_d1VO').setCell(clickRowId, nm + 'Cd' + seq, imgCode);
				$('#wid_d1VO').setCell(clickRowId, nm + 'Nm' + seq, imgNm);
			}
			else {
				$('#wid_d1VO').setCell(clickRowId, clickColNm, '', {}, {title:''});
				$('#wid_d1VO').setCell(clickRowId, nm + 'Cd' + seq, '');
				$('#wid_d1VO').setCell(clickRowId, nm + 'Nm' + seq, '');
			}

			// 큐시트아이템 수정처리
			/* 약물정보 변경시 웹푸시 제외 요청사항 sjhan 2013.08.23*/
			fn_KQKQMngUpdateMngD1(clickRowId, nm);
		}
	});
});

// 인쇄버튼 클릭시 인쇄패턴 팝업출
$('#wid_btn_prt').click(function() {
	// 팝업 호출
	cfn_popupLayer({
		id: 'wid_movePrint',
		title: '인쇄 선택',
		width: 500,
		height: 180,
		remove: false,
		open: function() {
		}
	});
});

// 인쇄패턴선택 팝업 닫기
$('#wid_movePrint_btn_cancel').click(function(){
	cfn_popupLayerClose({
		id : 'wid_movePrint',
		remove:false,
		beforeClose : function(e) {}
	});
});

// jckim print type에 따른 pattern 선택 필드 활성/비활성화
$('#wid_movePrint input[name=printType]').change(function(e) {
	var printType = $(this).val();
	if (printType == "qsheet") {
		$('div.qsheetPattern', '#wid_movePrint').show();
	}
	else {
		$('div.qsheetPattern', '#wid_movePrint').hide();
	}
});


// 인쇄패턴선택 팝업 확인
$('#wid_movePrint_btn_ok').click(function(){
	cfn_popupLayerClose({
		id : 'wid_movePrint',
		remove: false,
		beforeClose : function(e) {
			// 큐시트아이템 순번 정렬
			ajaxRequest({
				url: '<c:url value="/kq/kq/KQKQMng/updateQsheetItemSeqNo.do"/>',
				param: {qsheetId:qsheetId},
				showMessage:false,
				warningMessage:false,
				confirmMessage: false,
				callback: function(status, resData) {
					if (status == 'success') {
						var choiceView = $('#wid_m1VO input[name=choiceView]:checked').val();
						fn_refreshChoiceView(choiceView);
					}
				}
			});

			// 인쇄처리
			var printType = $('#wid_movePrint [name=printType]:checked').val();
			switch(printType) {
				case "qsheet":
					fn_print_htmlView();
					break;
				case "article":
				case "ancherment":
					fn_wid_printAll(printType);
					break;
			}
		}
	});
});

// 썸네일
$('#wid_btn_thumbnail').click(function() {
	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();
	// 썸네일 팝업 호출
	cfn_popupWindow({
		url      : '<c:url value="/kq/kq/KQKQThumbnailView/init.do"/>',
		param    : {qsheetId:qsheetId},
		width    : 1025,
		height   : 630,
		modal    : false,
		resize   : true,
		reload   : true,
		windowNm : 'KQKQThumbnailView',
		callback : function(data) {
		}
	});
});

// 새로고침
$('#wid_btn_refresh').click(function() {
	// 큐시트아이템 순번 정렬
	ajaxRequest({
		url: '<c:url value="/kq/kq/KQKQMng/updateQsheetItemSeqNo.do"/>',
		param: {qsheetId:qsheetId},
		showMessage: false,
		warningMessage: false,
		confirmMessage: false,
		callback: function(status, resData) {
			if (status == 'success' && resData.status == 'success') {
				var choiceView = $('#wid_m1VO input[name=choiceView]:checked').val();
				fn_refreshChoiceView(choiceView);
			}
		}
	});
});

// 편집요청
$('#wid_btn_req_edit').click(function() {
	var isEdit = false;
	ajaxRequest({
		url: '<c:url value="/kq/kq/KQKQMng/requestQsheetEditorInfo.do"/>',
		async: false,
		showMessage: false,
		searchMaster: {
			id: 'wid_m1VO'
		},
		callback: function(status, data) {
			if (!data) return;
			if (data.status !== 'success') {
				var res = data.resultData;

				// 같은 사용자인 경우
				if (res.editorId == '${userInfo.userId}') {
					return;
				}

				if (confirm(data.serviceMessage +
					'\n\n편집 사용자: ' + res.editSsnNm +
					'\n편집 시작시간: ' + res.editStartDtime +
					'\n\n그래도, 편집권한을 강제로 요청하시겠습니까?')) {

					// 새로고침
					$('#wid_btn_refresh').trigger('click');

					// 편집사용자 업데이트
					ajaxRequest({
						url: '<c:url value="/kq/kq/KQKQMng/updateQsheetEditorInfo.do"/>',
						async: false,
						showMessage: false,
						searchMaster: {
							id: 'wid_m1VO'
						},
						callback: function(status, data) {
							if (!data) return;
							if (data.status == 'success') {
								// 전체 드래그 가능여부
								var draggableCheck = true;
								// 편집가능 상태로 변경처리
								fn_draggableCheck(draggableCheck);
							}
							else {
								//var res = data.resultData;
							}
						}
					});

					// =========================================================================
					// 갱신할 컨테이너 Get(큐시트 조회화면의 재검색 처리)
					var refreshContainers = opener.fn_getListContainerIdsByContKind('tab11');
					$.each(refreshContainers, function (i){
						eval("opener.fn_" +refreshContainers[i]+"_searchKQKQQsheetInquire()" );
					});
				}
			}
		}
	});
});

// 뷰모드를 변경 했 을 경우(마이뷰, 전체뷰)
$('#wid_m1VO input[name=choiceView]').change(function() {
	var choiceView = $(this).val();
	fn_refreshChoiceView(choiceView);
});


// 순번컬럼 선택시 편집 컬럼 닫기
$('#wid_d1VO').find('td[role=gridcell][aria-describedby$=rn]').live({
	mouseover: function() {
		$('#wid_d1VO').gridEditClose();
	}
});

// jckim
MY_QSHEET_GRID = $('#wid_d1VO');

}); // FIXME end of dom ready.

// 일괄인쇄
function fn_wid_printAll(choicePrint) {

	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();        // 큐시트ID
	var gridRecords = $('#wid_d1VO').getGridParam('records');        // 레코드수
	var gridData = $('#wid_d1VO').getGridParam('data');              // 그리드 데이터
	var onairDt  = $('#wid_m1VO input[name=onairDt]').val();
	var title = $('#wid_m1VO input[name=title]').val();
	var crtorDptNm = $('#wid_m1VO input[name=crtorDptNm]').val();
	var onairMentIds = new Array();
	var artclIds = new Array();
	var qsheetItemIds = new Array();

	// 그리드 데이터가 있을경우
	if (gridRecords > 0) {

		// 앵커멘트 일괄인쇄일경우
		if (choicePrint == "ancherment") {
			$.each(gridData, function() {
				// 방송멘트ID가 있을경우
				if (this.onairMentId) {
					qsheetItemIds.push(this.qsheetItemId); // 큐시트아이템[]ID
				}
			});

			var qsheetItemId = qsheetItemIds.join(',');  // 큐시트아이템ID

			ajaxRequest({
				url: '<c:url value="/kq/kq/KQKQMng/selectOnairMentData.do"/>',
				param: {
					qsheetId: qsheetId,
					qsheetItemId: qsheetItemId
				},
				callback: function(status, data) {
					if (data) {
						var rows = data.rows;
						$div = $(document.createElement('div'));
						var printScrollAreaHtml = '';

						$.each(rows, function(i){
							printScrollAreaHtml += '<div class="pagebreak anchor">';
							printScrollAreaHtml += '<div class="qallprint" style="white-space:inherit;">';
							printScrollAreaHtml += '<p>';
							printScrollAreaHtml += this.qsheetItemTitle;
							printScrollAreaHtml += '</p>';
							printScrollAreaHtml += '</div>';
							printScrollAreaHtml += '<div id="scrollArea_'+i+'" style="white-space:inherit;" class="ynews_box" >'
							printScrollAreaHtml += this.mentText;
							printScrollAreaHtml += '</div>';
							printScrollAreaHtml += '</div>';
						});

						$div.append(printScrollAreaHtml);

						var tmpTitle = $('title:first').text();
						$('title:first').text(onairDt+ " " + title + " " + crtorDptNm);

						// 인쇄실행
						$div.printArea();

						setTimeout(function(){
							$('title:first').text(tmpTitle);
							$('iframe[id^=printArea_]').remove();
						}, 200);
					}
				}
			});
		}
		// 기사 일괄인쇄일경우
		else if(choicePrint == "article") {
			$.each(gridData, function() {
				// 기사ID가 있을경우
				if (this.artclId) {
					artclIds.push(this.artclId);           // 기사[]ID
					qsheetItemIds.push(this.qsheetItemId); // 큐시트아이템[]ID
				}
			});

			// 기사ID로 데이터 조회
			var artclId = artclIds.join(',');              // 기사ID
			var qsheetItemId = qsheetItemIds.join(',');    // 큐시트아이템ID
			ajaxRequest({
				async: false,
				url: '<c:url value="/kq/kq/KQKQMng/selectArtclData.do"/>',
				param: {
					artclId: artclId,
					qsheetId: qsheetId,
					qsheetItemId: qsheetItemId

				},
				callback: function(status, data) {
					if (data) {
						var rows = data.rows;
						$div = $(document.createElement('div'));
						var printScrollAreaHtml = '';

						$.each(rows, function(i){
							// 단신
							if (this.artclKindCd == 'C011ABR') {
								printScrollAreaHtml += '<div class="pagebreak">';
								printScrollAreaHtml += '<div class="masterinfo">';
								printScrollAreaHtml += '<p>';
								printScrollAreaHtml += '[' + this.artclKindNm + ' ' + this.altOdr + ']' + this.qsheetItemTitle;
								printScrollAreaHtml += '</p>';
								printScrollAreaHtml += '<p class="mi3"><span>' + this.crtDtime + '</span><span>' + this.aprvDtime + '</span><span>' + this.aprverNm + '</span></p>';
								printScrollAreaHtml += '<p class="mi2"><span>' + this.positDptNm + '</span><span>' + this.crtorNm + '</span></p>';
								printScrollAreaHtml += '<p class="mi2"><span>' + this.picInfoNm + '</span><span>' + '엠바고 : ' + this.embagoEndDtime + '</span></p>';
								printScrollAreaHtml += '</div>';
								printScrollAreaHtml += '<div id="scrollArea_' + i + '" style="white-space:pre-wrap;" class="col1_write" >';
								printScrollAreaHtml += this.mentText;
								printScrollAreaHtml += '</div>';
								printScrollAreaHtml += '</div>';
							}
							// 리포트
							else {
								printScrollAreaHtml += '<div class="pagebreak">';
								printScrollAreaHtml += '<div class="masterinfo">';
								printScrollAreaHtml += '<p>';
								printScrollAreaHtml += '[' + this.artclKindNm + ' ' + this.altOdr + ']' + this.qsheetItemTitle;
								printScrollAreaHtml += '</p>';
								printScrollAreaHtml += '<p class="mi3"><span>' + this.crtDtime + '</span><span>' + this.aprvDtime + '</span><span>' + this.aprverNm + '</span></p>';
								printScrollAreaHtml += '<p class="mi2"><span>' + this.positDptNm + '</span><span>' + this.crtorNm + '</span></p>';
								printScrollAreaHtml += '<p class="mi2"><span>' + this.picInfoNm +'</span><span>'+'엠바고 : ' + this.embagoEndDtime + '</span></p>';
								printScrollAreaHtml += '</div>';
								printScrollAreaHtml += '<div class="col2bg">';
								printScrollAreaHtml += '<div id="scrollArea_' + i + '" style="white-space:pre-wrap;" class="col2" >';
								printScrollAreaHtml += this.mentText;
								printScrollAreaHtml += '</div>';
								printScrollAreaHtml += '</div>';
								printScrollAreaHtml += '</div>';
							}
						});

						$div.append(printScrollAreaHtml);
						$div.find('.removePrint').remove();
						$div.find('.isScrollPrint').remove();

						var canvas = $div.find('canvas');

						$.each(canvas, function(){

							var superNum = $(this).closest('div[role=super]').attr('seq');
							if (!superNum) {
								var superImg = '<img src="/common/editor/images/ticon_s0.png" alt="슈퍼" style="display:block; padding-right:5px;" />';
							}
							else {
								var superImg = '<img src="/common/editor/images/ticon_s' + superNum + '.png" alt="슈퍼" style="display:block; padding-right:5px;" />';
							}

							$(this).after(superImg);
							$(this).remove();
						});


						var tmpTitle = $('title:first').text();
						$('title:first').text(onairDt + " " + title + " " + crtorDptNm);

						// 인쇄실행
						$div.printArea({
							popTitle : '큐시트'
						});

						setTimeout(function(){
							$('title:first').text(tmpTitle);
							$('iframe[id^=printArea_]').remove();
						}, 200);
					}
				}
			});
		} // end Artcl
	}
	else {
		alert('인쇄할 데이터가 없습니다.');
	}
}

// 그리드 생성
var clickTimeout = null;
function fn_createBasicGrid(colModel, groupHeaders) {
	// 그리드 파기
	$('#wid_d1VO').GridUnload();

	// 그리드 생성
	$('#wid_d1VO').createBasicGrid({
		colModel      : colModel,
		rowNum        : 200,
		height        : 490,
		sortable      : false,
		rownumbers    : true,
		multiexecute  : true ,
		cellEdit      : true,
		widthBase     : 'wid_m1VO',
		heightBase    : 'KQKQMng',
		heightOffset  : -174,
		datatype      : 'local',
		searchUrl     : '<c:url value="/kq/kq/KQKQMng/selectD1.do"/>',
		gridview      : false,

		afterInsertRow: function(rowId, rowData, rowElem) {
			// TODO: 조회후 처리하는 곳이랑 확인하여 한쪽은 제거
			// 아이템 상태처리
			fn_KQKQMngStatusD1(rowId, rowData);
		},

		loadComplete  : function() {
			// 전체 드래그 가능여부
			var draggableCheck = 'draggableCheck';

			// 드래그 가능여부 체크
			fn_draggableCheck(draggableCheck);

			// 그리드 리사이징
//            setTimeout(function() {
			$('#wid_d1VO').autoGridSize();
//            },0);
		},

		onCellSelect : function(rowId, iCol, colNm){
			var rowData = $('#wid_d1VO').getRowData(rowId);  // 행데이터
			var fileCnt = rowData.fileCnt;                      // 파일수
			var audFileCnt = rowData.audFileCnt;                // 오디오파일수

			// 순번클릭시 행배경색 선택처리
			if (colNm == 'rn') {
				$('#wid_d1VO').find('tr#'+rowId).removeClass('ui-state-hover').addClass('ui-state-highlight');
			}

			// 파일수가 0이상일경우
			if (colNm == 'fileCnt') {

				if (fileCnt > 0) {
					var artclId = rowData.artclId;                  // 기사ID
					// 기사ID가 있을경우
					if (artclId) {
						// 큐시트에서 기사영상팝업 호출시 구분자 설정
						var gubun = 'qModeVideo';

						//  기사영상보기 팝업호출
						fn_KQKQMng_KCTCVideoViewOpen(rowId, gubun);
					}
					// 기사ID가 없을경우
					else {
						//영상보기 팝업호출
						fn_KQKQMng_KQKQVideoViewOpen(rowId);
					}
				}
				else {
					alert('영상자료가 없습니다.');
				}
			}

			// 오디오파일수가 0이상일경우
			if (colNm == 'audFileCnt') {

				if (audFileCnt > 0) {

					// 큐시트에서 기사오디오듣기 팝업 호출시 구분자 설정
					var gubun = 'qModeAudio';

					//  기사오디오듣기 팝업호출
					fn_KQKQMng_KCTCVideoViewOpen(rowId, gubun);
				}
				else {
					alert('오디오자료가 없습니다.');
				}
			}

			// 원문기사보기 팝업
			if (colNm == 'artclStatNm') {

				var artclStatNm = rowData.artclStatCd; // 기사상 코드
				var printYn = "N";                     // 프린트유무

				// 기사상태명이 보류가 아닌경우 원문기사 팝업호출
				if (artclStatNm != "C010HLD") {
					fn_KQKQMng_originalRptView(rowId, printYn);
				}
			}

			// 약물셀일 경우 마지막에 선택한 이미지가 있으면 설정
			if ($('#wid_d1VO').getGridParam('colModel')[iCol].active == true) {
				var divId = '';

				// 스튜디오
				if (colNm == 'stdioImg1' || colNm == 'stdioImg2') {
					divId = 'view1';
				}
				// 영상
				else if (colNm == 'videoImg1' || colNm == 'videoImg2') {
					divId = 'view2';
				}
				// 음향
				else if(colNm == 'sndImg1' || colNm == 'sndImg2') {
					divId = 'view3';
				}
				// DLP/PDP
				else if (colNm == 'dlpPdpImg') {
					divId = 'view4';
				}

				if (divId) {
					var imgSelectInfo = $('#wid_' + divId).data('imgSelectInfo');
					// jckim 현재 아이템과 동일할 경우 저장하지 않음
					if (imgSelectInfo && imgSelectInfo.imgId != $('#wid_d1VO').getCell(rowId, colNm)) {
						// 그리드 셀에 이미지 아이콘 및 코드 셋팅
						var nm = colNm.substr(0, colNm.indexOf('Img'));
						var seq = colNm.substr(colNm.indexOf('Img') + 3);

//                        setTimeout(function() {
						if (imgSelectInfo.imgCode) {
							$('#wid_d1VO').setCell(rowId, colNm, imgSelectInfo.imgId, {}, {title:imgSelectInfo.imgNm});
							$('#wid_d1VO').setCell(rowId, nm + 'Cd' + seq, imgSelectInfo.imgCode);
							$('#wid_d1VO').setCell(rowId, nm + 'Nm' + seq, imgSelectInfo.imgNm);
						}
						else {
							$('#wid_d1VO').setCell(rowId, colNm, '', {}, {title:''});
							$('#wid_d1VO').setCell(rowId, nm + 'Cd' + seq, '');
							$('#wid_d1VO').setCell(rowId, nm + 'Nm' + seq, '');
						}
//                        },0);

//                        clickTimeout = setTimeout(function() {
						// 큐시트아이템 수정처리
						/* 약물정보 변경시 웹푸시제외 요청사항 sjhan 2013.08.23*/
						fn_KQKQMngUpdateMngD1(rowId, nm);
//                        },800);
					}
				}
			}
		},

		ondblClickCell : function(rowId, iRow, iCol, colNm, e) {

			// 약물편집 활성화 여부확인
			if ($('#wid_d1VO').getGridParam('colModel')[iCol].active == true) {

				// 원클릭 이벤트 중지
				if (clickTimeout) {
					clearTimeout(clickTimeout);
				}

				// 약물셀일 경우 이미지선택 팝업열기
				// 스튜디오
				if (colNm == 'stdioImg1' || colNm == 'stdioImg2') {
					fn_ImgViewOpen('view1', rowId, colNm);
				}
				// 영상
				else if (colNm == 'videoImg1' || colNm == 'videoImg2') {
					fn_ImgViewOpen('view2', rowId, colNm);
				}
				// 음향
				else if(colNm == 'sndImg1' || colNm == 'sndImg2') {
					fn_ImgViewOpen('view3', rowId, colNm);
				}
				// DLP/PDP
				else if (colNm == 'dlpPdpImg') {
					fn_ImgViewOpen('view4', rowId, colNm);
				}
			}
		},

		afterEditCell : function(rowId, colNm, value, iRow, iCol) {
			if (colNm == 'qsheetItemKindCd') {
				oldValue = value;
			}
		},

		afterSaveCell : function(rowId, colNm, value, iRow, iCol) {
			var rowData = $('#wid_d1VO').getRowData(rowId);      // 행데이터
			var gridData = $('#wid_d1VO').getGridParam('data');  // 그리드데이터
			var qsheetItemKindCd = rowData.qsheetItemKindCd;        // 큐시트아이템타입

			if (colNm == 'expectPrcsDur') {
				var _expectPrcsDur = rowData.expectPrcsDur;          // 예상방송시간
				var expectPrcsDur = _expectPrcsDur.replace(/:/gi,"");

				// 예상방송시간 입력값을 방송시간에 설정
				$('#wid_d1VO').setCell(rowId, 'realPrcsDur', expectPrcsDur);

				// 예상누계 설정
				fn_setAggrTime();
			}

			/**/
			// 타입컬럼을 변경할경우(기사아이디가 있을경우 기사종류조회후 단신일경우 리포트 변경 불가, 리포트일경우 단신 변경불가 그외 변경가능)
			if (colNm == 'qsheetItemKindCd') {
				fn_setAggrTime();

				// 약물정보
				var stdioImg1 = rowData.stdioImg1; // 스튜디오약물이미지1
				var stdioCd1 = rowData.stdioCd1;   // 스튜디오약물코드1
				var videoImg1 = rowData.videoImg1; // 비디오약물이미지1
				var videoCd1 = rowData.videoCd1;   // 비디오약물코드1
				var sndImg1 = rowData.sndImg1;     // 오디오약물이미지1
				var sndCd1 = rowData.sndCd1;       // 오디오약물코드1

				// 타입이 단신일경우
				if (qsheetItemKindCd == "C012ABR") {
					stdioImg1 = 'STST02'; // 스튜디오약물이미지1
					stdioCd1 = 'STST02';  // 스튜디오약물코드1
					videoImg1 = 'VDVC01'; // 비디오약물이미지1
					videoCd1 = 'VDVC01';  // 비디오약물코드1
					sndImg1 = 'MSMC01';   // 오디오약물이미지1
					sndCd1 = 'MSMC01';    // 오디오약물코드1

					// jckim 리포터를 MC로 지정
					$('#wid_d1VO').setCell(rowId, 'rpterNm', "MC");
				}
				// 타입이 리포트일경우
				else if (qsheetItemKindCd == "C012ARP") {
					stdioImg1 = 'STST04'; // 스튜디오약물이미지1
					stdioCd1 = 'STST04';  // 스튜디오약물코드1
					videoImg1 = 'VDVC01'; // 비디오약물이미지1
					videoCd1 = 'VDVC01';  // 비디오약물코드1
					sndImg1 = 'MSEQ05';   // 오디오약물이미지1
					sndCd1 = 'MSEQ05';    // 오디오약물코드1
				}
				// 타입이 Opening일경우
				else if (qsheetItemKindCd == "C012OPN") {
					stdioImg1 = 'STST01'; // 스튜디오약물이미지1(앵커투샷)
					stdioCd1 = 'STST01';  // 스튜디오약물코드1
					videoImg1 = 'VDEQ03'; // 비디오약물이미지1(CM)
					videoCd1 = 'VDEQ03';  // 비디오약물코드1
					sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
					sndCd1 = 'MSMC01';    // 오디오약물코드1
				}
				// 타입이 시각고지일경우
				else if (qsheetItemKindCd == "C012TNT") {
					stdioImg1 = '';       // 스튜디오약물이미지1(없음)
					stdioCd1 = '';        // 스튜디오약물코드1
					videoImg1 = '';       // 비디오약물이미지1(없음)
					videoCd1 = '';        // 비디오약물코드1
					sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
					sndCd1 = 'MSMC01';    // 오디오약물코드1
				}
				// 타입이 헤드라인일경우
				else if (qsheetItemKindCd == "C012HDL") {
					stdioImg1 = '';       // 스튜디오약물이미지1(없음)
					stdioCd1 = '';        // 스튜디오약물코드1
					videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
					videoCd1 = 'VDVC01';  // 비디오약물코드1
					sndImg1 = 'MSEQ05';   // 오디오약물이미지1(VCR)
					sndCd1 = 'MSEQ05';    // 오디오약물코드1
				}
				// 타입이 타이틀일경우
				else if (qsheetItemKindCd == "C012TTL") {
					stdioImg1 = '';       // 스튜디오약물이미지1(없음)
					stdioCd1 = '';        // 스튜디오약물코드1
					videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
					videoCd1 = 'VDVC01';  // 비디오약물코드1
					sndImg1 = 'MSEQ05';   // 오디오약물이미지1(VCR)
					sndCd1 = 'MSEQ05';    // 오디오약물코드1
				}
				// 타입이 날씨일경우
				else if (qsheetItemKindCd == "C012WTH") {
					stdioImg1 = 'STST13'; // 스튜디오약물이미지1(크로마키)
					stdioCd1 = 'STST13';  // 스튜디오약물코드1
					videoImg1 = 'VDRW04'; // 비디오약물이미지1(기상CG)
					videoCd1 = 'VDRW04';  // 비디오약물코드1
					sndImg1 = 'MSMC06';   // 오디오약물이미지1(날씨)
					sndCd1 = 'MSMC06';    // 오디오약물코드1
				}
				// 타입이 출연일경우
				else if (qsheetItemKindCd == "C012APP") {
					stdioImg1 = 'STST14'; // 스튜디오약물이미지1(출연)
					stdioCd1 = 'STST14';  // 스튜디오약물코드1
					videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
					videoCd1 = 'VDVC01';  // 비디오약물코드1
					sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
					sndCd1 = 'MSMC01';    // 오디오약물코드1

				}
				// 타입이 전화일경우
				else if (qsheetItemKindCd == "C012PHO") {
					stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
					stdioCd1 = 'STST04';  // 스튜디오약물코드1
					videoImg1 = 'VDVC01'; // 비디오약물이미지1(VCR)
					videoCd1 = 'VDVC01';  // 비디오약물코드1
					sndImg1 = 'MSEQ02';   // 오디오약물이미지1(TEL)
					sndCd1 = 'MSEQ02';    // 오디오약물코드1
				}
				// 타입이 중계차일경우
				else if (qsheetItemKindCd == "C012OBV") {
					stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
					stdioCd1 = 'STST04';  // 스튜디오약물코드1
					videoImg1 = 'VDFS01'; // 비디오약물이미지1(중계차)
					videoCd1 = 'VDFS01';  // 비디오약물코드1
					sndImg1 = 'MSEQ10';   // 오디오약물이미지1(FS)
					sndCd1 = 'MSEQ10';    // 오디오약물코드1
				}
				// 타입이 네트워크일경우
				else if (qsheetItemKindCd == "C012NET") {
					stdioImg1 = 'STST04'; // 스튜디오약물이미지1(남앵커오른쪽어꺠걸이)
					stdioCd1 = 'STST04';  // 스튜디오약물코드1
					videoImg1 = 'VDFS05'; // 비디오약물이미지1(지역)
					videoCd1 = 'VDFS05';  // 비디오약물코드1
					sndImg1 = 'MSEQ10';   // 오디오약물이미지1(FS)
					sndCd1 = 'MSEQ10';    // 오디오약물코드1
				}
				// 타입이 Closing
				else if (qsheetItemKindCd == "C012CLS") {
					stdioImg1 = 'STST01'; // 스튜디오약물이미지1(앵커투샷)
					stdioCd1 = 'STST01';  // 스튜디오약물코드1
					videoImg1 = '';       // 비디오약물이미지1(없음)
					videoCd1 = '';        // 비디오약물코드1
					sndImg1 = 'MSMC01';   // 오디오약물이미지1(MC)
					sndCd1 = 'MSMC01';    // 오디오약물코드1
				}

				// 기본 약물 설정
				$('#wid_d1VO').setCell(rowId, 'stdioImg1', stdioImg1);
				$('#wid_d1VO').setCell(rowId, 'stdioCd1', stdioCd1);
				$('#wid_d1VO').setCell(rowId, 'videoImg1', videoImg1);
				$('#wid_d1VO').setCell(rowId, 'videoCd1', videoCd1);
				$('#wid_d1VO').setCell(rowId, 'sndImg1', sndImg1);
				$('#wid_d1VO').setCell(rowId, 'sndCd1', sndCd1);
			}
			// 큐시트아이템 수정처리
			fn_KQKQMngUpdateMngD1(rowId);
		},

		beforeSaveCell: function(rowId, colNm, value, iRow, iCol) {

			var rowData = $('#wid_d1VO').getRowData(rowId);      // 행데이터
			var onairMentId = rowData.onairMentId;                  // 방송멘트ID
			var qsheetItemKindCd = rowData.qsheetItemKindCd;        // 변경전 큐시트타입

			// 타입컬럼을 변경할경우
			if (colNm == 'qsheetItemKindCd') {

				var qsheetItemKindCd = rowData.qsheetItemKindCd;        // 큐시트아이템타입
				var artclId = rowData.artclId;                          // 기사ID
				var onairMentId = rowData.onairMentId;                  // 방송멘트ID

				// 아이템 리스트에 타입[END]에 순번 취득
				var endRowId = $('#wid_d1VO').getFindRowId({qsheetItemKindCd:'C012END'});

				// 리스트에 타입[END]이 있을경우
				if (endRowId > -1) {
					// 큐시트아이템종류코드 END(C012END)일경우 변경불가
					if (value == 'C012END') {
						alert('타입을 변경할수 없습니다. \n아이템리스트에 [END]타입이 존재합니다.');
						return false;
					}
				}

				// jckim 기사 종류에 따른 체크
				if (artclId) {
					var artclKindCd = rowData.artclKindCd;
					// 리포트일경우
					if (artclKindCd == 'C011ARP' && value == 'C012ABR') {
						alert('단신 타입으로 변경할수 없습니다. \n리포트기사가 링크되어 있습니다.');
						return false;
					}
					// 앵커멘트
					if (artclKindCd == 'C011AMN' && value == 'C012ABR') {
						alert('단신 타입으로 변경할수 없습니다. \n리포트기사가 링크되어 있습니다.');
						return false;
					}
				}
				else {
					// 앵커멘트ID가 있을경우
					if (onairMentId) {
						if (value == 'C012ABR') {
							alert('단신 타입으로 변경할수 없습니다. \n리포트기사가 링크되어 있습니다.');
							return false;
						}
					}
				}
			}
		},

		validEditCell  : function(rowid, cname, value) {
			var rowData = $('#wid_d1VO').getRowData(rowid);                              // 행데이터
			var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드
			var qsheetItemKindCd = rowData.qsheetItemKindCd;                                // 타입
			var artclId = rowData.artclId;                                                  // 기사ID

			// 큐시트마스터 방송상태가 방송완료(B011OEN)일경우 컬럼편집모드 불가능으로 처리
			if (qsheetOnairStatCd == 'B011OEN') {
				return false;
			}

			// 타입컬럼을 변경할경우
			if (cname == 'qsheetItemKindCd') {
				// 큐시트아이템종류코드[END(C012END)]일경우 변경불가
				if (qsheetItemKindCd == "C012END") {
					return false;
				}
				/* 기사아이디가 있을경우 기사종류조회후 단신일경우  변경 불가, 리포트일경우 단신 변경불가 그외 변경가능*/
				else if (artclId) {
					if (qsheetItemKindCd == "C012ABR") {
						return false;
					}
				}
			}
			return true;
		},
		propsEnd      : null
	});

	// 헤더병합
	var choiceView = $('#wid_m1VO input[name=choiceView]').val();
	if (choiceView == "C035MYV") {
		// 마이뷰일경우
		$('#wid_d1VO').setGroupHeaders({
			useColSpanStyle: true,
			groupHeaders: groupHeaders
		});
	}
	else {
		// 전체뷰일경우
		$('#wid_d1VO').setGroupHeaders({
			useColSpanStyle: true,
			groupAllHeaders: groupHeaders
		});
	}

	// 그리드에 컨텍스트 메뉴설정.
	$("#wid_d1VO").contextMenu({
		menu: '#wid_contextMenuMng',
		beforeshow : function(els) {
			$(els.target).setSelection(els.tr.id);
		},
		callback: {
			// 연계정보보기
			'btn_right_linkItem': function(els, pos) {

				var rowId = els.tr.id;                              // 선택행ID
				var rowData = $('#wid_d1VO').getRowData(rowId);  // 행데이터
				var groupId = rowData.groupId;                      // 그룹ID
				var groupItemId = rowData.qsheetItemId;             // 그룹아이템ID

				// 그룹ID가 없을경우
				if(!groupId) {
					alert('연계정보가 없습니다.');
					return;
				}

				cfn_popupLayer({
					id: 'KNKNLinkItemView',
					pid: 'wid',
					url: '<c:url value="/kn/kn/KNKNLinkItemView/init.do"/>',
					title: '연계정보보기',
					param: {groupId : groupId,
						groupItemId : groupItemId},
					width: 600,
					height: 450
				});
			},
			// 영상보기
			'btn_right_movie': function(els, pos) {
				var rowId = els.tr.id;                              // 선택행ID
				var rowData = $('#wid_d1VO').getRowData(rowId);  // 행데이터
				var artclId = rowData.artclId;                      // 기사ID
				var fileCnt = rowData.fileCnt;                      // 파일수

				// 파일수가 0이상일경우
				if (fileCnt > 0) {
					// 기사ID가 있을경우
					if (artclId) {
						// 우클릭으로 영상보기 선택시
						var gubun = 'qModeAV';

						//  기사영상보기 팝업호출
						fn_KQKQMng_KCTCVideoViewOpen(rowId, gubun);
					}
					// 기사ID가 없을경우
					else {
						//영상보기 팝업호출
						fn_KQKQMng_KQKQVideoViewOpen(rowId);
					}
				}
				else {
					alert('관련 영상자료가 없습니다.');
				}
			},

			// 영상편집요청
			'btn_right_movie_edit': function(els, pos) {
				var rowId = els.tr.id;                              // 선택행ID

				// 영상편집요청
				fn_KQKQMng_VdoEdit(rowId);
			},
			// 방송멘트편집 에디터
			'btn_right_writement': function(els, pos) {
				var rowId = els.tr.id;                              // 선택행ID
				var printYn = "N";                                  // 프린트유무

				// 방송멘트 편집 에디터호출
				fn_KQKQMng_OnAirEditor(rowId, printYn);
			},
			// 원문기사보기
			'btn_right_vieworig': function(els, pos) {
				var rowId = els.tr.id;                              // 선택행ID
				var rowData = $('#wid_d1VO').getRowData(rowId);  // 행데이터
				var artclStatCd  = rowData.artclStatCd ;            // 기사상코드
				var printYn = "N";                                  // 프린트유무

				// 기사상태가 보류가 아닌경우 원분기사 호출
				if (artclStatCd != "C010HLD") {
					// 원문기사보기 팝업
					fn_KQKQMng_originalRptView(rowId, printYn);
				}
			},
			// 삭제
			'btn_right_delete': function(els, pos) {
				// 선택행ID
				var rowId = els.tr.id;

				// active설정값 취득
				var active = $('#wid_d1VO').getColProp('delete').active;

				// 삭제 가능한권한
				if (active == true) {
					// 삭제호출
					fn_KQKQMngDeleteMngD1(rowId);

				} else {
					alert('삭제 권한이없습니다.');
				}
			},
			// 기사 인쇄
			'btn_right_go_print1': function(els, pos) {
				var rowId = els.tr.id;                              // 선택행ID
				var rowData = $('#wid_d1VO').getRowData(rowId);  // 행데이터
				var artclStatCd  = rowData.artclStatCd ;            // 기사상코드
				var printYn = "Y";                                  // 프린트유무

				// 기사상태가 보류가 아닌경우 원분기사 호출
				if (artclStatCd != "C010HLD") {
					// 원문기사보기 팝업
					fn_KQKQMng_originalRptView(rowId, printYn);
				}
			},
			// 앵커멘트 인쇄
			'btn_right_go_print2': function(els, pos) {
				var rowId = els.tr.id;                              // 선택행ID
				var printYn = "Y";                                  // 프린트유무

				// 방송멘트 편집 에디터호출
				fn_KQKQMng_OnAirEditor(rowId, printYn);
			},
			// 기사대체차수 확인
			'btn_right_check': function(els, pos) {
				var rowId = els.tr.id;                                     // 선택행ID
				var rowData = $('#wid_d1VO').getRowData(rowId);         // 행데이터
				var artclAltOdr = rowData.artclAltOdr;                     // 기사대체차수
				var altOdr = rowData.altOdr;                               // 대체차수
				var qsheetId = rowData.qsheetId;                           // 큐시트ID
				var qsheetItemId = rowData.qsheetItemId;                   // 큐시트아이템ID
				var qsheetItemOnairStatCd = rowData.qsheetItemOnairStatCd; // 큐시트아이템방송상태

				// 대체차수가 같을경우
				if (artclAltOdr == altOdr) {
					alert('큐시트기사대차차수(' + artclAltOdr  + ')와 기사대체차수(' + altOdr + ')가 일치합니다.');
				}
				else {
					// 대체차수가 다른경우 기사대체차수를 큐시트기사대체차수에 UPDATE한다
					alert('큐시트기사대차차수(' + artclAltOdr  + ')와 기사대체차수(' + altOdr + ')가 일치하지않습니다.\n 대체차수를 맵핑하겠습니다.');
					$('#wid_d1VO').setCell(rowId, 'artclAltOdr', altOdr);

					// 큐시트아이템 수정처리
					fn_KQKQMngUpdateMngD1(rowId);
				}
			},
			// 로그 보기
			'btn_right_log': function(els, pos) {

				var rowId = els.tr.id;                              // 선택행ID
				var rowData = $('#wid_d1VO').getRowData(rowId);  // 행데이터
				var qsheetId = rowData.qsheetId;                    // 큐시트ID

				cfn_popupLayer({
					id: 'KQKQQsheetLogView',
					pid: 'wid',
					url: '<c:url value="/kq/kq/KQKQQSheetLogView/init.do"/>',
					title: '로그보기',
					param: {qsheetId: qsheetId},
					width: 460,
					height: 200
				});
			}
		}
	});
}

// 드래그 가능여부 체크
function fn_draggableCheck(draggableCheck) {

	// 드래그 가눙여부가 true일경우 드래그 허용
	if (draggableCheck == true) {

		var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드
		var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();                    // 큐시트ID

		// 드래그 권한
		var cancel = '';
		var draggableYn = '${draggableYn}';

		// 자신 그리드에서 이동시킨경우 드래그 가능여부
		if (draggableYn == true) {
			// 큐시트방송상태가 [방송중(B011OAR), 방송완료(B011OEN)]순서변경 불가
			if (qsheetOnairStatCd == "B011OAR" || qsheetOnairStatCd == "B011OEN") {
				cancel = '*';     // 드래그 불가능
			}
			else {
				cancel = '';      // 드래그 가능
			}
		}
		else {
			cancel = '*';         // 드래그 불가능
		}

		$('#wid_d1VO').sortableRows({
			autoSet: false,
			cancel : cancel,
			start : function (ev,ui) {

				// 편집여부체크 호출
				var checkData = fn_checkEditing();

				// 편집여부가 false일경우 드래그 불가처리
				if (checkData.isEditingYn == false) {
					alert('현재 편집중인 사용자가 있어 편집을 할 수 없습니다.' +
						'\n\n편집 사용자: ' + checkData.editSsnNm +
						'\n편집 시작시간: ' + checkData.editStartDtime);

					// 새로고침
					$('#wid_btn_refresh').trigger('click');
				}
			},

			update : function (ev,ui) {
				// 자동추가행 삭제전 드랍된 상위행ID 취득
				var srcRowId = ui.item.prev().attr('id');
				if (!srcRowId) srcRowId = -1;

				var draggableData = $('body').data('draggable');

				// 다른 그리드에서 이동시킨 경우
				if (draggableData) {

					// plugin에 의한 자동추가행은 삭제
					$(ui.item).remove();

					// 행추가처리
					var newRowData = new Array();
					newRowData.push(draggableData.fromRowData);
					fn_draggableAddRow(newRowData, srcRowId);

					// 드래그 정보삭제
					$('body').removeData('draggable');
				}
				// 자신 그리드에서 이동시킨 경우
				else {
					$.blockUI();

					// 큐시트아이템[KNPROG102] 순서변경
					var rowId = ui.item.attr('id');
					fn_KQKQMngUpdateSeqD1(rowId, srcRowId, null);

					$.unblockUI();
				}
			}
		});
	}
}

// 선택뷰처리
function fn_refreshChoiceView(view) {
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();             // 큐시트ID
	var choiceView = '';

	// 전체뷰 일경우
	if (view == "C035ALV") {
		choiceView = $('#wid_m1VO input[name=choiceView]:checked').val(); // 큐시트 뷰모드
	}
	// 마이뷰 일경우
	else {
	}

	$.ajax({
		url: '<c:url value="/kq/kq/KQKQMng/init.do"/>',
		data: {wid: 'wid', qsheetId: qsheetId, choiceView: choiceView},
		type: "POST",
		dataType: "html",
		success: function(html){
			$('#LeftPane').html(html);
		}
	});

	// 인쇄페턴 삭제
	cfn_popupLayerClose({
		id : 'wid_movePrint',
		remove: true,
		beforeClose : function(e) {
		}
	});
}

// 편집여부체크
function fn_checkEditing() {

	var checkData = {};

	ajaxRequest({
		async: false,
		url: '<c:url value="/kq/kq/KQKQMng/selectM1.do"/>',
		showMessage: false,
		searchMaster: {
			id: 'wid_m1VO'
		},
		callback: function(status, data) {
			if (data) {
				var editorId  = data.editorId;       // 편집자ID
				var editingYn = data.editingYn;      // 편집여부
				var pageCrtorId = '${pageCrtorId}';  // 로그인사용자ID

				// 편집여부가'N'일경우 편집가능
				if (editingYn == 'N') {
					data.isEditingYn = true;
				}
				// 같은 사용자인 경우
				else if (editorId == pageCrtorId) {
					data.isEditingYn = true;
				}
				else {
					data.isEditingYn = false;
				}
				checkData = data;
			}
		}
		,
		blockUI: false
	});
	return checkData;
}

/**
 * 큐시트아이템 디폴트 설정
 */
function fn_KQKQMng_defaultSet() {

	var addRows = new Array();
	var addRowCnt = '3';	// 행추가수

	for(var i = 0; i < addRowCnt; i++) {

		if (i == '0') {
			var qsheetItemKindCd = 'C012OPN';	 // 타입(Opening)
		}
		else if (i == '1') {
			var qsheetItemKindCd = 'C012CLS';	 // 타입(Closing)
		}
		else if (i == '2') {
			var qsheetItemKindCd = 'C012END';	 // 타입(END)
		}

		addRows.push({
			stateFlag: 'I',                       // 상태플러그
			qsheetItemKindCd: qsheetItemKindCd,   // 타입
			realPrcsDur: '0000',                  // 실제방송시간
			expectPrcsDur: '0000',                // 예상방송시간
			onairMentYn: 'N'                      // 멘트상태
		});
	}

	// 큐시트아이템 추가처리
	var grid = $('#wid_d1VO');
	var selrow = grid.getGridParam('selrow');
	var position = 'after';
	fn_KQKQMngAppendMngD1(addRows, position, selrow);
}

/**
 * 예상누계 설정
 */
function fn_setAggrTime() {

	// TODO: 행순서 변경후 rowid재정렬 처리후 로컬데이터 처리로 재변경 필요.
	var rows = $('#wid_d1VO').find('tr[id]');
	var aggrTime = "";
	var qsheetItemKindCd = null;

	// 아이템리스트에 데이터가 있을경우
	if (rows.length > 0) {

		var isEnd = false;
		$.each(rows, function(i, row){
			if(row.id) {
				aggrTime = fn_setAggrTimeValue(row.id, aggrTime, isEnd);
				qsheetItemKindCd = $('#wid_d1VO').getCell(row.id, "qsheetItemKindCd");

				// 타입[END]에 예상누계를 마스터 예상진행시간에 설정
				if (qsheetItemKindCd == 'C012END') {
					var _endAggrTime = $('#wid_d1VO').getCell(row.id, 'aggrTime');
					$('#wid_m1VO input[name=expectPrcsDur]').val(_endAggrTime).trigger('blur.mask');

					isEnd = true;
				}
			}
		});
	}
	else {
		// 예상진행시간에 공백설정
		$('#wid_m1VO input[name=expectPrcsDur]').val('');
    }
}

/**
 * 현재행의 예상방송시간과 이전행의 예상누계를 더하여 현재행의 예상누계를 설정
 */
function fn_setAggrTimeValue(rowId, prevAggrTime, isEnd) {
	// 큐시트아이템 타입
	var qsheetItemKindCd = $('#wid_d1VO').getCell(rowId, "qsheetItemKindCd");

    // 현재행의 예상방송시간
    var expectPrcsDur = $('#wid_d1VO').getCell(rowId, "expectPrcsDur");

    if (expectPrcsDur) {
        var _expectPrcsDur = '00' + expectPrcsDur.replace(/:/gi, '');

		// 타입이 리포(C012ARP),출연(C012APP),전화(C012PHO),중계차(C012OBV),네트워크(C012NET) 일경우 +15초
		if (qsheetItemKindCd == 'C012ARP' || qsheetItemKindCd == 'C012APP' || qsheetItemKindCd == 'C012PHO' || qsheetItemKindCd == 'C012OBV' || qsheetItemKindCd == 'C012NET') {
			var defaultTime = '000015';
			expectPrcsDur = fn_getSumTimes(_expectPrcsDur, defaultTime);
		}
		else {
			expectPrcsDur = _expectPrcsDur;
		}
	}
    else {
		expectPrcsDur = '000000';
	}

	// 이전행의 예상누계
    if (prevAggrTime) {
        prevAggrTime = prevAggrTime.replace(/:/gi, '');
    }
    else {
        prevAggrTime = '000000';
	}

	var aggrTime = fn_getSumTimes(expectPrcsDur, prevAggrTime);
	if (isEnd == true) {
		aggrTime = '000000';
	}

	$('#wid_d1VO').setCell(rowId, 'aggrTime', aggrTime);

    return aggrTime;
}

/**
 * 시분 더하기값 구하기
 */
function fn_getSumTimes(time1, time2) {

    var time = '';
    if(time1.length != 6 || time2.length != 6) {
        return time;
    }

    var d = new Date(1, 1, 1, parseInt(time1.substr(0, 2), 10), parseInt(time1.substr(2 ,2), 10), parseInt(time1.substr(4, 2), 10));
    d.setHours(d.getHours() + parseInt(time2.substr(0,2),10));
    d.setMinutes(d.getMinutes() + parseInt(time2.substr(2,2),10));
    d.setSeconds(d.getSeconds() + parseInt(time2.substr(4,2),10));

    time = new String(d.getHours()).padLeft(2,'0')
		+ new String(d.getMinutes()).padLeft(2,'0')
		+ new String(d.getSeconds()).padLeft(2,'0');
	return time;
}

/**
 * 큐시트 작성 마스터 상태처리
 * 방송상태 폰트 변경
 * 방송상태 마스터값 변경
 * 그리드 배경색 변경
 */
function fn_KQKQMngStatusM1(status) {
	// 작성중
	if (status == 'B011WKI') {
		$('input[name=masterInfo]').css('background-image', 'url(/common/images/icon/ico_ing.png)');
		$('input[name=masterInfo]').css('padding-left', '42px');
		$('#wid_m1VO input[name=qsheetOnairStatCd]').val(status);
		$('#queOnair').removeClass('queOnair');
	}
	// 준비중
	else if (status == 'B011RDY') {
		$('input[name=masterInfo]').css('background-image', 'url(/common/images/icon/ico_ready.png)');
		$('input[name=masterInfo]').css('padding-left', '42px');
		$('#wid_m1VO input[name=qsheetOnairStatCd]').val(status);
		$('#queOnair').removeClass('queOnair');
	}
	// 방송대기
	else if (status == 'B011OWI') {
		$('input[name=masterInfo]').css('background-image', 'url(/common/images/icon/ico_standby.png)');
		$('input[name=masterInfo]').css('padding-left', '50px');
		$('#wid_m1VO input[name=qsheetOnairStatCd]').val(status);
		$('#queOnair').addClass('queOnair');
	}
	// 방송중
	else if (status == 'B011OAR') {
		$('input[name=masterInfo]').css('background-image', 'url(/common/images/icon/ico_onair.png)');
		$('input[name=masterInfo]').css('padding-left', '42px');
		$('#wid_m1VO input[name=qsheetOnairStatCd]').val(status);
		$('#queOnair').addClass('queOnair');
	}
	// 방송완료
	else if (status == 'B011OEN') {
		$('input[name=masterInfo]').css('background-image', 'url(/common/images/icon/ico_end.png)');
		$('input[name=masterInfo]').css('padding-left', '50px');
		$('#wid_m1VO input[name=qsheetOnairStatCd]').val(status);
		$('#queOnair').addClass('queOnair');
	}

	// (2013.07.19) 배소정, 마스터 방송상태에 따라 버튼 처리
	if (status != 'B011WKI') {
		$('#wid_btn_send').hide();  // 전송버튼 숨기기
		$('#wid_btn_save').hide();  // 저장버튼 숨기기
		$('#wid_btn_aprv').hide();  // 승인버튼 숨기기
		// 작성중
	}
	else {
		// 전체뷰일경우 승인버튼 비표시
		var choiceView = $('#wid_m1VO input[name=choiceView]:checked').val();
		if (choiceView != "C035MYV") {
			$('#wid_btn_aprv').hide();  // 승인버튼 숨기기
		}
	}

	// TODO: 권한에 따른 순서변경 처리 못하게 해야함...
}

/**
 * 큐시트 작성 아이템 상태처리
 */
function fn_KQKQMngStatusD1(rowId, rowData) {
	// 뷰모드
	var viewMode = $('#wid_m1VO input[name=viewMode]').val();

	var grid = $('#wid_d1VO');
	if (!rowData) {
		rowData = grid.getRowData(rowId);
	}

	// 큐시트아이템종류코드[Opening(C012OPN), Closing(C012CLS), END(C012END)]가 있을경우 폰트 볼드처리
	var qsheetItemKindCd = rowData.qsheetItemKindCd; // 큐시트아이템종류코드

	if (qsheetItemKindCd == 'C012OPN' || qsheetItemKindCd == 'C012CLS' || qsheetItemKindCd == 'C012END') {
		grid.find('tr#' + rowId).find('td[aria-describedby$=qsheetItemKindCd]').css('color', '#0100ff');
	}
	else {
		grid.find('tr#' + rowId).find('td[aria-describedby$=qsheetItemKindCd]').css('color', '#000000');
	}


	// 큐시트아이템방송상태코드에 따른 셀 배경색 처리
	// 색상(대기중(B012WTI):흰색, 준비중(B012RDY): 녹색, 방송중(B012OAR): 빨강, 방송완료(B012OEN): 진한회색)
	/* sjhan 2013.08.19 [과업내역47] 색깔이 전체 라인에 다 표시되도록 변경*/
	var qsheetItemOnairStatCd = rowData.qsheetItemOnairStatCd;
	if(qsheetItemOnairStatCd == 'B012WTI') {
		var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드

		// 큐시트방송상태가 [방송중(B011OAR), 방송완료(B011OEN)] 회색
		if (qsheetOnairStatCd == "B011OAR" || qsheetOnairStatCd == "B011OEN") {
			grid.find('tr#' + rowId).find('td').css('background', '#e6e6e6');
		}
		else {
			// 대기중(B012WTI):흰색
			grid.find('tr#' + rowId).find('td').css('background', '');
		}
	}
	else if(qsheetItemOnairStatCd == 'B012RDY') {
		// 준비중(B012RDY): 녹색
		grid.find('tr#' + rowId).find('td').css('background', '#c3fea6');
	}
	else if(qsheetItemOnairStatCd == 'B012OAR') {
		// 방송중(B012OAR): 빨강
		grid.find('tr#' + rowId).find('td').css('background', '#ffd1d1');
	}
	else if(qsheetItemOnairStatCd == 'B012OEN') {
		// 방송완료(B012OEN): 진한회색
		grid.find('tr#' + rowId).find('td').css('background', '#dcdcdc');
	}
	else {
		return;
	}

	// 멘트상태에 따른 앵커멘트 버튼 색상 변경
	var onairMentYn = rowData.onairMentYn;
	if (onairMentYn == 'N') {
		grid.find('tr#' + rowId).find('td[aria-describedby$=airEditor] img').attr('src', '/common/images/btn/btn_ment.gif')
	}

	if (onairMentYn == 'Y') {
		grid.find('tr#'+rowId).find('td[aria-describedby$=airEditor] img').attr('src', '/common/images/btn/btn_ment_on.gif')
	}

	// 영상편집요청여부가 'Y'이면서 파일수가 '0'일경우 파일수 셀 배경색 변경
	var videoEditReqYn = rowData.videoEditReqYn;
	var fileCnt = rowData.fileCnt;

	if (videoEditReqYn == 'Y' && fileCnt == '0') {
		grid.find('tr#' + rowId).find('td[aria-describedby$=fileCnt]').css('background', '#fec4ff');
	}

	// 파일수가 '0'일경우 영상상태(메인, 백업)데이터 비표시
	if (fileCnt == '0') {
		grid.setCell(rowId, 'scrMainTransStat', '');
		grid.setCell(rowId, 'scrBackTransStat', '');
	}

	// 큐시트 기사대체차수 와 기사대체차수가 다른경우 상태컬럼에 배경색표시
	var artclAltOdr = rowData.artclAltOdr; // 큐시트 기사대체차수
	var altOdr = rowData.altOdr;           // 기사대체차수

	// 기사대체카수가 있고 큐시트 기사대체차수가 공백일경우 '0을셋팅
	if (altOdr) {
		if (artclAltOdr == "") {
			var artclAltOdr = "0";
			$('#wid_d1VO').setCell(rowId, 'artclAltOdr', artclAltOdr);
		}
	}

	// 대체차수가 다른경우
	if (artclAltOdr != altOdr) {
		grid.find('tr#'+rowId).find('td[aria-describedby$=artclStatNm]').css('background', '#fec4ff');
	}
	else {
		if(qsheetItemOnairStatCd == 'B012WTI') {
			// 큐시트 방송상태가 방송중 또는 방송완료일경우
			var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드
			if (qsheetOnairStatCd == "B011OAR" || qsheetOnairStatCd == "B011OEN") {
				// 대기중(B012WTI):회색
				$('#wid_d1VO').find('tr#' + rowId).find('td[aria-describedby$=artclStatNm]').css('background', '#e6e6e6');
			}
			else {
				// 대기중(B012WTI):흰색
				$('#wid_d1VO').find('tr#' + rowId).find('td[aria-describedby$=artclStatNm]').css('background', '');
			}
		}
		else if(qsheetItemOnairStatCd == 'B012RDY') {
			// 준비중(B012RDY): 녹색
			$('#wid_d1VO').find('tr#' + rowId).find('td[aria-describedby$=artclStatNm]').css('background', '#c3fea6');
		}
		else if(qsheetItemOnairStatCd == 'B012OAR') {
			// 방송중(B012OAR): 빨강
			$('#wid_d1VO').find('tr#' + rowId).find('td[aria-describedby$=artclStatNm]').css('background', '#ffd1d1');
		}
		else if(qsheetItemOnairStatCd == 'B012OEN') {
			// 방송완료(B012OEN): 진한회색
			$('#wid_d1VO').find('tr#' + rowId).find('td[aria-describedby$=artclStatNm]').css('background', '#dcdcdc');
		}
	}

	// 아이템리스트에 타입[END]가 있을경우 타입[END]밑에 예상누계 설정
	//var endRowId = grid.getFindRowId({qsheetItemKindCd:'C012END'});
	//var rows = grid.find('tr[id]');
}

/**
 * 큐시트 작성 마스터 조회
 */
function fn_KQKQMngSearchM1() {
	// 마스터 조회
	ajaxRequest({
		url: '<c:url value="/kq/kq/KQKQMng/selectM1.do"/>',
		searchMaster: {
			id: 'wid_m1VO',
			toMasterId: 'wid_m1VO'
		},
		callback: function(status, data) {
			if (data) {
				// 뷰모드 라디오박스 체크
				var viewMode = $('#wid_m1VO input[name=viewMode]').val();

				// 마이뷰
				if (viewMode == "C035MYV") {
					$('#wid_m1VO input[id=choiceView_0]').attr('checked', true)
				}
				// 전체뷰
				else {
					$('#wid_m1VO input[id=choiceView_1]').attr('checked', true)
				}

				var qsheetOnairStatCd = data.qsheetOnairStatCd;
				fn_KQKQMngStatusM1(qsheetOnairStatCd);
			}
		}
	});
}

/**
 * 큐시트 작성 아이템 조회
 */
function fn_KQKQMngSearchD1() {
	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();
	var changeQsheetId = $('#wid_m1VO input[name=changeQsheetId]').val();

	// 리스트 조회
	ajaxRequest({
		url: '<c:url value="/kq/kq/KQKQMng/selectD1.do"/>',
		param: {changeQsheetId: changeQsheetId},
		searchMaster: {
			id: 'wid_m1VO'
		},
		searchDetail:{
			toDetailId: 'wid_d1VO'
		},
		callback: function(status, data) {

			// 그리드 데이터
			var gridRecords = $('#wid_d1VO').getGridParam('records');

			// 그리드 데이터가 있을경우
			if (gridRecords > 0) {
				// 파일수가 '0'일경우 영상상태(메인, 백업)데이터 비표시
				var gridData = $('#wid_d1VO').getGridParam('data');
                $.each(gridData, function(i, rowData) {
                	// 아이템 상태처리
                    fn_KQKQMngStatusD1(this.id, rowData);
                });

                // 예상누계 설정
                fn_setAggrTime();
            }
        }
    });
}

/**
 * 큐시트아이템 승인
 */
function fn_KQKQMngAprvM1() {
	// 큐시트방송상태가 작성중이외(B011WKI)일경우
	var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();

	if (qsheetOnairStatCd != "B011WKI") {
		alert("승인 처리를 할수 없습니다. \n큐시트 방송상태를 확인해주세요.");
		return;
	}

	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();

	// 큐시트ID가 없을경우
	if(!qsheetId) {
		alert("기본정보가 없습니다. \n기본정보 저장후 사용해주세요.");
		return;
	}

	// 큐시트승인ID 취득
	ajaxRequest({
		async: false,
		url: '<c:url value="/kq/kq/KQKQMng/selectQsheetAprvId.do"/>',
		searchMaster: {
			id: 'wid_m1VO'
		},
		warningMessage: false,
		confirmMessage: false,
		callback: function(status, data) {
			if (status == 'success') {

				// 1.큐시트승인ID
				var qsheetAprvId = data.resultData;

				// 2.큐시트 승인 이미지 다운로드
				var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();                    // 큐시트ID
				var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드

				var downname = qsheetAprvId + ".JPG";
				var params = {
					"downname" : downname,
					"urlForImage" : 'http://<%=domain%>:<%=SystemUtils.getPropertyBasedOnOS("system.port", "80")%>'
						+ '<c:url value="/kq/kq/KQKQPrintView/init.do"/>'
						+ '?wid=KQKQPrintView&qsheetId=' + qsheetId + '&qsheetOnairStatCd=' + qsheetOnairStatCd
				};

				ajaxRequest({
					url: '<c:url value="/kq/kq/KQKQAprvCapture/saveScreenshotFromUrl.do"/>',
					param: params,
					callback: function(status, data) {
						if (!data) return;
						if (data[0].rsltStat == '0') {
							var fileNm = data[0].fileNm;

							// 3.큐시트 승인 처리
							ajaxRequest({
								async: false,
								url: '<c:url value="/kq/kq/KQKQMng/aprvM1.do"/>',
								param: {
									qsheetAprvId: qsheetAprvId,
									fileNm: fileNm
								},
								searchMaster: {
									id: 'wid_m1VO'
								},
								warningMessage: false,
								confirmMessage: false,
								callback: function(status, data) {}
							});
						}
						else {
							alert(data[0].rsltMessage);
						}
					}
				});
			}
		}
	});

	// 마스터조회 호출
	fn_KQKQMngSearchM1();

	// =====================================================================================================
	// 갱신할 컨테이너 Get(큐시트 조회화면의 재검색 처리)
	var refreshContainers = opener.fn_getListContainerIdsByContKind('tab11');
	$.each(refreshContainers, function (i){
		eval("opener.fn_" + refreshContainers[i] + "_searchKQKQQsheetInquire()" );
	});
}

/**
 * 큐시트아이템 저장, 전송
 */
function fn_KQKQMngSaveMngD1() {
	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();

	// 버튼구분 구분자
	var btnGubn = $('#wid_m1VO input[name=btnGubn]').val();

	// 큐시트ID가 없을경우
	if(!qsheetId) {
		alert("기본정보가 없습니다. \n기본정보 저장후 사용해주세요.");
		return;
	}

	// 아이템 리스트에 타입[END]에 순번 취득
	var endRowId = $('#wid_d1VO').getFindRowId({qsheetItemKindCd:'C012END'});

	// 리스트에 타입[END]가 없을경우
	if (endRowId == -1) {
		alert('아이템리스트에 [END]타입이 없습니다. \n [END]타입을 추가해주세요.');
		return;
	}


	// 큐시트아이템 순번 정렬
	ajaxRequest({
		async: false,
		url: '<c:url value="/kq/kq/KQKQMng/updateQsheetItemSeqNo.do"/>',
		param: {qsheetId:qsheetId},
		showMessage:false,
		warningMessage:false,
		confirmMessage: false,
		callback: function(status, resData) {
			if (status == 'success') {
				var choiceView = $('#wid_m1VO input[name=choiceView]:checked').val();
				fn_refreshChoiceView(choiceView);
			}
		}
	});

	// 예상누계 설정
	fn_setAggrTime();

	ajaxRequest({
		//async: false,
		url: '<c:url value="/kq/kq/KQKQMng/saveMngD1.do"/>',
		param: {
			isWebpush: true,
			guid: guid
		},
		searchMaster: {
			id: 'wid_m1VO'
		},
		warningMessage: false,
		confirmMessage: false,
		callback: function(status, resData) {
			if (status == 'success') {
				// 큐시트전환 구분자 초기화
				$('#wid_m1VO input[name=changeGubun]').val('');

				// 버튼구분 구분자 초기화
				$('#wid_m1VO input[name=btnGubn]').val('');

				// 큐시트아이템ID 취득
				var grid = $('#wid_d1VO');
				var gridData = resData.resultData;
				$.each(gridData, function() {
					if (this.stateFlag == 'I') {
						var rowId = grid.getFindRowId({rn:this.rn});                               // rowId 취득
						grid.setCell(rowId, 'qsheetId', this.qsheetId);                            // 큐시트ID 설정
						grid.setCell(rowId, 'qsheetItemId', this.qsheetItemId);                    // 큐시트아이템ID 설정
						grid.setCell(rowId, 'qsheetItemOnairStatCd', this.qsheetItemOnairStatCd);  // 큐시트아이템방송상태코드
					}
				});

                // 그리드 초기화
                grid.clearTempData();

                // 마스터조회 호출
                fn_KQKQMngSearchM1();

                // =====================================================================================================
                // 갱신할 컨테이너 Get(큐시트 조회화면의 재검색 처리)
                var refreshContainers = opener.fn_getListContainerIdsByContKind('tab11');
                $.each(refreshContainers, function (i){
                    eval("opener.fn_" +refreshContainers[i]+"_searchKQKQQsheetInquire()" );
                });
            }
        }
	});
}

/**
 * 큐시트아이템 수정처리
 * 약물정보 변경시 웹푸시제외 요청사항 sjhan 2013.08.23
 * @param rowId
 * @param img
 */
function fn_KQKQMngUpdateMngD1(rowId, img) {
	var grid = $('#wid_d1VO');

	// TODO: getRowData사용시 이미지 표시못함
	var rowData = grid.getLocalRowData(rowId);
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();             // 큐시트ID
	var expectPrcsDur = $('#wid_m1VO input[name=expectPrcsDur]').val();   // 예상진행시간

	var param = rowData;
	param['totExpectPrcsDur'] = expectPrcsDur;
	// param['isWebpush'] = img? false : true;
	param['isWebpush'] = true;
	param['guid'] = guid;

	// 상태가 신규:I가 아닐 경우에만 수정처리
	if (rowData.stateFlag != "I") {
		ajaxRequest({
			async: false,
			url: '<c:url value="/kq/kq/KQKQMng/updateMngD1.do"/>',
			param: param,
			showMessage:true,
			warningMessage:false,
			confirmMessage: false,
			callback: function(status, resData) {
				if (status == 'success') {
					// 아이템 상태처리
					fn_KQKQMngStatusD1(rowId);

					// 그리드 초기화
					grid.clearTempData();
				}
			},
			blockUI: false
		});
	}
}

/**
 * 큐시트아이템 순서변경
 * @param rowId
 * @param srcRowId
 * @param deleteRowRn
 */
function fn_KQKQMngUpdateSeqD1(rowId, srcRowId, deleteRowRn) {
	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();

	// 행데이터
	var grid = $('#wid_d1VO');
	var rowData = grid.getRowData(rowId);
	var records = grid.getGridParam('records');

	// 순서변경 순번
	if (deleteRowRn == null) {
		var moveRowRn = Number($('#wid_d1VO').getCell(rowId, 'rn'));
		var moveSrcRowRn = Number($('#wid_d1VO').getCell(srcRowId, 'rn'));
	}
	else {
		var moveRowRn = deleteRowRn;
		var moveSrcRowRn = Number($('#wid_d1VO').getCell(srcRowId, 'rn'));
	}

	if (!moveSrcRowRn) {
		moveSrcRowRn = 1;
	}
	else {
		if (moveRowRn > moveSrcRowRn) {
			moveSrcRowRn += 1;
		}
	}

	ajaxRequest({
		//async: false,
		url: '<c:url value="/kq/kq/KQKQMng/updateMngSeqD1.do"/>',
		param: {
			guid: guid,
			isWebpush: true,
			moveRowRn: moveRowRn,
			moveSrcRowRn: moveSrcRowRn,
			qsheetId: qsheetId,
			moveQsheetItemId: rowData.qsheetItemId
		},
		showMessage:false,
		warningMessage:false,
		confirmMessage: false,
		callback: function(status, resData) {
			// TODO jckim : 순서 변경 실패시 원상태로 돌리기?
//			if (status == 'error') {
//				$('#wid_d1VO').sortable('cancel');
//				// TODO : reset 순번
//				return;
//			}

			if (status == 'success') {
				// 예상누계 설정
				fn_setAggrTime();
            }
        },
		blockUI: false
    });
}

var isDelConfirm = false;
/**
 * 큐시트아이템 삭제
 * @param rowId
 */
function fn_KQKQMngDeleteMngD1(rowId) {
	var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드
	var grid = $('#wid_d1VO');
	var qsheetItemKindCd = grid.getCell(rowId, 'qsheetItemKindCd');                 // 타입

	// 큐시트방송상태가 [방송중(B011OAR), 방송완료(B011OEN)]일경우 삭제불가
	if (qsheetOnairStatCd == "B011OAR" || qsheetOnairStatCd == "B011OEN") {
		alert('삭제할수없습니다.\n 큐시트방송상태를 확인해주세요.');
		return;
	}

	// 큐시트아이템종류코드[END(C012END)]일경우 삭제불가
	if (qsheetItemKindCd == "C012END") {
		alert('삭제할수없습니다.\n 큐시트타입을 확인해주세요.');
		return;
	}

	// 편집여부체크 호출
	var checkData = fn_checkEditing();

	// 편집여부가 false일경우 삭제 처리불가
	if (checkData.isEditingYn == false) {
		alert('현재 편집중인 사용자가 있어 편집을 할 수 없습니다.' +
			'\n\n편집 사용자: ' + checkData.editSsnNm +
			'\n편집 시작시간: ' + checkData.editStartDtime);
	}
	else {
		// 선택한 삭제순번 취득
		var deleteRowId = rowId;
		var deleteRowRn = Number(grid.getCell(rowId, 'rn'));

		// 아이템 리스트에 타입[END]에 순번 취득
		var endRowId = grid.getFindRowId({qsheetItemKindCd:'C012END'});
		var endRowRn = grid.getCell(endRowId, 'rn');

		// 삭제대상 로컬데이터 취득
		var deleteRowData = grid.getLocalRowData(deleteRowId);

		// 선택학 삭제순번이 아이템 리스트 타입순번보다 작을경우(삭제)
		if (endRowRn > deleteRowRn) {
			if (isDelConfirm == false) {
				isDelConfirm = true;

				// 블락설정
				$.blockUI();

				// 아이템리스트에 마지막 행에 추가
				setTimeout(function() {
					// 삭제대상 아이템 삭제
					grid.gridDelRow({
						rowid: deleteRowId
					});

					grid.gridAddRow({
						rowID: "new_row",
						newid: false,
						position: 'last',
						srcrowid: null,
						initdata: deleteRowData
					});

					// 상태변경
					var rowid = deleteRowId;
					grid.setCell(rowid, 'stateFlag', '');

					// 마지막행 RowId 취득
					var rowData = grid.getRowData();
					var rowDataL = rowData.length;
					var maxRowid = rowData[rowDataL-1].id;

					// 큐시트아이템[KNPROG102] 순서변경
					fn_KQKQMngUpdateSeqD1(deleteRowId, maxRowid, deleteRowRn);

					// 블락해제
					$.unblockUI();

					isDelConfirm = false;

				}, 200);
			}
		}
		// 선택학 삭제순번이 아이템 리스트 타입순번보다 큰경우(완전삭제)
		else {
			if (!confirm('완전 삭제하시겠습니까? \n 관련 하위 데이터까지 삭제됩니다.')) {
				isDelConfirm = false;
				return;
			}

			// 블락설정
			$.blockUI();

			var rowData = grid.getRowData(rowId);            // 행데이터
			var stateFlag = rowData.stateFlag;               // 상태플러그
			var qsheetItemId = rowData.qsheetItemId;         // 큐시트아이템ID
			var qsheetId = rowData.qsheetId;                 // 큐시트ID
			var artclId = rowData.artclId;                   // 기사ID
			var groupId = rowData.groupId;                   // 그룹ID
			var newsgthPlanId = rowData.newsgthPlanId;       // 취재계획ID
			var rn = rowData.rn;                             // 화면순번
			var qsheetItemKindCd = rowData.qsheetItemKindCd; // 타입
			var qsheetItemTitle = rowData.qsheetItemTitle;   // 아이템제목

			// 상태가 신규:I일 경우는 화면만 행삭제
			if (stateFlag == "I") {
				grid.gridDelRow({
					rowid: rowId
				});
			}
			else {
				if (isDelConfirm == false) {
					isDelConfirm = true;

					if (artclId != '') {

						var onairDt = $('#wid_m1VO input[name=onairDt]').val(); // 큐시트 방송일자
						var now = new Date();
						var y = now.getFullYear();
						var m = now.getMonth() + 1;

						if(m < 10) m = "0" + m;

						var d = now.getDate();

						if(d < 10)	d = "0" + d;

						var nowDate = y + "" + m + "" + d;

						// 큐시트 대표프로그램 조회
						ajaxRequest({
							url: '<c:url value="/kq/kq/KQKQMng/selectRpsPgmCd.do"/>',
							param: {
								qsheetId: qsheetId
							},
							callback: function(status, data) {
								// 대표프로그램
								var rpsPgmCd = data.resultData;

								// SMS 발송(방송일자:현제년월일, 대표방송프로그램:KBS 뉴스9)
								if (rpsPgmCd == "T2000-0110") {
								// 방송일자
									if (onairDt == nowDate) {
										// SMS 발송 (큐시트아이템취소)
										// fn_wid_sendSmsQsheetItem(qsheetItemId);
									}
								}
							},
							blockUI: false
						});
					}

					//  큐시트아이템 삭제
					ajaxRequest({
						async: false,
						url: '<c:url value="/kq/kq/KQKQMng/deleteMngD1.do"/>',
						param: {
							isWebpush: true,
							guid: guid,
							qsheetItemId: qsheetItemId,
							qsheetId: qsheetId,
							artclId: artclId,
							groupId: groupId,
							newsgthPlanId: newsgthPlanId,
							rn: rn,
							qsheetItemTitle: qsheetItemTitle
						},
						showMessage: false,
						warningMessage: false,
						confirmMessage: false,
						callback: function(status, data) {
							if (status == 'success') {
								setTimeout(function() {
									// 행삭제 처리
									grid.gridDelRow({ rowid: rowId });
                                }, 0);
                            }
                        },
						blockUI: false
                    });
                }
            }

            setTimeout(function() {
                // 예상누계 설정
                fn_setAggrTime();

                if (stateFlag != "I") {
                    // 마스터정보 수정(예상진행시간)
                    var expectPrcsDur = $('#wid_m1VO input[name=expectPrcsDur]').val();

					// 큐시트마스터 정보 수정
					ajaxRequest({
						async: false,
						url: '<c:url value="/kq/kq/KQKQMng/updateMngM1.do"/>',
						param: {
							qsheetId: qsheetId,
							expectPrcsDur: expectPrcsDur
						},
						callback: function(status) {
						},
						blockUI: false
					});
				}

				// 블락해제
				$.unblockUI();

				isDelConfirm = false;
			},500);
		}
	}
}

/**
 * 큐시트아이템취소 SMS 전송
 */
function fn_sendSmsQsheetItem(qsheetItemId) {
	ajaxRequest({
		url: '<c:url value="/kc/tu/KCTUSmsSend/sendSMSForQsheetItemCancel.do"/>',
		param: {
			qsheetItemId: qsheetItemId
		},
		callback: function(status) {
		},
		blockUI: false
	});
}

// 큐시트아이템 추가처리
function fn_KQKQMngAppendMngD1(newRowData, position, selRowId) {
	$.blockUI();

	// TODO: 서버로직 튜닝 필요!!!
	var grid = $('#wid_d1VO');
	var selrow = grid.getGridParam('selrow');
	var srcrowid = selRowId;
	var srcrowrn = null;

	if (srcrowid) {
		srcrowrn = grid.getCell(srcrowid, 'rn');
	}

	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();

	// 큐시트 방송 상태 코드
	// 큐시트마스터 방송상태코드를 확인후 행삽입 가능여부 확인
	// 큐시트마스터 방송상태코드가 [작성중:B011WKI, 준비중:B011RDY, 방송대기:B011OWI]일경우 삽입, 추가가능
	// 큐시트마스터 방송상태코드가 [방송중:B011OAR, 방송완료:B011OEN]일경우 마지막행에 추가
	var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();
	if (qsheetOnairStatCd == "B011OAR" || qsheetOnairStatCd == "B011OEN") {
		position = "last";
	}

	// 추가처리 디폴트값
	$.each(newRowData, function(i, rowData) {
		rowData.qsheetId = qsheetId;		        // 큐시트ID
		rowData.qsheetItemOnairStatCd = 'B012WTI';  // 큐시트아이템 방송상태
		rowData.effectKindCd = 'B010BNN';           // 이펙트종류
		if (!rowData.fileCnt) {
			rowData.fileCnt = '0';                  // 영상 파일수
		}
		if (!rowData.audFileCnt) {
			rowData.audFileCnt = '0';               // 오디오 파일수
		}

		// 실제방송시간이 Null일경우
		if (!rowData.realPrcsDur) {
			rowData.realPrcsDur = '0000';           // 실제방송시간
		}

		// 예상방송시간이 Null일경우
		if (!rowData.expectPrcsDur) {
			rowData.expectPrcsDur = '0000';         // 예상방송시간
		}
	});

	grid.gridAddRow({
		position: position,
		srcrowid: srcrowid,
		initdata: newRowData
	});


	// 추가타입 설정(추가:add,삽입:ins)
	var gridData = grid.getGridParam('data');
	var appendType = "add";

	if (gridData.length > 0) {
		var lastStateFlag = gridData[gridData.length-1].stateFlag;
		if ('I' != gridData[gridData.length-1].stateFlag) {
			appendType = "ins";
		}
	}

	ajaxRequest({
		//async: false,
		url: '<c:url value="/kq/kq/KQKQMng/appendMngD1.do"/>',
		param: {
			appendType: appendType,
			position:position,
			isWebpush: true,
			guid: guid
		},
		searchMaster: {
			id: 'wid_m1VO'
		},
		detail: {
			id: 'wid_d1VO',
			stateFlag: ['I']
		},
		showMessage: true,
		warningMessage: false,
		confirmMessage: false,
		callback: function(status, resData) {
			if (status == 'success') {
				// 예상누계 설정
				fn_setAggrTime();

				// 생성된 큐시트아이템ID 설정
				var d1VO = resData.resultData;

				$.each(d1VO, function() {
					var rowId = this.id;
					grid.setCell(rowId, 'qsheetItemId', this.qsheetItemId);     // 큐시트아이템ID
					grid.setCell(rowId, 'groupId', this.groupId);               // 그룹ID
					grid.setCell(rowId, 'onairMentId', this.onairMentId);       // 방송멘트ID

					// 아이템 상태처리
					fn_KQKQMngStatusD1(rowId);
				});

				// 웹푸시 처리
				if (IS_WEBPUSH_QSHEET == true) {
                }

				// 그리드 초기화
				grid.clearTempData();

                // 행추가버튼 활성화
                $('#wid_btn_add').disableObj(false);
			}
		},
		blockUI: false
	});
    // 블락 해재처리
    $.unblockUI();
}

/**
 * 큐시트 작성 행추가 처리
 * @param newRowData
 * @param selRowId
 * @param fromGrid
 * @returns {boolean}
 */
function fn_draggableAddRow(newRowData, selRowId, fromGrid) {
	// 편집여부체크 호출
	var checkData = fn_checkEditing();

	// 편집여부가 false일경우 드래그 불가처리
	if (checkData.isEditingYn == false) {
		alert('현재 편집중인 사용자가 있어 편집을 할 수 없습니다.' +
			'\n\n편집 사용자: ' + checkData.editSsnNm +
			'\n편집 시작시간: ' + checkData.editStartDtime);

		return false;
	}

	if(!$.isArray(newRowData)) return;

	var addRowData = new Array();
	var dupPkCol = null;
	var isValid = true;

	// 기사에서 이동시킨 경우
	if (newRowData[0].artclId && !newRowData[0].qsheetItemId && !newRowData[0].newsgthPlanId && !newRowData[0].qsheetItemTypeId) {
		dupPkCol = 'artclId';
		var artclIds = new Array();

		$.each(newRowData, function(i, rowData) {
			var artclKindCd = rowData.artclKindCd;        // 기사종류코드
			var embagoYn = rowData.embagoYn;              // 엠바고여부
			var _embagoEndDtime = rowData.embagoEndDtime; // 엠바고종료일시
			var embagoEndDtime = _embagoEndDtime.replaceAll('-','').replaceAll(':','').replaceAll(' ','');

			var now = new Date();

			var y = now.getFullYear();
			var m = now.getMonth() + 1;
			if(m < 10) m = "0" + m;

			var d = now.getDate();
			if(d < 10) d = "0" + d;

			var h = now.getHours();
			if(h < 10) h = "0" + h;

			var mn = now.getMinutes();
			if(mn < 10) mn = "0" + mn;

			var nowDate = y + "" + m + "" + d + "" + h + "" + mn;

			// 기사종류가 단신, 리포트만 이동가능
			if (artclKindCd == 'C011ARC' || artclKindCd == 'C011ATO' || artclKindCd == 'C011ABO') {
				alert('단신 또는 리포트만 이동가능합니다. 기사종류코드를 확인해 주세요.');
				isValid = false;
				return false;
			}

			// 엠바고가 설정되어있을경우
			if (embagoYn == 'Y') {
				// 엠바고종료일자가 현재일시보다 미래날짜일경우
				if (embagoEndDtime > nowDate) {
					// 경고메시지 표시
					if (confirm('엠바고 기사가 있습니다.' + '[ ' + _embagoEndDtime + ' ]' + '\n 그래도 큐시트로 이동하시겠습니까?')) {
						isValid = true;
					}
					else {
						isValid = false;
						return false;
					}
				}
			}
			artclIds.push(rowData.artclId);
			return isValid;
		});

		if(isValid) {
			// 기사ID로 데이터 조회
			ajaxRequest({
				async: false,
				url: '<c:url value="/kq/kq/KQKQMng/selectDraggableData.do"/>',
				param: {
					// 기사ID
					artclId: artclIds.join(',')
				},
				callback: function(status, data) {
					// 데이터 설정
					if($.isArray(data.rows)) {
						$.each(data.rows, function() {
							this.qsheetItemTitle = this.qsheetItemTitle.replaceAll('>','&gt;');
							this.qsheetItemTitle = this.qsheetItemTitle.replaceAll('<','&lt;');
						});
						addRowData = data.rows;
					}
				},
				blockUI: false
			});
		}
	}
	// 취재계획에서 이동시킨 경우
	else if(newRowData[0].newsgthPlanId && !newRowData[0].artclId && !newRowData[0].qsheetItemId && !newRowData[0].qsheetItemTypeId) {
		dupPkCol = 'newsgthPlanId';
		$.each(newRowData, function(i, rowData) {
			// 제목 <,> 문자 포함인 경우 변경
			var title = rowData.title;
			title = title.replaceAll('>','&gt;');
			title = title.replaceAll('<','&lt;');

			addRowData.push({
				newsgthPlanId   : rowData.newsgthPlanId,    // 취재계획ID
				qsheetItemTitle : title,                    // 아이템 제목
				rpterNm         : rowData.qsheetRpterNm,    // 리포터
				groupId         : rowData.groupId,          // 그룹ID
				qsheetItemKindCd: rowData.type,             // 타입
				realPrcsDur     : '0000',                   // 실제방송시간
				expectPrcsDur   : rowData.dur,              // 예상방송시간
				onairMentYn     : 'N'                       // 멘트상태
			});
		});
	}
	// 타 큐시트 또는 뉴스일람표 에서 이동시킨 경우
	else if(newRowData[0].qsheetItemId) {
		dupPkCol = 'copyQsheetItemId';
		$.each(newRowData, function(i, rowData) {
			// 제목 <,> 문자 포함인 경우 변경
			var newTitle = rowData.qsheetItemTitle;
			newTitle = newTitle.replaceAll('>','&gt;');
			newTitle = newTitle.replaceAll('<','&lt;');

			var qsheetItemKindCd = rowData.qsheetItemKindCd;  // 타입

			// 큐시트아이템종류코드[Opening(C012OPN), Closing(C012CLS), END(C012END)]가 있을경우 추가불가
			if (qsheetItemKindCd == 'C012OPN' || qsheetItemKindCd == 'C012CLS' || qsheetItemKindCd == 'C012END') {
				alert('타입이 [Opening, Closing, END]일경우 선택이동및 드래그를 할수없습니다. 타입을 확인해 주세요.');
				isValid = false;
				return false;
			}

			// 큐시트에서 선택이동 및 드래그시 큐시트아이템ID를 COPY큐시트아템ID에 복사
			rowData.copyQsheetItemId = rowData.qsheetItemId;
			rowData.qsheetItemTitle = newTitle;              // 제목
			addRowData.push(rowData);
		});
	}
	// 큐스트유형에서 이동시킨경우
	else if(newRowData[0].qsheetItemTypeId) {
		dupPkCol = 'qsheetItemTypeId';
		$.each(newRowData, function(i, rowData) {
			// 제목 <,> 문자 포함인 경우 변경
			var newTitle = rowData.qsheetItemTitle;
			newTitle = newTitle.replaceAll('>','&gt;');
			newTitle = newTitle.replaceAll('<','&lt;');

			var qsheetItemKindCd = rowData.qsheetItemKindCd;  // 타입

			// 큐시트아이템종류코드[Opening(C012OPN), Closing(C012CLS), END(C012END)]가 있을경우 추가불가
			if (qsheetItemKindCd == 'C012OPN' || qsheetItemKindCd == 'C012CLS' || qsheetItemKindCd == 'C012END') {
				alert('타입이 [Opening, Closing, END]일경우 선택이동및 드래그를 할수없습니다. 타입을 확인해 주세요.');
				isValid = false;
				return false;
			}

			rowData.realPrcsDur = rowData.expectPrcsDur;    // 실제방송시간
			rowData.onairMentYn = 'N';                      // 멘트상태
			rowData.qsheetItemTitle = newTitle;             // 제목
			addRowData.push(rowData);
		});
	}

	// 큐시트아이템 존재체크
	var grid = $('#wid_d1VO');
	var gridData = grid.getGridParam('data');
	var isBreak = true;

	$.each(gridData, function() {
		var thisData = this;
		$.each(addRowData, function(i, rowData) {
			if(thisData[dupPkCol] == this[dupPkCol]) {
				// 확인
				if (confirm('동일한 아이템이 존재합니다. 추가하시겠습니까?')) {
					isValid = true;
					isBreak = false;
					return false;
				}
				// 취소
				else {
					isValid = false;
					isBreak = false;
					return false;
				}
			}
		});
		return isBreak;
	});

	if(isValid) {
		// 선택이동 대상 아이템 체크박스 해제
		if (fromGrid) {
			var checkedRowId = fromGrid.getCheckedRowId();
			$.each(checkedRowId, function(i, rowId) {
				fromGrid.setMultiCheck(rowId, false);
			});
		}

		// 큐시트아이템 추가처리
		var position = 'after';
		if (!selRowId) {
			var selrow = grid.getGridParam('selrow');
			if (selrow) {
				selRowId = selrow;
			}
			else {
				position = 'first';
			}
		}
		else {
			if (selRowId == -1) {
				selRowId = null;
				position = 'first';
			}
		}
		fn_KQKQMngAppendMngD1(addRowData, position, selRowId);
	}
}

/**
 * 약물아이콘 팝업위치
 * @param w
 * @returns {*[]}
 */
function fn_ImgViewPosition(w) {
	var td = $('#wid_d1VO').getCell(clickRowId, clickColNm, true);
	var td_offset = td.offset();
	var td_height = td.height();

	return [td_offset.left - (w - 54), td_offset.top + td_height];
}

/**
 * 약물아이콘 팝업열기
 * @param divId
 * @param rowId
 * @param colNm
 */
function fn_ImgViewOpen(divId, rowId, colNm) {
	var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드

	// 큐시트방송상태가 방송완료(B011OEN)일경우 약물변경 불가
	if (qsheetOnairStatCd == "B011OEN") {
		return;
	}

	clickRowId = rowId;						// 선택한 행번호
	clickColNm = colNm;                     // 선택한 셀이름

	var title = '';
	var width = 0;

	if (divId == 'view1') {
		title = '스튜디오약물';
		width = 360;
	}
	else if (divId == 'view2') {
		title = '영상약물';
		width = 720;
	}
	else if (divId == 'view3') {
		title = '음향약물';
		width = 534;
	}
	else if (divId == 'view4') {
		title = 'PLP/PDP약물';
		width = 575;
	}

	cfn_popupLayer({
		id: 'wid_'+divId,
		title: title,
		position: fn_ImgViewPosition(width),
		remove: false,
		open: function() {}
	});
}

/**
 * 방송멘트 편집 에디터
 * @param rowId
 * @param printYn
 */
function fn_KQKQMng_OnAirEditor(rowId, printYn) {
	var stateFlag = $('#wid_d1VO').getRowData(rowId).stateFlag;                  // 상태플러그
	var qsheetOnairStatCd = $('#wid_m1VO input[name=qsheetOnairStatCd]').val();  // 큐시트방송상태코드

	// 큐시트아이템이 신규일경우
	if (stateFlag == "I") {
		alert("큐시트아이템을 저장해주십시요.");
		return;
	}

	var rowData = $('#wid_d1VO').getRowData(rowId);

	var artclId = rowData.artclId;                   // 기사ID
	var qsheetId = rowData.qsheetId;                 // 큐시트ID
	var qsheetItemId = rowData.qsheetItemId;         // 큐시트아이템ID
	var qsheetItemTitle = rowData.qsheetItemTitle;   // 아이템제목
	var artclKindCd = rowData.artclKindCd;           // 기사종류코드
	var groupId = rowData.groupId;                   // 그룹ID
	var onairMentId = rowData.onairMentId;           // 방송멘트ID
	var onairMentYn = rowData.onairMentYn;           // 멘트상태
	var gubun = "edit";                              // edit 구분자(큐시트: edit)
	var screenId = "KQKQMng";                        // 화면ID (큐시트)
	var qsheetItemKindCd = rowData.qsheetItemKindCd; // 타입

	// 앵커멘트 상태가 "N"이고 기사ID가 있을경우 방송멘트정보[KNPROG103]에 기사등록(방송멘트구분: C036ATC(기사멘트))
	if (onairMentYn == "N" && artclId) {
		// 방송멘트정보 등록
		ajaxRequest({
			async: false,
			url: '<c:url value="/kq/kq/KQKQMng/saveMentSeCd.do"/>',
			param: {artclId: artclId, qsheetItemId: qsheetItemId},
			callback: function(status, data) {
			}
		});
	}

	// 큐시트방송상태코드가 방송완료(B011OEN) 일경우 방송멘트 편집구분을 view모드로 설정
	if (qsheetOnairStatCd == "B011OEN") {
		gubun = "view";
	}

	// 방송메튼 편집  팝업 호출
	var param = {
		rowId: rowId,
		qsheetId: qsheetId,
		qsheetItemId: qsheetItemId,
		qsheetItemTitle: qsheetItemTitle,
		qsheetItemKindCd: qsheetItemKindCd,
		artclId: artclId,
		groupId: groupId,
		artclKindCd: artclKindCd,
		onairMentId: onairMentId,
		onairMentYn: onairMentYn,
		gubun: gubun,
		printYn: printYn,
		screenId: screenId
	};

	cfn_popupLayer({
		id: 'KQKQOnAirEditor',
		pid: 'wid',
		url: '<c:url value="/kq/kq/KQKQOnAirEditor/init.do"/>',
		title: '방송멘트 편집 에디터',
		param: param,
		width: 700,
		height: 600,
		callback: function(data) {}
	});
}

/**
 * 영상편집요청
 * @param rowId
 */
function fn_KQKQMng_VdoEdit(rowId) {
	var rowData = $('#wid_d1VO').getRowData(rowId);
	var qsheetId = rowData.qsheetId;                   // 큐시트ID
	var qsheetItemId = rowData.qsheetItemId;           // 큐시트아이템ID
	var qsheetItemTitle = rowData.qsheetItemTitle;     // 큐시트아이템 제목
	var qsheetItemKindCd = rowData.qsheetItemKindCd;   // 큐시트아이템 타입
	var artclId = rowData.artclId;                     // 기사ID
	var artclKindCd = rowData.artclKindCd;             // 기사종류코드
	var qsheetItemVideoId = rowData.qsheetItemVideoId; // 큐시트아이템영상ID
	var reqSeCd = "B002RQM";                                  // 요청구분코드(B002RQM:영상편집의뢰)
	var title = $('#wid_m1VO input[name=title]').val();    // 큐시트 제목
	var onairDt = $('#wid_m1VO input[name=onairDt]').val();// 큐시트 방송일자

	// 큐시트 아이템에 바로 붙은 영상이 있을경우 영상편집요청 불가
	if (qsheetItemVideoId) {
		alert("영상편집요청을 할수없읍니다.\n 큐시트에 링크된 큐시트아이템영상이 있읍니다.");
		return;
	}

	// 큐시트아이템 타입이 "END"일경우 영상편집요청 불가
	if (qsheetItemKindCd == "C012END") {
		alert("영상편집요청을 할수없읍니다.\n 큐시트아이템 타입(END)을 확인해주세요.");
		return;
	}

	cfn_popupLayer({
		id: 'KQKQVEditRequest',
		url: '<c:url value="/kq/kq/KQKQVEditRequest/init.do"/>',
		title: '영상편집',
		param: {
			artclKindCd: artclKindCd,
			artclId : artclId,
			qsheetItemTitle: qsheetItemTitle,
			reqSeCd: reqSeCd,
			qsheetItemId: qsheetItemId,
			title: title,
			onairDt: onairDt
		},
		width: 850,
		height: 530,
		callback: function(data) {
			// 기사ID 설정
			$('#wid_d1VO').setCell(rowId, 'artclId', data.artclId);

			// 영상편집요청여부 설정
			$('#wid_d1VO').setCell(rowId, 'videoEditReqYn', 'Y');

			// 기사상태 코드
			$('#wid_d1VO').setCell(rowId, 'artclStatCd', 'C010HLD');

			// 큐시트아이템 수정처리
			fn_KQKQMngUpdateMngD1(rowId);
		}
	});
}

/**
 * 큐시트방송멘트 상태설정
 * @param qsheetItemId
 * @param rowId
 * @param onairMentId
 * @param allTime
 * @param newGroupId
 */
function fn_KQKQMng_setOnairMent(qsheetItemId, rowId, onairMentId, allTime, newGroupId) {
	// 방송멘트상태 설정
	$('#wid_d1VO').setCell(rowId, 'onairMentYn', 'Y');

	// 방송멘트상태이미지 변경
	$('#wid_d1VO').setCell(rowId, 'airEditor', '');

	// 방송멘트ID 설정
	$('#wid_d1VO').setCell(rowId, 'onairMentId', onairMentId);

	// 예상방송 시간 설정
	$('#wid_d1VO').setCell(rowId, 'expectPrcsDur', allTime);

	// 그룹ID
	$('#wid_d1VO').setCell(rowId, 'groupId', newGroupId);

	// 예상누계 설정
	fn_setAggrTime();

	// 큐시트아이템 수정처리
	fn_KQKQMngUpdateMngD1(rowId);
}

/**
 * 원문기사보기
 * @param rowId
 * @param printYn
 */
function fn_KQKQMng_originalRptView(rowId, printYn) {
	// 팝업레이어 Y위치
	var popupLayer_positionY = 0;
	if ($('div[role=dialog]').last().css('top') != undefined) {
		popupLayer_positionY = parseInt($('div[role=dialog]').last().css('top')) + 30;

		if (popupLayer_positionY > 90) {
			popupLayer_positionY =0;
		}
	}

	var rowData = $('#wid_d1VO').getRowData(rowId);
	var qsheetId = rowData.qsheetId;           // 큐시트ID
	var qsheetItemId = rowData.qsheetItemId;   // 큐시트아이템ID
	var artclId = rowData.artclId;             // 기사ID
	var groupId = rowData.groupId;             // 그룹ID
	var artclKindCd = rowData.artclKindCd;     // 기사종류코드
	var title = rowData.qsheetItemTitle;       // 제목

	// 제목 <,> 문자 포함인 경우 변경
	title = title.replaceAll('>','&gt;');
	title = title.replaceAll('<','&lt;');

	// 기사ID가 없을경우
	if(!artclId) {
		alert("원문기사 내용이 없습니다.");
		return;
	}

	var param = {
		qsheetId: qsheetId,
		qsheetItemId: qsheetItemId,
		artclId: artclId,
		groupId: groupId,
		artclKindCd: artclKindCd,
		printYn: printYn,
		gubun: 'qMode',
		updatePtView: 'Y'
	};

	param.layerGubun = 'layerPop';
	cfn_popupLayer({
		id: 'KAKAArtclDetailr' + rowId,
		pid: 'wid',
		url: '<c:url value="/ka/ka/KAKAArtclDetail/init.do"/>',
		title: '[원문기사보기]' + title,
		param: param,
		position:['right', popupLayer_positionY],
		width: 740,
		height: 680,
		descroll:true,
		open : function(){
			// 스크롤처리
			$(this).addClass('descroll');
		},
		beforeClose: function() {
			// 에디터 파기
			if(CKEDITOR.instances['KAKAArtclDetailr' + rowId + '_editor1']){
				CKEDITOR.instances['KAKAArtclDetailr' + rowId + '_editor1'].destroy();
			}
		}
	});
}

/**
 * 기사 영상/오디오보기
 * @param rowId
 * @param gubun
 */
function fn_KQKQMng_KCTCVideoViewOpen(rowId, gubun) {
	// 선택한 RowData
	var rowData = $('#wid_d1VO').getRowData(rowId);
	var artclId = rowData.artclId;                     // 기사ID
	var artclKindCd = rowData.artclKindCd;             // 기사종류코드
	var mediaId = rowData.mediaId;                     // 미디어ID
	var title = rowData.qsheetItemTitle;               // 아이템 제목

	var param = {
		artclId: artclId,
		artclKindCd: artclKindCd,
		mediaId: mediaId,
		title : title,
		gubun : gubun
	};

	cfn_popupLayer({
		id: 'wid_KCTCVideoView',
		url: '<c:url value="/kc/tc/KCTCVideoView/init.do"/>',
		title: '영상보기',
		param: param,
		width: 1020,
		height: 600,
		isShadow: false
	});
}

/**
 * 큐시트 영상보기
 * @param rowId
 */
function fn_KQKQMng_KQKQVideoViewOpen(rowId) {
	// 선택한 RowData
	var rowData = $('#wid_d1VO').getRowData(rowId);
	var qsheetItemId = rowData.qsheetItemId;             // 큐시트아이템ID
	var qsheetItemVideoId = rowData.qsheetItemVideoId;   // 큐시트아이템영상ID
	var videoId = rowData.videoId;                       // 영상ID
	var title = rowData.qsheetItemTitle;                 // 아이템 제목

	// 큐시트아이템ID가 없을경우(큐시트전화후 저장전)
	if(!qsheetItemId) {
		alert('큐시트아이템 저장후 확인해주세요.');
		return;
	}

	var param = {
		qsheetItemId: qsheetItemId,
		qsheetItemVideoId: qsheetItemVideoId,
		videoId: videoId,
		title : title
	};

	cfn_popupLayer({
		id: 'wid_KCTCVideoView',
		url: '<c:url value="/kq/kq/KQKQVideoView/init.do"/>',
		title: '영상보기',
		param: param,
		width: 1020,
		height: 600,
		isShadow:false
	});
}

/**
 * 기사ID연결 팝업
 * @param rowId
 */
function fn_artclIdLinkOpen(rowId) {
	var rowData = $('#wid_d1VO').getRowData(rowId);         // 선택한 RowDat 취득
	var stateFlag = rowData.stateFlag;                         // 상태플러그
	var qsheetId = rowData.qsheetId;                           // 큐시트ID
	var qsheetItemOnairStatCd = rowData.qsheetItemOnairStatCd; // 아이템방송상태
	var isValid = true;

	// 큐시트방송상태 DB조회
	ajaxRequest({
		async: false,
		url: '<c:url value="/kq/kq/KQKQMng/selectQsheetOnairStatCd.do"/>',
		param: {qsheetId: qsheetId},
		callback: function(status, data) {
			if (data) {
				// 큐시트방송상태가 방송완료일경우
				var qsheetOnairStatCd = data.qsheetOnairStatCd;
				if (qsheetOnairStatCd == "B011OEN") {
					alert('큐시트방송상태가 방송완료상태입니다. 기사ID연결을 할수없습니다.');
					isValid = false;
				}
			}
		}
	});

	// 큐시트아이템 방송상태가 준비중 또는 방송중일경우
	if (qsheetItemOnairStatCd == "B012RDY" || qsheetItemOnairStatCd == "B012OAR") {
		alert('현재 송출 서버 OnAir 또는 StandBy중입니다. 기사ID연결을 할수없습니다.');
		isValid = false;
	}

	if (isValid == false) {
		return;
	}

	// 큐시트아이템이 신규일경우
	if (stateFlag == "I") {
		alert("큐시트아이템을 저장해주십시요.");
		return;
	}

	var artclId = rowData.artclId;                      // 기사ID
	var title = rowData.qsheetItemTitle;                // 아이템제목 -> 기사제목
	var rpterNm = rowData.rpterNm;                      // 리포터
	var qsheetItemId = rowData.qsheetItemId;            // 큐시트아이템ID
	var qsheetItemVideoId = rowData.qsheetItemVideoId;  // 큐시트아이템영상ID

	// jckim : 기사 종류가 '단신'일 경우 리포터 이름을 넘기지 않음
	if (rowData.qsheetItemKindCd == 'C012ABR') {
		rpterNm = "";
	}

	var param = {
		artclId: artclId,
		title: title,
		rpterNm: rpterNm,
		qsheetItemId: qsheetItemId,
		qsheetItemVideoId: qsheetItemVideoId
	};

	cfn_popupLayer({
		id: 'KAKAArtclLinkInquire',
		pid: 'wid',
		url: '<c:url value="/ka/ka/KAKAArtclLinkInquire/init.do"/>',
		title: '기사ID 링크',
		param: param,
		width: 710,
		height: 500,
		callback: function(data) {}
	});
}

/**
 * 슈퍼영역 위치 재정렬
 * - 슈퍼 offsetTop 재설정 (슈퍼아이콘과 높이유지)
 */
function fn_editor_refreshSuperPosition(body) {
	// 슈퍼 체크
	$(body).find('div[role=super]').each(function() {
		try {
			var seq = $(this).attr('seq');
			var $icon = $(body).find('img[role=super][seq=' + seq + '][src*=s_start]');

			if ($icon.length === 1) {
				var canvas = $(this).find('canvas').get(0);
				if (canvas != undefined) {
					var top = $icon.attr('superTop');
					$(this).css('top', parseInt(top));
				}
				else {
					$(this).remove();
					$(body).find('img[role=super][seq='+seq+']').remove();
				}
			}
		}
		catch (_ex) {
			//console.log(_ex);
		}
	});
}

/**
 * 슈퍼영역 SEQ 이미지
 */
function fn_editor_canvasSuperSeq(canvas, seq) {
	try {
		seq = new String(seq);

		switch(seq.length) {
			case 3:
				$(canvas).attr('width', 68);
				break;
			case 2:
				$(canvas).attr('width', 60);
				break;
			default:
				$(canvas).attr('width', 52);
				break;
		}
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.font = 'bold 14px GulimChe';
		context.fillStyle = '#333';
		context.fillText('[슈퍼' + seq + ']', -3, 14);
	}
	catch(_ex) {
		console.log(_ex);
	}
}

// 큐시트 인쇄
function fn_print_htmlView() {
	// 큐시트ID
	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();

	var movePrintPlan = [];
	var movePrintPlanId = $('#wid_movePrint [name=movePrintPlan]:checked').val();

	// 진행용1 큐시트뷰 인쇄
	if (movePrintPlanId == '1') {
		movePrintPlan = $('#KQKQSimplePrintView');
	}
	// 이펙트용 큐시트뷰 인쇄
	else if (movePrintPlanId == '2') {
		movePrintPlan = $('#KQKQEffectPrintView');
	}
	// 회의용 큐시트뷰 인쇄
	else if (movePrintPlanId == '3') {
		movePrintPlan = $('#KQKQMeetingPrintView');
	}
	// 진행용2 큐시트뷰 인쇄
	else if (movePrintPlanId == '4') {
		movePrintPlan = $('#KQKQNewsPrintView');
	}
	// jckim 20131115
	else if (movePrintPlanId == '5') {
		movePrintPlan = $('#KQKQGeneralPrintView');
	}

	// 진행용1 인쇄
	if (movePrintPlanId == '1') {
		cfn_popupLayer({
			id: 'KQKQSimplePrintView',
			pid: 'wid',
			url: '<c:url value="/kq/kq/KQKQSimplePrintView/init.do"/>',
			title: '진행용1',
			param: {qsheetId:qsheetId},
			width: 1190,
			height: 700,
			beforeClose: function(e) {},
			callback: function(data) {}
		});
	}
	// 이펙트용 인쇄
	else if (movePrintPlanId == '2') {
		cfn_popupLayer({
			id: 'KQKQEffectPrintView',
			pid: 'wid',
			url: '<c:url value="/kq/kq/KQKQEffectPrintView/init.do"/>',
			title: '이펙트용',
			param: {qsheetId:qsheetId},
			width: 1190,
			height: 700,
			beforeClose: function(e) {},
			callback: function(data) {}
		});
	}
	// 회의용 인쇄
	else if (movePrintPlanId == '3') {
		cfn_popupLayer({
			id: 'KQKQMeetingPrintView',
			pid: 'wid',
			url: '<c:url value="/kq/kq/KQKQMeetingPrintView/init.do"/>',
			title: '회의용',
			param: {qsheetId:qsheetId},
			width: 1190,
			height: 700,
			beforeClose: function(e) {},
			callback: function(data) {}
		});
	}
	// 진행용2 인쇄
	else if (movePrintPlanId == '4') {
		cfn_popupLayer({
			id: 'KQKQNewsPrintView',
			pid: 'wid',
			url: '<c:url value="/kq/kq/KQKQNewsPrintView/init.do"/>',
			title: '진행용2',
			param: {qsheetId:qsheetId},
			width: 1190,
			height: 700,
			beforeClose: function(e) {},
			callback: function(data) {}
		});
	}
	// jckim 20131115
	else if (movePrintPlanId == '5') {
		cfn_popupLayer({
			id: 'KQKQGeneralPrintView',
			pid: 'wid',
			url: '<c:url value="/kq/kq/KQKQGeneralPrintView/init.do"/>',
			title: '진행용3',
			param: {qsheetId:qsheetId},
			width: 1190,
			height: 700,
			beforeClose: function(e) {},
			callback: function(data) {}
		});
	}
}

/**
 * 웹 푸시 서비스 호출
 * @param pushMode
 * @param qsheetItemId
 * @param moveRowRn
 * @param moveSrcRowRn
 * @param position
 */
function fn_callWebpush(pushMode, qsheetItemId, moveRowRn, moveSrcRowRn, position) {
	// jckim
	console.log('[webpush] : ' + pushMode + ' / ' + qsheetItemId);

	if (IS_WEBPUSH_QSHEET != true) return;

	var qsheetId = $('#wid_m1VO input[name=qsheetId]').val();	//큐시트ID
	if(!qsheetId) return;

	var webpushUrl = '', webpushParam = {};

	switch(pushMode) {
		case 'MST_STATUS':
			webpushUrl = '<c:url value="/webpush/qsheetMastStatus.do"/>';
			webpushParam = {guid: guid, qsheetId: qsheetId};
			break;
		case 'ROW_BUNDLE':
			webpushUrl = '<c:url value="/webpush/qsheetMastStatus.do"/>';
			webpushParam = {guid: guid, qsheetId: qsheetId};
			break;
		case 'ROW_APPEND':
			webpushUrl = '<c:url value="/webpush/qsheetItemAppend.do"/>';
			webpushParam = {guid: guid, qsheetItemId: qsheetItemId, addPosition: position};
			break;
		case 'ROW_UPDATE':
			webpushUrl = '<c:url value="/webpush/qsheetItemUpdate.do"/>';
			webpushParam = {guid: guid, qsheetItemId: qsheetItemId};
			break;
		case 'ROW_DELETE':
			webpushUrl = '<c:url value="/webpush/qsheetItemDelete.do"/>';
			webpushParam = {guid: guid, qsheetId: qsheetId, qsheetItemId: qsheetItemId};
			break;
		case 'SEQ_CHANGE':
			webpushUrl = '<c:url value="/webpush/qsheetItemSeqChange.do"/>';
			webpushParam = {guid: guid, qsheetId: qsheetId, moveRowRn : moveRowRn, moveSrcRowRn : moveSrcRowRn};
			break;
		default:
			return;
	}

	ajaxRequest({
		async: true,
		url: webpushUrl,
		param: webpushParam,
		showMessage: false,
		warningMessage: false,
		callback: function(status, data) {}
	});
}