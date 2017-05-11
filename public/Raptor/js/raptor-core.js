
if(!window.Raptor)
	Raptor={};
Raptor.msg={
		info: function(text,floating,position){
			if(floating){
				var msg=$('<div>');
				msg.addClass('alert alert-warning alert-dismissible raptor-msg-float fadeInDown');
				if(!position)
					msg.css({top:'0px'})
				else
					msg.css(position)
				msg.attr('role','alert');
				var btn=$('<button type="button" class="btn btn-success pull-right" data-dismiss="alert" style="border-radius:0px"><span aria-hidden="true">Cerrar</span><span class="sr-only">Close</span></button>');
				msg.append(btn)
				msg.append(text)
				msg.appendTo('body');
				setTimeout(function(){
					if(msg)
						msg.fadeOut(function(){
							msg.remove();
						})
						
				},10*1000)
			}
		},
		error: function(text,floating,position){
			if(floating){
				var msg=$('<div>');
				msg.addClass('alert alert-warning alert-dismissible raptor-msg-float raptor-msg-red fadeInDown');
				if(!position)
					msg.css({top:'0px'})
				else
					msg.css(position)
				msg.attr('role','alert');
				var btn=$('<button type="button" class="btn btn-success pull-right" data-dismiss="alert" style="border-radius:0px"><span aria-hidden="true">Cerrar</span><span class="sr-only">Close</span></button>');
				msg.append(btn)
				msg.append(text)
				msg.appendTo('body');
				setTimeout(function(){
					if(msg)
						msg.fadeOut(function(){
							msg.remove();
						})
						
				},10*1000)
			}
		}
	
}