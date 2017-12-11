Ext.define('Auditories.controller.Generic', {
    extend: 'Ext.app.Controller',
    stores: ['Generic','Estadistic'],
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
            selector: 'viewport button[action=delete]'
        },{
            ref: 'buttonSee',
            selector: 'viewport button[action=see]'
        }
    ],
    init: function() {
        this.control({
            
            'genericwindow button[action=save]': {
                click: this.search
            },
            'viewport button[action=export]': {
                click: this.onExport
            },
            'viewport button[action=delete]': {
                click: this.onDelete
            },
            'viewport button[action=search]': {
                click: this.onSearch
            },
            'viewport button[action=grafic]': {
                click: this.onGrafic
            },
            'viewport button[action=see]': {
                click: this.onSee
            },
            'genericlist': {
                beforeselect: this.onListSelect,
                deselect: this.onListDeSelect
                
            },
            
            'viewport':{
                render:this.onRender
            }
        });
       
    },
    onRender:function(){
        //Make Raptor control the UI to activate the privilege
        //Raptor.controlActions();
        //console.debug();
        this.getGenericStore().load();
        Raptor.secureTroodon()
        
    },
    onGrafic:function(){
        this.getEstadisticStore().load();
        var view = Ext.widget('chartwindow');
    },
    onExport:function(){
        var start=(this.getGenericStore().currentPage-1)*25;
        var ventana = window.open('auditories/export?data&start='+start+'&limit=25&page='+this.getGenericStore().currentPage,'');
    },
    onSearch:function(){
        var view = Ext.widget('genericwindow');
    },
    onSee:function(){
        var view = Ext.widget('genericsee',{html:'<pre>'+this.getGenericlist().getSelectionModel().getLastSelected().get('log')+'</pre>'});
    },
    search:function(button){
        var win=button.up('window');
        this.getGenericStore().getProxy().extraParams={
            username: win.down('textfield[name=username]').getValue(),
            ip:win.down('textfield[name=ip]').getValue(),
            log:win.down('textfield[name=log]').getValue(),
            from_date:win.down('datefield[name=from_date]').getValue(),
            to_date:win.down('datefield[name=to_date]').getValue()
        }
        this.getGenericStore().loadPage(1);
        win.close();
    },        
    
    onListSelect: function() {
       this.getButtonDelete().setDisabled(false);
       this.getButtonSee().setDisabled(false); 
    },
    onListDeSelect: function() {
       
       if(this.getGenericlist().getSelectionModel().getSelection().length===0) {
           this.getButtonDelete().setDisabled(true);
           this.getButtonSee().setDisabled(true); 
       }
      
    },
   
    onAddAction: function() {
        var view = Ext.widget('genericwindow');
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDelete: function() {
       Raptor.msg.show(2,Raptor.getTag('msgdeletemulti'), this.deleteAction, this);
    },
    
    addAction:function(button){
        var win=button.up('window');
       
        if(win.action=='edit'){
            this.update(win.down('form'),'action/edit');
        }else{
            this.insert(win.down('form'),'action/insert');
        }
    },
    
    insert:function(form,url){
        form.submit({
            url: url,
            waitMsg: 'wait please..',
            params:{},
            success: function(formBasic, action) {
                form.up('window').close();
                
                this.getGenericlist().getSelectionModel().deselectAll();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getGenericlist().getStore().load();
                
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
    update:function(form,url){
        var idaction=this.getGenericlist().getSelectionModel().getLastSelected().get('id');
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params:{idaction: idaction},
            success: function(formBasic, action) {
                form.up('window').close();
                this.getGenericlist().getSelectionModel().deselectAll();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getGenericlist().getStore().load();
                
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
    
    
    deleteAction: function() {
        var model=this.getGenericlist().getSelectionModel().getSelection();
        var count=model.length;
        var listdelete=new Array();
        for (var i=0;i<count;++i){
            listdelete.push(model[i].get('id'))
        }
        
        var wait=Raptor.msg.show(4,'wait please..');
        Ext.Ajax.request({
            url: 'auditories/delete',
            params:{ids: Ext.encode(listdelete)},
            callback: function() {
                wait.close();
                
                this.getGenericlist().getSelectionModel().deselectAll();
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if(obj.code&&obj.code==1){
                    this.getGenericlist().getStore().load();
                }
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
       
      
    }

});


