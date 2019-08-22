'use strict'
var fs = require('fs')
var path = require('path')
const fse = require('fs-extra')
const format = require('./../format')
const http=require('http')
const os=require('os')

module.exports = {
    command: 'env [set|get|delete|list] <key> <value>',
    description: 'Configura las variables cli',
    action: function (accion, argument, command) {
		if(!fs.existsSync(path.join(os.homedir(),'raptor.cli.json')))
			fs.writeFileSync(path.join(os.homedir(),'raptor.cli.json'),'{}');
		var conf=require(path.join(os.homedir(),'raptor.cli.json'))
		switch(accion){
			case "set":{
				if(argument.length==2){
					conf[argument[0]]=argument[1];
					format.log('Hecho!','green')
					fs.writeFileSync(path.join(os.homedir(),'raptor.cli.json'),JSON.stringify(conf,null,2));
				}
				
				break;
			}
			case "delete":{
				if(argument.length==1){
					delete conf[argument[0]];
					format.log('Hecho!','green')
					fs.writeFileSync(path.join(os.homedir(),'raptor.cli.json'),JSON.stringify(conf,null,2));
				}
				break;
			}
			case "get":{
				if(argument.length==1){
					console.log(conf[argument[0]])
				}
				break;
			}
			case "list":{
				for(var item in conf){
					console.log(format.get(item+":",'yellow'),conf[item])
				}
				if(Object.keys(conf).length==0){
					console.log('No existen valores en la configuración, utilice la instrucción set para establecer alguno')
				}
				break;
			}
			default:{
				break;
			}
		}
        
        
    }
}