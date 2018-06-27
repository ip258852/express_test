let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;
let service = require('../service/index');

module.exports = async(req,data)=>{
    
    // 改個封裝資料
    data.order_id = data.order_id.map(val=>{
        return new req.DB.mongoID(val);
    })    

    let o_col = req.DB.getCol(config.db,config.collection_order);    
    let p_col = req.DB.getCol(config.db,config.collection_product);
       
    // 更改資料而已
    await data.order_id.forEach(async (ele,ind) => {
        
        // 先判斷比原始訂單與產品狀況
        let pre_data = await o_col.findOne({ _id : ele }).catch(err=>{
            throw err ;
        });
        
        let pre_pro  = await p_col.findOne({ product_id : pre_data.product_id}).catch(err=>{
            throw err
        });
        
        let update_cnt = data.update_cnt[ind];
        let pre_data_cnt = pre_data.quantity;
        let pre_pro_cnt =pre_pro.quantity;
        
        // 判斷產品數量與當初的訂貨數量
        if( update_cnt>pre_data_cnt && ( update_cnt-pre_data_cnt )<=pre_pro_cnt ){
            
            //更改訂單
            await o_col.findOneAndUpdate({
                _id  : ele,                
            },{
                $set : {
                    quantity   : update_cnt,
                    totalPrice : update_cnt*pre_data.price,
                    update_date: service.timeFix.whatTime()
                }
            }).catch(err=>{
                throw err;
            });
            //更改產品
             
            await p_col.findOneAndUpdate({
                product_id : pre_data.product_id
            },{
                $inc : { 
                    quantity : -(update_cnt-pre_data_cnt)
                },
                $set : {                     
                    update_date : service.timeFix.whatTime()
                }
            }).catch(err=>{
                throw err;
            });

        }else if( update_cnt<pre_data_cnt ){
            //更改訂單
            await o_col.findOneAndUpdate({
                _id  : ele,                
            },{
                $set : {
                    quantity   : update_cnt,
                    totalPrice : update_cnt*pre_data.price,
                    update_date: service.timeFix.whatTime()
                }
            }).catch(err=>{
                throw err;
            });
            //更改產品
            await p_col.findOneAndUpdate({
                product_id : pre_data.product_id
            },{
                $inc : { 
                    quantity : -(update_cnt-pre_data_cnt)
                },
                $set : {                     
                    update_date : service.timeFix.whatTime()
                }
            }).catch(err=>{
                throw err;
            });
        }else{
            return ;
        }
        
         
        if(ind==data.order_id.length-1){
            return 'OK'       
        }
    });
        
    return {
        status : 'Update Ok!'
    } ;
}


 




