KISSY.add("dvix/components/tips/Tip",function(a,b,c){var d=b.Canvax,e=function(a){this.w=0,this.h=0,this.data=[[1,2]],this.text={disX:4,disY:4},this.back={enabled:1,disX:28,disY:11,strokeStyle:"#333333",thinkness:1.5,fillStyle:"#FFFFFF",radius:[4,4,4,4]},this._lay={x_maxH:[],y_maxW:[],y_maxAllW:[]},this.sprite=null,this.widgetSp=null,this.txtSp=null,this.backSp=null,this.init(a)};return e.prototype={init:function(a){var b=this;b._initConfig(a),b.sprite=new d.Display.Sprite},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},draw:function(a){var b=this;b._configData(a),b._widget()},_initConfig:function(a){var b=this;if(a){var c=a.text;c&&(b.text.disX=c.disX||b.text.disX,b.text.disY=c.disY||b.text.disY);var d=a.back;d&&(b.back.enabled=0==d.enabled?0:b.back.enabled,b.back.disX=d.disX||0==d.disX?d.disX:b.back.disX,b.back.disY=d.disY||0==d.disY?d.disY:b.back.disY,b.back.strokeStyle=d.strokeStyle||b.back.strokeStyle,b.back.thinkness=d.thinkness||b.back.thinkness,b.back.fillStyle=d.fillStyle||b.back.fillStyle,b.back.radius=d.radius||b.back.radius)}},_configData:function(a){var b=this;a&&(b.data=a.data||b.data)},_widget:function(){var a=this;a.widgetSp=new d.Display.Sprite,a.sprite.addChild(a.widgetSp),a.backSp=new d.Display.Sprite,a.widgetSp.addChild(a.backSp),a.txtSp=new d.Display.Sprite,a.widgetSp.addChild(a.txtSp);var b=a._lay,e=a.data.length,f=0;a.data[0]&&(f=a.data[0].length);for(var g=0,h=a.data.length;h>g;g++){var i=0,j=new d.Display.Sprite;a.txtSp.addChild(j);for(var k=0,l=a.data[g].length;l>k;k++){var m=a.data[g][k],n=m.bold||"normal",o=m.fillStyle||"#000000",p=m.fontSize||13,q=c.numAddSymbol(m.content)||"",r=new d.Display.Text(q,{context:{fillStyle:o,fontSize:p,fontWeight:n}});if(j.addChild(r),i=Math.max(i,r.getTextHeight()),b.y_maxW[k]||(b.y_maxW[k]=0,b.y_maxAllW[k]=0),b.y_maxW[k]<r.getTextWidth()&&(b.y_maxW[k]=r.getTextWidth(),b.y_maxAllW[k]=b.y_maxW[k]),m.sign&&m.sign.enabled){var s=m.sign.radius||4,t=m.sign.disX||4;b.y_maxAllW[k]=Number(b.y_maxW[k])+2*Number(s)+Number(t)}}b.x_maxH.push(i)}for(var u=0,v=a.data.length;v>u;u++)for(var j=a.txtSp.getChildAt(u),w=0,x=a.data[u].length;x>w;w++){var m=a.data[u][w],r=j.getChildAt(w),y=c.getArrMergerNumber(b.y_maxAllW,0,w-1)+w*a.text.disY,z=u>0?c.getArrMergerNumber(b.x_maxH,0,u-1)+u*a.text.disX:0;j.context.y=z,z=0;var A=m.y_align||2,B=m.x_align||2;if(2==A?y+=(b.y_maxAllW[w]-r.getTextWidth())/2:3==A&&(y=y+b.y_maxAllW[w]-r.getTextWidth()),2==B?z+=(b.x_maxH[u]-r.getTextHeight())/2:3==B&&(z=z+b.x_maxH[u]-r.getTextHeight()),m.sign){var s=m.sign.radius||4,t=m.sign.disX||4,o=m.sign.fillStyle||"#000000";if(m.sign.enabled&&m.sign.trim){var C=new d.Shapes.Circle({context:{r:s,fillStyle:o}});j.addChild(C),C.context.x=parseInt(s),C.context.y=parseInt(z+r.getTextHeight()/2),y=C.context.x+s+t}}y=parseInt(y),z=parseInt(z),r.context.x=y,r.context.y=z}var D,E,F=(f-1)*a.text.disY,G=(e-1)*a.text.disX;a.back.enabled||(a.back.disX=0,a.back.disY=0),a.txtSp.context.x=a.back.disX,a.txtSp.context.y=a.back.disY,D=c.getArrMergerNumber(b.y_maxAllW)+2*a.back.disX+F,E=c.getArrMergerNumber(b.x_maxH)+2*a.back.disY+G,a.w=D,a.h=E;var y=parseInt(-D/2),z=parseInt(-E/2);a.widgetSp.context.x=y,a.widgetSp.context.y=z,a.back.enabled&&a.backSp.addChild(new d.Shapes.Rect({context:{width:D,height:E,strokeStyle:a.back.strokeStyle,lineWidth:a.back.thinkness,fillStyle:a.back.fillStyle,radius:a.back.radius}}))}},e},{requires:["dvix/","dvix/utils/tools"]});