KISSY.add("visualization/utils/tools",function(a){return{probOneStrSize:function(){a.all("body").append("<span style='line-height:1;visibility:hidden;position:absolute;left:0;top:0;' id='off-the-cuff-str'>8</span>");var b=a.all("#off-the-cuff-str"),c={en:{width:b.width(),height:b.height()}};return b.html("\u56fd"),c.cn={width:b.width(),height:b.height()},b.remove(),b=null,c},getChildsArr:function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];b=b.concat(e)}return b},getArrScales:function(a){for(var b=[],c=0,d=0,e=0,f=[],g=0,h=a.length;h>g;g++)a[g]=Number(a[g]),c+=a[g];for(var i=0,j=a.length;j>i;i++){var k=Math.round(a[i]/c*100);if(f.push(k),i==a.length-1){for(var l=0,m=0,n=f.length-1;n>m;m++)l+=f[m];l=100-l,l=0>l?0:l,k=l}b.push(k)}c=0;for(var o=0,p=b.length;p>o;o++)b[o]=isNaN(b[o])||b[o]<0?0:b[o],d<b[o]&&(d=b[o],e=o),c+=b[o];return c>100?b[e]=b[e]-(c-100):100>c&&(b[e]=b[e]+(100-c)),b},numAddSymbol:function(a,b){var c=Number(a),d=b?b:",";if(!c)return a;if(c>=1e3){var e=parseInt(c/1e3);return a.toString().replace(e,e+d)}return c}}});