/*
* Raptor.js - Node framework
* 
* Commonjs Controller
*
*/
module.exports={
	
	'/raptor/controller': function(req, res){
		var cmd=require('raptorjs').CommandLine;
		var cmdInstance=new cmd(this.R.basePath);
		
		console.log('ruta')
		return "hola controller second"
	}
}
