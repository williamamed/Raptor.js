'use strict';
const path=require('path')
/**
 * Raptor.js - Node framework
 * Controlador ES6
 * 
 * @Route("/raptor/component/model.v2")
 * @Controller
 */
class ModelV2 {

	configure() {

	}
	
    /**
     * @Route("")
     */
	indexAction(req, res, next, ProjectManager) {
		
		res.render(path.join(__dirname,'..','Views',"/model.v2.ejs"),{
			projectUrl: 'http://127.0.0.1:'+ProjectManager.port
		});
	}

	/**
	 * @Route("/list")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	listAction(req, res, next) {
		if (this.R.database && this.R.database.sequelize)
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
				var dir = this.R.bundles[req.body.nodecomponent].absolutePath + '/Models';
				
				var SequelizeAuto = require('sequelize-auto-v2')
				
				var auto = new SequelizeAuto(this.R.options.database.name, this.R.options.database.user, this.R.options.database.password, {
					host: this.R.database.sequelize.config.host,
					dialect: this.R.database.sequelize.options.dialect,
					port: this.R.database.sequelize.options.port,
					directory: dir, // prevents the program from writing to disk
					tables: tables,
					schema: schema,
					logging: function () { },
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
					else{
						const path=require('path');
						const fs=require('fs');
						var repo=path.join(dir,'..','Repositories');
						if(!fs.existsSync(repo))
							fs.mkdirSync(repo)
						
						tables.forEach(element => {
							if(!fs.existsSync(path.join(repo,element+'.js')))
								fs.writeFileSync(path.join(repo,element+'.js'),R.template('orm:repository.ejs'));
						});
						res.show("Los modelos fueron generados correctamente")
					}
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