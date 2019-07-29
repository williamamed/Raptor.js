
module.exports = {
    up: $i.later(function (query, datatype, example_cars, example_users,Migration) {
        
        const data = require(__dirname + "/data.json")
        
        return example_users.sync()
            .then(function () {
                return example_cars.sync()
            })
            .then(function () {
                return query.bulkInsert('users', data['users'])
            })
            .then(function () {
                return query.bulkInsert('cars', data['cars'])
            })
    }),
    down: function () {
        return query.dropTable('cars')
            .then(function () {
                query.dropTable('users')
            })
    }
}