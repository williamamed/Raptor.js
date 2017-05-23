'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class FirstExample extends Controller{

	configure(){
		this.route('all','/example/hola',this.indexAction)

	}

	indexAction(req,res,next){
		var self=this;
		
		
//		req.language.config.default = "en";

		req.language.setCurrentLanguage("ru");

		req.language.getCurrentLanguage();
		req.language.persistCookie()
		res.show('El lenguaje fue establecido con exito en un cookie',Controller.ERROR)
		return req.language.getTranslation("prueba");
		 

		//this.R.getModels('exampleNode').cars.findAll({
		//	    include: [{
		//	        model: this.R.getModels('exampleNode').users
		//	    }]
		//	}).then(function(cars) {
		//		
		//		res.end(JSON.stringify(cars[0]))
		//		
		//		//res.render('exampleNode:hola/deep',{
		//		//  	msg: cars[0].get('name')
		//		//})
		//	}).catch(function(err){
		//		next(err);
		//	})
		////return "hola mundo controller";
	}
}

module.exports=FirstExample;
