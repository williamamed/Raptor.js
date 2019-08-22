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

