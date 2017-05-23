/*
* Raptor.js - Node framework
* 
* CommonJS Controller
*
*/
module.exports={
	'/otro/commonjs/example': function(req, res){
		
		return "hola controller otro"
	},

	'/otro/commonjs/example2':{
		method:'get',
		action: function(req, res){
		
			return "hola controller otro"
		}
	}
}
