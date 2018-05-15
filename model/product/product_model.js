let list = require('./getList');
let order = require('./order');
let order_list = require('./getOrder');
let order_update = require('./updateOrder');
let order_delete = require('./deleteOrder');
let order_pay = require('./payOrder');
let verify_t = require('../service/verify_token');
let mongoOID = require('mongodb').ObjectID;
let db_connect = require('../service/db_connect');
let config = require('../../config/config');

exports.product_getlist =  (req,res) =>{
    list().then((resolved)=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });  
}

exports.product_order = (req,res) =>{
    let token = req.headers['token'];
    const token_msg = verify_t(token);
     
    if( token_msg.err_name || token_msg.data===null) res.status(400).json(token_msg)
    else if(!req.body.products || !req.body.quantity){
        res.status(400).json({ 
            status : 'check_query',
            err_name : 'no query items!!',
            err_msg  : `check your query[pruducts,quantity] : [${req.body.products},${req.body.quantity}]`
        });
    }
    else {
        const order_data = {
            member_id : token_msg.data,
            products  : req.body.products,
            quantity  : req.body.quantity
        }
         
        order(order_data).then(resolved=>{
            res.json(resolved);
        }).catch(err=>{
            res.status(400).json(err);
        });
    }
}

exports.product_getOrder = (req,res)=>{
    let token = req.headers['token'];
    const token_msg = verify_t(token);
    if(token_msg.err_name || token_msg.data===null) res.status(400).json(token_msg);
    const q = token_msg.data ;

    order_list(q).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}

exports.product_updateOrder = async (req,res)=>{
    let token = req.headers['token'];
    const token_msg = verify_t(token) ;
    if(token_msg.err_name || token_msg.data === null ){
        res.status(400).json(token_msg);
        return ;
    };
    
    const order_data = {
        token_msg,
        order_id : new mongoOID(req.body.order_id),
        product_id : parseInt(req.body.product_id),
        quantity : parseInt(req.body.quantity)
    }
    order_update(order_data).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}

exports.product_deleteOrder = (req,res)=>{
    let token = req.headers['token'];
    const token_msg = verify_t(token) ;
    if(token_msg.err_name || token_msg.data === null ){
        res.status(400).json(token_msg);
        return ;
    };
 
    const data = {
        member_id : token_msg.data,
        order_id  : req.body.order_id
    }
 
    order_delete(data).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}

exports.product_pay = (req,res)=>{
    order_pay(req.body.order_id).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    })
}   
 