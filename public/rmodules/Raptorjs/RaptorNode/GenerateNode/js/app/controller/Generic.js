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
            
            'genericwindow button[action=save]': {
                click: this.addAction
            },
            'viewport button[action=addAction]': {
                click: this.onAddAction
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
        if (model.get('vendor') === false) {
            this.getButtonAdd().disable();
            this.getButtonDelete().enable();
        }
        if (model.get('vendor') === true) {
            this.getButtonAdd().enable();
            this.getButtonDelete().disable();
        }
        if (model.get('vendor') === '') {
            this.getButtonDelete().disable();
            this.getButtonAdd().enable();
        }
    },
    definition: function () {
        var view = this.getNodetext().up('window');
        var vendor = view.down('form').query('#vendor')[0].getValue();
        var bundle = view.down('form').query('#bundle')[0].getValue();
        this.definition = "\\" + vendor + '\\' + bundle + 'Node';
        var definitionView = '<b style="color:black">Definición:&nbsp;&nbsp;<br></b><b style="color:black">\\</b><b style="color:green">' + vendor + '</b><b style="color:black">\\</b><b style="color:black">' + bundle + '</b><b style="color:blue">Node</b>';
        view.down('form').query('#definition')[0].setText(definitionView, false);
    },
    onAddAction: function() {
        var view = Ext.widget('genericwindow');
        if (this.getGenerictree().getSelectionModel().getLastSelected().get('vendor') == true) {
            this.getVendortext().disable();
            this.getVendortext().setValue(this.getGenerictree().getSelectionModel().getLastSelected().get('text'));
        }
        var vendor = view.down('form').query('#vendor')[0].getValue();
        var bundle = view.down('form').query('#bundle')[0].getValue();
        this.definition = "\\" + vendor + '\\' + bundle + 'Node';
        var definitionView = '<b style="color:black">Definición:&nbsp;&nbsp;<br></b><b style="color:black">\\</b><b style="color:green">' + vendor + '</b><b style="color:black">\\</b><b style="color:black">' + bundle + '</b><b style="color:blue">Node</b>';
        view.down('form').query('#definition')[0].setText(definitionView, false);
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDeleteAction: function() {
       Raptor.msg.show(2,'Está seguro que desea eliminar este componente', this.deleteAction, this);
    },
    
    addAction:function(button){
        var view = button.up('window');
        var form = view.down('form');
        this.getGenericlist().body.setHTML('<b style="color:gray">>> Consola - Raptor.js</b>');
        var selected=this.getGenerictree().getSelectionModel().getLastSelected();
        form.submit({
            url: 'generatenode/create',
            waitMsg: 'espere por favor..',
            params: { vendor: this.getVendortext().getValue()},
            success: function (formBasic, action) {
                form.up('window').close();
                var self=this;
                Raptor.msg.show(action.result.code, action.result.msg);
                if(action.result.code==Raptor.INFO && action.result.params.routine){
                    var log=action.result.params.routine;
                  
                    if(selected.get('vendor')==true){
                        selected.appendChild({
                            "text": action.result.params.name,
                            "expandable": false,
                            "vendor": false,
                            "namespace": action.result.params.name
                          })
                    }else{
                        selected.appendChild({
                            "text": action.result.params.nameVendor,
                            "expanded": true,
                            "children":[{
                                "text": action.result.params.name,
                                "expandable": false,
                                "vendor": false,
                                "namespace": action.result.params.name
                            }],
                            "vendor": true
                          })
                    }
                    var cont=0;
                    var consoleInt=setInterval(function(){
                        if(cont<log.length)
                            self.getGenericlist().body.setHTML(self.getGenericlist().body.getHTML()+'<br>>>&nbsp;'+log[cont]);
                        else
                            clearInterval(consoleInt);
                        cont++;
                    },500)
                    
                }
            },
            failure: function (formBasic, action) {
               
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Raptor.msg.show(3,'Error en los datos del formulario');
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
        var model=this.getGenerictree().getSelectionModel().getLastSelected();
        
        var wait=Raptor.msg.show(4,'espere por favor..');
        Ext.Ajax.request({
            url: 'generatenode/delete',
            params:{ nodecomponent: model.get('text') },
            callback: function() {
                wait.close();
                
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                var parent=model.parentNode;
                if(obj.code==Raptor.INFO)
                    model.remove();
                if(parent && !parent.hasChildNodes()){
                    parent.remove()
                }
                this.getButtonDelete().disable();
            },
            failure: function(response, opts) {
                 Raptor.msg.show(3,'server-side failure with status code ' + response.status);
            },
            scope: this
        });
       
      
    }

});


