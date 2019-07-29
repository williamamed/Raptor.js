'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("/migration")
 */
class Migration extends R.Controller{

	configure(){
		
	}
    
    /**
     * @Route("/:method")
     */
	methodAction(req, res, next, Umzug, Options) {
		if(Options.mode=="development"){
			if (Umzug[req.params.method]) {
				Umzug[req.params.method](JSON.parse(req.query.p))
					.then(function (migrations) {
						res.send("OK !!");
					})
					.catch(function (err) {
						res.send(err.message)
					})
				
			} else
				res.send('Método de migración no encontrado !!')
		}else{
			res.send('NO DISPONIBLE EN PRODUCCIÓN')
		}
		
	}
}

module.exports=Migration;