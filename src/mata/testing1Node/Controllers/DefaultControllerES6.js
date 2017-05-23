'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class testing1 extends Controller{

	configure(){
		this.route('get','/testing1/example',this.indexAction)

	}

	indexAction(req,res,next){
		
		res.send("hola mundo testing1 controller");
	}
}

module.exports=testing1;