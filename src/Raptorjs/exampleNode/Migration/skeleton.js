
module.exports = {
    watch: ['cars', 'users'],
    create: function (queryInterface, R, data, done) {

        done('Generando tabla de ejemplo users')
        return this.createTableFromModel($injector('example_users'))

            .then(result => {

                done('importando datos a tabla users')
                return queryInterface.bulkInsert('users', data['users'])

            })
            .then(() => {
                done('Generando tabla de ejemplo cars')
                return this.createTableFromModel($injector('example_cars'))
            })
            .then(result => {

                done('importando datos a tabla cars')
                return queryInterface.bulkInsert('cars', data['cars'])

            })
            .then(result => {
                done()
            })
    }
}