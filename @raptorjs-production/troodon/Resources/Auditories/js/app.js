/*
 * Created With Raptor
 * Copyrigth 2019 20203568
 */
 
Ext.application({
    name: 'Auditories',
    
    autoCreateViewport: true,
    
    models: ['GenericModel','EstadisticModel'],    
    stores: ['Generic','Estadistic'],
    controllers: ['Generic']
});
