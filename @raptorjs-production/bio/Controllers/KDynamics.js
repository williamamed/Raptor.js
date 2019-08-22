'use strict';

var UserKeystroke = require('./../Library/UserKeystroke')
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class KDynamics extends R.Controller {

	configure() {
		$injector('Bio').service.testUser=this.serviceTestUser
	}


	/**
	 * 
	 * @param {*} options 
	 */
	static bioMiddleware(options) {
		
		var none=function(req,res,next){
			
			next()
		}
		if(R.options.database.state=='off' || !R.options.database.state){
			console.log('bio require una conexión activa con la base de datos.')
			return none;
		}

		if(!options.passwordField)
			options.passwordField='password'
		
		if(!options.bioSession){
			console.error("bio Middleware error: configure un nombre para el parametro bioSession")
			return none
		}

		if(!options.getActiveUser){
			console.error("bio Middleware error: configure la funcion getActiveUser para devolver el nombre del usuario autenticado")
			return none
		}

		var self = this;
		options.hasNewPassword=function(req,bio,field,done){
			
			done(bio!==field)
		};
		
		/**(function (push) {
			R.app._router.stack.__push = push
			R.app._router.stack.push = function () {
				return this.unshift.apply(this, arguments);
			};
		})(R.app._router.stack.push);
		R.app.all('/mioooooooo',function(){});
		(function (push) {

			R.app._router.stack.push = function () {
				return push.apply(this, arguments);
			};
		})(R.app._router.stack.__push);

		console.log(R.app._router.stack)*/
		if(options.frontLogin)
			R.on('sendresponse',function(req){
				
				if(req.res.statusCode==401 && new RegExp(options.frontLogin).test(req.url)){
					
					req.res.render('bio:login', {
						name: options.passwordField
					}, function (err, str) {
						req.viewPlugin.set('after_response_body', str)
					})
				}
				
			})
		$injector('Bio').watch.push({
			name: options.bioSession,
			field: options.passwordField
		})

		return function (req, res, next) {
			
			options.logout=function logout(){
				delete req.session[options.bioSession+"kb10"]
				delete req.session[options.bioSession]
			}
			if(options.init)
				options.init.apply(options,arguments)
			
			//Verificar si esta autenticado biometricamente, dejarlo entrar si es true
			if (req.session[options.bioSession+"kb10"]) {
				
				next()
			} else {
				
				options.getActiveUser.apply(options, [req, res, function (username) {
					R.getModels('bio').biouser
						.findOne({
							where: {
								username: options.bioSession+"*:"+username
							}
						})
						.then(function (bio) {
							if (!bio){
								req.session[options.bioSession] = {
									username: username,
									state: 0
								}
								req.session.save(function () {
									res.render('bio:samples.ejs',{
										name: options.bioSession
									})
								})
							}else {
								if (req.session[options.bioSession]) {
									res.render("bio:auth.ejs",{
										name: options.bioSession,
										hint:''
									})
								} else {
									
									if (req.session.biomarker && req.session.biomarker[options.passwordField]) {
										
										var passwordField=req.session.biomarker[options.passwordField].pass;
										var sample=JSON.parse(req.session.biomarker[options.passwordField].bio);

										delete req.session.biomarker[options.passwordField];
										
										var currentPass = ''
										JSON.parse(bio.data).samples[0].forEach(function (val) {
											currentPass += val.key
										})
										options.hasNewPassword.apply(this, [req, currentPass,passwordField, function (result) {
											if (!result) {
												
												req.session[options.bioSession] = {
													username: username,
													state: 1
												}
												req.session.save(function () {
													//verificar aqui mismo si existe un bio y consumir servicio
												
													$injector('Bio').service.testUser(req, options.bioSession, bio, sample, function(result){
														res.redirect(req.url)
													})
												})
											} else {
												R.getModels('bio').biouser
													.destroy({
														where: {
															username: options.bioSession+"*:"+username
														}
													})
													.then(function (user) {
														req.session[options.bioSession] = {
															username: username,
															state: 0
														}
														req.session.save(function () {
															res.redirect(req.url)
														})
													})
													.catch(function () {
														req.session[options.bioSession] = {
															username: username,
															state: 0
														}
														req.session.save(function () {
															res.redirect(req.url)
														})
													})
											}
										}])
									} else {
										//error
										req.session[options.bioSession] = {
											username: username,
											state: 1
										}
										req.session.save(function () {
											res.render("bio:auth.ejs",{
												name: options.bioSession,
												hint:''
											})
										})
									}
								}
							}

						})
				}])


			}
		}
	}

	serviceTestUser(req, name, biouser, sample, callback) {

		if (biouser) {
			var userKeystroke = new UserKeystroke();
			userKeystroke.setData(JSON.parse(biouser.data))
			if (userKeystroke.testSample(sample)) {
				userKeystroke.train(sample)

				req.session[name+"kb10"] = true

				biouser.update({
					data: JSON.stringify(userKeystroke.getData())
				})
				.then(function () {
					req.session.save(function () {
						callback.apply(this,['ok'])
					})
				})

			} else {
				var percentDiv = userKeystroke.umbral / 100;
				var diff = userKeystroke.lastscore - userKeystroke.umbral;
				var hint = ''

				if (percentDiv * 25 > diff)
					hint = 'Uhhhh, buen intento !!, sigue probando suerte'
				if (percentDiv * 25 < diff && percentDiv * 200 > diff)
					hint = 'Ummm, pareces cansado !!, concentrate y teclea como siempre'
				if (percentDiv * 200 < diff && percentDiv * 400 > diff)
					hint = 'Noup, Noup, Noup !!'
				if (percentDiv * 400 < diff && percentDiv * 700 > diff)
					hint = 'Ehhhh !!'
				if (percentDiv * 700 < diff)
					hint = 'Si quieres acceder creo que será mejor contactar con el usuario original, no crees?'
				
				callback.apply(this,[hint])
			}
		}else{
			callback.apply(this,['404'])
		}

	}

}

module.exports = KDynamics;