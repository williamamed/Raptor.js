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
		this.route('all','/example/database/foreignkey',this.dataBaseRequestAction)
		this.route('get','/example/language',this.exampleLanguageAction)

	}

	exampleLanguageAction(req,res,next){
		req.language.setCurrentLanguage("ru");

		req.language.getCurrentLanguage();
		req.language.persistCookie()
		res.show('El lenguaje fue establecido con exito en un cookie',Controller.ERROR)
		return req.language.getTranslation("prueba");
	}


	dataBaseRequestAction(req,res,next){
		var self=this;
		

	   /**
		* Esta funcion puede ser establecida en el classMethods del modelo
		*
		*/
		this.R.getModels('otroNode').cars.belongsTo(this.R.getModels('otroNode').users) 

	   /**
		* Para incluir el hidratado del modelo users dentro del cars debe especificarse en el include
		*
		*/
		this.R.getModels('otroNode').cars.findAll({
			    include: [{
			        model: this.R.getModels('otroNode').users
			    }]
			}).then(function(cars) {
				
				res.end(JSON.stringify(cars[0]))
				
			}).catch(function(err){
				next(err);
			})
		
	}
}

module.exports=FirstExample;
