
module.exports = {
	watch: ['biouser'],
	create: function (queryInterface, R, data, done) {
		return this.createTableFromModel(R.getModels('BioNode').biouser)
			.then(r => {
				done('Generando tabla biouser')
				done()
			})
	},
	destroy: function (queryInterface, R, data, done) {
		return queryInterface.dropTable('biouser')
		then(p => {
			done('Eliminando tabla biouser')
			done()
		})
	},
	export: function (queryInterface, R, data, done) {
		done()

	}
}