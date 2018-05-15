let db_connect = require('../service/db_connect');
let config = require('../../config/config');

module.exports = async(data)=>{
    let update_result ={};
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{          
        throw {
            status : 'updateOrder_db_connect',
            err_name : err.name,
            err_msg  : err.message 
        };            
    });

    let member = await check_member(data.token_msg.data).catch(err=>{
        if(err.status) throw err;        
        throw {
            status : 'updateOrder_db_findMember',
            err_name : err.name,
            err_msg  : err.message 
        }; 
    });
     
    if(!member){
        throw {
            status : 'updateOrder_db_findMember',
            err_name : 'NoThisMember',
            err_msg  :'plz check your token!!!!' 
        }; 
    }

    await check_order(data).catch(err=>{
        if(err.status) throw err;       
        throw {
            status : 'updateOrder_db_findOrder',
            err_name : err.name,
            err_msg  : err.message 
        };   
    });

    await db_connect.getDB().close().catch(err=>{
        throw {
            status : 'updateOrder_db_close',
            err_name : err.name,
            err_msg  : err.message 
        };   
    });
     
    update_result.status = 'update_order';
    update_result.msg  = 'completely';
    return update_result ;
}

let check_member = async (id)=>{
    let m_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_member);
    
    return  await m_col.findOne({_id : id}).catch(err=>{
        throw {
            status : 'updateOrder_db_findMember',
            err_name : err.name,
            err_msg  : err.message 
        };       
    });
}

let check_order = async (data) =>{
    
    /* 確認是增加還是減少 -->>>> 由data的quantity判斷 >0 | <0
      增加 : 減少庫存的數量->增加訂單的數量->修改總金額
      減少 : 減少訂單的數量->增加庫存的數量->修改總金額 
      整合上述為兩個function實作,
      實作首步,確定減少量足不足夠,
      足夠後,邏輯操作下來
    */

    if(data.quantity>0) { 
        return await add_quantity(data).catch(err=>{
            throw err;
        });
    }
    else { 
        return await reduce_quantity(data).catch(err=>{
            throw err ;
        }); 
    }

}

let reduce_quantity = async(data)=>{
    let p_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_product);
    let o_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_order);

    let order_result = await o_col.findOne({ 
        _id : data.order_id ,
        isPaid : { $eq : false } ,
        quantity : { $gte : -data.quantity }
    }).catch(err=>{        
        throw {
            status : 'updateOrder_db_findOrderInConditions',
            err_name : err.name,
            err_msg  : err.message 
        };  
    });

    if(!order_result){
        throw {
            status : 'updateOrder_db_findOrderInConditions',
            err_name : 'less order_quantity',
            err_msg  : 'plz check ur order quantity' 
        }; 
    }

    let product_result = await p_col.findOneAndUpdate({
        product_id : data.product_id 
    },{
            $inc : { 
                quantity : - data.quantity            
            }
        }
    ).catch(err=>{        
        throw {
            status : 'updateOrder_db_findAndUpdateProduct',
            err_name : err.name,
            err_msg  : err.message 
        };  
    });
         
    
    return await o_col.findOneAndUpdate({
        _id : data.order_id,
        isPaid : { $eq : false }
    },{ 
        $inc : { 
            quantity :  data.quantity ,
            totalPrice :  data.quantity * product_result.value.price
        },
        $set : { update_date : new Date()  }
    }).catch(err=>{         
        throw {
            status : 'updateOrder_db_findOrder',
            err_name : err.name,
            err_msg  : err.message 
        } ; 
    });

}

let add_quantity = async(data)=>{
    let p_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_product);
    let o_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_order);

    let product_result = await p_col.findOneAndUpdate({
        product_id : data.product_id ,
        quantity : { $gte : data.quantity }
    },{
        $inc : { 
            quantity : - data.quantity            
        }
    }).catch(err=>{        
        throw {
            status : 'updateOrder_db_findAndUpdateProduct',
            err_name : err.name,
            err_msg  : err.message 
        };  
    });
    
    if(!product_result.value){
        throw {
            status : 'updateOrder_db_findAndUpdateProduct',
            err_name : 'less product_quantity',
            err_msg  : 'plz imform boss adding quantity' 
        }; 
    }      
     
    return await o_col.findOneAndUpdate({
        _id : data.order_id,
        isPaid : { $eq : false }
    },{ 
        $inc : { 
            quantity :  data.quantity ,
            totalPrice :  data.quantity * product_result.value.price
        },
        $set : { update_date : new Date()  }
    }).catch(err=>{         
        throw {
            status : 'updateOrder_db_findOrder',
            err_name : err.name,
            err_msg  : err.message 
        } ; 
    });
}