
const Migration = {
    reIndex: function (name, attr) {
        if (R.database.sequelize.options.dialect == 'postgres' || R.database.sequelize.options.dialect == 'oracle')
            return R.database.sequelize.query('select max(' + attr + ') from ' + name)
                .then(function (max) {

                    return R.database.sequelize.query("ALTER SEQUENCE " + name + "_id_seq START WITH " + (max[0][0].max + 1) + " RESTART");
                })
                .then(function () {
                    console.log("Re-indexando tabla "+name+", hecho!!")

                })
                .catch(function () {

                })
        else
            return new Promise(function () { })
    },
    createTableFromModel : function (model) {

        return R.database.sequelize.queryInterface.createTable(model.tableName, model.tableAttributes)
    }
}

module.exports = $injector.invokeLater(function (sequelize,Sequelize,Options) {
    var Umzug = require('umzug')
    var umzug = new Umzug({
        path: process.cwd() + '/sequelize-meta.json',
        storage: 'sequelize',
        storageOptions: {
            sequelize: sequelize,
            columnName: 'migration',
            model: sequelize.define('raptormigration', {
                migration: {
                    type: new Sequelize.STRING(100),
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                    autoIncrement: false
                }
            }, {
                    tableName: 'raptormigration',
                    timestamps: false
                })
        },
        // see: https://github.com/sequelize/umzug/issues/17
        migrations: {
            params: [
                sequelize.getQueryInterface(), // queryInterface
                sequelize.constructor, // DataTypes
                function () {
                    throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
                }
            ],
            path: R.basePath + '/src',
            traverseDirectories: true,
            pattern: /^\d+[\w-]+\.mig.js$/

        },
    })
    $injector('Umzug', umzug);
    Migration.umzug = umzug;
    $injector('Migration', Migration);
    if(Options && Options.runMigrations!=false)
        R.emit('migration:ready')
        
})