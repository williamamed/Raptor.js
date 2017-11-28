/*
 * Created With Raptor
 * Copyrigth 2013
 */
 
Ext.application({
    name: 'GestPrivilege',

    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    
    models: ['PrivilegeModel','PrivilegeRemoteModel','ActionsModel'],    
    stores: ['Privilege','Actions','PrivilegeRemote'],
    controllers: ['Privileges','Actions']
});


