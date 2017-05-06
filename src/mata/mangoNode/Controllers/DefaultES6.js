"use strict";
var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class DefaultController extends Controller{

	configure(){
		this.route('all','/example/controller',this.indexAction) 
	}

	indexAction(req,res,next){
		return "hola mundo controller";
	}
}
module.exports=DefaultController;
