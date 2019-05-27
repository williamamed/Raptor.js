'use strict';
var lodash=require('lodash')
module.exports={
	initRepo:function(){
		//incluyendo asociasiones
		
		this.belongsToMany(this.R.getModels('TroodonNode').security_privilege,{through: 'security_rol_security_privilege',foreignKey: 'id_rol'}) 
		this.R.getModels('TroodonNode').security_privilege.belongsToMany(this,{through: 'security_rol_security_privilege',foreignKey: 'id_privilege'})
	},
	getTree:function(id,callback){
		var me=this;
		var list=[]
		var promise=new this.R.database.Sequelize.Promise(function(resolve, reject){
			var count=[]
			function recurse(proy) {
				for(var i in proy){
					let one=proy[i]	
			   		one.dataValues.leaf=true;
			   		count.push(null)
					me.findAll({
						where:{
							belongs: one.id
						}
					}).then(function(proyNested){
						count.pop()
						if(proyNested.length>0){
							one.dataValues.children=proyNested;
							one.dataValues.expanded=true;
							one.dataValues.leaf=false;
							recurse(proyNested)
						}
						if(count.length==0){
							resolve();
						}
						
					})
				};
			}


			me.findAll({
				where:{
					belongs: id
				}
			}).then(function(proyNested){
				list=proyNested;
				if(proyNested.length>0){
					
					recurse(list)
				}else{
					resolve();
				}
			})
			// Kick off the async work
			    
		})
		promise.then(function(){
			callback(list)
		})
	},
	getChilds:function(id,callback){
		var me=this;
		var list=[]
		var promise=new this.R.database.Sequelize.Promise(function(resolve, reject){
			var count=[]
			function recurse(proy) {
				for(var i in proy){
					let one=proy[i]	
			   		one.dataValues.leaf=true;
			   		count.push(null)
					me.findAll({
						where:{
							belongs: one.id
						}
					}).then(function(proyNested){
						count.pop()
						list=lodash.concat(list,proyNested)
						if(proyNested.length>0){
							
							recurse(proyNested)
						}
						if(count.length==0){
							resolve();
						}
						
					})
				};
			}


			me.findAll({
				where:{
					belongs: id
				}
			}).then(function(proyNested){
				list=proyNested;
				if(proyNested.length>0){
					
					recurse(list)
				}else{
					resolve();
				}
			})
			// Kick off the async work
			    
		})
		promise.then(function(){
			callback(list)
		})
	}
}