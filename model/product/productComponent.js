class Product{
    // Product工廠
    static get Product(){
        return new Product();
    }

    constructor(){
        this.DB = require('../service/db_connect');
        this.configMongo = require('../../config/config').mongo_config;   
        this.colProduct = this.DB.getCol(this.configMongo.db,this.configMongo.collection_product);      
    }

    /**
     * 列出全部產品
     * @returns {products} 回傳產品的資料
    */
    async productListAll(){        

        // 取得產品
        const product = await this.colProduct.find({}).toArray().catch(err=>{              
            throw {
                status   : 'listProducts_findList',
                err_name : err.name,
                err_msg  : err.message
            } ;    
        });
    
        // 回傳需要的產品資料
        return product.map((val)=>{
            return {
                product_id : val.product_id,
                name       : val.name,
                price      : val.price,
                quantity   : val.quantity,
                remark     : val.remark
            }
        });   
    }
}

module.exports = Product ;