let db_connect = require('../service/db_connect');
let config = require('../../config/config');
let mongoID = require('mongodb').ObjectID;

module.exports = async (data)=>{
    let delete_result = {} ;
    let order_list = data.order_id.split(',').map((val)=>{
        return new mongoID(val);
    });
    
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{          
        throw {
            status : 'deleteOrder_db_connect',
            err_name : err.name,
            err_msg  : err.message 
        };            
    });
     
    let member = await check_member(data.member_id).catch(err=>{
             
            if(err.status) throw err;        
            throw {
                status : 'deleteOrder_db_findMember',
                err_name : err.name,
                err_msg  : err.message 
            }; 
        });
         
    if(!member){
        throw {
            status : 'deleteOrder_db_findMember',
            err_name : 'NoThisMember',
            err_msg  :'plz check your token!!!!' 
        }; 
    }            
     
    let o_col = await db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_order);
    let p_col = await db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_product);

    let order_data = await o_col.find({
        _id : { $in : order_list },
        isPaid : { $eq : false }        
    }).toArray().catch(err=>{          
        throw {
            status : 'deleteOrder_db_findOrder',
            err_name : err.name,
            err_msg  : err.message 
        };            
    });
   
    //數量不同,代表有付款的或ID錯誤
    if(order_data.length !== order_data.length){
        throw {
            status : 'deleteOrder_db_findOrder',
            err_name : 'wrong id or has paid',
            err_msg  : 'check your order!!!!!' 
        };  
    }

    //Map_先復原product的數量
    order_data.map((val)=>{
       p_col.findOneAndUpdate({
            product_id : val.product_id
        },{
            $inc : {
                quantity : val.quantity
            }
        }).catch(err=>{          
            throw {
                status : 'deleteOrder_db_repairProductQuantity',
                err_name : err.name,
                err_msg  : err.message 
            };            
        });
    });

  
    await o_col.deleteMany({
        _id : { $in : order_list }
    }).catch(err=>{
        throw {
            status : 'deleteOrder_db_deleteAll',
            err_name : err.name,
            err_msg  : err.message 
        }; 
    });
   
    
    await db_connect.getDB().close().catch(err=>{
        throw {
            status : 'deleteOrder_db_close',
            err_name : err.name,
            err_msg  : err.message 
        };   
    });
    delete_result = {
        status : 'deleteOrder',
        msg    : 'done'
    }

    return delete_result ;
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