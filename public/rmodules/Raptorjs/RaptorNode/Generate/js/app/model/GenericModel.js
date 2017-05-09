Ext.define('Generate.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id'],
    
    proxy: {
        type: 'ajax',
        api:{
            create  : 'action/insert',
            read    : 'action/list',
            update  : 'action/edit',
            destroy : 'action/delete'
        },
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});