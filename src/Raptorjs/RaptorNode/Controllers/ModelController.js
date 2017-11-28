'use strict';

var Controller=require('raptorjs').Controller
var SequelizeAuto = require('sequelize-auto')
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class ModelController extends Controller{

	configure(){
		this.prefix='/raptor/component/model';

		this.routes({
			'':this.indexAction,
			'/list':this.listAction,
			'/generate':this.generateAction
		})

	}

	indexAction(req,res,next){
		res.render("RaptorNode:genModel/index.ejs");
	}

	listAction(req,res){
		this.R.database.sequelize.queryInterface.showAllTables().then(function(tableNames) {
			var tables=[]
			for (var i = 0; i < tableNames.length; i++) {
				tables.push({
					name:tableNames[i]
				})
			};
	  		res.json(tables)
	  	})
		
	}

	generateAction(req,res,next){
		if(this.R.hasDatabaseConfig()){
			if(req.body.tables && req.body.tables.length>0){
				var tables=(typeof req.body.tables=='array')?req.body.tables:[req.body.tables];
				var schema=null;
				var dir=this.R.basePath+'/src/'+this.R.bundles[req.body.nodecomponent].path+'/Models';

				var auto = new SequelizeAuto(this.R.options.database.name, this.R.options.database.user, this.R.options.database.password, {
				    host: this.R.database.sequelize.config.host,
				    dialect: this.R.database.sequelize.options.dialect,
				    directory: dir, // prevents the program from writing to disk
				    tables:tables,
				    schema: schema
				    //...
				})

				auto.run(function (err) {
				  if (err)
				  	res.show('Los modelos no pudieron ser generados, ocurrió un error interno en la generación',3)
				  else
				  	res.show("Los modelos fueron generados correctamente")	

				});
			}else{
				res.show('Debes especificar las tablas para generar los modelos',3)
			}
		}else{
			res.show('No se encontró la configuración de conexión con la base de datos',3)
		}
	}
}

module.exports=ModelController;