'use strict';
var aop=require('js_aop')
var KDYN=require('./Controllers/KDynamics')
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
	middleware(R){
	    
		if(R.bundles['TroodonNode'])
			R.bundles['TroodonNode'].hooks.middleware('after').promise.then(function(){
				if(typeof R.getSecurityManager('Troodon')._criteria =='function' )
					R.aop.before(R.getSecurityManager('Troodon'),'_criteria',function(success,args){
						var req=args[0];
						var res=args[1];
						if(!req.isAuthenticated()){
							delete req.session.bioKey;
							delete req.session.keystroke;
							
							req.res.render('BioNode:login',{},function(err,str){
								req.viewPlugin.set('after_response_body',str)
							})
							
							
						}
						return success(req,res,args[2])
					})
				else
					R.getSecurityManager('Troodon').setCondition(function(req,res,next){
						if(!req.isAuthenticated()){
							delete req.session.bioKey;
							delete req.session.keystroke;
							
							req.res.render('BioNode:login',{},function(err,str){
								req.viewPlugin.set('after_response_body',str)
							})
							
							return true;
						}
						return false;
					})

				R.aop.before(R.getSecurityManager('Troodon'),'_authentication',function(success,args){
					
					var req=args[0];
					var username=args[1];
					var password=args[2];
					if(req.body.bio){
						req.session.keystroke=JSON.parse(req.body.bio)
					}
					success(args[0],args[1],args[2],args[3])
				})
				
				R.aop.before(R.getSecurityManager('Troodon'),'_authorization',function(success,args){
					var req=args[0];
					var res=args[1];
					if(!req.session.bioKey){
						if(req.is('application/x-www-form-urlencoded')){

							if(req.body.biosamples){
								var kdyn=new KDYN(R)
								kdyn.samplesTraining(req,res,args[2],success)
							}

							if(req.body.sampletest){
								var kdyn=new KDYN(R)
								kdyn.testSampleUser(req,res,args[2],success,JSON.parse(req.body.sampletest))
							}

						}else{
							if(req.session.keystroke){
								var kdyn=new KDYN(R)
								kdyn.testSampleUser(req,res,args[2],success,req.session.keystroke)
							}else{
								R.getModels('BioNode').biouser
								.findOne({
									where:{
										username: req.user.username
									}
								})
								.then(function(bio){
									if(!bio)
										res.render('BioNode:samples.ejs')
									else
										res.render('BioNode:auth.ejs',{
											hint:''
										})
								})
							}
							
						}
						
					}else
						success(req,res,args[2])
					
				})
				
			})
		//console.log('El modulo BioNode está en modo beta.')
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
	configure(R){
	    R.on('database:running',function(){
	        R.migration('BioNode')
	    })
		
	}
}
module.exports=BioNode