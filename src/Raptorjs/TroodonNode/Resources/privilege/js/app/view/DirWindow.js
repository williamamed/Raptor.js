 Ext.define('GestPrivilege.view.DirWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.dirwindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('addcontainer'),
        layout:'fit',
        initComponent:function(){
            this.items = {
            labelAlign: 'top',
            frame: true,
            xtype: 'form',
            layout: 'anchor',
            bodyStyle: 'padding:5px 5px 5px 5px',
            defaults: {frame: true, anchor: '100%'},
            items: [{
                            xtype: 'textfield',
                            fieldLabel: Raptor.getTag('containername'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                        },{
                            xtype: 'textfield',
                            fieldLabel: Raptor.getTag('iconclass'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'className'
                        }]
        };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: Raptor.getTag('acept'),
                            action: 'save'
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


