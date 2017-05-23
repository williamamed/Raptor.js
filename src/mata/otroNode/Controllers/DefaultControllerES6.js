'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class otro extends Controller{

	configure(){
		this.route('get','/otro/example',this.indexAction)

	}

	indexAction(req,res,next){
		
		res.send("hola mundo otro controller");
	}
}

module.exports=otro;