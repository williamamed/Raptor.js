'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class Deamon extends Controller{

	configure(){
		this.route('get','/raptor/deamon',this.indexAction)

	}

	indexAction(req,res,next){
		
		res.render("DeamonNode:index.html.ejs");
	}
}

module.exports=Deamon;