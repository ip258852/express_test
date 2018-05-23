let router = require('express').Router();
let member_m = require('../../model/member/index');

router.route('/members').
    post(member_m.register).
    put(member_m.update);

router.route('/login').
    post(member_m.login);
 
module.exports = router ;
