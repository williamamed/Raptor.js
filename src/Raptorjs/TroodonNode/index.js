'use strict';
var aop=require('js_aop')
/*
* Raptor.js - Node framework
* Generado por Raptor.js
* 
*
*/
class TroodonNode {

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
		
		

		R.getSecurityManager('Troodon')
			.setLogin('/troodon([\/\w*]*)?','TroodonNode:auth')
			.setAuthentication(function(req,username,password,done){

				R.getModels('TroodonNode').security_user.findOne({
					where:{
						username: username,
						state: 1
					},
					include: [{
				        model: this.R.getModels('TroodonNode').security_rol
				    },{
				        model: this.R.getModels('TroodonNode').security_estructure
				    }]
				}).then( user => {
					if(user){
						R.getModels('TroodonNode').security_user.validPassword(password, user.password , done, user, req)
					}else{
						req.flash('panel_login_error','El usuario o la contraseña son inválidos')
						req.session.save(function(){
							done(null, false)
						})
					}
				})
				
			})
			.setAuthorization(function(req,res,next){

				var matchingRoutes=this.R.app._router.matchRequests(req)
				var paths=[]
				for (var i = 0; i < matchingRoutes.length; i++) {
					paths.push(matchingRoutes[i].path)
				};
				var roles=req.user.idRol
				var result=null;
				this.R.getModels('TroodonNode').security_privilege
				.findAll({
					include: [
					     { 
					     	model: this.R.getModels('TroodonNode').security_rol, 
					     	where: { 
					     		id: {
					     			$in: roles
					     		}
					     	}
					     }
					  ],
					where:{
						route:{
							$in: paths
						}
					}
				})
				.then(function(proy){
					if(proy.length>0){
						return this.findAll({
									attributes:['route'],
									include: [
									     { 
									     	attributes:[],
									     	model: this.R.getModels('TroodonNode').security_rol, 
									     	where: { 
									     		id: {
									     			$in: roles
									     		}
									     	}
									     }
									  ],
									 where:{
									 	type:{
							     			$in:[0,1]
							     		}
									 }
								})
					}else{
						req.logger.alert('Access Denied Route: '+req.url+' \nMethod: '+req.method+' \nParams: '+JSON.stringify(req.body))
						res.end('access denied')
					}
				})
				.then(function(actions){
					req.viewPlugin.set('raptor_client',{
						name:"secureTroodon",
						callback: require(__dirname+'/Lib/ClientFunction').control
					})
					req.viewPlugin.set('raptor_client',{
						name:"controlActions",
						callback: require(__dirname+'/Lib/ClientFunction').control
					})
					req.viewPlugin.set('raptor_client',{
						name:"dataTroodon",
						callback:{
							actions: actions,
							root: req.url
						}
					})
					next()
				})
				.catch(function(e){
					console.log(e)
					res.end('access denied for some error')
				})
				
			})
			.setAuditories(function(req,res,next){
				
				req.logger.info('Route: '+req.url+' \nMethod: '+req.method+' \nParams: '+JSON.stringify(req.body))
				next()
		})

		

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
		var parseUrl = require('express/node_modules/parseurl');

		R.app.use(function(req,res,next){
			req.logger={
				EMERGENCY:1,
				ALERT:2,
				CRITICAL:3,
				FATAL:3,
				ERROR: 4,
				WARN: 5,
				NOTICE: 6,
				INFO: 7,
				DEBUG: 8,

				log:function(level,log){
					this.write(req.user.username,req.ip,level,new Date(),log)
				},

				info:function(log){
					this.log(this.INFO,log)
				},
				notice:function(log){
					this.log(this.NOTICE,log)
				},
				warning:function(log){
					this.log(this.WARN,log)
				},
				error:function(log){
					this.log(this.ERROR,log)
				},
				critical:function(log){
					this.log(this.CRITICAL,log)
				},
				fatal:function(log){
					this.log(this.CRITICAL,log)
				},
				alert:function(log){
					this.log(this.ALERT,log)
				},
				emergency:function(log){
					this.log(this.EMERGENCY,log)
				},
				write:function(username,ip,state,a_date,log){
					R.getModels('TroodonNode').security_trace
					.create({
						username: username,
						ip: ip,
						state: state,
						a_date: a_date,
						log: log
					})
					.then(function(){

					})
				}
			}
			
			next();
		})

		R.app._router.matchRequests = function(req, i, head){
		  var method = req.method.toLowerCase()
		    , url = parseUrl(req)
		    , path = url.pathname
		    , routes = this.map
		    , i = i || 0
		    , route;

		  // HEAD support
		  if (!head && 'head' == method) {
		    route = this.matchRequest(req, i, true);
		    if (route) return route;
		     method = 'get';
		  }
		  var result=[]
		  // routes for this method
		  if (routes = routes[method]) {

		    // matching routes
		    for (var len = routes.length; i < len; ++i) {
		      route = routes[i];
		      if (route.match(path)) {
		        //req._route_index = i;
		        result.push(route);
		      }
		    }
		  }
		  return result;
		};


		R.migration('TroodonNode')

	}
}
module.exports=TroodonNode