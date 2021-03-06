
module.exports = {
    up: $injector.invokeLater(function (query,
        DataTypes,
        Migration,
        troodon_security_category,
        troodon_security_estructure,
        troodon_security_privilege,
        troodon_security_rol,
        troodon_security_user_rol,
        troodon_security_rol_security_privilege,
        troodon_security_user,
        troodon_security_trace) {

        const data = require(__dirname + "/data.json")

        return troodon_security_category.sync()
            .then(function () {
                return troodon_security_estructure.sync()
            })
            .then(function () {
                return troodon_security_privilege.sync()
            })
            .then(function () {
                return troodon_security_rol.sync()
            })
            .then(function () {
                return troodon_security_rol_security_privilege.sync()
            })
            .then(function () {
                return troodon_security_user.sync()
            })
            .then(function () {
                return troodon_security_user_rol.sync()
            })
            .then(function () {
                return troodon_security_trace.sync()
            })
            //Running insert data
            .then(function () {
                query.bulkInsert('security_category', data['security_category'])
            })
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
                return query.bulkInsert('security_rol', data['security_rol'])
            })
            .then(function () {
                return Migration.reIndex('security_rol', 'id')
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
        return query.dropTable('security_trace')
            .then(function () {
                return query.dropTable('security_user_rol')
            })
            .then(function () {
                return query.dropTable('security_user')
            })
            .then(function () {
                return query.dropTable('security_rol_security_privilege')
            })
            .then(function () {
                return query.dropTable('security_rol')
            })
            .then(function () {
                return query.dropTable('security_privilege')
            })
            .then(function () {
                return query.dropTable('security_estructure')
            })
            .then(function () {
                return query.dropTable('security_category')
            })
    }
}