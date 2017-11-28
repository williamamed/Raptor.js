Ext.define('GestRol.model.PrivilegeModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'}],
    
    proxy: {
        type: 'ajax',
        url: 'rol/listprivileges',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestRol.model.RolModel', {
    extend: 'Ext.data.Model',
    
    fields: ['id', 'name',{name:'text',mapping:'name'},'belongs'],
    proxy: {
        type: 'ajax',
         api: {
            read: 'rol/list'
        },
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'users',
            successProperty: 'success'
        }
    }
});
Ext.define('GestRol.store.Privilege', {
    extend: 'Ext.data.TreeStore',
    model: 'GestRol.model.PrivilegeModel',
    root: {
        text: Raptor.getTag('priv'),
        expandable:false
    }
});
Ext.define('GestRol.store.Rol', {
    
    extend: 'Ext.data.TreeStore',
    model: 'GestRol.model.RolModel',
    autoLoad: true,
    root: {
        text: "Global<i style='color:gray'>(this global not belongs to roles)</i>",
        expandable:false
    }
});
Ext.define('GestRol.view.PrivilegeTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.privilegetree',
    rootVisible: true,
    store: 'Privilege',
    title: Raptor.getTag('priv'),
    iconCls:'icon-privilege',
    height:400,
    initComponent: function() {
        this.callParent();
    }
});


 Ext.define('GestUser.view.PrivilegeWindow',{
        extend:'Ext.Window',
        width:650,
        autoHeight:true,
        modal:true,
        alias: 'widget.privilegewindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('priv_asigment'),
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            xtype: 'privilegetree'
           };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: Raptor.getTag('acept'),
                            action: 'asignprivilege',
                            disabled:true
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



Ext.define('GestRol.view.RolList', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.rollist',
    rootVisible: true,
    store: 'Rol',
    title: Raptor.getTag('rolmanager'),
    iconCls:'icon-user',
    height:400,
    initComponent: function() {
        
        
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
                privilegeName:'insert',
                action:'addrol',
                iconCls:'icon-add'
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                privilegeName:'edit',
                disabled:true,
                action:'updaterol',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                privilegeName:'delete',
                disabled:true,
                action:'deleterol',
                iconCls:'icon-del'  
            },{
                xtype: 'button',
                text: Raptor.getTag('priv'),
                privilegeName:'asignprivilege',
                disabled:true,
                action:'privilegeasign',
                iconCls:'icon-privilege'  
            }]
        }];
        
        this.callParent();
    }
});


 Ext.define('GestRol.view.UserWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.rolwindow',
        autoShow: true,
        closeAction:'destroy',
        title: Raptor.getTag('insert_rol'),
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
                            fieldLabel: Raptor.getTag('rolname'),
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



Ext.define('GestRol.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    initComponent: function() {
        this.items = {
                    xtype: 'rollist',
                    flex: 1
                };
        
        this.callParent();
    }
});
Ext.define('GestRol.controller.Roles', {
    extend: 'Ext.app.Controller',
    stores: ['Rol', 'Privilege'],
    models: ['RolModel', 'PrivilegeModel'],
    refs: [{
            ref: 'rollist',
            selector: 'rollist'
        },
        {
            ref: 'buttonEdit',
            selector: 'viewport button[action=updaterol]'
        },
        
        {
            ref: 'buttonDelete',
            selector: 'viewport button[action=deleterol]'
        },
        {
            ref: 'buttonPrivilege',
            selector: 'viewport button[action=privilegeasign]'
        },
        {
            ref: 'buttonPrivilegeAsign',
            selector: 'privilegewindow button[action=asignprivilege]'
        },
        {
            ref: 'PrivilegeTree',
            selector: 'privilegetree'
        }
    ],
    init: function() {
        this.control({
            'viewport button[action=addrol]': {
                click: this.onAdd
            },
            'viewport button[action=updaterol]': {
                click: this.onUpdate
            },
            'viewport button[action=deleterol]': {
                click: this.onDelete
            },
            'viewport button[action=move]': {
                click: this.onMove
            },
            'viewport button[action=privilegeasign]': {
                click: this.onPrivilegeAsign
            },
            'rolwindow button[action=save]': {
                click: this.updateRol
            },
            'privilegewindow button[action=asignprivilege]': {
                click: this.asigPrivilege
            },
            'privilegetree': {
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                check: this.onCheckTree,
                checkchange: this.onCheckChangeTree
            },
            'rollist': {
                beforeselect: this.onListSelect,
                beforedeselect: this.onListDeSelect
            },
            'viewport': {
                render: this.onRender
            }
        });

    },
         
    onRender: function() {
       // Raptor.controlActions();
    },
    onAdd: function() {
        var view = Ext.widget('rolwindow', {action: 'add'});
    },
    onUpdate: function() {
        var view = Ext.widget('rolwindow', {action: 'edit', title: Raptor.getTag('edit_rol')});
        view.down('form').loadRecord(this.getRollist().getSelectionModel().getLastSelected());

    },
    onPrivilegeAsign: function() {
        var view = Ext.widget('privilegewindow');
        var tree = view.down('privilegetree');
        this.getPrivilegeStore().getRootNode().removeAll();
        this.getPrivilegeStore().getRootNode().collapse(false, function() {

            this.getPrivilegeStore().getRootNode().set('checked', false);
            this.getPrivilegeStore().load({
                scope: this,
                callback: function(records, operation, success) {
                    
                }
            });
        }, this);




    },
    updateRol: function(button) {
        var win = button.up('window');
        if (win.action == 'edit') {

            var form = win.down('form'),
                    record = form.getRecord();
            this.editRol(form, 'rol/edit', record.get('id'));


        }

        if (win.action == 'add') {

            var form = win.down('form');

            this.insertRol(form, 'rol/insert');


        }

    },
    onDelete: function() {
        Raptor.msg.show(2, Raptor.getTag('msg_delete_rol'), this.deleteRol, this);
    },
    deleteRol: function() {
        var model = this.getRollist().getSelectionModel().getLastSelected();

        Ext.Ajax.request({
            url: 'rol/delete',
            params: {id: model.get('id')},
            callback: function() {
                this.getRollist().setLoading(false);

            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if (obj.code && obj.code == 1) {
                    this.getRolStore().load({
                        node: this.getRollist().getSelectionModel().getLastSelected().parentNode,
                        scope: this
                    });
                }
            },
            failure: function(response, opts) {
                Raptor.msg.show(3, 'server-side failure with status code ' + response.status);
            },
            scope: this
        });
        this.getRollist().getSelectionModel().deselectAll();
        this.getRollist().setLoading(true);
    },
    asigPrivilege: function() {
        var model = this.getRollist().getSelectionModel().getLastSelected();
        if (this.getButtonPrivilegeAsign())
            this.getButtonPrivilegeAsign().disable();
        var array = this.getPrivilegeTree().getChecked();
        var cant = array.length;
        var checked = new Array();
        for (var i = 0; i < cant; i++) {
            if (array[i].get('id') !== 'root')
                checked.push(array[i].get('id'));
        }
        Ext.Ajax.request({
            url: 'rol/asignprivilege',
            params: {id: model.get('id'), privileges: Ext.encode(checked)},
            callback: function() {
                if (this.getPrivilegeTree()) {
                    this.getPrivilegeTree().up('window').setLoading(false);
                    if (this.getButtonPrivilegeAsign())
                        this.getButtonPrivilegeAsign().enable();
                }
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if (obj.code && obj.code == 1) {
                    this.getPrivilegeTree().up('window').close();
                }
            },
            failure: function(response, opts) {
                Raptor.msg.show(3, 'server-side failure with status code ' + response.status);
            },
            scope: this
        });

        this.getPrivilegeTree().up('window').setLoading(true);
    },
    onListSelect: function(me,model) {
        
        if(model.get('id')!=='root'){
           
        
        if (this.getButtonEdit())
            this.getButtonEdit().enable();
        if (this.getButtonDelete())
            this.getButtonDelete().enable();
        if (this.getButtonPrivilege())
            this.getButtonPrivilege().enable();
        }
    },
    onListDeSelect: function() {
        
        if (this.getButtonEdit())
            this.getButtonEdit().disable();
        if (this.getButtonDelete())
            this.getButtonDelete().disable();
        if (this.getButtonPrivilege())
            this.getButtonPrivilege().disable();
    },
    insertRol: function(form, url) {
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params: {ajax_request: true, belongs: this.getRollist().getSelectionModel().getLastSelected().get('id')},
            success: function(formBasic, action) {
                form.up('window').close();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getRolStore().load({
                    node: this.getRollist().getSelectionModel().getLastSelected(),
                    scope: this
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
    editRol: function(form, url, id) {

        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params: {ajax_request: true, id: id},
            success: function(formBasic, action) {
                form.up('window').close();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getRollist().getSelectionModel().deselectAll();
                this.getRolStore().load({
                    node: this.getRollist().getSelectionModel().getLastSelected().parentNode,
                    scope: this
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
    onBeforeLoad: function(tree, node) {

        this.getPrivilegeStore().getProxy().extraParams = {id: this.getRollist().getSelectionModel().getLastSelected().get('id')};
    },
    onLoad: function(tree, node) {
        node.expand();
        if (this.getButtonPrivilegeAsign())
            this.getButtonPrivilegeAsign().enable();
        if (this.getPrivilegeTree().getChecked().length > 1)
            node.set('checked', true);
        else
            node.set('checked', false);

    },
    onCheckTree: function(n, state) {
        if (!n)
            return false;
        if (state == true && n.parentNode) {
            n.parentNode.set('checked', true);
            this.getPrivilegeTree().fireEvent('check', n.parentNode, true);
        }

        if (state == false) {

            var st = false;
            n.eachChild(function(a) {
                if (a.get('checked'))
                    st = true;
            })
            n.set('checked', st);
            if (n.parentNode) {
                n.parentNode.set('checked', st);
                this.getPrivilegeTree().fireEvent('check', n.parentNode, st);
            }
        }
    },
    onCheckChangeTree: function(node, state) {
        if (state == true && node.parentNode) {
            node.parentNode.set('checked', true);
            this.getPrivilegeTree().fireEvent('check', node.parentNode, state);
        } else
            this.getPrivilegeTree().fireEvent('check', node.parentNode, state);

        var me = this.getPrivilegeTree();
        if (!node.isLeaf()) {
            node.eachChild(function(a, b, c) {
                a.set('checked', state)
                me.fireEvent('checkchange', a, state);

            })

        }
    }


});


/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'GestRol',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['RolModel','PrivilegeModel'],    
    stores: ['Rol','Privilege'],
    controllers: ['Roles']
});


