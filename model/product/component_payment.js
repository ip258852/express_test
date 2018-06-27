const db_connect = require('../service/db_connect');
const config = require('../../config/config').mongo_config;
const timeFIX = require('../service/time_related');
const opay = require('opay_payment_nodejs');
 
module.exports = async (req) => {
          
    let o_col = req.DB.getCol(config.db,config.collection_order);
/*   
    let data = await o_col.find({
        member_id : req.session.email,
        isPaid    : false
    }).toArray().catch(err=>{console.log(err)});

    const totalPrice = data.map((ele)=> {
        return ele['totalPrice'];
    }).reduce((bef,aft)=>{
        return bef+aft;
    })

    const base_param = {
        MerchantTradeNo: '30a0dte7fae1bb7d9c99', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
        MerchantTradeDate: '2019/02/13 15:45:30', //ex: 2017/02/13 15:45:30
        TotalAmount: totalPrice.toString(),
        TradeDesc: `${req.session.email}的訂單`,
        ItemName: '測試商品等',
        ReturnURL: 'https://localhost:3001/test',        
    };   
    const create = new opay();
    return create.payment_client.aio_check_out_atm(parameters = base_param);
*/
    let data = await o_col.updateMany({
        member_id : req.session.email,
        isPaid    : false
    },{
        $set : {
            isPaid : true ,
            update_date : timeFIX.whatTime()
        }
    }).catch(err=>{
        throw {
            status : 'payOrder_db_changePaid',
            err_name : err.name,
            err_msg  : err.message 
        };       
    });     
    
    return data;

}