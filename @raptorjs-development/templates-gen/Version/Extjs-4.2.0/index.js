const fs = require('fs')
const path=require('path')
var bundle=R.bundles['extjs-designer']


module.exports = {
    version: "Extjs-4.2.0",
    templates: {
        "proyect": {
            title: "Esqueleto de proyecto para aplicación Extjs",
            fields: [{
                type: "text",
                label: "Nombre de la aplicación",
                name: "name",
                placeholder: "ej. GestUser",
                required: true
            }],
            image:"/public/"+bundle.vendor+"/extjs-designer/resources/img/extjs-logo-original.png",
            action: function (req) {
                var inspect = function (obj, ident) {
                    if (!ident)
                        ident = 0
                    var strIdent = ""
                    var strInit = ""
                    for (let index = 0; index < ident; index++) {
                        strIdent += "\t";
                    }
                    for (let index = 0; index < (ident - 1); index++) {
                        strInit += "\t";
                    }
                    var strEnd = ""

                    if (ident > 0)
                        strEnd = "\n"
                    if (obj instanceof Array) {
                        var strIdent = ""
                        var strInit = ""
                        ident = ident - 1
                    }

                    var str = [];
                    for (const key in obj) {
                        var data = ''
                        if (typeof obj[key] == 'function')
                            data = obj[key].toString()
                        else {

                            switch (typeof obj[key]) {
                                case "string": {
                                    data = '"' + obj[key] + '"';
                                    break;
                                }
                                case "object": {
                                    data = inspect(obj[key], ident + 1)
                                    break;
                                }
                                case "number": {
                                    data = obj[key]
                                    break;
                                }
                                default:{
                                    data = obj[key]
                                }
                            }

                        }
                        if (obj instanceof Array)
                            str.push(data)
                        else
                            str.push(key + ":" + data)
                    }
                    if (obj instanceof Array)
                        return '[' + str.join(',') + ']'

                    return '{' + strEnd + strIdent + str.join("," + strEnd + strIdent) + strEnd + strInit + '}'
                }


                if (!req.body.component)
                    throw new Error("Debes seleccionar el componente donde ubicar el controlador.")


                if (req.body.name) {
                    
                    if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name)))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name))

                    if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app'))

                    if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'controller')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'controller'))

                    if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'model')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'model'))

                    if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'store')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'store'))

                    if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'view')))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'view'))
					
					if (!fs.existsSync(path.join(R.bundles[req.body.component].absolutePath, 'Views', req.body.name)))
                        fs.mkdirSync(path.join(R.bundles[req.body.component].absolutePath, 'Views', req.body.name))

                    var App = {
                        name: req.body.name,
                        autoCreateViewport: true,
                        models: [],
                        stores: [],
                        controllers: ['Basic']
                    }

                    var Controller = {
                        extend: 'Ext.app.Controller',
                        stores: [],
                        models: [],
                        refs: [],
    init: function () {
        this.control({
            'viewport': {
                render: this.onRender
            }
        });


    },
    onRender: function () {
        
    }
                    }

                    var Viewport = {
                        extend: 'Ext.container.Viewport',
                        layout: 'fit',
    initComponent: function() {
        this.items = {
            xtype: 'panel',
            html:"hola",
            title:'Hola'
        };
                
        
        this.callParent();
    }
                    }

                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app.js'), R.template(__dirname + "/templates/basic/app.js.ejs", {
                        config: inspect(App, 1)
                    }))
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'compileApp'),'')
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'controller', 'Basic.js'), R.template(__dirname + "/templates/basic/class.js.ejs", {
                        config: inspect(Controller, 1),
                        name: req.body.name + ".controller.Basic"
                    }))
                    fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath, 'Resources', req.body.name, 'app', 'view', 'Viewport.js'), R.template(__dirname + "/templates/basic/class.js.ejs", {
                        config: inspect(Viewport, 1),
                        name: req.body.name + ".view.Viewport"
                    }))
					fs.writeFileSync(path.join(R.bundles[req.body.component].absolutePath, 'Views', req.body.name, 'index.ejs'), R.template(__dirname + "/templates/basic/index.ejs", {
                        ruta: "/public/"+R.bundles[req.body.component].vendor+"/"+req.body.component+"/"+req.body.name+"/all-classes.js"
                    }))
                } else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")


                return {
                    message: "La aplicación Extjs fue creada correctamente.",

                }
            }
        }
    }
}