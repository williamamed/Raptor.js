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


