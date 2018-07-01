let config = require('../../config/config').mongo_config;
const DB = require('../service/db_connect');
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
exports.multi =  async (req) => { 
    const email = req.body.email;
   
    let member_col =  DB.getCol(config.db,config.collection_member);
    let r = await member_col.findOne({email : email}).catch(err=>{
        throw {
            status : 'emailMultiCheck_db_search',
            err_name : err.name,
            err_msg  : err.message 
        };       
    });
    
    return r ? true : false ;        
}