/**
 * Created by admin on 2018/6/19.
 */
define([], function () {
    var temp = new Array();
    return {
        buttonClickHandler: function (obj) {
            //topojson加载topojson
            // var promise= viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/publicRequeryPart/js/ne_10m_us_states.topojson', {
            //     stroke: Cesium.Color.BLACK,
            //     fill: Cesium.Color.RED,
            //     strokeWidth: 3,
            //     markerSymbol: '?'
            // }));
            // viewer.flyTo(promise);
            //GEOjson
            Cesium.Math.setRandomNumberSeed(0);
            var promise = Cesium.GeoJsonDataSource.load('./js/tsq.json');
            promise.then(function (dataSource) {
                debugger;
                if (obj) {
                    viewer.dataSources.add(dataSource);

                    //Get the array of entities
                    var entities = dataSource.entities.values;
                    var colorHash = {};
                    for (var i = 0; i < entities.length; i++) {
                        //For each entity, create a random color based on the state name.
                        //Some states have multiple entities, so we store the color in a
                        //hash so that we use the same color for the entire state.
                        var entity = entities[i];
                        entity.nameID = i;
                        var name = entity.name;
                        var color = colorHash[name];
                        if (!color) {
                            color = Cesium.Color.fromRandom({
                                alpha: 1.0
                            });
                            colorHash[name] = color;
                        }
                        if (entity.polygon != null) {
                            //Set the polygon material to our random color.
                            entity.polygon.material = color;
                            //Remove the outlines.
                            entity.polygon.outline = false;
                            //Extrude the polygon based on the state's population.  Each entity
                            //stores the properties for the GeoJSON feature it was created from
                            //Since the population is a huge number, we divide by 50.
                            entity.polygon.extrudedHeight = entity.properties.Population / 50.0;
                        }
                    }
                } else {
                    viewer.dataSources.remove(viewer.dataSources.get(0));
                }


                window.Hightlightline = function (nameid) {
                    debugger;
                    var exists = temp.indexOf(nameid);
                    if (exists <= -1) {
                        Highlight(nameid, 50, 50);
                        temp.push(nameid);  // 添加线nameID到数组，
                    }
                    else  //已经是高亮状态了 再次点击修改为原始状态
                    {
                        Highlight(nameid, 10, 10);
                        temp.splice(exists, 1);  //删除对应的nameID
                    }
                }
                window.Highlight = function (nameid, width1, width2) {
                    debugger;
                    for (var o = 0; o < entities.length; o++) {
                        var m = entities[o];
                        if (nameid == o) {
                            // m.polygon.width = width1;
                            (m.polygon.material = new Cesium.PolylineGlowMaterialProperty({
                                glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                                color: Cesium.Color.ORANGERED.withAlpha(.9)
                            }), width2)
                        }
                    }
                }
            }).otherwise(function (error) {
                //Display any errrors encountered while loading.
                window.alert(error);
            });
            viewer.flyTo(promise);

            //点击事件


            // viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
            //     debugger;
            //     var pickedFeature = viewer.scene.pick(movement.position);
            //     if (typeof (pickedFeature) != "undefined")   //鼠标是否点到线上
            //     {
            //         var name_id = pickedFeature.id.nameID;  //获取每条线的nameID
            //         Hightlightline(name_id);
            //     }
            // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            //普通json
            // Cesium.Math.setRandomNumberSeed(0);
            // Cesium.loadJson('/../Apps/Points.json').then(function(jsonData) {
            //     for (var i =0 ;i<=jsonData.features.length-10; i++) {
            //         var ifeature=jsonData.features[i];
            //         for (var k = 0;k<ifeature.geometry.paths[0].length-10; k++) {
            //             if (ifeature.geometry.paths[0][k].length==2) {
            //                 viewer.entities.add({
            //                     position : Cesium.Cartesian3.fromDegrees(ifeature.geometry.paths[0][k][0],ifeature.geometry.paths[0][k][1]),
            //                     point : {
            //                         pixelSize : 10,
            //                         color :Cesium.Color.YELLOW
            //                     }
            //                 });
            //             }
            //         }
            //     }
            // }).otherwise(function(error) {
            // });



        }
    };

});

