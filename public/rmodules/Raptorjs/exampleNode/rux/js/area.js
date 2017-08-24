UIR.ns('Panel.Ui.BootstrapArea')
Panel.Ui.BootstrapArea = Backbone.View.extend({
    el: '#rux-container',
    initialize: function() {
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'error', function(){
            Panel.model.set({
			extjs: false,
			content:'<h1 style="font-size:50px;margin-top:50px;padding:30px;color: #372b53;margin-bottom: 200px"><span style="font-size:70px">): </span> An error ocurred</h1>'
		})
        })

        this.$bootstrapArea = this.$el.find('#rux-window');
        this.$extjsArea = this.$el.find('#rux-window-cover');

        this.$extjsArea.height($(window).height() - 130);
        var self = this;
        $(window).on('resize', function() {
            self.$extjsArea.height($(window).height() - 130);
        });
        $('.rux-functions').each(function(){
            if($(this).hasClass('bootstrap-ui'))
                $(this).attr('href','#!'+$(this).attr('route'))
            else
                $(this).attr('href','#!f'+$(this).attr('route'))
        })
        var sel=$('.off-child .nav-sidebar li a:visible');
        if(sel.size()==0){
            $('.off-child').hide()
        }
    },
    cleanRender: function() {
        this.$bootstrapArea.empty();
        this.$extjsArea.empty();
        this.$extjsArea.append('<iframe  id="rux-window-frame" style="width: 100%;height: 100%;border: none;" src=""></iframe>');
    },
    resetView:function(){
        Panel.model.set({
			extjs: false,
			content:''
		})
        this.cleanRender()
        this.$bootstrapArea.hide();
        this.$extjsArea.hide();
    },
    render: function() {

        this.cleanRender()

        if (this.model.get('extjs')) {
            this.$bootstrapArea.hide();
            this.$extjsArea.show();
            this.$extjsArea.find('#rux-window-frame').attr('src', this.model.get('route'));
            this.$extjsArea.find('#rux-window-frame').load(function() {
                Pace.bar.finish();
                Pace.stop();
            })
        } else {
            this.$extjsArea.hide();
            this.$bootstrapArea.show()
            this.$bootstrapArea.html(this.model.get('content'));
            Pace.bar.finish();
            Pace.stop();
        }

    }
})