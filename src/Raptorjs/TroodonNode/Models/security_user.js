/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_user', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id_estructure: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'security_estructure',
				key: 'id'
			}
		},
		fullname: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		state: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		icon: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		attempts: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		lastattempt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'security_user',
		timestamps: false,
		underscored: true
	});
};
