/*
 * js module-弹窗组件
 * author: Sumii@Sumii.cn;
 * data: 2016-7-28;
*/
function SignPic(options){
    this.settings=$.extend({ 
        ndDom: "#signPic",
        addPointCall:function(){},
        pointArr:[]
    },options);
    this.init();
    this.render();
    this.events();
}

SignPic.prototype={
    init:function(){
       window.iiii=1000000;
       window.beingBiaozhu=0;
       window.editBZDetail=1;
       window.showOverlay=0;
       window.pointsArr=this.settings.pointArr;
    },
    render:function(){
        //渲染已经添加的点
        $(".flag_fz").remove();
        $.each(this.settings.pointArr,function(i,n){
            if(n.caption!=""){
                $("#cqMap").append('<i class="flag_fz" style="left:'+n.pX+'px;top:'+n.pY+'px;" data-key="'+n.id+'" data-id="'+i+'"></i>');
            }else{
                $("#cqMap").append('<i class="flag_fz flag_fz_red" style="left:'+n.pX+'px;top:'+n.pY+'px;" data-key="'+n.id+'" data-id="'+i+'"></i>');
            }
        });
    },
    events:function(){
        var self=this;
        //添加标注点
        $("body").on("click","#cqMap",function(e){
            if(beingBiaozhu){
                //console.log(e.pageY); 
                //console.log(e.pageY-$(this).offset().top); 
                //console.log(e.pageX-$(this).offset().left);
                var yy= e.pageY-$(this).offset().top;
                var xx=e.pageX-$(this).offset().left;
                var $temp=$('<i class="flag_fz flag_fz_red" data-new="1" data-id="'+iiii+'"></i>');
                $(".cqMap").append($temp);
                $temp.css({left:xx-11,top:yy-25});
                point={
                    id:iiii,//方阵id
                    pX:xx,
                    pY:yy,
                    caption:"",//方阵名称
                    progress:"",//施工进度
                    principal:"",//负责人
                    zcCount:"",//组串数量
                    zjType:[0,0]//组件排列方式4列5行
                };
                self.settings.addPointCall(point);
                iiii++;
            }
        });
        //快速移动时的bug
        $("body").on("mouseover","#sign",function(e){
            if(beingBiaozhu){
                $("#sign").hide();
            }
        });
        //标注提示跟随鼠标跑
        $("body").on("mousemove","#cqMap",function(e){
            if(beingBiaozhu){
                var yy= e.pageY-$(this).offset().top;
                var xx=e.pageX-$(this).offset().left;
                $("#sign").show().css({left:xx-11,top:yy-27});
            }
        });

        //添加标注点
        $("body").on("click","#biaozhuBtn",function(){
            if($(this).text()=="完成标注"){
                beingBiaozhu=0;
                editBZDetail=1;
                $(this).text("添加标注");
                $("#sign").hide();
            }else{
                beingBiaozhu=1;
                editBZDetail=0;
                $(this).text("完成标注");
                $("#sign").show();
            }
            
        })
        //鼠标滑过点flag_fz
        $("body").on("mouseover",".flag_fz",function(e){
            var thisId=$(this).attr("data-id");
            var thiskey=$(this).attr("data-key");
            var data=pointsArr[thisId];
            if(typeof data != "undefined" && !beingBiaozhu){
                $(".mapOverlay_m").remove();
                var yy= $(this).offset().top-$("#cqMap").offset().top+16;
                var xx= $(this).offset().left-$("#cqMap").offset().left+16;
                
                window.showOverlay=0;

                if(data.caption==""){
                    //未编辑过的
                    var temp='<div class="mapOverlay_m" data-id="'+thisId+'" data-key="'+thiskey+'">'+
                                '<div><a class="btn-primary-xm" style="width:130px;" data-role="editPoint">编辑属性</a><a class="btn-primary-border-xm ml5" style="width:130px;" data-role="delPoint">删除点</a></div>'+
                             '</div>';
                }else{
                    var temp='<div class="mapOverlay_m" data-id="'+thisId+'" data-key="'+thiskey+'">'+
                        '<div class="optBtns"><a data-role="editPoint">编辑</a> | <a data-role="delPoint">删除点</a></div>'+
                        '<div class="projectName">'+data.caption+'</div>'+
                        '<div class="map_items clearFix mt10"><div class="fl">进度：'+data.progress+'% </div><div class="project_progress fl"><span style="width:'+data.progress+'%;"></span></div></div>'+
                        '<div class="map_items clearFix">'+
                          '<div class="map_items_s">负责人: <span>'+data.principal+'</span></div>'+
                          '<div class="map_items_s">组串数: <span>'+data.zcCount+'</span></div>'+
                        '</div>'+
                        '<div class="map_items clearFix">'+
                          '<div class="fl">排列方式: <span class="bold">'+data.zjType[1]+'行 × '+data.zjType[0]+'列</span></div>'+
                        '</div>'+
                        '<div class="mt10"><a class="btn-primary-xm block" data-role="zujianList">进入方阵</a></div>'+
                     '</div>';
                }
                
                if(!$(".mapOverlay_m").length){
                   $(".cqMap").append(temp);
                }
                $(".mapOverlay_m").show().css({left:xx,top:yy});
            }
            
        });
        $("body").on("mouseover",".mapOverlay_m",function(e){
            window.showOverlay=1;
        });
        $("body").on("mouseout",".flag_fz",function(e){
            setTimeout(function(){
                if(!showOverlay){
                    $(".mapOverlay_m").remove();
                    window.showOverlay=0;
                }
            },300);
        });
        $("body").on("click",function(e){
            var eT=e.target || e.srcElment;
            if(!$(eT).is(".mapOverlay_m") && !$(eT).parents(".mapOverlay_m").length && !$(eT).is(".flag_fz")){
                $(".mapOverlay_m").remove();
                window.showOverlay=0;
            }
        });
    }
};//prototype



