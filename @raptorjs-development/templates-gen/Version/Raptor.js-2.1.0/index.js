const tables = []

module.exports = {
    version: "Raptor.js-2.1.0",
    templates: {
        
        "controlador": {
            title: "Controlador básico, incluye solo la definición de la clase y la declaración de la ruta base",
            fields: [{
                type:"text",
                label:"Nombre de la clase",
                name:"className",
                placeholder:"ej. MiClase",
                required: true
            },{
                type:"text",
                label:"Ruta base",
                name:"baseRoute",
                placeholder:"ej. /miruta/holamundo",
                required: true
            },{
                type:"text",
                placeholder:"ej. exampleNode:plantillas/miplantilla.ejs",
                label:"Ruta de la plantilla ejs (dejar en blanco para no utilizar)",
                name:"templateName"
            }],
            action: function (req,R, ProjectManager) {
                
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")

                if(req.body.className && req.body.baseRoute){
                    req.body.templateName=req.body.templateName?req.body.templateName:""
                    fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Controllers',req.body.className+'.js'),
                    R.template(path.join(__dirname,'templates','controller-basic','controller.ejs'),req.body))
                    
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        },
        
        "command": {
            title: "Plantilla de definición de un archivo de línea de comando para raptor-cli",
            fields: [{
                type:"text",
                label:"Comando y argumentos",
                placeholder:"micomando <argumentos> <otro>",
                name:"command",
                required: true
            },{
                type:"text",
                label:"Descripción",
                name:"description",
                placeholder:"Explica que hace este comando",
                required: true
            }],
            action: function (req,R,ProjectManager) {
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")
                
                if(req.body.command && req.body.description){
                    
                    if(!fs.existsSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Commands')))
                        fs.mkdirSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Commands'))
                    
                    fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Commands',req.body.command.split(" ")[0]+'.js'),
                    R.template(path.join(__dirname,'templates','command','command.ejs'),req.body))
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        },
        "compressor": {
            title: "Plantilla de definición de un Compresor de recursos web js, css",
            
            action: function (req,R,ProjectManager) {
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")
                
                if(!fs.existsSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Compressor')))
                    fs.mkdirSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Compressor'))
                    
                fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath,'Compressor','Compress.js'),
                R.template(path.join(__dirname,'templates','compressor','compressor.ejs'),{}))
                
            }
        },
    }
}