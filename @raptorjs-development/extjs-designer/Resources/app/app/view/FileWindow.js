 Ext.define('Generate.view.FileWindow',{
        extend:'Ext.Window',
        width:500,
        height:500,
        modal:true,
        alias: 'widget.filewindow',
        autoShow: true,
        closeAction:'destroy',
        closable:false,
        title:"Area de recursos de los Componentes",
        layout:'border',
        items:{
            
            frame: true,
            xtype: 'filetree',
            region:'center',
            bodyStyle: 'padding:5px 5px 5px 5px',
            defaults: {frame: true, anchor: '100%'},
        },
        initComponent:function(){
    
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: 'Aceptar',
                            action: 'openFile',
                            disabled: true
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })


