Ext.define('GestPrivilege.view.PrivilegeTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.privilegetree',
    rootVisible: true,
    store: 'Privilege',
    title: Raptor.getTag('priv'),
    iconCls:'icon-privilege',
    height:400,
    initComponent: function() {
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: Raptor.getTag('addcontainer'),
                
                privilegeName:'addDir',
                action:'addContainer',
                iconCls:'icon-vendor',
                disabled:true
            },{
                xtype: 'button',
                text: Raptor.getTag('addindex'),
                disabled:true,
                
                privilegeName:'addIndex',
                action:'addIndex',
                iconCls:'icon-add'  
            },{
                xtype: 'button',
                text: Raptor.getTag('edit'),
                disabled:true,
                
                privilegeName:'edit',
                action:'editPrivilege',
                iconCls:'icon-edit'  
            },{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                
                privilegeName:'delete',
                disabled:true,
                action:'deletePrivilege',
                iconCls:'icon-del'  
            },{
                xtype: 'button',
                text: Raptor.getTag('actions'),
                
                privilegeName:'listaction',
                disabled:true,
                action:'actionsWindow',
                iconCls:'icon-actions'
            }]
        }];
        this.callParent();
    }
});

