'use strict';
var aop=require('js_aop')

/*
* Raptor.js - Node framework
* 
* 
*
*/
class RaptorNode {
	/*
	* Raptor.js - Node framework
	* 
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	middleware(R){
		R.app.all("/raptor/home",function(req,res,next){
		    if(R.options.mode=="development")
		        $get('R').copyResources('RaptorNode',true)
		    
		    res.render('RaptorNode:ng/menu.ejs',{},function(err,str){
		        req.viewPlugin.set('raptorpanel_sidebar',str)
		        next()
		    })
		    
		})
		
		
	}
	/*
	* Raptor.js - Node framework
	* 
	* Entrada de configuracion del componente
	* se ejecuta cuando se registran los componentes
	* 
	* @param Raptor R instancia de la aplicacion Raptor
	*
	*/
	configure(R){
	    
	    R.on('ioc:ngPortal.ready',function(){
	       
	        var ngPortal=$get('ngPortal')
	        
	        var ngPortalRaptor=new ngPortal('raptor')
            ngPortalRaptor.config(function(){
		        
		        
		        this
		            .viewPlugin('start',this.template('RaptorNode:ng/description.ejs',{version:'v'+require($get('R').basePath+"/package.json").version}))
		            .viewPlugin('name','Raptor.js')
		            .viewPlugin('icon','/public/Raptor/img/raptor-logo.png')
		            .viewPlugin('header',this.template('RaptorNode:ng/header.ejs'))
		            .viewPlugin('sidebar',this.template('RaptorNode:ng/sidebar.ejs'))
		            .viewPlugin('navbar',this.template('RaptorNode:ng/navbar.ejs'))
		            .disableProfile()
		            .disableSecurityMenu()
		        
		    })
		    if(R.options.panel && R.options.panel.secure)
    		    ngPortalRaptor.auth('RaptorNode:Panel/auth',function(autenticator){
    		        
    		        autenticator
    		        .setCondition(function(req,res,next){
    					
    					if(!req.session.raptor_panel){
    						return true;
    					}else
    						return false;
    				})
    				.setAuthentication(function(req,username,password,done){
    				    
    					if(username==R.options.panel.username && password==R.options.panel.password){
    						req.session.raptor_panel={
    							username: username
    						}
    						
    					}else{
    						req.flash('panel_login_error','El usuario o la contraseña son inválidos')
    					}
    					req.session.save(function(){
    						req.res.redirect(req.url)
    					})	
    				})
    				.logout(function(req,res,next){
    				    delete req.session.raptor_panel;
                		req.session.save(function(){
                			res.redirect('/raptor/home')
                		})
    				})
    		    })
	        
		    $get('ngPortalRegistry').set(ngPortalRaptor)
		    
	    })
	    
	    
		
		R.on('sendresponse',function(req){
			var ram=process.memoryUsage();
			
			var routesDef={};

			for (var i in R.app.routes) {
				
				for (var j in R.app.routes[i]) {
					if(routesDef[R.app.routes[i][j].path])
						routesDef[R.app.routes[i][j].path].push(R.app.routes[i][j].method)
					else
						routesDef[R.app.routes[i][j].path]=[R.app.routes[i][j].method]
					
				}
				
			};

			req.res.render('RaptorNode:minify-panel/profiler-min',{
				time: Math.floor((process.hrtime(req.profiler.start)[1]/1e9)*1000)/1000,
				memory: Math.floor(ram.heapUsed/(1024*1024))+'MB - '+Math.floor(ram.heapTotal/(1024*1024))+'MB',
				routes: Object.keys(routesDef).length,
				routesDef: routesDef,
				session: req.user,
				auth: req.isAuthenticated(),
				lang: req.language.getCurrentLanguage()
			},function(err,str){

				req.viewPlugin.set('raptor_profiler',str)
			})
			
		})

		R.app.use(function(req,res,next){

			req.profiler={
				start: process.hrtime()
			}
			res.show=function(text,code,params){
				if(!code)
					code=1;
				if(typeof params != 'object' || !params )
					params={};
				
				if(typeof code=='object'){
					params=code;
					code=1;
				}
				res.json({
					msg:text,
					code:code,
					success: true,
					params:params
				})
			}


			next();
		})
		
		R.on('serverrunning',function(){
			if(R.io)
				R.io.on('connection', function(socket) {  
				    console.log('Un cliente se ha conectado');
				    socket.emit('messages',{text:'hola'});
				});	
		})
		
        
	}
}
module.exports=RaptorNode;
