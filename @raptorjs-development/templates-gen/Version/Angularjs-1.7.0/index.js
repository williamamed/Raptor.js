
module.exports={
    version:"Angularjs-1.7.0",
    templates:{
        "basico":{
            title:"Crea la maqueta HTML completa para angularjs, incluye los archivos js y css, la definición del ng-app y un área de renderizado de fragmentos.",
            image:"",
            fields:[{
                type:"text",
                label:"Nombre de aplicación",
                name:"appName",
                placeholder:"ej. MiApp",
                required: true
            }],
            action:function(req, ProjectManager){
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar la plantilla.")
                
                
                if(req.body.appName){
                    
                    if(!fs.existsSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Resources',req.body.appName)))
                        fs.mkdirSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Resources',req.body.appName))
                    
                    if(!fs.existsSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Views',req.body.appName)))
                        fs.mkdirSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Views',req.body.appName))
                    
                    fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Resources',req.body.appName,'app.js'),
                    R.template(path.join(__dirname,'templates','basic','app.ejs'),{
                        appName: req.body.appName
                    }))

                    fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Views',req.body.appName,'index.ejs'),
                    R.template(path.join(__dirname,'templates','basic','page.ejs'),{
                        appName: req.body.appName,
                        routeApp: "/public/"+ProjectManager.components[req.body.component].vendor+"/"+req.body.component+"/"+req.body.appName+"/app.js"
                    }))
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        },
        "fragment":{
            title:"Crea un fragmento para angularjs, un fragmento es un solo una parte de la definición HTML de una funcionalidad y que es cargado en el ng-view de una interfaz padre.",
            image:"",
            fields:[{
                type:"text",
                label:"Nombre de aplicación",
                name:"appName",
                placeholder:"ej. MiApp",
                required: true
            },{
                type:"text",
                label:"Nombre de controlador",
                name:"controllerName",
                placeholder:"ej. MiController",
                required: true
            }],
            action:function(req,R, ProjectManager){
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar la plantilla.")
                
                
                if(req.body.appName && req.body.controllerName){
                    
                    if(!fs.existsSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Resources',req.body.appName)))
                        fs.mkdirSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Resources',req.body.appName))
                    
                    if(!fs.existsSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Views',req.body.appName)))
                        fs.mkdirSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Views',req.body.appName))
                    
                    fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Resources',req.body.appName,req.body.controllerName+'.controller.js'),
                    R.template(path.join(__dirname,'templates','fragment','controller.ejs'),{
                        appName: req.body.appName,
                        controllerName: req.body.controllerName
                    }))

                    fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Views',req.body.appName,req.body.controllerName+'.fragment.ejs'),
                    R.template(path.join(__dirname,'templates','fragment','fragment.ejs'),{
                        appName: req.body.appName,
                        controllerName: req.body.controllerName,
                        controllerRoute: "/public/"+ProjectManager.components[req.body.component].vendor+"/"+req.body.component+"/"+req.body.appName+"/"+req.body.controllerName+".controller.js"
                    }))
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        }
    }
}