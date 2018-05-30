let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;


/**
 * 確認信箱格式是否正確
 * @email 提供要驗證的信箱
 */
exports.format  = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = re.test(email);
    return result;
} 

/**
 * 確認信箱是否存在DB
 * @email 提供要驗證的信箱 
 */
exports.multi =  async (email) => { 
    
    await db_connect.dbConnect(config.url).catch(err=>{
        throw {
            status : 'emailMultiCheck_db_connect',
            err_name : err.name,
            err_msg  : err.message 
        };     
    }); 

   
    let member_col =  db_connect.getCol(config.db,config.collection_member);
    let r = await member_col.findOne({email : email}).catch(err=>{
        throw {
            status : 'emailMultiCheck_db_search',
            err_name : err.name,
            err_msg  : err.message 
        };       
    });
    
    await db_connect.closeDB().catch(err=>{     
        throw {
            status : 'getList_db_close',
            err_name : err.name,
            err_msg  : err.message 
        }; 
    });
    
    return r ? true : false ;
        
}