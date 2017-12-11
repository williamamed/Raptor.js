Ext.define('GestRol.controller.Roles', {
    extend: 'Ext.app.Controller',
    stores: ['Rol', 'Privilege'],
    models: ['RolModel', 'PrivilegeModel'],
    refs: [{
            ref: 'rollist',
            selector: 'rollist'
        },
        {
            ref: 'buttonAdd',
            selector: 'viewport button[action=addrol]'
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
        Raptor.controlActions();
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
           
        if (this.getButtonAdd())
            this.getButtonAdd().enable();
        if (this.getButtonEdit())
            this.getButtonEdit().enable();
        if (this.getButtonDelete())
            this.getButtonDelete().enable();
        if (this.getButtonPrivilege())
            this.getButtonPrivilege().enable();
        }
    },
    onListDeSelect: function() {
        if (this.getButtonAdd())
            this.getButtonAdd().disable();
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


