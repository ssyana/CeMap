/*
 * js module-审批进度管理
 * author: Sumii@Sumii.cn;
 * data: 2016-8-28;
*/
$.signProgress={
    init:function(selector,progressList){
       this.progress=$(selector);//sign-progress
       this.selector=selector;//sign-progress
       this.progressList=progressList;
       this.render();
       this.events();
    },
    render:function(){
       //wrap init
       this.progress.addClass("sign-progress");
       //展开收起
       var tempHtml0='<a class="spro-openAll" data-role="sproHandler">展开所有</a>';
       //render signed list
       var tempHtml1="";
       var tempHtml2="";
       var tempHtml3="";
      $.each(this.progressList,function(i,n){
          if(n.status=="1" || n.status=="2"){
              var iconClass=n.status=="1"?"spro-pass":"spro-refuse";
              var icon=n.status=="1"?"table_icons_pass_white":"table_icons_refuse_white";
              tempHtml1+='<li data-id="'+n.id+'" style="display:none">'+
                '<i class="spro-gray-point"></i>'+
                '<h5><b>'+n.uPosition+'</b> 审批 <b>'+n.signType+'</b></h5>'+
                '<div class="spro-sign-detail">'+
                  '<div class="spro-sd-header">'+
                    '<span class="spro-dateTime">审批时间：'+n.signTime+'</span>'+
                    '<span class="'+iconClass+'"><i class="'+icon+'"></i></span>'+
                    '<span class="spro-p-name">'+n.uName+'</span>'+
                  '</div>'+
                  '<div class="spro-sd-body">审批意见：'+
                    n.signCon+
                  '</div>'+
                '</div>'+
              '</li>';
          }
          if(n.status=="4"){
              tempHtml2+='<li data-id="'+n.id+'" data-role="currentSign"><i class="spro-p-header"><img src="../static/images/head-img.jpg" width="36" height="36" /></i>'+
              '<h5><b>'+n.uPosition+'</b> 审批 <b>'+n.signType+'</b></h5>'+
              '<div class="spro-sign-detail">'+
                '<div class="spro-sd-header">'+
                  '<span class="spro-howTo">?</span>'+
                  '<span class="spro-p-name">'+n.uName+'</span>'+
                '</div>'+
                '<div class="spro-sd-body">'+
                  '<textarea class="spro-textarea" data-role="signConInput" placeholder="请填写审批意见～" ></textarea>'+
                  '<div>'+
                    '<a class="btn-orange-s mr5" data-role="doPass"><i class="table_icons_pass_white"></i>同意</a>'+
                    '<a class="btn-primary-s" data-role="doRefuse"><i class="table_icons_refuse_white"></i>拒绝</a><span class="ml10" data-role="signResult"></span></div>'+
                '</div>'+
              '</div></li>';
          }
          if(n.status=="3"){
              tempHtml3+='<li class="disabled" data-id="'+n.id+'" style="display:none">'+
                '<i class="spro-gray-point"></i>'+
                '<h5><b>'+n.uPosition+'</b> 审批 <b>'+n.signType+'</b></h5>'+
                '<div class="spro-sign-detail">'+
                  '<div class="spro-sd-header">'+
                    '<span class="spro-howTo">?</span>'+
                    '<span class="spro-p-name">'+n.uName+'</span>'+
                  '</div>'+
                  '<div class="spro-sd-body">'+
                    '审批意见：等待审批......'+
                  '</div>'+
                '</div>'+
              '</li>';
          }
      });
      //append 
      this.progress.html('<ul class="spro-list">'+tempHtml0+tempHtml1+tempHtml2+tempHtml3+'</ul>');
    },
    getUResult:function(){
        //获取用户审批结果
        var signResult=this.progress.find("[data-role=signResult]").attr("data-val");
        var signCon=this.progress.find("[data-role=signConInput]").val();
        return {
          signResult:signResult,
          signCon:signCon
        };
    },
    events:function(){
      var self=this;
       //点击展开，收起效果  data-role="currentSign"
       this.progress.on("click","[data-role=sproHandler]",function(){
          var $this=$(this);
          var thisTxt=$(this).text();
          if(thisTxt=="展开所有"){
              $this.html("收起其他");
              self.progress.find("li").not("[data-role=currentSign]").slideDown(300);
          }else{
              $this.html("展开所有");
              self.progress.find("li").not("[data-role=currentSign]").slideUp(300);
          }
       });

       //点击同意
       this.progress.on("click","[data-role=doPass]",function(){
         if(!$(this).is(".disabled")){
             self.progress.find("[data-role=doRefuse]").removeClass("disabled");
             $(this).addClass("disabled");
             self.progress.find("[data-role=signResult]").html("您已同意！").attr("data-val","同意");
         }
       });

       //点击拒绝
       this.progress.on("click","[data-role=doRefuse]",function(){
         if(!$(this).is(".disabled")){
             self.progress.find("[data-role=doPass]").removeClass("disabled");
             $(this).addClass("disabled");
             self.progress.find("[data-role=signResult]").html("您已拒绝！").attr("data-val","拒绝");
         }
       });
    }
};