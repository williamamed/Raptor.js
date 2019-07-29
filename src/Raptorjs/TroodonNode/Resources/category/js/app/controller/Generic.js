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