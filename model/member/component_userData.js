let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;

/**
 *  @query : 查詢的登入資料,包含email,pwd
*/


module.exports = async(query) => {
    
    //連線
    await db_connect.dbConnect(config.url).catch(err=>{
        throw {
            status : 'userData_db_connect',
            err_name : err.name,
            err_msg : err.message
        } ;            
    }); 
    //取得col
    let member_col = db_connect.getCol(config.db,config.collection_member);
    let order_col  = db_connect.getCol(config.db,config.collection_order);
    //取得用戶資料
    let data = await member_col.findOne({ email : query }).catch(err=>{
        throw {
            status : 'userData_db_research',
            err_name : err.name,
            err_msg : err.message
        } ;
    });
    let order = await order_col.find({ member_id : query }).toArray().catch(err=>{
        throw {
            status : 'userData_db_findorder',
            err_name : err.name,
            err_msg : err.message
        } ;
    });
    
    //db關閉
    await db_connect.closeDB().catch(err=>{      
        throw {
            status : 'userData_db_close',
            err_name : err.name,
            err_msg : err.message
        } ; 
    });
   
    return order.length>0 ? {
        email : data.email,
        name  : data.name,
        create_date : data.create_date,
        order  : order.length
    } : {
        email : data.email,
        name  : data.name,
        create_date : data.create_date,         
    };
}