/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_privilege', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		route: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		class_name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		belongs: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		tableName: 'security_privilege',
		timestamps: false,
		underscored: true
	});
};
