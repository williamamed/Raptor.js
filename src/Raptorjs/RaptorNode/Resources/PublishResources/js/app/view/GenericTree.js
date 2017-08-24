Ext.define('Publish.view.GenericTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.generictree',
    rootVisible: true,
    store: 'GenericTreeStore',
    title: 'Vendors/Nodes',
    iconCls:'',
    width:'30%',
    initComponent: function() {
        
        
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: "Publicar",
                action: 'addAction'
                //iconCls: 'icon-add'
            }, {
                xtype: 'button',
                text: "Limpiar",
                action: 'deleteAction'
                //iconCls: 'icon-add'
            }]
        }];
        this.callParent();
    }
});
