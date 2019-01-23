'use strict';
const ejs=require('ejs')
const fs=require('fs')
const path=require('path')
const lodash=require('lodash')

class ngPortal{

	constructor(name){
		this.name=name;
		this.req=null;
		this.protect=false;
		this.securityMenu=false
		this.profile=false
	}
    
    
    viewPlugin(hotpot,content){
        if(this.req){
            
            this.req.viewPlugin.set('ngPortal_'+hotpot,content)
        }
        return this
    }
    
    disableProfile(){
        this.profile=false
        return this
    }
    
    disableSecurityMenu(){
        this.securityMenu=false
        return this
    }
   
    template(a,b){
        var div=a.split(':')
        b=lodash.extend( (b)?b:{} ,{ R: $get('R').viewFunctions });
        
		b.R.__setRequest(this.req);
        if(div.length==2 && $get('R').bundles[div[0]]){
            var view=path.join($get('R').basePath,'src',$get('R').bundles[div[0]].path,'Views',div[1]);
			
			return ejs.render(fs.readFileSync(view).toString(),b)
		}else{
			return ejs.render(fs.readFileSync(a),b)
		}
        
    }
    
    run(req,res,next){
        this.req=req
        this.next=next
        this.res=res
        var result=this.definition.call(this,next)
        
        if(result && result.then){
            result.then(function(){
                next()
            })
        }else
            next()
            
           
    }
    
    config(definition){
        this.definition=definition;
		return this;
    }
    
    auth(template,callback){
        this.protect=true
        var self=this;
        this.securityMenu=true
        this.profile=true
        if( typeof template=='function'){
            callback=template
            template=undefined
        }
        
        $get('R').on('before:middleware',function(){
            var securityManager='Troodon'
            if(typeof callback == 'function')
                securityManager='ngPortal'+self.name
            var promise=$get('R').getSecurityManager(securityManager)
    			        .setLogin('/'+self.name+'([\/\w*]*)?',template?template:'TroodonNode:auth')
    	    self.securityManager=promise;
    	    self.securityManager.logout=function(callbackLogout){
    	        self.logout=callbackLogout;
    	    }
    	    self.logout=function(req,res,next){
    	        req.logout();
        		req.session.save(function(){
        			res.redirect('/'+req.params.base+'/home')
        		})
    	    }
    	    if(typeof callback == 'function')
    	        callback.call(self,promise)
        })
        
        return this;
    }
}

module.exports=ngPortal;