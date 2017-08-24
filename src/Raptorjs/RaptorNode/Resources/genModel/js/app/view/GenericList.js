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
        this.selModel=Ext.create('Ext.selection.CheckboxModel', {mode: 'MULTI'});
        this.callParent();
    }
});

