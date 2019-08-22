/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('security_estructure', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id_category: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'security_category',
				key: 'id'
			}
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		belongs: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		tableName: 'security_estructure',
		timestamps: false,
		underscored: true
	});
};
