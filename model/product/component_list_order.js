let config = require('../../config/config').mongo_config;

module.exports = async (req,query)=>{         
 
    let col   = req.DB.getCol(config.db,config.collection_order); 
     
    // 查詢訂單資料
    let data  = await col.find({ 
        member_id : query.email,
        isPaid    : query.status ? true : false 
    }).toArray().catch(err=>{         
        throw {
            status   : 'listOrders_db_orderView',
            err_name : err.name,
            err_msg  : err.message
        } ;   
    });
    
    // 回傳所需的資料
    return data.map((val)=>{
        
        return {
            order_id    : val._id,
            totalPrice  : val.totalPrice,
            isPaid      : val.isPaid,
            product_id  : val.product_id,
            quantity    : val.quantity,
            create_date : val.create_date,
            price       : val.price ,
            name        : val.product_name
        }
    });   
}
