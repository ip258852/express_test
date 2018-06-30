let router = require('express').Router();
let p = require('../../model/product/productModel').Model;

router.route('/products').
    get(p.listAll);

module.exports = router ;

/*

    取得產品
    /products get
    
*/