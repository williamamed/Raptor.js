Ext.define('Generate.model.GenericTreeModel', {
    extend: 'Ext.data.Model',
    fields: ['id','text','namespace','vendor'],
    
    proxy: {
        type: 'ajax',
        url: 'generatenode/list',
       
        actionMethods: { //POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});
