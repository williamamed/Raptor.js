var bcrypt = require('bcrypt-nodejs')

module.exports={
	initRepo:function(){
		//Setear el password hasheado antes de insertar 
		this.hook('beforeCreate', function(user, options,fn){
			var salt = bcrypt.genSalt(12, function(err, salt){
				return salt
			});
			bcrypt.hash(user.password, salt, null, function(err, hash){
				if(err) return next(err);
				user.password = hash;
				return fn(null, user)
			});
		});

		//Setear el password hasheado antes de actualizar
		this.hook('beforeUpdate', function(user, options, fn){
			if(user._changed.password){
				var salt = bcrypt.genSalt(12, function(err, salt){
					return salt
				});

				bcrypt.hash(user.password, salt, null, function(err, hash){
					if(err) return next(err);
					user.password = hash;
					return fn(null, user)
				});
			}else
				fn(null, user)
		});

		//incluyendo asociasiones
		this.belongsToMany(this.R.getModels('TroodonNode').security_rol,{through: 'security_user_rol',foreignKey: 'id_user'}) 
		this.R.getModels('TroodonNode').security_rol.belongsToMany(this,{through: 'security_user_rol',foreignKey: 'id_rol'})

		this.belongsTo(this.R.getModels('TroodonNode').security_estructure,{foreignKey: 'id_estructure'}) 
	},

	validPassword: function(password, passwd, done, user, req){
		bcrypt.compare(password, passwd, function(err, isMatch){
			if (err) console.log(err)
			if (isMatch) {
				var roles=[]
				var idRoles=[]
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
				req.flash('panel_login_error','El usuario o la contraseña son inválidos')
				req.session.save(function(){
					done(null, false)
				})
			}
		})
	}
}