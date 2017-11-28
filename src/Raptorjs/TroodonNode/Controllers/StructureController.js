'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class StructureController extends Controller{

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
		res.render('TroodonNode:estructure/index.ejs')		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listAction(req,res,next){

		var node = req.body.node === 'root' ? 0 : req.body.node;
		this.R.getModels('TroodonNode').security_estructure
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

		this.R.getModels('TroodonNode').security_category
		.findAll({})
		.then(proy => {
			res.json(proy)
		})
		.catch(function(error){
			res.show(req.lang('operation_error'),3)
		})
	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	insertAction(req,res,next){
		
		this.R.getModels('TroodonNode').security_estructure
		.create({
			'name': req.body.name,
			'belongs': req.body.index=='root'?0:req.body.index
		})
		.then(function(proy){
			res.show(req.lang('add_msg_estructure'))
		})
		.catch(function(error){
			res.show(req.lang('operation_error'),3)
		})

		
	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	editAction(req,res,next){
		var me=this;
		this.R.getModels('TroodonNode').security_estructure
		.findById(req.body.id)
		.then(function(proy){
			
			return proy.update({
				'name': req.body.name,
			})
		})
		.then(function(){
			res.show(req.lang('edit_msg_estructure'))
		})
		.catch(function(error){
			res.show(req.lang('operation_error'),3)
		})

		
	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	deleteAction(req,res,next){
		
		this.R.getModels('TroodonNode').security_estructure
		.findById(req.body.id)
		.then( proy => {
			return proy.destroy()
		})
		.then(function(){
			res.show(req.lang('delete_msg_estructure'))
		})
		.catch(function(error){
			console.log(error)
			res.show(req.lang('operation_error'),3)
		})

		
	}
}

module.exports=StructureController;