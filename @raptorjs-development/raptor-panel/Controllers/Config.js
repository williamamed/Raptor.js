"use strict";
var lodash=require('lodash'),
	fs=require('fs'),
	path=require('path')

/*
* Raptor.js - Node framework
* Controlador ES6
* Clase controladora de la configuracion por defecto
* de Raptor.js
*/
class ConfigController extends R.Controller{
	

	configure(){

		this.prefix='/raptor';
		this.route('post','/config/process',this.preccesConfigureAction)
		this.routes({
			'/config':this.renderConfigureAction
		})

	}

	/**
	* Renderiza el formulario de configuracion
	* de Raptor.js
	*
	*/
	renderConfigureAction(req,res,next){
		res.render('raptor-panel:ng/config',{
			options: this.R.options
		});
	}

	/**
	* Procesa los valores configurados
	* en el formulario
	*
	*/
	preccesConfigureAction(req,res,next){
		var options={};
		
		try {
			delete require.cache[path.join(R.basePath, 'config','options.json')]
			options = require(path.join(this.R.basePath, 'config','options.json'));
		} catch (error) {
			console.log('Error leyendo options.json:',error.message)
		}
		
		req.mapOption('portHttp','port',options,function(value){
			if(value)
				return parseInt(value)
			else
				return 4440
		});
		req.mapOption('secret','secret',options);
		req.mapOption('maxEventListeners','maxEventListeners',options);
		req.mapOption('proyect','proyectName',options);
		
		req.mapOption('socketio','socketio.active',options,function(value){
			if(value && value==true)
				return true;
			else
				return false;
		});
		
		
		var replacer = this.R.app.get('json replacer');
		var spaces = this.R.app.get('json spaces');
		var body = JSON.stringify(options, null, 2);

		var fd=fs.openSync(this.R.basePath+'/config/options.json','w')
		fs.writeSync(fd,body);
		fs.closeSync(fd);
		res.show('La configuración para Raptor.js fue establecida con éxito, verifique en la consola el funcionamiento de su nueva configuración.')
	}

	
}
module.exports=ConfigController;
