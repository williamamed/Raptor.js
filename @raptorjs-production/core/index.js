'use strict';
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cors = require('cors')

if (global.$i)
	$i('CsrfFilter', [])

/**
 * Raptor.js - Node framework
 * Generado por Raptor.js
 * 
 * @Route("")
 */
class CoreNode {

	static getClass() {
		return require('@raptorjs/core/Source/Raptor');
	}

	

	/**
	 * @Event("ready")
	 * @Injectable
	 */
	onReady(Options) {
		if (Options.mode == 'development') {
			var DevData = require('./Source/DevData');
			new DevData()
				.init()
		}
	}

	/**
	 * Raptor.js - Node framework
	 * 
	 * 
	 * se ejecuta luego que son adicionados los elementos
	 * del framework al stack de express
	 * 
	 * @param Raptor R instancia de la aplicacion Raptor
	 *
	 */
	middleware() {

	}

	/**
	 * Raptor.js - Node framework
	 * 
	 * Entrada de configuracion del componente
	 * se ejecuta cuando se registran los componentes
	 * 
	 * @param Raptor R instancia de la aplicacion Raptor
	 *
	 */
	configure(express, Events, AnnotationFramework, AnnotationReaderCache, SessionFilter, CsrfFilter) {

		//AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Source', 'Annotation', 'Route'))
		//AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'SessionFilter'))
		//AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Csrf'))
		//AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Cors'))
		//AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Inyectable'))
		AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Controller'))

		$i('RecurseUp', this.recurseUp)

		var regManager = require('./Annotations/RegisterManager')
		regManager.createRoute();
		regManager.createCsrf();
		regManager.createCors();
		regManager.createSessionFilter();

		Events.register({

			/**
			 * Lectura de anotaciones SessionFilter en clases
			 */
			'annotation:read.definition.SessionFilter2': function (type, annotation) {

				var route = AnnotationReaderCache.getDefinition('Route', annotation.filePath, annotation.target);
				if (route) {
					if (route.value && route.value[route.value.length - 1] != '/')
						SessionFilter.push(route.value + '/*')
					else
						SessionFilter.push(route.value.substring(0, route.value.length - 1) + '/*')
				}
			},
			/**
			 * Lectura de anotaciones SessionFilter en metodos
			 */
			'annotation:read.method.SessionFilter2': function (type, annotation) {

				var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);

				if (route) {
					var comp = AnnotationReaderCache.getDefinition('Route', path.join(annotation.filePath.split('Controller')[0], 'index.js'));

					var prefix = comp ? comp.value : '';
					var own = AnnotationReaderCache.getDefinition('Route', annotation.filePath)
					var prefixController = own ? own.value : '';
					prefix += prefixController;
					SessionFilter.push(prefix + route.value)
				}
			},
			/**
			 * Lectura de anotaciones Csrf en clases
			 */
			'annotation:read.definition.Csrf2': function (type, annotation) {

				var route = AnnotationReaderCache.getDefinition('Route', annotation.filePath, annotation.target);
				if (route) {
					if (route.value && route.value[route.value.length - 1] != '/')
						CsrfFilter.push(route.value + '/*')
					else
						CsrfFilter.push(route.value.substring(0, route.value.length - 1) + '/*')
				}
			},
			/**
			 * Lectura de anotaciones Csrf en metodos
			 */
			'annotation:read.method.Csrf2': function (type, annotation) {

				var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
				if (route) {
					var comp = AnnotationReaderCache.getDefinition('Route', path.join(annotation.filePath.split('Controller')[0], 'index.js'));

					var prefix = comp ? comp.value : '';
					var own = AnnotationReaderCache.getDefinition('Route', annotation.filePath)
					var prefixController = own ? own.value : '';
					prefix += prefixController;
					CsrfFilter.push(prefix + route.value)
				}
			},
			/**
			 * Lectura de anotaciones Cors en clases
			 */
			'annotation:read.definition.Cors2': function (type, annotation) {

				var route = AnnotationReaderCache.getDefinition('Route', annotation.filePath, annotation.target);
				if (route) {
					if (!route.before)
						route.before = [annotation.value ? cors(annotation.value) : cors()]
					else
						route.before.unshift(annotation.value ? cors(annotation.value) : cors())
				}
			},
			/**
			 * Lectura de anotaciones Cors en metodos
			 */
			'annotation:read.method.Cors2': function (type, annotation) {
				const route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);

				if (!route.before)
					route.before = [annotation.value ? cors(annotation.value) : cors()]
				else
					route.before.unshift(annotation.value ? cors(annotation.value) : cors())
			},
			/**
			 * Funcionalidad para hacer bypass con CSRF
			 */
			'before:middleware': function (type, annotation) {
				express.use(function (req, res, next) {
					if (req._tamper_method)
						req.method = req._tamper_method
					next()
				})
			},
			/**
			 * Lectura de anotaciones Route en clases
			 */
			'annotation:read.definition.Route': function (type, annotation) {

			},
			/**
			 * Lectura de anotaciones Route en metodos
			 */
			'annotation:read.method.Route': function (type, annotation) {

			},
			/**
			 * Evento para leer las Anotaciones en index.js
			 * 
			 */
			'after:configure': function () {
				for (const key in R.bundles) {

					let bundle = R.bundles[key];
					delete require.cache[path.join(bundle.absolutePath,'index.js')];
					require(path.join(bundle.absolutePath,'index.js'))
					/**$injector.invoke(function (Annotations, AnnotationReaderCache) {

						var reader = new Annotations.Reader(AnnotationFramework.registry, bundle.instance);
						reader.parse(path.join(bundle.absolutePath, 'index.js'));

					})*/
				}


			},

			/**
			 * Evento para leer las Anotaciones Route en Controladores
			 * 
			 */
			'init:controller': $i.later(function (instance, controllerPath, bundle, Annotations) {
				return;
				var reader = new Annotations.Reader(AnnotationFramework.registry, instance);
				reader.parse(controllerPath);
				var comp = AnnotationReaderCache.getDefinition('Route', path.join(bundle.absolutePath, 'index.js'));

				var routes = {}

				var prefix = comp ? comp.value : '';

				var own = AnnotationReaderCache.getDefinition('Route', controllerPath)
				var prefixController = own ? own.value : '';
				prefix += prefixController;
				var scope = instance;

				if (instance instanceof R.Controller) {

				} else {

					return;
				}
				AnnotationReaderCache.getMethods('Route', controllerPath)
					.forEach(function (annotation) {
						//console.log(annotation.before,annotation.value)
						if (own) {
							annotation.before = annotation.before ? annotation.before : []
							own.before = own.before ? own.before : []
							annotation.before = own.before.concat(annotation.before)

							annotation.after = annotation.after ? annotation.after : []
							own.after = own.after ? own.after : []
							annotation.after = own.after.concat(annotation.after)
						}

						if (comp) {
							annotation.before = annotation.before ? annotation.before : []
							comp.before = comp.before ? comp.before : []
							annotation.before = comp.before.concat(annotation.before)

							annotation.after = annotation.after ? annotation.after : []
							comp.after = comp.after ? comp.after : []
							annotation.after = comp.after.concat(annotation.after)
						}

						if (annotation.method)
							routes[prefix + annotation.value] = {
								method: annotation.method,
								action: scope ? scope[annotation.target] : annotation.target,
								before: annotation.before,
								after: annotation.after
							}
						else
							routes[prefix + annotation.value] = {
								method: 'all',
								action: scope ? scope[annotation.target] : annotation.target,
								before: annotation.before,
								after: annotation.after
							}

					})
				if (Object.keys(routes).length > 0) {

					instance.routes(routes);

					R.emit('routes:' + bundle.name + '.' + instance.name, instance, controllerPath, bundle)
					R.emit('routes:controller', instance, controllerPath, bundle)

				}

			})
		})

		/**
		 * Middleware para hacer un bypass en el 
		 * CSRF segun el CsrfFilter 
		 */
		express.use(function (req, res, next) {
			var filter = CsrfFilter ? CsrfFilter : []
			var find = false;

			for (let index = 0; index < filter.length; index++) {
				const element = filter[index];

				if (new RegExp(element).test(req.url)) {
					req._tamper_method = req.method
					req.method = "GET"
					break;
				}
			}

			next()
		})

		express.use(function (req, res, next) {

			res.show = function (text, code, params) {
				if (!code)
					code = 1;
				if (typeof params != 'object' || !params)
					params = {};

				if (typeof code == 'object') {
					params = code;
					code = 1;
				}
				res.json({
					msg: text,
					code: code,
					success: true,
					params: params
				})
			}

			res.showGeneric = function (text, code, params) {
				if (!code)
					code = 1;
				if (typeof params != 'object' || !params)
					params = {};

				if (typeof code == 'object') {
					params = code;
					code = 1;
				}

				var accept = req.headers.accept || '';
				if (~accept.indexOf('html')) {
					res.render($injector('TemplateBasic'), { msg: "Code: " + code + ", " + text })

					// json
				} else if (~accept.indexOf('json')) {
					res.json({
						msg: text,
						code: code,
						success: true,
						params: params
					})
					// plain text
				} else {
					res.setHeader('Content-Type', 'text/plain');
					res.end("Code: " + code + ", " + text);
				}

			}
			var bundles = {}
			for (const key in R.bundles) {
				bundles[key] = '/public/' + R.bundles[key].vendor + '/' + R.bundles[key].name;
			}
			req.viewPlugin.set('raptor_client', {
				name: 'public',
				callback: R.template('core:functions/public.ejs', {
					bundles: JSON.stringify(bundles)
				})
			})

			next()
		})

	}

	recurseUp(filePath) {
		if (fs.existsSync(path.join(path.dirname(filePath), 'manifest.json'))) {
			return path.join(path.dirname(filePath), 'index.json');
		} else {

			return $i('RecurseUp')(path.dirname(filePath));
		}
	}


}
module.exports = CoreNode