class Order{
    // Order 工廠
    static get Order(){
        return new Order();
    }

    constructor(){
        this.DB = require('../service/db_connect');
        this.configMongo = require('../../config/config').mongo_config;
        this.colMember = this.DB.getCol(this.configMongo.db,this.configMongo.collection_member);
        this.colOrder = this.DB.getCol(this.configMongo.db,this.configMongo.collection_member);
        this.colProduct = this.DB.getCol(this.configMongo.db,this.configMongo.collection_product);      
        this.service = require('../service/index');
    }

    /**
     * 建立訂單
     * @param   {data} 訂單資料.
     * @returns {obStatus} 結果.
    */
    async orderCreate(data){
        
        const products = data.product_id;
        const quantity = data.product_cnt;
        const products_db = new Array();      
         
        // 查看產品清單
        for(let ele in products ){    

            // 找產品
            let result = await this.colProduct.find({ 
                product_id : parseInt(products[ele])
            }).toArray().catch(err=>{    
                throw {
                    status   : 'createOrder_product_view',
                    err_name : err.name,
                    err_msg  : err.message
                } ; 
            });
            
            // 判斷訂單的產品資訊,數量不符,退回
            if(quantity[ele] <= result[0].quantity){
                products_db.push(result[0])
            }else{
                throw {
                    status   : 'createOrder_product_view',
                    err_name : '數量不符合',
                    err_msg  : '再來一次'
                } ; 
            }
        }

        // 新增訂單資訊
        for(let ele in products ){
        
            // 訂單資料封裝    
            const order = {           
                member_id  : data.member,                
                product_id : products[ele],
                product_name : products_db[ele].name,
                price      : products_db[ele].price,
                quantity   : quantity[ele],
                totalPrice : (products_db[ele].price) * quantity[ele],
                isPaid     : false ,
                create_date: this.service.timeFix.whatTime(),
                update_date: ''
            }

            // 插入訂單
            await this.colOrder.insertOne(order).catch(err=>{
                throw {
                    status   : 'createOrder_db_insertOrder',
                    err_name : err.name,
                    err_msg  : err.message
                } ;          
            });

            // 減少庫存
            await this.colProduct.findOneAndUpdate({
                product_id : products[ele]
            },{ 
                $inc :  { quantity : - quantity[ele]},
                $set :  { update_date : this.service.timeFix.whatTime() }
            }).catch(err=>{            
                throw {
                    status   : 'createOrder_db_decProducts',
                    err_name : err.name,
                    err_msg  : err.message
                } ;           
            });
        }
        
        return { status : '訂單新增成功' };
    }

    async orderListAll(data){         
 
        // 查詢訂單資料
        let res  = await this.colMember.find({ 
            member_id : data.email,
            isPaid    : data.status ? true : false 
        }).toArray().catch(err=>{         
            throw {
                status   : 'listOrders_db_orderView',
                err_name : err.name,
                err_msg  : err.message
            } ;   
        });
        
        // 回傳所需的資料
        return res.map((val)=>{            
            return {
                order_id    : val._id,
                totalPrice  : val.totalPrice,
                isPaid      : val.isPaid,
                product_id  : val.product_id,
                quantity    : val.quantity,
                create_date : val.create_date,
                price       : val.price ,
                name        : val.product_name
            }
        });   
    }

    async orderUpdate(data){
        // 改個封裝資料
        data.order_id = data.order_id.map(val=>{
            return new this.DB.mongoID(val);
        });   
       
        // 更改資料而已
        // to-do 等待重購
        await data.order_id.forEach(async (ele,ind) => {
            
            // 先判斷比原始訂單與產品狀況
            let pre_data = await this.colOrder.findOne({ _id : ele }).catch(err=>{
                throw err ;
            });
            
            let pre_pro  = await this.colProduct.findOne({ product_id : pre_data.product_id}).catch(err=>{
                throw err;
            });
            
            let update_cnt =   data.update_cnt[ind];
            let pre_data_cnt = pre_data.quantity;
            let pre_pro_cnt  = pre_pro.quantity;
            
            // 判斷產品數量與當初的訂貨數量
            if( update_cnt > pre_data_cnt && ( update_cnt - pre_data_cnt ) <= pre_pro_cnt ){
                
                //更改訂單
                await this.colOrder.findOneAndUpdate({
                    _id  : ele,                
                },{
                    $set : {
                        quantity   : update_cnt,
                        totalPrice : update_cnt*pre_data.price,
                        update_date: this.service.timeFix.whatTime()
                    }
                }).catch(err=>{
                    throw err;
                });

                //更改產品資料                
                await this.colProduct.findOneAndUpdate({
                    product_id : pre_data.product_id
                },{
                    $inc : { 
                        quantity : -(update_cnt-pre_data_cnt)
                    },
                    $set : {                     
                        update_date : this.service.timeFix.whatTime()
                    }
                }).catch(err=>{
                    throw err;
                });

            }else if( update_cnt < pre_data_cnt ){
                
                //更改訂單
                await this.colOrder.findOneAndUpdate({
                    _id  : ele,                
                },{
                    $set : {
                        quantity   : update_cnt,
                        totalPrice : update_cnt*pre_data.price,
                        update_date: this.service.timeFix.whatTime()
                    }
                }).catch(err=>{
                    throw err;
                });
                
                //更改產品
                await this.colProduct.findOneAndUpdate({
                    product_id : pre_data.product_id
                },{
                    $inc : { 
                        quantity : -(update_cnt-pre_data_cnt)
                    },
                    $set : {                     
                        update_date : this.service.timeFix.whatTime()
                    }
                }).catch(err=>{
                    throw err;
                });

            }else{
                return ;
            }
                        
            if(ind==data.order_id.length-1){
                return 'OK'       
            }
        });
        
        return {
            status : 'Update Ok!'
        } ;
    }

    async orderDelte(data){

        const id = new this.DB.mongoID(data);

        const order = await this.colOrder.findOne({ _id : id}).catch( err=>{throw err} );
        
        await this.colProduct.update({ 
            product_id : order.product_id 
        },{
            $inc : {
                quantity : order.quantity
            }
        }).catch( err=>{throw err} );
        
        const  ans = await this.colOrder.deleteOne({ _id : id }).catch( err=>{throw err} );
    
        return ans.result.n ==1 ? 'yes' : 'No';
    }
    
    async orderPayAll(data){
 
        let order = await this.colOrder.updateMany({
            member_id : data,
            isPaid    : false
        },{
            $set : {
                isPaid : true ,
                update_date : this.service.timeFix.whatTime()
            }
        }).catch(err=>{
            throw {
                status : 'payOrder_db_changePaid',
                err_name : err.name,
                err_msg  : err.message 
            };       
        });     
        
        return order;    
    }
}

module.exports = Order ;