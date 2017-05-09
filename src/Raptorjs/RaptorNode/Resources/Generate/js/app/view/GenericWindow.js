 Ext.define('Generate.view.GenericWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.genericwindow',
        autoShow: true,
        closeAction:'destroy',
        title:"Create node",
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
                fieldLabel: 'Vendor name',
                itemId: 'vendor',
                allowBlank: false,
                maxLength: 15,
                regex: /^[a-zA-Z0-9]+$/,
                enableKeyEvents: true,
                width: '100%',
                anchor: '100%',
                labelAlign: 'top',
                name: 'vendor'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Node name',
                itemId: 'bundle',
                allowBlank: false,
                maxLength: 30,
                enableKeyEvents: true,
                regex: /^[a-zA-Z0-9]+$/,
                blankText: 'The node need a name',
                width: '100%',
                anchor: '100%',
                labelAlign: 'top',
                name: 'bundle'
            }, {
                xtype: 'label',
                text: '',
                itemId: 'definition',
                margin: '10 10 10 10'
            }]
        };
            
        this.buttons = [{   iconCls: 'icon-acept',
                            text: 'Acept',
                            action: 'save'
                        }, 
                        {
                            iconCls: 'icon-cancel',
                            text: 'Cancel',
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })


