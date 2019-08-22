 Ext.define('Auditories.view.GenericSee',{
        extend:'Ext.Window',
        width:600,
        height:400,
        bodyStyle:'overflow:scroll;background:black;color:white;padding:5px;',
        modal:true,
        alias: 'widget.genericsee',
        autoShow: true,
        iconCls:'icon-detalles',
        closeAction:'destroy',
        title: '',
        layout:'fit',
        initComponent:function(){
           
            this.callParent();
           
        } 
 
      
    })


