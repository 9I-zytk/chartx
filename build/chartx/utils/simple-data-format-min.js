define("chartx/utils/simple-data-format",[],function(){return function(a,b){var c={org:[],data:{},graphs:{field:[]}};c.org=a;var d=a.shift(0);_.each(d,function(b,d){var e=[];_.each(a,function(a){e.push(a[d])}),c.data[b]=e});var e=[];return e=b&&b.field?b.field:d,c.graphs.field=e,c}});