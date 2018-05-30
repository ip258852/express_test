let jwt = require('jsonwebtoken');
let mongoOID = require('mongodb').ObjectID;
let config = require('../../config/config');

module.exports =   (token) => {
    try {
        let data = jwt.verify(token,config.privateKey);
        console.log(data);
        if(data.exp<Math.floor(Date.now() / 1000)){
            console.log('過期');
        } 
        return new mongoOID(data.data);
    } catch (error) {
        console.log(error);
    }    
}
