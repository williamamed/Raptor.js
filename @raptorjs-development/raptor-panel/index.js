'use strict';


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
	 * Inicializacion del middleware 
	 * para proteccion biometrico
	 * 
	 * @param {request} req 
	 * @param {response} res 
	 * @param {next} next 
	 */
	initBio(req,res,next){
		var ngPortalRegistry=$i('ngPortalRegistry')		
		var portal=ngPortalRegistry.get('raptor');
		
		(function(logout,biologout){
			portal.__logout=function(){
				biologout()
				logout.apply(portal,arguments)
			}
		})(portal.__logout,this.logout)

	}
	/**
	 * Devuelve el usuario autenticado al middleware
	 * de control biometrico
	 * @param {request} req 
	 * @param {response} res 
	 * @param {function} done 
	 */
	getActiveUserBio(req,res,done){
		done(req.session.raptor_panel?req.session.raptor_panel.username:null)
		
	}

	/*
	* Raptor.js - Node framework
	* 
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	middleware(router, Bio, ngPortalRegistry) {
		
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
						lang: req.language?req.language.getCurrentLanguage():'none'
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
					console.log('Un cliente se ha conectado');
					socket.emit('messages', { text: 'hola' });
				});
		})


	}
}
module.exports = RaptorNode;
