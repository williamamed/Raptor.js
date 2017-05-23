Ext.define('Generate.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id'],
    
    proxy: {
        type: 'ajax',
        api:{
            create  : 'action/insert',
            read    : 'action/list',
            update  : 'action/edit',
            destroy : 'action/delete'
        },
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('Generate.model.GenericTreeModel', {
    extend: 'Ext.data.Model',
    fields: ['id','text','namespace','vendor'],
    
    proxy: {
        type: 'ajax',
        url: 'generatenode/list',
       
        actionMethods: { //POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});

Ext.define('Generate.store.Generic', {
    extend: 'Ext.data.Store',
    model: 'Generate.model.GenericModel'
});
Ext.define('Generate.store.GenericTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Generate.model.GenericTreeModel',
    autoLoad: true,
    root: {
        text: "src",
        expandable:true
    }
});
Ext.define('Generate.view.GenericList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.genericlist',
    
    title: "Salida de la rutina de componentes Raptor",
    iconCls:'',
    bodyStyle:'background:white;padding:20px;overflow-y: scroll',
    html:'<b style="color:gray">>> Consola - Raptor.js</b>',
    initComponent: function() {
        
        this.callParent();
    }
});


Ext.define('Generate.view.GenericTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.generictree',
    rootVisible: true,
    store: 'GenericTreeStore',
    title: 'Vendors/Nodes',
    iconCls:'',
    width:'30%',
    initComponent: function() {
        
        
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: "Crear",
                disabled: true,
                //hidden: true,
                //privilegeName: 'insert',
                action: 'addAction'
                //iconCls: 'icon-add'
            }, {
                xtype: 'button',
                text: "Eliminar",
                disabled: true,
                //hidden: true,
                //privilegeName: 'insert',
                action: 'deleteAction'
                //iconCls: 'icon-add'
            }]
        }];
        this.callParent();
    }
});

 Ext.define('Generate.view.GenericWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.genericwindow',
        autoShow: true,
        closeAction:'destroy',
        title:"Crear componente Raptor",
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            frame: true,
            xtype: 'form',
            layout: 'anchor',
            bodyStyle: 'padding:5px 5px 5px 5px',
            defaults: {frame: true, anchor: '100%'},
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Nombre de agrupador',
                itemId: 'vendor',
                allowBlank: false,
                maxLength: 15,
                regex: /^[a-zA-Z0-9]+$/,
                enableKeyEvents: true,
                width: '100%',
                anchor: '100%',
                labelAlign: 'top',
                name: 'vendor'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Nombre del componente',
                itemId: 'bundle',
                allowBlank: false,
                maxLength: 30,
                enableKeyEvents: true,
                regex: /^[a-zA-Z0-9]+$/,
                blankText: 'The node need a name',
                width: '100%',
                anchor: '100%',
                labelAlign: 'top',
                name: 'bundle'
            }, {
                xtype: 'label',
                text: '',
                itemId: 'definition',
                margin: '10 10 10 10'
            }]
        };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: 'Aceptar',
                            action: 'save'
                        }, 
                        {
                            iconCls: 'icon-cancel',
                            text: 'Cancelar',
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })



Ext.define('Generate.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'generictree',
                        region:'west'
                    },{
                        xtype: 'genericlist',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});
Ext.define('Generate.controller.Generic', {
    extend: 'Ext.app.Controller',
    stores: ['Generic','GenericTreeStore'],
    models: ['GenericModel'],
    refs: [{
            ref: 'generictree',
            selector: 'generictree'
        },
        {
            ref: 'genericlist',
            selector: 'genericlist'
        },
        {
            ref: 'buttonAdd',
            selector: 'viewport button[action=addAction]'
        },
        {
            ref: 'buttonDelete',
            selector: 'viewport button[action=deleteAction]'
        },
        {
            ref: 'form',
            selector: 'genericwindow button[action=save]'
        }, {
            ref: 'vendortext',
            selector: 'genericwindow textfield[name=vendor]'
        }, {
            ref: 'nodetext',
            selector: 'genericwindow textfield[name=bundle]'
        }, {
            ref: 'definitiontext',
            selector: 'genericwindow label[itemId=definition]'
        }
    ],
    init: function() {
        this.control({
            
            'genericwindow button[action=save]': {
                click: this.addAction
            },
            'viewport button[action=addAction]': {
                click: this.onAddAction
            },
            'viewport button[action=deleteAction]':{
                click:this.onDeleteAction
            },
            'generictree': {
                beforeselect: this.onTreeSelect
            },
            'genericwindow textfield[name=vendor]': {
                keyup: this.definition,
                change: this.definition
            },
            'genericwindow textfield[name=bundle]': {
                keyup: this.definition
            },
            'viewport':{
                render:this.onRender
            }
        });
       
    },
    onRender:function(){
        //Make Raptor control the UI to activate the privilege
      //  Raptor.controlActions();

    },
    
    onListSelect: function() {
       
        
    },
    onListDeSelect: function() {
      
        
    },
    onTreeSelect: function (mode, model) {
        if (model.get('vendor') === false) {
            this.getButtonAdd().disable();
            this.getButtonDelete().enable();
        }
        if (model.get('vendor') === true) {
            this.getButtonAdd().enable();
            this.getButtonDelete().disable();
        }
        if (model.get('vendor') === '') {
            this.getButtonDelete().disable();
            this.getButtonAdd().enable();
        }
    },
    definition: function () {
        var view = this.getNodetext().up('window');
        var vendor = view.down('form').query('#vendor')[0].getValue();
        var bundle = view.down('form').query('#bundle')[0].getValue();
        this.definition = "\\" + vendor + '\\' + bundle + 'Node';
        var definitionView = '<b style="color:black">Definición:&nbsp;&nbsp;<br></b><b style="color:black">\\</b><b style="color:green">' + vendor + '</b><b style="color:black">\\</b><b style="color:black">' + bundle + '</b><b style="color:blue">Node</b>';
        view.down('form').query('#definition')[0].setText(definitionView, false);
    },
    onAddAction: function() {
        var view = Ext.widget('genericwindow');
        if (this.getGenerictree().getSelectionModel().getLastSelected().get('vendor') == true) {
            this.getVendortext().disable();
            this.getVendortext().setValue(this.getGenerictree().getSelectionModel().getLastSelected().get('text'));
        }
        var vendor = view.down('form').query('#vendor')[0].getValue();
        var bundle = view.down('form').query('#bundle')[0].getValue();
        this.definition = "\\" + vendor + '\\' + bundle + 'Node';
        var definitionView = '<b style="color:black">Definición:&nbsp;&nbsp;<br></b><b style="color:black">\\</b><b style="color:green">' + vendor + '</b><b style="color:black">\\</b><b style="color:black">' + bundle + '</b><b style="color:blue">Node</b>';
        view.down('form').query('#definition')[0].setText(definitionView, false);
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDeleteAction: function() {
       Raptor.msg.show(2,'Está seguro que desea eliminar este componente', this.deleteAction, this);
    },
    
    addAction:function(button){
        var view = button.up('window');
        var form = view.down('form');
        this.getGenericlist().body.setHTML('<b style="color:gray">>> Consola - Raptor.js</b>');
        var selected=this.getGenerictree().getSelectionModel().getLastSelected();
        form.submit({
            url: 'generatenode/create',
            waitMsg: 'espere por favor..',
            params: { vendor: this.getVendortext().getValue()},
            success: function (formBasic, action) {
                form.up('window').close();
                var self=this;
                Raptor.msg.show(action.result.code, action.result.msg);
                if(action.result.code==Raptor.INFO && action.result.params.routine){
                    var log=action.result.params.routine;
                  
                    if(selected.get('vendor')==true){
                        selected.appendChild({
                            "text": action.result.params.name,
                            "expandable": false,
                            "vendor": false,
                            "namespace": action.result.params.name
                          })
                    }else{
                        selected.appendChild({
                            "text": action.result.params.nameVendor,
                            "expanded": true,
                            "children":[{
                                "text": action.result.params.name,
                                "expandable": false,
                                "vendor": false,
                                "namespace": action.result.params.name
                            }],
                            "vendor": true
                          })
                    }
                    var cont=0;
                    var consoleInt=setInterval(function(){
                        if(cont<log.length)
                            self.getGenericlist().body.setHTML(self.getGenericlist().body.getHTML()+'<br>>>&nbsp;'+log[cont]);
                        else
                            clearInterval(consoleInt);
                        cont++;
                    },500)
                    
                }
            },
            failure: function (formBasic, action) {
               
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Raptor.msg.show(3,'Error en los datos del formulario');
                        break;
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        Raptor.msg.show(3, 'Ajax communication failed');
                        break;
                }

                if (action.result && action.result.code) {
                    Raptor.msg.show(action.result.code, action.result.msg);
                }

            },
            scope: this
        });
    },
  
    deleteAction: function() {
        var model=this.getGenerictree().getSelectionModel().getLastSelected();
        
        var wait=Raptor.msg.show(4,'espere por favor..');
        Ext.Ajax.request({
            url: 'generatenode/delete',
            params:{ nodecomponent: model.get('text') },
            callback: function() {
                wait.close();
                
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                var parent=model.parentNode;
                if(obj.code==Raptor.INFO)
                    model.remove();
                if(parent && !parent.hasChildNodes()){
                    parent.remove()
                }
                this.getButtonDelete().disable();
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
       
      
    }

});


/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'Generate',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel','GenericTreeModel'],    
    stores: ['Generic','GenericTreeStore'],
    controllers: ['Generic']
});

//Raptor.Animated();