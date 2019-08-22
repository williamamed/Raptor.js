'use strict'
var fs = require('fs')
var path = require('path')
const fse = require('fs-extra')
const format = require('./../format')


module.exports = {
    command: '-l, --changelog',
    description: 'Muestra la lista de cambios',
    action: function (accion, argument, command) {
		console.log(fs.readFileSync(path.join(__dirname,'..','..','CHANGELOG.md')).toString())
    }
}