'use strict';

class DevData {

    /**
     * @Injectable
     * @Development
     */
    init(Options) {
        this.format = require('./util/format')
        this.connectToPanel()

        /**
         * Rebovinar el stack y configurar
         * un middleware
         */
        R.rewind(5)
            .restore(function () {
                R.app.use(function (req, res, next) {

                    req.profiler = {
                        start: process.hrtime()
                    }

                    next();
                })
            })
    }

    prepareRoutes() {
        var routesDef = {};

        var routes = R.app._router.stack;
        for (let index = 0; index < routes.length; index++) {
            if (!routes[index].route)
                continue;
            if (routesDef[routes[index].route.path])
                routesDef[routes[index].route.path].push(routes[index].route.methods)
            else
                routesDef[routes[index].route.path] = [routes[index].route.methods]

        }

        return routesDef;

    }

    /**
     * @Injectable
     */
    connectToPanel(Options) {

        var client = require('socket.io-client')('http://127.0.0.1:4441/project')
        var rxjs = require('rxjs')
        client.on('connect', () => {
            var components = {}
            console.log(this.format.get('Core:', 'yellow'), 'Conectado con el panel de control...')
            rxjs.pairs(R.bundles)
                .subscribe((value) => {

                    components[value[0]] = {
                        name: value[1].name,
                        vendor: value[1].vendor,
                        absolutePath: value[1].absolutePath,
                        path: value[1].path,
                        external: value[1].external
                    }

                })

            client.emit("project.ready", {
                components: components,
                port: Options.port,
                routes: this.prepareRoutes()
            })
        })
    }

    /**
     * @Event("sendresponse")
     */
    preparePanel(req) {
        var ram = process.memoryUsage();

        req.res.render('core:minify-panel/profiler-min', {
            time: Math.floor((process.hrtime(req.profiler.start)[1] / 1e9) * 1000) / 1000,
            memory: Math.floor(ram.heapUsed / (1024 * 1024)) + 'MB - ' + Math.floor(ram.heapTotal / (1024 * 1024)) + 'MB',
            routes: Object.keys({}).length,
            routesDef: {},
            session: req.user,
            auth: req.isAuthenticated(),
            lang: req.language ? req.language.getCurrentLanguage() : 'none'
        }, function (err, str) {

            req.viewPlugin.set('raptor_profiler', str)
        })
    }
}
module.exports = DevData;