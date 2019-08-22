 Ext.define('Auditories.view.ChartWindow',{
        extend:'Ext.Window',
        width: 800,
        height: 500,
        modal:true,
        alias: 'widget.chartwindow',
        autoShow: true,
        iconCls:'icon-grafica',
        closeAction:'destroy',
        title: Raptor.getTag('chart'),
        layout:'fit',
        initComponent:function(){
            this.items = [{
                xtype:'autchart'
            }]
            
        this.buttons = [{
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })


