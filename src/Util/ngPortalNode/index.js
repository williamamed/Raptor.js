'use strict';
const ngPortalRegistry=require('./Manager/ngPortalRegistry')
const ngPortal=require('./Manager/ngPortal')
const path=require('path')
/*
* Raptor.js - Node framework
* Generado por Raptor.js
* 
*
*/
class ngPortalNode {

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
	middleware(R){
		
		R.app.all("/:base/home([\/\w*]*)?",function(req,res,next){
		    
		    if($injector('ngPortalRegistry').get(req.params.base)){
				
		        $injector('ngPortalRegistry').get(req.params.base).run(req,res,next)
		    }else{
		        
				res.status(404);
				//Arreglar esta linea
		        res.render(R.resolveLocal("CoreNode/Source/views/404.ejs"), { msg:"404 Not Found" })
		        
		    }
		    
		})
		
		
		
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
	configure(R){
	    
	    R.on('ngPortal:ready',function(){
	       
	        var ngPortal=$injector('ngPortal')
		    $injector('ngPortalRegistry').set(new ngPortal('ngPortal')
		    .config(function(){
		        
		    }))
		    
	    })
	    
	    R.on('after:configure',function(){
			
			$injector('ngPortalRegistry',new ngPortalRegistry())
			
		    $injector('ngPortal',ngPortal)
		    
		    R.emit('ngPortal:ready')
	    })
		
	}
}
module.exports=ngPortalNode