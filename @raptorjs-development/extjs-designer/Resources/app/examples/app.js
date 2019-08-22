/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'Radio',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel','GenericTreeModel'],    
    stores: ['Generic','GenericTreeStore','CompStore','AttrCombo'],
    controllers: ['Generic']
});
