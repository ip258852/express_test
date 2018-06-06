let db_connect = require('../service/db_connect');
let config = require('../../config/config').mongo_config;
let timeFIX = require('../service/time_related');
let mail = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
      user: 'ip753357@gmail.com',
      pass: 'a123456!654321'
    }
});

module.exports = async (query) => {
   
    await db_connect.dbConnect(config.url).catch(err=>{
        throw {
            status : 'payOrder_db_connect',
            err_name : err.name,
            err_msg  : err.message 
        };       
    });

    let o_col = db_connect.getCol(config.db,config.collection_order);

     
    let data = await o_col.updateMany({
        member_id : query,
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

    await mail.sendMail({
        from: 'ip258852@gmail.com',
        to: 'ip258852@gmail.com',
        subject: '君の訂單',
        text: `您的訂單已繳費,詳細資料不告訴你哩`
    }).catch(err=>{
        console.log(err);
    })

    await db_connect.closeDB().catch(err=>{
        throw {
            status : 'payOrder_db_close',
            err_name : err.name,
            err_msg  : err.message 
        };   
    });

    return data
}