Ext.define('Generate.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = [{
                xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'generictree',
                        region:'west'
                    },{
                        xtype: 'genericlist',
                        region:'center'
                    }]
        }];
        
        this.callParent();
    }
});