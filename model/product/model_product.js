const config  = require('../../config/config');
const index   = require('./index_component');
const service = require('../service/index');
 

// 產品列出
exports.list_product =  (req,res) =>{

    index.list_product(req).then((resolved)=>{    
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
    if(product_id.length == 0){         
    
        res.status(400).end('沒有更新資訊');
        return;
    }

    // 資料封裝
    const data = {
        member      : req.session.email,
        product_id  : product_id,
        product_cnt : product_cnt
    }
        
    // 新增訂單
    index.create_order(req,data).then(resolved=>{                 
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
    
    // 封裝資料
    const data = {
        email  : req.session.email,
        status : parseInt(req.query.status)
    }

    // 列出清單
    index.list_order(req,data).then(resolved=>{        
        res.json(resolved);
    }).catch(err=>{        
        res.status(400).json(err);
    });
}

// 更新訂單
exports.update_order = async (req,res)=>{
    
    let order_id    = new Array() ;
    let update_cnt  = new Array() ;    

    // 判斷是否為客戶
    if(!req.session.email){
        res.render('index');
        return ;
    } 
          
    // 封裝資料
    for(let i in req.body){
        order_id.push(i);
        update_cnt.push(parseInt(req.body[i]))
    }

    //判斷資料是否有新增
    if(order_id.length == 0){             
        res.status(400).end('沒有更新資訊');
        return;
    }

    // 封裝資料
    const data = {
        email      : req.session.email,
        order_id   : order_id ,
        update_cnt : update_cnt        
    }

    index.update_order(req,data).then(resolved=>{      
        res.json(resolved);
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err);
    });
}

// 假的訂單出貨
exports.product_pay = (req,res)=>{
   
    index.payment(req).then(resolved=>{                
        res.send(resolved)
    }).catch(err=>{    
        console.log(err)    
        res.status(400).json(err);
    });
}   

 
exports.delete_order = (req,res)=>{
    
    // 判斷是否為客戶
    if(!req.session.email){
        res.render('index');
        return ;
    } 
    
    index.delete_order(req,req.body.target).then(resolved=>{
        res.json('T');
    }).catch(err=>{
        res.status(400).json('E');
    });

} 
 
 