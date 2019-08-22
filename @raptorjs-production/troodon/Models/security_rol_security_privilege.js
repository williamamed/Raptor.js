/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_rol_security_privilege', {
		id_rol: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'security_rol',
				key: 'id'
			}
		},
		id_privilege: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'security_privilege',
				key: 'id'
			}
		}
	}, {
		tableName: 'security_rol_security_privilege',
		timestamps: false,
		underscored: true
	});
};
