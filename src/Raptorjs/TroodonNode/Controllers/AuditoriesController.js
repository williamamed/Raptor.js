'use strict';

var Controller=require('raptorjs').Controller
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class AuditoriesController extends Controller{

	configure(){
		this.prefix='/troodon/auditories'
		this.route('get','',this.indexAction)
		this.route('post','/list',this.listAction)
		this.route('post','/listestadistic',this.statisticAction)
		this.route('post','/delete',this.deleteAction)
	}

	indexAction(req,res,next){
		res.render("TroodonNode:auditories/index.ejs");
	}




	listAction(req,res,next){
		var query={}
		if(req.body.username){
			query.username={
				$like: '%'+req.body.username+'%'
			}
		}
		if(req.body.log){
			query.log={
				$like: '%'+req.body.log+'%'
			}
		}
		if(req.body.from_date && req.body.to_date){
			query.a_date={
				$between: [req.body.from_date, req.body.to_date]
			}
		}
		if(req.body.ip){
			query.ip={
				$like: '%'+req.body.ip+'%'
			}
		}
		this.R.getModels('TroodonNode').security_trace
		.findAndCountAll({
			offset: parseInt(req.body.start),
			limit: parseInt(req.body.limit),
			where: query,
			raw:true
		})
		.then(function(aud){
			res.json({
				rows: aud.rows,
				success: true,
				result: aud.count
			})
		})
	}



	statisticAction(req,res,next){
		var types=[{
			name:'EMERGENCY',
			color: '#B30606',
			cant:0
		},{
			name:'ALERT',
			color:'#D4A007',
			cant:0
		},{
			name:'CRITICAL',
			color:'#B30606',
			cant:0
		},{
			name:'ERROR',
			color:'#B30606',
			cant:0
		},{
			name:'WARNING',
			color:'#D4A007',
			cant:0
		},{
			name:'NOTICE',
			color:'#12048F',
			cant:0
		},{
			name:'INFO',
			color:'#069407',
			cant:0
		},{
			name:'DEBUG',
			color:'#D4A007',
			cant:0
		}]
		var total;
		var me=this;
		this.R.getModels('TroodonNode').security_trace
		.count()
		.then(function(c){
			total=c;
			return this.findAll({
						group: 'state',
						raw: true,
						attributes:[[me.R.database.sequelize.fn('COUNT', me.R.database.sequelize.col('id')), 'cant'],'state']
					})
		})
		.then(function(aud){
			for (var i = 0; i < aud.length; i++) {
				types[parseInt( aud[i].state )-1].cant= aud[i].cant;
				types[parseInt( aud[i].state )-1].total= total;
				types[parseInt( aud[i].state )-1].percent=( types[parseInt( aud[i].state )-1].cant/total)*100
			};
			res.json(types)
		})
	}



	deleteAction(req,res,next){
		this.R.getModels('TroodonNode').security_trace
		.destroy({
			where:{
				id:{
					$in: JSON.parse(req.body.ids)
				}
			}
		})
		.then(function(){
			res.show(req.lang('globdeletemsg'))
		})
	}
}

module.exports=AuditoriesController;