let router = require('express').Router();
let product_m = require('../../model/product/product_model');

router.route('/products').
    get(product_m.product_getlist);

router.route('/orders').
    get(product_m.product_getOrder).
    put(product_m.product_updateOrder).
    delete(product_m.product_deleteOrder).
    post(product_m.product_order);

router.route('/pay').
    post(product_m.product_pay);

module.exports = router ;