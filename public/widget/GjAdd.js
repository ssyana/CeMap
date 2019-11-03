/**
 * Created by yan on 2018/8/7.
 */
define(['text!./templates/GjAdd.html'], function (Sth) {
    var Dythis = null;
    var scene = null;
    var L_Primitive = null;
    var camera = null;
    return {
        buttonClickHandler: function (obj) {
            debugger
            viewer.animation.container.style.visibility = 'visible';
            viewer.animation.container.style.visibility = 'show';
            viewer.timeline.container.style.visibility = 'visible';
            viewer.timeline.container.style.visibility = 'show';
            _this = this;
            var static_w = document.getElementById("Gj_Show");
            if (static_w == null) {
                var static_ht = "<div id='Gj_Show' class='tabForm' title='设置' style=' display: none;position:relative;background-color:rgba(247, 247, 247, 0); '></div>";
                $("body").append(static_ht);
            }
            document.getElementById("Gj_Show").innerHTML = Sth;
            $("#Gj_Show").show();
            $("#Gj_Show").dialog({ //加载拖动效果和关闭按钮
                modal: false,
                // maximizable: true,//最大化，默认false
                width: 500,
                height: 80,
                top: 100,
                left: 100,
                closeOnEscape: false, //按Esc键之后，不关闭对话框，默认为true
                collapsible: true, //可折叠，默认false
                onClose: function () {
                    var className1=$("#GjAdd")[0].className;
                    if(className1.split(" ")[0]=="act"){
                        $("#GjAdd")[0].className = "def"+className1.split("act")[1];
                    }
                    _this.Gj_Close();
                },
                resizable: false //,//可缩放，即可以通脱拖拉改变大小，默认false
            });
            if (obj) {
                _this.Gj_Open();
                _this.View_entity();
            } else {
                _this.Gj_Close();
            }

        },
        Gj_Open: function () {
            //初始化起始时间
            var stop_time=0;
            var start = Cesium.JulianDate.fromDate(new Date(2019, 3, 12, 16));
            var stop = 0;
            //获取飞行路径
            $.getJSON("./widget/flyline.json", function (ll_data) {
                debugger
                var lineArray = ll_data;
            
                for(var a=0;a<lineArray.length;a++){
                    var property = new Cesium.SampledPositionProperty();
                    for (var i = 0; i < lineArray[a].length; i++) {
                        var lon = parseFloat(lineArray[a][i].lng);
                        var lat = parseFloat(lineArray[a][i].lat);
                        var dtime = 100 * i;
                        var time = Cesium.JulianDate.addSeconds(start, dtime, new Cesium.JulianDate());//时间递增
                        var position = Cesium.Cartesian3.fromDegrees(lon, lat, 0);//位置变化
                        property.addSample(time, position);
                        if(stop_time<dtime){
                            stop_time=dtime;
                        }
                    }
                    Gj(property);
                }
                
               
            });
            function Gj(property) {
                Cesium.Math.setRandomNumberSeed(3);
                //Set bounds of our simulation time
                
                stop = Cesium.JulianDate.addSeconds(start, stop_time, new Cesium.JulianDate());

                //Make sure viewer is at the desired time.
                viewer.clock.startTime = start.clone();
                viewer.clock.stopTime = stop.clone();
                viewer.clock.currentTime = start.clone();
                viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //在时间结束后再次从开始重复
                viewer.clock.multiplier = 1;//时间流速

                //Set timeline to simulation bounds
                viewer.timeline.zoomTo(start, stop);//底部时间条控件调整

                //计算模型随时间变化的位置
                //var circularPosition = computeCirclularFlight(-112.110693, 36.0994841, 0.03);
                // var staticPosition = Cesium.Cartesian3.fromDegrees(87.618749, 43.763101, 0);//静止的位置

                var entity = viewer.entities.add({
                    //Set the entity availability to the same interval as the simulation time.
                    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                        start: start,
                        stop: stop
                    })]),
                    //Load the Cesium plane model to represent the entity
                    model: {
                        //uri: '../Apps/SampleData/models/CesiumAir/Cesium_Air.gltf',
                        uri: 'SampleData/models/CesiumGround/Cesium_Ground.gltf',//images/64/84-虚线.png',
                        color: getColor('red', 1),
                        minimumPixelSize: 64,//控制模型最小
                        maximumScale: 5//控制模型最大
                    },
                    position: property,
                    //实时轨迹显示
                    path: {
                        //show: true,
                        //leadTime: 0,//飞机将要经过的路径，路径存在的时间
                        //trailTime: 60,//飞机已经经过的路径，路径存在的时间
                        width: 4,//线宽度
                        resolution: 1,
                        material: new Cesium.PolylineGlowMaterialProperty({
                            glowPower: 0.3,//应该是轨迹线的发光强度
                            color: Cesium.Color.PALEGOLDENROD//颜色
                        })
                    }
                });
                entity.orientation = new Cesium.VelocityOrientationProperty(property);
                //移动的原理：position参数包含时间和所处位置，根据当前时间得到位置
                //entity.position = circularPosition;
                //根据模型当前位置自动计算模型的旋转等参数
                //entity.orientation = new Cesium.VelocityOrientationProperty(circularPosition);
                $("#view_static").on('click', function (params) {
                    viewer.trackedEntity = undefined;
                });
                $("#view_dynamic").on('click', function (params) {
                    viewer.trackedEntity = entity;
                });
            }

            // viewer.trackedEntity = entity;
            function getColor(colorName, alpha) {
                var color = Cesium.Color[colorName.toUpperCase()];
                return Cesium.Color.fromAlpha(color, parseFloat(alpha));
            }
        },
        View_entity: function () {

        }
        , Gj_Close: function () {
            viewer.scene.primitives.removeAll();
            $("#Gj_Show").dialog('close');
            // document.getElementById('toolbar').innerHTML = '';
            viewer.animation.container.style.visibility = 'visible';
            viewer.animation.container.style.visibility = 'hidden';
            viewer.timeline.container.style.visibility = 'visible';
            viewer.timeline.container.style.visibility = 'hidden';
        }
    }
});