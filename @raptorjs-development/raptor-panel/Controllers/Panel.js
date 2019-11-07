"use strict";

var lodash=require('lodash');
var fs=require('fs');
var path=require('path')


/*
* Raptor.js - Node framework
* Controlador ES6
* 
* 
*/
class PanelController extends R.Controller{

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
		
		res.render('raptor-panel:Panel/description',{
			version:"v"+pack.version
		},function(err,str){
		    
			res.json({
				extjs:false,
				content: str
			})
		});
		
	}

	credentialsAction(req,res){
		
		res.render('raptor-panel:ng/profile',{
			username: this.R.options.panel? this.R.options.panel.username:''
		});
		
	}


	saveCredentialsAction(req,res){
		var changepass=false;
		if(!this.R.options.panel || (this.R.options.panel && this.R.options.panel.secure!==true)){
			changepass=true
		}else{
			if(req.body.current_password==this.R.options.panel.password){
				changepass=true
			}
		}

		if(changepass){
		    var options={};
			try {
				delete require.cache[path.join(R.basePath, 'config','options.json')]
				options = require(path.join(this.R.basePath, 'config','options.json'));
			} catch (error) {
				console.log('Error leyendo options.json:',error.message)
			}
			if(!options.panel)
				options.panel={}
    		req.mapOption('password','panel.password',options);
    		req.mapOption('username','panel.username',options);
    		req.mapOption('username','panel.secure',options,function(value){
    			return true
    		});
    		res.show("Las credenciales fueron actualizadas, estamos reiniciando el server.")
            
    		var body = JSON.stringify(options, null, 2);
    
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
