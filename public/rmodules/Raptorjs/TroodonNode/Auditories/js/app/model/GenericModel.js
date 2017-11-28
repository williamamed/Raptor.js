Ext.define('Auditories.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id','a_date','log','username','ip','state'],
    
    proxy: {
        type: 'ajax',
        api:{
            create  : 'auditories/insert',
            read    : 'auditories/list',
            update  : 'action/edit',
            destroy : 'action/delete'
        },
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success', 
            totalProperty: 'result'
           
        }
    }
});