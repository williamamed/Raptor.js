UIR.ns('Pakete.Router')
Pakete.Router = Backbone.Router.extend({
    routes: {
        '': function() {
            
            this.hidePanel()
            $('.list-paketes').show();
            $('.busqueda').show()
            $('#myTab li:first a').tab('show');
            Pakete.Ui.areaView.resetView()
            Pakete.Ui.nav = {}
        },
        '!/list/:pakete': 'list',
        '!/profile': 'profile',
        '!/dondecopio': 'dondeCopio',
        '!/media/:pakete/:category': 'media',
        '*path': 'NotFound'
    },
    hidePanel:function(){
        $('.busqueda').hide()
        $('.list-paketes').hide();
        $('.profile').hide();
        $('.dondecopio').hide();
    },
    dondeCopio:function(){
        this.hidePanel()
        $('.dondecopio').show();

        Pakete.Ui.CopiadoresView.resetView();
    },
    profile: function() {
        this.hidePanel()
        $('.profile').show();

        Pakete.Ui.profileView.resetView();
    },
    list: function(pakete) {
        this.hidePanel()
        $('.list-paketes').show();
        $('.busqueda').show()
        $('#myTab li:eq(1) a').tab('show');
        Pakete.Ui.paketeView.resetView(pakete);
        Pakete.Ui.nav = {
            pakete: pakete
        }
    },
    media: function(pakete, category) {
        this.hidePanel()
        $('.list-paketes').show();
        $('.busqueda').show()
        $('#myTab li:eq(1) a').tab('show')
        Pakete.Ui.paketeView.resetView(pakete, category)
        Pakete.Ui.nav = {
            pakete: pakete,
            category: category
        }
    },
    searchCat: function(pakete, category) {
        Pakete.Ui.paketeView.search(pakete, category)
    },
    searchPak: function(pakete) {
        Pakete.Ui.paketeView.search(pakete)
    },
    search: function() {
        Pakete.Ui.paketeView.search()
    },
    NotFound: function() {
        //Pace.restart();

    }
})
