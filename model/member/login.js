let db_connect = require('../service/db_connect');
let config = require('../../config/config');

module.exports = async(query) => {
    let login_result = { };
    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        login_result = { };
        login_result.status = 'login_db_connect';
        login_result.err_name = err.name ;
        login_result.err_msg = err.message ;
        throw login_result ;            
    }); 

    let member_col = db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_member);
    
    await member_col.findOne({ email : query.email , pwd : query.pwd }).then(resolved=>{
        login_result.status = 'login_db_research';
        login_result.data = resolved ;
    }).catch(err=>{
        login_result = { };
        login_result.status = 'login_db_research';
        login_result.err_name = err.name ;
        login_result.err_msg = err.message ;
        throw login_result ;
    });

    await db_connect.getDB().close().catch(err=>{
        login_result = { };
        login_result.status = 'login_db_close';
        login_result.err_name = err.name ;
        login_result.err_msg = err.message ;        
        throw login_result ; 
    });
    
    return login_result;
}