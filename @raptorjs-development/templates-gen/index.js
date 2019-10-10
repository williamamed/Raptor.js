'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("")
 */
class TemplatesGenNode {

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
	middleware(R,router){
		
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
	configure(R,Events){
		Events.register({
			'ready':function(){
				R.bundles['templates-gen'].manifest.technologies=require('./Version')
				$i('Artefacts',{
					set:function(name,val){
						R.bundles['templates-gen'].manifest.technologies[name]=val;
					},
					remove:function(name){
						delete R.bundles['templates-gen'].manifest.technologies[name]
					},
					setTemplate:function(name,templateName,val){
						if(R.bundles['templates-gen'].manifest.technologies[name])
							R.bundles['templates-gen'].manifest.technologies[name][templateName]=val;
					},
					removeTemplate:function(name,templateName){
						if(R.bundles['templates-gen'].manifest.technologies[name])
							delete R.bundles['templates-gen'].manifest.technologies[name][templateName];
					}
				})
				R.emit('artefacts:ready')
			},
			'before:middleware':function(){
				R.app.get('/raptor/home',function(req,res,next){
					
					req.viewPlugin.set('raptorpanel_sidebar_main','<li class="nav-item"><a class="nav-link ngPortal-embedded" route="/raptor/templates">Artefactos <span class="badge badge-danger">nuevo</span></a></li>')
					next()
				})
			}
		})
		
	}
}
module.exports=TemplatesGenNode