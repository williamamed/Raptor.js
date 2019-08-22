/**
 * Raptor.js - Raptor Cli Command
 * Generado automaticamente
 * 
 */
const path = require('path')
const format = require('raptor-cli/lib/format')
const fs=require('fs')
const admZip = require('adm-zip')
const os=require('os')
const http=require('http')
const fse=require('fs-extra')

module.exports = {
    command: 'install <agrupador> <zipFile|URL>',
    description: 'Instala un componente',
    action: function (action, argument, command) {


        // Este comando corre en el ambito del cli, por lo tanto si queremos
        // interactuar con el proyecto actual creamos una instancia de configuracion
        // del core de Raptor. 
        // Puedes eliminar el bloque si no lo necesitas.
        
        try {
            var R = require(path.join(process.cwd(), 'bootstrap')).getClass()
            
        } catch (e) {

            console.log(format.get("Error:", format.RED));
            console.log("Este comando es válido solo en en la raíz de un proyecto Raptor.js, si es así es posible que el proyecto no tenga todas dependencias instaladas o presente algún error en la carga de módulos.")
            return;
        }
        
        // Ahora puedes realizar cualquier accion en dependencia de la configuracion
        // de action y argument, format renderiza texto en los colores especificados
        // ej. yellow, blue, green, red
        if(argument.length>0){
            
            this.import(argument[0],path.join(process.cwd(),'src',action))
        }else{
            format.log("El argumento <zipFile|URL> es requerido", "red")
        }
        
        

    },
    import: function (file,vendor) {
        if(!fs.existsSync(vendor))
            fs.mkdirSync(vendor)
        if (file.substring(0, 4) == "http") {
            console.log("Descargando ......")
            var self=this;
            this.download(file, path.join(os.tmpdir(),path.basename(file)), function (err) {
                if (!err) {
                    var zipWww = new admZip(path.join(os.tmpdir(), path.basename(file)))
                    zipWww.extractAllTo(path.join(vendor))

                    if (self.validate(path.join(vendor, path.basename(file, '.zip')))) {
                        format.log("Hecho!!", "yellow")
                    } else {
                        fse.removeSync(path.join(vendor, path.basename(file, '.zip')));

                        format.log("El componente que está intentando importar no contiene una estructura válida", "red")
                    }
                    fse.removeSync(path.join(os.tmpdir(), path.basename(file)));

                } else {
                    format.log("Ocurrio un error en la descarga:" + err, "red")
                }
            })
        } else {
            var zipWww = new admZip(file)
            zipWww.extractAllTo(path.join(vendor))
            if (this.validate(path.join(vendor, path.basename(file, '.zip')))) {
                format.log("Hecho!!", "yellow")
            } else {
                fse.removeSync(path.join(vendor, path.basename(file, '.zip')));

                format.log("El componente que está intentando importar no contiene una estructura válida", "red")
            }

        }
    },
    validate: function (file) {
        var valid = true;
        if (!fs.existsSync(path.join(file, 'manifest.json'))) {
            valid = false;
        }
        if (!fs.existsSync(path.join(file, 'index.js'))) {
            valid = false;
        }
        return valid;
    },
    download: function (url, dest, cb) {
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