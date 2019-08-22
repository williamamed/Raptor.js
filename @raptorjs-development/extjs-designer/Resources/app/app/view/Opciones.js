Ext.define('Generate.view.Opciones',{
    extend: 'Ext.panel.Panel',
    alias: 'widget.opciones',
    collapsible: true,
    title: "Opciones Ui",
    iconCls:'',
    width:'20%',
    layout:'vbox',
    initComponent: function() {
        this.items = [{
                        xtype: 'generictree',
                        flex:1,
                    },{
                        xtype: 'componentes',
                        flex:1,
                    },{
                        xtype: 'atributos',
                        flex:1
                    }];
        this.callParent();
    }


});