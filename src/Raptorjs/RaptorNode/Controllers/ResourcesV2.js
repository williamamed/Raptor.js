'use strict';
var fse = require('fs-extra');

var path=require('path')
/**
 * Raptor.js - Node framework
 * Controlador ES6
 * 
 * @Route("/raptor/component/resources.v2")
 */
class ResourcesV2 extends R.Controller {

	configure() {

	}

    /**
     * @Route("")
     */
	indexAction(req, res, next) {

		res.render("RaptorNode:ng/resources.ejs");
	}

	/**
     * @Route("/generate")
     */
	generateAction(req, res, next) {
		if (req.body.components) {
			var comp = req.body.components;
			for (let i = 0; i < comp.length; i++) {
				if (comp[i].type == "comp" && this.R.bundles[comp[i].text]) {
					let bundle = this.R.bundles[comp[i].text]
					R.copyResources(bundle.name,function(){
						if(bundle.compressor){
							var compressor=new bundle.compressor(R,bundle.name);
							if(compressor.run)
								compressor.run()
						}  
					},true)
				}
			}
		}
		res.show('Los recursos del módulo fueron publicados correctamente.');
	}

	/**
	 * @Route("/delete")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	clearAction(req, res, next) {
		if (req.body.components) {
			var comp = req.body.components;
			for (let i = 0; i < comp.length; i++) {
				if (comp[i].type == "comp" && this.R.bundles[comp[i].text]) {
					let bundle = this.R.bundles[comp[i].text]
					if (fse.existsSync(this.R.basePath + '/public/rmodules/' + bundle.vendor + '/' + bundle.name))
						fse.remove(this.R.basePath + '/public/rmodules/' + bundle.vendor + '/' + bundle.name, function () {

						});
				}
			}
		}
		res.show('Los recursos del módulo fueron limpiados correctamente.');
	}
}

module.exports = ResourcesV2;