'use strict';

class TroodonDataService {

    /**
     * @Inyectable
     */
    getPrivilegesTree(roles, Options, troodon_security_privilege, DynamicPrivilege) {
        
        if (Options.mode == 'development') {
            return DynamicPrivilege.getBuildMenuPromise()
        } else {
            return troodon_security_privilege
                .getTreeByRol(roles)
        }

    }

    /**
     * @Injectable
     */
    getStructureChildren(id, troodon_security_estructure){
        return new Promise(function(res,rej){
            troodon_security_estructure.getChilds(id,function(children){
                res(children);
            })
        })
    }

    /**
     * @Injectable
     */
    getRolChildren(id, troodon_security_rol){
        return new Promise(function(res,rej){
            troodon_security_rol.getChilds(id,function(children){
                res(children);
            })
        })
    }
}
module.exports = TroodonDataService;