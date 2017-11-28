'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class Uxjs extends Controller{

	configure(){
		this.route('get','/uxjs',this.portalAction)
		this.route('get','/uxjs/description',this.descriptionAction)
		this.route('get','/uxjs/logout',this.logoutAction)

	}

	
	portalAction(req,res,next){
		res.render('UxjsNode:home/index.html.ejs',{
			appname: 'Uxjs',
			idStructure: 1
		})
	}

	descriptionAction(req,res,next){
		res.render('UxjsNode:home/description.html.ejs',{},function(err,str){
			if(err)
				console.log(err)
			res.json({
				extjs:false,
				content: str
			})
			
			
		})
	}

	logoutAction(req,res,next){
		req.logout();
		res.redirect('/uxjs')
	}
}

module.exports=Uxjs;