/**
 * Angularjs Controller - Raptor.js
 * Generado automaticamente
 */

angular.module('ngPortalApp')

    .controller("config", function ($scope, $http, $mdToast) {
        $('[data-toggle="tooltip"]').tooltip();

        $scope.databases={
            'postgres':{
                name:"postgres",
                port:5432
            },
            'mysql':{
                name: "mysql",
                port: 3306
            },
            'sqlite':{
                name:"sqlite",
                port:"",
            },
            'mssql':{
                name:"mssql",
                port:1433
            },
            'mariadb':{
                name:"mariadb",
                port:3306
            }};
        
        $scope.onChange=function(){
            $scope.config.portDB=$scope.databases[$scope.config.driver].port;
            
        }
        
        $scope.submitForm = function () {
            
            $scope.config._csrf = Raptor.getCsrfToken();

            $http.post('/raptor/orm/save', $scope.config, { ignoreRequest: true })
                .then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .action('Cerrar')
                            .highlightAction(true)
                            .textContent(response.data.msg)
                            .position('top right')
                            .hideDelay(9000))
                        .then(function (response) {

                        })
                    
                }, function (response) {
                    
                    $mdToast.show(
                        $mdToast.simple()
                            .action('Cerrar')
                            .highlightAction(true)
                            .textContent(response.data.error)
                            .position('top right')
                            .hideDelay(9000))
                        .then(function (response) {

                        })

                })

        }
    });