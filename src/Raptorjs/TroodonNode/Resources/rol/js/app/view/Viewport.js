Ext.define('GestRol.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    initComponent: function() {
        this.items = {
                    xtype: 'rollist',
                    flex: 1
                };
        
        this.callParent();
    }
});