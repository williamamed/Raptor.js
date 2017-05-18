'use strict';
var aop=require('js_aop')

/*
* Raptor.js - Node framework
* 
* 
*
*/
class RaptorNode {
	/*
	* Raptor.js - Node framework
	* 
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	middleware(R){
		return;
		R.app.use('/raptor',function(req,res){
			res.render('RaptorNode:Panel/auth')
		})
	}
	/*
	* Raptor.js - Node framework
	* 
	* Entrada de configuracion del componente
	* se ejecuta cuando se registran los componentes
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	configure(R){
		var con=require('./Controllers/DefaultCommon')
		aop.before(con,'/Raptor/controller2',function(req,res,next){
			res.end('before')
		})
		R.setViewPlugin('raptor_client',{
			name:'testFun',
			callback:function(){
				alert(this.language.getCurrentLanguage())
			}
		})
		
		R.on('sendresponse',function(req){
			var ram=process.memoryUsage();
			
			var routesDef={};

			for (var i in R.app.routes) {
				
				for (var j in R.app.routes[i]) {
					if(routesDef[R.app.routes[i][j].path])
						routesDef[R.app.routes[i][j].path].push(R.app.routes[i][j].method)
					else
						routesDef[R.app.routes[i][j].path]=[R.app.routes[i][j].method]
					
				}
				
			};

			req.res.render('RaptorNode:minify-panel/profiler-min',{
				time: Math.floor((process.hrtime(req.profiler.start)[1]/1e9)*1000)/1000,
				memory: Math.floor(ram.heapUsed/(1024*1024))+'MB - '+Math.floor(ram.heapTotal/(1024*1024))+'MB',
				routes: Object.keys(routesDef).length,
				routesDef: routesDef,
				session: req.user,
				auth: req.isAuthenticated(),
				lang: req.language.getCurrentLanguage()
			},function(err,str){

				req.viewPlugin.set('raptor_profiler',str)
			})
			
		})

		R.app.use(function(req,res,next){

			req.profiler={
				start: process.hrtime()
			}
			
			next();
		})
		R.on('serverrunning',function(){
			if(R.io)
				R.io.on('connection', function(socket) {  
				    console.log('Un cliente se ha conectado');
				    socket.emit('messages',{text:'hola'});
				});	
		})
		
	}
}
module.exports=RaptorNode;
