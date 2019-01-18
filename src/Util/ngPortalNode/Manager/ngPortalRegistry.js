'use strict';

const ngPortal=require('./ngPortal')

class ngPortalRegistry{

	constructor(){
		this.container={}
	}
    
    get(name){
        return this.container[name];
    }
    
    set(obj){
        if(obj instanceof ngPortal)
            this.container[obj.name]=obj;
        
    }
    
}

module.exports=ngPortalRegistry;