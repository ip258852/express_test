let router = require('express').Router();
let member_m = require('../../model/member/member_model');
router.route('/members').
    post(member_m.member_register).
    put(member_m.member_update);

router.route('/login').
    post(member_m.member_login);
 
module.exports = router ;
