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
			req.viewPlugin.set('raptor_profiler','<span>Tiempo respuesta:'+process.hrtime(req.profiler.start)[1]/1e9+' sec</span>')
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