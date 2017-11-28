/*
* Raptor.js - Node framework
* 
* CommonJS Controller
*
*/
module.exports={
	'/Uxjs/commonjs/example': function(req, res){
		
		return "hola controller Uxjs"
	},

	'/Uxjs/commonjs/example2':{
		method:'get',
		action: function(req, res){
		
			return "hola controller Uxjs"
		}
	}
}
