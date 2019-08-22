Ext.define('GestEstructure.store.Estructure', {
    extend: 'Ext.data.TreeStore',
    model: 'GestEstructure.model.EstructureModel',
    autoLoad: true,
    root: {
        text: "Global<i style='color:gray'>(this global not belongs to estructure)</i>",
        expandable:false
    }
});