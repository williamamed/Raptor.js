Ext.define('GestPrivilege.view.ActionList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.actionlist',
    
    store: 'Actions',
    title: Raptor.getTag('actions'),
    iconCls:'icon-actions',
   
    initComponent: function() {
        this.columns = [{
            header:Raptor.getTag('actionname'),
            dataIndex: 'name',
            flex: 1
        },{
            header:Raptor.getTag('route_path'),
            dataIndex: 'route',
            renderer:function(value){
                return '<b style="color:blue">'+value+'</b>';
            },
            flex: 1
        },{
            header:Raptor.getTag('description'),
            dataIndex: 'description',
            
            flex: 1.5
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('add'),
                
                privilegeName:'insertaction',
                action:'insertAction',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                
                privilegeName:'editaction',
                disabled:true,
                action:'editAction',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                
                privilegeName:'deleteaction',
                disabled:true,
                action:'deleteAction',
                iconCls:'icon-del'  
            }]
        }];
        
        this.callParent();
        //Raptor.controlActions();
    }
});

