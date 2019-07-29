'use strict';

/**
 * Esta definicion se aplica como prefijo de ruta
 * para todas las definiciones en el controlador
 * 
 * @Route("/example") 
 * 
 * 
 */
class FirstExample extends R.Controller {

	configure() {

	}

    /**
     *  El prefijo de esta ruta es el declarado en la cabecera
     *  de esta clase.
	 *  Pueden ser inyectadas las dependencias requeridas a continuación
	 *  de req,res,next
     *  
     *	@Route("/holaruta",method="all")
     * 
     */
	holaRuta(req, res, next, SecurityRegistry, Op, sequelize, queryInterface) {
		/**
		 * Las inyecciones de dependecias Op, sequelize y queryInterface
		 * solo estarán disponibles si existe una conexión exitosa con
		 * una base de datos
		 */
		res.send('hola ruta')
	}

	/**
	 * @Route("/ang")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	angularJsExampleRuta(req, res, next) {
		
		res.render('exampleNode:AngExample/index.ejs')
	}

	/**
	 * @Route("/ang/base/url")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	angularJsFragmentExampleRuta(req, res, next) {
		
		res.render('exampleNode:AngExample/index.fragment.ejs')
	}

	/**
	 * @Route("/extjs")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	extjsExampleRuta(req, res, next) {
		
		res.render('exampleNode:extjsSample/index.ejs')
	}

    /**
     * @Route("/language",method="get")
     *
     */
	exampleLanguageAction(req, res, next) {
		req.language.setCurrentLanguage("es");

		req.language.getCurrentLanguage();
		req.language.persistCookie()
		res.show('El lenguaje fue establecido con exito en un cookie', R.Controller.ERROR)
		//return req.language.getTranslation("prueba");
	}

    /**
     * @Route("/database/foreignkey")
     *
     */
	dataBaseRequestAction(req, res, next, Database, example_cars, example_users, Umzug) {
		if(!Database){
			next(new Error("Para utilizar esta ruta debes configurar una conexión de base de datos."));
			return;
		}
			

		var self = this;
		const getCars = function () {
			/**
			 * Esta funcion puede ser establecida en el classMethods associate del modelo
			 *
			 */
			example_cars.belongsTo(example_users, { foreignKey: 'user_id' })
			/**
			 * Para incluir el hidratado del modelo users dentro del cars debe especificarse en el include
			 *
			 */
			example_cars.findAll({
				include: [{
					model: example_users
				}]
			}).then(function (cars) {

				res.end(JSON.stringify(cars))

			}).catch(function (err) {
				next(err);
			})
		}
		/**
		 * Creando las tablas users y cars que para este ejemplo no existen
		 * Migration ejecuta las directivas de creacion definidos en Migration/01-example.mig.js
		 * de este componente 
		 *
		 */
		Umzug.up(['01-example.mig'])
			.then(function () {
				getCars()
			})
			.catch(function (err) {
				if (err.message.split('Migration is not pending').length > 1) {
					getCars()
				} else
					next(err);
			})


	}
}

module.exports = FirstExample;
