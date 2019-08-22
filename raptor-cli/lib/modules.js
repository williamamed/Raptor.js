const fs=require('fs')
const path=require('path')

module.exports={
    getComponents:function (location) {
        var components = []
        var vendors = fs.readdirSync(location)
    
        for (let i = 0; i < vendors.length; i++) {
            let vendor = vendors[i]
            if (fs.statSync(path.join(location, vendor)).isDirectory()) {
                let modules = fs.readdirSync(path.join(location, vendor))
                    .filter(function (fileNode) {
                        var sub = fileNode.substring(fileNode.length - 4);
    
                        return (fileNode.indexOf('.') !== 0) && (fileNode !== 'index.js')
                    })
                for (let j = 0; j < modules.length; j++) {
    
                    components.push({
                        name: modules[j],
                        vendor: vendor,
                        path: path.join(location, vendor, modules[j])
                    })
    
                }
            }
        }
        return components
    }
}