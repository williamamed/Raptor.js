'use strict';

var KDYN = require('./Controllers/KDynamics')
/*
* Raptor.js - Node framework
* Generado por Raptor.js
* 
*
*/
class BioNode {

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
	middleware(R) {
		
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
	configure(R) {
		R.on('database:running', function () {
			R.migration('BioNode')
		})
		$injector('Bio',{
			protection: KDYN.bioMiddleware,
			watch:[],
			service:{}
		})
		R.on('before:middleware',function(){
			//Verificar si es post y marcarlo como login del bio
			R.app.use(function(req,res,next){
				if(req.body){
					for (let index = 0; index < $injector('Bio').watch.length; index++) {
						const element = $injector('Bio').watch[index];
						if(req.body[element.field]){
							if(!req.session.biomarker)
								req.session.biomarker={}
							req.session.biomarker[element.field]={
								pass: req.body[element.field],
								bio: req.body.bio
							}
						}
					}
					
					req.session.save(function(){
						next()
					})
				}
				
			})
		})
	}

}
module.exports = BioNode