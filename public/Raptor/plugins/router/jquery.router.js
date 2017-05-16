
(function($){
    var hashchange=("onhashchange" in window);

    $.router={
        _routes:{},
        _currentUrl: location.href,
        add:function(route,callback){
            this._routes[route]={
                callback: callback
            }
        },
        register:function(name,route,data){
            this._routes[name]={
                route: route,
                data: data
            }
        },
        _checkRoutes:function(){
            if(location.hash.indexOf("#") === 0){
                var routeDef=location.hash.replace('#','');
                if(this._routes[routeDef]){
                    this._routes[routeDef].callback(routeDef);
                }
            }
        }
    }

    if(hashchange){
        $(window).on('hashchange',function(){
            $.router._checkRoutes()
        })
    }else{
        setInterval(
                function()
                {
                    if (location.href != $.router._currentUrl)
                    {
                        $.router._checkRoutes();
                        $.router._currentUrl = location.href;
                    }
                }, 500
            );
    }

})(jQuery)