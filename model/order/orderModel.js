const Order = require('./orderComponent');

class Model{
    
    static get Model() {
        return new Model();
    }    
    
    create(req,res){
        const order = new Order();

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
        order.orderCreate(data).then(resolved=>{                 
            res.json(resolved);
        }).catch(err=>{                    
            res.status(400).json(err);
        });
    }

    listAll(req,res){
        
        const order = new Order();

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
        order.orderListAll(data).then(resolved=>{        
            res.json(resolved);
        }).catch(err=>{        
            res.status(400).json(err);
        });
    }

    update(req,res){

        const order = new Order();
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
    
        order.orderUpdate(data).then(resolved=>{      
            res.json(resolved);
        }).catch(err=>{            
            res.status(400).json(err);
        });
    }

    delete(req,res){
        const order = new Order();
        
        // 判斷是否為客戶
        if(!req.session.email){
            res.render('index');
            return ;
        } 
        
        order.orderDelte(req.body.target).then(resolved=>{
            res.json('T');
        }).catch(err=>{
            console.log(err)
            res.status(400).json('E');
        });
    
    } 

    payAll(req,res){

        const order = new Order();
        
        order.orderPayAll(req.session.email).then(resolved=>{                
            res.send(resolved);
        }).catch(err=>{         
            console.log(err)        
            res.status(400).json(err);
        });
    }   
}
 
module.exports = Model ;