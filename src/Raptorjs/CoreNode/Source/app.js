
var  Raptor=require('./Raptor');

var basedir=process.cwd();
var format= require('./util/format')
var fs = require('fs')
var msg=fs.readFileSync(__dirname+'/util/raw.data').toString();
console.log(format.get(msg,format.GREEN));

Raptor.main(basedir);
Raptor.start()