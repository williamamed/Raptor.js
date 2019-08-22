Ext.define('GestUser.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    
    
    initComponent: function() {
        this.items = {
                    xtype:'container',
                layout:'border',
                items:[{
                        xtype: 'estructuretree',
                        region:'west'
                    },{
                        xtype: 'userlist',
                        region:'center'
                    }]
                };
                
        
        this.callParent();
    }
});