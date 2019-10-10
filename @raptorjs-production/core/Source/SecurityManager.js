'use strict';
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, jwt = require('express-jwt')


/**
 * @author William Amed
 */
class SecurityManager {

	constructor(name) {
		this.R = R
		var self = this;
		this.name = name;

		
	}

	/**
	 * Indica que se protegera un patron de ruta
	 * 
	 * @param {string} route Patron de ruta a proteger
	 * @param {string} template Plantilla de login a mostrar
	 * @param {string} type_auth Tipo de autenticacion a utilizar
	 */
	setLogin(route, template, type_auth) {
		

		var self = this;
		var name = 'raptor' + Math.random()
		
		passport.use(name, new LocalStrategy({
			passReqToCallback: true
		},
			function () {

				return self._authentication.apply(self, arguments)
			}
		));
		//Aqui va un middleware para la autenticacion por token
		if (typeof type_auth=='string' && type_auth.toUpperCase() == 'JWT') {
			this.R.app.all(route, jwt({
				secret: this.R.options.secret
			}), function (req, res, next) {
				req.login(req.user, function () {
					next()
				})
			})
			this.R.app.use(function (err, req, res, next) {
				
				if (err.name === 'UnauthorizedError') {
					res.status(401).send('invalid token...');
				}
			});
		} else {
			this.__authenticateWithLogin(route, name, template, passport);
		}


		this.R.app.all(route, function () {
			return self._authorization.apply(self, arguments)
		})
		this.R.app.all(route, function () {
			return self._auditories.apply(self, arguments)
		})
		if (!this.init) {

			this.init = true
			this.R.emit('securityManager:configured.' + this.name, route)
		}
		
		return this;
	}

	/**
	 * Autenticar a traves del formulario
	 * de login por defecto
	 */
	__authenticateWithLogin(route, name, template, passport){
		var self=this;
		this.R.app.all(route, function (req, res, next) {

			// For Authentication Purposes
			//passport.use(new SessionStrategy());

			var passportAuth = passport.authenticate(name, function (err, user) {
				if (err) next(err);
				req.logIn(user, function () {
					req.session.save(function () {
						res.redirect(req.url)
					})
				})
			});

			if (self._criteria && typeof self._criteria == 'function') {
				if (self._criteria(req, res, next)) {
					if (req.is('application/x-www-form-urlencoded') && req.body.username && req.body.password) {
						passportAuth(req, res, next)
					} else {
						res.status(401)
						res.render(template);
					}
				} else {
					next();
				}

			} else {

				if (!req.isAuthenticated()) {

					if (req.is('application/x-www-form-urlencoded') && req.body.username && req.body.password) {
						passportAuth(req, res, next)
					} else {
						res.status(401)
						res.render(template);
					}
				} else {
					next();
				}
			}

		})
	}

	setAuthentication(auth) {
		this._authentication = auth
		return this;
	}

	setAuthorization(auth) {
		this._authorization = auth
		return this;
	}

	setAuditories(aud) {
		this._auditories = aud
		return this;
	}

	setCondition(cond) {
		this._criteria = cond
		return this;
	}


	_authentication(username, password, done) {
		return done(null, {
			username: username
		});
	}

	_authorization(req, res, next) {
		next()
	}

	_auditories(req, res, next) {
		next()
	}
	/**
	 * @deprecated
	 * @param {*} cond 
	 */
	setLogout(cond) {
		this.logout = cond
		return this;
	}


}


module.exports = SecurityManager