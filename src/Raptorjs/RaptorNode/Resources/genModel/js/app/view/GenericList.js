Ext.define('Generate.view.GenericList', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.genericlist',
    
    title: "Tablas del esquema de base de datos",
    iconCls:'',
    store:'Generic',
    initComponent: function() {
        this.columns=[{
        	header: 'Tabla', width: 200, flex: 1, dataIndex: 'name'
        }]
        this.dockedItems = [{
                dock: 'top',
                xtype: 'toolbar',
                items: [{
                        xtype:'fieldcontainer',
                        defaultType: 'checkboxfield',
                        items:[{
                                    boxLabel  : 'Timestamps',
                                    inputValue: '1',
                                    id        : 'checkbox1'
                                }, {
                                    boxLabel  : 'Underscored',
                                    inputValue: '2',
                                    checked   : true,
                                    id        : 'checkbox2'
                                }]
                    }]
            }];
        this.selModel=Ext.create('Ext.selection.CheckboxModel', {mode: 'MULTI'});
        this.callParent();
    }
});

