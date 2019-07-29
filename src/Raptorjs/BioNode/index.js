'use strict';

var KDYN = require('./Controllers/KDynamics')
var path = require('path')
var lodash = require('lodash')
/*
* Raptor.js - Node framework
* Generado por Raptor.js
* 
*
*/
class BioNode {

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
	middleware(R) {

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
	configure(R, AnnotationFramework, Events, router, AnnotationReaderCache) {
		$injector('Bio', {
			protection: KDYN.bioMiddleware,
			watch: [],
			service: {}
		})
		var Bio = $i('Bio')
		AnnotationFramework.registry.registerAnnotation(path.join(__dirname, 'Annotations', 'Biometry'))

		Events.register({
			'annotation:read.definition.Biometry': function (def, annotation) {
				var route = AnnotationReaderCache.getDefinition('Route', annotation.filePath, annotation.target)
				if (!$i(annotation.value.prototype + 'BioPrototype'))
							$i(annotation.value.prototype + 'BioPrototype', annotation.value)
						
				if (annotation.value && !annotation.value.disabled) {

					Events.on('run.middlewares', function () {
						var proto = $i(annotation.value.prototype + 'BioPrototype')

						if (proto) {
							proto = lodash.extend(proto, annotation.value)
						} else {
							proto = annotation.value;
						}
						if (route) {

							if (!route.before)
								route.before = [Bio.protection(proto)]
							else
								route.before.unshift(Bio.protection(proto))
						} else {
							router.all(proto.frontLogin, Bio.protection(proto))
						}
					})
				}

			},
			'migration:ready':$i.later(function(Umzug){
				Umzug.up(['01-biotables.mig'])
				.then(function(){
					console.log('Esquemas de tablas Bio insertadas!!')
				})
				.catch(function(err){
					console.log(err.message)
				})
			})
		})


		R.on('before:middleware', function () {
			//Verificar si es post y marcarlo como login del bio
			R.app.use(function (req, res, next) {
				req.logoutBio = function (name) {

					if (req.session && req.session[name]) {
						delete req.session[name + "kb10"]
						delete req.session[name]
					}
				};
				(function (logout) {
					req.logout = function () {

						req.logoutBio();
						return logout.apply(this, arguments);
					}
				})(req.logout);

				if (req.body) {
					if (req.session)
						for (let index = 0; index < $injector('Bio').watch.length; index++) {
							const element = $injector('Bio').watch[index];
							if (req.body[element.field]) {
								if (!req.session.biomarker)
									req.session.biomarker = {}
								req.session.biomarker[element.field] = {
									pass: req.body[element.field],
									bio: req.body.bio
								}
							}
						}
					if (req.session && req.session.biomarker)
						req.session.save(function () {
							next()
						})
					else
						next()
				} else {
					next()
				}

			})
		})
	}

}
module.exports = BioNode