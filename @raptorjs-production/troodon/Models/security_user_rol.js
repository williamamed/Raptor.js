/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_user_rol', {
		id_user: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'security_user',
				key: 'id'
			}
		},
		id_rol: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'security_rol',
				key: 'id'
			}
		}
	}, {
		tableName: 'security_user_rol',
		timestamps: false,
		underscored: true
	});
};
