'use strict';

class DynamicPrivilege {

    constructor() {

        this.root = {
            children: []
        };
        this.map = {
            0: this.root
        }

    }

    authorizationFlow(req, next, paths) {
        if (this.__verifyPermission(paths)) {

            req.viewPlugin.set('raptor_client', {
                name: "secureTroodon",
                callback: require(__dirname + '/ClientFunction').control
            })
            req.viewPlugin.set('raptor_client', {
                name: "controlActions",
                callback: require(__dirname + '/ClientFunction').control
            })
            req.viewPlugin.set('raptor_client', {
                name: "dataTroodon",
                callback: {
                    /**
                     * Aqui an todas las acciones permitidas leidas por el motor
                     */
                    actions: this.getPlainArray(),
                    root: req.url
                }
            })
            next()
        } else {
            req.logger.alert('Access Denied Route (Mode development): ' + req.url + ' \nMethod: ' + req.method + ' \nParams: ' + JSON.stringify(req.body))
            req.res.end('ACCESO DENEGADO (Modo desarrollo)')
        }
    }

    /**
     * Adiciona un privilegio dinamico al registro
     * 
     * @param {string} name 
     * @param {string} route 
     * @param {string} className 
     */
    addPrivilege(name, route, className) {
        var splited = name.split('->');
        var funName = splited.pop();
        var belongs = 0;

        splited.forEach(element => {
            let container = {
                id: element,
                route: '',
                name: element,
                type: 2,
                children: [],
                class_name: '',
                leaf: false,
                belongs: belongs
            }
            if (!this.map[element]) {
                this.map[belongs].children.push(container);
                this.map[element] = container;
            }

            belongs = element
        });

        let privilege = {
            id: route,
            route: route,
            name: funName,
            type: 0,
            children: [],
            leaf: false,
            class_name: className,
            belongs: belongs
        };
        this.map[belongs].children.push(privilege);
        this.map[route] = privilege;
    }

    getPrivileges() {
        return this.map;
    }

    __verifyPermission(paths) {
        for (let index = 0; index < paths.length; index++) {
            const element = paths[index];
            
            if (this.map[element])
                return true;
        }
        return false;
    }

    createActions() {

        var routes = this.getDeclaredRoutes();

        for (const key in this.map) {
            let priv = this.map[key];
            if (key == 0)
                continue;
            if (priv.type == 2)
                continue;
            var route = priv.route;
            if (route.length > 0 && route.charAt(route.length - 1) != '/')
                route += '/';
            routes.forEach(value => {
                if (value.indexOf(route) == 0 && value.length > route.length) {
                    var aux = value.replace(route, '');
                    aux = aux.replace('/', '_')
                    let action = {
                        id: value,
                        route: value,
                        name: aux,
                        belongs: priv.id,
                        type: 1,
                        leaf: true
                    };
                    this.map[priv.id].children.push(action)
                    this.map[action.id] = action;
                }
            })

        }

    }

    getDeclaredRoutes() {
        var idx = 0;
        var stack = R.app._router.stack
        var matched = []
        while (idx < stack.length) {

            var layer = stack[idx++];
            if (layer.route)
                matched.push(layer.route.path)
        }
        return matched;
    }

    getPlainArray() {
        var flat = []
        for (const key in this.map) {
            if (key != 0)
                flat.push(this.map[key]);
        }
        return flat;
    }

    getBuildMenu() {
        return this.root.children;
    }

    getBuildMenuPromise() {
        var self = this
        return new Promise(function (res) {
            res(self.getBuildMenu());
        })
    }

    /**
     * @Inyectable
     */
    import(rol, troodon_security_privilege, troodon_security_rol, DynamicPrivilege, Umzug) {
        var base = 0;

        //Clean de id from the map object
        for (const key in DynamicPrivilege.map) {
            if (DynamicPrivilege.map[key].id) {
                delete DynamicPrivilege.map[key].id
            }
        }
        DynamicPrivilege.root.id = 0;
        var rolProy;
        let resolver;
        let reject;
        let prom = new Promise(function (res, rej) {
            resolver = res;
            reject = rej;
        })
            .then(function () {
                return troodon_security_privilege.destroy({
                    where: {},
                    truncate: { cascade: true },
                    force: true
                });
            })
            .then(function () {
                return DynamicPrivilege._child(DynamicPrivilege.root);
            })
            .then(function () {
                if (rol) {
                    return troodon_security_rol.findOne({
                        where: {
                            name: rol
                        }
                    })
                } else {
                    return false;
                }
            })
            .then(function (result) {
                if (result) {
                    rolProy = result;
                    return troodon_security_privilege.findAll()
                } else {
                    return false;
                }

            })
            .then(function (result) {
                if (result) {
                    var priv = []
                    result.forEach(element => {
                        priv.push(element.id)
                    })
                    return rolProy.setSecurity_privileges(priv)
                } else {
                    return true;
                }

            })

        Umzug.up("01-troodontables.mig")
            .then(function (migrations) {
                resolver()
            })
            .catch(function (err) {
                if (err.message.indexOf('Migration is not pending') < 0) {
                    reject(err)
                } else {
                    resolver()
                }

            })
        return prom;

    }

    /**
     * @Inyectable
     */
    _child(child, troodon_security_privilege, DynamicPrivilege) {

        child.children.map(element => {
            element.belongs = child.id;
            return element;
        });

        return troodon_security_privilege
            .bulkCreate(child.children)
            .then(function (records) {
                let resolver;
                let prom = new Promise(function (res) {
                    resolver = res;
                });
                for (let index = 0; index < records.length; index++) {
                    console.log('Adicionando', records[index].name, records[index].route, '...');
                    const element = records[index];
                    child.children[index].id = element.id;
                    if (child.children[index].children && child.children[index].children.length > 0) {
                        prom = prom.then(function () {
                            return DynamicPrivilege._child(child.children[index])
                        })

                    }

                }
                resolver()
                return prom;
            })

    }
}
module.exports = DynamicPrivilege;