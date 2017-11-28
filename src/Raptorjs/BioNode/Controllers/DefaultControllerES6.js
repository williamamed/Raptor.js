'use strict';

var Controller=require('raptorjs').Controller
var UserKeystroke=require('./../Library/UserKeystroke')
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class Bio extends Controller{

	configure(){
		this.route('get','/bio/logout',this.indexAction)
		this.route('get','/bio/remove',this.removeAction)
		this.route('get','/bio/test',this.testAction)
	}

	indexAction(req,res,next){
		delete req.session.bioKey;
		delete req.session.keystroke;
		req.logout()
		req.session.save(function(){
			res.end('logout')
		})
	}

	removeAction(req,res,next){
		this.R.getModels('BioNode').biouser
		.destroy({
			where:{
				username: req.user.username
			}
		})
		.then(function(user){
			if(user)
				res.end('El perfil biometrico del usuario '+user.username+' fue eliminado')
			else
				res.end('No se encontro el usuario')
		})

	}

	testAction(req,res,next){
		this.R.getModels('BioNode').biouser
		.findOne({
			where:{
				username: 'admin'
			}
		})
		.then(function(bio){
				
				var userKeystroke=new UserKeystroke();
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
	            	var sampleItem=userKeystroke.samples[i]
	            	var key=i;
	                var vectorProm=[];
	                var n=0;
	                for (var k = 0; k < userKeystroke.digraphSize; k++) {
	                	vectorProm.push(0)
	                };

	                for (var j = 0; j < userKeystroke.samples.length; j++) {
	                	var value=userKeystroke.getDigraph(userKeystroke.samples[j])
	            		var key2=j;
	                
	                    if (key != key2) {
	                    	n++
	                    	for (var k = 0; k < userKeystroke.digraphSize; k++) {
			                	vectorProm[k]+=value[k]
			                };
	                    }

	                }
	                for (var k = 0; k < userKeystroke.digraphSize; k++) {
	                	vectorProm[k]/=n
	                };
	               	var c=userKeystroke.som.distance(userKeystroke.getDigraph(sampleItem),vectorProm);
	                
	                mean+=c
	            }
	            
	            mean = mean / userKeystroke.samples.length;
	            console.log('promedio',mean,userKeystroke.samples.length)
				

	            var current=userKeystroke.som.grid[0][0]
	            var best=userKeystroke.som.get10BMU(current);

	            var dist=0;
	            for (var i = 0; i < best.length; i++) {
	            	var newVec=best[i];
	            	var p=userKeystroke.som.distance(current,newVec);
	            	dist+=p
	            	//console.log('current',p)
	            };
	            console.log('promedio2', dist/best.length)


		      	res.send(mean)
			
		})
	}

}

module.exports=Bio;