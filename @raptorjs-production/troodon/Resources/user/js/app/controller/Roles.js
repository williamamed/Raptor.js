Ext.define('GestUser.controller.Roles', {
    extend: 'Ext.app.Controller',
    stores: ['Rol'],
    models: ['RolModel'],
    refs: [{
            ref: 'rollist',
            selector: 'rollist'
        },
        {
            ref: 'userlist',
            selector: 'userlist'
        },
        {
            ref: 'buttonRol',
            selector: 'rolwindow button[action=changerol]'
        }
    ],
    init: function () {
        this.control({
            'rolwindow button[action=changerol]': {
                click: this.asignRol
            },
            'rollist': {
                beforeselect: this.onListSelect,
                beforedeselect: this.onListDeSelect
            }
        });
    },
    asignRol: function () {
        var model = this.getRollist().getSelectionModel().getSelection();
        var modeluser = this.getUserlist().getSelectionModel().getLastSelected();
        var roles = [];
        for (var i = 0; i < model.length; i++) {
            roles[i]=model[i].get('id');
        }
        Ext.Ajax.request({
            url: 'user/asignrol',
            params: {id: {roles:roles}, iduser: modeluser.get('id')},
            callback: function () {
                if (this.getRollist())
                    this.getRollist().up('window').setLoading(false);
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                Raptor.msg.show(obj.code, obj.msg);
                if (obj.code && obj.code == 1) {
                    this.getRollist().up('window').close();
                    this.getUserlist().getStore().load();
                }
            },
            failure: function (response, opts) {
                Raptor.msg.show(3, 'server-side failure with status code ' + response.status);
            },
            scope: this
        });
        this.getRollist().up('window').setLoading(true);
        this.getUserlist().getSelectionModel().deselectAll();
    },
    onListSelect: function () {

        this.getButtonRol().enable();
    },
    onListDeSelect: function () {

        this.getButtonRol().enable();
    }



});


