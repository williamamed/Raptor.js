Ext.define('Publish.store.GenericTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'Publish.model.GenericTreeModel',
    autoLoad: true,
    root: {
        text: "src",
        expandable:true
    }
});