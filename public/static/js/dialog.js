/*
 * js module-弹窗组件
 * author: Sumii@Sumii.cn;
 * data: 2016-7-28;
*/
var dialogsArr;
function Dialog(options){
    this.settings=$.extend({ 
        ndDom: "#dialogBox",//对应dialog中要放的div的id选择器 | 如果打开的是个iframe页面，那此项是对应dialog的data-id，必填，且不可重复！！！！！！约定一下：对应弹窗id为“#当前页面文件名＋number(页面里有三个弹窗就是1，2，3)”
        url:"",//如果弹窗内是个iframe，设置iframe的src属性值为url
        width: 300,//dialog宽度
        height: 0,//dialog高度，0的时候高度自适应
        closeBtn: true,//是否需要关闭弹窗X按钮
        closeBtnStyle: "small",//big注册那种模式   small ，在里面的模式
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
        closeCallback: function () { },//关闭弹窗的回调
        closeCallBackArr:[]
    },options);
    this.init(this.settings);
    this.events(this.settings);
}

Dialog.prototype={
    init:function(options){
        
       //render
       var self=this;
       this.settings.width+=this.settings.padding*2;
            //body去掉滚动条
            $("body").css("overflow", "hidden");
            this.dialogId=this.settings.ndDom.substring(1);
            this.settings.closeCallBackArr[this.settings.closeCallBackArr.length]=this.settings.closeCallback;
            //保存dialog对象
           // window.dialogsArr[this.dialogId]=this;
            if($("[data-id="+this.dialogId+"]").length){
                var $dialog = $("[data-id="+this.dialogId+"]");
                var $dialogWrap = $dialog.find(".dialogWrap");
                this.dialogMask = $dialog;
                this.dialogWrap = "[data-id="+this.dialogId+"] .dialogWrap";
                var $dialogClose = $dialog.find(".icon-dialog-close");
                var $dialogCloseSmall =  $dialog.find(".icon-dialog-close-small");
                var $dialogCon = $dialog.find(".dialogContent");
                $dialog.show();
            }else{
                   var $dialogWrap = $("<div class='dialogWrap animated fadeInUp'></div>");
                    var $dialog = $("<div class='blackWrap'></div>");
                    this.dialogMask = $dialog;
                    var $dialogClose = $("<a class='icon-dialog-close' title='关闭'></a>");
                    var $dialogCloseSmall = $("<a class='icon-dialog-close-small' title='关闭'></a>");
                    var $dialogConteng=$('<div class="dialogContent"></div>');
                    if(options.url!=""){
                        //如果url不为空就直接打开一个iframe
                        var $dialogCon = $('<iframe class="dialogMainFrame" id="'+self.dialogId+'Iframe" src="'+options.url+'"></iframe>').appendTo($dialogConteng);
                        self.resizeFrameHeight(self.dialogId+"Iframe",self.settings.height);
                    }else{
                        var $dialogCon = $(options.ndDom).appendTo($dialogConteng);
                    }
                    $dialog.attr("data-id",this.dialogId);
                    $dialog.attr("data-num",this.settings.closeCallBackArr.length);
                    this.dialogCon = $dialogCon;
                    $dialog.height($(window).height());
                    //处理普通弹窗头部
                    if(options.hasH1 || options.hasH2){
                        var $dialogHead=$('<div class="dialogHeader" style="padding:8px 20px"></div>');
                        if(options.hasH1){
                            $dialogHead.append('<h1>'+options.h1Txt+'</h1>');
                        }
                        if(options.hasH2){
                            $dialogHead.append('<h2>'+options.h2Txt+'</h2>');
                        }
                        $dialogWrap.append($dialogHead);
                    }
                    if (!this.settings.confirm) {//confirm无需加载弹窗内容
                        $dialogWrap.append($dialogCon)
                    }
                    $dialogWrap.appendTo($dialog);
                    //添加关闭按钮
                    if($(window).width()<640){
                        $dialogWrap.append($dialogClose);
                        $dialogClose.css({"top":"-30px","right":"10px"});
                    }else{
                        if (options.closeBtn && options.closeBtnStyle == "big") {//判断是否需要关闭按钮
                            $dialogWrap.append($dialogClose);
                        }
                        if (options.closeBtn && options.closeBtnStyle == "small") {//判断是否需要关闭按钮
                            $dialogWrap.append($dialogCloseSmall);
                        }
                    }
                    
                    $dialogCon.show();
                    $dialogCon.css("padding", options.padding + "px");
                    $dialog.appendTo("body");
            } 

            // //处理confirm弹窗
            if(options.confirm){
                    $dialog.attr("data-id","confirmBox");
                     var confirmInfo = "<div class=\"confirm_content clearFix\">" +
                                    "<i class=\"icon-ask\"></i>" +
                                    "<div class=\"confirm_text\">" +
                                       "<h2>" + this.settings.confirmTitle + "</h2>" +
                                       "<p>" + this.settings.confirmText + "</p>" +
                                    "</div>" +
                                "</div>" +
                                "<div class=\"confirm_buttons\"><a class=\"btn-primary-xm\">确定</a><a class=\"btn-border-xm role-dialogClose\">取消</a></div>";
                     $dialogWrap.append(confirmInfo).css("padding", options.padding + "px");
                     $dialog.append($dialogWrap).appendTo("body");
                }
            // //处理alter弹窗
            if(options.alter){
                    $dialog.attr("data-id","confirmBox");
                     var confirmInfo = "<div class=\"confirm_content clearFix\">" +
                                    "<i class=\"icon-warn\"></i>" +
                                    "<div class=\"confirm_text\">" +
                                       "<h2>" + this.settings.alterTitle + "</h2>" +
                                       "<p>" + this.settings.alterText + "</p>" +
                                    "</div>" +
                                "</div>" +
                                "<div class=\"alter_buttons\"><a class=\"btn-primary-xm role-dialogClose\">知道了</a></div>";
                     $dialogWrap.append(confirmInfo).css("padding", options.padding + "px");
                     $dialog.append($dialogWrap).appendTo("body");
                }
            //设置宽度--应放在渲染的最后
            self.setPosition($dialogWrap,options);
               if($(window).width()>640){//手机弹窗适配
                $(window).resize(function () {
                    $dialog.height($(window).height());
                    self.setPosition($dialogWrap,options);
               });
               } 
    },
    events:function(){
        var self = this;
         $(".icon-dialog-close,.icon-dialog-close-small,.role-dialogClose").unbind().click(function () {
             var thisID=$(this).parents(".blackWrap").attr("data-id");
             self.close(thisID);
             return false;
         });
         //confirm确定按钮回调
         this.dialogMask.find(".confirm_buttons .btn-primary-xm").click(function () {
             self.settings.confirmYesCallback();
             self.close();
         });
         //alter_buttons  alter确定按钮回调
         this.dialogMask.find(".alter_buttons .btn-primary-xm").click(function () {
             self.settings.alterYesCallback();
         });
    },
    setPosition:function($dialogWrap,options) {
        var winW = $(window).width();
        var winH = $(window).height();
        if(winW<640){//手机弹窗适配
            if(!$(".bodyWrap2").length){
                $("body").wrapInner("<div class='bodyWrap2' style='height:"+winH+"px;overflow:hidden;'></div>");
            }else{
                $(".bodyWrap2").css({"height":winH+"px","overflow":"hidden"});
            }
            $dialogWrap.width(winW).css({"box-sizing":"border-box","bottom":0,"top":"auto","left":0,"width":"100%"});
            $dialogWrap.children().not("a").css({"max-height":(winH-40-options.padding*2)+"px","overflow":"auto"});
        }else{
            if (options.width) {
                $dialogWrap.width(options.width).css("left", (winW - options.width ) / 2 + "px");
            }
            if (options.height) {
                $dialogWrap.height(options.height);
                if (winH - options.height - 2 * options.padding > 40) {
                    $dialogWrap.css("top", (winH - options.height ) / 2 + "px");
                } else {
                    $dialogWrap.css({ "top": "0", "margin-top": "20px", "margin-bottom": "20px" });
                }
            } else {
                if (winH - $dialogWrap.height() - 2 * options.padding > 40) {
                    $dialogWrap.css("top", (winH - $dialogWrap.height() ) / 2 + "px");
                } else {
                    $dialogWrap.css({ "top": "0", "margin-top": "20px", "margin-bottom": "20px" });
                }
            }//else
        }//else
    },//setPosition
    //关闭窗体
    close: function (dialogID) {
        $(".bodyWrap2").css({"overflow":"auto","height":"auto"});
        if(this.settings.url!="" || typeof timerObj !="undefined"){
                window.clearInterval(timerObj);
            }
        if(typeof dialogID=="undefined"){
            this.settings.closeCallback();
            this.dialogMask.remove();
        }else{
            var num=$("[data-id="+dialogID+"]").attr("data-num");
            this.settings.closeCallback();
            if($("[data-id="+dialogID+"]").find("iframe").length){
                $("[data-id="+dialogID+"]").remove();
            }else{
                $("[data-id="+dialogID+"]").remove();
            }
        }
    },
    //resizeFrameHeight
    resizeFrameHeight:function(iframeId, minHeight){//没有处理如果是跨域页面的问题
        var self=this;
        window.resizeFrameHeight=function(){
            var iframePageH=$("#"+iframeId)[0].contentWindow.$("body").outerHeight();
            $("#"+iframeId).height(iframePageH);
            var $dialogWrap=$("[data-id="+self.dialogId+"] .dialogWrap");
            if($dialogWrap.css("top")!="0"){
                self.setPosition($dialogWrap,self.settings);
            }
        }
        window.timerObj=window.setInterval("resizeFrameHeight()",500);
    }//resizeFrameHeight
};//prototype

function dialogClose(dialogId){
     if(typeof dialogId == "undefined"){
        //全部关闭弹窗
        window.clearInterval(timerObj);
        $(".blackWrap").remove();
     }else{
        //根据id关闭弹窗
        window.clearInterval(timerObj);
        $("[data-id="+dialogId+"]").remove();
     }
}

