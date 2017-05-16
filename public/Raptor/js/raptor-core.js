
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
				var btn=$('<span class="raptor-msg-closebtn pull-right" data-dismiss="alert" aria-hidden="true">&times;</span>');
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
				var btn=$('<span class="raptor-msg-closebtn pull-right" data-dismiss="alert" aria-hidden="true">&times;</span>');
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