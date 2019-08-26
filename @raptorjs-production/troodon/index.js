
'use strict';
const fs = require('fs')
const path = require('path')


/**
 * Raptor.js - Node framework
 * TroodonNode - Componente de seguridad
 * 
 * @Biometry({
 * 	bioSession:"bioTroodon",
 * 	frontLogin: "/troodon/*",
 * 	getActiveUser: this.getActiveUser,
 * 	prototype:"troodon"
 * })
 */
class TroodonNode {



	getActiveUser(req, res, done) {
		done(req.user.username)
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
	configure(R, SecurityRegistry, Events, express, AnnotationFramework, Options, AnnotationReaderCache) {


		var self = this;
		var dynamicPrivilege;
		const DynamicPrivilege = require('./Lib/DynamicPrivilege')

		$i('DynamicPrivilege', dynamicPrivilege = new DynamicPrivilege());
		var Service = require('./Lib/TroodonDataService')
		$i('TroodonDataService', new Service());

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
								res.show(req.lang('operation_error', 'troodon'), 3)
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

					if (!R.hasDatabaseConfig()) {
						SecurityRegistry
							.register('Troodon')
							.setLogin('/troodon([\/\w*]*)?', 'troodon:auth')
							.setAuthentication(function (req, username, password, done) {
								if (Options.mode == 'development')
									req.res.send('troodon requiere una conexión activa con la base de datos.')
								else
									req.res.send('')

							})

						console.log('troodon requiere una conexión activa con la base de datos.')
						return;
					}

					if (Options.mode == 'development') {
						console.log('Troodon - componente de seguridad se encuentra en modo de desarrollo.')
						console.log('Troodon: activados los privilegios dinámicos')
					}

					SecurityRegistry
						.register('Troodon')
						.setLogin('/troodon([\/\w*]*)?', 'troodon:auth')
						.setAuthentication(function (req, username, password, done) {

							R.getModels('troodon').security_user.findOne({
								where: {
									username: username,
									state: 1
								},
								include: [{
									model: R.getModels('troodon').security_rol
								}, {
									model: R.getModels('troodon').security_estructure
								}]
							}).then(user => {

								if (user) {
									R.getModels('troodon').security_user.validPassword(password, user.password, done, user, req)
								} else {
									req.flash('panel_login_error', 'El usuario o la contraseña son inválidos')
									req.session.save(function () {
										done(null, false)
									})
								}
							})

						})
						.setAuthorization(function (req, res, next) {


							$injector.invoke(function (troodon_security_privilege, Op, troodon_security_rol, DynamicPrivilege) {

								var matchingRoutes = self.matchRoutes(req)
								//var matchingRoutes=this.R.app._router.matchRequests(req)
								var paths = matchingRoutes
								/**for (var i = 0; i < matchingRoutes.length; i++) {
									paths.push(matchingRoutes[i].path)
								};*/
								var roles = req.user.idRol
								var result = null;

								if (Options.mode == 'development') {
									
									DynamicPrivilege.authorizationFlow(req, next, paths);

									return;
								}

								troodon_security_privilege

									.findAll({
										include: [
											{
												model: troodon_security_rol,
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
									.bind(troodon_security_privilege)
									.then(function (proy) {

										if (proy.length > 0) {
											return this.findAll({
												attributes: ['route'],
												include: [
													{
														attributes: [],
														model: troodon_security_rol,
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
											throw new Error('Access denied')
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
										res.end('ACCESO DENEGADO')
									})
							})



						})
						.setAuditories(function (req, res, next) {

							req.logger.info('Route: ' + req.url + ' \nMethod: ' + req.method + ' \nParams: ' + JSON.stringify(req.body, null, 2))
							next()
						})
				},

				/**
				 * Evento para leer la Anotacion Troodon en index.js y darle seguridad a rutas
				 * 
				 */
				'annotation:read.definition.Troodon': $injector.invokeLater(function (type, annotation, bundle, Annotations) {

					Events.on('securityManager:configured.Troodon', function () {

						SecurityRegistry
							.get('Troodon')
							.setLogin(annotation.value, annotation.login ? annotation.login : "troodon:auth", annotation.token ? annotation.token : false)
					})

				}),

				/**
				 * Evento para leer la Anotacion Troodon en Controladores y darle seguridad a rutas
				 * 
				 */
				'annotation:read.method.Troodon': $injector.invokeLater(function (type, annotation) {

					SecurityRegistry
						.get('Troodon')
						.setLogin(annotation.value, annotation.login ? annotation.login : "troodon:auth", annotation.token ? annotation.token : false)

				}),
				/**
				 * Lectura de anotaciones Privilege en clases
				 */
				'annotation:read.definition.Privilege': function (type, annotation) {

					var route = AnnotationReaderCache.getDefinition('Route', annotation.filePath, annotation.target);
					if (route) {
						var comp = AnnotationReaderCache.getDefinition('Route', path.join(annotation.filePath.split('Controller')[0], 'index.js'));

						var prefix = comp ? comp.value : '';

						dynamicPrivilege.addPrivilege(annotation.value, prefix + route.value, annotation.class)

					}
				},

				'annotation:read.method.Privilege': function (type, annotation) {
					const route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
					if (route) {
						var comp = AnnotationReaderCache.getDefinition('Route', path.join(annotation.filePath.split('Controller')[0], 'index.js'));

						var prefix = comp ? comp.value : '';
						var own = AnnotationReaderCache.getDefinition('Route', annotation.filePath)
						var prefixController = own ? own.value : '';
						prefix += prefixController;

						dynamicPrivilege.addPrivilege(annotation.value, prefix + route.value, annotation.class)

					}
				},

				/**
				 * Correr migraciones
				 */
				'migration:ready': $i.later(function (Umzug) {
					if (Options.mode == 'development')
						Umzug.up("01-troodontables.mig")
							.then(function (migrations) {
								console.log('Esquemas de tablas Troodon insertadas!!')
							})
							.catch(function (err) {
								console.log(err.message)
							})

				}),
				'ready': function () {
					if (Options.mode == 'development') {
						dynamicPrivilege.addPrivilege("Seguridad->Usuarios", "/troodon/user")
						dynamicPrivilege.addPrivilege("Seguridad->Roles", "/troodon/rol")
						dynamicPrivilege.addPrivilege("Seguridad->Privilegios", "/troodon/privilege")
						dynamicPrivilege.addPrivilege("Seguridad->Estructuras", "/troodon/structure")
						dynamicPrivilege.addPrivilege("Seguridad->Categorías", "/troodon/category")
						dynamicPrivilege.addPrivilege("Seguridad->Auditoría", "/troodon/auditories")
						dynamicPrivilege.createActions()
						R.emit('troodon:dynamicPrivilege.ready')
					}

				},
				'artefacts:ready': function () {
					R.bundles['templates-gen'].manifest.technologies['Troodon-' + R.bundles['troodon'].manifest.version] = require(path.join(__dirname, 'Artefacts'))
				}
			})

		AnnotationFramework.registry.registerAnnotation(require.resolve(__dirname + '/Annotation/Troodon'))
		AnnotationFramework.registry.registerAnnotation(require.resolve(__dirname + '/Annotation/Privilege'))

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

					if (R.database)
						R.getModels('troodon').security_trace
							.create({
								username: username,
								ip: ip?ip:'unknown',
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


		if (!fs.existsSync(path.join(R.basePath, 'public', 'securityImages')))
			fs.mkdirSync(path.join(R.basePath, 'public', 'securityImages'))
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