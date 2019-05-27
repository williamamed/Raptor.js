Ext.define('Generate.view.GenericTree', {
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
                text: "Generar",
                disabled: true,
                //hidden: true,
                //privilegeName: 'insert',
                action: 'generateAction'
                //iconCls: 'icon-add'
            }]
        }];
        this.callParent();
    }
});
