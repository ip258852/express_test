let list_product = require('./component_list_product');
let list_order   = require('./component_list_order');
let create_order = require('./componenet_create_order');
let update_order = require('./componenet_update_order');
let delete_order = require('./component_delete_order');
let payment      = require('./component_payment');

module.exports = { 
    list_product : list_product,
    list_order   : list_order,
    create_order : create_order,
    update_order : update_order,
    delete_order : delete_order,
    payment      : payment
}