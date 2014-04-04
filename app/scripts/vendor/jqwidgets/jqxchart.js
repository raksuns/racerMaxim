/*
jQWidgets v3.2.1 (2014-Feb-05)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
jQWidgets v3.1.0 (2013-December)
Copyright (c) 2011-2014 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    $.jqx.jqxWidget("jqxChart", "", {});

    $.extend($.jqx._jqxChart.prototype,
    {
        defineInstance: function () {
            this.title = 'Title';
            this.description = 'Description';
            this.source = [];
            this.seriesGroups = [];
            this.categoryAxis = {};
            this.renderEngine = undefined;
            this.enableAnimations = true;
            this.enableAxisTextAnimation = false;
            this.backgroundImage = this.background = undefined;
            this.padding = { left: 5, top: 5, right: 5, bottom: 5 };
            this.backgroundColor = '#FFFFFF';
            this.showBorderLine = true;
            this.borderLineWidth = 1;
            this.titlePadding = { left: 5, top: 5, right: 5, bottom: 10 };
            this.showLegend = true;
            this.legendLayout = undefined;
            this.enabled = true;
            this.colorScheme = 'scheme01';
            this.animationDuration = 500;
            this.showToolTips = true;
            this.toolTipShowDelay = this.toolTipDelay = 500;
            this.toolTipHideDelay = 4000;
            this.toolTipFormatFunction = undefined;
            this.columnSeriesOverlap = false;
            this.rtl = false;
            this.legendPosition = null;
            this.borderLineColor = null;
            this.borderColor = null;
            this.greyScale = false;
            this.axisPadding = 5;
            this.enableCrosshairs = false;
            this.crosshairsColor = '#888888';
            this.crosshairsDashStyle = '2,2';
            this.crosshairsLineWidth = 1.0;
        },

        createInstance: function (args) {
            if (!$.jqx.dataAdapter) {
                throw 'jqxdata.js is not loaded';
                return;
            }

            this._refreshOnDownloadComlete();

            var self = this;
            this.host.on('mousemove', function (event) {
                if (self.enabled == false)
                    return;

                event.preventDefault();
                var x = event.pageX || event.clientX || event.screenX;
                var y = event.pageY || event.clientY || event.screenY;

                var pos = self.host.offset();
                x -= pos.left;
                y -= pos.top;

                self.onmousemove(x, y);
            });

            this.addHandler(this.host, 'mouseleave', function (event) {
                if (self.enabled == false)
                    return;

                if (self._plotRect && self._mouseX >= self._plotRect.x && self._mouseX <= self._plotRect.x + self._plotRect.width &&
                    self._mouseY >= self._plotRect.y && self._mouseY <= self._plotRect.y + self._plotRect.height)
                    return;


                self._cancelTooltipTimer();
                self._hideToolTip(0);
            });
            var isTouchDevice = $.jqx.mobile.isTouchDevice();

            this.addHandler(this.host, 'click', function (event) {
                if (self.enabled == false)
                    return;

                if (!isTouchDevice) {
                    self._cancelTooltipTimer();
                    self._hideToolTip();
                    self._unselect();
                }

                if (self._pointMarker && self._pointMarker.element) {
                    var group = self.seriesGroups[self._pointMarker.gidx];
                    var serie = group.series[self._pointMarker.sidx];
                    self._raiseItemEvent('click', group, serie, self._pointMarker.iidx);
                }
            });

            if (this.element.style) {
                var sizeInPercentage = false;
                if (this.element.style.width != null) {
                    sizeInPercentage |= this.element.style.width.toString().indexOf('%') != -1;
                }
                if (this.element.style.height != null) {
                    sizeInPercentage |= this.element.style.height.toString().indexOf('%') != -1;
                }
                if (sizeInPercentage) {
                    //  $(window).resize(function () {
                    this.width = this.element.style.width;
                    this.height = this.element.style.height;

                    $.jqx.utilities.resize(this.host, function () {
                        if (self.timer) {
                            clearTimeout(self.timer);
                        }
                        var delay = $.jqx.browser.msie ? 200 : 1;
                        self.timer = setTimeout(function () {
                            var tmp = self.enableAnimations;
                            self.enableAnimations = false;
                            self.refresh();
                            self.enableAnimations = tmp;
                        }, delay);
                    });
                }
            }
        }, // createInstance

        _refreshOnDownloadComlete: function () {
            if (this.source instanceof $.jqx.dataAdapter) {
                var me = this;
                var adapteroptions = this.source._options;
                if (adapteroptions == undefined || (adapteroptions != undefined && !adapteroptions.autoBind)) {
                    this.source.autoSync = false;
                    this.source.dataBind();
                }
                if (this.source.records.length == 0) {
                    var updateFunc = function () {
                        // sends a callback function to the user. This allows him to add additional initialization logic before the chart is rendered.
                        if (me.ready) {
                            me.ready();
                        }
                        me.refresh();
                    }
                    this.source.unbindDownloadComplete(this.element.id);
                    this.source.bindDownloadComplete(this.element.id, updateFunc);
                }
                else {
                    // sends a callback function to the user. This allows him to add additional initialization logic before the chart is rendered.
                    if (me.ready) {
                        me.ready();
                    }
                }
                this.source.unbindBindingUpdate(this.element.id);
                this.source.bindBindingUpdate(this.element.id, function () {
                    me.refresh();
                });
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == 'source') {
                this._refreshOnDownloadComlete();
            }

            this.refresh();
        },

        //[optimize]
        _internalRefresh: function () {
            // validate visiblity
            if ($.jqx.isHidden(this.host))
                return;

            this._stopAnimations();

            if (!this._isToggleRefresh && !this._isUpdate) {
                this.host.empty();
                this._toolTipElement = undefined;

                var renderer = null;

                if (document.createElementNS && (this.renderEngine == 'SVG' || this.renderEngine == undefined)) {
                    renderer = new $.jqx.svgRenderer();
                    if (!renderer.init(this.host)) {
                        if (this.renderEngine == 'SVG')
                            throw 'Your browser does not support SVG';

                        return;
                    }
                }

                if (renderer == null && this.renderEngine != 'HTML5') {
                    renderer = new $.jqx.vmlRenderer();
                    if (!renderer.init(this.host)) {
                        if (this.renderEngine == 'VML')
                            throw 'Your browser does not support VML';

                        return;
                    }
                    this._isVML = true;
                }

                if (renderer == null && (this.renderEngine == 'HTML5' || this.renderEngine == undefined)) {
                    renderer = new $.jqx.HTML5Renderer();
                    if (!renderer.init(this.host)) {
                        throw 'Your browser does not support HTML5 Canvas';
                    }
                }

                this.renderer = renderer;
            }

            var rect = this.renderer.getRect();

            this._render({ x: 1, y: 1, width: rect.width, height: rect.height });

            if (this.renderer instanceof $.jqx.HTML5Renderer) {
                this.renderer.refresh();
            }

            this._isUpdate = false;
        },

        saveAsPNG: function (filename, exportServer) {
            return this._saveAsImage('png', filename, exportServer);
        },

        saveAsJPEG: function (filename, exportServer) {
            return this._saveAsImage('jpeg', filename, exportServer);
        },

        //[optimize]
        _saveAsImage: function (type, fileName, exportServer) {
            if (fileName == undefined || fileName == '')
                fileName = 'chart.' + type;

            if (exportServer == undefined || exportServer == '')
                exportServer = 'http://www.jqwidgets.com/export_server/export.php';

            var renderEngineSaved = this.renderEngine;
            var enableAnimationsSaved = this.enableAnimations;

            this.enableAnimations = false;

            // try switching to HTML5
            this.renderEngine = 'HTML5';

            if (this.renderEngine != renderEngineSaved) {
                try {
                    this.refresh();
                }
                catch (e) {
                    this.renderEngine = renderEngineSaved;
                    this.refresh();
                    this.enableAnimations = enableAnimationsSaved;
                }
            }

            try {
                var canvas = this.renderer.getContainer()[0];
                if (canvas) {
                    var data = canvas.toDataURL("image/" + type);

                    data = data.replace("data:image/" + type + ";base64,", "");
                    var form = document.createElement('form');
                    form.method = 'POST';
                    form.action = exportServer;
                    form.style.display = 'none';
                    document.body.appendChild(form);

                    var inputFName = document.createElement('input');
                    inputFName.name = 'fname';
                    inputFName.value = fileName;
                    inputFName.style.display = 'none';

                    var inputContent = document.createElement('input');
                    inputContent.name = 'content';
                    inputContent.value = data;
                    inputContent.style.display = 'none';

                    form.appendChild(inputFName);
                    form.appendChild(inputContent);

                    form.submit();

                    document.body.removeChild(form);
                }
            }
            catch (e) {
            }

            // switch back to existing engine
            if (this.renderEngine != renderEngineSaved) {
                this.renderEngine = renderEngineSaved;
                this.refresh();
                this.enableAnimations = enableAnimationsSaved;
            }

            return true;
        },

        refresh: function () {
            this._internalRefresh();
        },

        update: function () {
            this._isUpdate = true;
            this._internalRefresh();
        },

        //[optimize]
        _seriesTypes: [
            'line', 'stackedline', 'stackedline100',
            'spline', 'stackedspline', 'stackedspline100',
            'stepline', 'stackedstepline', 'stackedstepline100',
            'area', 'stackedarea', 'stackedarea100',
            'splinearea', 'stackedsplinearea', 'stackedsplinearea100',
            'steparea', 'stackedsteparea', 'stackedsteparea100',
            'rangearea', 'splinerangearea', 'steprangearea',
            'column', 'stackedcolumn', 'stackedcolumn100', 'rangecolumn',
            'pie', 'donut', 'scatter', 'bubble',
            'spider'],

        //[optimize]
        _render: function (rect) {
            if (!this._isToggleRefresh && this._isUpdate && this._renderData) {
                this._renderDataDeepCopy();
            }

            this._renderData = [];

            this.renderer.clear();
            this._unselect();
            this._hideToolTip(0);

            var bckgImg = this.backgroundImage;
            if (bckgImg == undefined || bckgImg == '')
                this.host.css({ 'background-image': '' });
            else
                this.host.css({ 'background-image': (bckgImg.indexOf('(') != -1 ? bckgImg : "url('" + bckgImg + "')") });

            var padding = this.padding || { left: 5, top: 5, right: 5, bottom: 5 };

            var clipAll = this.renderer.createClipRect(rect);
            var groupAll = this.renderer.beginGroup();
            this.renderer.setClip(groupAll, clipAll);

            var rFill = this.renderer.rect(rect.x, rect.y, rect.width - 2, rect.height - 2);

            if (bckgImg == undefined || bckgImg == '')
                this.renderer.attr(rFill, { fill: this.background || this.backgroundColor || 'white' });
            else
                this.renderer.attr(rFill, { fill: 'transparent' });

            if (this.showBorderLine != false) {
                var borderColor = this.borderLineColor == undefined ? this.borderColor : this.borderLineColor;
                if (borderColor == undefined)
                    borderColor = '#888888';

                var borderLineWidth = this.borderLineWidth;
                if (isNaN(borderLineWidth) || borderLineWidth < 0 || borderLineWidth > 10)
                    borderLineWidth = 1;

                this.renderer.attr(rFill, { 'stroke-width': borderLineWidth, stroke: borderColor });
            }

            var paddedRect = { x: padding.left, y: padding.top, width: rect.width - padding.left - padding.right, height: rect.height - padding.top - padding.bottom };
            this._paddedRect = paddedRect;
            var titlePadding = this.titlePadding || { left: 2, top: 2, right: 2, bottom: 2 };
            if (this.title && this.title.length > 0) {
                var cssTitle = this.toThemeProperty('jqx-chart-title-text', null);
                var sz = this.renderer.measureText(this.title, 0, { 'class': cssTitle });
                this.renderer.text(this.title, paddedRect.x + titlePadding.left, paddedRect.y + titlePadding.top, paddedRect.width - (titlePadding.left + titlePadding.right), sz.height, 0, { 'class': cssTitle }, true, 'center', 'center');
                paddedRect.y += sz.height;
                paddedRect.height -= sz.height;
            }
            if (this.description && this.description.length > 0) {
                var cssDesc = this.toThemeProperty('jqx-chart-title-description', null);
                var sz = this.renderer.measureText(this.description, 0, { 'class': cssDesc });
                this.renderer.text(this.description, paddedRect.x + titlePadding.left, paddedRect.y + titlePadding.top, paddedRect.width - (titlePadding.left + titlePadding.right), sz.height, 0, { 'class': cssDesc }, true, 'center', 'center');

                paddedRect.y += sz.height;
                paddedRect.height -= sz.height;
            }

            if (this.title || this.description) {
                paddedRect.y += (titlePadding.bottom + titlePadding.top);
                paddedRect.height -= (titlePadding.bottom + titlePadding.top);
            }

            var plotRect = { x: paddedRect.x, y: paddedRect.y, width: paddedRect.width, height: paddedRect.height };

            // build stats
            this._buildStats(plotRect);

            var isPieOnly = this._isPieOnlySeries();

            // axis validation
            var hashCatAxis = {};
            for (var i = 0; i < this.seriesGroups.length && !isPieOnly; i++) {
                if (this.seriesGroups[i].type == 'pie' || this.seriesGroups[i].type == 'donut')
                    continue;

                var swap = this.seriesGroups[i].orientation == 'horizontal';
                var sgvx = this.seriesGroups[i].valueAxis;
                if (!sgvx) {
                    throw 'seriesGroup[' + i + '] is missing ' + (swap ? 'categoryAxis' : 'valueAxis') + ' definition';
                }
                var sghx = this._getCategoryAxis(i);
                if (!sghx) {
                    throw 'seriesGroup[' + i + '] is missing ' + (!swap ? 'categoryAxis' : 'valueAxis') + ' definition';
                }

                var catId = sghx == this.categoryAxis ? -1 : i;
                hashCatAxis[catId] = 0x00;
            }

            var axisPadding = this.axisPadding;
            if (isNaN(axisPadding))
                axisPadding = 5;

            // get vertical axis width
            var wYAxis = { left: 0, right: 0, leftCount: 0, rightCount: 0 };
            var wYAxisArr = [];

            for (var i = 0; i < this.seriesGroups.length; i++) {
                var g = this.seriesGroups[i];
                if (g.type == 'pie' || g.type == 'donut' || g.spider == true || g.polar == true) {
                    wYAxisArr.push(0);
                    continue;
                }

                var swap = g.orientation == 'horizontal';
                var catId = this._getCategoryAxis(i) == this.categoryAxis ? -1 : i;
                var w = sgvx.axisSize;
                var axisR = { x: 0, y: plotRect.y, width: plotRect.width, height: plotRect.height };
                var position = undefined;

                if (!w || w == 'auto') {
                    if (swap) {
                        if (!this._isGroupVisible(i))
                            continue;
                        w = this._renderCategoryAxis(i, axisR, true, plotRect).width;
                        if ((hashCatAxis[catId] & 0x01) == 0x01)
                            w = 0;
                        else
                            hashCatAxis[catId] |= 0x01;

                        position = this._getCategoryAxis(i).position;
                    }
                    else {
                        w = this._renderValueAxis(i, axisR, true, plotRect).width;
                        if (g.valueAxis)
                            position = g.valueAxis.position;
                    }
                }

                if (position != 'left' && this.rtl == true)
                    position = 'right';
                if (position != 'right')
                    position = 'left';

                if (wYAxis[position + 'Count'] > 0 && wYAxis[position] > 0 && w > 0)
                    wYAxis[position] += axisPadding;

                wYAxisArr.push({ width: w, position: position, xRel: wYAxis[position] });
                wYAxis[position] += w;
                wYAxis[position + 'Count']++;
            }

            // get horizontal axis height
            var hXAxis = { top: 0, bottom: 0, topCount: 0, bottomCount: 0 };
            var hXAxisArr = [];

            for (var i = 0; i < this.seriesGroups.length; i++) {
                var g = this.seriesGroups[i];
                if (g.type == 'pie' || g.type == 'donut' || g.spider == true || g.polar == true) {
                    hXAxisArr.push(0);
                    continue;
                }
                var swap = g.orientation == 'horizontal';
                var sghx = this._getCategoryAxis(i);
                var catId = sghx == this.categoryAxis ? -1 : i;
                position = undefined;

                var h = sghx.axisSize;
                if (!h || h == 'auto') {
                    if (swap) {
                        h = this._renderValueAxis(i, { x: 0, y: 0, width: 10000000, height: 0 }, true, plotRect).height;
                        if (this.seriesGroups[i].valueAxis)
                            position = g.valueAxis.position;
                    }
                    else {
                        if (!this._isGroupVisible(i)) {
                            hXAxisArr.push(0);
                            continue;
                        }
                        h = this._renderCategoryAxis(i, { x: 0, y: 0, width: 10000000, height: 0 }, true).height;
                        if ((hashCatAxis[catId] & 0x02) == 0x02)
                            h = 0;
                        else
                            hashCatAxis[catId] |= 0x02;
                        position = this._getCategoryAxis(i).position;
                    }
                }

                if (position != 'top')
                    position = 'bottom';

                if (hXAxis[position + 'Count'] > 0 && hXAxis[position] > 0 && h > 0)
                    hXAxis[position] += axisPadding;

                hXAxisArr.push({ height: h, position: position, yRel: hXAxis[position] });

                hXAxis[position] += h;
                hXAxis[position + 'Count']++;
            }

            this._createAnimationGroup("series");

            this._plotRect = plotRect;

            var showLegend = (this.showLegend != false);
            var szLegend = !showLegend || this.legendLayout ? { width: 0, height: 0} : this._renderLegend(paddedRect, true);

            if (paddedRect.height < hXAxis.top + hXAxis.bottom + szLegend.height || paddedRect.width < wYAxis.left + wYAxis.right)
                return;

            plotRect.height -= hXAxis.top + hXAxis.bottom + szLegend.height;

            plotRect.x += wYAxis.left;
            plotRect.width -= wYAxis.left + wYAxis.right;
            plotRect.y += hXAxis.top;

            if (!isPieOnly) {
                var lineColor = this.categoryAxis.tickMarksColor || '#888888';

                for (var i = 0; i < this.seriesGroups.length; i++) {
                    var g = this.seriesGroups[i];
                    if (g.polar == true || g.spider == true)
                        continue;

                    var swap = g.orientation == 'horizontal';
                    var catId = this._getCategoryAxis(i) == this.categoryAxis ? -1 : i;
                    var axisR = { x: plotRect.x, y: 0, width: plotRect.width, height: hXAxisArr[i].height };
                    if (hXAxisArr[i].position != 'top')
                        axisR.y = plotRect.y + plotRect.height + hXAxisArr[i].yRel;
                    else
                        axisR.y = plotRect.y - hXAxisArr[i].yRel - hXAxisArr[i].height;

                    if (swap) {
                        this._renderValueAxis(i, axisR, false, plotRect);
                    }
                    else {
                        if ((hashCatAxis[catId] & 0x04) == 0x04)
                            continue;
                        if (!this._isGroupVisible(i))
                            continue;

                        this._renderCategoryAxis(i, axisR, false, plotRect);
                        hashCatAxis[catId] |= 0x04;
                    }
                }
            }

            if (showLegend) {
                var x = paddedRect.x + $.jqx._ptrnd((paddedRect.width - szLegend.width) / 2);
                var y = plotRect.y + plotRect.height + hXAxis.bottom;
                var w = paddedRect.width;
                var h = szLegend.height;
                if (this.legendLayout) {
                    x = this.legendLayout.left || x;
                    y = this.legendLayout.top || y;
                    w = this.legendLayout.width || w;
                    h = this.legendLayout.height || h;
                }
                if (x + w > rect.x + rect.width)
                    w = rect.x + rect.width - x;
                if (y + h > rect.y + rect.height)
                    h = rect.y + rect.height - y;

                this._renderLegend({ x: x, y: y, width: w, height: h });
            }

            this._hasHorizontalLines = false;
            if (!isPieOnly) {
                for (var i = 0; i < this.seriesGroups.length; i++) {
                    var g = this.seriesGroups[i];

                    if (g.polar == true || g.spider == true)
                        continue;

                    var swap = this.seriesGroups[i].orientation == 'horizontal';
                    var axisR = { x: plotRect.x - wYAxisArr[i].xRel - wYAxisArr[i].width, y: plotRect.y, width: wYAxisArr[i].width, height: plotRect.height };
                    if (wYAxisArr[i].position != 'left')
                        axisR.x = plotRect.x + plotRect.width + wYAxisArr[i].xRel;

                    if (swap) {
                        if ((hashCatAxis[this._getCategoryAxis(i)] & 0x08) == 0x08)
                            continue;
                        if (!this._isGroupVisible(i))
                            continue;

                        this._renderCategoryAxis(i, axisR, false, plotRect);
                        hashCatAxis[this._getCategoryAxis(i)] |= 0x08;
                    }
                    else
                        this._renderValueAxis(i, axisR, false, plotRect);
                }
            }

            if (plotRect.width <= 0 || plotRect.height <= 0)
                return;

            this._plotRect = { x: plotRect.x, y: plotRect.y, width: plotRect.width, height: plotRect.height };

            var clip = this.renderer.createClipRect({ x: plotRect.x, y: plotRect.y, width: plotRect.width, height: plotRect.height });
            var gPlot = this.renderer.beginGroup();
            this.renderer.setClip(gPlot, clip);

            for (var i = 0; i < this.seriesGroups.length; i++) {
                var g = this.seriesGroups[i];
                var isValid = false;
                for (var validtype in this._seriesTypes) {
                    if (this._seriesTypes[validtype] == g.type) {
                        isValid = true;
                        break;
                    }
                }
                if (!isValid) {
                    throw 'jqxChart: invalid series type "' + g.type + '"';
                    continue;
                }

                if (g.polar == true || g.spider == true) {
                    if (g.type.indexOf('pie') == -1 && g.type.indexOf('donut') == -1)
                        this._renderSpiderAxis(i, plotRect);
                }

                if (g.bands) {
                    for (var j = 0; j < g.bands.length; j++)
                        this._renderBand(i, j, plotRect);
                }

                if (g.type.indexOf('column') != -1)
                    this._renderColumnSeries(i, plotRect);
                else if (g.type.indexOf('pie') != -1 || g.type.indexOf('donut') != -1)
                    this._renderPieSeries(i, plotRect);
                else if (g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1)
                    this._renderLineSeries(i, plotRect);
                else if (g.type == 'scatter' || g.type == 'bubble')
                    this._renderScatterSeries(i, plotRect);
            }

            this.renderer.endGroup();

            if (this.enabled == false) {
                var el = this.renderer.rect(rect.x, rect.y, rect.width, rect.height);
                this.renderer.attr(el, { fill: '#777777', opacity: 0.5, stroke: '#00FFFFFF' });
            }

            this.renderer.endGroup();

            this._startAnimation("series");
        },

        _isPieOnlySeries: function () {
            if (this.seriesGroups.length == 0)
                return false;

            for (var i = 0; i < this.seriesGroups.length; i++) {
                if (this.seriesGroups[i].type != 'pie' && this.seriesGroups[i].type != 'donut')
                    return false;
            }

            return true;
        },

        //[optimize]
        _renderChartLegend: function (data, rect, isMeasure, isVerticalFlow) {
            var r = { x: rect.x + 3, y: rect.y + 3, width: rect.width - 6, height: rect.height - 6 };

            var szMeasure = { width: r.width, height: 0 };

            var x = 0, y = 0;
            var rowH = 20;
            var rowW = 0;
            var barSize = 10;
            var space = 10;
            var maxWidth = 0;
            for (var i = 0; i < data.length; i++) {
                var css = data[i].css;
                if (!css)
                    css = this.toThemeProperty('jqx-chart-legend-text', null);

                var text = data[i].text;
                var sz = this.renderer.measureText(text, 0, { 'class': css });
                if (sz.height > rowH)
                    rowH = sz.height;

                if (sz.width > maxWidth)
                    maxWidth = sz.width;

                if (isVerticalFlow) {
                    if (i != 0)
                        y += rowH;

                    if (y > r.height) {
                        y = 0;
                        x += maxWidth + space;
                        maxWidth = sz.width;
                        szMeasure.width = x + maxWidth;
                    }
                }
                else {
                    if (x != 0)
                        x += space;

                    if (x + 2 * barSize + sz.width > r.width && sz.width < r.width) {
                        x = 0;
                        y += rowH;
                        rowH = 20;
                        rowW = r.width;
                        szMeasure.heigh = y + rowH;
                    }
                }

                if (!isMeasure &&
                    r.x + x + sz.width < rect.x + rect.width &&
                    r.y + y + sz.height < rect.y + rect.height
                  ) {
                    var sidx = data[i].seriesIndex;
                    var gidx = data[i].groupIndex;
                    var iidx = data[i].itemIndex;
                    var color = data[i].color;
                    var isVisible = this._isSerieVisible(gidx, sidx, iidx);
                    var g = this.renderer.beginGroup();
                    var elem = this.renderer.rect(r.x + x, r.y + y + barSize / 2, barSize, barSize);
                    var opacity = isVisible ? data[i].opacity : 0.1;
                    this.renderer.attr(elem, { fill: color, 'fill-opacity': opacity, stroke: color, 'stroke-width': 1, 'stroke-opacity': data[i].opacity });
                    this.renderer.text(text, r.x + x + 1.5 * barSize, r.y + y, sz.width, rowH, 0, { 'class': css }, false, 'center', 'center');
                    this.renderer.endGroup();

                    this._setLegendToggleHandler(gidx, sidx, iidx, g);
                }

                if (isVerticalFlow) {
                }
                else {
                    x += sz.width + 2 * barSize;
                    if (rowW < x)
                        rowW = x;
                }
            }

            if (isMeasure) {
                szMeasure.height = $.jqx._ptrnd(y + rowH + 5);
                szMeasure.width = $.jqx._ptrnd(rowW);
                return szMeasure;
            }
        },

        _groupSeriesToggleState: [],

        _isSerieVisible: function (groupIndex, serieIndex, itemIndex) {
            while (this._groupSeriesToggleState.length < groupIndex + 1)
                this._groupSeriesToggleState.push([]);

            var g = this._groupSeriesToggleState[groupIndex];
            while (g.length < serieIndex + 1)
                g.push(isNaN(itemIndex) ? true : []);

            var s = g[serieIndex];
            if (isNaN(itemIndex))
                return s;

            if (!$.isArray(s))
                g[serieIndex] = s = [];

            while (s.length < itemIndex + 1)
                s.push(true);

            return s[itemIndex];
        },

        _isGroupVisible: function (groupIndex) {
            var isGroupVisible = false;
            var series = this.seriesGroups[groupIndex].series;
            if (!series)
                return szMeasure

            for (var i = 0; i < series.length; i++) {
                if (this._isSerieVisible(groupIndex, i)) {
                    isGroupVisible = true;
                    break;
                }
            }

            return isGroupVisible;
        },

        _isToggleRefresh: false,

        _toggleSerie: function (groupIndex, serieIndex, itemIndex, enable) {
            var state = !this._isSerieVisible(groupIndex, serieIndex, itemIndex);
            if (enable != undefined)
                state = enable;

            var group = this.seriesGroups[groupIndex];
            var serie = group.series[serieIndex];

            this._raiseEvent('toggle', { state: state, seriesGroup: group, serie: serie, elementIndex: itemIndex });

            if (isNaN(itemIndex))
                this._groupSeriesToggleState[groupIndex][serieIndex] = state;
            else {
                var s = this._groupSeriesToggleState[groupIndex][serieIndex];

                if (!$.isArray(s))
                    s = [];

                while (s.length < itemIndex)
                    s.push(true);

                s[itemIndex] = state;
            }

            this._isToggleRefresh = true;
            this.update();
            this._isToggleRefresh = false;
        },

        showSerie: function (groupIndex, serieIndex, itemIndex) {
            this._toggleSerie(groupIndex, serieIndex, itemIndex, true);
        },

        hideSerie: function (groupIndex, serieIndex, itemIndex) {
            this._toggleSerie(groupIndex, serieIndex, itemIndex, false);
        },

        _setLegendToggleHandler: function (groupIndex, serieIndex, itemIndex, element) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[serieIndex];

            var enableSeriesToggle = s.enableSeriesToggle;
            if (enableSeriesToggle == undefined)
                enableSeriesToggle = g.enableSeriesToggle != false;

            if (enableSeriesToggle /*&& itemIndex == undefined*/) {
                var self = this;
                this.renderer.addHandler(element, 'click', function (e) {
                    e.preventDefault();

                    self._toggleSerie(groupIndex, serieIndex, itemIndex);
                });
            }
        },

        //[optimize]
        _renderLegend: function (rect, isMeasure) {
            var legendData = [];
            for (var gidx = 0; gidx < this.seriesGroups.length; gidx++) {
                var g = this.seriesGroups[gidx];
                if (g.showLegend == false)
                    continue;

                for (var sidx = 0; sidx < g.series.length; sidx++) {
                    var s = g.series[sidx];
                    if (s.showLegend == false)
                        continue;

                    var settings = this._getSerieSettings(gidx, sidx);

                    if (g.type == 'pie' || g.type == 'donut') {
                        var categoryAxis = this._getCategoryAxis(gidx);
                        var fs = categoryAxis.toolTipFormatSettings || categoryAxis.formatSettings || g.toolTipFormatSettings || g.formatSettings || s.toolTipFormatSettings || s.formatSettings;
                        var ff = categoryAxis.toolTipFormatFunction || categoryAxis.formatFunction || g.toolTipFormatFunction || g.formatFunction || s.toolTipFormatFunction || s.formatFunction;

                        var dataLength = this._getDataLen(gidx);
                        for (var i = 0; i < dataLength; i++) {
                            var legendText = this._getDataValue(i, s.displayText, gidx);
                            legendText = this._formatValue(legendText, fs, ff);

                            var colors = this._getColors(gidx, sidx, i);

                            legendData.push({ groupIndex: gidx, seriesIndex: sidx, itemIndex: i, text: legendText, css: s.displayTextClass, color: colors.fillColor, opacity: settings.opacity });
                        }

                        continue;
                    }

                    var text = s.displayText || s.dataField || '';
                    var colors = this._getSeriesColors(gidx, sidx);

                    legendData.push({ groupIndex: gidx, seriesIndex: sidx, text: text, css: s.displayTextClass, color: colors.fillColor, opacity: settings.opacity });
                }
            }

            return this._renderChartLegend(legendData, rect, isMeasure, (this.legendLayout && this.legendLayout.flow == 'vertical'));
        },

        //[optimize]
        _renderCategoryAxis: function (groupIndex, rect, isMeasure, chartRect) {
            var axis = this._getCategoryAxis(groupIndex);
            var g = this.seriesGroups[groupIndex];
            var swapXY = g.orientation == 'horizontal';
            var szMeasure = { width: 0, height: 0 };
            if (!axis || axis.visible == false || g.type == 'spider')
                return szMeasure;

            // check if the group has visible series
            if (!this._isGroupVisible(groupIndex))
                return szMeasure;

            // TODO: Update RTL/FLIP flag
            if (this.rtl) {
                axis.flip = true;
            }

            var text = axis.text;

            var gridLinesSettings = { visible: (axis.showGridLines != false), color: (axis.gridLinesColor || '#888888'), unitInterval: (axis.gridLinesInterval || axis.unitInterval), dashStyle: axis.gridLinesDashStyle };
            var tickMarksSettings = { visible: (axis.showTickMarks != false), color: (axis.tickMarksColor || '#888888'), unitInterval: (axis.tickMarksInterval || axis.unitInterval), dashStyle: axis.tickMarksDashStyle };

            var textRotationAngle = axis.textRotationAngle || 0;
            var offsets = this._calculateXOffsets(groupIndex, swapXY ? rect.height : rect.width);

            var ui = axis.unitInterval;
            if (isNaN(ui))
                ui = 1;

            var hTextAlign = axis.horizontalTextAlignment;
            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var widgetRect = this.renderer.getRect();
            var paddingRight = widgetRect.width - rect.x - rect.width;
            var len = this._getDataLen(groupIndex);

            var oldPositions;
            if (this._elementRenderInfo && this._elementRenderInfo.length > groupIndex)
                oldPositions = this._elementRenderInfo[groupIndex].categoryAxis;

            var items = [];
            if (axis.type != 'date') {
                var isCustomRange = offsets.customRange != false;
                var step = ui;
                for (var i = offsets.min; i <= offsets.max; i += step) {
                    if (isCustomRange || axis.dataField == undefined || axis.dataField == '') {
                        value = i;
                    }
                    else {
                        var idx = Math.round(i);

                        value = this._getDataValue(idx, axis.dataField);
                    }

                    var text = this._formatValue(value, axis.formatSettings, axis.formatFunction, undefined, undefined, idx);
                    if (text == undefined)
                        text = !isCustomRange ? value.toString() : (i).toString();

                    var obj = { key: value, text: text };
                    if (oldPositions && oldPositions.itemOffsets[value]) {
                        obj.x = oldPositions.itemOffsets[value].x;
                        obj.y = oldPositions.itemOffsets[value].y;
                    }
                    items.push(obj);

                    if (i + step > offsets.max) {
                        step = offsets.max - i;
                        if (step <= ui / 2)
                            break;
                    }
                }
            }
            else {
                var arr = this._getDateTimeArray(offsets.min, offsets.max, axis.baseUnit, valuesOnTicks, ui);
                for (var i = 0; i < arr.length; i += ui) {
                    var value = arr[i];
                    var text = this._formatValue(value, axis.formatSettings, axis.formatFunction);

                    var obj = { key: value, text: text };
                    if (oldPositions && oldPositions.itemOffsets[value]) {
                        obj.x = oldPositions.itemOffsets[value].x;
                        obj.y = oldPositions.itemOffsets[value].y;
                    }
                    items.push(obj);
                }
            }

            if (axis.flip == true || this.rtl)
                items.reverse();

            var cssDesc = axis.descriptionClass;
            if (!cssDesc)
                cssDesc = this.toThemeProperty('jqx-chart-axis-description', null);

            var cssItems = axis['class'];
            if (!cssItems)
                cssItems = this.toThemeProperty('jqx-chart-axis-text', null);

            if (swapXY)
                textRotationAngle -= 90;

            var axisTextSettings = { text: axis.description, style: cssDesc, halign: axis.horizontalDescriptionAlignment || 'center', valign: axis.verticalDescriptionAlignment || 'center', textRotationAngle: swapXY ? -90 : 0 };
            var itemsTextSettings = { textRotationAngle: textRotationAngle, style: cssItems, halign: hTextAlign, valign: axis.verticalTextAlignment || 'center', textRotationPoint: axis.textRotationPoint || 'auto', textOffset: axis.textOffset };

            var isMirror = (swapXY && axis.position == 'right') || (!swapXY && axis.position == 'top');

            var renderData = { rangeLength: offsets.rangeLength, itemWidth: offsets.itemWidth, intervalWidth: offsets.intervalWidth };
            var itemsInfo = { items: items, renderData: renderData };

            while (this._renderData.length < groupIndex + 1)
                this._renderData.push({});

            this._renderData[groupIndex].categoryAxis = renderData;

            var anim = this._getAnimProps(groupIndex);
            var duration = anim.enabled && items.length < 500 ? anim.duration : 0;
            if (this.enableAxisTextAnimation == false)
                duration = 0;

            return this._renderAxis(swapXY, isMirror, axisTextSettings, itemsTextSettings, { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, chartRect, ui, false, valuesOnTicks, itemsInfo, gridLinesSettings, tickMarksSettings, isMeasure, duration);
        },

        _animateAxisText: function (context, percent) {
            var items = context.items;
            var textSettings = context.textSettings;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (!item.visible)
                    continue;

                var x = item.targetX;
                var y = item.targetY;
                if (!isNaN(item.x) && !isNaN(item.y)) {
                    x = item.x + (x - item.x) * percent;
                    y = item.y + (y - item.y) * percent;
                }
                else if (percent != 1) {
                    // continue;
                }

                // TODO: Optimize via text reponsitioning.
                // Requires SVG & VML text rendering changes
                if (item.element) {
                    this.renderer.removeElement(item.element);
                    item.element = undefined;
                }

                item.element = this.renderer.text(
                    item.text,
                    x,
                    y,
                    item.width,
                    item.height,
                    textSettings.textRotationAngle,
                    { 'class': textSettings.style },
                    false,
                    textSettings.halign,
                    textSettings.valign,
                    textSettings.textRotationPoint);
            }
        },

        _getPolarAxisCoords: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];

            var offsets = this._calcGroupOffsets(groupIndex, rect).xoffsets;
            if (!offsets)
                return;

            var offsetX = rect.x + $.jqx.getNum([group.offsetX, rect.width / 2]);
            var offsetY = rect.y + $.jqx.getNum([group.offsetY, rect.height / 2]);
            var radius = group.radius;
            if (isNaN(radius))
                radius = Math.min(rect.width, rect.height) / 2 * 0.7;

            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var startAngle = group.startAngle;
            if (isNaN(startAngle))
                startAngle = 0;
            else {
                startAngle = (startAngle < 0 ? -1 : 1) * (Math.abs(startAngle) % 360);
                startAngle = 2 * Math.PI * startAngle / 360;
            }

            return { x: offsetX, y: offsetY, r: radius, itemWidth: offsets.itemWidth, rangeLength: offsets.rangeLength, valuesOnTicks: valuesOnTicks, startAngle: startAngle };
        },

        _toPolarCoord: function (polarAxisCoords, rect, x, y) {
            var angle = ((x - rect.x) * 2 * Math.PI) / Math.max(1, rect.width) + polarAxisCoords.startAngle;
            var radius = ((rect.height + rect.y) - y) * polarAxisCoords.r / Math.max(1, rect.height);

            var px = polarAxisCoords.x + radius * Math.cos(angle);
            var py = polarAxisCoords.y + radius * Math.sin(angle);

            return { x: $.jqx._ptrnd(px), y: $.jqx._ptrnd(py) };
        },

        _renderSpiderAxis: function (groupIndex, rect) {
            var axis = this._getCategoryAxis(groupIndex);
            if (!axis || axis.visible == false)
                return;

            var group = this.seriesGroups[groupIndex];

            var polarCoords = this._getPolarAxisCoords(groupIndex, rect);
            if (!polarCoords)
                return;

            var offsetX = $.jqx._ptrnd(polarCoords.x);
            var offsetY = $.jqx._ptrnd(polarCoords.y);
            var radius = polarCoords.r;
            var startAngle = polarCoords.startAngle;

            if (radius < 1)
                return;

            radius = $.jqx._ptrnd(radius);

            var offsets = this._calculateXOffsets(groupIndex, Math.PI * 2 * radius);
            if (!offsets.rangeLength)
                return;

            var ui = axis.unitInterval;
            if (isNaN(ui) || ui < 1)
                ui = 1;

            var hTextAlign = axis.horizontalTextAlignment;
            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var widgetRect = this.renderer.getRect();
            var paddingRight = widgetRect.width - rect.x - rect.width;
            var len = this._getDataLen(groupIndex);

            var oldPositions;
            if (this._elementRenderInfo && this._elementRenderInfo.length > groupIndex)
                oldPositions = this._elementRenderInfo[groupIndex].categoryAxis;

            var items = [];
            if (axis.type != 'date') {
                var isCustomRange = offsets.customRange != false;
                var step = ui;
                for (var i = offsets.min; i <= offsets.max; i += step) {
                    if (isCustomRange || axis.dataField == undefined || axis.dataField == '') {
                        value = i;
                    }
                    else {
                        var idx = Math.round(i);

                        value = this._getDataValue(idx, axis.dataField);
                    }

                    var text = this._formatValue(value, axis.formatSettings, axis.formatFunction, undefined, undefined, idx);
                    if (text == undefined)
                        text = !isCustomRange ? value.toString() : (i).toString();

                    var obj = { key: value, text: text };
                    if (oldPositions && oldPositions.itemOffsets[value]) {
                        obj.x = oldPositions.itemOffsets[value].x;
                        obj.y = oldPositions.itemOffsets[value].y;
                    }
                    items.push(obj);

                    if (i + step > offsets.max) {
                        step = offsets.max - i;
                        if (step <= ui / 2)
                            break;
                    }
                }
            }
            else {
                var arr = this._getDateTimeArray(offsets.min, offsets.max, axis.baseUnit, valuesOnTicks, ui);
                for (var i = 0; i < arr.length; i += ui) {
                    var value = arr[i];
                    var text = this._formatValue(value, axis.formatSettings, axis.formatFunction);

                    var obj = { key: value, text: text };
                    if (oldPositions && oldPositions.itemOffsets[value]) {
                        obj.x = oldPositions.itemOffsets[value].x;
                        obj.y = oldPositions.itemOffsets[value].y;
                    }
                    items.push(obj);
                }
            }

            if (axis.flip == true || this.rtl)
                items.reverse();

            var cssDesc = axis.descriptionClass;
            if (!cssDesc)
                cssDesc = this.toThemeProperty('jqx-chart-axis-description', null);

            var cssItems = axis['class'];
            if (!cssItems)
                cssItems = this.toThemeProperty('jqx-chart-axis-text', null);

            var text = axis.text;

            var textRotationAngle = axis.textRotationAngle || 0;

            var swapXY = this.seriesGroups[groupIndex].orientation == 'horizontal';
            if (swapXY)
                textRotationAngle -= 90;

            var gridLinesSettings = { visible: (axis.showGridLines != false), color: (axis.gridLinesColor || '#888888'), unitInterval: (axis.gridLinesInterval || axis.unitInterval), dashStyle: axis.gridLinesDashStyle };
            var tickMarksSettings = { visible: (axis.showTickMarks != false), color: (axis.tickMarksColor || '#888888'), unitInterval: (axis.tickMarksInterval || axis.unitInterval), dashStyle: axis.tickMarksDashStyle };

            var axisTextSettings = { text: axis.description, style: cssDesc, halign: axis.horizontalDescriptionAlignment || 'center', valign: axis.verticalDescriptionAlignment || 'center', textRotationAngle: swapXY ? -90 : 0 };
            var itemsTextSettings = { textRotationAngle: textRotationAngle, style: cssItems, halign: hTextAlign, valign: axis.verticalTextAlignment || 'center', textRotationPoint: axis.textRotationPoint || 'auto', textOffset: axis.textOffset };

            var isMirror = (swapXY && axis.position == 'right') || (!swapXY && axis.position == 'top');

            var renderData = { rangeLength: offsets.rangeLength, itemWidth: offsets.itemWidth };
            var itemsInfo = { items: items, renderData: renderData };

            while (this._renderData.length < groupIndex + 1)
                this._renderData.push({});

            this._renderData[groupIndex].categoryAxis = renderData;

            // draw the spider
            var strokeAttributes = { stroke: gridLinesSettings.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': gridLinesSettings.dashStyle || '' };
            var elem = this.renderer.circle(offsetX, offsetY, radius, strokeAttributes);

            var cnt = items.length;
            var aIncrement = 2 * Math.PI / (cnt);
            var aIncrementAdj = (valuesOnTicks ? 0 : aIncrement / 2) + startAngle;

            // draw text items
            for (var i = 0; i < cnt; i++) {
                var angle = aIncrement * i + aIncrementAdj;

                var sz = this.renderer.measureText(items[i].text, 0, { 'class': cssItems });
                var innerR = Math.sqrt(sz.width * sz.width + sz.height * sz.height) / 2;
                x = offsetX + (radius + 5 + innerR) * Math.cos(angle) - sz.width / 2;
                y = offsetY + (radius + 5 + innerR) * Math.sin(angle) - sz.height / 2;

                this.renderer.text(items[i].text, x, y, sz.width, sz.height, 0, { 'class': cssItems }, false, 'center', 'center');
            }

            // draw category axis grid lines and tick marks
            cnt = offsets.rangeLength;
            aIncrement = 2 * Math.PI / (cnt);
            aIncrementAdj = startAngle;

            // draw category axis grid lines
            if (gridLinesSettings.visible) {
                var gridLinesInterval = gridLinesSettings.unitInterval;
                if (isNaN(gridLinesInterval) || gridLinesInterval < 1)
                    gridLinesInterval = ui;

                for (var i = 0; i < cnt; i += gridLinesInterval) {
                    angle = aIncrement * i + aIncrementAdj;
                    x = offsetX + radius * Math.cos(angle);
                    y = offsetY + radius * Math.sin(angle);
                    this.renderer.line(offsetX, offsetY, $.jqx._ptrnd(x), $.jqx._ptrnd(y), strokeAttributes);
                }
            }

            // draw tick marks
            if (tickMarksSettings.visible) {
                var tickMarkSize = 5;

                var tickMarksInterval = tickMarksSettings.unitInterval;
                if (isNaN(tickMarksInterval) || tickMarksInterval < 1)
                    tickMarksInterval = ui;

                var strokeAttributes = { stroke: tickMarksSettings.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': tickMarksSettings.dashStyle || '' };

                for (var i = 0; i < cnt; i += tickMarksInterval) {
                    var angle = aIncrement * i + aIncrementAdj;

                    x1 = offsetX + radius * Math.cos(angle);
                    y1 = offsetY + radius * Math.sin(angle);
                    x2 = offsetX + (radius + tickMarkSize) * Math.cos(angle);
                    y2 = offsetY + (radius + tickMarkSize) * Math.sin(angle);
                    this.renderer.line($.jqx._ptrnd(x1), $.jqx._ptrnd(y1), $.jqx._ptrnd(x2), $.jqx._ptrnd(y2), strokeAttributes);
                }
            }

            ///// Draw Value Axis
            this._renderSpiderValueAxis(groupIndex, rect);

        },

        _renderSpiderValueAxis: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];

            var polarCoords = this._getPolarAxisCoords(groupIndex, rect);
            if (!polarCoords)
                return;

            var offsetX = $.jqx._ptrnd(polarCoords.x);
            var offsetY = $.jqx._ptrnd(polarCoords.y);
            var radius = polarCoords.r;
            var startAngle = polarCoords.startAngle;

            if (radius < 1)
                return;

            radius = $.jqx._ptrnd(radius);

            var valueAxis = this.seriesGroups[groupIndex].valueAxis;
            if (!valueAxis || false == valueAxis.displayValueAxis)
                return;

            var cssItems = valueAxis['class'];
            if (!cssItems)
                cssItems = this.toThemeProperty('jqx-chart-axis-text', null);

            var valueAxisformatSettings = valueAxis.formatSettings;
            var isStacked100 = group.type.indexOf("stacked") != -1 && group.type.indexOf("100") != -1;
            if (isStacked100 && !valueAxisformatSettings)
                valueAxisformatSettings = { sufix: '%' };

            this._calcValueAxisItems(groupIndex, radius);

            var valueAxisUnitInterval = this._stats.seriesGroups[groupIndex].mu;

            var valueAxisGridLinesSettings = { visible: (valueAxis.showGridLines != false), color: (valueAxis.gridLinesColor || '#888888'), unitInterval: (valueAxis.gridLinesInterval || valueAxisUnitInterval || 1), dashStyle: valueAxis.gridLinesDashStyle };
            var strokeAttributes = { stroke: valueAxisGridLinesSettings.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': valueAxisGridLinesSettings.dashStyle || '' };

            // draw value axis text
            var axisRenderData = this._renderData[groupIndex].valueAxis;
            var items = axisRenderData.items;
            if (items.length) {
                this.renderer.line(offsetX, offsetY, offsetX, $.jqx._ptrnd(offsetY - radius), strokeAttributes);
            }

            items = items.reverse();

            var renderer = this.renderer;

            for (var i = 0; i < items.length - 1; i++) {
                var value = items[i];
                var text = (valueAxis.formatFunction) ? valueAxis.formatFunction(value) : this._formatNumber(value, valueAxisformatSettings);

                var sz = renderer.measureText(text, 0, { 'class': cssItems });

                var x = offsetX + (valueAxis.showTickMarks != false ? 3 : 2);
                var y = offsetY - axisRenderData.itemWidth * i - sz.height;

                renderer.text(text, x, y, sz.width, sz.height, 0, { 'class': cssItems }, false, 'center', 'center');
            }

            var isLogAxis = valueAxis.logarithmicScale == true;

            var len = isLogAxis ? items.length : axisRenderData.rangeLength;
            aIncrement = 2 * Math.PI / len;

            // draw value axis grid lines
            if (valueAxisGridLinesSettings.visible) {
                var strokeAttributes = { stroke: valueAxisGridLinesSettings.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': valueAxisGridLinesSettings.dashStyle || '' };
                for (var i = 0; i < len; i += valueAxisGridLinesSettings.unitInterval) {
                    var y = $.jqx._ptrnd(radius * i / len);
                    renderer.circle(offsetX, offsetY, y, strokeAttributes);
                }
            }

            // draw value axis tick marks
            var valueAxisTickMarksSettings = { visible: (valueAxis.showTickMarks != false), color: (valueAxis.tickMarksColor || '#888888'), unitInterval: (valueAxis.tickMarksInterval || valueAxisUnitInterval), dashStyle: valueAxis.tickMarksDashStyle };

            if (valueAxisTickMarksSettings.visible) {
                tickMarkSize = 5;
                var strokeAttributes = { stroke: valueAxisTickMarksSettings.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': valueAxisTickMarksSettings.dashStyle || '' };

                var x1 = offsetX - Math.round(tickMarkSize / 2);
                var x2 = x1 + tickMarkSize;
                for (var i = 0; i < len; i += valueAxisTickMarksSettings.unitInterval) {
                    if (valueAxisGridLinesSettings.visible && (i % valueAxisGridLinesSettings.unitInterval) == 0)
                        continue;
                    var y = $.jqx._ptrnd(offsetY - radius * i / len);
                    renderer.line($.jqx._ptrnd(x1), y, $.jqx._ptrnd(x2), y, strokeAttributes);
                }
            }
        },

        _renderAxis: function (isVertical, isMirror, axisTextSettings, textSettings, rect, chartRect, ui, isLogAxis, valuesOnTicks, itemsInfo, gridLinesSettings, tickMarksSettings, isMeasure, animationDuration) {
            var tickMarkSize = tickMarksSettings.visible ? 4 : 0;
            var padding = 2;

            var szMeasure = { width: 0, height: 0 };
            var szMeasureDesc = { width: 0, height: 0 };

            if (isVertical)
                szMeasure.height = szMeasureDesc.height = rect.height;
            else
                szMeasure.width = szMeasureDesc.width = rect.width;

            if (!isMeasure && isMirror) {
                if (isVertical)
                    rect.x -= rect.width;
            }

            var renderData = itemsInfo.renderData;

            var itemWidth = renderData.intervalWidth;
            var rangeLength = renderData.rangeLength;

            if (axisTextSettings.text != undefined && axisTextSettings != '') {
                var textRotationAngle = axisTextSettings.textRotationAngle;
                var sz = this.renderer.measureText(axisTextSettings.text, textRotationAngle, { 'class': axisTextSettings.style });
                szMeasureDesc.width = sz.width;
                szMeasureDesc.height = sz.height;

                if (!isMeasure) {
                    this.renderer.text(
                        axisTextSettings.text,
                        rect.x + (isVertical ? (!isMirror ? padding : -padding + 2 * rect.width - szMeasureDesc.width) : 0),
                        rect.y + (!isVertical ? (!isMirror ? rect.height - padding - szMeasureDesc.height : padding) : 0),
                        isVertical ? szMeasureDesc.width : rect.width,
                        !isVertical ? szMeasureDesc.height : rect.height,
                        textRotationAngle,
                        { 'class': axisTextSettings.style },
                        true,
                        axisTextSettings.halign,
                        axisTextSettings.valign);
                }
            }

            var offset = 0;
            var textXAdjust = valuesOnTicks ? -itemWidth / 2 : 0;

            if (valuesOnTicks && !isVertical) {
                textSettings.halign = 'center';
            }

            var baseX = rect.x;
            var baseY = rect.y;

            var userOffset = textSettings.textOffset;
            if (userOffset) {
                if (!isNaN(userOffset.x))
                    baseX += userOffset.x;
                if (!isNaN(userOffset.y))
                    baseY += userOffset.y;
            }

            if (!isVertical) {
                baseX += textXAdjust;
                if (isMirror) {
                    baseY += szMeasureDesc.height > 0 ? szMeasureDesc.height + 3 * padding : 2 * padding;
                    baseY += tickMarkSize - (valuesOnTicks ? tickMarkSize : tickMarkSize / 4);
                }
                else {
                    baseY += valuesOnTicks ? tickMarkSize : tickMarkSize / 4;
                }
            }
            else {
                baseX += padding + (szMeasureDesc.width > 0 ? (szMeasureDesc.width + padding) : 0) + (isMirror ? rect.width - szMeasureDesc.width : 0);
                baseY += textXAdjust;
            }


            var h = 0;
            var w = 0;

            var items = itemsInfo.items;

            renderData.itemOffsets = {};

            if (this._isToggleRefresh || !this._isUpdate)
                animationDuration = 0;

            var canAnimate = false;
            for (var i = 0; i < items.length; i++, offset += itemWidth) {
                var text = items[i].text;

                var sz = this.renderer.measureText(text, textSettings.textRotationAngle, { 'class': textSettings.style });
                if (sz.width > w)
                    w = sz.width;
                if (sz.height > h)
                    h = sz.height;

                if (!isMeasure) {
                    if ((isVertical && offset > rect.height + 2) || (!isVertical && offset > rect.width + 2))
                        break;

                    var x = isVertical ? baseX : baseX + offset;
                    var y = isVertical ? baseY + offset : baseY;

                    renderData.itemOffsets[items[i].key] = { x: x, y: y };

                    if (!canAnimate)
                        if (!isNaN(items[i].x) || !isNaN(items[i].y) && animationDuration)
                            canAnimate = true;

                    items[i].targetX = x;
                    items[i].targetY = y;
                    items[i].width = !isVertical ? itemWidth : rect.width - 2 * padding - tickMarkSize - ((szMeasureDesc.width > 0) ? szMeasureDesc.width + padding : 0);
                    items[i].height = isVertical ? itemWidth : rect.height - 2 * padding - tickMarkSize - ((szMeasureDesc.height > 0) ? szMeasureDesc.height + padding : 0);
                    items[i].visible = !isLogAxis || (isLogAxis && (i % ui) == 0);
                }
            }

            if (!isMeasure) {
                var ctx = { items: items, textSettings: textSettings };
                if (isNaN(animationDuration) || !canAnimate)
                    animationDuration = 0;

                this._animateAxisText(ctx, animationDuration == 0 ? 1 : 0);
                var self = this;
                this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        animationDuration,
                        function (element, ctx, percent) {
                            self._animateAxisText(ctx, percent);
                        },
                        ctx);
            }

            szMeasure.width += 2 * padding + tickMarkSize + szMeasureDesc.width + w + (isVertical && szMeasureDesc.width > 0 ? padding : 0);
            szMeasure.height += 2 * padding + tickMarkSize + szMeasureDesc.height + h + (!isVertical && szMeasureDesc.height > 0 ? padding : 0);

            var gridLinePts = {};
            var strokeAttributes = { stroke: gridLinesSettings.color, 'stroke-width': 1, 'stroke-dasharray': gridLinesSettings.dashStyle || '' };


            if (!isMeasure) {
                var y = $.jqx._ptrnd(rect.y + (isMirror ? rect.height : 0));
                if (isVertical)
                    this.renderer.line($.jqx._ptrnd(rect.x + rect.width), rect.y, $.jqx._ptrnd(rect.x + rect.width), rect.y + rect.height, strokeAttributes);
                else {
                    this.renderer.line($.jqx._ptrnd(rect.x), y, $.jqx._ptrnd(rect.x + rect.width + 1), y, strokeAttributes);
                }
            }

            var rndErr = 0.5;

            // render vertical grid lines
            if (!isMeasure && gridLinesSettings.visible != false) {
                var gridLinesInterval = gridLinesSettings.unitInterval;
                if (isNaN(gridLinesInterval) || gridLinesInterval <= 0)
                    gridLinesInterval = ui;

                var len = isLogAxis ? items.length : rangeLength;
                var step = isLogAxis ? 1 : gridLinesInterval;
                var offsetStep = isLogAxis ? itemWidth : (isVertical ? rect.height : rect.width) / rangeLength;
                var i = 0;
                while (i <= len) {
                    if (isLogAxis && $.jqx._mod(i, gridLinesInterval) != 0) {
                        i += step;
                        continue;
                    }

                    var lineOffset = 0;

                    if (isVertical) {
                        lineOffset = $.jqx._ptrnd(rect.y + i * offsetStep);
                        if (lineOffset > rect.y + rect.height + rndErr)
                            break;
                    }
                    else {
                        lineOffset = $.jqx._ptrnd(rect.x + i * offsetStep);
                        if (lineOffset > rect.x + rect.width + rndErr)
                            break;
                    }

                    if (isVertical)
                        this.renderer.line($.jqx._ptrnd(chartRect.x), lineOffset, $.jqx._ptrnd(chartRect.x + chartRect.width), lineOffset, strokeAttributes);
                    else
                        this.renderer.line(lineOffset, $.jqx._ptrnd(chartRect.y), lineOffset, $.jqx._ptrnd(chartRect.y + chartRect.height), strokeAttributes);

                    gridLinePts[lineOffset] = true;

                    i += step;
                    if (i > len && i != len + step)
                        i = len;
                }
            }

            // render axis tick marks
            var strokeAttributes = { stroke: tickMarksSettings.color, 'stroke-width': 1, 'stroke-dasharray': tickMarksSettings.dashStyle || '' };

            if (!isMeasure && tickMarksSettings.visible) {
                var tickMarksInterval = tickMarksSettings.unitInterval;
                if (isNaN(tickMarksInterval) || tickMarksInterval <= 0)
                    tickMarksInterval = ui;

                var len = isLogAxis ? items.length : rangeLength + tickMarksInterval;
                var step = isLogAxis ? 1 : tickMarksInterval;
                var offsetStep = isLogAxis ? itemWidth : (isVertical ? rect.height : rect.width) / rangeLength;

                for (var i = 0; i <= len; i += step) {
                    if (isLogAxis && $.jqx._mod(i, tickMarksInterval / ui) != 0)
                        continue;

                    var lineOffset = $.jqx._ptrnd((isVertical ? rect.y : rect.x) + i * offsetStep);

                    if (gridLinePts[lineOffset - 1])
                        lineOffset--;
                    else if (gridLinePts[lineOffset + 1])
                        lineOffset++;

                    if (isVertical) {
                        if (lineOffset > rect.y + rect.height + rndErr)
                            break;
                    }
                    else {
                        if (lineOffset > rect.x + rect.width + rndErr)
                            break;
                    }

                    var tickSize = !isMirror ? -tickMarkSize : tickMarkSize;
                    if (isVertical) {
                        this.renderer.line(rect.x + rect.width, lineOffset, rect.x + rect.width + tickSize, lineOffset, strokeAttributes);
                    }
                    else {
                        var y = $.jqx._ptrnd(rect.y + (isMirror ? rect.height : 0));
                        this.renderer.line(lineOffset, y, lineOffset, y - tickSize, strokeAttributes);
                    }
                }
            }

            szMeasure.width = $.jqx._rup(szMeasure.width);
            szMeasure.height = $.jqx._rup(szMeasure.height);

            return szMeasure;
        },

        _calcValueAxisItems: function (groupIndex, axisLength) {
            var gstat = this._stats.seriesGroups[groupIndex];
            if (!gstat || !gstat.isValid) {
                return false;
            }

            var g = this.seriesGroups[groupIndex];
            var swapXY = g.orientation == 'horizontal';
            var axis = g.valueAxis;

            var valuesOnTicks = axis.valuesOnTicks != false;
            var field = axis.dataField;
            var ints = gstat.intervals;
            var unitH = axisLength / ints;

            var min = gstat.min;
            var mu = gstat.mu;

            var logAxis = axis.logarithmicScale == true;
            var logBase = axis.logarithmicScaleBase || 10;
            var isStacked100 = g.type.indexOf("stacked") != -1 && g.type.indexOf("100") != -1;

            if (logAxis) {
                mu = !isNaN(axis.unitInterval) ? axis.unitInterval : 1;
            }
            
            if (!valuesOnTicks) {
                ints = Math.max(ints - 1, 1);
            }

            while (this._renderData.length < groupIndex + 1)
                this._renderData.push({});

            this._renderData[groupIndex].valueAxis = {};
            var renderData = this._renderData[groupIndex].valueAxis;

            renderData.itemWidth = renderData.intervalWidth = unitH;
            renderData.items = [];
            var items = renderData.items;

            for (var i = 0; i <= ints; i++) {
                var value = 0;
                if (logAxis) {
                    if (isStacked100)
                        value = gstat.max / Math.pow(logBase, ints - i);
                    else
                        value = min * Math.pow(logBase, i);
                }
                else {
                    value = valuesOnTicks ? min + i * mu : min + (i + 0.5) * mu;
                }

                items.push(value);
                /*
                if (swapXY)
                offset += unitH;
                else
                offset -= unitH;*/
            }

            renderData.rangeLength = logAxis && !isStacked100 ? gstat.intervals : (gstat.intervals) * mu;

            if (g.valueAxis.flip != true) {
                items = items.reverse();
            }

            return true;
        },

        //[optimize]
        _renderValueAxis: function (groupIndex, rect, isMeasure, chartRect) {
            var g = this.seriesGroups[groupIndex];
            var swapXY = g.orientation == 'horizontal';
            var axis = g.valueAxis;
            if (!axis)
                throw 'SeriesGroup ' + groupIndex + ' is missing valueAxis definition';

            var szMeasure = { width: 0, height: 0 };

            if (!this._isGroupVisible(groupIndex) || this._isPieOnlySeries() || g.type == 'spider') {
                return szMeasure;
            }

            if (!this._calcValueAxisItems(groupIndex, (swapXY ? rect.width : rect.height)) || false == axis.displayValueAxis || false == axis.visible)
                return szMeasure;

            var cssDesc = axis.descriptionClass;
            if (!cssDesc)
                cssDesc = this.toThemeProperty('jqx-chart-axis-description', null);

            var axisTextSettings = {
                text: axis.description,
                style: cssDesc,
                halign: axis.horizontalDescriptionAlignment || 'center',
                valign: axis.verticalDescriptionAlignment || 'center',
                textRotationAngle: swapXY ? 0 : (!this.rtl ? -90 : 90)
            };

            var cssItems = axis.itemsClass;
            if (!cssItems)
                cssItems = this.toThemeProperty('jqx-chart-axis-text', null);

            var itemsTextSettings =
            {
                style: cssItems,
                halign: axis.horizontalTextAlignment || 'center',
                valign: axis.verticalTextAlignment || 'center',
                textRotationAngle: axis.textRotationAngle || 0,
                textRotationPoint: axis.textRotationPoint || 'auto',
                textOffset: axis.textOffset
            };

            var valuesOnTicks = axis.valuesOnTicks != false;
            var gstat = this._stats.seriesGroups[groupIndex];
            var mu = gstat.mu;

            var format = axis.formatSettings;
            var isStacked100 = g.type.indexOf("stacked") != -1 && g.type.indexOf("100") != -1;
            if (isStacked100 && !format)
                format = { sufix: '%' };

            var logAxis = axis.logarithmicScale == true;
            var logBase = axis.logarithmicScaleBase || 10;

            if (logAxis) {
                mu = !isNaN(axis.unitInterval) ? axis.unitInterval : 1;
            }

            var items = [];

            var renderData = this._renderData[groupIndex].valueAxis;

            var oldPositions;
            if (this._elementRenderInfo && this._elementRenderInfo.length > groupIndex)
                oldPositions = this._elementRenderInfo[groupIndex].valueAxis;

            for (var i = 0; i < renderData.items.length; i++) {
                var value = renderData.items[i];
                var text = (axis.formatFunction) ? axis.formatFunction(value) : this._formatNumber(value, format);

                var obj = { key: value, text: text };
                if (oldPositions && oldPositions.itemOffsets[value]) {
                    obj.x = oldPositions.itemOffsets[value].x;
                    obj.y = oldPositions.itemOffsets[value].y;
                }
                items.push(obj);
            }

            var gridLinesInterval = axis.gridLinesInterval || axis.unitInterval;
            if (isNaN(gridLinesInterval) || (logAxis && gridLinesInterval < mu))
                gridLinesInterval = mu;

            var gridLinesSettings = { visible: (axis.showGridLines != false), color: (axis.gridLinesColor || '#888888'), unitInterval: gridLinesInterval, dashStyle: axis.gridLinesDashStyle };

            var tickMarksInterval = axis.tickMarksInterval || axis.unitInterval;
            if (isNaN(tickMarksInterval) || (logAxis && tickMarksInterval < mu))
                tickMarksInterval = mu;

            var tickMarksSettings = { visible: (axis.showTickMarks != false), color: (axis.tickMarksColor || '#888888'), unitInterval: tickMarksInterval, dashStyle: axis.tickMarksDashStyle };

            var isMirror = (swapXY && axis.position == 'top') || (!swapXY && axis.position == 'right') || (!swapXY && this.rtl && axis.position != 'left'); ;

            var itemsInfo = { items: items, renderData: renderData };

            var anim = this._getAnimProps(groupIndex);
            var duration = anim.enabled && items.length < 500 ? anim.duration : 0;
            if (this.enableAxisTextAnimation == false)
                duration = 0;

            return this._renderAxis(!swapXY, isMirror, axisTextSettings, itemsTextSettings, rect, chartRect, mu, logAxis, valuesOnTicks, itemsInfo, gridLinesSettings, tickMarksSettings, isMeasure, duration);
        },

        //[optimize]
        _buildStats: function (rect) {
            var stat = { seriesGroups: new Array() };
            this._stats = stat;

            for (var gidx = 0; gidx < this.seriesGroups.length; gidx++) {
                var group = this.seriesGroups[gidx];
                stat.seriesGroups[gidx] = {};
                var grst = stat.seriesGroups[gidx];
                grst.isValid = true;


                var hasValueAxis = group.valueAxis != undefined;
                var valueAxisSize = (group.orientation == 'horizontal') ? rect.width : rect.height;

                var logAxis = false;
                var logBase = 10;

                if (hasValueAxis) {
                    logAxis = group.valueAxis.logarithmicScale == true;
                    logBase = group.valueAxis.logarithmicScaleBase;
                    if (isNaN(logBase))
                        logBase = 10;
                }

                var isStacked = -1 != group.type.indexOf("stacked");
                var isStacked100 = isStacked && -1 != group.type.indexOf("100");
                var isRange = -1 != group.type.indexOf("range");

                if (isStacked100) {
                    grst.psums = new Array();
                    grst.nsums = new Array();
                }

                var gmin = NaN, gmax = NaN;
                var gsumP = NaN, gsumN = NaN;
                var gbase = group.baselineValue;
                if (isNaN(gbase))
                    gbase = logAxis && !isStacked100 ? 1 : 0;

                var len = this._getDataLen(gidx);
                var gMaxRange = 0;
                var minPercent = NaN;

                for (var i = 0; i < len && grst.isValid; i++) {
                    var min = hasValueAxis ? group.valueAxis.minValue : Infinity;
                    var max = hasValueAxis ? group.valueAxis.maxValue : -Infinity;
                    var sumP = 0, sumN = 0;

                    for (var sidx = 0; sidx < group.series.length; sidx++) {
                        if (!this._isSerieVisible(gidx, sidx))
                            continue;

                        var val = undefined, valMax = undefined, valMin = undefined;
                        if (isRange) {
                            var valFrom = this._getDataValueAsNumber(i, group.series[sidx].dataFieldFrom, gidx);
                            var valTo = this._getDataValueAsNumber(i, group.series[sidx].dataFieldTo, gidx);
                            valMax = Math.max(valFrom, valTo);
                            valMin = Math.min(valFrom, valTo);
                        }
                        else {
                            val = this._getDataValueAsNumber(i, group.series[sidx].dataField, gidx);
                            if (isNaN(val) || (logAxis && val <= 0))
                                continue;

                            valMin = valMax = val;
                        }


                        if ((isNaN(max) || valMax > max) && ((!hasValueAxis || isNaN(group.valueAxis.maxValue)) ? true : valMax <= group.valueAxis.maxValue))
                            max = valMax;
                        if ((isNaN(min) || valMin < min) && ((!hasValueAxis || isNaN(group.valueAxis.minValue)) ? true : valMin >= group.valueAxis.minValue))
                            min = valMin;

                        if (!isNaN(val)) {
                            if (val > gbase)
                                sumP += val;
                            else if (val < gbase)
                                sumN += val;
                        }
                    } // for sidx

                    if (logAxis && isStacked100) {
                        for (var sidx = 0; sidx < group.series.length; sidx++) {
                            if (!this._isSerieVisible(gidx, sidx))
                                continue;

                            var val = this._getDataValueAsNumber(i, group.series[sidx].dataField, gidx);
                            if (isNaN(val) || val <= 0)
                                continue;

                            var p = sumP == 0 ? 0 : val / sumP;
                            if (isNaN(minPercent) || p < minPercent)
                                minPercent = p;
                        }
                    }

                    var range = sumP - sumN;
                    if (gMaxRange < range)
                        gMaxRange = range;

                    if (isStacked100) {
                        grst.psums[i] = sumP;
                        grst.nsums[i] = sumN;
                    }

                    if (max > gmax || isNaN(gmax))
                        gmax = max;
                    if (min < gmin || isNaN(gmin))
                        gmin = min;

                    if (sumP > gsumP || isNaN(gsumP))
                        gsumP = sumP;
                    if (sumN < gsumN || isNaN(gsumN))
                        gsumN = sumN;
                }

                if (isStacked100) {
                    gsumP = gsumP == 0 ? 0 : Math.max(gsumP, -gsumN);
                    gsumN = gsumN == 0 ? 0 : Math.min(gsumN, -gsumP);
                }

                var mu = hasValueAxis ? group.valueAxis.unitInterval : 0;
                if (!mu) {
                    //_calcInterval
                    if (hasValueAxis) {
                        mu = this._calcInterval(
                            isStacked ? gsumN : gmin,
                            isStacked ? gsumP : gmax,
                            Math.max(valueAxisSize / 80, 2));
                    }
                    else {
                        mu = isStacked ? (gsumP - gsumN) / 10 : (gmax - gmin) / 10;
                    }
                }

                var intervals = NaN;

                ///
                // log axis scale
                var minPow = 0;
                var maxPow = 0;
                if (logAxis) {
                    if (isStacked100) {
                        intervals = 0;
                        var p = 1;
                        minPow = maxPow = $.jqx.log(100, logBase);

                        while (p > minPercent) {
                            p /= logBase;
                            minPow--;
                            intervals++;
                        }
                        gmin = Math.pow(logBase, minPow);

                    }
                    else {
                        if (isStacked)
                            gmax = Math.max(gmax, gsumP);

                        maxPow = $.jqx._rnd($.jqx.log(gmax, logBase), 1, true);
                        gmax = Math.pow(logBase, maxPow);

                        minPow = $.jqx._rnd($.jqx.log(gmin, logBase), 1, false);
                        gmin = Math.pow(logBase, minPow);
                    }

                    mu = logBase;
                }
                ////

                var tickMarksInterval = hasValueAxis ? group.valueAxis.tickMarksInterval || mu : 0;
                var gridLinesInterval = hasValueAxis ? group.valueAxis.gridLinesInterval || mu : 0;

                if (gmin < gsumN)
                    gsumN = gmin;
                if (gmax > gsumP)
                    gsumP = gmax;

                var mn = logAxis ? gmin : $.jqx._rnd(isStacked ? gsumN : gmin, mu, false);
                var mx = logAxis ? gmax : $.jqx._rnd(isStacked ? gsumP : gmax, mu, true);

                if (isStacked100 && mx > 100)
                    mx = 100;

                if (isStacked100 && !logAxis) {
                    mx = (mx > 0) ? 100 : 0;
                    mn = (mn < 0) ? -100 : 0;
                    mu = hasValueAxis ? group.valueAxis.unitInterval : 10;
                    if (isNaN(mu) || mu <= 0 || mu >= 100)
                        mu = 10;
                    if (tickMarksInterval <= 0 || tickMarksInterval >= 100)
                        tickMarksInterval = 10;
                    if (gridLinesInterval <= 0 || gridLinesInterval >= 100)
                        gridLinesInterval = 10;
                }

                if (isNaN(mx) || isNaN(mn) || isNaN(mu))
                    continue;

                if (isNaN(intervals))
                    intervals = parseInt(((mx - mn) / (mu == 0 ? 1 : mu)).toFixed());

                if (logAxis && !isStacked100) {
                    intervals = maxPow - minPow;
                    gMaxRange = Math.pow(logBase, intervals);
                }

                if (intervals < 1)
                    continue;

                var diff = mx - mn;
                grst.rmax = isStacked ? gsumP : gmax;
                grst.rmin = isStacked ? gsumN : gmin;
                grst.min = mn;
                grst.max = mx;
                grst.minPow = minPow;
                grst.maxPow = maxPow;
                grst.mu = mu;
                grst.maxRange = gMaxRange;
                grst.intervals = intervals;
                grst.tickMarksInterval = tickMarksInterval;
                grst.tickMarksIntervals = tickMarksInterval == 0 ? 0 : diff / tickMarksInterval;
                grst.gridLinesInterval = gridLinesInterval;
                grst.gridLinesIntervals = gridLinesInterval == 0 ? 0 : diff / gridLinesInterval;
                if (diff == 0)
                    diff = 1;
                grst.scale = isStacked ? (gsumP - gsumN) / diff : (gmax - gmin) / diff;
            }
        },

        //[optimize]
        _getDataLen: function (groupIndex) {
            var ds = this.source;
            if (groupIndex != undefined && groupIndex != -1 && this.seriesGroups[groupIndex].source)
                ds = this.seriesGroups[groupIndex].source;

            if (ds instanceof $.jqx.dataAdapter)
                ds = ds.records;

            if (ds)
                return ds.length;

            return 0;
        },

        //[optimize]
        _getDataValue: function (index, dataField, groupIndex) {
            var ds = this.source;
            if (groupIndex != undefined && groupIndex != -1)
                ds = this.seriesGroups[groupIndex].source || ds;

            if (ds instanceof $.jqx.dataAdapter)
                ds = ds.records;

            if (!ds || index < 0 || index > ds.length - 1)
                return NaN;

            return (dataField && dataField != '') ? ds[index][dataField] : ds[index];
        },

        //[optimize]
        _getDataValueAsNumber: function (index, dataField, groupIndex) {
            var val = this._getDataValue(index, dataField, groupIndex);
            if (this._isDate(val))
                return val.valueOf();

            if (typeof (val) != 'number')
                val = parseFloat(val);
            if (typeof (val) != 'number')
                val = undefined;
            return val;
        },

        //[optimize]
        _renderPieSeries: function (groupIndex, rect) {
            var dataLength = this._getDataLen(groupIndex);
            var group = this.seriesGroups[groupIndex];

            var renderData = this._calcGroupOffsets(groupIndex, rect).offsets;

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var s = group.series[sidx]

                var settings = this._getSerieSettings(groupIndex, sidx);

                var colorScheme = s.colorScheme || group.colorScheme || this.colorScheme;

                var anim = this._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && dataLength < 5000 && !this._isToggleRefresh && this._isVML != true ? anim.duration : 0;
                if ($.jqx.mobile.isMobileBrowser() && (this.renderer instanceof $.jqx.HTML5Renderer))
                    duration = 0;

                var ctx = { rect: rect, groupIndex: groupIndex, serieIndex: sidx, settings: settings, items: [] };

                // render
                for (var i = 0; i < dataLength; i++) {

                    if (!this._isSerieVisible(groupIndex, sidx, i))
                        continue;

                    var itemRenderData = renderData[sidx][i];

                    var pieSliceElement = this.renderer.pieslice(
                        itemRenderData.x,
                        itemRenderData.y,
                        itemRenderData.innerRadius,
                        itemRenderData.outerRadius,
                        itemRenderData.fromAngle,
                        duration == 0 ? itemRenderData.toAngle : itemRenderData.fromAngle,
                        itemRenderData.centerOffset);

                    var ctxItem = { element: pieSliceElement, displayValue: itemRenderData.displayValue, itemIndex: i, x: itemRenderData.x, y: itemRenderData.y, innerRadius: itemRenderData.innerRadius, outerRadius: itemRenderData.outerRadius, fromAngle: itemRenderData.fromAngle, toAngle: itemRenderData.toAngle, centerOffset: itemRenderData.centerOffset };
                    ctx.items.push(ctxItem);
                } // for i

                this._animatePieSlices(ctx, 0);
                var self = this;
                this._enqueueAnimation(
                        "series",
                        pieSliceElement,
                        undefined,
                        duration,
                        function (element, ctx, percent) {
                            self._animatePieSlices(ctx, percent);
                        },
                        ctx);
            }
        },


        _sliceSortFunction: function (a, b) {
            return a.fromAngle - b.fromAngle;
        },

        _animatePieSlices: function (ctx, percent) {
            var renderInfo;
            if (this._elementRenderInfo &&
                this._elementRenderInfo.length > ctx.groupIndex &&
                this._elementRenderInfo[ctx.groupIndex].series &&
                this._elementRenderInfo[ctx.groupIndex].series.length > ctx.serieIndex) {
                renderInfo = this._elementRenderInfo[ctx.groupIndex].series[ctx.serieIndex];
            }

            var animMaxAngle = 360 * percent;

            var arr = [];
            for (var i = 0; i < ctx.items.length; i++) {
                var item = ctx.items[i];

                var fromAngle = item.fromAngle;
                var toAngle = item.fromAngle + percent * (item.toAngle - item.fromAngle);

                if (renderInfo && renderInfo[item.displayValue]) {
                    var oldFromAngle = renderInfo[item.displayValue].fromAngle;
                    var oldToAngle = renderInfo[item.displayValue].toAngle;

                    fromAngle = oldFromAngle + (fromAngle - oldFromAngle) * percent;
                    toAngle = oldToAngle + (toAngle - oldToAngle) * percent;
                }

                arr.push({ index: i, from: fromAngle, to: toAngle });
            }

            if (renderInfo)
                arr.sort(this._sliceSortFunction);

            var prevToAngle = NaN;
            for (var i = 0; i < arr.length; i++) {
                var item = ctx.items[arr[i].index];

                var fromAngle = arr[i].from;
                var toAngle = arr[i].to;

                if (renderInfo) {
                    if (!isNaN(prevToAngle) && fromAngle > prevToAngle)
                        fromAngle = prevToAngle;

                    prevToAngle = toAngle;
                    if (i == arr.length - 1 && toAngle != arr[0].from)
                        toAngle = 360 + arr[0].from;
                }

                var cmd = this.renderer.pieSlicePath(item.x, item.y, item.innerRadius, item.outerRadius, fromAngle, toAngle, item.centerOffset);
                this.renderer.attr(item.element, { 'd': cmd });

                var colors = this._getColors(ctx.groupIndex, ctx.serieIndex, item.itemIndex, 'radialGradient', item.outerRadius);
                var settings = ctx.settings;

                this.renderer.attr(item.element, { fill: colors.fillColor, stroke: colors.lineColor, 'stroke-width': settings.stroke, 'fill-opacity': settings.opacity, 'stroke-opacity': settings.opacity, 'stroke-dasharray': 'none' || settings.dashStyle });

                // Label rendering
                if (item.labelElement)
                    this.renderer.removeElement(item.labelElement);

                var angleFrom = fromAngle, angleTo = toAngle;
                var diff = Math.abs(angleFrom - angleTo);
                var lFlag = diff > 180 ? 1 : 0;
                if (diff > 360) {
                    angleFrom = 0;
                    angleTo = 360;
                }

                var radFrom = angleFrom * Math.PI * 2 / 360;
                var radTo = angleTo * Math.PI * 2 / 360;
                var midAngle = diff / 2 + angleFrom;
                var radMid = midAngle * Math.PI * 2 / 360;

                // measure
                var sz = this._showLabel(ctx.groupIndex, ctx.serieIndex, item.itemIndex, { x: 0, y: 0, width: 0, height: 0 }, 'left', 'top', true);
                var g = this.seriesGroups[ctx.groupIndex];
                var s = g.series[ctx.serieIndex];
                var labelRadius = s.labelRadius || item.outerRadius + Math.max(sz.width, sz.height);
                labelRadius += item.centerOffset;

                var offsetX = $.jqx.getNum([s.offsetX, g.offsetX, ctx.rect.width / 2]);
                var offsetY = $.jqx.getNum([s.offsetY, g.offsetY, ctx.rect.height / 2]);

                var x = $.jqx._ptrnd(ctx.rect.x + offsetX + labelRadius * Math.cos(radMid) - sz.width / 2);
                var y = $.jqx._ptrnd(ctx.rect.y + offsetY - labelRadius * Math.sin(radMid) - sz.height / 2);

                item.labelElement = this._showLabel(ctx.groupIndex, ctx.serieIndex, item.itemIndex, { x: x, y: y, width: sz.width, height: sz.height }, 'left', 'top');
                //this.renderer.attr(item.labelElement, { opacity: percent });

                // Install mouse event handlers
                if (percent == 1.0)
                    this._installHandlers(item.element, ctx.groupIndex, ctx.serieIndex, item.itemIndex);
            }
        },

        //[optimize]
        _getColumnGroupsCount: function (orientation) {
            var cnt = 0;
            orientation = orientation || 'vertical';
            var sg = this.seriesGroups;
            for (var i = 0; i < sg.length; i++) {
                var groupOrientation = sg[i].orientation || 'vertical';
                if (sg[i].type.indexOf('column') != -1 && groupOrientation == orientation)
                    cnt++;
            }

            return cnt;
        },

        //[optimize]
        _getColumnGroupIndex: function (groupIndex) {
            var idx = 0;
            var orientation = this.seriesGroups[groupIndex].orientation || 'vertical';
            for (var i = 0; i < groupIndex; i++) {
                var sg = this.seriesGroups[i];
                var sgOrientation = sg.orientation || 'vertical';
                if (sg.type.indexOf('column') != -1 && sgOrientation == orientation)
                    idx++;
            }

            return idx;
        },

        //[optimize]
        _renderBand: function (groupIndex, bandIndex, rect) {
            var group = this.seriesGroups[groupIndex];
            if (!group.bands || group.bands.length <= bandIndex)
                return;
            var gRect = rect;
            if (group.orientation == 'horizontal')
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);
            if (!renderData || renderData.length <= groupIndex)
                return;

            var band = group.bands[bandIndex];
            var bandRenderData = renderData.bands[bandIndex];

            var from = bandRenderData.from;
            var to = bandRenderData.to;
            var h = Math.abs(from - to);

            var elRect = { x: gRect.x, y: Math.min(from, to), width: gRect.width, height: h };
            if (group.orientation == 'horizontal') {
                var tmp = elRect.x;
                elRect.x = elRect.y;
                elRect.y = tmp;

                tmp = elRect.width;
                elRect.width = elRect.height;
                elRect.height = tmp;
            }

            var bandElement = this.renderer.rect(elRect.x, elRect.y, elRect.width, elRect.height);
            var fillColor = band.color || '#AAAAAA';
            var opacity = band.opacity;
            if (isNaN(opacity) || opacity < 0 || opacity > 1)
                opacity = 0.5;

            this.renderer.attr(bandElement, { fill: fillColor, 'fill-opacity': opacity, stroke: fillColor, 'stroke-opacity': opacity, 'stroke-width': 0 });

        },

        //[optimize]
        _renderColumnSeries: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var isStacked = group.type.indexOf('stacked') != -1;
            var isStacked100 = isStacked && group.type.indexOf('100') != -1;
            var isRange = group.type.indexOf('range') != -1;

            var dataLength = this._getDataLen(groupIndex);

            var columnGap = group.columnsGapPercent;
            if (isNaN(columnGap) || columnGap < 0 || columnGap > 100)
                columnGap = 25;

            var seriesGap = group.seriesGapPercent;
            if (isNaN(seriesGap) || seriesGap < 0 || seriesGap > 100)
                seriesGap = 10;

            var inverse = group.orientation == 'horizontal';

            var gRect = rect;
            if (inverse)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);
            if (!renderData || renderData.xoffsets.length == 0)
                return;

            var columnGroupsCount = this._getColumnGroupsCount(group.orientation);
            var relativeGroupIndex = this._getColumnGroupIndex(groupIndex);
            if (this.columnSeriesOverlap == true) {
                columnGroupsCount = 1;
                relativeGroupIndex = 0;
            }

            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var polarAxisCoords;
            if (group.polar == true || group.spider == true) {
                polarAxisCoords = this._getPolarAxisCoords(groupIndex, gRect);

                // reset the columns gap to 0 in case of a polar axis
                columnGap = 0;
                seriesGap = 0;
                //valuesOnTicks = false;
            }

            var ctx = { groupIndex: groupIndex, rect: rect, vertical: !inverse, seriesCtx: [], renderData: renderData, polarAxisCoords: polarAxisCoords };

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var s = group.series[sidx];
                var columnsMaxWidth = s.columnsMaxWidth || group.columnsMaxWidth;

                var dataField = s.dataField;

                var anim = this._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && !this._isToggleRefresh && renderData.xoffsets.length < 100 ? anim.duration : 0;

                // Calculate horizontal adjustment
                var xAdjust = 0;
                var itemWidth = renderData.xoffsets.itemWidth;
                if (valuesOnTicks)
                    xAdjust -= itemWidth / 2;

                xAdjust += itemWidth * (relativeGroupIndex / columnGroupsCount);
                itemWidth /= columnGroupsCount;

                var x2 = xAdjust + itemWidth;
                var wGroup = (x2 - xAdjust + 1);
                var wGroupRender = (x2 - xAdjust + 1) / (1 + columnGap / 100);
                var seriesSpace = (!isStacked && group.series.length > 1) ? (wGroupRender * seriesGap / 100) / (group.series.length - 1) : 0;
                var wColumn = (wGroupRender - seriesSpace * (group.series.length - 1));
                if (wGroupRender < 1)
                    wGroupRender = 1;

                var col = 0;
                if (!isStacked && group.series.length > 1) {
                    wColumn /= group.series.length;
                    col = sidx;
                }

                var xAdj = xAdjust + (wGroup - wGroupRender) / 2 + col * (seriesSpace + wColumn);
                if (col == group.series.length)
                    wColumn = wGroup - xAdjust + wGroupRender - x;

                if (!isNaN(columnsMaxWidth)) {
                    var wColumnAdj = Math.min(wColumn, columnsMaxWidth);
                    xAdj = xAdj + (wColumn - wColumnAdj) / 2;
                    wColumn = wColumnAdj;
                }
                ///////////////////////////////////
                var isVisible = this._isSerieVisible(groupIndex, sidx);

                var serieCtx = { seriesIndex: sidx, columnWidth: wColumn, xAdjust: xAdj, isVisible: isVisible };
                ctx.seriesCtx.push(serieCtx);
            }

            this._animateColumns(ctx, duration == 0 ? 1 : 0);

            var self = this;
            this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        duration,
                        function (element, ctx, percent) {
                            self._animateColumns(ctx, percent);
                        },
                        ctx);
        },

        _getColumnOffsets: function (renderData, groupIndex, seriesCtx, itemIndex, isStacked, percent) {
            var offsets = [];

            var toCumulative = NaN;
            for (var iSerie = 0; iSerie < seriesCtx.length; iSerie++) {
                var serieCtx = seriesCtx[iSerie];
                var sidx = serieCtx.seriesIndex;
                var group = this.seriesGroups[groupIndex];
                var s = group.series[sidx];

                var from = renderData.offsets[sidx][itemIndex].from;
                var to = renderData.offsets[sidx][itemIndex].to;
                var xOffset = renderData.xoffsets.data[itemIndex];

                var itemStartState = undefined;

                var isVisible = serieCtx.isVisible;
                if (!isVisible)
                    to = from;

                if (isVisible && this._elementRenderInfo && this._elementRenderInfo.length > groupIndex) {
                    var xvalue = renderData.xoffsets.xvalues[itemIndex];
                    itemStartState = this._elementRenderInfo[groupIndex].series[sidx][xvalue];
                    if (itemStartState && !isNaN(itemStartState.from) && !isNaN(itemStartState.to)) {
                        from = itemStartState.from + (from - itemStartState.from) * percent;
                        if (!isNaN(toCumulative) && isStacked && from != toCumulative)
                            from = toCumulative;
                        to = itemStartState.to + (to - itemStartState.to) * percent;
                        xOffset = itemStartState.xoffset + (xOffset - itemStartState.xoffset) * percent;
                    }
                }

                if (!itemStartState)
                    to = from + (to - from) * (isStacked ? 1 : percent);

                toCumulative = to;

                offsets.push({ from: from, to: to, xOffset: xOffset });
            }

            if (isStacked && offsets.length > 1 && !(this._elementRenderInfo && this._elementRenderInfo.length > groupIndex)) {
                var t = offsets[0].from + (toCumulative - offsets[0].from) * percent;

                for (var i = 0; i < offsets.length; i++) {
                    if (offsets[i].to < offsets[i].from) {
                        if (offsets[i].to < t)
                            offsets[i].to = t;
                        if (offsets[i].from < t)
                            offsets[i].from = t;
                    }
                    else {
                        if (offsets[i].to > t)
                            offsets[i].to = t;
                        if (offsets[i].from > t)
                            offsets[i].from = t;
                    }
                }
            }

            return offsets;
        },

        _columnAsPieSlice: function (elements, elementIndex, plotRect, polarAxisCoords, columnRect) {
            var pointOuter = this._toPolarCoord(polarAxisCoords, plotRect, columnRect.x, columnRect.y)
            var pointInner = this._toPolarCoord(polarAxisCoords, plotRect, columnRect.x, columnRect.y + columnRect.height)
            var pointOuter2 = this._toPolarCoord(polarAxisCoords, plotRect, columnRect.x + columnRect.width, columnRect.y)

            var innerRadius = $.jqx._ptdist(polarAxisCoords.x, polarAxisCoords.y, pointInner.x, pointInner.y);
            var outerRadius = $.jqx._ptdist(polarAxisCoords.x, polarAxisCoords.y, pointOuter.x, pointOuter.y);
            var width = plotRect.width;

            var toAngle = -((columnRect.x - plotRect.x) * 360) / width;
            var fromAngle = -((columnRect.x + columnRect.width - plotRect.x) * 360) / width;

            var startAngle = polarAxisCoords.startAngle;
            startAngle = 360 * startAngle / (Math.PI * 2);
            toAngle -= startAngle;
            fromAngle -= startAngle;

            if (elements[elementIndex] != undefined) {
                var cmd = this.renderer.pieSlicePath(polarAxisCoords.x, polarAxisCoords.y, innerRadius, outerRadius, fromAngle, toAngle, 0);
                this.renderer.attr(elements[elementIndex], { 'd': cmd });
            }
            else {
                elements[elementIndex] = this.renderer.pieslice(
                                    polarAxisCoords.x,
                                    polarAxisCoords.y,
                                    innerRadius,
                                    outerRadius,
                                    fromAngle,
                                    toAngle,
                                    0);
            }

            return { fromAngle: fromAngle, toAngle: toAngle, innerRadius: innerRadius, outerRadius: outerRadius };
        },

        _animateColumns: function (context, percent) {
            var gidx = context.groupIndex;
            var group = this.seriesGroups[gidx];
            var renderData = context.renderData;

            var isStacked = group.type.indexOf('stacked') != -1;

            var polarAxisCoords = context.polarAxisCoords;

            for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {

                var offsets = this._getColumnOffsets(renderData, gidx, context.seriesCtx, i, isStacked, percent);

                for (var iSerie = 0; iSerie < context.seriesCtx.length; iSerie++) {
                    var serieCtx = context.seriesCtx[iSerie];
                    var sidx = serieCtx.seriesIndex;
                    var s = group.series[sidx];

                    var from = offsets[iSerie].from;
                    var to = offsets[iSerie].to;
                    var xOffset = offsets[iSerie].xOffset;

                    if (!serieCtx.elements)
                        serieCtx.elements = {};

                    if (!serieCtx.labelElements)
                        serieCtx.labelElements = {};

                    var elements = serieCtx.elements;
                    var labelElements = serieCtx.labelElements;

                    var startOffset = (context.vertical ? context.rect.x : context.rect.y) + serieCtx.xAdjust;

                    var settings = this._getSerieSettings(gidx, sidx);
                    var colors = settings.colors;

                    var isVisible = this._isSerieVisible(gidx, sidx);

                    if (!isVisible) {
                        if (!isStacked)
                            continue;
                    }

                    var x = $.jqx._ptrnd(startOffset + xOffset);

                    var rect = { x: x, width: serieCtx.columnWidth };

                    if (context.vertical) {
                        rect.y = from;
                        rect.height = to - from;
                        if (rect.height < 0) {
                            rect.y += rect.height;
                            rect.height = -rect.height;
                        }
                    }
                    else {
                        rect.x = from < to ? from : to;
                        rect.width = Math.abs(from - to);
                        rect.y = x;
                        rect.height = serieCtx.columnWidth;
                    }

                    var size = from - to;
                    if (isNaN(size))
                        continue;

                    size = Math.abs(size);

                    if (elements[i] == undefined) {
                        if (!polarAxisCoords) {
                            elements[i] = this.renderer.rect(rect.x, rect.y, context.vertical ? rect.width : 0, context.vertical ? 0 : rect.height);
                        }
                        else {
                            this._columnAsPieSlice(elements, i, context.rect, polarAxisCoords, rect);
                        }

                        this.renderer.attr(elements[i], { fill: colors.fillColor, 'fill-opacity': settings.opacity, 'stroke-opacity': settings.opacity, stroke: colors.lineColor, 'stroke-width': settings.stroke, 'stroke-dasharray': settings.dashStyle });
                    }

                    if (size < 1 && percent != 1)
                        this.renderer.attr(elements[i], { display: 'none' });
                    else
                        this.renderer.attr(elements[i], { display: 'block' });

                    if (polarAxisCoords) {
                        var pieSliceInfo = this._columnAsPieSlice(elements, i, context.rect, polarAxisCoords, rect);
                        var colors = this._getColors(gidx, sidx, undefined, 'radialGradient', pieSliceInfo.outerRadius);
                        this.renderer.attr(elements[i], { fill: colors.fillColor, 'fill-opacity': settings.opacity, 'stroke-opacity': settings.opacity, stroke: colors.lineColor, 'stroke-width': settings.stroke, 'stroke-dasharray': settings.dashStyle });

                    }
                    else {
                        if (context.vertical == true)
                            this.renderer.attr(elements[i], { x: rect.x, y: rect.y, height: size });
                        else
                            this.renderer.attr(elements[i], { x: rect.x, y: rect.y, width: size });
                    }

                    this.renderer.removeElement(labelElements[i]);
                    labelElements[i] = this._showLabel(gidx, sidx, i, rect);

                    if (percent == 1.0) {
                        this._installHandlers(elements[i], gidx, sidx, i);
                    }
                }
            }
        },

        //[optimize]
        _renderScatterSeries: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var isBubble = group.type == 'bubble';

            var inverse = group.orientation == 'horizontal';

            var gRect = rect;
            if (inverse)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);

            if (!renderData || renderData.xoffsets.length == 0)
                return;

            var scaleWidth = gRect.width;

            var polarAxisCoords;
            if (group.polar || group.spider) {
                polarAxisCoords = this._getPolarAxisCoords(groupIndex, gRect);
                scaleWidth = 2 * polarAxisCoords.r;
            }

            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var settings = this._getSerieSettings(groupIndex, sidx);
                var colors = settings.colors;

                var s = group.series[sidx];
                var dataField = s.dataField;

                var min = NaN, max = NaN;
                if (isBubble) {
                    for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {
                        var val = this._getDataValueAsNumber(i, s.radiusDataField, groupIndex);
                        if (typeof (val) != 'number')
                            throw 'Invalid radiusDataField value at [' + i + ']';

                        if (!isNaN(val)) {
                            if (isNaN(min) || val < min)
                                min = val;
                            if (isNaN(max) || val > max)
                                max = val;
                        }
                    }
                }

                var minRadius = s.minRadius;
                if (isNaN(minRadius))
                    minRadius = scaleWidth / 50;

                var maxRadius = s.maxRadius;
                if (isNaN(maxRadius))
                    maxRadius = scaleWidth / 25;

                if (minRadius > maxRadius)
                    maxRadius = minRadius;

                var radius = s.radius || 5;

                var anim = this._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && !this._isToggleRefresh && renderData.xoffsets.length < 5000 ? anim.duration : 0;

                var ctx = {
                    groupIndex: groupIndex,
                    seriesIndex: sidx,
                    fill: colors.fillColor, 'fill-opacity': settings.opacity, 'stroke-opacity': settings.opacity, stroke: colors.lineColor, 'stroke-width': settings.stroke, 'stroke-dasharray': settings.dashStyle,
                    items: [],
                    polarAxisCoords: polarAxisCoords
                };

                for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {
                    var val = this._getDataValueAsNumber(i, dataField, groupIndex);
                    if (typeof (val) != 'number')
                        continue;

                    var x = renderData.xoffsets.data[i];
                    var y = renderData.offsets[sidx][i].to;
                    var xvalue = renderData.xoffsets.xvalues[i];

                    if (isNaN(x) || isNaN(y))
                        continue;

                    if (inverse) {
                        var tmp = x;
                        x = y;
                        y = tmp + rect.y;
                    }
                    else {
                        x += rect.x;
                    }

                    var r = radius;
                    if (isBubble) {
                        var rval = this._getDataValueAsNumber(i, s.radiusDataField, groupIndex);
                        if (typeof (rval) != 'number')
                            continue;
                        r = minRadius + (maxRadius - minRadius) * (rval - min) / Math.max(1, max - min);
                        if (isNaN(r))
                            r = minRadius;
                    }

                    var yOld = NaN, xOld = NaN;
                    var rOld = 0;
                    if (xvalue != undefined && this._elementRenderInfo && this._elementRenderInfo.length > groupIndex) {
                        var itemStartState = this._elementRenderInfo[groupIndex].series[sidx][xvalue];
                        if (itemStartState && !isNaN(itemStartState.to)) {
                            yOld = itemStartState.to;
                            xOld = itemStartState.xoffset;
                            rOld = radius;

                            if (inverse) {
                                var tmp = xOld;
                                xOld = yOld;
                                yOld = tmp + rect.y;
                            }
                            else {
                                xOld += rect.x;
                            }

                            if (isBubble) {
                                rOld = minRadius + (maxRadius - minRadius) * (itemStartState.valueRadius - min) / Math.max(1, max - min);
                                if (isNaN(rOld))
                                    rOld = minRadius;
                            }
                        }
                    }

                    ctx.items.push({
                        from: rOld,
                        to: r,
                        itemIndex: i,
                        x: x,
                        y: y,
                        xFrom: xOld,
                        yFrom: yOld
                    });
                } // i

                this._animR(ctx, 0);

                var self = this;
                var elem = undefined;
                this._enqueueAnimation("series", undefined, undefined, duration,
                        function (undefined, context, percent) {
                            self._animR(context, percent);
                        }, ctx);
            }
        },

        _animR: function (ctx, percent) {
            var items = ctx.items;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var x = item.x;
                var y = item.y;

                var r = Math.round((item.to - item.from) * percent + item.from);
                if (!isNaN(item.yFrom))
                    y = item.yFrom + (y - item.yFrom) * percent;
                if (!isNaN(item.xFrom))
                    x = item.xFrom + (x - item.xFrom) * percent;

                if (ctx.polarAxisCoords) {
                    var point = this._toPolarCoord(ctx.polarAxisCoords, this._plotRect, x, y)
                    x = point.x;
                    y = point.y;
                }

                x = $.jqx._ptrnd(x);
                y = $.jqx._ptrnd(y);
                r = $.jqx._ptrnd(r);

                var element = item.element;
                if (!element) {
                    element = this.renderer.circle(x, y, r);
                    this.renderer.attr(element, { fill: ctx.fill, 'fill-opacity': ctx['fill-opacity'], 'stroke-opacity': ctx['fill-opacity'], stroke: ctx.stroke, 'stroke-width': ctx['stroke-width'], 'stroke-dasharray': ctx['stroke-dasharray'] });
                    item.element = element;
                }

                if (this._isVML) {
                    this.renderer.updateCircle(element, undefined, undefined, r);
                }
                else {
                    this.renderer.attr(element, { r: r, cy: y, cx: x });
                }

                if (item.labelElement)
                    this.renderer.removeElement(item.labelElement);

                item.labelElement = this._showLabel(ctx.groupIndex, ctx.seriesIndex, item.itemIndex, { x: x - r, y: y - r, width: 2 * r, height: 2 * r });

                if (percent >= 1)
                    this._installHandlers(element, ctx.groupIndex, ctx.seriesIndex, item.itemIndex);

            }
        },

        //[optimize]
        _showToolTip: function (x, y, gidx, sidx, iidx) {
            var categoryAxis = this._getCategoryAxis(gidx);

            if (this._toolTipElement &&
                gidx == this._toolTipElement.gidx &&
                sidx == this._toolTipElement.sidx &&
                iidx == this._toolTipElement.iidx)
                return;

            var group = this.seriesGroups[gidx];
            var series = group.series[sidx];

            var enableCrosshairs = this.enableCrosshairs && !(group.polar || group.spider);

            if (this._pointMarker) {
                // make it relative to the marker instead of cursor
                x = parseInt(this._pointMarker.x + 5);
                y = parseInt(this._pointMarker.y - 5);
            }
            else {
                enableCrosshairs = false;
            }

            var isCrossHairsOnly = enableCrosshairs && this.showToolTips == false;


            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);

            var isNew = this._toolTipElement == undefined;

            if (group.showToolTips == false || series.showToolTips == false)
                return;

            var valfs = series.toolTipFormatSettings || group.toolTipFormatSettings;
            var valff = series.toolTipFormatFunction || group.toolTipFormatFunction || this.toolTipFormatFunction;

            var colors = this._getColors(gidx, sidx, iidx);

            var catvalue = this._getDataValue(iidx, categoryAxis.dataField, gidx);
            if (categoryAxis.dataField == undefined || categoryAxis.dataField == '')
                catvalue = iidx;
            if (categoryAxis.type == 'date')
                catvalue = this._castAsDate(catvalue);

            var text = '';

            if ($.isFunction(valff)) {
                var value = {};
                if (group.type.indexOf('range') == -1) {
                    value = this._getDataValue(iidx, series.dataField, gidx);
                }
                else {
                    value.from = this._getDataValue(iidx, series.dataFieldFrom, gidx);
                    value.to = this._getDataValue(iidx, series.dataFieldTo, gidx);
                }

                text = valff(value, iidx, series, group, catvalue, categoryAxis);
            }
            else {
                text = this._getFormattedValue(gidx, sidx, iidx, valfs, valff);

                var catfs = categoryAxis.toolTipFormatSettings || categoryAxis.formatSettings;
                var catff = categoryAxis.toolTipFormatFunction || categoryAxis.formatFunction;
                var categoryText = this._formatValue(catvalue, catfs, catff);

                if (group.type != 'pie' && group.type != 'donut')
                    text = (series.displayText || series.dataField || '') + ', ' + categoryText + ': ' + text;
                else {
                    catvalue = this._getDataValue(iidx, series.displayText || series.dataField, gidx);
                    categoryText = this._formatValue(catvalue, catfs, catff);
                    text = categoryText + ': ' + text;
                }
            }


            var cssToolTip = series.toolTipClass || group.toolTipClass || this.toThemeProperty('jqx-chart-tooltip-text', null);
            var toolTipFill = series.toolTipBackground || group.toolTipBackground || '#FFFFFF';
            var toolTipStroke = series.toolTipLineColor || group.toolTipLineColor || colors.lineColor;

            if (!this._toolTipElement) {
                this._toolTipElement = {};
            }
            this._toolTipElement.sidx = sidx;
            this._toolTipElement.gidx = gidx;
            this._toolTipElement.iidx = iidx;

            rect = this.renderer.getRect();

            if (enableCrosshairs) {
                var _x = $.jqx._ptrnd(this._pointMarker.x);
                var _y = $.jqx._ptrnd(this._pointMarker.y);
                if (this._toolTipElement.vLine && this._toolTipElement.hLine) {
                    this.renderer.attr(this._toolTipElement.vLine, { x1: _x, x2: _x });
                    this.renderer.attr(this._toolTipElement.hLine, { y1: _y, y2: _y });
                }
                else {
                    var color = this.crosshairsColor || '#888888';
                    this._toolTipElement.vLine = this.renderer.line(_x, this._plotRect.y, _x, this._plotRect.y + this._plotRect.height, { stroke: color, 'stroke-width': this.crosshairsLineWidth || 1.0, 'stroke-dasharray': this.crosshairsDashStyle || '' });
                    this._toolTipElement.hLine = this.renderer.line(this._plotRect.x, _y, this._plotRect.x + this._plotRect.width, _y, { stroke: color, 'stroke-width': this.crosshairsLineWidth || 1.0, 'stroke-dasharray': this.crosshairsDashStyle || '' });
                }
            }

            if (!isCrossHairsOnly && this.showToolTips != false) {
                var div = !isNew ? this._toolTipElement.box : document.createElement("div");
                var offset = { left: 0, top: 0 }; // $.jqx.utilities.getOffset(this.host);
                if (isNew) {
                    div.style.position = 'absolute';
                    div.style.cursor = 'default';
                    div.style.overflow = 'hidden';
                    $(div).addClass('jqx-rc-all jqx-button');
                    $(document.body).append(div);
                    var self = this;
                }
                div.style.backgroundColor = toolTipFill;
                div.style.borderColor = toolTipStroke;

                this._toolTipElement.box = div;
                this._toolTipElement.txt = text;

                var html = "<span class='" + cssToolTip + "'>" + text + "</span>";

                var measureDiv = this._toolTipElement.tmp;
                if (isNew) {
                    this._toolTipElement.tmp = measureDiv = document.createElement("div");
                    measureDiv.style.position = 'absolute';
                    measureDiv.style.cursor = 'default';
                    measureDiv.style.overflow = 'hidden';
                    measureDiv.style.display = 'none';
                    measureDiv.style.zIndex = 999999;
                    measureDiv.style.backgroundColor = toolTipFill;
                    measureDiv.style.borderColor = toolTipStroke;
                    $(measureDiv).addClass('jqx-rc-all jqx-button');
                    this.host.append(measureDiv);
                }
                $(measureDiv).html(html);

                var sz = { width: $(measureDiv).width(), height: $(measureDiv).height() };
                sz.width = sz.width + 5;
                sz.height = sz.height + 6;

                x = Math.max(x, rect.x);
                y = Math.max(y - sz.height, rect.y);

                if (sz.width > rect.width || sz.height > rect.height)
                    return;

                if (x + offset.left + sz.width > rect.x + rect.width - 5) {
                    x = rect.x + rect.width - sz.width - offset.left - 5;
                    div.style.left = offset.left + x + 'px';
                }

                if (y + offset.top + sz.height > rect.y + rect.height - 5) {
                    y = rect.y + rect.height - sz.height - 5;
                    div.style.top = offset.top + y + 'px';
                }

                var hostPosition = this.host.coord();
                if (isNew) {
                    $(div).fadeOut(0, 0);
                    div.style.left = offset.left + x + hostPosition.left + 'px';
                    div.style.top = offset.top + y + hostPosition.top + 'px';
                }

                $(div).html(html);
                $(div).clearQueue();
                $(div).animate({ left: offset.left + x + hostPosition.left, top: offset.top + y + hostPosition.top, opacity: 1 }, 300, 'easeInOutCirc');
                $(div).fadeTo(400, 1);
            }
        },

        //[optimize]
        _hideToolTip: function (delay) {
            if (!this._toolTipElement)
                return;

            if (this._toolTipElement.box) {
                if (delay == 0)
                    $(this._toolTipElement.box).hide();
                else
                    $(this._toolTipElement.box).fadeOut();
            }

            this._hideCrosshairs();

            this._toolTipElement.gidx = undefined;

        },

        _hideCrosshairs: function () {
            if (!this._toolTipElement)
                return;

            if (this._toolTipElement.vLine) {
                this.renderer.removeElement(this._toolTipElement.vLine);
                this._toolTipElement.vLine = undefined;
            }

            if (this._toolTipElement.hLine) {
                this.renderer.removeElement(this._toolTipElement.hLine);
                this._toolTipElement.hLine = undefined;
            }
        },

        //[optimize]
        _showLabel: function (gidx, sidx, iidx, rect, halign, valign, isMeasure) {
            var group = this.seriesGroups[gidx];
            var series = group.series[sidx];
            var sz = { width: 0, height: 0 };
            if (series.showLabels == false || (!series.showLabels && !group.showLabels))
                return isMeasure ? sz : undefined;

            if (rect.width < 0 || rect.height < 0)
                return isMeasure ? sz : undefined;

            var labelsAngle = series.labelAngle || series.labelsAngle || group.labelAngle || group.labelsAngle || 0;
            var labelOffset = series.labelOffset || group.labelOffset || { x: 0, y: 0 };
            var labelCSS = series.labelClass || group.labelClass || this.toThemeProperty('jqx-chart-label-text', null);

            halign = halign || 'center';
            valign = valign || 'center';
            var text = this._getFormattedValue(gidx, sidx, iidx);
            var w = rect.width;
            var h = rect.height;

            sz = this.renderer.measureText(text, labelsAngle, { 'class': labelCSS });
            if (isMeasure)
                return sz;

            var x = 0;
            if (halign == '' || halign == 'center')
                x += (w - sz.width) / 2;
            else if (halign == 'right')
                x += (w - sz.width);

            var y = 0;
            if (valign == '' || valign == 'center')
                y += (h - sz.height) / 2;
            else if (valign == 'bottom')
                y += (h - sz.height);

            //if (w < sz.width || h < sz.height)
            //  return undefined;

            var elemLabel = this.renderer.text(text, x + rect.x + labelOffset.x, y + rect.y + labelOffset.y, sz.width, sz.height, labelsAngle, {}, false, 'center', 'center');
            this.renderer.attr(elemLabel, { 'class': labelCSS });
            if (this._isVML) {
                this.renderer.removeElement(elemLabel);
                this.renderer.getContainer()[0].appendChild(elemLabel);
            }

            return elemLabel;
        },

        _getAnimProps: function (gidx, sidx) {
            var g = this.seriesGroups[gidx];
            var s = !isNaN(sidx) ? g.series[sidx] : undefined;

            var enabled = this.enableAnimations == true;

            if (g.enableAnimations)
                enabled = g.enableAnimations == true;

            if (s && s.enableAnimations)
                enabled = s.enableAnimations == true;

            var duration = this.animationDuration;
            if (isNaN(duration))
                duration = 1000;

            var gd = g.animationDuration;
            if (!isNaN(gd))
                duration = gd;

            if (s) {
                var sd = s.animationDuration;
                if (!isNaN(sd))
                    duration = sd;
            }

            if (duration > 5000)
                duration = 1000;

            return { enabled: enabled, duration: duration };
        },

        //[optimize]
        _renderLineSeries: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var isArea = group.type.indexOf('area') != -1;
            var isStacked = group.type.indexOf('stacked') != -1;
            var isStacked100 = isStacked && group.type.indexOf('100') != -1;
            var isSpline = group.type.indexOf('spline') != -1;
            var isStep = group.type.indexOf('step') != -1;
            var isRange = group.type.indexOf('range') != -1;
            var isPolar = group.polar == true || group.spider == true;
            if (isPolar)
                isStep = false;

            if (isStep && isSpline)
                return;

            var dataLength = this._getDataLen(groupIndex);
            var wPerItem = rect.width / dataLength;

            var swapXY = group.orientation == 'horizontal';
            var flipCategory = this._getCategoryAxis(groupIndex).flip == true;

            var gRect = rect;
            if (swapXY)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);

            if (!renderData || renderData.xoffsets.length == 0)
                return;

            for (var s = group.series.length - 1; s >= 0; s--) {
                var isVisible = this._isSerieVisible(groupIndex, s);
                if (!isVisible)
                    continue;

                var settings = this._getSerieSettings(groupIndex, s);
                var curr = renderData.xoffsets.first;
                var last = curr;

                do {
                    var points = [];
                    var rangeBasePoints = [];
                    var pointsStart = [];

                    var prev = -1;
                    var px = 0;
                    var xPrev = NaN;
                    var yPrev = NaN;
                    var pyStart = NaN;

                    if (renderData.xoffsets.length < 1)
                        continue;

                    var anim = this._getAnimProps(groupIndex, s);
                    var duration = anim.enabled && !this._isToggleRefresh && renderData.xoffsets.length < 10000 && this._isVML != true ? anim.duration : 0;
                    var first = curr;
                    var continueOnCurr = false;
                    for (var i = curr; i <= renderData.xoffsets.last; i++) {
                        curr = i;
                        var x = renderData.xoffsets.data[i];
                        var xvalue = renderData.xoffsets.xvalues[i];

                        if (x == undefined)
                            continue;

                        x = Math.max(x, 1);
                        px = x;

                        var py = renderData.offsets[s][i].to;
                        var pyFrom = renderData.offsets[s][i].from;
                        if (isNaN(py) || isNaN(pyFrom)) {
                            curr++;
                            continueOnCurr = true;
                            break;
                        }

                        var itemStartState = undefined;
                        if (this._elementRenderInfo &&
                            this._elementRenderInfo.length > groupIndex &&
                            this._elementRenderInfo[groupIndex].series.length > s
                            ) {
                            itemStartState = this._elementRenderInfo[groupIndex].series[s][xvalue];
                            var pyStart = $.jqx._ptrnd(itemStartState ? itemStartState.to : undefined);
                            var pxStart = $.jqx._ptrnd(gRect.x + (itemStartState ? itemStartState.xoffset : undefined));

                            pointsStart.push(swapXY ? { y: pxStart, x: pyStart, index: i} : { x: pxStart, y: pyStart, index: i });
                        }

                        last = i;

                        if (!isArea && isStacked100) {
                            if (py <= gRect.y)
                                py = gRect.y + 1;
                            if (py >= gRect.y + gRect.height)
                                py = gRect.y + gRect.height - 1;

                            if (pyFrom <= gRect.y)
                                pyFrom = gRect.y + 1;
                            if (pyFrom >= gRect.y + gRect.height)
                                pyFrom = gRect.y + gRect.height - 1;
                        }
                        // TODO: validate condition
                        x = Math.max(x, 1);
                        px = x + gRect.x;

                        if (isStep && !isNaN(xPrev) && !isNaN(yPrev)) {
                            if (yPrev != py) {
                                points.push(swapXY ? { y: px, x: $.jqx._ptrnd(yPrev)} : { x: px, y: $.jqx._ptrnd(yPrev) });
                            }
                        }

                        points.push(swapXY ? { y: px, x: $.jqx._ptrnd(py), index: i} : { x: px, y: $.jqx._ptrnd(py), index: i });
                        rangeBasePoints.push(swapXY ? { y: px, x: $.jqx._ptrnd(pyFrom), index: i} : { x: px, y: $.jqx._ptrnd(pyFrom), index: i });

                        xPrev = px;
                        yPrev = py;
                        if (isNaN(pyStart))
                            pyStart = py;

                    }

                    var left = gRect.x + renderData.xoffsets.data[first];
                    var right = gRect.x + renderData.xoffsets.data[last];

                    if (isArea && group.alignEndPointsWithIntervals == true) {
                        var sign = flipCategory ? -1 : 1;
                        if (left > gRect.x) {
                            left = gRect.x;
                        }
                        if (right < gRect.x + gRect.width)
                            right = gRect.x + gRect.width;

                        if (flipCategory) {
                            var tmp = left;
                            left = right;
                            right = tmp;
                        }
                    }
                    right = $.jqx._ptrnd(right);
                    left = $.jqx._ptrnd(left);

                    var yBase = renderData.baseOffset;
                    pyStart = $.jqx._ptrnd(pyStart);

                    var pyEnd = $.jqx._ptrnd(py) || yBase;

                    if (isRange) {
                        points = points.concat(rangeBasePoints.reverse());
                    }

                    //var settings = this._getSerieSettings(groupIndex, s);
                    var ctx = { groupIndex: groupIndex, serieIndex: s, settings: settings, pointsArray: points, pointsStart: pointsStart, left: left, right: right, pyStart: pyStart, pyEnd: pyEnd, yBase: yBase, swapXY: swapXY, isArea: isArea, isSpline: isSpline, isRange: isRange, isPolar: isPolar, labelElements: [], symbolElements: [] };

                    this._animateLine(ctx, duration == 0 ? 1 : 0);

                    var self = this;
                    this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        duration,
                        function (element, ctx, percent) {
                            self._animateLine(ctx, percent);
                        },
                        ctx);
                }
                while (curr < renderData.xoffsets.length - 1 || continueOnCurr);
            } // for s
        },

        _animateLine: function (ctx, percent) {
            var cmd = this._calculateLine(ctx, ctx.pointsArray, ctx.pointsStart, ctx.yBase, percent, ctx.isArea, ctx.swapXY);
            if (cmd == '')
                return;
            var split = cmd.split(' ');
            var cnt = split.length;

            var lineCmd = cmd;
            if (lineCmd != '')
                lineCmd = this._buildLineCmd(cmd, ctx.isRange, ctx.left, ctx.right, ctx.pyStart, ctx.pyEnd, ctx.yBase, ctx.isArea, ctx.isPolar, ctx.isSpline, ctx.swapXY);
            else
                lineCmd = 'M 0 0';

            var settings = ctx.settings;

            if (!ctx.pathElement) {
                ctx.pathElement = this.renderer.path(
                                    lineCmd,
                                    {
                                        'stroke-width': settings.stroke,
                                        'stroke': settings.colors.lineColor,
                                        'stroke-opacity': settings.opacity,
                                        'fill-opacity': settings.opacity,
                                        'stroke-dasharray': settings.dashStyle,
                                        fill: ctx.isArea ? settings.colors.fillColor : 'none'
                                    });

                this._installHandlers(ctx.pathElement, ctx.groupIndex, ctx.serieIndex);
            }
            else {
                this.renderer.attr(ctx.pathElement, { 'd': lineCmd });
            }

            if (ctx.labelElements) {
                for (var i = 0; i < ctx.labelElements.length; i++)
                    this.renderer.removeElement(ctx.labelElements[i]);
            }

            if (ctx.symbolElements) {
                for (var i = 0; i < ctx.symbolElements.length; i++)
                    this.renderer.removeElement(ctx.symbolElements[i]);
            }

            var symbol = this._getSymbol(ctx.groupIndex, ctx.serieIndex);

            if (ctx.pointsArray.length == split.length) {
                var serie = this.seriesGroups[ctx.groupIndex].series[ctx.serieIndex];
                if (symbol != 'none') {
                    var arr = ctx.symbolElements;

                    var symbolSize = serie.symbolSize;
                    for (var i = 0; i < split.length; i++) {
                        var point = split[i].split(',');
                        point = { x: parseFloat(point[0]), y: parseFloat(point[1]) };

                        var symbolElement = this._drawSymbol(symbol, point.x, point.y, settings.colors.fillColorSymbol, settings.colors.lineColorSymbol, 1, settings.opacity, symbolSize);

                        var pointPrev = (i > 0 ? split[i - 1] : split[i]).split(',');
                        pointPrev = { x: parseFloat(pointPrev[0]), y: parseFloat(pointPrev[1]) };

                        var pointNext = (i < split.length - 1 ? split[i + 1] : split[i]).split(',');
                        pointNext = { x: parseFloat(pointNext[0]), y: parseFloat(pointNext[1]) };

                        point = this._adjustLineLabelPosition(ctx.groupIndex, ctx.serieIndex, ctx.pointsArray[i].index, point, pointPrev, pointNext);

                        var labelElement = this._showLabel(ctx.groupIndex, ctx.serieIndex, ctx.pointsArray[i].index, { x: point.x, y: point.y, width: 0, height: 0 });

                        ctx.symbolElements.push(symbolElement);
                        ctx.labelElements.push(labelElement);
                    }
                }
            }


            if (percent == 1 && symbol != 'none') {
                for (var i = 0; i < ctx.symbolElements.length; i++) {
                    this._installHandlers(ctx.symbolElements[i], ctx.groupIndex, ctx.serieIndex);
                }
            }
        },

        _adjustLineLabelPosition: function (gidx, sidx, iidx, pt, ptPrev, ptNext) {
            var labelSize = this._showLabel(gidx, sidx, iidx, { width: 0, height: 0 }, '', '', true);

            var ptAdj = { x: 0, y: 0 };

            if (pt.y == ptPrev.y && pt.x == ptPrev.x) {
                if (ptNext.y < pt.y)
                    ptAdj = { x: pt.x, y: pt.y + labelSize.height };
                else
                    ptAdj = { x: pt.x, y: pt.y - labelSize.height };
            }
            else if (pt.y == ptNext.y && pt.x == ptNext.x) {
                if (ptPrev.y < pt.y)
                    ptAdj = { x: pt.x, y: pt.y + labelSize.height };
                else
                    ptAdj = { x: pt.x, y: pt.y - labelSize.height };
            }


            if (pt.y > ptPrev.y && pt.y > ptNext.y)
                ptAdj = { x: pt.x, y: pt.y + labelSize.height };
            else
                ptAdj = { x: pt.x, y: pt.y - labelSize.height };


            return ptAdj;
        },

        _calculateLine: function (ctx, pointsArray, pointsStartArray, yBase, percent, isArea, swapXY) {
            var g = this.seriesGroups[ctx.groupIndex];

            var polarAxisCoords = undefined;
            if (g.polar == true || g.spider == true)
                polarAxisCoords = this._getPolarAxisCoords(ctx.groupIndex, this._plotRect);

            var cmd = '';
            var cnt = pointsArray.length;
            if (!isArea && pointsStartArray.length == 0)
                cnt = Math.round(cnt * percent);

            var baseXSave = NaN;
            for (var i = 0; i < cnt + 1 && i < pointsArray.length; i++) {
                if (i > 0)
                    cmd += ' ';
                var y = pointsArray[i].y;
                var x = pointsArray[i].x;
                var baseY = !isArea ? y : yBase;
                var baseX = x;
                if (pointsStartArray && pointsStartArray.length > i) {
                    baseY = pointsStartArray[i].y;
                    baseX = pointsStartArray[i].x;
                    if (isNaN(baseY) || isNaN(baseX)) {
                        baseY = y;
                        baseX = x;
                    }
                }

                /*
                if (isNaN(baseX) && baseXSave == x && i > 1)
                baseX = baseXSave - (x - baseXSave);
                */
                baseXSave = baseX;

                if (cnt <= pointsArray.length && i > 0 && i == cnt) {
                    baseX = pointsArray[i - 1].x;
                    baseY = pointsArray[i - 1].y;
                }

                /*if (isArea)*/
                {
                    if (swapXY) {
                        x = $.jqx._ptrnd((x - baseX) * percent + baseX);
                        y = $.jqx._ptrnd((y - baseY) * percent + baseY);
                    }
                    else {
                        x = $.jqx._ptrnd((x - baseX) * percent + baseX);
                        y = $.jqx._ptrnd((y - baseY) * percent + baseY);
                    }
                }

                if (polarAxisCoords) {
                    var point = this._toPolarCoord(polarAxisCoords, this._plotRect, x, y)
                    x = point.x;
                    y = point.y;
                }

                cmd += x + ',' + y;

                if (pointsArray.length == 1 && !isArea)
                    cmd += ' ' + (x + 2) + ',' + (y + 2);
            }

            return cmd;
        },

        _buildLineCmd: function (pointsArray, isRange, left, right, pyStart, pyEnd, yBase, isArea, isPolar, isSpline, swapXY) {
            var cmd = pointsArray;

            if (isArea && !isPolar && !isRange) {
                var ptBottomLeft = swapXY ? yBase + ',' + left : left + ',' + yBase
                var ptBottomRight = swapXY ? yBase + ',' + right : right + ',' + yBase;

                //if (pointsArray.split(' ').length <= 2)
                //    isSpline = false;

                cmd = ptBottomLeft + ' ' + pointsArray + ' ' + ptBottomRight;
            }

            if (isSpline)
                cmd = this._getBezierPoints(cmd);

            var split = cmd.split(' ');
            var firstPoint = split[0].replace('C', '');

            if (isArea && !isPolar) {
                if (!isRange) {
                    cmd = 'M ' + ptBottomLeft + ' L ' + firstPoint + ' ' + cmd + ' Z';
                }
                else {
                    cmd = 'M ' + firstPoint + ' L ' + firstPoint
                        + (isSpline ? '' : (' L ' + firstPoint + ' '))
                        + cmd
                        + ' Z';
                }
            }
            else {
                if (isSpline)
                    cmd = 'M ' + firstPoint + ' ' + cmd;
                else
                    cmd = 'M ' + firstPoint + ' ' + 'L ' + firstPoint + ' ' + cmd;
            }

            if (isPolar && isArea)
                cmd += ' Z';

            return cmd;
        },

        //[optimize]
        _getSerieSettings: function (groupIndex, seriesIndex) {
            var group = this.seriesGroups[groupIndex];
            var isArea = group.type.indexOf('area') != -1;
            var isLine = group.type.indexOf('line') != -1;

            var colors = this._getColors(groupIndex, seriesIndex, undefined, this._getGroupGradientType(groupIndex));
            var serie = group.series[seriesIndex]

            var dashStyle = serie.dashStyle || group.dashStyle || '';

            var opacity = serie.opacity || group.opacity;
            if (isNaN(opacity) || opacity < 0 || opacity > 1)
                opacity = 1;

            var stroke = serie.lineWidth;
            if (isNaN(stroke) && stroke != 'auto')
                stroke = group.lineWidth;

            if (stroke == 'auto' || isNaN(stroke) || stroke < 0 || stroke > 15) {
                if (isArea)
                    stroke = 2;
                else if (isLine)
                    stroke = 3;
                else
                    stroke = 1;
            }

            return { colors: colors, stroke: stroke, opacity: opacity, dashStyle: dashStyle };
        },

        getItemColor: function (group, serie, itemIndex) {
            var gidx = -1;
            for (var i = 0; i < this.seriesGroups.length; i++)
                if (this.seriesGroups[i] == group) {
                    gidx = i;
                    break;
                }
            if (gidx == -1)
                return '#000000';
            var sidx = -1;
            for (var i = 0; i < this.seriesGroups[gidx].series.length; i++)
                if (this.seriesGroups[gidx].series[i] == serie) {
                    sidx = i;
                    break;
                }
            if (sidx == -1)
                return '#000000';

            return this._getColors(gidx, sidx, itemIndex);
        },

        //[optimize]
        _getColors: function (gidx, sidx, iidx, gradientType) {
            var group = this.seriesGroups[gidx];
            if (group.type != 'pie' && group.type != 'donut')
                iidx = undefined;

            var useGradient = group.series[sidx].useGradient || group.useGradient;
            if (useGradient == undefined)
                useGradient = true;

            var colors = {};
            if (isNaN(iidx)) {
                colors = this._getSeriesColors(gidx, sidx);
            }
            else {
                var dataLength = this._getDataLen(gidx);
                color = this._getColor(group.series[sidx].colorScheme || group.colorScheme || this.colorScheme, sidx * dataLength + iidx, gidx, sidx);
                colors.fillColor = color;
                colors.fillColorSelected = $.jqx._adjustColor(color, 1.1);
                colors.lineColor = colors.symbolColor = $.jqx._adjustColor(color, 0.9);
                colors.lineColorSelected = colors.symbolColorSelected = $.jqx._adjustColor(color, 0.9);
            }

            var stops2 = [[0, 1.5], [100, 1]];
            var stops4 = [[0, 1], [25, 1.1], [50, 1.5], [100, 1]];
            var stopsR = [[0, 1.3], [90, 1.2], [100, 1.0]];

            if (useGradient) {
                if (gradientType == 'verticalLinearGradient') {
                    colors.fillColor = this.renderer._toLinearGradient(colors.fillColor, true, stops2);
                    colors.fillColorSelected = this.renderer._toLinearGradient(colors.fillColorSelected, true, stops2);
                }
                else if (gradientType == 'horizontalLinearGradient') {
                    colors.fillColor = this.renderer._toLinearGradient(colors.fillColor, false, stops4);
                    colors.fillColorSelected = this.renderer._toLinearGradient(colors.fillColorSelected, false, stops4);
                }
                else if (gradientType == 'radialGradient') {
                    var params = undefined;
                    var stops = stops2;
                    if ((group.type == 'pie' || group.type == 'donut' || group.polar) && iidx != undefined && this._renderData[gidx] && this._renderData[gidx].offsets[sidx]) {
                        params = this._renderData[gidx].offsets[sidx][iidx];
                        stops = stopsR;
                    }

                    colors.fillColor = this.renderer._toRadialGradient(colors.fillColor, stops, params);
                    colors.fillColorSelected = this.renderer._toRadialGradient(colors.fillColorSelected, stops, params);
                }
            }

            return colors;
        },

        //[optimize]
        _installHandlers: function (element, gidx, sidx, iidx) {
            var self = this;
            var g = this.seriesGroups[gidx];
            var s = this.seriesGroups[gidx].series[sidx];

            var isLineType = g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1;

            if (!isLineType) {
                this.renderer.addHandler(element, 'mousemove', function (e) {
                    e.preventDefault();

                    var x = e.pageX || e.clientX || e.screenX;
                    var y = e.pageY || e.clientY || e.screenY;

                    var pos = self.host.offset();
                    x -= pos.left;
                    y -= pos.top;

                    if (self._mouseX == x && self._mouseY == y)
                        return;

                    if (self._toolTipElement) {
                        if (self._toolTipElement.gidx == gidx &&
                        self._toolTipElement.sidx == sidx &&
                        self._toolTipElement.iidx == iidx)
                            return;
                    }

                    self._startTooltipTimer(gidx, sidx, iidx);
                });
            }

            this.renderer.addHandler(element, 'mouseover', function (e) {
                e.preventDefault();
                self._select(element, gidx, sidx, iidx);
                // bypass for line and area series
                if (isLineType)
                    return;

                if (isNaN(iidx))
                    return;

                self._raiseItemEvent('mouseover', g, s, iidx);
            });

            this.renderer.addHandler(element, 'mouseout', function (e) {
                e.preventDefault();

                if (iidx != undefined)
                    self._cancelTooltipTimer();

                // bypass for line and area series
                if (isLineType)
                    return;

                self._unselect();

                if (isNaN(iidx))
                    return;

                self._raiseItemEvent('mouseout', g, s, iidx);
            });

            this.renderer.addHandler(element, 'click', function (e) {
                e.preventDefault();

                // bypass for line and area series
                if (isLineType)
                    return;

                if (g.type.indexOf('column') != -1)
                    self._unselect();

                if (isNaN(iidx))
                    return;

                self._raiseItemEvent('click', g, s, iidx);
            });

        },

        //[optimize]
        _getHorizontalOffset: function (gidx, sidx, x, y) {
            var rect = this._plotRect;
            var dataLength = this._getDataLen(gidx);
            if (dataLength == 0)
                return { index: undefined, value: x };

            var renderData = this._calcGroupOffsets(gidx, this._plotRect);
            if (renderData.xoffsets.length == 0)
                return { index: undefined, value: undefined };

            var px = x;
            var py = y;

            var g = this.seriesGroups[gidx];

            var polarAxisCoords;
            if (g.polar || g.spider)
                polarAxisCoords = this._getPolarAxisCoords(gidx, rect);

            if (g.orientation == 'horizontal' && !polarAxisCoords) {
                var tmp = px;
                px = py;
                py = tmp;
            }

            var inverse = this._getCategoryAxis(gidx).flip == true;

            var minDist, idx, x1Selected, y1Selected;

            for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {
                var x1 = renderData.xoffsets.data[i];
                var y1 = renderData.offsets[sidx][i].to;

                var dist = 0;

                if (polarAxisCoords) {
                    var point = this._toPolarCoord(polarAxisCoords, rect, x1 + rect.x, y1)
                    x1 = point.x;
                    y1 = point.y;
                    dist = $.jqx._ptdist(px, py, x1, y1);
                }
                else {
                    x1 += rect.x;
                    y1 += rect.y;
                    dist = Math.abs(px - x1);
                }

                if (isNaN(minDist) || minDist > dist) {
                    minDist = dist;
                    idx = i;
                    x1Selected = x1;
                    y1Selected = y1;

                }
            }

            return { index: idx, value: renderData.xoffsets.data[idx], polarAxisCoords: polarAxisCoords, x: x1Selected, y: y1Selected };
        },

        //[optimize]
        onmousemove: function (x, y) {
            if (this._mouseX == x && this._mouseY == y)
                return;

            this._mouseX = x;
            this._mouseY = y;

            if (!this._selected)
                return;

            var rect = this._plotRect;

            var rBounds = this._paddedRect;
            if (x < rBounds.x || x > rBounds.x + rBounds.width ||
                y < rBounds.y || y > rBounds.y + rBounds.height) {
                this._unselect();
                return;
            }

            var gidx = this._selected.group;
            var g = this.seriesGroups[gidx];
            var s = g.series[this._selected.series];

            var inverse = g.orientation == 'horizontal';

            var rect = this._plotRect;
            if (g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1) {
                var offset = this._getHorizontalOffset(gidx, this._selected.series, x, y);
                var i = offset.index;
                if (i == undefined)
                    return;

                if (this._selected.item != i) {
                    if (this._selected.item)
                        this._raiseItemEvent('mouseout', g, s, this._selected.item);

                    this._selected.item = i;
                    this._raiseItemEvent('mouseover', g, s, i);
                }

                var symbolType = this._getSymbol(this._selected.group, this._selected.series);
                if (symbolType == 'none')
                    symbolType = 'circle';

                var renderData = this._calcGroupOffsets(gidx, rect);
                var to = renderData.offsets[this._selected.series][i].to;

                var from = to;
                if (g.type.indexOf('range') != -1) {
                    from = renderData.offsets[this._selected.series][i].from;
                }

                var cmp = inverse ? x : y;
                if (!isNaN(from) && Math.abs(cmp - from) < Math.abs(cmp - to))
                    y = from;
                else
                    y = to;

                if (isNaN(y))
                    return;

                x = offset.value;

                if (inverse) {
                    var tmp = x;
                    x = y;
                    y = tmp + rect.y;
                }
                else {
                    x += rect.x;
                }

                if (offset.polarAxisCoords) {
                    x = offset.x;
                    y = offset.y;
                }

                y = $.jqx._ptrnd(y);
                x = $.jqx._ptrnd(x);

                if (this._pointMarker && this._pointMarker.element) {
                    this.renderer.removeElement(this._pointMarker.element);
                    this._pointMarker.element = undefined;
                }

                if (isNaN(x) || isNaN(y)) {
                    return;
                }

                var colors = this._getSeriesColors(this._selected.group, this._selected.series);

                var opacity = s.opacity;
                if (isNaN(opacity) || opacity < 0 || opacity > 1.0)
                    opacity = g.opacity;
                if (isNaN(opacity) || opacity < 0 || opacity > 1.0)
                    opacity = 1.0;

                var symbolSize = s.symbolSizeSelected;
                if (isNaN(symbolSize))
                    symbolSize = s.symbolSize;
                if (isNaN(symbolSize) || symbolSize > 10 || symbolSize < 0)
                    symbolSize = g.symbolSize;
                if (isNaN(symbolSize) || symbolSize > 10 || symbolSize < 0)
                    symbolSize = 6;

                this._pointMarker = { type: symbolType, x: x, y: y, gidx: gidx, sidx: this._selected.series, iidx: i };
                this._pointMarker.element = this._drawSymbol(symbolType, x, y, colors.fillColorSymbolSelected, colors.lineColorSymbolSelected, 1, opacity, symbolSize);

                this._startTooltipTimer(gidx, this._selected.series, i);
            }
        },

        //[optimize]
        _drawSymbol: function (type, x, y, fill, stroke, lineWidth, opacity, size) {
            var element;
            var sz = size || 6;
            var sz2 = sz / 2;
            switch (type) {
                case 'none':
                    return undefined;
                case 'circle':
                    element = this.renderer.circle(x, y, sz / 2);
                    break;
                case 'square':
                    sz = sz - 1; sz2 = sz / 2;
                    element = this.renderer.rect(x - sz2, y - sz2, sz, sz);
                    break;
                case 'diamond':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y)
                            + ' L' + (x) + ',' + (y - sz2)
                            + ' L' + (x + sz2) + ',' + (y)
                            + ' L' + (x) + ',' + (y + sz2)
                            + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_up':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y + sz2)
                            + ' L ' + (x + sz2) + ',' + (y + sz2)
                            + ' L ' + (x) + ',' + (y - sz2)
                            + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_down':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y - sz2)
                            + ' L ' + (x) + ',' + (y + sz2)
                            + ' L ' + (x + sz2) + ',' + (y - sz2)
                            + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_left':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y)
                            + ' L ' + (x + sz2) + ',' + (y + sz2)
                            + ' L ' + (x + sz2) + ',' + (y - sz2)
                            + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_right':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y - sz2)
                            + ' L ' + (x - sz2) + ',' + (y + sz2)
                            + ' L ' + (x + sz2) + ',' + (y)
                            + ' Z';
                        element = this.renderer.path(path);
                    } break;
                default:
                    element = this.renderer.circle(x, y, sz);
            }

            this.renderer.attr(element, { fill: fill, stroke: stroke, 'stroke-width': lineWidth, 'stroke-opacity': opacity, 'fill-opacity': opacity });
            return element;
        },

        //[optimize]
        _getSymbol: function (groupIndex, seriesIndex) {
            var symbols = ['circle', 'square', 'diamond', 'triangle_up', 'triangle_down', 'triangle_left', 'triangle_right'];
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];
            var symbolType = undefined;
            if (s.symbolType != undefined)
                symbolType = s.symbolType;
            if (symbolType == undefined)
                symbolType = g.symbolType;

            if (symbolType == 'default')
                return symbols[seriesIndex % symbols.length];
            else if (symbolType != undefined)
                return symbolType;

            return 'none';
        },

        //[optimize]
        _startTooltipTimer: function (gidx, sidx, iidx) {
            this._cancelTooltipTimer();
            var self = this;
            var g = self.seriesGroups[gidx];
            var delay = this.toolTipShowDelay || this.toolTipDelay;
            if (isNaN(delay) || delay > 10000 || delay < 0)
                delay = 500;
            if (this._toolTipElement || (true == this.enableCrosshairs && false == this.showToolTips))
                delay = 0;

            clearTimeout(this._tttimerHide);

            this._tttimer = setTimeout(function () {
                self._showToolTip(self._mouseX, self._mouseY - 3, gidx, sidx, iidx);

                var toolTipHideDelay = self.toolTipHideDelay;

                if (isNaN(toolTipHideDelay))
                    toolTipHideDelay = 4000;

                self._tttimerHide = setTimeout(function () {
                    self._hideToolTip();
                }, toolTipHideDelay);
            }, delay);
        },

        //[optimize]
        _cancelTooltipTimer: function () {
            clearTimeout(this._tttimer);
        },

        //[optimize]
        _getGroupGradientType: function (gidx) {
            var g = this.seriesGroups[gidx];

            if (g.type.indexOf('area') != -1)
                return g.orientation == 'horizontal' ? 'horizontalLinearGradient' : 'verticalLinearGradient';
            else if (g.type.indexOf('column') != -1) {
                if (g.polar)
                    return 'radialGradient';
                return g.orientation == 'horizontal' ? 'verticalLinearGradient' : 'horizontalLinearGradient';
            }
            else if (g.type.indexOf('scatter') != -1 || g.type.indexOf('bubble') != -1 || g.type.indexOf('pie') != -1 || g.type.indexOf('donut') != -1)
                return 'radialGradient';

            return undefined;
        },

        //[optimize]
        _select: function (element, gidx, sidx, iidx) {
            if (this._selected && this._selected.element != element) {
                this._unselect();
            }

            this._selected = { element: element, group: gidx, series: sidx, item: iidx };
            var g = this.seriesGroups[gidx];

            var colors = this._getColors(gidx, sidx, iidx, this._getGroupGradientType(gidx));
            if (g.type.indexOf('line') != -1 && g.type.indexOf('area') == -1)
                colors.fillColorSelected = 'none';

            var settings = this._getSerieSettings(gidx, sidx, iidx);

            this.renderer.attr(element, { 'stroke': colors.lineColorSelected, fill: colors.fillColorSelected, 'stroke-width': settings.stroke + 0 });
        },

        //[optimize]
        _unselect: function () {
            if (this._selected) {
                var gidx = this._selected.group;
                var sidx = this._selected.series;
                var iidx = this._selected.item;
                var g = this.seriesGroups[gidx];
                var s = g.series[sidx];

                var colors = this._getColors(gidx, sidx, iidx, this._getGroupGradientType(gidx));
                if (g.type.indexOf('line') != -1 && g.type.indexOf('area') == -1)
                    colors.fillColor = 'none';

                var settings = this._getSerieSettings(gidx, sidx, iidx);

                this.renderer.attr(this._selected.element, { 'stroke': colors.lineColor, fill: colors.fillColor, 'stroke-width': settings.stroke });

                if ((g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1) && !isNaN(iidx)) {
                    this._raiseItemEvent('mouseout', g, s, iidx);
                }

                this._selected = undefined;
            }

            if (this._pointMarker) {
                if (this._pointMarker.element) {
                    this.renderer.removeElement(this._pointMarker.element);
                    this._pointMarker.element = undefined;
                }
                this._pointMarker = undefined;
                this._hideCrosshairs();
            }
        },

        //[optimize]
        _raiseItemEvent: function (event, group, serie, index) {
            var fn = serie[event] || group[event];
            var gidx = 0;
            for (; gidx < this.seriesGroups.length; gidx++)
                if (this.seriesGroups[gidx] == group)
                    break;
            if (gidx == this.seriesGroups.length)
                return;

            var args = { event: event, seriesGroup: group, serie: serie, elementIndex: index, elementValue: this._getDataValue(index, serie.dataField, gidx) };
            if (fn && $.isFunction(fn))
                fn(args);

            this._raiseEvent(event, args);
        },

        _raiseEvent: function (name, args) {
            var event = new jQuery.Event(name);
            event.owner = this;
            event.args = args;

            var result = this.host.trigger(event);

            return result;
        },


        //[optimize]
        _calcInterval: function (min, max, countHint) {
            var diff = Math.abs(max - min);
            var approx = diff / countHint;

            var up = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100];
            var dw = [0.5, 0.25, 0.125, 0.1];

            var scale = 0.1;
            var arr = up;

            if (approx < 1) {
                arr = dw;
                scale = 10;
            }

            var idx = 0;

            do {
                idx = 0;
                if (approx >= 1)
                    scale *= 10;
                else
                    scale /= 10;

                for (var i = 1; i < arr.length; i++) {
                    if (Math.abs(arr[idx] * scale - approx) > Math.abs(arr[i] * scale - approx))
                        idx = i;
                    else
                        break;
                }
            }
            while (idx == arr.length - 1);

            return arr[idx] * scale;
        },

        ///[optimize]
        _renderDataDeepCopy: function () {
            if (!this._renderData || this._isToggleRefresh)
                return;

            var info = this._elementRenderInfo = [];

            for (var groupIndex = 0; groupIndex < this._renderData.length; groupIndex++) {
                var catField = this._getCategoryAxis(groupIndex).dataField;

                while (info.length <= groupIndex)
                    info.push({});

                var groupInfo = info[groupIndex];
                var data = this._renderData[groupIndex];
                if (!data.offsets)
                    continue;

                if (data.valueAxis) {
                    groupInfo.valueAxis = { itemOffsets: {} };
                    for (var key in data.valueAxis.itemOffsets) {
                        groupInfo.valueAxis.itemOffsets[key] = data.valueAxis.itemOffsets[key];
                    }
                }

                if (data.categoryAxis) {
                    groupInfo.categoryAxis = { itemOffsets: {} };
                    for (var key in data.categoryAxis.itemOffsets) {
                        groupInfo.categoryAxis.itemOffsets[key] = data.categoryAxis.itemOffsets[key];
                    }
                }

                groupInfo.series = [];
                var series = groupInfo.series;

                var serieType = this.seriesGroups[groupIndex].type;
                var isPieSeries = serieType.indexOf('pie') != -1 || serieType.indexOf('donut') != -1;

                for (var s = 0; s < data.offsets.length; s++) {
                    series.push({});
                    for (var i = 0; i < data.offsets[s].length; i++)
                        if (!isPieSeries) {
                            series[s][data.xoffsets.xvalues[i]] = { value: data.offsets[s][i].value, valueFrom: data.offsets[s][i].valueFrom, valueRadius: data.offsets[s][i].valueRadius, xoffset: data.xoffsets.data[i], from: data.offsets[s][i].from, to: data.offsets[s][i].to };
                        }
                        else {
                            var item = data.offsets[s][i];
                            series[s][item.displayValue] = { value: item.value, x: item.x, y: item.y, fromAngle: item.fromAngle, toAngle: item.toAngle };
                        }
                }
            }
        },

        //[optimize]
        _calcGroupOffsets: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];

            while (this._renderData.length < groupIndex + 1)
                this._renderData.push({});

            if (this._renderData[groupIndex] != null && this._renderData[groupIndex].offsets != undefined)
                return this._renderData[groupIndex];

            if (group.type.indexOf('pie') != -1 || group.type.indexOf('donut') != -1) {
                return this._calcPieSeriesGroupOffsets(groupIndex, rect);
            }

            if (!group.valueAxis || !group.series || group.series.length == 0)
                return this._renderData[groupIndex];

            var inverse = group.valueAxis.flip == true;
            var logAxis = group.valueAxis.logarithmicScale == true;
            var logBase = group.valueAxis.logarithmicScaleBase || 10;

            var out = new Array();

            var isStacked = group.type.indexOf("stacked") != -1;
            var isStacked100 = isStacked && group.type.indexOf("100") != -1;
            var isRange = group.type.indexOf("range") != -1;

            var dataLength = this._getDataLen(groupIndex);
            var gbase = group.baselineValue || group.valueAxis.baselineValue || 0;
            if (isRange)
                gbase = 0;

            var stat = this._stats.seriesGroups[groupIndex];
            if (!stat || !stat.isValid)
                return;

            if (gbase > stat.max)
                gbase = stat.max;
            if (gbase < stat.min)
                gbase = stat.min;

            var range = (isStacked100 || logAxis) ? stat.maxRange : stat.max - stat.min;

            var min = stat.min;
            var max = stat.max;

            var scale = rect.height / (logAxis ? stat.intervals : range);

            var yzero = 0;
            if (isStacked100) {
                if (min * max < 0) {
                    range /= 2;
                    yzero = -(range + gbase) * scale;
                }
                else {
                    yzero = -gbase * scale;
                }
            }
            else
                yzero = -(gbase - min) * scale;

            if (inverse)
                yzero = rect.y - yzero;
            else
                yzero += rect.y + rect.height;

            var yPOffset = new Array();
            var yNOffset = new Array();
            var yOffsetError = new Array();

            var pIntervals, nIntervals;
            if (logAxis) {
                pIntervals = $.jqx.log(max, logBase) - $.jqx.log(gbase, logBase);
                if (isStacked) // force base value @ min for stacked log series
                {
                    pIntervals = stat.intervals;
                    gbase = isStacked100 ? 0 : min;
                }

                nIntervals = stat.intervals - pIntervals;
                if (!inverse)
                    yzero = rect.y + pIntervals / stat.intervals * rect.height;
            }

            yzero = $.jqx._ptrnd(yzero);

            var th = (min * max < 0) ? rect.height / 2 : rect.height;

            var logSums = [];

            var bands = [];
            if (group.bands) {
                for (var j = 0; j < group.bands.length; j++) {
                    var from = group.bands[j].minValue;
                    var to = group.bands[j].maxValue;

                    var y1 = 0;
                    var y2 = 0;

                    if (logAxis) {
                        y1 = ($.jqx.log(from, logBase) - $.jqx.log(gbase, logBase)) * scale;
                        y2 = ($.jqx.log(to, logBase) - $.jqx.log(gbase, logBase)) * scale;
                    }
                    else {
                        y1 = (from - gbase) * scale;
                        y2 = (to - gbase) * scale;
                    }

                    if (this._isVML) {
                        y1 = Math.round(y1);
                        y2 = Math.round(y2);
                    }
                    else {
                        y1 = $.jqx._ptrnd(y1) - 1;
                        y2 = $.jqx._ptrnd(y2) - 1;
                    }

                    if (inverse)
                        bands.push({ from: yzero + y2, to: yzero + y1 });
                    else
                        bands.push({ from: yzero - y2, to: yzero - y1 });
                }
            }

            for (var j = 0; j < group.series.length; j++) {
                if (!isStacked && logAxis)
                    logSums = [];

                var dataField = group.series[j].dataField;
                var dataFieldFrom = group.series[j].dataFieldFrom;
                var dataFieldTo = group.series[j].dataFieldTo;
                var dataFieldRadius = group.series[j].radiusDataField;

                out.push(new Array());

                var isVisible = this._isSerieVisible(groupIndex, j);

                for (var i = 0; i < dataLength; i++) {
                    var valFrom = NaN;
                    if (isRange) {
                        valFrom = this._getDataValueAsNumber(i, dataFieldFrom, groupIndex);
                        if (isNaN(valFrom))
                            valFrom = gbase;
                    }

                    var val = NaN;
                    if (isRange)
                        val = this._getDataValueAsNumber(i, dataFieldTo, groupIndex);
                    else
                        val = this._getDataValueAsNumber(i, dataField, groupIndex);

                    var valR = this._getDataValueAsNumber(i, dataFieldRadius, groupIndex);

                    if (!isVisible)
                        val = NaN;

                    if (isNaN(val) || (logAxis && val <= 0)) {
                        out[j].push({ from: undefined, to: undefined });
                        continue;
                    }
                    /*
                    if (val > stat.rmax)
                    val = stat.rmax;
                    if (val < stat.rmin)
                    val = stat.rmin;*/

                    var yOffset = (val >= gbase) ? yPOffset : yNOffset;

                    var h = scale * (val - gbase);
                    if (isRange) {
                        h = scale * (val - valFrom);
                    }

                    if (logAxis) {
                        while (logSums.length <= i)
                            logSums.push({ p: { value: 0, height: 0 }, n: { value: 0, height: 0} });

                        var base = isRange ? valFrom : gbase;
                        var sums = val > base ? logSums[i].p : logSums[i].n;

                        sums.value += val;

                        if (isStacked100) {
                            val = sums.value / (stat.psums[i] + stat.nsums[i]) * 100;
                            h = ($.jqx.log(val, logBase) - stat.minPow) * scale;
                        }
                        else {
                            h = $.jqx.log(sums.value, logBase) - $.jqx.log(base, logBase);

                            h *= scale;
                        }

                        h -= sums.height;
                        sums.height += h;
                    }

                    var y = yzero;
                    if (isRange) {
                        var yDiff = 0;
                        if (logAxis)
                            yDiff = ($.jqx.log(valFrom, logBase) - $.jqx.log(gbase, logBase)) * scale;
                        else
                            yDiff = (valFrom - gbase) * scale;

                        y += inverse ? yDiff : -yDiff;
                    }

                    if (isStacked) {
                        if (isStacked100 && !logAxis) {
                            var irange = (stat.psums[i] - stat.nsums[i]);

                            if (val > gbase) {
                                h = (stat.psums[i] / irange) * th;
                                if (stat.psums[i] != 0)
                                    h *= val / stat.psums[i];
                            }
                            else {
                                h = (stat.nsums[i] / irange) * th;
                                if (stat.nsums[i] != 0)
                                    h *= val / stat.nsums[i];
                            }
                        }

                        if (isNaN(yOffset[i])) {
                            yOffset[i] = y;
                        }

                        y = yOffset[i];
                    }

                    if (isNaN(yOffsetError[i]))
                        yOffsetError[i] = 0;

                    var err = yOffsetError[i];

                    h = Math.abs(h);
                    var hSave = h;
                    h_new = this._isVML ? Math.round(h) : $.jqx._ptrnd(h) - 1;
                    if (Math.abs(h - h_new) > 0.5)
                        h = Math.round(h);
                    else
                        h = h_new;

                    err += h - hSave;

                    if (!isStacked)
                        err = 0;

                    if (Math.abs(err) > 0.5) {
                        if (err > 0) {
                            h -= 1;
                            err -= 1;
                        }
                        else {
                            h += 1;
                            err += 1;
                        }
                    }

                    yOffsetError[i] = err;

                    // adjust the height to make sure it span the entire height
                    // otherwise there will be a few pixels inaccuracy
                    if (j == group.series.length - 1 && isStacked100) {
                        var sumH = 0;
                        for (var k = 0; k < j; k++)
                            sumH += Math.abs(out[k][i].to - out[k][i].from);
                        sumH += h;
                        if (sumH < th) {
                            if (h > 0.5)
                                h = $.jqx._ptrnd(h + th - sumH);
                            else {
                                var k = j - 1;
                                while (k >= 0) {
                                    var diff = Math.abs(out[k][i].to - out[k][i].from);
                                    if (diff > 1) {
                                        if (out[k][i].from > out[k][i].to) {
                                            out[k][i].from += th - sumH;
                                        }
                                        break;
                                    }
                                    k--;
                                }
                            }
                        }
                    }

                    if (inverse)
                        h *= -1;

                    var drawOpositeDirection = val < gbase;
                    if (isRange)
                        drawOpositeDirection = valFrom > val;

                    var outVal = isNaN(valFrom) ? val : { from: valFrom, to: val };
                    if (drawOpositeDirection) {
                        yOffset[i] += h;
                        out[j].push({ from: y, to: y + h, value: outVal, valueFrom: valFrom, valueRadius: valR });
                    }
                    else {
                        yOffset[i] -= h;
                        out[j].push({ from: y, to: y - h, value: outVal, valueFrom: valFrom, valueRadius: valR });
                    }
                }
            }

            var renderData = this._renderData[groupIndex];
            renderData.baseOffset = yzero;
            renderData.offsets = out;
            renderData.bands = bands;

            // calculate horizontal offsets
            renderData.xoffsets = this._calculateXOffsets(groupIndex, rect.width);
            // end calculating horizontal offsets

            return this._renderData[groupIndex];
        },

        _calcPieSeriesGroupOffsets: function (groupIndex, rect) {
            var dataLength = this._getDataLen(groupIndex);
            var group = this.seriesGroups[groupIndex];

            var renderData = this._renderData[groupIndex] = {};
            var out = renderData.offsets = [];

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var s = group.series[sidx]

                var initialAngle = s.initialAngle || 0;
                var currentAngle = initialAngle;
                var radius = s.radius || Math.min(rect.width, rect.height) * 0.4;
                if (isNaN(radius))
                    radius = 1;

                var innerRadius = s.innerRadius || 0;
                if (isNaN(innerRadius) || innerRadius >= radius)
                    innerRadius = 0;

                var centerOffset = s.centerOffset || 0;
                var offsetX = $.jqx.getNum([s.offsetX, group.offsetX, rect.width / 2]);
                var offsetY = $.jqx.getNum([s.offsetY, group.offsetY, rect.height / 2]);

                out.push([]);

                // compute the sum
                var sumP = 0;
                var sumN = 0;
                for (var i = 0; i < dataLength; i++) {
                    var val = this._getDataValueAsNumber(i, s.dataField, groupIndex);
                    if (isNaN(val))
                        continue;
                    if (val > 0)
                        sumP += val;
                    else
                        sumN += val;
                }

                var range = sumP - sumN;
                if (range == 0)
                    range = 1;

                // render
                for (var i = 0; i < dataLength; i++) {
                    var val = this._getDataValueAsNumber(i, s.dataField, groupIndex);
                    if (isNaN(val)) {
                        out[sidx].push({});
                        continue;
                    }

                    var displayField = s.displayText || s.displayField;
                    var displayValue = this._getDataValue(i, displayField, groupIndex);
                    if (displayValue == undefined)
                        displayValue = i;

                    var angle = Math.round(Math.abs(val) / range * 360.0);
                    if (i + 1 == dataLength)
                        angle = 360 + initialAngle - currentAngle;

                    var x = rect.x + offsetX;
                    var y = rect.y + offsetY;

                    var centerOffsetValue = centerOffset;
                    if ($.isFunction(centerOffset)) {
                        centerOffsetValue = centerOffset({ seriesIndex: sidx, seriesGroupIndex: groupIndex, itemIndex: i });
                    }
                    if (isNaN(centerOffsetValue))
                        centerOffsetValue = 0;

                    var sliceRenderData = { key: groupIndex + '_' + sidx + '_' + i, value: val, displayValue: displayValue, x: x, y: y, fromAngle: currentAngle, toAngle: currentAngle + angle, centerOffset: centerOffsetValue, innerRadius: innerRadius, outerRadius: radius };
                    out[sidx].push(sliceRenderData);

                    currentAngle += angle;
                }
            }

            return renderData;
        },


        _isPointSeriesOnly: function () {
            for (var i = 0; i < this.seriesGroups.length; i++) {
                var g = this.seriesGroups[i];
                if (g.type.indexOf('line') == -1 && g.type.indexOf('area') == -1 && g.type.indexOf('scatter') == -1 && g.type.indexOf('bubble') == -1)
                    return false;
            }

            return true;
        },

        _alignValuesWithTicks: function (groupIndex) {
            var psonly = this._isPointSeriesOnly();

            var g = this.seriesGroups[groupIndex];
            // if (g.spider || g.polar)
            //   return true;

            // if categoryAxis
            var xAxis = this._getCategoryAxis(groupIndex);
            var xAxisValuesOnTicks = xAxis.valuesOnTicks == undefined ? psonly : xAxis.valuesOnTicks != false;
            if (groupIndex == undefined)
                return xAxisValuesOnTicks;

            if (g.valuesOnTicks == undefined)
                return xAxisValuesOnTicks;

            return g.valuesOnTicks;
        },

        _getYearsDiff: function (from, to) {
            return to.getFullYear() - from.getFullYear();
        },

        _getMonthsDiff: function (from, to) {
            return 12 * (to.getFullYear() - from.getFullYear()) + to.getMonth() - from.getMonth();
        },

        _getDateDiff: function (from, to, baseUnit, round) {
            var diff = 0;
            if (baseUnit != 'year' && baseUnit != 'month')
                diff = to.valueOf() - from.valueOf();

            switch (baseUnit) {
                case 'year':
                    diff = this._getYearsDiff(from, to);
                    break;
                case 'month':
                    diff = this._getMonthsDiff(from, to);
                    break;
                case 'day':
                    diff /= (24 * 3600 * 1000);
                    break;
                case 'hour':
                    diff /= (3600 * 1000);
                    break;
                case 'minute':
                    diff /= (60 * 1000);
                    break;
                case 'second':
                    diff /= (1000);
                    break;
                case 'millisecond':
                    break;
            }

            if (baseUnit != 'year' && baseUnit != 'month' && round != false)
                diff = $.jqx._rnd(diff, 1, true);

            return diff;
        },

        _getDateTimeArray: function (min, max, baseUnit, inclNext, unitInterval) {
            var arr = [];

            var len = this._getDateDiff(min, max, baseUnit);
            if (inclNext)
                len += unitInterval;

            if (baseUnit == 'year') {
                var val = min.getFullYear();
                for (var i = 0; i < len; i++) {
                    arr.push(new Date(val, 0, 1, 0, 0, 0, 0));
                    val++;
                }
            }
            else if (baseUnit == 'month') {
                var month = min.getMonth();
                var year = min.getFullYear();
                for (var i = 0; i < len; i++) {
                    arr.push(new Date(year, month, 1, 0, 0, 0, 0));
                    month++;
                    if (month > 11) {
                        year++;
                        month = 0;
                    }
                }
            }
            else if (baseUnit == 'day') {
                for (var i = 0; i < len; i++) {
                    var date = new Date(min.valueOf() + i * 1000 * 3600 * 24);
                    arr.push(date);
                }
            }
            else {
                var step = 0;
                switch (baseUnit) {
                    case 'millisecond':
                        step = 1;
                        break;
                    case 'second':
                        step = 1000;
                        break;
                    case 'minute':
                        step = 60 * 1000;
                        break;
                    case 'hour':
                        step = 3600 * 1000;
                        break;
                }
                for (var i = 0; i < len; i++) {
                    var date = new Date(min.valueOf() + i * step);
                    arr.push(date);
                }
            }

            return arr;
        },

        _getAsDate: function (value, dateTimeUnit) {
            value = this._castAsDate(value);
            if (dateTimeUnit == 'month')
                return new Date(value.getFullYear(), value.getMonth(), 1);

            if (dateTimeUnit == 'year')
                return new Date(value.getFullYear(), 0, 1);

            if (dateTimeUnit == 'day')
                return new Date(value.getFullYear(), value.getMonth(), value.getDate());

            return value;
        },

        _getCategoryAxisStats: function (groupIndex, catAxis) {
            var dataLength = this._getDataLen(groupIndex);
            var isDateTime = catAxis.type == 'date' || catAxis.type == 'time';
            var axisMin = isDateTime ? this._castAsDate(catAxis.minValue) : this._castAsNumber(catAxis.minValue);
            var axisMax = isDateTime ? this._castAsDate(catAxis.maxValue) : this._castAsNumber(catAxis.maxValue);

            var min = axisMin, max = axisMax;

            // calculate the min/max if not set
            if (isNaN(min) || isNaN(max)) {
                for (var i = 0; i < dataLength; i++) {
                    var value = this._getDataValue(i, catAxis.dataField, groupIndex);
                    value = isDateTime ? this._castAsDate(value) : this._castAsNumber(value);

                    if (isNaN(value))
                        continue;

                    if (isNaN(axisMin)) {
                        if (value < min || isNaN(min))
                            min = value;
                    }

                    if (isNaN(axisMax)) {
                        if (value > max || isNaN(max))
                            max = value;
                    }
                }
            }

            // convert to date
            if (isDateTime) {
                min = new Date(min);
                max = new Date(max);
            }

            if (isDateTime && !(this._isDate(min) && this._isDate(max))) {
                throw 'Invalid Date values';
            }

            var isRange = !isNaN(catAxis.maxValue) || !isNaN(catAxis.minValue);
            if (isRange && (isNaN(max) || isNaN(min))) {
                isRange = false;
                throw 'Invalid min/max category values';
            }

            if (!isRange && !isDateTime) {
                min = 0;
                max = dataLength - 1;
            }

            var dateTimeUnit = catAxis.baseUnit;
            var isTimeUnit = dateTimeUnit == 'hour' || dateTimeUnit == 'minute' || dateTimeUnit == 'second' || dateTimeUnit == 'millisecond';

            var interval = catAxis.unitInterval;
            if (isNaN(interval) || interval <= 0)
                interval = 1;

            if (isTimeUnit) {
                if (dateTimeUnit == 'second')
                    interval *= 1000;
                else if (dateTimeUnit == 'minute')
                    interval *= 60 * 1000;
                else if (dateTimeUnit == 'hour')
                    interval *= 3600 * 1000;
            }

            return { min: min, max: max, isRange: isRange, isDateTime: isDateTime, isTimeUnit: isTimeUnit, dateTimeUnit: dateTimeUnit, interval: interval };
        },

        _scaleDateTimeAxis: function (stats, valuesOnTicks) {
            var min = stats.min;
            var max = stats.max;
            var dateTimeUnit = stats.dateTimeUnit;
            var isTimeUnit = stats.isTimeUnit;
            var interval = stats.interval;

            var _max = this._getAsDate(max, dateTimeUnit);
            var _min = this._getAsDate(min, dateTimeUnit);

            if (!isTimeUnit && !valuesOnTicks) {
                if (dateTimeUnit == 'month') {
                    _max.setMonth(_max.getMonth() + 1);
                }
                else if (dateTimeUnit == 'year')
                    _max.setYear(_max.getFullYear() + 1);
                else
                    _max.setDate(_max.getDate() + 1);
            }

            var daysRange = 0;
            var rangeLength = this._getDateDiff(_min, _max, isTimeUnit ? 'millisecond' : dateTimeUnit);

            while (_max <= max) {
                rangeLength = $.jqx._rnd(rangeLength, interval, true);

                if (dateTimeUnit == 'month') {
                    _min = new Date(_min.getFullYear(), _min.getMonth(), 1);
                    _max = new Date(_min);
                    _max.setMonth(_max.getMonth() + rangeLength);
                }
                else if (dateTimeUnit == 'year') {
                    _min = new Date(_min.getFullYear(), 0, 1);
                    _max = new Date(_min);
                    _max.setYear(_max.getFullYear() + rangeLength);
                }
                else {
                    _max = new Date(min);
                    if (isTimeUnit)
                        _max.setTime(_min.getTime() + rangeLength);
                    else {
                        _max.setDate(_min.getDate() + rangeLength);
                    }
                }

                if (_max < max)
                    rangeLength++;
                else
                    break;
            }

            if (!isTimeUnit) {
                if (dateTimeUnit == 'day')
                    daysRange = this._getDateDiff(_min, _max, 'day', false);
                else
                    daysRange = $.jqx._rnd(this._getDateDiff(_min, _max, 'day', false), interval, true);

                _max = new Date(_min);
                _max.setDate(_min.getDate() + daysRange);
            }
            rangeLength = this._getDateDiff(_min, _max, isTimeUnit ? 'millisecond' : dateTimeUnit);

            return { min: _min, max: _max, rangeLength: rangeLength, daysRange: daysRange };
        },

        _calculateXOffsets: function (groupIndex, axisSize) {
            var xAxis = this._getCategoryAxis(groupIndex);
            var xoffsets = new Array();
            var xvalues = new Array();
            var dataLength = this._getDataLen(groupIndex);

            var axisStats = this._getCategoryAxisStats(groupIndex, xAxis);
            var min = axisStats.min;
            var max = axisStats.max;
            var isRange = axisStats.isRange;
            var isDateTime = axisStats.isDateTime;
            var isTimeUnit = axisStats.isTimeUnit;
            var dateTimeUnit = axisStats.dateTimeUnit;
            var interval = axisStats.interval;

            var g = this.seriesGroups[groupIndex];
            var isPolar = g.polar || g.spider;

            var rangeLength = NaN;
            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);
            /*
            if (isRange) {
            if (valuesOnTicks)
            rangeLength = max - min;
            else
            rangeLength = max - min + (isPolar ? 0 : interval);
            }
            else {
            rangeLength = dataLength - 1;
            if (!valuesOnTicks && !isPolar)
            rangeLength++;
            }
            */

            //if (isPolar)
            //   valuesOnTicks = true;

            if (isRange) {
                if (valuesOnTicks)
                    rangeLength = max - min;
                else
                    rangeLength = max - min + interval;
            }
            else {
                rangeLength = dataLength - 1;
                if (!valuesOnTicks)
                    rangeLength++;
            }

            if (isPolar && valuesOnTicks)
                rangeLength += interval;

            if (rangeLength == 0)
                rangeLength = interval;

            var _max = max;
            var _min = min;

            var daysRange = 0;
            if (isDateTime) {
                var scale = this._scaleDateTimeAxis(axisStats, valuesOnTicks);
                _min = scale.min;
                _max = scale.max;
                rangeLength = scale.rangeLength;
                daysRange = scale.daysRange;
            }

            var itemsCount = Math.max(1, rangeLength / interval);
            var itemWidth = axisSize / itemsCount;

            var isColumn = groupIndex != undefined && this.seriesGroups[groupIndex].type.indexOf('column') != -1;

            var xAdjust = 0;
            if (!valuesOnTicks && !isColumn) {
                if (isDateTime && !isTimeUnit)
                    xAdjust = axisSize / Math.max(1, daysRange * 2);
                else
                    xAdjust = itemWidth / 2;
            }

            var dateTimeUnitCompute = dateTimeUnit;
            if (isDateTime)
                dateTimeUnitCompute = isTimeUnit ? 'millisecond' : 'day';

            var first = -1, last = -1;
            for (var i = 0; i < dataLength; i++) {
                var value = (xAxis.dataField === undefined) ? i : this._getDataValue(i, xAxis.dataField, groupIndex);

                if (!isRange && !isDateTime) {
                    xoffsets.push($.jqx._ptrnd(xAdjust + (i - _min) / rangeLength * axisSize));
                    xvalues.push(value);
                    if (first == -1)
                        first = i;
                    if (last == -1 || last < i)
                        last = i;
                    continue;
                }

                value = isDateTime ? this._castAsDate(value) : this._castAsNumber(value);
                if (isNaN(value) || value < min || value > max) {
                    xoffsets.push(-1);
                    xvalues.push(undefined);
                    continue;
                }

                var x = 0;
                if (!isDateTime || (isDateTime && isTimeUnit)) {
                    diffFromMin = value - _min;
                    x = (value - _min) * axisSize / rangeLength;
                }
                else {
                    x = this._getDateDiff(_min, value, dateTimeUnit, false) * itemWidth / interval;
                    if (dateTimeUnit != 'day') {
                        var adjust = this._getDateDiff(this._getAsDate(value, dateTimeUnit), value, dateTimeUnitCompute, false);
                        x += adjust / daysRange * axisSize;
                    }
                }

                x = $.jqx._ptrnd(xAdjust + x);

                xoffsets.push(x);
                xvalues.push(value);

                if (first == -1)
                    first = i;
                if (last == -1 || last < i)
                    last = i;
            }

            if (xAxis.flip == true) {
                xoffsets.reverse();
            }

            if (isTimeUnit) {
                rangeLength = this._getDateDiff(_min, _max, xAxis.baseUnit);
                rangeLength = $.jqx._rnd(rangeLength, 1, false);
            }

            var intervalWidth = itemWidth;
            itemsCount = Math.max(1, rangeLength);
            itemWidth = axisSize / itemsCount;

            return { data: xoffsets, xvalues: xvalues, first: first, last: last, length: last == -1 ? 0 : last - first + 1, itemWidth: itemWidth, intervalWidth: intervalWidth, rangeLength: rangeLength, min: _min, max: _max, customRange: isRange };
        },


        //[optimize]
        _getCategoryAxis: function (gidx) {
            if (gidx == undefined || this.seriesGroups.length <= gidx)
                return this.categoryAxis;

            return this.seriesGroups[gidx].categoryAxis || this.categoryAxis;
        },

        //[optimize]
        _isGreyScale: function (groupIndex, seriesIndex) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];

            if (s.greyScale == true)
                return true;
            else if (s.greyScale == false)
                return false;

            if (g.greyScale == true)
                return true;
            else if (g.greyScale == false)
                return false;

            return this.greyScale == true;
        },



        //[optimize]
        _getSeriesColors: function (groupIndex, seriesIndex) {
            var colors = this._getSeriesColorsInternal(groupIndex, seriesIndex);

            if (this._isGreyScale(groupIndex, seriesIndex)) {
                for (var i in colors)
                    colors[i] = $.jqx.toGreyScale(colors[i]);
            }

            return colors;
        },

        //[optimize]
        _getSeriesColorsInternal: function (groupIndex, seriesIndex) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];

            var lineColor = '#222222';
            var lineColorSelected = '#151515';
            var lineColorSymbol = '#222222';
            var lineColorSymbolSelected = '#151515';

            var fillColor = '#222222';
            var fillColorSelected = '#333333';
            var fillColorSymbol = '#222222';
            var fillColorSymbolSelected = '#333333';

            if (s.color || s.fillColor) {
                fillColor = s.color || s.fillColor;
            }
            else {
                var sidx = 0;
                for (var i = 0; i <= groupIndex; i++) {
                    for (var j in this.seriesGroups[i].series) {
                        if (i == groupIndex && j == seriesIndex)
                            break;
                        else
                            sidx++;
                    }
                }

                var colorScheme = this.colorScheme;
                if (g.colorScheme) {
                    colorScheme = g.colorScheme;
                    sidex = seriesIndex;
                }

                if (colorScheme == undefined || colorScheme == '')
                    colorScheme = this.colorSchemes[0].name;

                if (colorScheme) {
                    for (var i = 0; i < this.colorSchemes.length; i++) {
                        var cs = this.colorSchemes[i];
                        if (cs.name == colorScheme) {
                            while (sidx > cs.colors.length) {
                                sidx -= cs.colors.length;
                                if (++i >= this.colorSchemes.length)
                                    i = 0;
                                cs = this.colorSchemes[i];
                            }

                            fillColor = cs.colors[sidx % cs.colors.length];
                        }
                    }
                }
            }

            if (s.fillColorSelected)
                fillColorSelected = s.fillColorSelected;
            else
                fillColorSelected = $.jqx._adjustColor(fillColor, 1.1);

            if (s.lineColor)
                lineColor = s.lineColor;
            else
                lineColor = $.jqx._adjustColor(fillColor, 0.9);

            if (s.lineColorSelected)
                lineColorSelected = s.lineColorSelected;
            else
                lineColorSelected = $.jqx._adjustColor(fillColor, 0.8); ;

            if (s.lineColorSymbol)
                lineColorSymbol = s.lineColorSymbol;
            else
                lineColorSymbol = lineColor;

            if (s.lineColorSymbolSelected)
                lineColorSymbolSelected = s.lineColorSymbolSelected;
            else
                lineColorSymbolSelected = lineColorSelected;

            if (s.fillColorSymbol)
                fillColorSymbol = s.fillColorSymbol;
            else
                fillColorSymbol = fillColor;

            if (s.fillColorSymbolSelected)
                fillColorSymbolSelected = s.fillColorSymbolSelected;
            else
                fillColorSymbolSelected = fillColorSelected;

            return { lineColor: lineColor, lineColorSelected: lineColorSelected, fillColor: fillColor, fillColorSelected: fillColorSelected, lineColorSymbol: lineColorSymbol, lineColorSymbolSelected: lineColorSymbolSelected, fillColorSymbol: fillColorSymbol, fillColorSymbolSelected: fillColorSymbolSelected };
        },

        _getColor: function (scheme, index, gidx, sidx) {
            if (scheme == undefined || scheme == '')
                scheme = this.colorSchemes[0].name;

            for (var i = 0; i < this.colorSchemes.length; i++)
                if (scheme == this.colorSchemes[i].name)
                    break;

            var j = 0;
            while (j <= index) {
                if (i == this.colorSchemes.length)
                    i = 0;

                var schLen = this.colorSchemes[i].colors.length;
                if (j + schLen <= index) {
                    j += schLen;
                    i++;
                }
                else {
                    var color = this.colorSchemes[i].colors[index - j];

                    if (this._isGreyScale(gidx, sidx) && color.indexOf('#') == 0)
                        color = $.jqx.toGreyScale(color);

                    return color;
                }
            }
        },

        getColorScheme: function (scheme) {
            for (var i in this.colorSchemes) {
                if (this.colorSchemes[i].name == scheme)
                    return this.colorSchemes[i].colors;
            }

            return undefined;
        },

        addColorScheme: function (scheme, colors) {
            for (var i in this.colorSchemes) {
                if (this.colorSchemes[i].name == scheme) {
                    this.colorSchemes[i].colors = colors;
                    return;
                }
            }

            this.colorSchemes.push({ name: scheme, colors: colors });
        },

        removeColorScheme: function (scheme) {
            for (var i in this.colorSchemes) {
                if (this.colorSchemes[i].name == scheme) {
                    this.colorSchemes.splice(i, 1);
                    break;
                }
            }
        },

        /************* COLOR SCHEMES ************/
        //[optimize]
        colorSchemes: [
            { name: 'scheme01', colors: ['#307DD7', '#AA4643', '#89A54E', '#71588F', '#4198AF'] },
            { name: 'scheme02', colors: ['#7FD13B', '#EA157A', '#FEB80A', '#00ADDC', '#738AC8'] },
            { name: 'scheme03', colors: ['#E8601A', '#FF9639', '#F5BD6A', '#599994', '#115D6E'] },
            { name: 'scheme04', colors: ['#D02841', '#FF7C41', '#FFC051', '#5B5F4D', '#364651'] },
            { name: 'scheme05', colors: ['#25A0DA', '#309B46', '#8EBC00', '#FF7515', '#FFAE00'] },
            { name: 'scheme06', colors: ['#0A3A4A', '#196674', '#33A6B2', '#9AC836', '#D0E64B'] },
            { name: 'scheme07', colors: ['#CC6B32', '#FFAB48', '#FFE7AD', '#A7C9AE', '#888A63'] },
            { name: 'scheme08', colors: ['#2F2933', '#01A2A6', '#29D9C2', '#BDF271', '#FFFFA6'] },
            { name: 'scheme09', colors: ['#1B2B32', '#37646F', '#A3ABAF', '#E1E7E8', '#B22E2F'] },
            { name: 'scheme10', colors: ['#5A4B53', '#9C3C58', '#DE2B5B', '#D86A41', '#D2A825'] },
            { name: 'scheme11', colors: ['#993144', '#FFA257', '#CCA56A', '#ADA072', '#949681']}///,
        //{ name: 'scheme02', colors: ['#105B63', '#FFFAD5', '#FFD34E', '#DB9E36', '#BD4932'] },
        //{ name: 'scheme04', colors: ['#BBEBBC', '#F0EE94', '#F5C465', '#FA7642', '#FF1E54'] },
        //{ name: 'scheme08', colors: ['#40371E', '#F2EEAC', '#BFA575', '#A63841', '#BFB8A3']},
        //{ name: 'scheme11', colors: ['#222526', '#FFBB6E', '#F28D00', '#D94F00', '#7F203B'] },
        //{ name: 'scheme12', colors: ['#381C19', '#472E29', '#948658', '#F0E99A', '#362E29'] },
        //{ name: 'scheme18', colors: ['#142D58', '#447F6E', '#E1B65B', '#C8782A', '#9E3E17'] },
        //{ name: 'scheme20', colors: ['#4D2B1F', '#635D61', '#7992A2', '#97BFD5', '#BFDCF5'] }//,
        //{ name: 'scheme04', colors: ['#844341', '#D5CC92', '#BBA146', '#897B26', '#55591C'] },
        //{ name: 'scheme05', colors: ['#56626B', '#6C9380', '#C0CA55', '#F07C6C', '#AD5472'] },
        //{ name: 'scheme07', colors: ['#96003A', '#FF7347', '#FFBC7B', '#FF4154', '#440203'] },
        //{ name: 'scheme08', colors: ['#5D7359', '#E0D697', '#D6AA5C', '#8C5430', '#661C0E'] },
        //{ name: 'scheme21', colors: ['#16193B', '#35478C', '#4E7AC7', '#7FB2F0', '#ADD5F7'] },
        //{ name: 'scheme24', colors: ['#7B1A25', '#BF5322', '#9DA860', '#CEA457', '#B67818'] },
        //{ name: 'scheme26', colors: ['#0081DA', '#3AAFFF', '#99C900', '#FFEB3D', '#309B46'] },
        //{ name: 'scheme27', colors: ['#0069A5', '#0098EE', '#7BD2F6', '#FFB800', '#FF6800'] },
        //{ name: 'scheme28', colors: ['#FF6800', '#A0A700', '#FF8D00', '#678900', '#0069A5'] }

        ],

        /********** END OF COLOR SCHEMES ********/
        //[optimize]
        _formatValue: function (value, formatSettings, formatFunction, group, serie, itemIndex) {
            if (value == undefined)
                return '';

            if (this._isObject(value) && !formatFunction)
                return '';

            if (formatFunction) {
                if (!$.isFunction(formatFunction))
                    return value.toString();

                try {
                    return formatFunction(value, itemIndex, serie, group);
                }
                catch (e) {
                    return e.message;
                }
            }

            if (this._isNumber(value))
                return this._formatNumber(value, formatSettings);

            if (this._isDate(value))
                return this._formatDate(value, formatSettings);

            if (formatSettings) {
                return (formatSettings.prefix || '') + value.toString() + (formatSettings.sufix || '');
            }

            return value.toString();
        },

        //[optimize]
        _getFormattedValue: function (groupIndex, seriesIndex, itemIndex, formatSettings, formatFunction) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];
            var text = '';

            var fs = formatSettings, fn = formatFunction;
            if (!fn)
                fn = s.formatFunction || g.formatFunction;
            if (!fs)
                fs = s.formatSettings || g.formatSettings;

            // series format settings takes priority over group format function;
            if (!s.formatFunction && s.formatSettings)
                fn = undefined;

            if (g.type.indexOf('range') != -1) {
                var valueFrom = this._getDataValue(itemIndex, s.dataFieldFrom, groupIndex);
                var valueTo = this._getDataValue(itemIndex, s.dataFieldTo, groupIndex);

                if (fn && $.isFunction(fn)) {
                    try {
                        return fn({ from: valueFrom, to: valueTo }, itemIndex, s, g);
                    }
                    catch (e) {
                        return e.message;
                    }
                }

                if (undefined != valueFrom)
                    text = this._formatValue(valueFrom, fs, fn, g, s, itemIndex);

                if (undefined != valueTo)
                    text += ", " + this._formatValue(valueTo, fs, fn, g, s, itemIndex);
            }
            else {
                var value = this._getDataValue(itemIndex, s.dataField, groupIndex);
                if (undefined != value) {
                    // format function is used with priority when available.
                    text = this._formatValue(value, fs, fn, g, s, itemIndex);
                }
            }

            return text || '';
        },

        //[optimize]
        _isNumberAsString: function (text) {
            if (typeof (text) != 'string')
                return false;

            text = $.trim(text);
            for (var i = 0; i < text.length; i++) {
                var ch = text.charAt(i);
                if ((ch >= '0' && ch <= '9') || ch == ',' || ch == '.')
                    continue;

                if (ch == '-' && i == 0)
                    continue;

                if ((ch == '(' && i == 0) || (ch == ')' && i == text.length - 1))
                    continue;

                return false;
            }

            return true;
        },

        //[optimize]
        _castAsDate: function (value) {
            if (value instanceof Date && !isNaN(value))
                return value;

            if (typeof (value) == 'string') {
                var date = new Date(value);
                if (isNaN(date))
                    date = this._parseISO8601Date(value);
                if (date != undefined && !isNaN(date))
                    return date;
            }

            return undefined;
        },

        _parseISO8601Date: function (value) {
            var splitDateTime = value.split(" ");
            if (splitDateTime.length < 0)
                return NaN;
            var splitDate = splitDateTime[0].split("-");
            var splitTime = splitDateTime.length == 2 ? splitDateTime[1].split(":") : "";
            var yy = splitDate[0];
            var MM = splitDate.length > 1 ? splitDate[1] - 1 : 0;
            var dd = splitDate.length > 2 ? splitDate[2] : 1;
            var hh = splitTime[1];
            var mm = splitTime.length > 1 ? splitTime[1] : 0;
            var hh = splitTime.length > 2 ? splitTime[2] : 0;
            var ss = splitTime.length > 3 ? splitTime[3] : 0;
            return new Date(yy, MM, dd, hh, mm, ss);
        },


        //[optimize]
        _castAsNumber: function (value) {
            if (value instanceof Date && !isNaN(value))
                return value.valueOf();

            if (typeof (value) == 'string') {
                if (this._isNumber(value)) {
                    value = parseFloat(value);
                }
                else {
                    var date = new Date(value);
                    if (date != undefined)
                        value = date.valueOf();
                }
            }

            return value;
        },

        //[optimize]
        _isNumber: function (value) {
            if (typeof (value) == 'string') {
                if (this._isNumberAsString(value))
                    value = parseFloat(value);
            }
            return typeof value === 'number' && isFinite(value);
        },

        //[optimize]
        _isDate: function (value) {
            return value instanceof Date;
        },

        //[optimize]
        _isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        //[optimize]
        _isObject: function (value) {
            return (value && (typeof value === 'object' || $.isFunction(value))) || false;
        },

        //[optimize]
        _formatDate: function (value, settings) {
            return value.toString();
        },

        //[optimize]
        _formatNumber: function (value, settings) {
            if (!this._isNumber(value))
                return value;

            settings = settings || {};

            var decimalSeparator = settings.decimalSeparator || '.';
            var thousandsSeparator = settings.thousandsSeparator || '';
            var prefix = settings.prefix || '';
            var sufix = settings.sufix || '';
            var decimalPlaces = settings.decimalPlaces;
            if (isNaN(decimalPlaces))
                decimalPlaces = ((value * 100 != parseInt(value) * 100) ? 2 : 0);
            var negativeWithBrackets = settings.negativeWithBrackets || false;

            var negative = (value < 0);

            if (negative && negativeWithBrackets)
                value *= -1;

            var output = value.toString();
            var decimalindex;

            var decimal = Math.pow(10, decimalPlaces);
            output = (Math.round(value * decimal) / decimal).toString();
            if (isNaN(output)) {
                output = '';
            }

            decimalindex = output.lastIndexOf(".");
            if (decimalPlaces > 0) {
                if (decimalindex < 0) {
                    output += decimalSeparator;
                    decimalindex = output.length - 1;
                }
                else if (decimalSeparator !== ".") {
                    output = output.replace(".", decimalSeparator);
                }
                while ((output.length - 1 - decimalindex) < decimalPlaces) {
                    output += "0";
                }
            }

            decimalindex = output.lastIndexOf(decimalSeparator);
            decimalindex = (decimalindex > -1) ? decimalindex : output.length;
            var newoutput = output.substring(decimalindex);
            var cnt = 0;
            for (var i = decimalindex; i > 0; i--, cnt++) {
                if ((cnt % 3 === 0) && (i !== decimalindex) && (!negative || (i > 1) || (negative && negativeWithBrackets))) {
                    newoutput = thousandsSeparator + newoutput;
                }
                newoutput = output.charAt(i - 1) + newoutput;
            }
            output = newoutput;

            if (negative && negativeWithBrackets)
                output = '(' + output + ')';

            return prefix + output + sufix;
        },

        //[optimize]
        _defaultNumberFormat: { prefix: '', sufix: '', decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2, negativeWithBrackets: false },

        _getBezierPoints: function (arr) {
            var points = [];
            var split = arr.split(' ');
            for (var i = 0; i < split.length; i++) {
                var pt = split[i].split(',');
                points.push({ x: parseFloat(pt[0]), y: parseFloat(pt[1]) });
            }

            var result = '';

            if (points.length < 3) {
                for (var i = 0; i < points.length; i++)
                    result += (i > 0 ? ' ' : '') + points[i].x + ',' + points[i].y;
            }
            else {
                for (var i = 0; i < points.length - 1; i++) {
                    var p = [];
                    if (0 == i) {
                        p.push(points[i]);
                        p.push(points[i]);
                        p.push(points[i + 1]);
                        p.push(points[i + 2]);
                    } else if (points.length - 2 == i) {
                        p.push(points[i - 1]);
                        p.push(points[i]);
                        p.push(points[i + 1]);
                        p.push(points[i + 1]);
                    } else {
                        p.push(points[i - 1]);
                        p.push(points[i]);
                        p.push(points[i + 1]);
                        p.push(points[i + 2]);
                    }

                    var out = [];

                    var b = i > 3 ? 9 : 5;
                    var a = i == 0 ? 81 : b;

                    var c1 = { x: ((-p[0].x + a * p[1].x + p[2].x) / a), y: ((-p[0].y + a * p[1].y + p[2].y) / a) };
                    if (i == 0)
                        a = b;
                    var c2 = { x: ((p[1].x + a * p[2].x - p[3].x) / a), y: ((p[1].y + a * p[2].y - p[3].y) / a) };

                    out.push({ x: p[1].x, y: p[1].y });
                    out.push(c1);
                    out.push(c2);
                    out.push({ x: p[2].x, y: p[2].y });

                    result += "C" + $.jqx._ptrnd(out[1].x) + "," + $.jqx._ptrnd(out[1].y) + " " + $.jqx._ptrnd(out[2].x) + "," + $.jqx._ptrnd(out[2].y) + " " + $.jqx._ptrnd(out[3].x) + "," + $.jqx._ptrnd(out[3].y) + " ";
                }
            }

            return result;
        },

        _animTickInt: 50,

        _createAnimationGroup: function (groupId) {
            if (!this._animGroups) {
                this._animGroups = {};
            }

            this._animGroups[groupId] = { animations: [], startTick: NaN };
        },

        _startAnimation: function (groupId) {
            var d = new Date();
            var currentTick = d.getTime();
            this._animGroups[groupId].startTick = currentTick;
            this._runAnimation();
            this._enableAnimTimer();
        },

        _enqueueAnimation: function (groupId, element, properties, duration, fn, context, easing) {
            if (duration < 0)
                duration = 0;

            if (easing == undefined)
                easing = 'easeInOutSine';

            this._animGroups[groupId].animations.push({ key: element, properties: properties, duration: duration, fn: fn, context: context, easing: easing });
        },

        _stopAnimations: function () {
            clearTimeout(this._animtimer);
            this._animtimer = undefined;
            this._animGroups = undefined;
        },

        _enableAnimTimer: function () {
            if (!this._animtimer) {
                var self = this;
                this._animtimer = setTimeout(function () { self._runAnimation(); }, this._animTickInt);
            }
        },

        _runAnimation: function () {
            if (this._animGroups) {
                var d = new Date();
                var currentTick = d.getTime();

                var animGroupsNewList = {};
                for (var j in this._animGroups) {
                    var list = this._animGroups[j].animations;
                    var startTick = this._animGroups[j].startTick;

                    var maxDuration = 0;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];

                        var tSince = (currentTick - startTick);
                        if (item.duration > maxDuration)
                            maxDuration = item.duration;

                        var percent = item.duration > 0 ? tSince / item.duration : 1;
                        var easePercent = percent;
                        if (item.easing && item.duration != 0)
                            easePercent = jQuery.easing[item.easing](percent, tSince, 0, 1, item.duration);

                        if (percent > 1) {
                            percent = 1;
                            easePercent = 1;
                        }

                        if (item.fn) // custom function
                        {
                            item.fn(item.key, item.context, easePercent);
                            continue;
                        }

                        var params = {};
                        for (var j = 0; j < item.properties.length; j++) {
                            var p = item.properties[j];
                            var val = 0;

                            if (percent == 1) {
                                val = p.to;
                            }
                            else {
                                val = easeParecent * (p.to - p.from) + p.from;
                            }

                            params[p.key] = val;
                        }
                        this.renderer.attr(item.key, params);
                    } // for i

                    if (startTick + maxDuration > currentTick)
                        animGroupsNewList[j] = ({ startTick: startTick, animations: list });
                } // for j

                this._animGroups = animGroupsNewList;

                if (this.renderer instanceof $.jqx.HTML5Renderer)
                    this.renderer.refresh();
            }

            this._animtimer = null;

            for (var j in this._animGroups) {
                this._enableAnimTimer();
                break;
            }

        }

    });

    //[optimize]
    $.jqx.toGreyScale = function (color) {
        if (color.indexOf('#') == -1)
            return color;

        var rgb = $.jqx.cssToRgb(color);
        rgb[0] = rgb[1] = rgb[2] = Math.round(0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]);
        var hex = $.jqx.rgbToHex(rgb[0], rgb[1], rgb[2]);
        return '#' + hex[0] + hex[1] + hex[2];
    },

    //[optimize]
    $.jqx._adjustColor = function (color, adj) {
        if (color.indexOf('#') == -1)
            return color;

        var rgb = $.jqx.cssToRgb(color);

        var color = '#'
        for (var i = 0; i < 3; i++) {
            var c = Math.round(adj * rgb[i]);
            if (c > 255)
                c = 255;
            else if (c <= 0)
                c = 0;
            c = $.jqx.decToHex(c);
            if (c.toString().length == 1)
                color += '0';

            color += c;
        }

        return color.toUpperCase();
    }

    //[optimize]
    $.jqx.decToHex = function (dec) {
        return dec.toString(16);
    },

    //[optimize]
        $.jqx.hexToDec = function (hex) {
            return parseInt(hex, 16);
        }

    //[optimize]
    $.jqx.rgbToHex = function (r, g, b) {
        return [$.jqx.decToHex(r), $.jqx.decToHex(g), $.jqx.decToHex(b)];
    }

    //[optimize]
    $.jqx.hexToRgb = function (h, e, x) {
        return [$.jqx.hexToDec(h), $.jqx.hexToDec(e), $.jqx.hexToDec(x)];
    }

    //[optimize]
    $.jqx.cssToRgb = function (color) {
        if (color.indexOf('rgb') <= -1) {
            return $.jqx.hexToRgb(color.substring(1, 3), color.substring(3, 5), color.substring(5, 7));
        }
        return color.substring(4, color.length - 1).split(',');
    }

    $.jqx.swap = function (x, y) {
        var tmp = x;
        x = y;
        y = tmp;
    }

    $.jqx.getNum = function (arr) {
        if (!$.isArray(arr)) {
            if (isNaN(arr))
                return 0;
        }
        else {
            for (var i = 0; i < arr.length; i++)
                if (!isNaN(arr[i]))
                    return arr[i];
        }

        return 0;
    }

    $.jqx._ptdist = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    $.jqx._ptrnd = function (val) {
        if (!document.createElementNS) {
            if (Math.round(val) == val)
                return val;
            return $.jqx._rnd(val, 1, false, true);
        }

        var rnd = $.jqx._rnd(val, 0.5, false, true);
        if (Math.abs(rnd - Math.round(rnd)) != 0.5) {
            return rnd > val ? rnd - 0.5 : rnd + 0.5;
        }
        return rnd;
    }

    $.jqx._rup = function (n) {
        var nr = Math.round(n);
        if (n > nr)
            nr++;

        return nr;
    }

    $.jqx.log = function (val, base) {
        return Math.log(val) / (base ? Math.log(base) : 1);
    }

    $.jqx._mod = function (a, b) {
        var min = Math.abs(a > b ? b : a);
        var scale = 1;
        if (min != 0) {
            while (min * scale < 100)
                scale *= 10;
        }

        a = a * scale;
        b = b * scale;

        return (a % b) / scale;
    }

    $.jqx._rnd = function (num, unit, toGreater, fast) {
        if (isNaN(num))
            return num;

        var a = num - ((fast == true) ? num % unit : $.jqx._mod(num, unit));
        if (num == a)
            return a;

        if (toGreater) {
            if (num > a)
                a += unit;
        }
        else {
            if (a > num)
                a -= unit;
        }

        return a;
    }

    $.jqx.commonRenderer = {
        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            if (!outerRadius)
                outerRadius = 1;

            var diff = Math.abs(angleFrom - angleTo);
            var lFlag = diff > 180 ? 1 : 0;
            if (diff >= 360) {
                angleTo = angleFrom + 359.99;
            }
            var radFrom = angleFrom * Math.PI * 2 / 360;
            var radTo = angleTo * Math.PI * 2 / 360;

            var x1 = x, x2 = x, y1 = y, y2 = y;

            var isDonut = !isNaN(innerRadius) && innerRadius > 0;

            if (isDonut)
                centerOffset = 0;

            if (centerOffset + innerRadius > 0) {
                if (centerOffset > 0) {
                    var midAngle = diff / 2 + angleFrom;
                    var radMid = midAngle * Math.PI * 2 / 360;

                    x += centerOffset * Math.cos(radMid);
                    y -= centerOffset * Math.sin(radMid);
                }

                if (isDonut) {
                    var inR = innerRadius;
                    x1 = x + inR * Math.cos(radFrom);
                    y1 = y - inR * Math.sin(radFrom);
                    x2 = x + inR * Math.cos(radTo);
                    y2 = y - inR * Math.sin(radTo);
                }
            }

            var x3 = x + outerRadius * Math.cos(radFrom);
            var x4 = x + outerRadius * Math.cos(radTo);
            var y3 = y - outerRadius * Math.sin(radFrom);
            var y4 = y - outerRadius * Math.sin(radTo);

            var path = '';

            if (isDonut) {
                path = 'M ' + x2 + ',' + y2;
                path += ' a' + innerRadius + ',' + innerRadius;
                path += ' 0 ' + lFlag + ',1 ' + (x1 - x2) + ',' + (y1 - y2);
                path += ' L' + x3 + ',' + y3;
                path += ' a' + outerRadius + ',' + outerRadius;
                path += ' 0 ' + lFlag + ',0 ' + (x4 - x3) + ',' + (y4 - y3);
            }
            else {
                path = 'M ' + x4 + ',' + y4;
                path += ' a' + outerRadius + ',' + outerRadius;
                path += ' 0 ' + lFlag + ',1 ' + (x3 - x4) + ',' + (y3 - y4);
                path += ' L' + x + ',' + y + ' Z';
            }

            return path;
        },

        measureText: function (text, angle, params, includeTextPartsInfo, renderer) {
            var textPartsInfo = renderer._getTextParts(text, angle, params);
            var tw = textPartsInfo.width;
            var th = textPartsInfo.height;

            if (false == includeTextPartsInfo)
                th /= 0.6;

            var retVal = {};

            if (isNaN(angle))
                angle = 0;

            if (angle == 0) {
                retVal = { width: $.jqx._rup(tw), height: $.jqx._rup(th) };
            }
            else {
                var rads = angle * Math.PI * 2 / 360;
                var sn = Math.abs(Math.sin(rads));
                var cs = Math.abs(Math.cos(rads));
                var bh = Math.abs(tw * sn + th * cs);
                var bw = Math.abs(tw * cs + th * sn);

                retVal = { width: $.jqx._rup(bw), height: $.jqx._rup(bh) };
            }

            if (includeTextPartsInfo)
                retVal.textPartsInfo = textPartsInfo;

            return retVal;
        },


        alignTextInRect: function (x, y, width, height, textWidth, textHeight, halign, valign, angle, rotateAround) {
            var rads = angle * Math.PI * 2 / 360;
            var sn = Math.sin(rads);
            var cs = Math.cos(rads);

            var h2 = textWidth * sn;
            var w2 = textWidth * cs;

            //var x = 0, y = 0;             

            if (halign == 'center' || halign == '' || halign == 'undefined')
                x = x + width / 2;
            else if (halign == 'right')
                x = x + width;

            if (valign == 'center' || valign == '' || valign == 'undefined')
                y = y + height / 2;
            else if (valign == 'bottom')
                y += height - textHeight / 2;
            else if (valign == 'top')
                y += textHeight / 2;

            rotateAround = rotateAround || '';

            var adjustY = 'middle';
            if (rotateAround.indexOf('top') != -1)
                adjustY = 'top';
            else if (rotateAround.indexOf('bottom') != -1)
                adjustY = 'bottom';

            var adjustX = 'center';
            if (rotateAround.indexOf('left') != -1)
                adjustX = 'left';
            else if (rotateAround.indexOf('right') != -1)
                adjustX = 'right';

            if (adjustX == 'center') {
                x -= w2 / 2;
                y -= h2 / 2;
            }
            else if (adjustX == 'right') {
                x -= w2;
                y -= h2;
            }

            if (adjustY == 'top') {
                x -= textHeight * sn;
                y += textHeight * cs;
            }
            else if (adjustY == 'middle') {
                x -= textHeight * sn / 2;
                y += textHeight * cs / 2;
            }

            x = $.jqx._rup(x);
            y = $.jqx._rup(y);

            return { x: x, y: y };
        }
    }

    $.jqx.svgRenderer = function () { }

    $.jqx.svgRenderer.prototype = {
        _svgns: "http://www.w3.org/2000/svg",

        init: function (host) {
            var s = "<table id=tblChart cellspacing='0' cellpadding='0' border='0' align='left' valign='top'><tr><td colspan=2 id=tdTop></td></tr><tr><td id=tdLeft></td><td class='chartContainer'></td></tr></table>";
            host.append(s);
            this.host = host;

            var container = host.find(".chartContainer");
            container[0].style.width = host.width() + 'px';
            container[0].style.height = host.height() + 'px';

            var offset;
            try {
                var svg = document.createElementNS(this._svgns, 'svg');
                svg.setAttribute('id', 'svgChart');
                svg.setAttribute('version', '1.1');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('overflow', 'hidden');
                container[0].appendChild(svg);
                this.canvas = svg;
            }
            catch (e) {
                return false;
            }

            this._id = new Date().getTime();
            this.clear();

            this._layout();
            this._runLayoutFix();

            return true;
        },

        refresh: function () {
        },

        //[optimize]
        _runLayoutFix: function () {
            var self = this;
            this._fixLayout();
        },

        //[optimize]
        _fixLayout: function () {
            var offset = $(this.canvas).position();

            var pxleft = (parseFloat(offset.left) == parseInt(offset.left));
            var pxtop = (parseFloat(offset.top) == parseInt(offset.top));

            if ($.jqx.browser.msie) {
                var pxleft = true, pxtop = true;
                var el = this.host;
                var xdiff = 0, ydiff = 0;
                while (el && el.position && el[0].parentNode) {
                    var pos = el.position();
                    xdiff += parseFloat(pos.left) - parseInt(pos.left);
                    ydiff += parseFloat(pos.top) - parseInt(pos.top);
                    el = el.parent();
                }
                pxleft = parseFloat(xdiff) == parseInt(xdiff);
                pxtop = parseFloat(ydiff) == parseInt(ydiff);
            }

            if (!pxleft)
                this.host.find("#tdLeft")[0].style.width = '0.5px';
            if (!pxtop)
                this.host.find("#tdTop")[0].style.height = '0.5px';

        },

        //[optimize]
        _layout: function () {
            var offset = $(this.canvas).offset();
            var container = this.host.find(".chartContainer");
            this._width = Math.max($.jqx._rup(this.host.width()) - 1, 0);
            this._height = Math.max($.jqx._rup(this.host.height()) - 1, 0);

            container[0].style.width = this._width;
            container[0].style.height = this._height;

            this._fixLayout();
        },

        getRect: function () {
            return { x: 0, y: 0, width: this._width, height: this._height };
        },

        getContainer: function () {
            var container = this.host.find(".chartContainer");
            return container;
        },

        clear: function () {
            while (this.canvas.childElementCount > 0) {
                this.canvas.removeChild(this.canvas.firstElementChild);
            }

            this._defaultParent = undefined;
            this._defs = document.createElementNS(this._svgns, 'defs');
            this._gradients = {};
            this.canvas.appendChild(this._defs);
        },

        removeElement: function (element) {
            if (element != undefined) {
                try {
                    while (element.firstChild) {
                        this.removeElement(element.firstChild);
                    }

                    if (element.parentNode)
                        element.parentNode.removeChild(element);
                    else
                        this.canvas.removeChild(element);
                }
                catch (error) {
                    var a = error;
                }
            }
        },

        _openGroups: [],

        beginGroup: function () {
            var parent = this._activeParent();
            var g = document.createElementNS(this._svgns, 'g');
            parent.appendChild(g);
            this._openGroups.push(g);

            return g;
        },

        endGroup: function () {
            if (this._openGroups.length == 0)
                return;

            this._openGroups.pop();
        },

        _activeParent: function () {
            return this._openGroups.length == 0 ? this.canvas : this._openGroups[this._openGroups.length - 1];
        },

        //[optimize]
        createClipRect: function (rect) {
            var c = document.createElementNS(this._svgns, 'clipPath');
            var r = document.createElementNS(this._svgns, 'rect');
            this.attr(r, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, fill: 'none' });

            this._clipId = this._clipId || 0;
            c.id = 'cl' + this._id + '_' + (++this._clipId).toString();
            c.appendChild(r);

            this._defs.appendChild(c);

            return c;
        },

        //[optimize]
        setClip: function (elem, clip) {
            return this.attr(elem, { 'clip-path': 'url(#' + clip.id + ')' });
        },

        _clipId: 0,

        //[optimize]
        addHandler: function (element, event, fn) {
            element['on' + event] = fn;
        },

        //[optimize]
        shape: function (name, params) {
            var s = document.createElementNS(this._svgns, name);
            if (!s)
                return undefined;

            for (var param in params)
                s.setAttribute(param, params[param]);

            this._activeParent().appendChild(s);

            return s;
        },

        //[optimize]
        _getTextParts: function (text, angle, params) {
            var textPartsInfo = { width: 0, height: 0, parts: [] };

            var coeff = 0.6;
            var textParts = text.toString().split('<br>');

            var parent = this._activeParent();
            var txt = document.createElementNS(this._svgns, 'text');
            this.attr(txt, params);

            for (var i = 0; i < textParts.length; i++) {
                var textPart = textParts[i];

                var txtNode = txt.ownerDocument.createTextNode(textPart);
                txt.appendChild(txtNode);

                parent.appendChild(txt);
                var bbox;
                try {
                    bbox = txt.getBBox();
                }
                catch (e) {
                    if (console && console.log)
                        console.log(e);
                }

                var tw = $.jqx._rup(bbox.width);
                var th = $.jqx._rup(bbox.height * coeff);

                txt.removeChild(txtNode);

                textPartsInfo.width = Math.max(textPartsInfo.width, tw);
                textPartsInfo.height += th + (i > 0 ? 4 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }
            parent.removeChild(txt);

            return textPartsInfo;
        },

        //[optimize]
        _measureText: function (text, angle, params, includeTextPartsInfo) {
            return $.jqx.commonRenderer.measureText(text, angle, params, includeTextPartsInfo, this);
        },

        measureText: function (text, angle, params) {
            return this._measureText(text, angle, params, false);
        },

        //[optimize]
        text: function (text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
            var sz = this._measureText(text, angle, params, true);
            var textPartsInfo = sz.textPartsInfo;
            var textParts = textPartsInfo.parts;
            var gClip;
            if (!halign)
                halign = 'center';
            if (!valign)
                valign = 'center';

            if (textParts.length > 1 || clip)
                gClip = this.beginGroup();

            if (clip) {
                var crect = this.createClipRect({ x: $.jqx._rup(x) - 1, y: $.jqx._rup(y) - 1, width: $.jqx._rup(width) + 2, height: $.jqx._rup(height) + 2 });
                this.setClip(gClip, crect);
            }

            var parent = this._activeParent();

            var tw = 0, th = 0;
            var coeff = 0.6;

            tw = textPartsInfo.width;
            th = textPartsInfo.height;

            if (isNaN(width) || width <= 0)
                width = tw;
            if (isNaN(height) || height <= 0)
                height = th;

            var w = width || 0;
            var h = height || 0;

            if (!angle || angle == 0) {
                y += th;

                if (valign == 'center')
                    y += (h - th) / 2;
                else if (valign == 'bottom')
                    y += h - th;

                if (!width)
                    width = tw;

                if (!height)
                    height = th;

                var parent = this._activeParent();

                var yOffset = 0;
                for (var i = textParts.length - 1; i >= 0; i--) {
                    var txt = document.createElementNS(this._svgns, 'text');
                    this.attr(txt, params);
                    this.attr(txt, { cursor: 'default' });
                    var txtNode = txt.ownerDocument.createTextNode(textParts[i].text);
                    txt.appendChild(txtNode);

                    var xOffset = x;
                    var wPart = textParts[i].width;
                    var hPart = textParts[i].height;

                    if (halign == 'center')
                        xOffset += (w - wPart) / 2;
                    else if (halign == 'right')
                        xOffset += (w - wPart);

                    this.attr(txt, { x: $.jqx._rup(xOffset), y: $.jqx._rup(y + yOffset), width: $.jqx._rup(wPart), height: $.jqx._rup(hPart) });
                    parent.appendChild(txt);

                    yOffset -= textParts[i].height + 4;
                }

                if (gClip) {
                    this.endGroup();
                    return gClip;
                }

                return txt;
            }

            var point = $.jqx.commonRenderer.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
            x = point.x;
            y = point.y;

            var gTranslate = this.shape('g', { transform: 'translate(' + x + ',' + y + ')' });
            var gRotate = this.shape('g', { transform: 'rotate(' + angle + ')' });

            gTranslate.appendChild(gRotate);

            // add the text blocks
            var yOffset = 0;
            for (var i = textParts.length - 1; i >= 0; i--) {
                var tx = document.createElementNS(this._svgns, 'text');
                this.attr(tx, params);
                this.attr(tx, { cursor: 'default' });
                var txtNode = tx.ownerDocument.createTextNode(textParts[i].text);
                tx.appendChild(txtNode);

                var xOffset = 0;
                var wPart = textParts[i].width;
                var hPart = textParts[i].height;

                if (halign == 'center')
                    xOffset += (textPartsInfo.width - wPart) / 2;
                else if (halign == 'right')
                    xOffset += (textPartsInfo.width - wPart);

                //xOffset = 0;
                this.attr(tx, { x: $.jqx._rup(xOffset), y: $.jqx._rup(yOffset), width: $.jqx._rup(wPart), height: $.jqx._rup(hPart) });
                gRotate.appendChild(tx);

                yOffset -= hPart + 4;
            }

            parent.appendChild(gTranslate);

            if (gClip)
                this.endGroup();

            return gTranslate;
        },

        //[optimize]
        line: function (x1, y1, x2, y2, params) {
            var line = this.shape('line', { x1: x1, y1: y1, x2: x2, y2: y2 });
            this.attr(line, params);
            return line;
        },

        //[optimize]
        path: function (points, params) {
            var s = this.shape('path');
            s.setAttribute('d', points);
            if (params) {
                this.attr(s, params);
            }
            return s;
        },

        //[optimize]
        rect: function (x, y, w, h, params) {
            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);
            w = $.jqx._rup(w);
            h = $.jqx._rup(h);
            var s = this.shape('rect', { x: x, y: y, width: w, height: h });
            if (params)
                this.attr(s, params);
            return s;
        },

        //[optimize]
        circle: function (x, y, r, params) {
            var s = this.shape('circle', { cx: x, cy: y, r: r });
            if (params)
                this.attr(s, params);
            return s;
        },

        //[optimize]
        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            return $.jqx.commonRenderer.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);
        },

        //[optimize]
        pieslice: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
            var pathCmd = this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);

            var s = this.shape('path');
            s.setAttribute('d', pathCmd);

            if (params)
                this.attr(s, params);

            return s;
        },

        //[optimize]
        attr: function (element, params) {
            if (!element || !params)
                return;
            for (var param in params) {
                if (param == "textContent")
                    element.textContent = params[param];
                else
                    element.setAttribute(param, params[param]);
            }
        },

        //[optimize]
        getAttr: function (element, key) {
            return element['getAttribute'](key);
        },

        //[optimize]
        _gradients: {},

        //[optimize]
        _toLinearGradient: function (color, isVertical, stops) {
            var id = 'grd' + this._id + color.replace('#', '') + (isVertical ? 'v' : 'h');

            var url = 'url(#' + id + ')';
            if (this._gradients[url])
                return url;

            var gr = document.createElementNS(this._svgns, 'linearGradient');
            this.attr(gr, { x1: '0%', y1: '0%', x2: isVertical ? '0%' : '100%', y2: isVertical ? '100%' : '0%', id: id });

            for (var stop in stops) {
                var s = document.createElementNS(this._svgns, 'stop');
                var st = 'stop-color:' + $.jqx._adjustColor(color, stops[stop][1]);
                this.attr(s, { offset: stops[stop][0] + '%', style: st });
                gr.appendChild(s);
            }

            this._defs.appendChild(gr);
            this._gradients[url] = true;

            return url;
        },

        //[optimize]
        _toRadialGradient: function (color, stops, coords) {
            var id = 'grd' + this._id + color.replace('#', '') + 'r' + (coords != undefined ? coords.key : '');

            var url = 'url(#' + id + ')';
            if (this._gradients[url])
                return url;

            var gr = document.createElementNS(this._svgns, 'radialGradient');
            if (coords == undefined)
                this.attr(gr, { cx: '50%', cy: '50%', r: '100%', fx: '50%', fy: '50%', id: id });
            else
                this.attr(gr, { cx: coords.x, cy: coords.y, r: coords.outerRadius, id: id, gradientUnits: 'userSpaceOnUse' });

            for (var stop in stops) {
                var s = document.createElementNS(this._svgns, 'stop');
                var st = 'stop-color:' + $.jqx._adjustColor(color, stops[stop][1]);
                this.attr(s, { offset: stops[stop][0] + '%', style: st });
                gr.appendChild(s);
            }

            this._defs.appendChild(gr);
            this._gradients[url] = true;

            return url;
        }

    } // svgRenderer

    $.jqx.vmlRenderer = function () { };
    $.jqx.vmlRenderer.prototype = {
        init: function (host) {
            var s = "<div class='chartContainer' style=\"position:relative;overflow:hidden;\"><div>";
            host.append(s);
            this.host = host;
            var container = host.find(".chartContainer");
            container[0].style.width = host.width() + 'px';
            container[0].style.height = host.height() + 'px';

            var addNamespace = true;

            try {
                for (var i = 0; i < document.namespaces.length; i++) {
                    if (document.namespaces[i].name == 'v' && document.namespaces[i].urn == "urn:schemas-microsoft-com:vml") {
                        addNamespace = false;
                        break;
                    }
                }
            }
            catch (e) {
                return false;
            }

            if ($.jqx.browser.msie && parseInt($.jqx.browser.version) < 9 &&
                (document.childNodes && document.childNodes.length > 0 && document.childNodes[0].data && document.childNodes[0].data.indexOf('DOCTYPE') != -1)
                ) {
                if (addNamespace) {
                    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
                }

                this._ie8mode = true;
            }
            else {
                if (addNamespace) {
                    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
                    document.createStyleSheet().cssText = "v\\:* { behavior: url(#default#VML); display: inline-block; }";
                }
            }

            this.canvas = container[0];

            this._width = Math.max($.jqx._rup(container.width()), 0);
            this._height = Math.max($.jqx._rup(container.height()), 0);

            container[0].style.width = this._width + 2;
            container[0].style.height = this._height + 2;

            this._id = new Date().getTime();
            this.clear();
            return true;
        },

        refresh: function () {
        },

        getRect: function () {
            return { x: 0, y: 0, width: this._width, height: this._height };
        },

        getContainer: function () {
            var container = this.host.find(".chartContainer");
            return container;
        },

        clear: function () {
            while (this.canvas.childElementCount > 0) {
                this.canvas.removeChild(this.canvas.firstElementChild);
            }

            this._gradients = {};
            this._defaultParent = undefined;
        },

        removeElement: function (element) {
            if (element != null) {
                element.parentNode.removeChild(element);
            }
        },

        _openGroups: [],

        beginGroup: function () {
            var parent = this._activeParent();
            var g = document.createElement('v:group');
            g.style.position = 'absolute';
            g.coordorigin = "0,0";
            g.coordsize = this._width + ',' + this._height;
            g.style.left = 0;
            g.style.top = 0;
            g.style.width = this._width;
            g.style.height = this._height;

            parent.appendChild(g);
            this._openGroups.push(g);
            return g;
        },

        endGroup: function () {
            if (this._openGroups.length == 0)
                return;

            this._openGroups.pop();
        },

        _activeParent: function () {
            return this._openGroups.length == 0 ? this.canvas : this._openGroups[this._openGroups.length - 1];
        },

        //[optimize]
        createClipRect: function (rect) {
            var div = document.createElement("div");
            div.style.height = (rect.height + 1) + 'px';
            div.style.width = (rect.width + 1) + 'px';
            div.style.position = 'absolute';
            div.style.left = rect.x + 'px';
            div.style.top = rect.y + 'px';
            div.style.overflow = 'hidden';

            this._clipId = this._clipId || 0;
            div.id = 'cl' + this._id + '_' + (++this._clipId).toString();
            this._activeParent().appendChild(div);
            return div;
        },

        //[optimize]
        setClip: function (elem, clip) {
            //   clip.appendChild(elem);
        },

        _clipId: 0,

        //[optimize]
        addHandler: function (element, event, fn) {
            if ($(element).on) {
                $(element).on(event, fn);
            }
            else {
                $(element).bind(event, fn);
            }
        },

        //[optimize]
        _getTextParts: function (text, angle, params) {
            var textPartsInfo = { width: 0, height: 0, parts: [] };

            var coeff = 0.6;
            var textParts = text.toString().split('<br>');

            var parent = this._activeParent();
            var txt = document.createElement('v:textbox');
            this.attr(txt, params);
            parent.appendChild(txt);

            for (var i = 0; i < textParts.length; i++) {
                var textPart = textParts[i];

                var txtNode = document.createElement('span');
                txtNode.appendChild(document.createTextNode(textPart));
                txt.appendChild(txtNode);
                if (params && params['class'])
                    txtNode.className = params['class'];

                var box = $(txt);
                var tw = $.jqx._rup(box.width());
                var th = $.jqx._rup(box.height() * coeff);
                if (th == 0 && $.jqx.browser.msie && parseInt($.jqx.browser.version) < 9) {
                    var fontSize = box.css('font-size');
                    if (fontSize) {
                        th = parseInt(fontSize);
                        if (isNaN(th)) th = 0;
                    }
                }

                txt.removeChild(txtNode);

                textPartsInfo.width = Math.max(textPartsInfo.width, tw);
                textPartsInfo.height += th + (i > 0 ? 2 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }

            parent.removeChild(txt);

            return textPartsInfo;
        },

        _measureText: function (text, angle, params, includeTextPartsInfo) {
            if (Math.abs(angle) > 45)
                angle = 90;
            else
                angle = 0;

            return $.jqx.commonRenderer.measureText(text, angle, params, includeTextPartsInfo, this);
        },


        measureText: function (text, angle, params) {
            return this._measureText(text, angle, params, false);
        },

        //[optimize]
        text: function (text, x, y, width, height, angle, params, clip, halign, valign) {
            var color;
            if (params && params.stroke)
                color = params.stroke;

            if (color == undefined)
                color = 'black';

            var sz = this._measureText(text, angle, params, true);
            var textPartsInfo = sz.textPartsInfo;
            var textParts = textPartsInfo.parts;
            var tw = sz.width;
            var th = sz.height;

            if (isNaN(width) || width == 0)
                width = tw;
            if (isNaN(height) || height == 0)
                height = th;


            var gClip;

            if (!halign)
                halign = 'center';
            if (!valign)
                valign = 'center';

            if (textParts.length > 0 || clip) {
                gClip = this.beginGroup();
            }

            if (clip) {
                var crect = this.createClipRect({ x: $.jqx._rup(x), y: $.jqx._rup(y), width: $.jqx._rup(width), height: $.jqx._rup(height) });
                this.setClip(gClip, crect);
            }

            var parent = this._activeParent();

            var w = width || 0;
            var h = height || 0;

            if (Math.abs(angle) > 45) {
                angle = 90;
            }
            else
                angle = 0;

            var xAdj = 0, yAdj = 0;

            if (halign == 'center')
                xAdj += (w - tw) / 2;
            else if (halign == 'right')
                xAdj += (w - tw);

            if (valign == 'center')
                yAdj = (h - th) / 2;
            else if (valign == 'bottom')
                yAdj = h - th;

            if (angle == 0) {
                y += th + yAdj;
                x += xAdj;
            }
            else {
                x += tw + xAdj;
                y += yAdj;
            }
            ///////////////
            var yOffset = 0, xOffset = 0;

            var textPartBox;
            for (var i = textParts.length - 1; i >= 0; i--) {
                var textPart = textParts[i];

                var wAdj = (tw - textPart.width) / 2;
                if (angle == 0 && halign == 'left')
                    wAdj = 0;
                else if (angle == 0 && halign == 'right')
                    wAdj = tw - textPart.width;
                else if (angle == 90)
                    wAdj = (th - textPart.width) / 2;

                var hAdj = yOffset - textPart.height;

                yAdj = angle == 90 ? wAdj : hAdj;
                xAdj = angle == 90 ? hAdj : wAdj;

                textPartBox = document.createElement('v:textbox');
                textPartBox.style.position = 'absolute';
                textPartBox.style.left = $.jqx._rup(x + xAdj);
                textPartBox.style.top = $.jqx._rup(y + yAdj);
                textPartBox.style.width = $.jqx._rup(textPart.width);
                textPartBox.style.height = $.jqx._rup(textPart.height);
                if (angle == 90)
                    textPartBox.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';

                var span = document.createElement('span');
                span.appendChild(document.createTextNode(textPart.text));
                if (params && params['class']) {
                    span.className = params['class'];
                }
                textPartBox.appendChild(span);
                parent.appendChild(textPartBox);

                yOffset -= textPart.height + (i > 0 ? 2 : 0);
            }

            if (gClip) {
                this.endGroup();
                return parent;
            }

            return textPartBox;
        },

        //[optimize]
        shape: function (name, params) {
            var s = document.createElement(this._createElementMarkup(name));
            if (!s)
                return undefined;

            for (var param in params)
                s.setAttribute(param, params[param]);

            this._activeParent().appendChild(s);

            return s;
        },

        line: function (x1, y1, x2, y2, params) {
            var linePath = 'M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2 + ' X E';
            var line = this.path(linePath);
            this.attr(line, params);
            return line;
        },

        _createElementMarkup: function (shape) {
            var str = '<v:' + shape + ' style=\"\">' + '</v:' + shape + '>';
            if (this._ie8mode) {
                str = str.replace('style=\"\"', 'style=\"behavior: url(#default#VML);\"');
            }

            return str;
        },

        //[optimize]
        path: function (points, params) {
            var shape = document.createElement(this._createElementMarkup('shape'));
            shape.style.position = 'absolute';
            shape.coordsize = this._width + ' ' + this._height;
            shape.coordorigin = '0 0';
            shape.style.width = parseInt(this._width);
            shape.style.height = parseInt(this._height);
            shape.style.left = 0 + 'px';
            shape.style.top = 0 + 'px';
            shape.setAttribute("path", points);

            this._activeParent().appendChild(shape);
            if (params)
                this.attr(shape, params);

            return shape;
        },

        //[optimize]
        rect: function (x, y, w, h, params) {
            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);
            w = $.jqx._rup(w);
            h = $.jqx._rup(h);
            var vmlRect = this.shape('rect', params);
            vmlRect.style.position = 'absolute';
            vmlRect.style.left = x;
            vmlRect.style.top = y;
            vmlRect.style.width = w;
            vmlRect.style.height = h;
            vmlRect.strokeweight = 0;
            if (params)
                this.attr(vmlRect, params);

            return vmlRect;
        },

        //[optimize]
        circle: function (x, y, r, params) {
            var vmlCircle = this.shape('oval');
            x = $.jqx._ptrnd(x - r);
            y = $.jqx._ptrnd(y - r);
            r = $.jqx._rup(r);
            vmlCircle.style.position = 'absolute';
            vmlCircle.style.left = x;
            vmlCircle.style.top = y;
            vmlCircle.style.width = r * 2;
            vmlCircle.style.height = r * 2;
            if (params)
                this.attr(vmlCircle, params);

            return vmlCircle;
        },

        updateCircle: function (circle, x, y, r) {
            if (x == undefined)
                x = parseFloat(circle.style.left) + parseFloat(circle.style.width) / 2;
            if (y == undefined)
                y = parseFloat(circle.style.top) + parseFloat(circle.style.height) / 2;
            if (r == undefined)
                r = parseFloat(circle.width) / 2;

            x = $.jqx._ptrnd(x - r);
            y = $.jqx._ptrnd(y - r);
            r = $.jqx._rup(r);
            circle.style.left = x;
            circle.style.top = y;
            circle.style.width = r * 2;
            circle.style.height = r * 2;
        },

        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            if (!outerRadius)
                outerRadius = 1;

            var diff = Math.abs(angleFrom - angleTo);
            var lFlag = diff > 180 ? 1 : 0;
            if (diff > 360) {
                angleFrom = 0;
                angleTo = 360;
            }
            var radFrom = angleFrom * Math.PI * 2 / 360;
            var radTo = angleTo * Math.PI * 2 / 360;

            var x1 = x, x2 = x, y1 = y, y2 = y;
            var isDonut = !isNaN(innerRadius) && innerRadius > 0;

            if (isDonut)
                centerOffset = 0;

            if (centerOffset > 0) {
                var midAngle = diff / 2 + angleFrom;
                var radMid = midAngle * Math.PI * 2 / 360;

                x += centerOffset * Math.cos(radMid);
                y -= centerOffset * Math.sin(radMid);
            }

            if (isDonut) {
                var inR = innerRadius;
                x1 = $.jqx._ptrnd(x + inR * Math.cos(radFrom));
                y1 = $.jqx._ptrnd(y - inR * Math.sin(radFrom));
                x2 = $.jqx._ptrnd(x + inR * Math.cos(radTo));
                y2 = $.jqx._ptrnd(y - inR * Math.sin(radTo));
            }

            var x3 = $.jqx._ptrnd(x + outerRadius * Math.cos(radFrom));
            var x4 = $.jqx._ptrnd(x + outerRadius * Math.cos(radTo));
            var y3 = $.jqx._ptrnd(y - outerRadius * Math.sin(radFrom));
            var y4 = $.jqx._ptrnd(y - outerRadius * Math.sin(radTo));

            outerRadius = $.jqx._ptrnd(outerRadius);
            innerRadius = $.jqx._ptrnd(innerRadius);

            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);

            var aStart = Math.round(angleFrom * 65535);
            var aEnd = Math.round((angleTo - angleFrom) * 65536);

            if (innerRadius < 0)
                innerRadius = 1;

            var path = '';
            if (isDonut) {
                path = 'M' + x1 + ' ' + y1;
                path += ' AE ' + x + ' ' + y + ' ' + innerRadius + ' ' + innerRadius + ' ' + aStart + ' ' + aEnd;
                path += ' L ' + x4 + ' ' + y4;

                aStart = Math.round((angleFrom - angleTo) * 65535);
                aEnd = Math.round(angleTo * 65536);

                path += ' AE ' + x + ' ' + y + ' ' + outerRadius + ' ' + outerRadius + ' ' + aEnd + ' ' + aStart;
                path += ' L ' + x1 + ' ' + y1;
            }
            else {
                path = 'M' + x + ' ' + y;
                path += ' AE ' + x + ' ' + y + ' ' + outerRadius + ' ' + outerRadius + ' ' + aStart + ' ' + aEnd;
            }

            path += ' X E';

            return path;
        },

        pieslice: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {

            var pathCmd = this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);
            var el = this.path(pathCmd, params);

            if (params)
                this.attr(el, params);

            return el;
        },


        _keymap: [
                { svg: 'fill', vml: 'fillcolor' },
                { svg: 'stroke', vml: 'strokecolor' },
                { svg: 'stroke-width', vml: 'strokeweight' },
                { svg: 'stroke-dasharray', vml: 'dashstyle' },
                { svg: 'fill-opacity', vml: 'fillopacity' },
                { svg: 'stroke-opacity', vml: 'strokeopacity' },
                { svg: 'opacity', vml: 'opacity' },
                { svg: 'cx', vml: 'style.left' },
                { svg: 'cy', vml: 'style.top' },
                { svg: 'height', vml: 'style.height' },
                { svg: 'width', vml: 'style.width' },
                { svg: 'x', vml: 'style.left' },
                { svg: 'y', vml: 'style.top' },
                { svg: 'd', vml: 'v' },
                { svg: 'display', vml: 'style.display' }
                ],

        //[optimize]
        _translateParam: function (name) {
            for (var key in this._keymap) {
                if (this._keymap[key].svg == name)
                    return this._keymap[key].vml;
            }

            return name;
        },

        //[optimize]
        attr: function (element, params) {
            if (!element || !params)
                return;
            for (var param in params) {
                var vmlparam = this._translateParam(param);
                if (vmlparam == 'fillcolor' && params[param].indexOf('grd') != -1) {
                    element.type = params[param];
                }
                else if (vmlparam == 'opacity' || vmlparam == 'fillopacity') {
                    if (element.fill) {
                        element.fill.opacity = params[param];
                    }
                }
                else if (vmlparam == 'textContent') {
                    element.children[0].innerText = params[param];
                }
                else if (vmlparam == 'dashstyle') {
                    element.dashstyle = params[param].replace(',', ' ');
                }
                else {
                    if (vmlparam.indexOf('style.') == -1)
                        element[vmlparam] = params[param];
                    else
                        element.style[vmlparam.replace('style.', '')] = params[param];
                }
            }
        },

        //[optimize]
        getAttr: function (element, key) {
            var vmlparam = this._translateParam(key);
            if (vmlparam == 'opacity' || vmlparam == 'fillopacity')
                if (element.fill) {
                    return element.fill.opacity;
                }
                else {
                    return 1;
                }

            if (vmlparam.indexOf('style.') == -1)
                return element[vmlparam];

            return element.style[vmlparam.replace('style.', '')];
        },

        //[optimize]
        _gradients: {},

        _toRadialGradient: function (color, isVertical, stops) {
            return color;
        },

        //[optimize]
        _toLinearGradient: function (color, isVertical, stops) {
            if (this._ie8mode) {
                return color;
            }

            var id = 'grd' + color.replace('#', '') + (isVertical ? 'v' : 'h');
            var ref = '#' + id + '';
            if (this._gradients[ref])
                return ref;

            var gr = document.createElement(this._createElementMarkup('fill'));
            gr.type = 'gradient';
            gr.method = 'linear';
            gr.angle = isVertical ? 0 : 90;

            var colors = '';
            for (var stop in stops) {
                if (stop > 0)
                    colors += ', ';
                colors += stops[stop][0] + '% ' + $.jqx._adjustColor(color, stops[stop][1]);
            }

            gr.colors = colors;

            var shapetype = document.createElement(this._createElementMarkup('shapetype'));
            shapetype.appendChild(gr);
            shapetype.id = id;

            this.canvas.appendChild(shapetype);

            return ref;
        }
    } // vmlRenderer

    /************************************************
    * jQWidgets HTML5 Canvas Renderer               *
    ************************************************/
    $.jqx.HTML5Renderer = function () { }

    $.jqx.ptrnd = function (val) {
        if (Math.abs(Math.round(val) - val) == 0.5)
            return val;

        var rnd = Math.round(val);
        if (rnd < val)
            rnd = rnd - 1;

        return rnd + 0.5;
    }


    $.jqx.HTML5Renderer.prototype = {
        _elements: {},

        init: function (host) {
            try {
                this.host = host;
                this.host.append("<canvas id='__jqxCanvasWrap' style='width:100%; height: 100%;'/>");
                this.canvas = host.find('#__jqxCanvasWrap');
                this.canvas[0].width = host.width();
                this.canvas[0].height = host.height();
                this.ctx = this.canvas[0].getContext('2d');
            }
            catch (e) {
                return false;
            }

            return true;
        },

        getContainer: function () {
            if (this.canvas && this.canvas.length == 1)
                return this.canvas;

            return undefined;
        },


        getRect: function () {
            return { x: 0, y: 0, width: this.canvas[0].width - 1, height: this.canvas[0].height - 1 };
        },

        beginGroup: function () {
        },

        endGroup: function () {
        },

        setClip: function () {
        },

        createClipRect: function (rect) {
        },

        addHandler: function (element, event, fn) {
            // TODO
            //element['on' + event] = fn;
        },

        clear: function () {
            this._elements = {};
            this._maxId = 0;
            this._renderers._gradients = {};
            this._gradientId = 0;
        },

        removeElement: function (element) {
            if (undefined == element)
                return;
            if (this._elements[element.id])
                delete this._elements[element.id];
        },

        _maxId: 0,

        shape: function (name, params) {
            var s = { type: name, id: this._maxId++ };

            for (var param in params)
                s[param] = params[param];

            this._elements[s.id] = s;

            return s;
        },

        attr: function (element, params) {
            for (var param in params)
                element[param] = params[param];
        },

        rect: function (x, y, w, h, params) {
            if (isNaN(x))
                throw 'Invalid value for "x"';
            if (isNaN(y))
                throw 'Invalid value for "y"';
            if (isNaN(w))
                throw 'Invalid value for "width"';
            if (isNaN(h))
                throw 'Invalid value for "height"';

            var s = this.shape('rect', { x: x, y: y, width: w, height: h });
            if (params)
                this.attr(s, params);
            return s;
        },

        path: function (pathCmd, params) {
            var s = this.shape('path', params);
            this.attr(s, { d: pathCmd });
            return s;
        },

        line: function (x1, y1, x2, y2, params) {
            return this.path('M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2, params);
        },

        circle: function (x, y, r, params) {
            var s = this.shape('circle', { x: x, y: y, r: r });
            if (params)
                this.attr(s, params);
            return s;
        },

        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            return $.jqx.commonRenderer.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);
        },

        pieslice: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
            var element = this.path(this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset), params);
            this.attr(element, { x: x, y: y, innerRadius: innerRadius, outerRadius: outerRadius, angleFrom: angleFrom, angleTo: angleTo });
            return element;
        },

        //[optimize]
        _getCSSStyle: function (name) {
            var sheets = document.styleSheets;
            try {
                for (var i = 0; i < sheets.length; i++) {
                    for (var j = 0; sheets[i].cssRules && j < sheets[i].cssRules.length; j++) {
                        if (sheets[i].cssRules[j].selectorText.indexOf(name) != -1)
                            return sheets[i].cssRules[j].style;
                    }
                }
            }
            catch (e) {
            }

            return {};
        },

        //[optimize]
        _getTextParts: function (text, angle, params) {
            var fontFamily = 'Arial';
            var fontSize = '10pt';
            var fontWeight = '';
            if (params && params['class']) {
                var style = this._getCSSStyle(params['class']);
                if (style['fontSize'])
                    fontSize = style['fontSize'];
                if (style['fontFamily'])
                    fontFamily = style['fontFamily'];
                if (style['fontWeight'])
                    fontWeight = style['fontWeight'];
            }

            this.ctx.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

            var textPartsInfo = { width: 0, height: 0, parts: [] };

            var coeff = 0.6;
            var textParts = text.toString().split('<br>');
            for (var i = 0; i < textParts.length; i++) {
                var textPart = textParts[i];

                var tw = this.ctx.measureText(textPart).width;

                var span = document.createElement("span");
                span.font = this.ctx.font;
                span.textContent = textPart;
                document.body.appendChild(span);
                var th = span.offsetHeight * coeff;
                document.body.removeChild(span);

                textPartsInfo.width = Math.max(textPartsInfo.width, $.jqx._rup(tw));
                textPartsInfo.height += th + (i > 0 ? 4 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }

            return textPartsInfo;
        },

        _measureText: function (text, angle, params, includeTextPartsInfo) {
            return $.jqx.commonRenderer.measureText(text, angle, params, includeTextPartsInfo, this);
        },

        measureText: function (text, angle, params) {
            return this._measureText(text, angle, params, false);
        },

        text: function (text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
            var t = this.shape('text', { text: text, x: x, y: y, width: width, height: height, angle: angle, clip: clip, halign: halign, valign: valign, rotateAround: rotateAround });
            if (params)
                this.attr(t, params);

            t.fontFamily = 'Arial';
            t.fontSize = '10pt';
            t.fontWeight = '';
            t.color = '#000000';
            if (params && params['class']) {
                var style = this._getCSSStyle(params['class']);
                t.fontFamily = style.fontFamily || t.fontFamily;
                t.fontSize = style.fontSize || t.fontSize;
                t.fontWeight = style['fontWeight'] || t.fontWeight;
                t.color = style.color || t.color;
            }

            var sz = this._measureText(text, 0, params, true);
            this.attr(t, { textPartsInfo: sz.textPartsInfo, textWidth: sz.width, textHeight: sz.height });

            if (width <= 0 || isNaN(width))
                this.attr(t, { width: sz.width });

            if (height <= 0 || isNaN(height))
                this.attr(t, { height: sz.height });

            return t;
        },

        _toLinearGradient: function (color, isVertical, stops) {
            if (this._renderers._gradients[color])
                return color;

            var colorStops = [];
            for (var i = 0; i < stops.length; i++)
                colorStops.push({ percent: stops[i][0] / 100, color: $.jqx._adjustColor(color, stops[i][1]) });

            var name = 'gr' + this._gradientId++;
            this.createGradient(name, isVertical ? 'vertical' : 'horizontal', colorStops);
            return name;
        },

        _toRadialGradient: function (color, stops) {
            if (this._renderers._gradients[color])
                return color;

            var colorStops = [];
            for (var i = 0; i < stops.length; i++)
                colorStops.push({ percent: stops[i][0] / 100, color: $.jqx._adjustColor(color, stops[i][1]) });

            var name = 'gr' + this._gradientId++;
            this.createGradient(name, 'radial', colorStops);
            return name;
        },

        _gradientId: 0,

        //[optimize]
        createGradient: function (name, orientation, colorStops) {
            this._renderers.createGradient(name, orientation, colorStops);
        },

        _renderers: {
            _gradients: {},

            //[optimize]
            createGradient: function (name, orientation, colorStops) {
                this._gradients[name] = { orientation: orientation, colorStops: colorStops };
            },

            setStroke: function (ctx, params) {
                ctx.strokeStyle = params['stroke'] || 'transparent';
                ctx.lineWidth = params['stroke-width'] || 1;
                if (params['fill-opacity']) {
                    ctx.globalAlpha = params['fill-opacity'];
                }
                else {
                    ctx.globalAlpha = 1;
                }

                if (ctx.setLineDash) {
                    if (params['stroke-dasharray'])
                        ctx.setLineDash(params['stroke-dasharray'].split(','));
                    else
                        ctx.setLineDash([]);
                }
            },

            setFillStyle: function (ctx, params) {
                ctx.fillStyle = 'transparent';

                if (params['fill-opacity']) {
                    ctx.globalAlpha = params['fill-opacity'];
                }
                else {
                    ctx.globalAlpha = 1;
                }

                if (params.fill && params.fill.indexOf('#') == -1 && this._gradients[params.fill]) {
                    var isVertical = this._gradients[params.fill].orientation != 'horizontal';
                    var isRadial = this._gradients[params.fill].orientation == 'radial';
                    var x1 = $.jqx.ptrnd(params.x);
                    var y1 = $.jqx.ptrnd(params.y);
                    var x2 = $.jqx.ptrnd(params.x + (isVertical ? 0 : params.width));
                    var y2 = $.jqx.ptrnd(params.y + (isVertical ? params.height : 0));

                    var gradient;

                    if ((params.type == 'circle' || params.type == 'path') && isRadial) {
                        x = $.jqx.ptrnd(params.x);
                        y = $.jqx.ptrnd(params.y);
                        r1 = params.innerRadius || 0;
                        r2 = params.outerRadius || params.r || 0;
                        gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
                    }

                    if (!isRadial) {
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                            x1 = 0;
                            y1 = 0;
                            x2 = isVertical ? 0 : ctx.canvas.width;
                            y2 = isVertical ? ctx.canvas.height : 0;
                        }

                        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    }

                    var colorStops = this._gradients[params.fill].colorStops;
                    for (var i = 0; i < colorStops.length; i++)
                        gradient.addColorStop(colorStops[i].percent, colorStops[i].color);

                    ctx.fillStyle = gradient;
                }
                else if (params.fill) {
                    ctx.fillStyle = params.fill;
                }
            },

            rect: function (ctx, params) {
                if (params.width == 0 || params.height == 0)
                    return;
                ctx.fillRect($.jqx.ptrnd(params.x), $.jqx.ptrnd(params.y), params.width, params.height);
                ctx.strokeRect($.jqx.ptrnd(params.x), $.jqx.ptrnd(params.y), params.width, params.height);
            },

            circle: function (ctx, params) {
                if (params.r == 0)
                    return;
                ctx.beginPath();
                ctx.arc($.jqx.ptrnd(params.x), $.jqx.ptrnd(params.y), params.r, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            },

            _parsePoint: function (str) {
                var x = this._parseNumber(str);
                var y = this._parseNumber(str);
                return ({ x: x, y: y });
            },

            _parseNumber: function (str) {
                var numStarted = false;
                for (var i = this._pos; i < str.length; i++) {
                    if ((str[i] >= '0' && str[i] <= '9') || str[i] == '.' || (str[i] == '-' && !numStarted)) {
                        numStarted = true;
                        continue;
                    }
                    if (!numStarted && (str[i] == ' ' || str[i] == ',')) {
                        this._pos++;
                        continue;
                    }

                    break;
                }

                var val = parseFloat(str.substring(this._pos, i));
                if (isNaN(val))
                    return undefined;

                this._pos = i;
                return val;
            },

            _pos: 0,
            _cmds: "mlcaz",
            _lastCmd: '',

            _isRelativeCmd: function (cmd) {
                return $.jqx.string.contains(this._cmds, cmd);
            },

            _parseCmd: function (string) {
                for (var i = this._pos; i < string.length; i++) {
                    if ($.jqx.string.containsIgnoreCase(this._cmds, string[i])) {
                        this._pos = i + 1;
                        this._lastCmd = string[i];
                        return this._lastCmd;
                    }
                    if (string[i] == ' ') {
                        this._pos++;
                        continue;
                    }
                    if (string[i] >= '0' && string[i] <= '9') {
                        this._pos = i /*+ 1*/;
                        if (this._lastCmd == '')
                            break;
                        else
                            return this._lastCmd;
                    }
                }

                return undefined;
            },

            _toAbsolutePoint: function (point) {
                return { x: this._currentPoint.x + point.x, y: this._currentPoint.y + point.y };
            },

            _currentPoint: { x: 0, y: 0 },

            path: function (ctx, params) {
                var path = params.d;

                this._pos = 0;
                this._lastCmd = '';

                var firstPoint = undefined;
                this._currentPoint = { x: 0, y: 0 };

                ctx.beginPath();

                var i = 0;
                while (this._pos < path.length) {
                    var cmd = this._parseCmd(path);
                    if (cmd == undefined)
                        break;

                    if (cmd == 'M' || cmd == 'm') {
                        var point = this._parsePoint(path);
                        if (point == undefined)
                            break;
                        ctx.moveTo(point.x, point.y);
                        this._currentPoint = point;
                        if (firstPoint == undefined)
                            firstPoint = point;

                        continue;
                    }

                    if (cmd == 'L' || cmd == 'l') {
                        var point = this._parsePoint(path);
                        if (point == undefined)
                            break;

                        ctx.lineTo(point.x, point.y);
                        this._currentPoint = point;
                        continue;
                    }

                    if (cmd == 'A' || cmd == 'a') {
                        var rx = this._parseNumber(path);
                        var ry = this._parseNumber(path);
                        var angle = this._parseNumber(path) * (Math.PI / 180.0);
                        var largeFlag = this._parseNumber(path);
                        var sweepFlag = this._parseNumber(path);
                        var endPoint = this._parsePoint(path);

                        if (this._isRelativeCmd(cmd)) {
                            endPoint = this._toAbsolutePoint(endPoint);
                        }

                        if (rx == 0 || ry == 0)
                            continue;

                        var cp = this._currentPoint;

                        /// START
                        // x1', y1'
                        var cp2 = {
                            x: Math.cos(angle) * (cp.x - endPoint.x) / 2.0 + Math.sin(angle) * (cp.y - endPoint.y) / 2.0,
                            y: -Math.sin(angle) * (cp.x - endPoint.x) / 2.0 + Math.cos(angle) * (cp.y - endPoint.y) / 2.0
                        };

                        // adjust radii
                        var adj = Math.pow(cp2.x, 2) / Math.pow(rx, 2) + Math.pow(cp2.y, 2) / Math.pow(ry, 2);
                        if (adj > 1) {
                            rx *= Math.sqrt(adj);
                            ry *= Math.sqrt(adj);
                        }

                        // cx', cy'
                        var s = (largeFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(cp2.y, 2)) - (Math.pow(ry, 2) * Math.pow(cp2.x, 2))) /
								(Math.pow(rx, 2) * Math.pow(cp2.y, 2) + Math.pow(ry, 2) * Math.pow(cp2.x, 2))
							);

                        if (isNaN(s))
                            s = 0;

                        var cp3 = { x: s * rx * cp2.y / ry, y: s * -ry * cp2.x / rx };

                        // cx, cy
                        var centerPoint = {
                            x: (cp.x + endPoint.x) / 2.0 + Math.cos(angle) * cp3.x - Math.sin(angle) * cp3.y,
                            y: (cp.y + endPoint.y) / 2.0 + Math.sin(angle) * cp3.x + Math.cos(angle) * cp3.y
                        };

                        // vector magnitude
                        var m = function (v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }

                        // ratio between two vectors
                        var r = function (u, v) { return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v)) }

                        // angle between two vectors
                        var a = function (u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v)); }

                        // initial angle
                        var startAngle = a([1, 0], [(cp2.x - cp3.x) / rx, (cp2.y - cp3.y) / ry]);

                        // angle delta
                        var u = [(cp2.x - cp3.x) / rx, (cp2.y - cp3.y) / ry];
                        var v = [(-cp2.x - cp3.x) / rx, (-cp2.y - cp3.y) / ry];
                        var deltaAngle = a(u, v);
                        if (r(u, v) <= -1)
                            deltaAngle = Math.PI;

                        if (r(u, v) >= 1)
                            deltaAngle = 0;

                        if (sweepFlag == 0 && deltaAngle > 0)
                            deltaAngle = deltaAngle - 2 * Math.PI;

                        if (sweepFlag == 1 && deltaAngle < 0)
                            deltaAngle = deltaAngle + 2 * Math.PI;

                        var r = (rx > ry) ? rx : ry;
                        var sx = (rx > ry) ? 1 : rx / ry;
                        var sy = (rx > ry) ? ry / rx : 1;

                        ctx.translate(centerPoint.x, centerPoint.y);
                        ctx.rotate(angle);
                        ctx.scale(sx, sy);
                        ctx.arc(0, 0, r, startAngle, startAngle + deltaAngle, 1 - sweepFlag);
                        ctx.scale(1 / sx, 1 / sy);
                        ctx.rotate(-angle);

                        ctx.translate(-centerPoint.x, -centerPoint.y);

                        continue;
                    }

                    if ((cmd == 'Z' || cmd == 'z') && firstPoint != undefined) {
                        ctx.lineTo(firstPoint.x, firstPoint.y);
                        this._currentPoint = firstPoint;
                        continue;
                    }

                    if (cmd == 'C' || cmd == 'c') {
                        var p1 = this._parsePoint(path);
                        var p2 = this._parsePoint(path);
                        var p3 = this._parsePoint(path);

                        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                        this._currentPoint = p3;
                        continue;
                    }

                }

                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            },

            text: function (ctx, params) {
                var x = $.jqx.ptrnd(params.x);
                var y = $.jqx.ptrnd(params.y);
                var width = $.jqx.ptrnd(params.width);
                var height = $.jqx.ptrnd(params.height);
                var halign = params.halign;
                var valign = params.valign;
                var angle = params.angle;
                var rotateAround = params.rotateAround;
                var textPartsInfo = params.textPartsInfo;
                var textParts = textPartsInfo.parts;

                var clip = params.clip;
                if (clip == undefined)
                    clip = true;

                ctx.save();

                if (!halign)
                    halign = 'center';
                if (!valign)
                    valign = 'center';

                if (clip) {
                    ctx.rect(x, y, width, height);
                    ctx.clip();
                }

                var tw = params.textWidth;
                var th = params.textHeight;

                var w = width || 0;
                var h = height || 0;

                ctx.fillStyle = params.color;
                ctx.font = params.fontWeight + ' ' + params.fontSize + ' ' + params.fontFamily;

                if (!angle || angle == 0) {
                    y += th;

                    if (valign == 'center')
                        y += (h - th) / 2;
                    else if (valign == 'bottom')
                        y += h - th;

                    if (!width)
                        width = tw;

                    if (!height)
                        height = th;

                    var yOffset = 0;

                    for (var i = textParts.length - 1; i >= 0; i--) {
                        var textPart = textParts[i];
                        var xOffset = x;
                        var wPart = textParts[i].width;
                        var hPart = textParts[i].height;

                        if (halign == 'center')
                            xOffset += (w - wPart) / 2;
                        else if (halign == 'right')
                            xOffset += (w - wPart);

                        ctx.fillText(textPart.text, xOffset, y + yOffset);
                        yOffset -= textPart.height + (i > 0 ? 4 : 0);
                    }
                    ctx.restore();
                    return;
                }

                var point = $.jqx.commonRenderer.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
                x = point.x;
                y = point.y;

                var rads = angle * Math.PI * 2 / 360;
                ctx.translate(x, y);
                ctx.rotate(rads);

                var yOffset = 0;
                var maxW = textPartsInfo.width;

                for (var i = textParts.length - 1; i >= 0; i--) {
                    var xOffset = 0;

                    if (halign == 'center')
                        xOffset += (maxW - textParts[i].width) / 2;
                    else if (halign == 'right')
                        xOffset += (maxW - textParts[i].width);

                    ctx.fillText(textParts[i].text, xOffset, yOffset);

                    yOffset -= textParts[i].height + 4;
                }

                ctx.restore();
            }

        },

        refresh: function () {
            this.ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
            for (var element in this._elements) {
                var params = this._elements[element];

                this._renderers.setFillStyle(this.ctx, params);
                this._renderers.setStroke(this.ctx, params);

                this._renderers[this._elements[element].type](this.ctx, params);
            }
        }
    } // End of jQWidgets HTML5 renderer


})(jQuery);
