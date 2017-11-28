/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_trace', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		ip: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		a_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		state: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		log: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'security_trace',
		timestamps: false,
		underscored: true
	});
};
