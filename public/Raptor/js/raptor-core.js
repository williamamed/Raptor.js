
if(!window.Raptor)
	Raptor={};

Raptor.core={
    storage:{}
}

Raptor.msg={
    defaultTech:'extjs',
    show:function(cod){
        var rest=new Array();
        if(arguments.length>1)
            for(var i=1,cant=arguments.length;i<cant;i++){
                rest.push(arguments[i]);
            }
        switch (cod){
            
            case 1:{
                    this.info.apply(this,rest);
                    break;
            }
            case 2:{
                    this.confirm.apply(this,rest);
                    break;
            }
            case 3:{
                    this.error.apply(this,rest);
                    break;
            }
            case 4:{
                    return this.wait.apply(this,rest);
                    break;
            }
            case 5:{
                    return this.exception.apply(this,rest);
                    break;
            }
        }
    },
    info:function(){
       if(Raptor.msg[this.defaultTech].info){
           Raptor.msg[this.defaultTech].info.apply(this,arguments);
           return;
       }
       if(Raptor.msg.extjs.info){
           Raptor.msg.extjs.info.apply(this,arguments);
           return;
       }
       if(Raptor.msg.bootstrap.info){
           Raptor.msg.bootstrap.info.apply(this,arguments);
           return;
       }
    },
    confirm:function(){
       if(Raptor.msg[this.defaultTech].confirm){
           Raptor.msg[this.defaultTech].confirm.apply(this,arguments);
           return;
       }
       if(Raptor.msg.extjs.confirm){
           Raptor.msg.extjs.confirm.apply(this,arguments);
           return;
       }
       if(Raptor.msg.bootstrap.confirm){
           Raptor.msg.bootstrap.confirm.apply(this,arguments);
           return;
       }
    },
    wait:function(){
       if(Raptor.msg[this.defaultTech].wait){
           return Raptor.msg[this.defaultTech].wait.apply(this,arguments);
           
       }
       if(Raptor.msg.extjs.wait){
           return Raptor.msg.extjs.wait.apply(this,arguments);
           
       }
       if(Raptor.msg.bootstrap.wait){
           return Raptor.msg.bootstrap.wait.apply(this,arguments);
           
       } 
    },
    error:function(){
        if(Raptor.msg[this.defaultTech].error){
           Raptor.msg[this.defaultTech].error.apply(this,arguments);
           return;
       }
       if(Raptor.msg.extjs.error){
           Raptor.msg.extjs.error.apply(this,arguments);
           return;
       }
       if(Raptor.msg.bootstrap.error){
           Raptor.msg.bootstrap.error.apply(this,arguments);
           return;
       }
    },
    exception:function(){
        if(Raptor.msg[this.defaultTech].exception){
           Raptor.msg[this.defaultTech].exception.apply(this,arguments);
           return;
       }
       if(Raptor.msg.extjs.exception){
           Raptor.msg.extjs.exception.apply(this,arguments);
           return;
       }
       if(Raptor.msg.bootstrap.exception){
           Raptor.msg.bootstrap.exception.apply(this,arguments);
           return;
       }
    },
    extjs:{},
    bootstrap:{},
    tags: {
        es:{
            yes:'Sí',
            no: 'No',
            close:'Cerrar',
            acept:'Aceptar'
        },
        en:{
            yes:'Yes',
            no: 'No',
            close:'Cerrar',
            acept:'Acept'
        }
    },
    getLang:function(tag){
        switch (Raptor.getLanguage()){
            case 'es':{
                    return this.tags.es[tag];
                    break;
            }
            case 'en':{
                    return this.tags.en[tag];
                    break;
            }
        }
    }
}


if(window.Ext){

	Ext.require('Ext.form.field.Base');
        
    Ext.onReady(function() {
	      Raptor.core.storage.container = Ext.DomHelper.append(Ext.getBody(), {
	                    tag: 'span'
	      }, true);
	        Raptor.core.storage.ancho1 = Ext.getBody();
	        Raptor.core.storage.container.position('absolute', 1000000, Raptor.core.storage.ancho1.getWidth(true) - 330, 40);

	        Ext.form.field.Base.override({
	        constructor: function() {


	             this.callParent(arguments);
	             if(this.allowBlank==false)
	                this.labelSeparator='<span>: </span><b style="color:red;font-size:12px"> *</b>';
	        }
	    });
	    
	    if(window.parent && window.parent.Ext){
	        Ext.getBody().on('click',function(){
	        	if(window.parent.Ext&&window.parent!=window)
	            	window.parent.Ext.menu.Manager.hideAll();
	        });

	    }

		Ext.Ajax.on('beforerequest', function (conn, options) {
		    if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
		       if(Raptor)
		           var token=Raptor.getCsrfToken();
		        if(!options.params)
		           options.params={_csrf:token};
		       else
		           options.params._csrf=token;                       
		    }


		 }, this);

    Ext.Ajax.on('requestexception', function(conn, response, options){
        if(response.status==401){
          window.location=window.location.href;
        }
    });

	})

	Raptor.msg.extjs.info=function(msg,duration,background,type){


           var f = Ext.DomHelper.append(Ext.getBody(), {
                        tag: 'span',
                        cls: 'msg-raptor2'
                    }, true);
                    
                    var ancho = Ext.getBody();
                    var back='#402878';
                    if(background)
                           back=background;
                    Ext.DomHelper.applyStyles(f, {
                        'width': '300px', 'z-index': '1000000',
                         'padding':'0px',
                         'margin-bottom':'5px',
                         'background-color': back,
                         'color':'#fff',
                         'cursor':'pointer',
                         'display':'inline-block',
                         'font':'bold 100%/2.1 "Lucida Grande", Tahoma, sans-serif',
                         'text-decoration':'none',
                         'text-shadow':'0 1px 0 rgba(0,0,0,0.5)',
                         'box-shadow':'6px 4px 5px 0px rgba(0,0,0,0.75)',
                         '-moz-user-select':'none',
                         '-webkit-user-select':'none',
                         'user-select':'none',
                         'position':'relative'
                         
                    });
      				
                    f.hide();
                     var title = Ext.DomHelper.append(f, {
                        tag: 'div',
                        html: '<span class="" >X</span>'
                    }, true);

                    Ext.DomHelper.applyStyles(title, {
                         
                         'margin-top':'-14px',
                         'margin-right':'-14px',
                         'float': 'right',
                         'color':'#fff',
                         'background':'#b4201c',
                         'width':'20px',
                         'height':'20px',
                         'border-radius': '100%',
                         'font':'bold 100%/2.1 "Lucida Grande", Tahoma, sans-serif',
                         'font-size':'9px',
                         'text-align':'center',
                         'text-shadow':'0 1px 0 rgba(0,0,0,0.5)',
                         '-moz-user-select':'none',
                         '-webkit-user-select':'none',
                         'user-select':'none',
                         'position':'relative'
                         
                    });
                    var titleb='';
                    switch (type){
                        case Raptor.ERROR:{
                             titleb="";   
                             break;   
                        }
                        case Raptor.INFO:{
                             titleb="";   
                             break;      
                        }
                        default:{
                             titleb="";   
                             break;         
                        }
                    }

                    var im = Ext.DomHelper.append(f, {
                        tag: 'span',
                        html: '<span class="icon-info" style="width:20px;height:20px; float:left;margin:2px;"><img height="15" src="/public/Raptor/img/node-min.png" ></span><b>'+titleb+'</b>',
                        cls: 'x-window-dlg',
                        style:{
                            background:'rgba(0,0,0,0.2)',
                            'padding-left':'4px',
                            'padding-top':'2px',
                            display:'block',
                            height: '25px'
                        }
                    }, true);
                    

                    var tex = Ext.DomHelper.append(f, {
                        tag: 'span',

                        html: msg,
                        style:{
                            boxSizing: 'content-box !important',
                            padding:'5px'
                        }

                    }, true);
                    
                    
                    
                    Ext.DomHelper.applyStyles(tex, {
                        padding:'8px',boxSizing: 'content-box !important',
                        display:'block',
                        'font':'normal 100%/2.1 "Lucida Grande", Tahoma, sans-serif',
                        
                    });
                    
                    f.appendTo(Raptor.core.storage.container);
                    
                    
                    
                    var timeTo=15;
                    if(duration){
                        timeTo=duration;
                    }

                    var time=setTimeout(function() {
                            im.hide(true);
                            tex.hide(true);
                         Ext.DomHelper.applyStyles(f, {

                             'border-radius':'0px',
                             'padding':'0px',
                             'margin-bottom':'0apx'
                        });
                         Ext.fly(f).setHeight(0, {
                            duration : 500, // animation will have a duration of .5 seconds
                            // will change the content to "finished"
                            callback: function(){  f.remove(); }
                        });


                    }, timeTo*1000); 

                    title.on('click',function(){
                            clearTimeout(time);
                            im.hide(true);
                            tex.hide(true);
                            Ext.DomHelper.applyStyles(f, {
                                'border-radius': '0px',
                                'padding': '0px',
                                'margin-bottom': '0apx'
                            });
                            Ext.fly(f).setHeight(0, {
                                duration: 500, // animation will have a duration of .5 seconds
                                // will change the content to "finished"
                                callback: function() {
                                    f.remove();
                                }
                            });
                    })
                    f.show({
                        duration: 1000
                    });
    };
    
    Raptor.msg.extjs.confirm=function(msg,fn,scope){
        var arg=arguments;
        
        Ext.Msg.confirm('', msg, function(n) {
                    var params=new Array();
                    params.push(n);
                    if(arg.length>3)
                    for(var i=3,cant=arg.length;i<cant;i++){
                        params.push(arg[i]);
                    }
                    if (n === 'yes') {
                        fn.apply(scope,params);
                    }
              });
    };
    
    Raptor.msg.extjs.wait=function(msg){
        return Ext.Msg.wait(msg,'',{
                            progress: true,
        //                    title: '',
                            closable: false,
                            modal: true,
                            width: 350
         });
    };
    
    Raptor.msg.extjs.error=function(msg,float,fn,scope){
        if(float===undefined || float===true){
            Raptor.msg.extjs.info(msg,undefined,'#990033',Raptor.ERROR);
        }else{
             var buttons = new Array(Ext.MessageBox.OK, Ext.MessageBox.OKCANCEL, Ext.MessageBox.OK);
             var title = new Array('', '', '');
             var icons = new Array(Ext.MessageBox.INFO, Ext.MessageBox.QUESTION, Ext.MessageBox.ERROR);
             Ext.MessageBox.show({
                        title: title[0],
                        msg: msg,
                        //animEl: Ext.getBody(),
                        buttons: buttons[0],
                        icon: icons[2],
                        fn: fn,
                        scope: scope
             }); 
        }
    };
    
    Raptor.msg.extjs.exception=function(msg,trace){
       var win=new Ext.Window({
                          title:'Exception',
                          modal:true,
                          autoHeight:true,
                          closeAction:'destroy',
                          layout:'anchor',
                          iconCls: 'icon-excep',
                          width:600,
                          buttons:[{
                                  xtype:'button',
                                  text:'Close',
                                  iconCls:'icon-cancel',
                                  handler:function(){
                                      win.close();
                                  },
                                  scope:this
                          }],
                          items:[{
                                  xtype:'container',
                                  layout:'anchor',
                                  anchor:'100%',

                                  height:'100%',
                                  items:[{
                                            xtype:'container',
                                            margin:'5 5 5 5',
                                            padding:10,
                                            html:msg,
                                            anchor:'100%'
                                    },{
                                          xtype:'fieldset',
                                          margin:'5 15 5 5',
                                          title: 'Trace',
                                          collapsible: true,

                                          collapsed:true,
                                          layout:'fit',
                                          anchor:'100%',
                                          items:{
                                              xtype:'container',
                                              html:trace
                                          }
                                  }]
                          }]
                       }); 
             win.show();
             return win;
    };
}

if(window.jQuery){
	Raptor.msg.bootstrap.info=function(text,floating,position,classStyle){
		if(!classStyle){
			classStyle=''
		}
		if(floating){
			var msg=$('<div>');
			msg.addClass('alert alert-warning alert-dismissible raptor-msg-float '+classStyle+' fadeInDown');
			if(!position)
				msg.css({top:'0px'})
			else
				msg.css(position)
			msg.attr('role','alert');
			var btn=$('<span class="raptor-msg-closebtn pull-right" data-dismiss="alert" aria-hidden="true">&times;</span>');
			msg.append(btn)
			msg.append(text)
			msg.appendTo('body');
			setTimeout(function(){
				if(msg)
					msg.fadeOut(function(){
						msg.remove();
					})
					
			},10*1000)
		}
	}
	Raptor.msg.bootstrap.error=function(text,floating,position,classStyle){
		Raptor.msg.bootstrap.info(text,floating,position,classStyle?classStyle:'raptor-msg-red');
	}

	Raptor.msg.bootstrap.confirm=function(title,msg,fn,scope){
        var modal=$('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"></div>');
        var dialog=$('<div class="modal-dialog"></div>');
        var content=$('<div class="modal-content"></div>');
        var header=$('<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" >'+title+'</h4></div>');
        var body=$('<div class="modal-body"></div>');
        var footer=$('<div class="modal-footer"></div>');
        
        var no=$('<button type="button" class="btn btn-default" data-dismiss="modal">'+Raptor.msg.getLang('no')+'</button>');
        var yes=$('<button type="button" class="btn btn-primary">'+Raptor.msg.getLang('yes')+'</button>');
        footer.append(yes);
        footer.append(no);
        if(!fn)
            fn=function(){};
        if(!scope)
            scope=this;
        no.click(function(){
            fn.apply(scope,['no']);
        });
        yes.click(function(){
            fn.apply(scope,['yes']);
            $(modal).modal('hide');
        });
        modal.append(dialog);
        dialog.append(content);
        content.append(header);
        content.append(body);
        content.append(footer);
        body.append(msg);
        $('body').append(modal);
        $(modal).modal('show');
    };

    Raptor.msg.bootstrap.wait=function(msg){
    	if(UIR && UIR.load)
    		UIR.load.show(msg);
    	return {
    		close:function(){
    			UIR.load.close()
    		}
    	}	
    }
}

Raptor.INFO=1;
Raptor.QUESTON=2;
Raptor.ERROR=3;
Raptor.WAIT=4;
Raptor.EXCEPTION=5;
Raptor.DATA=6;