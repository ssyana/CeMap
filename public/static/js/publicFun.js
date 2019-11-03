/*
 * js module-公用方法
 * author: Sumii@Sumii.cn;
 * data: 2016-07-03;
*/
$.publicFun={
    //数字加减小插件
    numHandler:function(options){
        var settings=$.extend({
            handlerWrapDom:"body",
            //step:1, 
            changeCallBack:function(){}
        },options);
        var self=this;
        //减
        $(settings.handlerWrapDom).on("click",".numHandler .btn_jian",function(){
           var $this=$(this);
           var $numHandler=$(this).parent();
           var $thisInput=$numHandler.find("input");
           var thisVal=$thisInput.val();
           var thisMin=$numHandler.attr("data-min");
           if(thisVal==""){
              $thisInput.val(0);
           }
           if(typeof thisMin != "undefined"){
              $thisInput.val(+thisVal>+thisMin ? --thisVal : thisMin);
           }else{
              $thisInput.val(--thisVal);
           }
           settings.changeCallBack();
        });
        //加
        $(settings.handlerWrapDom).on("click",".numHandler .btn_jia",function(){
           var $this=$(this);
           var $numHandler=$(this).parent();
           var $thisInput=$numHandler.find("input");
           var thisVal=$thisInput.val();
           var thisMax=$numHandler.attr("data-max");
           if(thisVal==""){
              $thisInput.val(0);
           }
           if(typeof thisMax != "undefined"){
              $thisInput.val(+thisVal<+thisMax ? ++thisVal : thisMax);
           }else{
              $thisInput.val(++thisVal);
           }
           if(thisVal!=$thisInput.val()){
              settings.changeCallBack();
           }
           settings.changeCallBack();
        });
        //keyup
        $(settings.handlerWrapDom).on("keyup",".numHandler input[type=text]",function(){
          var $this=$(this);
          //setTimeout(function(){
            var thisVal=$this.val();
            var $numHandler=$this.parent();
            var thisMin=$numHandler.attr("data-min");
            var thisMax=$numHandler.attr("data-max");
            if(typeof thisMin != "undefined"){
                if((isNaN(thisVal)&&thisVal!="-") || +thisVal<thisMin){
                   $(this).val(thisMin);
                }
            }else{
                if(isNaN(thisVal)&&thisVal!="-"){
                   $(this).val(0);
                }
            }
            if(typeof thisMax != "undefined"){
                if((isNaN(thisVal)&&thisVal!="-") || +thisVal>thisMax){
                   $(this).val(thisMax);
                }
            }else{
                if(isNaN(thisVal)&&thisVal!="-"){
                   $(this).val(0);
                }
            }
            if(thisVal!=$this.val()){
              settings.changeCallBack();
           }
           settings.changeCallBack();
          //},100);
            
        });
        //mousewheel
        $(settings.handlerWrapDom).on("mousewheel",".numHandler input[type=text]",function(){
            var drection=self.getScrollDrection();
            var $this=$(this);
            switch(drection){
                case "up":
                $this.siblings(".btn_jia").trigger("click");
                break;
                case "down":
                $this.siblings(".btn_jian").trigger("click");
                break;
            }
            return false;
        });

    },//numHandler
    getNumHandlerVals:function(selector){//如"#pj_table1" //需要为input设置不同的name值,否则用index作为索引
         if(typeof selector == "undefined"){
            selector="body";
         }
         var resultArr=[];
         $(".numHandler input",selector).each(function(index,elm){
            var name=typeof $(this).attr("name")=="undefined" ? index : $(this).attr("name");
            resultArr.push({
               name:name,
               val:$(this).val()
            });
         });
         return resultArr;
    },
    //获取当前滚动方向
    getScrollDrection:function (e) {
        var direct = 0;
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件             
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                return "up";
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                return "down";
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail> 0) { //当滑轮向上滚动时
                return "down";
            }
            if (e.detail< 0) { //当滑轮向下滚动时
                return "up";
            }
        }else{
            return false;
        }
    },//getScrollDrection
    initChosenSearch:function(selectorParent,keyUpCall){
      var flag;
      var $select=$(selectorParent).find("select");
      var isMulti=$select.attr("multiple");
      $(selectorParent).on("keyup",".chosen-search input,.search-field input",function(){
          clearTimeout(flag);
          var $this=$(this);
          $this.unbind();
          flag = setTimeout(function(){
              var thisVal=$.trim($this.val());
              //var thisVal=$('<div/>').text($.trim(this.search_field.val())).html();
              if(thisVal!=""){
                 var tempHtml='';
                 if(isMulti=="multiple"){
                     var value=$select.val();
                     var thisSelect=[];
                     //获取原油选中的项
                     $select.children("option:selected").each(function(index,elm){
                        thisSelect.push({
                           val:$(elm).val(),
                           txt:$(elm).text()
                        });
                     });
                     for(var j=0;j<thisSelect.length;j++){
                        tempHtml+='<option value="'+thisSelect[j].val+'" selected="selected">'+thisSelect[j].txt+'</option>';
                     }
                     $select.html(tempHtml);
                 }//if
                 //$this.val(thisVal);
                 if(isMulti=="multiple"){
                    $this.trigger("click");
                 }//if
                 keyUpCall(thisVal);
              }
          },1000);//1000毫秒搜索一次
      })
    },
    //通过给定数组[{val:someval,txt:sometxt},{val:someval,txt:sometxt}...]初始化chosen列表
    chosenListInitByArr:function(select,searchKey,listArr){
         var isMulti=$(select).attr("multiple");
         var tempHtml="<option></option>";
         for(var i=0;i<listArr.length;i++){
             tempHtml+='<option value="'+listArr[i].val+'">'+listArr[i].txt+'</option>';
         }
         if(isMulti=="multiple"){
            $(select).append(tempHtml).trigger("chosen:updated");
         }else{
            $(select).html(tempHtml).trigger("chosen:updated");
         }
         $(select).next(".chosen-container").find("input[type=text]").val(searchKey);
    },
    //阻止浏览器默认行为
    stopBubble:function(e) { 
      //如果提供了事件对象，则这是一个非IE浏览器 
      if ( e && e.stopPropagation ) 
          //因此它支持W3C的stopPropagation()方法 
          e.stopPropagation(); 
      else
          //否则，我们需要使用IE的方式来取消事件冒泡 
          window.event.cancelBubble = true; 
    },//stopBubble
    //删除表格中的一行
    delLineFromTable:function(){
      $("table").on("click","[data-role=del_line]",function(){
        if(!$(this).hasClass("disabled")){
           $(this).parents("tr").remove();
        }
      });
      $("body").on("click","[data-role=form_table_addLine]",function(){
        if(!$(this).hasClass("disabled")){
          var thisFor=$(this).attr("data-for");
          var tempLine="";
          switch(thisFor){
            case "zjysTable":
            tempLine='<tr>'+
                     '<td class="align_left"><input type="text" class="table_input_text" style="width:95%;" /></td>'+
                     '<td><input type="text" class="table_input_text" /><span class="fd_danwei">万</span></td>'+
                     '<td><input type="text" class="table_input_text" /><span class="fd_danwei">%</span></td>'+
                     '<td><a class="btn-orange-xs" data-role="del_line">删除</a></td>'+
                  '</tr>';
            break;
            case "shlcTable":
            tempLine='<tr>'+
                     '<td><input type="text" class="table_input_text" style="width:95%;" /></td>'+
                     '<td><input type="text" class="table_input_text"  placeholder="2016-12-12" onFocus="WdatePicker()"/></td>'+
                     '<td><input type="text" class="table_input_text" /></td>'+
                     '<td class="align_left"><input type="text" class="table_input_text" /></td>'+
                     '<td><a class="btn-primary-xs mr5" data-role="tongyi_line">同意</a><a class="btn-orange-xs" data-role="jujue_line">拒绝</a></td>'+
                  '</tr>';
            break;
          }
          $("#"+thisFor).append(tempLine);
        }
      });
    },//delLineFromTable
    //同意/不同意   审批操作
    signEventsInit:function(){
        $("[data-role=signBox]").on("click","[data-role=passBtn]",function(){
            $this=$(this);
            if(!$this.hasClass("disabled")){
              $this.addClass("disabled").html('<i class="table_icons_pass_white"></i>已同意');
              $this.siblings("[data-role=signResult]").val(1);
              $this.siblings("[data-role=refuseBtn]").removeClass("disabled").html('<i class="table_icons_refuse_white"></i>不同意');
            }
            
        })
        $("[data-role=signBox]").on("click","[data-role=refuseBtn]",function(){
            $this=$(this);
            if(!$this.hasClass("disabled")){
              $this.addClass("disabled").html('<i class="table_icons_refuse_white"></i>已拒绝');
              $this.siblings("[data-role=signResult]").val(0);
              $this.siblings("[data-role=passBtn]").removeClass("disabled").html('<i class="table_icons_pass_white"></i>同意');
            }
        })
    },//signEventsInit
    //设置页面中所有／或者某个dom中form元素框禁用掉
    disabledTableForm:function(select){//select是对应container的选择器
        var $container=$(select);
        $container.find("input").prop("disabled",true);
        $container.find("select").prop("disabled",true).trigger("chosen:updated");
        $container.find("a[class*=btn-]").addClass("disabled");
    },
    //在最上层的iframe中弹出窗口
    showDialog:function(){
      //dialog测试
      $.dialog.init({
          ndDom: "#dialogBox01",//对应dialog中要放的div的id选择器 | 如果打开的是个iframe页面，那此项是对应dialog的data-id，必填，且不可重复！！！！！！约定一下：对应弹窗id为“#当前页面文件名＋number(页面里有三个弹窗就是1，2，3)”
          url:"2-xydjpjb.html",//如果弹窗内是个iframe，设置iframe的src属性值为url
          width: 1000,//dialog宽度
          height: 0,//dialog高度，0的时候高度自适应
          closeBtn: true,//是否需要关闭弹窗X按钮
          closeBtnStyle: "big",//big注册那种模式   small ，在里面的模式
          padding: 0,//0的时候按照样式里的来
          confirm: false,//是否是confirm弹窗
          confirmTitle: "温馨提示！",  //confrim的提示标题
          confirmText: "此操作将不能撤销，您确定要进行此次操作吗？",  //confirm的提示内容
          confirmYesCallback: function () { },//确定按钮的回调
          alter: false,//是否是alert弹窗
          hasH1:false,//是否有主标题
          hasH2:false,//是否有副标题
          h1Txt:"弹窗主标题",//主标题内容，可以是html标签
          h2Txt:"弹窗副标题",//副标题内容，可以是html标签
          alterTitle: "温馨提示！",  //alter的提示标题
          alterText: "此操作将不能撤销，您确定要进行此次操作吗？",  //alter的提示内容
          alterYesCallback: function () { },//alter确定按钮的回调
          closeCallback: function () { }//关闭弹窗的回调
      });
    },
    alert:function(msg,closeCallBack){
        var alertDialog=new top.Dialog({
            ndDom: "#dialogBox03",//对应dialog中要放的div的id选择器 | 如果打开的是个iframe页面，那此项是对应dialog的data-id，必填，且不可重复！！！！！！约定一下：对应弹窗id为“#当前页面文件名＋number(页面里有三个弹窗就是1，2，3)”
            url:"",//如果弹窗内是个iframe，设置iframe的src属性值为url
            width: 300,//dialog宽度
            height: 0,//dialog高度，0的时候高度自适应
            closeBtn: false,//是否需要关闭弹窗X按钮
            padding: 30,//0的时候按照样式里的来
            confirm: false,//是否是confirm弹窗
            alter: true,//是否是alert弹窗
            hasH1:false,//是否有主标题
            hasH2:false,//是否有副标题
            alterTitle: "温馨提示！",  //alter的提示标题
            alterText: msg,  //alter的提示内容
            alterYesCallback: function () {},//alter确定按钮的回调
            closeCallback: closeCallBack//关闭弹窗的回调
       });
    },
    //confirm dialog
    confirm:function(msg,confirmYesCallback,closeCallback){
        var confirmDialog=new top.Dialog({
            ndDom: "#dialogBox02",//对应dialog中要放的div的id选择器 | 如果打开的是个iframe页面，那此项是对应dialog的data-id，必填，且不可重复！！！！！！约定一下：对应弹窗id为“#当前页面文件名＋number(页面里有三个弹窗就是1，2，3)”
            url:"",//如果弹窗内是个iframe，设置iframe的src属性值为url
            width: 300,//dialog宽度
            height: 0,//dialog高度，0的时候高度自适应
            closeBtn: false,//是否需要关闭弹窗X按钮
            padding: 30,//0的时候按照样式里的来
            confirm: true,//是否是confirm弹窗
            confirmTitle: "温馨提示！",  //confrim的提示标题
            confirmText: msg,  //confirm的提示内容
            confirmYesCallback:typeof confirmYesCallback=="undefined" ? function () {} : confirmYesCallback,//确定按钮的回调
            alter: false,//是否是alert弹窗
            hasH1:false,//是否有主标题
            hasH2:false,//是否有副标题
            closeCallback: typeof closeCallback=="undefined" ? function () {} : closeCallback//关闭弹窗的回调
        });
    },
    //全选操作
    selectAll:function(){
         $("[data-role=selectAll]").change(function(){
             if($(this).prop("checked")==true){
                 $("[data-role=selectAllItem]").prop("checked",true);
             }else{
                 $("[data-role=selectAllItem]").prop("checked",false);
             }
             
         });
    },
    //获取url传过来的参数
    getUrlVal: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    getUrlParam: function (name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = (window.location.search.replace(/(.*?)\?/, "") + "&" + window.location.hash.replace(/(.*?)\?/, "")).match(reg);
            if (r != null) return decodeURI(r[2]); return null;
        },//getUrlParam
    //跳转并打开某栏目
    jumpToNav:function(navId){
        if($("#main_nav").length){
            //top页面事件
            $("#main_nav .lv1_li").removeClass("open");
            $("#main_nav .lv2").slideUp(200);
            var $navLi=$("[data-id="+navId+"]");
            var url=$navLi.children("a").attr("href");
            $navLi.parent().slideDown(function(){
                $("#main_frame")[0].src=url;
            }).parent(".lv1_li").addClass("open");
        }else{
            //frame中的页面
            var $navLi=top.$("[data-id="+navId+"]");
            var url=$navLi.children("a").attr("href");
            console.log(url);
            $navLi.parent().slideDown(200,function(){
                top.$("#main_frame")[0].src=url;
            }).parent(".lv1_li").addClass("open");
        }
    },
    //grid common init
    gridCommonInit:function(gridMoreBtnCall){
      $("body").off("click",".dateDurPickerRe,.icon_selectArrow");
      $("body").on("click",".dateDurPickerRe,.icon_selectArrow",function(){
         $(this).parent().find(".dateDurPickerOpa").toggle();
      });
      $("body").off("click","[data-role=datePickerConfirm]");
      $("body").on("click","[data-role=datePickerConfirm]",function(){
        var $this=$(this);
        var $input=$this.siblings(".search_bar_input");
        if($input.length==2){
          $this.parents(".ls_item").find(".dateDurPickerRe").text($input.eq(0).val()+"-"+$input.eq(1).val());
        }else{
          $this.parents(".ls_item").find(".dateDurPickerRe").text($input.val());
        }
         $this.parents(".dateDurPickerOpa").hide();
      });
      //点击空白处关闭对话框
      $(document).click(function (e) {
          var _con = $(".dateDurPicker");   // 设置目标区域
          var eventTarget=e.target || e.srcElement ;
          if (!_con.is(eventTarget) && _con.has(eventTarget).length === 0) { // Mark 1
              $(".dateDurPickerOpa").hide();
          }
      });
      //搜索提示组建相关
      $(".search_condation_input_text").each(function(){
          var $this=$(this);
          if($this.val()==""){
             $this.siblings(".ss_placeholder").show();
             $this.siblings(".ss_clear").hide();
          }else{
             $this.siblings(".ss_placeholder").hide();
             $this.siblings(".ss_clear").show();
          }
      });
      $("body").off("click",".ss_placeholder");
      $("body").on("click",".ss_placeholder",function(){
          var $this=$(this);
          $this.siblings(".search_condation_input_text").focus();
          $this.hide();
      });
      $("body").off("focus",".search_condation_input_text");
      $("body").on("focus",".search_condation_input_text",function(){
          var $this=$(this);
          $this.siblings(".ss_placeholder").hide();
          if($this.val()!=""){
              $this.siblings(".ss_clear").show();
          }
      });
      $("body").off("keyup",".search_condation_input_text");
      $("body").on("keyup",".search_condation_input_text",function(){
          var $this=$(this);
          $this.siblings(".ss_placeholder").hide();
          if($this.val()==""){
              $this.siblings(".ss_clear").hide();
          }
      });
      $("body").off("blur",".search_condation_input_text");
      $("body").on("blur",".search_condation_input_text",function(){
          var $this=$(this);
          if($this.val()==""){
              $this.siblings(".ss_placeholder").show();
              $this.siblings(".ss_clear").hide();
          }
      });
      $("body").off("click",".ss_clear");
      $("body").on("click",".ss_clear",function(){
          var $this=$(this);
          $this.siblings(".search_condation_input_text").val("").removeAttr("data-id").removeAttr("data-others");
          $this.hide();
          $this.siblings(".ss_placeholder").show();
      });
      //grid中更多操作事件初始化
      $("body").off("click","[data-role=gridMoreBtn]");
      $("body").on("click","[data-role=gridMoreBtn]",function(e){
          var $this=$(this);
          var thisFor=$this.attr("data-for");
          var thisId=$this.parents("tr").attr("id");
          var thisX=e.pageX;
          var thisY=e.pageY;
          var $thisOptList=$("[data-role="+thisFor+"]");
          var thisPrevId=$thisOptList.attr("data-id");
          if($thisOptList.is(":hidden")){
            $thisOptList.attr("data-id",thisId).show().css({left:(thisX-180)+"px",top:thisY+"px"});
            if(gridMoreBtnCall){
              gridMoreBtnCall(thisId);
            }
            if($("body").height()-thisY<$thisOptList.outerHeight()){
                var topY=$("body").height()-$thisOptList.outerHeight()-15;
                $thisOptList.css("top",topY+"px");
            }
          }else{
            if(thisPrevId==thisId){
                $thisOptList.hide();
            }else{
              $thisOptList.attr("data-id",thisId).css({left:(thisX-180)+"px",top:thisY+"px"});
              if(gridMoreBtnCall){
                gridMoreBtnCall(thisId);
              }
            }
          }
      });
      //grid中更多操作按钮点击
      $("body").off("click",".gridMoreBtn_btns a");
      $("body").on("click",".gridMoreBtn_btns a",function(){
          $(this).parents(".gridMoreBtn_btns").hide();
      });
      //点击空白处关闭 更多操作  按钮组
      $("body").click(function (e) {
          var _con = $(".gridMoreBtn_btns,[data-role=gridMoreBtn]");   // 设置目标区域
          var eventTarget=e.target || e.srcElement ;
          if (!_con.is(eventTarget) && _con.has(eventTarget).length === 0) { // Mark 1
              $(".gridMoreBtn_btns").hide();
          }
      });
    },
    //tab init
    tabInit:function(){
        $("[data-role=public-tab-con]").hide();
        $("[data-role=public-tab-bar] li.on").each(function(index,elm){
            var thisTabCon=$(this).parents(".tabContainer");
            thisTabCon.find("[data-role=public-tab-con]").eq(index).show();
        });
        $("body").on("click","[data-role=public-tab-bar] li",function(){
            var $this=$(this);
            var index=$this.index();
            var $thisTabCon=$this.parents(".tabContainer");
            $this.addClass("on").siblings().removeClass("on");
            $thisTabCon.find("[data-role=public-tab-con]").eq(index).show().siblings("[data-role=public-tab-con]").hide();
        });
    },
    MtabInit:function(){
      $(".MtabBar li").click(function(){
          $(this).addClass("on").siblings().removeClass("on");
          var thisIndex=$(this).index();
          var $tabContent=$(this).parent().next();
          $tabContent.find(".MtabItem").hide().eq(thisIndex).show();
      });
    },
    showLoadding:function(tips){
        //往最顶级页面抛出loadding效果
        if(typeof tips == "undefined"){
          var showTips="正在加载...";
        }else{
          var showTips=tips;
        }
        var loaddingHtm='<div class="loadding-wrap"><div class="loaddingMask"></div><div class="loaddingGif">'+
                        '<img src="../static/images/loadding.gif" />'+
                        '<div class="loadding_text">'+showTips+'</div>'+
                        '</div></div>';
        top.$("body").append(loaddingHtm);
    },
    hideLoadding:function(){
        top.$(".loadding-wrap").remove();
    },
    //获取url上参数
    getParam:function(name) { 
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
      var r = window.location.search.substr(1).match(reg); 
      if (r != null) return unescape(r[2]); return null; 
    },
    resizeMtabFrame:function(){
        var mW=top.$("#main_frame")[0].contentWindow;
        var liW=0;
        if(mW.$(".projectMTList li").length>1){
          mW.$(".projectMTList li").each(function(){
            liW+=$(this).outerWidth()+6;
          });
        }else{
          liW=300;
        }
        mW.$(".projectMTList").width(liW+10);
        if(mW.$(".projectMainTab").width()<mW.$(".projectMTList").width()){
          mW.$(".projectMainTab").scrollLeft(mW.$(".projectMTList").width()-mW.$(".projectMainTab").width()+80);
        }else{
          mW.$(".projectMainTab").scrollLeft(0);
        }
    },
    closeDialogIn:function(){
      var url = location.href.split("/");
      var pageUrl=url[url.length-1].split(".");
      var pageUrlStr=pageUrl[0].split("?")[0];
     // if(typeof timerObj != "undefined"){
      parent.clearInterval(parent.timerObj);
     // }
      var $targetDialog=parent.$('iframe[src*=' + pageUrlStr+ ']').parents(".blackWrap");
      $targetDialog.remove();
    },
    openOnTab:function(pageId,url,pageName){
      var mW=top.$("#main_frame")[0].contentWindow;
      var $tabiframes=mW.$("iframe");
      var $targetFrame=mW.$("iframe[data-id="+pageId+"]");
      var $tabs=mW.$(".projectMTList li");
      var $targetTab=mW.$(".projectMTList li[data-id="+pageId+"]");
      $tabs.removeClass("on");
      $tabiframes.hide();
      if($targetFrame.length){
        $targetFrame.show();
        $tabs.removeClass("on");
        $targetTab.addClass("on");
      }else{
        mW.$(".projectMTList").append('<li class="on" data-id="'+pageId+'">'+pageName+'<i>×</i></li>');
        mW.$("body").append('<iframe data-id="'+pageId+'" src="'+url+'" name="projectMainFra" class="projectMainFra"></iframe>');
        this.resizeMtabFrame();
        mW.$(".projectMainFra").height($(top).height()-95);
      }

    }
}
//定义别名
$.p=$.publicFun;
if(top.location!=self.location){  
  $.p.mWindow=top.$("#main_frame")[0].contentWindow;
  if($.p.mWindow.$(".projectMainFra:visible").length){
    $.p.PMWin=$.p.mWindow.$(".projectMainFra:visible")[0].contentWindow;
  }
}  
