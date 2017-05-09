Ext.define('Generate.view.GenericList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.genericlist',
    
    store: 'Generic',
    title: "Generic grid - use Raptor.getTag('title') to integrate with language package ",
    iconCls:'',
   
    initComponent: function() {
        this.columns = [{
            header:"Header",
            dataIndex: 'name',
            flex: 1
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            /*
            use this to auto-adjust privilege in the view
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
                disabled:true,
                hidden:true,
                privilegeName:'insert',
                action:'addAction',
                iconCls:'icon-add'  
            }]*/
        }];
        
        this.callParent();
    }
});

