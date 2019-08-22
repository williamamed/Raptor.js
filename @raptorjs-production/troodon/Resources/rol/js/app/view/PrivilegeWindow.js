 Ext.define('GestUser.view.PrivilegeWindow',{
        extend:'Ext.Window',
        width:650,
        autoHeight:true,
        modal:true,
        alias: 'widget.privilegewindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('priv_asigment'),
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            xtype: 'privilegetree'
           };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: Raptor.getTag('acept'),
                            action: 'asignprivilege',
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


