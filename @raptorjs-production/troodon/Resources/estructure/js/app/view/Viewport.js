Ext.define('GestEstructure.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'estructuretree',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});