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
            params:{ nodecomponent: model.get('text'), tables: selected },
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


