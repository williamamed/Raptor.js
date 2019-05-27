Ext.define('GestUser.store.State', {
    extend: 'Ext.data.Store',
    fields: ['name', 'value'],
    data : [
        {"value":true, "name":"Active"},
        {"value":false, "name":"Inactive"}
       
     
    ]
});

