let db_connect = require('../service/db_connect');
let config = require('../../config/config');

module.exports = async (data) =>{
    let register_result = {};
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        register_result = {};
        register_result.status = 'register_db_connect';
        register_result.err_name = err.name ;
        register_result.err_msg = err.message ;
        throw register_result ;            
    }); 
    
    let col_member = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_member);
    
    await col_member.insertOne(data).then(resolved=>{
        register_result.status = 'register_db_register';
        register_result.msg = 'register successfully' ;
    }).catch(err=>{
        register_result = {};
        register_result.status = 'register_db_register';
        register_result.err_name = err.name ;
        register_result.err_msg = err.message ;
        throw register_result ;            
    });

    await db_connect.getDB().close().catch(err=>{
        register_result = {};
        register_result.status = 'register_db_close';
        register_result.err_name = err.name ;
        register_result.err_msg = err.message ;
        throw get_result ; 
    });

    return register_result ;
}