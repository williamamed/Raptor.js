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