Ext.define('Generate.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id','name'],
    
    proxy: {
        type: 'ajax',
        url:'model/list',
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
    model: 'Generate.model.GenericModel',
    autoLoad: true
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
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.genericlist',
    
    title: "Tablas del esquema de base de datos",
    iconCls:'',
    store:'Generic',
    initComponent: function() {
        this.columns=[{
        	header: 'Tabla', width: 200, flex: 1, dataIndex: 'name'
        }]
        this.dockedItems = [{
                dock: 'top',
                xtype: 'toolbar',
                items: [{
                        xtype:'fieldcontainer',
                        defaultType: 'checkboxfield',
                        items:[{
                                    boxLabel  : 'Timestamps',
                                    inputValue: '1',
                                    id        : 'checkbox1'
                                }, {
                                    boxLabel  : 'Underscored',
                                    inputValue: '2',
                                    checked   : true,
                                    id        : 'checkbox2'
                                }]
                    }]
            }];
        this.selModel=Ext.create('Ext.selection.CheckboxModel', {mode: 'MULTI'});
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
                text: "Generar",
                disabled: true,
                //hidden: true,
                //privilegeName: 'insert',
                action: 'generateAction'
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
            ref: 'buttonDelete',
            selector: 'viewport button[action=generateAction]'
        }
    ],
    init: function() {
        this.control({
            
            'viewport button[action=generateAction]':{
                click:this.onGenerateAction
            },
            'generictree': {
                beforeselect: this.onTreeSelect
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
            this.getButtonDelete().enable();
        }
        if (model.get('vendor') === true) {
            this.getButtonDelete().disable();
        }
        if (model.get('vendor') === '') {
            this.getButtonDelete().disable();
        }
    },
    
    
    
    onGenerateAction: function() {
       Raptor.msg.show(2,'Está seguro que desea generar los modelos de las tablas marcadas en este componente', this.generateAction, this);
    },
    
    
    generateAction: function() {
        var model=this.getGenerictree().getSelectionModel().getLastSelected();
        var modelList=this.getGenericlist().getSelectionModel().getSelection();
        var selected=[];

        for (var i = 0; i < modelList.length; i++) {
            selected.push(modelList[i].get('name'))
        };

        var wait=Raptor.msg.show(4,'espere por favor..');
        Ext.Ajax.request({
            url: 'model/generate',
            params:{ 
                nodecomponent: model.get('text'), 
                tables: selected,
                timestamps:Ext.getCmp('checkbox1').getValue(),
                underscored: Ext.getCmp('checkbox2').getValue()
            },
            callback: function() {
                wait.close();
                
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
               
                //this.getButtonDelete().disable();
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