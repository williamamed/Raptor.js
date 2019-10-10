'use strict';
const path=require('path')
/**
 * Raptor.js - v2
 * 
 * @Route("")
 */
class ExtjsDesignerNode {

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
		R.once('artefacts:ready',function(){
			
			R.bundles['templates-gen'].manifest.technologies['Extjs-4.2.0'].templates['designer']=require(path.join(__dirname,'Artefacts'))
		})
	}
}
module.exports=ExtjsDesignerNode