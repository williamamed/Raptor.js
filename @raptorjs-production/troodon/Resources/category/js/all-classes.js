/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'Category',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel'],    
    stores: ['Generic'],
    controllers: ['Generic']
});

Ext.define('Category.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id','name'],
    
    proxy: {
        type: 'rest',
        listeners:{
            exception:function(s,response){
                var resp=Ext.decode(response.responseText);
                if(resp.cod!==5)
                    Raptor.msg.show(resp.cod,resp.msg);
                
            }
        },
        api:{
            create  : 'category/insert',
            read    : 'category/list',
            update  : 'category/edit',
            destroy : 'category/delete'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('Category.store.Generic', {
    extend: 'Ext.data.Store',
    model: 'Category.model.GenericModel',
    autoLoad:true,
    autoSync:true,
    listeners:{
        write:function(s,op){
            var resp=s.getProxy().getReader().rawData;
            if(resp.cod && resp.cod!==1)
                Raptor.msg.show(resp.cod,resp.msg);
            
            if(resp.cod===1 || resp.cod===5)
                    s.load();
                
            if(resp.cod && resp.co===1)
                Raptor.msg.show(1,Raptor.getTag("category_action"));
            
        }
    }
});
Ext.define('Category.view.GenericList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.genericlist',
    
    store: 'Generic',
    title: Raptor.getTag('category_header'),
    iconCls:'',
   
    initComponent: function() {
        this.columns = [{
            header:Raptor.getTag('category_name'),
            dataIndex: 'name',
            flex: 1
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            
            
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
               
                
                privilegeName:'insert',
                action:'addAction',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                disabled:true,
               
                privilegeName:'edit/:id',
                action:'editAction',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                disabled:true,
                
                privilegeName:'delete/:id',
                action:'deleteAction',
                iconCls:'icon-del'  
            }]
        }];
        
        this.callParent();
    }
});


 Ext.define('Category.view.GenericWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.genericwindow',
        autoShow: true,
        closeAction:'destroy',
        title: Raptor.getTag('category_name'),
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
                            fieldLabel: Raptor.getTag('category_name'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                            
                        }]
        };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: Raptor.getTag('acept'),
                            action: 'save'
                        }, 
                        {
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })



Ext.define('Category.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'genericlist',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});
Ext.define('Category.controller.Generic', {
    extend: 'Ext.app.Controller',
    stores: ['Generic'],
    models: ['GenericModel'],
    refs: [{
            ref: 'genericlist',
            selector: 'genericlist'
        },
        {
            ref: 'buttonAdd',
            selector: 'viewport button[action=addAction]'
        },
        {
            ref: 'buttonEdit',
            selector: 'viewport button[action=editAction]'
        },
        {
            ref: 'buttonDelete',
            selector: 'viewport button[action=deleteAction]'
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
            'viewport button[action=editAction]': {
                click: this.onEditAction
            },
            'viewport button[action=deleteAction]': {
                click: this.onDeleteAction
            },
            'genericlist': {
                beforeselect: this.onListSelect,
                beforedeselect: this.onListDeSelect
            },
            
            'viewport':{
                render:this.onRender
            }
        });
       
    },
    onRender:function(){
        //Make Raptor control the UI to activate the privilege
        Raptor.controlActions();
    },
    
    onListSelect: function() {
       this.getButtonEdit().enable()
       this.getButtonDelete().enable()
    },
    onListDeSelect: function() {
       this.getButtonEdit().disable()
       this.getButtonDelete().disable()
        
    },
   
    onAddAction: function() {
        var view = Ext.widget('genericwindow');
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:Raptor.getTag('category_name')});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDeleteAction: function() {
       Raptor.msg.show(2,Raptor.getTag('msg_delete_gen'), this.deleteAction, this);
    },
    
    addAction:function(button){
        
        var win    = button.up('window'),
        form   = win.down('form'),
        values = form.getValues();
        var record;
       this.getGenericlist().getSelectionModel().deselectAll();
        if(win.action=='edit'){
            record= form.getRecord();
            record.set(values);
        }else{
            record=this.getGenericStore().add(values)[0];
        }
        win.close();
       
    },
    
    deleteAction:function(){
        var record= this.getGenericlist().getSelectionModel().getLastSelected();
        this.getGenericlist().getSelectionModel().deselectAll();
        this.getGenericStore().remove(record);
    }

});