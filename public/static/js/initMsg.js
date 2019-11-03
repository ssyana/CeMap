/*
 * js module-初始化控制台代办消息列表
 * author: Sumii@Sumii.cn;
 * data: 2016-7-28;
*/
$.initMsg={
    init:function(listData,totalCount){//listData列表数据  totalCount代办总条数，包括查看更多里的
       this.$msgWrap=$("#home_msg_warp");
       //设置msg列表高度
       var msgHeight=$(window).height()-70;
       this.$msgWrap.height(msgHeight);
       //render  events
       this.render(listData,totalCount);
       this.events();
    },
    render:function(listData,totalCount){
       //初始化列表
       var tempHtml='';
       $.each(listData,function(i,n){
           tempHtml+='<li data-id="'+n.id+'">'+
                        '<h3><a onclick="openurl(\''+n.url+'\')">'+n.name+'</a></h3>'+
                        '<p class="msg_date">'+
                          '<span class="mr5 color-primary bold">#'+n.type+'</span>'+
                          ''+n.dateTime+''+
                        '</p>'+
                      '</li>';
       });
       this.$msgWrap.children(".home_msg_list").html(tempHtml);         
       //显示代办消息数totalCount
       var totalCount1=totalCount>99?"99+":totalCount;
       $(".msg_count").html(totalCount1);
    },
    events:function(){
      var self=this;
      //点击消息图标显示列表
      $("body").off("click",".msg_box");
      $("body").on("click",".msg_box",function(){
          self.$msgWrap.toggle();
      })
      //划出头部时隐藏msgwrap
      $("body").mouseover(function(){
           var myEventTarget=event.srcElement || event.target;
           if($(myEventTarget).attr("name")=="main_frame"){
               self.$msgWrap.hide();
           }
      });
      //window.resize重新计算消息列表高度
      $(window).resize(function(){
          //设置msg列表高度
           var msgHeight=$(window).height()-70;
           self.$msgWrap.height(msgHeight);
      });
    }
};