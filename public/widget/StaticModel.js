/**
 * Created by yan on 2018/8/7.
 */
define(['text!./templates/StaticModel.html'], function (Sth) {
    var Stathis = null;
    var scene = null;
    var L_Primitive = null;
    var camera = null;
    return {
        buttonClickHandler: function (obj) {
            debugger
            Stathis = this;
            var static_w = document.getElementById("StaModel_Show");
            if (static_w == null) {
                var static_ht = "<div id='StaModel_Show' class='tabForm' title='模型操作' style=' display: none;position:relative;background-color:rgba(247, 247, 247, 0); '></div>";
                $("body").append(static_ht);
            }
            document.getElementById("StaModel_Show").innerHTML = Sth;
            $("#StaModel_Show").show();
            $("#StaModel_Show").dialog({ //加载拖动效果和关闭按钮
                modal: false,
                // maximizable: true,//最大化，默认false
                width: 300,
                height: 280,
                top: 100,
                left: 100,
                closeOnEscape: false, //按Esc键之后，不关闭对话框，默认为true
                //collapsible: true, //可折叠，默认false
                hide:'slide' ,
                onClose: function () {
                    debugger;
                    var className1 = $("#StaticModel")[0].className;
                    if (className1.split(" ")[0] == "act") {
                        $("#StaticModel")[0].className = "def" + className1.split("act")[1];
                    }
                    Stathis.Remove_Dm();
                },
                resizable: false //,//可缩放，即可以通脱拖拉改变大小，默认false
            });
            scene = viewer.scene;
            camera = viewer.camera;
            if (obj) {
                Stathis.Action();
            } else {
                Stathis.Remove_Dm();
            }
            $("#view_reset").off('click');
            $("#view_reset").on('click', function () {
                Stathis.view_reset();
            });

        },
        Action: function () {
            debugger

            // function getBimHtml(pickedFeature) {
            //     debugger
            //     if (!pickedFeature.tileset.properties || !pickedFeature.tileset.properties.length)
            //         return false;
            //     var fileParams;
            //     //如果有文件名，那么依据文件名
            //     if (pickedFeature.hasProperty("file")) {
            //         var file = pickedFeature.getProperty("file");
            //         for (var i = 0; i < pickedFeature.tileset.properties.length; i++) {
            //             var params = pickedFeature.tileset.properties[i];
            //             if (params.file == file) {
            //                 fileParams = params.params;
            //             }
            //         }
            //     }
            //     //直接取第一个
            //     else {
            //         fileParams = pickedFeature.tileset.properties[0].params;
            //     }
            //     if (!fileParams)
            //         return false;
            //     // 名称和 id
            //     var html = '<table class="cesium-infoBox-defaultTable"><tbody>';
            //     html += '<tr><th>名称(name)</th><td>' + pickedFeature.getProperty("name") + '</td></tr>';
            //     html += '<tr><th>楼层(LevelName)</th><td>' + pickedFeature.getProperty("LevelName") + '</td></tr>';
            //     html += '<tr><th>分类(CategoryName)</th><td>' + pickedFeature.getProperty("CategoryName") + '</td></tr>';
            //     html += '<tr><th>族(FamilyName)</th><td>' + pickedFeature.getProperty("FamilyName") + '</td></tr>';
            //     html += '<tr><th>族类型(FamilySymbolName)</th><td>' + pickedFeature.getProperty("FamilySymbolName") + '</td></tr>';
            //     html += '<tr><th>ID(id)</th><td>' + pickedFeature.getProperty("id") + '</td></tr>'
            //     //依据group分类
            //     var groups = {
            //     };
            //     function getValue(value, defp) {
            //         debugger
            //         if (defp.type == "YesNo")
            //             return value == 1 ? '是' : '否';
            //         if (defp.type == "Length")
            //             return (value * 0.3048).toFixed(2) + 'm';
            //         if (defp.type == "Area")
            //             return (value * 0.3048 * 0.3048).toFixed(2) + '㎡';
            //         if (defp.type == "Volume")
            //             return (value * 0.3048 * 0.3048 * 0.3048).toFixed(2) + 'm³';
            //         return value;
            //     }
            //     function addGroup(name, value) {
            //         var defp;
            //         for (var i = 0; i < fileParams.length; i++) {
            //             var fp = fileParams[i];
            //             if (name == fp.name) {
            //                 defp = fp;
            //                 break;
            //             }
            //         }
            //         if (!defp)
            //             return;
            //         var rows = groups[defp.group];
            //         if (!rows) {
            //             rows = [];
            //         }
            //         var row = '<tr><th>' + defp.name + '</th><td>' + getValue(value, defp) + '</td></tr>';
            //         rows.push(row);
            //         groups[defp.group] = rows;
            //     }
            //     function groupName(group) {
            //         if (group == "PG_IDENTITY_DATA")
            //             return "标识数据";
            //         if (group == "PG_GEOMETRY")
            //             return "尺寸标注";
            //         if (group == "PG_PHASING")
            //             return "阶段化";
            //         if (group == "PG_CONSTRAINTS")
            //             return "约束";
            //         if (group == "INVALID")
            //             return '其他';
            //         if (group == "PG_MATERIALS")
            //             return '材质和装饰';
            //         if (group == "PG_CONSTRUCTION")
            //             return '构造';
            //         return group;
            //     }
            //     var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);
            //     for (var i = 0; i < names.length; i++) {
            //         var n = names[i];
            //         addGroup(n, pickedFeature.getProperty(n));
            //     }
            //     for (group in groups) {
            //         html += '<tr><th colspan="2">' + groupName(group) + '</th></tr>';;
            //         var rows = groups[group];
            //         for (var i = 0; i < rows.length; i++) {
            //             html += rows[i];
            //         }
            //     }
            //     return html;
            // }

            var featureViewer = {
                colorHighlight: Cesium.Color.YELLOW.withAlpha(0.5),
                colorSelected: Cesium.Color.LIME.withAlpha(0.5),
                setMouseOver: function (v) {
                    debugger
                    if (v) {
                        this.viewer.screenSpaceEventHandler.setInputAction(this.onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    } else {

                        this.restoreHighlight();

                        this.nameOverlay.style.display = 'none';
                        this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    }
                },
                setMouseClick: function (v) {
                    debugger
                    if (v) {
                        this.orginClickHandler = this.viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                        this.viewer.screenSpaceEventHandler.setInputAction(this.onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    } else {

                        //设置为原来的
                        this.viewer.screenSpaceEventHandler.setInputAction(this.orginClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    }
                },
                install: function (viewer) {


                    var nameOverlay = document.createElement('div');
                    viewer.container.appendChild(nameOverlay);
                    nameOverlay.className = 'backdrop';
                    nameOverlay.style.display = 'none';
                    nameOverlay.style.position = 'absolute';
                    nameOverlay.style.bottom = '0';
                    nameOverlay.style.left = '0';
                    nameOverlay.style['pointer-events'] = 'none';
                    nameOverlay.style.padding = '4px';
                    nameOverlay.style.backgroundColor = 'black';
                    nameOverlay.style.color = "white";
                    this.nameOverlay = nameOverlay;

                    var selected = {
                        feature: undefined,
                        originalColor: new Cesium.Color()
                    };


                    var highlighted = {
                        feature: undefined,
                        originalColor: new Cesium.Color()
                    };


                    selectedEntity = new Cesium.Entity();

                    this.viewer = viewer;

                    var leftDown = false;
                    var middleDown = false;

                    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
                        leftDown = true;
                    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

                    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
                        leftDown = false;
                    }, Cesium.ScreenSpaceEventType.LEFT_UP);

                    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
                        middleDown = true;
                    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

                    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
                        middleDown = false;
                    }, Cesium.ScreenSpaceEventType.MIDDLE_UP);

                    this.restoreHighlight = function () {
                        // If a feature was previously highlighted, undo the highlight
                        if (Cesium.defined(highlighted.feature)) {

                            try {
                                highlighted.feature.color = highlighted.originalColor;

                            } catch (ex) {

                            }
                            highlighted.feature = undefined;
                        }
                    }

                    this.onMouseMove = function (movement) {
                        self.restoreHighlight();

                        if (middleDown || leftDown) {
                            nameOverlay.style.display = 'none';
                            return;
                        }

                        // Pick a new feature
                        var pickedFeature = viewer.scene.pick(movement.endPosition);
                        if (!Cesium.defined(pickedFeature)) {
                            nameOverlay.style.display = 'none';
                            return;
                        }

                        if (!Cesium.defined(pickedFeature.getProperty)) {
                            nameOverlay.style.display = 'none';
                            return;
                        }
                        // A feature was picked, so show it's overlay content

                        var name = pickedFeature.getProperty('地址');
                        if (!Cesium.defined(name)) {
                            name = pickedFeature.getProperty('zl');
                        }
                        if (!Cesium.defined(name)) {
                            name = pickedFeature.getProperty('OBJECTID');
                        }
                        if (!Cesium.defined(name)) {
                            name = pickedFeature.getProperty('objectid');
                        }
                        if (name == '') {
                            nameOverlay.style.display = 'none';
                            return;
                        }

                        nameOverlay.style.display = 'block';
                        nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
                        nameOverlay.style.left = movement.endPosition.x + 'px';

                        nameOverlay.textContent = name;

                        // Highlight the feature if it's not already selected.
                        if (pickedFeature !== selected.feature) {
                            highlighted.feature = pickedFeature;
                            Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
                            pickedFeature.color = self.colorHighlight;
                        }
                    };

                    var self = this;
                    this.onLeftClick = function (movement) {
                        debugger
                        
                        // If a feature was previously selected, undo the highlight
                        if (Cesium.defined(selected.feature)) {

                            try {
                                selected.feature.color = selected.originalColor;

                            } catch (ex) {

                            }
                            selected.feature = undefined;
                        }
                        // Pick a new feature
                        var pickedFeature = viewer.scene.pick(movement.position);
                        var featureName = pickedFeature.getProperty('zl');//获取属性
                        
                        if(featureName=='门口'){
                            Stathis.showVideo();
                            return
                        }
                        if (!Cesium.defined(pickedFeature)) {
                            self.orginClickHandler(movement);
                            return;
                        }

                        // Select the feature if it's not already selected
                        if (selected.feature === pickedFeature) {
                            return;
                        }

                        if (!Cesium.defined(pickedFeature.getProperty)) {
                            return;
                        }

                        selected.feature = pickedFeature;

                        // Save the selected feature's original color
                        if (pickedFeature === highlighted.feature) {
                            Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
                            highlighted.feature = undefined;
                        } else {
                            Cesium.Color.clone(pickedFeature.color, selected.originalColor);
                        }

                        // Highlight newly selected feature
                        pickedFeature.color = self.colorSelected;

                        // Set feature infobox description


                        
                        selectedEntity.name = featureName;
                        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                        viewer.selectedEntity = selectedEntity;

                        var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);


                        // 普通3dtiles 获取属性表格
                        var html = null;//getBimHtml(pickedFeature);

                        if (!html) {
                            html = '<table class="cesium-infoBox-defaultTable"><tbody>';

                            for (var i = 0; i < names.length; i++) {
                                var n = names[i];
                                if ('cg,cs,lh,maxheight,minheight,szcs,zgd'.indexOf(n) >= 0) {
                                    continue
                                }
                                html += '<tr><th>' + n + '</th><td>' + pickedFeature.getProperty(n) + '</td></tr>'
                            }
                            html += '</tbody></table>';
                        }
                        
                        selectedEntity.description = html;

                    }

                    this.setMouseOver(true);
                    this.setMouseClick(true);
                }


            };
            featureViewer.install(viewer);
            //3Dtiles模型加载
            // viewer.scene.globe.depthTestAgainstTerrain = true;
            var tileset = new Cesium.Cesium3DTileset({ //在场景添加tileset
                //name: "lw",
                url: cemap_url+'/tsqlz/tileset.json',
                //url: cemap_url+'/3dtile/tileset.json',
                // url: cemap_url + '/3d1/tileset.json',
                //url: cemap_url+'/NewYork/tileset.json',
                maximumScreenSpaceError: 2,
                maximumNumberOfLoadedTiles: 10000
            });

            var tilesetscene = viewer.scene.primitives.add(tileset);
            debugger
            tileset.allTilesLoaded.addEventListener(function(e) {
                
                console.log('All tiles are loaded');
            });
            // tileset.readyPromise.then(function(tileset) {
            //     debugger
            //     var boundingSphere = tileset.boundingSphere; 
            //     var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
            // // var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
            // // var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
            // // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            // });
            //模型贴地
            //var boundingSphere = null; // = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(111.5652101, 38.70350851, 100.500143), 143.6271004);
            // function zoomToTileset() {
            //     // boundingSphere = tilesetscene.boundingSphere;
            //     // viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
            //     viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            //     changeHeight(0);
            // }
            //模型贴地高度设置
            function changeHeight(height) {
                height = Number(height);
                if (isNaN(height)) {
                    return;
                }
                var cartographic = Cesium.Cartographic.fromCartesian(tilesetscene.boundingSphere.center);
                var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
                var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                tilesetscene.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            }
            // tilesetscene.readyPromise.then(zoomToTileset);
            // Stathis.addBz(1,1,109.865026, 40.635602,67,'1号楼');
            // Stathis.addBz(2,2,109.866291, 40.635551,67,'2号楼');
            // Stathis.addBz(3,3,109.865656, 40.635257,67,'3号楼');
            // Stathis.addBz(4,4,109.864860, 40.634985,67,'4号楼');
            // Stathis.addBz(5,5,109.866343, 40.634908,67,'5号楼');
            // Stathis.addBz(6,6,109.864919, 40.634472,47,'6号楼');
            // Stathis.addBz(7,7,109.865615, 40.634522,67,'7号楼');
            // Stathis.addBz(8,8,109.866291, 40.634410,47,'8号楼');
            //初始定位视野
            // viewer.zoomTo(tileset);
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(NOWVIEW.x,NOWVIEW.y,NOWVIEW.z),
                orientation: {
                    heading: Cesium.Math.toRadians(HADING), // 方向
                    pitch: Cesium.Math.toRadians(PITCH),// 倾斜角度
                    roll: 0
                }
            });
            //3Dtiles分类模型加载
            debugger
            //


            // var classificationTileset = new Cesium.Cesium3DTileset({
            //     url: cemap_url + '/3dfldt/tileset.json',
            //     //classificationType: Cesium.ClassificationType.CESIUM_3D_TILE//地形和3D 磁贴都将被分类‎
            // });

            // //注意这个颜色的设置
            // classificationTileset.style = new Cesium.Cesium3DTileStyle({
            //     color: 'rgba(255, 255, 255, 0.01)'
            // });
            // viewer.scene.primitives.add(classificationTileset);

            // tileset.readyPromise.then(function (tileset) {
            //     // viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
            //     //zoomTo （target，offset）目标和偏移
            //     // viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 1.0));
            // }).otherwise(function (error) {
            //     //若没有加载成功，提示错误
            //     console.log('错误' + error);
            // });

            debugger
            tilesetscene.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                       ['${zcs} >= 200', 'rgb(102, 71, 151)'],
                       ['${zcs} >= 100', 'rgb(170, 162, 204)'],
                       ['${zcs} >= 50', 'rgb(224, 226, 238)'],
                       ['${zcs} >= 25', 'rgb(252, 230, 200)'],
                       ['${zcs} >= 10', 'rgb(248, 176, 87)'],
                        ['${zcs} >= 5', 'rgb(198, 106, 11)'],
                        ['true', 'rgb(127, 59, 8)']
                    ]
                }
            });

            //var scene = viewer.scene;
            // viewer.screenSpaceEventHandler.setInputAction(function (movement) {
            //     var feature = scene.pick(movement.position);
            //     if (feature instanceof Cesium.Cesium3DTileFeature) {
            //         debugger
            //         var propertyNames = feature.getPropertyNames();
            //         var length = propertyNames.length;
            //         for (var i = 0; i < length; ++i) {
            //             var propertyName = propertyNames[i];
            //             console.log(propertyName + ': ' + feature.getProperty(propertyName));
            //         }
            //         Stathis.ShowBox(movement);
            //     }

            // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            debugger
        },
        ShowBox: function (movement) {
            var pick = new Cesium.Cartesian2(movement.position.x, movement.position.y);
            var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
            //var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            var cartographic1 = scene.globe.ellipsoid.cartesianToCartographic(cartesian); //将笛卡尔坐标转换为地理坐标
            //var cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
            var curMovementLon = Cesium.Math.toDegrees(cartographic1.longitude); //x
            var curMovementLat = Cesium.Math.toDegrees(cartographic1.latitude); //y
            var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
            var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
            var blueBox = viewer.entities.add({//添加显示框体
                name: 'Blue box',
                //中心的位置
                position: Cesium.Cartesian3.fromDegrees(curMovementLon, curMovementLat, 50),
                box: {
                    //长宽高
                    dimensions: new Cesium.Cartesian3(20.0, 1.0, 10.0),
                    material: Cesium.Color.BLUE
                }
            });
        },
        view_reset: function () {
            debugger
            function getNorthPointByDistance(x, y, z, heading, distance) {//x,y,z,偏转角度heading,距离中心点距离distance
                var center = Cesium.Cartesian3.fromDegrees(x, y, z);
                //以点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
                // var heading=Cesium.Math.toRadians(h);
                // var pitch = Cesium.Math.toRadians(-30);
                var hpr = new Cesium.HeadingPitchRoll(heading, 0.0, 0.0);
                var localToWorld_Matrix = Cesium.Transforms.headingPitchRollToFixedFrame(center, hpr);
                // var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                var a = Cesium.Matrix4.multiplyByPoint(localToWorld_Matrix, Cesium.Cartesian3.fromElements(0, distance, 0), new Cesium.Cartesian3())
                var cartographic1 = scene.globe.ellipsoid.cartesianToCartographic(a); //将笛卡尔坐标转换为地理坐标
                var curMovementLon = Cesium.Math.toDegrees(cartographic1.longitude); //x
                var curMovementLat = Cesium.Math.toDegrees(cartographic1.latitude); //y
                return { x: curMovementLon, y: curMovementLat }
            }


            debugger
            // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
            var pitch = Cesium.Math.toRadians(-23);
            // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
            var angle = 360 / 30;
            // 给定相机距离点多少距离飞行，这里取值为5000m
            var distance = 200;
            var startTime = Cesium.JulianDate.fromDate(new Date());
            var stopTime = Cesium.JulianDate.addSeconds(startTime, 45, new Cesium.JulianDate());
            viewer.clock.startTime = startTime.clone();  // 开始时间
            viewer.clock.stopTime = stopTime.clone();     // 结速时间
            viewer.clock.currentTime = startTime.clone(); // 当前时间
            viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
            viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
            // 相机的当前heading
            // var initialHeading = viewer.camera.heading;
            var initialHeading = Cesium.Math.toRadians(180.0);
            var Exection = function TimeExecution() {
                debugger
                // 当前已经过去的时间，单位s
                var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
                var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
                // var xy={x:109.865739,y:40.637251};
                var xy = getNorthPointByDistance(109.865755, 40.635127, 0, heading, 350);
                viewer.scene.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(xy.x, xy.y, distance),// 点的坐标
                    orientation: {
                        heading: Cesium.Math.toRadians(delTime * angle),
                        //heading:heading,
                        pitch: pitch,
                    }
                });

                if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
                    viewer.clock.onTick.removeEventListener(Exection);
                }
            };
            viewer.clock.onTick.addEventListener(Exection);

        }
        //添加标注
        , addBz: function (id,name,x,y,height,text) {

            viewer.entities.add({
                id: id,
                name: name,
                position: Cesium.Cartesian3.fromDegrees(x,y,height),
                //点样式
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 1
                },
                //立广告牌
                /*billboard :{
           
                    image : 'img/11.png',
           
                    show : true, // default
           
                    width : 25, // default: undefined
           
                    height : 25 // default: undefined
           
                },*/
                //字体标签样式
                label: {
                    text: text,
                    font: '10px',
                    color: Cesium.Color.RED,
                    fillColor:new Cesium.Color(255, 215, 0, 1),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 1,
                    //backgroundColor:new Cesium.Color(255, 0, 0, 1),
                    scale:1.5,
                    //垂直位置
                    //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
                    //中心位置
                    pixelOffset: new Cesium.Cartesian2(0, -25)

                }

            });

        }
        , showVideo: function () {
            var static_w = document.getElementById("showVideo");
            if (static_w == null) {
                var static_ht = "<div id='showVideo' class='tabForm' title='视频' style=' display: none;position:relative;background-color:rgba(247, 247, 247, 0); '></div>";
                $("body").append(static_ht);
            }
            var vth='<video autoplay="autoplay" style="width:100%;height:100%;" controls="controls" loop="loop">'
            +'<source src="./Video1.mp4"   type="video/mp4" />'
            +'</video>';
            document.getElementById("showVideo").innerHTML = vth;
            $("#showVideo").show();
            $("#showVideo").dialog({ //加载拖动效果和关闭按钮
                modal: false,
                // maximizable: true,//最大化，默认false
                width: 500,
                height: 380,
                //top: 100,
                //left: 100,
                closeOnEscape: false, //按Esc键之后，不关闭对话框，默认为true
                collapsible: true, //可折叠，默认false
                onClose: function () {
                    debugger;
                },
                resizable: false //,//可缩放，即可以通脱拖拉改变大小，默认false
            });
        }
        , Remove_Dm: function () {
            if (L_Primitive != null) {
                scene.primitives.remove(L_Primitive);
            } else {
                scene.primitives.removeAll();
                $("#StaModel_Show").dialog('close');
            }

        }
    }
});