Ext.define('GestPrivilege.store.Privilege', {
    extend: 'Ext.data.TreeStore',
    model: 'GestPrivilege.model.PrivilegeModel',
    autoLoad: true,
    root: {
        text: Raptor.getTag('priv')+" <i style='color:gray'>(this compose your privileges and menu interface)</i>",
        expandable:false
    }
});