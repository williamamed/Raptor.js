'use strict';

var Controller=require('raptorjs').Controller
var UserKeystroke=require('./../Library/UserKeystroke')
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class KDynamics extends Controller{

	configure(){
		
	}

	testSampleUser(req,res,next,success,sample){
		//TODO Verificar la contrasenna
		console.log('testSample')
		this.R.getModels('BioNode').biouser
		.findOne({
			where:{
				username: req.user.username
			}
		})
		.then(function(bio){
			if(bio){
				var userKeystroke=new UserKeystroke();
				userKeystroke.setData(JSON.parse(bio.data))
				if(userKeystroke.testSample(sample)){
					userKeystroke.train(sample)
					req.session.bioKey=true
					req.session.keystroke=sample
					bio.update({
						data: JSON.stringify(userKeystroke.getData())
					})
					.then(function(){
						req.session.save(function(){
							req.res.redirect(req.url)
						})
					})
					
				}else{
					var percentDiv=userKeystroke.umbral/100;
					var diff=userKeystroke.lastscore- userKeystroke.umbral;
					var hint=''

					if(percentDiv*25>diff)
						hint='Uhhhh, buen intento !!, sigue probando suerte'
					if(percentDiv*25<diff && percentDiv*200>diff)
						hint='Ummm, pareces cansado !!, concentrate y teclea como siempre'
					if(percentDiv*200<diff && percentDiv*400>diff)
						hint='Noup, Noup, Noup !!'
					if(percentDiv*400<diff && percentDiv*700>diff)
						hint='Ehhhh !!'
					if(percentDiv*700<diff)
						hint='Si quieres acceder creo que será mejor contactar con el usuario original, no crees?'
					res.render('BioNode:auth.ejs',{
						hint: hint
					})
				}
			}else{
				res.render('BioNode:samples.ejs')
			}
		})
	}

	samplesTraining(req,res,next,success){
		//TODO Verificar la contrasenna
		
		this.R.getModels('BioNode').biouser
		.findOne({
			where:{
				username: req.user.username
			}
		})
		.then(function(bio){
			if(!bio){
				var raw=JSON.parse(req.body.biosamples);
				var userKeystroke=new UserKeystroke();

				userKeystroke.addSamples(raw)
				var result=userKeystroke.train()

				return this.create({
					username: req.user.username,
					data: JSON.stringify(userKeystroke.getData())
				})
			}
		})
		.then(function(){
			res.render('BioNode:auth.ejs',{
				hint:''
			})
		})
	}
}

module.exports=KDynamics;