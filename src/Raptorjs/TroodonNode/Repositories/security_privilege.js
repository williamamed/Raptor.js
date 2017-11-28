'use strict';
var lodash=require('lodash')
module.exports={
	getTree:function(id,callback){
		var list=[];
		var hash=[];
		var count=1;
		var counting=function(val){
			if(val!=undefined)
				count=count+val;
			else
				return count;
		}
		var hashList=function(val){
			return hash;
		}
		var me=this;
		this.R.getModels('TroodonNode').security_rol.findById(id)
		.then(rol => {
			return rol.getSecurity_privileges()
		})
		.then(privileges => {
			
			for (var i = 0; i < privileges.length; i++) {
				hash[privileges[i].id]=privileges[i]
			};
	
		})
		.then(function(){
			return me.findAll({
				where:{
					belongs: 0
				}
			})
		})
		.then(function(proy){
			count--;
			list=proy
			if(proy.length>0)
				me._childs(proy,list,callback,counting,hashList)
			else
				callback(proy)
		})

		
	},
	_childs:function(proy,list,callback,counting,hashList){
		counting(proy.length)
		for (var i = 0; i < proy.length; i++) {
			let one=proy[i];
			if(this._isIn(one,hashList))
				one.dataValues.checked=true
			else
				one.dataValues.checked=false
			this.findAll({
				where:{
					belongs: one.id
				}
			}).then(function(proyNested){
				
				counting(-1)
				if(proyNested.length>0){
					one.dataValues.children=proyNested;
					one.dataValues.expanded=true;
					this._childs(proyNested,list,callback,counting,hashList)
				}else{
					one.dataValues.leaf=true;
				}
				if(counting()==0)
					callback(list);

			})
		};
		
	},
	_isIn:function(a,hashList){
		if(hashList()[a.id])
			return true
		else
			return false;
	},

	/**
	*
	* 
	*
	*/
	getTreeByRol:function(idroles){
		var me=this;
		var list=[]
		
		var promise=new this.R.Promise(function(resolve, reject){
			var count=[];
			function recurse(proy) {
				
				for(var i in proy){
					let one=proy[i]
					count.push(null)
			   		one.dataValues.leaf=true;
					me.findAll({
						include: [{ 
					     	model: me.R.getModels('TroodonNode').security_rol, 
					     	where: { 
					     		id: {
					     			$in: idroles
					     		}
					     	}
					     }],
						where:{
							belongs: one.id,
							type: {
								$or:[0,2]
							}
						}
					}).then(function(proyNested){
						count.pop()
						if(proyNested.length>0){
							one.dataValues.children=proyNested;
							one.dataValues.expanded=true;
							one.dataValues.leaf=false;
							recurse(proyNested)
						}
						if (count.length==0){
							resolve(list);
						}
						
					})
				};
			}

			me.findAll({
				include: [{ 
				     	model: me.R.getModels('TroodonNode').security_rol, 
				     	where: { 
				     		id: {
				     			$in: idroles
				     		}
				     	}
				     }],
				where:{
					belongs: 0,
					type: {
						$or:[0,2]
					}
				}
			}).then(function(proyNested){
				list=proyNested;
				
				if(proyNested.length>0){
					
					recurse(list)
				}else{
					resolve(list);
				}
			})
			// Kick off the async work
			    
		})
		
		return promise

	}
}