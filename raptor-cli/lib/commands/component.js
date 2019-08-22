'use strict'
var fs = require('fs')
var path = require('path')
const fse = require('fs-extra')
const format = require('./../format')

module.exports = {
    command: 'component <agrupador> <nombre>',
    description: 'Crea un nuevo componente dentro de nuestro proyecto.',
    disabled:true,
    action: function (nombre, argument, command) {
        if(nombre && argument.length>0){
            if(!fs.existsSync(path.join(process.cwd(),'src',nombre,argument[0]+"Node"))){
                this.createDirectory(argument[0]+"Node",nombre)
                this.createFiles(argument[0]+"Node",nombre)
                console.log("Hecho!!")
            }else{
                console.log("Error: ya existe un componente con este nombre.")
            }
        }else{
            console.log("Error: faltan argumentos en el comando component <agrupador> <nombre>");
        }
        
    },
    createDirectory: function (name, vendor) {
        var src = path.join(process.cwd(), 'src');
        if (!fs.existsSync(path.join(src, vendor)))
            fs.mkdirSync(path.join(src, vendor));
        if (fs.existsSync(path.join(src, vendor, name)))
            return false;
        console.log("creando directorios del componente...")
        fs.mkdirSync(path.join(src, vendor, name));
        fs.mkdirSync(path.join(src, vendor, name, 'Controllers'));
        fs.mkdirSync(path.join(src, vendor, name, 'Resources'));
        fs.mkdirSync(path.join(src, vendor, name, 'Views'));
        fs.mkdirSync(path.join(src, vendor, name, 'Models'));
        fs.mkdirSync(path.join(src, vendor, name, 'i18n'));
        fs.mkdirSync(path.join(src, vendor, name, 'Commands'));
    },
    createFiles: function (name, vendor) {
        console.log("creando archivos del componente...")
        var index = fs.readFileSync(path.join(__dirname, '..', 'source', 'component.template'))
            .toString()
            .replace(/\{\{classname\}\}/g, name);


        var es6 = fs.readFileSync(path.join(__dirname, '..', 'source', 'controller.template'))
            .toString()
            .replace(/\{\{classname\}\}/g, name);


        var src = path.join(process.cwd(), 'src');
        fs.writeFileSync(path.join(src, vendor, name, 'index.js'), index);
        fs.writeFileSync(path.join(src, vendor, name, 'Controllers/DefaultController.js'), es6);

        //fs.writeFileSync(path.join(src,vendor,nodeName,'Controllers/DefaultControllerCJ.js'), commonJS);
        var data = {
            state: true,
            name: name,
            version: '1.0.0'
        }
        fs.writeFileSync(path.join(src, vendor, name, 'manifest.json'), JSON.stringify(data, null, 2))

    }
}