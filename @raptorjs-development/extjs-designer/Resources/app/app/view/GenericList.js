Ext.define('Generate.view.GenericList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.genericlist',
    title: "Vista previa",
    iconCls:'',
    bodyStyle:'background:gray;padding:20px;',
    html:'<div style="position:absolute;top:50%;width:100%;z-index:1;text-align:center"><img  src="'+Raptor.public('extjs-designer/resources/img/editor.png')+'" height="60"><br><img src="'+Raptor.public('extjs-designer/resources/img/sencha.png')+'" height="40"></div>',
    layout:'fit',
    items:{
        xtype:'panel',
        bodyStyle:'background:transparent;z-index:2',
        itemId:'renderPanel',
        layout:'fit'
    },
    
            
    
    initComponent: function() {
        
        this.callParent();
        
    }
});
