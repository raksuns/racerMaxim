/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
jQWidgets v3.1.0 (2013-Dec-23)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    $.jqx.dataAdapter = function (source, options) {
        function applyNormalizedIfDefined(source, properties)
        {
            for (var i = 0; i < properties.length; i++)
            {
                var propName = properties[i];
                var propNameLower = propName.toLower();
                
                if (source[propName] !== undefined)
                    source[propNameLower] = source[propName];
            }
        }
        
        if (source != undefined) {
            applyNormalizedIfDefined(source, [
                'dataFields',
                'dataType',
                'localData',
                'sortColumn',
                'sortDirection',
                'sortOrder',
                'formatData',
                'processData',
                'pageSize',
                'pageNum',
                'updateRow',
                'addRow',
                'deleteRow',
                'contentType',
                'totalRecords',
                'loadError',
                'sortComparer'
            ]);
        }

        this._source = source;
        this._options = options || {};
        this.records = [];
        this._downloadComplete = [];
        this._bindingUpdate = [];

        if (source != undefined && source.localdata != null && typeof source.localdata == "function") {
            var localData = source.localdata();
            if (localData == null)
                return;
                
            source._localdata = source.localdata;
            var me = this;
            if (source._localdata.subscribe) {
                me._oldlocaldata = [];
                source._localdata.subscribe(function (value) {
                    var deepClone = function (objThing) {
                        if (jQuery.isArray(objThing))
                            return jQuery.makeArray(deepClone($(objThing)));
                        
                        return jQuery.extend(true, {}, objThing);
                    };
                    
                    if (me.suspendKO == false || me.suspendKO == undefined || me._oldlocaldata.length == 0)
                        me._oldlocaldata = deepClone(value);
                    
                }, source._localdata, 'beforeChange');

                source._localdata.subscribe(function (value) {
                    if (me.suspendKO != false && me.suspendKO != undefined) 
                        return;
                        
                    var changeType = "";
                    me._oldrecords = me.records;
                    var len = me._oldlocaldata.length;
                    if (len == 0)
                    {
                        source.localdata = source._localdata();
                        changeType = 'change';
                    }
                    else {
                        if (len == value.length)
                            changeType = 'update';
                        else if (len > value.length)
                            changeType = 'remove';
                        else if (len < value.length)
                            changeType = 'add';
                    }
                    
                    me.dataBind(null, changeType);
                    
                }, source._localdata, 'change');

                me._knockoutdatasource = true;
            }

            source.localdata = localData;
            
        }
        
        if (this._options.autoBind == true)
            this.dataBind();
    }

    $.jqx.dataAdapter.prototype = {
        getrecords: function () {
            return this.records;
        },

        beginUpdate: function () {
            this.isUpdating = true;
        },

        endUpdate: function (refresh) {
            this.isUpdating = false;
            if (refresh != false) {
                if (this._changedrecords && this._changedrecords.length > 0) {
                    this.callBindingUpdate("update");
                    this._changedrecords = [];
                }
                else {
                    this.dataBind(null, "");
                }
            }
        },

        formatDate: function(value, format, calendar)
        {
            var result = $.jqx.dataFormat.formatdate(value, format, calendar);
            return result;
        },

        formatNumber: function (value, format, calendar) {
            var result = $.jqx.dataFormat.formatnumber(value, format, calendar);
            return result;
        },

        dataBind: function (objectuniqueId, collectionChanged) {
            if (this.isUpdating == true)
                return;

            var source = this._source;
            if (!source)
                return;

            $.jqx.dataFormat.datescache = new Array();
            if (source.dataFields != null)
                source.datafields = source.dataFields;

            if (source.recordstartindex == undefined)
                source.recordstartindex = 0;
            
            if (source.recordendindex == undefined)
                source.recordendindex = 0;
            
            if (source.loadallrecords == undefined)
                source.loadallrecords = true;

            if (source.sort != undefined)
                this.sort = source.sort;

            if (source.filter != undefined)
                this.filter = source.filter;
            else 
                this.filter = null;

            if (source.sortcolumn != undefined)
                this.sortcolumn = source.sortcolumn;

            if (source.sortdirection != undefined)
                this.sortdirection = source.sortdirection;

            if (source.sortcomparer != undefined)
                this.sortcomparer = source.sortcomparer;

            this.records = [];
            var options = this._options || {};
            this.virtualmode = options.virtualmode != undefined ? options.virtualmode : false;
            this.totalrecords = options.totalrecords != undefined ? options.totalrecords : 0;
            this.pageable = options.pageable != undefined ? options.pageable : false;
            this.pagesize = options.pagesize != undefined ? options.pagesize : 0;
            this.pagenum = options.pagenum != undefined ? options.pagenum : 0;
            this.cachedrecords = options.cachedrecords != undefined ? options.cachedrecords : new Array();
            this.originaldata = new Array();
            this.recordids = new Array();
            this.updaterow = options.updaterow != undefined ? options.updaterow : null;
            this.addrow = options.addrow != undefined ? options.addrow : null;
            this.deleterow = options.deleterow != undefined ? options.deleterow : null;
            this.cache = options.cache != undefined ? options.cache : false;
            this.unboundmode = false;
            if (source.formatdata != undefined) {
                options.formatData = source.formatdata;
            }
            if (source.data != undefined) {
                if (options.data == undefined)
                    options.data = {};
                
                $.extend(options.data, source.data);
            }

            if (source.mapchar != undefined)
                this.mapChar = source.mapchar ? source.mapchar : '>';
            else
                this.mapChar = options.mapChar ? options.mapChar : '>';

            if (options.unboundmode || source.unboundmode)
                this.unboundmode = options.unboundmode || source.unboundmode;

            if (source.cache != undefined)
                this.cache = source.cache;

            if (this.koSubscriptions)
            {
                for (var subscription = 0; subscription < this.koSubscriptions.length; subscription++)
                    this.koSubscriptions[subscription].dispose();
            }
            
            this.koSubscriptions = new Array();

            if (this.pagenum < 0)
                this.pagenum = 0;

            var me = this;

            var datatype = source.datatype;

            if (source.datatype === 'csv' || source.datatype === 'tab' || source.datatype == 'text')
                datatype = 'text';

            var async = options.async != undefined ? options.async : true;

            if (source.async != undefined) {
                async = source.async;
            }

            switch (datatype) {
                case "local":
                case "array":
                case "observablearray":
                default:
                    if (source.localdata == undefined && source.length) {
                        source.localdata = new Array();
                        for (var i = 0; i < source.length; i++) {
                            source.localdata[source.localdata.length] = source[i];
                            source[i].uid = i;
                        }
                    }
                    if (source.beforeprocessing && $.isFunction(source.beforeprocessing)) {
                        source.beforeprocessing(source.localdata);
                    }

                    var length = source.localdata.length;
                    this.totalrecords = this.virtualmode ? (source.totalrecords || length) : length;

                    if (this.unboundmode) {
                        this.totalrecords = this.unboundmode ? (source.totalrecords || length) : length;
                        var datafieldslength = source.datafields ? source.datafields.length : 0;
                        if (datafieldslength > 0) {
                            for (var i = 0; i < this.totalrecords; i++) {
                                var record = {};
                                for (var j = 0; j < datafieldslength; j++) {
                                    record[source.datafields[j].name] = "";
                                }
                                record.uid = i;
                                source.localdata[source.localdata.length] = record;
                            }
                        }
                    }

                    if (this.totalrecords == undefined) {
                        this.totalrecords = 0;
                    }

                    var datafieldslength = source.datafields ? source.datafields.length : 0;
                    var getrecord = function (record, datafieldslength) {
                        var datarow = {};
                        for (var j = 0; j < datafieldslength; j++) {
                            var datafield = source.datafields[j];
                            var value = '';
                            if (undefined == datafield || datafield == null) {
                                continue;
                            }

                            if (datafield.map) {
                                if ($.isFunction(datafield.map)) {
                                    value = datafield.map(record);
                                }
                                else {
                                    var splitMap = datafield.map.split(me.mapChar);
                                    if (splitMap.length > 0) {
                                        var datarecord = record;
                                        for (var p = 0; p < splitMap.length; p++) {
                                            datarecord = datarecord[splitMap[p]];
                                        }
                                        value = datarecord;
                                    }
                                    else {
                                        value = record[datafield.map];
                                    }
                                }

                                if (value != undefined && value != null) {
                                    value = value.toString();
                                }
                                else {
                                    if (value == undefined && value != null) {
                                        value = '';
                                    }
                                }
                            }
                            // searches by both selectors when necessary.
                            if (value == '') {
                                value = record[datafield.name];
                                if (value != undefined && value != null) {
                                    if (source._localdata && value.subscribe) {
                                        value = value();
                                    }
                                    else {
                                        value = value.toString();
                                    }
                                }
                            }

                            value = me.getvaluebytype(value, datafield);
                            if (datafield.displayname != undefined) {
                                datarow[datafield.displayname] = value;
                            }
                            else {
                                datarow[datafield.name] = value;
                            }
                        }
                        return datarow;
                    }

                    if (source._localdata) {
                        this._changedrecords = [];
                        this.records = new Array();
                        var localdata = source._localdata();

                        $.each(localdata, function (i, value) {
                            if (typeof value === 'string') {
                                me.records.push(value);
                            }
                            else {
                                var record = {};
                                var _koindex = 0;
                                var dataObject = this;
                                $.each(this, function (obj, objvalue) {
                                    var map = null;
                                    var type = 'string';
                                    var dataFieldName = obj;
                                    if (datafieldslength > 0) {
                                        var hasField = false;
                                        var hasMap = false;
                                        for (var j = 0; j < datafieldslength; j++) {
                                            var datafield = source.datafields[j];
                                            if (datafield != undefined && (datafield.name == obj)) {
                                                hasField = true;
                                                map = datafield.map;
                                                type = datafield.type;
                                                dataFieldName = datafield.name;
                                                break;
                                            }
                                            else if (datafield != undefined && datafield.map && (datafield.map.indexOf(obj) >= 0)) {
                                                hasField = true;
                                                map = datafield.map;
                                                type = datafield.type;
                                                dataFieldName = datafield.name;
                                                hasMap = true;
                                                var value = dataObject[obj];
                                                if (map != null) {
                                                    var splitMap = map.split(me.mapChar);
                                                    if (splitMap.length > 0) {
                                                        var datarecord = dataObject;
                                                        for (var p = 0; p < splitMap.length; p++) {
                                                            datarecord = datarecord[splitMap[p]];
                                                        }
                                                        value = datarecord;
                                                    }
                                                    else {
                                                        value = dataObject[map];
                                                    }
                                                }

                                                if (type != 'string') {
                                                    value = me.getvaluebytype(value, { type: type });
                                                }
                                                record[dataFieldName] = value;
                                                if (record[dataFieldName] != undefined) {
                                                    _koindex += record[dataFieldName].toString().length + record[dataFieldName].toString().substr(0, 1);
                                                }
                                            }
                                        }
                                        if (!hasField) return true;
                                        if (hasMap) return true;
                                    }

                                    var isFunction = $.isFunction(dataObject[obj]);
                                    if (isFunction) {
                                        var value = dataObject[obj]();
                                        if (type != 'string') {
                                            value = me.getvaluebytype(value, { type: type });
                                        }
                                        record[obj] = value;
                                        if (dataObject[obj].subscribe) {
                                            var recordindex = i;
                                            me.koSubscriptions[me.koSubscriptions.length] = dataObject[obj].subscribe(function (value) {
                                                var _changeindex = recordindex;
                                                record[obj] = value;
                                                var changedRecord = { index: _changeindex, oldrecord: record, record: record };
                                                me._changedrecords.push(changedRecord);
                                                if (me.isUpdating)
                                                    return;

                                                me.callBindingUpdate("update");
                                                me._changedrecords = [];
                                                return false;
                                            });
                                        }
                                    }
                                    else {
                                        var value = dataObject[obj];
                                        if (map != null) {
                                            var splitMap = map.split(me.mapChar);
                                            if (splitMap.length > 0) {
                                                var datarecord = dataObject;
                                                for (var p = 0; p < splitMap.length; p++) {
                                                    datarecord = datarecord[splitMap[p]];
                                                }
                                                value = datarecord;
                                            }
                                            else {
                                                value = dataObject[map];
                                            }
                                        }

                                        if (type != 'string') {
                                            value = me.getvaluebytype(value, { type: type });
                                        }
                                        record[dataFieldName] = value;
                                        if (record[dataFieldName] != undefined) {
                                            _koindex += record[dataFieldName].toString().length + record[dataFieldName].toString().substr(0, 1);
                                        }
                                    }
                                });

                                var recordid = me.getid(source.id, dataObject, i);
                                record.uid = recordid;
                                me.records.push(record);
                    
                                record._koindex = _koindex;
                                if (me._oldrecords) {
                                    var _changeindex = me.records.length - 1;
                                    if (collectionChanged == 'update') {
                                        if (me._oldrecords[_changeindex]._koindex != _koindex) {
                                            var changedRecord = { index: _changeindex, oldrecord: me._oldrecords[_changeindex], record: record };
                                            me._changedrecords.push(changedRecord);
                                        }
                                    }
                                }
                            }
                        });
                        if (collectionChanged == 'add') {
                            var length = me.records.length;
                            for (var i = 0; i < length; i++) {
                                var record = me.records[i];
                                var hasOldRecord = false;
                                for (var p = 0; p < me._oldrecords.length; p++) {
                                    if (me._oldrecords[p]._koindex === record._koindex) {
                                        hasOldRecord = true;
                                        break;
                                    }
                                }
                                if (!hasOldRecord) {
                                    me._changedrecords.push({ index: i, oldrecord: null, record: record, position: (i != 0 ? "last" : "first") });
                                }
                            }
                        }
                        else if (collectionChanged == 'remove') {
                            var length = me._oldrecords.length;
                            for (var i = 0; i < length; i++) {
                                var oldrecord = me._oldrecords[i];
                                if (!me.records[i]) {
                                    me._changedrecords.push({ index: i, oldrecord: oldrecord, record: null });
                                }
                                else {
                                    if (me.records[i]._koindex != oldrecord._koindex) {
                                        me._changedrecords.push({ index: i, oldrecord: oldrecord, record: null });
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (!$.isArray(source.localdata)) {
                            this.records = new Array();
                            $.each(source.localdata, function (i) {
                                var recordid = me.getid(source.id, this, i);

                                if (datafieldslength > 0) {
                                    var record = this;
                                    var datarow = getrecord(record, datafieldslength);
                                    datarow.uid = recordid;
                                    me.records[me.records.length] = datarow;                                  
                                }
                                else {
                                    this.uid = recordid;
                                    me.records[me.records.length] = this;
                                }
                            });
                        }
                        else {
                            if (datafieldslength == 0) {
                                $.each(source.localdata, function (i, value) {
                                    var record = $.extend({}, this);
                                    if (typeof value === "string") {
                                        me.records = source.localdata;
                                        return false;
                                    }
                                    else {
                                        var recordid = me.getid(source.id, record, i);
                                        if (typeof (recordid) === "object") {
                                            recordid = i;
                                        }
                                        record.uid = recordid;
                                        me.records[me.records.length] = record;
                                    }
                                });
                            }
                            else {
                                $.each(source.localdata, function (i) {
                                    var record = this;
                                    var datarow = getrecord(record, datafieldslength);
                                    var recordid = me.getid(source.id, datarow, i);
                                    if (typeof (recordid) === "object") {
                                        recordid = i;
                                    }
                                    var record = $.extend({}, datarow);
                                    record.uid = recordid;
                                    me.records[me.records.length] = record;
                                });
                            }
                        }
                    }

                    this.originaldata = source.localdata;
                    this.cachedrecords = this.records;
                    this.addForeignValues(source);
                    if (options.uniqueDataFields) {
                        var uniquerecords = this.getUniqueRecords(this.records, options.uniqueDataFields);
                        this.records = uniquerecords;
                        this.cachedrecords = uniquerecords;
                    }

                    if (options.beforeLoadComplete) {
                        var newRecords = options.beforeLoadComplete(me.records, this.originaldata);
                        if (newRecords != undefined) {
                            me.records = newRecords;
                            me.cachedrecords = newRecords;
                        }
                    }

                    if (options.autoSort && options.autoSortField) {
                        var tmpToString = Object.prototype.toString;
                        Object.prototype.toString = (typeof field == "function") ? field : function () { return this[options.autoSortField] };
                        me.records.sort(function (value1, value2) {
                            if (value1 === undefined) { value1 = null; }
                            if (value2 === undefined) { value2 = null; }
                            if (value1 === null && value2 === null) {
                                return 0;
                            }
                            if (value1 === null && value2 !== null) {
                                return 1;
                            }
                            if (value1 !== null && value2 === null) {
                                return -1;
                            }

                            value1 = value1.toString();
                            value2 = value2.toString();

                            if ($.jqx.dataFormat.isNumber(value1) && $.jqx.dataFormat.isNumber(value2)) {
                                if (value1 < value2) { return -1; }
                                if (value1 > value2) { return 1; }
                                return 0;
                            }
                            else if ($.jqx.dataFormat.isDate(value1) && $.jqx.dataFormat.isDate(value2)) {
                                if (value1 < value2) { return -1; }
                                if (value1 > value2) { return 1; }
                                return 0;
                            }
                            else if (!$.jqx.dataFormat.isNumber(value1) && !$.jqx.dataFormat.isNumber(value2)) {
                                value1 = String(value1).toLowerCase();
                                value2 = String(value2).toLowerCase();
                            }

                            try {
                                if (value1 < value2) { return -1; }
                                if (value1 > value2) { return 1; }
                            }
                            catch (error) {
                                var er = error;
                            }

                            return 0;
                        });
                        Object.prototype.toString = tmpToString;
                    }

                    me.loadedData = source.localdata;
                    me.buildHierarchy();

                    if ($.isFunction(options.loadComplete)) {
                        options.loadComplete(source.localdata, me.records);
                    }
                    break;
                case "json":
                case "jsonp":
                case "xml":
                case "xhtml":
                case "script":
                case "text":
                    {
                        if (source.localdata != null) {
                            if ($.isFunction(source.beforeprocessing)) {
                                source.beforeprocessing(source.localdata);
                            }
                            if (source.datatype === "xml") {
                                me.loadxml(source.localdata, source.localdata, source);
                            }
                            else if (datatype === "text") {
                                me.loadtext(source.localdata, source);
                            }
                            else {
                                me.loadjson(source.localdata, source.localdata, source);
                            }
                            me.addForeignValues(source);
                            if (options.uniqueDataFields) {
                                var uniquerecords = me.getUniqueRecords(me.records, options.uniqueDataFields);
                                me.records = uniquerecords;
                                me.cachedrecords = uniquerecords;
                            }

                            if (options.beforeLoadComplete) {
                                var newRecords = options.beforeLoadComplete(me.records, this.originaldata);
                                if (newRecords != undefined) {
                                    me.records = newRecords;
                                    me.cachedrecords = newRecords;
                                }
                            }

                            me.loadedData = source.localdata;
                            me.buildHierarchy.call(me);
                            if ($.isFunction(options.loadComplete)) {
                                options.loadComplete(source.localdata, me.records);
                            }
                            me.callBindingUpdate(collectionChanged);
                            return;
                        }

                        var postdata = options.data != undefined ? options.data : {};
                        // call the source object's processdata function.
                        if (source.processdata) {
                            source.processdata(postdata);
                        }
                        // call the adapter's process data function.
                        if ($.isFunction(options.processData)) {
                            options.processData(postdata);
                        }

                        // call the adapter's format data function.
                        if ($.isFunction(options.formatData)) {
                            var newpostdata = options.formatData(postdata);
                            if (newpostdata != undefined) {
                                postdata = newpostdata;
                            }
                        }

                        var contentType = 'application/x-www-form-urlencoded';
                        if (options.contentType) {
                            contentType = options.contentType;
                        }

                        var type = "GET";
                        if (source.type) {
                            type = source.type;
                        }

                        if (options.type) {
                            type = options.type;
                        }

                        if (source.url && source.url.length > 0) {
                            if ($.isFunction(options.loadServerData)) {
                                me._requestData(postdata, source, options);
                            }
                            else {
                                this.xhr = $.jqx.data.ajax({
                                    dataType: datatype,
                                    cache: this.cache,
                                    type: type,
                                    url: source.url,
                                    async: async,
                                    contentType: contentType,
                                    data: postdata,
                                    success: function (data, status, xhr) {
                                        if ($.isFunction(source.beforeprocessing)) {
                                            var tmpdata = source.beforeprocessing(data, status, xhr);
                                            if (tmpdata != undefined) {
                                                data = tmpdata;
                                            }
                                        }
                                        if ($.isFunction(options.downloadComplete)) {
                                            var tmpdata = options.downloadComplete(data, status, xhr);
                                            if (tmpdata != undefined) {
                                                data = tmpdata;
                                            }
                                        }

                                        if (data == null) {
                                            me.records = new Array();
                                            me.cachedrecords = new Array();
                                            me.originaldata = new Array();

                                            me.callDownloadComplete();
                                            if ($.isFunction(options.loadComplete)) {
                                                options.loadComplete(new Array());
                                            }
                                            return;
                                        }

                                        var records = data;
                                        if (data.records) {
                                            records = data.records;
                                        }

                                        if (data.totalrecords != undefined) {
                                            source.totalrecords = data.totalrecords;
                                        }

                                        if (source.datatype === "xml") {
                                            me.loadxml(null, records, source);
                                        }
                                        else if (datatype === "text") {
                                            me.loadtext(records, source);
                                        }
                                        else {
                                            me.loadjson(null, records, source);
                                        }

                                        // add foreign values.
                                        me.addForeignValues(source);

                                        if (options.uniqueDataFields) {
                                            var uniquerecords = me.getUniqueRecords(me.records, options.uniqueDataFields);
                                            me.records = uniquerecords;
                                            me.cachedrecords = uniquerecords;
                                        }

                                        if (options.beforeLoadComplete) {
                                            var newRecords = options.beforeLoadComplete(me.records, data);
                                            if (newRecords != undefined) {
                                                me.records = newRecords;
                                                me.cachedrecords = newRecords;
                                            }
                                        }

                                        me.loadedData = data;
                                        me.buildHierarchy.call(me);

                                        me.callDownloadComplete();
                                        if ($.isFunction(options.loadComplete)) {
                                            options.loadComplete(data, status, xhr, me.records);
                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        if ($.isFunction(source.loaderror)) { source.loaderror(xhr, status, error); }
                                        if ($.isFunction(options.loadError)) { options.loadError(xhr, status, error); }
                                        xhr = null;
                                        me.callDownloadComplete();
                                    },
                                    beforeSend: function (xhr, settings) {
                                        if ($.isFunction(options.beforeSend)) { options.beforeSend(xhr, settings); }
                                        if ($.isFunction(source.beforesend)) { source.beforesend(xhr, settings); }
                                    }
                                });
                            }
                        }
                        else {
                            me.callDownloadComplete();
                            if ($.isFunction(options.loadComplete)) {
                                options.loadComplete(data);
                            }
                        }
                    }
                    break;
            }
            this.callBindingUpdate(collectionChanged);
        },

        buildHierarchy: function(dataRecords)
        {
            var source = this._source;
            var hierarchy = new Array();
            if (!source.datafields) {
                return;
            }

            if (source.hierarchy && !source.hierarchy.reservedNames) {
                source.hierarchy.reservedNames = {
                    leaf: "leaf",
                    parent: "parent",
                    expanded: "expanded",
                    checked: "checked",
                    selected: "selected",
                    level: "level",
                    icon: "icon",
                    data: "data"
                }
            }
            else {
                if (source.hierarchy) {
                    var names = source.hierarchy.reservedNames;
                    if (!names.leaf) names.leaf = "leaf";
                    if (!names.parent) names.parent = "parent";
                    if (!names.expanded) names.expanded = "expanded";
                    if (!names.checked) names.checked = "checked";
                    if (!names.selected) names.selected = "selected";
                    if (!names.level) names.level = "level";
                    if (!names.data) names.data = "data";
                }
            }

            if (!source.hierarchy) {
                return;
            }

            var that = this;
            var names = source.hierarchy.reservedNames;
            if (source.hierarchy.root) {
                if (source.dataType == "xml") {
                    var hierarchy = this.getRecordsHierarchy('uid', 'parentuid', 'records', null, dataRecords);
                    this.hierarchy = hierarchy;
                    return hierarchy;
                }
                else {
                    this.hierarchy = this.records;
                    var root = source.hierarchy.root;
                    for (var i = 0; i < this.records.length; i++) {
                        var record = this.records[i];
                        if (!record) {
                            continue;
                        }

                        var addRecords = function (record) {
                            if (source.hierarchy.record) {
                                record.records = record[root][source.hierarchy.record];
                            }
                            else {
                                var splitMap = root.split(that.mapChar);
                                var records = null;
                                if (splitMap.length > 1) {
                                    var d = record;
                                    for (var p = 0; p < splitMap.length; p++) {
                                        if (d != undefined) {
                                            d = d[splitMap[p]];
                                        }
                                    }
                                    records = d;
                                }
                                else records = record[root];
                                record.records = records;
                            }
                            if (record.records == null || (record.records && record.records.length == 0)) {
                                record[names.leaf] = true;
                            }
                        }
                        addRecords(record);
                        record[names.level] = 0;
                        var recordid = this.getid(source.id, record, i);
                        record.uid = recordid;
                        record[names.parent] = null;
                        record[names.data] = record;
                        if (record[names.expanded] === undefined) {
                            record[names.expanded] = false;
                        }
                        var drillThrough = function (parent, records) {
                            if (!records) {
                                parent.records = new Array();
                                return;
                            }

                            for (var i = 0; i < records.length; i++) {
                                var record = records[i];
                                if (!record) {
                                    continue;
                                }

                                addRecords(record);
                                record[names.level] = parent[names.level] + 1;
                                record[names.parent] = parent;
                                record[names.data] = record;
                                var recordid = that.getid(source.id, record, i);
                                if (recordid == i && source.id == null) {
                                    record.uid = parent.uid + "_" + recordid;
                                }
                                else {
                                    record.uid = recordid;
                                }

                                if (record[names.expanded] === undefined) {
                                    record[names.expanded] = false;
                                }
                                drillThrough(record, record.records);
                            }
                        }
                        drillThrough(record, record.records);
                    }
                }             
                return this.hierarchy;
            }

            if (source.hierarchy.keyDataField && source.hierarchy.parentDataField) {
                var hierarchy = this.getRecordsHierarchy(source.hierarchy.keyDataField.name, source.hierarchy.parentDataField.name, 'records', null, dataRecords);
                this.hierarchy = hierarchy;
                return hierarchy;
            }

            if (source.hierarchy.groupingDataFields) {
                var groups = new Array();
                for (var i = 0; i < source.hierarchy.groupingDataFields.length; i++) {
                    groups.push(source.hierarchy.groupingDataFields[i].name);
                }

                var hierarchy = this.getGroupedRecords(groups, 'records', 'label', null, 'data', null, 'parent', dataRecords);
                this.hierarchy = hierarchy;
                return hierarchy;
            }
        },

        addRecord: function (record, position, parentID) {
            var that = this;
            if (record == undefined)
                return false;
                
            if (parentID != undefined) {
                if (this.hierarchy.length <= 0) 
                    return false;
                    
                var traverse = function (records) {
                    if (!records)
                        return false;
                       
                    for (var i = 0; i < records.length; i++) {
                        var r = records[i];
                        if (r.uid == parentID) {
                            var names = (that._source && that._source.hierarchy) ? that._source.hierarchy.reservedNames : null;
                            record[names.parent] = r;
                            record[names.level] = r[names.level] + 1;

                            if (!r.records) 
                                r.records = [];
                            
                            if (position == 'last')
                                r.records.push(record);
                            else if (typeof position === 'number' && isFinite(position))
                                r.records.splice(position, 0, record);
                            else
                                r.records.splice(0, 0, record);
                            
                            that.records.push(record);
                            return true;
                        }
                        
                        if (r.records)
                            return traverse(r.records);
                    }
                }
                
                return traverse(this.hierarchy);
            }
            else {
                if (this.hierarchy && this.hierarchy.length > 0) {
                    if (position == 'last')
                        this.hierarchy.push(record);                    
                    else if (typeof position === 'number' && isFinite(position))
                        this.hierarchy.splice(position, 0, record);                    
                    else
                        this.hierarchy.splice(0, 0, record);
                    
                }
                else {
                    if (position == 'last')
                        this.records.push(record);
                    else if (typeof position === 'number' && isFinite(position))
                        this.records.splice(position, 0, record);
                    else
                        this.records.splice(0, 0, record);
                }
                
                return true;
            }
            
            return false;
        },

        deleteRecord: function(uid)
        {
            var that = this;
            if (this.hierarchy.length > 0) {
                var traverse = function (records) {
                    if (records) {
                        for (var i = 0; i < records.length; i++) {
                            var r = records[i];
                            if (r.uid == uid) {
                                records.splice(i, 1);
                                if (that.recordids[uid]) {
                                    delete that.recordids[uid];
                                }

                                var removeChildren = function (children) {
                                    for (var x = 0; x < children.length; x++) {
                                        var uid = children[x].uid;
                                        for (var j = 0; j < that.records.length; j++) {
                                            var r = that.records[j];
                                            if (r.uid == uid) {
                                                that.records.splice(j, 1);
                                                break;
                                            }
                                        }
                                        if (children[x].records) {
                                            removeChildren(children[x].records);
                                        }
                                    }
                                }
                                if (r.records) {
                                    removeChildren(r.records);                              
                                }
                                for (var j = 0; j < that.records.length; j++) {
                                    var r = that.records[j];
                                    if (r.uid == uid) {
                                        that.records.splice(j, 1);
                                        break;
                                    }
                                }
                                return true;
                            }
                            if (r.records) {
                                traverse(r.records);
                            }
                        }
                    }
                }
                traverse(this.hierarchy);
            }
            else {
                for (var i = 0; i < this.records.length; i++) {
                    var r = this.records[i];
                    if (r.uid == uid) {
                        this.records.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        },

        addForeignValues: function(source)
        {
            var me = this;
            var datafieldslength = source.datafields ? source.datafields.length : 0;
            for (var j = 0; j < datafieldslength; j++) {
                var datafield = source.datafields[j];
                if (datafield != undefined) {
                    if (datafield.values != undefined) {
                        if (datafield.value == undefined) datafield.value = datafield.name;
                        if (datafield.values['value'] == undefined) {
                            datafield.values['value'] = datafield.value;
                        }

                        var matchedIDs = new Array();
                        var start, end;
                        if (me.pageable && me.virtualmode) {
                            start = me.pagenum * me.pagesize;
                            end = start + me.pagesize;
                            if (end > me.totalrecords) {
                                end = me.totalrecords;
                            }
                        } else {
                            start = 0;
                            end = me.records.length;
                        }

                        for (var i = start; i < end; i++) {
                            var record = me.records[i];
                            var name = datafield.name;
                            var value = record[datafield.value];

                            if (matchedIDs[value] != undefined) {
                                record[name] = matchedIDs[value];
                            }
                            else {
                                for (var p = 0; p < datafield['values'].source.length; p++) {
                                    var sourcerecord = datafield.values.source[p];
                                    var sourcevalue = sourcerecord[datafield.values['value']];
                                    if (sourcevalue == undefined) {
                                        sourcevalue = sourcerecord.uid;
                                    }
                                    if (sourcevalue == value) {
                                        var label = sourcerecord[datafield.values['name']];
                                        record[name] = label;
                                        matchedIDs[value] = label;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else if (datafield.value != undefined) {
                        for (var i = 0; i < me.records.length; i++) {
                            var record = me.records[i];
                            record[datafield.name] = record[datafield.value];
                        }
                    }
                }
            }
        },

        abort: function () {
            if (this.xhr && this.xhr.readyState != 4) {
                this.xhr.abort();
                me.callDownloadComplete();
            }
        },

        _requestData: function (postdata, source, options) {
            var me = this;
            var success = function (requestedData) {
                if (requestedData.totalrecords) {
                    source.totalrecords = requestedData.totalrecords;
                    me.totalrecords = requestedData.totalrecords;
                }
                if (requestedData.records) {
                    me.records = requestedData.records;
                    me.cachedrecords = requestedData.records;
                }
                if ($.isFunction(options.loadComplete)) {
                    options.loadComplete(data);
                }
                me.callDownloadComplete();
            }
            options.loadServerData(postdata, source, success);
        },

        getUniqueRecords: function (records, dataFields) {
            if (records && dataFields) {
                var length = records.length;
                var datafieldslength = dataFields.length;

                var uniqueRecords = new Array();
                var lookupkeys = new Array();
                // loop through all records.
                for (var urec = 0; urec < length; urec++) {
                    var datarow = records[urec];
                    var lookupkey = "";
                    if (datarow == undefined)
                        continue;
                    // build lookup key from the datafield values.
                    for (var datafieldindex = 0; datafieldindex < datafieldslength; datafieldindex++) {
                        var datafield = dataFields[datafieldindex];
                        lookupkey += datarow[datafield] + "_";
                    }
                    // add the unique record.
                    if (!lookupkeys[lookupkey]) {
                        uniqueRecords[uniqueRecords.length] = datarow;
                    }
                    // add the lookup key.
                    lookupkeys[lookupkey] = true;
                }
            }

            return uniqueRecords;
        },

        getAggregatedData: function (aggregates, calendar, records) {
            var dataRecords = records;
            if (!dataRecords) {
                dataRecords = this.records;
            }
            var data = {};
            var dataValuesByAggregate = new Array();
            var length = dataRecords.length;
            if (length == 0) return;
            if (length == undefined) return;
            for (var i = 0; i < length; i++) {
                var record = dataRecords[i];
                for (var j = 0; j < aggregates.length; j++) {
                    var aggregate = aggregates[j];
                    var value = record[aggregate.name];
                    if (value === null) continue;
                    if (aggregate.aggregates) {
                        data[aggregate.name] = data[aggregate.name] || {};
                        dataValuesByAggregate[aggregate.name] = dataValuesByAggregate[aggregate.name] || 0;
                        dataValuesByAggregate[aggregate.name]++;
                        var _customCalcFunc = function (aggObject) {
                            for (obj in aggObject) {
                                var oldValue = data[aggregate.name][obj];
                                if (oldValue == null) {
                                    data[aggregate.name][obj] = 0;
                                    oldValue = 0;
                                }
                                if ($.isFunction(aggObject[obj])) {
                                    oldValue = aggObject[obj](oldValue, value, aggregate.name, record);
                                }
                                data[aggregate.name][obj] = oldValue;
                            }
                        }

                        var canParse = parseFloat(value);
                        if (isNaN(canParse)) canParse = false; else canParse = true;
                        if (canParse)
                            value = parseFloat(value);

                        if (typeof value === 'number' && isFinite(value)) {
                            $.each(aggregate.aggregates, function () {
                                var oldValue = data[aggregate.name][this];
                                if (oldValue == null) {
                                    oldValue = 0;
                                    if (this == 'min') oldValue = 9999999999999;
                                    if (this == 'max') oldValue = -9999999999999;
                                }
                                if (this == 'sum' || this == 'avg' || this == 'stdev'
                                || this == 'stdevp' || this == 'var' || this == 'varp') {
                                    oldValue += parseFloat(value);
                                }
                                else if (this == 'product') {
                                    if (i == 0)
                                        oldValue = parseFloat(value);
                                    else
                                        oldValue *= parseFloat(value);
                                }
                                else if (this == 'min') {
                                    oldValue = Math.min(oldValue, parseFloat(value));
                                }
                                else if (this == 'max') {
                                    oldValue = Math.max(oldValue, parseFloat(value));
                                }
                                else if (this == 'count') {
                                    oldValue++;
                                }
                                else if (typeof (this) == 'object') {
                                    _customCalcFunc(this);
                                    return;
                                }
                                data[aggregate.name][this] = oldValue;
                            });
                        }
                        else {
                            $.each(aggregate.aggregates, function () {
                                if (this == 'min' || this == 'max' || this == 'count' || this == 'product' || this == 'sum'
                                 || this == 'avg' || this == 'stdev'
                                || this == 'stdevp' || this == 'var' || this == 'varp') {
                                    var oldValue = data[aggregate.name][this];
                                    if (oldValue == null) {
                                        oldValue = 0;
                                    }
                                    data[aggregate.name][this] = oldValue;
                                    return true;
                                }

                                if (typeof (this) == 'object') {
                                    _customCalcFunc(this);
                                }
                            });
                        }
                    }
                }
            }

            for (var j = 0; j < aggregates.length; j++) {
                var aggregate = aggregates[j];
                if (!data[aggregate.name]) {
                    data[aggregate.name] = {};
                    $.each(aggregate.aggregates, function (index) {
                        data[aggregate.name][this] = 0;
                    });
                }

                if (data[aggregate.name]['avg'] != undefined) {
                    var value = data[aggregate.name]['avg'];
                    var dataValues = dataValuesByAggregate[aggregate.name];
                    if (dataValues === 0 || dataValues == undefined) {
                        data[aggregate.name]['avg'] = 0;
                    }
                    else {
                        data[aggregate.name]['avg'] = value / dataValues;
                    }
                }
                else if (data[aggregate.name]['count'] != undefined) {
                    data[aggregate.name]['count'] = length;
                }

                // stdev, stdevp, var, varp.
                // stdev - Standard deviation on a sample.
                // varp - Variance on an entire population.
                // var - Variance on a sample.
                if (data[aggregate.name]['stdev'] || data[aggregate.name]['stdevp']
                || data[aggregate.name]['var'] || data[aggregate.name]['varp']) {
                    $.each(aggregate.aggregates, function (index) {
                        if (this == 'stdev' || this == 'var' || this == 'varp' || this == 'stdevp') {
                            var value = data[aggregate.name][this];
                            var count = length;
                            var average = (value / length);
                            var sumSq = 0.0;
                            for (var i = 0; i < length; i++) {
                                var record = dataRecords[i];
                                var recordvalue = record[aggregate.name];
                                sumSq += (recordvalue - average) * (recordvalue - average);
                            }

                            var denominator = (this == 'stdevp' || this == 'varp') ? count : count - 1;
                            if (denominator == 0)
                                denominator = 1;

                            if (this == 'var' || this == 'varp') {
                                data[aggregate.name][this] = sumSq / denominator;
                            }
                            else if (this == 'stdevp' || this == 'stdev') {
                                data[aggregate.name][this] = Math.sqrt(sumSq / denominator);
                            }
                        }
                    });
                }

                if (aggregate.formatStrings) {
                    $.each(aggregate.aggregates, function (index) {
                        var formatString = aggregate.formatStrings[index];
                        if (formatString) {
                            if (this == 'min' || this == 'max' || this == 'count' || this == 'product' || this == 'sum'
                                 || this == 'avg' || this == 'stdev'
                                || this == 'stdevp' || this == 'var' || this == 'varp') {
                                var value = data[aggregate.name][this];
                                data[aggregate.name][this] = $.jqx.dataFormat.formatnumber(value, formatString, calendar);
                            }
                            else if (typeof this == 'object') {
                                for (obj in this) {
                                    var value = data[aggregate.name][obj];
                                    data[aggregate.name][obj] = $.jqx.dataFormat.formatnumber(value, formatString, calendar);
                                }
                            }
                        }
                    });
                }
            }
            return data;
        },

        bindDownloadComplete: function (id, func) {
            this._downloadComplete[this._downloadComplete.length] = { id: id, func: func };

        },

        unbindDownloadComplete: function (id) {
            for (var i = 0; i < this._downloadComplete.length; i++) {
                if (this._downloadComplete[i].id == id) {
                    this._downloadComplete[i].func = null;
                    this._downloadComplete.splice(i, 1);
                    break;
                }
            }
        },

        callDownloadComplete: function () {
            for (var complete = 0; complete < this._downloadComplete.length; complete++) {
                var downloadComplete = this._downloadComplete[complete];
                if (downloadComplete.func != null) {
                    downloadComplete.func();
                }
            }
        },

        setSource: function (source) {
            this._source = source;
        },

        generatekey: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        getGroupedRecords: function (groups, collectionName, groupName, mappingFields, recordName, valueName, parentName, data, startIndex) {
            var visualRows = 0;
            var self = this;
            if (!startIndex) startIndex = 0;
            var groupHashCodes = new Array();
            for (var iGroupColumn = 0; iGroupColumn < groups.length; iGroupColumn++) {
                groupHashCodes[iGroupColumn] = self.generatekey();
            }

            if (!collectionName) {
                collectionName = 'items';
            }

            if (!groupName) {
                groupName = 'group';
            }

            if (!recordName) {
                recordName = 'record';
            }

            if (!parentName) {
                parentName = 'parentItem';
            }

            if (undefined === valueName) {
                valueName = 'value';
            }

            var grouprecords = new Array();
            var grouprecordsindex = 0;
            var hashRowGroups = new Array();
            var groupslength = groups.length;
            var groupsHierarchy = new Array();
            if (!data) {
                var data = this.records;
            }

            var dataLength = data.length;

            var itemByRecord = function (record) {
                var itemObj = record;
                if (mappingFields) {
                    $.each(mappingFields, function () {
                        if (this.name && this.map) {
                            itemObj[this.map] = itemObj[this.name];
                        }
                    });
                }

                return itemObj;
            }

            for (var obj = 0; obj < dataLength; obj++) {
                var item = itemByRecord(data[obj]);
                id = item[self.uniqueId];
                var itemKeysHierarchy = new Array();
                var keys = 0;
                for (iGroupColumn = 0; iGroupColumn < groupslength; iGroupColumn++) {
                    var group = groups[iGroupColumn];
                    var value = item[group];

                    if (null == value)
                        continue;

                    itemKeysHierarchy[keys++] = { value: value, hash: groupHashCodes[iGroupColumn] };
                }

                if (itemKeysHierarchy.length != groupslength)
                    break;

                var parentItem = null;

                var lookupKey = "";
                var iLevel = -1;
                for (var q = 0; q < itemKeysHierarchy.length; q++) {
                    iLevel++;
                    var itemKey = itemKeysHierarchy[q].value;
                    var columnHash = itemKeysHierarchy[q].hash;
                    lookupKey = lookupKey + "_" + columnHash + "_" + itemKey;
                    if (hashRowGroups[lookupKey] != undefined && hashRowGroups[lookupKey] != null) {
                        parentItem = hashRowGroups[lookupKey];
                        continue;
                    }
                    if (parentItem == null) {
                        parentItem = { level: 0 };
                        parentItem[parentName] = null;
                        parentItem[groupName] = itemKey;
                        parentItem[recordName] = item;
                        if (item.expanded !== undefined) {
                            parentItem.expanded = item.expanded;
                        }
                        else
                        {
                            parentItem.expanded = false;
                        }

                        if (valueName) {
                            parentItem[valueName] = item[valueName];
                        }
                        parentItem[collectionName] = new Array();
                        var uid = grouprecords.length + startIndex;
                        if (!this._source.id || typeof item.uid === "number") {
                            uid = "Row" + uid;
                        }
                        parentItem.uid = uid;
                        grouprecords[grouprecordsindex++] = parentItem;
                    }
                    else {
                        var subItem = { level: parentItem.level + 1 };
                        subItem[parentName] = parentItem;
                        subItem[groupName] = itemKey;
                        subItem[collectionName] = new Array();
                        subItem[recordName] = item;
                        if (item.expanded !== undefined) {
                            subItem.expanded = item.expanded;
                        }
                        else {
                            subItem.expanded = false;
                        }

                        if (valueName) {
                            subItem[valueName] = item[valueName];
                        }
                        subItem.uid = parentItem.uid + "_" + parentItem[collectionName].length;
                        parentItem[collectionName][parentItem[collectionName].length] = subItem;
                        parentItem = subItem;
                    }

                    hashRowGroups[lookupKey] = parentItem;
                }

                if (item) {
                    item.leaf = true;
                }

                if (parentItem != null) {
                    if (this._source.id == null) {
                        item.uid = parentItem.uid + "_" + parentItem[collectionName].length;
                    }
                    item[parentName] = parentItem;
                    item.level = parentItem.level + 1;
                    parentItem[collectionName][parentItem[collectionName].length] = item;
                }
                else {
                    if (!item.uid) {
                        item.uid = this.generatekey();
                    }
                }
            }
            return grouprecords;
        },

        getRecordsHierarchy: function (fieldName, parentFieldName, collectionName, mappingFields, dataRecords) {
            var recordsHierarchy = new Array();
            var flatData = this.records;
            if (dataRecords) {
                flatData = dataRecords;
            }

            if (this.records.length == 0)
                return null;

            var subItemsName = collectionName != null ? collectionName : "items";
            var items = [];
            var data = flatData;
            var dataLength = data.length;
            var names = (this._source && this._source.hierarchy) ? this._source.hierarchy.reservedNames : null;

            var itemByRecord = function (record) {
                var itemObj = record;
                if (mappingFields) {
                    $.each(mappingFields, function () {
                        if (this.name && this.map) {
                            itemObj[this.map] = itemObj[this.name];
                        }
                    });
                }

                return itemObj;
            }

            // build hierarchical source.
            for (var i = 0; i < dataLength; i++) {
                var item = $.extend({}, data[i]);
                var parentid = item[parentFieldName];
                var id = item[fieldName];
                items[id] = { parentid: parentid, item: item };
            }

            for (var i = 0; i < dataLength; i++) {
                var item = $.extend({}, data[i]);
                var parentid = item[parentFieldName];
                var id = item[fieldName];

                if (items[parentid] != undefined) {
                    var item = { parentid: parentid, item: items[id].item };
                    var parentItem = items[parentid].item;
                    if (!parentItem[subItemsName]) {
                        parentItem[subItemsName] = [];
                    }
                    var length = parentItem[subItemsName].length;
                    var record = item.item;

                    if (!names)
                    {
                        if (record.parent == undefined) {
                            record.parent = parentItem;
                        }
                    }
                    else
                    {
                        if (record[names.parent] == undefined) {
                            record[names.parent] = parentItem;
                        }                   
                    }

                    var itemObj = itemByRecord(record);
                    parentItem[subItemsName][length] = itemObj;
                    items[parentid].item = parentItem;
                    items[id] = item;
                }
                else {
                    var record = items[id].item;
                    if (!names)
                    {
                        if (record.parent == undefined) {
                            record.parent = null;
                        }
                    }
                    else
                    {
                        if (record[names.parent] == undefined) {
                            record[names.parent] = null;
                        }
                    }

                    var itemObj = itemByRecord(record);
                    if (!names)
                    {
                        itemObj.level = 0;
                    }
                    else
                    {
                        itemObj[names.level] = 0;
                    }

                    recordsHierarchy[recordsHierarchy.length] = itemObj;
                }
            }
            if (recordsHierarchy.length != 0) {
                var updateLevels = function (level, records) {
                    for (var i = 0; i < records.length; i++) {
                        if (!names)
                        {
                            records[i].level = level;
                        }
                        else
                        {
                            records[i][names.level] = level;
                        }

                        var subRecords = records[i][subItemsName];
                        if (subRecords) {
                            if (subRecords.length > 0) {
                                updateLevels(level + 1, subRecords);
                            }
                            else {
                                if (!names)
                                {
                                    records[i].leaf = true;
                                }
                                else
                                {
                                    records[i][names.leaf] = true;
                                }
                            }
                        }
                        else {
                            if (!names)
                            {                 
                                records[i].leaf = true;
                            }
                            else
                            {
                                records[i][names.leaf] = true;
                            }
                        }
                    }
                };
                updateLevels(0, recordsHierarchy);
            }
            return recordsHierarchy;
        },

        bindBindingUpdate: function (id, func) {
            this._bindingUpdate[this._bindingUpdate.length] = { id: id, func: func };

        },

        unbindBindingUpdate: function (id) {
            for (var i = 0; i < this._bindingUpdate.length; i++) {
                if (this._bindingUpdate[i].id == id) {
                    this._bindingUpdate[i].func = null;
                    this._bindingUpdate.splice(i, 1);
                    break;
                }
            }
        },

        callBindingUpdate: function (collectionChanged) {
            for (var update = 0; update < this._bindingUpdate.length; update++) {
                var bindingUpdate = this._bindingUpdate[update];
                if (bindingUpdate.func != null) {
                    bindingUpdate.func(collectionChanged);
                }
            }
        },

        getid: function (id, record, index) {
            if (id != null && id.name != undefined) {
                if (id.name) {
                    var result = $(record).attr(id.name);
                    if (result != null && result.toString().length > 0) {
                        return result;
                    }
                    else if (id.map) {
                        try
                        {
                            var result = $(record).attr(id.map);
                            if (result != null && result.toString().length > 0) {
                                return result;
                            }
                            else if ($(id.map, record).length > 0) {
                                return $(id.map, record).text();
                            }
                            else if ($(id.name, record).length > 0) {
                                return $(id.name, record).text();
                            }
                        }
                        catch (error) {
                            return index;
                        }
                    }
                    return;
                }
            }

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
        },

        loadjson: function (jsondata, data, source) {
            if (typeof (jsondata) == 'string') {
                jsondata = $.parseJSON(jsondata);
            }

            if (source.root == undefined) source.root = '';
            if (source.record == undefined) source.record = '';

            var jsondata = jsondata || data;
            if (!jsondata) {
                jsondata = [];
            }

            var me = this;
            if (source.root != '') {
                var splitMap = source.root.split(me.mapChar);
                if (splitMap.length > 1) {
                    var d = jsondata;
                    for (var p = 0; p < splitMap.length; p++) {
                        if (d != undefined) {
                            d = d[splitMap[p]];
                        }
                    }
                    jsondata = d;
                }
                else {
                    if (jsondata[source.root] != undefined) {
                        jsondata = jsondata[source.root];
                    }
                    else {
                        $.each(jsondata, function (i) {
                            var root = this;
                            if (this == source.root) {
                                jsondata = this;
                                return false;
                            }
                            else if (this[source.root] != undefined) {
                                jsondata = this[source.root];
                            }
                        });
                    }

                    if (!jsondata) {
                        var splitMap = source.root.split(me.mapChar);
                        if (splitMap.length > 0) {
                            var d = jsondata;
                            for (var p = 0; p < splitMap.length; p++) {
                                if (d != undefined) {
                                    d = d[splitMap[p]];
                                }
                            }
                            jsondata = d;
                        }
                    }
                }
            }
            else {
                if (!jsondata.length) {
                    for (obj in jsondata) {
                        if ($.isArray(jsondata[obj])) {
                            jsondata = jsondata[obj];
                            break;
                        }
                    }
                }
            }

            if (jsondata != null && jsondata.length == undefined) {
                jsondata = $.makeArray(jsondata);
            }

            if (jsondata == null || jsondata.length == undefined) {
                alert('JSON Parse error.');
                return;
            }

            if (jsondata.length == 0) {
                this.totalrecords = 0;
                return;
            }

            var length = jsondata.length;
            this.totalrecords = this.virtualmode ? (source.totalrecords || length) : length;
            this.records = new Array();
            this.originaldata = new Array();

            var records = this.records;
            var recordsstartindex = !this.pageable ? source.recordstartindex : this.pagesize * this.pagenum;

            this.recordids = new Array();

            if (source.loadallrecords) {
                recordsstartindex = 0;
                length = this.totalrecords;
            }

            var dataoffset = 0;
            if (this.virtualmode) {
                recordsstartindex = !this.pageable ? source.recordstartindex : this.pagesize * this.pagenum;
                dataoffset = recordsstartindex;
                recordsstartindex = 0;
                length = this.totalrecords;
            }

            var datafieldslength = source.datafields ? source.datafields.length : 0;
            // auto-generate data columns
            if (datafieldslength == 0) {
                var firstrecord = jsondata[0];
                var datafields = new Array();
                for (obj in firstrecord) {
                    var field = obj;
                    datafields[datafields.length] = { name: field };
                }
                source.datafields = datafields;
                datafieldslength = datafields.length;
            }

            var index = recordsstartindex;
            for (var i = recordsstartindex; i < length; i++) {
                var record = jsondata[i];

                if (record == undefined)
                    break;

                if (source.record && source.record != '') {
                    record = record[source.record];
                    if (record == undefined)
                        continue;
                }

                var recordid = this.getid(source.id, record, i);
                if (typeof (recordid) === "object") {
                    recordid = i;
                }

                if (!this.recordids[recordid]) {
                    this.recordids[recordid] = record;
                    var datarow = {};

                    for (var j = 0; j < datafieldslength; j++) {
                        var datafield = source.datafields[j];
                        var value = '';
                        if (undefined == datafield || datafield == null) {
                            continue;
                        }

                        if (datafield.map) {
                            if ($.isFunction(datafield.map)) {
                                value = datafield.map(record);
                            }
                            else {
                                var splitMap = datafield.map.split(me.mapChar);
                                if (splitMap.length > 0) {
                                    var datarecord = record;
                                    for (var p = 0; p < splitMap.length; p++) {
                                        if (datarecord != undefined) {
                                            datarecord = datarecord[splitMap[p]];
                                        }
                                    }
                                    value = datarecord;
                                }
                                else {
                                    value = record[datafield.map];
                                }
                            }

                            if (value != undefined && value != null) {
                                value = value.toString();
                            }
                            else if (value == undefined && value != null) {
                                value = '';
                            }
                        }

                        // searches by both selectors when necessary.
                        if (value == '' && !datafield.map) {
                            value = record[datafield.name];
                            if (value == undefined && value != null) {
                                value = '';
                            }
                            // the datafield.value allows you to load values like: "Nombre":{"#text":"FASE 1"}, where the datafield is Nombre, the value is object. 
                            // If the datafield.value is "#text", the value that will be loaded will be "FASE 1".
                            if (datafield.value != undefined) {
                                if (value != undefined) {
                                    var tmpvalue = value[datafield.value];
                                    if (tmpvalue != undefined) {
                                        value = tmpvalue;
                                    }
                                }
                            }
                        }

                        value = this.getvaluebytype(value, datafield);
                        if (datafield.displayname != undefined) {
                            datarow[datafield.displayname] = value;
                        }
                        else {
                            datarow[datafield.name] = value;
                        }

                        if (datafield.type === "array") {
                            var updateValues = function (records) {
                                if (!records) return;
                                for (var t = 0; t < records.length; t++) {
                                    var record = records[t];
                                    if (!record) {
                                        continue;
                                    }

                                    for (var c = 0; c < datafieldslength; c++) {
                                        var datafield = source.datafields[c];
                                        var value = '';
                                        if (undefined == datafield || datafield == null) {
                                            continue;
                                        }

                                        if (datafield.map) {
                                            if ($.isFunction(datafield.map)) {
                                                value = datafield.map(record);
                                            }
                                            else {
                                                var splitMap = datafield.map.split(me.mapChar);
                                                if (splitMap.length > 0) {
                                                    var datarecord = record;
                                                    for (var p = 0; p < splitMap.length; p++) {
                                                        if (datarecord != undefined) {
                                                            datarecord = datarecord[splitMap[p]];
                                                        }
                                                    }
                                                    value = datarecord;
                                                }
                                                else {
                                                    value = record[datafield.map];
                                                }
                                            }

                                            if (value != undefined && value != null) {
                                                value = value.toString();
                                            }
                                            else if (value == undefined && value != null) {
                                                value = '';
                                            }
                                        }

                                        // searches by both selectors when necessary.
                                        if (value == '' && !datafield.map) {
                                            value = record[datafield.name];
                                            if (value == undefined && value != null) {
                                                value = '';
                                            }
                                            // the datafield.value allows you to load values like: "Nombre":{"#text":"FASE 1"}, where the datafield is Nombre, the value is object. 
                                            // If the datafield.value is "#text", the value that will be loaded will be "FASE 1".
                                            if (datafield.value != undefined) {
                                                if (value != undefined) {
                                                    var tmpvalue = value[datafield.value];
                                                    if (tmpvalue != undefined) {
                                                        value = tmpvalue;
                                                    }
                                                }
                                            }
                                        }

                                        value = this.getvaluebytype(value, datafield);
                                        if (datafield.displayname != undefined) {
                                            record[datafield.displayname] = value;
                                        }
                                        else {
                                            record[datafield.name] = value;
                                        }
                                        if (datafield.type === "array") {
                                            updateValues.call(this, value);
                                        }
                                    }
                                }
                            }
                            updateValues.call(this, value);
                        }
                    }

                    if (source.recordendindex <= 0 || recordsstartindex < source.recordendindex) {
                        records[dataoffset + index] = $.extend({}, datarow);
                        records[dataoffset + index].uid = recordid;

                        this.originaldata[dataoffset + index] = $.extend({}, records[i]);
                        index++;
                    }
                }
            }
            this.records = records;
            this.cachedrecords = this.records;
        },

        loadxml: function (xmldata, data, source) {
            if (typeof (xmldata) == 'string') {
                xmldata = data = $($.parseXML(xmldata));
                xmldata = null;
            }

            if (source.root == undefined) source.root = '';
            if (source.record == undefined) source.record = '';


            var xmldata;

            if ($.jqx.browser.msie && data) {
                if (data.xml != undefined) {
                    xmldata = $(source.root + " " + source.record, $.parseXML(data.xml));
                }
                else {
                    xmldata = xmldata || $(source.root + " " + source.record, data);
                }
            }
            else xmldata = xmldata || $(source.root + " " + source.record, data);

            if (!xmldata) {
                xmldata = [];
            }

            var length = xmldata.length;
            if (xmldata.length == 0) {
                return;
            }

            this.totalrecords = this.virtualmode ? (source.totalrecords || length) : length;
            this.records = new Array();
            this.originaldata = new Array();

            var records = this.records;
            var recordsstartindex = !this.pageable ? source.recordstartindex : this.pagesize * this.pagenum;

            this.recordids = new Array();

            if (source.loadallrecords) {
                recordsstartindex = 0;
                length = this.totalrecords;
            }

            var dataoffset = 0;
            if (this.virtualmode) {
                recordsstartindex = !this.pageable ? source.recordstartindex : this.pagesize * this.pagenum;
                dataoffset = recordsstartindex;
                recordsstartindex = 0;
                length = this.totalrecords;
            }

            var datafieldslength = source.datafields ? source.datafields.length : 0;
            // auto-generate data columns
            if (datafieldslength == 0) {
                var firstrecord = xmldata[0];
                var datafields = new Array();
                for (obj in firstrecord) {
                    var field = obj;
                    datafields[datafields.length] = { name: field };
                }
                source.datafields = datafields;
                datafieldslength = datafields.length;
            }

            var p = recordsstartindex;
            var hasArray = false;
            for (var i = recordsstartindex; i < length; i++) {
                var record = xmldata[i];
                if (record == undefined)
                    break;
       
                var recordid = this.getid(source.id, record, i);
                if (!this.recordids[recordid]) {
                    this.recordids[recordid] = record;
                    var datarow = {};

                    var multiLevel = false;
                    if (source.hierarchy && source.hierarchy.root) {           
                        multiLevel = true;
                    }

                    for (var j = 0; j < datafieldslength; j++) {
                        var datafield = source.datafields[j];
                        var value = '';
                        if (undefined == datafield || datafield == null) {
                            continue;
                        }

                        if (datafield.map) {
                            if ($.isFunction(datafield.map)) {
                                value = datafield.map(record);
                            }
                            else {
                                var attributeStartIndex = datafield.map.indexOf('[');
                                if (attributeStartIndex < 0) {
                                    value = $(datafield.map, record);
                                    if (value.length == 1) value = value.text();
                                    else {
                                        hasArray = true;
                                        var subArray = new Array();
                                        for (var f = 0; f < value.length; f++) {
                                            subArray.push($(value[f]).text());
                                        }
                                        value = subArray;
                                        if (multiLevel && subArray.length > 0) {
                                            value = subArray[0];
                                        }
                                    }
                                }
                                else {
                                    var submap = datafield.map.substring(0, attributeStartIndex - 1);
                                    var attributeEndIndex = datafield.map.indexOf(']');
                                    var attribute = datafield.map.substring(attributeStartIndex + 1, attributeEndIndex);
                                    value = $(submap, record).attr(attribute);
                                    if (value == undefined) {
                                        value = $(record).attr(attribute);
                                    }

                                    if (value == undefined) value = '';
                                }
                                if (value == '') {
                                    value = $(record).attr(datafield.map);
                                    if (value == undefined) value = '';
                                }
                            }
                        }
                        // searches by both selectors when necessary.
                        if (value == '') {
                            value = $(datafield.name, record);
                            if (value.length == 1) value = value.text();
                            else {
                                var subArray = new Array();
                                for (var f = 0; f < value.length; f++) {
                                    subArray.push($(value[f]).text());
                                }
                                value = subArray;
                                if (multiLevel && subArray.length > 0) {
                                    value = subArray[0];
                                }
                            }

                            if (value == '') {
                                value = $(record).attr(datafield.name);
                                if (value == undefined) value = '';
                            }
                            if (value == '') {
                                if (record.nodeName && record.nodeName == datafield.name && record.firstChild) {
                                    value = $(record.firstChild).text();
                                }
                            }
                        }

                        var originalvalue = value;
                        value = this.getvaluebytype(value, datafield);
                        if (datafield.displayname != undefined) {
                            datarow[datafield.displayname] = value;
                        }
                        else {
                            datarow[datafield.name] = value;
                        }
                    }
                    if (source.recordendindex <= 0 || recordsstartindex < source.recordendindex) {
                        records[dataoffset + p] = $.extend({}, datarow);
                        records[dataoffset + p].uid = recordid;

                        this.originaldata[dataoffset + p] = $.extend({}, records[i]);
                        p++;
                    }
                }
            }

            if (source.hierarchy && source.hierarchy.root) {
                for (var i = recordsstartindex; i < length; i++) {
                    var record = xmldata[i];
                    var dataRecord = records[i];

                    if ($(record).parent().length > 0) {
                        var recordid = this.getid(source.id, $(record).parents(source.hierarchy.record + ":first" ));
                        dataRecord.parentuid = recordid;
                    }
                    else {
                        dataRecord.parentuid = null;
                    }
                }
            }

            this.records = records;
            this.cachedrecords = this.records;
        },

        loadtext: function (data, source) {
            if (data == null) {
                return;
            }

            var rowDelimiter = source.rowDelimiter || this.rowDelimiter || '\n';
            var rows = data.split(rowDelimiter);
            var length = rows.length;

            this.totalrecords = this.virtualmode ? (source.totalrecords || length) : length;
            this.records = new Array();
            this.originaldata = new Array();

            var records = this.records;
            var recordsstartindex = !this.pageable ? source.recordstartindex : this.pagesize * this.pagenum;

            this.recordids = new Array();

            if (source.loadallrecords) {
                recordsstartindex = 0;
                length = this.totalrecords;
            }

            var dataoffset = 0;
            if (this.virtualmode) {
                recordsstartindex = !this.pageable ? source.recordstartindex : this.pagesize * this.pagenum;
                dataoffset = recordsstartindex;
                recordsstartindex = 0;
                length = this.totalrecords;
            }

            var datafieldslength = source.datafields.length;
            var columnDelimiter = source.columnDelimiter || this.columnDelimiter;
            if (!columnDelimiter)
                columnDelimiter = (source.datatype === 'tab' || source.datatype === 'tsv') ? '\t' : ',';

            for (var i = recordsstartindex; i < length; i++) {
                var record = rows[i];
                var recordid = null;//this.getid(source.id, record, i);
                if (!this.recordids[recordid]) {
                    if (source.id === null) {
                        recordid = i;
                        this.recordids[recordid] = record;
                    }

                    var datarow = {};
                    var columns = $.jqx.data.splitRow(rows[i], columnDelimiter); //rows[i].split(columnDelimiter);

                    for (var j = 0; j < datafieldslength; j++) {
                        if (j >= columns.length)
                            continue;
                        var datafield = source.datafields[j];

                        var value = columns[j];
                        if (datafield.map && $.isFunction(datafield.map)) {
                            value = datafield.map(record);
                        }

                        if (datafield.type) {
                            value = this.getvaluebytype(value, datafield);
                        }

                        var key = datafield.map || datafield.name || j.toString();
                        datarow[key] = value;
                        if (source.id != null) {
                            if (source.id === datafield.name) {
                                recordid = value;
                                this.recordids[recordid] = record;
                            }
                        }
                    }

                    records[dataoffset + i] = $.extend({}, datarow);
                    records[dataoffset + i].uid = recordid;

                    this.originaldata[dataoffset + i] = $.extend({}, records[i]);
                }
            }
            this.records = records;
            this.cachedrecords = this.records;
        },

        getvaluebytype: function (value, datafield) {
            var originalvalue = value;
            if (value == null) return value;
            if ($.isArray(value) && datafield.type != "array") {
                for (var t = 0; t < value.length; t++) {
                    value[t] = this.getvaluebytype(value[t], datafield);
                }
                return value;
            }

            if (datafield.type == 'date') {
                if (value == "NaN") {
                    value = "";
                }
                else {
                    var tmpvalue = new Date(value);

                    if (typeof value == 'string') {
                        if (datafield.format) {
                            var newtmpvalue = $.jqx.dataFormat.parsedate(value, datafield.format);
                            if (newtmpvalue != null) {
                                tmpvalue = newtmpvalue;
                            }
                        }
                    }

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
            }
            else if (datafield.type == 'float' || datafield.type == 'number' || datafield.type == 'decimal') {
                if (value == "NaN") value = "";
                else {
                    var value = parseFloat(value);
                    if (isNaN(value)) {
                        value = originalvalue;
                    }
                }
            }
            else if (datafield.type == 'int' || datafield.type == 'integer') {
                var value = parseInt(value);
                if (isNaN(value)) {
                    value = originalvalue;
                }
            }
            else if (datafield.type == 'bool' || datafield.type == 'boolean') {
                if (value != null) {
                    if (value.toLowerCase != undefined) {
                        if (value.toLowerCase() == 'false') {
                            value = false;
                        }
                        else if (value.toLowerCase() == 'true') {
                            value = true;
                        }
                    }
                }

                if (value == 1) {
                    value = true;
                }
                else if (value == 0 && value !== "") {
                    value = false;
                }
                else value = '';
            }

            return value;
        }
    }

    $.jqx.dataFormat = {};

    $.extend($.jqx.dataFormat, {
        regexTrim: /^\s+|\s+$/g,
        regexInfinity: /^[+-]?infinity$/i,
        regexHex: /^0x[a-f0-9]+$/i,
        regexParseFloat: /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/,
        toString: Object.prototype.toString,

        isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        isObject: function (value) {
            return (value && (typeof value === 'object' || $.isFunction(value))) || false;
        },

        isDate: function (value) {
            return value instanceof Date;
        },

        arrayIndexOf: function (array, item) {
            if (array.indexOf) {
                return array.indexOf(item);
            }
            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        isString: function (value) {
            return typeof value === 'string';
        },

        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },

        isNull: function (value) {
            return value === null;
        },

        isUndefined: function (value) {
            return typeof value === 'undefined';
        },

        isValue: function (value) {
            return (this.isObject(value) || this.isString(value) || this.isNumber(value) || this.isBoolean(value));
        },

        isEmpty: function (value) {
            if (!this.isString(value) && this.isValue(value)) {
                return false;
            } else if (!this.isValue(value)) {
                return true;
            }
            value = $.trim(value).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
            return value === "";
        },

        startsWith: function (value, pattern) {
            return value.indexOf(pattern) === 0;
        },

        endsWith: function (value, pattern) {
            return value.substr(value.length - pattern.length) === pattern;
        },

        trim: function (value) {
            return (value + "").replace(this.regexTrim, "");
        },

        isArray: function (obj) {
            return this.toString.call(obj) === "[object Array]";
        },

        defaultcalendar: function () {
            var calendar = {
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
                    zone1: "yyyy-MM-ddTHH:mm:ss-HH:mm",
                    zone2: "yyyy-MM-ddTHH:mm:ss+HH:mm",
                    custom: "yyyy-MM-ddTHH:mm:ss.fff"
                },
                percentsymbol: "%",
                currencysymbol: "$",
                currencysymbolposition: "before",
                decimalseparator: '.',
                thousandsseparator: ','
            }
            return calendar;
        },

        expandFormat: function (calendar, format) {
            // expands unspecified or single character date formats into the full pattern.
            format = format || "F";
            var pattern,
                patterns = calendar.patterns,
                len = format.length;
            if (len === 1) {
                pattern = patterns[format];
                if (!pattern) {
                    throw "Invalid date format string '" + format + "'.";
                }
                format = pattern;
            }
            else if (len === 2 && format.charAt(0) === "%") {
                // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
                format = format.charAt(1);
            }
            return format;
        },

        getEra: function (date, eras) {
            if (!eras) return 0;
            if (typeof date === 'string') {
                return 0;
            }

            var start, ticks = date.getTime();
            for (var i = 0, l = eras.length; i < l; i++) {
                start = eras[i].start;
                if (start === null || ticks >= start) {
                    return i;
                }
            }
            return 0;
        },

        toUpper: function (value) {
            // 'he-IL' has non-breaking space in weekday names.
            return value.split("\u00A0").join(' ').toUpperCase();
        },

        toUpperArray: function (arr) {
            var results = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                results[i] = this.toUpper(arr[i]);
            }
            return results;
        },

        getEraYear: function (date, cal, era, sortable) {
            var year = date.getFullYear();
            if (!sortable && cal.eras) {
                // convert normal gregorian year to era-shifted gregorian
                // year by subtracting the era offset
                year -= cal.eras[era].offset;
            }
            return year;
        },

        toUpper: function(value)
        {
            if (value) {
                return value.toUpperCase();
            }
            return "";
        },

        getDayIndex: function (cal, value, abbr) {
            var ret,
                days = cal.days,
                upperDays = cal._upperDays;
            if (!upperDays) {
                cal._upperDays = upperDays = [
                    this.toUpperArray(days.names),
                    this.toUpperArray(days.namesAbbr),
                    this.toUpperArray(days.namesShort)
                ];
            }
            value = value.toUpperCase();
            if (abbr) {
                ret = this.arrayIndexOf(upperDays[1], value);
                if (ret === -1) {
                    ret = this.arrayIndexOf(upperDays[2], value);
                }
            }
            else {
                ret = this.arrayIndexOf(upperDays[0], value);
            }
            return ret;
        },

        getMonthIndex: function (cal, value, abbr) {
            var months = cal.months,
                monthsGen = cal.monthsGenitive || cal.months,
                upperMonths = cal._upperMonths,
                upperMonthsGen = cal._upperMonthsGen;
            if (!upperMonths) {
                cal._upperMonths = upperMonths = [
                    this.toUpperArray(months.names),
                    this.toUpperArray(months.namesAbbr)
                ];
                cal._upperMonthsGen = upperMonthsGen = [
                    this.toUpperArray(monthsGen.names),
                    this.toUpperArray(monthsGen.namesAbbr)
                ];
            }
            value = this.toUpper(value);
            var i = this.arrayIndexOf(abbr ? upperMonths[1] : upperMonths[0], value);
            if (i < 0) {
                i = this.arrayIndexOf(abbr ? upperMonthsGen[1] : upperMonthsGen[0], value);
            }
            return i;
        },

        appendPreOrPostMatch: function (preMatch, strings) {
            // appends pre- and post- token match strings while removing escaped characters.
            // Returns a single quote count which is used to determine if the token occurs
            // in a string literal.
            var quoteCount = 0,
                escaped = false;
            for (var i = 0, il = preMatch.length; i < il; i++) {
                var c = preMatch.charAt(i);
                switch (c) {
                    case '\'':
                        if (escaped) {
                            strings.push("'");
                        }
                        else {
                            quoteCount++;
                        }
                        escaped = false;
                        break;
                    case '\\':
                        if (escaped) {
                            strings.push("\\");
                        }
                        escaped = !escaped;
                        break;
                    default:
                        strings.push(c);
                        escaped = false;
                        break;
                }
            }
            return quoteCount;
        },

        getTokenRegExp: function () {
            // regular expression for matching date and time tokens in format strings.
            return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
        },

        formatlink: function (value, format) {
            var target = '';
            if (format && format.target) { target = 'target=' + format.target; }
            if (target != '') {
                return "<a " + target + " href=\"" + value + "\">" + value + "</a>";
            }
            return "<a href=\"" + value + "\">" + value + "</a>";
        },

        formatemail: function (value) {
            return "<a href=\"mailto:" + value + "\">" + value + "</a>";
        },

        formatNumber: function (value, format, calendar)
        {
            return this.formatnumber(value, format, calendar);
        },

        formatnumber: function (value, format, calendar) {
            if (calendar == undefined || calendar == null || calendar == "") {
                calendar = this.defaultcalendar();
            }

            if (format === "" || format === null) {
                return value;
            }

            if (!this.isNumber(value)) {
                value *= 1;
            }
            var precision;
            if (format.length > 1) precision = parseInt(format.slice(1), 10);

            var options = {}
            var current = format.charAt(0).toUpperCase();

            options.thousandsSeparator = calendar.thousandsseparator;
            options.decimalSeparator = calendar.decimalseparator;
            switch (current) {
                case "D":
                case "d":
                case "F":
                case "f":
                    options.decimalPlaces = precision;
                    break;
                case "N":
                case "n":
                    options.decimalPlaces = 0;
                    break;
                case "C":
                case "c":
                    options.decimalPlaces = precision;
                    if (calendar.currencysymbolposition == "before") {
                        options.prefix = calendar.currencysymbol;
                    }
                    else {
                        options.suffix = calendar.currencysymbol;
                    }
                    break;
                case "P":
                case "p":
                    options.suffix = calendar.percentsymbol;
                    options.decimalPlaces = precision;
                    break;
                default:
                    throw "Bad number format specifier: " + current;
            }

            if (this.isNumber(value)) {
                var negative = (value < 0);
                var output = value + "";
                var decimalseparator = (options.decimalSeparator) ? options.decimalSeparator : ".";
                var decimalindex;
                if (this.isNumber(options.decimalPlaces)) {
                    // Round to the correct decimal place
                    var decimalplaces = options.decimalPlaces;
                    var decimal = Math.pow(10, decimalplaces);
                    output = (value * decimal).toFixed(0) / decimal + "";
                    decimalindex = output.lastIndexOf(".");
                    if (decimalplaces > 0) {
                        // Add the decimal separator
                        if (decimalindex < 0) {
                              output += decimalseparator;
                            decimalindex = output.length - 1;
                        }
                        // Replace the "."
                        else if (decimalseparator !== ".") {
                            output = output.replace(".", decimalseparator);
                        }
                        // Add missing zeros
                        while ((output.length - 1 - decimalindex) < decimalplaces) {
                            output += "0";
                        }
                    }
                }
                if (options.thousandsSeparator) {
                    var groupseparator = options.thousandsSeparator;
                    decimalindex = output.lastIndexOf(decimalseparator);
                    decimalindex = (decimalindex > -1) ? decimalindex : output.length;
                    var newoutput = output.substring(decimalindex);
                    var nCount = -1;
                    for (var i = decimalindex; i > 0; i--) {
                        nCount++;
                        if ((nCount % 3 === 0) && (i !== decimalindex) && (!negative || (i > 1))) {
                            newoutput = groupseparator + newoutput;
                        }
                        newoutput = output.charAt(i - 1) + newoutput;
                    }
                    output = newoutput;
                }
                // Prepend prefix
                output = (options.prefix) ? options.prefix + output : output;
                // Append suffix
                output = (options.suffix) ? output + options.suffix : output;
                return output;

            } else {
                return value;
            }
        },

        tryparsedate: function (value, calendar) {
            if (calendar == undefined || calendar == null) {
                calendar = this.defaultcalendar();
            }
            var me = this;
            if (value == "")
                return null;

            if (value != null && !value.substring) {
                value = value.toString();
            }

            if (value != null && value.substring(0, 6) == "/Date(") {
                var jsonDateRE = /^\/Date\((-?\d+)(\+|-)?(\d+)?\)\/$/;

                var date = new Date(+value.replace(/\/Date\((\d+)\)\//, '$1'));
                if (date == "Invalid Date") {
                    var m = value.match(/^\/Date\((\d+)([-+]\d\d)(\d\d)\)\/$/);
                    var date = null;
                    if (m)
                        date = new Date(1 * m[1] + 3600000 * m[2] + 60000 * m[3]);
                }
                if (date == null || date == "Invalid Date" || isNaN(date)) {
                    var arr = jsonDateRE.exec(value);
                    if (arr) {
                        // 0 - complete results; 1 - ticks; 2 - sign; 3 - minutes
                        var result = new Date(parseInt(arr[1]));
                        if (arr[2]) {
                            var mins = parseInt(arr[3]);
                            if (arr[2] === "-") {
                                mins = -mins;
                            }
                            var current = result.getUTCMinutes();
                            result.setUTCMinutes(current - mins);
                        }
                        if (!isNaN(result.valueOf())) {
                            return result;
                        }
                    }
                }

                return date;
            }

            patterns = calendar.patterns;
            for (prop in patterns) {
                date = me.parsedate(value, patterns[prop], calendar);
                if (date) {
                    if (prop == "ISO") {
                        var tmpDate = me.parsedate(value, patterns["ISO2"], calendar);
                        if (tmpDate) return tmpDate;
                    }
                    return date;
                }
            }

            if (value != null) {
                var tmpDate = null;
                var dateParts = [':', '/', '-'];
                var canParse = true;
                for (var part = 0; part < dateParts.length; part++) {
                    if (value.indexOf(dateParts[part]) != -1) {
                        canParse = false;
                    }
                }

                if (canParse) {
                    var number = new Number(value);
                    if (!isNaN(number)) {
                        return new Date(number);
                    }
                }
            }

            return null;
        },

        getparseregexp: function (cal, format) {
            // converts a format string into a regular expression with groups that
            // can be used to extract date fields from a date string.
            // check for a cached parse regex.
            var re = cal._parseRegExp;
            if (!re) {
                cal._parseRegExp = re = {};
            }
            else {
                var reFormat = re[format];
                if (reFormat) {
                    return reFormat;
                }
            }

            // expand single digit formats, then escape regular expression characters.
            var expFormat = this.expandFormat(cal, format).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"),
                regexp = ["^"],
                groups = [],
                index = 0,
                quoteCount = 0,
                tokenRegExp = this.getTokenRegExp(),
                match;

            // iterate through each date token found.
            while ((match = tokenRegExp.exec(expFormat)) !== null) {
                var preMatch = expFormat.slice(index, match.index);
                index = tokenRegExp.lastIndex;

                // don't replace any matches that occur inside a string literal.
                quoteCount += this.appendPreOrPostMatch(preMatch, regexp);
                if (quoteCount % 2) {
                    regexp.push(match[0]);
                    continue;
                }

                // add a regex group for the token.
                var m = match[0],
                    len = m.length,
                    add;
                switch (m) {
                    case 'dddd': case 'ddd':
                    case 'MMMM': case 'MMM':
                    case 'gg': case 'g':
                        add = "(\\D+)";
                        break;
                    case 'tt': case 't':
                        add = "(\\D*)";
                        break;
                    case 'yyyy':
                    case 'fff':
                    case 'ff':
                    case 'f':
                        add = "(\\d{" + len + "})";
                        break;
                    case 'dd': case 'd':
                    case 'MM': case 'M':
                    case 'yy': case 'y':
                    case 'HH': case 'H':
                    case 'hh': case 'h':
                    case 'mm': case 'm':
                    case 'ss': case 's':
                        add = "(\\d\\d?)";
                        break;
                    case 'zzz':
                        add = "([+-]?\\d\\d?:\\d{2})";
                        break;
                    case 'zz': case 'z':
                        add = "([+-]?\\d\\d?)";
                        break;
                    case '/':
                        add = "(\\" + cal["/"] + ")";
                        break;
                    default:
                        throw "Invalid date format pattern '" + m + "'.";
                        break;
                }
                if (add) {
                    regexp.push(add);
                }
                groups.push(match[0]);
            }
            this.appendPreOrPostMatch(expFormat.slice(index), regexp);
            regexp.push("$");

            // allow whitespace to differ when matching formats.
            var regexpStr = regexp.join('').replace(/\s+/g, "\\s+"),
                parseRegExp = { 'regExp': regexpStr, 'groups': groups };

            // cache the regex for this format.
            return re[format] = parseRegExp;
        },

        outOfRange: function (value, low, high) {
            return value < low || value > high;
        },

        expandYear: function (cal, year) {
            // expands 2-digit year into 4 digits.
            var now = new Date(),
        era = getEra(now);
            if (year < 100) {
                var twoDigitYearMax = cal.twoDigitYearMax;
                twoDigitYearMax = typeof twoDigitYearMax === 'string' ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
                var curr = this.getEraYear(now, cal, era);
                year += curr - (curr % 100);
                if (year > twoDigitYearMax) {
                    year -= 100;
                }
            }
            return year;
        },

        parsedate: function (value, format, calendar) {
            if (calendar == undefined || calendar == null) {
                calendar = this.defaultcalendar();
            }
            // try to parse the date string by matching against the format string
            // while using the specified culture for date field names.
            value = this.trim(value);
            var cal = calendar,
            // convert date formats into regular expressions with groupings.
            // use the regexp to determine the input format and extract the date fields.
                parseInfo = this.getparseregexp(cal, format),
                match = new RegExp(parseInfo.regExp).exec(value);
            if (match === null) {
                return null;
            }
            // found a date format that matches the input.
            var groups = parseInfo.groups,
                era = null, year = null, month = null, date = null, weekDay = null,
                hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
                pmHour = false;
            // iterate the format groups to extract and set the date fields.
            for (var j = 0, jl = groups.length; j < jl; j++) {
                var matchGroup = match[j + 1];
                if (matchGroup) {
                    var current = groups[j],
                        clength = current.length,
                        matchInt = parseInt(matchGroup, 10);
                    switch (current) {
                        case 'dd': case 'd':
                            // Day of month.
                            date = matchInt;
                            // check that date is generally in valid range, also checking overflow below.
                            if (this.outOfRange(date, 1, 31)) return null;
                            break;
                        case 'MMM':
                        case 'MMMM':
                            month = this.getMonthIndex(cal, matchGroup, clength === 3);
                            if (this.outOfRange(month, 0, 11)) return null;
                            break;
                        case 'M': case 'MM':
                            // Month.
                            month = matchInt - 1;
                            if (this.outOfRange(month, 0, 11)) return null;
                            break;
                        case 'y': case 'yy':
                        case 'yyyy':
                            year = clength < 4 ? this.expandYear(cal, matchInt) : matchInt;
                            if (this.outOfRange(year, 0, 9999)) return null;
                            break;
                        case 'h': case 'hh':
                            // Hours (12-hour clock).
                            hour = matchInt;
                            if (hour === 12) hour = 0;
                            if (this.outOfRange(hour, 0, 11)) return null;
                            break;
                        case 'H': case 'HH':
                            // Hours (24-hour clock).
                            hour = matchInt;
                            if (this.outOfRange(hour, 0, 23)) return null;
                            break;
                        case 'm': case 'mm':
                            // Minutes.
                            min = matchInt;
                            if (this.outOfRange(min, 0, 59)) return null;
                            break;
                        case 's': case 'ss':
                            // Seconds.
                            sec = matchInt;
                            if (this.outOfRange(sec, 0, 59)) return null;
                            break;
                        case 'tt': case 't':
                            // AM/PM designator.
                            // see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
                            // the AM tokens. If not, fail the parse for this format.
                            pmHour = cal.PM && (matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2]);
                            if (!pmHour && (!cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2]))) return null;
                            break;
                        case 'f':
                            // Deciseconds.
                        case 'ff':
                            // Centiseconds.
                        case 'fff':
                            // Milliseconds.
                            msec = matchInt * Math.pow(10, 3 - clength);
                            if (this.outOfRange(msec, 0, 999)) return null;
                            break;
                        case 'ddd':
                            // Day of week.
                        case 'dddd':
                            // Day of week.
                            weekDay = this.getDayIndex(cal, matchGroup, clength === 3);
                            if (this.outOfRange(weekDay, 0, 6)) return null;
                            break;
                        case 'zzz':
                            // Time zone offset in +/- hours:min.
                            var offsets = matchGroup.split(/:/);
                            if (offsets.length !== 2) return null;
                            hourOffset = parseInt(offsets[0], 10);
                            if (this.outOfRange(hourOffset, -12, 13)) return null;
                            var minOffset = parseInt(offsets[1], 10);
                            if (this.outOfRange(minOffset, 0, 59)) return null;
                            tzMinOffset = (hourOffset * 60) + (startsWith(matchGroup, '-') ? -minOffset : minOffset);
                            break;
                        case 'z': case 'zz':
                            // Time zone offset in +/- hours.
                            hourOffset = matchInt;
                            if (this.outOfRange(hourOffset, -12, 13)) return null;
                            tzMinOffset = hourOffset * 60;
                            break;
                        case 'g': case 'gg':
                            var eraName = matchGroup;
                            if (!eraName || !cal.eras) return null;
                            eraName = trim(eraName.toLowerCase());
                            for (var i = 0, l = cal.eras.length; i < l; i++) {
                                if (eraName === cal.eras[i].name.toLowerCase()) {
                                    era = i;
                                    break;
                                }
                            }
                            // could not find an era with that name
                            if (era === null) return null;
                            break;
                    }
                }
            }
            var result = new Date(), defaultYear, convert = cal.convert;
            defaultYear = result.getFullYear();
            if (year === null) {
                year = defaultYear;
            }
            else if (cal.eras) {
                // year must be shifted to normal gregorian year
                // but not if year was not specified, its already normal gregorian
                // per the main if clause above.
                year += cal.eras[(era || 0)].offset;
            }
            // set default day and month to 1 and January, so if unspecified, these are the defaults
            // instead of the current day/month.
            if (month === null) {
                month = 0;
            }
            if (date === null) {
                date = 1;
            }
            // now have year, month, and date, but in the culture's calendar.
            // convert to gregorian if necessary
            if (convert) {
                result = convert.toGregorian(year, month, date);
                // conversion failed, must be an invalid match
                if (result === null) return null;
            }
            else {
                // have to set year, month and date together to avoid overflow based on current date.
                result.setFullYear(year, month, date);
                // check to see if date overflowed for specified month (only checked 1-31 above).
                if (result.getDate() !== date) return null;
                // invalid day of week.
                if (weekDay !== null && result.getDay() !== weekDay) {
                    return null;
                }
            }
            // if pm designator token was found make sure the hours fit the 24-hour clock.
            if (pmHour && hour < 12) {
                hour += 12;
            }
            result.setHours(hour, min, sec, msec);
            if (tzMinOffset !== null) {
                // adjust timezone to utc before applying local offset.
                var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
                // Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
                // to ensure both these fields will not exceed this range.  adjustedMin will range
                // somewhere between -1440 and 1500, so we only need to split this into hours.
                result.setHours(result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60);
            }
            return result;
        },

        cleardatescache: function () {
            this.datescache = new Array();
        },

        formatDate: function (value, format, calendar)
        {
            return this.formatdate(value, format, calendar);
        },

        formatdate: function (value, format, calendar) {
            if (calendar == undefined || calendar == null) {
                calendar = this.defaultcalendar();
            }

            if (typeof value === 'string') {
                return value;
            }

            var lookupkey = value.toString() + "_" + format;
            if (this.datescache && this.datescache[lookupkey]) {
                return this.datescache[lookupkey];
            }

            if (!format || !format.length || format === 'i') {
                var ret;
                ret = this.formatDate(value, calendar.patterns.F, culture);
                return ret;
            }

            var eras = calendar.eras,
            sortable = format === "s";
            format = this.expandFormat(calendar, format);

            // Start with an empty string
            ret = [];
            var hour,
            zeros = ['0', '00', '000'],
            foundDay,
            checkedDay,
            dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
            quoteCount = 0,
            tokenRegExp = this.getTokenRegExp(),
            converted;

            function padZeros(num, c) {
                var r, s = num + '';
                if (c > 1 && s.length < c) {
                    r = (zeros[c - 2] + s);
                    return r.substr(r.length - c, c);
                }
                else {
                    r = s;
                }
                return r;
            }

            function hasDay() {
                if (foundDay || checkedDay) {
                    return foundDay;
                }
                foundDay = dayPartRegExp.test(format);
                checkedDay = true;
                return foundDay;
            }

            function getPart(date, part) {
                if (converted) {
                    return converted[part];
                }
                if (date.getMonth != undefined) {
                    switch (part) {
                        case 0: return date.getFullYear();
                        case 1: return date.getMonth();
                        case 2: return date.getDate();
                    }
                }
            }

            for (; ; ) {
                // Save the current index
                var index = tokenRegExp.lastIndex,
                // Look for the next pattern
                ar = tokenRegExp.exec(format);

                // Append the text before the pattern (or the end of the string if not found)
                var preMatch = format.slice(index, ar ? ar.index : format.length);
                quoteCount += this.appendPreOrPostMatch(preMatch, ret);

                if (!ar) {
                    break;
                }

                // do not replace any matches that occur inside a string literal.
                if (quoteCount % 2) {
                    ret.push(ar[0]);
                    continue;
                }

                var current = ar[0],
                clength = current.length;

                switch (current) {
                    case "ddd":
                        //Day of the week, as a three-letter abbreviation
                    case "dddd":
                        // Day of the week, using the full name
                        var names = (clength === 3) ? calendar.days.namesAbbr : calendar.days.names;
                        ret.push(names[value.getDay()]);
                        break;
                    case "d":
                        // Day of month, without leading zero for single-digit days
                    case "dd":
                        // Day of month, with leading zero for single-digit days
                        foundDay = true;
                        ret.push(padZeros(getPart(value, 2), clength));
                        break;
                    case "MMM":
                        // Month, as a three-letter abbreviation
                    case "MMMM":
                        // Month, using the full name
                        var part = getPart(value, 1);
                        ret.push(calendar.months[clength === 3 ? "namesAbbr" : "names"][part]);
                        break;
                    case "M":
                        // Month, as digits, with no leading zero for single-digit months
                    case "MM":
                        // Month, as digits, with leading zero for single-digit months
                        ret.push(padZeros(getPart(value, 1) + 1, clength));
                        break;
                    case "y":
                        // Year, as two digits, but with no leading zero for years less than 10
                    case "yy":
                        // Year, as two digits, with leading zero for years less than 10
                    case "yyyy":
                        // Year represented by four full digits
                        part = this.getEraYear(value, calendar, this.getEra(value, eras), sortable);
                        if (clength < 4) {
                            part = part % 100;
                        }
                        ret.push(padZeros(part, clength));
                        break;
                    case "h":
                        // Hours with no leading zero for single-digit hours, using 12-hour clock
                    case "hh":
                        // Hours with leading zero for single-digit hours, using 12-hour clock
                        hour = value.getHours() % 12;
                        if (hour === 0) hour = 12;
                        ret.push(padZeros(hour, clength));
                        break;
                    case "H":
                        // Hours with no leading zero for single-digit hours, using 24-hour clock
                    case "HH":
                        // Hours with leading zero for single-digit hours, using 24-hour clock
                        ret.push(padZeros(value.getHours(), clength));
                        break;
                    case "m":
                        // Minutes with no leading zero  for single-digit minutes
                    case "mm":
                        // Minutes with leading zero  for single-digit minutes
                        ret.push(padZeros(value.getMinutes(), clength));
                        break;
                    case "s":
                        // Seconds with no leading zero for single-digit seconds
                    case "ss":
                        // Seconds with leading zero for single-digit seconds
                        ret.push(padZeros(value.getSeconds(), clength));
                        break;
                    case "t":
                        // One character am/pm indicator ("a" or "p")
                    case "tt":
                        // Multicharacter am/pm indicator
                        part = value.getHours() < 12 ? (calendar.AM ? calendar.AM[0] : " ") : (calendar.PM ? calendar.PM[0] : " ");
                        ret.push(clength === 1 ? part.charAt(0) : part);
                        break;
                    case "f":
                        // Deciseconds
                    case "ff":
                        // Centiseconds
                    case "fff":
                        // Milliseconds
                        ret.push(padZeros(value.getMilliseconds(), 3).substr(0, clength));
                        break;
                    case "z":
                        // Time zone offset, no leading zero
                    case "zz":
                        // Time zone offset with leading zero
                        hour = value.getTimezoneOffset() / 60;
                        ret.push((hour <= 0 ? '+' : '-') + padZeros(Math.floor(Math.abs(hour)), clength));
                        break;
                    case "zzz":
                        // Time zone offset with leading zero
                        hour = value.getTimezoneOffset() / 60;
                        ret.push((hour <= 0 ? '+' : '-') + padZeros(Math.floor(Math.abs(hour)), 2) +
                        // Hard coded ":" separator, rather than using calendar.TimeSeparator
                        // Repeated here for consistency, plus ":" was already assumed in date parsing.
                    ":" + padZeros(Math.abs(value.getTimezoneOffset() % 60), 2));
                        break;
                    case "g":
                    case "gg":
                        if (calendar.eras) {
                            ret.push(calendar.eras[getEra(value, eras)].name);
                        }
                        break;
                    case "/":
                        ret.push(calendar["/"]);
                        break;
                    default:
                        throw "Invalid date format pattern '" + current + "'.";
                        break;
                }
            }

            var result = ret.join('');

            if (!this.datescache) {
                this.datescache = new Array();
            }

            this.datescache[lookupkey] = result;
            return result;
        }
    });

    // AJAX
    $.jqx.data = {};
    var
        ajaxLocParts,
        ajaxLocation,

        rhash = /#.*$/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rts = /([?&])_=[^&]*/,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        core_rspace = /\s+/,
        _load = jQuery.fn.load,
        prefilters = {},
        transports = {},
        allTypes = ["*/"] + ["*"];

    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    function addToPrefiltersOrTransports(structure) {

        return function (dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType, list, placeBefore,
                dataTypes = dataTypeExpression.toLowerCase().split(core_rspace),
                i = 0,
                length = dataTypes.length;

            if (jQuery.isFunction(func)) {
                for (; i < length; i++) {
                    dataType = dataTypes[i];
                    placeBefore = /^\+/.test(dataType);
                    if (placeBefore) {
                        dataType = dataType.substr(1) || "*";
                    }
                    list = structure[dataType] = structure[dataType] || [];
                    list[placeBefore ? "unshift" : "push"](func);
                }
            }
        };
    }

    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR,
            dataType /* internal */, inspected /* internal */) {

        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};

        inspected[dataType] = true;

        var selection,
            list = structure[dataType],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = (structure === prefilters);

        for (; i < length && (executeOnly || !selection) ; i++) {
            selection = list[i](options, originalOptions, jqXHR);
            if (typeof selection === "string") {
                if (!executeOnly || inspected[selection]) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift(selection);
                    selection = inspectPrefiltersOrTransports(
                            structure, options, originalOptions, jqXHR, selection, inspected);
                }
            }
        }
        if ((executeOnly || !selection) && !inspected["*"]) {
            selection = inspectPrefiltersOrTransports(
                    structure, options, originalOptions, jqXHR, "*", inspected);
        }
        return selection;
    }

    function ajaxExtend(target, src) {
        var key, deep,
            flatOptions = $.jqx.data.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
    }

    $.extend($.jqx.data, {
        ajaxSetup: function (target, settings) {
            if (settings) {
                ajaxExtend(target, $.jqx.data.ajaxSettings);
            } else {
                settings = target;
                target = $.jqx.data.ajaxSettings;
            }
            ajaxExtend(target, settings);
            return target;
        },

        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true,
            async: true,
          
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": allTypes
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            converters: {
                "* text": window.String,
                "text html": true,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },

            flatOptions: {
                context: true,
                url: true
            }
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        ajax: function (url, options) {

            if (typeof url === "object") {
                options = url;
                url = undefined;
            }

            options = options || {};

            var ifModifiedKey,
                responseHeadersString,
                responseHeaders,
                transport,
                timeoutTimer,
                parts,
                fireGlobals,
                i,
                s = $.jqx.data.ajaxSetup({}, options),
                callbackContext = s.context || s,
                globalEventContext = callbackContext !== s &&
                    (callbackContext.nodeType || callbackContext instanceof jQuery) ?
                            jQuery(callbackContext) : jQuery.event,
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
                statusCode = s.statusCode || {},
                requestHeaders = {},
                requestHeadersNames = {},
                state = 0,
                strAbort = "canceled",
                jqXHR = {
                    readyState: 0,
                    setRequestHeader: function (name, value) {
                        if (!state) {
                            var lname = name.toLowerCase();
                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    },
                    getAllResponseHeaders: function () {
                        return state === 2 ? responseHeadersString : null;
                    },
                    getResponseHeader: function (key) {
                        var match;
                        if (state === 2) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while ((match = rheaders.exec(responseHeadersString))) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match === undefined ? null : match;
                    },

                    overrideMimeType: function (type) {
                        if (!state) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    abort: function (statusText) {
                        statusText = statusText || strAbort;
                        if (transport) {
                            transport.abort(statusText);
                        }
                        done(0, statusText);
                        return this;
                    }
                };

            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                if (state === 2) {
                    return;
                }

                state = 2;
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                transport = undefined;
                responseHeadersString = headers || "";
                jqXHR.readyState = status > 0 ? 4 : 0;

                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }

                if (status >= 200 && status < 300 || status === 304) {

                    if (s.ifModified) {

                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[ifModifiedKey] = modified;
                        }
                        modified = jqXHR.getResponseHeader("Etag");
                        if (modified) {
                            jQuery.etag[ifModifiedKey] = modified;
                        }
                    }

                    if (status === 304) {
                        statusText = "notmodified";
                        isSuccess = true;
                    } else {

                        isSuccess = ajaxConvert(s, response);
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    error = statusText;
                    if (!statusText || status) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";

                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"),
                            [jqXHR, s, isSuccess ? success : error]);
                }

                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            deferred.promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.add;

            jqXHR.statusCode = function (map) {
                if (map) {
                    var tmp;
                    if (state < 2) {
                        for (tmp in map) {
                            statusCode[tmp] = [statusCode[tmp], map[tmp]];
                        }
                    } else {
                        tmp = map[jqXHR.status];
                        jqXHR.always(tmp);
                    }
                }
                return this;
            };

            s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(core_rspace);

            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts &&
                    (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
                        (parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
                            (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
                );
            }

            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            if (state === 2) {
                return jqXHR;
            }

            fireGlobals = s.global;
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);

            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            if (!s.hasContent) {
                if (s.data) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
                    delete s.data;
                }

                ifModifiedKey = s.url;

                if (s.cache === false) {

                    var ts = jQuery.now(),
                        ret = s.url.replace(rts, "$1_=" + ts);

                    s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                }
            }

            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            if (s.ifModified) {
                ifModifiedKey = ifModifiedKey || s.url;
                if (jQuery.lastModified[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                }
                if (jQuery.etag[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
                }
            }

            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
                    s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts["*"]
            );

            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                return jqXHR.abort();

            }

            strAbort = "abort";

            for (i in { success: 1, error: 1, complete: 1 }) {
                jqXHR[i](s[i]);
            }

            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    if (state < 2) {
                        done(-1, e);
                    } else {
                        throw e;
                    }
                }
            }

            return jqXHR;
        },

        active: 0,

        lastModified: {},
        etag: {}

    });

    function ajaxHandleResponses(s, jqXHR, responses) {

        var ct, type, finalDataType, firstDataType,
            contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;

        for (type in responseFields) {
            if (type in responses) {
                jqXHR[responseFields[type]] = responses[type];
            }
        }

        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("content-type");
            }
        }

        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            finalDataType = finalDataType || firstDataType;
        }

        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    function ajaxConvert(s, response) {
        var conv, conv2, current, tmp,
            dataTypes = s.dataTypes.slice(),
            prev = dataTypes[0],
            converters = {},
            i = 0;

        if (s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
        }

        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }

        for (; (current = dataTypes[++i]) ;) {
            if (current !== "*") {
                if (prev !== "*" && prev !== current) {
                    conv = converters[prev + " " + current] || converters["* " + current];

                    if (!conv) {
                        for (conv2 in converters) {
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {
                                conv = converters[prev + " " + tmp[0]] ||
                                    converters["* " + tmp[0]];
                                if (conv) {
                                    if (conv === true) {
                                        conv = converters[conv2];

                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.splice(i--, 0, current);
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    if (conv !== true) {
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }

                prev = current;
            }
        }

        return { state: "success", data: response };
    }
    var oldCallbacks = [],
        rquestion = /\?/,
        rjsonp = /(=)\?(?=&|$)|\?\?/,
        nonce = jQuery.now();

    $.jqx.data.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
            this[callback] = true;
            return callback;
        }
    });

    $.jqx.data.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName, overwritten, responseContainer,
            data = s.data,
            url = s.url,
            hasCallback = s.jsonp !== false,
            replaceInUrl = hasCallback && rjsonp.test(url),
            replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
                !(s.contentType || "").indexOf("application/x-www-form-urlencoded") &&
                rjsonp.test(data);

        if (s.dataTypes[0] === "jsonp" || replaceInUrl || replaceInData) {

            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
                s.jsonpCallback() :
                s.jsonpCallback;
            overwritten = window[callbackName];

            if (replaceInUrl) {
                s.url = url.replace(rjsonp, "$1" + callbackName);
            } else if (replaceInData) {
                s.data = data.replace(rjsonp, "$1" + callbackName);
            } else if (hasCallback) {
                s.url += (rquestion.test(url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }

            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };

            s.dataTypes[0] = "json";

            window[callbackName] = function () {
                responseContainer = arguments;
            };

            jqXHR.always(function () {
                window[callbackName] = overwritten;
                if (s[callbackName]) {
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    oldCallbacks.push(callbackName);
                }

                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }

                responseContainer = overwritten = undefined;
            });

            return "script";
        }
    });

    $.jqx.data.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });

    $.jqx.data.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });

    $.jqx.data.ajaxTransport("script", function (s) {
        if (s.crossDomain) {
            var script,
                head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

            return {

                send: function (_, callback) {

                    script = document.createElement("script");

                    script.async = "async";

                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    script.onload = script.onreadystatechange = function (_, isAbort) {

                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                            script.onload = script.onreadystatechange = null;

                            if (head && script.parentNode) {
                                head.removeChild(script);
                            }

                            script = undefined;

                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };
                    head.insertBefore(script, head.firstChild);
                },

                abort: function () {
                    if (script) {
                        script.onload(0, 1);
                    }
                }
            };
        }
    });
    var xhrCallbacks,
        xhrOnUnloadAbort = window.ActiveXObject ? function () {
            for (var key in xhrCallbacks) {
                xhrCallbacks[key](0, 1);
            }
        } : false,
        xhrId = 0;

    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) { }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) { }
    }

    $.jqx.data.trim = function (text, character) {
        if (text.length == 0)
            return;

        if (text[0] == text[text.length - 1] && text[0] == character)
            text = text.substring(1, text.length - 1);

        if (text.indexOf(character) != -1) {
            var regExp = new RegExp(character + character, 'g');
            text = text.replace(regExp, character);
        }

        return text;
    }

    $.jqx.data.splitRow = function (text, delimiter) {
        var columns = [];

        var startIndex = 0;
        var isInQuote = false;
        for (var i = 0; i < text.length; i++) {
            if (!isInQuote && text[i] == delimiter) {
                columns.push($.jqx.data.trim(text.substring(startIndex, i), '"'));
                startIndex = i + 1;
                continue;
            }

            if (text[i] == '"')
                isInQuote = !isInQuote;
        }

        if (i > startIndex)
            columns.push($.jqx.data.trim(text.substring(startIndex, i), '"'));

        return columns;
    }

    $.jqx.data.ajaxSettings.xhr = window.ActiveXObject ?
        function () {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        createStandardXHR;

    (function (xhr) {
        jQuery.extend(jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ("withCredentials" in xhr)
        });
    })($.jqx.data.ajaxSettings.xhr());

    if (jQuery.support.ajax) {
        $.jqx.data.ajaxTransport(function (s) {
            if (!s.crossDomain || jQuery.support.cors) {

                var callback;

                return {
                    send: function (headers, complete) {

                        var handle, i,
                            xhr = s.xhr();

                        if (s.username) {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else {
                            xhr.open(s.type, s.url, s.async);
                        }

                        if (s.xhrFields) {
                            for (i in s.xhrFields) {
                                xhr[i] = s.xhrFields[i];
                            }
                        }

                        if (s.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(s.mimeType);
                        }


                        if (!s.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        try {
                            for (i in headers) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch (_) { }

                        xhr.send((s.hasContent && s.data) || null);

                        callback = function (_, isAbort) {

                            var status,
                                statusText,
                                responseHeaders,
                                responses,
                                xml;
                            try {

                                if (callback && (isAbort || xhr.readyState === 4)) {
                                    callback = undefined;
                                    if (handle) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if (xhrOnUnloadAbort) {
                                            delete xhrCallbacks[handle];
                                        }
                                    }

                                    if (isAbort) {
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;

                                        if (xml && xml.documentElement /* #4958 */) {
                                            responses.xml = xml;
                                        }

                                        try {
                                            responses.text = xhr.responseText;
                                        } catch (e) {
                                        }

                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            statusText = "";
                                        }

                                        if (!status && s.isLocal && !s.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort) {
                                    complete(-1, firefoxAccessException);
                                }
                            }

                            if (responses) {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };

                        if (!s.async) {
                            callback();
                        } else if (xhr.readyState === 4) {
                            setTimeout(callback, 0);
                        } else {
                            handle = ++xhrId;
                            if (xhrOnUnloadAbort) {
                                if (!xhrCallbacks) {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function () {
                        if (callback) {
                            callback(0, 1);
                        }
                    }
                };
            }
        });
    }
    
    $.jqx.filter = function () {
        this.operator = 'and';
        var and_operator = 0;
        var or_operator = 1;
        var stringcomparisonoperators = ['EMPTY', 'NOT_EMPTY', 'CONTAINS', 'CONTAINS_CASE_SENSITIVE',
        'DOES_NOT_CONTAIN', 'DOES_NOT_CONTAIN_CASE_SENSITIVE', 'STARTS_WITH', 'STARTS_WITH_CASE_SENSITIVE',
        'ENDS_WITH', 'ENDS_WITH_CASE_SENSITIVE', 'EQUAL', 'EQUAL_CASE_SENSITIVE', 'NULL', 'NOT_NULL'];
        var numericcomparisonoperators = ['EQUAL', 'NOT_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'NULL', 'NOT_NULL'];
        var datecomparisonoperators = ['EQUAL', 'NOT_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'NULL', 'NOT_NULL'];
        var booleancomparisonoperators = ['EQUAL', 'NOT_EQUAL'];

        var filters = new Array();
        var comparisonoperators = new Array();

        this.evaluate = function (value) {
            var result = true;
            for (var i = 0; i < filters.length; i++) {
                var currentResult = filters[i].evaluate(value);
                if (i == 0) {
                    result = currentResult;
                }
                else {
                    if (comparisonoperators[i] == or_operator || comparisonoperators[i] == "or")
                        result = result || currentResult;
                    else
                        result = result && currentResult;
                }
            }

            return result;
        }

        this.getfilterscount = function () {
            return filters.length;
        }

        this.setoperatorsbyfiltertype = function (type, array) {
            switch (type) {
                case "numericfilter":
                    numericcomparisonoperators = array;
                    break;
                case "stringfilter":
                    stringcomparisonoperators = array;
                    break;
                case "datefilter":
                    datecomparisonoperators = array;
                    break;
                case "booleanfilter":
                    booleancomparisonoperators = array;
                    break;
            }
        }

        this.getoperatorsbyfiltertype = function (type) {
            var array = new Array();
            switch (type) {
                case "numericfilter":
                    array = numericcomparisonoperators.slice(0);
                    break;
                case "stringfilter":
                    array = stringcomparisonoperators.slice(0);
                    break;
                case "datefilter":
                    array = datecomparisonoperators.slice(0);
                    break;
                case "booleanfilter":
                    array = booleancomparisonoperators.slice(0);
                    break;
            }
            return array;
        }

        var generatefilterkey = function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + "-" + S4() + "-" + S4());
        }

        this.createfilter = function (filtertype, filtervalue, filtercomparisonoperator, customfilter, formatstring, localization) {
            if (filtertype == null || filtertype == undefined)
                return null;

            switch (filtertype) {
                case 'numericfilter':
                    return new numericfilter(filtervalue, filtercomparisonoperator.toUpperCase());
                case 'stringfilter':
                    return new stringfilter(filtervalue, filtercomparisonoperator.toUpperCase());
                case 'datefilter':
                    return new datefilter(filtervalue, filtercomparisonoperator.toUpperCase(), formatstring, localization);
                case 'booleanfilter':
                    return new booleanfilter(filtervalue, filtercomparisonoperator.toUpperCase());
                case 'custom':
                    return new filter(filtervalue, filtercomparisonoperator.toUpperCase(), customfilter);
            }

            throw new Error("jqxGrid: There is no such filter type. The available filter types are: 'numericfilter', 'stringfilter', 'datefilter' and 'booleanfilter'");
            return null;
        }

        this.getfilters = function () {
            var filtersarray = new Array();
            for (var i = 0; i < filters.length; i++) {
                var filter = { value: filters[i].filtervalue, condition: filters[i].comparisonoperator, operator: comparisonoperators[i], type: filters[i].type };
                filtersarray[i] = filter;
            }
            return filtersarray;
        }

        this.addfilter = function (comparisonoperator, filter) {
            filters[filters.length] = filter;
            filter.key = generatefilterkey();
            comparisonoperators[comparisonoperators.length] = comparisonoperator;
        }

        this.removefilter = function (filter) {
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].key == filter.key) {
                    filters.splice(i, 1);
                    comparisonoperators.splice(i, 1);
                    break;
                }
            }
        }

        this.getoperatorat = function (index) {
            if (index == undefined || index == null)
                return null;

            if (index < 0 || index > filters.length)
                return null;

            return comparisonoperators[index];
        }

        this.setoperatorat = function (index, comparisonoperator) {
            if (index == undefined || index == null)
                return null;

            if (index < 0 || index > filters.length)
                return null;

            comparisonoperators[comparisonoperator] = comparisonoperator;
        }

        this.getfilterat = function (index) {
            if (index == undefined || index == null)
                return null;

            if (index < 0 || index > filters.length)
                return null;

            return filters[index];
        }

        this.setfilterat = function (index, filter) {
            if (index == undefined || index == null)
                return null;

            if (index < 0 || index > filters.length)
                return null;

            filter.key = generatefilterkey();
            filters[index] = filter;
        }

        this.clear = function () {
            filters = new Array();
            comparisonoperators = new Array();
        }

        var stringfilter = function (filtervalue, comparisonoperator) {
            this.filtervalue = filtervalue;
            this.comparisonoperator = comparisonoperator;
            this.type = 'stringfilter';
            this.evaluate = function (value) {
                var filtervalue = this.filtervalue;
                var comparisonoperator = this.comparisonoperator;
                if (value == null || value == undefined || value == "") {
                    if (comparisonoperator == 'NULL')
                        return true;

                    return false;
                }

                var val = "";
                try {
                    val = value.toString();
                }
                catch (error) {
                    return true;
                }

                var compare = function (val, filtervalue) {
                    switch (comparisonoperator) {
                        case 'EQUAL':
                            return $.jqx.string.equalsIgnoreCase(val, filtervalue);
                        case 'EQUAL_CASE_SENSITIVE':
                            return $.jqx.string.equals(val, filtervalue);
                        case 'NOT_EQUAL':
                            return !$.jqx.string.equalsIgnoreCase(val, filtervalue);
                        case 'NOT_EQUAL_CASE_SENSITIVE':
                            return !$.jqx.string.equals(val, filtervalue);
                        case 'CONTAINS':
                            return $.jqx.string.containsIgnoreCase(val, filtervalue);
                        case 'CONTAINS_CASE_SENSITIVE':
                            return $.jqx.string.contains(val, filtervalue);
                        case 'DOES_NOT_CONTAIN':
                            return !$.jqx.string.containsIgnoreCase(val, filtervalue);
                        case 'DOES_NOT_CONTAIN_CASE_SENSITIVE':
                            return !$.jqx.string.contains(val, filtervalue);
                        case 'EMPTY':
                            return val == '';
                        case 'NOT_EMPTY':
                            return val != '';
                        case 'NOT_NULL':
                            return val != null;
                        case 'STARTS_WITH':
                            return $.jqx.string.startsWithIgnoreCase(val, filtervalue);
                        case 'ENDS_WITH':
                            return $.jqx.string.endsWithIgnoreCase(val, filtervalue);
                        case 'ENDS_WITH_CASE_SENSITIVE':
                            return $.jqx.string.endsWith(val, filtervalue);
                        case 'STARTS_WITH_CASE_SENSITIVE':
                            return $.jqx.string.startsWith(val, filtervalue);
                        default:
                            return false;
                    }
                }

                var filterValues = new Array();
                if (filtervalue && filtervalue.indexOf)
                    if(filtervalue.indexOf(" ") >= 0 || filtervalue.indexOf("|") >= 0 || filtervalue.indexOf(" AND ") >= 0 || filtervalue.indexOf(" OR ") >= 0 || filtervalue.indexOf(" and ") >= 0 || filtervalue.indexOf(" or ") >= 0) {
                    var result = compare(val, filtervalue);
                    if (result) {
                        return result;
                    }

                    var andFilters = filtervalue.indexOf(" AND ") >= 0 ? filtervalue.split(" AND ") : new Array();
                    var orFilters = filtervalue.indexOf(" OR ") >= 0 ? filtervalue.split(" OR ") : new Array();
                    var andLowerCaseFilters = filtervalue.indexOf(" and ") >= 0 ? filtervalue.split(" and ") : new Array();
                    var orLowerCaseFilters = filtervalue.indexOf(" or ") >= 0 ? filtervalue.split(" or ") : new Array();
                    var delimiterFilters = filtervalue.indexOf("|") >= 0 ? filtervalue.split("|") : new Array();
                    if (delimiterFilters.length > 0) {
                        for (var i = 0; i < delimiterFilters.length; i++) {
                            delimiterFilters[i] = $.trim(delimiterFilters[i]);
                        }
                    }
                    var commaFilters = filtervalue.indexOf(" ") >= 0 ? filtervalue.split(" ") : new Array();
                    if (commaFilters.length > 0) {
                        for (var i = 0; i < commaFilters.length; i++) {
                            commaFilters[i] = $.trim(commaFilters[i]);
                        }
                    }

                    andFilters = andFilters.concat(commaFilters);
                    andFilters = andFilters.concat(andLowerCaseFilters);
                    orFilters = orFilters.concat(delimiterFilters);
                    orFilters = orFilters.concat(orLowerCaseFilters);

                    if (andFilters.length > 0) {
                        for (var i = 0; i < andFilters.length; i++) {
                            if (!andFilters[i].indexOf(" OR ") >= 0) {
                                filterValues.push(andFilters[i]);
                            }
                        }
                    }
                    if (orFilters.length > 0) {
                        for (var i = 0; i < orFilters.length; i++) {
                            if (!orFilters[i].indexOf(" AND ") >= 0) {
                                filterValues.push(orFilters[i]);
                            }
                        }
                    }

                    var filterresult = undefined;
                    for (var j = 0; j < filterValues.length; j++) {
                        var value = filterValues[j];
                        var result = compare(val, value);
                        var filteroperator = j < andFilters.length ? "and" : "or";
                        if (filterresult == undefined) {
                            filterresult = result;
                        }
                        else {
                            if (filteroperator == 'or') {
                                filterresult = filterresult || result;
                            }
                            else {
                                filterresult = filterresult && result;
                            }
                        }
                    }
                    return filterresult;
                }
         
                return compare(val, filtervalue);
            }
        }

        var booleanfilter = function (filtervalue, comparisonoperator) {
            this.filtervalue = filtervalue;
            this.comparisonoperator = comparisonoperator;
            this.type = 'booleanfilter';
            this.evaluate = function (value) {
                var filtervalue = this.filtervalue;
                var comparisonoperator = this.comparisonoperator;
                if (value == null || value == undefined) {
                    if (comparisonoperator == 'NULL')
                        return true;

                    return false;
                }

                var val = value;

                switch (comparisonoperator) {
                    case 'EQUAL':
                        return val == filtervalue || val.toString() == filtervalue.toString();
                    case 'NOT_EQUAL':
                        return val != filtervalue && val.toString() != filtervalue.toString();
                    default:
                        return false;
                }
            }
        }

        var numericfilter = function (filtervalue, comparisonoperator) {
            this.filtervalue = filtervalue;
            this.comparisonoperator = comparisonoperator;
            this.type = 'numericfilter';
            this.evaluate = function (value) {
                var filtervalue = this.filtervalue;
                var comparisonoperator = this.comparisonoperator;
                if (value === null || value === undefined || value === "") {
                    if (comparisonoperator == 'NOT_NULL')
                        return false;

                    if (comparisonoperator == 'NULL')
                        return true;
                    else
                        return false;
                }
                else {
                    if (comparisonoperator == 'NULL')
                        return false;

                    if (comparisonoperator == 'NOT_NULL')
                        return true;
                }

                var val = value;

                try {
                    val = parseFloat(val);
                }
                catch (error) {
                    if (value.toString() != "")
                        return false;
                }

                var compare = function (val, filtervalue) {
                    switch (comparisonoperator) {
                        case 'EQUAL':
                            return val == filtervalue;
                        case 'NOT_EQUAL':
                            return val != filtervalue;
                        case 'GREATER_THAN':
                            return val > filtervalue;
                        case 'GREATER_THAN_OR_EQUAL':
                            return val >= filtervalue;
                        case 'LESS_THAN':
                            return val < filtervalue;
                        case 'LESS_THAN_OR_EQUAL':
                            return val <= filtervalue;
                        case 'STARTS_WITH':
                            return $.jqx.string.startsWithIgnoreCase(val.toString(), filtervalue.toString());
                        case 'ENDS_WITH':
                            return $.jqx.string.endsWithIgnoreCase(val.toString(), filtervalue.toString());
                        case 'ENDS_WITH_CASE_SENSITIVE':
                            return $.jqx.string.endsWith(val.toString(), filtervalue.toString());
                        case 'STARTS_WITH_CASE_SENSITIVE':
                            return $.jqx.string.startsWith(val.toString(), filtervalue.toString());
                        case 'CONTAINS':
                            return $.jqx.string.containsIgnoreCase(val.toString(), filtervalue.toString());
                        case 'CONTAINS_CASE_SENSITIVE':
                            return $.jqx.string.contains(val.toString(), filtervalue.toString());
                        case 'DOES_NOT_CONTAIN':
                            return !$.jqx.string.containsIgnoreCase(val.toString(), filtervalue.toString());
                        case 'DOES_NOT_CONTAIN_CASE_SENSITIVE':
                            return !$.jqx.string.contains(val.toString(), filtervalue.toString());
                        default:
                            return true;
                    }
                }

                var filterValues = new Array();

                if (filtervalue && filtervalue.indexOf)
                    if(filtervalue.indexOf("|") >= 0  || filtervalue.indexOf(" AND ") >= 0 || filtervalue.indexOf(" OR ") >= 0 || filtervalue.indexOf(" and ") >= 0 || filtervalue.indexOf(" or ") >= 0) {
                    var result = compare(val, filtervalue);
                    if (result) {
                        return result;
                    }
                    filtervalue = filtervalue.toString();
                    var andFilters = filtervalue.indexOf(" AND ") >= 0 ? filtervalue.split(" AND ") : new Array();
                    var orFilters = filtervalue.indexOf(" OR ") >= 0 ? filtervalue.split(" OR ") : new Array();
                    var andLowerCaseFilters = filtervalue.indexOf(" and ") >= 0 ? filtervalue.split(" and ") : new Array();
                    var orLowerCaseFilters = filtervalue.indexOf(" or ") >= 0 ? filtervalue.split(" or ") : new Array();
                    andFilters = andFilters.concat(andLowerCaseFilters);
                    orFilters = orFilters.concat(orLowerCaseFilters);
                    var delimiterFilters = filtervalue.indexOf("|") >= 0 ? filtervalue.split("|") : new Array();
                    if (delimiterFilters.length > 0) {
                        for (var i = 0; i < delimiterFilters.length; i++) {
                            delimiterFilters[i] = $.trim(delimiterFilters[i]);
                        }
                    }
                    orFilters = orFilters.concat(delimiterFilters);

                    if (andFilters.length > 0) {
                        for (var i = 0; i < andFilters.length; i++) {
                            if (!andFilters[i].indexOf(" OR ") >= 0) {
                                filterValues.push(andFilters[i]);
                            }
                        }
                    }
                    if (orFilters.length > 0) {
                        for (var i = 0; i < orFilters.length; i++) {
                            if (!orFilters[i].indexOf(" AND ") >= 0) {
                                filterValues.push(orFilters[i]);
                            }
                        }
                    }

                    var filterresult = undefined;
                    for (var j = 0; j < filterValues.length; j++) {
                        var value = filterValues[j];

                        if (value && value.indexOf && value.indexOf("..") >= 0) {
                            var values = value.toString().split("..");
                            if (values.length == 2) {
                                result = val >= values[0] && val <= values[1];
                            }
                        }
                        else {
                            var result = compare(val, value);
                        }
                        var filteroperator = j < andFilters.length ? "and" : "or";
                        if (filterresult == undefined) {
                            filterresult = result;
                        }
                        else {
                            if (filteroperator == 'or') {
                                filterresult = filterresult || result;
                            }
                            else {
                                filterresult = filterresult && result;
                            }
                        }
                    }
                    return filterresult;
                }
                if (filtervalue && filtervalue.indexOf && filtervalue.indexOf("..") >= 0) {
                    filterValues = filtervalue.toString().split("..");
                    if (filterValues.length == 2) {
                        return val >= filterValues[0] && val <= filterValues[1];
                    }
                }
                return compare(val, filtervalue);             
            }
        }

        var datefilter = function (filtervalue, comparisonoperator, formatstring, localization) {
            this.filtervalue = filtervalue;
            this.type = 'datefilter';

            if (formatstring != undefined && localization != undefined) {
                var parsedDate = $.jqx.dataFormat.parsedate(filtervalue, formatstring, localization);
                if (parsedDate != null) {
                    this.filterdate = parsedDate;
                }
                else {
                    var result = $.jqx.dataFormat.tryparsedate(filtervalue, localization);
                    if (result != null) this.filterdate = result;
                }

            }
            else {
                var tmpvalue = new Date(filtervalue);
                if (tmpvalue.toString() == 'NaN' || tmpvalue.toString() == "Invalid Date") {
                    this.filterdate = $.jqx.dataFormat.tryparsedate(filtervalue);
                }
                else {
                    this.filterdate = tmpvalue;
                }
            }
            if (!this.filterdate) {
                var tmpvalue = new Date(filtervalue);
                if (tmpvalue.toString() == 'NaN' || tmpvalue.toString() == "Invalid Date") {
                    this.filterdate = $.jqx.dataFormat.tryparsedate(filtervalue);
                }
                else {
                    this.filterdate = tmpvalue;
                }
            }

            this.comparisonoperator = comparisonoperator;
            this.evaluate = function (value) {
                var filtervalue = this.filtervalue;
                var comparisonoperator = this.comparisonoperator;
                if (value == null || value == undefined || value == "") {
                    if (comparisonoperator == 'NOT_NULL')
                        return false;

                    if (comparisonoperator == 'NULL')
                        return true;
                    else
                        return false;
                }
                else {
                    if (comparisonoperator == 'NULL')
                        return false;

                    if (comparisonoperator == 'NOT_NULL')
                        return true;
                }

                var val = new Date();
                val.setFullYear(1900, 0, 1);
                val.setHours(12, 0, 0, 0);
                try {
                    var tmpvalue = new Date(value);

                    if (tmpvalue.toString() == 'NaN' || tmpvalue.toString() == "Invalid Date") {
                        value = $.jqx.dataFormat.tryparsedate(value);
                    }
                    else {
                        value = tmpvalue;
                    }

                    val = value;

                    var compareTimePart = false;
                    if (formatstring != undefined && localization != undefined) {
                        if (formatstring.indexOf('t') >= 0 || formatstring.indexOf('T') >= 0 || formatstring.indexOf(':') >= 0 || formatstring.indexOf('f') >= 0) {
                            compareTimePart = true;
                        }
                    }
                    if (!compareTimePart) {
                        val.setHours(0);
                        val.setMinutes(0);
                        val.setSeconds(0);
                    }
                }
                catch (error) {
                    if (value.toString() != "")
                        return false;
                }

                if (this.filterdate != null) {
                    filtervalue = this.filterdate;
                }
                else {
                    if (filtervalue.indexOf) {
                        if (filtervalue.indexOf(':') != -1 || !isNaN(parseInt(filtervalue))) {
                            var tmpFilter = new Date(val);
                            tmpFilter.setHours(12, 0, 0, 0);
                            var timeStrings = filtervalue.split(':');
                            for (var i = 0; i < timeStrings.length; i++) {
                                if (i == 0) {
                                    tmpFilter.setHours(timeStrings[i]);
                                }
                                if (i == 1) {
                                    tmpFilter.setMinutes(timeStrings[i]);
                                }
                                if (i == 2) {
                                    tmpFilter.setSeconds(timeStrings[i]);
                                }
                            }
                            filtervalue = tmpFilter;
                        }
                    }
                }

                var compare = function (val, filtervalue) {
                    if (val == null) val = "";
                    switch (comparisonoperator) {
                        case 'EQUAL':
                            return val.toString() == filtervalue.toString();
                        case 'NOT_EQUAL':
                            return val.toString() != filtervalue.toString();
                        case 'GREATER_THAN':
                            return val > filtervalue;
                        case 'GREATER_THAN_OR_EQUAL':
                            return val >= filtervalue;
                        case 'LESS_THAN':
                            return val < filtervalue;
                        case 'LESS_THAN_OR_EQUAL':
                            return val <= filtervalue;
                        case 'STARTS_WITH':
                            return $.jqx.string.startsWithIgnoreCase(val.toString(), filtervalue.toString());
                        case 'ENDS_WITH':
                            return $.jqx.string.endsWithIgnoreCase(val.toString(), filtervalue.toString());
                        case 'ENDS_WITH_CASE_SENSITIVE':
                            return $.jqx.string.endsWith(val.toString(), filtervalue.toString());
                        case 'STARTS_WITH_CASE_SENSITIVE':
                            return $.jqx.string.startsWith(val.toString(), filtervalue.toString());
                        case 'CONTAINS':
                            return $.jqx.string.containsIgnoreCase(val.toString(), filtervalue.toString());
                        case 'CONTAINS_CASE_SENSITIVE':
                            return $.jqx.string.contains(val.toString(), filtervalue.toString());
                        case 'DOES_NOT_CONTAIN':
                            return !$.jqx.string.containsIgnoreCase(val.toString(), filtervalue.toString());
                        case 'DOES_NOT_CONTAIN_CASE_SENSITIVE':
                            return !$.jqx.string.contains(val.toString(), filtervalue.toString());
                        default:
                            return true;
                    }
                }
                var filterValues = new Array();
                if (filtervalue && filtervalue.indexOf)
                    if (filtervalue.indexOf("|") >= 0 || filtervalue.indexOf(" AND ") >= 0 || filtervalue.indexOf(" OR ") >= 0 || filtervalue.indexOf(" and ") >= 0 || filtervalue.indexOf(" or ") >= 0) {
                    var result = compare(val, filtervalue);
                    if (result) {
                        return result;
                    }
                    var andFilters = filtervalue.indexOf(" AND ") >= 0 ? filtervalue.split(" AND ") : new Array();
                    var orFilters = filtervalue.indexOf(" OR ") >= 0 ? filtervalue.split(" OR ") : new Array();
                    var andLowerCaseFilters = filtervalue.indexOf(" and ") >= 0 ? filtervalue.split(" and ") : new Array();
                    var orLowerCaseFilters = filtervalue.indexOf(" or ") >= 0 ? filtervalue.split(" or ") : new Array();
                    andFilters = andFilters.concat(andLowerCaseFilters);
                    orFilters = orFilters.concat(orLowerCaseFilters);
                    var delimiterFilters = filtervalue.indexOf("|") >= 0 ? filtervalue.split("|") : new Array();
                    if (delimiterFilters.length > 0) {
                        for (var i = 0; i < delimiterFilters.length; i++) {
                            delimiterFilters[i] = $.trim(delimiterFilters[i]);
                        }
                    }
                    orFilters = orFilters.concat(delimiterFilters);

                    if (andFilters.length > 0) {
                        for (var i = 0; i < andFilters.length; i++) {
                            if (!andFilters[i].indexOf(" OR ") >= 0) {
                                filterValues.push(andFilters[i]);
                            }
                        }
                    }
                    if (orFilters.length > 0) {
                        for (var i = 0; i < orFilters.length; i++) {
                            if (!orFilters[i].indexOf(" AND ") >= 0) {
                                filterValues.push(orFilters[i]);
                            }
                        }
                    }

                    var filterresult = undefined;
                    for (var j = 0; j < filterValues.length; j++) {
                        var value = filterValues[j];
                        if (value && value.indexOf && value.indexOf("..") >= 0) {
                            var values = value.toString().split("..");
                            if (values.length == 2) {
                                result = val >= values[0] && val <= values[1];
                            }
                        }
                        else {
                            var result = compare(val, value);
                        }
                        var filteroperator = j < andFilters.length ? "and" : "or";
                        if (filterresult == undefined) {
                            filterresult = result;
                        }
                        else {
                            if (filteroperator == 'or') {
                                filterresult = filterresult || result;
                            }
                            else {
                                filterresult = filterresult && result;
                            }
                        }
                    }
                    return filterresult;
                }
                if (filtervalue && filtervalue.indexOf && filtervalue.indexOf("..") >= 0) {
                    filterValues = filtervalue.toString().split("..");
                    if (filterValues.length == 2) {
                        return val >= filterValues[0] && val <= filterValues[1];
                    }
                }
                return compare(val, filtervalue);
            }
        }

        var filter = function (filtervalue, comparisonoperator, customfilter) {
            this.filtervalue = filtervalue;
            this.comparisonoperator = comparisonoperator;
            this.evaluate = function (value, comparisonoperator) {
                return customfilter(this.filtervalue, value, this.comparisonoperator);
            }
        }
    };
})(jQuery);