 Ext.define('Auditories.view.GenericWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.genericwindow',
        autoShow: true,
        iconCls:'icon-search',
        closeAction:'destroy',
        title: Raptor.getTag('searchheader'),
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
                            fieldLabel: Raptor.getTag('username'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'username'
                            
                        },{
                            xtype: 'textfield',
                            fieldLabel:Raptor.getTag('route'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'log'
                            
                        },{
                            xtype: 'textfield',
                            fieldLabel:Raptor.getTag('ip'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'ip'
                            
                        },{
                            xtype: 'datefield',
                            anchor: '100%',
                            fieldLabel: Raptor.getTag('range_from'),
                            labelAlign: 'top',
                            format:'Y-m-d',
                            name: 'from_date'
                        }, {
                            xtype: 'datefield',
                            anchor: '100%',
                            fieldLabel: Raptor.getTag('range_to'),
                            format:'Y-m-d',
                            labelAlign: 'top',
                            name: 'to_date'
                            
                        }]
        };
            
        this.buttons = [{   iconCls: 'icon-search',
                            text: Raptor.getTag('search'),
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


