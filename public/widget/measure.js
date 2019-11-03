/**
 * Created by admin on 2018/6/25.
 */
define([], function () {
    return {
    showLblBox: function (str)
        {
        var infobox = document.getElementById('lblInfoBox');
        infobox.style.left = getMouseXY().X + 10 + "px";
        infobox.style.top = getMouseXY().Y + 20 + "px";
        infobox.textContent = "长度为：" + str;
        infobox.style.display = "block"
         },
    hideLblBox:function () {
        var infobox = document.getElementById('lblInfoBox');
        infobox.style.display = "none"
     },
     moveToLine:function (arr) {
        var s=this;
            debugger;
         viewer.scene.skyBox.show = false;
         viewer.scene.skyAtmosphere.show = false;
         viewer.scene.globe.depthTestAgainstTerrain = false;
        var handler;
        var cartesian;
        var webMercatorProjection = new Cesium.WebMercatorProjection();
        var entity = viewer.entities.add({label: {show: false}});
        var pickedEntities = new Cesium.EntityCollection();
        var pickColor = Cesium.Color.YELLOW;//.withAlpha(0.5);
        function makeProperty(entity, color) {
            var colorProperty = new Cesium.CallbackProperty(function (time, result) {
                if (pickedEntities.contains(entity)) {
                    return pickColor.clone(result)
                }
                return color.clone(result)
            }, false);
            try {
                entity.polyline.material = new Cesium.ColorMaterialProperty(colorProperty)
            } catch (e) {
            }
        }

        if (arr.length >= 4) {
            for (var i = 0; i < arr.length - 3; i += 2) {
                try {
                    var line = viewer.entities.add({
                        name: 'pl',
                        polyline: {
                            positions: new Cesium.Cartesian3.fromDegreesArray([Number(arr[i]), Number(arr[i + 1]), Number(arr[i + 2]), Number(arr[i + 3])]),
                            width: 3.0
                        }
                    });
                    makeProperty(line, Cesium.Color.RED.withAlpha(0.5))
                } catch (e) {
                }
            }
        }
        var Len = 0;
        var cg, cs, x1, y1, x2, y2;
        for (var i = 0; i < arr.length - 1; i += 2) {
            if (i > 1) {
                cg = viewer.scene.globe.ellipsoid.cartesianToCartographic(Cesium.Cartesian3.fromDegrees(Number(arr[i - 2]), Number(arr[i - 1])));
                cs = webMercatorProjection.project(cg);
                x1 = cs.x;
                y1 = cs.y;
                cg = viewer.scene.globe.ellipsoid.cartesianToCartographic(Cesium.Cartesian3.fromDegrees(Number(arr[i]), Number(arr[i + 1])));
                cs = webMercatorProjection.project(cg);
                x2 = cs.x;
                y2 = cs.y;
                Len = Len + Math.round(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)), 0)
            }
            viewer.entities.add({
                name : 'Blue box',
                position: Cesium.Cartesian3.fromDegrees(Number(arr[i]), Number(arr[i + 1])),
                point: {
                    show: true,
                    color: Cesium.Color.SKYBLUE,
                    pixelSize: 5,
                    outlineColor: Cesium.Color.RED,
                    outlineWidth: 3
                },
                label: {
                    text: Len.toString() + " 米",
                    font: '20px sans-serif',
                    fillColor: Cesium.Color.RED,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    pixelOffset: new Cesium.Cartesian2(0.0, -10.0),
                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
                }
            })
        }
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            var pickedObjects =viewer.scene.drillPick(movement.endPosition);
            if (Cesium.defined(pickedObjects)) {
                pickedEntities.removeAll();
               s.hideLblBox();
                for (var i = 0; i < pickedObjects.length; ++i) {
                    var entity = pickedObjects[i].id;
                    try {
                        pickedEntities.add(entity);
                        if (entity.name == "pl") {
                            cg = viewer.scene.globe.ellipsoid.cartesianToCartographic(entity.polyline.positions.getValue()[0]);
                            cs = webMercatorProjection.project(cg);
                            x1 = cs.x;
                            y1 = cs.y;
                            cg = viewer.scene.globe.ellipsoid.cartesianToCartographic(entity.polyline.positions.getValue()[1]);
                            cs = webMercatorProjection.project(cg);
                            x2 = cs.x;
                            y2 = cs.y;
                            var Len1 = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                            Len1 = Math.round(Len1, 0);
                            s.showLblBox(Len1 + " 米")
                        }
                    } catch (e) {
                        s.hideLblBox()
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    measureLineDisys:function () {
        var tb=this;
            debugger;
        alert(4444);
        var arr = [];
        var isrigtclick = false;
        var isleftclick = false;
        viewer.scene.skyBox.show = false;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.globe.depthTestAgainstTerrain = false;
        var handler;
        var cartesian, longitudeString, latitudeString;
        var entities;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        var entity = viewer.entities.add({label: {show: false}});
        var pickedEntities = new Cesium.EntityCollection();
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            viewer.entities.remove(viewer.entities.getById(5));
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition,  viewer.scene.globe.ellipsoid);
            if (movement.endPosition && cartesian) {
                var cartographic =  viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
                if (isleftclick) {
                    entity.position = cartesian;
                    entity.label.show = true;
                    entity.label.font = '20px sans-serif';
                    entity.label.fillColor = Cesium.Color.YELLOW;
                    entity.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                    entity.label.pixelOffset = new Cesium.Cartesian2(0.0, -10.0);
                    entity.label.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5);
                    entity.label.text = ""
                }
                try {
                    viewer.entities.add({
                        id: 5,
                        name: 'pl',
                        polyline: {
                            positions: new Cesium.Cartesian3.fromDegreesArray([arr[arr.length - 2], arr[arr.length - 1], longitudeString, latitudeString]),
                            width: 3.0
                        }
                    })
                } catch (e) {
                }
                handler.setInputAction(function (rigtclick) {
                    var n = arr.length;
                    arr[n] = longitudeString;
                    arr[n + 1] = latitudeString;
                    if (!isrigtclick) {
                        tb.moveToLine(arr)
                    }
                    arr = [];
                    isleftclick = false;
                    isrigtclick = true;
                    entity.label.show = false;
                    handler = handler && handler.destroy()
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                handler.setInputAction(function (leftclick) {
                    isrigtclick = false;
                    isleftclick = true;
                    var n = arr.length;
                    arr[n] = longitudeString;
                    arr[n + 1] = latitudeString;
                    tb.moveToLine(arr)
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
}
});
