 Ext.define('GestUser.view.RolWindow',{
        extend:'Ext.Window',
        width:500,
        autoHeight:true,
        modal:true,
        alias: 'widget.rolwindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('rolasigment'),
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            xtype: 'rollist'
           };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: Raptor.getTag('acept'),
                            action: 'changerol',
                            disabled:true
                        }, 
                        {
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })


