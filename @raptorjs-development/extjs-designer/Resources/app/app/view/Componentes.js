Ext.define('Generate.view.Componentes', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.componentes',
    width:'100%',
    title: "Componentes Ui",
    collapsible:true,
    iconCls:'',
    rootVisible: false,
    store:'CompStore',
    viewConfig: {
        plugins: { ptype: 'treeviewdragdrop' }
    },
    initComponent: function() {
        
        this.callParent();
    }
});