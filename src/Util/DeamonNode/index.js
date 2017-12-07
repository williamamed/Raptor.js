'use strict';

/*
* Raptor.js - Node framework
* Generado por Raptor.js
* 
*
*/
class DeamonNode {

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
		R.app.get('/raptor',function(req,res,next){
			
			req.res.render('DeamonNode:menu.html.ejs',{},function(err,str){

				req.viewPlugin.set('raptorpanel_bar_tools',str)
			})
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
		var schedule = require('node-schedule');
		R.bundles['DeamonNode'].config=require(R.basePath+'/cache/schedule.json');

		R.bundles['DeamonNode'].jobs={
			tasks:[],
			start:function(){
				for (var i = 0; i < this.tasks.length; i++) {
					this.tasks[i].cancel()
				};
				this.tasks=[]
				for (var i = 0; i < R.bundles['DeamonNode'].config.length; i++) {
					let t=R.bundles['DeamonNode'].config[i].command;
					this.tasks.push(schedule.scheduleJob(R.bundles['DeamonNode'].config[i].schedule, function(){
						eval(t)
					}))

				};
			}
		}
		R.bundles['DeamonNode'].jobs.start()
		
 		
		
	}
}
module.exports=DeamonNode