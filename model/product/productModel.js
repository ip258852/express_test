const Product = require('./productComponent');

class Model{
    
    static get Model() {
        return new Model();
    }    

    listAll(req,res){
        const product = Product.Product;
        product.productListAll().then((resolved)=>{    
            res.json(resolved);
        }).catch(err=>{
            res.status(400).json(err);
        });  
    }     
}
 
module.exports = Model ;