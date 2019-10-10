'use strict';
var mountPoint = 0;
const fs = require('fs')
const path = require('path')
const exp = require('express')
const format = require('@raptorjs/core/Source/util/format')
const rxjs = require('rxjs')

/**
 * @Biometry({
 * 	bioSession:"raptor_panel_bio",
 * 	frontLogin:"/raptor/*",
 * 	getActiveUser:this.getActiveUserBio,
 * 	init:this.initBio,
 * 	disabled:true
 * })
 */
class RaptorNode {

	/**
	 * @Event("after:prepare")
	 * @Injectable
	 */
	onAfterPrepare(ProjectManager){
		for (const key in R.bundles) {


			if (fs.existsSync(path.join(R.bundles[key].absolutePath, 'DevPanel.js'))) {
				R.rewind(ProjectManager.staticMount)
					.restore(function () {
						var tag = R.bundles[key].path;
						let tagFixed = tag.split('\\')
						let resulting = [tagFixed.pop()]
						let last = tagFixed.pop()
						if (last)
							resulting.push(last)
						tagFixed = resulting.reverse().join('/')
						R.app.use('/public/' + tagFixed, exp.static(path.join(path.join(R.bundles[key].absolutePath, 'Resources'))));
					})
				R.rewind(mountPoint)
					.restore(function () {
						var Dev = require(path.join(R.bundles[key].absolutePath, 'DevPanel.js'));
						new Dev();
					})
			}

		}

		ProjectManager.components=R.filteredBundles;

		for (const key in ProjectManager.components) {
			
			//if(!R.bundles[key]){
				let bundle=ProjectManager.components[key];
				
				ProjectManager.components[key]={
					name: key,
					vendor: bundle.vendor,
					path: path.join(bundle.vendor,bundle.name),
					absolutePath: bundle.external? path.join(bundle.external,bundle.vendor,bundle.name) : path.join(R.basePath,'src',bundle.vendor,bundle.name),
					external: bundle.external
				}
				bundle=ProjectManager.components[key];
				//console.log('deac',path.join(bundle.absolutePath, 'DevPanel.js'))
				if(!require(path.join(bundle.absolutePath, 'manifest.json')).state){
					
					delete ProjectManager.components[key];
					continue;
				}
				
				if (fs.existsSync(path.join(bundle.absolutePath, 'DevPanel.js'))) {
					R.rewind(ProjectManager.staticMount)
						.restore(function () {
							var tag = bundle.path;
							let tagFixed = tag.split('\\')
							let resulting = [tagFixed.pop()]
							let last = tagFixed.pop()
							if (last)
								resulting.push(last)
							tagFixed = resulting.reverse().join('/')
							R.app.use('/public/' + tagFixed, exp.static(path.join(bundle.absolutePath, 'Resources')));
						})
					R.rewind(mountPoint)
						.restore(function () {
							var Dev = require(path.join(bundle.absolutePath, 'DevPanel.js'));
							new Dev();
						})
				}
			//}
		}
		
	}


	/**
	 * @Event("ready")
	 * @Injectable
	 */
	onReady(io, ProjectManager) {
		
		
		if (io) {
			var boardNs = io.of('/panel-board');
			boardNs.on('connect', function (panel) {
				panel.on('panel.ready', function (data) {
					
					if (Object.keys(projectNs.connected).length > 0) {
						
						boardNs.emit('project.online')
					}
					
				})
				
			})

			var projectNs = io.of('/project');
			projectNs.on('connect', function (project) {

				project.on('project.ready', function (meta) {
					var reload = false;
					var data = meta.components;
					
					ProjectManager.port = meta.port;

					for (const key in data) {
						if (!ProjectManager.components[key]) {
							reload = true;
							//R.addComponent(data[key].absolutePath)
							if (fs.existsSync(path.join(data[key].absolutePath, 'DevPanel.js'))) {
								R.rewind(ProjectManager.staticMount)
									.restore(function () {
										var tag = data[key].path;
										let tagFixed = tag.split('\\')
										let resulting = [tagFixed.pop()]
										let last = tagFixed.pop()
										if (last)
											resulting.push(last)
										tagFixed = resulting.reverse().join('/')
										R.app.use('/public/' + tagFixed, exp.static(path.join(path.join(data[key].absolutePath, 'Resources'))));
									})
								R.rewind(mountPoint)
									.restore(function () {
										var Dev = require(path.join(data[key].absolutePath, 'DevPanel.js'));
										new Dev();
									})
							}
							console.log('Detectado:', format.get(key, format.YELLOW), 'ok')
						}
					}
					R.emit('artefacts:ready')
					var activeNames = Object.keys(ProjectManager.components);
					var incomeNames = Object.keys(data);


					var diff = activeNames.filter(function (i) {
						return incomeNames.indexOf(i) < 0;
					})
					if(diff.length>0){
						diff.forEach(function(val){
							console.log('Desactivado:', format.get(val, format.YELLOW), 'ok')
						})
						reload=true;
					}
					
					ProjectManager.components = data;
					ProjectManager.routes = meta.routes;
					boardNs.emit('project.online')
					if (reload)
						boardNs.emit('reload')
					console.log('Recargando...', format.get(reload, format.BLUE))

				})
				
				project.on('disconnect', function (data) {
					boardNs.emit('project.offline')
				})
			})

			io.on('connect', function (project) {


				project.on('project.data', function (data) {

				})




			})
		}

		
	}

	/**
	 * @Event("config:error.middleware")
	 * @Injectable
	 */
	onError(express) {
		express.use(function (err, req, res, next) {
			console.log('raptor-panel error control:',err)
			next(err)
		})
	}

	/**
	 * Inicializacion del middleware 
	 * para proteccion biometrico
	 * 
	 * @param {request} req 
	 * @param {response} res 
	 * @param {next} next 
	 */
	initBio(req, res, next) {
		var ngPortalRegistry = $i('ngPortalRegistry')
		var portal = ngPortalRegistry.get('raptor');

		(function (logout, biologout) {
			portal.__logout = function () {
				biologout()
				logout.apply(portal, arguments)
			}
		})(portal.__logout, this.logout)

	}
	/**
	 * Devuelve el usuario autenticado al middleware
	 * de control biometrico
	 * @param {request} req 
	 * @param {response} res 
	 * @param {function} done 
	 */
	getActiveUserBio(req, res, done) {
		done(req.session.raptor_panel ? req.session.raptor_panel.username : null)

	}

	/*
	* Raptor.js - Node framework
	* 
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	middleware(router, Bio, ngPortalRegistry) {
		mountPoint = R.app._router.stack.length;
	}
	/*
	* Raptor.js - Node framework
	* 
	* Entrada de configuracion del componente
	* se ejecuta cuando se registran los componentes
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	configure(R, Events) {

		$i('ProjectManager', {
			components: {},
			menu: {},
			staticMount: R.app._router?R.app._router.length:0,

			elements: rxjs.from([]),

		})

		//$i('ProjectManager')._reject=_reject;
		//$i('ProjectManager')._resolve=_resolve;


		Events
			.register({
				/**
				 * Creando el portal cuando la clase ngPortal este lista
				 * en el injector
				 */
				'ioc:ngPortal.ready': $injector.invokeLater(function (ngPortal, ngPortalRegistry) {

					var ngPortalRaptor = new ngPortal('raptor')
					ngPortalRaptor.config(function () {

						this
							.viewPlugin('start', this.template('raptor-panel:ng/description.ejs', {
								version: 'v' + $injector('R').requireNode('core/manifest.json').version,
								serie: $injector('R').requireNode('core/manifest.json').serie
							}))
							.viewPlugin('name', 'Raptor.js - ' + $injector('R').requireNode('core/manifest.json').serie)
							.viewPlugin('icon', '/public/@raptorjs/core/img/raptor-logo.png')
							.viewPlugin('header', this.template('raptor-panel:ng/header.ejs'))
							.viewPlugin('sidebar', this.template('raptor-panel:ng/sidebar.ejs'))
							.viewPlugin('navbar', this.template('raptor-panel:ng/navbar.ejs'))
							.viewPlugin('script', this.template('raptor-panel:ng/script.ejs'))
							.disableProfile()
							.disableSecurityMenu()

					})
					if (R.options.panel && R.options.panel.secure)
						ngPortalRaptor.auth('raptor-panel:Panel/auth', function (autenticator) {

							autenticator
								.setCondition(function (req, res, next) {

									if (!req.session.raptor_panel) {
										return true;
									} else
										return false;
								})
								.setAuthentication(function (req, username, password, done) {

									if (username == R.options.panel.username && password == R.options.panel.password) {
										req.session.raptor_panel = {
											username: username
										}

									} else {
										req.flash('panel_login_error', 'El usuario o la contraseña son inválidos')
									}
									req.session.save(function () {
										req.res.redirect(req.url)
									})
								})
								.setLogout(function (req, res, next) {
									delete req.session.raptor_panel;
									req.session.save(function () {
										res.redirect('/raptor/home')
									})
								})
						})

					ngPortalRegistry.set(ngPortalRaptor)
				}),

				/**
				 * Configurador del panel minificado
				 */
				'sendresponse': function (req) {

					var ram = process.memoryUsage();

					var routesDef = {};

					var routes = R.app._router.stack;
					for (let index = 0; index < routes.length; index++) {
						if (!routes[index].route)
							continue;
						if (routesDef[routes[index].route.path])
							routesDef[routes[index].route.path].push(routes[index].route.methods)
						else
							routesDef[routes[index].route.path] = [routes[index].route.methods]

					}

					req.res.render('raptor-panel:minify-panel/profiler-min', {
						time: Math.floor((process.hrtime(req.profiler.start)[1] / 1e9) * 1000) / 1000,
						memory: Math.floor(ram.heapUsed / (1024 * 1024)) + 'MB - ' + Math.floor(ram.heapTotal / (1024 * 1024)) + 'MB',
						routes: Object.keys(routesDef).length,
						routesDef: routesDef,
						session: req.user,
						auth: req.isAuthenticated(),
						lang: req.language ? req.language.getCurrentLanguage() : 'none'
					}, function (err, str) {

						req.viewPlugin.set('raptor_profiler', str)
					})

				}
			})


		R.app.use(function (req, res, next) {

			req.profiler = {
				start: process.hrtime()
			}

			next();
		})

		R.on('serverrunning', function () {
			if (R.io)
				R.io.on('connection', function (socket) {
					//console.log('Un cliente se ha conectado');
					//socket.emit('messages', { text: 'hola' });
				});
		})


	}
}
module.exports = RaptorNode;
