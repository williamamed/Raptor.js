
'use strict';
var fs = require('fs')
var path = require('path')
/*
* Raptor.js - Node framework
* Generado por Raptor.js
* 
*
*/
class TroodonNode {

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
	middleware(R) {

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
	configure(R, SecurityRegistry, Events, express, AnnotationFramework) {

		var self = this;

		Events
			.register({
				/**
				 * Control de excepciones personalizadas para Troodon
				 */
				'config:error.middleware': function () {
					express.use(function (err, req, res, next) {
						req.logger.error(err.toString())
						if (/^\/troodon\/*/.test(req.url)) {
							if (err.code && err.code == "TroodonError") {
								res.show(err.message, 3)
							} else {
								res.show(req.lang('operation_error'), 3)
							}
						} else {
							if (err.code && err.code == "TroodonError") {
								next(err.message)
							} else {
								next(err)
							}
						}
					})
				},
				/**
				 * Registrar en controlador de seguridad
				 * el manejedor con su logica
				 */
				'before:middleware': function () {

					SecurityRegistry
						.register('Troodon')
						.setLogin('/troodon([\/\w*]*)?', 'TroodonNode:auth')
						.setAuthentication(function (req, username, password, done) {

							R.getModels('TroodonNode').security_user.findOne({
								where: {
									username: username,
									state: 1
								},
								include: [{
									model: R.getModels('TroodonNode').security_rol
								}, {
									model: R.getModels('TroodonNode').security_estructure
								}]
							}).then(user => {
								if (user) {
									R.getModels('TroodonNode').security_user.validPassword(password, user.password, done, user, req)
								} else {
									req.flash('panel_login_error', 'El usuario o la contraseña son inválidos')
									req.session.save(function () {
										done(null, false)
									})
								}
							})

						})
						.setAuthorization(function (req, res, next) {


							$injector.invoke(function (Troodon_security_privilege, Op, Troodon_security_rol) {

								var matchingRoutes = self.matchRoutes(req)
								//var matchingRoutes=this.R.app._router.matchRequests(req)
								var paths = matchingRoutes
								/**for (var i = 0; i < matchingRoutes.length; i++) {
									paths.push(matchingRoutes[i].path)
								};*/
								var roles = req.user.idRol
								var result = null;

								Troodon_security_privilege

									.findAll({
										include: [
											{
												model: Troodon_security_rol,
												where: {
													id: {
														[Op.in]: roles
													}
												}
											}
										],
										where: {
											route: {
												[Op.in]: paths
											}
										}
									})
									.bind(Troodon_security_privilege)
									.then(function (proy) {

										if (proy.length > 0) {
											return this.findAll({
												attributes: ['route'],
												include: [
													{
														attributes: [],
														model: Troodon_security_rol,
														where: {
															id: {
																[Op.in]: roles
															}
														}
													}
												],
												where: {
													type: {
														[Op.in]: [0, 1]
													}
												}
											})
										} else {
											req.logger.alert('Access Denied Route: ' + req.url + ' \nMethod: ' + req.method + ' \nParams: ' + JSON.stringify(req.body))
											res.end('access denied')
										}
										return null;
									})
									.then(function (actions) {
										req.viewPlugin.set('raptor_client', {
											name: "secureTroodon",
											callback: require(__dirname + '/Lib/ClientFunction').control
										})
										req.viewPlugin.set('raptor_client', {
											name: "controlActions",
											callback: require(__dirname + '/Lib/ClientFunction').control
										})
										req.viewPlugin.set('raptor_client', {
											name: "dataTroodon",
											callback: {
												actions: actions,
												root: req.url
											}
										})
										if (typeof actions !== "undefined")
											next()
										return null;
									})
									.catch(function (e) {
										req.logger.error(e.toString())
										res.end('access denied for some error')
									})
							})



						})
						.setAuditories(function (req, res, next) {

							req.logger.info('Route: ' + req.url + ' \nMethod: ' + req.method + ' \nParams: ' + JSON.stringify(req.body))
							next()
						})
				},

				/**
				 * Evento para leer la Anotacion Troodon en index.js y darle seguridad a rutas
				 * 
				 */
				'after:invoke.middleware': $injector.invokeLater(function (bundle, Annotations) {

					var reader = new Annotations.Reader(AnnotationFramework.registry);

					reader.parse(path.join(R.basePath, 'src', bundle.path, 'index.js'));

					reader.definitionAnnotations.forEach((annotation) => {
						if (annotation.annotation === 'Troodon') {
							SecurityRegistry
								.get('Troodon')
								.setLogin(annotation.value,annotation.login?annotation.login:"TroodonNode:auth")
							
						}
					})
				}),

				/**
				 * Evento para leer la Anotacion Troodon en Controladores y darle seguridad a rutas
				 * 
				 */
				'init:controller': $injector.invokeLater(function (instance, controllerPath, bundle, Annotations) {

					var reader = new Annotations.Reader(AnnotationFramework.registry);

					reader.parse(controllerPath);

					reader.definitionAnnotations.forEach((annotation) => {
						if (annotation.annotation === 'Troodon') {
							SecurityRegistry
								.get('Troodon')
								.setLogin(annotation.value,annotation.login?annotation.login:"TroodonNode:auth")
							
						}
					})
				}),

				/**
				 * Correr migraciones
				 */
				'database:running': function () {
					R.migration('TroodonNode')
				}
			})

		AnnotationFramework.registry.registerAnnotation(require.resolve(__dirname + '/Annotation/Troodon'))

		var parseUrl = require('parseurl');

		R.app.use(function (req, res, next) {
			req.logger = {
				EMERGENCY: 1,
				ALERT: 2,
				CRITICAL: 3,
				FATAL: 3,
				ERROR: 4,
				WARN: 5,
				NOTICE: 6,
				INFO: 7,
				DEBUG: 8,

				log: function (level, log) {
					this.write(req.isAuthenticated() ? req.user.username : 'público', req.ip, level, new Date(), log)
				},

				info: function (log) {
					this.log(this.INFO, log)
				},
				notice: function (log) {
					this.log(this.NOTICE, log)
				},
				warning: function (log) {
					this.log(this.WARN, log)
				},
				error: function (log) {
					this.log(this.ERROR, log)
				},
				critical: function (log) {
					this.log(this.CRITICAL, log)
				},
				fatal: function (log) {
					this.log(this.CRITICAL, log)
				},
				alert: function (log) {
					this.log(this.ALERT, log)
				},
				emergency: function (log) {
					this.log(this.EMERGENCY, log)
				},
				write: function (username, ip, state, a_date, log) {
					R.getModels('TroodonNode').security_trace
						.create({
							username: username,
							ip: ip,
							state: state,
							a_date: a_date,
							log: log
						})
						.then(function () {

						})
				}
			}

			next();
		})


		if (!fs.existsSync(path.join(R.basePath, 'public', 'rmodules', 'securityImages')))
			fs.mkdirSync(path.join(R.basePath, 'public', 'rmodules', 'securityImages'))
	}

	matchRoutes(req) {
		var idx = 0;
		var stack = $injector('R').app._router.stack
		var matched = []
		while (idx < stack.length) {

			var layer = stack[idx++];
			var match
			try {
				match = layer.match(req.path);
			} catch (err) {
				match = err;
			}

			var route = layer.route;
			var layerError;
			if (typeof match !== 'boolean') {
				// hold on to layerError
				layerError = layerError || match;
			}

			if (match !== true) {
				continue;
			}

			if (!route) {
				// process non-route handlers normally
				continue;
			}

			if (layerError) {
				// routes do not match with a pending error
				match = false;
				continue;
			}

			var method = req.method;
			var has_method = route._handles_method(method);

			// build up automatic options response
			if (!has_method && method === 'OPTIONS') {

			}

			// don't even bother matching route
			if (!has_method && method !== 'HEAD') {
				match = false;
				continue;
			}

			matched.push(route.path)

		}
		return matched
	}
}
module.exports = TroodonNode