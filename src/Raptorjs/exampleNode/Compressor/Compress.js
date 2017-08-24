"use strict"
var Compressor=require('raptorjs').Compressor;

class Compress extends Compressor{
	/**
	*
	*
	*/
	run(R,compressor){

		//this.compressBackbone(true);
		/**this.compressCSS({
			compress:true,
			input:[
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/css/normalize.css",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/css/owl.css",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/css/animate.css",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/css/et-icons.css",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/css/cardio.css"
			],
			output: "/portal.css"
		})*/
/**
		this.compressJS({
			compress:true,
			input:[
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/jquery.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/bootstrap.min.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/owl.carousel.min.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/wow.min.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/typewriter.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/jquery.onepagenav.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/portal/js/main.js"
			],
			output: "/portal.js"
		})*/
		/**
		this.compressJS({
			compress:true,
			input:[
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/jquery.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/bootstrap.min.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/fileinput.min.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/theme.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/es.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/uir-all.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/ie10-viewport-bug-workaround.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/perfect-scrollbar.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/raptor-core.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/underscore.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/backbone.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/area.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/router.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/app.js"
			],
			output: "/rux/rux.js"
		})*/
		/**
		this.compressJS({
			compress:true,
			input:[
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/jquery.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/bootstrap.min.js",
				
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/uir-all.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/ie10-viewport-bug-workaround.js",
				
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/raptor-core.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/underscore.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/backbone.js",

				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/pakete/area.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/pakete/pakete.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/pakete/profile.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/pakete/copiadores.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/pakete/router.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/pakete/app.js"
			],
			output: "/pakete/pakete.js"
			})**/
		
		this.compressJS({
			compress:true,
			input:[
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/jquery.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/bootstrap.min.js",
				
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/uir-all.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/ie10-viewport-bug-workaround.js",
				
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/raptor-core.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/underscore.js",
				this.R.basePath+"/src/Raptorjs/exampleNode/Resources/rux/js/backbone.js"
			],
			output: "/pakete/pre-pakete.js"
			})
	}

}

module.exports=Compress;