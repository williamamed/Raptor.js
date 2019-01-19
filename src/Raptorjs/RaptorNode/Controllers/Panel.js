"use strict";
var Controller=require('raptorjs').Controller
var UX=require('raptorjs').getNode('exampleNode');
var lodash=require('lodash');
var fs=require('fs');
var path=require('path')


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
			'/': this.rootAction,
			'/raptor/credentials': this.credentialsAction,
			'/raptor/savecredentials': this.saveCredentialsAction
		})
		

	}

	/**
	* 
	*
	*
	*
	*/
	rootAction(req,res,next){
	    if(this.R.options.mode!='development')
	        next()
	    else
		    res.redirect('/raptor/home')
	}
    
    /**
	* 
	* @Route("/miaaaaaaaa")
	*/
	root2Action(req,res,next){
		res.redirect('/raptor/home')
	}
    
	/**
	* 
	* 
	*
	*/
	raptorAction(req,res,next){
		res.redirect('/raptor/home')

	}

	/**
	* 
	* 
	*
	*/
	descriptionAction(req,res,next){
		var pack = require(this.R.basePath+"/package.json");
		
		res.render('RaptorNode:Panel/description',{
			version:"v"+pack.version
		},function(err,str){
		    
			res.json({
				extjs:false,
				content: str
			})
		});
		
	}

	credentialsAction(req,res){
		
		res.render('RaptorNode:ng/profile',{
			username: this.R.options.panel.username
		});
		
	}


	saveCredentialsAction(req,res){
		
		if(req.body.current_password==this.R.options.panel.password){
		    var options=lodash.extend(this.R.options);

		
    		req.mapOption('password','panel.password',options);
    		req.mapOption('username','panel.username',options);
    		req.mapOption('username','panel.secure',options,function(value){
    			return true
    		});
    		res.show("Las credenciales fueron actualizadas, estamos reiniciando el server.")
            var replacer = this.R.app.get('json replacer');
    		var spaces = this.R.app.get('json spaces');
    		var body = JSON.stringify(this.R.options, replacer, spaces);
    
    		var fd=fs.openSync(this.R.basePath+'/config/options.json','w')
    		fs.writeSync(fd,body);
    		fs.closeSync(fd);
		}else{
		    res.show("La contraseña actual no es correcta",3)
		}
		
		
		/**this.R.options=options;
		this.R.makeUpdate=true;
		req.session.save(function(){
			res.redirect('/raptor#/raptor/credentials')
		})*/
		
	}

	/**
	* 
	* 
	*
	*/
	logoutAction(req,res,next){
		
		delete req.session.raptor_panel;
		req.session.save(function(){
			res.redirect('/raptor')
		})
		
	}


}
module.exports=PanelController;
