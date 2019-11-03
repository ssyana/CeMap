/**
 * Created by yan on 2018/6/1.
 */
define(['text!./templates/MapLayerWidget.html','widget/MapUrl','widget/AddMapLayer',], function (mlw,MapUrl,AddMapLayer) {
    var MapL_this=null;
    //////////////////插件定义////////////////
    $.fn.extend({
        //模拟单选或者多选
        itemSelector:function(options){
            var settings=$.extend({
                isMulti:false,//是否多选，默认单选
                changeCall:function(results){console.log(results);}
            },options);
            var $this=$(this);
            var $lis=$this.children("li");
            $lis.click(function(){
                if(settings.isMulti){
                    $(this).toggleClass("on");
                }else{
                    $(this).addClass("on").siblings().removeClass("on");
                }
                var results=getResultSel($this);
                settings.changeCall(results);
            });
        }

    });
    //获取选择的值
    function getResultSel($selector){
        var results=[];
        $selector.children("li.on").each(function(){
            results.push($(this).attr("data-val"));
        });
        return results;
    }
    return {
        buttonClickHandler: function (obj) {

            debugger
            if(obj){
                $("#right_box").show();
                map_width(400);
            }else{
                $("#right_box").hide();
                map_width(0);
                $("#right_box_close").hide();
                return;
            }
            // $('#right_box').each(function(){
            //     $(this).dragging({
            //         // parent:'parent',
            //         handler:'.hander',
            //         move : 'both',
            //        // top:40,
            //         randomPosition : false
            //     });
            // });
            MapL_this=this;
            document.getElementById("right_box_chil").innerHTML=mlw;

            //设置专题区高度自适应
            function setSubjectArea(){
                //设置专题底图列表区域高度
                //设置专题progress区域高度
                var areaH=0;
                $(".m_topic_map").children().not(".progress_wrap").each(function(){
                    areaH+=$(this).outerHeight();
                });
                $(".progress_wrap").height($(".m_topic_map").height()-areaH-70);
            }

            $("#selector1").itemSelector({//底图调用
                isMulti:false,  //单选还是多选
                changeCall:function(results){//选择的回调，参数results是选择的结果，具体请看控制台
                    debugger;
                    MapL_this.DT_Layer(results);
                }
            });
            //初始化进度条工具
            //初始化进度条工具
            $(".progress_handler .pro_handler_bar").each(function(){
                var $this=$(this);
                $this.dragging({
                    move : 'x',
                    randomPosition : false,
                    moveCall:function(left){
                        $this.siblings(".progress_val").width(left);
                        $this.parents(".progress_bar").find(".pro_result").html((left/158*100).toFixed(0) + "%");
                        //当前操作的专题返回结果
                        //var thisSubject=getCurrentSubject($this.parents(".progress_item"));
                        //console.log(thisSubject);
                    },
                    upCall:function(left){
                        //当前操作的专题返回结果
                        var thisSubject=getCurrentSubject($this.parents(".progress_item"));
                        //console.log(thisSubject);
                    }
                });
            });
            //选择配置项目事件初始化
            $("body").on("click",".progress_item h6",function(){
                var $this=$(this);
                var $item=$this.parents(".progress_item");
                $item.toggleClass("on");
                if($item.hasClass("on")){
                    debugger;
                    //当前点击选中了专题
                    var thisSubject=getCurrentSubject($this.parents(".progress_item"));
                    //console.log(thisSubject);
                    //console.log(getSelectedSubject());
                }else{
                    //当前点击的取消选中该专题，下面是当前的id
                    var thisId=$item.attr("data-val");
                    //console.log(thisId);
                }

            });
            //console.log(getSelectedSubject());
            //设置专题区域高度自适应
            setSubjectArea();
            $(window).resize(function(){
                setSubjectArea();
            });
            //获取选择的专题!!!!!!!!!用此方法获取选择的专题及对应选择的设置值！！！！！！如 var aaaa=getSelectedSubject();
            function getSelectedSubject(){
                var data=[];
                $(".progress_item.on").each(function(){
                    var thisId=$(this).attr("data-val");
                    var thisName=$(this).attr("data-name");
                    var thisVal=$(this).find(".pro_result").text();
                    data.push({
                        id:thisId,//唯一标示
                        name:thisName,//专题区名称
                        val:thisVal
                    });
                });
                return data;
            }
            function getCurrentSubject($progressItem){
                var thisId=$progressItem.attr("data-val");
                var thisName=$progressItem.attr("data-name");
                var thisVal=$progressItem.find(".pro_result").text();
                return {
                    id:thisId,//唯一标示
                    name:thisName,//专题区名称
                    val:thisVal
                };
            }

        },
        DT_Layer:function (a) {
            debugger;

            var map_layer=null;
            var map_layer_zj=null;
            switch (a[0]){
                case "天地图影像":
                    map_layer=MapUrl.tdtyx;
                    map_layer_zj=MapUrl.tdtyx_zj;
                    break
                case "天地图矢量":
                    map_layer=MapUrl.tdtsl;
                    map_layer_zj=MapUrl.tdtsl_zj;
                    break
            }
            AddMapLayer.addimglayer(map_layer);
            AddMapLayer.addlayer(map_layer_zj);
        }
    };
});