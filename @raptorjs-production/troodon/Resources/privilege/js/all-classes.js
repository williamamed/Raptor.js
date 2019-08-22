/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'GestPrivilege',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['PrivilegeModel','PrivilegeRemoteModel','ActionsModel'],    
    stores: ['Privilege','Actions','PrivilegeRemote'],
    controllers: ['Privileges','Actions']
});



Ext.define('GestPrivilege.model.ActionsModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name','belongs','class_name','type','route','description'],
    
    proxy: {
        type: 'ajax',
        url: 'privilege/listaction',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestPrivilege.model.PrivilegeModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'},'belongs','class_name','type','route'],
    
    proxy: {
        type: 'ajax',
        url: 'privilege/list',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestPrivilege.model.PrivilegeRemoteModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name','belongs','class_name','type','route'],
    
    proxy: {
        type: 'ajax',
        url: 'privilege/listroutes',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestPrivilege.store.Actions', {
    extend: 'Ext.data.Store',
    model: 'GestPrivilege.model.ActionsModel'
   
    
});
Ext.define('GestPrivilege.store.Privilege', {
    extend: 'Ext.data.TreeStore',
    model: 'GestPrivilege.model.PrivilegeModel',
    autoLoad: true,
    root: {
        text: Raptor.getTag('priv')+" <i style='color:gray'>(this compose your privileges and menu interface)</i>",
        expandable:false
    }
});
Ext.define('GestPrivilege.store.PrivilegeRemote', {
    extend: 'Ext.data.Store',
    model: 'GestPrivilege.model.PrivilegeRemoteModel'
    
});
 Ext.define('GestPrivilege.view.ActionFormWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.actionformwindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('addaction'),
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
                            fieldLabel: Raptor.getTag('actionname'),
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



Ext.define('GestPrivilege.view.ActionList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.actionlist',
    
    store: 'Actions',
    title: Raptor.getTag('actions'),
    iconCls:'icon-actions',
   
    initComponent: function() {
        this.columns = [{
            header:Raptor.getTag('actionname'),
            dataIndex: 'name',
            flex: 1
        },{
            header:Raptor.getTag('route_path'),
            dataIndex: 'route',
            renderer:function(value){
                return '<b style="color:blue">'+value+'</b>';
            },
            flex: 1
        },{
            header:Raptor.getTag('description'),
            dataIndex: 'description',
            
            flex: 1.5
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
                
                privilegeName:'insertaction',
                action:'insertAction',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                
                privilegeName:'editaction',
                disabled:true,
                action:'editAction',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                
                privilegeName:'deleteaction',
                disabled:true,
                action:'deleteAction',
                iconCls:'icon-del'  
            }]
        }];
        
        this.callParent();
        Raptor.controlActions();
    }
});


 Ext.define('GestPrivilege.view.ActionWindow',{
        extend:'Ext.Window',
        width:800,
        height:500,
        modal:true,
        alias: 'widget.actionwindow',
        autoShow: true,
        closeAction:'destroy',
        title:'',
        layout:'fit',
        initComponent:function(){
            this.items = {
                xtype:'actionlist'
            };
            
       
            
            this.callParent();
           
        } 
 
      
    })



 Ext.define('GestPrivilege.view.DirWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.dirwindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('addcontainer'),
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
                            fieldLabel: Raptor.getTag('containername'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                        },{
                            xtype: 'textfield',
                            fieldLabel: Raptor.getTag('iconclass'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'class_name'
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



 Ext.define('GestPrivilege.view.IndexWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.indexwindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('addindex'),
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
                            fieldLabel: Raptor.getTag('indexname'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                        },{
                            xtype: 'combo',
                            fieldLabel: Raptor.getTag('indexroute'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            hideTrigger :true,
                            store:'PrivilegeRemote',
                            displayField:'route',
                            valueField:'route',
                            name: 'route'
                        },{
                            xtype: 'textfield',
                            fieldLabel: Raptor.getTag('iconclass'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'class_name'
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



Ext.define('GestPrivilege.view.PrivilegeTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.privilegetree',
    rootVisible: true,
    store: 'Privilege',
    title: Raptor.getTag('priv'),
    iconCls:'icon-privilege',
    height:400,
    initComponent: function() {
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('addcontainer'),
                
                privilegeName:'addDir',
                action:'addContainer',
                iconCls:'icon-vendor',
                disabled:true
            },{
                xtype: 'button',
                text: Raptor.getTag('addindex'),
                disabled:true,
                
                privilegeName:'addIndex',
                action:'addIndex',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                disabled:true,
                
                privilegeName:'edit',
                action:'editPrivilege',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                
                privilegeName:'delete',
                disabled:true,
                action:'deletePrivilege',
                iconCls:'icon-del'  
            },{
                xtype: 'button',
                text: Raptor.getTag('actions'),
                
                privilegeName:'listaction',
                disabled:true,
                action:'actionsWindow',
                iconCls:'icon-actions'
            }]
        }];
        this.callParent();
    }
});


Ext.define('GestPrivilege.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'privilegetree',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});
Ext.define('GestPrivilege.controller.Actions', {
    extend: 'Ext.app.Controller',
    stores: ['Actions'],
    models: ['ActionsModel'],
    refs: [
        {
            ref: 'actionList',
            selector: 'actionlist'
        },
        {
            ref: 'buttonAdd',
            selector: 'actionlist button[action=insertAction]'
        },
        {
            ref: 'buttonEdit',
            selector: 'actionlist button[action=editAction]'
        },
        {
            ref: 'buttonDelete',
            selector: 'actionlist button[action=deleteAction]'
        }
    ],
    init: function() {
        this.control({
            'actionlist button[action=insertAction]': {
                click: this.onAdd
            },
           
            'actionlist button[action=editAction]': {
                click: this.onEdit
            },
            'actionlist button[action=deleteAction]': {
                click: this.onDelete
            },
            
            'actionformwindow button[action=save]': {
                click: this.add
            },
            'actionlist': {
                beforeselect: this.onListSelect,
                beforedeselect: this.onListDeSelect
                
            },
            'actionlist':{
                render:this.onRender
            }
        });
      
    },
     onRender:function(cmp){
        
        Raptor.controlActions(cmp);
    },
    onListSelect: function() {
        if(this.getButtonEdit())
        this.getButtonEdit().enable();
         if(this.getButtonDelete())
        this.getButtonDelete().enable();
        
    },
    onListDeSelect: function() {
        if(this.getButtonEdit())
        this.getButtonEdit().disable();
         if(this.getButtonDelete())
        this.getButtonDelete().disable();
        
    },
    onDelete: function() {
       Raptor.msg.show(2,Raptor.getTag('msg_delete_gen'), this.deletePrivilege, this);
    },
    onAdd:function(){
        var view = Ext.widget('actionformwindow');
        
    },
    onEdit:function(){
        var model=this.getActionList().getSelectionModel().getLastSelected();
        var view = Ext.widget('actionformwindow', {action: 'edit',title:Raptor.getTag('editaction')});
         var form=view.down('form');
            form.loadRecord(model);
    },
    add:function(button){
        var win=button.up('window');
        var model2=this.getActionList().getSelectionModel().getLastSelected();
        var model=this.getController('Privileges').getPrivilegetree().getSelectionModel().getLastSelected();
        if(win.action=='edit'){
            this.update(win.down('form'),'privilege/editaction',model2);
        }else{
            this.insert(win.down('form'),'privilege/insertaction',model);
        }
    },
    
    
    insert:function(form,url,model){
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params:{belongs: model.get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getActionList().getSelectionModel().deselectAll();
                this.getActionsStore().load();
                
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
            waitMsg:  Raptor.getTag('waitmsg'),
            params:{id: model.get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getActionList().getSelectionModel().deselectAll();
                this.getActionsStore().load();
                
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
    
    
    deletePrivilege: function() {
        var model=this.getActionList().getSelectionModel().getLastSelected();
        
        Ext.Ajax.request({
            url: 'privilege/deleteaction',
            params:{id: model.get('id')},
            callback: function() {
                this.getActionList().setLoading(false);
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if(obj.code&&obj.code==1){
                    this.getActionList().getSelectionModel().deselectAll();
                    this.getActionsStore().load();
                }
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
       this.getActionList().setLoading(true);
       
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



Ext.define('GestPrivilege.controller.Privileges', {
    extend: 'Ext.app.Controller',
    stores: ['Privilege','Actions'],
    models: ['PrivilegeModel'],
    refs: [
        {
            ref: 'privilegetree',
            selector: 'privilegetree'
        },
        {
            ref: 'buttonAddContainer',
            selector: 'viewport button[action=addContainer]'
        },
        {
            ref: 'buttonActions',
            selector: 'viewport button[action=actionsWindow]'
        },
        {
            ref: 'buttonAddIndex',
            selector: 'viewport button[action=addIndex]'
        },
        {
            ref: 'buttonEditPrivilege',
            selector: 'viewport button[action=editPrivilege]'
        },
        {
            ref: 'buttonDeletePrivilege',
            selector: 'viewport button[action=deletePrivilege]'
        }
        
    ],
    init: function() {
        this.control({
            'viewport button[action=addContainer]': {
                click: this.onAddContainer
            },
            'viewport button[action=addIndex]': {
                click: this.onAddIndex
            },
            'viewport button[action=editPrivilege]': {
                click: this.onEditPrivilege
            },
            'viewport button[action=deletePrivilege]': {
                click: this.onDeletePrivilege
            },
            'viewport button[action=actionsWindow]': {
                click: this.onActionsShow
            },
            'dirwindow button[action=save]': {
                click: this.addDir
            },
            'indexwindow button[action=save]': {
                click: this.addIndex
            },
            
            'privilegetree': {
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
               
                beforeselect: this.onTreeSelect,
                beforedeselect: this.onTreeDeSelect
            },
            'viewport':{
                render:this.onRender
            }
        });
       
    },
     onRender:function(cmp){
        
        Raptor.controlActions();
        
    },
   onActionsShow:function(){
       var view = Ext.widget('actionwindow');
       var model=this.getPrivilegetree().getSelectionModel().getLastSelected();
       this.getActionsStore().getProxy().setExtraParam('belongs',model.get('id'));
       this.getActionsStore().getProxy().setExtraParam('route',model.get('route'));
       this.getActionsStore().load();
      
   },
    activateButtons:function(model){
        if(model.get('id')!='root'){
            if(this.getButtonEditPrivilege())
            this.getButtonEditPrivilege().enable();
            if(this.getButtonDeletePrivilege())
            this.getButtonDeletePrivilege().enable();
        }else{
            if(this.getButtonEditPrivilege())
            this.getButtonEditPrivilege().disable();
             if(this.getButtonDeletePrivilege())
            this.getButtonDeletePrivilege().disable();
        }
        if(model.get('type')!==0){
             if(this.getButtonAddContainer())
            this.getButtonAddContainer().enable();
            if(this.getButtonAddIndex())
            this.getButtonAddIndex().enable();
            
        }else{
            if(this.getButtonAddContainer())
            this.getButtonAddContainer().disable();
         if(this.getButtonAddIndex())
            this.getButtonAddIndex().disable();
         
        }
        if(model.get('type')===0){
            if(this.getButtonActions())
                this.getButtonActions().enable();
        }else{
            if(this.getButtonActions())
                this.getButtonActions().disable();
        }
    },        
    onTreeSelect: function(me,model) {
       
        if(model.get('type')===0){
           this.onTreeDeSelect();
            this.activateButtons(model)
        }else{
            this.activateButtons(model)
            
        }
            
    },
    onTreeDeSelect: function() {
       if(this.getButtonEditPrivilege())
        this.getButtonEditPrivilege().disable();
      if(this.getButtonDeletePrivilege())
        this.getButtonDeletePrivilege().disable();
      if(this.getButtonAddContainer())
        this.getButtonAddContainer().disable();
      if(this.getButtonAddIndex())
        this.getButtonAddIndex().disable();
      if(this.getButtonActions())
        this.getButtonActions().disable();
    },
            
    onAddContainer: function() {
        var view = Ext.widget('dirwindow');
    },
    
    onAddIndex: function() {
        var view = Ext.widget('indexwindow');
    },
    
    onEditPrivilege: function() {
        var model=this.getPrivilegetree().getSelectionModel().getLastSelected();
       
        if(model.get('type')===0){
            var view = Ext.widget('indexwindow', {action: 'edit',title:Raptor.getTag('addindex')});
            var form=view.down('form');
            form.loadRecord(model);
            
        }
        if(model.get('type')===2){
            var view = Ext.widget('dirwindow', {action: 'edit',title:Raptor.getTag('addcontainer')});
            var form=view.down('form');
            form.loadRecord(model);
           
        }
        
    },
    
    onDeletePrivilege: function() {
       Raptor.msg.show(2,Raptor.getTag('msg_delete_gen'), this.deletePrivilege, this);
    },
    
    addIndex:function(button){
        var win=button.up('window');
        var model=this.getPrivilegetree().getSelectionModel().getLastSelected();
        if(win.action=='edit'){
            this.update(win.down('form'),'privilege/edit',model);
        }else{
            this.insert(win.down('form'),'privilege/addIndex',model);
        }
    },
    
    addDir:function(button){
        var win=button.up('window');
        var model=this.getPrivilegetree().getSelectionModel().getLastSelected();
        if(win.action=='edit'){
            this.update(win.down('form'),'privilege/edit',model);
        }else{
            this.insert(win.down('form'),'privilege/addDir',model);
        }
    },
    
    insert:function(form,url,model){
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params:{belongs: model.get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                this.onTreeDeSelect();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getPrivilegeStore().load({
                    node:model,
                    callback:function(){
                                model.expand();
                                this.getPrivilegetree().getSelectionModel().deselectAll();
                                
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
            waitMsg:  Raptor.getTag('waitmsg'),
            params:{id: model.get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                this.onTreeDeSelect();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getPrivilegeStore().load({
                    node:model.parentNode,
                    callback:function(){
                                if(model.parentNode)
                                model.parentNode.expand();
                                this.getPrivilegetree().getSelectionModel().deselectAll();
                               
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
    
    
    deletePrivilege: function() {
        var model=this.getPrivilegetree().getSelectionModel().getLastSelected();
        
        Ext.Ajax.request({
            url: 'privilege/delete',
            params:{id: model.get('id')},
            callback: function() {
                this.getPrivilegetree().setLoading(false);
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if(obj.code&&obj.code==1){
                    this.getPrivilegeStore().load({
                        node:model.parentNode,
                        callback:function(){
                                    if(model.parentNode)
                                        model.parentNode.expand();
                                    this.getPrivilegetree().getSelectionModel().deselectAll();
                                    
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
       this.getPrivilegetree().setLoading(true);
       this.onTreeDeSelect();
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


