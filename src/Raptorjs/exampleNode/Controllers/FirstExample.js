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
     * @Route("/language",method="get")
     *
     */
	exampleLanguageAction(req, res, next) {
		req.language.setCurrentLanguage("es");

		req.language.getCurrentLanguage();
		req.language.persistCookie()
		res.show('El lenguaje fue establecido con exito en un cookie', Controller.ERROR)
		//return req.language.getTranslation("prueba");
	}

    /**
     * @Route("/database/foreignkey")
     *
     */
	dataBaseRequestAction(req, res, next, example_cars, example_users) {
		var self = this;


		/**
		 * Esta funcion puede ser establecida en el classMethods associate del modelo
		 *
		 */
		example_cars.belongsTo(example_users,{ foreignKey: 'user_id' })

		/**
		 * Creando las tablas users y cars que para este ejemplo no existen
		 * Migration ejecuta las directivas de creacion definidos en Migration/skeleton.js
		 * de este componente 
		 *
		 */
		R.migration("exampleNode")
			.then(function () {
				
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
			})
			.catch(function (err) {
				next(err);
			})


	}
}

module.exports = FirstExample;
