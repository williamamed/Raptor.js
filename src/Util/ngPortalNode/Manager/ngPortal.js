'use strict';
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const lodash = require('lodash')

class ngPortal {

    constructor(name) {
        this.name = name;

        this.protect = false;
        this.securityMenu = false
        this.profile = false
    }

    /**
        viewPlugin(hotpot, content) {
            if (this.req) {
    
                this.req.viewPlugin.set('ngPortal_' + hotpot, content)
            }
            return this
        }*/

    disableProfile() {
        this.profile = false
        return this
    }

    disableSecurityMenu() {
        this.securityMenu = false
        return this
    }

    /**template(a, b) {
        var div = a.split(':')
        b = lodash.extend((b) ? b : {}, { R: $injector('R').viewFunctions });

        b.R.__setRequest(this.req);
        if (div.length == 2 && $injector('R').bundles[div[0]]) {
            var view = path.join($injector('R').basePath, 'src', $injector('R').bundles[div[0]].path, 'Views', div[1]);

            return ejs.render(fs.readFileSync(view).toString(), b)
        } else {
            return ejs.render(fs.readFileSync(a), b)
        }

    }*/

    run(req, res, next) {
        var self = this;

        this.viewPlugin = function (hotpot, content) {
            if (req) {

                req.viewPlugin.set('ngPortal_' + hotpot, content)
            }
            return self
        }

        this.template = function (a, b) {
            var div = a.split(':')
            var viewFn = new R.ViewFunctions(R);
            viewFn.__setRequest(req);

            b = lodash.extend((b) ? b : {}, { R: viewFn,public:viewFn.public });

            if (div.length == 2 && $injector('R').bundles[div[0]]) {
                var view = path.join($injector('R').bundles[div[0]].absolutePath, 'Views', div[1]);

                return ejs.render(fs.readFileSync(view).toString(), b)
            } else {
                return ejs.render(fs.readFileSync(a), b)
            }
        }

        self.logout = function () {
            if (self.__logout) {
                self.__logout.call(self,req,res,next)
            } else {
                req.logout();
                req.session.save(function () {
                    res.redirect('/' + req.params.base + '/home')
                })
            }

        }

        var result = this.definition.call(this, next)

        if (result && result.then) {
            result.then(function () {
                next()
            })
        } else
            next()


    }

    config(definition) {
        this.definition = definition;
        return this;
    }

    auth(template, callback) {
        this.protect = true
        var self = this;
        this.securityMenu = true
        this.profile = true
        if (typeof template == 'function') {
            callback = template
            template = undefined
        }

        $injector('R').on('before:middleware', function () {
            var securityManager = 'Troodon'
            if (typeof callback == 'function')
                securityManager = 'ngPortal' + self.name
            var promise = $injector('SecurityRegistry')
                .register(securityManager)
                .setLogin('/' + self.name + '([\/\w*]*)?', template ? template : 'TroodonNode:auth')
            self.securityManager = promise;
            self.securityManager.setLogout = function (callbackLogout) {
                self.__logout = callbackLogout;
            }

            if (typeof callback == 'function')
                callback.call(self, promise)
        })

        return this;
    }
}

module.exports = ngPortal;