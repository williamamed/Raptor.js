/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'GestEstructure',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['EstructureModel','CategoryModel'],    
    stores: ['Estructure','Category'],
    controllers: ['Estructures']
});



Ext.define('GestEstructure.model.CategoryModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name'],
    
    proxy: {
        type: 'ajax',
        url: 'structure/listcategory',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestEstructure.model.EstructureModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'},'belongs','description','idCategory','action'],
    
    proxy: {
        type: 'ajax',
        url: 'structure/list',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestEstructure.store.Category', {
    extend: 'Ext.data.Store',
    model: 'GestEstructure.model.CategoryModel',
    autoLoad: true
});
Ext.define('GestEstructure.store.Estructure', {
    extend: 'Ext.data.TreeStore',
    model: 'GestEstructure.model.EstructureModel',
    autoLoad: true,
    root: {
        text: "Global<i style='color:gray'>(this global not belongs to estructure)</i>",
        expandable:false
    }
});
 Ext.define('GestPrivilege.view.DirWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.dirwindow',
        autoShow: true,
        closeAction:'destroy',
        title:'Add Container',
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
                            fieldLabel: 'Container name',
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                        }]
        };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: 'Acept',
                            action: 'save'
                        }, 
                        {
                            iconCls: 'icon-cancel',
                            text: 'Cancel',
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })



Ext.define('GestEstructure.view.EstructureTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.estructuretree',
    rootVisible: true,
    store: 'Estructure',
    title: Raptor.getTag('estructures'),
    iconCls:'icon-estructure',
    height:400,
    initComponent: function() {
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
                disabled:true,
                
                privilegeName:'insert',
                action:'add',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                disabled:true,
                
                privilegeName:'edit',
                action:'edit',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                
                privilegeName:'delete',
                disabled:true,
                action:'delete',
                iconCls:'icon-del'  
            }]
        }];
        this.callParent();
    }
});


 Ext.define('GestEstructure.view.EstructureWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.estructurewindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('add'),
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
                            fieldLabel: Raptor.getTag('estructurename'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                        },{
                            xtype:'combo',
                            fieldLabel: Raptor.getTag('category_name'),
                            allowBlank: true,
                            maxLength: 40,
                            queryMode:'local',
                            displayField:'name',
                            editable:false,
                            store:'Category',
                            valueField:'id',
                            width: '100%',
                            labelAlign: 'top',
                            name: 'idCategory'
                        },{
                            xtype: 'textarea',
                            fieldLabel: Raptor.getTag('description'),
                            allowBlank: true,
                            maxLength: 500,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'description'
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



Ext.define('GestEstructure.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'estructuretree',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});
Ext.define('GestEstructure.controller.Estructures', {
    extend: 'Ext.app.Controller',
    stores: ['Estructure'],
    models: ['EstructureModel'],
    refs: [
        {
            ref: 'estructuretree',
            selector: 'estructuretree'
        },
        {
            ref: 'buttonAdd',
            selector: 'viewport button[action=add]'
        },
       
        {
            ref: 'buttonEdit',
            selector: 'viewport button[action=edit]'
        },
        {
            ref: 'buttonDelete',
            selector: 'viewport button[action=delete]'
        }
        
    ],
    init: function() {
        this.control({
            'viewport button[action=add]': {
                click: this.onAdd
            },
            
            'viewport button[action=edit]': {
                click: this.onEdit
            },
            'viewport button[action=delete]': {
                click: this.onDelete
            },
            'estructurewindow button[action=save]': {
                click: this.add
            },
            
            
            'estructuretree': {
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                beforeitemexpand:this.onBeforeItemExpand,
                itemexpand:this.onItemExpand,
                beforeselect: this.onTreeSelect,
                beforedeselect: this.onTreeDeSelect
            },
            'viewport':{
                render:this.onRender
            }
        });
       
    },
     onRender:function(){
        Raptor.controlActions();
        
    },
   
    activateButtons:function(model){
        if(model.get('id')!='root'){
             if(this.getButtonAdd())
            this.getButtonAdd().enable();
            if(this.getButtonEdit())
            this.getButtonEdit().enable();
            if(this.getButtonDelete())
            this.getButtonDelete().enable();
        }else{
             if(this.getButtonAdd())
            this.getButtonAdd().enable();
            if(this.getButtonEdit())
            this.getButtonEdit().disable();
             if(this.getButtonDelete())
            this.getButtonDelete().disable();
        }
        
        
    },        
    onTreeSelect: function(me,model) {
       
        if(model.get('indexrender')==true){
           this.onTreeDeSelect();
            this.activateButtons(model)
        }else{
            this.activateButtons(model)
            
        }
            
    },
    onTreeDeSelect: function() {
       if(this.getButtonEdit())
        this.getButtonEdit().disable();
      if(this.getButtonDelete())
        this.getButtonDelete().disable();
      if(this.getButtonAdd())
        this.getButtonAdd().disable();
      
    },
     
    onAdd: function() {
        var view = Ext.widget('estructurewindow');
    },
    
    onEdit: function() {
        var model=this.getEstructuretree().getSelectionModel().getLastSelected();
       
        
       
            var view = Ext.widget('estructurewindow', {action: 'edit',title:Raptor.getTag('edit')});
            var form=view.down('form');
            form.loadRecord(model);
           
       
        
    },
    
    onDelete: function() {
       Raptor.msg.show(2, Raptor.getTag('msg_delete_gen'), this.delete, this);
    },
    
    add:function(button){
        var win=button.up('window');
        var model=this.getEstructuretree().getSelectionModel().getLastSelected();
        if(win.action=='edit'){
            this.update(win.down('form'),'structure/edit',model);
        }else{
            this.insert(win.down('form'),'structure/insert',model);
        }
    },
    
    
    
    insert:function(form,url,model){
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params:{index: model.get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                this.onTreeDeSelect();
                Raptor.msg.show(action.result.code, action.result.msg);
                model.set('leaf',false)
                this.getEstructureStore().load({
                    node:model,
                    callback:function(){
                        model.expand();
                        
                        this.getEstructuretree().getSelectionModel().deselectAll();
                                
                     },
                    scope:this
                });
                
            },
            failure: function(formBasic, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Raptor.msg.show(1, Raptor.getTag('invalidform'));
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
    update:function(form,url,model){
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params:{id: model.get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                this.onTreeDeSelect();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getEstructureStore().load({
                    node:model.parentNode,
                    callback:function(){
                                if(model.parentNode)
                                model.parentNode.expand();
                                this.getEstructuretree().getSelectionModel().deselectAll();
                               
                     },
                    scope:this
                });
                
            },
            failure: function(formBasic, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Raptor.msg.show(1, Raptor.getTag('invalidform'));
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
    
    
    delete: function() {
        var model=this.getEstructuretree().getSelectionModel().getLastSelected();
        var parentNode=model.parentNode;
        Ext.Ajax.request({
            url: 'structure/delete',
            params:{id: model.get('id')},
            callback: function() {
                this.getEstructuretree().setLoading(false);
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if(obj.code&&obj.code==1){
                    this.getEstructureStore().load({
                        node: parentNode,
                        callback:function(){
                            if(parentNode)
                                parentNode.expand();
                            if(!parentNode.hasChildNodes())
                                parentNode.set('leaf',true)
                            this.getEstructuretree().getSelectionModel().deselectAll();
                                    
                         },
                        scope:this
                    });
                }
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
       this.getEstructuretree().setLoading(true);
       this.onTreeDeSelect();
    },
    onBeforeItemExpand:function(node){
//       node.set('iconCls','')
    },
    onItemExpand:function(node){
//       node.set('iconCls','icon-house')
    },
    onBeforeLoad:function(){
        
        
//        this.getPrivilegeStore().getProxy().extraParams={id:this.getPrivilegetree().getSelectionModel().getLastSelected().get('id')};
    },
    onLoad:function(tree,node){
//       node.expand();
//       this.getButtonPrivilegeAsign().enable();
//       if (this.getPrivilegeTree().getChecked().length > 1)
//            node.set('checked', true);
//       else
//            node.set('checked', false);
    
    }


});


