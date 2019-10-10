'use strict'
var fs = require('fs')
var path = require('path')
const fse = require('fs-extra')
const chokidar = require('chokidar')
const os = require('os')
const format = require('./../format')
const mod = require('./../modules')

module.exports = {
	command: 'run [verbose] [argumentos]',
	description: 'Corre el proyecto',
	action: function (not, value, arg) {

		var outputFirst = require('check-dependencies').sync({
			packageDir: process.cwd()
		});
		if (outputFirst.status != 0) {
			format.log("Nuevas dependencias detectadas en package.json, instalando las dependencias desde la caché o el NPM", "blue")
			var output = require('check-dependencies').sync({
				install: true,
				packageDir: process.cwd()
			});
			if (output.status != 0) {
				format.log("Se detectaron nuevas dependencias pero no se pudieron instalar, verifique su conexión y teclee el comando npm install en el directorio del proyecto.", "yellow")
				output.error.forEach(function (value) {
					console.log(value)
				})
				return;
			} else {
				output.log.forEach(function (value) {
					console.log(value)
				})
				format.log("Hecho", "blue")
			}
		}

		var self = this;
		value.push(not)
		if (value)
			value.forEach(function (val) {
				if (val == 'verbose')
					self.verbose = true
			})
		if (self.verbose)
			console.log("Mode verbose activado")
		require('nodemon/lib/monitor/match')

		if (!fs.existsSync(path.join(process.cwd(), 'run.app.js'))
			|| !fs.existsSync(path.join(process.cwd(), 'config/options.json'))
			|| !fs.existsSync(path.join(process.cwd(), 'public'))) {
			console.log(format.get('Lo siento, no se encontró una aplicación Raptor.js válida en el directorio actual', format.YELLOW));
			console.log('Utilice el comando rap create <nombre> para crear un proyecto nuevo de Raptor.js 2')
			return;
		}

		if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
			fs.mkdirSync(path.join(process.cwd(), 'public'))
		}

		var rules = require.cache[require.resolve('nodemon/lib/monitor/match')].exports.rulesToMonitor
		var m = require.cache[require.resolve('nodemon/lib/monitor/match')].exports;
		require.cache[require.resolve('nodemon/lib/monitor/match')].exports = function match(files) {

			var files = m.apply(this, arguments)
			if (fs.existsSync(path.join(process.cwd(), 'cache', 'nodemon.lock')))
				return {
					result: []
				}
			else
				return files;
		}
		require.cache[require.resolve('nodemon/lib/monitor/match')].exports.rulesToMonitor = rules;


		console.log(format.get('Cargando y configurando núcleo Raptor.js', format.YELLOW));


		try {
			var R = require(path.join(process.cwd(), 'bootstrap')).getClass()

			R.main(process.cwd());
			R.readConfig();
		} catch (e) {
			console.log(format.get(e.message, format.RED));
			if (e.code == 'MODULE_NOT_FOUND')
				console.log("Este error esta relacionado a una dependencia no instalada requerida por el core de Raptor.js, utilice el comando npm install para cargar las dependencias o descargue manualmente el paquete node_modules de Raptor.js.")
			return;
		}

		console.log(format.get('Hecho!', format.GREEN));
		this.R = R;


		var nodemon = require('nodemon');
		//console.log(format.get('Copiando recursos en la primera sesión de trabajo', format.YELLOW));

		if (!fs.existsSync(path.join(os.homedir(), 'raptor.cli.json')))
			fs.writeFileSync(path.join(os.homedir(), 'raptor.cli.json'), '{}');
		var config = require(path.join(os.homedir(), 'raptor.cli.json'))

		var modulesSrc = mod.getComponents(path.join(process.cwd(), 'src'))
		var modules = modulesSrc.concat(mod.getComponents(path.join(os.homedir(), 'raptor.cli.dev')))

		/**for (let i = 0; i < modules.length; i++) {
			console.log(format.get('Copiando recursos web hacia public: ' + modules[i].name, format.BLUE));
			R.copyResources(modules[i].name, true)
		}

		console.log(format.get('Hecho!', format.GREEN));*/

		var ignore = ["*/Resources/*"]
		if (R.options.ignore && R.options.ignore.length)
			ignore = ignore.concat(R.options.ignore)



		//self.syncResources(modulesSrc)
		//self.watchManifest(modulesSrc)

		if (config.RAPTOR_DEV_EXTERNAL_COMPONENTS) {
			config.RAPTOR_DEV_EXTERNAL_COMPONENTS = config.RAPTOR_DEV_EXTERNAL_COMPONENTS = [
				path.join(os.homedir(), 'raptor.cli.dev')

			].concat(config.RAPTOR_DEV_EXTERNAL_COMPONENTS.split(','))
		} else
			config.RAPTOR_DEV_EXTERNAL_COMPONENTS = [
				path.join(os.homedir(), 'raptor.cli.dev')
			]
		config.RAPTOR_MODE = 'development';
		/**try {
			config.RAPTOR_SCOPES = [path.join(require.resolve('@raptorjs/raptor-panel'), '..', '..')]
		} catch (error) {

		}*/

		var conf = {
			script: "run.app.js",
			ignoreRoot: ['.git', '.nyc_output', '.sass-cache', 'bower_components', 'coverage'],
			ignore: ignore,
			verbose: true,
			cwd: process.cwd(),
			args: process.argv.slice(3),
			env: config,
			watch: ['src/', 'config/'],
		}

		var nodeInstance = nodemon(conf)
			.on('start', function () {
				console.log(format.get('Iniciando la aplicación', format.YELLOW));

			}).on('quit', function () {

				console.log(format.get('Aplicación Raptor.js terminada.', format.GREEN));
			}).on('crash', function () {
				console.log(format.get('El script fue interrumpido por un error...', format.RED));
			}).on('restart', function () {

				console.log(format.get('Reiniciando la aplicación Raptor.js', format.YELLOW));


				if (require.cache[path.join(process.cwd(), 'package.json')])
					delete require.cache[path.join(process.cwd(), 'package.json')];

				var outputFirst = require('check-dependencies').sync({
					packageDir: process.cwd()
				});
				if (outputFirst.status != 0) {
					format.log("Terminando aplicación para instalar nuevas dependencias", 'yellow')
					nodeInstance.emit('quit', 0)
					format.log("Nuevas dependencias detectadas en package.json, instalando las dependencias desde la caché o el NPM", "blue")
					var output = require('check-dependencies').sync({
						install: true,
						packageDir: process.cwd()
					});
					if (output.status != 0) {
						format.log("Se detectaron nuevas dependencias pero no se pudieron instalar, verifique su conexión y teclee el comando npm install en el directorio del proyecto.", "yellow")
						output.error.forEach(function (value) {
							console.log(value)
						})
						process.exit()
						return;
					} else {
						output.log.forEach(function (value) {
							console.log(value)
						})
						format.log("Hecho", "blue")
						nodeInstance.restart()
					}
				}
			});
	},

	runPanel: function () {
		process.env.NODE_PATH = module.paths.join(';');
		require('module').Module._initPaths();

		var Raptor = require(path.join(process.cwd(), 'bootstrap')).getClass()

		var basedir = process.cwd();
		
		Raptor.main(basedir);

		Raptor.options.port=4441;

		if (Raptor.options.mode == 'development')
			console.log('panel corriendo');
		else
			console.log('panel corriendo');

		Raptor.start()
	},

	print: function (msg) {
		if (this.verbose) {
			console.log(format.get('raptor-cli:', format.YELLOW), msg)
		}
	},
	/**
	 * Syncronizar recursos de src
	 * @TODO sincronizar tambien recursos externos
	 */
	syncResources: function (modules) {
		var base = process.cwd()
		var publicBase = path.join(base, 'public', 'rmodules')

		var self = this;
		console.log(format.get('Escuchando cambios en los recursos web (Resources)...', format.YELLOW));
		for (var i = 0; i < modules.length; i++) {


			let relativePath = path.join(modules[i].vendor, modules[i].name);
			let bundle = modules[i];
			self.R.Compressor.markers.execute(path.join(bundle.path, 'Resources'))
			chokidar.watch(path.join(bundle.path, 'Resources'), { persistent: true, ignoreInitial: true, ignored: /[\/\\]\./, depth: 99 })
				.on('all', (event, route) => {
					try {
						/**if (event == 'unlink') {
							self.print("Borrando archivo en " + path.join(publicBase, relativePath, route.split('Resources')[1]))
							fse.removeSync(path.join(publicBase, relativePath, route.split('Resources')[1]));
						}
						if (event == 'add') {
							self.print("Copiando archivo en " + path.join(publicBase, relativePath, route.split('Resources')[1]))
							fse.copySync(route, path.join(publicBase, relativePath, route.split('Resources')[1]));
						}
						if (event == 'change') {
							self.print("Modificado archivo en " + path.join(publicBase, relativePath, route.split('Resources')[1]))
							fse.removeSync(path.join(publicBase, relativePath, route.split('Resources')[1]));
							fse.copySync(route, path.join(publicBase, relativePath, route.split('Resources')[1]));
						}
						self.print("Ejecutando precompiladores en " + path.join(base, 'public', 'rmodules', relativePath));
						self.R.extjs.preCompileApp(path.join(base, 'public', 'rmodules', relativePath))*/
						//self.R.Compressor.markers.execute(path.join(bundle.path, 'Resources'))
						self.print("Modificado " + path.join(publicBase, relativePath, route.split('Resources')[1]))

						self.print("Ejecutados " + self.R.Compressor.markers.length + " precompiladores")
					} catch (error) {
						format.log("raptor-cli autopublish: Error " + error.message, 'red')
					}


					let bundleName = bundle.name;
					if (true) {
						if (fs.existsSync(path.join(base, 'src', relativePath, 'Compressor', 'Compress.js'))) {
							self.R.bundles[bundleName].compressor = require(path.join(base, 'src', relativePath, 'Compressor', 'Compress.js'))
						} else {
							self.R.bundles[bundleName].compressor = true
						}
					}

					if (typeof self.R.bundles[bundleName].compressor != 'boolean') {
						let Compressor = self.R.bundles[bundleName].compressor

						if (Compressor) {

							var compressor = new Compressor(R, bundleName);
							if (compressor.run)
								try {
									compressor.run()
								} catch (error) {
									format.log("raptor-cli, auto-compress warning: " + error.message, "yellow")
								}

						}
					}

					self.print("Hecho!")
				});

		}
	},

	/**
	 * 
	 */
	watchManifest: function (modules) {
		var base = process.cwd()

		for (var i = 0; i < modules.length; i++) {

			let relativePath = path.join(modules[i].vendor, modules[i].name);
			let bundle = modules[i];

			chokidar.watch(path.join(bundle.path, 'manifest.json'), { persistent: true, ignoreInitial: true, ignored: /[\/\\]\./, depth: 99 })
				.on('all', (event, route) => {
					var pkg = JSON.parse(fs.readFileSync(path.join(base, 'package.json')));
					pkg.dependencies['kkoko'] = "1.2.6"
					fs.writeFileSync(path.join(base, 'package.json'), JSON.stringify(pkg, null, 1))
					console.log(route, 'cambiado')
				});

		}

	}

}