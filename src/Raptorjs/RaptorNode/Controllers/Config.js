"use strict";
var Controller=require('raptorjs').Controller,
	lodash=require('lodash'),
	fs=require('fs')

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
		
		
		var options=lodash.extend(this.R.options);

		req.mapOption('portHttp','port',options,function(value){
			if(value)
				return parseInt(value)
			else
				return 4440
		});
		req.mapOption('secret','secret',options);
		req.mapOption('proyect','proyectName',options);
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
		req.mapOption('socketio','socketio.active',options,function(value){
			if(value && value==="true")
				return true;
			else
				return false;
		});
		req.mapOption('activebd','database.state',options,function(value){
			if(value && value==="true")
				return 'on';
			else
				return 'off';
		});

		var replacer = this.R.app.get('json replacer');
		var spaces = this.R.app.get('json spaces');
		var body = JSON.stringify(options, replacer, spaces);

		var fd=fs.openSync(this.R.basePath+'/config/options.json','w')
		fs.writeSync(fd,body);
		fs.closeSync(fd);
		res.json({
			text:'La configuración para Raptor.js fue establecida con éxito !!, Por favor revise la consola y verifique el funcionamiento de su nueva configuración.'
		})
	}

	
}
module.exports=ConfigController;
