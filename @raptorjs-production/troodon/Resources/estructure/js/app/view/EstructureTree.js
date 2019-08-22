Ext.define('GestEstructure.view.EstructureTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.estructuretree',
    rootVisible: true,
    store: 'Estructure',
    title: Raptor.getTag('estructures'),
    iconCls:'icon-estructure',
    height:400,
    initComponent: function() {
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
                disabled:true,
                
                privilegeName:'insert',
                action:'add',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                disabled:true,
                
                privilegeName:'edit',
                action:'edit',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                
                privilegeName:'delete',
                disabled:true,
                action:'delete',
                iconCls:'icon-del'  
            }]
        }];
        this.callParent();
    }
});

