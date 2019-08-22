/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_rol', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		belongs: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		tableName: 'security_rol',
		timestamps: false,
		underscored: true
	});
};
