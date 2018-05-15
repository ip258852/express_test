let db_connect = require('../service/db_connect');
let config = require('../../config/config');

module.exports = async (query)=>{
    let get_result = {};
    
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        get_result = {};
        get_result.status = 'getOrder_db_connect';
        get_result.err_name = err.name ;
        get_result.err_msg = err.message ;         
        throw get_result ;       
    });      
 
    let col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_order);     

    get_result.data = await col.find({member_id : query}).toArray().catch(err=>{
        get_result = {};
        get_result.status = 'getOrder_findList';
        get_result.err_name = err.name ;
        get_result.err_msg = err.message ;       
        throw get_result ; 
    });

    await db_connect.getDB().close().catch(err=>{
        get_result = {};
        get_result.status = 'getOrder_db_close';
        get_result.err_name = err.name ;
        get_result.err_msg = err.message ;
        throw get_result ; 
    });
   
    return get_result ;   
}
