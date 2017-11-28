 Ext.define('Auditories.view.AutChart',{
        extend:'Ext.chart.Chart',
        alias: 'widget.autchart',
         background: {
                fill: 'rgb(255, 255, 255)'
            },
        animate: true,
            shadow: true,
            store: 'Estadistic',
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['percent'],
                title: Raptor.getTag('trace_percent'),
                grid: true,
                minimum: 0,
                maximum:100
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: Raptor.getTag('state')
                
            }],
            series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'name',
                yField: ['percent'],
                tips: {
                    trackMouse: true,
                    width: 74,
                    height: 38,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('name'));
                        this.update(storeItem.get('cant'));
                    }
                },
                renderer: function(sprite, storeItem, barAttr, i, store) {
                    barAttr.fill = storeItem.get('color');
                    return barAttr;
                }
            }],
        initComponent:function(){
          
            
        this.buttons = [
                        {
                            iconCls: 'icon-cancel',
                            text: Raptor.getTag('cancel'),
                            scope: this,
                            handler: this.close
                        }]    
            
            
            
            this.callParent();
           
        } 
 
      
    })


