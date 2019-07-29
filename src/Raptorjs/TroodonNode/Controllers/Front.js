'use strict';
var jwt = require('jsonwebtoken');

/**
 * Raptor.js - v2
 * 
 * @Route("")
 * 
 */
class Front extends R.Controller {

	configure() {

	}

	/**
	 * @Route("/api/logout")
	 */
	logout(req, res, next) {
		req.logout()
		req.session.save(function () {
			
			res.send('kkkk')
		})
	}

    /**
	 * Autentica a un usuario y retorna un JSON WEB TOKEN
	 * 
     * @Route("/api/troodon/login",method="post")
	 * @Csrf
	 * @Cors
     */
	indexAction(req, res, next, Options, Troodon_security_user, Troodon_security_rol, Troodon_security_estructure) {
		var bcrypt = require('bcryptjs')


		Troodon_security_user
			.findOne({
				where: {
					username: req.body.username,
					state: 1
				},
				include: [{
					model: Troodon_security_rol
				}, {
					model: Troodon_security_estructure
				}]
			})
			.then(user => {
				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
						if (err) {
							req.logger.error(err.toString())
							res.status(401).send('');
						} else {
							if (!isMatch) {
								res.status(401).send('');
							} else {
								var roles = []
								var idRoles = []
								for (var i = 0; i < user.security_rols.length; i++) {
									roles.push(user.security_rols[i].name)
									idRoles.push(user.security_rols[i].id)
								};

								var token = jwt.sign({
									username: user.username,
									rol: roles,
									idRol: idRoles,
									idStructure: user.security_estructure.id,
									structure: user.security_estructure.name
								}, Options.secret, { expiresIn: '1h' });

								res.json({
									accessToken: token
								})
							}
						}
					});
				} else {
					res.status(401).send('');
				}
			})
			.catch(function(err){
				next(err)
			})

	}
}

module.exports = Front;