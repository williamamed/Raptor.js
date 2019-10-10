

module.exports = class Register {

    /**
     * @Injectable
     */
    static createTroodon(AnnotationFramework, Events, SecurityRegistry) {

        AnnotationFramework
            .build('Troodon', true)
            .on('file', function (meta, reader, file, data) {

                if (meta.definition) {
                    var protect = [];
                    if (typeof meta.definition.value == 'string') {
                        protect.push(meta.definition.value)
                    } else {
                        protect = meta.definition.value;
                    }

                    if (data && data.prototype instanceof R.Controller) {

                        protect.forEach(function (ruta) {

                            SecurityRegistry
                                .get('Troodon')
                                .setLogin(ruta, meta.definition.login ? meta.definition.login : "troodon:auth", meta.definition.token ? meta.definition.token : false)
                        })

                    } else {

                        Events.on('securityManager:configured.Troodon', function () {

                            protect.forEach(function (ruta) {
                                SecurityRegistry
                                    .get('Troodon')
                                    .setLogin(ruta, meta.definition.login ? meta.definition.login : "troodon:auth", meta.definition.token ? meta.definition.token : false)
                            })
                        })
                    }
                }


            })
    }

    /**
     * @Injectable
     */
    static createPrivilege(AnnotationFramework, AnnotationReaderCache, SecurityRegistry, DynamicPrivilege) {
        var methodsRoute = require('methods');
        const rxjs = require('rxjs')
        const methods = [];

        rxjs.from(methodsRoute)
            .subscribe((val) => {
                methods.push(val[0].toUpperCase() + val.substring(1))
            })
        methods.push('Route')
        methods.push('All')

        AnnotationFramework
            .build('Privilege', true)
            .on('file', function (meta, reader, file, scope) {
                if (scope && scope.prototype instanceof R.Controller) {
                    var comp = AnnotationReaderCache.getDefinition('Route', $i('RecurseUp')(file));
                    
                    var prefix=comp ? comp.value : '';

                    let target;
                    for (let index = 0; index < methods.length; index++) {
                        if (AnnotationReaderCache.getDefinition(methods[index], file)) {
                            target = methods[index];
                            break;
                        }
                    }

                    if (target) {
                        var route = AnnotationReaderCache.getDefinition(target, file);
                        if(route && route.value)
                            prefix = prefix + route.value;
                        
                        if (meta.definition)
                            DynamicPrivilege.addPrivilege(meta.definition.value, prefix, meta.defintion.class)

                    }
                    var ctrl=AnnotationReaderCache.getDefinition('Controller', file);
                    if(ctrl.value){
                        prefix = prefix + ctrl.value;
                        if (meta.definition)
                            DynamicPrivilege.addPrivilege(meta.definition.value, prefix, meta.defintion.class)
                    }

                    meta.methods.forEach(function (methodAnnotation) {
                        let targetMethod;
                        for (let index = 0; index < methods.length; index++) {
                            if (AnnotationReaderCache.getMethod(methods[index], file, methodAnnotation.target)) {
                                targetMethod = methods[index];
                                break;
                            }
                        }
                        
                        if (targetMethod) {
                            var routeMethod = AnnotationReaderCache.getMethod(targetMethod, file, methodAnnotation.target);
                            if(routeMethod && routeMethod.value)
                                prefix = prefix + routeMethod.value;
                            
                            DynamicPrivilege.addPrivilege(methodAnnotation.value, prefix, methodAnnotation.class)

                        }
                    })


                }
            })


    }
}