/*
* Raptor.js - Node framework
* 
* CommonJS Controller
*
*/
module.exports={
	'/example/second': function(req, res){
		
		this.R.getModels('exampleNode').User.findAll().then(function(users) {
		  res.end('Hola mundo second '+users[0].get('car'))
		})
		//return "hola controller second"
	},

	testfunction:function(){
		return "hola function"
	}
}