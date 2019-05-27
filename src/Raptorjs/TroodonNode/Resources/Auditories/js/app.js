/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'Auditories',
    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['GenericModel','EstadisticModel'],    
    stores: ['Generic','Estadistic'],
    controllers: ['Generic']
});

