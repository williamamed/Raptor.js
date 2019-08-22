var bcrypt = require('bcryptjs')

module.exports = {
	initRepo: function () {
		//Setear el password hasheado antes de insertar
		var me = this;
		this.addHook('beforeCreate', function (user, options) {

			return me.findOne({
				where: {
					username: user.username
				}
			}).then(not => {
				if (not) {
					throw {message:"El usuario que intenta insertar ya existe en el sistema.",code:"TroodonError"};
				} else {
					user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12));
				}
			})


		});

		//Setear el password hasheado antes de actualizar
		this.addHook('beforeUpdate', function (user, options) {

			if (user._changed.password) {
				user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12));
			}
		});

		//incluyendo asociasiones
		this.belongsToMany(this.R.getModels('troodon').security_rol, { through: 'security_user_rol', foreignKey: 'id_user' })
		this.R.getModels('troodon').security_rol.belongsToMany(this, { through: 'security_user_rol', foreignKey: 'id_rol' })

		this.belongsTo(this.R.getModels('troodon').security_estructure, { foreignKey: 'id_estructure' })
	},

	validPassword: function (password, passwd, done, user, req) {
		bcrypt.compare(password, passwd, function (err, isMatch) {
			if (err) console.log(err)
			if (isMatch) {
				var roles = []
				var idRoles = []
				for (var i = 0; i < user.security_rols.length; i++) {
					roles.push(user.security_rols[i].name)
					idRoles.push(user.security_rols[i].id)
				};
				return done(null, {
					username: user.username,
					rol: roles,
					idRol: idRoles,
					idStructure: user.security_estructure.id,
					structure: user.security_estructure.name
				})
			} else {
				req.flash('panel_login_error', 'El usuario o la contraseña son inválidos')
				req.session.save(function () {
					done(null, false)
				})
			}
		})
	}
}