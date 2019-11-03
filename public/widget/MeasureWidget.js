/**
 * Created by admin on 2018/6/19.
 */
define(['widget/measure'], function (a) {
    return {
        buttonClickHandler: function (obj) {
            debugger;
            require(["widget/measure"], function (o) {
                debugger;
                o.measureLineDisys();
            });
           // a.measureLineDisys();
           //this.measureDistance(obj);
        },
        measureDistance:function(obj){
            debugger;
            var polyline;
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            //var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function(movement) {
                var position1;
                var cartographic;
                isDraw = true;
                var ray = viewer.scene.camera.getPickRay(movement.endPosition);
                if(ray)
                    position1 = viewer.scene.globe.pick(ray,viewer.scene);
                if(position1)
                    cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
                if(cartographic) {
                    //海拔
                    var height = viewer.scene.globe.getHeight(cartographic);
                    //地理坐标（弧度）转经纬度坐标
                    var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                    if (isDraw) {
                        tooltip.style.left = movement.endPosition.x + 10 + "px";
                        tooltip.style.top = movement.endPosition.y + 20 + "px";
                        tooltip.style.display = "block";
                        if (polylinePath.length < 1) {
                            return;
                        }
                        if (!Cesium.defined(polyline)) {
                            polylinePath.push(point);
                            polyline = new CreatePolyline(polylinePath,cesium);
                        } else {
                            polyline.path.pop();
                            polyline.path.push(point);
                        }
                        if(polylinePath.length>=1){
                            if(polyline && polyline.path){
                                var distance=getDistance(polyline.path);
                                tooltip.innerHTML='<p>长度：'+distance+'</p><p>双击确定终点</p>';
                            }
                        }
                    }
                }

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction(function(movement) {
                debugger;
                var position1;
                isDraw = true;
                var cartesian = viewer.camera.pickEllipsoid(movement.position, scene.globe.ellipsoid);
                var ray = viewer.scene.camera.getPickRay(movement.position);
                var cartographic1 =  scene.globe.ellipsoid.cartesianToCartographic(cartesian);//将笛卡尔坐标转换为地理坐标
                // var cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
                //获取坐标点
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var currentClickLon = Cesium.Math.toDegrees(cartographic1.longitude);//x
                var currentClickLat = Cesium.Math.toDegrees(cartographic1.latitude);//y
                var height = cartographic1.height;//z
                if(cartographic){
                    //海拔
                    var height = viewer.scene.globe.getHeight(cartographic);
                    //地理坐标（弧度）转经纬度坐标
                    var point = Cesium.Cartesian3.fromDegrees(cartographic1.longitude / Math.PI * 180,cartographic1.latitude / Math.PI * 180,height);
                    // var point = Cesium.Cartesian3.fromDegrees(currentLon,currentLat,height);
                    if (isDraw) {
                        //polylinePath.push(cartographic);
                        polylinePath.push(point);
                        if(polyline)
                            polyline.path.pop();
                        SurfaceLine(cartographic);
                        var text="起点";
                        if(polyline){
                            text=getDistance(polyline.path);
                        }
                        entities.push(viewer.entities.add({
                            position: point,
                            point: {
                                heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                                show: true,
                                color: Cesium.Color.SKYBLUE,
                                pixelSize: 3,
                                outlineColor: Cesium.Color.YELLOW,
                                outlineWidth: 1
                            },
                            label: {
                                text: text,
                                font: '12px sans-serif',
                                style : Cesium.LabelStyle.FILL,
                                outlineWidth : 1,
                                fillColor:Cesium.Color.WHITE,
                                showBackground:false,
                                backgroundColor:Cesium.Color.ORANGE.withAlpha(0.6),
                                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                                pixelOffset: new Cesium.Cartesian2(5.0,-20.0),
                            }
                        }));
                    }
                }

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.setInputAction(function() {
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                //handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                //viewer.zoomTo(polyline.lineEntity);
                viewer.trackedEntity = undefined;
                isDraw = false;
                //viewer.scene.globe.depthTestAgainstTerrain = false;
                billboard=billboards.add({
                    show : true,
                    id:"measureTool",
                    position : polylinePath[polylinePath.length-1],
                    pixelOffset : new Cesium.Cartesian2(0.0, 20),
                    eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                    horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin : Cesium.VerticalOrigin.CENTER,
                    scale : 1.0,
                    image: GLOBAL.domainResource+'/systems/common-bx-gis/models/cesium/images/close.png',
                    color : new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                });

                tooltip.style.display = "none";
                //关闭按钮执行事件
                handler.setInputAction(function(movement){
                    var pickedObjects ={};
                    pickedObjects=scene.drillPick(movement.position);
                    if (Cesium.defined(pickedObjects)) {
                        for (var i = 0; i < pickedObjects.length; i++)
                            if (pickedObjects[i].primitive == billboard){
                                viewer.entities.remove(polyline.lineEntity);
                                for(var j=0;j<entities.length;j++){
                                    viewer.entities.remove(entities[j]);
                                }
                                entities=[];
                                billboards.remove(billboard);
                                polylinePath = [];
                                polyline = undefined;
                                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                            }
                    }
                },Cesium.ScreenSpaceEventType.LEFT_CLICK);

            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        }

    };

});

