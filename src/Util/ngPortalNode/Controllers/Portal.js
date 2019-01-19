'use strict';

var Controller=require('raptorjs').Controller
var bcrypt = require('bcrypt-nodejs')

/**
* Raptor.js - Node framework
* Controlador ES6
* 
* @Route("")
*/
class ngPortal extends Controller{

	configure(){
	    
	}
    
    /**
     * @Route("/:base/home")
     * 
     */
	indexAction(req,res,next){
	    var portal=$get('ngPortalRegistry').get(req.params.base);
	    var self=this;	
	    
	    if(portal.securityMenu){
        	
    		this.R.getModels('TroodonNode').security_privilege
        		.getTreeByRol([1])
        		.then(function(tree){
        		    var menu=[]
        		    self.prepareMenu(menu,tree,1)
        		    res.render('ngPortalNode:portal.ejs',{
            		    appname:'ngPortal',
            		    version:'1.0.1',
            		    routename:req.params.base,
            		    security: portal.protect,
            		    profile: portal.profile,
            		    modules: menu
            		});
        		})
	    }else
	        res.render('ngPortalNode:portal.ejs',{
    		    appname:'ngPortal',
    		    version:'1.0.1',
    		    routename:req.params.base,
    		    security: portal.protect,
    		    profile: portal.profile,
    		    modules: []
    		});
	}
	
	/**
     * @Route("/:base/home/logout")
     * 
     */
	logoutAction(req,res,next){
	    
		$get('ngPortalRegistry').get(req.params.base).logout(req,res,next)
		
	}
	
	
	/**
     * @Route("/:base/home/description")
     * 
     */
	descriptionAction(req,res,next){
	    
		res.render('ngPortalNode:description.ejs')
		
	}
	
	/**
     * @Route("/:base/profile")
     * 
     */
	profileAction(req,res,next){
	    
	    this.R.getModels('TroodonNode').security_user
		.findOne({
		    where:{
    		    username: req.user.username
    		}
		})
		.then(function(proy){
			res.render('ngPortalNode:profile.ejs',{
    	        username: proy.username,
    	        nombre: proy.fullname,
    	        email:proy.email,
    	        user:proy.id
    	    })
		})
	    
	}
	
	/**
     * @Route("/:base/profile/profiledata")
     * 
     */
	profileDataAction(req,res,next){
	    var me=this;
		this.R.getModels('TroodonNode').security_user
		.findOne({
		    where:{
    		    username: req.user.username
    		}
		})
		.then(function(proy){
			
			var modified={
				'fullname': req.body.fullname,
				'email': req.body.email
			}
			
			return proy.update(modified)
		})
		.then(function(){
			res.show("El perfil fue editado")
		})
		.catch(function(error){
			res.show('Ocurrió un error en la operación',3)
		})

	}
	
	/**
     * @Route("/:base/profile/changepass")
     * 
     */
	profileChangepassAction(req,res,next){
	    var me=this;
		this.R.getModels('TroodonNode').security_user
		.findOne({
		    where:{
    		    username: req.user.username
    		}
		})
		.then(function(proy){
		    var finish=false;
		    var compare=false;
			bcrypt.compare(req.body.password, proy.password, function(err, isMatch){
			
			    if (isMatch) {
    			    compare=true
    			}
    			finish=true;
    		})
    		$get('R').waitUntil(finish)
    		if(compare){
    		    var modified={
    				'password': req.body.password
    			}
    			
    			return proy.update(modified)
    		}else{
    		    
    		    return Promise.reject("La contraseña actual no es correcta")
    		    
    		}
			
		})
		.then(function(){
			res.show("La contraseña fue actualizada")
		})
		.catch(function(error){
		    if(error instanceof Error)
		        res.show('Ocurrió un error en la operación',3)
		    else
		        res.show(error,3)
			
		})
	}
	
	
	prepareMenu(menu,tree,nested){
	    for (var i = 0; i < tree.length; i++) {
	        
	        var itemOrig=null;
	        if(tree[i].dataValues){
	            itemOrig=tree[i].dataValues;
	        }else{
	            itemOrig=tree[i]
	        }
	        
	        var item={
	            id: itemOrig.id,
	            name: itemOrig.name,
	            className: itemOrig.class_name,
	            type: itemOrig.type,
	            belongs: itemOrig.belongs,
	            leaf: itemOrig.leaf,
	            route: itemOrig.route,
	        };
	        
	        
	        if(itemOrig.children){
	            if(nested>1)
	                this.prepareMenu(menu,itemOrig.children,nested+1)
	            else{
	                item.children=[]
	                this.prepareMenu(item.children,itemOrig.children,nested+1)
	            }
	        }
	        menu.push(item)
	    }
	}
	
	
}

module.exports=ngPortal;