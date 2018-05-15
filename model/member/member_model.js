let jwt = require('jsonwebtoken');

let register = require('./register');
let login = require('./login');
let update = require('./update');

let checkEmail = require('../service/email_check');
let cryption  = require('../service/encryption');
let verify_t = require('../service/verify_token');

let config = require('../../config/config');

exports.member_register = async (req,res)=>{
    if(!checkEmail.format(req.body.email)){
        res.json({
            status : 'register_email_format',       
            err_name : 'format is wrong'
        })
    }

    const member_data = {
        email : req.body.email ,
        name  : req.body.name  ,
        pwd   : cryption(req.body.pwd),
        create_date : whatTime(),
        update_date : ''
    };
 
    let ress = await checkEmail.multi(req.body.email).catch(err=>{
        res.status(400).json(err);
    });

    if(ress.isRegister){
        delete ress.isRegister ;
        res.json(ress);
    }else{
        await register(member_data).then(resolved=>{
            res.json(resolved);
        }).catch(err=>{
            res.status(400).json(err);
        });
    }
      
}

exports.member_login  = async (req,res)=>{
    const member_data = {
        email : req.body.email ,       
        pwd   : cryption(req.body.pwd)
    };

    let resolved = await login(member_data).catch(err=>{
        res.status(400).json(err);
    });

    if(resolved.data){
        let token = jwt.sign({            
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
            data: resolved.data._id
        },config.privateKey);      
        console.log(token)   ;
        res.setHeader('token',token);
        res.json({ status : 'login' , msg : '登入成功' });
    }else{
        res.json({ status : 'login' , msg : '無此人,請重新註冊或重新登入' });
    }     
}

exports.member_update = (req,res)=>{
    let token = req.headers['token'];
    let token_msg = verify_t(token);
    if(token_msg.err_name) res.status(400).json(token_msg);
    else {
        const member_data = {
            _id   : token_msg.data ,
            email : req.body.email ,
            name  : req.body.name  ,
            pwd   : cryption(req.body.pwd),
            update_date : whatTime()
        };
        update(member_data).then((resolved)=>{
            res.json(resolved);
        }).catch(err=>{
            res.status(400).json(err);
        });
    }          
}

const whatTime = ()=>{
    let date = new Date();
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}