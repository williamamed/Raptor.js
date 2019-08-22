
module.exports={
    up:$i.later(function(query,datatype,bio_biouser){
        return bio_biouser.sync()
    }),
    down:function(query){
        return query.dropTable('biouser')
    }
}