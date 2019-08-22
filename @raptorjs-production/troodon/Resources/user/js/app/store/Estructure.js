Ext.define('GestUser.store.Estructure', {
    extend: 'Ext.data.TreeStore',
    model: 'GestUser.model.EstructureModel',
    autoLoad: true,
    root: {
        text: "Global",
        expandable:false
    }
});