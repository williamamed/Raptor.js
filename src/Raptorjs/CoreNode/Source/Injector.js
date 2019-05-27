
const injector=function () {
    if (arguments.length == 2) {

        R.container[arguments[0]] = arguments[1]
        R.emit('ioc:' + arguments[0] + '.ready', R.container[arguments[0]])
        return;
    }
    if (arguments.length == 1) {
        if (R.container[arguments[0]])
            return R.container[arguments[0]];
    }
    return R.container;
}

injector.import = function () {
			
    var arr=[]
    for (let index = 0; index < arguments.length; index++) {
        arr.push(arguments[index])
    }
    var dep=injector.getDependencies(arr)
    var obj={}
    
    for (let index = 0; index < arr.length; index++) {
        obj[arr[index]] = dep[index];
        Object.defineProperty(obj, arr[index], {
            get:function(){
                
                return injector(arr[index])
            }
        });
    }
    return obj;
}

injector.getDependencies = function (arr, original) {
    var index=0
    return arr.map(function (value) {
        index++
        
        if (value == 'Args')
            return original;
        if(R.container[value.trim()])
            return R.container[value.trim()];
        else{
            if(original && index-1<original.length)
                return original[index-1]
        }
    })
}

injector.invokeLater = function (fn, scope) {

    return function () {

        return injector.process(fn, scope ? scope : fn, arguments)
    }
}

injector.getRequested = function (target) {
    var FN_ARGS = /^\s*[^\(]*\(\s*([^\)]*)\)\{*/m;
    var text = target.toString()
    //console.log(text.match(FN_ARGS)[1],target.name)
    var args = text.match(FN_ARGS)[1].split(",");
    return args;
}

injector.process = function (target, scope, original) {
    var FN_ARGS = /^\s*[^\(]*\(\s*([^\)]*)\)\{*/m;
    var text = target.toString()
    //console.log(text.match(FN_ARGS)[1],target.name)
    var args = text.match(FN_ARGS)[1].split(",");

    return target.apply(scope ? scope : target, injector.getDependencies(args, original))
}

injector.invoke = injector.process;



module.exports=injector