define("chartx/utils/dataformat",[],function(){return function(a,b){var c={org:[],data:[],yAxis:{field:[],org:[]},xAxis:{field:[],org:[]}};if(!a||0==a.length)return c;var d=a;c.org=d;var e=d[0]?d[0]:[];this.yAxis&&(c.yAxis.field=this.yAxis.field),this.xAxis&&(c.xAxis.field=this.xAxis.field),b&&(b.yAxis&&(c.yAxis.field,b.yAxis.field),b.xAxis&&(c.xAxis.field,b.xAxis.field));for(var f=[],g=0,h=e.length;h>g;g++){var i={};i.field=e[g],i.index=g,i.data=[],f.push(i)}c.data=f;var j=function(a,b,c){for(var d=_.filter(b,function(b){return _.some(a,function(a){return b.field==a})}),e=[],f=0,g=a.length;g>f;f++)for(var h=0,i=d.length;i>h;h++)if(a[f]==d[h].field){e.push(d[h].data);break}return e},k=c.xAxis.field;k&&""!=k&&(!_.isArray(k)||0!=k.length&&_.find(f,function(a){return _.indexOf(k,a.field)>=0?!0:!1}))?_.isString(k)&&(k=[k]):k=c.xAxis.field=[f[0].field];var l=c.yAxis.field;!l||""==l||_.isArray(l)&&0==l.length?l=_.difference(e,k):_.isString(l)&&(l=[l]),c.yAxis.field=l;for(var g=1,h=d.length;h>g;g++)for(var m=0,n=d[g].length;n>m;m++){var o=d[g][m];_.indexOf(c.yAxis.field,d[0][m])>=0&&(o=Number(o)),f[m].data.push(o)}return c.xAxis.org=j(k,f),c.yAxis.org=j(l,f),c}});