 Ext.define('GestEstructure.view.EstructureWindow',{
        extend:'Ext.Window',
        width:300,
        autoHeight:true,
        modal:true,
        alias: 'widget.estructurewindow',
        autoShow: true,
        closeAction:'destroy',
        title:Raptor.getTag('add'),
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
                            fieldLabel: Raptor.getTag('estructurename'),
                            allowBlank: false,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'name'
                        },{
                            xtype:'combo',
                            fieldLabel: Raptor.getTag('category_name'),
                            allowBlank: true,
                            maxLength: 40,
                            queryMode:'local',
                            displayField:'name',
                            editable:false,
                            store:'Category',
                            valueField:'id',
                            width: '100%',
                            labelAlign: 'top',
                            name: 'idCategory'
                        },{
                            xtype: 'textarea',
                            fieldLabel: Raptor.getTag('description'),
                            allowBlank: true,
                            maxLength: 40,
                            width: '100%',
                            labelAlign: 'top',
                            name: 'description'
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


