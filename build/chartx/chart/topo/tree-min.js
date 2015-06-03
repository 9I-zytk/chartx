define("chartx/chart/topo/tree",["chartx/chart/index","canvax/shape/Rect","canvax/shape/Line","canvax/shape/Path","canvax/shape/Circle","chartx/layout/tree/dagre","canvax/animation/Tween"],function(a,b,c,d,e,f,g){var h=a.Canvax;return a.extend({init:function(a,b,c){this.data=this._initData(b),this.graph={rankdir:"TB",nodesep:20,edgesep:20,ranksep:30},this.node={width:60,height:60,fillStyle:"#ffffff",strokeStyle:"#e5e5e5",strokeStyleHover:"#58c592",labelColor:"#666"},this.link={r:4},_.deepExtend(this,c),this._nodesRect={left:0,top:0,right:0,bottom:0},window._nodesRect=this._nodesRect},draw:function(){this._scaleDragHandRect=new b({context:{width:this.width,height:this.height,fillStyle:"black",globalAlpha:0}}),this.stage.addChild(this._scaleDragHandRect),this.sprite=new h.Display.Sprite,this.stage.addChild(this.sprite),this.nodesSp=new h.Display.Sprite({id:"nodesSprite"}),this.sprite.addChild(this.nodesSp),this.linksSp=new h.Display.Sprite({id:"linksSprite"}),this.sprite.addChild(this.linksSp),this.g=new f.graphlib.Graph,this.g.setGraph(this.graph),this.g.setDefaultEdgeLabel(function(){return{}}),this._initNodesAndLinks(),this._widget(),this._initNodesSpritePos(),this._initEventHand()},_initData:function(a){var b={},c=a.shift();return _.each(a,function(a){var d=_.indexOf(c,"id"),e={};_.each(c,function(b,c){c!=d&&(e[b]=a[c])}),b[a[d]]=e}),b},_initEventHand:function(){var a=this,b=!1;this._scaleDragHandRect.on("mousedown",function(c){a._scaleDragHandRect.toFront(),b=!0,a._dragTreeBegin(c)}),this._scaleDragHandRect.on("mousemove",function(c){b&&a._dragTreeIng(c)}),this._scaleDragHandRect.on("mouseup mouseout",function(c){a._scaleDragHandRect.toBack(),b=!1,a._dragTreeEnd(c)})},_lastDragPoint:null,_dragTreeBegin:function(a){this._lastDragPoint=a.point},_dragTreeIng:function(a){this.sprite.context.x+=a.point.x-this._lastDragPoint.x,this.sprite.context.y+=a.point.y-this._lastDragPoint.y,this._lastDragPoint=a.point},_dragTreeEnd:function(a){this._lastDragPoint=null},addTo:function(a,b){if(this.data[b])for(i in a){if(this.data[i])return;this.data[i]=a[i],_.contains(this.data[b].link,i)||this.data[b].link.push(i);var c={};c[i]=a[i];var d=this._initNodesAndLinks(c);c=null,this._setParentLink(a[i],b),this.nodesSp.getChildById("node_"+b).addChild(this._getTail(b)),d.push(this._creatLinkLine(b,i)),this.g.setEdge(b,i),this._updateLayout(function(){_.each(d,function(a){a.context.globalAlpha=1}),d=null})}},remove:function(a){var b=this,c=b.data[a].parent;b._remove(a),0==b.data[c].link.length&&b.nodesSp.getChildById("node_"+c).getChildById("tail_"+c).remove(),this._updateLayout()},_remove:function(a){for(var b=this,c=this.data[a],d=0,e=c.link.length;e>d;d++)b._remove(c.link[d]),d--,e--;_.each(c.parent,function(c,d){b.g.removeEdge(c,a),b.linksSp.getChildById("link_"+c+"_"+a).remove(),_.each(b.data[c].link,function(d,e){return d==a?(b.data[c].link.splice(e,1),!1):void 0})}),delete this.data[a],this.g.removeNode(a),this.nodesSp.getChildById("node_"+a).remove(),c=null},_setParentLink:function(a,b){a.parent?_.contains(a.parent,b)||a.parent.push(b):a.parent=[b]},getNodeContent:function(a){var b=new h.Display.Sprite({}),c=new h.Display.Text(a.label,{context:{fillStyle:this.node.labelColor,textAlign:"center",textBaseline:"middle"}});return a.width||(a.width=c.getTextWidth()+20),a.height||(a.height=c.getTextHeight()+15),b.addChild(c),b.context.width=a.width,b.context.height=a.height,c.context.x=a.width/2,c.context.y=a.height/2,b},_getTail:function(a){var b,d,e=this.data[a];"TB"==this.graph.rankdir&&(b=[e.width/2,e.height],d=[e.width/2,e.height+this.graph.ranksep/2]),"LR"==this.graph.rankdir&&(b=[e.width,e.height/2],d=[e.width+this.graph.ranksep/2,e.height/2]);var f=new c({id:"tail_"+a,context:{xStart:b[0],yStart:b[1],xEnd:d[0],yEnd:d[1],strokeStyle:this.node.strokeStyle,lineWidth:1}});return f},_initNodesAndLinks:function(a){var c=this,d=null;a?d=[]:a=c.data;for(var e in a){var f=a[e];f.id=e,!f.width&&this.node.width&&(f.width=this.node.width),!f.height&&this.node.height&&(f.height=this.node.height),c.g.setNode(e,f),f.link||(f.link=[]);var g=f.link;g.length>0&&_.each(g,function(b,d){c._creatLinkLine(e,b),c._setParentLink(a[b],e),c.g.setEdge(e,b)});var i=new h.Display.Sprite({id:"node_"+e,context:{globalAlpha:0}}),j=new b({id:"rect_"+e,context:{fillStyle:this.node.fillStyle,strokeStyle:this.node.strokeStyle,lineWidth:1,width:f.width,height:f.height}});j.node=f,i.addChild(j),i.addChild(this.getNodeContent(f)),_.isArray(f.link)&&f.link.length>0&&i.addChild(this._getTail(e)),this.nodesSp.addChild(i),j.hover(function(a){c.fire("nodeMouseover",a),a.type="mouseover"},function(a){c.fire("nodeMouseout",a),a.type="mouseout"}),j.on("click",function(a){c.fire("nodeClick",a)}),_.isArray(d)&&d.push(i)}return d},_creatLinkLine:function(a,b){var c=new d({id:"link_"+a+"_"+b,context:{path:"M0,0",strokeStyle:this.node.strokeStyle,lineWidth:1}});return this.linksSp.addChild(c),c},_getLinkPath:function(a,b,c){var d=this,e="M"+a.x+","+a.y;return c.x==a.x&&("TB"==d.graph.rankdir||"BT"==d.graph.rankdir)||c.y==a.y&&("LR"==d.graph.rankdir||"RL"==d.graph.rankdir)?e+="L"+c.x+","+c.y:("TB"==d.graph.rankdir&&(e+="L"+a.x+","+(b.y+d.link.r),e+="Q"+a.x+","+b.y+",",e+=(c.x>a.x?1:-1)*d.link.r+a.x+","+b.y,e+="L"+c.x+","+c.y),"LR"==d.graph.rankdir&&(e+="L"+(b.x+d.link.r)+","+a.y,e+="Q"+b.x+","+b.y+",",e+=b.x+","+((c.y>a.y?1:-1)*d.link.r+b.y),e+="L"+c.x+","+c.y)),e},_widget:function(){var a=this;f.layout(a.g),a.g.nodes().forEach(function(b){var c=a.g.node(b),d=a.nodesSp.getChildById("node_"+b).context;d.x=c.x-c.width/2,d.y=c.y-c.height/2,d.globalAlpha=1,a._nodesRect.left=Math.min(a._nodesRect.left,c.x-c.width/2),a._nodesRect.top=Math.min(a._nodesRect.top,c.y-c.height/2),a._nodesRect.right=Math.max(a._nodesRect.right,c.x+c.width/2),a._nodesRect.bottom=Math.max(a._nodesRect.bottom,c.y+c.height/2)}),a.g.edges().forEach(function(b){var c=a.g.edge(b),d=a.g.node(b.v),e=c.points[2],f={x:0,y:0},g={x:0,y:0};"TB"==a.graph.rankdir&&(f={x:d.x,y:d.y+d.height/2+a.graph.ranksep/2},g={x:e.x,y:f.y}),"LR"==a.graph.rankdir&&(f={x:d.x+d.width/2+a.graph.ranksep/2,y:d.y},g={x:f.x,y:e.y});var h=a.linksSp.getChildById("link_"+b.v+"_"+b.w).context;h.path=a._getLinkPath(e,g,f)})},_getPos:function(){var a=this,b={};return a.g.nodes().forEach(function(c){var d=a.g.node(c);b["node_"+c+"_x"]=d.x?d.x-d.width/2:0,b["node_"+c+"_y"]=d.x?d.y-d.height/2:0}),a.g.edges().forEach(function(c){var d,e,f,g=a.g.node(c.v),h=a.g.edge(c);h.points?(d={x:g.x,y:g.y+g.height/2+5*a.graph.ranksep/10},e=h.points[2],f={x:e.x,y:d.y}):d=e=f={x:0,y:0},b["link_"+c.v+"_"+c.w+"_vTailPoint-x"]=d.x,b["link_"+c.v+"_"+c.w+"_vTailPoint-y"]=d.y,b["link_"+c.v+"_"+c.w+"_wbegin-x"]=e.x,b["link_"+c.v+"_"+c.w+"_wbegin-y"]=e.y,b["link_"+c.v+"_"+c.w+"_wvControl-x"]=f.x,b["link_"+c.v+"_"+c.w+"_wvControl-y"]=f.y}),b},_getLayoutChanged:function(){var a=this,b=this._getPos();f.layout(a.g);var c=a._getPos();return{pos:b,posTo:c}},_updateLayout:function(a){this._tweenLayout(this._getLayoutChanged(),a)},_creatPathOnTween:function(){},_tweenLayout:function(a,b){function c(){e=requestAnimationFrame(c),g.update()}var d=this,e=null,f=function(){new g.Tween(a.pos).to(a.posTo,300).onUpdate(function(){var a={};for(var b in this){var c=this[b],e=b.slice(b.lastIndexOf("_")).replace("_","");if(b=b.substr(0,b.lastIndexOf("_")),"x"==e||"y"==e)d.nodesSp.getChildById(b).context[e]=c;else{a[b]||(a[b]={});var f=e.slice(0,e.indexOf("-")),g=e.slice(e.indexOf("-")+1);a[b][f]||(a[b][f]={}),a[b][f][g]=c}}for(var h in a){var i=a[h],j=d._getLinkPath(i.wbegin,i.wvControl,i.vTailPoint);d.linksSp.getChildById(h).context.path=j}}).onComplete(function(){cancelAnimationFrame(e),b&&b()}).start(),c()};f()},_initNodesSpritePos:function(){this.sprite.context.x=(this.width-(this._nodesRect.right-this._nodesRect.left))/2,this.sprite.context.y=10}})});