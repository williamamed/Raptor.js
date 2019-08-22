 Ext.define('Generate.view.GenericWindow',{
        extend:'Ext.Window',
        width:500,
        height:500,
        modal:true,
        alias: 'widget.genericwindow',
        autoShow: true,
        closeAction:'destroy',
        
        title:"Editar atributo",
        layout:'fit',
        bodyStyle: 'padding:5px 5px 5px 5px',
        items:{
            xtype: 'textarea',
            
            allowBlank: true,
            width: '100%',
            anchor: '100%',
            height: '100%',
            labelAlign: 'top'
        },
        initComponent:function(){
    
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: 'Salvar',
                            action: 'save'
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })


