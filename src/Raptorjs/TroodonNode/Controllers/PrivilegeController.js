'use strict';

var Controller=require('raptorjs').Controller
/**
* Raptor.js - Node framework
* Controlador ES6
* 
* 
*
*/
class PrivilegeController extends Controller{

	configure(){
		this.prefix='/troodon/privilege'
		this.route('get','',this.indexAction)
		this.route('post','/list',this.listAction)
		this.route('post','/listaction',this.listActionsAction)
		this.route('post','/listroutes',this.listRoutesAction)
		this.route('post','/addDir',this.insertDirAction)
		this.route('post','/addIndex',this.insertIndexAction)
		this.route('post','/insertaction',this.insertActionAction)
		this.route('post','/editaction',this.editActionAction)
		this.route('post','/deleteaction',this.deleteActionAction)
		this.route('post','/edit',this.editAction)
		this.route('post','/delete',this.deleteAction)
	}
    
    /**
     * 
     *
     */
	indexAction(req,res,next){
		res.render("TroodonNode:privilege/index.ejs");
	}


   /**
	* Raptor.js - Node framework
	*
	*
	*/
	listAction(req,res,next){

		var node = req.body.node === 'root' ? 0 : req.body.node;
		this.R.getModels('TroodonNode').security_privilege
		.findAll({
			where:{
				belongs: node
			}
		})
		.then(proy=>{
			for (var i = 0; i < proy.length; i++) {
				if(proy[i].type==0){
					proy[i].dataValues.iconCls='icon-privilege'
					proy[i].dataValues.expandable=false
					proy[i].dataValues.indexrender=true
				}
				
				if(proy[i].type==2){
					proy[i].dataValues.expandable=true
				}
			};

			res.json(proy)
		})

	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listActionsAction(req,res,next){

		
		this.R.getModels('TroodonNode').security_privilege
		.findAll({
			where:{
				belongs: req.body.belongs,
				type: 1
			}
		})
		.then(proy=>{
			
			res.json(proy)
		})

	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	listRoutesAction(req,res,next){

		var routesDef={};

		for (var i in this.R.app.routes) {
			
			for (var j in this.R.app.routes[i]) {
				if(!routesDef[this.R.app.routes[i][j].path])
					routesDef[this.R.app.routes[i][j].path]=this.R.app.routes[i][j].method
				
			}
			
		};
		var resultData=[];
		for(var i in routesDef){
			if(i.indexOf(req.body.query)>=0)
				resultData.push({
					route: i
				})
		}
		res.json(resultData)
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	insertDirAction(req,res,next){
		
		this.R.getModels('TroodonNode').security_privilege
		.create({
			'name': req.body.name,
			'belongs': req.body.belongs=='root'?0:req.body.belongs,
			'type': 2,
			'class_name': req.body.className
		})
		.then(function(proy){
			res.show(req.lang('inser_dir_priv'))
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
	insertIndexAction(req,res,next){
		var me=this;
		this.R.getModels('TroodonNode').security_privilege
		.create({
			'name': req.body.name,
			'belongs': req.body.belongs=='root'?0:req.body.belongs,
			'type': 0,
			'route': req.body.route
		})
		.then(function(proy){
			return proy
		})
		.then(function(proy){
			var routesDef={};

			for (var i in me.R.app.routes) {
				
				for (var j in me.R.app.routes[i]) {
					if(!routesDef[me.R.app.routes[i][j].path])
						routesDef[me.R.app.routes[i][j].path]=me.R.app.routes[i][j].method
					
				}
				
			};
			var resultData=[];
			var route=proy.route;
			if(route.length>0 && route.charAt(route.length-1)!='/')
				route+='/';

			for(var i in routesDef){
				if(i.indexOf(route)==0 && i.length>route.length){
					var aux=i.replace(route,'');
					aux=aux.replace('/','_')
					resultData.push({
						route: i,
						name: aux,
						belongs: proy.id,
						type: 1
					})
				}
			}

			return me.R.getModels('TroodonNode').security_privilege.bulkCreate(resultData)

		})
		.then(function(){
			res.show(req.lang('inser_index_priv'))
		})
		.catch(function(error){
			console.log(error)
			res.show(req.lang('operation_error'),3)
		})

		
	}


   /**
	* Raptor.js - Node framework
	*
	*
	*/
	insertActionAction(req,res,next){
		
		this.R.getModels('TroodonNode').security_privilege
		.findById(req.body.belongs)
		.then(proy=>{
			return this.create({
						'name': req.body.name,
						'route': proy.route+'/'+req.body.name,
						'belongs': req.body.belongs=='root'?0:req.body.belongs,
						'type': 1
					})
		})
		.then(function(proy){
			res.show(req.lang('inser_action_priv'))
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
	editActionAction(req,res,next){
		var action;
		var data;
		this.R.getModels('TroodonNode').security_privilege
		.findById(req.body.id)
		.then(function(proy){
			var route=req.body.name.replace('_','/')
			var sub=req.body.name.replace('/','_')
			data={
				'name': sub,
				'route': route
			}
			action=proy;
			return this.findById(proy.belongs)
		})
		.then(function(proy){
			return action.update({
						'name':data.name,
						'route': proy.route+'/'+data.route
					})
		})
		.then(function(proy){
			res.show(req.lang('edit_action_priv'))
		})
		.catch(function(error){
			console.log(error)
			res.show(req.lang('operation_error'),3)
		})

		
	}

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	deleteActionAction(req,res,next){
		var action;
		var data;
		this.R.getModels('TroodonNode').security_privilege
		.findById(req.body.id)
		.then(function(proy){
			return proy.destroy()
		})
		.then(function(proy){
			res.show(req.lang('delete_action_priv'))
		})
		.catch(function(error){
			console.log(error)
			res.show(req.lang('operation_error'),3)
		})
	}

	

	/**
	* Raptor.js - Node framework
	*
	*
	*/
	editAction(req,res,next){
		var before;
		var privNow;
		this.R.getModels('TroodonNode').security_privilege
		.findById(req.body.id)
		.then(function(proy){
			before=proy.route;
			return proy.update({
						'name':req.body.name,
						'route': req.body.route,
						'class_name': req.body.className
					})
		})
		.then(function(proy){
			privNow=proy
			return this
					.findAll({
						where:{
							belongs: proy.id
						}
					})
		})
		.then(function(proy){

			for (var i = 0; i < proy.length; i++) {
				proy[i].update({
					route: proy[i].route.replace(before,privNow.route)
				}).then(function(){})
			};
		})
		.then(function(){
			res.show(req.lang('edit_priv'))
		})
		.catch(function(error){
			console.log(error)
			res.show(req.lang('operation_error'),3)
		})

		
	}



	/**
	* Raptor.js - Node framework
	*
	*
	*/
	deleteAction(req,res,next){
		var priv;
		this.R.getModels('TroodonNode').security_privilege
		.findById(req.body.id)
		.then(function(proy){
			priv=proy;
			return this.findAll({
				where: {
					belongs: proy.id
				}
			})
		})
		.then(function(proy){
			if(priv.type==2 && proy.length>0){
				res.show(req.lang('error_no_se_puede'))
			}else
				return this.destroy({
					force: true,
					where: {
						$or:{belongs: priv.id,id:priv.id}
					}
				})
			
		})
		.then(function(){
			res.show(req.lang('delete_priv'))
		})
		.catch(function(error){
			console.log(error)
			res.show(req.lang('operation_error'),3)
		})
	}

}

module.exports=PrivilegeController;