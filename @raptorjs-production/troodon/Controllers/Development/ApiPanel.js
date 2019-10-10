'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("/api/development/troodon")
 * @Controller
 */
class ApiPanel {

	configure() {

	}

    /**
     * @Route("/import",method="post")
	 * @Development
	 * @Cors
	 * @Csrf
     */
	importAction(req, res, next, DynamicPrivilege, Options) {
		
		DynamicPrivilege.import(req.body.rol)
			.then(function () {
				res.show("Los privilegios fueron importados!!");
			})
			.catch(function(err){
				
				next(err)
			})
		
	}
}

module.exports = ApiPanel;