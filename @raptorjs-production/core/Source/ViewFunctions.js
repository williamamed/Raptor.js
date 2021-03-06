"use strict"
/**
* Esta clase define las funciones que seran
* expuestas dentro del objeto R en las plantillas ejs
* de cada vista
*
* @author William Amed
*/
class ViewFunctions {

	constructor(app){
		this.R=app;
	}
	/**
	* Setea el request activo de esta peticion
	*
	* @author William Amed
	* @api private
	*/
	__setRequest(req){
		this.req=req;
	}
	/**
	* Retorna contenido insertado en el punto caliente especificado
	*
	* @author William Amed
	* @api public
	*/
	plugin(name){
		if(this.R.viewHotSpot[name]){
			var text='';
			for (var i = 0; i < this.R.viewHotSpot[name].length; i++) {
				text+=this.R.viewHotSpot[name][i];
			};
			return text;
		}

		if(this.req && this.req.viewPlugin.get(name).length>0){
			var text='';
			var views=this.req.viewPlugin.get(name);
			for (var i = 0; i < views.length; i++) {
				text+=views[i];
			};
			return text;
		}
		
		return '';
	}

	/**
	* Retorna contenido insertado en el punto caliente especificado
	*
	* @author William Amed
	* @api public
	*/
	pluginRequest(name){
		
		if(this.req && this.req.viewPlugin.get(name).length>0){
			var text='';
			var views=this.req.viewPlugin.get(name);
			for (var i = 0; i < views.length; i++) {
				text+=views[i];
			};
			return text;
		}
		return '';
	}

	flash(name){
	    if(this.req)
		    return this.req.flash(name)
	}

	/**
	* Devuelve el texto definido en la internacionalizacion para la configuracion
	* de idioma actual
	*
	* @author William Amed
	* @api public
	*/
	lang(tag,values,bundle){
        if(!this.req)
            return
		if(typeof values=='string'){
			bundle=values;
			values={};
		}
		if(!bundle)
			bundle=this.req.language.bundle?this.req.language.bundle.name:''
		
		return this.R.i18n.__(tag,values,this.req.language.getCurrentLanguage(),bundle)
	}

	csrfField(){
		return '<input type="hidden" name="_csrf" value="'+(this.req.csrfToken?this.req.csrfToken():'')+'">'
	}

	csrfToken(){
	    if(this.req && this.req.csrfToken)
		    return this.req.csrfToken();
	}


	compress(options){
		var Compressor=require('./Compressor'),
			compress=new Compressor(this.R);

		return '';
	}

	assetJS(options){
		var Compressor=require('./Compressor'),
			compress=new Compressor(this.R);

		var base=this.R.basePath;

		if(options.compress==true){
			compress.compressJS(options);
			return "<script src='"+options.output+"'></script>";
		}else{
			var script='';
			if(typeof options.input=='object'){
				for (var i = 0; i < options.input.length; i++) {
					script+="<script src='"+options.input[i]+"'></script>";
				};
			}else
				script="<script src='"+options.input+"'></script>";
			return script;
		}

	}

	assetCSS(options){
		var Compressor=require('./Compressor'),
			compress=new Compressor(this.R);

		

		if(options.compress==true){
			compress.compressCSS(options);
			return "<link href='"+options.output+"' rel='stylesheet'>";
		}else{
			var script='';
			if(typeof options.input=='object'){
				for (var i = 0; i < options.input.length; i++) {
					script+="<link href='"+options.input[i]+"' rel='stylesheet'>";
				};
			}else
				script="<link href='"+options.input+"' rel='stylesheet'>";
			return script;
		}
	}

	public(component){
		var R=$i('R')
		var splited=component.split('/')
		var bundle=splited.shift()
		if(!R.bundles[bundle])
			return '';
		return '/public/'+R.bundles[bundle].vendor+'/'+bundle+'/'+splited.join('/')
	}
}

module.exports=ViewFunctions;