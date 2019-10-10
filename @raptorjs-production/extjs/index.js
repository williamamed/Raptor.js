'use strict';
const path = require('path')
/**
 * Raptor.js - v2
 * 
 * @Route("")
 */
class extjs {

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
	middleware(R, router) {

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
		
		if (Options.mode == 'development' || Options.raptorPanel) {
			Events.register({
				'after:configure': function () {
					R.Compressor.serve({
						marker: 'compileApp',
						compressor: 'no-compress',

						input: [
							'./app/model/*.js',
							'./app/store/*.js',
							'./app/view/*.js',
							'./app/controller/*.js',
							'./*app.js'
						],

						callback: function (err, min, dir) {
							if (err)
								console.log(err)

						}
					})
				}
			})

			R.Compressor.markers.add({
				marker: 'compileApp',
				compressor: 'uglifyjs',

				input: [
					'./app/model/*.js',
					'./app/store/*.js',
					'./app/view/*.js',
					'./app/controller/*.js',
					'./*app.js'
				],
				output: 'all-classes.js',
				callback: function (err, min, dir) {
					if (err)
						console.log(err)

				}
			})
		}
	}
}
module.exports = extjs