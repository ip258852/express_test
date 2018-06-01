let db_connect = require('../service/db_connect');
let config = require('../../config/config');
let mail = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
      user: 'ip258852@gmail.com',
      pass: 'b0976797722'
    }
});

module.exports = async (query) => {
    let q_arr = query.split(',').map(val=>{
        return new db_connect.mongoID(val);
    });

    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        throw {
            status : 'payOrder_db_connect',
            err_name : err.name,
            err_msg  : err.message 
        };       
    });

    let o_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_order);
    q_arr.map(val=>{
        o_col.findOneAndUpdate({
            _id : val,        
        },{
            $set : {
                isPaid : true ,
                update_date : new Date()
            }
        }).catch(err=>{
            throw {
                status : 'payOrder_db_changePaid',
                err_name : err.name,
                err_msg  : err.message 
            };       
        });
    });

    await mail.sendMail({
        from: 'ip258852@gmail.com',
        to: 'ip258852@gmail.com',
        subject: 'mail test',
        text: 'already pay'
    }).catch(err=>{
        console.log(err);
    })

    await db_connect.getDB().close().catch(err=>{
        throw {
            status : 'payOrder_db_close',
            err_name : err.name,
            err_msg  : err.message 
        };   
    });

    return {
        status : 'payOrder',
        msg : 'already pay'
    }
}