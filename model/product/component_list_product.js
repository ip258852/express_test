let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;

module.exports = async ()=>{
    
    // DB連接
    await db_connect.dbConnect(config.url).catch(err=>{               
        throw {
            status   : 'listProducts_db_connect',
            err_name : err.name,
            err_msg  : err.message
        } ;            
    });      
 
    let p_col = db_connect.getCol(config.db,config.collection_product);  

    // 取得產品
    let data = await p_col.find({}).toArray().catch(err=>{              
        throw {
            status   : 'listProducts_findList',
            err_name : err.name,
            err_msg  : err.message
        } ;    
    });

    // 關掉DB
    await db_connect.closeDB().catch(err=>{
        throw {
            status   : 'listProducts_db_close',
            err_name : err.name,
            err_msg  : err.message
        } ;      
    });
   
    // 回傳需要的產品資料
    return data.map((val)=>{
        return {
            product_id : val.product_id,
            name       : val.name,
            price      : val.price,
            quantity   : val.quantity,
            remark     : val.remark
        }
    });   
}