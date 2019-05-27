
app.controller("CreateController", function ($scope, $sce, $http, $location, $routeParams, $templateCache, $mdToast, $mdDialog) {
    $scope.disableDelete = true;
    $scope.disableCtrl = true;
    $scope.disableExport = true;
    $scope.disableAdd = true;
    
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
            "root": { "icon": "/public/rmodules/Raptorjs/RaptorNode/img/component/vendor.png", "valid_children": ["vendor", "comp"], a_attr: { style: 'color:#9e9e9e' } },
            "vendor": { "icon": "/public/rmodules/Raptorjs/RaptorNode/img/component/vendor.png", "valid_children": ["comp"], a_attr: { style: 'color:#bdbdbd' } },
            "comp": { "icon": "/public/rmodules/Raptorjs/RaptorNode/img/component/cmp.png", "valid_children": [], a_attr: { style: 'color:white' } }
        },
        "plugins": [

            "state", "types", "wholerow"
        ],

    });

    $('.fixed-tree').on('select_node.jstree', function (e, data) {
        $scope.cmp = {}
        if (data.node.type == 'root') {
            $scope.disableDelete = true;
            $scope.disableCtrl = true;
            $scope.disableExport = true;
            $scope.disableAdd = false;

        }
        if (data.node.type == 'vendor') {
            $scope.disableDelete = true;
            $scope.disableCtrl = true;
            $scope.disableExport = true;
            $scope.disableAdd = false;

            $scope.cmp.vendor = data.node.text
        }
        if (data.node.type == 'comp') {
            $scope.disableDelete = false;
            $scope.disableCtrl = false;
            $scope.disableExport = false;
            $scope.disableAdd = true;

            $scope.cmp.vendor = {}
        }
        $scope.$apply()
    })

    $scope.create = function (ev) {
        $mdDialog.show({
            contentElement: '#create-dialog',

            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })

    }

    $scope.createController = function (ev) {
        $mdDialog.show({
            contentElement: '#controller-dialog',

            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })

    }

    $scope.delete = function (ev) {
        var confirm = $mdDialog.confirm()
            .title("¿Está seguro que desea eliminar este componente?")
            .textContent("El componente será eliminado completamente y no se podrá recuperar.")
            .ariaLabel('delete')
            .targetEvent(ev)
            .ok('Sí')
            .cancel('No');

        $mdDialog.show(confirm)
            .then(function () {
                $http.post('/raptor/component/create.v2/delete', {
                    nodecomponent: $('.fixed-tree').jstree(true).get_selected(true)[0].text,
                    _csrf: Raptor.getCsrfToken()
                })
                    .then(function (response) {
                        if (response.data.code == 3)
                            R.message('Error: ' + response.data.msg)
                        else {

                            R.message(response.data.msg)
                            var tree = $('.fixed-tree').jstree(true);
                            tree.refresh()
                            $scope.disableDelete = true;
                            $scope.disableCtrl = true;
                            $scope.disableExport = true;
                            $scope.disableAdd = true;

                        }
                    })
                    .catch(function(){
                        R.message("Ups, lo sentimos ocurrió un error inesperado.")
                    })
            })
    }


    $scope.cancel = function () {
        $scope.cmp = {}
        $scope.controller = {}
        $mdDialog.hide();
    };

    $scope.success = function () {
        var nodename = $scope.cmp.component
        $http.post('/raptor/component/create.v2/create', {
            vendor: $scope.cmp.vendor,
            bundle: $scope.cmp.component,
            _csrf: Raptor.getCsrfToken()
        })
            .then(function (response) {
                if (response.data.code == 3)
                    R.message('Error: ' + response.data.msg)
                else {

                    R.message(response.data.msg)
                    if (response.data.params.routine) {
                        $scope.consolemsg = $sce.trustAsHtml(response.data.params.routine.join('<br>'))
                    }

                }
                var tree = $('.fixed-tree').jstree(true);
                tree.refresh()
                /**
                tree.create_node(tree.get_selected(true)[0], {
                  text: nodename + "Node",
                  type: "comp"
                })*/

            })
            .catch(function(){
                R.message("Ups, lo sentimos ocurrió un error inesperado.")
            })
        $mdDialog.cancel();
        $scope.cmp = {}
    };

    $scope.successController = function () {

        var tree = $('.fixed-tree').jstree(true);
        $http.post('/raptor/component/create.v2/controller', {
            controllername: $scope.controller.name,
            component: tree.get_selected(true)[0].text,
            _csrf: Raptor.getCsrfToken()
        })
            .then(function (response) {
                if (response.data.code == 3)
                    R.message('Error: ' + response.data.msg)
                else {
                    R.message(response.data.msg)

                }


                /**
                tree.create_node(tree.get_selected(true)[0], {
                  text: nodename + "Node",
                  type: "comp"
                })*/

            })
            .catch(function(){
                R.message("Ups, lo sentimos ocurrió un error inesperado.")
            })
        $mdDialog.cancel();
        $scope.controller = {}
    };


    $('[data-toggle="tooltip"]').tooltip();
})