Ext.define('Generate.view.GenericTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.generictree',
    rootVisible: false,
    store: 'GenericTreeStore',
    title: 'Arbol Ui',
    iconCls:'',
    width:'100%',
    collapsible:true,
    initComponent: function() {
        
        
        this.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: "Salvar Ui",
                //hidden: true,
                //privilegeName: 'insert',
                action: 'genAction',
                iconCls: 'icon-gen-ui'
            },{
                xtype: 'button',
                text: "Eliminar",
                disabled: true,
                //hidden: true,
                //privilegeName: 'insert',
                action: 'deleteAction',
                iconCls: 'icon-trash'
            }]
        }];
        this.callParent();
    }
});
