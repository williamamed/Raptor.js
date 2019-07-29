'use strict'

var util = require('util')
	, fs = require('fs')
	, path = require('path')


class Controller {


	constructor(R, prefix, main, beforeTask) {
		// always initialize all instance properties

		this.prefix = '';
		this.prefixNode = (prefix) ? prefix : '';
		this.mainClass = main;
		this.app = R.app;
		this.R = R;
		this.beforeTask = beforeTask;

	}

	route(method, path) {
		var arg = [this.prefixNode + this.prefix + path, this.beforeTask];

		for (var i = 2; i < arguments.length; i++) {
			//arg.push(this.proxy(arguments[i]))
			arg.push($injector.invokeLater(arguments[i],this))
		}

		this.app[method].apply(this.app, arg)


	}

	routes(router) {


		for (var i in router) {

			if (typeof i == 'string') {
				if (typeof router[i] == 'function') {
					this.R.app.all(this.prefixNode + this.prefix + i, this.beforeTask, this.proxy(router[i]))
				}

				if (typeof router[i] == 'object') {
					var stack=[]
					if(router[i].before){
						
						for (let index = 0; index < router[i].before.length; index++) {
							if(typeof router[i].before[index]=='function'){
								stack.push(router[i].before[index])
							}
						}
					}
					stack.push(router[i].action)
					if(router[i].after){
						
						for (let index = 0; index < router[i].after.length; index++) {
							if(typeof router[i].after[index]=='function'){
								stack.push(router[i].after[index])
							}
						}
					}
					if (router[i]['method']) {
						var meta=[router[i]['method'], i]
						this.route.apply(this,meta.concat(stack))
					} else {
						var meta=['all', i]
						this.route.apply(this,meta.concat(stack))
					}
				}
			}

		}

	}

	proxy(callback, scope) {
		var me = this;

		return function (req, res, next) {

			var resp = callback.apply(me, arguments);



			if (typeof resp == 'string') {
				res.send(resp);
				return;
			}


			if (typeof resp !== 'undefined')
				res.send();
		}
	}


}

Controller.INFO = 1;
Controller.ERROR = 3;
Controller.QUESTON = 2;

module.exports = Controller;