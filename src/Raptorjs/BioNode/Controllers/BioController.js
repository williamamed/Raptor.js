'use strict';

var UserKeystroke = require('./../Library/UserKeystroke')
/**
 * @Route("/bio")
 */
class Bio extends R.Controller {

	configure() {
		this.route('get', '/bio/logout', this.indexAction)
		//this.route('get', '/bio/remove', this.removeAction)
		//this.route('get', '/bio/test', this.testAction)
		
	}

	/**
	 * @Route("/samples")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	sampleUserAction(req, res, next) {
		//verificar algo
		if (req.session[req.body.name]) {
			var raw = JSON.parse(req.body.biosamples);
			var userKeystroke = new UserKeystroke();

			userKeystroke.addSamples(raw)
			var result = userKeystroke.train()

			R.getModels('BioNode').biouser
				.create({
					username: req.body.name+"*:"+req.session[req.body.name].username,
					data: JSON.stringify(userKeystroke.getData())
				})
				.then(function () {
					req.session[req.body.name].state = 1
					req.session.save(function () {
						res.show('ok')
					})
				})
		} else {
			res.show('fail')
		}

	}

	/**
	 * @Route("/testuser.v2")
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	testUser2Action(req, res, next) {
		var sample = JSON.parse(req.body.sample)

		if (req.session[req.body.name] && req.session[req.body.name].state == 1) {
			this.R.getModels('BioNode').biouser
				.findOne({
					where: {
						username: req.body.name+"*:"+req.session[req.body.name].username
					}
				})
				.then(function (bio) {

					$injector('Bio').service.testUser(req, req.body.name, bio, sample, function(result){
						res.show(result)
					})

				})
		} else {

		}


	}

	/**
	 * @Route("/testuser")
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	testUserAction(req, res, next) {
		var sample = JSON.parse(req.body.sample)

		this.R.getModels('BioNode').biouser
			.findOne({
				where: {
					username: req.user.username
				}
			})
			.then(function (bio) {

				if (bio) {
					var userKeystroke = new UserKeystroke();
					userKeystroke.setData(JSON.parse(bio.data))
					if (userKeystroke.testSample(sample)) {
						userKeystroke.train(sample)
						req.session.bioKey = true
						req.session.keystroke = sample
						bio.update({
							data: JSON.stringify(userKeystroke.getData())
						})
							.then(function () {
								req.session.save(function () {
									res.show("ok")
								})
							})

					} else {
						var percentDiv = userKeystroke.umbral / 100;
						var diff = userKeystroke.lastscore - userKeystroke.umbral;
						var hint = ''

						if (percentDiv * 25 > diff)
							hint = 'Uhhhh, buen intento !!, sigue probando suerte'
						if (percentDiv * 25 < diff && percentDiv * 200 > diff)
							hint = 'Ummm, pareces cansado !!, concentrate y teclea como siempre'
						if (percentDiv * 200 < diff && percentDiv * 400 > diff)
							hint = 'Noup, Noup, Noup !!'
						if (percentDiv * 400 < diff && percentDiv * 700 > diff)
							hint = 'Ehhhh !!'
						if (percentDiv * 700 < diff)
							hint = 'Si quieres acceder creo que será mejor contactar con el usuario original, no crees?'
						res.show(hint)
					}
				} else {
					res.show("redirect to samples")
				}
			})
	}


	indexAction(req, res, next) {
		var state=""
		if(req.session[req.query.name]){
			delete req.session[req.query.name+"kb10"]
			delete req.session[req.query.name]
			state="session deleted"
		}
		
		req.logout()
		req.session.save(function () {
			res.end('logout '+state)
		})
	}

	removeAction(req, res, next) {
		this.R.getModels('BioNode').biouser
			.destroy({
				where: {
					username: req.user.username
				}
			})
			.then(function (user) {
				if (user)
					res.end('El perfil biometrico del usuario ' + user.username + ' fue eliminado')
				else
					res.end('No se encontro el usuario')
			})

	}

	testAction(req, res, next) {
		this.R.getModels('BioNode').biouser
			.findOne({
				where: {
					username: 'admin'
				}
			})
			.then(function (bio) {

				var userKeystroke = new UserKeystroke();
				userKeystroke.setData(JSON.parse(bio.data))
				/**
				var mean = 0;
		        
	        	for (var i = 0; i < userKeystroke.samples.length; i++) {
	            	var sampleItem=userKeystroke.samples[i]
	            	var key=i;
	                //Create de digraph and trigraph
	                var meanRest = 0;
	                for (var j = 0; j < userKeystroke.samples.length; j++) {
	                	var value=userKeystroke.samples[j]
	            		var key2=j;
	                
	                    if (key != key2) {
	                    	var current=userKeystroke.som.distance(userKeystroke.getDigraph(sampleItem).concat(userKeystroke.getTrigraph(sampleItem)),userKeystroke.getDigraph(value).concat(userKeystroke.getTrigraph(value)));
	                    	
	                        meanRest+= current
	                    }
	                }
	                mean+=(meanRest / (userKeystroke.samples.length - 1));
	               
	                
	            }
	            
	            mean = mean / userKeystroke.samples.length;
	            console.log('promedio',mean,userKeystroke.samples.length)
				**/


				var mean = 0;

				for (var i = 0; i < userKeystroke.samples.length; i++) {
					var sampleItem = userKeystroke.samples[i]
					var key = i;
					var vectorProm = [];
					var n = 0;
					for (var k = 0; k < userKeystroke.digraphSize; k++) {
						vectorProm.push(0)
					};

					for (var j = 0; j < userKeystroke.samples.length; j++) {
						var value = userKeystroke.getDigraph(userKeystroke.samples[j])
						var key2 = j;

						if (key != key2) {
							n++
							for (var k = 0; k < userKeystroke.digraphSize; k++) {
								vectorProm[k] += value[k]
							};
						}

					}
					for (var k = 0; k < userKeystroke.digraphSize; k++) {
						vectorProm[k] /= n
					};
					var c = userKeystroke.som.distance(userKeystroke.getDigraph(sampleItem), vectorProm);

					mean += c
				}

				mean = mean / userKeystroke.samples.length;
				console.log('promedio', mean, userKeystroke.samples.length)


				var current = userKeystroke.som.grid[0][0]
				var best = userKeystroke.som.get10BMU(current);

				var dist = 0;
				for (var i = 0; i < best.length; i++) {
					var newVec = best[i];
					var p = userKeystroke.som.distance(current, newVec);
					dist += p
					//console.log('current',p)
				};
				console.log('promedio2', dist / best.length)


				res.send(mean)

			})
	}

}

module.exports = Bio;