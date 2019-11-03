/**
 * Created by yan on 2018/6/15.
 */
/**
 * Created by yan on 2018/6/15.
 */
define([],function () {
    var imglayers = null;
    return {
        /*******添加影像矢量图层************/
        addimglayer:function (a) {
            debugger;
            if (imglayers) {
                imglayers.removeAll();
            }
            imglayers = viewer.imageryLayers;
            imglayers.addImageryProvider(a);
            // layers.alpha = 0.5;
        },
        /*******添加专题图层************/
        addlayer:function(a) {//
            var layers = viewer.imageryLayers;
            layers.addImageryProvider(a);
            layers.alpha = 0.5;
        }
    }
});