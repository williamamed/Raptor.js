UIR.ns('Panel.Router')
Panel.Router=Backbone.Router.extend({

	routes:{
                '':function(){
                    //Panel.Ui.panelView.resetView()
                    this.navigate($('.function-home').attr('href'),{trigger: true})
                },
		'!/*path':'bootstrapOpen',
                '!f/*path':'extjsOpen',
                '!ex/*path':'externalOpen',
		'*path':'NotFound'
	},
        /**
	description:function(){
		//Pace.restart();
		Panel.model.fetch({
			url:'/raptor/description'
		})
		
	},
        */
        bootstrapOpen:function(path){
            Pace.restart();
            Panel.model.fetch({
		url: Raptor.getFront()+'/'+path
            })
        },
        extjsOpen:function(path){
            Pace.restart();
            Panel.model.set({
			extjs: true,
			route: Raptor.getFront()+'/'+path,
			content:''
		})
        },
        externalOpen:function(path){
            window.open('/'+path)
        },
	NotFound:function(){
		//Pace.restart();
		Panel.model.set({
			extjs: false,
			content:'<h1 style="font-size:50px;margin-top:50px;padding:30px;color: #372b53;margin-bottom: 200px"><span style="font-size:70px">): </span> 404 Not Found</h1>'
		})
	}
})
