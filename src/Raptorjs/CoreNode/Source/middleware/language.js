var i18n = require('i18n-nodejs')
, lodash = require('lodash')
, fs = require('fs')
, path = require('path');

module.exports={
	defaultConfig:{
		default:'es',
		currentLanguage: 'es',
		usePrefered: false,
		i18nLocation: '/i18n/language.json'
	},


   /**
	* Raptor.js - Node framework
	*
	* Solo para uso interno.
	* Devuelve un lenguaje a partir de lo especificado en la configuración.
	*
	* @author Jorge Miralles
	*/
	selectLanguage:function(){
		var lang = this.config.default;
		// Si la opción "usePrefered" esta activa (true) se guardan los lenguajes de la petición
		if (this.config.usePrefered == true) {
			this.config.acceptedLanguage=this.request.acceptedLanguages[0];
			lang = this.config.acceptedLanguage;
		}
		//Si la opción "cookieName" existe y no es vacía se cambia el lenguaje de la configuración por el lenguaje de la cookie
		
		if (this.config.cookieName && this.config.cookieName !=="" && this.request.cookies[this.config.cookieName]) {
			if(this.request.cookies[this.config.cookieName].lang){
				this.config.cookieLanguage = this.request.cookies[this.config.cookieName].lang;
				lang = this.config.cookieLanguage;
			}
		}
		this.config.currentLanguage = lang;
		return lang;
	},

	prepare:function(R,config){
		var self=this;
		return function(req,res,next){
			req.language=lodash.cloneDeep(self);
			req.language.initBase(R,config,req);
			req.lang=function(){
				return req.language.getTranslation.apply(req.language,arguments);
			}
			next()
		}
	},

	initBase:function(R,config,req){
		this.R = R;
		this.request = req;
		this.config=lodash.extend(this.defaultConfig,config);
		this.config.currentLanguage=this.config.default;
		this.selectLanguage()
	},
	/**
	* Raptor.js - Node framework
	*
	* Inicaliza el traductor a partir de la configuración
	*
	* @author Jorge Miralles
	* @param string basPath Ruta base del Raptor
	* @param {object} bundle Componente que utiliza el traductor
	* @param {object} req La peticion para la que se configura el traductor
	*/
	initBundle:function(bundle){
		this.bundle=bundle;
	},

	/**
	* Raptor.js - Node framework
	*
	* Devuelve el lenguaje actual de las traducciones
	*
	* @author Jorge Miralles
	*/
	getCurrentLanguage:function(){
		return this.config.currentLanguage;
	},

	/**
	* Raptor.js - Node framework
	*
	* Devuelve el lenguaje actual de las traducciones
	*
	* @author Jorge Miralles
	* @param {string} lang Nuevo lenguaje
	*/
	setCurrentLanguage:function(lang){
		this.config.currentLanguage = lang;
	},

	persistCookie:function(maxAge){
		if(this.config.cookieName && this.config.cookieName !==""){
			var opt={
				httpOnly: true
			}
			if(maxAge)
				opt.maxAge=maxAge;
			this.request.res.cookie(this.config.cookieName,{
				lang:this.getCurrentLanguage()
			},opt)
			return true;
		}
		return false;
	},

	/**
	* Raptor.js - Node framework
	*
	* Activa o desactiva el uso del lenguaje del navegador
	*
	* @author Jorge Miralles
	* @param {string} usePrefered nuevo lenguaje
	*/
	setUsePreferedLanguage:function(usePrefered){
		this.config.usePrefered = usePrefered;
		this.selectLanguage();
	},

	/**
	* Raptor.js - Node framework
	*
	* Cambia la configuración. El nuevo objeto de configuración puede contener todos los parametros 
	* de la configuración o solo algunos
	*
	* @author Jorge Miralles
	* @param {object} config nueva configuración.
	* Ej: 	config = {
	*			default:"es",
	*			usePrefered: true,
	*			acceptedLanguage: "en",
	*			cookieName: "langCookie",
	*			cookieLanguage: "en",
	*			file: "{basePath}/i18n/language.json"
	* 	  	}
	*/
	changeConfig: function(config){
		this.initBase(this.R,config);
		this.selectLanguage();		
		
	},

	/**
	* Raptor.js - Node framework
	*
	* Optiene la traducción a partir de un "tag" específico.
	*
	* @author Jorge Miralles
	* @param {string} tag Identificador de la traducción.
	* @param {string} file (Opcional) Nombre de un bundle o la dirección de un archivo para escoger como nuevo
	* archivo de traducción.
	*/
	getTranslation:function(tag,values,file){
		if(typeof values=='string'){
			file=values;
			values={}
		}

		if(file){
			if(fs.existsSync(file)){
				return i18n(this.config.currentLanguage,file).__(tag,values);
			}else{
				return this.R.i18n.__(tag,values,this.config.currentLanguage,file);
			}
		}else{
			if(this.bundle)
				return this.R.i18n.__(tag,values,this.config.currentLanguage,this.bundle.name);
			else
				throw new Error('No se encontró una configuración de idioma para este flujo, es probable que la funcionalidad actual no pertenesca a un componente de Raptor.');
		}

	}
}
