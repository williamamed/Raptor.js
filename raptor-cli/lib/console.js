
process.env.NODE_PATH = module.paths.join(';');
//require('module').Module.globalPaths=require('module').Module.globalPaths.concat(module.paths)
require('module').Module._initPaths();

const fs = require('fs')
	, os = require('os')
	, path = require('path')
	, format = require('./format')
	, fse = require('fs-extra')

function CommanLineTool(dirname) {
	var program = require('commander')

		, self = this
		, version = require('./../package.json').version



	if (!fs.existsSync(path.join(os.homedir(), 'raptor.cli.dev'))) {
		fs.mkdirSync(path.join(os.homedir(), 'raptor.cli.dev'))
		fs.mkdirSync(path.join(os.homedir(), 'raptor.cli.dev', 'cli.development'))
	}


	this.commands = {}

	this.program = program;

	program
		.version(version)
		.usage('[opciones] [argumentos]')
		.option('-v, --version', 'Muestra la versión');



	program.on('-v', function () {
		program.version()
	})

	/**
	 * Buscando comandos en el propio directorio
	 */
	fs.readdirSync(__dirname + '/commands')
		.filter(function (file) {
			return (file.indexOf('.') !== 0) && (file !== 'index.js')
		})
		.forEach(function (file) {
			var command = null;
			try {
				command = require(__dirname + '/commands/' + file)
				if (command && !command.command && !command.action)
					throw new Error("El comando no es válido")
				if (command.disabled) {
					return;
				}
			} catch (err) {
				format.log('Error importando comando: ' + file + " " + err.message, 'blue')
				return;
			}

			
			program
				.option(command.command, command.description, function (name) {
					self.program.optiond = command.command.split(' ')[0]
					if (name instanceof Array)
						self.program.option = name.shift()
					else
						self.program.option = name

				})
			self.commands[program.options[program.options.length-1].long] = command;
		})

	var componentes = this.getModules(path.join(os.homedir(), 'raptor.cli.dev'))
		.concat(this.getScopeModules(path.join(__dirname, '..', 'node_modules', '@raptorjs')))

	if (fs.existsSync(path.join(process.cwd(), 'src')))
		componentes = componentes.concat(this.getModules(path.join(process.cwd(), 'src')))

	if (fs.existsSync(path.join(process.cwd(),  'node_modules', '@raptorjs')))
		componentes = componentes.concat(this.getScopeModules(path.join(process.cwd(), 'node_modules', '@raptorjs')))
	
	/**
	 * Bucando comandos en el proyecto
	 */
	componentes
		.forEach(function (bundle) {
			
			if (fs.existsSync(path.join(bundle.path, 'Commands')) && fs.statSync(path.join(bundle.path, 'Commands')).isDirectory())
				fs.readdirSync(path.join(bundle.path, 'Commands'))
					.filter(function (file) {
						return (file.indexOf('.') !== 0) && (file !== 'index.js')
					})
					.forEach(function (file) {

						var command = null;
						try {
							command = require(path.join(bundle.path, 'Commands', file))
							if (command && !command.command && !command.action)
								throw new Error("El comando no es válido")
							if (command.disabled) {
								return;
							}
						} catch (err) {
							format.log('Error importando comando del componente externo: ' + file + " " + err.message, 'blue')
							return;
						}
						

						program
							.option(command.command, command.description, function (name) {
								self.program.optiond = command.command.split(' ')[0]
								if (name instanceof Array)
									self.program.option = name.shift()
								else
									self.program.option = name

							})
						self.commands[program.options[program.options.length-1].long] = command;
					})
		})

}

CommanLineTool.prototype.parse = function () {
	this.program.parse(process.argv);
	//console.log(this.program.Option.toString())
	var convert=function(name){
		var segment=name.split('-')
		segment=segment.map(function(value){
			return value.charAt(0).toUpperCase() + value.slice(1);
		})
		segment=segment.join('')
		segment=segment.charAt(0).toLowerCase() + segment.slice(1);
		
		return segment;
	}
	var self=this;
	
	this.program.options.forEach(function(option){
		
		if(self.program.hasOwnProperty(convert(option.long))&&self.program[convert(option.long)]){
			var current = option.long;
			
			self.commands[current]['action'].apply(self.commands[current], [self.program.option, self.program.args, self.program])
	
		}
	})
	
}

CommanLineTool.prototype.getModules = function (location, name) {
	var components = []
	if (!fs.existsSync(location))
		return components;
	var vendors = fs.readdirSync(location)

	for (let i = 0; i < vendors.length; i++) {
		let vendor = vendors[i]
		if (fs.statSync(path.join(location, vendor)).isDirectory()) {
			let modules = fs.readdirSync(path.join(location, vendor))
				.filter(function (fileNode) {
					var sub = fileNode.substring(fileNode.length - 4);

					return (fileNode.indexOf('.') !== 0) && (fileNode !== 'index.js')
				})
			for (let j = 0; j < modules.length; j++) {

				components.push({
					name: modules[j],
					vendor: vendor,
					path: path.join(location, vendor, modules[j])
				})

			}
		}
	}
	return components
}

CommanLineTool.prototype.getScopeModules = function (location, name) {
	var components = []
	if (!fs.existsSync(location))
		return components;
	
	
	if (fs.statSync(path.join(location)).isDirectory()) {
		let modules = fs.readdirSync(path.join(location))
			.filter(function (fileNode) {
				var sub = fileNode.substring(fileNode.length - 4);

				return (fileNode.indexOf('.') !== 0) && (fileNode !== 'index.js') 
			})
		for (let j = 0; j < modules.length; j++) {

			components.push({
				name: modules[j],
				vendor: path.basename(location),
				path: path.join(location, modules[j])
			})

		}
	}

	return components
}

CommanLineTool.prototype.getProgram = function () {
	return this.program;
}

module.exports = CommanLineTool;