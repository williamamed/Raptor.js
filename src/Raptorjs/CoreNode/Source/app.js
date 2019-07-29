process.env.NODE_PATH = module.paths.join(';');

require('module').Module._initPaths();
var  Raptor=require('./Raptor');

var basedir=process.cwd();
var format= require('./util/format')
var fs = require('fs')
var msg=fs.readFileSync(__dirname+'/util/raw.data').toString();
console.log(format.get(msg,format.GREEN));
if(process.env.RAPTOR_DEV_EXTERNAL_COMPONENTS){
    Raptor.addExternalComponents(process.env.RAPTOR_DEV_EXTERNAL_COMPONENTS.split(','))
}
if(process.env.RAPTOR_EXTERNAL_COMPONENTS){
    Raptor.addExternalComponents(process.env.RAPTOR_EXTERNAL_COMPONENTS.split(','))
}
Raptor.main(basedir);
Raptor.start()