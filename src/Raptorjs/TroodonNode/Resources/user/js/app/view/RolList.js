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

