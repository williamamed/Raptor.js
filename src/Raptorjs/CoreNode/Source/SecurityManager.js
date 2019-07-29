'use strict';
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, jwt = require('express-jwt')


/**
* 
* @author William Amed
*/
class SecurityManager {

	constructor(name) {
		this.R = R
		var self = this;
		this.name = name;

		
	}

	setLogin(route, template, type_auth) {
		if (this.R.options.database.state === 'off') {
			this.R.app.all(route, function (req, res, next) {
				throw Error("El componente de seguridad se encuentra inaccesible, la base de datos no se encuentra activa.")
			})

			return this;
		}

		var self = this;
		var name = 'raptor' + Math.random()
		// passport.serializeUser(function(user, done){
		// 	done(null, {
		// 		username: user
		// 	});
		// });
		passport.use(name, new LocalStrategy({
			passReqToCallback: true
		},
			function () {

				return self._authentication.apply(self, arguments)
			}
		));
		//Aqui va un middleware para la autenticacion por token
		if (type_auth == 'JWT') {
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