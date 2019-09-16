'use strict';
var fs = require('fs-extra')

/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class RolController extends R.Controller {

	configure() {
		this.prefix = '/troodon/rol';

		this.route('get', '', this.indexAction)
		this.route('post', '/list', this.listAction)
		this.route('post', '/listprivileges', this.listPrivilegeAction)
		this.route('post', '/insert', this.insertAction)
		this.route('post', '/edit', this.editAction)
		this.route('post', '/delete', this.deleteAction)
		this.route('post', '/asignprivilege', this.asignPrivilegeAction)
	}

	/**
	 * Raptor.js - Node framework
	 *
	 *
	 *
	 */
	indexAction(req, res, next) {
		res.render('troodon:rol/index.ejs')

	}

	/**
	 * Raptor.js - Node framework
	 *
	 *
	 */
	listAction(req, res, next) {

		var node = req.body.node === 'root' ? 0 : req.body.node;
		this.R.getModels('troodon').security_rol
			.getTree(node, function (proy) {
				res.json(proy)
			})

	}


	/**
	 * Raptor.js - Node framework
	 *
	 *
	 */
	listPrivilegeAction(req, res, next) {
		this.R.getModels('troodon').security_privilege
			.getTree(req.body.id, function (list) {
				res.json(list)
			})

	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	insertAction(req, res, next) {

		this.R.getModels('troodon').security_rol
			.create({
				'name': req.body.name,
				'belongs': req.body.belongs
			})
			.then(function (proy) {
				res.show(req.lang('insert_msg_rol'))
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
		this.R.getModels('troodon').security_rol
			.findByPk(req.body.id)
			.then(function (proy) {

				return proy.update({
					'name': req.body.name,
				})
			})
			.then(function () {
				res.show(req.lang('edit_msg_rol'))
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
	deleteAction(req, res, next, TroodonDataService, troodon_security_rol) {

		troodon_security_rol
			.findByPk(req.body.id)

			.bind({})
			.then(function (rol) {
				this.rol = rol;
				return TroodonDataService.getRolChildren(rol.id)
			})
			.then(function (children) {
				if (children.length > 0) {
					throw {
						message: req.lang("rol_not_removed_child"),
						code: "TroodonError"
					}
				} else {
					return this.rol.destroy()
				}
			})
			.then(function () {
				res.show(req.lang('delete_msg_rol'))
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
	asignPrivilegeAction(req, res, next) {

		this.R.getModels('troodon').security_rol
			.findByPk(req.body.id)

			.then(function (proy) {
				return proy.setSecurity_privileges(JSON.parse(req.body.privileges))

			})
			.then(function () {
				res.show(req.lang('priv_msg_rol'))
			})
			.catch(function (error) {
				next(error)
			})


	}
}

module.exports = RolController;