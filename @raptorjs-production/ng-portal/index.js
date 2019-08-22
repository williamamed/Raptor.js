'use strict';
const ngPortalRegistry=require('./Manager/ngPortalRegistry')
const ngPortal=require('./Manager/ngPortal')
const path=require('path')
/**
* Raptor.js - Node framework
* Generado por Raptor.js
* 
* @Route("")
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
		        res.render(R.resolveLocal("core/Source/views/404.ejs"), { msg:"404 Not Found" })
		        
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
		R.addPublish("bootstrap","dist")
		R.addPublish("jquery","dist")
		R.addPublish("angular")
		R.addPublish("angular-animate")
		R.addPublish("angular-aria")
		R.addPublish("angular-cookies")
		R.addPublish("angular-loader")
		R.addPublish("angular-material")
		R.addPublish("angular-messages")
		R.addPublish("angular-mocks")
		R.addPublish("angular-parse-ext")
		R.addPublish("angular-resource")
		R.addPublish("angular-route")
		R.addPublish("angular-sanitize")
		R.addPublish("angular-touch")
		
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