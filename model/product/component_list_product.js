let config = require('../../config/config').mongo_config;

module.exports = async (req)=>{
         
    let p_col = req.DB.getCol(config.db,config.collection_product);  

    // 取得產品
    let data = await p_col.find({}).toArray().catch(err=>{              
        throw {
            status   : 'listProducts_findList',
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