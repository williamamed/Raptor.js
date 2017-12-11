
module.exports={
	watch:[
		'security_category',
		'security_estructure',
		'security_privilege',
		'security_rol',
		'security_rol_security_privilege',
		'security_user',
		'security_user_rol',
		'security_trace'
	],
	create:function(queryInterface,R,data,done){
		
		
		this.createTableFromModel(R.getModels('TroodonNode').security_category)
		.then(result=>{
			done('Generating table security_category')
			return queryInterface.bulkInsert('security_category',data['security_category'])
			
		})
		.then(result=>{
			done('Importing table security_category')
			return this.createTableFromModel(R.getModels('TroodonNode').security_estructure);
		})
		.then(result=>{
			done('Generating table security_estructure')
			return queryInterface.bulkInsert('security_estructure',data['security_estructure'])
		})
		.then(result=>{
			done('Importing table security_estructure')
			return this.createTableFromModel(R.getModels('TroodonNode').security_privilege);
		})
		.then(result=>{
			done('Generating table security_privilege')
			return queryInterface.bulkInsert('security_privilege',data['security_privilege'])
		})
		.then(result=>{
			done('Importing table security_privilege')
			return this.createTableFromModel(R.getModels('TroodonNode').security_rol);
		})
		.then(result=>{
			done('Generating table security_rol')
			return queryInterface.bulkInsert('security_rol',data['security_rol'])
		})
		.then(result=>{
			done('Importing table security_rol')
			return this.createTableFromModel(R.getModels('TroodonNode').security_rol_security_privilege);
		})
		.then(result=>{
			done('Generating table security_rol_security_privilege')
			return queryInterface.bulkInsert('security_rol_security_privilege',data['security_rol_security_privilege'])
		})
		.then(result=>{
			done('Importing table security_rol_security_privilege')
			return this.createTableFromModel(R.getModels('TroodonNode').security_user);
		})
		.then(result=>{
			done('Generating table security_user')
			return queryInterface.bulkInsert('security_user',data['security_user'])
		})
		.then(result=>{
			done('Importing table security_user')
			return this.createTableFromModel(R.getModels('TroodonNode').security_user_rol);
		})
		.then(result=>{
			done('Generating table security_user_rol')
			return queryInterface.bulkInsert('security_user_rol',data['security_user_rol'])
		})
		.then(result=>{
			done('Importing table security_user_rol')
			return this.createTableFromModel(R.getModels('TroodonNode').security_trace);
		})
		.then(result=>{
			done('Generating table security_trace')
			done()
		})
		

	},
	destroy:function(queryInterface,R,data,done){
		queryInterface.dropTable('security_trace')
		.then(p=>{
			done("Deleting table security_trace")
			return queryInterface.dropTable('security_user_rol')
		})
		.then(p=>{
			done("Deleting table security_user_rol")
			return queryInterface.dropTable('security_user')
		})
		.then(p=>{
			done("Deleting table security_user")
			return queryInterface.dropTable('security_rol_security_privilege')
		})
		.then(p=>{
			done("Deleting table security_rol_security_privilege")
			return queryInterface.dropTable('security_rol')
		})
		.then(p=>{
			done("Deleting table security_rol")
			return queryInterface.dropTable('security_privilege')
		})
		.then(p=>{
			done("Deleting table security_privilege")
			return queryInterface.dropTable('security_estructure')
		})
		.then(p=>{
			done("Deleting table security_estructure")
			return queryInterface.dropTable('security_category')
		})
		.then(p=>{
			done("Deleting table security_category")
			done()
		})
		
	},
	export:function(queryInterface,R,done,save){
		
		var makeData={}


		R.getModels('TroodonNode').security_category.findAll()
		.then(result=>{
			makeData['security_category']=result;
			done('export table security_category')
			return R.getModels('TroodonNode').security_estructure.findAll()
		})
		.then(result=>{
			makeData['security_estructure']=result;
			done('export table security_estructure')
			return R.getModels('TroodonNode').security_privilege.findAll()
		})
		.then(result=>{
			makeData['security_privilege']=result;
			done('export table security_privilege')
			return R.getModels('TroodonNode').security_rol.findAll()
		})
		.then(result=>{
			makeData['security_rol']=result;
			done('export table security_rol')
			return R.getModels('TroodonNode').security_rol_security_privilege.findAll()
		})
		.then(result=>{
			makeData['security_rol_security_privilege']=result;
			done('export table security_rol_security_privilege')
			return R.getModels('TroodonNode').security_user.findAll()
		})
		.then(result=>{
			makeData['security_user']=result;
			done('export table security_user')
			return R.getModels('TroodonNode').security_user_rol.findAll()
		})
		.then(result=>{
			makeData['security_user_rol']=result;
			done('export table security_user_rol')
			save(makeData)
			done()
		})
		
	}
}