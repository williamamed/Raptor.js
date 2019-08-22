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

