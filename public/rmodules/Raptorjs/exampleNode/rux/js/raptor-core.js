/**
 * Raptor - Integration PHP 5 framework
 *
 * @author      William Amed <watamayo90@gmail.com>, Otto Haus <ottohaus@gmail.com>
 * @copyright   2014 
 * @link        http://dinobyte.net
 * @version     2.0.1
 * @package     Raptor
 *
 * MIT LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Raptor.controlActions=function() {
    if(!Raptor.getActions){
                
                console.info("You are using the function Raptor.getActions() provided by the Syntarsus Module wich is not linked to this route.");
                return;
            }
            
    if(window.Ext){
            
            var actions = Raptor.getActions();
            if (actions != false) {
                var actionsSize = actions.length;
                var selector = new Array();
                for (var i = 0; i < actionsSize; i++) {
                    selector.push('[privilegeName=' + actions[i] + '] ');
                }
                var sel=selector.join(',');
                var all = Ext.ComponentQuery.query('[?privilegeName]');
                Ext.each(all, function(name, index, countriesItSelf) {
                    name.hide();
                });
                
                var compo = Ext.ComponentQuery.query(sel);
                
                Ext.each(compo, function(name, index, countriesItSelf) {
                    name.show();
                });
            }
    }
    if(window.jQuery){
            
            var actions = Raptor.getActions();
            if (actions != false) {
                var actionsSize = actions.length;
                
                $("[privilegeName]").hide();
                
                var selector = new Array();
                for (var i = 0; i < actionsSize; i++) {
                    selector.push("[privilegeName='" + actions[i] + "'] ");
                }
                var sel=selector.join(',');
                
                $(sel).show();
            }
    }
}
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
Raptor.Animated=function(source){
    if(window.Ext){
            Ext.onReady(function() {
            
            var f = Ext.DomHelper.append(Ext.getBody(), {
                tag: 'div'
            }, true);

            var ancho = Ext.getBody();
            Ext.DomHelper.applyStyles(f, {
                'width': '80px', height: '95px', 'z-index': '1000000','border-radius':'5px'
            });
            var src=Raptor.getBundleResource('Raptor/img/anim2.gif');
            if(source)
                src=source;
            var im = Ext.DomHelper.append(f, {
                            tag: 'img',
                            src:src,
                            'width': '80', height: '95'
            }, true);
            f.position('absolute', 1000000, ancho.getWidth(true) - 100, ancho.getHeight() - 100);
            f.show({duration: 1000});
            f.flagVision = true;

            setInterval(function() {
                if (f.flagVision) {
                    f.fadeOut({
                        opacity: 0, //can be any value between 0 and 1 (e.g. .5)
                        easing: 'easeOut',
                        duration: 1000,
                        remove: false,
                        useDisplay: false
                    });
                    f.flagVision = false;
                } else {
                    f.show({
                        opacity: 0, //can be any value between 0 and 1 (e.g. .5)
                        easing: 'easeIn',
                        duration: 1000,
                        remove: false,
                        useDisplay: false
                    });

                    f.flagVision = true;
                }
            }, 20000);
        })
    }
};

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
        
        Ext.Ajax.on('requestcomplete', function(conn, response, options){

                        var respText = response.responseText;
                        var resp=Ext.decode(respText);
                        if (resp!=undefined&&resp.cod!=undefined&&resp.cod==5){
                            Raptor.msg.extjs.exception(resp.msg,resp.trace);
                        }
        });

        Ext.Ajax.on('requestexception', function(conn, response, options){

                        var respText = response.responseText;
                        var resp=Ext.decode(respText);
                        if (resp!=undefined&&resp.cod!=undefined&&resp.cod==5){
                                Raptor.msg.extjs.exception(resp.msg,resp.trace);
                        }
        });

        Ext.Ajax.on('beforerequest', function (conn, options) {
                            if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
                               if(Raptor)
                                   var token=Raptor.getToken();
                                if(!options.params)
                                   options.params={token:token};
                               else
                                   options.params.token=token;                       
                            }


                            }, this);

        });
        
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
                                 titleb="Ops, no se alarme !!";   
                                 break;   
                            }
                            case Raptor.INFO:{
                                 titleb="Información";   
                                 break;      
                            }
                            default:{
                                 titleb="Información";   
                                 break;         
                            }
                        }
                        var im = Ext.DomHelper.append(f, {
                            tag: 'span',
                            html: '<span class="icon-info" style="width:20px;height:20px; float:left;margin:2px;"></span><b>'+titleb+'</b>',
                            cls: 'x-window-dlg',
                            style:{
                                background:'rgba(0,0,0,0.2)',
                                padding:'5px',
                                display:'block'
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
        
        Raptor.msg.bootstrap.info=function(msg,duration,background){
            var classe='alert-info';
            if(background)
                classe=background;
            var info=$('<div class="alert '+classe+' alert-dismissible fade in" role="alert" style="position: fixed;right: 15px;top: 50px;z-index:100000"></div>');
            var btn=$('<button class="close" data-dismiss="alert" type="button"></button>');
            btn.append('<span aria-hidden="true">×</span>');
            btn.append('<span class="sr-only">Close</span>');
            info.append(btn);
            info.append('<p>'+msg+'</p>');
            $('body').append(info);
            var dur=10;
            if(duration!==undefined){
                dur=duration;
            }
            setTimeout(function(){
                info.alert('close');
            },dur*1000);
            
        }
        
        Raptor.msg.bootstrap.error=function(msg){
            Raptor.msg.bootstrap.info(msg,undefined,'alert-danger');
        }
        
        Raptor.msg.bootstrap.wait=function(msg){
            
           var m=$('body').Loading({
               msg:msg,
               runIncrement: true
           });
           m.show();
           m.startIncrement();
           return m;
        };
        
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
        
        Raptor.msg.bootstrap.exception=function(title,msg,trace){
            var modal=$('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"></div>');
            var dialog=$('<div class="modal-dialog"></div>');
            var content=$('<div class="modal-content"></div>');
            var header=$('<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" >'+title+'</h4></div>');
            var body=$('<div class="modal-body"></div>');
            var footer=$('<div class="modal-footer"></div>');
            
            var no=$('<button type="button" class="btn btn-default" data-dismiss="modal">'+Raptor.msg.getLang('close')+'</button>');
            
            
            footer.append(no);
            
            modal.append(dialog);
            dialog.append(content);
            content.append(header);
            content.append(body);
            content.append(footer);
            body.append(msg);
            body.append('<hr>');
            body.append(trace);
            $('body').append(modal);
            $(modal).modal('show');
        };
        
        (function($){

    var Cargando = function(options){
        this.options = $.extend(this.defaults,  options);
        this.init();
    };

    Cargando.prototype = {
        constructor: Cargando
        ,defaults : {
            msg: ''
            ,id: 'idProcedandoMsg'
            ,percent: 0
            ,recursive: true
            ,holder: 'body'
            ,textColor: '#3A87AD'
            ,runIncrement: false
        }
        ,init : function(){
            $('#'+this.options.id).remove();
            
            var $superContainer = $('<div class="procesando-supercontainer" style="text-align:center;background-color: rgba(255,255,255,0.7); z-index: 1100; position: fixed;left:0;top:0;bottom:0;right:0;"></div>')
                .attr('id', this.options.id);
            var $container = $('<div class="progress" style=""></div>');
            var $progress = $('<div class="progress-bar progress-bar-success progress-bar-striped"></div>');
//            var $bar = $('<div style="width: 0%;" class="bar"></div>');
//            $progress.append($bar);
            var $texto = $('<strong></strong>').css({color: this.options.textColor});
            if(this.options.msg && this.options.msg != ''){
                $texto.html(this.options.msg);
            }else{
                $texto.hide();
            }
            var $location=$('<div style="position:absolute;top:50%;width:100%;padding:10px;"></div>');
            $location.append($texto);
            $location.append($container);
            $superContainer.append($location);
            $container.append($progress);
            $superContainer
                .hide()
                .appendTo(this.options.holder);
            //console.log($bar);return;
            this.resetIncrementStatus();
            this.options.cargando = $superContainer;
            if(this.options.runIncrement)
                this.incrementPercent();
            
            return this;
        }
        ,incrementPercent : function(){
            var el = this;
            if(this.options.percent == 100 || !this.options.runIncrement){
                if(this.options.recursive)
                    this.options.percent=0;
                else{
                this.destroy();
				return;
                }
			}
            this.options.percent+=5;
			
            this.options.cargando.find('.progress-bar').css('width', this.options.percent+'%');
            
            setTimeout(function(){
               el.incrementPercent()
            }, 400);
        },
		setPercent : function(percent){
            var el = this;
			this.options.percent=percent;
            if(this.options.percent >= 100 || !this.options.runIncrement){
                this.destroy();
				return;
			}
            
			
            this.options.cargando.find('.progress-bar').css('width', this.options.percent+'%');
            //setTimeout(this.incrementPercent, 250);
        }
        ,show : function(){
            if(!this.options.cargando)
                this.init()
            this.options.cargando.show();
            
            //this.options.cargando.find('.bar').css({'width': '100%'});
            return this;
        }
        ,hide : function(){
            $('#'+this.options.id).fadeOut('fast');
            return this;
        }
        ,destroy : function(){
            var el = this;
            $('#'+this.options.id).fadeOut('fast', function(){
                var data = $(el.options.holder).data();
                $(data).removeProp('Loading');
            });
            return null;
        }
        ,removeMsg : function(){
            if(this.options.cargando){
                var visible = this.options.cargando.is(':visible')
                this.options.cargando.remove();
                this.options.cargando = undefined;
//                if(visible){
//                    this.init()
//                        .show();
//                }
            }
            return this;
        }
        ,setMsg : function(msg){
            this.options.msg = msg;
            if(this.options.cargando){
                var visible = this.options.cargando.is(':visible')
                this.removeMsg();
                if(visible){
                    this.init()
                        .show();
                }
            }
            return this;
        }
        ,startIncrement : function(){
            this.options.runIncrement = true;
            this.incrementPercent();
            return this;
        }
        ,stopIncrement : function(){
            this.options.runIncrement = false;
            return this;
        }
        ,resetIncrementStatus : function(){
            this.options.percent = 0;
            return this;
        }
    };

    var  noConflictVuProcesando = $.fn.Loading;
        

    /*Agrega el procesando el primero de la coleccion seleccionada.*/
    $.fn.Loading = function(options){
        if(this.length){
            var  $element = $(this[0])
                ,plugin = $element.data('Loading');
            if(typeof  options == 'string' &&  plugin){
                if(typeof plugin[options] == 'function')
                    return plugin[options]();
                else
                    return plugin.setMsg(options);
            }else if (    plugin
                && typeof  options == 'object'
                && !(options instanceof Array)
                )
            {
                plugin.destroy();
                options = $.extend(options, {holder: $element});
            }else if(typeof  options == 'string'){
                options = $.extend({msg: options}, {holder: $element});
            }

            if(!plugin){
                plugin = new Cargando(options);
                $element.data('Loading', plugin);
            }

            return plugin;
        }
    }

    
        /*Resolucion de conflictos*/
        $.fn.Loading.noConflict = function () {
            $.fn.Loading = noConflictVuProcesando;
            return this;
        }
    })(jQuery);

}
Raptor.INFO=1;
Raptor.QUESTON=2;
Raptor.ERROR=3;
Raptor.WAIT=4;
Raptor.EXCEPTION=5;
Raptor.DATA=6;
