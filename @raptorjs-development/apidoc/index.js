'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("")
 */
class ApiDocNode {

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
			'before:middleware':function(){
				R.app.get('/raptor/home',function(req,res,next){
					req.viewPlugin.set('raptorpanel_sidebar_main','<li class="nav-item"><a class="nav-link ngPortal-embedded" target="_blank" href="/public/'+R.bundles['apidoc'].vendor+'/apidoc/base.html"> Documentación v'+R.bundles['apidoc'].manifest.version+'</a></li>')
					next()
				})
			}
		})
	}
}
module.exports=ApiDocNode