'use strict';

/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class StructureController extends R.Controller{

	configure(){
		this.prefix='/troodon/structure';
		this.route('get','',this.indexAction)
		this.route('post','/list',this.listAction)
		this.route('post','/listcategory',this.listCategoryAction)
		this.route('post','/insert',this.insertAction)
		this.route('post','/edit',this.editAction)
		this.route('post','/delete',this.deleteAction)
	}

	indexAction(req,res,next){
		res.render('troodon:estructure/index.ejs')		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listAction(req,res,next){

		var node = req.body.node === 'root' ? 0 : req.body.node;
		this.R.getModels('troodon').security_estructure
		.getChilds(node,function(proy){
			res.json(proy)
		})
		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listCategoryAction(req,res,next){

		this.R.getModels('troodon').security_category
		.findAll({})
		.then(proy => {
			res.json(proy)
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
	insertAction(req,res,next){
		
		this.R.getModels('troodon').security_estructure
		.create({
			'name': req.body.name,
			'belongs': req.body.index=='root'?0:req.body.index
		})
		.then(function(proy){
			res.show(req.lang('add_msg_estructure'))
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
		this.R.getModels('troodon').security_estructure
		.findByPk(req.body.id)
		.then(function(proy){
			
			return proy.update({
				'name': req.body.name,
			})
		})
		.then(function(){
			res.show(req.lang('edit_msg_estructure'))
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
		
		this.R.getModels('troodon').security_estructure
		.findByPk(req.body.id)
		.then( proy => {
			return proy.destroy()
		})
		.then(function(){
			res.show(req.lang('delete_msg_estructure'))
		})
		.catch(function(error){
			next(error)
		})

		
	}
}

module.exports=StructureController;