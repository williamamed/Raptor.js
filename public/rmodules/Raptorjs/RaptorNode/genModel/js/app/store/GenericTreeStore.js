Ext.define('Generate.store.GenericTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Generate.model.GenericTreeModel',
    autoLoad: true,
    root: {
        text: "src",
        expandable:true
    }
});