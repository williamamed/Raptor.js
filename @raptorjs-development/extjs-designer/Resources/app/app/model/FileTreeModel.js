Ext.define('Generate.store.FileTreeModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'},'index','description','dir','action','isView','confUI','meta'],
    
    proxy: {
        type: 'ajax',
        url: 'designer/filesystem',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'GET'
        },
        reader: {
            type: 'json'
           
        }
    }
});