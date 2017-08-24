Ext.define('Publish.model.GenericModel', {
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
Ext.define('Publish.model.GenericTreeModel', {
    extend: 'Ext.data.Model',
    fields: ['id','text','namespace','vendor'],
    
    proxy: {
        type: 'ajax',
        url: 'publish/list',
       
        actionMethods: { //POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});

Ext.define('Publish.store.Generic', {
    extend: 'Ext.data.Store',
    model: 'Publish.model.GenericModel'
});
Ext.define('Publish.store.GenericTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Publish.model.GenericTreeModel',
    autoLoad: true,
    root: {
        text: "src",
        expandable:true
    }
});
Ext.define('Publish.view.GenericList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.genericlist',
    
    title: "Salida de la rutina de publicación de recursos web",
    iconCls:'',
    bodyStyle:'background:white;padding:20px;overflow-y: scroll',
    html:'<b style="color:gray">>> Consola - Raptor.js</b>',
    initComponent: function() {
        
        this.callParent();
    }
});


Ext.define('Publish.view.GenericTree', {
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
                text: "Publicar",
                action: 'addAction'
                //iconCls: 'icon-add'
            }, {
                xtype: 'button',
                text: "Limpiar",
                action: 'deleteAction'
                //iconCls: 'icon-add'
            }]
        }];
        this.callParent();
    }
});

 Ext.define('Publish.view.GenericWindow',{
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



Ext.define('Publish.view.Viewport', {
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
Ext.define('Publish.controller.Generic', {
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
            
            'viewport button[action=addAction]': {
                click: this.addAction
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
        
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDeleteAction: function() {
       Raptor.msg.show(2,'Está seguro que desea limpiar los recursos de este componente', this.deleteAction, this);
    },
    
    addAction:function(){
        var model=this.getGenerictree().getChecked();
        var nodes=[]
        for (var i = 0; i < model.length; i++) {
            nodes.push(model[i].get('text'))
        };
        var wait=Raptor.msg.show(4,'espere por favor..');
        Ext.Ajax.request({
            url: 'publish/publish',
            params:{ modules: nodes },
            callback: function() {
                wait.close();
                
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
    },
  
    deleteAction: function() {
         var model=this.getGenerictree().getChecked();
        var nodes=[]
        for (var i = 0; i < model.length; i++) {
            nodes.push(model[i].get('text'))
        };
        var wait=Raptor.msg.show(4,'espere por favor..');
        Ext.Ajax.request({
            url: 'publish/clear',
            params:{ modules: nodes },
            callback: function() {
                wait.close();
                
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                
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
    name: 'Publish',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel','GenericTreeModel'],    
    stores: ['Generic','GenericTreeStore'],
    controllers: ['Generic']
});

//Raptor.Animated();