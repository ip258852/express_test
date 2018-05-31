let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;

module.exports = async (query)=>{
   
    // 開DB而已
    await db_connect.dbConnect(config.url).catch(err=>{             
        throw {
            status   : 'listOrders_db_connect',
            err_name : err.name,
            err_msg  : err.message
        } ;          
    });      
 
    let col   = db_connect.getCol(config.db,config.collection_order); 

    // 查詢訂單資料
    let data  = await col.find({ member_id : query }).toArray().catch(err=>{         
        throw {
            status   : 'listOrders_db_orderView',
            err_name : err.name,
            err_msg  : err.message
        } ;   
    });

    // 關DB而已
    await db_connect.closeDB().catch(err=>{       
        throw {
            status   : 'listOrders_db_close',
            err_name : err.name,
            err_msg  : err.message
        } ;   
    });
   
    return data;   
}
