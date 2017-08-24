'use strict';

var Controller=require('raptorjs').Controller
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
			'/list':this.listAction
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
}

module.exports=ModelController;