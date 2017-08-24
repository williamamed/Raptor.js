UIR.ns('Pakete.Ui.BootstrapArea')
Pakete.Ui.BootstrapArea = Backbone.View.extend({
    el: '.list-area',
    loading: false,
    page: 0,
    end: false,
    initialize: function() {
        var me = this;
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'request', function() {
            me.loading = true
            me.setLoading()
        })
        this.listenTo(this.model, 'sync', function() {
            $('.loader').hide();
            this.loading = false;
        })
        $(window).on('scroll', $.proxy(this.scrollEvent, this));
        $('.paket-search').click(function() {
            if ($('.paket-search-input').val())
                Pakete.Ui.paketeView.search(Pakete.Ui.nav.pakete, Pakete.Ui.nav.category)
            else {
                if (Pakete.Ui.nav.pakete || Pakete.Ui.nav.category)
                    Pakete.Ui.paketeView.resetView(Pakete.Ui.nav.pakete, Pakete.Ui.nav.category)
                else
                    Pakete.Ui.areaView.resetView()
            }

        })
        $('.paket-search-input').on('keyup', function(e) {

            if (e.which === 13) {
                if ($('.paket-search-input').val())
                    Pakete.Ui.paketeView.search(Pakete.Ui.nav.pakete, Pakete.Ui.nav.category)
                else {
                    if (Pakete.Ui.nav.pakete || Pakete.Ui.nav.category)
                        Pakete.Ui.paketeView.resetView(Pakete.Ui.nav.pakete, Pakete.Ui.nav.category)
                    else{
                        $('#myTab li:first a').tab('show');
                        Pakete.Ui.areaView.resetView()
                    }
                }
            }

        })
        
    },
    resetView: function() {
        if (this.page == 0)
            Pakete.model.fetch({
                url: 'verpakete/list',
                data: {
                    page: this.page,
                }
            })
    },
    render: function() {
        this.$el.append(this.model.get('list'))
        $('.loader').hide();
        this.loading = false;
        this.page++;
        if (!this.model.get('list'))
            this.end = true;
    },
    scrollEvent: function() {

        if ($(window).scrollTop() + $(window).height() == $(document).height() && !$('#paketes').is(':hidden') && this.end == false && this.loading != true) {

            Pakete.model.fetch({
                url: 'verpakete/list',
                data: {
                    page: this.page
                }
            })
        }
    },
    setLoading: function() {
        $('.loader').show();
    }
})