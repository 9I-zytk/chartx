KISSY.add("dvix/components/xaxis/xAxis",function(a,b,c,d){var e=function(a,b){this.w=0,this.h=0,this.disY=0,this.dis=6,this.line={enabled:1,width:1,height:4,strokeStyle:"#cccccc"},this.max={left:0,right:0,txtH:14},this.text={mode:1,fillStyle:"#999999",fontSize:13},this.display="block",this.disXAxisLine=6,this.disOriginX=0,this.xGraphsWidth=0,this.dataOrg=[],this.dataSection=[],this.data=[],this.layoutData=[],this.sprite=null,this.txtSp=null,this.lineSp=null,this.init(a,b)};return e.prototype={init:function(a,c){this.dataOrg=c.org,a&&_.deepExtend(this,a),this.dataSection=this._initDataSection(this.dataOrg),this.sprite=new b.Display.Sprite,this._checkText()},_initDataSection:function(a){return _.flatten(a)},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},draw:function(a){this._initConfig(a),this.data=this._trimXAxis(this.dataSection,this.xGraphsWidth),this._trimLayoutData(),"none"!=this.display&&(this._widget(),this._layout()),this.setX(this.pos.x+this.disOriginX),this.setY(this.pos.y)},_initConfig:function(a){a&&_.deepExtend(this,a),this.max.right=this.w,this.xGraphsWidth=this.w-this._getXAxisDisLine(),this.disOriginX=parseInt((this.w-this.xGraphsWidth)/2),this.max.left+=this.disOriginX,this.max.right-=this.disOriginX},_trimXAxis:function(a,b){for(var c=[],d=b/(a.length+1),e=0,f=a.length;f>e;e++){var g={content:a[e],x:parseInt(d*(e+1))};c.push(g)}return c},_getXAxisDisLine:function(){var a=this.disXAxisLine,b=2*a,c=a;return c=a+this.w%this.dataOrg.length,c=c>b?b:c,c=isNaN(c)?0:c},_checkText:function(){var a=new b.Display.Text("test",{context:{fontSize:this.text.fontSize}});this.max.txtH=a.getTextHeight(),this.h="none"==this.display?this.max.txtH:this.disY+this.line.height+this.dis+this.max.txtH},_widget:function(){var a=this.layoutData;this.txtSp=new b.Display.Sprite,this.sprite.addChild(this.txtSp),this.lineSp=new b.Display.Sprite,this.sprite.addChild(this.lineSp);for(var e=0,f=a.length;f>e;e++){var g=a[e],h=g.x,i=this.disY+this.line.height+this.dis,j=d.numAddSymbol(g.content),k=new b.Display.Text(j,{context:{x:h,y:i,fillStyle:this.text.fillStyle,fontSize:this.text.fontSize}});this.txtSp.addChild(k)}for(var a=1==this.text.mode?this.layoutData:this.data,e=0,f=a.length;f>e;e++){var g=a[e],h=g.x,l=new c({id:e,context:{x:h,y:0,xEnd:0,yEnd:this.line.height,lineWidth:this.line.width,strokeStyle:this.line.strokeStyle}});l.context.y=this.disY,this.lineSp.addChild(l)}for(var e=0,f=this.txtSp.getNumChildren();f>e;e++){var k=this.txtSp.getChildAt(e),h=parseInt(k.context.x-k.getTextWidth()/2);k.context.x=h}},_layout:function(){var a=this.txtSp.getChildAt(0),b=this.txtSp.getChildAt(this.txtSp.getNumChildren()-1);a&&a.context.x<this.max.left&&(a.context.x=parseInt(this.max.left)),b&&Number(b.context.x+Number(b.getTextWidth()))>this.max.right&&(b.context.x=parseInt(this.max.right-b.getTextWidth()))},_trimLayoutData:function(){for(var a=[],c=this.data,e=0,f=0,g=c.length;g>f;f++){var h=c[f],i=d.numAddSymbol(h.content),j=new b.Display.Text(i,{context:{fillStyle:this.text.fillStyle,fontSize:this.text.fontSize}});e=Math.max(e,j.getTextWidth())}for(var k=this.max.right,l=Math.min(Math.floor(k/e),c.length),m=Math.max(Math.ceil(c.length/l-1),0),f=0;l>f;f++){var n=c[f+m*f];n&&a.push(n)}this.layoutData=a}},e},{requires:["canvax/","canvax/shape/Line","dvix/utils/tools","dvix/utils/deep-extend"]});