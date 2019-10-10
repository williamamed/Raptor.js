const path=require('path')
class DevPanel{

    constructor(){
        
        this.configure()
        var Model=require('./Services/ModelV2');
        new Model()
        .init()
        var config=require('./Services/Config');
        new config()
        .init();
        
    }

    /**
     * @Injectable
     */
    configure(router){
        router.use(function(req,res,next){
            req.viewPlugin.set('raptorpanel_sidebar_main',R.template(path.join(__dirname,'Views/sidebar.ejs')))
            next()
        })
    }

    /**
     * @Event("artefacts:ready",type="once")
     */
    onReady(){
        R.bundles['templates-gen'].manifest.technologies['Sequelize-ORM'] = require(path.join(__dirname, 'Artefacts'))
    }

}
module.exports=DevPanel;