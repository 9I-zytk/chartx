define("canvax/core/PropertyFactory",[],function(a){function b(a,c,e){function g(a,f){(!d[a]||d[a]&&"$"!==a.charAt(0))&&(c[a]=f);var g=typeof f;if("function"===g)d[a]||l.push(a);else{if(-1!==_.indexOf(i,a)||"$"===a.charAt(0)&&!e[a])return l.push(a);var m=function(d){var e,f=m.value,i=f;if(!arguments.length)return!f||"object"!==g||f instanceof Array||f.$model||(f.$parent=j,f=b(f,f),m.value=f),f;var k=typeof d;if(!h&&f!==d){!d||"object"!==k||d instanceof Array?f=d:(f=d.$model?d:b(d,d),e=f.$model),m.value=f,c[a]=e?e:f,e||j.$fire&&j.$fire(a,f,i),g!=k&&(g=k);var l=j;if(!j.$watch)for(;l.$parent;)l=l.$parent;l.$watch&&l.$watch.call(l,a,f,i)}};m.value=f,k[a]={set:m,get:m,enumerable:!0}}}var h=!0,i=a.$skipArray,j={},k={},l=_.keys(d);c=c||{},e=e||{},i=_.isArray(i)?i.concat(l):l;for(var m in a)g(m,a[m]);return j=f(j,k,l),_.forEach(l,function(b){a[b]&&("function"==typeof a[b]?j[b]=function(){a[b].apply(this,arguments)}:j[b]=a[b])}),j.$model=c,j.$accessor=k,j.hasOwnProperty=function(a){return a in j.$model},h=!1,j}function c(a,b,c){var d=a[b]&&a[b].set;return 3!==arguments.length?d():void d(c)}var d={$skipArray:0,$watch:1,$fire:2,$model:3,$accessor:4,$owner:5,$parent:7},e=Object.defineProperty;try{e({},"_",{value:"x"});var f=Object.defineProperties}catch(g){"__defineGetter__"in Object&&(e=function(a,b,c){return"value"in c&&(a[b]=c.value),"get"in c&&a.__defineGetter__(b,c.get),"set"in c&&a.__defineSetter__(b,c.set),a},f=function(a,b){for(var c in b)b.hasOwnProperty(c)&&e(a,c,b[c]);return a})}return!f&&window.VBArray&&(window.execScript(["Function parseVB(code)","	ExecuteGlobal(code)","End Function"].join("\n"),"VBScript"),f=function(a,b,d){a=d.slice(0),a.push("hasOwnProperty");var e="VBClass"+setTimeout("1"),f={},g=[];g.push("Class "+e,"	Private [__data__], [__proxy__]","	Public Default Function [__const__](d, p)","		Set [__data__] = d: set [__proxy__] = p","		Set [__const__] = Me","	End Function"),_.forEach(a,function(a){f[a]!==!0&&(f[a]=!0,g.push("	Public ["+a+"]"))});for(var h in b)f[h]=!0,g.push("	Public Property Let ["+h+"](val)",'		Call [__proxy__]([__data__], "'+h+'", val)',"	End Property","	Public Property Set ["+h+"](val)",'		Call [__proxy__]([__data__], "'+h+'", val)',"	End Property","	Public Property Get ["+h+"]","	On Error Resume Next","		Set["+h+'] = [__proxy__]([__data__],"'+h+'")',"	If Err.Number <> 0 Then","		["+h+'] = [__proxy__]([__data__],"'+h+'")',"	End If","	On Error Goto 0","	End Property");return g.push("End Class"),g.push("Function "+e+"Factory(a, b)","	Dim o","	Set o = (New "+e+")(a, b)","	Set "+e+"Factory = o","End Function"),window.parseVB(g.join("\r\n")),window[e+"Factory"](b,c)}),window.PropertyFactory=b,b});