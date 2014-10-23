KISSY.add('dvix/chart/radar/index', function (S, Chart, Tools, xAxis, yAxis, Back, Graphs) {
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Chart.Canvax;
    return Chart.extend({
        init: function (opt) {
            this.options = { r: 0 };
            this.dataFrame = null;    //数据集合，由_initData 初始化
            //数据集合，由_initData 初始化
            this._xAxis = null;
            this._yAxis = null;
            this._back = null;
            this.stageBg = new Canvax.Display.Sprite({ id: 'bg' });
            this.stage.addChild(this.stageBg);
        },
        draw: function (data, opt) {
            _.deepExtend(this.options, opt);
            var minWorH = Math.min(this.width, this.height);
            if (!this.options.r) {
                this.options.r = minWorH;
            }
            if (this.options.r > minWorH) {
                this.options.r = minWorH;
            }    //初始化数据
            //初始化数据
            this.dataFrame = this._initData(data, this.options);    //初始化模块
            //初始化模块
            this._initModule(this.options, this.dataFrame);    //开始绘图
            //开始绘图
            this._startDraw();    //绘制结束，添加到舞台
            //绘制结束，添加到舞台
            this._drawEnd();
        },
        clear: function () {
            this.stageBg.removeAllChildren();
            this.core.removeAllChildren();
            this.stageTip.removeAllChildren();
        },
        reset: function (data, opt) {
            this.clear();
            this.width = parseInt(this.element.width());
            this.height = parseInt(this.element.height());
            this.draw(data, opt);
        },
        _initModule: function (opt, data) {
            this._xAxis = new xAxis(opt.xAxis, data.xAxis);
            this._yAxis = new yAxis(opt.yAxis, data.yAxis);
            this._back = new Back(opt.back);
            this._graphs = new Graphs(opt.graphs);
        },
        _startDraw: function () {
            //首先
            var x = 0;
            var y = this.height - this._xAxis.h;
            var corePos = {
                    x: this.width / 2 - this.options.r,
                    y: this.height / 2 - this.options.r
                };
            var backAndGraphsOpt = {
                    r: this.options.r,
                    w: this.options.r,
                    h: this.options.r,
                    yDataSection: this._yAxis.dataSection,
                    xDataSection: this._xAxis.dataSection,
                    pos: corePos
                }    //绘制背景网格
;
            //绘制背景网格
            this._back.draw(backAndGraphsOpt);    //绘制雷达图形区域
            //绘制雷达图形区域
            this._graphs.draw(this._yAxis.dataOrg, backAndGraphsOpt);
        },
        _drawEnd: function () {
            this.stageBg.addChild(this._back.sprite);
            this.stageBg.addChild(this._graphs.sprite);
        }
    });
}, {
    requires: [
        'dvix/chart/',
        'dvix/utils/tools',
        './xaxis',
        'dvix/components/yaxis/yAxis',
        './back',
        './graphs',
        'dvix/utils/deep-extend'
    ]
});