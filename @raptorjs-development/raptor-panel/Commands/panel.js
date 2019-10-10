/**
 * Raptor.js - Raptor Cli Command
 * Generado automaticamente
 * 
 */

module.exports = {
    command: 'panel',
    description: 'Levanta el panel de control',
    action: function (action, argument, command) {



        const path = require('path')
        const format = require('raptor-cli/lib/format')
        const os = require('os')
        const fs = require('fs')


        // Este comando corre en el ambito del cli, por lo tanto si queremos
        // interactuar con el proyecto actual creamos una instancia de configuracion
        // del core de Raptor. 
        // Puedes eliminar el bloque si no lo necesitas.
        if (!fs.existsSync(path.join(os.homedir(), 'raptor.cli.json')))
            fs.writeFileSync(path.join(os.homedir(), 'raptor.cli.json'), '{}');
        var config = require(path.join(os.homedir(), 'raptor.cli.json'))

        if (config.RAPTOR_DEV_EXTERNAL_COMPONENTS) {
            config.RAPTOR_DEV_EXTERNAL_COMPONENTS = config.RAPTOR_DEV_EXTERNAL_COMPONENTS = [
                path.join(os.homedir(), 'raptor.cli.dev')

            ].concat(config.RAPTOR_DEV_EXTERNAL_COMPONENTS.split(','))
        } else
            config.RAPTOR_DEV_EXTERNAL_COMPONENTS = [
                path.join(os.homedir(), 'raptor.cli.dev')
            ]
        config.RAPTOR_MODE = 'development';
        try {
            config.RAPTOR_SCOPES = [path.join(require.resolve('@raptorjs/raptor-panel'), '..', '..')]
        } catch (error) {

        }

        process.env.NODE_PATH = module.paths.join(';');
        require('module').Module._initPaths();
        format.log("Levantando el panel de control en el puerto 4441 ...", "yellow")
        try {
            var Raptor = require(path.join(process.cwd(), 'bootstrap')).getClass()
            Raptor.main(process.cwd());
            
            if (config.RAPTOR_DEV_EXTERNAL_COMPONENTS) {
                Raptor.addExternalComponents(config.RAPTOR_DEV_EXTERNAL_COMPONENTS)
            }
            if (typeof config.RAPTOR_EXTERNAL_COMPONENTS == 'string')
                config.RAPTOR_EXTERNAL_COMPONENTS = [config.RAPTOR_EXTERNAL_COMPONENTS]

            if (config.RAPTOR_EXTERNAL_COMPONENTS) {
                Raptor.addExternalComponents(config.RAPTOR_EXTERNAL_COMPONENTS)
            }
            if (config.RAPTOR_SCOPES) {
                Raptor.scopes = Raptor.scopes.concat(config.RAPTOR_SCOPES)
            }

            Raptor.options.port = 4441;
            if (!Raptor.options.socketio)
                Raptor.options.socketio = {}
            Raptor.options.socketio.active = true;
            Raptor.options.raptorPanel=true;
            Raptor.filteredBundles={};

            (function (register) {
                Raptor._register = register;
                Raptor.registerComponent = function (comp, vendor, validate, external) {
                    //if (external || force)
                    Raptor.filteredBundles[comp]={
                        name: comp,
                        vendor: vendor,
                        external: external
                    };
                    //console.log(comp,external)
                    var secure = ['core', 'ng-portal','extjs'];
                    var aprobed = false;
                    if (secure.indexOf(comp) >= 0) {
                        
                        aprobed = true;
                    } else {
                        if (external && path.join(external, vendor).split(config.RAPTOR_SCOPES[0]).length > 1) {
                            
                            aprobed = true;
                        } else {
                            if (external) {

                                config.RAPTOR_DEV_EXTERNAL_COMPONENTS.forEach(function (value) {
                                    if(path.join(external, vendor).split(value)>1){
                                        aprobed = true;
                                        
                                    }
                                        
                                })
                            }
                        }
                    }
                    if (aprobed) {
                        
                        register.apply(R, arguments)
                    }


                };
            })(Raptor.registerComponent);

            /**(function (validate) {
                //Raptor._register=register;
                Raptor.validateComponent = function (bundle) {
                    //Raptor.bundles[bundle].absolutePath.split(config.RAPTOR_SCOPES[0])
                    if (Raptor.bundles[bundle].absolutePath.split('src').length > 1) {
                        if (Raptor.bundles[bundle].manifest.state == false)
                            delete Raptor.bundles[bundle];

                    } else {
                        validate.apply(R, arguments)
                    }

                };
            })(Raptor.validateComponent)*/

            Raptor.scanSource = function () {
                var rutaSrc = path.join(Raptor.basePath, 'src');
                fs
                    .readdirSync(rutaSrc)
                    .forEach(function (file) {

                        fs
                            .readdirSync(path.join(rutaSrc, file))
                            .filter(function (fileNode) {
                                var sub = fileNode.substring(fileNode.length - 4);

                                return (fileNode.indexOf('.') !== 0) && (fileNode !== 'index.js') && (fs.existsSync(path.join(rutaSrc, file, fileNode, 'manifest.json')))
                            })
                            .forEach(function (comp) {

                                try {
                                    var work = require(path.join(rutaSrc, file, comp, 'Workspace'));

                                } catch (e) {

                                }
                                Raptor.registerComponent(comp, file, false, false, true)

                            })

                    })

                var vendors = {};

                for (var i in Raptor.bundles) {
                    vendors[i] = Raptor.bundles[i];

                    if (!Raptor.bundles[i].init)
                        delete Raptor.bundles[i];
                }
                Raptor.bundles = vendors;
                return vendors;
            }
            Raptor.start();
            //Raptor.registerComponent=Raptor._register;
            //Raptor.scanSource()
        } catch (e) {

            console.log(format.get("Error:", format.RED), e);
            console.log("Este comando es válido solo en en la raíz de un proyecto Raptor.js, si es así es posible que el proyecto no tenga todas dependencias instaladas o presente algún error en la carga de módulos.")
            return;
        }

        // Ahora puedes realizar cualquier accion en dependencia de la configuracion
        // de action y argument, format renderiza texto en los colores especificados
        // ej. yellow, blue, green, red

        

    }
}