Ext.define('Generate.store.GenericTreeStore', {
    extend: 'Ext.data.TreeStore',
    fields:['text','sample','uiid','defineName'],
    root: {
        text: "src",
        expandable:true,
        uiid:'renderPanel',
        sample:{
            
        }
    }
});