"use strict"

var path = require('path')
var fs = require('fs')
var fse = require('fs-extra')
/**
*
*
*
*/
class Compressor {

	constructor(R, bundle) {
		this.R = R;
		this.bundle = bundle;


	}

	compressJS(options) {

		if (options.compress == true)
			return Compressor._run('uglifyjs', options.input, options.output)
		else
			return Compressor._run('no-compress', options.input, options.output)
	}

	compressCSS(options) {
		if (options.compress == true)
			return Compressor._run('clean-css', options.input, options.output)
		else
			return Compressor._run('no-compress', options.input, options.output)
	}

	compressExtjs(compress) {
		if (this.R.bundles[this.bundle])
			this.R.ext.preCompileApp(path.join(this.R.basePath, 'public', 'rmodules', this.R.bundles[this.bundle].path), compress)
	}

	compressBackbone(compress) {
		if (this.R.bundles[this.bundle])
			this.R.backbone.preCompileApp(path.join(this.R.basePath, 'public', 'rmodules', this.R.bundles[this.bundle].path), compress)
	}

	static _run(type, input, output, options, cb) {

		var self = this
		var comp = require('node-minify');
		if (!options)
			options = {}
		return comp.minify({
			compressor: type,
			publicFolder: R.basePath,
			input: input,
			output: R.basePath + output,
			callback: function (err, min) {
				if (err)
					console.log(err)
			}
		})
			.catch(function (err) {
				console.log("Compressor error:", err.message)
			});

	}

	/**
	 * 
	 * @param {*} directory 
	 * @param {*} op 
	 */
	static marker(directory, op) {

		fs.readdirSync(directory)
			.forEach(function (file) {
				if (fs.statSync(path.join(directory, file)).isDirectory()) {
					Compressor.marker(path.join(directory, file), op);
				} else {

					if (file == op.marker) {

						var comp = require('node-minify');
						var input = op.input.map(function (val) {

							return val.replace('./', directory + "/")
						})

						if (!fs.existsSync(path.dirname(path.join(directory, op.output))))
							fs.mkdirSync(path.dirname(path.join(directory, op.output)))
						comp.minify({
							compressor: op.compressor ? op.compressor : 'no-compress',

							input: input,

							output: path.join(directory, op.output),
							callback: function (err, min) {
								if (err)
									console.log(err)
								if (op.callback) {
									op.callback(err, min, directory)
								}
							}
						});

					}
				}

			})

	}

	/**
	 * Expone un Middleware para correr las aplicaciones Extjs en modo debug
	 * @param {*} op 
	 */
	static serve(op) {

		R.app.use('/public/', function (req, res, next) {
			let rel = req.url.split('/')
			
			if (rel.length > 2 && R.bundles[rel[2]]) {
				rel.shift()
				rel.shift()
				var cmp = rel.shift()

				var file = path.join(R.bundles[cmp].absolutePath, 'Resources', rel.join('/'));
				var directory=path.join(path.dirname(file));
				if (fs.existsSync(path.join(directory,op.marker))) {
					
					var comp = require('node-minify');
					var input = op.input.map(function (val) {

						return val.replace('./', directory + "/")
					})
					
					comp.minify({
						compressor: op.compressor ? op.compressor : 'no-compress',
						output: path.join(R.basePath,'cache','compress.js'),
						sync: true,
						input: input,
						callback: function (err, min) {
							if (err) {
								
								next(err)
							} else {
								res.end(min)
							}
							if (op.callback) {
								op.callback(err, min, directory)
							}

						}
					})
					.catch(function(err){
						next(err)
					})
					return;
				} else {
					
				}
			}

			next()
			
		});
		
	}
}

module.exports = Compressor