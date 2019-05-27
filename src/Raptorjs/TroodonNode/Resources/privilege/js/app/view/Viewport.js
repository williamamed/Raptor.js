Ext.define('GestPrivilege.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'privilegetree',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});