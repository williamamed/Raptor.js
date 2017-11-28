UIR.ns('Panel.Router')
Panel.Router=Backbone.Router.extend({

	routes:{
		'':'description',
		'description':'description',
		'config':'config',
		'generate-node':'generateNode',
		'publish-resources':'publishResources',
		'generate-model':'genModel',
		'*path':'rutas'
	},

	description:function(){
		Pace.restart();
		Panel.model.fetch({
			url:'/raptor/description'
		})
		
	},

	rutas:function(p){
		Pace.restart();
		Panel.model.fetch({
			url:p
		})
		
	},

	config:function(){
		Pace.restart();
		Panel.model.fetch({
			url:'/raptor/config'
		})
	},

	generateNode:function(){
		Pace.restart();
		Panel.model.set({
			extjs: true,
			route:'/raptor/component/generatenode',
			content:''
		})
	},

	publishResources:function(){
		Pace.restart();
		Panel.model.set({
			extjs: true,
			route:'/raptor/component/publish',
			content:''
		})
	},

	genModel:function(){
		Pace.restart();
		Panel.model.set({
			extjs: true,
			route:'/raptor/component/model',
			content:''
		})
	},

	NotFound:function(){
		Pace.restart();
		Panel.model.set({
			extjs: false,
			content:'<h1 style="font-size:50px;margin-top:50px;padding:30px;color: #372b53;margin-bottom: 200px"><span style="font-size:70px">): </span> 404 Not Found</h1>'
		})
	}
})
