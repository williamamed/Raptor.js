'use strict';
const lodash = require('lodash')
const path = require('path')
const fs = require('fs')
const format=require('@raptorjs/core/Source/util/format')
/**
 * Raptor.js - v2
 * 
 * @Route("")
 */
class orm {

	/**
	 * Raptor.js - Node framework
	 * 
	 * 
	 * se ejecuta luego que son adicionados los elementos
	 * del framework al stack de express
	 * 
	 * @param Raptor R instancia de la aplicacion Raptor
	 *
	 */
	middleware(R, router, Options) {
		if(Options.mode=='production'){
			router.all('/raptor/component/model.v2*',function(req,res,next){
				res.send('Solo disponible en desarrollo')
			})
		}
	}

	/**
	 * Raptor.js - Node framework
	 * 
	 * Entrada de configuracion del componente
	 * se ejecuta cuando se registran los componentes
	 * 
	 * @param Raptor R instancia de la aplicacion Raptor
	 *
	 */
	configure(R, Events, Options) {
		R.hasDatabaseConfig = this.hasDatabaseConfig;
		
		R.startStack
			.then(() => {
				return this.start()
			})

		Events.register({
			/**
			 * Registrando y corriendo la funcionalidad de migracion de Raptor.js
			 */
			'database:running': require(__dirname + '/Services/Migration'),
			'before:middleware':function(){
				R.app.get('/raptor/orm*',function(req,res,next){
					if(Options.mode=="production"){
						res.send('Disponible solo en desarrollo');
					}else
						next()
				})
				R.app.get('/raptor/home',function(req,res,next){
					
					req.viewPlugin.set('raptorpanel_sidebar_main',R.template('orm:sidebar.ejs'))
					next()
				})
				
			}
		})
	}

	start() {
		if (R.hasDatabaseConfig()) {
			var obj = {
				logging: function () { }
			};
			obj = lodash.extend(obj, R.options.database.options)
			R.database = {}
			this.prepareDatabase(R.options.database.name, R.options.database.user, R.options.database.password, obj)

			return R.database.sequelize
				.authenticate()
				.then(function (err) {
					console.log(format.get('Sequelize ORM:','yellow'),'Conexión con la base de datos establecida con éxito.');
					R.database.state = true
					R.emit('database:running')
					//R.startServer();
					return "kkk"
				})
				.catch(function (err) {
					console.log(format.get('Sequelize ORM, No se pudo conectar con la base de datos.','red'), err.toString());
					R.emit('database:failed')
					R.database.state = false
					//R.startServer();
				});
		} else {

		}
	}

	/**
	 * Devuelve si existe una configuracion de base de datos activa
	 */
	hasDatabaseConfig() {
		if (R.options.database && R.options.database.name && R.options.database.user) {
			if (R.options.database.state) {
				if (R.options.database.state == 'on')
					return true;
				else
					return false;
			} else {
				return true;
			}
		}
	}

	/**
	 * Prepara la coneccion con la base de datos y lee los
	 * modelos de los modulos de src. Esto todavia no manda
	 * a conectar con la base de datos, solo prepara la coneccion
	 */
	prepareDatabase(database, user, pass, options) {

		var Sequelize = require('sequelize')
			, sequelize = new Sequelize(database, user, pass, options)
			, me = R
		if (R.app)
			R.app.set('sequelize', sequelize);
		var associationBuffer = [];

		for (var bundle in R.bundles) {
			this.prepareComponentModel(bundle, sequelize);
		}

		for (var i = 0; i < associationBuffer.length; i++) {
			associationBuffer[i].callback.call(R, associationBuffer[i].model, R)
		};
		//Leer los modelos de los modulos
		// Setup relationships
		const models = sequelize.models;
		//  console.log( Object.keys(models))
		Object.keys(sequelize.models).forEach(function (modelName) {
			if (sequelize.models[modelName].options.classMethods)
				if ("associate" in sequelize.models[modelName].options.classMethods) {

					sequelize.models[modelName].options.classMethods.associate(sequelize.models, R);
				}
			if ("initRepo" in sequelize.models[modelName]) {
				sequelize.models[modelName].initRepo(sequelize.models, R);
			}
		});
		$injector('Sequelize', Sequelize);
		$injector('sequelize', sequelize);
		$injector('queryInterface', sequelize.queryInterface);
		$injector('Op', Sequelize.Op);

		R.database = lodash.extend({
			sequelize: sequelize,
			Sequelize: Sequelize
		}, R.database)
		$injector('Database', R.database);

		return true;
	}

	/**
	 * Prepara un modelo adicionado en tiempo de ejecucion
	 */
	prepareComponentModel(bundle, sequelize) {
		var modelPath = path.join(R.bundles[bundle].absolutePath, 'Models');
		var me = R;
		var associationBuffer = [];
		var modelsName = []
		if (fs.existsSync(modelPath)) {
			fs
				.readdirSync(modelPath)
				.filter(function (file) {
					return (file.indexOf('.') !== 0) && (file !== 'index.js')
				})
				.forEach(function (file) {
					var configModel = require(path.join(modelPath, file));

					if (typeof configModel == 'function') {

						var model = sequelize.import(path.join(modelPath, file))
						if (fs.existsSync(path.join(modelPath, '..', 'Repositories', file))) {
							var repo = require(path.join(modelPath, '..', 'Repositories', file))
							repo.R = R
							model = lodash.extend(model, repo)

						}
						R.bundles[bundle].models[model.name] = model
						$injector(bundle.replace('Node', '') + '_' + model.name, R.bundles[bundle].models[model.name])
					}


				})

		}




	}
}
module.exports = orm