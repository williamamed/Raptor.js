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
            'viewport':{
                render:this.onRender
            }
        });
      
    },
     onRender:function(){
        //Rpt.controlActions();
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


