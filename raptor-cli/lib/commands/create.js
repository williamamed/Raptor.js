'use strict'
var fs = require('fs')
var path = require('path')
const fse = require('fs-extra')
const format = require('./../format')

module.exports = {
	command: 'create <nombre>',
	description: 'Crea un proyecto Raptor.js en el directorio actual',
	action: function (nombre, argument, command) {
		if (!nombre) {
			console.log(" ")
			console.log("Comando inválido, la opción <nombre> es obligatoria: rap create <nombre> [ install | install-local ]")
			console.log(" ")
			return;
		}
		var currentDir = process.cwd()

		if (fs.existsSync(path.join(currentDir, 'src')) && fs.existsSync(path.join(currentDir, 'config', 'options.json'))) {
			var readline = require('readline'),
				rl = readline.createInterface(process.stdin, process.stdout),
				self = this;

			format.log("Estas tratando de crear un proyecto nuevo en uno existente, si continuas perderás los cambios del proyecto actual", "yellow")
			console.log('¿Deseas continuar? si/no');
			rl.setPrompt('>');
			rl.prompt();
			rl.on('line', function (line) {
				var name = line.trim();
				if (name.toLowerCase() == 'si' || name.toLowerCase() == 's') {
					self.create_v2(nombre, argument, command)
					rl.close()
				} else
					if (name.toLowerCase() == 'no' || name.toLowerCase() == 'n') {
						rl.close()
					} else
						rl.prompt();

			})
		} else
			this.create_v2(nombre, argument, command)


		return true;
	},

	create_v2: function (nombre, argument, command) {
		var admZip = require('adm-zip')
		var currentDir = process.cwd()
		format.log("Creando proyecto Raptor.js", "green")
		console.log("Creando directorio public")
		//var zipWww = new admZip(path.join(__dirname, '..', 'source', 'public.zip'))
		//zipWww.extractAllTo(path.join(currentDir, 'public'))
		if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
			fs.mkdirSync(path.join(process.cwd(), 'public'))
		}
		format.log("Hecho!!", "yellow")

		console.log("Creando directorio src")
		if (!fs.existsSync(path.join(process.cwd(), 'src'))) {
			fs.mkdirSync(path.join(process.cwd(), 'src'))
		}
		//var zipWww = new admZip(path.join(__dirname, '..', 'source', 'src.zip'))
		//zipWww.extractAllTo(path.join(currentDir, 'src'))
		format.log("Hecho!!", "yellow")

		console.log("Copiando directorio config")
		if (!fs.existsSync(path.join(currentDir, 'config')))
			fs.mkdirSync(path.join(currentDir, 'config'))
		format.log("Hecho!!", "yellow")
		console.log("Creando options.json")
		fse.copySync(path.join(__dirname, '..', 'source', 'options.json'), path.join(currentDir, 'config', 'options.json'))
		format.log("Hecho!!", "yellow")

		console.log("Creando options.prod.json")
		fse.copySync(path.join(__dirname, '..', 'source', 'options.prod.json'), path.join(currentDir, 'config', 'options.prod.json'))
		format.log("Hecho!!", "yellow")

		console.log("Creando run.app.js")
		fse.copySync(path.join(__dirname, '..', 'source', 'run.app.js'), path.join(currentDir, 'run.app.js'))
		format.log("Hecho!!", "yellow")

		console.log("Creando bootstrap.js")
		fse.copySync(path.join(__dirname, '..', 'source', 'bootstrap.js'), path.join(currentDir, 'bootstrap.js'))
		format.log("Hecho!!", "yellow")
		
		var template = require(path.join(__dirname, '..', 'source', 'template.package.json'))
		if (!fs.existsSync(path.join(currentDir, 'package.json'))) {
			console.log("Creando package.json")

			template.name = nombre;
			fs.writeFileSync(path.join(currentDir, 'package.json'), JSON.stringify(template, null, 2))
		} else {
			console.log("Actualizando package.json")
			var originalPackage = require(path.join(currentDir, 'package.json'));
			for (const key in template.dependencies) {
				const element = template.dependencies[key];
				originalPackage.dependencies[key]=element;
			}
			//originalPackage.dependencies = template.dependencies;
			fs.writeFileSync(path.join(currentDir, 'package.json'), JSON.stringify(originalPackage, null, 2));
		}
		format.log("Hecho!!", "yellow")

		console.log("Creando archivo README.md")
		fse.copySync(path.join(__dirname, '..', 'source', 'README.md'), path.join(currentDir, 'README.md'))
		format.log("Hecho!!", "yellow")

		format.log("La estructura y fuentes del proyecto fueron creadas correctamente", "yellow")

		format.log("Instalando las dependencias desde la caché o el NPM", "blue")

		require('check-dependencies')({
			install: true,
			packageDir: currentDir
		})
			.then(function (output) {
				/* handle output */

				if (output.status == 0)
					format.log("El proyecto fue creado correctamente (Instalación completa), utilice el comando rap run para comenzar.", "green")
				else {
					format.log("El proyecto fue creado pero no se pudieron descargar las dependencias, verifique su conexión y teclee el comando npm install en el directorio del proyecto.", "yellow")
					output.error.forEach(function (value) {
						console.log(value)
					})
				}
			});
		
	},


	create: function (nombre, argument, command) {
		var admZip = require('adm-zip')
		var currentDir = process.cwd()
		format.log("Creando proyecto Raptor.js", "green")
		console.log("Copiando directorio public")
		var zipWww = new admZip(path.join(__dirname, '..', 'source', 'public.zip'))
		zipWww.extractAllTo(path.join(currentDir, 'public'))
		if (!fs.existsSync(path.join(process.cwd(), 'public', 'rmodules'))) {
			fs.mkdirSync(path.join(process.cwd(), 'public', 'rmodules'))
		}
		format.log("Hecho!!", "yellow")

		console.log("Copiando directorio src")
		var zipWww = new admZip(path.join(__dirname, '..', 'source', 'src.zip'))
		zipWww.extractAllTo(path.join(currentDir, 'src'))
		format.log("Hecho!!", "yellow")

		console.log("Copiando directorio config")
		if (!fs.existsSync(path.join(currentDir, 'config')))
			fs.mkdirSync(path.join(currentDir, 'config'))
		console.log("Creando options.json")
		fse.copySync(path.join(__dirname, '..', 'source', 'options.json'), path.join(currentDir, 'config', 'options.json'))
		format.log("Hecho!!", "yellow")

		console.log("Creando options.prod.json")
		fse.copySync(path.join(__dirname, '..', 'source', 'options.prod.json'), path.join(currentDir, 'config', 'options.prod.json'))
		format.log("Hecho!!", "yellow")

		console.log("Creando run.app.js")

		fse.copySync(path.join(__dirname, '..', 'source', 'run.app.js'), path.join(currentDir, 'run.app.js'))
		format.log("Hecho!!", "yellow")

		var template = require(path.join(__dirname, '..', 'source', 'template.package.json'))
		if (!fs.existsSync(path.join(currentDir, 'package.json'))) {
			console.log("Creando package.json")

			template.name = nombre;
			fs.writeFileSync(path.join(currentDir, 'package.json'), JSON.stringify(template, null, 2))
		} else {
			console.log("Actualizando package.json")
			var originalPackage = require(path.join(currentDir, 'package.json'));

			originalPackage.dependencies = template.dependencies;
			fs.writeFileSync(path.join(currentDir, 'package.json'), JSON.stringify(originalPackage, null, 2));
		}
		format.log("Hecho!!", "yellow")

		console.log("Creando archivo README.md")
		fse.copySync(path.join(__dirname, '..', 'source', 'README.md'), path.join(currentDir, 'README.md'))
		format.log("Hecho!!", "yellow")

		format.log("La estructura y fuentes del proyecto fueron creadas correctamente", "yellow")
		/**
		 * Instalar desde el NPM o cache
		 */
		if (argument[0] == 'install') {
			format.log("Adicionalmente instalaremos las dependencias desde la caché o el NPM", "blue")

			var ls = require('child_process').spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install', '--cache-min=9999'], {
				stdio: 'inherit',
				cwd: process.cwd()
			})
			ls.on('exit', function (code) {
				if (code == 0)
					format.log("El proyecto fue creado correctamente (Instalación completa), utilice el comando rap run para comenzar.", "green")
				else {
					format.log("El proyecto fue creado pero no se pudieron descargar las dependencias, verifique su conexión y teclee el comando npm install en el directorio del proyecto.", "yellow")
					console.log("Puede adicionalmente descargar el paquete de dependencias node_modules de forma manual y copiarlo en el proyecto, contacte con el dueño de este paquete.")
				}

			})
		}

		/**
		 * Instalar desde este propio paquete
		 */
		if (argument[0] == 'install-offline') {
			format.log("Instalaremos las dependencias precargadas desde el paquete raptor-cli", "blue")


			if (fs.existsSync(path.join(__dirname, '..', 'source', 'node_modules.zip'))) {
				console.log("Extrayendo node_modules")
				var zipWww = new admZip(path.join(__dirname, '..', 'source', 'node_modules.zip'))
				zipWww.extractAllTo(path.join(currentDir))
				format.log("Hecho!!", "yellow")
			} else {
				format.log("Error: No se pudo instalar las dependencias desde el paquete, esta versión de raptor-cli no trae incluida las dependencias precargadas.", "yellow")
				console.log("Este error ocurrió porque está usando la versión de raptor-cli del npm, mejor utilice la opción create install para crear un proyecto con las dependencias desde el NPM.")
			}

		}

		if (!argument.length) {
			//format.log("El proyecto fue creado correctamente (Sin dependencias), utilice el comando npm install en el directorio del proyecto para instalar las dependencias.", "green")
			//console.log("Puede adicionalmente descargar el paquete de dependencias node_modules de forma manual y copiarlo en el proyecto, contacte con el dueño de este paquete.")
			format.log("Adicionalmente instalaremos las dependencias desde la caché o el NPM", "blue")

			var ls = require('child_process').spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install', '--cache-min=9999'], {
				stdio: 'inherit',
				cwd: process.cwd()
			})
			ls.on('exit', function (code) {
				if (code == 0)
					format.log("El proyecto fue creado correctamente (Instalación completa), utilice el comando rap run para comenzar.", "green")
				else {
					format.log("El proyecto fue creado pero no se pudieron descargar las dependencias, verifique su conexión y teclee el comando npm install en el directorio del proyecto.", "yellow")
					console.log("Puede adicionalmente descargar el paquete de dependencias node_modules de forma manual y copiarlo en el proyecto, contacte con el dueño de este paquete.")
				}

			})
		}
	},

	print: function (msg) {
		if (this.verbose) {
			console.log(this.format.get('raptor-cli:', this.format.YELLOW), msg)
		}
	}

}