KISSY.add("visualization/components/yaxis/yAxis",function(a,b,c,d){var e=function(a,b){this.chart=a,this.dataMode=b.dataMode||0,this.fields=b.fields||[],this.TextStyle=b.TextStyle||null,this.dataOrg=[],this.data=[],this.sprite=null};return e.prototype={getyAxisData:function(){var b=this,c=b.chart.data;if(0==b.fields.length)for(var e=0,f=c[0].length;f>e;e++)c[0][e]!==b.chart.xAxis.field&&b.fields.push(c[0][e]);a.each(b.fields,function(d){var e=[];a.each(c,function(a,c){0!=c&&e.push(a[b.chart.fieldList[d].index])}),b.dataOrg.push(e)}),1==b.dataMode&&a.each(b.dataOrg,function(a,c){b.dataOrg[c]=d.getArrScales(a)})},yAxisLayout:function(){var e=this;e.data=c.section(d.getChildsArr(e.dataOrg),5);var f=0;a.each(e.data,function(a){f=Math.max(f,a.toString().length)}),e.sprite=new b.Display.Sprite({context:{x:0,y:e.chart.yMarginTop,width:(f+1)*e.chart.oneStrSize.en.width,height:e.chart.height-e.chart.yMarginTop-Math.round(2*e.chart.oneStrSize.en.height)}})},yAxisDraw:function(){var c=this,d=c.sprite.context;a.each(c.data,function(a,e){var f=d.width,g=d.height-e*c.chart._yBlock;c.sprite.addChild(new b.Display.Text(a,{context:{x:f-c.chart.oneStrSize.en.width,y:g,fillStyle:"blank",textAlign:"right",textBaseline:"middle"}}))})}},e},{requires:["canvax/","visualization/utils/datasection","visualization/utils/tools"]});