"use strict";
var Controller=require('raptorjs').Controller

/*
* Raptor.js - Node framework
* Controlador ES6
* Clase controladora de la configuracion por defecto
* de Raptor.js
*/
class ConfigController extends Controller{
	

	configure(){

		this.prefix='/raptor';

		this.routes({
			
			'/config':this.renderConfigureAction,
			'/config/process':this.preccesConfigureAction,
		})

	}

	/**
	* Renderiza el formulario de configuracion
	* de Raptor.js
	*
	*/
	renderConfigureAction(req,res,next){
		res.render('RaptorNode:Options/config',{
			options: this.R.options
		});
	}

	/**
	* Procesa los valores configurados
	* en el formulario
	*
	*/
	preccesConfigureAction(req,res,next){
		res.render('RaptorNode:Options/config');

	}

	
}
module.exports=ConfigController;
