'use strict';

/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class StructureController extends R.Controller {

	configure() {
		this.prefix = '/troodon/structure';
		this.route('get', '', this.indexAction)
		this.route('post', '/list', this.listAction)
		this.route('post', '/listcategory', this.listCategoryAction)
		this.route('post', '/insert', this.insertAction)
		this.route('post', '/edit', this.editAction)
		this.route('post', '/delete', this.deleteAction)
	}

	indexAction(req, res, next) {
		res.render('troodon:estructure/index.ejs')
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listAction(req, res, next) {

		var node = req.body.node === 'root' ? 0 : req.body.node;
		this.R.getModels('troodon').security_estructure
			.getChilds(node, function (proy) {
				res.json(proy)
			})

	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listCategoryAction(req, res, next) {

		this.R.getModels('troodon').security_category
			.findAll({})
			.then(proy => {
				res.json(proy)
			})
			.catch(function (error) {
				next(error)
			})
	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	insertAction(req, res, next) {

		this.R.getModels('troodon').security_estructure
			.create({
				'name': req.body.name,
				'belongs': req.body.index == 'root' ? 0 : req.body.index
			})
			.then(function (proy) {
				res.show(req.lang('add_msg_estructure'))
			})
			.catch(function (error) {
				next(error)
			})


	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	editAction(req, res, next) {
		var me = this;
		this.R.getModels('troodon').security_estructure
			.findByPk(req.body.id)
			.then(function (proy) {

				return proy.update({
					'name': req.body.name,
				})
			})
			.then(function () {
				res.show(req.lang('edit_msg_estructure'))
			})
			.catch(function (error) {
				next(error)
			})


	}


	/**
	* Raptor.js - Node framework
	*
	*
	*/
	deleteAction(req, res, next, TroodonDataService, troodon_security_estructure, troodon_security_user) {

		troodon_security_estructure
			.findByPk(req.body.id)

			.bind({})
			.then(function (p) {
				this.id = p.id;
				this.structure = p;
				return TroodonDataService.getStructureChildren(p.id)
			})
			.then(function (result) {
				if (result.length > 0) {
					throw {
						message: req.lang("structure_not_removed_child"),
						code: "TroodonError"
					};
				} else {
					return troodon_security_user.findAndCountAll({
						where: {
							id_estructure: this.id
						}
					})
				}

			})
			.then(function (users) {
				if (users.count > 0) {
					throw {
						message: req.lang("structure_not_removed_users"),
						code: "TroodonError"
					};
				} else {
					return this.structure.destroy();
				}
			})
			.then(function () {
				res.show(req.lang('delete_msg_estructure'))
			})
			.catch(function (error) {
				next(error)
			})


	}
}

module.exports = StructureController;