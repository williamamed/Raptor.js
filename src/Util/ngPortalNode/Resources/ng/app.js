
var app = angular.module('ngPortalApp', ['ngRoute', 'ngMaterial']);
app.config(function($routeProvider, $locationProvider, $httpProvider,$controllerProvider,$mdThemingProvider) {
    app.controller = function (name, controller) {
        $controllerProvider.register(name, controller);
		return app;
    };
    
    
    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'request': function(config) {

                config.headers['X-Requested-With'] = 'XMLHttpRequest'
                //UIR.load.show('Espere....')
                $('.portal-loading').show()
                return config;
            },
            'responseError': function(rejection) {
                $('.portal-loading').fadeOut()
                //UIR.load.hide()
                if (!rejection.config.ignoreRequest && rejection.status == 404)
                    $location.path('/404')
                if (!rejection.config.ignoreRequest && rejection.status == 401) {
                    //UIR.load.show('Autenticación detectada, redireccionando....')
                    $('.portal-loading p').html('Autenticación detectada, redireccionando....')
                    $('.portal-loading').show()
                    window.location.href = '/'+Raptor.ngPortal.route+'/home'
                    return;
                }

                return $q.reject(rejection);
            },
            'response': function(response) {
                // same as above
                //UIR.load.hide()
                $('.portal-loading').fadeOut()
                
                return response;
            }
        };
    });

    $routeProvider
            .when('/',{redirectTo: '/e/'+Raptor.ngPortal.route+'/home/description'})
            .when("/e/:path*", {
                templateUrl: function(params) {
                    return "/" + params.path+ "?t=" + Date.now()
                },
                controller: "EmbededController"
            })
            .when("/f/:path*", {
                template:  '<div style="width: 100%;height:{{size}}px">'+
                                '<iframe class="frame-ngPortal" style="width: 100%;height: 100%;border: none;"></iframe>'+
                           '</div>',
                controller: "FrameController"
            })
            .when('/404', {
                template: "<h1 class='text-center' style='font-size: 110px;margin-top: 40px'>404</h1><p class='text-center'>La página solicitada no existe.</p>"
            })
            .otherwise({redirectTo: '/404'});


});

app.controller('FrameController', function($scope, $mdSidenav, $routeParams) {
    $('.frame-ngPortal').load(function(){
        //UIR.load.hide()
        $('.portal-loading').fadeOut()
    })
    //UIR.load.show("Cargando...")
    $('.portal-loading').show()
    $('.frame-ngPortal').attr('src',"/"+$routeParams.path)
    $scope.size=$('body').height()-40
});

app.controller('EmbededController', function($scope, $mdSidenav) {


});

app.controller('MyController', function($scope, $mdSidenav) {
    $('.nav-sidebar a.nav-link').each(function(){
        if($(this).hasClass('ngPortal-embedded')){
            if($(this).attr("route"))
                $(this).attr("href",'#!/e'+$(this).attr("route"))
        }else{
            if($(this).attr("route"))
                $(this).attr("href",'#!/f'+$(this).attr("route"))
        }
    })
    //$('.portal-loading').fadeOut()
});



