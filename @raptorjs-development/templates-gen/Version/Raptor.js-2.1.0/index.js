const tables = []
for (const key in R.bundles) {
    for (const model in R.bundles[key].models) {
        tables.push({
            name: key.replace('Node', '') + '_' + model,
            text: key.replace('Node', '') + '_' + model
        })
    }
}


module.exports = {
    version: "Raptor.js-2.1.0",
    templates: {
        "migration": {
            title: "Plantilla de archivo de migración para un componente",
            fields: [{
                type:"text",
                label:"Número de migración",
                name:"numero",
                placeholder:"ej. 01",
                required: true
            },{
                type:"multiselect",
                label:"Modelo de base de datos",
                name:"modelo",
                required: true,
                options:tables
            }],
            action: function (req,R) {
                const fs=require('fs')
                const path=require('path')

                var modelos=""
                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")
                
                if(parseInt(req.body.numero)>0){

                }else
                    throw new Error("El número de migración especificado no es un valor numérico.")
                
                
                if(req.body.modelo){
                    modelos+=", "+req.body.modelo.join(", ")
                    if(!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath,'Migration')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath,'Migration'))
                    
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath,'Migration',req.body.numero+'-'+req.body.component+'.mig.js'),
                    R.template(path.join(__dirname,'templates','migration','migration.ejs'),{
                        modelos: modelos,
                        models: req.body.modelo
                    }))
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        },
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
            action: function (req,R) {
                
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")

                if(req.body.className && req.body.baseRoute){
                    req.body.templateName=req.body.templateName?req.body.templateName:""
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath,'Controllers',req.body.className+'.js'),
                    R.template(path.join(__dirname,'templates','controller-basic','controller.ejs'),req.body))
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        },
        "controlador-model": {
            title: "Controlador CRUD, incluye la definición de la clase, la declaración de la ruta base y las acciones insert, edit, delete, list así como sus respectivas implementaciones a partir de un modelo.",
            fields: [{
                type:"text",
                label:"Nombre de la clase",
                name:"className",
                placeholder:"ej. MiClase",
                required: true
            },{
                type:"text",
                label:"Ruta base",
                placeholder:"ej. /miruta/holamundo",
                name:"baseRoute",
                required: true
            },{
                type:"text",
                placeholder:"ej. exampleNode:plantillas/miplantilla.ejs",
                label:"Ruta de la plantilla ejs (dejar en blanco para no utilizar)",
                name:"templateName"
            },{
                type:"select",
                label:"Modelo de base de datos",
                name:"modelo",
                required: true,
                options:tables
            }],
            action: function (req,R) {
                
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")

                if(req.body.className && req.body.baseRoute && req.body.modelo){
                    req.body.templateName=req.body.templateName?req.body.templateName:""
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath,'Controllers',req.body.className+'.js'),
                    R.template(path.join(__dirname,'templates','controller-model','controller.ejs'),req.body))
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
            action: function (req,R) {
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")
                
                if(req.body.command && req.body.description){
                    
                    if(!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath,'Commands')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath,'Commands'))
                    
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath,'Commands',req.body.command.split(" ")[0]+'.js'),
                    R.template(path.join(__dirname,'templates','command','command.ejs'),req.body))
                }else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        },
        "compressor": {
            title: "Plantilla de definición de un Compresor de recursos web js, css",
            
            action: function (req,R) {
                const fs=require('fs')
                const path=require('path')

                if(!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")
                
                if(!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath,'Compressor')))
                    fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath,'Compressor'))
                    
                fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath,'Compressor','Compress.js'),
                R.template(path.join(__dirname,'templates','compressor','compressor.ejs'),{}))
                
            }
        },
    }
}