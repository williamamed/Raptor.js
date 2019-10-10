
module.exports = {
    version: "Troodon",
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
                    
                    return $i.invoke(function (ProjectManager) {
                        return postRequest('127.0.0.1', ProjectManager.port, '/api/development/troodon/import', req.body)
                            .then(function(message){
                                return JSON.parse(message.toString()).msg;
                            })
                    })
                } else
                    throw new Error("Alguno de los argumentos obligatorios están vacíos.")
            }
        }
    }
}

function postRequest(url, port, path, toSend) {

    return new Promise(function (resolve, rej) {
        const http = require('http')

        const data = JSON.stringify(toSend)

        const options = {
            hostname: url,
            port: port,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = http.request(options, (res) => {
            //console.log(`statusCode: ${res.statusCode}`)

            res.on('data', (d) => {
                //process.stdout.write(d)
                if(res.statusCode=='200')
                    resolve(d)
                else
                    rej(d)

            })
        })

        req.on('error', (error) => {
            //console.error(error)
            rej(error)
        })

        req.write(data)
        req.end()
    })


}