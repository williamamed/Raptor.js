UIR.ns('Pakete.Ui.BootstrapArea')
Pakete.Ui.Copiadores = Backbone.View.extend({
    el: '.dondecopio',
    loading: false,
    initialize: function() {
        var me = this;
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'request', function() {
            me.loading = true
            me.setLoading()
        })
        this.listenTo(this.model, 'sync', function() {
            me.$el.find('.loader').hide();
            this.loading = false;
            this.renderArea.show()
        })
        this.renderArea=this.$el.find('.dondecopio-area');
    },
    resetView: function() {
        this.renderArea.hide()
        this.model.set({
            extjs:false,
            content:''
        })
        this.model.fetch({
            url: 'verpakete/dondecopio'
        })
    },
    render: function() {
        
        this.renderArea.html(this.model.get('content'))
        this.$el.find('.loader').hide();
        this.loading = false;

    },
    setLoading: function() {
        this.$el.find('.loader').show();
    }
})