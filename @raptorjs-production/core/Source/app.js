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
if(process.env.RAPTOR_SCOPES){
    Raptor.scopes=Raptor.scopes.concat(process.env.RAPTOR_SCOPES.split(','))
}
Raptor.main(basedir);

var arg=process.argv;
for (let i = 0; i < arg.length; i++) {
    const element = arg[i];
    let opt=arg[i].split('=');
    if(opt.length>1){
        Raptor.options[opt.shift()]=opt.join('=');
    }
}

Raptor.start()