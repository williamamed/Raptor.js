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

	firstAction(req,res,next){
		console.log('uno')
		return 'ss'
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
		/**if(req.isAuthenticated())
			console.log('aut')
		else
			console.log('no aut')*/
		
		res.render('RaptorNode:Panel/index',function(err, str){
		    if (err) return req.next(err);
		    
		    res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><script type="text/javascript">Raptor={get:function(){alert("sss")}}</script>'+str)
		  });

	}

	/**
	* 
	* 
	*
	*/
	descriptionAction(req,res,next){
		
		res.render('RaptorNode:Panel/description');
	}

}
module.exports=PanelController;
