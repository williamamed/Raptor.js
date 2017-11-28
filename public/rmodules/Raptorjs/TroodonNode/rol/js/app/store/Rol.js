Ext.define('GestRol.store.Rol', {
    
    extend: 'Ext.data.TreeStore',
    model: 'GestRol.model.RolModel',
    autoLoad: true,
    root: {
        text: "Global<i style='color:gray'>(this global not belongs to roles)</i>",
        expandable:false
    }
});