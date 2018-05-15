let jwt = require('jsonwebtoken');
let mongoOID = require('mongodb').ObjectID;
let config = require('../../config/config');



module.exports =   (token) => {
    let result = { status : 'token_verify '};
    jwt.verify(token,config.privateKey,(err,decoded)=>{
        if(err){
            result.status = 'token_verfy';
            result.err_name = err.name ;
            result.err_msg = err.message ;
            return ;
        }
        else if( decoded.exp <  Math.floor(Date.now() / 1000) ){
            result.status = 'token_verfy';
            result.err_name = 'timeout' ;
            return ;
        }             
        
        result.data = new mongoOID(decoded.data);
        return ;
    });  
    return result;     
}
