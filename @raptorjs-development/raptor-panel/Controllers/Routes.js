'use strict';

/**
 * Raptor.js - Node framework
 * Controlador ES6
 * 
 * @Route("/raptor/component/routes")
 * @Controller
 */
class Routes {

	configure() {

	}

	/**
     * @Get
     */
	render(req, res, next, ProjectManager) {
		var methods=require('methods');

		res.render('raptor-panel:ng/route.ejs',{
			routesDef: ProjectManager.routes?ProjectManager.routes:false,
			port: ProjectManager.port,
			methods: methods.length
		})
		
	}

	
}

module.exports = Routes;