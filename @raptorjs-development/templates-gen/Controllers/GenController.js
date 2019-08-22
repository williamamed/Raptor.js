'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("/raptor/templates")
 */
class GenController extends R.Controller {

	configure() {

	}

    /**
     * @Route("")
     */
	indexAction(req, res, next) {

		res.render("templates-gen:gen.index.ejs", {
			config: []
		});
	}

	/**
     * @Route("/components")
     */
	componentsAction(req, res, next, R) {
		var bundles = []
		for (const key in R.bundles) {

			bundles.push({
				name: R.bundles[key].name,
				external: R.bundles[key].external
			})
		}
		res.json(bundles)
	}

	/**
     * @Route("/version")
     */
	versionAction(req, res, next, R) {

		res.json(R.bundles['templates-gen'].manifest.technologies)
	}

	/**
	 * @Route("/create")
	 */
	createAction(req, res, next) {

		if (R.bundles['templates-gen'].manifest.technologies[req.body.tech]
			&& R.bundles['templates-gen'].manifest.technologies[req.body.tech].templates[req.body.key]) {
			new Promise(function (resolve) {
				resolve()
			})
			.then(function(){
				return $i.invoke(R.bundles['templates-gen'].manifest
				.technologies[req.body.tech]
				.templates[req.body.key]
				.action,null,[req])
			})
			.then(function(message){
				
				res.show("La plantilla fue creada con éxito!! ",1,message)
			})
			.catch(function(err){
				next(new Error("La plantilla no pudo ser creada: "+err.message))
			})

			
		} else
			next(new Error("La plantilla no pudo ser creada"))
	}
}

module.exports = GenController;