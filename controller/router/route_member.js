let router = require('express').Router();
let member_m = require('../../model/member/index');

router.route('/members').
    post(member_m.register).
    put(member_m.update).
    get(member_m.userData);

router.route('/login').
    post(member_m.login);
 
module.exports = router ;


/*

    新增會員
    /  members post
    取得會員
    /  members get
    更改會員
    /  members put
    
    登入
    /login post
 
*/