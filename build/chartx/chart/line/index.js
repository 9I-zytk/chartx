define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/components/tips/tip"
    ],
    function( Canvax , Line , Circle , Tip ){
        var Tips = function(opt , data , tipDomContainer){
            this.line      = {
                enabled      : 1,
                 //strokeStyle : null
            };
            this.node      = {
                //strokeStyle : null
                //backFillStyle : null
            }

            this.sprite    = null;
            this._line     = null;
            this._nodes    = null;
            this._tip      = null;
            this._isShow   = false;
            this.enabled   = true;

            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
    
                //opt = _.deepExtend({
                //    prefix : data.yAxis.field
                //} , opt);
                
                this._tip = new Tip( opt , tipDomContainer );
    
            },
            show : function(e , tipsPoint){
                if( !this.enabled ) return;
                tipsPoint || ( tipsPoint = {} );
                tipsPoint = _.extend( this._getTipsPoint(e) , tipsPoint );
                
                this._initLine(e , tipsPoint);
                this._initNodes(e , tipsPoint);
    
                this.sprite.addChild(this._tip.sprite);
                this._tip.show(e , tipsPoint);

                this._isShow = true;
            },
            move : function(e){
                if( !this.enabled ) return;
                this._resetStatus(e);
                this._tip.move(e);
            },
            hide : function(e){
                if( !this.enabled ) return;
                this.sprite.removeAllChildren();
                this._line  = null;
                this._nodes = null;
                this._tip.hide(e);

                this._isShow = false;
            },
            _getTipsPoint : function(e){
                return e.target.localToGlobal( e.eventInfo.nodesInfoList[e.eventInfo.iGroup] );
            },
            _resetStatus : function(e){
                var tipsPoint = this._getTipsPoint(e);
                if(this._line){
                    this._line.context.x  = parseInt(tipsPoint.x);
                }
                this._resetNodesStatus(e , tipsPoint);
            },
    
            /**
             * line相关------------------------
             */
            _initLine : function(e , tipsInfo){
                var lineOpt = _.deepExtend({
                    x       : parseInt(tipsInfo.x),
                    y       : tipsInfo.lineTop || e.target.localToGlobal().y,
                    xStart  : 0,
                    yStart  : tipsInfo.lineH || e.target.context.height,
                    xEnd    : 0,
                    yEnd    : 0,
                    lineWidth   : 1,
                    strokeStyle : this.line.strokeStyle || "#cccccc" 
                } , this.line);
                if(this.line.enabled){
                    this._line = new Line({
                        id : "tipsLine",
                        context : lineOpt
                    });
                    this.sprite.addChild( this._line );
                }
            },
    
    
            /**
             *nodes相关-------------------------
             */
            _initNodes : function(e , tipsPoint){
                
                this._nodes = new Canvax.Display.Sprite({
                    id : "line-tipsNodes",
                    context : {
                        x   : parseInt(tipsPoint.x),
                        y   : e.target.localToGlobal().y
                    }
                });
                var self = this;
                _.each( e.eventInfo.nodesInfoList , function( node ){
                    
                    var csp = new Canvax.Display.Sprite({
                        context : {
                            y : e.target.context.height - Math.abs(node.y) 
                        }
                    });
                    csp.addChild( new Circle({
                        context : {
                            r : node.r + 2 + 1 ,
                            fillStyle   : self.node.backFillStyle || "white",//node.fillStyle,
                            strokeStyle : self.node.strokeStyle || node.strokeStyle,
                            lineWidth   : node.lineWidth
                        }
                    }) );

                    csp.addChild( new Circle({
                        context : {
                            r : node.r + 1,
                            fillStyle   : self.node.fillStyle || node.strokeStyle
                        }
                    }) );

                    self._nodes.addChild( csp );
                } );
                this.sprite.addChild( this._nodes );
            },
            _resetNodesStatus : function(e , tipsPoint){
                var self = this;
                if( this._nodes.children.length != e.eventInfo.nodesInfoList.length ){
                    this._nodes.removeAllChildren();
                    this._initNodes( e , tipsPoint );
                }
                this._nodes.context.x = parseInt(tipsPoint.x);
                _.each( e.eventInfo.nodesInfoList , function( node , i ){
                    var csps         = self._nodes.getChildAt(i).context;
                    csps.y           = e.target.context.height - Math.abs(node.y);
                });
            }
        };
        return Tips
    } 
);


define(
    "chartx/chart/line/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            //覆盖xAxisBase 中的 _trimXAxis
            _trimXAxis : function( data , xGraphsWidth ){
                var max  = data.length
                var tmpData = [];
    
                if( max == 1 ){
                    tmpData.push({
                        content : data[0],
                        x       : parseInt( xGraphsWidth / 2 )
                    });
                } else {
                    for (var a = 0, al  = data.length; a < al; a++ ) {
                        var o = {
                            'content':data[a], 
                            'x':parseInt(a / (max - 1) * xGraphsWidth)
                        }
                        tmpData.push( o )
                    }
                }
                return tmpData;
            }
        } );
    
        return xAxis;
    }
);


define(
    "chartx/chart/line/group", [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/colorformat",
        "canvax/animation/Tween",
        "chartx/chart/theme"
    ],
    function(Canvax, BrokenLine, Circle, Path, Tools, ColorFormat, Tween, Theme) {
        window.Canvax = Canvax
        var Group = function(field, a, opt, ctx, sort, yAxis, h, w) {
            this.field = field; //_groupInd在yAxis.field中对应的值
            this._groupInd = a;
            this._nodeInd = -1;
            this._yAxis = yAxis;
            this.sort = sort;
            this.ctx = ctx;
            this.w = w;
            this.h = h;
            this.y = 0;

            this.colors = Theme.colors;

            this.line = { //线
                enabled: 1,
                strokeStyle: this.colors[this._groupInd],
                lineWidth: 2,
                lineType: "solid",
                smooth: true
            };

            this.node = { //节点 
                enabled: 1, //是否有
                corner: false, //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
                r: 2, //半径 node 圆点的半径
                fillStyle: '#ffffff',
                strokeStyle: null,
                lineWidth: 3
            };

            this.fill = { //填充
                fillStyle: null,
                alpha: 0.05
            };

            this.dataOrg = []; //data的原始数据
            this.data = []; //data会在wight中过滤一遍，把两边的空节点剔除
            this.sprite = null;

            this._pointList = []; //brokenline最终的状态
            this._currPointList = []; //brokenline 动画中的当前状态
            this._bline = null;

            this.init(opt)
        };

        Group.prototype = {
            init: function(opt) {
                _.deepExtend(this, opt);

                //如果opt中没有node fill的设置，那么要把fill node 的style和line做同步
                !this.node.strokeStyle && (this.node.strokeStyle = this._getLineStrokeStyle());
                !this.fill.fillStyle && (this.fill.fillStyle = this._getLineStrokeStyle());
                this.sprite = new Canvax.Display.Sprite();
            },
            draw: function(opt) {
                _.deepExtend(this, opt);
                this._widget();
            },
            update: function(opt) {
                _.deepExtend(this, opt);
                this._pointList = this._getPointList(this.data);
                /*
                var list = [];
                for (var a = 0, al = this.data.length; a < al; a++) {
                    var o = this.data[a];
                    list.push([o.x, o.y]);
                };
                this._pointList = list;
                */
                this._grow();
            },
            //自我销毁
            destroy: function() {
                this.sprite.remove();
            },
            //styleType , normals , groupInd
            _getColor: function(s) {
                var color = this._getProp(s);
                if (!color || color == "") {
                    color = this.colors[this._groupInd];
                }
                return color;
            },
            _getProp: function(s) {
                if (_.isArray(s)) {
                    return s[this._groupInd]
                }
                if (_.isFunction(s)) {

                    return s({
                        iGroup: this._groupInd,
                        iNode: this._nodeInd,
                        field: this.field
                    });
                }
                return s
            },
            _getLineStrokeStyle: function() {
                if (this.__lineStyleStyle) {
                    return this.__lineStyleStyle;
                };
                this.__lineStyleStyle = this._getColor(this.line.strokeStyle);
                return this.__lineStyleStyle;
            },
            //这个是tips需要用到的 
            getNodeInfoAt: function($index) {
                var self = this;
                self._nodeInd = $index;
                var o = _.clone(self.dataOrg[$index]);
                if (o && o.value != null && o.value != undefined && o.value !== "") {
                    o.r = self._getProp(self.node.r);
                    o.fillStyle = self._getProp(self.node.fillStyle) || "#ffffff";
                    o.strokeStyle = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle();
                    o.color = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle(); //这个给tips里面的文本用
                    o.lineWidth = self._getProp(self.node.lineWidth) || 2;
                    o.alpha = self._getProp(self.fill.alpha);
                    o.field = self.field;
                    o._groupInd = self._groupInd;
                    // o.fillStyle = '#cc3300'
                    return o
                } else {
                    return null
                }
            },
            resetData: function(opt) {
                var self = this;
                self._pointList = this._getPointList(opt.data);
                var plen = self._pointList.length;
                var cplen = self._currPointList.length;
                if (plen < cplen) {
                    for (var i = plen, l = cplen; i < l; i++) {
                        self._circles.removeChildAt(i);
                        l--;
                        i--;
                    };
                    self._currPointList.length = plen;
                };

                if (plen > cplen) {
                    diffLen = plen - cplen;
                    for (var i = 0; i < diffLen; i++) {
                        self._currPointList.push(_.clone(self._currPointList[cplen - 1]));
                    }
                };

                self._circles && self._circles.removeAllChildren();
                self._createNodes();
                self._grow();
            },
            _grow: function(callback) {
                var self = this;
                var timer = null;
                if (self._currPointList.length == 0) {
                    return;
                }
                var growAnima = function() {
                    var fromObj = self._getPointPosStr(self._currPointList);
                    var toObj = self._getPointPosStr(self._pointList);

                    var bezierT = new Tween.Tween(fromObj)
                        .to(toObj, 1500)
                        .easing(Tween.Easing.Quintic.Out)
                        .onUpdate(function() {

                            for (var p in this) {
                                var ind = parseInt(p.split("_")[2]);
                                var xory = parseInt(p.split("_")[1]);
                                self._currPointList[ind] && (self._currPointList[ind][xory] = this[p]); //p_1_n中间的1代表x or y
                            };

                            self._bline.context.pointList = _.clone(self._currPointList);

                            self._fill.context.path = self._fillLine(self._bline);

                            self._circles && _.each(self._circles.children, function(circle, i) {
                                var ind = parseInt(circle.id.split("_")[1]);
                                circle.context.y = self._currPointList[ind][1];
                                circle.context.x = self._currPointList[ind][0];
                            });

                        }).onComplete(function() {
                            cancelAnimationFrame(timer);
                            callback && callback(self);
                        }).start();
                    animate();
                };

                function animate() {
                    timer = requestAnimationFrame(animate);
                    Tween.update();
                };
                growAnima();

            },
            _getPointPosStr: function(list) {
                var obj = {};
                _.each(list, function(p, i) {
                    obj["p_1_" + i] = p[1]; //p_y==p_1
                    obj["p_0_" + i] = p[0]; //p_x==p_0
                });
                return obj;
            },
            _isNotNum: function(val) {
                return isNaN(val) || val === null || val === ""
            },
            _filterEmptyValue: function(list) {

                //从左边开始 删除 value为非number的item
                for (var i = 0, l = list.length; i < l; i++) {
                    if (this._isNotNum(list[i].value)) {
                        list.shift();
                        l--;
                        i--;
                    } else {
                        break;
                    }
                };

                //从右边开始删除 value为非number的item
                for (var i = list.length - 1; i > 0; i--) {
                    if (this._isNotNum(list[i].value)) {
                        list.pop();
                    } else {
                        break;
                    }
                };
            },
            _getPointList: function(data) {
                var self = this;

                self.dataOrg = _.clone(data);
                self._filterEmptyValue(data);

                var list = [];
                for (var a = 0, al = data.length; a < al; a++) {
                    var o = data[a];
                    list.push([
                        o.x,
                        o.y
                    ]);
                };
                return list;
            },
            _widget: function() {
                var self = this;

                self._pointList = this._getPointList(self.data);

                if (self._pointList.length == 0) {
                    //filter后，data可能length==0
                    return;
                };

                var list = [];

                for (var a = 0, al = self.data.length; a < al; a++) {
                    var o = self.data[a];
                    var sourceInd = 0;
                    //如果是属于双轴中的右轴。
                    if (self._yAxis.place == "right") {
                        sourceInd = al - 1;
                    }
                    list.push([
                        o.x,
                        self.data[sourceInd].y
                    ]);
                };
                self._currPointList = list;

                var bline = new BrokenLine({ //线条
                    id: "brokenline_" + self._groupInd,
                    context: {
                        pointList: list,
                        strokeStyle: self._getLineStrokeStyle(),
                        lineWidth: self.line.lineWidth,
                        y: self.y,
                        smooth: self.line.smooth,
                        lineType: self._getProp(self.line.lineType),
                        //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                        smoothFilter: function(rp) {
                            if (rp[1] > 0) {
                                rp[1] = 0;
                            }
                        }
                    }
                });
                if (!this.line.enabled) {
                    bline.context.visible = false
                }
                self.sprite.addChild(bline);
                self._bline = bline;


                var fill_gradient = null;
                if (_.isArray(self.fill.alpha)) {

                    //alpha如果是数据，那么就是渐变背景，那么就至少要有两个值
                    self.fill.alpha.length = 2;
                    if (self.fill.alpha[0] == undefined) {
                        self.fill.alpha[0] = 0;
                    };
                    if (self.fill.alpha[1] == undefined) {
                        self.fill.alpha[1] = 0;
                    };

                    //从bline中找到最高的点
                    var topP = _.min(bline.context.pointList, function(p) {
                        return p[1]
                    });
                    //创建一个线性渐变
                    fill_gradient = self.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

                    var rgb = ColorFormat.colorRgb(self._getColor(self.fill.fillStyle));
                    var rgba0 = rgb.replace(')', ', ' + self._getProp(self.fill.alpha[0]) + ')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop(0, rgba0);

                    var rgba1 = rgb.replace(')', ', ' + self.fill.alpha[1] + ')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop(1, rgba1);
                }

                var fill = new Path({ //填充
                    context: {
                        path: self._fillLine(bline),
                        fillStyle: fill_gradient || self._getColor(self.fill.fillStyle),
                        globalAlpha: fill_gradient ? 1 : self.fill.alpha //self._getProp( self.fill.alpha )
                    }
                });
                self.sprite.addChild(fill);
                self._fill = fill;

                self._createNodes();

            },
            _createNodes: function() {
                var self = this;
                var list = self._currPointList;
                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if ((self.node.enabled || list.length == 1) && !!self.line.lineWidth) { //拐角的圆点
                    this._circles = new Canvax.Display.Sprite({
                        id: "circles"
                    });
                    this.sprite.addChild(this._circles);
                    for (var a = 0, al = list.length; a < al; a++) {
                        self._nodeInd = a;
                        var strokeStyle = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle();
                        var context = {
                            x: self._currPointList[a][0],
                            y: self._currPointList[a][1],
                            r: self._getProp(self.node.r),
                            fillStyle: list.length == 1 ? strokeStyle : self._getProp(self.node.fillStyle) || "#ffffff",
                            strokeStyle: strokeStyle,
                            lineWidth: self._getProp(self.node.lineWidth) || 2
                        };

                        var sourceInd = 0;
                        if (self._yAxis.place == "right"){
                            sourceInd = al-1;
                        };

                        if( a == sourceInd ){
                            context.fillStyle = context.strokeStyle;
                            context.r ++;
                        }

                        var circle = new Circle({
                            id: "circle_" + a,
                            context: context
                        });

                        if (self.node.corner) { //拐角才有节点
                            var y = self._pointList[a][1];
                            var pre = self._pointList[a - 1];
                            var next = self._pointList[a + 1];
                            if (pre && next) {
                                if (y == pre[1] && y == next[1]) {
                                    circle.context.visible = false;
                                }
                            }
                        };
                        self._circles.addChild(circle);
                    }
                    self._nodeInd = -1
                }
            },
            _fillLine: function(bline) { //填充直线
                var fillPath = _.clone(bline.context.pointList);
                var baseY = 0;
                if (this.sort == "desc") {
                    baseY = -this.h;
                }
                fillPath.push(
                    [fillPath[fillPath.length - 1][0], baseY], [fillPath[0][0], baseY], [fillPath[0][0], fillPath[0][1]]
                );
                return Tools.getPath(fillPath);
            }
        };
        return Group;
    }
)

define(
    "chartx/chart/line/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/line/group"
    ],
    function(Canvax, Rect, Tools, Group) {
        var Graphs = function(opt, root) {
            this.w = 0;
            this.h = 0;
            this.y = 0;

            //这里所有的opt都要透传给group
            this.opt = opt;
            this.root = root;
            this.ctx = root.stage.context2D;
            this.field = null;

            this._yAxisFieldsMap = {};
            this._setyAxisFieldsMap();

            this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]
            this.disX = 0; //点与点之间的间距
            this.groups = []; //群组集合     

            this.iGroup = 0; //群组索引(哪条线)
            this.iNode = -1; //节点索引(那个点)

            this.sprite = null;
            this.induce = null;

            this.init(opt);
        };
        Graphs.prototype = {
            init: function(opt) {
                this.opt = opt;
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            getX: function() {
                return this.sprite.context.x
            },
            getY: function() {
                return this.sprite.context.y
            },

            draw: function(opt) {
                _.deepExtend(this, opt);
                this._widget(opt);
            },
            resetData: function(data, opt) {
                var self = this;
                self.data = data;
                opt && _.deepExtend(self, opt);
                for (var a = 0, al = self.data.length; a < al; a++) {
                    var group = self.groups[a];
                    group.resetData({
                        data: self.data[a]
                    });
                }
            },
            /**
             * 生长动画
             */
            grow: function(callback) {
                _.each(this.groups, function(g, i) {
                    g._grow(callback);
                });
            },
            _setyAxisFieldsMap : function(){
                var me = this;
                _.each( _.flatten( this._getYaxisField() ) , function( field , i ){
                     me._yAxisFieldsMap[ field ] = i;
                });
            },
            _getYaxisField: function(i) {
                //这里要兼容从折柱混合图过来的情况
                if( this.field ){
                    return this.field;
                }
                if (this.root.type && this.root.type.indexOf("line") >= 0) {
                    this.field = this.root._lineChart.dataFrame.yAxis.field;
                } else {
                    this.field = this.root.dataFrame.yAxis.field;
                };
                return this.field;
            },
            /*
             *@params opt
             *@params ind 最新添加的数据所在的索引位置
             **/
            add: function(opt, ind) {
                var self = this;
                _.deepExtend(this, opt);
                var group = new Group(
                    self._getYaxisField()[ind],
                    ind, //_groupInd
                    self.opt,
                    self.ctx
                );

                group.draw({
                    data: ind > self.data.length - 1 ? self.data[self.data.length - 1] : self.data[ind]
                });
                self.sprite.addChildAt(group.sprite, ind);
                self.groups.splice(ind, 0, group);

                _.each(this.groups, function(g, i) {
                    //_groupInd要重新计算
                    g._groupInd = i;
                    g.update({
                        data: self.data[i]
                    });
                });
            },
            /*
             *删除 ind
             **/
            remove: function(i) {
                var target = this.groups.splice(i, 1)[0];
                target.destroy();
            },
            /*
             * 更新下最新的状态
             **/
            update: function(opt) {
                _.deepExtend(this, opt);
                //剩下的要更新下位置
                var self = this;
                _.each(this.groups, function(g, i) {
                    g.update({
                        data: self.data[i]
                    });
                });
            },
            _setGroupsForYfield: function(fields, data, groupInd) {
                var self = this;
                for (var i = 0, l = fields.length; i < l; i++) {
                    var _sort = self.root._yAxis.sort;
                    var _biaxial = self.root.biaxial;
                    var _yAxis = self.root._yAxis;

                    var _groupInd = ((!groupInd && groupInd!==0) ? i : groupInd );

                    //只有biaxial的情况才会有双轴，才会有 下面isArray(fields[i])的情况发生
                    if (_.isArray(fields[i])) {
                        self._setGroupsForYfield(fields[i], data[i], i);
                    } else {
                        if (_.isArray(_sort)) {
                            _sort = (_sort[_groupInd] || "asc");
                        };
                        if (_biaxial) {
                            if (_groupInd > 0) {
                                _yAxis = self.root._yAxisR
                            };
                        };
                        var group = new Group(
                            fields[i],
                            self._yAxisFieldsMap[fields[i]],
                            self.opt,
                            self.ctx,
                            _sort,
                            _yAxis,
                            self.h,
                            self.w
                        );
                        group.draw({
                            data: data[i]
                        });
                        self.sprite.addChild(group.sprite);
                        self.groups.push(group);
                    }
                }
            },
            _widget: function(opt) {
                var self = this;
                self._setGroupsForYfield( self._getYaxisField() , self.data);
                self.induce = new Rect({
                    id: "induce",
                    context: {
                        y: -self.h,
                        width: self.w,
                        height: self.h,
                        fillStyle: '#000000',
                        globalAlpha: 0,
                        cursor: 'pointer'
                    }
                });

                self.sprite.addChild(self.induce);

                self.induce.on("panstart mouseover", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                })
                self.induce.on("panmove mousemove", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                })
                self.induce.on("panend mouseout", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                    self.iGroup = 0, self.iNode = -1
                })
                self.induce.on("tap click", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                })
            },
            _getInfoHandler: function(e) {
                var x = e.point.x,
                    y = e.point.y - this.h;
                //todo:底层加判断
                x = x > this.w ? this.w : x;

                var tmpINode = this.disX == 0 ? 0 : parseInt((x + (this.disX / 2)) / this.disX);

                var _nodesInfoList = []; //节点信息集合

                for (var a = 0, al = this.groups.length; a < al; a++) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode);
                    o && _nodesInfoList.push(o);
                };

                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(_nodesInfoList, "y"));

                this.iGroup = tmpIGroup, this.iNode = tmpINode;
                //iGroup 第几条线   iNode 第几个点   都从0开始
                var node = {
                    iGroup: this.iGroup,
                    iNode: this.iNode,
                    nodesInfoList: _.clone(_nodesInfoList)
                };
                return node;
            }
        };
        return Graphs;
    }
)

define(
    "chartx/chart/line/index", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/chart/line/xaxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        'chartx/components/anchor/Anchor',
        'chartx/chart/line/graphs',
        'chartx/chart/line/tips',
        'chartx/utils/dataformat'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Anchor, Graphs, Tips, dataFormat) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        return Chart.extend({

            init: function(node, data, opts) {
                this._opts = opts;
                this._xAxis = null;
                this._yAxis = null;
                this._anchor = null;
                this._back = null;
                this._graphs = null;
                this._tip = null;

                this.xAxis = {};
                this.yAxis = {};
                this.graphs = {};

                this.biaxial = false;

                this._lineField = null;

                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, this);
            },
            draw: function() {
                this.stageTip = new Canvax.Display.Sprite({
                    id: 'tip'
                });
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });
                this.stageBg = new Canvax.Display.Sprite({
                    id: 'bg'
                });

                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);

                if (this.rotate) {
                    this._rotate(this.rotate);
                }
                this._initModule(); //初始化模块  

                this._startDraw(); //开始绘图

                this.inited = true;

            },
            /*
             * 如果只有数据改动的情况
             */
            resetData: function(data) {
                this.dataFrame = this._initData(data, this);

                this._xAxis.resetData(this.dataFrame.xAxis);
                this._yAxis.resetData(this.dataFrame.yAxis);
                this._graphs.resetData(this._trimGraphs(), {
                    disX: this._getGraphsDisX()
                });

            },
            /*
             *添加一个yAxis字段，也就是添加一条brokenline折线
             *@params field 添加的字段
             *@params ind 添加到哪个位置 默认在最后面
             **/
            add: function(field, ind) {

                if (_.indexOf(this.yAxis.field, field) >= 0) {
                    return;
                }

                var i = 0;
                _.each(this._graphs.groups, function(g, gi) {
                    i = Math.max(i, g._groupInd);
                });
                if (ind != undefined && ind != null) {
                    i = ind;
                };


                //首先，yAxis要重新计算
                if (ind == undefined) {
                    this.yAxis.field.push(field);
                    ind = this.yAxis.field.length - 1;
                } else {
                    this.yAxis.field.splice(ind, 0, field);
                }
                this.dataFrame = this._initData(this.dataFrame.org, this);

                this._yAxis.update(this.yAxis, this.dataFrame.yAxis);

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis: {
                        data: this._yAxis.layoutData
                    }
                });

                this._graphs.add({
                    data: this._trimGraphs()
                }, ind);
                //this._graphs.update();


            },
            /*
             *删除一个yaxis字段，也就是删除一条brokenline线
             *@params target 也可以是字段名字，也可以是 index
             **/
            remove: function(target) {
                var ind = null;
                if (_.isNumber(target)) {
                    //说明是索引
                    ind = target;
                } else {
                    //说明是名字，转换为索引
                    ind = _.indexOf(this.yAxis.field, target);
                };
                if (ind != null && ind != undefined && ind != -1) {
                    this._remove(ind);
                };
            },
            _remove: function(ind) {
                //首先，yAxis要重新计算
                //先在dataFrame中更新yAxis的数据
                this.dataFrame.yAxis.field.splice(ind, 1);
                this.dataFrame.yAxis.org.splice(ind, 1);
                //this.yAxis.field.splice(ind , 1);

                this._yAxis.update(this.yAxis, this.dataFrame.yAxis);

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis: {
                        data: this._yAxis.layoutData
                    }
                });
                //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
                this._graphs.remove(ind);
                this._graphs.update({
                    data: this._trimGraphs()
                });
            },
            _initData: dataFormat,
            _initModule: function() {
                this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);
                if (this.biaxial) {
                    this.yAxis.biaxial = true;
                };

                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis);
                //再折线图中会有双轴图表
                if (this.biaxial) {
                    this._yAxisR = new yAxis(_.extend(_.clone(this.yAxis), {
                        place: "right"
                    }), this.dataFrame.yAxis);
                };

                this._back = new Back(this.back);
                this._anchor = new Anchor(this.anchor);
                this._graphs = new Graphs(this.graphs, this);
                this._tip = new Tips(this.tips, this.dataFrame, this.canvax.getDomContainer());

                this.stageBg.addChild(this._back.sprite);
                this.stageBg.addChild(this._anchor.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._yAxis.sprite);
                if (this._yAxisR) {
                    this.core.addChild(this._yAxisR.sprite);
                }
                this.core.addChild(this._graphs.sprite);
                this.stageTip.addChild(this._tip.sprite);
            },
            _startDraw: function() {
                // this.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
                // this.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
                var y = this.height - this._xAxis.h;
                var graphsH = y - this.padding.top;

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: y
                    },
                    yMaxHeight: graphsH
                });

                var _yAxisW = this._yAxis.w;

                //如果有双轴
                var _yAxisRW = 0;
                if (this._yAxisR) {
                    this._yAxisR.draw({
                        pos: {
                            x: 0, //this.padding.right,
                            y: y
                        },
                        yMaxHeight: graphsH
                    });
                    _yAxisRW = this._yAxisR.w;
                    this._yAxisR.setX(this.width - _yAxisRW - this.padding.right + 1);
                };

                //绘制x轴
                this._xAxis.draw({
                    graphh: this.height,
                    graphw: this.width - _yAxisRW - this.padding.right,
                    yAxisW: _yAxisW
                });
                if (this._xAxis.yAxisW != _yAxisW) {
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth(this._xAxis.yAxisW);
                    _yAxisW = this._xAxis.yAxisW;
                };

                var _graphsH = this._yAxis.yGraphsHeight;
                //Math.abs(this._yAxis.layoutData[ 0 ].y - this._yAxis.layoutData.slice(-1)[0].y);

                //绘制背景网格
                this._back.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: _graphsH,
                    xAxis: {
                        data: this._yAxis.layoutData
                    },
                    yAxis: {
                        data: this._xAxis.layoutData
                    },
                    yOrigin: {
                        biaxial: this.biaxial
                    },
                    pos: {
                        x: _yAxisW,
                        y: y
                    }
                });

                this._graphs.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    data: this._trimGraphs(),
                    disX: this._getGraphsDisX(),
                    smooth: this.smooth,
                    inited: this.inited
                });

                this._graphs.setX(_yAxisW), this._graphs.setY(y);

                var me = this;


                //如果是双轴折线，那么graphs之后，还要根据graphs中的两条折线的颜色，来设置左右轴的颜色
                /*
                if (this.biaxial) {
                    _.each(this._graphs.groups, function(group, i) {
                        var color = group._bline.context.strokeStyle;
                        if (i == 0) {
                            me._yAxis.setAllStyle(color);
                        } else {
                            me._yAxisR.setAllStyle(color);
                        }
                    });
                }
                */

                //执行生长动画
                if (!this.inited) {
                    this._graphs.grow(function(g) {
                        me._initPlugs(me._opts, g);
                    });
                };

                this.bindEvent(this._graphs.sprite);


                if (this._anchor.enabled) {
                    //绘制点位线
                    var pos = this._getPosAtGraphs(this._anchor.xIndex, this._anchor.num);

                    this._anchor.draw({
                        w: this._xAxis.xGraphsWidth, //this.width - _yAxisW - _yAxisRW,
                        h: _graphsH,
                        cross: {
                            x: pos.x,
                            y: _graphsH + pos.y
                        },
                        pos: {
                            x: _yAxisW,
                            y: y - _graphsH
                        }
                    });
                    //, this._anchor.setY(y)
                }
            },
            _initPlugs: function(opts, g) {
                if (opts.markLine) {
                    this._initMarkLine(g);
                };
                if (opts.markPoint) {
                    this._initMarkPoint(g);
                };
            },
            _initMarkPoint: function(g) {
                var me = this;
                require(["chartx/components/markpoint/index"], function(MarkPoint) {
                    _.each(g.data, function(node, i) {
                        var circle = g._circles.children[i];

                        var mpCtx = {
                            value: node.value,
                            markTarget: g.field,
                            point: circle.localToGlobal(),
                            r: circle.context.r + 2,
                            groupLen: g.data.length,
                            iNode: i,
                            iGroup: g._groupInd
                        };
                        if (me._opts.markPoint && me._opts.markPoint.shapeType != "circle") {
                            mpCtx.point.y -= circle.context.r + 3
                        };
                        new MarkPoint(me._opts, mpCtx).done(function() {
                            me.core.addChild(this.sprite);
                            var mp = this;
                            this.shape.hover(function(e) {
                                this.context.hr++;
                                this.context.cursor = "pointer";
                                e.stopPropagation();
                            }, function(e) {
                                this.context.hr--;
                                e.stopPropagation();
                            });
                            this.shape.on("mousemove", function(e) {
                                e.stopPropagation();
                            });
                            this.shape.on("tap click", function(e) {
                                e.stopPropagation();
                                e.eventInfo = mp;
                                me.fire("markpointclick", e);
                            });
                        });
                    });
                });
            },
            _initMarkLine: function(g, dataFrame) {
                var me = this;
                var index = g._groupInd;
                var pointList = _.clone(g._pointList);
                dataFrame || (dataFrame = me.dataFrame);
                var center = parseInt(dataFrame.yAxis.center[index].agPosition)
                require(['chartx/components/markline/index'], function(MarkLine) {
                    var content = g.field + '均值',
                        strokeStyle = g.line.strokeStyle;
                    if (me.markLine.text && me.markLine.text.enabled) {

                        if (_.isFunction(me.markLine.text.format)) {
                            var o = {
                                iGroup: index,
                                value: dataFrame.yAxis.center[index].agValue
                            }
                            content = me.markLine.text.format(o)
                        }
                    };
                    var o = {
                        w: me._xAxis.xGraphsWidth,
                        h: me._yAxis.yGraphsHeight,
                        origin: {
                            x: me._back.pos.x,
                            y: me._back.pos.y
                        },
                        line: {
                            y: center,
                            list: [
                                [0, 0],
                                [me._xAxis.xGraphsWidth, 0]
                            ],
                            strokeStyle: strokeStyle
                        },
                        text: {
                            content: content,
                            fillStyle: strokeStyle
                        },
                        field: g.field
                    };

                    new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function() {
                        me.core.addChild(this.sprite)
                    });
                })
            },
            bindEvent: function(spt, _setXaxisYaxisToTipsInfo) {
                var self = this;
                _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = self._setXaxisYaxisToTipsInfo);
                spt.on("panstart mouseover", function(e) {
                    if (self._tip.enabled && e.eventInfo.nodesInfoList.length > 0) {
                        self._tip.hide(e);
                        _setXaxisYaxisToTipsInfo.apply(self, [e]);
                        self._tip.show(e);
                    }
                });
                spt.on("panmove mousemove", function(e) {
                    if (self._tip.enabled) {
                        if (e.eventInfo.nodesInfoList.length > 0) {
                            _setXaxisYaxisToTipsInfo.apply(self, [e]);
                            if (self._tip._isShow) {
                                self._tip.move(e);
                            } else {
                                self._tip.show(e);
                            }
                        } else {
                            if (self._tip._isShow) {
                                self._tip.hide(e);
                            }
                        }
                    }
                });
                spt.on("panend mouseout", function(e) {
                    if (self._tip.enabled) {
                        self._tip.hide(e);
                    }
                });
                spt.on("tap", function(e) {
                    if (self._tip.enabled && e.eventInfo.nodesInfoList.length > 0) {
                        self._tip.hide(e);
                        _setXaxisYaxisToTipsInfo.apply(self, [e]);
                        self._tip.show(e);
                    }
                });
                spt.on("click", function(e) {
                    _setXaxisYaxisToTipsInfo.apply(self, [e]);
                    self.fire("click", e.eventInfo);
                });
            },
            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function(e) {
                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iNode]
                };
            },
            _trimGraphs: function(_yAxis, dataFrame) {

                _yAxis || (_yAxis = this._yAxis);
                dataFrame || (dataFrame = this.dataFrame);
                var self = this;

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var arr = dataFrame.yAxis.org;
                var tmpData = [];
                var center = [];

                function _trimGraphs(_fields, _arr, _tmpData, _center, _firstLay) {
                    for (var i = 0, l = _fields.length; i < l; i++) {
                        var __tmpData = [];
                        _tmpData.push(__tmpData);

                        //单条line的全部data数据
                        var _lineData = _arr[i];

                        if (_firstLay && self.biaxial && i > 0) {
                            _yAxis = self._yAxisR;
                            maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                        };

                        if (_.isArray(_fields[i])) {
                            var __center = [];
                            _center.push(__center);
                            _trimGraphs(_fields[i], _lineData, __tmpData, __center);
                        } else {
                            var maxValue = 0;
                            _center[i] = {};
                            for (var b = 0, bl = _lineData.length; b < bl; b++) {
                                if (b >= self._xAxis.data.length) {
                                    //如果发现数据节点已经超过了x轴的节点，就扔掉
                                    break;
                                }
                                var x = self._xAxis.data[b].x;
                                var y = -(_lineData[b] - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                                y = isNaN(y) ? 0 : y
                                __tmpData[b] = {
                                    value: _lineData[b],
                                    x: x,
                                    y: y
                                };
                                maxValue += _lineData[b]
                            };
                            _center[i].agValue = maxValue / bl;
                            _center[i].agPosition = -(_center[i].agValue - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                        }
                    }
                };

                function _getYaxisField(i) {
                    //这里要兼容从折柱混合图过来的情况
                    if (self._lineField) {
                        return self._lineField;
                    };
                    if (self.type && self.type.indexOf("line") >= 0) {
                        self._lineField = self._lineChart.dataFrame.yAxis.field;
                    } else {
                        self._lineField = self.dataFrame.yAxis.field;
                    };
                    return self._lineField;
                };

                _trimGraphs( _getYaxisField(), arr, tmpData, center, true);

                //均值
                dataFrame.yAxis.center = center;
                return tmpData;
            },
            //根据x轴分段索引和具体值,计算出处于Graphs中的坐标
            _getPosAtGraphs: function(index, num) {
                var x = this._xAxis.data[index].x;
                var y = this._graphs.data[0][index].y
                return {
                    x: x,
                    y: y
                }
            },
            //每两个点之间的距离
            _getGraphsDisX: function() {
                var dsl = this._xAxis.dataSection.length;
                var n = this._xAxis.xGraphsWidth / (dsl - 1);
                if (dsl == 1) {
                    n = 0
                }
                return n
            }
        });
    }
);