/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'Publish',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel','GenericTreeModel'],    
    stores: ['Generic','GenericTreeStore'],
    controllers: ['Generic']
});

//Raptor.Animated();