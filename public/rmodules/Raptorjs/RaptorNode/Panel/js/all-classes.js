UIR.ns('Panel.Ui.BootstrapArea')
Panel.Ui.BootstrapArea=Backbone.View.extend({
	el:'#rux-container',


	initialize:function(){
		this.listenTo(this.model,'change',this.render)

		this.$bootstrapArea=this.$el.find('#rux-window');
		this.$extjsArea=this.$el.find('#rux-window-cover');
		
		this.$extjsArea.height($(window).height()-130);
        var self=this;
        $(window).on('resize',function(){
        	self.$extjsArea.height($(window).height()-130);
        });
	},

	cleanRender:function(){
		this.$bootstrapArea.empty();
		this.$extjsArea.empty();
		this.$extjsArea.append('<iframe  id="rux-window-frame" style="width: 100%;height: 100%;border: none;" src=""></iframe>');
	},

	render:function(){

		this.cleanRender()
		
		if(this.model.get('extjs')){
			this.$bootstrapArea.hide();
			this.$extjsArea.show();
			this.$extjsArea.find('#rux-window-frame').attr('src',this.model.get('route'));
			this.$extjsArea.find('#rux-window-frame').load(function(){
				Pace.bar.finish(); 
            	Pace.stop();
			})
		}else{
			this.$extjsArea.hide();
			this.$bootstrapArea.show()
			this.$bootstrapArea.html(this.model.get('content'));
			Pace.bar.finish(); 
            Pace.stop();
		}
		
	}	
})
UIR.ns('Panel.Router')
Panel.Router=Backbone.Router.extend({

	routes:{
		'':'description',
		'description':'description',
		'config':'config',
		'generate-node':'generateNode',
		'publish-resources':'publishResources',
		'generate-model':'genModel',
		'*path':'NotFound'
	},

	description:function(){
		Pace.restart();
		Panel.model.fetch({
			url:'/raptor/description'
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
/**
* Main entrance
*
*/
$(function(){
	  new Panel.Router();

	  Panel.model=new Backbone.Model({
	  		extjs:false,
	  		content:''
	  });

	  new Panel.Ui.BootstrapArea({
	  	model: Panel.model
	  })

	  Backbone.history.start();
});