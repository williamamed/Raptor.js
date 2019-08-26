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
}
module.exports = TroodonDataService;