'use strict';
var SequelizeAuto = require('sequelize-auto')
/**
 * Raptor.js - Node framework
 * Controlador ES6
 * 
 * @Route("/raptor/component/model.v2")
 */
class ModelV2 extends R.Controller {

	configure() {

	}

    /**
     * @Route("")
     */
	indexAction(req, res, next) {

		res.render("RaptorNode:ng/model.v2.ejs");
	}

	/**
	 * @Route("/list")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	listAction(req, res, next) {
		if (this.R.database.sequelize)
			this.R.database.sequelize.queryInterface.showAllTables().then(function (tableNames) {
				var tables = []
				for (var i = 0; i < tableNames.length; i++) {
					tables.push({
						name: tableNames[i]
					})
				};

				res.json({
					data: tables,
					recordsTotal: tables.length,
					recordsFiltered: tables.length,
					draw: req.body.draw
				})
			})
		else
			res.json({
				data: [],
				recordsTotal: 0,
				recordsFiltered: 0,
				draw: req.body.draw
			})

	}

	/**
	 * @Route("/generate")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	generateAction(req, res, next) {
		if (this.R.hasDatabaseConfig()) {
			if (req.body.tables && req.body.tables.length > 0) {
				var tables = req.body.tables;
				var schema = null;
				var dir = this.R.basePath + '/src/' + this.R.bundles[req.body.nodecomponent].path + '/Models';

				var auto = new SequelizeAuto(this.R.options.database.name, this.R.options.database.user, this.R.options.database.password, {
					host: this.R.database.sequelize.config.host,
					dialect: this.R.database.sequelize.options.dialect,
					directory: dir, // prevents the program from writing to disk
					tables: tables,
					schema: schema,
					additional: {
						timestamps: req.body.timestamps ? true : false,
						underscored: req.body.underscored ? true : false
					}
					//...
				})
				R.lockNodemon()
				auto.run(function (err) {
					if (err)
						res.show('Los modelos no pudieron ser generados, ocurrió un error interno en la generación', 3)
					else
						res.show("Los modelos fueron generados correctamente")
					R.unlockNodemon()
				});
			} else {
				res.show('Debes especificar las tablas para generar los modelos', 3)
			}
		} else {
			res.show('No se encontró la configuración de conexión con la base de datos', 3)
		}
	}
}

module.exports = ModelV2;