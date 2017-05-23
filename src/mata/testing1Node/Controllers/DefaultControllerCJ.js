/*
* Raptor.js - Node framework
* 
* CommonJS Controller
*
*/
module.exports={
	'/testing1/commonjs/example': function(req, res){
		
		return "hola controller testing1"
	},

	'/testing1/commonjs/example2':{
		method:'get',
		action: function(req, res){
		
			return "hola controller testing1"
		}
	}
}
