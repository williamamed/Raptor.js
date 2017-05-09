"use strict";
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');
var Controller=require('raptorjs').Controller

/*
* Raptor.js - Node framework
* Controlador ES6
* Clase controladora de la generación de nodes
* de Raptor.js
*/
class GenerateController extends Controller{
	

	configure(){

		this.prefix='/raptor';

		this.routes({
			'/component/generatenode':this.indexAction,
			'/component/generatenode/list':this.listAction,
			'/component/generatenode/create':this.createNodeAction,
            '/component/generatenode/delete':this.deleteNodeAction
		})

	}

	/**
	* Renderiza la vista de tipo ext.js de generar los nodes
	* de Raptor.js
	*
	*/
	indexAction(req,res,next){
		res.render('RaptorNode:Generate/index');
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

    createNodeAction(req, res, next) {
        var vendor = req.body.vendor;
        var nodeName = req.body.bundle;
        nodeName += 'Node';
        var self = this;
        if (this.R.bundles[nodeName] === undefined) {
            var messages = [];
            if (!self.createNodeDirectory(vendor, nodeName, messages)) {
            	return "Sorry cannot create the Node directory";
            }
            self.createFiles(res,nodeName, vendor, messages);
            res.end("Ese modulo no existe");
        }
        else {
            res.end("Ya ese modulo existe");
        }
       

		//var data = '';
		//var self = this;
		//req.on('data',function(chunk){
		//	data += chunk;
		//}).on('end',function(){
		//	var mydata = querystring.parse(data);
		//	var nodeName = mydata['bundle'];
  //      	nodeName +='Node';
  //      	var messages = [];
  //      	if (!self.createNodeDirectory(mydata['vendor'], nodeName, messages)) {
  //          	return "Sorry cannot create the Node directory";
  //      	}
  //      	self.createFiles(nodeName, mydata['vendor'], messages);
        	

		//});
		      
	}

	createNodeDirectory(vendor, nodeName, messages) {
        var src = path.join(this.R.basePath,'src');
        if (!fs.existsSync(path.join(src,vendor)))
            fs.mkdirSync(path.join(src,vendor));
        if (fs.existsSync(path.join(src,vendor,nodeName)))
            return false;
        fs.mkdirSync(path.join(src,vendor,nodeName));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Controller'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Resources'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Views'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'Models'));
        fs.mkdirSync(path.join(src,vendor,nodeName,'i18n'));
        messages.push("<b style='color:green'>Directory src/" + vendor + '/' + nodeName + ' created</b>');
        messages.push("<b style='color:green'>Directory src/" + vendor + '/' + nodeName + '/Controller' + ' created</b>');
        messages.push("<b style='color:green'>Directory src/" + vendor + '/' + nodeName + '/Resources' + ' created</b>');
        messages.push("<b style='color:green'>Directory src/" + vendor + '/' + nodeName + '/Views' + ' created</b>');
        messages.push("<b style='color:green'>Directory src/" + vendor + '/' + nodeName + '/Models' + ' created</b>');
        messages.push("<b style='color:green'>Directory src/" + vendor + '/' + nodeName + '/i18n' + ' created</b>');
  
        return true;
    }
    createFiles(res, nodeName, vendor, messages) {
        
        var myjs = res.render('RaptorNode:Generate/appindex', {
            options: nodeName
        });
        console.log(myjs);
        var src = path.join(this.R.basePath,'src');
        fs.writeFileSync(path.join(src,vendor,nodeName,'index.js'), myjs);
        messages.push("<b style='color:green'>File src/" + vendor + '/' + nodeName + '/index.js' + ' created</b>');
    }
    deleteNodeAction(req,res,next){
        var data = '';
        var self = this;
        req.on('data',function(chunk){
            data += chunk;
        }).on('end',function(){
            var mydata = querystring.parse(data);
            var nodeName = mydata['name'];
            console.log(nodeName);
           

        });


      /*  $name = $request->post('name');
        $sp=  $this->app->getConfigurationLoader()->getBundlesSpecifications();
        $vendor=  str_replace($name,'', $sp[$name]['location']);
        $this->eliminarDir($sp[$name]['location']);
        $files = new ItemList(glob($vendor . "*"));
        if ($files->isEmty())
            $this->eliminarDir($vendor);

        $this->app->getConfigurationLoader()->unRegisterBundle($sp[$name]['name']);
        /**
         * Cant call force load here, the Aspect Kernel has a problem with removed bundles
         * instead perform a save operation with cache
         *//*
        $this->app->getConfigurationLoader()->getCache()->setDirty();
        $this->app->getConfigurationLoader()->getCache()->save();
        return $this->show("Bundle $name deleted");*/
    }
}
module.exports=GenerateController;
