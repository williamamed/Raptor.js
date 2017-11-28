Ext.define('GestPrivilege.model.PrivilegeRemoteModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name','belongs','className','type','route'],
    
    proxy: {
        type: 'ajax',
        url: 'privilege/listroutes',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});