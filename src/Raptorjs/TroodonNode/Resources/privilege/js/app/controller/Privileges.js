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


