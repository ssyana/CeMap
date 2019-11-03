/**
 * Cemap
 * Created by yan on 2018/6/7.
 */
define(['text!./templates/Draw.html'], function (Sth) {
    return {
        buttonClickHandler: function (obj) {
            // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            var _this = this;
            var static_w = document.getElementById("Draw_Show");
            if (static_w == null) {
                var static_ht = "<div id='Draw_Show' class='tabForm' title='标绘' style=' display: none;position:relative;background-color:rgba(247, 247, 247, 0); '></div>";
                $("body").append(static_ht);
            }
            document.getElementById("Draw_Show").innerHTML = Sth;
            $("#Draw_Show").show();
            $("#Draw_Show").dialog({ //加载拖动效果和关闭按钮
                modal: false,
                // maximizable: true,//最大化，默认false
                width: 500,
                height: 80,
                top: 100,
                left: 100,
                closeOnEscape: false, //按Esc键之后，不关闭对话框，默认为true
                collapsible: true, //可折叠，默认false
                onClose: function () {
                    debugger;
                    var className1=$("#DrawWidget")[0].className;
                    if(className1.split(" ")[0]=="act"){
                        $("#DrawWidget")[0].className = "def"+className1.split("act")[1];
                    }
                    _this.clearHandle();
                },
                resizable: false //,//可缩放，即可以通脱拖拉改变大小，默认false
            });
            $("#pointBtn").bind('click', function () {
                _this.drawPoint(function (positions) {
                    var wgs84_positions = [];
                    for (var i = 0; i < positions.length; i++) {
                        var wgs84_point = _this.Cartesian3_to_WGS84({
                            x: positions[i].x,
                            y: positions[i].y,
                            z: positions[i].z
                        });
                        wgs84_positions.push(wgs84_point);
                    }
                    
                    console.log(wgs84_positions);
                });
            });
            $("#lineBtn").bind('click', function () {
                _this.drawLineString(function (positions) {
                    var wgs84_positions = [];
                    for (var i = 0; i < positions.length; i++) {
                        var wgs84_point = _this.Cartesian3_to_WGS84({
                            x: positions[i].x,
                            y: positions[i].y,
                            z: positions[i].z
                        });
                        wgs84_positions.push(wgs84_point);
                    }
                    debugger;
                    console.log(JSON.stringify(wgs84_positions));
                    console.log(wgs84_positions);
                });
            });
            $("#polyBtn").bind('click', function () {
                _this.drawPolygon(function (positions) {
                    var wgs84_positions = [];
                    for (var i = 0; i < positions.length; i++) {
                        var wgs84_point = _this.Cartesian3_to_WGS84({
                            x: positions[i].x,
                            y: positions[i].y,
                            z: positions[i].z
                        });
                        wgs84_positions.push(wgs84_point);
                    }
                    console.log(wgs84_positions);
                });
            });
            $("#rectBtn").bind('click', function () {
                _this.drawRect(function (positions) {
                    var wgs84_positions = [];
                    for (var i = 0; i < positions.length; i++) {
                        var wgs84_point = _this.Cartesian3_to_WGS84({
                            x: positions[i].x,
                            y: positions[i].y,
                            z: positions[i].z
                        });
                        wgs84_positions.push(wgs84_point);
                    }
                    console.log(wgs84_positions);
                });
            });
            $("#clearBtn").bind('click', function () {
                _this.clearHandle();
            });
        },
        //画点
        drawPoint: function (callback) {
            var _this = this;
            //坐标存储
            var positions = [];

            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

            //单击鼠标左键画点
            handler.setInputAction(function (movement) {
                var cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                positions.push(cartesian);
                viewer.entities.add({
                    position: cartesian,
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 5,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            //单击鼠标右键结束画点
            handler.setInputAction(function (movement) {
                handler.destroy();
                callback(positions);
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        },
        //画线
        drawLineString: function (callback) {
            var _this = this;
            var PolyLinePrimitive = (function () {
                function _(positions) {
                    this.options = {
                        polyline: {
                            show: true,
                            positions: [],
                            material: Cesium.Color.RED,
                            width: 3
                        }
                    };
                    this.positions = positions;
                    this._init();
                }

                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.positions;
                    };
                    //实时更新polyline.positions
                    this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                    viewer.entities.add(this.options);
                };
                return _;
            })();

            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            var positions = [];
            var poly = undefined;
            //鼠标左键单击画点
            handler.setInputAction(function (movement) {
                var cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                viewer.entities.add({
                    position: cartesian,
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 5,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            //鼠标移动
            handler.setInputAction(function (movement) {
                var cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                if (positions.length >= 2) {
                    if (!Cesium.defined(poly)) {
                        poly = new PolyLinePrimitive(positions);
                    } else {
                        if (cartesian != undefined) {
                            positions.pop();
                            cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            //单击鼠标右键结束画线
            handler.setInputAction(function (movement) {
                debugger;
                handler.destroy();
                callback(positions);
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        },
        //画面
        drawPolygon: function (callback) {
            var _this = this;
            var PolygonPrimitive = (function () {
                function _(positions) {
                    this.options = {
                        name: '多边形',
                        polygon: {
                            hierarchy: [],
                            perPositionHeight: true,
                            material: Cesium.Color.RED.withAlpha(0.4)
                        }
                    };
                    this.hierarchy = positions;
                    this._init();
                }

                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.hierarchy;
                    };
                    //实时更新polygon.hierarchy
                    this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                    viewer.entities.add(this.options);
                };
                return _;
            })();

            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            var positions = [];
            var poly = undefined;

            //鼠标单击画点
            handler.setInputAction(function (movement) {
                debugger;
                var cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                viewer.entities.add({
                    position: cartesian,
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 5,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            //鼠标移动
            handler.setInputAction(function (movement) {
                var cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                if (positions.length >= 2) {
                    if (!Cesium.defined(poly)) {
                        poly = new PolygonPrimitive(positions);
                    } else {
                        if (cartesian != undefined) {
                            positions.pop();
                            cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            //鼠标右键单击结束绘制
            handler.setInputAction(function (movement) {
                handler.destroy();
                callback(positions);
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        },
        //画矩形
        drawRect: function (callback) {
            let _self = this;
            let pointsArr = [];
            _self.shape = {
                points: [],
                rect: null,
                entity: null
            };
            var tempPosition;
            var handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            //鼠标左键单击画点
            handle.setInputAction(function (click) {
                tempPosition = _self.getPointFromWindowPoint(click.position);
                //选择的点在球面上
                if (tempPosition) {
                    if (_self.shape.points.length == 0) {
                        pointsArr.push(tempPosition);
                        _self.shape.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                        _self.shape.rect = Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                        _self.shape.rect.east += 0.000001;
                        _self.shape.rect.north += 0.000001;
                        _self.shape.entity = viewer.entities.add({
                            rectangle: {
                                coordinates: _self.shape.rect,
                                material: Cesium.Color.BLACK.withAlpha(0.4),
                                outline: true,
                                outlineWidth: 2,
                                outlineColor: Cesium.Color.RED,
                                height: 0
                            }
                        });
                        _self.bufferEntity = _self.shape.entity;
                    }
                    else {
                        handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                        handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                        callback(pointsArr);
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            //鼠标移动
            handle.setInputAction(function (movement) {
                if (_self.shape.points.length == 0) {
                    return;
                }
                var moveEndPosition = _self.getPointFromWindowPoint(movement.endPosition);
                //选择的点在球面上
                if (moveEndPosition) {
                    pointsArr[1] = moveEndPosition;
                    _self.shape.points[1] =viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
                    _self.shape.rect = Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                    if (_self.shape.rect.west == _self.shape.rect.east)
                        _self.shape.rect.east += 0.000001;
                    if (_self.shape.rect.south == _self.shape.rect.north)
                        _self.shape.rect.north += 0.000001;
                    _self.shape.entity.rectangle.coordinates = _self.shape.rect;
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },
        //清除所有Entity和ImageryLayers
        clearHandle: function () {
            debugger;
            //移除所有实体Entity
            viewer.entities.removeAll();
            //移除cesium加载的ImageryLayer
            for (var i = 0; i < this.removeImageryLayers.length; i++) {
                viewer.imageryLayers.remove(this.removeImageryLayers[i]);
            }
        },
        getPointFromWindowPoint(point) {
            if (viewer.scene.terrainProvider.constructor.name == "EllipsoidTerrainProvider") {
                return viewer.camera.pickEllipsoid(point, viewer.scene.globe.ellipsoid);
            } else {
                var ray = viewer.scene.camera.getPickRay(point);
                return viewer.scene.globe.pick(ray, viewer.scene);
            }
        },
        //笛卡尔坐标系转WGS84坐标系
        Cartesian3_to_WGS84: function (point) {
            var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var alt = cartographic.height;
            return { lat: lat, lng: lng, alt: alt };
        },
        //WGS84坐标系转笛卡尔坐标系
        WGS84_to_Cartesian3: function (point) {
            var car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
            var x = car33.x;
            var y = car33.y;
            var z = car33.z;
            return { x: x, y: y, z: z };
        }
    }
});