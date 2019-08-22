/**
 * Raptor.js - Raptor Cli Command
 * Generado automaticamente
 * 
 */

module.exports = {
    command: 'disable <component>',
    description: 'Desactiva un componente',
    action: function (action, argument, command) {
        const path = require('path')
        const fs = require('fs')
        const format = require('raptor-cli/lib/format')

        // Este comando corre en el ambito del cli, por lo tanto si queremos
        // interactuar con el proyecto actual creamos una instancia de configuracion
        // del core de Raptor. 
        // Puedes eliminar el bloque si no lo necesitas.
        
        try {
            var R = require(path.join(process.cwd(), 'bootstrap')).getClass()
            R.main(process.cwd());
            R.readConfig();
        } catch (e) {
            console.log(format.get("Error:", format.RED));
            console.log("Este comando es válido solo en en la raíz de un proyecto Raptor.js, si es así es posible que el proyecto no tenga todas dependencias instaladas o presente algún error en la carga de módulos.")
            return;
        }

        // Ahora puedes realizar cualquier accion en dependencia de la configuracion
        // de action y argument, format renderiza texto en los colores especificados
        // ej. yellow, blue, green, red

        if (R.bundles[action]) {
            var manifest = require(path.join(R.bundles[action].absolutePath, 'manifest.json'));

            manifest.state = false

            fs.writeFileSync(path.join(R.bundles[action].absolutePath, 'manifest.json'), JSON.stringify(manifest, null, 2));
            if(fs.existsSync(path.join(process.cwd(),'config','options.json'))){
                var config=JSON.parse(fs.readFileSync(path.join(process.cwd(),'config','options.json')));
                fs.writeFileSync(path.join(process.cwd(),'config','options.json'),JSON.stringify(config,null,2));
            }
            format.log("El componente '"+action+"' fue desactivado","blue")
            return;


        } else {
            format.log("El componente '" + action + "' no existe en el proyecto actual.", "red")
            return;
        }

        format.log("Los argumentos especificados no son válidos", "yellow")

    }
}