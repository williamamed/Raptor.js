/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_category', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	}, {
		tableName: 'security_category',
		timestamps: false,
		underscored: true
	});
};
