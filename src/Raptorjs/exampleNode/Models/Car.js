/**
var DataTypes=require('sequelize').DataTypes;
/**
 * Raptor.js - Node framework
 * 
 * @attr string name Nombre del modelo
 *
 * @attr object fields Campos del modelo
 *
 * @attr object methods Metodos y validaciones segun la especificacion de sequelize
 *
 * @attr object options Opciones del modelo 
 *
 * @attr function associations Callback para crear las relaciones, el callback es ejecutado
 * despues que todos los modelos en los modulos son definidos por sequelize
 * 
 * @attr object hooks Eventos a ejecutar en el modelo
 *
 */
 /**
module.exports = {
	name:'Car',
	fields:{
		name: {type: DataTypes.STRING, unique: true, validate: {notNull: true, notEmpty: true}},
		doors: {type: DataTypes.INTEGER}
	},
	methods:{

	},
	associations:function(Car,R){
		Car.belongsTo(R.getModels('exampleNode').User)
	},
	hooks:{

	}
}*/

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cars', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    doors: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'cars',
    classMethods:{
      associate (models,R){
         models.cars.belongsTo(models.users)
      }
    }
  });
};

