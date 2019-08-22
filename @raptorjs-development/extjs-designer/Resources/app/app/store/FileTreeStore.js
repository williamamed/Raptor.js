Ext.define('Generate.store.FileTreeStore', {
    extend: 'Ext.data.TreeStore',
    model:'Generate.store.FileTreeModel',
    autoLoad:true,
    root: {
        text: "Global",
        expandable:false
    }
});