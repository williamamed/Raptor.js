Ext.define('GestPrivilege.model.PrivilegeModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'},'belongs','className','type','route'],
    
    proxy: {
        type: 'ajax',
        url: 'privilege/list',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});