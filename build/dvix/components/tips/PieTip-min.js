KISSY.add("dvix/components/tips/PieTip",function(a,b,c,d){var e=function(a){this.w=100,this.h=50,this.data=[[1,2]],this.text={disX:4,disY:4},this.back={enabled:1,disX:8,disY:8,strokeStyle:"#333333",thinkness:1.5,fillStyle:"#FFFFFF",radius:[4,4,4,4]},this.sprite=null,this.widgetSp=null,this.txtSp=null,this.backSp=null,this.init(a)};return e.prototype={init:function(a){var c=this;c._initConfig(a),c.sprite=new b.Display.Sprite,c.backSp=new b.Display.Sprite,c.txtSp=new b.Display.Sprite,c.sprite.context.visible=!1,c.sprite.addChild(c.backSp),c.sprite.addChild(c.txtSp)},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},draw:function(){var a=this;a._widget()},_initConfig:function(a){var b=this;b.title=a.name?a.name:"title",b.percentage=a.txt?a.txt:"%0"},_reset:function(a){var b=this;b.backSp.removeAllChildren(),b.txtSp.removeAllChildren(),b._initConfig(a.__data),b.draw()},_widget:function(){var a=this;a.backSp.addChild(new d({context:{width:a.w,height:a.h,strokeStyle:"#333333",lineWidth:1.5,fillStyle:"#FFFFFF",radius:[4,4,4,4],globalAlpha:.5}})),a.txtSp.addChild(new b.Display.Text(a.title,{context:{x:10,y:5,fillStyle:"#000000",fontSize:15,fontWeight:"normal"}})),a.txtSp.addChild(new b.Display.Text(a.percentage,{context:{x:10,y:26,fillStyle:"#000000",fontSize:10,fontWeight:"normal"}}))}},e},{requires:["canvax/","canvax/shape/Circle","canvax/shape/Rect","dvix/utils/tools"]});