Ext.define('Generate.view.FileTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.filetree',
    rootVisible: false,
    store: 'FileTreeStore',
    title: 'Sistema de archivos',
    iconCls:'',
    width:'100%',
    initComponent: function() {
        
        
        this.dockedItems = [];
        this.callParent();
    }
});
