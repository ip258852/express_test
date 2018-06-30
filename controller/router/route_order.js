let router = require('express').Router();
let o = require('../../model/order/orderModel').Model;

router.route('/orders').
    post(o.create).
    get(o.listAll).
    put(o.update).
    delete(o.delete);

router.route('/payments').
    get(o.payAll);

module.exports = router ;

/*
    刪除訂單
    / orders delete
    取得訂單
    /  orders get
    新增訂單
    /  orders post
    更新訂單
    /  orders put

    訂單繳費
    /  payments get    
*/