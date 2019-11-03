UE.registerUI('gapfill',function(editor,uiName){
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    var a=1;
    editor.registerCommand(uiName,{
        execCommand:function(){
            //alert('execCommand:' + uiName)
            if(a>30){
                alert("抱歉！最多添加30个！");
            }else{
                editor.execCommand('inserthtml', '<img src="./static/images/gap'+a+'.png" alt="gap" id="gap'+a+'"/>');
                a++;
            }
            
        }
    });
    editor.registerCommand("selectgap",{
        execCommand:function(){
            //alert('execCommand:' + uiName)
           // alert(2);

        }
    });
    
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"添加填空项目",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'',//background-position: -500px 0;
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
           

           //editor.execCommand('selectall');
           console.log(editor.selection.getRange().cloneContents());
           //editor.execCommand('inserthtml', '<div data-id="gap'+a+'">____'+a+'____</div>');
           
        }
    });

    //添加快捷键
    editor.addshortcutkey(uiName, "ctrl+44");
    // editor.addshortcutkey({
    //      "Gapfill" : "ctrl+n"
    // });
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });
    editor.addListener('contentChange', function () {
        
        console.log(editor.getContent());
        var eContent=editor.getContent();
       // editor.setContent('ssss', false);

    });
   
    //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);