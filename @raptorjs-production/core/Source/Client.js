var lodash = require('lodash')
/**
* 
* @author William Amed
*/
module.exports = {
	/**
	*
	*
	*/
	getContent: function (body, R, response, result) {
		this.R = R;
		this.res = response;
		this.body = body;
		var content = response.req.viewPlugin.get('before_response_body').join('') + body + response.req.viewPlugin.get('after_response_body').join('');
		if (!response.req.xhr && response.req.method == 'GET' && (!response.get('Content-type') || response.get('Content-type').indexOf('text/html') != -1)) {
			var me=this;
			this.__core(content, function (core) {
				if (R.app.get('env') == 'development') {
					me.__debug(content, function (debug) {
						if (result)
							result(core + debug)
					});
				} else {
					if (result)
						result(core)
				}
			});

		} else {
			if (result)
				result(content)
		}

	},
	/**
	*
	*
	*/
	__debug: function (content, result) {
		var debug;
		this.res.render(__dirname + '/views/minifyPanel.ejs', {
		}, function (err, str) {
			if (err) debug = '';
			debug = str;
			if (result)
				result(debug)
		})
		/**this.R.waitUntil(!debug)
		return debug;*/
	},
	/**
	*
	*
	*/
	__core: function (body,result) {
		var client;

		var i18nDef = JSON.stringify(this.R.i18n.getDefinition());
		var language = this.res.req.language;
		//var viewStatic = this.R.getViewPlugin('raptor_client') ? this.R.getViewPlugin('raptor_client') : []

		this.res.render(__dirname + '/views/client.ejs', {
			i18nDef: i18nDef,
			i18n: this.R.i18nClass,
			language: language,
			csrfName: this.R.options.cookieName ? this.R.options.cookieName + 'A' : '_csrf_red',
			plugin: this.res.req.viewPlugin.get('raptor_client')
		}, function (err, str) {
			if (err) client = '';
			client = str;
			if(!client)
				client=''
			if (body.indexOf('<head>') != -1) {
				client = body.replace('<head>', '<head>' + client);
			} else {
				client = client + body;
			}
			if (result)
				result(client)
		})
		/**this.R.waitUntil(!client)

		if(body.indexOf('<head>')!=-1){
			return body.replace('<head>','<head>'+client);
		}else{
			return client+body;
		}*/

	}
}