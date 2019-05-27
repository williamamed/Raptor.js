Ext.define('Publish.view.GenericList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.genericlist',
    
    title: "Salida de la rutina de publicación de recursos web",
    iconCls:'',
    bodyStyle:'background:white;padding:20px;overflow-y: scroll',
    html:'<b style="color:gray">>> Consola - Raptor.js</b>',
    initComponent: function() {
        
        this.callParent();
    }
});

