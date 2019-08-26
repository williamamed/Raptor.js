/*
 * Created With Raptor
 * Copyrigth 2013
 */


Ext.application({
    name: 'GestUser',
    paths:{
        'GestUser': '/public/@raptorjs/troodon/user/js/app'
    },
    requires: ['Ext.container.Viewport'],
    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    launch:function(){
        
    },
    models: ['UserModel','RolModel','EstructureModel'],    
    stores: ['User','Rol','Estructure','State'],
    controllers: ['Users','Roles']
});




Ext.define('GestUser.model.EstructureModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'},'index','description','dir','action'],
    
    proxy: {
        type: 'ajax',
        url: 'user/listestructure',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
Ext.define('GestUser.model.RolModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name'],
    
    proxy: {
        type: 'ajax',
         api: {
            read: 'user/listrol'
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
Ext.define('GestUser.model.UserModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'fullname', 'username','icon','security_rols', 'rolname', 'password', 'state', 'email'],
    proxy: {
        type: 'ajax',
        url:'user/list',
        actionMethods: {//Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success',
            totalProperty: 'result'
        }
    }
});
Ext.define('GestUser.store.Estructure', {
    extend: 'Ext.data.TreeStore',
    model: 'GestUser.model.EstructureModel',
    autoLoad: true,
    root: {
        text: "Global",
        expandable:false
    }
});
Ext.define('GestUser.store.Rol', {
    extend: 'Ext.data.Store',
    model: 'GestUser.model.RolModel'
    
});
Ext.define('GestUser.store.State', {
    extend: 'Ext.data.Store',
    fields: ['name', 'value'],
    data : [
        {"value":true, "name":"Active"},
        {"value":false, "name":"Inactive"}
       
     
    ]
});


Ext.define('GestUser.store.User', {
    extend: 'Ext.data.Store',
    model: 'GestUser.model.UserModel'
});
Ext.define('GestUser.view.EstructureTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.estructuretree',
    rootVisible: false,
    store: 'Estructure',
    width:'30%',
    title: Raptor.getTag('estructures'),
    iconCls:'icon-estructure',
    height:400,
    collapsible:true,
    initComponent: function() {
        
        this.callParent();
    }
});


Ext.define('GestUser.view.RolList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rollist',
    store: 'Rol',
    title: 'Roles',
    iconCls: 'icon-user',
    selType: 'checkboxmodel',
    height: 400,
    initComponent: function () {
        this.columns = [{
                header: Raptor.getTag('rolname'),
                dataIndex: 'name',
                flex: 1
            }];

        this.callParent();
    }
});


 Ext.define('GestUser.view.RolWindow',{
        extend:'Ext.Window',
        width:500,
        autoHeight:true,
        modal:true,
        alias: 'widget.rolwindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('rolasigment'),
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            xtype: 'rollist'
           };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: Raptor.getTag('acept'),
                            action: 'changerol',
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



Ext.define('GestUser.view.UserList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.userlist',
    store: 'User',
    title: Raptor.getTag('usermanager'),
    iconCls: 'icon-user',
    initComponent: function() {
        this.columns = [{
                header: Raptor.getTag('fullname'),
                dataIndex: 'fullname',
                flex: 2
            }, {
                header: Raptor.getTag('username'),
                dataIndex: 'username',
                flex: 1
            }, {
                header: 'Nick',
                dataIndex: 'icon',
                renderer: function(value, meta, model, row, col, store, view) {
                    if (value) {

                        return "<img id='id_" + value + "' src='/public/rmodules/securityImages/" + value + "' width='20' height='20'>";
                    } else
                        return "<b style='color:black'>-</b>";
                },
                flex: 1
            }, {
                header: Raptor.getTag('email'),
                dataIndex: 'email',
                renderer: function(value) {
                    if (!value)
                        return "<b style='color:gray;text-align:center'>-</b>";
                    else
                        return "<b style='color:black'>" + value + "</b>";
                },
                flex: 1
            }, {
                header: Raptor.getTag('rolname'),
                dataIndex: 'security_rols',
                renderer: function(value) {
                    if (!value || value.length===0) {
                        return "<b style='color:gray'>No Rol</b>";
                    }
                    else {
                        if (value.length > 1) {
                            texto = '';
                            for(var i = 0; i < value.length; i++){
                                texto+=value[i].name+'<br>';
                            }
                            return "<b style='color:#3d4ffb' data-qtip='<b>Roles:</b><br />"+texto+"'>" + value[0].name + "...</b>";
                        }else{
                            return "<b style='color:#3d4ffb'>" + value[0].name + "</b>";
                        }
                    }
                },
                flex: 1
            }, {
                header: Raptor.getTag('state'),
                dataIndex: 'state',
                renderer: function(value) {
                    if (value == true)
                        return "<b style='color:green'>" + Raptor.getTag('activestate') + "</b>";
                    else
                        return "<b style='color:red'>" + Raptor.getTag('inactivestate') + "</b>";
                },
                editor: {
                    xtype: 'combo',
                    allowBlank: false,
                    store: 'State',
                    editable: false,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value'
                },
                flex: 1
            }];

        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        ];

        this.dockedItems = [{
                dock: 'top',
                xtype: 'toolbar',
                items: [{
                        xtype: 'button',
                        text: Raptor.getTag('add'),
                        privilegeName: 'insert',
                        action: 'adduser',
                        disabled: true,
                        iconCls: 'icon-add'
                    }, {
                        xtype: 'button',
                        text: Raptor.getTag('edit'),
                        privilegeName: 'edit',
                        disabled: true,
                        action: 'updateuser',
                        iconCls: 'icon-edit'
                    }, {
                        xtype: 'button',
                        text: Raptor.getTag('delete'),
                        privilegeName: 'delete',
                        disabled: true,
                        action: 'deleteuser',
                        iconCls: 'icon-del'
                    }, {
                        xtype: 'button',
                        text: Raptor.getTag('rolasigment'),
                        privilegeName: 'asignrol',
                        disabled: true,
                        action: 'rolasign',
                        iconCls: 'icon-user'
                    },
                    {xtype: 'tbseparator'},
                     '->',
                    {
                        fieldLabel: Raptor.getTag('search'),
                        xtype: 'textfield',
                        margin: '0 0 0 5',
                        maxLength: 40,
                        enableKeyEvents: true,
                        disabled: true,
                        width: 300,
                        inputCls:'troodon-user-input',
                        action: 'search',
                        name: 'search'
                    }]
            }];
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true
        });
        this.callParent();
    }
});


Ext.define('GestUser.view.UserWindow', {
    extend: 'Ext.Window',
    width: 500,
    autoHeight: true,
    modal: true,
    alias: 'widget.userwindow',
    autoShow: true,
    closeAction: 'destroy',
    title: Raptor.getTag('insertuser'),
    layout: 'fit',
    initComponent: function() {
        this.items = {
            labelAlign: 'top',
            frame: true,
            xtype: 'form',
            layout: 'anchor',
            bodyStyle: 'padding:5px 5px 5px 5px',
            defaults: {frame: true, anchor: '100%'},
            items: [{
                    xtype: 'panel',
                    items: [{
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {margin: 5},
                            items: [{
                                    xtype: 'textfield',
                                    fieldLabel: Raptor.getTag('fullname'),
                                    allowBlank: false,
                                    maxLength: 40,
                                    width: '100%',
                                    labelAlign: 'top',
                                    name: 'fullname'
                                }]
                        }, {
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {margin: 5},
                            items: [{
                                    xtype: 'textfield',
                                    fieldLabel: Raptor.getTag('username'),
                                    allowBlank: false,
                                    maxLength: 40,
                                    width: '50%',
                                    labelAlign: 'top',
                                    name: 'username'
                                }, {
                                    xtype: 'filefield',
                                    fieldLabel: Raptor.getTag('usernick'),
                                    buttonConfig: {
                                        iconCls: 'icon-image',
                                        text: ''
                                    },
                                    maxLength: 40,
                                    width: '50%',
                                    labelAlign: 'top',
                                    name: 'icon'
                                }]
                        }, {
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {margin: 5},
                            items: [{
                                    xtype: 'textfield',
                                    fieldLabel: Raptor.getTag('email'),
                                    allowBlank: true,
                                    regex: /^[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}$/,
                                    width: '50%',
                                    labelAlign: 'top',
                                    name: 'email'
                                }]
                        }, {
                            xtype: 'checkbox',
                            fieldLabel: Raptor.getTag('changepass'),
                            name: 'changePass',
                            labelAlign: 'top',
                            checked: true
                        }, {
                            xtype: 'container',
                            layout: 'hbox',
                            itemId: 'passContainer',
                            defaults: {margin: 5},
                            items: [{
                                    xtype: 'textfield',
                                    fieldLabel: Raptor.getTag('newpass'),
                                    inputType: 'password',
                                    allowBlank: false,
                                    maxLength: 40,
                                    itemId: 'password',
                                    width: '50%',
                                    labelAlign: 'top',
                                    name: 'password'
                                }, {
                                    xtype: 'textfield',
                                    fieldLabel: Raptor.getTag('repass'),
                                    allowBlank: false,
                                    itemId: 'repassword',
                                    inputType: 'password',
                                    maxLength: 40,
                                    width: '50%',
                                    labelAlign: 'top',
                                    name: 'repassword'
                                }]
                        }]
                }]
        };

        this.buttons = [{iconCls: 'icon-acept',
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



Ext.define('GestUser.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = {
                    xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'estructuretree',
                        region:'west'
                    },{
                        xtype: 'userlist',
                        region:'center'
                    }]
                };
                
        
        this.callParent();
    }
});
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
            //console.debug(roles,index,roles[i].id)
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
            url: url+"?_csrf="+Raptor.getCsrfToken(),
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
            url: url+"?_csrf="+Raptor.getCsrfToken(),
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


