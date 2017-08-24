/*
* Raptor.js - Node framework
* 
* CommonJS Controller
*
*/
module.exports={
	'/example/database/findall': function(req, res){
		
		this.R.getModels('exampleNode').users.findAll().then(function(users) {
		  res.end('Nombre del primer usuario devuelto: '+users[0].get('username'))
		})
		//return "hola controller second"
	},

	testfunction:function(){
		return "hola function"
	}
}