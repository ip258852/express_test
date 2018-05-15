let db_connect = require('../service/db_connect') ;
let config = require('../../config/config');

module.exports = async (query) => {
    let update_result = { };
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        update_result = { };
        update_result.status = 'update_db_connect';
        update_result.err_name = err.name ;
        update_result.err_msg = err.message ;
        throw update_result ;            
    });

    const member_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_member)
   
    await member_col.findOneAndUpdate({ _id : query._id },{ $set : query}).then(resolved=>{
        if(resolved.ok <= 0){
            update_result.status = 'update_db_findOneAndUpdate';
            update_result.msg = 'update failed!' ;            
        }else{
            update_result.status = 'update_db_findOneAndUpdate';
            update_result.msg = 'update successfully' ;  
            update_result.cnt =  resolved.ok ; 
        }
    }).catch(err=>{
        update_result = {} ;
        update_result.status = 'update_db_findOneAndUpdate';
        update_result.err_name = err.name ;
        update_result.err_msg = err.message ;
        throw update_result ; 
    })
    
    await db_connect.getDB().close().catch(err=>{
        update_result = { };
        update_result.status = 'update_db_close';
        update_result.err_name = err.name ;
        update_result.err_msg = err.message ;
        throw update_result ; 
    });

    return update_result ;
}