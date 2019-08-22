var bundle=R.bundles['extjs-designer']
module.exports={
    title:"Diseñador de interfaces para Extjs",
    image:"/public/"+bundle.vendor+"/extjs-designer/resources/img/ui.png",
    button:{
        text:"Abrir"
    },
    action:function(){
        return {
            href:"/raptor/extjs/designer"
        }
    }
}