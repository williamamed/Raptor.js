/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'GestRol',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['RolModel','PrivilegeModel'],    
    stores: ['Rol','Privilege'],
    controllers: ['Roles']
});


