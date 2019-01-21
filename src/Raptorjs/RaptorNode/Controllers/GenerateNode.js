"use strict";
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Controller=require('raptorjs').Controller

/*
* Raptor.js - Node framework
* Controlador ES6
* Clase controladora de la generación de nodes
* de Raptor.js
*/
class GenerateController extends Controller{
	

	configure(){

		this.prefix='/raptor/component/generatenode';

		this.routes({
			'':this.indexAction,
			'/list':this.listAction,
			'/create':this.createNodeAction,
            '/delete':this.deleteNodeAction,
            '/model':this.genModelNodeAction
		})

	}

	/**
	* Renderiza la vista de tipo ext.js de generar los nodes
	* de Raptor.js
	*
	*/
	indexAction(req,res,next){
		res.render('RaptorNode:GenerateNode/index');
	}

	/**
	* Procesa la infomación que se va a mostrar 
	* de los vendor y nodes en el sistema
	*
	*/
	listAction(req,res,next){
		
		var vendors = {};
        for (var i in this.R.bundles) {
            if (!vendors[this.R.bundles[i].vendor]) {
                vendors[this.R.bundles[i].vendor] = {};
                vendors[this.R.bundles[i].vendor][this.R.bundles[i].name] = this.R.bundles[i].name;
            }
            else {
                vendors[this.R.bundles[i].vendor][this.R.bundles[i].name] = this.R.bundles[i].name;
            }
        }
        var tree = [];
        for (var i in vendors) {
            var obj = vendors[i];
            var item = {};
            item['text'] = i;
            item['children'] = [];
            item['expanded'] = true;
            item['vendor'] = true;
            //item['iconCls'] = 'icon-vendor';
            for (var j in obj) {
                var mchildren = {};
                mchildren['text'] = vendors[i][j];
                //children['iconCls'] = 'icon-bundle';
                mchildren['expandable'] = false;
                mchildren['vendor'] = false;
                mchildren['namespace'] = vendors[i][j];
                item['children'].push(mchildren);
            }
            tree.push(item);
        }
        res.json(tree);

	}

    /**
    *
    *
    */
    createNodeAction(req, res, next) {
        var vendor = req.body.vendor;
        var nodeName = req.body.bundle;
        nodeName += 'Node';
        var self = this;
        var messages = [];
        if (!this.R.bundles[nodeName]) {
            
            if (!GenerateController.createNodeDirectory(vendor, nodeName, messages)) {
                res.show("Lo sentimos no se pudo crear el directorio",Controller.ERROR)
            	return ;
            }
            GenerateController.createFiles(nodeName, vendor, messages);
            
        }else {
            res.show("El módulo especificado ya existe.",Controller.ERROR);
        }
        
        res.show('El módulo fue generado correctamente.',{
            routine: messages.map(function(value){
                return '<b style="color:green">'+value+'<b>'
            }),
            name: nodeName,
            nameVendor: vendor
        });

		      
	}
    
    
    /**
    *
    *
    */
	static createNodeDirectory(vendor, nodeName, messages) {
        var src = path.join($get('R').basePath,'src');
        if (!fs.existsSync(path.join(src,vendor)))
            fs.mkdirSync(path.join(src,vendor));
        if (fs.existsSync(path.join(src,vendor,nodeName)))
            return false;
        fs.mkdirSync(path.join(src,vendor,nodeName));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Controllers'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Resources'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Views'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Models'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'i18n'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Commands'));
        
        messages.push("Directory src/" + vendor + '/' + nodeName + ' created');
        messages.push("Directory src/" + vendor + '/' + nodeName + '/Controllers' + ' created');
        messages.push("Directory src/" + vendor + '/' + nodeName + '/Resources' + ' created');
        messages.push("Directory src/" + vendor + '/' + nodeName + '/Views' + ' created');
        messages.push("Directory src/" + vendor + '/' + nodeName + '/Models' + ' created');
        messages.push("Directory src/" + vendor + '/' + nodeName + '/i18n' + ' created');
        messages.push("Directory src/" + vendor + '/' + nodeName + '/Commands' + ' created');
        return true;
    }

    /**
    *
    *
    */
    static createFiles(nodeName, vendor, messages) {
        
        var index=$get('R').template('RaptorNode:GenerateNode/node-template/index.js.ejs', {
            classname: nodeName
        });
        
        var es6=$get('R').template('RaptorNode:GenerateNode/node-template/ControllerES6.js.ejs', {
            classname: nodeName.replace('Node','')
        });
        
        /**var commonJS;
        res.render('RaptorNode:GenerateNode/node-template/ControllerCommonJS.js.ejs', {
            classname: nodeName.replace('Node','')
        },function(err,str){
            commonJS=str;
        });
        this.R.waitUntil(!commonJS);*/

        var src = path.join($get('R').basePath,'src');
        fs.writeFileSync(path.join(src,vendor,nodeName,'index.js'), index);
        fs.writeFileSync(path.join(src,vendor,nodeName,'Controllers/DefaultController.js'), es6);
        //fs.writeFileSync(path.join(src,vendor,nodeName,'Controllers/DefaultControllerCJ.js'), commonJS);
        var data={
              state: true,
              name: nodeName,
              version: '1.0.0'
        }
        fs.writeFileSync(path.join(src,vendor,nodeName,'manifest.json'),JSON.stringify(data,null, 2))
        
        messages.push("File src/" + vendor + '/' + nodeName + '/index.js' + ' created');
        messages.push("File src/" + vendor + '/' + nodeName + '/Controllers/DefaultControllerES6.js' + ' created');
        messages.push("File src/" + vendor + '/' + nodeName + '/Controllers/DefaultControllerCJ.js' + ' created');
        messages.push("Node server restarted");
    }

    /**
    *
    */
    deleteNodeAction(req,res,next){
        

        if(req.body.nodecomponent=='RaptorNode'){
            res.show('Es una pena !!<br>El componente RaptorNode no puede ser eliminado, es componente base del framework.',Controller.ERROR);
            return;
        }

        if(req.body.nodecomponent && this.R.bundles[req.body.nodecomponent]){
            var self=this;
            
            this.R.waitUntil(this.R.status!=this.R.RUNNING)
            var dir=fs.readdirSync(path.join(self.R.basePath,'src',self.R.bundles[req.body.nodecomponent].vendor));
            if(dir.length>1)
                fse.remove(this.R.basePath+'/src/'+this.R.bundles[req.body.nodecomponent].path,function(err){
                    if(err){
                        console.log(err);
                        return res.show('Ocurrió un error eliminando el componente, intentelo nuevamente.'+err.message,Controller.ERROR);
                    }
                    
                    fs.writeFileSync(path.join(__dirname,'..','cache','/restart.js'),'es');
                    
                    res.show('El módulo fue eliminado correctamente.');
                    
                });
            else
                fse.remove(this.R.basePath+'/src/'+this.R.bundles[req.body.nodecomponent].vendor,function(err){
                    if(err){
                        console.log(err);
                        return res.show('Ocurrió un error eliminando el componente, intentelo nuevamente.'+err.message,Controller.ERROR);
                    }
                    
                    fs.writeFileSync(path.join(__dirname,'..','cache','/restart.js'),'es');
                    
                    res.show('El módulo fue eliminado correctamente.');
                    
                });

            
        }else
            res.show('No se encontro el componente especificado.',Controller.ERROR);

    }

    genModelNodeAction(req,res,next){

       var es6=$get('R').template('RaptorNode:GenerateNode/node-template/ControllerES6.js.ejs', {
            classname: req.body.controllername
        });
        
        var src = path.join(this.R.basePath,'src');
        
        fs.writeFileSync(path.join(src,this.R.bundles[req.body.component].vendor,req.body.component,'Controllers/'+req.body.controllername+'.js'), es6);

        res.show('El controlador fue creado correctamente.')
    }
}
module.exports=GenerateController;
