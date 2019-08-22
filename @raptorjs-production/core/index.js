'use strict';
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cors = require('cors')

if(global.$i)
	$i('CsrfFilter', [])

/**
 * Raptor.js - Node framework
 * Generado por Raptor.js
 * 
 * @Route("")
 */
class CoreNode {

	static getClass(){
		return require('@raptorjs/core/Source/Raptor');
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
		
		AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Source', 'Annotation', 'Route'))
		AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'SessionFilter'))
		AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Csrf'))
		AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Cors'))


		Events.register({
			
			/**
			 * Lectura de anotaciones SessionFilter en clases
			 */
			'annotation:read.definition.SessionFilter': function (type, annotation) {

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
			'annotation:read.method.SessionFilter': function (type, annotation) {

				var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
				if (route) {
					var comp = AnnotationReaderCache.getDefinition('Route', path.join(annotation.filePath, '..', '..', 'index.js'));

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
			'annotation:read.definition.Csrf': function (type, annotation) {

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
			'annotation:read.method.Csrf': function (type, annotation) {

				var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
				if (route) {
					var comp = AnnotationReaderCache.getDefinition('Route', path.join(annotation.filePath, '..', '..', 'index.js'));

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
			'annotation:read.definition.Cors': function (type, annotation) {

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
			'annotation:read.method.Cors': function (type, annotation) {
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
			'after:invoke.configure': $injector.invokeLater(function (bundle, Annotations, AnnotationReaderCache) {
				var reader = new Annotations.Reader(AnnotationFramework.registry,bundle.instance);
				reader.parse(path.join(bundle.absolutePath, 'index.js'));
			}),

			/**
			 * Evento para leer las Anotaciones Route en Controladores
			 * 
			 */
			'init:controller': $i.later(function (instance, controllerPath, bundle, Annotations) {
				var reader = new Annotations.Reader(AnnotationFramework.registry, instance);
				reader.parse(controllerPath);
				var comp = AnnotationReaderCache.getDefinition('Route', path.join(controllerPath, '..', '..', 'index.js'));

				var routes = {}

				var prefix = comp ? comp.value : '';
				var own = AnnotationReaderCache.getDefinition('Route', controllerPath)
				var prefixController = own ? own.value : '';
				prefix += prefixController;
				var scope = instance;

				AnnotationReaderCache.getMethods('Route', controllerPath)
					.forEach(function (annotation) {
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
			var bundles={}
			for (const key in R.bundles) {
				bundles[key]='/public/'+R.bundles[key].vendor+'/'+R.bundles[key].name;
			}
			req.viewPlugin.set('raptor_client',{
				name:'public',
				callback: R.template('core:functions/public.ejs',{
					bundles: JSON.stringify(bundles)
				})
			})

			next()
		})

	}


}
module.exports = CoreNode