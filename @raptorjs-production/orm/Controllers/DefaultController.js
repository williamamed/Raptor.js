'use strict';
const path=require('path')
const fs=require('fs')
/**
 * Raptor.js - v2
 * 
 * @Route("")
 */
class orm extends R.Controller{

	configure(){
		
	}
    
    /**
     * @Route("/raptor/orm")
     */
	indexAction(req,res,next){
		
		res.render("orm:ngPortalApp/config.fragment.ejs",{
			options: this.R.options
		});
	}

	/**
     * @Route("/raptor/orm/save")
     */
	saveAction(req,res,next){
		var options={
			database:{
				options:{}
			}
		};
		try {
			delete require.cache[path.join(R.basePath, 'config','options.json')]
			options = require(path.join(R.basePath, 'config','options.json'));
		} catch (error) {
			console.log('Error leyendo options.json:',error.message)
		}
		
		req.mapOption('password','database.password',options);
		req.mapOption('user','database.user',options);
		req.mapOption('driver','database.options.dialect',options);
		req.mapOption('portDB','database.options.port',options,function(value){
			if(value)
				return parseInt(value)
			else
				return null;
		});
		req.mapOption('host','database.options.host',options);
		req.mapOption('db','database.name',options);
		req.mapOption('state','database.state',options);
		
		res.show('Sequelize ORM configurado !!');
		fs.writeFileSync(path.join(R.basePath, 'config','options.json'),JSON.stringify(options,null,2))
	}
}

module.exports=orm;