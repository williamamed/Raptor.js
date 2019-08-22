/**
* Main entrance
*
*/
$(function(){
	  new Panel.Router();

	  Panel.model=new Backbone.Model({
	  		extjs:false,
	  		content:''
	  });

	  new Panel.Ui.BootstrapArea({
	  	model: Panel.model
	  })

	  Backbone.history.start();
});