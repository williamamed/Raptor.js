"use strict";

var fse = require('fs-extra');

var path=require('path')
/*
* Raptor.js - Node framework
* Controlador ES6
* Clase controladora de la generación de nodes
* de Raptor.js
*/
class PublishResources extends R.Controller{
	

	configure(){

		this.prefix='/raptor/component/publish';

		this.routes({
			'':this.indexAction,
			'/list':this.listAction,
			'/publish':this.publishAction,
            '/clear':this.clearAction
		})

	}

	/**
	* Renderiza la vista de tipo ext.js de generar los nodes
	* de Raptor.js
	*
	*/
	indexAction(req,res,next){
		res.render('RaptorNode:PublishResources/index');
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
                mchildren['checked'] = false;
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
    publishAction(req, res, next) {
        var self=this;
        if(req.body.modules){
                
            if(typeof req.body.modules=='string'){
                var bundle=this.R.bundles[req.body.modules]
                
                this.R.copyResources(bundle,function(){
                    if(bundle.compressor){
                        var compressor=new bundle.compressor(self.R,bundle.name);
                        if(compressor.run)
                            compressor.run()
                    }  
                },true)
                
            }else{
                for (var i = 0; i < req.body.modules.length; i++) {
                    var bundle=this.R.bundles[req.body.modules[i]]
                    this.R.copyResources(bundle,function(){
                        if(bundle.compressor){
                            var compressor=new bundle.compressor(self.R,bundle.name);
                            if(compressor.run)
                                compressor.run()
                        }  
                    },true)
                };
            }
            res.show('Los recursos del módulo fueron publicados correctamente.');
        }else{
            res.show('Seleccione el componente que desea publicar.');
        }
	}

    /**
    *
    *
    */
    clearAction(req, res, next) {
        if(typeof req.body.modules=='string'){
            var bundle=this.R.bundles[req.body.modules]

            if(fse.existsSync(this.R.basePath+'/public/rmodules/'+bundle.vendor+'/'+bundle.name))
                fse.remove(this.R.basePath+'/public/rmodules/'+bundle.vendor+'/'+bundle.name,function(){
                   
                });
             
        }else{
            for (var i = 0; i < req.body.modules.length; i++) {
                var bundle=this.R.bundles[req.body.modules[i]]
                if(fse.existsSync(this.R.basePath+'/public/rmodules/'+bundle.vendor+'/'+bundle.name))
                    fse.remove(this.R.basePath+'/public/rmodules/'+bundle.vendor+'/'+bundle.name,function(){
                       
                    });
            };
        }
        res.show('Los recursos del módulo fueron limpiados correctamente.');    
    }

}
module.exports=PublishResources;