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
	stack(R){

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
			req.viewPlugin.set('raptor_profiler','<div title="Tiempo respuesta" style="display:inline-block"><img height="25" src="/public/rmodules/Raptorjs/RaptorNode/img/minify-panel/time.png" style="overflow:visible"><b>'+Math.floor((process.hrtime(req.profiler.start)[1]/1e9)*1000)/1000+'</b> seg</div> | ')
			var ram=process.memoryUsage()
			req.viewPlugin.set('raptor_profiler','<div title="Tiempo respuesta" style="display:inline-block"><img height="25" src="/public/rmodules/Raptorjs/RaptorNode/img/minify-panel/ram.png" style="overflow:visible">'+Math.floor(ram.heapUsed/(1024*1024))+'MB - '+Math.floor(ram.heapTotal/(1024*1024))+'MB</div>')
		})

		R.app.use(function(req,res,next){

			req.profiler={
				start: process.hrtime()
			}
			
			res.on('finish',function(){
				
			})
			next();
		})
	}
}
module.exports=RaptorNode