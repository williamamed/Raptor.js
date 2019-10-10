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
	indexAction(req, res, next, ProjectManager) {

		res.render("templates-gen:gen.index.ejs", {
			config: [],
			ProjectManager: ProjectManager
		});
	}

	/**
     * @Route("/components")
     */
	componentsAction(req, res, next, R, ProjectManager) {
		var bundles = []
		for (const key in ProjectManager.components) {

			bundles.push({
				name: ProjectManager.components[key].name,
				external: ProjectManager.components[key].external
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
				if(!message)
					message="";
				res.show("La plantilla fue creada con éxito!! ",1,{
					message: message
				})
			})
			.catch(function(err){
				//console.log(err)
				next("La plantilla no pudo ser creada: "+err.message)
			})

			
		} else
			next("La plantilla no pudo ser creada: No existe el artefacto seleccionado en el registro.")
	}
}

module.exports = GenController;