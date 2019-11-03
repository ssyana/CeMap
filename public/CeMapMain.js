/**
 * Created by yan on 2018/6/14.
 */
require.config({
    baseUrl : '.',
    paths : {
        domReady : './require/domReady',
        text : './require/text',
        less: './require/less',
        widget:'./widget'
    }
});
function ButtonClick(a,b) {//调用模块
    debugger;
    require(["widget/" + a], function (o) {
        debugger;
        o.buttonClickHandler(b);
    });
}
/**
 * Created by yan on 2018/6/12.
 */
var geoserver_url='http://localhost:8090';
var cemap_url='http://localhost:8081';
var viewer = null;
//初始视野
//109.865739, 40.637251, 100//87.618749, 43.763101, 400
var NOWVIEW={x:87.618749,y:43.763101,z:400};
//全图视野
//109.86421173419753, 40.63465536192148, 109.86683392776267, 40.636090430606124
var NOWALLVIEW={xmin:87.43639563700003,ymin:43.60322797600003,xmax:87.70166795200004,ymax:43.822577134000056};
//初始方向
var HADING=0;
//初始倾斜角度
var PITCH=-23;

function toolBoxclick(name) {
    debugger;
    var classname = $("#"+name)[0].className;
    var classname1=classname.split(" ")[0];

    //var classname2=classname.split("_")[0];
    if (classname1 == 'def') {
        var classname2=classname.split("def")[1];
        $("#"+name)[0].className = "act"+classname2;
        ButtonClick(name,true);
    } else {
        var classname2=classname.split("act")[1];
        $("#"+name)[0].className = "def"+classname2;
        ButtonClick(name,false);
    }

}
var loadingIndicator = document.getElementById('loadingIndicator');

/*********初始化地图******************/
var tdtsl = new Cesium.WebMapServiceImageryProvider({ //调用geoserver wms服务
    url: geoserver_url+'/geoserver/ydks/wms',
    layers: 'ydks:tsqsq', // GeoServer自带的图层名
    parameters: {
        service: 'WMS',
        format: 'image/png',
        transparent: true,
    }
});
createCesiumCircle(tdtsl);
// require(["widget/AddMapLayer","widget/MapUrl"], function (a,b) {
//     debugger;
//     createCesiumCircle(b.esriImageryProvider);
//     // a.addlayer(b.tdtyx_zj);
// });
loadingIndicator.style.display = 'none';
