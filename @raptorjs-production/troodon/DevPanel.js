const path=require('path')

class DevPanel{

    constructor(){
        
    }

    /**
     * @Event("artefacts:ready",type="once")
     */
    onReady(){
        
        R.bundles['templates-gen'].manifest.technologies['Troodon'] = require(path.join(__dirname, 'Artefacts'))
    }

}
module.exports=DevPanel