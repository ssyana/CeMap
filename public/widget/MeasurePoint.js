/**
 * Cemap
 * Created by yan on 2018/6/7.
 */
define(["dojo/_base/declare","dojo/text!./templates/MapLayerWidget.html"], function (de,mlw) {
    return de("widget/MeasurePoint",[],{
        buttonClickHandler: function ( obj ) {
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            //鼠标左击做的操作
            handler.setInputAction(function (click) {
                debugger;
                if (operation == 1) {
                    var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
                    var ray = viewer.scene.camera.getPickRay(click.position);
                    var position1 = viewer.scene.globe.pick(ray, viewer.scene);
                    var cartographic1 = scene.globe.ellipsoid.cartesianToCartographic(cartesian);//将笛卡尔坐标转换为地理坐标
                    // var cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
                    //获取坐标点
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var currentClickLon = Cesium.Math.toDegrees(cartographic1.longitude);//x
                    var currentClickLat = Cesium.Math.toDegrees(cartographic1.latitude);//y
                    var height = cartographic1.height;//z
                    console.log(currentClickLon, currentClickLat, height);
                    //flight=1为飞行，存储飞行画线的所有点
                    if (flight == 1) {
                        flightArray.push([currentClickLon, currentClickLat, height]);
                    }
                    //划线事件
                    mouseLeft(cartesian, cartographic, currentClickLon, currentClickLat, height);
                } else {
                    var pickedObject = viewer.scene.pick(click.position);
                    dianjiditu(pickedObject);
                }


                //	assignment(movement);
                //
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            //鼠标右键点击时做的操作
            handler.setInputAction(function (click) {
                debugger;
                var cartesian = viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
                var ray = viewer.scene.camera.getPickRay(click.position);
                var position1 = viewer.scene.globe.pick(ray, viewer.scene);
                var cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
                if (cartesian && isStartDraw) {
                    //获取坐标点
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var endPointLon = Cesium.Math.toDegrees(cartographic1.longitude);
                    var endPointLat = Cesium.Math.toDegrees(cartographic1.latitude);
                    console.log(endPointLon, endPointLat, height);
                    var height = cartographic1.height;
                    //flight=1为飞行，存储飞行画线的所有点
                    if (flight == 1) {
                        flightArray.push([endPointLon, endPointLat, height]);
                    }
                    //结束画线画面事件
                    mouseMiddle(cartesian, cartographic, endPointLon, endPointLat, height);
                }
                // mouseMiddle(click);
            }, Cesium.ScreenSpaceEventType.RIGHT_UP);
        }
    });
});