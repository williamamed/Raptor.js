'use strict';
const fs=require('fs')
const fse=require('fs-extra')
const path=require('path')

/**
 * Raptor.js - Node framework
 * Generado por Raptor.js
 * 
 * @Route("")
 */
class CoreNode {

   /**
	* Raptor.js - Node framework
	* 
	* 
	* se ejecuta luego que son adicionados los elementos
	* del framework al stack de express
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	middleware(){
		
	}

   /**
	* Raptor.js - Node framework
	* 
	* Entrada de configuracion del componente
	* se ejecuta cuando se registran los componentes
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	configure(express){
		
		express.use(function(req,res,next){

			res.show=function(text,code,params){
				if(!code)
					code=1;
				if(typeof params != 'object' || !params )
					params={};
				
				if(typeof code=='object'){
					params=code;
					code=1;
				}
				res.json({
					msg:text,
					code:code,
					success: true,
					params:params
				})
			}

			res.showGeneric=function(text,code,params){
				if(!code)
					code=1;
				if(typeof params != 'object' || !params )
					params={};
				
				if(typeof code=='object'){
					params=code;
					code=1;
				}

				var accept = req.headers.accept || '';
				if (~accept.indexOf('html')) {
					res.render($injector('TemplateBasic'), { msg: "Code: "+code+", "+text})
	
					// json
				} else if (~accept.indexOf('json')) {
					res.json({
						msg:text,
						code:code,
						success: true,
						params:params
					})
					// plain text
				} else {
					res.setHeader('Content-Type', 'text/plain');
					res.end("Code: "+code+", "+text);
				}
				
			}
			next()
		})

	}

	/**
	 * Escuchar por cambios en una aplicacion Extjs
	 * @deprecated a remover en versiones inmediatas
	 * @TODO Escuchar por varias aplicaciones
	 * @param {*} directory 
	 */
	watchCompiledApp(directory) {
		const chokidar=require('chokidar')
		var self=this;
		var files=fs.readdirSync(directory)
		var R=$injector('R')
		for (let index = 0; index < files.length; index++) {
			const element = files[index];
			if (fs.statSync(path.join(directory,files[index])).isDirectory()) {
				self.watchCompiledApp(path.join(directory,files[index]));
			}else {
				if(files[index]=='compileApp'){
					
					chokidar.watch(path.join(directory,'app'), {persistent: true,ignoreInitial:true,ignored: /[\/\\]\./,depth: 99})
					.on('all', (event, route) => {
						
						R.extjs.preCompileApp(path.join(directory))
					});
				}
			}
		}
	}

	/**
	 * @deprecated a remover en versiones inmediatas
	 */
	syncResources(){
		var R=$injector('R')
		var publicBase=path.join(R.basePath,'public','rmodules')
		for (var bundle in R.bundles) {
			//R.copyResources(R.bundles[bundle].name,true);
			const chokidar=require('chokidar')
			let relativePath=R.bundles[bundle].path
			this.watchCompiledApp(path.join(R.basePath,'src',R.bundles[bundle].path,'Resources'))
			chokidar.watch(path.join(R.basePath,'src',R.bundles[bundle].path,'Resources'), {persistent: true,ignoreInitial:true,ignored: /[\/\\]\./,depth: 99})
				.on('all', (event, route) => {
					
					if(event=='unlink'){
						fse.removeSync(path.join(publicBase,relativePath,route.split('Resources')[1]));
					}
					if(event=='add'){
						fse.copySync(route,path.join(publicBase,relativePath,route.split('Resources')[1]));
					}
					if(event=='change'){
						fse.removeSync(path.join(publicBase,relativePath,route.split('Resources')[1]));
						fse.copySync(route,path.join(publicBase,relativePath,route.split('Resources')[1]));
					}
				});
		}
	}
	
}
module.exports=CoreNode