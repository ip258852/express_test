let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;

/**
 *  @req : 就是那個REQ
*/

module.exports = async(req) => {
     
    //取得col
    let member_col = req.DB.getCol(config.db,config.collection_member);
    let order_col  = req.DB.getCol(config.db,config.collection_order);
    //取得用戶資料
    let data = await member_col.findOne({ email : req.session.email }).catch(err=>{
        throw {
            status : 'userData_db_research',
            err_name : err.name,
            err_msg : err.message
        } ;
    });
    //取得用戶訂單資料
    let order = await order_col.find({ member_id : req.session.email }).toArray().catch(err=>{
        throw {
            status : 'userData_db_findorder',
            err_name : err.name,
            err_msg : err.message
        } ;
    });        
   
    return order.length > 0 ? {
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