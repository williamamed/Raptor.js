/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('biouser', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING(40),
			allowNull: false
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'biouser',
		timestamps: false
	});
};
