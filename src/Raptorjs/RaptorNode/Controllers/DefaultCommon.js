var fs=require('fs')
/*
* Raptor.js - Node framework
* 
* Commonjs Controller
*
*/
module.exports={
	
	'/raptor/controller': function(req, res){
		var options=require(this.R.basePath+'/config/options.json');
		
		var replacer = this.R.app.get('json replacer');
		var spaces = this.R.app.get('json spaces');
		var body = JSON.stringify(options, replacer, spaces);

		var fd=fs.openSync(this.R.basePath+'/config/options8.json','w')
		fs.writeSync(fd,body);
		fs.closeSync(fd);
		return "hola controller second"
	}
}
