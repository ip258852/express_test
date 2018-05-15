let db_connect = require('../service/db_connect');
let config = require('../../config/config');

exports.format  = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = re.test(email);
    return result;
}

exports.multi =  async (email) => { 
    let multi_result = {};

    await db_connect.dbConnect(config.mongo_config.url).catch(err=>{
        multi_result.status = 'emailMultiCheck_db_connect';
        multi_result.err_name = err.name ;
        multi_result.err_msg = err.message ;
        throw multi_result ;            
    }); 

    let member_col =  db_connect.getDB().db(config.mongo_config.db).collection(config.mongo_config.collection_member);
    
    await member_col.findOne({email : email}).then(r=>{
        if(r){
            multi_result.status = 'emailMultiCheck_db_search' ;
            multi_result.msg = 'Email has already registered' ;
            multi_result.isRegister = true ;
        }else{
            multi_result.status = 'emailMultiCheck_db_search' ;
            multi_result.msg = 'Email has not already registered' ;
            multi_result.isRegister = false ;
        }        
    }).catch(err=>{
        multi_result.status = 'emailMultiCheck_db_search';
        multi_result.err_name = err.name ;
        multi_result.err_msg = err.message ;
        throw multi_result ;   
    });
    
    await db_connect.getDB().close().catch(err=>{
        multi_result.status = 'getList_db_close';
        multi_result.err_name = err.name ;
        multi_result.err_msg = err.message ;        
        throw get_result ; 
    });
    
    return multi_result ;
}