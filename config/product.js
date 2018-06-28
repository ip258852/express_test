const time = require('../model/service/time_related')

module.exports = [{
    product_id : 1,
    name : '逗貓棒',
    price : 12 ,
    quantity : 78,
    remark : '給貓用',
    create_date :  time.whatTime(),
    update_date : ''
},{
    product_id : 2,
    name : '潔牙膏',
    price : 5 ,
    quantity : 78,
    remark : '給狗用',
    create_date :  time.whatTime(),
    update_date : ''
},{
    product_id : 3,
    name : '睡衣',
    price : 500 ,
    quantity : 78,
    remark : '給人用',
    create_date :  time.whatTime(),
    update_date : ''
}];