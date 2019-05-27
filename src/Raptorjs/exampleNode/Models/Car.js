
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
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: $injector("example_users"),
        key: 'id'
      }
    }
  }, {
    tableName: 'cars',
    classMethods:{
      associate (models,R){
        models.cars.belongsTo(models.users,{ foreignKey: 'user_id' })
      }
    }
  });
};

