Ext.define('Generate.view.Atributos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.atributos',
    width: '100%',
    collapsible: true,
    title: "Atributos Ui",
    iconCls: '',
    selType: 'cellmodel',
    plugins: [
        {
            ptype: 'cellediting',
            clicksToEdit: 1,
            pluginId: 'attrplugin'
        }
    ],
    columns: [
        {
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'icon-del',  // Use a URL in the icon config
                tooltip: 'Eliminar atributo',
                handler: function (grid, rowIndex, colIndex) {
                    //var rec = store.getAt(rowIndex);
                    //alert("Sell " + rec.get('company'));
                    grid.up('gridpanel').fireEvent('deleteattrUI',grid.getStore().getAt(rowIndex))
                    
                }
            }]
        },
        {
            text: 'Name', dataIndex: 'name', editor: {
                xtype: 'combo',
                store: 'AttrCombo',
                typeAhead: true,
                queryMode: 'local',
                itemId: 'comboProperty',
                displayField: 'name',
                valueField: 'name',
                allowBlank: false
            }
        },
        {
            text: 'Value', dataIndex: 'value', flex: 1, editor: {
                field: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }
        },
        {
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'icon-edit',  // Use a URL in the icon config
                tooltip: 'Eliminar atributo',
                handler: function (grid, rowIndex, colIndex) {
                    //var rec = store.getAt(rowIndex);
                    //alert("Sell " + rec.get('company'));
                    grid.up('gridpanel').fireEvent('editattrUI',grid.getStore().getAt(rowIndex))
                    
                }
            }]
        }
    ],
    initComponent: function () {
        this.addEvents('deleteattrUI','editattrUI')
        this.store = Ext.create('Ext.data.Store', {
            storeId: 'simpsonsStore',
            fields: ['name', 'value'],
            data: [],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: "",
                action: 'addAction',
                iconCls: 'icon-add'
            }]
        }];
        this.callParent();
        
    }


});