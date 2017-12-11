
module.exports={
	watch:['biouser'],
	create:function(queryInterface,R,data,done){
		this.createTableFromModel(R.getModels('BioNode').biouser)
		.then(r=>{
			done('Generating table biouser')
			done()
		})
	},
	destroy:function(queryInterface,R,data,done){
		queryInterface.dropTable('biouser')
		then(p=>{
			done('Deleting table biouser')
			done()
		})
	},
	export:function(queryInterface,R,data,done){
		done()
	}
}