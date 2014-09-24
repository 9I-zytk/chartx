
KISSY.ready(function(){

    var S = KISSY;
    var data1= [
        ["val1","val2","val3","val4"],
        [ 1 , 101  , 201 , 301 ] ,
        [ 2  , 0 , 145 , 100 ] ,
        [ 3 , 488  , 88  , 700 ] ,
        [ 4  , 390  , 546 , 300 ]
    ];
    var options = {
        // title : "first charts",
        // disXAxisLine : 26,
        // disYAxisTopLine : 26,
        //rotate   : -90,
        disYAndO : 20,
        mode  : 1,                                  //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[默认：1]
        yAxis : {
            mode     : 1,                           //模式( 1 = 正常 | 2 = 显示两条(最下面 + 最上面 且与背景线不对其))
            field   : ["val4","val3"],
            dataMode : 0,
            line:{
                enabled : 0,
                // strokeStyle : '#ff0000'
            },
            text:{
                fillStyle:'#999999',
                fontSize  : 12
            }
        },
        xAxis : {
            // field : "val2",
            disY: 6,
            dis : 6,
            line:{
                width   : 2,
                height  : 4,
                strokeStyle   : '#cccccc'
            },
            text:{
                fontSize  : 10
            }
        },
        back : {
            xOrigin:{
                thinkness:1,
                strokeStyle : '#333333'
            },
            yOrigin:{
                enabled:0
            },
            xAxis:{
                // lineType: ''
                thinkness:1,
                strokeStyle : '#cccccc'
            },
            yAxis:{
                // enabled : 0
            }
        },
        graphs:{
            bar : {
                strokeStyle : {
                    normals : ['#f8ab5e','#E55C5C'],
                },
                alpha       : {
                    normals : [0.8, 0.7],
                },
                fillStyle : function( line , row , value ){
                }

            }
        },       
        tips  :{
            titles : [
               ["title1" , "title2" , "title3" , "title4"],
               ["title" , "title" , "title" , "title"]
            ],
            // disTop : 50,
            context:{
                prefix:{
                    values:['今','昨','明']
                },
                bolds     :['bold','bold','bold'],
                fontSizes :[14,14,14],
                fillStyles:['#333333','#999999','#999999']
            },
            tip  : {
                back:{
                    //strokeStyle : '#ff0000'
                    // disX:10
                }
            },
            line : {
                // lineType: ''
            },
            nodes:{

            }
        }
    }
     

    KISSY.config({
        packages: [{
            name  :  'dvix'  ,
            path  :  '../../',
            // path  :  'http://g.assets.daily.taobao.net/thx/charts/1.0.0/',
            debug :  true
        }
        ]
    });



    KISSY.use("dvix/chart/bar/ , node" , function( S , Bar ){

        window.bar = new Bar( S.all("#canvasTest") );
        bar.draw( data1 , options );
        window.data1   = data1;
        window.options = options;

    });
});