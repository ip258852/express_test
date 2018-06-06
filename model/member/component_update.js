let db_connect = require('../service/db_connect') ;
let config = require('../../config/config').mongo_config;

module.exports = async (query) => {
    
    await db_connect.dbConnect(config.url).catch(err=>{
        throw {
            status : 'update_db_connect',
            err_name : err.name ,
            err_msg : err.err_msg
        } ;            
    });

    const member_col = db_connect.getCol(config.db,config.collection_member);
   
    let resolved = await member_col.findOneAndUpdate({ email : query.email },{ $set : query}).catch(err=>{
        throw {
            status : 'update_db_findOneAndUpdate',
            err_name : err.name ,
            err_msg : err.err_msg
        } ;
    })
    
    await db_connect.closeDB().catch(err=>{
        throw {
            status : 'update_db_close',
            err_name : err.name ,
            err_msg : err.err_msg
        } ;
    });

    return resolved.ok <= 0 ? {
        status : 'update_db_findOneAndUpdate',
        msg    : 'update failed!' 
    } : {
        status : 'update_db_findOneAndUpdate',
        msg    : 'update successfully!'
    } ;
}