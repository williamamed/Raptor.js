Ext.define('GestRol.model.PrivilegeModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'}],
    
    proxy: {
        type: 'ajax',
        url: 'rol/listprivileges',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});