Ext.define('Generate.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id','name'],
    
    proxy: {
        type: 'ajax',
        url:'model/list',
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});