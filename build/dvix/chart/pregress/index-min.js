KISSY.add("dvix/chart/pregress/index",function(a,b){var c=b.Canvax,d=function(a,b){this.canvax=new c({el:a}),this.width=parseInt(a.width()),this.height=parseInt(a.height()),this.config=_.extend({ringWidth:20,ringColor:"#8d76c4",bColor:"#E6E6E6"},b),this.r=Math.min(this.width,this.height)/2,this.stage=new c.Display.Stage,this.stage.addChild(new c.Shapes.Sector({context:{x:this.height/2,y:this.width/2,r:this.r,r0:this.r-this.config.ringWidth,startAngle:0,endAngle:360,fillStyle:this.config.bColor,lineJoin:"round"}})),this.stage.addChild(new c.Shapes.Sector({id:"rate",context:{x:this.height/2,y:this.width/2,r:this.r,r0:this.r-this.config.ringWidth,startAngle:0,endAngle:0,fillStyle:this.config.ringColor,lineJoin:"round"}}))};return d.prototype={draw:function(){this.canvax.addChild(this.stage)},setRate:function(a){this.stage.getChildById("rate").context.endAngle=a}},d},{requires:["dvix/"]});