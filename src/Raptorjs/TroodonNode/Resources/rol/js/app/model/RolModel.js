Ext.define('GestRol.model.RolModel', {
    extend: 'Ext.data.Model',
    
    fields: ['id', 'name',{name:'text',mapping:'name'},'belongs'],
    proxy: {
        type: 'ajax',
         api: {
            read: 'rol/list'
        },
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'users',
            successProperty: 'success'
        }
    }
});