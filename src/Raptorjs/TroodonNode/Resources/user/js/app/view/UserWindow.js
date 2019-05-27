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


