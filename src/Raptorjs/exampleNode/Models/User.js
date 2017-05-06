
/**var DataTypes=require('sequelize').DataTypes;
/**
 * Raptor.js - Node framework
 * 
 * @attr string name Nombre del modelo
 *
 * @attr object fiedls Campos del modelo
 *
 * @attr object methods Metodos y validaciones segun la especificacion de sequelize
 *
 * @attr object options Opciones del modelo 
 *
 * @attr function associations Callback para crear las relaciones, el callback es ejecutado
 * despues que todos los modelos en los modulos son definidos por sequelize
 *
 */
 /**
module.exports = {
	name:'User',
	fields:{
		username: {type: DataTypes.STRING, unique: true, validate: {notNull: true, notEmpty: true}},
		password: {type: DataTypes.STRING, validate: {notNull: true, notEmpty: true}}
	},
	methods:{

	},
	associations:function(thisModel,R){

	}
}*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
};

