Ext.define('Generate.controller.Generic', {
    extend: 'Ext.app.Controller',
    stores: ['Generic'],
    models: ['GenericModel'],
    refs: [{
            ref: 'generictree',
            selector: 'generictree'
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
        var definitionView = '<b style="color:black">Node definition:&nbsp;&nbsp;<br></b><b style="color:black">\\</b><b style="color:green">' + vendor + '</b><b style="color:black">\\</b><b style="color:black">' + bundle + '</b><b style="color:blue">Node</b>';
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
        var definitionView = '<b style="color:black">Node definition:&nbsp;&nbsp;<br></b><b style="color:black">\\</b><b style="color:green">' + vendor + '</b><b style="color:black">\\</b><b style="color:black">' + bundle + '</b><b style="color:blue">Node</b>';
        view.down('form').query('#definition')[0].setText(definitionView, false);
    },
    
    onEditAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
        var view = Ext.widget('genericwindow', {action: 'edit',title:'Modify'});
            var form=view.down('form');
            form.loadRecord(model);
    },
    
    onDeleteAction: function() {
       Raptor.msg.show(2,'Are you shure', this.deleteAction, this);
    },
    
    addAction:function(button){
        var view = button.up('window');
        var form = view.down('form');
        form.submit({
            url: 'generatenode/create',
            waitMsg: 'wait please..',
            params: { vendor: this.getVendortext().getValue()},
            success: function (formBasic, action) {
                form.up('window').close();

                this.getGenericlist().getSelectionModel().deselectAll();
                //Raptor.msg.show(action.result.cod, action.result.msg);
                this.getGenericlist().getStore().load();

            },
            failure: function (formBasic, action) {
                alert("Error")
                //switch (action.failureType) {
                //    case Ext.form.action.Action.CLIENT_INVALID:
                //        Raptor.msg.show(1, Raptor.getTag('invalidform'));
                //        break;
                //    case Ext.form.action.Action.CONNECT_FAILURE:
                //        Raptor.msg.show(3, 'Ajax communication failed');
                //        break;
                //}

                //if (action.result && action.result.cod) {
                //    Raptor.msg.show(action.result.cod, action.result.msg);
                //}

            },
            scope: this
        });
    },
    
    insert:function(form,url){
        form.submit({
            url: url,
            waitMsg: 'wait please..',
            params:{},
            success: function(formBasic, action) {
                form.up('window').close();
                
                this.getGenericlist().getSelectionModel().deselectAll();
                Raptor.msg.show(action.result.cod, action.result.msg);
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

                if (action.result && action.result.cod) {
                    Raptor.msg.show(action.result.cod, action.result.msg);
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
                Raptor.msg.show(action.result.cod, action.result.msg);
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

                if (action.result && action.result.cod) {
                    Raptor.msg.show(action.result.cod, action.result.msg);
                }
               
            },
            scope: this
        });
    },
    
    
    deleteAction: function() {
        var model=this.getGenericlist().getSelectionModel().getLastSelected();
       
        var wait=Raptor.msg.show(4,'wait please..');
        Ext.Ajax.request({
            url: 'action/delete',
            params:{idaction: model.get('id')},
            callback: function() {
                wait.close();
                
                this.getGenericlist().getSelectionModel().deselectAll();
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.cod, obj.msg);
                if(obj.cod&&obj.cod==1){
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


