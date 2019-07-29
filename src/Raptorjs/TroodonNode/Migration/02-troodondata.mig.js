var Bluebird = require('bluebird');

module.exports = {
    up: $injector.invokeLater(function (query, DataTypes,
        Migration) {
        const data = require(__dirname + "/data.json")
        return query.bulkInsert('security_category', data['security_category'])
            .then(function () {
                return Migration.reIndex('security_category', 'id')
            })
            .then(function () {
                return query.bulkInsert('security_estructure', data['security_estructure'])
            })
            .then(function () {
                return Migration.reIndex('security_estructure', 'id')
            })
            .then(function () {
                return query.bulkInsert('security_privilege', data['security_privilege'])
            })
            .then(function () {
                return Migration.reIndex('security_privilege', 'id')
            })
            .then(function () {
                return query.bulkInsert('security_rol', data['security_rol'])
            })
            .then(function () {
                return Migration.reIndex('security_rol', 'id')
            })
            .then(function () {
                return query.bulkInsert('security_rol_security_privilege', data['security_rol_security_privilege'])
            })
            .then(function () {
                return Migration.reIndex('security_rol_security_privilege', 'id')
            })
            .then(function () {
                return query.bulkInsert('security_user', data['security_user'])
            })
            .then(function () {
                return Migration.reIndex('security_user', 'id')
            })
            .then(function () {
                return query.bulkInsert('security_user_rol', data['security_user_rol'])
            })
            .then(function () {
                return Migration.reIndex('security_user_rol', 'id')
            })

    }),
    down: function (query) {
        return new Bluebird(function (resolve, reject) {
            resolve()
        });
    }
}