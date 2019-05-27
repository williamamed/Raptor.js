
module.exports={

	control:function(comp) {
	    
	            
	    if(window.Ext){
	            
	            var actions = Raptor.dataTroodon.actions;
	            var root = Raptor.dataTroodon.root;
	            if (actions != false) {
	                var actionsSize = actions.length;
	                var selector = new Array();
	                for (var i = 0; i < actionsSize; i++) {
	                    selector.push('[privilegeName=' + actions[i].route + '] ');
	                    if(actions[i].route.replace(root,'')!=actions[i].route)
	                    	selector.push('[privilegeName=' + actions[i].route.replace(root,'').substring(1) + '] ');
	                }
	                var sel=selector.join(',');
	                var all;
	                if(comp)
	                    all=comp.down('[?privilegeName]');
	                else
	                    all = Ext.ComponentQuery.query('[?privilegeName]');
	                Ext.each(all, function(name, index, countriesItSelf) {
	                    name.hide();
	                });
	                
	                var compo;
	                if(comp)
	                    compo = comp.down(sel);
	                else
	                    compo = Ext.ComponentQuery.query(sel);
	                Ext.each(compo, function(name, index, countriesItSelf) {
	                    name.show();
	                });
	            }
	    }
	    if(window.jQuery){
	            
	            var actions = Raptor.dataTroodon.actions;
	            var root = Raptor.dataTroodon.root;
	            if (actions != false) {
	                var actionsSize = actions.length;
	                var sel=selector.join(',');
	                $("[privilegeName]").hide();
	                
	                var selector = new Array();
	                for (var i = 0; i < actionsSize; i++) {
	                    selector.push("[privilegeName='" + actions[i].route + "'] ");
	                    if(actions[i].route.replace(root,'')!=actions[i].route)
	                    	selector.push("[privilegeName='" + actions[i].route.replace(root,'').substring(1) + "'] ");
	                }
	                var sel=selector.join(',');
	                
	                $(sel).show();
	            }
	    }
	}
}