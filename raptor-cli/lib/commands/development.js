'use strict'
var fs = require('fs')
var path = require('path')
const fse = require('fs-extra')
const format = require('./../format')
const http=require('http')
const os = require('os')

module.exports = {
    command: 'dev [import|delete] <nombre>',
    description: 'Importa o elimina un componente',
    action: function (accion, argument, command) {
		
		switch(accion){
			case "import":{
				this.import(argument[0])
				
				break;
			}
			case "delete":{
				if (fs.existsSync(path.join(os.homedir(),'raptor.cli.dev','cli.development',argument[0]))){
					fse.removeSync(path.join(os.homedir(),'raptor.cli.dev','cli.development',argument[0]));
					format.log("El componente especificado fue eliminado del area de componentes de desarrollo.","yellow")
				}else
					format.log("El componente especificado no existe en el area de componentes de desarrollo.","red")
				break;
			}
			default:{
				break;
			}
		}
        
        
    },
	import:function(file){
		var admZip = require('adm-zip')
		if(file.substring(0,4)=="http"){
			console.log("Descargando ......")
			var self=this;
			this.download(file,path.join(os.tmpdir(),path.basename(file)),function(err){
				if(!err){
					var zipWww = new admZip(path.join(os.tmpdir(),path.basename(file)))
					zipWww.extractAllTo(path.join(os.homedir(),'raptor.cli.dev','cli.development'))
					
					if(self.validate(path.join(os.homedir(),'raptor.cli.dev','cli.development',path.basename(file,'.zip')))){
						format.log("Hecho!!", "yellow")
					}else{
						fse.removeSync(path.join(os.homedir(),'raptor.cli.dev','cli.development',path.basename(file,'.zip')));
					
						format.log("El componente que está intentando importar no contiene una estructura válida", "red")
					}
					fse.removeSync(path.join(os.tmpdir(),path.basename(file)));
						
				}else{
					format.log("Ocurrio un error en la descarga:"+err, "red")
				}
			})
		}else{
			var zipWww = new admZip(file)
			zipWww.extractAllTo(path.join(os.homedir(),'raptor.cli.dev','cli.development'))
			if(this.validate(path.join(os.homedir(),'raptor.cli.dev','cli.development',path.basename(file,'.zip')))){
				format.log("Hecho!!", "yellow")
			}else{
				fse.removeSync(path.join(os.homedir(),'raptor.cli.dev','cli.development',path.basename(file,'.zip')));
					
				format.log("El componente que está intentando importar no contiene una estructura válida", "red")
			}
			
		}
	},
	validate:function(file){
		var valid=true;
		if(!fs.existsSync(path.join(file,'manifest.json'))){
			valid=false;
		}
		if(!fs.existsSync(path.join(file,'index.js'))){
			valid=false;
		}
		return valid;
	},
	download:function(url,dest,cb){
		var file=fs.createWriteStream(dest);
		var request=http.get(url,function(response){
			response.pipe(file);
			file.on('finish',function(){
				if(response.statusCode==404){
					file.close();
					fs.unlink(dest);
					if(cb)
						cb("Error 404, archivo no encontrado");
				}else{
					file.close(cb);
				}
			})
			
			
			
		})
		.on('error',function(err){
			fs.unlink(dest);
			if(cb)
				cb(err.message);
		})
	}
}