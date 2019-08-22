/**
 * Raptor.js - Raptor Cli Command
 * Generado automaticamente
 * 
 */

module.exports={
    command: 'enable <component>',
	description: 'Habilita el componente especificado',
	action: function (action, argument, command) {
        const path=require('path')
        const format=require('raptor-cli/lib/format')
        const fs=require('fs')
        // Este comando corre en el ambito del cli, por lo tanto si queremos
        // interactuar con el proyecto actual creamos una instancia de configuracion
        // del core de Raptor. 
        // Puedes eliminar el bloque si no lo necesitas.
        
		try {
			var R = require(path.join(process.cwd(), 'bootstrap')).getClass()
            R.main(process.cwd());
            R.validateComponent=function(){}
            R.readConfig();
		} catch (e) {
			
			console.log(format.get("Error:", format.RED));
			console.log("Este comando es válido solo en en la raíz de un proyecto Raptor.js, si es así es posible que el proyecto no tenga todas dependencias instaladas o presente algún error en la carga de módulos.")
			return;
        }

        if(R.bundles[action] && fs.existsSync(path.join(R.bundles[action].absolutePath,'manifest.json'))){
            var manifest=JSON.parse(fs.readFileSync(path.join(R.bundles[action].absolutePath,'manifest.json')));
            manifest.state=true;
            fs.writeFileSync(path.join(R.bundles[action].absolutePath,'manifest.json'),JSON.stringify(manifest,null,2));
            if(fs.existsSync(path.join(process.cwd(),'config','options.json'))){
                var config=JSON.parse(fs.readFileSync(path.join(process.cwd(),'config','options.json')));
                fs.writeFileSync(path.join(process.cwd(),'config','options.json'),JSON.stringify(config,null,2));
            }
            
            format.log("El componente '"+action+"' fue activado","blue")
        }else{
            format.log("El componente '" + action + "' no existe en el proyecto actual.", "red")
        }
        

    }
}