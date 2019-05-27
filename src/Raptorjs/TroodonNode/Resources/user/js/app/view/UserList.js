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

