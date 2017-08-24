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


