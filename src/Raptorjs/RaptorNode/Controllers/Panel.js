"use strict";
var Controller=require('raptorjs').Controller
var UX=require('raptorjs').getNode('exampleNode');
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class PanelController extends Controller{

	configure(){
		
		this.routes({
			'/raptor':this.raptorAction,
			'/raptor/description':this.descriptionAction,
			'/': this.rootAction
		})
		

	}

	/**
	* 
	*
	*
	*
	*/
	rootAction(req,res,next){
		res.redirect('/raptor')
	}

	/**
	* 
	* 
	*
	*/
	raptorAction(req,res,next){
		
		// req.login({
		// 	name:'memo',
		// 	lastname: 'lolo'
		// },function(){

		// })
		if(req.isAuthenticated())
			console.log('aut')
		else
			console.log('no aut')

		res.render('RaptorNode:Panel/index');

	}

	/**
	* 
	* 
	*
	*/
	descriptionAction(req,res,next){

		res.render('RaptorNode:Panel/description',function(err,str){
			res.json({
				extjs:false,
				content: str
			})
		});
		
	}


}
module.exports=PanelController;
