'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("/raptor/component/model.v2")
 * @Controller
 */
class ApiPanel {

	configure(){
		
	}
    
    /**
     * @Route("/list")
	 * @Cors
	 * @Development
     */
	indexAction(req,res,next){
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
	 * @Cors
	 * @Development 
	 * @Csrf
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
				//R.lockNodemon()
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
							fs.writeFileSync(path.join(repo,element+'.js'),R.template('orm:repository.ejs'));
						});
						res.show("Los modelos fueron generados correctamente")
					}
					//R.unlockNodemon()
				});
			} else {
				res.show('Debes especificar las tablas para generar los modelos', 3)
			}
		} else {
			res.show('No se encontró la configuración de conexión con la base de datos', 3)
		}
	}
	
	/**
     * @Route("/models")
	 * @Cors
	 * @Development
     */
	modelsAction(req,res,next){
		var tables=[];
		for (const key in R.bundles) {
			for (const model in R.bundles[key].models) {
				tables.push({
					name: key.replace('Node', '') + '_' + model,
					text: key.replace('Node', '') + '_' + model
				})
			}
		}
		res.json(tables)
	}
}

module.exports=ApiPanel;