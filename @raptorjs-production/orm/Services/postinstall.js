
const path=require('path')
const fse=require('fs-extra')
var dir=require.resolve('sequelize-auto-v2');
if(fse.existsSync(path.join(path.dirname(dir),'.git'))){
    fse.removeSync(path.join(path.dirname(dir),'.git'));
    console.log('Directorio .git removido de sequelize-auto-v2')
}