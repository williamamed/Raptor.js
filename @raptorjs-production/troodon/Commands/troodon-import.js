/**
 * Raptor.js - Raptor Cli Command
 * Generado automaticamente
 * 
 */

module.exports = {
    command: 'troodon-import <rol>',
    description: 'importa los privilegios en memoria hacia el esquema bd',
    action: function (action, argument, command) {
        const path = require('path')
        const format = require('raptor-cli/lib/format')
        
        // Este comando corre en el ambito del cli, por lo tanto si queremos
        // interactuar con el proyecto actual creamos una instancia de configuracion
        // del core de Raptor. 
        // Puedes eliminar el bloque si no lo necesitas.

        try {
            var R = require(path.join(process.cwd(), 'bootstrap')).getClass()
            process.env.RAPTOR_MODE = 'development';
            R.main(process.cwd());
            R.options.http = false;
            R.on('troodon:dynamicPrivilege.ready', function () {
                if ($i('DynamicPrivilege')) {
                    if (R.database) {
                        $i('DynamicPrivilege').import(action)
                            .then(function () {
                                format.log("Hecho!", "yellow")
                                process.exit()
                            })
                            .catch(function (err) {
                                format.log("No se importaron los privilegios: "+err.toString(), "red")
                                process.exit()
                            })
                    }else{
                        format.log("No se importaron los privilegios: No existe un conexión activa con la Base de datos", "red")
                        process.exit()
                    }

                } else {
                    process.exit()
                }

            })
            R.start();
        } catch (e) {

            console.log(format.get("Error:", format.RED));
            console.log("Este comando es válido solo en en la raíz de un proyecto Raptor.js, si es así es posible que el proyecto no tenga todas dependencias instaladas o presente algún error en la carga de módulos.")
            return;
        }
        var readline = require('readline'),
            rl = readline.createInterface(process.stdin, process.stdout);

        rl.prompt();


    }
}