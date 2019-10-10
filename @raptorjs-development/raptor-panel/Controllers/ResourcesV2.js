'use strict';
var fse = require('fs-extra');

var path = require('path')
/**
 * Raptor.js - Node framework
 * Controlador ES6
 * 
 * @Route("/raptor/component/resources.v2")
 */
class ResourcesV2 extends R.Controller {

	configure() {

	}

	isComponent(name) {
		var norm=name.replace(/\\/g,'/').split('/');
		var rev=norm.reverse();
		if(R.bundles[rev.shift()])
			return true;
		else
			return false;
	}

    /**
     * @Route("")
     */
	indexAction(req, res, next, Options) {
		var publish = []
		for (const tag in Options.publish) {
			if (!this.isComponent(tag))
				publish.push({
					text: tag,
					type: 'lib',
					expandable: false
				})
		}
		res.render("raptor-panel:ng/resources.ejs", {
			libraries: JSON.stringify(publish)
		});
	}

	/**
     * @Route("/generate")
     */
	generateAction(req, res, next,Options, ProjectManager) {
		if (req.body.components) {
			var comp = req.body.components;

			for (let i = 0; i < comp.length; i++) {
				if (comp[i].type == "comp" && ProjectManager.components[comp[i].original.namespace]) {
					
					let bundle = ProjectManager.components[comp[i].original.namespace]
					R.copyResources(bundle, function () {
						R.Compressor.markers.execute(path.join(R.basePath, 'public', bundle.vendor, bundle.name))
						if (bundle.compressor) {
							var compressor = new bundle.compressor(R, bundle.name);
							if (compressor.run) {
								try {
									compressor.run()
								} catch (error) {

								}
							}
						}
					}, true)
				}
				if (comp[i].type == "lib") {
					try {
						let lib=require.resolve(comp[i].text);
						
						let real=lib.split(path.normalize(comp[i].text))[0];

						fse.copySync(path.join(real,comp[i].text,Options.publish[comp[i].text]),path.join(R.basePath,'public',comp[i].text))
					} catch (error) {
						console.log(error)
					}
					
				}
			}
			res.show('Los recursos del módulo fueron publicados correctamente.');
		}else{
			res.show('Seleccione los componentes que desea publicar.');
		}
		
	}

	/**
	 * @Route("/delete")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	clearAction(req, res, next, ProjectManager) {
		if (req.body.components) {
			var comp = req.body.components;
			for (let i = 0; i < comp.length; i++) {
				if (comp[i].type == "comp" && ProjectManager.components[comp[i].text]) {
					let bundle = ProjectManager.components[comp[i].text]
					if (fse.existsSync(this.R.basePath + '/public/' + bundle.vendor + '/' + bundle.name))
						fse.remove(this.R.basePath + '/public/' + bundle.vendor + '/' + bundle.name, function () {

						});
				}
			}
		}
		res.show('Los recursos del módulo fueron limpiados correctamente.');
	}
}

module.exports = ResourcesV2;