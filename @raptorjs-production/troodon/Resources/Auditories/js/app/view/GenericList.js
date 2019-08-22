Ext.define('Auditories.view.GenericList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.genericlist',
    selType:'checkboxmodel',
    store: 'Generic',
    title: Raptor.getTag('aud_header'),
    iconCls:'',
   
    initComponent: function() {
        this.columns = [{
            header:Raptor.getTag('username'),
            dataIndex: 'username',
            flex: 1
        },{
            header:Raptor.getTag('state'),
            dataIndex: 'state',
            renderer:function(val,meta){
                meta.style='font: bold 11 Lucida Grande, Tahoma, sans-serif;';
                switch (val){
                    case 1:
                        meta.style+='color:#B30606';
                        return 'EMERGENCY';
                    case 2:
                        meta.style+='color:#D4A007';
                        return 'ALERT';
                    case 3:
                        meta.style+='color:#B30606';
                        return 'CRITICAL';
                    case 4:
                        meta.style+='color:#B30606';
                        return 'ERROR';
                    case 5:
                        meta.style+='color:#D4A007';
                        return 'WARN';
                    case 6:
                        meta.style+='color:#12048F';
                        return 'NOTICE';
                    case 7:
                        meta.style+='color:#069407';
                        return 'INFO';
                    case 8:
                        meta.style='color:#D4A007';
                        return 'DEBUG';
                }
            },
            flex: 1
        },{
            header:Raptor.getTag('route'),
            dataIndex: 'log',
            
            flex: 4
        },{
            header:Raptor.getTag('ip'),
            dataIndex: 'ip',
            flex: 1
        },{
            header:Raptor.getTag('date'),
            dataIndex: 'a_date',
            renderer:function(value){
                return Ext.Date.parse(value.replace('Z',''),'c')
            },
            flex: 1
        }];
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            
            
            items: [{
                xtype: 'button',
                text: Raptor.getTag('delete'),
                disabled:true,
                
                privilegeName:'delete',
                action:'delete',
                iconCls:'icon-del'  
            },{
                xtype: 'button',
                text: Raptor.getTag('export'),
                disabled:false,
                
                privilegeName:'export',
                action:'export',
                iconCls:'icon-export'  
            },{
                xtype: 'button',
                text: Raptor.getTag('chart'),
                action:'grafic',
                iconCls:'icon-grafica'  
            },{
                xtype: 'button',
                text: Raptor.getTag('search'),
                disabled:false,
                
                //privilegeName:'search',
                action:'search',
                iconCls:'icon-search'  
            },{
                xtype: 'button',
                text: Raptor.getTag('details'),
                disabled:true,
                
                //privilegeName:'search',
                action:'see',
                iconCls:'icon-detalles'  
            }]
        }];
        this.bbar=Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true
            
            
        });
        this.callParent();
    }
});

