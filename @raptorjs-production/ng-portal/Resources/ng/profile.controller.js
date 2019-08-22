
angular.module('ngPortalApp')

        .controller("profileController", function ($scope, $http, $location,$routeParams,$templateCache,$mdToast) {
            $('[data-toggle="tooltip"]').tooltip();
            
            $scope.submitForm = function (isValid) {

                // check to make sure the form is completely valid
                if (isValid) {

                    //UIR.load.show('Configuring Raptor....')
                    $scope.user._csrf = Raptor.getCsrfToken();
                    
                    $http.post('/'+Raptor.ngPortal.route+'/profile/profiledata', $scope.user, {ignoreRequest: true})
                            .then(function (response) {
                                $mdToast.show(
                                $mdToast.simple()
                                .action('Cerrar')
                                .highlightAction(true)
                                .textContent(response.data.msg)
                                .position('top right')
                                .hideDelay(9000))
                                .then(function(response){
                                    
                                })
                                //Raptor.msg.info(response.data.msg,true,)
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
            
            $scope.submitPassForm = function (isValid) {

                // check to make sure the form is completely valid
                if (isValid) {

                    //UIR.load.show('Configuring Raptor....')
                    $scope.userpass._csrf = Raptor.getCsrfToken();
                    
                    $http.post('/'+Raptor.ngPortal.route+'/profile/changepass', $scope.userpass, {ignoreRequest: true})
                            .then(function (response) {
                                if(response.data.cod==3)
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .action('Cerrar')
                                        .highlightAction(true)
                                        .textContent('Error: '+response.data.msg)
                                        .position('top right')
                                        .hideDelay(9000))
                                        .then(function(response){
                                            
                                        })
                                else
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .action('Cerrar')
                                        .highlightAction(true)
                                        .textContent(response.data.msg)
                                        .position('top right')
                                        .hideDelay(9000))
                                        .then(function(response){
                                            
                                        })
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


