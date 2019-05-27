
angular.module('ngPortalApp')

        .controller("profileRaptorController", function ($scope, $http, $location,$routeParams,$templateCache,$mdToast) {
            $('[data-toggle="tooltip"]').tooltip();
            
            
            $scope.submitPassForm = function (isValid) {

                // check to make sure the form is completely valid
                if (isValid) {

                    //UIR.load.show('Configuring Raptor....')
                    $scope.userpass._csrf = Raptor.getCsrfToken();
                    
                    $http.post('/'+Raptor.ngPortal.route+'/savecredentials', $scope.userpass, {ignoreRequest: true})
                            .then(function (response) {
                                if(response.data.code==3)
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .action('Cerrar')
                                        .highlightAction(true)
                                        .textContent('Error: '+response.data.msg)
                                        .position('top right')
                                        .hideDelay(9000))
                                        .then(function(response){
                                            
                                        })
                                else{
                                    delete $scope.userpass.current_password
                                    delete $scope.userpass.password
                                    delete $scope.userpass.repassword
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .action('Cerrar')
                                        .highlightAction(true)
                                        .textContent(response.data.msg)
                                        .position('top right')
                                        .hideDelay(9000))
                                        .then(function(response){
                                            
                                        })
                                }
                                //$location.path('/plataforma/configuracion')
                            }, function (response) {
                
                                $mdToast.show(
                                    $mdToast.simple()
                                    .action('Cerrar')
                                    .highlightAction(true)
                                    .textContent('Error: '+response.data.msg)
                                    .position('top right')
                                    .hideDelay(9000))
                                    .then(function(response){
                                        
                                    })

                            })

                }

            };
        });


