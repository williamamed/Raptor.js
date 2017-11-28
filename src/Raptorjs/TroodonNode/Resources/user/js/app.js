/*
 * Created With Raptor
 * Copyrigth 2013
 */


Ext.application({
    name: 'GestUser',
    paths:{
        'GestUser': '/public/rmodules/Raptorjs/TroodonNode/user/js/app'
    },
    requires: ['Ext.container.Viewport'],
    // automatically create an instance of AM.view.Viewport
    autoCreateViewport: true,
    launch:function(){
        
    },
    models: ['UserModel','RolModel','EstructureModel'],    
    stores: ['User','Rol','Estructure','State'],
    controllers: ['Users','Roles']
});



