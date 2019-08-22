
app.controller("ResourceController", function ($scope, $sce, $http, $location, $routeParams, $templateCache, $mdToast, $mdDialog) {
    $scope.disableDelete = true;
    $scope.disablePublish = true;
    
    if($('.fixed-tree').jstree(true))
        $('.fixed-tree').jstree(true).destroy()
    $('.fixed-tree').jstree({
        'core': {
            "animation": 0,
            "check_callback": true,
            "themes": { "stripes": false },
            'data': function (node, callback) {

                $http.get('/raptor/component/create.v2/list')
                    .then(function (response) {

                        callback.call(node, [{
                            "text": "src",
                            "id": 1,
                            "children": response.data,
                            "type": "root",
                            "state": {
                                "selected": true
                            }
                        },{
                            "text": "bibliotecas",
                            "id": 2,
                            "children": $('.console-area').data('lib'),
                            "type": "root",
                            "state": {
                                "selected": true
                            }
                        }])
                    })



            }
        },
        "types": {
            "#": { "valid_children": ["root"] },
            "root": { "icon": Raptor.public('raptor-panel/img/component/vendor.png'), "valid_children": ["vendor", "comp"], a_attr: { style: 'color:#9e9e9e' } },
            "vendor": { "icon": Raptor.public('raptor-panel/img/component/vendor.png'), "valid_children": ["comp"], a_attr: { style: 'color:#bdbdbd' } },
            "comp": { "icon": Raptor.public('raptor-panel/img/component/cmp.png'), "valid_children": [], a_attr: { style: 'color:white' } },
            "lib": { "icon": Raptor.public('raptor-panel/img/component/cmp.png'), "valid_children": [], a_attr: { style: 'color:white' } }
        
        },
        "plugins": [

            "state", "types", "wholerow","checkbox"
        ],

    });

    $scope.generate = function (ev) {
        var confirm = $mdDialog.confirm()
            .title("¿Está seguro que desea publicar los recursos de este componente?")
            .textContent("Los recursos seran copiados hacia el directorio rmodules.")
            .ariaLabel('delete')
            .targetEvent(ev)
            .ok('Sí')
            .cancel('No');

        $mdDialog.show(confirm)
            .then(function () {
                $http.post('/raptor/component/resources.v2/generate', {
                    components: $('.fixed-tree').jstree(true).get_selected(true),
                    _csrf: Raptor.getCsrfToken()
                })
                    .then(function (response) {
                        if (response.data.code == 3)
                            R.message('Error: ' + response.data.msg)
                        else {

                            R.message(response.data.msg)

                        }
                    })
                    .catch(function(){
                        R.message("Ups, lo sentimos ocurrió un error inesperado.")
                    })
            })
    }

    $scope.delete = function (ev) {
        var confirm = $mdDialog.confirm()
            .title("¿Está seguro que desea limpiar los recursos de este componente?")
            .textContent("Los recursos seran limpiados del directorio rmodules.")
            .ariaLabel('delete')
            .targetEvent(ev)
            .ok('Sí')
            .cancel('No');

        $mdDialog.show(confirm)
            .then(function () {
                $http.post('/raptor/component/resources.v2/delete', {
                    components: $('.fixed-tree').jstree(true).get_selected(true),
                    _csrf: Raptor.getCsrfToken()
                })
                    .then(function (response) {
                        if (response.data.code == 3)
                            R.message('Error: ' + response.data.msg)
                        else {

                            R.message(response.data.msg)

                        }
                    })
                    .catch(function(){
                        R.message("Ups, lo sentimos ocurrió un error inesperado.")
                    })
            })
    }



    $('[data-toggle="tooltip"]').tooltip();
})