'use strict';

/**
 * Raptor.js - v2
 * 
 * @Route("/troodon/category")
 */
class CategoryController extends R.Controller{

	configure(){
		
	}
    
    /**
     * @Route("")
     */
	indexAction(req,res,next){
		
		res.render("troodon:category/index.ejs");
	}

	/**
	 * @Route("/list")
	 */
	listAction(req,res,next,troodon_security_category){
		troodon_security_category
		.findAll()
		.then(function(data){
			res.json(data)
		})
		.catch(function(err){
			next(err);
		})
	}

	/**
	 * @Route("/insert")
	 */
	insertAction(req,res,next,troodon_security_category){
		troodon_security_category
		.create({
			name: req.body.name
		})
		.then(function(data){
			res.json(data)
		})
		.catch(function(err){
			next(err);
		})
	}

	/**
	 * @Route("/edit/:id",method="put")
	 */
	editAction(req,res,next,troodon_security_category){
		troodon_security_category
		.findByPk(req.body.id)
		.then(function(category){
			return category.update(req.body)
		})
		.then(function(data){
			res.json(data)
		})
		.catch(function(err){
			next(err);
		})
	}

	/**
	 * @Route("/delete/:id",method="delete")
	 */
	deleteAction(req,res,next,troodon_security_category){
		troodon_security_category
		.findByPk(req.body.id)
		.then(function(category){
			return category.destroy()
		})
		.then(function(data){
			res.json(data)
		})
		.catch(function(err){
			next(err);
		})
	}
}

module.exports=CategoryController;