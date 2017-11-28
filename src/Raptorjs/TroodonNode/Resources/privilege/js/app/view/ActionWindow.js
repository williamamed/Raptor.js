 Ext.define('GestPrivilege.view.ActionWindow',{
        extend:'Ext.Window',
        width:800,
        height:500,
        modal:true,
        alias: 'widget.actionwindow',
        autoShow: true,
        closeAction:'destroy',
        title:'',
        layout:'fit',
        initComponent:function(){
            this.items = {
                xtype:'actionlist'
            };
            
       
            
            this.callParent();
           
        } 
 
      
    })


