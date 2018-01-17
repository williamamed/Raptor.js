'use strict';

var Controller=require('raptorjs').Controller
/**
 * Esta definicion se aplica como prefijo de ruta
 * para todas las definiciones en el controlador
 * 
 * @Route("/example") 
 * 
 * 
 */
class FirstExample extends Controller{

	configure(){
		
	}
    
    /**
     *  El prefijo de esta ruta es el declarado en la cabecera
     *  de esta clase.
     *  
     *  @Route("/holaruta",method="all")
     * 
     */
    holaRuta(req,res,next){
        res.send('hola ruta')
    }
    
    /**
     * @Route("/language",method="get")
     *
     */
	exampleLanguageAction(req,res,next){
		req.language.setCurrentLanguage("ru");
        
		req.language.getCurrentLanguage();
		req.language.persistCookie()
		res.show('El lenguaje fue establecido con exito en un cookie',Controller.ERROR)
		return req.language.getTranslation("prueba");
	}

    /**
     * @Route("/database/foreignkey")
     *
     */
	dataBaseRequestAction(req,res,next){
		var self=this;
		

	   /**
		* Esta funcion puede ser establecida en el classMethods del modelo
		*
		*/
		this.R.getModels('otroNode').cars.belongsTo(this.R.getModels('otroNode').users) 

	   /**
		* Para incluir el hidratado del modelo users dentro del cars debe especificarse en el include
		*
		*/
		this.R.getModels('otroNode').cars.findAll({
			    include: [{
			        model: this.R.getModels('otroNode').users
			    }]
			}).then(function(cars) {
				
				res.end(JSON.stringify(cars[0]))
				
			}).catch(function(err){
				next(err);
			})
		
	}
}

module.exports=FirstExample;
