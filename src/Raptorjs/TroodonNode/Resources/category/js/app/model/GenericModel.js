Ext.define('Category.model.GenericModel', {
    extend: 'Ext.data.Model',
    fields: ['id','name'],
    
    proxy: {
        type: 'rest',
        listeners:{
            exception:function(s,response){
                var resp=Ext.decode(response.responseText);
                if(resp.cod!==5)
                    Raptor.msg.show(resp.cod,resp.msg);
                
            }
        },
        api:{
            create  : 'category/insert',
            read    : 'category/list',
            update  : 'category/edit',
            destroy : 'category/delete'
        },
        reader: {
            type: 'json'
           
        }
    }
});