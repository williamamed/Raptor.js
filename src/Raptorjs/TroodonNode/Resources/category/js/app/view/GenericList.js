Ext.define('Category.view.GenericList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.genericlist',
    
    store: 'Generic',
    title: Raptor.getTag('category_header'),
    iconCls:'',
   
    initComponent: function() {
        this.columns = [{
            header:Raptor.getTag('category_name'),
            dataIndex: 'name',
            flex: 1
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            
            
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
               
                
                privilegeName:'insert',
                action:'addAction',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                disabled:true,
               
                privilegeName:'edit/:id',
                action:'editAction',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                disabled:true,
                
                privilegeName:'delete/:id',
                action:'deleteAction',
                iconCls:'icon-del'  
            }]
        }];
        
        this.callParent();
    }
});

