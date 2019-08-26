
module.exports = {
    version: "Troodon-" + R.bundles['troodon'].manifest.version,
    templates: {
        'import': {
            title: "Importa los privilegios dinámicos de desarrollo hacia el esquema de base de datos de producción",
            fields: [{
                type: "text",
                label: "Rol",
                name: "rol",
                placeholder: "ej. RaptorAdmin",
                required: true
            }],
            button: {
                text: "Importar"
            },
            action: function (req, R) {

                if (req.body.rol) {
                    return $i.invoke(function (DynamicPrivilege) {
                        return DynamicPrivilege.import(req.body.rol)
                            .then(function () {
                                console.log('hecho!')
                            })
                    })
                } else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        }
    }
}