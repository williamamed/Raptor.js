Ext.define('GestUser.controller.Users', {
    extend: 'Ext.app.Controller',
    stores: ['User', 'Rol'],
    models: ['UserModel'],
    refs: [{
            ref: 'userlist',
            selector: 'userlist'
        },
        {
            ref: 'estructuretree',
            selector: 'estructuretree'
        },
        {
            ref: 'passwordContainer',
            selector: '#passContainer'
        },
        {
            ref: 'buttonEdit',
            selector: 'viewport button[action=updateuser]'
        },
        {
            ref: 'buttonAdd',
            selector: 'viewport button[action=adduser]'
        },
        {
            ref: 'buttonDelete',
            selector: 'viewport button[action=deleteuser]'
        },
        {
            ref: 'buttonRol',
            selector: 'viewport button[action=rolasign]'
        },
        {
            ref: 'search',
            selector: 'viewport textfield[action=search]'
        },
        {
            ref: 'rollist',
            selector: 'rollist'
        }
    ],
    init: function () {
        this.control({
            'viewport button[action=adduser]': {
                click: this.onAdd
            },
            'viewport button[action=updateuser]': {
                click: this.onUpdate
            },
            'viewport button[action=deleteuser]': {
                click: this.onDelete
            },
            'viewport button[action=rolasign]': {
                click: this.onRolAsign
            },
            'userwindow checkbox': {
                change: this.onCheckChange
            },
            'userwindow button[action=save]': {
                click: this.updateUser
            },
            'userlist': {
                beforeselect: this.onListSelect,
                beforedeselect: this.onListDeSelect,
                edit: this.onListEdit,
            },
            'estructuretree': {
                select: this.onTreeSelect,
                beforedeselect: this.onTreeBeforeDeSelect,
                load: this.onTreeLoad,
                render: this.onTreeRender
            },
            'viewport': {
                render: this.onRender
            },
            'viewport textfield[action=search]': {
                keyup: this.onSearch
            }
        });


    },
    onAfterLoad: function () {

        for (var i = 0, cant = this.getUserStore().count(); i < cant; i++) {
            if (this.getUserStore().getAt(i).get('icon'))
                var tip = Ext.create('Ext.tip.ToolTip', {
                    target: "id_" + this.getUserStore().getAt(i).get('icon'),
                    html: "<img src='/public/rmodules/securityImages/" + this.getUserStore().getAt(i).get('icon') + "' width='100'>",
                    trackMouse: true,
                    renderTo: Ext.getBody()

                });
        }


    },
    onListEdit: function (editor, e) {

        var model = this.getUserlist().getSelectionModel().getLastSelected();

        Ext.Ajax.request({
            url: 'user/changestate',
            params: {id: model.get('id'), state: e.value},
            callback: function () {
                this.getUserlist().setLoading(false);
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if (obj.code && obj.code == 1) {
                    e.record.commit();
                }
            },
            failure: function (response, opts) {
                Raptor.msg.show(3, 'server-side failure with status code ' + response.status);
            },
            scope: this
        });

        this.getUserlist().setLoading(true);
    },
    onSearch: function (text) {

        if (text.getValue() == '')
            this.getUserlist().getStore().clearFilter();
        else {
            this.getUserlist().getStore().filterBy(function (model) {
                var texto = model.get('username');
                var nombre = model.get('fullname');
                if (texto.indexOf(text.getValue()) >= 0 || nombre.indexOf(text.getValue()) >= 0)
                    return true;
            })
        }

    },
    onTreeBeforeDeSelect: function (me, model) {
        if (this.getUserlist().getStore().isLoading())
            return false;
    },
    onTreeSelect: function (me, model) {
        this.getUserlist().getStore().load();
        this.onListDeSelect();

    },
    onTreeRender: function () {

        this.getEstructuretree().setLoading(Raptor.getTag('loadingestructure'), true);
    },
    onTreeLoad: function () {
        this.getEstructuretree().setLoading(false);
    },
    onRender: function () {
        this.getUserlist().getStore().on('beforeload', this.onBeforeLoadList, this)
        this.getUserlist().getStore().on('load', this.onLoadList, this)
        Raptor.controlActions();

    },
    onLoadList: function () {
        var model = this.getEstructuretree().getSelectionModel().getLastSelected();
        if (model) {
            if (this.getButtonAdd())
                this.getButtonAdd().enable();
            this.getSearch().enable();
        }
        this.onAfterLoad();

    },
    onBeforeLoadList: function () {
        var model = this.getEstructuretree().getSelectionModel().getLastSelected();
        if (!model)
            return false;
        this.getUserlist().getStore().getProxy().extraParams = {idEstructure: model.get('id')};
        if (this.getButtonAdd())
            this.getButtonAdd().disable();
        this.onListDeSelect();

    },
    onAdd: function () {
        var view = Ext.widget('userwindow', {action: 'add'});
        view.down('checkbox').hide();

    },
    onUpdate: function () {
        var view = Ext.widget('userwindow', {action: 'edit', title: Raptor.getTag('edituser')});
        view.down('checkbox').setValue(false);
        view.down('form').loadRecord(this.getUserlist().getSelectionModel().getLastSelected());
        view.down('#password').setValue("0");
        view.down('#repassword').setValue("0");
    },
    onRolAsign: function () {
        var view = Ext.widget('rolwindow', {action: 'edit'});
        this.getRolStore().on('load', this.onLoadRol, this);
        this.getRolStore().load();
    },
    onLoadRol: function (store) {
        var roles = this.getUserlist().getSelectionModel().getLastSelected().get('security_rols');
        for (var i = 0; i < roles.length; i++) {
            var index = store.findExact('id', roles[i].id);
            console.debug(roles,index,roles[i].id)
            if (index > -1) {
                this.getRollist().getSelectionModel().select(index, true, true);
            }
        }
    },
    onCheckChange: function (box, newValue, oldValue, eOpts) {
        if (newValue === false) {
            this.getPasswordContainer().hide();
            this.getPasswordContainer().down('#password').setValue("0");
            this.getPasswordContainer().down('#repassword').setValue("0");
        } else {
            this.getPasswordContainer().show();
            this.getPasswordContainer().down('#password').reset();
            this.getPasswordContainer().down('#repassword').reset();
        }
    },
    updateUser: function (button) {
        var win = button.up('window');
        if (win.action == 'edit') {

            var form = win.down('form'),
                    record = form.getRecord();


            if (form.down('checkbox').getValue() && form.down('#password').getValue() != form.down('#repassword').getValue()) {
                Raptor.msg.show(1, Raptor.getTag('passdontmatch'));
            } else {
                this.editUser(form, 'user/edit', record.get('id'));
            }

        }

        if (win.action == 'add') {

            var form = win.down('form');

            if (form.down('#password').getValue() != form.down('#repassword').getValue()) {
                Raptor.msg.show(1, Raptor.getTag('passdontmatch'));
            } else {
                this.insertUser(form, 'user/insert');
            }

        }

    },
    onDelete: function () {
        Raptor.msg.show(2, Raptor.getTag('msgdelete'), this.deleteUser, this);
    },
    deleteUser: function () {
        var model = this.getUserlist().getSelectionModel().getLastSelected();

        Ext.Ajax.request({
            url: 'user/delete',
            params: {id: model.get('id')},
            callback: function () {
                this.getUserlist().setLoading(false);
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if (obj.code && obj.code == 1) {
                    this.getUserStore().load();
                }
            },
            failure: function (response, opts) {
                Raptor.msg.show(3, 'server-side failure with status code ' + response.status);
            },
            scope: this
        });
        this.getUserlist().getSelectionModel().deselectAll();
        this.getUserlist().setLoading(true);
    },
    onListSelect: function () {
        if (this.getButtonEdit())
            this.getButtonEdit().enable();
        if (this.getButtonDelete())
            this.getButtonDelete().enable();
        if (this.getButtonRol())
            this.getButtonRol().enable();
        this.getSearch().enable();

    },
    onListDeSelect: function () {
        if (this.getButtonEdit())
            this.getButtonEdit().disable();
        if (this.getButtonDelete())
            this.getButtonDelete().disable();
        if (this.getButtonRol())
            this.getButtonRol().disable();
        this.getSearch().disable();
    },
    insertUser: function (form, url) {
        var id = this.getEstructuretree().getSelectionModel().getLastSelected();
        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params: {ajax_request: true, idEstructure: id.get('id')},
            success: function (formBasic, action) {
                form.up('window').close();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getUserStore().load();
            },
            failure: function (formBasic, action) {
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
    editUser: function (form, url, id) {

        form.submit({
            url: url,
            waitMsg: Raptor.getTag('waitmsg'),
            params: {ajax_request: true, id: id},
            success: function (formBasic, action) {
                form.up('window').close();
                Raptor.msg.show(action.result.code, action.result.msg);
                this.getUserlist().getSelectionModel().deselectAll();
                this.getUserStore().load();
            },
            failure: function (formBasic, action) {
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

    }


});


