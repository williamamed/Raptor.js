Ext.define('GestRol.store.Privilege', {
    extend: 'Ext.data.TreeStore',
    model: 'GestRol.model.PrivilegeModel',
    root: {
        text: Raptor.getTag('priv'),
        expandable:false
    }
});