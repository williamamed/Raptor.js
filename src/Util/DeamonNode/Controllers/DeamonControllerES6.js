'use strict';

var Controller=require('raptorjs').Controller
var fs=require('fs')
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class Deamon extends Controller{

	configure(){
		this.route('get','/raptor/deamon',this.indexAction)
		this.route('post','/raptor/deamon/configure',this.indexConfigureAction)
		this.route('get','/raptor/deamon/delete',this.deleteAction)
	}

	indexAction(req,res,next){
		res.render("DeamonNode:index.html.ejs",{
			config: this.R.bundles['DeamonNode'].config
		});
		
	}

	indexConfigureAction(req,res,next){
		var opt=this.R.bundles['DeamonNode'].config
		opt.push({
			nombre: req.body.nombre,
			schedule: req.body.schedule,
			command: req.body.command
		})
		var body = JSON.stringify(opt);
		var fd=fs.openSync(this.R.basePath+'/cache/schedule.json','w')
		fs.writeSync(fd,body);
		fs.closeSync(fd);
		this.R.bundles['DeamonNode'].config=opt;
		this.R.bundles['DeamonNode'].jobs.start()
		res.redirect('raptor/home#!/e/raptor/deamon')
	}

	deleteAction(req,res,next){
		var opt=this.R.bundles['DeamonNode'].config
		for (var i = 0; i < opt.length; i++) {
			if(opt[i].nombre==req.query.eid)
				opt.splice(i,1)
		};
		
		var body = JSON.stringify(opt);
		var fd=fs.openSync(this.R.basePath+'/cache/schedule.json','w')
		fs.writeSync(fd,body);
		fs.closeSync(fd);
		this.R.bundles['DeamonNode'].config=opt;
		this.R.bundles['DeamonNode'].jobs.start()
		res.redirect('raptor/home#!/e/raptor/deamon')
	}
}

module.exports=Deamon;