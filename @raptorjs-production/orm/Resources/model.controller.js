
app.controller("ModelController", function ($scope, $sce, $http, $location, $routeParams, $templateCache, $mdToast, $mdDialog) {
    $scope.disableGen = true;

    $scope.underscored = true;

    if ($('.fixed-tree').jstree(true))
        $('.fixed-tree').jstree(true).destroy()

    $('.fixed-tree').jstree({
        'core': {
            "animation": 0,
            "check_callback": true,
            "themes": { "stripes": false },
            'data': function (node, callback) {

                $http.get('/raptor/component/create.v2/list')
                    .then(function (response) {

                        callback.call(node, {
                            "text": "src",
                            "id": 1,
                            "children": response.data,
                            "type": "root",
                            "state": {
                                "selected": true
                            }
                        })
                    })



            }
        },
        "types": {
            "#": { "valid_children": ["root"] },
            "root": { "icon": Raptor.public('raptor-panel/img/component/vendor.png'), "valid_children": ["vendor", "comp"], a_attr: { style: 'color:#9e9e9e' } },
            "vendor": { "icon": Raptor.public('raptor-panel/img/component/vendor.png'), "valid_children": ["comp"], a_attr: { style: 'color:#bdbdbd' } },
            "comp": { "icon": Raptor.public('raptor-panel/img/component/cmp.png'), "valid_children": [], a_attr: { style: 'color:white' } }
        },
        "plugins": [

            "state", "types", "wholerow"
        ],

    });

    $('.fixed-tree').on('select_node.jstree', function (e, data) {
        $scope.cmp = {}
        if (data.node.type == 'root') {
            $scope.disableGen = true;

        }
        if (data.node.type == 'vendor') {
            $scope.disableGen = true;

            $scope.cmp.vendor = data.node.text
        }
        if (data.node.type == 'comp') {
            $scope.disableGen = false;

            $scope.cmp.vendor = {}
        }
        $scope.$apply()
    })


    $scope.cancel = function () {
        $scope.cmp = {}
        $scope.controller = {}
        $mdDialog.hide();
    };

    $scope.generate = function (ev) {

        var confirm = $mdDialog.confirm()
            .title("¿Está seguro que desea mapear los esquemas seleccionados?")
            .textContent("Los esquemas será ubicados en el componente seleccionado")
            .ariaLabel('generate')
            .targetEvent(ev)
            .ok('Sí')
            .cancel('No');

        $mdDialog.show(confirm)
            .then(function () {
                var items = [];
                $scope.table.$('input[type="checkbox"]').each(function () {
                    if (this.checked)
                        items.push($scope.table.row($(this).parents('tr')).data().name)
                })

                if (items.length > 0) {
                    $http.post('/raptor/component/model.v2/generate', {
                        nodecomponent: $('.fixed-tree').jstree(true).get_selected(true)[0].original.namespace,
                        tables: items,
                        timestamps: $scope.timestamps,
                        underscored: $scope.underscored,
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
                } else {
                    R.message("Debes seleccionar al menos un esquema")
                }
            })
    }

    $('[data-toggle="tooltip"]').tooltip();
})

    .controller("tableController", function ($rootScope, $scope, $http, $timeout, $compile) {

        setTimeout(function () {
            $rootScope.table = $('.table').DataTable({
                "processing": true,
                "serverSide": true,
                "scrollY": "300px",
                scrollCollapse: true,
                paging: false,
                "ajax": {
                    "url": "/raptor/component/model.v2/list",
                    "complete": function () {
                        //self.editable()     
                    }
                },
                "columnDefs": [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,

                    'className': 'first-column',
                    'render': function (data, type, full, meta) {
                        return '<span class="custom-checkbox"><input type="checkbox" id="checkbox' + data + '" name="options[]" value="' + data + '"><label for="checkbox' + data + '"></label></span>';
                    }
                }
                ],
                "columns": [
                    {
                        "data": "name",
                        title: ""
                    },

                    {
                        "data": "name",
                        title: "Nombre"
                    },
                    {
                        "data": "name",
                        title: "Acciones",
                        createdCell: function (td, value, data) {

                            $(td).html(
                                '<a style="padding:10px" ng-click="edit($event)" class="edit"><i data-toggle="tooltip" title="Editar" class="fas fa-pencil-alt"></i></a>' +
                                '<a style="padding:10px" ng-click="delete($event)" class="delete"><i data-toggle="tooltip" title="Eliminar" class="fas fa-trash"></i></a> ' +
                                '<a style="padding:10px" ng-click="devices($event)" class="devices"><i data-toggle="tooltip" title="Vehiculos de la ruta" class="fas fa-bus"></i></a> '
                            )
                            $compile($(td))($scope);

                        }
                    }
                ],
                "deferLoading": 0

            });
            //this.editable()
            $rootScope.table.ajax.reload(function () { }, false)
        }, 1000)


    })