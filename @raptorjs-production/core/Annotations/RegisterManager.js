'use strict';

const path = require('path')
const cors = require('cors')

class RegisterManager{
	
	/**
     * @Injectable
     */
	static configuringRoute(meta, reader, file, scope, forceMethod, AnnotationFramework, AnnotationReaderCache){
		if (scope && scope.prototype instanceof R.Controller) {
					

			var comp = AnnotationReaderCache.getDefinition('Route', $i('RecurseUp')(file));
			var routeAnnotationClass = AnnotationReaderCache.getDefinition('Route',file);
			var ctrlClass = AnnotationReaderCache.getDefinition('Controller',file);

			var prefixClass = '';
			var prefix = '';
			if (comp)
				prefix = comp.value;

			var routeClass;
			var routes = [];

			if (meta.definition && meta.definition.target) {
				prefixClass = meta.definition.value;
				routeClass = meta.definition;
			}
			if(routeAnnotationClass && routeAnnotationClass.value){
				prefixClass=routeAnnotationClass.value;
				routeClass = routeAnnotationClass;
			}
			if(ctrlClass && ctrlClass.value){
				prefixClass=ctrlClass.value;
				routeClass = ctrlClass;
			}
			prefix += prefixClass;
			
			meta.methods.forEach(function (annotation) {
				if (routeClass) {
					//before
					annotation.before = annotation.before ? annotation.before : []
					routeClass.before = routeClass.before ? routeClass.before : []
					annotation.before = routeClass.before.concat(annotation.before)
					//after
					annotation.after = annotation.after ? annotation.after : []
					routeClass.after = routeClass.after ? routeClass.after : []
					annotation.after = routeClass.after.concat(annotation.after)
				}

				if (comp) {
					//before
					annotation.before = annotation.before ? annotation.before : []
					comp.before = comp.before ? comp.before : []
					annotation.before = comp.before.concat(annotation.before)
					//after
					annotation.after = annotation.after ? annotation.after : []
					comp.after = comp.after ? comp.after : []
					annotation.after = comp.after.concat(annotation.after)
				}
				annotation.value?annotation.value:"";

				if (annotation.method)
					routes.push({
						method: forceMethod ? forceMethod: annotation.method,
						action: annotation.target,
						before: annotation.before,
						after: annotation.after,
						route: prefix + (annotation.value?annotation.value:'')
					})
				else
					routes.push({
						method: forceMethod ? forceMethod:'all',
						action: annotation.target,
						before: annotation.before,
						after: annotation.after,
						route: prefix + (annotation.value?annotation.value:'')
					})

			})

			//console.log('annalizing', file, routes)
			
			if (scope){
				scope.prototype._meta=scope.prototype._meta?scope.prototype._meta.concat(routes):routes;
				//console.log('annalizing2', file, scope.prototype._meta)

				scope.prototype.getRoutesDefinition = function () {
					//console.log('annalizing', file, this._meta)
					return {
						controller: file,
						routes: this._meta
					};
				}
			}
		}
	}

    /**
     * @Injectable
     */
    static createRoute(AnnotationFramework, AnnotationReaderCache){
		var methodsRoute=require('methods');
		const rxjs=require('rxjs')
		const methods={};

		rxjs.from(methodsRoute)
		.subscribe((val)=>{
			methods[val[0].toUpperCase()+val.substring(1)]=val;
		})
		methods.Route=false;
		methods.All='all';
		
		rxjs.pairs(methods)
			.subscribe((value)=>{
				AnnotationFramework
					.build(value[0], true)

					.on('file', function (meta, reader, file, scope) {
						
						RegisterManager.configuringRoute(meta, reader, file, scope,value[1]);
					})
			})
        

	

		AnnotationFramework
			.build('Development',true)
			.on('file',function(meta,reader, file, data){
				meta.methods.forEach(function (annotation) {
					
					if(data.prototype[annotation.target] && $i('Options').mode!='development'){
						var target=data.prototype[annotation.target];
						
						data.prototype[annotation.target]=function(req,res,next){
							var arg=arguments;
							for (const key in arg) {
								let element=arg[key];
								
								if(typeof element=='function' && element.name=='next'){
									
									next()
									return;
								}
								
							}
						}
					}else{
						if(data[annotation.target] && $i('Options').mode!='development'){
							var target=data[annotation.target];
							
							data[annotation.target]=function(req,res,next){
								var arg=arguments;
								for (const key in arg) {
									let element=arg[key];
									
									if(typeof element=='function' && element.name=='next'){
										
										next()
										return;
									}
									
								}
							}
						}
					}

				})
				
			})
		
    }


    /**
     * @Injectable
     */
    static createSessionFilter(AnnotationFramework, AnnotationReaderCache, SessionFilter){

        AnnotationFramework
			.build('SessionFilter', true)
			.on('file', function (meta, reader, file, scope) {
				if (meta.definition) {
					var compPath = $i('RecurseUp')(meta.definition.filePath);


					var route = AnnotationReaderCache.getDefinition('Route', meta.definition.filePath, meta.definition.target);
					var routePath = '';
					if (compPath != meta.definition.filePath) {
						var comp = AnnotationReaderCache.getDefinition('Route', compPath);
						if (comp) {
							routePath = comp.value;
						}
					}
					if (route) {
						routePath += route.value;
					}

					if (route) {
						if (routePath[routePath.length - 1] != '/')
							SessionFilter.push(routePath + '/*')
						else
							SessionFilter.push(routePath.substring(0, routePath.length - 1) + '/*')
					}
				}
				var compPath;
				
				meta.methods.forEach(function (annotation) {
					if (!compPath) {
						compPath = $i('RecurseUp')(annotation.filePath);
					}

					var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
					var routePath = '';

					var comp = AnnotationReaderCache.getDefinition('Route', compPath);
					if (comp) {
						routePath = comp.value;
					}

					var classRoute = AnnotationReaderCache.getDefinition('Route', annotation.filePath);
					if (classRoute) {
						routePath += classRoute.value;
					}

					if (route) {
						routePath += route.value;
					}
					
					if (routePath) {
						SessionFilter.push(routePath)
					}
				})
				
			})
    }


    /**
     * @Injectable
     */
    static createCsrf(AnnotationFramework, AnnotationReaderCache, CsrfFilter){

        AnnotationFramework
			.build('Csrf', true)
			.on('file', function (meta, reader, file, scope) {
				if (meta.definition) {
					var compPath = $i('RecurseUp')(meta.definition.filePath);


					var route = AnnotationReaderCache.getDefinition('Route', meta.definition.filePath, meta.definition.target);
					var routePath = '';
					if (compPath != meta.definition.filePath) {
						var comp = AnnotationReaderCache.getDefinition('Route', compPath);
						if (comp) {
							routePath = comp.value;
						}
					}
					
					if (route) {
						routePath += route.value;
					}

					if (route) {
						if (routePath[routePath.length - 1] != '/')
							CsrfFilter.push(routePath + '/*')
						else
							CsrfFilter.push(routePath.substring(0, routePath.length - 1) + '/*')
					}
				}
				var compPath;
				
				meta.methods.forEach(function (annotation) {
					if (!compPath) {
						compPath = $i('RecurseUp')(annotation.filePath);
					}

					var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
					var routePath = '';

					var comp = AnnotationReaderCache.getDefinition('Route', compPath);
					if (comp) {
						routePath = comp.value;
					}

					var classRoute = AnnotationReaderCache.getDefinition('Route', annotation.filePath);
					if (classRoute) {
						routePath += classRoute.value;
					}

					if (route) {
						routePath += route.value;
					}
					if (routePath) {
						CsrfFilter.push(routePath)
					}
					
				})
				
			})
    }


    /**
     * @Injectable
     */
    static createCors(AnnotationFramework, AnnotationReaderCache){

        AnnotationFramework
			.build('Cors', true)
			.on('file', function (meta, reader, file, scope) {
				if (meta.definition) {
					var compPath = $i('RecurseUp')(meta.definition.filePath);


					var route = AnnotationReaderCache.getDefinition('Route', meta.definition.filePath, meta.definition.target);
					var routePath = '';
					if (compPath != meta.definition.filePath) {
						var comp = AnnotationReaderCache.getDefinition('Route', compPath);
						if (comp) {
							routePath = comp.value;
						}
					}
					if (route) {
						routePath += route.value;
					}

					if (route) {
						if (routePath[routePath.length - 1] != '/')
							R.app.use(routePath + '/*',meta.definition.value ? cors(meta.definition.value) : cors())
						else
							R.app.use(routePath.substring(0, routePath.length - 1) + '/*',meta.definition.value ? cors(meta.definition.value) : cors())
						
					}
				}
				var compPath;
				
				meta.methods.forEach(function (annotation) {
					if (!compPath) {
						compPath = $i('RecurseUp')(annotation.filePath);
					}

					var route = AnnotationReaderCache.getMethod('Route', annotation.filePath, annotation.target);
					var routePath = '';

					var comp = AnnotationReaderCache.getDefinition('Route', compPath);
					if (comp) {
						routePath = comp.value;
					}

					var classRoute = AnnotationReaderCache.getDefinition('Route', annotation.filePath);
					if (classRoute) {
						routePath += classRoute.value;
					}

					if (route) {
						routePath += route.value;
					}
					if (routePath) {
						
						R.app.use(routePath,meta.definition.value ? cors(meta.definition.value) : cors())
						
					}
					
				})
					
				
			})
    }
}
module.exports=RegisterManager;