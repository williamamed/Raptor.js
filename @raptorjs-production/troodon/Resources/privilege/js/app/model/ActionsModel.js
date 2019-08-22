Ext.define('GestPrivilege.model.ActionsModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name','belongs','class_name','type','route','description'],
    
    proxy: {
        type: 'ajax',
        url: 'privilege/listaction',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});