Ext.define('Category.store.Generic', {
    extend: 'Ext.data.Store',
    model: 'Category.model.GenericModel',
    autoLoad:true,
    autoSync:true,
    listeners:{
        write:function(s,op){
            var resp=s.getProxy().getReader().rawData;
            if(resp.cod && resp.cod!==1)
                Raptor.msg.show(resp.cod,resp.msg);
            
            if(resp.cod===1 || resp.cod===5)
                    s.load();
                
            if(resp.cod && resp.co===1)
                Raptor.msg.show(1,Raptor.getTag("category_action"));
            
        }
    }
});