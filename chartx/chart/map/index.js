define(
    "chartx/chart/map/index",
    [
        'canvax/index',
        'chartx/chart/index',
        'canvax/shape/Path',
        'canvax/shape/Polygon',
        'chartx/chart/map/map-data/params',
        'chartx/chart/map/map-data/geo-coord',
        'chartx/chart/map/map-data/text-fixed',
        'chartx/utils/projection/normal',
        'chartx/components/tips/tip',//'./tips',
        'chartx/utils/dataformat',
        "chartx/components/markpoint/index"
    ],
    function( Canvax , Chart , Path , Polygon , mapParams , GeoCoord , TextFixed , Projection , Tips , DataFormat , MarkPoint ){
    
        return Chart.extend({
            init : function( node , data , opts){
                this._opts       = opts;
                this.mapName     = "china";//map类型 默认为中国地图
                this._mapDataMap = {};
                this.tips = {};
                this.normalColor = "#c9bbe6";
                this.area = {
                    strokeStyle : "white",
                    fillStyle   : this.normalColor,
                    lineWidth   : 1,
                    linkage     : false, //是否开启省市联动，目前只支持中国地图
                    text        : {
                        fillStyle : "#000",
                        enabled   : true
                    }
                };

                //城市坐标的补充。
                this.geoCoordSupply    = {}

                //默认的areaField字段
                this.areaField = "area";

                this.tips = {
                    field : []
                };

                _.deepExtend( this , opts );

                this._initData( data );

                //DataFormat后会重新计算出来最后的field
                this.tips.field = this.dataFrame.yAxis.field;

                this._mapScale  = 1; //Math.min( this.width / 560 , this.height / 470 );
                
                this.sprite     = new Canvax.Display.Sprite({
                    id   : "mapSp"
                });
                this.spriteTip  = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
            },
            _initData : function( data ){
                this.dataFrame = DataFormat(data , {
                     xAxis : { field : [ this.areaField ] },
                     yAxis : { field : this.tips.field }
                });
                return this.dataFrame;
            },
            draw : function(){

                //因为draw的时候可能是 reset触发的。这个时候要先清除了sprite的所有子节点
                //然后把它重新add入stage
                this.sprite.removeAllChildren();
                this.stage.addChild( this.sprite );
                this.stage.addChild( this.spriteTip );
                this._tips && this._tips.hide();

                this._initModule();
                var me = this;

                this._getMapData( this.mapName , function( md ){
                    me._widget( md );
                    if( "markPoint" in me._opts ){
                        me._initMarkPoint();
                    }
                    //绘制完了后调整当前sprite的尺寸和位置
                    me._setSpPos();

                    this.inited = true;
                } );
            },
            _setSpPos : function( ){
                var tf  = this._mapDataMap[this.mapName].transform;
                var spc = this.sprite.context;
                spc.width  = tf.width;
                spc.height = tf.height;
                spc.x      = (this.width  - tf.width ) / 2;
                spc.y      = (this.height - tf.height) / 2;

                spc = this.spriteTip.context;
                spc.width  = tf.width;
                spc.height = tf.height;
                spc.x      = (this.width  - tf.width ) / 2;
                spc.y      = (this.height - tf.height) / 2;
            },
            _getMapData : function( mt , callback ){
                var me = this;
                this._mapDataMap[mt] = this._mapDataMap[mt] || {};
                mapParams.params[ mt ].getGeoJson( this._mapDataCallback( mt , callback ) );
            },
            /**
             * @param {string} mt mapName
             * @param {function} callback 
             */
            _mapDataCallback : function (mt, callback) {
                var self = this;
                return function ( md ) {
                    self._mapDataMap[mt].mapData    = md;
                    self._mapDataMap[mt].rate       = 0.75;
                    self._mapDataMap[mt].projection = Projection;
                    var d = self._getProjectionData(mt, md);     // 地图数据
                    _.isFunction(callback) && callback( d );
                };
            },
            /**
             * 按需加载相关地图 
             */
            _getProjectionData : function (mapName, mapData) {
                var normalProjection = this._mapDataMap[mapName].projection;
                var province = [];
                var bbox = this._mapDataMap[mapName].bbox 
                           || normalProjection.getBbox( mapData );
                
                var transform = this._getTransform(
                    bbox,
                    this._mapDataMap[mapName].rate
                );
                var lastTransform = this._mapDataMap[mapName].lastTransform || {scale:{}};
                
                var pathArray;
                if (transform.left != lastTransform.left
                    || transform.top != lastTransform.top
                    || transform.scale.x != lastTransform.scale.x
                    || transform.scale.y != lastTransform.scale.y
                ) {
                    //发生过变化，需要重新生成pathArray
                    pathArray     = normalProjection.geoJson2Path( mapData, transform);
                    lastTransform = _.clone(transform);
                }
                else {
                    transform = this._mapDataMap[mapName].transform;
                    pathArray = this._mapDataMap[mapName].pathArray;
                }
                
                this._mapDataMap[mapName].bbox = bbox;
                this._mapDataMap[mapName].transform = transform;
                this._mapDataMap[mapName].lastTransform = lastTransform;
                this._mapDataMap[mapName].pathArray = pathArray;
                
                var position = [transform.left, transform.top];
                for (var i = 0, l = pathArray.length; i < l; i++) {
                    /* for test
                    console.log(
                        mapData.features[i].properties.cp, // 经纬度度
                        pathArray[i].cp                    // 平面坐标
                    );
                    console.log(
                        this.pos2geo(mapName, pathArray[i].cp),  // 平面坐标转经纬度
                        this.geo2pos(mapName, mapData.features[i].properties.cp)
                    )
                    */
                    province.push(this._getSingleProvince(
                        mapName, pathArray[i], position
                    ));
                }
                
                // 中国地图加入南海诸岛
                if (mapName == 'china' && false) {
                    var leftTop = this.geo2pos(
                        mapName, 
                        GeoCoord['南海诸岛'] || _mapParams['南海诸岛'].textCoord
                    );
                    // scale.x : width  = 10.51 : 64
                    var scale = transform.scale.x / 10.5;
                    var textPosition = [
                        32 * scale + leftTop[0], 
                        83 * scale + leftTop[1]
                    ];
                    if (TextFixed['南海诸岛']) {
                        textPosition[0] += TextFixed['南海诸岛'][0];
                        textPosition[1] += TextFixed['南海诸岛'][1];
                    }
                    province.push({
                        name : this._nameChange(mapName, '南海诸岛'),
                        path : _mapParams['南海诸岛'].getPath(leftTop, scale),
                        position : position,
                        textX : textPosition[0],
                        textY : textPosition[1]
                    });
                    
                }
                return province;
            },
            /**
             * 百分比计算
             */
            parsePercent : function( value, maxValue ){
                if (typeof value === 'string') {
                    if (_trim(value).match(/%$/)) {
                        return parseFloat(value) / 100 * maxValue;
                    };
                    return parseFloat(value);
                }
                return value;
            },
            /**
             * 经纬度转平面坐标
             * @param {Object} p
             */
            geo2pos : function (mapName, p) {
                if (!this._mapDataMap[mapName].transform) {
                    return null;
                }
                return this._mapDataMap[mapName].projection.geo2pos(
                    this._mapDataMap[mapName].transform, p
                );
            },
            _getSingleProvince : function (mapName, path, position) {
                var textPosition;
                var name = path.properties.name;
                var textFixed = TextFixed[name] || [0, 0];
                if (GeoCoord[name]) {
                    // 经纬度直接定位不加textFixed
                    textPosition = this.geo2pos(
                        mapName, 
                        GeoCoord[name]
                    );
                } else if (path.cp) {
                    textPosition = [
                        path.cp[0] + textFixed[0], 
                        path.cp[1] + textFixed[1]
                    ];
                } else {
                    var bbox = this._mapDataMap[mapName].bbox;
                    textPosition = this.geo2pos(
                        mapName, 
                        [bbox.left + bbox.width / 2, bbox.top + bbox.height / 2]
                    );
                    textPosition[0] += textFixed[0];
                    textPosition[1] += textFixed[1];
                }
                
                path.name     =  name;
                path.position = position;
                path.textX    = textPosition[0];
                path.textY    = textPosition[1];
                return path;
            },
            /**
             * 获取缩放 
             */
            _getTransform : function (bbox, rate) {
                var width;
                var height;
                var graphWidth  = this.width;
                var graphHeight = this.height;
                
                width  = !width  ? graphWidth  : (this.parsePercent(width, graphWidth));
                height = !height ? graphHeight : (this.parsePercent(height, graphHeight));
                
                var mapWidth = bbox.width;
                var mapHeight = bbox.height;
                //var minScale;
                var xScale = (width / rate) / mapWidth;
                var yScale = height / mapHeight;
                if (xScale > yScale) {
                    //minScale = yScale;
                    xScale = yScale * rate;
                    width  = mapWidth * xScale;
                }
                else {
                    yScale = xScale;
                    xScale = yScale * rate;
                    height = mapHeight * yScale;
                }
                
                return {
                    left  : 0,
                    top   : 0,
                    width : width,
                    height: height,
                    baseScale : 1,
                    scale : {
                        x : xScale,
                        y : yScale
                    }
                };
            },



            /*返回{area : "湖南" , click : 222} 这样的格式*/
            _createDataObj  : function( arr , titles ){
                var obj = {};
                _.each( titles , function( t , i ){
                    obj[t] = arr[i]
                } );
                return obj;
            },
            _getDataForArea : function( area ){
                var data = {
                    area : area
                };
                var me   = this;
                
                _.each( this.dataFrame.xAxis.org[ 0 ] , function( areaData , i ){
                    if( areaData.indexOf( area.name ) >= 0 || area.name.indexOf( areaData ) >= 0 ){
                        data.data      = me._createDataObj(me.dataFrame.org[ i+1 ] , me.dataFrame.org[ 0 ]);
                        data.dataIndex = i;
                    }
                } );
                return data;
            },
            _getColor : function( c , area , normalColor ){
                var color = c;
                if( _.isFunction( c ) ){
                    color = c.apply(this , [ this._getDataForArea(area ) , this.dataFrame]);
                } 
                //缺省颜色
                if( (!color || color == "") ){
                    //如果有传normal进来，就不管normalColor参数是什么，都直接用
                    if( arguments.length >= 3 ){
                        color = normalColor;
                    } else {
                        color = this.normalColor;
                    }
                }
                return color;
            },
            _widget : function( features ){
                var me = this;
                var mapDataList = features;
                var mapLen      = mapDataList.length;

                var area_txt_sp;
                if( me.area.text.enabled ){
                    area_txt_sp = new Canvax.Display.Sprite({
                        id   : "area_name"
                    });
                };
                var area_sp = new Canvax.Display.Sprite({
                    id   : "areas"
                });

                _.each(mapDataList , function( md , i ){

                    var shapeCtx = {
                        x:0,
                        y:0,
                        scaleX      : me._mapScale,
                        scaleY      : me._mapScale,
                        path        : md.path,
                        lineWidth   : me.area.lineWidth,
                        fillStyle   : me._getColor( me.area.fillStyle   , md ),
                        strokeStyle : me._getColor( me.area.strokeStyle , md ),
                        cursor      : "pointer"
                    };

                    var area   = new Path({
                        hoverClone : false, 
                        context : shapeCtx
                    });

                    area_sp.addChild( area );
                    
                    area.defInd  = i;
                    area.mapData = md
                    area.on("mouseover" , function(e){
                        this.toFront();
                        if( e.fromTarget && e.fromTarget.type == "text" &&  e.fromTarget.text == this.mapData.name ){
                            return;
                        };
                        me.fire("areaover" , e);
                        me._tips.show( me._setTipsInfoHand(e , this.mapData) );
                    });
                    area.on("mousemove" , function(e){
                        me._tips.move( me._setTipsInfoHand(e , this.mapData) );
                    });

                    area.on("mouseout" , function(e){
                        this.toBack( mapLen - this.defInd );
                        if( e.toTarget && e.toTarget.type == "text" &&  e.toTarget.text == this.mapData.name ){
                            return;
                        };
                        me.fire("areaout" , e);
                        me._tips.hide( e ); 
                    });

                    area.on("click" , function(e){
                        //地图联动， 目前只支持省市联动
                        if( me.area.linkage ) {
                            if( me.mapName == "台湾" || this.mapData.name == me.mapName ){
                                me.mapName =  "china";
                            } else {
                                me.mapName = mapParams.params[ this.mapData.name ] ? this.mapData.name : "china"
                            }
                        };
                        //TODO: 下面两个为了像下兼容。以后的所有事件都要吧数据存放再eventInfo上
                        e.area = this.mapData;
                        e.areaData = me._getDataForArea( this.mapData );

                        e.eventInfo = me._getDataForArea( this.mapData );

                        me.fire("areaclick" , e ); 
                    });

                    if( me.area.text.enabled ){
                        //文字
                        var txt = new Canvax.Display.Text( 
                            _.isFunction(me.area.text.filter) ? me.area.text.filter(md.name) : md.name,
                            {
                                context : {
                                    cursor : "pointer",
                                    x  : md.textX,
                                    y  : md.textY,
                                    fillStyle    : me.area.text.fillStyle,
                                    textBaseline : "middle",
                                    textAlign    : "center"
                                }   
                            }
                        );
                        txt.area = area;
                        txt.on("mouseover" , function(e){
                            if( e.fromTarget && e.fromTarget == this.area ){
                                return;
                            };
                            this.area.fire("mouseover" , e);
                        });
                        txt.on("mousemove" , function(e){
                            this.area.fire("mousemove" , e);
                        });
                        txt.on("mouseout" , function(e){
                            if( e.toTarget && e.toTarget == this.area ){
                                return;
                            };
                            this.area.fire("mouseout release" , e); 
                        });
                        txt.on("click" , function( e ){
                            this.area.fire("click" , e); 
                        });
                        area_txt_sp.addChild( txt ); 
                    }
                });
                me.sprite.addChild( area_sp ); 
                area_txt_sp && me.sprite.addChild( area_txt_sp ); 

            },
            _initMarkPoint : function(){
                var me = this;
                require(["chartx/chart/map/map-data/geo-json/china_city"] , function( citys ){
                    _.each( me.dataFrame.xAxis.org[0] , function( c , i ){
                        if( c in me.geoCoordSupply ){
                            me._setMarkToPoint( c , me.geo2pos( me.mapName , me.geoCoordSupply[c] ) ); 
                        } else {
                            for( var g in citys ){
                                if( c in citys[g] ){
                                    var cityPos = me.geo2pos( me.mapName ,  citys[g][c] );
                                    me._setMarkToPoint( c , cityPos );
                                    break;
                                }
                            }
                        }
                    } );
                });
            },
            _setMarkToPoint : function( c , cityPos){
                var me = this;
                var md = {
                    name : c
                };

                var mpCtx = {
                    point : {
                        x : cityPos[0],
                        y : cityPos[1]
                    }
                };
                
                var areaData = me._getDataForArea(md);
                if( me._opts.markPoint && me._opts.markPoint.r ){
                    if( _.isFunction( me._opts.markPoint.r ) ){
                        me._opts.markPoint.r = me._opts.markPoint.r( areaData )
                    }
                };

                new MarkPoint( me._opts , mpCtx , areaData ).done(function(){
                    var shape = this.shape;

                    shape.mapData = md;
                    shape.on("mouseover" , function(e){
                        me._tips.show( me._setTipsInfoHand( e , this.mapData) );
                        this.context.lineWidth += 2 ;
                    });

                    shape.on("mousemove" , function(e){
                        me._tips.move( me._setTipsInfoHand( e , this.mapData) );
                    });
                    shape.on("mouseout" , function(e){
                        me._tips.hide( );
                        this.context.lineWidth -= 2 
                    });
                    shape.on("click" , function(e){
                        e.areaData = me._getDataForArea(this.mapData);
                        me.fire("markpointclick" , e ); 
                    });
                    me.sprite.addChild( this.sprite );
                });
            },
            _initModule : function(){
                this._tips    = new Tips(this.tips, this.canvax.getDomContainer());
                this._tips._getDefaultContent =  function( info ){
                     var str  = "<table>";
                     var self = this;
                     str +=     "<tr><td colspan='2'>"+info.area.value+"</td></tr>"
                     _.each( info.nodesInfoList , function( node , i ){
                         str+= "<tr >";
                         var prefixName = self.prefix[i];
                         if( !prefixName ) {
                             prefixName = node.field
                         }
                         str += "<td>"+ prefixName +"：</td>";
                         str += "<td>"+ node.value +"</td></tr>";
                     });
                     str+="</table>";
                     return str;
                }
                /*
                this.tips.cPointStyle = this.area.strokeStyle;
                this.tips._mapScale    = this._mapScale;
                this._tips   = new Tips(this.tips , {
                    //context : "中国地图"
                } , this.canvax.getDomContainer());
                */
                this.spriteTip.addChild( this._tips.sprite );
            },
            _setTipsInfoHand : function( e , mapData ){

                var tipsInfo = {
                    area : {field : this.areaField , value :  mapData.name },
                    nodesInfoList : []
                };
                var me = this;


                //先计算好这个area是否在data中有传入数据
                var areaData = this._getDataForArea( mapData );

                if( areaData.data ){
                    _.each( this.tips.field , function( field , i ){
                        var val = areaData.data[ field ];
                        if( val !== undefined && val !== null ){
                            tipsInfo.nodesInfoList.push({
                                field  : field ,
                                value  : areaData.data[ field ]
                            });
                        }
                    } );
                };

                e.tipsInfo   = tipsInfo;
                return e;
            }
        });
    }
);
