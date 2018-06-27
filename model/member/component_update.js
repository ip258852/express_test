let config = require('../../config/config').mongo_config;

/**
 *  @query : 更新的會員資料,包含email,pwd,name
 */
module.exports = async (req,query) => {
    
    // 取得COL
    const member_col = req.DB.getCol(config.db,config.collection_member);
    // 尋找並更新物件
    let resolved = await member_col.findOneAndUpdate({ email : query.email },{ $set : query}).catch(err=>{
        throw {
            status : 'update_db_findOneAndUpdate',
            err_name : err.name ,
            err_msg : err.err_msg
        } ;
    })
        
    return resolved.ok <= 0 ? {
        status : 'update_db_findOneAndUpdate',
        msg    : 'update failed!' 
    } : {
        status : 'update_db_findOneAndUpdate',
        msg    : 'update successfully!'
    } ;
}