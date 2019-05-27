Ext.define('Auditories.model.EstadisticModel', {
    extend: 'Ext.data.Model',
    fields: ['cant','name','color','percent'],
    
    proxy: {
        type: 'ajax',
        url:'auditories/listestadistic',
        actionMethods: { //POST or GET
            read: 'POST'
        },
        reader: {
            type: 'json'
        }
    }
});