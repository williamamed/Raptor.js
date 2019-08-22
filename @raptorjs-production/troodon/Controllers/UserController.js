'use strict';
var fs = require('fs-extra')
var path = require('path')


/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class UserController extends R.Controller{

	configure(){
		this.multer = require('multer')()

		this.prefix='/troodon/user';

		this.route('get','',this.indexAction)
		this.route('post','/list',this.listAction)
		this.route('post','/listestructure',this.listEstructureAction)
		this.route('post','/listrol',this.listRolAction)
		this.route('post','/insert',this.multer.single('icon'),this.insertAction)
		this.route('post','/edit',this.multer.single('icon'),this.editAction)
		this.route('post','/delete',this.deleteAction)
		this.route('post','/changestate',this.changeStateAction)
		this.route('post','/asignrol',this.asignRolAction)

		
	}

   /**
	* Raptor.js - Node framework
	*
	*
	*
	*/
	indexAction(req,res,next){
		
		res.render('troodon:user/index.ejs')

	}

   /**
	* Raptor.js - Node framework
	*
	*
	*/
	listAction(req,res,next){

	   /**
		* Para incluir el hidratado del modelo users dentro del cars debe especificarse en el include
		*
		*/
		
		this.R.getModels('troodon').security_user
		.findAll({
			where:{
				id_estructure: req.body.idEstructure
			},
		    include: [{
		        model: this.R.getModels('troodon').security_rol
		    },{
		        model: this.R.getModels('troodon').security_estructure
		    }],
		    offset: parseInt(req.body.start),
		    limit: parseInt(req.body.limit)
		}).then(function(result) {
			res.json({
				result: result.length,
				rows: result,
				success: true
			})
			
		}).catch(function(err){
			next(err);
		})


	}

   /**
	* Raptor.js - Node framework
	*
	*
	*/
	listEstructureAction(req,res,next){

		var node = req.body.node === 'root' ? 0 : req.body.node;
		this.R.getModels('troodon').security_estructure
		.getChilds(node,function(proy){
			res.json(proy)
		})
		/**
		this.R.getModels('troodon').security_estructure
		.findAll({
			where:{
				belongs: node
			}
		}).then(function(proy) {
			res.json(proy)
			
		}).catch(function(err){
			next(err);
		})
		*/
	}


   /**
	* Raptor.js - Node framework
	*
	*
	*/
	listRolAction(req,res,next){
		this.R.getModels('troodon').security_rol
		.getChilds(req.session.passport.user.idRol,function(list){
			res.json(list)
		})
		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	insertAction(req,res,next){
		var icon=null
		
		if(req.file){
			
			icon=Math.random()+req.file.originalname
			fs.writeFileSync(path.join(this.R.basePath,'public','rmodules','securityImages',icon),req.file.buffer)
			
		}
		this.R.getModels('troodon').security_user
		.create({
			'username': req.body.username,
			'fullname': req.body.fullname,
			'email': req.body.email,
			'password': req.body.password,
			'id_estructure': req.body.idEstructure,
			'state': 0,
			'icon': icon
		})
		.then(function(proy){
			res.show(req.lang('insertmsg'))
		})
		.catch(function(error){
			next(error)
		})

		
	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	editAction(req,res,next){
		var me=this;
		this.R.getModels('troodon').security_user
		.findByPk(req.body.id)
		.then(function(proy){
			
			if(req.file){
				if(proy.icon && fs.existsSync(path.join(R.basePath,'public','rmodules','securityImages',proy.icon)))
					fs.removeSync(path.join(R.basePath,'public','rmodules','securityImages',proy.icon))
				proy.icon=Math.random()+req.file.originalname
				fs.writeFileSync(path.join(R.basePath,'public','rmodules','securityImages',proy.icon),req.file.buffer)
				
			}
			var modified={
				'username': req.body.username,
				'fullname': req.body.fullname,
				'email': req.body.email,
				'icon': proy.icon
			}
			if(req.body.password !=0 )
				modified.password=req.body.password

			/**if(req.files.icon){
				modified.icon=req.files.icon.name
				fs.move(req.files.icon.path, me.R.basePath+'/public/rmodules/securityImages/'+Math.random()+req.files.icon.name, function (err) {
				  if (err) return console.error(err)
				})
			}*/
			return proy.update(modified)
		})
		.then(function(){
			res.show(req.lang('editmsg'))
		})
		.catch(function(error){
			next(error)
		})

		
	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	deleteAction(req,res,next){
		
		this.R.getModels('troodon').security_user
		.findByPk(req.body.id)
		.then( proy => {
			proy.setSecurity_rols(null);
			return proy
		})
		.then( proy => {
			return proy.destroy()
		})
		.then(function(){
			res.show(req.lang('deletemsg'))
		})
		.catch(function(error){
			next(error)
		})

		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	changeStateAction(req,res,next){
		
		this.R.getModels('troodon').security_user
		.findByPk(req.body.id)
		.then( proy => {
			return proy.update({
				'state': req.body.state==='true'?1:0
			})
		})
		.then(function(){
			res.show(req.lang('statemsg'))
		})
		.catch(function(error){
			next(error)
		})

		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	asignRolAction(req,res,next){
		
		this.R.getModels('troodon').security_user
		.findByPk(req.body.iduser)
		.then( proy => {
			proy.setSecurity_rols(null)
			return proy;
		})
		.then(function(proy){
			proy.setSecurity_rols(req.body.id.split(','))
			.then(function(){
				res.show(req.lang('rolmsg'))
			})
		})
		.catch(function(error){
			next(error)
		})

		
	}
}

module.exports=UserController;