/**
 * Created by yan on 2018/8/7.
 */
define(['text!./templates/DynamicModel.html'], function (Dyh) {
    var Dythis = null;
    var scene = null;
    var L_Primitive = null;
    var camera = null;
    return {
        buttonClickHandler: function (obj) {
            Dythis = this;
            var syrxxa = document.getElementById("Model_Show");
            if (syrxxa == null) {
                var syrxx = "<div id='Model_Show' class='tabForm' title='模型操作' style=' display: none;position:relative;background-color:#f7f7f7; '></div>";
                $("body").append(syrxx);
            }
            document.getElementById("Model_Show").innerHTML = Dyh;
            $("#Model_Show").show();
            $("#Model_Show").dialog({//加载拖动效果和关闭按钮
                modal: false,
                // maximizable: true,//最大化，默认false
                width: 500,
                height: 300,
                top: 100,
                left: 100,
                closeOnEscape: false,//按Esc键之后，不关闭对话框，默认为true
                collapsible: true,//可折叠，默认false
                onClose: function () {
                    Dythis.Remove_Dm();
                    $("#DynamicModel")[0].className= "mode_a";
                },
                resizable: false//,//可缩放，即可以通脱拖拉改变大小，默认false
            });
            scene = viewer.scene;
            camera = viewer.camera;
            if(obj){
                Dythis.Action();
            }else{
                Dythis.Remove_Dm();
            }

        },
        Action: function () {
            //飞行路径的位置
            var pathPosition = new Cesium.SampledPositionProperty();
            var start = Cesium.JulianDate.fromDate(new Date(2018, 2, 25, 16));
            var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
            // for (var i = 0; i <= 360; i += 45) {
            //     var radians = Cesium.Math.toRadians(i);
            //     var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            //     var position = Cesium.Cartesian3.fromDegrees(120.340996 + (0.03 * 1.5 * Math.cos(radians)), 36.082216 + (0.03 * Math.sin(radians)), 5.0);
            //     pathPosition.addSample(time, position);
            //
            //     //Also create a point for each sample we generate.
            //     viewer.entities.add({
            //         position: position,
            //         point: {
            //             pixelSize: 8,
            //             color: Cesium.Color.TRANSPARENT,
            //             outlineColor: Cesium.Color.YELLOW,
            //             outlineWidth: 3
            //         }
            //     });
            // }
//添加路径
            var entityPath = viewer.entities.add({
                // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                //     start: start,
                //     stop: stop
                // })]),
                position: pathPosition,
                name: 'path',
                path: {
                    show: true,
                    // leadTime: 0,
                    // trailTime: 60,
                    width: 10,
                    resolution: 1,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.3,
                        outlineColor: Cesium.Color.YELLOW,
                        color: Cesium.Color.YELLOW
                    })
                }
            });

            viewer.trackedEntity = entityPath;
            // var controller = scene.screenSpaceCameraController;
            var r = 0;
//中心点
            var center = new Cesium.Cartesian3();

//机身模型的偏移参数
            var hpRoll = new Cesium.HeadingPitchRoll();
//相机模型的偏移参数
            var hpRange = new Cesium.HeadingPitchRange();

            var speed = 10;
//默认按一下偏移3度
            var deltaRadians = Cesium.Math.toRadians(3.0);

//飞机位置
            var position = Cesium.Cartesian3.fromDegrees(120.340996, 36.082216, 5.0);
//速度向量
            var speedVector = new Cesium.Cartesian3();
//生成一个由两个参考系生成的矩阵
            var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');

//添加模型
            var planePrimitive = scene.primitives.add(Cesium.Model.fromGltf({
                //这里需要把模型路径改下(如果你用的还是HelloWord.html的话就用这个,不是的话请自行修改)
                url: './SampleData/models/CesiumGround/Cesium_Ground.gltf',
                modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform),
                minimumPixelSize: 50,
                maximumScale: 200
            }));
            L_Primitive = planePrimitive;
//动画播放
            planePrimitive.readyPromise.then(function (model) {
                /**以半速循环动画*****************************/
                model.activeAnimations.addAll({
                    speedup: 0.5,
                    loop: Cesium.ModelAnimationLoop.REPEAT
                });
                /**镜头初始常量**************************************/
                debugger
                //r=2*max(模型的半径，相机的最近距离)
                r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
                //计算center位置(也为下面的镜头跟随提供了center位置)
                Cesium.Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center, center);
                //镜头偏移角度
                var heading = Cesium.Math.toRadians(0);
                var pitch = Cesium.Math.toRadians(-25);
                hpRange.heading = heading;//镜头水平方向
                hpRange.pitch = pitch;//镜头垂直方向
                hpRange.range = r * 50.0;//镜头离车身的距离
                viewer.camera.setView({//初始视野
                    destination :  Cesium.Cartesian3.fromDegrees(120.340996, 36.082216, 300), // 设置位置
                    orientation: hpRange
                });

            });

//键盘监听
            document.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case 40:
                        if (e.shiftKey) {
                            // 按住shift加下箭头减速
                            speed = Math.max(--speed, 1);
                        } else {
                            // 直接按下箭头降低角度
                            hpRoll.pitch -= deltaRadians;
                            if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
                                hpRoll.pitch += Cesium.Math.TWO_PI;
                            }
                        }
                        break;
                    case 38:
                        if (e.shiftKey) {
                            // 按住shift加上箭头加速
                            speed = Math.min(++speed, 100);
                        } else {
                            // 直接按上箭头抬高角度
                            hpRoll.pitch += deltaRadians;
                            if (hpRoll.pitch > Cesium.Math.TWO_PI) {
                                hpRoll.pitch -= Cesium.Math.TWO_PI;
                            }
                        }
                        break;
                    case 39:
                        if (e.shiftKey) {
                            // 飞机本身向右旋转
                            hpRoll.roll += deltaRadians;
                            if (hpRoll.roll > Cesium.Math.TWO_PI) {
                                hpRoll.roll -= Cesium.Math.TWO_PI;
                            }
                        } else {
                            // 向右飞行
                            hpRoll.heading += deltaRadians;
                            if (hpRoll.heading > Cesium.Math.TWO_PI) {
                                hpRoll.heading -= Cesium.Math.TWO_PI;
                            }
                        }
                        break;
                    case 37:
                        if (e.shiftKey) {
                            // 飞机本身向左旋转
                            hpRoll.roll -= deltaRadians;
                            if (hpRoll.roll < 0.0) {
                                hpRoll.roll += Cesium.Math.TWO_PI;
                            }
                        } else {
                            // 向左飞行
                            hpRoll.heading -= deltaRadians;
                            if (hpRoll.heading < 0.0) {
                                hpRoll.heading += Cesium.Math.TWO_PI;
                            }
                        }
                        break;
                    default:
                }
            });

            var headingSpan = document.getElementById('heading');
            var pitchSpan = document.getElementById('pitch');
            var rollSpan = document.getElementById('roll');
            var speedSpan = document.getElementById('speed');
            var fromBehind = document.getElementById('fromBehind');

//给左边的通知栏更新数据同时刷新飞机位置(这里也是个1ms一次的回调)
            viewer.scene.preRender.addEventListener(function (scene, time) {
                headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(1);
                pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
                rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
                speedSpan.innerHTML = speed.toFixed(1);

                //选择的笛卡尔分量Cartesian3.UNIT_X（x轴单位长度）乘以一个标量speed/10，得到速度向量speedVector
                speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, speed / 10, speedVector);
                //飞机的模型矩阵与速度向量speedVector相乘，得到position
                position = Cesium.Matrix4.multiplyByPoint(planePrimitive.modelMatrix, speedVector, position);
                //添加一个路径模型(就是白色的尾气)
                pathPosition.addSample(Cesium.JulianDate.now(), position);
                //飞机位置+旋转角度+地球+坐标矩阵=飞机模型矩阵
                Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform, planePrimitive.modelMatrix);

                if (fromBehind.checked) {
                    // 镜头跟随
                    Cesium.Matrix4.multiplyByPoint(planePrimitive.modelMatrix, planePrimitive.boundingSphere.center, center);
                     hpRange.heading = hpRoll.heading;
                     // hpRange.pitch = hpRoll.pitch;
                      camera.lookAt(center, hpRange);

                }
            });
            $("#fromBehind").click(function () {
                if (fromBehind.checked==false) {
                    // viewer.camera.setView({//初始视野
                    //     destination :  Cesium.Cartesian3.fromDegrees(120.340996, 36.082216, 300), // 设置位置
                    //     orientation: hpRange
                    // });
                }
            });
        }
        , Remove_Dm: function () {
            if (L_Primitive != null) {
                scene.primitives.remove(L_Primitive);
            } else {
                scene.primitives.removeAll();
            }

        }
    }
});