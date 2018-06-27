let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;

/**
 * @data 註冊的物件資料,email/pwd/name
 */

module.exports = async (req,data) =>{
    
    let col_member = req.DB.getCol(config.db,config.collection_member);
    
    await col_member.insertOne(data).catch(err=>{
        throw {
            status : 'register_db_register',
            err_name : err.name ,
            err_msg  : err.message
        };            
    });

    return {
        status : 'register_db_register',
        msg : 'register successfully'
    } ;
}