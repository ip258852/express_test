let db_connect = require('../service/db_connect');
let config = require('../../config/config');

module.exports = async (order_list)=>{
    let order_result = {};
    let products = order_list.products.split(',');
    let quantity = order_list.quantity.split(',');
    
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        order_result = {};
        order_result.status = 'order_db_connect';
        order_result.err_name = err.name ;
        order_result.err_msg = err.message ;        
        throw order_result ;            
    });
     
    let products_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_product);
    let order_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_order);
    let product_result = new Array();

    //取得產品資料 順便判斷 數量
    for(let i = 0;i<products.length;i++){
        const f_result  = await products_col.findOne({product_id:parseInt(products[i])}).catch(err=>{
            order_result = {};
            order_result.status = 'order_db_findproduct';
            order_result.err_name = err.name ;
            order_result.err_msg = err.message ;        
            throw order_result ;            
        });

        if(f_result.quantity < parseInt(quantity[i])){
            order_result = {};
            order_result.status = 'order_db_findproduct';
            order_result.err_name = 'too fewer' ;
            order_result.err_msg = 'sorry,no enough product' ;        
            throw order_result ;      
        }
        product_result.push(f_result);
    }
    
    //插入訂單 順便處理 產品那邊的數量
    for(let i = 0;i<product_result.length;i++){
        const f_result  = product_result[i];  
        const order_data = {           
            member_id  : order_list.member_id,
            product_id : f_result.product_id,
            price      : f_result.price,
            quantity   : parseInt(quantity[i]),
            totalPrice : parseInt(quantity[i])*f_result.price,
            isPaid     : false,
            create_date: new Date(),
            update_date: new Date()
        }

        await order_col.insertOne(order_data).catch(err=>{
            order_result = {};
            order_result.status = 'order_db_insertOrder';
            order_result.err_name = err.name ;
            order_result.err_msg = err.message ;        
            throw order_result ;            
        });
        
        await products_col.findOneAndUpdate({
            product_id:parseInt(products[i])
        },{ 
            $inc :  { quantity : - parseInt(quantity[i]) },
            $set :  { update_date : new Date() }
        }).catch(err=>{
            order_result = {};
            order_result.status = 'order_db_decQuantity';
            order_result.err_name = err.name ;
            order_result.err_msg = err.message ;        
            throw order_result ;            
        });
    }    
   
    await db_connect.getDB().close().catch(err=>{
        order_result = {};
        order_result.status = 'order_db_close';
        order_result.err_name = err.name ;
        order_result.err_msg = err.message ;
        throw order_result ; 
    });

    order_result.status = 'order_add';
    order_result.msg    = 'ok, wait paying';
    return order_result ; 
}

 