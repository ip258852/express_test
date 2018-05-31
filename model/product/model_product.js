
 
let order_update = require('./updateOrder');
let order_delete = require('./deleteOrder');
let order_pay = require('./payOrder');

let config = require('../../config/config');
let index = require('./index_component');

// 產品列出
exports.list_product =  (req,res) =>{

    // 列出清單
    index.list_product().then((resolved)=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });  
}

// 新增訂單
exports.create_order = (req,res) =>{
    
    let product_id  = new Array() ;
    let product_cnt = new Array() ;

    // 判斷是否為客戶
    if(!req.session.email){
        res.render('index');
        return ;
    }

    // 資料封裝
    for(let i in req.body){
        product_id.push(parseInt(i));       
        product_cnt.push(parseInt(req.body[i]));
    }

    //判斷資料是否有新增
    if(product_id.length ==0){
        res.status(400).end();
        return;
    }

    // 資料封裝
    const data = {
        member      : req.session.email,
        product_id  : product_id,
        product_cnt : product_cnt
    }
        
    // 新增訂單
    index.create_order(data).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    });
}

// 查看訂單
exports.list_order = (req,res)=>{

    // 基本判斷
    if(!req.session.email){
        res.redirect('/');
        return ;
    }
    
    // 列出清單
    index.list_order(req.session.email).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });
}

exports.product_updateOrder = async (req,res)=>{
    /*
    
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
    });*/
}

exports.product_deleteOrder = (req,res)=>{
    /*
 
    const data = {
        member_id : token_msg.data,
        order_id  : req.body.order_id
    }
 
    order_delete(data).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        res.status(400).json(err);
    });*/
}

exports.product_pay = (req,res)=>{
    order_pay(req.body.order_id).then(resolved=>{
        res.json(resolved);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    })
}   
 