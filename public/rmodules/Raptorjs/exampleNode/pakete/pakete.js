
Pakete.Ui.PaketeArea = Backbone.View.extend({
    el: '.pakete-area',
    loading: false,
    page: 0,
    end: false,
    events: {
        "click .btn-back": function(){
            Backbone.history.history.back()
        }
    },
    initialize: function() {
        var me = this;
        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'request', function() {
            me.loading = true
            this.$el.empty()
            me.setLoading()
        })
        this.listenTo(this.model, 'sync', function() {
            $('.loader').hide();
            this.loading = false;
        })
        this.listenTo(this.model, 'error', function() {
            $('.loader').hide();
            this.loading = false;
            this.$el.append('<p class="text-muted">Lo sentimos, no se pudo completar la operación porque ocurrió un error</p>')
        })
        // $(window).on('scroll', $.proxy(this.scrollEvent,this));
    },
    search: function(pakete, category) {
        var value = $('.paket-search-input').val();
        if (value) {
            $('#myTab li:eq(1) a').tab('show');
            this.model.set({list: ""})

            this.model.fetch({
                url: 'verpakete/search',
                data: {
                    pakete: pakete,
                    category: category,
                    value: value
                }
            })
        }

    },
    resetView: function(id, type) {
        this.model.set({list: ""})
        if (type) {
            this.model.fetch({
                url: 'verpakete/listmedia',
                data: {
                    pakete: id,
                    category: type
                }
            })
        } else {
            this.model.fetch({
                url: 'verpakete/listcategory',
                data: {
                    pakete: id
                }
            })
        }

    },
    render: function() {
        if(!this.model.get('look'))
            this.$el.append('<a class="btn btn-sm btn-default btn-back"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></a>')

        this.$el.append(this.model.get('list'))

    },
    scrollEvent: function() {

        if ($(window).scrollTop() + $(window).height() == $(document).height() && !$('#pakete').is(':hidden') && this.end == false && this.loading != true) {

            Pakete.model.fetch({
                url: 'verpakete/list',
                data: {
                    page: this.page
                }
            })
        }
    },
    setLoading: function() {
        $('.loader').show()
    }
})