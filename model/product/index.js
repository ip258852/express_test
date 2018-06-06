let all = require('./model_product');

module.exports = {
    list_product : all.list_product,
    list_order   : all.list_order,
    create_order : all.create_order,
    update_order : all.update_order,
    pay_order    : all.product_pay
}