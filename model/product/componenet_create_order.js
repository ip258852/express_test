let service     = require('../service/index');
let config      = require('../../config/config').mongo_config;

module.exports = async (req,order)=>{
    
    let products = order.product_id;
    let quantity = order.product_cnt;
    let products_db = new Array();    
    
    const o_col = req.db.getCol(config.db,config.collection_order);
    const p_col = req.db.getCol(config.db,config.collection_product);
     
    // 查看產品清單
    for(let ele in products ){    

        // 找產品
        let result = await p_col.find({ 
            product_id : parseInt(products[ele])
        }).toArray().catch(err=>{    
            throw {
                status   : 'createOrder_product_view',
                err_name : err.name,
                err_msg  : err.message
            } ; 
        });
        
        // 判斷訂單的產品資訊,數量不符,退回
        if(quantity[ele] <= result[0].quantity){
            products_db.push(result[0])
        }else{
            throw {
                status   : 'createOrder_product_view',
                err_name : '數量不符合',
                err_msg  : '再來一次'
            } ; 
        }
    }

    // 新增訂單資訊
    for(let ele in products ){
        
        // 訂單資料封裝    
        const order_data = {           
            member_id  : order.member,
            
            product_id : products[ele],
            product_name : products_db[ele].name,
            price      : products_db[ele].price,
            quantity   : quantity[ele],
            totalPrice : (products_db[ele].price) * quantity[ele],
            isPaid     : false ,
            create_date: service.timeFix.whatTime(),
            update_date: ''
        }

        // 插入訂單
        await o_col.insertOne(order_data).catch(err=>{
            throw {
                status   : 'createOrder_db_insertOrder',
                err_name : err.name,
                err_msg  : err.message
            } ;          
        });

        // 減少庫存
        await p_col.findOneAndUpdate({
            product_id : products[ele]
        },{ 
            $inc :  { quantity : - quantity[ele]},
            $set :  { update_date : service.timeFix.whatTime() }
        }).catch(err=>{            
            throw {
                status   : 'createOrder_db_decProducts',
                err_name : err.name,
                err_msg  : err.message
            } ;           
        });
    }
        
    return { status : '訂單新增成功' };
}

 