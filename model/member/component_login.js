let config = require('../../config/config').mongo_config;

/**
 *  @query : 查詢的登入資料,包含email,pwd
 */
module.exports = async(req,query) => {
    
    //取得col
    let member_col = req.DB.getCol(config.db,config.collection_member);
     
    //取得用戶資料
    let data = await member_col.findOne({ email : query.email }).catch(err=>{
        throw {
            status : 'login_db_research',
            err_name : err.name,
            err_msg : err.message
        } ;
    });
    
    /*
     * 判斷密碼正確?
     * 回傳格式 { res : boolean , msg ?: string }
    */
    if(data){
        return data.pwd === query.pwd ? { res : true } : { res : false , msg : 'pwd 錯誤'}
    }else{
        return {
            res : false , 
            msg : '帳號錯誤'
        }
    }
}