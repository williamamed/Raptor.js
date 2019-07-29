
module.exports={
    up:$i.later(function(query,datatype,Bio_biouser){
        return Bio_biouser.sync()
    }),
    down:function(query){
        return query.dropTable('biouser')
    }
}