let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;

/**
 * @data 註冊的物件資料,email/pwd/name
 */



module.exports = async (data) =>{

    await db_connect.dbConnect(config.url).catch(err=>{
        throw {
            status : 'register_db_connect',
            err_name : err.name ,
            err_msg  : err.message
        };            
    }); 
    
    let col_member = db_connect.getCol(config.db,config.collection_member);
    
    await col_member.insertOne(data).catch(err=>{
        throw {
            status : 'register_db_register',
            err_name : err.name ,
            err_msg  : err.message
        };            
    });

    await db_connect.closeDB().catch(err=>{
        throw  {
            status : 'register_db_close',
            err_name : err.name ,
            err_msg  : err.message
        };
    });

    return {
        status : 'register_db_register',
        msg : 'register successfully'
    } ;
}