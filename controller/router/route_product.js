let router = require('express').Router();
let product_m = require('../../model/product/index');

router.route('/products').
    get(product_m.list_product);

router.route('/orders').
    post(product_m.create_order).
    get(product_m.list_order).
    put(product_m.update_order).
    delete(product_m.delete_order);

/* 
router.route('/payment').
    post(product_m.payment);
*/
module.exports = router ;

/*

    取得產品
    /products get

    刪除訂單
    / orders delete
    取得訂單
    /  orders get
    新增訂單
    /  orders post
    更新訂單
    /  orders put

    付款
    /payment post
 
*/