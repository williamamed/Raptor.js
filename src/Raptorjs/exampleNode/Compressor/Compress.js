"use strict"
var Compressor=require('raptorjs').Compressor;

class Compress extends Compressor{
	/**
	*
	*
	*/
	run(R,compressor){

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