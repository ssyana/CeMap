function createCesiumCircle(imageryProvider) {
    debugger;
    if (viewer == null) {

        viewer = new Cesium.Viewer('cesiumContainer', {
            baseLayerPicker: false, //非控件添加地图，必须为false，不然直接报错，/是否显示图层选择控件
            imageryProvider: imageryProvider, //初始背景
            fullscreenButton: false, //是否显示全屏按钮
            geocoder: false, //是否显示地名查找控件
            homeButton: true,
            infoBox: true, //是否显示点击要素之后显示的信息
            selectionIndicator: false, //是否显示选取指示器组件
            animation: true, //是否显示动画控件
            timeline: true, //是否显示时间线控件
            sceneModePicker: false, //是否显示投影方式控件是否显示3D/2D选择器
            // scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源,选择它之后就不能选择sceneModePicker
            navigationHelpButton: false, //是否显示帮助信息控件
            clock: new Cesium.Clock(), //用于控制当前时间的时钟对象
            navigationInstructionsInitiallyVisible: false,
            orderIndependentTranslucency: false,
            contextOptions: {
                webgl: {
                    alpha: true,
                }
            },
        });
    } else {
        viewer.imageryProvider = imageryProvider;
    }
    //设置时间显示
    viewer.animation.container.style.visibility = 'visible';
    viewer.animation.container.style.visibility = 'hidden';
    viewer.timeline.container.style.visibility = 'visible';
    viewer.timeline.container.style.visibility = 'hidden';
    animation_time();
    function animation_time() {
        var d = new Date();
        var Minutes = 0 - d.getTimezoneOffset();
        var dateZone8 = Cesium.JulianDate.fromDate(d);
        dateZone8.secondsOfDay=dateZone8.secondsOfDay+Minutes*60;
        var gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone8);
        viewer.animation.viewModel.dateFormatter = function (date, viewModel) {
            return (gregorianDate.year + '年' + gregorianDate.month + '月' + gregorianDate.day + '日');
            //return (d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日');
        };
        viewer.animation.viewModel.timeFormatter = function (date, viewModel) {
            // return (d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '');
            return ((gregorianDate.hour<10?'0'+gregorianDate.hour:gregorianDate.hour) + ':' + (gregorianDate.minute<10?'0'+gregorianDate.minute:gregorianDate.minute) + ':' + (gregorianDate.second<10?'0'+gregorianDate.second:gregorianDate.second) + '');
        };
    }
    // setInterval(animation_time,1000);
    // var start = Cesium.JulianDate.fromIso8601('2015-07-30');
    // var end = Cesium.JulianDate.fromIso8601('2017-06-17');
    // viewer.timeline.zoomTo(start, end);
    //修改时间轴显示样式
    viewer.timeline.makeLabel=function (time) {
        function twoDigits(num) {
            return ((num < 10) ? ('0' + num.toString()) : num.toString());
        }
        var gregorian = Cesium.JulianDate.toGregorianDate(time);
        return gregorian.year+'-'+gregorian.month +'-'+gregorian.day+' '+twoDigits(gregorian.hour)+':'+twoDigits(gregorian.minute) + ':' + twoDigits(gregorian.second);
    };
    
    viewer._cesiumWidget._creditContainer.style.display = "none";  //	去除版权信息
    //viewer.animation.container.style.visibility='hidden';
    //viewer.timeline.container.style.visibility='visible';
    viewer.scene.skyBox.show = false;
    viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(NOWALLVIEW.xmin, NOWALLVIEW.ymin, NOWALLVIEW.xmax, NOWALLVIEW.ymax); //全图视野

    //加载视角工具条
    $(".cesium-home-button").css('margin-right','27px');
    $(".cesium-home-button").css('margin-top','45px');
    viewer.extend(Cesium.viewerCesiumNavigationMixin, {});
    // $(".navigation-controls")[0].style.backgroundColor = '#222325';
    $(".navigation-controls").css('display','none');
    $(".compass").css('margin-top','70px');

    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) { //修改home的函数
        e.cancel = true;
        var hpRange = new Cesium.HeadingPitchRange();
        // var l_destination = Cesium.Cartesian3.fromDegrees(87.618749, 43.763101, 400); // 设置初始视野
        var l_destination = Cesium.Cartesian3.fromDegrees(NOWVIEW.x,NOWVIEW.y,NOWVIEW.z); // 设置初始视野
        //镜头偏移角度
        var heading = Cesium.Math.toRadians(HADING);
        var pitch = Cesium.Math.toRadians(PITCH);
        hpRange.heading = heading; //镜头水平方向
        hpRange.pitch = pitch; //镜头垂直方向
        hpRange.range = 30.0; //镜头离车身的距离
        viewer.camera.flyTo({
            destination: l_destination,
            // duration:20,//飞行的时间，以秒为单位，默认为自动计算时间
            orientation: hpRange

        });
    });
    // // rectangle 方式
    viewer.camera.setView({ //初始视野
        destination: Cesium.Cartesian3.fromDegrees(NOWVIEW.x,NOWVIEW.y,NOWVIEW.z), // 设置初始视野
        orientation: {
            heading: Cesium.Math.toRadians(HADING), // 方向
            pitch: Cesium.Math.toRadians(PITCH), // 倾斜角度
            roll: 0
        }
    });

    //鼠标移动时做的操作
    var scene = viewer.scene;
    /*var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (movement) {
        var pick = new Cesium.Cartesian2(movement.endPosition.x, movement.endPosition.y);
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
        //var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
        var cartographic1 = scene.globe.ellipsoid.cartesianToCartographic(cartesian); //将笛卡尔坐标转换为地理坐标
        //var cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        var curMovementLon = Cesium.Math.toDegrees(cartographic1.longitude); //x
        var curMovementLat = Cesium.Math.toDegrees(cartographic1.latitude); //y
        // var height = cartographic1.height;//z
        var height = scene.globe.getHeight(cartographic1);
        var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
        var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
        // if(!height){
        //     height = 0;
        // }

        document.getElementById("bottom_box").innerHTML = "<div><ul>经度:" + curMovementLon.toFixed(6) + ";</ul><ul>维度:" + curMovementLat.toFixed(6) + ";</ul><ul>海拔高度:" + height.toFixed(2) + ";</ul><ul>视角海拔高度：" + (he - he2).toFixed(2) + "米</ul></div>"; //
        //鼠标移动画线事件
        // yidong(cartesian,curMovementLon,curMovementLat,height);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

*/

    // toolBoxclick('StaticModel');
    // $('#myModal').modal({
    //     width:600,
    //     keyboard: true,
    //     backdrop:false
    //   });
}

function map_width(l_width) {
    $("#cesiumContainer").width(document.body.clientWidth - l_width);
    $(".toolBox_right").css('right', 29 + l_width + 'px');
}

/**
 * 右侧页面点击事件
 * */
$("#right_box_right").on('click', function () {
    debugger
    $("#right_box").hide();
    map_width(0);
    $("#right_box_close").show();
});
$("#right_box_close a").on('click', function () {
    debugger
    $("#right_box").show();
    map_width(400);
    $("#right_box_close").hide();
});
$("#right_box_delete").on('click', function () {
    
});