Ext.define('GestEstructure.model.EstructureModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name',{name:'text',mapping:'name'},'belongs','description','idCategory','action'],
    
    proxy: {
        type: 'ajax',
        url: 'structure/list',
       
        actionMethods: { //Esta Linea es necesaria para el metodo de llamada POST o GET
            read: 'POST'
        },
        reader: {
            type: 'json'
           
        }
    }
});