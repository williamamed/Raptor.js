"use strict"

var path=require('path')
var fs=require('fs')
/**
*
*
*
*/
class Compressor {

	constructor(R,bundle){
		this.R=R;
		this.bundle=bundle;
		
		
	}

	compressJS(options){
		
		if(options.compress==true)
			return Compressor._run('uglifyjs',options.input,options.output)
		else
			return Compressor._run('no-compress',options.input,options.output)
	}

	compressCSS(options){
		if(options.compress==true)
			return Compressor._run('clean-css',options.input,options.output)
		else
			return Compressor._run('no-compress',options.input,options.output)
	}

	compressExtjs(compress){
		if(this.R.bundles[this.bundle])
			this.R.ext.preCompileApp(path.join(this.R.basePath,'public','rmodules',this.R.bundles[this.bundle].path),compress)
	}

	compressBackbone(compress){
		if(this.R.bundles[this.bundle])
			this.R.backbone.preCompileApp(path.join(this.R.basePath,'public','rmodules',this.R.bundles[this.bundle].path),compress)
	}

	static _run(type,input,output,options,cb){
		
		var self=this
		var comp = require('node-minify');
		if(!options)
			options={}
		return comp.minify({
		  compressor: type,
		  publicFolder: R.basePath,
		  input: input,
		  output: R.basePath+output,
		  callback: function (err, min) {
		  	if(err)
		  		console.log(err)
		  }		
		})
		.catch(function(err){
			console.log("Compressor error:",err.message)
		});

	}

	static marker(directory,op) {
		
		fs.readdirSync(directory)
			.forEach(function(file) {
			   if (fs.statSync(path.join(directory,file)).isDirectory()) {
					Compressor.marker(path.join(directory,file),op);
			   }else {

					if(file==op.marker){
						op.directory=directory
						var comp = require('node-minify');
						op.input=op.input.map(function(val){
							
							return val.replace('./',op.directory+"/")
						})
						if(!fs.existsSync(path.dirname(path.join(directory,op.output))))
							fs.mkdirSync(path.dirname(path.join(directory,op.output)))
						comp.minify({
						  compressor: op.compressor?op.compressor:'no-compress',

						  input: op.input,
						  output: path.join(directory,op.output),
						  callback: function (err, min) {
						  	if(err)
						  		console.log(err)
						  	if(op.callback){
								op.callback(err, min)
							}
						  }
						});

					}
			   }
			   
			})
		
    }
}

module.exports=Compressor